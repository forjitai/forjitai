/* ─── Forjit AI · Auth Modal ────────────────────────────────────────────────
 *  Rendered inside a <Modal>.
 *  Handles both "signed in" profile view and "sign in" form.
 * ──────────────────────────────────────────────────────────────────────────*/

import React from "react";
import { LogIn, LogOut, AlertCircle } from "lucide-react";

export default function AuthModal({
  user,
  authEmail, setAuthEmail,
  authName, setAuthName,
  authError,
  signIn, logout,
  onClose,
}) {
  /* ── Already signed in → show profile ──────────────────────────────── */
  if (user) {
    return (
      <div className="space-y-4">
        <div className="bg-stone-950 border border-stone-800 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center font-semibold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-medium text-stone-100 truncate">{user.name}</div>
              <div className="text-xs text-stone-500 truncate">{user.email}</div>
            </div>
          </div>
          {user.isAdmin && (
            <span className="inline-block text-[10px] font-mono px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded">
              ADMIN
            </span>
          )}
          <div className="mt-3 text-[10px] font-mono text-stone-500">
            Member since {new Date(user.createdAt).toLocaleDateString()}
          </div>
        </div>
        <button
          onClick={() => { logout(); onClose(); }}
          className="w-full px-4 py-2.5 rounded-md border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 transition flex items-center justify-center gap-2"
        >
          <LogOut className="w-4 h-4" /> Sign out
        </button>
      </div>
    );
  }

  /* ── Not signed in → show form ──────────────────────────────────────── */
  return (
    <div className="space-y-3">
      <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-3 mb-2">
        <div className="text-xs text-emerald-200 leading-relaxed">
          <strong className="text-emerald-100">Signup is optional.</strong>{" "}
          Close this and keep using the app freely.
        </div>
        <div className="text-[10px] text-stone-400 mt-1.5 leading-relaxed">
          Sign in to: save to Community Gallery · attribute feedback · access Admin (for admins)
        </div>
      </div>

      <input
        type="email"
        value={authEmail}
        onChange={(e) => setAuthEmail(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") signIn(); }}
        placeholder="you@example.com"
        className="w-full px-3 py-2.5 bg-stone-950 border border-stone-800 rounded-md text-stone-100 placeholder-stone-600 outline-none focus:border-amber-400/50"
        autoFocus
      />
      <input
        type="text"
        value={authName}
        onChange={(e) => setAuthName(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") signIn(); }}
        placeholder="Your name (optional)"
        className="w-full px-3 py-2.5 bg-stone-950 border border-stone-800 rounded-md text-stone-100 placeholder-stone-600 outline-none focus:border-amber-400/50"
      />

      {authError && (
        <div className="text-xs text-rose-400 flex items-start gap-1">
          <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
          {authError}
        </div>
      )}

      <button
        onClick={signIn}
        className="w-full px-4 py-2.5 rounded-md bg-amber-400 hover:bg-amber-300 text-stone-950 font-medium text-sm flex items-center justify-center gap-2"
      >
        <LogIn className="w-4 h-4" /> Continue
      </button>
      <button
        onClick={onClose}
        className="w-full px-3 py-2 text-xs text-stone-500 hover:text-stone-300 transition"
      >
        Skip — use as guest
      </button>
      <p className="text-[10px] text-stone-500 text-center leading-relaxed">
        Initial phase — no email verification yet.{" "}
        <span className="font-mono text-amber-400/60">forjitai@gmail.com</span>
      </p>
    </div>
  );
}
