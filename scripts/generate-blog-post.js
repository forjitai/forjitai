#!/usr/bin/env node
/* ─── Forjit AI · Daily Blog Post Generator ──────────────────────────────────
 *
 *  Runs in GitHub Actions (server-side) via .github/workflows/daily-blog.yml
 *  NEVER runs in the browser. NEVER exposes the API key.
 *
 *  Security model:
 *    ✅ GROQ_API_KEY lives ONLY in GitHub Secrets (encrypted vault)
 *    ✅ Never committed to code, never in any file in the repo
 *    ✅ Never sent to Forjit AI servers — used only in this runner
 *    ✅ Never in any URL, log line, or analytics event
 *    ✅ GitHub automatically redacts secrets from Action logs
 *
 *  What this script does:
 *    1. Determines today's topic (rotates by day of week)
 *    2. Calls Groq API (server-side, key from env var)
 *    3. Saves post as public/blog/posts/YYYY-MM-DD.json
 *    4. GitHub Actions commits the file
 *    5. Vercel auto-deploys on every commit
 *
 *  Usage (GitHub Actions only):
 *    node scripts/generate-blog-post.js
 *
 *  Required env var (set in GitHub repo Settings → Secrets):
 *    GROQ_API_KEY=gsk_...
 * ──────────────────────────────────────────────────────────────────────────*/

import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

/* ── Safety check: never run in browser ──────────────────────────────────── */
if (typeof window !== 'undefined') {
  console.error('ERROR: This script must only run server-side in GitHub Actions.');
  process.exit(1);
}

/* ── Get API key from environment (GitHub Secrets) ───────────────────────── */
const GROQ_API_KEY = process.env.GROQ_API_KEY;
if (!GROQ_API_KEY) {
  console.error('ERROR: GROQ_API_KEY environment variable not set.');
  console.error('Set it in GitHub repo → Settings → Secrets and variables → Actions');
  process.exit(1);
}

/* ── Topic rotation by day of week ──────────────────────────────────────── */
const TODAY = new Date();
const DAY_OF_WEEK = TODAY.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
const DATE_STR = TODAY.toISOString().split('T')[0]; // YYYY-MM-DD

