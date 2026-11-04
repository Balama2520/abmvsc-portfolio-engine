/**
 * A tiny read-only static file server for the browser tests. Both the ZIP
 * smoke test and the responsive layout check need to serve the repository
 * over HTTP (the pages fetch their own config and assets), so the server
 * lives here once instead of in each test file.
 *
 * DEVELOPMENT ONLY. Nothing in this folder ships to users.
 */

import fs from "node:fs";
import http from "node:http";
import path from "node:path";

const MIME = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".ico": "image/x-icon",
  ".pdf": "application/pdf",
  ".xml": "application/xml",
  ".txt": "text/plain",
  ".webmanifest": "application/manifest+json",
};

/**
 * Serve `root` on an ephemeral port.
 * Resolves to { server, base }, where `base` is the origin to navigate to.
 */
export const serve = async (root) => {
  const server = http.createServer((req, res) => {
    const rel = decodeURIComponent(req.url.split("?")[0]).replace(/^\/+/, "") || "index.html";
    const file = path.join(root, rel);
    if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      res.writeHead(404);
      res.end("not found");
      return;
    }
    res.writeHead(200, { "Content-Type": MIME[path.extname(file)] || "application/octet-stream" });
    res.end(fs.readFileSync(file));
  });
  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  return { server, base: `http://127.0.0.1:${server.address().port}` };
};
