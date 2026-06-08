/* ============================================================
   PNW Family "First Tour" — destination data
   Generated from tour/ markdown by gen_data.py (website-builder).
   Shared by index.html, place.html and day.html.
   A 7-day round-trip ride: Woodinville → the Oregon coast (Yachats)
   → home over Mount St. Helens & Mount Rainier. Built around a
   brand-new rider (Galiya, Kawasaki W230) — no freeways.
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

/* Hotel prices are already in USD (e.g. "$189–329"). This helper is kept as a no-op
   passthrough so the templates can call it without a second currency conversion. */
window.priceUSD = function (p) { return ""; };

/* Representative photos by lodging type (verified Wikimedia Commons).
   These illustrate the STYLE of stay, not the exact property. */
window.HOTEL_IMG = {
  room:   U+"e/e8/Comfort_Twin_Room_in_Triple_Configuration_%2821917602991%29.jpg/960px-Comfort_Twin_Room_in_Triple_Configuration_%2821917602991%29.jpg",
  design: U+"e/e3/Modern_bedroom_design_in_a_stylish_hotel_room_featuring_geometric_patterns_and_soft_linens.jpg/960px-Modern_bedroom_design_in_a_stylish_hotel_room_featuring_geometric_patterns_and_soft_linens.jpg"
};
/* Pick a representative image from a hotel's `t` (type) label. Returns null for non-bookable "Note" rows. */
window.hotelImage = function (t) {
  const s = (t || "").toLowerCase();
  if (s.includes("note")) return null;
  if (s.includes("resort") || s.includes("oceanfront") || s.includes("spa") || s.includes("boutique") || s.includes("nice hotel"))
    return window.HOTEL_IMG.design;
  return window.HOTEL_IMG.room; // lodge, inn, motel, cabin, B&B — practical, family-friendly
};
/* Build a reliable search/booking link for a property name. */
window.hotelLink = function (name, place) {
  return "https://www.google.com/search?q=" + encodeURIComponent(name + " " + (place || "") + " hotel");
};
/* Expected motorcycle-parking situation by lodging type. Every suggestion is
   selected to accommodate bikes; the exact spot must still be confirmed on booking. */
window.hotelParking = function (t) {
  const s = (t || "").toLowerCase();
  if (s.includes("note")) return null;
  if (s.includes("motel") || s.includes("lodge") || s.includes("cabin") || s.includes("inn"))
    return "Free on-site lot";
  return "On-site parking"; // resort, hotel, boutique
};

