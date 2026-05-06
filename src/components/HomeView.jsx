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
  Dumbbell, NotebookPen, BookOpen, Sparkles, ChevronRight, Search,
} from "lucide-react";
import ForjitLogo from "./ForjitLogo";
import ExperimentalSection from "./ExperimentalSection";
import ScrollRow from "./ScrollRow";
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
    href: "/tools/civil/house-floor-plan-generator.html",
  },
  {
    key: "emi",
    icon: "💰", label: "EMI Calculator",
    sub: "Home, car & personal loans",
    color: "from-emerald-500/20 to-green-500/10 border-emerald-500/30 hover:border-emerald-400/60",
    badge: "🇮🇳 INDIA",
    badgeColor: "bg-emerald-500/20 text-emerald-300",
    href: "/tools/emi-calculator.html",
  },
  {
    key: "lesson-plan",
    icon: "📋", label: "Lesson Plan",
    sub: "CBSE/ICSE, any subject",
    color: "from-teal-500/20 to-cyan-500/10 border-teal-500/30 hover:border-teal-400/60",
    badge: "👩‍🏫 EDU",
    badgeColor: "bg-teal-500/20 text-teal-300",
    href: "/tools/teacher/lesson-plan-generator.html",
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

/* ── AI Generators — NO planners (moved to Experimental) ───────────────── */
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
    icon: BookOpen,
    label: "Blog / Essay",
    sub: "SEO-ready content",
    color: "border-violet-500/25 from-violet-500/10 text-violet-300",
    action: "content/blog",
  },
  {
    icon: Wand2,
    label: "Lesson Plan",
    sub: "CBSE/ICSE, any subject",
    color: "border-teal-500/25 from-teal-500/10 text-teal-300",
    action: "content/lesson_plan",
  },
];

