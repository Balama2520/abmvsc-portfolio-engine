/* Portfolio Engine */
// A single, dependency-free script that renders BOTH websites —
// index.html (your portfolio) and studio.html (your company) —
// entirely from window.PORTFOLIO_CONFIG (config.js).
//
// - Hydration engine  — text, links, images, lists, sections, SEO
// - Site chrome       — sticky nav, scroll-spy, smooth scroll, reveal
// - Resume modal      — zero-dependency PDF preview
// - Assistant         — rule-based chat, answered from config.js
//
// You should never need to edit this file. Edit config.js instead.

(() => {
  "use strict";

  const sanitizeUrl = (typeof UrlAllowlist !== "undefined" && UrlAllowlist.sanitizeUrl)
    ? UrlAllowlist.sanitizeUrl
    : (u) => u;

  /* 0. Context & helpers */
  // config.js sets window.PORTFOLIO_CONFIG. The generator's live preview ships
  // the same object in a JSON block instead, because a strict
  // Content-Security-Policy blocks the inline script that would set it.
  const inlineConfig = () => {
    const el = document.getElementById("pf-inline-config");
    if (!el) return null;
    try {
      return JSON.parse(el.textContent || "{}");
    } catch (err) {
      return null;
    }
  };
  const cfg = window.PORTFOLIO_CONFIG || inlineConfig() || {};

  const co   = cfg.company  || {};
  const p    = cfg.personal || {};
  const hero = cfg.hero     || {};
  const about = cfg.about   || {};
  const chat = cfg.chatbot  || {};
  const custom = chat.customResponses || {};
  const seo  = cfg.seo || {};
  const theme = cfg.theme || {};

  const page = document.documentElement.getAttribute("data-page") || "portfolio";
  const isStudio = page === "studio";

  const q  = (sel, root = document) => root.querySelector(sel);
  const qa = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const arr = (v) => (Array.isArray(v) ? v : v ? [v] : []);

  const esc = (v) =>
    String(v ?? "").replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
    );
  const jsonForHtml = (value) => JSON.stringify(value).replace(/[<>&\u2028\u2029]/g, (c) =>
    ({ "<": "\\u003c", ">": "\\u003e", "&": "\\u0026", "\u2028": "\\u2028", "\u2029": "\\u2029" }[c])
  );

  // Read a dotted path out of the config: get("personal.email")
  const get = (path, fallback = "") => {
    const val = String(path).split(".").reduce((acc, key) => (acc == null ? acc : acc[key]), cfg);
    return val === undefined || val === null ? fallback : val;
  };

  const setHidden = (el, hidden) => {
    if (!el) return;
    if (hidden) el.setAttribute("hidden", "");
    else el.removeAttribute("hidden");
  };

  /* 1. Data sources (handles both new + legacy config shapes) */
  const projects       = arr(cfg.projects);
  const experience     = arr(cfg.experience);
  const education      = cfg.education ? arr(cfg.education) : [];
  const achievements   = arr(cfg.achievements);
  const certifications = arr(cfg.certifications);
  const pillars        = arr(co.pillars);
  const values         = arr(co.values);
  const products       = arr(co.products).length ? arr(co.products) : projects;

  const research = isStudio && arr(co.research).length ? arr(co.research) : arr(cfg.research);
  const stats    = isStudio ? arr(co.heroStats) : arr(hero.stats);
  const marquee  = arr(hero.marquee).length
    ? arr(hero.marquee)
    : arr(cfg.skills && cfg.skills.categories).flatMap((c) => arr(c.items));

  const aboutParagraphs   = arr(about.paragraphs);
  const aboutReasons      = arr(about.reasons);
  const purposeParagraphs = arr(co.purposeParagraphs);

  // Values that are derived (with sensible fallbacks) rather than literal.
  // Anything in here can still be overridden from config.js.
  const taglineBits = String(co.tagline || "").split(".").map((s) => s.trim()).filter(Boolean);

  // The hero headline is the role split across two lines. The "&" that joins
  // the two halves is part of how the role reads, so it stays on line two
  // rather than being dropped. Set hero.titleLine1/2 to override the split.
  const roleBits = String(p.role || "").split("&").map((s) => s.trim());
  const roleLine1 = roleBits[0] || "";
  const roleLine2 = roleBits.length > 1 ? `& ${roleBits.slice(1).join(" & ")}` : "";

  const VIRTUAL = {
    "hero.eyebrow": hero.eyebrow || p.availability || "",
    "hero.badge": hero.badge || (co.name ? `Founder @ ${co.name}` : ""),
    "hero.titleLine1": hero.titleLine1 || roleLine1,
    "hero.titleLine2": hero.titleLine2 || roleLine2,
    "company.eyebrow": [co.descriptor, co.founded ? `Founded ${co.founded}` : ""].filter(Boolean).join(" · "),
    "company.titleLine1": taglineBits[0] ? `${taglineBits[0]}.` : "",
    "company.titleLine2": taglineBits.length > 1 ? `${taglineBits.slice(1).join(". ")}.` : "",
    "company.heroParagraph": co.heroParagraph || co.description || "",
  };

  // Contact cards carry a short text mark rather than a pictograph, so the row
  // reads the same in every browser and stays legible at 11px.
  const initialsOf = (text) => {
    const words = String(text || "").trim().split(/\s+/).filter(Boolean);
    if (!words.length) return "↗";
    return (words.length > 1 ? words[0][0] + words[1][0] : words[0].slice(0, 2)).toUpperCase();
  };

  // Contact link cards — explicit config first, otherwise auto-built
  const contactLinks = () => {
    const explicit = arr(cfg.contact && cfg.contact.links);
    if (explicit.length) {
      return explicit.map((l) => ({
        icon: l.icon || initialsOf(l.label),
        label: l.label,
        sub: l.sub || "",
        url: l.url || "#",
        external: /^https?:/i.test(l.url || ""),
      }));
    }

    const out = [];
    if (!isStudio && co.name) {
      out.push({
        icon: initialsOf(co.name),
        label: co.name,
        sub: co.descriptor || "Company",
        url: co.studioUrl || "studio.html",
        external: false,
      });
    }
    if (isStudio && p.name) {
      out.push({
        icon: initialsOf(p.name),
        label: `${p.name.split(" ")[0]}'s Portfolio`.replace("'s's", "'s"),
        sub: "Personal Portfolio",
        url: "index.html",
        external: false,
      });
    }
    if (p.linkedin) out.push({ icon: "in", label: "LinkedIn", sub: "Professional Profile", url: p.linkedin, external: true });
    if (p.github)   out.push({ icon: "gh", label: "GitHub",   sub: "Code Repositories",    url: p.github,   external: true });
    if (p.twitter)  out.push({ icon: "X",  label: "Twitter / X", sub: "Updates",           url: p.twitter,  external: true });
    if (p.website)  out.push({ icon: "W",  label: "Website",  sub: "Personal site",        url: p.website,  external: true });
    if (p.huggingface)  out.push({ icon: "HF", label: "Hugging Face", sub: "Models & datasets", url: p.huggingface, external: true });
    if (p.researchgate) out.push({ icon: "RG", label: "ResearchGate", sub: "Publications",      url: p.researchgate, external: true });
    if (p.resume)   out.push({ icon: "cv", label: "Resume",   sub: "Download the PDF",     url: p.resume,   external: false });
    return out;
  };

  /* 2. List renderers (one per [data-list="…"] container) */
  const statRow = (items, navy) => items
    .map((s, i) => `
      ${i ? '<div class="stat-divider"></div>' : ""}
      <div class="stat">
        <span class="stat-num"${navy ? ' style="color:var(--brand-ink);"' : ""}>${esc(s.value)}</span>
        <span class="stat-label">${esc(s.label)}</span>
      </div>`)
    .join("");

  const marqueeRow = (items) => {
    const spans = items.map((t) => `<span>${esc(t)}</span>`).join("");
    return `<div class="skills-scroll">${spans}${spans}</div>`;
  };

  const skillCards = (cats) => cats
    .map((c) => `
      <article class="skill-card">
        <h3>${esc(c.name || "Skills")}</h3>
        <div class="skill-tags">${arr(c.items).map((i) => `<span>${esc(i)}</span>`).join("")}</div>
      </article>`)
    .join("");

  const projectCards = (items) => items
    .map((pr, i) => {
      const safeLive = sanitizeUrl(pr.liveUrl, "link");
      const safeGh = sanitizeUrl(pr.githubUrl, "link");
      const links = [
        safeLive   ? `<a href="${esc(safeLive)}" target="_blank" rel="noopener noreferrer">Live ↗</a>` : "",
        safeGh ? `<a href="${esc(safeGh)}" target="_blank" rel="noopener noreferrer">GitHub ↗</a>` : "",
      ].filter(Boolean).join("");

      const topRight = links
        ? `<div class="project-links">${links}</div>`
        : pr.status ? `<span class="project-status">${esc(pr.status)}</span>` : "";

      const study = (pr.problem || pr.built)
        ? `<div class="project-study">
            ${pr.problem ? `<p><span class="study-label">The problem</span>${esc(pr.problem)}</p>` : ""}
            ${pr.built ? `<p><span class="study-label">What I built</span>${esc(pr.built)}</p>` : ""}
          </div>`
        : "";

      return `
      <article class="project-card ${i === 0 ? "project-featured" : ""}">
        <div class="project-card-top">
          <p class="project-tag">${esc(pr.category || "Project")}</p>
          ${topRight}
        </div>
        <h3>${esc(pr.name || "Untitled Project")}</h3>
        <p>${esc(pr.description || "")}</p>
        ${study}
        ${pr.result ? `<div class="project-metric">${esc(pr.result)}</div>` : ""}
        <p class="tech-stack">${arr(pr.tech).map(esc).join(" · ")}</p>
      </article>`;
    })
    .join("");

  const experienceCards = (items) => items
    .map((exp) => {
      const highlights = arr(exp.highlights);
      const meta = [exp.company, exp.type].filter(Boolean).map(esc).join(" · ");
      const right = [exp.duration, exp.location].filter(Boolean).map(esc).join(" · ");
      return `
      <article class="experience-card">
        <div class="exp-header">
          <div>
            <h3>${esc(exp.role || exp.degree || "Role")}</h3>
            <p class="exp-company">${meta || esc(exp.university || "")}</p>
          </div>
          <span class="exp-date">${right}</span>
        </div>
        ${highlights.length
          ? `<ul>${highlights.map((hl) => `<li>${esc(hl)}</li>`).join("")}</ul>`
          : `<p>${esc(exp.description || "")}</p>`}
        ${highlights.length && exp.description
          ? `<p style="margin-top:10px; font-size:14px; color:var(--text-soft);">${esc(exp.description)}</p>`
          : ""}
      </article>`;
    })
    .join("");

  const researchCards = (items) => items
    .map((r, i) => {
      const metrics = arr(r.metrics);
      const tag = [r.publisher, r.year].filter(Boolean).map(esc).join(" · ");
      const safePaperUrl = sanitizeUrl(r.url, "link");
      const link = safePaperUrl
        ? `<a class="achievement-link" href="${esc(safePaperUrl)}" target="_blank" rel="noopener noreferrer">Read the paper ↗</a>`
        : r.docId ? `<span class="achievement-tag">Doc #${esc(r.docId)}</span>` : "";
      return `
      <article class="achievement-card ${i === 0 ? "achievement-highlight" : ""}">
        <p class="achievement-tag">${tag || "Publication"}</p>
        <h3>${esc(r.title || "Publication")}</h3>
        ${r.summary ? `<p>${esc(r.summary)}</p>` : ""}
        ${metrics.length ? `<ul class="metric-list">${metrics.map((m) => `<li>${esc(m)}</li>`).join("")}</ul>` : ""}
        ${link}
      </article>`;
    })
    .join("");

  const achievementCards = (items) => items
    .map((a) => {
      const safeProof = sanitizeUrl(a.url, "link");
      return `
      <article class="achievement-card">
        <p class="achievement-tag">${esc(a.issuer || "Recognition")}</p>
        <h3>${esc(a.title || "Achievement")}</h3>
        ${a.detail ? `<p>${esc(a.detail)}</p>` : ""}
        ${a.year ? `<span class="exp-date" style="display:inline-block; margin-top:8px;">${esc(a.year)}</span>` : ""}
        ${safeProof ? `<a class="achievement-link" href="${esc(safeProof)}" target="_blank" rel="noopener noreferrer">View proof ↗</a>` : ""}
      </article>`;
    })
    .join("");

  const certCards = (items) => items
    .map((c) => {
      const safeVerify = sanitizeUrl(c.url, "link");
      return `
      <article class="cert-card">
        <p class="cert-issuer">${esc(c.issuer || "Certification")}</p>
        <h3>${esc(c.title || "Certification")}</h3>
        ${c.year ? `<p class="cert-date">${esc(c.year)}</p>` : ""}
        ${safeVerify ? `<a class="achievement-link" href="${esc(safeVerify)}" target="_blank" rel="noopener noreferrer">Verify ↗</a>` : ""}
      </article>`;
    })
    .join("");

  const pillarCards = (items) => items
    .map((b) => `
      <article class="pillar-box">
        <h4>${esc(b.title || "Pillar")}</h4>
        ${b.text ? `<p style="font-size:13px; color:var(--text-muted); margin-top:8px;">${esc(b.text)}</p>` : ""}
      </article>`)
    .join("");

  const valueCards = (items) => items
    .map((v) => `
      <div class="reason-card">
        <p class="reason-title">${esc(v.title || "Value")}</p>
        <p>${esc(v.text || "")}</p>
      </div>`)
    .join("");

  const linkCards = (items) => items
    .map((l) => {
      const safeHref = sanitizeUrl(l.url, "link");
      if (!safeHref) return "";
      return `
      <a class="contact-link-card" href="${esc(safeHref)}"${l.external ? ' target="_blank" rel="noopener noreferrer"' : ""}>
        <span class="contact-link-icon">${esc(l.icon)}</span>
        <div>
          <p class="contact-link-label">${esc(l.label)}</p>
          <p class="contact-link-sub">${esc(l.sub)}</p>
        </div>
        <span class="contact-link-arrow">↗</span>
      </a>`;
    })
    .join("");

  const paragraphBlock = (items) => items
    .map((t) => `<p>${esc(t)}</p>`)
    .join("");

  const RENDERERS = {
    stats:            (el) => statRow(stats, isStudio),
    marquee:          () => marqueeRow(marquee),
    skills:           () => skillCards(arr(cfg.skills && cfg.skills.categories)),
    projects:         () => projectCards(projects),
    products:         () => projectCards(products),
    experience:       () => experienceCards(experience),
    education:        () => experienceCards(education),
    research:         () => researchCards(research),
    achievements:     () => achievementCards(achievements),
    certifications:   () => certCards(certifications),
    pillars:          () => pillarCards(pillars),
    values:           () => valueCards(values),
    "about-paragraphs":   () => paragraphBlock(aboutParagraphs),
    "about-reasons":      () => valueCards(aboutReasons),
    "purpose-paragraphs": () => paragraphBlock(purposeParagraphs),
    "contact-links":  () => linkCards(contactLinks()),
  };

  const LIST_COUNTS = {
    stats: stats.length,
    marquee: marquee.length,
    skills: arr(cfg.skills && cfg.skills.categories).length,
    projects: projects.length,
    products: products.length,
    experience: experience.length,
    education: education.length,
    research: research.length,
    achievements: achievements.length,
    certifications: certifications.length,
    pillars: pillars.length,
    values: values.length,
    "about-paragraphs": aboutParagraphs.length,
    "about-reasons": aboutReasons.length,
    "purpose-paragraphs": purposeParagraphs.length,
    "contact-links": contactLinks().length,
  };

  /* 3. Hydration passes */

  // Blends a hex colour toward black (amount < 0) or white (amount > 0). One
  // accent value then yields a readable text shade and a soft background,
  // instead of asking the visitor to pick three colours that agree.
  const blend = (hex, amount) => {
    const match = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(String(hex).trim());
    if (!match) return hex;
    const digits = match[1].length === 3
      ? match[1].replace(/./g, (c) => c + c)
      : match[1];
    const to = amount < 0 ? 0 : 255;
    const ratio = Math.min(1, Math.abs(amount));
    const channels = [0, 2, 4].map((i) => {
      const value = parseInt(digits.slice(i, i + 2), 16);
      return Math.round(value + (to - value) * ratio).toString(16).padStart(2, "0");
    });
    return "#" + channels.join("");
  };

  // 3a. Theme mode, colours + fonts. Mode is "light", "dark" or "minimal".
  const hydrateTheme = () => {
    const root = document.documentElement;
    const dark = theme.mode === "dark";
    root.dataset.theme = theme.mode === "dark" || theme.mode === "minimal" ? theme.mode : "light";

    if (theme.primaryColor) {
      root.style.setProperty("--navy", theme.primaryColor);
      root.style.setProperty("--on-accent", theme.primaryColor);
    }
    if (theme.accentColor) {
      root.style.setProperty("--accent", theme.accentColor);
      root.style.setProperty("--accent-hover", blend(theme.accentColor, dark ? 0.14 : -0.14));
      root.style.setProperty("--accent-text", blend(theme.accentColor, dark ? 0.4 : -0.34));
      root.style.setProperty("--accent-soft", blend(theme.accentColor, dark ? -0.82 : 0.9));
    }
    if (theme.fontHeading) root.style.setProperty("--font-heading", theme.fontHeading);
    if (theme.fontBody) root.style.setProperty("--font-body", theme.fontBody);
    if (theme.fontMono) root.style.setProperty("--font-mono", theme.fontMono);
  };

  // 3b. <head> — title, meta, social cards, structured data
  const hydrateHead = () => {
    const base = String(seo.siteUrl || "").replace(/\/+$/, "");
    const canonical = base ? (isStudio ? `${base}/studio.html` : `${base}/`) : "";

    const title = isStudio
      ? `${co.name || "Studio"} — ${co.descriptor || "Company"}`
      : (seo.title || `${p.name || "Portfolio"} | ${p.role || "Developer"}`);

    const description = isStudio
      ? (co.description || "")
      : (seo.description || p.bio || "");

    document.title = title;

    const setMeta = (attr, key, content) => {
      if (!content) return;
      let el = document.head.querySelector(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    const setLink = (rel, href) => {
      if (!href) return;
      let el = document.head.querySelector(`link[rel="${rel}"]`);
      if (!el) {
        el = document.createElement("link");
        el.setAttribute("rel", rel);
        document.head.appendChild(el);
      }
      el.setAttribute("href", href);
    };

    setMeta("name", "description", description);
    setMeta("name", "theme-color", seo.themeColor || theme.primaryColor || "");
    setMeta("name", "google-site-verification", seo.googleVerification);

    if (canonical) setLink("canonical", canonical);

    const ogImage = seo.ogImage
      ? (base ? `${base}/${String(seo.ogImage).replace(/^\/+/, "")}` : seo.ogImage)
      : "";

    setMeta("property", "og:type", "website");
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:url", canonical);
    setMeta("property", "og:site_name", isStudio ? (co.name || "") : (p.name || ""));
    setMeta("property", "og:locale", seo.locale || "en_US");
    setMeta("property", "og:image", ogImage);
    if (ogImage) {
      setMeta("property", "og:image:width", "1200");
      setMeta("property", "og:image:height", "630");
      setMeta("property", "og:image:alt", title);
    }

    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:image", ogImage);
    setMeta("name", "twitter:site", seo.twitterHandle);

    // Structured data (JSON-LD)
    const sameAs = [p.linkedin, p.github, p.twitter, p.website, p.huggingface, p.researchgate].filter(Boolean);
    const ld = isStudio
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
          alumniOf: education[0] && education[0].university
            ? { "@type": "CollegeOrUniversity", name: education[0].university }
            : undefined,
          sameAs,
          knowsAbout: arr(cfg.skills && cfg.skills.categories).flatMap((c) => arr(c.items)),
        };

    let ldEl = document.getElementById("pf-ld-json");
    if (!ldEl) {
      ldEl = document.createElement("script");
      ldEl.id = "pf-ld-json";
      ldEl.type = "application/ld+json";
      document.head.appendChild(ldEl);
    }
    ldEl.textContent = jsonForHtml(JSON.parse(JSON.stringify(ld, (key, val) => (val === undefined ? undefined : val))));

    if (p.resume) {
      const modalDownload = q('.resume-modal-actions a[download]');
      if (modalDownload) modalDownload.setAttribute("href", p.resume);
    }
  };

  // 3c. Single values — [data-bind="dotted.path"]
  const hydrateText = () => {
    qa("[data-bind]").forEach((el) => {
      const key = el.getAttribute("data-bind");
      const val = key in VIRTUAL ? VIRTUAL[key] : get(key, "");
      if (val === "" || val === undefined || val === null) {
        setHidden(el, true);
        return;
      }
      setHidden(el, false);

      if (el.tagName === "IMG") {
        const safe = sanitizeUrl(val, "image");
        if (safe) {
          el.setAttribute("src", safe);
          if (p.name) el.setAttribute("alt", p.name);
        } else {
          setHidden(el, true);
        }
        return;
      }

      if (el.tagName === "A") {
        if (key.includes("email")) {
          const safe = sanitizeUrl(`mailto:${val}`, "link");
          if (safe) el.setAttribute("href", safe);
          el.textContent = val;
        } else if (key.includes("phone")) {
          const safe = sanitizeUrl(`tel:${String(val).replace(/\s/g, "")}`, "link");
          if (safe) el.setAttribute("href", safe);
          el.textContent = val;
        } else {
          const safe = sanitizeUrl(val, "link");
          if (safe) el.setAttribute("href", safe);
          else setHidden(el, true);
        }
        return;
      }

      el.textContent = val;
    });
  };

  // 3d. Lists — [data-list="name"]
  const hydrateLists = () => {
    qa("[data-list]").forEach((el) => {
      const name = el.getAttribute("data-list");
      const render = RENDERERS[name];
      if (!render) return;

      const count = LIST_COUNTS[name] || 0;
      // Hide the smallest sensible unit: an explicit wrapper first, then a
      // named section, then the list container itself.
      const host = el.closest("[data-list-host]") || el.closest("[data-section]") || el;

      if (!count) {
        setHidden(host, true);
        return;
      }
      setHidden(host, false);
      el.innerHTML = render(el);
    });
  };

  // 3e. Named sections that aren't lists — [data-section="key"]
  const SECTION_TESTS = Object.assign(
    {
      company: () => !!co.name,
      about: () => aboutParagraphs.length > 0 || !!about.vision || aboutReasons.length > 0,
      "company-purpose": () => purposeParagraphs.length > 0 || !!co.purposeVision,
      "company-founder": () => !!p.name,
      photo: () => !!p.photo,
      "company-logo": () => !!(co.logo && co.logo.card),
    },
    // Any section named after a list hides itself when that list is empty.
    Object.fromEntries(
      Object.keys(LIST_COUNTS).map((key) => [key, () => (LIST_COUNTS[key] || 0) > 0])
    )
  );

  const hydrateSections = () => {
    qa("[data-section]").forEach((el) => {
      const key = el.getAttribute("data-section");
      const test = SECTION_TESTS[key];
      if (test && !test()) setHidden(el, true);
    });
  };

  // 3f. Footer credit — [data-built-by]
  const hydrateBuiltBy = () => {
    const el = q("[data-built-by]");
    if (!el) return;
    if (theme.showBuiltBy === false) {
      setHidden(el, true);
      return;
    }
    setHidden(el, false);
    // Plain text on purpose: a generated site should not carry a link to
    // anyone else's account. The owner opted in to the credit, not to a
    // backlink, and the template repository is where it belongs.
    el.textContent = "Made with ABMVSC Portfolio Engine";
  };

  // 3g. Demo chrome — [data-demo-banner] and [data-demo-notice]
  // Shown only while config.js is still the shipped sample
  // (theme.showDemoNotice === true). A config made in setup.html always has
  // this off, so the sample chrome disappears the moment the site becomes
  // yours. The top strip carries one clear action; the corner notice repeats
  // the same line for people who have scrolled away from the top.
  const DEMO_TEXT = "This is sample content.";
  const hydrateDemoNotice = () => {
    const on = theme.showDemoNotice === true;

    const banner = q("[data-demo-banner]");
    if (banner) {
      setHidden(banner, !on);
      if (on) {
        banner.innerHTML =
          `<span class="demo-banner-text">${DEMO_TEXT}</span>` +
          '<a class="demo-banner-cta" href="setup.html">Create your own portfolio</a>';
      }
    }

    const notice = q("[data-demo-notice]");
    if (notice) {
      setHidden(notice, !on);
      if (on) {
        notice.innerHTML =
          '<span class="demo-notice-tag">Demo</span>' +
          `<span class="demo-notice-text">${DEMO_TEXT}</span>` +
          '<a href="setup.html">Make it yours →</a>';
      }
    }
  };

  const hydrate = () => {
    hydrateTheme();
    hydrateHead();
    hydrateText();
    hydrateLists();
    hydrateSections();
    hydrateBuiltBy();
    hydrateDemoNotice();
  };

  /* 4. Resume modal */
  const resumeModal = document.getElementById("resumeModal");
  const resumeFrame = document.getElementById("resumeFrame");
  const resumeFile = p.resume || "resume.pdf";

  // Keep the Download button in step with the config value — without this the
  // anchor would keep pointing at the shipped "resume.pdf" even when the user
  // points personal.resume at a file of their own.
  qa("[data-resume-download]").forEach((link) => {
    link.setAttribute("href", resumeFile);
    link.setAttribute("download", "");
  });

  const openResumeModal = () => {
    if (!resumeModal) return;
    if (resumeFrame) resumeFrame.setAttribute("src", resumeFile);
    resumeModal.classList.add("open");
    resumeModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };

  const closeResumeModal = () => {
    if (!resumeModal) return;
    resumeModal.classList.remove("open");
    resumeModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (resumeFrame) resumeFrame.setAttribute("src", "");
  };

  qa("[data-resume-trigger]").forEach((btn) => btn.addEventListener("click", openResumeModal));
  qa("[data-resume-close]").forEach((el) => el.addEventListener("click", closeResumeModal));

  /* 4b. Save contact — a vCard (.vcf) built in the browser from config.js.
     The file is assembled from the same details the page already shows, so a
     visitor can add the owner to their address book. Nothing is uploaded. */
  const vcardEscape = (value) =>
    String(value ?? "")
      .replace(/\\/g, "\\\\")
      .replace(/;/g, "\\;")
      .replace(/,/g, "\\,")
      .replace(/\r?\n/g, "\\n");

  // A vCard line over 75 characters is folded, and the next line begins with a
  // single space. Without this a long note can be read back incorrectly.
  const vcardFold = (line) => {
    if (line.length <= 75) return line;
    const out = [line.slice(0, 75)];
    let rest = line.slice(75);
    while (rest.length) {
      out.push(" " + rest.slice(0, 74));
      rest = rest.slice(74);
    }
    return out.join("\r\n");
  };

  const buildVCard = () => {
    const name = String(p.name || "").trim();
    const words = name.split(/\s+/).filter(Boolean);
    const family = words.length > 1 ? words[words.length - 1] : words[0] || "";
    const given = words.length > 1 ? words.slice(0, -1).join(" ") : "";

    const lines = ["BEGIN:VCARD", "VERSION:3.0"];
    lines.push(vcardFold(`N:${vcardEscape(family)};${vcardEscape(given)};;;`));
    lines.push(vcardFold(`FN:${vcardEscape(name)}`));
    if (p.role) lines.push(vcardFold(`TITLE:${vcardEscape(p.role)}`));
    if (co.name) lines.push(vcardFold(`ORG:${vcardEscape(co.name)}`));
    if (p.email) lines.push(vcardFold(`EMAIL;TYPE=INTERNET:${vcardEscape(p.email)}`));
    if (p.phone) lines.push(vcardFold(`TEL;TYPE=CELL:${vcardEscape(p.phone)}`));
    const site = p.website || p.linkedin || p.github || seo.siteUrl || "";
    if (site) lines.push(vcardFold(`URL:${vcardEscape(site)}`));
    if (p.location) lines.push(vcardFold(`ADR;TYPE=WORK:;;${vcardEscape(p.location)};;;;`));
    if (p.bio) lines.push(vcardFold(`NOTE:${vcardEscape(p.bio)}`));
    if (p.linkedin) lines.push(vcardFold(`X-SOCIALPROFILE;TYPE=linkedin:${vcardEscape(p.linkedin)}`));
    if (p.github) lines.push(vcardFold(`X-SOCIALPROFILE;TYPE=github:${vcardEscape(p.github)}`));
    if (p.twitter) lines.push(vcardFold(`X-SOCIALPROFILE;TYPE=twitter:${vcardEscape(p.twitter)}`));
    lines.push("END:VCARD");
    return lines.join("\r\n") + "\r\n";
  };

  const vcardFileName = () => {
    const slug = String(p.name || "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    return `${slug || "contact"}.vcf`;
  };

  const initVCard = () => {
    const buttons = qa("[data-vcard-download]");
    if (!buttons.length) return;
    // With nothing to save the button is hidden, rather than offering an empty
    // contact card.
    const hasDetails = Boolean(String(p.name || p.email || p.phone).trim());
    buttons.forEach((btn) => {
      setHidden(btn, !hasDetails);
      if (!hasDetails) return;
      btn.addEventListener("click", () => {
        const blob = new Blob([buildVCard()], { type: "text/vcard;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = vcardFileName();
        document.body.appendChild(link);
        link.click();
        link.remove();
        // Release the address once the browser has taken the file.
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      });
    });
  };

  /* 5. Site chrome — nav, scroll-spy, smooth scroll, reveal */
  const setupChrome = () => {
    // Copyright year — kept here so neither page needs an inline script.
    const yearEl = document.getElementById("footer-year");
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());

    const sections = qa("section[id]");
    const navLinks = qa("nav a");
    const navbar = q(".navbar");

    if (sections.length && navLinks.length && "IntersectionObserver" in window) {
      const spy = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const id = entry.target.getAttribute("id");
            navLinks.forEach((link) => {
              link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
            });
          });
        },
        { threshold: 0.35, rootMargin: "-10% 0px -45% 0px" }
      );
      sections.forEach((s) => spy.observe(s));
    }

    if (navbar) {
      const toggle = () => navbar.classList.toggle("scrolled", window.scrollY > 24);
      toggle();
      window.addEventListener("scroll", toggle, { passive: true });
    }

    qa('a[href^="#"]').forEach((link) => {
      link.addEventListener("click", (e) => {
        const id = link.getAttribute("href");
        if (!id || id === "#") return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
        setTimeout(() => target.removeAttribute("tabindex"), 1000);
      });
    });

    // Reveal-on-scroll — collected AFTER hydration so dynamic cards animate too.
    // Cards are visible by default; the entrance animation is a progressive
    // enhancement that only runs when the browser can observe scroll position
    // and the visitor has not asked for reduced motion. Nothing is ever hidden
    // while waiting, so a card keeps its content even if it is never scrolled
    // to (and a screenshot taken without scrolling is never blank).
    const reduceMotion =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if ("IntersectionObserver" in window && !reduceMotion) {
      const revealEls = qa(
        ".experience-card, .project-card, .achievement-card, .cert-card, .reason-card, .pillar-box, .skill-card"
      );
      if (revealEls.length) {
        const reveal = new IntersectionObserver(
          (entries, observer) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) return;
              entry.target.classList.add("reveal");
              observer.unobserve(entry.target);
            });
          },
          { threshold: 0.12 }
        );
        revealEls.forEach((el) => reveal.observe(el));
      }
    }
  };

  /* 6. AI assistant — rule-based, fully built from config.js */
  const initChatbot = () => {
    const chatbot = document.getElementById("chatbot");
    const toggle = document.getElementById("chatbotToggle");
    const closeBtn = document.getElementById("chatbotClose");
    const win = document.getElementById("chatbotWindow");
    const messages = document.getElementById("chatbotMessages");
    const quickReplies = document.getElementById("chatbotQuickReplies");
    const form = document.getElementById("chatbotForm");
    const input = document.getElementById("chatbotInput");

    if (!chatbot || !toggle || !win || !messages || !form || !input) return;

    let lastTopic = null;

    const formatMarkdown = (text) =>
      !text ? "" : String(text)
        .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.*?)\*/g, "<em>$1</em>")
        .replace(/`([^`]+)`/g, "<code>$1</code>")
        .replace(/\n\n/g, "<br><br>")
        .replace(/\n/g, "<br>")
        .replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>')
        .replace(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g, '<a href="mailto:$1">$1</a>');

    /* 6a. Knowledge, built from config */
    const skillsText = () => {
      const cats = arr(cfg.skills && cfg.skills.categories);
      if (!cats.length) return "My tech stack isn't configured yet.";
      const summary = (cfg.skills && cfg.skills.summary) ? `**Summary:** ${cfg.skills.summary}\n\n` : "";
      return summary + cats.map((c) => `• **${c.name}:** ${arr(c.items).join(", ")}`).join("\n");
    };

    const projectsText = () => {
      if (!projects.length) return "No projects configured yet.";
      return projects.map((pr, i) => {
        let line = `${i + 1}. **${pr.name}** (${pr.category || "Project"}): ${pr.description || ""}`;
        if (pr.result) line += ` — *${pr.result}*`;
        return line;
      }).join("\n");
    };

    const experienceText = () => {
      if (!experience.length) return "No work history configured yet.";
      return experience.map((e) =>
        `• **${e.role} @ ${e.company}** (${e.duration || ""}${e.type ? ", " + e.type : ""}): ${e.description || ""}`
      ).join("\n\n");
    };

    const educationText = () => {
      if (!education.length) return "Education isn't configured yet.";
      return education.map((e) =>
        `**${e.degree || "Degree"}**${e.branch ? " in " + e.branch : ""} — ${e.university || ""} (${e.duration || ""})${e.gpa ? `. ${e.gpa}` : ""}.${e.description ? " " + e.description : ""}`
      ).join("\n\n");
    };

    const researchText = () => {
      if (!research.length) return "No publications configured yet.";
      return research.map((r) => {
        let line = `• **${r.title}** — ${r.publisher || ""} (${r.year || ""}).`;
        if (r.summary) line += ` ${r.summary}`;
        if (arr(r.metrics).length) line += ` Metrics: ${arr(r.metrics).join(", ")}.`;
        return line;
      }).join("\n");
    };

    const achievementsText = () => {
      const all = [
        ...achievements.map((a) => `• **${a.title}** — ${a.issuer || ""} (${a.year || ""})${a.detail ? ": " + a.detail : ""}`),
        ...certifications.map((c) => `• **${c.title}** — ${c.issuer || ""} (${c.year || ""})`),
      ];
      return all.length ? all.join("\n") : "No achievements or certifications configured yet.";
    };

    const contactText = () =>
      [
        `**Email:** ${p.email || "—"}`,
        `**Phone:** ${p.phone || "—"}`,
        `**LinkedIn:** ${p.linkedin || "—"}`,
        `**GitHub:** ${p.github || "—"}`,
        `**Location:** ${p.location || "—"}`,
      ].join("\n");

    const deepDives = arr(chat.deepDives);

    const brain = {
      templateGuide:
        "**How this site works:**\n\n" +
        "1. **One set of details, two pages** — the personal portfolio and the company page read the same information, so they never drift apart.\n" +
        "2. **Built to be filled in** — a short form turns the owner's details into a finished website they can download and host for free.\n" +
        "3. **No frameworks, no build step, no plugins** — plain HTML, CSS and JavaScript.\n" +
        "4. **I answer from those details** — this is keyword matching, not a language model. No network call, no external service.\n\n" +
        "Try asking about **skills**, **projects** or **experience**.",

      greeting: chat.greeting || `I answer questions about ${p.name || "the portfolio owner"}'s projects, skills and background, using the details on this page.`,
      studioGreeting: chat.studioGreeting || `Welcome to ${co.name || "the studio"}. Ask me about our products, capabilities and how to work with us.`,

      summary: `**${p.name || "Portfolio Owner"}** — ${p.role || "Developer"}.\n\n${p.bio || ""}\n\n**Location:** ${p.location || "—"} | **Availability:** ${p.availability || "—"}`,
      skills: skillsText(),
      projects: projectsText(),
      experience: experienceText(),
      education: educationText(),
      research: researchText(),
      achievements: achievementsText(),
      contact: contactText(),
      location: `Based in **${p.location || "—"}**. ${p.availability || ""}`,
      hiring: `${p.name || "The portfolio owner"} is **${p.availability || "open to opportunities"}**. Location: ${p.location || "—"}.`,
      resume: `Opening ${p.name || "the"} resume now. You can preview or download the PDF directly.`,
      studio: co.name
        ? `**${co.name}** — ${co.descriptor || ""}. ${co.description || ""}\n\nPhilosophy: **${co.philosophy || "—"}**`
        : "There's no company page configured for this site.",
      pillars: pillars.length
        ? `The **${pillars.length} pillars of ${co.name || "the studio"}**:\n\n` +
          pillars.map((b, i) => `${i + 1}. **${b.title}:** ${b.text || ""}`).join("\n") +
          `\n\nPhilosophy: **${co.philosophy || "—"}**.`
        : "No company pillars configured yet.",
      whyHire: custom.whyHire ||
        `${p.name || "This developer"} builds and ships real products — review the projects above and get in touch to talk specifics.`,
      pricing: custom.pricing ||
        `For engagement details, reach out directly at ${p.email || "the address in the contact section"}.`,
      hobbies: custom.hobbies ||
        `${p.name || "The portfolio owner"} enjoys building things and learning new technology.`,
      fallback: custom.fallback ||
        `I answer from ${p.name || "this"}'s own details. Ask about **skills**, **projects**, **experience**, **research** or **how to get in touch**.`,
      joke: "Why do programmers prefer dark mode? Because light attracts bugs.",
      thanks: "You're welcome. Ask anything else about the portfolio.",
      bot: `I'm a keyword assistant built into this site. I answer from the details on this page, with no language model and no network call.`,
    };

    // Deep-dive answers become first-class topics
    deepDives.forEach((d) => {
      if (d && d.key) brain[d.key] = d.answer || "";
    });

    /* 6b. Intent matching */
    const coreRules = [
      { key: "templateGuide", words: ["template", "how does this work", "how to use", "how to edit", "config.js", "customize", "how to launch", "how to deploy", "clone", "fork"] },
      { key: "resume", words: ["resume", "cv", "curriculum vitae", "download resume", "view resume"] },
      { key: "bot", words: ["who are you", "are you ai", "are you a bot", "are you real", "what is this bot", "which ai"] },
      { key: "summary", words: ["summary", "overview", "tell me about yourself", "introduction", "bio", "profile", "background"] },
      { key: "location", words: ["location", "where are you", "where do you live", "relocate", "relocation", "city", "onsite"] },
      { key: "whyHire", words: ["why hire", "why should we hire", "why you", "strengths", "unique", "stand out", "value"] },
      { key: "pricing", words: ["salary", "pricing", "rate", "cost", "fee", "freelance", "contract", "compensation", "package", "ctc"] },
      { key: "hiring", words: ["hiring", "open for work", "available", "job", "opportunity", "notice period", "remote", "immediate", "start date", "hire"] },
      { key: "projects", words: ["project", "projects", "built", "shipped", "portfolio", "app", "apps", "code", "work"] },
      { key: "skills", words: ["skill", "skills", "tech stack", "technology", "stack", "react", "node", "python", "languages", "frameworks", "tools"] },
      { key: "experience", words: ["experience", "work history", "roles", "career", "employment", "internship"] },
      { key: "education", words: ["education", "degree", "college", "university", "graduate", "gpa", "school"] },
      { key: "research", words: ["research", "paper", "publication", "study", "journal", "thesis"] },
      { key: "achievements", words: ["achievement", "achievements", "award", "awards", "certificate", "certification", "certifications"] },
      { key: "studio", words: ["studio", "company", "firm", "agency", "philosophy"] },
      { key: "pillars", words: ["pillars", "competencies", "services", "capabilities"] },
      { key: "hobbies", words: ["hobby", "hobbies", "free time", "interests", "outside work"] },
      { key: "contact", words: ["contact", "email", "phone", "call", "reach", "linkedin", "github", "message"] },
      { key: "joke", words: ["joke", "funny", "humor", "make me laugh"] },
      { key: "thanks", words: ["thank", "thanks", "appreciate", "helpful", "good bot", "great"] },
      { key: "greeting", words: ["hi", "hello", "hey", "good morning", "good evening", "good afternoon", "greetings"] },
    ];

    const deepRules = deepDives
      .filter((d) => d && d.key && arr(d.words).length)
      .map((d) => ({ key: d.key, words: arr(d.words) }));

    const intentRules = deepRules.concat(coreRules);

    const matchQuery = (text) => {
      const query = String(text).toLowerCase().trim();
      for (const rule of intentRules) {
        if (rule.words.some((w) => query.includes(String(w).toLowerCase()))) return rule.key;
      }
      if (/(tell me more|details|explain)/.test(query) && lastTopic) return lastTopic;
      return "fallback";
    };

    const getAnswer = (key) => (brain[key] !== undefined ? brain[key] : brain.fallback);

    /* 6c. In-chat action buttons */
    const projectButtons = () =>
      projects.slice(0, 3).filter((pr) => pr.liveUrl || pr.githubUrl).map((pr) =>
        pr.liveUrl
          ? `<a href="${esc(pr.liveUrl)}" target="_blank" rel="noopener noreferrer" class="chat-action-btn">${esc(pr.name)}</a>`
          : `<a href="${esc(pr.githubUrl)}" target="_blank" rel="noopener noreferrer" class="chat-action-btn">${esc(pr.name)}</a>`
      ).join("\n            ");

    const getActions = (key) => {
      const email = p.email || "";
      const phone = p.phone || "";
      const linkedin = p.linkedin || "";
      const github = p.github || "";
      const phoneHref = phone ? `tel:${phone.replace(/\s/g, "")}` : "";
      const studioHref = co.studioUrl || "studio.html";

      switch (key) {
        case "resume":
          return `<div class="chat-actions">
            <button type="button" class="chat-action-btn primary" data-action="resume">Open Resume</button>
            <a href="${esc(resumeFile)}" download class="chat-action-btn">Download PDF</a>
            ${email ? `<a href="mailto:${esc(email)}" class="chat-action-btn">Get in Touch</a>` : ""}
          </div>`;

        case "hiring":
        case "contact":
        case "location":
          return `<div class="chat-actions">
            ${email ? `<a href="mailto:${esc(email)}" class="chat-action-btn primary">Send Email</a>` : ""}
            ${phone ? `<a href="${esc(phoneHref)}" class="chat-action-btn">Call</a>` : ""}
            <button type="button" class="chat-action-btn" data-action="resume">View Resume</button>
            ${linkedin ? `<a href="${esc(linkedin)}" target="_blank" rel="noopener noreferrer" class="chat-action-btn">LinkedIn</a>` : ""}
          </div>`;

        case "projects":
        case "skills":
        case "summary":
        case "whyHire":
          return `<div class="chat-actions">
            ${projectButtons()}
            ${github ? `<a href="${esc(github)}" target="_blank" rel="noopener noreferrer" class="chat-action-btn">GitHub</a>` : ""}
            <button type="button" class="chat-action-btn" data-action="resume">Resume</button>
          </div>`;

        case "research": {
          const links = research.filter((r) => r.url).slice(0, 2).map((r, i) =>
            `<a href="${esc(r.url)}" target="_blank" rel="noopener noreferrer" class="chat-action-btn ${i === 0 ? "primary" : ""}">${esc(r.publisher || "Paper")}</a>`
          ).join("\n            ");
          return links ? `<div class="chat-actions">${links}</div>` : "";
        }

        case "studio":
        case "pillars":
          return co.name
            ? `<div class="chat-actions">
                ${isStudio
                  ? `<a href="index.html" class="chat-action-btn primary">${esc((p.name || "Founder").split(" ")[0])}'s Portfolio</a>`
                  : `<a href="${esc(studioHref)}" class="chat-action-btn primary">${esc(co.name)}</a>`}
                <button type="button" class="chat-action-btn" data-q="projects">Products</button>
              </div>`
            : "";

        default:
          return "";
      }
    };

    /* 6d. Quick-reply chips */
    const chip = (key, label) => ({ key, label });

    const baseChips = () => {
      const chips = [];
      if (projects.length) chips.push(chip("projects", "Projects"));
      if (arr(cfg.skills && cfg.skills.categories).length) chips.push(chip("skills", "Skills"));
      if (experience.length) chips.push(chip("experience", "Experience"));
      deepDives.slice(0, 2).forEach((d) => chips.push(chip(d.key, d.label || d.key)));
      if (co.name) chips.push(chip("studio", co.name));
      chips.push(chip("resume", "Resume"));
      chips.push(chip("contact", "Contact"));
      return chips.slice(0, 8);
    };

    const CHIP_SETS = {
      projects: () => projects.slice(0, 3).map((pr) => chip("projects", pr.name)).concat([chip("skills", "Skills"), chip("resume", "Resume")]),
      skills: () => [chip("projects", "Projects"), chip("experience", "Experience"), chip("whyHire", "Why Hire"), chip("resume", "Resume")],
      research: () => [chip("achievements", "Achievements"), chip("projects", "Projects"), chip("education", "Education"), chip("resume", "Resume")],
      hiring: () => [chip("resume", "Open Resume"), chip("contact", "Contact"), chip("skills", "Tech Stack"), chip("projects", "Projects")],
      studio: () => [chip("pillars", "Capabilities"), chip("projects", "Products"), chip("contact", "Contact")],
    };

    const updateQuickChips = (key) => {
      if (!quickReplies) return;
      const set = (CHIP_SETS[key] && CHIP_SETS[key]()) || baseChips();
      quickReplies.innerHTML = set
        .map((c) => `<button type="button" data-q="${esc(c.key)}">${esc(c.label)}</button>`)
        .join("");
    };

    /* 6e. Answer renderer */
    const scrollToBottom = () => { messages.scrollTop = messages.scrollHeight; };

    const addBubble = (sender) => {
      const bubble = document.createElement("div");
      bubble.className = `chat-msg ${sender}`;
      messages.appendChild(bubble);
      scrollToBottom();
      return bubble;
    };

    // Answers are matched from config.js by keyword and rendered at once. There
    // is no model and no network call, so there is nothing to wait for.
    const renderBotResponse = (fullText, intentKey, callback) => {
      const botBubble = addBubble("bot");
      botBubble.innerHTML = formatMarkdown(fullText) + getActions(intentKey);
      scrollToBottom();
      updateQuickChips(intentKey);
      if (callback) callback();
    };

    const ask = (key, label) => {
      const userBubble = addBubble("user");
      userBubble.textContent = label;
      lastTopic = key;
      renderBotResponse(getAnswer(key), key, () => {
        if (key === "resume") openResumeModal();
      });
    };

    const handleUserMessage = (text) => {
      const clean = String(text).trim();
      if (!clean) return;
      const userBubble = addBubble("user");
      userBubble.textContent = clean;
      const intent = matchQuery(clean);
      lastTopic = intent;
      renderBotResponse(getAnswer(intent), intent, () => {
        if (intent === "resume") openResumeModal();
      });
    };

    /* 6f. Open / close & wiring */
    const openChat = () => {
      chatbot.classList.add("open");
      toggle.setAttribute("aria-expanded", "true");
      win.setAttribute("aria-hidden", "false");
      // The closed window is inert so its controls are not focusable while it is
      // out of sight and out of the screen reader's reach.
      win.inert = false;
      if (!messages.dataset.greeted) {
        messages.dataset.greeted = "true";
        updateQuickChips(null);
        renderBotResponse(isStudio ? brain.studioGreeting : brain.greeting, "greeting");
      }
      input.focus();
    };

    const closeChat = () => {
      chatbot.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      win.setAttribute("aria-hidden", "true");
      win.inert = true;
    };

    toggle.addEventListener("click", () => (chatbot.classList.contains("open") ? closeChat() : openChat()));
    closeBtn?.addEventListener("click", closeChat);

    quickReplies?.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-q]");
      if (!btn) return;
      ask(btn.getAttribute("data-q"), btn.textContent.trim());
    });

    messages.addEventListener("click", (e) => {
      const action = e.target.closest("[data-action]");
      if (action) {
        if (action.getAttribute("data-action") === "resume") openResumeModal();
        return;
      }
      const qBtn = e.target.closest("button[data-q]");
      if (qBtn) ask(qBtn.getAttribute("data-q"), qBtn.textContent.trim());
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const val = input.value;
      input.value = "";
      handleUserMessage(val);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        if (chatbot.classList.contains("open")) closeChat();
        if (resumeModal && resumeModal.classList.contains("open")) closeResumeModal();
      }
    });

    updateQuickChips(null);
  };

  /* 7. Boot */
  const boot = () => {
    hydrate();
    setupChrome();
    initVCard();
    initChatbot();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
