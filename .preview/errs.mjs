// Collects console errors / page errors during a fresh load. usage: node errs.mjs
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
const events = [];
ws.onmessage = (e) => {
  const m = JSON.parse(e.data);
  if (m.id && pending.has(m.id)) {
    const { resolve, reject } = pending.get(m.id);
    pending.delete(m.id);
    m.error ? reject(new Error(JSON.stringify(m.error))) : resolve(m.result);
    return;
  }
  if (m.method === "Runtime.consoleAPICalled" && ["error", "warning"].includes(m.params.type)) {
    events.push({ type: m.params.type, text: m.params.args.map((a) => a.value ?? a.description).join(" ").slice(0, 400) });
  }
  if (m.method === "Runtime.exceptionThrown") {
    events.push({ type: "exception", text: JSON.stringify(m.params.exceptionDetails.exception?.description ?? "").slice(0, 400) });
  }
  if (m.method === "Log.entryAdded") {
    events.push({ type: "log:" + m.params.entry.level, text: m.params.entry.text.slice(0, 400) });
  }
};

const send = (method, params = {}) =>
  new Promise((resolve, reject) => {
    const mid = ++id;
    pending.set(mid, { resolve, reject });
    ws.send(JSON.stringify({ id: mid, method, params }));
  });

await send("Runtime.enable");
await send("Log.enable");
await send("Page.enable");
await send("Emulation.setDeviceMetricsOverride", { width: 1280, height: 900, deviceScaleFactor: 1, mobile: false });
await send("Page.navigate", { url: "http://localhost:3000/" });
await sleep(6000);

// scroll so lazy images and the whole page mount
await send("Runtime.evaluate", {
  expression: `(async () => { for (let y = 0; y < document.body.scrollHeight; y += 400) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 120)); } })()`,
  awaitPromise: true,
});
await sleep(2500);

console.log(events.length ? JSON.stringify(events, null, 2) : "no console errors/warnings");
ws.close();
