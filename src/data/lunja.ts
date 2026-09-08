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

/** Coordonnées relevées sur le plan officiel de Lunja Village. */
export const POIS: Poi[] = [
  { id: "accueil", n: 1, name: "Vous êtes ici", kind: "hub", x: 13.3, y: 33.5, blurb: " ", detail: " " },
  { id: "social", n: 2, name: "Accueil / Réservation", kind: "hub", x: 45.8, y: 58.9, blurb: "Check-in, bracelets, clés", detail: "Premier arrêt après le portail : check-in, dépôt des bagages, et toutes vos questions qui trouvent une réponse. C'est aussi ici que se réserve chaque séjour au village." },
  { id: "resto", n: 3, name: "Restaurant Le Sahariat & Bar Le Consul", kind: "hub", x: 49.2, y: 47.5, blurb: "Le Sahariat · Mimosa · Le Consul", detail: "Du petit-déj au dîner tardif, entre Le Sahariat et Mimosa. Le Consul pour l'apéro face au coucher de soleil." },
  { id: "piscine-main", n: 4, name: "Piscine centrale", kind: "water", x: 64.4, y: 57.3, blurb: "Grand bassin + solarium", detail: "La piscine principale, transats et coins d'ombre, dans les jardins est." },
  { id: "piscine-kids", n: 5, name: "Piscine & Snack Tmada", kind: "water", x: 24.4, y: 65.7, blurb: "Bassin + petite restauration", detail: "Piscine ouest avec le snack Tmada pour déjeuner sans quitter l'eau." },
  { id: "kids-club", n: 6, name: "Kids Club", kind: "kids", x: 31.4, y: 68.3, blurb: "Jeux, ateliers, mini-disco", detail: "Activités encadrées toute la journée, et la mini-disco que les parents adorent en secret." },
  { id: "riad", n: 7, name: "chill-out & bar", kind: "hub", x: 11.8, y: 44.3, blurb: "Lounge chill-out & bar", detail: "Lounge chill-out et bar au bord des jardins ouest, pour les après-midis au ralenti et les verres qui s'étirent. C'est aussi le CHILLOUT : on y passe du surf au coucher de soleil — beer garden, café et les sunsets les plus animés d'Imi Ouaddar, mixés par le collectif Lineup." },
  { id: "bungalows-jardin", n: 8, name: "Bungalows Jardin", kind: "stay", x: 34.0, y: 78.0, blurb: "Terrasse privée sur le jardin", detail: "Petits bungalows blancs, une terrasse rien qu'à soi et le silence total la nuit." },
  { id: "bungalows-piscine", n: 9, name: "Bungalows Piscine", kind: "stay", x: 60.0, y: 63.0, blurb: "À quelques pas de l'eau", detail: "Des bungalows qui donnent droit sur le deck de la piscine. Serviette, dix pas, plouf." },
  { id: "bungalows-mer", n: 10, name: "Bungalows Vue Mer", kind: "stay", x: 85.0, y: 63.0, blurb: "L'Atlantique à l'horizon", detail: "Le premier rang côté est : des terrasses orientées océan pour ne rien rater du coucher de soleil." },
  { id: "asayas", n: 11, name: "Asayas", kind: "sport", x: 41.4, y: 64.3, blurb: "Salle de conférence & événements", detail: "Salle de conférence pour réunions et événements, juste à côté du Social Hub." },
  { id: "bungalows-est", n: 12, name: "Bungalows Jardins Est", kind: "stay", x: 71.4, y: 78.7, blurb: "Bungalows côté piscines est", detail: "Rangées de bungalows dans les jardins est, entre les piscines et le chemin de la plage." },
  { id: "piscine-ayoub", n: 13, name: "Piscine & Snack Ayoub", kind: "water", x: 83.5, y: 80.2, blurb: "Piscine est + snack", detail: "La piscine est, la plus proche du chemin de la plage, avec le snack Ayoub à côté." },
  { id: "beach", n: 14, name: "Accès Plage", kind: "access", x: 95.0, y: 66.4, blurb: "Chemin direct vers le sable", detail: "Une passerelle courte, droit vers l'Atlantique. Les cours de surf s'y retrouvent au lever du jour." },
  { id: "parking-n", n: 15, name: "Parking Nord", kind: "access", x: 23.9, y: 28.5, blurb: "Parking visiteurs", detail: "Parking près du portail nord, au plus près des jardins ouest et de l'accueil." },
  { id: "parking-s", n: 16, name: "Parking central", kind: "access", x: 43.9, y: 42.5, blurb: "Parking principal", detail: "Parking central près du Social Hub, avec zone de dépose pour navettes et taxis." },
];