window.DESTINATIONS = [
{
  id: "home",
  name: "Home — Woodinville",
  jp: "",
  region: "Greater Seattle · King County, WA",
  type: "start",
  days: "Day 1 (depart) · Day 7 (return)",
  legMiles: 0,
  lat: 47.7553, lng: -122.13389, zoom: 10,
  tagline: "Where the ride begins and ends: turn the key, point the bikes west, and let the everyday fall away behind you.",
  intro: [
    "Woodinville sits in Seattle's leafy northeast suburbs, a tidy pocket of wine-country calm tucked along the Sammamish River — more tasting rooms and trailheads than traffic lights. It's the kind of place where a week-long trip can begin quietly in the driveway: panniers packed the night before, <b>Galiya's Kawasaki W230</b> and <b>Ruslan's BMW R1300GS</b> warmed up, and <b>Aslan</b> already buzzing about which souvenirs he'll bring home. This is the start line, not a stop — but it sets the tone for everything that follows.",
    "Day 1 deliberately dodges the city. Instead of grinding south through Seattle, the family rides north and west to <b>Edmonds</b>, rolls the bikes onto the <b>Edmonds–Kingston ferry</b>, and lets Puget Sound do the first leg of the work. By the time the boat lands on the Kitsap Peninsula, the workweek is behind them and the gentle <b>Hood Canal</b> shoreline is dead ahead — an easy, confidence-building opener for a brand-new rider. Seven days later they'll come home the dramatic way, over <b>Chinook Pass</b>, with the mountains as a victory lap."
  ],
  highlights: [
    "<b>The gear-up and shakedown</b> — The ritual that makes a tour: load the panniers, pair the intercoms, check tire pressures and chain, and top off the W230's small tank so the first fuel stop is never a worry.",
    "<b>The first turn of the key</b> — The symbolic start. Two bikes in the driveway, the GS carrying Aslan as pillion, and Galiya leading at her own pace away from the freeways.",
    "<b>The ride to Edmonds</b> — A short, mellow run northwest from Woodinville to the Edmonds waterfront, easing into the day before the bikes ever leave the road.",
    "<b>The Edmonds–Kingston ferry</b> — Roll the motorcycles aboard, kill the engines, and cross Puget Sound with the Olympics on the horizon — the relaxing overture to the whole trip and a built-in skip around Seattle traffic.",
    "<b>Hood Canal preview</b> — Off the boat on the Kitsap side, the route bends down to the quiet Hood Canal shoreline: low speeds, big water views, the perfect first hour for a new endorsement.",
    "<b>Woodinville wine country</b> — The home base itself, with tasting rooms and the Sammamish River Trail threading through town — a pretty reminder of what you're temporarily leaving behind.",
    "<b>Homecoming over Chinook Pass</b> — Day 7 returns from the mountains over the high, scenic Chinook Pass (SR 410), trading saltwater for alpine switchbacks as the finish line.",
    "<b>A kid hook for Aslan</b> — The ferry deck is its own adventure for a six-year-old: standing on a real boat, watching gulls and other ferries, and counting down to the first souvenir of the trip."
  ],
  food: [
    {
      "n": "Coffee before kickstands (Woodinville)",
      "d": "Grab a strong morning coffee in town — the area is thick with espresso stands and cafés — so the riders are sharp for the run to the ferry."
    },
    {
      "n": "The Commons / downtown Edmonds breakfast",
      "d": "Walkable downtown Edmonds, a few blocks up from the dock, has bakeries and breakfast spots for a proper sit-down before boarding."
    },
    {
      "n": "Edmonds waterfront bite",
      "d": "While queued for the ferry, the waterfront has fish-and-chips and casual seafood within steps of the terminal — an easy hand-held meal with a Sound view."
    },
    {
      "n": "Homecoming dinner",
      "d": "Day 7, the best meal is the one you don't have to ride to: your own kitchen (or a favorite Woodinville table) to toast a finished first tour."
    }
  ],
  hotels: [
    {
      "n": "No overnight here",
      "t": "Note",
      "d": "There's no overnight here — this is home, the start and the finish. The family sleeps in their own beds the night before, wakes to a packed garage and a short ride to the ferry, and rolls out fresh. Seven days later they ride back over Chinook Pass to the same driveway, unload the panniers, and fall into their own beds again — the trip ending exactly where it began."
    }
  ],
  links: [
    { "l": "Woodinville, WA (Wikipedia)", "u": "https://en.wikipedia.org/wiki/Woodinville,_Washington" },
    {
      "l": "Washington State Ferries — schedules",
      "u": "https://wsdot.wa.gov/travel/washington-state-ferries/schedules"
    },
    { "l": "Visit Edmonds (tourism)", "u": "https://www.visitedmonds.com/" },
    { "l": "Woodinville Wine Country", "u": "https://www.woodinvillewinecountry.com/" },
    { "l": "Edmonds, WA (Wikipedia)", "u": "https://en.wikipedia.org/wiki/Edmonds,_Washington" }
  ],
  photos: [
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Edmonds_Ferry_from_Edmonds_Beach_-_Edmonds_Washington.jpg/960px-Edmonds_Ferry_from_Edmonds_Beach_-_Edmonds_Washington.jpg",
      "cap": "A ferry inbound off Edmonds Beach, the start of Day 1."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Washington_State_Ferry_MV_Spokane_at_the_Edmonds_Ferry_Terminal_01.jpg/960px-Washington_State_Ferry_MV_Spokane_at_the_Edmonds_Ferry_Terminal_01.jpg",
      "cap": "A Washington State Ferry docked at Edmonds, where the bikes roll aboard."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Edmonds_Ferry%2C_Olympic_Mountains.jpg/960px-Edmonds_Ferry%2C_Olympic_Mountains.jpg",
      "cap": "The Olympics on the horizon across Puget Sound from Edmonds."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/MV_Puyallup_at_Edmonds_Ferry_Terminal_from_Brackett%27s_Landing_South.jpg/960px-MV_Puyallup_at_Edmonds_Ferry_Terminal_from_Brackett%27s_Landing_South.jpg",
      "cap": "The Edmonds terminal seen from the waterfront, ferry queued and ready."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Kingston%2C_Washington_ferry_dock_02.jpg/960px-Kingston%2C_Washington_ferry_dock_02.jpg",
      "cap": "The Kingston dock, where the ride lands on the Kitsap side."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Ferry_arriving_at_Kingston.jpg/960px-Ferry_arriving_at_Kingston.jpg",
      "cap": "A ferry pulling into Kingston, gateway to the Hood Canal route."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Hood_Canal_Bridge.jpg/960px-Hood_Canal_Bridge.jpg",
      "cap": "The Hood Canal Bridge, a landmark on the gentle shoreline run ahead."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Hood_Canal_Overlook_5869.jpg/960px-Hood_Canal_Overlook_5869.jpg",
      "cap": "The calm Hood Canal water — Day 1's easy, scenic opener."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Woodinville_WA_-_Sammamish_River_Trail.jpg/960px-Woodinville_WA_-_Sammamish_River_Trail.jpg",
      "cap": "Home base: the Sammamish River Trail winding through Woodinville."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Chinook_Pass_panorama_7538.jpg/960px-Chinook_Pass_panorama_7538.jpg",
      "cap": "Chinook Pass, the high alpine route home on Day 7."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Chinook_Pass_%289575660218%29.jpg/960px-Chinook_Pass_%289575660218%29.jpg",
      "cap": "Switchbacks and peaks of Chinook Pass — the trip's victory-lap finish."
    }
  ]
},
{
  id: "westport",
  name: "Westport",
  jp: "",
  region: "Washington Coast · Grays Harbor County",
  type: "stop",
  days: "Day 1 · 1 night (Wed Jul 1)",
  legMiles: 157,
  lat: 46.89009, lng: -124.10406, zoom: 12,
  tagline: "A salty fishing-and-surf town on Grays Harbor's south jetty — the family's first night on tour, and their first taste of the Pacific.",
  intro: [
    "Day 1 is built for confidence, not mileage records. From Woodinville the family rolls down to <b>Edmonds</b> and rides the bikes straight onto the <b>Edmonds–Kingston ferry</b> — a relaxed half-hour crossing of Puget Sound that doubles as Galiya's first ferry on two wheels. From Kingston the route stays on quiet backroads and skirts the calm, fjord-like shore of <b>Hood Canal on Highway 106</b>, a low-traffic, easy-cornering road with water on one side and forest on the other. After Shelton the country opens up and the air turns salty as the route reaches the coast and the working harbor town of <b>Westport</b>.",
    "Westport sits on a sandy spit guarding the south side of <b>Grays Harbor</b>, and it wears two hats: it's one of Washington's busiest <b>sport-fishing and charter ports</b>, and it's the most reliable <b>surf town</b> on the state's coast. For a brand-new rider it's an ideal first night — flat approaches, an easy grid of streets, no pressure — and for the family it delivers the big payoff of standing at the Pacific on the very first evening. Expect <b>boats, sea lions, fresh seafood, a tall lighthouse, and a huge open beach</b> all within a few blocks of each other."
  ],
  highlights: [
    "<b>Westport Light / Grays Harbor Lighthouse</b> — at 107 ft, the <b>tallest lighthouse in Washington</b> (and third-tallest on the West Coast); built in 1898, it's reached by a short trail from Westport Light State Park and is the town's landmark photo stop",
    "<b>Westhaven State Park & the surf</b> — Washington's go-to surf beach on the south jetty; watch surfers and <b>kitesurfers</b> ride the break, walk the dunes, and let everyone touch the Pacific on arrival evening",
    "<b>Westport Maritime Museum</b> — housed in a 1939 Nantucket-style former Coast Guard station; lighthouse lenses, whale and sea-life skeletons, and fishing-history exhibits make an easy, low-key stop",
    "<b>Westport Aquarium</b> — a small, hands-on local aquarium right by the docks with touch tanks and resident sea creatures; a perfect quick hook for a tired 6-year-old",
    "<b>The marina, docks & fishing fleet</b> — wander the working waterfront, watch charter boats unload salmon, tuna, and crab, and look for the <b>sea lions</b> that haul out near the basin",
    "<b>Westport Viewing Tower (Observation Tower)</b> — climb the tall waterfront tower for a sweeping look over the harbor, the jetty, and the boats coming and going",
    "<b>The South Jetty & long beach</b> — walk out toward the jetty and along the wide, hard-packed sand; great for driftwood-hunting, beach-combing, and brown-pelican spotting",
    "<b>Float Park & Fishermen's Memorial</b> — a quiet harborside spot honoring the town's fishing heritage, good for stretching legs after the ride",
    "<b>Fresh-off-the-boat seafood</b> — Westport calls itself a salmon capital, and the dockside markets and chowder counters are a destination in themselves for Galiya the foodie <b>[FOOD]</b>"
  ],
  food: [
    {
      "n": "Bennett's Fish Shack",
      "d": "a Westport institution for beer-battered fish & chips, clam chowder, and a kid-friendly menu, steps from the harbor [FOOD]"
    },
    {
      "n": "Half Moon Bay Bar & Grill (at the Inn Resort) — waterfront views with fresh local seafood, burgers, and easy options for Aslan",
      "d": ""
    },
    {
      "n": "Merino's Seafood Market",
      "d": "buy fresh and cooked Dungeness crab, oysters, and smoked fish right off the dock; great for a casual picnic dinner by the water [FOOD]"
    },
    {
      "n": "Westport Winery Garden Resort & Sea Glass Grill",
      "d": "just outside town; smoked-salmon chowder, garden art, and dessert wines for a foodie detour [FOOD]"
    },
    {
      "n": "Aloha Alabama BBQ & Bakery",
      "d": "a beloved local spot mixing barbecue and from-scratch baking; reliable comfort food and treats for a hungry kid"
    },
    {
      "n": "Blue Buoy Restaurant",
      "d": "a long-running diner-style breakfast spot for hearty eggs, pancakes, and coffee before Day 2's ride [FOOD]"
    }
  ],
  hotels: [
    {
      "n": "Chateau Westport Beach Resort",
      "t": "Resort",
      "d": "Confirm secure motorcycle parking + family/passenger rules before booking. Indoor pool and beach access — a kid-pleasing first night.",
      "park": "Free on-site lot",
      "price": "$150–250"
    },
    {
      "n": "The Inn Resort & Suites (Half Moon Bay)",
      "t": "Inn / Resort",
      "d": "Confirm secure motorcycle parking + family/passenger rules before booking. Waterfront location with on-site grill.",
      "park": "Free on-site lot",
      "price": "$140–230"
    },
    {
      "n": "Albatross Motel",
      "t": "Motel",
      "d": "Confirm secure motorcycle parking + family/passenger rules before booking. Simple, central, walkable to the marina and eats.",
      "park": "Free on-site lot",
      "price": "$110–170"
    },
    {
      "n": "Glenacres Historic Inn",
      "t": "B&B / Inn",
      "d": "Confirm secure motorcycle parking + family/passenger rules before booking. 1898 inn with cottages; family rooms available.",
      "park": "Free on-site lot",
      "price": "$130–220"
    },
    {
      "n": "Breakers Boutique Inn",
      "t": "Inn",
      "d": "Confirm secure motorcycle parking + family/passenger rules before booking. Near the beach trail and lighthouse.",
      "park": "Free on-site lot",
      "price": "$130–210"
    }
  ],
  links: [
    { "l": "Westport-Grayland Chamber of Commerce", "u": "https://www.westportgrayland-chamber.org/" },
    {
      "l": "Westport Light State Park (Washington State Parks)",
      "u": "https://www.parks.wa.gov/find-parks/state-parks/westport-light-state-park"
    },
    { "l": "Wikipedia — Westport Light State Park", "u": "https://en.wikipedia.org/wiki/Westport_Light_State_Park" },
    { "l": "Wikipedia — Grays Harbor Light", "u": "https://en.wikipedia.org/wiki/Grays_Harbor_Light" },
    { "l": "Wikipedia — Westport, Washington", "u": "https://en.wikipedia.org/wiki/Westport,_Washington" },
    { "l": "Wikipedia — Grays Harbor", "u": "https://en.wikipedia.org/wiki/Grays_Harbor" }
  ],
  photos: [
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Grays_Harbor_%28Westport%29_Lighthouse_01.jpg/960px-Grays_Harbor_%28Westport%29_Lighthouse_01.jpg",
      "cap": "Westport Light, the tallest lighthouse in Washington"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/2023-05-27%2C_Grays_Harbor_Lighthouse%2C_001.jpg/960px-2023-05-27%2C_Grays_Harbor_Lighthouse%2C_001.jpg",
      "cap": "The 1898 lighthouse rising above the dunes"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Boat_entering_harbor_at_Westport%2C_WA.jpg/960px-Boat_entering_harbor_at_Westport%2C_WA.jpg",
      "cap": "A boat entering the harbor at Westport"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Westport%2C_WA_-_fishing_boat_%27Patriot%27.jpg/960px-Westport%2C_WA_-_fishing_boat_%27Patriot%27.jpg",
      "cap": "A fishing boat in Westport's working marina"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/Westport%2C_WA_-_beach_scene.jpg/960px-Westport%2C_WA_-_beach_scene.jpg",
      "cap": "The wide Pacific beach at Westport"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/View_from_atop_the_ridge_at_Westhaven_State_Park_-_panoramio.jpg/960px-View_from_atop_the_ridge_at_Westhaven_State_Park_-_panoramio.jpg",
      "cap": "Looking out over Westhaven State Park"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Westport%2C_WA_-_kitesurfing_01.jpg/960px-Westport%2C_WA_-_kitesurfing_01.jpg",
      "cap": "Kitesurfing off the Westport surf break"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Observation_Twr_3927.jpg/960px-Observation_Twr_3927.jpg",
      "cap": "The waterfront viewing tower over the harbor"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Brown_Pelicans_in_flight%2C_Westport%2C_WA_02.jpg/960px-Brown_Pelicans_in_flight%2C_Westport%2C_WA_02.jpg",
      "cap": "Brown pelicans in flight off Westport"
    }
  ]
},
{
  id: "astoria",
  name: "Astoria",
  jp: "",
  region: "Oregon Coast · Clatsop County",
  type: "stop",
  days: "Day 2 · stop en route to Cannon Beach (Thu Jul 2)",
  legMiles: 99,
  lat: 46.18788, lng: -123.83125, zoom: 12,
  tagline: "The oldest American settlement west of the Rockies, a salty Victorian riverport where the Columbia meets the Pacific — and where the Goonies once chased pirate gold.",
  intro: [
    "Astoria sits where the mighty Columbia River pours into the Pacific, ringed by green headlands and crowned with steep streets of <b>Victorian houses</b> that tumble down to a working waterfront. Founded in 1811 as John Jacob Astor's fur-trading post, it is the <b>oldest American settlement west of the Rockies</b>, and that long history shows everywhere — in the maritime museum, the grand sea-captain mansions, and the fishing boats and sea lions that still crowd the docks. After the short, easy Day-2 ride over the dramatic <b>Astoria–Megler Bridge</b>, this is a town made for wandering on tired legs.",
    "For this family it hits every note at once. Galiya gets art galleries, historic homes, and one of the best small-city food-and-beer scenes on the coast; Ruslan gets big-river history and a genuinely great museum; and Aslan gets the <b>Goonies house</b>, balsa-glider launches from the Astoria Column, barking sea lions, and a rattling old trolley. It is a relaxed, rewarding second night before the trip pushes on."
  ],
  highlights: [
    "<b>Astoria Column</b> — Climb the 164-step spiral to the top of this hilltop tower for a 360° view of the river, bridge, and Coast Range; buy a <b>balsa-wood glider</b> at the gift shop and launch it off the summit (<b>a guaranteed Aslan win</b>).",
    "<b>Columbia River Maritime Museum</b> — One of the finest maritime museums in the country: a Coast Guard lifeboat frozen mid-rescue on a wave, shipwreck stories of the \"Graveyard of the Pacific,\" and the lightship <i>Columbia</i> moored outside (<b>big hands-on hook for Aslan; deep history for Ruslan</b>).",
    "<b>The Goonies house & filming locations</b> — The hillside Goonies home plus the nearby Flavel House and old jail (the County Historical Society's \"Oregon Film Museum\" sits in the original jail) — catnip for a six-year-old who loves the movie (<b>Aslan/movie hook</b>).",
    "<b>Astoria Riverfront Trolley</b> — Ride \"Old 300,\" a restored 1913 streetcar, along the waterfront past canneries, breweries, and the docks; cheap, slow, and fun for kids.",
    "<b>Sea lions on the East Mooring Basin docks</b> — Hundreds of California sea lions haul out and bark, jostle, and flop on the floating docks near the east end of town (<b>kid + wildlife favorite — bring your nose</b>).",
    "<b>Astoria–Megler Bridge</b> — The 4-mile continuous-truss bridge you cross to arrive; walk or drive the waterfront for photos of its soaring green spans over the river.",
    "<b>Captain George Flavel House Museum</b> — A perfectly preserved 1885 Queen Anne mansion built by a river-bar pilot, full of period rooms and a cupola once used to watch for ships (<b>art/history for Galiya</b>).",
    "<b>Fort Clatsop · Lewis & Clark National Historical Park</b> — A few miles south, the reconstructed log fort where the Corps of Discovery wintered in 1805–06, with costumed rangers and forest trails (<b>history + a stretch-your-legs walk</b>)."
  ],
  food: [
    {
      "n": "Buoy Beer Company",
      "d": "Brewpub built on a former cannery pier with a glass floor panel over the river where sea lions sometimes lounge underneath; chowder, fish, burgers, and house lagers right on the water."
    },
    {
      "n": "Fort George Brewery",
      "d": "Astoria's beloved brewery in a historic block; pizza, pub plates, and well-loved beers, with a relaxed family-friendly upstairs."
    },
    {
      "n": "Bowpicker Fish & Chips",
      "d": "Legendary albacore tuna fish-and-chips served from a converted gillnet boat parked downtown; cash-only, lines out the door, worth it (simple, kid-friendly, iconic)."
    },
    {
      "n": "South Bay Wild Fish House",
      "d": "Boat-to-table fresh seafood from a local fishing family; chowder, rockfish, and the catch of the day for the foodie in the group."
    },
    {
      "n": "Blue Scorcher Bakery & Café",
      "d": "Worker-owned bakery for morning pastries, hearth bread, and good coffee — an easy, mellow breakfast stop before the day's ride."
    },
    {
      "n": "Astoria Coff/Coffee Girl",
      "d": "Riverfront espresso on Pier 39 by the old cannery; a quick caffeine fix with a view of the bridge and the boats."
    }
  ],
  hotels: [
    {
      "n": "Cannery Pier Hotel & Spa",
      "t": "Nice hotel",
      "d": "Luxe rooms on stilts over the Columbia with bridge views; confirm secure motorcycle parking + family/passenger rules before booking.",
      "park": "On-site lot, pier setting",
      "price": "$300–$450"
    },
    {
      "n": "Bowline Hotel",
      "t": "Boutique",
      "d": "Stylish waterfront cannery conversion with restaurant/bar; confirm secure motorcycle parking + family/passenger rules before booking.",
      "park": "On-site lot",
      "price": "$220–$340"
    },
    {
      "n": "Commodore Hotel Astoria",
      "t": "Boutique",
      "d": "Hip, compact downtown rooms steps from cafés; confirm secure motorcycle parking + family/passenger rules before booking.",
      "park": "Street/nearby lot",
      "price": "$130–$220"
    },
    {
      "n": "Norblad Hotel",
      "t": "Inn",
      "d": "Budget-friendly historic downtown rooms (some shared bath); confirm secure motorcycle parking + family/passenger rules before booking.",
      "park": "Street parking",
      "price": "$110–$180"
    },
    {
      "n": "Holiday Inn Express Astoria",
      "t": "Nice hotel",
      "d": "Reliable riverfront chain with pool and breakfast, good for families; confirm secure motorcycle parking + family/passenger rules before booking.",
      "park": "On-site lot",
      "price": "$180–$280"
    }
  ],
  links: [
    { "l": "Travel Astoria–Warrenton (official tourism)", "u": "https://www.travelastoria.com/" },
    { "l": "Columbia River Maritime Museum", "u": "https://www.crmm.org/" },
    { "l": "Astoria Column", "u": "https://astoriacolumn.org/" },
    { "l": "Lewis & Clark National Historical Park (NPS)", "u": "https://www.nps.gov/lewi/index.htm" },
    { "l": "Wikipedia: Astoria, Oregon", "u": "https://en.wikipedia.org/wiki/Astoria,_Oregon" },
    { "l": "Travel Oregon: Astoria", "u": "https://traveloregon.com/places-to-go/cities/astoria/" }
  ],
  photos: [
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Astoria_Column%2C_angled.jpg/960px-Astoria_Column%2C_angled.jpg",
      "cap": "The Astoria Column, with 360° river views and balsa-glider launches at the top."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Astoria-Megler_Bridge_from_West_Mooring_Basin_Docks.jpg/960px-Astoria-Megler_Bridge_from_West_Mooring_Basin_Docks.jpg",
      "cap": "The 4-mile Astoria–Megler Bridge over the mouth of the Columbia, the gateway into town."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Astoria-Megler_Bridge_with_Astoria_Column_in_foreground.jpg/960px-Astoria-Megler_Bridge_with_Astoria_Column_in_foreground.jpg",
      "cap": "The bridge and the hilltop column together, framing the riverport."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Astoria_Riverfront_Trolley%2C_2006.jpg/960px-Astoria_Riverfront_Trolley%2C_2006.jpg",
      "cap": "\"Old 300,\" the restored 1913 streetcar that runs along the waterfront."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Columbia_River_Maritime_Museum_exterior_in_2012.jpg/960px-Columbia_River_Maritime_Museum_exterior_in_2012.jpg",
      "cap": "The Columbia River Maritime Museum on the riverfront, a top family stop."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Downtown_Astoria_-_Commercial_St_with_former_Hotel_Astoria.jpg/960px-Downtown_Astoria_-_Commercial_St_with_former_Hotel_Astoria.jpg",
      "cap": "Historic downtown Astoria along Commercial Street."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Sea_lions_%28Astoria%2C_Oregon%29.jpg/960px-Sea_lions_%28Astoria%2C_Oregon%29.jpg",
      "cap": "Barking sea lions crowd the mooring-basin docks — a wildlife favorite for kids."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Flavel_House_in_Astoria%2C_Oregon.JPG/960px-Flavel_House_in_Astoria%2C_Oregon.JPG",
      "cap": "The 1885 Flavel House, one of Astoria's grand sea-captain Victorians."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Fort_Clatsop_replica_2007.jpg/960px-Fort_Clatsop_replica_2007.jpg",
      "cap": "Fort Clatsop, the reconstructed Lewis & Clark winter encampment just south of town."
    }
  ]
},
{
  id: "cannon-beach",
  name: "Cannon Beach",
  jp: "",
  region: "Oregon Coast · Clatsop County",
  type: "stop",
  days: "Day 2 · 1 night (Thu Jul 2)",
  legMiles: 125,
  lat: 45.89177, lng: -123.96153, zoom: 12,
  tagline: "The picture-perfect Oregon Coast town where a 235-foot sea stack, tide pools full of starfish, and a wide flat beach make the ideal first-tour overnight.",
  intro: [
    "Cannon Beach is the postcard of the Oregon Coast: a long, flat, walkable expanse of sand framed by <b>Haystack Rock</b>, one of the most photographed sea stacks in the world. After crossing the soaring <b>Astoria–Megler Bridge</b> and pausing in Astoria, the family rolls south on US-101 and Hwy-26 to drop down into this little resort town for the night. It is an easy, gentle arrival after a long day — park the bikes, walk straight onto the beach, and let the Pacific do the rest.",
    "The town itself is tiny and very family-friendly: a few blocks of art galleries, candy stores, toy shops, bakeries, and seafood spots, all within strolling distance of the sand. <b>Aslan</b> can splash in the tide pools and hunt for puffins on the rock; <b>Galiya</b> gets fresh chowder, seafood, and the legendary local bakery; and <b>Ruslan</b> gets one of the most scenic stretches of coastline in the country. It is a pricey, popular town that fills up fast — especially over the July 4 weekend — so book early."
  ],
  highlights: [
    "<b>Haystack Rock</b> — the 235-ft sea stack rising straight off the beach is the town's icon; at low tide you can walk right up to its base. (scenic + kid)",
    "<b>Tide pools at Haystack Rock</b> — orange and purple sea stars, anemones, hermit crabs, and chitons cling to the protected base rocks at low tide; check the tide table and go at a minus tide. (kid favorite)",
    "<b>Tufted puffins</b> — Haystack Rock is one of the easiest places in Oregon to spot nesting puffins (and murres) in early summer; bring binoculars and look up. (kid + scenic)",
    "<b>Ecola State Park</b> — just north of town, the cliff-top viewpoints over Crescent Beach and Haystack Rock are the classic Oregon Coast postcard; it also doubled as a Goonies filming location. (scenic)",
    "<b>The beach itself</b> — miles of hard, flat sand perfect for a barefoot evening walk, sandcastles, and kite-flying with Aslan. (kid + scenic)",
    "<b>Downtown galleries & sweet shops</b> — a compact, walkable grid of art galleries, candy stores, ice-cream, and boutiques along Hemlock Street. (foodie + kid)",
    "<b>Bruce's Candy Kitchen & a toy stop</b> — saltwater taffy made on-site plus nearby toy and kite shops keep a 6-year-old happy. (kid)",
    "<b>Hug Point State Recreation Site</b> — a short drive south: a hidden beach with sea caves, a small waterfall, and a historic wagon road carved into the cliff, accessible at low tide. (scenic + kid)",
    "<b>Sunset on the sand</b> — the west-facing beach delivers a glowing silhouette of Haystack Rock as the sun drops into the Pacific. (scenic + foodie evening)"
  ],
  food: [
    {
      "n": "Clam chowder",
      "d": "Cannon Beach is chowder country; grab a steaming bowl at a beachfront spot like Mo's or Wayfarer. (foodie)"
    },
    {
      "n": "Public Coast Brewing / Pelican Brewing",
      "d": "local craft beer with burgers, fish tacos, and a family-friendly room; Pelican's brewpub sits right on the sand. (foodie)"
    },
    {
      "n": "Fresh Dungeness crab & seafood",
      "d": "order the local crab, fish & chips, or grilled catch of the day at Wayfarer Restaurant or Newmans at 988. (foodie)"
    },
    {
      "n": "Cannon Beach Bakery / Sea Level Bakery",
      "d": "the town's famous bakeries for morning pastries, fresh bread, and a \"Haystack\" loaf. (foodie + kid)"
    },
    { "n": "Bruce's Candy Kitchen", "d": "house-made saltwater taffy and fudge, an easy treat for Aslan. (kid)" },
    {
      "n": "Pizza or ice cream night",
      "d": "for a simple, no-fuss kid dinner, the local pizzeria and ice-cream counters downtown are an easy win. (kid)"
    }
  ],
  hotels: [
    {
      "n": "Surfsand Resort",
      "t": "Resort",
      "d": "Confirm secure motorcycle parking + family/passenger rules before booking; right on the sand at Haystack Rock, pricey, books up far ahead for the July 4 weekend.",
      "park": "On-site lot, beachfront",
      "price": "$400–$650"
    },
    {
      "n": "Stephanie Inn",
      "t": "Nice hotel",
      "d": "Confirm secure motorcycle parking + family/passenger rules before booking; upscale and adults-leaning (check minimum age), a splurge oceanfront option.",
      "park": "On-site valet/lot",
      "price": "$550–$900"
    },
    {
      "n": "Hallmark Resort",
      "t": "Resort",
      "d": "Confirm secure motorcycle parking + family/passenger rules before booking; family-friendly oceanfront with pool, fills fast over the holiday weekend.",
      "park": "On-site lot",
      "price": "$300–$550"
    },
    {
      "n": "Tolovana Inn",
      "t": "Inn",
      "d": "Confirm secure motorcycle parking + family/passenger rules before booking; quieter Tolovana Park end of the beach, good-value family units.",
      "park": "On-site lot",
      "price": "$200–$400"
    },
    {
      "n": "Inn at Cannon Beach",
      "t": "Inn",
      "d": "Confirm secure motorcycle parking + family/passenger rules before booking; cottage-style rooms a short walk from the beach, pet- and family-friendly.",
      "park": "On-site lot",
      "price": "$200–$350"
    }
  ],
  links: [
    { "l": "Visit Cannon Beach (official)", "u": "https://www.cannonbeach.org/" },
    { "l": "Cannon Beach Chamber of Commerce", "u": "https://www.cannonbeach.org/chamber" },
    {
      "l": "Ecola State Park (Oregon State Parks)",
      "u": "https://stateparks.oregon.gov/index.cfm?do=park.profile&parkId=136"
    },
    { "l": "Haystack Rock Awareness Program", "u": "https://www.haystackrock.org/" },
    { "l": "Cannon Beach, Oregon (Wikipedia)", "u": "https://en.wikipedia.org/wiki/Cannon_Beach,_Oregon" }
  ],
  photos: [
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Haystack_Rock%2C_Cannon_Beach%2C_Oregon%2C_USA%2C_14_Aug_2025.jpg/960px-Haystack_Rock%2C_Cannon_Beach%2C_Oregon%2C_USA%2C_14_Aug_2025.jpg",
      "cap": "The 235-ft Haystack Rock, the town's icon, rising straight off the sand."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Cannon_Beach_October_2019_panorama_2.jpg/960px-Cannon_Beach_October_2019_panorama_2.jpg",
      "cap": "The wide, flat beach stretching toward Haystack Rock."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Haystack_Rock_and_Cannon_Beach_from_Ecola_State_Park_01.jpg/960px-Haystack_Rock_and_Cannon_Beach_from_Ecola_State_Park_01.jpg",
      "cap": "The postcard view of Cannon Beach and Haystack Rock from Ecola State Park."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Oregon_coastline_looking_south_from_Ecola_State_Park.jpg/960px-Oregon_coastline_looking_south_from_Ecola_State_Park.jpg",
      "cap": "Cliff-top view south along the coast from Ecola State Park."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Haystack_Rock_Tidepools%2C_Cannon_Beach.jpg/960px-Haystack_Rock_Tidepools%2C_Cannon_Beach.jpg",
      "cap": "Tide pools at the base of Haystack Rock, full of sea stars and anemones at low tide."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Sunset_at_Cannon_Beach_in_Oregon_1.jpg/960px-Sunset_at_Cannon_Beach_in_Oregon_1.jpg",
      "cap": "Sunset silhouetting Haystack Rock from the beach."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Cannon_Beach%2C_Oregon_%28looking_northwest%29.jpg/960px-Cannon_Beach%2C_Oregon_%28looking_northwest%29.jpg",
      "cap": "The beach and town looking northwest along the shore."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Cannon_Beach_-_Oregon_Coast_%282368969955%29.jpg/960px-Cannon_Beach_-_Oregon_Coast_%282368969955%29.jpg",
      "cap": "Haystack Rock and the wet, reflective sand of Cannon Beach."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/b/b4/Ecola_State_Park_Oregon_2017_1.jpg",
      "cap": "Forested headlands and surf at Ecola State Park, just north of town."
    }
  ]
},
{
  id: "tillamook",
  name: "Tillamook",
  jp: "",
  region: "Oregon Coast · Tillamook County",
  type: "stop",
  days: "Day 3 · midday stop (Fri Jul 3, en route to Yachats)",
  legMiles: 45,
  lat: 45.4565, lng: -123.8437, zoom: 11,
  tagline: "The cheese-and-ice-cream heart of the Oregon Coast — a green dairy valley with a giant blimp hangar full of aircraft and a scenic loop of dramatic capes.",
  intro: [
    "Tillamook is the lush, cow-dotted dairy valley that gives Oregon its most famous <b>cheese and ice cream</b>, and on this trip it is the marquee midday stop — a tasty, kid-joyful break that anchors the long Day-3 ride down the coast to Yachats. Riding in from Astoria past <b>Cannon Beach</b>, Garibaldi, and Rockaway Beach, you trade headlands and surf for a wide green floodplain where dairy herds graze under the Coast Range and the smell of the sea gives way to the smell of fresh-churned cheese.",
    "For this family it is almost too good to be true. <b>Galiya</b> the foodie gets a working cheese factory with free tastings and legendary scoops; <b>Ruslan</b> and <b>Aslan</b> get the <b>Tillamook Air Museum</b>, an enormous WWII wooden blimp hangar packed with vintage aircraft; and <b>Aslan</b> also gets a petting farm, ice cream, and a shop full of toys and souvenirs. Just west of town, the <b>Three Capes Scenic Loop</b> strings together a lighthouse, a famous twisted tree, and a beach with dory boats and a giant dune — easy, low-speed detours that suit a brand-new rider."
  ],
  highlights: [
    "<b>Tillamook Creamery</b> — The big one: a free self-guided <b>cheese-factory tour</b> on a glassed-in walkway over the production floor, <b>cheese tasting</b>, and the famous <b>Tillamook ice cream</b> scoop counter, plus a café and gift shop (<b>the headline foodie + kid win of the day</b>).",
    "<b>Tillamook Air Museum</b> — Housed in <b>Hangar B</b>, a gigantic WWII wooden blimp hangar — one of the <b>largest wooden structures in the world</b> — filled with vintage and warbird aircraft; the sheer scale of the building alone is jaw-dropping (<b>a guaranteed Ruslan + Aslan win</b>).",
    "<b>Blue Heron French Cheese Co.</b> — A barn-red farm shop with brie and other cheeses, a tasting room and wine, jams and gifts, plus a small <b>petting farm</b> with goats and friendly animals out back (<b>easy kid stop</b>).",
    "<b>Cape Meares (lighthouse + the Octopus Tree)</b> — On the Three Capes Loop: a squat, picturesque <b>lighthouse</b> on the cliffs and the <b>Octopus Tree</b>, a giant candelabra-shaped Sitka spruce, with seabird views over Three Arch Rocks (<b>short walks, big payoff</b>).",
    "<b>Cape Kiwanda / Pacific City</b> — A sandstone headland with colorful <b>dory boats</b> launched straight off the beach, a towering <b>sand dune</b> kids love to climb, and <b>Pelican Brewing</b> right on the sand looking at Pacific City's own offshore Haystack Rock (<b>foodie + kid combo</b>).",
    "<b>Cape Lookout</b> — The middle cape: a forested headland trail and a long sandy spit, an optional leg-stretch if time allows on the loop.",
    "<b>Cannon Beach · Haystack Rock</b> — The day's earlier coastal stop on the way in from Astoria: the iconic 235-ft sea stack with tide pools and puffins, framed by a long flat beach (<b>classic photo + tide-pool stop</b>).",
    "<b>Garibaldi & Rockaway Beach</b> — Small fishing-port and beach towns you pass riding into Tillamook Bay — good for a quick coffee, a leg stretch, or beach-and-train photos."
  ],
  food: [
    {
      "n": "Tillamook ice cream",
      "d": "Scoops at the Creamery counter (waffle cones, sundaes, the works) — the single most-requested treat of the day and an automatic crowd-pleaser for Aslan."
    },
    {
      "n": "Tillamook cheese & curds",
      "d": "Sample squeaky fresh cheese curds and the famous cheddar at the Creamery tasting bar; grab a snack-pack to carry on the bike for Yachats."
    },
    {
      "n": "Pelican Brewing — Pacific City",
      "d": "Beachfront brewpub at Cape Kiwanda with chowder, fish tacos, burgers, and house beers, all with a Haystack Rock view (foodie + family favorite)."
    },
    {
      "n": "Tillamook seafood / chowder",
      "d": "A bowl of Oregon-coast clam chowder or fish-and-chips in town or at the bay (the Garibaldi docks are known for fresh-off-the-boat seafood)."
    },
    {
      "n": "The Creamery café",
      "d": "Grilled cheese, mac-and-cheese, and simple kid plates right at the Creamery — an easy, no-fuss lunch before pushing south."
    },
    {
      "n": "Blue Heron tastings",
      "d": "Brie, smoked cheeses, jams and a glass of local wine for the grown-ups while Aslan visits the petting animals."
    }
  ],
  hotels: [
    {
      "n": "No overnight here",
      "t": "Note",
      "d": "No overnight here — Tillamook is purely a midday stop on the Day-3 ride from Astoria down to the Yachats base, timed for cheese, ice cream, the air museum, and a cape or two before the afternoon push. You could easily overnight in Tillamook or nearby Pacific City if you wanted to split this long coastal day into two and slow the pace for the new rider, but the plan is to soak up the creamery and capes, then ride on and sleep in Yachats."
    }
  ],
  links: [
    { "l": "Tillamook Creamery (official)", "u": "https://www.tillamook.com/creamery" },
    { "l": "Tillamook Air Museum", "u": "https://www.tillamookair.com/" },
    { "l": "Visit Tillamook Coast (official tourism)", "u": "https://tillamookcoast.com/" },
    {
      "l": "Three Capes Scenic Loop (Travel Oregon)",
      "u": "https://traveloregon.com/things-to-do/trip-ideas/scenic-drives/three-capes-scenic-loop/"
    },
    { "l": "Wikipedia: Tillamook, Oregon", "u": "https://en.wikipedia.org/wiki/Tillamook,_Oregon" },
    { "l": "Travel Oregon: Tillamook", "u": "https://traveloregon.com/places-to-go/cities/tillamook/" }
  ],
  photos: [
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Tillamook_Creamery_4.2025.jpg/960px-Tillamook_Creamery_4.2025.jpg",
      "cap": "The Tillamook Creamery, home of the free cheese-factory tour, tastings, and ice cream."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Tillamook_Cheese_Factory_ice_cream_stall%2C_Tillamook%2C_2011.jpg/960px-Tillamook_Cheese_Factory_ice_cream_stall%2C_Tillamook%2C_2011.jpg",
      "cap": "The ice cream counter at the Creamery — the most-requested treat of the day."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Freezer_case_full_of_Tillamook_ice_cream.jpg/960px-Freezer_case_full_of_Tillamook_ice_cream.jpg",
      "cap": "Tillamook's famous ice cream, made right here in the dairy valley."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Tillamook_Air_Museum_Mini_Guppy_in_front_of_Hangar_door.jpg/960px-Tillamook_Air_Museum_Mini_Guppy_in_front_of_Hangar_door.jpg",
      "cap": "The vast wooden blimp hangar of the Tillamook Air Museum, one of the largest wooden buildings on earth."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Tillamook_Air_Museum_Door.jpg/960px-Tillamook_Air_Museum_Door.jpg",
      "cap": "The towering hangar doors give a sense of the building's WWII scale."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Cape_Meares_Lighthouse_wide_shot.jpg/960px-Cape_Meares_Lighthouse_wide_shot.jpg",
      "cap": "The squat Cape Meares Lighthouse on the Three Capes Scenic Loop."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Octopus_Tree_%28Cape_Meares%29_in_the_Fog.jpg/960px-Octopus_Tree_%28Cape_Meares%29_in_the_Fog.jpg",
      "cap": "The Octopus Tree, a giant candelabra-shaped Sitka spruce near the lighthouse."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Haystack_Rock_%26_Cape_Kiwanda%2C_Pacific_City%2C_Oregon_%283229030211%29.jpg/960px-Haystack_Rock_%26_Cape_Kiwanda%2C_Pacific_City%2C_Oregon_%283229030211%29.jpg",
      "cap": "Cape Kiwanda and Pacific City's offshore Haystack Rock, home to dory boats and Pelican Brewing."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Cape_Kiwanda%2C_Pacific_City%2C_United_States_%28Unsplash%29.jpg/960px-Cape_Kiwanda%2C_Pacific_City%2C_United_States_%28Unsplash%29.jpg",
      "cap": "The sandstone cliffs and giant dune of Cape Kiwanda at Pacific City."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Haystack_Rock%2C_Cannon_Beach%2C_Oregon%2C_USA%2C_14_Aug_2025.jpg/960px-Haystack_Rock%2C_Cannon_Beach%2C_Oregon%2C_USA%2C_14_Aug_2025.jpg",
      "cap": "Haystack Rock at Cannon Beach, the day's earlier coastal stop on the way to Tillamook."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Western_Oregon_dairy_farm_%283718587160%29.jpg/960px-Western_Oregon_dairy_farm_%283718587160%29.jpg",
      "cap": "The green dairy country around Tillamook that supplies the famous cheese and ice cream."
    }
  ]
},
{
  id: "yachats",
  name: "Yachats",
  jp: "",
  region: "Oregon Coast · Lincoln County",
  type: "stay",
  days: "Days 3–4 · 2 nights (arrive Fri Jul 3; rest Sat Jul 4 — the 4th of July)",
  legMiles: 161,
  lat: 44.31123, lng: -124.10484, zoom: 13,
  tagline: "The \"Gem of the Oregon Coast\" — a tiny village where old-growth forest meets crashing surf, and the trip's signature two-night stay over a fireworks-and-tidepools Fourth of July.",
  intro: [
    "Yachats (pronounced <b>YAH-hots</b>) is a village of only a few hundred people wedged between the Siuslaw National Forest and the open Pacific, where rocky basalt headlands, hidden coves, and tidepools sit a short walk from the door. Locals call it the <b>\"Gem of the Oregon Coast,\"</b> and it earns it: no big resorts or chain glare, just a walkable little town, a river mouth, and the dramatic <b>Cape Perpetua Scenic Area</b> rising just to the south. This is the <b>emotional high point of the trip</b> and the destination the whole route is built around — the \"nice hotel\" goal, two unhurried nights with the bikes parked, and time to simply be on the coast.",
    "The middle day here is the <b>Fourth of July</b>, and Yachats does it in its own quirky, beloved way. The morning brings the homespun <b>La De Da Parade</b> — a come-as-you-are, anyone-can-march procession through the village — and after dark the town gathers for <b>fireworks over the bay</b>. Between the two, there are tidepools to crouch over with Aslan, sea lions barking in their sea cave, an oceanfront trail to stroll, and one of the best small-town food scenes on the coast for Galiya — all without getting back on the highway. <b>Book far ahead:</b> Yachats is tiny and sells out completely for the Fourth."
  ],
  highlights: [
    "<b>Cape Perpetua Scenic Area</b> — The crown jewel just south of town: a Forest Service scenic area with a visitor center, the <b>highest paved viewpoint on the Oregon coast</b> (Cape Perpetua Overlook, ~800 ft), and trails into towering old-growth Sitka spruce — the <b>Giant Spruce Trail</b> and <b>Cook's Ridge</b> loops (<b>scenic + easy family hikes</b>).",
    "<b>Thor's Well</b> — The famous \"drainpipe of the Pacific,\" a collapsed sea cave that appears to swallow the ocean at mid-to-rising tide; awe-inspiring and <b>genuinely dangerous up close — keep Aslan well back from the wet rocks</b> (<b>lead photo / scenic hook</b>).",
    "<b>Spouting Horn & Devil's Churn</b> — Right beside Thor's Well: a marine geyser that booms and sprays through a lava tube (<b>Spouting Horn</b>), and a long, narrow chasm where waves explode and churn (<b>Devil's Churn</b>) — best around an incoming tide (<b>dramatic kid-pleasers</b>).",
    "<b>Heceta Head Lighthouse</b> — About 13 miles south, the white tower on its green headland is <b>one of the most photographed lighthouses in the United States</b>; a short trail leads up past the historic keeper's house to the light (<b>scenic / Galiya photo stop</b>).",
    "<b>Sea Lion Caves</b> — A privately run elevator drops into America's largest sea cave, home to wild <b>Steller sea lions</b> year-round; viewpoints also look toward Heceta Head (<b>top kid + wildlife stop</b>).",
    "<b>804 Trail (Amanda's Trail / oceanfront)</b> — A flat, paved-and-gravel oceanfront path running along the bluff from town past tidepools and blowholes — an easy stroll with the whole family and a stroller-friendly intro to the shoreline.",
    "<b>Tidepooling</b> — Yachats has some of the richest, most accessible tidepools on the coast (around the 804 Trail and Cape Perpetua's rocky shelves); bring low-tide timing for sea stars, anemones, crabs, and urchins (<b>Aslan's favorite</b>).",
    "<b>Yachats 4th of July La De Da Parade + fireworks</b> — The Independence-Day rest-day centerpiece: a quirky, all-welcome village parade in the morning and <b>fireworks over Yachats Bay</b> after dark — a small-town Fourth that's a once-a-year reason this stop is two nights.",
    "<b>Oregon Coast Aquarium (Newport, ~25 mi north)</b> — An optional Day-3 stop on the way in: world-class aquarium with a walk-through ocean tunnel, sea otters, and the famous \"Passages of the Deep\" (<b>rainy-day / big kid option for Aslan</b>)."
  ],
  food: [
    {
      "n": "Luna Sea Fish House",
      "d": "Dock-to-table fish-and-chips and chowder from a local fisherman; casual, kid-easy, and famous for fresh-off-the-boat seafood (simple + foodie crossover)."
    },
    {
      "n": "Yachats Brewing + Farmstore",
      "d": "Beloved village brewpub and fermentation-focused kitchen with house beer, kraut, and seasonal plates — a relaxed, family-friendly dinner for the group."
    },
    {
      "n": "Ona Restaurant & Lounge",
      "d": "Yachats' upscale, riverfront date-night spot with Pacific Northwest seafood and a serious wine list (the foodie splurge for Galiya)."
    },
    {
      "n": "Bread & Roses Bakery",
      "d": "Cozy cottage bakery for morning pastries, scones, and coffee — the easy breakfast stop before heading to Cape Perpetua."
    },
    {
      "n": "Fresh Dungeness crab & local seafood",
      "d": "Whole cooked Dungeness, rockfish, and oysters turn up across town and at coastal markets; a must for a Pacific-coast foodie."
    },
    {
      "n": "Green Salmon Coffee & Tea House",
      "d": "Organic, fair-trade coffee, breakfast bowls, and baked goods — a mellow, kid-tolerant café to fuel the rest day."
    },
    {
      "n": "Drift Inn",
      "d": "Long-running roadhouse with live music most nights and a broad, family-friendly menu (burgers and grilled cheese for Aslan, seafood for the grown-ups)."
    }
  ],
  hotels: [
    {
      "n": "Overleaf Lodge & Spa",
      "t": "Nice hotel · oceanfront resort",
      "d": "The trip's headline stay — oceanfront rooms, on-site spa, and a path to the 804 Trail. Confirm secure motorcycle parking + family/passenger rules and BOOK FAR AHEAD (sells out for the 4th of July).",
      "park": "On-site lot, oceanfront",
      "price": "$300–$500"
    },
    {
      "n": "Fireside Motel",
      "t": "Oceanfront motel",
      "d": "Overleaf's laid-back, pet-friendly sister property right on the bluff; great ocean views for less. Confirm secure motorcycle parking + family/passenger/child rules before booking.",
      "park": "On-site lot",
      "price": "$160–$280"
    },
    {
      "n": "Adobe Resort",
      "t": "Oceanfront hotel",
      "d": "Classic oceanfront hotel with restaurant, indoor pool, and family rooms. Confirm secure motorcycle parking + family/passenger/child rules before booking.",
      "park": "On-site lot",
      "price": "$180–$320"
    },
    {
      "n": "Yachats Inn",
      "t": "Inn · oceanfront",
      "d": "Long-standing, comfortable oceanfront inn with indoor pool, walkable to the village. Confirm secure motorcycle parking + family/passenger/child rules before booking.",
      "park": "On-site lot",
      "price": "$140–$240"
    },
    {
      "n": "Yachats vacation rentals (cottages)",
      "t": "Vacation rental",
      "d": "Cottages and beach houses are popular for families; verify on-site parking and full kitchen. Confirm motorcycle parking + family/passenger/child rules before booking, and reserve very early for the Fourth.",
      "park": "Driveway/varies",
      "price": "$200–$450"
    }
  ],
  links: [
    { "l": "Overleaf Lodge & Spa", "u": "https://www.overleaflodge.com/" },
    { "l": "Visit Yachats (yachats.org)", "u": "https://yachats.org/" },
    { "l": "Cape Perpetua Scenic Area (USFS)", "u": "https://www.fs.usda.gov/recarea/siuslaw/recarea/?recid=42261" },
    {
      "l": "Heceta Head Lighthouse (Oregon State Parks)",
      "u": "https://stateparks.oregon.gov/index.cfm?do=park.profile&parkId=124"
    },
    { "l": "Sea Lion Caves", "u": "https://www.sealioncaves.com/" },
    { "l": "Wikipedia: Yachats, Oregon", "u": "https://en.wikipedia.org/wiki/Yachats,_Oregon" }
  ],
  photos: [
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Thor%27s_Well_%2837402149210%29.jpg/960px-Thor%27s_Well_%2837402149210%29.jpg",
      "cap": "Thor's Well at Cape Perpetua, the \"drainpipe of the Pacific\" — the trip's signature coastal sight."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/c/ca/Cape_Perpetua_%285802047887%29.jpg",
      "cap": "The basalt shelves and surf of the Cape Perpetua Scenic Area just south of Yachats."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Cape_Perpetua_from_Visitor_Center_01.jpg/960px-Cape_Perpetua_from_Visitor_Center_01.jpg",
      "cap": "Looking out over the Pacific from Cape Perpetua, home to the highest paved viewpoint on the Oregon coast."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/HecetaHeadLighthouse.jpg/960px-HecetaHeadLighthouse.jpg",
      "cap": "Heceta Head Lighthouse, one of the most photographed lighthouses in the United States."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Heceta_Head_Lighthouse_%285853302314%29.jpg/960px-Heceta_Head_Lighthouse_%285853302314%29.jpg",
      "cap": "The white tower above its cove, a short drive south of Yachats."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Cape_Perpetua%2C_OR_-_Devil%27s_Churn_-_2016-09-25_-_10.jpg/960px-Cape_Perpetua%2C_OR_-_Devil%27s_Churn_-_2016-09-25_-_10.jpg",
      "cap": "Devil's Churn, the narrow lava chasm where incoming waves explode and boil."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Yachats.jpg/960px-Yachats.jpg",
      "cap": "The tiny village of Yachats, the trip's two-night base on the central Oregon coast."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/6/68/View_of_Yachats_from_Perpetua.jpg",
      "cap": "Yachats and the surf-line viewed from the heights of Cape Perpetua."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Sea_Lion_Caves_-_Oregon_Coast_%282369843472%29.jpg/960px-Sea_Lion_Caves_-_Oregon_Coast_%282369843472%29.jpg",
      "cap": "Wild sea lions at the Sea Lion Caves, a top wildlife stop for kids south of Yachats."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/OREGON_COAST_-_CLEAR_TIDE_POOL_2024.jpg/960px-OREGON_COAST_-_CLEAR_TIDE_POOL_2024.jpg",
      "cap": "The rich, accessible tidepools of the Oregon coast — Aslan's favorite low-tide hunt."
    }
  ]
},
{
  id: "st-helens",
  name: "Mount St. Helens",
  jp: "",
  region: "Cascades · Cowlitz County, WA",
  type: "stop",
  days: "Day 5 · 1 night (Sun Jul 5)",
  legMiles: 217,
  lat: 46.1912, lng: -122.1944, zoom: 9,
  tagline: "The volcano that blew its top in 1980 — eruption stories, recovering forests and big Cascade views, the family's overnight on the long turn for home.",
  intro: [
    "Day 5 is the trip's pivot. After four days hugging the Oregon coast you point the bikes <b>inland and north toward home</b>, climbing out of Yachats over the Coast Range to Alsea and Corvallis, then crossing the <b>Columbia River</b> back into Washington and rolling up into the Cascade foothills. At roughly <b>217 miles it's the longest day of the tour</b> — a true transfer day — so the plan is steady backroad pace, frequent breaks, and an easy arrival rather than heroics. <b>Galiya's comfort on her W230 sets the rhythm</b>; there's no need to rush a single mile of it.",
    "The reward at the end is a real, recently-active <b>volcano</b>. You overnight at the mountain's southwest gateway — the small towns of <b>Castle Rock, Toutle and Silver Lake</b> along WA-504 — which is where the lodging, diners and the always-open visitor center all are. <b>Aslan gets the big payoff here</b>: the story of the morning of <b>May 18, 1980</b>, when Mount St. Helens lost 1,300 feet of its summit in a sideways blast, flattened forests for miles, and sent ash around the planet. Day 6 then runs the Spirit Lake Highway viewpoints before continuing on to Packwood."
  ],
  highlights: [
    "<b>Spirit Lake Memorial Highway (WA-504) drive</b> — The scenic spine of the monument: ~50 miles of smooth, sweeping two-lane climbing from Silver Lake toward the blast zone, with pull-offs framing the crater. A relaxed, low-stress ride for a new rider, all viewpoint-to-viewpoint. (Best ridden on Day 6.)",
    "<b>Mount St. Helens Visitor Center at Silver Lake</b> — The state-park center right on WA-504, <b>always open</b> and the must-do here: walk-in lava-tube model, a step-in scale model of the volcano, seismographs, and the 1980 eruption story told for all ages. <b>Aslan's favorite kind of place</b> — hands-on, kid-pitched, and a short boardwalk over Silver Lake's wetland with the mountain on the horizon.",
    "<b>The 1980 eruption story</b> — On May 18, 1980 a magnitude-5.1 quake triggered the largest landslide in recorded history and a lateral blast that leveled 230 square miles of forest. Great campfire-grade history for a six-year-old: the bulging north flank, the sideways explosion, the ashfall that darkened nearby towns.",
    "<b>Hoffstadt Bluffs (Mount St. Helens Visitor Center at Hoffstadt Bluffs)</b> — A privately-run overlook up WA-504 at about milepost 27 with sweeping valley views, eruption photo displays, a gift shop and helicopter flightseeing. A good leg-stretch and photo stop along the highway.",
    "<b>Coldwater Lake</b> — A lake <b>created by the eruption</b> when debris dammed Coldwater Creek; calm water, an accessible \"Birth of a Lake\" boardwalk trail, and reflected mountain views. A flat, easy stop the whole family can do.",
    "<b>Blast zone & the recovering forest</b> — From the upper viewpoints you can read the landscape: silvered downed logs, pumice plains, and decades of returning wildflowers, alder and elk — a living lesson in how a flattened forest comes back.",
    "<b>Elk & wildlife viewing</b> — The Toutle River valley and meadows along WA-504 are prime <b>Roosevelt elk</b> habitat, especially early and late in the day; deer and raptors too. Eyes up for a herd from a pull-off.",
    "<b>Johnston Ridge Observatory — CLOSED (do not drive there)</b> — Heads up: the famous Johnston Ridge Observatory and the upper end of WA-504 have been <b>closed since a May 2023 landslide and bridge washout</b> near milepost 49. Road rebuilding runs through fall 2026 and the observatory is not expected to reopen until ~2027. <b>Treat WA-504 as a roadside-viewpoint drive up to the closure point</b> — the Silver Lake, Hoffstadt Bluffs and Coldwater Lake stops are the highlights instead."
  ],
  food: [
    {
      "n": "Patty's Place at 19 Mile House (Toutle)",
      "d": "Longtime family-run roadhouse on the way up WA-504, known for elk and beef burgers, sweet-potato fries and homemade cobbler — a fitting end-of-a-long-day meal. (Recently rebranded; confirm current name/hours.)"
    },
    {
      "n": "Fire Mountain Grill at Hoffstadt Bluffs (Toutle)",
      "d": "Hand-pressed burgers (the \"Bigfoot\"), salads and cobbler with a wall-of-windows view of the mountain. Seasonal — confirm it's open before counting on it."
    },
    {
      "n": "Parker's Steakhouse & Brewery / local diners (Castle Rock)",
      "d": "Castle Rock at the I-5 exit has straightforward American sit-down and diner options — easy, kid-simple plates (grilled cheese, burgers, fries) after 217 miles in the saddle."
    },
    {
      "n": "Coffee in Castle Rock",
      "d": "Grab espresso at a local drive-through stand or café on Huntington Ave before the morning push up the Spirit Lake Highway. A foodie warm-up for Galiya and caffeine for the riders."
    }
  ],
  hotels: [
    {
      "n": "Silver Lake Resort (Silverlake)",
      "t": "Lakeside resort (motel rooms & cabins)",
      "d": "Lakeside motel rooms & cabins ~1 mi from the Silver Lake visitor center; kitchens, fishing decks. Confirm secure motorcycle parking + family/passenger rules before booking.",
      "park": "Open lot / drive-up by units",
      "price": "$130–$220"
    },
    {
      "n": "Mount St. Helens Motel (Castle Rock)",
      "t": "Motel",
      "d": "Simple, family-run motel on Mt St Helens Way near I-5 exit 49. Confirm secure motorcycle parking + family/passenger rules before booking.",
      "park": "Drive-up door parking",
      "price": "$100–$160"
    },
    {
      "n": "Timberland Inn & Suites (Castle Rock)",
      "t": "Motel / Inn",
      "d": "Independent inn at 1271 Mt Saint Helens Way NE, walk to Castle Rock dining. Confirm secure motorcycle parking + family/passenger rules before booking.",
      "park": "Off-street lot",
      "price": "$120–$190"
    },
    {
      "n": "Eco Park Resort (Toutle)",
      "t": "Resort (cabins & yurts)",
      "d": "Closest cabins/yurts to the mountain on WA-504, on-site café; rustic (some shared baths). Confirm secure motorcycle parking + family/passenger rules before booking.",
      "park": "Drive-up gravel sites",
      "price": "$120–$200"
    }
  ],
  links: [
    {
      "l": "Mount St. Helens National Volcanic Monument (USFS)",
      "u": "https://www.fs.usda.gov/giffordpinchot/recreation/mount-st-helens"
    },
    {
      "l": "Mount St. Helens Visitor Center at Silver Lake (WA State Parks)",
      "u": "https://parks.wa.gov/mount-st-helens-visitor-center"
    },
    {
      "l": "Upper SR 504 / Johnston Ridge closure & rebuild (WSDOT)",
      "u": "https://wsdot.wa.gov/construction-planning/search-projects/sr-504-south-coldwater-slide-spirit-lake-outlet-bridge-washout"
    },
    { "l": "Visit Mount St. Helens (Cowlitz County tourism)", "u": "https://www.visitmtsthelens.com/" },
    { "l": "Silver Lake Resort", "u": "https://silverlake-resort.com/" },
    { "l": "Mount St. Helens — Wikipedia", "u": "https://en.wikipedia.org/wiki/Mount_St._Helens" }
  ],
  photos: [
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/MSH80_eruption_mount_st_helens_05-18-80-dramatic-edit.jpg/960px-MSH80_eruption_mount_st_helens_05-18-80-dramatic-edit.jpg",
      "cap": "The iconic 1980 eruption plume — the story Aslan comes for."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Mount_St._Helens_over_Spirit_Lake_Highway.jpg/960px-Mount_St._Helens_over_Spirit_Lake_Highway.jpg",
      "cap": "The crater seen from WA-504, the scenic spine of the monument."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Mt._St._Helens_and_Spirit_Lake%2C_Washington_%281292082798%29.jpg/960px-Mt._St._Helens_and_Spirit_Lake%2C_Washington_%281292082798%29.jpg",
      "cap": "The volcano above Spirit Lake, still rimmed with floating eruption logs."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Mt_St_Helens_Spirit_Lake_2017_04.jpg/960px-Mt_St_Helens_Spirit_Lake_2017_04.jpg",
      "cap": "The horseshoe crater mirrored in Spirit Lake."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Mt_St_Helens_Spirit_Lake_2017_01.jpg/960px-Mt_St_Helens_Spirit_Lake_2017_01.jpg",
      "cap": "Recovering shoreline and the breached summit beyond."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Coldwater_Lake_9015.jpg/960px-Coldwater_Lake_9015.jpg",
      "cap": "Coldwater Lake, created when the eruption dammed the creek."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Coldwater_Lake_%282010-08-19%29%2C_04.jpg/960px-Coldwater_Lake_%282010-08-19%29%2C_04.jpg",
      "cap": "Still water and recovering ridges along the Birth of a Lake trail."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Mt._St._Helens_eruption_aftermath%2C_elk_-_USACE-p15141coll5-17062.jpeg/960px-Mt._St._Helens_eruption_aftermath%2C_elk_-_USACE-p15141coll5-17062.jpeg",
      "cap": "Elk grazing the recovering meadows — common along WA-504."
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Mount_St._Helens_Summit_Panorama.jpg/960px-Mount_St._Helens_Summit_Panorama.jpg",
      "cap": "Looking into the crater and across the Cascades."
    }
  ]
},
{
  id: "rainier",
  name: "Mount Rainier",
  jp: "",
  region: "Cascades · Lewis County, WA",
  type: "stop",
  days: "Day 6 · 1 night in Packwood (Mon Jul 6) · Day 7 park ride home",
  legMiles: 85,
  lat: 46.85272, lng: -121.7604, zoom: 9,
  tagline: "The grand finale: a mountain-town base for the ride home through wildflower meadows and over an alpine pass.",
  intro: [
    "<b>Packwood</b> is a tiny logging-turned-tourism town strung along US-12 in the upper Cowlitz valley, ringed by national forest and shadowed by the 14,411-foot bulk of Mount Rainier just to the north. Herds of <b>Roosevelt elk and black-tailed deer</b> wander the streets and lawns at dawn and dusk, which delights kids; the pace is slow, the air is cool, and the mountain is everywhere. Arriving here mid-afternoon on Day 6 after a short, easy 85-mile run leaves time to settle in, refuel the bikes, grab a burger, and rest up — because this is the <b>base camp for the trip's capstone day</b>.",
    "On Day 7 the family rides home <i>through</i> <b>Mount Rainier National Park's</b> south side, and the road itself is the reward: <b>Stevens Canyon Road</b> climbs from the SE entrance past <b>Box Canyon</b> and <b>Reflection Lakes</b> up to <b>Paradise</b>, where July brings the park's legendary wildflower bloom right to the roadside. From there it's down past <b>Narada Falls</b>, out the east side, and up the dramatic switchbacks of <b>Chinook Pass (WA-410)</b> at the alpine <b>Tipsoo Lake</b> before the long, satisfying descent through Enumclaw back to Woodinville. These are scenic, low-speed mountain roads — a confidence-building <b>graduation ride</b> for a newly-endorsed rider, not a white-knuckle one."
  ],
  highlights: [
    "<b>Paradise wildflower meadows</b> — at peak in mid-to-late July, the subalpine meadows below the mountain explode with lupine, paintbrush, and avalanche lilies; the easy paved start of the <b>Skyline Trail</b> loops straight into them <b>[SCENIC]</b>",
    "<b>Myrtle Falls</b> — a short, mostly-paved walk from Paradise to a classic waterfall framed perfectly by Mount Rainier behind it — the park's most-photographed view <b>[SCENIC]</b>",
    "<b>Reflection Lakes</b> — roadside tarns on Stevens Canyon Road that mirror the whole mountain on a calm morning; pull over for the postcard shot <b>[SCENIC][RIDING]</b>",
    "<b>Stevens Canyon Road</b> — the heart of the Day-7 ride: a serpentine, low-traffic mountain highway with tunnels, overlooks, and constant mountain views, climbing toward Paradise <b>[RIDING][SCENIC]</b>",
    "<b>Box Canyon of the Cowlitz</b> — a quick stop where the river has cut a startlingly narrow, deep slot through the rock; a short loop trail crosses it",
    "<b>Narada Falls</b> — a 168-foot tiered waterfall right beside the road, often throwing a rainbow in its mist; a steep but short path reaches the lower viewpoint <b>[SCENIC]</b>",
    "<b>Chinook Pass & Tipsoo Lake</b> — the high point of the ride home on WA-410 at ~5,430 ft, with an alpine lake, wildflowers, and the famous arched footbridge over the highway; the pass normally clears of snow and reopens by <b>early July</b> <b>[RIDING][SCENIC]</b>",
    "<b>Sunrise</b> (if open) — at 6,400 ft the highest point you can drive to in the park, with in-your-face north-side views of the mountain and marmots in the meadows; the road typically opens early-to-mid July, so check status <b>[SCENIC]</b>",
    "<b>Packwood elk & town</b> — roaming elk and deer on the lawns at dawn/dusk, plus easy access to <b>Packwood Lake</b> (a forest-road + trail outing) for a quiet pre-ride evening"
  ],
  food: [
    {
      "n": "Cliff Droppers",
      "d": "Packwood's beloved burger shack; big hand-formed burgers and fries that are an easy, crowd-pleasing dinner after the ride in"
    },
    {
      "n": "Mountain Goat Coffee",
      "d": "local espresso and pastries for an early Day-7 fuel-up before heading into the park"
    },
    {
      "n": "Blue Spruce Saloon & Diner",
      "d": "classic small-town pub grub and breakfasts, a reliable sit-down option in the center of town"
    },
    { "n": "Cruiser's Pizza", "d": "straightforward pizza and a kid-simple, no-fuss family dinner" },
    {
      "n": "Paradise Inn dining room",
      "d": "inside the park, the historic lodge serves lunch; a memorable mid-ride stop on Day 7 (seasonal hours — check ahead)"
    }
  ],
  hotels: [
    {
      "n": "Cowlitz River Lodge",
      "t": "Lodge",
      "d": "Comfortable AAA-rated lodge on US-12 with mountain views; confirm secure motorcycle parking + family/passenger rules before booking.",
      "park": "Open lot at door",
      "price": "$130–190"
    },
    {
      "n": "Crest Trail Lodge",
      "t": "Motel",
      "d": "Simple, well-kept rooms central to town and walkable to food; confirm secure motorcycle parking + family/passenger rules before booking.",
      "park": "Open lot at door",
      "price": "$120–180"
    },
    {
      "n": "Hotel Packwood",
      "t": "Historic Inn",
      "d": "Charming budget 1912 inn with shared/character rooms; confirm secure motorcycle parking + family/passenger rules before booking.",
      "park": "Street / lot",
      "price": "$70–120"
    },
    {
      "n": "Packwood Lodge & Cabins",
      "t": "Lodge / Cabins",
      "d": "Cabins and rooms good for families wanting more space; confirm secure motorcycle parking + family/passenger rules before booking.",
      "park": "On-site",
      "price": "$150–250"
    },
    {
      "n": "Paradise Inn (in park)",
      "t": "Historic Lodge",
      "d": "Iconic 1916 lodge inside the park at Paradise — books out far ahead and is well off the route home; confirm secure motorcycle parking + family/passenger rules before booking.",
      "park": "Park lot",
      "price": "$200–350"
    }
  ],
  links: [
    { "l": "Mount Rainier National Park (NPS)", "u": "https://www.nps.gov/mora/index.htm" },
    { "l": "Visit Rainier — regional travel guide", "u": "https://visitrainier.com/" },
    { "l": "Destination Packwood", "u": "https://destinationpackwood.com/" },
    {
      "l": "WSDOT — Chinook Pass (SR-410) pass report",
      "u": "https://wsdot.com/travel/real-time/mountainpasses/chinook"
    },
    {
      "l": "Wikipedia — Mount Rainier National Park",
      "u": "https://en.wikipedia.org/wiki/Mount_Rainier_National_Park"
    }
  ],
  photos: [
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Tipsoo_Lake_wildflowers_-_48607493656.jpg/960px-Tipsoo_Lake_wildflowers_-_48607493656.jpg",
      "cap": "July wildflowers at Tipsoo Lake near Chinook Pass"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Reflection_Lakes%2C_Mt_Rainier_%2848656886908%29.jpg/960px-Reflection_Lakes%2C_Mt_Rainier_%2848656886908%29.jpg",
      "cap": "Reflection Lakes mirroring the mountain on Stevens Canyon Road"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Tipsoo_Lake_And_Yakima_Peak_%28231590909%29.jpeg/960px-Tipsoo_Lake_And_Yakima_Peak_%28231590909%29.jpeg",
      "cap": "Alpine Tipsoo Lake at Chinook Pass"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Myrtle_Falls_and_Mount_Rainier.jpg/960px-Myrtle_Falls_and_Mount_Rainier.jpg",
      "cap": "Myrtle Falls framed by Mount Rainier at Paradise"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Narada_Falls.jpg/960px-Narada_Falls.jpg",
      "cap": "The tiered Narada Falls beside the park road"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Stevens_Canyon%2C_Mount_Rainier_-_Flickr_-_brewbooks.jpg/960px-Stevens_Canyon%2C_Mount_Rainier_-_Flickr_-_brewbooks.jpg",
      "cap": "The mountain from Stevens Canyon Road"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Chinook_Pass_panorama_7538.jpg/960px-Chinook_Pass_panorama_7538.jpg",
      "cap": "The alpine landscape at Chinook Pass on WA-410"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Mount_Rainier_and_lake_reflection.jpg/960px-Mount_Rainier_and_lake_reflection.jpg",
      "cap": "Mount Rainier mirrored in a still mountain lake"
    },
    {
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Mount_Rainier_from_above_Myrtle_Falls_in_August.JPG/960px-Mount_Rainier_from_above_Myrtle_Falls_in_August.JPG",
      "cap": "The mountain above the subalpine meadows near Paradise"
    }
  ]
}
];

