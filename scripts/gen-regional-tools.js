#!/usr/bin/env node
/* ─── Auto-generate Regional Language Tools ──────────────────────────────
 *
 *  Generates 5 tools × 10 languages = 50 tool configs
 *  and appends them to teacher-tools.js
 *
 *  Run: node scripts/gen-regional-tools.js
 * ──────────────────────────────────────────────────────────────────────── */
import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const FILE = join(__dirname, "../src/data/teacher-tools.js");

/* ── Language definitions ─────────────────────────────────────────────── */
const LANGUAGES = [
  {
    id: "tamil",
    name: "Tamil",
    native: "தமிழ்",
    script: "Tamil script",
    state: "Tamil Nadu",
    board: "TNBSE",
    essay_placeholder: "e.g. என் தாய்நாடு, சுற்றுச்சூழல், தீபாவளி",
    letter_placeholder: "e.g. விடுமுறை கேட்டு, புகார் கடிதம்",
    grammar_placeholder: "e.g. வினைச்சொல், பெயர்ச்சொல், வேற்றுமை",
  },
  {
    id: "telugu",
    name: "Telugu",
    native: "తెలుగు",
    script: "Telugu script",
    state: "Andhra Pradesh / Telangana",
    board: "BSEAP / BSETS",
    essay_placeholder: "e.g. నా దేశం, పర్యావరణం, దీపావళి",
    letter_placeholder: "e.g. సెలవు కోసం, ఫిర్యాదు లేఖ",
    grammar_placeholder: "e.g. క్రియ, నామవాచకం, విభక్తి",
  },
  {
    id: "kannada",
    name: "Kannada",
    native: "ಕನ್ನಡ",
    script: "Kannada script",
    state: "Karnataka",
    board: "KSEEB",
    essay_placeholder: "e.g. ನನ್ನ ದೇಶ, ಪರಿಸರ, ದೀಪಾವಳಿ",
    letter_placeholder: "e.g. ರಜೆ ಕೋರಿ, ದೂರು ಪತ್ರ",
    grammar_placeholder: "e.g. ಕ್ರಿಯಾಪದ, ನಾಮಪದ, ವಿಭಕ್ತಿ",
  },
  {
    id: "malayalam",
    name: "Malayalam",
    native: "മലയാളം",
    script: "Malayalam script",
    state: "Kerala",
    board: "SCERT Kerala",
    essay_placeholder: "e.g. എൻ്റെ നാട്, പരിസ്ഥിതി, ദീപാവലി",
    letter_placeholder: "e.g. അവധിക്ക് അപേക്ഷ, പരാതി കത്ത്",
    grammar_placeholder: "e.g. ക്രിയ, നാമം, വിഭക്തി",
  },
  {
    id: "marathi",
    name: "Marathi",
    native: "मराठी",
    script: "Devanagari (Marathi)",
    state: "Maharashtra",
    board: "Maharashtra SSC/HSC",
    essay_placeholder: "e.g. माझा देश, पर्यावरण, दिवाळी",
    letter_placeholder: "e.g. रजा मागणी, तक्रार पत्र",
    grammar_placeholder: "e.g. क्रियापद, नाम, विभक्ती",
  },
  {
    id: "bengali",
    name: "Bengali",
    native: "বাংলা",
    script: "Bengali script",
    state: "West Bengal",
    board: "WBBSE / WBCHSE",
    essay_placeholder: "e.g. আমার দেশ, পরিবেশ, দীপাবলি",
    letter_placeholder: "e.g. ছুটির আবেদন, অভিযোগ পত্র",
    grammar_placeholder: "e.g. ক্রিয়া, বিশেষ্য, কারক",
  },
  {
    id: "gujarati",
    name: "Gujarati",
    native: "ગુજરાતી",
    script: "Gujarati script",
    state: "Gujarat",
    board: "GSEB",
    essay_placeholder: "e.g. મારો દેશ, પર્યાવરણ, દીવાળી",
    letter_placeholder: "e.g. રજા માટે અરજી, ફરિયાદ પત્ર",
    grammar_placeholder: "e.g. ક્રિયાપદ, નામ, વિભક્તિ",
  },
  {
    id: "punjabi",
    name: "Punjabi",
    native: "ਪੰਜਾਬੀ",
    script: "Gurmukhi script",
    state: "Punjab",
    board: "PSEB",
    essay_placeholder: "e.g. ਮੇਰਾ ਦੇਸ਼, ਵਾਤਾਵਰਣ, ਦੀਵਾਲੀ",
    letter_placeholder: "e.g. ਛੁੱਟੀ ਲਈ ਅਰਜ਼ੀ, ਸ਼ਿਕਾਇਤ ਪੱਤਰ",
    grammar_placeholder: "e.g. ਕ੍ਰਿਆ, ਨਾਂਵ, ਕਾਰਕ",
  },
  {
    id: "odia",
    name: "Odia",
    native: "ଓଡ଼ିଆ",
    script: "Odia script",
    state: "Odisha",
    board: "BSE Odisha",
    essay_placeholder: "e.g. ମୋ ଦେଶ, ପରିବେଶ, ଦୀପାବଳି",
    letter_placeholder: "e.g. ଛୁଟି ଆବେଦନ, ଅଭିଯୋଗ ପତ୍ର",
    grammar_placeholder: "e.g. ক্রিয়া, নাম, বিভক্তি",
  },
  {
    id: "urdu",
    name: "Urdu",
    native: "اردو",
    script: "Nastaliq (Urdu script)",
    state: "J&K / UP / National",
    board: "JKBOSE / UPMSP / CBSE Urdu",
    essay_placeholder: "e.g. میرا وطن, ماحولیات, عید",
    letter_placeholder: "e.g. چھٹی کی درخواست, شکایتی خط",
    grammar_placeholder: "e.g. فعل, اسم, ضمیر",
  },
];

