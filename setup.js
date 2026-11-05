/* Portfolio Engine — config generator (setup.html) */
// A zero-dependency form that writes a ready-to-deploy website from
// config.js. It is schema-driven: SCHEMA below is the single
// description of the config shape, and everything else
// (rendering, import, export, preview) is derived from it.
//
// Keep SCHEMA in sync with config.js — that file is the contract.
(() => {
  "use strict";

  const sanitizeUrl = (typeof UrlAllowlist !== "undefined" && UrlAllowlist.sanitizeUrl)
    ? UrlAllowlist.sanitizeUrl
    : (typeof require === "function" ? require("./url-allowlist.js").sanitizeUrl : (u) => u);

  /* 1. Reusable field sets */
  const PROJECT_FIELDS = [
    { key: "name", label: "Project name", placeholder: "Recipe Finder", help: "Short and clear — this becomes the card heading." },
    { key: "category", label: "Category / tag", placeholder: "Web Application", help: "One or two words shown as a small tag on the card." },
    { key: "description", label: "Description", type: "textarea", placeholder: "A web app that suggests recipes from the ingredients you already have.", help: "One or two sentences on what it does and who it is for." },
    { key: "problem", label: "The problem it solves", type: "textarea", placeholder: "People buy food they forget about and end up throwing it away.", help: "Optional. One sentence on the problem, to turn the card into a short case study." },
    { key: "built", label: "What you built", type: "textarea", placeholder: "I built an app that reads what is in the kitchen and suggests meals with it.", help: "Optional. What did you build, and what happened?" },
    { key: "tech", label: "Tech stack", type: "csv", placeholder: "React, Node.js, PostgreSQL", help: "Separate each tool with a comma." },
    { key: "liveUrl", label: "Live URL", placeholder: "https://recipe-finder.netlify.app", help: "The address of the running project. Leave blank if there is none." },
    { key: "githubUrl", label: "GitHub URL", placeholder: "https://github.com/yourname/recipe-finder", help: "The code repository link. Leave blank if it is private." },
    { key: "result", label: "Measurable result", placeholder: "Cut recipe search from 5 minutes to under 30 seconds", help: "A number, percentage or clear outcome if you have one." },
    { key: "status", label: "Status chip", placeholder: "In Development", help: "Only shown when there are no links." },
  ];

  const RESEARCH_FIELDS = [
    { key: "title", label: "Paper title", placeholder: "Detecting Plant Disease from Leaf Photos", help: "The full title as published." },
    { key: "publisher", label: "Publisher", placeholder: "IEEE Xplore", help: "Where it appeared — a journal, conference or site." },
    { key: "docId", label: "Document ID", placeholder: "11042387", help: "The publisher's own number for the paper, if there is one." },
    { key: "url", label: "Paper URL", placeholder: "https://doi.org/10.1109/1234567", help: "A link people can open to read it." },
    { key: "year", label: "Year", placeholder: "2025", help: "The year it was published." },
    { key: "summary", label: "Summary", type: "textarea", placeholder: "A model that finds leaf disease from a phone photo with 92% accuracy.", help: "One sentence on what the paper contributed." },
    { key: "metrics", label: "Metrics", type: "csv", placeholder: "92% accuracy, 5,000 images evaluated", help: "Separate each figure with a comma." },
  ];

  const STAT_FIELDS = [
    { key: "value", label: "Value", placeholder: "12", help: "The big number — keep it short." },
    { key: "label", label: "Label", placeholder: "Projects shipped", help: "What the number counts." },
  ];

  const TITLE_TEXT_FIELDS = [
    { key: "title", label: "Title", placeholder: "Clear communication", help: "A short heading." },
    { key: "text", label: "Text", type: "textarea", placeholder: "I keep you updated at every step, in plain language.", help: "One or two sentences." },
  ];

  /* 2. Schema — the description of config.js */
  const SCHEMA = [
    {
      id: "personal", title: "You", page: "portfolio", chapter: "you",
      help: "Drives the navbar, hero, about, contact, footer and the chatbot.",
      fields: [
        { key: "name", label: "Full name", placeholder: "Alex Rivera", required: true, help: "Shown in the navbar, the hero and the footer." },
        { key: "initials", label: "Logo badge", placeholder: "AR", help: "1–3 characters shown in the round logo." },
        { key: "role", label: "Professional role", placeholder: "Full-Stack Developer & AI Engineer", help: "Your job title in one line." },
        { key: "tagline", label: "Tagline", placeholder: "Engineering Ideas Into Real-World Impact.", wide: true, help: "A short line under your name." },
        { key: "bio", label: "Short bio", type: "textarea", wide: true, placeholder: "I build web apps and machine-learning tools that solve everyday problems.", help: "Two or three sentences about you." },
        {
          key: "photo", label: "Profile photo", type: "file", upload: "photo",
          accept: "image/jpeg,image/png,image/webp", placeholder: "assets/engineer-avatar.svg",
          help: "JPG, PNG or WebP, up to 2 MB. It is cropped to a square and shrunk to 800 px in this browser, then written into the ZIP you download.",
        },
        {
          key: "resume", label: "Resume", type: "file", upload: "resume",
          accept: "application/pdf,.pdf", placeholder: "resume.pdf",
          help: "PDF, up to 5 MB. Stays in this browser — it is written into the ZIP you download.",
        },
        { key: "location", label: "Location", placeholder: "Bengaluru, India · Open to Remote", help: "Where you are based, and whether you work remotely." },
        { key: "availability", label: "Availability", placeholder: "Open to full-time roles — immediate start", wide: true, help: "Your current status, shown under your role." },
        { key: "email", label: "Email", placeholder: "hello@alexrivera.dev", help: "The address people should write to." },
        { key: "phone", label: "Phone", placeholder: "+91 90000 00000", help: "Optional. Leave blank to hide it." },
        { key: "linkedin", label: "LinkedIn URL", placeholder: "https://linkedin.com/in/alexrivera", help: "Your full profile link." },
        { key: "github", label: "GitHub URL", placeholder: "https://github.com/alexrivera", help: "Your GitHub profile link." },
        { key: "twitter", label: "Twitter / X URL", placeholder: "https://x.com/alexrivera", help: "Optional. Shown in your links." },
        { key: "website", label: "Personal website", placeholder: "https://alexrivera.dev", help: "Optional. Any other site of your own." },
        { key: "huggingface", label: "Hugging Face URL", group: "more", placeholder: "https://huggingface.co/alexrivera", help: "Optional. Shown under More links." },
        { key: "researchgate", label: "ResearchGate URL", group: "more", placeholder: "https://researchgate.net/profile/Alex-Rivera", help: "Optional. Shown under More links." },
      ],
      groups: [
        { id: "more", title: "More links", help: "Optional. Shown in your contact cards and in the page's structured data." },
      ],
    },

    {
      id: "seo", title: "SEO & social preview", page: "both", chapter: "launch",
      help: "Written straight into <head> at runtime: title, description, canonical, Open Graph, Twitter Card and JSON-LD. No HTML editing.",
      fields: [
        { key: "siteUrl", label: "Your website address", placeholder: "https://alexrivera.netlify.app", wide: true, help: "The live address of your finished site, once you have one, so shared links point at the real pages and use the right preview image." },
        { key: "title", label: "Browser tab title", placeholder: "Alex Rivera — Full-Stack Developer", wide: true, help: "The text in the browser tab and in search results." },
        { key: "description", label: "Meta description", type: "textarea", wide: true, placeholder: "Full-stack developer building web apps and AI tools.", help: "One sentence for search results and link previews." },
        { key: "ogImage", label: "Social preview image", placeholder: "og-image.png", help: "The picture shown when your link is shared. 1200 × 630 px works best." },
        { key: "locale", label: "Locale", placeholder: "en_GB", help: "The language and region of your site." },
        { key: "twitterHandle", label: "Twitter / X handle", placeholder: "@alexrivera", help: "Optional. Used on the Twitter Card." },
        { key: "themeColor", label: "Mobile browser colour", type: "color", default: "#10264b", placeholder: "#10264B", help: "The address-bar colour on phones." },
        { key: "googleVerification", label: "Google verification token", placeholder: "AbC-1a2b3c4d5e", help: "The HTML-tag token from Search Console — no file needed." },
      ],
    },

    {
      id: "hero", title: "Hero", page: "portfolio", chapter: "look",
      help: "Leave these blank and the hero builds itself from your name, role and availability.",
      fields: [
        { key: "eyebrow", label: "Eyebrow line", placeholder: "Available for full-time work", wide: true, help: "The small line above your headline. Falls back to your availability." },
        { key: "badge", label: "Studio badge", placeholder: "Founder @ River Studio", wide: true, help: "The pill next to your name. Falls back to “Founder @ <company name>”." },
        { key: "titleLine1", label: "Headline line 1", placeholder: "Full-Stack Developer", help: "The first line of your headline. Falls back to your role." },
        { key: "titleLine2", label: "Headline line 2", placeholder: "& AI Engineer", help: "The second line, if you want two." },
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
        { key: "vision", label: "Highlighted call-out", type: "textarea", wide: true, placeholder: "I am looking for a team where I can build products people use every day.", help: "One sentence shown in a coloured box." },
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
        { key: "summary", label: "Skills summary", type: "textarea", wide: true, placeholder: "I work across the front end, the back end and machine learning.", help: "One line describing your stack." },
      ],
      lists: [
        {
          key: "categories", title: "Skill categories", kind: "object", addLabel: "category",
          fields: [
            { key: "name", label: "Category name", placeholder: "Frontend", help: "A group such as Frontend, Backend or Tools." },
            { key: "items", label: "Items", type: "csv", wide: true, placeholder: "React, TypeScript, CSS3", help: "Separate each skill with a comma." },
          ],
          itemTitle: (o) => o.name,
        },
      ],
    },

    {
      id: "projects", title: "Projects", page: "portfolio", chapter: "work",
      help: "Shown on the portfolio page and reused as the studio's product ecosystem when you don't define separate products. The chatbot can answer questions about each one by name. Fill in the problem and what you built to show each one as a short case study.",
      lists: [{ key: "projects", title: "Project cards", kind: "object", fields: PROJECT_FIELDS, addLabel: "project", itemTitle: (o) => o.name }],
    },

    {
      id: "experience", title: "Experience", page: "portfolio", chapter: "work",
      help: "Most recent role first — the page renders them in this order.",
      lists: [{
        key: "experience", title: "Roles", kind: "object", addLabel: "role", itemTitle: (o) => o.role,
        fields: [
          { key: "role", label: "Job title", placeholder: "Junior Software Engineer", help: "The title on your contract." },
          { key: "company", label: "Company", placeholder: "Northwind Software", help: "The employer's name." },
          { key: "type", label: "Type", placeholder: "Full-Time", help: "Full-Time · Internship · Contract · Freelance · Research" },
          { key: "duration", label: "Duration", placeholder: "Jan 2025 – Present", help: "When you started, and whether you are still there." },
          { key: "location", label: "Location", placeholder: "Remote", help: "The city, or Remote." },
          { key: "description", label: "Summary", type: "textarea", wide: true, placeholder: "Built and maintained the customer dashboard used by 4,000 people.", help: "One or two sentences on the role." },
          { key: "highlights", label: "Highlights", type: "csv", wide: true, placeholder: "Shipped the new checkout, Cut load time by 40%", help: "Separate each achievement with a comma." },
        ],
      }],
    },

    {
      id: "education", title: "Education", page: "portfolio", chapter: "work",
      help: "Leave every field blank to hide the Education section entirely.",
      fields: [
        { key: "degree", label: "Degree", placeholder: "B.Tech in Computer Science & Engineering", wide: true, help: "The full name of the qualification." },
        { key: "branch", label: "Branch / major", placeholder: "Computer Science & Engineering", help: "Your main subject." },
        { key: "university", label: "University", placeholder: "State Institute of Technology", help: "The school or university name." },
        { key: "location", label: "Location", placeholder: "Pune, India", help: "Where the school is." },
        { key: "duration", label: "Years", placeholder: "2021 – 2025", help: "The years you studied." },
        { key: "gpa", label: "Grade", placeholder: "First Class with Distinction", help: "Your grade, if you want to show it." },
        { key: "description", label: "Note", type: "textarea", wide: true, placeholder: "Final-year project on real-time sign language recognition.", help: "Anything else worth mentioning." },
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
          { key: "title", label: "Award name", placeholder: "Smart India Hackathon", help: "The name of the award or event." },
          { key: "issuer", label: "Issued by", placeholder: "Ministry of Education", help: "Who gave it." },
          { key: "year", label: "Year", placeholder: "2024", help: "The year you received it." },
          { key: "detail", label: "Detail", type: "textarea", wide: true, placeholder: "National finalist — top 5% of 10,000 teams.", help: "One line on what it was for." },
          { key: "url", label: "Proof URL", placeholder: "https://example.com/result", help: "A link that shows the award, if you have one." },
        ],
      }],
    },

    {
      id: "certifications", title: "Certifications", page: "portfolio", chapter: "extras",
      help: "Professional certificates and course completions.",
      lists: [{
        key: "certifications", title: "Certificates", kind: "object", addLabel: "certificate", itemTitle: (o) => o.title,
        fields: [
          { key: "title", label: "Certification name", placeholder: "Google Data Analytics", help: "The name of the certificate." },
          { key: "issuer", label: "Issuer", placeholder: "Google", help: "Who issued it." },
          { key: "year", label: "Year", placeholder: "2025", help: "The year you earned it." },
          { key: "url", label: "Verify URL", placeholder: "https://coursera.org/verify/XXXX", help: "The link that proves it, if you have one." },
        ],
      }],
    },

    {
      id: "company", title: "Company / studio", page: "studio", chapter: "company",
      help: "Powers the entire studio.html page, the studio banner on the portfolio page and the chatbot's studio answers. Leave the name blank to remove the studio page entirely.",
      fields: [
        { key: "name", label: "Company name", placeholder: "River Studio", help: "Leave blank to remove the studio page entirely." },
        { key: "descriptor", label: "Descriptor", placeholder: "Technology & Innovation Studio", help: "A few words describing what the studio is." },
        { key: "tagline", label: "Tagline", placeholder: "Engineering ideas, shipped.", wide: true, help: "Split into the studio hero headline on each full stop." },
        { key: "philosophy", label: "Philosophy strip", placeholder: "Build • Research • Innovate • Scale • Impact", wide: true, help: "A short strip of words under the hero." },
        { key: "description", label: "Description", type: "textarea", wide: true, placeholder: "A small studio that designs and ships software and AI tools.", help: "A paragraph on what the studio does." },
        { key: "heroParagraph", label: "Hero paragraph", type: "textarea", wide: true, placeholder: "We turn early ideas into working products.", help: "Shown on the studio hero. Falls back to the description." },
        { key: "founded", label: "Founded", placeholder: "2024", help: "The year the studio started." },
        { key: "founderRole", label: "Your role", placeholder: "Founder & Principal Engineer", help: "Your title at the studio." },
        { key: "email", label: "Studio email", placeholder: "contact@riverstudio.dev", help: "Where enquiries should go." },
        { key: "phone", label: "Studio phone", placeholder: "+91 90000 00000", help: "Optional. Leave blank to hide it." },
        { key: "contactDescription", label: "Contact line", type: "textarea", wide: true, placeholder: "Tell us what you are building and we will reply within a day.", help: "A line above the contact details." },
        { key: "purposeVision", label: "Purpose call-out", type: "textarea", wide: true, placeholder: "We build tools that save people time.", help: "The highlighted line under your purpose paragraphs." },
      ],
      subs: [{
        key: "logo", title: "Logo files",
        help: "Optional. Leave blank to show no logo anywhere. Name files you have added to your project folder.",
        fields: [
          { key: "primary", label: "Primary", placeholder: "logo.png", help: "Your main logo file." },
          { key: "white", label: "White", placeholder: "logo-white.png", help: "A white version for dark backgrounds." },
          { key: "mono", label: "Monochrome", placeholder: "logo-mono.png", help: "A single-colour version." },
          { key: "symbol", label: "Symbol", placeholder: "symbol.png", help: "A small mark on its own." },
          { key: "avatar", label: "Avatar", placeholder: "avatar.png", help: "A square version for small spots." },
          { key: "card", label: "Card image", placeholder: "studio-card.png", help: "Shown in the portfolio's studio banner and the studio hero." },
        ],
      }],
      lists: [
        { key: "heroStats", title: "Studio headline numbers", kind: "object", fields: STAT_FIELDS, addLabel: "number", itemTitle: (o) => o.value || o.label },
        { key: "purposeParagraphs", title: "Purpose paragraphs", kind: "string", addLabel: "paragraph", multiline: true },
        { key: "values", title: "Value cards", kind: "object", fields: TITLE_TEXT_FIELDS, addLabel: "value" },
        {
          key: "pillars", title: "Capability pillars", kind: "object", addLabel: "pillar", itemTitle: (o) => o.title,
          fields: [
            { key: "title", label: "Title", placeholder: "AI & Automation", help: "The pillar heading." },
            { key: "text", label: "Text", type: "textarea", wide: true, placeholder: "We build data pipelines and models that cut manual work.", help: "One or two sentences on the pillar." },
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
          { key: "icon", label: "Mark", placeholder: "cv", help: "One or two letters shown in the card." },
          { key: "label", label: "Label", placeholder: "Resume", help: "The main text on the card." },
          { key: "sub", label: "Sub-label", placeholder: "Download the PDF", help: "A short line under the label." },
          { key: "url", label: "URL", placeholder: "resume.pdf", help: "Where the card links — a web address or a file name." },
        ],
      }],
    },

    {
      id: "chatbot", title: "Assistant", page: "both", chapter: "look",
      help: "Tune the assistant's name and greetings. Everything else it knows is generated automatically from the sections above. Supports **bold**, *italic* and `code`.",
      fields: [
        { key: "assistantName", label: "Assistant name", placeholder: "Alex's Assistant", wide: true, help: "The name shown in the chat window." },
        { key: "greeting", label: "Portfolio greeting", type: "textarea", wide: true, placeholder: "Hi, I can answer questions about Alex's work.", help: "The first message on your portfolio page." },
        { key: "studioGreeting", label: "Studio greeting", type: "textarea", wide: true, placeholder: "Hi, ask me anything about the studio.", help: "The first message on the studio page." },
      ],
      subs: [{
        key: "customResponses", title: "Custom answers",
        fields: [
          { key: "whyHire", label: "Why hire me", type: "textarea", wide: true, placeholder: "I ship working features and explain my choices clearly.", help: "Leave blank to auto-generate." },
          { key: "pricing", label: "Pricing", type: "textarea", wide: true, placeholder: "Projects start from a fixed quote after a short call.", help: "What the assistant says about cost." },
          { key: "hobbies", label: "Hobbies", type: "textarea", wide: true, placeholder: "I run, read science fiction and play the guitar.", help: "What the assistant says about free time." },
          { key: "fallback", label: "Fallback answer", type: "textarea", wide: true, placeholder: "I did not catch that — try asking about projects or skills.", help: "Used when nothing matches." },
        ],
      }],
      lists: [{
        key: "deepDives", title: "Deep-dive topics", kind: "object", addLabel: "topic", itemTitle: (o) => o.label,
        fields: [
          { key: "key", label: "Key", placeholder: "systemDesign", help: "A short unique id, letters only." },
          { key: "label", label: "Label", placeholder: "System Design", help: "The topic name shown to you." },
          { key: "words", label: "Trigger keywords", type: "csv", wide: true, placeholder: "system design, architecture, scalability", help: "Words that make the assistant pick this answer." },
          { key: "answer", label: "Answer", type: "textarea", wide: true, placeholder: "I start from the data flow, then pick the simplest tools that scale.", help: "What the assistant replies with for this topic." },
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
        { key: "primaryColor", label: "Primary (navy)", type: "color", default: "#10264B", placeholder: "#10264B", help: "Used for headings and the dark sections." },
        { key: "accentColor", label: "Accent", type: "color", default: "#FF7900", placeholder: "#FF7900", help: "The highlight colour used for links and buttons." },
        { key: "fontHeading", label: "Heading font", placeholder: "'Space Grotesk', sans-serif", wide: true, help: "The font for headings." },
        { key: "fontBody", label: "Body font", placeholder: "'Inter', sans-serif", wide: true, help: "The font for paragraphs." },
        { key: "fontMono", label: "Mono font", placeholder: "'IBM Plex Mono', monospace", wide: true, help: "The font for code and small labels." },
        { key: "showBuiltBy", label: "Show a small “Made with ABMVSC Portfolio Engine” credit in the footer", type: "bool", default: false, wide: true, help: "Off by default. It is plain text with no link." },
        { key: "showDemoNotice", label: "Show floating demo notice", type: "bool", default: false, wide: true, help: "Shows the floating demo notice on index and studio pages." },
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

  // Turns bytes into the shape the rest of the generator expects: a display
  // name, a MIME type, the raw bytes for the ZIP, a path for config.js, and a
  // data URL the live preview can show without another read.
  const uploadEntry = (name, type, bytes, path) => {
    let binary = "";
    for (let i = 0; i < bytes.length; i += 0x8000) {
      binary += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
    }
    return { name, type, bytes, path, dataUrl: `data:${type};base64,${btoa(binary)}` };
  };

  const readUpload = (kind, file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error("The file could not be read."));
      reader.onload = () => {
        const bytes = new Uint8Array(reader.result);
        resolve(uploadEntry(file.name, file.type, bytes, Pack.uploadPath(kind, file)));
      };
      reader.readAsArrayBuffer(file);
    });

  /* Photos are cropped to a square, scaled down and re-encoded before they go
     into the ZIP, so a large phone photo becomes a small, square file. */
  const PHOTO_EDGE = 800;
  const PHOTO_QUALITY = 0.85;

  // Decoded through a data URL, not an object URL: the page's Content Security
  // Policy allows data: images but not blob: ones.
  const loadImageFile = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error("The photo could not be read."));
      reader.onload = () => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error("The photo could not be read."));
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    });

  const canvasToBlob = (canvas, type, quality) =>
    new Promise((resolve) => {
      if (!canvas.toBlob) { resolve(null); return; }
      canvas.toBlob((blob) => resolve(blob), type, quality);
    });

  // Returns { bytes, type, originalSize, newSize }, or null when the browser
  // cannot do the work — the caller then keeps the raw file.
  const preparePhoto = async (file) => {
    const img = await loadImageFile(file);
    const w = img.naturalWidth || img.width;
    const h = img.naturalHeight || img.height;
    if (!w || !h) return null;
    const side = Math.min(w, h);
    const edge = Math.max(1, Math.min(side, PHOTO_EDGE));
    const canvas = document.createElement("canvas");
    canvas.width = edge;
    canvas.height = edge;
    const ctx = canvas.getContext && canvas.getContext("2d");
    if (!ctx) return null;
    // Centre crop to a square, then scale to the target edge.
    ctx.drawImage(img, (w - side) / 2, (h - side) / 2, side, side, 0, 0, edge, edge);
    let blob = await canvasToBlob(canvas, "image/webp", PHOTO_QUALITY);
    if (!blob || blob.type !== "image/webp") blob = await canvasToBlob(canvas, "image/jpeg", PHOTO_QUALITY);
    if (!blob) return null;
    const buffer = await blob.arrayBuffer();
    return { bytes: new Uint8Array(buffer), type: blob.type || "image/jpeg", originalSize: file.size, newSize: buffer.byteLength };
  };

  /* Brand images: a social preview card and initials favicons, drawn here with
     the canvas rather than shipped as the sample artwork. If the browser cannot
     draw them the files on disk are used unchanged, so a ZIP is never lost. */
  const OG_FILE = "og-image.png";
  const OG_WIDTH = 1200;
  const OG_HEIGHT = 630;
  const BRAND_FONT = "'Space Grotesk', 'Inter', system-ui, sans-serif";

  const ICON_FILES = [
    { file: "favicon-16x16.png", size: 16 },
    { file: "favicon-32x32.png", size: 32 },
    { file: "apple-touch-icon.png", size: 180 },
    { file: "android-chrome-192x192.png", size: 192 },
    { file: "android-chrome-512x512.png", size: 512 },
  ];

  const hexColor = (value, fallback) =>
    /^#[0-9a-f]{6}$/i.test(str(value).trim()) ? str(value).trim() : fallback;

  // WCAG relative luminance, used only to choose a readable text colour.
  const luminance = (hex) => {
    const n = parseInt(hex.slice(1), 16);
    const parts = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => {
      const c = v / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * parts[0] + 0.7152 * parts[1] + 0.0722 * parts[2];
  };

  const contrast = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);

  // Picks white or near-black, whichever reads better on the given colour.
  const readableText = (bg) =>
    contrast(luminance(bg), luminance("#FFFFFF")) >= contrast(luminance(bg), luminance("#0B1729"))
      ? "#FFFFFF"
      : "#0B1729";

  const initialsOf = (name, initials) => {
    const given = str(initials).trim();
    if (given) return given.slice(0, 3).toUpperCase();
    const words = str(name).trim().split(/\s+/).filter(Boolean);
    if (!words.length) return "AB";
    return words.slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  };

  // Sets the font at a starting size and shrinks it until the text fits.
  const fitText = (ctx, text, maxWidth, weight, size, family) => {
    let at = size;
    for (;;) {
      ctx.font = `${weight} ${at}px ${family}`;
      if (ctx.measureText(text).width <= maxWidth || at <= 16) break;
      at -= 2;
    }
    return at;
  };

  const newCanvas = (w, h) => {
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext && canvas.getContext("2d");
    return ctx ? { canvas, ctx } : null;
  };

  const canvasBytes = async (canvas) => {
    const blob = await canvasToBlob(canvas, "image/png", 1);
    if (!blob) return null;
    return new Uint8Array(await blob.arrayBuffer());
  };

  // A 1200 x 630 card: dark background, an accent bar and monogram, the name
  // and role in large type. Sized for the social preview images crawlers read.
  const drawSocialCard = async (config, accent, primary, initials) => {
    const frame = newCanvas(OG_WIDTH, OG_HEIGHT);
    if (!frame) return null;
    const { ctx } = frame;
    const p = (config && config.personal) || {};
    const name = str(p.name).trim() || "Your Name";
    const role = str(p.role).trim();

    ctx.fillStyle = primary;
    ctx.fillRect(0, 0, OG_WIDTH, OG_HEIGHT);
    ctx.fillStyle = accent;
    ctx.fillRect(0, OG_HEIGHT - 18, OG_WIDTH, 18);

    const badge = 132;
    const bx = 96;
    const by = 88;
    ctx.fillStyle = accent;
    if (ctx.arc) {
      ctx.beginPath();
      ctx.arc(bx + badge / 2, by + badge / 2, badge / 2, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillRect(bx, by, badge, badge);
    }
    ctx.fillStyle = readableText(accent);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    fitText(ctx, initials, badge * 0.8, 700, 64, BRAND_FONT);
    ctx.fillText(initials, bx + badge / 2, by + badge / 2 + 4);

    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    const left = 96;
    const maxWidth = OG_WIDTH - left * 2;

    const nameSize = fitText(ctx, name, maxWidth, 700, 76, BRAND_FONT);
    ctx.font = `700 ${nameSize}px ${BRAND_FONT}`;
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText(name, left, 372);

    ctx.fillStyle = accent;
    ctx.fillRect(left, 400, 128, 8);

    if (role) {
      const roleSize = fitText(ctx, role, maxWidth, 500, 34, BRAND_FONT);
      ctx.font = `500 ${roleSize}px ${BRAND_FONT}`;
      ctx.fillStyle = "#C7D2E0";
      ctx.fillText(role, left, 468);
    }

    return canvasBytes(frame.canvas);
  };

  // A square tile carrying the initials, for every favicon size.
  const drawMonogram = async (size, initials, accent) => {
    const frame = newCanvas(size, size);
    if (!frame) return null;
    const { ctx } = frame;
    ctx.fillStyle = accent;
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = readableText(accent);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const seed = initials.length > 2 ? Math.round(size * 0.42) : Math.round(size * 0.58);
    const glyph = fitText(ctx, initials, size * 0.82, 700, seed, BRAND_FONT);
    ctx.fillText(initials, size / 2, size / 2 + Math.max(1, glyph * 0.04));
    return canvasBytes(frame.canvas);
  };

  // Returns the generated files keyed by name, or {} when the browser cannot
  // draw them and the files on disk should be kept.
  const renderBrandAssets = async (config) => {
    if (typeof document === "undefined" || !document.createElement) return {};
    const theme = (config && config.theme) || {};
    const accent = hexColor(theme.accentColor, "#FF7900");
    const primary = hexColor(theme.primaryColor, "#10264B");
    const p = (config && config.personal) || {};
    const initials = initialsOf(p.name, p.initials);

    const out = {};
    try {
      const social = await drawSocialCard(config, accent, primary, initials);
      if (social) out[OG_FILE] = social;
      for (const icon of ICON_FILES) {
        const bytes = await drawMonogram(icon.size, initials, accent);
        if (bytes) out[icon.file] = bytes;
      }
      if (out["favicon-32x32.png"]) out["favicon.ico"] = Pack.pngToIco(out["favicon-32x32.png"], 32);
    } catch (err) {
      return {};
    }
    return out;
  };

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

    // A blank social image is filled with the card the generator draws, so a
    // shared link always has a picture to show.
    if (out.seo && !str(out.seo.ogImage).trim()) out.seo.ogImage = OG_FILE;

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
        <p class="gen-upload-note" data-upload-note="${esc(f.upload)}" hidden></p>
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
      // The label starts with the number and title shown on the button, so the
      // spoken name matches the visible text.
      return `<button type="button" class="gen-rail-step${active ? " is-active" : ""}${done ? " is-done" : ""}"
          data-goto="${i}" aria-current="${active ? "step" : "false"}"
          aria-label="${i + 1} ${esc(c.title)} ${esc(c.hint)}${done ? " (started)" : ""}">
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

  // The recruiter checklist is computed from the current answers. Nothing is
  // sent anywhere and nothing is stored. It lists the things a hiring manager
  // looks for, and every missing item can jump straight to its field.
  const recruiterItems = () => {
    const p = state.personal || {};
    const projects = (state.projects && state.projects.projects) || [];
    const linked = projects.filter((pr) => str(pr.liveUrl).trim() || str(pr.githubUrl).trim());
    const bioLen = str(p.bio).trim().length;
    return [
      { label: "Your full name", done: !!str(p.name).trim(), path: "personal.name" },
      { label: "Your role in one line", done: !!str(p.role).trim(), path: "personal.role" },
      {
        label: "A short bio of 150 to 400 characters",
        done: bioLen >= 150 && bioLen <= 400,
        path: "personal.bio",
        hint: bioLen ? `${bioLen} characters so far` : "Add a sentence or two about you",
      },
      { label: "A profile photo", done: !!(uploads.photo || str(p.photo).trim()), section: "personal", upload: "photo" },
      { label: "Your resume as a PDF", done: !!(uploads.resume || str(p.resume).trim()), section: "personal", upload: "resume" },
      {
        label: "Three or more projects with a link",
        done: linked.length >= 3,
        section: "projects",
        hint: `${linked.length} with a link`,
      },
      { label: "An email address", done: !!str(p.email).trim(), path: "personal.email" },
      { label: "A LinkedIn or GitHub profile", done: !!str(p.linkedin).trim() || !!str(p.github).trim(), path: "personal.linkedin" },
    ];
  };

  // Jump to whichever field, upload or card a checklist item is about.
  const revealCheck = (item) => {
    if (!item) return;
    const sectionId = item.section || (item.path || "").split(".")[0];
    const sec = SCHEMA.find((s) => s.id === sectionId);
    if (!sec) return;
    if (!showEverything) {
      const ci = CHAPTERS.findIndex((c) => c.id === sec.chapter);
      if (ci >= 0) goToChapter(ci);
    }
    const card = document.querySelector(`[data-section-id="${sectionId}"]`);
    if (card) {
      card.classList.remove("is-collapsed");
      if (card.scrollIntoView) card.scrollIntoView({ block: "start" });
    }
    const selector = item.upload
      ? `[data-upload="${item.upload}"]`
      : item.path ? `[data-path="${item.path}"]` : "";
    const field = selector ? document.querySelector(selector) : null;
    if (field && field.focus) field.focus();
  };

  const renderChecklist = () => {
    const host = $("#genChecklist");
    if (!host) return;
    const items = recruiterItems();
    host.innerHTML = items.map((it, i) =>
      `<li class="gen-check-item${it.done ? " is-done" : ""}">
          <span class="gen-check-label">${esc(it.label)}${it.hint ? ` <small>${esc(it.hint)}</small>` : ""}</span>
          ${it.done
            ? '<span class="gen-check-tag">Done</span>'
            : `<button type="button" class="gen-linkbtn" data-check-go="${i}">Go to this field</button>`}
        </li>`
    ).join("");
  };

  const updateCounts = () => {
    SCHEMA.forEach((sec) => {
      const el = $(`[data-section-count="${sec.id}"]`);
      if (!el) return;
      const items = (sec.lists || []).reduce((n, l) => n + (state[sec.id][l.key] || []).length, 0);
      const hasScalar = (sec.fields || []).some((f) => f.type !== "bool" && str(state[sec.id][f.key]).trim());
      el.textContent = items ? `${items} item${items === 1 ? "" : "s"}` : hasScalar ? "filled" : "empty";
    });

    renderChecklist();
    const items = recruiterItems();
    const ready = items.filter((it) => it.done).length;
    const meter = $("#genMeterBar");
    if (meter) meter.style.width = Math.round((ready / items.length) * 100) + "%";
    const text = $("#genMeterText");
    if (text) {
      text.textContent = ready === items.length
        ? "All checks done — your site is ready to share."
        : `${ready} of ${items.length} checks done.`;
    }

    updateOutput();
  };

  /* 6. Output — config.js source */
  // The file starts with the assignment. No header banner: the first thing a
  // reader sees should be the config, and a test locks that in.
  const configSource = (config) => {
    const json = JSON.stringify(config, null, 2).replace(/</g, "\\u003c");
    return `window.PORTFOLIO_CONFIG = ${json};\n`;
  };
  const buildConfigSource = () => configSource(buildConfig());

  const updateOutput = () => {
    const out = $("#genOutput");
    if (out) out.value = buildConfigSource();
  };

  const BARE_ARRAY_SECTIONS = new Set(["projects", "experience", "research", "achievements", "certifications"]);
  const URL_FIELD_NAMES = new Set([
    "siteUrl", "liveUrl", "githubUrl", "url", "linkedin", "github", "twitter", "website", "huggingface", "researchgate", "photo", "resume", "ogImage"
  ]);

  const validateConfig = (config) => {
    if (!config || typeof config !== "object" || Array.isArray(config)) {
      throw new Error("Invalid config: expected a JSON object at root.");
    }
    const knownSections = new Set(SCHEMA.map((s) => s.id));
    for (const key of Object.keys(config)) {
      if (!knownSections.has(key)) {
        throw new Error(`Invalid field: unknown section "${key}".`);
      }
    }
    for (const sec of SCHEMA) {
      const val = config[sec.id];
      if (val === undefined || val === null) continue;
      if (BARE_ARRAY_SECTIONS.has(sec.id)) {
        if (!Array.isArray(val)) {
          throw new Error(`Invalid field: "${sec.id}" must be an array.`);
        }
        val.forEach((item, idx) => {
          if (!item || typeof item !== "object" || Array.isArray(item)) {
            throw new Error(`Invalid field: "${sec.id}[${idx}]" must be an object.`);
          }
          for (const k of Object.keys(item)) {
            if (URL_FIELD_NAMES.has(k) && typeof item[k] === "string" && item[k].trim()) {
              if (!sanitizeUrl(item[k], "link")) {
                throw new Error(`Invalid field: "${sec.id}[${idx}].${k}" has an unsafe URL.`);
              }
            }
          }
        });
      } else {
        if (typeof val !== "object" || Array.isArray(val)) {
          throw new Error(`Invalid field: "${sec.id}" must be an object.`);
        }
        if (sec.fields) {
          const knownFields = new Set(sec.fields.map((f) => f.key));
          if (sec.lists) sec.lists.forEach((l) => knownFields.add(l.key));
          if (sec.id === "chatbot") {
            knownFields.add("customResponses");
            knownFields.add("extraRules");
          }
          if (sec.id === "company") {
            knownFields.add("logo");
          }
          for (const fKey of Object.keys(val)) {
            if (!knownFields.has(fKey)) {
              throw new Error(`Invalid field: unknown field "${sec.id}.${fKey}".`);
            }
            if (URL_FIELD_NAMES.has(fKey) && typeof val[fKey] === "string" && val[fKey].trim()) {
              const kind = fKey === "photo" || fKey === "ogImage" ? "image" : "link";
              if (!sanitizeUrl(val[fKey], kind)) {
                throw new Error(`Invalid field: "${sec.id}.${fKey}" has an unsafe URL.`);
              }
            }
          }
        }
      }
    }
    return true;
  };

  const parseConfigSource = (src) => {
    if (typeof src !== "string") {
      throw new Error("Config source must be a string.");
    }
    const trimmed = src.trim();
    const hasComments = /(\/\*|\/\/)/.test(trimmed);
    const hasUnquotedKeys = /([{,]\s*)[a-zA-Z_$][a-zA-Z0-9_$]*(\s*:)/.test(trimmed);

    const prefixMatch = trimmed.match(/^(?:window\.)?PORTFOLIO_CONFIG\s*=\s*([\s\S]*?);?\s*$/);
    if (!prefixMatch) {
      if (hasComments || hasUnquotedKeys || trimmed.includes("PORTFOLIO_CONFIG")) {
        throw new Error("This file uses the old format. Re-export it from the generator.");
      }
      throw new Error("This file does not set window.PORTFOLIO_CONFIG.");
    }

    const rawJson = prefixMatch[1].trim();
    let parsed;
    try {
      parsed = JSON.parse(rawJson);
    } catch (err) {
      if (hasComments || hasUnquotedKeys || /[{,]\s*[a-zA-Z_$]/.test(rawJson)) {
        throw new Error("This file uses the old format. Re-export it from the generator.");
      }
      throw new Error("Invalid JSON: " + err.message);
    }

    validateConfig(parsed);
    return parsed;
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
    // A strict Content-Security-Policy blocks an inline <script>, and the
    // preview runs under the page's policy (an iframe inherits it). A JSON
    // block is not executable, so it is allowed; script.js reads it instead of
    // config.js. "<" is escaped so the JSON cannot close the script tag.
    const configJson = JSON.stringify(previewConfig(), null, 2).replace(/</g, "\\u003c");

    return html
      .replace(/<head>/i, `<head>\n    <base href="${base}">`)
      .replace(
        /<script\s+src=["']config\.js["']\s*><\/script>/i,
        `<script type="application/json" id="pf-inline-config">${configJson}</script>`
      );
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
  let savedNoteTimer = null;

  // A small, honest status line: the draft really is written to this browser
  // and nowhere else. It hides itself again so it never becomes clutter.
  const noteSaved = (message) => {
    const el = $("#genSaved");
    if (!el) return;
    el.textContent = message;
    el.hidden = false;
    clearTimeout(savedNoteTimer);
    savedNoteTimer = setTimeout(() => { el.hidden = true; }, 4000);
  };

  const saveDraft = () => {
    clearTimeout(draftTimer);
    draftTimer = setTimeout(() => {
      try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(buildConfig()));
        noteSaved("Saved on this device");
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

  const setUploadNote = (kind, message) => {
    const el = document.querySelector(`[data-upload-note="${kind}"]`);
    if (!el) return;
    el.textContent = message || "";
    el.hidden = !message;
  };

  const kb = (bytes) => {
    const k = bytes / 1024;
    return k >= 1000 ? `${(k / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(k))} KB`;
  };

  const acceptUpload = (kind, file) => {
    const problem = Pack.checkUpload(kind, file);
    setUploadError(kind, problem);
    if (problem) return;

    const finish = (upload, note) => {
      const field = uploadField(kind);
      uploads[kind] = upload;
      if (field) {
        state[field.section][field.key] = upload.path;
        writeToInput(field.path, upload.path);
      }
      setUploadNote(kind, note);
      showUploadState(kind);
      saveDraft();
      updateCounts();
      refreshPreview();
    };

    const keepRawFile = () => readUpload(kind, file).then((upload) => finish(upload, ""));

    if (kind === "photo") {
      preparePhoto(file)
        .then((made) => {
          if (!made) return keepRawFile();
          const path = Pack.uploadPath("photo", { type: made.type });
          const entry = uploadEntry(file.name, made.type, made.bytes, path);
          return finish(entry, `Saved as ${path} (${kb(made.newSize)}, down from ${kb(made.originalSize)}).`);
        })
        .catch(() => keepRawFile());
      return;
    }

    keepRawFile();
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
    setUploadNote(kind, "");
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

  // Plain deploy steps that travel inside the ZIP, so the folder explains
  // itself once it is unzipped. Named in the brand rules.
  const buildDeployReadme = () => `ABMVSC Portfolio Engine
A product of ABMVSC Technology & Innovation Studio.

Your website is ready

This folder is a finished website. Nothing needs to be built or installed.
Pick one host below and follow the steps. All three are free to start.

What is in this folder
- index.html    your personal portfolio page
- studio.html   your company page
- style.css     the look of the site
- script.js     the script that fills in your details
- config.js     the file that holds every detail you typed
- your photo and resume, if you added them
- .nojekyll     a blank file that tells GitHub Pages to serve every file

Netlify Drop (quickest)
1. Open https://app.netlify.com/drop
2. Drag this whole folder onto the page.
3. After a few seconds Netlify shows your live address.
4. Sign in to keep the site (a free account).

GitHub Pages
1. Create a repository on GitHub.
2. Upload every file in this folder to the repository.
3. Open Settings, then Pages.
4. Under Source, choose the main branch and the root folder, then Save.
5. Your site appears at https://yourname.github.io/repository-name.
   The blank .nojekyll file keeps every file served as it is.

Cloudflare Pages
1. Open https://pages.cloudflare.com and sign in (a free account).
2. Choose Upload assets and upload this folder.
3. Cloudflare shows your live address.

Where this came from
Built with ABMVSC Portfolio Engine. Nothing was uploaded while you made it.
`;

  // The archive is built from the files the pages name, so an unzipped copy
  // opens without a single missing request. The list is worked out to a fixed
  // point: a file the pages name can name more files of its own (the web
  // manifest names its icons), so we load what the manifest asks for until it
  // stops growing. Anything still absent is reported instead of shipped.
  const collectSite = async (config, generated = []) => {
    const files = {
      "index.html": await fetchSiteFile("index.html"),
      "studio.html": await fetchSiteFile("studio.html"),
    };
    const supplied = new Set([
      "config.js",
      ".nojekyll",
      "README-DEPLOY.txt",
      // Files the generator writes itself take the place of the copies on disk.
      ...generated,
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

    // The social card and favicons are drawn here, and robots.txt and
    // sitemap.xml are rewritten with the site's address, so the archive carries
    // the owner's own artwork and address instead of the sample ones.
    const generated = {
      ...(await renderBrandAssets(config)),
      "robots.txt": Pack.staticRobots(config),
      "sitemap.xml": Pack.staticSitemap(config),
    };

    const { files, manifest } = await collectSite(config, Object.keys(generated));

    // A crawler fetches the HTML and stops; it never runs script.js. Bake the
    // title, social tags, structured data and hero text into the two pages so
    // the shared link shows the owner's name instead of a generic placeholder.
    Pack.PAGES.forEach((page) => {
      if (typeof files[page] === "string") {
        files[page] = Pack.prerenderPage(files[page], config, page);
      }
    });

    const wanted = [...new Set([...manifest.include, ...manifest.missing])].sort();

    const entries = [];
    const absent = [];
    for (const path of wanted) {
      if (Object.prototype.hasOwnProperty.call(generated, path)) {
        entries.push({ path, data: generated[path] });
        continue;
      }
      if (Object.prototype.hasOwnProperty.call(files, path)) {
        entries.push({ path, data: files[path] });
        continue;
      }
      if (path === "config.js") {
        entries.push({ path, data: configSource(config) });
        continue;
      }
      if (path === ".nojekyll") {
        entries.push({ path, data: "" });
        continue;
      }
      if (path === "README-DEPLOY.txt") {
        entries.push({ path, data: buildDeployReadme() });
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
    } catch {
      toast(previewFetchable
        ? "Could not build your website file. Refresh the page and try again."
        : "Building your website file needs the page served over http(s). Run <code>npx serve .</code> and open the address it prints.");
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
        } catch {
          toast("That file is not a saved website from this page. Pick the file you downloaded here, or start from scratch.");
        }
      };
      reader.readAsText(file);
      e.target.value = "";
    });

    $("#genLoadCurrent").addEventListener("click", async () => {
      try {
        const src = await fetch("config.js", { cache: "no-store" }).then((r) => r.text());
        applyImported(parseConfigSource(src), "Loaded the project's current config.js.");
      } catch {
        toast("Could not load the template's details. Open this page from a local server (<code>npx serve .</code>) and try again.");
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

    // Recruiter checklist: "Go to this field" opens the chapter and focuses
    // the field the missing item is about.
    const checklist = $("#genChecklist");
    if (checklist) {
      checklist.addEventListener("click", (e) => {
        const btn = e.target.closest("[data-check-go]");
        if (btn) revealCheck(recruiterItems()[Number(btn.dataset.checkGo)]);
      });
    }

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
    if (draft) noteSaved("Loaded the draft saved on this device");

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

  if (typeof window !== "undefined") {
    window.parseConfigSource = parseConfigSource;
    window.validateConfig = validateConfig;
  }
  if (typeof module !== "undefined" && module.exports) {
    module.exports = { parseConfigSource, validateConfig, SCHEMA };
  }

  if (typeof document !== "undefined") {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", boot);
    } else {
      boot();
    }
  }
})();
