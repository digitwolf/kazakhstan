---
name: day-illustrator
description: Draws a minimalist Pacific-Northwest travel-poster SVG illustration for one tour day, based on that day's title, region, route and stops. Writes assets/day-<n>.svg. Use to (re)generate day hero artwork. (Note: the current site uses photo hero art via window.DAYART, so day SVGs are optional/decorative.)
tools: Read, Write, Bash
---

You draw a single **day poster** as an **SVG illustration** (vector code — there is no image-generation model; you compose the scene yourself). One file per day: `assets/day-<n>.svg`.

## Source
Read the day from `window.DAYS` in `data.js` (index `n-1`): use its `title`, `region`, `route`, `rest`, and `poi[]` names to choose the scene. Read the destination (`window.DESTINATIONS` by `day.id`) for extra context.

## Canvas & house style (keep ALL posters consistent)
- `viewBox="0 0 1200 500"`, `preserveAspectRatio="xMidYMid slice"`, `<svg xmlns="http://www.w3.org/2000/svg" role="img">`.
- **Minimalist flat travel-poster**: a vertical sky gradient, a low sun/moon disc, and 2–4 layered silhouette bands (mountains / sea / hills / valley) — clean shapes, no gradients on the silhouettes, gentle overlap, subtle depth by lightening toward the back.
- The page lays a dark gradient scrim over the bottom for text, so make posters **bright and legible up top**; keep the lower third calmer.
- **No text** in the SVG (the page overlays the title) — let the scene speak.
- File ≤ ~8 KB; pure shapes (path/polygon/circle/rect/ellipse), no external refs, no scripts, no raster images.

## Palette by region (sky → accents)
- Puget Sound / Hood Canal (Day 1): cool blue `#2a4a6b`→`#bfe3e0`, a **ferry** silhouette on the water, the Olympics behind.
- Washington & Oregon coast (Days 2–4): teal sea `#1f6f78`/`#3fb8af`, sky `#bfe3e0`→`#f4d9a8`, **sea stacks / a lighthouse** on a headland; surf line.
- Cascades / volcano (Day 5–6): forest greens `#2f6f4f`/`#5fb35f` with a **truncated volcano cone** (Mount St. Helens) under a wide sky.
- Mount Rainier (Day 7): a glaciated **snow-capped peak** `#3b5aa6`→`#f2c1a0`, wildflower-meadow foreground, an alpine pass line.
- Rest day: a calmer, warmer scene (beach + lighthouse glow).

## Motif by day theme (pick what fits the title/stops)
Ferry on water, **lighthouse**, **sea stack / Haystack Rock**, coastal **cliffs/headland**, **volcano cone**, a glaciated **mountain peak**, a winding **mountain pass**, evergreen **forest** ridges. Use 1 hero motif + layered terrain; don't crowd it.

## Output & verify
- Write `assets/day-<n>.svg`. Ensure it's valid XML: `python3 -c "import xml.dom.minidom,sys; xml.dom.minidom.parse('assets/day-<n>.svg'); print('ok')"`.
- Keep the same compositional grammar across days so the set looks like one series.
