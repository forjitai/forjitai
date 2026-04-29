#!/usr/bin/env node
/* ─── Forjit AI · Teacher Tools Generator v2 ────────────────────────────────
 *  Generates all teacher tool pages with:
 *  ✅ Google AdSense (pub-5102938260449475) — 3 ad units per page
 *  ✅ Full SEO: canonical, OG, Twitter Card, author, robots
 *  ✅ Schema: WebApplication + FAQPage + BreadcrumbList
 *  ✅ Google Analytics (G-DYR402JFVG)
 *  ✅ robots.txt entries
 *  ✅ sitemap.xml auto-updated
 * ──────────────────────────────────────────────────────────────────────────*/

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT      = join(__dirname, "..");

const PUB_ID   = "ca-pub-5102938260449475";
const GA_ID    = "G-DYR402JFVG";
const BASE_URL = "https://www.forjitai.in";
const TODAY    = new Date().toISOString().split("T")[0];

/* ── Load config ───────────────────────────────────────────────────────── */
const configText = readFileSync(join(ROOT, "src/data/teacher-tools.js"), "utf8");
const configModule = {};
const moduleCode = configText
  .replace(/^export const /gm, "const ")
  .replace(/^export default /gm, "module.exports = ");
eval(moduleCode + "\n configModule.tools = TEACHER_TOOLS; configModule.cats = TEACHER_CATEGORIES;");

const TOOLS = configModule.tools;
const CATS  = configModule.cats;

const OUT_DIR = join(ROOT, "public/tools/teacher");
if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

/* ── AdSense block helper ──────────────────────────────────────────────── */
function adUnit(slot, style = "display:block") {
  return `<ins class="adsbygoogle"
  style="${style}"
  data-ad-client="${PUB_ID}"
  data-ad-slot="${slot}"
  data-ad-format="auto"
  data-full-width-responsive="true"></ins>
<script>(adsbygoogle = window.adsbygoogle || []).push({});</script>`;
}

/* ── Tool page HTML ────────────────────────────────────────────────────── */
function toolPageHTML(tool) {
  const faqSchema = (tool.faqs || []).map(f => ({
    "@type": "Question",
    "name": f.q,
    "acceptedAnswer": { "@type": "Answer", "text": f.a }
  }));

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
    { name: "Home",          url: `${BASE_URL}/` },
    { name: "Teacher Tools", url: `${BASE_URL}/tools/teacher/` },
    { name: tool.name,       url: `${BASE_URL}/tools/teacher/${tool.id}.html` },
  ];

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "name": tool.name,
        "description": tool.seoDesc,
        "url": `${BASE_URL}/tools/teacher/${tool.id}.html`,
        "applicationCategory": "EducationApplication",
        "operatingSystem": "Web, Android, iOS",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" },
        "provider": { "@type": "Organization", "name": "Forjit AI", "url": BASE_URL },
        "audience": { "@type": "Audience", "audienceType": "Teachers, Educators, Lecturers" },
        "inLanguage": "en-IN"
      },
      {
        "@type": "FAQPage",
        "mainEntity": faqSchema
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": breadcrumb.map((b, i) => ({
          "@type": "ListItem", "position": i + 1, "name": b.name, "item": b.url
        }))
      }
    ]
  };

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"/>
<meta name="author" content="Forjit AI"/>
<meta name="copyright" content="© 2025 Forjit AI"/>

<title>${tool.seoTitle}</title>
<meta name="description" content="${tool.seoDesc}"/>
<meta name="keywords" content="${(tool.seoKeywords || []).join(", ")}"/>

<!-- Canonical -->
<link rel="canonical" href="${BASE_URL}/tools/teacher/${tool.id}.html"/>

<!-- Open Graph -->
<meta property="og:title" content="${tool.seoTitle}"/>
<meta property="og:description" content="${tool.seoDesc}"/>
<meta property="og:url" content="${BASE_URL}/tools/teacher/${tool.id}.html"/>
<meta property="og:type" content="website"/>
<meta property="og:image" content="${BASE_URL}/og-image.png"/>
<meta property="og:image:width" content="1200"/>
<meta property="og:image:height" content="630"/>
<meta property="og:image:alt" content="${tool.name} - Forjit AI"/>
<meta property="og:site_name" content="Forjit AI"/>
<meta property="og:locale" content="en_IN"/>

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image"/>
<meta name="twitter:title" content="${tool.seoTitle}"/>
<meta name="twitter:description" content="${tool.seoDesc}"/>
<meta name="twitter:image" content="${BASE_URL}/og-image.png"/>
<meta name="twitter:site" content="@forjitai"/>

