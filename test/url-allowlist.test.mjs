import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { sanitizeUrl } = require("../url-allowlist.js");
const Pack = require("../pack.js");
const { parseConfigSource } = require("../setup.js");

test("url-allowlist: links allow http, https, mailto, tel and relative paths", () => {
  const allowed = [
    "http://example.com",
    "https://example.com/foo?bar=1#baz",
    "mailto:user@example.com",
    "tel:+1234567890",
    "#about",
    "index.html",
    "studio.html",
    "assets/resume.pdf"
  ];
  for (const url of allowed) {
    assert.equal(sanitizeUrl(url, "link"), url, `Expected ${url} to be allowed`);
  }
});

test("url-allowlist: images allow http, https, relative paths, and safe data URIs", () => {
  const allowed = [
    "http://example.com/avatar.png",
    "https://example.com/avatar.jpg",
    "assets/engineer-avatar.svg",
    "photo.png",
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
    "data:image/jpeg;base64,/9j/4AAQSkZJRg==",
    "data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA="
  ];
  for (const url of allowed) {
    assert.equal(sanitizeUrl(url, "image"), url, `Expected ${url} to be allowed for image`);
  }
});

test("url-allowlist: blocks javascript, vbscript, and data:text/html across bypass variations", () => {
  const bypasses = [
    "javascript:alert(1)",
    "JavaScript:alert(1)",
    "  javascript:alert(1)",
    "javascript :alert(1)",
    "java\tscript:alert(1)",
    "java\nscript:alert(1)",
    "java\rscript:alert(1)",
    "\x01javascript:alert(1)",
    "\x00javascript:alert(1)",
    "vbscript:msgbox(1)",
    "VBScript:msgbox(1)",
    "VbScRiPt:alert(1)",
    "data:text/html,<script>alert(1)</script>",
    "DATA:TEXT/HTML,<script>alert(1)</script>",
    "data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==",
    "//evil.com/xss.js"
  ];

  for (const url of bypasses) {
    assert.equal(sanitizeUrl(url, "link"), "", `Link bypass should be blocked: ${JSON.stringify(url)}`);
    assert.equal(sanitizeUrl(url, "image"), "", `Image bypass should be blocked: ${JSON.stringify(url)}`);
  }
});

test("url-allowlist: pack.js shares the identical sanitizeUrl function", () => {
  assert.equal(typeof Pack.sanitizeUrl, "function");
  assert.equal(Pack.sanitizeUrl("javascript:alert(1)", "link"), "");
  assert.equal(Pack.sanitizeUrl("https://example.com", "link"), "https://example.com");
});

test("url-allowlist: generator validates against unsafe URLs and names the bad field", () => {
  const maliciousConfig = `window.PORTFOLIO_CONFIG = {
    "personal": {
      "name": "Alex",
      "linkedin": "javascript:alert(1)"
    }
  };`;

  assert.throws(
    () => parseConfigSource(maliciousConfig),
    /Invalid field: "personal\.linkedin" has an unsafe URL\./
  );
});

