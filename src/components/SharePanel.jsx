/* ─── Forjit AI · Share / Export Panel ─────────────────────────────────────
 *  Rendered inside a <Drawer>.
 *  Handles ZIP download, Capacitor Android, PWABuilder, GitHub Gist deploy.
 * ──────────────────────────────────────────────────────────────────────────*/

import React from "react";
import {
  Package, Download, Loader2, Smartphone, ExternalLink,
  AlertCircle, Rocket,
} from "lucide-react";

/* Inline GitHub SVG — not in lucide-react */
function Github({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

export default function SharePanel({
  outputType,
  zipping, deploying, deployError,
  deployResult,
  ghToken,
  downloadProjectZip,
  downloadRaw,
  downloadCapacitorZip,
  deployToGist,
  onOpenSettings,
}) {
  return (
    <div className="space-y-4">

      {/* Project ZIP */}
      <button
        onClick={downloadProjectZip}
        disabled={zipping}
        className="w-full px-4 py-3 rounded-lg border border-amber-400/40 bg-amber-400/5 text-sm text-amber-200 hover:bg-amber-400/10 transition flex items-center justify-center gap-2 disabled:opacity-40"
      >
        {zipping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Package className="w-4 h-4" />}
        Download Project ZIP
      </button>

      <button
        onClick={downloadRaw}
        className="w-full px-4 py-2.5 rounded-md border border-stone-800 hover:border-stone-700 text-sm text-stone-300 hover:text-stone-100 transition flex items-center justify-center gap-2"
      >
        <Download className="w-4 h-4" />
        Just the {outputType === "html" ? ".html" : ".md"} file
      </button>

      {/* Android — HTML only */}
      {outputType === "html" && (
        <div className="border-t border-stone-800 pt-4">
          <div className="text-[11px] font-mono uppercase tracking-widest text-stone-500 mb-2">Android APK</div>

          {/* Capacitor ZIP */}
          <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-3 mb-2">
            <div className="flex items-start gap-2 mb-2">
              <Package className="w-4 h-4 text-blue-300 mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-stone-100 flex items-center gap-2">
                  Capacitor Project
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-blue-400/20 text-blue-300 uppercase">
                    real apk
                  </span>
                </div>
                <div className="text-[11px] text-stone-400 mt-0.5">
                  Ready-to-build. Needs Android Studio for final APK.
                </div>
              </div>
            </div>
            <button
              onClick={downloadCapacitorZip}
              disabled={zipping}
              className="w-full px-3 py-2 rounded-md bg-stone-100 hover:bg-white text-stone-900 text-xs font-medium flex items-center justify-center gap-2 disabled:opacity-40"
            >
              {zipping
                ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                : <Download className="w-3.5 h-3.5" />}
              Download Android project
            </button>
          </div>

          {/* PWABuilder */}
          <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
            <div className="flex items-start gap-2 mb-2">
              <Smartphone className="w-4 h-4 text-emerald-300 mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-stone-100 flex items-center gap-2">
                  PWABuilder
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-400/20 text-emerald-300 uppercase">
                    free · Microsoft
                  </span>
                </div>
                <div className="text-[11px] text-stone-400 mt-0.5">
                  Deploy first, then generate APK from live URL.
                </div>
              </div>
            </div>
            {deployResult?.previewUrl ? (
              <a
                href={`https://www.pwabuilder.com/reportcard?site=${encodeURIComponent(deployResult.previewUrl)}`}
                target="_blank"
                rel="noreferrer"
                className="w-full px-3 py-2 rounded-md bg-emerald-400 hover:bg-emerald-300 text-stone-950 text-xs font-medium flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Generate APK
              </a>
            ) : (
              <div className="text-[11px] text-amber-300/80 flex items-start gap-1.5">
                <AlertCircle className="w-3 h-3 mt-0.5 shrink-0" />
                Deploy to Gist first (below), then come back.
              </div>
            )}
          </div>
        </div>
      )}

      {/* GitHub Gist deploy — HTML only */}
      {outputType === "html" && (
        <div className="border-t border-stone-800 pt-4">
          <div className="text-[11px] font-mono uppercase tracking-widest text-stone-500 mb-2">
            Host live (free)
          </div>
          <div className="rounded-lg border border-stone-800 bg-stone-950/50 p-3">
            <div className="flex items-start gap-2 mb-3">
              <Github className="w-4 h-4 mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-stone-100">GitHub Gist</div>
                <div className="text-[11px] text-stone-400 mt-0.5">Public gist + live preview URL.</div>
              </div>
            </div>
            <button
              onClick={deployToGist}
              disabled={!ghToken.trim() || deploying}
              className="w-full px-3 py-2 rounded-md bg-stone-100 hover:bg-white text-stone-900 text-xs font-medium flex items-center justify-center gap-2 disabled:bg-stone-800 disabled:text-stone-600"
            >
              {deploying
                ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Deploying</>
                : <><Rocket className="w-3.5 h-3.5" /> Deploy to Gist</>}
            </button>
            {!ghToken.trim() && (
              <button
                onClick={onOpenSettings}
                className="mt-2 w-full text-[11px] text-amber-400 hover:text-amber-300"
              >
                Add GitHub token in Settings →
              </button>
            )}
            {deployError && (
              <div className="text-[11px] text-rose-400 mt-2 flex items-start gap-1">
                <AlertCircle className="w-3 h-3 mt-0.5 shrink-0" />
                {deployError}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
