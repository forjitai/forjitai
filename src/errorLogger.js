/* ─── Forjit AI · Global Error Logger ───────────────────────────────────────
 *  Catches all JS errors + unhandled promise rejections
 *  Stores last 200 errors in localStorage
 *  Reports to Sentry.io for real-time monitoring
 * ─────────────────────────────────────────────────────────────────────────*/

import * as Sentry from '@sentry/browser';

const LOG_KEY  = 'forjit_error_log';
const MAX_LOGS = 200;
const APP_VER  = '1.0.0';

/* ── Init Sentry ────────────────────────────────────────────────────────── */
Sentry.init({
  dsn: 'https://9a3b4520b380e57d96a2d67780b82a35@o4511285859516416.ingest.us.sentry.io/4511285871771648',
  release: `forjitai@${APP_VER}`,
  environment: location.hostname === 'localhost' ? 'development' : 'production',
  tracesSampleRate: 0.2,        // 20% of transactions traced
  replaysOnErrorSampleRate: 1,  // 100% replay on errors
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration({
      maskAllText: false,
      blockAllMedia: false,
    }),
  ],
  beforeSend(event) {
    // Don't send errors from localhost
    if (location.hostname === 'localhost') return null;
    return event;
  },
});

/* ── Helpers ────────────────────────────────────────────────────────────── */
function getDevice() {
  try {
    return {
      ua:       navigator.userAgent.substring(0, 120),
      lang:     navigator.language,
      screen:   `${screen.width}×${screen.height}`,
      platform: navigator.platform,
      online:   navigator.onLine,
    };
  } catch { return {}; }
}

function getLogs() {
  try { return JSON.parse(localStorage.getItem(LOG_KEY) || '[]'); }
  catch { return []; }
}

function saveLogs(logs) {
  try { localStorage.setItem(LOG_KEY, JSON.stringify(logs.slice(-MAX_LOGS))); }
  catch {}
}

function addLog(entry) {
  const logs = getLogs();
  logs.push({
    id:        Date.now(),
    ts:        new Date().toISOString(),
    page:      window.location.pathname + window.location.search,
    appVer:    APP_VER,
    device:    getDevice(),
    ...entry,
  });
  saveLogs(logs);
}

/* ── Capture JS errors ──────────────────────────────────────────────────── */
window.addEventListener('error', (e) => {
  addLog({
    type:    'JS_ERROR',
    message: e.message || 'Unknown error',
    source:  e.filename || '',
    line:    e.lineno,
    col:     e.colno,
    stack:   e.error?.stack?.substring(0, 500) || '',
  });
});

/* ── Capture unhandled promise rejections ───────────────────────────────── */
window.addEventListener('unhandledrejection', (e) => {
  addLog({
    type:    'PROMISE_REJECTION',
    message: String(e.reason?.message || e.reason || 'Unhandled rejection'),
    stack:   e.reason?.stack?.substring(0, 500) || '',
  });
});

/* ── Manual log function (call from anywhere) ───────────────────────────── */
export function logError(message, context = {}) {
  addLog({ type: 'MANUAL', message: String(message), ...context });
}

export function logInfo(message, context = {}) {
  addLog({ type: 'INFO', message: String(message), ...context });
}

/* ── Export API ─────────────────────────────────────────────────────────── */
export function getErrorLogs() { return getLogs(); }

export function clearErrorLogs() {
  localStorage.removeItem(LOG_KEY);
}

export function exportErrorLogs() {
  const logs  = getLogs();
  const data  = {
    exported:  new Date().toISOString(),
    appVer:    APP_VER,
    site:      'forjitai.in',
    totalLogs: logs.length,
    logs,
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `forjitai-error-log-${new Date().toISOString().slice(0,10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
  return logs.length;
}

export function getErrorSummary() {
  const logs = getLogs();
  const byType = logs.reduce((acc, l) => {
    acc[l.type] = (acc[l.type] || 0) + 1;
    return acc;
  }, {});
  return {
    total:  logs.length,
    byType,
    latest: logs.slice(-5).reverse(),
  };
}

/* ── Auto-init on import ────────────────────────────────────────────────── */
logInfo('App loaded', { ts: new Date().toISOString() });