<!-- Google AdSense -->
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${PUB_ID}" crossorigin="anonymous"></script>

<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${GA_ID}"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');</script>

<!-- Schema.org Structured Data -->
<script type="application/ld+json">${JSON.stringify(schema, null, 2)}</script>

<style>
*{box-sizing:border-box;margin:0;padding:0}
:root{--bg:#0c0a09;--sur:#1c1917;--bor:#292524;--fg:#e7e5e4;--mu:#a8a29e;--su:#78716c;--ac:#fbbf24;--gr:#22c55e}
body{font-family:'Segoe UI',system-ui,sans-serif;background:var(--bg);color:var(--fg);min-height:100vh}
header{background:var(--sur);border-bottom:1px solid var(--bor);padding:12px 20px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:10}
.logo{display:flex;align-items:center;gap:10px;text-decoration:none;color:var(--fg)}
.lm{width:32px;height:32px;background:var(--ac);border-radius:6px;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:16px;color:var(--bg)}
.back{color:var(--mu);text-decoration:none;font-size:13px}.back:hover{color:var(--ac)}
.wrap{max-width:720px;margin:0 auto;padding:12px 16px}
h1{font-size:26px;font-weight:700;margin-bottom:4px}
.sub{color:var(--mu);font-size:14px;margin-bottom:24px}
.badge{display:inline-flex;align-items:center;gap:5px;padding:3px 10px;border-radius:999px;font-size:11px;font-weight:700;background:rgba(251,191,36,.15);color:var(--ac);border:1px solid rgba(251,191,36,.25);margin-bottom:12px}
.sec-title{font-size:11px;font-weight:700;color:var(--mu);text-transform:uppercase;letter-spacing:.08em;margin:28px 0 12px}
.related-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:10px;margin-bottom:20px}
.related-card{background:var(--sur);border:1px solid var(--bor);border-radius:10px;padding:14px;text-decoration:none;color:var(--fg);transition:border-color .15s;display:flex;align-items:center;gap:10px}
.related-card:hover{border-color:var(--ac)}
footer{text-align:center;padding:32px 16px;color:var(--su);font-size:12px;border-top:1px solid var(--bor);margin-top:40px}
footer a{color:var(--mu);text-decoration:none}
.ad-wrap{margin:20px 0;min-height:90px;text-align:center}
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
  <nav aria-label="breadcrumb" style="font-size:12px;color:var(--su);margin-bottom:10px">
    <a href="/" style="color:var(--su);text-decoration:none">Home</a> &rsaquo;
    <a href="/tools/teacher/" style="color:var(--su);text-decoration:none">Teacher Tools</a> &rsaquo;
    <span style="color:var(--mu)">${tool.name}</span>
  </nav>

  <!-- Page header -->
  <div class="badge">🆓 Free &nbsp;·&nbsp; ${tool.audience === "lecturer" ? "🎓 Lecturer" : "👩‍🏫 Teacher"} Tool</div>
  <h1>${tool.icon} ${tool.name}</h1>
  <p class="sub">${tool.desc}</p>

  <!-- Ad Unit 1 — Above tool (horizontal banner) -->
  <div class="ad-wrap">
    ${adUnit("2957174915")}
  </div>

  <!-- Tool Engine -->
  <div id="te-mount"></div>

  <!-- Ad Unit 2 — Below tool (responsive) -->
  <div class="ad-wrap">
    ${adUnit("7384629103")}
  </div>

  <!-- What is this tool -->
  <h2 class="sec-title">What is ${tool.name}?</h2>
  <p style="color:var(--mu);font-size:14px;line-height:1.7;margin-bottom:20px">
    ${tool.name} is a free AI-powered tool by Forjit AI designed for Indian teachers and educators.
    It helps you ${tool.desc.toLowerCase()}
    Works on mobile and desktop. No signup required. CBSE, ICSE, and State Board friendly.
  </p>

  <!-- FAQs -->
  <h2 class="sec-title">Frequently Asked Questions</h2>
  <div style="margin-bottom:28px">${faqHTML}</div>

  <!-- Ad Unit 3 — Before related tools -->
  <div class="ad-wrap">
    ${adUnit("4821039657")}
  </div>

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

<!-- Tool Config -->
<script id="tool-config" type="application/json">
${toolConfigJSON}
</script>

<!-- Cookie Consent -->
<script src="/cookie-consent.js"></script>

<!-- Teacher Engine -->
<script src="/tools/teacher-engine.js?v=${Date.now()}"></script>

