/* ─── Forjit AI · LLM API layer ─────────────────────────────────────────────
 *
 *  Pure functions — no React state, no side effects.
 *  Accepts all config as arguments so it stays testable and reusable.
 *
 *  Usage:
 *    import { callLLM } from "./api";
 *
 *    const text = await callLLM({
 *      provider,        // "groq" | "openrouter"
 *      model,           // model id string
 *      apiKey,          // user's key
 *      messages,        // [{ role, content }]
 *      onFallback,      // optional (fromLabel, toLabel, status) => void
 *    });
 * ──────────────────────────────────────────────────────────────────────────*/

import { PROVIDERS, APP_NAME, APP_URL } from "./constants";

/* ── Main LLM call — auto-falls back through models on 413/429 ──────────── */
export async function callLLM({ provider, model, apiKey, messages, onFallback }) {
  const providerCfg = PROVIDERS[provider];
  if (!providerCfg) throw new Error(`Unknown provider: ${provider}`);

  const models    = providerCfg.models;
  const startIdx  = models.findIndex((m) => m.id === model);
  const ordered   = [
    models[startIdx],
    ...models.filter((_, i) => i !== startIdx),
  ].filter(Boolean);

  let lastError = null;

  for (const candidate of ordered) {
    try {
      const res = await fetch(providerCfg.endpoint, {
        method:  "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:  `Bearer ${apiKey.trim()}`,
          /* OpenRouter requires these headers */
          ...(provider === "openrouter"
            ? { "HTTP-Referer": APP_URL, "X-Title": APP_NAME }
            : {}),
        },
        body: JSON.stringify({
          model:       candidate.id,
          messages,
          temperature: 0.7,
          max_tokens:  8000,
        }),
      });

      /* Rate-limit / payload-too-large → try next model */
      if (res.status === 413 || res.status === 429) {
        const errText = await res.text().catch(() => "");
        lastError = new Error(
          `${providerCfg.name} ${res.status}${errText ? ` · ${errText.slice(0, 100)}` : ""}`
        );

        if (onFallback) {
          const nextModel = ordered[ordered.indexOf(candidate) + 1];
          if (nextModel) onFallback(candidate.label, nextModel.label, res.status);
        }
        continue;
      }

      /* Any other non-OK status → hard error */
      if (!res.ok) {
        const errText = await res.text().catch(() => "");
        throw new Error(
          `${providerCfg.name} ${res.status}${errText ? ` · ${errText.slice(0, 140)}` : ""}`
        );
      }

      const data = await res.json();
      return data?.choices?.[0]?.message?.content ?? "";

    } catch (e) {
      /* 413/429 wrapped in catch (e.g. network layer) → keep trying */
      if (e.message?.includes("413") || e.message?.includes("429")) {
        lastError = e;
        continue;
      }
      throw e;
    }
  }

  throw lastError ?? new Error("All models failed. Try again shortly.");
}
