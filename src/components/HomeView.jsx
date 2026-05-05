/* ─── Forjit AI · HomeView ──────────────────────────────────────────────────
 *  The new homepage shown by default.
 *  Sections:
 *   1. Hero — minimal tagline
 *   2. 🔥 Hot Tools — horizontal scroll cards
 *   3. 📸 Instagram Tools — quick-access strip
 *   4. ✨ AI Generators — 4 core generators
 *   5. 🔧 Tool Hub — category grid linking /tools/
 *   6. Continue where you left off
 * ──────────────────────────────────────────────────────────────────────────*/

import React from "react";
import {
  ArrowRight, Zap, FileText, Code2, Calendar, Wand2,
  TrendingUp, Hash, Camera, Film, UserCircle2, Share2,
  Dumbbell, NotebookPen, BookOpen, Sparkles, ChevronRight,
} from "lucide-react";
import ForjitLogo from "./ForjitLogo";
import { TABS, CONTENT_TYPES, DOC_TYPES, PLANNER_TYPES } from "../constants";

/* ── Hot Tools data ─────────────────────────────────────────────────────── */
const HOT_TOOLS = [
  {
    key: "viral-reel",
    icon: "🔥", label: "Viral Reel",
    sub: "Go viral on Instagram",
    color: "from-rose-500/20 to-orange-500/10 border-rose-500/30 hover:border-rose-400/60",
    badge: "🔥 HOT",
    badgeColor: "bg-rose-500/20 text-rose-300",
    action: "content/social",
  },
  {
    key: "resume",
    icon: "📄", label: "Resume Builder",
    sub: "PDF + DOCX in seconds",
    color: "from-sky-500/20 to-blue-500/10 border-sky-500/30 hover:border-sky-400/60",
    badge: "⭐ TOP",
    badgeColor: "bg-sky-500/20 text-sky-300",
    action: "document/resume_pdf",
  },
  {
    key: "instagram-caption",
    icon: "📸", label: "Instagram Caption",
    sub: "3 variants, instant copy",
    color: "from-pink-500/20 to-purple-500/10 border-pink-500/30 hover:border-pink-400/60",
    badge: "📱 NEW",
    badgeColor: "bg-pink-500/20 text-pink-300",
    action: "content/instagram_caption",
  },
  {
    key: "hashtag",
    icon: "#️⃣", label: "Hashtag Generator",
    sub: "30 targeted hashtags",
    color: "from-purple-500/20 to-violet-500/10 border-purple-500/30 hover:border-purple-400/60",
    badge: "📈 VIRAL",
    badgeColor: "bg-purple-500/20 text-purple-300",
    action: "content/hashtag",
  },
  {
    key: "floor-plan",
    icon: "🏠", label: "Floor Plan",
    sub: "AI + Vastu design",
    color: "from-amber-500/20 to-yellow-500/10 border-amber-500/30 hover:border-amber-400/60",
    badge: "🆕 NEW",
    badgeColor: "bg-amber-500/20 text-amber-300",
    href: "/tools/civil/house-floor-plan-generator",
  },
  {
    key: "emi",
    icon: "💰", label: "EMI Calculator",
    sub: "Home, car & personal loans",
    color: "from-emerald-500/20 to-green-500/10 border-emerald-500/30 hover:border-emerald-400/60",
    badge: "🇮🇳 INDIA",
    badgeColor: "bg-emerald-500/20 text-emerald-300",
    href: "/tools/emi-calculator",
  },
  {
    key: "lesson-plan",
    icon: "📋", label: "Lesson Plan",
    sub: "CBSE/ICSE, any subject",
    color: "from-teal-500/20 to-cyan-500/10 border-teal-500/30 hover:border-teal-400/60",
    badge: "👩‍🏫 EDU",
    badgeColor: "bg-teal-500/20 text-teal-300",
    href: "/tools/teacher/lesson-plan-generator",
  },
  {
    key: "viral-hook",
    icon: "⚡", label: "Viral Hook",
    sub: "10 scroll-stopping hooks",
    color: "from-yellow-500/20 to-orange-500/10 border-yellow-500/30 hover:border-yellow-400/60",
    badge: "🔥 TREND",
    badgeColor: "bg-yellow-500/20 text-yellow-300",
    action: "content/viral_hook",
  },
];

