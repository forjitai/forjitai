/* ─── Forjit AI · Tool Common UX ─────────────────────────────────────────────
 *
 *  Include in every tool:  <script src="tool-common.js"></script>
 *
 *  Automatically adds:
 *    1. "Share this calculation" button (URL params)
 *    2. Related tools section
 *    3. Consistent footer
 *    4. Last-visited tracking (which tools user has used)
 *
 *  Zero configuration needed — detects current tool from URL slug.
 * ──────────────────────────────────────────────────────────────────────────*/

(function () {
  /* ── Load Sentry for error tracking ────────────────────────────────────── */
  if (location.hostname !== 'localhost') {
    const s = document.createElement('script');
    s.src = 'https://browser.sentry-cdn.com/7.99.0/bundle.min.js';
    s.crossOrigin = 'anonymous';
    s.onload = function() {
      Sentry.init({
        dsn: 'https://9a3b4520b380e57d96a2d67780b82a35@o4511285859516416.ingest.us.sentry.io/4511285871771648',
        release: 'forjitai@1.0.0',
        environment: 'production',
        tracesSampleRate: 0.1,
      });
    };
    document.head.appendChild(s);
  }
  'use strict';

  /* ── All tools catalog (kept in sync with src/data/tools.js) ─────────── */
  const TOOLS = [
    { slug:'emi-calculator',              name:'EMI Calculator',         icon:'🏦', cat:'finance'  },
    { slug:'sip-calculator',              name:'SIP Calculator',         icon:'📈', cat:'finance'  },
    { slug:'fd-calculator',               name:'FD Calculator',          icon:'🏧', cat:'finance'  },
    { slug:'rd-calculator',               name:'RD Calculator',          icon:'💳', cat:'finance'  },
    { slug:'compound-interest-calculator',name:'Compound Interest',      icon:'🔄', cat:'finance'  },
    { slug:'loan-eligibility-calculator', name:'Loan Eligibility',       icon:'🏠', cat:'finance'  },
    { slug:'inflation-calculator',        name:'Inflation Calculator',   icon:'📉', cat:'finance'  },
    { slug:'retirement-calculator',       name:'Retirement Planner',     icon:'🌅', cat:'finance'  },
    { slug:'discount-calculator',         name:'Discount Calculator',    icon:'🏷️', cat:'finance'  },
    { slug:'tip-calculator',              name:'Tip & Bill Splitter',    icon:'🍽️', cat:'finance'  },
    { slug:'gst-calculator',              name:'GST Calculator',         icon:'🧾', cat:'india'   },
    { slug:'income-tax-calculator',       name:'Income Tax Calculator',  icon:'📋', cat:'india'   },
    { slug:'ppf-calculator',              name:'PPF Calculator',         icon:'🛡️', cat:'india'   },
    { slug:'salary-calculator',           name:'Salary Calculator',      icon:'💼', cat:'india'   },
    { slug:'hra-calculator',              name:'HRA Calculator',         icon:'🏡', cat:'india'   },
    { slug:'gratuity-calculator',         name:'Gratuity Calculator',    icon:'🎁', cat:'india'   },
    { slug:'cgpa-calculator',             name:'CGPA to % Calculator',   icon:'🎓', cat:'india'   },
    { slug:'qr-generator',               name:'QR Code Generator',      icon:'📱', cat:'india'   },
    { slug:'whatsapp-link',              name:'WhatsApp Link Generator', icon:'💬', cat:'india'   },
    { slug:'fuel-cost-calculator',        name:'Fuel Cost Calculator',   icon:'⛽', cat:'india'   },
    { slug:'bmi-calculator',              name:'BMI Calculator',         icon:'⚖️', cat:'health'  },
    { slug:'calorie-calculator',          name:'Calorie Calculator',     icon:'🥗', cat:'health'  },
    { slug:'water-intake',               name:'Water Intake',           icon:'💧', cat:'health'  },
    { slug:'ideal-weight',               name:'Ideal Weight',           icon:'🎯', cat:'health'  },
    { slug:'age-calculator',              name:'Age Calculator',         icon:'🎂', cat:'health'  },
    { slug:'unit-converter',              name:'Unit Converter',         icon:'📐', cat:'utility' },
    { slug:'percentage-calculator',       name:'Percentage Calculator',  icon:'📊', cat:'utility' },
    { slug:'date-calculator',             name:'Date Calculator',        icon:'📅', cat:'utility' },
    { slug:'speed-distance-time',         name:'Speed Distance Time',    icon:'🚗', cat:'utility' },
    { slug:'scientific-calculator',       name:'Scientific Calculator',  icon:'🔢', cat:'utility' },
    { slug:'stopwatch-timer',             name:'Stopwatch & Timer',      icon:'⏱️', cat:'utility' },
    { slug:'random-generator',            name:'Random Generator',       icon:'🎲', cat:'utility' },
    { slug:'password-generator',          name:'Password Generator',     icon:'🔐', cat:'utility' },
    { slug:'color-converter',             name:'Color Converter',        icon:'🎨', cat:'utility' },
    { slug:'roman-numeral',               name:'Roman Numerals',         icon:'🏛️', cat:'utility' },
    { slug:'word-counter',                name:'Word Counter',           icon:'📝', cat:'text'    },
    { slug:'case-converter',              name:'Case Converter',         icon:'🔡', cat:'text'    },
    { slug:'lorem-ipsum',                name:'Lorem Ipsum',            icon:'📄', cat:'text'    },
    { slug:'base64-encoder',              name:'Base64 Encoder',         icon:'🔢', cat:'dev'     },
    { slug:'number-converter',            name:'Number System Converter',icon:'💻', cat:'dev'     },
    { slug:'json-formatter',              name:'JSON Formatter',         icon:'🗂️', cat:'dev'     },
  ];

  const CAT_LABELS = {
    finance:'Finance', india:'India', health:'Health',
    utility:'Utility', text:'Text', dev:'Developer',
  };

  /* ── Detect current tool slug from URL ──────────────────────────────── */
  function currentSlug() {
    const path = window.location.pathname;
    const match = path.match(/\/([^/]+)\.html$/);
    return match ? match[1] : null;
  }

  /* ── Get related tools (same category, excluding self, max 5) ────────── */
  function getRelated(slug) {
    const self = TOOLS.find(t => t.slug === slug);
    if (!self) return TOOLS.slice(0, 5);
    return TOOLS
      .filter(t => t.cat === self.cat && t.slug !== slug)
      .slice(0, 5);
  }

  /* ── Track visited tools in localStorage ───────────────────────────── */
  function trackVisit(slug) {
    try {
      const visited = JSON.parse(localStorage.getItem('forjit_visited') || '[]');
      if (!visited.includes(slug)) {
        visited.unshift(slug);
        localStorage.setItem('forjit_visited', JSON.stringify(visited.slice(0, 20)));
      }
    } catch (e) {}
  }

  /* ── Share current URL (optionally with params) ─────────────────────── */
  function shareURL() {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: document.title, url }).catch(() => copyURL(url));
    } else {
      copyURL(url);
    }
  }

  function copyURL(url) {
    navigator.clipboard.writeText(url).then(() => {
      const btn = document.getElementById('tc-share-btn');
      if (btn) { btn.textContent = '✓ Link copied!'; setTimeout(() => btn.textContent = '🔗 Share', 1800); }
    }).catch(() => {
      prompt('Copy this link:', url);
    });
  }

  /* ── Inject styles ──────────────────────────────────────────────────── */
  function injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .tc-bar {
        max-width: 900px; margin: 24px auto 0; padding: 0 16px;
      }
      .tc-related {
        background: #1c1917; border: 1px solid #292524; border-radius: 12px;
        padding: 18px; margin-bottom: 14px;
      }
      .tc-related-title {
        font-size: 12px; font-weight: 700; color: #78716c;
        text-transform: uppercase; letter-spacing: .07em; margin-bottom: 12px;
      }
      .tc-related-grid {
        display: flex; gap: 8px; flex-wrap: wrap;
      }
      .tc-related-link {
        display: flex; align-items: center; gap: 6px;
        padding: 8px 14px; background: #0c0a09; border: 1px solid #292524;
        border-radius: 8px; text-decoration: none; color: #a8a29e;
        font-size: 13px; transition: all .15s;
      }
      .tc-related-link:hover {
        border-color: #fbbf24; color: #fbbf24;
      }
      .tc-actions {
        display: flex; gap: 8px; align-items: center; margin-bottom: 14px;
        flex-wrap: wrap;
      }
      .tc-share-btn {
        padding: 8px 16px; background: #0c0a09; border: 1px solid #292524;
        border-radius: 8px; cursor: pointer; color: #a8a29e; font-size: 13px;
        font-family: inherit; transition: all .15s;
      }
      .tc-share-btn:hover {
        border-color: #fbbf24; color: #fbbf24;
      }
      .tc-all-link {
        padding: 8px 16px; background: #fbbf24; color: #0c0a09;
        border-radius: 8px; text-decoration: none; font-size: 13px;
        font-weight: 700; transition: background .15s;
      }
      .tc-all-link:hover { background: #f59e0b; }
      .tc-footer {
        text-align: center; padding: 20px 16px;
        font-size: 12px; color: #78716c; border-top: 1px solid #292524;
        margin-top: 8px;
      }
      .tc-footer a { color: #a8a29e; text-decoration: none; }
      .tc-footer a:hover { color: #fbbf24; }
    `;
    document.head.appendChild(style);
  }

  /* ── Disclaimer for finance / health tools ──────────────────────────── */
  const DISCLAIMER_CATS = ['finance', 'india', 'health'];

  function injectDisclaimer(slug) {
    const tool = TOOLS.find(t => t.slug === slug);
    if (!tool || !DISCLAIMER_CATS.includes(tool.cat)) return;

    const isHealth = tool.cat === 'health';
    const msg = isHealth
      ? '⚕️ Health estimates only — not medical advice. Consult a registered doctor for personal health decisions.'
      : '📊 For estimation only — not professional financial or tax advice. Verify with a CA or financial advisor before making decisions.';

    const disc = document.createElement('div');
    disc.style.cssText = `
      background: rgba(245,158,11,.06);
      border: 1px solid rgba(245,158,11,.2);
      border-radius: 8px;
      padding: 10px 14px;
      font-size: 12px;
      color: #a8a29e;
      margin: 12px 0;
      font-family: 'Segoe UI', system-ui, sans-serif;
      line-height: 1.5;
    `;
    disc.textContent = msg;

    const container = document.querySelector('.container, .container-sm, .wrap');
    if (container) container.prepend(disc);
  }
    const slug = currentSlug();
    if (!slug) return;

    trackVisit(slug);
    injectDisclaimer(slug);

    const related = getRelated(slug);
    const self = TOOLS.find(t => t.slug === slug);
    const catLabel = self ? CAT_LABELS[self.cat] || '' : '';

    const bar = document.createElement('div');
    bar.className = 'tc-bar';
    bar.innerHTML = `
      <div class="tc-actions">
        <button class="tc-share-btn" id="tc-share-btn" onclick="(function(){
          var url=window.location.href;
          if(navigator.clipboard){navigator.clipboard.writeText(url).then(function(){
            var b=document.getElementById('tc-share-btn');
            b.textContent='✓ Link copied!';
            setTimeout(function(){b.textContent='🔗 Share';},1800);
          });}else{prompt('Copy this link:',url);}
        })()">🔗 Share</button>
        <a class="tc-all-link" href="/tools/">← All Tools (${TOOLS.length})</a>
        ${catLabel ? `<span style="font-size:12px;color:#78716c">More ${catLabel} tools:</span>` : ''}
      </div>
      ${related.length ? `
      <div class="tc-related">
        <div class="tc-related-title">Related Tools</div>
        <div class="tc-related-grid">
          ${related.map(t => `
            <a class="tc-related-link" href="${t.slug}.html">
              <span>${t.icon}</span> ${t.name}
            </a>`).join('')}
        </div>
      </div>` : ''}
      <div class="tc-footer">
        <a href="/">Forjit AI</a> · 
        <a href="/tools/">All Tools</a> · 
        <a href="/privacy">Privacy</a> · 
        <a href="/terms">Terms</a> · 
        <a href="/contact">Contact</a> · 
        <a href="/community">Community</a> · 
        <a href="/community#errors">Report Bug</a> · 
        All calculations run 100% in your browser<br/>
        <span style="font-size:10px;color:#78716c">© 2025 Forjit AI · All rights reserved · forjitai@gmail.com</span>
      </div>
    `;

    /* Append after the main container or at body end */
    const container = document.querySelector('.container, .container-sm, .wrap');
    if (container) {
      container.after(bar);
    } else {
      document.body.appendChild(bar);
    }
  }

  /* ── URL param helpers (used by individual tools that support sharing) ── */
  window.ForjitTool = {
    /* Read all URL params as an object */
    getParams: function () {
      const p = {};
      new URLSearchParams(window.location.search).forEach((v, k) => { p[k] = v; });
      return p;
    },

    /* Set a URL param without reloading (updates share link) */
    setParam: function (key, value) {
      const url = new URL(window.location);
      url.searchParams.set(key, value);
      window.history.replaceState({}, '', url);
    },

    /* Set multiple params at once */
    setParams: function (obj) {
      const url = new URL(window.location);
      Object.entries(obj).forEach(([k, v]) => url.searchParams.set(k, v));
      window.history.replaceState({}, '', url);
    },

    /* Clear all params */
    clearParams: function () {
      window.history.replaceState({}, '', window.location.pathname);
    },
  };

  /* ── Run after DOM is ready ──────────────────────────────────────────── */
  /* ── SEO meta injection ─────────────────────────────────────────────── */
  function injectSEO(slug) {
    const tool = TOOLS.find(t => t.slug === slug);
    if (!tool) return;

    const BASE   = 'https://www.forjitai.in';
    const url    = `${BASE}/tools/${slug}.html`;
    const title  = document.title || tool.name + ' — Forjit AI';
    const desc   = document.querySelector('meta[name="description"]')?.content
                 || tool.desc;
    const img    = `${BASE}/og-image.png`;

    // Helper — only add if tag doesn't already exist
    function addMeta(attrs) {
      const key   = attrs.property || attrs.name;
      const check = attrs.property
        ? `meta[property="${attrs.property}"]`
        : `meta[name="${attrs.name}"]`;
      if (document.querySelector(check)) return;
      const m = document.createElement('meta');
      Object.entries(attrs).forEach(([k,v]) => m.setAttribute(k, v));
      document.head.appendChild(m);
    }

    // robots
    addMeta({ name:'robots', content:'index,follow,max-snippet:-1,max-image-preview:large' });

    // Open Graph
    addMeta({ property:'og:type',        content:'website' });
    addMeta({ property:'og:site_name',   content:'Forjit AI' });
    addMeta({ property:'og:url',         content: url });
    addMeta({ property:'og:title',       content: title });
    addMeta({ property:'og:description', content: desc });
    addMeta({ property:'og:image',       content: img });
    addMeta({ property:'og:image:width', content:'1200' });
    addMeta({ property:'og:image:height',content:'630' });
    addMeta({ property:'og:locale',      content:'en_IN' });

    // Twitter Card
    addMeta({ name:'twitter:card',        content:'summary_large_image' });
    addMeta({ name:'twitter:site',        content:'@forjitai' });
    addMeta({ name:'twitter:title',       content: title });
    addMeta({ name:'twitter:description', content: desc });
    addMeta({ name:'twitter:image',       content: img });

    // Category-specific JSON-LD schema
    const SCHEMAS = {
      finance:  'FinancialProduct',
      india:    'WebApplication',
      health:   'MedicalWebPage',
      utility:  'WebApplication',
      text:     'WebApplication',
      dev:      'WebApplication',
    };

    // Only inject if no schema already on page
    if (!document.querySelector('script[type="application/ld+json"]')) {
      const schema = {
        '@context':    'https://schema.org',
        '@type':       'WebPage',
        name:          title,
        description:   desc,
        url:           url,
        inLanguage:    'en-IN',
        isPartOf: {
          '@type': 'WebSite',
          name:    'Forjit AI',
          url:     BASE,
        },
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type':'ListItem', position:1, name:'Forjit AI', item: BASE + '/' },
            { '@type':'ListItem', position:2, name:'Free Tools', item: BASE + '/tools/' },
            { '@type':'ListItem', position:3, name: tool.name, item: url },
          ],
        },
        mainEntity: {
          '@type':       'SoftwareApplication',
          name:          tool.name,
          applicationCategory: 'UtilityApplication',
          operatingSystem:     'Any',
          offers: {
            '@type':       'Offer',
            price:         '0',
            priceCurrency: 'INR',
          },
          description:   desc,
        },
      };

      // Add FAQ schema for finance/india/health tools
      const CAT_FAQS = {
        finance: [
          { q:'Is this calculator free?', a:'Yes, completely free. No login or signup required.' },
          { q:'How accurate are the results?', a:'Results are estimates based on standard formulas. Always verify with a financial advisor before making decisions.' },
          { q:'Does this tool save my data?', a:'All calculations run in your browser. No data is sent to our servers.' },
        ],
        india: [
          { q:'Is this calculator free to use?', a:'Yes, 100% free. No signup or download needed.' },
          { q:'Are the tax/GST rates up to date?', a:'We update rates after each Budget and GST Council meeting. Always verify with a CA for final filings.' },
          { q:'Is my data safe?', a:'All calculations happen in your browser. We never receive your financial data.' },
        ],
        health: [
          { q:'Is this health calculator free?', a:'Yes, completely free with no login required.' },
          { q:'Should I make medical decisions based on these results?', a:'No. These are estimates for general awareness only. Always consult a registered medical professional.' },
          { q:'Is my health data saved?', a:'All calculations run locally in your browser. We do not collect or store health data.' },
        ],
      };

      const faqs = CAT_FAQS[tool.cat];
      if (faqs) {
        schema['@graph'] = [
          schema,
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs.map(f => ({
              '@type': 'Question',
              name:    f.q,
              acceptedAnswer: { '@type':'Answer', text: f.a },
            })),
          },
        ];
        delete schema['@context'];
        delete schema['@type'];
        delete schema.name;
      }

      const s = document.createElement('script');
      s.type = 'application/ld+json';
      s.textContent = JSON.stringify(faqs ? { '@context':'https://schema.org', '@graph': schema['@graph'] } : schema);
      document.head.appendChild(s);
    }
  }

  function init() {
    injectStyles();
    const slug = currentSlug();
    if (slug) injectSEO(slug);
    inject();
    // Load cookie consent banner — use absolute path (tools are in /tools/ subdir)
    if (!document.querySelector('script[src="/cookie-consent.js"]')) {
      const s = document.createElement('script');
      s.src = '/cookie-consent.js';
      document.body.appendChild(s);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
