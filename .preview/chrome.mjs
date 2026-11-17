// Measures header + hero boxes. usage: node chrome.mjs
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
  const h = document.querySelector('header');
  const hb = h.getBoundingClientRect();
  const hcs = getComputedStyle(h);
  const bar = h.querySelector('div > div');
  const barB = bar.getBoundingClientRect();
  const barCs = getComputedStyle(bar);
  const inner = bar.parentElement;
  const iB = inner.getBoundingClientRect();
  const iCs = getComputedStyle(inner);
  const logo = h.querySelector('a').getBoundingClientRect();
  const s = document.querySelector('#top').getBoundingClientRect();
  return {
    header: { w: +hb.width.toFixed(1), h: +hb.height.toFixed(1), borderBottom: hcs.borderBottomWidth },
    content: { x: +(iB.left + parseFloat(iCs.paddingLeft)).toFixed(1), w: +(iB.width - parseFloat(iCs.paddingLeft) - parseFloat(iCs.paddingRight)).toFixed(1), padding: iCs.paddingLeft + ' / ' + iCs.paddingRight },
    barHeight: +barB.height.toFixed(1),
    logo: { x: +logo.left.toFixed(1), y: +logo.top.toFixed(1), h: +logo.height.toFixed(1) },
    hero: { y: +(s.top + window.scrollY).toFixed(1), h: +s.height.toFixed(1) },
    scrollWidth: document.documentElement.scrollWidth,
    innerWidth: window.innerWidth,
  };
})()`;

const out = {};
for (const [w, h] of [
  [1280, 720],
  [1440, 900],
  [768, 900],
]) {
  await send("Emulation.setDeviceMetricsOverride", { width: w, height: h, deviceScaleFactor: 1, mobile: false });
  await sleep(600);
  const r = await send("Runtime.evaluate", { expression: probe, returnByValue: true });
  out[w] = r.exceptionDetails ? { error: r.exceptionDetails.exception?.description ?? r.exceptionDetails.text } : r.result.value;
}
console.log(JSON.stringify(out, null, 2));
ws.close();
