/* ─── Forjit AI · Tools Catalog ─────────────────────────────────────────────
 *
 *  Single source of truth for all tools.
 *
 *  To add a new tool:
 *    1. Create public/tools/your-tool.html
 *    2. Add one object to the TOOLS array below
 *    3. Run:  npm run gen-tools
 *    → index.html and sitemap.xml update automatically
 *
 *  Fields:
 *    slug        URL slug — must match the .html filename
 *    name        Display name
 *    desc        Short description (shown on index card)
 *    icon        Emoji icon
 *    cat         Category key — must exist in CATEGORIES
 *    tags        Search keywords (space-separated, lowercase)
 *    priority    Sitemap priority 0.0–1.0
 *    changefreq  Sitemap changefreq
 *    new         Optional — shows a "New" badge on index card
 * ──────────────────────────────────────────────────────────────────────────*/

export const BASE_URL = "https://www.forjitai.in";
export const LAST_MOD = "2026-04-26";

export const CATEGORIES = {
  finance:  { label: "Finance & Investment", color: "green",  emoji: "💰" },
  india:    { label: "India-Specific",        color: "amber",  emoji: "🇮🇳" },
  health:   { label: "Health & Fitness",      color: "blue",   emoji: "🏥" },
  utility:  { label: "Utilities",             color: "teal",   emoji: "🔧" },
  text:     { label: "Text & Writing",        color: "purple", emoji: "✍️"  },
  dev:      { label: "Developer Tools",       color: "purple", emoji: "👨‍💻" },
  teacher:  { label: "Teacher Tools",         color: "amber",  emoji: "👩‍🏫" },
  civil:    { label: "Civil Engineering",     color: "stone",  emoji: "🏗️"  },
};