/* ── 5 tool templates per language ─────────────────────────────────────── */
function generateTools(lang) {
  return [

    /* 1. Essay Writer */
    {
      id: `${lang.id}-essay-writer`,
      name: `${lang.name} Essay Writer (${lang.native} निबंध)`,
      desc: `Write ${lang.name} essays on any topic for school and college students.`,
      icon: "✍️",
      category: "language",
      subCategory: lang.id,
      audience: "teacher",
      model: "smart",
      maxTokens: 600,
      inputs: [
        { id: "topic", label: `Essay Topic (${lang.native})`, type: "text", placeholder: lang.essay_placeholder, required: true },
        { id: "class", label: "Class / Level", type: "select", options: ["__LEVELS__"] },
        { id: "wordCount", label: "Word Count", type: "select", options: ["100-150 words","200-250 words","300-350 words","400-500 words"] },
      ],
      promptTemplate: `Write a complete ${lang.name} essay.
Topic: {{topic}} | Level: {{class}} | Length: {{wordCount}}
Write entirely in ${lang.name} (${lang.script}).
Structure: Introduction → Main body (2-3 paragraphs) → Conclusion.
Simple, correct ${lang.name}. Appropriate for {{class}} level. ${lang.board} curriculum.`,
      seoTitle: `Free ${lang.name} Essay Writer for Teachers | ${lang.native} निबंध | Forjit AI`,
      seoDesc: `Generate ${lang.name} essays for any topic. Free tool for ${lang.name} teachers. ${lang.board} aligned. Class 1-12 and college.`,
      seoKeywords: [`${lang.id} essay writer free India`, `${lang.name} nibandh generator`, `${lang.id} essay maker teacher`],
      faqs: [
        { q: `Is the essay written in ${lang.name}?`, a: `Yes. Completely in ${lang.name} (${lang.script}).` },
        { q: `Which board is it aligned to?`, a: `${lang.board} and national curriculum.` },
        { q: `Can I set the word count?`, a: `Yes. 100 to 500 words.` },
        { q: `Is it useful for all classes?`, a: `Yes. Class 1 to PhD level.` },
        { q: `Is it free?`, a: `Completely free.` },
      ],
      priority: 0.86,
    },

    /* 2. Letter Writer */
    {
      id: `${lang.id}-letter-writer`,
      name: `${lang.name} Letter Writer (${lang.native} पत्र लेखन)`,
      desc: `Generate formal and informal ${lang.name} letters for students and teachers.`,
      icon: "📮",
      category: "language",
      subCategory: lang.id,
      audience: "teacher",
      model: "fast",
      maxTokens: 450,
      inputs: [
        { id: "type", label: "Letter Type", type: "select", options: ["Formal Letter","Informal Letter","Application Letter","Complaint Letter","Invitation Letter"] },
        { id: "topic", label: `Purpose (${lang.native})`, type: "text", placeholder: lang.letter_placeholder, required: true },
        { id: "class", label: "Class / Level", type: "select", options: ["__LEVELS__"] },
      ],
      promptTemplate: `Write a {{type}} in ${lang.name}.
Purpose: {{topic}} | Level: {{class}}
Write completely in ${lang.name} (${lang.script}).
Use correct letter format: address, date, salutation, body, closing, signature.
${lang.board} exam format. Appropriate language for {{class}} level.`,
      seoTitle: `Free ${lang.name} Letter Writer for Teachers | ${lang.native} पत्र | Forjit AI`,
      seoDesc: `Generate ${lang.name} formal and informal letters. Free tool for ${lang.name} teachers and students. ${lang.board} format.`,
      seoKeywords: [`${lang.id} letter writer free`, `${lang.name} patra lekhan tool`, `${lang.id} formal letter generator India`],
      faqs: [
        { q: `What letter types are available?`, a: `Formal, informal, application, complaint, and invitation letters.` },
        { q: `Is the format correct?`, a: `Yes. Correct ${lang.name} letter format for ${lang.board} exams.` },
        { q: `Is it written in ${lang.name}?`, a: `Yes. Entirely in ${lang.name} script.` },
        { q: `Is it exam ready?`, a: `Yes. Follows ${lang.board} exam pattern.` },
        { q: `Is it free?`, a: `Completely free.` },
      ],
      priority: 0.85,
    },

    /* 3. Grammar Explainer */
    {
      id: `${lang.id}-grammar-explainer`,
      name: `${lang.name} Grammar Explainer (${lang.native} व्याकरण)`,
      desc: `Explain ${lang.name} grammar topics with rules, examples, and exercises.`,
      icon: "📖",
      category: "language",
      subCategory: lang.id,
      audience: "teacher",
      model: "smart",
      maxTokens: 500,
      inputs: [
        { id: "topic", label: `Grammar Topic (${lang.native})`, type: "text", placeholder: lang.grammar_placeholder, required: true },
        { id: "class", label: "Class / Level", type: "select", options: ["__LEVELS__"] },
      ],
      promptTemplate: `Explain this ${lang.name} grammar topic.
Topic: {{topic}} | Level: {{class}}
Provide in BOTH ${lang.name} and English:
1. DEFINITION / RULE (in ${lang.name})
2. TYPES (if any)
3. EXAMPLES (5 examples in ${lang.name} with English meaning)
4. PRACTICE EXERCISE (5 sentences to fill/identify)
5. COMMON MISTAKES students make
Clear, student-friendly. ${lang.board} curriculum.`,
      seoTitle: `Free ${lang.name} Grammar Explainer for Teachers | Forjit AI`,
      seoDesc: `Explain ${lang.name} grammar topics with rules and examples. Free tool for ${lang.name} teachers. ${lang.board} aligned.`,
      seoKeywords: [`${lang.id} grammar explainer free`, `${lang.name} vyakaran tool teacher`, `${lang.id} grammar rules examples India`],
      faqs: [
        { q: `Is explanation in both ${lang.name} and English?`, a: `Yes. Definition in ${lang.name}, with English meanings for examples.` },
        { q: `Are exercises included?`, a: `Yes. 5 practice exercises are included.` },
        { q: `What grammar topics are covered?`, a: `All ${lang.name} grammar topics — parts of speech, tenses, sentence types, and more.` },
        { q: `Is it ${lang.board} aligned?`, a: `Yes. Follows ${lang.board} grammar curriculum.` },
        { q: `Is it free?`, a: `Completely free.` },
      ],
      priority: 0.84,
    },

    /* 4. Translation Helper */
    {
      id: `${lang.id}-translation-helper`,
      name: `${lang.name} ↔ English Translation Helper`,
      desc: `Translate between ${lang.name} and English with explanations for teachers and students.`,
      icon: "🔄",
      category: "language",
      subCategory: lang.id,
      audience: "teacher",
      model: "fast",
      maxTokens: 400,
      inputs: [
        { id: "text", label: "Text to Translate", type: "textarea", placeholder: `Type in ${lang.name} or English…`, required: true, rows: 3 },
        { id: "direction", label: "Direction", type: "select", options: [`${lang.name} → English`, `English → ${lang.name}`] },
        { id: "class", label: "Class / Level", type: "select", options: ["__LEVELS__"] },
      ],
      promptTemplate: `Translate this text. Direction: {{direction}} | Level: {{class}}
Text: {{text}}
Provide:
1. TRANSLATION (accurate, natural)
2. WORD-BY-WORD breakdown (key words explained)
3. NOTES (any idioms, cultural context, or grammar points)
Keep language level appropriate for {{class}}.`,
      seoTitle: `Free ${lang.name} English Translation Helper for Teachers | Forjit AI`,
      seoDesc: `Translate between ${lang.name} and English with word-by-word explanation. Free tool for ${lang.name} teachers and students.`,
      seoKeywords: [`${lang.id} english translation free India`, `${lang.name} translator teacher tool`, `${lang.id} to english translator`],
      faqs: [
        { q: `Does it work both ways?`, a: `Yes. ${lang.name} to English and English to ${lang.name}.` },
        { q: `Is word-by-word breakdown included?`, a: `Yes. Key words are explained individually.` },
        { q: `Is cultural context explained?`, a: `Yes. Idioms and cultural notes are included where relevant.` },
        { q: `Is it suitable for all levels?`, a: `Yes. From Class 1 to PhD level translations.` },
        { q: `Is it free?`, a: `Completely free.` },
      ],
      priority: 0.83,
    },

    /* 5. MCQ Maker */
    {
      id: `${lang.id}-mcq-maker`,
      name: `${lang.name} Language MCQ Maker`,
      desc: `Generate ${lang.name} language MCQs for grammar, comprehension, and vocabulary.`,
      icon: "✅",
      category: "language",
      subCategory: lang.id,
      audience: "teacher",
      model: "smart",
      maxTokens: 550,
      inputs: [
        { id: "topic", label: `${lang.name} Topic`, type: "text", placeholder: `e.g. Grammar, Vocabulary, Comprehension, Literature`, required: true },
        { id: "class", label: "Class / Level", type: "select", options: ["__LEVELS__"] },
        { id: "count", label: "Number of MCQs", type: "select", options: ["5","10","15","20"] },
      ],
      promptTemplate: `Generate {{count}} ${lang.name} language MCQs.
Topic: {{topic}} | Level: {{class}}
Write questions in ${lang.name} (${lang.script}).
Format: Q[N]. [question in ${lang.name}]
A) B) C) D)
Answer: X
Include grammar, vocabulary, and usage questions. ${lang.board} curriculum.`,
      seoTitle: `Free ${lang.name} MCQ Maker for Teachers | Forjit AI`,
      seoDesc: `Generate ${lang.name} language MCQs for grammar, vocabulary, comprehension. Free tool for ${lang.name} teachers. ${lang.board} aligned.`,
      seoKeywords: [`${lang.id} MCQ generator teacher India`, `${lang.name} language quiz maker free`, `${lang.id} grammar MCQ CBSE`],
      faqs: [
        { q: `Are questions written in ${lang.name}?`, a: `Yes. All questions are in ${lang.name} script.` },
        { q: `What topics are covered?`, a: `Grammar, vocabulary, comprehension, and literature.` },
        { q: `Is it ${lang.board} aligned?`, a: `Yes. Follows ${lang.board} language curriculum.` },
        { q: `How many MCQs can I generate?`, a: `5 to 20 MCQs per session.` },
        { q: `Is it free?`, a: `Completely free.` },
      ],
      priority: 0.83,
    },

  ];
}

