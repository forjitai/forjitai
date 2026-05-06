/* ─── Forjit AI · Navbar ─────────────────────────────────────────────────────
 *  Desktop: Logo + primary nav with dropdowns + utility buttons
 *  Mobile:  Fixed bottom bar (5 tabs) + slide-in drawer for full menu
 *
 *  Sections covered:
 *  Home | Search | 🔥 Hot Tools | Tools (categories) | Create | Life | Resume
 *  + Drawer: Blog, OTT, Community, About, Request Tool, YouTube, Instagram
 * ──────────────────────────────────────────────────────────────────────────*/

import React, { useState, useRef, useEffect } from "react";
import {
  Home, Search, Zap, Wrench, Wand2, FileText, BookOpen,
  Settings, User, LogIn, Shield, History, Bug, Smartphone,
  ChevronDown, X, Menu, ArrowRight, ExternalLink,
  NotebookPen, Dumbbell, UtensilsCrossed, Code2, Camera,
  PenSquare, Send, CheckCircle,
} from "lucide-react";
import ForjitLogo from "./ForjitLogo";

/* ── YouTube / Instagram SVG icons ─────────────────────────────────────── */
const YTIcon = (p) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);
const IGIcon = (p) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

/* ── Dropdown data ──────────────────────────────────────────────────────── */
const HOT_ITEMS = [
  { icon: "🔥", label: "Viral Reel Script",    action: "content/social"              },
  { icon: "📸", label: "Instagram Caption",    action: "content/instagram_caption"   },
  { icon: "#️⃣", label: "Hashtag Generator",    action: "content/hashtag"             },
  { icon: "⚡", label: "Viral Hook",           action: "content/viral_hook"          },
  { icon: "📄", label: "Resume Builder",       action: "document/resume_pdf"         },
  { icon: "🏠", label: "AI Floor Plan",        href: "/tools/civil/house-floor-plan-generator.html" },
  { icon: "💰", label: "EMI Calculator",       href: "/tools/emi-calculator.html"         },
  { icon: "📋", label: "Lesson Plan",          href: "/tools/teacher/lesson-plan-generator.html" },
];

const TOOLS_CATS = [
  { emoji: "💰", label: "Finance",    href: "/tools/?cat=finance",  sub: "EMI, SIP, GST, Tax"     },
  { emoji: "🏥", label: "Health",     href: "/tools/?cat=health",   sub: "BMI, Calories, Water"   },
  { emoji: "🇮🇳", label: "India",      href: "/tools/?cat=india",    sub: "HRA, Gratuity, PF"      },
  { emoji: "🔧", label: "Utilities",  href: "/tools/?cat=utility",  sub: "Password, QR, JSON"     },
  { emoji: "📝", label: "Text",       href: "/tools/?cat=text",     sub: "Word count, Case"       },
  { emoji: "👨‍💻", label: "Developer",  href: "/tools/?cat=dev",      sub: "Base64, Number, JSON"   },
  { emoji: "👩‍🏫", label: "Teachers",   href: "/tools/teacher/",      sub: "Lesson, MCQ, Essays"    },
  { emoji: "🏗️", label: "Civil",      href: "/tools/civil/",        sub: "Floor plan, Steel, Mix" },
  { emoji: "🙏", label: "Spiritual",  href: "/tools/priest/",       sub: "Prayer, Sermon, Bible"  },
];

const CREATE_ITEMS = [
  { icon: Code2,     label: "Build an App",       sub: "Web & mobile",          action: "app"                       },
  { icon: Camera,    label: "Instagram Tools",     sub: "Caption, Hashtag, Bio", action: "content/instagram_caption" },
  { icon: FileText,  label: "Resume PDF",          sub: "Download instantly",    action: "document/resume_pdf"       },
  { icon: FileText,  label: "Resume DOCX",         sub: "Word format",           action: "document/resume_docx"      },
  { icon: PenSquare, label: "Cover Letter",        sub: "Tailored to job",       action: "document/cover_letter"     },
  { icon: BookOpen,  label: "Blog / Essay",        sub: "SEO-ready",             action: "content/blog"              },
  { icon: Wand2,     label: "Lesson Plan",         sub: "CBSE/ICSE",             action: "content/lesson_plan"       },
];

