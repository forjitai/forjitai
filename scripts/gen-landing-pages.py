#!/usr/bin/env python3
"""Generates SEO landing pages from a shared template."""

import os

OUT = "public"

SHARED_STYLE = """
*{box-sizing:border-box;margin:0;padding:0}
:root{--bg:#0c0a09;--sur:#1c1917;--bor:#292524;--fg:#e7e5e4;--mu:#a8a29e;--su:#78716c;--ac:#fbbf24}
body{font-family:'Segoe UI',system-ui,sans-serif;background:var(--bg);color:var(--fg);line-height:1.7}
header{background:var(--sur);border-bottom:1px solid var(--bor);padding:14px 20px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:10}
.logo{display:flex;align-items:center;gap:10px;text-decoration:none;color:var(--fg)}
.lm{width:32px;height:32px;background:var(--ac);border-radius:6px;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:16px;color:#0c0a09}
nav a{color:var(--mu);text-decoration:none;font-size:13px;margin-left:16px}
nav a:hover{color:var(--ac)}
.wrap{max-width:900px;margin:0 auto;padding:40px 20px}
.hero{text-align:center;padding:56px 20px 44px;border-bottom:1px solid var(--bor);margin-bottom:48px}
.badge{display:inline-block;background:rgba(245,158,11,.15);color:var(--ac);border:1px solid rgba(245,158,11,.3);border-radius:20px;padding:4px 14px;font-size:12px;font-weight:600;margin-bottom:16px}
h1{font-size:34px;font-weight:800;margin-bottom:16px;line-height:1.2}
h1 span{color:var(--ac)}
.sub{color:var(--mu);font-size:16px;max-width:580px;margin:0 auto 28px}
.cta{display:inline-flex;align-items:center;gap:8px;background:var(--ac);color:#0c0a09;font-weight:700;font-size:15px;padding:12px 28px;border-radius:8px;text-decoration:none;transition:opacity .2s}
.cta:hover{opacity:.85}
.sec-title{font-size:20px;font-weight:700;margin:44px 0 8px}
.sec-sub{color:var(--mu);font-size:14px;margin-bottom:24px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(255px,1fr));gap:14px;margin-bottom:40px}
.card{background:var(--sur);border:1px solid var(--bor);border-radius:10px;padding:18px;text-decoration:none;color:inherit;transition:border-color .2s;display:block}
.card:hover{border-color:var(--ac)}
.card-icon{font-size:24px;margin-bottom:10px}
.card-title{font-size:14px;font-weight:700;margin-bottom:5px}
.card-desc{font-size:13px;color:var(--mu);line-height:1.5}
.prose{background:var(--sur);border:1px solid var(--bor);border-radius:12px;padding:28px;margin-bottom:28px}
.prose h2{font-size:18px;font-weight:700;margin-bottom:12px}
.prose p{color:var(--mu);font-size:14px;margin-bottom:14px;line-height:1.8}
.prose ul{color:var(--mu);font-size:14px;padding-left:20px;margin-bottom:14px}
.prose ul li{margin-bottom:6px;line-height:1.65}
.prose strong{color:var(--fg)}
.prose a{color:var(--ac);text-decoration:none}
.faq-item{border-bottom:1px solid var(--bor);padding:18px 0}
.faq-item:last-child{border-bottom:none}
.faq-q{font-size:15px;font-weight:600;margin-bottom:8px}
.faq-a{font-size:14px;color:var(--mu);line-height:1.75}
.faq-a a{color:var(--ac);text-decoration:none}
footer{text-align:center;padding:32px 20px;color:var(--su);font-size:13px;border-top:1px solid var(--bor);margin-top:52px}
footer a{color:var(--mu);text-decoration:none}
@media(max-width:600px){h1{font-size:24px}.hero{padding:36px 16px 28px}}
"""

