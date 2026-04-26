/* ─── Forjit AI · IndexedDB layer ───────────────────────────────────────────
 *
 *  Single source of truth for all browser persistence.
 *  Import { dbGet, dbSet, dbClear } wherever needed.
 *
 *  Stores:
 *    errorLog  – caught errors for admin review
 *    history   – generated outputs + repo
 *    feedback  – user ratings
 *    users     – current session + llm_config + visitor_count
 *    uploads   – session file refs (not persisted long-term)
 * ──────────────────────────────────────────────────────────────────────────*/

const DB_NAME    = "forjitai_db";
const DB_VERSION = 1;
const STORES     = ["errorLog", "history", "feedback", "users", "uploads"];

/* ── internal: open (or create) the database ───────────────────────────── */
function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);

    req.onupgradeneeded = () => {
      const db = req.result;
      STORES.forEach((s) => {
        if (!db.objectStoreNames.contains(s))
          db.createObjectStore(s, { keyPath: "key" });
      });
    };

    req.onsuccess = () => resolve(req.result);
    req.onerror  = () => reject(req.error);
  });
}

/* ── read a value ───────────────────────────────────────────────────────── */
export async function dbGet(store, key) {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx  = db.transaction(store, "readonly");
      const req = tx.objectStore(store).get(key);
      req.onsuccess = () => resolve(req.result?.value ?? null);
      req.onerror   = () => resolve(null);
    });
  } catch {
    return null;
  }
}

/* ── write a value ──────────────────────────────────────────────────────── */
export async function dbSet(store, key, value) {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(store, "readwrite");
      tx.objectStore(store).put({ key, value });
      tx.oncomplete = () => resolve(true);
      tx.onerror    = () => resolve(false);
    });
  } catch {
    return false;
  }
}

/* ── clear an entire store ──────────────────────────────────────────────── */
export async function dbClear(store) {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(store, "readwrite");
      tx.objectStore(store).clear();
      tx.oncomplete = () => resolve(true);
      tx.onerror    = () => resolve(false);
    });
  } catch {
    return false;
  }
}