window.HOME = { city: "Woodinville", state: "WA" };
window.FLIGHTS = {
  "intro": "There are no flights and no rental counters — this tour starts in your own garage in Woodinville and ends there a week later. The only logistics are a tank of gas, a packed top-box, and the Edmonds–Kingston ferry that opens Day 1. It's a deliberately simple round trip, designed so a brand-new rider can focus on the riding, not the paperwork.",
  "season": "Depart Wednesday 1 July 2026, home Tuesday 7 July — seven days. Early July is prime Pacific Northwest touring weather: long daylight, dry mountain passes (Chinook Pass is open) and the warmest the coast gets. The catch is the Fourth-of-July crowds — the rest day lands on the 4th in Yachats, so book all coast lodging months ahead.",
  "legs": [
    {
      "dir": "Outbound · down the coast",
      "from": "Home · Woodinville, WA",
      "to": "Yachats, OR (the ★ base)",
      "sample": "Days 1–3 · Wed 1 – Fri 3 Jul 2026",
      "type": "Ride + ferry",
      "duration": "≈ 436 mi over 3 gentle days",
      "note": "A short ride to the Edmonds waterfront, the ferry across Puget Sound, then quiet roads down Hood Canal and the whole length of the Washington and Oregon coast on Highway 101 — Westport and Astoria overnights, Tillamook cheese and the Three Capes en route to the Yachats base. No freeways, breaks every 60–90 minutes."
    },
    {
      "dir": "Return · over the mountains",
      "from": "Yachats, OR",
      "to": "Home · Woodinville, WA",
      "sample": "Days 5–7 · Sun 5 – Tue 7 Jul 2026",
      "type": "Ride",
      "duration": "≈ 534 mi over 3 days",
      "note": "The loop turns inland: across the Coast Range and the Columbia to Mount St. Helens, a short day to Packwood, then the graduation ride home through Mount Rainier National Park over Chinook Pass. The longest single day (~216 mi to St. Helens) is broken with frequent stops."
    }
  ],
  "estimate": "Budget is modest: gas for two bikes over ~970 miles, six nights of lodging (the Yachats oceanfront stay is the splurge; coast motels and Packwood lodges are cheaper), the Edmonds–Kingston ferry (~$9 per motorcycle + rider), and a Mount Rainier National Park entry pass (or the America the Beautiful annual pass). Food is the fun line item — see the Coast Food Trail.",
  "tips": [
    "Book all coast lodging months ahead — the Fourth-of-July weekend sells Yachats and the whole coast out early.",
    "The Kawasaki W230's tank is small (~3.4 gal) — top up at every reasonable chance; fuel is sparse on the coast and around the mountains.",
    "Pack for everything: cold coastal fog and wind, possible rain, and alpine chill at Chinook Pass — layers and waterproofs for all three.",
    "Pair the intercoms before Day 1; Galiya rides up front and sets the pace, with Aslan and the GS behind.",
    "Check WSDOT for Chinook Pass (SR-410) status and the Mount Rainier timed-entry reservation system before Days 6–7."
  ],
  "links": [
    {
      "l": "Washington State Ferries — Edmonds/Kingston",
      "u": "https://wsdot.wa.gov/travel/washington-state-ferries/schedules/edmonds-kingston"
    },
    { "l": "Mount Rainier National Park (NPS)", "u": "https://www.nps.gov/mora/index.htm" },
    { "l": "Mount St. Helens National Volcanic Monument", "u": "https://www.fs.usda.gov/mountsthelens" },
    { "l": "WSDOT — mountain pass reports (Chinook Pass)", "u": "https://wsdot.com/travel/real-time/mountainpasses" },
    { "l": "Visit the Oregon Coast", "u": "https://visittheoregoncoast.com/" },
    { "l": "Visit Yachats", "u": "https://yachats.org/" }
  ]
};

