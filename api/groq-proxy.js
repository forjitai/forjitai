/* ─── Forjit AI · Groq Proxy (Vercel Serverless) ────────────────────────────
 *
 *  HOW TO SET UP (one time only):
 *  1. Go to vercel.com → your project → Settings → Environment Variables
 *  2. Add: GROQ_API_KEY = your Groq key (free at console.groq.com/keys)
 *  3. Redeploy. Done. Every visitor gets free AI forever.
 *
 *  © 2025 Forjit AI · All rights reserved
 * ──────────────────────────────────────────────────────────────────────────*/

export default async function handler(req, res) {
  // CORS — allow forjitai.in
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST")    return res.status(405).json({ error: "POST only" });

  // Check key is configured
  const GROQ_API_KEY = process.env.GROQ_API_KEY;
  if (!GROQ_API_KEY) {
    return res.status(503).json({ error: "not_configured" });
  }

  // Parse body
  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch { return res.status(400).json({ error: "bad_json" }); }
  }

  const { messages, model, maxTokens } = body || {};
  if (!Array.isArray(messages) || !messages.length) {
    return res.status(400).json({ error: "messages required" });
  }

  // Whitelist models + cap tokens
  const ALLOWED = ["llama-3.1-8b-instant", "llama-3.3-70b-versatile"];
  const safeModel  = ALLOWED.includes(model) ? model : "llama-3.1-8b-instant";
  const safeTokens = Math.min(parseInt(maxTokens) || 600, 800);
  const safeMessages = messages
    .filter(m => m && typeof m.role === "string" && typeof m.content === "string")
    .map(m => ({ role: m.role, content: String(m.content).slice(0, 4000) }))
    .slice(0, 6);

  try {
    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model:       safeModel,
        max_tokens:  safeTokens,
        temperature: 0.7,
        stream:      false,   // non-streaming = simpler, more reliable
        messages:    safeMessages,
      }),
    });

    if (!groqRes.ok) {
      const status = groqRes.status;
      if (status === 429) return res.status(429).json({ error: "rate_limit" });
      if (status === 401) return res.status(401).json({ error: "bad_key" });
      return res.status(502).json({ error: "groq_error_" + status });
    }

    const data    = await groqRes.json();
    const content = data?.choices?.[0]?.message?.content || "";

    return res.status(200).json({ content });

  } catch (err) {
    return res.status(500).json({ error: "proxy_error" });
  }
}
