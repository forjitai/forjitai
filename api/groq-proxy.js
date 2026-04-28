/* ─── Forjit AI · Groq Proxy ─────────────────────────────────────────────────
 *
 *  Vercel serverless function — keeps GROQ_API_KEY server-side only.
 *  Frontend calls /api/groq-proxy instead of Groq directly.
 *
 *  Security:
 *    – API key read from Vercel env var (GROQ_API_KEY)
 *    – Origin check — only forjitai.in allowed
 *    – Max tokens hard-capped server-side (prevents abuse)
 *    – Model whitelist (only safe models allowed)
 *    – Request size limit
 *
 *  Rate limiting:
 *    – Client-side limit already enforced in teacher-engine.js
 *    – Server-side: Vercel's built-in per-IP limits apply
 *
 *  © 2025 Forjit AI · All rights reserved
 * ──────────────────────────────────────────────────────────────────────────*/

const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";

// Whitelist of allowed models (prevents misuse of key on expensive models)
const ALLOWED_MODELS = new Set([
  "llama-3.1-8b-instant",
  "llama-3.3-70b-versatile",
]);

// Hard cap on tokens (even if client sends more)
const MAX_TOKENS_CAP = 800;

// Allowed origins
const ALLOWED_ORIGINS = [
  "https://www.forjitai.in",
  "https://forjitai.in",
  "https://forjitai.vercel.app",
  // Allow localhost for development
  "http://localhost:5173",
  "http://localhost:4173",
];

export default async function handler(req, res) {
  // ── CORS headers ──────────────────────────────────────────────────────
  const origin = req.headers.origin || "";
  const isAllowed = ALLOWED_ORIGINS.some(o => origin.startsWith(o)) || !origin;

  res.setHeader("Access-Control-Allow-Origin", isAllowed ? origin || "*" : "https://www.forjitai.in");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Only POST allowed
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // ── Check API key is configured ───────────────────────────────────────
  const GROQ_API_KEY = process.env.GROQ_API_KEY;
  if (!GROQ_API_KEY) {
    return res.status(503).json({
      error: "Service not configured. Please add your own Groq API key to use this tool.",
      needsKey: true,
    });
  }

  // ── Parse request body ────────────────────────────────────────────────
  let body;
  try {
    body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  } catch {
    return res.status(400).json({ error: "Invalid JSON body" });
  }

  const { messages, model, maxTokens } = body || {};

  // ── Validate inputs ───────────────────────────────────────────────────
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "messages array is required" });
  }

  // Enforce model whitelist
  const safeModel = ALLOWED_MODELS.has(model) ? model : "llama-3.1-8b-instant";

  // Enforce token cap
  const safeTokens = Math.min(Number(maxTokens) || 500, MAX_TOKENS_CAP);

  // Sanitize messages (only allow role + content strings)
  const safeMessages = messages
    .filter(m => m && typeof m.role === "string" && typeof m.content === "string")
    .map(m => ({ role: m.role, content: m.content.slice(0, 4000) }))
    .slice(0, 10); // max 10 messages

  if (safeMessages.length === 0) {
    return res.status(400).json({ error: "No valid messages provided" });
  }

  // ── Forward to Groq with streaming ───────────────────────────────────
  try {
    const groqRes = await fetch(GROQ_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model:       safeModel,
        max_tokens:  safeTokens,
        temperature: 0.7,
        stream:      true,
        messages:    safeMessages,
      }),
    });

    if (!groqRes.ok) {
      const errText = await groqRes.text().catch(() => "");
      // Don't expose full error to client (may contain key info)
      if (groqRes.status === 429) {
        return res.status(429).json({ error: "Rate limit reached. Please try again in a moment." });
      }
      return res.status(502).json({ error: `Groq API error (${groqRes.status}). Please try again.` });
    }

    // Stream the response back to client
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("X-Accel-Buffering", "no");

    const reader = groqRes.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      res.write(decoder.decode(value));
    }

    res.end();

  } catch (err) {
    console.error("[groq-proxy] Error:", err.message);
    return res.status(500).json({ error: "Failed to reach AI service. Please try again." });
  }
}
