#!/usr/bin/env python3
"""Generate data.js from tour/ markdown (website-builder).
Run: python3 gen_data.py  (writes data.js).

Trip: "From Desert Up to Glaciers — the Loop" — a 16-day guided ADV motorcycle
loop, Almaty -> Almaty (Kazakhstan + Kyrgyzstan), Sep 5-20 2026, ~2,800 km,
rental Suzuki DR650SE, guided by Silk Off Road Tours. Distances are KILOMETRES
site-wide; prices are USD. Source of record: tour/*.md."""
import re, json, glob, os

TOUR = os.path.join(os.path.dirname(__file__), "tour", "destinations")

# id -> (lat, lng, zoom). Curated by website-builder; towns/villages geocoded via the
# Google Geocoding API (key from ~/google_maps.key — never committed), natural features
# cross-checked against OpenStreetMap/Nominatim.
COORDS = {
    "almaty":      (43.23798, 76.88286, 11),  # base — start AND finish of the loop
    "altyn-emel":  (44.15957, 78.75441,  9),  # Basshi village, the park gate (A1)
    "chundzha":    (43.53651, 79.46360, 11),
    "karakol":     (42.47821, 78.39560, 12),  # A2
    "issyk-kul":   (42.16568, 77.44438, 10),  # south-shore yurt camp, Tosor/Tamga (A3)
    "kochkor":     (42.21640, 75.75754, 13),
    "song-kol":    (41.83392, 75.13119, 10),  # A4
    "suusamyr":    (42.17893, 73.96243, 10),
    "bishkek":     (42.87462, 74.56976, 11),
    "cholpon-ata": (42.64854, 77.08275, 12),
    "saty":        (43.06992, 78.40982, 11),  # A5
}

# Destination/gallery order (== file order == route order). "almaty" is the base —
# start AND finish of the loop (type "start"); the other ten stops follow in route order.
ORDER = ["almaty","altyn-emel","chundzha","karakol","issyk-kul","kochkor",
         "song-kol","suusamyr","bishkek","cholpon-ata","saty"]

def md_inline(s):
    """Convert markdown bold/links to HTML."""
    s = re.sub(r"\[([^\]]+)\]\((https?://[^)]+)\)",
               r'<a href="\2" target="_blank" rel="noopener">\1</a>', s)
    s = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", s)  # remaining (relative) md links -> plain text
    s = re.sub(r"\*\*([^*]+)\*\*", r"<b>\1</b>", s)
    s = re.sub(r"\*([^*]+)\*", r"<i>\1</i>", s)
    return re.sub(r"\s+", " ", s).strip()

def plain(s):
    s = re.sub(r"\*\*([^*]+)\*\*", r"\1", s)
    s = re.sub(r"\*([^*]+)\*", r"\1", s)
    s = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", s)
    return re.sub(r"\s+", " ", s).strip()

def sections(text):
    """Split a md file into {header: [lines]} on '## '."""
    out, cur = {}, "_top"
    out[cur] = []
    for line in text.splitlines():
        m = re.match(r"^##\s+(.*)$", line)
        if m:
            cur = m.group(1).strip()
            out[cur] = []
        else:
            out[cur].append(line)
    return out

def parse_dest(path):
    text = open(path, encoding="utf-8").read()
    lines = text.splitlines()
    d = {}
    m = re.match(r"^#\s+(.*)$", lines[0])
    d["name"] = m.group(1).strip()
    d["jp"] = ""   # legacy field kept for template compatibility (unused on this tour)
    # tagline = first blockquote
    for ln in lines:
        if ln.startswith("> "):
            d["tagline"] = plain(ln[2:].strip())
            break
    # front-matter bullets
    def field(label):
        for ln in lines:
            m = re.match(r"^- \*\*%s:?\*\*\s*(.*)$" % re.escape(label), ln)
            if m:
                return m.group(1).strip()
        return ""
    d["region"] = plain(field("Region"))
    d["days"] = plain(field("Itinerary"))
    d["type"] = plain(field("Stop type")).lower()
    ride = ""
    for ln in lines:
        m = re.match(r"^- \*\*Ride to here[^*]*:?\*\*\s*(.*)$", ln)
        if m:
            ride = m.group(1).strip()
            break
    # "NN km (...)" (a "~" prefix is fine); Almaty uses "—" (arrival day) -> 0
    rm = re.search(r"(\d[\d,]*)\s*km", ride)
    d["legKm"] = int(rm.group(1).replace(",", "")) if rm else 0

    secs = sections(text)
    # About -> intro paragraphs (skip blockquotes)
    intro, buf = [], []
    for ln in secs.get("About", []):
        if ln.startswith(">"):
            continue
        if ln.strip() == "":
            if buf:
                intro.append(md_inline(" ".join(buf)))
                buf = []
        else:
            buf.append(ln.strip())
    if buf:
        intro.append(md_inline(" ".join(buf)))
    d["intro"] = intro

    # Things to see & do -> highlights
    hi = []
    for ln in secs.get("Things to see & do", []):
        m = re.match(r"^-\s+(.*)$", ln)
        if m:
            hi.append(md_inline(m.group(1)))
    d["highlights"] = hi

    # What to eat -> food
    food = []
    for ln in secs.get("What to eat", []):
        m = re.match(r"^-\s+(.*)$", ln)
        if not m:
            continue
        body = m.group(1)
        mm = re.match(r"\*\*(.+?)\*\*\s*[—-]\s*(.*)$", body)
        if mm:
            food.append({"n": plain(mm.group(1)), "d": plain(mm.group(2))})
        else:
            food.append({"n": plain(body), "d": ""})
    d["food"] = food

    # Where to stay -> hotels (table: Property | Type | Parking | Price/night (USD) | — | Notes)
    hotels = []
    for ln in secs.get("Where to stay", []):
        if not ln.strip().startswith("|"):
            continue
        cells = [c.strip() for c in ln.strip().strip("|").split("|")]
        if len(cells) < 6:
            continue
        prop = cells[0]
        if prop.lower().startswith("property") or set(prop) <= set("-: "):
            continue
        typ, parking, price, _spare, notes = cells[1], cells[2], cells[3], cells[4], cells[5]
        if prop.startswith("_") or typ == "—":
            hotels.append({"n": plain(prop), "t": "Note", "d": plain(notes)})
        else:
            h = {"n": plain(prop), "t": plain(typ), "d": plain(notes)}
            if parking and parking != "—":
                h["park"] = md_inline(parking)
            if price and price != "—":
                h["price"] = price
            hotels.append(h)
    if not hotels:
        buf = []
        for ln in secs.get("Where to stay", []):
            if ln.strip() == "":
                if buf:
                    break
                continue
            buf.append(ln.strip())
        if buf:
            hotels.append({"n": "No overnight here", "t": "Note", "d": plain(" ".join(buf))})
    d["hotels"] = hotels

    # Links
    links = []
    for ln in secs.get("Links", []):
        m = re.match(r"^-\s+\[([^\]]+)\]\(([^)]+)\)", ln)
        if m:
            links.append({"l": m.group(1).strip(), "u": m.group(2).strip()})
    d["links"] = links

    # Photos
    photos = []
    photo_key = next((k for k in secs if k.startswith("Photos")), None)
    for ln in secs.get(photo_key, []):
        m = re.match(r"^-\s+!\[[^\]]*\]\(([^)]+)\)\s*(?:—\s*(.*))?$", ln)
        if m:
            photos.append({"src": m.group(1).strip(), "cap": plain(m.group(2) or "")})
    d["photos"] = photos
    return d

DESTS = {}
for path in sorted(glob.glob(os.path.join(TOUR, "*.md"))):
    d = parse_dest(path)
    fid = re.match(r"\d+-(.*)\.md", os.path.basename(path)).group(1)
    d["id"] = fid
    lat, lng, zoom = COORDS[fid]
    d["lat"], d["lng"], d["zoom"] = lat, lng, zoom
    DESTS[fid] = d

# ---- helper to pick a verified photo from a destination ----
def P(did, idx):
    ph = DESTS[did]["photos"]
    return ph[idx % len(ph)]["src"]

# Verified English-Wikipedia article URLs (checked via the MediaWiki API — all resolve).
# poi() attaches WIKI[name] as an explicit `wiki` override; everything else falls back
# at render time to a Wikipedia search link via window.wikiLink (always resolves).
WIKI = {
    "Almaty": "https://en.wikipedia.org/wiki/Almaty",
    "Panfilov Park & Zenkov Cathedral": "https://en.wikipedia.org/wiki/Ascension_Cathedral,_Almaty",
    "Kok-Tobe at sunset": "https://en.wikipedia.org/wiki/Kok_Tobe",
    "Medeu": "https://en.wikipedia.org/wiki/Medeu",
    "Altyn-Emel National Park": "https://en.wikipedia.org/wiki/Altyn-Emel_National_Park",
    "The Singing Dune": "https://en.wikipedia.org/wiki/Altyn-Emel_National_Park",
    "Aktau chalk mountains": "https://en.wikipedia.org/wiki/Aktau_Mountains",
    "Katutau lava fields": "https://en.wikipedia.org/wiki/Katutau",
    "Charyn Canyon — the Valley of Castles": "https://en.wikipedia.org/wiki/Charyn_Canyon",
    "Chundzha hot springs": "https://en.wikipedia.org/wiki/Chunja_hot_springs",
    "Kegen & the Karkara border (KZ → KG, clocks +1 h)": "https://en.wikipedia.org/wiki/Kegen",
    "Holy Trinity Church, Karakol": "https://en.wikipedia.org/wiki/Karakol",
    "Jeti-Oguz — the Seven Bulls": "https://en.wikipedia.org/wiki/Jeti-Oguz",
    "Altyn-Arashan track & hot springs": "https://en.wikipedia.org/wiki/Altyn_Arashan",
    "Przhevalsky memorial (optional)": "https://en.wikipedia.org/wiki/Nikolay_Przhevalsky",
    "Barskoon gorge & Gagarin's waterfall": "https://en.wikipedia.org/wiki/Barskoon",
    "First swim in Issyk-Kul": "https://en.wikipedia.org/wiki/Issyk-Kul",
    "Swim, nap, repeat": "https://en.wikipedia.org/wiki/Issyk-Kul",
    "Eagle-hunter farmhouse lunch": "https://en.wikipedia.org/wiki/Hunting_with_eagles",
    "Terskey Alatau coast roads": "https://en.wikipedia.org/wiki/Terskey_Alatoo",
    "Shyrdak felt workshops": "https://en.wikipedia.org/wiki/Shyrdak",
    "Kochkor bazaar — last fuel & ATMs": "https://en.wikipedia.org/wiki/Kochkor",
    "First sight of Song-Kol": "https://en.wikipedia.org/wiki/Song-K%C3%B6l",
    "Kumis & boorsok in the yurts": "https://en.wikipedia.org/wiki/Kumis",
    "Kokomeren gorge": "https://en.wikipedia.org/wiki/K%C3%B6k%C3%B6meren",
    "Suusamyr valley & its honey": "https://en.wikipedia.org/wiki/Suusamyr_Valley",
    "Too-Ashuu Pass & the summit tunnel": "https://en.wikipedia.org/wiki/T%C3%B6%C3%B6_Ashuu",
    "Ala-Too Square": "https://en.wikipedia.org/wiki/Ala-Too_Square",
    "Osh Bazaar": "https://en.wikipedia.org/wiki/Osh_Bazaar",
    "Big-city dinner — plov & the classics": "https://en.wikipedia.org/wiki/Pilaf",
    "The Boom gorge": "https://en.wikipedia.org/wiki/Boom_Gorge",
    "Cholpon-Ata petroglyphs": "https://en.wikipedia.org/wiki/Cholpon-Ata",
    "North-shore beach evening": "https://en.wikipedia.org/wiki/Issyk-Kul",
    "Smoked lake fish on the promenade": "https://en.wikipedia.org/wiki/Issyk-Kul",
    "Around the lake's eastern tip": "https://en.wikipedia.org/wiki/T%C3%BCp",
    "Lake Kaindy (if light allows)": "https://en.wikipedia.org/wiki/Lake_Kaindy",
    "Lake Kaindy & the sunken forest": "https://en.wikipedia.org/wiki/Lake_Kaindy",
    "Kolsai Lake 1 morning walk": "https://en.wikipedia.org/wiki/Kolsay_Lakes_National_Park",
    "Balykchy": "https://en.wikipedia.org/wiki/Balykchy",
    "The DR650 handover & inspection": "https://en.wikipedia.org/wiki/Suzuki_DR650",
    "Bike return & the deposit": "https://en.wikipedia.org/wiki/Suzuki_DR650",
    "Welcome dinner — beshbarmak": "https://en.wikipedia.org/wiki/Beshbarmak",
    "Celebration dinner in Almaty": "https://en.wikipedia.org/wiki/Beshbarmak",
    "33 Parrots Pass switchbacks": "https://en.wikipedia.org/wiki/Kalmak-Ashuu",
    "Life on the jailoo": "https://en.wikipedia.org/wiki/Song-K%C3%B6l",
}

