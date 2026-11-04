# Changelog

All notable changes to the ABMVSC Portfolio Template are documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [3.0.0] — 2026-11-03

### Added
- **`setup.html` — a full in-browser config generator.** A schema-driven form for all 15 config sections with a live preview of both pages, a completeness meter, paste-ready output, `config.js` import/export, and local draft saving. Replaces the old modal generator. Ships as `setup.html` + `setup.css` (scoped under `.gen-*`) + `setup.js`.
- **Removable footer credit** — `theme.showBuiltBy` (default `true`) controls the "Built with the ABMVSC Portfolio Engine" line, rendered by `hydrateBuiltBy()` into `[data-built-by]` on both pages. Set it to `false` for a clean footer.
- **Derived (VIRTUAL) bindings** in `script.js` — `hero.eyebrow`, `hero.badge`, `hero.titleLine1/2`, `company.eyebrow`, `company.titleLine1/2` and `company.heroParagraph` now compute sensible fallbacks instead of rendering blank when unset.
- **New list renderers & keys** — `about-paragraphs`, `about-reasons`, `purpose-paragraphs`, plus a generic paragraph block renderer.
- **`data-list-host` attribute** — marks the exact element to hide when a list is empty, so a multi-list section is no longer hidden by one empty list.
- **`themes` in config** — `theme.blueColor` and `theme.fontHeading` / `fontBody` / `fontMono` are now applied as CSS custom properties at runtime.
- `[hidden] { display: none !important; }` global utility so `hidden` always beats component `display` rules.
- New styles: `.skill-grid`, `.skill-card`, `.skill-tags`, `.project-status`, `.metric-list`, `.about-vision`, `.pillars-five-grid`.

### Changed
- **`script.js` rewritten as a full hydration engine.** `data-bind` (text), `data-list` (repeating content), `data-section` (show/hide), `data-page` (portfolio vs studio) and `data-list-host` now drive 100% of both pages.
- **`index.html` and `studio.html` rewritten as pure layout.** Roughly 80% of their content was hardcoded; both now contain no user content at all.
- **`config.js` rewritten to a 15-section schema** (personal, seo, hero, about, skills, projects, experience, education, research, achievements, certifications, company, contact, chatbot, theme) — the genuinely single source of truth.
- **SEO is now injected at runtime** — title, description, canonical, Open Graph, Twitter Card and JSON-LD (`Person` / `Organization`) are written into `<head>` by the engine. The static tags were removed from both HTML files.
- `SECTION_TESTS` is now generated for every list key, so any empty array correctly hides its section and nav link.
- `:root` now defines `--blue` and the three font variables; `--accent` maps to `--blue`.
- `README.md` and `SETUP.md` rewritten for the config-first v3 model, both documenting the new generator; `CONTRIBUTING.md` documents the HTML data-attribute contract.

### Removed
- **The old `config.js` generator modal** and the "Create Yours Free" navbar button — removed from both HTML files, `script.js` and `style.css`, and replaced by the standalone `setup.html` page above.
- **The `brain` object flow** — the chatbot now reads straight from `window.PORTFOLIO_CONFIG`; no duplicate data to maintain.
- All hardcoded personal/company content from the HTML pages.

### Fixed
- CSS/JS variable mismatch: the engine set `--blue` and font variables that `:root` never defined.
- Lists inside containers with a `display` rule (`.skills-bar`, `.stat-row`, `.contact-grid`) would not hide via the `hidden` attribute.
- **Generator data loss on export.** Sections whose id matched their list key (`projects`, `experience`, `research`, `achievements`, `certifications`) were emitted as `projects: { projects: [...] }` instead of a bare array. The malformed file broke those sections on the live site, and importing an existing `config.js` silently dropped them. Fixed with an `isArraySection()` check used by both `normalize()` and `buildConfig()`.
- **Generator could not set `company.purposeVision`** — the field was missing from the `company` section schema.

### Tooling & repository (added after the 3.0.0 code changes)
- **Regression test suite** — `test/hydration.test.mjs` and `test/guardrails.test.mjs`, run with `node --test` (jsdom as a dev-only dependency). 18 tests covering hydration, SEO injection, generator round-tripping, and the project's guardrails.
- **GitHub Actions CI** — `.github/workflows/validate.yml` runs the suite on every push and pull request.
- **Enforced guardrails** — tests fail if a runtime dependency, a build step, third-party JavaScript, or a broken file reference is introduced.
- **`netlify.toml` + `_headers`** — security headers (`nosniff`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`) and correct caching: `config.js` is never cached, hashed assets are immutable for a year.
- **`CODE_OF_CONDUCT.md`** (Contributor Covenant 2.1) and **`SECURITY.md`** with a private reporting route.
- **Issue forms** (`.github/ISSUE_TEMPLATE/`) and a **pull request template** with a guardrail checklist.
- **`assets/readme-architecture.svg`** — architecture diagram used in the README.
- `package.json` added for the test runner only; `package-lock.json` is committed for reproducible CI.
- `.gitignore` no longer ignores `package-lock.json`, and documents why `node_modules` exists.
- **`.gitattributes`** — `text=auto` normalisation so the repo behaves identically on Windows, macOS and Linux instead of depending on each contributor's `core.autocrlf`; binary formats and the hand-authored SVGs are pinned explicitly.
- **`SETUP.md` — "The Checklist — before you deploy"** — one consolidated pass covering config fields, media swaps, search-engine files and housekeeping, so a new user does not ship the demo content by accident.
- README test transcript corrected to list all 18 tests (it previously showed 14).

---

## [2.0.0] — 2026-11-02

### Added
- `config.js` — Single-file configuration system. Users now edit ONE file only.
- Dynamic chatbot brain built from `PORTFOLIO_CONFIG` — no hardcoded data in engine.
- Auto-generated chatbot responses from skills, projects, experience, research arrays.
- `LICENSE` — MIT open-source licence added.
- `SETUP.md` — Quick-start guide for first-time users.
- `CONTRIBUTING.md` — Contribution guidelines.
- `CHANGELOG.md` — This file.
- `.gitignore` — Ignores backup folders, OS files, `.env`, `node_modules`.
- Full favicon package: ICO, PNG 16/32, Apple Touch, Android Chrome 192/512, PWA manifest.
- `site.webmanifest` — PWA-ready with ABMVSC branding and theme colour.

### Changed
- `README.md` — Completely rewritten as a professional agency product page.
- `script.js` — Chatbot brain now reads from `window.PORTFOLIO_CONFIG`.
- `style.css` — Fixed orphan brace at line 1367, braces now perfectly balanced.
- Both HTML files now include `<script src="config.js">` before `script.js`.
- Removed duplicate `botInfo` intent rule from `intentRules`.

### Fixed
- Broken favicon references (apple-touch-icon.png, favicon-32x32.png, site.webmanifest) removed from both HTML files.
- CSS brace count balanced (238 open = 238 close).

---

## [1.0.0] — 2026-11-01

### Added
- Initial production release.
- Dual-page system: `index.html` (personal portfolio) + `studio.html` (ABMVSC Studio).
- AI Chatbot Engine with streaming, latency badge, telemetry, markdown rendering.
- 34 intent rules covering skills, projects, research, experience, system design, and more.
- Full SVG brand asset system: primary logo, white logo, mono logo, symbol, avatar.
- Scroll-spy navigation, smooth scrolling, scroll-reveal animations.
- Resume PDF modal with preview and download.
- SEO: Open Graph, Twitter Card, JSON-LD structured data, sitemap.xml, robots.txt.
- Google Search Console verification.
- Netlify-ready deployment (no build step required).

