/**
 * url-allowlist.js — URL allowlist and sanitization.
 * Single source of truth shared by the generator (setup.js), packer (pack.js), and runtime (script.js).
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.UrlAllowlist = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  /**
   * Sanitizes a URL against a strict allowlist.
   *
   * Rules:
   * - Links allow: http, https, mailto, tel, and relative paths/anchors.
   * - Images allow: http, https, relative paths, and data:image/png|jpeg|webp.
   * - Blocks: javascript:, vbscript:, data:text/html, mixed case, leading spaces,
   *   control characters ("java\tscript:"), protocol-relative URLs (//).
   *
   * @param {string} raw - The input URL
   * @param {string} [kind="link"] - "link" or "image"
   * @returns {string} Safe sanitized URL or "" if blocked
   */
  function sanitizeUrl(raw, kind = "link") {
    if (typeof raw !== "string") return "";
    const str = raw.trim();
    if (!str) return "";

    // Block protocol-relative URLs (//evil.com)
    if (str.startsWith("//")) return "";

    // Strip ASCII control characters (0x00 - 0x1F, 0x7F) including \t, \r, \n
    const stripped = str.replace(/[\u0000-\u001F\u007F]/g, "").trim();
    if (!stripped) return "";

    // A real URL or file path never contains whitespace or the characters that
    // end HTML attributes. Rejecting them here stops a hostile string such as
    // "<img src=x onerror=alert(1)>" from being accepted as a "relative path".
    if (/[\s<>"'`]/.test(stripped)) return "";

    // Longer than any real browser URL; treat it as junk, not a path.
    if (stripped.length > 2048) return "";

    // Decode percent-encoded characters to inspect scheme
    let decoded = stripped;
    try {
      decoded = decodeURIComponent(stripped).replace(/[\u0000-\u001F\u007F]/g, "").trim();
    } catch (e) {
      // malformed URI encoding, keep stripped
    }

    const isImage = kind === "image" || kind === "img";

    for (const candidate of [stripped, decoded]) {
      const colonIdx = candidate.indexOf(":");
      if (colonIdx !== -1) {
        const scheme = candidate.slice(0, colonIdx).toLowerCase().trim();

        // Always block active scripting schemes
        if (scheme === "javascript" || scheme === "vbscript") {
          return "";
        }

        // data: URLs
        if (scheme === "data") {
          if (isImage) {
            const prefix = candidate.slice(0, 30).toLowerCase();
            if (
              prefix.startsWith("data:image/png") ||
              prefix.startsWith("data:image/jpeg") ||
              prefix.startsWith("data:image/webp")
            ) {
              continue;
            }
          }
          // Block all other data: schemes (including data:text/html)
          return "";
        }

        // Validate scheme against allowlist
        if (isImage) {
          if (scheme !== "http" && scheme !== "https") {
            return "";
          }
        } else {
          if (scheme !== "http" && scheme !== "https" && scheme !== "mailto" && scheme !== "tel") {
            return "";
          }
        }
      }
    }

    return stripped;
  }

  return { sanitizeUrl };
});