# ============ INTEREST THEMES (tie to tour/00-riders.md + 00-overview.md) ============
# Optional per-POI `it` (interest) tags drive the day.html "day highlights" badges and
# the per-stop badges. Render labels/emoji live in day.html (keep its INTEREST map in
# sync with these keys); here we store keys only.
# Keys (priority/display order): training 🎓 · offroad 🪨 · pass 🏔️ · yurt ⛺ ·
#   nomad 🦅 · food 🍜 · lake 🌊 · desert 🏜️ · canyon 🏞️ · hotspring ♨️ · border 🛂 ·
#   history 🏛️ · wildlife 🐾 · moto 🏍️ · scenic 🌄 · rest 😌
KW = [
 ("training",  ["skills session","training day","off-road stance","gravel braking","sand basics",
                "shakedown","drill","option-selector","suspension sag"]),
 ("offroad",   ["gravel","dirt","piste","off-road","offroad","washboard","doubletrack","rocky",
                "rough track","4x4","single-track","rutted","fords"]),
 ("pass",      [" pass","switchback","hairpin","serpentine","summit tunnel","4,021 m","3,000 m"]),
 ("yurt",      ["yurt","jailoo"]),
 ("nomad",     ["nomad","herder","eagle hunt","berkutchi","kumis","shyrdak","felt","horseback","mare"]),
 ("food",      ["lagman","laghman","plov","beshbarmak","besbarmak","manty","samsa","shashlik","ashlan",
                "boorsok","bazaar","honey","fish","apricot","tea stop","kurut"]),
 ("lake",      ["lake","shore","beach","swim","issyk-kul","song-kol","kolsai","kaindy"]),
 ("desert",    ["desert","dune","steppe","badland","chalk","semi-desert","aktau","katutau","lava"]),
 ("canyon",    ["canyon","gorge","valley of castles"]),
 ("hotspring", ["hot spring","hot-spring","thermal","banya","arashan","soak"]),
 ("border",    ["border","kegen","karkara","passport","clocks"]),
 ("history",   ["museum","petroglyph","cathedral","mosque","church","soviet","monument","bronze age",
                "saka","memorial","explorer","orthodox","tsarist","balbal"]),
 ("wildlife",  ["kulan","gazelle","wildlife","marmot","golden eagle","birdlife","crane","ibex"]),
 ("moto",      ["dr650","handover","bike check","chain","air filter","deposit","support truck","ride leader"]),
 ("scenic",    ["viewpoint","panorama","sunset","glacier","waterfall","peak","alpine","meadow","vista",
                "stars","milky way","golden hour","pasture"]),
 ("rest",      ["rest day","laundry","no riding","nap","sleep in"]),
]

def infer_interests(name, what, slot, explicit):
    """Explicit tags first, then food from a meal slot, then keyword matches; cap 3 (tasteful)."""
    text = (name + " " + (what or "")).lower()
    keys = list(explicit or [])
    if slot in ("lunch", "dinner") and "food" not in keys:
        keys.append("food")
    for key, words in KW:
        if key in keys:
            continue
        if any(w in text for w in words):
            keys.append(key)
    seen = []
    for k in keys:
        if k not in seen:
            seen.append(k)
    return seen[:3]

# ============ DAYS (1..16) ============
# Each: d, date, id (that night's destination), km, dmin (honest ride-time minutes:
# ~65 km/h asphalt, ~35 km/h gravel mixes per the day's character — several legs are
# off Google's road graph, so these are planning estimates, not routed figures),
# rest/training flags, region, title, route, desc, tags, opt (anchor-plan option the
# reference day rides, see SEGMENTS), gfrom/gto/gvia, poi[].
def poi(name, what, q, slot, img=None, wiki=None, it=None):
    p = {"name": name, "what": what, "q": q, "slot": slot}
    if img:
        p["img"] = img
    w = wiki or WIKI.get(name)
    if w:
        p["wiki"] = w   # explicit verified article; else day.html falls back to a Wikipedia search link
    interests = infer_interests(name, what, slot, it)
    if interests:
        p["it"] = interests   # interest-theme keys -> emoji badges in day.html
    return p