const TOPICS = {
  0: { // Sunday — Beginner Guide
    category: 'Beginner Guide',
    tags: ['AI tools', 'beginners', 'free tools', 'India', 'how to'],
    prompt: `Write a beginner-friendly guide about one of these topics (choose the most useful):
- How to use free AI tools for the first time (no coding, no tech skills)
- How to start saving money using free online calculators
- What are open-source AI models and why they matter for privacy
- How to check your financial health in 30 minutes using free tools

Requirements:
- Written for someone who is NOT technical
- Use a relatable Indian scenario (office worker, student, homemaker)
- Include 3-5 actionable steps with specific instructions
- Link to relevant tool at forjitai.in/tools where appropriate
- End with a disclaimer section as instructed in your rules
- 600-800 words`,
  },

  1: { // Monday — Finance Deep Dive
    category: 'Finance Tips',
    tags: ['India finance', 'tax', 'investment', 'savings', 'financial planning'],
    prompt: `Write a practical, number-heavy finance article for Indian salaried employees.
Choose ONE specific topic (rotate each week):
- Tax saving strategies for FY 2025-26 with exact deduction amounts
- How to read your payslip and understand every deduction
- Step-up SIP strategy — why increasing by 10% yearly makes a huge difference
- EMI affordability rule — what % of salary should go to loans
- PPF partial withdrawal rules — year-by-year what you can take out
- Understanding EPF — your balance, interest, withdrawal rules

Requirements:
- Include actual calculations with ₹ amounts (use realistic Indian salaries)
- India-specific context (Indian banks, IT Act sections, SEBI rules)
- Mention the relevant Forjit AI calculator tool by name and URL
- Do NOT recommend specific mutual funds, stocks, or banks by name
- End with: disclaimer that this is educational, not SEBI-registered advice
- 650-850 words`,
  },

  2: { // Tuesday — Tool Spotlight
    category: 'Tool Guide',
    tags: ['free tools', 'calculator guide', 'how to use', 'forjit ai'],
    prompt: `Write a detailed "how to use" guide for ONE Forjit AI tool.
Choose from (rotate each week, do not repeat recently):
- EMI calculator with prepayment impact feature
- SIP goal-based reverse calculator
- Income tax new vs old regime comparison
- GST invoice builder
- Salary / CTC breakdown calculator
- BMI calculator with Asian thresholds
- QR code generator for UPI payments
- Word counter for LinkedIn/Twitter/resume

Requirements:
- Explain what problem this tool solves (1 paragraph)
- Step-by-step how to use it (numbered list)
- Real example with actual numbers (Indian context)
- What makes this tool different from generic calculators
- Common mistakes people make (1-2 points)
- Include the exact URL: forjitai.in/tools/[tool-name].html
- Do NOT make specific investment or medical recommendations
- End with disclaimer as instructed
- 600-750 words`,
  },

  3: { // Wednesday — AI How-To
    category: 'AI Guide',
    tags: ['AI how-to', 'prompt engineering', 'AI tools', 'productivity India'],
    prompt: `Write a practical AI how-to guide for Indian users.
Choose ONE specific use case:
- Writing a resume with AI: exact prompts that work
- Using AI to write professional emails in Indian business context
- AI for students: assignment planning, study schedules, notes
- Building a simple expense tracker using Forjit AI (no coding)
- AI for freelancers: proposals, invoices, client communication
- Meal planning with AI for an Indian family of 4

Requirements:
- Include 3-5 ACTUAL example prompts (write them out fully)
- Show what good vs bad prompts look like
- Explain why AI sometimes gets it wrong and how to fix it
- India-specific examples (Indian food names, Indian job market, etc.)
- Mention the AI accuracy disclaimer — always verify AI output
- Never suggest AI can replace professionals (doctors, lawyers, CAs)
- End with disclaimer as instructed
- 600-800 words`,
  },

  4: { // Thursday — India Specific
    category: 'India Focus',
    tags: ['India tech', 'Made in India', 'digital India', 'India specific'],
    prompt: `Write a blog post about a topic specific to India that is under-served online.
Choose ONE:
- CGPA to percentage: why different universities use different formulas
- Gratuity calculator: who qualifies, how it's calculated, tax treatment
- HRA exemption: the 3-condition rule most people miss
- Understanding Form 16 vs Form 26AS — what each one means
- Professional Tax: which states charge it and how much
- WhatsApp for business in India: setting up click-to-chat properly
- UPI QR code setup for small businesses and freelancers

Requirements:
- Deep India-specific detail (state-wise variations if applicable)
- Correct legal/regulatory references (exact section numbers)
- Practical steps an Indian user can follow today
- Link to relevant Forjit AI tool where one exists
- For any legal/tax content: "Verify with a CA or legal professional"
- Use Indian names, cities, currencies throughout
- End with disclaimer as instructed
- 650-800 words`,
  },

  5: { // Friday — Developer/Student Tools
    category: 'Developer Tools',
    tags: ['developer', 'coding tools', 'student tools', 'free tools'],
    prompt: `Write a practical guide for developers, CS students, or tech-curious people.
Choose ONE topic:
- Binary, octal, hexadecimal: when developers actually use each one
- JSON explained for non-developers — what it is, why it matters
- Base64 encoding: what it is and where you see it daily
- Password security: what makes a password truly unbreakable (with examples)
- Color formats explained: HEX vs RGB vs HSL — which to use when
- Regular expressions: 5 patterns every developer should know
- Case conventions: camelCase vs snake_case vs PascalCase — where each is used

Requirements:
- Start with a real-world scenario where this knowledge matters
- Include actual examples (real code snippets, real values)
- Explain it so a non-coder can understand
- Mention the relevant Forjit AI developer tool by URL
- Do not reproduce copyrighted code from specific projects
- End with disclaimer as instructed
- 550-750 words`,
  },

  6: { // Saturday — AI News Digest
    category: 'AI News',
    tags: ['AI news', 'AI 2025', 'open source AI', 'AI India', 'LLM news'],
    prompt: `Write an AI news digest and analysis post for Indian audiences.
Choose ONE of these angles:
- What recent AI model releases mean for free tool users
- How open-source AI is different from ChatGPT and why Indians benefit
- AI regulation in India — what the government is planning
- AI in Indian education: opportunity or threat?
- Why privacy matters when using AI tools — and how Forjit AI handles it
- AI hallucinations explained — how to spot and avoid them
- The real cost of AI tools: why free matters for Indian users

Requirements:
- Base content on established AI knowledge (your training data)
- If writing about "news" — focus on trends and context, not breaking news
  (you cannot know exact current events)
- Include Forjit AI context: we use Llama/Qwen/DeepSeek open-source models
- Our key privacy point: user keys never touch our servers, all calcs browser-side
- Balanced, factual tone — not hype, not doom
- End with disclaimer: "AI landscape changes rapidly — verify current details"
- End with the standard disclaimer section as instructed
- 600-800 words`,
  },
};