export const TOOLS = [
  /* ── Finance ────────────────────────────────────────────────────────── */
  {
    slug: "emi-calculator",
    name: "EMI Calculator",
    desc: "Monthly EMI for home, car, or personal loan with full amortization schedule.",
    icon: "🏦", cat: "finance",
    tags: "emi loan home car personal monthly amortization",
    priority: 0.9, changefreq: "monthly",
  },
  {
    slug: "sip-calculator",
    name: "SIP Calculator",
    desc: "Mutual fund SIP returns, maturity amount, and year-by-year growth.",
    icon: "📈", cat: "finance",
    tags: "sip mutual fund investment returns maturity",
    priority: 0.9, changefreq: "monthly",
  },
  {
    slug: "fd-calculator",
    name: "FD Calculator",
    desc: "Fixed deposit maturity, interest earned, and bank rates comparison.",
    icon: "🏧", cat: "finance",
    tags: "fd fixed deposit interest maturity bank",
    priority: 0.8, changefreq: "monthly",
  },
  {
    slug: "rd-calculator",
    name: "RD Calculator",
    desc: "Recurring deposit maturity with monthly growth schedule.",
    icon: "💳", cat: "finance",
    tags: "rd recurring deposit monthly maturity",
    priority: 0.8, changefreq: "monthly",
  },
  {
    slug: "compound-interest-calculator",
    name: "Compound Interest",
    desc: "Compare simple vs compound interest. Rule of 72. Year-by-year growth.",
    icon: "🔄", cat: "finance",
    tags: "compound interest simple ci si formula rule 72",
    priority: 0.8, changefreq: "monthly",
  },
  {
    slug: "loan-eligibility-calculator",
    name: "Loan Eligibility",
    desc: "Max loan amount based on your salary, FOIR, and bank criteria.",
    icon: "🏠", cat: "finance",
    tags: "loan eligibility salary foir home car personal",
    priority: 0.8, changefreq: "monthly",
  },
  {
    slug: "inflation-calculator",
    name: "Inflation Calculator",
    desc: "See how inflation erodes money. Compare real vs nominal returns.",
    icon: "📉", cat: "finance",
    tags: "inflation future value purchasing power real returns",
    priority: 0.7, changefreq: "monthly",
  },
  {
    slug: "retirement-calculator",
    name: "Retirement Planner",
    desc: "Calculate retirement corpus needed, monthly SIP required, milestones.",
    icon: "🌅", cat: "finance",
    tags: "retirement corpus sip planning future",
    priority: 0.8, changefreq: "monthly",
  },
  {
    slug: "discount-calculator",
    name: "Discount Calculator",
    desc: "Calculate sale price, savings amount, and stacked discounts.",
    icon: "🏷️", cat: "finance",
    tags: "discount sale price percent off savings shopping",
    priority: 0.7, changefreq: "monthly",
  },
  {
    slug: "tip-calculator",
    name: "Tip & Bill Splitter",
    desc: "Calculate tip amount and split bills equally or unequally among friends.",
    icon: "🍽️", cat: "finance",
    tags: "tip bill split restaurant friends equal unequal",
    priority: 0.6, changefreq: "monthly",
  },

  /* ── India-specific ─────────────────────────────────────────────────── */
  {
    slug: "gst-calculator",
    name: "GST Calculator",
    desc: "Add or remove GST. All slabs (5%, 12%, 18%, 28%). CGST, SGST, IGST.",
    icon: "🧾", cat: "india",
    tags: "gst tax 5 12 18 28 percent cgst sgst igst india",
    priority: 0.9, changefreq: "monthly",
  },
  {
    slug: "income-tax-calculator",
    name: "Income Tax Calculator",
    desc: "FY 2024-25: New vs old regime comparison, slab-wise breakdown.",
    icon: "📋", cat: "india",
    tags: "income tax new old regime 2024 2025 slab india",
    priority: 0.9, changefreq: "monthly",
  },
  {
    slug: "ppf-calculator",
    name: "PPF Calculator",
    desc: "Tax-free PPF returns for 15–30 years. EEE investment year-wise table.",
    icon: "🛡️", cat: "india",
    tags: "ppf public provident fund tax free 80c ffe",
    priority: 0.8, changefreq: "monthly",
  },
  {
    slug: "salary-calculator",
    name: "Salary Calculator",
    desc: "Convert CTC to in-hand salary. PF, income tax, HRA breakdown.",
    icon: "💼", cat: "india",
    tags: "salary ctc inhand take home pf tax hra india",
    priority: 0.9, changefreq: "monthly",
  },
  {
    slug: "hra-calculator",
    name: "HRA Calculator",
    desc: "HRA tax exemption under Section 10(13A). Metro vs non-metro.",
    icon: "🏡", cat: "india",
    tags: "hra house rent allowance exemption tax section 10",
    priority: 0.7, changefreq: "monthly",
  },
  {
    slug: "gratuity-calculator",
    name: "Gratuity Calculator",
    desc: "Gratuity under Payment of Gratuity Act. Tax-free limit, step-by-step.",
    icon: "🎁", cat: "india",
    tags: "gratuity payment act employee tax free india",
    priority: 0.7, changefreq: "monthly",
  },
  {
    slug: "cgpa-calculator",
    name: "CGPA to % Calculator",
    desc: "CGPA to percentage for VTU, Anna, JNTU, Mumbai Univ, SRM and more.",
    icon: "🎓", cat: "india",
    tags: "cgpa percentage gpa vtu anna university india",
    priority: 0.8, changefreq: "monthly",
  },
  {
    slug: "qr-generator",
    name: "QR Code Generator",
    desc: "QR codes for URLs, WhatsApp, UPI payment, vCard, WiFi. PNG/SVG download.",
    icon: "📱", cat: "india",
    tags: "qr code generator url whatsapp upi vcard wifi png svg",
    priority: 0.8, changefreq: "monthly",
  },
  {
    slug: "whatsapp-link",
    name: "WhatsApp Link Generator",
    desc: "Create click-to-chat WhatsApp links with pre-filled messages.",
    icon: "💬", cat: "india",
    tags: "whatsapp link generator click chat business wame",
    priority: 0.7, changefreq: "monthly",
  },
  {
    slug: "indian-cooking-planner",
    name: "Indian Cooking Planner",
    desc: "72 authentic Indian recipes with weekly meal planner, servings adjuster, ratings and shopping list.",
    icon: "🍛", cat: "india",
    tags: "indian recipes cooking planner weekly meal plan shopping list",
    priority: 0.9, changefreq: "monthly",
    new: true,
  },
  {
    slug: "fuel-cost-calculator",
    desc: "Petrol, diesel, CNG trip cost. Compare vehicles. India fuel prices.",
    icon: "⛽", cat: "india",
    tags: "fuel petrol diesel cng trip cost mileage india",
    priority: 0.7, changefreq: "weekly",
  },

  /* ── Health ─────────────────────────────────────────────────────────── */
  {
    slug: "nursing-hub",
    name: "Nursing Toolkit",
    desc: "15 clinical tools: vasopressor/inotrope drip calculator, NG tube feeding, O2 therapy guide, drug dose, IV drip, burns TBSA, insulin scale, GCS, APGAR, paediatric dose, wound care, SBAR handover & more.",
    icon: "🩺", cat: "health",
    tags: "nursing nurse vasopressor drip dopamine noradrenaline inotrope ICU NG tube feeding calculator oxygen therapy FiO2 drug dose iv drip rate fluid balance gcs apgar paediatric burns tbsa parkland insulin sliding scale wound care sbar handover vital signs indian hospital nmc",
    priority: 0.9, changefreq: "monthly",
    new: true,
  },
  {
    slug: "bmi-calculator",
    name: "BMI Calculator",
    desc: "Body Mass Index, ideal weight, BMR, and body fat % — metric & imperial.",
    icon: "⚖️", cat: "health",
    tags: "bmi body mass index ideal weight bmr body fat",
    priority: 0.9, changefreq: "monthly",
  },
  {
    slug: "calorie-calculator",
    name: "Calorie Calculator",
    desc: "Daily calorie needs (TDEE), macros for weight loss, gain or maintenance.",
    icon: "🥗", cat: "health",
    tags: "calorie tdee bmr daily needs weight loss gain macro",
    priority: 0.8, changefreq: "monthly",
  },
  {
    slug: "water-intake",
    name: "Water Intake Calculator",
    desc: "Daily water requirement based on weight, activity level and climate.",
    icon: "💧", cat: "health",
    tags: "water intake daily hydration requirement activity",
    priority: 0.7, changefreq: "monthly",
  },
  {
    slug: "ideal-weight",
    name: "Ideal Weight Calculator",
    desc: "Ideal body weight using 5 formulas: Robinson, Miller, Hamwi, Devine.",
    icon: "🎯", cat: "health",
    tags: "ideal weight healthy body formula robinson miller hamwi",
    priority: 0.7, changefreq: "monthly",
  },
  {
    slug: "age-calculator",
    name: "Age Calculator",
    desc: "Exact age in years/months/days, birthday countdown, zodiac sign.",
    icon: "🎂", cat: "health",
    tags: "age birthday countdown zodiac exact years months days",
    priority: 0.8, changefreq: "monthly",
  },

  /* ── Utility ────────────────────────────────────────────────────────── */
  {
    slug: "unit-converter",
    name: "Unit Converter",
    desc: "Convert length, weight, temperature, area, volume, speed, data.",
    icon: "📐", cat: "utility",
    tags: "unit convert length weight temperature area volume speed",
    priority: 0.8, changefreq: "monthly",
  },
  {
    slug: "percentage-calculator",
    name: "Percentage Calculator",
    desc: "4 types: X% of Y, X is what% of Y, % change, increase/decrease.",
    icon: "〒", cat: "utility",
    tags: "percentage percent of change increase decrease",
    priority: 0.8, changefreq: "monthly",
  },
  {
    slug: "date-calculator",
    name: "Date Calculator",
    desc: "Difference between dates, add/subtract days, business days counter.",
    icon: "📅", cat: "utility",
    tags: "date difference add subtract business days calendar",
    priority: 0.7, changefreq: "monthly",
  },
  {
    slug: "speed-distance-time",
    name: "Speed Distance Time",
    desc: "Solve for speed, distance, or time. All unit conversions included.",
    icon: "🚗", cat: "utility",
    tags: "speed distance time sdt physics velocity",
    priority: 0.6, changefreq: "monthly",
  },
  {
    slug: "scientific-calculator",
    name: "Scientific Calculator",
    desc: "Full scientific calculator with trig, log, history. Keyboard support.",
    icon: "🔢", cat: "utility",
    tags: "scientific calculator sin cos tan log power keyboard",
    priority: 0.7, changefreq: "monthly",
  },
  {
    slug: "stopwatch-timer",
    name: "Stopwatch & Timer",
    desc: "Stopwatch with laps, countdown timer, Pomodoro focus timer.",
    icon: "⏱️", cat: "utility",
    tags: "stopwatch timer countdown pomodoro laps",
    priority: 0.7, changefreq: "monthly",
  },
  {
    slug: "random-generator",
    name: "Random Generator",
    desc: "Random numbers, strings, dice roller, coin flip, random list picker.",
    icon: "🎲", cat: "utility",
    tags: "random number string dice coin flip list picker",
    priority: 0.6, changefreq: "monthly",
  },
  {
    slug: "password-generator",
    name: "Password Generator",
    desc: "Strong random passwords with strength checker and bulk generation.",
    icon: "🔐", cat: "utility",
    tags: "password generator strong secure random bulk",
    priority: 0.7, changefreq: "monthly",
  },
  {
    slug: "color-converter",
    name: "Color Converter",
    desc: "HEX ↔ RGB ↔ HSL ↔ CMYK. Sliders, shades palette, named colors.",
    icon: "🎨", cat: "utility",
    tags: "color hex rgb hsl cmyk picker converter palette",
    priority: 0.7, changefreq: "monthly",
  },
  {
    slug: "roman-numeral",
    name: "Roman Numerals",
    desc: "Convert numbers to/from Roman numerals with step-by-step explanation.",
    icon: "🏛️", cat: "utility",
    tags: "roman numeral convert decimal number",
    priority: 0.6, changefreq: "monthly",
  },

  /* ── Text ───────────────────────────────────────────────────────────── */
  {
    slug: "word-counter",
    name: "Word Counter",
    desc: "Words, characters, sentences, reading time, word frequency analysis.",
    icon: "📝", cat: "text",
    tags: "word counter character sentence reading time frequency",
    priority: 0.8, changefreq: "monthly",
  },
  {
    slug: "case-converter",
    name: "Case Converter",
    desc: "UPPERCASE, lowercase, Title, camelCase, snake_case, kebab-case, PascalCase.",
    icon: "🔡", cat: "text",
    tags: "case convert upper lower title camel snake kebab pascal",
    priority: 0.7, changefreq: "monthly",
  },
  {
    slug: "lorem-ipsum",
    name: "Lorem Ipsum Generator",
    desc: "Placeholder text by words, sentences, or paragraphs. Indian names too.",
    icon: "📄", cat: "text",
    tags: "lorem ipsum placeholder dummy text generator",
    priority: 0.6, changefreq: "monthly",
  },

  /* ── Developer ──────────────────────────────────────────────────────── */
  {
    slug: "base64-encoder",
    name: "Base64 Encoder",
    desc: "Encode/decode Base64, URLs, HTML entities. Encode images to Base64.",
    icon: "🔢", cat: "dev",
    tags: "base64 encode decode url html entities image",
    priority: 0.7, changefreq: "monthly",
  },
  {
    slug: "number-converter",
    name: "Number System Converter",
    desc: "Binary ↔ Decimal ↔ Octal ↔ Hexadecimal with step-by-step breakdown.",
    icon: "💻", cat: "dev",
    tags: "binary decimal octal hex number system converter",
    priority: 0.7, changefreq: "monthly",
  },
  {
    slug: "json-formatter",
    name: "JSON Formatter",
    desc: "Beautify, validate, minify JSON. Syntax highlighting and statistics.",
    icon: "🗂️", cat: "dev",
    tags: "json formatter beautifier validator minifier",
    priority: 0.7, changefreq: "monthly",
  },

  /* ── Teacher Tools ────────────────────────────────────────────────── */
  {
    slug: "teacher/lesson-plan-generator",
    name: "Lesson Plan Generator",
    desc: "Generate complete CBSE/ICSE lesson plans for any subject and class in seconds.",
    icon: "📋", cat: "teacher",
    tags: "lesson plan generator teacher CBSE ICSE free India",
    priority: 0.95, changefreq: "monthly", new: true,
  },
  {
    slug: "teacher/mcq-maker",
    name: "MCQ Question Paper Maker",
    desc: "Auto-generate multiple choice questions with answers for any subject and topic.",
    icon: "✅", cat: "teacher",
    tags: "MCQ maker quiz generator teacher questions answers",
    priority: 0.95, changefreq: "monthly", new: true,
  },
  {
    slug: "teacher/assignment-generator",
    name: "Assignment Question Generator",
    desc: "Generate short, long, and case-based assignment questions for any topic.",
    icon: "📄", cat: "teacher",
    tags: "assignment generator teacher question paper maker",
    priority: 0.9, changefreq: "monthly", new: true,
  },
  {
    slug: "teacher/progress-report-comments",
    name: "Progress Report Comment Generator",
    desc: "Generate personalised student progress report comments for any performance level.",
    icon: "💬", cat: "teacher",
    tags: "progress report comments teacher student report card",
    priority: 0.9, changefreq: "monthly", new: true,
  },
  {
    slug: "teacher/parent-letter-generator",
    name: "Parent Communication Letter",
    desc: "Generate professional letters to parents for meetings, behaviour, or updates.",
    icon: "✉️", cat: "teacher",
    tags: "parent letter teacher PTM communication school",
    priority: 0.88, changefreq: "monthly", new: true,
  },
  {
    slug: "teacher/blooms-taxonomy-questions",
    name: "Bloom's Taxonomy Questions",
    desc: "Generate questions at all 6 levels of Bloom's Taxonomy for any topic.",
    icon: "🧠", cat: "teacher",
    tags: "blooms taxonomy questions HOTS higher order thinking",
    priority: 0.88, changefreq: "monthly", new: true,
  },
  {
    slug: "teacher/rubric-maker",
    name: "Grading Rubric Maker",
    desc: "Create detailed grading rubrics for assignments, projects, and presentations.",
    icon: "📊", cat: "teacher",
    tags: "rubric maker grading criteria teacher assessment",
    priority: 0.85, changefreq: "monthly", new: true,
  },
  {
    slug: "teacher/physics-lesson-plan",
    name: "Physics Lesson Plan Generator",
    desc: "Generate detailed physics lesson plans with experiments for CBSE/ICSE.",
    icon: "⚛️", cat: "teacher",
    tags: "physics lesson plan CBSE Class 10 11 12 teacher",
    priority: 0.88, changefreq: "monthly", new: true,
  },
  {
    slug: "teacher/hindi-essay-writer",
    name: "Hindi Essay Writer (हिंदी निबंध)",
    desc: "हिंदी में किसी भी विषय पर निबंध बनाएं — CBSE और State Board के लिए।",
    icon: "🇮🇳", cat: "teacher",
    tags: "hindi essay writer nibandh CBSE teacher free India",
    priority: 0.88, changefreq: "monthly", new: true,
  },
  {
    slug: "teacher/hindi-patra-lekhan",
    name: "Hindi Patra Lekhan (पत्र लेखन)",
    desc: "Formal and informal Hindi letter generator for Class 6-12.",
    icon: "📮", cat: "teacher",
    tags: "hindi patra lekhan letter formal informal CBSE",
    priority: 0.88, changefreq: "monthly", new: true,
  },
  {
    slug: "teacher/research-abstract-writer",
    name: "Research Abstract Writer",
    desc: "Write structured academic abstracts for research papers in any discipline.",
    icon: "🎓", cat: "teacher",
    tags: "research abstract writer college lecturer academic",
    priority: 0.85, changefreq: "monthly", new: true,
  },
  {
    slug: "teacher/lecture-notes-maker",
    name: "Lecture Notes Maker",
    desc: "Convert any topic into well-structured lecture notes with examples.",
    icon: "📓", cat: "teacher",
    tags: "lecture notes maker college lecturer topic notes",
    priority: 0.85, changefreq: "monthly", new: true,
  },
  {
    slug: "teacher/viva-question-generator",
    name: "Viva Question Generator",
    desc: "Generate viva voce questions with expected answers for practicals.",
    icon: "🎤", cat: "teacher",
    tags: "viva questions practical exam teacher college India",
    priority: 0.82, changefreq: "monthly", new: true,
  },
  /* ── Civil Engineering ───────────────────────────────────────────────── */
  {
    slug: "concrete-mix-calculator",
    name: "Concrete Mix Calculator",
    desc: "Calculate cement, sand, aggregate & water for M15–M40 grade concrete as per IS 10262:2019 & IS 456:2000.",
    icon: "🏗️", cat: "civil",
    tags: "concrete mix design M20 M25 cement sand aggregate water cement ratio IS 10262 civil engineering",
    priority: 0.90, changefreq: "monthly", new: true,
  },
];
