/* ─── Forjit AI · AI Proxy (Vercel Serverless) ──────────────────────────────
 *
 *  SETUP (one time):
 *  1. vercel.com → your project → Settings → Environment Variables
 *  2. Add: GROQ_API_KEY = (get free key at console.groq.com/keys)
 *  3. Redeploy
 *
 *  Fallback chain: Groq → Together AI → Hugging Face → error
 *  © 2025 Forjit AI
 * ──────────────────────────────────────────────────────────────────────────*/

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST")    return res.status(405).json({ error: "POST only" });

  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch { return res.status(400).json({ error: "bad_json" }); }
  }

  const { messages, model, maxTokens } = body || {};
  if (!Array.isArray(messages) || !messages.length) {
    return res.status(400).json({ error: "messages required" });
  }

  const safeTokens   = Math.min(parseInt(maxTokens) || 700, 8000);
  const safeMessages = messages
    .filter(m => m && typeof m.role === "string" && typeof m.content === "string")
    .map(m => ({ role: m.role, content: String(m.content).slice(0, 5000) }))
    .slice(0, 8);

  /* ── Helper: call any OpenAI-compatible endpoint ── */
  async function callOpenAICompat(url, key, modelName) {
    const r = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type":  "application/json",
        "Authorization": `Bearer ${key}`,
      },
      body: JSON.stringify({
        model:       modelName,
        max_tokens:  safeTokens,
        temperature: 0.75,
        stream:      false,
        messages:    safeMessages,
      }),
    });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const data    = await r.json();
    const content = data?.choices?.[0]?.message?.content || "";
    if (!content || content.length < 5) throw new Error("Empty response");
    return content;
  }

  const errors = [];

  /* ── Tier 1: Groq (fast, free, high quality) ── */
  const GROQ_KEY = process.env.GROQ_API_KEY;
  if (GROQ_KEY) {
    const GROQ_MODELS = {
      fast:  "llama-3.1-8b-instant",
      smart: "llama-3.3-70b-versatile",
    };
    const groqModel = GROQ_MODELS[model] || "llama-3.1-8b-instant";
    try {
      const content = await callOpenAICompat(
        "https://api.groq.com/openai/v1/chat/completions",
        GROQ_KEY,
        groqModel
      );
      return res.status(200).json({ content, tier: "groq" });
    } catch(e) {
      errors.push("Groq: " + e.message);
      // If rate limited, still try next tier
    }
  } else {
    errors.push("Groq: GROQ_API_KEY not set");
  }

  /* ── Tier 2: Together AI (free $25 credit, OpenAI-compatible) ── */
  const TOGETHER_KEY = process.env.TOGETHER_API_KEY;
  if (TOGETHER_KEY) {
    try {
      const content = await callOpenAICompat(
        "https://api.together.xyz/v1/chat/completions",
        TOGETHER_KEY,
        "meta-llama/Llama-3.2-11B-Vision-Instruct-Turbo"
      );
      return res.status(200).json({ content, tier: "together" });
    } catch(e) {
      errors.push("Together: " + e.message);
    }
  }

  /* ── Tier 3: OpenRouter free models (no cost, needs key) ── */
  const OR_KEY = process.env.OPENROUTER_API_KEY;
  if (OR_KEY) {
    try {
      const content = await callOpenAICompat(
        "https://openrouter.ai/api/v1/chat/completions",
        OR_KEY,
        "meta-llama/llama-3.2-3b-instruct:free"
      );
      return res.status(200).json({ content, tier: "openrouter" });
    } catch(e) {
      errors.push("OpenRouter: " + e.message);
    }
  }

  /* ── No key configured ── */
  return res.status(503).json({
    error: "not_configured",
    hint:  "Set GROQ_API_KEY in Vercel Environment Variables (free at console.groq.com/keys)",
    tried: errors,
  });
}
