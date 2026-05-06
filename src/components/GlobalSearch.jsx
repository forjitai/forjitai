/* ─── Forjit AI · Global Search Engine ──────────────────────────────────────
 *  Intelligent search combining:
 *  - Smart intent detection
 *  - Relevant tool recommendations
 *  - Content/viral ideas
 *  - Action plans
 *  Powered by Forjit AI's LLM backend
 * ──────────────────────────────────────────────────────────────────────────*/

import React, { useState, useRef, useEffect } from "react";
import {
  Search, Zap, Loader2, X, ChevronRight, Copy, Check,
  Lightbulb, Target, Rocket, ArrowRight,
} from "lucide-react";
import { callLLM } from "../api";

/* ── Category → tool mapping ────────────────────────────────────────────── */
const TOOL_MAP = {
  finance:  [
    { name: "EMI Calculator",       href: "/tools/emi-calculator.html",                icon: "💰" },
    { name: "SIP Calculator",       href: "/tools/sip-calculator.html",                icon: "📈" },
    { name: "GST Calculator",       href: "/tools/gst-calculator.html",                icon: "🧾" },
    { name: "Income Tax Calc",      href: "/tools/income-tax-calculator.html",         icon: "📊" },
    { name: "FD Calculator",        href: "/tools/fd-calculator.html",                 icon: "🏧" },
    { name: "Retirement Planner",   href: "/tools/retirement-calculator.html",         icon: "🌅" },
  ],
  health:   [
    { name: "BMI Calculator",       href: "/tools/bmi-calculator.html",                icon: "⚖️"  },
    { name: "Calorie Calculator",   href: "/tools/calorie-calculator.html",            icon: "🔥" },
    { name: "Water Intake",         href: "/tools/water-intake.html",                  icon: "💧" },
    { name: "Ideal Weight",         href: "/tools/ideal-weight.html",                  icon: "🏃" },
  ],
  content:  [
    { name: "Viral Reel Script",    action: "content/social",                          icon: "🎬" },
    { name: "Instagram Caption",    action: "content/instagram_caption",               icon: "📸" },
    { name: "Hashtag Generator",    action: "content/hashtag",                         icon: "#️⃣" },
    { name: "Viral Hook",           action: "content/viral_hook",                      icon: "⚡" },
    { name: "Bio Generator",        action: "content/bio",                             icon: "👤" },
    { name: "Reel Ideas",           action: "content/reel_idea",                       icon: "💡" },
  ],
  career:   [
    { name: "Resume (PDF)",         action: "document/resume_pdf",                     icon: "📄" },
    { name: "Resume (DOCX)",        action: "document/resume_docx",                    icon: "📝" },
    { name: "Cover Letter",         action: "document/cover_letter",                   icon: "✉️"  },
  ],
  life:     [
    { name: "Daily Diary",          action: "planner/diary",                           icon: "📓" },
    { name: "Workout Plan",         action: "planner/workout_week",                    icon: "💪" },
    { name: "Meal Plan",            action: "planner/meal_week",                       icon: "🍱" },
    { name: "Recipe Generator",     action: "planner/recipe",                          icon: "👨‍🍳" },
  ],
  teacher:  [
    { name: "Lesson Plan",          href: "/tools/teacher/lesson-plan-generator.html", icon: "📋" },
    { name: "MCQ Maker",            href: "/tools/teacher/mcq-maker.html",             icon: "✅" },
    { name: "Hindi Essay",          href: "/tools/teacher/hindi-essay-writer.html",    icon: "🇮🇳" },
  ],
  civil:    [
    { name: "House Floor Plan",     href: "/tools/civil/house-floor-plan-generator.html", icon: "🏠" },
    { name: "Concrete Mix Calc",    href: "/tools/concrete-mix-calculator.html",       icon: "🏗️"  },
    { name: "Steel Bar Weight",     href: "/tools/civil/steel-bar-weight-calculator.html", icon: "⚖️" },
  ],
  spiritual:[
    { name: "Prayer Generator",     href: "/tools/priest/prayer-generator.html",       icon: "🙏" },
    { name: "Bible Verse Finder",   href: "/tools/priest/bible-verse-finder.html",     icon: "✝️"  },
    { name: "Sermon Builder",       href: "/tools/priest/sermon-builder.html",         icon: "📖" },
  ],
};

