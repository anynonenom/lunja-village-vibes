// Real Lunja Village photos (Imi Ouaddar): guest and property shots.
import surf from "@/assets/feed8.jpg";
import plage from "@/assets/feed7.jpg";
import nights from "@/assets/ph-dj.jpg";
import appt1 from "@/assets/appt-1.jpg";
import appt2 from "@/assets/appt-2.jpg";
import appt3 from "@/assets/appt-3.jpg";
import appt4 from "@/assets/appt-4.jpg";
import appt5 from "@/assets/appt-5.jpg";
import appt6 from "@/assets/appt-6.jpg";
import bung1 from "@/assets/bung-1.jpg";
import bung2 from "@/assets/bung-2.jpg";
import bung3 from "@/assets/bung-3.jpg";
import bung4 from "@/assets/bung-4.jpg";
import bung5 from "@/assets/bung-5.jpg";
import bung6 from "@/assets/bung-6.jpg";
import bung7 from "@/assets/bung-7.jpg";
import bung8 from "@/assets/bung-8.jpg";
import bung9 from "@/assets/bung-9.jpg";
import bung10 from "@/assets/bung-10.jpg";
import bung11 from "@/assets/bung-11.jpg";

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
  { id: "accueil", n: 1, name: "Accueil / Réservation", kind: "hub", x: 13.3, y: 33.5, blurb: "Check-in, bracelets, keys", detail: "\"Vous êtes ici\". Your first stop after the gate: check-in, luggage drop, and every question about the village answered here." },
  { id: "social", n: 2, name: "Social Hub", kind: "hub", x: 45.8, y: 58.9, blurb: "Hall d'accueil, bar, terrace", detail: "The beating heart: reception hall, bar, big terrace and the daily good-vibe headquarters of the village." },
  { id: "resto", n: 3, name: "Restaurant Le Sahariat & Le Consul Bar", kind: "hub", x: 49.2, y: 47.5, blurb: "Le Sahariat · Mimosa · Le Consul", detail: "Breakfast until late dinner across Le Sahariat and Mimosa, with Le Consul bar for sunset drinks." },
  { id: "piscine-main", n: 4, name: "Piscine centrale", kind: "water", x: 64.4, y: 57.3, blurb: "Big pool + sun deck", detail: "The main pool with loungers and shade, in the eastern gardens." },
  { id: "piscine-kids", n: 5, name: "Piscine & Snack Tmada", kind: "water", x: 24.4, y: 65.7, blurb: "Pool + light bites", detail: "Western pool with the Tmada snack for a quick lunch without leaving the water." },
  { id: "kids-club", n: 6, name: "Kids Club", kind: "kids", x: 31.4, y: 68.3, blurb: "Games, crafts, mini disco", detail: "Supervised activities all day, ending with the mini disco the parents secretly love." },
  { id: "riad", n: 7, name: "Riad des Saveurs", kind: "hub", x: 11.8, y: 44.3, blurb: "Chill-out lounge & bar", detail: "Chill-out lounge and bar by the western gardens, for slow afternoons and long drinks." },
  { id: "bungalows-jardin", n: 8, name: "Garden Bungalows", kind: "stay", x: 34.0, y: 78.0, blurb: "Private terrace on the garden", detail: "Low white bungalows with their own terrace and total quiet at night." },
  { id: "bungalows-piscine", n: 9, name: "Pool Bungalows", kind: "stay", x: 60.0, y: 63.0, blurb: "Steps from the water", detail: "Bungalows opening straight onto a pool deck. Towel, ten steps, splash." },
  { id: "bungalows-mer", n: 10, name: "Sea View Bungalows", kind: "stay", x: 85.0, y: 63.0, blurb: "Atlantic on the horizon", detail: "The front row on the east side: terraces angled at the ocean for the whole sunset show." },
  { id: "asayas", n: 11, name: "Asayas", kind: "sport", x: 41.4, y: 64.3, blurb: "Conference & events hall", detail: "Salle de conférence for meetings and events, next to the Social Hub." },
  { id: "piscine-ayoub", n: 12, name: "Piscine & Snack Ayoub", kind: "water", x: 71.4, y: 78.7, blurb: "East pool + snack", detail: "The eastern pool closest to the beach path, with the Ayoub snack alongside." },
  { id: "chillout", n: 13, name: "Accès Plage / CHILLOUT", kind: "hub", x: 91.5, y: 73.5, blurb: "Beach club & sunset sets", detail: "The path down to the sand and the surf-to-sunset social club: beer garden, café and the loudest sunsets in Imi Ouaddar." },
  { id: "beach", n: 14, name: "Beach Access", kind: "access", x: 95.4, y: 64.3, blurb: "Direct path to the sand", detail: "A short walkway straight down to the Atlantic. Surf lessons meet here at sunrise." },
  { id: "parking-n", n: 15, name: "Parking Nord", kind: "access", x: 23.9, y: 28.5, blurb: "Visitor parking", detail: "Parking by the north gate, closest to the western gardens and reception." },
  { id: "parking-s", n: 16, name: "Parking central", kind: "access", x: 43.9, y: 42.5, blurb: "Main parking", detail: "Central parking by the Social Hub, with drop-off zone for shuttles and taxis." },
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