/* ── Build all tool configs ─────────────────────────────────────────────── */
const allTools = LANGUAGES.flatMap(lang => generateTools(lang));

/* ── Serialize to JS object notation ─────────────────────────────────────
 *  We write raw JS (not JSON) to match the existing file format
 * ──────────────────────────────────────────────────────────────────────── */
function serializeOptions(opts) {
  // opts is ["__LEVELS__"] placeholder — we write the actual level array
  if (opts[0] === "__LEVELS__") {
    const LEVELS = [
      "Class 1","Class 2","Class 3","Class 4","Class 5",
      "Class 6","Class 7","Class 8","Class 9","Class 10",
      "Class 11","Class 12",
      "Diploma / Certificate","ITI / Vocational",
      "UG Year 1 (FY)","UG Year 2 (SY)","UG Year 3 (TY)","UG Year 4 (Final)",
      "B.A.","B.Sc.","B.Com.","BBA","BCA","B.Tech / BE",
      "B.Ed","BDS","MBBS","BPT","B.Pharm","LLB","B.Arch",
      "B.Design / B.FTech","B.Sc Nursing","BHMCT (Hotel Mgmt)",
      "PG Year 1","PG Year 2",
      "M.A.","M.Sc.","M.Com.","MBA","MCA","M.Tech / ME",
      "M.Ed","MD / MS (Medical)","LLM","M.Arch","M.Design",
      "M.Sc Nursing","MHMCT",
      "M.Phil","PhD / Doctorate","Post-Doctoral",
      "UPSC / Competitive Exams","Professional Training",
    ];
    return JSON.stringify(LEVELS);
  }
  return JSON.stringify(opts);
}

