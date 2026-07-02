# 🏍️ From Desert Up to Glaciers — Kazakhstan & Kyrgyzstan ADV Loop

A guided **16-day adventure-motorcycle loop across Kazakhstan and Kyrgyzstan**, visualized as a static website and tracked as organized markdown.

**Almaty → Altyn-Emel (Singing Dune) → Chundzha hot springs → Charyn Canyon → Karakol → over Suek Pass (4,021 m) to Issyk-Kul → Song-Kol → Suusamyr → Bishkek → Cholpon-Ata → Kolsai Lakes → Almaty**, planned Sep 5–20, 2026 — ~2,800 km, ~60% asphalt / 40% gravel and dirt, on a rental **Suzuki DR650SE** with a ride leader and support vehicle (a custom extended edition of [Silk Off Road Tours](https://www.silkoffroadtours.com/motorcycle-tours-kazakhstan-kyrgyzstan)' 10-day route, presented Morocco-ADV style).

- **Flexible anchor-point plan** — participants aren't fixed yet, so **5 must-see anchors** are booked (Altyn-Emel ★ Karakol ★ Issyk-Kul south shore ★ Song-Kol ★ Kolsai/Saty) with **multiple route options between them**, chosen to fit the group.
- The 14-day tour body opens with an **easy training day** and holds a **mid-trip rest day** at the Issyk-Kul yurt-camp anchor.
- Two Kegen/Karkara border crossings, three yurt-camp nights, passes to **4,021 m**.

## Features

- **Anchors & options view** — the 5 anchors as a spine with color-coded option cards (easy/moderate/hard) between them, and the reference route vs alternates drawn on the map.
- **Interactive route map** (Leaflet) with all 11 stops and the full loop polyline.
- **16-day reference itinerary** with per-day km, honest mixed-terrain ride times, and a **Google Maps route** for every day.
- **11 destination pages** — each with verified photos, a map, things to do, regional food, and lodging with USD pricing.
- **Silk Road Food Trail** — beshbarmak, plov, laghman, ashlan-fuu in Karakol, kumis & boorsok in the Song-Kol yurts.
- Tap any day or map marker to jump to its destination; tap a destination's photo for a lightbox.

## Project layout

```
index.html  place.html  day.html  checklist.html  data.js   the static site (served from repo root)
tour/                              human-readable source of record (markdown)
  README.md 00-riders.md 00-overview.md 01-itinerary.md
  02-getting-started.md 03-anchors-and-options.md
  destinations/NN-id.md            one per stop, in route order
gen_data.py                        builds data.js from tour/ markdown + curated coords/days/segments
docs/GENERATION.md                 how it was built + the agent workflow
summary.md                         the trip brief
CLAUDE.md                          guidance for Claude Code
.claude/agents/                    tour-expert + website-builder agents
```

Content flows **`tour/*.md` + `gen_data.py` → `data.js` → HTML**. `data.js` (`window.DESTINATIONS`, `window.DAYS`, `window.ANCHORS`, `window.SEGMENTS`) is the single source the pages render from.

## Run locally

No build step, no dependencies — it's plain HTML/CSS/JS.

```bash
python3 -m http.server 8000 --bind 127.0.0.1
# then open http://127.0.0.1:8000/
```

To regenerate `data.js` after changing `tour/` content: `python3 gen_data.py`.

## Deploy

Hosted on **GitHub Pages** from `main` / root (the Google Maps key is injected from a CI secret at deploy time). Every push to `main` auto-rebuilds.

## Maintained by two agents

| Agent | Owns | Job |
|-------|------|-----|
| **tour-expert** | `tour/*.md` | Curates the trip — anchors, options, destinations, days, lodging, food, borders/logistics, distances, routes. |
| **website-builder** | `gen_data.py`, `data.js`, the HTML | Renders `tour/` into the site and verifies it (image 200s, JS balance, local serve). |

See [`docs/GENERATION.md`](docs/GENERATION.md) for the full build story.

## Notes

Dates, itinerary, hotels, and prices are **indicative planning figures — this is a custom edition; confirm dates, price, and every extension leg with the operator**. Operator-published leg distances are kept verbatim; new-option legs are flagged estimates. Photos are from Wikimedia Commons, each verified.