const APARTMENT_GALLERY = [appt1, appt2, appt3, appt4, appt5, appt6];
const BUNGALOW_GALLERY = [bung1, bung2, bung3, bung4, bung5, bung6, bung7, bung8, bung9, bung10, bung11];

// Accommodation details from the official ALL / Accor page (hotel C477).
// Every unit is a 75 m² stay with two bedrooms for up to 4 guests.
export const STAYS: Stay[] = [
  {
    id: "apartment",
    group: "Apartments",
    code: "Apartment",
    name: "Apartment",
    img: appt1,
    images: APARTMENT_GALLERY,
    sleeps: "Max. 4 guests",
    size: "From 75 m² · 807 sq ft",
    from: "Rates on ALL.com",
    perks: ["1 double + 2 single beds", "Equipped kitchen", "Lounge + balcony"],
    description:
      "Spacious apartment with a lounge, two bedrooms and a bathroom with tub. The kitchen is equipped with a hob, fridge, oven, utensils and a kettle tray. Flat-screen satellite TV. Garden and sea-view balconies available.",
    bedding: ["1 double bed", "2 twin beds", "Baby crib on request"],
    specs: [
      { group: "Views", items: ["Garden or ocean / sea view (by unit)"] },
      { group: "Kitchen & dining", items: ["Hob, oven and fridge", "Mini-refrigerator", "Kitchen utensils and kettle tray", "Free in-room mineral water"] },
      { group: "Bathroom", items: ["Bathtub", "Bathroom products", "Make-up / magnifying mirror", "Mirror", "Universal shaving plug"] },
      { group: "Media & tech", items: ["Direct-dial telephone", "Satellite / cable colour TV", '32" / 81 cm flat screen'] },
      { group: "Comfort & safety", items: ["Opening windows", "Vacuum cleaner", "220 / 240 V AC", "Keycard-operated door locks", "Emergency info in room"] },
    ],
  },
  {
    id: "bungalow",
    group: "Bungalows",
    code: "Bungalow",
    name: "Bungalow",
    img: bung1,
    images: BUNGALOW_GALLERY,
    sleeps: "Max. 4 guests",
    size: "From 75 m² · 807 sq ft",
    from: "Rates on ALL.com",
    perks: ["1 double + 2 single beds", "Lounge + terrace", "Equipped kitchen"],
    description:
      "Spacious chalet with two bedrooms, a bathroom with tub, a lounge area and a private terrace. Kitchen with a hob, fridge, oven, utensils, kettle tray and a dining area, plus a wardrobe and flat-screen satellite TV. Garden, pool-side and sea-view terraces available.",
    bedding: ["1 double bed", "2 twin beds"],
    specs: [
      { group: "Views", items: ["Garden, pool side or ocean / sea view (by unit)"] },
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