def page(slug, title, meta_desc, keywords, h1_main, h1_accent, hero_sub, badge,
         cards, prose_sections, faqs, related_links, schema_type="CollectionPage"):
    
    faq_schema_items = ",\n    ".join(
        f'{{"@type":"Question","name":{repr(q)},"acceptedAnswer":{{"@type":"Answer","text":{repr(a)}}}}}'
        for q, a in faqs
    )
    cards_html = "\n".join(
        f'''<a class="card" href="{c['href']}">
      <div class="card-icon">{c['icon']}</div>
      <div class="card-title">{c['title']}</div>
      <div class="card-desc">{c['desc']}</div>
    </a>''' for c in cards
    )
    prose_html = "\n".join(
        f'''<div class="prose">
    <h2>{p['h2']}</h2>
    {p['body']}
  </div>''' for p in prose_sections
    )
    faq_html = "\n".join(
        f'''<div class="faq-item">
      <div class="faq-q">{q}</div>
      <div class="faq-a">{a}</div>
    </div>''' for q, a in faqs
    )
    related_html = " · ".join(f'<a href="{h}">{n}</a>' for n, h in related_links)
    
    return f"""<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>{title}</title>
<meta name="description" content="{meta_desc}"/>
<meta name="keywords" content="{keywords}"/>
<link rel="canonical" href="https://www.forjitai.in/{slug}"/>
<meta name="robots" content="index,follow,max-snippet:-1,max-image-preview:large"/>
<meta property="og:type" content="website"/>
<meta property="og:site_name" content="Forjit AI"/>
<meta property="og:url" content="https://www.forjitai.in/{slug}"/>
<meta property="og:title" content="{title}"/>
<meta property="og:description" content="{meta_desc}"/>
<meta property="og:image" content="https://www.forjitai.in/og-image.png"/>
<meta property="og:locale" content="en_IN"/>
<meta name="twitter:card" content="summary_large_image"/>
<meta name="twitter:site" content="@forjitai"/>
<meta name="twitter:title" content="{title}"/>
<meta name="twitter:description" content="{meta_desc}"/>
<meta name="twitter:image" content="https://www.forjitai.in/og-image.png"/>
<script type="application/ld+json">
{{
  "@context": "https://schema.org",
  "@type": "{schema_type}",
  "name": "{title}",
  "url": "https://www.forjitai.in/{slug}",
  "description": "{meta_desc}",
  "publisher": {{"@type":"Organization","name":"Forjit AI","url":"https://www.forjitai.in"}},
  "breadcrumb": {{"@type":"BreadcrumbList","itemListElement":[
    {{"@type":"ListItem","position":1,"name":"Forjit AI","item":"https://www.forjitai.in/"}},
    {{"@type":"ListItem","position":2,"name":"{h1_main} {h1_accent}","item":"https://www.forjitai.in/{slug}"}}
  ]}}
}}
</script>
<script type="application/ld+json">
{{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {faq_schema_items}
  ]
}}
</script>
<script async src="https://www.googletagmanager.com/gtag/js?id=G-DYR402JFVG"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){{dataLayer.push(arguments);}}gtag('js',new Date());gtag('config','G-DYR402JFVG');</script>
<script src="/cookie-consent.js"></script>
<style>{SHARED_STYLE}</style>
</head>
<body>
<header>
  <a class="logo" href="/"><div class="lm">F</div><span style="font-size:15px;font-weight:600;margin-left:2px">Forjit AI</span></a>
  <nav><a href="/tools/">Tools</a><a href="/blog/">Blog</a><a href="/">Try AI</a></nav>
</header>

<div class="wrap">
  <div class="hero">
    <div class="badge">{badge}</div>
    <h1>{h1_main} <span>{h1_accent}</span></h1>
    <p class="sub">{hero_sub}</p>
    <a class="cta" href="/">Try Forjit AI Free →</a>
  </div>

  <p class="sec-title">Featured Tools</p>
  <p class="sec-sub">All free · No login · Works on mobile</p>
  <div class="grid">{cards_html}</div>

  {prose_html}

  <div class="prose">
    <h2>Frequently Asked Questions</h2>
    <div style="padding:0">
      {faq_html}
    </div>
  </div>

  <div style="text-align:center;margin-top:44px">
    <a class="cta" href="/tools/">See All 47+ Free Tools →</a>
  </div>
</div>

<footer>
  <p>© 2025 Forjit AI · All rights reserved · <a href="/privacy">Privacy</a> · <a href="/terms">Terms</a> · <a href="/about">About</a></p>
  <p style="margin-top:8px">{related_html}</p>
</footer>
</body>
</html>"""


# ─── PAGE DEFINITIONS ──────────────────────────────────────────────────────────

PAGES = []

