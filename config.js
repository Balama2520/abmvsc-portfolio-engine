/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║          ABMVSC PORTFOLIO ENGINE — config.js                     ║
 * ║          Single Source of Truth · Version 3.0                    ║
 * ╠══════════════════════════════════════════════════════════════════╣
 * ║  👋  HEY THERE! This is the ONLY file you need to edit.          ║
 * ║                                                                  ║
 * ║  Fill in your details below and BOTH websites — index.html       ║
 * ║  (your portfolio) and studio.html (your company) — update        ║
 * ║  automatically, including the AI chatbot, SEO tags and social    ║
 * ║  preview cards.                                                  ║
 * ║                                                                  ║
 * ║  DO NOT edit: index.html  studio.html  style.css  script.js      ║
 * ╚══════════════════════════════════════════════════════════════════╝
 *
 *  RULES OF THE ROAD
 *  ─────────────────
 *  • Every section below is OPTIONAL. Delete a section, or leave its
 *    array empty ([]), and that part of the site disappears cleanly.
 *  • Leave any single field as "" and the related element hides itself.
 *  • Add as many entries to any array as you like — copy an existing
 *    block and edit it.
 *
 *  ABMVSC Portfolio Engine · MIT License
 *  Built by ABMVSC Technology & Innovation Studio
 */

