# How this project was generated

A record of how the Kazakhstan–Kyrgyzstan ADV loop site was built, and the two-agent workflow that maintains it. (The repo began life as a 21-day Japan tour, became a 7-day Pacific-Northwest family tour, and was then converted to this 16-day Central-Asia ADV loop — the architecture is unchanged through all three.)

## Origin
The trip is a **16-day guided adventure ride** (Day 1 arrival + a 14-day tour body of 1 training day, 12 riding days and 1 rest day + Day 16 departure), a custom extended loop edition of Silk Off Road Tours' "From Desert Up to Glaciers" (their published 10-day Almaty→Bishkek route), presented in the style of a Morocco anchor-point ADV tour. Because the participants aren't fixed, the plan is **anchor-first**: five pre-booked must-see anchors (Altyn-Emel, Karakol, Issyk-Kul south shore — the rest-day anchor, Song-Kol, Kolsai/Saty) with multiple graded route options between them (see `tour/03-anchors-and-options.md`). Rental Suzuki DR650SE, ride leader + support vehicle, ~2,800 km, ~60/40 asphalt/dirt, passes to 4,021 m, two Kegen/Karkara border crossings.

## How it's built
Content lives as markdown in [`tour/`](../tour/README.md) and is compiled to `data.js` by **`gen_data.py`**:

- **`gen_data.py`** parses `tour/destinations/NN-id.md` into `window.DESTINATIONS`, and holds the curated `COORDS`, the 16-day `DAYS` schedule (with along-the-way `poi[]` stops), `GEO` routing points, the `ANCHORS` + `SEGMENTS` option model, the `CHECKLIST`, the `FOOD_TRAIL`, and `DAYART`. Run `python3 gen_data.py` to rebuild `data.js`.
- **`index.html`** — landing page: hero, "how the trip works", the anchors-and-options section, Leaflet route map (dark CARTO tiles), destination gallery, the Silk Road Food Trail, a day-by-day timeline. CDN-only, no build step.
- **`place.html`** — one reusable template rendering any stop from `?id=` (hero with distance overlay, anchor badge, gallery + lightbox, food, lodging cards with USD price, map, prev/next).
- **`day.html`** — one reusable template rendering any day from `?d=N` (photo-collage hero, the plan, segment/option banner, a timed routine spread across the real `dmin`, per-stop Wikipedia links, the Google-Maps day route, prev/next-day).
- **`checklist.html`** — interactive pre-trip checklist from `window.CHECKLIST`, ticks saved in `localStorage`.

## Distances & ride times
Per-day km on operator-published legs are **the operator's official figures, kept verbatim** (much of the route — park pistes, high passes, the Karkara border track — is off Google's road graph). New loop legs use Google Directions figures where routable and flagged estimates elsewhere; ride times assume honest mixed-terrain averages, not flat speeds. Trip total ≈ **2,800 km** (planned legs sum 2,809 km) over 13 riding days incl. the training day; longest Day 14 (325 km incl. the border), shortest the ~110 km Karakol day loop.

## Key constraints
- **GitHub Pages** serves static files from the repo root with no build — keep the HTML at root.
- **Verify every image URL** (Wikimedia Commons) before committing; broken URLs render as broken pages.
- Dates/prices are *indicative* — a custom edition; the site says "confirm with the operator".
- The Google Maps key is never committed (untracked `gmaps-key.js` locally; CI secret in deploy).
- **Distances are km, prices are USD** site-wide.

## The two-agent workflow
| Agent | Owns | Job |
|-------|------|-----|
| **tour-expert** | `tour/*.md` | Plans & curates the trip — anchors, options, destinations, days, lodging, food, borders/logistics, distances, routes. The source of record. |
| **website-builder** | `gen_data.py`, `data.js`, the HTML | Compiles `tour/` markdown into the static site and verifies it (image 200s, JS balance, local serve). |

Content flows **`tour/` → `data.js` → HTML**. Change trip facts via the tour-expert; rebuild the site via the website-builder.
