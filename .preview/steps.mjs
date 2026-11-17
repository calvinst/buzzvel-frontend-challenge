// Measures HowItWorks step icons + captures a clipped screenshot of that section.
// usage: node steps.mjs <out.png>
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
await send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 1200, deviceScaleFactor: 1, mobile: false });
await sleep(800);

const probe = `(() => {
  const ol = document.querySelector('#how ol');
  const items = [...ol.querySelectorAll('li')].map((li) => {
    const icon = li.querySelector('span[aria-hidden]');
    const ib = icon.getBoundingClientRect();
    const kids = [...icon.children].map((c) => {
      const b = c.getBoundingClientRect();
      return {
        cls: c.className,
        x: +(b.left - ib.left).toFixed(2),
        y: +(b.top - ib.top).toFixed(2),
        w: +b.width.toFixed(2),
        h: +b.height.toFixed(2),
        radius: getComputedStyle(c).borderRadius,
        transform: getComputedStyle(c).transform,
        bg: getComputedStyle(c).backgroundColor,
      };
    });
    return { icon: { x: +ib.left.toFixed(1), y: +ib.top.toFixed(1), w: +ib.width.toFixed(1), h: +ib.height.toFixed(1) }, kids };
  });
  const section = document.querySelector('#how').getBoundingClientRect();
  return { items, section: { x: section.left, y: section.top + window.scrollY, w: section.width, h: section.height } };
})()`;

const res = await send("Runtime.evaluate", { expression: probe, returnByValue: true });
const v = res.result.value;
console.log(JSON.stringify(v, null, 2));

const m = await send("Page.getLayoutMetrics");
const size = m.cssContentSize;
const sy = v.section.y;
const shot = await send("Page.captureScreenshot", {
  format: "png",
  captureBeyondViewport: true,
  clip: { x: 0, y: sy, width: size.width, height: 400, scale: 2 },
});
const fs = await import("node:fs");
fs.writeFileSync(out, Buffer.from(shot.data, "base64"));
console.log("wrote", out);
ws.close();
