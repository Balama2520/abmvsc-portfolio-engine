import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { createRequire } from "node:module";
import { gzipSync } from "node:zlib";

const require = createRequire(import.meta.url);
const Pack = require("../pack.js");

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const decoder = new TextDecoder();

const read = (path) => readFileSync(join(ROOT, path), "utf8");
const readBytes = (path) => new Uint8Array(readFileSync(join(ROOT, path)));

const loadConfig = () => {
  const src = read("config.js").trim();
  const json = src.replace(/^(?:window\.)?PORTFOLIO_CONFIG\s*=\s*/, "").replace(/;\s*$/, "");
  return JSON.parse(json);
};

const TEXT = /\.(html|css|js|txt|xml|toml|json|webmanifest)$/;

// Loads the project the way the generator does: the core files, plus whatever
// the pages turn out to reference. References resolve to a fixed point because
// a named file can itself name more files (site.webmanifest names its icons).
const loadSite = () => {
  const config = loadConfig();
  const files = { "index.html": read("index.html"), "studio.html": read("studio.html") };

  for (;;) {
    const { include, missing } = Pack.buildManifest({ files, config });
    const toLoad = [...new Set([...include, ...missing])].filter(
      (path) => !(path in files) && existsSync(join(ROOT, path))
    );
    if (!toLoad.length) break;
    toLoad.forEach((path) => {
      files[path] = TEXT.test(path) ? read(path) : readBytes(path);
    });
  }

  return { config, files };
};

test("pack: every href and src in the pages resolves to a real file", () => {
  const { config, files } = loadSite();
  const { missing } = Pack.buildManifest({ files, config });
  assert.deepEqual(missing, [], `these referenced files do not exist: ${missing.join(", ")}`);
});

test("pack: the manifest picks up the icons, manifest and social image", () => {
  const { config, files } = loadSite();
  const { include, generated } = Pack.buildManifest({ files, config });
  const archiveFiles = new Set([...include, ...generated]);
  for (const path of ["favicon.ico", "site.webmanifest", "og-image.png", "apple-touch-icon.png"]) {
    assert.ok(archiveFiles.has(path), `${path} should be in the archive manifest`);
  }
});

test("pack: the generator page is never part of a generated site", () => {
  const { config, files } = loadSite();
  const { include } = Pack.buildManifest({ files, config });
  assert.ok(
    !include.includes("setup.html"),
    "setup.html is the builder, not part of a visitor's site — it must not be packaged"
  );
});

/* Static render: what a crawler sees without running script.js */

test("prerender: the generated index.html reads correctly with no JavaScript", () => {
  const config = loadConfig();
  const html = Pack.prerenderPage(read("index.html"), config, "index.html");

  const esc = (s) => String(s).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
  assert.ok(html.includes(`<title>${esc(config.seo.title)}</title>`), "title is written into the HTML");
  assert.match(html, /property="og:title"\s+content="[^"]+"/, "og:title is present");
  assert.match(html, /property="og:description"\s+content="[^"]+"/, "og:description is present");
  assert.match(html, /name="twitter:card"\s+content="summary_large_image"/, "twitter:card is present");
  assert.match(html, /<link rel="canonical" href="https:\/\/[^"]+"/, "canonical is present");
  assert.ok(html.includes(config.personal.name), "the person's name appears in the markup");
  assert.ok(html.includes(config.seo.description), "the description appears in the markup");

  // The hero text is filled too, so the first paint is not empty.
  assert.ok(!html.includes('data-bind="hero.titleLine1"></span>'), "the hero headline is pre-filled");
  assert.ok(!html.includes('data-bind="personal.bio"></p>'), "the hero bio is pre-filled");
});

test("prerender: the studio page carries Organization data with the studio name", () => {
  const config = loadConfig();
  const html = Pack.prerenderPage(read("studio.html"), config, "studio.html");

  const ld = JSON.parse(html.match(/<script id="pf-ld-json"[^>]*>([\s\S]*?)<\/script>/)[1]);
  assert.equal(ld["@type"], "Organization");
  assert.equal(ld.name, config.company.name);
  assert.match(html, /property="og:title"\s+content="[^"]+"/, "og:title is present");
});