export const KIND_LABEL: Record<Poi["kind"], string> = {
  hub: "Vie",
  stay: "Dormir",
  water: "Piscines",
  kids: "Enfants",
  sport: "Sport",
  access: "Accès",
};

export type StaySpec = { group: string; items: string[] };
export type StayGroup = "Apartments" | "Bungalows";
export type Stay = {
  id: string;
  group: StayGroup;
  code: string;
  name: string;
  img: string;
  /** Galerie photo complète (Accor). Présente = la carte affiche un slider. */
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

// Détails hébergement d'après la page officielle ALL / Accor (hôtel C477).
// Chaque unité fait 75 m², deux chambres, jusqu'à 4 personnes.
export const STAYS: Stay[] = [
  {
    id: "apartment",
    group: "Apartments",
    code: "Appart",
    name: "Appartement",
    img: appt1,
    images: APARTMENT_GALLERY,
    sleeps: "4 personnes max.",
    size: "À partir de 75 m²",
    from: "560 MAD",
    perks: ["Occupation quadruple", "Cuisine équipée", "Départ tardif jusqu'à 14h"],
    description:
      "Grand appartement avec salon, deux chambres et une salle de bain avec baignoire. Cuisine équipée : plaque, frigo, four, ustensiles et plateau bouilloire. TV satellite à écran plat. Balcons vue jardin ou vue mer selon l'unité.",
    bedding: ["1 lit double", "2 lits simples", "Lit bébé sur demande"],
    specs: [
      { group: "Vues", items: ["Vue jardin ou vue océan / mer (selon l'unité)"] },
      { group: "Cuisine & repas", items: ["Plaque, four et frigo", "Mini-réfrigérateur", "Ustensiles et plateau bouilloire", "Eau minérale offerte en chambre"] },
      { group: "Salle de bain", items: ["Baignoire", "Produits de toilette", "Miroir grossissant / maquillage", "Miroir", "Prise rasoir universelle"] },
      { group: "Multimédia", items: ["Téléphone ligne directe", "TV couleur satellite / câble", "Écran plat 81 cm / 32\""] },
      { group: "Confort & sécurité", items: ["Fenêtres ouvrables", "Aspirateur", "220 / 240 V", "Serrures à carte", "Consignes de sécurité en chambre"] },
    ],
  },
  {
    id: "bungalow",
    group: "Bungalows",
    code: "Bungalow",
    name: "Bungalow",
    img: bung1,
    images: BUNGALOW_GALLERY,
    sleeps: "4 personnes max.",
    size: "À partir de 75 m²",
    from: "680 MAD",
    perks: ["Occupation quadruple", "Salon + terrasse", "Départ tardif jusqu'à 14h"],
    description:
      "Grand chalet avec deux chambres, une salle de bain avec baignoire, un coin salon et une terrasse privée. Cuisine avec plaque, frigo, four, ustensiles, plateau bouilloire et coin repas, plus un dressing et une TV satellite à écran plat. Terrasses vue jardin, côté piscine ou vue mer selon l'unité.",
    bedding: ["1 lit double", "2 lits simples"],
    specs: [
      { group: "Vues", items: ["Vue jardin, côté piscine ou vue océan / mer (selon l'unité)"] },
      { group: "Cuisine & repas", items: ["Plaque, four et frigo", "Mini-réfrigérateur", "Ustensiles, plateau bouilloire et coin repas", "Dressing"] },
      { group: "Salle de bain", items: ["Baignoire", "Produits de toilette", "Miroir grossissant / maquillage", "Miroir", "Prise rasoir universelle"] },
      { group: "Multimédia", items: ["Téléphone ligne directe", "TV couleur satellite / câble"] },
      { group: "Confort & sécurité", items: ["Fenêtres ouvrables", "Aspirateur", "220 / 240 V", "Serrures à carte", "Consignes de sécurité en chambre"] },
    ],
  },
];

/** Ce que le village offre vraiment, juste devant la porte (ALL / Accor). */
export const EXPERIENCES = [
  { id: "nights", title: "Bars & soirées live", img: nights, line: "Un restaurant, deux snacks et deux lounge bars (Le Consul, Mimosa), avec des shows live à la nuit tombée." },
  { id: "surf", title: "Surf", img: surf, line: "Imi Ouaddar et les spots juste au nord : la côte atlantique du surf, à quelques minutes." },
  { id: "beach", title: "Accès plage", img: plage, line: "Un chemin privé depuis le côté est, droit vers le sable ouvert de l'Atlantique." },
];
