/* ─── Forjit AI · Teacher Tool Engine v1.0 ──────────────────────────────────
 *
 *  Universal engine for all 261 teacher tools.
 *  Each tool HTML page embeds its config in <script id="tool-config">.
 *  This file handles everything else automatically:
 *    – UI rendering (form inputs + output)
 *    – IndexedDB caching (zero API calls on repeated inputs)
 *    – Rate limiting (10 req/hour per browser)
 *    – Model routing (fast model for simple, smart for complex)
 *    – Groq API calls with streaming
 *    – User's own API key (unlimited, stored in IndexedDB)
 *
 *  © 2025 Forjit AI · All rights reserved
 * ──────────────────────────────────────────────────────────────────────────*/

(function () {
  "use strict";

  /* ── Config ────────────────────────────────────────────────────────────── */
  const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";
  const MODELS = {
    fast:  "llama-3.1-8b-instant",        // Simple tools
    smart: "llama-3.3-70b-versatile",     // Lesson plans, essays, research
  };
  const RATE_LIMIT   = 10;   // Max requests per hour
  const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
  const MAX_CACHE    = 50;   // Max cached entries per browser
  const DB_NAME      = "forjitai_db";
  const DB_VERSION   = 1;

  /* ── Read tool config from page ────────────────────────────────────────── */
  const configEl = document.getElementById("tool-config");
  if (!configEl) { console.error("[TE] No #tool-config found"); return; }
  const TOOL = JSON.parse(configEl.textContent);

  /* ── IndexedDB helpers ─────────────────────────────────────────────────── */
  function openDB() {
    return new Promise((res, rej) => {
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = () => {
        const db = req.result;
        ["errorLog","history","feedback","users","uploads","teacherCache"]
          .forEach(s => { if (!db.objectStoreNames.contains(s))
            db.createObjectStore(s, { keyPath: "key" }); });
      };
      req.onsuccess = () => res(req.result);
      req.onerror   = () => rej(req.error);
    });
  }

  async function dbGet(store, key) {
    try {
      const db = await openDB();
      return new Promise(res => {
        const r = db.transaction(store, "readonly").objectStore(store).get(key);
        r.onsuccess = () => res(r.result?.value ?? null);
        r.onerror   = () => res(null);
      });
    } catch { return null; }
  }

  async function dbSet(store, key, value) {
    try {
      const db = await openDB();
      return new Promise(res => {
        const tx = db.transaction(store, "readwrite");
        tx.objectStore(store).put({ key, value });
        tx.oncomplete = () => res(true);
        tx.onerror    = () => res(false);
      });
    } catch { return false; }
  }

  /* ── Cache ─────────────────────────────────────────────────────────────── */
  function cacheKey(inputs) {
    const str = TOOL.id + JSON.stringify(inputs);
    return "tc_" + btoa(encodeURIComponent(str)).slice(0, 80);
  }

  async function cacheGet(inputs) {
    const entry = await dbGet("teacherCache", cacheKey(inputs));
    if (!entry) return null;
    if (Date.now() - entry.ts > CACHE_TTL_MS) return null; // Expired
    return entry.output;
  }

  async function cacheSet(inputs, output) {
    const key = cacheKey(inputs);
    await dbSet("teacherCache", key, { output, ts: Date.now() });
    // Prune old entries (keep MAX_CACHE)
    try {
      const db = await openDB();
      const store = db.transaction("teacherCache","readwrite").objectStore("teacherCache");
      const all = await new Promise(res => {
        const r = store.getAll(); r.onsuccess = () => res(r.result);
      });
      if (all.length > MAX_CACHE) {
        all.sort((a,b) => a.value.ts - b.value.ts)
           .slice(0, all.length - MAX_CACHE)
           .forEach(e => store.delete(e.key));
      }
    } catch {}
  }

  /* ── Rate Limiter ──────────────────────────────────────────────────────── */
  function getRateData() {
    try {
      const d = JSON.parse(localStorage.getItem("te_rate") || "{}");
      const now = Date.now();
      if (!d.hour || now - d.hour > 3600000) return { count: 0, hour: now };
      return d;
    } catch { return { count: 0, hour: Date.now() }; }
  }

  function checkRate() {
    const d = getRateData();
    return d.count < RATE_LIMIT;
  }

  function bumpRate() {
    const d = getRateData();
    d.count++;
    localStorage.setItem("te_rate", JSON.stringify(d));
  }

  function rateRemaining() {
    const d = getRateData();
    const left = Math.max(0, RATE_LIMIT - d.count);
    const reset = Math.max(0, Math.ceil((d.hour + 3600000 - Date.now()) / 60000));
    return { left, reset };
  }

  /* ── API Key (user's own, stored in IndexedDB) ─────────────────────────── */
  async function getApiKey() {
    return await dbGet("users", "teacher_groq_key");
  }

  async function saveApiKey(key) {
    await dbSet("users", "teacher_groq_key", key);
  }

  /* ── Model Router ──────────────────────────────────────────────────────── */
  function getModel() {
    return MODELS[TOOL.model || "fast"];
  }

  /* ── Prompt Builder ────────────────────────────────────────────────────── */
  function buildPrompt(inputs) {
    if (typeof TOOL.promptFn === "function") return TOOL.promptFn(inputs);
    // Default: build from promptTemplate string with {{key}} replacements
    let p = TOOL.promptTemplate || "";
    Object.entries(inputs).forEach(([k, v]) => {
      p = p.replaceAll(`{{${k}}}`, v);
    });
    return p;
  }

  /* ── Pollinations AI — Free, no key, no signup ────────────────────────── */
  async function callFree(prompt, onChunk) {
    const res = await fetch("https://text.pollinations.ai/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [
          { role: "system", content: "You are an expert Indian teacher assistant. Be practical, clear, and concise. Format output with clear headings and sections. Use Indian curriculum context (CBSE/ICSE/State Board)." },
          { role: "user",   content: prompt },
        ],
        model:    "openai",
        private:  true,
      }),
    });

    if (!res.ok) throw new Error("Free AI service busy. Please try again.");

    const text = (await res.text()).trim();
    if (!text) throw new Error("Empty response. Please try again.");

    onChunk(text);
    return text;
  }

  /* ── Groq API (user's own key — unlimited + better quality) ───────────── */
  async function callGroq(prompt, apiKey, onChunk) {
    const res = await fetch(GROQ_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type":  "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model:       getModel(),
        max_tokens:  TOOL.maxTokens || 500,
        temperature: 0.7,
        stream:      true,
        messages: [
          { role: "system", content: "You are an expert Indian teacher assistant. Be practical, clear, and concise. Format output with clear sections. Use Indian curriculum context (CBSE/ICSE/State Board)." },
          { role: "user",   content: prompt },
        ],
      }),
    });

    if (!res.ok) {
      const err = await res.text().catch(() => "");
      if (res.status === 401) throw new Error("Invalid Groq key. Please check and save again.");
      if (res.status === 429) throw new Error("Groq rate limit hit. Wait a minute or use free mode.");
      throw new Error(`Groq error ${res.status}: ${err.slice(0, 80)}`);
    }

    const reader  = res.body.getReader();
    const decoder = new TextDecoder();
    let full = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      for (const line of decoder.decode(value).split("\n")) {
        if (!line.startsWith("data: ")) continue;
        const d = line.slice(6).trim();
        if (d === "[DONE]") continue;
        try {
          const t = JSON.parse(d)?.choices?.[0]?.delta?.content || "";
          full += t;
          onChunk(full);
        } catch {}
      }
    }
    return full;
  }

  /* ── Generate ──────────────────────────────────────────────────────────── */
  async function generate(forceRegen = false) {
    const inputs = getInputValues();

    // Validate
    for (const inp of TOOL.inputs) {
      if (inp.required !== false && !inputs[inp.id]) {
        showError(`Please fill in: ${inp.label}`);
        return;
      }
    }

    hideError();
    const outWrap    = document.getElementById("te-output-wrap");
    const outEl      = document.getElementById("te-output");
    const cacheBadge = document.getElementById("te-cache-badge");
    const btn        = document.getElementById("te-generate");

    // Check cache first
    if (!forceRegen) {
      const cached = await cacheGet(inputs);
      if (cached) {
        outWrap.style.display    = "block";
        outEl.textContent        = cached;
        cacheBadge.style.display = "inline-block";
        updateRateBadge();
        return;
      }
    }
    cacheBadge.style.display = "none";

    // Check rate limit
    if (!checkRate()) {
      const { reset } = rateRemaining();
      showError(`Free limit reached. Resets in ${reset} minute${reset===1?"":"s"}. Add your free Groq key above for unlimited use.`);
      return;
    }

    // Get user's Groq key (optional)
    let apiKey = document.getElementById("te-api-key").value.trim();
    if (!apiKey) apiKey = await getApiKey();

    const prompt = buildPrompt(inputs);

    btn.disabled    = true;
    btn.textContent = "⏳ Generating…";
    outWrap.style.display = "block";
    outEl.textContent     = "Working on it…";

    try {
      let result;

      if (apiKey) {
        // Groq — best quality, unlimited
        outEl.textContent = "Generating with Groq…";
        result = await callGroq(prompt, apiKey, p => { outEl.textContent = p; });
      } else {
        // Pollinations — free, no key needed
        outEl.textContent = "Generating (free)…";
        result = await callFree(prompt, t => { outEl.textContent = t; });
      }

      bumpRate(); // Only count on success
      await cacheSet(inputs, result);
      updateRateBadge();

    } catch (e) {
      outWrap.style.display = "none";
      outEl.textContent     = "";
      showError(e.message || "Something went wrong. Please try again.");
    } finally {
      btn.disabled    = false;
      btn.textContent = "⚡ Generate";
    }
  }
  function buildUI() {
    const mount = document.getElementById("te-mount");
    if (!mount) { console.error("[TE] No #te-mount found"); return; }

    mount.innerHTML = `
      <!-- API Key Section (Optional) -->
      <div id="te-key-section" class="te-card" style="margin-bottom:14px">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
          <span style="font-size:13px;font-weight:600;color:var(--mu)">🔑 YOUR GROQ KEY <span style="color:var(--su);font-weight:400">(optional — for unlimited use)</span></span>
          <span id="te-rate-badge" style="font-size:11px;color:var(--mu)"></span>
        </div>
        <div class="te-input-row">
          <input type="password" id="te-api-key" placeholder="Optional: paste your free Groq key for unlimited use"
            style="flex:1;background:transparent;border:none;outline:none;color:var(--fg);font-size:14px;padding:10px 12px;font-family:inherit"/>
          <button id="te-save-key" class="te-btn-sm">Save</button>
          <a href="https://console.groq.com/keys" target="_blank" rel="noopener" class="te-btn-sm" style="text-decoration:none">Get Free Key ↗</a>
        </div>
        <p style="font-size:11px;color:var(--su);margin-top:6px">
          Works without a key. Add your own Groq key for <strong>unlimited</strong> use. Key stored in your browser only — never sent to our servers.
        </p>
      </div>

      <!-- Tool Inputs -->
      <div class="te-card" style="margin-bottom:14px">
        <div id="te-inputs"></div>
        <button id="te-generate" class="te-btn-primary" style="margin-top:16px;width:100%">
          ⚡ Generate
        </button>
      </div>

      <!-- Output -->
      <div id="te-output-wrap" class="te-card" style="display:none">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
          <span style="font-size:12px;font-weight:700;color:var(--mu);text-transform:uppercase;letter-spacing:.06em">Output</span>
          <div style="display:flex;gap:6px">
            <span id="te-cache-badge" style="display:none;font-size:10px;padding:2px 8px;background:rgba(34,197,94,.15);color:#4ade80;border:1px solid rgba(34,197,94,.25);border-radius:999px">⚡ Cached</span>
            <button id="te-copy" class="te-btn-sm">Copy</button>
            <button id="te-regen" class="te-btn-sm">Regenerate</button>
          </div>
        </div>
        <div id="te-output" style="white-space:pre-wrap;font-size:14px;line-height:1.7;color:var(--fg);min-height:60px"></div>
      </div>

      <!-- Error -->
      <div id="te-error" style="display:none;background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.25);border-radius:10px;padding:14px;color:#f87171;font-size:14px;margin-top:10px"></div>
    `;

    // Render inputs
    const inputsEl = document.getElementById("te-inputs");
    TOOL.inputs.forEach(inp => {
      inputsEl.insertAdjacentHTML("beforeend", renderInput(inp));
    });

    // Load saved API key
    getApiKey().then(key => {
      if (key) document.getElementById("te-api-key").value = key;
    });

    // Update rate badge
    updateRateBadge();

    // Events
    document.getElementById("te-save-key").addEventListener("click", async () => {
      const k = document.getElementById("te-api-key").value.trim();
      if (!k) return;
      await saveApiKey(k);
      showToast("Key saved ✓");
    });

    document.getElementById("te-generate").addEventListener("click", () => generate(false));
    document.getElementById("te-regen").addEventListener("click", () => generate(true));
    document.getElementById("te-copy").addEventListener("click", copyOutput);
  }

  function renderInput(inp) {
    const label = `<label class="te-label" for="te-inp-${inp.id}">${inp.label}</label>`;
    if (inp.type === "select") {
      const opts = inp.options.map(o => `<option value="${o}">${o}</option>`).join("");
      return `<div style="margin-bottom:12px">${label}
        <div class="te-input-row"><select id="te-inp-${inp.id}" class="te-select">${opts}</select></div></div>`;
    }
    if (inp.type === "textarea") {
      return `<div style="margin-bottom:12px">${label}
        <textarea id="te-inp-${inp.id}" placeholder="${inp.placeholder||""}" rows="${inp.rows||3}"
          style="width:100%;background:var(--bg);border:1px solid var(--bor);border-radius:8px;padding:10px 12px;color:var(--fg);font-size:14px;outline:none;resize:vertical;font-family:inherit;transition:border-color .15s"
          onfocus="this.style.borderColor='var(--ac)'" onblur="this.style.borderColor='var(--bor)'"></textarea></div>`;
    }
    return `<div style="margin-bottom:12px">${label}
      <div class="te-input-row"><input type="text" id="te-inp-${inp.id}" placeholder="${inp.placeholder||""}"
        style="flex:1;background:transparent;border:none;outline:none;color:var(--fg);font-size:14px;padding:10px 12px;font-family:inherit"/></div></div>`;
  }

  function getInputValues() {
    const vals = {};
    TOOL.inputs.forEach(inp => {
      const el = document.getElementById(`te-inp-${inp.id}`);
      vals[inp.id] = el ? el.value.trim() : "";
    });
    return vals;
  }

  function updateRateBadge() {
    const { left, reset } = rateRemaining();
    const el = document.getElementById("te-rate-badge");
    if (!el) return;
    el.textContent = `${left}/${RATE_LIMIT} free uses left · resets in ${reset}m`;
    el.style.color = left < 3 ? "#f87171" : "var(--mu)";
  }

  /* ── Helpers ───────────────────────────────────────────────────────────── */
  function copyOutput() {
    const text = document.getElementById("te-output").textContent;
    navigator.clipboard.writeText(text).then(() => showToast("Copied ✓"));
  }

  function showError(msg) {
    const el = document.getElementById("te-error");
    el.textContent = msg;
    el.style.display = "block";
  }

  function hideError() {
    document.getElementById("te-error").style.display = "none";
  }

  function showToast(msg) {
    const t = document.createElement("div");
    t.textContent = msg;
    t.style.cssText = "position:fixed;bottom:20px;right:20px;background:#22c55e;color:#fff;padding:8px 16px;border-radius:8px;font-size:13px;z-index:9999;font-family:'Segoe UI',system-ui,sans-serif";
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2000);
  }

  /* ── Inject base styles ────────────────────────────────────────────────── */
  function injectStyles() {
    const style = document.createElement("style");
    style.textContent = `
      .te-card{background:var(--sur);border:1px solid var(--bor);border-radius:12px;padding:20px}
      .te-label{display:block;font-size:11px;color:var(--mu);margin-bottom:5px;font-weight:600;text-transform:uppercase;letter-spacing:.06em}
      .te-input-row{display:flex;align-items:stretch;background:var(--bg);border:1px solid var(--bor);border-radius:8px;overflow:hidden;transition:border-color .15s}
      .te-input-row:focus-within{border-color:var(--ac)}
      .te-select{flex:1;background:transparent;border:none;outline:none;color:var(--fg);font-size:14px;padding:10px 12px;font-family:inherit;appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23a8a29e' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 10px center;padding-right:28px}
      .te-select option{background:var(--sur)}
      .te-btn-primary{background:var(--ac);color:var(--bg);border:none;border-radius:10px;padding:12px 24px;font-size:15px;font-weight:700;cursor:pointer;font-family:inherit;transition:opacity .15s}
      .te-btn-primary:hover{opacity:.85}
      .te-btn-primary:disabled{opacity:.5;cursor:not-allowed}
      .te-btn-sm{padding:5px 12px;font-size:12px;background:var(--bor);color:var(--mu);border:none;border-radius:6px;cursor:pointer;font-family:inherit;transition:all .15s;white-space:nowrap}
      .te-btn-sm:hover{background:var(--ac);color:var(--bg)}
    `;
    document.head.appendChild(style);
  }

  /* ── Boot ──────────────────────────────────────────────────────────────── */
  injectStyles();
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", buildUI);
  } else {
    buildUI();
  }

})();
