# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A static, dependency-free website that visualizes a 21-day family motorcycle tour of Japan. It is designed to be served as-is from GitHub Pages — there is **no build step, no package manager, and no test suite**. Files are plain HTML/CSS/JS opened directly by the browser.

The project is organized as **content → site**: trip facts live as markdown in [`tour/`](tour/README.md) (maintained by the **tour-expert** agent); the website (`data.js` + HTML) is the rendering of that content (maintained by the **website-builder** agent). See [`.claude/agents/`](.claude/agents/) and [`docs/GENERATION.md`](docs/GENERATION.md). Flow: `tour/*.md → data.js → index.html + place.html`.

## Commands

```bash
# Preview locally (any static server works); then open http://127.0.0.1:8000/
python3 -m http.server 8000 --bind 127.0.0.1
```

Deploy = push to `main`. **GitHub Pages builds via GitHub Actions** (`.github/workflows/deploy.yml`), which injects the Google Maps key from the `GMAPS_KEY` repo secret into `gmaps-key.js` at deploy time, then publishes. Pages source = "GitHub Actions" (not branch).

## Layout

```
tour/                  human-readable source of record (tour-expert owns)
  README.md  00-overview.md  01-itinerary.md  02-flights.md
  destinations/NN-id.md   one per stop, route order
data.js                machine-readable build artifact (website-builder owns)
index.html  place.html  day.html  checklist.html   the rendered site (root)
gmaps-key.js           UNTRACKED — window.GMAPS_KEY; from ~/google_maps.key locally, CI secret in deploy
.github/workflows/deploy.yml   Pages deploy + key injection
docs/GENERATION.md     how it was built + the agent workflow
summary.md             the original brief
.claude/agents/        tour-expert.md, website-builder.md
```

## Architecture

Three web source files plus the trip brief:

- **`data.js`** — the single source of truth. Defines `window.DESTINATIONS`, an ordered array of the 16 route stops. Each entry holds everything shown anywhere on the site: `id`, `name`, `jp`, `region`, `type`, `days`, coordinates (`lat`/`lng`/`zoom`), `tagline`, `intro[]`, `highlights[]`, `food[]`, `hotels[]`, `links[]`, and `photos[]`. The array **order is the route order** (drives prev/next nav, the map polyline, and the day sequence). The `U` constant is the Wikimedia Commons thumbnail URL prefix that every `photos[].src` is built from.
- **`index.html`** — the landing page. Self-contained (inline CSS + JS) except it loads `data.js`. Builds the route ribbon, the destination gallery, the Seattle flights block, the Leaflet overview map, and the 21-day itinerary timeline — all **from `window.DESTINATIONS` / `window.DAYS`**; do not hardcode trip data here. Day cards deep-link to `day.html?d=<n>`; map markers and the "Destination ↗" link go to `place.html?id=<id>`.
- **`window.DAYS`** (in `data.js`) — the 21-day itinerary: each day has `d`, `id` (its destination), `miles`, `rest`, `region`, `title`, `route`, `desc`, `tags`, Google-Maps endpoints `gfrom`/`gto`/`gvia`, and a `poi[]` list of along-the-way stops (`name`, `what`, `q` map-query, `slot`). Days don't map 1:1 to destinations (some destinations span multiple days), so this is a separate array from `DESTINATIONS`.
- **`place.html`** — one reusable template for every destination detail page. Reads `?id=`, renders hero/gallery/food/hotels/links/map/prev-next from `window.DESTINATIONS`. Linked as `place.html?id=<id>`.
- **`day.html`** — one reusable template for every day. Reads `?d=<n>`, and from `window.DAYS[n-1]` builds: a **photo-collage hero** (montage of the day's stop images), a **summary section** ("The Plan for the Day"), a **timed routine** (wake/coffee/breakfast/departure + POI stops timed from the real per-day drive time `dmin` spread across the route + dwell), per-stop "Route from <prev>" links, the **Google Maps embedded day route** (start hotel → all stops → end hotel), photos, and prev/next-day nav. Each riding day carries real `miles` + `dmin` (Google Directions). Linked as `day.html?d=<n>`.
- **`checklist.html`** — interactive pre-trip checklist rendered from `window.CHECKLIST` (sections of items: bikes, hotels, flights, IDP/licence, insurance, gear, packing…). Ticks persist in `localStorage`; has a progress bar and print/PDF.
- **`summary.md`** — the original trip brief (goals, rider/safety constraints, route, lodging rules). Treat it as the requirements doc.

`type` is one of `start | stay | stop | end` and controls marker/dot color (`stay` = 2-night rest base).

**Maps:** `place.html` and `day.html` use the **Google Maps Embed API** (`window.gmapEmbedPlace` / `gmapEmbedDir` helpers in `data.js`) when `window.GMAPS_KEY` is set, and **fall back to Leaflet** when it isn't. `index.html` overview uses Leaflet (no key needed). The key is never committed (see Layout).

**Distances/times** are real **Google Directions API** figures baked into `window.DAYS` (`miles` + `dmin`) and `legMiles` (direct, from coordinates) — never a flat-speed estimate. To recompute, read the key from `~/google_maps.key` and call the Directions API (see the tour-expert agent for the exact method + sanity checks).

## Conventions

- **Verify every image URL before committing it.** All `photos[].src` (and POI `img`) are Wikimedia Commons thumbnails; a broken URL renders broken on Pages. Confirm HTTP 200 before adding. The Commons search API rate-limits aggressively; space out batch requests.
- **Never commit the Google Maps key.** It lives in `~/google_maps.key` (untracked) → `gmaps-key.js` (gitignored) locally, and the `GMAPS_KEY` Actions secret in deploy. `data.js` must stay key-free.
- Hotel suggestions are framed "confirm before booking" (motorcycle parking, passenger/child rules) — keep that caveat in `hotels[]`.
- Source-of-record is `tour/*.md`; `data.js` mirrors it; the HTML renders `data.js`. When trip facts change, the regen scripts re-derive `tour/01-itinerary.md`, the destination files and the totals — keep the homepage total, itinerary, legs and docs in sync.
