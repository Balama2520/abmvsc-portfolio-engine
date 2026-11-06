# Portfolio Engine roadmap

Continue at the first unchecked task. Each task requires a passing `npm test`,
one commit, and a push of `v3.1-generator`.

## Launch fixes — 6 November 2026

- [x] 1.1 Generate deployment host files inside ZIPs.
  Decision: `pack.js` owns `_headers`, `netlify.toml`, `vercel.json`, and
  `.nojekyll`, so the generator never fetches host-only files that a deployed
  site does not serve. The CSP is unchanged: `script-src 'self'`,
  `style-src 'self' 'unsafe-inline'`, and all other directives remain the
  same. `config.js` remains non-cacheable.
- [x] 1.2 Test generated host files against repository headers.
  Decision: the test compares the meaningful lines of generated `_headers` and
  `netlify.toml` with their repository versions, ignoring comments and blank
  lines. It also checks Vercel's JSON carries the same CSP.
- [x] 1.3 Handle optional and required missing ZIP files clearly.
  Decision: copied source files stop the ZIP build with the file name and a
  reload instruction. Optional references are skipped. Generated names are
  never fetched. The underlying error is written to the console.

- [x] 2.1 Make the browser test server behave like a deployment host.
  Decision: the server returns 404 for host-only configuration, `package.json`,
  and test paths, and applies the root `_headers` policy to successful
  responses.
- [ ] 2.2 Fail the production ZIP flow on browser errors and missing files.
- [x] 2.3 Inspect every required ZIP entry in the production flow.
  Decision: the Chromium ZIP smoke test checks the host files, generated
  artwork, uploaded photo and PDF, plus every HTML and manifest reference.

## Phase 1 — Security and privacy

Note: 1.5 was done before 1.4. The CSP check needs the third-party font request
gone first, so the headers could be added with zero violations.

Note: the generator's live preview loads the normal same-origin page inside an
iframe. Its temporary details are stored locally before the frame loads, so
Firefox can enforce `script-src 'self'` without the opaque origin that `srcdoc`
creates. The policy stays script-src 'self' with no inline allowance.

- [x] 1.1 Use strict JSON config files; safe import validation; move notes to SETUP.md.
- [x] 1.2 Add a shared URL allowlist in generator, packer, and runtime.
- [x] 1.3 Add permanent malicious-input ZIP/browser regression coverage.
- [x] 1.4 Add and test CSP headers and HTML fallback.
- [x] 1.5 Self-host fonts and block third-party requests by default.
- [x] 1.6 Update CI for Node 22 and Chromium, Firefox, and WebKit.

## Phase 2 — Beginner experience

- [x] 2.1 Add plain hints and examples to every field.
- [x] 2.2 Add locally computed recruiter-readiness checklist. (Replaces the raw field counter.)
- [x] 2.3 Add project case-study helper fields and card rendering.
- [x] 2.4 Add a visible "Saved on this device" autosave note. (Named local
  profiles dropped: the master plan scopes this task to the autosave note only.)
- [x] 2.5 Resize, compress, and crop uploaded photos locally.
- [x] 2.6 Replace technical errors with plain recovery guidance.
- [x] 2.7 Complete mobile-first generator interaction work.
- [x] 2.8 Cancelled: the master plan says English only, no strings file, no RTL.

## Phase 3 — Output quality

- [x] 3.1 Cancelled: the master plan lists "a second layout" as out of scope.
- [x] 3.2 Generate social preview and favicon assets in-browser.
  Decision: the social preview is referenced by its full address (og:image and
  twitter:image) because a crawler needs that. The favicons stay relative: an
  absolute icon URL would break the preview of an unzipped folder, and it works
  the same once deployed.
- [x] 3.3 Add print-friendly resume output.
  Decision: the print sheet hides the on-screen furniture (navbar, chat, skills
  ticker, hero buttons, section footers, demo notices, the built-by line) and
  forces black on white in every theme, rather than trying to cram the whole
  portfolio onto a single sheet. Headings stay with the text under them and
  cards are not split across pages.
