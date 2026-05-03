/* ─── Forjit AI · Logo Component ────────────────────────────────────────────
 *  Inline SVG logo mark + wordmark.
 *  gradient: amber #f59e0b → violet #8b5cf6
 *  Works on any dark background.
 * ──────────────────────────────────────────────────────────────────────────*/

import React from "react";

/* Icon-only mark — used in favicon, OG, small contexts */
export function ForjitMark({ size = 36, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Forjit AI"
    >
      <defs>
        <linearGradient id="fj-bg" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
        <linearGradient id="fj-bolt" x1="20" y1="5" x2="20" y2="35" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#ffffff" stopOpacity="0.97" />
          <stop offset="100%" stopColor="#fde68a" stopOpacity="0.82" />
        </linearGradient>
        <filter id="fj-glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Background rounded square */}
      <rect width="40" height="40" rx="10" fill="url(#fj-bg)" />

      {/* Subtle inner glow ring */}
      <rect width="40" height="40" rx="10" fill="none"
            stroke="rgba(255,255,255,0.12)" strokeWidth="1" />

      {/* Lightning bolt — main */}
      <path
        d="M24.5 5.5 L14 21.5 L20.5 21.5 L15.5 34.5 L26 18.5 L19.5 18.5 Z"
        fill="url(#fj-bolt)"
        filter="url(#fj-glow)"
      />

      {/* Circuit dot — top right */}
      <circle cx="29" cy="10" r="2" fill="rgba(255,255,255,0.35)" />
      <line x1="27" y1="10" x2="24.5" y2="10" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />

      {/* Circuit dot — bottom left */}
      <circle cx="11" cy="30" r="1.5" fill="rgba(255,255,255,0.3)" />
      <line x1="12.5" y1="30" x2="15.5" y2="30" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
    </svg>
  );
}

/* Full logo: mark + wordmark */
export default function ForjitLogo({
  size = 36,
  showTagline = true,
  className = "",
}) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <ForjitMark size={size} />
      <div className="leading-tight select-none">
        <div className="font-display text-xl font-semibold tracking-tight text-stone-100">
          Forjit{" "}
          <span
            style={{
              background: "linear-gradient(135deg, #f59e0b 0%, #a78bfa 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            AI
          </span>
        </div>
        {showTagline && (
          <div className="text-[10px] text-stone-500 font-mono uppercase tracking-widest">
            Free AI Platform
          </div>
        )}
      </div>
    </div>
  );
}
