/* ─── Forjit AI · ToolHero ───────────────────────────────────────────────────
 *  Shows the SELECTED tool prominently at top.
 *  Related tools in same category shown below as "Explore More".
 *  Used inside the Create view.
 * ──────────────────────────────────────────────────────────────────────────*/

import React from "react";
import {
  Zap, Code2, FileText, Share2, Camera, Hash, UserCircle2,
  Film, TrendingUp, GraduationCap, BookOpen, PenLine, NotebookPen,
  Mic, Layers, Mail, ChefHat, UtensilsCrossed, Dumbbell, Calendar,
  ArrowRight,
} from "lucide-react";
import { CONTENT_TYPES, DOC_TYPES, PLANNER_TYPES } from "../constants";

/* ── Icon map ── */
const ICON_MAP = {
  Code2, FileText, Share2, Camera, Hash, UserCircle2, Film,
  TrendingUp, GraduationCap, BookOpen, PenLine, NotebookPen,
  Mic, Layers, Mail, ChefHat, UtensilsCrossed, Dumbbell, Calendar,
};

/* ── Tab color map ── */
const TAB_COLORS = {
  app:      { bg: "from-blue-500/10",   border: "border-blue-500/30",   accent: "text-blue-400",   badge: "bg-blue-500/15 text-blue-300"   },
  content:  { bg: "from-violet-500/10", border: "border-violet-500/30", accent: "text-violet-400", badge: "bg-violet-500/15 text-violet-300" },
  document: { bg: "from-sky-500/10",    border: "border-sky-500/30",    accent: "text-sky-400",    badge: "bg-sky-500/15 text-sky-300"    },
  planner:  { bg: "from-violet-500/10", border: "border-violet-500/30", accent: "text-violet-400", badge: "bg-violet-500/15 text-violet-300" },
};

/* ── Instagram sublabel highlight ── */
const INSTA_KEYS = new Set(["instagram_caption","hashtag","bio","reel_idea","viral_hook","social"]);

/* ── Get all tools for a tab ── */
function getTabTools(tab) {
  if (tab === "content")  return Object.entries(CONTENT_TYPES).map(([k,v]) => ({ key: k, ...v, tab: "content" }));
  if (tab === "document") return Object.entries(DOC_TYPES).map(([k,v])     => ({ key: k, ...v, tab: "document" }));
  if (tab === "planner")  return Object.entries(PLANNER_TYPES).map(([k,v]) => ({ key: k, ...v, tab: "planner" }));
  return [];
}

/* ── Get selected tool metadata ── */
function getActiveTool(tab, subtype) {
  if (tab === "content"  && CONTENT_TYPES[subtype])  return { ...CONTENT_TYPES[subtype],  key: subtype, tab };
  if (tab === "document" && DOC_TYPES[subtype])       return { ...DOC_TYPES[subtype],       key: subtype, tab };
  if (tab === "planner"  && PLANNER_TYPES[subtype])   return { ...PLANNER_TYPES[subtype],   key: subtype, tab };
  return null;
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════════════════ */
export default function ToolHero({ activeTab, activeSubtype, onSelectTool }) {
  const allTools = getTabTools(activeTab);
  const others = allTools.filter(t => t.key !== activeSubtype);

  if (activeTab === "app" || !activeSubtype || others.length === 0) return null;

  return (
    <div className="mt-6 mb-2">
      <div className="flex items-center gap-2 mb-3">
        <div className="h-px flex-1 bg-stone-800" />
        <span className="text-[10px] font-mono uppercase tracking-widest text-stone-600 px-2">
          Explore More Tools
        </span>
        <div className="h-px flex-1 bg-stone-800" />
      </div>
      <div className="flex flex-wrap gap-1.5">
        {others.map(tool => {
          const Icon = ICON_MAP[tool.icon] || Zap;
          const toolIsInsta = INSTA_KEYS.has(tool.key);
          return (
            <button
              key={tool.key}
              onClick={() => onSelectTool(tool.tab, tool.key)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-stone-800 bg-stone-900/60 hover:border-amber-400/30 hover:bg-amber-400/5 text-xs text-stone-400 hover:text-stone-200 transition group"
            >
              <Icon className={`w-3 h-3 shrink-0 ${toolIsInsta ? "text-pink-400/60 group-hover:text-pink-300" : "text-stone-600 group-hover:text-amber-400"} transition`} />
              {tool.label}
              <ArrowRight className="w-3 h-3 text-stone-700 group-hover:text-stone-400 transition" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
