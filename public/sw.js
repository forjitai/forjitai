// ── Forjit AI Service Worker ──────────────────────────────────────────────
// Strategy: Network-first for HTML pages, Cache-first for static assets
// Cache version auto-busts on every deploy via timestamp
// ─────────────────────────────────────────────────────────────────────────

const CACHE_VERSION = 'forjitai-v1777521043122';
const CACHE_NAME    = CACHE_VERSION;

// Only precache the shell — nothing else
const PRECACHE = ['/'];

// File types to cache after first network fetch (static assets only)
const CACHEABLE_EXTENSIONS = ['.js', '.css', '.woff2', '.woff', '.ttf', '.png', '.svg', '.ico', '.webp'];

// These always go to network — never serve stale
const NETWORK_ONLY_PATTERNS = [
  '/api/',
  'groq.com',
  'openrouter.ai',
  'anthropic.com',
  'pollinations.ai',
  'googletagmanager.com',
  'googlesyndication.com',
  'analytics',
  'teacher-engine.js',   // changes frequently — always fetch fresh
];

// ── Install ───────────────────────────────────────────────────────────────
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting()) // activate immediately
  );
});

// ── Activate — delete ALL old caches ─────────────────────────────────────
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => {
            console.log('[SW] Deleting old cache:', key);
            return caches.delete(key);
          })
      ))
      .then(() => self.clients.claim()) // take control immediately
  );
});

// ── Fetch ─────────────────────────────────────────────────────────────────
self.addEventListener('fetch', (e) => {
  const { request } = e;
  const url = request.url;

  // Skip non-GET
  if (request.method !== 'GET') return;

  // Skip network-only patterns (APIs, analytics, ads)
  if (NETWORK_ONLY_PATTERNS.some(p => url.includes(p))) return;

  const isHTMLPage  = request.headers.get('accept')?.includes('text/html');
  const isAsset     = CACHEABLE_EXTENSIONS.some(ext => url.split('?')[0].endsWith(ext));
  const isOTTData   = url.includes('/ott/releases/');
  const isBlogPost  = url.includes('/blog/posts/');

  if (isHTMLPage) {
    // ── HTML pages: Network-first, fall back to cache ─────────────────
    // This ensures users always get updated pages after a deploy
    e.respondWith(
      fetch(request)
        .then(response => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(c => c.put(request, clone));
          }
          return response;
        })
        .catch(() => caches.match(request).then(c => c || caches.match('/')))
    );

  } else if (isOTTData || isBlogPost) {
    // ── JSON data files: Network-first (always fresh) ─────────────────
    e.respondWith(
      fetch(request)
        .then(response => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(c => c.put(request, clone));
          }
          return response;
        })
        .catch(() => caches.match(request))
    );

  } else if (isAsset) {
    // ── Static assets: Cache-first (JS/CSS/fonts/images) ─────────────
    // These have content hashes in filenames from Vite — safe to cache long
    e.respondWith(
      caches.match(request)
        .then(cached => {
          if (cached) return cached;
          return fetch(request).then(response => {
            if (response.ok) {
              const clone = response.clone();
              caches.open(CACHE_NAME).then(c => c.put(request, clone));
            }
            return response;
          });
        })
    );

  }
  // Everything else: let browser handle normally (no SW intervention)
});

// ── Message: force refresh from app ──────────────────────────────────────
self.addEventListener('message', (e) => {
  if (e.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  if (e.data === 'CLEAR_CACHE') {
    caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k))));
  }
});
