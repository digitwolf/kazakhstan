# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A static, dependency-free website that visualizes a **16-day Kazakhstan–Kyrgyzstan ADV motorcycle loop** ("From Desert Up to Glaciers — the Loop": Almaty → Altyn-Emel → Chundzha → Charyn Canyon → Karakol → Issyk-Kul south shore → Song-Kol → Suusamyr → Bishkek → Cholpon-Ata → Kolsai/Saty → Almaty, planned Sep 5–20, 2026). It is designed to be served as-is from GitHub Pages — there is **no build step, no package manager, and no test suite**. Files are plain HTML/CSS/JS opened directly by the browser. (The repo started as a Japan tour, became a PNW family tour, and was converted; the machinery is unchanged.)

The project is organized as **content → site**: trip facts live as markdown in [`tour/`](tour/README.md) (maintained by the **tour-expert** agent); the website (`data.js` + HTML) is the rendering of that content (compiled by `gen_data.py`, maintained by the **website-builder** agent). See [`.claude/agents/`](.claude/agents/) and [`docs/GENERATION.md`](docs/GENERATION.md). Flow: `tour/*.md + gen_data.py → data.js → index/place/day/checklist.html`.

The trip: a **guided group ADV tour** (6–10 riders, ride leader, support vehicle) on a rental **Suzuki DR650SE**, a custom extended edition of [Silk Off Road Tours' 10-day route](https://www.silkoffroadtours.com/motorcycle-tours-kazakhstan-kyrgyzstan), presented Morocco-ADV style. ~2,800 km, ~60% asphalt / 40% gravel-dirt, passes to **Suek 4,021 m**, two Kegen/Karkara border crossings. The rider of record is **Ruslan** (experienced; R1300GS at home, prior Morocco ADV tour).

**The plan is anchor-first and flexible** (participants aren't fixed): **5 pre-booked must-see anchors** — Altyn-Emel, Karakol, Issyk-Kul south shore (★ mid-trip rest-day anchor), Song-Kol, Kolsai/Saty — with **graded route options between them** (`tour/03-anchors-and-options.md` → `window.ANCHORS`/`window.SEGMENTS`). The 16-day itinerary (Day 1 arrival, **Day 2 training day**, **Day 8 rest day**, Day 16 departure) is the *reference line* through the reference options. Keep this model intact when changing routes.

## Commands

```bash
# Rebuild data.js from tour/ markdown after any content change
python3 gen_data.py

# Preview locally (any static server works); then open http://127.0.0.1:8000/
python3 -m http.server 8000 --bind 127.0.0.1
```

Deploy = push to `main`. **GitHub Pages builds via GitHub Actions** (`.github/workflows/deploy.yml`), which injects the Google Maps key from the `GMAPS_KEY` repo secret into `gmaps-key.js` at deploy time, then publishes. Pages source = "GitHub Actions" (not branch).

## Layout

```
tour/                  human-readable source of record (tour-expert owns)
  README.md  00-riders.md  00-overview.md  01-itinerary.md
  02-getting-started.md  03-anchors-and-options.md
  destinations/NN-id.md   one per stop, route order (almaty, altyn-emel, chundzha,
                          karakol, issyk-kul, kochkor, song-kol, suusamyr,
                          bishkek, cholpon-ata, saty)
gen_data.py            compiles tour/ markdown (+ curated COORDS/DAYS/GEO/ANCHORS/SEGMENTS/CHECKLIST/FOOD_TRAIL) → data.js
data_header.txt        the data.js header + JS helpers (maps, hotel image/parking)
data.js                machine-readable build artifact (website-builder owns) — DO NOT hand-edit; regenerate
index.html  place.html  day.html  checklist.html   the rendered site (root)
gmaps-key.js           UNTRACKED — window.GMAPS_KEY; from ~/google_maps.key locally, CI secret in deploy
.github/workflows/deploy.yml   Pages deploy + key injection
docs/GENERATION.md     how it was built + the agent workflow
summary.md             the trip brief
.claude/agents/        tour-expert.md, website-builder.md
```

## Architecture

- **`gen_data.py`** — the build script. Parses `tour/destinations/NN-id.md` into `window.DESTINATIONS`, and holds the curated `COORDS`, the **16-day `DAYS`** schedule, `GEO` routing points, the **`ANCHORS` + `SEGMENTS`** option model, `CHECKLIST`, `FOOD_TRAIL`, `FLIGHTS` (the "how the trip works" block), and `DAYART`. Re-run after any change; it must stay byte-reproducible.
- **`data.js`** — the generated single source the pages read. `window.DESTINATIONS` is the ordered array of the **11 route stops**; each entry has `id`, `name`, `region`, `type`, `days`, `lat`/`lng`/`zoom`, `tagline`, `intro[]`, `highlights[]`, `food[]`, `hotels[]` (USD prices), `links[]`, `photos[]`. **Array order = route order** (drives prev/next, the map polyline, the day sequence). `U` is the Wikimedia Commons thumbnail prefix.
- **`window.DAYS`** — the **16-day itinerary**: per day `d`, `id` (that night's destination), km, `dmin` (honest mixed-terrain minutes), `rest`, `region`, `title`, `route`, `desc`, `tags`, segment/option refs, `gfrom`/`gto`/`gvia`, and a `poi[]` of along-the-way stops. Days don't map 1:1 to destinations (2-night stays at Karakol and Issyk-Kul; Almaty holds Days 1–2 and 15–16).
- **`window.ANCHORS` / `window.SEGMENTS`** — the flexible plan: 5 anchors and 6 segments, each segment with graded options (reference vs alternates; days, km + estimate flags, difficulty, `via[]` waypoints, `geo[]` polyline chain). `index.html` renders the anchors-and-options section and the color-coded map routes from these.
- **`index.html`** — landing page. Hero, stats, "how the trip works" (`window.FLIGHTS`), the anchors & options section, the Leaflet overview map, destination gallery, the Silk Road Food Trail (`window.FOOD_TRAIL`), the 16-day timeline — all **from `data.js`**; don't hardcode trip data here.
- **`place.html`** — one reusable destination template (`?id=`): hero with distance overlay, anchor badge, gallery + lightbox, food, lodging cards, map, prev/next.
- **`day.html`** — one reusable day template (`?d=N`): photo-collage hero, the plan, segment/option banner, a timed routine spread across the real `dmin`, per-stop Wikipedia links, interest badges (`INTEREST` map), the Google-Maps day route, prev/next-day.
- **`checklist.html`** — interactive pre-trip checklist from `window.CHECKLIST`; ticks persist in `localStorage`.

`type` is one of `start | stay | stop | end` and controls marker/dot color. `almaty` is `start` (and the loop's finish); `karakol` and `issyk-kul` are `stay` (2-night bases); `saty` is `end` (last overnight before home).

**Maps:** `place.html` and `day.html` use the **Google Maps Embed API** (`window.gmapEmbedPlace` / `gmapEmbedDir` in `data.js`) when `window.GMAPS_KEY` is set, and **fall back to Leaflet** when it isn't. `index.html` overview uses Leaflet (no key). The key is never committed. Several legs (park pistes, the high passes, the Karkara border) are **off Google's road graph** — routes there are drawn as marker chains/geodesics, not Directions routes.

## Conventions

- **Distances are km; prices are USD.** No currency conversion (`window.priceUSD` is a no-op passthrough). Never re-introduce miles.
- **Operator figures are verbatim.** Legs published by Silk Off Road (250/280/190/200/130/240/153 km) are kept as-is; new-option legs are Directions figures or flagged estimates ("~", "confirm with the operator").
- **Verify every image URL before committing it.** All `photos[].src` / POI `img` are Wikimedia Commons thumbnails; a broken URL renders broken on Pages. Confirm HTTP 200 (the Commons API rate-limits — space out batch requests, or verify via the imageinfo API).
- **Never commit the Google Maps key.** `~/google_maps.key` (untracked) → `gmaps-key.js` (gitignored) locally; `GMAPS_KEY` Actions secret in deploy. `data.js` stays key-free.
- **Keep the anchor model.** Anchors are fixed must-sees; flexibility lives in the segment options. Route changes should change options, not silently rewrite anchors.
- Everything is framed "confirm with the operator" (dates, custom-edition price, single supplement, lodging) — keep that caveat.
- Source-of-record is `tour/*.md`; `gen_data.py` compiles it to `data.js`; the HTML renders `data.js`. When trip facts change, re-run `gen_data.py` and keep the homepage totals, itinerary, legs and docs in sync.
