/* ─── Forjit AI · Teacher Tool Engine v2.0 ──────────────────────────────────
 *
 *  3-Tier AI system — automatically picks the best available AI:
 *
 *  Tier 1 → Chrome Built-in AI (Gemini Nano)
 *            On-device · offline · private · unlimited · zero cost
 *            Chrome 127+ with flag enabled
 *
 *  Tier 2 → Groq API (user's own key)
 *            Best quality · unlimited · streaming
 *
 *  Tier 3 → Pollinations AI (free fallback)
 *            No key · no signup · works everywhere
 *            Rate limited: 10 req/hour
 *
 *  Other:
 *    – IndexedDB caching (7-day, 50 entries)
 *    – Rate limiting (Tier 3 only)
 *    – AI source badge per output
 *    – Chrome AI session pooling
 *
 *  © 2025 Forjit AI · All rights reserved
 * ──────────────────────────────────────────────────────────────────────────*/

(function () {
  "use strict";

  /* ── Constants ─────────────────────────────────────────────────────────── */
  const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";
  const GROQ_MODELS   = { fast: "llama-3.1-8b-instant", smart: "llama-3.3-70b-versatile" };
  const SYSTEM_PROMPT =
    "You are an expert Indian teacher assistant. Be practical, clear, and concise. " +
    "Format output with clear headings and sections using plain text only (no ** or ##). " +
    "Use Indian curriculum context (CBSE/ICSE/State Board).";
  const RATE_LIMIT   = 10;
  const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000;
  const MAX_CACHE    = 50;
  const DB_NAME      = "forjitai_db";

  /* ── Tool config ───────────────────────────────────────────────────────── */
  const configEl = document.getElementById("tool-config");
  if (!configEl) { console.error("[TE] No #tool-config found"); return; }
  const TOOL = JSON.parse(configEl.textContent);

  /* ── Chrome AI session pool ────────────────────────────────────────────── */
  let _chromeSession   = null;
  let _chromeAvailable = null;

  /* ════════════════════════════════════════════════════════════════════════
     INDEXEDDB
  ════════════════════════════════════════════════════════════════════════ */
  function openDB() {
    return new Promise((res, rej) => {
      const req = indexedDB.open(DB_NAME, 1);
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
        const r = db.transaction(store,"readonly").objectStore(store).get(key);
        r.onsuccess = () => res(r.result?.value ?? null);
        r.onerror   = () => res(null);
      });
    } catch { return null; }
  }

  async function dbSet(store, key, value) {
    try {
      const db = await openDB();
      return new Promise(res => {
        const tx = db.transaction(store,"readwrite");
        tx.objectStore(store).put({ key, value });
        tx.oncomplete = () => res(true);
        tx.onerror    = () => res(false);
      });
    } catch { return false; }
  }

  /* ════════════════════════════════════════════════════════════════════════
     CACHE
  ════════════════════════════════════════════════════════════════════════ */
  function cacheKey(inputs) {
    return "tc_" + btoa(encodeURIComponent(TOOL.id + JSON.stringify(inputs))).slice(0, 80);
  }

  async function cacheGet(inputs) {
    const e = await dbGet("teacherCache", cacheKey(inputs));
    if (!e || Date.now() - e.ts > CACHE_TTL_MS) return null;
    return e.output;
  }

  async function cacheSet(inputs, output) {
    await dbSet("teacherCache", cacheKey(inputs), { output, ts: Date.now() });
    try {
      const db    = await openDB();
      const store = db.transaction("teacherCache","readwrite").objectStore("teacherCache");
      const all   = await new Promise(res => { const r=store.getAll(); r.onsuccess=()=>res(r.result); });
      if (all.length > MAX_CACHE)
        all.sort((a,b)=>a.value.ts-b.value.ts).slice(0,all.length-MAX_CACHE).forEach(e=>store.delete(e.key));
    } catch {}
  }

  /* ════════════════════════════════════════════════════════════════════════
     RATE LIMITER  (Tier 3 only)
  ════════════════════════════════════════════════════════════════════════ */
  function getRateData() {
    try {
      const d = JSON.parse(localStorage.getItem("te_rate")||"{}");
      return (!d.hour || Date.now()-d.hour > 3600000) ? { count:0, hour:Date.now() } : d;
    } catch { return { count:0, hour:Date.now() }; }
  }
  const checkRate = () => getRateData().count < RATE_LIMIT;
  const bumpRate  = () => { const d=getRateData(); d.count++; localStorage.setItem("te_rate",JSON.stringify(d)); };
  function rateRemaining() {
    const d = getRateData();
    return { left: Math.max(0,RATE_LIMIT-d.count), reset: Math.max(0,Math.ceil((d.hour+3600000-Date.now())/60000)) };
  }

  /* ════════════════════════════════════════════════════════════════════════
     API KEY
  ════════════════════════════════════════════════════════════════════════ */
  const getApiKey  = ()    => dbGet("users","teacher_groq_key");
  const saveApiKey = (key) => dbSet("users","teacher_groq_key", key);

  /* ════════════════════════════════════════════════════════════════════════
     PROMPT BUILDER
  ════════════════════════════════════════════════════════════════════════ */
  function buildPrompt(inputs) {
    let p = TOOL.promptTemplate || "";
    Object.entries(inputs).forEach(([k,v]) => { p = p.replaceAll(`{{${k}}}`, v); });
    return p;
  }

  /* ════════════════════════════════════════════════════════════════════════
     TIER 1 — CHROME BUILT-IN AI (Gemini Nano)
  ════════════════════════════════════════════════════════════════════════ */

  async function detectChromeAI() {
    if (_chromeAvailable !== null) return _chromeAvailable;
    try {
      // Chrome 131+ new API
      if (typeof window.LanguageModel !== "undefined") {
        const avail = await window.LanguageModel.availability();
        _chromeAvailable = avail === "available" || avail === "readily";
        return _chromeAvailable;
      }
      // Chrome 127-130 old API
      if (typeof window.ai?.languageModel !== "undefined") {
        const caps = await window.ai.languageModel.capabilities();
        _chromeAvailable = caps?.available === "readily";
        return _chromeAvailable;
      }
      _chromeAvailable = false;
    } catch { _chromeAvailable = false; }
    return _chromeAvailable;
  }

  async function getChromeSession() {
    if (_chromeSession) {
      try { await _chromeSession.prompt("ok"); return _chromeSession; }
      catch { _chromeSession = null; }
    }
    const opts = { systemPrompt: SYSTEM_PROMPT, temperature: 0.7, topK: 40 };
    _chromeSession = typeof window.LanguageModel !== "undefined"
      ? await window.LanguageModel.create(opts)
      : await window.ai.languageModel.create(opts);
    return _chromeSession;
  }

  async function callChromeAI(prompt, onChunk) {
    const session = await getChromeSession();
    if (typeof session.promptStreaming === "function") {
      const stream = session.promptStreaming(prompt);
      let last = "";
      for await (const chunk of stream) {
        if (chunk !== last) { last = chunk; onChunk(chunk); }
      }
      return last;
    }
    const result = await session.prompt(prompt);
    onChunk(result);
    return result;
  }

  /* ════════════════════════════════════════════════════════════════════════
     TIER 2 — GROQ (user key, streaming)
  ════════════════════════════════════════════════════════════════════════ */
  async function callGroq(prompt, apiKey, onChunk) {
    const res = await fetch(GROQ_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type":"application/json", "Authorization":`Bearer ${apiKey}` },
      body: JSON.stringify({
        model: GROQ_MODELS[TOOL.model||"fast"],
        max_tokens: TOOL.maxTokens||500,
        temperature: 0.7, stream: true,
        messages: [
          { role:"system", content:SYSTEM_PROMPT },
          { role:"user",   content:prompt },
        ],
      }),
    });
    if (!res.ok) {
      const e = await res.text().catch(()=>"");
      if (res.status===401) throw new Error("Invalid Groq key — please check and re-save.");
      if (res.status===429) throw new Error("Groq rate limit — wait a minute or remove key to use free mode.");
      throw new Error(`Groq ${res.status}: ${e.slice(0,80)}`);
    }
    const reader=res.body.getReader(), dec=new TextDecoder(); let full="";
    while(true) {
      const {done,value}=await reader.read(); if(done) break;
      for(const line of dec.decode(value).split("\n")) {
        if(!line.startsWith("data: ")) continue;
        const d=line.slice(6).trim(); if(d==="[DONE]") continue;
        try { const t=JSON.parse(d)?.choices?.[0]?.delta?.content||""; full+=t; onChunk(full); } catch{}
      }
    }
    return full;
  }

  /* ════════════════════════════════════════════════════════════════════════
     TIER 3 — POLLINATIONS (free, no key, POST + GET fallback)
  ════════════════════════════════════════════════════════════════════════ */
  async function callPollinations(prompt, onChunk) {
    // Try POST first
    try {
      const res = await fetch("https://text.pollinations.ai/", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user",   content: prompt },
          ],
          model: "openai", private: true,
        }),
      });
      if (res.ok) {
        const text = (await res.text()).trim();
        if (text) { onChunk(text); return text; }
      }
    } catch {}

    // GET fallback (simpler, more reliable)
    try {
      const encoded = encodeURIComponent(
        SYSTEM_PROMPT.slice(0, 200) + "\n\n" + prompt
      );
      const res = await fetch(
        `https://text.pollinations.ai/${encoded}?model=openai&private=true`,
        { method: "GET" }
      );
      if (res.ok) {
        const text = (await res.text()).trim();
        if (text) { onChunk(text); return text; }
      }
    } catch {}

    throw new Error(
      "Free AI is currently busy. Please try again in a moment, or add your " +
      "<a href='https://console.groq.com/keys' target='_blank' style='color:var(--ac)'>free Groq key</a> above for reliable unlimited use."
    );
  }

  /* ════════════════════════════════════════════════════════════════════════
     TIER 2.5 — SERVER PROXY (our Groq key, no user key needed)
  ════════════════════════════════════════════════════════════════════════ */
  async function callProxy(prompt, onChunk) {
    try {
      const res = await fetch("/api/groq-proxy", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model:     GROQ_MODELS[TOOL.model || "fast"],
          maxTokens: TOOL.maxTokens || 500,
          messages:  [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user",   content: prompt },
          ],
        }),
      });
      if (!res.ok) {
        if (res.status === 503) return null; // Proxy not configured — try Pollinations
        return null;
      }
      const contentType = res.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        const data = await res.json();
        const content = data.content || "";
        if (content) { onChunk(content); return content; }
      }
    } catch {}
    return null; // Proxy failed — fall through
  }

  /* ════════════════════════════════════════════════════════════════════════
     GENERATE — 3-TIER ROUTER
  ════════════════════════════════════════════════════════════════════════ */
  async function generate(forceRegen = false) {
    const inputs = getInputValues();

    for (const inp of TOOL.inputs) {
      if (inp.required !== false && !inputs[inp.id]) {
        showError(`⚠️ Please fill in: <strong>${inp.label}</strong>`); return;
      }
    }

    hideError();
    const outWrap = document.getElementById("te-output-wrap");
    const outEl   = document.getElementById("te-output");
    const btn     = document.getElementById("te-generate");

    // Cache hit
    if (!forceRegen) {
      const cached = await cacheGet(inputs);
      if (cached) {
        outWrap.style.display = "block";
        outEl.textContent     = cached;
        showBadge("cache");
        updateRateBadge();
        return;
      }
    }
    showBadge(null);

    const prompt = buildPrompt(inputs);
    btn.disabled = true; btn.textContent = "⏳ Generating…";
    outWrap.style.display = "block";
    outEl.textContent     = "Working on it…";

    try {
      let result = "";

      // ── Tier 1: Chrome Built-in AI ──────────────────────────────────────
      const hasChromeAI = await detectChromeAI();
      if (hasChromeAI) {
        showBadge("chrome", true);
        outEl.textContent = "Running on your device…";
        try {
          result = await callChromeAI(prompt, t => { outEl.textContent = t; });
          showBadge("chrome");
        } catch (e) {
          console.warn("[TE] Chrome AI failed:", e.message);
          _chromeSession = null; result = "";
          outEl.textContent = "";
        }
      }

      // ── Tier 2: User's Groq key ─────────────────────────────────────────
      if (!result) {
        let apiKey = document.getElementById("te-api-key").value.trim();
        if (!apiKey) apiKey = await getApiKey();
        if (apiKey) {
          showBadge("groq", true);
          outEl.textContent = "Generating with Groq…";
          try {
            result = await callGroq(prompt, apiKey, t => { outEl.textContent = t; });
            showBadge("groq");
          } catch (e) {
            console.warn("[TE] Groq failed:", e.message);
            result = ""; outEl.textContent = "";
          }
        }
      }

      // ── Tier 2.5: Server proxy (our Groq key) ───────────────────────────
      if (!result) {
        showBadge("groq", true);
        outEl.textContent = "Generating…";
        const proxyResult = await callProxy(prompt, t => { outEl.textContent = t; });
        if (proxyResult) {
          result = proxyResult;
          showBadge("groq");
        }
      }

      // ── Tier 3: Pollinations free ───────────────────────────────────────
      if (!result) {
        if (!checkRate()) {
          const { reset } = rateRemaining();
          throw new Error(
            `Free limit reached (${RATE_LIMIT}/hour). Resets in ${reset}min. ` +
            `Add your <a href="https://console.groq.com/keys" target="_blank" style="color:var(--ac)">free Groq key</a> above for unlimited use.`
          );
        }
        showBadge("free", true);
        outEl.textContent = "Generating (free)…";
        result = await callPollinations(prompt, t => { outEl.textContent = t; });
        bumpRate();
        showBadge("free");
      }

      // ── Success ─────────────────────────────────────────────────────────
      outEl.textContent = result;
      await cacheSet(inputs, result);
      updateRateBadge();

    } catch (e) {
      // Show error but KEEP output wrap visible with error state
      outEl.textContent = "";
      outWrap.style.display = "none";
      showBadge(null);
      showError(
        (e.message || "Something went wrong.") +
        `<br><br>💡 <strong>Quick fix:</strong> Add your ` +
        `<a href="https://console.groq.com/keys" target="_blank" style="color:var(--ac)">free Groq key</a> ` +
        `above — takes 30 seconds and gives unlimited use.`
      );
    } finally {
      btn.disabled = false; btn.textContent = "⚡ Generate";
    }
  }

  /* ════════════════════════════════════════════════════════════════════════
     BADGE HELPER
  ════════════════════════════════════════════════════════════════════════ */
  const BADGE_CFG = {
    chrome: { label:"🧠 On-device", color:"#a5b4fc", bg:"rgba(129,140,248,.15)", border:"rgba(129,140,248,.3)" },
    groq:   { label:"⚡ Groq",      color:"#fbbf24", bg:"rgba(251,191,36,.15)",  border:"rgba(251,191,36,.3)"  },
    free:   { label:"🌐 Free AI",   color:"#34d399", bg:"rgba(52,211,153,.15)",  border:"rgba(52,211,153,.3)"  },
    cache:  { label:"⚡ Cached",    color:"#4ade80", bg:"rgba(34,197,94,.15)",   border:"rgba(34,197,94,.25)"  },
  };

  function showBadge(tier, loading = false) {
    const el = document.getElementById("te-ai-badge");
    if (!el) return;
    if (!tier) { el.style.display = "none"; return; }
    const cfg = BADGE_CFG[tier];
    el.style.cssText = `display:inline-flex;align-items:center;font-size:10px;padding:2px 9px;`+
      `border-radius:999px;font-weight:600;border:1px solid ${cfg.border};`+
      `background:${cfg.bg};color:${cfg.color};opacity:${loading?0.6:1}`;
    el.textContent = cfg.label + (loading ? " …" : "");
  }

  /* ════════════════════════════════════════════════════════════════════════
     UI BUILDER
  ════════════════════════════════════════════════════════════════════════ */
  function buildUI() {
    const mount = document.getElementById("te-mount");
    if (!mount) { console.error("[TE] No #te-mount found"); return; }

    mount.innerHTML = `
      <!-- Chrome AI Banner (shown when available) -->
      <div id="te-chrome-banner" style="display:none;background:rgba(129,140,248,.08);
        border:1px solid rgba(129,140,248,.2);border-radius:10px;padding:10px 14px;
        margin-bottom:14px;font-size:13px;color:#a5b4fc;gap:8px;align-items:center">
        🧠 <strong>On-device AI ready!</strong>&nbsp; Runs on your device — offline, private, completely free.
      </div>

      <!-- Groq Key (optional) -->
      <div class="te-card" style="margin-bottom:14px">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;flex-wrap:wrap;gap:6px">
          <span style="font-size:11px;font-weight:700;color:var(--mu);text-transform:uppercase;letter-spacing:.07em">
            🔑 Groq Key <span style="font-weight:400;text-transform:none;letter-spacing:0;color:var(--su)">(optional — better quality + unlimited)</span>
          </span>
          <span id="te-rate-badge" style="font-size:11px"></span>
        </div>
        <div class="te-input-row">
          <input type="password" id="te-api-key"
            placeholder="Paste your free Groq key for best quality + unlimited use"
            style="flex:1;background:transparent;border:none;outline:none;
              color:var(--fg);font-size:14px;padding:10px 12px;font-family:inherit"/>
          <button id="te-save-key" class="te-btn-sm">Save</button>
          <a href="https://console.groq.com/keys" target="_blank" rel="noopener"
            class="te-btn-sm" style="text-decoration:none">Get Key ↗</a>
        </div>
        <p id="te-tier-status" style="font-size:11px;color:var(--su);margin-top:7px">
          ✓ Works free without any key &nbsp;·&nbsp; Key = best quality + unlimited
        </p>
      </div>

      <!-- Inputs -->
      <div class="te-card" style="margin-bottom:14px">
        <div id="te-inputs"></div>
        <button id="te-generate" class="te-btn-primary" style="margin-top:16px;width:100%">
          ⚡ Generate
        </button>
      </div>

      <!-- Output -->
      <div id="te-output-wrap" class="te-card" style="display:none">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;flex-wrap:wrap;gap:6px">
          <div style="display:flex;align-items:center;gap:7px">
            <span style="font-size:11px;font-weight:700;color:var(--mu);text-transform:uppercase;letter-spacing:.07em">Output</span>
            <span id="te-ai-badge" style="display:none"></span>
          </div>
          <div style="display:flex;gap:6px">
            <button id="te-copy"  class="te-btn-sm">📋 Copy</button>
            <button id="te-regen" class="te-btn-sm">🔄 Redo</button>
          </div>
        </div>
        <div id="te-output"
          style="white-space:pre-wrap;font-size:14px;line-height:1.8;color:var(--fg);min-height:60px">
        </div>
      </div>

      <!-- Error -->
      <div id="te-error"
        style="display:none;background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.25);
          border-radius:10px;padding:14px;color:#f87171;font-size:14px;margin-top:10px;line-height:1.6">
      </div>
    `;

    TOOL.inputs.forEach(inp =>
      document.getElementById("te-inputs").insertAdjacentHTML("beforeend", renderInput(inp))
    );

    getApiKey().then(k => { if (k) document.getElementById("te-api-key").value = k; });

    // Detect Chrome AI and update UI
    detectChromeAI().then(ok => {
      if (ok) {
        const b = document.getElementById("te-chrome-banner");
        const s = document.getElementById("te-tier-status");
        if (b) b.style.display = "flex";
        if (s) s.innerHTML =
          `🧠 <strong style="color:#a5b4fc">On-device AI active</strong> &nbsp;·&nbsp; ` +
          `Offline · Private · No key needed · Unlimited`;
      }
      updateRateBadge();
    });

    document.getElementById("te-save-key").addEventListener("click", async () => {
      const k = document.getElementById("te-api-key").value.trim();
      if (!k) { showError("Please paste a Groq API key first."); return; }
      await saveApiKey(k);
      showToast("Groq key saved ✓");
      hideError();
      updateRateBadge();
    });

    document.getElementById("te-generate").addEventListener("click", () => generate(false));
    document.getElementById("te-regen").addEventListener("click",    () => generate(true));
    document.getElementById("te-copy").addEventListener("click",     copyOutput);
  }

  /* ════════════════════════════════════════════════════════════════════════
     HELPERS
  ════════════════════════════════════════════════════════════════════════ */
  function renderInput(inp) {
    const lbl = `<label class="te-label" for="te-inp-${inp.id}">${inp.label}</label>`;
    if (inp.type === "select") {
      const opts = inp.options.map(o=>`<option value="${o}">${o}</option>`).join("");
      return `<div style="margin-bottom:12px">${lbl}<div class="te-input-row">
        <select id="te-inp-${inp.id}" class="te-select">${opts}</select></div></div>`;
    }
    if (inp.type === "textarea") {
      return `<div style="margin-bottom:12px">${lbl}
        <textarea id="te-inp-${inp.id}" placeholder="${inp.placeholder||""}" rows="${inp.rows||3}"
          style="width:100%;background:var(--bg);border:1px solid var(--bor);border-radius:8px;
            padding:10px 12px;color:var(--fg);font-size:14px;outline:none;resize:vertical;
            font-family:inherit;transition:border-color .15s"
          onfocus="this.style.borderColor='var(--ac)'"
          onblur="this.style.borderColor='var(--bor)'"></textarea></div>`;
    }
    return `<div style="margin-bottom:12px">${lbl}<div class="te-input-row">
      <input type="text" id="te-inp-${inp.id}" placeholder="${inp.placeholder||""}"
        style="flex:1;background:transparent;border:none;outline:none;
          color:var(--fg);font-size:14px;padding:10px 12px;font-family:inherit"/>
      </div></div>`;
  }

  function getInputValues() {
    const v = {};
    TOOL.inputs.forEach(inp => {
      const el = document.getElementById(`te-inp-${inp.id}`);
      v[inp.id] = el ? el.value.trim() : "";
    });
    return v;
  }

  function updateRateBadge() {
    const el = document.getElementById("te-rate-badge");
    if (!el) return;
    Promise.all([detectChromeAI(), getApiKey()]).then(([hasChromeAI, key]) => {
      if (hasChromeAI || key) {
        el.textContent = "Unlimited ∞";
        el.style.color = "#4ade80";
      } else {
        const {left, reset} = rateRemaining();
        el.textContent = `${left}/${RATE_LIMIT} free · resets ${reset}m`;
        el.style.color = left < 3 ? "#f87171" : "var(--mu)";
      }
    });
  }

  function copyOutput() {
    navigator.clipboard.writeText(document.getElementById("te-output").textContent)
      .then(()=>showToast("Copied ✓")).catch(()=>showToast("Select text and copy manually"));
  }

  function showError(msg) {
    const el = document.getElementById("te-error");
    if (el) { el.innerHTML = msg; el.style.display = "block"; }
  }

  function hideError() {
    const el = document.getElementById("te-error");
    if (el) el.style.display = "none";
  }

  function showToast(msg) {
    const t = Object.assign(document.createElement("div"), { textContent: msg });
    t.style.cssText = "position:fixed;bottom:24px;right:20px;background:#22c55e;color:#fff;" +
      "padding:10px 18px;border-radius:10px;font-size:13px;z-index:9999;" +
      "font-family:'Segoe UI',system-ui,sans-serif;box-shadow:0 4px 14px rgba(0,0,0,.3)";
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2500);
  }

  /* ════════════════════════════════════════════════════════════════════════
     STYLES
  ════════════════════════════════════════════════════════════════════════ */
  function injectStyles() {
    const s = document.createElement("style");
    s.textContent = `
      .te-card{background:var(--sur);border:1px solid var(--bor);border-radius:12px;padding:20px}
      .te-label{display:block;font-size:11px;color:var(--mu);margin-bottom:5px;font-weight:700;text-transform:uppercase;letter-spacing:.07em}
      .te-input-row{display:flex;align-items:stretch;background:var(--bg);border:1px solid var(--bor);border-radius:8px;overflow:hidden;transition:border-color .15s}
      .te-input-row:focus-within{border-color:var(--ac)}
      .te-select{flex:1;background:transparent;border:none;outline:none;color:var(--fg);font-size:14px;padding:10px 12px;font-family:inherit;appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23a8a29e' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 10px center;padding-right:28px}
      .te-select option{background:var(--sur)}
      .te-btn-primary{background:var(--ac);color:var(--bg);border:none;border-radius:10px;padding:13px 24px;font-size:15px;font-weight:700;cursor:pointer;font-family:inherit;transition:opacity .15s}
      .te-btn-primary:hover{opacity:.85}
      .te-btn-primary:disabled{opacity:.45;cursor:not-allowed}
      .te-btn-sm{padding:5px 12px;font-size:12px;background:var(--bor);color:var(--mu);border:none;border-radius:6px;cursor:pointer;font-family:inherit;transition:all .15s;white-space:nowrap}
      .te-btn-sm:hover{background:var(--ac);color:var(--bg)}
    `;
    document.head.appendChild(s);
  }

  /* ════════════════════════════════════════════════════════════════════════
     BOOT
  ════════════════════════════════════════════════════════════════════════ */
  injectStyles();
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", buildUI);
  else
    buildUI();

  // Pre-warm Chrome AI detection (so first Generate is instant)
  setTimeout(() => detectChromeAI(), 500);

})();
