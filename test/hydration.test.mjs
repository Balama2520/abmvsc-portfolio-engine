/* Portfolio Engine — regression tests */
// These tests lock in the engine's contract:
//
//   1. config.js defines all 15 sections.
//   2. setup.html's generator renders every section.
//   3. The generator round-trips config.js with ZERO data loss.
//   4. index.html hydrates from config.js (Person structured data).
//   5. studio.html hydrates from config.js (Organization structured data).
//
// DEVELOPMENT ONLY. The template that ships to users has no dependencies
// and no build step — jsdom is used purely to run the pages headlessly.
//
//   npm install && npm test

import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { JSDOM, VirtualConsole, ResourceLoader } from "jsdom";

const require = createRequire(import.meta.url);
const Pack = require("../pack.js");

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const MIME = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".ico": "image/x-icon",
  ".pdf": "application/pdf",
  ".xml": "application/xml",
  ".txt": "text/plain",
  ".webmanifest": "application/manifest+json",
};

const SECTIONS = [
  "personal", "seo", "hero", "about", "skills", "projects", "experience",
  "education", "research", "achievements", "certifications", "company",
  "contact", "chatbot", "theme",
];

/* A tiny static server so the pages load exactly as they would live */

let server;
let base;

before(async () => {
  server = http.createServer((req, res) => {
    const rel = decodeURIComponent(req.url.split("?")[0]).replace(/^\/+/, "") || "index.html";
    const file = path.join(ROOT, rel);
    if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      res.writeHead(404);
      res.end("not found");
      return;
    }
    res.writeHead(200, { "Content-Type": MIME[path.extname(file)] || "application/octet-stream" });
    res.end(fs.readFileSync(file));
  });
  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  base = `http://127.0.0.1:${server.address().port}`;
});

after(() => server.close());

/* Load a page headlessly and collect anything it complains about */

// Keep the suite hermetic: never reach out to Google Fonts or anywhere else.
class LocalOnly extends ResourceLoader {
  fetch(url, options) {
    return url.startsWith(base) ? super.fetch(url, options) : null;
  }
}

async function loadPage(file, { settle = 900 } = {}) {
  const errors = [];
  const virtualConsole = new VirtualConsole();
  virtualConsole.on("jsdomError", (e) => errors.push(String(e?.message ?? e)));
  virtualConsole.on("error", (m) => errors.push(String(m)));

  const html = await fetch(`${base}/${file}`).then((r) => r.text());

  const dom = new JSDOM(html, {
    runScripts: "dangerously",
    resources: new LocalOnly(),
    pretendToBeVisual: true,
    url: `${base}/${file}`,
    virtualConsole,
    // jsdom ships no fetch; node's global fetch resolves relative URLs for us.
    beforeParse(window) {
      window.fetch = (i, init) => fetch(new URL(String(i), window.location.href).href, init);
      // jsdom also omits the encoding classes every browser has. The ZIP writer
      // needs them to turn file names and text files into bytes.
      window.TextEncoder = TextEncoder;
      window.TextDecoder = TextDecoder;
    },
  });

  await new Promise((r) => setTimeout(r, settle));
  return { dom, doc: dom.window.document, errors };
}

const readConfig = (file = "config.js") => {
  const src = fs.readFileSync(path.join(ROOT, file), "utf8");
  return new Function("window", `${src};return window.PORTFOLIO_CONFIG;`)({});
};

// Every leaf path in a config object, e.g. "personal.email", "projects[].name"
function leafPaths(obj, prefix = "", out = new Set()) {
  if (Array.isArray(obj)) {
    obj.forEach((v) => leafPaths(v, `${prefix}[]`, out));
  } else if (obj && typeof obj === "object") {
    Object.keys(obj).forEach((k) => leafPaths(obj[k], prefix ? `${prefix}.${k}` : k, out));
  } else if (prefix) {
    out.add(prefix);
  }
  return out;
}

/* 1. Contract */

test("config.js defines all 15 documented sections", () => {
  const cfg = readConfig();
  for (const key of SECTIONS) {
    assert.ok(key in cfg, `config.js is missing the "${key}" section`);
  }
});

test("browsing pages are content-free (content lives in config.js)", () => {
  for (const file of ["index.html", "studio.html"]) {
    const html = fs.readFileSync(path.join(ROOT, file), "utf8");
    assert.ok(html.includes('data-page='), `${file} must declare data-page`);
    assert.ok(!/Alex Rivera/.test(html), `${file} still contains demo content — it must be config-driven`);
  }
});

/* 2. The generator */

