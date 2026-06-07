/* ============================================================
   Japan Family Motorcycle Tour — destination data
   Generated from tour/ markdown by gen_data.py (website-builder).
   Shared by index.html, place.html and day.html.
   Photos: Wikimedia Commons (all URLs verified reachable).
   Hotels are SUGGESTIONS — confirm motorcycle parking,
   passenger/child rules and availability before booking.
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

/* Approx. exchange rate for showing USD alongside JPY hotel prices (update as needed). */
window.JPY_PER_USD = 150;
/* Convert a JPY range string like "¥28,000–60,000" to "≈ $185–400". */
window.priceUSD = function (jpy) {
  if (!jpy) return "";
  const nums = (jpy.match(/\d[\d,]*/g) || []).map(n => Math.round(parseInt(n.replace(/,/g, ""), 10) / window.JPY_PER_USD / 5) * 5);
  if (!nums.length) return "";
  const fmt = n => "$" + n.toLocaleString("en-US");
  return nums.length > 1 ? `≈ ${fmt(nums[0])}–${nums[nums.length - 1].toLocaleString("en-US")}` : `≈ ${fmt(nums[0])}`;
};

/* Representative photos by lodging type (verified Wikimedia Commons).
   These illustrate the STYLE of stay, not the exact property. */
window.HOTEL_IMG = {
  onsen:  U+"a/a3/Takanoyu_Onsen_Rotenburo_086.jpg/960px-Takanoyu_Onsen_Rotenburo_086.jpg",
  ryokan: U+"6/60/Interior_of_a_ryokan_room_%282999708441%29.jpg/960px-Interior_of_a_ryokan_room_%282999708441%29.jpg",
  design: U+"e/e3/Modern_bedroom_design_in_a_stylish_hotel_room_featuring_geometric_patterns_and_soft_linens.jpg/960px-Modern_bedroom_design_in_a_stylish_hotel_room_featuring_geometric_patterns_and_soft_linens.jpg",
  hotel:  U+"e/e8/Comfort_Twin_Room_in_Triple_Configuration_%2821917602991%29.jpg/960px-Comfort_Twin_Room_in_Triple_Configuration_%2821917602991%29.jpg"
};
/* Pick a representative image from a hotel's `t` (type) label. Returns null for non-bookable "Note" rows. */
window.hotelImage = function (t) {
  const s = (t || "").toLowerCase();
  if (s.includes("note")) return null;
  if (s.includes("onsen")) return window.HOTEL_IMG.onsen;
  if (s.includes("ryokan") || s.includes("rural") || s.includes("farmhouse") || s.includes("inn")) return window.HOTEL_IMG.ryokan;
  if (s.includes("luxury") || s.includes("boutique") || s.includes("design") || s.includes("glamping")) return window.HOTEL_IMG.design;
  return window.HOTEL_IMG.hotel; // nice hotel, family-friendly, practical
};
/* Build a reliable search/booking link for a property name. */
window.hotelLink = function (name, place) {
  return "https://www.google.com/search?q=" + encodeURIComponent(name + " " + (place || "") + " hotel Japan");
};
/* Expected motorcycle-parking situation by lodging type. Every suggestion is
   selected to accommodate bikes; the exact spot must still be confirmed on booking. */
window.hotelParking = function (t) {
  const s = (t || "").toLowerCase();
  if (s.includes("note")) return null;
  if (s.includes("onsen") || s.includes("ryokan") || s.includes("rural") || s.includes("farmhouse") || s.includes("glamping"))
    return "Free on-site parking";
  if (s.includes("practical")) return "On-site / nearby lot";
  return "On-site garage or valet"; // nice hotel, boutique, luxury, family-friendly
};

window.DESTINATIONS = [
{
  id: "tokyo",
  name: "Tokyo",
  jp: "東京",
  region: "Kantō · Tokyo",
  type: "bookend",
  days: "Day 0–1 (arrival) · Days 23–24 (departure)",
  legMiles: 0,
  lat: 35.6595, lng: 139.7005, zoom: 11,
  tagline: "The air gateway either side of the loop — a jet-lag arrival night and a full kid-focused museum day (Ghibli, teamLab, Nintendo) before the Shinkansen south, then the reposition city for the flight home.",
  intro: [
    "Tokyo is <b>not part of the Osaka riding loop</b> — it is the <b>air gateway</b> that brackets it. The family flies <b>nonstop SEA ⇄ Tokyo</b> (Haneda on ANA/Delta, Narita on JAL) and rides the <b>Tōkaidō Shinkansen (~2h30m Nozomi) Tokyo ⇄ Shin-Osaka</b> to reach and leave the bikes at the <b>Suita, Osaka</b> base (see flights). The bikes are never in Tokyo; the city is where the trip begins and ends on foot and by train.",
    "On the way in, a <b>Day-0 arrival night</b> near <b>Shinagawa</b> absorbs the jet lag, and a <b>full Day-1 museum day</b> gives the family three of Tokyo's best kid experiences — the <b>Ghibli Museum</b> in Mitaka, <b>teamLab Planets</b> in Toyosu, and <b>Nintendo TOKYO</b> in Shibuya — before the <b>Day-2</b> train down to the bike pickup. On the way home, <b>Day 23</b> repositions from Osaka/Kyoto back to Tokyo by Nozomi (Fushimi Inari sits right on the line), an overnight near Haneda/Shinagawa, then the <b>nonstop flight home on Day 24</b>. Forward the big luggage by <b>takkyūbin</b> so the train legs stay light."
  ],
  highlights: [
    "<b>Ghibli Museum (Mitaka)</b> — Hayao Miyazaki's whimsical, hands-on museum on the edge of Inokashira Park: Totoro, the Catbus, a rooftop robot and an exclusive members-only short film. <b>Advance, date-and-time-specific tickets only (Lawson, ~a month ahead) — no door sales; it sells out fast</b>",
    "<b>teamLab Planets TOKYO (Toyosu)</b> — An immersive, barefoot, wade-through world of digital art — mirrored light rooms, knee-deep water and projected flowers that delight every age. <b>Needs a timed online ticket — reserve ahead</b>",
    "<b>Nintendo TOKYO (Shibuya PARCO)</b> — The official Nintendo flagship store (Mario, Zelda, Pokémon, Splatoon) with the <b>Pokémon Center Shibuya</b> next door — a gentle early-evening cap near Shibuya Crossing",
    "<b>Shibuya Crossing</b> — The world's busiest scramble crossing, a short stroll from Nintendo TOKYO — pure big-city Tokyo energy",
    "<b>Senso-ji & Asakusa</b> — Tokyo's oldest temple, the Kaminarimon lantern gate and the Nakamise market street — an easy traditional add if there's time",
    "<b>Tokyo Tower / Tokyo Skytree</b> — Classic city-view towers for a skyline overview"
  ],
  food: [
    {
      "n": "Sushi & kaiten-zushi",
      "d": "From conveyor-belt counters that thrill a 6-year-old to top-end Edomae sushi; Tokyo Bay is the home of the style."
    },
    {
      "n": "Ramen & tsukemen",
      "d": "Tokyo's dense ramen scene, from shoyu classics to dipping-noodle shops near every station."
    },
    {
      "n": "Monjayaki",
      "d": "Tokyo's runny, griddled cousin of okonomiyaki, cooked at your table — a hands-on, playful meal."
    },
    {
      "n": "Depachika bento",
      "d": "Department-store food halls (Tokyo Station, Shinagawa) for a beautiful packed meal to eat on the Nozomi south."
    }
  ],
  hotels: [
    {
      "n": "Shinagawa Prince Hotel",
      "t": "Family / hotel",
      "d": "Best all-round pick: ~15 min from Haneda on the Keikyu Line, Nozomi boards downstairs, a big family-friendly complex (aquarium, bowling). Ideal for the Day-0 arrival night.",
      "park": "On-site paid parking",
      "price": "¥22,000–30,000"
    },
    {
      "n": "Hotel Ryumeikan Tokyo",
      "t": "Nice hotel",
      "d": "Refined small hotel ~3 min from the Tokyo Station Shinkansen gates — great for the Day-24 return night before the flight.",
      "park": "Limited / valet — confirm",
      "price": "¥35,000–48,000"
    },
    {
      "n": "Hotel Metropolitan Marunouchi",
      "t": "Nice hotel",
      "d": "High-floor city views literally above the Tokyo Station Shinkansen tracks (Nihonbashi exit).",
      "park": "Confirm access",
      "price": "¥30,000–45,000"
    }
  ],
  links: [
    { "l": "Ghibli Museum (official, ticket info)", "u": "https://www.ghibli-museum.jp/en/" },
    { "l": "teamLab Planets TOKYO (official)", "u": "https://www.teamlab.art/e/planets/" },
    { "l": "Nintendo TOKYO (official store)", "u": "https://www.nintendo.co.jp/officialstore/en/" },
    { "l": "Shinagawa Prince Hotel", "u": "https://www.princehotels.com/shinagawa/" },
    { "l": "Wikipedia — Tokyo", "u": "https://en.wikipedia.org/wiki/Tokyo" },
    { "l": "Wikipedia — Tōkaidō Shinkansen", "u": "https://en.wikipedia.org/wiki/T%C5%8Dkaid%C5%8D_Shinkansen" }
  ],
  photos: [
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Tokyo_Tower_and_around_Skyscrapers.jpg/960px-Tokyo_Tower_and_around_Skyscrapers.jpg",
      "cap": "Tokyo Tower over the skyline"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Ghibli_Museum%2C_Mitaka%2C_Tokyo%2C_20240823_1131_5545.jpg/960px-Ghibli_Museum%2C_Mitaka%2C_Tokyo%2C_20240823_1131_5545.jpg",
      "cap": "The Ghibli Museum in Mitaka (Day 1)"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Photos_at_teamlab_planets_tokyo.jpg/960px-Photos_at_teamlab_planets_tokyo.jpg",
      "cap": "teamLab Planets immersive digital art, Toyosu (Day 1)"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Tokyo_Shibuya_Scramble_Crossing_2018-10-09.jpg/960px-Tokyo_Shibuya_Scramble_Crossing_2018-10-09.jpg",
      "cap": "Shibuya's famous scramble crossing"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Shibuya_PARCO_2.jpg/960px-Shibuya_PARCO_2.jpg",
      "cap": "Shibuya PARCO, home of Nintendo TOKYO (Day 1)"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Senso-ji_Kaminarimon_201503a.jpg/960px-Senso-ji_Kaminarimon_201503a.jpg",
      "cap": "The Kaminarimon gate at Senso-ji, Asakusa"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Shinagawa_Station_-01.jpg/960px-Shinagawa_Station_-01.jpg",
      "cap": "Shinagawa Station — the Day-0 arrival base and Shinkansen stop"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Marunouchi_%26_Tokyo_Station_3.jpg/960px-Marunouchi_%26_Tokyo_Station_3.jpg",
      "cap": "Marunouchi and Tokyo Station, the Shinkansen gateway"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Teamlab_toyosu.jpg/960px-Teamlab_toyosu.jpg",
      "cap": "Digital-art immersion at teamLab, Toyosu"
    }
  ]
},
{
  id: "osaka",
  name: "Osaka / Kansai",
  jp: "大阪",
  region: "Kansai",
  type: "start",
  days: "Day 2 (start) · Days 21–23 (finish)",
  legMiles: 0,
  lat: 34.6937, lng: 135.5023, zoom: 12,
  tagline: "The start and finish of the loop — a train-in, train-out hub: bike pickup, Super Nintendo World / USJ, big-city food, and a Kyoto buffer day.",
  intro: [
    "Osaka is both the <b>start and the end</b> of this Osaka-anchored loop, and Japan's great mercantile, comedy and food city — historically <i>tenka no daidokoro</i>, \"the nation's kitchen,\" where merchants set the rhythm rather than samurai or court. The motorcycles are picked up and returned at the rental base in <b>Suita, northern Osaka</b> (<a href=\"https://bikerentaljapan.com/\" target=\"_blank\" rel=\"noopener\">Bike Rental Japan</a>), so the journey begins and ends in the friendliest place in Japan to eat — no one-way drop, no backtracking. <b>Osaka Castle</b>, Toyotomi Hideyoshi's late-16th-century power seat, still anchors the city behind Japan's largest castle moats and a sweeping park; the present concrete keep (1931, with a top-floor observation deck and museum) is an easy, kid-pleasing first or last stroll.",
    "<b>Day 2 is strictly no riding:</b> after a Tokyo arrival night and a full Tokyo museum day, the family arrives by <b>Nozomi Shinkansen into Shin-Osaka around midday</b> (they fly nonstop SEA→Tokyo, then ride the ~2h30m bullet train down — see flights), transfer the short hop to the <b>Suita rental base</b>, collect the bikes, do the paperwork and gear-fit, and learn the controls on foot (see the overview) — capped with an easy Dōtonbori/Namba evening. The first real ride is <b>Day 3</b> up to the temple town of Kōyasan. The loop then drops down the <b>Route 168 pilgrim road</b> through the sacred Kumano interior, sweeps the Kii coast, ferries to Shikoku, island-hops the Setouchi and returns over the Akashi Kaikyō Bridge — landing back in Osaka on <b>Day 20</b>. <b>Days 21–23</b> are the easy finish: <b>Day 21</b> returns the bikes and unwinds in the city, <b>Day 22</b> is a full <b>Super Nintendo World / USJ</b> day, and <b>Day 23</b> keeps a flexible Kyoto/Osaka morning (Fushimi Inari) before <b>taking the Shinkansen back to Tokyo</b> for the homebound flight. Osaka is a <b>train-in, train-out hub</b> — no fly-in/out here; the airport (KIX) is not used."
  ],
  highlights: [
    "<b>Super Nintendo World / Universal Studios Japan</b> — the family kid-centrepiece of the Osaka end (a dedicated <b>Day 22</b>, bikes already returned): a life-size, interactive Mushroom Kingdom with <b>Mario Kart: Koopa's Challenge</b>, Yoshi's Adventure and the <b>Power-Up Band</b>, inside a big theme park (Harry Potter, Minions). <b>Needs timed-entry / Area Timed-Entry or Express Pass — book ahead; a busy full day</b>",
    "<b>Osaka Aquarium Kaiyukan</b> — one of the world's largest aquariums, built around a central whale-shark tank you spiral down past — an indoor, all-weather, sure-fire kids' day at the bayfront, and the calm alternative if USJ is too much",
    "<b>Dōtonbori & Namba</b> — the canal-side neon canyon with the running <b>Glico Man</b> sign, the giant mechanical crab, and the city's loudest concentration of street food — the easy welcome-evening and celebration-dinner district",
    "<b>Nintendo OSAKA + Pokémon Center (Daimaru Umeda 13F)</b> — Kansai's flagship Nintendo store and a large Pokémon Center sit on the <b>same floor</b> of Daimaru next to JR Osaka/Umeda — walk-in, no ticket (~10:00–20:00); Mario/Zelda/Splatoon and Pokémon plush, figures and exclusives. A no-fuss double win for Aslan and Galiya on a Day-22 or Day-24 city afternoon",
    "<b>Donguri Republic</b> — the official <b>Studio Ghibli</b> retail shop (Totoro/Ponyo/Kiki goods), in the central Umeda/Namba malls — the easy way to close Galiya's Ghibli thread with a souvenir; Aslan gets a plush out of it too",
    "<b>Den Den Town (Nipponbashi) & Super Potato</b> — Osaka's electronics/otaku district and the trip's best toy/figure shopping: the <b>Super Potato</b> retro-game shop (Mario-statue storefront, classic Famicom/N64), floors of <b>gachapon</b> capsule toys, and the figure/second-hand shops (Mandarake, Hobby Station) — the most reliable place on the loop to find <b>Transformers / Takara Tomy robot toys</b>. Pairs with Kuromon Ichiba next door",
    "<b>Kuromon Ichiba</b> — \"Osaka's kitchen\": a covered market of fresh seafood, wagyu skewers, fruit and street snacks to eat as you walk — a foodie + kid stop a short walk from Den Den Town",
    "<b>Minoh Falls / Minoo Park (<a href=\"https://en.wikipedia.org/wiki/Meiji_no_Mori_Mino_Quasi-National_Park\" target=\"_blank\" rel=\"noopener\">Meiji-no-Mori Mino Quasi-National Park</a>)</b> — the <b>Day-2 warm-up ride</b> turnaround, ~30 min north of the Suita rental base: a leafy forest gorge with a 33 m waterfall, wild monkeys and <b>momiji-tempura</b> (deep-fried maple leaves) along an easy ~40-min walk — a gentle, kid-friendly first ride on the rental bikes before the demanding Day 3 (easy/optional, weather-dependent)",
    "<b>Osaka Castle & park</b> — broad moats, turreted stone walls and the reconstructed gold-trimmed keep; the surrounding park is a relaxed first-evening or final-day walk",
    "<b>Shinsekai & Tsūtenkaku tower</b> — a gloriously retro Shōwa-era district under a 1950s \"tower reaching heaven,\" and the spiritual home of kushikatsu skewers",
    "<b>Umeda Sky Building \"Floating Garden\"</b> — a 173 m open-air rooftop ring with an escalator that crosses mid-air between the twin towers",
    "<b>Reposition-day option:</b> Kyoto's <b>Fushimi Inari</b> thousand-torii hike (it sits right on the Tōkaidō line — sightsee, then board the Shinkansen at Kyoto Station) or <b>Nara Park</b>'s bowing deer, both an easy hop on the <b>Day-24</b> reposition to Tokyo"
  ],
  food: [
    {
      "n": "Takoyaki",
      "d": "molten octopus dumplings griddled in dimpled iron pans, brushed with sauce, bonito and mayo; the icon of Osaka street food, eaten standing up."
    },
    {
      "n": "Okonomiyaki",
      "d": "a savoury cabbage-and-batter \"as-you-like-it\" pancake cooked on a hotplate at your table; the Osaka (mixed) style differs from Hiroshima's layered version."
    },
    {
      "n": "Kushikatsu",
      "d": "crisp panko-crumbed skewers (meat, veg, cheese) deep-fried and dunked in a shared sauce — Shinsekai's specialty, with the famous \"no double-dipping\" rule."
    },
    {
      "n": "Negiyaki & modan-yaki",
      "d": "thin spring-onion griddle cakes and okonomiyaki folded around yakisoba noodles, local diner staples."
    },
    {
      "n": "Horumon / kushikatsu izakaya",
      "d": "grilled offal and skewers with beer, the working-city counterpoint to refined Kyoto cuisine."
    }
  ],
  hotels: [
    {
      "n": "Machiya townhouse (e.g. Kuishinbo-style stays, central)",
      "t": "Restored machiya",
      "d": "A traditional tatami townhouse for the Osaka night; many sleep a family on futons. Confirm a flat-surface coin lot that takes motorcycles.",
      "park": "No on-site parking — use a nearby coin lot (Times/Repark, ~¥1,000–1,600/day, ~100–300 m); <b>confirm a bike-friendly lot</b>",
      "price": "¥18,000–40,000 (whole house)"
    },
    {
      "n": "Garage hotel near the Suita base",
      "t": "Practical",
      "d": "Stay near the rental counter for an unhurried Day-2 handover and Day-22 return.",
      "park": "On-site garage / lot — <b>confirm height & motorcycle acceptance</b>",
      "price": "¥10,000–18,000"
    },
    {
      "n": "Mitsui Garden Hotel Osaka Premier",
      "t": "Nice hotel",
      "d": "Riverside 4-star with family rooms and city views if you want a polished central base.",
      "park": "On-site/contract garage — confirm bike handling",
      "price": "¥18,000–35,000"
    },
    {
      "n": "Hotel Universal Port (USJ bayfront)",
      "t": "Family / theme-park",
      "d": "Official USJ-partner hotel a short walk from the park gates, with Minion-themed and large family rooms — handy for the Day-23 Super Nintendo World day (bikes already returned, so a car-park space is fine). Book the dated park tickets and area-entry separately.",
      "park": "On-site/partner parking — <b>confirm motorcycle acceptance</b>",
      "price": "¥24,000–45,000"
    }
  ],
  links: [
    { "l": "Osaka Info (official)", "u": "https://osaka-info.jp/en/" },
    { "l": "Universal Studios Japan (official)", "u": "https://www.usj.co.jp/web/en/us" },
    { "l": "Wikipedia — Osaka", "u": "https://en.wikipedia.org/wiki/Osaka" },
    { "l": "Wikipedia — Super Nintendo World", "u": "https://en.wikipedia.org/wiki/Super_Nintendo_World" }
  ],
  photos: [
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Osaka_Castle%2C_Keep_tower%2C_South_view_20190415_1.jpg/960px-Osaka_Castle%2C_Keep_tower%2C_South_view_20190415_1.jpg",
      "cap": "Osaka Castle keep"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Peach%27sCastle_at_Universal_Studios_Japan_20220814.jpg/960px-Peach%27sCastle_at_Universal_Studios_Japan_20220814.jpg",
      "cap": "Peach's Castle in Super Nintendo World, Universal Studios Japan (Day 22)"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Dotonbori%2C_Osaka%2C_at_night%2C_November_2016.jpg/960px-Dotonbori%2C_Osaka%2C_at_night%2C_November_2016.jpg",
      "cap": "Dotonbori, Osaka, at night, November"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/OSAKA_Tsutenkaku_%2820190810%29.jpg/960px-OSAKA_Tsutenkaku_%2820190810%29.jpg",
      "cap": "OSAKA Tsutenkaku"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Dotonbori_Neon_Sign%2C_Osaka_20190415_1.jpg/960px-Dotonbori_Neon_Sign%2C_Osaka_20190415_1.jpg",
      "cap": "Dotonbori Neon Sign, Osaka"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Shinsekai_and_Tsutenkaku_Tower.jpg/960px-Shinsekai_and_Tsutenkaku_Tower.jpg",
      "cap": "Shinsekai and Tsutenkaku Tower"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Osaka_Castle_Outer_Moat_and_Osaka_Business_Park%2C_November_2016.jpg/960px-Osaka_Castle_Outer_Moat_and_Osaka_Business_Park%2C_November_2016.jpg",
      "cap": "Osaka Castle Outer Moat and Osaka Business Park, November"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Dotonbori_Osaka_1910.jpg/960px-Dotonbori_Osaka_1910.jpg",
      "cap": "Dotonbori Osaka"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Osaka_Castle_August_2024.jpg/960px-Osaka_Castle_August_2024.jpg",
      "cap": "Osaka Castle August"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Osaka_Castle_and_Gokuraku-bashi_Bridge.jpg/960px-Osaka_Castle_and_Gokuraku-bashi_Bridge.jpg",
      "cap": "Osaka Castle and Gokuraku-bashi Bridge"
    }
  ]
},
{
  id: "koyasan",
  name: "Kōyasan (Mt. Kōya)",
  jp: "高野山",
  region: "Kōya · Wakayama (Kii Peninsula)",
  type: "stop",
  days: "Day 3 · quick daytime stop (no overnight)",
  legMiles: 54,
  lat: 34.2131, lng: 135.5844, zoom: 14,
  tagline: "A 1,200-year-old monastery town in the clouds — temple lodging, lantern-lit cedar avenues and Japan's most atmospheric cemetery.",
  intro: [
    "The first real ride leaves the Kansai sprawl and climbs the paved <b>Route 480 / 370</b> approach into the forested highlands of <b>Kōyasan</b> — a UNESCO World Heritage monastic town founded in <b>816</b> by the monk <b>Kūkai (Kōbō Daishi)</b> as the headquarters of <b>Shingon Buddhism</b>. Set in a high basin at ~800 m and ringed by eight peaks, it holds <b>117 temples</b>, a great vermilion pagoda, and <b>Okunoin</b> — Japan's largest cemetery, where more than 200,000 tombs, moss-covered and lantern-lit, line a two-kilometre avenue of giant cedars to Kūkai's mausoleum.",
    "This trip treats Kōyasan as a <b>quick daytime stop, not an overnight</b> — the family isn't after a deep spiritual temple stay, so plan a brisk <b>~1–1.5 hour visit</b> (walk the cedar avenue of Okunoin, or the vermilion Danjō Garan pagoda complex and Kongōbu-ji, perhaps a temple-village lunch of <i>shōjin-ryōri</i>), then <b>ride straight on down the Route 168 pilgrim road to overnight at Yunomine</b> in the Kumano interior (see Kumano Interior — Hongū & Yunomine). It is a gentle, awe-inspiring waypoint that eases the family into the trip without committing the whole afternoon to the mountain."
  ],
  highlights: [
    "<b>Okunoin</b> — a two-kilometre avenue of ancient cedars and 200,000+ tombs to Kōbō Daishi's mausoleum; even a daytime walk of the first stretch is unforgettable and surprisingly captivating for a child",
    "<b>Konpon Daitō & Danjo Garan</b> — the brilliant vermilion Great Stupa and Kūkai's original temple complex, the spiritual heart of the mountain (the most efficient single stop)",
    "<b>Kongōbu-ji</b> — the head temple of Shingon Buddhism, with painted sliding screens and <b>Banryūtei</b>, Japan's largest rock garden",
    "<b>Daimon</b> — the towering vermilion Great Gate guarding the western approach, with sweeping valley views (right on the road out)",
    "<b>Reihōkan Museum</b> — Buddhist art and National Treasures of the mountain (only if you have extra time)"
  ],
  food: [
    {
      "n": "Shōjin-ryōri",
      "d": "refined Buddhist vegetarian temple cuisine (no meat, fish, onion or garlic), served lacquer-tray style; a quietly memorable lunch for the whole family before the ride south."
    },
    {
      "n": "Goma-dōfu",
      "d": "silky sesame \"tofu,\" ground and set without soy — the signature Kōyasan delicacy, sold to eat in or take away."
    },
    {
      "n": "Kōya-dōfu",
      "d": "freeze-dried tofu, accidentally invented on this cold mountain centuries ago and now used across Japan; reconstituted in a sweet-savoury broth."
    },
    {
      "n": "Tempura of mountain vegetables (sansai) & fu (wheat gluten) — seasonal hillside greens and chewy fu, staples of the meatless table.",
      "d": ""
    },
    { "n": "Amazake", "d": "a warming low/non-alcohol rice drink for a cool mountain morning." }
  ],
  hotels: [
    {
      "n": "No overnight here",
      "t": "Note",
      "d": "No overnight here. This trip skips the Kōyasan temple-lodging (shukubō) night entirely — the family isn't after a deep spiritual stay, so Kōyasan is a quick ~1–1.5 hour daytime stop and the night is spent at the onsen hamlet of Yunomine in the Kumano interior, ~2 hours south down Route 168."
    }
  ],
  links: [
    { "l": "Kōyasan Shukubō Association (official)", "u": "https://eng.shukubo.net/" },
    { "l": "Koya Town tourism (official)", "u": "https://www.koya.org/eng/" },
    { "l": "Wikipedia — Mount Kōya", "u": "https://en.wikipedia.org/wiki/Mount_K%C5%8Dya" },
    { "l": "Wikipedia — Okunoin", "u": "https://en.wikipedia.org/wiki/Okunoin" }
  ],
  photos: [
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Konpon_Daito_Pagoda_-_Garan_Complex_-_Koyasan_-_Japan_%2847950047772%29.jpg/960px-Konpon_Daito_Pagoda_-_Garan_Complex_-_Koyasan_-_Japan_%2847950047772%29.jpg",
      "cap": "The vermilion Konpon Daitō at the Danjo Garan"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Choishi_Path_-_Okunoin_Cemetery_-_Koyasan_-_Japan_-_18_%2847949824357%29.jpg/960px-Choishi_Path_-_Okunoin_Cemetery_-_Koyasan_-_Japan_-_18_%2847949824357%29.jpg",
      "cap": "The ancient cedar avenue through Okunoin cemetery"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Koyasan_Okunoin_Rosoku01.jpg/960px-Koyasan_Okunoin_Rosoku01.jpg",
      "cap": "Votive candles glowing at Okunoin"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/View_of_Toro-do_from_Gobyo-bashi%2C_Okunoin%2C_Koyasan%2C_2016.jpg/960px-View_of_Toro-do_from_Gobyo-bashi%2C_Okunoin%2C_Koyasan%2C_2016.jpg",
      "cap": "The Tōrō-dō (Lantern Hall) before Kōbō Daishi's mausoleum"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Narrow_rock_garden%2C_Kongobuji%2C_Koyasan%2C_2016.jpg/960px-Narrow_rock_garden%2C_Kongobuji%2C_Koyasan%2C_2016.jpg",
      "cap": "Rock garden at Kongōbu-ji head temple"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Koyasan%2C_Daimon.jpg/960px-Koyasan%2C_Daimon.jpg",
      "cap": "The Daimon Great Gate, western entrance to Kōyasan"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Lanterns_inside_Toro-do%2C_Okunoin%2C_Koyasan%2C_2016_%281%29.jpg/960px-Lanterns_inside_Toro-do%2C_Okunoin%2C_Koyasan%2C_2016_%281%29.jpg",
      "cap": "Thousands of lanterns inside the Tōrō-dō"
    }
  ]
},
{
  id: "kumano-interior",
  name: "Kumano Interior — Hongū & Yunomine",
  jp: "熊野本宮・湯の峰",
  region: "Kumano · Wakayama (Kii interior)",
  type: "stay",
  days: "Days 3–4 · 2 nights",
  legMiles: 102,
  lat: 33.8403, lng: 135.7733, zoom: 12,
  tagline: "The sacred heart of the Kii Peninsula: the grandest Kumano shrine, Japan's largest torii, a riverbed you dig into a hot spring, and a world-heritage bath.",
  intro: [
    "Day 3 is one combined ride: a <b>quick stop at Kōyasan</b> (no overnight) and then south down <b>Route 168</b> — the classic pilgrim road — following the <b>Totsukawa River</b> through deep forested gorges and <b>Totsukawa</b>, Japan's largest village by area. The valley opens at the <b>Hongū</b> basin, spiritual centre of the <b>Kumano Kodō</b> pilgrimage and home to <b>Kumano Hongū Taisha</b>, the head shrine of the three <b>Kumano Sanzan</b> (Hongū, Hayatama, Nachi). A few minutes away, on the river sandbank where the shrine once stood, rises <b>Ōyunohara</b> — <b>Japan's largest torii gate</b>, a steel colossus 33.9 m high.",
    "This is the loop's contemplative rest base — <b>two nights</b> at the ancient onsen hamlets of <b>Yunomine</b> and <b>Kawayu</b>, where you can soak in the world-heritage <b>Tsuboyu</b> bath, cook eggs in the bubbling spring, or <b>dig your own bath</b> in the warm pebbles of the riverbed. For the child there's the <b>Doro-kyō gorge river-boat</b> and the swaying <b>Tanise suspension bridge</b>. Route 168 is moderate, paved two-lane riding — winding but not technical, ridden at a relaxed pace."
  ],
  highlights: [
    "<b>Kumano Hongū Taisha</b> — the head shrine of the Kumano Sanzan, its cypress-bark halls reached up a cedar-lined stone stair",
    "<b>Ōyunohara great torii</b> — Japan's largest torii (33.9 m) standing over the old shrine sandbank; a genuine \"wow\" for a child",
    "<b>Yunomine Onsen & Tsuboyu</b> — soak in the tiny <b>Tsuboyu</b>, the only UNESCO World Heritage bath you can actually bathe in (reserve a 30-min slot), and <b>boil eggs or vegetables</b> in the public <i>yuzutsu</i> hot spring",
    "<b>Kawayu Onsen</b> — scoop out your <b>own riverbed bath</b> in the warm gravel of the Ōto River, mixing hot spring and cool stream to taste",
    "<b>Doro-kyō gorge river-boat</b> — a ~40-min cruise on the glass-clear Kitayama River through Japan's premier gorge; boards at the Kumano River Riverboat Center (Tamaki-guchi, Shingū). It's a featured <b>must-do scheduled on Day 5</b> (the descent to the coast) — but the Hongū basin is close to the boarding point, so it also works as a <b>Day-4 rest-day outing</b> if you'd rather ride down to it from Yunomine on the free day. Do it once, on whichever day suits.",
    "<b>Tanise no Tsuribashi</b> — at 297 m one of Japan's longest pedestrian suspension bridges, swinging high over the Totsukawa (a thrill on the way in)",
    "<b>Kumano Kodō short walk</b> — the gentle <b>Hosshinmon-ōji → Hongū</b> final section of the Nakahechi trail, a manageable family stretch of the pilgrimage"
  ],
  food: [
    { "n": "Mehari-zushi", "d": "rice balls wrapped in pickled mustard-leaf, the Kumano pilgrim's lunch." },
    {
      "n": "Onsen-cooked eggs & vegetables",
      "d": "lower them into the Yunomine spring on a string and eat them by the river."
    },
    { "n": "Amego & ayu", "d": "grilled river trout and sweetfish from the Totsukawa." },
    { "n": "Mehari & mountain vegetables (sansai)", "d": "hearty interior fare served at the ryokan." }
  ],
  hotels: [
    {
      "n": "Ryokan Adumaya (Yunomine)",
      "t": "Historic onsen ryokan",
      "d": "Edo-era inn run for generations, steps from the Tsuboyu bath; its own hot-spring baths and kaiseki dinners; central in the village (lane is tight — confirm approach).",
      "park": "<b>Free on-site parking</b>",
      "price": "¥24,000–48,000"
    },
    {
      "n": "Fujiya (Kawayu)",
      "t": "Onsen ryokan",
      "d": "Riverside rooms over the Ōto River; dig-your-own riverbed bathing on the doorstep — a hit with a child.",
      "park": "<b>Free on-site parking</b>",
      "price": "¥22,000–42,000"
    },
    {
      "n": "Yunomine / Kawayu minshuku (e.g. Yoshinoya, Tsuboyu-no-yado)",
      "t": "Family minshuku",
      "d": "Simple, friendly two-night bases with home cooking and onsen; ask where to leave the bikes off the narrow lane.",
      "park": "On-site / roadside lot (confirm)",
      "price": "¥12,000–20,000"
    }
  ],
  links: [
    { "l": "Kumano Travel / Tanabe-Kumano Tourism Bureau (official)", "u": "https://www.tb-kumano.jp/en/" },
    { "l": "Kumano Hongū Taisha (official)", "u": "https://www.hongutaisha.jp/" },
    { "l": "Wikipedia — Kumano Hongū Taisha", "u": "https://en.wikipedia.org/wiki/Kumano_Hong%C5%AB_Taisha" },
    { "l": "Wikipedia — Yunomine Onsen", "u": "https://en.wikipedia.org/wiki/Yunomine_Onsen" },
    { "l": "Dorokyō Gorge (JNTO official)", "u": "https://www.japan.travel/en/spot/1990/" },
    {
      "l": "Doro-kyō river-boat cruise — Kumano River Riverboat Center (official)",
      "u": "https://www.shinguu.jp/en/spots/detail/A0083"
    }
  ],
  photos: [
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Torii_at_Oyunohara_01.jpg/960px-Torii_at_Oyunohara_01.jpg",
      "cap": "Ōyunohara, Japan's largest torii gate"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Oyunohara_autumn.jpg/960px-Oyunohara_autumn.jpg",
      "cap": "The great torii framed by autumn colour"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Tanabe_Kumano_Hongu-Taisha_Honden_1.jpg/960px-Tanabe_Kumano_Hongu-Taisha_Honden_1.jpg",
      "cap": "Cypress-bark halls of Kumano Hongū Taisha"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Kumano_Kodo_pilgrimage_route_Yunomine_Onsen_World_heritage_%E7%86%8A%E9%87%8E%E5%8F%A4%E9%81%93_%E6%B9%AF%E3%81%AE%E5%B3%B0%E6%B8%A9%E6%B3%89116.JPG/960px-Kumano_Kodo_pilgrimage_route_Yunomine_Onsen_World_heritage_%E7%86%8A%E9%87%8E%E5%8F%A4%E9%81%93_%E6%B9%AF%E3%81%AE%E5%B3%B0%E6%B8%A9%E6%B3%89116.JPG",
      "cap": "The hot-spring hamlet of Yunomine Onsen"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Kawayu_onsen1.JPG/960px-Kawayu_onsen1.JPG",
      "cap": "Dig-your-own riverbed bathing at Kawayu Onsen"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Doro_Gorge_Jet_Boat.jpg/960px-Doro_Gorge_Jet_Boat.jpg",
      "cap": "A traditional river-boat in the Doro-kyō gorge"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Dorokyo_in_2019_August_A.jpg/960px-Dorokyo_in_2019_August_A.jpg",
      "cap": "The cliffs and green water of Doro-kyō"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Suspension_bridge_of_Tanize_2010.07.28_-_Merged-1.jpg/960px-Suspension_bridge_of_Tanize_2010.07.28_-_Merged-1.jpg",
      "cap": "The Tanise suspension bridge over the Totsukawa (Route 168)"
    }
  ]
},
{
  id: "kumano",
  name: "Kumano Coast — Nachi & Katsuura",
  jp: "熊野・那智勝浦",
  region: "Kumano · Wakayama / Mie",
  type: "stop",
  days: "Day 5",
  legMiles: 30,
  lat: 33.6259, lng: 135.9412, zoom: 13,
  tagline: "Sacred waterfalls, pilgrim shrines and a wild Pacific shore.",
  intro: [
    "Dropping out of the Kumano interior, the route follows the <b>Kitayama River</b> down through the cliffs of <b>Doro-kyō</b> gorge to the <b>Kumano coast</b> — the Pacific edge of the Kii Peninsula and the seaward heart of the UNESCO <b>Kumano Kodō</b> pilgrimage region. The day's reward is <b>Nachi Falls</b> — Japan's tallest single-drop waterfall at 133 m — framed beside the vermilion three-storied pagoda of <b>Kumano Nachi Taisha</b>, one of the most photographed scenes in the country.",
    "Overnight is at <b>Katsuura</b>, a working tuna port whose ryokan are famous for cliff-and-cave hot-spring baths over the sea. It's a short, scenic riding day off the mountains — a dramatic contrast to the misty interior shrines upstream."
  ],
  highlights: [
    "⭐ <b>Doro-kyō gorge river-boat — MUST-DO</b> — the classic Kumano river experience: a ~40-minute boat cruise through <b>Doro-kyō</b>, Japan's premier river gorge, gliding over glass-clear emerald water beneath 50 m cliffs and weird water-carved rocks (a Special Place of Scenic Beauty & Natural Monument). A guaranteed thrill for a 6-year-old. The wooden river-boat boards at the <b>Kumano River Riverboat Center, Tamaki-guchi (Kumanogawa, Shingū)</b> — Mar–Nov, daily except Mon, ~hourly 09:00–15:00, ¥3,000 adult / ¥1,500 child 4–12 (under-4s not carried); reserve ahead. <i>The old Kumano Kotsu waterjet boat was discontinued in 2021; this wooden boat (plus a year-round hovercraft option) is the current way to ride the gorge.</i> [[Dorokyo Gorge River-Boat — official]](https://www.shinguu.jp/en/spots/detail/A0083)",
    "<b>Nachi Falls (Nachi-no-Taki)</b> — at 133 m Japan's tallest single-drop waterfall, worshipped as a <i>kami</i> in its own right; the falls themselves are the sacred object of Hirō-jinja shrine at their foot",
    "<b>Kumano Nachi Taisha & Seiganto-ji pagoda</b> — the postcard of Japan: the vermilion three-storied pagoda with the white thread of the falls behind it. Seiganto-ji is temple #1 of the Saigoku Kannon pilgrimage",
    "<b>Daimon-zaka</b> — a short, atmospheric cobbled pilgrim path climbing under 800-year-old cedars; you can rent <b>Heian-era pilgrim costume</b> nearby, a fun dress-up for a child",
    "<b>Kumano Hayatama Taisha (Shingū)</b> — the third of the three grand Kumano Sanzan shrines, by the river mouth; in its grounds stands a <b>1,000-year-old sacred nagi tree</b>, Japan's largest",
    "<b>Katsuura cave & cliff onsen</b> — soak in seaside grotto baths; <b>Hotel Urashima's Bōki-dō</b> is a natural sea cave with the surf booming below",
    "<b>Katsuura morning tuna market</b> — Japan's #1 port for fresh (line-caught, not frozen) tuna; you can watch the dawn auction from a gallery"
  ],
  food: [
    {
      "n": "Maguro (tuna)",
      "d": "Katsuura lands more fresh tuna than anywhere in Japan; eat it as maguro-don, sashimi or seared zuke right by the port."
    },
    {
      "n": "Mehari-zushi",
      "d": "a fist-sized rice ball wrapped in pickled takana mustard-leaf, the classic Kumano pilgrim's hand lunch."
    },
    {
      "n": "Sanma-zushi",
      "d": "pressed Pacific-saury sushi, a Kii-coast specialty eaten at festivals and on the road."
    },
    {
      "n": "Citrus & umeboshi",
      "d": "Wakayama is Japan's mikan (mandarin) and ume (pickled-plum) capital; try fresh juice and ume sweets."
    }
  ],
  hotels: [
    {
      "n": "Hotel Urashima",
      "t": "Onsen ryokan resort",
      "d": "Vast clifftop resort with the famous Bōki-dō sea-cave bath; tatami family rooms; leave the bikes on the mainland and boat over.",
      "park": "Free on-site mainland lot; ryokan boat to the inn",
      "price": "¥20,000–45,000"
    },
    {
      "n": "Katsuura Gyoen",
      "t": "Onsen ryokan",
      "d": "Seaside hot-spring inn with open-air baths over the bay; tatami rooms with futons for a child.",
      "park": "Free on-site parking",
      "price": "¥20,000–40,000"
    },
    {
      "n": "Nachikatsuura minshuku / business inns",
      "t": "Family inn / practical",
      "d": "Simple central options by the port for an easy one-nighter near the morning market.",
      "park": "On-site / nearby port lot",
      "price": "¥9,000–16,000"
    }
  ],
  links: [
    {
      "l": "Doro-kyō river-boat cruise — Kumano River Riverboat Center (official)",
      "u": "https://www.shinguu.jp/en/spots/detail/A0083"
    },
    { "l": "Nachikatsuura tourism (official)", "u": "https://nachikan.jp/en/" },
    { "l": "Kumano Kodō / Tanabe-Kumano (official)", "u": "https://www.tb-kumano.jp/en/" },
    { "l": "Wikipedia — Kumano Nachi Taisha", "u": "https://en.wikipedia.org/wiki/Kumano_Nachi_Taisha" },
    { "l": "Wikipedia — Nachi Falls", "u": "https://en.wikipedia.org/wiki/Nachi_Falls" }
  ],
  photos: [
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Nachikatsuura_Kumano-Nachi-taisha_Hiro-jinja_Nachi_Falls_06.jpg/960px-Nachikatsuura_Kumano-Nachi-taisha_Hiro-jinja_Nachi_Falls_06.jpg",
      "cap": "Nachi Falls beside the Seiganto-ji pagoda"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Nachikatsuura_Kumano-Nachi-taisha_Hiro-jinja_Nachi_Falls_07.jpg/960px-Nachikatsuura_Kumano-Nachi-taisha_Hiro-jinja_Nachi_Falls_07.jpg",
      "cap": "Japan's tallest single-drop waterfall"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Kumano-Nachi_Taisha_%2851928795142%29.jpg/960px-Kumano-Nachi_Taisha_%2851928795142%29.jpg",
      "cap": "Kumano Nachi Taisha shrine"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Kumano_Nachi_Taisha_201908-2.jpg/960px-Kumano_Nachi_Taisha_201908-2.jpg",
      "cap": "Vermilion shrine buildings at Nachi"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Nachikatsuura-kinomatsushima71_2000.jpg/960px-Nachikatsuura-kinomatsushima71_2000.jpg",
      "cap": "Pine islets off Katsuura"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Onsen_in_Nachikatsuura%2C_Japan.jpg/960px-Onsen_in_Nachikatsuura%2C_Japan.jpg",
      "cap": "A seaside hot-spring bath at Katsuura"
    }
  ]
},
{
  id: "shirahama",
  name: "Shirahama",
  jp: "白浜",
  region: "Nanki-Shirahama · Wakayama",
  type: "stay",
  days: "Days 6–7 · 2 nights",
  legMiles: 54,
  lat: 33.6853, lng: 135.3378, zoom: 13,
  tagline: "A white-sand resort coast, panda safaris and seaside hot springs.",
  intro: [
    "Rounding the southern tip of the Kii Peninsula, the coast softens into <b>Shirahama</b> (\"white beach\") — one of the <b>three oldest hot-spring resorts in Japan</b>, soaked in long enough to appear in the 8th-century <i>Nihon Shoki</i> chronicles, when emperors travelled here to bathe. Its crescent of dazzling white quartz sand (partly replenished with imported Australian sand) and turquoise water gives it a near-tropical feel. The ride in passes the photogenic line of sea pillars at <b>Hashigui-iwa</b> in Kushimoto and the sheer <b>Sandanbeki</b> cliffs.",
    "It's the trip's first proper rest base: a beach, open-air onsen perched right over the Pacific surf, and <b>Adventure World</b> — a hugely popular zoo–safari–marine park that has successfully bred more giant pandas than anywhere outside China, with a drive-through safari and dolphin shows that make it the single biggest kid magnet of the whole loop. A relaxed, sunny pause before the ferry to Shikoku."
  ],
  highlights: [
    "<b>Adventure World</b> — giant pandas, a drive-through \"Safari World\" of lions and giraffes, plus dolphins and a marine park — easily a full, joyful day for a 6-year-old",
    "<b>Shirarahama beach</b> — brilliant white sand and gentle, shallow swimming, glowing at sunset",
    "<b>Sakino-yu onsen</b> — a rock-cut open-air bath right at the surf line, in use for 1,300+ years; waves crash a few metres below as you soak",
    "<b>Sandanbeki</b> — dramatic 50–60 m sea cliffs with an elevator down to a <b>sea cave</b> once used to hide pirate boats",
    "<b>Senjōjiki</b> — a vast tilted \"1,000-tatami\" rock platform sculpted by the waves, fun to clamber on",
    "<b>Engetsu Island</b> — the \"round-moon\" islet pierced by a natural sea arch; the classic Shirahama sunset shot",
    "<b>Hashigui-iwa</b> (en route at Kushimoto) — a 850 m row of ~40 pillar rocks marching out to sea toward Ōshima island",
    "*<i>Kushimoto — Turkish Memorial & the </i>Ertuğrul<i> story<b> (en route) — on </b>Ōshima</i><i> island off Japan's southernmost mainland cape, a museum tells how Kushimoto villagers rescued survivors of the wrecked Ottoman frigate </i>Ertuğrul<i> in 1890 — the founding moment of Japan–Turkey friendship, marked by a memorial and (filmed as </i>Ertuğrul 1890*). A genuinely distinctive history stop on a scenery-heavy coast",
    "<b>Kushimoto Marine Park</b> (en route) — <b>Japan's first marine park (1970)</b>, with an aquarium and an <b>undersea observation tower</b> out over the reef — a good child stop near Hashigui-iwa",
    "<b>Tore-Tore Ichiba</b> — one of western Japan's biggest seafood market halls; watch a tuna-cutting show, then eat"
  ],
  food: [
    {
      "n": "Maguro & kaisen-don",
      "d": "fresh local tuna and heaped seafood rice bowls at Tore-Tore market; catch the tuna-filleting demo."
    },
    { "n": "Kumano-gyū / wagyū", "d": "Wakayama-raised beef, grilled teppanyaki-style at the resort inns." },
    {
      "n": "Ise-ebi (spiny lobster)",
      "d": "the Kii coast's prized clawless lobster, in season from autumn — often the centrepiece of a ryokan kaiseki."
    },
    {
      "n": "Umeboshi & ume products",
      "d": "Nanki ume plums in everything from sweets to umeshu; this is Japan's plum heartland."
    },
    { "n": "Mikan citrus", "d": "Wakayama's famous mandarins and fresh juices." }
  ],
  hotels: [
    {
      "n": "Shirahama Onsen ryokan (e.g. Musashi, Kaishū)",
      "t": "Onsen ryokan",
      "d": "Traditional tatami inns near Shirarahama beach with their own hot-spring baths and kaiseki dinners; family rooms.",
      "park": "Free on-site parking",
      "price": "¥22,000–45,000"
    },
    {
      "n": "Hotel Kawakyu",
      "t": "Luxury landmark",
      "d": "A fairytale European-style resort over the bay — a special-night splurge; easy parking.",
      "park": "On-site lot / valet",
      "price": "¥45,000–120,000"
    },
    {
      "n": "SHIRAHAMA KEY TERRACE Hotel Seamore",
      "t": "Resort hotel",
      "d": "Cliff-top hotel with infinity onsen over the sea and family rooms, if you'd rather a modern resort.",
      "park": "Free on-site parking",
      "price": "¥20,000–45,000"
    }
  ],
  links: [
    { "l": "Nanki-Shirahama tourism (official)", "u": "https://nanki-shirahama.com/en/" },
    { "l": "Adventure World (official)", "u": "https://www.aws-s.com/" },
    {
      "l": "Turkish Memorial Museum, Kushimoto (Visit Wakayama)",
      "u": "https://visitwakayama.jp/en/attractions/detail_680.html"
    },
    { "l": "Wikipedia — Shirahama, Wakayama", "u": "https://en.wikipedia.org/wiki/Shirahama,_Wakayama" }
  ],
  photos: [
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/131221_Shirarahama_Beach_Shirahama_Wakayama_pref_Japan02s5.jpg/960px-131221_Shirarahama_Beach_Shirahama_Wakayama_pref_Japan02s5.jpg",
      "cap": "Shirarahama's white-sand beach"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/131221_Shirarahama_Beach_Shirahama_Wakayama_pref_Japan05s3.jpg/960px-131221_Shirarahama_Beach_Shirahama_Wakayama_pref_Japan05s3.jpg",
      "cap": "The resort shoreline at Shirahama"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/131221_Sandanbeki_Shirahama_Wakayama_pref_Japan01bs5.jpg/960px-131221_Sandanbeki_Shirahama_Wakayama_pref_Japan01bs5.jpg",
      "cap": "The Sandanbeki sea cliffs"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Nanki_Shirahama_Sandanbeki_20190503.jpg/960px-Nanki_Shirahama_Sandanbeki_20190503.jpg",
      "cap": "Sandanbeki dropping to the Pacific"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/131221_Engetsu_Island_Shirahama_Wakayama_pref_Japan01s3.jpg/960px-131221_Engetsu_Island_Shirahama_Wakayama_pref_Japan01s3.jpg",
      "cap": "Engetsu Island's natural sea arch"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Shirahama_Engetsu_Island_03.jpg/960px-Shirahama_Engetsu_Island_03.jpg",
      "cap": "The \"round-moon\" island at Shirahama"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Panda_Adventure_World_Shirahama.JPG/960px-Panda_Adventure_World_Shirahama.JPG",
      "cap": "A giant panda at Adventure World"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Adventure_World%2C_Shirahama%2C_Japan_%28476931221%29.jpg/960px-Adventure_World%2C_Shirahama%2C_Japan_%28476931221%29.jpg",
      "cap": "Adventure World safari and marine park"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/180429_Hashiguiiwa_Kushimoto_Wakayama_pref_Japan02bs.jpg/960px-180429_Hashiguiiwa_Kushimoto_Wakayama_pref_Japan02bs.jpg",
      "cap": "Hashigui-iwa rocks at Kushimoto (en route)"
    }
  ]
},
{
  id: "tokushima",
  name: "Tokushima & Naruto",
  jp: "徳島・鳴門",
  region: "Tokushima · Shikoku",
  type: "stop",
  days: "Day 8",
  legMiles: 91,
  lat: 34.1722, lng: 134.6093, zoom: 12,
  tagline: "A ferry across the strait, then the great whirlpools of Naruto.",
  intro: [
    "This is the loop's pivot from Honshu to Shikoku. Rather than backtrack through Osaka, the day rides up to <b>Wakayama Port</b> and crosses the strait on the <b>Nankai Ferry</b> to <b>Tokushima</b> — a roughly <b>2¼-hour</b> sailing that doubles as a restful break and a small adventure for the child. The bikes ride straight on and off.",
    "Landing in Tokushima puts you beside <b>Naruto</b>, where colossal tidal whirlpools churn under the Ōnaruto Bridge — viewed from the glass-floored <b>Uzunomichi</b> walkway or a sightseeing boat. An easy overnight by the strait sets up the gentle climb into the Iya gorges next day."
  ],
  highlights: [
    "<b>Uzunomichi</b> — a 450 m walkway out under the Ōnaruto Bridge with a <b>glass floor 45 m above the whirlpools</b> — you stand right over the churning water (a thrill, and safe for a child)",
    "<b>Naruto sightseeing boats</b> — the <i>Wonder Naruto</i> and the smaller <i>Aqua Eddy</i> (with an underwater observation room) run right up to the vortices",
    "<b>Ōnaruto Bridge</b> panoramas from Magosaki Cape / Naruto Park — the strait is one of the world's three great tidal races",
    "<b>Ōtsuka Museum of Art</b> — Japan's largest display space, filled with <b>full-size ceramic reproductions</b> of 1,000+ world masterpieces (the Sistine Chapel ceiling, the Mona Lisa, Monet's water lilies outdoors) that you may photograph and even touch — vast and surprisingly kid-friendly",
    "<b>Ryōzen-ji (Temple #1)</b> — the start of the 88-temple Shikoku pilgrimage, where white-clad <i>henro</i> set out; a gentle cultural stop near the ferry",
    "<b>Awa Odori</b> — Tokushima's exuberant summer dance; the <b>Awa Odori Kaikan</b> runs live shows year-round and a ropeway up Mt. Bizan behind it",
    "<b>Awa indigo (aizome) & Wakimachi Udatsu</b> — Tokushima is the heart of Japanese natural indigo and one of the only places left still growing and fermenting it into <i>sukumo</i>. On the Day-10 ride up the Yoshino River, the preserved Edo merchant street of <b>Udatsu in Wakimachi (Mima)</b> — an important national preservation district built on the indigo trade — has <b>hands-on aizome workshops</b> where you dye your own scarf, handkerchief or eco-bag in deep \"Japan Blue.\" A memorable craft for the whole family <i>(reserve ahead; confirm hours and child participation)</i>"
  ],
  food: [
    {
      "n": "Naruto-dai (sea bream)",
      "d": "firm, lean bream muscled by the fierce tidal strait — Naruto's prize fish, superb as sashimi."
    },
    {
      "n": "Tokushima ramen",
      "d": "a dark, sweet-savoury pork-bone-and-soy broth, classically topped with sweet stewed pork belly and a raw egg cracked on top; eaten with rice on the side. This is stop 2 on the trip's Ramen Trail — the marquee bowl is at Chūka Soba Inotani (中華そば いのたに) in Tokushima City, the shop most credited with the style."
    },
    { "n": "Naruto wakame", "d": "prized seaweed grown in the churning straits, springy and deep green." },
    {
      "n": "Sudachi",
      "d": "Tokushima's tart green citrus (it grows almost nowhere else), squeezed over fish, noodles and even into drinks."
    },
    { "n": "Imo / Naruto kintoki sweet potato", "d": "the local golden-fleshed sweet potato, roasted or in sweets." }
  ],
  hotels: [
    {
      "n": "Ryokan Kōen Mizuno (Naruto)",
      "t": "Onsen ryokan",
      "d": "Traditional inn with tatami rooms, onsen baths and sea views over the Naruto straits; futons for a child.",
      "park": "Free on-site parking",
      "price": "¥18,000–35,000"
    },
    {
      "n": "Kadoya Tsubakisō / Otoriien (Naruto)",
      "t": "Pilgrim ryokan",
      "d": "Century-old tatami inns by Ryōzen-ji (Temple #1) — simple, warm and very traditional.",
      "park": "Free on-site parking",
      "price": "¥14,000–24,000"
    },
    {
      "n": "AoAwo / Renaissance Naruto Resort",
      "t": "Resort hotel",
      "d": "Modern seaside onsen resort with bay views near the bridge, if you'd rather a resort night.",
      "park": "Free on-site parking",
      "price": "¥20,000–45,000"
    }
  ],
  links: [
    { "l": "Nankai Ferry (Wakayama–Tokushima, official)", "u": "https://nankai-ferry.co.jp/" },
    { "l": "Tokushima / Naruto tourism (official)", "u": "https://discovertokushima.net/en/" },
    {
      "l": "Udatsu Townscape, Wakimachi (Discover Tokushima)",
      "u": "https://discovertokushima.net/en/spots/udatsu-townscape/"
    },
    {
      "l": "Awa indigo dyeing workshop, Udatsu (Nishi-Awa Tourism)",
      "u": "https://nishi-awa.jp/english/reserve/2009/"
    },
    { "l": "Wikipedia — Naruto, Tokushima", "u": "https://en.wikipedia.org/wiki/Naruto,_Tokushima" },
    { "l": "Wikipedia — Whirlpools of Naruto", "u": "https://en.wikipedia.org/wiki/Whirlpools_of_Naruto" }
  ],
  photos: [
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Naruto_whirlpools_20170609-1.jpg/960px-Naruto_whirlpools_20170609-1.jpg",
      "cap": "The tidal whirlpools of Naruto"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Naruto_whirlpools_20170609-2.jpg/960px-Naruto_whirlpools_20170609-2.jpg",
      "cap": "Whirlpools churning under the bridge"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Naruto_Whirlpools_taken_4-21-2008.jpg/960px-Naruto_Whirlpools_taken_4-21-2008.jpg",
      "cap": "A whirlpool at full spring tide"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Onaruto-bridge_and_Naruto_Channel%2CNaruto-city%2CJapan.JPG/960px-Onaruto-bridge_and_Naruto_Channel%2CNaruto-city%2CJapan.JPG",
      "cap": "The Ōnaruto Bridge over the strait"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Aerial_view_of_Onaruto_Bridge.jpg/960px-Aerial_view_of_Onaruto_Bridge.jpg",
      "cap": "Ōnaruto Bridge from the air"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Awa-odori_2008_Tokushima.jpg/960px-Awa-odori_2008_Tokushima.jpg",
      "cap": "Tokushima's Awa Odori dance"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Awa_Odori_Tokushima_City_so-odori.jpg/960px-Awa_Odori_Tokushima_City_so-odori.jpg",
      "cap": "Awa Odori so-odori finale"
    }
  ]
},
{
  id: "iya",
  name: "Iya Valley / Oboke",
  jp: "祖谷渓",
  region: "Shikoku mountains",
  type: "stay",
  days: "Days 9–10 · 2 nights",
  legMiles: 69,
  lat: 33.889, lng: 133.812, zoom: 12,
  tagline: "Vine bridges, deep gorges and one of Japan's hidden valleys.",
  intro: [
    "The Iya Valley is one of Japan's <b>\"three hidden valleys\"</b> — a remote, mist-wrapped gorge in the mountainous heart of Shikoku, so cut off that, by legend, <b>survivors of the defeated Heike (Taira) clan fled here after losing the Genpei War in 1185</b> and hid for generations. Gentle paved mountain roads climb above the emerald <b>Yoshino River</b>, past terraced hamlets clinging to near-vertical slopes — the kind of deep rural Japan that has all but vanished elsewhere.",
    "Two nights at a valley onsen ryokan gives a true rural pause: the famous vine bridge, a gorge boat ride, riverside open-air baths reached by private cable-car, and slow mountain evenings far from any city. It's a place to do very little, which suits the child and the newer rider perfectly."
  ],
  highlights: [
    "<b>Iya-no-Kazurabashi vine bridge</b> — a 45 m bridge woven from live mountain <i>shirakuchi</i> vine, rebuilt every three years; legend says the Heike built such bridges so they could cut them down if pursued. You cross slowly over the gorge through gaps in the slats — a genuine thrill (hold a small child's hand)",
    "<b>Oboke & Koboke Gorge</b> — a sightseeing boat threads the jade Yoshino River between sculpted schist cliffs; the <b>Lapis Oboke</b> museum at the gorge has a quirky <i>yōkai</i> (monster) folklore exhibit kids enjoy",
    "<b>Iya-no-Shōben-kozō (\"Peeing Boy\") statue</b> — a small bronze boy mid-pee on a cliff edge 200 m above the river, marking where local children once dared each other; a memorable photo stop",
    "<b>Nagoro Scarecrow Village</b> — a depopulated hamlet where one resident has made <b>hundreds of life-size straw dolls</b>, now seated at school desks, bus stops and fields — eerie, poignant and oddly delightful for children",
    "<b>Oku-Iya double vine bridges & \"wild monkey\" cart</b> — deeper in the valley, a \"husband-and-wife\" pair of vine bridges with a hand-pulled cable cart over the river (note: the deep-valley access roads narrow — keep to the main paved routes with the child)",
    "<b>Hinoji-kei viewpoint</b> — the river bending in a perfect figure-of-\"hi\" curve far below"
  ],
  food: [
    {
      "n": "Iya soba",
      "d": "short, rough-cut 100% buckwheat noodles grown on the steep slopes; nuttier and more rustic than lowland soba, served hot or cold."
    },
    {
      "n": "Dekomawashi",
      "d": "skewers of potato, konnyaku and tofu coated in sweet miso and slowly turned over an irori hearth fire; the valley's signature snack."
    },
    {
      "n": "Ayu / amego",
      "d": "sweetfish and red-spotted trout from the clear gorge streams, salt-grilled whole on skewers by the hearth."
    },
    { "n": "Soba-gome zōsui", "d": "a buckwheat-grain rice porridge, Heike-era comfort food unique to Iya." }
  ],
  hotels: [
    {
      "n": "Hotel Iya Onsen",
      "t": "Gorge onsen ryokan",
      "d": "Clings to the cliff; a private cable-car descends 170 m to open-air baths by the river — a highlight in itself. Tatami rooms, futons for a child.",
      "park": "Free on-site parking",
      "price": "¥28,000–60,000"
    },
    {
      "n": "Hotel Kazurabashi (Shin-Iya Onsen)",
      "t": "Onsen ryokan",
      "d": "Hilltop baths reached by a short cable-car, steps from the Kazurabashi; half-board kaiseki.",
      "park": "Free parking (Yume-Butai deck by the vine bridge)",
      "price": "¥28,000–60,000"
    },
    {
      "n": "Chiiori / Tōgenkyō-Iya thatched farmhouses",
      "t": "Restored kominka (farmhouse)",
      "d": "Alex Kerr's restored 300-year-old thatched farmhouse (and sister cottages) for a unique whole-house rural night around an open hearth.",
      "park": "On-site / dedicated lot (confirm)",
      "price": "¥20,000–45,000"
    }
  ],
  links: [
    { "l": "Tokushima / Iya tourism", "u": "https://discovertokushima.net/en/" },
    { "l": "Wikipedia — Iya Valley", "u": "https://en.wikipedia.org/wiki/Iya_Valley" }
  ],
  photos: [
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Iya_Kazurabashi-4.jpg/960px-Iya_Kazurabashi-4.jpg",
      "cap": "Kazurabashi vine bridge"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Bridge_over_Yoshino-gawa_%286453471533%29.jpg/960px-Bridge_over_Yoshino-gawa_%286453471533%29.jpg",
      "cap": "Bridge over Yoshino-gawa"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Iya_Valley_a.jpeg/960px-Iya_Valley_a.jpeg",
      "cap": "Iya Valley a"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Oboke_and_Yoshino-gawa_river_%286453466931%29.jpg/960px-Oboke_and_Yoshino-gawa_river_%286453466931%29.jpg",
      "cap": "Oboke and Yoshino-gawa river"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Iya_vine_bridge_%286551507515%29.jpg/960px-Iya_vine_bridge_%286551507515%29.jpg",
      "cap": "Iya vine bridge"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Tokushima_Miyoshi_Oboke_Gorge_Of_Yoshino_River_2.JPG/960px-Tokushima_Miyoshi_Oboke_Gorge_Of_Yoshino_River_2.JPG",
      "cap": "Tokushima Miyoshi Oboke Gorge Of Yoshino River"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/150503_Biwa_Falls_Iya_Valley_Miyoshi_Tokushima_pref_Japan01s3.jpg/960px-150503_Biwa_Falls_Iya_Valley_Miyoshi_Tokushima_pref_Japan01s3.jpg",
      "cap": "150503 Biwa Falls Iya Valley Miyoshi Tokushima pref"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Crab_crawling_around_in_the_hills_of_Iya_Valley_%286453587885%29.jpg/960px-Crab_crawling_around_in_the_hills_of_Iya_Valley_%286453587885%29.jpg",
      "cap": "Crab crawling around in the hills of Iya Valley"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Iya-Onsen_Hotel%2CTokushima%281%29_-_panoramio.jpg/960px-Iya-Onsen_Hotel%2CTokushima%281%29_-_panoramio.jpg",
      "cap": "Iya-Onsen Hotel,Tokushima"
    }
  ]
},
{
  id: "kochi",
  name: "Kochi",
  jp: "高知",
  region: "Shikoku south coast",
  type: "stop",
  days: "Day 11",
  legMiles: 37,
  lat: 33.5597, lng: 133.5311, zoom: 13,
  tagline: "Pacific shores, a perfectly preserved castle and big southern flavour.",
  intro: [
    "Kōchi faces the open Pacific on Shikoku's south coast, capital of the old <b>Tosa</b> domain and famously warm-hearted, easygoing and fond of a drink. Its castle is one of only <b>twelve in Japan with an original Edo-period keep</b> — and the only one where both the keep <i>and</i> the lord's palace (the <i>honmaru goten</i>) survive together. Tosa was the crucible of the Meiji Restoration: local samurai <b>Sakamoto Ryōma</b> brokered the alliance that toppled the shogunate in 1868, and his statue still gazes out to sea at Katsurahama.",
    "Coming down from the Iya mountains, the river valleys open out to the sea — a satisfying riding day ending with a castle, a beach, and the buzz of <b>Hirome Market</b>, a covered hall of food stalls where strangers share tables over seared bonito and local sake."
  ],
  highlights: [
    "<b>Kōchi Castle</b> — climb the original 1747 keep for valley views; the surviving palace rooms below show how a feudal lord actually lived",
    "<b>Anpanman Museum</b> (Yanase Takashi Memorial Hall, Kami) — the home town museum of <b>Japan's most beloved toddler superhero</b>, created by Kōchi-born Takashi Yanase; a near-guaranteed delight for a 6-year-old, ~40 min east of the city",
    "<b>Shikoku Automobile Museum</b> (四国自動車博物館, Kōnan) — a small private museum just east of the city in <b>Kōnan</b>, ~6 km past the Anpanman stop and on the same Day-12 approach into Kōchi: <b>~30 motorcycles and ~30 cars</b> of the 1960s–80s, classics and race machines including Honda and Yamaha bikes and a few rarities. An easy 30–45 min for a moto family. <b>Open Wed–Sun 10:00–16:00; closed Mon AND Tue</b> (open if a national holiday lands on those days); ¥800 adult, ¥300 child, under-6 free",
    "<b>Katsurahama</b> — a crescent Pacific beach (look-don't-swim — strong currents) with the Ryōma statue, a small shrine on the rocks, and the <b>Katsurahama Aquarium</b>",
    "<b>Hirome Market</b> — a raucous covered food hall where you watch <b>katsuo</b> seared over straw flames and eat it minutes later at shared tables",
    "<b>Sunday Market (Nichiyō-ichi)</b> — a 300+ year-old street market running ~1 km along Otesuji, with knives, plants, yuzu and <i>imo-tenpura</i>",
    "<b>Chikurin-ji & Makino Botanical Garden</b> — a hilltop pilgrimage temple (Temple #31) and the garden of pioneering botanist Tomitaro Makino on Mt. Godai"
  ],
  food: [
    {
      "n": "Katsuo no tataki",
      "d": "the soul dish of Kōchi: skipjack tuna seared hard over burning rice straw so it's charred outside and rare within, sliced thick and eaten with garlic, salt or ponzu. Watch it flame at Hirome Market."
    },
    {
      "n": "Sawachi-ryōri",
      "d": "Tosa's party style: huge communal platters piled with sashimi, sushi and local delicacies, meant to be shared while drinking."
    },
    {
      "n": "Yuzu",
      "d": "Kōchi grows most of Japan's yuzu citrus; it flavours ponzu, drinks, sweets and the local gomadōfu."
    },
    {
      "n": "Tosa jiro chicken & nabeyaki-ramen",
      "d": "a prized free-range chicken, and (near Susaki on the Day-13 ride) a ramen served bubbling in a clay pot with a raw egg."
    }
  ],
  hotels: [
    {
      "n": "Jyoseikan",
      "t": "Historic onsen ryokan",
      "d": "Founded 1874, has hosted the imperial family; tatami rooms, kaiseki/sawachi dinners, and a rooftop onsen overlooking Kōchi Castle. The traditional pick.",
      "park": "Free private on-site parking",
      "price": "¥28,000–60,000"
    },
    {
      "n": "The Crown Palais New Hankyu Kōchi",
      "t": "Family-friendly hotel",
      "d": "Large rooms near the station with parking, if you'd rather a Western room for the family.",
      "park": "On-site garage / lot — confirm bike handling",
      "price": "¥18,000–35,000"
    },
    {
      "n": "Richmond Hotel Kōchi",
      "t": "Practical hotel",
      "d": "Comfortable, central and reliable; ask which lot takes a motorcycle.",
      "park": "Nearby contract lot — confirm",
      "price": "¥14,000–24,000"
    }
  ],
  links: [
    { "l": "Visit Kochi Japan (official)", "u": "https://visitkochijapan.com/en" },
    { "l": "Anpanman Museum / Yanase Takashi Memorial Hall (official)", "u": "https://anpanman-museum.net/" },
    {
      "l": "Shikoku Automobile Museum (official, \"Love Mota! Kochi\")",
      "u": "https://lovemota.vistanet.co.jp/museum/"
    },
    { "l": "Wikipedia — Kochi", "u": "https://en.wikipedia.org/wiki/Kochi,_Kochi" }
  ],
  photos: [
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Kochi_Castle08s3872.jpg/960px-Kochi_Castle08s3872.jpg",
      "cap": "Kochi Castle"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Kami_Kochi_Yanase_Takashi_Memorial_Hall.jpg/960px-Kami_Kochi_Yanase_Takashi_Memorial_Hall.jpg",
      "cap": "Anpanman Museum (Yanase Takashi Memorial Hall), Kami"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Itagaki_Taisuke_dozo_seiso.jpg/960px-Itagaki_Taisuke_dozo_seiso.jpg",
      "cap": "Itagaki Taisuke dozo seiso"
    },
    { "src": "https://upload.wikimedia.org/wikipedia/commons/b/b2/Katsurahama%2C_2005.jpg", "cap": "Katsurahama" },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Harimaya-bashi_%286453595247%29.jpg/960px-Harimaya-bashi_%286453595247%29.jpg",
      "cap": "Harimaya-bashi"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/0/02/Katsurahama_Beach.jpg",
      "cap": "Katsurahama Beach"
    },
    { "src": "https://upload.wikimedia.org/wikipedia/commons/d/d0/Harimayabashi-1.jpg", "cap": "View" },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Katsurahama_ryugu_bridge.jpg/960px-Katsurahama_ryugu_bridge.jpg",
      "cap": "Katsurahama ryugu bridge"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Kochi_Harimaya-bashi_Bridge.jpeg/960px-Kochi_Harimaya-bashi_Bridge.jpeg",
      "cap": "Kochi Harimaya-bashi Bridge"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Katsurahama_wadatsumi_shrine.jpg/960px-Katsurahama_wadatsumi_shrine.jpg",
      "cap": "Katsurahama wadatsumi shrine"
    }
  ]
},
{
  id: "shimanto",
  name: "Shimanto River",
  jp: "四万十川",
  region: "Shikoku west",
  type: "stay",
  days: "Days 12–13 · 2 nights",
  legMiles: 66,
  lat: 32.9914, lng: 132.9338, zoom: 12,
  tagline: "Japan's 'last clear stream' and its low submersible bridges.",
  intro: [
    "The Shimanto is celebrated as *<i>Japan's last clear stream (</i>saigo no seiryū<i>)<b> — the longest river in Shikoku and the only major one with no large dam on its main stem, so it still runs broad, clean and free past rice paddies, cedar hills and the distinctive </b>chinkabashi<b> (\"sinking bridges\"). These low, deliberately </b>railless</i><i> concrete bridges are designed to let floodwater wash </i>over* them rather than sweep them away — there are 47 of them along the river, and crossing one is a quiet highlight.",
    "Two nights by the river is the trip's most rural, slowed-down pause: canoeing on glass-clear water, riverside cycling and birdsong-and-water countryside time that is ideal for the child and the newer rider alike. Day-14 has the option of a longer run down to dramatic <b>Cape Ashizuri</b>, the granite southern tip of Shikoku."
  ],
  highlights: [
    "<b>Chinkabashi \"sinking bridges\"</b> — the railless low bridges that duck under floods; the long <b>Sada</b> and <b>Sata</b> bridges are the most photogenic, and you can walk or gently ride across",
    "*<i>Canoeing, SUP or a </i>yakatabune<i> river boat</i>* — calm, shallow stretches make the Shimanto one of Japan's best beginner paddling rivers; traditional roofed boats glide down past the bridges",
    "<b>Riverside cycling</b> — flat, quiet lanes along the water with easy swimming holes in summer; bikes rent at the michi-no-eki",
    "<b>Cape Ashizuri (Ashizuri-misaki)</b> — Shikoku's wild granite southern point, a white lighthouse over Pacific cliffs and the pilgrimage temple <b>Kongōfuku-ji</b> (Temple #38); a fine longer Day-14 ride",
    "<b>Tatsukushi coast</b> (on the Day-13 ride in) — bizarre wave-eroded rock formations and a glass-bottom boat over coral",
    "<b>Tosa washi paper-making, Ino-cho</b> (on the Day-13 ride in) — the <b>Ino-cho Paper Museum</b> on the clear <b>Niyodo River</b> lets you <b>make your own postcards or a sheet of Tosa washi</b>, one of Japan's three great handmade papers, by the traditional <i>nagashizuki</i> method (¥400, ~30–40 min) — a hands-on craft hit for a child. <i>Closed Mondays (Tue if Mon is a holiday)</i>",
    "<b>Michi-no-eki Tōwa & tea hamlets</b> — roadside stations selling river <i>aonori</i>, tea and <i>ayu</i> — good regroup stops"
  ],
  food: [
    {
      "n": "Ayu (sweetfish)",
      "d": "the river's signature catch, threaded on a skewer and salt-grilled whole; its faint melon scent is prized. In autumn, ochiayu (falling sweetfish) are at their best."
    },
    {
      "n": "Tennen unagi (wild river eel)",
      "d": "line-caught wild eel from the Shimanto, richer than farmed; a true delicacy grilled kabayaki."
    },
    {
      "n": "Aonori",
      "d": "fragrant green river seaweed harvested from the estuary, dried into crisp tempura, sprinkled on rice, or in tenpura."
    },
    { "n": "Tsugani (river crab)", "d": "small autumn mitten-crabs simmered into a deeply savoury soup." },
    {
      "n": "Susaki nabeyaki ramen (on the Day-13 ride in) — stop 3 on the trip's Ramen Trail: a thin soy-chicken broth served bubbling in an earthenware donabe clay pot with chikuwa, green onion and a raw egg, kept piping hot. The marquee shop in Susaki is Hashimoto Shokudō (橋本食堂) (alt: Mayumi-no-Mise).",
      "d": ""
    }
  ],
  hotels: [
    {
      "n": "Shimanto-no-Yado",
      "t": "Riverside onsen ryokan",
      "d": "A small onsen ryokan in a riverside park; some rooms with private open-air baths, a garden and local-catch dinners. The traditional pick.",
      "park": "Free on-site parking",
      "price": "¥18,000–38,000"
    },
    {
      "n": "Riverside minshuku & guesthouses (e.g. Nagaoka, Shimanto-gawano-eki)",
      "t": "Rural family inn",
      "d": "Friendly home-style inns along the valley with river views and home cooking; tatami and futons for a child.",
      "park": "Free on-site parking",
      "price": "¥12,000–25,000"
    },
    {
      "n": "Shimanto-gawa Hotel Bell-Reef",
      "t": "Family-friendly hotel",
      "d": "Comfortable riverside-near-estuary hotel with parking, if you'd rather a Western room for two nights.",
      "park": "Free on-site parking",
      "price": "¥18,000–35,000"
    }
  ],
  links: [
    { "l": "Shimanto City tourism", "u": "https://www.shimanto-kankou.com/" },
    {
      "l": "Ino-cho Paper Museum — Tosa washi (official, JapanTravel/Adventure)",
      "u": "https://www.japan.travel/en/sports/adventure/activities/ino-cho-paper-museum/"
    },
    { "l": "Wikipedia — Shimanto River", "u": "https://en.wikipedia.org/wiki/Shimanto_River" }
  ],
  photos: [
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Shimanto_River_%285279082249%29.jpg/960px-Shimanto_River_%285279082249%29.jpg",
      "cap": "The Shimanto River"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Shimanto_River_And_Iwama_Bridge_1.jpg/960px-Shimanto_River_And_Iwama_Bridge_1.jpg",
      "cap": "Shimanto River And Iwama Bridge"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Yodo_Line_and_Shimanto_river.JPG/960px-Yodo_Line_and_Shimanto_river.JPG",
      "cap": "Yodo Line and Shimanto river"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Sagawa-bridge%2CShimanto-cho%2CJapan.JPG/960px-Sagawa-bridge%2CShimanto-cho%2CJapan.JPG",
      "cap": "Sagawa-bridge,Shimanto-cho,Japan"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Shimanto-iwama.jpg/960px-Shimanto-iwama.jpg",
      "cap": "Shimanto-iwama"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/ShimantoRiverFromNakabaRestarea.JPG/960px-ShimantoRiverFromNakabaRestarea.JPG",
      "cap": "ShimantoRiverFromNakabaRestarea"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Shimanto_River_And_Shimanto_River_Bridge_1.JPG/960px-Shimanto_River_And_Shimanto_River_Bridge_1.JPG",
      "cap": "Clear waters of the Shimanto"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/f/f0/Nishitosa_Shimanto_river.jpg",
      "cap": "Nishitosa Shimanto river"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Shimanto-river_%E5%9B%9B%E4%B8%87%E5%8D%81%E5%B7%9D%E8%8B%A5%E4%BA%95%E6%B2%88%E4%B8%8B%E6%A9%8B1010070.JPG/960px-Shimanto-river_%E5%9B%9B%E4%B8%87%E5%8D%81%E5%B7%9D%E8%8B%A5%E4%BA%95%E6%B2%88%E4%B8%8B%E6%A9%8B1010070.JPG",
      "cap": "Shimanto-river"
    }
  ]
},
{
  id: "uwajima",
  name: "Uchiko / Uwajima",
  jp: "宇和島",
  region: "Ehime south",
  type: "stop",
  days: "Day 14",
  legMiles: 41,
  lat: 33.2233, lng: 132.5606, zoom: 13,
  tagline: "An original castle and a preserved merchant town en route north.",
  intro: [
    "Heading up Shikoku's west coast toward Matsuyama, two worthwhile stops break the Day-15 ride. <b>Uwajima</b>, a former castle town of the Date clan, keeps one of Japan's <b>twelve original castle keeps</b> — a small, beautifully proportioned 1666 tower on a wooded hill. <b>Uchiko</b> is a superbly preserved street of Edo–Meiji merchant houses that grew rich on <b>vegetable wax (mokurō)</b>, their façades washed in the distinctive ochre-yellow plaster of the trade.",
    "These are easy, rewarding half-day stops — real history and quiet old streets without the crowds of the famous towns — on a relaxed transfer day up to Dōgo Onsen."
  ],
  highlights: [
    "<b>Uwajima Castle</b> — climb to the compact, all-original 1666 keep for sea-and-town views; one of only twelve such keeps left in Japan",
    "<b>Uchiko Yōkaichi Old Street</b> — a 600 m run of ochre-walled wax-merchant houses (the grand <b>Kami-Haga residence</b> has a wax-making museum) — atmospheric and stroller-easy",
    "<b>Uchiko-za</b> — a fully restored <b>1916 kabuki theatre</b> with a revolving stage and trap doors you can tour backstage",
    "<b>Garyū Sansō, Ōzu</b> — an exquisite riverside villa of teahouse craftsmanship above the Hiji River (a fine stop between the two towns)",
    "<b>Tensha-en garden & Date Museum, Uwajima</b> — a samurai stroll garden and the Date clan's treasures",
    "<b>Note for families:</b> Uwajima also has the eyebrow-raising <b>Taga-jinja fertility shrine</b> — easily skipped with a child"
  ],
  food: [
    {
      "n": "Taimeshi (Uwajima style)",
      "d": "fresh sea-bream sashimi marinated in a raw-egg, soy and dashi sauce, then poured over hot rice; quite different from Matsuyama's cooked-together version (try both)."
    },
    {
      "n": "Jakoten",
      "d": "small fried cakes of whole minced \"trash\" fish (bones and all), a savoury Ehime snack eaten hot off the griddle."
    },
    { "n": "Satsuma-jiru", "d": "a Uwajima miso soup of grilled fish paste over barley rice, poured tableside." },
    {
      "n": "Mikan",
      "d": "Ehime is Japan's #1 citrus prefecture; roadside stands sell mandarins and fresh juice all along the coast."
    }
  ],
  hotels: [
    {
      "n": "_Usually ridden through → sleep at Dōgo Onsen_",
      "t": "Note",
      "d": "Day 14 ends at Matsuyama/Dōgo, a 2-night onsen base (see next stop)."
    },
    {
      "n": "Uchiko machiya inns (e.g. Kibako, Orinasu)",
      "t": "Restored machiya",
      "d": "Small restored wax-merchant houses for a quiet traditional night if you split the ride.",
      "park": "On-site / nearby town lot (confirm)",
      "price": "¥18,000–40,000"
    }
  ],
  links: [
    { "l": "Ehime tourism (official)", "u": "https://www.iyokannet.jp/en/" },
    { "l": "Wikipedia — Uwajima Castle", "u": "https://en.wikipedia.org/wiki/Uwajima_Castle" }
  ],
  photos: [
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Uwajima-jo.JPG/960px-Uwajima-jo.JPG",
      "cap": "Uwajima Castle"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Uchiko-za_%286454001047%29.jpg/960px-Uchiko-za_%286454001047%29.jpg",
      "cap": "Uchiko-za"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Uchiko_Theatre.jpg/960px-Uchiko_Theatre.jpg",
      "cap": "Uchiko Theatre"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Ehime_Bank_Uwajima_Branch_Uwajima-Shimmachi_Sub-branch.jpg/960px-Ehime_Bank_Uwajima_Branch_Uwajima-Shimmachi_Sub-branch.jpg",
      "cap": "Ehime Bank Uwajima Branch Uwajima-Shimmachi Sub-branch"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Kashima_Island%2C_Uwajima_Ehime_Aerial_photograph.2019.jpg/960px-Kashima_Island%2C_Uwajima_Ehime_Aerial_photograph.2019.jpg",
      "cap": "Kashima Island, Uwajima Ehime Aerial"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Uwajima_Bay.JPG/960px-Uwajima_Bay.JPG",
      "cap": "Uwajima Bay"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Uwajima_Port_Joint_Government_Building.jpg/960px-Uwajima_Port_Joint_Government_Building.jpg",
      "cap": "Uwajima Port Joint Government Building"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Uwajima_Station%2C_platform.jpg/960px-Uwajima_Station%2C_platform.jpg",
      "cap": "Uwajima Station, platform"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Uwajima_post-office.jpg/960px-Uwajima_post-office.jpg",
      "cap": "Uwajima post-office"
    }
  ]
},
{
  id: "dogo",
  name: "Dogo Onsen / Matsuyama",
  jp: "道後温泉",
  region: "Ehime · Matsuyama",
  type: "stay",
  days: "Days 14–15 · 2 nights",
  legMiles: 55,
  lat: 33.8519, lng: 132.7866, zoom: 14,
  tagline: "One of Japan's oldest hot springs beneath a hilltop castle.",
  intro: [
    "Matsuyama is Shikoku's largest city, crowned by one of Japan's twelve <b>original castle keeps</b>, with the ancient <b>Dōgo Onsen</b> at its edge — a hot spring mentioned in the 8th-century <i>Man'yōshū</i> and said to be among the <b>oldest in Japan, used for 3,000 years</b>. The landmark <b>Honkan</b> bathhouse (1894), a three-storey warren of wooden stairs, a private imperial bathing room and a <i>Botchan</i>-novel literary legend, is widely cited as an inspiration for the bathhouse in Studio Ghibli's <i>Spirited Away</i>. Bathe like a local: pay at the door, soak in the <i>Kami-no-yu</i>, then take green tea and a rice cracker in the tatami lounge upstairs.",
    "Two nights here balance city comforts (laundry, dining, a proper room) with a classic onsen evening, and the gentle nostalgia of the <b>Botchan train</b> — a restored steam-style streetcar named for Natsume Sōseki's 1906 novel set in Matsuyama. A fitting reward before the Shimanami Kaidō."
  ],
  highlights: [
    "<b>Dōgo Onsen Honkan</b> — soak in the 1894 wooden bathhouse, a designated Important Cultural Property; pick the basic \"Kami-no-yu\" ticket or the tatami-lounge package with tea and dango",
    "<b>Matsuyama Castle</b> — ride a <b>ropeway or single-seat chairlift</b> up Katsuyama hill to a rare hilltop original keep with sweeping city-and-sea views; the climb and lift are a kid favourite",
    "<b>Botchan Ressha</b> — a coal-black, steam-style heritage tram that trundles between Dōgo and the city centre",
    "<b>Dōgo Haikara-dōri arcade</b> — a covered shopping street of onsen sweets, citrus, crafts and the <b>Botchan Karakuri clock</b> that performs on the hour",
    "<b>Ishite-ji</b> — an atmospheric, slightly mysterious pilgrimage temple (Temple #51) with a two-storey gate, a pagoda and a cave tunnel of statues",
    "<b>Asuka-no-Yu</b> — a newer annex bathhouse beside the Honkan, decorated in lavish Asuka-period style, with private family baths bookable (handy with a child)"
  ],
  food: [
    {
      "n": "Taimeshi (Matsuyama style)",
      "d": "a whole sea bream cooked together with the rice in a clay pot, the fish lifted out and flaked back through; the cooked counterpart to Uwajima's raw version."
    },
    {
      "n": "Botchan dango",
      "d": "three-colour (green tea, egg, red bean) sweet dumplings on a skewer, named for the Sōseki novel; the classic post-bath treat."
    },
    { "n": "Jakoten", "d": "fried minced-fish cakes, an Ehime staple, good with local sake." },
    {
      "n": "Mikan everything",
      "d": "Ehime citrus as juice (some stations have a \"mikan juice tap\"), jelly and soft-serve."
    },
    { "n": "Tai-meshi onigiri & sea-bream broth", "d": "quick versions sold around the arcade." }
  ],
  hotels: [
    {
      "n": "Funaya",
      "t": "Historic onsen ryokan",
      "d": "A 390-year-old Dōgo inn that has hosted the imperial family; hot-spring baths, a Japanese garden, tatami family rooms.",
      "park": "Free on-site parking",
      "price": "¥28,000–60,000"
    },
    {
      "n": "Dōgo Onsen Yamatoya Honten",
      "t": "Onsen ryokan",
      "d": "Grand traditional inn ~5 min from the Honkan, with a Noh stage and large cypress baths.",
      "park": "Private on-site parking (small extra charge)",
      "price": "¥28,000–55,000"
    },
    {
      "n": "Dōgo-kan",
      "t": "Onsen ryokan",
      "d": "Landmark inn (architect Kishō Kurokawa) blending tradition with comfort; spacious for a family.",
      "park": "Free on-site parking",
      "price": "¥28,000–60,000"
    }
  ],
  links: [
    { "l": "Dogo Onsen (official)", "u": "https://dogo.jp/en/" },
    { "l": "Wikipedia — Dogo Onsen", "u": "https://en.wikipedia.org/wiki/D%C5%8Dgo_Onsen" }
  ],
  photos: [
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Dogo_Onsen_Honkan_%28Main_building%29%2C_%E9%81%93%E5%BE%8C%E6%B8%A9%E6%B3%89_%E6%9C%AC%E9%A4%A8_-_panoramio.jpg/960px-Dogo_Onsen_Honkan_%28Main_building%29%2C_%E9%81%93%E5%BE%8C%E6%B8%A9%E6%B3%89_%E6%9C%AC%E9%A4%A8_-_panoramio.jpg",
      "cap": "Dogo Onsen Honkan bathhouse"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/MEIN%26SMALL_CASTLE_TOWER_%2CMATSUYAMA_CASTLE%28IYO%29.JPG/960px-MEIN%26SMALL_CASTLE_TOWER_%2CMATSUYAMA_CASTLE%28IYO%29.JPG",
      "cap": "MEIN&SMALL CASTLE TOWER ,MATSUYAMA CASTLE(IYO)"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Botchan-ressha.jpg/960px-Botchan-ressha.jpg",
      "cap": "Botchan-ressha"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Dogo_onsen_honkan_long_exposure.jpg/960px-Dogo_onsen_honkan_long_exposure.jpg",
      "cap": "Dogo onsen honkan long exposure"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Marunouchi%2C_Matsuyama%2C_Ehime_Prefecture_790-0008%2C_Japan_-_panoramio_%2893%29.jpg/960px-Marunouchi%2C_Matsuyama%2C_Ehime_Prefecture_790-0008%2C_Japan_-_panoramio_%2893%29.jpg",
      "cap": "Marunouchi, Matsuyama, Ehime Prefecture 790-0008, Japan - panor…"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Botchan-train%28Matsuyama_City%29.JPG/960px-Botchan-train%28Matsuyama_City%29.JPG",
      "cap": "Botchan-train(Matsuyama City)"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Matsuyama_Castle_1906.jpg/960px-Matsuyama_Castle_1906.jpg",
      "cap": "Matsuyama Castle"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Botchan_Train_at_Dogo_Onsen_Station.jpg/960px-Botchan_Train_at_Dogo_Onsen_Station.jpg",
      "cap": "Botchan Train at Dogo Onsen Station"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Stone_sign%2C_Matsuyama_Castle%2C_Matsuyama%2C_Ehime_-_Sep_23%2C_2011.jpg/960px-Stone_sign%2C_Matsuyama_Castle%2C_Matsuyama%2C_Ehime_-_Sep_23%2C_2011.jpg",
      "cap": "Stone sign, Matsuyama Castle, Matsuyama, Ehime - Sep"
    }
  ]
},
{
  id: "shimanami",
  name: "Shimanami Kaido",
  jp: "しまなみ海道",
  region: "Seto Inland Sea",
  type: "stop",
  days: "Day 16",
  legMiles: 36,
  lat: 34.11, lng: 133.01, zoom: 11,
  tagline: "Island-hopping across the Seto Inland Sea by a chain of great bridges.",
  intro: [
    "The <b>Shimanami Kaidō</b> (the Nishiseto Expressway) links Shikoku (<b>Imabari</b>) to Honshu (<b>Onomichi</b>) by hopping <b>six islands</b> of the Seto Inland Sea on a chain of <b>seven spectacular bridges</b> — among them the world's <b>first triple suspension bridge</b>. It's world-famous as a cycling route, but on a motorcycle it is just as magical: long, gently graded sweeps high over a sea dotted with green islands, fishing boats and <i>tai</i> nets, blue water on both sides.",
    "It is gentle, scenic and unforgettable riding — well-surfaced, never technical, with frequent island pull-offs — and rightly the <b>highlight ride of the whole tour</b> for the family. Each island has its own character: citrus groves on Ōshima, the great shrine on Ōmishima, salt and shipbuilding on Hakatajima, lemons and a gilded temple on Ikuchijima."
  ],
  highlights: [
    "<b>Kurushima-Kaikyō Bridge</b> — a <b>4 km triple suspension span</b> (the world's first) over the fast Kurushima strait; the <b>Kirōsan Observatory</b> above it gives the classic aerial-style panorama of the bridges marching across the sea",
    "<b>Imabari Castle</b> — a rare <b>sea-water-moat castle</b> flushed by the tides, with the keep reflected in the saltwater",
    "<b>Imabari towel craft</b> — Imabari is <b>Japan's towel capital</b> (~120 years, the country's leading producer). See the craft at the free walk-in <b>Imabari Towel LAB</b> by the port (browse and learn) or the larger <b>Towel Museum ICHIHIRO</b> (watch the looms run, a Moomin gallery, and a make-your-own-towel corner) — a soft, hands-on regional craft that suits a small child before the bridges <i>Confirm the towel-museum detour fits the riding window; the LAB is the lighter stop</i>",
    "<b>Ōyamazumi Shrine (Ōmishima)</b> — the head shrine of all Japan's mountain/sea/war gods, under a ~2,600-year-old sacred camphor tree, holding the country's <b>largest collection of historic samurai armour and swords</b> (much of it National Treasure grade)",
    "<b>Tatara Bridge</b> — a graceful 1,480 m cable-stayed span; the roadside station beneath has a \"whispering gallery\" spot at the tower base",
    "<b>Setoda, Ikuchijima</b> — lemon groves, lemon gelato, and the dazzling, slightly outrageous <b>Kōsan-ji</b> temple with its marble \"Hill of Hope\" (covered on the Onomichi/Setoda stop)",
    "<b>Cycling/walking the bridge approaches</b> — even a short out-and-back on foot over a span is a thrill with a child"
  ],
  food: [
    {
      "n": "Imabari yakibuta-tamago-meshi",
      "d": "sweet-savoury roast pork and a fried egg over rice, Imabari's hearty signature bowl."
    },
    {
      "n": "Hakata-no-shio (sea salt)",
      "d": "famous salt sun-dried on Hakatajima, turned into salt ramen, salt soft-serve and even salt cake."
    },
    {
      "n": "Setouchi tai (sea bream)",
      "d": "firm Inland-Sea bream as tai-meshi or sashimi; the calm sea is Japan's bream heartland."
    },
    { "n": "Octopus (tako)", "d": "muscular Inland-Sea octopus, grilled or over rice." },
    { "n": "Setoda lemons & citrus", "d": "eaten as gelato, cake and fresh juice along the islands." }
  ],
  hotels: [
    {
      "n": "_Ride day → sleep at Onomichi/Setoda_",
      "t": "Note",
      "d": "Most cross the Kaidō and overnight at the next 2-night base."
    },
    {
      "n": "WAKKA (Ōmishima)",
      "t": "Cyclist-friendly boutique",
      "d": "A relaxed seaside stay mid-route with cottages and a café, if splitting the ride.",
      "park": "Free on-site parking",
      "price": "¥20,000–40,000"
    },
    {
      "n": "Azumi Setoda (Ikuchijima)",
      "t": "Restored-machiya luxury ryokan",
      "d": "A 140-year-old merchant estate reborn as a ryokan on the Setoda waterfront — see the Onomichi/Setoda stop.",
      "park": "Free on-site parking",
      "price": "¥80,000–250,000"
    }
  ],
  links: [
    { "l": "Shimanami Kaido (official)", "u": "https://shimanami-cycle.or.jp/global/" },
    {
      "l": "Towel Museum ICHIHIRO, Imabari (Visit Ehime)",
      "u": "https://www.visitehimejapan.com/en/things-to-do/spots/0015/"
    },
    { "l": "Wikipedia — Nishiseto Expressway", "u": "https://en.wikipedia.org/wiki/Nishiseto_Expressway" }
  ],
  photos: [
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Kurushima-Kaikyo_Bridge%2C_Seto_Inland_Sea%2C_Japan.jpg/960px-Kurushima-Kaikyo_Bridge%2C_Seto_Inland_Sea%2C_Japan.jpg",
      "cap": "Kurushima-Kaikyo Bridge"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Stele_of_Tatara_Bridge_in_Roadside_Station_%22Imabari_City_Tatara_Shimanami_Park%22.jpg/960px-Stele_of_Tatara_Bridge_in_Roadside_Station_%22Imabari_City_Tatara_Shimanami_Park%22.jpg",
      "cap": "Stele of Tatara Bridge in Roadside Station 'Imabari City Tatara…"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Onomichi_Station_Pier_of_Mukaishima_Ferry_2.jpg/960px-Onomichi_Station_Pier_of_Mukaishima_Ferry_2.jpg",
      "cap": "Onomichi Station Pier of Mukaishima Ferry"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Shimanami_Kaido_Bikeway_%2814089291941%29.jpg/960px-Shimanami_Kaido_Bikeway_%2814089291941%29.jpg",
      "cap": "Shimanami Kaido Bikeway"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Tatara-gridge201310.JPG/960px-Tatara-gridge201310.JPG",
      "cap": "View"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Kurushima-Kaiky%C5%8D_Bridge_2012-04-07.JPG/960px-Kurushima-Kaiky%C5%8D_Bridge_2012-04-07.JPG",
      "cap": "Kurushima-Kaikyō"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Kurushima-Kaikyo_Bridge_310040.jpg/960px-Kurushima-Kaikyo_Bridge_310040.jpg",
      "cap": "The great spans over the sea"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Kurushima-Kaikyo_Bridge_310054.jpg/960px-Kurushima-Kaikyo_Bridge_310054.jpg",
      "cap": "Island-hopping route"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Kurushima-Kaikyo-Bridge.jpg/960px-Kurushima-Kaikyo-Bridge.jpg",
      "cap": "Kurushima-Kaikyo-Bridge"
    }
  ]
},
{
  id: "onomichi",
  name: "Onomichi / Setoda",
  jp: "尾道",
  region: "Hiroshima coast",
  type: "stay",
  days: "Days 16–17 · 2 nights",
  legMiles: 32,
  lat: 34.409, lng: 133.205, zoom: 14,
  tagline: "A hillside temple town and lemon-scented islands.",
  intro: [
    "Onomichi is a nostalgic port town of steep stone lanes, hillside temples and famously photogenic cats, draped over slopes that drop straight to a narrow channel of the Seto Inland Sea at the Honshu end of the Shimanami Kaidō. Loved by novelists and film-makers (Ozu shot <i>Tokyo Story</i> partly here), it has a <b>Path of Literature</b> of inscribed stones winding up the hill, a chair-and-cable ropeway to a temple-crowned summit, and a <b>25-temple walk</b> threaded through cats, cafés and old houses.",
    "Nearby <b>Setoda</b> on <b>Ikuchijima</b> island is famous for <b>lemons</b> (Japan's leading domestic producer), gelato and the dazzling, gilt-and-marble temple of <b>Kōsan-ji</b>. Two nights here is a relaxed coastal pause among islands and old streets — and a chance to ride more of the Kaidō at leisure."
  ],
  highlights: [
    "<b>Senkō-ji & ropeway</b> — ride the cable-car up for the classic view over the red Onomichi bridges and the channel, then walk down through the temple's vermilion halls and the \"rock of literature\" boulders",
    "<b>Temple Walk & cat alley</b> — a way-marked loop past ~25 temples and the <b>Neko-no-Hosomichi</b> (\"cat lane\"), strewn with painted cat stones and real cats sunning on walls",
    "<b>Kōsan-ji (Setoda)</b> — a riotously ornate temple a priest built for his mother, with a hand-carved gate, a cave \"hell-and-heaven\" walk-through, and the <b>Miraishin-no-Oka \"Hill of Hope\"</b>, a hilltop of gleaming white Italian marble",
    "<b>Setoda lemon groves & Shimanami sea-view cafés</b> — citrus stands, gelato and waterfront coffee on Ikuchijima",
    "<b>Kōsoji & the old waterfront streets</b> — Onomichi's atmospheric shopping arcade and harbour, easy and flat with a child",
    "<b>Day-18 option:</b> ride out onto the nearer Kaidō islands (Innoshima, Ikuchijima) for more bridge sweeps without committing to the full crossing"
  ],
  food: [
    {
      "n": "Onomichi ramen",
      "d": "a clear soy-tare chicken-and-seafood broth studded with little nuggets of *pork-back fat (sengaki) and flat noodles; a defining regional bowl and the finale of the trip's Ramen Trail. Eat it at the classic old-school Tsutafuji (つたふじ); the legendary Shūkaen (朱華園, est. 1947) closed in 2019, but its flavour continues at the founder's-family successor Shu (朱), and Maruboshi (丸ぼし)* is the town's most-reviewed bowl."
    },
    {
      "n": "Setoda lemons",
      "d": "lemon gelato, lemon cake, hassaku and lemon soda everywhere on the islands; the hassaku-daifuku (citrus-and-bean mochi) is a local treat."
    },
    {
      "n": "Anago (conger eel)",
      "d": "Inland-Sea conger, grilled over rice as anago-meshi — lighter and sweeter than unagi."
    },
    {
      "n": "Setouchi oysters & small fish",
      "d": "the calm sea is rich in oysters (autumn–winter) and kohada-type fish."
    }
  ],
  hotels: [
    {
      "n": "Azumi Setoda (Ikuchijima)",
      "t": "Restored-machiya luxury ryokan",
      "d": "A 140-year-old salt-merchant estate reborn as a ryokan, with its own across-the-street bathhouse — a destination in itself, and easy bike parking.",
      "park": "Free on-site parking",
      "price": "¥80,000–250,000"
    },
    {
      "n": "Onomichi Guest House Miharashi-tei",
      "t": "Historic machiya guesthouse",
      "d": "A 100-year-old hillside villa with channel views and huge character — but the steep step-climb makes it hard with a 6-year-old and gear; consider only light-packed.",
      "park": "<b>No vehicle access</b> — park at the <b>Senkōji-shita / Nagae public lot</b> (~¥600/day) and climb ~370 steps",
      "price": "¥7,000–14,000"
    },
    {
      "n": "Onomichi U2 / Hotel Cycle",
      "t": "Waterfront design hotel",
      "d": "A converted harbour warehouse built for two-wheel travellers; the practical, parking-easy base for the family.",
      "park": "On-site / adjacent lot — very bike & cycle friendly",
      "price": "¥18,000–35,000"
    }
  ],
  links: [
    { "l": "Onomichi tourism (official)", "u": "https://www.ononavi.jp/global/en/" },
    { "l": "Wikipedia — Onomichi", "u": "https://en.wikipedia.org/wiki/Onomichi" }
  ],
  photos: [
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Onomichi_%2851806057842%29.jpg/960px-Onomichi_%2851806057842%29.jpg",
      "cap": "Onomichi hillside town"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Onomichi_Bridge_and_Onomichi_Channel_from_Main_Hall_of_Senkoji_Temple_2.jpg/960px-Onomichi_Bridge_and_Onomichi_Channel_from_Main_Hall_of_Senkoji_Temple_2.jpg",
      "cap": "Onomichi Bridge and Onomichi Channel from Main Hall of Senkoji…"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/From_the_sky_%2C_%E4%BD%90%E6%9C%A8%E5%B3%B6%E4%B8%8A%E7%A9%BA%E3%81%8B%E3%82%89_-_panoramio.jpg/960px-From_the_sky_%2C_%E4%BD%90%E6%9C%A8%E5%B3%B6%E4%B8%8A%E7%A9%BA%E3%81%8B%E3%82%89_-_panoramio.jpg",
      "cap": "From the sky , 佐木島上空から"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Onomichi_Bridge_and_Shin-Onomichi_Bridge_from_Senkoji_Temple_2.jpg/960px-Onomichi_Bridge_and_Shin-Onomichi_Bridge_from_Senkoji_Temple_2.jpg",
      "cap": "Onomichi Bridge and Shin-Onomichi Bridge from Senkoji Temple"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Higashitsuchidocho%2C_Onomichi%2C_Hiroshima_Prefecture_722-0033%2C_Japan_-_panoramio_%284%29.jpg/960px-Higashitsuchidocho%2C_Onomichi%2C_Hiroshima_Prefecture_722-0033%2C_Japan_-_panoramio_%284%29.jpg",
      "cap": "Higashitsuchidocho, Onomichi, Hiroshima Prefecture 722-0033, Ja…"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Stele_of_Senkoji_Temple_in_Senkoji_Park.jpg/960px-Stele_of_Senkoji_Temple_in_Senkoji_Park.jpg",
      "cap": "Stele of Senkoji Temple in Senkoji Park"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/%E5%B0%BE%E9%81%93_Onomachi_-_panoramio.jpg/960px-%E5%B0%BE%E9%81%93_Onomachi_-_panoramio.jpg",
      "cap": "尾道 Onomachi"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/View_of_Onomichi_Channel_and_Mukaishima_Island_near_Senkoji_Temple_3.jpg/960px-View_of_Onomichi_Channel_and_Mukaishima_Island_near_Senkoji_Temple_3.jpg",
      "cap": "View of Onomichi Channel and Mukaishima Island near Senkoji Temple"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/View_of_Onomichi_Bridge_and_Shin-Onomichi_Bridge_near_Bell_Tower_of_Senkoji_Temple_2.jpg/960px-View_of_Onomichi_Bridge_and_Shin-Onomichi_Bridge_near_Bell_Tower_of_Senkoji_Temple_2.jpg",
      "cap": "View of Onomichi Bridge and Shin-Onomichi Bridge near Bell Towe…"
    }
  ]
},
{
  id: "kurashiki",
  name: "Kurashiki",
  jp: "倉敷",
  region: "Okayama",
  type: "stop",
  days: "Day 18",
  legMiles: 41,
  lat: 34.5957, lng: 133.7718, zoom: 14,
  tagline: "A willow-lined canal quarter of white-walled storehouses.",
  intro: [
    "The plan settles on <b>Kurashiki</b>. Its Bikan historical quarter preserves white-walled Edo storehouses along a willow-fringed canal — now galleries, cafes, boat rides and the celebrated <b>Ohara Museum of Art</b>, Japan's first Western-art museum. It's compact, walkable and easy with a child, and the day's ride in calls at <b>Tomonoura</b>, the harbour that inspired <i>Ponyo</i>.",
    "<b>Naoshima as an optional add-a-day:</b> if the family wants the contemporary-art islands, add a night near Takamatsu/Uno and take the ferry to Naoshima (Benesse House, the Chichu Museum, Yayoi Kusama's pumpkin). It's a wonderful detour but a full extra day with ferry timing — treat it as an add-on, not a same-day swap."
  ],
  highlights: [
    "<b>Kurashiki Bikan historical quarter</b> — white-walled, black-tiled <i>kura</i> storehouses mirrored in a willow-lined canal; glide it on a <b>flat-bottomed boat</b> poled by a boatman in <i>happi</i> coat — a hit with a child",
    "<b>Ōhara Museum of Art</b> — <b>Japan's first museum of Western art</b> (1930), built by a local mill magnate; it holds real El Greco, Monet, Gauguin and Matisse in a little canal town — astonishing and compact",
    "<b>Tomonoura</b> — the <i>Ponyo</i> harbour town (on the Day-19 ride in): the iconic stone <i>gangi</i> jetty, the old <i>jōyatō</i> lighthouse, and the seaside house where <b>Miyazaki stayed and sketched</b> the film",
    "<b>Ivy Square</b> — a romantic red-brick former cotton mill (1889) now a courtyard of ivy, cafés and craft workshops",
    "<b>Momotarō / Achi-jinja & local legend</b> — Okayama is the land of the <b>Momotarō \"Peach Boy\"</b> folk tale; kibi-dango sweets and Momotarō imagery are everywhere",
    "_Optional add-a-day:_ <b>Naoshima</b> art island (via Takamatsu/Uno ferry — Benesse House, the Chichū Museum, Yayoi Kusama's pumpkin); <b>Ritsurin Garden</b> in Takamatsu"
  ],
  food: [
    {
      "n": "Mamakari (sappa)",
      "d": "a small sardine-like fish marinated in vinegar; the Okayama name jokes that it's so good you'll borrow rice from a neighbour to finish it."
    },
    {
      "n": "Bara-zushi (Okayama-zushi)",
      "d": "a lavish scattered-sushi bowl heaped with seafood and vegetables, a festive local dish."
    },
    {
      "n": "Kibi-dango",
      "d": "soft millet-and-mochi dumplings tied to the Momotarō legend; the classic Okayama souvenir sweet."
    },
    {
      "n": "Okayama fruit",
      "d": "the \"Land of Sunshine\" is famed for white peaches and Muscat of Alexandria grapes; try them fresh or as parfaits in season."
    },
    { "n": "Sanuki udon", "d": "firm, springy udon if you carry on toward Kagawa (Japan's udon capital)." }
  ],
  hotels: [
    {
      "n": "Ryori Ryokan Tsurugata",
      "t": "Machiya ryokan (1774)",
      "d": "A 1770s merchant house right on the canal, tatami rooms, in-room kaiseki; the most authentic Bikan night.",
      "park": "Tight free back-lane lot — <b>very narrow approach</b>; better to use a nearby coin lot",
      "price": "¥28,000–55,000"
    },
    {
      "n": "Ryokan Kurashiki",
      "t": "Converted-storehouse ryokan",
      "d": "Beautiful kura storehouses on the canal; tatami and futons suit a child. Confirm which lot takes a motorcycle.",
      "park": "No easy door parking — nearby municipal coin lot (~150–300 m)",
      "price": "¥30,000–60,000"
    },
    {
      "n": "Kurashiki Kokusai Hotel",
      "t": "Nice hotel (Bikan-edge)",
      "d": "A handsome mid-century hotel by the old quarter with its own parking, if you'd rather an easy-park base with a Western room.",
      "park": "On-site lot — easiest parking",
      "price": "¥18,000–35,000"
    }
  ],
  links: [
    { "l": "Kurashiki tourism (official)", "u": "https://www.kurashiki-tabi.jp/en/" },
    { "l": "Tomonoura / Fukuyama tourism (official)", "u": "https://www.fukuyama-kanko.com/" },
    { "l": "Wikipedia — Kurashiki", "u": "https://en.wikipedia.org/wiki/Kurashiki" },
    { "l": "Wikipedia — Tomonoura", "u": "https://en.wikipedia.org/wiki/Tomonoura" }
  ],
  photos: [
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Kurashiki_Bikan_-02.jpg/960px-Kurashiki_Bikan_-02.jpg",
      "cap": "Kurashiki Bikan canal quarter"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Tomonoura_Gangi.jpg/960px-Tomonoura_Gangi.jpg",
      "cap": "Tomonoura's historic stone jetty (the Ponyo harbour)"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Tomonoura_viewed_from_Taishiden.jpg/960px-Tomonoura_viewed_from_Taishiden.jpg",
      "cap": "Tomonoura bay viewed from the hillside"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Kurashiki_Canal_Area.jpg/960px-Kurashiki_Canal_Area.jpg",
      "cap": "Kurashiki Canal Area"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/080727_Ohara_Museum_of_Art_Kurashiki_Okayama_pref_Japan01s3.jpg/960px-080727_Ohara_Museum_of_Art_Kurashiki_Okayama_pref_Japan01s3.jpg",
      "cap": "Ohara Museum of Art Kurashiki Okayama pref"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/211203_Kurashiki_Ivy_Square_Kurashiki_Okayama_pref_Japan01s3.jpg/960px-211203_Kurashiki_Ivy_Square_Kurashiki_Okayama_pref_Japan01s3.jpg",
      "cap": "Kurashiki Ivy Square Kurashiki Okayama pref"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Edvard_Munch_-_Madonna_-_Google_Art_Project_%28495100%29.jpg/960px-Edvard_Munch_-_Madonna_-_Google_Art_Project_%28495100%29.jpg",
      "cap": "Edvard Munch - Madonna - Google Art Project"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Okayama_prfectural_Kurashiki_Seiryo_high_school.jpg/960px-Okayama_prfectural_Kurashiki_Seiryo_high_school.jpg",
      "cap": "Okayama prfectural Kurashiki Seiryo high school"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/%E5%80%89%E6%95%B7%E5%B7%9D_Kurashike_Canal_-_panoramio.jpg/960px-%E5%80%89%E6%95%B7%E5%B7%9D_Kurashike_Canal_-_panoramio.jpg",
      "cap": "倉敷川 Kurashike Canal"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/161015_At_Kurashiki_Bikan_historical_quarter_Kurashiki_Okayama_pref_Japan01s3.jpg/960px-161015_At_Kurashiki_Bikan_historical_quarter_Kurashiki_Okayama_pref_Japan01s3.jpg",
      "cap": "161015 At Kurashiki Bikan historical quarter Kurashiki Okayama pref…"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Fire_lookout_tower%2C_Kurashiki_Bikan_historical_quarter_-_Aug_11%2C_2014.jpg/960px-Fire_lookout_tower%2C_Kurashiki_Bikan_historical_quarter_-_Aug_11%2C_2014.jpg",
      "cap": "Fire lookout tower, Kurashiki Bikan historical quarter - Aug"
    }
  ]
},
{
  id: "himeji",
  name: "Himeji / Kobe",
  jp: "姫路",
  region: "Hyogo",
  type: "stop",
  days: "Day 19",
  legMiles: 104,
  lat: 34.8394, lng: 134.6939, zoom: 14,
  tagline: "Japan's most magnificent castle, then into cosmopolitan Kobe.",
  intro: [
    "<b>Himeji Castle — the \"White Heron\" (Shirasagi-jō)</b> — is Japan's finest surviving feudal castle and one of its first UNESCO World Heritage sites: a brilliant-white hilltop complex of a six-storey main keep, three lesser keeps and a maze of gates, completed in <b>1609 and never burned or besieged</b>, so it is original timber and plaster, not a reconstruction. The dazzling white comes from fire-resistant lime plaster over the walls and roof joints; the spiralling approach was designed to confuse attackers, and finding the way up with a child is half the fun. Its 2009–2015 restoration left it gleaming.",
    "From Himeji it's a short hop into <b>Kobe</b>, a stylish port city — opened to foreigners in 1868 — famous for its beef, its hillside <b>Kitano</b> district of Western \"ijinkan\" merchant houses, a glittering harbour nightscape and a relaxed international feel. A comfortable night before the final flourish: Day-21's loop across the Akashi Kaikyō Bridge to Awaji and back to Osaka."
  ],
  highlights: [
    "<b>Bizen-yaki pottery town, Imbe</b> (en route on Route 2) — the kiln village of <b>Imbe in Bizen City</b>, home of <b>Bizen ware</b>, one of Japan's <i>six ancient kilns</i>: rustic, unglazed, wood-fired stoneware made here ~1,000 years. Stroll the brick-chimney streets, see the <b>Bizen / Bizen City Museum of Art</b> (closed Mon), and book a short beginner <b>hand-shaping workshop</b> (10–40 min) for a cup or bowl fired and posted home — a hands-on craft that breaks up a castle day. <i>Reserve a studio ahead; confirm under-6 participation.</i> Sword enthusiasts can instead stop at the nearby <b>Bizen Osafune Sword Museum</b> (live smithing/polishing demos on Sundays; closed Mon)",
    "<b>Himeji Castle</b> — climb the original keep's steep timber stairs to the top floor (mind the head-height for adults), and hunt for the castle's <i>ishigaki</i> stone walls, hidden gun-ports and the \"Okiku's well\" ghost legend",
    "<b>Kōko-en</b> — nine walled Edo-style gardens beside the castle (1992) with carp ponds, a tea house and a maple valley; a calm counterpoint to the keep",
    "<b>Kobe Harborland & Meriken Park</b> — a waterfront of the red Port Tower, a Ferris wheel, the <i>BE KOBE</i> sign and harbour cruises",
    "<b>Kawasaki Good Times World</b> — Kawasaki Heavy Industries' corporate museum at Meriken Park (entered through the Kobe Maritime Museum): sit-on motorcycles and Jet Skis, a Shinkansen 0-series driver's cab, a Bell helicopter, rail and aerospace exhibits and robots — a hands-on, thematically perfect ~1.5–2 h stop for a family on a motorcycle tour. Open Tue–Sun 10:00–17:00 (last entry 16:30), closed Mondays; entry via the Maritime Museum combined ticket (≈¥900 adult / ¥400 child). Easiest as a <b>Day-21 morning</b> visit before riding out to Awaji — park at the Meriken Park paid lot and confirm secure motorcycle parking on arrival",
    "<b>Kitano ijinkan</b> — the steep lane of preserved Western merchant mansions above Kobe, fun to wander",
    "<b>Mt. Rokkō / Maya \"ten-million-dollar\" night view</b> — one of Japan's three great city nightscapes, by ropeway/cable car above Kobe",
    "<b>Nada sake district</b> (Kobe) — Japan's biggest sake-brewing quarter, with free brewery museums"
  ],
  food: [
    {
      "n": "Kobe beef",
      "d": "the world-famous, intensely marbled Tajima wagyū; the classic treat is teppanyaki, seared at a counter before you (a splurge — lunch sets are gentler on the wallet)."
    },
    {
      "n": "Akashiyaki (tamago-yaki)",
      "d": "soft, egg-rich octopus dumplings from neighbouring Akashi, dipped in warm dashi rather than sauce — the ancestor of takoyaki."
    },
    {
      "n": "Sobameshi",
      "d": "a Kobe working-town comfort dish of chopped yakisoba noodles fried together with rice on the griddle."
    },
    { "n": "Anago-meshi", "d": "conger eel over rice, an Inland-Sea/Akashi favourite." },
    {
      "n": "Himeji oden & almond toast",
      "d": "Himeji eats its oden with ginger-soy dip; Kobe's kissaten cafés serve thick almond-butter toast."
    }
  ],
  hotels: [
    {
      "n": "Wabisabi Himeji (Kōminya machiya)",
      "t": "Restored Meiji machiya",
      "d": "A Meiji-era townhouse in Himeji's traditional-buildings preservation district, modernised but full of old-house character — a self-contained family stay near the castle.",
      "park": "Reserved space in a <b>nearby gravel lot (1 space/room)</b>",
      "price": "¥20,000–45,000 (whole house)"
    },
    {
      "n": "Yumoto Ueyama Ryokan (Himeji)",
      "t": "Onsen ryokan",
      "d": "A traditional inn with a 300-year-old natural hot spring; tatami rooms and futons for a child, easy parking.",
      "park": "Free private on-site parking",
      "price": "¥18,000–35,000"
    },
    {
      "n": "Kobe Kitano Hotel",
      "t": "Boutique (Kobe)",
      "d": "Charming hotel in Kobe's historic foreign quarter, if you'd rather a harbour-and-beef night in the city.",
      "park": "On-site garage / valet — confirm bike handling",
      "price": "¥20,000–40,000"
    }
  ],
  links: [
    { "l": "Himeji Castle (official)", "u": "https://www.city.himeji.lg.jp/castle/" },
    { "l": "Kawasaki Good Times World (official)", "u": "https://www.khi.co.jp/kawasakiworld/english/" },
    { "l": "Wikipedia — Himeji Castle", "u": "https://en.wikipedia.org/wiki/Himeji_Castle" },
    {
      "l": "Bizen pottery & clay-shaping experience, Imbe (Okayama Tourism)",
      "u": "https://www.okayama-japan.jp/en/18998"
    },
    { "l": "Bizen Osafune Sword Museum (Okayama Tourism)", "u": "https://www.okayama-japan.jp/en/spot/10777" }
  ],
  photos: [
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/Himeji_Castle%2C_November_2016_-02.jpg/960px-Himeji_Castle%2C_November_2016_-02.jpg",
      "cap": "Himeji Castle, the White Heron"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Ch%C3%A2teau_de_Himeji02.jpg/960px-Ch%C3%A2teau_de_Himeji02.jpg",
      "cap": "Château de"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Chrysanthemum_japonense_-_Koko-en_01.jpg/960px-Chrysanthemum_japonense_-_Koko-en_01.jpg",
      "cap": "Chrysanthemum japonense - Koko-en"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Family_picnic%2C_Himeji_Castle_grounds%2C_Himeji%2C_2016.jpg/960px-Family_picnic%2C_Himeji_Castle_grounds%2C_Himeji%2C_2016.jpg",
      "cap": "Family picnic, Himeji Castle grounds, Himeji"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Himeji_Koko-en_Garden_NIK_0898.jpg/960px-Himeji_Koko-en_Garden_NIK_0898.jpg",
      "cap": "Himeji Koko-en Garden NIK"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Sakura_at_Himeji_Castle_in_2013_No%2C01.JPG/960px-Sakura_at_Himeji_Castle_in_2013_No%2C01.JPG",
      "cap": "Sakura at Himeji Castle in"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Himeji_Castle_The_Keep_Towers.jpg/960px-Himeji_Castle_The_Keep_Towers.jpg",
      "cap": "Himeji Castle The Keep Towers"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Himeji_Koukoen32n4592.jpg/960px-Himeji_Koukoen32n4592.jpg",
      "cap": "Himeji"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Throngs_of_people_walking_towards_Himeji_Castle%2C_Himeji%2C_2016.jpg/960px-Throngs_of_people_walking_towards_Himeji_Castle%2C_Himeji%2C_2016.jpg",
      "cap": "Throngs of people walking towards Himeji Castle, Himeji"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Kobe_Maritime_Museum_%26_Kawasaki_GoodTimes_World.jpg/960px-Kobe_Maritime_Museum_%26_Kawasaki_GoodTimes_World.jpg",
      "cap": "Kobe Maritime Museum & Kawasaki Good Times World, Meriken Park"
    }
  ]
},
{
  id: "awaji",
  name: "Awaji Island",
  jp: "淡路島",
  region: "Seto Inland Sea · Hyōgo",
  type: "stop",
  days: "Day 20",
  legMiles: 43,
  lat: 34.45, lng: 134.93, zoom: 11,
  tagline: "A farewell loop across the world's great suspension bridge.",
  intro: [
    "The penultimate day is a scenic flourish rather than a transfer: from Kobe the route crosses the <b>Akashi Kaikyō Bridge</b> — at <b>3,911 m (1,991 m central span)</b> it held the record as the <b>world's longest suspension bridge</b> from 1998 until 2022 — onto <b>Awaji Island</b>, loops its gentle northern coast, then recrosses the bridge and drops into Osaka to finish the journey. Awaji holds a special place in Japanese myth: in the <i>Kojiki</i> creation story it was the <b>first island the gods Izanagi and Izanami made</b>, the birthplace of Japan itself.",
    "Awaji is low-traffic, flower-filled and easy: sweet-onion farms, sea-view roads and a big anime theme park make a relaxed, kid-pleasing last full riding day. Keep it light — the loop is short by design so the family arrives in Osaka unhurried, ready to return the bikes the next day."
  ],
  highlights: [
    "<b>Akashi Kaikyō Bridge</b> — ride the ~4 km span; the <b>Bridge Exhibition Center</b> and michi-no-eki at the Awaji end have the classic photo angle and a model of the build",
    "<b>Nijigen no Mori</b> — an anime theme park in a wooded country park with <b>Naruto, Godzilla (a life-size kaiju you zip-line into!), Crayon Shin-chan and Dragon Quest</b> zones — a big magnet for a 6-year-old",
    "<b>Awaji Hanasajiki</b> — a hillside carpet of seasonal flowers (cosmos and salvia in October) tumbling toward the Inland Sea",
    "<b>Izanagi-jingū</b> — one of Japan's oldest shrines, honouring the island-creating deities, under a 900-year-old sacred camphor \"couple tree\"",
    "<b>Onokoro-jima / Awaji-ningyō puppet theatre</b> — the island's 500-year-old <i>bunraku</i>-style puppet tradition, performed at Awaji Ningyōza",
    "<b>Akashi Park / Maiko Marine Promenade</b> (Kobe side) — a glass-floored catwalk <b>47 m up beneath the bridge towers</b>, looking down at the strait"
  ],
  food: [
    {
      "n": "Awaji beef",
      "d": "premium island wagyū; Awaji-raised calves are a source herd for the famed Kobe and Matsusaka brands — superb at the island's beef restaurants."
    },
    {
      "n": "Awaji onions",
      "d": "extraordinarily sweet, slow-grown onions that star island-wide in onion burgers, onion soup, tempura and even onion soft-serve; a fun kid theme."
    },
    {
      "n": "Sea bream (tai)",
      "d": "from the fast Naruto/Akashi tidal straits, firm and sweet, as sashimi, tai-meshi or tai-somen."
    },
    { "n": "Shirasu-don", "d": "fresh whitebait heaped over rice, a classic Inland-Sea lunch." },
    { "n": "Nuwa / Awaji shirasu & wakame", "d": "the island's prized seaweed and tiny fish." }
  ],
  hotels: [
    {
      "n": "_Day loop → sleep in Osaka_",
      "t": "Note",
      "d": "Day 20 ends in Osaka; Awaji is ridden as a loop, not an overnight in the base plan."
    },
    {
      "n": "Yumekaiyu Awajishima (Sumoto Onsen)",
      "t": "Onsen ryokan",
      "d": "A seaside Sumoto Onsen ryokan with hot-spring baths and Awaji beef & seafood kaiseki; tatami family rooms, if you split the day.",
      "park": "Free on-site parking",
      "price": "¥22,000–45,000"
    },
    {
      "n": "Grand Nikkō Awaji",
      "t": "Resort hotel",
      "d": "A big sea-view resort near the bridge with easy parking, as a modern alternative.",
      "park": "On-site garage / lot",
      "price": "¥18,000–35,000"
    }
  ],
  links: [
    { "l": "Awaji Island tourism", "u": "https://www.awajishima-kanko.jp/en/" },
    { "l": "Nijigen no Mori anime park (official)", "u": "https://nijigennomori.com/" },
    { "l": "Wikipedia — Awaji Island", "u": "https://en.wikipedia.org/wiki/Awaji_Island" },
    { "l": "Wikipedia — Akashi Kaikyō Bridge", "u": "https://en.wikipedia.org/wiki/Akashi_Kaiky%C5%8D_Bridge" }
  ],
  photos: [
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Akashi-Kaikyo_Bridge_h008.jpg/960px-Akashi-Kaikyo_Bridge_h008.jpg",
      "cap": "The Akashi Kaikyō Bridge to Awaji"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Akashi_Bridge.JPG/960px-Akashi_Bridge.JPG",
      "cap": "Crossing onto Awaji Island"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/5/56/Akashi-Kaikyo_Bridge%2C_Japan_%28ASTER%29.jpg",
      "cap": "The bridge linking Kobe and Awaji"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/f/f5/Piers_of_Akashi-Kaikyo_Bridge_approches.jpg",
      "cap": "Under the great bridge towers"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/DSC01488_Akashi-Kaikyo_Bridge_interfior.jpg/960px-DSC01488_Akashi-Kaikyo_Bridge_interfior.jpg",
      "cap": "The span up close"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Awaji_Balcony_flower_in_2013_04.JPG/960px-Awaji_Balcony_flower_in_2013_04.JPG",
      "cap": "Awaji Hanasajiki flower fields"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Awaji_Balcony_flower_in_2013_05.JPG/960px-Awaji_Balcony_flower_in_2013_05.JPG",
      "cap": "Hillside blooms over the Inland Sea"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Awaji_Balcony_flower_in_2013_12.JPG/960px-Awaji_Balcony_flower_in_2013_12.JPG",
      "cap": "Flower beds with sea views on Awaji"
    }
  ]
}
];

window.HOME = { city: "Seattle", airport: "SEA" };
window.FLIGHTS = {
  "intro": "You're starting from Seattle. The motorcycles are an Osaka loop (pick up and return at the Suita base), but the long-haul leg is a simple round-trip nonstop SEA ⇄ Tokyo — then the Tōkaidō Shinkansen (~2h30m) down to Osaka and back. Not an open-jaw / Osaka-airport (KIX) ticket.",
  "season": "Best window: October–early November 2026 (the trip's preferred season). The Osaka riding loop is bracketed by a Tokyo arrival night (Day 0) + a full Tokyo museum day (Day 1) before the Day-2 pickup, and by a Super Nintendo World / USJ day (Day 22) and a reposition-to-Tokyo day (Day 23) before flying home on Day 24 — door-to-door ≈ 25 days (Day 0–24).",
  "legs": [
    {
      "dir": "Outbound",
      "from": "Seattle · SEA",
      "to": "Tokyo · Haneda (HND)",
      "sample": "Sample: depart Fri 9 Oct 2026 → arrive Sat 10 Oct (next day, crossing the date line)",
      "type": "Nonstop",
      "duration": "≈ 10h 30m–11h",
      "airlines": ["ANA", "Delta", "JAL (Narita)"],
      "fareFrom": "$900",
      "note": "Nonstop to Haneda on ANA/Delta (787) or to Narita on JAL. Prefer Haneda — the Keikyu Line reaches Shinagawa (a Shinkansen stop) in ~15 min. A Tokyo arrival night (Day 0) and a full Tokyo museum day (Day 1) precede the Nozomi to Shin-Osaka for the Day-2 bike pickup.",
      "expedia": "https://www.expedia.com/lp/flights/sea/hnd/seattle-to-tokyo",
      "expediaAlt": "https://www.expedia.com/lp/flights/sea/nrt/seattle-to-tokyo"
    },
    {
      "dir": "Return",
      "from": "Tokyo · Haneda (HND)",
      "to": "Seattle · SEA",
      "sample": "Sample: depart ~Wed 4 Nov 2026 (after the Day-23 reposition to Tokyo)",
      "type": "Nonstop",
      "duration": "≈ 9h 30m–10h",
      "airlines": ["ANA", "Delta", "JAL (Narita)"],
      "fareFrom": "$900",
      "note": "Nonstop home — you re-cross the date line and land in Seattle the same calendar day. After the Day-22 USJ day, reposition Osaka→Tokyo by Nozomi on Day 23 (Kyoto sightseeing en route) and overnight near Haneda/Shinagawa for the Day-24 flight.",
      "expedia": "https://www.expedia.com/lp/flights/hnd/sea/tokyo-to-seattle"
    }
  ],
  "estimate": "Round-trip nonstop economy realistically $900–$1,600 per person for October; premium/business considerably more. Add the Shinkansen Tokyo ⇄ Shin-Osaka — about ¥29,000 / ≈$195 round-trip per adult (≈ half for the child). Buy point-to-point Nozomi tickets, not a JR Pass (Nozomi isn't covered by it).",
  "tips": [
    "Book a single round-trip SEA ⇄ Tokyo nonstop ticket — prefer Haneda for the easy train connection.",
    "Buy point-to-point Nozomi Shinkansen tickets (reserved seats together via smartEX) rather than a JR Pass — a mostly-motorcycle trip won't recoup a pass, and Nozomi isn't covered by it anyway.",
    "Forward the big luggage Tokyo→Osaka (and back) by takkyūbin (~¥2,000–2,500/case) so the train legs stay light.",
    "Keep Day 0 as a genuine jet-lag buffer in Tokyo; don't book a same-day onward Nozomi unless everyone's fresh.",
    "Confirm your 1949 Geneva International Driving Permits (category 'A') and motorcycle-riding travel insurance before you fly."
  ],
  "links": [
    {
      "l": "Google Flights — SEA ⇄ Tokyo round-trip",
      "u": "https://www.google.com/travel/flights?q=flights%20round%20trip%20Seattle%20to%20Tokyo"
    },
    { "l": "ANA (SEA–HND)", "u": "https://www.ana.co.jp/en/us/" },
    { "l": "Delta (SEA–HND)", "u": "https://www.delta.com/" },
    { "l": "JAL (SEA–NRT)", "u": "https://www.jal.co.jp/en/" },
    { "l": "smartEX — Tōkaidō Shinkansen reservations", "u": "https://smart-ex.jp/en/" },
    { "l": "Keikyu — Haneda access", "u": "https://www.keikyu.co.jp/visit/" },
    { "l": "Yamato — Ta-Q-Bin luggage forwarding", "u": "https://www.kuronekoyamato.co.jp/ytc/en/" }
  ]
};

/* Day-by-day schedule (Day 0–24). day.html builds a timed routine per day. */
window.DAYS = [
{
    "d": 0,
    "id": "tokyo",
    "miles": 0,
    "rest": true,
    "rail": true,
    "region": "Tokyo",
    "title": "Tokyo Arrival Night",
    "route": "SEA ✈ Tokyo (Haneda) → Shinagawa",
    "desc": "The nonstop SEA→Tokyo flight crosses the date line and lands mid/late afternoon. From Haneda the Keikyu Line reaches Shinagawa in ~15 min — overnight near the station for a gentle jet-lag reset. There's a full Tokyo museum day tomorrow before the train south, so don't forward the luggage yet; an easy dinner and an early night is the plan.",
    "luggage": "Hold the cases tonight — don't forward them yet. A full Tokyo museum day comes first; the bags go ahead to Osaka by takkyūbin only when you leave for the train on Day 2.",
    "tags": ["rest"],
    "gfrom": "Haneda Airport, Tokyo",
    "gto": "Shinagawa, Tokyo",
    "gvia": "",
    "poi": [
      {
        "name": "Shinagawa overnight",
        "what": "Easy dinner, early night by the Shinkansen station",
        "q": "Shinagawa Station Tokyo",
        "slot": "activity",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Shinagawa_Station_-01.jpg/960px-Shinagawa_Station_-01.jpg"
      },
      {
        "name": "Optional brief Tokyo look",
        "what": "Only if energy allows after the flight — a gentle evening stroll",
        "q": "Tokyo Station",
        "slot": "scenic",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Marunouchi_%26_Tokyo_Station_3.jpg/960px-Marunouchi_%26_Tokyo_Station_3.jpg"
      }
    ],
    "eats": [
      {
        "slot": "coffee",
        "area": "Kitashinagawa — a few minutes from Shinagawa Station",
        "picks": [
          {
            "name": "NorthStar Beans (ノーススターコーヒー)",
            "cuisine": "specialty coffee",
            "rating": 4.8,
            "why": "Ruslan & Galiya — a tiny top-rated Shinagawa specialty roastery for a proper morning pour-over to shake off jet-lag; quiet and walkable from the hotels",
            "kid": false,
            "map": "https://maps.google.com/?cid=17650011963556167219",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/A_small_cup_of_coffee.JPG/960px-A_small_cup_of_coffee.JPG"
          }
        ]
      },
      {
        "slot": "dinner",
        "area": "Shinagawa Konan (east) exit — all a short walk from the station and hotels",
        "picks": [
          {
            "name": "Ramen Hayashida Shinagawa Konanguchi (らぁ麺 はやし田 品川港南口店)",
            "cuisine": "Tokyo shōyu ramen",
            "cuisine_note": "clear chicken-and-soy bowl",
            "rating": 4.2,
            "why": "Galiya — a polished Tokyo soy-ramen bowl steps from the station on a tired arrival night",
            "kid": false,
            "map": "https://maps.google.com/?cid=7404246691714038558",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/4/42/Ramen.jpg"
          },
          {
            "name": "Mochimen Udon Shinagawa Konan-guchi (もち麺うどん 品川港南口店)",
            "cuisine": "udon",
            "rating": 4.4,
            "why": "Aslan — plain warm udon he'll actually eat, right by the Konan exit",
            "kid": true,
            "map": "https://maps.google.com/?cid=7630050579439740171",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Bowl_of_Kitsune_Udon.jpg/960px-Bowl_of_Kitsune_Udon.jpg"
          },
          {
            "name": "Sushi Toriton Shinagawa (回転寿し トリトン 品川店)",
            "cuisine": "conveyor-belt sushi (Hokkaido)",
            "rating": 4.0,
            "why": "Aslan & Galiya — fun rotating-sushi where the kid can grab plain rice/tamago/egg-roll plates while the foodie eats the good fish",
            "kid": true,
            "map": "https://maps.google.com/?cid=9688198796730564921",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Conveyor_belt_sushi_at_Mashiro_Sushi.jpg/960px-Conveyor_belt_sushi_at_Mashiro_Sushi.jpg"
          }
        ]
      }
    ],
    "localTodo": [
      {
        "time": "~17:30",
        "name": "Check in near Shinagawa Station",
        "what": "a Shinkansen-stop hub 15 min from Haneda by the Keikyū Line — settle in, don't forward the luggage yet (museum day tomorrow)",
        "map": "https://www.google.com/maps/search/?api=1&query=Shinagawa%20Station%20Tokyo"
      },
      {
        "time": "~18:00",
        "name": "Konan-side stroll (optional)",
        "what": "a gentle canal-side walk on the Konan (east) exit if energy allows — pedestrian decks and easy restaurants, no train needed",
        "map": "https://www.google.com/maps/search/?api=1&query=Shinagawa%20Konan%20exit"
      }
    ]
  },
{
    "d": 1,
    "id": "tokyo",
    "miles": 0,
    "rest": true,
    "rail": false,
    "city": true,
    "region": "Tokyo",
    "title": "Tokyo Museum Day",
    "route": "Mitaka · Toyosu · Shibuya (train & on foot)",
    "desc": "A full, kid-focused Tokyo day before heading south — three of the city's best family experiences, paced so a jet-lagged 6-year-old isn't overstuffed. Morning at the whimsical Ghibli Museum in Mitaka, afternoon wading through the immersive digital art of teamLab Planets in Toyosu, and an early-evening cap at Nintendo TOKYO in Shibuya PARCO (Pokémon Center next door). Book the Ghibli (Lawson, ~a month ahead, sells out fast) and teamLab timed tickets the moment they release. Still no riding.",
    "tags": ["rest", "kid"],
    "gfrom": "Tokyo",
    "gto": "Tokyo",
    "gvia": "",
    "poi": [
      {
        "name": "Ghibli Museum (Mitaka)",
        "what": "Miyazaki's magical, hands-on museum — Totoro, the Catbus, a rooftop robot and a members-only short film. Advance date-and-time tickets only (Lawson); no door sales.",
        "q": "Ghibli Museum Mitaka Tokyo",
        "slot": "activity",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Ghibli_Museum%2C_Mitaka%2C_Tokyo%2C_20240823_1131_5545.jpg/960px-Ghibli_Museum%2C_Mitaka%2C_Tokyo%2C_20240823_1131_5545.jpg",
        "wiki": "https://en.wikipedia.org/wiki/Ghibli_Museum",
        "it": ["ghibli"]
      },
      {
        "name": "teamLab Planets TOKYO",
        "what": "A barefoot, immersive, wade-through world of digital art — mirrored light rooms, knee-deep water and projected flowers that delight every age. Needs a timed online ticket.",
        "q": "teamLab Planets TOKYO",
        "slot": "activity",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Photos_at_teamlab_planets_tokyo.jpg/960px-Photos_at_teamlab_planets_tokyo.jpg",
        "wiki": "https://en.wikipedia.org/wiki/TeamLab",
        "it": ["art", "scenic"]
      },
      {
        "name": "Nintendo TOKYO (Shibuya PARCO)",
        "what": "The official Nintendo flagship store (Mario, Zelda, Pokémon, Splatoon) with the Pokémon Center Shibuya next door — a gentle finish near Shibuya Crossing.",
        "q": "Nintendo TOKYO Shibuya PARCO",
        "slot": "activity",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Shibuya_PARCO_2.jpg/960px-Shibuya_PARCO_2.jpg",
        "it": ["nintendo"]
      },
      {
        "name": "Shibuya Crossing",
        "what": "The world's busiest scramble crossing, steps from Nintendo TOKYO — pure big-city Tokyo energy before dinner.",
        "q": "Shibuya Crossing",
        "slot": "scenic",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Tokyo_Shibuya_Scramble_Crossing_2018-10-09.jpg/960px-Tokyo_Shibuya_Scramble_Crossing_2018-10-09.jpg",
        "it": ["nintendo"]
      }
    ],
    "eats": [
      {
        "slot": "coffee",
        "area": "Kichijōji (near the Ghibli Museum walk)",
        "picks": [
          {
            "name": "LIGHT UP COFFEE",
            "cuisine": "specialty coffee",
            "rating": 4.4,
            "why": "Galiya/Ruslan — Kichijōji single-origin specialty roaster for a proper morning brew; cake/iced drinks for Aslan",
            "kid": false,
            "map": "https://maps.google.com/?cid=15630683996468648685",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/A_small_cup_of_coffee.JPG/960px-A_small_cup_of_coffee.JPG"
          }
        ]
      },
      {
        "slot": "lunch",
        "area": "Kichijōji (by Inokashira Park, walking distance from the Ghibli Museum)",
        "picks": [
          {
            "name": "Ramen Maji",
            "cuisine": "Tokyo shōyu / tonkotsu ramen",
            "rating": 4.3,
            "why": "Galiya — a popular local ramen bowl steps from the Ghibli walk",
            "kid": false,
            "map": "https://maps.google.com/?cid=4134068209230090282",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/4/42/Ramen.jpg"
          },
          {
            "name": "Ibuki Udon Kichijoji",
            "cuisine": "udon (plain kake / kitsune)",
            "rating": 4.2,
            "why": "Aslan — plain soft udon he'll actually eat; rice sides too",
            "kid": true,
            "map": "https://maps.google.com/?cid=11889922840241589079",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Bowl_of_Kitsune_Udon.jpg/960px-Bowl_of_Kitsune_Udon.jpg"
          },
          {
            "name": "Uchoku",
            "cuisine": "ramen",
            "rating": 4.4,
            "why": "Galiya/Ruslan — well-rated ramen alternative inside Coppice Kichijōji",
            "kid": false,
            "map": "https://maps.google.com/?cid=6124190306959042575",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/4/42/Ramen.jpg"
          }
        ]
      },
      {
        "slot": "dinner",
        "area": "Shibuya (by Nintendo TOKYO / Shibuya PARCO)",
        "picks": [
          {
            "name": "ICHIRAN Shibuya",
            "cuisine": "Hakata tonkotsu ramen",
            "rating": 4.4,
            "why": "Galiya — famous solo-booth ramen; rich pork-bone bowl",
            "kid": false,
            "map": "https://maps.google.com/?cid=1092125928485198446",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/4/42/Ramen.jpg"
          },
          {
            "name": "Uobei Shibuya Dogenzaka",
            "cuisine": "conveyor / touch-screen sushi",
            "rating": 4.3,
            "why": "Aslan — order plain tamago, cucumber rolls, karaage & fries off a fun tablet; cheap kid heaven",
            "kid": true,
            "map": "https://maps.google.com/?cid=5886746596086835007",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Kaiten-zushi_002.jpg/960px-Kaiten-zushi_002.jpg"
          },
          {
            "name": "Sushi to Rāmen Uogashiya Shibuya",
            "cuisine": "sushi & ramen",
            "rating": 4.6,
            "why": "the whole family — sushi for Galiya and a ramen/rice bowl in one stop",
            "kid": false,
            "map": "https://maps.google.com/?cid=15369335642700573936",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/0/08/SawachiDish_Sushi_and_Tataki01.jpg"
          }
        ]
      }
    ],
    "localTodo": [
      {
        "time": "~10:00",
        "name": "Ghibli Museum (Mitaka)",
        "what": "Miyazaki's whimsical museum — Catbus, rooftop robot, members-only short film (timed Lawson tickets only, book ~1 month ahead)",
        "map": "https://www.google.com/maps/search/?api=1&query=Ghibli%20Museum%20Mitaka%20Tokyo"
      },
      {
        "time": "~11:30",
        "name": "Inokashira Park",
        "what": "green walk between the museum and Kichijōji lunch — swan boats on the pond",
        "map": "https://www.google.com/maps/search/?api=1&query=Inokashira%20Park%20Tokyo"
      },
      {
        "time": "~14:00",
        "name": "teamLab Planets TOKYO (Toyosu)",
        "what": "barefoot, wade-through immersive digital-art world — water, light, projected flowers (timed online ticket)",
        "map": "https://www.google.com/maps/search/?api=1&query=teamLab%20Planets%20TOKYO%20Toyosu"
      },
      {
        "time": "~17:00",
        "name": "Nintendo TOKYO + Pokémon Center (Shibuya PARCO)",
        "what": "official Nintendo flagship — Mario/Zelda/Splatoon — with Pokémon Center next door",
        "map": "https://www.google.com/maps/search/?api=1&query=Nintendo%20TOKYO%20Shibuya%20PARCO"
      }
    ]
  },
{
    "d": 2,
    "id": "osaka",
    "miles": 24,
    "dmin": 67,
    "warmup": true,
    "rest": false,
    "rail": false,
    "region": "Kansai",
    "title": "Shinkansen to Osaka, Bike Pickup & Minoh Warm-Up",
    "route": "Tokyo 🚄 Shin-Osaka → Suita base → Minoh Falls → Osaka",
    "desc": "A relaxed late-morning Nozomi (~2h30m) glides into Shin-Osaka around midday, then a short hop out to the Suita base for the rental handover: paperwork and insurance, a full walk-around of the Africa Twin and CB400X, fitting the child's gear, pairing intercoms and a slow on-foot shakedown. Then — the warm-up before the demanding Day 3 — a gentle ~24 mi / ~1h07m shakedown ride: north out of Suita on quiet suburban roads to Minoh Falls, an easy forest-gorge walk to a 33 m waterfall, then a calm city leg back into Dōtonbori. It lets Galiya settle into the rental bike, riding on the left and the child-pillion setup with Aslan aboard, all at an easy daylight pace before the Route 480 climb tomorrow. Cap it with a welcome dinner under the Dōtonbori neon. The warm-up is optional and weather-dependent — if the flight landed late or it's wet, skip it and simply ride the short way to the hotel.",
    "luggage": "Start the chain. The cases forwarded from Tokyo are waiting at the Osaka hotel — repack into a chain case (forward it today from the front desk to the Shirahama rest base, Days 6–7, the first reliable forwarding target) and a heavier base-camp case left in Osaka left-luggage for the whole loop (collect Day 21). Only riding gear and a soft overnight bag goes on the bikes.",
    "tags": ["ride", "kid", "scenic"],
    "gfrom": "4-10 Senrioka Shimo, Suita, Osaka, Japan",
    "gto": "Dotonbori, Osaka, Japan",
    "gvia": "Minoo Park, Minoh, Osaka, Japan",
    "poi": [
      {
        "name": "Suita rental base",
        "what": "Bike pickup, paperwork, gear-fit and a slow on-foot shakedown of the controls — all on foot before the gentle warm-up ride (you arrive on the midday Nozomi, then a short local hop)",
        "q": "Suita, Osaka",
        "slot": "activity",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Osaka_Castle%2C_Keep_tower%2C_South_view_20190415_1.jpg/960px-Osaka_Castle%2C_Keep_tower%2C_South_view_20190415_1.jpg",
        "it": ["moto"]
      },
      {
        "name": "Minoh Falls / Minoo Park",
        "what": "The warm-up ride's gentle turnaround, ~30 min north of the Suita base: an easy, mostly-flat ~40-min forest-gorge walk to a 33 m waterfall with wild monkeys and momiji-tempura (deep-fried, sweet-salty maple-leaf) stalls — kid-friendly for Aslan and Galiya's confidence-building first ride on the rental before Day 3.",
        "q": "Minoo Park, Minoh, Osaka, Japan",
        "slot": "scenic",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Minoh_Falls_Minoh_Osaka_pref_Japan01s5.jpg/960px-Minoh_Falls_Minoh_Osaka_pref_Japan01s5.jpg",
        "wiki": "https://en.wikipedia.org/wiki/Meiji_no_Mori_Mino_Quasi-National_Park",
        "it": ["scenic", "kid"],
        "kid": true
      },
      {
        "name": "Dōtonbori",
        "what": "Welcome dinner under the neon — takoyaki, okonomiyaki and the running Glico Man, after riding back from Minoh and parking the bikes",
        "q": "Dotonbori Osaka",
        "slot": "dinner",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Peach%27sCastle_at_Universal_Studios_Japan_20220814.jpg/960px-Peach%27sCastle_at_Universal_Studios_Japan_20220814.jpg",
        "wiki": "https://en.wikipedia.org/wiki/D%C5%8Dtonbori",
        "it": ["food"]
      }
    ],
    "eats": [
      {
        "slot": "coffee",
        "area": "Nishi-Shinsaibashi (near Namba)",
        "picks": [
          {
            "name": "LiLo Coffee Roasters",
            "cuisine": "specialty coffee",
            "rating": 4.8,
            "why": "Galiya & Ruslan — Osaka's marquee third-wave roaster, huge single-origin lineup minutes from Dōtonbori; iced drinks and pastries keep Aslan happy",
            "kid": false,
            "map": "https://maps.google.com/?cid=16291659530834990214",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/A_small_cup_of_coffee.JPG/960px-A_small_cup_of_coffee.JPG"
          }
        ]
      },
      {
        "slot": "lunch",
        "area": "Shin-Osaka (arrival)",
        "picks": [
          {
            "name": "Maru de Sankaku",
            "cuisine": "Osaka ramen",
            "rating": 4.4,
            "why": "Galiya — a top-rated local ramen bowl minutes from Shin-Osaka",
            "kid": false,
            "map": "https://maps.google.com/?cid=17941306275953871503",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Shoyu_Ramen.jpg/960px-Shoyu_Ramen.jpg"
          },
          {
            "name": "Yusuke",
            "cuisine": "udon / Japanese",
            "rating": 4.3,
            "why": "Aslan — plain kake-udon and rice he'll actually eat",
            "kid": true,
            "map": "https://maps.google.com/?cid=2573639927540784130",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Kake_udon_by_udono.jpg/960px-Kake_udon_by_udono.jpg"
          },
          {
            "name": "Human Beings Everybody Noodles",
            "cuisine": "ramen",
            "rating": 4.2,
            "why": "Galiya & Ruslan — wildly popular noodle shop in Nishinakajima by the station",
            "kid": false,
            "map": "https://maps.google.com/?cid=6418836266917594457",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Shoyu_Ramen.jpg/960px-Shoyu_Ramen.jpg"
          }
        ]
      },
      {
        "slot": "snack",
        "area": "Minoh Falls path",
        "picks": [
          {
            "name": "Hisakunikosendo",
            "cuisine": "momiji-tempura (maple-leaf tempura)",
            "rating": 4.4,
            "why": "Aslan — a fun, sweet-salty deep-fried maple-leaf snack on the easy falls walk; one of Minoh's long-running makers",
            "kid": true,
            "map": "https://maps.google.com/?cid=16416516797408264592",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Momiji_no_Tempura.jpg/960px-Momiji_no_Tempura.jpg"
          },
          {
            "name": "Koyo-ryorikan",
            "cuisine": "momiji-tempura / sweet stall",
            "rating": 4.6,
            "why": "everyone — another riverside path stall for crisp maple-leaf tempura by Minoh Falls (any of the path stalls works)",
            "kid": true,
            "map": "https://maps.google.com/?cid=2539227206672459667",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Minoh_Falls_Minoh_Osaka_pref_Japan01s5.jpg/960px-Minoh_Falls_Minoh_Osaka_pref_Japan01s5.jpg"
          }
        ]
      },
      {
        "slot": "dinner",
        "area": "Dōtonbori / Namba",
        "picks": [
          {
            "name": "OKO - Fun Okonomiyaki Bar",
            "cuisine": "okonomiyaki / teppan",
            "rating": 4.7,
            "why": "Galiya — Osaka's signature as-you-like-it pancake cooked at the counter",
            "kid": false,
            "map": "https://maps.google.com/?cid=17891229658034342593",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Okonomiyaki_001.jpg/960px-Okonomiyaki_001.jpg"
          },
          {
            "name": "Sushiro Sennichimae",
            "cuisine": "conveyor-belt sushi",
            "rating": 4.6,
            "why": "Aslan — order-screen kaiten sushi with karaage, plain rice, egg and udon he'll happily pick from",
            "kid": true,
            "map": "https://maps.google.com/?cid=13944981815152990368",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Conveyor_belt_sushi_at_Mashiro_Sushi.jpg/960px-Conveyor_belt_sushi_at_Mashiro_Sushi.jpg"
          },
          {
            "name": "Takoyaki Wanaka Dotonbori",
            "cuisine": "takoyaki street food",
            "rating": 4.2,
            "why": "everyone — the molten octopus-dumpling icon eaten standing on the strip",
            "kid": false,
            "map": "https://maps.google.com/?cid=2130839552230731987",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/d/d8/Takoyaki_by_yomi955.jpg"
          }
        ]
      }
    ],
    "localTodo": [
      {
        "time": "~14:00",
        "name": "Suita rental base (Bike Rental Japan)",
        "what": "Pickup, insurance paperwork, Africa Twin + CB400X walk-around, fit Aslan's child gear and pair intercoms — all on foot before the warm-up ride",
        "map": "https://www.google.com/maps/search/?api=1&query=Bike%20Rental%20Japan%20Suita%20Osaka"
      },
      {
        "time": "~15:30",
        "name": "Minoh Falls / Minoo Park",
        "what": "The warm-up ride's gentle turnaround (~30 min north of Suita): an easy, mostly-flat ~40-min forest-gorge walk to a 33 m waterfall with wild monkeys and momiji-tempura stalls — kid-friendly, lets Galiya settle into the rental before Day 3, then a calm city leg back to Dōtonbori (optional / weather-dependent)",
        "map": "https://www.google.com/maps/search/?api=1&query=Minoo%20Park%2C%20Minoh%2C%20Osaka%2C%20Japan"
      },
      {
        "time": "~18:00",
        "name": "Dōtonbori neon canyon",
        "what": "The running Glico Man sign, giant mechanical crab and the city's loudest street-food strip — the easy welcome-evening stroll",
        "map": "https://www.google.com/maps/search/?api=1&query=Dotonbori%20Osaka"
      },
      {
        "time": "~19:00",
        "name": "Den Den Town & Super Potato",
        "what": "Aslan's toy fix: retro-game shop with a Mario-statue storefront, floors of gachapon, and the loop's best shot at Transformers / Takara Tomy robots",
        "map": "https://www.google.com/maps/search/?api=1&query=Super%20Potato%20Nipponbashi%20Osaka"
      },
      {
        "time": "optional",
        "name": "Osaka Castle park",
        "what": "Broad moats and the gold-trimmed keep lit at dusk — a relaxed first-evening walk if energy allows",
        "map": "https://www.google.com/maps/search/?api=1&query=Osaka%20Castle"
      }
    ]
  },
{
    "d": 3,
    "id": "kumano-interior",
    "miles": 102,
    "dmin": 272,
    "rest": false,
    "region": "Kōya → Kumano, Wakayama",
    "title": "Sacred Mountain & the Pilgrim Road",
    "route": "Osaka → Kōyasan → Hongū / Yunomine",
    "desc": "The biggest of the opening days, by design: a quick visit to the sacred mountain, then straight down the great pilgrim road to the onsen hamlets of the Kumano interior. Slip south out of the Kansai sprawl and climb the paved Route 480/370 into the forested highlands of Kōyasan — keep it to a brisk ~1–1.5 hours (the cedar avenue of Okunoin, or the vermilion Danjō Garan and head temple Kongōbu-ji) rather than a temple-stay night. Then drop off the mountain and turn south down Route 168, following the Totsukawa River through deep forested gorges; pause to walk the swaying Tanise suspension bridge, then roll into the Hongū basin for Kumano Hongū Taisha and the giant Ōyunohara torii, overnighting at the ancient onsen hamlet of Yunomine. Start early and let tomorrow's Kumano rest day absorb the long ride.",
    "tags": ["ride", "kid", "onsen"],
    "gfrom": "Suita, Osaka",
    "gto": "Yunomine Onsen, Wakayama, Japan",
    "gvia": "Okunoin Cemetery Koyasan|Tanise no Tsuribashi Totsukawa|Kumano Hongu Taisha",
    "poi": [
      {
        "name": "Danjo Garan & Konpon Daitō",
        "what": "The brilliant vermilion great pagoda, spiritual heart of the mountain — the most efficient single stop on the quick ~1–1.5 h Kōyasan visit",
        "q": "Konpon Daito Koyasan",
        "slot": "scenic",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Konpon_Daito_Pagoda_-_Garan_Complex_-_Koyasan_-_Japan_%2847950047772%29.jpg/960px-Konpon_Daito_Pagoda_-_Garan_Complex_-_Koyasan_-_Japan_%2847950047772%29.jpg",
        "wiki": "https://en.wikipedia.org/wiki/Mount_K%C5%8Dya",
        "it": ["castle"]
      },
      {
        "name": "Kongōbu-ji",
        "what": "Head temple of Shingon Buddhism: the Banryūtei rock garden (Japan's largest) and painted fusuma halls — part of the brisk daytime Kōyasan stop",
        "q": "Kongobu-ji Koyasan",
        "slot": "activity",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Narrow_rock_garden%2C_Kongobuji%2C_Koyasan%2C_2016.jpg/960px-Narrow_rock_garden%2C_Kongobuji%2C_Koyasan%2C_2016.jpg",
        "wiki": "https://en.wikipedia.org/wiki/Kong%C5%8Dbu-ji",
        "it": ["castle"]
      },
      {
        "name": "Okunoin",
        "what": "Lantern-lit cedar avenue to Kōbō Daishi's mausoleum — walk the first stretch on the quick daytime stop (no temple-stay night this trip)",
        "q": "Okunoin Cemetery Koyasan",
        "slot": "scenic",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Choishi_Path_-_Okunoin_Cemetery_-_Koyasan_-_Japan_-_18_%2847949824357%29.jpg/960px-Choishi_Path_-_Okunoin_Cemetery_-_Koyasan_-_Japan_-_18_%2847949824357%29.jpg",
        "wiki": "https://en.wikipedia.org/wiki/Okunoin",
        "it": ["castle"]
      },
      {
        "name": "Tanise no Tsuribashi",
        "what": "A 297 m swaying pedestrian suspension bridge over the Totsukawa",
        "q": "Tanise no Tsuribashi Totsukawa",
        "slot": "stop",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Suspension_bridge_of_Tanize_2010.07.28_-_Merged-1.jpg/960px-Suspension_bridge_of_Tanize_2010.07.28_-_Merged-1.jpg",
        "it": ["art", "scenic"]
      },
      {
        "name": "Totsukawa",
        "what": "River-valley leg-stretch in Japan's largest village",
        "q": "Totsukawa village",
        "slot": "coffee",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Kumano_Kodo_pilgrimage_route_Yunomine_Onsen_World_heritage_%E7%86%8A%E9%87%8E%E5%8F%A4%E9%81%93_%E6%B9%AF%E3%81%AE%E5%B3%B0%E6%B8%A9%E6%B3%89116.JPG/960px-Kumano_Kodo_pilgrimage_route_Yunomine_Onsen_World_heritage_%E7%86%8A%E9%87%8E%E5%8F%A4%E9%81%93_%E6%B9%AF%E3%81%AE%E5%B3%B0%E6%B8%A9%E6%B3%89116.JPG",
        "it": ["art"]
      },
      {
        "name": "Kumano Hongū Taisha & Ōyunohara",
        "what": "Head Kumano shrine and Japan's largest torii, beside the Yunomine overnight",
        "q": "Kumano Hongu Taisha",
        "slot": "scenic",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Torii_at_Oyunohara_01.jpg/960px-Torii_at_Oyunohara_01.jpg",
        "wiki": "https://en.wikipedia.org/wiki/Kumano_Hong%C5%AB_Taisha",
        "it": ["art", "castle"]
      }
    ],
    "eats": [
      {
        "slot": "coffee",
        "area": "Kōyasan town",
        "picks": [
          {
            "name": "Tempu Terrace",
            "cuisine": "cafe / espresso & light bites",
            "rating": 4.6,
            "why": "Ruslan & Galiya — proper coffee and a warm break at 800 m before the walk",
            "kid": true,
            "map": "https://maps.google.com/?cid=8414907357130941779",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/A_small_cup_of_coffee.JPG/330px-A_small_cup_of_coffee.JPG"
          },
          {
            "name": "Komi Coffee",
            "cuisine": "coffee roastery cafe",
            "rating": 4.1,
            "why": "Ruslan — hand-drip specialty coffee on the temple-town street",
            "kid": false,
            "map": "https://maps.google.com/?cid=9477189132371607285",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/A_small_cup_of_coffee.JPG/330px-A_small_cup_of_coffee.JPG"
          }
        ]
      },
      {
        "slot": "lunch",
        "area": "Kōyasan town",
        "picks": [
          {
            "name": "Hanabishi",
            "cuisine": "Kōya shōjin-ryōri / Buddhist vegetarian set",
            "rating": 4.2,
            "why": "Galiya — Kōyasan's temple cuisine (gomadōfu, tempura, soba) eaten at its source",
            "kid": false,
            "map": "https://maps.google.com/?cid=12392921685726484034",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Fukuchiin_shojin_ryori_appetizer.jpg/330px-Fukuchiin_shojin_ryori_appetizer.jpg"
          },
          {
            "name": "Kotobuki Shokudō",
            "cuisine": "casual shokudō — udon, katsu, curry rice",
            "rating": 4.4,
            "why": "Aslan — plain udon, katsu & rice he'll actually eat in a relaxed diner",
            "kid": true,
            "map": "https://maps.google.com/?cid=3056959925161555233",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Kake_udon_by_udono.jpg/330px-Kake_udon_by_udono.jpg"
          }
        ]
      },
      {
        "slot": "dinner",
        "area": "Yunomine Onsen",
        "picks": [
          {
            "name": "Ryokan Yunomineso",
            "cuisine": "onsen-ryokan kaiseki dinner",
            "rating": 4.5,
            "why": "whole family — multi-course local kaiseki at the inn; ask for a child's set (plain rice, karaage, tamago) for Aslan",
            "kid": true,
            "map": "https://maps.google.com/?cid=5061754705104044984",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Jisaku_Kaiseki_Ryori_01.jpg/330px-Jisaku_Kaiseki_Ryori_01.jpg"
          },
          {
            "name": "Ryokan Adumaya",
            "cuisine": "historic onsen-ryokan kaiseki",
            "rating": 4.4,
            "why": "Galiya — refined kaiseki at a centuries-old Yunomine inn with traditional baths",
            "kid": false,
            "map": "https://maps.google.com/?cid=13210106354841318663",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Jisaku_Kaiseki_Ryori_01.jpg/330px-Jisaku_Kaiseki_Ryori_01.jpg"
          }
        ]
      }
    ],
    "localTodo": [
      {
        "time": "~10:30",
        "name": "Kōyasan quick stop — Okunoin",
        "what": "brisk walk up the lantern-lit cedar avenue to Kōbō Daishi's mausoleum (or the vermilion Danjō Garan pagoda); keep it to ~1–1.5 h, a daytime visit, not a temple stay",
        "map": "https://www.google.com/maps/search/?api=1&query=Okunoin%20Cemetery%20Koyasan"
      },
      {
        "time": "~11:15",
        "name": "Danjō Garan & Kongōbu-ji",
        "what": "the great vermilion Konpon Daitō pagoda complex and the head temple's huge rock garden, a short stroll from the cafes",
        "map": "https://www.google.com/maps/search/?api=1&query=Danjo%20Garan%20Koyasan"
      },
      {
        "time": "~14:30",
        "name": "Tanise no Tsuribashi",
        "what": "297 m swaying pedestrian suspension bridge high over the Totsukawa — a leg-stretch on the descent down Route 168",
        "map": "https://www.google.com/maps/search/?api=1&query=Tanise%20no%20Tsuribashi"
      },
      {
        "time": "~16:00",
        "name": "Kumano Hongū Taisha & Ōyunohara",
        "what": "head shrine of the Kumano Sanzan and the giant 33.9 m Ōyunohara torii on the river sandbank, just before Yunomine",
        "map": "https://www.google.com/maps/search/?api=1&query=Kumano%20Hongu%20Taisha"
      }
    ]
  },
{
    "d": 4,
    "id": "kumano-interior",
    "miles": 20,
    "rest": true,
    "region": "Kumano, Wakayama",
    "title": "Kumano Interior Rest Day",
    "route": "Yunomine / Kawayu (light riding)",
    "desc": "A slow soak-and-stroll day in the sacred interior — the most restful base of the loop. Bathe in the tiny Tsuboyu (the only World Heritage bath you can enter) and boil eggs in the spring; at Kawayu, scoop your own riverbed bath in the warm gravel. Keep the Kumano Kodō to a gentle 30–40 min Hosshinmon-ōji → Hongū taster (easy for a child), and return to the giant Ōyunohara torii at golden hour. Rain plan: the indoor Kumano Hongū Heritage Center and covered ryokan baths.",
    "luggage": "Nothing to send today — you're in the remote Kumano interior (2-day delivery), so the overnight kit stays on the bikes. Your chain case is already on its way to the Shirahama base, waiting there for your Day-6 arrival.",
    "tags": ["rest", "kid", "onsen", "stay2"],
    "gfrom": "Yunomine Onsen, Wakayama, Japan",
    "gto": "Kumano Hongu Taisha",
    "gvia": "",
    "poi": [
      {
        "name": "Tsuboyu, Yunomine",
        "what": "Soak in the only World Heritage bath you can bathe in",
        "q": "Tsuboyu Yunomine Onsen",
        "slot": "activity",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Kumano_Kodo_pilgrimage_route_Yunomine_Onsen_World_heritage_%E7%86%8A%E9%87%8E%E5%8F%A4%E9%81%93_%E6%B9%AF%E3%81%AE%E5%B3%B0%E6%B8%A9%E6%B3%89116.JPG/960px-Kumano_Kodo_pilgrimage_route_Yunomine_Onsen_World_heritage_%E7%86%8A%E9%87%8E%E5%8F%A4%E9%81%93_%E6%B9%AF%E3%81%AE%E5%B3%B0%E6%B8%A9%E6%B3%89116.JPG",
        "it": ["onsen"]
      },
      {
        "name": "Kawayu Onsen",
        "what": "Dig your own bath in the warm riverbed",
        "q": "Kawayu Onsen",
        "slot": "activity",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Kawayu_onsen1.JPG/960px-Kawayu_onsen1.JPG",
        "it": ["onsen"]
      },
      {
        "name": "Ōyunohara & Kumano Kodō walk",
        "what": "Giant torii and a gentle pilgrim-trail stretch",
        "q": "Oyunohara Otorii",
        "slot": "scenic",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Oyunohara_autumn.jpg/960px-Oyunohara_autumn.jpg",
        "it": ["art", "castle"]
      }
    ],
    "eats": [
      {
        "slot": "coffee",
        "area": "Hongū village (steps from Kumano Hongū Taisha)",
        "picks": [
          {
            "name": "「sei」 Glass shop · Tea room · Coffee stand",
            "cuisine": "specialty coffee",
            "rating": 4.7,
            "why": "Ruslan & Galiya — a serious hand-pour coffee stand in the pilgrim village (a rare find this deep in the Kii interior); tea and sweets, so Aslan can have a treat too",
            "kid": false,
            "map": "https://maps.google.com/?cid=2372018652556039714",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/A_small_cup_of_coffee.JPG/960px-A_small_cup_of_coffee.JPG"
          }
        ]
      },
      {
        "slot": "lunch",
        "area": "Hongū (near Kumano Hongū Taisha / Ōyunohara)",
        "picks": [
          {
            "name": "Mitsuashi Noodle shop (みつ葉)",
            "cuisine": "ramen / noodles",
            "rating": 4.8,
            "why": "Galiya — the standout noodle bowl right by the shrine; a plain bowl works for Aslan too",
            "kid": false,
            "map": "https://maps.google.com/?cid=14384004974723876992",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Shoyu_Ramen.jpg/960px-Shoyu_Ramen.jpg"
          },
          {
            "name": "きっちん (Kitchen)",
            "cuisine": "casual Japanese set meals / katsu & rice",
            "rating": 4.3,
            "why": "Aslan — easy katsu, rice and simple plates he'll actually eat, steps from the shrine",
            "kid": true,
            "map": "https://maps.google.com/?cid=4351367167838386248",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Tonkatsu.jpg/960px-Tonkatsu.jpg"
          },
          {
            "name": "宮ずし (Miyazushi)",
            "cuisine": "sushi",
            "rating": 4.6,
            "why": "Galiya — neighbourhood sushi counter in the pilgrim town (tamago for Aslan)",
            "kid": false,
            "map": "https://maps.google.com/?cid=15958625622105258960",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Sushi_platter.jpg/960px-Sushi_platter.jpg"
          }
        ]
      },
      {
        "slot": "dinner",
        "area": "Yunomine / Hongū (remote onsen hamlet — book your ryokan dinner if staying half-board; otherwise these are the nearby options)",
        "picks": [
          {
            "name": "ときわや (Tokiwaya), Kawayu",
            "cuisine": "local Kumano set meals (mehari-zushi, river fish)",
            "rating": 4.2,
            "why": "Galiya — regional Kumano cooking eaten where it's made, riverside at Kawayu",
            "kid": false,
            "map": "https://maps.google.com/?cid=2791320893729462743",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Meharizushi-Kumano-Mie.JPG/960px-Meharizushi-Kumano-Mie.JPG"
          },
          {
            "name": "Okage-san Izakaya (おかげさん), Wataze",
            "cuisine": "izakaya — karaage, grills, rice",
            "rating": 4.8,
            "why": "Aslan — karaage and plain rice; hearty plates and a drink for Ruslan",
            "kid": true,
            "map": "https://maps.google.com/?cid=2574437099364628723",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Karaage.jpg/960px-Karaage.jpg"
          },
          {
            "name": "Yumune Chaya (湯峰茶屋), Yunomine",
            "cuisine": "onsen-village cafe / mehari-zushi & light meals",
            "rating": 3.9,
            "why": "convenient in-hamlet option right by the overnight onsen if you don't want to ride out",
            "kid": false,
            "map": "https://maps.google.com/?cid=16222776516153084156",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Mehari_zushi_by_m-louis.jpg/960px-Mehari_zushi_by_m-louis.jpg"
          }
        ]
      }
    ],
    "localTodo": [
      {
        "time": "~09:30",
        "name": "Tsuboyu, Yunomine",
        "what": "Reserve a 30-min slot in the only UNESCO World Heritage bath you can bathe in; boil eggs/veg in the public yuzutsu spring by the river",
        "map": "https://www.google.com/maps/search/?api=1&query=Tsuboyu%20Yunomine%20Onsen"
      },
      {
        "time": "~11:00",
        "name": "Kawayu Onsen riverbed bath",
        "what": "Scoop your own hot bath in the warm gravel of the Ōto River (weather/river-level dependent — high water after rain cancels it)",
        "map": "https://www.google.com/maps/search/?api=1&query=Kawayu%20Onsen"
      },
      {
        "time": "~14:00",
        "name": "Kumano Kodō taster + Kumano Hongū Taisha",
        "what": "Short 30–40 min Hosshinmon-ōji-style stretch then the cypress-bark head shrine up the cedar stair (rain plan: free Kumano Hongū Heritage Center)",
        "map": "https://www.google.com/maps/search/?api=1&query=Kumano%20Hongu%20Taisha"
      },
      {
        "time": "~16:30",
        "name": "Ōyunohara Ōtorii",
        "what": "Japan's largest torii (33.9 m) on the old shrine sandbank — best at golden hour",
        "map": "https://www.google.com/maps/search/?api=1&query=Oyunohara%20Otorii"
      }
    ]
  },
{
    "d": 5,
    "id": "kumano",
    "miles": 52,
    "dmin": 112,
    "rest": false,
    "region": "Wakayama",
    "title": "Down to the Sacred Coast",
    "route": "Yunomine → Doro-kyō → Nachi-Katsuura",
    "desc": "A short, scenic descent from the mountains to the Pacific, opening with the trip's first must-do: drop along the Kitayama River to Doro-kyō — Japan's premier river gorge — and board the traditional river-boat for a ~40-minute glide through glass-clear emerald water beneath 50 m cliffs (a sure-fire thrill for a 6-year-old, so build the morning around it). Continue to Nachi Falls — Japan's tallest waterfall — beside the vermilion pagoda of Kumano Nachi Taisha, reached up the cobbled Daimon-zaka. With the riding done by mid-afternoon, bank the rest of the day in the water at the tuna port of Katsuura — the seaside cave onsen and fresh maguro.",
    "tags": ["ride", "kid"],
    "gfrom": "Yunomine Onsen, Wakayama, Japan",
    "gto": "Kii-Katsuura, Wakayama, Japan",
    "gvia": "Doro-kyo Gorge, Japan",
    "poi": [
      {
        "name": "Doro-kyō river-boat",
        "what": "⭐ Must-do — a ~40-minute traditional wooden river-boat glide through Japan's premier river gorge: glass-clear emerald water under 50 m cliffs and strange water-carved rocks, the classic Kumano river experience and a top kid thrill (Mar–Nov, closed Mon; reserve ahead). Note: the old Kumano Kotsu waterjet boat was discontinued in 2021 — this traditional river-boat is the current way to ride the gorge.",
        "q": "Doro-kyo Gorge Kitayama",
        "slot": "stop",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Doro_Gorge_Jet_Boat.jpg/960px-Doro_Gorge_Jet_Boat.jpg",
        "it": ["scenic", "kid"]
      },
      {
        "name": "Daimon-zaka",
        "what": "Short cobbled pilgrim path under giant cedars (kid-friendly)",
        "q": "Daimonzaka Nachi",
        "slot": "scenic",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Kumano-Nachi_Taisha_%2851928795142%29.jpg/960px-Kumano-Nachi_Taisha_%2851928795142%29.jpg",
        "it": ["castle"]
      },
      {
        "name": "Nachi Falls & Kumano Nachi Taisha",
        "what": "Waterfall, pagoda and shrine, with lunch",
        "q": "Nachi Falls",
        "slot": "lunch",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Nachikatsuura_Kumano-Nachi-taisha_Hiro-jinja_Nachi_Falls_06.jpg/960px-Nachikatsuura_Kumano-Nachi-taisha_Hiro-jinja_Nachi_Falls_06.jpg",
        "wiki": "https://en.wikipedia.org/wiki/Nachi_Falls",
        "it": ["food", "scenic", "castle"]
      },
      {
        "name": "Kumano Hayatama Taisha (Shingū)",
        "what": "Optional third Kumano grand shrine and its 1,000-year-old sacred nagi tree, on the way down",
        "q": "Kumano Hayatama Taisha",
        "slot": "scenic",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Kumano_Nachi_Taisha_201908-2.jpg/960px-Kumano_Nachi_Taisha_201908-2.jpg",
        "wiki": "https://en.wikipedia.org/wiki/Kumano_Hayatama_Taisha",
        "it": ["castle"]
      },
      {
        "name": "Katsuura cave onsen",
        "what": "Afternoon soak in Bōki-dō, a natural sea-cave bath over the booming surf",
        "q": "Hotel Urashima Katsuura",
        "slot": "activity",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Onsen_in_Nachikatsuura%2C_Japan.jpg/960px-Onsen_in_Nachikatsuura%2C_Japan.jpg",
        "it": ["onsen"]
      }
    ],
    "eats": [
      {
        "slot": "coffee",
        "area": "Katsuura port",
        "picks": [
          {
            "name": "KUMANO COFFEE BREWERS",
            "cuisine": "specialty coffee",
            "rating": 4.9,
            "why": "Ruslan & Galiya — third-wave hand-brew right in Katsuura port for an afternoon-downtime or pre-departure cup; quiet enough for Aslan with a sweet treat",
            "kid": false,
            "map": "https://maps.google.com/?cid=18129618703588605853",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/A_small_cup_of_coffee.JPG/960px-A_small_cup_of_coffee.JPG"
          }
        ]
      },
      {
        "slot": "lunch",
        "area": "Nachisan (Nachi Falls)",
        "picks": [
          {
            "name": "Chinchōan Moudemochi",
            "cuisine": "handmade Kumano soba",
            "rating": 4.3,
            "why": "Galiya & Ruslan — fresh soba right at the falls/shrine path",
            "kid": false,
            "map": "https://maps.google.com/?cid=530398846035148961",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Soba_and_tempura_combo_%2826498960080%29.jpg/960px-Soba_and_tempura_combo_%2826498960080%29.jpg"
          },
          {
            "name": "Miyamatei",
            "cuisine": "set-meal teahouse (udon, curry-rice)",
            "rating": 3.5,
            "why": "Aslan — the convenient on-site sit-down spot for plain udon & curry-rice (Nachisan is a tiny temple village, so options are limited; conbini onigiri are an easy backup)",
            "kid": true,
            "map": "https://maps.google.com/?cid=7320587628942868247",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Kama-age_Udon.jpg/960px-Kama-age_Udon.jpg"
          }
        ]
      },
      {
        "slot": "dinner",
        "area": "Katsuura port",
        "picks": [
          {
            "name": "Tuna Bowl Muromaru (まぐろ丼 むろまる)",
            "cuisine": "maguro-don / tuna bowls",
            "rating": 4.5,
            "why": "Galiya & Ruslan — fresh line-caught Katsuura tuna straight off Japan's #1 tuna port",
            "kid": false,
            "map": "https://maps.google.com/?cid=1322154716535247244",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Maguro-don_%28raw_tuna_fish_bowl%29%2C_Chiyoda-ward%2C_Tokyo_%28%E3%81%BE%E3%81%90%E3%82%8D%E4%B8%BC%2C_%E5%8D%83%E4%BB%A3%E7%94%B0%E5%8C%BA%29_%282011-05-10_13.26.07_by_yuiseki_aoba%29.jpg/960px-Maguro-don_%28raw_tuna_fish_bowl%29%2C_Chiyoda-ward%2C_Tokyo_%28%E3%81%BE%E3%81%90%E3%82%8D%E4%B8%BC%2C_%E5%8D%83%E4%BB%A3%E7%94%B0%E5%8C%BA%29_%282011-05-10_13.26.07_by_yuiseki_aoba%29.jpg"
          },
          {
            "name": "Maguro no Yamaki",
            "cuisine": "tuna specialist (maguro-don, seared zuke)",
            "rating": 4.2,
            "why": "Galiya — hugely popular local tuna house with seared and sashimi options",
            "kid": false,
            "map": "https://maps.google.com/?cid=16729597622358529220",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Maguro-tataki-don_of_Sukiya.jpg/960px-Maguro-tataki-don_of_Sukiya.jpg"
          },
          {
            "name": "Rio Ramen",
            "cuisine": "ramen & gyoza",
            "rating": 4.2,
            "why": "Aslan — plain ramen broth & gyoza he'll actually eat, and Galiya's noodle fix if she's tuna'd out",
            "kid": true,
            "map": "https://maps.google.com/?cid=17918930914327022472",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Shoyu_ramen%2C_at_Kasukabe_Station_%282014.05.05%29_1.jpg/960px-Shoyu_ramen%2C_at_Kasukabe_Station_%282014.05.05%29_1.jpg"
          }
        ]
      }
    ],
    "localTodo": [
      {
        "time": "~10:00",
        "name": "Doro-kyō river-boat",
        "what": "glass-clear gorge cruise between sheer cliffs on the Kitayama River — a kid highlight",
        "map": "https://www.google.com/maps/search/?api=1&query=Dorokyo%20river%20boat%20Kitayama"
      },
      {
        "time": "~11:30",
        "name": "Daimon-zaka",
        "what": "short cobbled pilgrim path under giant cedars up to the shrine (kid-friendly)",
        "map": "https://www.google.com/maps/search/?api=1&query=Daimonzaka%20Nachikatsuura"
      },
      {
        "time": "~12:00",
        "name": "Nachi Falls & Kumano Nachi Taisha",
        "what": "Japan's tallest single-drop waterfall (133 m) beside the vermilion Seiganto-ji pagoda — the postcard of Japan",
        "map": "https://www.google.com/maps/search/?api=1&query=Nachi%20Falls%20Kumano%20Nachi%20Taisha"
      },
      {
        "time": "~13:45",
        "name": "Kumano Hayatama Taisha, Shingū (optional)",
        "what": "the third Kumano grand shrine and its 1,000-year-old sacred nagi tree, a quick stop on the way down",
        "map": "https://www.google.com/maps/search/?api=1&query=Kumano%20Hayatama%20Taisha"
      },
      {
        "time": "~15:30",
        "name": "Katsuura cave onsen (Bōki-dō)",
        "what": "natural sea-grotto hot-spring bath with the surf booming below, at Hotel Urashima",
        "map": "https://www.google.com/maps/search/?api=1&query=Hotel%20Urashima%20Bokido%20cave%20onsen%20Katsuura"
      }
    ]
  },
{
    "d": 6,
    "id": "shirahama",
    "miles": 56,
    "dmin": 111,
    "rest": false,
    "region": "Wakayama",
    "title": "Capes & White Sand",
    "route": "Katsuura → Shirahama",
    "desc": "A short, scenic coastal day around the peninsula's southern tip. Pause at the photogenic sea pillars of Hashigui-iwa and the sheer Sandanbeki cliffs, take a tuna lunch at Tore-Tore Ichiba, and roll into the white-sand resort of Shirahama by early afternoon (~13:30). The early arrival is the whole point — the first beach base, with the afternoon for the resort: white-sand Shirarahama, the tilted Senjōjiki rock platform, a Sakino-yu surf-line soak and a sunset through Engetsu Island's sea arch.",
    "tags": ["ride", "kid"],
    "gfrom": "Kii-Katsuura, Wakayama, Japan",
    "gto": "Shirahama, Wakayama, Japan",
    "gvia": "Kushimoto, Wakayama, Japan",
    "poi": [
      {
        "name": "Hashigui-iwa",
        "what": "A line of pillar rocks marching out to sea",
        "q": "Hashigui-iwa Kushimoto",
        "slot": "stop",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/180429_Hashiguiiwa_Kushimoto_Wakayama_pref_Japan02bs.jpg/960px-180429_Hashiguiiwa_Kushimoto_Wakayama_pref_Japan02bs.jpg"
      },
      {
        "name": "Sandanbeki",
        "what": "50 m cliffs with a sea-cave lift to the waves",
        "q": "Sandanbeki Shirahama",
        "slot": "scenic",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/131221_Sandanbeki_Shirahama_Wakayama_pref_Japan01bs5.jpg/960px-131221_Sandanbeki_Shirahama_Wakayama_pref_Japan01bs5.jpg",
        "it": ["scenic"]
      },
      {
        "name": "Tore-Tore Ichiba",
        "what": "Giant seafood market for a tuna lunch",
        "q": "Tore-Tore Ichiba Shirahama",
        "slot": "lunch",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/131221_Shirarahama_Beach_Shirahama_Wakayama_pref_Japan05s3.jpg/960px-131221_Shirarahama_Beach_Shirahama_Wakayama_pref_Japan05s3.jpg",
        "it": ["food"]
      },
      {
        "name": "Shirarahama beach",
        "what": "White-sand beach time on arrival; shallow, gentle swimming for the child (afternoon)",
        "q": "Shirarahama Beach Shirahama",
        "slot": "activity",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/131221_Shirarahama_Beach_Shirahama_Wakayama_pref_Japan02s5.jpg/960px-131221_Shirarahama_Beach_Shirahama_Wakayama_pref_Japan02s5.jpg",
        "it": ["scenic"]
      },
      {
        "name": "Senjōjiki",
        "what": "Wave-cut '1,000-tatami' rock terrace, fun to clamber on (afternoon)",
        "q": "Senjojiki Shirahama",
        "slot": "scenic",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/131221_Shirarahama_Beach_Shirahama_Wakayama_pref_Japan05s3.jpg/960px-131221_Shirarahama_Beach_Shirahama_Wakayama_pref_Japan05s3.jpg",
        "it": ["scenic"]
      },
      {
        "name": "Sakino-yu onsen",
        "what": "Rock open-air bath right at the surf line, in use 1,300+ years (afternoon)",
        "q": "Sakinoyu Onsen Shirahama",
        "slot": "activity",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Onsen_in_Nachikatsuura%2C_Japan.jpg/960px-Onsen_in_Nachikatsuura%2C_Japan.jpg",
        "it": ["onsen"]
      },
      {
        "name": "Engetsu Island",
        "what": "Sunset through the 'round-moon' sea arch (early evening)",
        "q": "Engetsu Island Shirahama",
        "slot": "scenic",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Shirahama_Engetsu_Island_03.jpg/960px-Shirahama_Engetsu_Island_03.jpg",
        "wiki": "https://en.wikipedia.org/wiki/Engetsu_Island",
        "it": ["scenic"]
      }
    ],
    "eats": [
      {
        "slot": "coffee",
        "area": "Shirahama (Engetsu Island seafront)",
        "picks": [
          {
            "name": "QUAYTH (キース)",
            "cuisine": "specialty coffee",
            "rating": 4.7,
            "why": "Galiya & Ruslan — owner-roasted single-origin coffee in a sea-view cafe by Engetsu Island; okara/soymilk donuts & a coffee shake for Aslan",
            "kid": false,
            "map": "https://maps.google.com/?cid=11143410138652144840",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/A_small_cup_of_coffee.JPG/960px-A_small_cup_of_coffee.JPG"
          }
        ]
      },
      {
        "slot": "lunch",
        "area": "Tore-Tore Ichiba / Katata (en route into Shirahama)",
        "picks": [
          {
            "name": "Shirasen Shokudo (白鮮食堂)",
            "cuisine": "Kuroshio tuna & seafood teishoku",
            "rating": 4.6,
            "why": "Galiya & Ruslan — top-rated fresh maguro/seafood set near the port",
            "kid": false,
            "map": "https://maps.google.com/?cid=5130477216008432969",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Kaisendon_001.jpg/960px-Kaisendon_001.jpg"
          },
          {
            "name": "TORETORE ICHIBA (とれとれ市場 南紀白浜)",
            "cuisine": "giant seafood market & food court",
            "rating": 3.9,
            "why": "the planned tuna-cutting market stop — huge food court so everyone grazes; plain grilled skewers & rice for Aslan",
            "kid": true,
            "map": "https://maps.google.com/?cid=9780413186048099620",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Sashimi_of_S%C3%A3o_Paulo.jpg/960px-Sashimi_of_S%C3%A3o_Paulo.jpg"
          },
          {
            "name": "Kaisen Sushi Toretore Ichiba (海鮮寿司とれとれ市場)",
            "cuisine": "conveyor-belt sushi",
            "rating": 3.7,
            "why": "Aslan — pick-what-you-see kaiten sushi (plain rice, egg, cucumber rolls) inside the same market",
            "kid": true,
            "map": "https://maps.google.com/?cid=10776434485905267434",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Kaiten-zushi_002.jpg/960px-Kaiten-zushi_002.jpg"
          }
        ]
      },
      {
        "slot": "dinner",
        "area": "Shirahama town",
        "picks": [
          {
            "name": "Gyosai Keishoku Kou (魚菜・軽食 幸)",
            "cuisine": "seafood izakaya / sashimi",
            "rating": 4.6,
            "why": "Galiya & Ruslan — fresh local Nanki seafood and sashimi in town",
            "kid": false,
            "map": "https://maps.google.com/?cid=1087738113559531192",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Sashimi_of_S%C3%A3o_Paulo.jpg/960px-Sashimi_of_S%C3%A3o_Paulo.jpg"
          },
          {
            "name": "Shirahama Key Noodle Dakishimetai",
            "cuisine": "ramen",
            "rating": 4.3,
            "why": "Galiya — a proper bowl of noodles to end the day",
            "kid": false,
            "map": "https://maps.google.com/?cid=10240352576288176698",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Shoyu_Ramen.jpg/960px-Shoyu_Ramen.jpg"
          },
          {
            "name": "Ramen Bakumatsu - Nanki Shirahama",
            "cuisine": "ramen shop with gyoza, karaage & rice sets",
            "rating": 4.1,
            "why": "Aslan — plain ramen plus gyoza/karaage and a rice bowl he'll actually eat",
            "kid": true,
            "map": "https://maps.google.com/?cid=8622937101684774092",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Chicken_karaage_003.jpg/960px-Chicken_karaage_003.jpg"
          }
        ]
      }
    ],
    "localTodo": [
      {
        "time": "~09:45",
        "name": "Hashigui-iwa",
        "what": "line of sea pillars marching out to sea — quick photo + coffee stop",
        "map": "https://www.google.com/maps/search/?api=1&query=Hashigui-iwa%20Kushimoto"
      },
      {
        "time": "~11:15",
        "name": "Sandanbeki Cliffs",
        "what": "50 m cliffs with a sea-cave lift down to the waves",
        "map": "https://www.google.com/maps/search/?api=1&query=Sandanbeki%20Shirahama"
      },
      {
        "time": "~14:30",
        "name": "Shirarahama Beach & Senjōjiki",
        "what": "white quartz sand for shallow swimming, then clamber the tilted '1,000-tatami' rock terrace",
        "map": "https://www.google.com/maps/search/?api=1&query=Shirarahama%20Beach%20Shirahama"
      },
      {
        "time": "~16:00",
        "name": "Sakino-yu Onsen",
        "what": "1,300-year-old open-air rock bath right at the surf line (Galiya's onsen pick)",
        "map": "https://www.google.com/maps/search/?api=1&query=Sakinoyu%20Onsen%20Shirahama"
      },
      {
        "time": "~18:45",
        "name": "Engetsu Island sunset",
        "what": "classic sunset shot through the 'round-moon' natural sea arch",
        "map": "https://www.google.com/maps/search/?api=1&query=Engetsu%20Island%20Shirahama"
      }
    ]
  },
{
    "d": 7,
    "id": "shirahama",
    "miles": 15,
    "rest": true,
    "region": "Wakayama",
    "title": "Shirahama Rest Day",
    "route": "Shirahama (light riding)",
    "desc": "The trip's first beach base — and really the kids' big day out: Adventure World, with giant pandas and a drive-through safari (a full, busy day, so it's energetic rather than truly lazy). For a genuinely low-key alternative, just do Shirarahama beach, the sea-edge Sakino-yu onsen and an Engetsu Island sunset. Rain plan: Adventure World runs mostly under cover, or the indoor Kyoto University Shirahama Aquarium.",
    "luggage": "The base-camp case stays in Osaka storage; your full chain case is here at Shirahama. Forward it onward today, Shirahama → Iya/Oboke — a remote 2-day leg, so it'll be waiting at the Iya ryokan for your Day-9 check-in. Just the overnight bag rides on for the Day-8 ferry.",
    "tags": ["rest", "kid", "onsen", "stay2"],
    "gfrom": "Shirahama, Wakayama, Japan",
    "gto": "Adventure World, Shirahama",
    "gvia": "",
    "poi": [
      {
        "name": "Adventure World",
        "what": "Pandas, safari and a marine park — a full joyful day",
        "q": "Adventure World Shirahama",
        "slot": "activity",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Panda_Adventure_World_Shirahama.JPG/960px-Panda_Adventure_World_Shirahama.JPG",
        "wiki": "https://en.wikipedia.org/wiki/Adventure_World_(Japan)",
        "it": ["kid"]
      },
      {
        "name": "Shirarahama beach",
        "what": "White sand and gentle swimming",
        "q": "Shirarahama Beach Shirahama",
        "slot": "activity",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/131221_Shirarahama_Beach_Shirahama_Wakayama_pref_Japan02s5.jpg/960px-131221_Shirarahama_Beach_Shirahama_Wakayama_pref_Japan02s5.jpg",
        "it": ["scenic"]
      },
      {
        "name": "Sakino-yu onsen",
        "what": "Rock open-air bath right at the surf line",
        "q": "Sakinoyu Onsen Shirahama",
        "slot": "scenic",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/131221_Engetsu_Island_Shirahama_Wakayama_pref_Japan01s3.jpg/960px-131221_Engetsu_Island_Shirahama_Wakayama_pref_Japan01s3.jpg",
        "it": ["onsen"]
      }
    ],
    "eats": [
      {
        "slot": "coffee",
        "area": "Shirahama town",
        "picks": [
          {
            "name": "Kissa Colony",
            "cuisine": "kissaten",
            "rating": 5.0,
            "why": "Ruslan & Galiya — a proper hand-brewed coffee in a cosy old-school kissaten; cake/sweets so Aslan gets a treat too",
            "kid": false,
            "map": "https://maps.google.com/?cid=14791673768714025255",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/A_small_cup_of_coffee.JPG/960px-A_small_cup_of_coffee.JPG"
          }
        ]
      },
      {
        "slot": "lunch",
        "area": "Shirahama beach / Adventure World",
        "picks": [
          {
            "name": "Ramen Bakumatsu - Nanki Shirahama",
            "cuisine": "ramen",
            "rating": 4.1,
            "why": "Galiya — a proper local ramen bowl, with a plain bowl for Aslan too",
            "kid": false,
            "map": "https://maps.google.com/?cid=8622937101684774092",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Shoyu_Ramen.jpg/960px-Shoyu_Ramen.jpg"
          },
          {
            "name": "Shirahama Paradise",
            "cuisine": "hamburgers / fries",
            "rating": 4.7,
            "why": "Aslan — burgers and fries he'll definitely eat after the safari",
            "kid": true,
            "map": "https://maps.google.com/?cid=12401708232370838168",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/NCI_Visuals_Food_Hamburger.jpg/960px-NCI_Visuals_Food_Hamburger.jpg"
          },
          {
            "name": "ALOHA shirahama",
            "cuisine": "Hawaiian café / loco moco",
            "rating": 4.5,
            "why": "Ruslan & Galiya — relaxed beach-resort café with rice plates kids manage",
            "kid": false,
            "map": "https://maps.google.com/?cid=10747776881131157008",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Kaisendon_001.jpg/960px-Kaisendon_001.jpg"
          }
        ]
      },
      {
        "slot": "dinner",
        "area": "Shirahama",
        "picks": [
          {
            "name": "Sushi Kappo Kosushi",
            "cuisine": "sushi",
            "rating": 4.3,
            "why": "Galiya — fresh Nanki sushi at the source, the foodie dinner",
            "kid": false,
            "map": "https://maps.google.com/?cid=1900225647196365823",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Sushi_mini_set_01.jpg/960px-Sushi_mini_set_01.jpg"
          },
          {
            "name": "Hama Shokudo (浜食堂)",
            "cuisine": "seafood teishoku / kaisendon",
            "rating": 4.6,
            "why": "Galiya & Ruslan — hearty local seafood set meals and bowls",
            "kid": false,
            "map": "https://maps.google.com/?cid=14754136528231163036",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Sashimi_of_S%C3%A3o_Paulo.jpg/960px-Sashimi_of_S%C3%A3o_Paulo.jpg"
          },
          {
            "name": "Shirahama Key Noodle Dakishimetai",
            "cuisine": "ramen / gyoza",
            "rating": 4.3,
            "why": "Aslan — plain ramen and gyoza he'll happily eat",
            "kid": true,
            "map": "https://maps.google.com/?cid=10240352576288176698",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Shoyu_Ramen.jpg/960px-Shoyu_Ramen.jpg"
          }
        ]
      }
    ],
    "localTodo": [
      {
        "time": "~10:00",
        "name": "Adventure World",
        "what": "giant pandas, drive-through safari and a marine park — the trip's biggest kid day (full, busy day out)",
        "map": "https://www.google.com/maps/search/?api=1&query=Adventure%20World%20Shirahama"
      },
      {
        "time": "~14:30",
        "name": "Shirarahama Beach",
        "what": "dazzling white quartz sand, shallow gentle swimming for Aslan",
        "map": "https://www.google.com/maps/search/?api=1&query=Shirarahama%20Beach%20Shirahama"
      },
      {
        "time": "~16:00",
        "name": "Sakino-yu Onsen",
        "what": "1,300-year-old rock open-air bath cut right at the surf line — Galiya's traditional onsen pick",
        "map": "https://www.google.com/maps/search/?api=1&query=Sakinoyu%20Onsen%20Shirahama"
      },
      {
        "time": "~17:00",
        "name": "Engetsu Island",
        "what": "sunset through the natural 'round-moon' sea arch",
        "map": "https://www.google.com/maps/search/?api=1&query=Engetsu%20Island%20Shirahama"
      }
    ]
  },
{
    "d": 8,
    "id": "tokushima",
    "miles": 91,
    "dmin": 166,
    "rest": false,
    "region": "Tokushima",
    "title": "Ferry to Shikoku",
    "ferry": true,
    "route": "Shirahama → Wakayama → ferry → Naruto",
    "desc": "Rather than backtrack through Osaka, the loop crosses the water. Ride up to Wakayama Port (a castle stop on the way) and roll the bikes straight onto the Nankai Ferry for the ~2h15m sailing to Tokushima — a restful break and a small adventure for the child. Land beside Naruto, where huge tidal whirlpools churn under the Ōnaruto Bridge.",
    "tags": ["ride", "kid"],
    "gfrom": "Shirahama, Wakayama, Japan",
    "gto": "Naruto, Tokushima, Japan",
    "gvia": "Wakayama Port, Japan",
    "poi": [
      {
        "name": "Wakayama Castle",
        "what": "Hilltop keep before the port",
        "q": "Wakayama Castle",
        "slot": "stop",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Wakayama_Castle_Keep_Tower_20210724-1.jpg/960px-Wakayama_Castle_Keep_Tower_20210724-1.jpg",
        "wiki": "https://en.wikipedia.org/wiki/Wakayama_Castle",
        "it": ["castle"]
      },
      {
        "name": "Wakayama chūka-soba",
        "what": "The city's signature thin-noodle soy-tonkotsu ramen, classically eaten with a side of pressed haya-zushi mackerel sushi while you wait — a perfect ramen-and-sushi lunch near the castle and port before the ferry.",
        "q": "Ide Shoten Wakayama",
        "slot": "lunch",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Naruto_whirlpools_20170609-2.jpg/960px-Naruto_whirlpools_20170609-2.jpg",
        "it": ["food", "castle"]
      },
      {
        "name": "Nankai Ferry",
        "what": "~2h15m crossing to Shikoku, bikes aboard (first-come, no reservations)",
        "q": "Nankai Ferry Wakayama Port",
        "slot": "activity",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Oct2025._Onboard_a_ferry_from_Wakayama_to_Tokushima%2C_Japan_01.jpg/960px-Oct2025._Onboard_a_ferry_from_Wakayama_to_Tokushima%2C_Japan_01.jpg"
      },
      {
        "name": "Naruto whirlpools",
        "what": "Uzunomichi glass-floor walkway over the strait",
        "q": "Uzunomichi Naruto",
        "slot": "scenic",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Naruto_whirlpools_20170609-1.jpg/960px-Naruto_whirlpools_20170609-1.jpg",
        "wiki": "https://en.wikipedia.org/wiki/Naruto_whirlpools",
        "it": ["scenic"]
      },
      {
        "name": "Ōtsuka Museum of Art (option)",
        "what": "Japan's largest exhibition space — 1,000+ full-size ceramic reproductions of the world's masterpieces (the Sistine Chapel ceiling recreated whole, the Mona Lisa, Monet's water lilies) that you can photograph and even touch, which makes it genuinely fun with a 6-year-old. A 2–4 h commitment, so don't force it onto this already-full ferry day — best as a relaxed Day-9 morning before riding into Iya, or the rainy-day fallback. Closed Mondays — check the weekday.",
        "q": "Otsuka Museum of Art Naruto",
        "slot": "stop",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Naruto_Whirlpools_taken_4-21-2008.jpg/960px-Naruto_Whirlpools_taken_4-21-2008.jpg",
        "wiki": "https://en.wikipedia.org/wiki/Otsuka_Museum_of_Art",
        "it": ["art", "kid"]
      },
      {
        "name": "Tokushima ramen",
        "what": "The local prize on the far shore — a dark, sweet-savoury soy-tonkotsu broth topped with stewed pork belly and a raw egg, with rice on the side: an easy first dinner by the strait on landing.",
        "q": "Tokushima Ramen",
        "slot": "dinner",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Onaruto-bridge_and_Naruto_Channel%2CNaruto-city%2CJapan.JPG/960px-Onaruto-bridge_and_Naruto_Channel%2CNaruto-city%2CJapan.JPG",
        "it": ["food"]
      }
    ],
    "ramenTrail": [
      {
        "style": "Chūka-soba",
        "shop": "Ide Shoten 井出商店",
        "shopUrl": "https://maps.google.com/?cid=16098671254010911637",
        "city": "Wakayama City",
        "slot": "lunch"
      },
      {
        "style": "Tokushima ramen",
        "shop": "Chūka Soba Inotani 中華そば いのたに",
        "shopUrl": "https://maps.google.com/?cid=16395492876013054298",
        "city": "Tokushima City",
        "slot": "dinner"
      }
    ],
    "eats": [
      {
        "slot": "coffee",
        "area": "Naruto (next-morning before riding on)",
        "picks": [
          {
            "name": "ナルトロースター by Hirundo Coffee (Naruto Roaster)",
            "cuisine": "specialty coffee",
            "rating": 4.8,
            "why": "Galiya & Ruslan — a genuine small-batch specialty roaster right in central Naruto for a proper morning brew; relaxed enough to bring Aslan for a juice/treat",
            "kid": false,
            "map": "https://maps.google.com/?cid=8542385708703777857",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/A_small_cup_of_coffee.JPG/960px-A_small_cup_of_coffee.JPG"
          }
        ]
      },
      {
        "slot": "lunch",
        "area": "Wakayama City (before the port)",
        "picks": [
          {
            "name": "Ramen Marui (本家アロチ 丸高中華そば系)",
            "cuisine": "Wakayama chūka-soba ramen",
            "rating": 4.1,
            "why": "Galiya — the city's signature thin-noodle soy-tonkotsu bowl, with haya-zushi mackerel sushi on the side",
            "kid": false,
            "map": "https://maps.google.com/?cid=5976911720099818815",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Wakayamaramen222.jpg/960px-Wakayamaramen222.jpg"
          },
          {
            "name": "Masayoshi Ramen (正善)",
            "cuisine": "Wakayama chūka-soba ramen",
            "rating": 4.0,
            "why": "Ruslan — hearty local ramen, big and well-loved (1,400+ reviews)",
            "kid": false,
            "map": "https://maps.google.com/?cid=3460900872369840909",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Masayoshi_ramen_20240422.jpg/960px-Masayoshi_ramen_20240422.jpg"
          },
          {
            "name": "Udon no Ōtaman (うどんの大田萬)",
            "cuisine": "udon / plain noodles",
            "rating": 4.1,
            "why": "Aslan — simple plain udon and rice he'll actually eat",
            "kid": true,
            "map": "https://maps.google.com/?cid=771188512389577753",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Kake_udon_by_udono.jpg/960px-Kake_udon_by_udono.jpg"
          }
        ]
      },
      {
        "slot": "dinner",
        "area": "Naruto",
        "picks": [
          {
            "name": "Donoura Naruto (どの浦 鳴門店)",
            "cuisine": "Tokushima ramen",
            "rating": 4.3,
            "why": "Galiya — the local dark sweet-soy tonkotsu bowl with stewed pork belly, the first-dinner ramen on landing",
            "kid": false,
            "map": "https://maps.google.com/?cid=18023051851105388920",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Tokushima_Ramen%2C_Men-Oh_-_May_2%2C_2018.jpg/960px-Tokushima_Ramen%2C_Men-Oh_-_May_2%2C_2018.jpg"
          },
          {
            "name": "Sushikatsu (すし勝)",
            "cuisine": "sushi — local Naruto-dai sea bream",
            "rating": 4.3,
            "why": "Galiya & Ruslan — Naruto's prize tide-fed sea bream as sashimi/nigiri",
            "kid": false,
            "map": "https://maps.google.com/?cid=9481479808904369613",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Nigiri_Sushi_%2825966163204%29.jpg/960px-Nigiri_Sushi_%2825966163204%29.jpg"
          },
          {
            "name": "Tamura Udon (田村うどん)",
            "cuisine": "udon / plain noodles",
            "rating": 4.1,
            "why": "Aslan — a clean plain udon bowl, an easy safe dinner",
            "kid": true,
            "map": "https://maps.google.com/?cid=8786397789103930994",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Kake_udon_by_udono.jpg/960px-Kake_udon_by_udono.jpg"
          }
        ]
      }
    ],
    "localTodo": [
      {
        "time": "~11:15",
        "name": "Wakayama Castle",
        "what": "hilltop keep and gardens for a leg-stretch before the port",
        "map": "https://www.google.com/maps/search/?api=1&query=Wakayama%20Castle"
      },
      {
        "time": "~14:00",
        "name": "Nankai Ferry (Wakayama Port)",
        "what": "bikes ride straight on for the ~2h15m crossing — first-come, no reservations, be at the ticket office 30+ min early",
        "map": "https://www.google.com/maps/search/?api=1&query=Nankai%20Ferry%20Wakayama%20Port"
      },
      {
        "time": "~17:00",
        "name": "Uzunomichi whirlpool walkway",
        "what": "glass-floored walk 45 m above the Naruto whirlpools under the Ōnaruto Bridge — a safe thrill for Aslan",
        "map": "https://www.google.com/maps/search/?api=1&query=Uzunomichi%20Naruto"
      },
      {
        "time": "opt.",
        "name": "Ōtsuka Museum of Art",
        "what": "1,000+ touchable full-size ceramic reproductions of world masterpieces — better saved for a relaxed Day-10 morning (closed Mon)",
        "map": "https://www.google.com/maps/search/?api=1&query=Otsuka%20Museum%20of%20Art%20Naruto"
      }
    ]
  },
{
    "d": 9,
    "id": "iya",
    "miles": 75,
    "dmin": 125,
    "rest": false,
    "region": "Shikoku",
    "title": "Into Iya Valley",
    "route": "Naruto → Iya / Oboke",
    "desc": "Follow the Yoshino River up into Shikoku's dramatic gorge country on easy, well-surfaced two-lane roads — a calm, scenic climb to a remote onsen ryokan. The Oboke Gorge is the lunch stop; the Iya valley unfolds above it. Because the riding is short and the day is built around an early arrival, this is the natural slot to give the Ōtsuka Museum of Art back in Naruto a proper 2–3 h before turning inland — leave mid-morning and you still reach the Iya ryokan in good afternoon time (skip it on a Monday, when it's closed, or if anyone wants the easier roll-out).",
    "tags": ["ride", "onsen"],
    "gfrom": "Naruto, Tokushima, Japan",
    "gto": "Oboke, Tokushima, Japan",
    "gvia": "Tokushima, Japan",
    "poi": [
      {
        "name": "Tokushima riverside",
        "what": "Coffee and a leg-stretch before the hills",
        "q": "Tokushima Station",
        "slot": "coffee",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Onaruto-bridge_and_Naruto_Channel%2CNaruto-city%2CJapan.JPG/960px-Onaruto-bridge_and_Naruto_Channel%2CNaruto-city%2CJapan.JPG"
      },
      {
        "name": "Oboke Gorge",
        "what": "Gorge-side lunch and a sightseeing boat option",
        "q": "Oboke Gorge",
        "slot": "lunch",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Tokushima_Miyoshi_Oboke_Gorge_Of_Yoshino_River_2.JPG/960px-Tokushima_Miyoshi_Oboke_Gorge_Of_Yoshino_River_2.JPG",
        "it": ["food", "scenic"]
      },
      {
        "name": "Iya Valley viewpoint",
        "what": "Vine bridge and gorge scenery",
        "q": "Iya Valley",
        "slot": "scenic",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Iya_Valley_a.jpeg/960px-Iya_Valley_a.jpeg",
        "wiki": "https://en.wikipedia.org/wiki/Iya_Valley",
        "it": ["scenic", "kid"]
      }
    ],
    "eats": [
      {
        "slot": "coffee",
        "area": "Tokushima City",
        "picks": [
          {
            "name": "Toyotomi Coffee (豊富珈琲)",
            "cuisine": "specialty coffee",
            "rating": 4.5,
            "why": "Ruslan & Galiya — Tokushima's own self-roasting specialty house for a proper cup before the hills; cake & juice on hand for Aslan",
            "kid": false,
            "map": "https://maps.google.com/?cid=13239288018006348160",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/A_small_cup_of_coffee.JPG/960px-A_small_cup_of_coffee.JPG"
          }
        ]
      },
      {
        "slot": "lunch",
        "area": "Oboke Gorge",
        "picks": [
          {
            "name": "そば茶屋 (Soba Chaya)",
            "cuisine": "Iya soba (handmade buckwheat noodles)",
            "rating": 4.3,
            "why": "Galiya — the valley's own rustic Iya soba right by the gorge",
            "kid": false,
            "map": "https://maps.google.com/?cid=1637649177588569982",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Zaru_soba_by_spinachdip.jpg/960px-Zaru_soba_by_spinachdip.jpg"
          },
          {
            "name": "Cafe & Jibie (道の駅 大歩危 / Michi-no-Eki Ōboke)",
            "cuisine": "roadside-station cafe — curry rice, udon, plates",
            "rating": 4.3,
            "why": "Aslan — casual gorge-view rest stop with simple curry rice & udon he'll eat",
            "kid": true,
            "map": "https://maps.google.com/?cid=3489408883758792596",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Beef_curry_rice_003.jpg/960px-Beef_curry_rice_003.jpg"
          },
          {
            "name": "Restaurant Iyabashi",
            "cuisine": "udon & teishoku set meals",
            "rating": 4.1,
            "why": "Ruslan — hearty udon/teishoku near the gorge, plain udon also works for Aslan",
            "kid": true,
            "map": "https://maps.google.com/?cid=12655428176554131611",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Kake_udon_by_udono.jpg/960px-Kake_udon_by_udono.jpg"
          }
        ]
      },
      {
        "slot": "dinner",
        "area": "Iya Valley / Oboke",
        "picks": [
          {
            "name": "清流のそば処 祖谷美人 (Iya Bijin)",
            "cuisine": "handmade Iya soba & local set meals",
            "rating": 4.0,
            "why": "Galiya — celebrated mountain-soba house perched over the gorge near the vine bridge",
            "kid": false,
            "map": "https://maps.google.com/?cid=17357317293131209474",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Zaru_soba_by_spinachdip.jpg/960px-Zaru_soba_by_spinachdip.jpg"
          },
          {
            "name": "おのみ家 (Onomiya)",
            "cuisine": "home-style Japanese teishoku / local fare",
            "rating": 4.7,
            "why": "Ruslan & Galiya — warm valley cooking and rice-based set meals in Nishi-Iya",
            "kid": false,
            "map": "https://maps.google.com/?cid=17047889143403398966",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/d/d7/Tonjiru_teishoku.jpg"
          },
          {
            "name": "Sanukiya (讃岐屋, Ikeda)",
            "cuisine": "self-serve Sanuki udon",
            "rating": 4.2,
            "why": "Aslan — plain udon & rice, famiresu-style; the kid-safe fallback down in Ikeda since the valley is tiny (most ryokan also serve a child-friendly dinner with plain rice & dekomawashi skewers)",
            "kid": true,
            "map": "https://maps.google.com/?cid=13602908240971594126",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Sanuki_udon_by_open-arms.jpg/960px-Sanuki_udon_by_open-arms.jpg"
          }
        ]
      }
    ],
    "localTodo": [
      {
        "time": "~09:30",
        "name": "Ōtsuka Museum of Art (optional)",
        "what": "1,000+ touchable full-size ceramic reproductions of world masterpieces in Naruto — a 2–3 h art highlight before turning inland; closed Mondays, so check the weekday",
        "map": "https://www.google.com/maps/search/?api=1&query=Otsuka%20Museum%20of%20Art%20Naruto"
      },
      {
        "time": "~12:30",
        "name": "Oboke Gorge",
        "what": "jade Yoshino-River gorge — ride the sightseeing boat under sculpted schist cliffs and stop at the Lapis Oboke yokai-folklore museum (kid hit)",
        "map": "https://www.google.com/maps/search/?api=1&query=Oboke%20Gorge"
      },
      {
        "time": "~15:30",
        "name": "Iya-no-Kazurabashi viewpoint",
        "what": "first look at the live-vine bridge and the gorge scenery above the ryokan (the full crossing is saved for tomorrow's rest day)",
        "map": "https://www.google.com/maps/search/?api=1&query=Iya%20Kazurabashi%20vine%20bridge"
      },
      {
        "time": "~16:00",
        "name": "Onsen ryokan soak",
        "what": "settle into the riverside onsen ryokan — several run a private cable-car down to open-air baths in the gorge; the early arrival is for a long, slow soak",
        "map": "https://www.google.com/maps/search/?api=1&query=Iya%20Onsen%20ryokan"
      }
    ]
  },
{
    "d": 10,
    "id": "iya",
    "miles": 25,
    "rest": true,
    "region": "Shikoku",
    "title": "Iya Rest Day",
    "route": "Iya Valley (light riding)",
    "desc": "Slow mountain time far from any city: the Kazurabashi vine bridge (hold a small child's hand on the slatted gaps), the peeing-boy statue viewpoint, and an Oboke Gorge sightseeing boat, with the scarecrow village of Nagoro a deeper optional drive. Downtime is the riverside onsen ryokan. Rain plan: the indoor Lapis Ōboke rock-and-yōkai museum and a hearth dekomawashi lunch.",
    "luggage": "The leapfrog node: forward the chain case today from the Iya ryokan desk to the Dōgo/Matsuyama hotel for the Day-14 check-in (allow 2 days out of remote Iya). The chain deliberately skips the Shimanto rest base — carry the soft overnight bag through Kōchi (Day 11) and both Shimanto nights, then rejoin the full case at Dōgo.",
    "tags": ["rest", "kid", "onsen", "stay2"],
    "gfrom": "Oboke, Tokushima, Japan",
    "gto": "Iya Kazurabashi, Japan",
    "gvia": "",
    "poi": [
      {
        "name": "Kazurabashi vine bridge",
        "what": "Cross the swaying vine bridge",
        "q": "Iya Kazurabashi",
        "slot": "activity",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Iya_Kazurabashi-4.jpg/960px-Iya_Kazurabashi-4.jpg",
        "wiki": "https://en.wikipedia.org/wiki/Iya_Valley",
        "it": ["scenic", "kid"]
      },
      {
        "name": "Oboke Gorge boat",
        "what": "Sightseeing boat on the Yoshino",
        "q": "Oboke Gorge",
        "slot": "activity",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Tokushima_Miyoshi_Oboke_Gorge_Of_Yoshino_River_2.JPG/960px-Tokushima_Miyoshi_Oboke_Gorge_Of_Yoshino_River_2.JPG",
        "it": ["nintendo", "scenic"]
      },
      {
        "name": "Peeing Boy statue",
        "what": "Cliff-edge viewpoint",
        "q": "Iya no Shobenkozo",
        "slot": "scenic",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Iya_vine_bridge_%286551507515%29.jpg/960px-Iya_vine_bridge_%286551507515%29.jpg",
        "it": ["scenic", "kid"]
      },
      {
        "name": "Nagoro Scarecrow Village",
        "what": "Quirky kid stop",
        "q": "Nagoro Scarecrow Village",
        "slot": "scenic",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Crab_crawling_around_in_the_hills_of_Iya_Valley_%286453587885%29.jpg/960px-Crab_crawling_around_in_the_hills_of_Iya_Valley_%286453587885%29.jpg",
        "it": ["kid"]
      }
    ],
    "eats": [
      {
        "slot": "coffee",
        "area": "Ōboke (near the gorge station)",
        "picks": [
          {
            "name": "hanan coffee (ハナンコーヒー)",
            "cuisine": "specialty coffee",
            "rating": 4.9,
            "why": "Ruslan/Galiya — a genuine self-roast specialty cafe deep in the gorge, the best brew for miles; pre-boat morning stop, cake/soft drinks keep Aslan happy",
            "kid": false,
            "map": "https://maps.google.com/?cid=2482114103176376026",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Coffee_Pour_Over_Setup.jpg/960px-Coffee_Pour_Over_Setup.jpg"
          }
        ]
      },
      {
        "slot": "lunch",
        "area": "Iya Valley — near the Kazurabashi vine bridge",
        "picks": [
          {
            "name": "Iya Bijin (清流のそば処 祖谷美人)",
            "cuisine": "Iya soba (handmade mountain buckwheat)",
            "rating": 4.0,
            "why": "Galiya — the valley's signature soba eaten at the source, on a gorge-view terrace",
            "kid": false,
            "map": "https://maps.google.com/?cid=17357317293131209474",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Iya_Soba.jpg/960px-Iya_Soba.jpg"
          },
          {
            "name": "Senkichi (祖谷 千吉)",
            "cuisine": "Iya soba + dekomawashi hearth skewers & rice",
            "rating": 4.2,
            "why": "Aslan — mild grilled potato/tofu skewers and plain rice he'll eat; soba for the grown-ups",
            "kid": true,
            "map": "https://maps.google.com/?cid=18342506515780846740",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Dengaku_%282384193986%29.jpg/960px-Dengaku_%282384193986%29.jpg"
          },
          {
            "name": "Soba-jaya (そば茶屋)",
            "cuisine": "Iya soba teahouse",
            "rating": 4.3,
            "why": "Ruslan/Galiya — well-rated soba backup on the Yamashiro side toward Ōboke",
            "kid": false,
            "map": "https://maps.google.com/?cid=1637649177588569982",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Iya_Soba.jpg/960px-Iya_Soba.jpg"
          }
        ]
      },
      {
        "slot": "snack",
        "area": "Michi-no-eki Ōboke (gorge roadside station)",
        "picks": [
          {
            "name": "Cafe & Jibie (道の駅 大歩危)",
            "cuisine": "Cafe — coffee, soft-serve & local game snacks",
            "rating": 4.3,
            "why": "Aslan — soft-serve and an easy snack between the boat and the ryokan; coffee for Ruslan",
            "kid": true,
            "map": "https://maps.google.com/?cid=3489408883758792596",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/A_small_cup_of_coffee.JPG/960px-A_small_cup_of_coffee.JPG"
          }
        ]
      },
      {
        "slot": "dinner",
        "area": "Iya / Ōboke (onsen ryokan, or casual nearby)",
        "picks": [
          {
            "name": "Onsen-ryokan half-board kaiseki",
            "cuisine": "Iya kaiseki — Iya soba, amego river fish, dekomawashi",
            "rating": 4.5,
            "why": "Galiya — the genuine rest-day highlight; book the in-house dinner when you reserve the room",
            "kid": false,
            "map": "https://www.google.com/maps/search/?api=1&query=Iya%20Onsen%20ryokan%20dinner%20Miyoshi",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Ikaho_dinner_01.jpg/960px-Ikaho_dinner_01.jpg"
          },
          {
            "name": "Isuba (イスバ)",
            "cuisine": "Wood-fired pizza & pasta",
            "rating": 4.1,
            "why": "Aslan — plain Margherita pizza is the sure-thing kid dinner if you eat out",
            "kid": true,
            "map": "https://maps.google.com/?cid=12401291956266270519",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Margherita_pizza_on_plate.jpg/960px-Margherita_pizza_on_plate.jpg"
          },
          {
            "name": "Yamaya Cafe, Bar & Guesthouse",
            "cuisine": "Casual riverside cafe-bar",
            "rating": 4.8,
            "why": "Ruslan/Galiya — relaxed Ōboke riverside spot for a drink and easy plates if not dining in",
            "kid": false,
            "map": "https://maps.google.com/?cid=5681294211031365048",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/A_small_cup_of_coffee.JPG/960px-A_small_cup_of_coffee.JPG"
          }
        ]
      }
    ],
    "localTodo": [
      {
        "time": "~09:30",
        "name": "Morning onsen soak",
        "what": "Lazy rest-day start in the riverside ryokan baths (several have a private cable-car down to open-air baths in the gorge)",
        "map": "https://www.google.com/maps/search/?api=1&query=Iya%20Onsen%20ryokan%20Miyoshi%20Tokushima"
      },
      {
        "time": "~10:30",
        "name": "Iya-no-Kazurabashi vine bridge",
        "what": "Cross the 45 m live-vine bridge over the gorge — hold Aslan's hand tightly on the slatted gaps",
        "map": "https://www.google.com/maps/search/?api=1&query=Iya%20Kazurabashi"
      },
      {
        "time": "~11:30",
        "name": "Peeing-Boy statue (Shōben-kozō)",
        "what": "Bronze boy on a cliff edge 200 m above the river — quick photo viewpoint on the gorge road",
        "map": "https://www.google.com/maps/search/?api=1&query=Iya%20no%20Shobenkozo"
      },
      {
        "time": "~13:30",
        "name": "Ōboke Gorge sightseeing boat",
        "what": "Easy 30-min boat through jade Yoshino-river cliffs; pairs with the Lapis Ōboke yōkai museum next door if it rains",
        "map": "https://www.google.com/maps/search/?api=1&query=Oboke%20Gorge%20sightseeing%20boat"
      },
      {
        "time": "optional",
        "name": "Nagoro Scarecrow Village",
        "what": "Quirky kid stop, but a long winding ~1 h drive deeper up the valley — only if everyone's keen",
        "map": "https://www.google.com/maps/search/?api=1&query=Nagoro%20Scarecrow%20Village"
      }
    ]
  },
{
    "d": 11,
    "id": "kochi",
    "miles": 75,
    "dmin": 180,
    "rest": false,
    "region": "Shikoku",
    "title": "Down to the Coast",
    "route": "Iya → Kochi",
    "desc": "River valleys open out to the Pacific. A kid-favourite Anpanman stop, then Kōchi Castle and Katsurahama beach in the evening.",
    "tags": ["ride", "kid"],
    "gfrom": "Oboke, Tokushima, Japan",
    "gto": "Kochi, Japan",
    "gvia": "Otoyo, Kochi, Japan",
    "poi": [
      {
        "name": "Otoyo michi-no-eki",
        "what": "Roadside coffee break",
        "q": "Michi-no-Eki Otoyo",
        "slot": "coffee",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Kochi_Castle08s3872.jpg/960px-Kochi_Castle08s3872.jpg"
      },
      {
        "name": "Anpanman Museum",
        "what": "Yanase Takashi Memorial Hall in Kami — a sure hit for a 6-year-old",
        "q": "Anpanman Museum Kami Kochi",
        "slot": "stop",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Kami_Kochi_Yanase_Takashi_Memorial_Hall.jpg/960px-Kami_Kochi_Yanase_Takashi_Memorial_Hall.jpg",
        "wiki": "https://en.wikipedia.org/wiki/Anpanman",
        "it": ["kid"]
      },
      {
        "name": "Kochi Castle & Hirome Market",
        "what": "Original keep, then katsuo no tataki — straw-flame-seared bonito, Kōchi's soul dish — at the lively shared-table Hirome Market hall: a foodie, kid and market hit in one.",
        "q": "Kochi Castle",
        "slot": "lunch",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Kochi_Castle08s3872.jpg/960px-Kochi_Castle08s3872.jpg",
        "wiki": "https://en.wikipedia.org/wiki/K%C5%8Dchi_Castle",
        "it": ["food", "castle"]
      },
      {
        "name": "Katsurahama",
        "what": "Pacific beach & Ryōma statue",
        "q": "Katsurahama",
        "slot": "scenic",
        "img": "https://upload.wikimedia.org/wikipedia/commons/b/b2/Katsurahama%2C_2005.jpg",
        "wiki": "https://en.wikipedia.org/wiki/Katsurahama",
        "it": ["scenic"]
      }
    ],
    "eats": [
      {
        "slot": "coffee",
        "area": "Central Kōchi (Ozuchō)",
        "picks": [
          {
            "name": "GRAYGE COFFEE ROASTER",
            "cuisine": "specialty coffee",
            "rating": 4.4,
            "why": "Ruslan & Galiya — a proper small-batch Kōchi roaster for a single-origin pour-over after arrival; relaxed enough for a juice or treat for Aslan",
            "kid": false,
            "map": "https://maps.google.com/?cid=5093153783662767099",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/A_small_cup_of_coffee.JPG/960px-A_small_cup_of_coffee.JPG"
          }
        ]
      },
      {
        "slot": "lunch",
        "area": "Hirome Market, central Kōchi",
        "picks": [
          {
            "name": "Myojinmaru — Hirome Market Store (明神丸 ひろめ市場店)",
            "cuisine": "katsuo no tataki (straw-flame-seared bonito)",
            "rating": 4.2,
            "why": "Galiya & Ruslan — watch the bonito flame over burning straw and eat it minutes later, Kōchi's soul dish at the source",
            "kid": false,
            "map": "https://maps.google.com/?cid=685507622552095731",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Bonito_tataki_at_Hirome_Market_%286453600279%29.jpg/960px-Bonito_tataki_at_Hirome_Market_%286453600279%29.jpg"
          },
          {
            "name": "Hirome Market (ひろめ市場)",
            "cuisine": "covered food hall — many stalls",
            "rating": 4.1,
            "why": "Aslan — shared-table hall with karaage, fries, plain rice and gyoza stalls so the picky eater finds something easy",
            "kid": true,
            "map": "https://maps.google.com/?cid=11069022924402658269",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Karaage.jpg/960px-Karaage.jpg"
          },
          {
            "name": "Teuchi Udon Fujiya (手打うどん 藤家)",
            "cuisine": "handmade udon",
            "rating": 4.4,
            "why": "Aslan — calm sit-down alternative with plain udon he'll actually eat, near the castle",
            "kid": true,
            "map": "https://maps.google.com/?cid=17212162267710166824",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Bowl_of_Kitsune_Udon.jpg/960px-Bowl_of_Kitsune_Udon.jpg"
          }
        ]
      },
      {
        "slot": "dinner",
        "area": "Central Kōchi (Obiyamachi / Harimayachō)",
        "picks": [
          {
            "name": "Tosaryori Tsukasa (土佐料理 司)",
            "cuisine": "Tosa cuisine — sawachi platters & katsuo tataki",
            "rating": 4.1,
            "why": "Galiya — the full Tosa party-style sawachi spread of sashimi, sushi and seared bonito",
            "kid": false,
            "map": "https://maps.google.com/?cid=13999983515317910621",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/0/08/SawachiDish_Sushi_and_Tataki01.jpg"
          },
          {
            "name": "Ramen shop Kuraki (らーめん蔵木)",
            "cuisine": "ramen & gyoza",
            "rating": 4.3,
            "why": "Galiya's noodles plus a plain bowl & gyoza for Aslan",
            "kid": true,
            "map": "https://maps.google.com/?cid=14938791122352366488",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/4/42/Ramen.jpg"
          },
          {
            "name": "Genzo Obiyamachi (とんかつ 源蔵 帯屋町)",
            "cuisine": "tonkatsu",
            "rating": 4.1,
            "why": "Aslan — crisp breaded katsu and rice, an easy win for the picky eater",
            "kid": true,
            "map": "https://maps.google.com/?cid=8199549859830906235",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Tonkatsu.jpg/960px-Tonkatsu.jpg"
          }
        ]
      }
    ],
    "localTodo": [
      {
        "time": "~09:45",
        "name": "Otoyo michi-no-eki",
        "what": "first roadside coffee/leg-stretch stop coming off the Iya mountains",
        "map": "https://www.google.com/maps/search/?api=1&query=Michi-no-Eki%20Otoyo%20Kochi"
      },
      {
        "time": "~11:00",
        "name": "Anpanman Museum (Yanase Takashi Memorial Hall)",
        "what": "home-town museum of Japan's beloved toddler superhero in Kami — a near-guaranteed hit for Aslan",
        "map": "https://www.google.com/maps/search/?api=1&query=Anpanman%20Museum%20Kami%20Kochi"
      },
      {
        "time": "~15:00",
        "name": "Kōchi Castle",
        "what": "climb the original 1747 keep (one of only 12 surviving) and tour the lord's palace below — kid-friendly",
        "map": "https://www.google.com/maps/search/?api=1&query=Kochi%20Castle"
      },
      {
        "time": "~16:30",
        "name": "Katsurahama",
        "what": "crescent Pacific beach (look-don't-swim), the Sakamoto Ryōma statue and a small aquarium",
        "map": "https://www.google.com/maps/search/?api=1&query=Katsurahama"
      }
    ]
  },
{
    "d": 12,
    "id": "shimanto",
    "miles": 128,
    "dmin": 273,
    "rest": false,
    "region": "Shikoku",
    "title": "The Clear River",
    "route": "Kochi → Shimanto River",
    "desc": "The longest riding day of the loop — but well inside the comfort cap and bracketed by rest. Follow the Shimanto, Japan's last free-flowing clear river, past its low submersible bridges, after a stop at the famously translucent Niyodo Blue.",
    "luggage": "Ride with the overnight bag only. Shimanto is leapfrogged — deep rural Shikoku is 2-day delivery — so your chain case is already in transit from Iya to Dōgo (arriving Day 14) and you travel light through both Shimanto nights.",
    "tags": ["ride", "kid"],
    "gfrom": "Kochi, Japan",
    "gto": "Shimanto, Kochi, Japan",
    "gvia": "Susaki, Kochi, Japan",
    "poi": [
      {
        "name": "Niyodo Blue river",
        "what": "Famous translucent-blue river",
        "q": "Niyodo River",
        "slot": "stop",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Shimanto_River_And_Shimanto_River_Bridge_1.JPG/960px-Shimanto_River_And_Shimanto_River_Bridge_1.JPG",
        "wiki": "https://en.wikipedia.org/wiki/Niyodo_River"
      },
      {
        "name": "Susaki",
        "what": "Nabeyaki-ramen coffee stop",
        "q": "Susaki Kochi",
        "slot": "coffee",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Yodo_Line_and_Shimanto_river.JPG/960px-Yodo_Line_and_Shimanto_river.JPG",
        "it": ["food"]
      },
      {
        "name": "Tatsukushi coast",
        "what": "Seaside lunch",
        "q": "Tatsukushi",
        "slot": "lunch",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/ShimantoRiverFromNakabaRestarea.JPG/960px-ShimantoRiverFromNakabaRestarea.JPG",
        "it": ["food"]
      },
      {
        "name": "Sada Chinkabashi",
        "what": "Shimanto 'sinking bridge' photo",
        "q": "Sada Chinkabashi Shimanto",
        "slot": "scenic",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Sagawa-bridge%2CShimanto-cho%2CJapan.JPG/960px-Sagawa-bridge%2CShimanto-cho%2CJapan.JPG",
        "it": ["scenic"]
      }
    ],
    "ramenTrail": [
      {
        "style": "Nabeyaki ramen",
        "shop": "Hashimoto Shokudō 橋本食堂",
        "shopUrl": "https://maps.google.com/?cid=5613975438265449042",
        "city": "Susaki",
        "slot": "lunch"
      }
    ],
    "eats": [
      {
        "slot": "coffee",
        "area": "Kochi (departure)",
        "picks": [
          {
            "name": "GRAYGE COFFEE ROASTER",
            "cuisine": "specialty coffee",
            "rating": 4.4,
            "why": "Ruslan & Galiya — central-Kochi third-wave roaster for a proper morning cup before the loop's longest ride; mellow drinks/juice for Aslan",
            "kid": false,
            "map": "https://maps.google.com/?cid=5093153783662767099",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/A_small_cup_of_coffee.JPG/960px-A_small_cup_of_coffee.JPG"
          }
        ]
      },
      {
        "slot": "lunch",
        "area": "Susaki",
        "picks": [
          {
            "name": "Mayumi no Mise (まゆみの店)",
            "cuisine": "Susaki nabeyaki ramen",
            "rating": 4.1,
            "why": "Galiya — Susaki's signature hot-pot ramen (chicken broth, thin noodles, egg) at the town's most famous shop",
            "kid": false,
            "map": "https://maps.google.com/?cid=602723661575591055",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Nabeyaki_ramen_01.jpg/960px-Nabeyaki_ramen_01.jpg",
            "trail": true
          },
          {
            "name": "Hashimoto Shokudo",
            "cuisine": "shokudo diner / nabeyaki ramen",
            "rating": 4.3,
            "why": "Aslan — a homey diner where the mild chicken-broth nabeyaki ramen plus plain rice/sides suit a picky eater",
            "kid": true,
            "map": "https://maps.google.com/?cid=5613975438265449042",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Nabeyaki_ramen_02.jpg/960px-Nabeyaki_ramen_02.jpg",
            "trail": true
          }
        ]
      },
      {
        "slot": "dinner",
        "area": "Shimanto (Nakamura)",
        "picks": [
          {
            "name": "Local Cuisine Hanazen (郷土料理 花ぜん)",
            "cuisine": "Shimanto river cuisine — wild eel, ayu",
            "rating": 4.3,
            "why": "Galiya — Shimanto's line-caught wild eel (unagi) and ayu cooked where they're fished",
            "kid": false,
            "map": "https://maps.google.com/?cid=15777740087084303905",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Kabayaki_grilled_eel.jpg/960px-Kabayaki_grilled_eel.jpg"
          },
          {
            "name": "Chika (チカ)",
            "cuisine": "izakaya",
            "rating": 4.4,
            "why": "Aslan — busy local izakaya with karaage, plain rice and fried bites he'll happily eat (broad menu for the whole table)",
            "kid": true,
            "map": "https://maps.google.com/?cid=14908376005053640875",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Chicken_karaage_003.jpg/960px-Chicken_karaage_003.jpg"
          },
          {
            "name": "Chubo Wakamatsu (厨房 わかまつ)",
            "cuisine": "Japanese / katsuo & local fish",
            "rating": 4.4,
            "why": "Ruslan & Galiya — well-rated all-rounder for Kochi katsuo and seasonal river fish",
            "kid": false,
            "map": "https://maps.google.com/?cid=9013227086709514243",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Katsuo_no_tataki_in_Kochi_01.jpg/960px-Katsuo_no_tataki_in_Kochi_01.jpg"
          }
        ]
      }
    ],
    "localTodo": [
      {
        "time": "~10:00",
        "name": "Ino-cho Paper Museum (Tosa washi)",
        "what": "Make your own postcard/sheet of Tosa washi on the Niyodo River — hands-on craft for Aslan (~¥400, closed Mon)",
        "map": "https://www.google.com/maps/search/?api=1&query=Ino-cho%20Paper%20Museum%20Kochi"
      },
      {
        "time": "~11:00",
        "name": "Niyodo Blue river",
        "what": "Photo stop at the famously translucent blue water",
        "map": "https://www.google.com/maps/search/?api=1&query=Niyodo%20River%20Niyodo%20Blue"
      },
      {
        "time": "~15:30",
        "name": "Sada Chinkabashi",
        "what": "Walk a railless 'sinking bridge' over the clear Shimanto",
        "map": "https://www.google.com/maps/search/?api=1&query=Sada%20Chinkabashi%20Shimanto"
      }
    ]
  },
{
    "d": 13,
    "id": "shimanto",
    "miles": 20,
    "rest": true,
    "region": "Shikoku",
    "title": "Shimanto Rest Day",
    "route": "Shimanto River (light riding)",
    "desc": "The best-placed rest of the trip — right after the two hardest riding days. A covered yakatabune river boat glides past the low railless 'sinking bridges'; add an easy riverside stroll or cycle and slow rural time by the water. (Canoeing/SUP is really a summer thing — too cold in late October.) Kid + rain plan: the indoor Akitsuio dragonfly-and-fish museum at Tonbo Kingdom.",
    "tags": ["rest", "kid", "stay2"],
    "gfrom": "Shimanto, Kochi, Japan",
    "gto": "Shimanto River, Japan",
    "gvia": "",
    "poi": [
      {
        "name": "Shimanto yakatabune boat",
        "what": "Covered river cruise past the sinking bridges",
        "q": "Shimanto River yakatabune",
        "slot": "activity",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Shimanto_River_%285279082249%29.jpg/960px-Shimanto_River_%285279082249%29.jpg",
        "it": ["scenic"]
      },
      {
        "name": "Sinking-bridge cycling",
        "what": "Easy riverside cycle",
        "q": "Shimanto River cycling",
        "slot": "activity",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Sagawa-bridge%2CShimanto-cho%2CJapan.JPG/960px-Sagawa-bridge%2CShimanto-cho%2CJapan.JPG",
        "it": ["scenic"]
      },
      {
        "name": "Cape Ashizuri",
        "what": "Dramatic cape & lighthouse",
        "q": "Cape Ashizuri",
        "slot": "scenic",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/ShimantoRiverFromNakabaRestarea.JPG/960px-ShimantoRiverFromNakabaRestarea.JPG",
        "wiki": "https://en.wikipedia.org/wiki/Cape_Ashizuri",
        "it": ["scenic"]
      }
    ],
    "eats": [
      {
        "slot": "coffee",
        "area": "Sada, by the sinking bridge",
        "picks": [
          {
            "name": "hotori coffee",
            "cuisine": "specialty coffee",
            "rating": 4.5,
            "why": "Ruslan & Galiya — a riverside specialty cafe right by the Sada chinkabashi; pair with the afternoon cycle. Cakes/juice for Aslan.",
            "kid": false,
            "map": "https://maps.google.com/?cid=14204901372440090147",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/A_small_cup_of_coffee.JPG/960px-A_small_cup_of_coffee.JPG"
          }
        ]
      },
      {
        "slot": "lunch",
        "area": "Shimanto riverside (Yamachi / Sada bend)",
        "picks": [
          {
            "name": "こいちご飯 (Koichi Gohan)",
            "cuisine": "Shimanto-river eel & ayu teishoku",
            "rating": 4.2,
            "why": "Galiya — river eel and sweetfish set meals eaten right by the water",
            "kid": false,
            "map": "https://maps.google.com/?cid=16665219646928958643",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Unadon_%2815664670489%29.jpg/960px-Unadon_%2815664670489%29.jpg"
          },
          {
            "name": "Shimantoya",
            "cuisine": "riverside tourist restaurant — eel/ayu sets + plain rice & udon",
            "rating": 3.9,
            "why": "Aslan — big casual riverside spot with simple rice/udon sets he'll eat",
            "kid": true,
            "map": "https://maps.google.com/?cid=10746447903860844056",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Ayu_no_Shioyaki.jpg/960px-Ayu_no_Shioyaki.jpg"
          }
        ]
      },
      {
        "slot": "dinner",
        "area": "Nakamura town, Shimanto",
        "picks": [
          {
            "name": "Chubo Wakamatsu (厨房 わかまつ)",
            "cuisine": "Tosa izakaya — katsuo tataki & local Kochi dishes",
            "rating": 4.4,
            "why": "Galiya — seared bonito katsuo tataki, the Kochi specialty, in a lively local izakaya",
            "kid": false,
            "map": "https://maps.google.com/?cid=9013227086709514243",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Katsuo_no_tataki_at_Kochi_City.jpg/960px-Katsuo_no_tataki_at_Kochi_City.jpg"
          },
          {
            "name": "Sushi Kazu",
            "cuisine": "sushi",
            "rating": 4.2,
            "why": "Ruslan & Galiya — fresh local nigiri in central Nakamura",
            "kid": false,
            "map": "https://maps.google.com/?cid=702334641640917640",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Nigiri_Sushi_%2825966163204%29.jpg/960px-Nigiri_Sushi_%2825966163204%29.jpg"
          },
          {
            "name": "さぬきや (Sanukiya Udon)",
            "cuisine": "udon",
            "rating": 4.2,
            "why": "Aslan — plain hot udon, an easy sure-thing near the station",
            "kid": true,
            "map": "https://maps.google.com/?cid=7610857881456023209",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Kake_udon_by_Joe_Jones_in_Tokyo.jpg/960px-Kake_udon_by_Joe_Jones_in_Tokyo.jpg"
          }
        ]
      }
    ],
    "localTodo": [
      {
        "time": "~10:30",
        "name": "Shimanto yakatabune river boat",
        "what": "Covered cruise gliding past the railless 'sinking bridges' — calm, no-effort, great for Aslan and the newer rider",
        "map": "https://www.google.com/maps/search/?api=1&query=Shimanto%20River%20yakatabune%20boat"
      },
      {
        "time": "~14:00",
        "name": "Sada / Sata chinkabashi cycle & stroll",
        "what": "Rent a flat bike at the michi-no-eki and ride out across the long sinking bridges over Japan's last clear stream",
        "map": "https://www.google.com/maps/search/?api=1&query=Sada%20Chinkabashi%20Shimanto"
      },
      {
        "time": "~15:00",
        "name": "Akitsuio museum, Tonbo Kingdom",
        "what": "Indoor dragonfly-and-river-fish aquarium — the wet-weather / kid hook for Aslan",
        "map": "https://www.google.com/maps/search/?api=1&query=Shimantogawa%20Gakuyukan%20Akitsuio%20Tonbo%20Kingdom"
      },
      {
        "time": "optional",
        "name": "Cape Ashizuri",
        "what": "Granite cape & white lighthouse — only if everyone's rested; it's a ~1.5–2h ride each way, a half-day, not a rest",
        "map": "https://www.google.com/maps/search/?api=1&query=Cape%20Ashizuri"
      }
    ]
  },
{
    "d": 14,
    "id": "dogo",
    "miles": 117,
    "dmin": 210,
    "rest": false,
    "region": "Shikoku",
    "title": "Castles & Old Towns",
    "route": "Shimanto → Uwajima / Uchiko → Matsuyama",
    "desc": "Uwajima Castle and Uchiko's preserved merchant streets en route up the Ehime coast to Matsuyama and Dōgo Onsen.",
    "luggage": "Roll into the Dōgo/Matsuyama 2-night base, where your chain case (forwarded from Iya on Day 10) is waiting at the front desk. Confirm it's held under your name at check-in and unpack the full suitcase for two nights.",
    "tags": ["ride", "kid", "onsen"],
    "gfrom": "Shimanto, Kochi, Japan",
    "gto": "Matsuyama, Ehime, Japan",
    "gvia": "Uwajima, Ehime, Japan",
    "poi": [
      {
        "name": "Uwajima Castle",
        "what": "Original hilltop keep",
        "q": "Uwajima Castle",
        "slot": "stop",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Uwajima-jo.JPG/960px-Uwajima-jo.JPG",
        "wiki": "https://en.wikipedia.org/wiki/Uwajima_Castle",
        "it": ["castle"]
      },
      {
        "name": "Uwajima taimeshi",
        "what": "Sea-bream-over-rice lunch",
        "q": "Uwajima",
        "slot": "lunch",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Uwajima_Bay.JPG/960px-Uwajima_Bay.JPG",
        "it": ["food"]
      },
      {
        "name": "Uchiko old town",
        "what": "Merchant street & kabuki theatre",
        "q": "Uchiko Yokaichi",
        "slot": "scenic",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Uchiko-za_%286454001047%29.jpg/960px-Uchiko-za_%286454001047%29.jpg",
        "wiki": "https://en.wikipedia.org/wiki/Uchiko,_Ehime"
      },
      {
        "name": "Garyū Sansō, Ozu",
        "what": "Riverside villa & garden",
        "q": "Garyu Sanso Ozu",
        "slot": "scenic",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Kashima_Island%2C_Uwajima_Ehime_Aerial_photograph.2019.jpg/960px-Kashima_Island%2C_Uwajima_Ehime_Aerial_photograph.2019.jpg"
      }
    ],
    "eats": [
      {
        "slot": "coffee",
        "area": "Central Matsuyama (Nibanchō / Ōkaidō)",
        "picks": [
          {
            "name": "SPOT COFFEE STAND",
            "cuisine": "specialty coffee",
            "rating": 4.9,
            "why": "Galiya & Ruslan — Matsuyama's standout specialty espresso/pour-over (366 reviews); sweet milk drinks for Aslan too",
            "kid": false,
            "map": "https://maps.google.com/?cid=5681671833040133501",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/A_small_cup_of_coffee.JPG/960px-A_small_cup_of_coffee.JPG"
          }
        ]
      },
      {
        "slot": "lunch",
        "area": "Uwajima (Marunouchi, near the castle)",
        "picks": [
          {
            "name": "Wabisuke",
            "cuisine": "Uwajima taimeshi (sea-bream sashimi over rice in raw-egg dashi)",
            "rating": 4.1,
            "why": "Galiya — the local taimeshi specialty eaten at its source",
            "kid": false,
            "map": "https://maps.google.com/?cid=13667520984505400433",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Uwajima_Taimeshi.jpg/960px-Uwajima_Taimeshi.jpg"
          },
          {
            "name": "Isshin Japanese Seafood Cuisine",
            "cuisine": "local seafood set / taimeshi",
            "rating": 4.2,
            "why": "Ruslan & Galiya — hearty Uwajima-bay seafood teishoku",
            "kid": false,
            "map": "https://maps.google.com/?cid=12704092390793346764",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Taimeshi_01.jpg/960px-Taimeshi_01.jpg"
          },
          {
            "name": "Nishikura Sanuki-udon noodle shop",
            "cuisine": "self-serve Sanuki udon",
            "rating": 4.1,
            "why": "Aslan — plain warm udon he'll actually eat (Galiya gets noodles too)",
            "kid": true,
            "map": "https://maps.google.com/?cid=4127214049032307413",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Kake_udon_by_udono.jpg/960px-Kake_udon_by_udono.jpg"
          }
        ]
      },
      {
        "slot": "dinner",
        "area": "Dōgo Onsen / Matsuyama",
        "picks": [
          {
            "name": "Men-ya Niikura (麺や 新倉)",
            "cuisine": "ramen",
            "rating": 4.3,
            "why": "Galiya — top-rated local ramen a short walk from Dōgo",
            "kid": false,
            "map": "https://maps.google.com/?cid=113848077267614461",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Shoyu_Ramen.jpg/960px-Shoyu_Ramen.jpg"
          },
          {
            "name": "Sushiemon Dōgo (すしえもん 道後店)",
            "cuisine": "conveyor-belt sushi",
            "rating": 4.4,
            "why": "Aslan — pick-your-own conveyor plates (egg, salmon, rice); Galiya gets fresh Uwajima-bay sushi",
            "kid": true,
            "map": "https://maps.google.com/?cid=5710359260940265591",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Conveyor_belt_sushi_at_Mashiro_Sushi.jpg/960px-Conveyor_belt_sushi_at_Mashiro_Sushi.jpg"
          },
          {
            "name": "Mammam",
            "cuisine": "Japanese set meals / izakaya",
            "rating": 4.3,
            "why": "Ruslan & Galiya — relaxed Dōgo-arcade dinner with rice/teishoku options for everyone",
            "kid": false,
            "map": "https://maps.google.com/?cid=14857269819173416862",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Sakura_Teishoku_-_Sakura_Japanese_Restaurant_2025-07-28.jpg/960px-Sakura_Teishoku_-_Sakura_Japanese_Restaurant_2025-07-28.jpg"
          }
        ]
      }
    ],
    "localTodo": [
      {
        "time": "~10:30",
        "name": "Uwajima Castle",
        "what": "climb to the compact, all-original 1666 hilltop keep — one of only twelve left in Japan — for sea-and-town views",
        "map": "https://www.google.com/maps/search/?api=1&query=Uwajima%20Castle"
      },
      {
        "time": "~14:00",
        "name": "Uchiko Yōkaichi Old Street & Uchiko-za",
        "what": "600 m of ochre-walled wax-merchant houses, plus the restored 1916 kabuki theatre (revolving stage, trap doors) — stroller-easy",
        "map": "https://www.google.com/maps/search/?api=1&query=Uchiko%20Yokaichi%20Old%20Street"
      },
      {
        "time": "~15:30",
        "name": "Garyū Sansō, Ozu",
        "what": "exquisite riverside villa and garden above the Hiji River — a short, calm stop before the run into Matsuyama",
        "map": "https://www.google.com/maps/search/?api=1&query=Garyu%20Sanso%20Ozu"
      },
      {
        "time": "~18:00",
        "name": "Dōgo Onsen Honkan",
        "what": "settle into the 2-night base and take an early evening soak in the grand 1894 wooden bathhouse (keep Aslan's soak short; Asuka-no-Yu has a private family bath)",
        "map": "https://www.google.com/maps/search/?api=1&query=Dogo%20Onsen%20Honkan"
      }
    ]
  },
{
    "d": 15,
    "id": "dogo",
    "miles": 10,
    "rest": true,
    "region": "Shikoku",
    "title": "Dōgo Onsen Rest Day",
    "route": "Matsuyama (light riding)",
    "desc": "Matsuyama Castle by ropeway, then the historic Dōgo Onsen bathhouse. Classic onsen evening.",
    "luggage": "Next chain node, an easy one — Matsuyama → Onomichi is a clean city-to-city next-day leg. Forward the chain case from the Dōgo hotel today before the morning courier cutoff, addressed to the Onomichi/Setoda hotel for the Day-16 check-in. The base-camp case remains in Osaka.",
    "tags": ["rest", "onsen", "kid", "stay2"],
    "gfrom": "Matsuyama, Ehime, Japan",
    "gto": "Dogo Onsen, Matsuyama, Japan",
    "gvia": "",
    "poi": [
      {
        "name": "Matsuyama Castle",
        "what": "Ropeway to a hilltop original castle",
        "q": "Matsuyama Castle Ehime",
        "slot": "activity",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/MEIN%26SMALL_CASTLE_TOWER_%2CMATSUYAMA_CASTLE%28IYO%29.JPG/960px-MEIN%26SMALL_CASTLE_TOWER_%2CMATSUYAMA_CASTLE%28IYO%29.JPG",
        "wiki": "https://en.wikipedia.org/wiki/Matsuyama_Castle_(Iyo)",
        "it": ["scenic", "castle"]
      },
      {
        "name": "Dōgo Onsen Honkan",
        "what": "Soak in the grand 1894 wooden bathhouse — widely cited as a visual inspiration for the bathhouse in Spirited Away, so for Galiya the soak doubles as a Ghibli-adjacent moment (frame it honestly as 'evokes,' not an official Ghibli site). Keep a 6-year-old's soak short — it gets hot and busy — or book Asuka-no-Yu's private family bath.",
        "q": "Dogo Onsen Honkan",
        "slot": "activity",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Dogo_Onsen_Honkan_%28Main_building%29%2C_%E9%81%93%E5%BE%8C%E6%B8%A9%E6%B3%89_%E6%9C%AC%E9%A4%A8_-_panoramio.jpg/960px-Dogo_Onsen_Honkan_%28Main_building%29%2C_%E9%81%93%E5%BE%8C%E6%B8%A9%E6%B3%89_%E6%9C%AC%E9%A4%A8_-_panoramio.jpg",
        "wiki": "https://en.wikipedia.org/wiki/D%C5%8Dgo_Onsen",
        "it": ["onsen", "ghibli"]
      },
      {
        "name": "Botchan Ressha",
        "what": "Retro steam-style tram",
        "q": "Botchan Ressha Matsuyama",
        "slot": "scenic",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Botchan-ressha.jpg/960px-Botchan-ressha.jpg"
      },
      {
        "name": "Ishite-ji",
        "what": "Atmospheric pilgrimage temple",
        "q": "Ishiteji Temple Matsuyama",
        "slot": "scenic",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Stone_sign%2C_Matsuyama_Castle%2C_Matsuyama%2C_Ehime_-_Sep_23%2C_2011.jpg/960px-Stone_sign%2C_Matsuyama_Castle%2C_Matsuyama%2C_Ehime_-_Sep_23%2C_2011.jpg",
        "wiki": "https://en.wikipedia.org/wiki/Ishite-ji",
        "it": ["castle"]
      }
    ],
    "eats": [
      {
        "slot": "coffee",
        "area": "Nibanchō / city centre (near Matsuyama Castle)",
        "picks": [
          {
            "name": "SPOT COFFEE STAND",
            "cuisine": "specialty coffee",
            "rating": 4.9,
            "why": "Ruslan & Galiya — Matsuyama's standout specialty stand, a perfect pre-castle morning cup; milky lattes for Galiya and Aslan can share a sweet treat",
            "kid": false,
            "map": "https://maps.google.com/?cid=5681671833040133501",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/A_small_cup_of_coffee.JPG/960px-A_small_cup_of_coffee.JPG"
          }
        ]
      },
      {
        "slot": "lunch",
        "area": "Ōkaidō / city centre (near Matsuyama Castle)",
        "picks": [
          {
            "name": "Taimeshi Motoyama (鯛めし本山)",
            "cuisine": "Matsuyama taimeshi — sea bream cooked over rice",
            "rating": 4.6,
            "why": "Galiya — Matsuyama's signature sea-bream rice at a packed local favourite",
            "kid": false,
            "map": "https://maps.google.com/?cid=9133809393906596874",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Taimeshi.jpg/960px-Taimeshi.jpg"
          },
          {
            "name": "Nabeyaki Udon Yuian (鍋焼うどん結庵)",
            "cuisine": "nabeyaki udon — Matsuyama's sweet soft udon in a clay pot",
            "rating": 4.5,
            "why": "Aslan — soft mild noodles in a little pot, the easy local bowl he'll actually eat",
            "kid": true,
            "map": "https://maps.google.com/?cid=16769157094995214182",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Nabeyaki_udon.jpg/960px-Nabeyaki_udon.jpg"
          }
        ]
      },
      {
        "slot": "dinner",
        "area": "Dōgo Onsen quarter",
        "picks": [
          {
            "name": "Men-ya Niikura (麺や 新倉)",
            "cuisine": "ramen",
            "rating": 4.3,
            "why": "Galiya — a well-loved bowl a short walk from the Honkan after the soak",
            "kid": false,
            "map": "https://maps.google.com/?cid=113848077267614461",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Shoyu_Ramen.jpg/960px-Shoyu_Ramen.jpg"
          },
          {
            "name": "Sushiemon Dōgo (宇和島グルメ寿司 すしえもん 道後店)",
            "cuisine": "conveyor-belt sushi",
            "rating": 4.4,
            "why": "Aslan — pick-your-own conveyor plates (egg, plain rice, cooked picks); Galiya gets fresh local fish too",
            "kid": true,
            "map": "https://maps.google.com/?cid=5710359260940265591",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Kaiten_sushi_%282131921293%29.jpg/960px-Kaiten_sushi_%282131921293%29.jpg"
          },
          {
            "name": "Isshinmaru (一心丸)",
            "cuisine": "izakaya — Ehime seafood & jakoten",
            "rating": 4.5,
            "why": "Galiya & Ruslan — local jakoten fish cakes and Setouchi sashimi right in the Dōgo quarter",
            "kid": false,
            "map": "https://maps.google.com/?cid=7147719788954986805",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Serving_jakoten_in_Dogo.jpg/960px-Serving_jakoten_in_Dogo.jpg"
          }
        ]
      }
    ],
    "localTodo": [
      {
        "time": "~10:00",
        "name": "Matsuyama Castle",
        "what": "ropeway or single-seat chairlift up Katsuyama hill to a rare hilltop original keep — the lift is a kid hit",
        "map": "https://www.google.com/maps/search/?api=1&query=Matsuyama%20Castle%20Ehime"
      },
      {
        "time": "~14:00",
        "name": "Dōgo Haikara-dōri arcade",
        "what": "covered shopping street of onsen sweets, mikan juice and the Botchan Karakuri clock on the hour — easy, all-weather",
        "map": "https://www.google.com/maps/search/?api=1&query=Dogo%20Haikara-dori%20Matsuyama"
      },
      {
        "time": "~15:00",
        "name": "Botchan Ressha",
        "what": "ride the coal-black steam-style heritage tram between the city centre and Dōgo",
        "map": "https://www.google.com/maps/search/?api=1&query=Botchan%20Ressha%20Dogo%20Onsen%20Station"
      },
      {
        "time": "~16:30",
        "name": "Dōgo Onsen Honkan",
        "what": "soak in the grand 1894 wooden bathhouse with its Spirited Away resonance; keep Aslan's soak short, or book Asuka-no-Yu's private family bath",
        "map": "https://www.google.com/maps/search/?api=1&query=Dogo%20Onsen%20Honkan"
      }
    ]
  },
{
    "d": 16,
    "id": "onomichi",
    "miles": 86,
    "dmin": 193,
    "rest": false,
    "region": "Setouchi",
    "title": "Shimanami Kaidō",
    "route": "Matsuyama → Shimanami → Onomichi / Setoda",
    "desc": "The famous island-hopping bridge route across the Seto Inland Sea — gentle, scenic, unforgettable, and a highlight ride for the whole family.",
    "luggage": "Ride the overnight bag over the bridges into the Onomichi/Setoda 2-night base, where your chain case (forwarded from Dōgo on Day 15) is waiting at the front desk. Confirm it's held under your name and unpack the full suitcase for two nights.",
    "tags": ["ride", "kid"],
    "gfrom": "Matsuyama, Ehime, Japan",
    "gto": "Onomichi, Hiroshima, Japan",
    "gvia": "Imabari, Ehime, Japan",
    "poi": [
      {
        "name": "Imabari Castle",
        "what": "Sea-water-moat castle",
        "q": "Imabari Castle",
        "slot": "stop",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Kurushima-Kaikyo_Bridge%2C_Seto_Inland_Sea%2C_Japan.jpg/960px-Kurushima-Kaikyo_Bridge%2C_Seto_Inland_Sea%2C_Japan.jpg",
        "wiki": "https://en.wikipedia.org/wiki/Imabari_Castle",
        "it": ["castle"]
      },
      {
        "name": "Kirosan Observatory",
        "what": "Bridge panorama coffee",
        "q": "Kirosan Observatory Park",
        "slot": "coffee",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Kurushima-Kaikyo_Bridge_310040.jpg/960px-Kurushima-Kaikyo_Bridge_310040.jpg",
        "it": ["scenic"]
      },
      {
        "name": "Ōyamazumi Shrine, Ōmishima",
        "what": "Samurai-armour shrine, lunch",
        "q": "Oyamazumi Shrine",
        "slot": "lunch",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Shimanami_Kaido_Bikeway_%2814089291941%29.jpg/960px-Shimanami_Kaido_Bikeway_%2814089291941%29.jpg",
        "wiki": "https://en.wikipedia.org/wiki/%C5%8Cyamazumi_Shrine",
        "it": ["food", "castle"]
      },
      {
        "name": "Setoda, Ikuchijima",
        "what": "Lemon gelato & Kōsanji temple",
        "q": "Setoda",
        "slot": "scenic",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Onomichi_Bridge_and_Onomichi_Channel_from_Main_Hall_of_Senkoji_Temple_2.jpg/960px-Onomichi_Bridge_and_Onomichi_Channel_from_Main_Hall_of_Senkoji_Temple_2.jpg",
        "it": ["food", "castle"]
      }
    ],
    "eats": [
      {
        "slot": "coffee",
        "area": "Onomichi (shōtengai arcade)",
        "picks": [
          {
            "name": "POUR specialty coffee",
            "cuisine": "specialty coffee",
            "rating": 4.7,
            "why": "Galiya & Ruslan — Onomichi's best third-wave roaster in the arcade; pour-overs and espresso, with sweets/juice for Aslan",
            "kid": false,
            "map": "https://maps.google.com/?cid=7090208965271270685",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/A_small_cup_of_coffee.JPG/960px-A_small_cup_of_coffee.JPG"
          }
        ]
      },
      {
        "slot": "lunch",
        "area": "Ōmishima (near Ōyamazumi Shrine)",
        "picks": [
          {
            "name": "Seafood Restaurant Yoshikawa",
            "cuisine": "Setouchi seafood / sashimi & sea-bream rice bowls",
            "rating": 4.1,
            "why": "Galiya — fresh Inland-Sea fish eaten on the island where it's caught",
            "kid": false,
            "map": "https://maps.google.com/?cid=6391261138187840589",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/4/47/Kaisendon_001.jpg"
          },
          {
            "name": "Tairyo",
            "cuisine": "Japanese restaurant / sea-bream (tai) teishoku set meals",
            "rating": 4.0,
            "why": "Galiya & Ruslan — popular tai set meals with rice right by the shrine",
            "kid": false,
            "map": "https://maps.google.com/?cid=14126754483064723175",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/%E6%B0%97%E6%AF%94%E3%81%AE%E9%AF%9B%E3%82%81%E3%81%97_photo_by_Pcs34560_20160116_1300.jpg/960px-%E6%B0%97%E6%AF%94%E3%81%AE%E9%AF%9B%E3%82%81%E3%81%97_photo_by_Pcs34560_20160116_1300.jpg"
          },
          {
            "name": "Roadside Station Tatara Shimanami Park",
            "cuisine": "food court / curry rice, noodles, burgers, soft-serve",
            "rating": 4.1,
            "why": "Aslan — easy food court (curry rice, noodles, the Mishima sea-bream burger) with bridge views; pick-your-own plate",
            "kid": true,
            "map": "https://maps.google.com/?cid=4631298090120556845",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Beef_curry_rice_003.jpg/960px-Beef_curry_rice_003.jpg"
          }
        ]
      },
      {
        "slot": "dinner",
        "area": "Onomichi",
        "picks": [
          {
            "name": "Tsutafuji Maruboshi (Onomichi Ramen)",
            "cuisine": "Onomichi ramen — clear soy-niboshi broth, pork-back-fat bits, flat noodles",
            "rating": 4.1,
            "why": "Galiya — the defining Setouchi bowl at one of Onomichi's most loved shops",
            "kid": false,
            "map": "https://maps.google.com/?cid=6892398988895765996",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Onomichi_ramen_by_Ozchin_in_Onomichi.jpg/960px-Onomichi_ramen_by_Ozchin_in_Onomichi.jpg",
            "trail": true
          },
          {
            "name": "Shōya Hanten",
            "cuisine": "classic Onomichi ramen (mild soy broth)",
            "rating": 4.5,
            "why": "Aslan — gentle soy-broth ramen, basically plain noodles he'll eat; add a side of karaage",
            "kid": true,
            "map": "https://maps.google.com/?cid=14662320892713452271",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Onomichi_ramen_and_Karaage.jpg/960px-Onomichi_ramen_and_Karaage.jpg"
          },
          {
            "name": "Miyachi",
            "cuisine": "Onomichi ramen specialist",
            "rating": 4.4,
            "why": "Galiya & Ruslan — well-rated local bowl if the others have a queue",
            "kid": false,
            "map": "https://maps.google.com/?cid=17814048139730344579",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Onomichi_ramen_by_Ozchin_in_Onomichi.jpg/960px-Onomichi_ramen_by_Ozchin_in_Onomichi.jpg"
          }
        ]
      }
    ],
    "localTodo": [
      {
        "time": "~09:30",
        "name": "Imabari Castle",
        "what": "sea-water-moat castle at the foot of the bridges; quick photo stop before crossing",
        "map": "https://www.google.com/maps/search/?api=1&query=Imabari%20Castle"
      },
      {
        "time": "~10:30",
        "name": "Kirosan Observatory Park",
        "what": "panorama café over the Kurushima-Kaikyō triple suspension bridge — coffee with the view",
        "map": "https://www.google.com/maps/search/?api=1&query=Kirosan%20Observatory%20Park"
      },
      {
        "time": "~12:00",
        "name": "Ōyamazumi Shrine, Ōmishima",
        "what": "ancient samurai-armour shrine in a giant camphor grove — wander before lunch",
        "map": "https://www.google.com/maps/search/?api=1&query=Oyamazumi%20Shrine"
      },
      {
        "time": "~14:30",
        "name": "Setoda, Ikuchijima",
        "what": "lemon gelato on the waterfront and the gilt-and-marble Kōsan-ji temple with the white-marble Hill of Hope",
        "map": "https://www.google.com/maps/search/?api=1&query=Kosanji%20Temple%20Setoda"
      }
    ]
  },
{
    "d": 17,
    "id": "onomichi",
    "miles": 25,
    "rest": true,
    "region": "Setouchi",
    "title": "Island Rest Day",
    "route": "Setoda / Onomichi (light riding)",
    "desc": "Easy pace: Setoda's Kōsanji temple and marble Hill of Hope, lemon groves and gelato, then Onomichi's hillside lanes and cat alley — take the Senkō-ji ropeway up and wander down rather than climbing the full temple stair. Downtime at the waterfront cafés. Rain plan: the covered Onomichi shōtengai arcade and the Onomichi U2 cycle-and-harbour complex.",
    "luggage": "Closing the loop: forward the chain case from Onomichi straight back to the Osaka end hotel today, held under your name, so it rejoins the base-camp case ahead of your Day-21 return. Ride the final three single-night days (Kurashiki → Kobe → Awaji) on just the overnight bag.",
    "tags": ["rest", "kid", "stay2"],
    "gfrom": "Onomichi, Hiroshima, Japan",
    "gto": "Setoda, Ikuchijima, Japan",
    "gvia": "",
    "poi": [
      {
        "name": "Onomichi ramen",
        "what": "A sit-down bowl of the town's celebrated ramen — a clear soy-tare chicken-and-niboshi (small-fish) broth studded with little nuggets of pork-back fat and flat noodles, the defining Setouchi bowl — the day's anchor meal with no riding pressure.",
        "q": "Onomichi Ramen",
        "slot": "lunch",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/From_the_sky_%2C_%E4%BD%90%E6%9C%A8%E5%B3%B6%E4%B8%8A%E7%A9%BA%E3%81%8B%E3%82%89_-_panoramio.jpg/960px-From_the_sky_%2C_%E4%BD%90%E6%9C%A8%E5%B3%B6%E4%B8%8A%E7%A9%BA%E3%81%8B%E3%82%89_-_panoramio.jpg",
        "it": ["food"]
      },
      {
        "name": "Senkōji Ropeway",
        "what": "Hilltop view over the town & sea",
        "q": "Senkoji Temple Onomichi",
        "slot": "activity",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Onomichi_Bridge_and_Onomichi_Channel_from_Main_Hall_of_Senkoji_Temple_2.jpg/960px-Onomichi_Bridge_and_Onomichi_Channel_from_Main_Hall_of_Senkoji_Temple_2.jpg",
        "it": ["scenic"]
      },
      {
        "name": "Temple Walk & cat alley",
        "what": "Lanes, cafés & cats",
        "q": "Onomichi Temple Walk",
        "slot": "activity",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Onomichi_%2851806057842%29.jpg/960px-Onomichi_%2851806057842%29.jpg",
        "it": ["castle"]
      },
      {
        "name": "Kōsanji & Hill of Hope",
        "what": "Ornate temple & marble hilltop",
        "q": "Kosanji Temple Setoda",
        "slot": "scenic",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/%E5%B0%BE%E9%81%93_Onomachi_-_panoramio.jpg/960px-%E5%B0%BE%E9%81%93_Onomachi_-_panoramio.jpg",
        "wiki": "https://en.wikipedia.org/wiki/K%C5%8Dsan-ji",
        "it": ["castle"]
      }
    ],
    "ramenTrail": [
      {
        "style": "Onomichi ramen",
        "shop": "Tsutafuji つたふじ",
        "shopUrl": "https://maps.google.com/?cid=9111644244913689319",
        "city": "Onomichi",
        "slot": "rest-day anchor"
      }
    ],
    "eats": [
      {
        "slot": "coffee",
        "area": "Onomichi (Tsuchidō arcade)",
        "picks": [
          {
            "name": "POUR specialty coffee",
            "cuisine": "specialty coffee",
            "rating": 4.7,
            "why": "Galiya & Ruslan — Onomichi's flagship third-wave roaster in the shōtengai arcade; juice and cake for Aslan, great before the morning ride or as an afternoon U2/arcade stop",
            "kid": false,
            "map": "https://maps.google.com/?cid=7090208965271270685",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/A_small_cup_of_coffee.JPG/960px-A_small_cup_of_coffee.JPG"
          }
        ]
      },
      {
        "slot": "snack",
        "area": "Setoda, Ikuchijima",
        "picks": [
          {
            "name": "Dolce Kosanjimae Store",
            "cuisine": "Setoda lemon gelato",
            "rating": 4.1,
            "why": "Aslan — bright Setoda lemon gelato right by Kōsanji, an easy kid win",
            "kid": true,
            "map": "https://maps.google.com/?cid=9641240730542412151",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Gelato_al_Limone.jpg/960px-Gelato_al_Limone.jpg"
          },
          {
            "name": "尾道柑橘工房 SETODA",
            "cuisine": "citrus café / lemon sweets",
            "rating": 4.9,
            "why": "Galiya — a local citrus-workshop café for lemon cake, juice and a waterfront coffee",
            "kid": true,
            "map": "https://maps.google.com/?cid=13595938065999504966",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Gelato_al_Limone.jpg/960px-Gelato_al_Limone.jpg"
          }
        ]
      },
      {
        "slot": "lunch",
        "area": "Onomichi (town centre / harbour)",
        "picks": [
          {
            "name": "Maruboshi (中華そば 一丁)",
            "cuisine": "Onomichi ramen (soy-niboshi, pork-fat nuggets, flat noodles)",
            "rating": 4.1,
            "why": "Galiya — the iconic, always-queued bowl of the town's defining ramen",
            "kid": false,
            "map": "https://maps.google.com/?cid=6892398988895765996",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Onomichi_ramen_and_jiaozi_by_The_Other_View_in_Onomichi.jpg/960px-Onomichi_ramen_and_jiaozi_by_The_Other_View_in_Onomichi.jpg",
            "trail": true
          },
          {
            "name": "Shoya Hanten (尾道らーめん 壱番館 / 朱華園系)",
            "cuisine": "Onomichi ramen + gyoza & karaage",
            "rating": 4.5,
            "why": "Aslan — the mild soy broth, plain flat noodles, gyoza and karaage are easy for him",
            "kid": true,
            "map": "https://maps.google.com/?cid=14662320892713452271",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Onomichi_ramen_and_Karaage.jpg/960px-Onomichi_ramen_and_Karaage.jpg"
          },
          {
            "name": "Komedoko Shokudo",
            "cuisine": "teishoku set meals (katsu, rice)",
            "rating": 4.1,
            "why": "Aslan — a calm shokudo with katsu and plain rice if the ramen queue is long",
            "kid": true,
            "map": "https://maps.google.com/?cid=17619095989743617765",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Tonkatsu_003.jpg/960px-Tonkatsu_003.jpg"
          }
        ]
      },
      {
        "slot": "dinner",
        "area": "Onomichi (waterfront / Tsuchidō)",
        "picks": [
          {
            "name": "Onomichi Yokocho",
            "cuisine": "Setouchi seafood food-alley (multiple stalls)",
            "rating": 4.7,
            "why": "Galiya — a lively alley of stalls: fresh Inland-Sea seafood for her, and karaage/rice stalls Aslan can pick from",
            "kid": true,
            "map": "https://maps.google.com/?cid=4200612190604226638",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Sashimi_combo_%2830122297838%29.jpg/960px-Sashimi_combo_%2830122297838%29.jpg"
          },
          {
            "name": "Tamaganzo",
            "cuisine": "seafood izakaya (Onomichi local fish)",
            "rating": 4.0,
            "why": "Galiya & Ruslan — Setouchi catch and sake in a friendly harbour izakaya",
            "kid": false,
            "map": "https://maps.google.com/?cid=2391970382022306045",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/SASHIMI_or_raw_sliced_fishes_2024-05-06.jpg/960px-SASHIMI_or_raw_sliced_fishes_2024-05-06.jpg"
          },
          {
            "name": "Sushi Kin",
            "cuisine": "sushi / conveyor-style",
            "rating": 4.4,
            "why": "Aslan — pick-your-own sushi, tamago and plain rolls he'll actually eat",
            "kid": true,
            "map": "https://maps.google.com/?cid=10638192374241250106",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Kaitenzushi%21_%285253575569%29.jpg/960px-Kaitenzushi%21_%285253575569%29.jpg"
          }
        ]
      }
    ],
    "localTodo": [
      {
        "time": "~10:30",
        "name": "Kōsanji Temple & Hill of Hope (Setoda)",
        "what": "riotously ornate temple with a cave 'hell-and-heaven' walk-through and the gleaming white-marble Miraishin-no-Oka hilltop — a kid-pleasing maze on Ikuchijima",
        "map": "https://www.google.com/maps/search/?api=1&query=Kosanji%20Temple%20Setoda"
      },
      {
        "time": "~11:30",
        "name": "Setoda lemon stroll",
        "what": "lemon gelato and citrus stands along the Setoda waterfront — Japan's leading lemon producer, flat and easy with a child",
        "map": "https://www.google.com/maps/search/?api=1&query=Setoda%20Shiomachi%20Shopping%20Street"
      },
      {
        "time": "~15:00",
        "name": "Senkōji Ropeway & Temple Walk",
        "what": "ride the cable-car up for the classic view over the red Onomichi bridges, then wander down through vermilion halls, cafés and the famous cats — the kid-friendly version of the temple hill",
        "map": "https://www.google.com/maps/search/?api=1&query=Senkoji%20Ropeway%20Onomichi"
      },
      {
        "time": "~16:30",
        "name": "Onomichi U2 / harbour arcade",
        "what": "converted-warehouse cycle-and-harbour complex with shops and cafés, plus the covered shōtengai arcade — a flat, relaxed (and wet-weather) afternoon by the water",
        "map": "https://www.google.com/maps/search/?api=1&query=Onomichi%20U2"
      }
    ]
  },
{
    "d": 18,
    "id": "kurashiki",
    "miles": 90,
    "dmin": 195,
    "rest": false,
    "region": "Setouchi",
    "title": "Canal Town",
    "route": "Onomichi → Kurashiki",
    "desc": "The plan commits to Kurashiki — its willow-lined Bikan canal quarter and the Ōhara Museum of Art, compact and easy with a child. The ride in calls at Tomonoura, the seaside town that inspired Studio Ghibli's Ponyo.",
    "tags": ["ride", "kid"],
    "gfrom": "Onomichi, Hiroshima, Japan",
    "gto": "Kurashiki, Okayama, Japan",
    "gvia": "Tomonoura, Japan",
    "poi": [
      {
        "name": "Fukuyama Castle",
        "what": "Station-side castle",
        "q": "Fukuyama Castle",
        "slot": "stop",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Kurashiki_Canal_Area.jpg/960px-Kurashiki_Canal_Area.jpg",
        "wiki": "https://en.wikipedia.org/wiki/Fukuyama_Castle",
        "it": ["castle"]
      },
      {
        "name": "Tomonoura (Ponyo harbour)",
        "what": "The literal Ponyo town: Miyazaki stayed here about two months and conceived the film. Walk the stone gangi jetty, the old jōyatō lighthouse and the cliffside-house hillside that inspired it — Galiya's headline Ghibli stop and a lovely, kid-friendly port walk.",
        "q": "Tomonoura",
        "slot": "coffee",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Tomonoura_Gangi.jpg/960px-Tomonoura_Gangi.jpg",
        "wiki": "https://en.wikipedia.org/wiki/Tomonoura",
        "it": ["ghibli", "scenic"]
      },
      {
        "name": "Washūzan Viewpoint",
        "what": "Seto Ōhashi bridge panorama, lunch",
        "q": "Washuzan",
        "slot": "lunch",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Tomonoura_viewed_from_Taishiden.jpg/960px-Tomonoura_viewed_from_Taishiden.jpg",
        "it": ["food", "scenic"]
      },
      {
        "name": "Kurashiki Bikan",
        "what": "Willow-lined canal quarter",
        "q": "Kurashiki Bikan",
        "slot": "scenic",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Kurashiki_Bikan_-02.jpg/960px-Kurashiki_Bikan_-02.jpg"
      }
    ],
    "eats": [
      {
        "slot": "coffee",
        "area": "Kurashiki Bikan",
        "picks": [
          {
            "name": "Kurashiki Coffee-kan (倉敷珈琲館)",
            "cuisine": "kissaten",
            "rating": 4.6,
            "why": "Galiya & Ruslan — a classic siphon-brewed kissaten right on the canal; cakes & cold milk for Aslan",
            "kid": false,
            "map": "https://maps.google.com/?cid=65869878438024158",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/A_small_cup_of_coffee.JPG/960px-A_small_cup_of_coffee.JPG"
          }
        ]
      },
      {
        "slot": "lunch",
        "area": "Tomonoura",
        "picks": [
          {
            "name": "Shiokura Seafood Restaurant",
            "cuisine": "Setouchi seafood / sashimi set",
            "rating": 4.3,
            "why": "Galiya — fresh Inland-Sea fish in the Ponyo harbour",
            "kid": false,
            "map": "https://maps.google.com/?cid=11425586595266106681",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Sashimi_set.jpg/960px-Sashimi_set.jpg"
          },
          {
            "name": "Tomonoura Ramen Taimaru",
            "cuisine": "ramen",
            "rating": 4.1,
            "why": "Aslan — a plain shōyu ramen bowl he'll eat, plus noodles for Galiya",
            "kid": true,
            "map": "https://maps.google.com/?cid=5549553753109472065",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Shoyu_Ramen.jpg/960px-Shoyu_Ramen.jpg"
          },
          {
            "name": "Cafe & Dining Bar T8 TOMONOURA",
            "cuisine": "Western cafe / omurice & pasta",
            "rating": 4.6,
            "why": "Aslan & family — easy Western plates with a harbour view",
            "kid": true,
            "map": "https://maps.google.com/?cid=14111119771642764996",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Omurice_1.jpg/960px-Omurice_1.jpg"
          }
        ]
      },
      {
        "slot": "dinner",
        "area": "Kurashiki Bikan",
        "picks": [
          {
            "name": "Sakura-sō",
            "cuisine": "Japanese set meals / local Setouchi",
            "rating": 4.3,
            "why": "Galiya — a proper Japanese teishoku dinner steps from the canal",
            "kid": false,
            "map": "https://maps.google.com/?cid=14482124938972194149",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/%E5%AE%9A%E9%A3%9F_-_traditional_Japanese_set_meal_at_New_Chitose_Airport_%2897%29.jpg/960px-%E5%AE%9A%E9%A3%9F_-_traditional_Japanese_set_meal_at_New_Chitose_Airport_%2897%29.jpg"
          },
          {
            "name": "Furuichi Bukkake-an Udon Restaurant",
            "cuisine": "bukkake udon",
            "rating": 4.7,
            "why": "Aslan & Galiya — plain springy udon for him, the famous local bukkake bowl for her",
            "kid": true,
            "map": "https://maps.google.com/?cid=11714000109321652119",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Kizami-bukkake-furuichi.jpg/960px-Kizami-bukkake-furuichi.jpg"
          },
          {
            "name": "Kappa",
            "cuisine": "tonkatsu",
            "rating": 4.2,
            "why": "Aslan — crisp katsu & rice, a long-running Kurashiki favourite",
            "kid": true,
            "map": "https://maps.google.com/?cid=8826212601760362483",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Tonkatsu_by_ayustety_in_Tokyo.jpg/960px-Tonkatsu_by_ayustety_in_Tokyo.jpg"
          }
        ]
      }
    ],
    "localTodo": [
      {
        "time": "~09:40",
        "name": "Fukuyama Castle",
        "what": "station-side castle keep, quick photo stop",
        "map": "https://www.google.com/maps/search/?api=1&query=Fukuyama%20Castle%20Hiroshima"
      },
      {
        "time": "~10:30",
        "name": "Tomonoura (Ponyo harbour)",
        "what": "the seaside town that inspired Ghibli's Ponyo — the stone gangi jetty, the old jōyatō lighthouse and the cliffside hillside; Galiya's headline Ghibli stop and an easy kid-friendly port walk",
        "map": "https://www.google.com/maps/search/?api=1&query=Tomonoura%20Fukuyama"
      },
      {
        "time": "~14:30",
        "name": "Washūzan Viewpoint",
        "what": "sweeping panorama of the Seto Ōhashi bridge over the island-dotted Inland Sea",
        "map": "https://www.google.com/maps/search/?api=1&query=Washuzan%20Viewpoint%20Kurashiki"
      },
      {
        "time": "~16:00",
        "name": "Kurashiki Bikan + Ōhara Museum of Art",
        "what": "willow-lined canal of white-walled kura storehouses; a flat-bottomed boat ride for the child, then Japan's first Western-art museum",
        "map": "https://www.google.com/maps/search/?api=1&query=Kurashiki%20Bikan%20historical%20quarter"
      }
    ]
  },
{
    "d": 19,
    "id": "himeji",
    "miles": 105,
    "dmin": 169,
    "rest": false,
    "region": "Kansai",
    "title": "The Great Castle",
    "route": "Kurashiki → Himeji / Kobe",
    "desc": "A relaxed run east to Japan's most magnificent castle. The shorter drive leaves a proper half-day for Himeji Castle and its Kōko-en garden, then an easy hop into Kobe for the night.",
    "tags": ["ride", "kid"],
    "gfrom": "Kurashiki, Okayama, Japan",
    "gto": "Kobe, Japan",
    "gvia": "Himeji, Hyogo, Japan",
    "poi": [
      {
        "name": "Himeji Castle & Kōko-en",
        "what": "White Heron castle + garden, unhurried, with lunch",
        "q": "Himeji Castle",
        "slot": "lunch",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/Himeji_Castle%2C_November_2016_-02.jpg/960px-Himeji_Castle%2C_November_2016_-02.jpg",
        "wiki": "https://en.wikipedia.org/wiki/Himeji_Castle",
        "it": ["food", "castle"]
      },
      {
        "name": "Kobe Harborland",
        "what": "Harbour evening & Kobe beef",
        "q": "Kobe Harborland",
        "slot": "scenic",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Himeji_Koko-en_Garden_NIK_0898.jpg/960px-Himeji_Koko-en_Garden_NIK_0898.jpg"
      }
    ],
    "eats": [
      {
        "slot": "coffee",
        "area": "Kobe (Motomachi / Chuo Ward)",
        "picks": [
          {
            "name": "TAOCA COFFEE Kobe Motomachi",
            "cuisine": "specialty coffee",
            "rating": 4.8,
            "why": "Galiya & Ruslan — Kobe's marquee specialty roaster; pour-overs and house cakes (a slice/juice for Aslan)",
            "kid": false,
            "map": "https://maps.google.com/?cid=9385516540078879431",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/A_small_cup_of_coffee.JPG/960px-A_small_cup_of_coffee.JPG"
          }
        ]
      },
      {
        "slot": "lunch",
        "area": "Himeji Castle (Honmachi)",
        "picks": [
          {
            "name": "Menme (めん処 まる味)",
            "cuisine": "Himeji udon / local noodles",
            "rating": 4.5,
            "why": "Galiya — well-loved noodle house steps from the castle",
            "kid": false,
            "map": "https://maps.google.com/?cid=12605750817218965755",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Udon_by_udono.jpg/960px-Udon_by_udono.jpg"
          },
          {
            "name": "HIMEJI UDEN (姫路うでん)",
            "cuisine": "udon specialist",
            "rating": 4.7,
            "why": "Aslan — a bowl of plain udon he'll actually eat",
            "kid": true,
            "map": "https://maps.google.com/?cid=16675121459691659468",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Udon_by_udono.jpg/960px-Udon_by_udono.jpg"
          },
          {
            "name": "Eel restaurant Hiiragi (柊)",
            "cuisine": "anago / unagi (grilled eel) sets",
            "rating": 4.1,
            "why": "Ruslan & Galiya — Seto-Inland anago, a Himeji specialty",
            "kid": false,
            "map": "https://maps.google.com/?cid=11227371164931079938",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Unagi_Don_-_Kura_AUD12.90_regular_%283723645846%29.jpg/960px-Unagi_Don_-_Kura_AUD12.90_regular_%283723645846%29.jpg"
          }
        ]
      },
      {
        "slot": "dinner",
        "area": "Kobe (Sannomiya / Chuo Ward)",
        "picks": [
          {
            "name": "Kobe Beef KOJYU",
            "cuisine": "Kobe-beef teppanyaki",
            "rating": 4.9,
            "why": "Galiya & Ruslan — the trip's Kobe-beef splurge (reserve ahead)",
            "kid": false,
            "map": "https://maps.google.com/?cid=1379734323732265440",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/4_Kobe_Beef%2C_Kobe_Japan.jpg/960px-4_Kobe_Beef%2C_Kobe_Japan.jpg"
          },
          {
            "name": "KOBE BEEF EiKiChi",
            "cuisine": "Kobe-beef teppanyaki / steak",
            "rating": 4.8,
            "why": "Ruslan — chef-grilled Kobe beef at the counter",
            "kid": false,
            "map": "https://maps.google.com/?cid=12911166532687467298",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/4_Kobe_Beef%2C_Kobe_Japan.jpg/960px-4_Kobe_Beef%2C_Kobe_Japan.jpg"
          },
          {
            "name": "Sushiro Sannomiya Ikuta Road",
            "cuisine": "conveyor-belt sushi (famiresu chain)",
            "rating": 3.7,
            "why": "Aslan — kaiten sushi, tamago/karaage/plain plates and a touchscreen he'll love",
            "kid": true,
            "map": "https://maps.google.com/?cid=9260017382291780962",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Plateau_de_Sushis.JPG/960px-Plateau_de_Sushis.JPG"
          }
        ]
      }
    ],
    "localTodo": [
      {
        "time": "~09:45",
        "name": "Bizen-yaki pottery town, Imbe",
        "what": "brick-chimney kiln village ~35 min east on Route 2; short beginner hand-shaping workshop (reserve ahead; confirm under-6 OK; not a Monday) — a hands-on craft for Aslan",
        "map": "https://www.google.com/maps/search/?api=1&query=Imbe%20Bizen%20pottery%20Okayama"
      },
      {
        "time": "~12:00",
        "name": "Himeji Castle & Kōko-en",
        "what": "the White Heron castle, Japan's finest keep, plus the Kōko-en garden — unhurried, lunch nearby",
        "map": "https://www.google.com/maps/search/?api=1&query=Himeji%20Castle"
      },
      {
        "time": "~17:30",
        "name": "Kobe Harborland & Mosaic",
        "what": "harbour-front boardwalk, Ferris wheel and shops for an easy evening stroll before dinner — kid-friendly",
        "map": "https://www.google.com/maps/search/?api=1&query=Kobe%20Harborland"
      }
    ]
  },
{
    "d": 20,
    "id": "awaji",
    "miles": 64,
    "dmin": 105,
    "rest": false,
    "region": "Kansai",
    "title": "Bridge to Awaji & Home",
    "route": "Kobe → Awaji → Osaka",
    "desc": "A short, scenic flourish to close the loop: cross the Akashi Kaikyō Bridge — for years the longest suspension span on earth — onto Awaji Island, loop its gentle, flower-filled north coast, then recross and drop into Osaka. Kept deliberately light so the family arrives unhurried.",
    "tags": ["ride", "kid", "end"],
    "gfrom": "Kobe, Japan",
    "gto": "Osaka, Japan",
    "gvia": "Awaji Island, Japan",
    "poi": [
      {
        "name": "Akashi Kaikyō Bridge",
        "what": "Ride the ~4 km span; photo stop at the Awaji end",
        "q": "Akashi Kaikyo Bridge",
        "slot": "stop",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Akashi-Kaikyo_Bridge_h008.jpg/960px-Akashi-Kaikyo_Bridge_h008.jpg",
        "wiki": "https://en.wikipedia.org/wiki/Akashi_Kaiky%C5%8D_Bridge",
        "it": ["scenic"]
      },
      {
        "name": "Nijigen no Mori",
        "what": "Anime park (Naruto/Godzilla/Crayon Shin-chan) — a kid magnet",
        "q": "Nijigen no Mori Awaji",
        "slot": "activity",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Akashi_Bridge.JPG/960px-Akashi_Bridge.JPG",
        "it": ["kid"]
      },
      {
        "name": "Awaji Hanasajiki",
        "what": "Hillside flower fields over the Inland Sea",
        "q": "Awaji Hanasajiki",
        "slot": "scenic",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Awaji_Balcony_flower_in_2013_04.JPG/960px-Awaji_Balcony_flower_in_2013_04.JPG",
        "it": ["scenic"]
      }
    ],
    "eats": [
      {
        "slot": "coffee",
        "area": "Kobe — Motomachi (near Meriken Park, before the museum)",
        "picks": [
          {
            "name": "TAOCA COFFEE Kobe Motomachi",
            "cuisine": "specialty coffee",
            "rating": 4.8,
            "why": "Galiya & Ruslan — Kobe's beloved specialty roaster for a top pour-over/latte; quiet morning stop a short walk from Meriken Park (cookies/cake for Aslan)",
            "kid": false,
            "map": "https://maps.google.com/?cid=9385516540078879431",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/A_small_cup_of_coffee.JPG/960px-A_small_cup_of_coffee.JPG"
          }
        ]
      },
      {
        "slot": "lunch",
        "area": "North Awaji (Iwaya / Shizuki, near the bridge)",
        "picks": [
          {
            "name": "genpei (魚増鮮魚店 げんぺい)",
            "cuisine": "Awaji seafood — sashimi & kaisen-don",
            "rating": 4.6,
            "why": "Galiya — island-fresh fish right by the Iwaya bridge landing",
            "kid": false,
            "map": "https://maps.google.com/?cid=9299380464621384460",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Kaisendon_001.jpg/960px-Kaisendon_001.jpg"
          },
          {
            "name": "GOODMEAT AWAJISHIMA",
            "cuisine": "Awaji wagyu / grilled beef",
            "rating": 4.3,
            "why": "Ruslan — local Awaji-beef on the island where it's raised",
            "kid": false,
            "map": "https://maps.google.com/?cid=16763712060960368477",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/JP_%E6%97%A5%E6%9C%AC_Japan_%E6%B2%96%E7%B9%A9_OKINAWA_%E9%82%A3%E9%9C%B8_Naha_%E4%B9%85%E8%8C%82%E5%9C%B0_Kumoji_MK_Building_shop_%E5%92%8C%E7%89%9B%E7%87%92%E8%82%89%E5%BA%97_BBQ_Motobu_WAGYU_Yakiniku_Beef_Restaurant_lunch_meal_January_2025_R12S_09.jpg/960px-thumbnail.jpg"
          },
          {
            "name": "Izumoan (いずも庵)",
            "cuisine": "udon & soba noodles",
            "rating": 4.1,
            "why": "Aslan — plain hot udon he'll actually eat (Galiya gets her noodles too)",
            "kid": true,
            "map": "https://maps.google.com/?cid=8247348910706101654",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Sanuki_udon_by_open-arms.jpg/960px-Sanuki_udon_by_open-arms.jpg"
          }
        ]
      },
      {
        "slot": "dinner",
        "area": "Osaka — Namba / Dōtonbori",
        "picks": [
          {
            "name": "Namba Okonomiyaki Ajinoya Honten (味乃家)",
            "cuisine": "Osaka okonomiyaki",
            "rating": 4.3,
            "why": "Galiya — the city's signature savoury pancake, a celebratory homecoming dish",
            "kid": false,
            "map": "https://maps.google.com/?cid=13558371125293422542",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Okonomiyaki_001.jpg/960px-Okonomiyaki_001.jpg"
          },
          {
            "name": "Hanamaruken Hozenji",
            "cuisine": "Osaka ramen (braised-pork shoyu)",
            "rating": 4.3,
            "why": "Galiya & Ruslan — a hearty famous Osaka ramen bowl",
            "kid": false,
            "map": "https://maps.google.com/?cid=12134182644213953393",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/4/42/Ramen.jpg"
          },
          {
            "name": "CHOJIRO Hozenji Flagship (廻る寿司 长次郎)",
            "cuisine": "conveyor-belt sushi (kaiten-zushi)",
            "rating": 4.1,
            "why": "Aslan — touch-panel kaiten with plain egg, cucumber, karaage & rice he can pick himself",
            "kid": true,
            "map": "https://maps.google.com/?cid=2946437673775376530",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Kaiten-zushi_002.jpg/960px-Kaiten-zushi_002.jpg"
          }
        ]
      }
    ],
    "localTodo": [
      {
        "time": "~10:00",
        "name": "Kawasaki Good Times World",
        "what": "Kawasaki Heavy Industries museum at Meriken Park — sit-on motorcycles & Jet Skis, a Shinkansen cab, helicopter and robots; a perfect moto-family hit for Aslan (~1.5h, opens 10:00, closed Mon)",
        "map": "https://www.google.com/maps/search/?api=1&query=Kawasaki%20Good%20Times%20World%20Kobe"
      },
      {
        "time": "~11:45",
        "name": "Akashi Kaikyō Bridge",
        "what": "Ride the ~4 km span — for years the longest suspension bridge on earth; photo stop at the Awaji end",
        "map": "https://www.google.com/maps/search/?api=1&query=Akashi%20Kaikyo%20Bridge"
      },
      {
        "time": "~14:00",
        "name": "Nijigen no Mori",
        "what": "Anime theme park on Awaji (Naruto, Godzilla, Crayon Shin-chan zones) — a kid magnet for Aslan",
        "map": "https://www.google.com/maps/search/?api=1&query=Nijigen%20no%20Mori%20Awaji"
      },
      {
        "time": "~15:30",
        "name": "Awaji Hanasajiki",
        "what": "Hillside flower fields looking over the Inland Sea — an easy, pretty last stretch before recrossing",
        "map": "https://www.google.com/maps/search/?api=1&query=Awaji%20Hanasajiki"
      }
    ]
  },
{
    "d": 21,
    "id": "osaka",
    "miles": 15,
    "rest": true,
    "region": "Kansai",
    "title": "Osaka & Bike Return",
    "route": "Osaka (light riding)",
    "desc": "Return the motorcycles at the Suita base and celebrate the journey — a relaxed Osaka recovery day before tomorrow's big USJ outing. Osaka Castle and park, and the food streets of Dōtonbori; the Kaiyukan whale-shark aquarium is the calm option if you'd rather save energy for Super Nintendo World.",
    "luggage": "The loop is closed — both cases are back in Osaka: the base-camp case from left-luggage and the chain case forwarded back from Onomichi (Day 17). Reunite and repack, then choose the homeward move — takkyūbin both ahead to the Tokyo departure hotel or Haneda (send Day 21–22, before the morning cutoff), or carry them on the Day-23 train.",
    "tags": ["rest", "kid", "stay2"],
    "gfrom": "Suita, Osaka",
    "gto": "Osaka Aquarium Kaiyukan",
    "gvia": "",
    "poi": [
      {
        "name": "Osaka Castle",
        "what": "Castle & park",
        "q": "Osaka Castle",
        "slot": "activity",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Osaka_Castle%2C_Keep_tower%2C_South_view_20190415_1.jpg/960px-Osaka_Castle%2C_Keep_tower%2C_South_view_20190415_1.jpg",
        "wiki": "https://en.wikipedia.org/wiki/Osaka_Castle",
        "it": ["castle"]
      },
      {
        "name": "Nintendo OSAKA + Pokémon Center (Daimaru Umeda 13F)",
        "what": "Kansai's flagship Nintendo store and a big Pokémon Center sit on the same walk-in floor of Daimaru next to JR Osaka/Umeda — Mario/Zelda/Splatoon and Pokémon plush, figures and exclusives. No ticket needed; a no-fuss double win for Aslan and Galiya.",
        "q": "Nintendo OSAKA Daimaru Umeda",
        "slot": "activity",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Peach%27sCastle_at_Universal_Studios_Japan_20220814.jpg/960px-Peach%27sCastle_at_Universal_Studios_Japan_20220814.jpg",
        "wiki": "https://en.wikipedia.org/wiki/Pok%C3%A9mon_Center",
        "it": ["nintendo", "toys"]
      },
      {
        "name": "Donguri Republic (Ghibli shop)",
        "what": "The official Studio Ghibli store — Totoro/Ponyo/Kiki goods in the central Umeda malls, the easy way to close Galiya's Ghibli thread with a souvenir (and a plush for Aslan).",
        "q": "Donguri Republic Osaka",
        "slot": "stop",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Dotonbori%2C_Osaka%2C_at_night%2C_November_2016.jpg/960px-Dotonbori%2C_Osaka%2C_at_night%2C_November_2016.jpg",
        "wiki": "https://en.wikipedia.org/wiki/Studio_Ghibli",
        "it": ["ghibli", "toys"]
      },
      {
        "name": "Den Den Town & Super Potato",
        "what": "Osaka's toy-and-figure mecca in Nipponbashi: the Super Potato retro-game shop (Mario-statue storefront, classic Famicom/N64), floors of gachapon capsule toys, and the figure/second-hand shops (Mandarake, Hobby Station) — the most reliable place on the whole trip to turn up Transformers / Takara Tomy robot toys for Aslan.",
        "q": "Super Potato Den Den Town Osaka",
        "slot": "stop",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/OSAKA_Tsutenkaku_%2820190810%29.jpg/960px-OSAKA_Tsutenkaku_%2820190810%29.jpg",
        "wiki": "https://en.wikipedia.org/wiki/Den_Den_Town",
        "it": ["toys", "nintendo"]
      },
      {
        "name": "Kuromon Ichiba",
        "what": "'Osaka's kitchen' — a covered market of eat-as-you-walk seafood, wagyu skewers and fruit, a five-minute walk from Den Den Town.",
        "q": "Kuromon Ichiba Market Osaka",
        "slot": "lunch",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Dotonbori_Neon_Sign%2C_Osaka_20190415_1.jpg/960px-Dotonbori_Neon_Sign%2C_Osaka_20190415_1.jpg",
        "it": ["food", "kid", "toys"]
      },
      {
        "name": "Dōtonbori",
        "what": "Neon, street food and a celebration dinner",
        "q": "Dotonbori Osaka",
        "slot": "dinner",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Shinsekai_and_Tsutenkaku_Tower.jpg/960px-Shinsekai_and_Tsutenkaku_Tower.jpg",
        "wiki": "https://en.wikipedia.org/wiki/D%C5%8Dtonbori",
        "it": ["food"]
      },
      {
        "name": "Kaiyukan (option)",
        "what": "Whale-shark aquarium, if you'd rather save USJ energy for tomorrow",
        "q": "Osaka Aquarium Kaiyukan",
        "slot": "scenic",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Entrance_of_Osaka_Aquarium_%22Kaiyukan%22.jpg/960px-Entrance_of_Osaka_Aquarium_%22Kaiyukan%22.jpg",
        "it": ["kid"]
      }
    ],
    "eats": [
      {
        "slot": "coffee",
        "area": "Shinsaibashi (near Namba)",
        "picks": [
          {
            "name": "LiLo Coffee Roasters",
            "cuisine": "specialty coffee",
            "rating": 4.8,
            "why": "Ruslan & Galiya — Osaka's top in-house roaster (huge single-origin lineup, espresso & pour-over) a short walk from Namba; sweet iced lattes and cocoa keep Aslan happy",
            "kid": false,
            "map": "https://maps.google.com/?cid=16291659530834990214",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/A_small_cup_of_coffee.JPG/960px-A_small_cup_of_coffee.JPG"
          }
        ]
      },
      {
        "slot": "lunch",
        "area": "Namba / Den Den Town",
        "picks": [
          {
            "name": "Udon Tamatama",
            "cuisine": "hand-made udon noodles",
            "rating": 4.7,
            "why": "Aslan — plain kake udon he'll happily slurp; Galiya gets top-rated noodles too",
            "kid": true,
            "map": "https://maps.google.com/?cid=8637420094679159397",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Kake_udon_by_udono.jpg/960px-Kake_udon_by_udono.jpg"
          },
          {
            "name": "Kyoto Wamen Yukichi (Namba Sennichimae)",
            "cuisine": "ramen",
            "rating": 5.0,
            "why": "Galiya — a standout bowl right in the Namba food maze",
            "kid": false,
            "map": "https://maps.google.com/?cid=14468422320166151533",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Ramen_2.jpg/960px-Ramen_2.jpg"
          },
          {
            "name": "Tsurutontan Soemoncho",
            "cuisine": "premium udon (big bowls, lots of plain options)",
            "rating": 4.0,
            "why": "Galiya & Ruslan — famous Osaka udon house; easy plain bowls work for Aslan too",
            "kid": false,
            "map": "https://maps.google.com/?cid=12563860394098208989",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Kake_udon_by_udono.jpg/960px-Kake_udon_by_udono.jpg"
          }
        ]
      },
      {
        "slot": "dinner",
        "area": "Dōtonbori",
        "picks": [
          {
            "name": "Chibo Dōtonbori",
            "cuisine": "Osaka okonomiyaki / teppanyaki",
            "rating": 4.1,
            "why": "Galiya & Ruslan — the celebratory Osaka griddle classic on the neon canal",
            "kid": false,
            "map": "https://maps.google.com/?cid=11230990528616538865",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Okonomiyaki_Osaka_2.JPG/960px-Okonomiyaki_Osaka_2.JPG"
          },
          {
            "name": "Sushiro Dōtonbori",
            "cuisine": "conveyor-belt sushi",
            "rating": 4.6,
            "why": "Aslan — tap-the-screen kaiten sushi with plain rice, tamago, karaage and fries; pure kid win",
            "kid": true,
            "map": "https://maps.google.com/?cid=11787458940792052758",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Conveyor_belt_sushi_at_Mashiro_Sushi.jpg/960px-Conveyor_belt_sushi_at_Mashiro_Sushi.jpg"
          },
          {
            "name": "OKO - Fun Okonomiyaki Bar",
            "cuisine": "okonomiyaki / teppan (English-friendly)",
            "rating": 4.7,
            "why": "Galiya — top-rated, lively cook-at-the-counter alternative if Chibo has a queue",
            "kid": false,
            "map": "https://maps.google.com/?cid=17891229658034342593",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Okonomiyaki_-a_Japanese_savory_pancake_in_Osaka%2C_Japan.jpg/960px-Okonomiyaki_-a_Japanese_savory_pancake_in_Osaka%2C_Japan.jpg"
          }
        ]
      }
    ],
    "localTodo": [
      {
        "time": "~09:30",
        "name": "Bike return — Suita base (Bike Rental Japan)",
        "what": "hand back the Africa Twin + CB400X, empty panniers, settle paperwork; the riding loop is closed",
        "map": "https://www.google.com/maps/search/?api=1&query=Bike%20Rental%20Japan%20Suita%20Osaka"
      },
      {
        "time": "~11:00",
        "name": "Osaka Castle & park",
        "what": "easy first walk of the no-ride day — moats, stone walls, gold-trimmed keep",
        "map": "https://www.google.com/maps/search/?api=1&query=Osaka%20Castle"
      },
      {
        "time": "~14:30",
        "name": "Nintendo OSAKA + Pokémon Center (Daimaru Umeda 13F)",
        "what": "Kansai flagship Nintendo store + big Pokémon Center on one walk-in floor — Mario/Zelda/Splatoon & Pokémon plush for Aslan and Galiya",
        "map": "https://www.google.com/maps/search/?api=1&query=Nintendo%20OSAKA%20Daimaru%20Umeda"
      },
      {
        "time": "~15:30",
        "name": "Donguri Republic (Studio Ghibli shop)",
        "what": "Totoro/Ponyo/Kiki goods — Galiya's Ghibli souvenir stop",
        "map": "https://www.google.com/maps/search/?api=1&query=Donguri%20Republic%20Osaka"
      },
      {
        "time": "~16:30",
        "name": "Den Den Town & Super Potato",
        "what": "Osaka's toy/figure mecca — retro Mario shop, gachapon floors, and the best shot at Transformers / Takara Tomy robot figures for Aslan",
        "map": "https://www.google.com/maps/search/?api=1&query=Super%20Potato%20Den%20Den%20Town%20Osaka"
      },
      {
        "time": "~17:30",
        "name": "Kuromon Ichiba",
        "what": "\"Osaka's kitchen\" — eat-as-you-walk seafood, wagyu skewers and fruit, a short walk from Den Den Town",
        "map": "https://www.google.com/maps/search/?api=1&query=Kuromon%20Ichiba"
      }
    ]
  },
{
    "d": 22,
    "id": "osaka",
    "miles": 0,
    "rest": true,
    "city": true,
    "region": "Kansai",
    "title": "Super Nintendo World / USJ",
    "route": "Osaka — Universal Studios Japan (no riding)",
    "desc": "With the motorcycles safely back at the Suita base, the family gives a full day to Universal Studios Japan on Osaka Bay and its headline land, Super Nintendo World — a life-size, interactive Mushroom Kingdom. Ride Mario Kart: Koopa's Challenge and the gentle Yoshi's Adventure, and strap on a Power-Up Band to punch ? blocks across the land. The wider park adds Harry Potter, Minion Park and family shows. Buy dated tickets ahead and reserve the Nintendo area / key rides as early as the system allows — this is the busiest day of the trip.",
    "tags": ["rest", "kid"],
    "gfrom": "Universal Studios Japan",
    "gto": "Universal Studios Japan",
    "gvia": "",
    "poi": [
      {
        "name": "Super Nintendo World",
        "what": "Life-size Mushroom Kingdom; Mario Kart: Koopa's Challenge + an interactive Power-Up Band to punch ? blocks and collect coins. Normally needs a (free) Area Timed-Entry ticket or a paid Express Pass to enter the land.",
        "q": "Super Nintendo World Osaka",
        "slot": "activity",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Peach%27sCastle_at_Universal_Studios_Japan_20220814.jpg/960px-Peach%27sCastle_at_Universal_Studios_Japan_20220814.jpg",
        "wiki": "https://en.wikipedia.org/wiki/Super_Nintendo_World",
        "it": ["nintendo", "kid"]
      },
      {
        "name": "Universal Studios Japan",
        "what": "The wider park — The Wizarding World of Harry Potter, Minion Park and family rides and shows. A full day out; pace it and plan rest breaks for the 6-year-old.",
        "q": "Universal Studios Japan",
        "slot": "activity",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Power_up_bands_at_Super_Nintendo_World_%28Universal_Studios_Japan%29.png/960px-Power_up_bands_at_Super_Nintendo_World_%28Universal_Studios_Japan%29.png",
        "wiki": "https://en.wikipedia.org/wiki/Universal_Studios_Japan"
      },
      {
        "name": "Kaiyukan (calm alternative)",
        "what": "Whale-shark aquarium across the bay, indoor and all-weather — the low-key option if a full theme-park day is too much.",
        "q": "Osaka Aquarium Kaiyukan",
        "slot": "scenic",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Entrance_of_Osaka_Aquarium_%22Kaiyukan%22.jpg/960px-Entrance_of_Osaka_Aquarium_%22Kaiyukan%22.jpg",
        "wiki": "https://en.wikipedia.org/wiki/Osaka_Aquarium_Kaiyukan",
        "it": ["kid"]
      }
    ],
    "eats": [
      {
        "slot": "coffee",
        "area": "Osaka Port / bayfront (near Kaiyukan, across the bay from USJ)",
        "picks": [
          {
            "name": "9 Borden Coffee",
            "cuisine": "specialty coffee",
            "rating": 4.6,
            "why": "Ruslan & Galiya — a proper bayfront specialty roaster for a serious morning cup; relaxed cafe with cake/juice on hand for Aslan",
            "kid": false,
            "map": "https://maps.google.com/?cid=7634926797592378582",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/A_small_cup_of_coffee.JPG/960px-A_small_cup_of_coffee.JPG"
          }
        ]
      },
      {
        "slot": "lunch",
        "area": "Universal CityWalk Osaka (just outside the park gate)",
        "picks": [
          {
            "name": "Osaka Soba Shinobu AN",
            "cuisine": "soba & udon noodles",
            "rating": 4.3,
            "why": "Galiya — proper hand-cut soba/udon for a quick foodie noodle fix between rides",
            "kid": false,
            "map": "https://maps.google.com/?cid=8457458393198602915",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Soba_and_tempura_combo_%2826498960080%29.jpg/960px-Soba_and_tempura_combo_%2826498960080%29.jpg"
          },
          {
            "name": "551 Horai Universal Citywalk Osaka",
            "cuisine": "butaman pork buns & gyoza",
            "rating": 4.1,
            "why": "Aslan — fluffy plain pork buns and gyoza he'll happily eat; Osaka's famous grab-and-go, fast for a park day",
            "kid": true,
            "map": "https://maps.google.com/?cid=16138308789551627008",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/8/87/Nikuman.jpg"
          }
        ]
      },
      {
        "slot": "dinner",
        "area": "Universal CityWalk Osaka / USJ bayfront",
        "picks": [
          {
            "name": "GYUKATSU Kyoto Katsugyu Universal Citywalk Osaka",
            "cuisine": "gyukatsu (breaded beef cutlet, grill-it-yourself)",
            "rating": 4.7,
            "why": "the whole family — crisp breaded beef Aslan loves as plain katsu, and a fun cook-on-a-stone format; the standout near USJ",
            "kid": true,
            "map": "https://maps.google.com/?cid=7712802532359384383",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Tonkatsu_of_Kimukatsu.jpg/960px-Tonkatsu_of_Kimukatsu.jpg"
          },
          {
            "name": "九九雲 (Kukuun)",
            "cuisine": "ramen",
            "rating": 4.5,
            "why": "Galiya — a well-loved ramen bowl a short hop along the bayfront (Osaka Port, near Kaiyukan) to end the day",
            "kid": false,
            "map": "https://maps.google.com/?cid=16379801422414639646",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Shoyu_Ramen.jpg/960px-Shoyu_Ramen.jpg"
          }
        ]
      }
    ],
    "localTodo": [
      {
        "time": "~08:00",
        "name": "Super Nintendo World (USJ)",
        "what": "life-size Mushroom Kingdom — Mario Kart: Koopa's Challenge, Yoshi's Adventure, interactive Power-Up Band. Get the free Area Timed-Entry in the app the moment gates open (or use Express Pass)",
        "map": "https://www.google.com/maps/search/?api=1&query=Super%20Nintendo%20World%20Osaka"
      },
      {
        "time": "~13:30",
        "name": "Universal Studios Japan",
        "what": "Wizarding World of Harry Potter, Minion Park and family shows — pace it and build in shade/rest breaks for Aslan",
        "map": "https://www.google.com/maps/search/?api=1&query=Universal%20Studios%20Japan"
      },
      {
        "time": "alt",
        "name": "Osaka Aquarium Kaiyukan",
        "what": "calm all-weather alternative across the bay — whale-shark tank you spiral down past, if a full theme-park day is too much",
        "map": "https://www.google.com/maps/search/?api=1&query=Osaka%20Aquarium%20Kaiyukan"
      }
    ]
  },
{
    "d": 23,
    "id": "tokyo",
    "miles": 0,
    "rest": true,
    "rail": true,
    "region": "Kansai → Tokyo",
    "title": "Reposition to Tokyo",
    "route": "Osaka / Kyoto 🚄 Tokyo",
    "desc": "Flexible buffer day that also repositions to Tokyo for the flight home. Kyoto sits right on the Tōkaidō line — sightsee in the morning (Fushimi Inari's thousand torii or a last Osaka food stroll), then board an afternoon Nozomi at Kyoto (or Shin-Osaka) → Tokyo (~2h30m) and overnight near Haneda/Shinagawa. The slack here also absorbs any earlier weather day. Forward the cases ahead by takkyūbin so the train is light.",
    "luggage": "Have the travel cases forwarded ahead by takkyūbin to the Tokyo hotel so the afternoon Nozomi is light — send them before the morning cutoff and allow the day in transit.",
    "tags": ["rest", "kid"],
    "gfrom": "Osaka, Japan",
    "gto": "Tokyo Station",
    "gvia": "Kyoto, Japan",
    "poi": [
      {
        "name": "Fushimi Inari, Kyoto",
        "what": "Thousand vermilion torii gates (board the Shinkansen at Kyoto Station after)",
        "q": "Fushimi Inari Taisha",
        "slot": "activity",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Fushimi_Inari-taisha%2C_Kyoto%2C_20240818_1343_4411.jpg/960px-Fushimi_Inari-taisha%2C_Kyoto%2C_20240818_1343_4411.jpg",
        "wiki": "https://en.wikipedia.org/wiki/Fushimi_Inari-taisha",
        "it": ["castle"]
      },
      {
        "name": "Osaka Castle",
        "what": "A last castle & park stroll",
        "q": "Osaka Castle",
        "slot": "activity",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Osaka_Castle%2C_Keep_tower%2C_South_view_20190415_1.jpg/960px-Osaka_Castle%2C_Keep_tower%2C_South_view_20190415_1.jpg",
        "wiki": "https://en.wikipedia.org/wiki/Osaka_Castle",
        "it": ["castle"]
      },
      {
        "name": "Shinkansen to Tokyo",
        "what": "Afternoon Nozomi to the departure city",
        "q": "Kyoto Station",
        "slot": "scenic",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Mount_Fuji_and_Shinkansen_N700.jpg/960px-Mount_Fuji_and_Shinkansen_N700.jpg"
      }
    ],
    "eats": [
      {
        "slot": "coffee",
        "area": "Higashiyama, Kyoto",
        "picks": [
          {
            "name": "% ARABICA Kyoto Higashiyama",
            "cuisine": "specialty coffee",
            "rating": 4.4,
            "why": "Galiya & Ruslan — Kyoto's marquee third-wave roaster, world-class lattes near Yasaka Pagoda; warm milk/juice keeps Aslan happy on a last Kyoto morning",
            "kid": false,
            "map": "https://maps.google.com/?cid=5927226485630185275",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/A_small_cup_of_coffee.JPG/960px-A_small_cup_of_coffee.JPG"
          }
        ]
      },
      {
        "slot": "lunch",
        "area": "Fushimi Inari / Kyoto Station",
        "picks": [
          {
            "name": "Teuchi-udon Kendonya",
            "cuisine": "hand-cut Kyoto udon & soba",
            "rating": 4.5,
            "why": "Galiya — fresh hand-cut udon a short walk from the Fushimi Inari gates",
            "kid": false,
            "map": "https://maps.google.com/?cid=16984350875559884345",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Kake_udon_by_udono.jpg/960px-Kake_udon_by_udono.jpg"
          },
          {
            "name": "Inari Myoudai Dohachi",
            "cuisine": "kitsune/inari udon (shrine specialty)",
            "rating": 4.7,
            "why": "Galiya — the sweet fried-tofu udon that's the dish of the Inari shrine",
            "kid": true,
            "map": "https://maps.google.com/?cid=3500343508728031195",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Bowl_of_Kitsune_Udon.jpg/960px-Bowl_of_Kitsune_Udon.jpg"
          },
          {
            "name": "Katsukura - Kyoto Porta",
            "cuisine": "tonkatsu set meals",
            "rating": 4.4,
            "why": "Aslan — crisp breaded pork katsu & plain rice right inside Kyoto Station before the train",
            "kid": true,
            "map": "https://maps.google.com/?cid=2658070174394966790",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Tonkatsu.jpg/960px-Tonkatsu.jpg"
          }
        ]
      },
      {
        "slot": "dinner",
        "area": "Shinagawa / Haneda",
        "picks": [
          {
            "name": "Ramen Waka Tokyo",
            "cuisine": "Tokyo shoyu ramen",
            "rating": 4.1,
            "why": "Galiya — a tidy classic Tokyo ramen bowl steps from Shinagawa Station",
            "kid": false,
            "map": "https://maps.google.com/?cid=13477905415039930785",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Shoyu_Ramen.jpg/960px-Shoyu_Ramen.jpg"
          },
          {
            "name": "Maruhachi",
            "cuisine": "tonkatsu / katsu",
            "rating": 4.4,
            "why": "Aslan — crunchy katsu cutlet + plain rice, an easy safe last-night meal",
            "kid": true,
            "map": "https://maps.google.com/?cid=188921099918380869",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Tonkatsu.jpg/960px-Tonkatsu.jpg"
          },
          {
            "name": "Sushi Banya Kai Shinagawa",
            "cuisine": "nigiri sushi",
            "rating": 4.2,
            "why": "Galiya & Ruslan — a celebratory last-night Tokyo sushi by the station",
            "kid": false,
            "map": "https://maps.google.com/?cid=14932386608607633121",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Nigiri_Sushi_%2825966163204%29.jpg/960px-Nigiri_Sushi_%2825966163204%29.jpg"
          }
        ]
      }
    ],
    "localTodo": [
      {
        "time": "~09:00",
        "name": "Fushimi Inari Taisha",
        "what": "walk the thousand vermilion torii gates one last shrine morning; trains from Inari station run straight to Kyoto Station",
        "map": "https://www.google.com/maps/search/?api=1&query=Fushimi%20Inari%20Taisha"
      },
      {
        "time": "~11:30",
        "name": "Kyoto Station / Kyoto Porta",
        "what": "grab lunch + last souvenirs, then board the afternoon Nozomi (cases already forwarded ahead by takkyubin)",
        "map": "https://www.google.com/maps/search/?api=1&query=Kyoto%20Station"
      },
      {
        "time": "~14:00",
        "name": "Nozomi Shinkansen to Tokyo",
        "what": "right-side seats (D/E) for the Mt Fuji view around Shizuoka — a kid-and-grown-up favourite",
        "map": "https://www.google.com/maps/search/?api=1&query=Kyoto%20Station"
      },
      {
        "time": "~17:30",
        "name": "Settle near Shinagawa/Haneda",
        "what": "check in, repack for the flight, relaxed last dinner",
        "map": "https://www.google.com/maps/search/?api=1&query=Shinagawa%20Station"
      }
    ]
  },
{
    "d": 24,
    "id": "tokyo",
    "miles": 0,
    "rest": true,
    "rail": true,
    "region": "Tokyo",
    "title": "Fly Home",
    "route": "Tokyo ✈ Seattle (nonstop)",
    "desc": "Departure bookend. From your Tokyo hotel, head to the airport and fly the nonstop Tokyo → Seattle leg (ANA/Delta from Haneda, JAL from Narita). You re-cross the date line and land in Seattle the same calendar day. The big luggage, forwarded by takkyūbin, is waiting.",
    "luggage": "The big luggage, forwarded by takkyūbin, is waiting at the Tokyo hotel / Haneda — or carried with you for the nonstop flight home.",
    "tags": ["rest"],
    "gfrom": "Tokyo Station",
    "gto": "Haneda Airport, Tokyo",
    "gvia": "",
    "poi": [
      {
        "name": "Tokyo → Haneda/Narita",
        "what": "To the airport for the nonstop home",
        "q": "Haneda Airport",
        "slot": "activity",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Marunouchi_%26_Tokyo_Station_3.jpg/960px-Marunouchi_%26_Tokyo_Station_3.jpg"
      }
    ]
  }
];

/* Themed 'Ramen Trail' foodie thread (sourced from tour/00-overview.md);
   rendered as a section on index.html and a 🍜 flag on day.html days 8/12/17. */
window.RAMEN_TRAIL = {
  "title": "The Ramen Trail",
  "subtitle": "a foodie thread for Galiya",
  "intro": "The loop happens to thread <b>four of Japan's famous regional ramen cities</b>, so we make it an explicit, celebrated thread for <b>Galiya</b> (the foodie, who loves ramen/noodles above all — see 00-family.md). Each is a genuinely <i>different</i> local bowl, eaten where it's made, and each falls on a day already on the route — no detours required. All shops below were verified operating (Google Places, June 2026); links are key-free Google Maps.",
  "note": "<b>Notes & honesty:</b> the famous <b>Shūkaen (朱華園, est. 1947)</b> — for decades <i>the</i> Onomichi-ramen marquee — <b>closed permanently in 2019</b>; its exact flavour is carried on by the founder's wife and daughter at the successor shop <b>Shu (朱)</b>, so we point there and to the classic <b>Tsutafuji</b> instead. For <b>Aslan (6)</b>, every stop has a kid-simple out — a plain bowl (no raw egg / pork belly), a side of rice, or gyoza. The <b>Day-8 lunch + dinner are a single \"two-ramen\" day</b>, so pace appetites accordingly.",
  "bookend": "<b>Bookend & off-route awareness:</b> the Tokyo bookend (Days 0–1) is a chance to add classic <b>Tokyo shoyu ramen</b> as an optional fifth bowl. Japan's other headline styles — <b>Sapporo miso, Hakata/Fukuoka tonkotsu, Kitakata, Kishimen</b> — are <b>off this Osaka loop</b> (Hokkaidō and Kyūshū aren't on the route), so they're flagged for awareness, not promised.",
  "stops": [
    {
      "n": 1,
      "day": 8,
      "slot": "lunch",
      "city": "Wakayama City",
      "pref": "Wakayama",
      "style": "Chūka-soba",
      "styleDesc": "thin noodles in a soy + pork-bone broth; eaten with pressed haya-zushi mackerel sushi on the side",
      "shop": "Ide Shoten 井出商店",
      "shopUrl": "https://maps.google.com/?cid=16098671254010911637",
      "shopNote": "the \"TV Champion\" original",
      "alts": [
        { "l": "Marusan 丸三", "u": "https://maps.google.com/?cid=14907922861654292334" }
      ],
      "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Wakayamaramen222.jpg/960px-Wakayamaramen222.jpg"
    },
    {
      "n": 2,
      "day": 8,
      "slot": "dinner",
      "city": "Tokushima City",
      "pref": "Tokushima",
      "style": "Tokushima ramen",
      "styleDesc": "dark sweet-soy tonkotsu, stewed pork belly + raw egg, rice on the side",
      "shop": "Chūka Soba Inotani 中華そば いのたに",
      "shopUrl": "https://maps.google.com/?cid=16395492876013054298",
      "shopNote": "the shop most credited with the style",
      "alts": [],
      "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Tokushima_Ramen%2C_Men-Oh_-_May_2%2C_2018.jpg/960px-Tokushima_Ramen%2C_Men-Oh_-_May_2%2C_2018.jpg"
    },
    {
      "n": 3,
      "day": 12,
      "slot": "lunch",
      "city": "Susaki",
      "pref": "Kōchi",
      "style": "Nabeyaki ramen",
      "styleDesc": "clay-pot ramen served bubbling in an earthenware donabe; thin soy-chicken broth, chikuwa, raw egg",
      "shop": "Hashimoto Shokudō 橋本食堂",
      "shopUrl": "https://maps.google.com/?cid=5613975438265449042",
      "shopNote": "",
      "alts": [
        { "l": "Mayumi-no-Mise まゆみの店", "u": "https://maps.google.com/?cid=602723661575591055" }
      ],
      "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Nabeyaki_ramen_01.jpg/960px-Nabeyaki_ramen_01.jpg"
    },
    {
      "n": 4,
      "day": 17,
      "slot": "rest-day anchor",
      "city": "Onomichi",
      "pref": "Hiroshima",
      "style": "Onomichi ramen",
      "styleDesc": "clear soy-tare chicken/niboshi broth with pork-back-fat nuggets and flat noodles",
      "shop": "Tsutafuji つたふじ",
      "shopUrl": "https://maps.google.com/?cid=9111644244913689319",
      "shopNote": "classic old-school shop",
      "alts": [
        { "l": "Shu 朱", "u": "https://maps.google.com/?cid=2246075512842085799" },
        { "l": "Maruboshi 丸ぼし", "u": "https://maps.google.com/?cid=6892398988895765996" }
      ],
      "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Onomichi_ramen_and_jiaozi_by_The_Other_View_in_Onomichi.jpg/960px-Onomichi_ramen_and_jiaozi_by_The_Other_View_in_Onomichi.jpg"
    }
  ]
};

/* Pre-trip preparation checklist (rendered by checklist.html). */
window.CHECKLIST = [
  {
    "sec": "Documents & licences",
    "icon": "📄",
    "items": [
      "Passport valid 6+ months beyond return",
      "Home-country motorcycle licence (each rider)",
      "1949 Geneva International Driving Permit (IDP), category 'A', for each rider — in the US, AAA issues it; get the physical permit before you fly (valid 1 year)",
      "Travel insurance documents that explicitly cover motorcycle riding (and the child)",
      "Motorcycle rental reservation confirmations (Bike Rental Japan, Suita/Osaka)",
      "Credit card (no foreign-transaction fee ideally) + some backup",
      "Digital + paper copies of all documents"
    ]
  },
  {
    "sec": "Motorcycle rental (Osaka loop)",
    "icon": "🏍️",
    "items": [
      "Reserve large ADV bike (Honda Africa Twin / CRF1000L) — Rider 1",
      "Reserve sub-500cc bike (Honda CB400X / NX400) — Rider 2",
      "Confirm it is an Osaka loop — pick up AND return at the Suita base (no Tokyo counter, no one-way drop)",
      "Get the explicit 22-day quote for both bikes + the deposit/hold amount in writing",
      "Confirm passenger riding is allowed — including a CHILD passenger on the Africa Twin",
      "Confirm large-bike + sub-500cc availability for your exact dates",
      "Confirm ETC card per bike (expressway tolls — Himeji/Kobe Day 19, Akashi Kaikyō bridge Day 20)",
      "Panniers/top-box fitted or allowed; ask about the optional support-truck add-on for flight-day bags",
      "Helmets & gear (rent or bring), intercoms paired"
    ]
  },
  {
    "sec": "Child-pillion setup (test parked on Day 2)",
    "icon": "🧒",
    "items": [
      "Properly fitting child motorcycle helmet (correct shell size, not an adult hand-me-down)",
      "Armoured jacket, gloves, pants and boots that fit; ear protection for longer legs",
      "Lowered/highway pegs or peg-lowering brackets so feet sit flat",
      "Passenger backrest / top-box backrest so the child can't slide rearward",
      "Proper grab rail or grab strap at the waist",
      "Child–adult tandem safety belt (harness linking child to rider)",
      "Intercom for the child; snacks, water, sun hat and a comfort item",
      "Plan stops every 60–90 minutes; never ride the child overtired or after dark"
    ]
  },
  {
    "sec": "Flights & rail",
    "icon": "✈️",
    "items": [
      "Book round-trip nonstop SEA ⇄ Tokyo (prefer Haneda for the train connection)",
      "Buy point-to-point Nozomi Shinkansen tickets Tokyo ⇄ Shin-Osaka (reserved, via smartEX) — not a JR Pass",
      "Keikyu (Haneda→Shinagawa) / N'EX (Narita) for the airport hops",
      "Three Tokyo hotel nights near a Shinkansen station (Day 0 arrival, Day 1 museum day, Day 23 departure)",
      "Book the Tokyo museum-day tickets early — Ghibli Museum (Lawson, ~a month ahead, sells out fast) and a timed teamLab Planets slot",
      "Book the Day-22 USJ dated park tickets + a Super Nintendo World Area Timed-Entry or Express Pass",
      "Arrange takkyūbin luggage forwarding Tokyo→Osaka and Osaka→Tokyo",
      "IC card (Suica/ICOCA) for trains on non-riding days"
    ]
  },
  {
    "sec": "Lodging",
    "icon": "🏨",
    "items": [
      "Book all hotels/ryokan — the six 2-night bases first (Kumano interior, Shirahama, Iya, Shimanto, Dōgo, Onomichi)",
      "Keep the Kii-interior nights (Hongū-Yunomine / Nachi) cancellable — Routes 168/311 can close after heavy rain",
      "Confirm secure motorcycle parking at every property (narrow onsen-hamlet lanes — ask where to leave the bikes)",
      "Reserve a Tsuboyu bath slot at Yunomine ahead of Day 4",
      "Family room / beds; private or family bath where wanted; dinner included at remote inns",
      "Laundry access every 3–4 days"
    ]
  },
  {
    "sec": "Ferry & timed stops",
    "icon": "⛴️",
    "items": [
      "Nankai Ferry (Day 8, Wakayama→Tokushima) is first-come, first-served for motorcycles — no reservation; arrive 30+ min early (deck ~20 bikes)",
      "Check the day's Nankai timetable (~8 sailings each way)",
      "Time the Naruto whirlpools to a spring-tide / slack window (full or new moon)",
      "Check road & river status daily in the typhoon-exposed Kii interior (Days 3–8)"
    ]
  },
  {
    "sec": "Insurance & health",
    "icon": "🛡️",
    "items": [
      "Travel + medical insurance covering motorcycling and the child",
      "Roadside-assistance / breakdown cover or rental add-on",
      "Personal medications + small first-aid kit",
      "Note nearest hospitals along the route"
    ]
  },
  {
    "sec": "Rider gear & packing",
    "icon": "🧥",
    "items": [
      "Armoured jacket & pants, gloves, riding boots (each rider)",
      "Rain layers and warm base layers (Kōyasan at ~800 m is cold in the evening)",
      "Sun protection, earplugs, neck tube",
      "Pack light — soft luggage / dry bags; big cases ride the takkyūbin, not the bikes",
      "Comfortable off-bike shoes & evening clothes"
    ]
  },
  {
    "sec": "Bike kit (carried by lead rider)",
    "icon": "🔧",
    "items": [
      "Basic tools + tyre repair/inflator",
      "First-aid kit",
      "Spare gloves / layers",
      "Phone mount + chargers / power bank",
      "Zip ties, tape, bungees"
    ]
  },
  {
    "sec": "Money & connectivity",
    "icon": "📱",
    "items": [
      "Cash — Japan is cash-heavy at rural inns, ferries and roadside stations",
      "eSIM or pocket Wi-Fi",
      "Offline Google Maps for the route regions",
      "Translation app (the family speaks English)"
    ]
  },
  {
    "sec": "Final week / day before",
    "icon": "✅",
    "items": [
      "Check the forecast — avoid typhoon/heavy-rain windows on the Kii side",
      "Reconfirm bikes, hotels, flights and Shinkansen seats",
      "Charge intercoms, phones, cameras, power banks",
      "Gear check + parked child-pillion setup test + gentle on-foot shakedown on Day 2",
      "Share the itinerary with family/contacts back home"
    ]
  }
];

/* Geocoded routing points (lat,lng) so Google Maps always resolves them. */
window.GEO = {
  "Haneda Airport, Tokyo": "35.54830,139.77800",
  "Haneda Airport": "35.54830,139.77800",
  "Shinagawa, Tokyo": "35.62876,139.73876",
  "Shinagawa Station Tokyo": "35.62876,139.73876",
  "Tokyo Station": "35.68123,139.76712",
  "Tokyo": "35.67620,139.65030",
  "Ghibli Museum Mitaka Tokyo": "35.69625,139.57028",
  "teamLab Planets TOKYO": "35.64944,139.79000",
  "Nintendo TOKYO Shibuya PARCO": "35.66230,139.69884",
  "Shibuya Crossing": "35.65950,139.70060",
  "Suita, Osaka": "34.75953,135.51676",
  "Universal Studios Japan": "34.66556,135.43250",
  "Super Nintendo World Osaka": "34.66694,135.43000",
  "Osaka, Japan": "34.69372,135.50225",
  "Osaka Castle": "34.68726,135.52585",
  "Osaka Aquarium Kaiyukan": "34.65452,135.42896",
  "Dotonbori Osaka": "34.66865,135.50310",
  "Nintendo OSAKA Daimaru Umeda": "34.70220,135.49560",
  "Donguri Republic Osaka": "34.70200,135.49700",
  "Super Potato Den Den Town Osaka": "34.66260,135.50560",
  "Kuromon Ichiba Market Osaka": "34.66560,135.50650",
  "Koyasan, Wakayama, Japan": "34.21310,135.58440",
  "Okunoin Cemetery Koyasan": "34.21556,135.61089",
  "Konpon Daito Koyasan": "34.21305,135.58066",
  "Kongobu-ji Koyasan": "34.21290,135.58480",
  "Totsukawa, Nara, Japan": "33.99155,135.79170",
  "Totsukawa village": "33.99155,135.79170",
  "Tanise no Tsuribashi Totsukawa": "34.05540,135.74660",
  "Yunomine Onsen, Wakayama, Japan": "33.82680,135.77360",
  "Tsuboyu Yunomine Onsen": "33.82680,135.77360",
  "Kawayu Onsen": "33.83889,135.78889",
  "Kumano Hongu Taisha": "33.84030,135.77330",
  "Oyunohara Otorii": "33.83806,135.77139",
  "Doro-kyo Gorge, Japan": "33.79500,135.92000",
  "Doro-kyo Gorge Kitayama": "33.79500,135.92000",
  "Daimonzaka Nachi": "33.66556,135.89167",
  "Nachi Falls": "33.66989,135.89047",
  "Kii-Katsuura, Wakayama, Japan": "33.62587,135.94123",
  "Kumano Hayatama Taisha": "33.73389,135.99139",
  "Hotel Urashima Katsuura": "33.62806,135.95306",
  "Kushimoto, Wakayama, Japan": "33.47222,135.78500",
  "Hashigui-iwa Kushimoto": "33.48389,135.79361",
  "Sandanbeki Shirahama": "33.66694,135.34556",
  "Tore-Tore Ichiba Shirahama": "33.69861,135.37389",
  "Shirahama, Wakayama, Japan": "33.68530,135.33780",
  "Adventure World, Shirahama": "33.66250,135.37083",
  "Adventure World Shirahama": "33.66250,135.37083",
  "Shirarahama Beach Shirahama": "33.68722,135.33611",
  "Senjojiki Shirahama": "33.68389,135.33472",
  "Engetsu Island Shirahama": "33.68861,135.33806",
  "Sakinoyu Onsen Shirahama": "33.68500,135.33444",
  "Wakayama Port, Japan": "34.21806,135.14528",
  "Wakayama Castle": "34.22750,135.17139",
  "Nankai Ferry Wakayama Port": "34.21806,135.14528",
  "Naruto, Tokushima, Japan": "34.17220,134.60930",
  "Uzunomichi Naruto": "34.23617,134.64198",
  "Ide Shoten Wakayama": "34.22810,135.19030",
  "Otsuka Museum of Art Naruto": "34.24380,134.55590",
  "Tokushima Ramen": "34.06950,134.55300",
  "Tokushima, Japan": "34.07423,134.55116",
  "Tokushima Station": "34.07423,134.55116",
  "Oboke, Tokushima, Japan": "33.87669,133.76722",
  "Oboke Gorge": "33.89327,133.75698",
  "Iya Valley": "33.90472,133.92436",
  "Iya Kazurabashi, Japan": "33.87513,133.83540",
  "Iya Kazurabashi": "33.87513,133.83540",
  "Iya no Shobenkozo": "33.86790,133.83780",
  "Nagoro Scarecrow Village": "33.85654,134.01941",
  "Kochi, Japan": "33.55888,133.53124",
  "Otoyo, Kochi, Japan": "33.76429,133.66433",
  "Michi-no-Eki Otoyo": "33.76429,133.66433",
  "Anpanman Museum Kami Kochi": "33.65560,133.71870",
  "Kochi Castle": "33.56081,133.53148",
  "Katsurahama": "33.49818,133.57443",
  "Susaki, Kochi, Japan": "33.40084,133.28294",
  "Susaki Kochi": "33.40084,133.28294",
  "Niyodo River": "33.53277,133.27345",
  "Tatsukushi": "32.78848,132.86744",
  "Sada Chinkabashi Shimanto": "33.01729,132.88750",
  "Shimanto, Kochi, Japan": "32.99139,132.93379",
  "Shimanto River, Japan": "33.19173,132.98024",
  "Shimanto River canoe": "33.19173,132.98024",
  "Shimanto River cycling": "33.19173,132.98024",
  "Cape Ashizuri": "32.72384,133.02032",
  "Uwajima, Ehime, Japan": "33.22357,132.56038",
  "Uwajima": "33.22357,132.56038",
  "Uwajima Castle": "33.21945,132.56528",
  "Uchiko Yokaichi": "33.53257,132.65981",
  "Garyu Sanso Ozu": "33.50631,132.55008",
  "Matsuyama, Ehime, Japan": "33.83551,132.76399",
  "Matsuyama Castle Ehime": "33.84558,132.76553",
  "Dogo Onsen, Matsuyama, Japan": "33.85207,132.78641",
  "Dogo Onsen Honkan": "33.85207,132.78641",
  "Botchan Ressha Matsuyama": "33.85058,132.78497",
  "Ishiteji Temple Matsuyama": "33.84790,132.79647",
  "Imabari, Ehime, Japan": "34.06600,132.99770",
  "Imabari Castle": "34.06339,133.00675",
  "Kirosan Observatory Park": "34.11993,133.03346",
  "Oyamazumi Shrine": "34.24792,133.00573",
  "Setoda": "34.30521,133.08625",
  "Setoda, Ikuchijima, Japan": "34.30521,133.08625",
  "Onomichi, Hiroshima, Japan": "34.40890,133.20491",
  "Onomichi Ramen": "34.40850,133.19800",
  "Senkoji Temple Onomichi": "34.41045,133.19871",
  "Onomichi Temple Walk": "34.40890,133.20491",
  "Kosanji Temple Setoda": "34.30139,133.08833",
  "Tomonoura, Japan": "34.38287,133.38120",
  "Tomonoura": "34.38287,133.38120",
  "Fukuyama Castle": "34.49114,133.36108",
  "Washuzan": "34.43555,133.81244",
  "Kurashiki, Okayama, Japan": "34.58498,133.77198",
  "Kurashiki Bikan": "34.59574,133.77177",
  "Himeji, Hyogo, Japan": "34.81542,134.68555",
  "Himeji Castle": "34.83945,134.69390",
  "Kobe, Japan": "34.68000,135.18000",
  "Kobe Harborland": "34.68007,135.18351",
  "Awaji Island, Japan": "34.32571,134.81311",
  "Akashi Kaikyo Bridge": "34.62294,135.02682",
  "Nijigen no Mori Awaji": "34.49417,134.93333",
  "Awaji Hanasajiki": "34.55355,134.97803",
  "Kyoto, Japan": "35.01156,135.76815",
  "Fushimi Inari Taisha": "34.96769,135.77919",
  "Kyoto Station": "34.98556,135.75861"
};

/* Region-matched public-domain ukiyo-e prints used as each day's hero artwork. */
window.DAYART = {
  "0": "https://upload.wikimedia.org/wikipedia/commons/b/b8/Brooklyn_Museum_-_Nihonbashi_-_Utagawa_Hiroshige_%28Ando%29_-_overall.jpg",
  "1": "https://upload.wikimedia.org/wikipedia/commons/b/b8/Brooklyn_Museum_-_Nihonbashi_-_Utagawa_Hiroshige_%28Ando%29_-_overall.jpg",
  "2": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Hokusai42_fuji-lake.jpg/1280px-Hokusai42_fuji-lake.jpg",
  "3": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Hiroshige%2C_A_family_in_a_misty_landscape.jpg/1280px-Hiroshige%2C_A_family_in_a_misty_landscape.jpg",
  "4": "https://upload.wikimedia.org/wikipedia/commons/a/a2/Falls_of_Kirifuri_at_Mt._Kurokami%2C_Shimotsuke_Province_LACMA_M.2011.135.2_%281_of_2%29.jpg",
  "5": "https://upload.wikimedia.org/wikipedia/commons/a/a2/Falls_of_Kirifuri_at_Mt._Kurokami%2C_Shimotsuke_Province_LACMA_M.2011.135.2_%281_of_2%29.jpg",
  "6": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Flickr_-_%E2%80%A6trialsanderrors_-_Hiroshige%2C_The_coast_at_Hota_in_Awa_province%2C_1858.jpg/1280px-Flickr_-_%E2%80%A6trialsanderrors_-_Hiroshige%2C_The_coast_at_Hota_in_Awa_province%2C_1858.jpg",
  "7": "https://upload.wikimedia.org/wikipedia/commons/c/ca/%27The_Great_Wave_off_Kanagawa%27_by_Hokusai%2C_Honolulu_Museum_of_Art.jpg",
  "8": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Awa%2C_Naruto_Whirlpools%2C_ca_1855.jpg/1280px-Awa%2C_Naruto_Whirlpools%2C_ca_1855.jpg",
  "9": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Brooklyn_Museum_-_Kajikazawa_in_Kai_Province_-_Katsushika_Hokusai.jpg/1280px-Brooklyn_Museum_-_Kajikazawa_in_Kai_Province_-_Katsushika_Hokusai.jpg",
  "10": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Hiroshige%2C_A_family_in_a_misty_landscape.jpg/1280px-Hiroshige%2C_A_family_in_a_misty_landscape.jpg",
  "11": "https://upload.wikimedia.org/wikipedia/commons/7/7e/58_Tosa.jpg",
  "12": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Brooklyn_Museum_-_Kajikazawa_in_Kai_Province_-_Katsushika_Hokusai.jpg/1280px-Brooklyn_Museum_-_Kajikazawa_in_Kai_Province_-_Katsushika_Hokusai.jpg",
  "13": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Brooklyn_Museum_-_Kajikazawa_in_Kai_Province_-_Katsushika_Hokusai.jpg/1280px-Brooklyn_Museum_-_Kajikazawa_in_Kai_Province_-_Katsushika_Hokusai.jpg",
  "14": "https://upload.wikimedia.org/wikipedia/commons/5/5c/Hiroshige_Iyo_Saij%C5%8D.jpg",
  "15": "https://upload.wikimedia.org/wikipedia/commons/5/5c/Hiroshige_Iyo_Saij%C5%8D.jpg",
  "16": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Brooklyn_Museum_-_Itsukushima_in_Aki_Province_-_Utagawa_Hiroshige_%28Ando%29.jpg/1280px-Brooklyn_Museum_-_Itsukushima_in_Aki_Province_-_Utagawa_Hiroshige_%28Ando%29.jpg",
  "17": "https://upload.wikimedia.org/wikipedia/commons/f/fc/Bingo_Province%2C_Abuto%2C_Kannon_Temple_%285765891938%29.jpg",
  "18": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Bizen_Province%2C_Tanokuchi_Coast%2C_Yugasan_torii_%285765891374%29.jpg/1280px-Bizen_Province%2C_Tanokuchi_Coast%2C_Yugasan_torii_%285765891374%29.jpg",
  "19": "https://upload.wikimedia.org/wikipedia/commons/a/ad/45_-_Harima_Province%2C_Maiko_Beach%2C_from_the_series_Famous_Places_in_the_Sixty-odd_Provinces%2C_MFAB_11.26243.jpg",
  "20": "https://upload.wikimedia.org/wikipedia/commons/c/ce/05_Settsu_n.jpg",
  "21": "https://upload.wikimedia.org/wikipedia/commons/c/ce/05_Settsu_n.jpg",
  "22": "https://upload.wikimedia.org/wikipedia/commons/c/ce/05_Settsu_n.jpg",
  "23": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Hiroshige-53-Stations-Hoeido-55-Kyoto-MFA-01.jpg/1280px-Hiroshige-53-Stations-Hoeido-55-Kyoto-MFA-01.jpg",
  "24": "https://upload.wikimedia.org/wikipedia/commons/b/b8/Brooklyn_Museum_-_Nihonbashi_-_Utagawa_Hiroshige_%28Ando%29_-_overall.jpg"
};
