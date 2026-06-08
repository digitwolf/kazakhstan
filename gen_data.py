#!/usr/bin/env python3
"""Generate data.js from tour/ markdown (website-builder).
Run: python3 gen_data.py  (writes data.js)."""
import re, json, glob, os

TOUR = os.path.join(os.path.dirname(__file__), "tour", "destinations")

# id -> (lat, lng, zoom). Coordinates curated by website-builder (not in md).
COORDS = {
    "home":      (47.75530, -122.13389, 10),  # start AND finish — Woodinville, WA
    "westport":  (46.89009, -124.10406, 12),
    "astoria":   (46.18788, -123.83125, 12),
    "cannon-beach": (45.89177, -123.96153, 12),
    "tillamook": (45.45650, -123.84370, 11),
    "yachats":   (44.31123, -124.10484, 13),
    "st-helens": (46.19120, -122.19440,  9),  # the volcano (overnight base is Castle Rock)
    "rainier":   (46.85272, -121.76040,  9),  # the mountain (overnight base is Packwood)
}

# Destination/gallery order (== file order). "home" is the start AND finish of the loop;
# it stays in the gallery, the route ribbon and the map polyline (type "start"). The
# remaining six stops follow in route order down the coast and back over the Cascades.
ORDER = ["home","westport","astoria","cannon-beach","tillamook","yachats","st-helens","rainier"]

def md_inline(s):
    """Convert markdown bold/links to HTML, drop [KID] markers."""
    s = s.replace("**[KID]**", "").replace("[KID]", "")
    s = re.sub(r"\[([^\]]+)\]\((https?://[^)]+)\)",
               r'<a href="\2" target="_blank" rel="noopener">\1</a>', s)
    s = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", s)  # remaining (relative) md links -> plain text
    s = re.sub(r"\*\*([^*]+)\*\*", r"<b>\1</b>", s)
    s = re.sub(r"\*([^*]+)\*", r"<i>\1</i>", s)
    return re.sub(r"\s+", " ", s).strip()

def plain(s):
    s = s.replace("**[KID]**", "").replace("[KID]", "")
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
    # title + jp
    m = re.match(r"^#\s+(.*)$", lines[0])
    title = m.group(1).strip()
    jm = re.search(r"([　-鿿＀-￯]+)\s*$", title)
    if jm:
        d["jp"] = jm.group(1)
        d["name"] = title[:jm.start()].strip()
    else:
        d["jp"] = ""
        d["name"] = title
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
    rm = re.search(r"(\d+)\s*mi", ride)
    d["legMiles"] = int(rm.group(1)) if rm else 0

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

    # Where to stay -> hotels (table)
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
        typ, parking, yen, usd, notes = cells[1], cells[2], cells[3], cells[4], cells[5]
        if prop.startswith("_") or typ == "—":
            hotels.append({"n": plain(prop), "t": "Note", "d": plain(notes)})
        else:
            h = {"n": plain(prop), "t": plain(typ), "d": plain(notes)}
            if parking and parking != "—":
                h["park"] = md_inline(parking)
            if yen and yen != "—":
                h["price"] = yen
            hotels.append(h)
    if not hotels:
        # No lodging table (e.g. a quick stop with no overnight): capture the first prose
        # paragraph of "Where to stay" as a single Note row so the card still explains itself.
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
    # id from filename: NN-id.md
    fid = re.match(r"\d+-(.*)\.md", os.path.basename(path)).group(1)
    d["id"] = fid
    lat, lng, zoom = COORDS[fid]
    d["lat"], d["lng"], d["zoom"] = lat, lng, zoom
    DESTS[fid] = d

# ---- helper to pick a verified photo from a destination ----
def P(did, idx):
    ph = DESTS[did]["photos"]
    return ph[idx % len(ph)]["src"]

# POI images are pulled from the verified destination photos via P(id, idx) so every
# image is an already-HTTP-200-checked Wikimedia thumbnail. IMG holds nothing extra.
IMG = {}

# Verified English-Wikipedia article URLs (HTTP 200, batch-verified) keyed by POI name.
# poi() attaches WIKI[name] as an explicit `wiki` override; everything else falls back
# at render time to a Wikipedia search link via window.wikiLink (always resolves).
WIKI = {
    "Edmonds–Kingston Ferry": "https://en.wikipedia.org/wiki/Edmonds%E2%80%93Kingston_ferry",
    "Hood Canal": "https://en.wikipedia.org/wiki/Hood_Canal",
    "Grays Harbor Lighthouse": "https://en.wikipedia.org/wiki/Grays_Harbor_Light",
    "Cape Disappointment": "https://en.wikipedia.org/wiki/Cape_Disappointment_(Washington)",
    "Long Beach Peninsula": "https://en.wikipedia.org/wiki/Long_Beach_Peninsula",
    "Astoria–Megler Bridge": "https://en.wikipedia.org/wiki/Astoria%E2%80%93Megler_Bridge",
    "Astoria Column": "https://en.wikipedia.org/wiki/Astoria_Column",
    "Columbia River Maritime Museum": "https://en.wikipedia.org/wiki/Columbia_River_Maritime_Museum",
    "Haystack Rock, Cannon Beach": "https://en.wikipedia.org/wiki/Haystack_Rock",
    "Tillamook Creamery": "https://en.wikipedia.org/wiki/Tillamook_County_Creamery_Association",
    "Tillamook Air Museum": "https://en.wikipedia.org/wiki/Tillamook_Air_Museum",
    "Cape Meares Lighthouse": "https://en.wikipedia.org/wiki/Cape_Meares_Light",
    "Cape Kiwanda": "https://en.wikipedia.org/wiki/Cape_Kiwanda_State_Natural_Area",
    "Oregon Coast Aquarium": "https://en.wikipedia.org/wiki/Oregon_Coast_Aquarium",
    "Cape Perpetua": "https://en.wikipedia.org/wiki/Cape_Perpetua",
    "Thor's Well & Cape Perpetua": "https://en.wikipedia.org/wiki/Cape_Perpetua",
    "Heceta Head Lighthouse": "https://en.wikipedia.org/wiki/Heceta_Head_Light",
    "Sea Lion Caves": "https://en.wikipedia.org/wiki/Sea_Lion_Caves",
    "Yachats 4th of July": "https://en.wikipedia.org/wiki/Yachats,_Oregon",
    "Mount St. Helens Visitor Center": "https://en.wikipedia.org/wiki/Mount_St._Helens",
    "Spirit Lake Highway viewpoints": "https://en.wikipedia.org/wiki/Spirit_Lake_(Washington)",
    "Coldwater Lake": "https://en.wikipedia.org/wiki/Coldwater_Lake",
    "Mount St. Helens": "https://en.wikipedia.org/wiki/Mount_St._Helens",
    "Paradise, Mount Rainier": "https://en.wikipedia.org/wiki/Paradise,_Mount_Rainier_National_Park",
    "Reflection Lakes": "https://en.wikipedia.org/wiki/Mount_Rainier_National_Park",
    "Narada Falls": "https://en.wikipedia.org/wiki/Narada_Falls",
    "Tipsoo Lake & Chinook Pass": "https://en.wikipedia.org/wiki/Chinook_Pass",
    "Packwood": "https://en.wikipedia.org/wiki/Packwood,_Washington",
    "Corvallis": "https://en.wikipedia.org/wiki/Corvallis,_Oregon",
    "Enumclaw": "https://en.wikipedia.org/wiki/Enumclaw,_Washington",
}

