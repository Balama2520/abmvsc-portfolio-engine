/* Guardrails — the promises that make this template worth using */
// Every one of these failing means the project lost a selling point:
//
//   - zero dependencies        - no build step
//   - no third-party JS        - no broken file references
//   - every file parses
//
// If you are here because CI is red: the fix is almost never to relax
// the guardrail. It is to change the change that broke it.

import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (f) => fs.readFileSync(path.join(ROOT, f), "utf8");
const pkg = JSON.parse(read("package.json"));

const JS_FILES = ["script.js", "config.js", "setup.js", "pack.js"];
const PAGES = ["index.html", "studio.html", "setup.html"];

test("guardrail: the template has no runtime dependencies", () => {
  const deps = Object.keys(pkg.dependencies || {});
  assert.deepEqual(
    deps,
    [],
    `The shipped template must stay zero-dependency. Found: ${deps.join(", ")}`
  );
});

test("guardrail: the template has no build step", () => {
  const forbidden = ["build", "prepare", "prepublish", "prepublishOnly", "preinstall", "postinstall"];
  const present = forbidden.filter((k) => k in (pkg.scripts || {}));
  assert.deepEqual(
    present,
    [],
    `These imply a build step, which this template does not have: ${present.join(", ")}`
  );
});

test("guardrail: every JavaScript file parses", () => {
  for (const file of JS_FILES) {
    assert.doesNotThrow(() => new Function(read(file)), `${file} failed to parse`);
  }
});

test("guardrail: the pages load no third-party JavaScript", () => {
  const offenders = [];
  for (const page of ["index.html", "studio.html"]) {
    const src = read(page);
    for (const m of src.matchAll(/<script[^>]+src=["'](https?:\/\/[^"']+)/g)) {
      offenders.push(`${page} → ${m[1]}`);
    }
  }
  assert.deepEqual(
    offenders,
    [],
    `Pages must not load third-party JavaScript:\n  ${offenders.join("\n  ")}`
  );
});

test("guardrail: every file referenced by the HTML exists", () => {
  const missing = [];
  for (const page of PAGES) {
    const src = read(page);
    for (const m of src.matchAll(/\b(?:href|src)=["']([^"']+)["']/g)) {
      const ref = m[1];
      // Skip in-page anchors and any URI with a scheme — https:, mailto:,
      // tel:, data: and friends are populated by the engine at runtime.
      if (!ref || ref.startsWith("#") || /^[a-z][a-z0-9+.-]*:/i.test(ref)) continue;
      const clean = ref.split(/[?#]/)[0];
      if (!clean) continue;
      if (!fs.existsSync(path.join(ROOT, clean))) missing.push(`${page} → ${ref}`);
    }
  }
  assert.deepEqual(
    missing,
    [],
    `These references point at files that do not exist:\n  ${missing.join("\n  ")}`
  );
});

test("guardrail: the generator stays out of search results", () => {
  assert.match(read("setup.html"), /name="robots"\s+content="noindex/);
  assert.ok(!read("sitemap.xml").includes("setup.html"), "setup.html must not be in sitemap.xml");
});

test("guardrail: the licence is MIT and attributed", () => {
  const licence = read("LICENSE");
  assert.match(licence, /MIT License/);
  assert.match(licence, /Copyright \(c\) \d{4} ABMVSC/);
});