const topicConfig = TOPICS[DAY_OF_WEEK];

/* ── System prompt ──────────────────────────────────────────────────────── */
const SYSTEM = `You are a content writer for Forjit AI (forjitai.in), a free AI tools platform made in India.

Writing style:
- Clear, practical, conversational — not corporate
- Use Indian context (rupees ₹, Indian banks, Indian regulations)
- Specific numbers and examples, not vague generalities
- Short paragraphs, use headers (##), bullet points where useful
- No fluff, no filler phrases like "In today's rapidly evolving landscape"

LEGAL SAFETY RULES — follow these strictly:

1. COPYRIGHT: Write entirely in your own words. Never reproduce sentences
   from specific articles or websites. Facts and data are fine; exact phrasing is not.

2. NO INVESTMENT ADVICE: Never recommend specific stocks, mutual funds,
   ETFs, or investment products by name. You are not SEBI-registered.
   Always add: "Consult a SEBI-registered financial advisor before investing."

3. NO MEDICAL ADVICE: Never diagnose conditions or recommend treatments.
   General health information only. Always add: "Consult a registered
   medical professional for personal health decisions."

4. NO DEFAMATION: Never make negative claims about specific companies,
   banks, financial institutions, or individuals by name. Positive mentions are fine.

5. NO COMPETITOR ATTACKS: Never mention competitor websites or tools
   by name. Describe Forjit AI features positively without attacking others.

6. EXAMPLES: Use generic personas like "Rahul (age 35, Mumbai)"
   or "a salaried employee earning ₹12L". Never invent specific named
   individuals with detailed personal financial information.

7. TAX/LEGAL: For tax content, always state the financial year and add:
   "Tax rules change annually. Verify with a Chartered Accountant."

8. DISCLOSURES: End every post with a disclosure section covering:
   - Not financial/medical/legal advice
   - AI-generated — verify before use
   - Relevant professional consultation recommended

Output format:
Return ONLY valid JSON with these exact fields — no markdown fences, no extra text:
{
  "title": "Compelling blog post title (max 80 chars, include main keyword)",
  "summary": "One sentence description for the blog listing (max 160 chars)",
  "content": "Full markdown content of the post (use ## for headers, **bold**, bullet lists, include disclaimer section at end)"
}

The content field must be valid markdown. Minimum 600 words. Maximum 900 words.`;


/* ── Call Groq API ──────────────────────────────────────────────────────── */
async function generatePost() {
  console.log(`Generating post for ${DATE_STR} (${topicConfig.category})...`);

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: SYSTEM },
        { role: 'user', content: topicConfig.prompt },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Groq API error ${response.status}: ${error}`);
  }

  const data = await response.json();
  const raw = data.choices?.[0]?.message?.content || '';

  /* ── Parse the JSON response ──────────────────────────────────────────── */
  let parsed;
  try {
    // Strip any accidental markdown fences
    const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/,'').trim();
    parsed = JSON.parse(cleaned);
  } catch (e) {
    throw new Error(`Failed to parse AI response as JSON: ${e.message}\nRaw: ${raw.slice(0,200)}`);
  }

  if (!parsed.title || !parsed.content) {
    throw new Error(`Missing required fields in response: ${JSON.stringify(Object.keys(parsed))}`);
  }

  /* ── Build post object ────────────────────────────────────────────────── */
  const slug = DATE_STR + '-' + parsed.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 50);

  const post = {
    slug,
    title: parsed.title,
    date: DATE_STR,
    category: topicConfig.category,
    tags: topicConfig.tags,
    summary: parsed.summary || parsed.title,
    content: parsed.content,
    generated: true,
    model: 'llama-3.3-70b-versatile',
  };

  /* ── Write to file ────────────────────────────────────────────────────── */
  const postsDir = join(ROOT, 'public/blog/posts');
  if (!existsSync(postsDir)) mkdirSync(postsDir, { recursive: true });

  const filePath = join(postsDir, `${DATE_STR}.json`);
  writeFileSync(filePath, JSON.stringify(post, null, 2), 'utf8');

  console.log(`✅ Post saved: ${filePath}`);
  console.log(`   Title: ${post.title}`);
  console.log(`   Category: ${post.category}`);
  console.log(`   Slug: ${post.slug}`);

  return post;
}

/* ── Run ──────────────────────────────────────────────────────────────── */
generatePost()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Failed to generate post:', err.message);
    process.exit(1);
  });
