/* ─── Forjit AI · LLM API layer ─────────────────────────────────────────────
 *
 *  3-tier call system — works for everyone, no key required:
 *
 *  Tier 1 → /api/groq-proxy  (server-side key, zero user setup)
 *  Tier 2 → User's own key   (Groq or OpenRouter — unlimited + better models)
 *  Tier 3 → Pollinations     (free public fallback)
 *
 * ──────────────────────────────────────────────────────────────────────────*/

import { PROVIDERS, APP_NAME, APP_URL } from "./constants";

const PROXY_URL         = "/api/groq-proxy";
const PROXY_TIMEOUT     = 20000;
const POLL_TIMEOUT      = 20000;

/* ── Timeout helper ─────────────────────────────────────────────────────── */
function withTimeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`Timeout ${ms}ms`)), ms)
    ),
  ]);
}

/* ── Tier 1: Server proxy ───────────────────────────────────────────────── */
async function callProxy(messages, model) {
  try {
    const res = await withTimeout(
      fetch(PROXY_URL, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: model || "llama-3.1-8b-instant", maxTokens: 8000, messages }),
      }),
      PROXY_TIMEOUT
    );
    if (!res.ok) return null;
    const text = await res.text();
    const data = JSON.parse(text);
    return data?.content || null;
  } catch {
    return null;
  }
}

/* ── Tier 2: User's own key ─────────────────────────────────────────────── */
async function callWithKey({ provider, model, apiKey, messages, onFallback }) {
  const cfg = PROVIDERS[provider];
  if (!cfg) throw new Error(`Unknown provider: ${provider}`);

  const models  = cfg.models;
  const idx     = models.findIndex((m) => m.id === model);
  const ordered = [models[idx], ...models.filter((_, i) => i !== idx)].filter(Boolean);
  let lastError = null;

  for (const candidate of ordered) {
    try {
      const res = await fetch(cfg.endpoint, {
        method:  "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:  `Bearer ${apiKey.trim()}`,
          ...(provider === "openrouter"
            ? { "HTTP-Referer": APP_URL, "X-Title": APP_NAME }
            : {}),
        },
        body: JSON.stringify({ model: candidate.id, messages, temperature: 0.7, max_tokens: 8000 }),
      });

      if (res.status === 413 || res.status === 429) {
        const e = await res.text().catch(() => "");
        lastError = new Error(`${cfg.name} ${res.status}${e ? ` · ${e.slice(0, 100)}` : ""}`);
        if (onFallback) {
          const next = ordered[ordered.indexOf(candidate) + 1];
          if (next) onFallback(candidate.label, next.label, res.status);
        }
        continue;
      }

      if (!res.ok) {
        const e = await res.text().catch(() => "");
        throw new Error(`${cfg.name} ${res.status}${e ? ` · ${e.slice(0, 140)}` : ""}`);
      }

      const data = await res.json();
      return data?.choices?.[0]?.message?.content ?? "";

    } catch (e) {
      if (e.message?.includes("413") || e.message?.includes("429")) { lastError = e; continue; }
      throw e;
    }
  }

  throw lastError ?? new Error("All models failed. Try again.");
}

/* ── Tier 3: Pollinations free fallback ─────────────────────────────────── */
async function callPollinations(messages) {
  // POST
  try {
    const res = await withTimeout(
      fetch("https://text.pollinations.ai/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages, model: "openai", private: true }),
      }),
      POLL_TIMEOUT
    );
    if (res.ok) { const t = (await res.text()).trim(); if (t.length > 20) return t; }
  } catch {}

  // GET fallback
  try {
    const user = messages.filter((m) => m.role === "user").map((m) => m.content).join(" ");
    const q    = encodeURIComponent(user.slice(0, 500));
    const res  = await withTimeout(
      fetch(`https://text.pollinations.ai/${q}?model=openai&private=true`),
      POLL_TIMEOUT
    );
    if (res.ok) { const t = (await res.text()).trim(); if (t.length > 20) return t; }
  } catch {}

  return null;
}

/* ══════════════════════════════════════════════════════════════════════════
   MAIN — callLLM
══════════════════════════════════════════════════════════════════════════ */
export async function callLLM({ provider, model, apiKey, messages, onFallback }) {

  // Tier 1: Proxy (server key — zero user setup)
  const r1 = await callProxy(messages, model);
  if (r1) return r1;

  // Tier 2: User's own key (best quality, unlimited)
  if (apiKey?.trim()) {
    return callWithKey({ provider, model, apiKey, messages, onFallback });
  }

  // Tier 3: Pollinations (free public fallback)
  const r3 = await callPollinations(messages);
  if (r3) return r3;

  throw new Error(
    "Free AI is temporarily unavailable. Add your free Groq key in ⚙️ Settings for reliable access."
  );
}