# 1. AI Tools for Developers
PAGES.append(("ai-tools-for-developers", page(
    slug="ai-tools-for-developers",
    title="Free AI Tools for Developers India 2026 — Code, Debug, Convert | Forjit AI",
    meta_desc="Free AI tools for developers in India 2026. JSON formatter, Base64 encoder, number converter, password generator, color converter, QR generator and more. No login needed.",
    keywords="AI tools for developers India, free developer tools online, coding tools free India, JSON formatter free, Base64 encoder, number converter, developer productivity tools 2026",
    h1_main="Free AI Tools for",
    h1_accent="Developers 2026",
    hero_sub="JSON formatters, Base64 encoders, number converters, password generators, QR code makers — all free, no login, instant in your browser.",
    badge="Free Forever · No Login · Made in India 🇮🇳",
    cards=[
        {"icon":"{ }","href":"/tools/json-formatter.html","title":"JSON Formatter & Validator","desc":"Paste messy JSON, get clean indented output with error highlighting. Essential for API debugging."},
        {"icon":"🔐","href":"/tools/base64-encoder.html","title":"Base64 Encoder / Decoder","desc":"Encode or decode Base64 strings — for APIs, JWTs, email attachments, and data URIs."},
        {"icon":"🔢","href":"/tools/number-converter.html","title":"Number System Converter","desc":"Convert between decimal, binary, octal, and hexadecimal instantly."},
        {"icon":"🎨","href":"/tools/color-converter.html","title":"Color Converter","desc":"Convert between HEX, RGB, HSL, and HSV color formats for CSS and design."},
        {"icon":"🛡️","href":"/tools/password-generator.html","title":"Password Generator","desc":"Generate cryptographically strong random passwords with custom length and character sets."},
        {"icon":"📷","href":"/tools/qr-generator.html","title":"QR Code Generator","desc":"Generate QR codes for URLs, text, or contacts. Download as PNG."},
        {"icon":"Ⅻ","href":"/tools/roman-numeral.html","title":"Roman Numeral Converter","desc":"Convert between Arabic and Roman numerals. Useful for version numbering and UI labels."},
        {"icon":"🤖","href":"/","title":"AI App Generator","desc":"Describe any web app in plain English — get working HTML/JS code in seconds. No coding needed."},
    ],
    prose_sections=[
        {"h2":"Why Developers in India Use Forjit AI",
         "body":"""<p>Indian developers — whether freelancers, startup engineers, or enterprise developers — need quick tools that work without friction. Forjit AI provides a suite of developer utilities that:</p>
<ul>
  <li><strong>Work completely offline after first load</strong> — Progressive Web App (PWA) caching means tools work without internet on subsequent visits</li>
  <li><strong>Process data in-browser</strong> — your JSON, passwords, and code never leave your device. No server-side processing.</li>
  <li><strong>No account, no API key</strong> — start using any tool in one click</li>
  <li><strong>Mobile-friendly</strong> — debug APIs from your phone during code reviews</li>
  <li><strong>Open source</strong> — the entire platform is <a href="https://github.com/forjitai/forjitai">available on GitHub</a></li>
</ul>
<p>Beyond utilities, Forjit AI's <strong>AI App Generator</strong> lets you describe a web app or tool in plain English and get a working HTML/JavaScript implementation in seconds — powered by Llama 3.3, Qwen 3, and DeepSeek V3.</p>"""},
        {"h2":"Developer Use Cases — What You Can Build with Forjit AI",
         "body":"""<p>The AI App Generator on Forjit AI has been used to create:</p>
<ul>
  <li><strong>Custom calculators</strong> — loan calculators with custom formulas, unit converters for niche industries, financial modeling tools</li>
  <li><strong>Data visualization dashboards</strong> — charts, graphs, and tables from CSV data</li>
  <li><strong>Form validators</strong> — phone number validators, email validators, GST number validators</li>
  <li><strong>Mini-games</strong> — quiz apps, memory games, typing speed testers</li>
  <li><strong>Utility scripts</strong> — text processors, markdown to HTML converters, slug generators</li>
  <li><strong>Mock UIs</strong> — quick prototypes to show clients before building the full application</li>
</ul>
<p>Generated apps are single-file HTML — easy to host on GitHub Pages, Netlify, or any static host for free.</p>"""},
    ],
    faqs=[
        ("What free developer tools does Forjit AI offer?",
         "Forjit AI includes JSON Formatter, Base64 Encoder/Decoder, Number System Converter (decimal/binary/hex/octal), Color Converter (HEX/RGB/HSL), Password Generator, QR Code Generator, Roman Numeral Converter, Word Counter, and the AI App Generator. All tools are free, work in-browser, and require no account."),
        ("Is Forjit AI's JSON formatter safe for sensitive data?",
         "Yes. All data processing happens entirely in your browser using JavaScript. No data is sent to any server. Your JSON, passwords, and encoded data never leave your device. This makes it safe for formatting internal API responses and sensitive configuration files."),
        ("Can I use Forjit AI to generate code for free?",
         "Yes. Forjit AI's App Generator creates working HTML/JavaScript apps from a text description — completely free. For more complex code generation tasks (multi-file projects, specific framework code), tools like GitHub Copilot or Google Gemini's code features may be more suitable."),
        ("What AI models power Forjit AI?",
         "Forjit AI is powered by top open-source models via the Groq inference API: Llama 3.3 70B, Qwen 3 32B, and DeepSeek V3. These models perform at near-GPT-4 level for code generation, documentation writing, and tool building tasks."),
    ],
    related_links=[
        ("Free AI Tools India", "/free-ai-tools-india"),
        ("Best AI Tools 2026", "/best-ai-tools-2026"),
        ("Productivity Tools", "/productivity-tools-online"),
        ("AI for Students", "/ai-tools-for-students"),
        ("Blog", "/blog/"),
    ]
)))

