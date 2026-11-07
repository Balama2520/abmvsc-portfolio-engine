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

const HOST_ONLY = new Set(["_headers", "netlify.toml", "vercel.json", ".nojekyll", "package.json"]);

const deployedHeaders = (root) => {
  const source = fs.readFileSync(path.join(root, "_headers"), "utf8");
  const block = source.match(/\/\*\s*\n([\s\S]*?)(?:\n\s*\n|$)/);
  return Object.fromEntries(
    (block ? block[1] : "")
      .split(/\r?\n/)
      .map((line) => line.trim().match(/^([^:]+):\s*(.+)$/))
      .filter(Boolean)
      .map((match) => [match[1], match[2]])
  );
};

/**
 * Serve `root` on an ephemeral port.
 * Resolves to { server, base }, where `base` is the origin to navigate to.
 */
export const serve = async (root) => {
  const headers = deployedHeaders(root);
  const server = http.createServer((req, res) => {
    const rel = decodeURIComponent(req.url.split("?")[0]).replace(/^\/+/, "") || "index.html";
    const file = path.join(root, rel);
    if (HOST_ONLY.has(rel) || rel.startsWith("test/") || !file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      res.writeHead(404);
      res.end("not found");
      return;
    }
    res.writeHead(200, { ...headers, "Content-Type": MIME[path.extname(file)] || "application/octet-stream" });
    res.end(fs.readFileSync(file));
  });
  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  return { server, base: `http://127.0.0.1:${server.address().port}` };
};