DAYS = [
 {"d":1,"date":"Sat Sep 5","id":"almaty","km":0,"rest":False,"region":"Kazakhstan — Almaty",
  "title":"Arrival in Almaty",
  "route":"Airport transfer → DR650 handover & inspection → first look at the city → welcome dinner",
  "desc":"The loop begins the unhurried way. The Silk Off Road Tours crew meets arrivals at Almaty airport (ALA), transfers the group to the hotel, and runs the paperwork and Suzuki DR650SE handover — photograph the bike thoroughly, the USD 500 damage deposit rides on it. With the afternoon free, walk Panfilov Park and the wooden Zenkov Cathedral, graze the Green Bazaar, or ride the cable car up Kok-Tobe for the sunset panorama — 4,000-metre peaks hang over the avenues, a preview of where the tour is headed. The welcome dinner is where 6–10 riders who will share ~2,800 km meet for the first time; order the beshbarmak.",
  "tags":["arrival","food","history"],
  "gfrom":"Almaty, Kazakhstan","gto":"Almaty, Kazakhstan","gvia":"",
  "poi":[poi("The DR650 handover & inspection","Day 1's real business: fit your DR650SE, walk around it with a camera (the deposit conversation later is easier with photos), sort riding gear and the duffel for the support truck, and ask every question now — the steppe has no service bays.","Almaty, Kazakhstan","activity",P("almaty",1),it=["moto"]),
         poi("Panfilov Park & Zenkov Cathedral","Almaty's icon: the candy-colored Ascension (Zenkov) Cathedral, built in 1907 almost entirely of wood, standing in the shady Park of the 28 Panfilov Guardsmen — the single best short walk in the city.","Panfilov Park, Almaty","scenic",P("almaty",0),it=["history"]),
         poi("Green Bazaar","The classic Central Asian market: pyramids of dried fruit and spices, dairy and horse-meat halls, samsa stands, and vendors who insist you try everything. Perfect first-afternoon immersion.","Green Bazaar, Almaty","stop",P("almaty",2),it=["food","history"]),
         poi("Kok-Tobe at sunset","Ride the cable car from the center up to the hilltop park under the TV tower for a full panorama of Almaty against the mountains — welcome-dinner-adjacent timing.","Kok-Tobe, Almaty","scenic",P("almaty",3),it=["scenic"]),
         poi("Welcome dinner — beshbarmak","Kazakhstan's national dish to open the trip: hand-pulled pasta sheets under slow-boiled meat with onion broth, at a proper Kazakh restaurant. The Silk Road Food Trail starts here.","Almaty, Kazakhstan","dinner",P("almaty",5),it=["food"])]},

 {"d":2,"date":"Sun Sep 6","id":"almaty","km":120,"dmin":160,"rest":False,"training":True,
  "region":"Kazakhstan — Almaty foothills",
  "title":"Training Day in the Foothills",
  "route":"Morning skills session (bike setup, off-road stance, gravel braking, sand basics) → easy foothill & steppe loop → back to Almaty",
  "desc":"Morocco-style: before any big leg, a dedicated skills-and-shakedown day. The morning is bike setup — levers, tire pressures, suspension sag — then off-road stance, gravel braking and sand basics on the DR650, re-grooving the habits on an unfamiliar, lighter bike. Then an easy ~120 km foothill-and-steppe loop east of the city to bed it all in and calibrate pace with the ride leader. This day is also the option-selector: the ride leader watches the group through the drills, and that verdict picks the glacier road vs. the coast road, Tosor vs. the Kochkor split, for the days ahead. Dial in the bike and the reflexes while the stakes are low.",
  "tags":["ride","training","offroad"],
  "optNote":"The training day doubles as the <b>option-selector</b> for the flexible anchor plan: the ride leader's verdict on the drills picks the harder or easier route options between the anchors (S3 and S4 especially).",
  "gfrom":"Almaty, Kazakhstan","gto":"Almaty, Kazakhstan","gvia":"Medeu, Almaty|Turgen, Kazakhstan",
  "poi":[poi("Morning skills session","Bike setup first — lever and bar position, tire pressures for mixed surfaces, suspension sag, a full walk-around — then standing position, weighting the pegs, gravel braking front/rear balance, and sand basics: momentum, loose grip, paddling and recovery. Rehearsal for the Singing Dune pistes on Day 4.","Almaty, Kazakhstan","activity",P("almaty",4),it=["training","moto"]),
         poi("Foothill & steppe loop (~120 km)","An easy loop through the foothills and steppe east of the city to settle suspension, luggage and group riding order — the last soft warm-up before the tour rolls out east on Day 3.","Turgen, Kazakhstan","scenic",P("chundzha",0),it=["training","scenic"]),
         poi("Evening gear sort","Back in Almaty by late afternoon: pack the duffel for the support truck (soft bag, 15–20 kg), charge everything, and get the last big-city sleep — tomorrow the steppe starts.","Almaty, Kazakhstan","stop",it=["moto"])]},

 {"d":3,"date":"Mon Sep 7","id":"altyn-emel","km":250,"dmin":230,"rest":False,
  "region":"Kazakhstan — Zhetysu","opt":"S1a",
  "title":"Into the Steppe",
  "route":"Almaty → Konaev → Saryozek → mountain pass & retro-museum tea stop → Altyn-Emel NP (Basshi)",
  "desc":"The first touring day, and it wastes no time getting big. The route runs east out of Almaty onto the open steppe plateau — long, fast tarmac with the Tian Shan wall sliding along the right mirror — then lifts over a proper mountain pass and drops toward the Ili River basin. A mid-ride tea stop at a quirky roadside retro museum breaks up the 250 km before the group rolls into Basshi, the small village at the gate of Altyn-Emel National Park — one of Kazakhstan's largest protected areas at roughly 4,600 km² of desert, badlands and river floodplain. The night is the village guest house: bikes in the walled yard, a home-cooked dinner, and a sky full of stars.",
  "tags":["ride","scenic","desert"],
  "gfrom":"Almaty, Kazakhstan","gto":"Basshi, Kazakhstan","gvia":"Konaev, Kazakhstan|Saryozek, Kazakhstan",
  "poi":[poi("Steppe plateau tarmac","Long, open two-lane across the steppe with the Tian Shan wall on the horizon — the first taste of Kazakh distance, ridden in group formation behind the leader.","Konaev, Kazakhstan","scenic",P("chundzha",1),it=["scenic","desert"]),
         poi("Mountain pass & retro-museum tea stop","The day lifts over a mountain pass toward the Ili basin, with tea and simple plates at a quirky roadside retro museum — the classic operator's halfway break.","Saryozek, Kazakhstan","coffee",it=["pass","food"]),
         poi("Basshi — the park gate","Arrive at the guest-house village at Altyn-Emel's entrance with time to settle in; kulan (Asiatic wild ass) and goitered gazelle graze the plains beyond the last houses. Light permitting, catch golden hour from the edge of the steppe.","Basshi, Kazakhstan","activity",P("altyn-emel",5),it=["wildlife","desert"],wiki="https://en.wikipedia.org/wiki/Altyn-Emel_National_Park")]},

 {"d":4,"date":"Tue Sep 8","id":"chundzha","km":250,"dmin":350,"rest":False,
  "region":"Kazakhstan — Zhetysu / Uyghur District","opt":"S2a",
  "title":"The Singing Dune to the Hot Springs",
  "route":"Altyn-Emel → Singing Dune → Aktau white-and-red mountains → desert pistes → Chundzha; evening at the hot springs",
  "desc":"The tour's desert day proper — the operator's original 250 km leg. Instead of backtracking to the highway, the route leaves Basshi through Altyn-Emel itself: graded dirt, washboard and real sandy doubletrack past the 150-m Singing Dune (climb it barefoot, slide down, make it hum) and the Martian white-and-red Aktau badlands, before dropping south across the Ili basin on empty tarmac to Chundzha, capital of Kazakhstan's Uyghur District. This is the first proper off-tarmac riding of the tour, with the support truck sweeping — and the reward is engineered: a field of 140 thermal springs, outdoor pools at 36–50 °C, and the best lagman in the country. Soak until the desert is out of your gear.",
  "tags":["ride","offroad","desert","hotspring"],
  "gfrom":"Basshi, Kazakhstan","gto":"Chundzha, Kazakhstan","gvia":"Singing Dune, Altyn-Emel|Aktau Mountains, Altyn-Emel",
  "poi":[poi("The Singing Dune","An isolated barchan about 150 m high and 3 km long that produces a deep organ-like hum when dry sand avalanches down its lee face — one of the strangest sounds in Central Asia. Climb the ridge barefoot and set it off.","Singing Dune, Altyn-Emel","activity",P("altyn-emel",0),it=["desert","scenic"]),
         poi("Aktau chalk mountains","Bands of white, cream, red and orange rock folded into gullies and cathedral shapes — an open-air geology lesson roughly 400 million years in the making, best in low morning light.","Aktau Mountains, Altyn-Emel","scenic",P("altyn-emel",2),it=["desert","scenic"]),
         poi("Katutau lava fields","Melted-looking towers and honeycombed outcrops of dark volcanic rock — and the pistes between them are proper DR650 terrain.","Katutau, Altyn-Emel","scenic",P("altyn-emel",4),it=["desert","offroad"]),
         poi("Desert pistes to the Ili basin","Graded dirt, washboard and sand patches through the park, then open near-empty tarmac south across the Ili basin — the Day-2 sand drills earn their keep here. An asphalt alternative exists inside the park if conditions are bad.","Chundzha, Kazakhstan","stop",P("chundzha",1),it=["offroad","desert"]),
         poi("Chundzha hot springs","The perfectly engineered overnight: outdoor thermal pools at 36–50 °C under the open sky, saunas and plunge tubs — exactly what a morning of dune and badland pistes orders, with lagman until you can't.","Chundzha, Kazakhstan","dinner",P("chundzha",4),it=["hotspring","food"])]},

 {"d":5,"date":"Wed Sep 9","id":"karakol","km":280,"dmin":280,"rest":False,
  "region":"KZ → Kyrgyzstan — Issyk-Kul","opt":"S2a",
  "title":"Charyn Canyon & the Border",
  "route":"Chundzha → Charyn Canyon → Kegen/Karkara border (KZ → KG, clocks +1 h) → Karkara valley → Karakol",
  "desc":"The tour's great transition: it starts in Kazakh desert and ends in a Kyrgyz mountain town. Less than an hour from Chundzha comes Charyn Canyon — the Valley of Castles, where 12-million-year-old sandstone has eroded into towers and fortress walls up to ~100 m high; go early for cool air and empty trails. Then the route climbs along the Ketmen range to Kegen and the quiet, summer-friendly Karkara border post — the operator handles the bikes' paperwork, you queue with your passport, and clocks go forward an hour. The descent into Kyrgyzstan is the day's riding reward: open alpine valley, snow peaks of the Terskey Alatau ahead, barely any traffic, and Karakol — the adventure capital — for the evening: the wooden Holy Trinity Church, the nail-less Dungan Mosque, and ashlan-fuu country.",
  "tags":["ride","canyon","border","history"],
  "gfrom":"Chundzha, Kazakhstan","gto":"Karakol, Kyrgyzstan","gvia":"Charyn Canyon|Kegen, Kazakhstan|Karkara border crossing",
  "poi":[poi("Charyn Canyon — the Valley of Castles","A red sandstone gorge where the rock has eroded into towers, arches and fortress walls along a 2-km valley (the canyon runs 150 m+ deep elsewhere). Walk the valley floor to the Charyn River viewpoint before the day-trip crowds arrive.","Charyn Canyon","activity",P("karakol",0),it=["canyon","scenic"]),
         poi("Kegen & the Karkara border (KZ → KG, clocks +1 h)","Kazakhstan → Kyrgyzstan the scenic way: a small seasonal post in the high Karkara valley, all green pasture and yurts. Passports, bike documents, twenty minutes of stamps — and the tour is in country number two. Set your watch: +1 h.","Karkara border crossing","stop",P("karakol",2),it=["border"]),
         poi("Karkara valley descent","Open alpine valley riding down toward Issyk-Kul with the snow wall of the Terskey Alatau ahead and almost no traffic — the sweetest tarmac of the first week.","Karakol, Kyrgyzstan","scenic",it=["scenic","pass"]),
         poi("Holy Trinity Church, Karakol","Karakol's wooden cathedral, rebuilt in 1895 after an earthquake destroyed the original; green domes and golden crosses over log walls, perfect in evening light.","Holy Trinity Cathedral, Karakol","scenic",P("karakol",7),it=["history"]),
         poi("Dungan Mosque","Commissioned in 1904 and built over six years in Chinese pagoda style, held together by joinery on 42 wooden pillars — famously built without a single nail. Still an active mosque; visitors welcome outside prayer times.","Dungan Mosque, Karakol","stop",P("karakol",5),it=["history"])]},

 {"d":6,"date":"Thu Sep 10","id":"karakol","km":110,"dmin":145,"rest":False,
  "region":"Kyrgyzstan — Issyk-Kul",
  "title":"Jeti-Oguz & Altyn-Arashan",
  "route":"Day loop out of Karakol: Jeti-Oguz red cliffs → Altyn-Arashan gorge track & hot springs → Karakol",
  "desc":"A riding day with no packing — the luggage never moves. The morning runs 28 km southwest to Jeti-Oguz, where a wall of sheer red sandstone cliffs — seven ribs of rock said to be seven petrified bulls — rises out of the spruce forest, with easy gravel up the gorge to the Kok-Jaiyk 'Valley of Flowers' meadows. The afternoon is the riding main course: from Ak-Suu village a genuinely rough 4x4/moto track climbs ~14 km up the Arashan river gorge — rocks, ruts, stream splashes, the stuff the DR650 was rented for — to a green valley at ~2,600 m where hot-spring pools steam beside the river below the snow pyramid of Palatka peak. Soak, drink tea at a yurt camp, ride back down — and eat ashlan-fuu at the bazaar for pennies.",
  "tags":["ride","offroad","hotspring","scenic"],
  "optNote":"This is the <b>anchor A2 day loop</b> — Karakol is a two-night anchor precisely so this day rides light: no camp move, no packing, just the Terskey Alatau.",
  "gfrom":"Karakol, Kyrgyzstan","gto":"Karakol, Kyrgyzstan","gvia":"Jeti-Oguz Rocks|Teploklyuchenka (Ak-Suu)|Altyn-Arashan",
  "poi":[poi("Jeti-Oguz — the Seven Bulls","Sheer red sandstone cliffs out of the spruce forest, with the split 'Broken Heart' rock guarding the gorge entrance. Paved to the village, then easy gravel up past the old Soviet spa to the Valley of Flowers meadows — photo stop upon photo stop.","Jeti-Oguz Rocks","scenic",P("karakol",3),it=["scenic","canyon"]),
         poi("Altyn-Arashan track & hot springs","The rough stuff: ~14 km of rocks, ruts and stream splashes up the Arashan gorge to hydrogen-sulfide pools at ~41 °C steaming beside the river at ~2,600 m. Soak, tea at the yurt camp, then ride it all back down. Weather-dependent; the support truck waits at the valley mouth.","Altyn-Arashan","activity",P("karakol",4),it=["offroad","hotspring"]),
         poi("Przhevalsky memorial (optional)","The explorer Nikolai Przhevalsky (of Przewalski's-horse fame) made Karakol his base and is buried above the lake shore nearby — a short detour if the loop comes home with daylight to spare.","Karakol, Kyrgyzstan","stop",it=["history"])]},

 {"d":7,"date":"Fri Sep 11","id":"issyk-kul","km":190,"dmin":295,"rest":False,
  "region":"Kyrgyzstan — Issyk-Kul","opt":"S3a",
  "title":"Up to the Glaciers",
  "route":"Karakol → Barskoon gorge → Sarimonok 3,126 m → Barskoon 3,754 m → Suek Pass 4,021 m → glaciers → Issyk-Kul south shore",
  "desc":"The day the whole tour is named for — and the hardest reference leg. From Karakol the route climbs into the Barskoon gorge and onto the high gravel mining road toward Kumtor, crossing Sarimonok Pass (3,126 m), Barskoon Pass (3,754 m) and finally Suek Pass at 4,021 m — the highest point of the trip, with glaciers hanging beside the road, marmots on the verges and a real chance of snow flurries in any month. Ride it behind the leader; the weather can turn fast. Then the payoff: a 2,400-metre descent from the ice down to a warm, slightly saline lake you can swim in before dinner. Desert-to-glacier-to-beach in a single riding day — and the rest day lands tomorrow for a reason.",
  "tags":["ride","offroad","pass","scenic"],
  "gfrom":"Karakol, Kyrgyzstan","gto":"Tosor, Kyrgyzstan","gvia":"Barskoon, Kyrgyzstan|Barskoon Waterfall|Suek Pass",
  "poi":[poi("Barskoon gorge & Gagarin's waterfall","Spruce forest, granite walls and the famous falls a short walk from the gorge road — Yuri Gagarin holidayed here after his flight, and a monument to him stands among the trees.","Barskoon Waterfall","scenic",P("issyk-kul",2),it=["scenic","canyon"]),
         poi("The three-pass mining road","Hard gravel switchbacks built for the Kumtor gold mine: Sarimonok (3,126 m), then Barskoon (3,754 m) — altitude discipline from here up: hydrate, layer, easy throttle.","Barskoon Pass","stop",P("issyk-kul",1),it=["pass","offroad"]),
         poi("Suek Pass — 4,021 m","The roof of the tour: glacier tongues at arm's length above the road, thin cold air, and the whole Terskey Alatau falling away behind. Photos, a few minutes of grinning, then the 2,400 m descent begins.","Suek Pass","scenic",it=["pass","scenic"]),
         poi("First swim in Issyk-Kul","The camp is steps from a pebble beach; the mildly salty 'warm lake' — the world's second-largest alpine lake, and it never freezes — is genuinely swimmable. The classic way to wash off a 4,000-metre day (sandals: the pebbles are sharp).","Tosor, Kyrgyzstan","activity",P("issyk-kul",0),it=["lake"]),
         poi("Yurt-camp evening","Sunset over the water with the Kungey Alatau glowing pink across the lake, dinner in the communal yurt, and a sky full of stars once the generator goes off.","Tosor, Kyrgyzstan","dinner",P("issyk-kul",3),it=["yurt","scenic"])]},

 {"d":8,"date":"Sat Sep 12","id":"issyk-kul","km":0,"rest":True,
  "region":"Kyrgyzstan — Issyk-Kul south shore",
  "title":"Rest Day at the Lake",
  "route":"No riding — lake swim, Skazka canyon walk, banya, laundry, bike checks, a long lunch",
  "desc":"The one full no-riding day of the tour, placed deliberately: it lands immediately after the 4,021 m Suek day, sits at lake altitude (~1,600 m) to aid acclimatization between the 4,000 m crossing and the 3,000 m nights at Song-Kol, and opens a maintenance window before the hard Days 9–12 block. Sleep in, swim off the camp's pebble beach, walk the red-rock Skazka (Fairy Tale) canyon, book the banya with the hosts, hand a laundry bag to the crew and give the mechanic time with your DR650 — chain, spokes, air filter after the dusty mining road. This is part of the acclimatization plan, not a luxury.",
  "tags":["rest","lake"],
  "gfrom":"Tosor, Kyrgyzstan","gto":"Tosor, Kyrgyzstan","gvia":"",
  "poi":[poi("Swim, nap, repeat","Zero kilometres. Sleep in, swim off the camp's beach, read on the pebbles, walk the shore — deliberate recovery before the passes to Song-Kol, Suusamyr and Bishkek.","Tosor, Kyrgyzstan","activity",P("issyk-kul",0),it=["rest","lake"]),
         poi("Skazka (Fairy Tale) Canyon","Eroded red-and-orange rock formations a short hop along the south-shore road — a quick, photogenic leg-stretch that needs walking shoes, not riding boots.","Skazka Canyon","scenic",it=["canyon","scenic"]),
         poi("Banya afternoon","The south-shore camps and nearby Tamga guest houses can fire up a steam bath — the definitive fix for a week of riding shoulders; book it in the morning, small cash cost.","Tamga, Kyrgyzstan","activity",it=["hotspring","rest"]),
         poi("Laundry & bike checks","Hand a bag to the support crew for washing and let the mechanic work through the DR650 — chain, tyres, air filter — so the bike starts the Song-Kol block as fresh as you do.","Tosor, Kyrgyzstan","stop",it=["moto","rest"]),
         poi("Horseback to a jailoo (optional)","Camps arrange half-day horse treks up to a nearby summer pasture with a local horseman — a gentle preview of Song-Kol's herding world. Agree the price first (typically $10–15/hour).","Tosor, Kyrgyzstan","activity",P("issyk-kul",3),it=["nomad","yurt"])]},

 {"d":9,"date":"Sun Sep 13","id":"kochkor","km":200,"dmin":215,"rest":False,
  "region":"Kyrgyzstan — Naryn","opt":"S4a",
  "title":"South Shore & the Eagle Hunters",
  "route":"Issyk-Kul south shore → Terskey Alatau roads → farmhouse lunch with an eagle-hunting family → Kochkor",
  "desc":"A lakeshore-and-farmland day along the Terskey Alatau front range, hugging Issyk-Kul's quiet coast before bending southwest into the Kochkor valley. The set-piece comes en route: lunch at the farmhouse of a family of hereditary berkutchi — eagle hunters — who fly and live with golden eagles as their fathers and grandfathers did, and will show you how a five-kilo bird is trained, hooded and carried on horseback. Kochkor itself is an unpolished, thoroughly real herders' market town at ~1,800 m: shyrdak felt-carpet cooperatives, a working bazaar, and the last hot shower, phone signal and reliable ATMs before the yurts of Song-Kol.",
  "tags":["ride","nomad","food"],
  "gfrom":"Tosor, Kyrgyzstan","gto":"Kochkor, Kyrgyzstan","gvia":"Bokonbayevo, Kyrgyzstan|Balykchy, Kyrgyzstan",
  "poi":[poi("Terskey Alatau coast roads","Tarmac and good gravel under the front range, with the lake on the right and 4,000-metre snow on the left — easy, flowing riding after the rest day.","Bokonbayevo, Kyrgyzstan","scenic",P("kochkor",3),it=["scenic","lake"]),
         poi("Eagle-hunter farmhouse lunch","The Day-9 highlight: a country spread at a berkutchi dynasty's home near the south shore, with the golden eagles brought out after lunch. Hunting with eagles here is a living tradition, not a show — bring small som notes if you'd like to tip.","Bokonbayevo, Kyrgyzstan","lunch",P("kochkor",0),it=["nomad","wildlife","food"]),
         poi("Shyrdak felt workshops","Kochkor's women's cooperatives demonstrate how shyrdak — the brilliantly coloured, mosaic-stitched felt carpets on UNESCO's Intangible Heritage list — are cut, layered and sewn; small pieces pack fine on a bike.","Kochkor, Kyrgyzstan","activity",P("kochkor",1),it=["nomad","history"]),
         poi("Kochkor bazaar — last fuel & ATMs","Stock up on water, snacks, som and fuel: these are the last reliable ATMs and pumps before Song-Kol, and there is nothing to buy at the lake. The animal-and-produce bazaar is liveliest in the morning.","Kochkor, Kyrgyzstan","stop",P("kochkor",2),it=["food","moto"])]},

 {"d":10,"date":"Mon Sep 14","id":"song-kol","km":130,"dmin":175,"rest":False,
  "region":"Kyrgyzstan — Naryn","opt":"S4a",
  "title":"Switchbacks to Song-Kol",
  "route":"Kochkor → 33 Parrots Pass 3,133 m switchbacks → Song-Kol Lake (3,016 m) among the nomad herders",
  "desc":"A short day with a big centrepiece: the '33 Parrots' pass — a stack of tight hairpin switchbacks winding up the mountain wall out of the Kochkor valley, gravel in the upper reaches, with the whole valley unrolling behind (the nickname comes from a beloved Soviet cartoon — count the bends). Over the top the road turns to dirt across open pasture and Song-Kol appears, impossibly blue against the yellow-green grass: Kyrgyzstan's highest large lake at 3,016 m, ringed by jailoo summer pastures where nomad families graze thousands of horses exactly as their great-grandparents did. The night is a herders' yurt camp — kumis, boorsok, and a Milky Way bright enough to cast shadows. It is cold here even in summer; if weather closes the pass, the group falls back to the Kyzart village eco-hotel.",
  "tags":["ride","offroad","pass","yurt","nomad"],
  "gfrom":"Kochkor, Kyrgyzstan","gto":"Song-Kul Lake, Kyrgyzstan","gvia":"Kalmak-Ashuu (33 Parrots) Pass",
  "poi":[poi("33 Parrots Pass switchbacks","A wall of numbered hairpins climbing out of the Kochkor valley to 3,133 m, gravel in the upper reaches — take it at your own pace behind the leader, and stop at the top for the valley shot.","Kalmak-Ashuu (33 Parrots) Pass","scenic",P("song-kol",3),it=["pass","offroad"]),
         poi("First sight of Song-Kol","Over the top the road turns to dirt across open pasture and the lake appears — 29 km by 18 km of glass-clear water in a treeless bowl of grass so wide the horizon curves.","Song-Kul Lake, Kyrgyzstan","scenic",P("song-kol",0),it=["lake","scenic"]),
         poi("Life on the jailoo","Walk between the yurts: mares milked at dusk, foals tethered in lines, kids herding sheep on horseback. Guests are welcome to help with the animals — just ask your hosts. Most camps will saddle a horse for a shore ride ($10–15/hour, agree first).","Song-Kul Lake, Kyrgyzstan","activity",P("song-kol",1),it=["nomad","yurt"]),
         poi("Kumis & boorsok in the yurts","Fermented mare's milk — mildly fizzy, sour, faintly alcoholic — and fried dough pillows with kaymak and jam, offered to every guest. A small bowl is polite; it's the toll for the view.","Song-Kul Lake, Kyrgyzstan","dinner",P("song-kol",2),it=["food","nomad"]),
         poi("The night sky at 3,016 m","Zero light pollution: step out of the yurt around midnight and the Milky Way is bright enough to cast shadows. Bring every layer you own — frost is possible in any month.","Song-Kul Lake, Kyrgyzstan","scenic",it=["scenic","yurt"])]},

 {"d":11,"date":"Tue Sep 15","id":"suusamyr","km":240,"dmin":360,"rest":False,
  "region":"Kyrgyzstan — Naryn / Chüy","opt":"S5a",
  "title":"Passes to Suusamyr",
  "route":"Song-Kol → rocky off-road descent → Moldo-Ashuu 3,546 m → Kara-Keche 3,384 m → Kokomeren gorge → Suusamyr valley",
  "desc":"The most demanding riding day of the tour — 240 km, most of it off the asphalt. From Song-Kol the route drops off the plateau on a rocky off-road descent, climbs the switchbacks of Moldo-Ashuu Pass (3,546 m), then takes the gravel coal road over Kara-Keche Pass (3,384 m) — built to serve the open-cast mine that heats half of Kyrgyzstan — before following the boiling turquoise Kokomeren river gorge out into the open. The reward is the Suusamyr valley: a 150-km grass sea at ~2,200 m, the largest alpine pasture in Central Asia, famous for its white wildflower honey. The night is a cabin camp ringed by panoramic mountains: real beds, hot food, and a well-earned rest. No heroics on the rocky descents — a dropped DR650 is a deposit conversation.",
  "tags":["ride","offroad","pass","scenic"],
  "gfrom":"Song-Kul Lake, Kyrgyzstan","gto":"Suusamyr, Kyrgyzstan","gvia":"Moldo-Ashuu Pass|Kara-Keche Pass|Kyzyl-Oi, Kyrgyzstan",
  "poi":[poi("Moldo-Ashuu Pass — 3,546 m","A ladder of gravel switchbacks with the whole Song-Kol plateau falling away behind — the classic photo stop of Day 11. Loose surface; ride it patiently.","Moldo-Ashuu Pass","scenic",P("suusamyr",2),it=["pass","offroad"]),
         poi("Kara-Keche coal road — 3,384 m","A working mining road past the open-cast coal pits; expect the occasional loaded truck and give it room. The grades are honest and the views enormous.","Kara-Keche Pass","stop",it=["pass","offroad"]),
         poi("Kokomeren gorge","The wild blue-green Kokomeren river crashes through a bare rock canyon alongside the road — one of Kyrgyzstan's most dramatic stretches of gravel riding.","Kyzyl-Oi, Kyrgyzstan","scenic",P("suusamyr",1),it=["canyon","offroad"]),
         poi("Suusamyr valley & its honey","Out into the grass sea: herds drifting home, shepherd camps trailing smoke, and roadside apiaries selling the valley's famous white honey by the jar — the best edible souvenir of the whole route.","Suusamyr, Kyrgyzstan","activity",P("suusamyr",0),it=["scenic","food"]),
         poi("Cabin camp under the ranges","Twin-share cabins with real beds and panoramic mountains on every side — kuurdak, shorpo and bread for dinner (cash; dinners are on the rider).","Suusamyr, Kyrgyzstan","dinner",P("suusamyr",3),it=["food","scenic"])]},

 {"d":12,"date":"Wed Sep 16","id":"bishkek","km":153,"dmin":140,"rest":False,
  "region":"Kyrgyzstan — Chüy / Bishkek","opt":"S5a",
  "title":"Too-Ashuu & the Capital",
  "route":"Suusamyr → Too-Ashuu Pass 3,200 m (~4 km summit tunnel) → long descent → Bishkek",
  "desc":"Short but memorable. From Suusamyr the road climbs to Too-Ashuu Pass (3,200 m) and punches through the mountain in its famous ~4-km summit tunnel — cold, dark and unforgettable on a motorcycle: visor up, lights on — then hairpins down nearly two and a half vertical kilometres into the Chüy valley, alpine pasture turning to poplar-lined farmland in under an hour. Bishkek is Central Asia's most relaxed capital: leafy Soviet-boned blocks, Ala-Too Square, the working Osh Bazaar, and — after nearly two weeks of steppe and passes — hot water, espresso and the tour's big-city dinner night. Plov at Navat, the famous laghman at Cafe Faiza, or the Supara yurt-village splurge; toast the first 2,000 km.",
  "tags":["ride","pass","food","history"],
  "gfrom":"Suusamyr, Kyrgyzstan","gto":"Bishkek, Kyrgyzstan","gvia":"Too-Ashuu Pass",
  "poi":[poi("Too-Ashuu Pass & the summit tunnel","The last of the big western passes at 3,200 m; the ~4 km tunnel is narrow, dim and fume-y — visor up, lights on — and the burst of light on the Chüy side opens onto a 2,500 m descent of hairpins that deserves fresh attention, not end-of-block autopilot.","Too-Ashuu Pass","scenic",P("bishkek",3),it=["pass","moto"]),
         poi("Ala-Too Square","The ceremonial heart of the capital: the national flag on its giant mast, the equestrian Manas monument, fountains, and the hourly changing of the guard — with the State History Museum's white monolith behind.","Ala-Too Square, Bishkek","activity",P("bishkek",0),it=["history"]),
         poi("Osh Bazaar","Bishkek's big working bazaar: pyramids of spices, dried fruit, kurut, horse-meat sausage and cheap kalpak hats — the best souvenir sweep of the tour. Watch pockets in the crowds.","Osh Bazaar, Bishkek","stop",P("bishkek",2),it=["food","history"]),
         poi("Big-city dinner — plov & the classics","The one mid-tour city night: proper plov and beshbarmak at Navat's carved-wood teahouse, the legendary hand-pulled laghman at Cafe Faiza, or refined Kyrgyz cooking at the Supara Ethno-Complex — and Kyrgyzstan's pioneering craft brewery, Save the Ales, for the toast.","Bishkek, Kyrgyzstan","dinner",P("bishkek",1),it=["food"])]},

 {"d":13,"date":"Thu Sep 17","id":"cholpon-ata","km":261,"dmin":240,"rest":False,
  "region":"Kyrgyzstan — Chüy / Issyk-Kul","opt":"S5a",
  "title":"Boom Gorge to the North Shore",
  "route":"Bishkek → Boom (Boam) gorge → Issyk-Kul north shore → Cholpon-Ata; afternoon at the petroglyph field",
  "desc":"The loop's recovery day: 261 km of honest asphalt east from Bishkek, funnelling through the Boom gorge — the red-rock canyon of the Chüy river that is the only natural gate between the capital's valley and the Issyk-Kul basin (watch the gusty wind where it opens toward Balykchy) — before the lake spreads blue on the right for the last 100 km. Cholpon-Ata is the sunny, sandy resort side of Issyk-Kul, and its cultural showpiece sits just uphill: a 'stone garden' of some 5,000 glacial boulders over 42 hectares, carved with ibex, deer and horsemen — Bronze Age to Saka to Turkic. Go in the late-afternoon side light, then swim off the town beach and eat smoked lake fish on the promenade while the sun drops behind the mountains across the water.",
  "tags":["ride","scenic","history","lake"],
  "gfrom":"Bishkek, Kyrgyzstan","gto":"Cholpon-Ata, Kyrgyzstan","gvia":"Boom Gorge|Balykchy, Kyrgyzstan",
  "poi":[poi("The Boom gorge","The Chüy river's red-walled canyon carries the road and railway side by side out of the capital's valley — after days of gravel passes, flowing tarmac feels like a gift.","Boom Gorge","scenic",P("cholpon-ata",5),it=["canyon","scenic"]),
         poi("North-shore lake road","Balykchy, then 100 km of shoreline riding with the Kungey Alatau behind and — across the water — the Terskey Alatau the tour crossed at 4,021 m on Day 7.","Balykchy, Kyrgyzstan","stop",P("cholpon-ata",4),it=["lake","scenic"]),
         poi("Cholpon-Ata petroglyphs","Marked paths through 42 hectares of carved boulders with the lake below: ibex, deer, hunting scenes and balbal stone figures, from the end of the Bronze Age (~1500 BC) through the Saka-Usun tribes to the Turkic era. Small cash entry fee.","Cholpon-Ata Petroglyphs","activity",P("cholpon-ata",0),it=["history"]),
         poi("North-shore beach evening","The classic Cholpon-Ata program: a swim off the sandy town beach, the white chapels of Ruh Ordo along the shore, and shashlik smoke drifting down the promenade.","Ruh Ordo, Cholpon-Ata","activity",P("cholpon-ata",3),it=["lake"]),
         poi("Smoked lake fish on the promenade","The north-shore staple: whole fried or hot-smoked Issyk-Kul fish with bread, herbs and a squeeze of lemon — the best simple dinner on the lake. Cards work in the bigger places; still carry som.","Cholpon-Ata, Kyrgyzstan","dinner",P("cholpon-ata",2),it=["food","lake"])]},

 {"d":14,"date":"Fri Sep 18","id":"saty","km":325,"dmin":340,"rest":False,
  "region":"KG → Kazakhstan — Almaty Region","opt":"S5a",
  "title":"Karkara & Back into Kazakhstan",
  "route":"Cholpon-Ata → Tüp → Karkara valley → Karkara/Kegen border (KG → KZ, clocks −1 h) → Saty; evening Lake Kaindy if light allows",
  "desc":"The longest day of the tour closes the international chapter. From Cholpon-Ata the route runs east along the north shore, rounds Issyk-Kul's eastern tip at Tüp, and climbs back into the high Karkara valley — the same green border pastures crossed nine days earlier, now in the opposite direction. Stamped back into Kazakhstan (clocks go back an hour — a free hour of daylight), the road drops through Kegen and turns up a mountain valley to Saty, the one-street village of log houses and haystacks that is base camp for Kolsai Lakes National Park. Fill the tanks around Kegen: Saty has no reliable station. If the light holds, the evening ride is the strangest sight of the trip — Lake Kaindy's drowned spruce forest, up a ~12 km rough track. Otherwise it opens Day 15.",
  "tags":["ride","border","lake"],
  "gfrom":"Cholpon-Ata, Kyrgyzstan","gto":"Saty, Kazakhstan","gvia":"Tüp, Kyrgyzstan|Karkara border crossing|Kegen, Kazakhstan",
  "poi":[poi("Around the lake's eastern tip","North-shore tarmac through Tüp and up into the Karkara valley's open pastures — yurts, herds and snow peaks all still exactly where you left them on Day 5.","Tüp, Kyrgyzstan","scenic",P("cholpon-ata",2),it=["lake","scenic"]),
         poi("Karkara border, reversed (KG → KZ, clocks −1 h)","The same quiet post, run the other way: the operator handles the bikes, you queue with your passport, and Kazakhstan hands back an hour of daylight for the Saty leg. Cash only in the border area.","Karkara border crossing","stop",P("karakol",2),it=["border"]),
         poi("Fuel at Kegen","Brim the DR650 here — Saty has no reliable station, and with the Kaindy and Kolsai detours the next sure fuel is on the Shelek road tomorrow, right at the tank's range.","Kegen, Kazakhstan","coffee",it=["moto"]),
         poi("Saty village evening","Cows coming home at dusk, kids on horseback, hay wagons on the one street. Walk it end to end; it takes fifteen minutes and it's the last quiet of the trip.","Saty, Kazakhstan","activity",P("saty",5),it=["scenic"]),
         poi("Lake Kaindy (if light allows)","A ~12 km rough, rocky piste — fords, ruts, proper DR650 terrain — climbs to the lake where bleached spruce trunks stand dead-straight out of turquoise water, preserved since the 1911 earthquake dammed the valley.","Lake Kaindy","scenic",P("saty",0),it=["offroad","lake"])]},

 {"d":15,"date":"Sat Sep 19","id":"almaty","km":300,"dmin":280,"rest":False,
  "region":"Kazakhstan — Almaty Region / Almaty","opt":"S6a",
  "title":"Kolsai Lakes & the Run Home",
  "route":"Morning walk to Kolsai Lake-1 (and Kaindy if missed) → Saty → Shelek → Almaty; celebration dinner",
  "desc":"The finale earns its early alarm. Fifteen minutes up the valley from Saty lies Kolsai Lake 1 (~1,800 m): a kilometre-long ribbon of blue-green water pinned between steep spruce slopes — the 'pearls of the Tian Shan', with boardwalk paths and rowboats by the hour. If Kaindy was missed on arrival, its sunken forest comes first, before the day-trip crowds. Then the bikes point home: down the mountain valley, out through Shelek and across the steppe to Almaty — ~300 km, closing the loop exactly where it opened sixteen days ago. The evening is the celebration dinner: bikes and deposits handed back at the guarded lot, one final long table, beshbarmak, toasts, and 2,800 km worth of stories.",
  "tags":["ride","scenic","lake","food"],
  "gfrom":"Saty, Kazakhstan","gto":"Almaty, Kazakhstan","gvia":"Kolsai Lake 1|Shelek, Kazakhstan",
  "poi":[poi("Kolsai Lake 1 morning walk","The first of the three Kolsai lakes: a kilometre of blue-green water up to ~80 m deep between forested ridges, with boardwalk paths, rowboats for rent and trout in the water. The higher lakes are hiking and horse territory beyond the road.","Kolsai Lake 1","activity",P("saty",2),it=["lake","scenic"]),
         poi("Lake Kaindy & the sunken forest","If missed on Day 14: dozens of Schrenk's spruce trunks standing dead-straight out of turquoise water at ~2,000 m — a lake created overnight when the 1911 Kebin earthquake dammed the gorge. Walk the rim trail down to the shore, then point the bikes at Almaty.","Lake Kaindy","scenic",P("saty",1),it=["lake","offroad"]),
         poi("The Shelek road run","Down the valley and out across the steppe: Saty → Shelek → Almaty on flowing tarmac, the Tian Shan wall now on the left mirror — the loop closing itself.","Shelek, Kazakhstan","stop",it=["scenic","moto"]),
         poi("Celebration dinner in Almaty","The loop's last evening: dusty DR650s and deposits handed back at the hotel's guarded lot, then one final long table — beshbarmak, toasts, and 2,800 km worth of stories.","Almaty, Kazakhstan","dinner",P("almaty",5),it=["food","moto"])]},

 {"d":16,"date":"Sun Sep 20","id":"almaty","km":0,"rest":False,"region":"Kazakhstan — Almaty",
  "title":"Departure",
  "route":"Bike return wrap-up → airport transfer to Almaty (ALA) → fly home",
  "desc":"Airport transfers and goodbyes. The bikes went back last night; today is the included transfer to Almaty International Airport (ALA) and the flight home — with the mountains still hanging over the avenues exactly where they were on Day 1. Sixteen days, two countries, two border crossings, one 4,021-metre pass, three yurt-camp nights and ~2,800 km: from desert up to glaciers, and back to the start.",
  "tags":["departure"],
  "gfrom":"Almaty, Kazakhstan","gto":"Almaty, Kazakhstan","gvia":"",
  "poi":[poi("Bike return & the deposit","Final paperwork with the crew: the DR650 checked over, the USD 500 damage deposit settled (this is where the Day-1 photos pay off), and the duffel back off the support truck.","Almaty, Kazakhstan","stop",it=["moto"]),
         poi("Last look at the mountains","If the flight is late, one more espresso in the center or a last ride up Kok-Tobe — the Zailiysky Alatau makes a good final frame.","Kok-Tobe, Almaty","scenic",P("almaty",3),it=["scenic"]),
         poi("Airport transfer (ALA)","The operator's transfer to Almaty International Airport is included — allow for traffic, and keep the passport handy for the exit stamp collection: two borders and two airports' worth.","Almaty, Kazakhstan","activity",it=["border"])]},
]

