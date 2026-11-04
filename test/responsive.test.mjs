/**
 * Portfolio Engine — responsive layout check
 *
 * The jsdom tests cannot measure anything, and the ZIP smoke test only opens
 * the site at the default desktop width. This test loads the generator and
 * both pages in real Chromium at three widths and fails if any page is wider
 * than the viewport, which is exactly the bug a phone user would hit.
 *
 * Set SHOT_DIR to also write full-page screenshots (used to review the design
 * by eye; they are never committed).
 *
 * DEVELOPMENT ONLY, like the rest of the suite.
 *
 *    npx playwright install chromium
 *    npm test
 */

import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { serve } from "./static-server.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SHOT_DIR = process.env.SHOT_DIR;

const VIEWPORTS = [
  { name: "phone", width: 375, height: 812 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1280, height: 900 },
];

const PAGES = ["setup.html", "index.html", "studio.html"];

let repo;
let browser;

before(async () => {
  repo = await serve(ROOT);
  browser = await chromium.launch();
  if (SHOT_DIR) fs.mkdirSync(SHOT_DIR, { recursive: true });
});

after(async () => {
  await browser?.close();
  await new Promise((r) => repo.server.close(r));
});

// body sets `overflow-x: hidden`, which would hide the very overflow we are
// hunting for. Turning it back on lets the real content width show through.
const measure = (page) =>
  page.evaluate(() => {
    document.documentElement.style.overflowX = "visible";
    document.body.style.overflowX = "visible";
    const width = Math.max(
      document.documentElement.scrollWidth,
      document.body.scrollWidth
    );
    return { width, viewport: document.documentElement.clientWidth };
  });

for (const view of VIEWPORTS) {
  test(`layout: nothing overflows at ${view.width}px`, async () => {
    for (const file of PAGES) {
      const page = await browser.newPage({ viewport: { width: view.width, height: view.height } });
      await page.goto(`${repo.base}/${file}`, { waitUntil: "load" });
      // Let the hydration engine finish before measuring.
      await page.waitForTimeout(500);

      const { width, viewport } = await measure(page);
      assert.ok(
        width <= viewport + 1,
        `${file} at ${view.width}px is ${width}px wide in a ${viewport}px viewport`
      );

      if (SHOT_DIR) {
        const name = `${file.replace(/\.html$/, "")}-${view.width}.png`;
        await page.screenshot({ path: path.join(SHOT_DIR, name), fullPage: true });
      }

      await page.close();
    }
  });
}