test("prerender: running twice leaves one copy of everything", () => {
  const config = loadConfig();
  const once = Pack.prerenderPage(read("index.html"), config, "index.html");
  const twice = Pack.prerenderPage(once, config, "index.html");
  assert.equal(twice, once, "prerendering must be idempotent");
  assert.equal((twice.match(/property="og:title"/g) || []).length, 1, "og:title must appear once");
  assert.equal((twice.match(/id="pf-ld-json"/g) || []).length, 1, "structured data must appear once");
});

test("prerender: JSON-LD cannot be closed by user text", () => {
  const config = loadConfig();
  config.personal.name = '</script><img src=x onerror=alert(1)>';
  config.personal.bio = '\u2028 & < >';
  const html = Pack.prerenderPage(read("index.html"), config, "index.html");
  const ld = html.match(/<script id="pf-ld-json"[^>]*>([\s\S]*?)<\/script>/)[1];
  assert.doesNotMatch(html, /<img src=x onerror=/, "user text must not create markup");
  assert.ok(ld.includes("\\u003c/script\\u003e"));
  assert.equal(JSON.parse(ld).name, config.personal.name);
});

test("prerender: the page still names only files that exist", () => {
  const config = loadConfig();
  const source = read("index.html");
  const html = Pack.prerenderPage(source, config, "index.html");
  assert.deepEqual(
    Pack.collectRefs(html).sort(),
    Pack.collectRefs(source).sort(),
    "prerendering must not introduce or drop a file reference"
  );
});

test("prerender: the config script is versioned with a content hash", () => {
  const config = loadConfig();
  const html = Pack.prerenderPage(read("index.html"), config, "index.html");
  const match = html.match(/<script src="config\.js\?v=([0-9a-f]+)"><\/script>/);
  assert.ok(match, "the config script tag carries a version");
  assert.equal(
    match[1],
    Pack.contentHash(JSON.stringify(config)),
    "the version is the config's own content hash"
  );

  // A changed detail must change the version, so a cached copy is never reused.
  const other = { ...config, personal: { ...config.personal, name: "Someone Else" } };
  const changed = Pack.prerenderPage(read("index.html"), other, "index.html");
  assert.notEqual(changed.match(/config\.js\?v=([0-9a-f]+)/)[1], match[1], "a changed config gets a new version");

  // Running it again must not stack a second version onto the tag.
  const twice = Pack.prerenderPage(html, config, "index.html");
  assert.equal((twice.match(/\?v=/g) || []).length, 1, "one version only");
});

test("prerender: the social image is referenced by its full address", () => {
  const config = loadConfig();
  const html = Pack.prerenderPage(read("index.html"), config, "index.html");
  const og = html.match(/property="og:image"\s+content="([^"]+)"/)[1];
  assert.ok(og.startsWith("https://"), "a crawler needs the social image at an absolute address");
  assert.ok(og.endsWith("/og-image.png"), `the social image should be the generated card, got ${og}`);
  assert.ok(html.includes(`name="twitter:image" content="${og}"`), "twitter:image matches og:image");
});

test("pack: robots.txt and sitemap.xml carry the site's own address", () => {
  const config = loadConfig();
  const base = Pack.siteBase(config);
  assert.ok(base.startsWith("https://") && !base.endsWith("/"), "the base is a clean origin");

  const robots = Pack.staticRobots(config);
  assert.ok(robots.includes(`Sitemap: ${base}/sitemap.xml`), "robots names the sitemap absolutely");

  const sitemap = Pack.staticSitemap(config);
  assert.ok(sitemap.includes(`<loc>${base}/</loc>`), "the home page is listed");
  assert.ok(sitemap.includes(`<loc>${base}/studio.html</loc>`), "the studio page is listed");
  assert.ok(!sitemap.includes("your-domain.com"), "the placeholder domain is replaced");
  assert.ok(!sitemap.includes("setup.html"), "the builder is never in the sitemap");

  // With no address set, the placeholder stays rather than a broken domain.
  const blank = { seo: { siteUrl: "" } };
  assert.ok(Pack.staticRobots(blank).includes("Add your website address"));
  assert.ok(Pack.staticSitemap(blank).includes("https://your-domain.com/"));
});

