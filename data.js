/* ============================================================
   "From Desert Up to Glaciers" — the Loop — destination data
   Generated from tour/ markdown by gen_data.py (website-builder).
   Shared by index.html, place.html, day.html and checklist.html.
   A 16-day guided ADV motorcycle loop, Almaty → Almaty across
   Kazakhstan & Kyrgyzstan (Sep 5–20, 2026): ≈ 2,800 km, ~60%
   asphalt / 40% gravel-dirt, rental Suzuki DR650SE, guided by
   Silk Off Road Tours with a ride leader and support truck.
   DISTANCES ARE KILOMETRES site-wide; prices are USD.
   Photos: Wikimedia Commons (all URLs verified reachable).
   Lodging is booked by the operator — independent suggestions
   are indicative; confirm parking and rates before booking.
   ============================================================ */
const U = "https://upload.wikimedia.org/wikipedia/commons/thumb/";

/* Google Maps Embed API key — NEVER hardcoded here / committed.
   Provided at runtime by the untracked gmaps-key.js (generated from ~/google_maps.key
   locally, injected from a CI secret in deploy). Maps gracefully fall back to Leaflet
   when no key is present. Restrict the key by HTTP referrer + API in Cloud Console. */
window.GMAPS_KEY = window.GMAPS_KEY || "";
/* Resolve a routing point to "lat,lng" via window.GEO (appended below) so Google
   always finds it — falls back to the raw text if not geocoded. */
window.geoResolve = function (s) { return (window.GEO && window.GEO[s]) || s; };
/* Build a Google Maps Embed directions URL (start → stops → end), by coordinates. */
window.gmapEmbedDir = function (origin, dest, waypoints) {
  const R = window.geoResolve;
  let u = "https://www.google.com/maps/embed/v1/directions?key=" + window.GMAPS_KEY +
    "&origin=" + encodeURIComponent(R(origin)) + "&destination=" + encodeURIComponent(R(dest)) + "&mode=driving";
  if (waypoints && waypoints.length) u += "&waypoints=" + encodeURIComponent(waypoints.map(R).join("|"));
  return u;
};
/* Build a clickable Google Maps directions link (maps/dir), by coordinates. */
window.gmapDirLink = function (origin, dest, waypoints) {
  const R = window.geoResolve;
  let u = "https://www.google.com/maps/dir/?api=1&origin=" + encodeURIComponent(R(origin)) +
    "&destination=" + encodeURIComponent(R(dest)) + "&travelmode=driving";
  if (waypoints && waypoints.length) u += "&waypoints=" + encodeURIComponent(waypoints.map(R).join("|"));
  return u;
};
/* Build a Google Maps Embed place URL (by coordinates when known). */
window.gmapEmbedPlace = function (q, zoom) {
  return "https://www.google.com/maps/embed/v1/place?key=" + window.GMAPS_KEY +
    "&q=" + encodeURIComponent(window.geoResolve(q)) + (zoom ? "&zoom=" + zoom : "");
};

/* Per-stop Wikipedia link. Prefers a verified English-Wikipedia article URL (the
   optional `wiki` field on a POI / a passed override); otherwise falls back to a
   Wikipedia search link, which always resolves. Dependency-free. */
window.wikiLink = function (name, wiki) {
  if (wiki) return wiki;
  return "https://en.wikipedia.org/wiki/Special:Search?search=" + encodeURIComponent(name || "");
};

/* Hotel prices are already in USD (e.g. "$40–$80"). This helper is kept as a no-op
   passthrough so the templates can call it without a second currency conversion. */
window.priceUSD = function (p) { return ""; };

/* ---- Bret Tkacs ADV Skill Rating (https://brettkacs.com/adv-skill-rating-system/) ----
   window.ADVSCALE (appended below) maps terrain class 1–5 → {name, flag, color, hint}.
   Ratings live on window.DAYS[].road.rating and window.SEGMENTS[].options[].adv as
   {cls, peak, raw}: cls = the typical class (0 = paved / no riding), peak = the higher
   class the text names (or null), raw = the full rating sentence (used as the tooltip). */
window.advTint = function (hex, a) {
  const n = parseInt((hex || "#9aa7b5").slice(1), 16);
  return "rgba(" + (n >> 16 & 255) + "," + (n >> 8 & 255) + "," + (n & 255) + "," + a + ")";
};
/* Colored class pill (+ "peaks N" mini-chip when the rating names a peak class).
   Neutral pill for paved days; "" for no-riding days. Styles: .advpill / .advpeak. */