# 2. AI Tools for Content Creators
PAGES.append(("ai-tools-for-content-creators", page(
    slug="ai-tools-for-content-creators",
    title="Free AI Tools for Content Creators India 2026 — Write, Plan, Publish | Forjit AI",
    meta_desc="Free AI tools for content creators and bloggers in India 2026. AI writing generator, word counter, QR generator, social media tools. No login, no subscription.",
    keywords="AI tools for content creators India, AI tools for content writing, free AI blog writer India, AI writing tools free, content creator tools India 2026, AI tools for YouTube creators, AI caption generator India",
    h1_main="Free AI Tools for",
    h1_accent="Content Creators",
    hero_sub="Write faster, plan better, and publish smarter — with free AI tools built for Indian bloggers, YouTubers, and social media creators.",
    badge="Free Forever · No Login · India 🇮🇳",
    cards=[
        {"icon":"✍️","href":"/","title":"AI Content Generator","desc":"Generate blog posts, social captions, scripts, and articles from a text prompt. Powered by Llama 3.3."},
        {"icon":"📊","href":"/tools/word-counter.html","title":"Word Counter","desc":"Count words, characters, reading time. Essential for blog posts, social media, and SERP snippets."},
        {"icon":"🔤","href":"/tools/case-converter.html","title":"Case Converter","desc":"Fix capitalisation instantly — Title Case for headings, UPPERCASE for emphasis, camelCase for code."},
        {"icon":"📄","href":"/tools/lorem-ipsum.html","title":"Lorem Ipsum Generator","desc":"Placeholder text for design mockups and website wireframes before real content is ready."},
        {"icon":"📷","href":"/tools/qr-generator.html","title":"QR Code Generator","desc":"Create QR codes for your website, YouTube channel, Instagram profile, or UPI payment."},
        {"icon":"💬","href":"/tools/whatsapp-link.html","title":"WhatsApp Link Generator","desc":"Create click-to-chat WhatsApp links for your audience. Add pre-filled messages."},
        {"icon":"🎲","href":"/tools/random-generator.html","title":"Random Generator","desc":"Random numbers, dice, UUID — useful for giveaways, content ideas, and testing."},
        {"icon":"🤖","href":"/","title":"AI Document Generator","desc":"Generate resumes, cover letters, media kits, pitch decks, and business proposals."},
    ],
    prose_sections=[
        {"h2":"How Indian Content Creators Use AI Tools in 2026",
         "body":"""<p>India's creator economy is one of the fastest-growing in the world — with over 100 million active content creators on YouTube, Instagram, and regional platforms. In 2026, successful creators use AI tools not to replace their voice, but to work faster and more consistently.</p>
<ul>
  <li><strong>Blog writers:</strong> Use AI to generate first drafts, outlines, and meta descriptions — then edit to add their own voice and expertise</li>
  <li><strong>YouTubers:</strong> Generate video scripts, chapter timestamps, and video descriptions from a prompt</li>
  <li><strong>Instagram creators:</strong> Generate caption variations, hashtag sets, and story text</li>
  <li><strong>Podcast hosts:</strong> Create episode show notes, episode summaries, and social media posts from episode transcripts</li>
  <li><strong>Freelance writers:</strong> Research article structures, generate multiple angle ideas, and draft client content faster</li>
</ul>"""},
        {"h2":"AI Content Writing — Best Practices for India",
         "body":"""<p>Using AI for content creation effectively requires a clear workflow:</p>
<ul>
  <li><strong>Always add your voice:</strong> AI output is a starting point. Add personal anecdotes, local context, and expertise that only you have</li>
  <li><strong>Fact-check everything:</strong> AI tools can generate plausible-sounding but incorrect statistics. Verify any data point before publishing</li>
  <li><strong>Localise for India:</strong> AI output often defaults to US/UK context. Change currency to ₹, references to Indian platforms, and examples to Indian situations</li>
  <li><strong>SEO optimise after generating:</strong> Add target keywords naturally, ensure the content covers the topic completely, and check word count with our <a href="/tools/word-counter.html">Word Counter</a></li>
  <li><strong>Disclose AI use where required:</strong> Platforms like LinkedIn and Medium increasingly ask for disclosure of AI-assisted content</li>
</ul>"""},
    ],
    faqs=[
        ("What is the best free AI writing tool for Indian content creators?",
         "Forjit AI is the best free AI writing tool for Indian content creators — it generates blog posts, social media captions, video scripts, and articles from a text prompt, completely free with no account needed. It's localised for India with relevant examples and context."),
        ("Can AI tools write in Hindi or Indian regional languages?",
         "Forjit AI (powered by Llama 3.3, Qwen 3, DeepSeek V3) can generate content in Hindi and other Indian languages when you prompt it in that language. Quality is best for Hindi, followed by Tamil, Telugu, and Bengali. For highly localised content in regional languages, always have a native speaker review and edit the output."),
        ("Are there free AI tools for Instagram captions in India?",
         "Yes. Forjit AI's AI generator can create Instagram captions, reel hooks, hashtag sets, and story text from a simple prompt. Describe your post, your audience, and the tone you want — get multiple caption variations instantly. No login required."),
        ("How many words can the Forjit AI content generator produce?",
         "Forjit AI can generate blog posts up to approximately 2,000–3,000 words in a single generation. For longer content (5,000+ words), break it into sections and generate each separately, then combine. The tool has no daily generation limit for free users."),
    ],
    related_links=[
        ("Free AI Tools India", "/free-ai-tools-india"),
        ("AI for Students", "/ai-tools-for-students"),
        ("AI for Developers", "/ai-tools-for-developers"),
        ("Productivity Tools", "/productivity-tools-online"),
        ("Blog", "/blog/"),
    ]
)))

