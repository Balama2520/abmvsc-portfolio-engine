# Security Policy

## Supported versions

| Version | Supported |
| ------- | --------- |
| 3.x     | Yes       |
| < 3.0   | No        |

## What this project is

The Portfolio Engine is a **fully static template**. It ships no server,
no database, no authentication and no user accounts. Everything runs in the
visitor's browser from files in this repository.

That drastically shrinks the attack surface, but it does not remove it. The
things worth reporting are:

- **XSS in the hydration engine.** `script.js` builds HTML from `config.js`.
  If a crafted config value can break out of an attribute or element and execute
  script, that is a real vulnerability — even though the "attacker" is usually
  the site owner.
- **XSS or data leakage in the config generator.** `setup.html` renders values
  from user input and from imported `config.js` files, and writes into an
  `<iframe>`. Anything that escapes the preview sandbox matters.
- **Leaked secrets or private data** accidentally committed to the template.
- **Dependency issues** in the development-only tooling (`jsdom`). Note this
  never ships to users.

The following are **not** security issues:

- Content a site owner deliberately put in their own `config.js`.
- The demo data shipped in the template.
- Anything requiring an already-compromised browser or machine.

## Reporting a vulnerability

Report privately, not in a public issue.

Use GitHub's private reporting:

1. Go to the **Security** tab of this repository.
2. Click **Report a vulnerability**.
3. Include: what you found, the steps to reproduce, the impact, and any
   suggested fix.

If you cannot use GitHub's advisory form, open a minimal issue asking a
maintainer to contact you privately. Do not put any details of the vulnerability
in a public issue.

## What to expect

- **Acknowledgement** within 5 working days.
- **An assessment** (accepted / needs more info / out of scope) within 10
  working days.
- **A fix and release** for accepted issues as quickly as is reasonable, with
  credit to you in the release notes unless you prefer to stay anonymous.

Please give us a reasonable window to release a fix before disclosing publicly.
We will keep you updated throughout.

## Hardening your own deployment

If you deploy this template, a few things are worth doing:

- Set `seo.siteUrl` to your real domain so canonical URLs cannot be spoofed.
- Keep the security headers in [`netlify.toml`](netlify.toml) / [`_headers`](_headers) —
  they add `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy` and a
  `Permissions-Policy`.
- Do not commit real `.env` files or credentials; `.gitignore` already covers
  the common cases.
- `setup.html` is a build tool. It is marked `noindex` and given an
  `X-Robots-Tag`. If you do not want it on your live site at all, simply delete
  `setup.html`, `setup.css` and `setup.js` before deploying — nothing else
  depends on them.