window.advPillHtml = function (adv, prefix) {
  if (!adv) return "";
  const esc = s => String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;")
    .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const raw = esc(adv.raw || "");
  if (!adv.cls) {
    return /paved/i.test(adv.raw || "")
      ? '<span class="advpill neutral" title="' + raw + '">Paved — no ADV rating</span>' : "";
  }
  const SC = window.ADVSCALE || {}, T = window.advTint;
  const sc = SC[adv.cls] || {}, pc = SC[adv.peak] || {};
  let h = '<span class="advpill" title="' + raw + '" style="color:' + sc.color +
    ";border-color:" + T(sc.color, .5) + ";background:" + T(sc.color, .12) + '">' +
    (prefix || "") + "Class " + adv.cls + " · " + (sc.name || "");
  if (adv.peak) h += ' <b class="advpeak" style="color:' + (pc.color || "#fff") +
    ";border-color:" + T(pc.color || "#ffffff", .55) +
    ";background:" + T(pc.color || "#ffffff", .14) + '">peaks ' + adv.peak + "</b>";
  return h + "</span>";
};
/* Compact colored "C3" chip (timeline day cards); "" when unrated (paved / no riding). */
window.advChipHtml = function (adv) {
  if (!adv || !adv.cls) return "";
  const sc = (window.ADVSCALE || {})[adv.cls] || {}, T = window.advTint;
  const raw = String(adv.raw || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
  return '<span class="advchip" title="' + raw + '" style="color:' + sc.color +
    ";border-color:" + T(sc.color, .5) + ";background:" + T(sc.color, .12) + '">C' + adv.cls + "</span>";
};

/* Representative photos by lodging type (verified Wikimedia Commons).
   These illustrate the STYLE of stay, not the exact property. */
window.HOTEL_IMG = {
  room:   U+"e/e8/Comfort_Twin_Room_in_Triple_Configuration_%2821917602991%29.jpg/960px-Comfort_Twin_Room_in_Triple_Configuration_%2821917602991%29.jpg",
  design: U+"e/e3/Modern_bedroom_design_in_a_stylish_hotel_room_featuring_geometric_patterns_and_soft_linens.jpg/960px-Modern_bedroom_design_in_a_stylish_hotel_room_featuring_geometric_patterns_and_soft_linens.jpg",
  yurt:   U+"f/f1/Song-Kul%2C_Kyrgyzstan_%2830709310728%29.jpg/960px-Song-Kul%2C_Kyrgyzstan_%2830709310728%29.jpg"
};
/* Pick a representative image from a hotel's `t` (type) label. Returns null for non-bookable "Note" rows. */
window.hotelImage = function (t) {
  const s = (t || "").toLowerCase();
  if (s.includes("note")) return null;
  if (s.includes("yurt")) return window.HOTEL_IMG.yurt;
  if (s.includes("resort") || s.includes("spa") || s.includes("4★") || s.includes("5★") ||
      s.includes("high-rise") || s.includes("lodge"))
    return window.HOTEL_IMG.design;
  return window.HOTEL_IMG.room; // hotel, guest house, homestay, cabin, eco-hotel — practical
};
/* Build a reliable search/booking link for a property name. */
window.hotelLink = function (name, place) {
  return "https://www.google.com/search?q=" + encodeURIComponent(name + " " + (place || "") + " hotel");
};
/* Expected motorcycle-parking situation by lodging type — a fallback for when the
   tour data carries no explicit parking note. Confirm the exact spot on booking. */
window.hotelParking = function (t) {
  const s = (t || "").toLowerCase();
  if (s.includes("note")) return null;
  if (s.includes("yurt") || s.includes("camp")) return "Bikes parked by the camp";
  if (s.includes("guest house") || s.includes("homestay") || s.includes("eco"))
    return "Walled yard / courtyard";
  return "Guarded lot — confirm"; // hotels, resorts
};

window.DESTINATIONS = [
{
  id: "almaty",
  name: "Almaty",
  jp: "",
  region: "Almaty, Kazakhstan",
  type: "start",
  days: "Day 1–2 (arrival + training day) & Day 15–16 (return night, celebration dinner, departure)",
  legKm: 0,
  lat: 43.23798, lng: 76.88286, zoom: 11,
  tagline: "Kazakhstan's biggest city, spread out under the snow line of the Zailiysky Alatau — bike handover, a training day, a welcome dinner — and, two weeks later, the loop's finish line and farewell feast.",
  intro: [
    "Almaty is where \"From Desert Up to Glaciers — the Loop\" begins <b>and ends</b>: a leafy, grid-planned city of two million people pressed against the wall of the <b>Zailiysky Alatau</b>, the northernmost range of the Tian Shan. From almost any street corner you can see 4,000-meter peaks hanging over the avenues — a preview of where the tour is headed. Kazakhstan's former capital is its cultural and culinary heart: Soviet-era boulevards, tsarist-era wooden architecture, a legendary bazaar, and a fast-growing café scene, all an easy walk or cheap taxi ride from the tour hotel.",
    "Day 1 is deliberately unhurried. The <b>Silk Off Road Tours</b> crew meets arrivals at the airport, transfers the group to the hotel, and runs the paperwork and <b>Suzuki DR650SE handover</b> — seat height, luggage, controls, a look at the support vehicle that will shadow the group for the next two weeks. Then comes the welcome dinner, where 6–10 riders who will share ~2,800 km of tarmac and dirt meet each other for the first time. <b>Day 2 is a training day</b>, Morocco-style: a morning skills session on the DR650s followed by an easy ~120 km foothill-and-steppe loop, so that everyone has the bike dialed in before the tour rolls out east across the steppe on the morning of Day 3.",
    "The city bookends the trip. On the evening of <b>Day 15</b> the loop closes here — riders roll in from Saty and Lake Kaindy, hand the dusty DR650s and the damage deposits back to the crew, and sit down to the <b>farewell dinner</b>. Day 16 is airport transfers and goodbyes, with the mountains still hanging over the avenues exactly where they were on Day 1."
  ],
  highlights: [
    "<b>Ascension (Zenkov) Cathedral & Panfilov Park</b> — Almaty's icon: a candy-colored Russian Orthodox cathedral built in 1907 almost entirely of wood, standing in the shady Park of the 28 Panfilov Guardsmen beside the WWII eternal-flame memorial. The single best short walk in the city.",
    "<b>Green Bazaar (Zelyony Bazar)</b> — The classic Central Asian market, a few blocks from Panfilov Park: pyramids of dried fruit and spices, dairy and horse-meat halls, samsa stands, and vendors who insist you try everything. Perfect first-afternoon immersion.",
    "<b>Kok-Tobe hill</b> — Ride the cable car from the city center up to the hilltop park under the TV tower for a full panorama of Almaty against the mountains — best at sunset, exactly welcome-dinner-adjacent timing.",
    "<b>Medeu</b> — The famous high-altitude skating rink in a mountain gorge above town (a short taxi up the Medeu road, 30–40 minutes round trip). Even in July the setting — sheer green slopes, glacier water, alpine air — sets the tone for the trip.",
    "<b>Bike handover & briefing</b> — Day 1's real business: fit your DR650SE, sort riding gear and luggage into the support truck, and walk the route with the guides. Ask every question now; the steppe has no service bays.",
    "<b>Day-2 training day</b> — Morocco-training-day style, before any real distance: a skills session on the DR650SE (standing off-road stance, braking on gravel, sand basics, picking the bike up), then an easy <b>~120 km loop</b> through the foothills and steppe east of the city to settle suspension, luggage, and group riding order. Back in Almaty by late afternoon — the last soft bed before Basshi.",
    "<b>Arbat (Zhibek Zholy) stroll</b> — The pedestrianized shopping street between the bazaar and the parks — buskers, ice cream, and a gentle way to walk off jet lag.",
    "<b>Farewell dinner & bike return (Day 15)</b> — The loop's last evening: bikes and deposits handed back to the operator at the hotel's guarded lot, then one final long table — besbarmak, toasts, and 2,800 km worth of stories. Day 16 is airport transfers only."
  ],
  food: [
    {
      "n": "Besbarmak",
      "d": "Kazakhstan's national dish: hand-pulled pasta sheets under slow-boiled meat (traditionally horse or lamb) with onion broth. Order it at a proper Kazakh restaurant tonight — it doesn't travel to guest-house kitchens as grandly as this."
    },
    {
      "n": "Shashlik",
      "d": "Skewers of lamb, beef, or chicken over coals, served with vinegared onions and lepyoshka flatbread; the smell of every Almaty courtyard restaurant in summer."
    },
    {
      "n": "Lagman",
      "d": "Hand-pulled Uighur noodles in a spicy meat-and-vegetable sauce — a warm-up for the Uighur heartland the route crosses on Day 4."
    },
    {
      "n": "Green Bazaar horse-meat stalls",
      "d": "Kazy (horse sausage) and other horse-meat specialties at the bazaar's meat hall; vendors slice samples. Adventurous, and genuinely local."
    },
    {
      "n": "Craft coffee",
      "d": "Almaty has Central Asia's best café scene; grab a proper flat white in the center — espresso options get thin east of the city."
    }
  ],
  hotels: [
    {
      "n": "Tour hotel, city center (operator's pick)",
      "t": "Hotel · Days 1–2 & 15 (3 nights)",
      "d": "Silk Off Road Tours books the group into a central Almaty hotel for the arrival/training nights and the return night; the bikes and support truck stay in guarded parking. Confirm secure parking + luggage/passenger rules with the operator before arrival.",
      "park": "Guarded lot arranged by operator",
      "price": "included in tour price — operator books"
    },
    {
      "n": "Kazakhstan Hotel",
      "t": "Landmark high-rise hotel",
      "d": "The crown-topped Soviet-era tower on Dostyk Ave — mountain views, walkable to Kok-Tobe cable car. A good pre-/post-tour extra night. Confirm secure motorcycle parking before booking.",
      "park": "On-site guarded lot",
      "price": "$60–$110"
    },
    {
      "n": "Renion Park Hotel",
      "t": "Mid-range hotel",
      "d": "Quiet, central, near Panfilov Park and the Green Bazaar. Confirm secure motorcycle parking before booking.",
      "park": "Courtyard parking",
      "price": "$50–$90"
    }
  ],
  links: [
    {
      "l": "From Desert Up to Glaciers — Silk Off Road Tours (operator)",
      "u": "https://www.silkoffroadtours.com/motorcycle-tours-kazakhstan-kyrgyzstan"
    },
    { "l": "Almaty (Wikipedia)", "u": "https://en.wikipedia.org/wiki/Almaty" },
    { "l": "Almaty (Wikivoyage)", "u": "https://en.wikivoyage.org/wiki/Almaty" },
    {
      "l": "Ascension Cathedral, Almaty (Wikipedia)",
      "u": "https://en.wikipedia.org/wiki/Ascension_Cathedral,_Almaty"
    },
    { "l": "Kazakh Travel — official tourism portal", "u": "https://www.kazakh.travel/en" }
  ],
  photos: [
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Zenkov_Cathedral%2C_Almaty.jpg/960px-Zenkov_Cathedral%2C_Almaty.jpg",
      "cap": "The wooden Ascension (Zenkov) Cathedral, Almaty's most famous building."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Panfilov_park_04.jpg/960px-Panfilov_park_04.jpg",
      "cap": "Panfilov Park, the shady green heart of the old city center."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Kok_Bazaar-Green_Bazaar%2C_Almaty_-_panoramio.jpg/960px-Kok_Bazaar-Green_Bazaar%2C_Almaty_-_panoramio.jpg",
      "cap": "The Green Bazaar — dried fruit, spices, and the famous horse-meat hall."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Sunset_over_the_Almaty_seen_from_Kok_Tobe_mountain%2C_pic_1.jpg/960px-Sunset_over_the_Almaty_seen_from_Kok_Tobe_mountain%2C_pic_1.jpg",
      "cap": "Sunset over the city from Kok-Tobe hill, reached by cable car."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Medeu_-_skate_rink_-_2022-06-18.jpg/960px-Medeu_-_skate_rink_-_2022-06-18.jpg",
      "cap": "Medeu, the high-altitude rink in a gorge of the Zailiysky Alatau."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Beshbarmak1.jpg/960px-Beshbarmak1.jpg",
      "cap": "Besbarmak — the welcome-dinner order."
    }
  ]
},
{
  id: "altyn-emel",
  name: "Altyn-Emel National Park",
  jp: "",
  region: "Basshi · Altyn-Emel National Park, Zhetysu / Almaty Region, Kazakhstan",
  type: "stop",
  days: "Day 3 (1 night, Basshi)",
  legKm: 250,
  lat: 44.15957, lng: 78.75441, zoom: 9,
  tagline: "A 150-meter dune that hums like an engine, chalk mountains striped white and red, and wild asses on the steppe — the desert act of the tour: a village guest-house night at the park gate, with the Singing Dune and Aktau ridden on the way out east.",
  intro: [
    "Day 3 is the first touring day, and it wastes no time getting big. The route runs east out of Almaty onto the open steppe plateau — long, fast tarmac with the Tian Shan wall sliding along the right mirror — then lifts over a mountain pass and drops toward the Ili River basin. A mid-ride tea stop at a quirky roadside <b>retro museum</b> breaks up the 250 km before the group rolls into <b>Basshi</b>, the small village at the gate of <b>Altyn-Emel National Park</b>, one of Kazakhstan's largest protected areas at roughly 4,600 km² of desert, badlands, and river floodplain.",
    "Altyn-Emel is the \"desert\" in \"From Desert Up to Glaciers,\" and the loop rides straight through it: <b>one night at the Basshi guest house, then a Day-4 departure that crosses the park itself</b> — desert pistes to the Singing Dune and the Aktau badlands before the route bends east toward Chundzha. The headline act is the <b>Singing Dune</b>, an isolated barchan about 150 m high and 3 km long that produces a deep organ-like hum when dry sand avalanches down its lee face — one of the strangest sounds in Central Asia. Deeper in the park lie the <b>Aktau chalk mountains</b>, a Martian badland of white, red, and orange sedimentary layers, and the black <b>Katutau lava fields</b>, weathered volcanic rock from an ancient eruption. The steppe between them belongs to the animals: reintroduced <b>kulan</b> (Asiatic wild ass), <b>goitered gazelle</b>, and golden eagles overhead. Park entry is a modest per-person daily fee paid at the office in Basshi — the operator handles permits. The Day-3 afternoon arrival leaves time to settle in (and, light permitting, catch the dune at evening golden hour); the dune and Aktau proper come on the Day-4 morning ride out. The night is the village guest house: simple rooms, a home-cooked dinner, and a sky full of stars."
  ],
  highlights: [
    "<b>Riding out through the park (Day-4 morning)</b> — The desert set-piece: instead of backtracking to the highway, the Day-4 leg to Chundzha runs <b>through Altyn-Emel itself</b> — graded dirt, washboard, and real sandy doubletrack past the Singing Dune and the Aktau badlands before the route crosses to the Ili basin. The first proper off-tarmac riding of the tour, with the support truck sweeping.",
    "<b>The Singing Dune</b> — Climb the ridge of the 150-m barchan (barefoot is easiest in the soft sand) and slide down the steep face to set off the hum — a low rumble you feel in your chest. It only \"sings\" when the sand is dry — best on the Day-4 morning stop, or catch the evening light from its ridge if the Day-3 arrival leaves daylight to spare.",
    "<b>Aktau chalk mountains</b> — Bands of white, cream, red, and orange rock folded into gullies and cathedral shapes — an open-air geology lesson roughly 400 million years in the making. A mid-morning stop on the Day-4 ride east, while the low light still carves out the layers.",
    "<b>Katutau lava fields</b> — Melted-looking towers and honeycombed outcrops of dark volcanic rock, a stark contrast to Aktau's pastels; the pistes between them are proper DR650 terrain.",
    "<b>Steppe wildlife spotting</b> — Kulan and goitered gazelle graze the plains between the dune and the mountains; ride gently, keep distance, and keep a camera in the tank bag. Early morning on the way out is prime time — a perk of sleeping at the park gate.",
    "<b>700-year-old willow & Besshatyr mounds</b> — If the day runs ahead of schedule, the park has quieter corners: the giant sacred willow near Kosbastau and the Iron-Age <b>Besshatyr</b> royal burial mounds by the Ili — ask the ranger which pistes are open.",
    "<b>Basshi village evening</b> — Guest-house life: bikes lined up in the yard, dinner at one long table, and a walk out to the edge of the village where the steppe simply takes over."
  ],
  food: [
    {
      "n": "Home-cooked guest-house dinner",
      "d": "The night is about honest village food: soup or plov, salads from the kitchen garden, fresh bread with cream and homemade jam — simple, hot, and exactly right after a dusty day."
    },
    {
      "n": "Tea, endlessly",
      "d": "Kazakh hospitality runs on chai with milk; the bowl gets refilled until you lay a hand over it."
    },
    {
      "n": "Roadside tea-house lunch",
      "d": "The retro-museum stop en route does tea and simple plates on Day 3; for the Day-4 park crossing the guest house packs a picnic — there are no cafés past Basshi."
    },
    {
      "n": "Breakfast before the dust",
      "d": "Eggs, kasha, bread and jam at the guest house; fuel and water top-up in the village before the Day-4 pistes through the park and the long run to Chundzha."
    }
  ],
  hotels: [
    {
      "n": "Basshi guest house (operator's pick)",
      "t": "Village guest house · Day 3 (1 night)",
      "d": "Silk Off Road Tours books the group into a Basshi guest house at the park gate; bikes sleep in the walled yard and dinner/breakfast are home-cooked before the Day-4 ride out through the park. Confirm secure parking + luggage rules with the operator.",
      "park": "Enclosed yard",
      "price": "included in tour price — operator books"
    },
    {
      "n": "Hotel Altyn Emel (Basshi)",
      "t": "Small hotel / tourist base",
      "d": "The village's main tourist base near the park office; simple en-suite rooms and meals on request. Confirm secure motorcycle parking before booking.",
      "park": "Fenced lot",
      "price": "$30–$60"
    },
    {
      "n": "Family guest houses, Basshi village",
      "t": "Homestay",
      "d": "Several families in Basshi take guests; basic shared facilities, generous cooking. Confirm secure motorcycle parking before booking.",
      "park": "Courtyard",
      "price": "$20–$40 incl. dinner & breakfast"
    }
  ],
  links: [
    {
      "l": "From Desert Up to Glaciers — Silk Off Road Tours (operator)",
      "u": "https://www.silkoffroadtours.com/motorcycle-tours-kazakhstan-kyrgyzstan"
    },
    { "l": "Altyn-Emel National Park — official site", "u": "https://altynemel.kz/index.php/en/" },
    { "l": "Park permits & fees (official)", "u": "https://altynemel.kz/index.php/en/things-to-do/fees" },
    { "l": "Altyn-Emel National Park (Wikipedia)", "u": "https://en.wikipedia.org/wiki/Altyn-Emel_National_Park" },
    {
      "l": "Singing Dune (official park page)",
      "u": "https://altynemel.kz/index.php/en/things-to-do/places-to-see/singing-dune"
    }
  ],
  photos: [
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/210723_Altyn_Emel_Singing_Dune_came_2.jpg/960px-210723_Altyn_Emel_Singing_Dune_came_2.jpg",
      "cap": "The Singing Dune — a 150-m barchan that hums when dry sand slides."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/210723_Altyn_Emel_Singing_Dune_top.jpg/960px-210723_Altyn_Emel_Singing_Dune_top.jpg",
      "cap": "The knife-edge crest: climb barefoot, slide down, make it sing."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Chalk_Mountains._Aktau_Mountains._Altyn-Emel_National_Park._Kazakhstan%2C_April_2025_01.jpg/960px-Chalk_Mountains._Aktau_Mountains._Altyn-Emel_National_Park._Kazakhstan%2C_April_2025_01.jpg",
      "cap": "The Aktau chalk mountains — white, red, and orange badlands."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Chalk_Mountains._Aktau_Mountains._Altyn-Emel_National_Park._Kazakhstan%2C_April_2025_07.jpg/960px-Chalk_Mountains._Aktau_Mountains._Altyn-Emel_National_Park._Kazakhstan%2C_April_2025_07.jpg",
      "cap": "Aktau's folded ridges glow at golden hour."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/%D0%9A%D0%B0%D1%82%D1%83%D1%82%D0%B0%D1%83.jpg/960px-%D0%9A%D0%B0%D1%82%D1%83%D1%82%D0%B0%D1%83.jpg",
      "cap": "The Katutau lava fields — weathered volcanic rock deep in the park."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Turkmenian_kulan_1.jpg/960px-Turkmenian_kulan_1.jpg",
      "cap": "The kulan (Asiatic wild ass) — Altyn-Emel protects a reintroduced steppe population."
    }
  ]
},
{
  id: "chundzha",
  name: "Chundzha Hot Springs",
  jp: "",
  region: "Chundzha (Shonzhy), Uygur District, Almaty Region, Kazakhstan",
  type: "stop",
  days: "Day 4 (1 night, hot springs)",
  legKm: 250,
  lat: 43.53651, lng: 79.4636, zoom: 11,
  tagline: "Steaming thermal pools at the edge of the Uighur district — reached by riding straight through Altyn-Emel's dunes and badlands, with the best lagman in Kazakhstan on the table.",
  intro: [
    "Day 4 is the tour's desert day proper: a <b>250 km leg that leaves Basshi through Altyn-Emel National Park itself</b> — the Singing Dune and the Aktau chalk mountains on the morning's dirt-and-sand pistes — before dropping south across the <b>Ili basin</b> on open, near-empty tarmac to <b>Chundzha</b> (officially Shonzhy), the capital of Kazakhstan's <b>Uygur District</b> — with the whole evening left for soaking. This is a different Central Asia again: a green irrigated pocket in the semi-desert where the population is largely Uighur, the bazaars smell of cumin and fresh flatbread, and the roadside signs advertise one thing above all — hot springs.",
    "Chundzha sits on a field of some <b>140 thermal springs</b>, with artesian wells pumping mineral-rich water that comes up hot year-round; resort pools run at a steady 36–50 °C. A whole strip of spa resorts has grown up around them, from simple pool-and-cabin operations to full complexes with indoor and outdoor pools, saunas, and plunge tubs. For a group of riders arriving with Altyn-Emel's dust still in their gear, it is the perfectly engineered overnight: park the DR650s, sink into the hot water under the open sky, then eat Uighur lagman until you can't. Chundzha is also the gateway to <b>Charyn Canyon</b> — tomorrow's first stop, less than an hour down the road."
  ],
  highlights: [
    "<b>Soak in the thermal pools</b> — The whole point. Outdoor pools at 36–50 °C; the mineral water is locally credited with easing joints and skin — exactly what a morning of dune and badland pistes orders, with the whole evening to enjoy it.",
    "<b>Pool-hop the resort zone</b> — Most complexes have several pools at different temperatures plus saunas and cold plunges; do the circuit slowly, with tea between rounds.",
    "<b>Chundzha town & bazaar</b> — A short ride into Shonzhy proper for the Uighur bazaar: flatbread ovens, spice stalls, melons in season — a small, real slice of the Uighur district.",
    "<b>Sunset over the steppe</b> — The resort zone sits between the Ketmen range and the Ili basin; the light show over the semi-desert at dusk is worth getting out of the pool for.",
    "<b>Stage Charyn Canyon</b> — Sleep here and you hit Charyn Canyon early on Day 5, before the day-trip crowds from Almaty arrive — the operator's routing does exactly this.",
    "<b>Bike care hour</b> — Guarded resort parking makes this the natural evening for chain lube, air-filter checks, and knocking the desert out of everything before the border day."
  ],
  food: [
    {
      "n": "Lagman — the real thing",
      "d": "Chundzha is in the Uighur heartland, and hand-pulled lagman here is the benchmark: chewy noodles slapped out to order under a fiery meat, pepper, and celery sauce. Order it at the resort or a roadside Uighur café and understand what the Almaty version was imitating."
    },
    { "n": "Manty and samsa", "d": "Steamed lamb dumplings and tandyr-baked meat pies, everywhere and excellent." },
    {
      "n": "Shashlik by the pool",
      "d": "The resorts grill skewers into the evening; lamb over coals plus hot-spring steam is the signature Chundzha combination."
    },
    {
      "n": "Uighur tea and flatbread",
      "d": "Fresh non (flatbread) from the tandyr with green tea — breakfast before the canyon."
    }
  ],
  hotels: [
    {
      "n": "Hot-springs resort (operator's pick)",
      "t": "Spa resort · Day 4 night",
      "d": "Silk Off Road Tours books the group into one of the Chundzha thermal resorts — rooms plus evening access to the hot pools. Confirm secure parking + towel/pool rules with the operator.",
      "park": "Guarded on-site lot",
      "price": "included in tour price — operator books"
    },
    {
      "n": "Kara Dala Hot Springs Resort",
      "t": "Spa resort",
      "d": "One of the best-known complexes, with seven thermal pools fed by its own artesian wells, cottages, and a restaurant. Confirm secure motorcycle parking before booking.",
      "park": "Guarded on-site lot",
      "price": "$40–$80"
    },
    {
      "n": "ULAN Hot Spring Resort",
      "t": "Spa resort",
      "d": "Three outdoor thermal pools plus a spa zone; standard en-suite rooms with AC. Confirm secure motorcycle parking before booking.",
      "park": "On-site lot",
      "price": "$35–$70"
    }
  ],
  links: [
    {
      "l": "From Desert Up to Glaciers — Silk Off Road Tours (operator)",
      "u": "https://www.silkoffroadtours.com/motorcycle-tours-kazakhstan-kyrgyzstan"
    },
    { "l": "Chunja hot springs (Wikipedia)", "u": "https://en.wikipedia.org/wiki/Chunja_hot_springs" },
    {
      "l": "ULAN Hot Spring Resort — Kazakh Travel (official portal)",
      "u": "https://www.kazakh.travel/en/accommodations/chundzha-ulan-hot-spring-resort"
    },
    { "l": "Kara Dala Hot Springs Resort (official)", "u": "https://karadala.kz/en" },
    { "l": "Uygur District (Wikipedia)", "u": "https://en.wikipedia.org/wiki/Uygur_District" }
  ],
  photos: [
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Somewhere_in_Kazakhstan_%2820160402_071833_1PS%29_%2828754130621%29.jpg/960px-Somewhere_in_Kazakhstan_%2820160402_071833_1PS%29_%2828754130621%29.jpg",
      "cap": "The A352 just west of Chundzha — the empty road into the Uighur district."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Somewhere_in_Kazakhstan_%2820160402_072251_1PS%29_%2828754128301%29.jpg/960px-Somewhere_in_Kazakhstan_%2820160402_072251_1PS%29_%2828754128301%29.jpg",
      "cap": "Looking south from the Chundzha road toward the Tian Shan ranges."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/%D0%A7%D0%B0%D1%80%D1%8B%D0%BD_%D1%80%D0%B5%D0%BA%D0%B0.jpg/960px-%D0%A7%D0%B0%D1%80%D1%8B%D0%BD_%D1%80%D0%B5%D0%BA%D0%B0.jpg",
      "cap": "The Charyn River — Chundzha is the gateway to tomorrow's canyon."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/%D0%94%D0%BE%D1%80%D0%BE%D0%B3%D0%B0_%D0%B2_%D0%A7%D0%B0%D1%80%D1%8B%D0%BD%D1%81%D0%BA%D0%BE%D0%BC_%D0%BA%D0%B0%D0%BD%D1%8C%D0%BE%D0%BD%D0%B5.jpg/960px-%D0%94%D0%BE%D1%80%D0%BE%D0%B3%D0%B0_%D0%B2_%D0%A7%D0%B0%D1%80%D1%8B%D0%BD%D1%81%D0%BA%D0%BE%D0%BC_%D0%BA%D0%B0%D0%BD%D1%8C%D0%BE%D0%BD%D0%B5.jpg",
      "cap": "The track into Charyn Canyon, under an hour from the resort zone."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Lagman_Moscow_2023.jpg/960px-Lagman_Moscow_2023.jpg",
      "cap": "Lagman — hand-pulled noodles, the Uighur district's signature dish."
    }
  ]
},
{
  id: "karakol",
  name: "Karakol",
  jp: "",
  region: "Karakol, Issyk-Kul Region, Kyrgyzstan",
  type: "stay",
  days: "Day 5–6 (2 nights — Day 6 is the Jeti-Oguz & Altyn-Arashan day loop, ~110 km)",
  legKm: 280,
  lat: 42.47821, lng: 78.3956, zoom: 12,
  tagline: "Charyn Canyon at sunrise, a quiet mountain border into Kyrgyzstan, then two nights in the adventure capital — with a day loop to the Seven Bulls red cliffs and the hot springs of Altyn-Arashan in between.",
  intro: [
    "Day 5 is the tour's great transition: it starts in Kazakh desert and ends in a Kyrgyz mountain town. First, less than an hour from Chundzha, comes <b>Charyn Canyon</b> — then the route climbs southwest along the flanks of the <b>Ketmen range</b> to the little steppe town of <b>Kegen</b> and the <b>Karkara valley border crossing</b> into Kyrgyzstan: a quiet, summer-friendly post where a handful of riders and horsemen outnumber the trucks. On the far side, the road sweeps down green alpine meadows toward Lake Issyk-Kul and into <b>Karakol</b>, 280 km from the morning's hot springs.",
    "Karakol is Kyrgyzstan's fourth-largest town and its adventure capital, founded in 1869 as a Russian garrison outpost near the eastern tip of Issyk-Kul. Its streets still carry the layers of everyone who settled here: tsarist officers, Dungan refugees from China, and the explorer <b>Nikolai Przhevalsky</b>, who died here in 1888 and gave the town its Soviet-era name, Przhevalsk. The loop stays <b>two nights</b>: Day 5 evening for the landmarks — the <b>Holy Trinity Russian Orthodox Church</b> and the <b>Dungan Mosque</b> — and dinner in a town that takes its food remarkably seriously, then <b>Day 6 riding light on a ~110 km day loop</b> into the Terskey Alatau: the red <b>Jeti-Oguz \"Seven Bulls\" cliffs</b> in the morning and the rough track up to the <b>Altyn-Arashan hot springs (~2,600 m)</b> in the afternoon, back to the same hotel with the luggage never having moved."
  ],
  highlights: [
    "<b>Charyn Canyon — the Valley of Castles</b> — The day's headline, en route: a red sandstone gorge where 12-million-year-old rock has eroded into towers, arches, and fortress walls up to ~100 m high along a 2-km valley (the canyon runs 150 m+ deep elsewhere). Walk the valley floor to the Charyn River viewpoint; go early for cool air and empty trails. Entry is a small per-person park fee — the operator handles it.",
    "<b>The Kegen–Karkara border crossing</b> — Kazakhstan → Kyrgyzstan the scenic way: a small seasonal post in the high Karkara valley, all green pasture and yurts. Passports, bike documents, twenty minutes of stamps — and the tour is in country number two.",
    "<b>Karkara valley riding</b> — The descent from the border toward Issyk-Kul is the day's riding reward: open alpine valley, snow peaks of the Terskey Alatau ahead, and barely any traffic.",
    "<b>Jeti-Oguz — the Seven Bulls (Day-6 morning)</b> — About 28 km southwest of town, a wall of sheer <b>red sandstone cliffs</b> rises out of the spruce forest: seven ribs of rock said to be seven petrified bulls, with the split <b>\"Broken Heart\" rock</b> guarding the gorge entrance. Paved road to the village, then easy gravel up the gorge past the old Soviet spa to the Kok-Jaiyk \"Valley of Flowers\" meadows — photo stop upon photo stop.",
    "<b>Altyn-Arashan valley track (Day-6 afternoon)</b> — The day's riding main course: from Ak-Suu village (Teploklyuchenka) a genuinely <b>rough 4x4/moto track climbs ~14 km</b> up the Arashan river gorge — rocks, ruts, stream splashes, the stuff the DR650 was rented for — to a green valley at <b>~2,600 m</b> where <b>hot springs</b> (hydrogen-sulfide pools to ~41 °C) steam beside the river below the snow pyramid of Palatka peak. Soak, drink tea at a yurt camp, ride back down. Weather-dependent; the support truck waits at the valley mouth.",
    "<b>Holy Trinity Russian Orthodox Church</b> — Karakol's wooden cathedral, rebuilt in 1895 after an earthquake destroyed the original; green domes and golden crosses over log walls. Evening light is perfect for it.",
    "<b>Dungan Mosque</b> — Commissioned in 1904 and built over six years by Beijing architect Chou Seu and a team of master carvers — in Chinese pagoda style, held together by joinery on 42 wooden pillars and famously <b>built without a single nail</b>. Still an active mosque; visitors welcome outside prayer times.",
    "<b>Przhevalsky legacy</b> — The explorer Nikolai Przhevalsky (of Przewalski's-horse fame) made Karakol his base and is buried above the lake shore nearby; his memorial and museum at Pristan-Przhevalsk make a short detour if the group arrives with daylight to spare."
  ],
  food: [
    {
      "n": "Ashlan-fuu",
      "d": "Karakol's own dish and a point of civic pride: a cold, spicy Dungan bowl of noodles and wobbly starch jelly in a vinegar-chili broth, sold for pennies at the cafés around the bazaar (there's practically an ashlan-fuu alley). Mandatory, ideally with a fried piroshki on the side."
    },
    {
      "n": "Dungan family dinner",
      "d": "Karakol's signature food experience: a multi-course meal of Dungan (Chinese-Muslim) home dishes hosted by a local family — book through Destination Karakol or your guide."
    },
    {
      "n": "Lagman, Kyrgyz edition",
      "d": "Compare notes with last night's Uighur version — fried lagman (boso lagman) is the local move."
    },
    {
      "n": "Kyrgyz staples",
      "d": "Manty, samsy from tandyr ovens, honey and apricots from Issyk-Kul orchards, and endless green tea."
    }
  ],
  hotels: [
    {
      "n": "Karakol hotel (operator's pick)",
      "t": "Hotel · Days 5–6 (2 nights, same hotel)",
      "d": "Silk Off Road Tours books the group into a Karakol hotel with secure parking for the DR650s for both nights — luggage stays put for the Day-6 loop. Confirm parking + luggage arrangements with the operator.",
      "park": "Guarded lot/courtyard",
      "price": "included in tour price — operator books"
    },
    {
      "n": "Green Yard Hotel",
      "t": "Garden hotel",
      "d": "Long-running favorite with a big garden, hearty breakfasts, and helpful English-speaking staff. Confirm secure motorcycle parking before booking.",
      "park": "Enclosed courtyard",
      "price": "$50–$80"
    },
    {
      "n": "Hotel Karagat",
      "t": "Mid-range hotel",
      "d": "Solid central option with restaurant and sauna. Confirm secure motorcycle parking before booking.",
      "park": "On-site lot",
      "price": "$35–$60"
    }
  ],
  links: [
    {
      "l": "From Desert Up to Glaciers — Silk Off Road Tours (operator)",
      "u": "https://www.silkoffroadtours.com/motorcycle-tours-kazakhstan-kyrgyzstan"
    },
    { "l": "Charyn Canyon (Wikipedia)", "u": "https://en.wikipedia.org/wiki/Charyn_Canyon" },
    { "l": "Karakol (Wikivoyage)", "u": "https://en.wikivoyage.org/wiki/Karakol" },
    { "l": "Destination Karakol — official tourism site", "u": "https://destinationkarakol.com/" },
    { "l": "Jeti-Oguz (Wikipedia)", "u": "https://en.wikipedia.org/wiki/Jeti-Oguz" },
    { "l": "Altyn Arashan (Wikipedia)", "u": "https://en.wikipedia.org/wiki/Altyn_Arashan" },
    { "l": "Dungan Mosque (Wikipedia)", "u": "https://en.wikipedia.org/wiki/Dungan_Mosque" }
  ],
  photos: [
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Charyn_Canyon%2C_Kazakhstan_01.jpg/960px-Charyn_Canyon%2C_Kazakhstan_01.jpg",
      "cap": "Charyn Canyon's Valley of Castles — the morning's big en-route sight."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Charyn_Canyon_28.jpg/960px-Charyn_Canyon_28.jpg",
      "cap": "Twelve-million-year-old sandstone eroded into fortress walls."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Karkara_River_valley%2C_Khan_Tengri_Nature_Park.jpg/960px-Karkara_River_valley%2C_Khan_Tengri_Nature_Park.jpg",
      "cap": "The Karkara valley — the green high-pasture border crossing into Kyrgyzstan."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Jeti-%C3%96g%C3%BCz_Rocks_-_Issyk-Kul_Region%2C_Jeti-Oguz_District.jpg/960px-Jeti-%C3%96g%C3%BCz_Rocks_-_Issyk-Kul_Region%2C_Jeti-Oguz_District.jpg",
      "cap": "Jeti-Oguz — the \"Seven Bulls\" red sandstone wall, the Day-6 morning ride."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Altyn_Arashan_resort%2C_Kyrgyzstan.jpg/960px-Altyn_Arashan_resort%2C_Kyrgyzstan.jpg",
      "cap": "Altyn-Arashan at ~2,600 m — hot springs at the top of a properly rough track."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Karakol_Dungan_Mosque.jpg/960px-Karakol_Dungan_Mosque.jpg",
      "cap": "The Dungan Mosque (1904–1910), built in Chinese style without a single nail."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Detail_of_Karakol_Dungan_Mosque.jpg/960px-Detail_of_Karakol_Dungan_Mosque.jpg",
      "cap": "Carved, painted joinery — the mosque is held together by woodwork alone."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Karakol_cathedral.jpg/960px-Karakol_cathedral.jpg",
      "cap": "The wooden Holy Trinity Russian Orthodox Church, rebuilt in 1895."
    }
  ]
},
{
  id: "issyk-kul",
  name: "Issyk-Kul South Shore",
  jp: "",
  region: "Issyk-Kul south shore, Kyrgyzstan",
  type: "stay",
  days: "Days 7–8 · 2 nights (yurt camp, Tosor/Tamga area) — Day 8 is the tour's rest day",
  legKm: 190,
  lat: 42.16568, lng: 77.44438, zoom: 10,
  tagline: "The world's second-largest alpine lake — a warm, never-freezing inland sea reached the hard way, over three passes and past the glaciers of the Barskoon gorge, with a yurt camp waiting on the beach.",
  intro: [
    "<b>Issyk-Kul</b> (\"warm lake\") is the world's second-largest alpine lake after Titicaca — about 180 km long, ringed by the snow walls of the Terskey and Kungey Alatau, sitting at 1,607 m, slightly saline and famously <b>never freezing</b>, even in the Central Asian winter. The south shore is the quiet side: no big Soviet-era resorts, just pebble beaches, red-rock canyons and small villages like <b>Tosor</b> and <b>Tamga</b>, where the tour's yurt camp stands close to the water.",
    "Getting here is the day the whole tour is named for. From Karakol the Day-7 route climbs into the <b>Barskoon gorge</b> and onto the high mining road toward Kumtor, crossing <b>Sarimonok Pass (3,126 m)</b>, <b>Barskoon Pass (3,754 m)</b> and finally <b>Suek Pass (4,021 m)</b> — the highest point of the trip, with <b>glaciers hanging beside the road</b> and a real chance of snow flurries in any month. Then comes the payoff: a 2,400-metre descent from the ice down to a warm lake you can swim in before dinner. Desert-to-glacier-to-beach in a single riding day.",
    "And then — nothing. <b>Day 8 is the tour's one full rest day</b>, spent right here at the yurt camp: no alarm, no kilometres, just the lake. It's placed deliberately, because the block that follows — <b>Days 9–12</b>, Kochkor, the 33 Parrots Pass to Song-Kol, the big Moldo-Ashuu/Kara-Keche off-road day to Suusamyr and Too-Ashuu into Bishkek — is the hardest sustained riding of the loop. Rest, swim, let the support crew and mechanic do their work, and start it fresh."
  ],
  highlights: [
    "<b>The three-pass Barskoon road</b> — The ride <i>is</i> the sight: gravel switchbacks built for the Kumtor gold mine, climbing from spruce forest past <b>Sarimonok (3,126 m)</b> and <b>Barskoon (3,754 m)</b> to <b>Suek (4,021 m)</b>, with marmots on the verges and glacier tongues above the road (<b>the tour's highest point — ride it behind the leader, weather can turn fast</b>).",
    "<b>Barskoon waterfalls</b> — A short walk from the gorge road reaches the famous falls; Yuri <b>Gagarin</b> holidayed here after his flight, and a monument to him stands among the spruce.",
    "<b>Swim in Issyk-Kul</b> — The camp is steps from a pebble beach; the mildly salty water is genuinely swimmable in July and the classic way to wash off a 4,000-metre day (<b>bring sandals — the pebbles are sharp</b>).",
    "<b>Yurt-camp evening</b> — Sunset over the lake with the Kungey Alatau glowing pink across the water, dinner in the communal yurt, and a sky full of stars once the generator goes off.",
    "<b>Skazka (Fairy Tale) Canyon</b> — Eroded red-and-orange rock formations a short hop along the south-shore road toward Tosor — a quick, photogenic leg-stretch if the group passes it on the Day-9 ride to Kochkor.",
    "<b>Rest day (Day 8): swim, nap, repeat</b> — The one day of the loop with zero kilometres. Sleep in, swim off the camp's beach, read on the pebbles, walk the shore — deliberate recovery before the hard Days 9–12 block over the 3,000-m passes to Song-Kol, Suusamyr and Bishkek.",
    "<b>Rest day: banya</b> — The south-shore camps and nearby Tamga guest houses can fire up a <b>banya</b> (steam bath) — the definitive fix for a week of riding shoulders; book it with the hosts in the morning (small cash cost).",
    "<b>Rest day: horseback to a jailoo (optional)</b> — Camps arrange half-day horse treks up to a nearby <b>jailoo</b> summer pasture with a local horseman — a gentle preview of Song-Kol's herding world (<b>agree the price first, typically $10–15/hour; skip it if you'd rather save your legs</b>).",
    "<b>Rest day: laundry & bike checks</b> — Hand a bag to the support crew for washing, and give the mechanic time with your DR650 — chain, tyres, air filter after the dusty mining road — so the bike starts the Song-Kol block as fresh as you do."
  ],
  food: [
    {
      "n": "Fresh lake fish",
      "d": "The Issyk-Kul classic: whole fried or smoked fish sold in the shore villages and served at the camps — ask for the local chebak or whitefish, straight from the lake."
    },
    {
      "n": "Yurt-camp dinner",
      "d": "Home-style Kyrgyz table: lagman or shorpo soup, fresh lepyoshka bread, mountains of apricot jam and tea from the samovar (dinners are at your own expense — carry som in cash, there are no card machines on the south shore)."
    },
    {
      "n": "Honey & apricots",
      "d": "Tamga and Barskoon are orchard villages; roadside stands sell jars of honey and dried apricots that travel well in a pannier."
    }
  ],
  hotels: [
    {
      "n": "South-shore yurt camp (Tosor/Tamga area)",
      "t": "Yurt camp",
      "d": "Operator books — nights 7 & 8 of the tour package (twin-share), the 2-night rest-day base. Shared facilities; bring a warm layer for the evening.",
      "park": "Bikes parked on-site by the yurts",
      "price": "Included in tour price"
    },
    {
      "n": "Bel-Tam Yurt Camp (near Bokonbaevo)",
      "t": "Yurt camp (CBT)",
      "d": "The best-known independent camp on the south shore, right on the beach. Operator books — confirm; indicative price.",
      "park": "On-site, open ground",
      "price": "$35–$60 pp incl. meals"
    },
    {
      "n": "Yurt Camp Tosor",
      "t": "Yurt camp",
      "d": "Lakeside camp at Tosor village with parking and barbecue. Operator books — confirm; indicative price.",
      "park": "Free private parking",
      "price": "$30–$50"
    }
  ],
  links: [
    {
      "l": "Silk Off Road Tours — From Desert Up to Glaciers",
      "u": "https://www.silkoffroadtours.com/motorcycle-tours-kazakhstan-kyrgyzstan"
    },
    { "l": "Wikipedia: Issyk-Kul", "u": "https://en.wikipedia.org/wiki/Issyk-Kul" },
    { "l": "Wikivoyage: Issyk Kul", "u": "https://en.wikivoyage.org/wiki/Issyk_Kul" },
    { "l": "Wikipedia: Barskoon (gorge & village)", "u": "https://en.wikipedia.org/wiki/Barskoon" },
    { "l": "CBT Kyrgyzstan (community-based tourism)", "u": "https://cbtkyrgyzstan.kg/en/" }
  ],
  photos: [
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Issyk-Kul_South_Shore_Aug_2006.JPG/960px-Issyk-Kul_South_Shore_Aug_2006.JPG",
      "cap": "The quiet pebble beaches of Issyk-Kul's south shore — a warm alpine sea at 1,607 m that never freezes."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/The_view_on_Barskoon_George.jpg/960px-The_view_on_Barskoon_George.jpg",
      "cap": "The Barskoon gorge, gateway to the day's three passes and the glaciers above the mining road."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Barsko%C3%B6n_Waterfall.jpg/960px-Barsko%C3%B6n_Waterfall.jpg",
      "cap": "The Barskoon waterfalls, a short walk from the gorge road — Gagarin's favourite holiday spot."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/%D0%9A%D1%8B%D1%80%D0%B3%D1%8B%D0%B7%D1%81%D0%BA%D0%B0%D1%8F_%D1%8E%D1%80%D1%82%D0%B0%2C_%D0%B4%D0%BE%D0%BC_%D1%81%D1%80%D0%B5%D0%B4%D0%B8_%D0%BD%D0%B5%D0%B1%D0%B5%D1%81%D0%BD%D1%8B%D1%85_%D0%B3%D0%BE%D1%80.jpg/960px-%D0%9A%D1%8B%D1%80%D0%B3%D1%8B%D0%B7%D1%81%D0%BA%D0%B0%D1%8F_%D1%8E%D1%80%D1%82%D0%B0%2C_%D0%B4%D0%BE%D0%BC_%D1%81%D1%80%D0%B5%D0%B4%D0%B8_%D0%BD%D0%B5%D0%B1%D0%B5%D1%81%D0%BD%D1%8B%D1%85_%D0%B3%D0%BE%D1%80.jpg",
      "cap": "A Kyrgyz yurt at the foot of the mountains — home for the night after the descent from Suek."
    }
  ]
},
{
  id: "kochkor",
  name: "Kochkor",
  jp: "",
  region: "Naryn Province, Kyrgyzstan",
  type: "stop",
  days: "Day 9 · 1 night (guest house)",
  legKm: 200,
  lat: 42.2164, lng: 75.75754, zoom: 13,
  tagline: "A working herders' market town at the crossroads to the high pastures — felt carpets made before your eyes, lunch with a family of hereditary eagle hunters on the way in, and a real Kyrgyz guest-house night.",
  intro: [
    "<b>Kochkor</b> (Кочкор) is an unpolished, thoroughly real village of a few thousand people at about 1,800 m, where the road from Issyk-Kul turns uphill toward Song-Kol. It has long been the launch pad for the jailoo — the summer pastures — and the home base of <b>CBT (Community Based Tourism) Kyrgyzstan</b>, the network of family guest houses and women's craft cooperatives that made this valley famous among travellers. This is the tour's transition night: the last hot shower, phone signal and shop-stocked main street before the yurts of Song-Kol.",
    "The ride here is a lakeshore-and-farmland day along the <b>Terskey Alatau</b> front range roads, hugging Issyk-Kul's coast before bending southwest into the Kochkor valley. The day's set-piece comes en route: <b>lunch at the farmhouse of a family of hereditary berkutchi — eagle hunters</b> — who fly and live with golden eagles as their fathers and grandfathers did, and will show you how a five-kilo bird is trained, hooded and carried on horseback."
  ],
  highlights: [
    "<b>Eagle-hunter family lunch (en route)</b> — The Day-9 highlight: a farmhouse meal with a <b>berkutchi</b> dynasty near the south shore, with the golden eagles brought out after lunch — hunting with eagles here is a living tradition, not a show (<b>bring small som notes if you'd like to tip or buy photos</b>).",
    "<b>Shyrdak felt-carpet workshops</b> — Kochkor's women's cooperatives (Altyn Kol and the CBT craft shops) demonstrate how <b>shyrdak</b> — the brilliantly coloured, mosaic-stitched felt carpets on UNESCO's Intangible Heritage list — are cut, layered and sewn; small pieces pack fine on a bike.",
    "<b>Kochkor bazaar & main street</b> — Stock up on water, snacks and cash (the <b>last reliable ATMs and fuel before Song-Kol</b>); the small animal-and-produce bazaar is at its liveliest in the morning.",
    "<b>Regional museum & village mosque</b> — A modest local-history room and a walkable, poplar-lined main street — Kochkor is about atmosphere, not sights.",
    "<b>Evening walk in the Kochkor valley</b> — Golden-hour light on the ranges that you'll climb tomorrow via the 33 Parrots Pass."
  ],
  food: [
    {
      "n": "Guest-house home cooking",
      "d": "The best meal plan in town is your hosts' table: beshbarmak or kuurdak, hand-pulled lagman, fresh borsok fried bread with cream and apricot jam, endless tea."
    },
    {
      "n": "Eagle hunters' farmhouse lunch",
      "d": "Country spread of bread, cream, honey, salads and soup at the berkutchi family's home (lunch is at your own expense per the tour terms — carry cash)."
    },
    {
      "n": "Bazaar snacks",
      "d": "Kurut (dried yogurt balls, the herders' trail snack), dried apricots and fresh lepyoshka from the tandyr ovens on the main street."
    }
  ],
  hotels: [
    {
      "n": "Kochkor guest house (operator's pick)",
      "t": "Guest house",
      "d": "Operator books — night 9 of the tour package (twin-share), with hot showers and a home-cooked dinner available.",
      "park": "Bikes in the yard/courtyard",
      "price": "Included in tour price"
    },
    {
      "n": "Guest House Shyrdak",
      "t": "Guest house",
      "d": "Well-reviewed family guest house with garden rooms near the centre. Operator books — confirm; indicative price.",
      "park": "Courtyard parking",
      "price": "$20–$35"
    },
    {
      "n": "Jarkyn's Guest House (CBT Kochkor)",
      "t": "Guest house (CBT)",
      "d": "CBT host and felt master — shyrdak masterclasses in the backyard yurt. Operator books — confirm; indicative price.",
      "park": "Courtyard parking",
      "price": "$15–$30 incl. breakfast"
    }
  ],
  links: [
    {
      "l": "Silk Off Road Tours — From Desert Up to Glaciers",
      "u": "https://www.silkoffroadtours.com/motorcycle-tours-kazakhstan-kyrgyzstan"
    },
    { "l": "Wikipedia: Kochkor", "u": "https://en.wikipedia.org/wiki/Kochkor" },
    { "l": "Wikivoyage: Kochkor", "u": "https://en.wikivoyage.org/wiki/Kochkor" },
    { "l": "CBT Kyrgyzstan — Kochkor guest houses", "u": "https://cbtkyrgyzstan.kg/en/" },
    {
      "l": "UNESCO: Ala-kiyiz and shyrdak, art of Kyrgyz traditional felt carpets",
      "u": "https://ich.unesco.org/en/USL/ala-kiyiz-and-shyrdak-art-of-kyrgyz-traditional-felt-carpets-00693"
    }
  ],
  photos: [
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/9/95/KyrgyzEagleHuntsman.jpg",
      "cap": "A berkutchi with his golden eagle — Day 9's farmhouse lunch is hosted by a family of hereditary eagle hunters."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Kyrgyz_shyrdak.jpg/960px-Kyrgyz_shyrdak.jpg",
      "cap": "Shyrdak felt carpets, the UNESCO-listed craft that Kochkor's women's cooperatives still stitch by hand."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Kochkor%2C_Kyrgyzstan.jpg/960px-Kochkor%2C_Kyrgyzstan.jpg",
      "cap": "Kochkor's workaday centre — the last shops, fuel and ATMs before the high pastures."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Road_to_Issyk-Kul_%28south_shore%29_%2814939479807%29.jpg/960px-Road_to_Issyk-Kul_%28south_shore%29_%2814939479807%29.jpg",
      "cap": "Day 9 riding: farm roads under the Terskey Alatau on the way from the lake to the Kochkor valley."
    }
  ]
},
{
  id: "song-kol",
  name: "Song-Kol Lake",
  jp: "",
  region: "Naryn Province, Kyrgyzstan · 3,016 m",
  type: "stop",
  days: "Day 10 · 1 night (nomad yurt camp; bad-weather fallback: Kyzart village eco-hotel)",
  legKm: 130,
  lat: 41.83392, lng: 75.13119, zoom: 10,
  tagline: "An alpine lake at 3,016 m ringed by summer pastures and nomad yurts — horses to the horizon, kumis in the bowl, and one of the darkest night skies you will ever sleep under.",
  intro: [
    "<b>Song-Kol</b> (Сон-Көл) is Kyrgyzstan's highest large lake — 29 km by 18 km of cold, glass-clear water at <b>3,016 m</b>, set in a treeless bowl of grass so wide the horizon curves. There are no towns, no power lines and effectively no buildings: in summer the shore belongs to the <b>jailoo</b>, the high pastures, where nomad families pitch their yurts from June to September and graze thousands of horses, sheep and yaks exactly as their great-grandparents did. Staying the night in one of their camps — not looking at nomad life, but sleeping inside it — is for many riders the single best night of the tour.",
    "The way in is a short day with a big centrepiece: the <b>\"33 Parrots\" Pass (3,133 m)</b>, a stack of tight hairpin switchbacks winding up the mountain wall (the nickname comes from a beloved Soviet cartoon — count the bends). Over the top, the road turns to dirt across open pasture and the lake appears, impossibly blue against the yellow-green grass. <b>It is cold here even in July</b> — expect single digits after sunset, possible frost, and weather that can close the pass; if it does, the group falls back to an <b>eco-hotel in Kyzart village</b> below."
  ],
  highlights: [
    "<b>The 33 Parrots Pass (3,133 m)</b> — The day's riding highlight: a wall of numbered hairpins climbing out of the Kochkor valley, gravel in the upper reaches, with the whole valley unrolling behind you (<b>take it at your own pace behind the leader</b>).",
    "<b>Life on the jailoo</b> — Walk between the yurts: mares being milked at dusk, foals tethered in lines, kids on horseback herding sheep barefoot. Guests are welcome to help with the animals — just ask your hosts.",
    "<b>Horses everywhere</b> — Song-Kol in July is one huge horse pasture; most camps will happily saddle one for a short ride along the shore (<b>agree the price first, typically $10–15/hour</b>).",
    "<b>The night sky</b> — At 3,016 m, with zero light pollution, the Milky Way is bright enough to cast shadows; step out of the yurt around midnight (<b>and bring every layer you own</b>).",
    "<b>Birdlife on the lake</b> — Song-Kol is a state reserve and Ramsar site: mountain geese, gulls and demoiselle cranes work the shallows at dawn."
  ],
  food: [
    {
      "n": "Kumis",
      "d": "Fermented mare's milk, mildly fizzy, sour and faintly alcoholic — the drink of the jailoo, offered to every guest; trying it is the toll for the view (a small bowl is polite, nobody minds if you don't finish)."
    },
    {
      "n": "Boorsok",
      "d": "Puffy squares of fried dough, tipped in a heap on the dastorkon and eaten with butter, thick cream (kaymak) and apricot jam."
    },
    {
      "n": "Herders' dinner in the yurt",
      "d": "Whatever the family cooks: usually shorpo mutton soup, fresh noodles or plov, bread and tea; hot, simple and exactly right at 3,000 m. Dinners are at your own expense — cash only, there is nothing to buy at the lake, so carry snacks from Kochkor."
    }
  ],
  hotels: [
    {
      "n": "Nomad family yurt camp, Song-Kol shore",
      "t": "Yurt camp",
      "d": "Operator books — night 10 of the tour package (twin-share yurts, thick toshok bedding, outhouse facilities). Cold even in summer: pack a warm sleep layer, hat and headlamp.",
      "park": "Bikes on the grass by the yurts",
      "price": "Included in tour price"
    },
    {
      "n": "Kyzart village eco-hotel (bad-weather fallback)",
      "t": "Eco-hotel / guest house",
      "d": "The operator's fallback if weather closes the pass: a warm bed and shower in Kyzart village below the lake — the ride resumes next morning.",
      "park": "Yard parking",
      "price": "Included in tour price"
    },
    {
      "n": "Son-Kul lake yurt camp (Ak-Sai Travel) / Nomad Lodge Son-Kul",
      "t": "Tourist yurt camps",
      "d": "Larger seasonal camps (roughly mid-June–mid-September) on the north shore, with dining yurts and generator power. Operator books — confirm; indicative prices.",
      "park": "On-site, open ground",
      "price": "$40–$80 pp incl. meals"
    }
  ],
  links: [
    {
      "l": "Silk Off Road Tours — From Desert Up to Glaciers",
      "u": "https://www.silkoffroadtours.com/motorcycle-tours-kazakhstan-kyrgyzstan"
    },
    { "l": "Wikipedia: Song-Köl", "u": "https://en.wikipedia.org/wiki/Song-K%C3%B6l" },
    { "l": "Nomad Lodge Son-Kul (north-shore yurt camp)", "u": "https://nomad-lodge.com/nomad-lodge-son-kul/" },
    { "l": "CBT Kyrgyzstan — jailoo yurt stays", "u": "https://cbtkyrgyzstan.kg/en/" }
  ],
  photos: [
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Song-Kul%2C_Kyrgyzstan_%2830709310728%29.jpg/960px-Song-Kul%2C_Kyrgyzstan_%2830709310728%29.jpg",
      "cap": "A yurt camp on the shore of Song-Kol — home for night 10, at 3,016 m among the summer pastures."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Song-Kul%2C_Kyrgyzstan_%2830709627198%29.jpg/960px-Song-Kul%2C_Kyrgyzstan_%2830709627198%29.jpg",
      "cap": "Golden-hour light on the jailoo — nomad families pitch here from June to September."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Horse_standing_by_Song_Kul_Lake_-_Kyrgyztan.jpg/960px-Horse_standing_by_Song_Kul_Lake_-_Kyrgyztan.jpg",
      "cap": "Horses to the horizon: Song-Kol in July is one enormous horse pasture."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Song-Kul%2C_Kyrgyzstan_%2843669860135%29.jpg/960px-Song-Kul%2C_Kyrgyzstan_%2843669860135%29.jpg",
      "cap": "Camps strung along the grass bowl of the lake — no towns, no power lines, no light pollution."
    }
  ]
},
{
  id: "suusamyr",
  name: "Suusamyr Valley",
  jp: "",
  region: "Suusamyr Valley, Chüy Province, Kyrgyzstan · ~2,200 m",
  type: "stop",
  days: "Day 11 · 1 night (cabin camp)",
  legKm: 240,
  lat: 42.17893, lng: 73.96243, zoom: 10,
  tagline: "Central Asia's largest summer pasture — a 150-km grass sea at 2,200 m, earned by the tour's biggest off-road day over Moldo-Ashuu and the coal road of Kara-Keche, and sweetened by the valley's famous honey.",
  intro: [
    "The <b>Suusamyr Valley</b> is a vast high plateau — roughly 150 km long at about <b>2,200 m</b> — held between the Kyrgyz Alatau and the Suusamyr-Too ranges. It is celebrated as <b>the largest alpine pasture in Central Asia</b>: for centuries herders have driven millions of head of livestock up here for the summer, and in July the valley floor is an unbroken sea of grass, herds and scattered yurts under enormous skies. The other thing everyone knows Suusamyr for is <b>honey</b> — the valley's wildflower meadows feed apiaries whose white \"Suusamyr honey\" wins medals and turns up on tables across Kyrgyzstan.",
    "Getting here is the most demanding riding day of the tour — 240 km, most of it off the asphalt (only Day 14's 325-km run back into Kazakhstan is longer, and that one stays on tarmac). From Song-Kol the route drops off the plateau on a <b>rocky off-road descent</b>, climbs the switchbacks of <b>Moldo-Ashuu Pass (3,546 m)</b>, then takes the gravel <b>coal road over Kara-Keche Pass (3,384 m)</b> — built to serve the open-cast coal mine below it — before following the boiling turquoise <b>Kokomeren river</b> gorge out into the open valley. The night is spent in a <b>cabin camp</b> ringed by panoramic mountains: real beds, hot food and a well-earned beer under the stars."
  ],
  highlights: [
    "<b>Moldo-Ashuu Pass (3,546 m)</b> — A ladder of gravel switchbacks with the whole Song-Kol plateau falling away behind — the classic photo stop of Day 11 (<b>loose surface, ride it patiently</b>).",
    "<b>Kara-Keche Pass (3,384 m) & the coal road</b> — A working mining road past the open-cast coal pits that heat half of Kyrgyzstan in winter; expect the occasional loaded truck and give it room.",
    "<b>The Kokomeren gorge</b> — The wild blue-green Kokomeren river crashes through a bare rock canyon alongside the road — one of Kyrgyzstan's most dramatic stretches of gravel riding.",
    "<b>The pasture itself</b> — Evening light across an ocean of grass, herds drifting home, and shepherd camps trailing smoke; walk out from the cabin camp and just stand in it.",
    "<b>Buy Suusamyr honey</b> — Roadside apiaries and village stands sell the valley's famous white honey by the jar — the best edible souvenir of the whole route (<b>a small jar survives a pannier fine</b>)."
  ],
  food: [
    {
      "n": "Suusamyr honey",
      "d": "The valley's pride: pale, dense wildflower honey from apiaries grazing the same meadows as the horses — eat it on fresh bread with cream at breakfast."
    },
    {
      "n": "Cabin-camp dinner",
      "d": "Hearty highland cooking after the big day: kuurdak (fried meat and potatoes), shorpo, bread and tea; dinners are at your own expense, so keep som handy."
    },
    {
      "n": "Kumis from the roadside",
      "d": "Summer shacks along the valley road sell kumis and maksym (a tangy fermented grain drink) to travellers crossing between Bishkek and the south."
    }
  ],
  hotels: [
    {
      "n": "Suusamyr cabin camp (operator's pick)",
      "t": "Cabin camp",
      "d": "Operator books — night 11 of the tour package (twin-share cabins with real beds, surrounded by panoramic mountains).",
      "park": "Bikes beside the cabins",
      "price": "Included in tour price"
    },
    {
      "n": "Suus Lodge (Suusamyr valley)",
      "t": "Mountain lodge",
      "d": "Comfortable 25-guest lodge used by ski-touring and paragliding groups; summer excursions and kumis on the menu. Operator books — confirm; indicative price.",
      "park": "On-site parking",
      "price": "$40–$70"
    },
    {
      "n": "Village guest houses, Suusamyr village",
      "t": "Guest house",
      "d": "A handful of simple family guest houses (e.g. Guesthouse Altai) in Suusamyr village — basic but warm. Operator books — confirm; indicative price.",
      "park": "Yard parking",
      "price": "$15–$30"
    }
  ],
  links: [
    {
      "l": "Silk Off Road Tours — From Desert Up to Glaciers",
      "u": "https://www.silkoffroadtours.com/motorcycle-tours-kazakhstan-kyrgyzstan"
    },
    { "l": "Wikipedia: Suusamyr Valley", "u": "https://en.wikipedia.org/wiki/Suusamyr_Valley" },
    { "l": "Suus Lodge — Suusamyr valley", "u": "https://suus.kg/" },
    { "l": "Wikipedia: Kökömeren river", "u": "https://en.wikipedia.org/wiki/K%C3%B6k%C3%B6meren" }
  ],
  photos: [
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/a/a4/Suusamyr_Valley.jpg",
      "cap": "The Suusamyr valley in summer — Central Asia's largest alpine pasture, a grass sea at 2,200 m."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/%D0%9A%D0%B5%D0%BA%D0%B5%D0%BC%D0%B5%D1%80%D0%B5%D0%BD.jpg/960px-%D0%9A%D0%B5%D0%BA%D0%B5%D0%BC%D0%B5%D1%80%D0%B5%D0%BD.jpg",
      "cap": "The Kokomeren river gorge — the wild gravel corridor Day 11 follows out of the mountains."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Suusamyr_Valley_%283968059049%29.jpg/960px-Suusamyr_Valley_%283968059049%29.jpg",
      "cap": "High-pass country on the way into Suusamyr — snow is possible on the 3,000-m passes in any month."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Suusamyr_Valley_%283968831828%29.jpg/960px-Suusamyr_Valley_%283968831828%29.jpg",
      "cap": "A herder's summer camp on the valley floor — Suusamyr still lives by the seasonal drive to the pastures."
    }
  ]
},
{
  id: "bishkek",
  name: "Bishkek",
  jp: "",
  region: "Chüy Province, Kyrgyzstan (capital city)",
  type: "stop",
  days: "Day 12 · 1 night (hotel + big-city dinner night; Day 13 rides out east via the Boom gorge)",
  legKm: 153,
  lat: 42.87462, lng: 74.56976, zoom: 11,
  tagline: "Over the Too-Ashuu pass and through its ~3-km summit tunnel, down 2,500 vertical metres to Kyrgyzstan's leafy, Soviet-boned capital — a big-city dinner night and a real bed at the loop's western turn.",
  intro: [
    "<b>Bishkek</b> is Central Asia's most relaxed capital — a low-rise, gridded, intensely green city of about a million people under the wall of the Kyrgyz Alatau, where Soviet monumental architecture, student cafés, bazaars and craft-beer taprooms coexist within a few leafy blocks. After nearly two weeks of steppe, desert and 4,000-m passes it feels almost decadent: hot water, espresso, and the best restaurant scene between Almaty and Tashkent. This is the loop's westernmost point and its one mid-tour city night — from here the route turns for home.",
    "The ride in is short but memorable. From Suusamyr the road climbs to <b>Too-Ashuu Pass (3,200 m)</b> and punches through the mountain in its famous <b>~3-km summit tunnel</b> — cold, dark and unforgettable on a motorcycle — then hairpins down nearly two and a half vertical kilometres into the Chüy valley, watching the land change from alpine pasture to poplar-lined farmland in under an hour. The evening is the tour's <b>big-city dinner night</b> — the farewell dinner waits in Almaty, but this is the place for plov, craft beer and a proper restaurant table. On <b>Day 13</b> the group saddles up again and rides east out of the Chüy valley through the <b>Boom gorge</b> toward Issyk-Kul's north shore and Cholpon-Ata. (Bishkek's Manas airport, FRU, sits 25 km north of town, but on this loop nobody flies from here — departure is from Almaty.)"
  ],
  highlights: [
    "<b>Ala-Too Square</b> — The ceremonial heart of the city: the national flag on its giant mast, the equestrian <b>Manas</b> monument, fountains, and the hourly changing of the guard (<b>come back after dark when the fountains are lit</b>).",
    "<b>State History Museum</b> — The monumental white block on Ala-Too Square, renovated and reopened with strong exhibits from Saka gold to the Soviet century — the quickest way to make sense of everything you just rode through.",
    "<b>Osh Bazaar</b> — Bishkek's big, working central-Asian bazaar: pyramids of spices, dried fruit, kurut, horse-meat sausage and cheap kalpak hats — the best souvenir sweep in town (<b>watch pockets in the crowds</b>).",
    "<b>Soviet Bishkek on foot</b> — Oak Park and the sculpture garden, the White House, the brutalist <b>Circus</b> flying-saucer, Victory Square and the mosaic-clad blocks along Chüy Prospekt — an open-air museum of Soviet modernism.",
    "<b>Too-Ashuu Pass & tunnel (en route)</b> — The last of the big western passes at 3,200 m; the summit tunnel is narrow, dim and fume-y — visor up, lights on, and enjoy the burst of light on the Chüy side (<b>the descent's hairpins deserve fresh attention, not end-of-block autopilot</b>)."
  ],
  food: [
    {
      "n": "Plov & the classics at Navat",
      "d": "The beloved teahouse chain with carved-wood interiors: proper plov, beshbarmak, samsa and pots of tea — an easy, excellent group dinner."
    },
    {
      "n": "Laghman at Cafe Faiza",
      "d": "A Bishkek institution packed with locals, famous for what many call the best hand-pulled laghman in Central Asia (and very kind prices)."
    },
    {
      "n": "Supara Ethno-Complex",
      "d": "The big-city-dinner splurge: a yurt-village restaurant on the city's mountain edge serving refined Kyrgyz cuisine — shashlik, tandyr bread and plov done beautifully."
    },
    {
      "n": "Craft beer at Save the Ales",
      "d": "Kyrgyzstan's pioneering craft brewery-taproom, the right place to toast the first 2,000 km of the loop (check the current address — it has moved locations)."
    }
  ],
  hotels: [
    {
      "n": "Bishkek city hotel (operator's pick)",
      "t": "Hotel",
      "d": "Operator books — night 12 of the tour package (twin-share), close to the centre; bikes in the guarded lot, ready for the Day-13 ride out through the Boom gorge.",
      "park": "Guarded hotel lot",
      "price": "Included in tour price"
    },
    {
      "n": "Ramada by Wyndham Bishkek Centre",
      "t": "4★ hotel",
      "d": "Modern, central and reliable, with pool and gym. Operator books — confirm; indicative price.",
      "park": "On-site guest parking",
      "price": "$90–$130"
    },
    {
      "n": "Hyatt Regency Bishkek",
      "t": "5★ hotel",
      "d": "The city's classic top-end address opposite the Opera; complimentary outdoor parking. Operator books — confirm; indicative price.",
      "park": "Free guarded 24/7 lot",
      "price": "$140–$220"
    }
  ],
  links: [
    {
      "l": "Silk Off Road Tours — From Desert Up to Glaciers",
      "u": "https://www.silkoffroadtours.com/motorcycle-tours-kazakhstan-kyrgyzstan"
    },
    { "l": "Wikipedia: Bishkek", "u": "https://en.wikipedia.org/wiki/Bishkek" },
    { "l": "Wikivoyage: Bishkek", "u": "https://en.wikivoyage.org/wiki/Bishkek" },
    { "l": "Wikipedia: Too-Ashuu (pass & tunnel)", "u": "https://en.wikipedia.org/wiki/Too_Ashuu" }
  ],
  photos: [
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Ala_Too_Square_Bishkek_2021.jpg/960px-Ala_Too_Square_Bishkek_2021.jpg",
      "cap": "Ala-Too Square, the ceremonial heart of Bishkek — flag, fountains and the Manas monument."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Kyrgyz_State_Historical_Museum%2C_Ala_Too_Square%2C_Bishkek%2C_Kyrgyzstan.jpg/960px-Kyrgyz_State_Historical_Museum%2C_Ala_Too_Square%2C_Bishkek%2C_Kyrgyzstan.jpg",
      "cap": "The State History Museum on Ala-Too Square — Saka gold to the Soviet century in one white monolith."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Osh_Bazaar_in_Bishkek%2C_Kyrgyzstan.jpg/960px-Osh_Bazaar_in_Bishkek%2C_Kyrgyzstan.jpg",
      "cap": "Osh Bazaar, the city's big working market — spices, kurut and the mid-tour souvenir sweep."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Panorama_of_the_Too_Ashuu_Pass%2C_Kyrgyz_Alatau%2C_Kyrgyzstan_01.jpg/960px-Panorama_of_the_Too_Ashuu_Pass%2C_Kyrgyz_Alatau%2C_Kyrgyzstan_01.jpg",
      "cap": "Too-Ashuu Pass (3,200 m), the Day-12 climb before the ~3-km tunnel and the long descent to the Chüy valley."
    }
  ]
},
{
  id: "cholpon-ata",
  name: "Cholpon-Ata",
  jp: "",
  region: "Issyk-Kul north shore, Kyrgyzstan",
  type: "stop",
  days: "Day 13 · 1 night (hotel)",
  legKm: 261,
  lat: 42.64854, lng: 77.08275, zoom: 12,
  tagline: "Issyk-Kul's sunny-side resort town — an easy asphalt day out of Bishkek through the Boom gorge, an evening swim off the north-shore beach, and a field of 5,000 boulders carved by Bronze Age and Saka hands.",
  intro: [
    "<b>Cholpon-Ata</b> is the capital of Issyk-Kul's holiday coast — the north shore, the sunny, sandy, resort-lined side of the lake that the tour skipped on the way south. Where the south shore was yurts and pebbles, the north is beaches, promenades, shashlik smoke and Soviet-era sanatoriums under the snow wall of the <b>Kungey Alatau</b>; across the water, the <b>Terskey Alatau</b> you crossed on Day 7 floats on the horizon. The town is also the lake's cultural showpiece: it hosts the hippodrome built for the <b>World Nomad Games</b> and, just uphill from the resorts, one of Central Asia's great open-air archaeological sites.",
    "That site is the <b>Cholpon-Ata petroglyphs</b> — a \"stone garden\" of some <b>5,000 glacial boulders spread over 42 hectares</b> between the town and the mountains, carved with ibex, deer, horsemen and hunting scenes. The oldest images date to the end of the <b>Bronze Age (around 1500 BC)</b>; most were cut by the <b>Saka-Usun tribes (8th century BC – 1st century AD)</b>, who held this slope sacred and used it for sun-god rituals, and the youngest belong to the Turkic era (5th–10th centuries). The ride in is the loop's recovery day: 261 km of honest asphalt east from Bishkek, funnelling through the <b>Boom gorge</b> — the red-rock canyon of the Chüy river that is the only natural gate between the capital's valley and the Issyk-Kul basin — before the lake opens out blue on your right for the last 100 km along the shore."
  ],
  highlights: [
    "<b>The open-air petroglyph field (\"stone garden\")</b> — Wander marked paths through 42 hectares of carved boulders with the lake below and the Kungey Alatau behind — Bronze Age to Saka-Usun to Turkic images, plus balbal stone figures (<b>go in the late-afternoon side light, when the carvings jump out of the rock; entry is a small cash fee</b>).",
    "<b>Beach evening on the north shore</b> — The classic Cholpon-Ata program: a swim off the sandy town beach, then shashlik and a cold drink on the promenade while the sun drops behind the mountains across the lake.",
    "<b>Ruh Ordo cultural complex</b> — A lakefront \"spiritual city\" named after the writer <b>Chingiz Aitmatov</b>: five white chapels for five world faiths, sculpture gardens and a long shoreline walk — kitschy to some, photogenic to all (<b>an easy sunset stroll from the centre</b>).",
    "<b>The Boom gorge (en route)</b> — Day 13's riding set-piece: the Chüy river's red-walled canyon carrying the road and railway side by side out of the Chüy valley — after four days of gravel passes, flowing tarmac feels like a gift (<b>watch the gusty wind where the gorge opens toward Balykchy</b>).",
    "<b>World Nomad Games hippodrome</b> — The giant horse-games arena that hosted the first three <b>World Nomad Games</b> (2014–2018); worth a look from the gate even outside event days."
  ],
  food: [
    {
      "n": "Lakeside fish",
      "d": "The north-shore staple: whole fried or hot-smoked Issyk-Kul fish sold along the promenade and in shore cafés — with bread, herbs and a squeeze of lemon it's the best simple dinner on the lake."
    },
    {
      "n": "Shashlik on the promenade",
      "d": "Skewers of lamb and beef grilling from late afternoon all along the beachfront strip; eaten standing up with raw onion and vinegar, washed down with kompot or a local beer."
    },
    {
      "n": "Resort-town classics",
      "d": "Proper lagman, manty and plov in the cafés on the main road, plus roadside apricots, cherries and kurut from stands on the shore highway — dinners are at your own expense, and unlike the south shore, cards work in the bigger places (still carry som)."
    }
  ],
  hotels: [
    {
      "n": "Cholpon-Ata hotel (operator's pick)",
      "t": "Hotel",
      "d": "Operator books — night 13 of the tour package (twin-share), close to the lakefront for the beach evening.",
      "park": "Guarded hotel lot",
      "price": "Included in tour price"
    },
    {
      "n": "Karven Four Seasons (Chok-Tal, near Cholpon-Ata)",
      "t": "Resort hotel",
      "d": "The north shore's polished lakefront resort — pools, private beach, restaurants. Operator books — confirm; indicative price.",
      "park": "On-site guarded parking",
      "price": "$120–$180"
    },
    {
      "n": "Raduga Resort Center (Sary-Oy)",
      "t": "Resort complex",
      "d": "Big Soviet-turned-modern holiday complex with cottages, beach and pools just west of town. Operator books — confirm; indicative price.",
      "park": "On-site parking",
      "price": "$60–$150"
    }
  ],
  links: [
    {
      "l": "Silk Off Road Tours — From Desert Up to Glaciers",
      "u": "https://www.silkoffroadtours.com/motorcycle-tours-kazakhstan-kyrgyzstan"
    },
    { "l": "Wikipedia: Cholpon-Ata", "u": "https://en.wikipedia.org/wiki/Cholpon-Ata" },
    { "l": "Wikivoyage: Cholpon-Ata", "u": "https://en.wikivoyage.org/wiki/Cholpon-Ata" },
    {
      "l": "Cholpon-Ata petroglyphs — visitor guide (Kyrgyz What?)",
      "u": "https://www.kyrgyzstantravel.com/guide-kyrgyzstan/attraction/cholpon-ata-petroglyphs"
    }
  ],
  photos: [
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Petroglyph_Museum_of_Cholpon-Ata_12.jpg/960px-Petroglyph_Museum_of_Cholpon-Ata_12.jpg",
      "cap": "A Saka-era ibex carved on a glacial boulder in the Cholpon-Ata \"stone garden\" — some 5,000 carved stones spread over 42 hectares."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Petroglyph_Museum_of_Cholpon-Ata_02.jpg/960px-Petroglyph_Museum_of_Cholpon-Ata_02.jpg",
      "cap": "Balbal stone figures stand among the petroglyph field, with the Kungey Alatau rising straight behind the site."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/2015-09-07-082719_-_Cholpon-Ata%2C_Anlegesteg_und_Blick_zum_S%C3%BCdufer_des_Yssykk%C3%B6l.jpg/960px-2015-09-07-082719_-_Cholpon-Ata%2C_Anlegesteg_und_Blick_zum_S%C3%BCdufer_des_Yssykk%C3%B6l.jpg",
      "cap": "Cholpon-Ata's pier, looking across Issyk-Kul to the snow wall of the Terskey Alatau — the range the tour crossed at 4,021 m on Day 7."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Rux_Ordo_from_the_SE.jpg/960px-Rux_Ordo_from_the_SE.jpg",
      "cap": "The sandy north-shore beach, with the white chapels of the Ruh Ordo complex across the bay — the Day-13 evening in one frame."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Lake_Issyk-Kul%2C_Cholpon-Ata%2C_Kyrgyzstan_%286170033784%29.jpg/960px-Lake_Issyk-Kul%2C_Cholpon-Ata%2C_Kyrgyzstan_%286170033784%29.jpg",
      "cap": "The leafy Cholpon-Ata lakefront — the resort side of Issyk-Kul, green and soft after the high passes."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Boom_Gorge%2C_Kyrgyzstan_%281%29.jpg/960px-Boom_Gorge%2C_Kyrgyzstan_%281%29.jpg",
      "cap": "The Boom gorge, the Chüy river's red-rock gate between Bishkek's valley and the Issyk-Kul basin — Day 13's route east."
    }
  ]
},
{
  id: "saty",
  name: "Saty & the Kolsai Lakes",
  jp: "",
  region: "Saty / Kolsai Lakes, Kazakhstan",
  type: "end",
  days: "Day 14 (1 night; Day-15 morning Kolsai/Kaindy, then the ~300 km run home to Almaty)",
  legKm: 325,
  lat: 43.06992, lng: 78.40982, zoom: 11,
  tagline: "The loop's last night: a one-street village in a Tian Shan valley, an alpine lake in the spruce forest, and — on the final morning — the ghostly sunken forest of Lake Kaindy.",
  intro: [
    "Day 14 closes the international part of the loop. From Cholpon-Ata the route runs east along Issyk-Kul's north shore, rounds the lake's eastern tip, and climbs back into the high <b>Karkara valley</b> — the same green border pastures the tour crossed nine days earlier, now taken in the opposite direction. Stamped back into Kazakhstan at Karkara, the road drops through Kegen and turns up a mountain valley to <b>Saty</b>, a one-street Kazakh village of log houses, haystacks, and satellite dishes that has become the base camp for <b>Kolsai Lakes National Park</b> — about 325 km for the day.",
    "Saty earns its place as the final overnight. Fifteen minutes up the valley lies <b>Kolsai Lake 1</b> (Lower Kolsai, ~1,800 m): a kilometer-long ribbon of blue-green water between steep spruce slopes, deep (up to ~80 m), cold, and absurdly photogenic — the \"pearls of the Tian Shan\" start here. And on the <b>Day-15 morning</b>, before the ~300 km run home to Almaty, comes the strangest sight of the whole trip: <b>Lake Kaindy</b>, reached by a ~12 km rough track off the Saty road, where the bleached trunks of a drowned spruce forest still stand upright in turquoise water — a lake created overnight when the <b>1911 Kebin earthquake</b> dammed the valley with a landslide. Park entry is a small per-person fee paid in cash at the checkpoint — the operator handles it. The night itself is pure village hospitality: a family guest house, bikes in the yard, dinner from the kitchen garden, and the Milky Way overhead."
  ],
  highlights: [
    "<b>Kolsai Lake 1 (Lower Kolsai, ~1,800 m)</b> — Ride the short valley road from Saty to the first of the three Kolsai lakes on the Day-14 evening or at first light: a 1-km-long, up-to-80-m-deep alpine lake pinned between forested ridges. Boardwalk paths, rowboats for rent, and trout in the water; the higher lakes (Kolsai 2 at ~2,250 m and Kolsai 3 near the Kyrgyz ridge) are hiking/horse territory beyond the road.",
    "<b>Lake Kaindy & the sunken forest (Day-15 morning)</b> — The finale: a <b>~12 km rough, rocky piste</b> off the Saty road — fords, ruts, proper DR650 terrain — climbs to a small lake at ~2,000 m where dozens of <b>Schrenk's spruce trunks stand dead-straight out of turquoise water</b>. The 1911 Kebin earthquake dropped a limestone landslide across the gorge; the river filled it, and the cold water has preserved the drowned forest for over a century. Walk the rim trail down to the shore before the day-trip crowds arrive, then point the bikes at Almaty.",
    "<b>The Karkara border, reversed</b> — Crossing back into Kazakhstan through the same high-pasture valley as Day 5 bookends the Kyrgyz chapters — yurts, herds, and snow peaks all still exactly where you left them.",
    "<b>Village-evening Saty</b> — Cows coming home at dusk, kids on horseback, hay wagons on the one street. Walk it end to end; it takes fifteen minutes and it's the last quiet of the trip.",
    "<b>Horseback option to the lakes</b> — Guest-house families arrange horses to Kolsai 1 or toward Kaindy for anyone who wants one Central-Asian ride done the original way before flying home."
  ],
  food: [
    {
      "n": "Home-cooked guest-house dinner",
      "d": "The village kitchens do the honest classics: soup or beshbarmak, plov, salads, potatoes from the garden — hot, generous, and served at one long table."
    },
    {
      "n": "Fresh bread, cream & mountain honey",
      "d": "Breakfast is baursaki or tandyr bread with kaymak (thick cream) and local honey from hives up the valley — Saty's quiet specialty."
    },
    {
      "n": "Kymyz",
      "d": "Fermented mare's milk, offered wherever horses graze; one last bowl before the city. Sour, fizzy, and the most Kazakh thing on the table."
    },
    {
      "n": "Pack for the piste",
      "d": "There are no cafés at Kaindy or the lakes; the guest house fills thermoses and wraps bread for the Day-15 morning run."
    }
  ],
  hotels: [
    {
      "n": "Saty guest house (operator's pick)",
      "t": "Village guest house · Day 14 night",
      "d": "Silk Off Road Tours books the group into a Saty family guest house; bikes sleep in the walled yard, dinner and breakfast are home-cooked. Confirm secure parking + luggage rules with the operator.",
      "park": "Enclosed yard",
      "price": "included in tour price — operator books"
    },
    {
      "n": "Kolsai Guesthouse (Saty)",
      "t": "Guest house",
      "d": "One of the village's established houses, bookable online; simple rooms, big home cooking. Confirm secure motorcycle parking before booking.",
      "park": "Courtyard",
      "price": "$30–$60 incl. dinner & breakfast"
    },
    {
      "n": "Family guest houses, Saty village",
      "t": "Homestay",
      "d": "Dozens of families in Saty take guests (several listed on Booking.com); basic shared facilities, generous cooking. Confirm secure motorcycle parking before booking.",
      "park": "Courtyard",
      "price": "$25–$50 incl. dinner & breakfast"
    }
  ],
  links: [
    {
      "l": "From Desert Up to Glaciers — Silk Off Road Tours (operator)",
      "u": "https://www.silkoffroadtours.com/motorcycle-tours-kazakhstan-kyrgyzstan"
    },
    {
      "l": "Kolsay Lakes National Park (Wikipedia)",
      "u": "https://en.wikipedia.org/wiki/Kolsay_Lakes_National_Park"
    },
    { "l": "Lake Kaindy (Wikipedia)", "u": "https://en.wikipedia.org/wiki/Lake_Kaindy" },
    {
      "l": "Kolsai Lakes & Lake Kaindy guide — Caravanistan",
      "u": "https://caravanistan.com/kazakhstan/almaty-region/kolsai-lakes-kaindy/"
    },
    { "l": "Kazakh Travel — official tourism portal", "u": "https://www.kazakh.travel/en" }
  ],
  photos: [
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Kaindy_lake_south-east_Kazakhstan.jpg/960px-Kaindy_lake_south-east_Kazakhstan.jpg",
      "cap": "Lake Kaindy — dead spruce trunks standing in the turquoise water of the 1911 landslide lake."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Lake_Kaindy%2C_Kazakhstan.jpg/960px-Lake_Kaindy%2C_Kazakhstan.jpg",
      "cap": "The drowned forest from the rim trail — the Day-15 morning reward at the top of a 12-km piste."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/First_Kolsay_lake_2023.jpg/960px-First_Kolsay_lake_2023.jpg",
      "cap": "Kolsai Lake 1 (~1,800 m) — a kilometer of blue-green water between spruce ridges."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Lower_Kolsai_Lake_Taken_on_a_Boat_%2842.98563557512841%2C_78.32500110512268%29.jpg/960px-Lower_Kolsai_Lake_Taken_on_a_Boat_%2842.98563557512841%2C_78.32500110512268%29.jpg",
      "cap": "On the water: rowboats rent by the hour at the first lake."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/210804_Middle_Kolsai.jpg/960px-210804_Middle_Kolsai.jpg",
      "cap": "Kolsai Lake 2 (~2,250 m) — hiking and horse territory above the road."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Saty_KAZ_01.jpg/960px-Saty_KAZ_01.jpg",
      "cap": "Saty — the one-street village that is base camp for the Kolsai Lakes."
    }
  ]
}
];

