# Quick Setup Guide

> Get your personalised portfolio + studio site live by editing **one file**.

---

## The 60-Second Version

1. Open `config.js`
2. Fill in your details
3. Deploy

That's it. `index.html`, `studio.html`, `style.css` and `script.js` read everything from `config.js` — you never need to open them.

---

## Don't want to write code? Use the generator

The template includes a **config generator** at `setup.html` — a form that writes `config.js` for you.

1. Open `setup.html` (from your copy, or the live demo at `/setup.html`)
2. Fill in your details — every field is optional
3. Watch both sites update in the live preview as you type
4. Click **Download config.js**
5. Drop that file into your project folder, replacing the existing `config.js`
6. Deploy

You can also **Import** an existing `config.js`, **Copy** the output to your clipboard, or **Start from scratch**. Your progress is saved in your browser only — nothing is uploaded anywhere.

> The live preview reads `index.html` and `studio.html`, so serve the folder (`npx serve .` → open `/setup.html`) rather than opening the file directly. The form, download, import and copy buttons work either way.

Everything below is the **manual path** — edit `config.js` yourself. Both routes produce an identical file.

---

## 1. Your Identity — `config.personal`

```js
personal: {
  name:       "Your Name",
  initials:   "YN",                              // navbar logo badge
  role:       "Your Job Title",
  tagline:    "One memorable sentence.",
  bio:        "2–3 sentences about you.",
  photo:      "assets/engineer-avatar.svg",      // or your own photo
  resume:     "resume.pdf",
  location:   "City, Country · Open to Remote",
  availability: "Open to full-time roles",
  email:      "you@email.com",
  phone:      "+00 00000 00000",
  linkedin:   "https://linkedin.com/in/you",
  github:     "https://github.com/you",
}
```

Leave `phone`, `linkedin`, `github` as `""` and those elements hide themselves.

---

## 2. SEO & Social Preview — `config.seo`

```js
seo: {
  siteUrl:     "https://your-site.netlify.app",  // no trailing slash needed
  title:       "Your Name — Your Role",
  description: "One compelling sentence for search results.",
  ogImage:     "og-image.png",
  locale:      "en_US",
  twitterHandle: "",
  themeColor:  "#10264b",
  googleVerification: "",
}
```

The engine writes `<title>`, description, canonical, Open Graph, Twitter Card and JSON-LD into `<head>` for you.

---

## 3. The Content Lists

Each of these is an array — copy an existing entry and edit it. Empty array ⇒ the section disappears.

| Section | What it renders |
|---|---|
| `skills.categories` | Skill cards |
| `projects` | Project cards |
| `experience` | Experience cards |
| `education` | Education card |
| `research` | Publication cards *(optional)* |
| `achievements` | Award cards *(optional)* |
| `certifications` | Certification cards *(optional)* |
| `hero.stats` + `hero.marquee` | Hero numbers and scrolling keyword bar |
| `about.paragraphs` + `about.reasons` | About copy and "why work with me" cards |
| `contact.links` | Extra contact links |

---

## 4. Your Company Page — `config.company`

`studio.html` is driven entirely by this section:

```js
company: {
  name:         "Your Studio",
  descriptor:   "Technology & Innovation Studio",
  tagline:      "Engineering Ideas. Empowering Tomorrow.",
  philosophy:   "Build • Research • Innovate • Scale • Impact",
  description:  "What your studio does.",
  heroParagraph: "",            // optional — falls back to description
  founded:      "2025",
  founderRole:  "Founder & CEO",
  email:        "contact@yourstudio.com",
  phone:        "",             // blank ⇒ hidden
  contactDescription: "Let's build something together.",
  heroStats:    [ /* 4 numbers */ ],
  purposeParagraphs: [ /* 1–3 paragraphs */ ],
  purposeVision: "A short vision statement.",
  values:       [ /* value cards */ ],
  pillars:      [ /* capability pillars */ ],
  research:     [],             // optional — falls back to your personal research
  products:     [],             // optional — falls back to your personal projects
}
```

If `products` is empty, the Ecosystem section reuses your personal projects so the page never looks broken. Same for `research`.

---

## 5. Chatbot — `config.chatbot`

```js
chatbot: {
  assistantName: "Your AI Assistant",
  greeting:      "Hello! Ask me about my projects, skills or experience.",
  studioGreeting: "Welcome to the studio!",
  customResponses: {
    whyHire: "",
    pricing: "…",
    hobbies: "…",
    fallback: "",                 // blank ⇒ sensible built-in default
  },
}
```

All other answers are generated automatically from the sections you already filled in.

---

## 6. Theme — `config.theme`