test("pack: pngToIco wraps a PNG in a single-image icon", () => {
  const png = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10, 1, 2, 3]);
  const ico = Pack.pngToIco(png, 32);
  const view = new DataView(ico.buffer, ico.byteOffset, ico.byteLength);

  assert.equal(view.getUint16(0, true), 0, "reserved field is zero");
  assert.equal(view.getUint16(2, true), 1, "the file is an icon");
  assert.equal(view.getUint16(4, true), 1, "it holds one image");
  assert.equal(ico[6], 32, "the width is 32");
  assert.equal(ico[7], 32, "the height is 32");
  assert.equal(view.getUint16(12, true), 32, "32 bits per pixel");
  assert.equal(view.getUint32(14, true), png.length, "the image length is recorded");
  assert.equal(view.getUint32(18, true), 22, "the image starts after the header");
  assert.deepEqual(ico.subarray(22), png, "the PNG bytes follow the header");
});

test("pack: an archive round-trips through the reader", () => {
  const entries = [
    { path: "index.html", data: "<!doctype html><title>One</title>" },
    { path: "assets/photo.png", data: new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]) },
    { path: "config.js", data: "window.PORTFOLIO_CONFIG = {};\n" },
    { path: "empty.txt", data: "" },
  ];
  const back = Pack.readZip(Pack.writeZip(entries));

  assert.deepEqual(back.map((e) => e.path), entries.map((e) => e.path));
  back.forEach((entry, i) => {
    assert.deepEqual(entry.data, new Uint8Array(typeof entries[i].data === "string" ? new TextEncoder().encode(entries[i].data) : entries[i].data));
  });
});

test("pack: a generated archive contains every file its pages ask for", () => {
  const { config, files } = loadSite();
  const { include, missing, generated } = Pack.buildManifest({
    files,
    config,
    extra: Pack.GENERATED_FILES,
  });
  assert.deepEqual(missing, []);

  const entries = [
    ...include.map((path) => ({ path, data: files[path] })),
    ...generated.map((path) => ({ path, data: path === ".nojekyll" ? "" : `generated ${path}` })),
  ];
  const back = Pack.readZip(Pack.writeZip(entries));
  assert.deepEqual(back.map((e) => e.path).sort(), entries.map((e) => e.path).sort());

  const output = new Map(back.map((entry) => [entry.path, entry.data]));
  for (const path of generated) {
    assert.ok(output.has(path), `${path} should be generated in the archive`);
    if (path !== ".nojekyll") {
      assert.ok(output.get(path).byteLength > 0, `${path} should contain generated data`);
    }
  }

  const present = new Set(back.map((e) => e.path));
  back
    .filter((e) => e.path.endsWith(".html"))
    .forEach((entry) => {
      Pack.collectRefs(decoder.decode(entry.data)).forEach((ref) => {
        assert.ok(present.has(ref), `${entry.path} points at ${ref}, which is not in the archive`);
      });
    });

  // The web manifest names its icons as JSON, so the archive has to carry those
  // too — otherwise an unzipped copy 404s on its own home-screen icons.
  const manifest = back.find((e) => e.path === "site.webmanifest");
  assert.ok(manifest, "site.webmanifest should be in the archive");
  Pack.collectIconRefs(decoder.decode(manifest.data)).forEach((ref) => {
    assert.ok(present.has(ref), `site.webmanifest points at ${ref}, which is not in the archive`);
  });
});

/* Performance budget: the code a generated site makes a visitor download. */

