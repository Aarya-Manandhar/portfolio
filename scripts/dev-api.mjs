// scripts/dev-api.mjs — a tiny local server that runs api/chat.js, so you can develop the chat UI
// with plain `npm run dev` (no Vercel CLI needed).
//
//   node --env-file=.env.local scripts/dev-api.mjs        (leave it running in its own terminal)
//
// Your Vite dev server forwards /api/* to this server (see the proxy in vite.config.ts).
// In production, Vercel runs api/chat.js itself and this file is not used.

import http from "node:http";

const { default: handler } = await import("../api/chat.js");
const PORT = Number(process.env.DEV_API_PORT ?? 3001);
const MAX_BODY_BYTES = 20_000;

const server = http.createServer(async (req, res) => {
  const send = (code, payload) => {
    res.statusCode = code;
    res.setHeader("content-type", "application/json");
    res.end(JSON.stringify(payload));
  };

  if (!req.url?.startsWith("/api/chat")) return send(404, { error: "Not found" });

  let raw = "";
  for await (const chunk of req) {
    raw += chunk;
    if (raw.length > MAX_BODY_BYTES) return send(413, { error: "Body too large" });
  }

  let body = {};
  try {
    body = raw ? JSON.parse(raw) : {};
  } catch {
    return send(400, { error: "Invalid JSON" });
  }

  // Same shape Vercel gives the function: req.method / req.body and res.status().json()
  const adapter = {
    status(code) { res.statusCode = code; return this; },
    setHeader(name, value) { res.setHeader(name, value); },
    json(payload) { res.setHeader("content-type", "application/json"); res.end(JSON.stringify(payload)); },
  };

  try {
    const { default: handler } = await import(`../api/chat.js?t=${Date.now()}`);
    await handler({ method: req.method, body }, adapter);
  } catch (err) {
    console.error("handler crashed:", err);
    if (!res.writableEnded) send(500, { error: "Server error" });
  }
});

server.listen(PORT, () => console.log(`Dev API running at http://localhost:${PORT}/api/chat`));
