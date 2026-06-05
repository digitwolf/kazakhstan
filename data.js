/* ============================================================
   Japan Family Motorcycle Tour — destination data
   Shared by index.html and place.html
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
/* Build a Google Maps Embed directions URL (start → stops → end). */
window.gmapEmbedDir = function (origin, dest, waypoints) {
  let u = "https://www.google.com/maps/embed/v1/directions?key=" + window.GMAPS_KEY +
    "&origin=" + encodeURIComponent(origin) + "&destination=" + encodeURIComponent(dest) + "&mode=driving";
  if (waypoints && waypoints.length) u += "&waypoints=" + encodeURIComponent(waypoints.join("|"));
  return u;
};
/* Build a Google Maps Embed place URL. */
window.gmapEmbedPlace = function (q, zoom) {
  return "https://www.google.com/maps/embed/v1/place?key=" + window.GMAPS_KEY +
    "&q=" + encodeURIComponent(q) + (zoom ? "&zoom=" + zoom : "");
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
  id: "yokohama",
  name: "Tokyo / Yokohama",
  jp: "横浜",
  region: "Kanto",
  type: "start",
  days: "Day 1",
  legMiles: 0,
  lat: 35.4548, lng: 139.6317, zoom: 12,
  tagline: "Bike pickup & gear check — the journey begins by the harbour.",
  intro: [
    "Most one-way motorcycle rentals begin in the Tokyo/Yokohama area. Yokohama is a relaxed, open city to start in — wide roads, an easy waterfront, and far less stressful than central Tokyo for the first ride.",
    "Use Day 1 to fit the child's gear, pair the intercoms, balance the luggage, and do a gentle shakedown ride before pointing the bikes toward the mountains."
  ],
  highlights: [
    "Minato Mirai 21 waterfront and the Cosmo Clock ferris wheel",
    "Cup Noodles Museum — a genuine hit with kids",
    "Sankeien Garden for a calm first evening",
    "Akarenga (Red Brick) Warehouse for dinner by the bay",
    "teamLab Planets TOKYO (Toyosu) — immersive digital art, pure magic for a 6-year-old ⭐",
    "Nintendo Tokyo at Shibuya Parco — flagship store and a kid highlight ⭐",
    "Sensō-ji temple & Nakamise shopping street, Asakusa",
    "Meiji Jingu shrine and the famous Shibuya Crossing",
    "Daikanyama T-Site — a relaxed books-and-coffee browse"
  ],
  food: [
    { n: "Yokohama Chinatown", d: "Japan's largest Chinatown — steamed buns and family-friendly dim sum." },
    { n: "Iekei ramen", d: "Yokohama's rich soy-and-pork-bone ramen style, born here." },
    { n: "Sanma-men", d: "Local stir-fried-vegetable noodle dish unique to the city." },
    { n: "Asakusa Monja (Kanoya Hanare)", d: "Cook-your-own monjayaki on a Tokyo table griddle — fun for kids." },
    { n: "WABISABI yakiniku", d: "Grill-at-your-table wagyu in Tokyo — a family-friendly splurge." },
    { n: "Sushi Take Uehara", d: "A top Tokyo omakase highlight (¥10,000+, reserve well ahead)." }
  ],
  hotels: [
    { n: "InterContinental Yokohama Grand", t: "Nice hotel", d: "Bay views, valet/garage parking — confirm motorcycle space.", price: "¥18,000–35,000" },
    { n: "Navios Yokohama", t: "Family-friendly", d: "Simple harbourside hotel, walkable to attractions.", price: "¥18,000–35,000" },
    { n: "Royal Park Hotel Iconic Tokyo Shiodome", t: "Nice hotel", d: "Central Tokyo (Shiodome) — handy for a family city day before or after the ride.", price: "¥25,000–45,000" },
    { n: "Toyoko Inn / APA (Shin-Yokohama)", t: "Practical", d: "Reliable budget chains near the rental areas; ask about bike parking.", price: "¥9,000–16,000" }
  ],
  links: [
    { l: "Yokohama Official Visitors' Guide", u: "https://www.yokohamajapan.com/" },
    { l: "Wikipedia — Yokohama", u: "https://en.wikipedia.org/wiki/Yokohama" }
  ],
  photos: [
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/JP-Yokohama-_Minato-Mirai-Area-Over-View.jpg/960px-JP-Yokohama-_Minato-Mirai-Area-Over-View.jpg", cap: "Minato Mirai 21 waterfront" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/070203_MM21%26FUJI.jpg/960px-070203_MM21%26FUJI.jpg", cap: "View" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Yokohama_Chinatown_3.jpg/960px-Yokohama_Chinatown_3.jpg", cap: "Yokohama Chinatown" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Sankei-en_-_Kanagawa_-_Sept_5_2021_various_00_03_17_467000.jpeg/960px-Sankei-en_-_Kanagawa_-_Sept_5_2021_various_00_03_17_467000.jpeg", cap: "Sankei-en - Kanagawa - Sept 5 various" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/20250101_Minato_Mirai_21_%28Landmark_Tower%2C_Queen%27s_Square_Yokohama%2C_Pacifico_Yokohama%2C_InterContinental_Yokohama_Grand%29_122135.jpg/960px-20250101_Minato_Mirai_21_%28Landmark_Tower%2C_Queen%27s_Square_Yokohama%2C_Pacifico_Yokohama%2C_InterContinental_Yokohama_Grand%29_122135.jpg", cap: "Minato Mirai 21 (Landmark Tower, Queen's Square Yokohama, Pacif…" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Sankei-en_20221127-1.jpg/960px-Sankei-en_20221127-1.jpg", cap: "View" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Minato_Mirai_-_Yokohama_Skyline_March_2025.jpg/960px-Minato_Mirai_-_Yokohama_Skyline_March_2025.jpg", cap: "Minato Mirai - Yokohama Skyline March" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/4/4e/Sankei-en_Gardens%2C_Yokohama_%28%E6%A8%AA%E6%B5%9C_%E4%B8%89%E6%BA%AA%E5%9C%92%29_circa_1962_by_Robert_Huffstutter.jpg", cap: "Sankei-en Gardens, Yokohama (横浜 三溪園) circa by Robert Huffstutter" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Minato_Mirai_21_views_from_around.jpg/960px-Minato_Mirai_21_views_from_around.jpg", cap: "Minato Mirai 21 views from around" }
  ]
},
{
  id: "hakone",
  name: "Hakone",
  jp: "箱根",
  region: "Fuji–Hakone",
  type: "stay",
  days: "Days 2–4 · 2 nights",
  legMiles: 44,
  lat: 35.2324, lng: 139.1069, zoom: 13,
  tagline: "Onsen mountains, a volcanic valley and Lake Ashi's floating torii.",
  intro: [
    "Hakone is the classic first rest base: a hot-spring resort town in the mountains southwest of Tokyo, wrapped around the caldera of Lake Ashi with Mt. Fuji on the horizon.",
    "Two nights here means an unhurried arrival ride and a full no-packing day for the ropeway, the lake and a long soak — a gentle confidence-builder for the newer rider and a treat for a 6-year-old."
  ],
  highlights: [
    "Hakone Ropeway over the steaming Owakudani valley",
    "Lake Ashi sightseeing 'pirate ship' cruise to the red torii gate",
    "Hakone Open-Air Museum (huge kids' play sculptures)",
    "Owakudani black eggs, boiled in the volcanic springs"
  ],
  food: [
    { n: "Ryokan kaiseki", d: "Multi-course local dinner included at most onsen inns." },
    { n: "Hakone soba", d: "Buckwheat noodles in the cool mountain air." },
    { n: "Kuro-tamago", d: "Black-shelled hot-spring eggs from Owakudani." }
  ],
  hotels: [
    { n: "Hakone Kowakien Tenyu", t: "Onsen ryokan", d: "Rooms with private open-air baths, valley views, parking.", price: "¥28,000–60,000" },
    { n: "Hakone Yutowa", t: "Boutique", d: "Modern, family-suitable, relaxed onsen and lounge.", price: "¥20,000–40,000" },
    { n: "Hotel Green Plaza Hakone", t: "Family-friendly", d: "Fuji-view baths; easy car/bike parking — confirm on booking.", price: "¥18,000–35,000" }
  ],
  links: [
    { l: "Hakone Navi (official)", u: "https://www.hakonenavi.jp/english/" },
    { l: "Wikipedia — Hakone", u: "https://en.wikipedia.org/wiki/Hakone,_Kanagawa" }
  ],
  photos: [
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/A_view_of_Lake_Ashi_with_Peace_Torii_gate%2C_Hakone%2C_Japan1.jpg/960px-A_view_of_Lake_Ashi_with_Peace_Torii_gate%2C_Hakone%2C_Japan1.jpg", cap: "Peace Torii on Lake Ashi" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/A_view_of_Owakudani_and_ropeway%2C_Hakone%2C_Japan.jpg/960px-A_view_of_Owakudani_and_ropeway%2C_Hakone%2C_Japan.jpg", cap: "A view of Owakudani and ropeway, Hakone, Japan" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Hakone_Open-air_Museum_20211202-10.jpg/960px-Hakone_Open-air_Museum_20211202-10.jpg", cap: "Hakone Open-air" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/LakeAshi_and_MtFuji_Hakone.JPG/960px-LakeAshi_and_MtFuji_Hakone.JPG", cap: "LakeAshi and MtFuji Hakone" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Lake_Ashi_in_Hakone_-_April_2014.jpg/960px-Lake_Ashi_in_Hakone_-_April_2014.jpg", cap: "Lake Ashi in Hakone - April" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Lake_Ashi_%26_Mt_Fuji_%26_Hakone_Shrine.jpg/960px-Lake_Ashi_%26_Mt_Fuji_%26_Hakone_Shrine.jpg", cap: "Lake Ashi & Mt Fuji & Hakone Shrine" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Hakone_Ashi_Lake_Torii.jpg/960px-Hakone_Ashi_Lake_Torii.jpg", cap: "The lakeside torii gate" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/A_view_of_Lake_Ashi_with_Peace_Torii_gate%2C_Hakone%2C_Japan2.jpg/960px-A_view_of_Lake_Ashi_with_Peace_Torii_gate%2C_Hakone%2C_Japan2.jpg", cap: "Lake Ashi from the water" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/A_view_of_Lake_Ashi%2C_Hakone%2C_Japan.jpg/960px-A_view_of_Lake_Ashi%2C_Hakone%2C_Japan.jpg", cap: "A view of Lake Ashi, Hakone, Japan" }
  ]
},
{
  id: "izu",
  name: "Izu Peninsula",
  jp: "伊豆半島",
  region: "Shizuoka coast",
  type: "stop",
  days: "Day 4",
  legMiles: 55,
  lat: 34.7036, lng: 138.9525, zoom: 11,
  tagline: "Volcanic coastline, sea cliffs and warm-water beaches.",
  intro: [
    "The Izu Peninsula is a UNESCO Global Geopark of dramatic volcanic coastline, hidden coves and easy coastal touring roads — a relaxed scenic detour south of Hakone.",
    "The east-coast road and the Jogasaki cliffs make for a memorable, low-stress ride with frequent stops for the young passenger, seafood lunches and a paddle in the sea."
  ],
  highlights: [
    "Jogasaki coast suspension bridge and lava cliffs",
    "Shimoda's historic port and sandy Shirahama beach",
    "Kawazu's waterfall trail (Nanadaru)",
    "Mt. Omuro for an easy chairlift and crater walk"
  ],
  food: [
    { n: "Kinmedai", d: "Golden-eye snapper, simmered or as sashimi — Izu's signature fish." },
    { n: "Wasabi", d: "Grown in Izu's clear streams; try fresh wasabi soba." },
    { n: "Seafood-don", d: "Rice bowls piled with the day's local catch." }
  ],
  hotels: [
    { n: "Shimoda Tokyu Hotel", t: "Nice hotel", d: "Ocean-view rooms above the bay, ample parking.", price: "¥18,000–35,000" },
    { n: "Imaihama / Shirahama onsen ryokan", t: "Onsen ryokan", d: "Beachside hot-spring inns with included seafood dinners.", price: "¥28,000–60,000" }
  ],
  links: [
    { l: "Izu Geopark (official)", u: "https://izugeopark.org/en/" },
    { l: "Wikipedia — Izu Peninsula", u: "https://en.wikipedia.org/wiki/Iz%C5%AB_Peninsula" }
  ],
  photos: [
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Izu_Jogasaki_-_%E4%BC%8A%E8%B1%86%E5%9F%8E%E3%82%B1%E5%B4%8E%E6%B5%B7%E5%B2%B8_m-8_-_panoramio.jpg/960px-Izu_Jogasaki_-_%E4%BC%8A%E8%B1%86%E5%9F%8E%E3%82%B1%E5%B4%8E%E6%B5%B7%E5%B2%B8_m-8_-_panoramio.jpg", cap: "Jogasaki coast, Izu" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/b/b8/Izu-oshima.jpg", cap: "Izu-oshima" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Beach_in_Shimoda.jpg/960px-Beach_in_Shimoda.jpg", cap: "Beach in Shimoda" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Kawazu_Seven_Waterfalls_Snake_Waterfall_%28202950357%29.jpeg/960px-Kawazu_Seven_Waterfalls_Snake_Waterfall_%28202950357%29.jpeg", cap: "Kawazu Seven Waterfalls Snake Waterfall" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/IZU_Shirahama_-_panoramio.jpg/960px-IZU_Shirahama_-_panoramio.jpg", cap: "IZU Shirahama" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Sarutafuchi_Fall_in_Kawazu_Town.jpg/960px-Sarutafuchi_Fall_in_Kawazu_Town.jpg", cap: "Sarutafuchi Fall in Kawazu Town" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Izu_peninsula_UNESCO_geopark_2022_Sept_12_various.jpeg/960px-Izu_peninsula_UNESCO_geopark_2022_Sept_12_various.jpeg", cap: "Izu peninsula UNESCO geopark Sept 12 various" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Izu_Shimoda_Tatado_hama.jpg/960px-Izu_Shimoda_Tatado_hama.jpg", cap: "Izu Shimoda Tatado hama" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/J%C5%8Dgasaki_Coast_01.jpg/960px-J%C5%8Dgasaki_Coast_01.jpg", cap: "Jōgasaki Coast" }
  ]
},
{
  id: "fuji",
  name: "Fuji Five Lakes",
  jp: "富士五湖",
  region: "Yamanashi",
  type: "stop",
  days: "Days 5–6",
  legMiles: 74,
  lat: 35.5170, lng: 138.7640, zoom: 12,
  tagline: "Japan's iconic peak mirrored in lakeside calm.",
  intro: [
    "The Fuji Five Lakes (Fujigoko) sit at the northern foot of Mt. Fuji. Lake Kawaguchiko is the most accessible, lined with hotels, viewpoints and easy lakeside roads.",
    "A light second day here lets the family enjoy the mountain without long riding — a cable car, a flower park and a lake loop, weather permitting."
  ],
  highlights: [
    "Mt. Fuji Panoramic Ropeway (Kachi Kachi) over Kawaguchiko",
    "Oishi Park flower fields with Fuji behind",
    "Fuji-Q-adjacent areas / Fujiyoshida retro townscape",
    "Chureito Pagoda viewpoint (steps, but worth it)"
  ],
  food: [
    { n: "Hoto", d: "Hearty flat-noodle miso hotpot with pumpkin — Yamanashi soul food." },
    { n: "Yoshida udon", d: "Famously chewy thick udon from Fujiyoshida." },
    { n: "Lake fish", d: "Grilled wakasagi smelt and trout from the lakes." }
  ],
  hotels: [
    { n: "Hoshinoya Fuji", t: "Luxury glamping", d: "Cabins facing the lake and Fuji — a standout splurge.", price: "¥80,000–250,000" },
    { n: "Fufu Kawaguchiko", t: "Boutique onsen", d: "Small luxury ryokan with private baths.", price: "¥28,000–60,000" },
    { n: "Mizno Hotel / lakeside hotels", t: "Family-friendly", d: "Fuji-view rooms with parking on the Kawaguchiko shore.", price: "¥18,000–35,000" }
  ],
  links: [
    { l: "Fujisan / Yamanashi tourism", u: "https://www.yamanashi-kankou.jp/english/" },
    { l: "Wikipedia — Fuji Five Lakes", u: "https://en.wikipedia.org/wiki/Fuji_Five_Lakes" }
  ],
  photos: [
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Lake_Kawaguchiko_Sakura_Mount_Fuji_3.JPG/960px-Lake_Kawaguchiko_Sakura_Mount_Fuji_3.JPG", cap: "Mt. Fuji over Lake Kawaguchiko" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/20100728_Kawaguchiko_Station_6622.jpg/960px-20100728_Kawaguchiko_Station_6622.jpg", cap: "Kawaguchiko Station" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/12-Chureito-pagoda-and-Mount-Fuji-Japan_%2829677439878%29.jpg/960px-12-Chureito-pagoda-and-Mount-Fuji-Japan_%2829677439878%29.jpg", cap: "View" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Kawaguchiko_Sta._%26_Mt._Fuji_20061112.jpg/960px-Kawaguchiko_Sta._%26_Mt._Fuji_20061112.jpg", cap: "Kawaguchiko Sta. & Mt. Fuji" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Chureito_Pagoda_and_Mount_Fuji_low_crop_Wikivoyage_banner.jpg/960px-Chureito_Pagoda_and_Mount_Fuji_low_crop_Wikivoyage_banner.jpg", cap: "Chureito Pagoda and Mount Fuji" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Lake_Kawaguchiko_Sakura_Mount_Fuji_4.JPG/960px-Lake_Kawaguchiko_Sakura_Mount_Fuji_4.JPG", cap: "Lake Kawaguchiko Sakura Mount Fuji" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Mount_Fuji_and_Kawaguchiko_Lake_and_Bridge_on_a_manhole_cover%2C_Fujikawaguchiko%2C_2016.jpg/960px-Mount_Fuji_and_Kawaguchiko_Lake_and_Bridge_on_a_manhole_cover%2C_Fujikawaguchiko%2C_2016.jpg", cap: "Mount Fuji and Kawaguchiko Lake and Bridge on a manhole cover,…" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Mount_Fuji_at_night%2C_Kawaguchiko.jpg/960px-Mount_Fuji_at_night%2C_Kawaguchiko.jpg", cap: "Mount Fuji at night, Kawaguchiko" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Mount_Fuji_%40_Lake_Kawaguchiko_%2810862985754%29.jpg/960px-Mount_Fuji_%40_Lake_Kawaguchiko_%2810862985754%29.jpg", cap: "Fuji reflected in the lake" }
  ]
},
{
  id: "nagoya",
  name: "Nagoya / Gifu",
  jp: "名古屋",
  region: "Chubu",
  type: "stop",
  days: "Day 7",
  legMiles: 177,
  lat: 35.1850, lng: 136.8998, zoom: 13,
  tagline: "A comfortable city break on the long westward transfer.",
  intro: [
    "Nagoya is the practical midpoint between the Fuji area and the Seto Inland Sea — the one longer transfer day on the trip, kept on wider, comfortable national roads and expressways.",
    "It's a good place for a city hotel, laundry, a proper bed and one of Japan's most distinctive regional food cultures before crossing toward Shikoku."
  ],
  highlights: [
    "Nagoya Castle with its golden shachihoko",
    "SCMAGLEV and Railway Park (kid favourite)",
    "Atsuta Shrine, one of Shinto's most sacred sites",
    "Optional Gifu detour: Inuyama Castle or the Kiso river valley"
  ],
  food: [
    { n: "Hitsumabushi", d: "Grilled eel over rice, eaten three ways — Nagoya's signature." },
    { n: "Miso katsu", d: "Pork cutlet under rich red-miso sauce." },
    { n: "Tebasaki", d: "Crispy peppery chicken wings, a local institution." }
  ],
  hotels: [
    { n: "Nagoya Marriott Associa", t: "Nice hotel", d: "Above the station, garage parking — confirm motorcycle access.", price: "¥18,000–35,000" },
    { n: "The Tower Hotel Nagoya", t: "Boutique", d: "Design hotel in the TV-tower park, central.", price: "¥20,000–40,000" },
    { n: "Business hotels (Sakae/Nagoya stn)", t: "Practical", d: "Plentiful, good for a one-night transfer with parking nearby.", price: "¥9,000–16,000" }
  ],
  links: [
    { l: "Nagoya Info (official)", u: "https://www.nagoya-info.jp/en/" },
    { l: "Wikipedia — Nagoya", u: "https://en.wikipedia.org/wiki/Nagoya" }
  ],
  photos: [
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Nagoya_Castle%28Edit2%29.jpg/960px-Nagoya_Castle%28Edit2%29.jpg", cap: "Nagoya Castle" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Atsuta-jing%C5%AB_%28Atsuta-ku%2C_Nagoya%29_VLux5_hdsr_at08.jpg/960px-Atsuta-jing%C5%AB_%28Atsuta-ku%2C_Nagoya%29_VLux5_hdsr_at08.jpg", cap: "Atsuta-jingū (Atsuta-ku, Nagoya)" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Japan-_Nagoya-_Osu_Kannon_Temple_2.jpg/960px-Japan-_Nagoya-_Osu_Kannon_Temple_2.jpg", cap: "Japan- Nagoya- Osu Kannon Temple" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Atsuta_Shrine%2C_Nagoya%3B_Febuary_2012.jpg/960px-Atsuta_Shrine%2C_Nagoya%3B_Febuary_2012.jpg", cap: "Atsuta Shrine, Nagoya; Febuary" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Nagoya-subway-T08-Osu-kannon-station-entrance-2-20100315.jpg/960px-Nagoya-subway-T08-Osu-kannon-station-entrance-2-20100315.jpg", cap: "View" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Nagoya_Castle_aerial_panorama.jpg/960px-Nagoya_Castle_aerial_panorama.jpg", cap: "Nagoya Castle aerial panorama" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Atsuta_Shrine.jpg/960px-Atsuta_Shrine.jpg", cap: "Atsuta Shrine" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/%C5%8Csu_Kannon_%28Naka-ku%2C_Nagoya%29_VLux5_hdsr_102.jpg/960px-%C5%8Csu_Kannon_%28Naka-ku%2C_Nagoya%29_VLux5_hdsr_102.jpg", cap: "Ōsu Kannon (Naka-ku, Nagoya)" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Nagoya_Castle_%2856938%29.jpg/960px-Nagoya_Castle_%2856938%29.jpg", cap: "Keep and golden shachihoko" }
  ]
},
{
  id: "awaji",
  name: "Awaji Island",
  jp: "淡路島",
  region: "Seto Inland Sea",
  type: "stop",
  days: "Day 8",
  legMiles: 163,
  lat: 34.4200, lng: 134.8890, zoom: 11,
  tagline: "The stepping-stone island into the Seto Inland Sea.",
  intro: [
    "Awaji Island bridges Honshu and Shikoku across the Seto Inland Sea. The great Akashi Kaikyo Bridge brings you on from the Kobe side, and the Naruto whirlpools churn off its southern tip.",
    "It's a scenic, low-traffic island with coastal roads, flower parks and excellent seafood — an easy and beautiful approach to Shikoku."
  ],
  highlights: [
    "Naruto whirlpools, seen from the Uzunomichi walkway",
    "Akashi Kaikyo Bridge, the world's longest-span suspension bridge for years",
    "Awaji Hanasajiki flower hills",
    "Izanagi Shrine, one of Japan's oldest"
  ],
  food: [
    { n: "Awaji beef", d: "Premium local wagyu, the source herd for famed Kobe/Matsusaka lines." },
    { n: "Onions", d: "Sweet Awaji onions star in burgers, soups and tempura island-wide." },
    { n: "Sea bream (tai)", d: "Pulled from the fast Naruto straits — superb sashimi." }
  ],
  hotels: [
    { n: "Grand Nikko Awaji", t: "Nice hotel", d: "Big resort with sea views and easy parking.", price: "¥18,000–35,000" },
    { n: "Hotel New Awaji", t: "Onsen ryokan", d: "Cliffside hot-spring inn over the inland sea.", price: "¥28,000–60,000" }
  ],
  links: [
    { l: "Awaji Island tourism", u: "https://www.awajishima-kanko.jp/en/" },
    { l: "Wikipedia — Awaji Island", u: "https://en.wikipedia.org/wiki/Awaji_Island" }
  ],
  photos: [
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Observing_Naruto_whirlpools.jpg/960px-Observing_Naruto_whirlpools.jpg", cap: "Watching the Naruto whirlpools" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Awa%2C_Naruto_Whirlpools%2C_ca_1855.jpg/960px-Awa%2C_Naruto_Whirlpools%2C_ca_1855.jpg", cap: "Awa, Naruto Whirlpools, ca" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/5/56/Akashi-Kaikyo_Bridge%2C_Japan_%28ASTER%29.jpg", cap: "Akashi-Kaikyo Bridge, Japan (ASTER)" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Awaji_Balcony_flower_in_2013_04.JPG/960px-Awaji_Balcony_flower_in_2013_04.JPG", cap: "Awaji Balcony flower in" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Naruto_Whirlpools_taken_4-21-2008.jpg/960px-Naruto_Whirlpools_taken_4-21-2008.jpg", cap: "Naruto Whirlpools taken" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Akashi_Bridge.JPG/960px-Akashi_Bridge.JPG", cap: "Akashi Bridge" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/%E5%85%AD%E5%8D%81%E4%BD%99%E5%B7%9E%E5%90%8D%E6%89%80%E5%9B%B3%E4%BC%9A_%E9%98%BF%E6%B3%A2_%E9%B3%B4%E9%96%80%E3%81%AE%E9%A2%A8%E6%B3%A2-Naruto_Whirlpool%2C_Awa_Province%2C_from_the_series_Views_of_Famous_Places_in_the_Sixty-Odd_Provinces_MET_DP122165.jpg/960px-thumbnail.jpg", cap: "六十余州名所図会 阿波 鳴門の風波-Naruto Whirlpool, Awa Province, from the seri…" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/DSC01488_Akashi-Kaikyo_Bridge_interfior.jpg/960px-DSC01488_Akashi-Kaikyo_Bridge_interfior.jpg", cap: "DSC01488 Akashi-Kaikyo Bridge interfior" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Naruto_whirlpools_20170609-1.jpg/960px-Naruto_whirlpools_20170609-1.jpg", cap: "Naruto" }
  ]
},
{
  id: "iya",
  name: "Iya Valley / Oboke",
  jp: "祖谷渓",
  region: "Shikoku mountains",
  type: "stay",
  days: "Days 9–11 · 2 nights",
  legMiles: 101,
  lat: 33.8890, lng: 133.8120, zoom: 12,
  tagline: "Vine bridges, deep gorges and one of Japan's hidden valleys.",
  intro: [
    "The Iya Valley is a remote, mist-wrapped gorge in the heart of Shikoku — historically a refuge of the defeated Heike clan, reached by gentle paved mountain roads above the emerald Yoshino River.",
    "Two nights at a valley onsen ryokan gives a true rural-Japan rest: the famous vine bridge, a gorge boat ride and slow mountain evenings far from any city."
  ],
  highlights: [
    "Kazurabashi vine suspension bridge",
    "Oboke Gorge sightseeing boat on the Yoshino River",
    "The 'Peeing Boy' (Shobenkozo) cliff-edge statue viewpoint",
    "Nagoro 'Scarecrow Village', oddly delightful for kids"
  ],
  food: [
    { n: "Iya soba", d: "Rustic short-cut buckwheat noodles of the mountains." },
    { n: "Dekomawashi", d: "Skewered grilled potato, konjac and tofu in miso." },
    { n: "Ayu / amego", d: "Salt-grilled river fish from the clear gorge streams." }
  ],
  hotels: [
    { n: "Iya Onsen Hotel", t: "Onsen ryokan", d: "Private cable-car to riverside open-air baths in the gorge.", price: "¥28,000–60,000" },
    { n: "Hotel Kazurabashi", t: "Onsen ryokan", d: "Mountain hot-spring inn near the vine bridge, dinner included.", price: "¥28,000–60,000" },
    { n: "Tougenkyo-Iya / Chiiori farmhouses", t: "Boutique stay", d: "Restored thatched farmhouses for a unique rural night.", price: "¥20,000–40,000" }
  ],
  links: [
    { l: "Tokushima / Iya tourism", u: "https://discovertokushima.net/en/" },
    { l: "Wikipedia — Iya Valley", u: "https://en.wikipedia.org/wiki/Iya_Valley" }
  ],
  photos: [
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Iya_Kazurabashi-4.jpg/960px-Iya_Kazurabashi-4.jpg", cap: "Kazurabashi vine bridge" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Bridge_over_Yoshino-gawa_%286453471533%29.jpg/960px-Bridge_over_Yoshino-gawa_%286453471533%29.jpg", cap: "Bridge over Yoshino-gawa" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Iya_Valley_a.jpeg/960px-Iya_Valley_a.jpeg", cap: "Iya Valley a" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Oboke_and_Yoshino-gawa_river_%286453466931%29.jpg/960px-Oboke_and_Yoshino-gawa_river_%286453466931%29.jpg", cap: "Oboke and Yoshino-gawa river" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Iya_vine_bridge_%286551507515%29.jpg/960px-Iya_vine_bridge_%286551507515%29.jpg", cap: "Iya vine bridge" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Tokushima_Miyoshi_Oboke_Gorge_Of_Yoshino_River_2.JPG/960px-Tokushima_Miyoshi_Oboke_Gorge_Of_Yoshino_River_2.JPG", cap: "Tokushima Miyoshi Oboke Gorge Of Yoshino River" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/150503_Biwa_Falls_Iya_Valley_Miyoshi_Tokushima_pref_Japan01s3.jpg/960px-150503_Biwa_Falls_Iya_Valley_Miyoshi_Tokushima_pref_Japan01s3.jpg", cap: "150503 Biwa Falls Iya Valley Miyoshi Tokushima pref" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Crab_crawling_around_in_the_hills_of_Iya_Valley_%286453587885%29.jpg/960px-Crab_crawling_around_in_the_hills_of_Iya_Valley_%286453587885%29.jpg", cap: "Crab crawling around in the hills of Iya Valley" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Iya-Onsen_Hotel%2CTokushima%281%29_-_panoramio.jpg/960px-Iya-Onsen_Hotel%2CTokushima%281%29_-_panoramio.jpg", cap: "Iya-Onsen Hotel,Tokushima" }
  ]
},
{
  id: "kochi",
  name: "Kochi",
  jp: "高知",
  region: "Shikoku south coast",
  type: "stop",
  days: "Day 11",
  legMiles: 41,
  lat: 33.5597, lng: 133.5311, zoom: 13,
  tagline: "Pacific shores, a perfectly preserved castle and big southern flavour.",
  intro: [
    "Kochi faces the open Pacific on Shikoku's south coast. Its castle is one of only twelve in Japan with an original keep, and the city has a famously warm, easygoing character.",
    "Coming down from the Iya mountains, the valleys open out to the sea — a satisfying riding day ending with a castle, a beach and a lively market."
  ],
  highlights: [
    "Kochi Castle, original Edo-period keep you can climb",
    "Katsurahama beach and the Sakamoto Ryoma statue",
    "Sunday market (Nichiyoichi), 300+ years old",
    "Hirome Market food hall for a buzzing dinner"
  ],
  food: [
    { n: "Katsuo no tataki", d: "Seared bonito, the soul dish of Kochi — straw-flame grilled." },
    { n: "Sawachi ryori", d: "Big communal platters of sashimi and local delicacies." },
    { n: "Yuzu", d: "Kochi's citrus flavours everything from drinks to ponzu." }
  ],
  hotels: [
    { n: "Joseikan", t: "Onsen ryokan", d: "Historic riverside inn, hosted royalty; central.", price: "¥28,000–60,000" },
    { n: "Richmond Hotel Kochi", t: "Nice hotel", d: "Comfortable, central, reliable; ask about parking.", price: "¥18,000–35,000" },
    { n: "The Crown Palais New Hankyu Kochi", t: "Family-friendly", d: "Large rooms near the station with parking.", price: "¥18,000–35,000" }
  ],
  links: [
    { l: "Visit Kochi Japan (official)", u: "https://visitkochijapan.com/en" },
    { l: "Wikipedia — Kochi", u: "https://en.wikipedia.org/wiki/Kochi,_Kochi" }
  ],
  photos: [
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Kochi_Castle08s3872.jpg/960px-Kochi_Castle08s3872.jpg", cap: "Kochi Castle" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Itagaki_Taisuke_dozo_seiso.jpg/960px-Itagaki_Taisuke_dozo_seiso.jpg", cap: "Itagaki Taisuke dozo seiso" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/b/b2/Katsurahama%2C_2005.jpg", cap: "Katsurahama" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Harimaya-bashi_%286453595247%29.jpg/960px-Harimaya-bashi_%286453595247%29.jpg", cap: "Harimaya-bashi" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/0/02/Katsurahama_Beach.jpg", cap: "Katsurahama Beach" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/d/d0/Harimayabashi-1.jpg", cap: "View" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Katsurahama_ryugu_bridge.jpg/960px-Katsurahama_ryugu_bridge.jpg", cap: "Katsurahama ryugu bridge" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Kochi_Harimaya-bashi_Bridge.jpeg/960px-Kochi_Harimaya-bashi_Bridge.jpeg", cap: "Kochi Harimaya-bashi Bridge" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Katsurahama_wadatsumi_shrine.jpg/960px-Katsurahama_wadatsumi_shrine.jpg", cap: "Katsurahama wadatsumi shrine" }
  ]
},
{
  id: "shimanto",
  name: "Shimanto River",
  jp: "四万十川",
  region: "Shikoku west",
  type: "stay",
  days: "Days 12–14 · 2 nights",
  legMiles: 56,
  lat: 33.2100, lng: 132.9900, zoom: 11,
  tagline: "Japan's 'last clear stream' and its low submersible bridges.",
  intro: [
    "The Shimanto is celebrated as Japan's last free-flowing major river without large dams — broad, clear and lined with rice paddies, cedar and the distinctive chinkabashi 'sinking bridges' built to duck under floods.",
    "Two nights by the river is the trip's quietest, most rural pause: canoeing, riverside cycling and slow countryside time, ideal for the child and the newer rider alike."
  ],
  highlights: [
    "Chinkabashi 'sinking bridges' — railless, low, photogenic",
    "Canoeing or a traditional yakatabune river boat",
    "Riverside cycling paths and swimming spots",
    "Tea fields and rural michi-no-eki roadside stations"
  ],
  food: [
    { n: "Ayu", d: "Sweetfish, salt-grilled — the river's signature catch." },
    { n: "Aonori", d: "Fragrant river seaweed, dried into tempura and snacks." },
    { n: "Unagi & tennen eel", d: "Wild river eel, a Shimanto delicacy." }
  ],
  hotels: [
    { n: "Shimanto-gawa Hotel Bell-Reef", t: "Family-friendly", d: "Riverside hotel near the estuary with parking.", price: "¥18,000–35,000" },
    { n: "Hotel Shimanto", t: "Practical", d: "Comfortable base in Shimanto city for two nights.", price: "¥9,000–16,000" },
    { n: "Riverside ryokan & guesthouses", t: "Rural inn", d: "Small inns with home-style dinners along the valley.", price: "¥12,000–25,000" }
  ],
  links: [
    { l: "Shimanto City tourism", u: "https://www.shimanto-kankou.com/" },
    { l: "Wikipedia — Shimanto River", u: "https://en.wikipedia.org/wiki/Shimanto_River" }
  ],
  photos: [
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Shimanto_River_%285279082249%29.jpg/960px-Shimanto_River_%285279082249%29.jpg", cap: "The Shimanto River" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Shimanto_River_And_Iwama_Bridge_1.jpg/960px-Shimanto_River_And_Iwama_Bridge_1.jpg", cap: "Shimanto River And Iwama Bridge" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Yodo_Line_and_Shimanto_river.JPG/960px-Yodo_Line_and_Shimanto_river.JPG", cap: "Yodo Line and Shimanto river" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Sagawa-bridge%2CShimanto-cho%2CJapan.JPG/960px-Sagawa-bridge%2CShimanto-cho%2CJapan.JPG", cap: "Sagawa-bridge,Shimanto-cho,Japan" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Shimanto-iwama.jpg/960px-Shimanto-iwama.jpg", cap: "Shimanto-iwama" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/ShimantoRiverFromNakabaRestarea.JPG/960px-ShimantoRiverFromNakabaRestarea.JPG", cap: "ShimantoRiverFromNakabaRestarea" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Shimanto_River_And_Shimanto_River_Bridge_1.JPG/960px-Shimanto_River_And_Shimanto_River_Bridge_1.JPG", cap: "Clear waters of the Shimanto" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/f/f0/Nishitosa_Shimanto_river.jpg", cap: "Nishitosa Shimanto river" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Shimanto-river_%E5%9B%9B%E4%B8%87%E5%8D%81%E5%B7%9D%E8%8B%A5%E4%BA%95%E6%B2%88%E4%B8%8B%E6%A9%8B1010070.JPG/960px-Shimanto-river_%E5%9B%9B%E4%B8%87%E5%8D%81%E5%B7%9D%E8%8B%A5%E4%BA%95%E6%B2%88%E4%B8%8B%E6%A9%8B1010070.JPG", cap: "Shimanto-river" }
  ]
},
{
  id: "uwajima",
  name: "Uchiko / Uwajima",
  jp: "宇和島",
  region: "Ehime south",
  type: "stop",
  days: "Day 14",
  legMiles: 38,
  lat: 33.2233, lng: 132.5606, zoom: 13,
  tagline: "An original castle and a preserved merchant town en route north.",
  intro: [
    "Heading up Shikoku's west coast toward Matsuyama, two worthwhile stops break the ride: Uwajima, with another of Japan's twelve original castle keeps, and Uchiko, a beautifully preserved wax-merchant town.",
    "These are easy, rewarding half-day stops — history and old streets without crowds — on a relaxed transfer day."
  ],
  highlights: [
    "Uwajima Castle, compact original Edo keep on a hill",
    "Uchiko's Yokaichi old street of merchant houses",
    "Uchiko-za, a restored 1916 kabuki theatre",
    "Date Museum / Tensha-en garden in Uwajima"
  ],
  food: [
    { n: "Taimeshi (Uwajima style)", d: "Sea bream sashimi over rice with a raw-egg-soy sauce." },
    { n: "Jakoten", d: "Fried minced-fish cakes, a local snack." },
    { n: "Mikan", d: "Ehime's famous mandarin oranges and citrus juices." }
  ],
  hotels: [
    { n: "Usually passed through", t: "Note", d: "Most riders push on to Matsuyama/Dogo to sleep (next stop)." },
    { n: "Kibako / Uchiko guesthouses", t: "Boutique stay", d: "If overnighting, small restored-house inns in Uchiko are lovely.", price: "¥20,000–40,000" }
  ],
  links: [
    { l: "Ehime tourism (official)", u: "https://www.iyokannet.jp/en/" },
    { l: "Wikipedia — Uwajima Castle", u: "https://en.wikipedia.org/wiki/Uwajima_Castle" }
  ],
  photos: [
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Uwajima-jo.JPG/960px-Uwajima-jo.JPG", cap: "Uwajima Castle" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Uchiko-za_%286454001047%29.jpg/960px-Uchiko-za_%286454001047%29.jpg", cap: "Uchiko-za" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Uchiko_Theatre.jpg/960px-Uchiko_Theatre.jpg", cap: "Uchiko Theatre" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Ehime_Bank_Uwajima_Branch_Uwajima-Shimmachi_Sub-branch.jpg/960px-Ehime_Bank_Uwajima_Branch_Uwajima-Shimmachi_Sub-branch.jpg", cap: "Ehime Bank Uwajima Branch Uwajima-Shimmachi Sub-branch" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Kashima_Island%2C_Uwajima_Ehime_Aerial_photograph.2019.jpg/960px-Kashima_Island%2C_Uwajima_Ehime_Aerial_photograph.2019.jpg", cap: "Kashima Island, Uwajima Ehime Aerial" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Uwajima_Bay.JPG/960px-Uwajima_Bay.JPG", cap: "Uwajima Bay" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Uwajima_Port_Joint_Government_Building.jpg/960px-Uwajima_Port_Joint_Government_Building.jpg", cap: "Uwajima Port Joint Government Building" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Uwajima_Station%2C_platform.jpg/960px-Uwajima_Station%2C_platform.jpg", cap: "Uwajima Station, platform" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Uwajima_post-office.jpg/960px-Uwajima_post-office.jpg", cap: "Uwajima post-office" }
  ]
},
{
  id: "dogo",
  name: "Dogo Onsen / Matsuyama",
  jp: "道後温泉",
  region: "Ehime · Matsuyama",
  type: "stay",
  days: "Days 14–16 · 2 nights",
  legMiles: 56,
  lat: 33.8519, lng: 132.7866, zoom: 14,
  tagline: "One of Japan's oldest hot springs beneath a hilltop castle.",
  intro: [
    "Matsuyama is Shikoku's largest city, crowned by a magnificent original castle, with the ancient Dogo Onsen at its edge — a hot spring used for over a thousand years and an inspiration for the bathhouse in 'Spirited Away'.",
    "Two nights here balances city comforts (laundry, dining, a proper hotel) with a classic onsen evening — a fitting reward before the Shimanami Kaido."
  ],
  highlights: [
    "Dogo Onsen Honkan, the landmark 1894 wooden bathhouse",
    "Matsuyama Castle, reached by ropeway/chairlift",
    "Botchan train, a restored steam-style streetcar",
    "Dogo shopping arcade for evening strolls"
  ],
  food: [
    { n: "Taimeshi (Matsuyama style)", d: "Whole sea bream cooked together with the rice." },
    { n: "Botchan dango", d: "Tri-colour sweet dumplings named for the famous novel." },
    { n: "Jakoten & local sake", d: "Fish cakes with Ehime's rice wines." }
  ],
  hotels: [
    { n: "Dogo Kan", t: "Onsen ryokan", d: "Grand hot-spring inn steps from the Honkan, kaiseki dinners.", price: "¥28,000–60,000" },
    { n: "Funaya", t: "Onsen ryokan", d: "Historic Dogo inn that has hosted the imperial family.", price: "¥28,000–60,000" },
    { n: "ANA Crowne Plaza Matsuyama", t: "Nice hotel", d: "Central city hotel with parking for the bikes.", price: "¥18,000–35,000" }
  ],
  links: [
    { l: "Dogo Onsen (official)", u: "https://dogo.jp/en/" },
    { l: "Wikipedia — Dogo Onsen", u: "https://en.wikipedia.org/wiki/D%C5%8Dgo_Onsen" }
  ],
  photos: [
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Dogo_Onsen_Honkan_%28Main_building%29%2C_%E9%81%93%E5%BE%8C%E6%B8%A9%E6%B3%89_%E6%9C%AC%E9%A4%A8_-_panoramio.jpg/960px-Dogo_Onsen_Honkan_%28Main_building%29%2C_%E9%81%93%E5%BE%8C%E6%B8%A9%E6%B3%89_%E6%9C%AC%E9%A4%A8_-_panoramio.jpg", cap: "Dogo Onsen Honkan bathhouse" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/MEIN%26SMALL_CASTLE_TOWER_%2CMATSUYAMA_CASTLE%28IYO%29.JPG/960px-MEIN%26SMALL_CASTLE_TOWER_%2CMATSUYAMA_CASTLE%28IYO%29.JPG", cap: "MEIN&SMALL CASTLE TOWER ,MATSUYAMA CASTLE(IYO)" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Botchan-ressha.jpg/960px-Botchan-ressha.jpg", cap: "Botchan-ressha" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Dogo_onsen_honkan_long_exposure.jpg/960px-Dogo_onsen_honkan_long_exposure.jpg", cap: "Dogo onsen honkan long exposure" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Marunouchi%2C_Matsuyama%2C_Ehime_Prefecture_790-0008%2C_Japan_-_panoramio_%2893%29.jpg/960px-Marunouchi%2C_Matsuyama%2C_Ehime_Prefecture_790-0008%2C_Japan_-_panoramio_%2893%29.jpg", cap: "Marunouchi, Matsuyama, Ehime Prefecture 790-0008, Japan - panor…" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Botchan-train%28Matsuyama_City%29.JPG/960px-Botchan-train%28Matsuyama_City%29.JPG", cap: "Botchan-train(Matsuyama City)" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Matsuyama_Castle_1906.jpg/960px-Matsuyama_Castle_1906.jpg", cap: "Matsuyama Castle" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Botchan_Train_at_Dogo_Onsen_Station.jpg/960px-Botchan_Train_at_Dogo_Onsen_Station.jpg", cap: "Botchan Train at Dogo Onsen Station" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Stone_sign%2C_Matsuyama_Castle%2C_Matsuyama%2C_Ehime_-_Sep_23%2C_2011.jpg/960px-Stone_sign%2C_Matsuyama_Castle%2C_Matsuyama%2C_Ehime_-_Sep_23%2C_2011.jpg", cap: "Stone sign, Matsuyama Castle, Matsuyama, Ehime - Sep" }
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
  lat: 34.1800, lng: 133.0200, zoom: 11,
  tagline: "Island-hopping across the Seto Inland Sea by a chain of great bridges.",
  intro: [
    "The Shimanami Kaido links Shikoku (Imabari) to Honshu (Onomichi) over six islands and a series of spectacular suspension and cable-stayed bridges spanning the island-dotted Seto Inland Sea.",
    "It is gentle, scenic and unforgettable riding — sweeping bridge spans, blue sea on both sides and easy island roads, arguably the highlight ride of the whole tour."
  ],
  highlights: [
    "Kurushima-Kaikyo Bridge, a 4 km triple suspension span",
    "Kirosan Observatory for the classic bridge panorama",
    "Oyamazumi Shrine on Omishima, full of samurai armour",
    "Island citrus stands and sea-view cafes en route"
  ],
  food: [
    { n: "Imabari yakibuta-tamago meshi", d: "Roast pork and egg over rice, an Imabari specialty." },
    { n: "Hakata salt & citrus", d: "Famous sea salt from Hakatajima island." },
    { n: "Octopus (tako)", d: "Firm Inland-Sea octopus, grilled or as rice bowls." }
  ],
  hotels: [
    { n: "Ride day — sleep in Setoda/Onomichi", t: "Note", d: "Most cross the Kaido and overnight at the next 2-night base." },
    { n: "WAKKA (Omishima)", t: "Boutique", d: "If splitting the ride, a stylish cyclist-friendly stay mid-route.", price: "¥20,000–40,000" }
  ],
  links: [
    { l: "Shimanami Kaido (official)", u: "https://shimanami-cycle.or.jp/global/" },
    { l: "Wikipedia — Nishiseto Expressway", u: "https://en.wikipedia.org/wiki/Nishiseto_Expressway" }
  ],
  photos: [
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Kurushima-Kaikyo_Bridge%2C_Seto_Inland_Sea%2C_Japan.jpg/960px-Kurushima-Kaikyo_Bridge%2C_Seto_Inland_Sea%2C_Japan.jpg", cap: "Kurushima-Kaikyo Bridge" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Stele_of_Tatara_Bridge_in_Roadside_Station_%22Imabari_City_Tatara_Shimanami_Park%22.jpg/960px-Stele_of_Tatara_Bridge_in_Roadside_Station_%22Imabari_City_Tatara_Shimanami_Park%22.jpg", cap: "Stele of Tatara Bridge in Roadside Station 'Imabari City Tatara…" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Onomichi_Station_Pier_of_Mukaishima_Ferry_2.jpg/960px-Onomichi_Station_Pier_of_Mukaishima_Ferry_2.jpg", cap: "Onomichi Station Pier of Mukaishima Ferry" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Shimanami_Kaido_Bikeway_%2814089291941%29.jpg/960px-Shimanami_Kaido_Bikeway_%2814089291941%29.jpg", cap: "Shimanami Kaido Bikeway" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Tatara-gridge201310.JPG/960px-Tatara-gridge201310.JPG", cap: "View" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Kurushima-Kaiky%C5%8D_Bridge_2012-04-07.JPG/960px-Kurushima-Kaiky%C5%8D_Bridge_2012-04-07.JPG", cap: "Kurushima-Kaikyō" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Kurushima-Kaikyo_Bridge_310040.jpg/960px-Kurushima-Kaikyo_Bridge_310040.jpg", cap: "The great spans over the sea" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Kurushima-Kaikyo_Bridge_310054.jpg/960px-Kurushima-Kaikyo_Bridge_310054.jpg", cap: "Island-hopping route" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Kurushima-Kaikyo-Bridge.jpg/960px-Kurushima-Kaikyo-Bridge.jpg", cap: "Kurushima-Kaikyo-Bridge" }
  ]
},
{
  id: "onomichi",
  name: "Onomichi / Setoda",
  jp: "尾道",
  region: "Hiroshima coast",
  type: "stay",
  days: "Days 16–18 · 2 nights",
  legMiles: 32,
  lat: 34.4090, lng: 133.2050, zoom: 14,
  tagline: "A hillside temple town and lemon-scented islands.",
  intro: [
    "Onomichi is a nostalgic port town of steep lanes, hillside temples and cats, draped over slopes above the Seto Inland Sea at the Honshu end of the Shimanami Kaido.",
    "Nearby Setoda on Ikuchijima island is famous for lemons, gelato and a dazzling gilded temple. Two nights here is a relaxed coastal pause among islands and old streets."
  ],
  highlights: [
    "Onomichi's Temple Walk and the Senkoji ropeway viewpoint",
    "The 'Path of Literature' and atmospheric cat alley",
    "Setoda's Kosanji Temple and marble 'Hill of Hope'",
    "Island lemon groves, gelato and seaside cafes"
  ],
  food: [
    { n: "Onomichi ramen", d: "Soy broth with flat noodles and pork-back fat — a regional classic." },
    { n: "Setoda lemons", d: "Lemon gelato, cakes and drinks across the islands." },
    { n: "Inland-sea seafood", d: "Conger eel (anago), oysters and small fish." }
  ],
  hotels: [
    { n: "Azumi Setoda", t: "Luxury ryokan", d: "Restored merchant estate on Ikuchijima — a destination in itself.", price: "¥80,000–250,000" },
    { n: "LOG (Onomichi)", t: "Boutique", d: "Hillside design hotel with sea views over the town.", price: "¥20,000–40,000" },
    { n: "Onomichi U2 / Hotel Cycle", t: "Family-friendly", d: "Waterfront converted warehouse, very bike-friendly, parking.", price: "¥18,000–35,000" }
  ],
  links: [
    { l: "Onomichi tourism (official)", u: "https://www.ononavi.jp/global/en/" },
    { l: "Wikipedia — Onomichi", u: "https://en.wikipedia.org/wiki/Onomichi" }
  ],
  photos: [
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Onomichi_%2851806057842%29.jpg/960px-Onomichi_%2851806057842%29.jpg", cap: "Onomichi hillside town" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Onomichi_Bridge_and_Onomichi_Channel_from_Main_Hall_of_Senkoji_Temple_2.jpg/960px-Onomichi_Bridge_and_Onomichi_Channel_from_Main_Hall_of_Senkoji_Temple_2.jpg", cap: "Onomichi Bridge and Onomichi Channel from Main Hall of Senkoji…" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/From_the_sky_%2C_%E4%BD%90%E6%9C%A8%E5%B3%B6%E4%B8%8A%E7%A9%BA%E3%81%8B%E3%82%89_-_panoramio.jpg/960px-From_the_sky_%2C_%E4%BD%90%E6%9C%A8%E5%B3%B6%E4%B8%8A%E7%A9%BA%E3%81%8B%E3%82%89_-_panoramio.jpg", cap: "From the sky , 佐木島上空から" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Onomichi_Bridge_and_Shin-Onomichi_Bridge_from_Senkoji_Temple_2.jpg/960px-Onomichi_Bridge_and_Shin-Onomichi_Bridge_from_Senkoji_Temple_2.jpg", cap: "Onomichi Bridge and Shin-Onomichi Bridge from Senkoji Temple" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Higashitsuchidocho%2C_Onomichi%2C_Hiroshima_Prefecture_722-0033%2C_Japan_-_panoramio_%284%29.jpg/960px-Higashitsuchidocho%2C_Onomichi%2C_Hiroshima_Prefecture_722-0033%2C_Japan_-_panoramio_%284%29.jpg", cap: "Higashitsuchidocho, Onomichi, Hiroshima Prefecture 722-0033, Ja…" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Stele_of_Senkoji_Temple_in_Senkoji_Park.jpg/960px-Stele_of_Senkoji_Temple_in_Senkoji_Park.jpg", cap: "Stele of Senkoji Temple in Senkoji Park" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/%E5%B0%BE%E9%81%93_Onomachi_-_panoramio.jpg/960px-%E5%B0%BE%E9%81%93_Onomachi_-_panoramio.jpg", cap: "尾道 Onomachi" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/View_of_Onomichi_Channel_and_Mukaishima_Island_near_Senkoji_Temple_3.jpg/960px-View_of_Onomichi_Channel_and_Mukaishima_Island_near_Senkoji_Temple_3.jpg", cap: "View of Onomichi Channel and Mukaishima Island near Senkoji Temple" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/View_of_Onomichi_Bridge_and_Shin-Onomichi_Bridge_near_Bell_Tower_of_Senkoji_Temple_2.jpg/960px-View_of_Onomichi_Bridge_and_Shin-Onomichi_Bridge_near_Bell_Tower_of_Senkoji_Temple_2.jpg", cap: "View of Onomichi Bridge and Shin-Onomichi Bridge near Bell Towe…" }
  ]
},
{
  id: "kurashiki",
  name: "Kurashiki / Takamatsu",
  jp: "倉敷",
  region: "Okayama / Kagawa",
  type: "stop",
  days: "Day 18",
  legMiles: 44,
  lat: 34.5985, lng: 133.7720, zoom: 14,
  tagline: "A willow-lined canal quarter — or a ferry to the art islands.",
  intro: [
    "Kurashiki's Bikan historical quarter preserves white-walled Edo storehouses along a willow-fringed canal, now galleries, cafes and the celebrated Ohara Museum of Art.",
    "Alternatively, base near Takamatsu for a ferry to Naoshima, the famous 'art island' of museums and outdoor sculpture — pick the canal town or the art islands to suit the family's mood."
  ],
  highlights: [
    "Kurashiki Bikan canal quarter and boat rides",
    "Ohara Museum of Art, Japan's first Western-art museum",
    "Naoshima art island (via Takamatsu/Uno ferry)",
    "Ritsurin Garden in Takamatsu, a strolling masterpiece"
  ],
  food: [
    { n: "Sanuki udon", d: "Kagawa's firm, springy udon — Japan's udon capital." },
    { n: "Mamakari", d: "Marinated sardine-like fish, an Okayama specialty." },
    { n: "Okayama fruit", d: "White peaches and Muscat grapes in season." }
  ],
  hotels: [
    { n: "Ryokan Kurashiki", t: "Boutique ryokan", d: "Converted storehouses right on the Bikan canal.", price: "¥28,000–60,000" },
    { n: "Kurashiki Kokusai Hotel", t: "Nice hotel", d: "Classic central hotel with parking by the old quarter.", price: "¥18,000–35,000" },
    { n: "JR Hotel Clement Takamatsu", t: "Family-friendly", d: "Harbourfront by the Naoshima ferry, big rooms, parking.", price: "¥18,000–35,000" }
  ],
  links: [
    { l: "Kurashiki tourism (official)", u: "https://www.kurashiki-tabi.jp/en/" },
    { l: "Wikipedia — Kurashiki", u: "https://en.wikipedia.org/wiki/Kurashiki" }
  ],
  photos: [
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Kurashiki_Bikan_-02.jpg/960px-Kurashiki_Bikan_-02.jpg", cap: "Kurashiki Bikan canal quarter" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Kurashiki_Canal_Area.jpg/960px-Kurashiki_Canal_Area.jpg", cap: "Kurashiki Canal Area" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/080727_Ohara_Museum_of_Art_Kurashiki_Okayama_pref_Japan01s3.jpg/960px-080727_Ohara_Museum_of_Art_Kurashiki_Okayama_pref_Japan01s3.jpg", cap: "Ohara Museum of Art Kurashiki Okayama pref" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/211203_Kurashiki_Ivy_Square_Kurashiki_Okayama_pref_Japan01s3.jpg/960px-211203_Kurashiki_Ivy_Square_Kurashiki_Okayama_pref_Japan01s3.jpg", cap: "Kurashiki Ivy Square Kurashiki Okayama pref" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Edvard_Munch_-_Madonna_-_Google_Art_Project_%28495100%29.jpg/960px-Edvard_Munch_-_Madonna_-_Google_Art_Project_%28495100%29.jpg", cap: "Edvard Munch - Madonna - Google Art Project" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Okayama_prfectural_Kurashiki_Seiryo_high_school.jpg/960px-Okayama_prfectural_Kurashiki_Seiryo_high_school.jpg", cap: "Okayama prfectural Kurashiki Seiryo high school" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/%E5%80%89%E6%95%B7%E5%B7%9D_Kurashike_Canal_-_panoramio.jpg/960px-%E5%80%89%E6%95%B7%E5%B7%9D_Kurashike_Canal_-_panoramio.jpg", cap: "倉敷川 Kurashike Canal" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/161015_At_Kurashiki_Bikan_historical_quarter_Kurashiki_Okayama_pref_Japan01s3.jpg/960px-161015_At_Kurashiki_Bikan_historical_quarter_Kurashiki_Okayama_pref_Japan01s3.jpg", cap: "161015 At Kurashiki Bikan historical quarter Kurashiki Okayama pref…" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Fire_lookout_tower%2C_Kurashiki_Bikan_historical_quarter_-_Aug_11%2C_2014.jpg/960px-Fire_lookout_tower%2C_Kurashiki_Bikan_historical_quarter_-_Aug_11%2C_2014.jpg", cap: "Fire lookout tower, Kurashiki Bikan historical quarter - Aug" }
  ]
},
{
  id: "himeji",
  name: "Himeji / Kobe",
  jp: "姫路",
  region: "Hyogo",
  type: "stop",
  days: "Day 19",
  legMiles: 67,
  lat: 34.8394, lng: 134.6939, zoom: 14,
  tagline: "Japan's most magnificent castle, then into cosmopolitan Kobe.",
  intro: [
    "Himeji Castle — the 'White Heron' — is Japan's finest surviving feudal castle, a UNESCO World Heritage masterpiece of brilliant white walls and soaring keeps, and a genuine wow moment for all ages.",
    "From Himeji it's a short hop into Kobe, a stylish port city famous for its beef, harbour nightscape and relaxed international feel — a comfortable penultimate night."
  ],
  highlights: [
    "Himeji Castle, original and unrestored since 1609",
    "Koko-en garden beside the castle",
    "Kobe Harborland and the Meriken Park waterfront",
    "Mt. Rokko / Maya night view over Kobe"
  ],
  food: [
    { n: "Kobe beef", d: "World-renowned wagyu — teppanyaki is the classic way." },
    { n: "Sobameshi", d: "Kobe's hearty fried noodle-and-rice comfort dish." },
    { n: "Akashiyaki", d: "Soft egg-rich octopus dumplings from nearby Akashi." }
  ],
  hotels: [
    { n: "Kobe Kitano Hotel", t: "Boutique", d: "Charming hotel in the historic foreign quarter.", price: "¥20,000–40,000" },
    { n: "ANA Crowne Plaza Kobe", t: "Nice hotel", d: "Harbour and mountain views, parking; near Shin-Kobe.", price: "¥18,000–35,000" },
    { n: "Hotel Nikko Himeji", t: "Family-friendly", d: "If staying in Himeji, central by the station with parking.", price: "¥18,000–35,000" }
  ],
  links: [
    { l: "Himeji Castle (official)", u: "https://www.city.himeji.lg.jp/castle/" },
    { l: "Wikipedia — Himeji Castle", u: "https://en.wikipedia.org/wiki/Himeji_Castle" }
  ],
  photos: [
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/Himeji_Castle%2C_November_2016_-02.jpg/960px-Himeji_Castle%2C_November_2016_-02.jpg", cap: "Himeji Castle, the White Heron" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Ch%C3%A2teau_de_Himeji02.jpg/960px-Ch%C3%A2teau_de_Himeji02.jpg", cap: "Château de" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Chrysanthemum_japonense_-_Koko-en_01.jpg/960px-Chrysanthemum_japonense_-_Koko-en_01.jpg", cap: "Chrysanthemum japonense - Koko-en" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Family_picnic%2C_Himeji_Castle_grounds%2C_Himeji%2C_2016.jpg/960px-Family_picnic%2C_Himeji_Castle_grounds%2C_Himeji%2C_2016.jpg", cap: "Family picnic, Himeji Castle grounds, Himeji" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Himeji_Koko-en_Garden_NIK_0898.jpg/960px-Himeji_Koko-en_Garden_NIK_0898.jpg", cap: "Himeji Koko-en Garden NIK" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Sakura_at_Himeji_Castle_in_2013_No%2C01.JPG/960px-Sakura_at_Himeji_Castle_in_2013_No%2C01.JPG", cap: "Sakura at Himeji Castle in" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Himeji_Castle_The_Keep_Towers.jpg/960px-Himeji_Castle_The_Keep_Towers.jpg", cap: "Himeji Castle The Keep Towers" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Himeji_Koukoen32n4592.jpg/960px-Himeji_Koukoen32n4592.jpg", cap: "Himeji" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Throngs_of_people_walking_towards_Himeji_Castle%2C_Himeji%2C_2016.jpg/960px-Throngs_of_people_walking_towards_Himeji_Castle%2C_Himeji%2C_2016.jpg", cap: "Throngs of people walking towards Himeji Castle, Himeji" }
  ]
},
{
  id: "osaka",
  name: "Osaka / Kansai",
  jp: "大阪",
  region: "Kansai",
  type: "end",
  days: "Days 20–21",
  legMiles: 60,
  lat: 34.6873, lng: 135.5259, zoom: 13,
  tagline: "Bike return, big-city food, and an optional Kyoto buffer day.",
  intro: [
    "The tour finishes in Kansai, returning the motorcycles near Osaka. Osaka is Japan's kitchen — a brash, friendly food city built for celebrating the end of a long journey.",
    "A buffer Day 21 leaves room for Kyoto's temples or an Osaka family day (aquarium, castle, Dotonbori) before flying home — and slack in case weather shifted any earlier leg."
  ],
  highlights: [
    "Osaka Castle and its broad moats and park",
    "Dotonbori neon, street food and the Glico sign",
    "Osaka Aquarium Kaiyukan, a top kids' day",
    "Shinsekai & Tsutenkaku tower — retro kushikatsu district",
    "Day-trip option: Kyoto's Fushimi Inari and temples"
  ],
  food: [
    { n: "Takoyaki", d: "Octopus dumplings — the icon of Osaka street food." },
    { n: "Okonomiyaki", d: "Savoury griddle pancakes, cooked at your table." },
    { n: "Kushikatsu", d: "Crisp deep-fried skewers, a Shinsekai specialty." },
    { n: "GLITCH Coffee Osaka", d: "Specialty pour-over coffee — a parents' pick for a calm city break." }
  ],
  hotels: [
    { n: "The Ritz-Carlton Osaka", t: "Luxury", d: "A grand finish; valet parking — confirm motorcycle handling.", price: "¥80,000–250,000" },
    { n: "Mitsui Garden Hotel Osaka Premier", t: "Nice hotel", d: "Riverside 4-star with family rooms and city views; parking nearby.", price: "¥18,000–35,000" },
    { n: "Swissotel Nankai Osaka", t: "Nice hotel", d: "Above Namba station, central for the airport run.", price: "¥18,000–35,000" },
    { n: "Hotel near rental return", t: "Practical", d: "Stay close to the drop-off point for an easy final morning.", price: "¥9,000–16,000" }
  ],
  links: [
    { l: "Osaka Info (official)", u: "https://osaka-info.jp/en/" },
    { l: "Wikipedia — Osaka", u: "https://en.wikipedia.org/wiki/Osaka" }
  ],
  photos: [
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Osaka_Castle%2C_Keep_tower%2C_South_view_20190415_1.jpg/960px-Osaka_Castle%2C_Keep_tower%2C_South_view_20190415_1.jpg", cap: "Osaka Castle keep" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Dotonbori%2C_Osaka%2C_at_night%2C_November_2016.jpg/960px-Dotonbori%2C_Osaka%2C_at_night%2C_November_2016.jpg", cap: "Dotonbori, Osaka, at night, November" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/OSAKA_Tsutenkaku_%2820190810%29.jpg/960px-OSAKA_Tsutenkaku_%2820190810%29.jpg", cap: "OSAKA Tsutenkaku" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Dotonbori_Neon_Sign%2C_Osaka_20190415_1.jpg/960px-Dotonbori_Neon_Sign%2C_Osaka_20190415_1.jpg", cap: "Dotonbori Neon Sign, Osaka" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Shinsekai_and_Tsutenkaku_Tower.jpg/960px-Shinsekai_and_Tsutenkaku_Tower.jpg", cap: "Shinsekai and Tsutenkaku Tower" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Osaka_Castle_Outer_Moat_and_Osaka_Business_Park%2C_November_2016.jpg/960px-Osaka_Castle_Outer_Moat_and_Osaka_Business_Park%2C_November_2016.jpg", cap: "Osaka Castle Outer Moat and Osaka Business Park, November" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Dotonbori_Osaka_1910.jpg/960px-Dotonbori_Osaka_1910.jpg", cap: "Dotonbori Osaka" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Osaka_Castle_August_2024.jpg/960px-Osaka_Castle_August_2024.jpg", cap: "Osaka Castle August" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Osaka_Castle_and_Gokuraku-bashi_Bridge.jpg/960px-Osaka_Castle_and_Gokuraku-bashi_Bridge.jpg", cap: "Osaka Castle and Gokuraku-bashi Bridge" }
  ]
}
];

/* ============================================================
   Getting there from Seattle (home).
   The bike tour is a one-way rental Tokyo -> Osaka, so the
   flights are an OPEN-JAW: into Tokyo, home out of Osaka.
   Fares are indicative (economy, per person) from public
   search data — click the Expedia links for live prices.
   ============================================================ */
window.HOME = { city: "Seattle", airport: "SEA" };
window.FLIGHTS = {
  intro: "You're starting from Seattle, and the motorcycles are a one-way rental (pick up near Tokyo, drop near Osaka). That means the smartest ticket is an open-jaw / multi-city booking: fly into Tokyo, and fly home out of Osaka — so you never backtrack.",
  season: "Best window: October–early November 2026 (the trip's preferred season). Sample dates below assume ~21 nights on the ground; adjust freely.",
  legs: [
    {
      dir: "Outbound",
      from: "Seattle · SEA",
      to: "Tokyo · Haneda (HND)",
      sample: "Sample: depart Fri 9 Oct 2026 → arrive Sat 10 Oct (next day, crossing the date line)",
      type: "Nonstop",
      duration: "≈ 10h 30m",
      airlines: ["ANA", "Delta", "Japan Airlines", "Alaska"],
      fareFrom: "$440",
      note: "Haneda (HND) is far closer to Yokohama than Narita — better for Day-1 bike pickup. Narita (NRT) nonstops on JAL/Alaska are an easy alternative.",
      expedia: "https://www.expedia.com/lp/flights/sea/hnd/seattle-to-tokyo",
      expediaAlt: "https://www.expedia.com/lp/flights/sea/nrt/seattle-to-tokyo"
    },
    {
      dir: "Return",
      from: "Osaka · Kansai (KIX)",
      to: "Seattle · SEA",
      sample: "Sample: depart ~Fri 30 Oct 2026 (after the bikes are returned)",
      type: "1 stop",
      duration: "≈ 13h 30m+ (plus layover)",
      airlines: ["ANA", "United", "EVA Air", "Korean Air", "Delta"],
      fareFrom: "$490",
      note: "There is no nonstop Osaka–Seattle. Expect one connection via an Asian hub (Tokyo HND/NRT, Taipei TPE, or Seoul ICN). Pick the shortest total travel time, not just the lowest fare.",
      expedia: "https://www.expedia.com/lp/flights/kix/sea/osaka-to-seattle"
    }
  ],
  estimate: "Open-jaw economy realistically lands around $1,100–1,900 per person for October; premium economy/business considerably more. Three travellers (2 adults + child) — kids' fares are usually near-adult on these long-haul routes.",
  tips: [
    "Book as a single multi-city ticket (SEA→HND … KIX→SEA) rather than two one-ways — usually cheaper and protected if a connection slips.",
    "Fly into Haneda if you can: ~30–45 min to Yokohama vs ~1.5–2h from Narita.",
    "From KIX, the Kansai connection eats a day — plan the bike drop-off the day before, not the morning of the flight.",
    "Confirm your International Driving Permits and motorcycle-riding travel insurance before you fly."
  ],
  links: [
    { l: "Expedia — SEA → Tokyo (Haneda)", u: "https://www.expedia.com/lp/flights/sea/hnd/seattle-to-tokyo" },
    { l: "Expedia — SEA → Tokyo (Narita)", u: "https://www.expedia.com/lp/flights/sea/nrt/seattle-to-tokyo" },
    { l: "Expedia — Osaka (KIX) → SEA", u: "https://www.expedia.com/lp/flights/kix/sea/osaka-to-seattle" },
    { l: "Google Flights — open-jaw search", u: "https://www.google.com/travel/flights?q=flights%20Seattle%20to%20Tokyo%20HND%20multi-city%20Osaka%20to%20Seattle" }
  ]
};

/* ============================================================
   Day-by-day schedule with points-of-interest stops.
   day.html builds a timed routine around each day's poi list.
   ============================================================ */
window.DAYS = [
  { d:1, id:"yokohama", miles:0, rest:true, region:"Kanto", title:"Arrival & Bike Pickup", route:"Tokyo / Yokohama",
    desc:"Collect the Africa Twin and CB400X, fit the child's gear, check intercoms and do a gentle shakedown ride. Early night.", tags:["ride"], gfrom:"Haneda Airport, Tokyo", gto:"Yokohama, Japan", gvia:"",
    poi:[{ name: "Minato Mirai 21", what: "Harbour skyline & the Cosmo Clock wheel", q: "Minato Mirai 21 Yokohama", slot: "activity", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/070203_MM21%26FUJI.jpg/960px-070203_MM21%26FUJI.jpg" }, { name: "Cup Noodles Museum", what: "Make-your-own-noodles fun for kids", q: "Cup Noodles Museum Yokohama", slot: "activity", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Cup_Noodle_Museum_Yokohama.jpg/960px-Cup_Noodle_Museum_Yokohama.jpg" }, { name: "Yokohama Chinatown", what: "Welcome dinner — buns & dim sum", q: "Yokohama Chinatown", slot: "lunch", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/JP-Yokohama-_Minato-Mirai-Area-Over-View.jpg/960px-JP-Yokohama-_Minato-Mirai-Area-Over-View.jpg" }] },
  { d:2, id:"hakone", miles:65, dmin:154, rest:false, region:"Hakone", title:"Into the Mountains", route:"Yokohama → Hakone",
    desc:"Easy first leg up to Hakone. Lake Ashi pirate boat and the Hakone Ropeway over the volcanic valley.", tags:["ride", "kid", "onsen"], gfrom:"Yokohama, Japan", gto:"Hakone, Japan", gvia:"Odawara Castle, Japan",
    poi:[{ name: "Odawara Castle", what: "Hilltop castle en route", q: "Odawara Castle", slot: "stop", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Map-of-Odawara-Castle-cropped.jpg/960px-Map-of-Odawara-Castle-cropped.jpg", frac:0.3 }, { name: "Hakone-Yumoto", what: "Onsen-town coffee break", q: "Hakone-Yumoto Station", slot: "coffee", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Hakone-Yumoto-Station-Front-entrance.jpg/960px-Hakone-Yumoto-Station-Front-entrance.jpg", frac:0.55 }, { name: "Lake Ashi & Hakone Shrine", what: "Lakeside torii & pirate boat, soba lunch", q: "Hakone Shrine Lake Ashi", slot: "lunch", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Hakone_Shrine_from_Lake_Ashi%2C_May_2017.jpg/960px-Hakone_Shrine_from_Lake_Ashi%2C_May_2017.jpg", frac:0.8 }, { name: "Owakudani", what: "Volcanic valley & black eggs", q: "Owakudani", slot: "scenic", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Mount_Myojingatake_and_Owakudani_Station_from_Owakudani_Valley.JPG/960px-Mount_Myojingatake_and_Owakudani_Station_from_Owakudani_Valley.JPG", frac:0.92 }] },
  { d:3, id:"hakone", miles:0, rest:true, region:"Hakone", title:"Hakone Rest Day", route:"Hakone (no transfer)",
    desc:"Open-Air Museum, Owakudani black eggs, and a long onsen soak. No packing, no riding pressure.", tags:["rest", "onsen", "kid", "stay2"], gfrom:"Hakone, Japan", gto:"Owakudani, Hakone, Japan", gvia:"",
    poi:[{ name: "Hakone Open-Air Museum", what: "Sculpture park with kids' play zones", q: "Hakone Open-Air Museum", slot: "activity", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Hakone_Open-air_Museum_20211202-5.jpg/960px-Hakone_Open-air_Museum_20211202-5.jpg" }, { name: "Owakudani Ropeway", what: "Steam vents & black eggs", q: "Owakudani", slot: "activity", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Mount_Myojingatake_and_Owakudani_Station_from_Owakudani_Valley.JPG/960px-Mount_Myojingatake_and_Owakudani_Station_from_Owakudani_Valley.JPG" }, { name: "Hakone Shrine", what: "Lakeside red torii photo", q: "Hakone Shrine", slot: "scenic", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Hakone_Shrine_2025.jpg/960px-Hakone_Shrine_2025.jpg" }] },
  { d:4, id:"izu", miles:66, dmin:160, rest:false, region:"Izu", title:"Izu Coastal Run", route:"Hakone → Izu (Shimoda)",
    desc:"Scenic coastal roads down the Izu Peninsula. Beaches, capes and fresh seafood lunches.", tags:["ride", "kid"], gfrom:"Hakone, Japan", gto:"Shimoda, Shizuoka, Japan", gvia:"Jogasaki Coast, Japan",
    poi:[{ name: "Manazuru Cape", what: "Coastal viewpoint", q: "Manazuru Cape", slot: "stop", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Cape_Manazuru_%2813099158195%29.jpg/960px-Cape_Manazuru_%2813099158195%29.jpg", frac:0.2 }, { name: "Jogasaki Coast", what: "Lava cliffs & suspension bridge", q: "Jogasaki Coast", slot: "coffee", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Jogasaki_Coast_2009-07-26_%283778041816%29.jpg/960px-Jogasaki_Coast_2009-07-26_%283778041816%29.jpg", frac:0.55 }, { name: "Kawazu", what: "Kinmedai seafood lunch", q: "Kawazu Shizuoka", slot: "lunch", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Midaka%2C_Kawazu_2011-10-16.jpg/960px-Midaka%2C_Kawazu_2011-10-16.jpg", frac:0.8 }, { name: "Shirahama Beach", what: "Beach & old port town", q: "Shirahama Beach Shimoda", slot: "scenic", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/IZU_Shirahama_-_panoramio.jpg/960px-IZU_Shirahama_-_panoramio.jpg", frac:0.95 }] },
  { d:5, id:"fuji", miles:86, dmin:188, rest:false, region:"Fuji", title:"To the Five Lakes", route:"Izu → Fuji Five Lakes",
    desc:"North toward Kawaguchiko with Mt. Fuji filling the windscreen. Lakeside hotel for the night.", tags:["ride", "kid"], gfrom:"Shimoda, Shizuoka, Japan", gto:"Lake Kawaguchiko, Japan", gvia:"Mishima Skywalk, Japan",
    poi:[{ name: "Mishima Skywalk", what: "Japan's longest suspension footbridge, Fuji view", q: "Mishima Skywalk", slot: "stop", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Mishima_Skywalk_North_Facade2023.jpg/960px-Mishima_Skywalk_North_Facade2023.jpg", frac:0.28 }, { name: "Mishima", what: "Coffee break", q: "Mishima Station", slot: "coffee", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/250720_Platform_of_Shinkansen_Mishima_Station_03.jpg/960px-250720_Platform_of_Shinkansen_Mishima_Station_03.jpg", frac:0.33 }, { name: "Oshino Hakkai", what: "Spring-water village, soba lunch", q: "Oshino Hakkai", slot: "lunch", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/231028_Waku-ike_Oshino_Hakkai_springs_Oshino_Yamanashi_pref_Japan01s3.jpg/960px-231028_Waku-ike_Oshino_Hakkai_springs_Oshino_Yamanashi_pref_Japan01s3.jpg", frac:0.8 }, { name: "Lake Kawaguchiko", what: "Lakeside arrival & Fuji views", q: "Lake Kawaguchiko", slot: "scenic", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Lake_Kawaguchiko_20140310-14.JPG/960px-Lake_Kawaguchiko_20140310-14.JPG", frac:0.97 }] },
  { d:6, id:"fuji", miles:25, rest:true, region:"Fuji", title:"Fuji Exploration", route:"Fuji Five Lakes (light riding)",
    desc:"Lake loop, Oishi Park, cable car viewpoint, and a relaxed afternoon. Optional gentle ride only.", tags:["rest", "kid"], gfrom:"Lake Kawaguchiko, Japan", gto:"Oishi Park, Yamanashi, Japan", gvia:"",
    poi:[{ name: "Oishi Park", what: "Flower beds with Fuji behind", q: "Oishi Park Kawaguchiko", slot: "activity", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Lake_Kawaguchiko_Sakura_Mount_Fuji_3.JPG/960px-Lake_Kawaguchiko_Sakura_Mount_Fuji_3.JPG" }, { name: "Chureito Pagoda", what: "Iconic pagoda-and-Fuji view", q: "Chureito Pagoda", slot: "activity", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Arakurayama_Sengen_Park_09.jpg/960px-Arakurayama_Sengen_Park_09.jpg" }, { name: "Mt Fuji Panoramic Ropeway", what: "Kachi-Kachi cable car viewpoint", q: "Mt Fuji Panoramic Ropeway", slot: "scenic", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Kachi_Kachi_Ropeway_%2816217350765%29.jpg/960px-Kachi_Kachi_Ropeway_%2816217350765%29.jpg" }] },
  { d:7, id:"nagoya", miles:202, dmin:299, rest:false, region:"Chubu", title:"Westward Transfer", route:"Fuji → Nagoya / Gifu",
    desc:"The longest practical transfer of the trip, kept on wider national roads. Comfortable city hotel.", tags:["ride"], gfrom:"Lake Kawaguchiko, Japan", gto:"Nagoya, Japan", gvia:"Magome-juku, Japan",
    poi:[{ name: "Lake Suwa", what: "Lakeside leg-stretch & coffee", q: "Lake Suwa", slot: "coffee", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Lake_Suwa%2C_Nagano_Prefecture%3B_May_2019_%2804%29.jpg/960px-Lake_Suwa%2C_Nagano_Prefecture%3B_May_2019_%2804%29.jpg", frac:0.45 }, { name: "Magome-juku", what: "Kiso Valley post-town walk & lunch", q: "Magome-juku", slot: "lunch", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Magome-Juku_StoneSlope.jpg/960px-Magome-Juku_StoneSlope.jpg", frac:0.7 }, { name: "Ena Gorge", what: "River-gorge photo stop", q: "Ena Gorge", slot: "scenic", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Ena_Ravine.JPG/960px-Ena_Ravine.JPG", frac:0.88 }] },
  { d:8, id:"awaji", miles:228, dmin:312, rest:false, region:"Setouchi", title:"Bridge to the Sea", route:"Nagoya → Awaji Island",
    desc:"Cross toward the Seto Inland Sea via Awaji. Coastal scenery and onion-famous local food.", tags:["ride", "kid"], gfrom:"Nagoya, Japan", gto:"Awaji Island, Japan", gvia:"Akashi Kaikyo Bridge, Japan",
    poi:[{ name: "Akashi Kaikyo Bridge", what: "World-famous suspension span", q: "Akashi Kaikyo Bridge", slot: "stop", img: "https://upload.wikimedia.org/wikipedia/commons/5/56/Akashi-Kaikyo_Bridge%2C_Japan_%28ASTER%29.jpg", frac:0.86 }, { name: "Awaji Service Area", what: "Bridge-view coffee break", q: "Awaji Service Area", slot: "coffee", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Awaji-SA-R.jpg/960px-Awaji-SA-R.jpg", frac:0.9 }, { name: "Awaji onion lunch", what: "Awaji beef & sweet onions", q: "Awaji Island", slot: "lunch", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Awaji_Island_milk.JPG/960px-Awaji_Island_milk.JPG", frac:0.96 }, { name: "Awaji Hanasajiki", what: "Flower hills over the sea", q: "Awaji Hanasajiki", slot: "scenic", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/2023-04-15_Awaji_Hanasajiki%2C%E6%B7%A1%E8%B7%AF%E8%8A%B1%E6%A1%9F%E6%95%B7_DSCF0921%E2%98%86%E5%BD%A1.jpg/960px-2023-04-15_Awaji_Hanasajiki%2C%E6%B7%A1%E8%B7%AF%E8%8A%B1%E6%A1%9F%E6%95%B7_DSCF0921%E2%98%86%E5%BD%A1.jpg", frac:0.99 }] },
  { d:9, id:"iya", miles:139, dmin:260, rest:false, region:"Shikoku", title:"Into Iya Valley", route:"Awaji → Iya / Oboke",
    desc:"Enter Shikoku's dramatic gorge country. Gentle paved valley roads to a remote onsen ryokan.", tags:["ride", "onsen"], gfrom:"Awaji Island, Japan", gto:"Oboke, Tokushima, Japan", gvia:"Uzunomichi, Naruto, Japan",
    poi:[{ name: "Naruto Whirlpools", what: "Uzunomichi glass-floor walkway", q: "Uzunomichi Naruto", slot: "stop", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Naruto_Strait_from_Uzunomichi_Promenade.jpg/960px-Naruto_Strait_from_Uzunomichi_Promenade.jpg", frac:0.15 }, { name: "Tokushima", what: "Riverside coffee break", q: "Tokushima Station", slot: "coffee", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Tokushima_JR_Sta_2020%2C9.jpg/960px-Tokushima_JR_Sta_2020%2C9.jpg", frac:0.33 }, { name: "Oboke Gorge", what: "Gorge-side lunch", q: "Oboke Gorge", slot: "lunch", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Oboke_Gorge_%E5%A4%A7%E6%AD%A5%E5%8D%B1%E5%B3%BD_-_panoramio.jpg/960px-Oboke_Gorge_%E5%A4%A7%E6%AD%A5%E5%8D%B1%E5%B3%BD_-_panoramio.jpg", frac:0.85 }, { name: "Iya Valley viewpoint", what: "Vine bridge & gorge scenery", q: "Iya Valley", slot: "scenic", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Iya_Valley_03.jpg/960px-Iya_Valley_03.jpg", frac:0.95 }] },
  { d:10, id:"iya", miles:25, rest:true, region:"Shikoku", title:"Iya Rest Day", route:"Iya Valley (no transfer)",
    desc:"Kazurabashi vine bridge, the peeing-boy statue viewpoint, and an Oboke Gorge sightseeing boat.", tags:["rest", "kid", "onsen", "stay2"], gfrom:"Oboke, Tokushima, Japan", gto:"Iya Kazurabashi, Japan", gvia:"",
    poi:[{ name: "Kazurabashi vine bridge", what: "Cross the swaying vine bridge", q: "Iya Kazurabashi", slot: "activity", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Iya_Kazurabashi-3.jpg/960px-Iya_Kazurabashi-3.jpg" }, { name: "Oboke Gorge boat", what: "Sightseeing boat on the Yoshino", q: "Oboke Gorge", slot: "activity", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Oboke_Gorge_%E5%A4%A7%E6%AD%A5%E5%8D%B1%E5%B3%BD_-_panoramio.jpg/960px-Oboke_Gorge_%E5%A4%A7%E6%AD%A5%E5%8D%B1%E5%B3%BD_-_panoramio.jpg" }, { name: "Peeing Boy statue", what: "Cliff-edge viewpoint", q: "Iya no Shobenkozo", slot: "scenic", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Iya_Kazurabashi-4.jpg/960px-Iya_Kazurabashi-4.jpg" }, { name: "Nagoro Scarecrow Village", what: "Quirky kid stop", q: "Nagoro Scarecrow Village", slot: "scenic", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Iya_Kazurabashi-4.jpg/960px-Iya_Kazurabashi-4.jpg" }] },
  { d:11, id:"kochi", miles:72, dmin:122, rest:false, region:"Shikoku", title:"Down to the Coast", route:"Iya → Kochi",
    desc:"River valleys open out to the Pacific. Kochi Castle and Katsurahama beach in the evening.", tags:["ride", "kid"], gfrom:"Oboke, Tokushima, Japan", gto:"Kochi, Japan", gvia:"Ryugado Cave, Japan",
    poi:[{ name: "Otoyo michi-no-eki", what: "Roadside coffee break", q: "Michi-no-Eki Otoyo", slot: "coffee", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Kochi_Castle08s3872.jpg/960px-Kochi_Castle08s3872.jpg", frac:0.22 }, { name: "Ryugado Cave", what: "Dramatic limestone cave", q: "Ryugado Cave Kochi", slot: "stop", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Kami_Kochi_Ryugado_East_Entrance_1.jpg/960px-Kami_Kochi_Ryugado_East_Entrance_1.jpg", frac:0.52 }, { name: "Kochi Castle & Hirome Market", what: "Original keep, market lunch", q: "Kochi Castle", slot: "lunch", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Kochi_Castle08s3872.jpg/960px-Kochi_Castle08s3872.jpg", frac:0.82 }, { name: "Katsurahama", what: "Pacific beach & Ryoma statue", q: "Katsurahama", slot: "scenic", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Katsurahama_Aquarium_01.jpg/960px-Katsurahama_Aquarium_01.jpg", frac:0.95 }] },
  { d:12, id:"shimanto", miles:128, dmin:274, rest:false, region:"Shikoku", title:"The Clear River", route:"Kochi → Shimanto River",
    desc:"Follow the Shimanto, Japan's last free-flowing clear river, past its low submersible bridges.", tags:["ride", "kid"], gfrom:"Kochi, Japan", gto:"Shimanto, Kochi, Japan", gvia:"Niyodo River, Japan",
    poi:[{ name: "Niyodo Blue river", what: "Famous translucent-blue river", q: "Niyodo River", slot: "stop", img: "https://upload.wikimedia.org/wikipedia/commons/d/d2/Niyodo_River_04.jpg", frac:0.22 }, { name: "Susaki", what: "Nabeyaki-ramen coffee stop", q: "Susaki Kochi", slot: "coffee", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Susaki_city_view.jpg/960px-Susaki_city_view.jpg", frac:0.35 }, { name: "Tatsukushi coast", what: "Seaside lunch", q: "Tatsukushi", slot: "lunch", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Tatsukushi_05.JPG/960px-Tatsukushi_05.JPG", frac:0.85 }, { name: "Sada Chinkabashi", what: "Shimanto 'sinking bridge' photo", q: "Sada Chinkabashi Shimanto", slot: "scenic", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Shimanto_sada_chinkabashi.jpg/960px-Shimanto_sada_chinkabashi.jpg", frac:0.95 }] },
  { d:13, id:"shimanto", miles:20, rest:true, region:"Shikoku", title:"Shimanto Rest Day", route:"Shimanto River (no transfer)",
    desc:"River canoeing or a sightseeing boat, riverside cycling, and slow rural time by the water.", tags:["rest", "kid", "stay2"], gfrom:"Shimanto, Kochi, Japan", gto:"Shimanto River, Japan", gvia:"",
    poi:[{ name: "Shimanto River canoe", what: "Canoe or SUP on clear water", q: "Shimanto River canoe", slot: "activity", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Shimanto_River_%285279082249%29.jpg/960px-Shimanto_River_%285279082249%29.jpg" }, { name: "Sinking-bridge cycling", what: "Easy riverside cycle", q: "Shimanto River cycling", slot: "activity", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Shimanto_River_%285279082249%29.jpg/960px-Shimanto_River_%285279082249%29.jpg" }, { name: "Cape Ashizuri", what: "Dramatic cape & lighthouse", q: "Cape Ashizuri", slot: "scenic", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Ashizuri_Cape_01.JPG/960px-Ashizuri_Cape_01.JPG" }] },
  { d:14, id:"dogo", miles:117, dmin:212, rest:false, region:"Shikoku", title:"Castles & Old Towns", route:"Shimanto → Uwajima / Uchiko → Dogo Onsen",
    desc:"Uwajima Castle and Uchiko's preserved merchant streets en route to Matsuyama.", tags:["ride", "kid", "onsen"], gfrom:"Shimanto, Kochi, Japan", gto:"Matsuyama, Ehime, Japan", gvia:"Uwajima, Ehime, Japan",
    poi:[{ name: "Uwajima Castle", what: "Original hilltop keep", q: "Uwajima Castle", slot: "stop", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Uwajima-jo.JPG/960px-Uwajima-jo.JPG", frac:0.3 }, { name: "Uwajima taimeshi", what: "Sea-bream-over-rice lunch", q: "Uwajima", slot: "lunch", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Okinoshima_Island%2C_Uwajima_Ehime_Aerial_photograph.2019.jpg/960px-Okinoshima_Island%2C_Uwajima_Ehime_Aerial_photograph.2019.jpg", frac:0.34 }, { name: "Uchiko old town", what: "Merchant street & kabuki theatre", q: "Uchiko Yokaichi", slot: "scenic", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Yokaichi_Gokoku_Machinami_Preservation_Center.jpg/960px-Yokaichi_Gokoku_Machinami_Preservation_Center.jpg", frac:0.7 }, { name: "Garyu Sanso, Ozu", what: "Riverside villa & garden", q: "Garyu Sanso Ozu", slot: "scenic", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/20150914_ozu_garyusansou.jpg/960px-20150914_ozu_garyusansou.jpg", frac:0.82 }] },
  { d:15, id:"dogo", miles:10, rest:true, region:"Shikoku", title:"Dogo Onsen Rest Day", route:"Matsuyama (no transfer)",
    desc:"Matsuyama Castle by ropeway, then the historic Dogo Onsen bathhouse. Classic onsen evening.", tags:["rest", "onsen", "kid", "stay2"], gfrom:"Matsuyama, Ehime, Japan", gto:"Dogo Onsen, Matsuyama, Japan", gvia:"",
    poi:[{ name: "Matsuyama Castle", what: "Ropeway to a hilltop original castle", q: "Matsuyama Castle Ehime", slot: "activity", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/MEIN%26SMALL_CASTLE_TOWER_%2CMATSUYAMA_CASTLE%28IYO%29.JPG/960px-MEIN%26SMALL_CASTLE_TOWER_%2CMATSUYAMA_CASTLE%28IYO%29.JPG" }, { name: "Dogo Onsen Honkan", what: "Soak in the historic bathhouse", q: "Dogo Onsen Honkan", slot: "activity", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Dogo_Onsen_Honkan_%28Main_building%29%2C_%E9%81%93%E5%BE%8C%E6%B8%A9%E6%B3%89_%E6%9C%AC%E9%A4%A8_-_panoramio.jpg/960px-Dogo_Onsen_Honkan_%28Main_building%29%2C_%E9%81%93%E5%BE%8C%E6%B8%A9%E6%B3%89_%E6%9C%AC%E9%A4%A8_-_panoramio.jpg" }, { name: "Botchan Ressha", what: "Retro steam-style tram", q: "Botchan Ressha Matsuyama", slot: "scenic", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Bocchan-ressha%28Matsuyama-Ekimae%29.jpg/960px-Bocchan-ressha%28Matsuyama-Ekimae%29.jpg" }, { name: "Ishite-ji", what: "Atmospheric pilgrimage temple", q: "Ishiteji Temple Matsuyama", slot: "scenic", img: "https://upload.wikimedia.org/wikipedia/commons/1/15/800px-51_ishiteji_3juutou.JPG" }] },
  { d:16, id:"shimanami", miles:86, dmin:194, rest:false, region:"Setouchi", title:"Shimanami Kaido", route:"Matsuyama → Shimanami → Onomichi / Setoda",
    desc:"The famous island-hopping bridge route across the Seto Inland Sea — gentle, scenic, unforgettable.", tags:["ride", "kid"], gfrom:"Matsuyama, Ehime, Japan", gto:"Onomichi, Hiroshima, Japan", gvia:"Imabari, Ehime, Japan",
    poi:[{ name: "Imabari Castle", what: "Sea-water-moat castle", q: "Imabari Castle", slot: "stop", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Imabari_Castle_01.JPG/960px-Imabari_Castle_01.JPG", frac:0.3 }, { name: "Kirosan Observatory", what: "Bridge panorama coffee", q: "Kirosan Observatory Park", slot: "coffee", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Kurushima-Kaikyo_Bridge%2C_Seto_Inland_Sea%2C_Japan.jpg/960px-Kurushima-Kaikyo_Bridge%2C_Seto_Inland_Sea%2C_Japan.jpg", frac:0.48 }, { name: "Oyamazumi Shrine, Omishima", what: "Samurai-armour shrine, lunch", q: "Oyamazumi Shrine", slot: "lunch", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Okumiya%2C_Oyamazumi_Shrine%2C_Fukushima%2C_Japan.jpg/960px-Okumiya%2C_Oyamazumi_Shrine%2C_Fukushima%2C_Japan.jpg", frac:0.66 }, { name: "Setoda, Ikuchijima", what: "Lemon gelato & Kosanji temple", q: "Setoda", slot: "scenic", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Setoda.jpg/960px-Setoda.jpg", frac:0.86 }] },
  { d:17, id:"onomichi", miles:25, rest:true, region:"Setouchi", title:"Island Rest Day", route:"Setoda / Onomichi (light riding)",
    desc:"Setoda temple, lemon groves and gelato, Onomichi's hillside lanes and cat alley. Easy pace.", tags:["rest", "kid", "stay2"], gfrom:"Onomichi, Hiroshima, Japan", gto:"Setoda, Ikuchijima, Japan", gvia:"",
    poi:[{ name: "Senkoji Ropeway", what: "Hilltop view over the town & sea", q: "Senkoji Temple Onomichi", slot: "activity", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Onomichi_Bridge_and_Onomichi_Channel_from_Main_Hall_of_Senkoji_Temple_2.jpg/960px-Onomichi_Bridge_and_Onomichi_Channel_from_Main_Hall_of_Senkoji_Temple_2.jpg" }, { name: "Temple Walk & cat alley", what: "Lanes, cafes & cats", q: "Onomichi Temple Walk", slot: "activity", img: "https://upload.wikimedia.org/wikipedia/commons/7/7f/Onomichi_TempleWalk_OldHouse.JPG" }, { name: "Kosanji & Hill of Hope", what: "Ornate temple & marble hilltop", q: "Kosanji Temple", slot: "scenic", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/K%C5%8Dsan-ji%2C_Ground_of_Temple_001.jpg/960px-K%C5%8Dsan-ji%2C_Ground_of_Temple_001.jpg" }] },
  { d:18, id:"kurashiki", miles:90, dmin:195, rest:false, region:"Setouchi", title:"Canal Town or Art Island", route:"Onomichi → Kurashiki / Takamatsu",
    desc:"Kurashiki's willow-lined canal quarter, or a ferry to Naoshima's art islands.", tags:["ride", "kid"], gfrom:"Onomichi, Hiroshima, Japan", gto:"Kurashiki, Okayama, Japan", gvia:"Tomonoura, Japan",
    poi:[{ name: "Fukuyama Castle", what: "Station-side castle", q: "Fukuyama Castle", slot: "stop", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Fukuyama_Castle_at_Sunset.jpg/960px-Fukuyama_Castle_at_Sunset.jpg", frac:0.3 }, { name: "Tomonoura", what: "Historic port town coffee", q: "Tomonoura", slot: "coffee", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Fukuyama_municipal_ferry_station.jpg/960px-Fukuyama_municipal_ferry_station.jpg", frac:0.42 }, { name: "Washuzan Viewpoint", what: "Seto Ohashi bridge panorama, lunch", q: "Washuzan", slot: "lunch", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Washuzan_Station-01.jpg/960px-Washuzan_Station-01.jpg", frac:0.78 }, { name: "Kurashiki Bikan", what: "Willow-lined canal quarter", q: "Kurashiki Bikan", slot: "scenic", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Kurashiki_Bikan_historical_quarter_2.jpg/960px-Kurashiki_Bikan_historical_quarter_2.jpg", frac:0.97 }] },
  { d:19, id:"himeji", miles:146, dmin:262, rest:false, region:"Kansai", title:"The Great Castle", route:"Kurashiki → Himeji / Kobe",
    desc:"Himeji Castle, Japan's most magnificent, then into Kobe for the night.", tags:["ride", "kid"], gfrom:"Kurashiki, Okayama, Japan", gto:"Himeji, Hyogo, Japan", gvia:"Korakuen, Okayama, Japan",
    poi:[{ name: "Okayama Korakuen", what: "One of Japan's three great gardens", q: "Korakuen Okayama", slot: "stop", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Korakuen_%28japanese_garden%29_and_Okayama_castle.jpg/960px-Korakuen_%28japanese_garden%29_and_Okayama_castle.jpg", frac:0.25 }, { name: "Okayama", what: "Coffee break", q: "Okayama Station", slot: "coffee", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/JRW-Higashi-okayamaStation.jpg/960px-JRW-Higashi-okayamaStation.jpg", frac:0.29 }, { name: "Himeji Castle & Koko-en", what: "White Heron castle + garden, lunch", q: "Himeji Castle", slot: "lunch", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Ch%C3%A2teau_de_Himeji02.jpg/960px-Ch%C3%A2teau_de_Himeji02.jpg", frac:0.8 }, { name: "Kobe Harborland", what: "Harbour evening & Kobe beef", q: "Kobe Harborland", slot: "scenic", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Harborland_Kobe_Japan01-r.jpg/960px-Harborland_Kobe_Japan01-r.jpg", frac:0.98 }] },
  { d:20, id:"osaka", miles:76, dmin:132, rest:false, region:"Kansai", title:"Finish in Kansai", route:"Kobe → Osaka / Kansai",
    desc:"Short final leg into the city. Return the motorcycles and celebrate the journey.", tags:["ride", "end"], gfrom:"Himeji, Hyogo, Japan", gto:"Osaka, Japan", gvia:"Kobe Harborland, Japan",
    poi:[{ name: "Akashi Kaikyo Bridge", what: "Farewell bridge photo", q: "Akashi Kaikyo Bridge", slot: "stop", img: "https://upload.wikimedia.org/wikipedia/commons/5/56/Akashi-Kaikyo_Bridge%2C_Japan_%28ASTER%29.jpg", frac:0.35 }, { name: "Kobe Harborland", what: "Kobe beef lunch & port", q: "Kobe Harborland", slot: "lunch", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Harborland_Kobe_Japan01-r.jpg/960px-Harborland_Kobe_Japan01-r.jpg", frac:0.58 }, { name: "Dotonbori, Osaka", what: "Bike return, then neon & dinner", q: "Dotonbori Osaka", slot: "scenic", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Dotonbori%2C_Osaka%2C_at_night%2C_November_2016.jpg/960px-Dotonbori%2C_Osaka%2C_at_night%2C_November_2016.jpg", frac:0.95 }] },
  { d:21, id:"osaka", miles:0, rest:true, region:"Kansai", title:"Buffer & Departure", route:"Osaka / Kyoto",
    desc:"Flexible buffer day — Kyoto temples or Osaka food and aquarium before flying home.", tags:["rest", "kid"], gfrom:"Osaka, Japan", gto:"Kyoto, Japan", gvia:"",
    poi:[{ name: "Fushimi Inari, Kyoto", what: "Thousand vermilion torii gates", q: "Fushimi Inari Taisha", slot: "activity", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Fushimi_Inari-taisha%2C_Kyoto%2C_20240818_1343_4411.jpg/960px-Fushimi_Inari-taisha%2C_Kyoto%2C_20240818_1343_4411.jpg" }, { name: "Osaka Castle", what: "Castle & park", q: "Osaka Castle", slot: "activity", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Osaka_Castle%2C_Keep_tower%2C_South_view_20190415_1.jpg/960px-Osaka_Castle%2C_Keep_tower%2C_South_view_20190415_1.jpg" }, { name: "Kaiyukan / Dotonbori", what: "Aquarium or final food street", q: "Osaka Aquarium Kaiyukan", slot: "scenic", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Entrance_of_Osaka_Aquarium_%22Kaiyukan%22.jpg/960px-Entrance_of_Osaka_Aquarium_%22Kaiyukan%22.jpg" }] },
];