/* ── Instagram quick strip ──────────────────────────────────────────────── */
const INSTA_TOOLS = [
  { key: "instagram_caption", icon: Camera,      label: "Caption",  sub: "3 variants" },
  { key: "hashtag",           icon: Hash,        label: "Hashtags", sub: "30 tags"     },
  { key: "bio",               icon: UserCircle2, label: "Bio",      sub: "3 options"   },
  { key: "reel_idea",         icon: Film,        label: "Reel Ideas", sub: "5 ideas"   },
  { key: "viral_hook",        icon: TrendingUp,  label: "Viral Hook", sub: "10 hooks"  },
  { key: "social",            icon: Share2,      label: "Reel Script", sub: "Full script" },
];

/* ── AI Generators ──────────────────────────────────────────────────────── */
const AI_GENERATORS = [
  {
    icon: Code2,
    label: "Build an App",
    sub: "Web & mobile from a prompt",
    color: "border-blue-500/25 from-blue-500/10 text-blue-300",
    action: "app",
  },
  {
    icon: FileText,
    label: "Resume + Cover Letter",
    sub: "Download as PDF or DOCX",
    color: "border-sky-500/25 from-sky-500/10 text-sky-300",
    action: "document/resume_pdf",
  },
  {
    icon: NotebookPen,
    label: "Daily Diary",
    sub: "Journal with mood tracking",
    color: "border-emerald-500/25 from-emerald-500/10 text-emerald-300",
    action: "planner/diary",
  },
  {
    icon: Dumbbell,
    label: "Workout Plan",
    sub: "Weekly or monthly plan",
    color: "border-orange-500/25 from-orange-500/10 text-orange-300",
    action: "planner/workout_week",
  },
];

