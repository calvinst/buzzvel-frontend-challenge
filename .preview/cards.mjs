// Measures the two hero cards at 1280. usage: node cards.mjs
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
await send("Emulation.setDeviceMetricsOverride", { width: 1280, height: 900, deviceScaleFactor: 1, mobile: false });
await sleep(1000);

const probe = `(() => {
  const wrap = document.querySelector('#top .relative.order-1');
  const wb = wrap.getBoundingClientRect();
  const cards = [...wrap.querySelectorAll(':scope > p')].map((p) => {
    const b = p.getBoundingClientRect();
    const cs = getComputedStyle(p);
    return {
      x: +(b.left - wb.left).toFixed(1),
      y: +(b.top - wb.top).toFixed(1),
      w: +b.width.toFixed(1),
      h: +b.height.toFixed(1),
      pad: [cs.paddingTop, cs.paddingRight, cs.paddingBottom, cs.paddingLeft].join(' '),
      gap: cs.columnGap,
      radius: cs.borderRadius,
      overflowX: p.scrollWidth > p.clientWidth ? 'content wider than box' : 'fits',
    };
  });
  return { frame: { w: +wb.width.toFixed(1), h: +wb.height.toFixed(1) }, cards };
})()`;

const r = await send("Runtime.evaluate", { expression: probe, returnByValue: true });
console.log(JSON.stringify(r.result.value ?? r.exceptionDetails, null, 2));
ws.close();
