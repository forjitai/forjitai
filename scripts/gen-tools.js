#!/usr/bin/env node
/* ─── Forjit AI · Tools Generator ───────────────────────────────────────────
 *
 *  Reads src/data/tools.js and regenerates:
 *    → public/tools/index.html
 *    → public/sitemap.xml  (tools section only — merges with existing)
 *
 *  Usage:
 *    npm run gen-tools
 *
 *  Run this whenever you:
 *    • Add a new tool to src/data/tools.js
 *    • Change a tool's name/description/category
 *    • Update LAST_MOD date
 * ──────────────────────────────────────────────────────────────────────────*/

import { createRequire } from "module";
import { readFileSync, writeFileSync, readdirSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

/* ── Load tools data ────────────────────────────────────────────────────── */
const require = createRequire(import.meta.url);
// Convert path to file:// URL for Windows compatibility
const toolsPath = join(ROOT, "src/data/tools.js");
const toolsURL = new URL("file:///" + toolsPath.replace(/\\/g, "/"));
const { TOOLS, CATEGORIES, BASE_URL, LAST_MOD } = await import(toolsURL);

/* ── Tag colors for categories ──────────────────────────────────────────── */
const TAG_CSS = {
  finance:  "background:rgba(34,197,94,.1);color:#4ade80;border:1px solid rgba(34,197,94,.2)",
  india:    "background:rgba(251,191,36,.1);color:#fbbf24;border:1px solid rgba(251,191,36,.2)",
  health:   "background:rgba(59,130,246,.1);color:#60a5fa;border:1px solid rgba(59,130,246,.2)",
  utility:  "background:rgba(20,184,166,.1);color:#2dd4bf;border:1px solid rgba(20,184,166,.2)",
  text:     "background:rgba(168,85,247,.1);color:#c084fc;border:1px solid rgba(168,85,247,.2)",
  dev:      "background:rgba(168,85,247,.1);color:#c084fc;border:1px solid rgba(168,85,247,.2)",
  civil:    "background:rgba(251,191,36,.1);color:#fbbf24;border:1px solid rgba(251,191,36,.2)",
  teacher:  "background:rgba(251,191,36,.1);color:#fbbf24;border:1px solid rgba(251,191,36,.2)",
  priest:   "background:rgba(251,146,60,.1);color:#fb923c;border:1px solid rgba(251,146,60,.2)",
};

/* ── Group tools by category ────────────────────────────────────────────── */
function groupByCategory(tools) {
  const groups = {};
  for (const tool of tools) {
    if (!groups[tool.cat]) groups[tool.cat] = [];
    groups[tool.cat].push(tool);
  }
  return groups;
}

/* ── Generate a tool card ───────────────────────────────────────────────── */
function toolCard(tool) {
  const tagStyle = TAG_CSS[tool.cat] || TAG_CSS.utility;
  const catLabel = CATEGORIES[tool.cat]?.label || tool.cat;
  const newBadge = tool.new
    ? `<span style="position:absolute;top:10px;right:10px;background:#fbbf24;color:#0c0a09;font-size:9px;font-weight:700;padding:2px 6px;border-radius:999px;text-transform:uppercase;letter-spacing:.05em">New</span>`
    : "";
  return `    <a class="tool-card" href="${tool.slug}.html" data-cat="${tool.cat}" data-tags="${tool.tags}" style="position:relative">
      ${newBadge}
      <div class="tool-icon">${tool.icon}</div>
      <div class="tool-name">${tool.name}</div>
      <div class="tool-desc">${tool.desc}</div>
      <span class="tool-tag" style="${tagStyle}">${catLabel}</span>
    </a>`;
}

/* ── Generate full index.html ───────────────────────────────────────────── */
function generateIndex() {
  const groups = groupByCategory(TOOLS);
  const totalTools = TOOLS.length;

  const sections = Object.entries(CATEGORIES).map(([catKey, cat]) => {
    const tools = groups[catKey] || [];
    if (!tools.length) return "";
    return `
  <!-- ${cat.label} -->
  <div class="section-label" data-cat="${catKey}">
    <span>${cat.emoji} ${cat.label}</span>
    <span class="section-count">${tools.length} tools</span>
  </div>
  <div class="grid" data-cat="${catKey}">
${tools.map(toolCard).join("\n")}
  </div>`;
  }).join("\n");

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>Free Online Tools — Forjit AI | ${totalTools}+ Calculators, Converters & Generators</title>
<meta name="description" content="${totalTools}+ free online tools — EMI, GST, SIP, income tax, BMI, word counter, QR code, password generator, unit converter and more. No signup needed."/>
<meta name="keywords" content="free online tools, free calculator India, EMI calculator, GST calculator, SIP calculator, BMI calculator, word counter, QR code generator"/>
<link rel="canonical" href="${BASE_URL}/tools/"/>
<meta property="og:title" content="${totalTools}+ Free Online Tools — Forjit AI"/>
<meta property="og:description" content="Calculators, converters, and generators — all free, no signup required."/>
<meta property="og:url" content="${BASE_URL}/tools/"/>
<meta property="og:image" content="${BASE_URL}/og-image.png"/>
<meta property="og:image:width" content="1200"/>
<meta property="og:image:height" content="630"/>
<meta property="og:type" content="website"/>
<meta property="og:site_name" content="Forjit AI"/>
<meta property="og:locale" content="en_IN"/>
<meta name="twitter:card" content="summary_large_image"/>
<meta name="twitter:site" content="@forjitai"/>
<meta name="twitter:title" content="${totalTools}+ Free Online Tools — Forjit AI"/>
<meta name="twitter:description" content="Calculators, converters, and generators — all free, no signup required."/>
<meta name="twitter:image" content="${BASE_URL}/og-image.png"/>
<meta name="robots" content="index,follow,max-snippet:-1,max-image-preview:large"/>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": "Free Online Tools — Forjit AI",
  "description": "${totalTools}+ free online calculators, converters and generators for Indian users.",
  "url": "${BASE_URL}/tools/",
  "publisher": {
    "@type": "Organization",
    "name": "Forjit AI",
    "url": "${BASE_URL}",
    "logo": { "@type": "ImageObject", "url": "${BASE_URL}/icons/icon-192.png" }
  },
  "breadcrumb": {
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Forjit AI", "item": "${BASE_URL}/" },
      { "@type": "ListItem", "position": 2, "name": "Free Tools", "item": "${BASE_URL}/tools/" }
    ]
  }
}
</script>
<script async src="https://www.googletagmanager.com/gtag/js?id=G-DYR402JFVG"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-DYR402JFVG');</script>
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5102938260449475" crossorigin="anonymous"></script>
<!-- Last generated: ${LAST_MOD} from src/data/tools.js — run: npm run gen-tools -->
<!-- NOTE: When creating a new tool HTML file, add before </body>:  <script src="tool-common.js"></script> -->
<style>
*{box-sizing:border-box;margin:0;padding:0}
:root{--bg:#0c0a09;--surface:#1c1917;--border:#292524;--fg:#e7e5e4;--muted:#a8a29e;--subtle:#78716c;--accent:#fbbf24}
body{font-family:'Segoe UI',system-ui,sans-serif;background:var(--bg);color:var(--fg);min-height:100vh}
header{background:var(--surface);border-bottom:1px solid var(--border);padding:12px 20px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:10}
.logo{display:flex;align-items:center;gap:10px;text-decoration:none;color:var(--fg)}
.logo-mark{width:32px;height:32px;background:var(--accent);border-radius:6px;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:16px;color:var(--bg)}
.logo-name{font-size:15px;font-weight:600}
.back{color:var(--muted);text-decoration:none;font-size:13px}
.back:hover{color:var(--accent)}
.container{max-width:1100px;margin:0 auto;padding:28px 16px}
h1{font-size:28px;font-weight:700;margin-bottom:6px}
.subtitle{color:var(--muted);font-size:15px;margin-bottom:8px}
.badge{display:inline-block;background:rgba(251,191,36,.15);border:1px solid rgba(251,191,36,.3);color:var(--accent);padding:4px 12px;border-radius:999px;font-size:13px;font-weight:600;margin-bottom:20px}
.search-wrap{margin-bottom:20px;position:relative}
.search-wrap input{width:100%;background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:13px 16px 13px 44px;color:var(--fg);font-size:15px;outline:none;transition:border-color .15s;font-family:inherit}
.search-wrap input:focus{border-color:var(--accent)}
.search-wrap::before{content:'🔍';position:absolute;left:14px;top:50%;transform:translateY(-50%);font-size:17px;pointer-events:none}
.cat-tabs{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:20px}
.cat-tab{padding:7px 14px;background:var(--surface);border:1px solid var(--border);border-radius:999px;cursor:pointer;font-size:13px;color:var(--muted);transition:all .15s;font-family:inherit}
.cat-tab:hover,.cat-tab.on{background:var(--accent);color:var(--bg);border-color:var(--accent);font-weight:700}
.section-label{font-size:11px;font-weight:700;color:var(--subtle);text-transform:uppercase;letter-spacing:.1em;margin-bottom:12px;padding-bottom:8px;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center}
.section-count{color:var(--accent);font-size:11px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:12px;margin-bottom:24px}
.tool-card{background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:18px;text-decoration:none;color:var(--fg);transition:all .15s;display:flex;flex-direction:column;gap:8px}
.tool-card:hover{border-color:var(--accent);transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,.3)}
.tool-card.hidden{display:none}
.tool-icon{font-size:26px;line-height:1}
.tool-name{font-size:14px;font-weight:600}
.tool-desc{font-size:12px;color:var(--muted);line-height:1.5;flex:1}
.tool-tag{align-self:flex-start;font-size:10px;font-weight:600;padding:3px 8px;border-radius:999px;text-transform:uppercase;letter-spacing:.04em}
.ad-slot{background:var(--surface);border:1px dashed var(--border);border-radius:8px;padding:14px;text-align:center;color:var(--subtle);font-size:11px;margin:14px 0}
.ad-slot a{color:var(--accent);text-decoration:none}
.ai-banner{background:linear-gradient(135deg,rgba(251,191,36,.1),rgba(251,191,36,.04));border:1px solid rgba(251,191,36,.3);border-radius:12px;padding:20px;margin-bottom:20px;display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap}
.ai-banner h2{font-size:16px;font-weight:700;margin-bottom:4px}
.ai-banner p{color:var(--muted);font-size:13px}
.ai-btn{padding:10px 20px;background:var(--accent);color:var(--bg);border:none;border-radius:8px;font-weight:700;text-decoration:none;font-size:14px}
.no-results{text-align:center;padding:40px;color:var(--muted);font-size:15px;display:none}
footer{text-align:center;padding:20px;font-size:12px;color:var(--subtle)}
footer a{color:var(--muted);text-decoration:none}
@media(max-width:600px){h1{font-size:22px}.grid{grid-template-columns:1fr 1fr}}
@media(max-width:380px){.grid{grid-template-columns:1fr}}
</style>
</head>
<body>
<header>
  <a class="logo" href="/"><div class="logo-mark">F</div><div class="logo-name">Forjit AI</div></a>
  <a class="back" href="/">← Home</a>