window.HOME = { city: "Almaty", country: "Kazakhstan" };
window.FLIGHTS = {
  "intro": "This is a guided package: Silk Off Road Tours provides the rental Suzuki DR650SE, the ride leader, the support truck that carries all luggage, every night's lodging, breakfasts, entry fees and both airport transfers. On the rider: a round-trip flight to Almaty (ALA), documents, personal insurance, fuel, and lunches & dinners (that last one is a feature — see the Food Trail). The loop starts and finishes in Almaty — no open-jaw flight logic.",
  "season": "Planned dates: Sep 5–20, 2026 — confirm dates and the custom-edition price with the operator. September brings stable weather on the steppe and desert legs, but the 3,000–4,000 m passes and yurt nights can sit near or below freezing while Chundzha still tops 30 °C: layering is the whole packing strategy.",
  "legs": [
    {
      "dir": "Getting there · fly to Almaty",
      "from": "Home airport",
      "to": "Almaty (ALA)",
      "sample": "Arrive by Sat Sep 5 · depart Sun Sep 20, 2026",
      "type": "Round-trip flight",
      "duration": "via IST · FRA · DXB or Astana",
      "note": "A simple round-trip ticket to Almaty International Airport (ALA). Arrive by Day 1 — the operator's transfer meets arrivals, and bike handover plus the welcome dinner happen that day, so land in the morning or the day before. Buffer days are cheap insurance against a missed handover. Both airport transfers are included."
    },
    {
      "dir": "The tour · the guided loop",
      "from": "Almaty",
      "to": "Almaty",
      "sample": "Days 1–16 · Sep 5–20 · a 14-day tour body (1 training + 12 riding + 1 rest day)",
      "type": "Guided group ride",
      "duration": "≈ 2,800 km · 13 riding days",
      "note": "A custom extended edition of the operator's 10-day route on a rental Suzuki DR650SE (43 hp, ~160 kg, third-party insurance included; USD 500 refundable damage deposit at handover — photograph the bike). Ride leader sets pace and lines; the support truck carries the duffel, spares and reserve fuel. The two Kegen/Karkara border crossings (Day 5 southbound +1 h, Day 14 northbound −1 h) are handled by the operator — you queue with your passport."
    }
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
    {
      "l": "Silk Off Road Tours — the operator",
      "u": "https://www.silkoffroadtours.com/motorcycle-tours-kazakhstan-kyrgyzstan"
    },
    {
      "l": "U.S. Embassy — visa-free travel to Kazakhstan",
      "u": "https://kz.usembassy.gov/visa-free-travel-to-kazakhstan/"
    },
    {
      "l": "travel.state.gov — Kazakhstan",
      "u": "https://travel.state.gov/content/travel/en/international-travel/International-Travel-Country-Information-Pages/Kazakhstan.html"
    },
    {
      "l": "travel.state.gov — Kyrgyzstan",
      "u": "https://travel.state.gov/content/travel/en/international-travel/International-Travel-Country-Information-Pages/Kyrgyzstan.html"
    },
    {
      "l": "Kyrgyzstan visa-free rules (30/60 days)",
      "u": "https://kyrgyzstan-tourism.com/news/kyrgyzstan-introduces-visa-free-regime-for-up-to-30-days-for-citizens-of-55-countries/"
    },
    { "l": "Kazakh Travel — official tourism portal", "u": "https://www.kazakh.travel/en" }
  ]
};

