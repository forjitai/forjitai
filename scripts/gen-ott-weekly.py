#!/usr/bin/env python3
"""
gen-ott-weekly.py
-----------------
Runs every Thursday via GitHub Actions.
Fetches this week's OTT releases for India from TMDB API,
builds the weekly JSON, and updates the KNOWN_WEEKS manifest
in public/ott/index.html.

Requires env var: TMDB_API_KEY
"""

import os, sys, json, re, datetime, requests, time

# ── Config ────────────────────────────────────────────────────────────────────
TMDB_KEY   = os.environ.get("TMDB_API_KEY", "")
TMDB_BASE  = "https://api.themoviedb.org/3"
REGION     = "IN"
LANGUAGE   = "en-IN"
OUT_DIR    = "public/ott/releases"
INDEX_HTML = "public/ott/index.html"

# Platform TMDB provider IDs (India)
PROVIDERS = {
    8:    {"name": "Netflix",      "color": "#E50914", "url": "https://www.netflix.com"},
    119:  {"name": "Prime Video",  "color": "#00A8E1", "url": "https://www.primevideo.com"},
    122:  {"name": "Hotstar",      "color": "#1A56DB", "url": "https://www.jiohotstar.com"},
    232:  {"name": "JioHotstar",   "color": "#1A56DB", "url": "https://www.jiohotstar.com"},
    11:   {"name": "MUBI",         "color": "#222222", "url": "https://mubi.com"},
    237:  {"name": "ZEE5",         "color": "#8B0BDE", "url": "https://www.zee5.com"},
    339:  {"name": "SonyLIV",      "color": "#E31837", "url": "https://www.sonyliv.com"},
    350:  {"name": "Apple TV+",    "color": "#555555", "url": "https://tv.apple.com"},
    192:  {"name": "YouTube",      "color": "#FF0000", "url": "https://www.youtube.com"},
    220:  {"name": "Voot",         "color": "#7B2FBE", "url": "https://www.voot.com"},
    218:  {"name": "Aha",          "color": "#F5002D", "url": "https://www.aha.video"},
}

PRIORITY_PROVIDERS = {8, 119, 122, 232, 237, 339, 350}  # Top platforms first

# ── Helpers ───────────────────────────────────────────────────────────────────
def get_iso_week():
    today = datetime.date.today()
    iso   = today.isocalendar()
    return f"{iso[0]}-W{iso[1]:02d}", today

def get_week_label(year, week_num):
    jan4  = datetime.date(year, 1, 4)
    start = jan4 - datetime.timedelta(days=jan4.weekday()) + datetime.timedelta(weeks=week_num - 1)
    end   = start + datetime.timedelta(days=6)
    months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
    if start.month == end.month:
        return f"{start.day}–{end.day} {months[start.month-1]}, {year}"
    return f"{start.day} {months[start.month-1]} – {end.day} {months[end.month-1]}, {year}"

def tmdb(endpoint, params={}):
    params = {"api_key": TMDB_KEY, "language": LANGUAGE, "region": REGION, **params}
    try:
        r = requests.get(f"{TMDB_BASE}{endpoint}", params=params, timeout=15)
        r.raise_for_status()
        return r.json()
    except Exception as e:
        print(f"  TMDB error {endpoint}: {e}")
        return {}

def get_providers(tmdb_id, media_type):
    """Return the best streaming provider for India."""
    data = tmdb(f"/{media_type}/{tmdb_id}/watch/providers")
    results = data.get("results", {}).get("IN", {})
    flatrate = results.get("flatrate", [])
    if not flatrate:
        return None
    # Prefer priority providers
    for p in flatrate:
        pid = p.get("provider_id")
        if pid in PRIORITY_PROVIDERS and pid in PROVIDERS:
            return PROVIDERS[pid]
    # Fallback to first available
    for p in flatrate:
        pid = p.get("provider_id")
        if pid in PROVIDERS:
            return PROVIDERS[pid]
    return None

def get_details(tmdb_id, media_type):
    """Fetch full details + credits for a title."""
    data = tmdb(f"/{media_type}/{tmdb_id}", {"append_to_response": "credits,release_dates"})
    return data

def safe_str(s):
    return str(s) if s else ""