# ============ ANCHORS & SEGMENTS (the flexible anchor-point plan) ============
# Source: tour/03-anchors-and-options.md. Five fixed, pre-booked anchor nights (A1–A5)
# + the Almaty base; each pair of anchors is connected by route OPTIONS trading
# difficulty and pace. The 16-day itinerary is the reference line (the (a) options).
# Distances marked est(imate) are planned estimates for non-reference options.
ANCHORS = [
 {"a":"A1","id":"altyn-emel","name":"Altyn-Emel National Park","nights":"1 night — Basshi guest house","days":"Day 3",
  "why":"The Singing Dune and the white-and-red Aktau mountains: the Kazakh desert-steppe signature of the trip, and the terrain the DR650 was rented for."},
 {"a":"A2","id":"karakol","name":"Karakol","nights":"2 nights — Jeti-Oguz / Altyn-Arashan day loop on day two","days":"Days 5–6",
  "why":"The Tian Shan trailhead town: Jeti-Oguz red cliffs, the Altyn-Arashan gorge and hot springs, the Holy Trinity Church and Dungan Mosque, ashlan-fuu at the bazaar. A riding day with no packing."},
 {"a":"A3","id":"issyk-kul","name":"Issyk-Kul south shore yurt camp","nights":"2 nights, mid-trip","days":"Days 7–8","rest":True,
  "why":"The rest-day anchor — the one full no-riding day of the tour: lake swim, Skazka canyon, banya, laundry, bike checks. Placed to recover after the hardest connection and acclimatize between the high passes."},
 {"a":"A4","id":"song-kol","name":"Song-Kol Lake yurt camp (3,016 m)","nights":"1 night (bad-weather fallback: Kyzart village eco-hotel)","days":"Day 10",
  "why":"The nomad heart of Kyrgyzstan — yurts, herders, kumis and boorsok at 3,000 m. No version of this trip skips Song-Kol."},
 {"a":"A5","id":"saty","name":"Saty / Kolsai Lakes","nights":"1 night — Saty guest house","days":"Day 14",
  "why":"Lake Kaindy's sunken forest and Kolsai Lake-1 — Kazakhstan's alpine finale before the run home."},
]