</header>
<div class="container">
  <h1>Free Online Tools</h1>
  <p class="subtitle">Calculators, converters, generators — all free, no signup required.</p>
  <div class="badge">✨ ${totalTools} tools available</div>

  <div class="search-wrap">
    <input type="text" id="searchInput" placeholder="Search tools… (e.g. EMI, BMI, GST, QR code)"
      oninput="filterTools()" autocomplete="off"/>
  </div>

  <div class="cat-tabs">
    <button class="cat-tab on" data-catkey="all" onclick="filterCat('all',this)">All (${totalTools})</button>
    ${Object.entries(CATEGORIES).map(([key, cat]) => {
      const count = (groups[key] || []).length;
      return count ? `<button class="cat-tab" data-catkey="${key}" onclick="filterCat('${key}',this)">${cat.emoji} ${cat.label} (${count})</button>` : "";
    }).join("\n    ")}
  </div>

  <div class="ad-slot">Advertisement · <a href="https://adsense.google.com" target="_blank">Connect AdSense</a></div>

  <!-- Civil Engineering Hub Banner -->
  <a href="/tools/civil/" style="display:flex;align-items:center;gap:16px;background:linear-gradient(135deg,rgba(251,191,36,.1),rgba(245,158,11,.04));border:1px solid rgba(251,191,36,.28);border-radius:14px;padding:18px 22px;margin-bottom:22px;text-decoration:none;color:var(--fg);transition:all .2s;flex-wrap:wrap" onmouseover="this.style.borderColor='var(--accent)';this.style.boxShadow='0 8px 28px rgba(251,191,36,.12)'" onmouseout="this.style.borderColor='rgba(251,191,36,.28)';this.style.boxShadow=''">
    <div style="font-size:44px;flex-shrink:0">🏗️</div>
    <div style="flex:1;min-width:200px">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:5px">
        <span style="font-size:15px;font-weight:800">Civil Engineering Tools Hub</span>
        <span style="background:#fbbf24;color:#0c0a09;font-size:9px;font-weight:800;padding:2px 7px;border-radius:999px;text-transform:uppercase;letter-spacing:.05em">New</span>
      </div>
      <div style="font-size:12px;color:var(--muted);line-height:1.6">IS code compliant calculators for Indian civil engineers. Steel bar weight (d²/162), concrete mix design, BBS &amp; more.</div>
      <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:8px">
        <span style="font-size:11px;color:var(--muted)">⚖️ Steel Bar Weight</span>
        <span style="font-size:11px;color:var(--muted)">🏗️ Concrete Mix</span>
        <span style="font-size:11px;color:var(--muted)">📋 Bar Schedule (BBS)</span>
        <span style="font-size:11px;color:var(--muted)">8+ Tools Coming</span>
      </div>
    </div>
    <div style="font-size:22px;color:var(--accent);flex-shrink:0">→</div>
  </a>

