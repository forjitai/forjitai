#!/usr/bin/env node
/* ─── Forjit AI · OTT Weekly Auto-Updater ────────────────────────────────────
 *
 *  Runs every Thursday via GitHub Actions
 *  Uses TMDB API (free) to fetch India OTT releases for the week
 *  Saves public/ott/releases/YYYY-WXX.json and updates manifest
 *
 *  Required secret: TMDB_API_KEY (free at themoviedb.org/settings/api)
 * ──────────────────────────────────────────────────────────────────────────*/

import { writeFileSync, readFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// ── Validate key ──────────────────────────────────────────────────────────
const TMDB_KEY = process.env.TMDB_API_KEY;
if (!TMDB_KEY) {
  console.warn('⚠️  TMDB_API_KEY not set — skipping OTT update.');
  console.warn('   Fix: Get free key at themoviedb.org/settings/api');
  console.warn('   Then: repo → Settings → Secrets → Actions → New secret → TMDB_API_KEY');
  process.exit(0);
}

// ── Week helpers ─────────────────────────────────────────────────────────
function getISOWeek(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 3 - (d.getDay() + 6) % 7);
  const week1 = new Date(d.getFullYear(), 0, 4);
  return 1 + Math.round(((d - week1) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
}

function getWeekLabel(year, week) {
  // Find Monday of ISO week
  const jan4 = new Date(year, 0, 4);
  const dayOfWeek = jan4.getDay() || 7;
  const monday = new Date(jan4);
  monday.setDate(jan4.getDate() - dayOfWeek + 1 + (week - 1) * 7);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${monday.getDate()} ${months[monday.getMonth()]} – ${sunday.getDate()} ${months[sunday.getMonth()]}, ${year}`;
}

const TODAY = new Date();
const YEAR = TODAY.getFullYear();
const WEEK_NUM = getISOWeek(TODAY);
const WEEK_STR = `${YEAR}-W${String(WEEK_NUM).padStart(2,'0')}`;
const WEEK_LABEL = getWeekLabel(YEAR, WEEK_NUM);
const DATE_STR = TODAY.toISOString().split('T')[0];

console.log(`🎬 OTT Auto-Updater — Week ${WEEK_STR} (${WEEK_LABEL})`);

const OUT_DIR = join(ROOT, 'public/ott/releases');
const OUT_FILE = join(OUT_DIR, `${WEEK_STR}.json`);

if (existsSync(OUT_FILE)) {
  console.log(`✅ ${WEEK_STR}.json already exists — skipping.`);
  process.exit(0);
}

// ── TMDB API helpers ──────────────────────────────────────────────────────
const BASE = 'https://api.themoviedb.org/3';
const HEADERS = { Authorization: `Bearer ${TMDB_KEY}`, 'Content-Type': 'application/json' };

async function tmdb(path, params = {}) {
  const url = new URL(BASE + path);
  url.searchParams.set('language', 'en-IN');
  url.searchParams.set('region', 'IN');
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url.toString(), { headers: HEADERS });
  if (!res.ok) throw new Error(`TMDB ${path}: ${res.status} ${res.statusText}`);
  return res.json();
}

// Platform map: TMDB watch provider ID → our display info
const PLATFORM_MAP = {
  8:   { name: 'Netflix',    color: '#E50914', url: 'https://www.netflix.com' },
  9:   { name: 'Prime Video',color: '#00A8E1', url: 'https://www.primevideo.com' },
  3:   { name: 'JioHotstar', color: '#1A56DB', url: 'https://www.jiohotstar.com' },
  122: { name: 'JioHotstar', color: '#1A56DB', url: 'https://www.jiohotstar.com' },
  892: { name: 'JioHotstar', color: '#1A56DB', url: 'https://www.jiohotstar.com' },
  240: { name: 'ZEE5',       color: '#8B0BDE', url: 'https://www.zee5.com' },
  237: { name: 'SonyLIV',    color: '#E31837', url: 'https://www.sonyliv.com' },
  2:   { name: 'Apple TV+',  color: '#555555', url: 'https://tv.apple.com' },
  192: { name: 'YouTube',    color: '#FF0000', url: 'https://www.youtube.com' },
  350: { name: 'Apple TV+',  color: '#555555', url: 'https://tv.apple.com' },
  11:  { name: 'MX Player',  color: '#FF6600', url: 'https://www.mxplayer.in' },
  639: { name: 'Aha',        color: '#F5002D', url: 'https://www.aha.video' },
};

const KNOWN_PROVIDER_IDS = Object.keys(PLATFORM_MAP).map(Number);

async function getProvidersForTitle(type, id) {
  try {
    const data = await tmdb(`/${type}/${id}/watch/providers`);
    const india = data.results?.IN;
    if (!india?.flatrate) return null;
    for (const p of india.flatrate) {
      if (PLATFORM_MAP[p.provider_id]) return PLATFORM_MAP[p.provider_id];
    }
    return null;
  } catch { return null; }
}

async function getDetails(type, id) {
  try {
    return await tmdb(`/${type}/${id}`, { append_to_response: 'credits,release_dates,content_ratings' });
  } catch { return null; }
}

function getLanguageName(code) {
  const map = { hi: 'Hindi', en: 'English', ta: 'Tamil', te: 'Telugu', ml: 'Malayalam', kn: 'Kannada', mr: 'Marathi', bn: 'Bengali', pa: 'Punjabi', ja: 'Japanese', ko: 'Korean', es: 'Spanish', fr: 'French', de: 'German', it: 'Italian', pt: 'Portuguese', zh: 'Chinese' };
  return map[code] || code?.toUpperCase() || 'Unknown';
}

function formatRuntime(mins) {
  if (!mins) return null;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

async function buildTitleEntry(item, type) {
  const id = item.id;
  const details = await getDetails(type, id);
  const platform = await getProvidersForTitle(type, id);

  if (!platform) return null; // Not on known Indian OTT

  const isMovie = type === 'movie';
  const title = isMovie ? (details?.title || item.title) : (details?.name || item.name);
  const overview = details?.overview || item.overview || '';
  const rating = item.vote_average ? Math.round(item.vote_average * 10) / 10 : null;
  const votes = item.vote_count || 0;
  const lang = getLanguageName(item.original_language);
  const genres = (details?.genres || []).map(g => g.name).slice(0, 3);

  // Cast
  const cast = (details?.credits?.cast || []).slice(0, 4).map(c => c.name);
  const director = isMovie
    ? (details?.credits?.crew || []).find(c => c.job === 'Director')?.name || null
    : null;

  // Release date
  const releaseDate = isMovie
    ? (details?.release_dates?.results?.find(r => r.iso_3166_1 === 'IN')?.release_dates?.[0]?.release_date || details?.release_date || item.release_date)?.split('T')[0]
    : (details?.first_air_date || item.first_air_date);

  const duration = isMovie ? formatRuntime(details?.runtime) : null;
  const seasons = !isMovie ? `Season ${details?.number_of_seasons || 1}` : null;
  const episodes = !isMovie ? (details?.number_of_episodes || null) : null;

  // Type label
  let typeLabel = isMovie ? 'Film' : 'Series';
  if (!isMovie && details?.type === 'Miniseries') typeLabel = 'Mini-Series';

  const voteLabel = votes > 1000 ? `${Math.round(votes/1000)}K` : votes > 0 ? String(votes) : 'Early';

  return {
    title,
    type: typeLabel,
    language: lang,
    genre: genres.length ? genres : ['Drama'],
    platform: platform.name,
    platform_color: platform.color,
    platform_url: platform.url,
    release_date: releaseDate || DATE_STR,
    imdb_rating: rating > 0 ? rating : null,
    imdb_votes: voteLabel,
    rt_score: null,
    director: director || (isMovie ? 'TBA' : null),
    cast,
    summary: overview.slice(0, 300) || 'Description not available.',
    ...(duration ? { duration } : {}),
    ...(seasons ? { seasons } : {}),
    ...(episodes ? { episodes } : {}),
    rating_note: rating ? 'TMDB' : 'Rating pending',
    tmdb_id: id,
  };
}

// ── Main: fetch India trending + new OTT content ──────────────────────────
async function main() {
  console.log('📡 Fetching India OTT releases from TMDB…');

  const titles = [];
  const seen = new Set();

  async function processResults(results, type) {
    for (const item of results) {
      if (seen.has(item.id)) continue;
      seen.add(item.id);
      try {
        const entry = await buildTitleEntry(item, type);
        if (entry && entry.imdb_rating !== null) {
          titles.push(entry);
          console.log(`  ✓ ${entry.title} — ${entry.platform} — ${entry.imdb_rating || 'N/A'}`);
        }
        await new Promise(r => setTimeout(r, 250)); // rate limit
      } catch (e) {
        console.warn(`  ⚠ ${item.title || item.name}: ${e.message}`);
      }
    }
  }

  // 1. Trending this week in India
  const trendingMovies = await tmdb('/trending/movie/week');
  const trendingTV    = await tmdb('/trending/tv/week');
  await processResults(trendingMovies.results || [], 'movie');
  await processResults(trendingTV.results || [], 'tv');

  // 2. Currently streaming in India (movies)
  const nowStreaming = await tmdb('/movie/now_playing');
  await processResults(nowStreaming.results || [], 'movie');

  // 3. Top-rated TV airing now
  const airingTV = await tmdb('/tv/on_the_air');
  await processResults(airingTV.results || [], 'tv');

  // Sort by rating descending
  titles.sort((a, b) => (b.imdb_rating || 0) - (a.imdb_rating || 0));

  // Cap at 15 titles
  const finalTitles = titles.slice(0, 15);

  if (finalTitles.length === 0) {
    console.warn('⚠️  No India OTT titles found — check TMDB_API_KEY and try again.');
    process.exit(0);
  }

  const output = {
    week: WEEK_STR,
    label: WEEK_LABEL,
    updated: DATE_STR,
    source: 'TMDB API (automated)',
    titles: finalTitles,
  };

  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(OUT_FILE, JSON.stringify(output, null, 2));
  console.log(`\n✅ Saved ${finalTitles.length} titles → ${OUT_FILE}`);

  // ── Update KNOWN_WEEKS in ott/index.html ──────────────────────────────
  const ottIndex = join(ROOT, 'public/ott/index.html');
  let html = readFileSync(ottIndex, 'utf8');

  const weeksMatch = html.match(/const KNOWN_WEEKS = \[([^\]]+)\]/s);
  if (weeksMatch) {
    const existing = weeksMatch[1].split(',')
      .map(w => w.trim().replace(/['"]/g, ''))
      .filter(Boolean);
    if (!existing.includes(WEEK_STR)) {
      existing.unshift(WEEK_STR);
      const newList = existing.map(w => `  '${w}'`).join(',\n');
      html = html.replace(/const KNOWN_WEEKS = \[[^\]]+\]/s, `const KNOWN_WEEKS = [\n${newList},\n]`);

      // Also add option to select dropdown
      const optionTag = `<option value="${WEEK_STR}">${WEEK_LABEL}</option>`;
      if (!html.includes(WEEK_STR)) {
        html = html.replace(
          /(<select[^>]*id="weekSelect"[^>]*>)/,
          `$1\n      ${optionTag}`
        );
      }

      writeFileSync(ottIndex, html);
      console.log(`✅ KNOWN_WEEKS updated → ${existing.length} weeks`);
    }
  }

  console.log(`\n🎉 Done! Week ${WEEK_STR} ready.`);
}

main().catch(e => {
  console.error('Fatal error:', e.message);
  process.exit(1);
});