</body>
</html>`;
}

/* ── Hub page ──────────────────────────────────────────────────────────── */
function hubPageHTML(tools, cats) {
  const grouped = {};
  tools.forEach(t => {
    if (!grouped[t.category]) grouped[t.category] = [];
    grouped[t.category].push(t);
  });

  const sections = Object.entries(grouped).map(([catKey, catTools]) => {
    const cat   = cats[catKey] || { label: catKey, emoji: "🔧" };
    const cards = catTools.map(t => `
      <a href="/tools/teacher/${t.id}.html"
        style="background:var(--sur);border:1px solid var(--bor);border-radius:12px;
               padding:16px;text-decoration:none;color:var(--fg);display:block;
               transition:border-color .15s"
        onmouseover="this.style.borderColor='var(--ac)'"
        onmouseout="this.style.borderColor='var(--bor)'">
        <div style="font-size:24px;margin-bottom:8px">${t.icon}</div>
        <div style="font-size:14px;font-weight:600;margin-bottom:4px">${t.name}</div>
        <div style="font-size:12px;color:var(--mu);line-height:1.4">${t.desc}</div>
      </a>`).join("");

    return `<section style="margin-bottom:36px">
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
<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large"/>
<meta name="author" content="Forjit AI"/>
<title>Free AI Tools for Teachers India — Lesson Plans, MCQs, Reports | Forjit AI</title>
<meta name="description" content="Free AI tools for Indian teachers. Generate lesson plans, MCQs, assignments, report comments, Hindi essays in seconds. CBSE ICSE State Board. No login required."/>
<meta name="keywords" content="free AI tools for teachers India, lesson plan generator, MCQ maker teacher, teacher tools online free, CBSE teacher tools, hindi essay writer, patra lekhan"/>
<link rel="canonical" href="${BASE_URL}/tools/teacher/"/>
<meta property="og:title" content="Free AI Tools for Teachers India | Forjit AI"/>
<meta property="og:description" content="Free AI tools for Indian teachers. Lesson plans, MCQs, assignments, reports and more. No login required."/>
<meta property="og:url" content="${BASE_URL}/tools/teacher/"/>
<meta property="og:type" content="website"/>
<meta property="og:image" content="${BASE_URL}/og-image.png"/>
<meta property="og:image:width" content="1200"/>
<meta property="og:image:height" content="630"/>
<meta property="og:site_name" content="Forjit AI"/>
<meta property="og:locale" content="en_IN"/>
<meta name="twitter:card" content="summary_large_image"/>
<meta name="twitter:title" content="Free AI Tools for Teachers India | Forjit AI"/>
<meta name="twitter:description" content="Lesson plans, MCQs, assignments, essays — free for every Indian teacher."/>
<meta name="twitter:image" content="${BASE_URL}/og-image.png"/>
<meta name="twitter:site" content="@forjitai"/>
<!-- AdSense -->
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${PUB_ID}" crossorigin="anonymous"></script>
<!-- GA -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${GA_ID}"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');</script>
<script type="application/ld+json">
{
  "@context":"https://schema.org",
  "@type":"CollectionPage",
  "name":"Free AI Tools for Teachers India",
  "description":"Free AI-powered tools for Indian school teachers and college lecturers.",
  "url":"${BASE_URL}/tools/teacher/",
  "provider":{"@type":"Organization","name":"Forjit AI","url":"${BASE_URL}"},
  "numberOfItems":${tools.length}
}
</script>
<style>
*{box-sizing:border-box;margin:0;padding:0}
:root{--bg:#0c0a09;--sur:#1c1917;--bor:#292524;--fg:#e7e5e4;--mu:#a8a29e;--su:#78716c;--ac:#fbbf24}
body{font-family:'Segoe UI',system-ui,sans-serif;background:var(--bg);color:var(--fg);min-height:100vh}
header{background:var(--sur);border-bottom:1px solid var(--bor);padding:12px 20px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:10}
.logo{display:flex;align-items:center;gap:10px;text-decoration:none;color:var(--fg)}
.lm{width:32px;height:32px;background:var(--ac);border-radius:6px;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:16px;color:var(--bg)}
.back{color:var(--mu);text-decoration:none;font-size:13px}
.wrap{max-width:960px;margin:0 auto;padding:12px 16px}
footer{text-align:center;padding:32px 16px;color:var(--su);font-size:12px;border-top:1px solid var(--bor);margin-top:40px}
footer a{color:var(--mu);text-decoration:none}
input[type=search]{background:var(--sur);border:1px solid var(--bor);border-radius:10px;padding:10px 16px;color:var(--fg);font-size:14px;outline:none;width:100%;font-family:inherit}
input[type=search]:focus{border-color:var(--ac)}
.ad-wrap{margin:20px 0;text-align:center}
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
    <p style="color:var(--mu);font-size:15px;max-width:520px;margin:0 auto 20px">
      Lesson plans, MCQs, assignments, report comments, Hindi essays and more.
      Made for Indian teachers. Completely free.
    </p>
    <input type="search" id="search" placeholder="Search tools… e.g. lesson plan, MCQ, Hindi" style="max-width:440px"/>
  </div>

  <!-- Ad — top of hub -->
  <div class="ad-wrap">${adUnit("2957174915")}</div>

  <div id="tools-container">${sections}</div>

  <!-- Ad — bottom of hub -->
  <div class="ad-wrap">${adUnit("7384629103")}</div>

  <p style="text-align:center;color:var(--su);font-size:13px;margin-top:8px">
    ${tools.length} tools available · More added every week
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
var s = document.getElementById('search');
s.addEventListener('input', function() {
  var q = this.value.toLowerCase();
  document.querySelectorAll('a[href*="/tools/teacher/"]').forEach(function(el) {
    el.parentElement.style.display = (!q || el.textContent.toLowerCase().includes(q)) ? '' : 'none';
  });
});
</script>
</body>
</html>`;
}

/* ── Update robots.txt ─────────────────────────────────────────────────── */
function updateRobots() {
  const robotsPath = join(ROOT, "public/robots.txt");
  let robots = readFileSync(robotsPath, "utf8");

  const teacherEntries = [
    "Allow: /tools/teacher/",
    ...TOOLS.map(t => `Allow: /tools/teacher/${t.id}.html`),
  ].join("\n");

  if (robots.includes("Allow: /tools/teacher/")) {
    // Already has teacher entries — replace the block
    robots = robots.replace(
      /# Teacher Tools[\s\S]*?(?=\n#|\nSitemap:|$)/,
      `# Teacher Tools\n${teacherEntries}\n`
    );
  } else {
    // Add after "Allow: /tools/"
    robots = robots.replace(
      "Allow: /tools/",
      `Allow: /tools/\n\n# Teacher Tools\n${teacherEntries}`
    );
  }

  writeFileSync(robotsPath, robots, "utf8");
  console.log(`✅ robots.txt updated with ${TOOLS.length} teacher tool entries`);
}

