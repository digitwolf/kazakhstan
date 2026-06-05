# 🏍️ Japan Family Motorcycle Tour

A scenic, family-friendly **21-day motorcycle tour of Japan**, visualized as a static website and tracked as organized markdown.

### 🔗 Live site: **https://digitwolf.github.io/japan-tour/**

A premium, safety-first ADV-style **paved** touring trip for a family of three — an experienced rider with a 6-year-old passenger and a newer-rider partner whose pace sets the group. Tokyo → Hakone → Fuji → Shikoku → Shimanami Kaido → Seto Inland Sea → Kansai, round-trip from Seattle.

## Features

- **Interactive route map** (Leaflet) with all 16 stops and the full polyline.
- **21-day itinerary** with per-day mileage (≈ 1,280 mi total) and a **Google Maps route** for every day.
- **16 destination pages** — each with 10 verified photos, a map, things to do, regional food, and hotels with ¥ + USD pricing and **motorcycle-parking** info.
- **Getting there from Seattle** — open-jaw flight plan (into Tokyo, home from Osaka) with indicative fares and booking links.
- Tap any day or map marker to jump to its destination; tap a destination's photo for a lightbox.

## Project layout

```
index.html  place.html  data.js   the static site (served from repo root)
tour/                              human-readable source of record (markdown)
  README.md 00-overview.md 01-itinerary.md 02-flights.md
  destinations/NN-id.md            one per stop, in route order
docs/GENERATION.md                 how it was built + the agent workflow
summary.md                         the original trip brief
CLAUDE.md                          guidance for Claude Code
.claude/agents/                    tour-expert + website-builder agents
```

Content flows **`tour/*.md` → `data.js` → HTML**. `data.js` (`window.DESTINATIONS`) is the single source the pages render from.

## Run locally

No build step, no dependencies — it's plain HTML/CSS/JS.

```bash
python3 -m http.server 8000 --bind 127.0.0.1
# then open http://127.0.0.1:8000/
```

## Deploy

Hosted on **GitHub Pages** from `main` / root. Every push to `main` auto-rebuilds:

```bash
git add -A && git commit -m "…" && git push
# live in ~30–60s; hard-refresh (Ctrl/Cmd+Shift+R) to bust the cache
```

## Maintained by two agents

| Agent | Owns | Job |
|-------|------|-----|
| **tour-expert** | `tour/*.md` | Curates the trip — destinations, days, hotels, food, flights, mileage, routes. |
| **website-builder** | `data.js`, `index.html`, `place.html` | Renders `tour/` into the site and verifies it (image 200s, JS balance, local serve). |

See [`docs/GENERATION.md`](docs/GENERATION.md) for the full build story.

## Notes

Itinerary, hotels, prices, and flight fares are **indicative planning suggestions** — confirm exact rates, secure motorcycle parking, and that passenger / child-passenger riding is allowed before booking. Photos are from Wikimedia Commons.