# ============ GEO (routing points, "lat,lng") ============
# Towns/villages geocoded via the Google Geocoding API; natural features and passes
# cross-checked against OSM/Nominatim. "Sarimonok Pass" is a planning approximation
# on the Barskoon mining road (the leg is off Google's road graph anyway).
GEO = {
 "Almaty, Kazakhstan":"43.23798,76.88286",
 "Panfilov Park, Almaty":"43.25858,76.95341",
 "Green Bazaar, Almaty":"43.26423,76.95475",
 "Kok-Tobe, Almaty":"43.23310,76.97553",
 "Medeu, Almaty":"43.15762,77.05846",
 "Turgen, Kazakhstan":"43.39837,77.59422",
 "Assy-Turgen Observatory":"43.22567,77.87174",
 "Bartogay Reservoir":"43.34944,78.50361",
 "Konaev, Kazakhstan":"43.86137,77.06352",
 "Saryozek, Kazakhstan":"44.35975,77.96399",
 "Basshi, Kazakhstan":"44.15957,78.75441",
 "Altyn-Emel National Park":"44.12987,78.85057",
 "Singing Dune, Altyn-Emel":"43.86573,78.56178",
 "Aktau Mountains, Altyn-Emel":"44.03720,79.29509",
 "Katutau, Altyn-Emel":"43.99693,79.04980",
 "Chundzha, Kazakhstan":"43.53651,79.46360",
 "Charyn Canyon":"43.35987,79.05003",
 "Kokpek, Kazakhstan":"43.44821,78.67462",
 "Kegen, Kazakhstan":"43.01687,79.22483",
 "Karkara border crossing":"42.80154,79.18217",
 "Karkara, Kazakhstan":"42.89201,79.23666",
 "Karakol, Kyrgyzstan":"42.47821,78.39560",
 "Jeti-Oguz Rocks":"42.33778,78.23151",
 "Teploklyuchenka (Ak-Suu)":"42.50221,78.52158",
 "Altyn-Arashan":"42.38157,78.60667",
 "Dungan Mosque, Karakol":"42.49737,78.39069",
 "Holy Trinity Cathedral, Karakol":"42.48909,78.39469",
 "Barskoon, Kyrgyzstan":"42.15465,77.59560",
 "Barskoon Waterfall":"42.00999,77.60762",
 "Sarimonok Pass":"41.95000,77.62000",
 "Barskoon Pass":"41.89357,77.69207",
 "Suek Pass":"41.78102,77.76056",
 "Tosor, Kyrgyzstan":"42.16568,77.44438",
 "Tosor Pass":"41.94750,77.36833",
 "Tamga, Kyrgyzstan":"42.15000,77.54475",
 "Skazka Canyon":"42.15475,77.35194",
 "Bokonbayevo, Kyrgyzstan":"42.11718,76.99311",
 "Balykchy, Kyrgyzstan":"42.46136,76.18552",
 "Kochkor, Kyrgyzstan":"42.21640,75.75754",
 "Kyzart, Kyrgyzstan":"42.03013,74.98225",
 "Kalmak-Ashuu (33 Parrots) Pass":"41.91430,75.42118",
 "Song-Kul Lake, Kyrgyzstan":"41.83392,75.13119",
 "Moldo-Ashuu Pass":"41.66863,75.03657",
 "Kara-Keche Pass":"41.74213,74.84804",
 "Chaek, Kyrgyzstan":"41.93312,74.53603",
 "Kyzyl-Oi, Kyrgyzstan":"41.95549,74.15629",
 "Suusamyr, Kyrgyzstan":"42.17893,73.96243",
 "Too-Ashuu Pass":"42.34528,73.80694",
 "Bishkek, Kyrgyzstan":"42.87462,74.56976",
 "Ala-Too Square, Bishkek":"42.87571,74.60367",
 "Osh Bazaar, Bishkek":"42.87497,74.57024",
 "Boom Gorge":"42.58048,75.80468",
 "Cholpon-Ata, Kyrgyzstan":"42.64854,77.08275",
 "Cholpon-Ata Petroglyphs":"42.66063,77.05674",
 "Ruh Ordo, Cholpon-Ata":"42.64898,77.09438",
 "Tüp, Kyrgyzstan":"42.74060,78.79295",
 "Saty, Kazakhstan":"43.06992,78.40982",
 "Kolsai Lake 1":"42.93539,78.32590",
 "Lake Kaindy":"42.98408,78.46738",
 "Shelek, Kazakhstan":"43.60105,78.25607",
}

def G(*names):
    """Build a [lat,lng] chain from GEO point names (for SEGMENTS option map lines)."""
    out = []
    for n in names:
        lat, lng = GEO[n].split(",")
        out.append([float(lat), float(lng)])
    return out

