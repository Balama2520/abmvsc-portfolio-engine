import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { parseConfigSource, validateConfig } = require("../setup.js");

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (f) => fs.readFileSync(path.join(ROOT, f), "utf8");

test("config-parser: parses shipped config.js successfully", () => {
  const src = read("config.js");
  const cfg = parseConfigSource(src);
  assert.ok(cfg && typeof cfg === "object");
  assert.equal(cfg.personal.name, "Alex Rivera");
});

test("config-parser: round-trip keeps every field", () => {
  const src = read("config.js");
  const parsed1 = parseConfigSource(src);
  const serialized = `window.PORTFOLIO_CONFIG = ${JSON.stringify(parsed1, null, 2)};\n`;
  const parsed2 = parseConfigSource(serialized);
  assert.deepEqual(parsed1, parsed2);
});

test("config-parser: old-format files show guidance message", () => {
  const oldFiles = [
    `/* Portfolio Engine — config.js */\nwindow.PORTFOLIO_CONFIG = {\n  personal: {\n    name: "Alex"\n  }\n};`,
    `// Old comment\nwindow.PORTFOLIO_CONFIG = { "personal": { "name": "Alex" } };`,
    `window.PORTFOLIO_CONFIG = {\n  personal: {\n    name: "Alex"\n  }\n};`
  ];

  for (const old of oldFiles) {
    assert.throws(
      () => parseConfigSource(old),
      /This file uses the old format\. Re-export it from the generator\./
    );
  }
});

test("config-parser: schema validation names the bad field", () => {
  // Unknown section
  assert.throws(
    () => parseConfigSource(`window.PORTFOLIO_CONFIG = { "invalidSection": {} };`),
    /Invalid field: unknown section "invalidSection"/
  );

  // Unknown field in valid section
  assert.throws(
    () => parseConfigSource(`window.PORTFOLIO_CONFIG = { "personal": { "invalidField": "val" } };`),
    /Invalid field: unknown field "personal\.invalidField"/
  );

  // Non-array for list section
  assert.throws(
    () => parseConfigSource(`window.PORTFOLIO_CONFIG = { "projects": "not an array" };`),
    /Invalid field: "projects" must be an array/
  );
});

test("config-parser: malicious JavaScript inputs execute nothing and throw error", () => {
  globalThis.__flag_pwned = false;

  const maliciousPayloads = [
    // alert(1)
    `window.PORTFOLIO_CONFIG = { "personal": { "name": alert(1) } };`,
    // function call setting flag
    `window.PORTFOLIO_CONFIG = { "personal": { "name": (() => { globalThis.__flag_pwned = true; return "x"; })() } };`,
    // fetch()
    `window.PORTFOLIO_CONFIG = { "personal": { "name": fetch("https://evil.com") } };`,
    // getter
    `window.PORTFOLIO_CONFIG = { "personal": { get name() { globalThis.__flag_pwned = true; return "x"; } } };`,
    // template literal
    'window.PORTFOLIO_CONFIG = { "personal": { "name": `${globalThis.__flag_pwned = true}` } };'
  ];

  for (const payload of maliciousPayloads) {
    assert.throws(
      () => parseConfigSource(payload),
      Error
    );
    assert.equal(globalThis.__flag_pwned, false, `Flag was set by payload: ${payload}`);
  }
});