/* Day-by-day schedule (Day 1–7). day.html builds a timed routine per day. */
window.DAYS = [
{
    "d": 1,
    "id": "westport",
    "miles": 176,
    "dmin": 275,
    "ferry": true,
    "rest": false,
    "region": "Puget Sound → Washington Coast",
    "title": "Ferry, Fjord & First Miles",
    "route": "Woodinville → Edmonds–Kingston ferry → Hood Canal (Hama Hama oysters) → Westport",
    "desc": "The trip begins the gentle way. Ride the short hop from Woodinville to the Edmonds waterfront and roll the bikes onto the Edmonds–Kingston ferry — a calm half-hour across Puget Sound that skips Seattle's traffic entirely and lets Galiya settle in before the first real miles. From Kingston, quiet two-lane roads trace the west shore of Hood Canal, the long glacial fjord with the Olympics rising across the water — with a stop at the family's favourite, the Hama Hama Oyster Saloon in Lilliwaup, for a fresh oyster lunch right on the water. Then drop south through Shelton to Aberdeen and out to the Pacific at Westport. It's a forgiving, scenic first day built around the ferry break and frequent stops — the W230's confidence-building shakedown and Aslan's easy introduction to life on the back of the GS. Arrive at the salty fishing-and-surf town of Westport with the afternoon to walk the marina and climb the lighthouse.",
    "tags": ["ride", "skill", "scenic", "food", "kid"],
    "gfrom": "Woodinville, WA",
    "gto": "Westport, WA",
    "gvia": "Edmonds Ferry Terminal, Edmonds, WA|Hama Hama Oyster Saloon, Lilliwaup, WA|Hoodsport, WA|Aberdeen, WA",
    "poi": [
      {
        "name": "Edmonds–Kingston Ferry",
        "what": "Roll the bikes aboard for a ~30-minute Puget Sound crossing — the relaxed, traffic-free start to the tour and Galiya's first ferry load-on. Aim for the <b>10:20 AM</b> summer sailing (Wed Jul 1; weekday departures run 9:35 / 10:20 / 11:05 / 11:55 AM) and arrive ~15 min early — motorcycles load first. No reservation needed for bikes.",
        "q": "Edmonds Ferry Terminal, Edmonds, WA",
        "slot": "activity",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Washington_State_Ferry_MV_Spokane_at_the_Edmonds_Ferry_Terminal_01.jpg/960px-Washington_State_Ferry_MV_Spokane_at_the_Edmonds_Ferry_Terminal_01.jpg",
        "wiki": "https://en.wikipedia.org/wiki/Edmonds%E2%80%93Kingston_ferry",
        "it": ["skill", "scenic"],
        "kid": true
      },
      {
        "name": "Hama Hama Oyster Saloon",
        "what": "The family's favourite Hood Canal stop — just-shucked oysters (raw, grilled, or fried in a po'boy) and steamer clams at the Hama Hama oyster farm's roadside saloon in Lilliwaup, right on US-101 over the water. The perfect first-day lunch; check the seasonal days/hours before you count on it.",
        "q": "Hama Hama Oyster Saloon, Lilliwaup, WA",
        "slot": "lunch",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Hood_Canal_Bridge.jpg/960px-Hood_Canal_Bridge.jpg",
        "it": ["food", "scenic"]
      },
      {
        "name": "Hood Canal",
        "what": "Quiet shoreline two-lanes along the long glacial fjord, the Olympic Mountains across the water — easy, gorgeous riding to build confidence on Day 1.",
        "q": "Hoodsport, WA",
        "slot": "scenic",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Hood_Canal_Overlook_5869.jpg/960px-Hood_Canal_Overlook_5869.jpg",
        "wiki": "https://en.wikipedia.org/wiki/Hood_Canal",
        "it": ["scenic", "coast", "skill"]
      },
      {
        "name": "Aberdeen & Grays Harbor",
        "what": "Coffee and a fuel stop at the harbor city (Kurt Cobain's hometown) before the last run out to the coast.",
        "q": "Aberdeen, WA",
        "slot": "coffee",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Woodinville_WA_-_Sammamish_River_Trail.jpg/960px-Woodinville_WA_-_Sammamish_River_Trail.jpg",
        "it": ["food", "coast"]
      },
      {
        "name": "Grays Harbor Lighthouse",
        "what": "Washington's tallest lighthouse, on arrival in Westport — a fitting first landmark of the Pacific.",
        "q": "Grays Harbor Lighthouse, Westport, WA",
        "slot": "scenic",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Grays_Harbor_%28Westport%29_Lighthouse_01.jpg/960px-Grays_Harbor_%28Westport%29_Lighthouse_01.jpg",
        "wiki": "https://en.wikipedia.org/wiki/Grays_Harbor_Light",
        "it": ["lighthouse", "coast"]
      },
      {
        "name": "Westhaven State Park",
        "what": "Westport's surf beach and south jetty — a leg-stretch on the sand to celebrate reaching the ocean on day one.",
        "q": "Westhaven State Park, Westport, WA",
        "slot": "activity",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/Westport%2C_WA_-_beach_scene.jpg/960px-Westport%2C_WA_-_beach_scene.jpg",
        "it": ["coast", "kid"],
        "kid": true
      }
    ],
    "foodTrail": [
      {
        "style": "Dungeness crab & fish-and-chips",
        "shop": "Bennett's Fish Shack",
        "shopUrl": "https://www.google.com/maps/search/?api=1&query=Bennett%27s%20Fish%20Shack%20Westport%20WA",
        "city": "Westport",
        "slot": "dinner"
      }
    ],
    "eats": [
      {
        "slot": "coffee",
        "area": "Edmonds waterfront",
        "picks": [
          {
            "name": "Walnut Street Coffee",
            "cuisine": "coffee / espresso & pastries",
            "rating": 4.7,
            "why": "Ruslan & Galiya — top-rated local espresso to start the trip; grab a pastry for Aslan",
            "kid": false,
            "map": "https://maps.google.com/?cid=9866092700006776997",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Cappuccino_at_Sightglass_Coffee.jpg/960px-Cappuccino_at_Sightglass_Coffee.jpg"
          },
          {
            "name": "Waterfront Coffee Company",
            "cuisine": "coffee / cafe",
            "rating": 4.6,
            "why": "Ruslan — right by the ferry dock, easy in-and-out before boarding",
            "kid": false,
            "map": "https://maps.google.com/?cid=16325238489058569722"
          }
        ]
      },
      {
        "slot": "lunch",
        "area": "Hama Hama Oyster Saloon · Lilliwaup (on Hood Canal)",
        "picks": [
          {
            "name": "Hama Hama Oyster Saloon",
            "cuisine": "oysters / Hood Canal seafood",
            "cuisine_note": "the family favourite",
            "rating": 4.6,
            "why": "Ruslan & Galiya — your favourite stop: just-shucked Hood Canal oysters (raw, grilled or fried) and chowder, right on the water at the oyster farm",
            "kid": false,
            "map": "https://www.google.com/maps/search/?api=1&query=Hama+Hama+Oyster+Saloon+Lilliwaup+WA",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Pacific_oysters.jpg/960px-Pacific_oysters.jpg"
          },
          {
            "name": "Hama Hama Saloon — non-oyster plates",
            "cuisine": "fries, clam chowder, simple plates",
            "rating": 4.6,
            "why": "Aslan — the saloon has fries, chowder and non-oyster bites; the menu is oyster-focused, so pack a snack as backup",
            "kid": true,
            "map": "https://www.google.com/maps/search/?api=1&query=Hama+Hama+Oyster+Saloon+Lilliwaup+WA",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Cup_of_clam_chowder%2C_with_saltines.jpg/960px-Cup_of_clam_chowder%2C_with_saltines.jpg"
          }
        ]
      },
      {
        "slot": "dinner",
        "area": "Westport marina",
        "picks": [
          {
            "name": "Blue Buoy",
            "cuisine": "fresh seafood / Pacific Northwest",
            "rating": 4.5,
            "why": "Galiya — celebratory fresh-off-the-boat Westport seafood right at the marina",
            "kid": false,
            "map": "https://maps.google.com/?cid=3139538248414449400",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Cup_of_clam_chowder%2C_with_saltines.jpg/960px-Cup_of_clam_chowder%2C_with_saltines.jpg"
          },
          {
            "name": "Bennett's Fish Shack",
            "cuisine": "fish & chips / family seafood",
            "rating": 4.3,
            "why": "Aslan — classic fish & chips, burgers and fries; busy, casual, kid-easy harbor favorite",
            "kid": true,
            "map": "https://maps.google.com/?cid=688763201149346829",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Fish_and_Chips_Bath%2C_UK.jpg/960px-Fish_and_Chips_Bath%2C_UK.jpg"
          },
          {
            "name": "Merino's Seafood Market",
            "cuisine": "seafood market / cooked-to-order crab & shrimp",
            "rating": 4.7,
            "why": "Ruslan & Galiya — buy fresh Dungeness crab and cocktails dockside; the most local option",
            "kid": false,
            "map": "https://maps.google.com/?cid=17492398225141631717"
          }
        ]
      }
    ],
    "localTodo": [
      {
        "time": "10:20 AM",
        "name": "Edmonds–Kingston Ferry",
        "what": "the trip's first big moment — catch the 10:20 AM summer sailing (weekday departures: 9:35/10:20/11:05/11:55 AM; ~30-min crossing). No reservation for bikes — arrive ~15 min early, motorcycles load first",
        "map": "https://www.google.com/maps/search/?api=1&query=Edmonds+Ferry+Terminal+WA"
      },
      {
        "time": "~11:30",
        "name": "Hood Canal / US-101",
        "what": "flowing fjord-side cruise — easy paved sweepers along the water, perfect first-day riding",
        "map": "https://www.google.com/maps/search/?api=1&query=Hood+Canal+US-101+Washington"
      },
      {
        "time": "~16:15",
        "name": "Westport Marina & Float 20",
        "what": "stroll the working harbor and watch the fishing boats unload; toy/souvenir shops nearby for Aslan",
        "map": "https://www.google.com/maps/search/?api=1&query=Westport+Marina+WA"
      },
      {
        "time": "~16:45",
        "name": "Westport Light State Park / Dune Trail",
        "what": "short paved walk to the lighthouse and beach to stretch legs after the ride",
        "map": "https://www.google.com/maps/search/?api=1&query=Westport+Light+State+Park+WA"
      }
    ]
  },
{
    "d": 2,
    "id": "cannon-beach",
    "miles": 125,
    "dmin": 173,
    "rest": false,
    "region": "Washington Coast → Oregon",
    "title": "Across the Columbia to Cannon Beach",
    "route": "Westport → Long Beach → Astoria → Cannon Beach",
    "desc": "A relaxed second day with a beach payoff. Roll south through the oyster country of South Bend and Raymond, out onto the Long Beach Peninsula — one of the longest drivable beaches in the world — past the windswept headland of Cape Disappointment, then over the Astoria–Megler Bridge (four-plus miles across the mighty Columbia into Oregon). Spend the afternoon in Astoria, a hilly Victorian riverport full of kid wins — the Astoria Column with its balsa-glider launch, barking sea lions on the docks, and the excellent Columbia River Maritime Museum — then drop the last ~25 miles south to sleep at Cannon Beach, right under the 235-foot Haystack Rock. Wake up on the beach.",
    "tags": ["ride", "kid", "history", "coast"],
    "gfrom": "Westport, WA",
    "gto": "Cannon Beach, OR",
    "gvia": "Raymond, WA|Long Beach, WA|Astoria, OR",
    "poi": [
      {
        "name": "South Bend & Raymond",
        "what": "Oyster-country leg-stretch along Willapa Bay — 'the Oyster Capital of the World' — on quiet Highway 101.",
        "q": "Raymond, WA",
        "slot": "coffee",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Westport%2C_WA_-_fishing_boat_%27Patriot%27.jpg/960px-Westport%2C_WA_-_fishing_boat_%27Patriot%27.jpg",
        "it": ["food", "coast"]
      },
      {
        "name": "Long Beach Peninsula",
        "what": "A 28-mile ribbon of sand you can ride a bike or fly a kite on; the boardwalk and the World Kite Museum are easy fun for Aslan.",
        "q": "Long Beach, WA",
        "slot": "scenic",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/View_from_atop_the_ridge_at_Westhaven_State_Park_-_panoramio.jpg/960px-View_from_atop_the_ridge_at_Westhaven_State_Park_-_panoramio.jpg",
        "wiki": "https://en.wikipedia.org/wiki/Long_Beach_Peninsula",
        "it": ["coast", "kid", "toys"],
        "kid": true
      },
      {
        "name": "Astoria–Megler Bridge",
        "what": "The 4.1-mile bridge across the Columbia into Oregon — the longest continuous truss bridge in North America and a memorable ride-over.",
        "q": "Astoria-Megler Bridge",
        "slot": "scenic",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Astoria-Megler_Bridge_from_West_Mooring_Basin_Docks.jpg/960px-Astoria-Megler_Bridge_from_West_Mooring_Basin_Docks.jpg",
        "wiki": "https://en.wikipedia.org/wiki/Astoria%E2%80%93Megler_Bridge",
        "it": ["scenic", "history"]
      },
      {
        "name": "Astoria Column",
        "what": "Climb the 164-step painted tower for a 360° view, then launch a balsa-wood glider from the top — a classic kid thrill.",
        "q": "Astoria Column, Astoria, OR",
        "slot": "activity",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Astoria_Column%2C_angled.jpg/960px-Astoria_Column%2C_angled.jpg",
        "wiki": "https://en.wikipedia.org/wiki/Astoria_Column",
        "it": ["history", "scenic", "kid"],
        "kid": true
      },
      {
        "name": "Columbia River Maritime Museum",
        "what": "One of the best maritime museums on the West Coast — lightships, a Coast Guard rescue-boat display and shipwreck lore that grabs a 6-year-old.",
        "q": "Columbia River Maritime Museum, Astoria, OR",
        "slot": "lunch",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Columbia_River_Maritime_Museum_exterior_in_2012.jpg/960px-Columbia_River_Maritime_Museum_exterior_in_2012.jpg",
        "wiki": "https://en.wikipedia.org/wiki/Columbia_River_Maritime_Museum",
        "it": ["history", "kid", "food"],
        "kid": true
      },
      {
        "name": "Astoria sea lions",
        "what": "Hundreds of barking sea lions haul out on the East Mooring Basin docks — free, loud and a guaranteed Aslan favourite.",
        "q": "Astoria, OR",
        "slot": "scenic",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Sea_lions_%28Astoria%2C_Oregon%29.jpg/960px-Sea_lions_%28Astoria%2C_Oregon%29.jpg",
        "it": ["wildlife", "kid"],
        "kid": true
      },
      {
        "name": "Haystack Rock, Cannon Beach",
        "what": "Arrive at the iconic 235-foot sea stack — tide pools, nesting puffins and a long flat beach right outside the night's lodging. Sunset on the sand caps the day.",
        "q": "Haystack Rock, Cannon Beach, OR",
        "slot": "activity",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Haystack_Rock%2C_Cannon_Beach%2C_Oregon%2C_USA%2C_14_Aug_2025.jpg/960px-Haystack_Rock%2C_Cannon_Beach%2C_Oregon%2C_USA%2C_14_Aug_2025.jpg",
        "wiki": "https://en.wikipedia.org/wiki/Haystack_Rock",
        "it": ["coast", "wildlife", "scenic"],
        "kid": true
      }
    ],
    "foodTrail": [
      {
        "style": "Beer-battered fish & craft beer",
        "shop": "Bowpicker Fish & Chips",
        "shopUrl": "https://www.google.com/maps/search/?api=1&query=Bowpicker%20Fish%20and%20Chips%20Astoria%20OR",
        "city": "Astoria",
        "slot": "lunch"
      }
    ],
    "eats": [
      {
        "slot": "breakfast",
        "area": "Westport",
        "picks": [
          {
            "name": "Capt'n Jack's",
            "cuisine": "coffee shop / breakfast",
            "rating": 4.6,
            "why": "Ruslan — strong coffee and a relaxed start before the ride",
            "kid": true,
            "map": "https://maps.google.com/?cid=17216258680165636564"
          },
          {
            "name": "Blue Buoy",
            "cuisine": "diner / seafood breakfast",
            "rating": 4.5,
            "why": "Galiya — big harbor-town breakfast; Aslan gets plain eggs, toast & hashbrowns",
            "kid": true,
            "map": "https://maps.google.com/?cid=3139538248414449400"
          }
        ]
      },
      {
        "slot": "lunch",
        "area": "Astoria riverfront",
        "picks": [
          {
            "name": "Bowpicker Fish and Chips",
            "cuisine": "battered albacore tuna fish & chips",
            "rating": 4.8,
            "why": "whole family — Astoria's legendary boat-shaped stand; crispy and kid-friendly (cash only, limited hours — check before going)",
            "kid": true,
            "map": "https://maps.google.com/?cid=10661837831491802640",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Fish_and_chips.jpg/960px-Fish_and_chips.jpg"
          },
          {
            "name": "Buoy Beer Co. Taproom",
            "cuisine": "riverfront brewpub / seafood",
            "rating": 4.5,
            "why": "Galiya & Ruslan — on-pier seafood and local beer with a glass-floor sea-lion window Aslan will love",
            "kid": true,
            "map": "https://maps.google.com/?cid=11352265591615845826"
          },
          {
            "name": "Fort George Brewery",
            "cuisine": "brewpub burgers & pub fare",
            "rating": 4.5,
            "why": "Aslan — burgers and fries in a roomy family pub; Ruslan gets the famous beer",
            "kid": true,
            "map": "https://maps.google.com/?cid=16478071298936810665",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/NCI_Visuals_Food_Hamburger.jpg/960px-NCI_Visuals_Food_Hamburger.jpg"
          }
        ]
      },
      {
        "slot": "dinner",
        "area": "Cannon Beach (under Haystack Rock)",
        "picks": [
          {
            "name": "Ecola Seafood Restaurant & Market",
            "cuisine": "fresh Dungeness crab / clam chowder / fish & chips",
            "rating": 4.4,
            "why": "Galiya — off-the-boat Dungeness crab and a proper clam chowder at the village fish market",
            "kid": false,
            "map": "https://maps.google.com/?cid=6963953583807006938",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Cup_of_clam_chowder%2C_with_saltines.jpg/960px-Cup_of_clam_chowder%2C_with_saltines.jpg"
          },
          {
            "name": "Public Coast Brewing Co",
            "cuisine": "brewpub burgers & seafood",
            "rating": 4.3,
            "why": "whole family — local beer for Ruslan, fresh fish for Galiya, and burgers/fries plus a kids' menu for Aslan",
            "kid": true,
            "map": "https://maps.google.com/?cid=10044052816328267324",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/NCI_Visuals_Food_Hamburger.jpg/960px-NCI_Visuals_Food_Hamburger.jpg"
          },
          {
            "name": "Pizza A' Fetta Cannon Beach",
            "cuisine": "wood-style pizza by the slice",
            "rating": 4.3,
            "why": "Aslan — easy hand-tossed pizza right on Hemlock St, the simplest win of the day",
            "kid": true,
            "map": "https://maps.google.com/?cid=10796748354004653791",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Eq_it-na_pizza-margherita_sep2005_sml.jpg/960px-Eq_it-na_pizza-margherita_sep2005_sml.jpg"
          }
        ]
      }
    ],
    "localTodo": [
      {
        "time": "~13:00",
        "name": "Astoria–Megler Bridge",
        "what": "the 4-mile bridge across the mouth of the Columbia into Oregon — the day's signature ride",
        "map": "https://www.google.com/maps/search/?api=1&query=Astoria-Megler+Bridge"
      },
      {
        "time": "~14:00",
        "name": "The Astoria Column",
        "what": "160-step painted tower with a panorama over the river, town and Coast Range; Aslan can toss balsa gliders from the top (4.8★)",
        "map": "https://maps.google.com/?cid=12946077969317517854"
      },
      {
        "time": "~15:00",
        "name": "Columbia River Maritime Museum & riverfront sea lions",
        "what": "hands-on maritime history for Aslan, plus the barking sea-lion haul-out on the docks below the Riverwalk",
        "map": "https://www.google.com/maps/search/?api=1&query=Columbia+River+Maritime+Museum+Astoria"
      },
      {
        "time": "~17:00",
        "name": "Haystack Rock, Cannon Beach",
        "what": "walk straight onto the beach at the 235-ft sea stack — tidepools, puffins and the postcard view from your overnight town",
        "map": "https://www.google.com/maps/search/?api=1&query=Haystack+Rock+Cannon+Beach"
      }
    ]
  },
{
    "d": 3,
    "id": "yachats",
    "miles": 136,
    "dmin": 192,
    "rest": false,
    "region": "Oregon Coast",
    "title": "Cheese, Capes & the Coast Run",
    "route": "Cannon Beach → Tillamook → Pacific City → Newport → Yachats",
    "desc": "The signature coast day, and the most varied riding of the trip — all on scenic Highway 101 and the Three Capes byway, no freeways. Wake under Haystack Rock, then roll south to the marquee mid-day stop the family asked for: the Tillamook Creamery for a cheese-factory tour and famous ice cream, with the giant wooden blimp hangar of the Tillamook Air Museum next door. Detour the Three Capes Scenic Loop past Cape Meares Lighthouse and the dory-boat beach and big dune at Pacific City. Carry on down the coast — Lincoln City, Depoe Bay, the Oregon Coast Aquarium at Newport — and arrive by early evening at Yachats, the tiny gem where forest meets surf, your two-night base for the Fourth of July.",
    "tags": ["ride", "food", "kid", "scenic"],
    "gfrom": "Cannon Beach, OR",
    "gto": "Yachats, OR",
    "gvia": "Tillamook Creamery, Tillamook, OR|Pacific City, OR|Newport, OR",
    "poi": [
      {
        "name": "Tillamook Creamery",
        "what": "The marquee stop: a free self-guided cheese-factory viewing gallery, samples, and the legendary ice-cream counter — the trip's biggest foodie-and-kid double win.",
        "q": "Tillamook Creamery, Tillamook, OR",
        "slot": "lunch",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Tillamook_Creamery_4.2025.jpg/960px-Tillamook_Creamery_4.2025.jpg",
        "wiki": "https://en.wikipedia.org/wiki/Tillamook_County_Creamery_Association",
        "it": ["food", "kid"],
        "kid": true
      },
      {
        "name": "Tillamook Air Museum",
        "what": "Vintage aircraft inside one of the world's largest wooden structures — a WWII blimp hangar. Catnip for Ruslan and Aslan alike.",
        "q": "Tillamook Air Museum, Tillamook, OR",
        "slot": "activity",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Tillamook_Air_Museum_Mini_Guppy_in_front_of_Hangar_door.jpg/960px-Tillamook_Air_Museum_Mini_Guppy_in_front_of_Hangar_door.jpg",
        "wiki": "https://en.wikipedia.org/wiki/Tillamook_Air_Museum",
        "it": ["history", "kid"],
        "kid": true
      },
      {
        "name": "Cape Meares Lighthouse",
        "what": "Oregon's shortest lighthouse on a clifftop headland, beside the gnarled, many-trunked Octopus Tree — a short Three-Capes detour.",
        "q": "Cape Meares Lighthouse, OR",
        "slot": "scenic",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Cape_Meares_Lighthouse_wide_shot.jpg/960px-Cape_Meares_Lighthouse_wide_shot.jpg",
        "wiki": "https://en.wikipedia.org/wiki/Cape_Meares_Light",
        "it": ["lighthouse", "scenic", "coast"]
      },
      {
        "name": "Cape Kiwanda / Pacific City",
        "what": "Dory boats launched straight off the beach, a giant sand dune to climb and Pelican Brewing on the sand — a lively coastal stop.",
        "q": "Cape Kiwanda, Pacific City, OR",
        "slot": "scenic",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Haystack_Rock_%26_Cape_Kiwanda%2C_Pacific_City%2C_Oregon_%283229030211%29.jpg/960px-Haystack_Rock_%26_Cape_Kiwanda%2C_Pacific_City%2C_Oregon_%283229030211%29.jpg",
        "it": ["coast", "scenic", "food"],
        "kid": true
      },
      {
        "name": "Oregon Coast Aquarium",
        "what": "A optional Newport stop ~25 mi before Yachats — sea otters, a walk-through shark tunnel and a giant Pacific octopus; great if the day's running early.",
        "q": "Oregon Coast Aquarium, Newport, OR",
        "slot": "stop",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Sea_lions_%28Astoria%2C_Oregon%29.jpg/960px-Sea_lions_%28Astoria%2C_Oregon%29.jpg",
        "wiki": "https://en.wikipedia.org/wiki/Oregon_Coast_Aquarium",
        "it": ["wildlife", "kid"],
        "kid": true
      }
    ],
    "foodTrail": [
      {
        "style": "Tillamook cheese & ice cream",
        "shop": "Tillamook Creamery",
        "shopUrl": "https://www.google.com/maps/search/?api=1&query=Tillamook%20Creamery%20Tillamook%20OR",
        "city": "Tillamook",
        "slot": "lunch"
      }
    ],
    "eats": [
      {
        "slot": "breakfast",
        "area": "Cannon Beach",
        "picks": [
          {
            "name": "Lazy Susan Cafe",
            "cuisine": "Pacific NW breakfast (waffles, hash, oatmeal)",
            "rating": 4.6,
            "why": "Galiya & Ruslan — beloved Cannon Beach breakfast institution",
            "kid": false,
            "map": "https://maps.google.com/?cid=9539713796856644525",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Honey_Run_Covered_Bridge_2024_Pancake_Breakfast-104A2111.jpg/960px-Honey_Run_Covered_Bridge_2024_Pancake_Breakfast-104A2111.jpg"
          },
          {
            "name": "Sea Level Bakery + Coffee",
            "cuisine": "bakery, pastries & espresso",
            "rating": 4.6,
            "why": "Aslan — plain pastries/muffins he'll eat; great coffee for Ruslan, quick to-go before the ride",
            "kid": true,
            "map": "https://maps.google.com/?cid=5140496243597652907"
          }
        ]
      },
      {
        "slot": "lunch",
        "area": "Tillamook",
        "picks": [
          {
            "name": "Tillamook Creamery",
            "cuisine": "cheese, grilled cheese, mac & cheese + famous ice cream",
            "rating": 4.5,
            "why": "Aslan — grilled cheese, mac & cheese and a huge ice-cream cone (the day's kid win); Galiya — see the cheese made on-site",
            "kid": true,
            "map": "https://maps.google.com/?cid=16409213061769628058",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Ice_cream_in_cones.jpg/960px-Ice_cream_in_cones.jpg"
          },
          {
            "name": "Pelican Brewing – Pacific City",
            "cuisine": "brewpub — chowder, fish & chips, burgers, craft beer",
            "rating": 4.1,
            "why": "Ruslan — pint on the beach at Cape Kiwanda; Galiya — clam chowder; an easy second stop ~30 min south of the Creamery",
            "kid": false,
            "map": "https://maps.google.com/?cid=6312434849402413715",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Fish_and_chips.jpg/960px-Fish_and_chips.jpg"
          }
        ]
      },
      {
        "slot": "dinner",
        "area": "Yachats",
        "picks": [
          {
            "name": "The Drift Inn Hotel & Restaurant",
            "cuisine": "American comfort food, seafood, live music",
            "rating": 4.3,
            "why": "Whole family — confirmed open, lively, broad menu with burgers/pasta/fries for Aslan and fresh seafood for Galiya & Ruslan",
            "kid": true,
            "map": "https://maps.google.com/?cid=15878405420698897937",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Fish_and_chips.jpg/960px-Fish_and_chips.jpg"
          },
          {
            "name": "Luna Sea Fish House (Seal Rock)",
            "cuisine": "fresh local seafood, fish & chips, chowder",
            "rating": 4.5,
            "why": "Galiya & Ruslan — the genuinely great Luna Sea (the tiny Yachats counter is mediocre); 12 min north, dock-to-table fish & chips Aslan will also eat",
            "kid": true,
            "map": "https://maps.google.com/?cid=14291681410554983807",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Fish_and_Chips_Bath%2C_UK.jpg/960px-Fish_and_Chips_Bath%2C_UK.jpg"
          },
          {
            "name": "Yachats Underground Pub & Grub",
            "cuisine": "pub fare — burgers, fries, fish & chips",
            "rating": 4.0,
            "why": "Aslan — casual cellar pub with simple burger-and-fries kids' fare; walkable in town if the Drift Inn has a wait",
            "kid": true,
            "map": "https://maps.google.com/?cid=1754061589375500362"
          }
        ]
      }
    ],
    "localTodo": [
      {
        "time": "~09:45",
        "name": "Haystack Rock, Cannon Beach",
        "what": "235-ft sea stack with tidepools and puffins — quick beach stretch before the ride south",
        "map": "https://www.google.com/maps/search/?api=1&query=Haystack+Rock+Cannon+Beach+Oregon"
      },
      {
        "time": "~12:30",
        "name": "Tillamook Creamery",
        "what": "self-guided cheese-making viewing gallery, free samples, and the famous scoop counter — Aslan's ice-cream highlight of the trip",
        "map": "https://maps.google.com/?cid=16409213061769628058"
      },
      {
        "time": "~14:30",
        "name": "Cape Kiwanda & the Pacific City dory beach",
        "what": "giant sandstone headland and dune right beside Pelican Brewing — climb, watch the dory boats, easy family stop",
        "map": "https://www.google.com/maps/search/?api=1&query=Cape+Kiwanda+Pacific+City+Oregon"
      },
      {
        "time": "~16:30",
        "name": "Yaquina Head / Newport Bayfront (optional)",
        "what": "lighthouse and sea-lion docks if you have time before pushing the last 25 min to Yachats",
        "map": "https://www.google.com/maps/search/?api=1&query=Yaquina+Head+Lighthouse+Newport+Oregon"
      }
    ]
  },
{
    "d": 4,
    "id": "yachats",
    "miles": 31,
    "dmin": 51,
    "rest": true,
    "region": "Oregon Coast",
    "title": "Yachats & the Fourth of July",
    "route": "Yachats · Cape Perpetua · Heceta Head (light riding)",
    "desc": "The rest day — and it falls on the Fourth of July, in one of the coast's most beloved spots to spend it. Sleep in, then take a short, easy loop south to Cape Perpetua: the highest viewpoint on the Oregon coast, the churning Thor's Well and Devil's Churn, and the photogenic Heceta Head Lighthouse, with the Sea Lion Caves and rich tide pools for Aslan. Back in the village, Yachats throws its famously quirky La De Da Parade and caps the night with fireworks over the bay. No real riding pressure today — it's about tide pools, chowder, a beach walk on the 804 Trail and the holiday. (Book everything here far ahead — Yachats sells out for the Fourth.)",
    "tags": ["rest", "kid", "scenic"],
    "gfrom": "Yachats, OR",
    "gto": "Cape Perpetua, Yachats, OR",
    "gvia": "Heceta Head Lighthouse, OR|Sea Lion Caves, OR",
    "poi": [
      {
        "name": "Yachats 4th of July",
        "what": "The village's beloved, tongue-in-cheek La De Da Parade by day and fireworks over the bay at night — small-town Americana at its best.",
        "q": "Yachats, OR",
        "slot": "activity",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Yachats.jpg/960px-Yachats.jpg",
        "wiki": "https://en.wikipedia.org/wiki/Yachats,_Oregon",
        "it": ["kid", "history", "coast"],
        "kid": true
      },
      {
        "name": "Thor's Well & Cape Perpetua",
        "what": "The Pacific drains into a churning sinkhole at Thor's Well, with Devil's Churn and Spouting Horn nearby and the coast's highest overlook above — Cape Perpetua's signature scenery.",
        "q": "Cape Perpetua, Yachats, OR",
        "slot": "scenic",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Thor%27s_Well_%2837402149210%29.jpg/960px-Thor%27s_Well_%2837402149210%29.jpg",
        "wiki": "https://en.wikipedia.org/wiki/Cape_Perpetua",
        "it": ["scenic", "coast"]
      },
      {
        "name": "Heceta Head Lighthouse",
        "what": "One of the most photographed lighthouses in the United States, glowing white on its forested headland.",
        "q": "Heceta Head Lighthouse, OR",
        "slot": "scenic",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/HecetaHeadLighthouse.jpg/960px-HecetaHeadLighthouse.jpg",
        "wiki": "https://en.wikipedia.org/wiki/Heceta_Head_Light",
        "it": ["lighthouse", "scenic", "coast"]
      },
      {
        "name": "Sea Lion Caves",
        "what": "An elevator down to America's largest sea cave, home to a wild Steller sea lion colony — a memorable kid stop.",
        "q": "Sea Lion Caves, OR",
        "slot": "activity",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Sea_Lion_Caves_-_Oregon_Coast_%282369843472%29.jpg/960px-Sea_Lion_Caves_-_Oregon_Coast_%282369843472%29.jpg",
        "wiki": "https://en.wikipedia.org/wiki/Sea_Lion_Caves",
        "it": ["wildlife", "kid"],
        "kid": true
      },
      {
        "name": "804 Trail & tide pools",
        "what": "An easy oceanfront path along the basalt shelf right from the village, with some of the coast's best tide pools at low tide.",
        "q": "804 Trail, Yachats, OR",
        "slot": "scenic",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/OREGON_COAST_-_CLEAR_TIDE_POOL_2024.jpg/960px-OREGON_COAST_-_CLEAR_TIDE_POOL_2024.jpg",
        "it": ["coast", "wildlife"]
      }
    ],
    "foodTrail": [
      {
        "style": "Wild Pacific seafood & chowder",
        "shop": "Luna Sea Fish House",
        "shopUrl": "https://www.google.com/maps/search/?api=1&query=Luna%20Sea%20Fish%20House%20Yachats%20OR",
        "city": "Yachats",
        "slot": "dinner"
      }
    ],
    "eats": [
      {
        "slot": "breakfast",
        "area": "Yachats",
        "picks": [
          {
            "name": "Green Salmon Coffee Company",
            "cuisine": "coffee house, pastries & breakfast",
            "rating": 4.5,
            "why": "Ruslan & Galiya — the town's beloved organic coffee + scratch baked goods to fuel the morning loop",
            "kid": false,
            "map": "https://maps.google.com/?cid=15236297694368532859",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Caffe_Latte_cup.jpg/960px-Caffe_Latte_cup.jpg"
          },
          {
            "name": "Bread & Roses Bakery",
            "cuisine": "bakery — pastries, sticky buns, plain rolls",
            "rating": 4.6,
            "why": "Aslan — simple sweet pastry and plain bread he'll happily eat; grab extras for the trail",
            "kid": true,
            "map": "https://maps.google.com/?cid=10779718063421500113",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Honey_Run_Covered_Bridge_2024_Pancake_Breakfast-104A2111.jpg/960px-Honey_Run_Covered_Bridge_2024_Pancake_Breakfast-104A2111.jpg"
          }
        ]
      },
      {
        "slot": "lunch",
        "area": "Cape Perpetua / Yachats (picnic or cafe)",
        "picks": [
          {
            "name": "Beach Street Kitchen",
            "cuisine": "casual cafe — sandwiches, salads, soups",
            "rating": 4.7,
            "why": "Galiya — fresh, well-rated lunch in town; great to grab before or after the parade",
            "kid": false,
            "map": "https://maps.google.com/?cid=9912055002029852844",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Cup_of_clam_chowder%2C_with_saltines.jpg/960px-Cup_of_clam_chowder%2C_with_saltines.jpg"
          },
          {
            "name": "The Village Bean",
            "cuisine": "coffee shop — paninis, bagels, grab-and-go",
            "rating": 4.5,
            "why": "Aslan — easy bagel/grilled-cheese-style picks and a picnic to take up to Cape Perpetua; plain and predictable",
            "kid": true,
            "map": "https://maps.google.com/?cid=4628231565601770751",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Caffe_Latte_cup.jpg/960px-Caffe_Latte_cup.jpg"
          }
        ]
      },
      {
        "slot": "dinner",
        "area": "Yachats",
        "picks": [
          {
            "name": "Ona Restaurant & Lounge",
            "cuisine": "Pacific Northwest seafood, riverfront",
            "rating": 4.3,
            "why": "Galiya — Yachats' standout fine-casual spot, local fish on the Yachats River; book ahead on the 4th",
            "kid": false,
            "map": "https://maps.google.com/?cid=130354226211525660",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Fish_and_chips_plate_with_peas.jpg/960px-Fish_and_chips_plate_with_peas.jpg"
          },
          {
            "name": "The Drift Inn Hotel and Restaurant",
            "cuisine": "American comfort food & seafood, live music",
            "rating": 4.3,
            "why": "Whole family — big varied menu, lively holiday vibe, and a kids' menu with burgers, mac & cheese and chicken strips for Aslan",
            "kid": true,
            "map": "https://maps.google.com/?cid=15878405420698897937",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Cheeseburger_and_Fries_2.jpg/960px-Cheeseburger_and_Fries_2.jpg"
          },
          {
            "name": "Luna Sea Fish House (Seal Rock)",
            "cuisine": "dockside fish & chips, chowder",
            "rating": 4.5,
            "why": "Ruslan — own-boat-caught fish & chips a short ride north; casual, fast, and Aslan-friendly fries & plain fish",
            "kid": true,
            "map": "https://maps.google.com/?cid=14291681410554983807",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Fish_and_chips_plate_with_peas.jpg/960px-Fish_and_chips_plate_with_peas.jpg"
          }
        ]
      }
    ],
    "localTodo": [
      {
        "time": "~08:30",
        "name": "Cape Perpetua & Thor's Well",
        "what": "Short drive south for the headland viewpoint, Thor's Well and the Spouting Horn at the right tide; easy boardwalk options for Aslan. Beat the holiday crowds early.",
        "map": "https://www.google.com/maps/search/?api=1&query=Cape+Perpetua+Scenic+Area+Yachats+Oregon"
      },
      {
        "time": "~09:30",
        "name": "Heceta Head Lighthouse & Sea Lion Caves",
        "what": "Postcard lighthouse and the sea-lion sea cave just south on 101 — a kid hit. Both are short stops, back in town before the parade.",
        "map": "https://www.google.com/maps/search/?api=1&query=Heceta+Head+Lighthouse+Oregon"
      },
      {
        "time": "~12:00",
        "name": "La De Da Parade",
        "what": "Yachats' famously quirky Fourth of July parade marches up Hwy 101 through downtown at noon — grab a curb spot 15-20 min early. Treats, games, art and live music around town before and after.",
        "map": "https://www.google.com/maps/search/?api=1&query=Yachats+Oregon+downtown+Highway+101"
      },
      {
        "time": "~15:00",
        "name": "804 Trail & tide pools",
        "what": "Flat, stroller-easy oceanfront path along the bluff with tide pools at low tide — perfect afternoon leg-stretch for the family.",
        "map": "https://www.google.com/maps/search/?api=1&query=Yachats+804+Trail"
      },
      {
        "time": "~22:00",
        "name": "Fireworks over Yachats Bay",
        "what": "Fireworks launch over the mouth of the Yachats River at dusk (~10 PM in early July). Watch from the 804 Trail, the bayfront or Yachats Commons; bring a blanket and a jacket — coast nights are cold.",
        "map": "https://www.google.com/maps/search/?api=1&query=Yachats+Bay+Oregon"
      }
    ]
  },
{
    "d": 5,
    "id": "st-helens",
    "miles": 216,
    "dmin": 247,
    "rest": false,
    "region": "Coast → Cascades",
    "title": "Inland to the Volcano",
    "route": "Yachats → Alsea → Corvallis → cross the Columbia → Mount St. Helens",
    "desc": "The return turns inland and the scenery changes completely. Leave the coast on the quiet, twisting Alsea River road over the Coast Range to Corvallis and the Willamette Valley for lunch, then cross the Columbia back into Washington near Longview. This is the trip's longest transfer — paced with regular breaks — but the payoff is enormous: rolling up the Spirit Lake Highway into the blast zone of Mount St. Helens, the volcano that famously blew its top in 1980. Settle in at the Castle Rock / Silver Lake gateway, where the always-open Visitor Center tells the eruption story, and save the high viewpoints for tomorrow's short, easy morning.",
    "tags": ["ride", "scenic", "volcano"],
    "gfrom": "Yachats, OR",
    "gto": "Castle Rock, WA",
    "gvia": "Alsea, OR|Corvallis, OR|Longview, WA",
    "poi": [
      {
        "name": "Alsea River road",
        "what": "A gentle, scenic two-lane over the Coast Range along the Alsea River — the calm way off the coast and a lovely warm-up to the day's miles.",
        "q": "Alsea, OR",
        "slot": "scenic",
        "img": "https://upload.wikimedia.org/wikipedia/commons/c/ca/Cape_Perpetua_%285802047887%29.jpg",
        "it": ["scenic", "moto", "skill"]
      },
      {
        "name": "Corvallis",
        "what": "Willamette Valley lunch stop — a relaxed college town to break the long transfer roughly halfway.",
        "q": "Corvallis, OR",
        "slot": "lunch",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Coldwater_Lake_%282010-08-19%29%2C_04.jpg/960px-Coldwater_Lake_%282010-08-19%29%2C_04.jpg",
        "wiki": "https://en.wikipedia.org/wiki/Corvallis,_Oregon",
        "it": ["food"]
      },
      {
        "name": "Columbia River crossing",
        "what": "Recross the Columbia near Longview/Rainier back into Washington, leaving the coast behind for the Cascades.",
        "q": "Longview, WA",
        "slot": "stop",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Astoria-Megler_Bridge_from_West_Mooring_Basin_Docks.jpg/960px-Astoria-Megler_Bridge_from_West_Mooring_Basin_Docks.jpg",
        "it": ["scenic", "history"]
      },
      {
        "name": "Mount St. Helens Visitor Center",
        "what": "The always-open Visitor Center at Silver Lake — eruption exhibits, a walk-in model volcano and the first close look at the mountain. (Johnston Ridge Observatory remains closed since 2023.)",
        "q": "Mount St. Helens Visitor Center, Silver Lake, WA",
        "slot": "activity",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Mount_St._Helens_over_Spirit_Lake_Highway.jpg/960px-Mount_St._Helens_over_Spirit_Lake_Highway.jpg",
        "wiki": "https://en.wikipedia.org/wiki/Mount_St._Helens",
        "it": ["volcano", "kid", "scenic"],
        "kid": true
      }
    ],
    "eats": [
      {
        "slot": "breakfast",
        "area": "Yachats",
        "picks": [
          {
            "name": "Green Salmon Coffee Company",
            "cuisine": "coffee house / bakery breakfast",
            "rating": 4.5,
            "why": "Galiya & Ruslan — beloved Yachats roaster, pastries and a strong coffee for the long ride",
            "kid": false,
            "map": "https://maps.google.com/?cid=15236297694368532859",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Pancake_stack.jpg/330px-Pancake_stack.jpg"
          },
          {
            "name": "Beach Street Kitchen",
            "cuisine": "American breakfast / brunch",
            "rating": 4.7,
            "why": "Aslan — eggs, pancakes and plain toast he'll eat before a big day",
            "kid": true,
            "map": "https://maps.google.com/?cid=9912055002029852844",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Pancake_stack.jpg/330px-Pancake_stack.jpg"
          }
        ]
      },
      {
        "slot": "lunch",
        "area": "Corvallis",
        "picks": [
          {
            "name": "Swan Dive Sandwiches + Bar",
            "cuisine": "chef-driven sandwiches",
            "rating": 4.8,
            "why": "Galiya — inventive Willamette Valley sandwiches, top-rated downtown spot",
            "kid": false,
            "map": "https://maps.google.com/?cid=15979286481041514821",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Club-sandwich.jpg/330px-Club-sandwich.jpg"
          },
          {
            "name": "Block 15 Brewing Downtown Pub",
            "cuisine": "brewpub / American",
            "rating": 4.5,
            "why": "Ruslan — well-known Corvallis brewery with hearty pub plates",
            "kid": false,
            "map": "https://maps.google.com/?cid=5868937247190344687",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Cheeseburger.jpg/330px-Cheeseburger.jpg"
          },
          {
            "name": "Old World Deli",
            "cuisine": "deli sandwiches",
            "rating": 4.5,
            "why": "Aslan — simple grilled cheese / plain deli sandwich, casual and quick",
            "kid": true,
            "map": "https://maps.google.com/?cid=7965508546757815127",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Club-sandwich.jpg/330px-Club-sandwich.jpg"
          }
        ]
      },
      {
        "slot": "dinner",
        "area": "Castle Rock / Silver Lake / Toutle",
        "picks": [
          {
            "name": "Amaro's Table Castle Rock",
            "cuisine": "Pacific Northwest / American",
            "rating": 4.8,
            "why": "Galiya & Ruslan — the standout sit-down restaurant at the volcano gateway",
            "kid": false,
            "map": "https://maps.google.com/?cid=16172930673490403158",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Cheeseburger.jpg/330px-Cheeseburger.jpg"
          },
          {
            "name": "Peper's 49ER Restaurant",
            "cuisine": "classic American family diner",
            "rating": 4.2,
            "why": "Aslan — old-school diner with burgers, fries, grilled cheese and pancakes; reliable kid food",
            "kid": true,
            "map": "https://maps.google.com/?cid=4506938187642784906",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Cheeseburger.jpg/330px-Cheeseburger.jpg"
          },
          {
            "name": "El Compadre Restaurant",
            "cuisine": "Mexican",
            "rating": 4.4,
            "why": "whole family — generous, casual Mexican with plain rice/beans/quesadilla for Aslan",
            "kid": true,
            "map": "https://maps.google.com/?cid=17521742468811933775",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Mexican_cuisine_1.jpg/330px-Mexican_cuisine_1.jpg"
          }
        ]
      }
    ],
    "localTodo": [
      {
        "time": "~08:00",
        "name": "Yachats State Recreation Area",
        "what": "quick last look at the surf and tide pools before turning inland",
        "map": "https://www.google.com/maps/search/?api=1&query=Yachats+State+Recreation+Area"
      },
      {
        "time": "~10:30",
        "name": "Alsea Falls (short detour)",
        "what": "easy forest waterfall stop to stretch legs on the canyon run",
        "map": "https://www.google.com/maps/search/?api=1&query=Alsea+Falls+Recreation+Site+Oregon"
      },
      {
        "time": "~13:30",
        "name": "Oregon State University / downtown Corvallis",
        "what": "leafy college-town stroll after lunch",
        "map": "https://www.google.com/maps/search/?api=1&query=Oregon+State+University+Corvallis"
      },
      {
        "time": "~17:30",
        "name": "Mount St. Helens Visitor Center at Silver Lake",
        "what": "eruption story, models and a kid-friendly walk-through volcano (check closing time)",
        "map": "https://www.google.com/maps/search/?api=1&query=Mount+St.+Helens+Visitor+Center+Silver+Lake+WA"
      }
    ]
  },
{
    "d": 6,
    "id": "rainier",
    "miles": 153,
    "dmin": 180,
    "rest": false,
    "region": "Cascades",
    "title": "Spirit Lake & the Road to Rainier",
    "route": "Castle Rock → Spirit Lake Hwy viewpoints → US-12 → Packwood",
    "desc": "A deliberately short, relaxed day so the volcano gets a proper morning. Ride the rest of the Spirit Lake Highway up into the blast zone for the big roadside viewpoints over the crater, the recovering forest and Coldwater Lake (the upper road to Johnston Ridge is closed, so this is an out-and-back to the open viewpoints). Then drop back down and cross over on US-12 through Mossyrock and Morton to Packwood, the small mountain town that's the southern gateway to Mount Rainier — elk wander the meadows at the edge of town. Easy afternoon: rest up, because tomorrow is the grand finale ride home over the mountain.",
    "tags": ["ride", "volcano", "scenic", "kid"],
    "gfrom": "Castle Rock, WA",
    "gto": "Packwood, WA",
    "gvia": "Coldwater Lake, WA|Mossyrock, WA|Morton, WA",
    "poi": [
      {
        "name": "Spirit Lake Highway viewpoints",
        "what": "WA-504 climbs into the 1980 blast zone — sweeping pullouts at Hoffstadt Bluffs and beyond frame the crater and the regrowing forest.",
        "q": "Hoffstadt Bluffs, WA",
        "slot": "scenic",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Mt._St._Helens_and_Spirit_Lake%2C_Washington_%281292082798%29.jpg/960px-Mt._St._Helens_and_Spirit_Lake%2C_Washington_%281292082798%29.jpg",
        "wiki": "https://en.wikipedia.org/wiki/Spirit_Lake_(Washington)",
        "it": ["volcano", "scenic", "history"]
      },
      {
        "name": "Coldwater Lake",
        "what": "A lake born in the eruption, ringed by the blast zone — an easy boardwalk and the turnaround point of the morning's volcano spur.",
        "q": "Coldwater Lake, WA",
        "slot": "activity",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Coldwater_Lake_9015.jpg/960px-Coldwater_Lake_9015.jpg",
        "wiki": "https://en.wikipedia.org/wiki/Coldwater_Lake",
        "it": ["volcano", "scenic", "wildlife"],
        "kid": true
      },
      {
        "name": "Mount St. Helens",
        "what": "The truncated, steaming volcano itself, seen up close from the highway — a geology lesson a 6-year-old won't forget.",
        "q": "Mount St. Helens",
        "slot": "scenic",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/MSH80_eruption_mount_st_helens_05-18-80-dramatic-edit.jpg/960px-MSH80_eruption_mount_st_helens_05-18-80-dramatic-edit.jpg",
        "wiki": "https://en.wikipedia.org/wiki/Mount_St._Helens",
        "it": ["volcano", "scenic"]
      },
      {
        "name": "Packwood",
        "what": "A quiet US-12 mountain town and the south gateway to Mount Rainier — resident elk often graze the meadows at dusk.",
        "q": "Packwood, WA",
        "slot": "activity",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Mount_Rainier_and_lake_reflection.jpg/960px-Mount_Rainier_and_lake_reflection.jpg",
        "wiki": "https://en.wikipedia.org/wiki/Packwood,_Washington",
        "it": ["wildlife", "kid", "scenic"],
        "kid": true
      }
    ],
    "eats": [
      {
        "slot": "breakfast",
        "area": "Castle Rock",
        "picks": [
          {
            "name": "Peper's 49ER Restaurant",
            "cuisine": "American diner breakfast",
            "rating": 4.2,
            "why": "Galiya & Ruslan — hearty pre-ride diner plates; Aslan gets plain pancakes/eggs",
            "kid": true,
            "map": "https://maps.google.com/?cid=4506938187642784906",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Pancakes_%281%29.jpg/330px-Pancakes_%281%29.jpg"
          },
          {
            "name": "The Oasis Bar & Grill",
            "cuisine": "American bar & grill",
            "rating": 4.5,
            "why": "backup in town if Peper's is busy — fuel up before the SR-504 climb",
            "kid": true,
            "map": "https://maps.google.com/?cid=9411642080220914546"
          }
        ]
      },
      {
        "slot": "lunch",
        "area": "Mount St. Helens / Castle Rock (SR-504 junction)",
        "picks": [
          {
            "name": "Amaro's Table",
            "cuisine": "Pacific NW / American",
            "rating": 4.8,
            "why": "Galiya — best-rated kitchen right where Spirit Lake Hwy meets I-5, perfect after the viewpoints",
            "kid": true,
            "map": "https://maps.google.com/?cid=16172930673490403158",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Cheeseburger.jpg/330px-Cheeseburger.jpg"
          },
          {
            "name": "Lone Fir Cafe",
            "cuisine": "casual American diner",
            "rating": 4.4,
            "why": "Ruslan — classic volcano-country roadhouse if you loop down the Cougar side instead",
            "kid": true,
            "map": "https://maps.google.com/?cid=6753037004800324019"
          }
        ]
      },
      {
        "slot": "dinner",
        "area": "Packwood",
        "picks": [
          {
            "name": "Cliff Droppers",
            "cuisine": "burgers",
            "rating": 4.6,
            "why": "Galiya & Ruslan — Packwood's standout burger joint; Aslan gets a plain burger + fries",
            "kid": true,
            "map": "https://maps.google.com/?cid=1323618167841938218",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Cheeseburger.jpg/330px-Cheeseburger.jpg"
          },
          {
            "name": "Cruiser's Pizza",
            "cuisine": "pizza",
            "rating": 4.2,
            "why": "Aslan — easiest kid pick in town, plain cheese pizza; busiest/most-reviewed spot in Packwood",
            "kid": true,
            "map": "https://maps.google.com/?cid=5640658349503661047",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Pizza.jpg/330px-Pizza.jpg"
          },
          {
            "name": "Blue Spruce Saloon And Diner",
            "cuisine": "American saloon / diner",
            "rating": 4.3,
            "why": "Ruslan — hearty local saloon with a full diner menu and a beer after the ride",
            "kid": true,
            "map": "https://maps.google.com/?cid=3407359734120354488"
          }
        ]
      }
    ],
    "localTodo": [
      {
        "time": "~09:30",
        "name": "Coldwater Lake Recreation Area",
        "what": "calm lake formed by the 1980 eruption — short boardwalk, easy legs-stretch the whole family can do, big views back at the crater",
        "map": "https://www.google.com/maps/search/?api=1&query=Coldwater+Lake+Recreation+Area+Mount+St+Helens"
      },
      {
        "time": "~10:30",
        "name": "Johnston Ridge / Spirit Lake Hwy viewpoints",
        "what": "the dramatic end-of-road blast-zone overlooks straight into the crater (check road status — upper SR-504 has had closures); turn around where open",
        "map": "https://www.google.com/maps/search/?api=1&query=Spirit+Lake+Highway+viewpoint+Mount+St+Helens"
      },
      {
        "time": "~12:15",
        "name": "North Fork Survivors",
        "what": "quirky roadside stop with the volcano museum, a real ash-buried A-frame and a gift shop — easy souvenir win for Aslan",
        "map": "https://maps.google.com/?cid=11273759739720209341"
      },
      {
        "time": "~15:30",
        "name": "Mossyrock / Riffe Lake pull-off on US-12",
        "what": "scenic reservoir stop to break up the eastbound leg toward Packwood",
        "map": "https://www.google.com/maps/search/?api=1&query=Riffe+Lake+viewpoint+Mossyrock+WA"
      }
    ]
  },
{
    "d": 7,
    "id": "home",
    "miles": 165,
    "dmin": 247,
    "rest": false,
    "region": "Mount Rainier → Home",
    "title": "Over Rainier, Home",
    "route": "Packwood → Paradise → Chinook Pass → Enumclaw → Home",
    "desc": "The graduation ride. Climb into Mount Rainier National Park to Paradise, where July wildflower meadows spread beneath the glaciers and Myrtle Falls frames the peak. Drop along Stevens Canyon past Reflection Lakes and Narada Falls, then up over Chinook Pass (5,430 ft) at Tipsoo Lake — a spectacular, low-speed alpine pass and the most rewarding riding of the trip, a fitting capstone for a brand-new rider. Descend the eastern flank to Enumclaw for a celebratory lunch, then quiet roads home to Woodinville. Seven days, a ferry, the whole Oregon coast, a volcano and a mountain pass — and a rider who left a beginner and came home a tourer.",
    "tags": ["ride", "moto", "scenic", "kid"],
    "gfrom": "Packwood, WA",
    "gto": "Woodinville, WA",
    "gvia": "Paradise, Mount Rainier National Park, WA|Reflection Lakes, Mount Rainier, WA|Tipsoo Lake, WA|Enumclaw, WA",
    "poi": [
      {
        "name": "Paradise, Mount Rainier",
        "what": "The park's famous subalpine meadow — peak July wildflowers, the Skyline Trail and Myrtle Falls with Rainier towering behind.",
        "q": "Paradise, Mount Rainier National Park, WA",
        "slot": "activity",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Myrtle_Falls_and_Mount_Rainier.jpg/960px-Myrtle_Falls_and_Mount_Rainier.jpg",
        "wiki": "https://en.wikipedia.org/wiki/Paradise,_Mount_Rainier_National_Park",
        "it": ["scenic", "wildlife"],
        "kid": true
      },
      {
        "name": "Reflection Lakes",
        "what": "Mount Rainier mirrored in still tarns right beside Stevens Canyon Road — the classic postcard stop.",
        "q": "Reflection Lakes, Mount Rainier, WA",
        "slot": "scenic",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Reflection_Lakes%2C_Mt_Rainier_%2848656886908%29.jpg/960px-Reflection_Lakes%2C_Mt_Rainier_%2848656886908%29.jpg",
        "wiki": "https://en.wikipedia.org/wiki/Mount_Rainier_National_Park",
        "it": ["scenic", "moto"]
      },
      {
        "name": "Narada Falls",
        "what": "A 168-foot waterfall a few steps from the road, often hung with rainbows in the spray.",
        "q": "Narada Falls, Mount Rainier, WA",
        "slot": "scenic",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Narada_Falls.jpg/960px-Narada_Falls.jpg",
        "wiki": "https://en.wikipedia.org/wiki/Narada_Falls",
        "it": ["scenic", "moto"]
      },
      {
        "name": "Tipsoo Lake & Chinook Pass",
        "what": "The alpine high point — a wildflower-rimmed lake at 5,430 ft on the dramatic, sweeping Chinook Pass (WA-410). The ride of the trip.",
        "q": "Tipsoo Lake, WA",
        "slot": "scenic",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Tipsoo_Lake_wildflowers_-_48607493656.jpg/960px-Tipsoo_Lake_wildflowers_-_48607493656.jpg",
        "wiki": "https://en.wikipedia.org/wiki/Chinook_Pass",
        "it": ["moto", "scenic"]
      },
      {
        "name": "Enumclaw",
        "what": "Descend the east side for a celebration lunch in the farm town below Rainier, then the easy run home.",
        "q": "Enumclaw, WA",
        "slot": "lunch",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Mount_Rainier_from_above_Myrtle_Falls_in_August.JPG/960px-Mount_Rainier_from_above_Myrtle_Falls_in_August.JPG",
        "wiki": "https://en.wikipedia.org/wiki/Enumclaw,_Washington",
        "it": ["food"]
      },
      {
        "name": "Home — Woodinville",
        "what": "Back where it started — bikes parked, a 6-year-old asleep, and a brand-new rider who is now a tourer.",
        "q": "Woodinville, WA",
        "slot": "activity",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Edmonds_Ferry_from_Edmonds_Beach_-_Edmonds_Washington.jpg/960px-Edmonds_Ferry_from_Edmonds_Beach_-_Edmonds_Washington.jpg",
        "it": ["skill"]
      }
    ],
    "eats": [
      {
        "slot": "coffee",
        "area": "Packwood",
        "picks": [
          {
            "name": "Mountain Goat Coffee",
            "cuisine": "espresso bar / breakfast pastries",
            "rating": 4.6,
            "why": "Ruslan & Galiya — strong PNW coffee before the park; the standout fuel stop in town",
            "kid": false,
            "map": "https://maps.google.com/?cid=2351003668736349144",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Latte.jpg/330px-Latte.jpg"
          },
          {
            "name": "Base Camp Coffee",
            "cuisine": "drive-up coffee stand",
            "rating": 4.7,
            "why": "Aslan — quick hot cocoa / muffin and a no-fuss stop on the way out",
            "kid": true,
            "map": "https://maps.google.com/?cid=7730475893704290194",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Pancakes.jpg/330px-Pancakes.jpg"
          }
        ]
      },
      {
        "slot": "lunch",
        "area": "Enumclaw",
        "picks": [
          {
            "name": "Casting Iron",
            "cuisine": "scratch bar & grill (PNW comfort food)",
            "rating": 4.7,
            "why": "Galiya & Ruslan — top-rated celebration lunch to toast finishing the tour",
            "kid": false,
            "map": "https://maps.google.com/?cid=10184653972172552891",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Cheeseburger.jpg/330px-Cheeseburger.jpg"
          },
          {
            "name": "Burger Buds",
            "cuisine": "smash burgers & fries",
            "rating": 4.9,
            "why": "Aslan — plain burger, fries and a milkshake he'll actually eat; highest-rated spot in town",
            "kid": true,
            "map": "https://maps.google.com/?cid=6820249718495195552",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/French_Fries.jpg/330px-French_Fries.jpg"
          },
          {
            "name": "The Historic Mint Restaurant & Alehouse",
            "cuisine": "American pub / family alehouse",
            "rating": 4.3,
            "why": "whole family — roomy historic spot with a kids menu and burgers, good fallback if there's a wait",
            "kid": true,
            "map": "https://maps.google.com/?cid=11528093723048268309",
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Cheeseburger.jpg/330px-Cheeseburger.jpg"
          }
        ]
      }
    ],
    "localTodo": [
      {
        "time": "~09:30",
        "name": "Paradise, Mount Rainier NP",
        "what": "peak-summer subalpine wildflower meadows under the mountain; short stroll on the Skyline/Nisqually Vista paths",
        "map": "https://www.google.com/maps/search/?api=1&query=Paradise+Mount+Rainier+National+Park"
      },
      {
        "time": "~10:30",
        "name": "Reflection Lakes",
        "what": "classic mirror view of Rainier just off Stevens Canyon Rd — a quick photo pull-out the whole family will love",
        "map": "https://www.google.com/maps/search/?api=1&query=Reflection+Lakes+Mount+Rainier"
      },
      {
        "time": "~11:00",
        "name": "Narada Falls",
        "what": "168-ft falls with a short, kid-doable viewpoint walk; mist and rainbows on a sunny day",
        "map": "https://www.google.com/maps/search/?api=1&query=Narada+Falls+Mount+Rainier"
      },
      {
        "time": "~12:00",
        "name": "Chinook Pass (SR-410)",
        "what": "5,430-ft pass and one of the best motorcycle roads in the state — the grand finale ride down toward Enumclaw",
        "map": "https://www.google.com/maps/search/?api=1&query=Chinook+Pass+SR-410"
      }
    ]
  }
];