/* Day-by-day schedule (Day 1–16). day.html builds a timed routine per day.
   km are the planned legs (2,809 km total); dmin are honest ride-time estimates
   (~65 km/h asphalt, ~35 km/h gravel) — several legs are off Google's road graph. */
window.DAYS = [
{
    "d": 1,
    "date": "Sat Sep 5",
    "id": "almaty",
    "km": 0,
    "rest": false,
    "region": "Kazakhstan — Almaty",
    "title": "Arrival in Almaty",
    "route": "Airport transfer → DR650 handover & inspection → first look at the city → welcome dinner",
    "desc": "The loop begins the unhurried way. The Silk Off Road Tours crew meets arrivals at Almaty airport (ALA), transfers the group to the hotel, and runs the paperwork and Suzuki DR650SE handover — photograph the bike thoroughly, the USD 500 damage deposit rides on it. With the afternoon free, walk Panfilov Park and the wooden Zenkov Cathedral, graze the Green Bazaar, or ride the cable car up Kok-Tobe for the sunset panorama — 4,000-metre peaks hang over the avenues, a preview of where the tour is headed. The welcome dinner is where 6–10 riders who will share ~2,800 km meet for the first time; order the beshbarmak.",
    "tags": ["arrival", "food", "history"],
    "gfrom": "Almaty, Kazakhstan",
    "gto": "Almaty, Kazakhstan",
    "gvia": "",
    "poi": [
      {
        "name": "The DR650 handover & inspection",
        "what": "Day 1's real business: fit your DR650SE, walk around it with a camera (the deposit conversation later is easier with photos), sort riding gear and the duffel for the support truck, and ask every question now — the steppe has no service bays.",
        "q": "Almaty, Kazakhstan",
        "slot": "activity",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Panfilov_park_04.jpg/960px-Panfilov_park_04.jpg",
        "wiki": "https://en.wikipedia.org/wiki/Suzuki_DR650",
        "it": ["moto", "desert"]
      },
      {
        "name": "Panfilov Park & Zenkov Cathedral",
        "what": "Almaty's icon: the candy-colored Ascension (Zenkov) Cathedral, built in 1907 almost entirely of wood, standing in the shady Park of the 28 Panfilov Guardsmen — the single best short walk in the city.",
        "q": "Panfilov Park, Almaty",
        "slot": "scenic",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Zenkov_Cathedral%2C_Almaty.jpg/960px-Zenkov_Cathedral%2C_Almaty.jpg",
        "wiki": "https://en.wikipedia.org/wiki/Ascension_Cathedral,_Almaty",
        "it": ["history"]
      },
      {
        "name": "Green Bazaar",
        "what": "The classic Central Asian market: pyramids of dried fruit and spices, dairy and horse-meat halls, samsa stands, and vendors who insist you try everything. Perfect first-afternoon immersion.",
        "q": "Green Bazaar, Almaty",
        "slot": "stop",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Kok_Bazaar-Green_Bazaar%2C_Almaty_-_panoramio.jpg/960px-Kok_Bazaar-Green_Bazaar%2C_Almaty_-_panoramio.jpg",
        "it": ["food", "history"]
      },
      {
        "name": "Kok-Tobe at sunset",
        "what": "Ride the cable car from the center up to the hilltop park under the TV tower for a full panorama of Almaty against the mountains — welcome-dinner-adjacent timing.",
        "q": "Kok-Tobe, Almaty",
        "slot": "scenic",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Sunset_over_the_Almaty_seen_from_Kok_Tobe_mountain%2C_pic_1.jpg/960px-Sunset_over_the_Almaty_seen_from_Kok_Tobe_mountain%2C_pic_1.jpg",
        "wiki": "https://en.wikipedia.org/wiki/Kok_Tobe",
        "it": ["scenic"]
      },
      {
        "name": "Welcome dinner — beshbarmak",
        "what": "Kazakhstan's national dish to open the trip: hand-pulled pasta sheets under slow-boiled meat with onion broth, at a proper Kazakh restaurant. The Silk Road Food Trail starts here.",
        "q": "Almaty, Kazakhstan",
        "slot": "dinner",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Beshbarmak1.jpg/960px-Beshbarmak1.jpg",
        "wiki": "https://en.wikipedia.org/wiki/Beshbarmak",
        "it": ["food"]
      }
    ],
    "foodTrail": [
      {
        "style": "Beshbarmak — the welcome dinner",
        "shop": "A proper Kazakh restaurant, city center",
        "shopUrl": "https://www.google.com/maps/search/?api=1&query=beshbarmak%20restaurant%20Almaty",
        "city": "Almaty",
        "slot": "dinner"
      }
    ]
  },
{
    "d": 2,
    "date": "Sun Sep 6",
    "id": "almaty",
    "km": 120,
    "dmin": 160,
    "rest": false,
    "training": true,
    "region": "Kazakhstan — Almaty foothills",
    "title": "Training Day in the Foothills",
    "route": "Morning skills session (bike setup, off-road stance, gravel braking, sand basics) → easy foothill & steppe loop → back to Almaty",
    "desc": "Morocco-style: before any big leg, a dedicated skills-and-shakedown day. The morning is bike setup — levers, tire pressures, suspension sag — then off-road stance, gravel braking and sand basics on the DR650, re-grooving the habits on an unfamiliar, lighter bike. Then an easy ~120 km foothill-and-steppe loop east of the city to bed it all in and calibrate pace with the ride leader. This day is also the option-selector: the ride leader watches the group through the drills, and that verdict picks the glacier road vs. the coast road, Tosor vs. the Kochkor split, for the days ahead. Dial in the bike and the reflexes while the stakes are low.",
    "tags": ["ride", "training", "offroad"],
    "optNote": "The training day doubles as the <b>option-selector</b> for the flexible anchor plan: the ride leader's verdict on the drills picks the harder or easier route options between the anchors (S3 and S4 especially).",
    "gfrom": "Almaty, Kazakhstan",
    "gto": "Almaty, Kazakhstan",
    "gvia": "Medeu, Almaty|Turgen, Kazakhstan",
    "poi": [
      {
        "name": "Morning skills session",
        "what": "Bike setup first — lever and bar position, tire pressures for mixed surfaces, suspension sag, a full walk-around — then standing position, weighting the pegs, gravel braking front/rear balance, and sand basics: momentum, loose grip, paddling and recovery. Rehearsal for the Singing Dune pistes on Day 4.",
        "q": "Almaty, Kazakhstan",
        "slot": "activity",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Medeu_-_skate_rink_-_2022-06-18.jpg/960px-Medeu_-_skate_rink_-_2022-06-18.jpg",
        "it": ["training", "moto", "offroad"]
      },
      {
        "name": "Foothill & steppe loop (~120 km)",
        "what": "An easy loop through the foothills and steppe east of the city to settle suspension, luggage and group riding order — the last soft warm-up before the tour rolls out east on Day 3.",
        "q": "Turgen, Kazakhstan",
        "slot": "scenic",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Somewhere_in_Kazakhstan_%2820160402_071833_1PS%29_%2828754130621%29.jpg/960px-Somewhere_in_Kazakhstan_%2820160402_071833_1PS%29_%2828754130621%29.jpg",
        "it": ["training", "scenic", "desert"]
      },
      {
        "name": "Evening gear sort",
        "what": "Back in Almaty by late afternoon: pack the duffel for the support truck (soft bag, 15–20 kg), charge everything, and get the last big-city sleep — tomorrow the steppe starts.",
        "q": "Almaty, Kazakhstan",
        "slot": "stop",
        "it": ["moto", "desert"]
      }
    ],
    "road": {
      "surface": "50 km tarmac · 45 km graded gravel · 25 km dirt two-track & sand practice",
      "character": "low-stakes, high-value — drills first, then a flowing foothill loop to bed in an unfamiliar bike",
      "rating": {
        "raw": "Class 2 (Basic/Yellow), peaks Class 3 (Moderate/Orange) on the sand-practice two-track — deliberately, that's what the drills are for",
        "cls": 2,
        "peak": 3
      },
      "paras": [
        "The morning is a car-park-and-gravel-lot session, not riding: levers, pressures, sag, then off-road stance, gravel braking and sand paddling on the DR650 until it stops feeling rented. The afternoon loop climbs out of Almaty's orchard belt into Ile Alatau foothill country — narrow, patched tarmac like the Big Almaty Lake road, then graded gravel and dirt two-track along irrigation lines and up a gorge or two, the Turgen side being classic terrain for it. Nothing is steep, nothing is committing.",
        "What the day is really for: calibration. The DR650 carries its 160 kg low and steers from the pegs — after a 1300GS it feels like a mountain bike with a flywheel — and the leader uses the loop to watch every rider's sand posture and loose-surface braking, because this exact hour decides the glacier-road vs. coast-road and Tosor vs. Kochkor options later in the trip. Ride it honestly, not impressively."
      ],
      "photos": [
        {
          "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Road_to_Big_Almaty_Lake.jpg/960px-Road_to_Big_Almaty_Lake.jpg",
          "alt": "Narrow mountain tarmac climbing toward Big Almaty Lake",
          "cap": "Foothill training country: the narrow Big Almaty road climbing out of the city, snowline in sight twenty minutes from the hotel."
        },
        {
          "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/%D0%95%D0%BD%D0%B1%D0%B5%D0%BA%D1%88%D0%B8%D0%BA%D0%B0%D0%B7%D0%B0%D1%85%D1%81%D0%BA%D0%B8%D0%B9_%D1%80%D0%B0%D0%B9%D0%BE%D0%BD%2C_%D0%B4%D0%BE%D1%80%D0%BE%D0%B3%D0%B0_%D0%BD%D0%B0_%D0%9A%D0%B0%D0%B9%D1%80%D0%B0%D0%BA%D1%81%D0%BA%D0%B8%D0%B9_%D0%B2%D0%BE%D0%B4%D0%BE%D0%BF%D0%B0%D0%B4%2C_%D0%A2%D1%83%D1%80%D0%B3%D0%B5%D0%BD%D1%8C_%282%29.jpg/960px-%D0%95%D0%BD%D0%B1%D0%B5%D0%BA%D1%88%D0%B8%D0%BA%D0%B0%D0%B7%D0%B0%D1%85%D1%81%D0%BA%D0%B8%D0%B9_%D1%80%D0%B0%D0%B9%D0%BE%D0%BD%2C_%D0%B4%D0%BE%D1%80%D0%BE%D0%B3%D0%B0_%D0%BD%D0%B0_%D0%9A%D0%B0%D0%B9%D1%80%D0%B0%D0%BA%D1%81%D0%BA%D0%B8%D0%B9_%D0%B2%D0%BE%D0%B4%D0%BE%D0%BF%D0%B0%D0%B4%2C_%D0%A2%D1%83%D1%80%D0%B3%D0%B5%D0%BD%D1%8C_%282%29.jpg",
          "alt": "Dirt track beside the Turgen river in the gorge",
          "cap": "Turgen gorge east of Almaty: the kind of river-hugging dirt lane the training loop uses to bed in stance and braking."
        }
      ]
    }
  },
{
    "d": 3,
    "date": "Mon Sep 7",
    "id": "altyn-emel",
    "km": 250,
    "dmin": 230,
    "rest": false,
    "region": "Kazakhstan — Zhetysu",
    "opt": "S1a",
    "title": "Into the Steppe",
    "route": "Almaty → Konaev → Saryozek → mountain pass & retro-museum tea stop → Altyn-Emel NP (Basshi)",
    "desc": "The first touring day, and it wastes no time getting big. The route runs east out of Almaty onto the open steppe plateau — long, fast tarmac with the Tian Shan wall sliding along the right mirror — then lifts over a proper mountain pass and drops toward the Ili River basin. A mid-ride tea stop at a quirky roadside retro museum breaks up the 250 km before the group rolls into Basshi, the small village at the gate of Altyn-Emel National Park — one of Kazakhstan's largest protected areas at roughly 4,600 km² of desert, badlands and river floodplain. The night is the village guest house: bikes in the walled yard, a home-cooked dinner, and a sky full of stars.",
    "tags": ["ride", "scenic", "desert"],
    "gfrom": "Almaty, Kazakhstan",
    "gto": "Basshi, Kazakhstan",
    "gvia": "Konaev, Kazakhstan|Saryozek, Kazakhstan",
    "poi": [
      {
        "name": "Steppe plateau tarmac",
        "what": "Long, open two-lane across the steppe with the Tian Shan wall on the horizon — the first taste of Kazakh distance, ridden in group formation behind the leader.",
        "q": "Konaev, Kazakhstan",
        "slot": "scenic",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Somewhere_in_Kazakhstan_%2820160402_072251_1PS%29_%2828754128301%29.jpg/960px-Somewhere_in_Kazakhstan_%2820160402_072251_1PS%29_%2828754128301%29.jpg",
        "it": ["scenic", "desert"]
      },
      {
        "name": "Mountain pass & retro-museum tea stop",
        "what": "The day lifts over a mountain pass toward the Ili basin, with tea and simple plates at a quirky roadside retro museum — the classic operator's halfway break.",
        "q": "Saryozek, Kazakhstan",
        "slot": "coffee",
        "it": ["pass", "food", "history"]
      },
      {
        "name": "Basshi — the park gate",
        "what": "Arrive at the guest-house village at Altyn-Emel's entrance with time to settle in; kulan (Asiatic wild ass) and goitered gazelle graze the plains beyond the last houses. Light permitting, catch golden hour from the edge of the steppe.",
        "q": "Basshi, Kazakhstan",
        "slot": "activity",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Turkmenian_kulan_1.jpg/960px-Turkmenian_kulan_1.jpg",
        "wiki": "https://en.wikipedia.org/wiki/Altyn-Emel_National_Park",
        "it": ["wildlife", "desert", "scenic"]
      }
    ],
    "road": {
      "surface": "230 km tarmac · 20 km gravel (the last stretch into Basshi)",
      "character": "easy transfer with a pass — long steppe straights, one winding climb, first taste of open-country sightlines",
      "rating": {
        "raw": "Class 1 (Novice/Green) — mostly paved; the only dirt is the graded gravel of the last 20 km into Basshi",
        "cls": 1,
        "peak": null
      },
      "paras": [
        "Out of Almaty the day is honest transit: divided highway across the Ili plain, then two-lane tarmac rolling north-east through Kerbulak district with the Zhetysu steppe widening on both sides. The one riding event is the mountain pass on the Altyn-Emel road — a proper winding climb through rocky scrub, taken at touring pace with the retro-museum tea stop at the top. Traffic thins to almost nothing after Saryozek; the hazards are livestock, heat shimmer and the hypnosis of 20-km straights.",
        "Toward Basshi the tarmac frays and the final kilometres run on graded gravel with the Dzungarian Alatau standing blue across the valley — a gentle preview of tomorrow. It's the right day to settle into the DR650's 100–110 km/h cruise (that's all it has) and to learn the group's fuel-and-water rhythm before the surfaces get interesting."
      ],
      "photos": [
        {
          "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/%D0%98%D0%BB%D0%B8%D0%B9%D1%81%D0%BA%D0%B8%D0%B9_%D1%80%D0%B0%D0%B9%D0%BE%D0%BD%2C_%D0%90-3_%D1%81_%D0%BC%D0%BE%D1%81%D1%82%D0%B0_%D0%96%D0%94-%D0%BE%D0%B1%D1%85%D0%BE%D0%B4%D0%B0_%D0%90%D0%BB%D0%BC%D0%B0%D1%82%D1%8B_%281%29.jpg/960px-%D0%98%D0%BB%D0%B8%D0%B9%D1%81%D0%BA%D0%B8%D0%B9_%D1%80%D0%B0%D0%B9%D0%BE%D0%BD%2C_%D0%90-3_%D1%81_%D0%BC%D0%BE%D1%81%D1%82%D0%B0_%D0%96%D0%94-%D0%BE%D0%B1%D1%85%D0%BE%D0%B4%D0%B0_%D0%90%D0%BB%D0%BC%D0%B0%D1%82%D1%8B_%281%29.jpg",
          "alt": "The A-3 highway running across the Ili plain near Almaty",
          "cap": "Leaving Almaty on the A-3: the fast, empty tarmac stint across the Ili plain that opens the day."
        },
        {
          "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/%D0%9A%D0%B5%D1%80%D0%B1%D1%83%D0%BB%D0%B0%D0%BA%D1%81%D0%BA%D0%B8%D0%B9_%D1%80%D0%B0%D0%B9%D0%BE%D0%BD%2C_%D0%B4%D0%BE%D1%80%D0%BE%D0%B3%D0%B0_%D0%BD%D0%B0_%D0%BF%D0%BE%D1%8E%D1%89%D0%B8%D0%B9_%D0%B1%D0%B0%D1%80%D1%85%D0%B0%D0%BD.jpg/960px-%D0%9A%D0%B5%D1%80%D0%B1%D1%83%D0%BB%D0%B0%D0%BA%D1%81%D0%BA%D0%B8%D0%B9_%D1%80%D0%B0%D0%B9%D0%BE%D0%BD%2C_%D0%B4%D0%BE%D1%80%D0%BE%D0%B3%D0%B0_%D0%BD%D0%B0_%D0%BF%D0%BE%D1%8E%D1%89%D0%B8%D0%B9_%D0%B1%D0%B0%D1%80%D1%85%D0%B0%D0%BD.jpg",
          "alt": "Graded gravel road descending through Kerbulak district toward the Ili valley",
          "cap": "Kerbulak district, the road toward the Singing Dune: where the tarmac gives out and Altyn-Emel country begins — ridden in full tomorrow."
        }
      ]
    }
  },
{
    "d": 4,
    "date": "Tue Sep 8",
    "id": "chundzha",
    "km": 250,
    "dmin": 350,
    "rest": false,
    "region": "Kazakhstan — Zhetysu / Uyghur District",
    "opt": "S2a",
    "title": "The Singing Dune to the Hot Springs",
    "route": "Altyn-Emel → Singing Dune → Aktau white-and-red mountains → desert pistes → Chundzha; evening at the hot springs",
    "desc": "The tour's desert day proper — the operator's original 250 km leg. Instead of backtracking to the highway, the route leaves Basshi through Altyn-Emel itself: graded dirt, washboard and real sandy doubletrack past the 150-m Singing Dune (climb it barefoot, slide down, make it hum) and the Martian white-and-red Aktau badlands, before dropping south across the Ili basin on empty tarmac to Chundzha, capital of Kazakhstan's Uyghur District. This is the first proper off-tarmac riding of the tour, with the support truck sweeping — and the reward is engineered: a field of 140 thermal springs, outdoor pools at 36–50 °C, and the best lagman in the country. Soak until the desert is out of your gear.",
    "tags": ["ride", "offroad", "desert", "hotspring"],
    "gfrom": "Basshi, Kazakhstan",
    "gto": "Chundzha, Kazakhstan",
    "gvia": "Singing Dune, Altyn-Emel|Aktau Mountains, Altyn-Emel",
    "poi": [
      {
        "name": "The Singing Dune",
        "what": "An isolated barchan about 150 m high and 3 km long that produces a deep organ-like hum when dry sand avalanches down its lee face — one of the strangest sounds in Central Asia. Climb the ridge barefoot and set it off.",
        "q": "Singing Dune, Altyn-Emel",
        "slot": "activity",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/210723_Altyn_Emel_Singing_Dune_came_2.jpg/960px-210723_Altyn_Emel_Singing_Dune_came_2.jpg",
        "wiki": "https://en.wikipedia.org/wiki/Altyn-Emel_National_Park",
        "it": ["desert", "scenic"]
      },
      {
        "name": "Aktau chalk mountains",
        "what": "Bands of white, cream, red and orange rock folded into gullies and cathedral shapes — an open-air geology lesson roughly 400 million years in the making, best in low morning light.",
        "q": "Aktau Mountains, Altyn-Emel",
        "slot": "scenic",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Chalk_Mountains._Aktau_Mountains._Altyn-Emel_National_Park._Kazakhstan%2C_April_2025_01.jpg/960px-Chalk_Mountains._Aktau_Mountains._Altyn-Emel_National_Park._Kazakhstan%2C_April_2025_01.jpg",
        "wiki": "https://en.wikipedia.org/wiki/Aktau_Mountains",
        "it": ["desert", "scenic", "history"]
      },
      {
        "name": "Katutau lava fields",
        "what": "Melted-looking towers and honeycombed outcrops of dark volcanic rock — and the pistes between them are proper DR650 terrain.",
        "q": "Katutau, Altyn-Emel",
        "slot": "scenic",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/%D0%9A%D0%B0%D1%82%D1%83%D1%82%D0%B0%D1%83.jpg/960px-%D0%9A%D0%B0%D1%82%D1%83%D1%82%D0%B0%D1%83.jpg",
        "wiki": "https://en.wikipedia.org/wiki/Katutau",
        "it": ["desert", "offroad", "food"]
      },
      {
        "name": "Desert pistes to the Ili basin",
        "what": "Graded dirt, washboard and sand patches through the park, then open near-empty tarmac south across the Ili basin — the Day-2 sand drills earn their keep here. An asphalt alternative exists inside the park if conditions are bad.",
        "q": "Chundzha, Kazakhstan",
        "slot": "stop",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Somewhere_in_Kazakhstan_%2820160402_072251_1PS%29_%2828754128301%29.jpg/960px-Somewhere_in_Kazakhstan_%2820160402_072251_1PS%29_%2828754128301%29.jpg",
        "it": ["offroad", "desert", "training"]
      },
      {
        "name": "Chundzha hot springs",
        "what": "The perfectly engineered overnight: outdoor thermal pools at 36–50 °C under the open sky, saunas and plunge tubs — exactly what a morning of dune and badland pistes orders, with lagman until you can't.",
        "q": "Chundzha, Kazakhstan",
        "slot": "dinner",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Lagman_Moscow_2023.jpg/960px-Lagman_Moscow_2023.jpg",
        "wiki": "https://en.wikipedia.org/wiki/Chunja_hot_springs",
        "it": ["hotspring", "food", "offroad"]
      }
    ],
    "foodTrail": [
      {
        "style": "Laghman — the real thing",
        "shop": "Uyghur café at the resort strip",
        "shopUrl": "https://www.google.com/maps/search/?api=1&query=lagman%20Chundzha%20Shonzhy",
        "city": "Chundzha",
        "slot": "dinner"
      }
    ],
    "road": {
      "surface": "90 km tarmac · 100 km graded park piste · 60 km sandy two-track & washboard",
      "character": "the desert day — fast washboard, sand pockets, huge flat sightlines; heat is the tax, the dune is the pay-off",
      "rating": {
        "raw": "Class 2 (Basic/Yellow) on the graded pistes and washboard, peaks Class 3 (Moderate/Orange) in the sand pockets and the sandy two-track on the dune and Aktau approaches",
        "cls": 2,
        "peak": 3
      },
      "paras": [
        "This is the day the DR650 was rented for. From Basshi the park pistes run dead straight across saxaul desert: hard-packed clay and gravel that lets you carry real speed standing up, interrupted without warning by washboard that blurs the mirrors and sand pockets that grab the front if you're sitting down. The 150-m Singing Dune arrives like a mirage between the Ulken and Kishi Kalkan hills; ride to its foot, then climb it on foot and hear it moan. The onward piste to the Aktau chalk mountains crosses genuinely empty country — white, ochre and red badlands with no shade and no services, which is exactly why the support truck carries the water.",
        "Navigation is trivial (one track, one leader) but the riding rewards discipline: loose grip, momentum through the soft stuff, eyes 100 m ahead where the washboard patches shine. There's an asphalt alternative through the park if the wind has drifted sand across the pistes — taking it is a weather call, not a failure. The day ends with tarmac south to Chundzha and a hot-spring soak that will feel earned; expect 30 °C+ out here even in September."
      ],
      "photos": [
        {
          "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/%D0%90%D0%BB%D1%82%D1%8B%D0%BD-%D0%AD%D0%BC%D0%B5%D0%BB%D1%8C%2C_%D0%B4%D0%BE%D1%80%D0%BE%D0%B3%D0%B0_%281%29.jpg/960px-%D0%90%D0%BB%D1%82%D1%8B%D0%BD-%D0%AD%D0%BC%D0%B5%D0%BB%D1%8C%2C_%D0%B4%D0%BE%D1%80%D0%BE%D0%B3%D0%B0_%281%29.jpg",
          "alt": "Graded desert piste running through saxaul scrub in Altyn-Emel",
          "cap": "The Altyn-Emel piste: graded gravel over clay, dead straight, washboard in the shiny patches — third-gear standing country."
        },
        {
          "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/%D0%90%D0%BB%D1%82%D1%8B%D0%BD-%D0%AD%D0%BC%D0%B5%D0%BB%D1%8C%2C_%D0%B4%D0%BE%D1%80%D0%BE%D0%B3%D0%B0_%282%29.jpg/960px-%D0%90%D0%BB%D1%82%D1%8B%D0%BD-%D0%AD%D0%BC%D0%B5%D0%BB%D1%8C%2C_%D0%B4%D0%BE%D1%80%D0%BE%D0%B3%D0%B0_%282%29.jpg",
          "alt": "Dirt track heading toward the white and red Aktau mountains",
          "cap": "The track toward Aktau: the white-and-red chalk mountains rise off the desert floor at the end of a two-track that hasn't turned in ten minutes."
        }
      ]
    }
  },
{
    "d": 5,
    "date": "Wed Sep 9",
    "id": "karakol",
    "km": 280,
    "dmin": 280,
    "rest": false,
    "region": "KZ → Kyrgyzstan — Issyk-Kul",
    "opt": "S2a",
    "title": "Charyn Canyon & the Border",
    "route": "Chundzha → Charyn Canyon → Kegen/Karkara border (KZ → KG, clocks +1 h) → Karkara valley → Karakol",
    "desc": "The tour's great transition: it starts in Kazakh desert and ends in a Kyrgyz mountain town. Less than an hour from Chundzha comes Charyn Canyon — the Valley of Castles, where 12-million-year-old sandstone has eroded into towers and fortress walls up to ~100 m high; go early for cool air and empty trails. Then the route climbs along the Ketmen range to Kegen and the quiet, summer-friendly Karkara border post — the operator handles the bikes' paperwork, you queue with your passport, and clocks go forward an hour. The descent into Kyrgyzstan is the day's riding reward: open alpine valley, snow peaks of the Terskey Alatau ahead, barely any traffic, and Karakol — the adventure capital — for the evening: the wooden Holy Trinity Church, the nail-less Dungan Mosque, and ashlan-fuu country.",
    "tags": ["ride", "canyon", "border", "history"],
    "gfrom": "Chundzha, Kazakhstan",
    "gto": "Karakol, Kyrgyzstan",
    "gvia": "Charyn Canyon|Kegen, Kazakhstan|Karkara border crossing",
    "poi": [
      {
        "name": "Charyn Canyon — the Valley of Castles",
        "what": "A red sandstone gorge where the rock has eroded into towers, arches and fortress walls along a 2-km valley (the canyon runs 150 m+ deep elsewhere). Walk the valley floor to the Charyn River viewpoint before the day-trip crowds arrive.",
        "q": "Charyn Canyon",
        "slot": "activity",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Charyn_Canyon%2C_Kazakhstan_01.jpg/960px-Charyn_Canyon%2C_Kazakhstan_01.jpg",
        "wiki": "https://en.wikipedia.org/wiki/Charyn_Canyon",
        "it": ["canyon", "scenic"]
      },
      {
        "name": "Kegen & the Karkara border (KZ → KG, clocks +1 h)",
        "what": "Kazakhstan → Kyrgyzstan the scenic way: a small seasonal post in the high Karkara valley, all green pasture and yurts. Passports, bike documents, twenty minutes of stamps — and the tour is in country number two. Set your watch: +1 h.",
        "q": "Karkara border crossing",
        "slot": "stop",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Karkara_River_valley%2C_Khan_Tengri_Nature_Park.jpg/960px-Karkara_River_valley%2C_Khan_Tengri_Nature_Park.jpg",
        "wiki": "https://en.wikipedia.org/wiki/Kegen",
        "it": ["border", "pass", "yurt"]
      },
      {
        "name": "Karkara valley descent",
        "what": "Open alpine valley riding down toward Issyk-Kul with the snow wall of the Terskey Alatau ahead and almost no traffic — the sweetest tarmac of the first week.",
        "q": "Karakol, Kyrgyzstan",
        "slot": "scenic",
        "it": ["scenic", "pass", "lake"]
      },
      {
        "name": "Holy Trinity Church, Karakol",
        "what": "Karakol's wooden cathedral, rebuilt in 1895 after an earthquake destroyed the original; green domes and golden crosses over log walls, perfect in evening light.",
        "q": "Holy Trinity Cathedral, Karakol",
        "slot": "scenic",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Karakol_cathedral.jpg/960px-Karakol_cathedral.jpg",
        "wiki": "https://en.wikipedia.org/wiki/Karakol",
        "it": ["history"]
      },
      {
        "name": "Dungan Mosque",
        "what": "Commissioned in 1904 and built over six years in Chinese pagoda style, held together by joinery on 42 wooden pillars — famously built without a single nail. Still an active mosque; visitors welcome outside prayer times.",
        "q": "Dungan Mosque, Karakol",
        "slot": "stop",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Karakol_Dungan_Mosque.jpg/960px-Karakol_Dungan_Mosque.jpg",
        "it": ["history"]
      }
    ],
    "road": {
      "surface": "235 km tarmac · 45 km gravel (canyon access, the border approach and the Karkara valley)",
      "character": "a big-scenery tarmac day with a canyon, a time-zone line and a quiet border in the middle",
      "rating": {
        "raw": "Class 2 (Basic/Yellow) on the canyon spur and the Karkara valley gravel, peaks Class 3 (Moderate/Orange) on the optional soft-sand track into the Valley of Castles",
        "cls": 2,
        "peak": 3
      },
      "paras": [
        "South from Chundzha the A352 runs empty and straight through Uyghur farmland, then the day's first event: the gravel spur to Charyn Canyon and, for those who want it, the sandy 4WD track down among the hoodoos of the Valley of Castles — soft, orange, walled in by 100-m towers, and the most photogenic 3 km of dirt in Kazakhstan. Back on the plateau the road climbs steadily to Kegen through open sheep country with the Ketmen range on the left shoulder.",
        "The Kegen/Karkara crossing is the anti-Torugart: a farm-track border with a handful of vehicles, rough asphalt to the post on the Kazakh side and old asphalt-and-gravel down the Karkara valley on the Kyrgyz side (roughly the last 35–40 km before Tüp are gravel). The operator handles the bike papers; you queue with a passport, put the clock forward an hour, and descend along the Terskey Alatau wall to Karakol. Fuel up in Kegen — the border segment has nothing."
      ],
      "photos": [
        {
          "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/CharynRoad.jpg/960px-CharynRoad.jpg",
          "alt": "Gravel road winding along the floor of Charyn Canyon seen from the rim",
          "cap": "Charyn from the rim: the access road threading the canyon floor 100 m below the steppe."
        },
        {
          "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/22_%D0%92_%D0%B4%D0%BE%D0%BB%D0%B8%D0%BD%D0%B5_%D0%B7%D0%B0%D0%BC%D0%BA%D0%BE%D0%B2.jpg/960px-22_%D0%92_%D0%B4%D0%BE%D0%BB%D0%B8%D0%BD%D0%B5_%D0%B7%D0%B0%D0%BC%D0%BA%D0%BE%D0%B2.jpg",
          "alt": "Sandy 4WD track between rock towers in the Valley of Castles",
          "cap": "The Valley of Castles track: soft sand between the hoodoos — first-gear, feet-ready riding in the prettiest ditch in Kazakhstan."
        }
      ]
    }
  },
{
    "d": 6,
    "date": "Thu Sep 10",
    "id": "karakol",
    "km": 110,
    "dmin": 145,
    "rest": false,
    "region": "Kyrgyzstan — Issyk-Kul",
    "title": "Jeti-Oguz & Altyn-Arashan",
    "route": "Day loop out of Karakol: Jeti-Oguz red cliffs → Altyn-Arashan gorge track & hot springs → Karakol",
    "desc": "A riding day with no packing — the luggage never moves. The morning runs 28 km southwest to Jeti-Oguz, where a wall of sheer red sandstone cliffs — seven ribs of rock said to be seven petrified bulls — rises out of the spruce forest, with easy gravel up the gorge to the Kok-Jaiyk 'Valley of Flowers' meadows. The afternoon is the riding main course: from Ak-Suu village a genuinely rough 4x4/moto track climbs ~14 km up the Arashan river gorge — rocks, ruts, stream splashes, the stuff the DR650 was rented for — to a green valley at ~2,600 m where hot-spring pools steam beside the river below the snow pyramid of Palatka peak. Soak, drink tea at a yurt camp, ride back down — and eat ashlan-fuu at the bazaar for pennies.",
    "tags": ["ride", "offroad", "hotspring", "scenic"],
    "optNote": "This is the <b>anchor A2 day loop</b> — Karakol is a two-night anchor precisely so this day rides light: no camp move, no packing, just the Terskey Alatau.",
    "gfrom": "Karakol, Kyrgyzstan",
    "gto": "Karakol, Kyrgyzstan",
    "gvia": "Jeti-Oguz Rocks|Teploklyuchenka (Ak-Suu)|Altyn-Arashan",
    "poi": [
      {
        "name": "Jeti-Oguz — the Seven Bulls",
        "what": "Sheer red sandstone cliffs out of the spruce forest, with the split 'Broken Heart' rock guarding the gorge entrance. Paved to the village, then easy gravel up past the old Soviet spa to the Valley of Flowers meadows — photo stop upon photo stop.",
        "q": "Jeti-Oguz Rocks",
        "slot": "scenic",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Jeti-%C3%96g%C3%BCz_Rocks_-_Issyk-Kul_Region%2C_Jeti-Oguz_District.jpg/960px-Jeti-%C3%96g%C3%BCz_Rocks_-_Issyk-Kul_Region%2C_Jeti-Oguz_District.jpg",
        "wiki": "https://en.wikipedia.org/wiki/Jeti-Oguz",
        "it": ["scenic", "canyon", "offroad"]
      },
      {
        "name": "Altyn-Arashan track & hot springs",
        "what": "The rough stuff: ~14 km of rocks, ruts and stream splashes up the Arashan gorge to hydrogen-sulfide pools at ~41 °C steaming beside the river at ~2,600 m. Soak, tea at the yurt camp, then ride it all back down. Weather-dependent; the support truck waits at the valley mouth.",
        "q": "Altyn-Arashan",
        "slot": "activity",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Altyn_Arashan_resort%2C_Kyrgyzstan.jpg/960px-Altyn_Arashan_resort%2C_Kyrgyzstan.jpg",
        "wiki": "https://en.wikipedia.org/wiki/Altyn_Arashan",
        "it": ["offroad", "hotspring", "yurt"]
      },
      {
        "name": "Przhevalsky memorial (optional)",
        "what": "The explorer Nikolai Przhevalsky (of Przewalski's-horse fame) made Karakol his base and is buried above the lake shore nearby — a short detour if the loop comes home with daylight to spare.",
        "q": "Karakol, Kyrgyzstan",
        "slot": "stop",
        "wiki": "https://en.wikipedia.org/wiki/Nikolay_Przhevalsky",
        "it": ["history", "lake"]
      }
    ],
    "foodTrail": [
      {
        "style": "Ashlan-fuu at the bazaar",
        "shop": "Karakol bazaar ashlan-fuu stalls",
        "shopUrl": "https://www.google.com/maps/search/?api=1&query=ashlan-fuu%20Karakol%20bazaar",
        "city": "Karakol",
        "slot": "lunch"
      }
    ],
    "road": {
      "surface": "50 km tarmac · 25 km valley gravel · 35 km rough rocky 4WD track",
      "character": "short, technical and luggage-free — the roughest surface-per-kilometre of the trip, on a day you could bail out of at any point",
      "rating": {
        "raw": "Class 3 (Moderate/Orange), peaks Class 4 (Difficult/Red) on the Altyn-Arashan gorge track's rock steps, mud holes and churned ruts",
        "cls": 3,
        "peak": 4
      },
      "paras": [
        "A day loop with the panniers left at the hotel, and the DR650 at its best. Jeti-Oguz first: easy tarmac west, then a red-earth valley road under the Seven Bulls cliffs, dirt and river gravel as far up the Svetlaya Polyana meadows as the group cares to go. Back through Karakol, the Altyn-Arashan track is the real event — a genuine 4WD-grade gorge road, 14-odd km of rock steps, roots, mud holes and churned ruts climbing beside the Arashan river to the hot-springs camp at 2,600 m. Locals do it in ex-military UAZ vans for a reason.",
        "On a light bike with no luggage it's the most fun surface of the tour: pick lines constantly, stay off the front brake on the polished rock, let the bike walk over the babyheads. It's also the day's honest skill check — anyone who fights the gorge track will be glad the rest day is coming, and the leader will remember it when the Tosor option comes up. Soak in the springs before the descent; the ride down is harder on the arms than the ride up."
      ],
      "photos": [
        {
          "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Djeti-Oguz_Valley_%283976719188%29.jpg/960px-Djeti-Oguz_Valley_%283976719188%29.jpg",
          "alt": "The road winding down the Jeti-Oguz valley toward Issyk-Kul",
          "cap": "The Jeti-Oguz valley road snaking down between the red cliffs, Issyk-Kul flat and silver in the distance."
        },
        {
          "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Altyn_Arashan_resort%2C_Kyrgyzstan_3.jpg/960px-Altyn_Arashan_resort%2C_Kyrgyzstan_3.jpg",
          "alt": "The Altyn-Arashan valley with churned 4WD tracks leading to the camp",
          "cap": "Top of the Altyn-Arashan track: the mud-churned 4WD ruts spilling into the hot-springs meadow at 2,600 m."
        }
      ]
    }
  },
{
    "d": 7,
    "date": "Fri Sep 11",
    "id": "issyk-kul",
    "km": 190,
    "dmin": 295,
    "rest": false,
    "region": "Kyrgyzstan — Issyk-Kul",
    "opt": "S3a",
    "title": "Up to the Glaciers",
    "route": "Karakol → Barskoon gorge → Sarimonok 3,126 m → Barskoon 3,754 m → Suek Pass 4,021 m → glaciers → Issyk-Kul south shore",
    "desc": "The day the whole tour is named for — and the hardest reference leg. From Karakol the route climbs into the Barskoon gorge and onto the high gravel mining road toward Kumtor, crossing Sarimonok Pass (3,126 m), Barskoon Pass (3,754 m) and finally Suek Pass at 4,021 m — the highest point of the trip, with glaciers hanging beside the road, marmots on the verges and a real chance of snow flurries in any month. Ride it behind the leader; the weather can turn fast. Then the payoff: a 2,400-metre descent from the ice down to a warm, slightly saline lake you can swim in before dinner. Desert-to-glacier-to-beach in a single riding day — and the rest day lands tomorrow for a reason.",
    "tags": ["ride", "offroad", "pass", "scenic"],
    "gfrom": "Karakol, Kyrgyzstan",
    "gto": "Tosor, Kyrgyzstan",
    "gvia": "Barskoon, Kyrgyzstan|Barskoon Waterfall|Suek Pass",
    "poi": [
      {
        "name": "Barskoon gorge & Gagarin's waterfall",
        "what": "Spruce forest, granite walls and the famous falls a short walk from the gorge road — Yuri Gagarin holidayed here after his flight, and a monument to him stands among the trees.",
        "q": "Barskoon Waterfall",
        "slot": "scenic",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Barsko%C3%B6n_Waterfall.jpg/960px-Barsko%C3%B6n_Waterfall.jpg",
        "wiki": "https://en.wikipedia.org/wiki/Barskoon",
        "it": ["scenic", "canyon", "history"]
      },
      {
        "name": "The three-pass mining road",
        "what": "Hard gravel switchbacks built for the Kumtor gold mine: Sarimonok (3,126 m), then Barskoon (3,754 m) — altitude discipline from here up: hydrate, layer, easy throttle.",
        "q": "Barskoon Pass",
        "slot": "stop",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/The_view_on_Barskoon_George.jpg/960px-The_view_on_Barskoon_George.jpg",
        "it": ["pass", "offroad"]
      },
      {
        "name": "Suek Pass — 4,021 m",
        "what": "The roof of the tour: glacier tongues at arm's length above the road, thin cold air, and the whole Terskey Alatau falling away behind. Photos, a few minutes of grinning, then the 2,400 m descent begins.",
        "q": "Suek Pass",
        "slot": "scenic",
        "it": ["pass", "scenic"]
      },
      {
        "name": "First swim in Issyk-Kul",
        "what": "The camp is steps from a pebble beach; the mildly salty 'warm lake' — the world's second-largest alpine lake, and it never freezes — is genuinely swimmable. The classic way to wash off a 4,000-metre day (sandals: the pebbles are sharp).",
        "q": "Tosor, Kyrgyzstan",
        "slot": "activity",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Issyk-Kul_South_Shore_Aug_2006.JPG/960px-Issyk-Kul_South_Shore_Aug_2006.JPG",
        "wiki": "https://en.wikipedia.org/wiki/Issyk-Kul",
        "it": ["lake", "scenic"]
      },
      {
        "name": "Yurt-camp evening",
        "what": "Sunset over the water with the Kungey Alatau glowing pink across the lake, dinner in the communal yurt, and a sky full of stars once the generator goes off.",
        "q": "Tosor, Kyrgyzstan",
        "slot": "dinner",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/%D0%9A%D1%8B%D1%80%D0%B3%D1%8B%D0%B7%D1%81%D0%BA%D0%B0%D1%8F_%D1%8E%D1%80%D1%82%D0%B0%2C_%D0%B4%D0%BE%D0%BC_%D1%81%D1%80%D0%B5%D0%B4%D0%B8_%D0%BD%D0%B5%D0%B1%D0%B5%D1%81%D0%BD%D1%8B%D1%85_%D0%B3%D0%BE%D1%80.jpg/960px-%D0%9A%D1%8B%D1%80%D0%B3%D1%8B%D0%B7%D1%81%D0%BA%D0%B0%D1%8F_%D1%8E%D1%80%D1%82%D0%B0%2C_%D0%B4%D0%BE%D0%BC_%D1%81%D1%80%D0%B5%D0%B4%D0%B8_%D0%BD%D0%B5%D0%B1%D0%B5%D1%81%D0%BD%D1%8B%D1%85_%D0%B3%D0%BE%D1%80.jpg",
        "it": ["yurt", "scenic", "food"]
      }
    ],
    "road": {
      "surface": "80 km tarmac · 110 km high-altitude mine-road gravel (Sarimonok 3,126 m → Barskoon 3,754 m → Suek 4,021 m)",
      "character": "the crux — a maintained gravel superhighway to 4,000 m; the difficulty is altitude, cold and weather, not the surface",
      "rating": {
        "raw": "Class 2 (Basic/Yellow) on the graded mine road, touching Class 3 (Moderate/Orange) on the upper pass switchbacks — the real grade here is altitude and cold, not terrain",
        "cls": 2,
        "peak": 3
      },
      "paras": [
        "The lake road west to Barskoon village is a warm-up; the gorge is the main act. The A364 up Barskoon gorge is the Kumtor gold-mine supply road — wide, graded, all-season gravel built for 100-tonne haul trucks — which means the riding itself is fast and stable: long climbing straights, big sweeping switchbacks past the waterfalls and the Gagarin monument, dust plumes visible a kilometre off when a mine convoy comes down (give them the whole road; they don't slow). The passes stack up — Sarimonok, then Barskoon at 3,754 m, then Suek at 4,021 m — and above 3,500 m the world turns lunar: permafrost tundra, turquoise tarns, glacier tongues hanging off the Ak-Shyirak massif at arm's length.",
        "What actually gets riders here is the air. The DR650 loses a chunk of its 43 hp, and so do you — clumsy feet, slow thoughts, cold that cuts through summer gloves even in September, and squalls that can throw snow across the road in any month. Layer up at the bottom, eat before the top, keep the pace mechanical. The descent to the south-shore yurt camp sheds 2,400 m of altitude into golden-hour lake light, and the rest day lands tomorrow by design. If the weather says no, the coast-road bail-out (S3b) exists and taking it is the adult move."
      ],
      "photos": [
        {
          "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Pereval_Barskaun.jpg/960px-Pereval_Barskaun.jpg",
          "alt": "Gravel road running past a mountain tarn near Barskaun pass",
          "cap": "The Kumtor road near Barskoon pass: all-season graded gravel past permafrost tarns at 3,700 m — fast, cold, huge."
        },
        {
          "src": "https://upload.wikimedia.org/wikipedia/commons/8/84/Kyrgyzstan_Barscaun_Canyon.jpg",
          "alt": "Barskoon gorge with the mine road visible below",
          "cap": "Barskoon gorge from above the treeline, the haul road a pale ribbon on the valley floor."
        },
        {
          "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Kumtor_panorama_1_-_panoramio.jpg/960px-Kumtor_panorama_1_-_panoramio.jpg",
          "alt": "Panorama of the Kumtor mine plateau at 4,000 m with haul roads and glaciers",
          "cap": "The reason the road exists: the Kumtor workings at ~4,000 m, ringed by the glaciers the day is named for."
        }
      ]
    }
  },
{
    "d": 8,
    "date": "Sat Sep 12",
    "id": "issyk-kul",
    "km": 0,
    "rest": true,
    "region": "Kyrgyzstan — Issyk-Kul south shore",
    "title": "Rest Day at the Lake",
    "route": "No riding — lake swim, Skazka canyon walk, banya, laundry, bike checks, a long lunch",
    "desc": "The one full no-riding day of the tour, placed deliberately: it lands immediately after the 4,021 m Suek day, sits at lake altitude (~1,600 m) to aid acclimatization between the 4,000 m crossing and the 3,000 m nights at Song-Kol, and opens a maintenance window before the hard Days 9–12 block. Sleep in, swim off the camp's pebble beach, walk the red-rock Skazka (Fairy Tale) canyon, book the banya with the hosts, hand a laundry bag to the crew and give the mechanic time with your DR650 — chain, spokes, air filter after the dusty mining road. This is part of the acclimatization plan, not a luxury.",
    "tags": ["rest", "lake"],
    "gfrom": "Tosor, Kyrgyzstan",
    "gto": "Tosor, Kyrgyzstan",
    "gvia": "",
    "poi": [
      {
        "name": "Swim, nap, repeat",
        "what": "Zero kilometres. Sleep in, swim off the camp's beach, read on the pebbles, walk the shore — deliberate recovery before the passes to Song-Kol, Suusamyr and Bishkek.",
        "q": "Tosor, Kyrgyzstan",
        "slot": "activity",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Issyk-Kul_South_Shore_Aug_2006.JPG/960px-Issyk-Kul_South_Shore_Aug_2006.JPG",
        "wiki": "https://en.wikipedia.org/wiki/Issyk-Kul",
        "it": ["rest", "lake", "pass"]
      },
      {
        "name": "Skazka (Fairy Tale) Canyon",
        "what": "Eroded red-and-orange rock formations a short hop along the south-shore road — a quick, photogenic leg-stretch that needs walking shoes, not riding boots.",
        "q": "Skazka Canyon",
        "slot": "scenic",
        "it": ["canyon", "scenic", "lake"]
      },
      {
        "name": "Banya afternoon",
        "what": "The south-shore camps and nearby Tamga guest houses can fire up a steam bath — the definitive fix for a week of riding shoulders; book it in the morning, small cash cost.",
        "q": "Tamga, Kyrgyzstan",
        "slot": "activity",
        "it": ["hotspring", "rest", "lake"]
      },
      {
        "name": "Laundry & bike checks",
        "what": "Hand a bag to the support crew for washing and let the mechanic work through the DR650 — chain, tyres, air filter — so the bike starts the Song-Kol block as fresh as you do.",
        "q": "Tosor, Kyrgyzstan",
        "slot": "stop",
        "it": ["moto", "rest", "lake"]
      },
      {
        "name": "Horseback to a jailoo (optional)",
        "what": "Camps arrange half-day horse treks up to a nearby summer pasture with a local horseman — a gentle preview of Song-Kol's herding world. Agree the price first (typically $10–15/hour).",
        "q": "Tosor, Kyrgyzstan",
        "slot": "activity",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/%D0%9A%D1%8B%D1%80%D0%B3%D1%8B%D0%B7%D1%81%D0%BA%D0%B0%D1%8F_%D1%8E%D1%80%D1%82%D0%B0%2C_%D0%B4%D0%BE%D0%BC_%D1%81%D1%80%D0%B5%D0%B4%D0%B8_%D0%BD%D0%B5%D0%B1%D0%B5%D1%81%D0%BD%D1%8B%D1%85_%D0%B3%D0%BE%D1%80.jpg/960px-%D0%9A%D1%8B%D1%80%D0%B3%D1%8B%D0%B7%D1%81%D0%BA%D0%B0%D1%8F_%D1%8E%D1%80%D1%82%D0%B0%2C_%D0%B4%D0%BE%D0%BC_%D1%81%D1%80%D0%B5%D0%B4%D0%B8_%D0%BD%D0%B5%D0%B1%D0%B5%D1%81%D0%BD%D1%8B%D1%85_%D0%B3%D0%BE%D1%80.jpg",
        "it": ["nomad", "yurt", "lake"]
      }
    ],
    "road": {
      "surface": "none — no riding",
      "character": "recovery by design after the 4,021 m opener",
      "rating": { "raw": "No riding", "cls": 0, "peak": null },
      "paras": [
        "No riding today: swim, Skazka canyon walk, banya, laundry, chain-and-spokes check after the gravel — at most an optional low-speed shoreline spin to keep the bike's fluids and your habits warm."
      ],
      "photos": []
    }
  },
{
    "d": 9,
    "date": "Sun Sep 13",
    "id": "kochkor",
    "km": 200,
    "dmin": 215,
    "rest": false,
    "region": "Kyrgyzstan — Naryn",
    "opt": "S4a",
    "title": "South Shore & the Eagle Hunters",
    "route": "Issyk-Kul south shore → Terskey Alatau roads → farmhouse lunch with an eagle-hunting family → Kochkor",
    "desc": "A lakeshore-and-farmland day along the Terskey Alatau front range, hugging Issyk-Kul's quiet coast before bending southwest into the Kochkor valley. The set-piece comes en route: lunch at the farmhouse of a family of hereditary berkutchi — eagle hunters — who fly and live with golden eagles as their fathers and grandfathers did, and will show you how a five-kilo bird is trained, hooded and carried on horseback. Kochkor itself is an unpolished, thoroughly real herders' market town at ~1,800 m: shyrdak felt-carpet cooperatives, a working bazaar, and the last hot shower, phone signal and reliable ATMs before the yurts of Song-Kol.",
    "tags": ["ride", "nomad", "food"],
    "gfrom": "Tosor, Kyrgyzstan",
    "gto": "Kochkor, Kyrgyzstan",
    "gvia": "Bokonbayevo, Kyrgyzstan|Balykchy, Kyrgyzstan",
    "poi": [
      {
        "name": "Terskey Alatau coast roads",
        "what": "Tarmac and good gravel under the front range, with the lake on the right and 4,000-metre snow on the left — easy, flowing riding after the rest day.",
        "q": "Bokonbayevo, Kyrgyzstan",
        "slot": "scenic",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Road_to_Issyk-Kul_%28south_shore%29_%2814939479807%29.jpg/960px-Road_to_Issyk-Kul_%28south_shore%29_%2814939479807%29.jpg",
        "wiki": "https://en.wikipedia.org/wiki/Terskey_Alatoo",
        "it": ["scenic", "lake", "offroad"]
      },
      {
        "name": "Eagle-hunter farmhouse lunch",
        "what": "The Day-9 highlight: a country spread at a berkutchi dynasty's home near the south shore, with the golden eagles brought out after lunch. Hunting with eagles here is a living tradition, not a show — bring small som notes if you'd like to tip.",
        "q": "Bokonbayevo, Kyrgyzstan",
        "slot": "lunch",
        "img": "https://upload.wikimedia.org/wikipedia/commons/9/95/KyrgyzEagleHuntsman.jpg",
        "wiki": "https://en.wikipedia.org/wiki/Hunting_with_eagles",
        "it": ["nomad", "wildlife", "food"]
      },
      {
        "name": "Shyrdak felt workshops",
        "what": "Kochkor's women's cooperatives demonstrate how shyrdak — the brilliantly coloured, mosaic-stitched felt carpets on UNESCO's Intangible Heritage list — are cut, layered and sewn; small pieces pack fine on a bike.",
        "q": "Kochkor, Kyrgyzstan",
        "slot": "activity",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Kyrgyz_shyrdak.jpg/960px-Kyrgyz_shyrdak.jpg",
        "wiki": "https://en.wikipedia.org/wiki/Shyrdak",
        "it": ["nomad", "history"]
      },
      {
        "name": "Kochkor bazaar — last fuel & ATMs",
        "what": "Stock up on water, snacks, som and fuel: these are the last reliable ATMs and pumps before Song-Kol, and there is nothing to buy at the lake. The animal-and-produce bazaar is liveliest in the morning.",
        "q": "Kochkor, Kyrgyzstan",
        "slot": "stop",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Kochkor%2C_Kyrgyzstan.jpg/960px-Kochkor%2C_Kyrgyzstan.jpg",
        "wiki": "https://en.wikipedia.org/wiki/Kochkor",
        "it": ["food", "moto", "lake"]
      }
    ],
    "road": {
      "surface": "165 km tarmac · 35 km gravel spurs & farm backroads",
      "character": "rolling lakeshore flow with red-badlands scenery and a cultural long lunch — the recovery ride that doesn't feel like one",
      "rating": {
        "raw": "Class 1 (Novice/Green) — mostly paved; brief Class 2 (Basic/Yellow) on the gravel spurs and farm backroads to the eagle-hunter farmhouse",
        "cls": 1,
        "peak": 2
      },
      "paras": [
        "The south shore road is the quiet side of Issyk-Kul: smooth-enough tarmac rising and falling between the water and the Terskey Alatau wall, red conglomerate badlands (Skazka country) on the left, snow summits on the right, and almost no traffic besides melon trucks and the occasional donkey cart. Gravel shows up as spurs and farm lanes — down to beaches, up side valleys, and the backroads to the eagle-hunting family's farmhouse near Bokonbaevo, where the day parks for a long Kyrgyz lunch and a golden eagle on a glove.",
        "After Balykchy's western corner the road bends south up the Chu valley to Kochkor on good tarmac with a steady tail of long sweepers. It's a day for economy of effort: 200 km that ask nothing technical, positioned deliberately between the Suek crossing and tomorrow's climb to Song-Kol. Watch the roadside stands — smoked fish and apricots — and fuel in Balykchy or Kochkor; tomorrow's mountain has no pumps."
      ],
      "photos": [
        {
          "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Road_to_Issyk-Kul_%28south_shore%29_%2815103054786%29.jpg/960px-Road_to_Issyk-Kul_%28south_shore%29_%2815103054786%29.jpg",
          "alt": "The south shore road running along Issyk-Kul",
          "cap": "The south-shore road: empty tarmac between the lake and the Terskey wall — the trip's designated flow day."
        },
        {
          "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Road_to_Issyk-Kul_%28south_shore%29_%2814939486107%29.jpg/960px-Road_to_Issyk-Kul_%28south_shore%29_%2814939486107%29.jpg",
          "alt": "Roadside yurts selling fresh trout on the road to Issyk-Kul",
          "cap": "Roadside yurt stalls under the badlands — \"fresh trout\" in Cyrillic is the south shore's version of a fuel stop."
        }
      ]
    }
  },
{
    "d": 10,
    "date": "Mon Sep 14",
    "id": "song-kol",
    "km": 130,
    "dmin": 175,
    "rest": false,
    "region": "Kyrgyzstan — Naryn",
    "opt": "S4a",
    "title": "Switchbacks to Song-Kol",
    "route": "Kochkor → 33 Parrots Pass 3,133 m switchbacks → Song-Kol Lake (3,016 m) among the nomad herders",
    "desc": "A short day with a big centrepiece: the '33 Parrots' pass — a stack of tight hairpin switchbacks winding up the mountain wall out of the Kochkor valley, gravel in the upper reaches, with the whole valley unrolling behind (the nickname comes from a beloved Soviet cartoon — count the bends). Over the top the road turns to dirt across open pasture and Song-Kol appears, impossibly blue against the yellow-green grass: Kyrgyzstan's highest large lake at 3,016 m, ringed by jailoo summer pastures where nomad families graze thousands of horses exactly as their great-grandparents did. The night is a herders' yurt camp — kumis, boorsok, and a Milky Way bright enough to cast shadows. It is cold here even in summer; if weather closes the pass, the group falls back to the Kyzart village eco-hotel.",
    "tags": ["ride", "offroad", "pass", "yurt", "nomad"],
    "gfrom": "Kochkor, Kyrgyzstan",
    "gto": "Song-Kul Lake, Kyrgyzstan",
    "gvia": "Kalmak-Ashuu (33 Parrots) Pass",
    "poi": [
      {
        "name": "33 Parrots Pass switchbacks",
        "what": "A wall of numbered hairpins climbing out of the Kochkor valley to 3,133 m, gravel in the upper reaches — take it at your own pace behind the leader, and stop at the top for the valley shot.",
        "q": "Kalmak-Ashuu (33 Parrots) Pass",
        "slot": "scenic",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Song-Kul%2C_Kyrgyzstan_%2843669860135%29.jpg/960px-Song-Kul%2C_Kyrgyzstan_%2843669860135%29.jpg",
        "wiki": "https://en.wikipedia.org/wiki/Kalmak-Ashuu",
        "it": ["pass", "offroad"]
      },
      {
        "name": "First sight of Song-Kol",
        "what": "Over the top the road turns to dirt across open pasture and the lake appears — 29 km by 18 km of glass-clear water in a treeless bowl of grass so wide the horizon curves.",
        "q": "Song-Kul Lake, Kyrgyzstan",
        "slot": "scenic",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Song-Kul%2C_Kyrgyzstan_%2830709310728%29.jpg/960px-Song-Kul%2C_Kyrgyzstan_%2830709310728%29.jpg",
        "wiki": "https://en.wikipedia.org/wiki/Song-K%C3%B6l",
        "it": ["lake", "scenic", "offroad"]
      },
      {
        "name": "Life on the jailoo",
        "what": "Walk between the yurts: mares milked at dusk, foals tethered in lines, kids herding sheep on horseback. Guests are welcome to help with the animals — just ask your hosts. Most camps will saddle a horse for a shore ride ($10–15/hour, agree first).",
        "q": "Song-Kul Lake, Kyrgyzstan",
        "slot": "activity",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Song-Kul%2C_Kyrgyzstan_%2830709627198%29.jpg/960px-Song-Kul%2C_Kyrgyzstan_%2830709627198%29.jpg",
        "wiki": "https://en.wikipedia.org/wiki/Song-K%C3%B6l",
        "it": ["nomad", "yurt", "lake"]
      },
      {
        "name": "Kumis & boorsok in the yurts",
        "what": "Fermented mare's milk — mildly fizzy, sour, faintly alcoholic — and fried dough pillows with kaymak and jam, offered to every guest. A small bowl is polite; it's the toll for the view.",
        "q": "Song-Kul Lake, Kyrgyzstan",
        "slot": "dinner",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Horse_standing_by_Song_Kul_Lake_-_Kyrgyztan.jpg/960px-Horse_standing_by_Song_Kul_Lake_-_Kyrgyztan.jpg",
        "wiki": "https://en.wikipedia.org/wiki/Kumis",
        "it": ["food", "nomad", "yurt"]
      },
      {
        "name": "The night sky at 3,016 m",
        "what": "Zero light pollution: step out of the yurt around midnight and the Milky Way is bright enough to cast shadows. Bring every layer you own — frost is possible in any month.",
        "q": "Song-Kul Lake, Kyrgyzstan",
        "slot": "scenic",
        "it": ["scenic", "yurt"]
      }
    ],
    "foodTrail": [
      {
        "style": "Kumis & boorsok in the yurts",
        "shop": "The herders' yurt camp",
        "shopUrl": "https://www.google.com/maps/search/?api=1&query=Song-Kul%20Lake%20Kyrgyzstan",
        "city": "Song-Kol",
        "slot": "dinner"
      }
    ],
    "road": {
      "surface": "30 km tarmac · 75 km graded gravel switchbacks · 25 km high-plateau two-track",
      "character": "the postcard climb — stacked gravel hairpins to 3,133 m, then open grass to the lake; short day, big altitude",
      "rating": {
        "raw": "Class 2 (Basic/Yellow) on the graded climb, peaks Class 3 (Moderate/Orange) on the loose-marble insides of the hairpins and the boggy meadow two-track near camp",
        "cls": 2,
        "peak": 3
      },
      "paras": [
        "Tarmac ends past Sary-Bulak and the mountain starts working. The Kalmak-Ashuu corridor — the serpentine the tour literature nicknames \"33 Parrots\" — is the best-graded of all the Song-Kol accesses: a maintained gravel road, snow-cleared from late May to October, that stacks its hairpins up a grass-and-scree headwall with sightlines all the way down to the valley you just left. The surface is honest gravel — rain turns it greasy and the inside of every hairpin is loose marbles over hardpack — but on a light bike it's pure rhythm: brake, tip in, drive out, repeat for an hour.",
        "Over the crest at ~3,100 m the world flattens into the Song-Kol basin: two-track through pasture, marmots bolting from the wheel, yurt smoke on the horizon and a 29-km-long lake with no buildings on it. The last kilometres to camp are soft meadow track — watch the bog patches near streams. You sleep at 3,016 m among the herders; the kumis is part of the road report. (Bad weather fallback: the Kyzart eco-hotel, decided by the leader before the climb, because this road in fresh snow is no place for a group.)"
      ],
      "photos": [
        {
          "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/On_road_to_pass_Kalmak-Ashuu%2C_Kyrgyzstan_-_panoramio.jpg/960px-On_road_to_pass_Kalmak-Ashuu%2C_Kyrgyzstan_-_panoramio.jpg",
          "alt": "Gravel road winding over green mountains toward Kalmak-Ashuu pass",
          "cap": "On the Kalmak-Ashuu road: the gravel ribbon starting to climb out of the Kochkor-side valley."
        },
        {
          "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Road_to_pass_Kalmak-Ashuu%2C_Kyrgyzstan_-_panoramio.jpg/960px-Road_to_pass_Kalmak-Ashuu%2C_Kyrgyzstan_-_panoramio.jpg",
          "alt": "Serpentine gravel switchbacks on the Kalmak-Ashuu climb",
          "cap": "The \"33 Parrots\" hairpins stacking up the headwall — an hour of brake, tip in, drive out."
        },
        {
          "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Pass_Kalmak-Ashuu%2C_Kyrgyzstan_-_panoramio.jpg/960px-Pass_Kalmak-Ashuu%2C_Kyrgyzstan_-_panoramio.jpg",
          "alt": "The gravel road at Kalmak-Ashuu pass with warning signs",
          "cap": "The pass itself: 3,100-odd metres, a bent warning sign, and the Song-Kol basin opening beyond."
        }
      ]
    }
  },
{
    "d": 11,
    "date": "Tue Sep 15",
    "id": "suusamyr",
    "km": 240,
    "dmin": 360,
    "rest": false,
    "region": "Kyrgyzstan — Naryn / Chüy",
    "opt": "S5a",
    "title": "Passes to Suusamyr",
    "route": "Song-Kol → rocky off-road descent → Moldo-Ashuu 3,546 m → Kara-Keche 3,384 m → Kokomeren gorge → Suusamyr valley",
    "desc": "The most demanding riding day of the tour — 240 km, most of it off the asphalt. From Song-Kol the route drops off the plateau on a rocky off-road descent, climbs the switchbacks of Moldo-Ashuu Pass (3,546 m), then takes the gravel coal road over Kara-Keche Pass (3,384 m) — built to serve the open-cast mine that heats half of Kyrgyzstan — before following the boiling turquoise Kokomeren river gorge out into the open. The reward is the Suusamyr valley: a 150-km grass sea at ~2,200 m, the largest alpine pasture in Central Asia, famous for its white wildflower honey. The night is a cabin camp ringed by panoramic mountains: real beds, hot food, and a well-earned rest. No heroics on the rocky descents — a dropped DR650 is a deposit conversation.",
    "tags": ["ride", "offroad", "pass", "scenic"],
    "gfrom": "Song-Kul Lake, Kyrgyzstan",
    "gto": "Suusamyr, Kyrgyzstan",
    "gvia": "Moldo-Ashuu Pass|Kara-Keche Pass|Kyzyl-Oi, Kyrgyzstan",
    "poi": [
      {
        "name": "Moldo-Ashuu Pass — 3,546 m",
        "what": "A ladder of gravel switchbacks with the whole Song-Kol plateau falling away behind — the classic photo stop of Day 11. Loose surface; ride it patiently.",
        "q": "Moldo-Ashuu Pass",
        "slot": "scenic",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Suusamyr_Valley_%283968059049%29.jpg/960px-Suusamyr_Valley_%283968059049%29.jpg",
        "it": ["pass", "offroad", "lake"]
      },
      {
        "name": "Kara-Keche coal road — 3,384 m",
        "what": "A working mining road past the open-cast coal pits; expect the occasional loaded truck and give it room. The grades are honest and the views enormous.",
        "q": "Kara-Keche Pass",
        "slot": "stop",
        "it": ["pass", "offroad"]
      },
      {
        "name": "Kokomeren gorge",
        "what": "The wild blue-green Kokomeren river crashes through a bare rock canyon alongside the road — one of Kyrgyzstan's most dramatic stretches of gravel riding.",
        "q": "Kyzyl-Oi, Kyrgyzstan",
        "slot": "scenic",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/%D0%9A%D0%B5%D0%BA%D0%B5%D0%BC%D0%B5%D1%80%D0%B5%D0%BD.jpg/960px-%D0%9A%D0%B5%D0%BA%D0%B5%D0%BC%D0%B5%D1%80%D0%B5%D0%BD.jpg",
        "wiki": "https://en.wikipedia.org/wiki/K%C3%B6k%C3%B6meren",
        "it": ["canyon", "offroad"]
      },
      {
        "name": "Suusamyr valley & its honey",
        "what": "Out into the grass sea: herds drifting home, shepherd camps trailing smoke, and roadside apiaries selling the valley's famous white honey by the jar — the best edible souvenir of the whole route.",
        "q": "Suusamyr, Kyrgyzstan",
        "slot": "activity",
        "img": "https://upload.wikimedia.org/wikipedia/commons/a/a4/Suusamyr_Valley.jpg",
        "wiki": "https://en.wikipedia.org/wiki/Suusamyr_Valley",
        "it": ["scenic", "food"]
      },
      {
        "name": "Cabin camp under the ranges",
        "what": "Twin-share cabins with real beds and panoramic mountains on every side — kuurdak, shorpo and bread for dinner (cash; dinners are on the rider).",
        "q": "Suusamyr, Kyrgyzstan",
        "slot": "dinner",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Suusamyr_Valley_%283968831828%29.jpg/960px-Suusamyr_Valley_%283968831828%29.jpg",
        "it": ["food", "scenic"]
      }
    ],
    "road": {
      "surface": "40 km tarmac · 145 km graded gravel · 55 km rocky descent & pass track (Moldo-Ashuu 3,546 m · Kara-Keche 3,384 m)",
      "character": "the biggest off-road day — a rocky serpentine descent, a coal-mine pass, and a river-canyon gravel run; long, remote, magnificent",
      "rating": {
        "raw": "Class 3 (Moderate/Orange), peaks Class 4 (Difficult/Red) on the Moldo-Ashuu serpentine's loose-rock hairpins — the roughest rated riding on the reference line",
        "cls": 3,
        "peak": 4
      },
      "paras": [
        "The hardest and best 240 km of the tour. Leaving Song-Kol's shore two-track, the route crests Moldo-Ashuu and drops off the plateau's southern rim on the famous serpentine — a narrow shelf road of tight, rocky hairpins cut into the Kurtka canyon wall, loose rubble on polished base, real exposure over the edge and juniper forest far below. It's first-and-second-gear, standing, rear-brake work; the view south over the Naryn valley's layered ranges is the one riders will still be describing years later. Then the corridor swings west and climbs again over Kara-Keche, the coal-mine pass — wide black-dusted gravel shared with Soviet-era coal trucks grinding up from the open-cast pits, weirdly beautiful in its bleakness.",
        "The long run-out follows the Kekemeren river — one of Kyrgyzstan's prettiest road corridors — through Kyzyl-Oi's red-walled gorge on river-gravel and dirt that flows like a trail-bike dream when dry and turns slick as soap after rain. Fatigue is the day's real hazard: the technical descent comes first, but the last 100 km still demand attention. The cabin camp in the vast Suusamyr pasture is the finish line, and it feels like one."
      ],
      "photos": [
        {
          "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/The_Pass_%283968861484%29.jpg/960px-The_Pass_%283968861484%29.jpg",
          "alt": "High gravel pass road winding through golden valley with snow peaks near Kara-Keche",
          "cap": "The high road on the Suusamyr–Song-Kol corridor: gravel wandering up a golden valley with the snow line waiting above."
        },
        {
          "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Moldo_ashuu.jpg/960px-Moldo_ashuu.jpg",
          "alt": "View south from Moldo-Ashuu pass over the layered Naryn ranges",
          "cap": "From Moldo-Ashuu's rim: the serpentine drops into this — layered ranges all the way to the Naryn haze."
        },
        {
          "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Off_the_main_road._%283968083949%29.jpg/960px-Off_the_main_road._%283968083949%29.jpg",
          "alt": "Dirt road through the Jumgal valley with village in the distance",
          "cap": "The Jumgal-valley dirt on the run-out toward the Kekemeren — flowing, remote, and 100 km from the nearest anything."
        }
      ]
    }
  },
{
    "d": 12,
    "date": "Wed Sep 16",
    "id": "bishkek",
    "km": 153,
    "dmin": 140,
    "rest": false,
    "region": "Kyrgyzstan — Chüy / Bishkek",
    "opt": "S5a",
    "title": "Too-Ashuu & the Capital",
    "route": "Suusamyr → Too-Ashuu Pass 3,200 m (~4 km summit tunnel) → long descent → Bishkek",
    "desc": "Short but memorable. From Suusamyr the road climbs to Too-Ashuu Pass (3,200 m) and punches through the mountain in its famous ~4-km summit tunnel — cold, dark and unforgettable on a motorcycle: visor up, lights on — then hairpins down nearly two and a half vertical kilometres into the Chüy valley, alpine pasture turning to poplar-lined farmland in under an hour. Bishkek is Central Asia's most relaxed capital: leafy Soviet-boned blocks, Ala-Too Square, the working Osh Bazaar, and — after nearly two weeks of steppe and passes — hot water, espresso and the tour's big-city dinner night. Plov at Navat, the famous laghman at Cafe Faiza, or the Supara yurt-village splurge; toast the first 2,000 km.",
    "tags": ["ride", "pass", "food", "history"],
    "gfrom": "Suusamyr, Kyrgyzstan",
    "gto": "Bishkek, Kyrgyzstan",
    "gvia": "Too-Ashuu Pass",
    "poi": [
      {
        "name": "Too-Ashuu Pass & the summit tunnel",
        "what": "The last of the big western passes at 3,200 m; the ~4 km tunnel is narrow, dim and fume-y — visor up, lights on — and the burst of light on the Chüy side opens onto a 2,500 m descent of hairpins that deserves fresh attention, not end-of-block autopilot.",
        "q": "Too-Ashuu Pass",
        "slot": "scenic",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Panorama_of_the_Too_Ashuu_Pass%2C_Kyrgyz_Alatau%2C_Kyrgyzstan_01.jpg/960px-Panorama_of_the_Too_Ashuu_Pass%2C_Kyrgyz_Alatau%2C_Kyrgyzstan_01.jpg",
        "wiki": "https://en.wikipedia.org/wiki/T%C3%B6%C3%B6_Ashuu",
        "it": ["pass", "moto"]
      },
      {
        "name": "Ala-Too Square",
        "what": "The ceremonial heart of the capital: the national flag on its giant mast, the equestrian Manas monument, fountains, and the hourly changing of the guard — with the State History Museum's white monolith behind.",
        "q": "Ala-Too Square, Bishkek",
        "slot": "activity",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Ala_Too_Square_Bishkek_2021.jpg/960px-Ala_Too_Square_Bishkek_2021.jpg",
        "wiki": "https://en.wikipedia.org/wiki/Ala-Too_Square",
        "it": ["history"]
      },
      {
        "name": "Osh Bazaar",
        "what": "Bishkek's big working bazaar: pyramids of spices, dried fruit, kurut, horse-meat sausage and cheap kalpak hats — the best souvenir sweep of the tour. Watch pockets in the crowds.",
        "q": "Osh Bazaar, Bishkek",
        "slot": "stop",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Osh_Bazaar_in_Bishkek%2C_Kyrgyzstan.jpg/960px-Osh_Bazaar_in_Bishkek%2C_Kyrgyzstan.jpg",
        "wiki": "https://en.wikipedia.org/wiki/Osh_Bazaar",
        "it": ["food", "history"]
      },
      {
        "name": "Big-city dinner — plov & the classics",
        "what": "The one mid-tour city night: proper plov and beshbarmak at Navat's carved-wood teahouse, the legendary hand-pulled laghman at Cafe Faiza, or refined Kyrgyz cooking at the Supara Ethno-Complex — and Kyrgyzstan's pioneering craft brewery, Save the Ales, for the toast.",
        "q": "Bishkek, Kyrgyzstan",
        "slot": "dinner",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Kyrgyz_State_Historical_Museum%2C_Ala_Too_Square%2C_Bishkek%2C_Kyrgyzstan.jpg/960px-Kyrgyz_State_Historical_Museum%2C_Ala_Too_Square%2C_Bishkek%2C_Kyrgyzstan.jpg",
        "wiki": "https://en.wikipedia.org/wiki/Pilaf",
        "it": ["food"]
      }
    ],
    "foodTrail": [
      {
        "style": "Plov & the big-city classics",
        "shop": "Navat",
        "shopUrl": "https://www.google.com/maps/search/?api=1&query=Navat%20Bishkek",
        "city": "Bishkek",
        "slot": "dinner"
      }
    ],
    "road": {
      "surface": "153 km tarmac",
      "character": "a full-tarmac mountain-highway day — sweepers across the plateau, a dark summit tunnel, then a 2,000 m serpentine descent with trucks",
      "rating": { "raw": "Paved — no ADV rating", "cls": 0, "peak": null },
      "paras": [
        "An all-asphalt day, and still not a boring one. The M41 crosses the Suusamyr plateau in huge open sweepers past herder camps and roadside kumis stands, then climbs to Too-Ashuu at ~3,200 m, where the road doesn't crest the ridge — it bores through it. The summit tunnel is the day's event: a couple of kilometres of dim, fume-heavy, dripping two-lane shared with trucks; visor up, lights on, commit, and don't stop.",
        "The northern side is the payoff and the hazard in one: a magnificent serpentine falling over 2,000 vertical metres toward the Kara-Balta gorge in stacked hairpins and avalanche galleries, with overloaded Kamaz trucks cooking their brakes down the same grades. Ride it like a racetrack with traffic — wide vision, no ambition into blind corners, engine braking doing the work. Then the mountains simply end and Bishkek's poplar-lined plain takes over: city traffic, the first real since Almaty, is its own final exercise."
      ],
      "photos": [
        {
          "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Too-Ashuu.jpg/960px-Too-Ashuu.jpg",
          "alt": "Switchbacks below Too-Ashuu pass disappearing into cloud",
          "cap": "The north-side serpentine below Too-Ashuu, hairpins threading down into the cloud sea over the Kara-Balta gorge."
        },
        {
          "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Suusamyr_Valley_%283968060227%29.jpg/960px-Suusamyr_Valley_%283968060227%29.jpg",
          "alt": "Yurt beside the gravel roadside on the Suusamyr plateau",
          "cap": "Suusamyr plateau roadside: a herder's yurt a wheel's-width off the M41 — the kumis stop before the tunnel."
        }
      ]
    }
  },
{
    "d": 13,
    "date": "Thu Sep 17",
    "id": "cholpon-ata",
    "km": 261,
    "dmin": 240,
    "rest": false,
    "region": "Kyrgyzstan — Chüy / Issyk-Kul",
    "opt": "S5a",
    "title": "Boom Gorge to the North Shore",
    "route": "Bishkek → Boom (Boam) gorge → Issyk-Kul north shore → Cholpon-Ata; afternoon at the petroglyph field",
    "desc": "The loop's recovery day: 261 km of honest asphalt east from Bishkek, funnelling through the Boom gorge — the red-rock canyon of the Chüy river that is the only natural gate between the capital's valley and the Issyk-Kul basin (watch the gusty wind where it opens toward Balykchy) — before the lake spreads blue on the right for the last 100 km. Cholpon-Ata is the sunny, sandy resort side of Issyk-Kul, and its cultural showpiece sits just uphill: a 'stone garden' of some 5,000 glacial boulders over 42 hectares, carved with ibex, deer and horsemen — Bronze Age to Saka to Turkic. Go in the late-afternoon side light, then swim off the town beach and eat smoked lake fish on the promenade while the sun drops behind the mountains across the water.",
    "tags": ["ride", "scenic", "history", "lake"],
    "gfrom": "Bishkek, Kyrgyzstan",
    "gto": "Cholpon-Ata, Kyrgyzstan",
    "gvia": "Boom Gorge|Balykchy, Kyrgyzstan",
    "poi": [
      {
        "name": "The Boom gorge",
        "what": "The Chüy river's red-walled canyon carries the road and railway side by side out of the capital's valley — after days of gravel passes, flowing tarmac feels like a gift.",
        "q": "Boom Gorge",
        "slot": "scenic",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Boom_Gorge%2C_Kyrgyzstan_%281%29.jpg/960px-Boom_Gorge%2C_Kyrgyzstan_%281%29.jpg",
        "wiki": "https://en.wikipedia.org/wiki/Boom_Gorge",
        "it": ["canyon", "scenic", "offroad"]
      },
      {
        "name": "North-shore lake road",
        "what": "Balykchy, then 100 km of shoreline riding with the Kungey Alatau behind and — across the water — the Terskey Alatau the tour crossed at 4,021 m on Day 7.",
        "q": "Balykchy, Kyrgyzstan",
        "slot": "stop",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Lake_Issyk-Kul%2C_Cholpon-Ata%2C_Kyrgyzstan_%286170033784%29.jpg/960px-Lake_Issyk-Kul%2C_Cholpon-Ata%2C_Kyrgyzstan_%286170033784%29.jpg",
        "it": ["lake", "scenic", "pass"]
      },
      {
        "name": "Cholpon-Ata petroglyphs",
        "what": "Marked paths through 42 hectares of carved boulders with the lake below: ibex, deer, hunting scenes and balbal stone figures, from the end of the Bronze Age (~1500 BC) through the Saka-Usun tribes to the Turkic era. Small cash entry fee.",
        "q": "Cholpon-Ata Petroglyphs",
        "slot": "activity",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Petroglyph_Museum_of_Cholpon-Ata_12.jpg/960px-Petroglyph_Museum_of_Cholpon-Ata_12.jpg",
        "wiki": "https://en.wikipedia.org/wiki/Cholpon-Ata",
        "it": ["history", "lake", "wildlife"]
      },
      {
        "name": "North-shore beach evening",
        "what": "The classic Cholpon-Ata program: a swim off the sandy town beach, the white chapels of Ruh Ordo along the shore, and shashlik smoke drifting down the promenade.",
        "q": "Ruh Ordo, Cholpon-Ata",
        "slot": "activity",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Rux_Ordo_from_the_SE.jpg/960px-Rux_Ordo_from_the_SE.jpg",
        "wiki": "https://en.wikipedia.org/wiki/Issyk-Kul",
        "it": ["lake", "food"]
      },
      {
        "name": "Smoked lake fish on the promenade",
        "what": "The north-shore staple: whole fried or hot-smoked Issyk-Kul fish with bread, herbs and a squeeze of lemon — the best simple dinner on the lake. Cards work in the bigger places; still carry som.",
        "q": "Cholpon-Ata, Kyrgyzstan",
        "slot": "dinner",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/2015-09-07-082719_-_Cholpon-Ata%2C_Anlegesteg_und_Blick_zum_S%C3%BCdufer_des_Yssykk%C3%B6l.jpg/960px-2015-09-07-082719_-_Cholpon-Ata%2C_Anlegesteg_und_Blick_zum_S%C3%BCdufer_des_Yssykk%C3%B6l.jpg",
        "wiki": "https://en.wikipedia.org/wiki/Issyk-Kul",
        "it": ["food", "lake"]
      }
    ],
    "foodTrail": [
      {
        "style": "Smoked lake fish on the promenade",
        "shop": "North-shore fish stands",
        "shopUrl": "https://www.google.com/maps/search/?api=1&query=smoked%20fish%20Cholpon-Ata",
        "city": "Cholpon-Ata",
        "slot": "dinner"
      }
    ],
    "road": {
      "surface": "261 km tarmac",
      "character": "transit with one great canyon — busy highway riding through Boom gorge, then relaxed lakeshore to the petroglyphs",
      "rating": { "raw": "Paved — no ADV rating", "cls": 0, "peak": null },
      "paras": [
        "The day's centerpiece is Boom (Boom/Boam) gorge, where the whole country funnels: the highway, the railway and the Chu river braid through a dry, red-walled canyon for 30-odd kilometres under avalanche galleries and past rockfall fencing. It's the most trafficked riding of the trip — Bishkek–Issyk-Kul traffic, buses, fuel tankers — so the discipline is spacing and patience, not lines. The wind is the sleeper hazard: the gorge accelerates it into hard lateral gusts where the walls narrow, strong enough to move a light bike half a lane.",
        "Out of the canyon at Balykchy the lake reappears and everything relaxes: the north-shore road runs wide and smooth through resort villages and apricot stalls to Cholpon-Ata, with the Kungey Alatau ridge for a backdrop. Afternoon at the open-air petroglyph field — Bronze-Age riders scratched onto glacial boulders, which is about the oldest road report this route has."
      ],
      "photos": [
        {
          "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/%D0%9A%D0%B5%D0%BC%D0%B8%D0%BD%D1%81%D0%BA%D0%B8%D0%B9_%D1%80%D0%B0%D0%B9%D0%BE%D0%BD%2C_%D1%81%D0%BD%D0%B5%D0%B3%D0%BE%D0%B7%D0%B0%D1%89%D0%B8%D1%82%D0%BD%D0%B0%D1%8F_%D0%B3%D0%B0%D0%BB%D0%B5%D1%80%D0%B5%D1%8F.jpg/960px-%D0%9A%D0%B5%D0%BC%D0%B8%D0%BD%D1%81%D0%BA%D0%B8%D0%B9_%D1%80%D0%B0%D0%B9%D0%BE%D0%BD%2C_%D1%81%D0%BD%D0%B5%D0%B3%D0%BE%D0%B7%D0%B0%D1%89%D0%B8%D1%82%D0%BD%D0%B0%D1%8F_%D0%B3%D0%B0%D0%BB%D0%B5%D1%80%D0%B5%D1%8F.jpg",
          "alt": "The Boom gorge road with snow galleries above the roadway",
          "cap": "Boom gorge: the highway sliding beneath the old avalanche galleries — the pinch-point where wind, trucks and rock share one canyon."
        },
        {
          "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Boom_Gorge_03.jpg/960px-Boom_Gorge_03.jpg",
          "alt": "The highway winding through Boom gorge toward Issyk-Kul",
          "cap": "The road threading the dry hills of the gorge, rail line below — 30 km of canyon between the capital and the lake."
        },
        {
          "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/E8145-Chu-River.jpg/960px-E8145-Chu-River.jpg",
          "alt": "The Chu river beside the Boom gorge road",
          "cap": "The Chu running green under the road's shoulder — the river that cut the only easy way through."
        }
      ]
    }
  },
{
    "d": 14,
    "date": "Fri Sep 18",
    "id": "saty",
    "km": 325,
    "dmin": 340,
    "rest": false,
    "region": "KG → Kazakhstan — Almaty Region",
    "opt": "S5a",
    "title": "Karkara & Back into Kazakhstan",
    "route": "Cholpon-Ata → Tüp → Karkara valley → Karkara/Kegen border (KG → KZ, clocks −1 h) → Saty; evening Lake Kaindy if light allows",
    "desc": "The longest day of the tour closes the international chapter. From Cholpon-Ata the route runs east along the north shore, rounds Issyk-Kul's eastern tip at Tüp, and climbs back into the high Karkara valley — the same green border pastures crossed nine days earlier, now in the opposite direction. Stamped back into Kazakhstan (clocks go back an hour — a free hour of daylight), the road drops through Kegen and turns up a mountain valley to Saty, the one-street village of log houses and haystacks that is base camp for Kolsai Lakes National Park. Fill the tanks around Kegen: Saty has no reliable station. If the light holds, the evening ride is the strangest sight of the trip — Lake Kaindy's drowned spruce forest, up a ~12 km rough track. Otherwise it opens Day 15.",
    "tags": ["ride", "border", "lake"],
    "gfrom": "Cholpon-Ata, Kyrgyzstan",
    "gto": "Saty, Kazakhstan",
    "gvia": "Tüp, Kyrgyzstan|Karkara border crossing|Kegen, Kazakhstan",
    "poi": [
      {
        "name": "Around the lake's eastern tip",
        "what": "North-shore tarmac through Tüp and up into the Karkara valley's open pastures — yurts, herds and snow peaks all still exactly where you left them on Day 5.",
        "q": "Tüp, Kyrgyzstan",
        "slot": "scenic",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/2015-09-07-082719_-_Cholpon-Ata%2C_Anlegesteg_und_Blick_zum_S%C3%BCdufer_des_Yssykk%C3%B6l.jpg/960px-2015-09-07-082719_-_Cholpon-Ata%2C_Anlegesteg_und_Blick_zum_S%C3%BCdufer_des_Yssykk%C3%B6l.jpg",
        "wiki": "https://en.wikipedia.org/wiki/T%C3%BCp",
        "it": ["lake", "scenic", "yurt"]
      },
      {
        "name": "Karkara border, reversed (KG → KZ, clocks −1 h)",
        "what": "The same quiet post, run the other way: the operator handles the bikes, you queue with your passport, and Kazakhstan hands back an hour of daylight for the Saty leg. Cash only in the border area.",
        "q": "Karkara border crossing",
        "slot": "stop",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Karkara_River_valley%2C_Khan_Tengri_Nature_Park.jpg/960px-Karkara_River_valley%2C_Khan_Tengri_Nature_Park.jpg",
        "it": ["border", "pass"]
      },
      {
        "name": "Fuel at Kegen",
        "what": "Brim the DR650 here — Saty has no reliable station, and with the Kaindy and Kolsai detours the next sure fuel is on the Shelek road tomorrow, right at the tank's range.",
        "q": "Kegen, Kazakhstan",
        "slot": "coffee",
        "it": ["moto", "lake", "border"]
      },
      {
        "name": "Saty village evening",
        "what": "Cows coming home at dusk, kids on horseback, hay wagons on the one street. Walk it end to end; it takes fifteen minutes and it's the last quiet of the trip.",
        "q": "Saty, Kazakhstan",
        "slot": "activity",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Saty_KAZ_01.jpg/960px-Saty_KAZ_01.jpg",
        "it": ["scenic", "nomad"]
      },
      {
        "name": "Lake Kaindy (if light allows)",
        "what": "A ~12 km rough, rocky piste — fords, ruts, proper DR650 terrain — climbs to the lake where bleached spruce trunks stand dead-straight out of turquoise water, preserved since the 1911 earthquake dammed the valley.",
        "q": "Lake Kaindy",
        "slot": "scenic",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Kaindy_lake_south-east_Kazakhstan.jpg/960px-Kaindy_lake_south-east_Kazakhstan.jpg",
        "wiki": "https://en.wikipedia.org/wiki/Lake_Kaindy",
        "it": ["offroad", "lake", "moto"]
      }
    ],
    "road": {
      "surface": "270 km tarmac · 55 km valley gravel & border track",
      "character": "the longest day — lakeshore tarmac, then the wide-open Karkara valley gravel to a one-hut border, and mountain tarmac to Saty",
      "rating": {
        "raw": "Class 2 (Basic/Yellow) on the Karkara valley washboard and river gravel; peaks Class 3 (Moderate/Orange) only if the evening-bonus Kaindy jeep track is ridden",
        "cls": 2,
        "peak": 3
      },
      "paras": [
        "Longest day of the trip, saved by its variety. The morning is easy: north-shore tarmac east through Tüp, fuel and snacks, then the turn into the Karkara valley — and the trip's last great gravel. The Kyrgyz-side road to the border is old asphalt dissolving into 35–40 km of washboard and river gravel across an enormous green trough between the Kungey and Terskey ranges, herds everywhere, Khan Tengri's white pyramid occasionally showing far to the east. The Karkara post is the same quiet crossing as Day 5 in reverse: papers via the operator, clocks back an hour, rough-but-improving asphalt on the Kazakh side to Kegen.",
        "From Kegen the road swings west through Zhalanash's high pastureland — big-sky tarmac with mountain walls on both sides — before dropping into the Chilik valley and climbing again to Saty village. If light allows, the evening bonus is the Kaindy access track: a short, rough jeep road (rocks, ruts, one or two splashy fords) to the sunken forest. Budget the energy for it in the morning fuel-stop maths; 325 km with a border in the middle eats more day than the map suggests."
      ],
      "photos": [
        {
          "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/%D0%A8%D0%B8%D1%80%D0%BE%D0%BA%D0%B8%D0%B9_%D0%B0%D0%BB%D1%8C%D0%BF%D0%B8%D0%B9%D1%81%D0%BA%D0%B8%D0%B9_%D0%BB%D1%83%D0%B3.jpg/960px-%D0%A8%D0%B8%D1%80%D0%BE%D0%BA%D0%B8%D0%B9_%D0%B0%D0%BB%D1%8C%D0%BF%D0%B8%D0%B9%D1%81%D0%BA%D0%B8%D0%B9_%D0%BB%D1%83%D0%B3.jpg",
          "alt": "Two-track dirt road across a wide alpine meadow in Kegen district",
          "cap": "Kegen district, the Karkara side: two-track across a meadow the size of a small country — the border-day gravel at its best."
        },
        {
          "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Zhalanash_entry.jpg/960px-Zhalanash_entry.jpg",
          "alt": "The tarmac road at the entry to Zhalanash village with mountains behind",
          "cap": "Back in Kazakhstan: the Kegen–Saty road at Zhalanash — big-sky tarmac between two mountain walls, yurts by the verge."
        }
      ]
    }
  },
{
    "d": 15,
    "date": "Sat Sep 19",
    "id": "almaty",
    "km": 300,
    "dmin": 280,
    "rest": false,
    "region": "Kazakhstan — Almaty Region / Almaty",
    "opt": "S6a",
    "title": "Kolsai Lakes & the Run Home",
    "route": "Morning walk to Kolsai Lake-1 (and Kaindy if missed) → Saty → Shelek → Almaty; celebration dinner",
    "desc": "The finale earns its early alarm. Fifteen minutes up the valley from Saty lies Kolsai Lake 1 (~1,800 m): a kilometre-long ribbon of blue-green water pinned between steep spruce slopes — the 'pearls of the Tian Shan', with boardwalk paths and rowboats by the hour. If Kaindy was missed on arrival, its sunken forest comes first, before the day-trip crowds. Then the bikes point home: down the mountain valley, out through Shelek and across the steppe to Almaty — ~300 km, closing the loop exactly where it opened sixteen days ago. The evening is the celebration dinner: bikes and deposits handed back at the guarded lot, one final long table, beshbarmak, toasts, and 2,800 km worth of stories.",
    "tags": ["ride", "scenic", "lake", "food"],
    "gfrom": "Saty, Kazakhstan",
    "gto": "Almaty, Kazakhstan",
    "gvia": "Kolsai Lake 1|Shelek, Kazakhstan",
    "poi": [
      {
        "name": "Kolsai Lake 1 morning walk",
        "what": "The first of the three Kolsai lakes: a kilometre of blue-green water up to ~80 m deep between forested ridges, with boardwalk paths, rowboats for rent and trout in the water. The higher lakes are hiking and horse territory beyond the road.",
        "q": "Kolsai Lake 1",
        "slot": "activity",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/First_Kolsay_lake_2023.jpg/960px-First_Kolsay_lake_2023.jpg",
        "wiki": "https://en.wikipedia.org/wiki/Kolsay_Lakes_National_Park",
        "it": ["lake", "scenic"]
      },
      {
        "name": "Lake Kaindy & the sunken forest",
        "what": "If missed on Day 14: dozens of Schrenk's spruce trunks standing dead-straight out of turquoise water at ~2,000 m — a lake created overnight when the 1911 Kebin earthquake dammed the gorge. Walk the rim trail down to the shore, then point the bikes at Almaty.",
        "q": "Lake Kaindy",
        "slot": "scenic",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Lake_Kaindy%2C_Kazakhstan.jpg/960px-Lake_Kaindy%2C_Kazakhstan.jpg",
        "wiki": "https://en.wikipedia.org/wiki/Lake_Kaindy",
        "it": ["lake", "offroad", "canyon"]
      },
      {
        "name": "The Shelek road run",
        "what": "Down the valley and out across the steppe: Saty → Shelek → Almaty on flowing tarmac, the Tian Shan wall now on the left mirror — the loop closing itself.",
        "q": "Shelek, Kazakhstan",
        "slot": "stop",
        "it": ["scenic", "moto", "desert"]
      },
      {
        "name": "Celebration dinner in Almaty",
        "what": "The loop's last evening: dusty DR650s and deposits handed back at the hotel's guarded lot, then one final long table — beshbarmak, toasts, and 2,800 km worth of stories.",
        "q": "Almaty, Kazakhstan",
        "slot": "dinner",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Beshbarmak1.jpg/960px-Beshbarmak1.jpg",
        "wiki": "https://en.wikipedia.org/wiki/Beshbarmak",
        "it": ["food", "moto"]
      }
    ],
    "road": {
      "surface": "270 km tarmac · 30 km gravel incl. the Kaindy jeep track",
      "character": "an alpine morning and a fast, scenic run home — one last rough track, one last canyon road, then the steppe highway to the finish",
      "rating": {
        "raw": "Class 1 (Novice/Green) — mostly paved; the exception is the Kaindy jeep track at Class 3 (Moderate/Orange) (rocks, ruts, a ford or two)",
        "cls": 1,
        "peak": 3
      },
      "paras": [
        "The morning belongs to the lakes: the paved dead-end road up to Kolsai Lake-1 for the walk, and — if it wasn't ridden last night — the Kaindy jeep track, the trip's final off-road: a few kilometres of rocky, rutted climbing with a ford or two, ending at the drowned spruce forest. Then the DR650 points home. The road out of Saty runs down the Chilik valley with the Kungey Alatau filling the mirrors, rejoins the Kegen–Almaty road, and drops through the Kokpek gorge — a tight, winding tarmac canyon that is the last properly fun riding of the tour.",
        "From Shelek it's steppe highway: fast, straight, increasingly busy tarmac across the Ili plain with Almaty's smog line growing on the horizon. It's the classic last-day trap — 2,800 km of skills intact, one moment of highway autopilot to lose the deposit — so the leader will keep the group tight and the pace boring. Then the city, the bike wash, the odometer photo, and the celebration dinner where every day in this file gets retold at least twice."
      ],
      "photos": [
        {
          "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Saty_04.jpg/960px-Saty_04.jpg",
          "alt": "Dirt village road in Saty with the mountain wall behind",
          "cap": "Saty at ride-out: the village track under the Kungey wall, last unpaved metres before the run home."
        },
        {
          "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Saty_KAZ_03.jpg/960px-Saty_KAZ_03.jpg",
          "alt": "Muddy potholed main street of Saty at sunset",
          "cap": "Saty's main street after rain — the pothole slalom every Kolsai trip starts and ends with."
        }
      ]
    }
  },
{
    "d": 16,
    "date": "Sun Sep 20",
    "id": "almaty",
    "km": 0,
    "rest": false,
    "region": "Kazakhstan — Almaty",
    "title": "Departure",
    "route": "Bike return wrap-up → airport transfer to Almaty (ALA) → fly home",
    "desc": "Airport transfers and goodbyes. The bikes went back last night; today is the included transfer to Almaty International Airport (ALA) and the flight home — with the mountains still hanging over the avenues exactly where they were on Day 1. Sixteen days, two countries, two border crossings, one 4,021-metre pass, three yurt-camp nights and ~2,800 km: from desert up to glaciers, and back to the start.",
    "tags": ["departure"],
    "gfrom": "Almaty, Kazakhstan",
    "gto": "Almaty, Kazakhstan",
    "gvia": "",
    "poi": [
      {
        "name": "Bike return & the deposit",
        "what": "Final paperwork with the crew: the DR650 checked over, the USD 500 damage deposit settled (this is where the Day-1 photos pay off), and the duffel back off the support truck.",
        "q": "Almaty, Kazakhstan",
        "slot": "stop",
        "wiki": "https://en.wikipedia.org/wiki/Suzuki_DR650",
        "it": ["moto"]
      },
      {
        "name": "Last look at the mountains",
        "what": "If the flight is late, one more espresso in the center or a last ride up Kok-Tobe — the Zailiysky Alatau makes a good final frame.",
        "q": "Kok-Tobe, Almaty",
        "slot": "scenic",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Sunset_over_the_Almaty_seen_from_Kok_Tobe_mountain%2C_pic_1.jpg/960px-Sunset_over_the_Almaty_seen_from_Kok_Tobe_mountain%2C_pic_1.jpg",
        "it": ["scenic"]
      },
      {
        "name": "Airport transfer (ALA)",
        "what": "The operator's transfer to Almaty International Airport is included — allow for traffic, and keep the passport handy for the exit stamp collection: two borders and two airports' worth.",
        "q": "Almaty, Kazakhstan",
        "slot": "activity",
        "it": ["border", "pass"]
      }
    ]
  }
];

