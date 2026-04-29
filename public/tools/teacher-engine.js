/* ─── Forjit AI · Teacher Tool Engine v5.0 ──────────────────────────────────
 *  Mobile-first. try/finally everywhere. Clear error messages.
 *  © 2025 Forjit AI · All rights reserved
 * ──────────────────────────────────────────────────────────────────────────*/
(function () {
  "use strict";

  /* ── Config ────────────────────────────────────────────────────────────── */
  const GROQ_URL    = "https://api.groq.com/openai/v1/chat/completions";
  const GROQ_MODELS = { fast:"llama-3.1-8b-instant", smart:"llama-3.3-70b-versatile" };
  const SYS = "You are an expert Indian teacher assistant. Write in plain text with clear headings. No ** or ## markdown. Follow CBSE/ICSE curriculum.";
  const RATE_LIMIT  = 10;
  const CACHE_TTL   = 7 * 24 * 60 * 60 * 1000;
  const DB_NAME     = "forjitai_db";

  /* ── Load config ───────────────────────────────────────────────────────── */
  var cfgEl = document.getElementById("tool-config");
  if (!cfgEl) return;
  var TOOL;
  try { TOOL = JSON.parse(cfgEl.textContent); } catch(e) { return; }

  /* ── Timeout race ──────────────────────────────────────────────────────── */
  function withTimeout(p, ms) {
    return Promise.race([p,
      new Promise(function(_, r){ setTimeout(function(){ r(new Error("timeout")); }, ms); })
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
    } catch(e) { return "tc_" + TOOL.id + Date.now(); }
  }

  function cacheGet(inputs) {
    return dbGet("teacherCache", cKey(inputs)).then(function(e) {
      return (e && (Date.now() - e.ts < CACHE_TTL)) ? e.output : null;
    });
  }

  function cacheSet(inputs, output) {
    return dbSet("teacherCache", cKey(inputs), { output:output, ts:Date.now() });
  }

  /* ── Rate limit ────────────────────────────────────────────────────────── */
  function getRD() {
    try {
      var d = JSON.parse(localStorage.getItem("te_rate")||"{}");
      return (!d.hour || Date.now()-d.hour > 3600000) ? { count:0, hour:Date.now() } : d;
    } catch(e) { return { count:0, hour:Date.now() }; }
  }
  function canUse()  { return getRD().count < RATE_LIMIT; }
  function useOne()  { var d=getRD(); d.count++; localStorage.setItem("te_rate",JSON.stringify(d)); }
  function rateInfo(){ var d=getRD(); return { left:Math.max(0,RATE_LIMIT-d.count), reset:Math.max(0,Math.ceil((d.hour+3600000-Date.now())/60000)) }; }

  /* ── API key ───────────────────────────────────────────────────────────── */
  function getKey()     { return dbGet("users","teacher_groq_key"); }
  function saveKey(key) { return dbSet("users","teacher_groq_key",key); }

  /* ── Prompt builder ────────────────────────────────────────────────────── */
  function buildPrompt(inputs) {
    var p = TOOL.promptTemplate || "";
    Object.keys(inputs).forEach(function(k) {
      p = p.split("{{"+k+"}}").join(inputs[k]);
    });
    return p;
  }

  /* ── Chrome AI (3s timeout) ────────────────────────────────────────────── */
  var _chromeOk   = null;
  var _chromeSess = null;

  function hasChromeAI() {
    if (_chromeOk !== null) return Promise.resolve(_chromeOk);
    return withTimeout(
      new Promise(function(res) {
        try {
          if (typeof window.LanguageModel !== "undefined") {
            window.LanguageModel.availability().then(function(a) {
              _chromeOk = (a==="available"||a==="readily"); res(_chromeOk);
            }).catch(function() { _chromeOk=false; res(false); });
          } else if (window.ai && window.ai.languageModel) {
            window.ai.languageModel.capabilities().then(function(c) {
              _chromeOk = (c && c.available==="readily"); res(_chromeOk);
            }).catch(function() { _chromeOk=false; res(false); });
          } else { _chromeOk=false; res(false); }
        } catch(e) { _chromeOk=false; res(false); }
      }),
      3000
    ).catch(function() { _chromeOk=false; return false; });
  }

  function callChrome(prompt, onChunk) {
    var opts = { systemPrompt:SYS, temperature:0.7, topK:40 };
    var createP = (typeof window.LanguageModel !== "undefined")
      ? window.LanguageModel.create(opts)
      : window.ai.languageModel.create(opts);

    return withTimeout(createP, 10000).then(function(sess) {
      _chromeSess = sess;
      if (typeof sess.promptStreaming === "function") {
        return new Promise(function(res, rej) {
          var last = "";
          var stream = sess.promptStreaming(prompt);
          function read(reader) {
            reader.read().then(function(r) {
              if (r.done) { res(last); return; }
              if (r.value && r.value !== last) { last=r.value; onChunk(last); }
              read(reader);
            }).catch(rej);
          }
          // Try async iteration first, fall back to reader
          if (stream[Symbol.asyncIterator]) {
            (async function() {
              try {
                for await (var chunk of stream) {
                  if (chunk !== last) { last=chunk; onChunk(chunk); }
                }
                res(last);
              } catch(e) { rej(e); }
            })();
          } else {
            res(sess.prompt(prompt).then(function(r) { onChunk(r); return r; }));
          }
        });
      }
      return withTimeout(sess.prompt(prompt), 30000).then(function(r) { onChunk(r); return r; });
    });
  }

  /* ── Groq ──────────────────────────────────────────────────────────────── */
  function callGroq(prompt, key, onChunk) {
    return withTimeout(
      fetch(GROQ_URL, {
        method:"POST",
        headers:{ "Content-Type":"application/json", "Authorization":"Bearer "+key },
        body:JSON.stringify({
          model: GROQ_MODELS[TOOL.model||"fast"],
          max_tokens: TOOL.maxTokens||500,
          temperature:0.7, stream:true,
          messages:[{ role:"system", content:SYS },{ role:"user", content:prompt }]
        })
      }), 25000
    ).then(function(res) {
      if (!res.ok) {
        return res.text().catch(function(){return "";}).then(function(e) {
          if (res.status===401) throw new Error("Invalid Groq key. Check and re-save it.");
          if (res.status===429) throw new Error("Groq rate limit. Wait 1 minute and try again.");
          throw new Error("Groq error "+res.status);
        });
      }
      var reader = res.body.getReader();
      var dec    = new TextDecoder();
      var full   = "";
      function pump() {
        return reader.read().then(function(r) {
          if (r.done) return full;
          dec.decode(r.value).split("\n").forEach(function(line) {
            if (!line.startsWith("data: ")) return;
            var d = line.slice(6).trim();
            if (d==="[DONE]") return;
            try { var t=JSON.parse(d)?.choices?.[0]?.delta?.content||""; full+=t; onChunk(full); } catch(e){}
          });
          return pump();
        });
      }
      return pump();
    });
  }

  /* ── Pollinations (free) ───────────────────────────────────────────────── */
  function callPollinations(prompt, onChunk) {
    return withTimeout(
      fetch("https://text.pollinations.ai/", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          messages:[{role:"system",content:SYS},{role:"user",content:prompt}],
          model:"openai", private:true
        })
      }), 18000
    ).then(function(res) {
      if (!res.ok) throw new Error("not-ok");
      return res.text();
    }).then(function(t) {
      t = t.trim();
      if (!t || t.length < 10) throw new Error("empty");
      onChunk(t); return t;
    }).catch(function(e1) {
      // GET fallback
      var q = encodeURIComponent(prompt.slice(0,400));
      return withTimeout(
        fetch("https://text.pollinations.ai/"+q+"?model=openai&private=true"),
        18000
      ).then(function(res) {
        if (!res.ok) throw new Error("not-ok");
        return res.text();
      }).then(function(t) {
        t = t.trim();
        if (!t || t.length < 10) throw new Error("empty");
        onChunk(t); return t;
      }).catch(function() {
        return null; // signal failure without throwing
      });
    });
  }

  /* ════════════════════════════════════════════════════════════════════════
     GENERATE
  ════════════════════════════════════════════════════════════════════════ */
  function generate(forceRegen) {
    var btn = document.getElementById("te-generate");
    if (!btn) return;

    var inputs = getInputValues();

    // Validate
    for (var i=0; i<TOOL.inputs.length; i++) {
      var inp = TOOL.inputs[i];
      if (inp.required !== false && !inputs[inp.id]) {
        showMsg("error", "Please fill in: " + inp.label);
        return;
      }
    }

    // ── IMMEDIATELY disable button & show loading ──
    btn.disabled    = true;
    btn.textContent = "⏳ Generating…";
    clearOutput();
    showMsg("loading", "Starting…");

    cacheGet(inputs).then(function(cached) {
      if (!forceRegen && cached) {
        showOutput(cached, "cache");
        showMsg("", "");
        btn.disabled=false; btn.textContent="⚡ Generate";
        return;
      }

      var prompt = buildPrompt(inputs);
      runTiers(prompt, inputs, btn);
    }).catch(function(e) {
      runTiers(buildPrompt(inputs), inputs, btn);
    });
  }

  function runTiers(prompt, inputs, btn) {
    var result = "";
    var tier   = "";

    // Tier 1: Chrome AI
    hasChromeAI().then(function(chrome) {
      if (chrome) {
        showMsg("loading", "Running on your device…");
        return withTimeout(callChrome(prompt, function(t) {
          showOutput(t, null);
        }), 35000).then(function(r) {
          if (r && r.length > 10) { result=r; tier="chrome"; }
        }).catch(function(e) { _chromeSess=null; });
      }
    }).catch(function(){})

    .then(function() {
      if (result) return;
      // Tier 2: Groq key
      var keyEl = document.getElementById("te-api-key");
      var typedKey = keyEl ? keyEl.value.trim() : "";

      return (typedKey ? Promise.resolve(typedKey) : getKey()).then(function(key) {
        if (!key) return;
        showMsg("loading", "Generating with Groq AI…");
        return callGroq(prompt, key, function(t) {
          showOutput(t, null);
        }).then(function(r) {
          if (r && r.length > 10) { result=r; tier="groq"; }
        }).catch(function(e) {
          showMsg("error", e.message);
          btn.disabled=false; btn.textContent="⚡ Generate";
          throw new Error("groq-fail");
        });
      });
    })

    .then(function() {
      if (result) return;
      // Tier 3: Pollinations
      if (!canUse()) {
        var info = rateInfo();
        showMsg("error",
          "Free limit reached (" + RATE_LIMIT + "/hr). Resets in " + info.reset + " min.\n" +
          "Add your free Groq key above for unlimited use."
        );
        clearOutput();
        btn.disabled=false; btn.textContent="⚡ Generate";
        return;
      }
      showMsg("loading", "Free AI generating… (up to 20 seconds)");
      return callPollinations(prompt, function(t) { showOutput(t, null); })
        .then(function(r) {
          if (r && r.length > 10) { useOne(); result=r; tier="free"; }
        });
    })

    .then(function() {
      if (!result) {
        // All failed
        clearOutput();
        showMsg("error",
          "Could not generate output.\n\n" +
          "Add your FREE Groq key to make it work reliably:\n" +
          "1. Visit console.groq.com/keys\n" +
          "2. Sign up free (no credit card)\n" +
          "3. Copy your API key\n" +
          "4. Paste it in the 🔑 field above\n" +
          "5. Tap Save → Generate again"
        );
        btn.disabled=false; btn.textContent="⚡ Generate";
        return;
      }
      // Success
      showOutput(result, tier);
      showMsg("", "");
      cacheSet(inputs, result);
      updateBadge();
      btn.disabled=false; btn.textContent="⚡ Generate";
    })

    .catch(function(e) {
      if (e.message === "groq-fail") return; // already handled
      clearOutput();
      showMsg("error", "Something went wrong. Please try again.");
      btn.disabled=false; btn.textContent="⚡ Generate";
    });
  }

  /* ── UI ────────────────────────────────────────────────────────────────── */
  function showMsg(type, text) {
    var el = document.getElementById("te-msg");
    if (!el) return;
    if (!type || !text) { el.style.display="none"; return; }
    var bg = type==="loading"
      ? "background:#1c1917;border-color:rgba(251,191,36,.3);color:#fbbf24"
      : "background:rgba(239,68,68,.1);border-color:rgba(239,68,68,.3);color:#f87171";
    el.style.cssText = "display:block;border:1px solid;border-radius:10px;padding:16px;" +
      "font-size:14px;margin-top:12px;white-space:pre-line;line-height:1.75;" + bg;
    el.textContent = (type==="loading" ? "⏳ " : "⚠️ ") + text;
  }

  function showOutput(text, tier) {
    var wrap = document.getElementById("te-output-wrap");
    var out  = document.getElementById("te-output");
    var bdg  = document.getElementById("te-ai-badge");
    if (!wrap) return;
    wrap.style.display = "block";
    if (out) out.textContent = text;
    if (bdg) {
      var BADGE = {
        chrome:{ label:"🧠 On-device", color:"#a5b4fc" },
        groq:  { label:"⚡ Groq",      color:"#fbbf24" },
        free:  { label:"🌐 Free AI",   color:"#34d399" },
        cache: { label:"⚡ Cached",    color:"#4ade80" },
      };
      if (!tier) { bdg.style.display="none"; }
      else {
        var b = BADGE[tier]||{ label:tier, color:"#a8a29e" };
        bdg.style.cssText = "display:inline-block;font-size:10px;padding:2px 8px;" +
          "border-radius:999px;font-weight:600;background:rgba(0,0,0,.3);color:"+b.color;
        bdg.textContent = b.label;
      }
    }
  }

  function clearOutput() {
    var wrap = document.getElementById("te-output-wrap");
    var bdg  = document.getElementById("te-ai-badge");
    if (wrap) wrap.style.display="none";
    if (bdg) bdg.style.display="none";
  }

  function updateBadge() {
    var el = document.getElementById("te-rate-badge");
    if (!el) return;
    Promise.all([hasChromeAI(), getKey()]).then(function(r) {
      var chrome=r[0], key=r[1];
      if (chrome||key) { el.textContent="Unlimited ∞"; el.style.color="#4ade80"; }
      else {
        var info = rateInfo();
        el.textContent = info.left+"/"+RATE_LIMIT+" free · resets "+info.reset+"m";
        el.style.color = info.left<3 ? "#f87171" : "#a8a29e";
      }
    }).catch(function(){});
  }

  /* ── Build UI ──────────────────────────────────────────────────────────── */
  function buildUI() {
    var mount = document.getElementById("te-mount");
    if (!mount) return;

    // Groq key prominent banner
    var html =
      '<div style="background:rgba(251,191,36,.08);border:1px solid rgba(251,191,36,.2);' +
      'border-radius:12px;padding:16px;margin-bottom:16px">' +
        '<div style="font-size:13px;font-weight:700;color:#fbbf24;margin-bottom:10px">' +
          '🔑 Add Your Free Groq Key — Required for Best Results' +
        '</div>' +
        '<div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center">' +
          '<input type="password" id="te-api-key"' +
            ' placeholder="gsk_... (paste your Groq key here)"' +
            ' style="flex:1;min-width:0;background:#0c0a09;border:1px solid #292524;' +
                   'border-radius:8px;padding:10px 12px;color:#e7e5e4;font-size:14px;' +
                   'outline:none;font-family:inherit"/>' +
          '<button id="te-save-key"' +
            ' style="padding:10px 16px;background:#fbbf24;color:#0c0a09;border:none;' +
                   'border-radius:8px;font-weight:700;cursor:pointer;font-size:14px;' +
                   'font-family:inherit;white-space:nowrap">Save Key</button>' +
        '</div>' +
        '<div style="margin-top:8px;display:flex;justify-content:space-between;' +
                    'align-items:center;flex-wrap:wrap;gap:6px">' +
          '<span id="te-rate-badge" style="font-size:11px;color:#78716c"></span>' +
          '<a href="https://console.groq.com/keys" target="_blank"' +
            ' style="font-size:12px;color:#fbbf24;text-decoration:none">' +
            '→ Get FREE key at console.groq.com/keys</a>' +
        '</div>' +
      '</div>' +

      // Inputs card
      '<div style="background:#1c1917;border:1px solid #292524;border-radius:12px;padding:20px;margin-bottom:14px">' +
        '<div id="te-inputs"></div>' +
        '<button id="te-generate"' +
          ' style="margin-top:16px;width:100%;background:#fbbf24;color:#0c0a09;border:none;' +
                 'border-radius:10px;padding:14px;font-size:16px;font-weight:800;' +
                 'cursor:pointer;font-family:inherit;letter-spacing:.01em">' +
          '⚡ Generate' +
        '</button>' +
      '</div>' +

      // Status message
      '<div id="te-msg" style="display:none"></div>' +

      // Output
      '<div id="te-output-wrap"' +
        ' style="display:none;background:#1c1917;border:1px solid #292524;' +
               'border-radius:12px;padding:20px;margin-top:14px">' +
        '<div style="display:flex;align-items:center;justify-content:space-between;' +
                    'margin-bottom:12px;flex-wrap:wrap;gap:6px">' +
          '<div style="display:flex;align-items:center;gap:8px">' +
            '<span style="font-size:11px;font-weight:700;color:#a8a29e;' +
                  'text-transform:uppercase;letter-spacing:.07em">Result</span>' +
            '<span id="te-ai-badge" style="display:none"></span>' +
          '</div>' +
          '<div style="display:flex;gap:6px">' +
            '<button id="te-copy"' +
              ' style="padding:6px 14px;font-size:12px;background:#292524;color:#a8a29e;' +
                     'border:none;border-radius:6px;cursor:pointer;font-family:inherit">' +
              '📋 Copy</button>' +
            '<button id="te-regen"' +
              ' style="padding:6px 14px;font-size:12px;background:#292524;color:#a8a29e;' +
                     'border:none;border-radius:6px;cursor:pointer;font-family:inherit">' +
              '🔄 Redo</button>' +
          '</div>' +
        '</div>' +
        '<div id="te-output"' +
          ' style="white-space:pre-wrap;font-size:14px;line-height:1.8;color:#e7e5e4;min-height:40px">' +
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
      updateBadge();
    }).catch(function(){});

    // Wire buttons
    var saveBtn = document.getElementById("te-save-key");
    var genBtn  = document.getElementById("te-generate");
    var copyBtn = document.getElementById("te-copy");
    var redoBtn = document.getElementById("te-regen");

    if (saveBtn) saveBtn.onclick = function() {
      var el = document.getElementById("te-api-key");
      var k  = el ? el.value.trim() : "";
      if (!k) { showMsg("error","Please paste your Groq key first."); return; }
      saveKey(k).then(function() {
        showMsg("",""); updateBadge();
        var t=document.createElement("div");
        t.textContent="✓ Key saved";
        t.style.cssText="position:fixed;bottom:24px;right:20px;background:#22c55e;color:#fff;" +
          "padding:10px 18px;border-radius:10px;font-size:14px;z-index:9999;font-weight:600";
        document.body.appendChild(t);
        setTimeout(function(){t.remove();},2000);
      });
    };
    if (genBtn)  genBtn.onclick  = function() { generate(false); };
    if (redoBtn) redoBtn.onclick = function() { generate(true); };
    if (copyBtn) copyBtn.onclick = function() {
      var out = document.getElementById("te-output");
      if (!out || !out.textContent) return;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(out.textContent).then(function() {
          copyBtn.textContent="✓ Copied!";
          setTimeout(function(){copyBtn.textContent="📋 Copy";},2000);
        }).catch(function(){});
      }
    };
  }

  /* ── Render input ──────────────────────────────────────────────────────── */
  function renderInput(inp) {
    var base = 'style="font-size:11px;font-weight:700;color:#a8a29e;display:block;' +
               'margin-bottom:5px;text-transform:uppercase;letter-spacing:.07em"';
    var lbl  = '<label for="te-inp-'+inp.id+'" '+base+'>'+inp.label+'</label>';
    var wrap = '<div style="margin-bottom:14px">';
    var inputStyle = 'style="width:100%;box-sizing:border-box;background:#0c0a09;border:1px solid #292524;' +
                     'border-radius:8px;padding:11px 12px;color:#e7e5e4;font-size:15px;outline:none;' +
                     'font-family:inherit;transition:border-color .15s"' +
                     ' onfocus="this.style.borderColor=\'#fbbf24\'"' +
                     ' onblur="this.style.borderColor=\'#292524\'"';

    if (inp.type === "select") {
      var opts = inp.options.map(function(o){ return '<option value="'+o+'">'+o+'</option>'; }).join("");
      return wrap + lbl + '<select id="te-inp-'+inp.id+'" '+inputStyle+'>'+opts+'</select></div>';
    }
    if (inp.type === "textarea") {
      return wrap + lbl + '<textarea id="te-inp-'+inp.id+'"' +
        ' placeholder="'+(inp.placeholder||"")+'" rows="'+(inp.rows||3)+'" '+inputStyle+'></textarea></div>';
    }
    return wrap + lbl + '<input type="text" id="te-inp-'+inp.id+'"' +
      ' placeholder="'+(inp.placeholder||"")+'" '+inputStyle+'/></div>';
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

  // Warm Chrome AI check in background
  setTimeout(function(){ hasChromeAI(); }, 1000);

})();
