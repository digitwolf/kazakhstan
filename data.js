/* ============================================================
   Japan Family Motorcycle Tour — destination data
   Shared by index.html and place.html
   Photos: Wikimedia Commons (all URLs verified reachable).
   Hotels are SUGGESTIONS — confirm motorcycle parking,
   passenger/child rules and availability before booking.
   ============================================================ */
const U = "https://upload.wikimedia.org/wikipedia/commons/thumb/";

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
    "Akarenga (Red Brick) Warehouse for dinner by the bay"
  ],
  food: [
    { n: "Yokohama Chinatown", d: "Japan's largest Chinatown — steamed buns and family-friendly dim sum." },
    { n: "Iekei ramen", d: "Yokohama's rich soy-and-pork-bone ramen style, born here." },
    { n: "Sanma-men", d: "Local stir-fried-vegetable noodle dish unique to the city." }
  ],
  hotels: [
    { n: "InterContinental Yokohama Grand", t: "Nice hotel", d: "Bay views, valet/garage parking — confirm motorcycle space.", price: "¥18,000–35,000" },
    { n: "Navios Yokohama", t: "Family-friendly", d: "Simple harbourside hotel, walkable to attractions.", price: "¥18,000–35,000" },
    { n: "Toyoko Inn / APA (Shin-Yokohama)", t: "Practical", d: "Reliable budget chains near the rental areas; ask about bike parking.", price: "¥9,000–16,000" }
  ],
  links: [
    { l: "Yokohama Official Visitors' Guide", u: "https://www.yokohamajapan.com/" },
    { l: "Wikipedia — Yokohama", u: "https://en.wikipedia.org/wiki/Yokohama" }
  ],
  photos: [
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/JP-Yokohama-_Minato-Mirai-Area-Over-View.jpg/960px-JP-Yokohama-_Minato-Mirai-Area-Over-View.jpg", cap: "Minato Mirai 21 waterfront" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Minato_Mirai_-_Yokohama_Skyline_March_2025.jpg/960px-Minato_Mirai_-_Yokohama_Skyline_March_2025.jpg", cap: "Yokohama skyline" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Minato_Mirai_21_202403.jpg/960px-Minato_Mirai_21_202403.jpg", cap: "The harbour at dusk" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/070203_MM21%26FUJI.jpg/960px-070203_MM21%26FUJI.jpg", cap: "MM21&FUJI" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/20250101_Minato_Mirai_21_%28Landmark_Tower%2C_Queen%27s_Square_Yokohama%2C_Pacifico_Yokohama%2C_InterContinental_Yokohama_Grand%29_122135.jpg/960px-20250101_Minato_Mirai_21_%28Landmark_Tower%2C_Queen%27s_Square_Yokohama%2C_Pacifico_Yokohama%2C_InterContinental_Yokohama_Grand%29_122135.jpg", cap: "Minato Mirai 21 (Landmark Tower, Queen's Square Yokohama, Pacif…" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/20250105_Minato_Mirai_21_%28Landmark_Tower%2C_Queen%27s_Square_Yokohama%2C_Cosmo_Clock_21%29_080219.jpg/960px-20250105_Minato_Mirai_21_%28Landmark_Tower%2C_Queen%27s_Square_Yokohama%2C_Cosmo_Clock_21%29_080219.jpg", cap: "Minato Mirai 21 (Landmark Tower, Queen's Square Yokohama, Cosmo…" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Japan-_Yokohama_Minato_Mirai_21_2010.jpg/960px-Japan-_Yokohama_Minato_Mirai_21_2010.jpg", cap: "Japan- Yokohama Minato Mirai" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Minato_Mirai_21_%40_Yokohama_%289054466278%29.jpg/960px-Minato_Mirai_21_%40_Yokohama_%289054466278%29.jpg", cap: "Minato Mirai 21 @ Yokohama" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Minato_Mirai_21_at_dusk_IMG_4649.jpg/960px-Minato_Mirai_21_at_dusk_IMG_4649.jpg", cap: "Minato Mirai 21 at dusk IMG" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/e/e2/Minato_Mirai_21_views_from_Osanbashi_Pier.jpg", cap: "Minato Mirai 21 views from Osanbashi Pier" }
  ]
},
{
  id: "hakone",
  name: "Hakone",
  jp: "箱根",
  region: "Fuji–Hakone",
  type: "stay",
  days: "Days 2–4 · 2 nights",
  legMiles: 60,
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
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Hakone_Ashi_Lake_Torii.jpg/960px-Hakone_Ashi_Lake_Torii.jpg", cap: "The lakeside torii gate" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/A_view_of_Lake_Ashi_with_Peace_Torii_gate%2C_Hakone%2C_Japan2.jpg/960px-A_view_of_Lake_Ashi_with_Peace_Torii_gate%2C_Hakone%2C_Japan2.jpg", cap: "Lake Ashi from the water" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/A_view_of_Lake_Ashi%2C_Hakone%2C_Japan.jpg/960px-A_view_of_Lake_Ashi%2C_Hakone%2C_Japan.jpg", cap: "A view of Lake Ashi, Hakone, Japan" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/A_view_of_Lake_Ashi%2C_Hakone%2C_Japan1.jpg/960px-A_view_of_Lake_Ashi%2C_Hakone%2C_Japan1.jpg", cap: "A view of Lake Ashi, Hakone, Japan1" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/JAP_Hakone_Lake_Ashi_2.jpg/960px-JAP_Hakone_Lake_Ashi_2.jpg", cap: "JAP Hakone Lake Ashi" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/LakeAshi_and_MtFuji_Hakone.JPG/960px-LakeAshi_and_MtFuji_Hakone.JPG", cap: "LakeAshi and MtFuji Hakone" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Lake_Ashi_%26_Mt_Fuji_%26_Hakone_Shrine.jpg/960px-Lake_Ashi_%26_Mt_Fuji_%26_Hakone_Shrine.jpg", cap: "Lake Ashi & Mt Fuji & Hakone Shrine" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Lake_Ashi_%40_Hakone_%2813776582903%29.jpg/960px-Lake_Ashi_%40_Hakone_%2813776582903%29.jpg", cap: "Lake Ashi @ Hakone" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Lake_Ashi_%40_Hakone_%2813776906184%29.jpg/960px-Lake_Ashi_%40_Hakone_%2813776906184%29.jpg", cap: "Lake Ashi @ Hakone" }
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
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Izu_peninsula_UNESCO_geopark_2022_Sept_12_various.jpeg/960px-Izu_peninsula_UNESCO_geopark_2022_Sept_12_various.jpeg", cap: "Izu Geopark coastline" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Izu_peninsula_UNESCO_geopark_2022_Sept_12_various_18_32_09_711000.jpeg/960px-Izu_peninsula_UNESCO_geopark_2022_Sept_12_various_18_32_09_711000.jpeg", cap: "Volcanic shores of the peninsula" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Columnar_joints_at_Nakagi%2C_Minami-Izu%2C_Shizuoka%2C_Japan.jpg/960px-Columnar_joints_at_Nakagi%2C_Minami-Izu%2C_Shizuoka%2C_Japan.jpg", cap: "Columnar joints at Nakagi, Minami-Izu, Shizuoka, Japan" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/b/b8/Izu-oshima.jpg", cap: "Izu-oshima" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Izu_peninsula_UNESCO_geopark_2022_Sept_12_various_18_30_12_234000.jpeg/960px-Izu_peninsula_UNESCO_geopark_2022_Sept_12_various_18_30_12_234000.jpeg", cap: "Izu peninsula UNESCO geopark Sept 12 various 18 30" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Izu_peninsula_UNESCO_geopark_2022_Sept_12_various_18_30_38_698000.jpeg/960px-Izu_peninsula_UNESCO_geopark_2022_Sept_12_various_18_30_38_698000.jpeg", cap: "Izu peninsula UNESCO geopark Sept 12 various 18 30" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Izu_peninsula_UNESCO_geopark_2022_Sept_12_various_18_31_19_076000.jpeg/960px-Izu_peninsula_UNESCO_geopark_2022_Sept_12_various_18_31_19_076000.jpeg", cap: "Izu peninsula UNESCO geopark Sept 12 various 18 31" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Izu_peninsula_UNESCO_geopark_2022_Sept_12_various_18_31_31_187000.jpeg/960px-Izu_peninsula_UNESCO_geopark_2022_Sept_12_various_18_31_31_187000.jpeg", cap: "Izu peninsula UNESCO geopark Sept 12 various 18 31" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Izu_peninsula_UNESCO_geopark_2022_Sept_12_various_18_31_53_907000.jpeg/960px-Izu_peninsula_UNESCO_geopark_2022_Sept_12_various_18_31_53_907000.jpeg", cap: "Izu peninsula UNESCO geopark Sept 12 various 18 31" }
  ]
},
{
  id: "fuji",
  name: "Fuji Five Lakes",
  jp: "富士五湖",
  region: "Yamanashi",
  type: "stop",
  days: "Days 5–6",
  legMiles: 80,
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
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Mount_Fuji_%40_Lake_Kawaguchiko_%2810862985754%29.jpg/960px-Mount_Fuji_%40_Lake_Kawaguchiko_%2810862985754%29.jpg", cap: "Fuji reflected in the lake" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Lake_Kawaguchiko_Sakura_Mount_Fuji_4.JPG/960px-Lake_Kawaguchiko_Sakura_Mount_Fuji_4.JPG", cap: "Cherry blossom and Fuji" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Lake_Kawaguchiko_Sakura_Mount_Fuji_1.JPG/960px-Lake_Kawaguchiko_Sakura_Mount_Fuji_1.JPG", cap: "Lake Kawaguchiko Sakura Mount Fuji" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Lake_Kawaguchiko_Sakura_Mount_Fuji_2.JPG/960px-Lake_Kawaguchiko_Sakura_Mount_Fuji_2.JPG", cap: "Lake Kawaguchiko Sakura Mount Fuji" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Mount_Fuji_%40_Lake_Kawaguchiko_%2810862894455%29.jpg/960px-Mount_Fuji_%40_Lake_Kawaguchiko_%2810862894455%29.jpg", cap: "Mount Fuji @ Lake Kawaguchiko" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Mount_Fuji_%40_Lake_Kawaguchiko_%2810862962515%29.jpg/960px-Mount_Fuji_%40_Lake_Kawaguchiko_%2810862962515%29.jpg", cap: "Mount Fuji @ Lake Kawaguchiko" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Mount_Fuji_%40_Lake_Kawaguchiko_%2810862992324%29.jpg/960px-Mount_Fuji_%40_Lake_Kawaguchiko_%2810862992324%29.jpg", cap: "Mount Fuji @ Lake Kawaguchiko" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Mount_Fuji_%40_Lake_Kawaguchiko_%2810862997934%29.jpg/960px-Mount_Fuji_%40_Lake_Kawaguchiko_%2810862997934%29.jpg", cap: "Mount Fuji @ Lake Kawaguchiko" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Mount_Fuji_%40_Lake_Kawaguchiko_%2810863000084%29.jpg/960px-Mount_Fuji_%40_Lake_Kawaguchiko_%2810863000084%29.jpg", cap: "Mount Fuji @ Lake Kawaguchiko" }
  ]
},
{
  id: "nagoya",
  name: "Nagoya / Gifu",
  jp: "名古屋",
  region: "Chubu",
  type: "stop",
  days: "Day 7",
  legMiles: 165,
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
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Nagoya_Castle_%2856938%29.jpg/960px-Nagoya_Castle_%2856938%29.jpg", cap: "Keep and golden shachihoko" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Nagoya_Castle_%2867295%29.jpg/960px-Nagoya_Castle_%2867295%29.jpg", cap: "Castle grounds" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Nagoya_Castle%28Larger%29.jpg/960px-Nagoya_Castle%28Larger%29.jpg", cap: "Nagoya Castle(Larger)" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Nagoya_Castle_%2819636%29.jpg/960px-Nagoya_Castle_%2819636%29.jpg", cap: "Nagoya Castle" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Nagoya_Castle_%2823700%29.jpg/960px-Nagoya_Castle_%2823700%29.jpg", cap: "Nagoya Castle" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Nagoya_Castle_%2829603%29.jpg/960px-Nagoya_Castle_%2829603%29.jpg", cap: "Nagoya Castle" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Nagoya_Castle_%2833489%29.jpg/960px-Nagoya_Castle_%2833489%29.jpg", cap: "Nagoya Castle" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Nagoya_Castle_%2875241%29.jpg/960px-Nagoya_Castle_%2875241%29.jpg", cap: "Nagoya Castle" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Nagoya_Castle_%2877130%29.jpg/960px-Nagoya_Castle_%2877130%29.jpg", cap: "Nagoya Castle" }
  ]
},
{
  id: "awaji",
  name: "Awaji Island",
  jp: "淡路島",
  region: "Seto Inland Sea",
  type: "stop",
  days: "Day 8",
  legMiles: 145,
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
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Whirlpools_and_Awaji_Island_from_Uzunomichi_Promenade_1.jpg/960px-Whirlpools_and_Awaji_Island_from_Uzunomichi_Promenade_1.jpg", cap: "Whirlpools off the island" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/View_from_Uzunomichi_Promenade_5.JPG/960px-View_from_Uzunomichi_Promenade_5.JPG", cap: "Uzunomichi sea walkway" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Awaji%2C_Japan.jpg/960px-Awaji%2C_Japan.jpg", cap: "Awaji, Japan" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Awaji_Island_Nori.JPG/960px-Awaji_Island_Nori.JPG", cap: "Awaji Island Nori" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Awaji_Island_earthquake_in_Shijimi_station_Shintetsu_Ao_line_Kobe_railway.jpg/960px-Awaji_Island_earthquake_in_Shijimi_station_Shintetsu_Ao_line_Kobe_railway.jpg", cap: "Awaji Island earthquake in Shijimi station Shintetsu Ao line Ko…" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Awaji_Island_milk.JPG/960px-Awaji_Island_milk.JPG", cap: "Awaji Island milk" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Awaji_Onion.JPG/960px-Awaji_Onion.JPG", cap: "Awaji Onion" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Awaji_chicken_Bajiru_Sand.jpg/960px-Awaji_chicken_Bajiru_Sand.jpg", cap: "Awaji chicken Bajiru Sand" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/1/14/Awaji_island.jpg", cap: "Awaji island" }
  ]
},
{
  id: "iya",
  name: "Iya Valley / Oboke",
  jp: "祖谷渓",
  region: "Shikoku mountains",
  type: "stay",
  days: "Days 9–11 · 2 nights",
  legMiles: 90,
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
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Iya_Valley_a.jpeg/960px-Iya_Valley_a.jpeg", cap: "The Iya gorge" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Iya_vine_bridge_%286551507515%29.jpg/960px-Iya_vine_bridge_%286551507515%29.jpg", cap: "Crossing the vine bridge" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/150503_Biwa_Falls_Iya_Valley_Miyoshi_Tokushima_pref_Japan01s3.jpg/960px-150503_Biwa_Falls_Iya_Valley_Miyoshi_Tokushima_pref_Japan01s3.jpg", cap: "Biwa Falls Iya Valley Miyoshi Tokushima pref Japan01s3" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Crab_crawling_around_in_the_hills_of_Iya_Valley_%286453587885%29.jpg/960px-Crab_crawling_around_in_the_hills_of_Iya_Valley_%286453587885%29.jpg", cap: "Crab crawling around in the hills of Iya Valley" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Iya-Onsen_Hotel%2CTokushima%281%29_-_panoramio.jpg/960px-Iya-Onsen_Hotel%2CTokushima%281%29_-_panoramio.jpg", cap: "Iya-Onsen Hotel,Tokushima - panoramio" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Iya-Onsen_Hotel%2CTokushima%282%29_-_panoramio.jpg/960px-Iya-Onsen_Hotel%2CTokushima%282%29_-_panoramio.jpg", cap: "Iya-Onsen Hotel,Tokushima - panoramio" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Iya_Soba.jpg/960px-Iya_Soba.jpg", cap: "Iya Soba" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Iya_Valley_01.jpg/960px-Iya_Valley_01.jpg", cap: "Iya Valley" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Iya_Valley_02.jpg/960px-Iya_Valley_02.jpg", cap: "Iya Valley" }
  ]
},
{
  id: "kochi",
  name: "Kochi",
  jp: "高知",
  region: "Shikoku south coast",
  type: "stop",
  days: "Day 11",
  legMiles: 70,
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
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Kochi_Castle_03.JPG/960px-Kochi_Castle_03.JPG", cap: "The original keep" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Kochi_Castle_08.jpg/960px-Kochi_Castle_08.jpg", cap: "Castle grounds" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Kochi_Castle_Keep_Tower_20170122-1.jpg/960px-Kochi_Castle_Keep_Tower_20170122-1.jpg", cap: "Kochi Castle Keep Tower-1" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Kochi_Castle_Keep_Tower_20170122-3.jpg/960px-Kochi_Castle_Keep_Tower_20170122-3.jpg", cap: "Kochi Castle Keep Tower-3" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Kochi_Castle_Keep_Tower_20170122-4.jpg/960px-Kochi_Castle_Keep_Tower_20170122-4.jpg", cap: "Kochi Castle Keep Tower-4" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Kochi_Castle_air.jpg/960px-Kochi_Castle_air.jpg", cap: "Kochi Castle air" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Kochi_Kochi-Castle_Donjon_From_Sannomaru_1.JPG/960px-Kochi_Kochi-Castle_Donjon_From_Sannomaru_1.JPG", cap: "Kochi Kochi-Castle Donjon From Sannomaru" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Kochi_Kochi-Castle_Otte-Gate_1.JPG/960px-Kochi_Kochi-Castle_Otte-Gate_1.JPG", cap: "Kochi Kochi-Castle Otte-Gate" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Kochi_Kochi-Castle_Sannomaru_Stone_Wall_1.JPG/960px-Kochi_Kochi-Castle_Sannomaru_Stone_Wall_1.JPG", cap: "Kochi Kochi-Castle Sannomaru Stone Wall" }
  ]
},
{
  id: "shimanto",
  name: "Shimanto River",
  jp: "四万十川",
  region: "Shikoku west",
  type: "stay",
  days: "Days 12–14 · 2 nights",
  legMiles: 85,
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
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Shimanto_River_And_Iwama_Bridge_1.jpg/960px-Shimanto_River_And_Iwama_Bridge_1.jpg", cap: "A chinkabashi 'sinking bridge'" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Shimanto_River_And_Shimanto_River_Bridge_1.JPG/960px-Shimanto_River_And_Shimanto_River_Bridge_1.JPG", cap: "Clear waters of the Shimanto" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/f/f0/Nishitosa_Shimanto_river.jpg", cap: "Nishitosa Shimanto river" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Sagawa-bridge%2CShimanto-cho%2CJapan.JPG/960px-Sagawa-bridge%2CShimanto-cho%2CJapan.JPG", cap: "Sagawa-bridge,Shimanto-cho,Japan" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Shimanto-iwama.jpg/960px-Shimanto-iwama.jpg", cap: "Shimanto-iwama" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Shimanto-river_%E5%9B%9B%E4%B8%87%E5%8D%81%E5%B7%9D%E8%8B%A5%E4%BA%95%E6%B2%88%E4%B8%8B%E6%A9%8B1010070.JPG/960px-Shimanto-river_%E5%9B%9B%E4%B8%87%E5%8D%81%E5%B7%9D%E8%8B%A5%E4%BA%95%E6%B2%88%E4%B8%8B%E6%A9%8B1010070.JPG", cap: "Shimanto-river 四万十川若井沈下橋1010070" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/ShimantoRiverFromNakabaRestarea.JPG/960px-ShimantoRiverFromNakabaRestarea.JPG", cap: "ShimantoRiverFromNakabaRestarea" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/1/18/Shimanto_River_-_panoramio.jpg", cap: "Shimanto River - panoramio" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Shimanto_River_Bridge%2826676794871%29.jpg/960px-Shimanto_River_Bridge%2826676794871%29.jpg", cap: "Shimanto River Bridge" }
  ]
},
{
  id: "uwajima",
  name: "Uchiko / Uwajima",
  jp: "宇和島",
  region: "Ehime south",
  type: "stop",
  days: "Day 14",
  legMiles: 55,
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
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Uwajima_Castle%2C_honmaru-1.jpg/960px-Uwajima_Castle%2C_honmaru-1.jpg", cap: "The original keep" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Uwajima_Castle%2C_honmaru_ishigaki-1.jpg/960px-Uwajima_Castle%2C_honmaru_ishigaki-1.jpg", cap: "Castle stone walls" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Kashima_Island%2C_Uwajima_Ehime_Aerial_photograph.2019.jpg/960px-Kashima_Island%2C_Uwajima_Ehime_Aerial_photograph.2019.jpg", cap: "Kashima Island, Uwajima Ehime Aerial photograph.2019" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Kushima_Island%2C_Uwajima_Ehime_Aerial_photograph.2019.jpg/960px-Kushima_Island%2C_Uwajima_Ehime_Aerial_photograph.2019.jpg", cap: "Kushima Island, Uwajima Ehime Aerial photograph.2019" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Okinoshima_Island%2C_Uwajima_Ehime_Aerial_photograph.2019.jpg/960px-Okinoshima_Island%2C_Uwajima_Ehime_Aerial_photograph.2019.jpg", cap: "Okinoshima Island, Uwajima Ehime Aerial photograph.2019" },
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
  legMiles: 55,
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
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Dogo_Onsen_Honkan_%28Main_building%29%2C_%E9%81%93%E5%BE%8C%E6%B8%A9%E6%B3%89_%E6%9C%AC%E9%A4%A8_-_panoramio_%281%29.jpg/960px-Dogo_Onsen_Honkan_%28Main_building%29%2C_%E9%81%93%E5%BE%8C%E6%B8%A9%E6%B3%89_%E6%9C%AC%E9%A4%A8_-_panoramio_%281%29.jpg", cap: "The historic hot-spring building" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Dogo%2C_Matsuyama_20170123.jpg/960px-Dogo%2C_Matsuyama_20170123.jpg", cap: "Dogo, Matsuyama" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Dogo-onsen_Honkan.jpg/960px-Dogo-onsen_Honkan.jpg", cap: "Dogo-onsen Honkan" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Dogo_Onsen_01.jpg/960px-Dogo_Onsen_01.jpg", cap: "Dogo Onsen" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Dogo_Onsen_03.jpg/960px-Dogo_Onsen_03.jpg", cap: "Dogo Onsen" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Dogo_Onsen_04.jpg/960px-Dogo_Onsen_04.jpg", cap: "Dogo Onsen" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Dogo_Onsen_1894.jpg/960px-Dogo_Onsen_1894.jpg", cap: "Dogo Onsen" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Dogo_Onsen_Honkan_%28Main_building%29%2C_%E9%81%93%E5%BE%8C%E6%B8%A9%E6%B3%89_%E6%9C%AC%E9%A4%A8_-_panoramio_%285%29.jpg/960px-Dogo_Onsen_Honkan_%28Main_building%29%2C_%E9%81%93%E5%BE%8C%E6%B8%A9%E6%B3%89_%E6%9C%AC%E9%A4%A8_-_panoramio_%285%29.jpg", cap: "Dogo Onsen Honkan (Main building), 道後温泉 本館 - panoramio" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Dogo_Onsen_Honkan_%28Main_building%29%2C_%E9%81%93%E5%BE%8C%E6%B8%A9%E6%B3%89_%E6%9C%AC%E9%A4%A8_-_panoramio_%287%29.jpg/960px-Dogo_Onsen_Honkan_%28Main_building%29%2C_%E9%81%93%E5%BE%8C%E6%B8%A9%E6%B3%89_%E6%9C%AC%E9%A4%A8_-_panoramio_%287%29.jpg", cap: "Dogo Onsen Honkan (Main building), 道後温泉 本館 - panoramio" }
  ]
},
{
  id: "shimanami",
  name: "Shimanami Kaido",
  jp: "しまなみ海道",
  region: "Seto Inland Sea",
  type: "stop",
  days: "Day 16",
  legMiles: 60,
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
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Kurushima-Kaikyo_Bridge_310040.jpg/960px-Kurushima-Kaikyo_Bridge_310040.jpg", cap: "The great spans over the sea" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Kurushima-Kaikyo_Bridge_310054.jpg/960px-Kurushima-Kaikyo_Bridge_310054.jpg", cap: "Island-hopping route" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Kurushima-Kaikyo-Bridge.jpg/960px-Kurushima-Kaikyo-Bridge.jpg", cap: "Kurushima-Kaikyo-Bridge" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Kurushima-Kaiky%C5%8D_Bridge_2012-04-07.JPG/960px-Kurushima-Kaiky%C5%8D_Bridge_2012-04-07.JPG", cap: "Kurushima-Kaikyō Bridge-04-07" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Kurushima-kaiky%C5%8DBridgeRoadway.jpg/960px-Kurushima-kaiky%C5%8DBridgeRoadway.jpg", cap: "Kurushima-kaikyōBridgeRoadway" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Kurushima_Kaikyo_Bridge-1.jpg/960px-Kurushima_Kaikyo_Bridge-1.jpg", cap: "Kurushima Kaikyo Bridge-1" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Kurushima_Kaikyo_Bridge-2.jpg/960px-Kurushima_Kaikyo_Bridge-2.jpg", cap: "Kurushima Kaikyo Bridge-2" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/4/44/Kurushima_Kaikyo_Bridge-2edit.jpg", cap: "Kurushima Kaikyo Bridge-2edit" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Kurushima_Kaikyo_Bridge-3.jpg/960px-Kurushima_Kaikyo_Bridge-3.jpg", cap: "Kurushima Kaikyo Bridge-3" }
  ]
},
{
  id: "onomichi",
  name: "Onomichi / Setoda",
  jp: "尾道",
  region: "Hiroshima coast",
  type: "stay",
  days: "Days 16–18 · 2 nights",
  legMiles: 35,
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
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Onomichi_%2851807128293%29.jpg/960px-Onomichi_%2851807128293%29.jpg", cap: "Views over the channel" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Higashigoshocho%2C_Onomichi%2C_Hiroshima_Prefecture_722-0036%2C_Japan_-_panoramio.jpg/960px-Higashigoshocho%2C_Onomichi%2C_Hiroshima_Prefecture_722-0036%2C_Japan_-_panoramio.jpg", cap: "Higashigoshocho, Onomichi, Hiroshima Prefecture 722-0036, Japan…" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Onomichi_104.jpg/960px-Onomichi_104.jpg", cap: "Onomichi" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Onomichi_105.jpg/960px-Onomichi_105.jpg", cap: "Onomichi" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Onomichi_106.jpg/960px-Onomichi_106.jpg", cap: "Onomichi" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Onomichi_107.jpg/960px-Onomichi_107.jpg", cap: "Onomichi" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Onomichi_108.jpg/960px-Onomichi_108.jpg", cap: "Onomichi" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Onomichi_110.jpg/960px-Onomichi_110.jpg", cap: "Onomichi" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Onomichi_111.jpg/960px-Onomichi_111.jpg", cap: "Onomichi" }
  ]
},
{
  id: "kurashiki",
  name: "Kurashiki / Takamatsu",
  jp: "倉敷",
  region: "Okayama / Kagawa",
  type: "stop",
  days: "Day 18",
  legMiles: 90,
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
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Kurashiki_Bikan_historical_quarter_1.jpg/960px-Kurashiki_Bikan_historical_quarter_1.jpg", cap: "Willow-lined canal" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Kurashiki_Bikan_-05.jpg/960px-Kurashiki_Bikan_-05.jpg", cap: "White-walled storehouses" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/161015_At_Kurashiki_Bikan_historical_quarter_Kurashiki_Okayama_pref_Japan01s3.jpg/960px-161015_At_Kurashiki_Bikan_historical_quarter_Kurashiki_Okayama_pref_Japan01s3.jpg", cap: "At Kurashiki Bikan historical quarter Kurashiki Okayama pref Ja…" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Fire_lookout_tower%2C_Kurashiki_Bikan_historical_quarter_-_Aug_11%2C_2014.jpg/960px-Fire_lookout_tower%2C_Kurashiki_Bikan_historical_quarter_-_Aug_11%2C_2014.jpg", cap: "Fire lookout tower, Kurashiki Bikan historical quarter - Aug 11" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Kurashiki_Bikan_-04.jpg/960px-Kurashiki_Bikan_-04.jpg", cap: "Kurashiki Bikan -04" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Kurashiki_Bikan_historical_quarter_2.jpg/960px-Kurashiki_Bikan_historical_quarter_2.jpg", cap: "Kurashiki Bikan historical quarter" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Kurashiki_Bikan_historical_quarter_20190324-2.jpg/960px-Kurashiki_Bikan_historical_quarter_20190324-2.jpg", cap: "Kurashiki Bikan historical quarter-2" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Kurashiki_Bikan_historical_quarter_20190324-3.jpg/960px-Kurashiki_Bikan_historical_quarter_20190324-3.jpg", cap: "Kurashiki Bikan historical quarter-3" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Kurashiki_Bikan_historical_quarter_20190324.jpg/960px-Kurashiki_Bikan_historical_quarter_20190324.jpg", cap: "Kurashiki Bikan historical quarter" }
  ]
},
{
  id: "himeji",
  name: "Himeji / Kobe",
  jp: "姫路",
  region: "Hyogo",
  type: "stop",
  days: "Day 19",
  legMiles: 70,
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
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Family_picnic%2C_Himeji_Castle_grounds%2C_Himeji%2C_2016.jpg/960px-Family_picnic%2C_Himeji_Castle_grounds%2C_Himeji%2C_2016.jpg", cap: "Family day on the castle grounds" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Ch%C3%A2teau_de_Himeji02.jpg/960px-Ch%C3%A2teau_de_Himeji02.jpg", cap: "The soaring main keep" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Himeji_Castle%2C_Japan%2C_20240819_1038_4728.jpg/960px-Himeji_Castle%2C_Japan%2C_20240819_1038_4728.jpg", cap: "Himeji Castle, Japan" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Himeji_Castle_01s2048.jpg/960px-Himeji_Castle_01s2048.jpg", cap: "Himeji Castle" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Himeji_Castle_0804_1.jpg/960px-Himeji_Castle_0804_1.jpg", cap: "Himeji Castle" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Himeji_Castle_Aerial_photograph_2010.jpg/960px-Himeji_Castle_Aerial_photograph_2010.jpg", cap: "Himeji Castle Aerial photograph" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Himeji_Castle_Cherry_Blossoms.jpg/960px-Himeji_Castle_Cherry_Blossoms.jpg", cap: "Himeji Castle Cherry Blossoms" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Himeji_Castle_Japan.jpg/960px-Himeji_Castle_Japan.jpg", cap: "Himeji Castle Japan" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Himeji_Castle_The_Keep_Towers.jpg/960px-Himeji_Castle_The_Keep_Towers.jpg", cap: "Himeji Castle The Keep Towers" }
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
    "Day-trip option: Kyoto's Fushimi Inari and temples"
  ],
  food: [
    { n: "Takoyaki", d: "Octopus dumplings — the icon of Osaka street food." },
    { n: "Okonomiyaki", d: "Savoury griddle pancakes, cooked at your table." },
    { n: "Kushikatsu", d: "Crisp deep-fried skewers, a Shinsekai specialty." }
  ],
  hotels: [
    { n: "The Ritz-Carlton Osaka", t: "Luxury", d: "A grand finish; valet parking — confirm motorcycle handling.", price: "¥80,000–250,000" },
    { n: "Swissotel Nankai Osaka", t: "Nice hotel", d: "Above Namba station, central for the airport run.", price: "¥18,000–35,000" },
    { n: "Hotel near rental return", t: "Practical", d: "Stay close to the drop-off point for an easy final morning.", price: "¥9,000–16,000" }
  ],
  links: [
    { l: "Osaka Info (official)", u: "https://osaka-info.jp/en/" },
    { l: "Wikipedia — Osaka", u: "https://en.wikipedia.org/wiki/Osaka" }
  ],
  photos: [
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Osaka_Castle%2C_Keep_tower%2C_South_view_20190415_1.jpg/960px-Osaka_Castle%2C_Keep_tower%2C_South_view_20190415_1.jpg", cap: "Osaka Castle keep" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Osaka_Castle_02bs3200.jpg/960px-Osaka_Castle_02bs3200.jpg", cap: "The castle and its gold trim" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Osaka_Castle_Outer_Moat_and_Osaka_Business_Park%2C_November_2016.jpg/960px-Osaka_Castle_Outer_Moat_and_Osaka_Business_Park%2C_November_2016.jpg", cap: "Castle moat and skyline" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Osaka_Castle_August_2024.jpg/960px-Osaka_Castle_August_2024.jpg", cap: "Osaka Castle August" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Osaka_Castle_and_Gokuraku-bashi_Bridge.jpg/960px-Osaka_Castle_and_Gokuraku-bashi_Bridge.jpg", cap: "Osaka Castle and Gokuraku-bashi Bridge" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Osaka_castle_10.jpg/960px-Osaka_castle_10.jpg", cap: "Osaka castle" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Osaka_castle_11.jpg/960px-Osaka_castle_11.jpg", cap: "Osaka castle" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Osaka_castle_2.jpg/960px-Osaka_castle_2.jpg", cap: "Osaka castle" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Osaka_castle_3.jpg/960px-Osaka_castle_3.jpg", cap: "Osaka castle" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Osaka_castle_4.jpg/960px-Osaka_castle_4.jpg", cap: "Osaka castle" }
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
