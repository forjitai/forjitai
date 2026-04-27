#!/usr/bin/env python3
"""
OTT Weekly Updater — Run every Thursday before committing.

Usage:
  python3 scripts/update-ott.py

It will:
  1. Print the current week number and JSON filename to create
  2. Show the template to fill in
  3. Update the KNOWN_WEEKS list in public/ott/index.html automatically
"""

import datetime, os, json, re

def get_iso_week():
    today = datetime.date.today()
    iso = today.isocalendar()
    return f"{iso[0]}-W{iso[1]:02d}", today

def get_week_label(year, week):
    # Find Monday of this ISO week
    jan4 = datetime.date(year, 1, 4)
    start = jan4 - datetime.timedelta(days=jan4.weekday()) + datetime.timedelta(weeks=week-1)
    end = start + datetime.timedelta(days=6)
    months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    return f"{start.day} {months[start.month-1]} – {end.day} {months[end.month-1]}, {year}"

week_str, today = get_iso_week()
year, w = int(week_str.split('-W')[0]), int(week_str.split('-W')[1])
label = get_week_label(year, w)
json_path = f"public/ott/releases/{week_str}.json"

print(f"\n{'='*55}")
print(f"  OTT Weekly Updater")
print(f"  Week: {week_str}  ({label})")
print(f"  File: {json_path}")
print(f"{'='*55}\n")

if os.path.exists(json_path):
    print(f"✅ {json_path} already exists.")
    data = json.load(open(json_path))
    print(f"   Contains {len(data['titles'])} titles.")
else:
    # Create template
    template = {
        "week": week_str,
        "label": label,
        "updated": str(today),
        "titles": [
            {
                "title": "Title Here",
                "type": "Film",
                "language": "Hindi",
                "genre": ["Drama"],
                "platform": "Netflix",
                "platform_color": "#E50914",
                "platform_url": "https://www.netflix.com",
                "release_date": str(today + datetime.timedelta(days=(3 - today.weekday()) % 7)),
                "imdb_rating": 7.5,
                "imdb_votes": "5K",
                "rt_score": 80,
                "director": "Director Name",
                "cast": ["Actor 1", "Actor 2"],
                "summary": "Short plot summary here.",
                "duration": "2h 10m",
                "rating_note": "IMDb"
            }
        ]
    }
    os.makedirs("public/ott/releases", exist_ok=True)
    json.dump(template, open(json_path, 'w'), indent=2, ensure_ascii=False)
    print(f"✅ Template created: {json_path}")
    print("   → Fill in the titles array with this week's releases")
    print("   → Platform colors: Netflix=#E50914, Prime=#00A8E1, JioHotstar=#1A56DB")
    print("   →                  ZEE5=#8B0BDE, SonyLIV=#E31837, AppleTV+=#555555")

# Update KNOWN_WEEKS in ott/index.html
ott_index = open("public/ott/index.html").read()

# Extract current weeks list
weeks_match = re.search(r"const KNOWN_WEEKS = \[([^\]]+)\]", ott_index, re.DOTALL)
if weeks_match:
    existing = [w.strip().strip("'\"") for w in weeks_match.group(1).split(',') if w.strip().strip("'\",")]
    if week_str not in existing:
        existing.insert(0, week_str)
        new_weeks = "const KNOWN_WEEKS = [\n" + ",\n".join(f"  '{w}'" for w in existing) + ",\n];"
        ott_index = re.sub(r"const KNOWN_WEEKS = \[[^\]]+\]", new_weeks, ott_index, flags=re.DOTALL)
        open("public/ott/index.html","w").write(ott_index)
        print(f"\n✅ KNOWN_WEEKS updated in ott/index.html → {len(existing)} weeks")

        # Add to week select dropdown
        opt_tag = f'<option value="{week_str}">{label}</option>'
        if opt_tag not in ott_index:
            ott_index = ott_index.replace(
                '</select>',
                f'  {opt_tag}\n    </select>'
            )
            # put latest at top
            print("   → Add <option> manually to week select dropdown if needed")
    else:
        print(f"\n✅ {week_str} already in KNOWN_WEEKS")
else:
    print("\n⚠️  Could not find KNOWN_WEEKS in ott/index.html")

print(f"\n📋 Next steps:")
print(f"   1. Fill in public/ott/releases/{week_str}.json with this week's movies")
print(f"   2. Run: npm run build")
print(f"   3. git add -A && git commit -m 'OTT Week {week_str}' && git push")
print(f"\n Platform colors reference:")
print(f"   Netflix   #E50914    Prime     #00A8E1")
print(f"   Hotstar   #1A56DB    ZEE5      #8B0BDE")
print(f"   SonyLIV   #E31837    AppleTV+  #555555")
print(f"   MX Player #FF6600    Aha       #F5002D\n")
