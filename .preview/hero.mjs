// Measures the hero section box at several viewports. usage: node hero.mjs
const port = 9333;
const base = `http://127.0.0.1:${port}`;
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

const probe = `(() => {
  const s = document.querySelector('#top');
  const cs = getComputedStyle(s);
  const b = s.getBoundingClientRect();
  const img = document.querySelector('#top img');
  const ib = img.getBoundingClientRect();
  const grid = s.querySelector(':scope > div');
  const gb = grid.getBoundingClientRect();
  const h1 = s.querySelector('h1').getBoundingClientRect();
  return {
    section: { x: +b.left.toFixed(1), y: +b.top.toFixed(1), w: +b.width.toFixed(1), h: +b.height.toFixed(1) },
    padding: [cs.paddingTop, cs.paddingRight, cs.paddingBottom, cs.paddingLeft].join(' '),
    inner: { w: +gb.width.toFixed(1), h: +gb.height.toFixed(1) },
    image: { x: +(ib.left - b.left).toFixed(1), y: +(ib.top - b.top).toFixed(1), w: +ib.width.toFixed(1), h: +ib.height.toFixed(1) },
    h1: { x: +(h1.left - b.left).toFixed(1), w: +h1.width.toFixed(1), h: +h1.height.toFixed(1) },
    scrollWidth: document.documentElement.scrollWidth,
    innerWidth: window.innerWidth,
  };
})()`;

const out = {};
for (const [w, h, mobile] of [
  [1280, 720, false],
  [1440, 900, false],
  [1920, 1080, false],
  [1024, 768, false],
  [768, 900, false],
  [390, 844, true],
]) {
  await send("Emulation.setDeviceMetricsOverride", { width: w, height: h, deviceScaleFactor: 1, mobile });
  await sleep(500);
  const r = await send("Runtime.evaluate", { expression: probe, returnByValue: true });
  out[w] = r.result.value;
}
console.log(JSON.stringify(out, null, 2));
ws.close();
