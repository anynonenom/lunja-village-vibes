// Real Lunja Village photos (Imi Ouaddar): guest and property shots.
import surf from "@/assets/feed8.jpg";
import plage from "@/assets/feed7.jpg";
import nights from "@/assets/ph-dj.jpg";
import appart0 from "@/assets/appart-2br-0.jpg";
import appart1 from "@/assets/appart-2br-1.jpg";
import appart2 from "@/assets/appart-2br-2.jpg";
import appart3 from "@/assets/appart-2br-3.jpg";
import appart4 from "@/assets/appart-2br-4.jpg";
import appart5 from "@/assets/appart-2br-5.jpg";
import appart6 from "@/assets/appart-2br-6.jpg";
import appartSea0 from "@/assets/appart-sea-0.png";
import bungalow2br0 from "@/assets/bungalow-2br-0.png";
import bungalowPool0 from "@/assets/bungalow-pool-0.png";
import bungalowSea0 from "@/assets/bungalow-sea-0.png";

export const ACCOR_URL = "https://all.accor.com/hotel/C477/index.en.shtml";
export const INSTAGRAM_URL = "https://www.instagram.com/lunjavillage.officiel";

export type Poi = {
  id: string;
  n: number;
  name: string;
  kind: "hub" | "stay" | "water" | "kids" | "sport" | "access";
  x: number; // % of map width
  y: number; // % of map height
  blurb: string;
  detail: string;
};

/** Coordinates traced from the official Lunja Village site plan. */
export const POIS: Poi[] = [
  { id: "accueil", n: 1, name: "Accueil / Réservation", kind: "hub", x: 14.0, y: 20.5, blurb: "Check-in, bracelets, keys", detail: "\"Vous êtes ici\". Your first stop after the gate: check-in, luggage drop, and every question about the village answered here." },
  { id: "social", n: 2, name: "Social Hub", kind: "hub", x: 46.0, y: 37.5, blurb: "Hall d'accueil, bar, terrace", detail: "The beating heart: reception hall, bar, big terrace and the daily good-vibe headquarters of the village." },
  { id: "resto", n: 3, name: "Restaurant Le Sahariat & Le Consul Bar", kind: "hub", x: 48.5, y: 29.5, blurb: "Le Sahariat · Mimosa · Le Consul", detail: "Breakfast until late dinner across Le Sahariat and Mimosa, with Le Consul bar for sunset drinks." },
  { id: "piscine-main", n: 4, name: "Piscine centrale", kind: "water", x: 64.0, y: 36.0, blurb: "Big pool + sun deck", detail: "The main pool with loungers and shade, in the eastern gardens." },
  { id: "piscine-kids", n: 5, name: "Piscine & Snack Tmada", kind: "water", x: 24.0, y: 44.0, blurb: "Pool + light bites", detail: "Western pool with the Tmada snack for a quick lunch without leaving the water." },
  { id: "kids-club", n: 6, name: "Kids Club", kind: "kids", x: 31.5, y: 44.5, blurb: "Games, crafts, mini disco", detail: "Supervised activities all day, ending with the mini disco the parents secretly love." },
  { id: "riad", n: 7, name: "Riad des Saveurs", kind: "hub", x: 12.5, y: 26.0, blurb: "Chill-out lounge & bar", detail: "Chill-out lounge and bar by the western gardens, for slow afternoons and long drinks." },
  { id: "bungalows-jardin", n: 8, name: "Garden Bungalows", kind: "stay", x: 34.0, y: 52.0, blurb: "Private terrace on the garden", detail: "Low white bungalows with their own terrace and total quiet at night." },
  { id: "bungalows-piscine", n: 9, name: "Pool Bungalows", kind: "stay", x: 68.0, y: 45.0, blurb: "Steps from the water", detail: "Bungalows opening straight onto a pool deck. Towel, ten steps, splash." },
  { id: "bungalows-mer", n: 10, name: "Sea View Bungalows", kind: "stay", x: 82.0, y: 42.0, blurb: "Atlantic on the horizon", detail: "The front row on the east side: terraces angled at the ocean for the whole sunset show." },
  { id: "asayas", n: 11, name: "Asayas", kind: "sport", x: 41.0, y: 42.0, blurb: "Conference & events hall", detail: "Salle de conférence for meetings and events, next to the Social Hub." },
  { id: "piscine-ayoub", n: 12, name: "Piscine & Snack Ayoub", kind: "water", x: 83.0, y: 50.0, blurb: "East pool + snack", detail: "The eastern pool closest to the beach path, with the Ayoub snack alongside." },
  { id: "chillout", n: 13, name: "Accès Plage / CHILLOUT", kind: "hub", x: 91.0, y: 40.5, blurb: "Beach club & sunset sets", detail: "The path down to the sand and the surf-to-sunset social club: beer garden, café and the loudest sunsets in Imi Ouaddar." },
  { id: "beach", n: 14, name: "Beach Access", kind: "access", x: 94.5, y: 44.0, blurb: "Direct path to the sand", detail: "A short walkway straight down to the Atlantic. Surf lessons meet here at sunrise." },
  { id: "parking-n", n: 15, name: "Parking Nord", kind: "access", x: 23.0, y: 16.5, blurb: "Visitor parking", detail: "Parking by the north gate, closest to the western gardens and reception." },
  { id: "parking-s", n: 16, name: "Parking central", kind: "access", x: 43.0, y: 26.0, blurb: "Main parking", detail: "Central parking by the Social Hub, with drop-off zone for shuttles and taxis." },
];

