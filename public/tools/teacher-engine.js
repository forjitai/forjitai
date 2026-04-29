/* ─── Forjit AI · Teacher Tool Engine v6.0 ──────────────────────────────────
 *
 *  Truly free for every user — no key needed:
 *
 *  1. /api/groq-proxy  → server-side Groq (your key, hidden in Vercel env)
 *  2. User's own key   → direct Groq (if they saved one)
 *  3. Pollinations     → last resort free fallback
 *
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

  // Load tool config
  var cfgEl = document.getElementById("tool-config");
  if (!cfgEl) return;
  var TOOL;
  try { TOOL = JSON.parse(cfgEl.textContent); } catch(e) { return; }

  /* ── Timeout ───────────────────────────────────────────────────────────── */
  function withTimeout(p, ms) {
    return Promise.race([p,
      new Promise(function(_, r) {
        setTimeout(function() { r(new Error("timeout")); }, ms);
      })
    ]);
  }

  /* ── IndexedDB ─────────────────────────────────────────────────────────── */
  function openDB() {
    return new Promise(function(res, rej) {
      var r = indexedDB.open(DB_NAME, 1);
      r.onupgradeneeded = function() {
        ["errorLog","history","feedback","users","uploads","teacherCache"]
          .forEach(function(s) {
            if (!r.result.objectStoreNames.contains(s))
              r.result.createObjectStore(s, { keyPath:"key" });
          });
      };
      r.onsuccess = function() { res(r.result); };
      r.onerror   = function() { rej(r.error); };
    });
  }

  function dbGet(store, key) {
    return openDB().then(function(db) {
      return new Promise(function(res) {
        var r = db.transaction(store,"readonly").objectStore(store).get(key);
        r.onsuccess = function() { res(r.result ? r.result.value : null); };
        r.onerror   = function() { res(null); };
      });
    }).catch(function() { return null; });
  }

  function dbSet(store, key, value) {
    return openDB().then(function(db) {
      return new Promise(function(res) {
        var tx = db.transaction(store,"readwrite");
        tx.objectStore(store).put({ key:key, value:value });
        tx.oncomplete = function() { res(true); };
        tx.onerror    = function() { res(false); };
      });
    }).catch(function() { return false; });
  }

  /* ── Cache ─────────────────────────────────────────────────────────────── */
  function cKey(inputs) {
    try {
      return "tc_" + btoa(unescape(encodeURIComponent(TOOL.id + JSON.stringify(inputs)))).slice(0,80);
    } catch(e) { return "tc_" + TOOL.id + "_" + Object.values(inputs).join("_").slice(0,40); }
  }

  function cacheGet(inputs) {
    return dbGet("teacherCache", cKey(inputs)).then(function(e) {
      return (e && (Date.now() - e.ts < CACHE_TTL)) ? e.output : null;
    }).catch(function() { return null; });
  }

  function cacheSet(inputs, output) {
    return dbSet("teacherCache", cKey(inputs), { output:output, ts:Date.now() });
  }

  /* ── Rate limit ─────────────────────────────────────────────────────────── */
  function getRD() {
    try {
      var d = JSON.parse(localStorage.getItem("te_rate")||"{}");
      return (!d.hour || Date.now()-d.hour > 3600000) ? { count:0, hour:Date.now() } : d;
    } catch(e) { return { count:0, hour:Date.now() }; }
  }
  function canUse()  { return getRD().count < RATE_LIMIT; }
  function useOne()  { var d=getRD(); d.count++; localStorage.setItem("te_rate",JSON.stringify(d)); }

  /* ── API key ────────────────────────────────────────────────────────────── */
  function getKey()     { return dbGet("users","teacher_groq_key"); }
  function saveKey(key) { return dbSet("users","teacher_groq_key",key); }

  /* ── Prompt builder ─────────────────────────────────────────────────────── */
  function buildPrompt(inputs) {
    var p = TOOL.promptTemplate || "";
    Object.keys(inputs).forEach(function(k) {
      p = p.split("{{"+k+"}}").join(inputs[k]);
    });
    return p;
  }

  /* ════════════════════════════════════════════════════════════════════════
     TIER 1 — Server Proxy (your Groq key hidden in Vercel env)
     Users need ZERO setup. You set the key once in Vercel dashboard.
  ════════════════════════════════════════════════════════════════════════ */
  function callProxy(prompt) {
    return withTimeout(
      fetch("/api/groq-proxy", {
        method: "POST",
        headers: { "Content-Type":"application/json" },
        body: JSON.stringify({
          model:     GROQ_MODELS[TOOL.model||"fast"],
          maxTokens: TOOL.maxTokens || 600,
          messages:  [
            { role:"system", content:SYS },
            { role:"user",   content:prompt }
          ]
        })
      }),
      20000
    ).then(function(res) {
      return res.json().then(function(data) {
        if (!res.ok) return null;             // proxy not configured → try next tier
        if (!data.content) return null;
        return data.content;
      });
    }).catch(function() { return null; });    // any error → try next tier
  }

  /* ════════════════════════════════════════════════════════════════════════
     TIER 2 — Direct Groq (user's own key)
  ════════════════════════════════════════════════════════════════════════ */
  function callGroq(prompt, key) {
    return withTimeout(
      fetch(GROQ_URL, {
        method:"POST",
        headers:{ "Content-Type":"application/json", "Authorization":"Bearer "+key },
        body:JSON.stringify({
          model: GROQ_MODELS[TOOL.model||"fast"],
          max_tokens: TOOL.maxTokens||600,
          temperature:0.7, stream:false,
          messages:[{ role:"system", content:SYS }, { role:"user", content:prompt }]
        })
      }),
      20000
    ).then(function(res) {
      if (!res.ok) {
        return res.text().then(function(e) {
          if (res.status===401) throw new Error("Invalid Groq key. Check and re-save.");
          if (res.status===429) throw new Error("Groq rate limit. Wait 1 minute.");
          throw new Error("Groq error " + res.status);
        });
      }
      return res.json().then(function(data) {
        return data && data.choices && data.choices[0] && data.choices[0].message
          ? data.choices[0].message.content : null;
      });
    });
  }

  /* ════════════════════════════════════════════════════════════════════════
     TIER 3 — Pollinations (free public API, last resort)
  ════════════════════════════════════════════════════════════════════════ */
  function callPollinations(prompt) {
    return withTimeout(
      fetch("https://text.pollinations.ai/", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          messages:[{role:"system",content:SYS},{role:"user",content:prompt}],
          model:"openai", private:true
        })
      }),
      20000
    ).then(function(res) {
      if (!res.ok) throw new Error("not-ok");
      return res.text();
    }).then(function(t) {
      t = (t||"").trim();
      return t.length > 20 ? t : null;
    }).catch(function() {
      // GET fallback
      return withTimeout(
        fetch("https://text.pollinations.ai/"+encodeURIComponent(prompt.slice(0,500))+"?model=openai&private=true"),
        20000
      ).then(function(res) {
        if (!res.ok) return null;
        return res.text().then(function(t) {
          t = (t||"").trim();
          return t.length > 20 ? t : null;
        });
      }).catch(function() { return null; });
    });
  }

  /* ════════════════════════════════════════════════════════════════════════
     GENERATE
  ════════════════════════════════════════════════════════════════════════ */
  function generate(forceRegen) {
    var btn    = document.getElementById("te-generate");
    var inputs = getInputValues();

    // Validate
    for (var i=0; i<TOOL.inputs.length; i++) {
      var inp = TOOL.inputs[i];
      if (inp.required !== false && !inputs[inp.id]) {
        showMsg("error","Please fill in: " + inp.label);
        return;
      }
    }

    // Show loading immediately
    if (btn) { btn.disabled=true; btn.textContent="⏳ Generating…"; }
    clearOutput();
    showMsg("loading","Generating your content…");

    var prompt = buildPrompt(inputs);

    // Cache check first
    cacheGet(inputs).then(function(cached) {
      if (!forceRegen && cached) {
        showOutput(cached, "cache");
        showMsg("","");
        if (btn) { btn.disabled=false; btn.textContent="⚡ Generate"; }
        return;
      }
      return runGenerate(prompt, inputs, btn);
    }).catch(function() {
      return runGenerate(prompt, inputs, btn);
    });
  }

  function runGenerate(prompt, inputs, btn) {
    var result = null;
    var tier   = "";

    // Tier 1: Server proxy
    showMsg("loading","Generating…");
    return callProxy(prompt).then(function(r) {
      if (r) { result=r; tier="server"; }

    // Tier 2: User's own Groq key
    }).then(function() {
      if (result) return;
      var keyEl = document.getElementById("te-api-key");
      var typedKey = keyEl ? keyEl.value.trim() : "";
      return (typedKey ? Promise.resolve(typedKey) : getKey()).then(function(key) {
        if (!key) return;
        showMsg("loading","Generating with your Groq key…");
        return callGroq(prompt, key).then(function(r) {
          if (r) { result=r; tier="groq"; }
        }).catch(function(e) {
          showMsg("error", e.message);
          if (btn) { btn.disabled=false; btn.textContent="⚡ Generate"; }
          throw new Error("stop");
        });
      });

    // Tier 3: Pollinations
    }).then(function() {
      if (result) return;
      if (!canUse()) {
        showMsg("error","Free usage limit reached ("+RATE_LIMIT+"/hr). Please try again in 1 hour.");
        clearOutput();
        if (btn) { btn.disabled=false; btn.textContent="⚡ Generate"; }
        throw new Error("stop");
      }
      showMsg("loading","Trying free AI (may take 15–20 seconds)…");
      return callPollinations(prompt).then(function(r) {
        if (r) { useOne(); result=r; tier="free"; }
      });

    // Done
    }).then(function() {
      if (!result) {
        clearOutput();
        showMsg("error",
          "Free AI is currently unavailable.\n\n" +
          "The site owner needs to add a Groq key to Vercel:\n" +
          "vercel.com → Project → Settings → Environment Variables\n" +
          "Add: GROQ_API_KEY = (your free key from console.groq.com)\n\n" +
          "Or YOU can add your own free key in the field below."
        );
        if (btn) { btn.disabled=false; btn.textContent="⚡ Generate"; }
        return;
      }
      showOutput(result, tier);
      showMsg("","");
      cacheSet(inputs, result);
      if (btn) { btn.disabled=false; btn.textContent="⚡ Generate"; }

    }).catch(function(e) {
      if (e.message !== "stop") {
        clearOutput();
        showMsg("error","Something went wrong. Please try again.");
        if (btn) { btn.disabled=false; btn.textContent="⚡ Generate"; }
      }
    });
  }

  /* ════════════════════════════════════════════════════════════════════════
     UI
  ════════════════════════════════════════════════════════════════════════ */
  function showMsg(type, text) {
    var el = document.getElementById("te-msg");
    if (!el) return;
    if (!type || !text) { el.style.display="none"; return; }
    var style = type === "loading"
      ? "background:#1c1917;border:1px solid rgba(251,191,36,.3);color:#fbbf24"
      : "background:rgba(239,68,68,.08);border:1px solid rgba(239,68,68,.3);color:#f87171";
    el.style.cssText = "display:block;border-radius:10px;padding:14px 16px;" +
      "font-size:14px;margin-top:12px;white-space:pre-line;line-height:1.75;" + style;
    el.textContent = (type==="loading" ? "⏳ " : "⚠️ ") + text;
  }

  function showOutput(text, tier) {
    var wrap = document.getElementById("te-output-wrap");
    var out  = document.getElementById("te-output");
    var bdg  = document.getElementById("te-ai-badge");
    if (!wrap) return;
    wrap.style.display="block";
    if (out) out.textContent = text;
    if (bdg) {
      var BADGES = {
        server:{ label:"⚡ Forjit AI", color:"#fbbf24" },
        groq:  { label:"⚡ Groq",      color:"#fbbf24" },
        free:  { label:"🌐 Free AI",   color:"#34d399" },
        cache: { label:"💾 Cached",    color:"#4ade80" },
      };
      var b = BADGES[tier] || { label:tier, color:"#a8a29e" };
      bdg.style.cssText = "display:inline-block;font-size:10px;padding:2px 9px;" +
        "border-radius:999px;font-weight:700;background:rgba(0,0,0,.3);color:"+b.color+";"+
        "border:1px solid "+b.color+"44";
      bdg.textContent = b.label;
    }
  }

  function clearOutput() {
    var wrap = document.getElementById("te-output-wrap");
    if (wrap) wrap.style.display="none";
  }

  /* ── Build UI ─────────────────────────────────────────────────────────── */
  function buildUI() {
    var mount = document.getElementById("te-mount");
    if (!mount) return;

    mount.innerHTML =
      // Tool inputs
      '<div style="background:#1c1917;border:1px solid #292524;border-radius:12px;' +
           'padding:20px;margin-bottom:14px">' +
        '<div id="te-inputs"></div>' +
        '<button id="te-generate" ' +
          'style="margin-top:16px;width:100%;background:#fbbf24;color:#0c0a09;border:none;' +
                 'border-radius:10px;padding:14px;font-size:16px;font-weight:800;' +
                 'cursor:pointer;font-family:inherit">' +
          '⚡ Generate Free' +
        '</button>' +
      '</div>' +

      // Status
      '<div id="te-msg" style="display:none"></div>' +

      // Output
      '<div id="te-output-wrap" style="display:none;background:#1c1917;border:1px solid #292524;' +
           'border-radius:12px;padding:20px;margin-top:14px">' +
        '<div style="display:flex;align-items:center;justify-content:space-between;' +
                    'margin-bottom:12px;flex-wrap:wrap;gap:8px">' +
          '<div style="display:flex;align-items:center;gap:8px">' +
            '<span style="font-size:11px;font-weight:700;color:#78716c;' +
                  'text-transform:uppercase;letter-spacing:.07em">Result</span>' +
            '<span id="te-ai-badge" style="display:none"></span>' +
          '</div>' +
          '<div style="display:flex;gap:8px">' +
            '<button id="te-copy" style="padding:7px 14px;font-size:13px;' +
              'background:#292524;color:#a8a29e;border:none;border-radius:7px;' +
              'cursor:pointer;font-family:inherit">📋 Copy</button>' +
            '<button id="te-regen" style="padding:7px 14px;font-size:13px;' +
              'background:#292524;color:#a8a29e;border:none;border-radius:7px;' +
              'cursor:pointer;font-family:inherit">🔄 Redo</button>' +
          '</div>' +
        '</div>' +
        '<div id="te-output" style="white-space:pre-wrap;font-size:15px;' +
             'line-height:1.8;color:#e7e5e4;min-height:40px"></div>' +
      '</div>' +

      // Optional own key (collapsible)
      '<details style="margin-top:16px">' +
        '<summary style="font-size:12px;color:#78716c;cursor:pointer;list-style:none;' +
                        'display:flex;align-items:center;gap:6px">' +
          '🔑 Add your own Groq key (optional — for extra reliability)' +
        '</summary>' +
        '<div style="background:#1c1917;border:1px solid #292524;border-radius:10px;' +
                    'padding:14px;margin-top:8px">' +
          '<div style="display:flex;gap:8px;flex-wrap:wrap">' +
            '<input type="password" id="te-api-key" placeholder="gsk_..." ' +
              'style="flex:1;min-width:0;background:#0c0a09;border:1px solid #292524;' +
                     'border-radius:8px;padding:10px 12px;color:#e7e5e4;font-size:14px;' +
                     'outline:none;font-family:inherit"/>' +
            '<button id="te-save-key" ' +
              'style="padding:10px 16px;background:#292524;color:#a8a29e;border:none;' +
                     'border-radius:8px;cursor:pointer;font-size:14px;font-family:inherit">' +
              'Save' +
            '</button>' +
          '</div>' +
          '<a href="https://console.groq.com/keys" target="_blank" ' +
            'style="display:block;font-size:12px;color:#78716c;margin-top:8px;' +
                   'text-decoration:none">→ Get free key at console.groq.com/keys</a>' +
        '</div>' +
      '</details>';

    // Render inputs
    TOOL.inputs.forEach(function(inp) {
      var el = document.getElementById("te-inputs");
      if (el) el.insertAdjacentHTML("beforeend", renderInput(inp));
    });

    // Restore saved key
    getKey().then(function(k) {
      if (k) { var el = document.getElementById("te-api-key"); if (el) el.value=k; }
    }).catch(function(){});

    // Wire buttons
    var genBtn  = document.getElementById("te-generate");
    var saveBtn = document.getElementById("te-save-key");
    var copyBtn = document.getElementById("te-copy");
    var redoBtn = document.getElementById("te-regen");

    if (genBtn)  genBtn.onclick  = function() { generate(false); };
    if (redoBtn) redoBtn.onclick = function() { generate(true); };
    if (copyBtn) copyBtn.onclick = function() {
      var out = document.getElementById("te-output");
      if (!out || !out.textContent) return;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(out.textContent).then(function() {
          copyBtn.textContent = "✓ Copied!";
          setTimeout(function() { copyBtn.textContent = "📋 Copy"; }, 2000);
        }).catch(function(){});
      }
    };
    if (saveBtn) saveBtn.onclick = function() {
      var el = document.getElementById("te-api-key");
      var k  = el ? el.value.trim() : "";
      if (!k) return;
      saveKey(k).then(function() {
        saveBtn.textContent = "✓ Saved";
        setTimeout(function() { saveBtn.textContent = "Save"; }, 2000);
      });
    };
  }

  /* ── Render input ─────────────────────────────────────────────────────── */
  function renderInput(inp) {
    var inputStyle =
      'style="width:100%;box-sizing:border-box;background:#0c0a09;border:1px solid #292524;' +
      'border-radius:8px;padding:12px;color:#e7e5e4;font-size:15px;outline:none;' +
      'font-family:inherit;margin-top:6px"' +
      ' onfocus="this.style.borderColor=\'#fbbf24\'"' +
      ' onblur="this.style.borderColor=\'#292524\'"';

    var lbl = '<label style="font-size:11px;font-weight:700;color:#78716c;' +
      'text-transform:uppercase;letter-spacing:.07em">'+inp.label+'</label>';
    var wrap = '<div style="margin-bottom:14px">';

    if (inp.type === "select") {
      var opts = inp.options.map(function(o) {
        return '<option value="'+o+'">'+o+'</option>';
      }).join("");
      return wrap+lbl+'<select id="te-inp-'+inp.id+'" '+inputStyle+'>'+opts+'</select></div>';
    }
    if (inp.type === "textarea") {
      return wrap+lbl+'<textarea id="te-inp-'+inp.id+'" placeholder="'+(inp.placeholder||"")+
        '" rows="'+(inp.rows||3)+'" '+inputStyle+'></textarea></div>';
    }
    return wrap+lbl+'<input type="text" id="te-inp-'+inp.id+'" placeholder="'+
      (inp.placeholder||"")+'" '+inputStyle+'/></div>';
  }

  function getInputValues() {
    var v = {};
    TOOL.inputs.forEach(function(inp) {
      var el = document.getElementById("te-inp-"+inp.id);
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
