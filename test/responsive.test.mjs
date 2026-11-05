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

// Regression: sections used to start at opacity 0 and only fade in when an
// IntersectionObserver fired. A full-page screenshot taken without scrolling
// then captured blank sections. Content must be visible by default; the
// entrance animation is an enhancement, never a prerequisite.
test("layout: section content is visible without scrolling", async () => {
  const SELECTOR = [
    "[data-list]",
    "[data-list-host]",
    ".project-card",
    ".skill-card",
    ".experience-card",
    ".achievement-card",
    ".cert-card",
    ".reason-card",
    ".pillar-box",
  ].join(", ");

  for (const file of ["index.html", "studio.html"]) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    await page.goto(`${repo.base}/${file}`, { waitUntil: "load" });
    // Let hydration settle. Never scroll: the point is what is on screen now.
    await page.waitForTimeout(1200);

    const faded = await page.evaluate((selector) => {
      const out = [];
      document.querySelectorAll(selector).forEach((el) => {
        if (el.closest("[hidden]")) return;
        const opacity = Number(getComputedStyle(el).opacity);
        if (opacity < 1) out.push({ el: el.className || el.tagName, opacity });
      });
      return out;
    }, SELECTOR);

    assert.deepEqual(
      faded,
      [],
      `${file} has section content below full opacity without scrolling:\n${JSON.stringify(faded)}`
    );
    await page.close();
  }
});

test("layout: the demo notice, chat bubble and skills ticker do not overlap at 375px", async () => {
  const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
  await page.goto(`${repo.base}/index.html`, { waitUntil: "load" });
  await page.waitForTimeout(600);

  const boxes = await page.evaluate(() => {
    const pick = (sel) => {
      const el = document.querySelector(sel);
      if (!el || el.closest("[hidden]") || getComputedStyle(el).display === "none") return null;
      const r = el.getBoundingClientRect();
      return { top: r.top, right: r.right, bottom: r.bottom, left: r.left };
    };
    return {
      demo: pick("[data-demo-notice]"),
      chat: pick("#chatbotToggle"),
      ticker: pick(".skills-bar"),
    };
  });

  const hits = (a, b) =>
    a && b && a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;

  if (boxes.demo && boxes.chat) {
    assert.ok(!hits(boxes.demo, boxes.chat), `demo notice overlaps the chat bubble: ${JSON.stringify(boxes)}`);
  }
  if (boxes.demo && boxes.ticker) {
    assert.ok(!hits(boxes.demo, boxes.ticker), `demo notice overlaps the skills ticker: ${JSON.stringify(boxes)}`);
  }
  if (boxes.chat && boxes.ticker) {
    assert.ok(!hits(boxes.chat, boxes.ticker), `chat bubble overlaps the skills ticker: ${JSON.stringify(boxes)}`);
  }
  await page.close();
});

// The master plan asks for a thumb-friendly generator: every control a phone
// user can tap is at least 44px tall, and the step buttons stay pinned to the
// bottom edge so "Next" is always within reach.
test("layout: the generator's controls are thumb-sized and the step nav sticks at 375px", async () => {
  const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
  await page.goto(`${repo.base}/setup.html`, { waitUntil: "load" });
  await page.waitForTimeout(500);

  const small = await page.evaluate(() => {
    const selectors = ["#genZipBtn", "#genBack", "#genNext", ".gen-rail-step", ".gen-upload-pick .gen-btn"];
    const out = [];
    selectors.forEach((sel) => {
      document.querySelectorAll(sel).forEach((el) => {
        if (el.closest("[hidden]") || el.closest("details:not([open])")) return;
        if (getComputedStyle(el).display === "none") return;
        const height = el.getBoundingClientRect().height;
        if (height < 44) out.push({ sel, height });
      });
    });
    return out;
  });
  assert.deepEqual(small, [], `controls under 44px tall:\n${JSON.stringify(small)}`);

  const sticky = await page.evaluate(() => {
    const nav = document.querySelector(".gen-steps-nav");
    return nav ? getComputedStyle(nav).position : "missing";
  });
  assert.equal(sticky, "sticky", "the step buttons should stick to the bottom on a phone");

  await page.close();
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