/* The flexible anchor-point plan: 5 fixed pre-booked anchors (+ the Almaty base)
   and the route options between them (tour/03-anchors-and-options.md).
   Reference options carry reference:true; km flagged est:true are estimates. */
window.ANCHORS = [
  {
    "a": "A1",
    "id": "altyn-emel",
    "name": "Altyn-Emel National Park",
    "nights": "1 night — Basshi guest house",
    "days": "Day 3",
    "why": "The Singing Dune and the white-and-red Aktau mountains: the Kazakh desert-steppe signature of the trip, and the terrain the DR650 was rented for."
  },
  {
    "a": "A2",
    "id": "karakol",
    "name": "Karakol",
    "nights": "2 nights — Jeti-Oguz / Altyn-Arashan day loop on day two",
    "days": "Days 5–6",
    "why": "The Tian Shan trailhead town: Jeti-Oguz red cliffs, the Altyn-Arashan gorge and hot springs, the Holy Trinity Church and Dungan Mosque, ashlan-fuu at the bazaar. A riding day with no packing."
  },
  {
    "a": "A3",
    "id": "issyk-kul",
    "name": "Issyk-Kul south shore yurt camp",
    "nights": "2 nights, mid-trip",
    "days": "Days 7–8",
    "rest": true,
    "why": "The rest-day anchor — the one full no-riding day of the tour: lake swim, Skazka canyon, banya, laundry, bike checks. Placed to recover after the hardest connection and acclimatize between the high passes."
  },
  {
    "a": "A4",
    "id": "song-kol",
    "name": "Song-Kol Lake yurt camp (3,016 m)",
    "nights": "1 night (bad-weather fallback: Kyzart village eco-hotel)",
    "days": "Day 10",
    "why": "The nomad heart of Kyrgyzstan — yurts, herders, kumis and boorsok at 3,000 m. No version of this trip skips Song-Kol."
  },
  {
    "a": "A5",
    "id": "saty",
    "name": "Saty / Kolsai Lakes",
    "nights": "1 night — Saty guest house",
    "days": "Day 14",
    "why": "Lake Kaindy's sunken forest and Kolsai Lake-1 — Kazakhstan's alpine finale before the run home."
  }
];