SEGMENTS = [
 {"seg":"S1","from":"almaty","to":"altyn-emel","title":"Almaty → Altyn-Emel (A1)",
  "options":[
   {"id":"S1a","name":"Steppe Classic","reference":True,"refDays":"Day 3","days":1,"km":250,"est":False,
    "difficulty":"easy","diffLabel":"easy–moderate",
    "adv":{"cls":1,"peak":2,"raw":"ADV Class 1 (Novice/Green), Class 2 (Basic/Yellow) only on the last graded gravel into Basshi."},
    "surface":"Tarmac with a mountain pass — a gentle opener the day after training.",
    "highlights":["First taste of open steppe","Mountain-pass warm-up","Retro-museum tea stop"],
    "via":[],
    "geo":G("Almaty, Kazakhstan","Konaev, Kazakhstan","Saryozek, Kazakhstan","Basshi, Kazakhstan")},
   {"id":"S1b","name":"Assy Plateau Traverse","reference":False,"days":1,"km":280,"est":True,
    "difficulty":"hard","diffLabel":"hard, weather-dependent",
    "adv":{"cls":3,"peak":4,"raw":"ADV Class 3 (Moderate/Orange), peaks Class 4 (Difficult/Red) on the Turgen-side track and anywhere after rain."},
    "surface":"Up the Turgen gorge on a rough, badly degraded track (4WD-grade), across the high gravel plateau at ~2,500–2,750 m past the observatory, then dirt down past Bartogay. Turns greasy and can close in rain — only for a group that sails through the Day-2 session.",
    "highlights":["High summer-pasture plateau","Assy-Turgen observatory at 2,750 m","Bartogay reservoir","Real off-road on day one of the route proper"],
    "via":[],
    "geo":G("Almaty, Kazakhstan","Turgen, Kazakhstan","Assy-Turgen Observatory","Bartogay Reservoir","Kokpek, Kazakhstan","Basshi, Kazakhstan")},
  ]},
 {"seg":"S2","from":"altyn-emel","to":"karakol","title":"Altyn-Emel → Karakol (A2)",
  "options":[
   {"id":"S2a","name":"Hot Springs & the Canyon","reference":True,"refDays":"Days 4–5","days":2,"km":530,"est":False,
    "difficulty":"moderate","diffLabel":"moderate",
    "adv":{"cls":2,"peak":3,"raw":"ADV Class 2 (Basic/Yellow) peaking Class 3 (Moderate/Orange) in the sand on the park day; Class 1–2 (Novice–Basic) on the border day."},
    "surface":"Desert pistes and sand patches through the park (asphalt alternative inside the park if conditions are bad), then a mostly-tarmac border day.",
    "highlights":["The Singing Dune & Aktau ridden en route","Evening soak at the Chundzha hot springs","Charyn Canyon","The quiet Kegen/Karkara border (+1 h)","Laghman country in the Uyghur District"],
    "via":["chundzha"],
    "geo":G("Basshi, Kazakhstan","Singing Dune, Altyn-Emel","Aktau Mountains, Altyn-Emel","Chundzha, Kazakhstan","Charyn Canyon","Kegen, Kazakhstan","Karkara border crossing","Karakol, Kyrgyzstan")},
   {"id":"S2b","name":"Canyon Direct","reference":False,"days":1,"km":430,"est":True,
    "difficulty":"moderate","diffLabel":"easy–moderate but long","frees":"Frees 1 day → an extra anchor night (A2/A3) or weather buffer",
    "adv":{"cls":1,"peak":None,"raw":"ADV Class 1 (Novice/Green) — tarmac-forward all day; the challenge is saddle time, not the surface."},
    "surface":"Tarmac-forward all day; the challenge is saddle time and the border queue. Honestly trades the full dune/Aktau piste day and the hot springs for a freed day.",
    "highlights":["Charyn Canyon with more time on-site","A full extra day banked for the anchors"],
    "via":[],
    "geo":G("Basshi, Kazakhstan","Kokpek, Kazakhstan","Charyn Canyon","Kegen, Kazakhstan","Karkara border crossing","Karakol, Kyrgyzstan")},
  ]},
 {"seg":"S3","from":"karakol","to":"issyk-kul","title":"Karakol → Issyk-Kul south shore (A3)",
  "options":[
   {"id":"S3a","name":"The Glacier Road","reference":True,"refDays":"Day 7","days":1,"km":190,"est":False,
    "difficulty":"hard","diffLabel":"hard — the toughest reference day",
    "adv":{"cls":2,"peak":3,"raw":"ADV Class 2 (Basic/Yellow) touching Class 3 (Moderate/Orange) on the upper switchbacks: the \"hard\" is altitude and weather, not terrain, and snow bumps it a full class."},
    "surface":"Hard gravel up Barskoon gorge over Sarimonok 3,126 m, Barskoon 3,754 m and Suek 4,021 m, past glaciers, then down to the lake. High-altitude, cold, weather-dependent — the rest day lands immediately after for a reason.",
    "highlights":["The 4,021 m high point of the tour","Glaciers at arm's length","The Barskoon waterfalls"],
    "via":[],
    "geo":G("Karakol, Kyrgyzstan","Barskoon, Kyrgyzstan","Barskoon Waterfall","Sarimonok Pass","Barskoon Pass","Suek Pass","Barskoon Pass","Barskoon Waterfall","Barskoon, Kyrgyzstan","Tamga, Kyrgyzstan","Tosor, Kyrgyzstan")},
   {"id":"S3b","name":"The Coast Road","reference":False,"days":1,"km":130,"est":True,
    "difficulty":"easy","diffLabel":"easy",
    "adv":{"cls":1,"peak":None,"raw":"Paved / ADV Class 1 (Novice/Green) on the spurs — mostly south-shore tarmac."},
    "surface":"South-shore tarmac along the lake with short, optional dirt spurs. The honest trade: no glaciers, no 4,000 m — the named bail-out if the group or the weather says no to Suek.",
    "highlights":["A second look at Jeti-Oguz from the road","Skazka canyon done en route instead of on the rest day","Lakeside villages"],
    "via":[],
    "geo":G("Karakol, Kyrgyzstan","Jeti-Oguz Rocks","Barskoon, Kyrgyzstan","Tamga, Kyrgyzstan","Tosor, Kyrgyzstan")},
  ]},
 {"seg":"S4","from":"issyk-kul","to":"song-kol","title":"Issyk-Kul south shore → Song-Kol (A4)",
  "options":[
   {"id":"S4a","name":"Eagle Hunters & 33 Parrots","reference":True,"refDays":"Days 9–10","days":2,"km":330,"est":False,
    "difficulty":"moderate","diffLabel":"moderate",
    "adv":{"cls":2,"peak":3,"raw":"ADV Class 2 (Basic/Yellow), peaks Class 3 (Moderate/Orange) on the loose hairpin insides and the meadow two-track to camp."},
    "surface":"Tarmac and good gravel along the Terskey Alatau, then the 33 Parrots (3,133 m) gravel switchbacks up to the lake. Reference = split with a Kochkor overnight; can also run as 1 long day (~270 km, estimate) to free a day.",
    "highlights":["Farmhouse lunch with an eagle-hunting family","Kochkor's felt workshops","The switchback climb","First sight of Song-Kol"],
    "via":["kochkor"],
    "geo":G("Tosor, Kyrgyzstan","Skazka Canyon","Bokonbayevo, Kyrgyzstan","Balykchy, Kyrgyzstan","Kochkor, Kyrgyzstan","Kalmak-Ashuu (33 Parrots) Pass","Song-Kul Lake, Kyrgyzstan")},
   {"id":"S4b","name":"Tosor Pass Direttissima","reference":False,"days":1,"km":110,"est":True,
    "difficulty":"hard","diffLabel":"hard — the hardest riding of the tour",
    "adv":{"cls":4,"peak":5,"raw":"ADV Class 4 (Difficult/Red), peaks Class 5 (Severe/Black) if the upper fords run high or snow lies near the top: the terrain ceiling of the entire tour."},
    "surface":"Straight up over Tosor Pass (3,893 m) on exceptionally rough high-alpine gravel/single-track: fords, rock steps, mud, possible snow near the top even in September; steep loose descent, then west to the lake. Strong-group, good-weather-window only. Skips the eagle hunters and Kochkor — the trade is culture for terrain.",
    "highlights":["The wildest pass of the trip","Near-zero traffic","The direct herders' line from shore to plateau"],
    "via":[],
    "geo":G("Tosor, Kyrgyzstan","Tosor Pass") + [[41.78,76.60],[41.76,75.90],[41.80,75.35]] + G("Song-Kul Lake, Kyrgyzstan")},
  ]},
 {"seg":"S5","from":"song-kol","to":"saty","title":"Song-Kol → Saty / Kolsai (A5)",
  "options":[
   {"id":"S5a","name":"Grand Western Loop","reference":True,"refDays":"Days 11–14","days":4,"km":979,"est":False,
    "difficulty":"hard","diffLabel":"one hard off-road day, then moderate-to-easy tarmac",
    "adv":{"cls":3,"peak":4,"raw":"ADV Class 3 (Moderate/Orange) on the off-road day, peaks Class 4 (Difficult/Red) on the Moldo-Ashuu rocky descent; the two tarmac days are Paved, the Karkara gravel Class 2 (Basic/Yellow)."},
    "surface":"One hard rocky off-road day (the Song-Kol descent, Moldo-Ashuu 3,546 m and Kara-Keche 3,384 m), then Too-Ashuu's tunnel and descent, the Boom gorge, north-shore lake roads and the Karkara valley gravel to the border.",
    "highlights":["Suusamyr's vast pasture","Bishkek's big-city night","The Cholpon-Ata petroglyphs","Smoked lake fish on the north shore","The Karkara valley"],
    "via":["suusamyr","bishkek","cholpon-ata"],
    "geo":G("Song-Kul Lake, Kyrgyzstan","Moldo-Ashuu Pass","Kara-Keche Pass","Chaek, Kyrgyzstan","Kyzyl-Oi, Kyrgyzstan","Suusamyr, Kyrgyzstan","Too-Ashuu Pass","Bishkek, Kyrgyzstan","Boom Gorge","Balykchy, Kyrgyzstan","Cholpon-Ata, Kyrgyzstan","Tüp, Kyrgyzstan","Karkara border crossing","Karkara, Kazakhstan","Kegen, Kazakhstan","Saty, Kazakhstan")},
   {"id":"S5b","name":"North Shore Direct","reference":False,"days":2,"km":575,"est":True,
    "difficulty":"moderate","diffLabel":"moderate then easy","frees":"Frees 2 days → extra anchor nights (A3/A4) and/or the Song-Kol/Suek weather buffer",
    "adv":{"cls":2,"peak":3,"raw":"ADV Class 2 (Basic/Yellow) on the descent (Class 3 when greasy after rain), then Paved."},
    "surface":"The Kalmak-Ashuu track down (the best-graded of all the Song-Kol accesses — maintained gravel, greasy after rain), then tarmac around the lake's east end and along the north shore; the reference Day-14 leg to Saty. The trade: no Suusamyr, no Too-Ashuu, no Bishkek.",
    "highlights":["Still gets the petroglyphs and the fish stands","Two full days banked for anchors or weather"],
    "via":["cholpon-ata"],
    "geo":G("Song-Kul Lake, Kyrgyzstan","Kalmak-Ashuu (33 Parrots) Pass","Kochkor, Kyrgyzstan","Balykchy, Kyrgyzstan","Cholpon-Ata, Kyrgyzstan","Tüp, Kyrgyzstan","Karkara border crossing","Karkara, Kazakhstan","Kegen, Kazakhstan","Saty, Kazakhstan")},
  ]},
 {"seg":"S6","from":"saty","to":"almaty","title":"Saty → Almaty (base)",
  "note":"Option (b) is a flagged stop, not a separate route: groups with time and energy can add the <b>Charyn “Moon Canyon” viewpoint</b> off the Shelek road — worthwhile if Day 5 rushed Charyn.",
  "options":[
   {"id":"S6a","name":"Kolsai Morning & the Run Home","reference":True,"refDays":"Day 15","days":1,"km":300,"est":False,
    "difficulty":"easy","diffLabel":"easy",
    "adv":{"cls":1,"peak":3,"raw":"ADV Class 1–2 (Novice–Basic); the Kaindy jeep track is the exception at Class 3 (Moderate/Orange)."},
    "surface":"The Kaindy access track in the morning (rough but short), then tarmac Saty → Shelek → Almaty.",
    "highlights":["The walk to Kolsai Lake-1","Lake Kaindy if missed on arrival","The celebration dinner in Almaty"],
    "via":[],
    "geo":G("Saty, Kazakhstan","Kolsai Lake 1","Saty, Kazakhstan","Kokpek, Kazakhstan","Shelek, Kazakhstan","Almaty, Kazakhstan")},
  ]},
]

# ============ ADV SCALE (Bret Tkacs ADV Skill Rating System — terrain classes) ============
# https://brettkacs.com/adv-skill-rating-system/ — the five terrain classes the tour's
# ratings use (tour/04-roads.md "The rating system"). Baseline is Tkacs' own: a mid-size+
# near-stock ADV bike with partial luggage — exactly this tour (DR650SE, bags in the
# truck). Colors follow the system's green/yellow/orange/red/black flags, tuned for the
# site's dark palette: Class 5 "Black" is rendered as a legible pale slate on dark bg.
# Standing caveat from the road guide: rain or snow bumps any high-pass day a full class.
ADVSCALE = {
 "1": {"name":"Novice",    "flag":"Green",  "color":"#5fb35f", "hint":"graded gravel"},
 "2": {"name":"Basic",     "flag":"Yellow", "color":"#e8c545", "hint":"packed sand · washboard"},
 "3": {"name":"Moderate",  "flag":"Orange", "color":"#f0a830", "hint":"ruts, soft gravel, sand patches, switchbacks"},
 "4": {"name":"Difficult", "flag":"Red",    "color":"#e3493b", "hint":"loose rock, deep gravel, mud, snow"},
 "5": {"name":"Severe",    "flag":"Black",  "color":"#cfcbe0", "hint":"dirt-bike terrain"},
}

# ============ SILK ROAD FOOD TRAIL (lunches & dinners are excluded — by design) ============
# The trip's signature foodie thread from tour/00-overview.md: every meal is a local
# pick across Kazakh, Kyrgyz, Uyghur and Dungan cooking. Rendered as a themed section
# on index.html (cards deep-link to day.html?d=N) and as a per-day callout on the
# matching day pages. Photos reuse the verified destination thumbnails (HTTP 200).
import urllib.parse as _up
def _gmaps(q):
    return "https://www.google.com/maps/search/?api=1&query=" + _up.quote(q)

def _fph(did, i):
    ph = DESTS[did]["photos"]
    return ph[i % len(ph)]["src"]