/* Themed 'Coast Food Trail' foodie thread for Galiya;
   rendered as a section on index.html and a 🦀 flag on the matching day pages. */
window.FOOD_TRAIL = {
  "title": "The Coast Food Trail",
  "subtitle": "a foodie thread for Galiya",
  "intro": "The Pacific Northwest coast is one long seafood counter, and this ride threads its greatest hits — pulled-that-morning Dungeness crab, creamy clam chowder, beer-battered halibut, and the cheese-and-ice-cream pilgrimage at Tillamook. Four can't-miss stops, one per day down the coast.",
  "note": "<b>Notes:</b> hours stretch and lines grow over the Fourth-of-July weekend — go early, and have a backup pick. All links open Google Maps.",
  "bookend": "",
  "stops": [
    {
      "n": 1,
      "day": 1,
      "slot": "dinner",
      "city": "Westport",
      "pref": "WA Coast",
      "style": "Dungeness crab & fish-and-chips",
      "styleDesc": "Off-the-boat Dungeness crab, razor clams and beer-battered fish at the working marina where it's landed.",
      "shop": "Bennett's Fish Shack",
      "shopUrl": "https://www.google.com/maps/search/?api=1&query=Bennett%27s%20Fish%20Shack%20Westport%20WA",
      "shopNote": "the classic harbour fish-and-chips stop",
      "alts": [
        {
          "l": "Merino's Seafood Market",
          "u": "https://www.google.com/maps/search/?api=1&query=Merino%27s%20Seafood%20Market%20Westport%20WA"
        },
        {
          "l": "Half Moon Bay Bar & Grill",
          "u": "https://www.google.com/maps/search/?api=1&query=Half%20Moon%20Bay%20Bar%20and%20Grill%20Westport%20WA"
        }
      ],
      "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Boat_entering_harbor_at_Westport%2C_WA.jpg/960px-Boat_entering_harbor_at_Westport%2C_WA.jpg"
    },
    {
      "n": 2,
      "day": 2,
      "slot": "lunch",
      "city": "Astoria",
      "pref": "OR Coast",
      "style": "Beer-battered fish & craft beer",
      "styleDesc": "A legendary fish-and-chips trailer and the riverfront brewpubs that put Astoria on the beer map.",
      "shop": "Bowpicker Fish & Chips",
      "shopUrl": "https://www.google.com/maps/search/?api=1&query=Bowpicker%20Fish%20and%20Chips%20Astoria%20OR",
      "shopNote": "albacore tuna & chips from a boat-turned-food-stand",
      "alts": [
        {
          "l": "Buoy Beer Co.",
          "u": "https://www.google.com/maps/search/?api=1&query=Buoy%20Beer%20Company%20Astoria%20OR"
        },
        {
          "l": "Fort George Brewery",
          "u": "https://www.google.com/maps/search/?api=1&query=Fort%20George%20Brewery%20Astoria%20OR"
        }
      ],
      "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Downtown_Astoria_-_Commercial_St_with_former_Hotel_Astoria.jpg/960px-Downtown_Astoria_-_Commercial_St_with_former_Hotel_Astoria.jpg"
    },
    {
      "n": 3,
      "day": 3,
      "slot": "lunch",
      "city": "Tillamook",
      "pref": "OR Coast",
      "style": "Tillamook cheese & ice cream",
      "styleDesc": "The marquee foodie-and-kid stop: a free cheese-factory viewing gallery, squeaky-fresh curds and the famous ice-cream counter.",
      "shop": "Tillamook Creamery",
      "shopUrl": "https://www.google.com/maps/search/?api=1&query=Tillamook%20Creamery%20Tillamook%20OR",
      "shopNote": "free self-guided tour + ice cream",
      "alts": [
        {
          "l": "Blue Heron French Cheese Co.",
          "u": "https://www.google.com/maps/search/?api=1&query=Blue%20Heron%20French%20Cheese%20Company%20Tillamook%20OR"
        },
        {
          "l": "Pelican Brewing, Pacific City",
          "u": "https://www.google.com/maps/search/?api=1&query=Pelican%20Brewing%20Pacific%20City%20OR"
        }
      ],
      "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Tillamook_Cheese_Factory_ice_cream_stall%2C_Tillamook%2C_2011.jpg/960px-Tillamook_Cheese_Factory_ice_cream_stall%2C_Tillamook%2C_2011.jpg"
    },
    {
      "n": 4,
      "day": 4,
      "slot": "dinner",
      "city": "Yachats",
      "pref": "OR Coast",
      "style": "Wild Pacific seafood & chowder",
      "styleDesc": "Tiny Yachats punches far above its weight — fresh-caught seafood, award-winning chowder and a beloved brewpub, the reward of the two-night base.",
      "shop": "Luna Sea Fish House",
      "shopUrl": "https://www.google.com/maps/search/?api=1&query=Luna%20Sea%20Fish%20House%20Yachats%20OR",
      "shopNote": "dock-to-table fish-and-chips & chowder",
      "alts": [
        {
          "l": "Yachats Brewing + Farmstore",
          "u": "https://www.google.com/maps/search/?api=1&query=Yachats%20Brewing%20Farmstore%20Yachats%20OR"
        },
        { "l": "Ona Restaurant", "u": "https://www.google.com/maps/search/?api=1&query=Ona%20Restaurant%20Yachats%20OR" }
      ],
      "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Yachats.jpg/960px-Yachats.jpg"
    }
  ]
};

