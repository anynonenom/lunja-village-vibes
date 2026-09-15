import coverRooms from "@/assets/bungalow.jpg";
import coverEvents from "@/assets/party.jpg";
import coverPool from "@/assets/hero-pool.jpg";
import coverFood from "@/assets/ph-dj.jpg";
import coverMarketing from "@/assets/feed1.jpg";
import coverStaff from "@/assets/drive-salma.jpg";

export type FolderDef = {
  slug: string;
  name: string;
  cover: string;
  tint: string;
};

export const folders: FolderDef[] = [
  { slug: "rooms-stays", name: "Chambres & Séjours", cover: coverRooms, tint: "bg-[#C8E420]" },
  { slug: "events-nightlife", name: "Événements & Soirées", cover: coverEvents, tint: "bg-neutral-900" },
  { slug: "pool-grounds", name: "Piscine & Extérieurs", cover: coverPool, tint: "bg-[#FFE600]" },
  { slug: "food-beverage", name: "Restauration", cover: coverFood, tint: "bg-neutral-900" },
  { slug: "marketing-social", name: "Marketing & Réseaux", cover: coverMarketing, tint: "bg-[#C8E420]" },
  { slug: "staff", name: "Équipe", cover: coverStaff, tint: "bg-[#FFE600]" },
];
