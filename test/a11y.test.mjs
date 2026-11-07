/**
 * Portfolio Engine — accessibility check
 *
 * axe-core runs in real Chromium against the generator and the generated pages
 * in every theme. The bar the plan sets is zero serious or critical issues.
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
import AxeBuilder from "@axe-core/playwright";
import { serve } from "./static-server.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const THEMES = ["light", "dark", "minimal"];

const CONFIG_SOURCE = fs.readFileSync(path.join(ROOT, "config.js"), "utf8");

// A theme is not just an attribute: the runtime blends the accent shades from
// config.theme.mode, so a page has to be served the config for that mode to be
// tested honestly. These pages are exactly what the generator would produce.
const configFor = (mode) => {
  const json = CONFIG_SOURCE.trim()
    .replace(/^(?:window\.)?PORTFOLIO_CONFIG\s*=\s*/, "")
    .replace(/;\s*$/, "");
  const config = JSON.parse(json);
  config.theme.mode = mode;
  return `window.PORTFOLIO_CONFIG = ${JSON.stringify(config, null, 2)};\n`;
};

let repo;
let browser;

before(async () => {
  repo = await serve(ROOT);
  browser = await chromium.launch();
});

after(async () => {
  await browser?.close();
  await new Promise((r) => repo.server.close(r));
});

// The generated pages ship a content policy that allows only their own scripts.
// axe-core is injected at test time, so the scan runs with that policy lifted.
// Nothing about the shipped files changes.
const openPage = async (file, theme) => {
  const context = await browser.newContext({
    bypassCSP: true,
    viewport: { width: 1280, height: 900 },
  });
  if (theme) {
    await context.route("**/config.js", (route) =>
      route.fulfill({ contentType: "application/javascript", body: configFor(theme) })
    );
  }
  const page = await context.newPage();
  await page.goto(`${repo.base}/${file}`, { waitUntil: "load" });
  // Let hydration fill the page before it is scanned.
  await page.waitForTimeout(900);
  return { context, page };
};

// Only the findings the plan calls out: serious and critical.
const blockers = (violations) =>
  violations
    .filter((v) => v.impact === "serious" || v.impact === "critical")
    .map((v) => ({
      id: v.id,
      impact: v.impact,
      help: v.help,
      nodes: v.nodes.map((n) => n.target.join(" ")),
    }));

const scan = async (file, theme) => {
  const { context, page } = await openPage(file, theme);
  const results = await new AxeBuilder({ page }).analyze();
  await context.close();
  return blockers(results.violations);
};

test("a11y: the generator has no serious or critical axe issues", async () => {
  const found = await scan("setup.html", null);
  assert.deepEqual(found, [], `setup.html has axe issues:\n${JSON.stringify(found, null, 2)}`);
});

for (const theme of THEMES) {
  test(`a11y: the generated pages have no serious or critical axe issues in the ${theme} theme`, async () => {
    for (const file of ["index.html", "studio.html"]) {
      const found = await scan(file, theme);
      assert.deepEqual(
        found,
        [],
        `${file} (${theme}) has axe issues:\n${JSON.stringify(found, null, 2)}`
      );
    }
  });
}
