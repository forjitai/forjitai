/* ─── Forjit AI · Settings Panel ───────────────────────────────────────────
 *  Rendered inside a <Drawer> in App.jsx.
 *  All state lives in App — this is pure UI.
 * ──────────────────────────────────────────────────────────────────────────*/

import React from "react";
import { Check, ExternalLink } from "lucide-react";
import { PROVIDERS } from "../constants";

export default function SettingsPanel({
  provider, setProvider,
  model, setModel,
  apiKey, setApiKey,
  showKey, setShowKey,
  ghToken, setGhToken,
  showGhToken, setShowGhToken,
  rememberKeys, setRememberKeys,
  onClose, setError,
}) {
  return (
    <div className="space-y-5">
      {/* API key security notice — always visible */}
      <div style={{
        background: 'rgba(34,197,94,0.06)',
        border: '1px solid rgba(34,197,94,0.2)',
        borderRadius: 8,
        padding: '12px 14px',
        marginBottom: 12,
      }}>
        <div className="text-[12px] text-emerald-300 font-semibold mb-1">
          🔒 Your API key is private
        </div>
        <ul className="text-[11px] text-stone-400 leading-relaxed space-y-1">
          <li>✅ Stored <strong className="text-stone-300">only in your browser</strong> (IndexedDB — local to your device)</li>
          <li>✅ Sent <strong className="text-stone-300">directly</strong> from your browser to {PROVIDERS[provider].name} — never via our servers</li>
          <li>✅ <strong className="text-stone-300">Never</strong> in any URL, log, or analytics</li>
          <li>✅ Forjit AI <strong className="text-stone-300">cannot see</strong> your key at any time</li>
        </ul>
        <div className="text-[10px] text-stone-500 mt-2 pt-2 border-t border-stone-800">
          ⚠ On shared/public computers — uncheck "Remember keys" below so your key clears on refresh.
        </div>
      </div>

      {/* Provider */}
      <div>
        <div className="text-[11px] font-mono uppercase tracking-widest text-stone-500 mb-2">Provider</div>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(PROVIDERS).map(([id, p]) => (
            <button
              key={id}
              onClick={() => { setProvider(id); setModel(PROVIDERS[id].models[0].id); }}
              className={`p-3 rounded-lg border text-left transition ${
                provider === id ? "border-amber-400/50 bg-amber-400/5" : "border-stone-800 hover:border-stone-700"
              }`}
            >
              <div className="text-sm font-medium">{p.name}</div>
              <div className="text-[11px] text-stone-500">{p.blurb}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Model */}
      <div>
        <div className="text-[11px] font-mono uppercase tracking-widest text-stone-500 mb-2">Model</div>
        <div className="space-y-1.5">
          {PROVIDERS[provider].models.map((m) => (
            <button
              key={m.id}
              onClick={() => setModel(m.id)}
              className={`w-full p-3 rounded-lg border text-left transition ${
                model === m.id ? "border-amber-400/50 bg-amber-400/5" : "border-stone-800 hover:border-stone-700"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">{m.label}</div>
                {model === m.id && <Check className="w-4 h-4 text-amber-400" />}
              </div>
              {m.note && <div className="text-[11px] text-stone-500 mt-0.5">{m.note}</div>}
            </button>
          ))}
        </div>
      </div>

      {/* API Key */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="text-[11px] font-mono uppercase tracking-widest text-stone-500">API Key</div>
          <a
            href={PROVIDERS[provider].keyUrl}
            target="_blank"
            rel="noreferrer"
            className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1"
          >
            Get key <ExternalLink className="w-3 h-3" />
          </a>
        </div>
        <div className="relative">
          <input
            type={showKey ? "text" : "password"}
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder={provider === "groq" ? "gsk_…" : "sk-or-…"}
            className="w-full px-3 py-2.5 pr-20 bg-stone-950 border border-stone-800 rounded-md text-sm font-mono outline-none focus:border-amber-400/50"
          />
          <button
            onClick={() => setShowKey(!showKey)}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 text-[11px] text-stone-500 hover:text-stone-300"
          >
            {showKey ? "Hide" : "Show"}
          </button>
        </div>
      </div>

      {/* GitHub Token */}
      <div className="pt-4 border-t border-stone-800">
        <div className="flex items-center justify-between mb-2">
          <div className="text-[11px] font-mono uppercase tracking-widest text-stone-500">
            GitHub Token <span className="text-stone-600 normal-case">(optional)</span>
          </div>
          <a
            href="https://github.com/settings/tokens/new?scopes=gist&description=Forjit%20AI"
            target="_blank"
            rel="noreferrer"
            className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1"
          >
            Create <ExternalLink className="w-3 h-3" />
          </a>
        </div>
        <div className="relative">
          <input
            type={showGhToken ? "text" : "password"}
            value={ghToken}
            onChange={(e) => setGhToken(e.target.value)}
            placeholder="ghp_…"
            className="w-full px-3 py-2.5 pr-20 bg-stone-950 border border-stone-800 rounded-md text-sm font-mono outline-none focus:border-amber-400/50"
          />
          <button
            onClick={() => setShowGhToken(!showGhToken)}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 text-[11px] text-stone-500"
          >
            {showGhToken ? "Hide" : "Show"}
          </button>
        </div>
      </div>

      {/* Remember keys */}
      <label className="flex items-start gap-2 p-3 rounded-lg border border-stone-800 bg-stone-950/50 cursor-pointer hover:border-stone-700 transition">
        <input
          type="checkbox"
          checked={rememberKeys}
          onChange={(e) => setRememberKeys(e.target.checked)}
          className="mt-0.5 w-4 h-4 accent-amber-400"
        />
        <div className="flex-1 text-sm">
          <div className="text-stone-200">Remember keys on this device</div>
          <div className="text-[11px] text-stone-500 mt-0.5 leading-relaxed">
            Encrypted in your browser's IndexedDB. <strong className="text-stone-400">Forjit AI servers never receive your key.</strong> Uncheck on shared or public computers — key clears on every refresh.
          </div>
        </div>
      </label>
      {!rememberKeys && (
        <p className="text-[10px] text-amber-400/70 flex items-center gap-1">
          ⚠ Key not saved — you'll need to re-enter it each session.
        </p>
      )}

      <button
        onClick={() => { onClose(); setError(""); }}
        disabled={!apiKey.trim()}
        className="w-full px-4 py-2.5 rounded-md bg-amber-400 hover:bg-amber-300 text-stone-950 font-medium text-sm disabled:bg-stone-800 disabled:text-stone-600"
      >
        Save & close
      </button>

      <div className="text-center pt-2 border-t border-stone-800 mt-2">
        <span className="text-[10px] text-stone-600">
          <a href="/privacy" target="_blank" rel="noreferrer" className="hover:text-stone-400">Privacy Policy</a>
          {" · "}
          <a href="/terms" target="_blank" rel="noreferrer" className="hover:text-stone-400">Terms of Service</a>
          {" · "}
          <a href="/contact" target="_blank" rel="noreferrer" className="hover:text-stone-400">Contact</a>
        </span>
      </div>
    </div>
  );
}
