# Release notes — v3.1.0

Draft. Not published.

Released for Diwali 2026. Free to use, no account, nothing uploaded.

This is a gift for anyone who needs a personal website and does not want to
write code, pay for a service, or hand their details to a stranger. Open the
generator, answer what you can, download a folder, put it online.

ABMVSC Portfolio Engine is a product of ABMVSC Technology & Innovation Studio.

## What you do

1. Open the generator.
2. Answer the six chapters of questions. Every field is optional.
3. Upload a photo and a resume if you have them.
4. Click **Download website (ZIP)**.
5. Unzip the folder and upload it to any free static host.

## What is in this release

### The generator

- Six chapters of questions — You, Your work, Extras, Your company, Look &
  feel, Launch — shown one at a time, with a clickable step rail and Back and
  Next buttons.
- A live preview of both pages beside the form.
- A **Download website (ZIP)** button that produces the whole site, ready to
  upload.
- Photo and resume upload: a photo is checked for `jpg`, `png` or `webp` and
  2 MB; a resume for `pdf` and 5 MB. If a file is too big or the wrong type, the
  message says which limit was hit.
- Import and export, so you can keep a copy of your details and load them back.
- A draft saved in your own browser, so closing the tab does not lose your work.

### The website it produces

- Two pages from one set of details: a personal portfolio and an optional
  studio or company page.
- Three themes — light, dark and minimal — and one accent colour. The readable
  shades are worked out from the colour you pick, so a light colour cannot
  produce unreadable text.
- Your details written into the page for search engines and social previews:
  title, description, canonical link, Open Graph, Twitter Card and structured
  data.
- An honest chat bubble. It matches keywords against the text already on your
  page. It is not an AI, it does not pretend to be, and it does not call
  anything on the network.
- A footer credit that is off by default. Your site does not advertise us
  unless you tick the box.

### Safety and privacy

- No account, no server, no analytics, no third-party script. Nothing you type
  or upload leaves your browser. See [docs/PRIVACY.md](docs/PRIVACY.md).
- Fonts are served from the site's own folder instead of a font service, so
  opening the page makes no request to another company.
- A content security policy is set for the generator and for the sites it
  produces.
- Links and images are checked before they are used, so an unsafe address is
  rejected instead of followed.
- Importing your details is parsed as data, not run as code.
- A test suite checks all of the above on every change.

## Upgrading from an earlier version

If you already have a website from an earlier release, open the generator,
import your details file, and download a fresh ZIP. The old file format is not
read; the generator tells you if the file is in the old format and asks you to
export it again.

## Known limits

- The site is static. There is no contact form backend; the contact buttons open
  the visitor's mail app.
- The resume preview uses the browser's built-in PDF viewer. The download link
  works even when the viewer does not.
- One accent colour, not a full palette editor.
- English only, laid out left to right.
- The example details that ship with the template are placeholders. Replace them
  before you put the site online.

## Thank you

Thank you for trying it. If something does not work, or the wording confuses
you, please open an issue. Happy Diwali.