const LIFE_ITEMS = [
  { icon: "💰", label: "Finance Tools",     href: "/tools/?cat=finance", emoji: true },
  { icon: "🏥", label: "Health Tools",      href: "/tools/?cat=health",  emoji: true },
  { icon: "🙏", label: "Spiritual Tools",   href: "/tools/priest/",      emoji: true },
  { icon: "🧪", label: "Experimental Tools (Planner)", experimental: true, emoji: true },
];

/* ── Dropdown wrapper ───────────────────────────────────────────────────── */
function Dropdown({ label, icon: Icon, children, accent = "amber" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const colors = {
    amber: "text-amber-400 border-amber-400/30 bg-amber-400/10",
    pink:  "text-pink-400  border-pink-400/30  bg-pink-400/10",
    sky:   "text-sky-400   border-sky-400/30   bg-sky-400/10",
    emerald: "text-emerald-400 border-emerald-400/30 bg-emerald-400/10",
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`px-3 py-1.5 rounded-md text-xs font-medium transition flex items-center gap-1.5 ${
          open ? colors[accent] + " border" : "text-stone-400 hover:text-stone-200 hover:bg-stone-800/60"
        }`}
      >
        {Icon && <Icon className="w-3.5 h-3.5" />}
        {label}
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 z-50 min-w-[220px] rounded-xl border border-stone-700 bg-stone-950 shadow-2xl shadow-black/60 overflow-hidden">
          {children}
        </div>
      )}
    </div>
  );
}

