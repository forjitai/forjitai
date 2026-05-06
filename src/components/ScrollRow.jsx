/* ─── Forjit AI · ScrollRow ──────────────────────────────────────────────────
 *  Horizontal scroll container with:
 *  - Mouse drag to scroll (desktop)
 *  - Touch swipe (mobile, native)
 *  - Click vs drag conflict prevention (5px threshold)
 *  - Edge fade indicators
 *  - Left/right arrow controls (desktop)
 *  - Swipe hint on mobile
 * ──────────────────────────────────────────────────────────────────────────*/

import React, { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ScrollRow({ children, className = "", gap = 12, hint = true }) {
  const ref       = useRef(null);
  const [isDragging, setIsDragging]   = useState(false);
  const [startX,    setStartX]        = useState(0);
  const [scrollLeft, setScrollLeft]   = useState(0);
  const [dragDist,   setDragDist]     = useState(0);
  const [canScrollL, setCanScrollL]   = useState(false);
  const [canScrollR, setCanScrollR]   = useState(true);
  const [showHint,   setShowHint]     = useState(true);

  /* ── Track scroll position to show/hide arrows ─ */
  const updateArrows = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setCanScrollL(el.scrollLeft > 4);
    setCanScrollR(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
    if (el.scrollLeft > 10) setShowHint(false);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    updateArrows();
    el.addEventListener("scroll", updateArrows, { passive: true });
    return () => el.removeEventListener("scroll", updateArrows);
  }, [updateArrows]);

  /* ── Mouse drag handlers ── */
  const onMouseDown = (e) => {
    setIsDragging(true);
    setDragDist(0);
    setStartX(e.pageX - ref.current.offsetLeft);
    setScrollLeft(ref.current.scrollLeft);
    ref.current.style.cursor = "grabbing";
    ref.current.style.userSelect = "none";
  };

  const onMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x    = e.pageX - ref.current.offsetLeft;
    const walk = (x - startX) * 1.2;
    setDragDist(Math.abs(walk));
    ref.current.scrollLeft = scrollLeft - walk;
  };

  const onMouseUp = () => {
    setIsDragging(false);
    if (ref.current) {
      ref.current.style.cursor = "grab";
      ref.current.style.userSelect = "";
    }
  };

  /* ── Arrow scroll ── */
  const scrollBy = (dir) => {
    ref.current?.scrollBy({ left: dir * 280, behavior: "smooth" });
  };

  /* ── Expose drag distance via data attr so children can check ── */
  const onClickCapture = (e) => {
    if (dragDist > 5) {
      e.stopPropagation();
      e.preventDefault();
      setDragDist(0);
    }
  };

  return (
    <div className="relative group/scroll">

      {/* Left arrow */}
      {canScrollL && (
        <button
          onClick={() => scrollBy(-1)}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 z-10
            hidden md:flex w-8 h-8 rounded-full bg-stone-900 border border-stone-700
            items-center justify-center shadow-lg hover:bg-stone-800 hover:border-stone-600
            transition-all opacity-0 group-hover/scroll:opacity-100"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-4 h-4 text-stone-300" />
        </button>
      )}

      {/* Right arrow */}
      {canScrollR && (
        <button
          onClick={() => scrollBy(1)}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 z-10
            hidden md:flex w-8 h-8 rounded-full bg-stone-900 border border-stone-700
            items-center justify-center shadow-lg hover:bg-stone-800 hover:border-stone-600
            transition-all opacity-0 group-hover/scroll:opacity-100"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-4 h-4 text-stone-300" />
        </button>
      )}

      {/* Left fade edge */}
      {canScrollL && (
        <div className="absolute left-0 top-0 bottom-0 w-8 z-[5] pointer-events-none
          bg-gradient-to-r from-stone-950 to-transparent" />
      )}

      {/* Right fade edge */}
      {canScrollR && (
        <div className="absolute right-0 top-0 bottom-0 w-10 z-[5] pointer-events-none
          bg-gradient-to-l from-stone-950 to-transparent" />
      )}

      {/* Scroll container */}
      <div
        ref={ref}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onClickCapture={onClickCapture}
        className={`flex overflow-x-auto scrollbar-none pb-2 -webkit-overflow-scrolling-touch ${className}`}
        style={{
          gap,
          cursor: "grab",
          scrollBehavior: "smooth",
          WebkitOverflowScrolling: "touch",
          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}
      >
        {children}
      </div>

      {/* Mobile swipe hint */}
      {hint && showHint && canScrollR && (
        <div className="flex md:hidden items-center justify-end gap-1 mt-1 pr-1 pointer-events-none">
          <span className="text-[10px] text-stone-600 animate-pulse">swipe</span>
          <ChevronRight className="w-3 h-3 text-stone-600 animate-pulse" />
        </div>
      )}
    </div>
  );
}