# 3. AI Tools for Daily Use
PAGES.append(("ai-tools-for-daily-use", page(
    slug="ai-tools-for-daily-use",
    title="Free AI Tools for Daily Use India 2026 — Everyday Tasks Made Easy | Forjit AI",
    meta_desc="Free AI tools for daily use in India 2026. Calculate EMI, tax, BMI, age, GST. Generate meal plans, shopping lists, and documents. No login required.",
    keywords="AI tools for daily use India, free tools for everyday tasks India, daily productivity tools online, AI tools daily life India 2026, free online tools daily use, simple AI tools India",
    h1_main="Free AI Tools for",
    h1_accent="Daily Use in India",
    hero_sub="From calculating your home loan EMI to planning your week's meals — 47 tools for everyday Indian life. Free, no account needed.",
    badge="Used Daily by Indians 🇮🇳 · Free Forever",
    cards=[
        {"icon":"🏠","href":"/tools/emi-calculator.html","title":"EMI Calculator","desc":"Home, car, and personal loan EMI with full payment breakdown. India's most-used finance tool."},
        {"icon":"💰","href":"/tools/income-tax-calculator.html","title":"Income Tax Calculator","desc":"New vs old regime comparison for FY 2025–26. Find which regime saves you more tax."},
        {"icon":"🧾","href":"/tools/gst-calculator.html","title":"GST Calculator","desc":"Add or remove GST at 5%, 12%, 18%, 28%. CGST, SGST, IGST breakdown."},
        {"icon":"⚖️","href":"/tools/bmi-calculator.html","title":"BMI Calculator","desc":"Check your Body Mass Index with Indian health guidelines and recommendations."},
        {"icon":"🎂","href":"/tools/age-calculator.html","title":"Age Calculator","desc":"Exact age in years, months, days. Check government exam eligibility instantly."},
        {"icon":"📅","href":"/tools/date-calculator.html","title":"Date Calculator","desc":"Days between dates, add/subtract days, find any day of the week."},
        {"icon":"🍱","href":"/tools/indian-cooking-planner.html","title":"Indian Cooking Planner","desc":"AI-generated weekly meal plans with Indian recipes, calorie counts, and grocery lists."},
        {"icon":"💧","href":"/tools/water-intake.html","title":"Water Intake Calculator","desc":"Daily water requirement based on weight and activity. Especially useful in Indian summer."},
    ],
    prose_sections=[
        {"h2":"How Indians Use These Tools Every Day",
         "body":"""<p>Forjit AI was built specifically for the everyday needs of Indian users — salaried employees, students, homemakers, small business owners, and freelancers. Here's how different people use these tools daily:</p>
<ul>
  <li><strong>Salaried employees:</strong> Check income tax (new vs old regime) before April ITR filing, calculate home loan affordability before taking a loan, check HRA exemption</li>
  <li><strong>Students:</strong> Check exam age eligibility (UPSC, SSC, banking), convert CGPA to percentage for job applications, calculate remaining study days</li>
  <li><strong>Homemakers:</strong> Plan weekly meals with the Indian Cooking Planner, calculate daily water intake, use the discount calculator for shopping</li>
  <li><strong>Small business owners:</strong> Add or remove GST from invoices, calculate loan EMI for business loans, generate QR codes for UPI payments</li>
  <li><strong>Freelancers:</strong> Calculate take-home salary from client offers, generate invoices and proposals with the AI generator, check date deadlines</li>
</ul>"""},
        {"h2":"Why These Are the Best Free Daily-Use Tools for India",
         "body":"""<p>Most free tool websites are designed for global (typically US/UK) audiences. Forjit AI is the only platform purpose-built for Indian users with:</p>
<ul>
  <li><strong>Indian tax rules:</strong> New and old regime slabs, standard deduction, Section 87A rebate — all updated for FY 2025–26</li>
  <li><strong>Indian GST system:</strong> All 4 slabs (5%, 12%, 18%, 28%), CGST/SGST/IGST breakdown, reverse calculation</li>
  <li><strong>Indian financial products:</strong> SIP, PPF, FD, RD, NSC, NPS calculators — not just generic investment tools</li>
  <li><strong>Indian health guidelines:</strong> BMI interpreted with South Asian-specific thresholds recommended by ICMR</li>
  <li><strong>Indian recipes:</strong> 72+ recipes across regional Indian cuisines in the cooking planner</li>
</ul>"""},
    ],
    faqs=[
        ("What are the most useful free online tools for daily use in India?",
         "The most useful free daily-use tools for Indians are: EMI Calculator (for home/car/personal loans), Income Tax Calculator (new vs old regime comparison), GST Calculator (for business invoices), Age Calculator (for exam eligibility), BMI Calculator (health check), and Date Calculator. All are available free on Forjit AI — no login required."),
        ("Is there a free AI tool for daily meal planning for Indians?",
         "Yes. Forjit AI's Indian Cooking Planner generates AI-powered weekly meal plans with Indian recipes — tailored to your dietary preferences (vegetarian, non-veg, vegan), number of people, and regional cuisine style. Includes calorie counts and grocery lists. Completely free, no account needed."),
        ("Which free tool helps calculate home loan EMI in India?",
         "Forjit AI's EMI Calculator is India's most detailed free EMI calculator. Enter loan amount, interest rate, and tenure to get: monthly EMI, total interest payable, total payment, and full amortization schedule. Also shows how much interest you save with prepayments. Works for home, car, and personal loans."),
        ("Can I use Forjit AI tools on my mobile phone?",
         "Yes. All Forjit AI tools are fully mobile-optimised — designed for phone screens with large tap targets and no horizontal scrolling. The site also works as a Progressive Web App (PWA) — you can add it to your home screen for instant access without opening a browser."),
    ],
    related_links=[
        ("Free AI Tools India", "/free-ai-tools-india"),
        ("AI for Students", "/ai-tools-for-students"),
        ("Productivity Tools", "/productivity-tools-online"),
        ("Best AI Tools 2026", "/best-ai-tools-2026"),
        ("Blog", "/blog/"),
    ]
)))

