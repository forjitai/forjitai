/* ─── Forjit AI · Logo Component ────────────────────────────────────────────
 *  Usage: <ForjitLogo size="md" />   size: sm | md | lg
 *  Gradient: amber #f59e0b → violet #7c3aed  (matches favicon + brand)
 * ──────────────────────────────────────────────────────────────────────────*/

import React from "react";

const sizes = {
  sm: { box: 28, text: 14, tag: 9  },
  md: { box: 34, text: 17, tag: 10 },
  lg: { box: 48, text: 24, tag: 12 },
};

export default function ForjitLogo({ size = "md", showTag = true }) {
  const s = sizes[size] || sizes.md;
  const uid = `fj${Math.random().toString(36).slice(2,7)}`;

  return (
    <div className="flex items-center gap-2.5 select-none" aria-label="Forjit AI">
      <svg
        width={s.box} height={s.box} viewBox="0 0 34 34" fill="none"
        xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0"
        style={{ filter: "drop-shadow(0 2px 8px rgba(124,58,237,0.40))" }}
      >
        <defs>
          <linearGradient id={`${uid}-bg`} x1="0" y1="0" x2="34" y2="34" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
          <linearGradient id={`${uid}-bolt`} x1="17" y1="4" x2="17" y2="30" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#ffffff" stopOpacity="0.97" />
            <stop offset="100%" stopColor="#fde68a" stopOpacity="0.82" />
          </linearGradient>
          <filter id={`${uid}-glow`} x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="1.2" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        <rect width="34" height="34" rx="9" fill={`url(#${uid}-bg)`} />
        <rect width="34" height="34" rx="9" fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth="1" />
        <path d="M20.5 5 L12 17.5 L17.5 17.5 L13.5 29 L22 16.5 L16.5 16.5 Z"
              fill={`url(#${uid}-bolt)`} filter={`url(#${uid}-glow)`} />
        <circle cx="24" cy="9"  r="2"   fill="rgba(255,255,255,0.38)" />
        <circle cx="10" cy="25" r="1.4" fill="rgba(255,255,255,0.24)" />
        <line x1="22" y1="9" x2="20.5" y2="9" stroke="rgba(255,255,255,0.22)" strokeWidth="1"/>
      </svg>
      <div className="leading-none">
        <div style={{ fontSize: s.text, fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.15 }}
             className="font-display text-stone-100">
          Forjit{" "}
          <span style={{
            background: "linear-gradient(135deg, #f59e0b 0%, #a78bfa 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
          }}>AI</span>
        </div>
        {showTag && (
          <div style={{ fontSize: s.tag, letterSpacing: "0.13em", lineHeight: 1 }}
               className="font-mono text-stone-500 uppercase mt-0.5">
            Free AI Platform
          </div>
        )}
      </div>
    </div>
  );
}