export const KIND_LABEL: Record<Poi["kind"], string> = {
  hub: "Social",
  stay: "Stay",
  water: "Water",
  kids: "Kids",
  sport: "Sport",
  access: "Access",
};

export type StaySpec = { group: string; items: string[] };
export type StayGroup = "Apartments" | "Bungalows";
export type Stay = {
  id: string;
  group: StayGroup;
  code: string;
  name: string;
  img: string;
  /** Full photo gallery (Accor). When present the card shows a slider. */
  images?: string[];
  sleeps: string;
  size: string;
  from: string;
  perks: string[];
  description?: string;
  bedding?: string[];
  specs?: StaySpec[];
};

const APARTMENT_2BR_GALLERY = [appart0, appart1, appart2, appart3, appart4, appart5, appart6];

// Accommodation details from the official ALL / Accor page (hotel C477).
// Every unit is a 2-bedroom, 75 m² apartment-style stay for up to 4 guests.
export const STAYS: Stay[] = [
  {
    id: "apartment",
    group: "Apartments",
    code: "Apartment",
    name: "2-bedroom apartment",
    img: appart0,
    images: APARTMENT_2BR_GALLERY,
    sleeps: "Max. 4 guests",
    size: "From 75 m² · 807 sq ft",
    from: "Rates on ALL.com",
    perks: ["1 double + 2 single beds", "Equipped kitchen", "Lounge + balcony"],
    description:
      "Spacious apartment with a lounge, two bedrooms and a bathroom with tub. The kitchen is equipped with a hob, fridge, oven, utensils and a kettle tray. Flat-screen satellite TV.",
    bedding: ["1 double bed", "2 twin beds", "Baby crib on request"],
    specs: [
      { group: "Kitchen & dining", items: ["Hob, oven and fridge", "Mini-refrigerator", "Kitchen utensils and kettle tray", "Free in-room mineral water"] },
      { group: "Bathroom", items: ["Bathtub", "Make-up / magnifying mirror", "Mirror", "Universal shaving plug"] },
      { group: "Media & tech", items: ["Satellite / cable colour TV", '32" / 81 cm flat screen'] },
      { group: "Comfort & safety", items: ["Opening windows", "Vacuum cleaner", "220 / 240 V AC", "Keycard-operated door locks", "Emergency info in room"] },
    ],
  },
  {
    id: "apartment-sea",
    group: "Apartments",
    code: "Sea View",
    name: "Apartment - sea view",
    img: appartSea0,
    images: [appartSea0],
    sleeps: "Max. 4 guests",
    size: "From 75 m² · 807 sq ft",
    from: "Rates on ALL.com",
    perks: ["1 double + 2 single beds", "Sea-view terrace", "Equipped kitchen"],
    description:
      "Spacious apartment with a lounge, two bedrooms and a bathroom with tub. Kitchen equipped with a hob, fridge, oven, utensils and a kettle tray. Flat-screen satellite TV, and a terrace looking out over the ocean.",
    bedding: ["1 double bed", "2 twin beds"],
    specs: [
      { group: "View", items: ["Ocean / sea view"] },
      { group: "Kitchen & dining", items: ["Hob, oven and fridge", "Mini-refrigerator", "Kitchen utensils and kettle tray"] },
      { group: "Bathroom", items: ["Bathtub", "Bathroom products", "Make-up / magnifying mirror", "Mirror", "Universal shaving plug"] },
      { group: "Media & tech", items: ["Direct-dial telephone", "Satellite / cable colour TV"] },
      { group: "Comfort & safety", items: ["Opening windows", "Vacuum cleaner", "220 / 240 V AC", "Keycard-operated door locks", "Emergency info in room"] },
    ],
  },
  {
    id: "bungalow",
    group: "Bungalows",
    code: "Bungalow",
    name: "2 bedroom bungalow",
    img: bungalow2br0,
    images: [bungalow2br0],
    sleeps: "Max. 4 guests",
    size: "From 75 m² · 807 sq ft",
    from: "Rates on ALL.com",
    perks: ["1 double + 2 single beds", "Lounge + terrace", "Equipped kitchen"],
    description:
      "Spacious chalet with two bedrooms, a bathroom with tub, a lounge area and a terrace. Kitchen equipped with a hob, fridge, oven, utensils, kettle tray and a dining area, plus a wardrobe and flat-screen satellite TV.",
    bedding: ["1 double bed", "2 twin beds"],
    specs: [
      { group: "Kitchen & dining", items: ["Hob, oven and fridge", "Mini-refrigerator", "Utensils, kettle tray and dining area", "Wardrobe"] },
      { group: "Bathroom", items: ["Bathtub", "Bathroom products", "Make-up / magnifying mirror", "Mirror", "Universal shaving plug"] },
      { group: "Media & tech", items: ["Direct-dial telephone", "Satellite / cable colour TV"] },
      { group: "Comfort & safety", items: ["Opening windows", "Vacuum cleaner", "220 / 240 V AC", "Keycard-operated door locks", "Emergency info in room"] },
    ],
  },
  {
    id: "bungalow-pool",
    group: "Bungalows",
    code: "Pool View",
    name: "Bungalow - pool view",
    img: bungalowPool0,
    images: [bungalowPool0],
    sleeps: "Max. 4 guests",
    size: "From 75 m² · 807 sq ft",
    from: "Rates on ALL.com",
    perks: ["1 double + 2 single beds", "Pool-side terrace", "Equipped kitchen"],
    description:
      "Spacious chalet with two bedrooms, a bathroom with tub, a lounge area and a terrace on the pool side. Kitchen with a hob, fridge, oven, utensils, kettle tray and dining area, plus a wardrobe and flat-screen satellite TV.",
    bedding: ["1 double bed", "2 twin beds"],
    specs: [
      { group: "View", items: ["Pool side"] },
      { group: "Kitchen & dining", items: ["Hob, oven and fridge", "Mini-refrigerator", "Utensils, kettle tray and dining area", "Wardrobe"] },
      { group: "Bathroom", items: ["Bathtub", "Bathroom products", "Make-up / magnifying mirror", "Mirror", "Universal shaving plug"] },
      { group: "Media & tech", items: ["Direct-dial telephone", "Satellite / cable colour TV"] },
      { group: "Comfort & safety", items: ["Opening windows", "Vacuum cleaner", "220 / 240 V AC", "Keycard-operated door locks", "Emergency info in room"] },
    ],
  },
  {
    id: "bungalow-sea",
    group: "Bungalows",
    code: "Sea View",
    name: "Bungalow - sea view",
    img: bungalowSea0,
    images: [bungalowSea0],
    sleeps: "Max. 4 guests",
    size: "From 75 m² · 807 sq ft",
    from: "Rates on ALL.com",
    perks: ["1 double + 1 twin bed", "Sea-view terrace", "Equipped kitchen"],
    description:
      "Spacious chalet with two bedrooms, a bathroom with tub, a lounge area and a terrace with sea view. Kitchen with a hob, fridge, oven, utensils, kettle tray and dining area, plus a wardrobe and flat-screen satellite TV.",
    bedding: ["1 double bed", "1 twin bed"],
    specs: [
      { group: "View", items: ["Ocean / sea view"] },
      { group: "Kitchen & dining", items: ["Hob, oven and fridge", "Mini-refrigerator", "Utensils, kettle tray and dining area", "Wardrobe"] },
      { group: "Bathroom", items: ["Bathtub", "Bathroom products", "Make-up / magnifying mirror", "Mirror", "Universal shaving plug"] },
      { group: "Media & tech", items: ["Direct-dial telephone", "Satellite / cable colour TV"] },
      { group: "Comfort & safety", items: ["Opening windows", "Vacuum cleaner", "220 / 240 V AC", "Keycard-operated door locks", "Emergency info in room"] },
    ],
  },
];

/** What the village actually offers on its doorstep (ALL / Accor). */
export const EXPERIENCES = [
  { id: "nights", title: "Bars & Live Nights", img: nights, line: "One restaurant, two snack bars and two lounge bars (Le Consul, Mimosa), with live shows after dark." },
  { id: "surf", title: "Surf", img: surf, line: "Imi Ouaddar and the points just north sit on the classic Atlantic surf coast, minutes away." },
  { id: "beach", title: "Beach Access", img: plage, line: "A private path from the east side straight down to the open Atlantic sand." },
];