/* ── Tool category hub ──────────────────────────────────────────────────── */
const TOOL_CATEGORIES = [
  { emoji: "💰", label: "Finance",    sub: "EMI, SIP, GST, Tax",   href: "/tools/?cat=finance"  },
  { emoji: "🏥", label: "Health",     sub: "BMI, Calories, Water",  href: "/tools/?cat=health"   },
  { emoji: "👩‍🏫", label: "Teachers",   sub: "Lesson plans, MCQ",     href: "/tools/teacher/lesson-plan-generator.html" },
  { emoji: "🏗️", label: "Civil",      sub: "Floor plans, Concrete", href: "/tools/civil/house-floor-plan-generator.html" },
  { emoji: "🔧", label: "Utilities",  sub: "Password, QR, JSON",    href: "/tools/?cat=utility"  },
  { emoji: "🇮🇳", label: "India",      sub: "GST, HRA, Gratuity",    href: "/tools/?cat=india"    },
  { emoji: "📝", label: "Text Tools", sub: "Word count, Case, Lorem", href: "/tools/?cat=text"   },
  { emoji: "🙏", label: "Spiritual",  sub: "Prayer, Bible Verse",   href: "/tools/priest/prayer-generator.html" },
];

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════════════════ */
export default function HomeView({ onGoToCreate, history, lastSession, loadFromHistory, onOpenSearch }) {

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

        {/* Search bar */}
        <button
          onClick={onOpenSearch}
          className="mt-5 hero-3 w-full max-w-lg flex items-center gap-3 px-4 py-3 rounded-2xl border border-stone-700 bg-stone-900/80 hover:border-amber-400/40 hover:bg-stone-900 transition-all group text-left"
        >
          <Search className="w-4 h-4 text-stone-500 group-hover:text-amber-400 transition-colors shrink-0" />
          <span className="text-stone-500 text-sm group-hover:text-stone-400 transition-colors flex-1">
            Ask anything — fitness, finance, content ideas, career...
          </span>
          <span className="text-[10px] font-mono px-2 py-1 rounded-md bg-stone-800 text-stone-600 shrink-0 hidden sm:block">AI Search</span>
        </button>

        {/* Social follow buttons */}
        <div className="mt-4 flex items-center gap-2 flex-wrap">
          <a href="https://www.youtube.com/@forjitai" target="_blank" rel="noreferrer"
            className="flex items-center gap-2 px-3 py-2 rounded-xl border border-red-500/25 bg-red-500/8 hover:bg-red-500/15 hover:border-red-500/40 text-red-400 hover:text-red-300 transition text-xs font-medium">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            YouTube — @forjitai
          </a>
          <a href="https://www.instagram.com/forjitai" target="_blank" rel="noreferrer"
            className="flex items-center gap-2 px-3 py-2 rounded-xl border border-pink-500/25 bg-pink-500/8 hover:bg-pink-500/15 hover:border-pink-500/40 text-pink-400 hover:text-pink-300 transition text-xs font-medium">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            Instagram — @forjitai
          </a>
        </div>
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
        <ScrollRow gap={12}>
            {HOT_TOOLS.map((tool) => (
              <button
                key={tool.key}
                onClick={() => handleHotTool(tool)}
                className={`card-shine group relative overflow-hidden rounded-2xl border bg-gradient-to-br ${tool.color} to-stone-950 p-4 text-left transition-all duration-200 flex-shrink-0 w-44`}
                style={{ flexShrink: 0 }}
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
        </ScrollRow>
      </section>

      {/* ── 3. 📸 Instagram / Viral Tools ───────────────────────────────── */}
      <section className="hero-4">
        <div className="rounded-2xl border border-pink-500/20 bg-gradient-to-br from-pink-500/8 via-purple-500/5 to-stone-950 p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">📸</span>
            <h2 className="font-display text-base font-semibold text-stone-100">Instagram &amp; Viral Tools</h2>
            <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300">NEW</span>
          </div>
          <ScrollRow gap={8} hint={true}>
              {INSTA_TOOLS.map((t) => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.key}
                    onClick={() => go(`content/${t.key}`)}
                    className="group flex flex-col items-center gap-1.5 px-4 py-3 rounded-xl bg-stone-900/60 border border-stone-800 hover:border-pink-500/40 hover:bg-pink-500/8 transition-all flex-shrink-0"
                    style={{ minWidth: 80, flexShrink: 0 }}
                  >
                    <div className="w-9 h-9 rounded-xl bg-stone-800 group-hover:bg-pink-500/15 flex items-center justify-center transition-colors">
                      <Icon className="w-4 h-4 text-stone-400 group-hover:text-pink-300 transition-colors" />
                    </div>
                    <span className="text-[11px] font-medium text-stone-300 group-hover:text-pink-200 text-center leading-tight transition-colors">{t.label}</span>
                    <span className="text-[9px] text-stone-600 group-hover:text-pink-400/60 transition-colors">{t.sub}</span>
                  </button>
                );
              })}
          </ScrollRow>
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

      {/* ── 6. 🧪 Experimental Tools (Planner) ──────────────────────────── */}
      <ExperimentalSection onGoToCreate={onGoToCreate} />

      {/* ── 7. Continue where you left off ──────────────────────────────── */}
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

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer className="mt-10 pt-6 border-t border-stone-800/60 pb-4">

        {/* Logo + tagline */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-sm font-bold text-stone-950">⚡</div>
          <span className="font-semibold text-stone-200 text-sm">Forjit AI</span>
          <span className="text-[10px] text-stone-600 font-mono ml-1">Free Indian AI Tools</span>
        </div>

        {/* Social links */}
        <div className="flex items-center gap-2 mb-5">
          <a href="https://www.youtube.com/@forjitai" target="_blank" rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-500/20 bg-red-500/8 text-xs text-red-400 hover:bg-red-500/15 hover:text-red-300 transition">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            YouTube
          </a>
          <a href="https://www.instagram.com/forjitai" target="_blank" rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-pink-500/20 bg-pink-500/8 text-xs text-pink-400 hover:bg-pink-500/15 hover:text-pink-300 transition">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            Instagram
          </a>
        </div>

        {/* Navigation links */}
        <div className="flex flex-wrap gap-x-3 gap-y-1.5 mb-4 text-[11px] text-stone-600">
          <a href="/tools/" className="hover:text-amber-400 transition">🔧 Tools</a>
          <a href="/blog/" className="hover:text-amber-400 transition">📰 Blog</a>
          <a href="/ott/" className="hover:text-amber-400 transition">🎬 OTT</a>
          <a href="/community" className="hover:text-amber-400 transition">👥 Community</a>
          <a href="/about" className="hover:text-amber-400 transition">ℹ️ About</a>
          <a href="/contact" className="hover:text-amber-400 transition">📧 Contact</a>
        </div>

        {/* Legal links */}
        <div className="flex flex-wrap gap-x-3 gap-y-1.5 mb-4 text-[11px] text-stone-600 border-t border-stone-800/40 pt-3">
          <span className="text-stone-700 font-mono uppercase tracking-widest text-[9px] w-full mb-0.5">Legal</span>
          <a href="/privacy" className="hover:text-stone-400 transition">Privacy Policy</a>
          <a href="/terms" className="hover:text-stone-400 transition">Terms of Service</a>
          <a href="/ai-disclaimer" className="hover:text-stone-400 transition">AI Disclaimer</a>
          <a href="/acceptable-use" className="hover:text-stone-400 transition">Acceptable Use</a>
          <a href="/content-policy" className="hover:text-stone-400 transition">Content Policy</a>
          <a href="/disclaimer" className="hover:text-stone-400 transition">Disclaimer</a>
        </div>

        {/* Copyright */}
        <div className="text-[11px] font-mono text-stone-700 border-t border-stone-800/40 pt-3">
          <p>© 2026 Forjit AI · All rights reserved</p>
          <p className="mt-0.5">Made with ❤️ in India 🇮🇳 · <a href="mailto:forjitai@gmail.com" className="hover:text-stone-500 transition">forjitai@gmail.com</a></p>
          <p className="mt-1 text-stone-800 text-[10px]">⚠ AI results may be inaccurate. Always verify before professional use. Governed by Indian IT laws.</p>
        </div>

      </footer>

    </div>
  );
}
