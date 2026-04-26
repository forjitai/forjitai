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
];
