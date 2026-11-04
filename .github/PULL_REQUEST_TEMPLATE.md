## What does this change?

<!-- One or two sentences. Link the issue it closes, if there is one. -->

Closes #

## Why?

<!-- The reasoning. "Why" matters more than "what" in this repo. -->

## Type of change

- [ ] Bug fix
- [ ] New feature
- [ ] Documentation
- [ ] Refactor (no behaviour change)
- [ ] Styling / design

## The guardrails

This project's value is that it stays **zero-dependency, no build step, and
config-driven**. Please confirm:

- [ ] No runtime dependencies were added.
- [ ] No user content was hardcoded into `index.html` or `studio.html`.
- [ ] Any new content is driven by `config.js` through `data-bind` / `data-list` / `data-section`.
- [ ] Any new list key was registered in **both** `RENDERERS` and `LIST_COUNTS` in `script.js`.
- [ ] If I added a config field, I also added it to `SCHEMA` in `setup.js` so the generator can set it.
- [ ] The site still degrades gracefully — emptying a field or array hides the element cleanly.

## How was it verified?

- [ ] `npm test` passes
- [ ] Checked `index.html` in a browser
- [ ] Checked `studio.html` in a browser
- [ ] Checked the generator at `setup.html`
- [ ] Checked at mobile width (~375px)

<!-- Paste any relevant console output, screenshots or before/after notes. -->
