# How this project was generated

A record of how the Japan family motorcycle-tour site was built, and the two-agent workflow that now maintains it.

## Origin
The project started from a single brief, [`summary.md`](../summary.md): a 3-week, family-friendly, paved ADV motorcycle tour of Japan (experienced rider + 6-year-old passenger + newer-rider wife), with a preferred route and constraints (safety-first, 4–6h days, onsen rest bases, no off-road).

## Build sequence (what happened, in order)
1. **Route → itinerary.** Derived a concrete 21-day plan from the brief's high-level route and its five preferred 2-night rest bases (Hakone, Iya/Oboke, Shimanto, Dogo, Onomichi).
2. **Landing page.** Built `index.html`: hero, Leaflet route map (dark CARTO tiles), route ribbon, filterable day-by-day timeline, safety + parameters sections. CDN-only, no build step.
3. **Single source of truth.** Factored all stop content into `data.js` (`window.DESTINATIONS`), consumed by both the landing page and the detail template.
4. **Destination subpages.** Added `place.html`, one reusable template rendering any stop from `?id=` (hero, gallery, food, hotels, map, prev/next).
5. **Photos.** Pulled images from the **Wikimedia Commons** search API, **verifying every URL returns HTTP 200** before embedding (the API rate-limits hard, so requests are spaced ~7s). Grew to **10 photos per destination (160 total)**, iconic image first.
6. **Flights from Seattle.** Added an open-jaw plan (fly into Tokyo/Haneda, home out of Osaka/Kansai) with indicative fares from public flight-search data and clickable Expedia/Google-Flights deep links. (Live scraping isn't possible — Expedia returns HTTP 429 to bots.)
7. **Hotels enriched.** Each suggestion got an indicative ¥ price, a USD conversion (≈ ¥150 = $1), a representative-by-type photo, a booking link, and a **motorcycle-parking badge** (every property selected for bike parking).
8. **Mileage + routes.** Per-day riding miles (≈1,280 total) shown on day cards and overlaid on each destination hero; each day links to a **Google Maps start→end route** (waypoints for multi-stop days); each day card deep-links to its destination page.
9. **Reorganization.** Extracted the trip content into the [`tour/`](../tour/README.md) markdown directory as the human-readable source of record, and defined the two agents below.

## Key constraints learned
- **GitHub Pages** serves static files from the repo root with no build — keep `index.html` at root.
- **Verify every image URL** (Wikimedia) before committing; broken URLs render as broken pages.
- **Flight/booking sites block bots** — provide deep links + indicative figures, don't scrape.
- Hotels/flights/prices are *indicative* and must be confirmed when booking; the site says so.

## The two-agent workflow
Going forward the project is maintained by two specialized agents (see [`.claude/agents/`](../.claude/agents/)):

| Agent | Owns | Job |
|-------|------|-----|
| **tour-expert** | `tour/*.md` | Plans & curates the trip — destinations, days, hotels, food, flights, mileage, routes. The source of record. |
| **website-builder** | `data.js`, `index.html`, `place.html` | Converts `tour/` markdown into the static site and verifies it (image 200s, JS balance, local serve). |

Content flows **`tour/` → `data.js` → HTML**. Change trip facts via the tour-expert; rebuild the site via the website-builder.