# 4. AI Tools for Coding Beginners
PAGES.append(("ai-tools-for-coding-beginners", page(
    slug="ai-tools-for-coding-beginners",
    title="Free AI Tools for Coding Beginners India 2026 — Learn, Build, Debug | Forjit AI",
    meta_desc="Best free AI tools for coding beginners in India 2026. Generate code from descriptions, format JSON, convert numbers, and learn to code with AI assistance. No login needed.",
    keywords="AI tools for coding beginners India, free coding tools for beginners, learn coding with AI India, AI code generator free India, coding assistant free, programming tools beginners India 2026",
    h1_main="Free AI Tools for",
    h1_accent="Coding Beginners",
    hero_sub="New to coding? These free AI tools help you write your first programs, understand code, debug errors, and build real projects — without any experience.",
    badge="Perfect for Beginners · Free · India 🇮🇳",
    cards=[
        {"icon":"🤖","href":"/","title":"AI App Generator","desc":"Describe what you want to build in plain English — get working HTML/CSS/JS code. Perfect for learning by example."},
        {"icon":"{ }","href":"/tools/json-formatter.html","title":"JSON Formatter","desc":"Understand API responses. Paste JSON, see it structured clearly — essential for any web developer."},
        {"icon":"🔢","href":"/tools/number-converter.html","title":"Number System Converter","desc":"Understand binary, hex, and octal — fundamental CS concepts made visual and interactive."},
        {"icon":"🔐","href":"/tools/base64-encoder.html","title":"Base64 Encoder","desc":"Learn how data encoding works — used in APIs, authentication, and file handling."},
        {"icon":"🎨","href":"/tools/color-converter.html","title":"Color Code Converter","desc":"Convert between HEX, RGB, and HSL — a daily tool for any front-end developer."},
        {"icon":"🛡️","href":"/tools/password-generator.html","title":"Password Generator","desc":"Learn about randomness and security while generating strong passwords for your projects."},
        {"icon":"📷","href":"/tools/qr-generator.html","title":"QR Code Generator","desc":"Build your first 'useful' project — a QR code for your GitHub profile or portfolio site."},
        {"icon":"Ⅻ","href":"/tools/roman-numeral.html","title":"Number Converter","desc":"A classic beginner coding exercise — build a Roman numeral converter. See the solution here first."},
    ],
    prose_sections=[
        {"h2":"How AI is Changing How Beginners Learn to Code in India",
         "body":"""<p>In 2026, learning to code in India looks very different from 5 years ago. AI tools have dramatically lowered the barrier to entry — you can now build real, working applications before you've mastered programming syntax. Here's how coding beginners are using AI tools effectively:</p>
<ul>
  <li><strong>"Explain this code" prompting:</strong> Paste confusing code into the AI generator and ask it to explain what each line does — better than Stack Overflow for learning context</li>
  <li><strong>Generate starter code:</strong> Describe the project (e.g., "a to-do list app with localStorage") and get a working starting point — then learn by modifying it</li>
  <li><strong>Debug error messages:</strong> Paste your error message and code snippet and ask the AI to identify and fix the issue</li>
  <li><strong>Build portfolio projects:</strong> Generate unique project ideas and starter code for your GitHub portfolio — even as a complete beginner</li>
  <li><strong>Learn by reading generated code:</strong> AI-generated code follows best practices and is well-structured — great for learning patterns</li>
</ul>"""},
        {"h2":"Best AI Coding Tools for Beginners in India — Comparison",
         "body":"""<p>Here's how the top free coding tools for beginners compare in 2026:</p>
<ul>
  <li><strong>Forjit AI (forjitai.in):</strong> Best for building complete mini-apps from descriptions. Free, no account. Output is single-file HTML — easy to understand and modify. Great for front-end beginners.</li>
  <li><strong>ChatGPT (free tier):</strong> Best for conversational learning and explaining concepts. Limited daily usage. Requires account. Better for multi-turn coding help sessions.</li>
  <li><strong>Google Gemini:</strong> Good for code explanation and debugging. Integrates with Google Colab for Python beginners. Free tier available with account.</li>
  <li><strong>GitHub Copilot (student plan):</strong> Best for IDE-integrated code completion. Free for verified students via GitHub Education. Requires VS Code or JetBrains IDE.</li>
  <li><strong>Replit AI:</strong> Best for running code directly in browser. Includes AI code completion. Free tier available. Good for Python and web projects.</li>
</ul>
<p>For Indian beginners just starting out — Forjit AI is the easiest entry point because it requires nothing: no account, no IDE, no setup. Just describe what you want and see code instantly.</p>"""},
    ],
    faqs=[
        ("Can a complete beginner use AI to learn coding in India?",
         "Yes, absolutely. AI tools like Forjit AI let complete beginners build working web apps from plain text descriptions — you can see real code working before you understand how it works. The recommended approach: generate code for a simple project, then ask the AI to explain each section, then try modifying one part at a time. This is faster than traditional tutorial-based learning for many beginners."),
        ("What programming language should beginners in India start with in 2026?",
         "For most Indian beginners in 2026, the recommended starting path is: HTML/CSS/JavaScript (for web development, highest job demand), then Python (for data science, automation, and AI/ML). Forjit AI generates HTML/JavaScript apps — making it a perfect companion for web development beginners. For data science students, Python with Jupyter notebooks remains the standard."),
        ("Is AI-generated code good enough to learn from?",
         "AI-generated code from models like Llama 3.3 and DeepSeek V3 generally follows good practices for small to medium-sized projects. It's appropriate for learning front-end patterns, understanding component structure, and seeing working implementations of algorithms. For production code and large projects, always have experienced developers review AI output — AI can introduce subtle bugs or use outdated patterns."),
        ("Are there free coding bootcamps in India that use AI tools?",
         "Several Indian EdTech platforms have integrated AI into their coding courses: Scaler Academy, Newton School, and UpGrad include AI coding assistants in their paid programs. For free resources, freeCodeCamp.org, The Odin Project, and CS50 (Harvard) are excellent structured learning paths. Combine these with Forjit AI for hands-on project building practice."),
    ],
    related_links=[
        ("AI for Developers", "/ai-tools-for-developers"),
        ("Free AI Tools India", "/free-ai-tools-india"),
        ("Best AI Tools 2026", "/best-ai-tools-2026"),
        ("Tool Comparisons", "/tool-comparisons"),
        ("Blog", "/blog/"),
    ]
)))