def build_title_obj(item, media_type, provider):
    """Build a clean title dict from TMDB item data."""
    tmdb_id = item.get("id")

    # Get full details
    details = get_details(tmdb_id, media_type)
    time.sleep(0.25)  # Rate limit courtesy

    # Cast (top 4)
    credits = details.get("credits", {})
    cast = [c["name"] for c in credits.get("cast", [])[:4]]

    # Director
    director = ""
    for crew in credits.get("crew", []):
        if crew.get("job") == "Director":
            director = crew["name"]
            break

    # Genres
    genres = [g["name"] for g in details.get("genres", [])[:3]]

    # Language
    orig_lang = details.get("original_language", "en")
    lang_map  = {
        "hi": "Hindi", "ta": "Tamil", "te": "Telugu", "ml": "Malayalam",
        "kn": "Kannada", "bn": "Bengali", "mr": "Marathi", "pa": "Punjabi",
        "en": "English", "ja": "Japanese (Subtitled)", "ko": "Korean (Subtitled)",
        "es": "Spanish (Subtitled)", "fr": "French (Subtitled)", "de": "German (Subtitled)",
    }
    language = lang_map.get(orig_lang, orig_lang.upper())

    # Rating
    vote_avg   = round(details.get("vote_average", 0), 1)
    vote_count = details.get("vote_count", 0)
    votes_display = f"{vote_count//1000}K" if vote_count >= 1000 else str(vote_count) if vote_count else "Early"

    # Release date
    if media_type == "movie":
        release_date = details.get("release_date", "")
        duration_min = details.get("runtime", 0)
        duration = f"{duration_min//60}h {duration_min%60}m" if duration_min else ""
        title = details.get("title", item.get("title", ""))
        summary = details.get("overview", "")
        title_type = "Film"
        seasons_info = None
        episodes = None
    else:
        release_date = details.get("first_air_date", "")
        duration = ""
        title = details.get("name", item.get("name", ""))
        summary = details.get("overview", "")
        num_seasons = details.get("number_of_seasons", 1)
        num_eps    = details.get("number_of_episodes", 0)
        title_type = "Series"
        seasons_info = f"Season {num_seasons}" if num_seasons == 1 else f"{num_seasons} Seasons"
        episodes = num_eps if num_eps else None

    obj = {
        "title":          title,
        "type":           title_type,
        "language":       language,
        "genre":          genres if genres else ["Drama"],
        "platform":       provider["name"],
        "platform_color": provider["color"],
        "platform_url":   provider["url"],
        "release_date":   release_date,
        "imdb_rating":    vote_avg if vote_avg > 0 else None,
        "imdb_votes":     votes_display,
        "rt_score":       None,
        "director":       director,
        "cast":           cast,
        "summary":        summary[:400] if summary else "Plot details coming soon.",
        "rating_note":    "TMDB" if vote_count > 100 else "Early rating",
    }

    if duration:
        obj["duration"] = duration
    if seasons_info:
        obj["seasons"] = seasons_info
    if episodes:
        obj["episodes"] = episodes

    return obj

def fetch_weekly_releases(week_start, week_end):
    """Fetch movies and TV shows releasing this week on OTT in India."""
    titles = []
    seen_ids = set()

    date_from = week_start.strftime("%Y-%m-%d")
    date_to   = week_end.strftime("%Y-%m-%d")

    print(f"  Fetching movies: {date_from} to {date_to}")

    # ── Movies ────────────────────────────────────────────────────────────────
    for page in range(1, 4):
        data = tmdb("/discover/movie", {
            "with_watch_providers":   "|".join(str(p) for p in PRIORITY_PROVIDERS),
            "watch_region":           REGION,
            "primary_release_date.gte": date_from,
            "primary_release_date.lte": date_to,
            "sort_by":                "vote_average.desc",
            "vote_count.gte":         3,
            "page":                   page,
        })
        results = data.get("results", [])
        if not results:
            break
        for item in results:
            if item["id"] in seen_ids:
                continue
            seen_ids.add(item["id"])
            provider = get_providers(item["id"], "movie")
            if provider:
                print(f"    Movie: {item.get('title')} → {provider['name']}")
                obj = build_title_obj(item, "movie", provider)
                titles.append(obj)
                time.sleep(0.2)
        if page >= data.get("total_pages", 1):
            break

    # ── TV Shows ──────────────────────────────────────────────────────────────
    print(f"  Fetching TV shows...")
    for page in range(1, 4):
        data = tmdb("/discover/tv", {
            "with_watch_providers":        "|".join(str(p) for p in PRIORITY_PROVIDERS),
            "watch_region":                REGION,
            "first_air_date.gte":          date_from,
            "first_air_date.lte":          date_to,
            "sort_by":                     "vote_average.desc",
            "vote_count.gte":              3,
            "page":                        page,
        })
        results = data.get("results", [])
        if not results:
            break
        for item in results:
            if item["id"] in seen_ids:
                continue
            seen_ids.add(item["id"])
            provider = get_providers(item["id"], "tv")
            if provider:
                print(f"    TV: {item.get('name')} → {provider['name']}")
                obj = build_title_obj(item, "tv", provider)
                titles.append(obj)
                time.sleep(0.2)
        if page >= data.get("total_pages", 1):
            break

    # Sort by rating descending
    titles.sort(key=lambda x: x.get("imdb_rating") or 0, reverse=True)

    # Deduplicate by title (keep highest rated)
    seen_titles = set()
    unique = []
    for t in titles:
        key = t["title"].lower().strip()
        if key not in seen_titles:
            seen_titles.add(key)
            unique.append(t)

    return unique[:25]  # Cap at 25 titles per week

