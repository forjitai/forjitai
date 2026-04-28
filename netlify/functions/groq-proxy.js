/* ─── Forjit AI · Groq Proxy (Netlify) ──────────────────────────────────────
 *
 *  Netlify function version of the Groq proxy.
 *  Deploy on Netlify → set GROQ_API_KEY in Netlify env vars.
 *
 *  © 2025 Forjit AI · All rights reserved
 * ──────────────────────────────────────────────────────────────────────────*/

const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";

const ALLOWED_MODELS = new Set([
  "llama-3.1-8b-instant",
  "llama-3.3-70b-versatile",
]);

const MAX_TOKENS_CAP = 800;

const CORS_HEADERS = {
  "Access-Control-Allow-Origin":  "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export const handler = async (event) => {
  // Preflight
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers: CORS_HEADERS, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers: CORS_HEADERS, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  const GROQ_API_KEY = process.env.GROQ_API_KEY;
  if (!GROQ_API_KEY) {
    return {
      statusCode: 503,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Service not configured. Please add your own Groq API key.", needsKey: true }),
    };
  }

  let body;
  try { body = JSON.parse(event.body || "{}"); }
  catch { return { statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ error: "Invalid JSON" }) }; }

  const { messages, model, maxTokens } = body;
  const safeModel  = ALLOWED_MODELS.has(model) ? model : "llama-3.1-8b-instant";
  const safeTokens = Math.min(Number(maxTokens) || 500, MAX_TOKENS_CAP);
  const safeMessages = (messages || [])
    .filter(m => m?.role && m?.content)
    .map(m => ({ role: String(m.role), content: String(m.content).slice(0, 4000) }))
    .slice(0, 10);

  if (!safeMessages.length) {
    return { statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ error: "No valid messages" }) };
  }

  try {
    const groqRes = await fetch(GROQ_ENDPOINT, {
      method:  "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${GROQ_API_KEY}` },
      body: JSON.stringify({ model: safeModel, max_tokens: safeTokens, temperature: 0.7, stream: false, messages: safeMessages }),
    });

    if (!groqRes.ok) {
      const status = groqRes.status;
      if (status === 429) return { statusCode: 429, headers: CORS_HEADERS, body: JSON.stringify({ error: "Rate limit reached. Try again shortly." }) };
      return { statusCode: 502, headers: CORS_HEADERS, body: JSON.stringify({ error: `AI error (${status}). Please try again.` }) };
    }

    const data = await groqRes.json();
    const content = data?.choices?.[0]?.message?.content || "";

    return {
      statusCode: 200,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    };

  } catch (err) {
    return { statusCode: 500, headers: CORS_HEADERS, body: JSON.stringify({ error: "Failed to reach AI. Try again." }) };
  }
};
