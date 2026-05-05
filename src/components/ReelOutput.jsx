import React, { useState } from "react";
import {
  Copy, Check, RefreshCw, Flame, Mic, Hash, Music, BarChart3,
  Lightbulb, ChevronRight, Zap, Heart, Laugh,
} from "lucide-react";

function CopyBtn({ text, field, reelCopied, setReelCopied, label = "Copy" }) {
  const isCopied = reelCopied === field;
  function handle() {
    navigator.clipboard.writeText(text).then(() => {
      setReelCopied(field);
      setTimeout(() => setReelCopied(""), 1800);
    });
  }
  return (
    <button
      onClick={handle}
      className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-stone-100 transition border border-stone-700/50"
    >
      {isCopied ? (
        <><Check className="w-3 h-3 text-emerald-400" /> Copied!</>
      ) : (
        <><Copy className="w-3 h-3" /> {label}</>
      )}
    </button>
  );
}

function ScoreBar({ label, value }) {
  const color =
    value >= 8 ? "bg-emerald-400" : value >= 6 ? "bg-amber-400" : "bg-rose-400";
  return (
    <div className="flex items-center gap-2">
      <span className="text-[11px] text-stone-400 w-24 shrink-0">{label}</span>
      <div className="flex-1 h-1.5 bg-stone-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${color}`}
          style={{ width: `${value * 10}%` }}
        />
      </div>
      <span className={`text-[11px] font-mono font-bold w-6 text-right ${
        value >= 8 ? "text-emerald-400" : value >= 6 ? "text-amber-400" : "text-rose-400"
      }`}>{value}</span>
    </div>
  );
}

const TONE_CONFIG = {
  emotional: { label: "Emotional", icon: Heart, color: "text-rose-300", activeBg: "bg-rose-500/20 border-rose-500/50 text-rose-200" },
  funny: { label: "Funny", icon: Laugh, color: "text-amber-300", activeBg: "bg-amber-500/20 border-amber-500/50 text-amber-200" },
  motivational: { label: "Motivational", icon: Zap, color: "text-violet-300", activeBg: "bg-violet-500/20 border-violet-500/50 text-violet-200" },
};

