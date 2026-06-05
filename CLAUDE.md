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

Deploy = push to GitHub and enable Pages (Settings → Pages → Build from branch → `main` / root). No CI.

## Layout

```
tour/                  human-readable source of record (tour-expert owns)
  README.md  00-overview.md  01-itinerary.md  02-flights.md
  destinations/NN-id.md   one per stop, route order
data.js                machine-readable build artifact (website-builder owns)
index.html  place.html the rendered site (root, for GitHub Pages)
docs/GENERATION.md     how it was built + the agent workflow
summary.md             the original brief
.claude/agents/        tour-expert.md, website-builder.md
```

## Architecture

Three web source files plus the trip brief:

- **`data.js`** — the single source of truth. Defines `window.DESTINATIONS`, an ordered array of the 16 route stops. Each entry holds everything shown anywhere on the site: `id`, `name`, `jp`, `region`, `type`, `days`, coordinates (`lat`/`lng`/`zoom`), `tagline`, `intro[]`, `highlights[]`, `food[]`, `hotels[]`, `links[]`, and `photos[]`. The array **order is the route order** (drives prev/next nav, the map polyline, and the day sequence). The `U` constant is the Wikimedia Commons thumbnail URL prefix that every `photos[].src` is built from.
- **`index.html`** — the landing page. Self-contained (inline CSS + JS) except it loads `data.js`. Builds the route ribbon, the destination gallery, and the Leaflet overview map **from `window.DESTINATIONS`** — do not hardcode stop data here. The day-by-day itinerary lives in a separate `DAYS` array inlined in this file's `<script>` (it is NOT in `data.js` because days don't map 1:1 to destinations — some destinations span multiple days, some days share a destination).
- **`place.html`** — one reusable template for every destination detail page. Reads `?id=` from the query string, finds the matching entry in `window.DESTINATIONS`, and renders hero/gallery/food/hotels/links/map/prev-next. Linked as `place.html?id=<id>`. Adding a destination to `data.js` automatically gives it a working detail page.
- **`summary.md`** — the original trip brief (goals, rider/safety constraints, route, lodging rules). The itinerary and destination content are derived from this; treat it as the requirements doc.

`type` is one of `start | stay | stop | end` and controls marker/dot color everywhere (`stay` = 2-night rest base). Maps use Leaflet + CARTO dark tiles, loaded from CDN in both HTML files.

## Conventions

- **Verify every image URL before committing it.** All `photos[].src` are Wikimedia Commons thumbnails; a broken URL renders as a broken page on Pages. Confirm HTTP 200 (following redirects) before adding — e.g. `curl -s -o /dev/null -w "%{http_code}" -I "<url>"`. The Commons search API rate-limits aggressively; space out batch requests.
- Hotel suggestions are intentionally framed as "confirm before booking" (motorcycle parking, passenger/child rules) — keep that caveat when editing `hotels[]`.
- To change route content (stops, photos, food, hotels, links, coordinates), edit **`data.js` only**; both HTML files pick it up. Editing `DAYS` in `index.html` only changes the itinerary timeline.