const SYSTEM_PROMPT = `You are "Forjit AI Global Search Engine" — an intelligent system that combines smart search, AI tool recommendation, content creation assistance, and life productivity advice for Indian users.

Analyze the user query deeply and return a JSON response with this exact structure:
{
  "intent": "one of: finance | health | content | career | life | teacher | civil | spiritual | general",
  "directAnswer": "2-3 sentence clear, actionable answer. Be specific, practical, India-aware.",
  "toolCategories": ["list of relevant category keys from: finance, health, content, career, life, teacher, civil, spiritual"],
  "actionPlan": ["step 1", "step 2", "step 3", "step 4"],
  "contentIdeas": [
    {"platform": "Instagram", "idea": "reel/post idea", "hook": "opening hook line"},
    {"platform": "YouTube", "idea": "video idea", "hook": "title hook"}
  ],
  "proTip": "one high-value insight most people miss",
  "isContentQuery": true/false
}

Rules:
- directAnswer must be specific, not generic
- actionPlan steps must be actionable, not vague
- contentIdeas only if query has viral/content potential
- proTip must be genuinely surprising or insightful
- Be culturally relevant for India
- Return ONLY valid JSON, no markdown fences`;

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════════════════ */
export default function GlobalSearch({ onGoToCreate, isOpen, onClose }) {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 100);
    if (!isOpen) { setQuery(""); setResult(null); setError(""); }
  }, [isOpen]);

  /* Handle Escape */
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const search = async () => {
    if (!query.trim() || loading) return;
    setLoading(true);
    setResult(null);
    setError("");
    try {
      const raw = await callLLM({
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user",   content: query.trim() },
        ],
      });
      const clean = raw.replace(/```json|```/g, "").trim();
      const data  = JSON.parse(clean);
      setResult(data);
    } catch {
      setError("Couldn't process that query. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); search(); }
  };

  const handleToolClick = (tool) => {
    if (tool.href) { window.location.href = tool.href; return; }
    if (tool.action && onGoToCreate) {
      const [tab, sub] = tool.action.split("/");
      onGoToCreate(tab, sub);
      onClose();
    }
  };

  const copyAnswer = () => {
    if (!result) return;
    const text = [
      `🔍 ${result.directAnswer}`,
      `\n🎯 Action Plan:\n${result.actionPlan?.map((s,i) => `${i+1}. ${s}`).join("\n")}`,
      result.proTip ? `\n💡 Pro Tip: ${result.proTip}` : "",
    ].join("");
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  /* Suggested queries */
  const SUGGESTIONS = [
    "How to lose weight fast at home?",
    "How to grow Instagram followers in India?",
    "Best EMI plan for ₹50 lakh home loan?",
    "How to write a resume for fresher?",
    "Viral reel ideas for food blogger",
    "How to save tax in India 2025?",
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-stone-950/98 backdrop-blur-md" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="flex flex-col h-full max-w-3xl mx-auto w-full px-4" style={{ paddingTop: 'max(16px, env(safe-area-inset-top, 16px))', paddingBottom: 'max(16px, env(safe-area-inset-bottom, 16px))' }}>

        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-4 py-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-400/15 flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4 text-amber-400" />
            </div>
            <span className="font-display text-sm font-semibold text-stone-200">Forjit AI Search</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-400 font-mono hidden sm:block">Powered by AI</span>
          </div>
          {/* Close button — large tap target */}
          <button
            onClick={onClose}
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition active:scale-95"
            aria-label="Close search"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Search box ── */}
        <div className={`relative rounded-2xl border transition-all mb-4 ${loading ? "border-amber-400/50 shadow-lg shadow-amber-400/10" : "border-stone-700 focus-within:border-amber-400/50"} bg-stone-900`}>
          <div className="flex items-center gap-3 px-4 py-3">
            <Search className="w-5 h-5 text-stone-500 shrink-0" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask anything — fitness, finance, career, content ideas..."
              className="flex-1 bg-transparent text-stone-100 placeholder-stone-500 outline-none text-[15px]"
            />
            {query && (
              <button onClick={() => { setQuery(""); setResult(null); inputRef.current?.focus(); }}
                className="p-1 rounded hover:bg-stone-800 text-stone-500 hover:text-stone-300 transition">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="flex items-center justify-between px-4 py-2 border-t border-stone-800">
            <span className="text-[11px] text-stone-600">Press Enter to search</span>
            <button onClick={search} disabled={!query.trim() || loading}
              className="px-4 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-bold transition flex items-center gap-1.5 disabled:bg-stone-800 disabled:text-stone-600 disabled:cursor-not-allowed">
              {loading ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Thinking...</> : <><Zap className="w-3.5 h-3.5" /> Search</>}
            </button>
          </div>
        </div>

        {/* ── Scrollable results ── */}
        <div className="flex-1 overflow-y-auto scrollbar-thin space-y-4 pb-4">

          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="flex gap-1.5">
                {[0,1,2].map(i => (
                  <span key={i} className="w-2 h-2 rounded-full bg-amber-400 pulse-dot" style={{ animationDelay: `${i * 0.2}s` }} />
                ))}
              </div>
              <p className="text-stone-400 text-sm">Analysing your query...</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="rounded-xl border border-rose-500/30 bg-rose-500/5 p-4 text-rose-300 text-sm">{error}</div>
          )}

          {/* Results */}
          {result && !loading && (
            <div className="space-y-4 slide-up">

              {/* 1. Direct Answer */}
              <div className="rounded-2xl border border-amber-400/20 bg-gradient-to-br from-amber-400/8 to-stone-900 p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Search className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-bold uppercase tracking-widest text-amber-400">Direct Answer</span>
                  </div>
                  <button onClick={copyAnswer} className="flex items-center gap-1 px-2 py-1 rounded-md hover:bg-stone-800 text-stone-500 hover:text-stone-300 transition text-[11px]">
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
                <p className="text-stone-200 text-sm leading-relaxed">{result.directAnswer}</p>
              </div>

              {/* 2. Recommended Tools */}
              {result.toolCategories?.length > 0 && (
                <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Zap className="w-4 h-4 text-sky-400" />
                    <span className="text-xs font-bold uppercase tracking-widest text-sky-400">Recommended Tools</span>
                  </div>
                  <div className="space-y-3">
                    {result.toolCategories.map(cat => {
                      const tools = TOOL_MAP[cat];
                      if (!tools) return null;
                      return (
                        <div key={cat}>
                          <div className="text-[10px] font-mono uppercase tracking-widest text-stone-600 mb-2 capitalize">{cat}</div>
                          <div className="flex flex-wrap gap-2">
                            {tools.map(tool => (
                              <button key={tool.name} onClick={() => handleToolClick(tool)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-700 bg-stone-800/60 hover:border-amber-400/40 hover:bg-amber-400/5 text-xs text-stone-300 hover:text-amber-200 transition">
                                <span>{tool.icon}</span>
                                {tool.name}
                                <ChevronRight className="w-3 h-3 text-stone-600" />
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 3. Action Plan */}
              {result.actionPlan?.length > 0 && (
                <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Action Plan</span>
                  </div>
                  <ol className="space-y-2">
                    {result.actionPlan.map((step, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-400/15 text-emerald-400 text-[10px] font-bold flex items-center justify-center mt-0.5">{i + 1}</span>
                        <span className="text-stone-300 text-sm leading-relaxed">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* 4. Content / Viral Ideas */}
              {result.isContentQuery && result.contentIdeas?.length > 0 && (
                <div className="rounded-2xl border border-pink-500/20 bg-gradient-to-br from-pink-500/5 to-stone-900 p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Rocket className="w-4 h-4 text-pink-400" />
                    <span className="text-xs font-bold uppercase tracking-widest text-pink-400">Viral Content Ideas</span>
                  </div>
                  <div className="space-y-3">
                    {result.contentIdeas.map((idea, i) => (
                      <div key={i} className="rounded-xl border border-stone-800 bg-stone-900/60 p-3">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-800 text-stone-400 uppercase tracking-wide">
                            {idea.platform === "Instagram" ? "📸" : "▶️"} {idea.platform}
                          </span>
                        </div>
                        <p className="text-stone-300 text-xs mb-1.5">{idea.idea}</p>
                        <p className="text-pink-300/80 text-xs italic border-l-2 border-pink-500/30 pl-2">
                          Hook: "{idea.hook}"
                        </p>
                        {onGoToCreate && (
                          <button
                            onClick={() => { onGoToCreate("content", idea.platform === "Instagram" ? "instagram_caption" : "social"); onClose(); }}
                            className="mt-2 flex items-center gap-1 text-[11px] text-pink-400/70 hover:text-pink-300 transition">
                            Generate with AI <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 5. Pro Tip */}
              {result.proTip && (
                <div className="rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-500/5 to-stone-900 p-4 flex items-start gap-3">
                  <Lightbulb className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-violet-400 block mb-1">Pro Tip</span>
                    <p className="text-stone-300 text-sm leading-relaxed">{result.proTip}</p>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* Suggestions (shown when empty) */}
          {!loading && !result && !error && (
            <div>
              <p className="text-[11px] font-mono uppercase tracking-widest text-stone-600 mb-3">Try asking...</p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTIONS.map(s => (
                  <button key={s} onClick={() => { setQuery(s); setTimeout(search, 50); }}
                    className="px-3 py-2 rounded-xl border border-stone-800 bg-stone-900/60 hover:border-amber-400/30 hover:bg-amber-400/5 text-xs text-stone-400 hover:text-stone-200 transition text-left">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
