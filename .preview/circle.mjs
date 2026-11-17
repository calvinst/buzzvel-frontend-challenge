// Measures the mosaic circle. usage: node circle.mjs <out.png>
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
await sleep(700);
await send("Runtime.evaluate", {
  expression: `(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 300) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 90)); }
    document.querySelector('#people').scrollIntoView({ block: "start" });
    await new Promise(r => setTimeout(r, 2200));
  })()`,
  awaitPromise: true,
});
await sleep(900);

const probe = `(() => {
  const box = document.querySelector('#people [role="group"]');
  const bb = box.getBoundingClientRect();
  const c = box.querySelector(':scope > [aria-hidden]');
  const b = c.getBoundingClientRect();
  const cs = getComputedStyle(c);
  return {
    frame: { w: +bb.width.toFixed(1), h: +bb.height.toFixed(2) },
    circle: {
      x: +(b.left - bb.left).toFixed(2),
      y: +(b.top - bb.top).toFixed(2),
      w: +b.width.toFixed(2),
      h: +b.height.toFixed(2),
      radius: cs.borderRadius,
      bg: cs.backgroundColor,
    },
  };
})()`;

const r = await send("Runtime.evaluate", { expression: probe, returnByValue: true });
console.log(JSON.stringify(r.result.value ?? r.exceptionDetails, null, 2));

const shot = await send("Page.captureScreenshot", { format: "png" });
const fs = await import("node:fs");
fs.writeFileSync(out, Buffer.from(shot.data, "base64"));
ws.close();
