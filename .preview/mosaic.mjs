// Inspects the People mosaic. usage: node mosaic.mjs <out.png>
const port = 9333;
const base = `http://127.0.0.1:${port}`;
const out = process.argv[2];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function target() {
  for (let i = 0; i < 60; i++) {
    try {
      const list = await (await fetch(`${base}/json/list`)).json();
      const page = list.find((t) => t.type === "page" && t.webSocketDebuggerUrl);
      if (page) return page;
    } catch {}
    await sleep(250);
  }
  throw new Error("no CDP page target");
}

const ws = new WebSocket((await target()).webSocketDebuggerUrl);
await new Promise((r, j) => {
  ws.onopen = r;
  ws.onerror = j;
});
let id = 0;
const pending = new Map();
ws.onmessage = (e) => {
  const m = JSON.parse(e.data);
  if (m.id && pending.has(m.id)) {
    const { resolve, reject } = pending.get(m.id);
    pending.delete(m.id);
    m.error ? reject(new Error(JSON.stringify(m.error))) : resolve(m.result);
  }
};
const send = (method, params = {}) =>
  new Promise((resolve, reject) => {
    const mid = ++id;
    pending.set(mid, { resolve, reject });
    ws.send(JSON.stringify({ id: mid, method, params }));
  });

await send("Page.enable");
await send("Runtime.enable");
await send("Emulation.setDeviceMetricsOverride", { width: 1280, height: 900, deviceScaleFactor: 1, mobile: false });
await sleep(800);

// scroll through the page so lazy images load
await send("Runtime.evaluate", {
  expression: `(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 400) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); }
    window.scrollTo(0, 0);
    await new Promise(r => setTimeout(r, 1200));
  })()`,
  awaitPromise: true,
});
await sleep(1500);

const probe = `(() => {
  const ul = document.querySelector('ul[aria-label="International students and teachers"]');
  const b = ul.getBoundingClientRect();
  const tiles = [...ul.querySelectorAll('li')].slice(0, 12).map((li) => {
    const r = li.getBoundingClientRect();
    const img = li.querySelector('img');
    return {
      x: +(r.left - b.left).toFixed(1),
      y: +(r.top - b.top).toFixed(1),
      w: +r.width.toFixed(1),
      h: +r.height.toFixed(1),
      imgLoaded: img ? img.complete && img.naturalWidth > 0 : null,
      imgNat: img ? img.naturalWidth + 'x' + img.naturalHeight : null,
    };
  });
  return {
    mosaic: { x: +b.left.toFixed(1), y: +(b.top + window.scrollY).toFixed(1), w: +b.width.toFixed(1), h: +b.height.toFixed(2) },
    tiles,
    peopleSection: (() => { const s = document.querySelector('#people').getBoundingClientRect(); return { y: +(s.top + window.scrollY).toFixed(1), h: +s.height.toFixed(1) }; })(),
    contentGap: getComputedStyle(document.querySelector('#people > div')).gap,
  };
})()`;

const r = await send("Runtime.evaluate", { expression: probe, returnByValue: true });
console.log(JSON.stringify(r.result.value ?? r.exceptionDetails, null, 2));

const m = await send("Page.getLayoutMetrics");
const v = r.result.value;
const shot = await send("Page.captureScreenshot", {
  format: "png",
  captureBeyondViewport: true,
  clip: { x: 0, y: v.peopleSection.y, width: 1280, height: v.peopleSection.h, scale: 1 },
});
const fs = await import("node:fs");
fs.writeFileSync(out, Buffer.from(shot.data, "base64"));
console.log("wrote", out);
ws.close();
