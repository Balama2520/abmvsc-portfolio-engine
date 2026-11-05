# Changelog

All notable changes to the Portfolio Engine are documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [3.1.0] — 2026-11-04

### Added
- **Photo and resume uploads in the generator.** Both are now `type="file"` fields instead of text paths. A photo is checked for `jpg`/`png`/`webp` and 2 MB; a resume for `pdf` and 5 MB. Failures say which limit was hit and what to do. The uploaded bytes are kept in the tab, previewed from a blob URL, written into the ZIP under a predictable name, and `personal.photo` / `personal.resume` in the generated config point at them. A text-path field remains under **Advanced** for anyone hosting their own images.
- **"Download website (ZIP)".** `pack.js` is a dependency-free STORE-only ZIP writer and reader (CRC-32, MS-DOS timestamps). The file list is derived from what the pages actually reference, plus the icons, manifest and social image the manifest names indirectly, so an unzipped folder has no broken links and needs no server.
- **A "What now?" panel** that replaces the download button once the ZIP lands, with the unzip-and-deploy steps and the link to the same instructions in `SETUP.md`.
- **Three themes — light, dark and minimal** — plus one accent colour, all as CSS custom properties. Pick a colour in the generator and `script.js` derives readable hover, text and tint shades from it with `blend()`, so a light accent cannot produce unreadable text.
- **A real-browser test suite.** `test/browser-smoke.test.mjs` drives the generator in Chromium, uploads real files, takes the downloaded ZIP, unzips it, serves it and asserts the typed name renders with no console errors or 404s. `test/responsive.test.mjs` loads all three pages at 375px, 768px and 1280px and fails if anything overflows the viewport.
- **Guided wizard in the config generator.** The 15 sections are grouped into 6 chapters (You → Your work → Extras → Your company → Look & feel → Launch) and shown one at a time, with a clickable step rail, Back/Next navigation and a per-chapter completion mark. All 15 cards stay in the DOM and **Show everything** restores the previous flat form, so power users and the test suite are unaffected.
- **A "Launch" chapter that carries the user to a live site** — download the ZIP, take your own copy of the template, then deploy free on Netlify, with one-click copy buttons for the repository URL and the `git clone` command.
- **Demo notice** — `theme.showDemoNotice` drives a floating notice rendered by `hydrateDemoNotice()` into `[data-demo-notice]` on both pages. Every config produced by `setup.html` sets it to `false`, so the notice vanishes the moment a user replaces the sample `config.js`.
- **Strict data files and a safe import.** `config.js` is `window.PORTFOLIO_CONFIG = <strict JSON>;` — quoted keys, two-space indent, no comments, no trailing commas, both shipped and generated. Import and **Load current** strip the wrapper and use `JSON.parse`, so a file the user opens is read as data and never executed; `new Function` and `eval` are gone from the repository. A file in the older format is reported as "This file uses the old format. Re-export it from the generator." The importer checks the known sections and names the field that is wrong instead of failing silently.
- **A shared URL allowlist.** One `sanitizeUrl` function is used by the generator, the ZIP writer and the engine. Links allow `http`, `https`, `mailto` and `tel`; images also allow relative paths and `data:image/png|jpeg|webp`. `javascript:`, `vbscript:`, `data:text/html` and the usual case, whitespace and control-character tricks around them are rejected, and the field that was rejected is named.
- **A content security policy** in `netlify.toml`, `_headers` and as a `<meta http-equiv>` fallback in every page (`index.html`, `studio.html`, `setup.html`), so hosts that ignore headers are still covered. The policy is `default-src 'self'` with no inline script; the generator's live preview therefore ships its settings as a data block that `script.js` reads, instead of an inline script the policy would block.

