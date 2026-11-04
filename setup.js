/* Portfolio Engine — config generator (setup.html) */
// A zero-dependency form that writes a ready-to-deploy website from
// config.js. It is schema-driven: SCHEMA below is the single
// description of the config shape, and everything else
// (rendering, import, export, preview) is derived from it.
//
// Keep SCHEMA in sync with config.js — that file is the contract.
(() => {
  "use strict";

  /* 1. Reusable field sets */
  const PROJECT_FIELDS = [
    { key: "name", label: "Project name", placeholder: "Project One" },
    { key: "category", label: "Category / tag", placeholder: "Web Application" },
    { key: "description", label: "Description", type: "textarea", placeholder: "What it does and who it is for." },
    { key: "tech", label: "Tech stack", type: "csv", placeholder: "React, Node.js, PostgreSQL" },
    { key: "liveUrl", label: "Live URL", placeholder: "https://your-project.netlify.app" },
    { key: "githubUrl", label: "GitHub URL", placeholder: "https://github.com/you/project" },
    { key: "result", label: "Measurable result", placeholder: "A number, percentage or milestone" },
    { key: "status", label: "Status chip", placeholder: "In Development", help: "Only shown when there are no links" },
  ];

  const RESEARCH_FIELDS = [
    { key: "title", label: "Paper title", placeholder: "Your Research Paper Title" },
    { key: "publisher", label: "Publisher", placeholder: "IEEE Xplore" },
    { key: "docId", label: "Document ID", placeholder: "11042387" },
    { key: "url", label: "Paper URL", placeholder: "https://doi.org/..." },
    { key: "year", label: "Year", placeholder: "2025" },
    { key: "summary", label: "Summary", type: "textarea", placeholder: "One sentence on what the paper contributed." },
    { key: "metrics", label: "Metrics", type: "csv", placeholder: "92% accuracy, 5,000 images evaluated" },
  ];

  const STAT_FIELDS = [
    { key: "value", label: "Value", placeholder: "5+" },
    { key: "label", label: "Label", placeholder: "Production Apps" },
  ];

  const TITLE_TEXT_FIELDS = [
    { key: "title", label: "Title", placeholder: "Delivery" },
    { key: "text", label: "Text", type: "textarea", placeholder: "One or two sentences." },
  ];

  /* 2. Schema — the description of config.js */
  const SCHEMA = [
    {
      id: "personal", title: "You", page: "portfolio", chapter: "you",
      help: "Drives the navbar, hero, about, contact, footer and the chatbot.",
      fields: [
        { key: "name", label: "Full name", placeholder: "Your name", required: true },
        { key: "initials", label: "Logo badge", placeholder: "AR", help: "1–3 characters" },
        { key: "role", label: "Professional role", placeholder: "Full-Stack Developer & AI Engineer" },
        { key: "tagline", label: "Tagline", placeholder: "Engineering Ideas Into Real-World Impact.", wide: true },
        { key: "bio", label: "Short bio", type: "textarea", wide: true, placeholder: "2–3 sentences about you." },
        {
          key: "photo", label: "Profile photo", type: "file", upload: "photo",
          accept: "image/jpeg,image/png,image/webp", placeholder: "assets/engineer-avatar.svg",
          help: "JPG, PNG or WebP, up to 2 MB. Stays in this browser — it is written into the ZIP you download.",
        },
        {
          key: "resume", label: "Resume", type: "file", upload: "resume",
          accept: "application/pdf,.pdf", placeholder: "resume.pdf",
          help: "PDF, up to 5 MB. Stays in this browser — it is written into the ZIP you download.",
        },
        { key: "location", label: "Location", placeholder: "San Francisco, CA · Open to Remote" },
        { key: "availability", label: "Availability", placeholder: "Open to full-time roles — immediate start", wide: true },
        { key: "email", label: "Email", placeholder: "hello@you.dev" },
        { key: "phone", label: "Phone", placeholder: "+1 (555) 019-2834" },
        { key: "linkedin", label: "LinkedIn URL", placeholder: "https://linkedin.com/in/you" },
        { key: "github", label: "GitHub URL", placeholder: "https://github.com/you" },
        { key: "twitter", label: "Twitter / X URL" },
        { key: "website", label: "Personal website" },
        { key: "huggingface", label: "Hugging Face URL", group: "more" },
        { key: "researchgate", label: "ResearchGate URL", group: "more" },
      ],
      groups: [
        { id: "more", title: "More links", help: "Optional. Shown in your contact cards and in the page's structured data." },
      ],
    },

    {
      id: "seo", title: "SEO & social preview", page: "both", chapter: "launch",
      help: "Written straight into <head> at runtime: title, description, canonical, Open Graph, Twitter Card and JSON-LD. No HTML editing.",
      fields: [
        { key: "siteUrl", label: "Your website address", placeholder: "https://your-site.netlify.app", wide: true, help: "The live address of your finished site, once you have one, so links you share point at the real pages and use the right preview image." },
        { key: "title", label: "Browser tab title", placeholder: "Your name — what you do", wide: true },
        { key: "description", label: "Meta description", type: "textarea", wide: true, placeholder: "One sentence for search results and link previews." },
        { key: "ogImage", label: "Social preview image", placeholder: "og-image.png", help: "1200 × 630 px works best" },
        { key: "locale", label: "Locale", placeholder: "en_US" },
        { key: "twitterHandle", label: "Twitter / X handle", placeholder: "@yourhandle" },
        { key: "themeColor", label: "Mobile browser colour", type: "color", default: "#10264b" },
        { key: "googleVerification", label: "Google verification token", placeholder: "AbC-1a2b3c4d5e", help: "The HTML-tag token from Search Console — no file needed" },
      ],
    },

    {
      id: "hero", title: "Hero", page: "portfolio", chapter: "look",
      help: "Leave these blank and the hero builds itself from your name, role and availability.",
      fields: [
        { key: "eyebrow", label: "Eyebrow line", placeholder: "Open to work", wide: true, help: "Falls back to personal.availability" },
        { key: "badge", label: "Studio badge", placeholder: "Founder @ Your Studio", wide: true, help: "Falls back to “Founder @ <company name>”" },
        { key: "titleLine1", label: "Headline line 1", placeholder: "Full-Stack Developer", help: "Falls back to your role, split on “&”" },
        { key: "titleLine2", label: "Headline line 2", placeholder: "& AI Engineer" },
      ],
      lists: [
        { key: "stats", title: "Headline numbers", kind: "object", fields: STAT_FIELDS, addLabel: "number", itemTitle: (o) => o.value || o.label },
        { key: "marquee", title: "Scrolling technology strip", kind: "string", addLabel: "keyword", help: "Leave empty to build it automatically from your skills." },
      ],
    },

    {
      id: "about", title: "About / why work with me", page: "portfolio", chapter: "look",
      help: "The “Why work with me” section on the portfolio page.",
      fields: [
        { key: "vision", label: "Highlighted call-out", type: "textarea", wide: true, placeholder: "What you're looking for next." },
      ],
      lists: [
        { key: "paragraphs", title: "Body paragraphs", kind: "string", addLabel: "paragraph", multiline: true },
        { key: "reasons", title: "Reason cards", kind: "object", fields: TITLE_TEXT_FIELDS, addLabel: "reason" },
      ],
    },

    {
      id: "skills", title: "Skills", page: "portfolio", chapter: "work",
      help: "Each category becomes a card and also feeds the chatbot's skills answer.",
      fields: [
        { key: "summary", label: "Skills summary", type: "textarea", wide: true, placeholder: "One line describing your stack." },
      ],
      lists: [
        {
          key: "categories", title: "Skill categories", kind: "object", addLabel: "category",
          fields: [
            { key: "name", label: "Category name", placeholder: "Frontend" },
            { key: "items", label: "Items", type: "csv", wide: true, placeholder: "React, TypeScript, CSS3" },
          ],
          itemTitle: (o) => o.name,
        },
      ],
    },

    {
      id: "projects", title: "Projects", page: "portfolio", chapter: "work",
      help: "Shown on the portfolio page and reused as the studio's product ecosystem when you don't define separate products. The chatbot can answer questions about each one by name.",
      lists: [{ key: "projects", title: "Project cards", kind: "object", fields: PROJECT_FIELDS, addLabel: "project", itemTitle: (o) => o.name }],
    },

    {
      id: "experience", title: "Experience", page: "portfolio", chapter: "work",
      help: "Most recent role first — the page renders them in this order.",
      lists: [{
        key: "experience", title: "Roles", kind: "object", addLabel: "role", itemTitle: (o) => o.role,
        fields: [
          { key: "role", label: "Job title", placeholder: "Full-Stack Developer" },
          { key: "company", label: "Company", placeholder: "Company Name" },
          { key: "type", label: "Type", placeholder: "Full-Time", help: "Full-Time · Internship · Contract · Freelance · Research" },
          { key: "duration", label: "Duration", placeholder: "Jan 2025 – Present" },
          { key: "location", label: "Location", placeholder: "Remote" },
          { key: "description", label: "Summary", type: "textarea", wide: true },
          { key: "highlights", label: "Highlights", type: "csv", wide: true, placeholder: "Shipped X, Improved Y by 40%" },
        ],
      }],
    },

    {
      id: "education", title: "Education", page: "portfolio", chapter: "work",
      help: "Leave every field blank to hide the Education section entirely.",
      fields: [
        { key: "degree", label: "Degree", placeholder: "B.S. in Computer Science & Engineering", wide: true },
        { key: "branch", label: "Branch / major", placeholder: "Computer Science & Engineering" },
        { key: "university", label: "University", placeholder: "University of Technology" },
        { key: "location", label: "Location", placeholder: "San Francisco, CA" },
        { key: "duration", label: "Years", placeholder: "2020 – 2024" },
        { key: "gpa", label: "Grade", placeholder: "First Class with Distinction" },
        { key: "description", label: "Note", type: "textarea", wide: true, placeholder: "Focus, thesis or honours." },
      ],
    },

    {
      id: "research", title: "Research & publications", page: "both", chapter: "extras",
      help: "Papers, theses and preprints. Leave the list empty to hide the section.",
      lists: [{ key: "research", title: "Publications", kind: "object", fields: RESEARCH_FIELDS, addLabel: "paper", itemTitle: (o) => o.title }],
    },

    {
      id: "achievements", title: "Achievements", page: "portfolio", chapter: "extras",
      help: "Awards, hackathon results and honours.",
      lists: [{
        key: "achievements", title: "Awards", kind: "object", addLabel: "award", itemTitle: (o) => o.title,
        fields: [
          { key: "title", label: "Award name", placeholder: "Hackathon / Award Name" },
          { key: "issuer", label: "Issued by", placeholder: "Organisation or Platform" },
          { key: "year", label: "Year", placeholder: "2024" },
          { key: "detail", label: "Detail", type: "textarea", wide: true, placeholder: "National Finalist — Top 5% of 10,000+ teams." },
          { key: "url", label: "Proof URL", placeholder: "https://..." },
        ],
      }],
    },

    {
      id: "certifications", title: "Certifications", page: "portfolio", chapter: "extras",
      help: "Professional certificates and course completions.",
      lists: [{
        key: "certifications", title: "Certificates", kind: "object", addLabel: "certificate", itemTitle: (o) => o.title,
        fields: [
          { key: "title", label: "Certification name", placeholder: "Certification Name" },
          { key: "issuer", label: "Issuer", placeholder: "Platform / Organisation" },
          { key: "year", label: "Year", placeholder: "2025" },
          { key: "url", label: "Verify URL", placeholder: "https://..." },
        ],
      }],
    },

    {
      id: "company", title: "Company / studio", page: "studio", chapter: "company",
      help: "Powers the entire studio.html page, the studio banner on the portfolio page and the chatbot's studio answers. Leave the name blank to remove the studio page entirely.",
      fields: [
        { key: "name", label: "Company name", placeholder: "Your Studio" },
        { key: "descriptor", label: "Descriptor", placeholder: "Technology & Innovation Studio" },
        { key: "tagline", label: "Tagline", placeholder: "Engineering ideas, shipped.", wide: true, help: "Split into the studio hero headline on each full stop" },
        { key: "philosophy", label: "Philosophy strip", placeholder: "Build • Research • Innovate • Scale • Impact", wide: true },
        { key: "description", label: "Description", type: "textarea", wide: true },
        { key: "heroParagraph", label: "Hero paragraph", type: "textarea", wide: true, help: "Falls back to the description above" },
        { key: "founded", label: "Founded", placeholder: "2025" },
        { key: "founderRole", label: "Your role", placeholder: "Founder & Principal Engineer" },
        { key: "email", label: "Studio email", placeholder: "contact@yourstudio.com" },
        { key: "phone", label: "Studio phone", placeholder: "+1 (555) 000-0000" },
        { key: "contactDescription", label: "Contact line", type: "textarea", wide: true },
        { key: "purposeVision", label: "Purpose call-out", type: "textarea", wide: true, help: "The highlighted line under your purpose paragraphs" },
      ],
      subs: [{
        key: "logo", title: "Logo files",
        help: "Optional. Leave blank to show no logo anywhere. Name files you have added to your project folder.",
        fields: [
          { key: "primary", label: "Primary", placeholder: "logo.png" },
          { key: "white", label: "White", placeholder: "logo-white.png" },
          { key: "mono", label: "Monochrome", placeholder: "logo-mono.png" },
          { key: "symbol", label: "Symbol", placeholder: "symbol.png" },
          { key: "avatar", label: "Avatar", placeholder: "avatar.png" },
          { key: "card", label: "Card image", placeholder: "studio-card.png", help: "Shown in the portfolio's studio banner and the studio hero" },
        ],
      }],
      lists: [
        { key: "heroStats", title: "Studio headline numbers", kind: "object", fields: STAT_FIELDS, addLabel: "number", itemTitle: (o) => o.value || o.label },
        { key: "purposeParagraphs", title: "Purpose paragraphs", kind: "string", addLabel: "paragraph", multiline: true },
        { key: "values", title: "Value cards", kind: "object", fields: TITLE_TEXT_FIELDS, addLabel: "value" },
        {
          key: "pillars", title: "Capability pillars", kind: "object", addLabel: "pillar", itemTitle: (o) => o.title,
          fields: [
            { key: "title", label: "Title", placeholder: "AI & Automation" },
            { key: "text", label: "Text", type: "textarea", wide: true },
          ],
        },
        { key: "research", title: "Studio research", kind: "object", fields: RESEARCH_FIELDS, addLabel: "paper", itemTitle: (o) => o.title, help: "Leave empty to reuse your personal research." },
        { key: "products", title: "Studio products", kind: "object", fields: PROJECT_FIELDS, addLabel: "product", itemTitle: (o) => o.name, help: "Leave empty to reuse your personal projects." },
      ],
    },

    {
      id: "contact", title: "Contact links", page: "both", chapter: "launch",
      help: "The stack of link cards in the contact section. Leave empty and the cards build themselves from your email, LinkedIn, GitHub and resume.",
      lists: [{
        key: "links", title: "Link cards", kind: "object", addLabel: "link", itemTitle: (o) => o.label,
        fields: [
          { key: "icon", label: "Mark", placeholder: "cv", help: "One or two letters shown in the card" },
          { key: "label", label: "Label", placeholder: "Resume" },
          { key: "sub", label: "Sub-label", placeholder: "Download the PDF" },
          { key: "url", label: "URL", placeholder: "resume.pdf" },
        ],
      }],
    },

    {
      id: "chatbot", title: "Assistant", page: "both", chapter: "look",
      help: "Tune the assistant's name and greetings. Everything else it knows is generated automatically from the sections above. Supports **bold**, *italic* and `code`.",
      fields: [
        { key: "assistantName", label: "Assistant name", placeholder: "Alex's AI Assistant", wide: true },
        { key: "greeting", label: "Portfolio greeting", type: "textarea", wide: true },
        { key: "studioGreeting", label: "Studio greeting", type: "textarea", wide: true },
      ],
      subs: [{
        key: "customResponses", title: "Custom answers",
        fields: [
          { key: "whyHire", label: "Why hire me", type: "textarea", wide: true, help: "Leave blank to auto-generate" },
          { key: "pricing", label: "Pricing", type: "textarea", wide: true },
          { key: "hobbies", label: "Hobbies", type: "textarea", wide: true },
          { key: "fallback", label: "Fallback answer", type: "textarea", wide: true, help: "Used when nothing matches" },
        ],
      }],
      lists: [{
        key: "deepDives", title: "Deep-dive topics", kind: "object", addLabel: "topic", itemTitle: (o) => o.label,
        fields: [
          { key: "key", label: "Key", placeholder: "systemDesign", help: "A short unique id" },
          { key: "label", label: "Label", placeholder: "System Design" },
          { key: "words", label: "Trigger keywords", type: "csv", wide: true, placeholder: "system design, architecture, scalability" },
          { key: "answer", label: "Answer", type: "textarea", wide: true },
        ],
      }],
    },

    {
      id: "theme", title: "Theme", page: "both", chapter: "look",
      help: "Mode, colours and fonts. Applied at runtime as CSS custom properties, so no CSS editing is needed.",
      fields: [
        {
          key: "mode", label: "Mode", type: "select", default: "light", wide: true,
          options: [
            { value: "light", label: "Light" },
            { value: "dark", label: "Dark" },
            { value: "minimal", label: "Minimal" },
          ],
          help: "Light and dark are the tuned themes. Minimal strips the shadows and softens the palette.",
        },
        { key: "primaryColor", label: "Primary (navy)", type: "color", default: "#10264B" },
        { key: "accentColor", label: "Accent", type: "color", default: "#FF7900" },
        { key: "fontHeading", label: "Heading font", placeholder: "'Space Grotesk', sans-serif", wide: true },
        { key: "fontBody", label: "Body font", placeholder: "'Inter', sans-serif", wide: true },
        { key: "fontMono", label: "Mono font", placeholder: "'IBM Plex Mono', monospace", wide: true },
        { key: "showBuiltBy", label: "Show a small “Made with the Portfolio Engine” credit in the footer", type: "bool", default: false, wide: true, help: "Off by default. It is plain text with no link." },
      ],
    },
  ];

  /* 2b. Chapters — the order the questions are asked in */
  // Every section above belongs to exactly one chapter. The wizard shows one
  // chapter at a time, so a first-time user answers a handful of related
  // questions instead of facing all fifteen sections at once. "Show everything"
  // turns the wizard off for anyone who would rather see the whole form.
  const CHAPTERS = [
    { id: "you", title: "You", hint: "Who you are, and how people reach you." },
    { id: "work", title: "Your work", hint: "Skills, projects, experience and education." },
    { id: "extras", title: "Extras", hint: "Research, awards and certifications — all optional." },
    { id: "company", title: "Your company", hint: "Only if you want the studio / agency page." },
    { id: "look", title: "Look & feel", hint: "Hero, about copy, the assistant and your colours." },
    { id: "launch", title: "Launch", hint: "Search settings, contact links — and going live." },
  ];

  /* 3. Helpers */
  const $ = (sel, root = document) => root.querySelector(sel);

  const str = (v) => (v === undefined || v === null ? "" : String(v));

  const esc = (v) =>
    str(v).replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
    );

  const splitCsv = (v) => str(v).split(",").map((s) => s.trim()).filter(Boolean);
  const joinCsv = (v) => (Array.isArray(v) ? v.join(", ") : str(v));

  const setPath = (obj, path, value) => {
    const parts = path.split(".");
    let cur = obj;
    for (let i = 0; i < parts.length - 1; i++) {
      const k = parts[i];
      if (cur[k] === undefined || cur[k] === null) cur[k] = /^\d+$/.test(parts[i + 1]) ? [] : {};
      cur = cur[k];
    }
    cur[parts[parts.length - 1]] = value;
  };

  const uid = () => "pf" + Math.random().toString(36).slice(2, 9);

  let toastTimer = null;
  const toast = (msg) => {
    const el = $("#genToast");
    el.innerHTML = msg;
    el.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("is-visible"), 4000);
  };

  /* 3b. Uploads — files the visitor picks, kept in this tab only */
  // A picked file is read into memory and sent nowhere. The bytes feed the ZIP
  // download; a path string goes into the config so the preview and the
  // generated config.js agree on where the file will end up.
  const uploads = { photo: null, resume: null };

  // Finds the config field an upload feeds, so the two never drift apart.
  const uploadField = (kind) => {
    for (const sec of SCHEMA) {
      const field = (sec.fields || []).find((f) => f.type === "file" && f.upload === kind);
      if (field) return { section: sec.id, key: field.key, path: `${sec.id}.${field.key}` };
    }
    return null;
  };

  const readUpload = (kind, file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error("The file could not be read."));
      reader.onload = () => {
        const entry = {
          name: file.name,
          type: file.type,
          bytes: new Uint8Array(reader.result),
          path: Pack.uploadPath(kind, file),
        };
        // Base64 once, here, rather than on every preview refresh.
        let binary = "";
        for (let i = 0; i < entry.bytes.length; i += 0x8000) {
          binary += String.fromCharCode.apply(null, entry.bytes.subarray(i, i + 0x8000));
        }
        entry.dataUrl = `data:${entry.type};base64,${btoa(binary)}`;
        resolve(entry);
      };
      reader.readAsArrayBuffer(file);
    });

  /* 4. State — normalize (config → form) and buildConfig (form → config) */
  const emptyItem = (list) => {
    if (list.kind === "string") return "";
    const o = {};
    list.fields.forEach((f) => (o[f.key] = ""));
    return o;
  };

  // A few sections (projects, experience, research, achievements,
  // certifications) are a bare array in config.js rather than an object
  // with one list inside it. Detect those so import/export keep the
  // right shape: `projects: [...]`, not `projects: { projects: [...] }`.
  const isArraySection = (sec) =>
    (sec.lists || []).length === 1 &&
    !(sec.fields || []).length &&
    !(sec.subs || []).length &&
    sec.lists[0].key === sec.id;

  const normalizeItem = (raw, list) => {
    if (list.kind === "string") return str(raw);
    const o = {};
    list.fields.forEach((f) => {
      o[f.key] = f.type === "csv" ? joinCsv(raw ? raw[f.key] : "") : str(raw ? raw[f.key] : "");
    });
    return o;
  };

  const normalize = (raw) => {
    const out = {};
    SCHEMA.forEach((sec) => {
      const src = (raw && raw[sec.id]) || {};
      const section = {};

      (sec.fields || []).forEach((f) => {
        if (f.type === "bool") {
          section[f.key] = src[f.key] === undefined || src[f.key] === null ? !!f.default : !!src[f.key];
        } else {
          section[f.key] = src[f.key] === undefined || src[f.key] === null ? str(f.default) : str(src[f.key]);
        }
      });

      (sec.subs || []).forEach((sub) => {
        const s = src[sub.key] || {};
        section[sub.key] = {};
        sub.fields.forEach((f) => (section[sub.key][f.key] = str(s[f.key])));
      });

      (sec.lists || []).forEach((lst) => {
        const source = isArraySection(sec) ? src : src[lst.key];
        const items = Array.isArray(source) ? source : [];
        section[lst.key] = items.map((it) => normalizeItem(it, lst));
      });

      out[sec.id] = section;
    });
    return out;
  };

  const emptyState = () => normalize({});

  const buildConfig = () => {
    const out = {};
    SCHEMA.forEach((sec) => {
      const s = state[sec.id] || {};
      const section = {};

      (sec.fields || []).forEach((f) => {
        section[f.key] = f.type === "bool" ? s[f.key] !== false : str(s[f.key]).trim();
      });

      (sec.subs || []).forEach((sub) => {
        section[sub.key] = {};
        sub.fields.forEach((f) => (section[sub.key][f.key] = str(s[sub.key] && s[sub.key][f.key]).trim()));
      });

      (sec.lists || []).forEach((lst) => {
        const items = Array.isArray(s[lst.key]) ? s[lst.key] : [];
        section[lst.key] = items
          .map((it) => {
            if (lst.kind === "string") return str(it).trim();
            const o = {};
            lst.fields.forEach((f) => (o[f.key] = f.type === "csv" ? splitCsv(it[f.key]) : str(it[f.key]).trim()));
            return o;
          })
          .filter((it) => {
            if (lst.kind === "string") return it !== "";
            return Object.values(it).some((v) => (Array.isArray(v) ? v.length > 0 : v !== ""));
          });
      });

      // An all-empty education object would otherwise render an empty card.
      if (sec.id === "education" && Object.values(section).every((v) => !str(v).trim())) return;

      out[sec.id] = isArraySection(sec) ? section[sec.lists[0].key] : section;
    });

    // A generated config is never the demo, so the "you are viewing the demo"
    // notice is always off in it. (The round-trip test compares paths, so the
    // key has to be present.)
    if (out.theme) out.theme.showDemoNotice = false;

    return out;
  };

  let state = emptyState();

  /* 5. Rendering */
  const renderUpload = (path, f, value) => {
    const id = uid();
    const picked = uploads[f.upload];

    return `<div class="gen-field is-wide">
        <span class="gen-label">${esc(f.label)}</span>
        <div class="gen-upload">
          <label class="gen-upload-pick">
            <input class="gen-file-input" type="file" id="${id}" data-upload="${esc(f.upload)}"
              accept="${esc(f.accept || "")}" aria-label="${esc(f.label)}" />
            <span class="gen-btn gen-btn-sm">Choose a file</span>
          </label>
          <span class="gen-upload-name" data-upload-name="${esc(f.upload)}">${picked ? esc(picked.name) : "No file chosen"}</span>
          <button type="button" class="gen-btn gen-btn-sm gen-btn-ghost" data-upload-clear="${esc(f.upload)}"
            ${picked ? "" : "hidden"}>Remove</button>
        </div>
        <p class="gen-upload-error" data-upload-error="${esc(f.upload)}" hidden></p>
        <details class="gen-advanced">
          <summary>Use a file path instead</summary>
          <input class="gen-input" type="text" data-path="${esc(path)}" value="${esc(value)}"
            placeholder="${esc(f.placeholder || "")}" aria-label="${esc(f.label)} path" />
        </details>
        ${f.help ? `<span class="gen-help">${esc(f.help)}</span>` : ""}
      </div>`;
  };

  const renderField = (path, f, value) => {
    const id = uid();
    let control;

    if (f.type === "file") return renderUpload(path, f, value);

    if (f.type === "bool") {
      control = `<label class="gen-check">
          <input type="checkbox" data-path="${esc(path)}" id="${id}" ${value ? "checked" : ""} />
          <span>${esc(f.label)}</span>
        </label>`;
      return `<div class="gen-field ${f.wide ? "is-wide" : ""}">${control}
        ${f.help ? `<span class="gen-help">${esc(f.help)}</span>` : ""}</div>`;
    }

    if (f.type === "color") {
      control = `<div class="gen-colour-row">
          <input type="color" data-path="${esc(path)}" id="${id}" value="${esc(value || f.default || "#000000")}" />
          <input class="gen-input" type="text" data-path="${esc(path)}" value="${esc(value)}" placeholder="${esc(f.placeholder || "#10264B")}" />
        </div>`;
    } else if (f.type === "select") {
      const options = (f.options || []).map((o) =>
        `<option value="${esc(o.value)}"${str(value) === str(o.value) ? " selected" : ""}>${esc(o.label)}</option>`
      ).join("");
      control = `<select class="gen-select" data-path="${esc(path)}" id="${id}">${options}</select>`;
    } else if (f.type === "textarea") {
      control = `<textarea class="gen-textarea" data-path="${esc(path)}" id="${id}"
        placeholder="${esc(f.placeholder || "")}">${esc(value)}</textarea>`;
    } else {
      control = `<input class="gen-input" type="text" data-path="${esc(path)}" id="${id}"
        value="${esc(value)}" placeholder="${esc(f.placeholder || "")}" ${f.key === "initials" ? 'maxlength="3"' : ""} />`;
    }

    const label = f.type === "bool" ? "" :
      `<label class="gen-label" for="${id}">${esc(f.label)}${f.required ? ' <span class="gen-req">*</span>' : ""}</label>`;

    return `<div class="gen-field ${f.wide ? "is-wide" : ""}">
        ${label}
        ${control}
        ${f.help ? `<span class="gen-help">${esc(f.help)}</span>` : ""}
      </div>`;
  };

  const renderListItem = (sectionId, list, index, item) => {
    const base = `${sectionId}.${list.key}.${index}`;
    const title = list.kind === "string"
      ? `${list.title.replace(/s$/, "")} ${index + 1}`
      : (list.itemTitle && list.itemTitle(item)) || `${list.title.replace(/s$/, "")} ${index + 1}`;

    const body = list.kind === "string"
      ? (list.multiline
        ? `<textarea class="gen-textarea" data-path="${esc(base)}" placeholder="Write it here…">${esc(item)}</textarea>`
        : `<input class="gen-input" type="text" data-path="${esc(base)}" value="${esc(item)}" placeholder="Add a value…" />`)
      : `<div class="gen-grid">${list.fields.map((f) => renderField(`${base}.${f.key}`, f, item[f.key])).join("")}</div>`;

    return `<div class="gen-item" data-item="${esc(base)}">
        <div class="gen-item-head">
          <span class="gen-item-title">${esc(title)}</span>
          <button type="button" class="gen-btn gen-btn-sm gen-btn-ghost" data-move-up="${esc(base)}"
            title="Move up" aria-label="Move up">↑</button>
          <button type="button" class="gen-btn gen-btn-sm gen-btn-ghost" data-move-down="${esc(base)}"
            title="Move down" aria-label="Move down">↓</button>
          <button type="button" class="gen-btn gen-btn-sm gen-btn-danger" data-remove="${esc(base)}"
            title="Remove" aria-label="Remove">Remove</button>
        </div>
        <div class="gen-item-body">${body}</div>
      </div>`;
  };

  const renderList = (sec, list) => {
    const items = state[sec.id][list.key] || [];
    const hostId = `listHost_${sec.id}_${list.key}`;
    const body = items.length
      ? items.map((it, i) => renderListItem(sec.id, list, i, it)).join("")
      : `<p class="gen-empty">Nothing added yet.</p>`;

    return `<div class="gen-list-head">
        <h3>${esc(list.title)}</h3>
        <span class="gen-count" data-count="${esc(hostId)}">${items.length}</span>
        <button type="button" class="gen-btn gen-btn-sm" data-add="${esc(sec.id)}|${esc(list.key)}">
          + Add ${esc(list.addLabel || "item")}
        </button>
      </div>
      ${list.help ? `<p class="gen-help" style="margin:-6px 0 10px;">${esc(list.help)}</p>` : ""}
      <div data-list-host="${esc(hostId)}">${body}</div>`;
  };

  const renderSub = (sec, sub) => {
    const s = state[sec.id][sub.key] || {};
    return `<div class="gen-list-head"><h3>${esc(sub.title)}</h3></div>
      <div class="gen-grid">${sub.fields.map((f) => renderField(`${sec.id}.${sub.key}.${f.key}`, f, s[f.key])).join("")}</div>`;
  };

  const renderSection = (sec) => {
    const allFields = sec.fields || [];
    const groups = sec.groups || [];
    const inGroup = new Set(groups.flatMap((g) => allFields.filter((f) => f.group === g.id).map((f) => f.key)));

    const grid = (fields) =>
      fields.length
        ? `<div class="gen-grid">${fields.map((f) => renderField(`${sec.id}.${f.key}`, f, state[sec.id][f.key])).join("")}</div>`
        : "";

    // A group is a collapsed block of secondary fields. It only changes how
    // they are shown — state, import and export still read sec.fields.
    const groupBlock = (g) => {
      const fields = allFields.filter((f) => f.group === g.id);
      if (!fields.length) return "";
      return `<details class="gen-group">
          <summary>${esc(g.title)}</summary>
          ${g.help ? `<p class="gen-help">${esc(g.help)}</p>` : ""}
          ${grid(fields)}
        </details>`;
    };

    const body = [
      sec.help ? `<p class="gen-card-help">${esc(sec.help)}</p>` : "",
      grid(allFields.filter((f) => !inGroup.has(f.key))),
      (sec.subs || []).map((sub) => renderSub(sec, sub)).join(""),
      (sec.lists || []).map((list) => renderList(sec, list)).join(""),
      groups.map(groupBlock).join(""),
    ].join("");

    return `<section class="gen-card" data-section-id="${esc(sec.id)}" data-chapter="${esc(sec.chapter || "")}">
        <div class="gen-card-head" data-toggle="${esc(sec.id)}">
          <h2>${esc(sec.title)}</h2>
          <span class="gen-count" data-section-count="${esc(sec.id)}"></span>
          <span class="gen-chevron">▾</span>
        </div>
        <div class="gen-card-body">${body}</div>
      </section>`;
  };

  const renderAll = () => {
    $("#genSections").innerHTML = SCHEMA.map(renderSection).join("");
    updateCounts();
    applyChapter();
  };

  /* 5b. Wizard — ask one chapter at a time */
  const LAST_CHAPTER = CHAPTERS.length - 1;
  let chapterIndex = 0;
  let showEverything = false;

  // How much of one chapter is filled in — drives the step rail's done state.
  const chapterProgress = (chapterId) => {
    let filled = 0;
    SCHEMA.filter((s) => s.chapter === chapterId).forEach((sec) => {
      const s = state[sec.id] || {};
      (sec.fields || []).forEach((f) => {
        if (f.type !== "bool" && str(s[f.key]).trim()) filled++;
      });
      (sec.subs || []).forEach((sub) => {
        sub.fields.forEach((f) => {
          if (str((s[sub.key] || {})[f.key]).trim()) filled++;
        });
      });
      (sec.lists || []).forEach((l) => {
        if ((s[l.key] || []).length) filled++;
      });
    });
    return filled;
  };

  const renderRail = () => {
    const rail = $("#genRail");
    if (!rail) return;
    rail.innerHTML = CHAPTERS.map((c, i) => {
      const done = chapterProgress(c.id) > 0;
      const active = !showEverything && i === chapterIndex;
      // The done state is a filled badge, not a colour change alone, so it is
      // still readable without colour; the label says the same thing in words.
      return `<button type="button" class="gen-rail-step${active ? " is-active" : ""}${done ? " is-done" : ""}"
          data-goto="${i}" aria-current="${active ? "step" : "false"}"
          aria-label="${esc(c.title)}: ${esc(c.hint)}${done ? " (started)" : ""}">
          <span class="gen-rail-num">${i + 1}</span>
          <span class="gen-rail-text"><b>${esc(c.title)}</b><small>${esc(c.hint)}</small></span>
        </button>`;
    }).join("");
  };

  const applyChapter = () => {
    const active = CHAPTERS[chapterIndex];
    const isLaunch = chapterIndex === LAST_CHAPTER;

    // Every card stays in the DOM — the wizard only toggles visibility, so the
    // form, its values and the generated output are unaffected by the step rail.
    document.querySelectorAll("#genSections > .gen-card").forEach((card) => {
      card.hidden = !showEverything && card.dataset.chapter !== active.id;
    });

    const launch = $("#genLaunch");
    if (launch) launch.hidden = !(showEverything || isLaunch);

    const label = $("#genStepLabel");
    if (label) {
      label.textContent = showEverything
        ? "All 15 sections shown"
        : `Step ${chapterIndex + 1} of ${CHAPTERS.length} · ${active.title}`;
    }

    const back = $("#genBack");
    const next = $("#genNext");
    if (back) back.disabled = showEverything || chapterIndex === 0;
    if (next) {
      next.disabled = showEverything || isLaunch;
      next.textContent = chapterIndex === LAST_CHAPTER - 1 ? "Next: Launch →" : "Next →";
    }

    renderRail();
  };

  const goToChapter = (i) => {
    chapterIndex = Math.max(0, Math.min(LAST_CHAPTER, i));
    showEverything = false;
    const toggle = $("#genShowAll");
    if (toggle) toggle.textContent = "Show everything";
    applyChapter();
    // Plain property write — jsdom has no window.scrollTo, and this page is
    // loaded headlessly by the test suite.
    document.documentElement.scrollTop = 0;
  };

  const setShowEverything = () => {
    showEverything = !showEverything;
    const toggle = $("#genShowAll");
    if (toggle) toggle.textContent = showEverything ? "Use the guided steps" : "Show everything";
    applyChapter();
  };

  // Re-render only one list so typing focus and scroll position survive.
  const renderListHost = (sectionId, listKey) => {
    const sec = SCHEMA.find((s) => s.id === sectionId);
    const list = sec && (sec.lists || []).find((l) => l.key === listKey);
    if (!list) return;
    const host = $(`[data-list-host="listHost_${sectionId}_${listKey}"]`);
    if (!host) return;
    const items = state[sectionId][listKey] || [];
    host.innerHTML = items.length
      ? items.map((it, i) => renderListItem(sectionId, list, i, it)).join("")
      : `<p class="gen-empty">Nothing added yet.</p>`;
    const countEl = $(`[data-count="listHost_${sectionId}_${listKey}"]`);
    if (countEl) countEl.textContent = items.length;
    updateCounts();
  };

  const filledCount = () => {
    // Flat scalar fields (including sub-objects) that hold a value.
    let total = 0;
    let filled = 0;
    SCHEMA.forEach((sec) => {
      const s = state[sec.id] || {};
      (sec.fields || []).forEach((f) => {
        if (f.type === "bool") return;
        total++;
        if (str(s[f.key]).trim()) filled++;
      });
      (sec.subs || []).forEach((sub) => {
        sub.fields.forEach((f) => {
          total++;
          if (str((s[sub.key] || {})[f.key]).trim()) filled++;
        });
      });
    });
    return { total, filled };
  };

  const updateCounts = () => {
    SCHEMA.forEach((sec) => {
      const el = $(`[data-section-count="${sec.id}"]`);
      if (!el) return;
      const items = (sec.lists || []).reduce((n, l) => n + (state[sec.id][l.key] || []).length, 0);
      const hasScalar = (sec.fields || []).some((f) => f.type !== "bool" && str(state[sec.id][f.key]).trim());
      el.textContent = items ? `${items} item${items === 1 ? "" : "s"}` : hasScalar ? "filled" : "empty";
    });

    const { total, filled } = filledCount();
    const pct = total ? Math.round((filled / total) * 100) : 0;
    $("#genMeterBar").style.width = pct + "%";
    $("#genMeterText").textContent = filled
      ? `${filled} of ${total} detail fields filled in (${pct}%).`
      : "Nothing filled in yet.";

    updateOutput();
  };

  /* 6. Output — config.js source */
  // The file starts with the assignment. No header banner: the first thing a
  // reader sees should be the config, and a test locks that in.
  const buildConfigSource = () => {
    const json = JSON.stringify(buildConfig(), null, 2).replace(/</g, "\\u003c");
    return `window.PORTFOLIO_CONFIG = ${json};\n`;
  };

  const updateOutput = () => {
    const out = $("#genOutput");
    if (out) out.value = buildConfigSource();
  };

  const parseConfigSource = (src) => {
    // The config file only ever assigns window.PORTFOLIO_CONFIG.
    const fn = new Function("window", `${src}\n;return window.PORTFOLIO_CONFIG;`);
    return fn({});
  };

  /* 7. Live preview */
  const PREVIEW_FILES = { portfolio: "index.html", studio: "studio.html" };
  let previewPage = "portfolio";
  let previewTimer = null;
  let previewFetchable = true;

  const previewFallbackNotice = () => {
    const n = $("#genPreviewNotice");
    n.hidden = false;
    n.innerHTML = previewFetchable
      ? "The live preview needs a local server. Run <code>npx serve .</code> (or <code>python -m http.server</code>) and open <code>setup.html</code> from that address. Everything else on this page works without it."
      : "Preview unavailable right now. Your settings are still saved and the download works normally.";
  };

  // In the preview the uploaded bytes are not on disk yet, so the config points
  // at the file itself instead of the path the ZIP will use. Without this the
  // preview shows a broken image for a photo the visitor just picked.
  const previewConfig = () => {
    const config = buildConfig();
    Object.keys(uploads).forEach((kind) => {
      const upload = uploads[kind];
      const field = uploadField(kind);
      if (upload && field) config[field.section][field.key] = upload.dataUrl;
    });
    return config;
  };

  const buildPreviewHtml = async () => {
    const file = PREVIEW_FILES[previewPage];
    const res = await fetch(file, { cache: "no-store" });
    if (!res.ok) throw new Error("HTTP " + res.status);
    const html = await res.text();

    const base = new URL(".", location.href).href;
    const configSrc = "window.PORTFOLIO_CONFIG = " +
      JSON.stringify(previewConfig(), null, 2).replace(/</g, "\\u003c") + ";";

    return html
      .replace(/<head>/i, `<head>\n    <base href="${base}">`)
      .replace(/<script\s+src=["']config\.js["']\s*><\/script>/i, `<script>${configSrc}</script>`);
  };

  const refreshPreview = async (immediate) => {
    clearTimeout(previewTimer);
    if (!immediate) {
      previewTimer = setTimeout(() => refreshPreview(true), 700);
      return;
    }
    const frame = $("#genPreview");
    try {
      frame.srcdoc = await buildPreviewHtml();
      $("#genPreviewNotice").hidden = true;
    } catch (err) {
      previewFetchable = false;
      previewFallbackNotice();
    }
  };

  const openPreviewInTab = async () => {
    try {
      const html = await buildPreviewHtml();
      const url = URL.createObjectURL(new Blob([html], { type: "text/html" }));
      window.open(url, "_blank", "noopener");
      setTimeout(() => URL.revokeObjectURL(url), 60000);
    } catch (err) {
      toast("Open the site from a local server to preview it in a new tab.");
    }
  };

  /* 8. Draft (localStorage) */
  const DRAFT_KEY = "portfolio-engine-draft-v1";
  let draftTimer = null;

  const saveDraft = () => {
    clearTimeout(draftTimer);
    draftTimer = setTimeout(() => {
      try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(buildConfig()));
      } catch (err) {
        /* storage full or blocked — drafts are a convenience, not a requirement */
      }
    }, 500);
  };

  const loadDraft = () => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (err) {
      return null;
    }
  };

  /* 9. Events */
  const findList = (sectionId, listKey) => {
    const sec = SCHEMA.find((s) => s.id === sectionId);
    return sec && (sec.lists || []).find((l) => l.key === listKey);
  };

  const writeToInput = (path, value) => {
    document.querySelectorAll(`[data-path="${path.replace(/"/g, '\\"')}"]`).forEach((el) => {
      if (el.type === "checkbox") el.checked = !!value;
      else el.value = str(value);
    });
  };

  const showUploadState = (kind) => {
    const picked = uploads[kind];
    const name = document.querySelector(`[data-upload-name="${kind}"]`);
    if (name) name.textContent = picked ? picked.name : "No file chosen";
    const clear = document.querySelector(`[data-upload-clear="${kind}"]`);
    if (clear) clear.hidden = !picked;
  };

  const setUploadError = (kind, message) => {
    const el = document.querySelector(`[data-upload-error="${kind}"]`);
    if (!el) return;
    el.textContent = message;
    el.hidden = !message;
  };

  const acceptUpload = (kind, file) => {
    const problem = Pack.checkUpload(kind, file);
    setUploadError(kind, problem);
    if (problem) return;

    readUpload(kind, file).then((upload) => {
      const field = uploadField(kind);
      uploads[kind] = upload;
      if (field) {
        state[field.section][field.key] = upload.path;
        writeToInput(field.path, upload.path);
      }
      showUploadState(kind);
      saveDraft();
      updateCounts();
      refreshPreview();
    });
  };

  const clearUpload = (kind) => {
    const field = uploadField(kind);
    const picked = uploads[kind];
    // A path written by this upload would point at a file the ZIP no longer
    // carries, so clear it. A path typed by hand is left alone.
    if (field && picked && str(state[field.section][field.key]) === picked.path) {
      state[field.section][field.key] = "";
      writeToInput(field.path, "");
    }
    uploads[kind] = null;
    setUploadError(kind, "");
    showUploadState(kind);
    saveDraft();
    updateCounts();
    refreshPreview();
  };

  const onFormEvent = (e) => {
    const t = e.target;

    // File uploads
    const uploadKind = t.dataset && t.dataset.upload;
    if (uploadKind) {
      const file = t.files && t.files[0];
      // Reset so picking the same file twice fires change again.
      t.value = "";
      if (file) acceptUpload(uploadKind, file);
      return;
    }

    const clearBtn = t.closest && t.closest("[data-upload-clear]");
    if (clearBtn) {
      clearUpload(clearBtn.dataset.uploadClear);
      return;
    }

    // Text / colour / checkbox edits
    if (t.dataset && t.dataset.path) {
      const path = t.dataset.path;
      const value = t.type === "checkbox" ? t.checked : t.value;
      setPath(state, path, value);

      // Keep a paired colour picker + text field in sync.
      if (t.type === "color") {
        const parts = path.split(".");
        parts.pop();
        writeToInput(path, value);
      }
      if (e.type === "change" && t.type !== "checkbox") {
        // structural-ish changes (colour swatch) — refresh the derived views
        updateCounts();
      }
      updateCounts();
      saveDraft();
      refreshPreview();
      return;
    }

    // Add / remove / move
    const addTarget = t.dataset && t.dataset.add;
    if (addTarget) {
      const [sectionId, listKey] = addTarget.split("|");
      const list = findList(sectionId, listKey);
      if (!list) return;
      state[sectionId][listKey] = state[sectionId][listKey] || [];
      state[sectionId][listKey].push(emptyItem(list));
      renderListHost(sectionId, listKey);
      saveDraft();
      refreshPreview();
      return;
    }

    const resolveIndex = (attr) => {
      const raw = t.dataset[attr];
      if (!raw) return null;
      const parts = raw.split(".");
      const index = Number(parts[parts.length - 1]);
      const listKey = parts[parts.length - 2];
      const sectionId = parts[0];
      return { sectionId, listKey, index };
    };

    const removeRef = resolveIndex("remove");
    if (removeRef) {
      state[removeRef.sectionId][removeRef.listKey].splice(removeRef.index, 1);
      renderListHost(removeRef.sectionId, removeRef.listKey);
      saveDraft();
      refreshPreview();
      return;
    }

    const moveRef = resolveIndex("moveUp") || resolveIndex("moveDown");
    if (moveRef) {
      const arr = state[moveRef.sectionId][moveRef.listKey];
      const to = t.dataset.moveUp ? moveRef.index - 1 : moveRef.index + 1;
      if (to < 0 || to >= arr.length) return;
      const [moved] = arr.splice(moveRef.index, 1);
      arr.splice(to, 0, moved);
      renderListHost(moveRef.sectionId, moveRef.listKey);
      saveDraft();
      refreshPreview();
      return;
    }

    // Collapse / expand a section
    const toggle = t.dataset && t.dataset.toggle;
    if (toggle) {
      const card = document.querySelector(`[data-section-id="${toggle}"]`);
      if (card) card.classList.toggle("is-collapsed");
    }
  };

  const saveFile = (data, filename, type) => {
    const url = URL.createObjectURL(new Blob([data], { type }));
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
  };

  const download = () => {
    saveFile(buildConfigSource(), "config.js", "text/javascript");
    toast("Downloaded <strong>config.js</strong> — drop it into your project folder, replacing the existing one.");
  };

  /* The whole website, as a ZIP */

  // Text extensions in this project are safe to read as strings; everything
  // else (images, the resume PDF) has to stay bytes or the file arrives corrupt.
  const TEXT_FILE = /\.(?:html|css|js|json|txt|xml|toml|webmanifest|svg)$/i;

  const fetchSiteFile = async (path) => {
    const res = await fetch(path, { cache: "no-store" });
    if (!res.ok) throw new Error(`${path} returned HTTP ${res.status}`);
    const bytes = new Uint8Array(await res.arrayBuffer());
    return TEXT_FILE.test(path) ? new TextDecoder().decode(bytes) : bytes;
  };

  const zipName = () => {
    const slug = str(buildConfig().personal.name)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    return `${slug || "portfolio"}-website.zip`;
  };

  // The archive is built from the files the pages name, so an unzipped copy
  // opens without a single missing request. The list is worked out to a fixed
  // point: a file the pages name can name more files of its own (the web
  // manifest names its icons), so we load what the manifest asks for until it
  // stops growing. Anything still absent is reported instead of shipped.
  const collectSite = async (config) => {
    const files = {
      "index.html": await fetchSiteFile("index.html"),
      "studio.html": await fetchSiteFile("studio.html"),
    };
    const supplied = new Set([
      "config.js",
      ...[uploads.photo, uploads.resume].filter(Boolean).map((file) => file.path),
    ]);
    const skip = (path) =>
      supplied.has(path) || Object.prototype.hasOwnProperty.call(files, path);

    for (;;) {
      const manifest = Pack.buildManifest({ files, config, extra: [...supplied] });
      const next = manifest.include.concat(manifest.missing).find((path) => !skip(path));
      if (!next) return { files, manifest };
      try {
        files[next] = await fetchSiteFile(next);
      } catch (err) {
        supplied.add(next); // not on disk; the manifest will report it as missing
      }
    }
  };

  const buildZip = async () => {
    const config = Pack.withUploadPaths(buildConfig(), uploads);
    const { files, manifest } = await collectSite(config);
    const wanted = [...new Set([...manifest.include, ...manifest.missing])].sort();

    const entries = [];
    const absent = [];
    for (const path of wanted) {
      if (Object.prototype.hasOwnProperty.call(files, path)) {
        entries.push({ path, data: files[path] });
        continue;
      }
      if (path === "config.js") {
        entries.push({ path, data: buildConfigSource() });
        continue;
      }
      const upload = [uploads.photo, uploads.resume].find((file) => file && file.path === path);
      if (upload) {
        entries.push({ path, data: upload.bytes });
        continue;
      }
      absent.push(path);
    }

    if (absent.length) throw new Error(`these files are missing: ${absent.join(", ")}`);
    return Pack.writeZip(entries);
  };

  const showWhatNow = () => {
    const panel = $("#genWhatNow");
    if (!panel) return;
    panel.hidden = false;
    if (panel.scrollIntoView) panel.scrollIntoView({ block: "nearest" });
  };

  const downloadZip = async () => {
    const btn = $("#genZipBtn");
    const label = btn.textContent;
    btn.disabled = true;
    btn.textContent = "Building the ZIP…";
    try {
      saveFile(await buildZip(), zipName(), "application/zip");
      showWhatNow();
      toast("Downloaded your website. Unzip it, then drag the folder onto Netlify Drop.");
    } catch (err) {
      toast(previewFetchable
        ? `Could not build the ZIP — ${esc(err.message)}.`
        : "Building the ZIP needs the page served over http(s). Run <code>npx serve .</code> and open the address it prints.");
    } finally {
      btn.disabled = false;
      btn.textContent = label;
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(buildConfigSource());
      toast("Copied <strong>config.js</strong> to your clipboard.");
    } catch (err) {
      const out = $("#genOutput");
      out.removeAttribute("readonly");
      out.select();
      document.execCommand("copy");
      out.setAttribute("readonly", "readonly");
      toast("Copied config.js to your clipboard.");
    }
  };

  const applyImported = (raw, message) => {
    state = normalize(raw);
    // A config brought in from outside replaces everything, uploads included —
    // keeping a file whose path the new config no longer names would be a lie.
    Object.keys(uploads).forEach((kind) => (uploads[kind] = null));
    renderAll();
    saveDraft();
    refreshPreview(true);
    if (message) toast(message);
  };

  const wireEvents = () => {
    const form = $("#genForm");
    form.addEventListener("input", onFormEvent);
    form.addEventListener("change", onFormEvent);
    form.addEventListener("click", onFormEvent);

    $("#genDownloadBtn").addEventListener("click", download);
    $("#genZipBtn").addEventListener("click", downloadZip);
    $("#genWhatNowDismiss").addEventListener("click", () => $("#genWhatNow").hidden = true);
    $("#genCopyBtn").addEventListener("click", copy);
    $("#genRefreshCode").addEventListener("click", updateOutput);
    $("#genRefreshPreview").addEventListener("click", () => refreshPreview(true));

    $("#genResetBtn").addEventListener("click", () => {
      if (!confirm("Clear everything and start from scratch? This does not affect your files.")) return;
      try { localStorage.removeItem(DRAFT_KEY); } catch (err) { /* ignore */ }
      applyImported({}, "Cleared. Starting from scratch.");
    });

    $("#genImportBtn").addEventListener("click", () => $("#genImportInput").click());

    $("#genImportInput").addEventListener("change", (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          applyImported(parseConfigSource(String(reader.result)), `Imported <strong>${esc(file.name)}</strong>.`);
        } catch (err) {
          toast("That file could not be read as a config.js.");
        }
      };
      reader.readAsText(file);
      e.target.value = "";
    });

    $("#genLoadCurrent").addEventListener("click", async () => {
      try {
        const src = await fetch("config.js", { cache: "no-store" }).then((r) => r.text());
        applyImported(parseConfigSource(src), "Loaded the project's current config.js.");
      } catch (err) {
        toast("Could not load config.js — open this page from a local server.");
      }
    });

    $("#genTabPortfolio").addEventListener("click", () => {
      previewPage = "portfolio";
      $("#genTabPortfolio").classList.add("is-active");
      $("#genTabStudio").classList.remove("is-active");
      refreshPreview(true);
    });

    $("#genTabStudio").addEventListener("click", () => {
      previewPage = "studio";
      $("#genTabStudio").classList.add("is-active");
      $("#genTabPortfolio").classList.remove("is-active");
      refreshPreview(true);
    });

    $("#genOpenTab").addEventListener("click", openPreviewInTab);

    $("#genFitBtn").addEventListener("click", (e) => {
      const frame = $("#genPreview");
      const mobile = frame.style.width === "390px";
      frame.style.width = mobile ? "100%" : "390px";
      frame.style.margin = mobile ? "" : "0 auto";
      e.target.textContent = mobile ? "Toggle mobile width" : "Toggle full width";
    });

    // Wizard: step rail, Back/Next and the "show everything" escape hatch
    const rail = $("#genRail");
    if (rail) {
      rail.addEventListener("click", (e) => {
        const btn = e.target.closest("[data-goto]");
        if (btn) goToChapter(Number(btn.dataset.goto));
      });
    }

    const back = $("#genBack");
    if (back) back.addEventListener("click", () => goToChapter(chapterIndex - 1));

    const next = $("#genNext");
    if (next) next.addEventListener("click", () => goToChapter(chapterIndex + 1));

    const showAll = $("#genShowAll");
    if (showAll) showAll.addEventListener("click", setShowEverything);

    // Launch panel: the same ZIP download, next to the deployment steps
    const launchZip = $("#genLaunchZip");
    if (launchZip) launchZip.addEventListener("click", downloadZip);
  };

  /* 10. Boot */
  const boot = () => {
    const draft = loadDraft();
    state = draft ? normalize(draft) : emptyState();

    renderAll();
    wireEvents();
    refreshPreview(true);

    // When served over http(s) we can offer the project's own config as a
    // starting point. On file:// the fetch is blocked, so the form simply
    // starts empty — the download still works.
    fetch("config.js", { cache: "no-store" })
      .then((r) => (r.ok ? r.text() : Promise.reject(new Error("no config"))))
      .then((src) => {
        const raw = parseConfigSource(src);
        $("#genLoadCurrent").hidden = false;
        if (!draft) {
          applyImported(raw, "Loaded the template's demo config as a starting point — replace it with your own details.");
        }
      })
      .catch(() => { /* file:// or missing — expected */ });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
