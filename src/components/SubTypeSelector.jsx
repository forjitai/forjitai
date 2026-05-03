/* ─── Forjit AI · Sub-Type Selector ────────────────────────────────────────
 *  The type-picker buttons shown below the main tab bar.
 *  App tab    → Web / Mobile toggle
 *  Planner tab → meal/recipe/workout/diary buttons
 *  Document tab → resume/letter/report/presentation buttons
 * ──────────────────────────────────────────────────────────────────────────*/

import React from "react";
import { Monitor, Smartphone, Calendar, FileText, GraduationCap, BookOpen, PenLine, NotebookPen, Mic, Share2 } from "lucide-react";
import { PLANNER_TYPES, DOC_TYPES, CONTENT_TYPES } from "../constants";

const ICON_MAP = {
  Calendar, FileText,
  /* lazy-load the rest from lucide to keep bundle small */
  UtensilsCrossed: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/>
      <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>
    </svg>
  ),
  ChefHat: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z"/>
      <line x1="6" x2="18" y1="17" y2="17"/>
    </svg>
  ),
  Dumbbell: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M14.4 14.4 9.6 9.6"/><path d="M18.657 21.485a2 2 0 1 1-2.829-2.828l-1.767 1.768a2 2 0 1 1-2.829-2.829l6.364-6.364a2 2 0 1 1 2.829 2.829l-1.768 1.767a2 2 0 1 1 2.828 2.829z"/><path d="m21.5 21.5-1.4-1.4"/><path d="M3.9 3.9 2.5 2.5"/><path d="M6.404 12.768a2 2 0 1 1-2.829-2.829l1.768-1.767a2 2 0 1 1-2.828-2.829l6.364-6.364a2 2 0 1 1 2.828 2.828L9.94 3.576a2 2 0 1 1 2.829 2.828z"/>
    </svg>
  ),
  NotebookPen: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M13.4 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7.4"/><path d="M2 6h4"/><path d="M2 10h4"/><path d="M2 14h4"/><path d="M2 18h4"/><path d="M21.378 5.626a1 1 0 1 0-3.004-3.004l-5.01 5.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z"/>
    </svg>
  ),
  Mail: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" {...p}>
      <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
    </svg>
  ),
  Layers: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m6.08 9.5-3.5 1.6a1 1 0 0 0 0 1.81l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9a1 1 0 0 0 0-1.83l-3.5-1.59"/><path d="m6.08 14.5-3.5 1.6a1 1 0 0 0 0 1.81l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9a1 1 0 0 0 0-1.83l-3.5-1.59"/>
    </svg>
  ),
};

function Icon({ name, className }) {
  const C = ICON_MAP[name];
  return C ? <C className={className} /> : null;
}

/* ── App tab: Web / Mobile toggle ───────────────────────────────────────── */
export function AppSubTypeSelector({ appSubType, setAppSubType }) {
  return (
    <div className="mb-4 flex gap-2 justify-center">
      <button
        onClick={() => setAppSubType("web")}
        className={`px-4 py-1.5 rounded-md text-xs font-medium border transition flex items-center gap-1.5 ${
          appSubType === "web"
            ? "bg-amber-400 text-stone-950 border-amber-400"
            : "bg-stone-900 border-stone-800 text-stone-400 hover:border-stone-700"
        }`}
      >
        <Monitor className="w-3.5 h-3.5" /> Web App
      </button>
      <button
        onClick={() => setAppSubType("mobile")}
        className={`px-4 py-1.5 rounded-md text-xs font-medium border transition flex items-center gap-1.5 ${
          appSubType === "mobile"
            ? "bg-emerald-400 text-stone-950 border-emerald-400"
            : "bg-stone-900 border-stone-800 text-stone-400 hover:border-stone-700"
        }`}
      >
        <Smartphone className="w-3.5 h-3.5" /> Mobile App
      </button>
    </div>
  );
}

/* ── Planner tab: meal/recipe/workout/diary buttons ─────────────────────── */
export function PlannerSubTypeSelector({ plannerType, setPlannerType }) {
  return (
    <div className="mb-4 -mx-2 px-2 overflow-x-auto scrollbar-thin">
      <div className="flex items-center gap-1.5 pb-1 min-w-max justify-center">
        {Object.entries(PLANNER_TYPES).map(([key, t]) => {
          const active = plannerType === key;
          return (
            <button
              key={key}
              onClick={() => setPlannerType(key)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium border transition flex items-center gap-1.5 whitespace-nowrap ${
                active
                  ? "bg-emerald-400 text-stone-950 border-emerald-400"
                  : "bg-stone-900 border-stone-800 text-stone-400 hover:border-stone-700"
              }`}
            >
              <Icon name={t.icon} className="w-3.5 h-3.5" />
              {t.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ── Document tab: resume/letter/report/presentation buttons ────────────── */
export function DocSubTypeSelector({ docType, setDocType }) {
  return (
    <div className="mb-4 -mx-2 px-2 overflow-x-auto scrollbar-thin">
      <div className="flex items-center gap-1.5 pb-1 min-w-max justify-center">
        {Object.entries(DOC_TYPES).map(([key, t]) => {
          const active = docType === key;
          return (
            <button
              key={key}
              onClick={() => setDocType(key)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium border transition flex items-center gap-1.5 whitespace-nowrap ${
                active
                  ? "bg-sky-400 text-stone-950 border-sky-400"
                  : "bg-stone-900 border-stone-800 text-stone-400 hover:border-stone-700"
              }`}
            >
              <Icon name={t.icon} className="w-3.5 h-3.5" />
              {t.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ── Content tab: lesson/sermon/blog/notes/speech/social buttons ─────────── */
const CONTENT_ICON_MAP = { GraduationCap, BookOpen, PenLine, NotebookPen, Mic, Share2 };

export function ContentSubTypeSelector({ contentType, setContentType }) {
  return (
    <div className="mb-4 -mx-2 px-2 overflow-x-auto scrollbar-thin">
      <div className="flex items-center gap-1.5 pb-1 min-w-max">
        {Object.entries(CONTENT_TYPES).map(([key, t]) => {
          const active = contentType === key;
          const IconComp = CONTENT_ICON_MAP[t.icon] || FileText;
          return (
            <button
              key={key}
              onClick={() => setContentType(key)}
              className={`px-3 py-2 rounded-lg text-xs font-medium border transition flex items-center gap-1.5 whitespace-nowrap ${
                active
                  ? "bg-violet-500 text-white border-violet-500 shadow-md shadow-violet-500/20"
                  : "bg-stone-900 border-stone-800 text-stone-400 hover:border-stone-700 hover:text-stone-200"
              }`}
            >
              <IconComp className="w-3.5 h-3.5 shrink-0" />
              <span>{t.label}</span>
              {t.sublabel && (
                <span className={`text-[9px] px-1.5 py-0.5 rounded font-medium uppercase tracking-wide ${
                  active ? "bg-white/20 text-white" : "bg-stone-800 text-stone-500"
                }`}>{t.sublabel}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
