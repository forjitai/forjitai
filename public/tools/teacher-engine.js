/* ─── Forjit AI · Teacher Tool Engine v4.0 ──────────────────────────────────
 *  Fixes: instant button feedback, timeouts on ALL async ops,
 *         clear Groq key CTA, Pollinations as last resort only.
 *  © 2025 Forjit AI · All rights reserved
 * ──────────────────────────────────────────────────────────────────────────*/
(function () {
  "use strict";

  const GROQ_URL    = "https://api.groq.com/openai/v1/chat/completions";
  const GROQ_MODELS = { fast: "llama-3.1-8b-instant", smart: "llama-3.3-70b-versatile" };
  const SYS = "You are an expert Indian teacher assistant. Be practical and clear. " +
    "Use plain text with clear section headings. No markdown ** or ##. " +
    "Follow CBSE/ICSE/State Board curriculum.";
  const RATE_LIMIT = 10;
  const CACHE_TTL  = 7 * 24 * 60 * 60 * 1000;
  const DB_NAME    = "forjitai_db";

  const cfgEl = document.getElementById("tool-config");
  if (!cfgEl) { console.error("[TE] No #tool-config"); return; }
  const TOOL = JSON.parse(cfgEl.textContent);

  /* ── Timeout helper ──────────────────────────────────────────────────── */
  function timeout(ms) {
    return new Promise((_, r) => setTimeout(() => r(new Error("timeout")), ms));
  }
  function race(promise, ms) {
    return Promise.race([promise, timeout(ms)]);
  }

  /* ── IndexedDB ───────────────────────────────────────────────────────── */
  function openDB() {
    return new Promise((res, rej) => {
      const r = indexedDB.open(DB_NAME, 1);
      r.onupgradeneeded = () => {
        ["errorLog","history","feedback","users","uploads","teacherCache"]
          .forEach(s => { if (!r.result.objectStoreNames.contains(s))
            r.result.createObjectStore(s, { keyPath: "key" }); });
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

  /* ── Cache ───────────────────────────────────────────────────────────── */
  function cKey(inputs) {
    return "tc_" + btoa(encodeURIComponent(TOOL.id + JSON.stringify(inputs))).slice(0, 80);
  }
  async function cacheGet(inputs) {
    const e = await dbGet("teacherCache", cKey(inputs));
    return (e && Date.now() - e.ts < CACHE_TTL) ? e.output : null;
  }
  async function cacheSet(inputs, output) {
    await dbSet("teacherCache", cKey(inputs), { output, ts: Date.now() });
  }

  /* ── Rate limit ──────────────────────────────────────────────────────── */
  function rd() {
    try {
      const d = JSON.parse(localStorage.getItem("te_rate") || "{}");
      return (!d.hour || Date.now() - d.hour > 3600000) ? { count:0, hour:Date.now() } : d;
    } catch { return { count:0, hour:Date.now() }; }
  }
  const canUse = () => rd().count < RATE_LIMIT;
  const useOne = () => { const d = rd(); d.count++; localStorage.setItem("te_rate", JSON.stringify(d)); };
  function rateInfo() {
    const d = rd();
    return { left: Math.max(0, RATE_LIMIT - d.count),
             reset: Math.max(0, Math.ceil((d.hour + 3600000 - Date.now()) / 60000)) };
  }

  /* ── API key ─────────────────────────────────────────────────────────── */
  const getKey  = ()    => dbGet("users", "teacher_groq_key");
  const saveKey = (key) => dbSet("users", "teacher_groq_key", key);

  /* ── Prompt ──────────────────────────────────────────────────────────── */
  function buildPrompt(inputs) {
    let p = TOOL.promptTemplate || "";
    Object.entries(inputs).forEach(([k,v]) => { p = p.replaceAll("{{"+k+"}}", v); });
    return p;
  }

  /* ── Chrome AI (with 3s timeout) ─────────────────────────────────────── */
  let _chromeOk = null, _chromeSess = null;
  async function hasChromeAI() {
    if (_chromeOk !== null) return _chromeOk;
    try {
      if (typeof window.LanguageModel !== "undefined") {
        const a = await race(window.LanguageModel.availability(), 3000);
        _chromeOk = (a === "available" || a === "readily");
      } else if (typeof window.ai?.languageModel !== "undefined") {
        const c = await race(window.ai.languageModel.capabilities(), 3000);
        _chromeOk = (c?.available === "readily");
      } else { _chromeOk = false; }
    } catch { _chromeOk = false; }
    return _chromeOk;
  }
  async function callChrome(prompt, onChunk) {
    if (!_chromeSess) {
      const opts = { systemPrompt: SYS, temperature: 0.7, topK: 40 };
      _chromeSess = typeof window.LanguageModel !== "undefined"
        ? await race(window.LanguageModel.create(opts), 10000)
        : await race(window.ai.languageModel.create(opts), 10000);
    }
    if (typeof _chromeSess.promptStreaming === "function") {
      const stream = _chromeSess.promptStreaming(prompt);
      let last = "";
      for await (const chunk of stream) {
        if (chunk !== last) { last = chunk; onChunk(chunk); }
      }
      return last;
    }
    const r = await race(_chromeSess.prompt(prompt), 30000);
    onChunk(r); return r;
  }

  /* ── Groq (user key) ─────────────────────────────────────────────────── */
  async function callGroq(prompt, key, onChunk) {
    const res = await race(fetch(GROQ_URL, {
      method: "POST",
      headers: { "Content-Type":"application/json", "Authorization":"Bearer "+key },
      body: JSON.stringify({
        model: GROQ_MODELS[TOOL.model||"fast"],
        max_tokens: TOOL.maxTokens||500,
        temperature: 0.7, stream: true,
        messages: [{ role:"system", content:SYS }, { role:"user", content:prompt }],
      }),
    }), 25000);

    if (!res.ok) {
      const e = await res.text().catch(()=>"");
      if (res.status === 401) throw new Error("Invalid Groq key — please re-check.");
      if (res.status === 429) throw new Error("Groq limit hit — wait 1 min.");
      throw new Error("Groq error " + res.status + ": " + e.slice(0,60));
    }

    const reader = res.body.getReader(), dec = new TextDecoder();
    let full = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      for (const line of dec.decode(value).split("\n")) {
        if (!line.startsWith("data: ")) continue;
        const d = line.slice(6).trim();
        if (d === "[DONE]") continue;
        try { const t = JSON.parse(d)?.choices?.[0]?.delta?.content||""; full+=t; onChunk(full); } catch {}
      }
    }
    return full;
  }

  /* ── Pollinations (free, last resort) ───────────────────────────────── */
  async function callPollinations(prompt, onChunk) {
    // POST
    try {
      const res = await race(fetch("https://text.pollinations.ai/", {
        method: "POST", headers: { "Content-Type":"application/json" },
        body: JSON.stringify({
          messages: [{ role:"system", content:SYS }, { role:"user", content:prompt }],
          model:"openai", private:true,
        }),
      }), 18000);
      if (res.ok) {
        const t = (await res.text()).trim();
        if (t.length > 20) { onChunk(t); return t; }
      }
    } catch {}

    // GET fallback
    try {
      const q = encodeURIComponent(SYS.slice(0,100) + "\n" + prompt.slice(0,500));
      const res = await race(fetch("https://text.pollinations.ai/" + q + "?model=openai&private=true"), 18000);
      if (res.ok) {
        const t = (await res.text()).trim();
        if (t.length > 20) { onChunk(t); return t; }
      }
    } catch {}

    return null; // Signal failure without throwing
  }

  /* ════════════════════════════════════════════════════════════════════════
     GENERATE
  ════════════════════════════════════════════════════════════════════════ */
  async function generate(forceRegen) {
    const inputs = getInputValues();

    // Validate
    for (const inp of TOOL.inputs) {
      if (inp.required !== false && !inputs[inp.id]) {
        setStatus("error", "Please fill in: " + inp.label); return;
      }
    }

    // Cache check
    if (!forceRegen) {
      const cached = await cacheGet(inputs);
      if (cached) {
        showOutput(cached, "cache");
        return;
      }
    }

    // ── IMMEDIATELY show loading state ──────────────────────────────────
    const btn = document.getElementById("te-generate");
    btn.disabled = true;
    btn.textContent = "⏳ Working…";
    setStatus("loading", "Starting…");
    showOutput("", null);

    const prompt = buildPrompt(inputs);
    let result = "", tier = "";

    // ── Tier 1: Chrome AI ───────────────────────────────────────────────
    if (await hasChromeAI()) {
      setStatus("loading", "Running on your device…");
      try {
        result = await race(callChrome(prompt, t => {
          showOutput(t, null);
          setStatus("loading", "On-device AI generating…");
        }), 35000);
        if (result) tier = "chrome";
      } catch (e) { _chromeSess = null; result = ""; }
    }

    // ── Tier 2: Groq key ────────────────────────────────────────────────
    if (!result) {
      let key = document.getElementById("te-api-key").value.trim();
      if (!key) key = await getKey();
      if (key) {
        setStatus("loading", "Generating with Groq…");
        try {
          result = await callGroq(prompt, key, t => {
            showOutput(t, null);
          });
          if (result) tier = "groq";
        } catch (e) {
          setStatus("error", e.message);
          resetBtn(btn); return;
        }
      }
    }

    // ── Tier 3: Pollinations ────────────────────────────────────────────
    if (!result) {
      if (!canUse()) {
        const { reset } = rateInfo();
        setStatus("error",
          "Free limit reached (" + RATE_LIMIT + "/hr). Resets in " + reset + " min.\n" +
          "Add your free Groq key above for unlimited use."
        );
        resetBtn(btn); return;
      }
      setStatus("loading", "Generating (free AI)… please wait up to 20s");
      const r = await callPollinations(prompt, t => showOutput(t, null));
      if (r) { useOne(); result = r; tier = "free"; }
    }

    // ── All failed ──────────────────────────────────────────────────────
    if (!result) {
      document.getElementById("te-output-wrap").style.display = "none";
      setStatus("error",
        "Could not generate — free AI is unavailable right now.\n\n" +
        "Quick fix: Add your FREE Groq key above.\n" +
        "Get one in 30 sec → console.groq.com/keys\n" +
        "(Free account · No credit card · 100 req/min)"
      );
      resetBtn(btn); return;
    }

    // ── Success ─────────────────────────────────────────────────────────
    showOutput(result, tier);
    await cacheSet(inputs, result);
    setStatus("ok", "");
    updateRateBadge();
    resetBtn(btn);
  }

  /* ── UI helpers ──────────────────────────────────────────────────────── */
  function resetBtn(btn) {
    btn.disabled = false;
    btn.textContent = "⚡ Generate";
  }

  const BADGE = {
    chrome: { label:"🧠 On-device", c:"#a5b4fc", bg:"rgba(129,140,248,.15)", b:"rgba(129,140,248,.3)" },
    groq:   { label:"⚡ Groq",      c:"#fbbf24", bg:"rgba(251,191,36,.15)",  b:"rgba(251,191,36,.3)" },
    free:   { label:"🌐 Free AI",   c:"#34d399", bg:"rgba(52,211,153,.15)",  b:"rgba(52,211,153,.3)" },
    cache:  { label:"⚡ Cached",    c:"#4ade80", bg:"rgba(34,197,94,.15)",   b:"rgba(34,197,94,.25)" },
  };

  function showOutput(text, tier) {
    const wrap = document.getElementById("te-output-wrap");
    const out  = document.getElementById("te-output");
    const bdg  = document.getElementById("te-ai-badge");
    if (!wrap) return;
    wrap.style.display = "block";
    if (out) out.textContent = text;
    if (bdg) {
      if (!tier) { bdg.style.display = "none"; }
      else {
        const b = BADGE[tier] || {};
        bdg.style.cssText = "display:inline-flex;align-items:center;font-size:10px;" +
          "padding:2px 9px;border-radius:999px;font-weight:600;" +
          "border:1px solid " + (b.b||"") + ";background:" + (b.bg||"") + ";color:" + (b.c||"");
        bdg.textContent = b.label || tier;
      }
    }
  }

  function setStatus(type, msg) {
    const el = document.getElementById("te-status");
    if (!el) return;
    if (type === "ok" || !msg) { el.style.display = "none"; return; }
    const styles = {
      loading: "background:rgba(251,191,36,.08);border-color:rgba(251,191,36,.2);color:#fbbf24",
      error:   "background:rgba(239,68,68,.1);border-color:rgba(239,68,68,.25);color:#f87171",
    };
    el.style.cssText = "display:block;border:1px solid;border-radius:10px;" +
      "padding:14px;font-size:14px;margin-top:10px;white-space:pre-line;line-height:1.7;" +
      (styles[type] || "");
    el.textContent = msg;
    if (type === "loading") {
      const spin = document.createElement("span");
      spin.textContent = " ⏳";
      el.appendChild(spin);
    }
  }

  function updateRateBadge() {
    const el = document.getElementById("te-rate-badge");
    if (!el) return;
    Promise.all([hasChromeAI(), getKey()]).then(([chrome, key]) => {
      if (chrome || key) { el.textContent = "Unlimited ∞"; el.style.color = "#4ade80"; }
      else {
        const { left, reset } = rateInfo();
        el.textContent = left + "/" + RATE_LIMIT + " free · resets " + reset + "m";
        el.style.color = left < 3 ? "#f87171" : "var(--mu)";
      }
    });
  }

  /* ── Build UI ────────────────────────────────────────────────────────── */
  function buildUI() {
    const mount = document.getElementById("te-mount");
    if (!mount) return;

    mount.innerHTML =
      // Groq key section
      '<div class="te-card" style="margin-bottom:14px">' +
        '<div style="display:flex;align-items:center;justify-content:space-between;' +
             'margin-bottom:10px;flex-wrap:wrap;gap:6px">' +
          '<span style="font-size:11px;font-weight:700;color:var(--mu);' +
               'text-transform:uppercase;letter-spacing:.07em">' +
            '🔑 Groq Key ' +
            '<span style="font-weight:400;text-transform:none;letter-spacing:0;color:var(--su)">' +
              '(free · unlimited · recommended)' +
            '</span>' +
          '</span>' +
          '<span id="te-rate-badge" style="font-size:11px;color:var(--mu)"></span>' +
        '</div>' +
        '<div class="te-input-row">' +
          '<input type="password" id="te-api-key"' +
            ' placeholder="Paste Groq key here — stored only in your browser"' +
            ' style="flex:1;background:transparent;border:none;outline:none;' +
                   'color:var(--fg);font-size:14px;padding:10px 12px;font-family:inherit"/>' +
          '<button id="te-save-key" class="te-btn-sm">Save</button>' +
          '<a href="https://console.groq.com/keys" target="_blank" rel="noopener"' +
            ' class="te-btn-sm" style="text-decoration:none">Get Free Key ↗</a>' +
        '</div>' +
        '<p style="font-size:11px;color:var(--su);margin-top:6px">' +
          'Get a FREE key at console.groq.com/keys (30 sec, no card). ' +
          'Or try without key — free AI, up to 10 uses/hour.' +
        '</p>' +
      '</div>' +

      // Inputs
      '<div class="te-card" style="margin-bottom:14px">' +
        '<div id="te-inputs"></div>' +
        '<button id="te-generate" class="te-btn-primary"' +
          ' style="margin-top:16px;width:100%">⚡ Generate</button>' +
      '</div>' +

      // Status (loading / error)
      '<div id="te-status" style="display:none"></div>' +

      // Output
      '<div id="te-output-wrap" class="te-card" style="display:none;margin-top:14px">' +
        '<div style="display:flex;align-items:center;justify-content:space-between;' +
             'margin-bottom:12px;flex-wrap:wrap;gap:6px">' +
          '<div style="display:flex;align-items:center;gap:7px">' +
            '<span style="font-size:11px;font-weight:700;color:var(--mu);' +
                 'text-transform:uppercase;letter-spacing:.07em">Output</span>' +
            '<span id="te-ai-badge" style="display:none"></span>' +
          '</div>' +
          '<div style="display:flex;gap:6px">' +
            '<button id="te-copy"  class="te-btn-sm">📋 Copy</button>' +
            '<button id="te-regen" class="te-btn-sm">🔄 Redo</button>' +
          '</div>' +
        '</div>' +
        '<div id="te-output"' +
          ' style="white-space:pre-wrap;font-size:14px;line-height:1.8;' +
                 'color:var(--fg);min-height:40px"></div>' +
      '</div>';

    // Render inputs
    TOOL.inputs.forEach(inp =>
      document.getElementById("te-inputs")
        .insertAdjacentHTML("beforeend", renderInput(inp))
    );

    // Restore saved key
    getKey().then(k => { if (k) document.getElementById("te-api-key").value = k; });

    // Chrome AI banner
    hasChromeAI().then(ok => {
      if (ok) {
        const m = document.createElement("div");
        m.style.cssText = "display:flex;align-items:center;gap:8px;background:rgba(129,140,248,.08);" +
          "border:1px solid rgba(129,140,248,.2);border-radius:10px;padding:10px 14px;" +
          "margin-bottom:14px;font-size:13px;color:#a5b4fc";
        m.innerHTML = "🧠 <strong>On-device AI ready</strong> — Offline · Private · Unlimited";
        mount.insertBefore(m, mount.firstChild);
      }
      updateRateBadge();
    });

    // Wire buttons
    document.getElementById("te-save-key").onclick = async () => {
      const k = document.getElementById("te-api-key").value.trim();
      if (!k) { setStatus("error", "Please paste a Groq API key first."); return; }
      await saveKey(k);
      toast("Groq key saved ✓");
      setStatus("ok", "");
      updateRateBadge();
    };
    document.getElementById("te-generate").onclick = () => generate(false);
    document.getElementById("te-regen").onclick    = () => generate(true);
    document.getElementById("te-copy").onclick     = () => {
      const t = document.getElementById("te-output")?.textContent || "";
      navigator.clipboard.writeText(t).then(() => toast("Copied ✓")).catch(() => {});
    };
  }

  /* ── Render input ────────────────────────────────────────────────────── */
  function renderInput(inp) {
    const lbl = '<label class="te-label" for="te-inp-' + inp.id + '">' + inp.label + '</label>';
    if (inp.type === "select") {
      return '<div style="margin-bottom:12px">' + lbl +
        '<div class="te-input-row"><select id="te-inp-' + inp.id + '" class="te-select">' +
        inp.options.map(o => '<option value="'+o+'">'+o+'</option>').join("") +
        '</select></div></div>';
    }
    if (inp.type === "textarea") {
      return '<div style="margin-bottom:12px">' + lbl +
        '<textarea id="te-inp-' + inp.id + '" placeholder="' + (inp.placeholder||"") + '"' +
        ' rows="' + (inp.rows||3) + '"' +
        ' style="width:100%;background:var(--bg);border:1px solid var(--bor);' +
        'border-radius:8px;padding:10px 12px;color:var(--fg);font-size:14px;' +
        'outline:none;resize:vertical;font-family:inherit"' +
        ' onfocus="this.style.borderColor=\'var(--ac)\'"' +
        ' onblur="this.style.borderColor=\'var(--bor)\'"></textarea></div>';
    }
    return '<div style="margin-bottom:12px">' + lbl +
      '<div class="te-input-row"><input type="text" id="te-inp-' + inp.id + '"' +
      ' placeholder="' + (inp.placeholder||"") + '"' +
      ' style="flex:1;background:transparent;border:none;outline:none;' +
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

  /* ── Toast ───────────────────────────────────────────────────────────── */
  function toast(msg) {
    const t = document.createElement("div");
    t.textContent = msg;
    t.style.cssText = "position:fixed;bottom:24px;right:20px;background:#22c55e;color:#fff;" +
      "padding:10px 18px;border-radius:10px;font-size:13px;z-index:9999;" +
      "font-family:'Segoe UI',system-ui,sans-serif;box-shadow:0 4px 14px rgba(0,0,0,.3)";
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2500);
  }

  /* ── Styles ──────────────────────────────────────────────────────────── */
  const style = document.createElement("style");
  style.textContent =
    ".te-card{background:var(--sur);border:1px solid var(--bor);border-radius:12px;padding:20px}" +
    ".te-label{display:block;font-size:11px;color:var(--mu);margin-bottom:5px;" +
      "font-weight:700;text-transform:uppercase;letter-spacing:.07em}" +
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
      "padding:13px 24px;font-size:15px;font-weight:700;cursor:pointer;" +
      "font-family:inherit;transition:opacity .15s;width:100%}" +
    ".te-btn-primary:hover{opacity:.85}.te-btn-primary:disabled{opacity:.45;cursor:not-allowed}" +
    ".te-btn-sm{padding:5px 12px;font-size:12px;background:var(--bor);color:var(--mu);" +
      "border:none;border-radius:6px;cursor:pointer;font-family:inherit;transition:all .15s;white-space:nowrap}" +
    ".te-btn-sm:hover{background:var(--ac);color:var(--bg)}";
  document.head.appendChild(style);

  /* ── Boot ────────────────────────────────────────────────────────────── */
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", buildUI);
  else
    buildUI();

  setTimeout(() => hasChromeAI(), 1000);

})();
