#!/usr/bin/env node
/* ─── Forjit AI · Teacher Tools Generator ────────────────────────────────────
 *
 *  Reads src/data/teacher-tools.js → auto-generates:
 *    1. public/tools/teacher/{id}.html  — Full SEO tool page per tool
 *    2. public/tools/teacher/index.html — Teacher tools hub page
 *    3. Updates src/data/tools.js with teacher tool entries (appended)
 *    4. Prints sitemap entries to add
 *
 *  Run: node scripts/gen-teacher-tools.js
 *  Or:  npm run gen-teacher-tools
 *
 * ──────────────────────────────────────────────────────────────────────────*/

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT      = join(__dirname, "..");

/* ── Load teacher tools config ─────────────────────────────────────────── */
// We read the file as text and eval the exports (avoids full ESM complexity)
const configText = readFileSync(join(ROOT, "src/data/teacher-tools.js"), "utf8");

// Extract TEACHER_TOOLS array using simple eval approach
const configModule = {};
const moduleCode = configText
  .replace(/^export const /gm, "const ")
  .replace(/^export default /gm, "module.exports = ");
eval(moduleCode + "\n configModule.tools = TEACHER_TOOLS; configModule.cats = TEACHER_CATEGORIES;");

const TOOLS = configModule.tools;
const CATS  = configModule.cats;

/* ── Ensure output directory ───────────────────────────────────────────── */
const OUT_DIR = join(ROOT, "public/tools/teacher");
if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