window.SEGMENTS = [
  {
    "seg": "S1",
    "from": "almaty",
    "to": "altyn-emel",
    "title": "Almaty → Altyn-Emel (A1)",
    "options": [
      {
        "id": "S1a",
        "name": "Steppe Classic",
        "reference": true,
        "refDays": "Day 3",
        "days": 1,
        "km": 250,
        "est": false,
        "difficulty": "easy",
        "diffLabel": "easy–moderate",
        "adv": {
          "cls": 1,
          "peak": 2,
          "raw": "ADV Class 1 (Novice/Green), Class 2 (Basic/Yellow) only on the last graded gravel into Basshi."
        },
        "surface": "Tarmac with a mountain pass — a gentle opener the day after training.",
        "highlights": ["First taste of open steppe", "Mountain-pass warm-up", "Retro-museum tea stop"],
        "via": [],
        "geo": [[43.23798,76.88286], [43.86137,77.06352], [44.35975,77.96399], [44.15957,78.75441]]
      },
      {
        "id": "S1b",
        "name": "Assy Plateau Traverse",
        "reference": false,
        "days": 1,
        "km": 280,
        "est": true,
        "difficulty": "hard",
        "diffLabel": "hard, weather-dependent",
        "adv": {
          "cls": 3,
          "peak": 4,
          "raw": "ADV Class 3 (Moderate/Orange), peaks Class 4 (Difficult/Red) on the Turgen-side track and anywhere after rain."
        },
        "surface": "Up the Turgen gorge on a rough, badly degraded track (4WD-grade), across the high gravel plateau at ~2,500–2,750 m past the observatory, then dirt down past Bartogay. Turns greasy and can close in rain — only for a group that sails through the Day-2 session.",
        "highlights": [
          "High summer-pasture plateau",
          "Assy-Turgen observatory at 2,750 m",
          "Bartogay reservoir",
          "Real off-road on day one of the route proper"
        ],
        "via": [],
        "geo": [[43.23798,76.88286], [43.39837,77.59422], [43.22567,77.87174], [43.34944,78.50361], [43.44821,78.67462], [44.15957,78.75441]]
      }
    ]
  },
  {
    "seg": "S2",
    "from": "altyn-emel",
    "to": "karakol",
    "title": "Altyn-Emel → Karakol (A2)",
    "options": [
      {
        "id": "S2a",
        "name": "Hot Springs & the Canyon",
        "reference": true,
        "refDays": "Days 4–5",
        "days": 2,
        "km": 530,
        "est": false,
        "difficulty": "moderate",
        "diffLabel": "moderate",
        "adv": {
          "cls": 2,
          "peak": 3,
          "raw": "ADV Class 2 (Basic/Yellow) peaking Class 3 (Moderate/Orange) in the sand on the park day; Class 1–2 (Novice–Basic) on the border day."
        },
        "surface": "Desert pistes and sand patches through the park (asphalt alternative inside the park if conditions are bad), then a mostly-tarmac border day.",
        "highlights": [
          "The Singing Dune & Aktau ridden en route",
          "Evening soak at the Chundzha hot springs",
          "Charyn Canyon",
          "The quiet Kegen/Karkara border (+1 h)",
          "Laghman country in the Uyghur District"
        ],
        "via": ["chundzha"],
        "geo": [[44.15957,78.75441], [43.86573,78.56178], [44.0372,79.29509], [43.53651,79.4636], [43.35987,79.05003], [43.01687,79.22483], [42.80154,79.18217], [42.47821,78.3956]]
      },
      {
        "id": "S2b",
        "name": "Canyon Direct",
        "reference": false,
        "days": 1,
        "km": 430,
        "est": true,
        "difficulty": "moderate",
        "diffLabel": "easy–moderate but long",
        "frees": "Frees 1 day → an extra anchor night (A2/A3) or weather buffer",
        "adv": {
          "cls": 1,
          "peak": null,
          "raw": "ADV Class 1 (Novice/Green) — tarmac-forward all day; the challenge is saddle time, not the surface."
        },
        "surface": "Tarmac-forward all day; the challenge is saddle time and the border queue. Honestly trades the full dune/Aktau piste day and the hot springs for a freed day.",
        "highlights": ["Charyn Canyon with more time on-site", "A full extra day banked for the anchors"],
        "via": [],
        "geo": [[44.15957,78.75441], [43.44821,78.67462], [43.35987,79.05003], [43.01687,79.22483], [42.80154,79.18217], [42.47821,78.3956]]
      }
    ]
  },
  {
    "seg": "S3",
    "from": "karakol",
    "to": "issyk-kul",
    "title": "Karakol → Issyk-Kul south shore (A3)",
    "options": [
      {
        "id": "S3a",
        "name": "The Glacier Road",
        "reference": true,
        "refDays": "Day 7",
        "days": 1,
        "km": 190,
        "est": false,
        "difficulty": "hard",
        "diffLabel": "hard — the toughest reference day",
        "adv": {
          "cls": 2,
          "peak": 3,
          "raw": "ADV Class 2 (Basic/Yellow) touching Class 3 (Moderate/Orange) on the upper switchbacks: the \"hard\" is altitude and weather, not terrain, and snow bumps it a full class."
        },
        "surface": "Hard gravel up Barskoon gorge over Sarimonok 3,126 m, Barskoon 3,754 m and Suek 4,021 m, past glaciers, then down to the lake. High-altitude, cold, weather-dependent — the rest day lands immediately after for a reason.",
        "highlights": ["The 4,021 m high point of the tour", "Glaciers at arm's length", "The Barskoon waterfalls"],
        "via": [],
        "geo": [[42.47821,78.3956], [42.15465,77.5956], [42.00999,77.60762], [41.95,77.62], [41.89357,77.69207], [41.78102,77.76056], [41.89357,77.69207], [42.00999,77.60762], [42.15465,77.5956], [42.15,77.54475], [42.16568,77.44438]]
      },
      {
        "id": "S3b",
        "name": "The Coast Road",
        "reference": false,
        "days": 1,
        "km": 130,
        "est": true,
        "difficulty": "easy",
        "diffLabel": "easy",
        "adv": { "cls": 1, "peak": null, "raw": "Paved / ADV Class 1 (Novice/Green) on the spurs — mostly south-shore tarmac." },
        "surface": "South-shore tarmac along the lake with short, optional dirt spurs. The honest trade: no glaciers, no 4,000 m — the named bail-out if the group or the weather says no to Suek.",
        "highlights": [
          "A second look at Jeti-Oguz from the road",
          "Skazka canyon done en route instead of on the rest day",
          "Lakeside villages"
        ],
        "via": [],
        "geo": [[42.47821,78.3956], [42.33778,78.23151], [42.15465,77.5956], [42.15,77.54475], [42.16568,77.44438]]
      }
    ]
  },
  {
    "seg": "S4",
    "from": "issyk-kul",
    "to": "song-kol",
    "title": "Issyk-Kul south shore → Song-Kol (A4)",
    "options": [
      {
        "id": "S4a",
        "name": "Eagle Hunters & 33 Parrots",
        "reference": true,
        "refDays": "Days 9–10",
        "days": 2,
        "km": 330,
        "est": false,
        "difficulty": "moderate",
        "diffLabel": "moderate",
        "adv": {
          "cls": 2,
          "peak": 3,
          "raw": "ADV Class 2 (Basic/Yellow), peaks Class 3 (Moderate/Orange) on the loose hairpin insides and the meadow two-track to camp."
        },
        "surface": "Tarmac and good gravel along the Terskey Alatau, then the 33 Parrots (3,133 m) gravel switchbacks up to the lake. Reference = split with a Kochkor overnight; can also run as 1 long day (~270 km, estimate) to free a day.",
        "highlights": [
          "Farmhouse lunch with an eagle-hunting family",
          "Kochkor's felt workshops",
          "The switchback climb",
          "First sight of Song-Kol"
        ],
        "via": ["kochkor"],
        "geo": [[42.16568,77.44438], [42.15475,77.35194], [42.11718,76.99311], [42.46136,76.18552], [42.2164,75.75754], [41.9143,75.42118], [41.83392,75.13119]]
      },
      {
        "id": "S4b",
        "name": "Tosor Pass Direttissima",
        "reference": false,
        "days": 1,
        "km": 110,
        "est": true,
        "difficulty": "hard",
        "diffLabel": "hard — the hardest riding of the tour",
        "adv": {
          "cls": 4,
          "peak": 5,
          "raw": "ADV Class 4 (Difficult/Red), peaks Class 5 (Severe/Black) if the upper fords run high or snow lies near the top: the terrain ceiling of the entire tour."
        },
        "surface": "Straight up over Tosor Pass (3,893 m) on exceptionally rough high-alpine gravel/single-track: fords, rock steps, mud, possible snow near the top even in September; steep loose descent, then west to the lake. Strong-group, good-weather-window only. Skips the eagle hunters and Kochkor — the trade is culture for terrain.",
        "highlights": [
          "The wildest pass of the trip",
          "Near-zero traffic",
          "The direct herders' line from shore to plateau"
        ],
        "via": [],
        "geo": [[42.16568,77.44438], [41.9475,77.36833], [41.78,76.6], [41.76,75.9], [41.8,75.35], [41.83392,75.13119]]
      }
    ]
  },
  {
    "seg": "S5",
    "from": "song-kol",
    "to": "saty",
    "title": "Song-Kol → Saty / Kolsai (A5)",
    "options": [
      {
        "id": "S5a",
        "name": "Grand Western Loop",
        "reference": true,
        "refDays": "Days 11–14",
        "days": 4,
        "km": 979,
        "est": false,
        "difficulty": "hard",
        "diffLabel": "one hard off-road day, then moderate-to-easy tarmac",
        "adv": {
          "cls": 3,
          "peak": 4,
          "raw": "ADV Class 3 (Moderate/Orange) on the off-road day, peaks Class 4 (Difficult/Red) on the Moldo-Ashuu rocky descent; the two tarmac days are Paved, the Karkara gravel Class 2 (Basic/Yellow)."
        },
        "surface": "One hard rocky off-road day (the Song-Kol descent, Moldo-Ashuu 3,546 m and Kara-Keche 3,384 m), then Too-Ashuu's tunnel and descent, the Boom gorge, north-shore lake roads and the Karkara valley gravel to the border.",
        "highlights": [
          "Suusamyr's vast pasture",
          "Bishkek's big-city night",
          "The Cholpon-Ata petroglyphs",
          "Smoked lake fish on the north shore",
          "The Karkara valley"
        ],
        "via": ["suusamyr", "bishkek", "cholpon-ata"],
        "geo": [[41.83392,75.13119], [41.66863,75.03657], [41.74213,74.84804], [41.93312,74.53603], [41.95549,74.15629], [42.17893,73.96243], [42.34528,73.80694], [42.87462,74.56976], [42.58048,75.80468], [42.46136,76.18552], [42.64854,77.08275], [42.7406,78.79295], [42.80154,79.18217], [42.89201,79.23666], [43.01687,79.22483], [43.06992,78.40982]]
      },
      {
        "id": "S5b",
        "name": "North Shore Direct",
        "reference": false,
        "days": 2,
        "km": 575,
        "est": true,
        "difficulty": "moderate",
        "diffLabel": "moderate then easy",
        "frees": "Frees 2 days → extra anchor nights (A3/A4) and/or the Song-Kol/Suek weather buffer",
        "adv": {
          "cls": 2,
          "peak": 3,
          "raw": "ADV Class 2 (Basic/Yellow) on the descent (Class 3 when greasy after rain), then Paved."
        },
        "surface": "The Kalmak-Ashuu track down (the best-graded of all the Song-Kol accesses — maintained gravel, greasy after rain), then tarmac around the lake's east end and along the north shore; the reference Day-14 leg to Saty. The trade: no Suusamyr, no Too-Ashuu, no Bishkek.",
        "highlights": ["Still gets the petroglyphs and the fish stands", "Two full days banked for anchors or weather"],
        "via": ["cholpon-ata"],
        "geo": [[41.83392,75.13119], [41.9143,75.42118], [42.2164,75.75754], [42.46136,76.18552], [42.64854,77.08275], [42.7406,78.79295], [42.80154,79.18217], [42.89201,79.23666], [43.01687,79.22483], [43.06992,78.40982]]
      }
    ]
  },
  {
    "seg": "S6",
    "from": "saty",
    "to": "almaty",
    "title": "Saty → Almaty (base)",
    "note": "Option (b) is a flagged stop, not a separate route: groups with time and energy can add the <b>Charyn “Moon Canyon” viewpoint</b> off the Shelek road — worthwhile if Day 5 rushed Charyn.",
    "options": [
      {
        "id": "S6a",
        "name": "Kolsai Morning & the Run Home",
        "reference": true,
        "refDays": "Day 15",
        "days": 1,
        "km": 300,
        "est": false,
        "difficulty": "easy",
        "diffLabel": "easy",
        "adv": {
          "cls": 1,
          "peak": 3,
          "raw": "ADV Class 1–2 (Novice–Basic); the Kaindy jeep track is the exception at Class 3 (Moderate/Orange)."
        },
        "surface": "The Kaindy access track in the morning (rough but short), then tarmac Saty → Shelek → Almaty.",
        "highlights": ["The walk to Kolsai Lake-1", "Lake Kaindy if missed on arrival", "The celebration dinner in Almaty"],
        "via": [],
        "geo": [[43.06992,78.40982], [42.93539,78.3259], [43.06992,78.40982], [43.44821,78.67462], [43.60105,78.25607], [43.23798,76.88286]]
      }
    ]
  }
];