export default function ReelOutput({ data, tone, setTone, reelCopied, setReelCopied }) {
  const [hookIdx, setHookIdx] = useState(0);

  if (!data) return null;

  const hooks = data.hooks || [];
  const currentHook = hooks[hookIdx] || "";
  const toneScript = data.tones?.[tone] || data.script || "";

  function nextHook() {
    setHookIdx((i) => (i + 1) % hooks.length);
  }

  return (
    <div className="bg-stone-950 overflow-auto" style={{ maxHeight: "540px" }}>
      <div className="p-4 space-y-3">

        {/* HOOK SECTION */}
        <div className="rounded-xl border border-orange-500/30 bg-gradient-to-br from-orange-500/10 to-stone-900/60 p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-400" />
              <span className="text-xs font-semibold text-orange-300 uppercase tracking-wider">🔥 Hook</span>
              <span className="text-[10px] text-stone-500 font-mono">{hookIdx + 1}/{hooks.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={nextHook}
                className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 border border-orange-500/30 transition"
              >
                <RefreshCw className="w-3 h-3" /> Next Hook
              </button>
              <CopyBtn text={currentHook} field="hook" reelCopied={reelCopied} setReelCopied={setReelCopied} />
            </div>
          </div>
          <p className="text-stone-100 text-[15px] font-medium leading-snug">"{currentHook}"</p>
          {/* All hooks small */}
          <div className="mt-2 flex flex-wrap gap-1.5">
            {hooks.map((h, i) => (
              <button
                key={i}
                onClick={() => setHookIdx(i)}
                className={`text-[10px] px-2 py-0.5 rounded-full border transition ${
                  i === hookIdx
                    ? "bg-orange-500/30 border-orange-500/50 text-orange-200"
                    : "bg-stone-800 border-stone-700 text-stone-500 hover:text-stone-300"
                }`}
              >Hook {i + 1}</button>
            ))}
          </div>
        </div>

        {/* TONE SELECTOR + SCRIPT */}
        <div className="rounded-xl border border-stone-700/50 bg-stone-900/60 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Mic className="w-4 h-4 text-violet-400" />
            <span className="text-xs font-semibold text-stone-300 uppercase tracking-wider">🎬 Reel Script</span>
            <span className="text-[10px] text-stone-600">15–30 sec voiceover</span>
          </div>
          {/* Tone tabs */}
          <div className="flex gap-1.5 mb-3">
            {Object.entries(TONE_CONFIG).map(([key, cfg]) => {
              const Icon = cfg.icon;
              const active = tone === key;
              return (
                <button
                  key={key}
                  onClick={() => setTone(key)}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium border transition ${
                    active ? cfg.activeBg : "bg-stone-800 border-stone-700/50 text-stone-500 hover:text-stone-300"
                  }`}
                >
                  <Icon className="w-3 h-3" /> {cfg.label}
                </button>
              );
            })}
            <div className="ml-auto">
              <CopyBtn text={toneScript} field={`script-${tone}`} reelCopied={reelCopied} setReelCopied={setReelCopied} />
            </div>
          </div>
          <p className="text-stone-200 text-sm leading-relaxed whitespace-pre-line">{toneScript}</p>
          {/* Main script */}
          {data.script && (
            <div className="mt-3 pt-3 border-t border-stone-800">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] text-stone-500 uppercase tracking-wider">Default Script</span>
                <CopyBtn text={data.script} field="script-default" reelCopied={reelCopied} setReelCopied={setReelCopied} />
              </div>
              <p className="text-stone-400 text-xs leading-relaxed">{data.script}</p>
            </div>
          )}
        </div>

        {/* CAPTION */}
        <div className="rounded-xl border border-violet-500/25 bg-violet-500/5 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-violet-300 uppercase tracking-wider">📝 Caption</span>
            <CopyBtn text={data.caption || ""} field="caption" reelCopied={reelCopied} setReelCopied={setReelCopied} />
          </div>
          <p className="text-stone-200 text-sm leading-relaxed">{data.caption}</p>
        </div>

        {/* HASHTAGS */}
        <div className="rounded-xl border border-stone-700/50 bg-stone-900/40 p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Hash className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-semibold text-stone-300 uppercase tracking-wider">🔖 Hashtags</span>
            </div>
            <CopyBtn
              text={(data.hashtags || []).join(" ")}
              field="hashtags"
              reelCopied={reelCopied}
              setReelCopied={setReelCopied}
              label="Copy All"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {(data.hashtags || []).map((tag, i) => (
              <span key={i} className="text-[11px] px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 font-mono">{tag}</span>
            ))}
          </div>
        </div>

        {/* MUSIC */}
        <div className="rounded-xl border border-stone-700/50 bg-stone-900/40 p-4">
          <div className="flex items-center gap-2 mb-1">
            <Music className="w-4 h-4 text-pink-400" />
            <span className="text-xs font-semibold text-stone-300 uppercase tracking-wider">🎵 Music Vibe</span>
          </div>
          <p className="text-stone-200 text-sm">{data.music}</p>
        </div>

        {/* VIRAL SCORE */}
        {data.viralScore && (
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
            <div className="flex items-center gap-2 mb-3">
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">📊 Viral Score</span>
              <span className="ml-auto text-2xl font-black text-emerald-400">{data.viralScore.overall}<span className="text-sm text-stone-500">/10</span></span>
            </div>
            <div className="space-y-2">
              <ScoreBar label="Hook Strength" value={data.viralScore.hook} />
              <ScoreBar label="Relatability" value={data.viralScore.relatability} />
              <ScoreBar label="Shareability" value={data.viralScore.shareability} />
              <ScoreBar label="Overall" value={data.viralScore.overall} />
            </div>
          </div>
        )}

        {/* IMPROVEMENT TIPS */}
        {data.tips && data.tips.length > 0 && (
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-semibold text-amber-300 uppercase tracking-wider">⚡ Improvement Tips</span>
            </div>
            <div className="space-y-1.5">
              {data.tips.map((tip, i) => (
                <div key={i} className="flex items-start gap-2">
                  <ChevronRight className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" />
                  <p className="text-stone-300 text-xs leading-relaxed">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* COPY ALL */}
        <button
          onClick={() => {
            const all = [
              `🔥 HOOK\n${currentHook}`,
              `\n🎬 SCRIPT (${tone})\n${toneScript}`,
              `\n📝 CAPTION\n${data.caption}`,
              `\n🔖 HASHTAGS\n${(data.hashtags || []).join(" ")}`,
              `\n🎵 MUSIC: ${data.music}`,
              `\n📊 VIRAL SCORE: ${data.viralScore?.overall}/10`,
            ].join("\n");
            navigator.clipboard.writeText(all).then(() => {
              setReelCopied("all");
              setTimeout(() => setReelCopied(""), 2000);
            });
          }}
          className={`w-full py-2.5 rounded-xl text-sm font-semibold transition flex items-center justify-center gap-2 ${
            reelCopied === "all"
              ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-300"
              : "bg-amber-400 hover:bg-amber-300 text-stone-950"
          }`}
        >
          {reelCopied === "all" ? <><Check className="w-4 h-4" /> Copied Everything!</> : <><Copy className="w-4 h-4" /> Copy Complete Reel Package</>}
        </button>

      </div>
    </div>
  );
}
