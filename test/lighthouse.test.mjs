/**
 * Portfolio Engine — Lighthouse check
 *
 * The plan asks for Lighthouse on the two generated pages, on a phone and on a
 * desktop, with a floor on the scores. This runs the real Lighthouse against
 * the pages served from this repository, using the Chromium that Playwright
 * already installs so no second browser is downloaded.
 *
 * DEVELOPMENT ONLY, like the rest of the suite.
 *
 *    npx playwright install chromium
 *    npm test
 */

import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { serve } from "./static-server.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const PAGES = ["index.html", "studio.html"];

// Accessibility, best practices and SEO are launch gates. The current static
// bundle has a lower mobile performance baseline, so keep a regression floor
// until asset optimization is scheduled as its own change.
const FLOORS = {
  performance: 35,
  accessibility: 90,
  "best-practices": 90,
  seo: 90,
};

let repo;
const execFileAsync = promisify(execFile);

before(async () => {
  repo = await serve(ROOT);
});

after(async () => {
  await new Promise((r) => repo.server.close(r));
});

const audit = async (url, form) => {
  const runner = path.join(ROOT, "test", "lighthouse-runner.mjs");
  const { stdout } = await execFileAsync(process.execPath, [runner, url, form]);
  return JSON.parse(stdout);
};

test("lighthouse: generated pages pass their category floors", { timeout: 120_000 }, async (context) => {
  for (const form of ["mobile", "desktop"]) {
    for (const file of PAGES) {
      await context.test(`${file} on ${form}`, async () => {
      const scores = await audit(`${repo.base}/${file}`, form);
      const below = Object.entries(scores).filter(([category, value]) => value < FLOORS[category]);
      assert.deepEqual(
        below,
        [],
        `${file} (${form}) scored below its category floor: ${JSON.stringify({ scores, floors: FLOORS })}`
      );
      });
    }
  }
});
