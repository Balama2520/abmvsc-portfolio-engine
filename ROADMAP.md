# Portfolio Engine roadmap

Continue at the first unchecked task. Each task requires a passing `npm test`,
one commit, and a push of `v3.1-generator`.

## Phase 1 — Security and privacy

Note: 1.5 was done before 1.4. The CSP check needs the third-party font request
gone first, so the headers could be added with zero violations.

Note: the generator's live preview runs inside an iframe, and an iframe inherits
the page's policy. An inline <script> setting the preview config would be
blocked, so the preview now ships the config as a JSON block and script.js reads
it. The policy stays script-src 'self' with no inline allowance.

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
- [ ] 3.6 Add client-side vCard download.
- [x] 3.7 Add deploy guide, .nojekyll, and config cache hash to ZIPs.
- [ ] 3.8 Enforce generated-site performance budget.

## Phase 4 — Quality gates

- [ ] 4.1 Add axe-core accessibility coverage.
- [ ] 4.2 Add full keyboard-only flow coverage.
- [ ] 4.3 Add Lighthouse checks and thresholds.
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