${sections}

  <div class="no-results" id="noResults">No tools found. Try a different search.</div>

  <div class="ad-slot">Advertisement</div>

  <div class="ai-banner">
    <div>
      <h2>🤖 Need a custom tool?</h2>
      <p>Use Forjit AI to generate calculators, trackers, and apps from a single prompt.</p>
    </div>
    <a class="ai-btn" href="/">Try Forjit AI →</a>
  </div>
</div>

<footer>
  <a href="/">Forjit AI</a> · <a href="/sitemap.xml">Sitemap</a> ·
  All tools run 100% in your browser · No data sent to server
</footer>

<script>
let activeCat = 'all';
function filterCat(cat, btn) {
  activeCat = cat;
  document.querySelectorAll('.cat-tab').forEach(b => b.classList.remove('on'));
  btn.classList.add('on');
  // Update URL without reload for shareable links
  const url = new URL(location.href);
  if (cat === 'all') url.searchParams.delete('cat');
  else url.searchParams.set('cat', cat);
  history.replaceState(null, '', url.toString());
  filterTools();
}
function filterTools() {
  const q = document.getElementById('searchInput').value.toLowerCase().trim();
  let visible = 0;
  document.querySelectorAll('.tool-card').forEach(card => {
    const tags = (card.dataset.tags || '') + ' ' + card.querySelector('.tool-name').textContent.toLowerCase();
    const catMatch = activeCat === 'all' || card.dataset.cat === activeCat;
    const tagMatch = !q || tags.includes(q);
    const show = catMatch && tagMatch;
    card.classList.toggle('hidden', !show);
    if (show) visible++;
  });
  document.querySelectorAll('.section-label, .grid').forEach(el => {
    const cat = el.dataset.cat;
    if (!cat) return;
    const hasVisible = [...el.closest ? [el] : [], ...document.querySelectorAll(\`.grid[data-cat="\${cat}"] .tool-card:not(.hidden)\`)].length > 0;
    // hide section label if no visible cards
    const grid = document.querySelector(\`.grid[data-cat="\${cat}"]\`);
    const label = document.querySelector(\`.section-label[data-cat="\${cat}"]\`);
    const anyVisible = grid && [...grid.querySelectorAll('.tool-card')].some(c => !c.classList.contains('hidden'));
    if (grid) grid.style.display = anyVisible ? '' : 'none';
    if (label) label.style.display = anyVisible ? '' : 'none';
  });
  document.getElementById('noResults').style.display = visible === 0 ? 'block' : 'none';
}
// Init from URL ?cat= param on page load
(function() {
  const params = new URLSearchParams(location.search);
  const cat = params.get('cat');
  if (cat && cat !== 'all') {
    const btn = document.querySelector('.cat-tab[data-catkey="' + cat + '"]');
    if (btn) { activeCat = cat; document.querySelectorAll('.cat-tab').forEach(b=>b.classList.remove('on')); btn.classList.add('on'); filterTools(); }
  }
})();
</script>
</body>
</html>`;
}

/* ── Generate sitemap.xml ───────────────────────────────────────────────── */
function generateSitemap() {
  const toolUrls = TOOLS.map(t => `
  <url>
    <loc>${BASE_URL}/tools/${t.slug}.html</loc>
    <lastmod>${LAST_MOD}</lastmod>
    <changefreq>${t.changefreq}</changefreq>
    <priority>${t.priority}</priority>
  </url>`).join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml">

  <url>
    <loc>${BASE_URL}/</loc>
    <lastmod>${LAST_MOD}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>

  <url>
    <loc>${BASE_URL}/tools/</loc>
    <lastmod>${LAST_MOD}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>

  <url>
    <loc>${BASE_URL}/about</loc>
    <lastmod>${LAST_MOD}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>

  <url>
    <loc>${BASE_URL}/community</loc>
    <lastmod>${LAST_MOD}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>

  <url>
    <loc>${BASE_URL}/forjit-ai</loc>
    <lastmod>${LAST_MOD}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>

  <url>
    <loc>${BASE_URL}/blog</loc>
    <lastmod>${LAST_MOD}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>

  <url>
    <loc>${BASE_URL}/blog/what-is-forjit-ai</loc>
    <lastmod>${LAST_MOD}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>

  <url>
    <loc>${BASE_URL}/privacy</loc>
    <lastmod>${LAST_MOD}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>

  <url>
    <loc>${BASE_URL}/terms</loc>
    <lastmod>${LAST_MOD}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>

  <url>
    <loc>${BASE_URL}/disclaimer</loc>
    <lastmod>${LAST_MOD}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>

  <url>
    <loc>${BASE_URL}/contact</loc>
    <lastmod>${LAST_MOD}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>

  <url>
    <loc>${BASE_URL}/tools/civil/</loc>
    <lastmod>${LAST_MOD}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.90</priority>
  </url>
${toolUrls}

  <url>
    <loc>${BASE_URL}/sitemap</loc>
    <lastmod>${LAST_MOD}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.4</priority>
  </url>

  <!-- Copyright: All content copyright (c) 2025 Forjit AI. Unauthorized reproduction prohibited. -->
  <!-- Grievance Officer: forjitai@gmail.com | Response within 30 days -->

</urlset>`;
}

/* ── Write files ────────────────────────────────────────────────────────── */
const indexPath   = join(ROOT, "public/tools/index.html");
const sitemapPath = join(ROOT, "public/sitemap.xml");

writeFileSync(indexPath,   generateIndex(),   "utf8");
writeFileSync(sitemapPath, generateSitemap(), "utf8");

console.log(`✅ Generated index.html  — ${TOOLS.length} tools`);
console.log(`✅ Generated sitemap.xml — ${TOOLS.length + 2} URLs`);
console.log(`\nTo add a new tool:`);
console.log(`  1. Create public/tools/your-tool.html`);
console.log(`  2. Add entry to src/data/tools.js`);
console.log(`  3. Run: npm run gen-tools`);

/* ── Update blog manifest in blog/index.html ─────────────────────────────── */
try {
  const postsDir = join(ROOT, 'public/blog/posts');
  const postFiles = readdirSync(postsDir)
    .filter(f => f.endsWith('.json'))
    .map(f => f.replace('.json', ''))
    .sort()
    .reverse()
    .slice(0, 50);

  const blogIndexPath = join(ROOT, 'public/blog/index.html');
  let blogIndex = readFileSync(blogIndexPath, 'utf8');

  const newManifest = `/* POSTS_MANIFEST_START */\nconst KNOWN_DATES = [\n${postFiles.map(d => `  '${d}',`).join('\n')}\n];\n/* POSTS_MANIFEST_END */`;

  blogIndex = blogIndex.replace(
    /\/\* POSTS_MANIFEST_START \*\/[\s\S]*?\/\* POSTS_MANIFEST_END \*\//,
    newManifest
  );

  writeFileSync(blogIndexPath, blogIndex, 'utf8');
  console.log(`✅ Blog manifest updated — ${postFiles.length} posts`);
} catch(e) {
  console.log(`  Blog manifest: ${e.message}`);
}