/* ── Update sitemap.xml ────────────────────────────────────────────────── */
function updateSitemap() {
  const sitemapPath = join(ROOT, "public/sitemap.xml");
  let sitemap = readFileSync(sitemapPath, "utf8");

  // Build new teacher entries block
  const hubEntry = `
  <!-- Teacher Tools Hub -->
  <url>
    <loc>${BASE_URL}/tools/teacher/</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.95</priority>
  </url>`;

  const toolEntries = TOOLS.map(t => `
  <url>
    <loc>${BASE_URL}/tools/teacher/${t.id}.html</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${t.priority || 0.85}</priority>
  </url>`).join("");

  const newBlock = `
  <!-- ═══ TEACHER TOOLS — AUTO-GENERATED ${TODAY} ═══ -->${hubEntry}${toolEntries}
  <!-- ═══ END TEACHER TOOLS ═══ -->`;

  // Replace existing teacher block or insert before </urlset>
  if (sitemap.includes("<!-- ═══ TEACHER TOOLS")) {
    sitemap = sitemap.replace(
      /<!-- ═══ TEACHER TOOLS[\s\S]*?<!-- ═══ END TEACHER TOOLS ═══ -->/,
      newBlock.trim()
    );
  } else {
    sitemap = sitemap.replace("</urlset>", newBlock + "\n\n</urlset>");
  }

  writeFileSync(sitemapPath, sitemap, "utf8");
  console.log(`✅ sitemap.xml updated with ${TOOLS.length + 1} teacher URLs`);
}

/* ── Generate ──────────────────────────────────────────────────────────── */
let count = 0;

TOOLS.forEach(tool => {
  const html = toolPageHTML(tool);
  writeFileSync(join(OUT_DIR, `${tool.id}.html`), html, "utf8");
  count++;
  console.log(`✅ ${tool.id}.html — AdSense ✓ SEO ✓ Schema ✓`);
});

writeFileSync(join(OUT_DIR, "index.html"), hubPageHTML(TOOLS, CATS), "utf8");
console.log(`✅ index.html (hub) — AdSense ✓ SEO ✓`);

updateRobots();
updateSitemap();

console.log(`\n✨ Done! ${count} tool pages + hub + robots.txt + sitemap.xml`);
console.log(`\n⚠️  AdSense slots used:`);
console.log(`   2957174915 — above tool (horizontal)`);
console.log(`   7384629103 — below tool (responsive)`);
console.log(`   4821039657 — before related tools`);
console.log(`\n   Replace slot IDs with real ones from your AdSense dashboard if needed.`);