# ============ INTEREST THEMES (tie to tour/00-family.md) ============
# Optional per-POI `it` (interest) tags drive the day.html "day highlights" badges and
# the per-stop badges. Render labels/emoji live in day.html; here we store keys only.
# Keys (priority/display order): skill 🎓 · food 🦀 · volcano 🌋 · lighthouse 🗼 ·
#   wildlife 🐾 · toys 🧸 · kid 🧒 · moto 🏍️ · coast 🌊 · scenic 🌄 · history 🏛️
# Family map: Galiya → food/scenic/coast; Aslan → kid/toys/wildlife/volcano; Ruslan → moto/skill.
# "skill" is the trip's signature thread — building a brand-new rider's confidence.
KW = [
 ("skill",    ["shakedown","warm-up","first miles","confidence","graduation","start line","new rider","skill-build"]),
 ("food",     ["chowder","seafood","crab","dungeness","oyster","fish and chips","fish & chips","cheese","creamery",
               "ice cream","brewery","brewing","bakery","coffee","clam","tuna","salmon","market","diner","burgers","pub"]),
 ("volcano",  ["volcano","st. helens","st helens","crater","eruption","lava","blast zone","spirit lake","coldwater"]),
 ("lighthouse",["lighthouse","light station","heceta","light "]),
 ("wildlife", ["sea lion","sea lions","elk","marmot","wildlife","tide pool","tidepool","whale","puffin","aquarium","seal","dory"]),
 ("toys",     ["toy","souvenir","candy","kite","gift shop"]),
 ("kid",      ["kid","goonies","glider","trolley","blimp hangar","air museum","beach","sand","playground","petting"]),
 ("moto",     ["chinook pass","stevens canyon","switchback","mountain pass","scenic byway","the road","sweepers","hairpin"]),
 ("coast",    ["beach","surf","jetty","ocean","seashore","cove","headland","dune","bay","harbor","harbour","spit"]),
 ("scenic",   ["viewpoint","overlook","falls","waterfall","gorge","vista","panorama","wildflower","meadow","reflection",
               "lake","forest","old-growth","sunset","column","cape","bridge","ferry","canal","river","pass"]),
 ("history",  ["museum","historic","fort","column","lewis and clark","clatsop","maritime","heritage","pioneer","1980"]),
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

# ============ DAYS (0..23) ============
# Each: d, id, miles, dmin(optional), rest, rail(optional), region, title, route,
#       desc, tags, gfrom, gto, gvia, poi[]
def poi(name, what, q, slot, img, wiki=None, it=None, kid=False):
    p = {"name": name, "what": what, "q": q, "slot": slot, "img": img}
    w = wiki or WIKI.get(name)
    if w:
        p["wiki"] = w   # explicit verified article; else day.html falls back to a Wikipedia search link
    interests = infer_interests(name, what, slot, it)
    if interests:
        p["it"] = interests   # interest-theme keys → emoji badges in day.html
    if kid:
        p["kid"] = True   # explicit kid-friendly stop (also surfaced via the `kid` interest badge)
    return p

DAYS = [
 {"d":1,"id":"westport","miles":176,"dmin":275,"ferry":True,"rest":False,"region":"Puget Sound → Washington Coast",
  "title":"Ferry, Fjord & First Miles",
  "route":"Woodinville → Edmonds–Kingston ferry → Hood Canal (Hama Hama oysters) → Westport",
  "desc":"The trip begins the gentle way. Ride the short hop from Woodinville to the Edmonds waterfront and roll the bikes onto the Edmonds–Kingston ferry — a calm half-hour across Puget Sound that skips Seattle's traffic entirely and lets Galiya settle in before the first real miles. From Kingston, quiet two-lane roads trace the west shore of Hood Canal, the long glacial fjord with the Olympics rising across the water — with a stop at the family's favourite, the Hama Hama Oyster Saloon in Lilliwaup, for a fresh oyster lunch right on the water. Then drop south through Shelton to Aberdeen and out to the Pacific at Westport. It's a forgiving, scenic first day built around the ferry break and frequent stops — the W230's confidence-building shakedown and Aslan's easy introduction to life on the back of the GS. Arrive at the salty fishing-and-surf town of Westport with the afternoon to walk the marina and climb the lighthouse.",
  "tags":["ride","skill","scenic","food","kid"],
  "gfrom":"Woodinville, WA","gto":"Westport, WA","gvia":"Edmonds Ferry Terminal, Edmonds, WA|Hama Hama Oyster Saloon, Lilliwaup, WA|Hoodsport, WA|Aberdeen, WA",
  "poi":[poi("Edmonds–Kingston Ferry","Roll the bikes aboard for a ~30-minute Puget Sound crossing — the relaxed, traffic-free start to the tour and Galiya's first ferry load-on. Aim for the <b>10:20 AM</b> summer sailing (Wed Jul 1; weekday departures run 9:35 / 10:20 / 11:05 / 11:55 AM) and arrive ~15 min early — motorcycles load first. No reservation needed for bikes.","Edmonds Ferry Terminal, Edmonds, WA","activity",P("home",1),it=["skill","scenic"],kid=True),
         poi("Hama Hama Oyster Saloon","The family's favourite Hood Canal stop — just-shucked oysters (raw, grilled, or fried in a po'boy) and steamer clams at the Hama Hama oyster farm's roadside saloon in Lilliwaup, right on US-101 over the water. The perfect first-day lunch; check the seasonal days/hours before you count on it.","Hama Hama Oyster Saloon, Lilliwaup, WA","lunch",P("home",6),it=["food"]),
         poi("Hood Canal","Quiet shoreline two-lanes along the long glacial fjord, the Olympic Mountains across the water — easy, gorgeous riding to build confidence on Day 1.","Hoodsport, WA","scenic",P("home",7),it=["scenic","coast"]),
         poi("Aberdeen & Grays Harbor","Coffee and a fuel stop at the harbor city (Kurt Cobain's hometown) before the last run out to the coast.","Aberdeen, WA","coffee",P("home",8)),
         poi("Grays Harbor Lighthouse","Washington's tallest lighthouse, on arrival in Westport — a fitting first landmark of the Pacific.","Grays Harbor Lighthouse, Westport, WA","scenic",P("westport",0),it=["lighthouse","coast"]),
         poi("Westhaven State Park","Westport's surf beach and south jetty — a leg-stretch on the sand to celebrate reaching the ocean on day one.","Westhaven State Park, Westport, WA","activity",P("westport",4),it=["coast","kid"],kid=True)]},

 {"d":2,"id":"cannon-beach","miles":125,"dmin":173,"rest":False,"region":"Washington Coast → Oregon",
  "title":"Across the Columbia to Cannon Beach",
  "route":"Westport → Long Beach → Astoria → Cannon Beach",
  "desc":"A relaxed second day with a beach payoff. Roll south through the oyster country of South Bend and Raymond, out onto the Long Beach Peninsula — one of the longest drivable beaches in the world — past the windswept headland of Cape Disappointment, then over the Astoria–Megler Bridge (four-plus miles across the mighty Columbia into Oregon). Spend the afternoon in Astoria, a hilly Victorian riverport full of kid wins — the Astoria Column with its balsa-glider launch, barking sea lions on the docks, and the excellent Columbia River Maritime Museum — then drop the last ~25 miles south to sleep at Cannon Beach, right under the 235-foot Haystack Rock. Wake up on the beach.",
  "tags":["ride","kid","history","coast"],
  "gfrom":"Westport, WA","gto":"Cannon Beach, OR","gvia":"Raymond, WA|Long Beach, WA|Astoria, OR",
  "poi":[poi("South Bend & Raymond","Oyster-country leg-stretch along Willapa Bay — 'the Oyster Capital of the World' — on quiet Highway 101.","Raymond, WA","coffee",P("westport",3),it=["food"]),
         poi("Long Beach Peninsula","A 28-mile ribbon of sand you can ride a bike or fly a kite on; the boardwalk and the World Kite Museum are easy fun for Aslan.","Long Beach, WA","scenic",P("westport",5),it=["coast","kid"],kid=True),
         poi("Astoria–Megler Bridge","The 4.1-mile bridge across the Columbia into Oregon — the longest continuous truss bridge in North America and a memorable ride-over.","Astoria-Megler Bridge","scenic",P("astoria",1),it=["scenic","history"]),
         poi("Astoria Column","Climb the 164-step painted tower for a 360° view, then launch a balsa-wood glider from the top — a classic kid thrill.","Astoria Column, Astoria, OR","activity",P("astoria",0),it=["history","scenic"],kid=True),
         poi("Columbia River Maritime Museum","One of the best maritime museums on the West Coast — lightships, a Coast Guard rescue-boat display and shipwreck lore that grabs a 6-year-old.","Columbia River Maritime Museum, Astoria, OR","lunch",P("astoria",4),it=["history","kid"],kid=True),
         poi("Astoria sea lions","Hundreds of barking sea lions haul out on the East Mooring Basin docks — free, loud and a guaranteed Aslan favourite.","Astoria, OR","scenic",P("astoria",6),it=["wildlife","kid"],kid=True),
         poi("Haystack Rock, Cannon Beach","Arrive at the iconic 235-foot sea stack — tide pools, nesting puffins and a long flat beach right outside the night's lodging. Sunset on the sand caps the day.","Haystack Rock, Cannon Beach, OR","activity",P("cannon-beach",0),it=["coast","wildlife","scenic"],kid=True)]},

 {"d":3,"id":"yachats","miles":136,"dmin":192,"rest":False,"region":"Oregon Coast",
  "title":"Cheese, Capes & the Coast Run",
  "route":"Cannon Beach → Tillamook → Pacific City → Newport → Yachats",
  "desc":"The signature coast day, and the most varied riding of the trip — all on scenic Highway 101 and the Three Capes byway, no freeways. Wake under Haystack Rock, then roll south to the marquee mid-day stop the family asked for: the Tillamook Creamery for a cheese-factory tour and famous ice cream, with the giant wooden blimp hangar of the Tillamook Air Museum next door. Detour the Three Capes Scenic Loop past Cape Meares Lighthouse and the dory-boat beach and big dune at Pacific City. Carry on down the coast — Lincoln City, Depoe Bay, the Oregon Coast Aquarium at Newport — and arrive by early evening at Yachats, the tiny gem where forest meets surf, your two-night base for the Fourth of July.",
  "tags":["ride","food","kid","scenic"],
  "gfrom":"Cannon Beach, OR","gto":"Yachats, OR","gvia":"Tillamook Creamery, Tillamook, OR|Pacific City, OR|Newport, OR",
  "poi":[poi("Tillamook Creamery","The marquee stop: a free self-guided cheese-factory viewing gallery, samples, and the legendary ice-cream counter — the trip's biggest foodie-and-kid double win.","Tillamook Creamery, Tillamook, OR","lunch",P("tillamook",0),it=["food","kid"],kid=True),
         poi("Tillamook Air Museum","Vintage aircraft inside one of the world's largest wooden structures — a WWII blimp hangar. Catnip for Ruslan and Aslan alike.","Tillamook Air Museum, Tillamook, OR","activity",P("tillamook",3),it=["history","kid"],kid=True),
         poi("Cape Meares Lighthouse","Oregon's shortest lighthouse on a clifftop headland, beside the gnarled, many-trunked Octopus Tree — a short Three-Capes detour.","Cape Meares Lighthouse, OR","scenic",P("tillamook",5),it=["lighthouse","scenic"]),
         poi("Cape Kiwanda / Pacific City","Dory boats launched straight off the beach, a giant sand dune to climb and Pelican Brewing on the sand — a lively coastal stop.","Cape Kiwanda, Pacific City, OR","scenic",P("tillamook",7),it=["coast","scenic"],kid=True),
         poi("Oregon Coast Aquarium","A optional Newport stop ~25 mi before Yachats — sea otters, a walk-through shark tunnel and a giant Pacific octopus; great if the day's running early.","Oregon Coast Aquarium, Newport, OR","stop",P("astoria",6),it=["wildlife","kid"],kid=True)]},

 {"d":4,"id":"yachats","miles":31,"dmin":51,"rest":True,"region":"Oregon Coast",
  "title":"Yachats & the Fourth of July",
  "route":"Yachats · Cape Perpetua · Heceta Head (light riding)",
  "desc":"The rest day — and it falls on the Fourth of July, in one of the coast's most beloved spots to spend it. Sleep in, then take a short, easy loop south to Cape Perpetua: the highest viewpoint on the Oregon coast, the churning Thor's Well and Devil's Churn, and the photogenic Heceta Head Lighthouse, with the Sea Lion Caves and rich tide pools for Aslan. Back in the village, Yachats throws its famously quirky La De Da Parade and caps the night with fireworks over the bay. No real riding pressure today — it's about tide pools, chowder, a beach walk on the 804 Trail and the holiday. (Book everything here far ahead — Yachats sells out for the Fourth.)",
  "tags":["rest","kid","scenic"],
  "gfrom":"Yachats, OR","gto":"Cape Perpetua, Yachats, OR","gvia":"Heceta Head Lighthouse, OR|Sea Lion Caves, OR",
  "poi":[poi("Yachats 4th of July","The village's beloved, tongue-in-cheek La De Da Parade by day and fireworks over the bay at night — small-town Americana at its best.","Yachats, OR","activity",P("yachats",6),it=["kid","history"],kid=True),
         poi("Thor's Well & Cape Perpetua","The Pacific drains into a churning sinkhole at Thor's Well, with Devil's Churn and Spouting Horn nearby and the coast's highest overlook above — Cape Perpetua's signature scenery.","Cape Perpetua, Yachats, OR","scenic",P("yachats",0),it=["scenic","coast"]),
         poi("Heceta Head Lighthouse","One of the most photographed lighthouses in the United States, glowing white on its forested headland.","Heceta Head Lighthouse, OR","scenic",P("yachats",3),it=["lighthouse","scenic"]),
         poi("Sea Lion Caves","An elevator down to America's largest sea cave, home to a wild Steller sea lion colony — a memorable kid stop.","Sea Lion Caves, OR","activity",P("yachats",8),it=["wildlife","kid"],kid=True),
         poi("804 Trail & tide pools","An easy oceanfront path along the basalt shelf right from the village, with some of the coast's best tide pools at low tide.","804 Trail, Yachats, OR","scenic",P("yachats",9),it=["coast","wildlife"])]},

 {"d":5,"id":"st-helens","miles":216,"dmin":247,"rest":False,"region":"Coast → Cascades",
  "title":"Inland to the Volcano",
  "route":"Yachats → Alsea → Corvallis → cross the Columbia → Mount St. Helens",
  "desc":"The return turns inland and the scenery changes completely. Leave the coast on the quiet, twisting Alsea River road over the Coast Range to Corvallis and the Willamette Valley for lunch, then cross the Columbia back into Washington near Longview. This is the trip's longest transfer — paced with regular breaks — but the payoff is enormous: rolling up the Spirit Lake Highway into the blast zone of Mount St. Helens, the volcano that famously blew its top in 1980. Settle in at the Castle Rock / Silver Lake gateway, where the always-open Visitor Center tells the eruption story, and save the high viewpoints for tomorrow's short, easy morning.",
  "tags":["ride","scenic","volcano"],
  "gfrom":"Yachats, OR","gto":"Castle Rock, WA","gvia":"Alsea, OR|Corvallis, OR|Longview, WA",
  "poi":[poi("Alsea River road","A gentle, scenic two-lane over the Coast Range along the Alsea River — the calm way off the coast and a lovely warm-up to the day's miles.","Alsea, OR","scenic",P("yachats",1),it=["scenic","moto"]),
         poi("Corvallis","Willamette Valley lunch stop — a relaxed college town to break the long transfer roughly halfway.","Corvallis, OR","lunch",P("st-helens",6),it=["food"]),
         poi("Columbia River crossing","Recross the Columbia near Longview/Rainier back into Washington, leaving the coast behind for the Cascades.","Longview, WA","stop",P("astoria",1),it=["scenic","history"]),
         poi("Mount St. Helens Visitor Center","The always-open Visitor Center at Silver Lake — eruption exhibits, a walk-in model volcano and the first close look at the mountain. (Johnston Ridge Observatory remains closed since 2023.)","Mount St. Helens Visitor Center, Silver Lake, WA","activity",P("st-helens",1),it=["volcano","kid"],kid=True)]},

 {"d":6,"id":"rainier","miles":153,"dmin":180,"rest":False,"region":"Cascades",
  "title":"Spirit Lake & the Road to Rainier",
  "route":"Castle Rock → Spirit Lake Hwy viewpoints → US-12 → Packwood",
  "desc":"A deliberately short, relaxed day so the volcano gets a proper morning. Ride the rest of the Spirit Lake Highway up into the blast zone for the big roadside viewpoints over the crater, the recovering forest and Coldwater Lake (the upper road to Johnston Ridge is closed, so this is an out-and-back to the open viewpoints). Then drop back down and cross over on US-12 through Mossyrock and Morton to Packwood, the small mountain town that's the southern gateway to Mount Rainier — elk wander the meadows at the edge of town. Easy afternoon: rest up, because tomorrow is the grand finale ride home over the mountain.",
  "tags":["ride","volcano","scenic","kid"],
  "gfrom":"Castle Rock, WA","gto":"Packwood, WA","gvia":"Coldwater Lake, WA|Mossyrock, WA|Morton, WA",
  "poi":[poi("Spirit Lake Highway viewpoints","WA-504 climbs into the 1980 blast zone — sweeping pullouts at Hoffstadt Bluffs and beyond frame the crater and the regrowing forest.","Hoffstadt Bluffs, WA","scenic",P("st-helens",2),it=["volcano","scenic"]),
         poi("Coldwater Lake","A lake born in the eruption, ringed by the blast zone — an easy boardwalk and the turnaround point of the morning's volcano spur.","Coldwater Lake, WA","activity",P("st-helens",5),it=["volcano","scenic","wildlife"],kid=True),
         poi("Mount St. Helens","The truncated, steaming volcano itself, seen up close from the highway — a geology lesson a 6-year-old won't forget.","Mount St. Helens","scenic",P("st-helens",0),it=["volcano","scenic"]),
         poi("Packwood","A quiet US-12 mountain town and the south gateway to Mount Rainier — resident elk often graze the meadows at dusk.","Packwood, WA","activity",P("rainier",7),it=["wildlife","kid"],kid=True)]},

 {"d":7,"id":"home","miles":165,"dmin":247,"rest":False,"region":"Mount Rainier → Home",
  "title":"Over Rainier, Home",
  "route":"Packwood → Paradise → Chinook Pass → Enumclaw → Home",
  "desc":"The graduation ride. Climb into Mount Rainier National Park to Paradise, where July wildflower meadows spread beneath the glaciers and Myrtle Falls frames the peak. Drop along Stevens Canyon past Reflection Lakes and Narada Falls, then up over Chinook Pass (5,430 ft) at Tipsoo Lake — a spectacular, low-speed alpine pass and the most rewarding riding of the trip, a fitting capstone for a brand-new rider. Descend the eastern flank to Enumclaw for a celebratory lunch, then quiet roads home to Woodinville. Seven days, a ferry, the whole Oregon coast, a volcano and a mountain pass — and a rider who left a beginner and came home a tourer.",
  "tags":["ride","moto","scenic","kid"],
  "gfrom":"Packwood, WA","gto":"Woodinville, WA","gvia":"Paradise, Mount Rainier National Park, WA|Reflection Lakes, Mount Rainier, WA|Tipsoo Lake, WA|Enumclaw, WA",
  "poi":[poi("Paradise, Mount Rainier","The park's famous subalpine meadow — peak July wildflowers, the Skyline Trail and Myrtle Falls with Rainier towering behind.","Paradise, Mount Rainier National Park, WA","activity",P("rainier",3),it=["scenic","wildlife"],kid=True),
         poi("Reflection Lakes","Mount Rainier mirrored in still tarns right beside Stevens Canyon Road — the classic postcard stop.","Reflection Lakes, Mount Rainier, WA","scenic",P("rainier",1),it=["scenic"]),
         poi("Narada Falls","A 168-foot waterfall a few steps from the road, often hung with rainbows in the spray.","Narada Falls, Mount Rainier, WA","scenic",P("rainier",4),it=["scenic"]),
         poi("Tipsoo Lake & Chinook Pass","The alpine high point — a wildflower-rimmed lake at 5,430 ft on the dramatic, sweeping Chinook Pass (WA-410). The ride of the trip.","Tipsoo Lake, WA","scenic",P("rainier",0),it=["moto","scenic"]),
         poi("Enumclaw","Descend the east side for a celebration lunch in the farm town below Rainier, then the easy run home.","Enumclaw, WA","lunch",P("rainier",8),it=["food"]),
         poi("Home — Woodinville","Back where it started — bikes parked, a 6-year-old asleep, and a brand-new rider who is now a tourer.","Woodinville, WA","activity",P("home",0),it=["skill"])]},
]

# ============ COAST FOOD TRAIL (themed foodie thread for Galiya) ============
# A curated cross-route thread: the trip's signature coastal eats — Dungeness crab,
# chowder, fresh fish-and-chips, and Tillamook cheese & ice cream — each tied to the day
# it falls on. Rendered as a themed 🦀 section on index.html (deep-linking to day.html?d=N)
# and as a per-day 🦀 flag on the matching day pages. Photos reuse the verified destination
# thumbnails (HTTP 200). Same data shape as the old Ramen Trail so the templates stay simple.
import urllib.parse as _up
def _gmaps(q):
    return "https://www.google.com/maps/search/?api=1&query=" + _up.quote(q)

def _fph(did, i):
    ph = DESTS[did]["photos"]
    return ph[i % len(ph)]["src"]

FOOD_TRAIL = {
 "title": "The Coast Food Trail",
 "subtitle": "a foodie thread for Galiya",
 "intro": "The Pacific Northwest coast is one long seafood counter, and this ride threads its greatest hits — pulled-that-morning Dungeness crab, creamy clam chowder, beer-battered halibut, and the cheese-and-ice-cream pilgrimage at Tillamook. Four can't-miss stops, one per day down the coast.",
 "note": "<b>Notes:</b> hours stretch and lines grow over the Fourth-of-July weekend — go early, and have a backup pick. All links open Google Maps.",
 "bookend": "",
 "stops": [
   {"n":1,"day":1,"slot":"dinner","city":"Westport","pref":"WA Coast","style":"Dungeness crab & fish-and-chips",
    "styleDesc":"Off-the-boat Dungeness crab, razor clams and beer-battered fish at the working marina where it's landed.",
    "shop":"Bennett's Fish Shack","shopUrl":_gmaps("Bennett's Fish Shack Westport WA"),"shopNote":"the classic harbour fish-and-chips stop",
    "alts":[{"l":"Merino's Seafood Market","u":_gmaps("Merino's Seafood Market Westport WA")},{"l":"Half Moon Bay Bar & Grill","u":_gmaps("Half Moon Bay Bar and Grill Westport WA")}],
    "photo":_fph("westport",2)},
   {"n":2,"day":2,"slot":"lunch","city":"Astoria","pref":"OR Coast","style":"Beer-battered fish & craft beer",
    "styleDesc":"A legendary fish-and-chips trailer and the riverfront brewpubs that put Astoria on the beer map.",
    "shop":"Bowpicker Fish & Chips","shopUrl":_gmaps("Bowpicker Fish and Chips Astoria OR"),"shopNote":"albacore tuna & chips from a boat-turned-food-stand",
    "alts":[{"l":"Buoy Beer Co.","u":_gmaps("Buoy Beer Company Astoria OR")},{"l":"Fort George Brewery","u":_gmaps("Fort George Brewery Astoria OR")}],
    "photo":_fph("astoria",5)},
   {"n":3,"day":3,"slot":"lunch","city":"Tillamook","pref":"OR Coast","style":"Tillamook cheese & ice cream",
    "styleDesc":"The marquee foodie-and-kid stop: a free cheese-factory viewing gallery, squeaky-fresh curds and the famous ice-cream counter.",
    "shop":"Tillamook Creamery","shopUrl":_gmaps("Tillamook Creamery Tillamook OR"),"shopNote":"free self-guided tour + ice cream",
    "alts":[{"l":"Blue Heron French Cheese Co.","u":_gmaps("Blue Heron French Cheese Company Tillamook OR")},{"l":"Pelican Brewing, Pacific City","u":_gmaps("Pelican Brewing Pacific City OR")}],
    "photo":_fph("tillamook",1)},
   {"n":4,"day":4,"slot":"dinner","city":"Yachats","pref":"OR Coast","style":"Wild Pacific seafood & chowder",
    "styleDesc":"Tiny Yachats punches far above its weight — fresh-caught seafood, award-winning chowder and a beloved brewpub, the reward of the two-night base.",
    "shop":"Luna Sea Fish House","shopUrl":_gmaps("Luna Sea Fish House Yachats OR"),"shopNote":"dock-to-table fish-and-chips & chowder",
    "alts":[{"l":"Yachats Brewing + Farmstore","u":_gmaps("Yachats Brewing Farmstore Yachats OR")},{"l":"Ona Restaurant","u":_gmaps("Ona Restaurant Yachats OR")}],
    "photo":_fph("yachats",6)},
 ],
}

# Attach a compact foodTrail marquee list to the matching DAYS for the day-page 🦀 flag.
FOOD_BY_DAY, TRAIL_CIDS = {}, set()
for st in FOOD_TRAIL["stops"]:
    FOOD_BY_DAY.setdefault(st["day"], []).append(
        {"style": st["style"], "shop": st["shop"], "shopUrl": st["shopUrl"],
         "city": st["city"], "slot": st["slot"]})
for _d in DAYS:
    if _d["d"] in FOOD_BY_DAY:
        _d["foodTrail"] = FOOD_BY_DAY[_d["d"]]

# ============ DAILY GUIDES (per-day food + activity research) ============
# The local-guide agent writes one file per day at tour/daily-guides/day-NN.md, each
# carrying a fenced ```json block: {d, title, overnight, schedule, todo[], meals[]}.
# We attach the meals as `eats` (grouped by slot, with the kid pick flagged) and the
# todo as `localTodo` onto the matching window.DAYS entry (match on `d`). Done generically
# over the files so it re-runs cleanly when guides change; days with no guide get no `eats`.
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
        for _p in _picks:   # 🍜 flag picks that are a Ramen Trail marquee/alternative shop
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

# ============ GETTING STARTED (no flights — the trip starts in the garage) ============
FLIGHTS = {
 "intro": "There are no flights and no rental counters — this tour starts in your own garage in Woodinville and ends there a week later. The only logistics are a tank of gas, a packed top-box, and the Edmonds–Kingston ferry that opens Day 1. It's a deliberately simple round trip, designed so a brand-new rider can focus on the riding, not the paperwork.",
 "season": "Depart Wednesday 1 July 2026, home Tuesday 7 July — seven days. Early July is prime Pacific Northwest touring weather: long daylight, dry mountain passes (Chinook Pass is open) and the warmest the coast gets. The catch is the Fourth-of-July crowds — the rest day lands on the 4th in Yachats, so book all coast lodging months ahead.",
 "legs": [
   {"dir":"Outbound · down the coast","from":"Home · Woodinville, WA","to":"Yachats, OR (the ★ base)",
    "sample":"Days 1–3 · Wed 1 – Fri 3 Jul 2026",
    "type":"Ride + ferry","duration":"≈ 436 mi over 3 gentle days",
    "note":"A short ride to the Edmonds waterfront, the ferry across Puget Sound, then quiet roads down Hood Canal and the whole length of the Washington and Oregon coast on Highway 101 — Westport and Astoria overnights, Tillamook cheese and the Three Capes en route to the Yachats base. No freeways, breaks every 60–90 minutes."},
   {"dir":"Return · over the mountains","from":"Yachats, OR","to":"Home · Woodinville, WA",
    "sample":"Days 5–7 · Sun 5 – Tue 7 Jul 2026",
    "type":"Ride","duration":"≈ 534 mi over 3 days",
    "note":"The loop turns inland: across the Coast Range and the Columbia to Mount St. Helens, a short day to Packwood, then the graduation ride home through Mount Rainier National Park over Chinook Pass. The longest single day (~216 mi to St. Helens) is broken with frequent stops."}
 ],
 "estimate": "Budget is modest: gas for two bikes over ~970 miles, six nights of lodging (the Yachats oceanfront stay is the splurge; coast motels and Packwood lodges are cheaper), the Edmonds–Kingston ferry (~$9 per motorcycle + rider), and a Mount Rainier National Park entry pass (or the America the Beautiful annual pass). Food is the fun line item — see the Coast Food Trail.",
 "tips": [
   "Book all coast lodging months ahead — the Fourth-of-July weekend sells Yachats and the whole coast out early.",
   "The Kawasaki W230's tank is small (~3.4 gal) — top up at every reasonable chance; fuel is sparse on the coast and around the mountains.",
   "Pack for everything: cold coastal fog and wind, possible rain, and alpine chill at Chinook Pass — layers and waterproofs for all three.",
   "Pair the intercoms before Day 1; Galiya rides up front and sets the pace, with Aslan and the GS behind.",
   "Check WSDOT for Chinook Pass (SR-410) status and the Mount Rainier timed-entry reservation system before Days 6–7."
 ],
 "links": [
   {"l":"Washington State Ferries — Edmonds/Kingston","u":"https://wsdot.wa.gov/travel/washington-state-ferries/schedules/edmonds-kingston"},
   {"l":"Mount Rainier National Park (NPS)","u":"https://www.nps.gov/mora/index.htm"},
   {"l":"Mount St. Helens National Volcanic Monument","u":"https://www.fs.usda.gov/mountsthelens"},
   {"l":"WSDOT — mountain pass reports (Chinook Pass)","u":"https://wsdot.com/travel/real-time/mountainpasses"},
   {"l":"Visit the Oregon Coast","u":"https://visittheoregoncoast.com/"},
   {"l":"Visit Yachats","u":"https://yachats.org/"}
 ]
}

# ============ CHECKLIST ============
CHECKLIST = [
 {"sec":"Documents & licences","icon":"📄","items":[
   "Washington motorcycle endorsement on each rider's licence (Galiya's is brand-new — keep it on you)",
   "Vehicle registration + proof of insurance for BOTH bikes (W230 and R1300GS)",
   "Roadside-assistance card (AAA or your insurer's moto plan)",
   "America the Beautiful annual pass OR cash/card for the Mount Rainier park entry",
   "Credit card + some backup cash; digital + paper copies of the key documents"
 ]},
 {"sec":"The bikes — pre-trip prep","icon":"🏍️","items":[
   "Full service before departure: oil, brakes, and the W230's chain tension & lube",
   "Tyres checked for tread and set to pressure (both bikes, two-up loads)",
   "Plan fuel around the W230's small (~3.4 gal) tank — top up at every reasonable stop",
   "Luggage fitted and packed light — top-box/panniers/dry bags, nothing loose",
   "Intercoms paired, phone mounts and chargers fitted, a shakedown ride loaded"
 ]},
 {"sec":"Child-pillion setup (Aslan on the GS)","icon":"🧒","items":[
   "Properly fitting child motorcycle helmet (correct shell size, not an adult hand-me-down)",
   "Armoured jacket, gloves, pants and boots that fit; ear protection",
   "Feet reach the passenger pegs (lowered/peg brackets if needed)",
   "Passenger backrest / top-box backrest so he can't slide rearward",
   "Grab rail or grab strap at the waist; a child–adult tether is reassuring",
   "Intercom for Aslan; snacks, water, sun hat and a comfort item",
   "Plan stops every 60–90 minutes; never ride him overtired or after dark"
 ]},
 {"sec":"Ferry & passes","icon":"⛴️","items":[
   "Edmonds–Kingston ferry — no reservation needed for motorcycles; arrive 20–30 min early (bikes load first)",
   "Confirm Chinook Pass (SR-410) is open (WSDOT) for the Day-7 ride home",
   "Check the Mount Rainier National Park timed-entry reservation system for summer (Paradise corridor)",
   "Note that the Spirit Lake Hwy upper road / Johnston Ridge is closed — plan the viewpoint out-and-back"
 ]},
 {"sec":"Lodging","icon":"🏨","items":[
   "Book all six nights — Westport, Astoria, Yachats (×2), Castle Rock/Silver Lake, Packwood",
   "Book the Yachats stay FAR ahead — the coast sells out for the Fourth of July",
   "Confirm secure motorcycle parking + family/passenger rules at every property before booking",
   "Family room / beds; ask about laundry mid-trip if wanted"
 ]},
 {"sec":"Rider gear & packing","icon":"🧥","items":[
   "Armoured jacket & pants, gloves, riding boots (each rider)",
   "Rain layers AND warm base layers — coastal fog/wind and alpine chill at Chinook Pass",
   "Sun protection, earplugs, neck tube",
   "Pack light — soft luggage / dry bags",
   "Comfortable off-bike shoes & evening clothes"
 ]},
 {"sec":"Bike kit (carried by lead rider)","icon":"🔧","items":[
   "Basic tools + tyre repair/inflator",
   "First-aid kit",
   "Spare gloves / layers",
   "Phone mount + chargers / power bank",
   "Zip ties, tape, bungees"
 ]},
 {"sec":"Insurance & health","icon":"🛡️","items":[
   "Motorcycle insurance current on both bikes (passenger cover for Aslan)",
   "Roadside-assistance / breakdown cover",
   "Personal medications + small first-aid kit",
   "Note nearest hospitals on route (Aberdeen, Astoria, Newport, Morton/Packwood, Enumclaw)"
 ]},
 {"sec":"Money & connectivity","icon":"📱","items":[
   "Cards + some cash — small coast and mountain towns can be cash-friendly",
   "Download offline Google Maps for the coast and the Cascades (cell is spotty)",
   "Share the live route/plan with family back home"
 ]},
 {"sec":"Final day before","icon":"✅","items":[
   "Check the forecast and the Chinook Pass / Mount Rainier status",
   "Fuel both bikes and do the child-pillion setup test",
   "Charge intercoms, phones, cameras, power banks",
   "Final gear + luggage check; confirm the Day-1 ferry timing",
   "Get a good night's sleep — Day 1 starts with the ferry"
 ]}
]

# ============ GEO (routing points) ============
GEO = {
 "Woodinville, WA":"47.75530,-122.13389",
 "Edmonds Ferry Terminal, Edmonds, WA":"47.81298,-122.38424",
 "Hama Hama Oyster Saloon, Lilliwaup, WA":"47.54235,-123.04071",
 "Hoodsport, WA":"47.40636,-123.14058",
 "Aberdeen, WA":"46.97537,-123.81572",
 "Westport, WA":"46.89009,-124.10406",
 "Grays Harbor Lighthouse, Westport, WA":"46.88839,-124.11689",
 "Westhaven State Park, Westport, WA":"46.89565,-124.11964",
 "Raymond, WA":"46.68649,-123.73294",
 "South Bend, WA":"46.66315,-123.80461",
 "Long Beach, WA":"46.35232,-124.05432",
 "Cape Disappointment State Park, WA":"46.29955,-124.06538",
 "Astoria-Megler Bridge":"46.21577,-123.86221",
 "Astoria, OR":"46.18788,-123.83125",
 "Astoria Column, Astoria, OR":"46.18132,-123.81751",
 "Columbia River Maritime Museum, Astoria, OR":"46.18988,-123.82360",
 "Cannon Beach, OR":"45.89177,-123.96153",
 "Haystack Rock, Cannon Beach, OR":"45.88412,-123.96848",
 "Ecola State Park, OR":"45.91994,-123.96968",
 "Tillamook Creamery, Tillamook, OR":"45.48398,-123.84425",
 "Tillamook Air Museum, Tillamook, OR":"45.42073,-123.80360",
 "Cape Meares Lighthouse, OR":"45.48645,-123.97832",
 "Pacific City, OR":"45.20233,-123.96289",
 "Cape Kiwanda, Pacific City, OR":"45.21528,-123.96958",
 "Oregon Coast Aquarium, Newport, OR":"44.61765,-124.04725",
 "Newport, OR":"44.63678,-124.05345",
 "Yachats, OR":"44.31123,-124.10484",
 "Cape Perpetua, Yachats, OR":"44.28111,-124.10028",
 "Heceta Head Lighthouse, OR":"44.13738,-124.12812",
 "Sea Lion Caves, OR":"44.12178,-124.12671",
 "804 Trail, Yachats, OR":"44.32335,-124.10541",
 "Alsea, OR":"44.38189,-123.59707",
 "Corvallis, OR":"44.56464,-123.26196",
 "Longview, WA":"46.13817,-122.93817",
 "Castle Rock, WA":"46.27511,-122.90761",
 "Mount St. Helens Visitor Center, Silver Lake, WA":"46.29449,-122.82215",
 "Mount St. Helens":"46.19120,-122.19440",
 "Hoffstadt Bluffs, WA":"46.37370,-122.55860",
 "Coldwater Lake, WA":"46.29565,-122.25224",
 "Mossyrock, WA":"46.52955,-122.48511",
 "Morton, WA":"46.55844,-122.27510",
 "Packwood, WA":"46.60733,-121.67058",
 "Paradise, Mount Rainier National Park, WA":"46.78532,-121.73497",
 "Reflection Lakes, Mount Rainier, WA":"46.76950,-121.73200",
 "Narada Falls, Mount Rainier, WA":"46.77490,-121.74618",
 "Tipsoo Lake, WA":"46.86911,-121.51747",
 "Enumclaw, WA":"47.20427,-121.99150",
}

# ============ DAYART (region-matched scenic photos, keyed by day.d) ============
def _art(did, i):
    ph = DESTS[did]["photos"]
    return ph[i % len(ph)]["src"]
DAYART = {
 "1": _art("home",2),   "2": _art("cannon-beach",0), "3": _art("tillamook",9),
 "4": _art("yachats",0), "5": _art("st-helens",0), "6": _art("st-helens",1),
 "7": _art("rainier",0),
}

# ============ EMIT ============
def js(v, indent=0):
    pad = "  " * indent
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
        # inline short lists of scalars/strings
        if all(isinstance(x, (str, int, float, bool)) for x in v):
            joined = ", ".join(items)
            if len(joined) < 100:
                return "[" + joined + "]"
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
    keys = ["id","name","jp","region","type","days","legMiles"]
    o = []
    o.append("{")
    o.append('  id: %s,' % json.dumps(d["id"]))
    o.append('  name: %s,' % json.dumps(d["name"], ensure_ascii=False))
    o.append('  jp: %s,' % json.dumps(d["jp"], ensure_ascii=False))
    o.append('  region: %s,' % json.dumps(d["region"], ensure_ascii=False))
    o.append('  type: %s,' % json.dumps(d["type"]))
    o.append('  days: %s,' % json.dumps(d["days"], ensure_ascii=False))
    o.append('  legMiles: %d,' % d["legMiles"])
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

out.append('window.HOME = { city: "Woodinville", state: "WA" };')
out.append("window.FLIGHTS = " + js(FLIGHTS, 0) + ";\n")

out.append("/* Day-by-day schedule (Day 1–7). day.html builds a timed routine per day. */")
out.append("window.DAYS = [")
out.append(",\n".join(js(d, 1) for d in DAYS))
out.append("];\n")

out.append("/* Themed 'Coast Food Trail' foodie thread for Galiya;")
out.append("   rendered as a section on index.html and a 🦀 flag on the matching day pages. */")
out.append("window.FOOD_TRAIL = " + js(FOOD_TRAIL, 0) + ";\n")

out.append("/* Pre-trip preparation checklist (rendered by checklist.html). */")
out.append("window.CHECKLIST = " + js(CHECKLIST, 0) + ";\n")

out.append("/* Geocoded routing points (lat,lng) so Google Maps always resolves them. */")
out.append("window.GEO = " + js(GEO, 0) + ";\n")

out.append("/* Region-matched scenic photos used as each day's hero artwork (verified). */")
out.append("window.DAYART = " + js(DAYART, 0) + ";")

open(os.path.join(os.path.dirname(__file__), "data.js"), "w", encoding="utf-8").write("\n".join(out) + "\n")
print("wrote data.js")
print("DESTINATIONS:", len(ORDER), "DAYS:", len(DAYS))
print("ids:", ", ".join(ORDER))
# image url inventory
import collections
urls = set()
for i in ORDER:
    for ph in DESTS[i]["photos"]:
        urls.add(ph["src"])
for d in DAYS:
    for p in d["poi"]:
        if p.get("img"): urls.add(p["img"])
for v in DAYART.values(): urls.add(v)
for st in FOOD_TRAIL["stops"]:
    if st.get("photo"): urls.add(st["photo"])
print("unique image urls:", len([u for u in urls if u]))