/* ── Request Tool Modal ─────────────────────────────────────────────────── */
function RequestToolModal({ onClose }) {
  const [tool, setTool] = useState("");
  const [desc, setDesc] = useState("");
  const [sent, setSent] = useState(false);

  const submit = () => {
    if (!tool.trim()) return;
    // Store in localStorage for admin to see
    const requests = JSON.parse(localStorage.getItem("forjit_tool_requests") || "[]");
    requests.push({ tool, desc, ts: new Date().toISOString() });
    localStorage.setItem("forjit_tool_requests", JSON.stringify(requests));
    setSent(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-stone-700 bg-stone-950 p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-display text-lg font-semibold text-stone-100">Request a Tool</h2>
            <p className="text-xs text-stone-500 mt-0.5">Can't find what you need? We'll build it.</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-stone-800 text-stone-400 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {sent ? (
          <div className="flex flex-col items-center py-8 gap-3">
            <CheckCircle className="w-12 h-12 text-emerald-400" />
            <p className="text-stone-200 font-medium">Request submitted!</p>
            <p className="text-stone-500 text-sm text-center">We review all requests. Follow @forjitai for updates.</p>
            <button onClick={onClose} className="mt-2 px-4 py-2 rounded-lg bg-amber-400 text-stone-950 text-sm font-medium hover:bg-amber-300 transition">
              Close
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-stone-400 block mb-1.5">Tool name *</label>
              <input
                value={tool}
                onChange={e => setTool(e.target.value)}
                placeholder="e.g. GST Invoice Generator, Hindi Grammar Checker"
                className="w-full bg-stone-900 border border-stone-700 rounded-lg px-4 py-2.5 text-sm text-stone-100 placeholder-stone-600 outline-none focus:border-amber-400/50 transition"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-stone-400 block mb-1.5">Description (optional)</label>
              <textarea
                value={desc}
                onChange={e => setDesc(e.target.value)}
                placeholder="What should this tool do? Who is it for?"
                rows={3}
                className="w-full bg-stone-900 border border-stone-700 rounded-lg px-4 py-2.5 text-sm text-stone-100 placeholder-stone-600 outline-none focus:border-amber-400/50 transition resize-none"
              />
            </div>
            <button
              onClick={submit}
              disabled={!tool.trim()}
              className="w-full py-2.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-stone-950 font-semibold text-sm transition flex items-center justify-center gap-2 disabled:bg-stone-800 disabled:text-stone-600"
            >
              <Send className="w-4 h-4" /> Submit Request
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN NAVBAR
═══════════════════════════════════════════════════════════════════════════ */
export default function Navbar({
  activeView, setActiveView,
  goToCreate,
  showSearch, setShowSearch,
  showSettings, setShowSettings,
  showHistory, setShowHistory,
  showAuth, setShowAuth,
  showAdmin, setShowAdmin,
  user, history, errorLog, showInstallBtn, handleInstall,
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showRequestTool, setShowRequestTool] = useState(false);

  const go = (action) => {
    if (!action) return;
    const [tab, sub] = action.split("/");
    goToCreate(tab, sub);
    setDrawerOpen(false);
  };

  const visit = (href) => {
    window.location.href = href;
    setDrawerOpen(false);
  };

  return (
    <>
      {/* ══════════════════════════════════════════════════════
          DESKTOP HEADER (hidden on mobile)
      ══════════════════════════════════════════════════════ */}
      <header className="border-b border-stone-800/80 px-4 md:px-8 py-3 flex items-center justify-between backdrop-blur-sm sticky top-0 z-30 bg-stone-950/90">

        {/* Left: Logo + primary nav */}
        <div className="flex items-center gap-1">
          <button onClick={() => setActiveView("home")} className="flex items-center gap-2 mr-3 shrink-0">
            <ForjitLogo size="md" showTag={false} />
          </button>

          <nav className="hidden lg:flex items-center gap-0.5">
            {/* Home */}
            <button
              onClick={() => setActiveView("home")}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition flex items-center gap-1.5 ${
                activeView === "home" ? "bg-stone-800 text-stone-100" : "text-stone-400 hover:text-stone-200 hover:bg-stone-800/60"
              }`}
            >
              <Home className="w-3.5 h-3.5" /> Home
            </button>

            {/* Search */}
            <button
              onClick={() => setShowSearch(true)}
              className="px-3 py-1.5 rounded-md text-xs font-medium text-stone-400 hover:text-stone-200 hover:bg-stone-800/60 transition flex items-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5" /> Search
            </button>

            {/* 🔥 Hot Tools */}
            <Dropdown label="🔥 Hot Tools" accent="amber">
              <div className="p-1.5 grid grid-cols-2 gap-0.5">
                {HOT_ITEMS.map(t => (
                  <button key={t.label}
                    onClick={() => t.action ? go(t.action) : visit(t.href)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-stone-800 text-left transition group">
                    <span className="text-sm">{t.icon}</span>
                    <span className="text-xs text-stone-300 group-hover:text-stone-100 transition leading-tight">{t.label}</span>
                  </button>
                ))}
              </div>
              <div className="border-t border-stone-800 p-2">
                <button onClick={() => setShowSearch(true)}
                  className="w-full text-xs text-amber-400/70 hover:text-amber-300 px-2 py-1.5 rounded-lg hover:bg-stone-800 transition text-left flex items-center gap-1.5">
                  <Search className="w-3 h-3" /> Can't find it? Search →
                </button>
              </div>
            </Dropdown>

            {/* Tools */}
            <Dropdown label="Tools" icon={Wrench} accent="sky">
              <div className="p-2">
                <div className="text-[10px] font-mono uppercase tracking-widest text-stone-600 px-2 pb-1.5">Categories</div>
                <div className="grid grid-cols-2 gap-0.5">
                  {TOOLS_CATS.map(c => (
                    <a key={c.label} href={c.href}
                      className="flex items-start gap-2 px-3 py-2 rounded-lg hover:bg-stone-800 transition group">
                      <span className="text-sm mt-0.5">{c.emoji}</span>
                      <div>
                        <div className="text-xs text-stone-300 group-hover:text-stone-100 font-medium transition">{c.label}</div>
                        <div className="text-[10px] text-stone-600 leading-tight">{c.sub}</div>
                      </div>
                    </a>
                  ))}
                </div>
                <div className="border-t border-stone-800 mt-1 pt-1">
                  <a href="/tools/" className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-stone-800 transition text-xs text-amber-400/80 hover:text-amber-300">
                    Browse all 60+ tools <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </Dropdown>

            {/* Create */}
            <Dropdown label="Create" icon={Wand2} accent="pink">
              <div className="p-2 w-64">
                {CREATE_ITEMS.map(c => {
                  const Icon = typeof c.icon === "string" ? null : c.icon;
                  return (
                    <button key={c.label}
                      onClick={() => go(c.action)}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-stone-800 transition group text-left">
                      {Icon && <Icon className="w-4 h-4 text-stone-500 group-hover:text-pink-400 transition shrink-0" />}
                      <div>
                        <div className="text-xs text-stone-300 group-hover:text-stone-100 font-medium transition">{c.label}</div>
                        <div className="text-[10px] text-stone-600">{c.sub}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </Dropdown>

            {/* Life */}
            <Dropdown label="Life" icon={NotebookPen} accent="emerald">
              <div className="p-2 w-48">
                {LIFE_ITEMS.map(c => {
                  const Icon = typeof c.icon === "string" ? null : c.icon;
                  return (
                    <button key={c.label}
                      onClick={() => c.experimental
                        ? (setDrawerOpen(false), setActiveView?.("home"))
                        : c.action ? go(c.action) : visit(c.href)}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-stone-800 transition group text-left">
                      {Icon ? (
                        <Icon className="w-4 h-4 text-stone-500 group-hover:text-emerald-400 transition shrink-0" />
                      ) : (
                        <span className="text-sm shrink-0">{c.icon}</span>
                      )}
                      <span className="text-xs text-stone-300 group-hover:text-stone-100 font-medium transition">{c.label}</span>
                      {c.experimental && <span className="ml-auto text-[9px] px-1 py-0.5 rounded bg-violet-500/20 text-violet-400">Beta</span>}
                    </button>
                  );
                })}
              </div>
            </Dropdown>

            {/* Resume — direct link */}
            <button
              onClick={() => go("document/resume_pdf")}
              className="px-3 py-1.5 rounded-md text-xs font-medium text-sky-400/80 hover:text-sky-300 hover:bg-sky-500/10 transition flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5" /> Resume
            </button>
          </nav>
        </div>

        {/* Right: utility */}
        <div className="flex items-center gap-1.5">
          {/* Create button — mobile visible */}
          <button
            onClick={() => setActiveView(activeView === "create" ? "home" : "create")}
            className={`px-3 py-1.5 rounded-md text-xs font-medium border transition flex items-center gap-1.5 ${
              activeView === "create"
                ? "border-amber-400/50 bg-amber-400/10 text-amber-300"
                : "border-amber-400 bg-amber-400 text-stone-950 hover:bg-amber-300"
            }`}
          >
            <PenSquare className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{activeView === "create" ? "← Home" : "Create"}</span>
          </button>

          {/* Social — desktop only */}
          <a href="https://www.youtube.com/@forjitai" target="_blank" rel="noreferrer"
            className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs text-red-400/70 hover:text-red-300 hover:bg-red-500/10 transition">
            <YTIcon className="w-3.5 h-3.5" /> YouTube
          </a>
          <a href="https://www.instagram.com/forjitai" target="_blank" rel="noreferrer"
            className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs text-pink-400/70 hover:text-pink-300 hover:bg-pink-500/10 transition">
            <IGIcon className="w-3.5 h-3.5" /> Instagram
          </a>

          {showInstallBtn && (
            <button onClick={handleInstall}
              className="px-2.5 py-1.5 rounded-md border border-emerald-500/40 bg-emerald-500/10 text-xs text-emerald-300 hover:bg-emerald-500/20 transition hidden md:flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          )}
          {user?.isAdmin && (
            <button onClick={() => setShowAdmin(true)}
              className="px-2.5 py-1.5 rounded-md border border-purple-500/40 bg-purple-500/10 text-xs text-purple-300 hover:bg-purple-500/20 transition flex items-center">
              <Shield className="w-3.5 h-3.5" />
            </button>
          )}
          <button onClick={() => setShowHistory(true)}
            className="px-2.5 py-1.5 rounded-md border border-stone-800 hover:border-stone-700 text-xs text-stone-400 hover:text-stone-200 transition hidden sm:flex items-center gap-1.5">
            <History className="w-3.5 h-3.5" />
            {history?.length > 0 && <span className="text-[10px] bg-amber-400/20 text-amber-300 px-1 rounded">{history.length}</span>}
          </button>
          {errorLog?.length > 0 && (
            <button onClick={() => {}}
              className="px-2.5 py-1.5 rounded-md border border-rose-500/30 text-xs text-rose-300 hidden md:flex items-center">
              <Bug className="w-3.5 h-3.5" />
            </button>
          )}
          <button onClick={() => setShowSettings(true)}
            className="px-2.5 py-1.5 rounded-md border border-stone-800 hover:border-stone-700 text-xs text-stone-400 hover:text-stone-200 transition flex items-center">
            <Settings className="w-3.5 h-3.5" />
          </button>
          {user ? (
            <button onClick={() => setShowAuth(true)}
              className="px-3 py-1.5 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 hover:bg-emerald-500/20 transition flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{user.name.split(" ")[0]}</span>
            </button>
          ) : (
            <button onClick={() => setShowAuth(true)}
              className="px-3 py-1.5 rounded-md border border-stone-800 hover:border-stone-700 text-xs text-stone-400 hover:text-stone-200 transition hidden md:flex items-center gap-1.5">
              <LogIn className="w-3.5 h-3.5" /> Sign in
            </button>
          )}

          {/* Hamburger — lg hidden, always show on <lg */}
          <button onClick={() => setDrawerOpen(true)}
            className="lg:hidden px-2.5 py-1.5 rounded-md border border-stone-800 hover:border-stone-700 text-stone-400 hover:text-stone-200 transition flex items-center">
            <Menu className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ══════════════════════════════════════════════════════
          MOBILE BOTTOM NAV
      ══════════════════════════════════════════════════════ */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden flex items-center justify-around bg-stone-950/96 border-t border-stone-800 py-2 backdrop-blur-sm">
        <button onClick={() => setActiveView("home")}
          className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition ${activeView === "home" ? "text-amber-400" : "text-stone-500"}`}>
          <Home className="w-5 h-5" />
          <span className="text-[9px]">Home</span>
        </button>
        <button onClick={() => setShowSearch(true)}
          className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg text-stone-500 hover:text-amber-300 transition">
          <Search className="w-5 h-5" />
          <span className="text-[9px]">Search</span>
        </button>
        {/* Centre Create pill */}
        <button
          onClick={() => setActiveView(activeView === "create" ? "home" : "create")}
          className="flex flex-col items-center gap-0.5 px-2 py-1 -mt-4 relative"
        >
          <div className={`w-13 h-13 w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-all ${
            activeView === "create" ? "bg-amber-400 shadow-amber-400/40" : "bg-gradient-to-br from-amber-400 to-orange-500 shadow-amber-400/30"
          }`}>
            <PenSquare className="w-5 h-5 text-stone-950" />
          </div>
          <span className="text-[9px] text-stone-500 mt-0.5">Create</span>
        </button>
        <a href="/tools/"
          className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg text-stone-500 hover:text-stone-200 transition">
          <Wrench className="w-5 h-5" />
          <span className="text-[9px]">Tools</span>
        </a>
        <button onClick={() => setDrawerOpen(true)}
          className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg text-stone-500 hover:text-stone-200 transition">
          <Menu className="w-5 h-5" />
          <span className="text-[9px]">More</span>
        </button>
      </nav>

      {/* ══════════════════════════════════════════════════════
          MOBILE / TABLET DRAWER
      ══════════════════════════════════════════════════════ */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div className="flex-1 bg-stone-950/60 backdrop-blur-sm" onClick={() => setDrawerOpen(false)} />
          {/* Panel */}
          <div className="w-80 max-w-[85vw] bg-stone-950 border-l border-stone-800 flex flex-col h-full overflow-y-auto shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-stone-800">
              <ForjitLogo size="sm" showTag={false} />
              <button onClick={() => setDrawerOpen(false)}
                className="p-2 rounded-lg hover:bg-stone-800 text-stone-400 transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 p-4 space-y-5">

              {/* Main nav */}
              <section>
                <div className="text-[10px] font-mono uppercase tracking-widest text-stone-600 mb-2">Navigate</div>
                <div className="space-y-0.5">
                  {[
                    { icon: Home,     label: "Home",         onClick: () => { setActiveView("home"); setDrawerOpen(false); } },
                    { icon: Search,   label: "AI Search",    onClick: () => { setShowSearch(true); setDrawerOpen(false); } },
                    { icon: History,  label: "History",      onClick: () => { setShowHistory(true); setDrawerOpen(false); } },
                    { icon: Settings, label: "Settings",     onClick: () => { setShowSettings(true); setDrawerOpen(false); } },
                  ].map(item => (
                    <button key={item.label} onClick={item.onClick}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-stone-800/60 text-stone-300 hover:text-stone-100 transition text-sm">
                      <item.icon className="w-4 h-4 text-stone-500 shrink-0" />
                      {item.label}
                    </button>
                  ))}
                </div>
              </section>

              {/* 🔥 Hot Tools */}
              <section>
                <div className="text-[10px] font-mono uppercase tracking-widest text-amber-500/70 mb-2">🔥 Hot Tools</div>
                <div className="space-y-0.5">
                  {HOT_ITEMS.slice(0, 5).map(t => (
                    <button key={t.label}
                      onClick={() => t.action ? go(t.action) : visit(t.href)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-stone-800/60 text-stone-300 hover:text-amber-200 transition text-sm">
                      <span className="w-5 text-center shrink-0">{t.icon}</span>
                      {t.label}
                    </button>
                  ))}
                </div>
              </section>

              {/* Create */}
              <section>
                <div className="text-[10px] font-mono uppercase tracking-widest text-pink-500/70 mb-2">✨ Create</div>
                <div className="space-y-0.5">
                  {CREATE_ITEMS.slice(0, 6).map(c => {
                    const Icon = typeof c.icon === "string" ? null : c.icon;
                    return (
                      <button key={c.label} onClick={() => go(c.action)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-stone-800/60 text-stone-300 hover:text-pink-200 transition text-sm">
                        {Icon && <Icon className="w-4 h-4 text-stone-500 shrink-0" />}
                        {c.label}
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* Life */}
              <section>
                <div className="text-[10px] font-mono uppercase tracking-widest text-emerald-500/70 mb-2">🌿 Life</div>
                <div className="space-y-0.5">
                  {[
                    { icon: "💰", label: "Finance Tools",   href: "/tools/?cat=finance" },
                    { icon: "🏥", label: "Health Tools",    href: "/tools/?cat=health"  },
                    { icon: "🙏", label: "Spiritual Tools", href: "/tools/priest/"      },
                  ].map(c => (
                    <button key={c.label} onClick={() => visit(c.href)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-stone-800/60 text-stone-300 hover:text-emerald-200 transition text-sm">
                      <span className="w-5 text-center">{c.icon}</span>
                      {c.label}
                    </button>
                  ))}
                  {/* Experimental link */}
                  <button onClick={() => { setDrawerOpen(false); }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-violet-500/10 text-stone-400 hover:text-violet-300 transition text-sm border border-dashed border-stone-800 mt-1">
                    <span className="w-5 text-center">🧪</span>
                    Experimental Tools
                    <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-400 font-bold">Beta</span>
                  </button>
                </div>
              </section>

              {/* Tool categories */}
              <section>
                <div className="text-[10px] font-mono uppercase tracking-widest text-sky-500/70 mb-2">🔧 Tools</div>
                <div className="grid grid-cols-2 gap-1.5">
                  {TOOLS_CATS.map(c => (
                    <a key={c.label} href={c.href}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-stone-800/60 text-stone-400 hover:text-sky-200 transition text-xs border border-stone-800/60">
                      <span>{c.emoji}</span> {c.label}
                    </a>
                  ))}
                </div>
                <a href="/tools/" className="mt-2 flex items-center justify-center gap-1 py-2 rounded-xl border border-stone-800 hover:border-amber-400/30 text-xs text-stone-500 hover:text-amber-300 transition">
                  Browse all 60+ tools <ArrowRight className="w-3 h-3" />
                </a>
              </section>

              {/* Discover */}
              <section>
                <div className="text-[10px] font-mono uppercase tracking-widest text-stone-600 mb-2">Discover</div>
                <div className="space-y-0.5">
                  {[
                    { emoji: "📰", label: "Blog",            href: "/blog" },
                    { emoji: "🎬", label: "OTT Releases",    href: "/ott"  },
                    { emoji: "👥", label: "Community",        href: "/community" },
                    { emoji: "ℹ️",  label: "About",            href: "/about" },
                    { emoji: "📧", label: "Contact",          href: "/contact" },
                    { emoji: "🗺️", label: "Sitemap",          href: "/sitemap" },
                  ].map(item => (
                    <a key={item.label} href={item.href}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-stone-800/60 text-stone-400 hover:text-stone-200 transition text-sm">
                      <span className="w-5 text-center">{item.emoji}</span>
                      {item.label}
                      <ExternalLink className="w-3 h-3 ml-auto text-stone-700" />
                    </a>
                  ))}
                </div>
              </section>

              {/* Legal */}
              <section>
                <div className="text-[10px] font-mono uppercase tracking-widest text-stone-600 mb-2">⚖️ Legal</div>
                <div className="grid grid-cols-2 gap-1">
                  {[
                    { label: "Privacy Policy",    href: "/privacy"         },
                    { label: "Terms of Service",  href: "/terms"           },
                    { label: "AI Disclaimer",     href: "/ai-disclaimer"   },
                    { label: "Acceptable Use",    href: "/acceptable-use"  },
                    { label: "Content Policy",    href: "/content-policy"  },
                    { label: "Disclaimer",        href: "/disclaimer"      },
                  ].map(item => (
                    <a key={item.label} href={item.href}
                      className="text-xs text-stone-500 hover:text-amber-300 px-2 py-1.5 rounded-lg hover:bg-stone-800/40 transition">
                      {item.label}
                    </a>
                  ))}
                </div>
              </section>

              {/* Social + Request Tool */}
              <section className="space-y-2">
                <button onClick={() => { setShowRequestTool(true); setDrawerOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-amber-400/20 bg-amber-400/5 hover:border-amber-400/40 text-amber-300 transition text-sm font-medium">
                  <Send className="w-4 h-4" /> Request a Tool
                </button>
                <div className="flex gap-2">
                  <a href="https://www.youtube.com/@forjitai" target="_blank" rel="noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-red-500/25 bg-red-500/8 text-red-400 hover:bg-red-500/15 transition text-xs font-medium">
                    <YTIcon className="w-4 h-4" /> YouTube
                  </a>
                  <a href="https://www.instagram.com/forjitai" target="_blank" rel="noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-pink-500/25 bg-pink-500/8 text-pink-400 hover:bg-pink-500/15 transition text-xs font-medium">
                    <IGIcon className="w-4 h-4" /> Instagram
                  </a>
                </div>
              </section>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-stone-800 text-[11px] text-stone-600 text-center">
              © 2025 Forjit AI · All rights reserved
            </div>
          </div>
        </div>
      )}

      {/* Request Tool Modal */}
      {showRequestTool && <RequestToolModal onClose={() => setShowRequestTool(false)} />}
    </>
  );
}
