/* ─── Forjit AI · Constants ─────────────────────────────────────────────────
 *
 *  Single source of truth for:
 *    – App identity
 *    – LLM provider + model config
 *    – Tab + sub-type definitions
 *    – All AI system prompts
 *
 *  To add a new provider:   add entry to PROVIDERS
 *  To add a new model:      add to providers[x].models
 *  To add a planner type:   add to PLANNER_TYPES
 *  To add a doc type:       add to DOC_TYPES
 *  To tweak any AI prompt:  edit the relevant PROMPT constant below
 * ──────────────────────────────────────────────────────────────────────────*/

/* ── App identity ──────────────────────────────────────────────────────── */
export const APP_NAME = "Forjit AI";
export const APP_TAG  = "initial phase · experimental";
export const APP_URL  = "https://www.forjitai.in";

/* ── Admin ──────────────────────────────────────────────────────────────── */
export const ADMIN_EMAIL = "forjitai@gmail.com";

/* ── LLM Providers ──────────────────────────────────────────────────────── */
export const PROVIDERS = {
  groq: {
    name:     "Groq",
    endpoint: "https://api.groq.com/openai/v1/chat/completions",
    keyUrl:   "https://console.groq.com/keys",
    blurb:    "Fast · free tier",
    models: [
      { id: "llama-3.3-70b-versatile",        label: "Llama 3.3 70B",   note: "strong all-rounder" },
      { id: "llama-3.1-8b-instant",            label: "Llama 3.1 8B",   note: "fastest"            },
      { id: "qwen/qwen3-32b",                  label: "Qwen 3 32B",      note: "good for code"      },
      { id: "deepseek-r1-distill-llama-70b",   label: "DeepSeek R1 70B", note: "reasoning"          },
    ],
  },
  openrouter: {
    name:     "OpenRouter",
    endpoint: "https://openrouter.ai/api/v1/chat/completions",
    keyUrl:   "https://openrouter.ai/keys",
    blurb:    "Hundreds of models",
    models: [
      { id: "meta-llama/llama-3.3-70b-instruct:free", label: "Llama 3.3 70B (free)"   },
      { id: "qwen/qwen3-coder:free",                   label: "Qwen 3 Coder (free)"    },
      { id: "deepseek/deepseek-chat-v3.1:free",        label: "DeepSeek V3.1 (free)"   },
      { id: "mistralai/mistral-small-3.2-24b-instruct:free", label: "Mistral Small (free)" },
    ],
  },
};

/* ── Main tabs ──────────────────────────────────────────────────────────── */
export const TABS = {
  app: {
    label:       "Create App",
    icon:        "Code2",
    color:       "amber",
    description: "Web & mobile apps from a prompt",
  },
  content: {
    label:       "Create Content",
    icon:        "Wand2",
    color:       "violet",
    description: "Lesson plans, sermons, blogs, notes — AI-powered content",
  },
  planner: {
    label:       "Life Planner",
    icon:        "Calendar",
    color:       "emerald",
    description: "Meal plans, recipes, workouts, diaries — with storage",
  },
  document: {
    label:       "Documents",
    icon:        "FileText",
    color:       "sky",
    description: "Resumes, reports, letters — download as PDF/DOCX/PPTX",
  },
};

/* ── Planner sub-types ──────────────────────────────────────────────────── */
export const PLANNER_TYPES = {
  meal_week: {
    label:       "Weekly Meal Plan",
    icon:        "UtensilsCrossed",
    placeholder: "Vegetarian Indian meal plan for 1 week, 1800 kcal/day, 4 people",
  },
  meal_month: {
    label:       "Monthly Meal Plan",
    icon:        "Calendar",
    placeholder: "30-day meal plan, high protein, Indian + continental mix",
  },
  recipe: {
    label:       "Recipe",
    icon:        "ChefHat",
    placeholder: "Paneer butter masala for 4 people",
  },
  workout_week: {
    label:       "Weekly Workout Plan",
    icon:        "Dumbbell",
    placeholder: "Beginner home workout, 30 min/day, weight loss focus",
  },
  workout_month: {
    label:       "Monthly Workout Plan",
    icon:        "Dumbbell",
    placeholder: "30-day beginner-to-intermediate gym plan, 5 days/week",
  },
  diary: {
    label:       "Daily Diary / Journal",
    icon:        "NotebookPen",
    placeholder: "Personal gratitude journal with mood tracking and prompts",
  },
};

/* ── Document sub-types ─────────────────────────────────────────────────── */
export const DOC_TYPES = {
  resume_pdf: {
    label:       "Resume (PDF)",
    icon:        "FileText",
    format:      "pdf",
    placeholder: "Software engineer, 3 years at Infosys, skilled in Java/React, seeking senior role",
  },
  resume_docx: {
    label:       "Resume (DOCX)",
    icon:        "FileText",
    format:      "docx",
    placeholder: "Senior marketing manager, 8 years, led 50+ campaigns, seeking director role",
  },
  cover_letter: {
    label:       "Cover Letter",
    icon:        "Mail",
    format:      "docx",
    placeholder: "Cover letter for senior product manager role at Zoho",
  },
  report: {
    label:       "Business Report (PDF)",
    icon:        "FileText",
    format:      "pdf",
    placeholder: "Q4 sales report for a retail company, include trends and recommendations",
  },
  presentation: {
    label:       "Presentation (PPTX)",
    icon:        "Layers",
    format:      "pptx",
    placeholder: "10-slide pitch deck for an AI startup raising seed round",
  },
  letter: {
    label:       "Formal Letter",
    icon:        "Mail",
    format:      "docx",
    placeholder: "Leave application to manager for 10 days",
  },
};

