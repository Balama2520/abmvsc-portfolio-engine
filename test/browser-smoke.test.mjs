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
//   SMOKE_BROWSER=firefox npm test   (after: npx playwright install firefox)

import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { chromium, firefox, webkit } from "playwright";
import { serve } from "./static-server.mjs";

const require = createRequire(import.meta.url);
const Pack = require("../pack.js");

// Chromium is what CI installs and what the suite runs by default. Set
// SMOKE_BROWSER=firefox (or webkit) to drive the same flow in another engine
// after `npx playwright install firefox webkit`.
const ENGINES = { chromium, firefox, webkit };
const ENGINE = process.env.SMOKE_BROWSER || "chromium";

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
  browser = await ENGINES[ENGINE].launch();
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

test(`browser (${ENGINE}): the generator ships a ZIP that opens as a working site`, async () => {
  const page = await browser.newPage();
  const generatorOffenders = [];
  page.on("request", (req) => {
    const url = req.url();
    if (!url.startsWith(repo.base) && !/^(data|blob|about):/.test(url)) generatorOffenders.push(url);
  });
  const generatorCsp = [];
  page.on("console", (msg) => {
    const text = msg.text();
    if (/Content Security Policy/i.test(text)) generatorCsp.push(text);
  });
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

  assert.deepEqual(
    generatorOffenders,
    [],
    `the generator must not reach outside its own origin:\n  ${generatorOffenders.join("\n  ")}`
  );
  assert.deepEqual(
    generatorCsp,
    [],
    `the generator must run clean under its Content-Security-Policy:\n  ${generatorCsp.join("\n  ")}`
  );

  const entries = Pack.readZip(new Uint8Array(fs.readFileSync(zipPath)));
  const files = new Map(entries.map((e) => [e.path, e.data]));
  const text = (p) => decoder.decode(files.get(p));

  // The archive carries the files the pages name, plus the two uploads and the
  // two deploy extras the generator writes in.
  for (const required of ["index.html", "studio.html", "style.css", "script.js", "config.js", "robots.txt", "sitemap.xml", "netlify.toml", "_headers", ".nojekyll", "README-DEPLOY.txt"]) {
    assert.ok(files.has(required), `${required} should be in the archive`);
  }
  // The deploy guide travels with the ZIP and names the three hosts.
  const readme = text("README-DEPLOY.txt");
  for (const host of ["Netlify Drop", "GitHub Pages", "Cloudflare Pages"]) {
    assert.ok(readme.includes(host), `README-DEPLOY.txt should mention ${host}`);
  }
  // The archive carries the artwork the generator drew, not the sample files:
  // a social card and favicons built from the name, role and colour.
  const isPng = (p) => {
    const bytes = files.get(p);
    return bytes && bytes[0] === 137 && bytes[1] === 80 && bytes[2] === 78 && bytes[3] === 71;
  };
  assert.ok(isPng("og-image.png"), "og-image.png should be a generated PNG");
  for (const icon of ["favicon-16x16.png", "favicon-32x32.png", "apple-touch-icon.png", "android-chrome-192x192.png", "android-chrome-512x512.png"]) {
    assert.ok(isPng(icon), `${icon} should be a generated PNG`);
  }
  const ico = files.get("favicon.ico");
  assert.ok(ico && ico[0] === 0 && ico[1] === 0 && ico[2] === 1 && ico[3] === 0, "favicon.ico should be an icon file");
  // Differing from the files on disk is what proves these were drawn here
  // rather than copied out of the sample artwork.
  const drawn = (name) => {
    const archived = files.get(name);
    const onDisk = new Uint8Array(fs.readFileSync(path.join(ROOT, name)));
    return archived && !Buffer.from(archived).equals(Buffer.from(onDisk));
  };
  assert.ok(drawn("og-image.png"), "og-image.png should be drawn from the name, role and colour");
  assert.ok(drawn("favicon-32x32.png"), "the favicon should be drawn from the initials");
  assert.ok(drawn("favicon.ico"), "favicon.ico should wrap the drawn favicon");
  // robots.txt and sitemap.xml carry the website address typed into the form.
  assert.match(text("robots.txt"), /Sitemap: https:\/\/[^\s]+\/sitemap\.xml/, "robots.txt names the sitemap");
  assert.match(text("sitemap.xml"), /<loc>https:\/\/[^<]+\/studio\.html<\/loc>/, "sitemap.xml lists the studio page");
  assert.ok(!text("robots.txt").includes("your-domain.com"), "robots.txt is rewritten with the address");
  assert.ok(!text("sitemap.xml").includes("your-domain.com"), "the placeholder domain is gone once an address is set");

  const photoEntry = ["photo.webp", "photo.jpg", "photo.png"].find((name) => files.has(name));
  assert.ok(photoEntry, "the uploaded photo should be in the archive as a prepared image");
  assert.ok(files.has("resume.pdf"), "the uploaded resume should be in the archive");
  // The shipped config points at the prepared file, so the page and the archive
  // agree on the photo name.
  assert.ok(
    text("config.js").includes(`"photo": "${photoEntry}"`),
    `config.js should point at ${photoEntry}`
  );

  // A crawler that never runs script.js must still see the owner's name and the
  // social tags: they are baked into the shipped HTML at build time.
  const indexHtml = text("index.html");
  assert.ok(indexHtml.includes(NAME), "the shipped index.html carries the name without JavaScript");
  assert.match(indexHtml, /property="og:title"\s+content="[^"]+"/, "the shipped index.html has og:title");
  assert.match(indexHtml, /name="twitter:card"\s+content="summary_large_image"/, "twitter:card is set");
  assert.match(text("studio.html"), /id="pf-ld-json"/, "the shipped studio.html has structured data");
  // The config script is versioned, so an edited config is never served from cache.
  assert.match(indexHtml, /<script src="config\.js\?v=[0-9a-f]+"><\/script>/, "the config script is versioned");
  // The social image is referenced by its full address, which is what a crawler needs.
  assert.match(indexHtml, /property="og:image"\s+content="https:\/\/[^"]*\/og-image\.png"/, "og:image is the generated card at an absolute address");

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
  const siteOffenders = [];
  const siteCsp = [];
  sitePage.on("pageerror", (err) => consoleErrors.push(err.message));
  sitePage.on("console", (msg) => {
    const text = msg.text();
    if (/Content Security Policy/i.test(text)) siteCsp.push(text);
  });
  sitePage.on("request", (req) => {
    const url = req.url();
    if (!url.startsWith(site.base) && !/^(data|blob|about):/.test(url)) siteOffenders.push(url);
  });
  sitePage.on("response", (res) => {
    if (res.status() === 404) consoleErrors.push(`404 ${res.url()}`);
  });

  await sitePage.goto(`${site.base}/index.html`);
  await sitePage.waitForFunction((name) => document.body.innerText.includes(name), NAME, { timeout: 15000 });

  const visible = await sitePage.evaluate(() => document.body.innerText);
  assert.ok(visible.includes(NAME), "the unzipped page should render the name from the form");
  assert.deepEqual(consoleErrors, [], `the unzipped site should load cleanly:\n  ${consoleErrors.join("\n  ")}`);
  assert.deepEqual(
    siteOffenders,
    [],
    `the unzipped site must not reach outside its own origin:\n  ${siteOffenders.join("\n  ")}`
  );
  assert.deepEqual(
    siteCsp,
    [],
    `the unzipped site must run clean under its Content-Security-Policy:\n  ${siteCsp.join("\n  ")}`
  );

  await sitePage.close();
  await new Promise((r) => site.server.close(r));
});