/* Bret Tkacs ADV Skill Rating System terrain classes (1 Novice … 5 Severe);
   ratings live on DAYS[].road.rating and SEGMENTS[].options[].adv as {cls, peak, raw}.
   Colors follow the system's flag colors, tuned legible for the dark UI. */
window.ADVSCALE = {
  "1": { "name": "Novice", "flag": "Green", "color": "#5fb35f", "hint": "graded gravel" },
  "2": { "name": "Basic", "flag": "Yellow", "color": "#e8c545", "hint": "packed sand · washboard" },
  "3": {
    "name": "Moderate",
    "flag": "Orange",
    "color": "#f0a830",
    "hint": "ruts, soft gravel, sand patches, switchbacks"
  },
  "4": { "name": "Difficult", "flag": "Red", "color": "#e3493b", "hint": "loose rock, deep gravel, mud, snow" },
  "5": { "name": "Severe", "flag": "Black", "color": "#cfcbe0", "hint": "dirt-bike terrain" }
};

/* Themed 'Silk Road Food Trail' foodie thread;
   rendered as a section on index.html and a callout on the matching day pages. */
window.FOOD_TRAIL = {
  "title": "The Silk Road Food Trail",
  "subtitle": "lunches & dinners are excluded — by design",
  "intro": "Lunches and dinners are on the rider, which is a feature: the route doubles as a food tour of Kazakh, Kyrgyz, Uyghur and Dungan cooking. Beshbarmak in Almaty, the benchmark laghman in the Uyghur District, Karakol's cold ashlan-fuu, kumis and boorsok in the Song-Kol yurts, plov in Bishkek, and smoked lake fish on Issyk-Kul's north shore — six can't-miss stops along the loop.",
  "note": "<b>Notes:</b> roadside staples — manty from the café steamers, samsa from tandyr ovens, and shashlik judged by its smoke — fill the days in between. Carry som/tenge in cash: most trail stops take no cards. Budget ≈ USD 25–35/day (café lunch $3–6, good dinner $8–15).",
  "bookend": "",
  "stops": [
    {
      "n": 1,
      "day": 1,
      "slot": "dinner",
      "city": "Almaty",
      "pref": "Kazakhstan",
      "style": "Beshbarmak — the welcome dinner",
      "styleDesc": "The national dish of both countries: boiled meat (often horse in Kazakhstan) over broad hand-cut noodles with onion broth. Order it at a proper Kazakh restaurant tonight — it doesn't travel to guest-house kitchens as grandly as this.",
      "shop": "A proper Kazakh restaurant, city center",
      "shopUrl": "https://www.google.com/maps/search/?api=1&query=beshbarmak%20restaurant%20Almaty",
      "shopNote": "the welcome-dinner order",
      "alts": [
        {
          "l": "Green Bazaar horse-meat stalls",
          "u": "https://www.google.com/maps/search/?api=1&query=Green%20Bazaar%20Almaty"
        }
      ],
      "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Beshbarmak1.jpg/960px-Beshbarmak1.jpg"
    },
    {
      "n": 2,
      "day": 4,
      "slot": "dinner",
      "city": "Chundzha",
      "pref": "Uyghur District, KZ",
      "style": "Laghman — the real thing",
      "styleDesc": "Chundzha is in the Uyghur heartland, and hand-pulled laghman here is the benchmark: chewy noodles slapped out to order under a fiery meat, pepper and celery sauce — eaten between rounds in the hot pools.",
      "shop": "Uyghur café at the resort strip",
      "shopUrl": "https://www.google.com/maps/search/?api=1&query=lagman%20Chundzha%20Shonzhy",
      "shopNote": "order it where the noodles are pulled to order",
      "alts": [
        {
          "l": "Manty & samsa at the bazaar",
          "u": "https://www.google.com/maps/search/?api=1&query=bazaar%20Shonzhy%20Kazakhstan"
        },
        {
          "l": "Shashlik by the pool",
          "u": "https://www.google.com/maps/search/?api=1&query=hot%20springs%20resort%20Chundzha"
        }
      ],
      "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Lagman_Moscow_2023.jpg/960px-Lagman_Moscow_2023.jpg"
    },
    {
      "n": 3,
      "day": 6,
      "slot": "lunch",
      "city": "Karakol",
      "pref": "Kyrgyzstan",
      "style": "Ashlan-fuu at the bazaar",
      "styleDesc": "Karakol's own dish and a point of civic pride: a cold, spicy Dungan bowl of noodles and wobbly starch jelly in vinegar-chili broth, sold for pennies at the cafés around the bazaar — practically an ashlan-fuu alley. Mandatory, ideally with a fried piroshki.",
      "shop": "Karakol bazaar ashlan-fuu stalls",
      "shopUrl": "https://www.google.com/maps/search/?api=1&query=ashlan-fuu%20Karakol%20bazaar",
      "shopNote": "pennies a bowl, best in town",
      "alts": [
        { "l": "Dungan family dinner (book ahead)", "u": "https://destinationkarakol.com/" },
        { "l": "Boso (fried) lagman", "u": "https://www.google.com/maps/search/?api=1&query=lagman%20Karakol" }
      ],
      "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Karakol_Dungan_Mosque.jpg/960px-Karakol_Dungan_Mosque.jpg"
    },
    {
      "n": 4,
      "day": 10,
      "slot": "dinner",
      "city": "Song-Kol",
      "pref": "Kyrgyzstan · 3,016 m",
      "style": "Kumis & boorsok in the yurts",
      "styleDesc": "Fermented mare's milk and fried dough pillows offered in the herders' yurts, with kaymak cream and apricot jam. Accepting a bowl is the polite (and memorable) thing to do — dinner is whatever the family cooks, and it's exactly right at 3,000 m.",
      "shop": "The herders' yurt camp",
      "shopUrl": "https://www.google.com/maps/search/?api=1&query=Song-Kul%20Lake%20Kyrgyzstan",
      "shopNote": "cash only — there is nothing to buy at the lake",
      "alts": [
        {
          "l": "Shorpo & fresh noodles at the camp",
          "u": "https://www.google.com/maps/search/?api=1&query=Song-Kul%20yurt%20camp"
        }
      ],
      "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Horse_standing_by_Song_Kul_Lake_-_Kyrgyztan.jpg/960px-Horse_standing_by_Song_Kul_Lake_-_Kyrgyztan.jpg"
    },
    {
      "n": 5,
      "day": 12,
      "slot": "dinner",
      "city": "Bishkek",
      "pref": "Kyrgyzstan",
      "style": "Plov & the big-city classics",
      "styleDesc": "The one mid-tour city night: proper kazan-cooked plov, beshbarmak and samsa at Navat's carved-wood teahouse — with the famous hand-pulled laghman at Cafe Faiza and craft beer at Save the Ales as the supporting cast.",
      "shop": "Navat",
      "shopUrl": "https://www.google.com/maps/search/?api=1&query=Navat%20Bishkek",
      "shopNote": "the easy, excellent group dinner",
      "alts": [
        { "l": "Cafe Faiza (laghman)", "u": "https://www.google.com/maps/search/?api=1&query=Cafe%20Faiza%20Bishkek" },
        {
          "l": "Supara Ethno-Complex",
          "u": "https://www.google.com/maps/search/?api=1&query=Supara%20Ethno%20Complex%20Bishkek"
        },
        { "l": "Save the Ales", "u": "https://www.google.com/maps/search/?api=1&query=Save%20the%20Ales%20Bishkek" }
      ],
      "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Osh_Bazaar_in_Bishkek%2C_Kyrgyzstan.jpg/960px-Osh_Bazaar_in_Bishkek%2C_Kyrgyzstan.jpg"
    },
    {
      "n": 6,
      "day": 13,
      "slot": "dinner",
      "city": "Cholpon-Ata",
      "pref": "Issyk-Kul north shore",
      "style": "Smoked lake fish on the promenade",
      "styleDesc": "The Issyk-Kul classic: whole fried or hot-smoked fish sold along both shores — the north-shore stands around Cholpon-Ata are the definitive stop, with bread, herbs, lemon and shashlik smoke drifting down the beachfront.",
      "shop": "North-shore fish stands",
      "shopUrl": "https://www.google.com/maps/search/?api=1&query=smoked%20fish%20Cholpon-Ata",
      "shopNote": "pick the stand with the queue",
      "alts": [
        {
          "l": "Shashlik on the promenade",
          "u": "https://www.google.com/maps/search/?api=1&query=shashlik%20Cholpon-Ata%20promenade"
        }
      ],
      "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/2015-09-07-082719_-_Cholpon-Ata%2C_Anlegesteg_und_Blick_zum_S%C3%BCdufer_des_Yssykk%C3%B6l.jpg/960px-2015-09-07-082719_-_Cholpon-Ata%2C_Anlegesteg_und_Blick_zum_S%C3%BCdufer_des_Yssykk%C3%B6l.jpg"
    }
  ]
};

