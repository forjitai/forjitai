/* ─── Forjit AI · Teacher Tool Engine v3.0 ──────────────────────────────────
 *
 *  Tier 1 → Chrome Built-in AI (Gemini Nano, if available)
 *  Tier 2 → Groq API (user's own key)
 *  Tier 3 → Pollinations AI (free, no key, POST then GET fallback)
 *
 *  Every API call has a timeout — button never freezes.
 *  Errors always visible — never a silent blank screen.
 *
 *  © 2025 Forjit AI · All rights reserved
 * ──────────────────────────────────────────────────────────────────────────*/

(function () {
  "use strict";

  /* ── Config ────────────────────────────────────────────────────────────── */
  const GROQ_URL  = "https://api.groq.com/openai/v1/chat/completions";
  const GROQ_MODELS = { fast: "llama-3.1-8b-instant", smart: "llama-3.3-70b-versatile" };
  const SYS = "You are an expert Indian teacher assistant. Be practical and clear. " +
              "Use plain text with clear section headings (no markdown ** or ##). " +
              "Follow CBSE/ICSE/State Board curriculum context.";

  const RATE_LIMIT   = 10;
  const CACHE_TTL    = 7 * 24 * 60 * 60 * 1000; // 7 days
  const MAX_CACHE    = 50;
  const API_TIMEOUT  = 20000; // 20s timeout on every call
  const DB_NAME      = "forjitai_db";

  /* ── Load tool config ──────────────────────────────────────────────────── */
  const cfgEl = document.getElementById("tool-config");
  if (!cfgEl) { console.error("[TE] Missing #tool-config"); return; }
  const TOOL = JSON.parse(cfgEl.textContent);

  let _chromeSession   = null;
  let _chromeAvailable = null;

  /* ════════════════════════════════════════════════════════════════════════
     UTILITIES
  ════════════════════════════════════════════════════════════════════════ */

  /** Wraps a promise with a timeout */
  function withTimeout(promise, ms = API_TIMEOUT) {
    return Promise.race([
      promise,
      new Promise((_, rej) =>
        setTimeout(() => rej(new Error("Request timed out. Please try again.")), ms)
      ),
    ]);
  }

  /* ════════════════════════════════════════════════════════════════════════
     INDEXEDDB
  ════════════════════════════════════════════════════════════════════════ */
  function openDB() {
    return new Promise((res, rej) => {
      const r = indexedDB.open(DB_NAME, 1);
      r.onupgradeneeded = () => {
        const db = r.result;
        ["errorLog","history","feedback","users","uploads","teacherCache"]
          .forEach(s => { if (!db.objectStoreNames.contains(s))
            db.createObjectStore(s, { keyPath: "key" }); });
      };
      r.onsuccess = () => res(r.result);
      r.onerror   = () => rej(r.error);
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
    if (!e || Date.now() - e.ts > CACHE_TTL) return null;
    return e.output;
  }

  async function cacheSet(inputs, output) {
    await dbSet("teacherCache", cacheKey(inputs), { output, ts: Date.now() });
    try {
      const db    = await openDB();
      const store = db.transaction("teacherCache","readwrite").objectStore("teacherCache");
      const all   = await new Promise(res => {
        const r = store.getAll(); r.onsuccess = () => res(r.result);
      });
      if (all.length > MAX_CACHE)
        all.sort((a,b) => a.value.ts - b.value.ts)
           .slice(0, all.length - MAX_CACHE)
           .forEach(e => store.delete(e.key));
    } catch {}
  }

  /* ════════════════════════════════════════════════════════════════════════
     RATE LIMITER
  ════════════════════════════════════════════════════════════════════════ */
  function getRateData() {
    try {
      const d = JSON.parse(localStorage.getItem("te_rate") || "{}");
      return (!d.hour || Date.now() - d.hour > 3600000)
        ? { count: 0, hour: Date.now() } : d;
    } catch { return { count: 0, hour: Date.now() }; }
  }
  const checkRate = ()  => getRateData().count < RATE_LIMIT;
  const bumpRate  = ()  => {
    const d = getRateData(); d.count++;
    localStorage.setItem("te_rate", JSON.stringify(d));
  };
  const rateLeft  = ()  => {
    const d = getRateData();
    return {
      left:  Math.max(0, RATE_LIMIT - d.count),
      reset: Math.max(0, Math.ceil((d.hour + 3600000 - Date.now()) / 60000)),
    };
  };

  /* ════════════════════════════════════════════════════════════════════════
     API KEY
  ════════════════════════════════════════════════════════════════════════ */
  const getApiKey  = ()    => dbGet("users", "teacher_groq_key");
  const saveApiKey = (key) => dbSet("users", "teacher_groq_key", key);

  /* ════════════════════════════════════════════════════════════════════════
     PROMPT BUILDER
  ════════════════════════════════════════════════════════════════════════ */
  function buildPrompt(inputs) {
    let p = TOOL.promptTemplate || "";
    Object.entries(inputs).forEach(([k, v]) => { p = p.replaceAll("{{" + k + "}}", v); });
    return p;
  }

  /* ════════════════════════════════════════════════════════════════════════
     TIER 1 — CHROME BUILT-IN AI
  ════════════════════════════════════════════════════════════════════════ */
  async function detectChromeAI() {
    if (_chromeAvailable !== null) return _chromeAvailable;
    try {
      if (typeof window.LanguageModel !== "undefined") {
        const a = await window.LanguageModel.availability();
        _chromeAvailable = (a === "available" || a === "readily");
      } else if (typeof window.ai?.languageModel !== "undefined") {
        const c = await window.ai.languageModel.capabilities();
        _chromeAvailable = (c?.available === "readily");
      } else {
        _chromeAvailable = false;
      }
    } catch { _chromeAvailable = false; }
    return _chromeAvailable;
  }

  async function callChromeAI(prompt, onChunk) {
    if (!_chromeSession) {
      const opts = { systemPrompt: SYS, temperature: 0.7, topK: 40 };
      _chromeSession = typeof window.LanguageModel !== "undefined"
        ? await window.LanguageModel.create(opts)
        : await window.ai.languageModel.create(opts);
    }
    if (typeof _chromeSession.promptStreaming === "function") {
      const stream = _chromeSession.promptStreaming(prompt);
      let last = "";
      for await (const chunk of stream) {
        if (chunk !== last) { last = chunk; onChunk(chunk); }
      }
      return last;
    }
    const r = await _chromeSession.prompt(prompt);
    onChunk(r);
    return r;
  }

  /* ════════════════════════════════════════════════════════════════════════
     TIER 2 — GROQ (user key, streaming)
  ════════════════════════════════════════════════════════════════════════ */
  async function callGroq(prompt, apiKey, onChunk) {
    const res = await withTimeout(fetch(GROQ_URL, {
      method:  "POST",
      headers: { "Content-Type": "application/json", "Authorization": "Bearer " + apiKey },
      body: JSON.stringify({
        model:       GROQ_MODELS[TOOL.model || "fast"],
        max_tokens:  TOOL.maxTokens || 500,
        temperature: 0.7,
        stream:      true,
        messages:    [{ role: "system", content: SYS }, { role: "user", content: prompt }],
      }),
    }));

    if (!res.ok) {
      const e = await res.text().catch(() => "");
      if (res.status === 401) throw new Error("Invalid Groq key. Please re-check and save.");
      if (res.status === 429) throw new Error("Groq rate limit hit. Please wait a minute.");
      throw new Error("Groq error " + res.status);
    }

    const reader = res.body.getReader();
    const dec    = new TextDecoder();
    let full = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      for (const line of dec.decode(value).split("\n")) {
        if (!line.startsWith("data: ")) continue;
        const d = line.slice(6).trim();
        if (d === "[DONE]") continue;
        try {
          const t = JSON.parse(d)?.choices?.[0]?.delta?.content || "";
          full += t; onChunk(full);
        } catch {}
      }
    }
    return full;
  }

  /* ════════════════════════════════════════════════════════════════════════
     TIER 3 — POLLINATIONS (free, no key, with timeout + GET fallback)
  ════════════════════════════════════════════════════════════════════════ */
  async function callPollinations(prompt, onChunk) {
    // POST method
    try {
      const res = await withTimeout(fetch("https://text.pollinations.ai/", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "system", content: SYS }, { role: "user", content: prompt }],
          model: "openai", private: true,
        }),
      }), 15000);

      if (res.ok) {
        const text = (await res.text()).trim();
        if (text && text.length > 10) { onChunk(text); return text; }
      }
    } catch (e) {
      console.warn("[TE] Pollinations POST failed:", e.message);
    }

    // GET fallback — simpler, often more reliable
    try {
      const q   = encodeURIComponent(prompt.slice(0, 1000));
      const res = await withTimeout(
        fetch("https://text.pollinations.ai/" + q + "?model=openai&private=true"),
        15000
      );
      if (res.ok) {
        const text = (await res.text()).trim();
        if (text && text.length > 10) { onChunk(text); return text; }
      }
    } catch (e) {
      console.warn("[TE] Pollinations GET failed:", e.message);
    }

    throw new Error("free-unavailable");
  }

  /* ════════════════════════════════════════════════════════════════════════
     GENERATE — MAIN ROUTER
  ════════════════════════════════════════════════════════════════════════ */
  async function generate(forceRegen) {
    const inputs = getInputValues();

    // Validate
    for (const inp of TOOL.inputs) {
      if (inp.required !== false && !inputs[inp.id]) {
        showErr("Please fill in: " + inp.label);
        return;
      }
    }

    hideErr();
    const outWrap = document.getElementById("te-output-wrap");
    const outEl   = document.getElementById("te-output");
    const btn     = document.getElementById("te-generate");

    // Cache
    if (!forceRegen) {
      const cached = await cacheGet(inputs);
      if (cached) {
        outWrap.style.display = "block";
        outEl.textContent     = cached;
        setBadge("cache");
        updateBadge();
        return;
      }
    }
    setBadge(null);

    const prompt = buildPrompt(inputs);
    btn.disabled    = true;
    btn.textContent = "⏳ Generating…";
    outWrap.style.display = "block";
    outEl.textContent     = "Starting…";

    let result = "";
    let errorMsg = "";

    try {

      // ── Tier 1: Chrome AI ──────────────────────────────────────────────
      if (await detectChromeAI()) {
        setBadge("chrome", true);
        outEl.textContent = "Running on your device…";
        try {
          result = await withTimeout(callChromeAI(prompt, t => { outEl.textContent = t; }));
          if (result) setBadge("chrome");
        } catch (e) {
          console.warn("[TE] Chrome AI failed:", e.message);
          _chromeSession = null; result = "";
        }
      }

      // ── Tier 2: Groq (user key) ────────────────────────────────────────
      if (!result) {
        let key = document.getElementById("te-api-key").value.trim();
        if (!key) key = await getApiKey();
        if (key) {
          setBadge("groq", true);
          outEl.textContent = "Generating with Groq…";
          try {
            result = await callGroq(prompt, key, t => { outEl.textContent = t; });
            if (result) setBadge("groq");
          } catch (e) {
            console.warn("[TE] Groq failed:", e.message);
            errorMsg = e.message; result = "";
          }
        }
      }

      // ── Tier 3: Pollinations ───────────────────────────────────────────
      if (!result) {
        if (!checkRate()) {
          const { reset } = rateLeft();
          showErr(
            "Free limit reached (" + RATE_LIMIT + "/hour). Resets in " + reset + " min.\n" +
            "Add your free Groq key above for unlimited use."
          );
          outWrap.style.display = "none";
          outEl.textContent = "";
          btn.disabled = false; btn.textContent = "⚡ Generate";
          return;
        }
        setBadge("free", true);
        outEl.textContent = "Generating (free)…";
        try {
          result = await callPollinations(prompt, t => { outEl.textContent = t; });
          if (result) { bumpRate(); setBadge("free"); }
        } catch (e) {
          result = "";
          errorMsg = "free-unavailable";
        }
      }

      // ── All tiers failed ───────────────────────────────────────────────
      if (!result) {
        outWrap.style.display = "none";
        outEl.textContent = "";
        setBadge(null);
        showErr(
          "Could not generate — please add your free Groq key above.\n" +
          "Get one free at console.groq.com/keys (takes 30 seconds).\n" +
          (errorMsg && errorMsg !== "free-unavailable" ? "\nDetails: " + errorMsg : "")
        );
        btn.disabled = false; btn.textContent = "⚡ Generate";
        return;
      }

      // ── Success ────────────────────────────────────────────────────────
      outEl.textContent = result;
      await cacheSet(inputs, result);
      updateBadge();

    } catch (e) {
      outWrap.style.display = "none";
      outEl.textContent = "";
      setBadge(null);
      showErr("Something went wrong: " + (e.message || "unknown error") + "\nPlease try again.");
    }

    btn.disabled    = false;
    btn.textContent = "⚡ Generate";
  }

  /* ════════════════════════════════════════════════════════════════════════
     UI
  ════════════════════════════════════════════════════════════════════════ */
  const BADGES = {
    chrome: { label: "🧠 On-device",  color: "#a5b4fc", bg: "rgba(129,140,248,.15)", bdr: "rgba(129,140,248,.3)" },
    groq:   { label: "⚡ Groq",       color: "#fbbf24", bg: "rgba(251,191,36,.15)",  bdr: "rgba(251,191,36,.3)"  },
    free:   { label: "🌐 Free AI",    color: "#34d399", bg: "rgba(52,211,153,.15)",  bdr: "rgba(52,211,153,.3)"  },
    cache:  { label: "⚡ Cached",     color: "#4ade80", bg: "rgba(34,197,94,.15)",   bdr: "rgba(34,197,94,.25)"  },
  };

  function setBadge(tier, loading) {
    const el = document.getElementById("te-ai-badge");
    if (!el) return;
    if (!tier) { el.style.display = "none"; return; }
    const b = BADGES[tier];
    el.style.cssText =
      "display:inline-flex;align-items:center;font-size:10px;padding:2px 9px;" +
      "border-radius:999px;font-weight:600;border:1px solid " + b.bdr + ";" +
      "background:" + b.bg + ";color:" + b.color + ";opacity:" + (loading ? 0.6 : 1);
    el.textContent = b.label + (loading ? " …" : "");
  }

  function updateBadge() {
    const el = document.getElementById("te-rate-badge");
    if (!el) return;
    Promise.all([detectChromeAI(), getApiKey()]).then(([chrome, key]) => {
      if (chrome || key) {
        el.textContent = "Unlimited ∞"; el.style.color = "#4ade80";
      } else {
        const { left, reset } = rateLeft();
        el.textContent = left + "/" + RATE_LIMIT + " free · resets " + reset + "m";
        el.style.color = left < 3 ? "#f87171" : "var(--mu)";
      }
    });
  }

  function buildUI() {
    const mount = document.getElementById("te-mount");
    if (!mount) { console.error("[TE] No #te-mount"); return; }

    mount.innerHTML =
      '<div id="te-chrome-banner" style="display:none;background:rgba(129,140,248,.08);' +
        'border:1px solid rgba(129,140,248,.2);border-radius:10px;padding:10px 14px;' +
        'margin-bottom:14px;font-size:13px;color:#a5b4fc;align-items:center;gap:8px">' +
        '🧠 <strong>On-device AI ready!</strong> Runs on your device — offline, private, free.' +
      '</div>' +

      '<div class="te-card" style="margin-bottom:14px">' +
        '<div style="display:flex;align-items:center;justify-content:space-between;' +
          'margin-bottom:10px;flex-wrap:wrap;gap:6px">' +
          '<span style="font-size:11px;font-weight:700;color:var(--mu);' +
            'text-transform:uppercase;letter-spacing:.07em">' +
            '🔑 Groq Key ' +
            '<span style="font-weight:400;text-transform:none;letter-spacing:0;color:var(--su)">' +
              '(optional — better quality)' +
            '</span>' +
          '</span>' +
          '<span id="te-rate-badge" style="font-size:11px;color:var(--mu)"></span>' +
        '</div>' +
        '<div class="te-input-row">' +
          '<input type="password" id="te-api-key" ' +
            'placeholder="Paste free Groq key — stored in your browser only" ' +
            'style="flex:1;background:transparent;border:none;outline:none;' +
              'color:var(--fg);font-size:14px;padding:10px 12px;font-family:inherit"/>' +
          '<button id="te-save-key" class="te-btn-sm">Save</button>' +
          '<a href="https://console.groq.com/keys" target="_blank" rel="noopener" ' +
            'class="te-btn-sm" style="text-decoration:none">Get Key ↗</a>' +
        '</div>' +
        '<p id="te-tier-status" style="font-size:11px;color:var(--su);margin-top:7px">' +
          '✓ Works free without any key &nbsp;·&nbsp; Key = unlimited + best quality' +
        '</p>' +
      '</div>' +

      '<div class="te-card" style="margin-bottom:14px">' +
        '<div id="te-inputs"></div>' +
        '<button id="te-generate" class="te-btn-primary" ' +
          'style="margin-top:16px;width:100%">⚡ Generate</button>' +
      '</div>' +

      '<div id="te-output-wrap" class="te-card" style="display:none">' +
        '<div style="display:flex;align-items:center;justify-content:space-between;' +
          'margin-bottom:12px;flex-wrap:wrap;gap:6px">' +
          '<div style="display:flex;align-items:center;gap:7px">' +
            '<span style="font-size:11px;font-weight:700;color:var(--mu);' +
              'text-transform:uppercase;letter-spacing:.07em">Output</span>' +
            '<span id="te-ai-badge" style="display:none"></span>' +
          '</div>' +
          '<div style="display:flex;gap:6px">' +
            '<button id="te-copy" class="te-btn-sm">📋 Copy</button>' +
            '<button id="te-regen" class="te-btn-sm">🔄 Redo</button>' +
          '</div>' +
        '</div>' +
        '<div id="te-output" ' +
          'style="white-space:pre-wrap;font-size:14px;line-height:1.8;' +
            'color:var(--fg);min-height:60px"></div>' +
      '</div>' +

      '<div id="te-error" ' +
        'style="display:none;background:rgba(239,68,68,.1);' +
          'border:1px solid rgba(239,68,68,.25);border-radius:10px;' +
          'padding:14px;color:#f87171;font-size:14px;margin-top:10px;' +
          'white-space:pre-line;line-height:1.7">' +
      '</div>';

    // Render tool inputs
    TOOL.inputs.forEach(inp =>
      document.getElementById("te-inputs")
        .insertAdjacentHTML("beforeend", renderInput(inp))
    );

    // Load saved API key
    getApiKey().then(k => { if (k) document.getElementById("te-api-key").value = k; });

    // Chrome AI check → update banner
    detectChromeAI().then(ok => {
      if (ok) {
        const b = document.getElementById("te-chrome-banner");
        const s = document.getElementById("te-tier-status");
        if (b) b.style.display = "flex";
        if (s) s.textContent = "🧠 On-device AI active · Offline · Private · Unlimited";
      }
      updateBadge();
    });

    // Wire up buttons
    document.getElementById("te-save-key").onclick = async () => {
      const k = document.getElementById("te-api-key").value.trim();
      if (!k) { showErr("Please paste a Groq API key first."); return; }
      await saveApiKey(k);
      toast("Groq key saved ✓");
      hideErr();
      updateBadge();
    };
    document.getElementById("te-generate").onclick = () => generate(false);
    document.getElementById("te-regen").onclick    = () => generate(true);
    document.getElementById("te-copy").onclick     = () => {
      const t = document.getElementById("te-output").textContent;
      navigator.clipboard.writeText(t).then(() => toast("Copied ✓")).catch(() => {});
    };
  }

  /* ════════════════════════════════════════════════════════════════════════
     RENDER INPUT
  ════════════════════════════════════════════════════════════════════════ */
  function renderInput(inp) {
    const lbl = '<label class="te-label" for="te-inp-' + inp.id + '">' + inp.label + '</label>';

    if (inp.type === "select") {
      const opts = inp.options.map(o => '<option value="' + o + '">' + o + '</option>').join("");
      return '<div style="margin-bottom:12px">' + lbl +
        '<div class="te-input-row">' +
          '<select id="te-inp-' + inp.id + '" class="te-select">' + opts + '</select>' +
        '</div></div>';
    }
    if (inp.type === "textarea") {
      return '<div style="margin-bottom:12px">' + lbl +
        '<textarea id="te-inp-' + inp.id + '" placeholder="' + (inp.placeholder || "") + '" ' +
          'rows="' + (inp.rows || 3) + '" ' +
          'style="width:100%;background:var(--bg);border:1px solid var(--bor);' +
            'border-radius:8px;padding:10px 12px;color:var(--fg);font-size:14px;' +
            'outline:none;resize:vertical;font-family:inherit;transition:border-color .15s" ' +
          'onfocus="this.style.borderColor=\'var(--ac)\'" ' +
          'onblur="this.style.borderColor=\'var(--bor)\'"></textarea></div>';
    }
    return '<div style="margin-bottom:12px">' + lbl +
      '<div class="te-input-row">' +
        '<input type="text" id="te-inp-' + inp.id + '" ' +
          'placeholder="' + (inp.placeholder || "") + '" ' +
          'style="flex:1;background:transparent;border:none;outline:none;' +
            'color:var(--fg);font-size:14px;padding:10px 12px;font-family:inherit"/>' +
      '</div></div>';
  }

  function getInputValues() {
    const v = {};
    TOOL.inputs.forEach(inp => {
      const el = document.getElementById("te-inp-" + inp.id);
      v[inp.id] = el ? el.value.trim() : "";
    });
    return v;
  }

  /* ════════════════════════════════════════════════════════════════════════
     HELPERS
  ════════════════════════════════════════════════════════════════════════ */
  function showErr(msg) {
    const el = document.getElementById("te-error");
    if (el) { el.textContent = msg; el.style.display = "block"; }
  }
  function hideErr() {
    const el = document.getElementById("te-error");
    if (el) el.style.display = "none";
  }
  function toast(msg) {
    const t = document.createElement("div");
    t.textContent = msg;
    t.style.cssText =
      "position:fixed;bottom:24px;right:20px;background:#22c55e;color:#fff;" +
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
    s.textContent =
      ".te-card{background:var(--sur);border:1px solid var(--bor);border-radius:12px;padding:20px}" +
      ".te-label{display:block;font-size:11px;color:var(--mu);margin-bottom:5px;font-weight:700;" +
        "text-transform:uppercase;letter-spacing:.07em}" +
      ".te-input-row{display:flex;align-items:stretch;background:var(--bg);" +
        "border:1px solid var(--bor);border-radius:8px;overflow:hidden;transition:border-color .15s}" +
      ".te-input-row:focus-within{border-color:var(--ac)}" +
      ".te-select{flex:1;background:transparent;border:none;outline:none;color:var(--fg);" +
        "font-size:14px;padding:10px 12px;font-family:inherit;appearance:none;" +
        "background-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' " +
          "width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23a8a29e' " +
          "stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E\");" +
        "background-repeat:no-repeat;background-position:right 10px center;padding-right:28px}" +
      ".te-select option{background:var(--sur)}" +
      ".te-btn-primary{background:var(--ac);color:var(--bg);border:none;border-radius:10px;" +
        "padding:13px 24px;font-size:15px;font-weight:700;cursor:pointer;font-family:inherit;" +
        "transition:opacity .15s;width:100%}" +
      ".te-btn-primary:hover{opacity:.85}" +
      ".te-btn-primary:disabled{opacity:.45;cursor:not-allowed}" +
      ".te-btn-sm{padding:5px 12px;font-size:12px;background:var(--bor);color:var(--mu);" +
        "border:none;border-radius:6px;cursor:pointer;font-family:inherit;" +
        "transition:all .15s;white-space:nowrap}" +
      ".te-btn-sm:hover{background:var(--ac);color:var(--bg)}";
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

  setTimeout(() => detectChromeAI(), 800);

})();
