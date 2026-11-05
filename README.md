<div align="center">

# ABMVSC Portfolio Engine

**Free portfolio website generator. Fill in your details, download your site, go live. No code, no account.**

Released for Diwali 2026. Free to use, no account, nothing uploaded.

A product of ABMVSC Technology & Innovation Studio.

[![License](https://img.shields.io/badge/License-MIT-10264B?style=for-the-badge)](LICENSE)
[![No Build Step](https://img.shields.io/badge/Build%20Step-none-FF7900?style=for-the-badge)](.)
[![Zero Dependencies](https://img.shields.io/badge/Dependencies-0-10264B?style=for-the-badge)](.)
[![Use This Template](https://img.shields.io/badge/Use%20this-template-10264B?style=for-the-badge)](../../generate)

[![Validate](https://github.com/Balama2520/abmvsc-portfolio-template/actions/workflows/validate.yml/badge.svg)](https://github.com/Balama2520/abmvsc-portfolio-template/actions/workflows/validate.yml)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-FF7900.svg?style=flat-square)](CONTRIBUTING.md)
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg?style=flat-square)](CODE_OF_CONDUCT.md)

</div>

---

## Screenshots

The generator, filling in six chapters of questions:

<img src="assets/screenshot-generator.png" alt="The generator, filling in the first chapter" width="100%" />

The finished personal portfolio:

<img src="assets/screenshot-portfolio.png" alt="A finished portfolio page" width="100%" />

The finished studio or company page:

<img src="assets/screenshot-studio.png" alt="A finished studio page" width="100%" />

---

## Try it

**[Open the generator](/setup.html)** — or run this copy yourself:

```bash
git clone https://github.com/Balama2520/abmvsc-portfolio-template.git
cd abmvsc-portfolio-template
npx serve .
```

Then open <http://localhost:3000/setup.html>. Answer what you can, skip the rest, and click **Download website (ZIP)**. Unzip the folder and put it online.

The live preview inside the generator reads `index.html` and `studio.html`, so it needs a local server. The form, the download, the import and the copy button all work from a plain `file://` open too.

---

## What you get

- **Two pages from one file** — a personal portfolio (`index.html`) and an optional studio or company page (`studio.html`). Text, lists, images, links, colours, fonts and SEO tags all come from `config.js`.
- **A generator that writes that file for you** (`setup.html`) — six chapters of questions, a live preview of both pages, a readiness checklist and a local draft that never leaves your browser.
- **A ZIP of the finished site** — pages, styles, script, your photo, your resume and the generated config. Every link inside it resolves within the folder, so an unzipped copy works offline.
- **SEO written into the page** — title, meta description, canonical URL, Open Graph, Twitter Card and JSON-LD structured data are baked into the HTML at download time, then refreshed from your details.
- **Three themes and one accent colour** — light, dark and minimal, applied as CSS custom properties. Pick a colour in the generator and the readable shades are derived for you.

---

## How it works in 3 steps

**1. Answer the generator.** Open `setup.html` and work through the chapters — You, Your work, Extras, Your company, Look & feel, Launch. Every field is optional; leave a field blank and its element disappears from the site, leave a list empty and its whole section disappears.

**2. Download the ZIP.** The generator writes a `config.js` and packs it with the pages, styles, script, your uploaded photo and your uploaded resume.

**3. Put the folder online.** Unzip it and upload the folder to any static host. Nothing to install, nothing to compile.

```
unzip your-site.zip
# drag the unzipped folder onto app.netlify.com/drop
```

---

## Privacy and network requests

Nothing is uploaded. There is no server, no account, no analytics and no third-party JavaScript. The generator runs entirely in your browser and saves your draft to your own `localStorage`; the ZIP is built in the page with a small ZIP writer that ships in the repository. Your photo and resume are read into the tab with `FileReader` and written straight into the ZIP.

When you load a page from this project, the only requests are for files in the same folder: the page, the stylesheet, the scripts and the fonts. Fonts are served from this repository, not a font service. The test suite fails if any request leaves the origin. See [docs/PRIVACY.md](docs/PRIVACY.md) for the full note.

---

## Deploy

Any static host works. In every case you upload the unzipped folder as-is.

| Host | Steps |
|---|---|
| **Netlify Drop** | Open [app.netlify.com/drop](https://app.netlify.com/drop), drag the folder in. An account is optional. |
| **GitHub Pages** | Push the folder to a repository, then **Settings → Pages → Deploy from branch → main → / (root)**. |
| **Cloudflare Pages** | Create a project, choose **Direct Upload**, drop the folder in. `_headers` is already set up for the caching and security headers. |
| **Vercel** | Import the repository. It detects a static site and needs no build command. |
| **Amazon S3 / any web host** | Upload the folder to the bucket or directory that serves your domain. |

Netlify reads `netlify.toml`, Cloudflare Pages reads `_headers`; both are included and both stop `config.js` from being cached, so an edit to your config shows up on the next load.

---

## FAQ

### Where does my data go?

Nowhere. There is no server, no account, no analytics and no third-party JavaScript. Your draft stays in your browser's `localStorage` and the ZIP is built in the page. Nothing is uploaded. The full note is in [docs/PRIVACY.md](docs/PRIVACY.md).

### Can I use my own domain?

Yes. Point the domain at your host, then set `seo.siteUrl` in `config.js` to that address and update the two `your-domain.com` placeholders in `sitemap.xml` and the one in `robots.txt`. Canonical URLs and social preview cards are built from `seo.siteUrl`, so the tags follow automatically.

### How do I change something after the site is live?

Edit `config.js` and re-upload that one file. If you deployed with Netlify Drop you can drag the whole folder in again, or connect the site to a Git repository and let a push update it. `config.js` is deliberately never cached, so the change appears on the next page load.

### Why does GitHub Pages show an old version?

GitHub Pages ignores `_headers`, so the cache rule for `config.js` does not apply there. GitHub's own cache can hold a file for a few minutes after you push. Force a refresh, or open the page in a private window, and the new version appears. If it matters, deploy on Netlify or Cloudflare Pages, where the no-cache rule is honoured.

### Is the chat bubble a real AI?

No, and it does not pretend to be. It is a keyword matcher that answers from the content already on your page — no language model, no API key, no network call. It is labelled that way in the interface. If a question matches nothing, it says so.

---

## Contributing

Bug reports, fixes and new ideas are welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md) for the HTML data-attribute contract, the house style and the review process.

Running the tests:

```bash
npm install                        # dev tooling only — the template itself ships nothing
npx playwright install chromium    # needed by the browser tests
npm test
```

63 tests, no network access required. They cover the generator round-trip, the hydration engine, SEO injection, the ZIP writer, the URL allowlist, a malicious-input pass, a real Chromium run of the whole download-and-open path, and responsive layout at 375px, 768px and 1280px.

The guardrails are the point. They fail the build if anyone adds a runtime dependency, adds a build step, pulls in third-party JavaScript or points a tag at a file that does not exist — so the promises in the badges above are enforced, not just advertised.

`npm install` is for the test runner only. Deploying the site never requires it.

---

## Licence

Released under the **MIT Licence**. Free to use, modify and distribute for personal and commercial projects. Attribution is appreciated but not required.

See [LICENSE](LICENSE) for the full terms.

---

## Limits

- It is a static site. There is no contact form backend, no comments and no server-side code; the contact buttons open the visitor's mail client.
- The resume preview embeds your PDF in the browser's built-in viewer. If a visitor's browser cannot display PDFs, the download link still works.
- One accent colour, not a full palette editor. The readable hover, text and tint shades are derived from the colour you pick.
- The generator's live preview needs a local server; the rest of the generator does not.
- English only. The layout is left-to-right and is not translated.
- The demo content in the shipped `config.js` is placeholder text, not a real person's details. Replace it before deploying.
