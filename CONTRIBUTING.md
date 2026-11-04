# Contributing to ABMVSC Portfolio Template

Thank you for your interest in contributing! This project is maintained by **ABMVSC Technology & Innovation Studio**.

---

## How to Contribute

### Report a Bug
1. Open a [GitHub Issue](https://github.com/Balama2520/abmvsc-portfolio-template/issues)
2. Use the label `bug`
3. Include: browser, OS, screenshot, and steps to reproduce

### Suggest a Feature
1. Open a [GitHub Issue](https://github.com/Balama2520/abmvsc-portfolio-template/issues)
2. Use the label `enhancement`
3. Describe the use case clearly

### Submit a Pull Request
1. Fork the repository
2. Create a branch: `git checkout -b feature/your-feature-name`
3. Make your changes
4. Test in Chrome, Firefox, and Safari
5. Open a Pull Request against `main`

---

## Code Standards

- **HTML:** Semantic, accessible, ARIA labels on interactive elements
- **CSS:** Use existing CSS variables from `:root` — do not hardcode colours
- **JS:** ES6+, no external libraries, graceful fallbacks for older browsers
- **Comments:** Write comments that explain *why*, not *what*

---

## Testing Checklist

**Run the suite first — it catches most of this for you:**

```bash
npm install
npm test
```

CI runs the same command, so a green suite locally means a green build.

Before submitting, confirm:
- [ ] `npm test` passes (hydration contract + guardrails)
- [ ] `node --check script.js` and `node --check config.js` return no errors
- [ ] Both pages hydrate with no errors in the browser console
- [ ] No user content is hardcoded in `index.html` / `studio.html` — everything comes from `config.js`
- [ ] Every `data-list` name has a matching entry in `RENDERERS` and `LIST_COUNTS`
- [ ] Emptying any array in `config.js` hides its section cleanly (and its nav link)
- [ ] Chatbot responds to: hello, skills, projects, contact, resume
- [ ] Mobile responsive (test at 375px, 768px, 1280px)
- [ ] Colour and font overrides in `config.theme` take effect

### What you must never break

The guardrails in `test/guardrails.test.mjs` exist because these are the promises
that make the template worth using. A PR that trips one of them will be closed:

| Promise | Enforced by |
|---|---|
| No runtime dependencies | `package.json` has no `dependencies` |
| No build step | No `build` / `prepare` / `preinstall` scripts |
| No third-party JavaScript | No `<script src="https://…">` in the pages |
| No broken file references | Every `href` / `src` resolves to a real file |
| Content lives in `config.js` | `index.html` / `studio.html` contain no user content |

If a change seems to require breaking one of these, open an issue to discuss it
first — the answer is usually a different design, not a relaxed guardrail.

---

## Project Structure

```
config.js        ← User-editable data (never put logic here)
script.js        ← Hydration engine, site chrome, chatbot, SEO injection
style.css        ← Design system (CSS variables at the top)
index.html       ← Personal portfolio layout  (data-page="portfolio")
studio.html      ← Company / studio layout    (data-page="studio")

setup.html       ← Config generator UI
setup.css        ← Generator styles (scoped under .gen-*)
setup.js         ← Generator logic (SCHEMA is the single description of config)

test/            ← Regression suite (run with `npm test`)
```

> If you add a config field, add it to `SCHEMA` in `setup.js` too — otherwise the
> generator cannot set it, and the round-trip test will fail.

### The HTML Contract

The engine binds content through data attributes, so any new markup must follow this contract:

| Attribute | Purpose |
|---|---|
| `data-bind="dotted.path"` | Inject a single config value as text |
| `data-list="key"` | Render a repeating list into an empty container |
| `data-list-host` | The element to hide when that list is empty |
| `data-section="key"` | Show/hide a section (and its nav link) based on content presence |
| `data-page` on `<html>` | Selects portfolio vs studio context |

When adding a new list, register it in **both** `RENDERERS` and `LIST_COUNTS` in `script.js` — section visibility is derived from `LIST_COUNTS` automatically.


---

## Contact

**ABMVSC Technology & Innovation Studio**
- Email: contact@abmvsc.studio
- GitHub: [github.com/Balama2520](https://github.com/Balama2520)

