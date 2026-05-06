/* ─── Forjit AI · Experimental Section ──────────────────────────────────────
 *  All PLANNER_TYPES tools live here — isolated, lazy-rendered, clearly labelled.
 *  Main dashboard is completely clean of planner references.
 * ──────────────────────────────────────────────────────────────────────────*/

import React, { useState, lazy, Suspense } from "react";
import {
  FlaskConical, ChevronDown, ChevronUp, AlertTriangle,
  UtensilsCrossed, Calendar, ChefHat, Dumbbell, NotebookPen, Loader2,
} from "lucide-react";
import { PLANNER_TYPES } from "../constants";

/* ── Feature flag — all planners are experimental ──────────────────────── */
export const EXPERIMENTAL_TOOLS = Object.entries(PLANNER_TYPES).map(([key, t]) => ({
  key,
  ...t,
  category: "planner",
  isExperimental: true,
}));

const ICON_MAP = {
  UtensilsCrossed, Calendar, ChefHat, Dumbbell, NotebookPen,
};

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════════════════ */
export default function ExperimentalSection({ onGoToCreate }) {
  const [open, setOpen] = useState(false);

  return (
    <section className="mt-2">
      {/* ── Toggle header ── */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-stone-800 bg-stone-900/40 hover:border-violet-500/30 hover:bg-violet-500/5 transition-all group"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-violet-500/15 flex items-center justify-center">
            <FlaskConical className="w-3.5 h-3.5 text-violet-400" />
          </div>
          <div className="text-left">
            <span className="text-sm font-medium text-stone-200 group-hover:text-violet-200 transition">
              🧪 Experimental Tools
            </span>
            <span className="ml-2 text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded bg-violet-500/15 text-violet-400">
              Beta
            </span>
          </div>
        </div>
        {open
          ? <ChevronUp className="w-4 h-4 text-stone-500" />
          : <ChevronDown className="w-4 h-4 text-stone-500" />
        }
      </button>

      {/* ── Lazy-rendered content ── */}
      {open && (
        <div className="mt-2 rounded-xl border border-violet-500/20 bg-gradient-to-br from-violet-500/5 to-stone-950 p-4 slide-up">

          {/* Warning banner */}
          <div className="flex items-start gap-2.5 p-3 rounded-lg bg-amber-400/8 border border-amber-400/20 mb-4">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-300/80 leading-relaxed">
              This section contains features under testing. Results may vary. 
              Outputs are AI-generated and should be reviewed before use.
            </p>
          </div>

          {/* Tool grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {EXPERIMENTAL_TOOLS.map((tool) => {
              const Icon = ICON_MAP[tool.icon] || FlaskConical;
              return (
                <button
                  key={tool.key}
                  onClick={() => onGoToCreate("planner", tool.key)}
                  className="group relative flex flex-col items-start gap-2 p-3 rounded-xl border border-stone-800 bg-stone-900/60 hover:border-violet-500/40 hover:bg-violet-500/8 transition-all text-left"
                >
                  {/* Beta badge */}
                  <span className="absolute top-2 right-2 text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-400">
                    Beta
                  </span>

                  <div className="w-8 h-8 rounded-lg bg-stone-800 group-hover:bg-violet-500/15 flex items-center justify-center transition-colors">
                    <Icon className="w-4 h-4 text-stone-400 group-hover:text-violet-300 transition-colors" />
                  </div>

                  <div>
                    <div className="text-xs font-medium text-stone-200 group-hover:text-violet-100 transition leading-tight">
                      {tool.label}
                    </div>
                    <div className="text-[10px] text-stone-600 mt-0.5 leading-tight">
                      {tool.placeholder?.split(",")[0]}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <p className="mt-3 text-[10px] text-stone-700 text-center">
            Planner tools are in active development · More coming soon
          </p>
        </div>
      )}
    </section>
  );
}