test("pack: the generated code stays inside its size budget", () => {
  const { config, files } = loadSite();
  const { include } = Pack.buildManifest({ files, config });

  const bytesOf = (path) => {
    const data = files[path];
    return typeof data === "string" ? Buffer.byteLength(data, "utf8") : data.byteLength;
  };

  // The budget covers the HTML, CSS and JavaScript the pages ship: the part that
  // has to be downloaded and parsed before the site can be read. Photos, icons
  // and fonts are the owner's own content and self-hosted files, so they are
  // counted separately from the code the generator controls.
  const code = include.filter((path) => /\.(html|css|js)$/.test(path));
  const raw = code.reduce((sum, path) => sum + bytesOf(path), 0);
  const gzipped = code.reduce((sum, path) => {
    const data = files[path];
    return sum + gzipSync(Buffer.from(data)).length;
  }, 0);

  // Measured on 5 November 2026: about 128 KB of HTML, CSS and JavaScript, or
  // 35 KB once the server compresses it. The budget leaves room to grow but
  // fails before the site gets heavy for a phone on a slow connection.
  const CODE_BUDGET = 180 * 1024;
  const CODE_BUDGET_GZIP = 60 * 1024;
  assert.ok(
    raw <= CODE_BUDGET,
    `the generated HTML, CSS and JS is ${Math.round(raw / 1024)} KB, over the ${CODE_BUDGET / 1024} KB budget`
  );
  assert.ok(
    gzipped <= CODE_BUDGET_GZIP,
    `the compressed HTML, CSS and JS is ${Math.round(gzipped / 1024)} KB, over the ${CODE_BUDGET_GZIP / 1024} KB budget`
  );
});

test("pack: crc32 matches the reference value for a known string", () => {
  // The CRC-32 of "123456789" is a standard check value.
  assert.equal(Pack.crc32(new TextEncoder().encode("123456789")), 0xcbf43926);
});

test("pack: only stored entries are read back", () => {
  const bytes = Pack.writeZip([{ path: "a.txt", data: "hello" }]);
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const centralAt = view.getUint32(bytes.length - 6, true);
  view.setUint16(centralAt + 10, 8, true); // claim DEFLATE
  assert.throws(() => Pack.readZip(bytes), /only stored/);
});

test("pack: upload validation rejects the wrong type and size", () => {
  assert.equal(Pack.checkUpload("photo", { type: "image/jpeg", size: 1024, name: "me.jpg" }), "");
  assert.match(Pack.checkUpload("photo", { type: "image/gif", size: 1024, name: "me.gif" }), /not a JPG, PNG or WebP/);
  assert.match(Pack.checkUpload("photo", { type: "image/png", size: 3 * 1024 * 1024, name: "me.png" }), /The limit is 2 MB/);

  assert.equal(Pack.checkUpload("resume", { type: "application/pdf", size: 1024, name: "cv.pdf" }), "");
  assert.match(Pack.checkUpload("resume", { type: "application/msword", size: 1024, name: "cv.doc" }), /not a PDF/);
  assert.match(Pack.checkUpload("resume", { type: "application/pdf", size: 6 * 1024 * 1024, name: "cv.pdf" }), /The limit is 5 MB/);

  assert.equal(Pack.checkUpload("photo", null), "");
});

test("pack: uploaded files get predictable paths and the config follows them", () => {
  assert.equal(Pack.uploadPath("photo", { type: "image/webp" }), "photo.webp");
  assert.equal(Pack.uploadPath("resume", { type: "application/pdf" }), "resume.pdf");

  const config = { personal: { photo: "assets/engineer-avatar.svg", resume: "resume.pdf" } };
  const patched = Pack.withUploadPaths(config, {
    photo: { path: "photo.png" },
    resume: { path: "resume.pdf" },
  });

  assert.equal(patched.personal.photo, "photo.png");
  assert.equal(patched.personal.resume, "resume.pdf");
  assert.equal(config.personal.photo, "assets/engineer-avatar.svg", "the caller's config must not be mutated");
});