/* Pre-trip preparation checklist (rendered by checklist.html). */
window.CHECKLIST = [
  {
    "sec": "Documents & licences",
    "icon": "📄",
    "items": [
      "Washington motorcycle endorsement on each rider's licence (Galiya's is brand-new — keep it on you)",
      "Vehicle registration + proof of insurance for BOTH bikes (W230 and R1300GS)",
      "Roadside-assistance card (AAA or your insurer's moto plan)",
      "America the Beautiful annual pass OR cash/card for the Mount Rainier park entry",
      "Credit card + some backup cash; digital + paper copies of the key documents"
    ]
  },
  {
    "sec": "The bikes — pre-trip prep",
    "icon": "🏍️",
    "items": [
      "Full service before departure: oil, brakes, and the W230's chain tension & lube",
      "Tyres checked for tread and set to pressure (both bikes, two-up loads)",
      "Plan fuel around the W230's small (~3.4 gal) tank — top up at every reasonable stop",
      "Luggage fitted and packed light — top-box/panniers/dry bags, nothing loose",
      "Intercoms paired, phone mounts and chargers fitted, a shakedown ride loaded"
    ]
  },
  {
    "sec": "Child-pillion setup (Aslan on the GS)",
    "icon": "🧒",
    "items": [
      "Properly fitting child motorcycle helmet (correct shell size, not an adult hand-me-down)",
      "Armoured jacket, gloves, pants and boots that fit; ear protection",
      "Feet reach the passenger pegs (lowered/peg brackets if needed)",
      "Passenger backrest / top-box backrest so he can't slide rearward",
      "Grab rail or grab strap at the waist; a child–adult tether is reassuring",
      "Intercom for Aslan; snacks, water, sun hat and a comfort item",
      "Plan stops every 60–90 minutes; never ride him overtired or after dark"
    ]
  },
  {
    "sec": "Ferry & passes",
    "icon": "⛴️",
    "items": [
      "Edmonds–Kingston ferry — no reservation needed for motorcycles; arrive 20–30 min early (bikes load first)",
      "Confirm Chinook Pass (SR-410) is open (WSDOT) for the Day-7 ride home",
      "Check the Mount Rainier National Park timed-entry reservation system for summer (Paradise corridor)",
      "Note that the Spirit Lake Hwy upper road / Johnston Ridge is closed — plan the viewpoint out-and-back"
    ]
  },
  {
    "sec": "Lodging",
    "icon": "🏨",
    "items": [
      "Book all six nights — Westport, Astoria, Yachats (×2), Castle Rock/Silver Lake, Packwood",
      "Book the Yachats stay FAR ahead — the coast sells out for the Fourth of July",
      "Confirm secure motorcycle parking + family/passenger rules at every property before booking",
      "Family room / beds; ask about laundry mid-trip if wanted"
    ]
  },
  {
    "sec": "Rider gear & packing",
    "icon": "🧥",
    "items": [
      "Armoured jacket & pants, gloves, riding boots (each rider)",
      "Rain layers AND warm base layers — coastal fog/wind and alpine chill at Chinook Pass",
      "Sun protection, earplugs, neck tube",
      "Pack light — soft luggage / dry bags",
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
    "sec": "Insurance & health",
    "icon": "🛡️",
    "items": [
      "Motorcycle insurance current on both bikes (passenger cover for Aslan)",
      "Roadside-assistance / breakdown cover",
      "Personal medications + small first-aid kit",
      "Note nearest hospitals on route (Aberdeen, Astoria, Newport, Morton/Packwood, Enumclaw)"
    ]
  },
  {
    "sec": "Money & connectivity",
    "icon": "📱",
    "items": [
      "Cards + some cash — small coast and mountain towns can be cash-friendly",
      "Download offline Google Maps for the coast and the Cascades (cell is spotty)",
      "Share the live route/plan with family back home"
    ]
  },
  {
    "sec": "Final day before",
    "icon": "✅",
    "items": [
      "Check the forecast and the Chinook Pass / Mount Rainier status",
      "Fuel both bikes and do the child-pillion setup test",
      "Charge intercoms, phones, cameras, power banks",
      "Final gear + luggage check; confirm the Day-1 ferry timing",
      "Get a good night's sleep — Day 1 starts with the ferry"
    ]
  }
];

/* Geocoded routing points (lat,lng) so Google Maps always resolves them. */
window.GEO = {
  "Woodinville, WA": "47.75530,-122.13389",
  "Edmonds Ferry Terminal, Edmonds, WA": "47.81298,-122.38424",
  "Hama Hama Oyster Saloon, Lilliwaup, WA": "47.54235,-123.04071",
  "Hoodsport, WA": "47.40636,-123.14058",
  "Aberdeen, WA": "46.97537,-123.81572",
  "Westport, WA": "46.89009,-124.10406",
  "Grays Harbor Lighthouse, Westport, WA": "46.88839,-124.11689",
  "Westhaven State Park, Westport, WA": "46.89565,-124.11964",
  "Raymond, WA": "46.68649,-123.73294",
  "South Bend, WA": "46.66315,-123.80461",
  "Long Beach, WA": "46.35232,-124.05432",
  "Cape Disappointment State Park, WA": "46.29955,-124.06538",
  "Astoria-Megler Bridge": "46.21577,-123.86221",
  "Astoria, OR": "46.18788,-123.83125",
  "Astoria Column, Astoria, OR": "46.18132,-123.81751",
  "Columbia River Maritime Museum, Astoria, OR": "46.18988,-123.82360",
  "Cannon Beach, OR": "45.89177,-123.96153",
  "Haystack Rock, Cannon Beach, OR": "45.88412,-123.96848",
  "Ecola State Park, OR": "45.91994,-123.96968",
  "Tillamook Creamery, Tillamook, OR": "45.48398,-123.84425",
  "Tillamook Air Museum, Tillamook, OR": "45.42073,-123.80360",
  "Cape Meares Lighthouse, OR": "45.48645,-123.97832",
  "Pacific City, OR": "45.20233,-123.96289",
  "Cape Kiwanda, Pacific City, OR": "45.21528,-123.96958",
  "Oregon Coast Aquarium, Newport, OR": "44.61765,-124.04725",
  "Newport, OR": "44.63678,-124.05345",
  "Yachats, OR": "44.31123,-124.10484",
  "Cape Perpetua, Yachats, OR": "44.28111,-124.10028",
  "Heceta Head Lighthouse, OR": "44.13738,-124.12812",
  "Sea Lion Caves, OR": "44.12178,-124.12671",
  "804 Trail, Yachats, OR": "44.32335,-124.10541",
  "Alsea, OR": "44.38189,-123.59707",
  "Corvallis, OR": "44.56464,-123.26196",
  "Longview, WA": "46.13817,-122.93817",
  "Castle Rock, WA": "46.27511,-122.90761",
  "Mount St. Helens Visitor Center, Silver Lake, WA": "46.29449,-122.82215",
  "Mount St. Helens": "46.19120,-122.19440",
  "Hoffstadt Bluffs, WA": "46.37370,-122.55860",
  "Coldwater Lake, WA": "46.29565,-122.25224",
  "Mossyrock, WA": "46.52955,-122.48511",
  "Morton, WA": "46.55844,-122.27510",
  "Packwood, WA": "46.60733,-121.67058",
  "Paradise, Mount Rainier National Park, WA": "46.78532,-121.73497",
  "Reflection Lakes, Mount Rainier, WA": "46.76950,-121.73200",
  "Narada Falls, Mount Rainier, WA": "46.77490,-121.74618",
  "Tipsoo Lake, WA": "46.86911,-121.51747",
  "Enumclaw, WA": "47.20427,-121.99150"
};

/* Region-matched scenic photos used as each day's hero artwork (verified). */
window.DAYART = {
  "1": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Edmonds_Ferry%2C_Olympic_Mountains.jpg/960px-Edmonds_Ferry%2C_Olympic_Mountains.jpg",
  "2": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Haystack_Rock%2C_Cannon_Beach%2C_Oregon%2C_USA%2C_14_Aug_2025.jpg/960px-Haystack_Rock%2C_Cannon_Beach%2C_Oregon%2C_USA%2C_14_Aug_2025.jpg",
  "3": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Haystack_Rock%2C_Cannon_Beach%2C_Oregon%2C_USA%2C_14_Aug_2025.jpg/960px-Haystack_Rock%2C_Cannon_Beach%2C_Oregon%2C_USA%2C_14_Aug_2025.jpg",
  "4": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Thor%27s_Well_%2837402149210%29.jpg/960px-Thor%27s_Well_%2837402149210%29.jpg",
  "5": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/MSH80_eruption_mount_st_helens_05-18-80-dramatic-edit.jpg/960px-MSH80_eruption_mount_st_helens_05-18-80-dramatic-edit.jpg",
  "6": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Mount_St._Helens_over_Spirit_Lake_Highway.jpg/960px-Mount_St._Helens_over_Spirit_Lake_Highway.jpg",
  "7": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Tipsoo_Lake_wildflowers_-_48607493656.jpg/960px-Tipsoo_Lake_wildflowers_-_48607493656.jpg"
};
