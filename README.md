<div align="center">

<img src="docs/brand/wordmark.svg" alt="ABMVSC Portfolio Engine" width="420">

### Free, open-source portfolio website generator
Fill in your details, download your site, go live. No code, no account, nothing uploaded.

[![Validate](https://github.com/Balama2520/abmvsc-portfolio-template/actions/workflows/validate.yml/badge.svg)](https://github.com/Balama2520/abmvsc-portfolio-template/actions/workflows/validate.yml)
[![Licence: MIT](https://img.shields.io/badge/licence-MIT-blue.svg)](LICENSE)
[![Runtime dependencies: 0](https://img.shields.io/badge/runtime%20dependencies-0-brightgreen.svg)](package.json)
[![Build step: none](https://img.shields.io/badge/build%20step-none-brightgreen.svg)](#for-developers)
[![PRs welcome](https://img.shields.io/badge/PRs-welcome-orange.svg)](CONTRIBUTING.md)

[**Create your portfolio**](https://abmvsc-portfolio-template.netlify.app/setup.html) &nbsp;|&nbsp;
[Sample portfolio](https://abmvsc-portfolio-template.netlify.app/) &nbsp;|&nbsp;
[Sample company page](https://abmvsc-portfolio-template.netlify.app/studio.html) &nbsp;|&nbsp;
[Report a bug](https://github.com/Balama2520/abmvsc-portfolio-template/issues/new/choose) &nbsp;|&nbsp;
[Discussions](https://github.com/Balama2520/abmvsc-portfolio-template/discussions)

<img src="docs/screenshots/demo.gif" alt="Filling in the generator, downloading the ZIP and opening the finished site" width="860">

Released for Diwali 2026. Free to use, no account, nothing uploaded.

</div>

<details>
<summary><b>Contents</b></summary>

1. [What this project is](#1-what-this-project-is)
2. [How portfolios get judged, and why they get rejected](#2-how-portfolios-get-judged-and-why-they-get-rejected)
3. [What the generator does about each problem](#3-what-the-generator-does-about-each-problem)
4. [What already exists](#4-what-already-exists)
5. [Where this project fits, and where it does not](#5-where-this-project-fits-and-where-it-does-not)
6. [From nothing to a live portfolio, step by step](#6-from-nothing-to-a-live-portfolio-step-by-step)
7. [Writing a portfolio that holds up](#7-writing-a-portfolio-that-holds-up)
8. [Features in detail](#8-features-in-detail)
9. [Privacy](#9-privacy)
10. [Security](#10-security)
11. [Accessibility and device support](#11-accessibility-and-device-support)
12. [For developers](#for-developers)
13. [Testing and quality gates](#13-testing-and-quality-gates)
14. [Known limits](#14-known-limits)
15. [Roadmap](#15-roadmap)
16. [Open-source project guide](#16-open-source-project-guide)
17. [FAQ](#17-faq)
18. [Sources and method](#18-sources-and-method)

</details>

---

## 1. What this project is

ABMVSC Portfolio Engine is a static portfolio website generator. You open one page, answer plain questions, upload a photo and a resume, and download a complete website as a ZIP file that you own. You then put the folder on any static host.

It is built for students, freshers and career changers who need a portfolio online and do not want to learn a framework, pay for a site builder, or give their details to a service.

Three rules shape every decision:

| Rule | What it means in practice |
|---|---|
| **Private by construction** | The generator is a static page. It has no server, no account system and no analytics. Your details stay in your browser. |
| **No toolchain** | The finished site is plain HTML, CSS and JavaScript. No framework, no bundler, no build step, no runtime dependencies. |
| **You own the output** | The ZIP is yours. Host it anywhere, edit it by hand, or re-import it into the generator later. |

It is released under the MIT licence and maintained by ABMVSC Technology & Innovation Studio.

---

## 2. How portfolios get judged, and why they get rejected

This section summarises what hiring-side writers and developers report about how portfolios are reviewed. Read the caveat first.

> **Caveat on the numbers.** Figures such as "6 seconds" for a resume or "30 seconds" for a portfolio are repeated widely, but the sources that quote them describe them loosely ("some sources suggest"). One mentoring-site article states plainly that no industry survey tracks the exact reasons portfolios are turned down. Treat the timings as a reminder that review is fast, not as measured facts. See [Sources and method](#18-sources-and-method).

### How review tends to work

- Reviewers are often looking at dozens or hundreds of applications, so the first pass is quick and looks for reasons to eliminate.
- Several people may look at a portfolio at different stages: a recruiter, an engineering manager and sometimes an executive. Each reads for something different, so the page has to make sense without a guide.
- Clear communication counts as part of technical credibility, not as a separate skill.

### Reasons portfolios are commonly passed over

These come up repeatedly across the articles listed in the sources. They are reviewers' and authors' opinions, grouped here by theme.

| # | Pattern reviewers describe | Why it hurts |
|---|---|---|
| 1 | **A gallery with no explanation.** Finished screens, but no problem, process or decisions. | Reviewers want to see how you think, not only the result. |
| 2 | **A generic opening.** "Passionate developer who loves clean code." | It says nothing a hundred other pages do not say. |
| 3 | **Tutorial-clone projects.** Streaming clone, weather app, to-do list, shop demo. | Reviewers see the same projects repeatedly and read them as "followed a tutorial". |
| 4 | **No live demo, only a repository link.** | It costs the reviewer effort to find out whether the project works. |
| 5 | **One portfolio for every role.** | Unrelated projects blur what you are applying for. |
| 6 | **Hard to contact.** | If reaching you takes effort, the reviewer moves on. Authors recommend a visible email address. |
| 7 | **Slow, heavy or flashy pages.** | A clean, fast page beats an animated one for a busy reviewer. |
| 8 | **Outdated content and broken links.** | Signals neglect. |
| 9 | **Spelling and grammar mistakes.** | Easy to spot, easy to avoid, and read as carelessness. |
| 10 | **Weak project READMEs.** | Even strong code loses impact when its purpose is unclear. |
| 11 | **Too many projects, unfocused.** | Authors suggest a small number of strong, curated projects. |
| 12 | **Being unable to explain your own work.** | Interviews follow the portfolio. |

A portfolio generator cannot make weak projects strong. What it can do is remove the avoidable presentation problems, and prompt you to supply the missing substance.

---

## 3. What the generator does about each problem

| Reviewer problem | What the generator does | Limit |
|---|---|---|
| 1. Gallery with no explanation | Each project has fields for **problem, what you built, tools, result and link**, and renders as a short case-study card. A helper line asks: "What did you build, and what happened?" | It cannot write the case study for you. |
| 2. Generic opening | Every field has a plain hint and a realistic example. The recruiter checklist asks for a bio of a useful length. | It cannot tell whether your bio is specific. |
| 3. Tutorial clones | The checklist asks for projects with links, and the case-study fields push you to explain your decisions. | It does not judge project quality. |
| 4. No live demo | The checklist flags project cards without a link. | It cannot check that a link works. |
| 5. One portfolio for all roles | You can generate separate sites for different roles by importing and editing your saved details. | Named profiles inside the generator are on the [roadmap](#15-roadmap). |
| 6. Hard to contact | Email is shown prominently, and the finished site has a **Save contact** button that downloads a contact card. | It cannot make a reviewer reply. |
| 7. Slow or heavy pages | Plain HTML, CSS and a small script. No frameworks, no third-party requests, self-hosted fonts, compressed photos. | Mobile performance scores are still lower than they should be. See [Known limits](#14-known-limits). |
| 8. Outdated content | You can re-import your saved file and update it in minutes. | It cannot remind you to do so. |
| 9. Spelling mistakes | None. The browser's own spell-check works in the form fields. | A proofread by a person is still worth doing. |
| 10. Weak READMEs | Out of scope. This tool builds the site, not your repositories. | See the writing guide in [section 7](#7-writing-a-portfolio-that-holds-up). |
| 11. Too many projects | No limit is enforced. The checklist asks for at least three. | You decide what to include. |
| 12. Cannot explain the work | Case-study fields make you write the explanation down. | You still have to be ready to talk about it. |

### The recruiter checklist

The generator shows a live checklist while you type. Each missing item links to its field.

| Item | Rule used |
|---|---|
| Name and role | Both filled in |
| Short bio | 150 to 400 characters |
| Photo | Uploaded |
| Resume | Uploaded as PDF |
| Projects | At least three, each with a link |
| Email | Present |
| LinkedIn or GitHub | At least one |

These thresholds are this project's own rules of thumb, not figures from research. Change them if they do not suit your field.

---

## 4. What already exists

There are four broad routes to a portfolio today. Prices and plan limits change often and third-party comparison articles disagree with each other, so the figures below are indicative. Check each vendor's own pricing page before relying on them.

### 4.1 Hosted site builders

You build in their editor, and they host the result.

| Tool | Free plan, as reported by comparison articles | Paid plans, indicative |
|---|---|---|
| Carrd | Free plan with up to three sites, a Carrd subdomain and Carrd branding | Roughly $9 to $19 a year for Pro tiers (sources differ) |
| Wix | Free plan with Wix ads and subdomain | From about $17 a month |
| Webflow | Free Starter plan on a webflow.io address, limited pages | From about $14 to $18 a month |
| Framer | Free plan | From about $5 to $10 a month |
| Squarespace | No permanent free plan reported | From about $16 a month |
| WordPress.com | Free plan with branding | About $4 a month and up |
| Google Sites | Free | Free |

Typical strengths: visual editors, no Git knowledge needed, hosting included, many templates. Typical trade-offs: branding or ads on free plans, your content lives on their platform, and a paid plan is usually needed for a custom domain.

### 4.2 Code-first: static hosting plus a template

GitHub Pages and Cloudflare Pages are free, support custom domains and carry no ads. Comparison articles describe them as the best free option for people who can use Git, and note they require some Git knowledge. Many open-source portfolio templates exist, some with thousands of GitHub stars, which you copy and edit in code.

Typical strengths: free, full control, no branding. Typical trade-offs: you need Git and an editor, and often a Node toolchain.

### 4.3 Portfolio-specific community platforms and small generators

A number of small projects turn a resume or a form into a portfolio site, including several listed on community launch sites. Some use AI services and API keys, some host your site, some are paid. Their star counts and adoption are generally small.

### 4.4 Do-it-yourself

Write HTML by hand. Maximum control, maximum effort.

---

## 5. Where this project fits, and where it does not

This is a comparison of approaches, not a ranking of products. Read the right-hand column as well as the left.

| Question | Hosted builders | Template plus Git hosting | **ABMVSC Portfolio Engine** |
|---|---|---|---|
| Cost | Free tier, usually paid to remove limits | Free | **Free (MIT)** |
| Account required | Usually | GitHub account | **None** |
| Where your details go | Their servers | Your repository | **Stay in your browser** |
| Coding or Git knowledge | Not needed | Needed | **Not needed** |
| Build tools needed | No | Often | **No** |
| You own and can move the files | Often limited | Yes | **Yes** |
| Hosting included | Yes | Free host, you set it up | **No. You choose a free static host** |
| Visual drag-and-drop editor | **Yes** | No | No. A guided form with live preview |
| Number of designs | **Many** | Varies | Three themes and an accent colour |
| Blog, CMS, shop, forms | **Often** | Possible with work | No. Static pages only |
| Analytics | **Often** | Add your own | None by design |
| Maturity | **Established** | Varies | New. See [Known limits](#14-known-limits) |

### Honest summary

Choose this project if you want a free, private, no-code route to a clean two-page portfolio that you own, and you are happy to put the folder on a static host yourself.

Choose something else if you need a visual editor, many designs, a blog or CMS, hosting handled for you, forms, or analytics.

---

## 6. From nothing to a live portfolio, step by step

### Before you start (10 minutes of preparation)

Gather these. You can skip any of them and add them later.

| Item | Notes |
|---|---|
| A square-ish photo | JPG, PNG or WebP, up to 2 MB. Larger phone photos are resized in your browser. |
| Your resume as a PDF | Up to 5 MB |
| Two to five projects | For each: what the problem was, what you built, tools used, the result, and a link |
| Contact details | Email is the most important. LinkedIn and GitHub links help. |
| A short bio | Two or three sentences that say what you do and what you are looking for |

### Step 1: open the generator

Go to [the generator](https://abmvsc-portfolio-template.netlify.app/setup.html). It works on a phone, though putting the finished site online is easier on a computer.

### Step 2: answer six short steps

| Step | What you enter |
|---|---|
| 1. You | Name, role, tagline, short bio, photo, resume, location, availability, contact links |
| 2. Your work | Skills, projects as case studies, experience, education |
| 3. Extras | Research, awards, certifications. All optional. |
| 4. Your company | Only if you want a studio or agency page. Skip otherwise. |
| 5. Look and feel | Theme (light, dark, minimal), accent colour, assistant greeting, about text |
| 6. Launch | Your website address if you have one, search settings, footer credit option |

Notes:

- The live preview on the right updates as you type. Use **Toggle mobile width** to see it as a phone would.
- Your draft is saved in your browser, and the page says "Saved on this device". Closing the tab does not lose it.
- Leave anything blank and it disappears from the site cleanly. An empty section never shows "undefined".

### Step 3: check the recruiter checklist

Fix anything it flags. It is quicker than finding the gaps after you publish.

### Step 4: download

Click **Download website (ZIP)**. The file is built in your browser.

### Step 5: unzip and look inside

```
index.html            your personal portfolio
studio.html           your company page (hidden if you left it empty)
style.css, script.js
config.js             your details, as data
photo and resume      the files you uploaded
og-image.png          a social preview card drawn from your name and colour
favicons, site.webmanifest
robots.txt, sitemap.xml
_headers, netlify.toml, vercel.json     security headers for each host
.nojekyll             for GitHub Pages
README-DEPLOY.txt     deploy steps in plain language
```

Open `index.html` to check your site before publishing.

### Step 6: put it online

| Host | Steps |
|---|---|
| **Netlify** | Add new site, Deploy manually, drag the unzipped folder in. |
| **Vercel** | Deploy the folder. `vercel.json` is included. |
| **Cloudflare Pages** | Create a project, Direct Upload, choose the folder. |
| **GitHub Pages** | Push the folder to a repository, then Settings, Pages, deploy from the `main` branch root. |

Each host gives you a free address. A custom domain is optional and needs a domain you buy separately.

### Step 7: share it

Put the link in your resume, LinkedIn profile, GitHub profile and email signature. Paste it into a chat and check that the preview card shows your name and image.

### Step 8: update it later

Open the generator, choose **Advanced**, then **Import**, and pick the `config.js` from your ZIP. Edit and download again. Replace the files on your host.

### Time and effort

The design goal is that a prepared user can finish in one sitting. That is a goal, not a measured result, and no timing study has been done.

---

## 7. Writing a portfolio that holds up

The generator gives you the structure. The words are yours. These suggestions are drawn from what reviewers and authors report in the sources, and from common sense.

**Lead with a role and a result, not a mood.**
Weak: "Passionate developer who loves clean code."
Stronger: "Full-stack developer. I build web apps with React and Node.js. Built a booking app used by 40 students at my college." (Use your own real facts. Do not invent figures.)

**Write each project as a short case study.**

| Field | What to write |
|---|---|
| Problem | Who had what problem, in one sentence |
| What you built | The solution, and your part if it was a team |
| Tools | The stack, kept short |
| Result | What happened. A number, a user, a lesson, or what you would change |
| Link | A live demo first, then the repository |

**Prefer three strong projects over ten average ones.** Reviewers report seeing the same tutorial clones repeatedly. If you built one from a tutorial, say what you changed or added.

**Show a live link for every project.** A repository link alone makes the reviewer do extra work.

**Make contact effortless.** Put your email where it is visible without scrolling.

**Match the portfolio to the role.** Generate a second version for a different kind of job rather than adding everything to one.

**Proofread.** Read it aloud once. Ask a friend to read it for two minutes and tell you what they think you do.

**Be ready to discuss everything on the page.** Cut anything you could not explain in an interview.

**Keep it current.** Remove dead links. Update it when you finish something new.

---

## 8. Features in detail

### Generator

| Feature | Detail |
|---|---|
| Guided steps with live preview | Six steps, desktop and mobile preview, portfolio and studio tabs |
| Plain hints and examples | Every field has a short hint and a generic example |
| Recruiter checklist | Computed in your browser |
| Photo helper | Crop, resize (maximum 800 px) and recompress. Shows before and after size. |
| Resume upload | PDF up to 5 MB |
| Draft saving | Local to your browser, with a visible note |
| Import and export | Load an earlier `config.js` and continue |
| Clear errors | Messages say what went wrong and how to fix it |

### Finished site

| Feature | Detail |
|---|---|
| Two pages | Portfolio, and an optional company page, linked together |
| Themes | Light, dark and minimal, with your accent colour |
| Search and sharing tags | Title, description, canonical, Open Graph, Twitter Card and structured data, written into the page at download time |
| Social image and icons | Drawn in your browser from your name and colour |
| Print view | A clean one-page CV when you press Ctrl+P |
| Save contact | Downloads a contact card built in the browser |
| Resume viewer | In-page PDF view, with a download link as a fallback |
| Chat assistant | Answers questions about you from your own details. A keyword matcher, not an AI service. Makes no network requests. |
| Hides empty parts | Blank fields and empty lists remove themselves |
| Optional footer credit | Off by default. Tick a box to show "Made with ABMVSC Portfolio Engine". |

Generated sites carry no ABMVSC text, links or images unless you tick the credit box.

---

## 9. Privacy

| | |
|---|---|
| Your details and files | Stay in your browser. Nothing is uploaded or sent anywhere. |
| Drafts | Saved in your browser's local storage on that device only. |
| Accounts and tracking | None. No analytics, and no cookies set by this project. |
| Fonts | Served from the site itself. No Google Fonts request. |
| Chat assistant | Runs in the visitor's browser and answers from your own details. |
| Content-Security-Policy | Every page ships a policy that blocks third-party scripts, frames and connections. |
| Hosts | The host you choose sees visitors' requests to your site, as any host does. Read their terms. |

Full note: [docs/PRIVACY.md](docs/PRIVACY.md).

---

## 10. Security

Portfolio generators handle personal text and links, so the main risks are code injection and unsafe links.

| Control | Detail |
|---|---|
| Import never executes code | `config.js` is strict JSON assigned to `window.PORTFOLIO_CONFIG`. Import reads it with `JSON.parse`. Function calls, scripts and unknown shapes are rejected with a clear message. |
| Link allow-list | Links accept only `http`, `https`, `mailto` and `tel`. Images also accept safe `data:image` types and relative paths. `javascript:`, `vbscript:` and `data:text/html` are blocked, including mixed-case and control-character variants. The same function is used in the generator, the ZIP builder and the runtime script. |
| Output escaping | User text is escaped before it reaches HTML. Structured data is escaped so it cannot close its script block. |
| Hostile-input test | A permanent test puts hostile strings into every text and link field, builds a site, opens it in a browser and checks that nothing executes. |
| Content-Security-Policy | Sent as a header on Netlify, Vercel and Cloudflare Pages, and included as a meta tag for hosts that ignore headers. |
| No third-party requests | A test fails if any page or stylesheet loads a third-party host. |

To report a vulnerability, use GitHub's private vulnerability reporting. See [SECURITY.md](SECURITY.md). Please do not open a public issue for a security problem.

---

## 11. Accessibility and device support

| Area | Status |
|---|---|
| Automated accessibility checks | axe-core runs on the generator and on generated pages in every theme. The test fails on any serious or critical issue. |
| Keyboard | A keyboard-only test covers the main flow: reaching every control, visible focus, labelled fields and announced updates. |
| Contrast | Text pairs are checked against a 4.5:1 target. |
| Touch | Targets are at least 44 px on phones. |
| Browsers in automated tests | Chromium, Firefox and WebKit |
| Real devices | Checks on real phones, including iPhone Safari, are still being collected. |

Automated tools find only part of the accessibility problems. This is not a full manual audit. Reports are welcome.

---

## For developers

You can also use the repository directly.

```bash
git clone https://github.com/Balama2520/abmvsc-portfolio-template.git
cd abmvsc-portfolio-template
npx serve .
# open http://localhost:3000/setup.html
```

The live preview needs a local server rather than a `file://` address.

### One data file

`config.js` assigns a strict JSON object to `window.PORTFOLIO_CONFIG`: quoted keys, no comments, no trailing commas.

```js
window.PORTFOLIO_CONFIG = {
  "personal": { "name": "Your Name", "role": "Your role" },
  "projects": []
};
```

| # | Section | Drives |
|---|---|---|
| 1 | `personal` | Navbar, hero, about, contact, footer, assistant |
| 2 | `seo` | Title, description, canonical, social cards, structured data |
| 3 | `hero` | Hero headline, stat row, ticker (optional) |
| 4 | `about` | About text and reason cards (optional) |
| 5 | `skills` | Skills summary and categories |
| 6 | `projects` | Project cards |
| 7 | `experience` | Work experience |
| 8 | `education` | Education |
| 9 | `research` | Publications (optional) |
| 10 | `achievements` | Awards (optional) |
| 11 | `certifications` | Certifications (optional) |
| 12 | `company` | Everything on `studio.html` |
| 13 | `contact` | Extra contact links (optional) |
| 14 | `chatbot` | Assistant name, greeting, custom answers |
| 15 | `theme` | Colours and display options |

Every section is optional. A blank field hides its element and an empty array hides its block.

### How pages render

`script.js` fills elements marked with these attributes.

| Attribute | Purpose |
|---|---|
| `data-bind="dotted.path"` | Writes a config value into the element. Blank hides it. |
| `data-list="name"` | Renders a list. Empty hides it. |
| `data-list-host` | Marks the wrapper to hide when its list is empty. |
| `data-section="key"` | Shows or hides a section and its navigation link. |
| `data-page="portfolio"` or `"studio"` | Tells the engine which page it is on. |

At download time the generator also writes the title, description, social tags, structured data and hero text into the static HTML. Link previews and crawlers therefore do not depend on JavaScript. The runtime script remains as a fallback for hand-edited sites.

### Main files

```
setup.html, setup.js, setup.css   the generator
pack.js                            ZIP writer and page pre-rendering
index.html, studio.html            the two site pages
script.js, style.css               rendering engine and design system
config.js                          sample content
test/                              automated tests
docs/PRIVACY.md                    privacy note
```

---

## 13. Testing and quality gates

```bash
npm ci
npx playwright install --with-deps chromium firefox webkit
npm test
```

Requires Node 22 or later.

The suite (86 tests at the time of writing) covers:

| Area | What is tested |
|---|---|
| Import | Parsing, round trips with no data loss, old-format files, schema errors, hostile files |
| Links | The allow-list and its bypass forms, and that three code paths share one function |
| Hostile input | Malicious strings in every field, built into a site and opened in a browser |
| ZIP | Required files present, every link inside it resolves, deployment headers match the repository |
| Rendering | Pages with and without JavaScript, static tags match runtime tags |
| Layout | No overflow at 375, 768 and 1280 px, content visible without scrolling, print view |
| Accessibility | axe-core in every theme, keyboard flow, labels, live regions |
| Performance | Lighthouse category checks with floors |
| Guardrails | No runtime dependencies, no build step, no third-party JavaScript or requests, no `eval` |

Continuous integration runs the suite on every pull request. The guardrail tests fail the build if anyone adds a runtime dependency, a build step or a third-party request.

---

## 14. Known limits

- **Mobile performance** scores are lower than they should be for a static site. Improving them is the next planned engineering task.
- **No server**, so no contact form, accounts, analytics or hosting. You host the folder yourself.
- **Design choice is small**: three themes and one accent colour.
- **English only** for the interface. Your own text in other scripts renders with your system's fonts, but this has not been tested exhaustively.
- **Real-device testing** is incomplete. Automated tests run in three browser engines, not on physical phones.
- **PDF preview** in the resume window depends on the visitor's browser. A download link is always available.
- **The chat assistant** is a keyword matcher. It answers only from your details and will miss questions it was not built for.
- **Young project.** Expect rough edges. Please report them.

---

## 15. Roadmap

Planned, not promised.

- [x] Generator with live preview, themes and recruiter checklist
- [x] Download a complete site as a ZIP, with host files for four platforms
- [x] Strict, non-executing import and a link allow-list
- [x] Automated accessibility, keyboard and layout checks
- [ ] Real-device test results published in the repository
- [ ] Faster mobile performance
- [ ] Named profiles for different roles inside the generator
- [ ] Optional GitHub repository import (opt-in, off by default)
- [ ] JSON Resume import and export
- [ ] More layouts and more interface languages

Ideas and votes are welcome in [Discussions](https://github.com/Balama2520/abmvsc-portfolio-template/discussions).

---

## 16. Open-source project guide

| Topic | Detail |
|---|---|
| Licence | MIT. Free for personal and commercial use. See [LICENSE](LICENSE). |
| Maintainer | ABMVSC Technology & Innovation Studio, via [Balama2520](https://github.com/Balama2520). |
| Where to ask | Questions and ideas in [Discussions](https://github.com/Balama2520/abmvsc-portfolio-template/discussions). Bugs in [Issues](https://github.com/Balama2520/abmvsc-portfolio-template/issues/new/choose). |
| Security reports | GitHub private vulnerability reporting. See [SECURITY.md](SECURITY.md). |
| Contributing | See [CONTRIBUTING.md](CONTRIBUTING.md). The most useful contribution is a bug report that names your browser and device. |
| Good first issues | Labelled `good first issue`. |
| Code of conduct | [Contributor Covenant 2.1](CODE_OF_CONDUCT.md). |
| Versioning | Semantic versioning. See [CHANGELOG.md](CHANGELOG.md) and the Releases page. |
| Pull requests | All tests must pass. Guardrails (no runtime dependencies, no build step, no third-party requests) are not negotiable. |
| Branding | The generator carries the ABMVSC name. Generated sites do not, unless the user opts in. |

### Built with it

Made a site with this? [Add it to the showcase](https://github.com/Balama2520/abmvsc-portfolio-template/issues/new?template=showcase.yml) and it will be listed here.

<!-- Showcase list goes here, one line per site, added from approved showcase issues. -->

---

## 17. FAQ

**Is my data uploaded?**
No. The generator is a static page and does all its work in your browser.

**Do I need to pay for anything?**
Not for this tool. Some hosts charge for extras such as custom domains. A domain name is bought separately.

**How do I edit my site later?**
Open the generator, choose **Advanced**, then **Import**, pick the `config.js` from your ZIP, make changes and download again.

**Is the chat assistant AI?**
No. It matches keywords against the details you entered and calls no external service.

**Can I add a contact form?**
The site is static, so there is no server to receive one. It offers an email link and a downloadable contact card.

**Can I use it for a company or agency page?**
Yes. Fill in the company step and the studio page is generated and linked to your portfolio.

**Can I show or hide the ABMVSC credit?**
It is off by default. The generator has a checkbox if you want to show it.

**Will my site be found on search engines?**
The pages include the tags search engines read, and a sitemap. Appearing in results depends on your domain, content and time. Nothing here can promise rankings.

**Which browsers and devices work?**
Automated tests run the full flow in Chromium, Firefox and WebKit. Please open an issue if something breaks on your device.

**Can I use it in languages other than English?**
The interface is English only for now. See [Known limits](#14-known-limits).

**Why does GitHub Pages show my old config after I edit it?**
GitHub Pages ignores header files. The config file is requested with a content hash so changes show up without a hard refresh. If you still see old content, clear the browser cache once.

---

## 18. Sources and method

### How this README was written

The sections on how portfolios are reviewed and on existing tools were written from a web search carried out in November 2026. The sources are articles, blog posts and comparison pages, not controlled studies. Several are written by training providers, tool vendors or affiliate sites, which have their own interests. Claims were paraphrased and kept at the level the sources support.

### Limits of the evidence

- Review-time figures ("6 seconds", "30 seconds", "7 seconds", "60 seconds") are quoted loosely and differ between sources. They are not measured results.
- One source states that no industry survey tracks exact reasons portfolios are rejected.
- Pricing differs between comparison pages. Treat every price as indicative and check the vendor.
- This project's own checklist thresholds (bio length, number of projects) are rules of thumb.

### Articles consulted

Reviewer behaviour and rejection patterns:

- PW Skills, "Why Portfolios Get Rejected: 5 Mistakes That Cost You Interviews" (pwskills.com)
- Matej Latin, "Only 30 seconds to reject your portfolio?" (uxdesign.cc, 2024)
- MentorCruise, "Your Portfolio Keeps Getting Rejected. How to Diagnose What Is Missing" and "How to Build a Portfolio That Gets Hiring Managers to Care" (mentorcruise.com)
- SOLTECH, "What Do Hiring Managers Actually Look For in a GitHub Portfolio?" (soltech.net)
- DEV Community, "Most developer portfolios get rejected in 7 seconds" and "How to build a developer portfolio that actually gets you hired (2026)" (dev.to)
- Developer Portfolio Checklist, devplaybook.cc

Tools and pricing:

- Dupple, "Best Free Website Builders in 2026: 8 Free Plans Compared" (dupple.com, October 2026)
- Fueler, "8 Best Portfolio Website Builders for Designers and Developers" (fueler.io, June 2026)
- Colorlib, "10 Best One-Page Website Builders" (colorlib.com)
- TemperStack comparison pages for Carrd, Wix and Webflow (temperstack.com)

If you spot an outdated or wrong claim, please open an issue with a link to the vendor or primary source.

Last reviewed: November 2026.

---

## Licence

MIT. See [LICENSE](LICENSE). Free for personal and commercial use.

---

<div align="center">

ABMVSC Portfolio Engine is a product of ABMVSC Technology & Innovation Studio.<br>
Maintained by [Balama2520](https://github.com/Balama2520). If it helped you, consider starring the repository.

</div>