/* Pre-trip preparation checklist (rendered by checklist.html). */
window.CHECKLIST = [
  {
    "sec": "Documents & visas",
    "icon": "📄",
    "items": [
      "Passport valid 6+ months beyond the trip, with 2+ blank pages (ALA stamps in and out PLUS four border stamps mid-tour)",
      "Kazakhstan: visa-free for US citizens up to 30 days/visit — hotels handle the >5-day registration automatically",
      "Kyrgyzstan: visa-free, but the rules changed Jan 1, 2026 (30 days within each 60-day period) — don't trust old guidebooks",
      "Re-verify BOTH countries' entry rules ~1 month before departure",
      "Home motorcycle license + International Driving Permit (AAA, ~USD 20, two passport photos) — carried every riding day",
      "Paper photocopies + phone photos of everything; passport stays on you (not in the truck) on both border days"
    ]
  },
  {
    "sec": "Flights & arrival",
    "icon": "✈️",
    "items": [
      "Round-trip ticket to Almaty (ALA) — arrive by Day 1 (Sat Sep 5), depart Day 16 (Sun Sep 20)",
      "Land in the morning or a day early — bike handover and the welcome dinner are on Day 1",
      "Send flight details to the operator for the included airport transfers",
      "Confirm the custom-edition dates and price (indicative ≈ USD 4,500) with Silk Off Road Tours"
    ]
  },
  {
    "sec": "The rental DR650 & the deposit",
    "icon": "🏍️",
    "items": [
      "USD 500 refundable damage deposit due at handover — damage liability is on the rider",
      "Photograph the bike thoroughly at the Day-1 inspection (every panel, both sides)",
      "Use the Day-2 training day hard: levers, tire pressures, suspension sag, full walk-around",
      "Soft duffel 15–20 kg for the support truck; ride with only a tank/tail bag and water",
      "Plan fuel around the ~250 km real-world range: fill at every stop the leader calls, and brim before Altyn-Emel, Barskoon, Song-Kol and the Kegen→Saty leg"
    ]
  },
  {
    "sec": "Riding gear — 0 to 35 °C in one trip",
    "icon": "🧥",
    "items": [
      "Full ADV suit with removable thermal + waterproof liners",
      "Off-road-capable boots; two glove weights (summer + insulated)",
      "Merino base layers + a packable down mid-layer + warm hat — Suek Pass and the ~3,000 m nights can freeze even in September",
      "Balaclava / neck tube; earplugs",
      "Hydration pack — desert days and altitude both punish dehydration"
    ]
  },
  {
    "sec": "Yurt-night kit (3 nights: D7–8 & D10)",
    "icon": "⛺",
    "items": [
      "Sleeping-bag liner (blankets are provided, laundering is rustic)",
      "Headlamp, wet wipes, small quick-dry towel",
      "Swim kit for the rest day at the lake",
      "10,000+ mAh power bank — yurt-camp power is limited/solar",
      "A few small gifts for herder hosts"
    ]
  },
  {
    "sec": "Health & altitude",
    "icon": "⛰️",
    "items": [
      "Ibuprofen/acetaminophen for altitude headaches; personal medications for 16 days",
      "Sunscreen + lip balm (altitude sun), water-purification backup, TP",
      "Hydrate relentlessly and skip alcohol the night before the big passes",
      "Respect the plan: Day 7 crests 4,021 m and two nights sleep at ~3,000 m — the Day-8 rest day is part of the acclimatization"
    ]
  },
  {
    "sec": "Money — tenge, som & cash",
    "icon": "💵",
    "items": [
      "Withdraw tenge (KZT) at ALA; som (KGS) in Karakol or Bishkek",
      "Carry ~USD 100 equivalent in small local notes at all times + USD ~200 in crisp bills as reserve",
      "Keep enough tenge from the first KZ leg to cover Days 14–15 — Saty is cash-only with no ATM",
      "Budget lunches & dinners ~USD 25–35/day (≈ USD 400–525 for the trip) and fuel ~USD 95–125",
      "Cash only in the border areas and at Song-Kol/Suusamyr/Saty; cards work in Almaty, Karakol, Bishkek, Cholpon-Ata"
    ]
  },
  {
    "sec": "Comms & eSIM",
    "icon": "📱",
    "items": [
      "Regional Central Asia eSIM (Airalo/Holafly) installed before flying — or local SIMs (passport needed to register)",
      "Expect zero coverage at Song-Kol, in Altyn-Emel's back country and on all high passes; patchy around Saty/Kolsai",
      "Tell family the blackout days in advance; consider a Garmin inReach",
      "Remember the time change (KG = KZ +1 h) when scheduling calls home on Days 5–14",
      "Download offline maps for both countries"
    ]
  },
  {
    "sec": "Insurance — the non-negotiable one",
    "icon": "🛡️",
    "items": [
      "Travel medical + emergency evacuation cover for all 16 days, in BOTH countries",
      "Policy must explicitly include riding a motorcycle over 250 cc (the DR650 is 644 cc) and be valid to 4,100 m altitude",
      "Carry the insurer's 24-h number on paper and give a copy to the ride leader",
      "Check whether your travel policy covers rental-vehicle excess (the USD 500 deposit exposure)"
    ]
  },
  {
    "sec": "Final days before",
    "icon": "✅",
    "items": [
      "Re-verify KZ & KG entry rules and re-confirm dates with the operator",
      "Watch the weather window for the Suek glacier road and Song-Kol",
      "Charge power bank, headlamp, intercom, camera",
      "Cash sorted (USD reserve + first tenge), documents photographed",
      "Pack the duffel to 15–20 kg and weigh it — the truck carries it, the mountain rates it"
    ]
  }
];

/* Geocoded routing points (lat,lng) so Google Maps always resolves them. */
window.GEO = {
  "Almaty, Kazakhstan": "43.23798,76.88286",
  "Panfilov Park, Almaty": "43.25858,76.95341",
  "Green Bazaar, Almaty": "43.26423,76.95475",
  "Kok-Tobe, Almaty": "43.23310,76.97553",
  "Medeu, Almaty": "43.15762,77.05846",
  "Turgen, Kazakhstan": "43.39837,77.59422",
  "Assy-Turgen Observatory": "43.22567,77.87174",
  "Bartogay Reservoir": "43.34944,78.50361",
  "Konaev, Kazakhstan": "43.86137,77.06352",
  "Saryozek, Kazakhstan": "44.35975,77.96399",
  "Basshi, Kazakhstan": "44.15957,78.75441",
  "Altyn-Emel National Park": "44.12987,78.85057",
  "Singing Dune, Altyn-Emel": "43.86573,78.56178",
  "Aktau Mountains, Altyn-Emel": "44.03720,79.29509",
  "Katutau, Altyn-Emel": "43.99693,79.04980",
  "Chundzha, Kazakhstan": "43.53651,79.46360",
  "Charyn Canyon": "43.35987,79.05003",
  "Kokpek, Kazakhstan": "43.44821,78.67462",
  "Kegen, Kazakhstan": "43.01687,79.22483",
  "Karkara border crossing": "42.80154,79.18217",
  "Karkara, Kazakhstan": "42.89201,79.23666",
  "Karakol, Kyrgyzstan": "42.47821,78.39560",
  "Jeti-Oguz Rocks": "42.33778,78.23151",
  "Teploklyuchenka (Ak-Suu)": "42.50221,78.52158",
  "Altyn-Arashan": "42.38157,78.60667",
  "Dungan Mosque, Karakol": "42.49737,78.39069",
  "Holy Trinity Cathedral, Karakol": "42.48909,78.39469",
  "Barskoon, Kyrgyzstan": "42.15465,77.59560",
  "Barskoon Waterfall": "42.00999,77.60762",
  "Sarimonok Pass": "41.95000,77.62000",
  "Barskoon Pass": "41.89357,77.69207",
  "Suek Pass": "41.78102,77.76056",
  "Tosor, Kyrgyzstan": "42.16568,77.44438",
  "Tosor Pass": "41.94750,77.36833",
  "Tamga, Kyrgyzstan": "42.15000,77.54475",
  "Skazka Canyon": "42.15475,77.35194",
  "Bokonbayevo, Kyrgyzstan": "42.11718,76.99311",
  "Balykchy, Kyrgyzstan": "42.46136,76.18552",
  "Kochkor, Kyrgyzstan": "42.21640,75.75754",
  "Kyzart, Kyrgyzstan": "42.03013,74.98225",
  "Kalmak-Ashuu (33 Parrots) Pass": "41.91430,75.42118",
  "Song-Kul Lake, Kyrgyzstan": "41.83392,75.13119",
  "Moldo-Ashuu Pass": "41.66863,75.03657",
  "Kara-Keche Pass": "41.74213,74.84804",
  "Chaek, Kyrgyzstan": "41.93312,74.53603",
  "Kyzyl-Oi, Kyrgyzstan": "41.95549,74.15629",
  "Suusamyr, Kyrgyzstan": "42.17893,73.96243",
  "Too-Ashuu Pass": "42.34528,73.80694",
  "Bishkek, Kyrgyzstan": "42.87462,74.56976",
  "Ala-Too Square, Bishkek": "42.87571,74.60367",
  "Osh Bazaar, Bishkek": "42.87497,74.57024",
  "Boom Gorge": "42.58048,75.80468",
  "Cholpon-Ata, Kyrgyzstan": "42.64854,77.08275",
  "Cholpon-Ata Petroglyphs": "42.66063,77.05674",
  "Ruh Ordo, Cholpon-Ata": "42.64898,77.09438",
  "Tüp, Kyrgyzstan": "42.74060,78.79295",
  "Saty, Kazakhstan": "43.06992,78.40982",
  "Kolsai Lake 1": "42.93539,78.32590",
  "Lake Kaindy": "42.98408,78.46738",
  "Shelek, Kazakhstan": "43.60105,78.25607"
};

/* Region-matched scenic photos used as each day's hero artwork (verified). */
window.DAYART = {
  "1": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Zenkov_Cathedral%2C_Almaty.jpg/960px-Zenkov_Cathedral%2C_Almaty.jpg",
  "2": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Medeu_-_skate_rink_-_2022-06-18.jpg/960px-Medeu_-_skate_rink_-_2022-06-18.jpg",
  "3": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Turkmenian_kulan_1.jpg/960px-Turkmenian_kulan_1.jpg",
  "4": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/210723_Altyn_Emel_Singing_Dune_came_2.jpg/960px-210723_Altyn_Emel_Singing_Dune_came_2.jpg",
  "5": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Charyn_Canyon%2C_Kazakhstan_01.jpg/960px-Charyn_Canyon%2C_Kazakhstan_01.jpg",
  "6": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Jeti-%C3%96g%C3%BCz_Rocks_-_Issyk-Kul_Region%2C_Jeti-Oguz_District.jpg/960px-Jeti-%C3%96g%C3%BCz_Rocks_-_Issyk-Kul_Region%2C_Jeti-Oguz_District.jpg",
  "7": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/The_view_on_Barskoon_George.jpg/960px-The_view_on_Barskoon_George.jpg",
  "8": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Issyk-Kul_South_Shore_Aug_2006.JPG/960px-Issyk-Kul_South_Shore_Aug_2006.JPG",
  "9": "https://upload.wikimedia.org/wikipedia/commons/9/95/KyrgyzEagleHuntsman.jpg",
  "10": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Song-Kul%2C_Kyrgyzstan_%2830709310728%29.jpg/960px-Song-Kul%2C_Kyrgyzstan_%2830709310728%29.jpg",
  "11": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/%D0%9A%D0%B5%D0%BA%D0%B5%D0%BC%D0%B5%D1%80%D0%B5%D0%BD.jpg/960px-%D0%9A%D0%B5%D0%BA%D0%B5%D0%BC%D0%B5%D1%80%D0%B5%D0%BD.jpg",
  "12": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Panorama_of_the_Too_Ashuu_Pass%2C_Kyrgyz_Alatau%2C_Kyrgyzstan_01.jpg/960px-Panorama_of_the_Too_Ashuu_Pass%2C_Kyrgyz_Alatau%2C_Kyrgyzstan_01.jpg",
  "13": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/2015-09-07-082719_-_Cholpon-Ata%2C_Anlegesteg_und_Blick_zum_S%C3%BCdufer_des_Yssykk%C3%B6l.jpg/960px-2015-09-07-082719_-_Cholpon-Ata%2C_Anlegesteg_und_Blick_zum_S%C3%BCdufer_des_Yssykk%C3%B6l.jpg",
  "14": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Karkara_River_valley%2C_Khan_Tengri_Nature_Park.jpg/960px-Karkara_River_valley%2C_Khan_Tengri_Nature_Park.jpg",
  "15": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/First_Kolsay_lake_2023.jpg/960px-First_Kolsay_lake_2023.jpg",
  "16": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Sunset_over_the_Almaty_seen_from_Kok_Tobe_mountain%2C_pic_1.jpg/960px-Sunset_over_the_Almaty_seen_from_Kok_Tobe_mountain%2C_pic_1.jpg"
};