function serializeTool(t) {
  const inputs = t.inputs.map(inp => {
    let s = `      { id: "${inp.id}", label: "${inp.label}", type: "${inp.type}"`;
    if (inp.placeholder) s += `, placeholder: "${inp.placeholder.replace(/"/g,"'")}"`;
    if (inp.options)     s += `, options: ${serializeOptions(inp.options)}`;
    if (inp.required === false) s += `, required: false`;
    if (inp.rows)        s += `, rows: ${inp.rows}`;
    s += ` }`;
    return s;
  }).join(",\n");

  const faqs = t.faqs.map(f =>
    `      { q: "${f.q.replace(/"/g,"'")}", a: "${f.a.replace(/"/g,"'")}" }`
  ).join(",\n");

  const keywords = t.seoKeywords.map(k => `"${k}"`).join(",");

  return `
  {
    id: "${t.id}",
    name: "${t.name.replace(/"/g,"'")}",
    desc: "${t.desc.replace(/"/g,"'")}",
    icon: "${t.icon}", category: "${t.category}", subCategory: "${t.subCategory}",
    audience: "${t.audience}", model: "${t.model}", maxTokens: ${t.maxTokens},
    inputs: [
${inputs}
    ],
    promptTemplate: \`${t.promptTemplate.replace(/`/g,"'")}\`,
    seoTitle: "${t.seoTitle.replace(/"/g,"'")}",
    seoDesc: "${t.seoDesc.replace(/"/g,"'")}",
    seoKeywords: [${keywords}],
    faqs: [
${faqs}
    ],
    priority: ${t.priority},
  },`;
}

/* ── Append to teacher-tools.js ─────────────────────────────────────────── */
let content = readFileSync(FILE, "utf8");

// Remove closing ]; and replace with new tools + ];
const MARKER = "\n];\n";
const insertPoint = content.lastIndexOf(MARKER);
if (insertPoint === -1) {
  console.error("Could not find closing ]; in teacher-tools.js");
  process.exit(1);
}

const header = `\n\n  /* ${"═".repeat(68)}\n     REGIONAL LANGUAGE TOOLS — Auto-generated\n     ${allTools.length} tools across ${LANGUAGES.length} languages\n  ${"═".repeat(68)} */`;

const newTools = header + allTools.map(serializeTool).join("");
content = content.slice(0, insertPoint) + newTools + MARKER;

writeFileSync(FILE, content, "utf8");
console.log(`✅ Added ${allTools.length} regional language tools (${LANGUAGES.length} languages × 5 tools)`);
console.log(`   Languages: ${LANGUAGES.map(l => l.name).join(", ")}`);