test("setup.html is excluded from search engines", () => {
  const html = fs.readFileSync(path.join(ROOT, "setup.html"), "utf8");
  assert.match(html, /name="robots"\s+content="noindex/);
  const sitemap = fs.readFileSync(path.join(ROOT, "sitemap.xml"), "utf8");
  assert.ok(!sitemap.includes("setup.html"), "setup.html must not appear in sitemap.xml");
});

test("the generator renders every section", async () => {
  const { doc, errors } = await loadPage("setup.html");
  const cards = doc.querySelectorAll("#genSections > .gen-card");
  assert.equal(cards.length, 15, "one collapsible card per config section");
  assert.ok(doc.querySelectorAll("[data-path]").length > 100, "form fields are rendered");
  assert.deepEqual(errors, [], `setup.html logged errors:\n${errors.join("\n")}`);
});

test("the generator offers the ZIP download and the follow-up steps", async () => {
  const { doc, errors } = await loadPage("setup.html");
  assert.ok(doc.querySelector("#genZipBtn"), "the ZIP download button is present");
  assert.ok(doc.querySelector("#genWhatNow"), "the what-now panel is present");
  assert.ok(doc.querySelector("#genWhatNow").hidden, "the panel stays hidden until a download finishes");
  assert.deepEqual(errors, []);
});

test("the generator round-trips config.js with zero data loss", async () => {
  const { doc } = await loadPage("setup.html");
  const generated = doc.querySelector("#genOutput").value;
  assert.ok(generated.length > 1000, "generator produced output");

  const genCfg = new Function("window", `${generated};return window.PORTFOLIO_CONFIG;`)({});
  const realLeaves = leafPaths(readConfig());
  const genLeaves = leafPaths(genCfg);

  const dropped = [...realLeaves].filter((p) => !genLeaves.has(p));

  assert.deepEqual(
    dropped,
    [],
    `The generator dropped these config paths — a user would silently lose data:\n  ${dropped.join("\n  ")}`
  );
});

test("the generated config.js opens with the config, not a comment banner", async () => {
  const { doc } = await loadPage("setup.html");
  const generated = doc.querySelector("#genOutput").value;

  assert.ok(
    !/^\s*(\/\*|\/\/|<!--)/.test(generated),
    `generated config.js starts with a comment:\n  ${generated.slice(0, 120)}`
  );
  assert.match(
    generated,
    /^window\.PORTFOLIO_CONFIG\s*=/,
    "generated config.js must begin with the config assignment"
  );
});

test("array-shaped sections keep their shape through the generator", async () => {
  const { doc } = await loadPage("setup.html");
  const generated = doc.querySelector("#genOutput").value;
  const genCfg = new Function("window", `${generated};return window.PORTFOLIO_CONFIG;`)({});

  // These five live as a bare array in config.js, not as { key: [...] }.
  for (const key of ["projects", "experience", "research", "achievements", "certifications"]) {
    assert.ok(Array.isArray(genCfg[key]), `"${key}" must stay an array, got ${typeof genCfg[key]}`);
  }
  assert.ok(!Array.isArray(genCfg.contact), "contact is an object with a links list");
});

/* 3. Hydration */

test("index.html hydrates from config.js", async () => {
  const { doc, errors } = await loadPage("index.html");

  assert.equal(doc.title.length > 0, true, "title was injected");
  assert.ok(doc.querySelector('meta[property="og:title"]'), "Open Graph tags were injected");
  assert.ok(doc.querySelector('link[rel="canonical"]'), "canonical link was injected");

  const ld = doc.getElementById("pf-ld-json");
  assert.ok(ld, "JSON-LD was injected");
  assert.equal(JSON.parse(ld.textContent)["@type"], "Person");

  assert.ok(doc.querySelectorAll(".project-card").length > 0, "projects rendered");
  assert.ok(doc.querySelectorAll(".skill-card").length > 0, "skills rendered");
  assert.ok(doc.querySelectorAll(".contact-link-card").length > 0, "contact links rendered");

  assert.deepEqual(errors, [], `index.html logged errors:\n${errors.join("\n")}`);
});

test("studio.html hydrates from config.js", async () => {
  const { doc, errors } = await loadPage("studio.html");

  const ld = doc.getElementById("pf-ld-json");
  assert.ok(ld, "JSON-LD was injected");
  assert.equal(JSON.parse(ld.textContent)["@type"], "Organization");

  assert.ok(doc.querySelectorAll(".contact-link-card").length > 0, "contact links rendered");
  assert.deepEqual(errors, [], `studio.html logged errors:\n${errors.join("\n")}`);
});

test("both pages inject SEO tags from config, not from HTML", async () => {
  const { doc } = await loadPage("index.html");
  const cfg = readConfig();
  assert.equal(doc.title, cfg.seo.title);
  const desc = doc.querySelector('meta[name="description"]');
  assert.equal(desc.getAttribute("content"), cfg.seo.description);
});

test("the hero headline keeps the & from the role", async () => {
  const cfg = readConfig();
  if (!String(cfg.personal.role).includes("&") || cfg.hero.titleLine2) {
    return; // nothing to split, or the headline was set explicitly
  }
  const { doc } = await loadPage("index.html");
  const line2 = doc.querySelector('[data-bind="hero.titleLine2"]');
  assert.ok(
    line2 && line2.textContent.trim().startsWith("&"),
    `the second headline line dropped the "&": ${line2 && JSON.stringify(line2.textContent)}`
  );
});

/* 4. Graceful degradation */

test("the studio card hides itself when no card image is configured", async () => {
  const cfg = readConfig();
  const configured = !!(cfg.company && cfg.company.logo && cfg.company.logo.card);
  if (configured) return; // nothing to assert while a card image is set

  for (const file of ["index.html", "studio.html"]) {
    const { doc } = await loadPage(file);
    const wraps = [...doc.querySelectorAll('[data-section="company-logo"]')];
    assert.ok(wraps.length > 0, `${file} should have a studio card block`);
    wraps.forEach((el) => {
      assert.ok(
        el.hasAttribute("hidden"),
        `${file} shows the studio card block with no image configured — that renders an empty box`
      );
    });
  }
});

test("the demo banner offers one clear route to the generator", async () => {
  const cfg = readConfig();
  const expected = cfg.theme && cfg.theme.showDemoNotice === true;

  for (const file of ["index.html", "studio.html"]) {
    const { doc } = await loadPage(file);
    const banner = doc.querySelector("[data-demo-banner]");
    assert.ok(banner, `${file} is missing the demo banner`);
    assert.equal(
      banner.hasAttribute("hidden"),
      !expected,
      `${file} demo banner visibility does not follow theme.showDemoNotice`
    );
    if (expected) {
      const cta = banner.querySelector("a");
      assert.ok(
        cta && /setup\.html/.test(cta.getAttribute("href") || ""),
        `${file} demo banner has no link to the generator`
      );
    }
  }
});

test("the static head matches what the runtime engine injects", async () => {
  const cfg = readConfig();
  const content = (doc, sel) => {
    const el = doc.querySelector(sel);
    return el && el.getAttribute("content");
  };
  const href = (doc, sel) => {
    const el = doc.querySelector(sel);
    return el && el.getAttribute("href");
  };

  for (const file of ["index.html", "studio.html"]) {
    const { doc } = await loadPage(file);
    const staticHtml = Pack.prerenderPage(
      fs.readFileSync(path.join(ROOT, file), "utf8"),
      cfg,
      file
    );
    // No scripts: this is exactly what a crawler sees.
    const staticDoc = new JSDOM(staticHtml).window.document;

    assert.equal(staticDoc.title, doc.title, `${file}: static title differs from the runtime value`);
    assert.equal(
      content(staticDoc, 'meta[property="og:title"]'),
      content(doc, 'meta[property="og:title"]'),
      `${file}: static og:title differs`
    );
    assert.equal(
      content(staticDoc, 'meta[property="og:description"]'),
      content(doc, 'meta[property="og:description"]'),
      `${file}: static og:description differs`
    );
    assert.equal(
      href(staticDoc, 'link[rel="canonical"]'),
      href(doc, 'link[rel="canonical"]'),
      `${file}: static canonical differs`
    );
    assert.deepEqual(
      JSON.parse(staticDoc.getElementById("pf-ld-json").textContent),
      JSON.parse(doc.getElementById("pf-ld-json").textContent),
      `${file}: static structured data drifted from the runtime version`
    );
  }
});

test("every data-list in the HTML is registered in the engine", () => {
  const script = fs.readFileSync(path.join(ROOT, "script.js"), "utf8");
  const required = new Set();
  for (const file of ["index.html", "studio.html"]) {
    const html = fs.readFileSync(path.join(ROOT, file), "utf8");
    for (const m of html.matchAll(/data-list="([^"]+)"/g)) required.add(m[1]);
  }
  const missing = [...required].filter(
    (k) => !new RegExp(`(^|[\\s{,])(["']${k}["']|${k})\\s*:`).test(script)
  );
  assert.deepEqual(
    missing,
    [],
    `These data-list keys have no renderer in script.js: ${missing.join(", ")}`
  );
});
