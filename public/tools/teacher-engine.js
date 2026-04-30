/* ─── Forjit AI · Teacher Tool Engine v7.0 ──────────────────────────────────
 *  Mobile Chrome fix. Visible debug log. Correct proxy parsing.
 *  © 2025 Forjit AI · All rights reserved
 * ──────────────────────────────────────────────────────────────────────────*/
(function () {
  "use strict";

  var GROQ_URL    = "https://api.groq.com/openai/v1/chat/completions";
  var GROQ_MODELS = { fast:"llama-3.1-8b-instant", smart:"llama-3.3-70b-versatile" };
  var SYS = "You are an expert Indian teacher assistant. Write in plain text with clear headings. No markdown. Follow CBSE/ICSE curriculum.";
  var CACHE_TTL  = 7 * 24 * 60 * 60 * 1000;
  var DB_NAME    = "forjitai_db";
  var RATE_LIMIT = 10;
  var DEBUG      = true; // shows log on screen — helps diagnose mobile issues

  /* ── Load config ───────────────────────────────────────────────────────── */
  var cfgEl = document.getElementById("tool-config");
  if (!cfgEl) { return; }
  var TOOL;
  try { TOOL = JSON.parse(cfgEl.textContent); }
  catch(e) { return; }

  /* ── Debug log ─────────────────────────────────────────────────────────── */
  function log(msg) {
    if (!DEBUG) return;
    var el = document.getElementById("te-debug");
    if (!el) return;
    var line = document.createElement("div");
    line.textContent = new Date().toLocaleTimeString() + " — " + msg;
    el.appendChild(line);
    el.style.display = "block";
  }

  /* ── Timeout ───────────────────────────────────────────────────────────── */
  function withTimeout(p, ms) {
    return Promise.race([
      p,
      new Promise(function(_, reject) {
        setTimeout(function() { reject(new Error("Timed out after " + ms + "ms")); }, ms);
      })
    ]);
  }

  /* ── IndexedDB ─────────────────────────────────────────────────────────── */
  var _dbCache = null;
  function openDB() {
    if (_dbCache) return Promise.resolve(_dbCache);
    return new Promise(function(resolve, reject) {
      try {
        var req = indexedDB.open(DB_NAME, 1);
        req.onupgradeneeded = function() {
          var db = req.result;
          ["errorLog","history","feedback","users","uploads","teacherCache"]
            .forEach(function(s) {
              if (!db.objectStoreNames.contains(s))
                db.createObjectStore(s, { keyPath:"key" });
            });
        };
        req.onsuccess = function() { _dbCache = req.result; resolve(req.result); };
        req.onerror   = function() { reject(new Error("IDB error")); };
      } catch(e) { reject(e); }
    });
  }

  function dbGet(store, key) {
    return openDB().then(function(db) {
      return new Promise(function(resolve) {
        try {
          var tx = db.transaction(store, "readonly");
          var r  = tx.objectStore(store).get(key);
          r.onsuccess = function() { resolve(r.result ? r.result.value : null); };
          r.onerror   = function() { resolve(null); };
        } catch(e) { resolve(null); }
      });
    }).catch(function() { return null; });
  }

  function dbSet(store, key, value) {
    return openDB().then(function(db) {
      return new Promise(function(resolve) {
        try {
          var tx = db.transaction(store, "readwrite");
          tx.objectStore(store).put({ key:key, value:value });
          tx.oncomplete = function() { resolve(true); };
          tx.onerror    = function() { resolve(false); };
        } catch(e) { resolve(false); }
      });
    }).catch(function() { return false; });
  }

  /* ── Cache ─────────────────────────────────────────────────────────────── */
  function cKey(inputs) {
    try {
      var str = TOOL.id + JSON.stringify(inputs);
      var b64 = btoa(unescape(encodeURIComponent(str)));
      return "tc_" + b64.slice(0, 80);
    } catch(e) {
      return "tc_" + TOOL.id + "_" + Date.now();
    }
  }

  function cacheGet(inputs) {
    return dbGet("teacherCache", cKey(inputs)).then(function(e) {
      return (e && (Date.now() - e.ts < CACHE_TTL)) ? e.output : null;
    }).catch(function() { return null; });
  }

  function cacheSet(inputs, output) {
    var key = cKey(inputs);
    return dbSet("teacherCache", key, { output:output, ts:Date.now() }).then(function() {
      // Prune old entries — keep max 50
      return openDB().then(function(db) {
        return new Promise(function(res) {
          var store = db.transaction("teacherCache","readwrite").objectStore("teacherCache");
          var req   = store.getAll();
          req.onsuccess = function() {
            var all = req.result || [];
            if (all.length > 50) {
              all.sort(function(a,b) { return a.value.ts - b.value.ts; });
              all.slice(0, all.length - 50).forEach(function(e) { store.delete(e.key); });
            }
            res();
          };
          req.onerror = function() { res(); };
        });
      }).catch(function() {});
    }).catch(function() {});
  }

  /* ── Rate limit ─────────────────────────────────────────────────────────── */
  function getRD() {
    try {
      var d = JSON.parse(localStorage.getItem("te_rate") || "{}");
      if (!d.hour || Date.now() - d.hour > 3600000) return { count:0, hour:Date.now() };
      return d;
    } catch(e) { return { count:0, hour:Date.now() }; }
  }
  function canUse() { return getRD().count < RATE_LIMIT; }
  function useOne() {
    try { var d=getRD(); d.count++; localStorage.setItem("te_rate", JSON.stringify(d)); } catch(e) {}
  }

  /* ── API key ────────────────────────────────────────────────────────────── */
  function getKey()     { return dbGet("users", "teacher_groq_key"); }
  function saveKey(key) { return dbSet("users", "teacher_groq_key", key); }

  /* ── Prompt builder ─────────────────────────────────────────────────────── */
  function buildPrompt(inputs) {
    var p = TOOL.promptTemplate || "";
    Object.keys(inputs).forEach(function(k) {
      while (p.indexOf("{{" + k + "}}") !== -1) {
        p = p.replace("{{" + k + "}}", inputs[k]);
      }
    });
    return p;
  }

  /* ════════════════════════════════════════════════════════════════════════
     TIER 1 — Server Proxy
  ════════════════════════════════════════════════════════════════════════ */
  function callProxy(prompt) {
    log("Trying server proxy…");
    return withTimeout(
      fetch("/api/groq-proxy", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model:     GROQ_MODELS[TOOL.model || "fast"],
          maxTokens: TOOL.maxTokens || 600,
          messages:  [
            { role: "system", content: SYS },
            { role: "user",   content: prompt }
          ]
        })
      }),
      20000
    ).then(function(res) {
      log("Proxy response: HTTP " + res.status);
      if (!res.ok) {
        // 503 = not configured, 404 = not deployed — try next tier
        return null;
      }
      return res.text().then(function(text) {
        log("Proxy raw: " + text.slice(0, 80));
        try {
          var data = JSON.parse(text);
          if (data && data.content && data.content.length > 10) {
            log("Proxy success ✓");
            return data.content;
          }
          return null;
        } catch(e) {
          log("Proxy JSON parse failed: " + e.message);
          return null;
        }
      });
    }).catch(function(e) {
      log("Proxy failed: " + e.message);
      return null;
    });
  }

  /* ════════════════════════════════════════════════════════════════════════
     TIER 2 — Direct Groq (user key)
  ════════════════════════════════════════════════════════════════════════ */
  function callGroq(prompt, key) {
    log("Trying Groq with user key…");
    return withTimeout(
      fetch(GROQ_URL, {
        method:  "POST",
        headers: {
          "Content-Type":  "application/json",
          "Authorization": "Bearer " + key
        },
        body: JSON.stringify({
          model:       GROQ_MODELS[TOOL.model || "fast"],
          max_tokens:  TOOL.maxTokens || 600,
          temperature: 0.7,
          stream:      false,
          messages:    [
            { role: "system", content: SYS },
            { role: "user",   content: prompt }
          ]
        })
      }),
      20000
    ).then(function(res) {
      log("Groq response: HTTP " + res.status);
      if (res.status === 401) throw new Error("Invalid Groq key. Please re-check.");
      if (res.status === 429) throw new Error("Groq rate limit. Wait 1 minute.");
      if (!res.ok) throw new Error("Groq error: " + res.status);
      return res.text().then(function(text) {
        try {
          var data = JSON.parse(text);
          var content = data && data.choices && data.choices[0]
            && data.choices[0].message && data.choices[0].message.content;
          if (content) { log("Groq success ✓"); return content; }
          return null;
        } catch(e) {
          log("Groq parse error: " + e.message);
          return null;
        }
      });
    }).catch(function(e) {
      log("Groq failed: " + e.message);
      throw e;
    });
  }

  /* ════════════════════════════════════════════════════════════════════════
     TIER 3 — Pollinations
  ════════════════════════════════════════════════════════════════════════ */
  function callPollinations(prompt) {
    log("Trying Pollinations…");
    return withTimeout(
      fetch("https://text.pollinations.ai/", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            { role: "system", content: SYS },
            { role: "user",   content: prompt }
          ],
          model:   "openai",
          private: true
        })
      }),
      20000
    ).then(function(res) {
      log("Pollinations POST: HTTP " + res.status);
      if (!res.ok) throw new Error("HTTP " + res.status);
      return res.text();
    }).then(function(t) {
      t = (t || "").trim();
      if (t.length > 20) { log("Pollinations success ✓"); return t; }
      throw new Error("Empty response");
    }).catch(function(e1) {
      log("Pollinations POST failed: " + e1.message + " — trying GET");
      return withTimeout(
        fetch(
          "https://text.pollinations.ai/" +
          encodeURIComponent(prompt.slice(0, 400)) +
          "?model=openai&private=true"
        ),
        20000
      ).then(function(res) {
        log("Pollinations GET: HTTP " + res.status);
        if (!res.ok) return null;
        return res.text().then(function(t) {
          t = (t || "").trim();
          if (t.length > 20) { log("Pollinations GET success ✓"); return t; }
          return null;
        });
      }).catch(function(e2) {
        log("Pollinations GET failed: " + e2.message);
        return null;
      });
    });
  }

  /* ════════════════════════════════════════════════════════════════════════
     GENERATE
  ════════════════════════════════════════════════════════════════════════ */
  var _isGenerating = false;

  function generate(forceRegen) {
    if (_isGenerating) return;          // prevent double-tap / double-call
    _isGenerating = true;

    var btn    = document.getElementById("te-generate");
    var inputs = getInputValues();

    // Validate inputs
    for (var i = 0; i < TOOL.inputs.length; i++) {
      var inp = TOOL.inputs[i];
      if (inp.required !== false && !inputs[inp.id]) {
        showMsg("error", "Please fill in: " + inp.label);
        _isGenerating = false;
        return;
      }
    }

    // Immediately show loading
    if (btn) { btn.disabled = true; btn.textContent = "⏳ Generating…"; }
    clearOutput();
    showMsg("loading", "Starting…");

    // Clear debug log for new request
    var dbg = document.getElementById("te-debug");
    if (dbg) { dbg.innerHTML = ""; }
    log("Generate clicked for tool: " + TOOL.id);

    var prompt = buildPrompt(inputs);

    // Check cache first
    cacheGet(inputs).then(function(cached) {
      if (!forceRegen && cached) {
        log("Cache hit ✓");
        showOutput(cached, "cache");
        showMsg("", "");
        if (btn) { btn.disabled = false; btn.textContent = "⚡ Generate"; }
        _isGenerating = false;
        return;
      }
      runTiers(prompt, inputs, btn);
    }).catch(function() {
      runTiers(prompt, inputs, btn);
    });
  }

  function runTiers(prompt, inputs, btn) {
    var result = null;
    var tier   = "";

    // Tier 1: Proxy
    callProxy(prompt).then(function(r) {
      if (r) { result = r; tier = "server"; }

    // Tier 2: User Groq key
    }).then(function() {
      if (result) return;
      var keyEl    = document.getElementById("te-api-key");
      var typedKey = keyEl ? keyEl.value.trim() : "";
      return (typedKey
        ? Promise.resolve(typedKey)
        : getKey()
      ).then(function(key) {
        if (!key) { log("No user Groq key saved"); return; }
        return callGroq(prompt, key).then(function(r) {
          if (r) { result = r; tier = "groq"; }
        }).catch(function(e) {
          showMsg("error", e.message);
          if (btn) { btn.disabled = false; btn.textContent = "⚡ Generate"; }
          _isGenerating = false;
          throw new Error("__stop__");
        });
      });

    // Tier 3: Pollinations
    }).then(function() {
      if (result) return;
      if (!canUse()) {
        showMsg("error", "Free limit reached (" + RATE_LIMIT + "/hr). Try again in 1 hour.");
        clearOutput();
        if (btn) { btn.disabled = false; btn.textContent = "⚡ Generate"; }
        _isGenerating = false;
        throw new Error("__stop__");
      }
      showMsg("loading", "Using free AI (may take 15–20 seconds on mobile)…");
      return callPollinations(prompt).then(function(r) {
        if (r) { useOne(); result = r; tier = "free"; }
      });

    // Final
    }).then(function() {
      if (!result) {
        clearOutput();
        showMsg("error",
          "All AI methods failed on your device.\n\n" +
          "Most likely fix: The site owner needs to set GROQ_API_KEY in Vercel.\n\n" +
          "Check the debug log below for details."
        );
        if (btn) { btn.disabled = false; btn.textContent = "⚡ Generate"; }
        _isGenerating = false;
        return;
      }
      showOutput(result, tier);
      showMsg("", "");
      cacheSet(inputs, result);
      if (btn) { btn.disabled = false; btn.textContent = "⚡ Generate"; }
      _isGenerating = false;

    }).catch(function(e) {
      if (e.message === "__stop__") return;
      log("Unexpected error: " + e.message);
      clearOutput();
      showMsg("error", "Error: " + e.message);
      if (btn) { btn.disabled = false; btn.textContent = "⚡ Generate"; }
      _isGenerating = false;
    });
  }

  /* ════════════════════════════════════════════════════════════════════════
     UI HELPERS
  ════════════════════════════════════════════════════════════════════════ */
  function showMsg(type, text) {
    var el = document.getElementById("te-msg");
    if (!el) return;
    if (!type || !text) { el.style.display = "none"; return; }
    var bg = type === "loading"
      ? "background:#1c1917;border:1px solid rgba(251,191,36,.3);color:#fbbf24"
      : "background:rgba(239,68,68,.08);border:1px solid rgba(239,68,68,.3);color:#f87171";
    el.style.cssText = "display:block;border-radius:10px;padding:14px 16px;" +
      "font-size:14px;margin-top:12px;white-space:pre-line;line-height:1.75;" + bg;
    el.textContent = (type === "loading" ? "⏳ " : "⚠️ ") + text;
    // Scroll into view on mobile
    setTimeout(function() {
      el.scrollIntoView({ behavior:"smooth", block:"nearest" });
    }, 100);
  }

  function showOutput(text, tier) {
    var wrap = document.getElementById("te-output-wrap");
    var out  = document.getElementById("te-output");
    var bdg  = document.getElementById("te-ai-badge");
    if (!wrap) return;
    wrap.style.display = "block";
    if (out) out.textContent = text;
    if (bdg && tier) {
      var labels = { server:"⚡ Forjit AI", groq:"⚡ Groq", free:"🌐 Free AI", cache:"💾 Cached" };
      bdg.style.cssText = "display:inline-block;font-size:11px;padding:2px 9px;" +
        "border-radius:999px;font-weight:700;background:rgba(251,191,36,.15);" +
        "color:#fbbf24;border:1px solid rgba(251,191,36,.3)";
      bdg.textContent = labels[tier] || tier;
    }
    // Scroll output into view on mobile
    setTimeout(function() {
      wrap.scrollIntoView({ behavior:"smooth", block:"start" });
    }, 100);
  }

  function clearOutput() {
    var wrap = document.getElementById("te-output-wrap");
    if (wrap) wrap.style.display = "none";
  }

  /* ════════════════════════════════════════════════════════════════════════
     BUILD UI
  ════════════════════════════════════════════════════════════════════════ */
  function buildUI() {
    var mount = document.getElementById("te-mount");
    if (!mount) return;

    // Tool inputs
    var html =
      '<div style="background:#1c1917;border:1px solid #292524;border-radius:12px;' +
           'padding:20px;margin-bottom:14px">' +
        '<div id="te-inputs"></div>' +
        '<button id="te-generate" ' +
          'style="margin-top:16px;width:100%;background:#fbbf24;color:#0c0a09;' +
                 'border:none;border-radius:10px;padding:14px;font-size:16px;' +
                 'font-weight:800;cursor:pointer;font-family:inherit;' +
                 '-webkit-appearance:none;appearance:none;touch-action:manipulation">' +
          '⚡ Generate Free' +
        '</button>' +
      '</div>' +

      // Status
      '<div id="te-msg" style="display:none"></div>' +

      // Output
      '<div id="te-output-wrap" style="display:none;background:#1c1917;' +
           'border:1px solid #292524;border-radius:12px;padding:20px;margin-top:14px">' +
        '<div style="display:flex;align-items:center;justify-content:space-between;' +
                    'margin-bottom:12px;flex-wrap:wrap;gap:8px">' +
          '<div style="display:flex;align-items:center;gap:8px">' +
            '<span style="font-size:11px;font-weight:700;color:#78716c;' +
                  'text-transform:uppercase;letter-spacing:.07em">Result</span>' +
            '<span id="te-ai-badge" style="display:none"></span>' +
          '</div>' +
          '<div style="display:flex;gap:6px;flex-wrap:wrap">' +
            '<button id="te-copy" style="padding:7px 12px;font-size:12px;' +
              'background:#292524;color:#a8a29e;border:none;border-radius:7px;' +
              'cursor:pointer;font-family:inherit;touch-action:manipulation">' +
              '📋 Copy' +
            '</button>' +
            '<button id="te-regen" style="padding:7px 12px;font-size:12px;' +
              'background:#292524;color:#a8a29e;border:none;border-radius:7px;' +
              'cursor:pointer;font-family:inherit;touch-action:manipulation">' +
              '🔄 Redo' +
            '</button>' +
            '<button id="te-word" style="padding:7px 12px;font-size:12px;' +
              'background:#1d4ed8;color:#fff;border:none;border-radius:7px;' +
              'cursor:pointer;font-family:inherit;touch-action:manipulation">' +
              '📄 Word' +
            '</button>' +
            '<button id="te-pdf" style="padding:7px 12px;font-size:12px;' +
              'background:#dc2626;color:#fff;border:none;border-radius:7px;' +
              'cursor:pointer;font-family:inherit;touch-action:manipulation">' +
              '🖨️ PDF' +
            '</button>' +
          '</div>' +
        '</div>' +
        '<div id="te-output" style="white-space:pre-wrap;font-size:15px;' +
             'line-height:1.85;color:#e7e5e4;min-height:40px;' +
             'word-break:break-word;overflow-wrap:break-word"></div>' +

        // Share Bar
        '<div id="te-share-bar" style="margin-top:18px;padding-top:14px;border-top:1px solid #292524">' +
          '<div style="font-size:11px;font-weight:700;color:#78716c;text-transform:uppercase;' +
               'letter-spacing:.07em;margin-bottom:10px">📤 Share this result</div>' +
          '<div style="display:flex;gap:8px;flex-wrap:wrap">' +
            '<button id="te-share-wa" title="Share on WhatsApp" style="padding:8px 14px;font-size:13px;font-weight:600;' +
              'background:#25D366;color:#fff;border:none;border-radius:8px;cursor:pointer;font-family:inherit;touch-action:manipulation">' +
              '💬 WhatsApp' +
            '</button>' +
            '<button id="te-share-tg" title="Share on Telegram" style="padding:8px 14px;font-size:13px;font-weight:600;' +
              'background:#229ED9;color:#fff;border:none;border-radius:8px;cursor:pointer;font-family:inherit;touch-action:manipulation">' +
              '✈️ Telegram' +
            '</button>' +
            '<button id="te-share-fb" title="Share on Facebook" style="padding:8px 14px;font-size:13px;font-weight:600;' +
              'background:#1877F2;color:#fff;border:none;border-radius:8px;cursor:pointer;font-family:inherit;touch-action:manipulation">' +
              'f Facebook' +
            '</button>' +
            '<button id="te-share-tw" title="Share on X / Twitter" style="padding:8px 14px;font-size:13px;font-weight:600;' +
              'background:#000;color:#fff;border:none;border-radius:8px;cursor:pointer;font-family:inherit;touch-action:manipulation">' +
              '𝕏 Twitter' +
            '</button>' +
            '<button id="te-share-li" title="Share on LinkedIn" style="padding:8px 14px;font-size:13px;font-weight:600;' +
              'background:#0A66C2;color:#fff;border:none;border-radius:8px;cursor:pointer;font-family:inherit;touch-action:manipulation">' +
              'in LinkedIn' +
            '</button>' +
            '<button id="te-share-em" title="Share via Email" style="padding:8px 14px;font-size:13px;font-weight:600;' +
              'background:#292524;color:#a8a29e;border:1px solid #3f3a38;border-radius:8px;cursor:pointer;font-family:inherit;touch-action:manipulation">' +
              '✉️ Email' +
            '</button>' +
            '<button id="te-share-native" title="More share options" style="display:none;padding:8px 14px;font-size:13px;font-weight:600;' +
              'background:#fbbf24;color:#0c0a09;border:none;border-radius:8px;cursor:pointer;font-family:inherit;touch-action:manipulation">' +
              '↑ Share' +
            '</button>' +
          '</div>' +
          '<div id="te-share-msg" style="font-size:12px;color:#22c55e;margin-top:8px;display:none">✓ Link copied to clipboard!</div>' +
        '</div>' +

      '</div>' +

      // Own key (optional)
      '<details style="margin-top:16px">' +
        '<summary style="font-size:13px;color:#78716c;cursor:pointer;' +
                        'padding:4px 0;touch-action:manipulation">' +
          '🔑 Add your own Groq key (optional)' +
        '</summary>' +
        '<div style="background:#1c1917;border:1px solid #292524;border-radius:10px;' +
                    'padding:14px;margin-top:8px">' +
          '<input type="password" id="te-api-key" placeholder="gsk_..." ' +
            'style="width:100%;box-sizing:border-box;background:#0c0a09;' +
                   'border:1px solid #292524;border-radius:8px;padding:12px;' +
                   'color:#e7e5e4;font-size:15px;outline:none;font-family:inherit;' +
                   'margin-bottom:8px"/>' +
          '<button id="te-save-key" ' +
            'style="width:100%;padding:10px;background:#292524;color:#e7e5e4;' +
                   'border:none;border-radius:8px;cursor:pointer;font-size:14px;' +
                   'font-family:inherit;touch-action:manipulation">' +
            'Save Key' +
          '</button>' +
          '<a href="https://console.groq.com/keys" target="_blank" ' +
            'style="display:block;font-size:12px;color:#78716c;margin-top:10px;' +
                   'text-decoration:none;text-align:center">' +
            '→ Get free key at console.groq.com/keys' +
          '</a>' +
        '</div>' +
      '</details>' +

      // Debug log (visible on screen)
      '<div style="margin-top:16px">' +
        '<div style="font-size:11px;color:#78716c;margin-bottom:4px">Debug log:</div>' +
        '<div id="te-debug" style="display:none;background:#0c0a09;border:1px solid #292524;' +
             'border-radius:8px;padding:10px;font-size:11px;color:#78716c;' +
             'font-family:monospace;line-height:1.6;max-height:150px;overflow-y:auto">' +
        '</div>' +
      '</div>';

    mount.innerHTML = html;

    // Render inputs
    TOOL.inputs.forEach(function(inp) {
      var el = document.getElementById("te-inputs");
      if (el) el.insertAdjacentHTML("beforeend", renderInput(inp));
    });

    // Restore saved key
    getKey().then(function(k) {
      if (k) {
        var el = document.getElementById("te-api-key");
        if (el) el.value = k;
      }
    }).catch(function() {});

    // Wire buttons
    var genBtn  = document.getElementById("te-generate");
    var saveBtn = document.getElementById("te-save-key");
    var copyBtn = document.getElementById("te-copy");
    var redoBtn = document.getElementById("te-regen");

    if (genBtn) {
      genBtn.addEventListener("click", function() { generate(false); });
    }
    if (redoBtn) redoBtn.addEventListener("click", function() { generate(true); });
    if (copyBtn) copyBtn.addEventListener("click", function() {
      var out = document.getElementById("te-output");
      if (!out || !out.textContent) return;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(out.textContent).then(function() {
          copyBtn.textContent = "✓ Copied!";
          setTimeout(function() { copyBtn.textContent = "📋 Copy"; }, 2000);
        }).catch(function() {});
      }
    });
    if (saveBtn) saveBtn.addEventListener("click", function() {
      var el = document.getElementById("te-api-key");
      var k  = el ? el.value.trim() : "";
      if (!k) return;
      saveKey(k).then(function() {
        saveBtn.textContent = "✓ Saved!";
        setTimeout(function() { saveBtn.textContent = "Save Key"; }, 2000);
      });
    });

    /* ── Export: Word ──────────────────────────────────────────────────── */
    var wordBtn = document.getElementById("te-word");
    if (wordBtn) wordBtn.addEventListener("click", function() {
      var out = document.getElementById("te-output");
      if (!out || !out.textContent.trim()) return;
      var text = out.textContent;
      var toolName = TOOL.name || "Forjit AI Result";
      var date = new Date().toLocaleDateString("en-IN");
      // Build Word-compatible HTML
      var wordHtml =
        '<html xmlns:o="urn:schemas-microsoft-com:office:office" ' +
        'xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">' +
        '<head><meta charset="utf-8"/>' +
        '<style>' +
        'body{font-family:Calibri,Arial,sans-serif;font-size:12pt;line-height:1.8;color:#000;margin:2cm;}' +
        'h1{font-size:16pt;font-weight:bold;margin-bottom:6pt;}' +
        '.meta{color:#666;font-size:10pt;margin-bottom:18pt;}' +
        'pre{white-space:pre-wrap;font-family:Calibri,Arial,sans-serif;font-size:12pt;line-height:1.8;}' +
        '</style></head><body>' +
        '<h1>' + toolName + '</h1>' +
        '<div class="meta">Generated by Forjit AI · forjitai.in · ' + date + '</div>' +
        '<pre>' + text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') + '</pre>' +
        '<div style="margin-top:24pt;font-size:9pt;color:#888">© 2025 Forjit AI · forjitai.in · Free AI tools for India</div>' +
        '</body></html>';
      var blob = new Blob(['\ufeff' + wordHtml], { type: 'application/msword' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url;
      a.download = (toolName.toLowerCase().replace(/[^a-z0-9]+/g,"-") + "-forjitai.doc");
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      wordBtn.textContent = "✓ Downloading…";
      setTimeout(function() { wordBtn.textContent = "📄 Word"; }, 2500);
    });

    /* ── Export: PDF (print) ───────────────────────────────────────────── */
    var pdfBtn = document.getElementById("te-pdf");
    if (pdfBtn) pdfBtn.addEventListener("click", function() {
      var out = document.getElementById("te-output");
      if (!out || !out.textContent.trim()) return;
      var text = out.textContent;
      var toolName = TOOL.name || "Forjit AI Result";
      var date = new Date().toLocaleDateString("en-IN");
      var printWin = window.open("", "_blank");
      printWin.document.write(
        '<!doctype html><html><head><meta charset="utf-8"/>' +
        '<title>' + toolName + ' — Forjit AI</title>' +
        '<style>' +
        '@page{margin:2cm}' +
        'body{font-family:Calibri,Arial,sans-serif;font-size:12pt;line-height:1.8;color:#000;max-width:170mm;margin:0 auto}' +
        'h1{font-size:16pt;margin-bottom:4pt}' +
        '.meta{color:#666;font-size:9pt;margin-bottom:20pt;border-bottom:1px solid #ccc;padding-bottom:8pt}' +
        'pre{white-space:pre-wrap;font-family:Calibri,Arial,sans-serif;font-size:11.5pt;line-height:1.8}' +
        'footer{margin-top:24pt;font-size:8pt;color:#888;border-top:1px solid #ddd;padding-top:6pt}' +
        '</style></head><body>' +
        '<h1>' + toolName + '</h1>' +
        '<div class="meta">Generated by Forjit AI &nbsp;·&nbsp; forjitai.in &nbsp;·&nbsp; ' + date + '</div>' +
        '<pre>' + text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') + '</pre>' +
        '<footer>© 2025 Forjit AI · forjitai.in — Free AI tools for India · This document was generated using Forjit AI</footer>' +
        '</body></html>'
      );
      printWin.document.close();
      printWin.focus();
      setTimeout(function() {
        printWin.print();
      }, 400);
    });

    /* ── Share helpers ─────────────────────────────────────────────────── */
    function getShareText() {
      var out = document.getElementById("te-output");
      var text = out ? out.textContent.trim() : "";
      var preview = text.length > 280 ? text.substring(0, 280) + "…" : text;
      return preview;
    }
    function getShareUrl() { return window.location.href; }
    function getShareTitle() { return (TOOL.name || "Forjit AI") + " — Free AI Tool"; }

    function wireShare(id, fn) {
      var btn = document.getElementById(id);
      if (btn) btn.addEventListener("click", fn);
    }

    wireShare("te-share-wa", function() {
      var msg = "✝️ " + getShareTitle() + "\n\n" + getShareText() + "\n\n🔗 " + getShareUrl() + "\n\n📱 Free at forjitai.in";
      window.open("https://api.whatsapp.com/send?text=" + encodeURIComponent(msg), "_blank");
    });

    wireShare("te-share-tg", function() {
      var msg = getShareTitle() + "\n\n" + getShareText().substring(0,200);
      window.open("https://t.me/share/url?url=" + encodeURIComponent(getShareUrl()) + "&text=" + encodeURIComponent(msg), "_blank");
    });

    wireShare("te-share-fb", function() {
      window.open("https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(getShareUrl()), "_blank");
    });

    wireShare("te-share-tw", function() {
      var msg = getShareTitle() + " — Free at @forjitai\n" + getShareUrl();
      window.open("https://twitter.com/intent/tweet?text=" + encodeURIComponent(msg), "_blank");
    });

    wireShare("te-share-li", function() {
      window.open("https://www.linkedin.com/sharing/share-offsite/?url=" + encodeURIComponent(getShareUrl()), "_blank");
    });

    wireShare("te-share-em", function() {
      var subject = getShareTitle();
      var body = getShareText() + "\n\n--- Generated by Forjit AI ---\n" + getShareUrl();
      window.location.href = "mailto:?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    });

    // Native share (mobile)
    var nativeBtn = document.getElementById("te-share-native");
    if (navigator.share && nativeBtn) {
      nativeBtn.style.display = "inline-block";
      nativeBtn.addEventListener("click", function() {
        navigator.share({
          title: getShareTitle(),
          text:  getShareText().substring(0, 300),
          url:   getShareUrl(),
        }).catch(function() {});
      });
    }
  }


  /* ── Render input ─────────────────────────────────────────────────────── */
  function renderInput(inp) {
    var inputStyle =
      'style="width:100%;box-sizing:border-box;background:#0c0a09;' +
      'border:1px solid #292524;border-radius:8px;padding:12px;' +
      'color:#e7e5e4;font-size:15px;outline:none;font-family:inherit;' +
      'margin-top:6px;-webkit-appearance:none;appearance:none"';

    var lbl =
      '<label style="font-size:11px;font-weight:700;color:#78716c;' +
      'text-transform:uppercase;letter-spacing:.07em;display:block">' +
      inp.label + '</label>';

    var wrap = '<div style="margin-bottom:14px">';

    if (inp.type === "select") {
      var opts = inp.options.map(function(o) {
        return '<option value="' + o + '">' + o + '</option>';
      }).join("");
      return wrap + lbl +
        '<select id="te-inp-' + inp.id + '" ' + inputStyle + '>' + opts + '</select></div>';
    }
    if (inp.type === "textarea") {
      return wrap + lbl +
        '<textarea id="te-inp-' + inp.id + '" ' +
        'placeholder="' + (inp.placeholder || "") + '" ' +
        'rows="' + (inp.rows || 3) + '" ' +
        inputStyle + '></textarea></div>';
    }
    return wrap + lbl +
      '<input type="text" id="te-inp-' + inp.id + '" ' +
      'placeholder="' + (inp.placeholder || "") + '" ' +
      inputStyle + '/></div>';
  }

  function getInputValues() {
    var v = {};
    TOOL.inputs.forEach(function(inp) {
      var el = document.getElementById("te-inp-" + inp.id);
      v[inp.id] = el ? el.value.trim() : "";
    });
    return v;
  }

  /* ── Boot ──────────────────────────────────────────────────────────────── */
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", buildUI);
  } else {
    buildUI();
  }

})();