# 5. Free AI Tools No Login
PAGES.append(("free-ai-tools-no-login", page(
    slug="free-ai-tools-no-login",
    title="Free AI Tools Without Login India 2026 — Use Instantly, No Account | Forjit AI",
    meta_desc="Use 47+ free AI tools without login or account in India 2026. EMI calculator, tax calculator, AI generator, GST calculator, QR code maker — all instant, no sign-up.",
    keywords="free AI tools without login India, AI tools no account India, free tools no sign up India 2026, use AI tools instantly India, free online tools no registration, free AI apps no login India",
    h1_main="Free AI Tools",
    h1_accent="No Login Required",
    hero_sub="47+ tools that work the moment you land on the page. No email, no password, no account — ever. India's most accessible free AI platform.",
    badge="Zero Sign-Up · Zero Subscription · India 🇮🇳",
    cards=[
        {"icon":"🏠","href":"/tools/emi-calculator.html","title":"EMI Calculator","desc":"Instant home/car/personal loan EMI. No account. No ads on the tool page."},
        {"icon":"💰","href":"/tools/income-tax-calculator.html","title":"Income Tax Calculator","desc":"New vs old regime comparison. Works the second you open the page."},
        {"icon":"🤖","href":"/","title":"AI App Generator","desc":"Generate working web apps from text. No sign-up, no API key needed from you."},
        {"icon":"🧾","href":"/tools/gst-calculator.html","title":"GST Calculator","desc":"All GST slabs. CGST/SGST/IGST. Works instantly, no login."},
        {"icon":"📊","href":"/tools/sip-calculator.html","title":"SIP Calculator","desc":"Monthly SIP returns and wealth projection. Instant, no account."},
        {"icon":"⚖️","href":"/tools/bmi-calculator.html","title":"BMI Calculator","desc":"Body Mass Index with Indian health thresholds. No registration."},
        {"icon":"{ }","href":"/tools/json-formatter.html","title":"JSON Formatter","desc":"Format and validate JSON instantly. Your data never leaves your browser."},
        {"icon":"📷","href":"/tools/qr-generator.html","title":"QR Code Generator","desc":"QR codes for any URL or text. Download PNG free. No watermark."},
    ],
    prose_sections=[
        {"h2":"Why Most 'Free' AI Tools Actually Require Login",
         "body":"""<p>Most websites that advertise free AI tools have a hidden catch — they require you to create an account before you can use anything. Here's why they do it and why Forjit AI is different:</p>
<ul>
  <li><strong>Why they require login:</strong> Email capture for marketing, usage tracking for monetisation, rate-limiting to push free users to paid plans, and building user databases for investor metrics</li>
  <li><strong>Why Forjit AI doesn't:</strong> Forjit AI is open source, funded by ad revenue on non-tool pages, and built with a genuine commitment to accessibility for Indian users who shouldn't need to hand over personal data to use a calculator</li>
  <li><strong>What you give up with no login:</strong> Your calculation history isn't saved between sessions. For most tools, this doesn't matter — you recalculate when needed. For the AI generator, you can bookmark or copy your generated output.</li>
</ul>"""},
        {"h2":"Privacy Benefits of No-Login Tools",
         "body":"""<p>Using tools without login has real privacy advantages:</p>
<ul>
  <li><strong>No email harvesting:</strong> You won't receive marketing emails about your tool usage</li>
  <li><strong>No profile building:</strong> Your financial data (salary, loan amounts, investment figures) isn't linked to an account or sold to data brokers</li>
  <li><strong>In-browser processing:</strong> All Forjit AI calculator tools process data using JavaScript in your browser — nothing is sent to a server</li>
  <li><strong>No cookie tracking:</strong> Our cookie consent is minimal — we use Google Analytics for aggregate traffic data, not personal profiling</li>
  <li><strong>Compliant with India's DPDP Act:</strong> India's Digital Personal Data Protection Act 2023 requires informed consent for data collection — no-login tools minimise data collection by design</li>
</ul>"""},
    ],
    faqs=[
        ("Which free AI tools work without creating an account in India?",
         "Forjit AI (forjitai.in) offers 47+ tools that work completely without any account, email, or registration — including the AI App Generator, Income Tax Calculator, EMI Calculator, GST Calculator, SIP Calculator, BMI Calculator, JSON Formatter, and QR Code Generator. All tools are genuinely free with no usage limits."),
        ("Are free no-login AI tools safe to use in India?",
         "Yes, if the tool processes data in your browser (client-side). Forjit AI's calculator tools use JavaScript that runs in your browser — your financial figures, passwords, and JSON data never leave your device. Always check whether a free tool processes data server-side (less private) or client-side (more private). Forjit AI is client-side for all utility tools."),
        ("What is the best free alternative to ChatGPT without registration in India?",
         "Forjit AI is the best free ChatGPT alternative that requires zero registration for Indian users. It includes AI text and document generation powered by Llama 3.3 70B — plus 47+ India-specific tools. Other options include Perplexity AI (limited free use without account) and Google Gemini (requires Google account)."),
        ("Do Forjit AI tools store my data?",
         "Forjit AI calculator tools do not store or transmit your input data. Calculations happen in your browser using JavaScript. The AI generator sends your prompt text to the AI API (via Groq) to generate a response — this is necessary for AI functionality. No prompts are stored in user accounts since there are no accounts."),
    ],
    related_links=[
        ("Free AI Tools India", "/free-ai-tools-india"),
        ("Best AI Tools 2026", "/best-ai-tools-2026"),
        ("Tool Comparisons", "/tool-comparisons"),
        ("AI for Students", "/ai-tools-for-students"),
        ("Blog", "/blog/"),
    ]
)))

# Write all pages
for slug, html in PAGES:
    path = os.path.join(OUT, f"{slug}.html")
    open(path, "w").write(html)
    print(f"✓ {path} ({len(html):,} chars)")

print(f"\n✅ Generated {len(PAGES)} landing pages")
