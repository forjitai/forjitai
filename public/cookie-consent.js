/* ─── Forjit AI · Cookie Consent ─────────────────────────────────────────────
 *  DPDP Act 2023 compliant cookie consent banner.
 *  Include in any HTML page:  <script src="cookie-consent.js"></script>
 *  Also used by tool-common.js automatically.
 *
 *  Consent choices stored in localStorage:
 *    forjit_consent = "all"       → analytics + functional
 *    forjit_consent = "essential" → functional only, no GA
 *    forjit_consent = "rejected"  → no non-essential cookies
 * ──────────────────────────────────────────────────────────────────────────*/

(function () {
  'use strict';

  const CONSENT_KEY = 'forjit_consent';
  const CONSENT_VERSION = '1'; // bump this to re-ask on policy changes

  function getConsent() {
    try {
      const raw = localStorage.getItem(CONSENT_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (parsed.version !== CONSENT_VERSION) return null;
      return parsed.choice;
    } catch (e) { return null; }
  }

  function setConsent(choice) {
    try {
      localStorage.setItem(CONSENT_KEY, JSON.stringify({
        choice,
        version: CONSENT_VERSION,
        ts: Date.now(),
      }));
    } catch (e) {}
  }

  function disableGA() {
    // Disable Google Analytics if consent not given
    window['ga-disable-G-DYR402JFVG'] = true;
  }

  function enableGA() {
    window['ga-disable-G-DYR402JFVG'] = false;
  }

  function applyConsent(choice) {
    if (choice === 'all') {
      enableGA();
    } else {
      disableGA();
    }
  }

  function removeBanner() {
    const banner = document.getElementById('forjit-cookie-banner');
    if (banner) banner.remove();
  }

  function showBanner() {
    if (document.getElementById('forjit-cookie-banner')) return;

    const banner = document.createElement('div');
    banner.id = 'forjit-cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Cookie consent');
    banner.innerHTML = `
      <style>
        #forjit-cookie-banner {
          position: fixed;
          bottom: 16px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 9999;
          width: calc(100% - 32px);
          max-width: 680px;
          background: #1c1917;
          border: 1px solid #3c3836;
          border-radius: 12px;
          padding: 18px 20px;
          box-shadow: 0 8px 32px rgba(0,0,0,.5);
          font-family: 'Segoe UI', system-ui, sans-serif;
          animation: slideUp .3s ease;
        }
        @keyframes slideUp {
          from { transform: translateX(-50%) translateY(20px); opacity: 0; }
          to   { transform: translateX(-50%) translateY(0);    opacity: 1; }
        }
        #forjit-cookie-banner .cc-top {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 14px;
        }
        #forjit-cookie-banner .cc-icon {
          font-size: 22px;
          flex-shrink: 0;
          margin-top: 2px;
        }
        #forjit-cookie-banner .cc-title {
          font-size: 14px;
          font-weight: 700;
          color: #e7e5e4;
          margin-bottom: 4px;
        }
        #forjit-cookie-banner .cc-text {
          font-size: 12px;
          color: #a8a29e;
          line-height: 1.5;
        }
        #forjit-cookie-banner .cc-text a {
          color: #fbbf24;
          text-decoration: none;
        }
        #forjit-cookie-banner .cc-text a:hover {
          text-decoration: underline;
        }
        #forjit-cookie-banner .cc-btns {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        #forjit-cookie-banner .cc-btn {
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          border: none;
          font-family: inherit;
          transition: all .15s;
        }
        #forjit-cookie-banner .cc-accept {
          background: #fbbf24;
          color: #0c0a09;
          flex: 1;
        }
        #forjit-cookie-banner .cc-accept:hover { background: #f59e0b; }
        #forjit-cookie-banner .cc-essential {
          background: transparent;
          border: 1px solid #3c3836;
          color: #a8a29e;
        }
        #forjit-cookie-banner .cc-essential:hover {
          border-color: #a8a29e;
          color: #e7e5e4;
        }
        #forjit-cookie-banner .cc-reject {
          background: transparent;
          border: 1px solid #3c3836;
          color: #78716c;
          font-size: 12px;
        }
        #forjit-cookie-banner .cc-reject:hover {
          color: #a8a29e;
        }
        @media (max-width: 480px) {
          #forjit-cookie-banner { bottom: 0; border-radius: 12px 12px 0 0; width: 100%; left: 0; transform: none; }
          #forjit-cookie-banner .cc-accept { flex: none; width: 100%; }
        }
      </style>
      <div class="cc-top">
        <div class="cc-icon">🍪</div>
        <div>
          <div class="cc-title">We use cookies</div>
          <div class="cc-text">
            Forjit AI uses <strong style="color:#e7e5e4">Google Analytics</strong> to understand site usage (page views, device type, approximate location). All calculator data stays in your browser — never sent to our servers.<br/>
            <a href="/privacy" target="_blank">Privacy Policy</a> · <a href="/terms" target="_blank">Terms of Service</a>
          </div>
        </div>
      </div>
      <div class="cc-btns">
        <button class="cc-btn cc-accept" id="cc-accept-all">✓ Accept Analytics</button>
        <button class="cc-btn cc-essential" id="cc-essential-only">Essential Only</button>
        <button class="cc-btn cc-reject" id="cc-reject">Reject All</button>
      </div>
    `;

    document.body.appendChild(banner);

    document.getElementById('cc-accept-all').onclick = function () {
      setConsent('all');
      enableGA();
      removeBanner();
    };
    document.getElementById('cc-essential-only').onclick = function () {
      setConsent('essential');
      disableGA();
      removeBanner();
    };
    document.getElementById('cc-reject').onclick = function () {
      setConsent('rejected');
      disableGA();
      removeBanner();
    };
  }

  function init() {
    const choice = getConsent();
    if (choice) {
      applyConsent(choice);
      return; // already consented, don't show banner
    }
    // No consent yet — disable GA until user chooses
    disableGA();
    // Show banner after short delay (don't block page load)
    setTimeout(showBanner, 800);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose for programmatic use
  window.ForjitConsent = {
    get: getConsent,
    reset: function () {
      localStorage.removeItem(CONSENT_KEY);
      location.reload();
    },
    hasAnalytics: function () { return getConsent() === 'all'; },
  };

})();