```js
theme: {
  primaryColor: "#10264B",
  accentColor:  "#FF7900",
  blueColor:    "#2563EB",
  fontHeading:  "'Space Grotesk', 'Inter', sans-serif",
  fontBody:     "'Inter', -apple-system, sans-serif",
  fontMono:     "'IBM Plex Mono', monospace",
  showBuiltBy:  true,           // false ⇒ remove the ABMVSC footer credit
}
```

---

## 7. Replace Media Files

| File | Replace with |
|---|---|
| `assets/engineer-avatar.svg` (or `photo.jpg`) | Your own profile photo |
| `resume.pdf` | Your own resume PDF |
| `og-image.png` | Your own 1200×630 social preview |
| `favicon.*`, `apple-touch-icon.png`, `android-chrome-*` | Your own icons ([favicon.io](https://favicon.io/favicon-converter/)) |
| `assets/abmvsc-hero-banner.jpg`, `assets/abmvsc-logo-card.jpg` | Your own studio imagery (or leave the placeholders) |

Then update `site.webmanifest` with your brand name and theme colour.

---

## 8. SEO — Point It At Your Domain

In `sitemap.xml`:

```xml
<loc>https://YOUR-DOMAIN.com/</loc>
<loc>https://YOUR-DOMAIN.com/studio.html</loc>
```

In `robots.txt`:

```
Sitemap: https://YOUR-DOMAIN.com/sitemap.xml
```

And set `seo.siteUrl` in `config.js` to the same domain.

---

## 9. Deploy

**Netlify (easiest):**

```
1. app.netlify.com → Add new site → Deploy manually
2. Drag your folder onto the page
3. Live in seconds ✓
```

**GitHub Pages:**

```
1. Push to GitHub
2. Settings → Pages → Deploy from main branch → / (root)
3. Live at: https://yourusername.github.io/repo-name ✓
```

No build step. No environment variables. No dependencies to install.

---

## The Checklist — before you deploy

Work down this list once. Skip it and the most likely outcome is that your site
goes live still showing the ABMVSC demo content.

**Content — `config.js`**

- [ ] `personal` — name, initials, role, bio, email, links
- [ ] `seo` — `title`, `description`, and `siteUrl` set to the domain you will really deploy to
- [ ] `skills`, `projects`, `experience`, `education` — your own entries
- [ ] `company` — fill in to use `studio.html`; leave `company.name` as `""` to remove the page and its nav link
- [ ] `theme` — optional; the default palette is already production-ready

**Files to replace**

| File | Replace with |
|---|---|
| `photo.jpg` / `assets/engineer-avatar.svg` | Your profile image |
| `resume.pdf` | Your resume — or blank `personal.resume` to hide the button |
| `og-image.png` | A 1200×630 social preview card |
| `favicon.ico`, `favicon-16x16.png`, `favicon-32x32.png`, `apple-touch-icon.png`, `android-chrome-192x192.png`, `android-chrome-512x512.png` | Your icons ([favicon.io](https://favicon.io/favicon-converter/)) |
| `site.webmanifest` | Your app name and theme colour |

**Search engines**

- [ ] `robots.txt` — point `Sitemap:` at your domain
- [ ] `sitemap.xml` — point both `<loc>` entries at your domain
- [ ] Replace `google1813f9af1d0c0f59.html` with your own Search Console verification file

**Housekeeping**

- [ ] Delete `config.bala.js` — it is a reference example, not part of your site
- [ ] `theme.showBuiltBy` — `true` credits the engine, `false` removes the footer line
- [ ] `phone` / `linkedin` / `github` — set them, or leave `""` to hide those elements

---

## Troubleshooting

| Symptom | Cause |
|---|---|
| Page looks empty | `config.js` failed to load — check the `<script src="config.js">` tag is before `<script src="script.js">` |
| A whole section is missing | Its array is empty or its required field is `""` — that's the engine hiding it on purpose |
| Old content still showing | Hard-refresh (Ctrl/Cmd + Shift + R) — `config.js` is cached by the browser |
| Social preview not updating | Re-scrape the URL in the platform's debugger (e.g. Facebook Sharing Debugger) |
| Generator preview panel is blank | The preview needs a local server — run `npx serve .` and open `/setup.html`. Download and import still work without it |
| Generator form is empty | It loads the project's `config.js` as a starting point, which needs a local server. You can also use **Import config.js** |

---

## Need Help?

- **Email:** contact@abmvsc.studio
- **GitHub:** [github.com/Balama2520](https://github.com/Balama2520)
- **Studio:** [abms-portfolio.netlify.app/studio.html](https://abms-portfolio.netlify.app/studio.html)