/* ── Tool category hub ──────────────────────────────────────────────────── */
const TOOL_CATEGORIES = [
  { emoji: "💰", label: "Finance",    sub: "EMI, SIP, GST, Tax",   href: "/tools/?cat=finance"  },
  { emoji: "🏥", label: "Health",     sub: "BMI, Calories, Water",  href: "/tools/?cat=health"   },
  { emoji: "👩‍🏫", label: "Teachers",   sub: "Lesson plans, MCQ",     href: "/tools/teacher/lesson-plan-generator" },
  { emoji: "🏗️", label: "Civil",      sub: "Floor plans, Concrete", href: "/tools/civil/house-floor-plan-generator" },
  { emoji: "🔧", label: "Utilities",  sub: "Password, QR, JSON",    href: "/tools/?cat=utility"  },
  { emoji: "🇮🇳", label: "India",      sub: "GST, HRA, Gratuity",    href: "/tools/?cat=india"    },
  { emoji: "📝", label: "Text Tools", sub: "Word count, Case, Lorem", href: "/tools/?cat=text"   },
  { emoji: "🙏", label: "Spiritual",  sub: "Prayer, Bible Verse",   href: "/tools/priest/prayer-generator" },
];

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════════════════ */
export default function HomeView({ onGoToCreate, history, lastSession, loadFromHistory }) {

  /* Navigate to create view with correct tab/type pre-selected */
  const go = (actionStr) => {
    const [tab, subtype] = actionStr.split("/");
    onGoToCreate(tab, subtype);
  };

  const handleHotTool = (tool) => {
    if (tool.href) {
      window.location.href = tool.href;
    } else if (tool.action) {
      go(tool.action);
    }
  };

  return (
    <div className="space-y-10">

      {/* ── 1. Hero ──────────────────────────────────────────────────────── */}
      <section className="hero-1 pt-2">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot" />
          <span className="text-[11px] font-mono text-emerald-400/70 uppercase tracking-widest">Free · No login needed · Made in India</span>
        </div>
        <h1 className="font-display text-3xl md:text-5xl font-semibold tracking-tight leading-tight mb-3">
          <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 bg-clip-text text-transparent">AI Tools for India</span>
          <br />
          <span className="text-stone-200 text-xl md:text-3xl font-normal">
            Viral content, smart calculators,<br className="hidden md:block" /> resumes & more — all free.
          </span>
        </h1>
        <p className="text-stone-400 text-sm max-w-xl hero-2">
          60+ tools. No login. Generate reels, build apps, create resumes, plan meals — powered by open-source AI.
        </p>
      </section>

      {/* ── 2. 🔥 Hot Tools ─────────────────────────────────────────────── */}
      <section className="hero-3">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">🔥</span>
            <h2 className="font-display text-lg font-semibold text-stone-100">Hot Tools</h2>
            <span className="text-[10px] font-mono uppercase tracking-widest text-stone-500 hidden sm:block">Most used · Trending</span>
          </div>
          <a href="/tools/" className="flex items-center gap-1 text-xs text-amber-400/70 hover:text-amber-300 transition">
            View all <ChevronRight className="w-3.5 h-3.5" />
          </a>
        </div>
        <div className="-mx-4 md:mx-0 px-4 md:px-0 overflow-x-auto scrollbar-thin pb-2">
          <div className="flex gap-3 min-w-max md:min-w-0 md:grid md:grid-cols-4">
            {HOT_TOOLS.map((tool) => (
              <button
                key={tool.key}
                onClick={() => handleHotTool(tool)}
                className={`card-shine group relative overflow-hidden rounded-2xl border bg-gradient-to-br ${tool.color} to-stone-950 p-4 text-left transition-all duration-200 w-44 md:w-auto flex-shrink-0 md:flex-shrink`}
              >
                <div className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wide mb-2 ${tool.badgeColor}`}>
                  {tool.badge}
                </div>
                <div className="text-2xl mb-2">{tool.icon}</div>
                <div className="font-medium text-sm text-stone-100 leading-tight mb-1">{tool.label}</div>
                <div className="text-[11px] text-stone-400 leading-tight">{tool.sub}</div>
                <ArrowRight className="absolute bottom-3 right-3 w-4 h-4 text-stone-600 group-hover:text-stone-300 group-hover:translate-x-0.5 transition-all" />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. 📸 Instagram / Viral Tools ───────────────────────────────── */}
      <section className="hero-4">
        <div className="rounded-2xl border border-pink-500/20 bg-gradient-to-br from-pink-500/8 via-purple-500/5 to-stone-950 p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">📸</span>
            <h2 className="font-display text-base font-semibold text-stone-100">Instagram &amp; Viral Tools</h2>
            <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300">NEW</span>
          </div>
          <div className="-mx-1 overflow-x-auto scrollbar-thin pb-1">
            <div className="flex gap-2 min-w-max px-1">
              {INSTA_TOOLS.map((t) => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.key}
                    onClick={() => go(`content/${t.key}`)}
                    className="group flex flex-col items-center gap-1.5 px-4 py-3 rounded-xl bg-stone-900/60 border border-stone-800 hover:border-pink-500/40 hover:bg-pink-500/8 transition-all min-w-[80px]"
                  >
                    <div className="w-9 h-9 rounded-xl bg-stone-800 group-hover:bg-pink-500/15 flex items-center justify-center transition-colors">
                      <Icon className="w-4 h-4 text-stone-400 group-hover:text-pink-300 transition-colors" />
                    </div>
                    <span className="text-[11px] font-medium text-stone-300 group-hover:text-pink-200 text-center leading-tight transition-colors">{t.label}</span>
                    <span className="text-[9px] text-stone-600 group-hover:text-pink-400/60 transition-colors">{t.sub}</span>
                  </button>
                );
              })}
            </div>
          </div>
          <p className="mt-3 text-[11px] text-stone-600">
            Generate captions, hashtags, bios and reel scripts tailored for Indian creators 🇮🇳
          </p>
        </div>
      </section>

      {/* ── 4. ✨ AI Generators ──────────────────────────────────────────── */}
      <section className="hero-5">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <h2 className="font-display text-base font-semibold text-stone-100">AI Generators</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {AI_GENERATORS.map((g) => {
            const Icon = g.icon;
            const [colorBorder, colorFrom, colorText] = g.color.split(" ");
            return (
              <button
                key={g.action}
                onClick={() => go(g.action)}
                className={`card-shine group relative overflow-hidden rounded-xl border ${colorBorder} bg-gradient-to-br ${colorFrom} via-stone-900/80 to-stone-950 p-4 text-left hover:brightness-110 transition-all`}
              >
                <Icon className={`w-5 h-5 mb-2 ${colorText}`} />
                <div className="text-sm font-medium text-stone-100 leading-tight mb-1">{g.label}</div>
                <div className="text-[11px] text-stone-400 leading-tight">{g.sub}</div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── 5. 🔧 Tool Hub ──────────────────────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-base">🔧</span>
            <h2 className="font-display text-base font-semibold text-stone-100">All Tool Categories</h2>
          </div>
          <a href="/tools/" className="flex items-center gap-1 text-xs text-stone-500 hover:text-amber-300 transition">
            Browse 60+ tools <ChevronRight className="w-3.5 h-3.5" />
          </a>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {TOOL_CATEGORIES.map((cat) => (
            <a
              key={cat.label}
              href={cat.href}
              className="group flex items-center gap-3 px-4 py-3 rounded-xl border border-stone-800 bg-stone-900/40 hover:border-amber-400/30 hover:bg-amber-400/5 transition-all"
            >
              <span className="text-xl">{cat.emoji}</span>
              <div>
                <div className="text-sm font-medium text-stone-200 group-hover:text-amber-200 transition">{cat.label}</div>
                <div className="text-[11px] text-stone-500 leading-tight">{cat.sub}</div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ── 6. Continue where you left off ──────────────────────────────── */}
      {(history?.length > 0 || lastSession) && (
        <section className="pb-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[11px] font-mono uppercase tracking-widest text-stone-500">Continue where you left off</span>
          </div>
          {lastSession && history?.length === 0 && (
            <button
              onClick={() => {
                const [tab, sub] = (lastSession.tab || "app").split("/");
                onGoToCreate(tab, lastSession.contentType || sub);
              }}
              className="w-full md:w-auto flex items-center gap-3 px-4 py-3 rounded-xl border border-amber-400/20 bg-amber-400/5 hover:border-amber-400/35 transition-all group text-left"
            >
              <div className="w-8 h-8 rounded-lg bg-amber-400/15 text-amber-300 flex items-center justify-center shrink-0">
                <Zap className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-mono uppercase tracking-widest text-amber-400/70 mb-0.5">Last session</div>
                <div className="text-sm text-stone-200 truncate font-medium">{lastSession.prompt}</div>
              </div>
              <ArrowRight className="w-4 h-4 text-amber-400/60 group-hover:translate-x-0.5 transition-transform shrink-0" />
            </button>
          )}
          {history?.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {history.slice(0, 4).map((item) => (
                <button
                  key={item.id}
                  onClick={() => loadFromHistory?.(item)}
                  className="px-3 py-2 rounded-xl border border-stone-800 hover:border-amber-400/30 hover:bg-amber-400/5 text-xs text-stone-400 hover:text-stone-200 transition text-left max-w-[200px]"
                >
                  <div className="text-[10px] font-mono text-stone-600 mb-0.5 uppercase">{item.tab}</div>
                  <div className="truncate">{item.prompt}</div>
                </button>
              ))}
            </div>
          )}
        </section>
      )}

    </div>
  );
}