def update_manifest(week_str, label):
    """Add week to KNOWN_WEEKS array and select dropdown in ott/index.html."""
    if not os.path.exists(INDEX_HTML):
        print(f"  Warning: {INDEX_HTML} not found, skipping manifest update")
        return

    content = open(INDEX_HTML).read()

    # Update KNOWN_WEEKS array
    weeks_match = re.search(r"const KNOWN_WEEKS = \[([^\]]*)\]", content, re.DOTALL)
    if weeks_match:
        existing_text = weeks_match.group(1)
        existing = [w.strip().strip("'\"") for w in existing_text.split(",") if w.strip().strip("'\",")]
        if week_str not in existing:
            existing.insert(0, week_str)
            new_list = "const KNOWN_WEEKS = [\n" + "".join(f"  '{w}',\n" for w in existing) + "]"
            content = re.sub(r"const KNOWN_WEEKS = \[[^\]]*\]", new_list, content, flags=re.DOTALL)
            print(f"  KNOWN_WEEKS updated → {len(existing)} weeks")

    # Add option to week select dropdown (at top)
    opt = f'<option value="{week_str}">{label}</option>'
    if opt not in content:
        content = content.replace(
            '<select class="week-select" id="weekSelect"',
            f'<select class="week-select" id="weekSelect"'
        )
        # Insert option before first existing option
        content = re.sub(
            r'(<select[^>]*id="weekSelect"[^>]*>)\s*\n',
            f'\\1\n      {opt}\n      ',
            content
        )
        print(f"  Dropdown option added: {opt}")

    open(INDEX_HTML, "w").write(content)

# ── Main ──────────────────────────────────────────────────────────────────────
def main():
    if not TMDB_KEY:
        print("ERROR: TMDB_API_KEY environment variable not set")
        sys.exit(1)

    week_str, today = get_iso_week()
    year     = int(week_str.split("-W")[0])
    week_num = int(week_str.split("-W")[1])
    label    = get_week_label(year, week_num)

    # ISO week: Monday = day 1
    jan4       = datetime.date(year, 1, 4)
    week_start = jan4 - datetime.timedelta(days=jan4.weekday()) + datetime.timedelta(weeks=week_num - 1)
    week_end   = week_start + datetime.timedelta(days=6)

    out_path = os.path.join(OUT_DIR, f"{week_str}.json")

    print(f"\n{'='*55}")
    print(f"  OTT Auto-Update — {week_str} ({label})")
    print(f"  Week: {week_start} to {week_end}")
    print(f"  Output: {out_path}")
    print(f"{'='*55}\n")

    if os.path.exists(out_path):
        existing = json.load(open(out_path))
        existing_count = len(existing.get("titles", []))
        print(f"File already exists with {existing_count} titles.")
        if existing_count >= 5:
            print("Skipping — already has enough data.")
            return
        print("Re-fetching (existing data is thin)...")

    os.makedirs(OUT_DIR, exist_ok=True)

    print("Fetching OTT releases from TMDB...")
    titles = fetch_weekly_releases(week_start, week_end)

    if not titles:
        # Fallback: fetch trending in India for this week
        print("\nNo new releases found — fetching trending India content as fallback...")
        data = tmdb("/trending/all/week", {"region": REGION})
        for item in data.get("results", [])[:15]:
            media_type = item.get("media_type", "movie")
            if media_type not in ("movie", "tv"):
                continue
            provider = get_providers(item["id"], media_type)
            if provider:
                obj = build_title_obj(item, media_type, provider)
                titles.append(obj)
                time.sleep(0.25)
        titles.sort(key=lambda x: x.get("imdb_rating") or 0, reverse=True)

    week_data = {
        "week":    week_str,
        "label":   label,
        "updated": str(today),
        "titles":  titles,
    }

    json.dump(week_data, open(out_path, "w"), indent=2, ensure_ascii=False)
    print(f"\n✅ Written {len(titles)} titles to {out_path}")

    update_manifest(week_str, label)
    print(f"\n✅ Done — Week {week_str} ready.")

if __name__ == "__main__":
    main()
