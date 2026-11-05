/**
 * Portfolio Engine — keyboard-only check
 *
 * The plan asks for a keyboard-only flow: every control reachable, a visible
 * focus ring, a label on every field, and updates announced in a live region.
 * jsdom cannot move focus or compute styles, so this runs in real Chromium.
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
import { chromium } from "playwright";
import { serve } from "./static-server.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const TABBABLE = [
  "a[href]",
  "area[href]",
  "button",
  "input",
  "select",
  "textarea",
  "summary",
  "[tabindex]",
  "iframe",
].join(", ");

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

const openPage = async (file, width = 1280, height = 900) => {
  const page = await browser.newPage({ viewport: { width, height } });
  await page.goto(`${repo.base}/${file}`, { waitUntil: "load" });
  // Let the hydration engine finish before anything is measured.
  await page.waitForTimeout(900);
  return page;
};

// The controls a keyboard user should be able to Tab to, in document order.
// Hidden cards, closed <details>, inert regions and the embedded preview
// document are left out because a real Tab cannot reach them either. The
// preview is a whole second website; its keyboard access is covered by the
// generated-pages test below, so it is taken out of the walk here.
const collectTabbable = (page) =>
  page.evaluate((selector) => {
    document.querySelectorAll("iframe").forEach((f) => f.setAttribute("tabindex", "-1"));
    const out = [];
    document.querySelectorAll(selector).forEach((el) => {
      if (el.disabled) return;
      if (el.tagName === "INPUT" && el.type === "hidden") return;
      const ti = el.getAttribute("tabindex");
      if (ti !== null && Number(ti) < 0) return;
      if (el.closest("[inert]")) return;
      if (el.closest("[hidden]")) return;
      const closed = el.closest("details:not([open])");
      if (closed && el !== closed.querySelector(":scope > summary")) return;
      // checkVisibility also catches an ancestor with display:none (the closed
      // resume dialog), which getComputedStyle on the child would not show.
      if (typeof el.checkVisibility === "function" && !el.checkVisibility({ checkVisibilityCSS: true })) return;
      const cs = getComputedStyle(el);
      if (cs.display === "none" || cs.visibility === "hidden") return;
      if (el.tagName === "IFRAME") return;
      out.push(el);
    });
    out.forEach((el, i) => el.setAttribute("data-kbd", String(i)));
    return out.map((el) => ({
      key: String(el.getAttribute("data-kbd")),
      tag: el.tagName.toLowerCase(),
      name: el.getAttribute("aria-label") || el.textContent.trim().slice(0, 24) || el.getAttribute("data-path") || "",
    }));
  }, TABBABLE);

// Tab through the page, recording what receives focus and whether it shows a
// ring. Stops once every expected control has been seen or the order repeats.
const tabWalk = async (page, total) => {
  const seen = [];
  const noRing = [];
  let misses = 0;
  for (let i = 0; i < total + 12 && misses < 6; i++) {
    await page.keyboard.press("Tab");
    const info = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el || el.nodeType !== 1 || !el.getAttribute) return null;
      const key = el.getAttribute("data-kbd");
      if (key === null) return null;
      const cs = getComputedStyle(el);
      const width = parseFloat(cs.outlineWidth) || 0;
      return {
        key,
        tag: el.tagName.toLowerCase(),
        name: el.getAttribute("aria-label") || el.textContent.trim().slice(0, 24),
        ring: (cs.outlineStyle !== "none" && width > 0) || (cs.boxShadow && cs.boxShadow !== "none"),
      };
    });
    if (!info || seen.includes(info.key)) {
      misses++;
      continue;
    }
    misses = 0;
    seen.push(info.key);
    if (!info.ring) noRing.push(`${info.tag} "${info.name}"`);
  }
  return { seen, noRing };
};

const assertKeyboard = async (page, label) => {
  const expected = await collectTabbable(page);
  const { seen, noRing } = await tabWalk(page, expected.length);
  const reached = new Set(seen);
  const missed = expected.filter((e) => !reached.has(e.key)).map((e) => `${e.tag} "${e.name}"`);
  assert.deepEqual(missed, [], `${label}: controls a keyboard cannot reach:\n${JSON.stringify(missed, null, 2)}`);
  assert.deepEqual(noRing, [], `${label}: controls with no visible focus ring:\n${JSON.stringify(noRing, null, 2)}`);
  return expected.length;
};

test("keyboard: the generator's controls are all reachable and show focus", async () => {
  const page = await openPage("setup.html");
  // Reveal every section so the whole form is in the tab order, not just step 1.
  await page.click("#genShowAll");
  await page.waitForTimeout(300);
  const total = await assertKeyboard(page, "setup.html");
  assert.ok(total > 20, `expected the generator form to be a large tab surface, saw ${total} controls`);
  await page.close();
});

test("keyboard: every generator field has a label", async () => {
  const page = await openPage("setup.html");
  await page.click("#genShowAll");
  await page.waitForTimeout(300);

  const unlabelled = await page.evaluate(() => {
    const out = [];
    document.querySelectorAll("input, select, textarea").forEach((el) => {
      if (el.type === "hidden" || el.disabled) return;
      if (el.closest("[inert]") || el.closest("[hidden]")) return;
      if (el.closest("details:not([open])")) return;
      if (typeof el.checkVisibility === "function" && !el.checkVisibility({ checkVisibilityCSS: true })) return;
      if (getComputedStyle(el).display === "none") return;
      if (el.getAttribute("aria-label") || el.getAttribute("aria-labelledby")) return;
      if (el.closest("label")) return;
      if (el.id && document.querySelector(`label[for="${CSS.escape(el.id)}"]`)) return;
      out.push(el.outerHTML.slice(0, 90));
    });
    return out;
  });

  assert.deepEqual(unlabelled, [], `fields with no label:\n${JSON.stringify(unlabelled, null, 2)}`);
  await page.close();
});

test("keyboard: generator updates are announced in a live region", async () => {
  const page = await openPage("setup.html");

  const live = await page.evaluate(() => {
    const read = (sel) => {
      const el = document.querySelector(sel);
      return el ? { role: el.getAttribute("role"), live: el.getAttribute("aria-live") } : null;
    };
    return { toast: read("#genToast"), saved: read("#genSaved") };
  });
  assert.deepEqual(live.toast, { role: "status", live: "polite" }, "the toast must be a polite live region");
  assert.deepEqual(live.saved, { role: "status", live: "polite" }, "the saved note must be a polite live region");

  // A real action has to fill the region, not just exist.
  await page.click("#genAdvanced > summary");
  await page.click("#genCopyBtn");
  const text = await page.evaluate(() => document.querySelector("#genToast").textContent.trim());
  assert.ok(text.length > 0, "the toast stayed empty after an action");
  await page.close();
});

for (const file of ["index.html", "studio.html"]) {
  test(`keyboard: every control on ${file} is reachable and shows focus`, async () => {
    const page = await openPage(file);
    const total = await assertKeyboard(page, file);
    assert.ok(total > 5, `expected ${file} to have several controls, saw ${total}`);
    await page.close();
  });
}

test("keyboard: the chat assistant opens, takes focus and closes from the keys", async () => {
  const page = await openPage("index.html");

  // Reach the toggle the way a keyboard user would, then open it.
  await page.focus("#chatbotToggle");
  await page.keyboard.press("Enter");

  const opened = await page.evaluate(() => {
    const win = document.getElementById("chatbotWindow");
    return {
      open: document.getElementById("chatbot").classList.contains("open"),
      expanded: document.getElementById("chatbotToggle").getAttribute("aria-expanded"),
      hidden: win.getAttribute("aria-hidden"),
      inert: win.hasAttribute("inert"),
      focused: document.activeElement && document.activeElement.id,
    };
  });
  assert.equal(opened.open, true, "Enter should open the chat");
  assert.equal(opened.expanded, "true", "the toggle should report it is expanded");
  assert.equal(opened.hidden, "false", "the open window must not be hidden from assistive tech");
  assert.equal(opened.inert, false, "the open window must not be inert");
  assert.equal(opened.focused, "chatbotInput", "focus should land in the message box");

  await page.keyboard.press("Escape");

  const closed = await page.evaluate(() => {
    const win = document.getElementById("chatbotWindow");
    return {
      open: document.getElementById("chatbot").classList.contains("open"),
      hidden: win.getAttribute("aria-hidden"),
      inert: win.hasAttribute("inert"),
    };
  });
  assert.equal(closed.open, false, "Escape should close the chat");
  assert.equal(closed.hidden, "true", "the closed window stays hidden from assistive tech");
  assert.equal(closed.inert, true, "a closed window must be inert so its controls leave the tab order");
  await page.close();
});
