/* ─── Forjit AI · Utilities ─────────────────────────────────────────────────
 *  Pure helper functions — no React, no state, no side effects.
 *  Import only what you need.
 * ──────────────────────────────────────────────────────────────────────────*/

/* ── Text processing ────────────────────────────────────────────────────── */

/** Strip markdown code fences and extract clean HTML */
export function stripCodeFences(text) {
  let t = (text || "").trim();
  t = t.replace(/^```(?:html|HTML)?\s*\n?/, "");
  t = t.replace(/\n?```\s*$/, "");
  const idx = t.indexOf("<!DOCTYPE");
  if (idx > 0) t = t.slice(idx);
  const lower = t.toLowerCase();
  const end = lower.lastIndexOf("</html>");
  if (end !== -1) t = t.slice(0, end + "</html>".length);
  return t.trim();
}

/** Strip markdown code fences from markdown content */
export function stripMarkdownFences(text) {
  let t = (text || "").trim();
  t = t.replace(/^```(?:markdown|md|text)?\s*\n?/, "");
  t = t.replace(/\n?```\s*$/, "");
  return t.trim();
}

/** Encode string to base64 safely (handles unicode) */
export function toBase64(str) {
  try { return btoa(unescape(encodeURIComponent(str))); } catch { return btoa(str); }
}

/** Convert a string to a URL-safe slug */
export function slugify(s) {
  return (s || "").trim().toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40) || "content";
}

/** Rough token estimate (4 chars ≈ 1 token) */
export function estimateTokens(text) {
  return Math.ceil((text || "").length / 4);
}

/** Remove HTML comments and excess blank lines */
export function minifyHtml(code) {
  return (code || "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/\n\s*\n/g, "\n")
    .trim();
}

/* ── Markdown renderer (lightweight, no dependencies) ───────────────────── */
export function renderMarkdown(md) {
  if (!md) return "";
  let html = md;
  html = html.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  html = html.replace(/```([\s\S]*?)```/g, (_, code) => `<pre><code>${code.trim()}</code></pre>`);
  html = html.replace(/^\|(.+)\|\s*\n\|[-:| ]+\|\s*\n((?:\|.+\|\s*\n?)+)/gm, (_, header, rows) => {
    const headers = header.split("|").map(h => h.trim()).filter(Boolean);
    const rowLines = rows.trim().split("\n");
    const thead = `<tr>${headers.map(h => `<th>${h}</th>`).join("")}</tr>`;
    const tbody = rowLines.map(line => {
      const cells = line.split("|").slice(1, -1).map(c => c.trim());
      return `<tr>${cells.map(c => `<td>${c}</td>`).join("")}</tr>`;
    }).join("");
    return `<table>${thead}${tbody}</table>`;
  });
  html = html.replace(/^###### (.+)$/gm, "<h6>$1</h6>");
  html = html.replace(/^##### (.+)$/gm, "<h5>$1</h5>");
  html = html.replace(/^#### (.+)$/gm, "<h4>$1</h4>");
  html = html.replace(/^### (.+)$/gm, "<h3>$1</h3>");
  html = html.replace(/^## (.+)$/gm, "<h2>$1</h2>");
  html = html.replace(/^# (.+)$/gm, "<h1>$1</h1>");
  html = html.replace(/^&gt; (.+)$/gm, "<blockquote>$1</blockquote>");
  html = html.replace(/^---+$/gm, "<hr>");
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>');
  html = html.replace(/^(\s*)[*+-] (.+)$/gm, "$1<li>$2</li>");
  html = html.replace(/^(\s*)(\d+)\. (.+)$/gm, "$1<li>$3</li>");
  html = html.replace(/(<li>.*<\/li>\n?)+/g, (m) => `<ul>${m}</ul>`);
  html = html.split(/\n\n+/).map(block => {
    block = block.trim();
    if (!block) return "";
    if (/^<(h[1-6]|ul|ol|li|pre|table|blockquote|hr|p)/i.test(block)) return block;
    return `<p>${block.replace(/\n/g, "<br>")}</p>`;
  }).join("\n");
  return html;
}

/* ── CDN script loaders ─────────────────────────────────────────────────── */

/** Dynamically load a script tag (cached — won't double-load) */
export function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve();
    const s = document.createElement("script");
    s.src = src;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(s);
  });
}

export async function loadJSZip() {
  if (window.JSZip) return window.JSZip;
  await loadScript("https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js");
  return window.JSZip;
}

export async function loadJsPDF() {
  if (window.jspdf) return window.jspdf;
  await loadScript("https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js");
  return window.jspdf;
}

export async function loadDocx() {
  if (window.docx) return window.docx;
  await loadScript("https://cdn.jsdelivr.net/npm/docx@8.5.0/build/index.umd.js");
  return window.docx;
}

export async function loadPptxGenJS() {
  if (window.PptxGenJS) return window.PptxGenJS;
  await loadScript("https://cdn.jsdelivr.net/gh/gitbrent/pptxgenjs@3.12.0/dist/pptxgen.bundle.js");
  return window.PptxGenJS;
}