### Changed
- **One accent colour instead of two.** The design system is now a single accent (`#FF7900`) plus one neutral scale. Orange is used for fills with navy text on top; a darker shade is used where orange text sits on a light background, so every combination clears WCAG AA at 4.5:1. The old `theme.blueColor`/`--blue` pair is gone — `blend()` in `script.js` derives what used to be hand-picked. A config that still carries `blueColor` loads without error; the field is simply ignored, and the round-trip test stays green.
- **The footer credit is opt-in, plain text and off by default.** `theme.showBuiltBy` adds "Made with the Portfolio Engine" with no link, so a generated site never points at somebody else's account. Brand attribution lives in `LICENSE` only.
- **The chat bubble is described as what it is.** It is a keyword matcher answered from `config.js`. The typing delay that faked latency, the token counter and the green "online" dot are gone; the header now says the answers come from the content on the page, and an unmatched question says so.
- **No pictographic icons.** Decorative SVGs, emoji and glow effects were removed from both pages; the footer credit is small text.
- **Fonts are self-hosted.** The five Inter, three Space Grotesk and two IBM Plex Mono weights now load from `assets/fonts/` as WOFF2 (Latin subset), replacing the Google Fonts request, so opening a page makes no request to a third party. The system-font fallbacks stay in place, so a name in a non-Latin script renders in a system font rather than empty boxes.
- **`README.md` restructured** to description → screenshot → try it → what you get → how it works → deploy → FAQ → contributing → licence, with real Chromium screenshots rather than mockups. `SETUP.md` and `CONTRIBUTING.md` were rewritten in the same plain, practical voice.
- `package.json` now runs `node --test "test/*.test.mjs"` so the shared test helper is not collected as a test file.

### Fixed
- **The resume modal's Download button now follows `personal.resume`.** Both pages hardcoded `href="resume.pdf"`, so a user who pointed `personal.resume` at their own file got a preview of their CV but a download of the shipped sample. The anchor is marked `data-resume-download` and bound from config in `script.js` (with `resume.pdf` kept as the no-JS fallback).
- **Overflow at 375px.** `.about-grid` kept two columns inside the `max-width: 768px` breakpoint, which pushed `index.html` 112px wider than the viewport. The grid now collapses to one column; the responsive test asserts it stays collapsed.

### Removed
- **`config.bala.js`** — a reference config carrying the maintainer's real name, email, phone, social profiles and Search Console token. `SETUP.md` already told users to delete it, so it was dead weight in the repository. The "optional reference config parses too" test went with it.
- **`photo.jpg`** — a real personal photo that shipped with the template. `assets/engineer-avatar.svg` remains the neutral placeholder.
- **`google1813f9af1d0c0f59.html`** — a personal Search Console verification file, now redundant: the engine writes the tag from `seo.googleVerification`.
- **`theme.blueColor`** and its `--blue` variable, replaced by the single accent above.
- The stale `.chat-status-dot` rule and the hardcoded `blueColor` line in `SETUP.md`, both left behind by earlier changes.

### Notes
- **`resume.pdf` is a neutral placeholder** ("replace this file with your own"), not a real resume.
- **`robots.txt` and `sitemap.xml`** ship `your-domain.com` placeholders; `README.md` and `SETUP.md` use the HTML-tag method (`seo.googleVerification`) instead of dropping a verification file in the root.
- **Test count is 63.** They cover the configuration parser, the hydration engine, SEO injection, the ZIP writer and reader, the shared URL allowlist, a malicious-input pass in a real browser, a full Chromium run of the download-and-open path, and responsive layout at 375px, 768px and 1280px. The previous entry's "30" and the entry before it were accurate when written and are left as they were.
- Added `.editorconfig` so contributions never arrive as whitespace-only diffs.
- **`docs/PRIVACY.md`** explains in plain words what happens to typed details and uploads, and **`RELEASE_NOTES.md`** holds the v3.1.0 notes.

---

## [3.0.0] — 2026-11-03

### Added
- **`setup.html` — a full in-browser config generator.** A schema-driven form for all 15 config sections with a live preview of both pages, a completeness meter, paste-ready output, `config.js` import/export, and local draft saving. Replaces the old modal generator. Ships as `setup.html` + `setup.css` (scoped under `.gen-*`) + `setup.js`.
- **Removable footer credit** — `theme.showBuiltBy` (default `true`) controls the "Built with the Portfolio Engine" line, rendered by `hydrateBuiltBy()` into `[data-built-by]` on both pages. Set it to `false` for a clean footer.
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
- `site.webmanifest` — PWA-ready with neutral branding and theme colour.

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
- Dual-page system: `index.html` (personal portfolio) + `studio.html` (company studio page).
- AI Chatbot Engine with streaming, latency badge, telemetry, markdown rendering.
- 34 intent rules covering skills, projects, research, experience, system design, and more.
- Full SVG brand asset system: primary logo, white logo, mono logo, symbol, avatar.
- Scroll-spy navigation, smooth scrolling, scroll-reveal animations.
- Resume PDF modal with preview and download.
- SEO: Open Graph, Twitter Card, JSON-LD structured data, sitemap.xml, robots.txt.
- Google Search Console verification.
- Netlify-ready deployment (no build step required).

