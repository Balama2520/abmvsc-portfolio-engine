/**
 * pack.js — the packaging half of the config generator.
 *
 * Two jobs, neither of which needs a dependency:
 *
 *   1. Write and read ZIP archives. STORE only: no compression, no library.
 *      A portfolio site is a few hundred kilobytes, so compression would buy
 *      nothing worth the code.
 *   2. Work out which files a generated site actually needs by reading the
 *      pages, rather than trusting a hand-written list that drifts.
 *
 * Loaded in the browser as window.Pack, required in Node as a module, so the
 * test suite runs exactly the code the generator ships.
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    const UrlAllowlist = require("./url-allowlist.js");
    module.exports = factory(UrlAllowlist);
  } else {
    root.Pack = factory(root.UrlAllowlist);
  }
})(typeof self !== "undefined" ? self : this, function (UrlAllowlist) {
  "use strict";

  const sanitizeUrl = UrlAllowlist && UrlAllowlist.sanitizeUrl ? UrlAllowlist.sanitizeUrl : (u) => u;

  /* CRC-32 */

  const CRC_TABLE = (() => {
    const table = new Uint32Array(256);
    for (let i = 0; i < 256; i++) {
      let c = i;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      table[i] = c >>> 0;
    }
    return table;
  })();

  const crc32 = (bytes) => {
    let c = 0xffffffff;
    for (let i = 0; i < bytes.length; i++) {
      c = CRC_TABLE[(c ^ bytes[i]) & 0xff] ^ (c >>> 8);
    }
    return (c ^ 0xffffffff) >>> 0;
  };

  /* Byte helpers */

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const toBytes = (data) => {
    if (typeof data === "string") return encoder.encode(data);
    if (data instanceof Uint8Array) return data;
    return new Uint8Array(data);
  };

  const concat = (chunks) => {
    const total = chunks.reduce((n, c) => n + c.length, 0);
    const out = new Uint8Array(total);
    let at = 0;
    chunks.forEach((c) => {
      out.set(c, at);
      at += c.length;
    });
    return out;
  };

  /* ZIP writer */

  // ZIP stores timestamps as MS-DOS packed fields, which start in 1980.
  const dosStamp = (date) => ({
    time: (date.getHours() << 11) | (date.getMinutes() << 5) | (date.getSeconds() >> 1),
    date: ((Math.max(1980, date.getFullYear()) - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate(),
  });

  const writeZip = (entries, now = new Date()) => {
    const stamp = dosStamp(now);
    const chunks = [];
    const central = [];
    let offset = 0;

    entries.forEach((entry) => {
      const name = encoder.encode(entry.path);
      const data = toBytes(entry.data);
      const sum = crc32(data);

      const local = new DataView(new ArrayBuffer(30));
      local.setUint32(0, 0x04034b50, true); // local file header
      local.setUint16(4, 20, true); // version needed: 2.0
      local.setUint16(6, 0, true); // flags
      local.setUint16(8, 0, true); // method: STORE
      local.setUint16(10, stamp.time, true);
      local.setUint16(12, stamp.date, true);
      local.setUint32(14, sum, true);
      local.setUint32(18, data.length, true); // compressed size
      local.setUint32(22, data.length, true); // uncompressed size
      local.setUint16(26, name.length, true);
      local.setUint16(28, 0, true); // extra field length

      chunks.push(new Uint8Array(local.buffer), name, data);

      const dir = new DataView(new ArrayBuffer(46));
      dir.setUint32(0, 0x02014b50, true); // central directory header
      dir.setUint16(4, 20, true); // version made by
      dir.setUint16(6, 20, true); // version needed
      dir.setUint16(8, 0, true);
      dir.setUint16(10, 0, true);
      dir.setUint16(12, stamp.time, true);
      dir.setUint16(14, stamp.date, true);
      dir.setUint32(16, sum, true);
      dir.setUint32(20, data.length, true);
      dir.setUint32(24, data.length, true);
      dir.setUint16(28, name.length, true);
      dir.setUint16(30, 0, true); // extra
      dir.setUint16(32, 0, true); // comment
      dir.setUint16(34, 0, true); // disk number
      dir.setUint16(36, 0, true); // internal attributes
      dir.setUint32(38, 0, true); // external attributes
      dir.setUint32(42, offset, true); // offset of this entry's local header

      central.push(new Uint8Array(dir.buffer), name);

      offset += 30 + name.length + data.length;
    });

    const centralBytes = concat(central);

    const end = new DataView(new ArrayBuffer(22));
    end.setUint32(0, 0x06054b50, true); // end of central directory
    end.setUint16(4, 0, true);
    end.setUint16(6, 0, true);
    end.setUint16(8, entries.length, true);
    end.setUint16(10, entries.length, true);
    end.setUint32(12, centralBytes.length, true);
    end.setUint32(16, offset, true);
    end.setUint16(20, 0, true); // comment length

    return concat([...chunks, centralBytes, new Uint8Array(end.buffer)]);
  };

  /* ZIP reader */

  // Reads back what writeZip produced. STORE only; anything else throws rather
  // than returning bytes that would be silently wrong.
  const readZip = (bytes) => {
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);

    // The central directory's size is unknown, so find the end record by
    // scanning back for its signature. 22 bytes is the minimum record.
    let end = -1;
    for (let i = bytes.length - 22; i >= 0; i--) {
      if (view.getUint32(i, true) === 0x06054b50) {
        end = i;
        break;
      }
    }
    if (end < 0) throw new Error("Not a ZIP file: no end-of-central-directory record");

    const count = view.getUint16(end + 10, true);
    let at = view.getUint32(end + 16, true);
    const entries = [];

    for (let i = 0; i < count; i++) {
      if (view.getUint32(at, true) !== 0x02014b50) throw new Error("Corrupt central directory");
      const method = view.getUint16(at + 10, true);
      const size = view.getUint32(at + 24, true);
      const nameLength = view.getUint16(at + 28, true);
      const extraLength = view.getUint16(at + 30, true);
      const commentLength = view.getUint16(at + 32, true);
      const localAt = view.getUint32(at + 42, true);
      const path = decoder.decode(bytes.subarray(at + 46, at + 46 + nameLength));

      if (method !== 0) throw new Error(`${path}: only stored (uncompressed) entries are supported`);

      const localNameLength = view.getUint16(localAt + 26, true);
      const localExtraLength = view.getUint16(localAt + 28, true);
      const start = localAt + 30 + localNameLength + localExtraLength;

      entries.push({ path, data: bytes.subarray(start, start + size) });
      at += 46 + nameLength + extraLength + commentLength;
    }

    return entries;
  };

  /* Which files does a site need? */

  const SECURITY_POLICY = "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; font-src 'self'; img-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'self'";
  const SECURITY_HEADERS = {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "SAMEORIGIN",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "geolocation=(), microphone=(), camera=()",
    "Content-Security-Policy": SECURITY_POLICY,
  };
  const CACHE_CONTROL = "public, max-age=0, must-revalidate";

  const HOST_FILES = Object.freeze({
    "_headers": `/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: SAMEORIGIN
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), microphone=(), camera=()
  Content-Security-Policy: ${SECURITY_POLICY}

/config.js
  Cache-Control: ${CACHE_CONTROL}

/index.html
  Cache-Control: ${CACHE_CONTROL}

/studio.html
  Cache-Control: ${CACHE_CONTROL}

/assets/*
  Cache-Control: public, max-age=31536000, immutable

/*.png
  Cache-Control: public, max-age=31536000, immutable

/*.ico
  Cache-Control: public, max-age=31536000, immutable

/setup.html
  X-Robots-Tag: noindex, nofollow
`,
    "netlify.toml": `[build]
  publish = "."

[[headers]]
  for = "/*"
  [headers.values]
    X-Content-Type-Options = "nosniff"
    X-Frame-Options = "SAMEORIGIN"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "geolocation=(), microphone=(), camera=()"
    Content-Security-Policy = "${SECURITY_POLICY}"

[[headers]]
  for = "/config.js"
  [headers.values]
    Cache-Control = "${CACHE_CONTROL}"

[[headers]]
  for = "/index.html"
  [headers.values]
    Cache-Control = "${CACHE_CONTROL}"

[[headers]]
  for = "/studio.html"
  [headers.values]
    Cache-Control = "${CACHE_CONTROL}"

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.png"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.ico"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/setup.html"
  [headers.values]
    X-Robots-Tag = "noindex, nofollow"
`,
    "vercel.json": `${JSON.stringify({
      headers: [
        { source: "/(.*)", headers: Object.entries(SECURITY_HEADERS).map(([key, value]) => ({ key, value })) },
        { source: "/config.js", headers: [{ key: "Cache-Control", value: CACHE_CONTROL }] },
      ],
    }, null, 2)}\n`,
    ".nojekyll": "",
  });

  // Always shipped, whatever the pages happen to say.
  const CORE_FILES = [
    "index.html",
    "studio.html",
    "style.css",
    "script.js",
    "url-allowlist.js",
    "config.js",
    "robots.txt",
    "sitemap.xml",
    ...Object.keys(HOST_FILES),
  ];

  const PAGES = ["index.html", "studio.html"];

  // Absolute URLs, protocol-relative URLs, fragments and mail links are not
  // files in the project, so they are left out of the manifest.
  const NOT_A_FILE = /^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i;

  const collectRefs = (html) => {
    const refs = new Set();
    const attribute = /\b(?:href|src)\s*=\s*"([^"]*)"/gi;
    let match;
    while ((match = attribute.exec(html))) {
      const value = match[1].trim();
      if (!value || NOT_A_FILE.test(value)) continue;
      refs.add(value.split("#")[0].split("?")[0]);
    }
    return [...refs].filter(Boolean);
  };

  // A stylesheet names its fonts and background images with url(), so no HTML
  // attribute points at them. Only the local ones become part of the site.
  const collectCssRefs = (css) => {
    const refs = new Set();
    const call = /\burl\(\s*["']?([^"')]+)["']?\s*\)/gi;
    let match;
    while ((match = call.exec(css))) {
      const value = match[1].trim();
      if (!value || NOT_A_FILE.test(value)) continue;
      refs.add(value.split("#")[0].split("?")[0]);
    }
    return [...refs].filter(Boolean);
  };

  // A web manifest names its icons as JSON, so no HTML attribute points at them.
  const collectIconRefs = (manifestJson) => {
    let manifest;
    try {
      manifest = JSON.parse(manifestJson);
    } catch (err) {
      return [];
    }
    return (manifest.icons || [])
      .map((icon) => (icon && icon.src ? String(icon.src).replace(/^\//, "") : ""))
      .filter(Boolean);
  };

  // Assets the pages name only through config, so no attribute points at them.
  const configAssets = (config) => {
    const personal = config.personal || {};
    const company = config.company || {};
    const seo = config.seo || {};
    return [
      sanitizeUrl(personal.photo, "image"),
      sanitizeUrl((company.logo || {}).card, "image"),
      sanitizeUrl(seo.ogImage, "image"),
    ].filter(Boolean);
  };

  /**
   * @param {{files: Record<string, string>, config: object, extra?: string[]}} input
   *   files  — contents of the project, keyed by path. Paths the caller could
   *            not load are simply absent.
   * @returns {{include: string[], missing: string[]}} include is what to zip;
   *   missing is referenced-but-absent, which is a bug worth surfacing.
   */
  const buildManifest = ({ files, config, extra = [] }) => {
    const wanted = new Set(CORE_FILES);
    PAGES.forEach((page) => {
      const html = files[page];
      if (html) collectRefs(html).forEach((ref) => wanted.add(ref));
    });
    const manifest = files["site.webmanifest"];
    if (manifest) collectIconRefs(manifest).forEach((path) => wanted.add(path));
    Object.entries(files).forEach(([path, data]) => {
      if (/\.css$/i.test(path) && typeof data === "string") {
        collectCssRefs(data).forEach((ref) => wanted.add(ref));
      }
    });
    configAssets(config).forEach((path) => wanted.add(path));
    extra.forEach((path) => wanted.add(path));

    const include = [];
    const missing = [];
    wanted.forEach((path) => {
      if (Object.prototype.hasOwnProperty.call(files, path)) include.push(path);
      else missing.push(path);
    });

    include.sort();
    missing.sort();
    return { include, missing };
  };

  /* Static render — what a crawler that cannot run script.js must still see */

  // A social crawler fetches the HTML and stops; it never runs script.js, so
  // anything injected at runtime is invisible to it. At ZIP time the same
  // values are written straight into the two pages. Runtime injection stays as
  // the fallback for a hand-edited site that skipped the generator.
  const ESC = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
  const escapeText = (v) => String(v ?? "").replace(/[&<>]/g, (c) => ESC[c]);
  const escapeAttr = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ESC[c]);
  // JSON inside a script element needs HTML-safe escaping. JSON.stringify by
  // itself leaves </script> intact and would let text close the element.
  const jsonForHtml = (value) => JSON.stringify(value).replace(/[<>&\u2028\u2029]/g, (c) =>
    ({ "<": "\\u003c", ">": "\\u003e", "&": "\\u0026", "\u2028": "\\u2028", "\u2029": "\\u2029" }[c])
  );

  const isStudioPage = (page) => /studio/i.test(String(page || ""));

  const asArray = (v) => (Array.isArray(v) ? v : v ? [v] : []);

  // The values script.js derives rather than reads. Kept in step with the
  // runtime engine by the drift test in test/pack.test.mjs.
  const staticVirtual = (config, studio) => {
    const p = config.personal || {};
    const co = config.company || {};
    const hero = config.hero || {};

    const roleBits = String(p.role || "").split("&").map((s) => s.trim());
    const roleLine1 = roleBits[0] || "";
    const roleLine2 = roleBits.length > 1 ? `& ${roleBits.slice(1).join(" & ")}` : "";
    const taglineBits = String(co.tagline || "").split(".").map((s) => s.trim()).filter(Boolean);

    return {
      "hero.eyebrow": hero.eyebrow || p.availability || "",
      "hero.badge": hero.badge || (co.name ? `Founder @ ${co.name}` : ""),
      "hero.titleLine1": hero.titleLine1 || roleLine1,
      "hero.titleLine2": hero.titleLine2 || roleLine2,
      "company.eyebrow": [co.descriptor, co.founded ? `Founded ${co.founded}` : ""].filter(Boolean).join(" · "),
      "company.titleLine1": taglineBits[0] ? `${taglineBits[0]}.` : "",
      "company.titleLine2": taglineBits.length > 1 ? `${taglineBits.slice(1).join(". ")}.` : "",
      "company.heroParagraph": co.heroParagraph || co.description || "",
      "personal.name": p.name || "",
      "personal.role": p.role || "",
      "personal.bio": p.bio || "",
      studio: studio,
    };
  };

  // The head tags, as a marked block so the rewrite is idempotent and the
  // tests can point at one region.
  const staticHeadTags = (config, studio) => {
    const p = config.personal || {};
    const co = config.company || {};
    const seo = config.seo || {};
    const theme = config.theme || {};

    const base = String(seo.siteUrl || "").replace(/\/+$/, "");
    const canonical = base ? (studio ? `${base}/studio.html` : `${base}/`) : "";
    const title = studio
      ? `${co.name || "Studio"} — ${co.descriptor || "Company"}`
      : seo.title || `${p.name || "Portfolio"} | ${p.role || "Developer"}`;
    const description = studio ? co.description || "" : seo.description || p.bio || "";
    const ogImage = seo.ogImage
      ? (base ? `${base}/${String(seo.ogImage).replace(/^\/+/, "")}` : seo.ogImage)
      : "";
    const siteName = studio ? co.name || "" : p.name || "";
    const locale = seo.locale || "en_US";
    const themeColor = seo.themeColor || theme.primaryColor || "";

    const meta = (attr, key, content) =>
      content ? `  <meta ${attr}="${escapeAttr(key)}" content="${escapeAttr(content)}" />\n` : "";
    const link = (rel, href) => (href ? `  <link rel="${escapeAttr(rel)}" href="${escapeAttr(href)}" />\n` : "");

    const education = asArray(config.education);
    const sameAs = [p.linkedin, p.github, p.twitter, p.website, p.huggingface, p.researchgate].filter(Boolean);
    const ld = studio
      ? {
          "@context": "https://schema.org",
          "@type": "Organization",
          name: co.name || "",
          alternateName: co.descriptor || "",
          url: canonical,
          slogan: co.tagline || "",
          description: co.description || "",
          founder: p.name ? { "@type": "Person", name: p.name, url: base || undefined } : undefined,
          sameAs,
        }
      : {
          "@context": "https://schema.org",
          "@type": "Person",
          name: p.name || "",
          jobTitle: p.role || "",
          description: seo.description || p.bio || "",
          url: canonical,
          image: ogImage || (p.photo || ""),
          email: p.email ? `mailto:${p.email}` : undefined,
          telephone: p.phone || undefined,
          address: p.location ? { "@type": "PostalAddress", addressLocality: p.location } : undefined,
          alumniOf:
            education[0] && education[0].university
              ? { "@type": "CollegeOrUniversity", name: education[0].university }
              : undefined,
          sameAs,
          knowsAbout: asArray(config.skills && config.skills.categories).flatMap((c) => asArray(c.items)),
        };

    let tags = "";
    tags += meta("name", "description", description);
    tags += meta("name", "theme-color", themeColor);
    tags += meta("name", "google-site-verification", seo.googleVerification);
    tags += link("canonical", canonical);
    tags += meta("property", "og:type", "website");
    tags += meta("property", "og:title", title);
    tags += meta("property", "og:description", description);
    tags += meta("property", "og:url", canonical);
    tags += meta("property", "og:site_name", siteName);
    tags += meta("property", "og:locale", locale);
    tags += meta("property", "og:image", ogImage);
    if (ogImage) {
      tags += meta("property", "og:image:width", "1200");
      tags += meta("property", "og:image:height", "630");
      tags += meta("property", "og:image:alt", title);
    }
    tags += meta("name", "twitter:card", "summary_large_image");
    tags += meta("name", "twitter:title", title);
    tags += meta("name", "twitter:description", description);
    tags += meta("name", "twitter:image", ogImage);
    tags += meta("name", "twitter:site", seo.twitterHandle);
    tags += `  <script id="pf-ld-json" type="application/ld+json">${jsonForHtml(ld)}</script>\n`;

    return { title, tags };
  };

  // Fills an element's text from config, so the first paint already carries the
  // value. Text-only elements (span, p, h1…) are the ones the hero uses.
  const escapeRe = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const fillBind = (html, path, value) => {
    const re = new RegExp(
      `<([a-zA-Z][\\w-]*)\\b([^>]*\\bdata-bind="${escapeRe(path)}"[^>]*)>[\\s\\S]*?</\\1>`
    );
    return html.replace(re, (m, tag, attrs) => `<${tag}${attrs}>${escapeText(value)}</${tag}>`);
  };

  // A short content hash of the config text. It goes into the config script
  // tag as a version, so a browser that cached an older copy fetches the new
  // one after the details change. FNV-1a, 32-bit, hex.
  const contentHash = (text) => {
    const s = String(text);
    let h = 0x811c9dc5;
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 0x01000193);
    }
    return (h >>> 0).toString(16).padStart(8, "0");
  };

  /**
   * Writes the title, social tags, structured data and hero text straight into
   * a page so it reads correctly without JavaScript. Safe to run twice.
   * @param {string} html   the page source
   * @param {object} config the user's config
   * @param {string} page   "index.html" | "studio.html" (studio by name)
   */
  const prerenderPage = (html, config, page) => {
    const studio = isStudioPage(page);
    const { title, tags } = staticHeadTags(config, studio);

    let out = String(html);
    out = out.replace(/\n?\s*<!-- pf:static -->[\s\S]*?<!-- \/pf:static -->/, "");
    out = out.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeText(title)}</title>`);
    out = out.replace(/<\/head>/i, `  <!-- pf:static -->\n${tags}  <!-- /pf:static -->\n</head>`);

    // Version the config script so a cached copy is never served after an edit.
    const version = contentHash(JSON.stringify(config));
    out = out.replace(/(<script\s+src=")config\.js(?:\?[^"]*)?(")/gi, `$1config.js?v=${version}$2`);

    const virtual = staticVirtual(config, studio);
    for (const key of Object.keys(virtual)) {
      if (key === "studio") continue;
      out = fillBind(out, key, virtual[key]);
    }
    return out;
  };

  /* Uploads */

  const PHOTO_TYPES = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };
  const PHOTO_MAX = 2 * 1024 * 1024;
  const RESUME_MAX = 5 * 1024 * 1024;

  /**
   * Checks an upload before it is read, so the user gets one clear sentence
   * instead of a silent failure later.
   * @returns {string} an error message, or "" when the file is acceptable.
   */
  const checkUpload = (kind, file) => {
    if (!file) return "";
    if (kind === "photo") {
      if (!PHOTO_TYPES[file.type]) return "That photo is not a JPG, PNG or WebP. Convert it and try again.";
      if (file.size > PHOTO_MAX) return `That photo is ${mb(file.size)} MB. The limit is 2 MB — resize it and try again.`;
      return "";
    }
    if (kind === "resume") {
      const isPdf = file.type === "application/pdf" || /\.pdf$/i.test(file.name);
      if (!isPdf) return "That resume is not a PDF. Export it as PDF and try again.";
      if (file.size > RESUME_MAX) return `That resume is ${mb(file.size)} MB. The limit is 5 MB — compress it and try again.`;
      return "";
    }
    return "";
  };

  const mb = (bytes) => (bytes / 1024 / 1024).toFixed(1);

  // Uploaded files live at the project root under a predictable name, so the
  // generated config can point at them without knowing what the user called
  // the file on their own machine.
  const uploadPath = (kind, file) => {
    if (kind === "photo") return `photo.${PHOTO_TYPES[file.type] || "jpg"}`;
    return "resume.pdf";
  };

  /**
   * Returns a copy of the config with the photo and resume paths pointing at
   * the uploaded files. The config is a plain object of scalars, so a JSON
   * round-trip is a safe deep copy here.
   */
  const withUploadPaths = (config, uploads) => {
    const out = JSON.parse(JSON.stringify(config));
    out.personal = out.personal || {};
    if (uploads.photo) out.personal.photo = uploads.photo.path;
    if (uploads.resume) out.personal.resume = uploads.resume.path;
    return out;
  };

  /* Files the generator rewrites from config rather than shipping as they are */

  // The site's address with any trailing slash removed, or "" when none is set.
  const siteBase = (config) => String(((config && config.seo) || {}).siteUrl || "").trim().replace(/\/+$/, "");

  const xmlEscape = (v) =>
    String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" }[c]));

  // robots.txt names the sitemap by its full address once one is known, so a
  // search engine finds it without guessing the domain.
  const staticRobots = (config) => {
    const base = siteBase(config);
    return [
      "User-agent: *",
      "Allow: /",
      "",
      base ? `Sitemap: ${base}/sitemap.xml` : "# Add your website address in the generator and the sitemap line appears here.",
      "",
    ].join("\n");
  };

  // sitemap.xml lists the two pages at the site's own address. With no address
  // the placeholder domain stays, exactly as the shipped file has it.
  const staticSitemap = (config) => {
    const base = siteBase(config);
    const origin = base || "https://your-domain.com";
    const note = base ? "" : "  <!-- Replace https://your-domain.com with your own address. -->\n";
    const url = (loc, priority) =>
      `  <url>\n    <loc>${xmlEscape(loc)}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>${priority}</priority>\n  </url>\n`;
    return (
      '<?xml version="1.0" encoding="UTF-8"?>\n' +
      note +
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
      url(`${origin}/`, "1.0") +
      url(`${origin}/studio.html`, "0.9") +
      "</urlset>\n"
    );
  };

  // Wraps one PNG in the ICO container. Modern browsers accept a PNG inside an
  // ICO, so the generator can offer a favicon.ico without an image library.
  const pngToIco = (png, size) => {
    const edge = Math.max(1, Math.min(256, Math.round(size) || 32));
    const head = new Uint8Array(22); // ICONDIR (6) + one ICONDIRENTRY (16)
    const view = new DataView(head.buffer);
    view.setUint16(0, 0, true); // reserved
    view.setUint16(2, 1, true); // type: icon
    view.setUint16(4, 1, true); // image count
    head[6] = edge === 256 ? 0 : edge; // width, 0 means 256
    head[7] = edge === 256 ? 0 : edge; // height
    head[8] = 0; // palette size
    head[9] = 0; // reserved
    view.setUint16(10, 1, true); // colour planes
    view.setUint16(12, 32, true); // bits per pixel
    view.setUint32(14, png.length, true); // bytes of image data
    view.setUint32(18, 22, true); // image offset
    return concat([head, toBytes(png)]);
  };

  return {
    crc32,
    writeZip,
    readZip,
    collectRefs,
    collectIconRefs,
    buildManifest,
    prerenderPage,
    contentHash,
    staticHeadTags,
    staticVirtual,
    jsonForHtml,
    checkUpload,
    uploadPath,
    withUploadPaths,
    siteBase,
    staticRobots,
    staticSitemap,
    pngToIco,
    PHOTO_TYPES,
    PHOTO_MAX,
    RESUME_MAX,
    HOST_FILES,
    SECURITY_POLICY,
    CORE_FILES,
    PAGES,
    sanitizeUrl,
  };
});
