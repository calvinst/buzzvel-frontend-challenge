// Measures every section box at 1280. usage: node sections.mjs
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
await sleep(900);

const probe = `(() => {
  const names = ['#top', '#courses', '#featured', '#how', 'main section:nth-of-type(5)', '#people', '#contact', 'main section:nth-of-type(8)', 'footer'];
  const out = [];
  for (const el of document.querySelectorAll('main > section, footer')) {
    const b = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    out.push({
      id: el.id || el.className.split(' ').find((c) => c.startsWith('bg-')) || el.tagName.toLowerCase(),
      y: +(b.top + window.scrollY).toFixed(1),
      w: +b.width.toFixed(1),
      h: +b.height.toFixed(2),
      pad: [cs.paddingTop, cs.paddingRight, cs.paddingBottom, cs.paddingLeft].join(' '),
      border: cs.borderTopWidth + '/' + cs.borderBottomWidth,
    });
  }
  return out;
})()`;

const r = await send("Runtime.evaluate", { expression: probe, returnByValue: true });
if (r.exceptionDetails) {
  console.log("ERR", r.exceptionDetails.exception?.description);
} else {
  for (const s of r.result.value) console.log(JSON.stringify(s));
}
ws.close();