/* ── HTML template for each tool page ─────────────────────────────────── */
function toolPageHTML(tool) {
  const faqSchema = tool.faqs?.map(f => ({
    "@type": "Question",
    "name": f.q,
    "acceptedAnswer": { "@type": "Answer", "text": f.a }
  })) || [];

  const faqHTML = (tool.faqs || []).map(f => `
    <div style="border-bottom:1px solid var(--bor);padding:16px 0">
      <div style="font-weight:600;margin-bottom:6px;color:var(--fg)">${f.q}</div>
      <div style="color:var(--mu);font-size:14px;line-height:1.6">${f.a}</div>
    </div>`).join("");

  const toolConfigJSON = JSON.stringify({
    id:             tool.id,
    name:           tool.name,
    model:          tool.model || "fast",
    maxTokens:      tool.maxTokens || 500,
    inputs:         tool.inputs,
    promptTemplate: tool.promptTemplate,
  });

  const breadcrumb = [
    { name: "Home",          url: "https://www.forjitai.in/" },
    { name: "Teacher Tools", url: "https://www.forjitai.in/tools/teacher/" },
    { name: tool.name,       url: `https://www.forjitai.in/tools/teacher/${tool.id}.html` },
  ];

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>${tool.seoTitle}</title>
<meta name="description" content="${tool.seoDesc}"/>
<meta name="keywords" content="${(tool.seoKeywords || []).join(", ")}"/>
<link rel="canonical" href="https://www.forjitai.in/tools/teacher/${tool.id}.html"/>
<meta property="og:title" content="${tool.seoTitle}"/>
<meta property="og:description" content="${tool.seoDesc}"/>
<meta property="og:url" content="https://www.forjitai.in/tools/teacher/${tool.id}.html"/>
<meta property="og:type" content="website"/>
<meta property="og:image" content="https://www.forjitai.in/og-image.png"/>
<meta name="twitter:card" content="summary_large_image"/>
<meta name="twitter:title" content="${tool.seoTitle}"/>
<meta name="twitter:description" content="${tool.seoDesc}"/>
<script async src="https://www.googletagmanager.com/gtag/js?id=G-DYR402JFVG"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-DYR402JFVG');</script>
<!-- Structured Data -->
<script type="application/ld+json">
{
  "@context":"https://schema.org",
  "@graph":[
    {
      "@type":"WebApplication",
      "name":"${tool.name}",
      "description":"${tool.seoDesc}",
      "url":"https://www.forjitai.in/tools/teacher/${tool.id}.html",
      "applicationCategory":"EducationApplication",
      "operatingSystem":"Web",
      "offers":{"@type":"Offer","price":"0","priceCurrency":"INR"},
      "provider":{"@type":"Organization","name":"Forjit AI","url":"https://www.forjitai.in"}
    },
    {
      "@type":"FAQPage",
      "mainEntity":${JSON.stringify(faqSchema)}
    },
    {
      "@type":"BreadcrumbList",
      "itemListElement":${JSON.stringify(breadcrumb.map((b,i)=>({
        "@type":"ListItem","position":i+1,"name":b.name,"item":b.url
      })))}
    }
  ]
}
</script>
<style>
*{box-sizing:border-box;margin:0;padding:0}
:root{--bg:#0c0a09;--sur:#1c1917;--bor:#292524;--fg:#e7e5e4;--mu:#a8a29e;--su:#78716c;--ac:#fbbf24;--gr:#22c55e}
body{font-family:'Segoe UI',system-ui,sans-serif;background:var(--bg);color:var(--fg);min-height:100vh}
header{background:var(--sur);border-bottom:1px solid var(--bor);padding:12px 20px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:10}
.logo{display:flex;align-items:center;gap:10px;text-decoration:none;color:var(--fg)}
.lm{width:32px;height:32px;background:var(--ac);border-radius:6px;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:16px;color:var(--bg)}
.back{color:var(--mu);text-decoration:none;font-size:13px}.back:hover{color:var(--ac)}
.wrap{max-width:720px;margin:0 auto;padding:22px 16px}
h1{font-size:26px;font-weight:700;margin-bottom:4px}
.sub{color:var(--mu);font-size:14px;margin-bottom:24px}
.badge{display:inline-flex;align-items:center;gap:5px;padding:3px 10px;border-radius:999px;font-size:11px;font-weight:700;background:rgba(251,191,36,.15);color:var(--ac);border:1px solid rgba(251,191,36,.25);margin-bottom:12px}
.sec-title{font-size:11px;font-weight:700;color:var(--mu);text-transform:uppercase;letter-spacing:.08em;margin:28px 0 12px}
.related-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:10px;margin-bottom:20px}
.related-card{background:var(--sur);border:1px solid var(--bor);border-radius:10px;padding:14px;text-decoration:none;color:var(--fg);transition:border-color .15s;display:flex;align-items:center;gap:10px}
.related-card:hover{border-color:var(--ac)}
footer{text-align:center;padding:32px 16px;color:var(--su);font-size:12px;border-top:1px solid var(--bor);margin-top:40px}
footer a{color:var(--mu);text-decoration:none}.footer a:hover{color:var(--ac)}
</style>
</head>
<body>

<header>
  <a href="/" class="logo">
    <div class="lm">F</div>
    <span style="font-weight:700;font-size:15px">Forjit AI</span>
  </a>
  <a href="/tools/teacher/" class="back">← Teacher Tools</a>
</header>

<main class="wrap">
  <!-- Breadcrumb -->
  <nav style="font-size:12px;color:var(--su);margin-bottom:16px">
    <a href="/" style="color:var(--su);text-decoration:none">Home</a> &rsaquo;
    <a href="/tools/teacher/" style="color:var(--su);text-decoration:none">Teacher Tools</a> &rsaquo;
    <span style="color:var(--mu)">${tool.name}</span>
  </nav>

  <!-- Header -->
  <div class="badge">🆓 Free &nbsp;·&nbsp; ${tool.audience === "lecturer" ? "🎓 Lecturer" : "👩‍🏫 Teacher"} Tool</div>
  <h1>${tool.icon} ${tool.name}</h1>
  <p class="sub">${tool.desc}</p>

  <!-- Tool Engine Mount Point -->
  <div id="te-mount"></div>

  <!-- What is this tool -->
  <h2 class="sec-title">What is ${tool.name}?</h2>
  <p style="color:var(--mu);font-size:14px;line-height:1.7;margin-bottom:20px">
    ${tool.name} is a free AI-powered tool by Forjit AI designed for Indian teachers and educators.
    It uses advanced AI to help you ${tool.desc.toLowerCase()} 
    No signup required. Works on mobile and desktop.
    Add your free <a href="https://console.groq.com/keys" target="_blank" rel="noopener" style="color:var(--ac)">Groq API key</a> for unlimited use.
  </p>

  <!-- FAQs -->
  <h2 class="sec-title">Frequently Asked Questions</h2>
  <div style="margin-bottom:28px">${faqHTML}</div>

  <!-- Related Tools -->
  <h2 class="sec-title">Related Teacher Tools</h2>
  <div class="related-grid">
    <a href="/tools/teacher/lesson-plan-generator.html" class="related-card">📋 <span>Lesson Plan Generator</span></a>
    <a href="/tools/teacher/mcq-maker.html" class="related-card">✅ <span>MCQ Maker</span></a>
    <a href="/tools/teacher/assignment-generator.html" class="related-card">📄 <span>Assignment Generator</span></a>
    <a href="/tools/teacher/progress-report-comments.html" class="related-card">💬 <span>Report Comments</span></a>
    <a href="/tools/teacher/blooms-taxonomy-questions.html" class="related-card">🧠 <span>Bloom's Taxonomy</span></a>
    <a href="/tools/teacher/rubric-maker.html" class="related-card">📊 <span>Rubric Maker</span></a>
  </div>
</main>

<footer>
  <p>© 2025 Forjit AI · All rights reserved ·
    <a href="/privacy.html">Privacy</a> · <a href="/terms.html">Terms</a> ·
    <a href="mailto:forjitai@gmail.com">forjitai@gmail.com</a>
  </p>
</footer>

<!-- Tool Config (read by teacher-engine.js) -->
<script id="tool-config" type="application/json">
${toolConfigJSON}
</script>

<!-- Cookie Consent -->
<script src="/cookie-consent.js"></script>

<!-- Teacher Engine -->
<script src="/tools/teacher-engine.js"></script>

</body>
</html>`;
}

/* ── Hub page for all teacher tools ────────────────────────────────────── */
function hubPageHTML(tools, cats) {
  // Group tools by category
  const grouped = {};
  tools.forEach(t => {
    if (!grouped[t.category]) grouped[t.category] = [];
    grouped[t.category].push(t);
  });

  const sections = Object.entries(grouped).map(([catKey, catTools]) => {
    const cat = cats[catKey] || { label: catKey, emoji: "🔧" };
    const cards = catTools.map(t => `
      <a href="/tools/teacher/${t.id}.html" style="background:var(--sur);border:1px solid var(--bor);border-radius:12px;padding:16px;text-decoration:none;color:var(--fg);display:block;transition:border-color .15s" onmouseover="this.style.borderColor='var(--ac)'" onmouseout="this.style.borderColor='var(--bor)'">
        <div style="font-size:24px;margin-bottom:8px">${t.icon}</div>
        <div style="font-size:14px;font-weight:600;margin-bottom:4px">${t.name}</div>
        <div style="font-size:12px;color:var(--mu);line-height:1.4">${t.desc}</div>
      </a>`).join("");

    return `
    <section style="margin-bottom:36px">
      <h2 style="font-size:18px;font-weight:700;margin-bottom:16px;display:flex;align-items:center;gap:8px">
        ${cat.emoji} ${cat.label}
        <span style="font-size:11px;font-weight:600;color:var(--mu);background:var(--bor);padding:2px 8px;border-radius:999px">${catTools.length}</span>
      </h2>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:12px">
        ${cards}
      </div>
    </section>`;
  }).join("");

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>Free AI Tools for Teachers India — Lesson Plans, MCQs, Reports | Forjit AI</title>
<meta name="description" content="Free AI tools for Indian teachers. Generate lesson plans, MCQs, assignments, report comments, essays in seconds. CBSE ICSE State Board. No login required."/>
<meta name="keywords" content="free AI tools for teachers India, lesson plan generator, MCQ maker teacher, teacher tools online free, CBSE teacher tools"/>
<link rel="canonical" href="https://www.forjitai.in/tools/teacher/"/>
<meta property="og:title" content="Free AI Tools for Teachers India | Forjit AI"/>
<meta property="og:description" content="Free AI tools for Indian teachers. Lesson plans, MCQs, reports and more. No login required."/>
<meta property="og:url" content="https://www.forjitai.in/tools/teacher/"/>
<meta property="og:type" content="website"/>
<meta property="og:image" content="https://www.forjitai.in/og-image.png"/>
<script async src="https://www.googletagmanager.com/gtag/js?id=G-DYR402JFVG"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-DYR402JFVG');</script>
<script type="application/ld+json">
{
  "@context":"https://schema.org",
  "@type":"CollectionPage",
  "name":"Free AI Tools for Teachers India",
  "description":"Free AI-powered tools for Indian school teachers and college lecturers.",
  "url":"https://www.forjitai.in/tools/teacher/",
  "provider":{"@type":"Organization","name":"Forjit AI","url":"https://www.forjitai.in"}
}
</script>
<style>
*{box-sizing:border-box;margin:0;padding:0}
:root{--bg:#0c0a09;--sur:#1c1917;--bor:#292524;--fg:#e7e5e4;--mu:#a8a29e;--su:#78716c;--ac:#fbbf24}
body{font-family:'Segoe UI',system-ui,sans-serif;background:var(--bg);color:var(--fg);min-height:100vh}
header{background:var(--sur);border-bottom:1px solid var(--bor);padding:12px 20px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:10}
.logo{display:flex;align-items:center;gap:10px;text-decoration:none;color:var(--fg)}
.lm{width:32px;height:32px;background:var(--ac);border-radius:6px;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:16px;color:var(--bg)}
.back{color:var(--mu);text-decoration:none;font-size:13px}.back:hover{color:var(--ac)}
.wrap{max-width:960px;margin:0 auto;padding:22px 16px}
footer{text-align:center;padding:32px 16px;color:var(--su);font-size:12px;border-top:1px solid var(--bor);margin-top:40px}
footer a{color:var(--mu);text-decoration:none}
input[type=search]{background:var(--sur);border:1px solid var(--bor);border-radius:10px;padding:10px 16px;color:var(--fg);font-size:14px;outline:none;width:100%;font-family:inherit;transition:border-color .15s}
input[type=search]:focus{border-color:var(--ac)}
</style>
</head>
<body>
<header>
  <a href="/" class="logo"><div class="lm">F</div><span style="font-weight:700;font-size:15px">Forjit AI</span></a>
  <a href="/tools/" class="back">← All Tools</a>
</header>

<main class="wrap">
  <div style="text-align:center;padding:32px 0 28px">
    <div style="font-size:40px;margin-bottom:12px">👩‍🏫</div>
    <h1 style="font-size:28px;font-weight:800;margin-bottom:8px">Free AI Tools for Teachers</h1>
    <p style="color:var(--mu);font-size:15px;max-width:520px;margin:0 auto 20px">Lesson plans, MCQs, assignments, report comments, essays and more. Made for Indian teachers. Completely free.</p>
    <input type="search" id="search" placeholder="Search tools… e.g. lesson plan, MCQ, Hindi" style="max-width:440px"/>
  </div>

  <div id="tools-container">
    ${sections}
  </div>

  <p style="text-align:center;color:var(--su);font-size:13px;margin-top:8px">
    ${tools.length} tools available · More being added every week
  </p>
</main>

<footer>
  <p>© 2025 Forjit AI · All rights reserved ·
    <a href="/privacy.html">Privacy</a> · <a href="/terms.html">Terms</a> ·
    <a href="mailto:forjitai@gmail.com">forjitai@gmail.com</a>
  </p>
</footer>

<script src="/cookie-consent.js"></script>
<script>
// Search filter
const searchEl = document.getElementById('search');
searchEl.addEventListener('input', function() {
  const q = this.value.toLowerCase();
  document.querySelectorAll('a[href*="/tools/teacher/"]').forEach(el => {
    const text = el.textContent.toLowerCase();
    el.parentElement.style.display = !q || text.includes(q) ? '' : 'none';
  });
});
</script>
</body>
</html>`;
}

/* ── Generate all files ─────────────────────────────────────────────────── */
let count = 0;

// Generate individual tool pages
TOOLS.forEach(tool => {
  const html = toolPageHTML(tool);
  const path = join(OUT_DIR, `${tool.id}.html`);
  writeFileSync(path, html, "utf8");
  count++;
  console.log(`✅ Generated: /tools/teacher/${tool.id}.html`);
});

// Generate hub page
writeFileSync(join(OUT_DIR, "index.html"), hubPageHTML(TOOLS, CATS), "utf8");
console.log(`✅ Generated: /tools/teacher/index.html`);

// Print sitemap entries
console.log("\n📋 Add these to sitemap.xml:\n");
TOOLS.forEach(tool => {
  console.log(`  <url>
    <loc>https://www.forjitai.in/tools/teacher/${tool.id}.html</loc>
    <lastmod>2026-04-28</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${tool.priority || 0.8}</priority>
  </url>`);
});

console.log(`\n✨ Done! Generated ${count} tool pages + 1 hub page.`);
console.log(`📁 Output: public/tools/teacher/`);
console.log(`\n🚀 Next: npm run build && git push`);