FOOD_TRAIL = {
 "title": "The Silk Road Food Trail",
 "subtitle": "lunches & dinners are excluded — by design",
 "intro": "Lunches and dinners are on the rider, which is a feature: the route doubles as a food tour of Kazakh, Kyrgyz, Uyghur and Dungan cooking. Beshbarmak in Almaty, the benchmark laghman in the Uyghur District, Karakol's cold ashlan-fuu, kumis and boorsok in the Song-Kol yurts, plov in Bishkek, and smoked lake fish on Issyk-Kul's north shore — six can't-miss stops along the loop.",
 "note": "<b>Notes:</b> roadside staples — manty from the café steamers, samsa from tandyr ovens, and shashlik judged by its smoke — fill the days in between. Carry som/tenge in cash: most trail stops take no cards. Budget ≈ USD 25–35/day (café lunch $3–6, good dinner $8–15).",
 "bookend": "",
 "stops": [
   {"n":1,"day":1,"slot":"dinner","city":"Almaty","pref":"Kazakhstan","style":"Beshbarmak — the welcome dinner",
    "styleDesc":"The national dish of both countries: boiled meat (often horse in Kazakhstan) over broad hand-cut noodles with onion broth. Order it at a proper Kazakh restaurant tonight — it doesn't travel to guest-house kitchens as grandly as this.",
    "shop":"A proper Kazakh restaurant, city center","shopUrl":_gmaps("beshbarmak restaurant Almaty"),"shopNote":"the welcome-dinner order",
    "alts":[{"l":"Green Bazaar horse-meat stalls","u":_gmaps("Green Bazaar Almaty")}],
    "photo":_fph("almaty",5)},
   {"n":2,"day":4,"slot":"dinner","city":"Chundzha","pref":"Uyghur District, KZ","style":"Laghman — the real thing",
    "styleDesc":"Chundzha is in the Uyghur heartland, and hand-pulled laghman here is the benchmark: chewy noodles slapped out to order under a fiery meat, pepper and celery sauce — eaten between rounds in the hot pools.",
    "shop":"Uyghur café at the resort strip","shopUrl":_gmaps("lagman Chundzha Shonzhy"),"shopNote":"order it where the noodles are pulled to order",
    "alts":[{"l":"Manty & samsa at the bazaar","u":_gmaps("bazaar Shonzhy Kazakhstan")},{"l":"Shashlik by the pool","u":_gmaps("hot springs resort Chundzha")}],
    "photo":_fph("chundzha",4)},
   {"n":3,"day":6,"slot":"lunch","city":"Karakol","pref":"Kyrgyzstan","style":"Ashlan-fuu at the bazaar",
    "styleDesc":"Karakol's own dish and a point of civic pride: a cold, spicy Dungan bowl of noodles and wobbly starch jelly in vinegar-chili broth, sold for pennies at the cafés around the bazaar — practically an ashlan-fuu alley. Mandatory, ideally with a fried piroshki.",
    "shop":"Karakol bazaar ashlan-fuu stalls","shopUrl":_gmaps("ashlan-fuu Karakol bazaar"),"shopNote":"pennies a bowl, best in town",
    "alts":[{"l":"Dungan family dinner (book ahead)","u":"https://destinationkarakol.com/"},{"l":"Boso (fried) lagman","u":_gmaps("lagman Karakol")}],
    "photo":_fph("karakol",5)},
   {"n":4,"day":10,"slot":"dinner","city":"Song-Kol","pref":"Kyrgyzstan · 3,016 m","style":"Kumis & boorsok in the yurts",
    "styleDesc":"Fermented mare's milk and fried dough pillows offered in the herders' yurts, with kaymak cream and apricot jam. Accepting a bowl is the polite (and memorable) thing to do — dinner is whatever the family cooks, and it's exactly right at 3,000 m.",
    "shop":"The herders' yurt camp","shopUrl":_gmaps("Song-Kul Lake Kyrgyzstan"),"shopNote":"cash only — there is nothing to buy at the lake",
    "alts":[{"l":"Shorpo & fresh noodles at the camp","u":_gmaps("Song-Kul yurt camp")}],
    "photo":_fph("song-kol",2)},
   {"n":5,"day":12,"slot":"dinner","city":"Bishkek","pref":"Kyrgyzstan","style":"Plov & the big-city classics",
    "styleDesc":"The one mid-tour city night: proper kazan-cooked plov, beshbarmak and samsa at Navat's carved-wood teahouse — with the famous hand-pulled laghman at Cafe Faiza and craft beer at Save the Ales as the supporting cast.",
    "shop":"Navat","shopUrl":_gmaps("Navat Bishkek"),"shopNote":"the easy, excellent group dinner",
    "alts":[{"l":"Cafe Faiza (laghman)","u":_gmaps("Cafe Faiza Bishkek")},{"l":"Supara Ethno-Complex","u":_gmaps("Supara Ethno Complex Bishkek")},{"l":"Save the Ales","u":_gmaps("Save the Ales Bishkek")}],
    "photo":_fph("bishkek",2)},
   {"n":6,"day":13,"slot":"dinner","city":"Cholpon-Ata","pref":"Issyk-Kul north shore","style":"Smoked lake fish on the promenade",
    "styleDesc":"The Issyk-Kul classic: whole fried or hot-smoked fish sold along both shores — the north-shore stands around Cholpon-Ata are the definitive stop, with bread, herbs, lemon and shashlik smoke drifting down the beachfront.",
    "shop":"North-shore fish stands","shopUrl":_gmaps("smoked fish Cholpon-Ata"),"shopNote":"pick the stand with the queue",
    "alts":[{"l":"Shashlik on the promenade","u":_gmaps("shashlik Cholpon-Ata promenade")}],
    "photo":_fph("cholpon-ata",2)},
 ],
}

# Attach a compact foodTrail marquee list to the matching DAYS for the day-page callout.
FOOD_BY_DAY, TRAIL_CIDS = {}, set()
for st in FOOD_TRAIL["stops"]:
    FOOD_BY_DAY.setdefault(st["day"], []).append(
        {"style": st["style"], "shop": st["shop"], "shopUrl": st["shopUrl"],
         "city": st["city"], "slot": st["slot"]})
for _d in DAYS:
    if _d["d"] in FOOD_BY_DAY:
        _d["foodTrail"] = FOOD_BY_DAY[_d["d"]]

# ============ DAILY GUIDES (optional per-day food + activity research) ============
# The local-guide agent may write tour/daily-guides/day-NN.md files, each carrying a
# fenced ```json block: {d, title, overnight, schedule, todo[], meals[]}. We attach the
# meals as `eats` (grouped by slot) and the todo as `localTodo` onto the matching
# window.DAYS entry (match on `d`). Days with no guide get no `eats`. None written yet.
GUIDES = os.path.join(os.path.dirname(__file__), "tour", "daily-guides")
_PICK_KEYS = ["name", "cuisine", "cuisine_note", "rating", "why", "kid", "map", "photo"]

def parse_guide(path):
    text = open(path, encoding="utf-8").read()
    m = re.search(r"```json\s*\n(.*?)\n```", text, re.S)
    if not m:
        return None
    return json.loads(m.group(1))

def clean_pick(p):
    o = {}
    for k in _PICK_KEYS:
        if k in p and p[k] not in (None, ""):
            o[k] = p[k]
    return o

GUIDE_BY_D = {}
for _gpath in sorted(glob.glob(os.path.join(GUIDES, "day-*.md"))):
    _g = parse_guide(_gpath)
    if _g is not None and "d" in _g:
        GUIDE_BY_D[int(_g["d"])] = _g

DAY_BY_D = {d["d"]: d for d in DAYS}
for _dnum, _g in sorted(GUIDE_BY_D.items()):
    _day = DAY_BY_D.get(_dnum)
    if not _day:
        continue
    _eats = []
    for _meal in _g.get("meals", []):
        _picks = [clean_pick(p) for p in _meal.get("picks", [])]
        if not _picks:
            continue
        for _p in _picks:   # flag picks that are a Food Trail marquee/alternative shop
            _cm = re.search(r"cid=(\d+)", _p.get("map", "") or "")
            if _cm and _cm.group(1) in TRAIL_CIDS:
                _p["trail"] = True
        _eats.append({"slot": _meal.get("slot", ""), "area": _meal.get("area", ""), "picks": _picks})
    if _eats:
        _day["eats"] = _eats
    _todo = []
    for _t in _g.get("todo", []):
        _todo.append({"time": _t.get("time", ""), "name": _t.get("name", ""),
                      "what": _t.get("what", ""), "map": _t.get("map", "")})
    if _todo:
        _day["localTodo"] = _todo

# ============ THE ROADS (tour/04-roads.md — the per-day riding-quality record) ============
# The tour-expert's road guide: per riding day a Surface split, a one-line Character,
# a Bret Tkacs ADV terrain-class rating, 1–2 prose paragraphs and verified Commons road
# photos. Folded into window.DAYS[n] as `road`: {surface, character, rating, paras[],
# photos[{src, alt, cap}]} — absent for days without an entry (Days 1 & 16). day.html
# renders "The Road" section from it and index.html derives the timeline surface hints.
# Fails loudly on a day-number mismatch or a missing ADV-rating bullet.
ROADS_MD = os.path.join(os.path.dirname(__file__), "tour", "04-roads.md")

def adv_rating(raw):
    """Parse a Tkacs ADV-rating line -> {raw, cls, peak}.
    cls  = the TYPICAL terrain class named first (0 for 'Paved — no ADV rating'
           and 'No riding' days); peak = the higher class the text also names
    (peaks/touching/brief/exception phrasing), or None. Defensive: any 'Class N'
    mention is captured; a line with no class and no paved/no-riding marker fails."""
    nums = [int(x) for x in re.findall(r"Class\s+(\d)", raw)]
    if not nums and not re.search(r"paved|no riding", raw, re.I):
        raise SystemExit("tour/04-roads.md: unparseable ADV rating line: %r" % raw)
    cls = nums[0] if nums else 0
    higher = [x for x in nums[1:] if x > cls]
    return {"raw": raw, "cls": cls, "peak": max(higher) if higher else None}

def parse_roads(path):
    text = open(path, encoding="utf-8").read()
    parts = re.split(r"^##\s+Day\s+(\d+)\s+—.*$", text, flags=re.M)
    out = {}
    for i in range(1, len(parts), 2):
        n, body = int(parts[i]), parts[i + 1]
        road = {}
        m = re.search(r"^-\s+\*\*Surface:\*\*\s*(.*)$", body, re.M)
        road["surface"] = plain(m.group(1)) if m else ""
        m = re.search(r"^-\s+\*\*Character:\*\*\s*(.*)$", body, re.M)
        road["character"] = plain(m.group(1)) if m else ""
        m = re.search(r"^-\s+\*\*ADV rating:\*\*\s*(.*)$", body, re.M)
        if not m:
            raise SystemExit("tour/04-roads.md: Day %d entry lacks the "
                             "'- **ADV rating:**' bullet (Tkacs terrain class)" % n)
        road["rating"] = adv_rating(plain(m.group(1)))
        prose = body.split("### Photos")[0]
        paras, buf = [], []
        for ln in prose.splitlines():
            if ln.startswith("- ") or ln.startswith("#"):
                continue
            if ln.strip() == "":
                if buf:
                    paras.append(md_inline(" ".join(buf)))
                    buf = []
            else:
                buf.append(ln.strip())
        if buf:
            paras.append(md_inline(" ".join(buf)))
        road["paras"] = paras
        photos = []
        if "### Photos" in body:
            for ln in body.split("### Photos", 1)[1].splitlines():
                m = re.match(r"^-\s+!\[([^\]]*)\]\(([^)]+)\)\s*(?:—\s*(.*))?$", ln)
                if m:
                    photos.append({"src": m.group(2).strip(),
                                   "alt": plain(m.group(1)),
                                   "cap": plain(m.group(3) or "")})
        road["photos"] = photos
        out[n] = road
    return out

ROADS = parse_roads(ROADS_MD)
for _n in sorted(ROADS):
    if _n not in DAY_BY_D:
        raise SystemExit("tour/04-roads.md: 'Day %d' has no matching entry in DAYS (1..%d)" % (_n, len(DAYS)))
    DAY_BY_D[_n]["road"] = ROADS[_n]

# ============ HOW THE TRIP WORKS (guided package; fly ALA in and out) ============
FLIGHTS = {
 "intro": "This is a guided package: Silk Off Road Tours provides the rental Suzuki DR650SE, the ride leader, the support truck that carries all luggage, every night's lodging, breakfasts, entry fees and both airport transfers. On the rider: a round-trip flight to Almaty (ALA), documents, personal insurance, fuel, and lunches & dinners (that last one is a feature — see the Food Trail). The loop starts and finishes in Almaty — no open-jaw flight logic.",
 "season": "Planned dates: Sep 5–20, 2026 — confirm dates and the custom-edition price with the operator. September brings stable weather on the steppe and desert legs, but the 3,000–4,000 m passes and yurt nights can sit near or below freezing while Chundzha still tops 30 °C: layering is the whole packing strategy.",
 "legs": [
   {"dir":"Getting there · fly to Almaty","from":"Home airport","to":"Almaty (ALA)",
    "sample":"Arrive by Sat Sep 5 · depart Sun Sep 20, 2026",
    "type":"Round-trip flight","duration":"via IST · FRA · DXB or Astana",
    "note":"A simple round-trip ticket to Almaty International Airport (ALA). Arrive by Day 1 — the operator's transfer meets arrivals, and bike handover plus the welcome dinner happen that day, so land in the morning or the day before. Buffer days are cheap insurance against a missed handover. Both airport transfers are included."},
   {"dir":"The tour · the guided loop","from":"Almaty","to":"Almaty",
    "sample":"Days 1–16 · Sep 5–20 · a 14-day tour body (1 training + 12 riding + 1 rest day)",
    "type":"Guided group ride","duration":"≈ 2,800 km · 13 riding days",
    "note":"A custom extended edition of the operator's 10-day route on a rental Suzuki DR650SE (43 hp, ~160 kg, third-party insurance included; USD 500 refundable damage deposit at handover — photograph the bike). Ride leader sets pace and lines; the support truck carries the duffel, spares and reserve fuel. The two Kegen/Karkara border crossings (Day 5 southbound +1 h, Day 14 northbound −1 h) are handled by the operator — you queue with your passport."}
 ],
 "estimate": "The operator's published 10-day tour is USD 3,000 + a USD 500 refundable deposit; this 16-day loop is a custom extended edition — indicative ≈ USD 4,500, price to confirm. Included: bike, guide, support vehicle, twin-share lodging, breakfasts, water, entry fees, transfers. Excluded: flights, fuel (~USD 95–125 for ~2,800 km of AI-92), lunches & dinners (~USD 400–525 over the trip), visas if any, personal insurance, damage liability.",
 "tips": [
   "Both countries are visa-free for US citizens (KZ: 30 days/visit; KG: 30 days per 60-day period since Jan 1, 2026) — re-verify both sets of rules ~1 month before departure, they move.",
   "Bring your home motorcycle license + an International Driving Permit (AAA, ~USD 20, two passport photos) — an operator requirement, and police document checks on KZ/KG highways are routine.",
   "Buy travel medical + evacuation insurance that explicitly covers riding a motorcycle over 250 cc and is valid to at least 4,100 m in both countries — it is excluded from the tour price and non-negotiable.",
   "Cash is the tool: withdraw tenge at ALA and som in Karakol or Bishkek; keep ~USD 100 equivalent in small local notes plus USD ~200 in crisp bills as reserve. Saty and Song-Kol have no ATMs.",
   "Set your watch at the border: Kazakhstan is UTC+5, Kyrgyzstan UTC+6 — clocks go +1 h on Day 5 and −1 h on Day 14.",
   "Install a Central Asia eSIM (Airalo/Holafly) before flying, and expect zero coverage at Song-Kol, on the high passes and around Saty — tell family the blackout days in advance."
 ],
 "links": [
   {"l":"Silk Off Road Tours — the operator","u":"https://www.silkoffroadtours.com/motorcycle-tours-kazakhstan-kyrgyzstan"},
   {"l":"U.S. Embassy — visa-free travel to Kazakhstan","u":"https://kz.usembassy.gov/visa-free-travel-to-kazakhstan/"},
   {"l":"travel.state.gov — Kazakhstan","u":"https://travel.state.gov/content/travel/en/international-travel/International-Travel-Country-Information-Pages/Kazakhstan.html"},
   {"l":"travel.state.gov — Kyrgyzstan","u":"https://travel.state.gov/content/travel/en/international-travel/International-Travel-Country-Information-Pages/Kyrgyzstan.html"},
   {"l":"Kyrgyzstan visa-free rules (30/60 days)","u":"https://kyrgyzstan-tourism.com/news/kyrgyzstan-introduces-visa-free-regime-for-up-to-30-days-for-citizens-of-55-countries/"},
   {"l":"Kazakh Travel — official tourism portal","u":"https://www.kazakh.travel/en"}
 ]
}

