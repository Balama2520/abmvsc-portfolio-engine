# Rules for agents working on this repo

Project: Portfolio Engine, a static portfolio generator. The user fills a form
in setup.html and downloads a ZIP containing a ready-to-deploy site. Everything
runs in the browser.

## Hard constraints

- No runtime dependencies, no build step, no third-party JavaScript, no tracking.
- Dev-only dependencies (test tools) are allowed.
- No emoji in code, UI, docs or commits.
- Never run `git push --force`, `git reset --hard`, `git filter-repo`, or rewrite history.
- Never push to main and never merge. Work on branch `v3.1-generator` and push
  only that branch. The pull request is #1 (draft).
- Never commit `tmp-*` or scratch files.

## Working style

- One commit per change, imperative message.
- Run `npm test` after each change. Do not commit with failing tests.
- Push after each commit.
- Never claim something works unless you ran it or looked at it. Write
  "unverified" and say why.
- Plain language in UI text and docs. Banned words: seamless, leverage, robust,
  cutting-edge, empower, unlock, elevate, revolutionize, supercharge,
  game-changer, "in today's".
- User input must never be inserted as raw HTML, and never executed.

## Report format

- Per item: commit hash, test output, push result, what is unverified.
