import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const Pack = require("../pack.js");

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const decoder = new TextDecoder();

const read = (path) => readFileSync(join(ROOT, path), "utf8");
const readBytes = (path) => new Uint8Array(readFileSync(join(ROOT, path)));

const loadConfig = () => {
  const fn = new Function("window", `${read("config.js")}\n;return window.PORTFOLIO_CONFIG;`);
  return fn({});
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
  const { include } = Pack.buildManifest({ files, config });
  for (const path of ["favicon.ico", "site.webmanifest", "og-image.png", "apple-touch-icon.png"]) {
    assert.ok(include.includes(path), `${path} should be in the manifest`);
  }
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
  const { include, missing } = Pack.buildManifest({ files, config });
  assert.deepEqual(missing, []);

  const back = Pack.readZip(Pack.writeZip(include.map((path) => ({ path, data: files[path] }))));
  assert.deepEqual(back.map((e) => e.path).sort(), [...include].sort());

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