- [x] 3.4 Cancelled: the master plan lists "JSON Resume" as out of scope.
- [x] 3.5 Cancelled: the master plan lists "GitHub import" as out of scope.
- [x] 3.6 Add client-side vCard download.
  Decision: the "Save contact" button sits in the hero action row and builds a
  vCard 3.0 file in the browser from config.js, so nothing is uploaded and the
  archive needs no extra file. Long lines are folded and commas and semicolons
  are escaped as the format requires. The button is hidden when there is no
  name, email or phone to save.
- [x] 3.7 Add deploy guide, .nojekyll, and config cache hash to ZIPs.
- [x] 3.8 Enforce generated-site performance budget.
  Decision: the budget covers the generated HTML, CSS and JavaScript — the code a
  visitor must download and parse before the site can be read — with a test in
  test/pack.test.mjs that fails if it passes 180 KB on disk or 60 KB over the
  wire. Measured baseline on 5 November 2026 is about 128 KB on disk and 35 KB
  compressed. Photos, icons and fonts are the owner's own or self-hosted files,
  so they are not part of this budget. The master plan does not name this task,
  so this is the simplest safe reading of it.

## Phase 4 — Quality gates

- [x] 4.1 Add axe-core accessibility coverage.
  Decision: axe-core runs in real Chromium through Playwright in test/a11y.test.mjs,
  scanning the generator once and both generated pages in the light, dark and
  minimal themes. A theme only exists when the runtime blends the accent shades
  from config.theme.mode, so each themed page is served its own config by
  intercepting the request; the scan runs with the content policy lifted because
  axe is injected at test time. The bar is zero serious or critical issues, which
  the run meets. The colour fixes this needed (brand ink on dark surfaces, the
  skills marquee, the highlighted achievement card, footer links, the closed chat
  window made inert) cover the plan's "contrast of every text pair at least
  4.5:1", which overlaps task 4.6.
- [x] 4.2 Add full keyboard-only flow coverage.
  Decision: test/keyboard.test.mjs drives real Tab presses in Chromium. It walks
  the generator (with every section shown) and both generated pages, checking
  that each visible control is reachable, that each one shows a focus ring while
  focused, that every field has a label, and that the generator's toast and
  saved note are polite live regions that a real action fills. A closed chat
  window or resume dialog is left out of the walk, as a real Tab cannot reach it
  either, and the embedded live preview is taken out because it is a second
  document whose keyboard access the generated-pages walk already covers. The
  test found and fixed three real gaps: the colour text boxes and the list-item
  text boxes had no name for a screen reader. It also exposed a race in the
  page harness: the generator paints its form, then imports config.js and paints
  the list items, so hydration.test.mjs now waits for that import instead of
  trusting a fixed sleep.
- [x] 4.3 Add Lighthouse checks and thresholds.
  Decision: `test/lighthouse.test.mjs` audits the generated index and studio
  pages in mobile and desktop Lighthouse runs. Accessibility, best practices,
  and SEO must each score at least 90. Performance has a 35 regression floor:
  the current unminified static bundle and local font transfer make the mobile
  baseline vary in the low 40s, so bundle optimization needs its own measured task rather
  than hiding a lower score behind an arbitrary universal threshold.
- [ ] 4.4 Run cross-browser ZIP smoke tests.
- [ ] 4.5 Review and document all required screenshots.
- [ ] 4.6 Verify contrast in all themes.

## Phase 5 — Repository and docs

Note: the studio email also appeared in SETUP.md, so it was replaced there too
for consistency. package.json homepage was set to a neutral placeholder; the
repository and bugs URLs stay pointed at the real repo so the links keep working.

- [x] 5.1 Reorder and update README with live screenshots.
- [x] 5.2 Remove personal policy emails and inspect GitHub templates.
- [x] 5.3 Remove orphan assets, unused CSS, and scratch files.
- [x] 5.4 Run spelling and banned-word checks.
- [x] 5.5 Update changelog, test count, and draft release notes.
- [x] 5.6 Add plain-language privacy documentation.

## Phase 6 — Final report

- [ ] 6.1 Write REPORT.md with verification, risks, and unverified work.
