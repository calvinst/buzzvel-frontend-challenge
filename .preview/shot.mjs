// Screenshots via CDP: node shot.mjs <w> <h> <mobile:0|1> <out.png> [fullPage:0|1]
const port = 9333;
const base = `http://127.0.0.1:${port}`;
const [w, h, mobileArg, out, fullArg] = process.argv.slice(2);
const mobile = mobileArg === "1";
const full = fullArg === "1";
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
await send("Emulation.setDeviceMetricsOverride", {
  width: +w,
  height: +h,
  deviceScaleFactor: 1,
  mobile,
});
await sleep(800);
await send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "reduce" }] });
await sleep(300);

const params = { format: "png", captureBeyondViewport: full };
if (full) {
  const m = await send("Page.getLayoutMetrics");
  const size = m.cssContentSize;
  params.clip = { x: 0, y: 0, width: size.width, height: size.height, scale: 1 };
}
const shot = await send("Page.captureScreenshot", params);
const fs = await import("node:fs");
fs.writeFileSync(out, Buffer.from(shot.data, "base64"));
console.log("wrote", out);
ws.close();
