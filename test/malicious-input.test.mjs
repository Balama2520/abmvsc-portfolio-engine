/* Malicious-input regression — hostile text must never run in a shipped site */
// The unit tests check the sanitiser in isolation. This test does the whole
// path the way an attacker would: type hostile strings into every text and URL
// field of the real generator, take the ZIP it downloads, open the unzipped
// site in a real browser, and assert that nothing executed and nothing was
// injected. If a future change stops escaping a value, this test fails.
//
// DEVELOPMENT ONLY, like the rest of the suite.
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

// Every field is filled with each payload in turn. Together they cover the ways
// a value could break out of an HTML text node, an attribute, a script element
// and a URL context.
const PAYLOADS = [
  ["an image with an error handler", "<img src=x onerror=alert(1)>"],
  ["a closing script tag", "</script><script>alert(1)</script>"],
  ["an attribute break-out", "\"><svg onload=alert(1)>"],
  ["a javascript URL", "javascript:alert(1)"],
  ["a very long string", "Z".repeat(10000)],
];

let repo;
let browser;
let tempDir;

before(async () => {
  repo = await serve(ROOT);
  tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "portfolio-hostile-"));
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

// Fill every editable text and URL field, then let the generator's own event
// handler pick the value up exactly as a keystroke would.
const fillEveryField = (page, payload) =>
  page.evaluate((value) => {
    const fields = document.querySelectorAll(
      'input[data-path]:not([type="checkbox"]):not([type="color"]), textarea[data-path]'
    );
    let filled = 0;
    for (const el of fields) {
      el.value = value;
      el.dispatchEvent(new Event("input", { bubbles: true }));
      filled += 1;
    }
    return filled;
  }, payload);

// Ask the live page whether anything hostile happened while it rendered.
const probeForInjection = (page) =>
  page.evaluate(() => ({
    imageFromPayload: document.querySelectorAll('img[src="x"]').length,
    svgOnload: document.querySelectorAll("svg[onload]").length,
    extraScripts: document.querySelectorAll(
      'script:not([src]):not([type="application/ld+json"])'
    ).length,
    jsonLd: [...document.querySelectorAll('script[type="application/ld+json"]')].map(
      (el) => el.textContent
    ),
    text: document.body.innerText,
  }));

for (const [label, payload] of PAYLOADS) {
  test(`malicious input (${label}): the shipped site stays safe and readable`, async () => {
    const page = await browser.newPage();
    await page.goto(`${repo.base}/setup.html`);
    await page.click("#genShowAll");

    const filled = await fillEveryField(page, payload);
    assert.ok(filled > 10, `expected to fill many fields, filled ${filled}`);

    const [download] = await Promise.all([
      page.waitForEvent("download", { timeout: 20000 }).catch(async (err) => {
        const toast = await page.textContent("#genToast").catch(() => "");
        throw new Error(`no download (${err.message}); toast: ${toast}`);
      }),
      page.click("#genZipBtn"),
    ]);
    const zipPath = path.join(tempDir, `${label.replace(/\W+/g, "-")}.zip`);
    await download.saveAs(zipPath);
    await page.close();

    const entries = Pack.readZip(new Uint8Array(fs.readFileSync(zipPath)));
    const siteDir = path.join(tempDir, `site-${label.replace(/\W+/g, "-")}`);
    writeFiles(siteDir, entries.map((e) => ({ path: e.path, data: e.data })));
    const site = await serve(siteDir);

    for (const file of ["index.html", "studio.html"]) {
      const sitePage = await browser.newPage();
      let dialogShown = false;
      sitePage.on("dialog", async (dialog) => {
        dialogShown = true;
        await dialog.dismiss();
      });
      const pageErrors = [];
      sitePage.on("pageerror", (err) => pageErrors.push(err.message));

      await sitePage.goto(`${site.base}/${file}`);
      await sitePage.waitForLoadState("load");
      const probe = await probeForInjection(sitePage);

      assert.equal(dialogShown, false, `${file} showed a dialog for: ${payload.slice(0, 60)}`);
      assert.deepEqual(pageErrors, [], `${file} threw while rendering hostile input`);
      assert.equal(probe.imageFromPayload, 0, `${file} injected an image from the payload`);
      assert.equal(probe.svgOnload, 0, `${file} injected an svg from the payload`);
      assert.equal(probe.extraScripts, 0, `${file} injected a script element from the payload`);
      assert.ok(probe.jsonLd.length >= 1, `${file} has structured data`);
      for (const json of probe.jsonLd) {
        assert.doesNotThrow(() => JSON.parse(json), `${file} JSON-LD is not valid JSON`);
      }
      if (payload.length <= 100) {
        assert.ok(
          probe.text.includes(payload),
          `${file} should show the value as plain text, not drop it`
        );
      }

      await sitePage.close();
    }

    await new Promise((r) => site.server.close(r));
  });
}