/* ── System prompts ─────────────────────────────────────────────────────────
 *  Edit these to change AI behaviour.
 *  Keep them here — never inline in component files.
 * ──────────────────────────────────────────────────────────────────────────*/

export const APP_SYSTEM_PROMPT = `You are an expert frontend engineer and designer. Produce a COMPLETE, self-contained single HTML file.

STRICT RULES:
1. Return ONLY raw HTML starting with <!DOCTYPE html>. No markdown fences, no prose.
2. All CSS inline in <style>. All JS inline in <script>. Google Fonts and cdnjs libraries via <link>/<script src> are OK.
3. Every interaction must work. Responsive design. Modern aesthetic.
4. Use vanilla JS. No React/Vue build tools.
5. No localStorage/sessionStorage (use in-memory vars only unless user explicitly asks for persistence).
Return ONLY the HTML.`;

export const MOBILE_SYSTEM_PROMPT = `You are a mobile app developer. Produce a COMPLETE self-contained HTML file optimized as a mobile PWA.

RULES:
1. Return ONLY raw HTML starting with <!DOCTYPE html>.
2. Include <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">.
3. Include <meta name="apple-mobile-web-app-capable" content="yes">.
4. MOBILE-FIRST: 44px min tap targets, bottom nav, swipe gestures, no hover UI.
5. Full-height, no scrollbars visible, smooth transitions.
6. Vanilla JS. Inline everything.
Return ONLY the HTML.`;

export const PLANNER_SYSTEM_PROMPT = `You are building an interactive planner web app. Produce a COMPLETE self-contained HTML file.

STRICT RULES:
1. Return ONLY raw HTML starting with <!DOCTYPE html>. No markdown fences.
2. The app MUST persist user data in localStorage so progress is saved between visits.
3. For recipes: show prep time, cook time, total time, flame/heat setting for each step, visual cues.
4. For meal plans: show all days with meals per slot (breakfast/lunch/snack/dinner), calories, prep time per meal. Include checkboxes to mark eaten.
5. For workouts: each exercise with sets × reps × rest, form cue, duration. Checkboxes for completion. Progress tracking across days.
6. For diaries: date-based entries, mood tracking, photo prompts (placeholder), search, tags.
7. Add an "Export my data" button that downloads localStorage content as JSON.
8. Responsive, clean, modern UI. Google Fonts OK.
9. Vanilla JS only.
Return ONLY the HTML.`;

export const DOCUMENT_SYSTEM_PROMPT_MARKDOWN = `You are a professional document writer. Generate clean, well-structured Markdown content.

RULES:
1. Return ONLY the Markdown content. No code fences wrapping the whole response.
2. Use proper headings (# ## ###), bullet points, tables where appropriate.
3. For resumes: Name/title at top, contact info, Summary, Skills, Experience (bullet points with metrics), Education, Projects.
4. For reports: Title, Executive Summary, sections with headings, data tables, conclusions, recommendations.
5. For presentations: Use ## for each slide title, bullet points for content. Format: "## Slide N: Title" then bullets.
6. For letters: formal structure with date, address, salutation, body paragraphs, closing.
Return ONLY the Markdown.`;

export const ITERATE_SYSTEM_PROMPT_HTML = `You are modifying existing HTML. Apply the change and return COMPLETE updated HTML. Preserve everything not asked to change. Return ONLY raw HTML.`;

export const ITERATE_SYSTEM_PROMPT_MD = `You are refining existing Markdown. Apply the change and return COMPLETE updated Markdown. Return ONLY raw Markdown.`;

/* ── Content sub-types ──────────────────────────────────────────────────── */
export const CONTENT_TYPES = {
  lesson_plan: {
    label:       "Lesson Plan",
    icon:        "GraduationCap",
    placeholder: "Class 8 Science — photosynthesis, 45 min period, activity-based",
  },
  sermon: {
    label:       "Sermon / Discourse",
    icon:        "BookOpen",
    placeholder: "Sunday sermon on gratitude and faith, 15 minutes, Bible-based",
  },
  blog: {
    label:       "Blog Post",
    icon:        "PenLine",
    placeholder: "Benefits of yoga for office workers, 800 words, SEO-friendly",
  },
  notes: {
    label:       "Study Notes",
    icon:        "NotebookPen",
    placeholder: "UPSC notes on Indian Constitution — Fundamental Rights, concise",
  },
  speech: {
    label:       "Speech / Script",
    icon:        "Mic",
    placeholder: "Farewell speech for a teacher, 5 minutes, emotional and heartfelt",
  },
  social: {
    label:       "Social Media",
    icon:        "Share2",
    placeholder: "Instagram captions for a bakery launch, 5 creative posts with hashtags",
  },
};

/* ── Content system prompt ──────────────────────────────────────────────── */
export const CONTENT_SYSTEM_PROMPT = `You are an expert Indian content writer. Generate high-quality, well-structured Markdown content.

RULES:
1. Return ONLY Markdown. No code fences wrapping the whole response.
2. Use proper headings (# ## ###), bullet points, tables where relevant.
3. For lesson plans: Include objectives, materials, introduction, main activity, assessment, homework. Indian curriculum-aware.
4. For sermons/discourses: Include scripture/text, theme, main points (3-5), story/illustration, application, closing prayer/reflection.
5. For blog posts: Engaging headline, introduction hook, 4-6 sections with subheadings, practical tips, conclusion with CTA.
6. For study notes: Concise bullet points, key terms bolded, tables for comparisons, mnemonics where helpful.
7. For speeches: Opening hook, 3 main points with transitions, personal anecdotes, strong closing.
8. For social media: Platform-aware tone, emojis where appropriate, hashtags, call-to-action.
9. Write in clear English unless the user specifies another language.
10. Be culturally relevant for Indian audience when appropriate.
Return ONLY the Markdown content.`;