window.PORTFOLIO_CONFIG = {

  /* ═══════════════════════════════════════════════════════════════
     SECTION 1 — YOU  (index.html)
     ───────────────────────────────────────────────────────────────
     Drives the navbar, hero, about, contact, footer and the chatbot.
     ═══════════════════════════════════════════════════════════════ */
  personal: {

    // Your full name. Shown in the navbar logo badge, hero and footer.
    name: "Alex Rivera",

    // 1–3 capitals used as the navbar logo badge. Example: "AR".
    initials: "AR",

    // Your professional title. Keep it punchy.
    role: "Full-Stack Developer & AI Engineer",

    // One memorable sentence that captures your professional brand.
    tagline: "Engineering Ideas Into Real-World Impact.",

    // 2–3 sentences about you. Used in the About section and chatbot.
    bio: "Full-Stack Developer and AI Engineer building production-ready web applications with React, Node.js and LangChain. I care about performant systems, clean architecture and shipping things real people actually use.",

    // Profile photo — drop the file in the project root and use its name.
    photo: "assets/engineer-avatar.svg",

    // Your resume PDF. Same rule as the photo above.
    resume: "resume.pdf",

    // City and country, plus remote/relocation notes.
    location: "San Francisco, CA · Open to Remote",

    // One line on your job-search status.
    availability: "Open to full-time roles — immediate start",

    // Contact details. Leave phone/linkedin/github as "" to hide them.
    email: "hello@alexrivera.dev",
    phone: "+1 (555) 019-2834",
    linkedin: "https://linkedin.com",
    github: "https://github.com",

    // Optional extras — leave "" if you don't use them.
    twitter: "",
    website: "",
    huggingface: "",
    researchgate: "",
  },

  /* ═══════════════════════════════════════════════════════════════
     SECTION 2 — SEO & SOCIAL PREVIEW
     ───────────────────────────────────────────────────────────────
     script.js writes these straight into <head> for you: page title,
     meta description, canonical URL, Open Graph, Twitter Card and
     JSON-LD structured data. No HTML editing required.
     ═══════════════════════════════════════════════════════════════ */
  seo: {

    // The public URL where your site will live. No trailing slash.
    // Example: "https://yourname.netlify.app"
    siteUrl: "https://your-site.netlify.app",

    // Browser tab title on index.html. The studio page builds its own
    // title from company.name + company.descriptor.
    title: "Developer Portfolio | Full-Stack & AI Engineer",

    // The description search engines and link previews will show.
    description: "Full-Stack Developer and AI Engineer building production-ready web apps with React, Node.js and cloud architectures.",

    // Social preview image — 1200 × 630 px works best.
    ogImage: "og-image.png",

    // Locale for Open Graph. Examples: "en_US", "en_IN", "fr_FR".
    locale: "en_US",

    // Optional Twitter/X handle for the card (with the @).
    twitterHandle: "",

    // Browser UI colour on mobile. Match your theme.primaryColor.
    themeColor: "#10264b",

    // Optional Google Search Console verification token.
    googleVerification: "",
  },

  /* ═══════════════════════════════════════════════════════════════
     SECTION 3 — HERO  (optional)
     ───────────────────────────────────────────────────────────────
     Leave this whole block out and the hero builds itself from
     personal.* and skills.*. Fill it in when you want exact control.
     ═══════════════════════════════════════════════════════════════ */
  hero: {

    // Small line above your name. Falls back to personal.availability.
    eyebrow: "",

    // A pill badge linking to your studio/company page. Falls back to
    // "Founder @ <company name>" when company.name is set.
    badge: "",

    // The two lines of your big hero heading. Falls back to splitting
    // personal.role on the "&" character.
    titleLine1: "",
    titleLine2: "",

    // The four headline numbers in the hero. Delete the array to hide
    // the whole row.
    stats: [
      { value: "5+",      label: "Production Apps" },
      { value: "99.9%",   label: "Uptime Reliability" },
      { value: "95+",     label: "Lighthouse Score" },
      { value: "<100ms",  label: "API Latency Target" },
    ],

    // The scrolling technology strip. Leave [] to auto-build it from
    // the skills.categories below.
    marquee: [],
  },

  /* ═══════════════════════════════════════════════════════════════
     SECTION 4 — ABOUT  (optional)
     ───────────────────────────────────────────────────────────────
     The "Why work with me" section on index.html.
     ═══════════════════════════════════════════════════════════════ */
  about: {

    // Body paragraphs. Each string becomes its own paragraph.
    paragraphs: [
      "I am a full-stack engineer and AI developer focused on shipping production-quality software, clean architectures and measurable real-world outcomes. Every project featured here includes a live demo and an open-source codebase.",
    ],

    // A short, highlighted call-out. Leave "" to hide it.
    vision: "What I'm looking for: a Full-Stack or AI-integrated engineering role where I can keep shipping real, measurable products on a team that values ownership and fast iteration.",

    // The four reason cards. Delete the array to hide the grid.
    reasons: [
      { title: "Delivery",        text: "Every project ships with a live link and a public repo — verifiable, not just claimed." },
      { title: "Full-stack + AI", text: "Equally comfortable in React/Node.js and PyTorch/LangChain — fewer handoffs, faster iteration." },
      { title: "Performance First", text: "Obsessed with sub-100ms response times, 95+ Lighthouse audits and resilient architectures." },
      { title: "Fast Ramp-up",    text: "A quick, self-directed learner with a track record of shipping complex software into production." },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════
     SECTION 5 — SKILLS
     ───────────────────────────────────────────────────────────────
     Each category becomes a card and feeds the chatbot's skills answer.
     ═══════════════════════════════════════════════════════════════ */
  skills: {

    summary: "Full-stack web engineering, distributed systems, RAG architectures and cloud deployments.",

    categories: [
      { name: "Frontend",       items: ["React.js", "TypeScript", "HTML5", "CSS3", "Tailwind CSS"] },
      { name: "Backend & APIs", items: ["Node.js", "Express.js", "FastAPI", "REST APIs", "Python"] },
      { name: "Databases",      items: ["MongoDB", "PostgreSQL", "Redis", "Vector Databases"] },
      { name: "AI & ML",        items: ["PyTorch", "LangChain", "OpenCV", "RAG Pipelines"] },
      { name: "Cloud & DevOps", items: ["Docker", "AWS EC2", "GitHub Actions", "Netlify"] },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════
     SECTION 6 — PROJECTS
     ───────────────────────────────────────────────────────────────
     Each entry becomes a project card on index.html AND a product
     card on studio.html's ecosystem section. The chatbot can answer
     questions about each one by name.
     ═══════════════════════════════════════════════════════════════ */
  projects: [
    {
      name: "Project One",
      category: "Web Application",
      description: "A production web application with a modern frontend, scalable APIs and robust data persistence. Explain the problem it solves and who it is for.",
      tech: ["React", "Node.js", "PostgreSQL", "Docker"],
      liveUrl: "https://your-project.netlify.app",
      githubUrl: "https://github.com/yourusername/project-one",
      result: "Describe a measurable outcome — a number, a percentage or a milestone.",
      // Optional small status chip shown instead of the Live/GitHub links.
      // Example: "In Development"  |  "Concept"
      status: "",
    },
    {
      name: "Project Two",
      category: "AI Platform",
      description: "A retrieval-augmented AI platform that turns documents into an answerable knowledge base with vector search.",
      tech: ["Python", "FastAPI", "ChromaDB", "LangChain"],
      liveUrl: "",
      githubUrl: "https://github.com/yourusername/project-two",
      result: "",
      status: "",
    },
    // → Copy a block above to add more projects.
  ],

  /* ═══════════════════════════════════════════════════════════════
     SECTION 7 — EXPERIENCE
     ───────────────────────────────────────────────────────────────
     Most recent role first — the page renders them in this order.
     ═══════════════════════════════════════════════════════════════ */
  experience: [
    {
      role: "Full-Stack Developer",
      company: "Company Name",
      type: "Full-Time",              // Full-Time | Internship | Contract | Freelance | Research
      duration: "Jan 2025 – Present",
      location: "Remote",
      description: "One or two sentences on what you built, shipped or achieved in this role.",
      highlights: [
        "Key achievement with a number if you have one",
        "Second key achievement",
      ],
    },
    // → Copy the block above to add more roles.
  ],

  /* ═══════════════════════════════════════════════════════════════
     SECTION 8 — EDUCATION
     ───────────────────────────────────────────────────────────────
     A single object. You can also use an array of objects if you have
     more than one degree — the renderer accepts both.
     ═══════════════════════════════════════════════════════════════ */
  education: {
    degree: "B.S. in Computer Science & Engineering",
    branch: "Computer Science & Engineering",
    university: "University of Technology",
    location: "San Francisco, CA",
    duration: "2020 – 2024",
    gpa: "First Class with Distinction",
    description: "Brief note about your academic focus, thesis or honours.",
  },

  /* ═══════════════════════════════════════════════════════════════
     SECTION 9 — RESEARCH & PUBLICATIONS  (optional)
     ───────────────────────────────────────────────────────────────
     Papers, theses and preprints. Leave [] to hide the section.
     ═══════════════════════════════════════════════════════════════ */
  research: [
    {
      title: "Your Research Paper Title",
      publisher: "IEEE Xplore",       // IEEE Xplore | ACM | Springer | Other
      docId: "",
      url: "",
      year: "2025",
      summary: "One sentence on what the paper proved or contributed.",
      metrics: [
        "Key metric (e.g. 92% accuracy)",
        "Second metric (e.g. 5,000+ images evaluated)",
      ],
    },
    // → Copy the block above to add more papers.
  ],

  /* ═══════════════════════════════════════════════════════════════
     SECTION 10 — ACHIEVEMENTS  (optional)
     ───────────────────────────────────────────────────────────────
     Awards, hackathon results and honours. Leave [] to hide.
     ═══════════════════════════════════════════════════════════════ */
  achievements: [
    {
      title: "Hackathon / Award Name",
      issuer: "Organisation or Platform",
      year: "2024",
      detail: "One line on the result or rank. Example: National Finalist — Top 5% of 10,000+ teams.",
      url: "",                        // Optional link to proof.
    },
    // → Copy the block above to add more awards.
  ],

  /* ═══════════════════════════════════════════════════════════════
     SECTION 11 — CERTIFICATIONS  (optional)
     ───────────────────────────────────────────────────────────────
     Professional certificates and course completions.
     ═══════════════════════════════════════════════════════════════ */
  certifications: [
    { title: "Certification Name", issuer: "Platform / Organisation", year: "2025", url: "" },
    { title: "Second Certification", issuer: "Platform / Organisation", year: "2024", url: "" },
    // → Copy a line above to add more.
  ],

  /* ═══════════════════════════════════════════════════════════════
     SECTION 12 — COMPANY / STUDIO  (studio.html)
     ───────────────────────────────────────────────────────────────
     Powers the entire studio.html page, the studio banner on the
     portfolio page and the chatbot's studio answers.
     Delete this whole block if you don't have a company page.
     ═══════════════════════════════════════════════════════════════ */
  company: {

    name: "ABMVSC Studio",
    descriptor: "Technology & Innovation Studio",
    tagline: "Engineering Ideas. Empowering Tomorrow.",
    philosophy: "Build • Research • Innovate • Scale • Impact",

    // 2–3 sentences describing what the studio does and who it serves.
    description: "An independent, founder-led technology studio building intelligent software, AI-powered products, data-driven systems and research-led solutions.",

    // A longer intro paragraph for the studio hero. Falls back to description.
    heroParagraph: "",

    // Year the studio was founded — shown in the studio hero eyebrow.
    founded: "2025",

    // Your role within the studio.
    founderRole: "Founder & Principal Engineer",

    // Public studio contact details.
    email: "contact@yourstudio.com",
    phone: "",

    // One line shown in the studio contact section.
    contactDescription: "We welcome discussions about software product engineering, AI integrations, research collaborations and technical partnerships.",

    // The headline numbers in the studio hero. Delete to hide the row.
    heroStats: [
      { value: "5",     label: "Core Pillars" },
      { value: "10+",   label: "Production Deployments" },
      { value: "99.9%", label: "Uptime SLA" },
      { value: "100%",  label: "Open Source Engine" },
    ],

    // The studio purpose section — each string is its own paragraph.
    purposeParagraphs: [
      "We are built around a simple belief: technology should solve meaningful problems and create measurable real-world value.",
      "We work at the intersection of production software engineering and applied research — designing systems from first principles rather than separating theory from implementation.",
    ],

    // A highlighted philosophy call-out under the purpose paragraphs.
    purposeVision: "Build tools that work in real human workflows — reliable, fast and genuinely useful.",

    // The four studio value cards.
    values: [
      { title: "Engineering Excellence", text: "Type-safe architectures, modular components and optimal data design — zero fluff." },
      { title: "Research-Driven",        text: "Implementations validated through benchmarked, reproducible methodology." },
      { title: "Human-Centred",          text: "Built for real user needs, with offline capability, accessibility and intuitive design." },
      { title: "Founder Accountable",    text: "Direct architectural oversight and hands-on engineering by the founder." },
    ],

    // The engineering pillars grid. Add or remove freely.
    pillars: [
      { icon: "</>", title: "Software Engineering",  text: "React, TypeScript, Node.js, FastAPI and cloud microservices." },
      { icon: "🥞",  title: "AI & Automation",       text: "LangChain, RAG pipelines, vector indexing and workflow automation." },
      { icon: "📊",  title: "Data & Analytics",      text: "Python, statistical modelling, dashboards and telemetry." },
      { icon: "☁️",  title: "Cloud & Distributed Systems", text: "Containerised microservices, Docker, AWS and automated CI/CD." },
      { icon: "🧪",  title: "Research & Innovation", text: "Benchmarked models, algorithm design and open-source science." },
    ],

    // The studio research cards. Leave [] to reuse top-level `research`.
    research: [],

    // The studio ecosystem grid. Leave [] to reuse the `projects`
    // array above (recommended — one place for all products).
    products: [],

    // Studio logo files. If you only have one logo, point them all at it.
    logo: {
      primary: "assets/logo/abmvsc-logo-primary.svg",
      white:   "assets/logo/abmvsc-logo-white.svg",
      mono:    "assets/logo/abmvsc-logo-mono.svg",
      symbol:  "assets/logo/abmvsc-symbol.svg",
      avatar:  "assets/logo/abmvsc-avatar.svg",
      card:    "assets/abmvsc-logo-card.jpg",
    },
  },

  /* ═══════════════════════════════════════════════════════════════
     SECTION 13 — CONTACT LINKS  (optional)
     ───────────────────────────────────────────────────────────────
     The stack of link cards on the contact section. Leave [] and the
     cards build themselves from your email, LinkedIn and GitHub.
     ═══════════════════════════════════════════════════════════════ */
  contact: {
    links: [],
    // Example — copy and edit to add your own:
    // { label: "Resume", sub: "Download the PDF", url: "resume.pdf", icon: "cv" },
  },

  /* ═══════════════════════════════════════════════════════════════
     SECTION 14 — CHATBOT
     ───────────────────────────────────────────────────────────────
     Tune your AI assistant's name, greetings and custom answers.
     Everything else it knows comes from the sections above.
     Basic markdown is supported: **bold** · *italic* · `code`.
     ═══════════════════════════════════════════════════════════════ */
  chatbot: {

    // Shown in the chatbot window header.
    assistantName: "Alex's AI Assistant",

    // Opening message on index.html.
    greeting: "Hi! I'm Alex's AI assistant. Ask me anything about his projects, skills, experience or how to get in touch.",

    // Opening message on studio.html.
    studioGreeting: "Welcome to ABMVSC Studio! Ask me about our products, capabilities or how we can collaborate.",

    // ── Deep-dive answers (optional) ──────────────────────────────
    // Teach the chatbot to answer specialist questions. Each entry adds
    // a new topic, its trigger keywords and the answer it gives.
    // Delete the array and the chatbot simply won't know these topics.
    deepDives: [
      {
        key: "systemDesign",
        label: "System Design",
        words: ["system design", "architecture", "scalability", "how do you design", "hld", "lld"],
        answer: "I approach **System Design** with a production-first mindset:\n\n• **Layered Architecture:** Decoupled presentation, stateless business logic and clean data access layers.\n• **Right Database for the Job:** Relational storage for transactional data, document storage for flexible schemas, vector storage for embeddings.\n• **Performance Engineering:** Query projection, composite indexes, caching and connection pooling to keep APIs fast.\n• **Cloud & CI/CD:** Containerised services with automated build, test and deploy pipelines.\n• **Resilience:** Graceful degradation, retries and offline-first caching where it matters.",
      },
      {
        key: "devops",
        label: "DevOps & Cloud",
        words: ["devops", "docker", "aws", "ci/cd", "ci cd", "github actions", "deployment", "cloud"],
        answer: "My **Cloud & DevOps** workflow:\n\n• **Docker:** Multi-stage builds for small, reproducible images.\n• **Cloud Hosting:** Managed compute with reverse proxying, TLS and least-privilege access.\n• **CI/CD:** Automated pipelines that lint, test and deploy on every push.\n• **Edge Hosting:** Static and frontend assets served from a global CDN.",
      },
    ],

    // Response overrides. Leave "" to auto-generate from your data.
    customResponses: {
      whyHire: "",                    // Leave "" for an auto-built answer
      pricing: "I take on fixed-scope MVPs and engineering sprints. Reach out for a quote.",
      hobbies: "Outside work I tinker with side projects, read about systems design and go hiking.",
      fallback: "",                   // Leave "" for the default fallback
    },
  },

  /* ═══════════════════════════════════════════════════════════════
     SECTION 15 — THEME  (optional)
     ───────────────────────────────────────────────────────────────
     Colours and fonts, applied at runtime — no CSS editing needed.
     ═══════════════════════════════════════════════════════════════ */
  theme: {
    primaryColor: "#10264B",   // Navbar, headings, dark sections
    accentColor:  "#FF7900",   // Highlights, call-to-action accents
    blueColor:    "#2563EB",   // Links, tags, active states
    fontHeading:  "'Space Grotesk', sans-serif",
    fontBody:     "'Inter', sans-serif",
    fontMono:     "'IBM Plex Mono', monospace",

    // Footer credit: "Built with the ABMVSC Portfolio Engine".
    // Set to false for a completely clean footer with no third-party credit.
    showBuiltBy: true,
  },

};