# ============ CHECKLIST (from tour/02-getting-started.md + 00-riders.md) ============
CHECKLIST = [
 {"sec":"Documents & visas","icon":"📄","items":[
   "Passport valid 6+ months beyond the trip, with 2+ blank pages (ALA stamps in and out PLUS four border stamps mid-tour)",
   "Kazakhstan: visa-free for US citizens up to 30 days/visit — hotels handle the >5-day registration automatically",
   "Kyrgyzstan: visa-free, but the rules changed Jan 1, 2026 (30 days within each 60-day period) — don't trust old guidebooks",
   "Re-verify BOTH countries' entry rules ~1 month before departure",
   "Home motorcycle license + International Driving Permit (AAA, ~USD 20, two passport photos) — carried every riding day",
   "Paper photocopies + phone photos of everything; passport stays on you (not in the truck) on both border days"
 ]},
 {"sec":"Flights & arrival","icon":"✈️","items":[
   "Round-trip ticket to Almaty (ALA) — arrive by Day 1 (Sat Sep 5), depart Day 16 (Sun Sep 20)",
   "Land in the morning or a day early — bike handover and the welcome dinner are on Day 1",
   "Send flight details to the operator for the included airport transfers",
   "Confirm the custom-edition dates and price (indicative ≈ USD 4,500) with Silk Off Road Tours"
 ]},
 {"sec":"The rental DR650 & the deposit","icon":"🏍️","items":[
   "USD 500 refundable damage deposit due at handover — damage liability is on the rider",
   "Photograph the bike thoroughly at the Day-1 inspection (every panel, both sides)",
   "Use the Day-2 training day hard: levers, tire pressures, suspension sag, full walk-around",
   "Soft duffel 15–20 kg for the support truck; ride with only a tank/tail bag and water",
   "Plan fuel around the ~250 km real-world range: fill at every stop the leader calls, and brim before Altyn-Emel, Barskoon, Song-Kol and the Kegen→Saty leg"
 ]},
 {"sec":"Riding gear — 0 to 35 °C in one trip","icon":"🧥","items":[
   "Full ADV suit with removable thermal + waterproof liners",
   "Off-road-capable boots; two glove weights (summer + insulated)",
   "Merino base layers + a packable down mid-layer + warm hat — Suek Pass and the ~3,000 m nights can freeze even in September",
   "Balaclava / neck tube; earplugs",
   "Hydration pack — desert days and altitude both punish dehydration"
 ]},
 {"sec":"Yurt-night kit (3 nights: D7–8 & D10)","icon":"⛺","items":[
   "Sleeping-bag liner (blankets are provided, laundering is rustic)",
   "Headlamp, wet wipes, small quick-dry towel",
   "Swim kit for the rest day at the lake",
   "10,000+ mAh power bank — yurt-camp power is limited/solar",
   "A few small gifts for herder hosts"
 ]},
 {"sec":"Health & altitude","icon":"⛰️","items":[
   "Ibuprofen/acetaminophen for altitude headaches; personal medications for 16 days",
   "Sunscreen + lip balm (altitude sun), water-purification backup, TP",
   "Hydrate relentlessly and skip alcohol the night before the big passes",
   "Respect the plan: Day 7 crests 4,021 m and two nights sleep at ~3,000 m — the Day-8 rest day is part of the acclimatization"
 ]},
 {"sec":"Money — tenge, som & cash","icon":"💵","items":[
   "Withdraw tenge (KZT) at ALA; som (KGS) in Karakol or Bishkek",
   "Carry ~USD 100 equivalent in small local notes at all times + USD ~200 in crisp bills as reserve",
   "Keep enough tenge from the first KZ leg to cover Days 14–15 — Saty is cash-only with no ATM",
   "Budget lunches & dinners ~USD 25–35/day (≈ USD 400–525 for the trip) and fuel ~USD 95–125",
   "Cash only in the border areas and at Song-Kol/Suusamyr/Saty; cards work in Almaty, Karakol, Bishkek, Cholpon-Ata"
 ]},
 {"sec":"Comms & eSIM","icon":"📱","items":[
   "Regional Central Asia eSIM (Airalo/Holafly) installed before flying — or local SIMs (passport needed to register)",
   "Expect zero coverage at Song-Kol, in Altyn-Emel's back country and on all high passes; patchy around Saty/Kolsai",
   "Tell family the blackout days in advance; consider a Garmin inReach",
   "Remember the time change (KG = KZ +1 h) when scheduling calls home on Days 5–14",
   "Download offline maps for both countries"
 ]},
 {"sec":"Insurance — the non-negotiable one","icon":"🛡️","items":[
   "Travel medical + emergency evacuation cover for all 16 days, in BOTH countries",
   "Policy must explicitly include riding a motorcycle over 250 cc (the DR650 is 644 cc) and be valid to 4,100 m altitude",
   "Carry the insurer's 24-h number on paper and give a copy to the ride leader",
   "Check whether your travel policy covers rental-vehicle excess (the USD 500 deposit exposure)"
 ]},
 {"sec":"Final days before","icon":"✅","items":[
   "Re-verify KZ & KG entry rules and re-confirm dates with the operator",
   "Watch the weather window for the Suek glacier road and Song-Kol",
   "Charge power bank, headlamp, intercom, camera",
   "Cash sorted (USD reserve + first tenge), documents photographed",
   "Pack the duffel to 15–20 kg and weigh it — the truck carries it, the mountain rates it"
 ]}
]

# ============ DAYART (region-matched scenic photos, keyed by day.d) ============
def _art(did, i):
    ph = DESTS[did]["photos"]
    return ph[i % len(ph)]["src"]
DAYART = {
 "1": _art("almaty",0),   "2": _art("almaty",4),      "3": _art("altyn-emel",5),
 "4": _art("altyn-emel",0),"5": _art("karakol",0),    "6": _art("karakol",3),
 "7": _art("issyk-kul",1), "8": _art("issyk-kul",0),  "9": _art("kochkor",0),
 "10": _art("song-kol",0), "11": _art("suusamyr",1),  "12": _art("bishkek",3),
 "13": _art("cholpon-ata",2), "14": _art("karakol",2),"15": _art("saty",2),
 "16": _art("almaty",3),
}

# ============ EMIT ============
def js(v, indent=0):
    pad = "  " * indent
    if v is None:
        return "null"
    if isinstance(v, str):
        return json.dumps(v, ensure_ascii=False)
    if isinstance(v, bool):
        return "true" if v else "false"
    if isinstance(v, (int, float)):
        return repr(v)
    if isinstance(v, list):
        if not v:
            return "[]"
        items = [js(x, indent+1) for x in v]
        # inline short lists of scalars/strings and coordinate pairs
        if all(isinstance(x, (str, int, float, bool)) for x in v):
            joined = ", ".join(items)
            if len(joined) < 100:
                return "[" + joined + "]"
        if all(isinstance(x, list) and len(x) == 2 and
               all(isinstance(y, (int, float)) for y in x) for x in v):
            return "[" + ", ".join("[%s,%s]" % (y[0], y[1]) for y in v) + "]"
        inner = ",\n".join("  " * (indent+1) + it for it in items)
        return "[\n" + inner + "\n" + pad + "]"
    if isinstance(v, dict):
        parts = []
        for k, val in v.items():
            parts.append(json.dumps(k, ensure_ascii=False) + ": " + js(val, indent+1))
        inner = ", ".join(parts)
        if len(inner) < 110 and not any(isinstance(x,(list,dict)) for x in v.values()):
            return "{ " + inner + " }"
        inner = ",\n".join("  " * (indent+1) + json.dumps(k, ensure_ascii=False) + ": " + js(val, indent+1) for k,val in v.items())
        return "{\n" + inner + "\n" + pad + "}"
    raise TypeError(str(type(v)))

def emit_dest(d):
    o = []
    o.append("{")
    o.append('  id: %s,' % json.dumps(d["id"]))
    o.append('  name: %s,' % json.dumps(d["name"], ensure_ascii=False))
    o.append('  jp: %s,' % json.dumps(d["jp"], ensure_ascii=False))
    o.append('  region: %s,' % json.dumps(d["region"], ensure_ascii=False))
    o.append('  type: %s,' % json.dumps(d["type"]))
    o.append('  days: %s,' % json.dumps(d["days"], ensure_ascii=False))
    o.append('  legKm: %d,' % d["legKm"])
    o.append('  lat: %s, lng: %s, zoom: %d,' % (d["lat"], d["lng"], d["zoom"]))
    o.append('  tagline: %s,' % json.dumps(d.get("tagline",""), ensure_ascii=False))
    o.append('  intro: ' + js(d["intro"], 1) + ',')
    o.append('  highlights: ' + js(d["highlights"], 1) + ',')
    o.append('  food: ' + js(d["food"], 1) + ',')
    o.append('  hotels: ' + js(d["hotels"], 1) + ',')
    o.append('  links: ' + js(d["links"], 1) + ',')
    o.append('  photos: ' + js(d["photos"], 1))
    o.append("}")
    return "\n".join(o)

HEADER = open(os.path.join(os.path.dirname(__file__), "data_header.txt"), encoding="utf-8").read()

out = [HEADER]
out.append("window.DESTINATIONS = [")
out.append(",\n".join(emit_dest(DESTS[i]) for i in ORDER))
out.append("];\n")

out.append('window.HOME = { city: "Almaty", country: "Kazakhstan" };')
out.append("window.FLIGHTS = " + js(FLIGHTS, 0) + ";\n")

out.append("/* Day-by-day schedule (Day 1–16). day.html builds a timed routine per day.")
out.append("   km are the planned legs (2,809 km total); dmin are honest ride-time estimates")
out.append("   (~65 km/h asphalt, ~35 km/h gravel) — several legs are off Google's road graph. */")
out.append("window.DAYS = [")
out.append(",\n".join(js(d, 1) for d in DAYS))
out.append("];\n")

out.append("/* The flexible anchor-point plan: 5 fixed pre-booked anchors (+ the Almaty base)")
out.append("   and the route options between them (tour/03-anchors-and-options.md).")
out.append("   Reference options carry reference:true; km flagged est:true are estimates. */")
out.append("window.ANCHORS = " + js(ANCHORS, 0) + ";\n")
out.append("window.SEGMENTS = " + js(SEGMENTS, 0) + ";\n")

out.append("/* Bret Tkacs ADV Skill Rating System terrain classes (1 Novice … 5 Severe);")
out.append("   ratings live on DAYS[].road.rating and SEGMENTS[].options[].adv as {cls, peak, raw}.")
out.append("   Colors follow the system's flag colors, tuned legible for the dark UI. */")
out.append("window.ADVSCALE = " + js(ADVSCALE, 0) + ";\n")

out.append("/* Themed 'Silk Road Food Trail' foodie thread;")
out.append("   rendered as a section on index.html and a callout on the matching day pages. */")
out.append("window.FOOD_TRAIL = " + js(FOOD_TRAIL, 0) + ";\n")

out.append("/* Pre-trip preparation checklist (rendered by checklist.html). */")
out.append("window.CHECKLIST = " + js(CHECKLIST, 0) + ";\n")

out.append("/* Geocoded routing points (lat,lng) so Google Maps always resolves them. */")
out.append("window.GEO = " + js(GEO, 0) + ";\n")

out.append("/* Region-matched scenic photos used as each day's hero artwork (verified). */")
out.append("window.DAYART = " + js(DAYART, 0) + ";")

open(os.path.join(os.path.dirname(__file__), "data.js"), "w", encoding="utf-8").write("\n".join(out) + "\n")
print("wrote data.js")
print("DESTINATIONS:", len(ORDER), "DAYS:", len(DAYS),
      "ANCHORS:", len(ANCHORS), "SEGMENTS:", len(SEGMENTS))
print("ids:", ", ".join(ORDER))
kmsum = sum(d["km"] for d in DAYS)
print("riding km sum:", kmsum, "(expect 2809)")
print("roads:", len(ROADS), "day entries (Days %d–%d);" % (min(ROADS), max(ROADS)),
      sum(len(r["photos"]) for r in ROADS.values()), "road photos")
# image url inventory
urls = set()
for i in ORDER:
    for ph in DESTS[i]["photos"]:
        urls.add(ph["src"])
for d in DAYS:
    for p in d["poi"]:
        if p.get("img"): urls.add(p["img"])
    for ph in d.get("road", {}).get("photos", []):
        urls.add(ph["src"])
for v in DAYART.values(): urls.add(v)
for st in FOOD_TRAIL["stops"]:
    if st.get("photo"): urls.add(st["photo"])
print("unique image urls:", len([u for u in urls if u]))
