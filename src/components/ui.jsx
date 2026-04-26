/* ─── Forjit AI · UI Primitives ─────────────────────────────────────────────
 *  Shared UI building blocks used across the app.
 *  No state — pure render components.
 * ──────────────────────────────────────────────────────────────────────────*/

import React from "react";
import { X, Copy, Check } from "lucide-react";

/* ── Centered modal overlay ─────────────────────────────────────────────── */
export function Modal({ onClose, icon, title, children }) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-stone-950/70 backdrop-blur-sm" />
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md bg-stone-900 border border-stone-800 rounded-xl overflow-hidden slide-up max-h-[90vh] flex flex-col"
      >
        <div className="p-4 border-b border-stone-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            {icon}
            <div className="font-display text-lg">{title}</div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-stone-800 rounded">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-5 overflow-y-auto scrollbar-thin">{children}</div>
      </div>
    </div>
  );
}

/* ── Right-side slide-in drawer ─────────────────────────────────────────── */
export function Drawer({ onClose, icon, title, children, wide = false }) {
  return (
    <div className="fixed inset-0 z-40 flex" onClick={onClose}>
      <div className="flex-1 bg-stone-950/70 backdrop-blur-sm" />
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full ${wide ? "max-w-2xl" : "max-w-md"} bg-stone-900 border-l border-stone-800 overflow-y-auto scrollbar-thin slide-up`}
      >
        <div className="p-5 border-b border-stone-800 flex items-center justify-between sticky top-0 bg-stone-900 z-10">
          <div className="flex items-center gap-2">
            {icon}
            <div className="font-display text-xl">{title}</div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-stone-800 rounded">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

/* ── Small tab-style toggle button ──────────────────────────────────────── */
export function TabBtn({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded text-xs font-medium transition flex items-center gap-1.5 ${
        active
          ? "bg-stone-800 text-amber-300"
          : "text-stone-400 hover:text-stone-200 hover:bg-stone-800/50"
      }`}
    >
      {icon} {label}
    </button>
  );
}

/* ── Copyable URL row ───────────────────────────────────────────────────── */
export function LinkRow({ label, url, copied, onCopy }) {
  return (
    <div className="flex items-center gap-2 bg-stone-950 border border-stone-800 rounded px-2.5 py-1.5">
      <span className="text-[10px] font-mono uppercase tracking-widest text-stone-500 shrink-0">
        {label}
      </span>
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="text-[12px] text-stone-200 hover:text-amber-300 truncate flex-1 font-mono"
      >
        {url}
      </a>
      <button onClick={onCopy} className="shrink-0 p-1 text-stone-500 hover:text-stone-200">
        {copied ? (
          <Check className="w-3.5 h-3.5 text-emerald-400" />
        ) : (
          <Copy className="w-3.5 h-3.5" />
        )}
      </button>
    </div>
  );
}

/* ── Small stat card (admin/data panels) ────────────────────────────────── */
export function Stat({ label, value, color = "amber" }) {
  const colors = {
    amber:   "text-amber-300",
    emerald: "text-emerald-300",
    rose:    "text-rose-300",
    sky:     "text-sky-300",
  };
  return (
    <div className="rounded-lg border border-stone-800 bg-stone-950/50 p-3 text-center">
      <div className={`text-xl font-display font-semibold ${colors[color]}`}>{value}</div>
      <div className="text-[10px] font-mono uppercase tracking-wider text-stone-500 mt-0.5">
        {label}
      </div>
    </div>
  );
}
