/* Portfolio Engine — browser smoke test */
// The jsdom tests check the engine's contract in a simulated DOM. This
// test does the one thing jsdom cannot: it drives the real generator in
// Chromium, uploads real files, takes the ZIP it downloads, unzips it and
// opens the result. If the unzipped site renders the name the user typed,
// the whole path from form to deployable folder works.
//
// DEVELOPMENT ONLY, like the rest of the suite. The template that ships to
// users has no dependencies and no build step.
//
//   npx playwright install chromium
//   npm test

import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { chromium } from "playwright";
import { serve } from "./static-server.mjs";

const require = createRequire(import.meta.url);
const Pack = require("../pack.js");

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const decoder = new TextDecoder();

// A name that cannot appear by accident, so a match proves the value the
// test typed into the form reached the rendered page.
const NAME = "Zephyr Quill";

let repo;
let browser;
let tempDir;

before(async () => {
  repo = await serve(ROOT);
  tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "portfolio-smoke-"));
  browser = await chromium.launch();
});

after(async () => {
  await browser?.close();
  await new Promise((r) => repo.server.close(r));
  fs.rmSync(tempDir, { recursive: true, force: true });
});

const writeFiles = (dir, entries) => {
  for (const entry of entries) {
    const target = path.join(dir, entry.path);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, entry.data);
  }
};

test("browser: the generator ships a ZIP that opens as a working site", async () => {
  const page = await browser.newPage();
  await page.goto(`${repo.base}/setup.html`);

  // The wizard shows one chapter at a time; "Show everything" reveals the
  // full form in the DOM, which is what we want to fill programmatically.
  await page.click("#genShowAll");

  await page.fill('input[data-path="personal.name"]', NAME);
  await page.setInputFiles('input[data-upload="photo"]', path.join(ROOT, "favicon-32x32.png"));
  await page.setInputFiles('input[data-upload="resume"]', path.join(ROOT, "resume.pdf"));

  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.click("#genZipBtn"),
  ]);

  const zipPath = path.join(tempDir, "site.zip");
  await download.saveAs(zipPath);
  await page.close();

  const entries = Pack.readZip(new Uint8Array(fs.readFileSync(zipPath)));
  const files = new Map(entries.map((e) => [e.path, e.data]));
  const text = (p) => decoder.decode(files.get(p));

  // The archive carries the files the pages name, plus the two uploads.
  for (const required of ["index.html", "studio.html", "style.css", "script.js", "config.js", "robots.txt", "sitemap.xml", "netlify.toml", "_headers"]) {
    assert.ok(files.has(required), `${required} should be in the archive`);
  }
  assert.ok(files.has("photo.png"), "the uploaded photo should be in the archive");
  assert.ok(files.has("resume.pdf"), "the uploaded resume should be in the archive");

  // A crawler that never runs script.js must still see the owner's name and the
  // social tags: they are baked into the shipped HTML at build time.
  const indexHtml = text("index.html");
  assert.ok(indexHtml.includes(NAME), "the shipped index.html carries the name without JavaScript");
  assert.match(indexHtml, /property="og:title"\s+content="[^"]+"/, "the shipped index.html has og:title");
  assert.match(indexHtml, /name="twitter:card"\s+content="summary_large_image"/, "twitter:card is set");
  assert.match(text("studio.html"), /id="pf-ld-json"/, "the shipped studio.html has structured data");

  // Every reference inside the archive resolves to another entry in it.
  for (const entry of entries.filter((e) => e.path.endsWith(".html"))) {
    const html = decoder.decode(entry.data);
    for (const ref of Pack.collectRefs(html)) {
      assert.ok(files.has(ref), `${entry.path} points at ${ref}, which is not in the archive`);
    }
  }
  for (const ref of Pack.collectIconRefs(text("site.webmanifest"))) {
    assert.ok(files.has(ref), `site.webmanifest points at ${ref}, which is not in the archive`);
  }

  // Unzip it and open it, exactly as a user would.
  const siteDir = path.join(tempDir, "site");
  writeFiles(siteDir, entries.map((e) => ({ path: e.path, data: e.data })));
  const site = await serve(siteDir);

  const sitePage = await browser.newPage();
  const consoleErrors = [];
  sitePage.on("pageerror", (err) => consoleErrors.push(err.message));
  sitePage.on("response", (res) => {
    if (res.status() === 404) consoleErrors.push(`404 ${res.url()}`);
  });

  await sitePage.goto(`${site.base}/index.html`);
  await sitePage.waitForFunction((name) => document.body.innerText.includes(name), NAME, { timeout: 15000 });

  const visible = await sitePage.evaluate(() => document.body.innerText);
  assert.ok(visible.includes(NAME), "the unzipped page should render the name from the form");
  assert.deepEqual(consoleErrors, [], `the unzipped site should load cleanly:\n  ${consoleErrors.join("\n  ")}`);

  await sitePage.close();
  await new Promise((r) => site.server.close(r));
});
