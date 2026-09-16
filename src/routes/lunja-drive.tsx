import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Download,
  Folder,
  Image as ImageIcon,
  Loader2,
  Search,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import lunjaLogo from "@/assets/lunja-logo.png";
import hero from "@/assets/hero-aerial.jpg";
import villageMap from "@/assets/lunja-map.png";
import docCoverPool from "@/assets/hero-pool.jpg";
import docCoverFiche from "@/assets/real-lunja-aerial.jpg";
import documentsBg from "@/assets/documents-bg.png";
import pushPin from "@/assets/stickers/push-pin.png";
import pushPinLime from "@/assets/stickers/push-pin-lime.png";
import reviewedStamp from "@/assets/stickers/reviewed-stamp.png";
import polaroidCorner from "@/assets/stickers/polaroid-corner.png";
import palmWaveDoodle from "@/assets/stickers/palm-wave-doodle.png";
import washiTape from "@/assets/stickers/washi-tape.png";
import magnifyingGlass from "@/assets/stickers/magnifying-glass.png";
import cameraDoodle from "@/assets/stickers/camera-doodle.png";
import clapperboardDoodle from "@/assets/stickers/clapperboard-doodle.png";
import sparkleScribbles from "@/assets/stickers/sparkle-scribbles.png";
import playButton from "@/assets/stickers/play-button.png";
import { listDriveMedia, type DriveMedia } from "@/lib/drive-media";
import { listFolders, type FolderDef } from "@/lib/drive-folders";
import { IG_URL } from "@/components/chrome";

export const Route = createFileRoute("/lunja-drive")({
  head: () => ({
    meta: [
      { title: "Lunja Drive · Médiathèque" },
      {
        name: "description",
        content: "La médiathèque de Lunja Village : photos et vidéos classées par catégorie, pour nos partenaires agences.",
      },
      { property: "og:title", content: "Lunja Drive · Médiathèque" },
      {
        property: "og:description",
        content: "Parcourez et déposez les photos et vidéos de Lunja Village, classées par catégorie.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LunjaDrivePage,
});

function Brand() {
  return (
    <Link to="/lunja-map" className="flex items-center gap-2 sm:gap-2.5">
      <span className="grid size-8 shrink-0 place-items-center overflow-hidden rounded-full border border-black/10 bg-[#FFE600] sm:size-10 md:size-12">
        <img src={lunjaLogo} alt="" className="size-full object-cover" />
      </span>
      <span className="whitespace-nowrap font-display text-base font-black uppercase leading-none sm:text-2xl md:text-3xl">
        Lunja <span className="inline-block -rotate-1 bg-[#FFE600] px-1.5 text-neutral-900">Village</span>
      </span>
    </Link>
  );
}

function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 bg-white/80 shadow-[0_1px_0_0_rgba(0,0,0,0.06)] backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:h-[4.5rem] sm:px-6">
        <Brand />
        <nav className="hidden items-center gap-6 font-display text-[13px] font-bold uppercase tracking-widest text-neutral-700 md:flex">
          <a href="#library" className="transition-colors hover:text-[#c9971a]">La médiathèque</a>
          <a href="#documents" className="transition-colors hover:text-[#c9971a]">Documents</a>
          <a href="#village-map" className="transition-colors hover:text-[#c9971a]">Le village</a>
        </nav>
        <a
          href={IG_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#FFE600] px-3 py-2 font-display text-[11px] uppercase tracking-widest text-neutral-900 shadow-md transition-transform hover:-translate-y-0.5 sm:px-5 sm:py-2.5 sm:text-sm"
        >
          <span className="hidden sm:inline">Contact agence</span>
          <span className="sm:hidden">Contact</span>
          <ArrowUpRight className="size-4" />
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative isolate min-h-[60svh] overflow-hidden bg-ink pt-16 text-linen grain-dark sm:pt-[4.5rem]">
      <img src={hero} alt="Aerial view of Lunja Village beside the Atlantic" width={1400} height={788} className="absolute inset-0 size-full object-cover opacity-70" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/60 to-ink/15" />
      <img src={reviewedStamp} alt="" className="pointer-events-none absolute right-6 top-24 w-20 -rotate-12 opacity-80 invert sm:right-10 sm:top-28 sm:w-28" />
      <div className="relative z-10 mx-auto flex min-h-[calc(60svh-4.5rem)] max-w-7xl items-end px-4 pb-14 pt-20 sm:px-6 sm:pb-16">
        <div className="max-w-4xl">
          <div className="relative mb-6 inline-block">
            <img src={washiTape} alt="" className="pointer-events-none absolute -top-3 left-1/2 w-24 -translate-x-1/2 -rotate-2 opacity-90" />
            <span className="relative inline-block -rotate-2 bg-[#FFF7D6] px-3 py-1.5 font-display text-xs font-bold uppercase tracking-widest text-neutral-800 shadow-[0_8px_20px_-8px_rgba(0,0,0,0.5)]">
              Réf. dossier · Imi Ouaddar
            </span>
          </div>
          <h1 className="relative font-display text-[clamp(3.2rem,9vw,7.5rem)] font-black uppercase leading-[0.8]">
            Lunja <span className="text-grunge text-[#FFE600]">Drive.</span>
            <img src={sparkleScribbles} alt="" className="pointer-events-none absolute -right-2 -top-6 w-12 opacity-80 invert sm:w-16" />
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-linen/85 sm:text-lg">
            Toutes les photos et vidéos, classées par catégorie, à parcourir et à déposer au même endroit.
          </p>
        </div>
      </div>
    </section>
  );
}

const FRAME_ROTATIONS = ["-rotate-1", "rotate-1", "rotate-0", "rotate-1", "-rotate-2", "rotate-0"];
const FRAME_ASPECTS = ["aspect-[4/5]", "aspect-square", "aspect-[3/4]", "aspect-[4/5]", "aspect-square", "aspect-[5/6]"];
const OPEN_LABELS = ["Ouvrir le dossier", "Voir la catégorie", "Entrer", "Parcourir", "Voir tout", "Découvrir"];
const TAPED_INDICES = new Set([1, 4]);

function FolderTile({ folder, count, index, onOpen }: { folder: FolderDef; count: number | null; index: number; onOpen: () => void }) {
  const rotate = FRAME_ROTATIONS[index % FRAME_ROTATIONS.length];
  const aspect = FRAME_ASPECTS[index % FRAME_ASPECTS.length];
  const label = OPEN_LABELS[index % OPEN_LABELS.length];
  const taped = TAPED_INDICES.has(index % 6);

  return (
    <button
      type="button"
      onClick={onOpen}
      className={`group relative mb-5 block w-full break-inside-avoid rounded-xl bg-white p-2.5 pb-4 text-left shadow-[0_10px_30px_-12px_rgba(0,0,0,0.25)] transition-all hover:-translate-y-1.5 hover:shadow-[0_20px_40px_-16px_rgba(0,0,0,0.3)] ${rotate} hover:rotate-0`}
    >
      {taped && (
        <img src={index % 6 === 1 ? pushPin : pushPinLime} alt="" className="pointer-events-none absolute -top-4 left-6 w-7 -rotate-6 drop-shadow" />
      )}
      <div className="flex items-center justify-between px-0.5 pb-1.5 font-display text-[9px] font-bold uppercase tracking-widest text-neutral-400">
        <span className="flex items-center gap-1">LUNJA <span className="text-neutral-300">DRIVE</span></span>
        <span className="flex items-center gap-1 text-neutral-500">{String(index + 1).padStart(2, "0")} <span className="text-[7px]">▶</span></span>
      </div>
      <div className="relative overflow-hidden rounded-sm bg-neutral-100">
        {folder.cover ? (
          /\.(mp4|mov|webm|m4v)$/i.test(folder.cover) ? (
            <video src={folder.cover} autoPlay loop muted playsInline preload="auto" className={`w-full object-cover transition-transform duration-700 group-hover:scale-[1.05] ${aspect}`} />
          ) : (
            <img src={folder.cover} alt="" className={`w-full object-cover transition-transform duration-700 group-hover:scale-[1.05] ${aspect}`} />
          )
        ) : (
          <div className={`grid w-full place-items-center ${folder.tint} ${aspect}`}>
            <Folder className="size-10 text-neutral-900/70" />
          </div>
        )}
        {index % 3 === 0 && (
          <img src={polaroidCorner} alt="" className="pointer-events-none absolute bottom-0 right-0 w-10 opacity-90" />
        )}
        <span className="absolute right-2 top-2 rounded-full bg-white/90 px-2 py-1 font-display text-[10px] font-bold uppercase text-neutral-700 shadow">
          {count === null ? "…" : `${count} média${count > 1 ? "s" : ""}`}
        </span>
      </div>
      <div className="px-0.5 pt-2.5">
        <h3 className="font-script text-2xl leading-none text-neutral-900">{folder.name}</h3>
        <span className="mt-1.5 inline-flex items-center gap-1 font-display text-[11px] font-bold uppercase text-[#c9971a] transition-transform group-hover:translate-x-1">
          {label} <ArrowUpRight className="size-3" />
        </span>
      </div>
    </button>
  );
}

function FolderGrid({ onOpen }: { onOpen: (folder: FolderDef) => void }) {
  const [folders, setFolders] = useState<FolderDef[] | null>(null);
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    let cancelled = false;
    listFolders()
      .then((result) => {
        if (cancelled) return;
        setFolders(result);
        Promise.all(
          result.map((folder) =>
            listDriveMedia({ data: folder.slug })
              .then((items) => [folder.slug, items.length] as const)
              .catch(() => [folder.slug, 0] as const),
          ),
        ).then((entries) => {
          if (!cancelled) setCounts(Object.fromEntries(entries));
        });
      })
      .catch((error) => {
        console.error(error);
        if (!cancelled) setFolders([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section id="library" className="scroll-mt-20 bg-white py-20 grain sm:py-28">
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        <span className="inline-block -rotate-2 bg-[#FFE600] px-2 py-0.5 font-script text-3xl text-neutral-900">les archives</span>
        <h2 className="mt-1 text-[clamp(3.2rem,8vw,6.5rem)] leading-[0.82] text-neutral-900">
          Parcourir par
          <span className="mt-3 block w-fit bg-[#FFE600] px-1.5 py-1 italic leading-[1.05] text-neutral-900">catégorie.</span>
        </h2>
        {folders === null ? (
          <div className="mt-14 flex items-center gap-3 text-ink/60"><Loader2 className="size-5 animate-spin" /> Chargement des catégories…</div>
        ) : (
          <div className="mt-10 columns-1 sm:columns-2 lg:columns-3 lg:gap-6">
            {folders.map((folder, index) => (
              <FolderTile
                key={folder.slug}
                folder={folder}
                count={counts[folder.slug] ?? null}
                index={index}
                onOpen={() => onOpen(folder)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

const MEDIA_ASPECTS = ["aspect-square", "aspect-[4/5]", "aspect-[3/4]", "aspect-square", "aspect-[5/6]", "aspect-[4/5]"];
const MEDIA_ROTATIONS = ["rotate-0", "-rotate-1", "rotate-1", "rotate-0", "rotate-1", "-rotate-1"];
const MEDIA_PIN_INDICES = new Set([0, 5]);

function MediaTile({ item, index, onOpen }: { item: DriveMedia; index: number; onOpen: () => void }) {
  const aspect = MEDIA_ASPECTS[index % MEDIA_ASPECTS.length];
  const rotate = MEDIA_ROTATIONS[index % MEDIA_ROTATIONS.length];
  const pinned = MEDIA_PIN_INDICES.has(index % 6);

  return (
    <button
      type="button"
      onClick={onOpen}
      className={`group relative mb-3 block w-full break-inside-avoid overflow-hidden rounded-xl bg-white p-2 text-left shadow-[0_10px_25px_-12px_rgba(0,0,0,0.2)] transition-all hover:-translate-y-1 hover:shadow-[0_18px_35px_-14px_rgba(0,0,0,0.28)] ${rotate} hover:rotate-0`}
    >
      {pinned && <img src={pushPin} alt="" className="pointer-events-none absolute -top-3 left-1/2 w-6 -translate-x-1/2 rotate-3 drop-shadow" />}
      <div className="flex items-center justify-between px-0.5 pb-1.5 font-display text-[9px] font-bold uppercase tracking-widest text-neutral-400">
        <span className="flex items-center gap-1">
          {item.type === "video" ? "VIDÉO" : "PHOTO"} <span className="text-neutral-300">LUNJA</span>
        </span>
        <span className="flex items-center gap-1 text-neutral-500">
          {String(index + 1).padStart(2, "0")} <span className="text-[7px]">▶</span>
        </span>
      </div>
      <div className={`relative overflow-hidden rounded-sm bg-neutral-100 ${aspect}`}>
        {item.type === "video" ? (
          <video src={item.url} className="size-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-105" muted playsInline preload="metadata" />
        ) : (
          <img src={item.url} alt={item.name} loading="lazy" className="size-full object-cover transition-transform duration-500 group-hover:scale-105" />
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        {item.type === "video" && (
          <img src={playButton} alt="" className="absolute bottom-2 right-2 w-8 drop-shadow" />
        )}
      </div>
    </button>
  );
}

type MediaFilter = "all" | "image" | "video";

function FolderView({ folder, onClose, onOpenLightbox }: { folder: FolderDef; onClose: () => void; onOpenLightbox: (items: DriveMedia[], index: number) => void }) {
  const [items, setItems] = useState<DriveMedia[] | null>(null);
  const [filter, setFilter] = useState<MediaFilter>("all");
  const [query, setQuery] = useState("");

  useEffect(() => {
    let cancelled = false;
    setItems(null);
    setFilter("all");
    setQuery("");
    listDriveMedia({ data: folder.slug })
      .then((result) => !cancelled && setItems(result))
      .catch((error) => {
        console.error(error);
        if (!cancelled) setItems([]);
      });
    return () => {
      cancelled = true;
    };
  }, [folder.slug]);

  const normalizedQuery = query.trim().toLowerCase();
  const visible = (items ?? []).filter((item) => {
    if (filter !== "all" && item.type !== filter) return false;
    if (normalizedQuery && !item.name.toLowerCase().includes(normalizedQuery)) return false;
    return true;
  });
  const imageCount = (items ?? []).filter((item) => item.type === "image").length;
  const videoCount = (items ?? []).filter((item) => item.type === "video").length;

  return (
    <section className="scroll-mt-20 bg-white py-16 grain sm:py-20">
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        <button type="button" onClick={onClose} className="inline-flex items-center gap-2 font-display text-sm font-bold uppercase text-ink/60 hover:text-[#c9971a]">
          <ArrowLeft className="size-4" /> Toutes les catégories
        </button>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-[clamp(2.8rem,7vw,5.5rem)] leading-[0.85]">{folder.name}</h2>
        </div>

        {items && items.length > 0 && (
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrer par type">
              {(
                [
                  ["all", `Tout (${items.length})`, null],
                  ["image", `Photos (${imageCount})`, cameraDoodle],
                  ["video", `Vidéos (${videoCount})`, clapperboardDoodle],
                ] as const
              ).map(([value, label, icon]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setFilter(value)}
                  className={`inline-flex items-center gap-1.5 rounded-full border border-black/10 px-4 py-2 font-display text-xs font-black uppercase transition-colors ${
                    filter === value ? "bg-ink text-[#FFE600]" : "bg-white text-ink hover:bg-[#FFE600]"
                  }`}
                >
                  {icon && <img src={icon} alt="" className={`size-3.5 ${filter === value ? "invert" : ""}`} />}
                  {label}
                </button>
              ))}
            </div>
            <div className="relative w-full sm:w-72">
              <img src={magnifyingGlass} alt="" className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 opacity-50" />
              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Rechercher un fichier…"
                className="w-full rounded-full border border-black/10 bg-white py-2 pl-9 pr-4 text-sm outline-none focus:bg-[#FFE600]/10"
              />
            </div>
          </div>
        )}

        {items === null && (
          <div className="mt-14 flex items-center gap-3 text-ink/60"><Loader2 className="size-5 animate-spin" /> Chargement des médias…</div>
        )}

        {items && items.length === 0 && (
          <div className="mt-14 flex flex-col items-center gap-3 border border-dashed border-ink/20 py-16 text-center text-ink/60">
            <ImageIcon className="size-8" />
            <p className="max-w-sm text-sm">Aucun média dans ce dossier pour l'instant.</p>
          </div>
        )}

        {items && items.length > 0 && visible.length === 0 && (
          <div className="mt-14 flex flex-col items-center gap-3 border border-dashed border-ink/20 py-16 text-center text-ink/60">
            <Search className="size-8" />
            <p className="max-w-sm text-sm">Aucun résultat pour cette recherche.</p>
          </div>
        )}

        {visible.length > 0 && (
          <div className="mt-8 columns-2 sm:columns-3 lg:columns-4 lg:gap-4">
            {visible.map((item, index) => (
              <MediaTile key={item.path} item={item} index={index} onOpen={() => onOpenLightbox(visible, index)} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function Lightbox({ items, index, onClose, onNavigate }: { items: DriveMedia[]; index: number; onClose: () => void; onNavigate: (index: number) => void }) {
  const item = items[index];
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") onNavigate((index + 1) % items.length);
      if (event.key === "ArrowLeft") onNavigate((index - 1 + items.length) % items.length);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = old;
      window.removeEventListener("keydown", onKey);
    };
  }, [index, items.length, onClose, onNavigate]);

  if (!item) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-ink/95 backdrop-blur-sm" role="dialog" aria-modal="true" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="flex items-center justify-between px-4 py-3 sm:px-6">
        <span className="font-display text-xs font-black uppercase text-linen/70">{String(index + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}</span>
        <Button ref={closeRef} type="button" size="icon" aria-label="Fermer" onClick={onClose} className="border border-white/30 bg-transparent text-linen hover:bg-[#FFE600] hover:text-ink"><X /></Button>
      </div>
      <div className="relative flex flex-1 items-center justify-center px-3 pb-4">
        {item.type === "video" ? (
          <video src={item.url} controls autoPlay className="max-h-[75svh] max-w-full border border-white/15" />
        ) : (
          <img src={item.url} alt={item.name} className="max-h-[75svh] max-w-full object-contain" />
        )}
        {items.length > 1 && (
          <>
            <Button type="button" size="icon" aria-label="Previous" onClick={() => onNavigate((index - 1 + items.length) % items.length)} className="absolute left-2 top-1/2 -translate-y-1/2 border border-white/30 bg-ink/60 text-linen hover:bg-[#FFE600] hover:text-ink sm:left-6"><ArrowLeft /></Button>
            <Button type="button" size="icon" aria-label="Next" onClick={() => onNavigate((index + 1) % items.length)} className="absolute right-2 top-1/2 -translate-y-1/2 border border-white/30 bg-ink/60 text-linen hover:bg-[#FFE600] hover:text-ink sm:right-6"><ArrowRight /></Button>
          </>
        )}
      </div>
    </div>
  );
}

function MapPreview() {
  const [expanded, setExpanded] = useState(false);

  return (
    <section id="village-map" className="scroll-mt-20 bg-[#FFF7D6] py-20 sm:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <div>
          <span className="font-script text-3xl text-[#c9971a]">se repérer</span>
          <h2 className="mt-1 text-[clamp(2.6rem,7vw,4.5rem)] leading-[0.85] text-neutral-900">
            Le plan du
            <br /> village, en direct.
          </h2>
          <p className="mt-5 max-w-md text-base leading-relaxed text-neutral-600">
            Chambres, piscines, restaurant, accès plage : chaque lieu du village est repéré sur un plan interactif, zoomable et à jour.
          </p>
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-neutral-900 px-6 py-3.5 font-display text-sm uppercase tracking-wider text-[#FFE600] shadow-lg transition-transform hover:-translate-y-0.5"
          >
            Voir le plan en grand <ArrowUpRight className="size-4" />
          </button>
        </div>

        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="group relative block rotate-1 overflow-hidden rounded-2xl border-8 border-white text-left shadow-[0_30px_60px_-24px_rgba(0,0,0,0.35)] transition-transform hover:rotate-0"
        >
          <img src={villageMap} alt="Plan du village Lunja" className="w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
          <div className="absolute inset-0 bg-ink/0 transition-colors group-hover:bg-ink/10" />
          <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 font-display text-[11px] font-bold uppercase text-neutral-800 shadow">
            Voir en grand <ArrowUpRight className="size-3" />
          </span>
        </button>
      </div>

      {expanded && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/90 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          onMouseDown={(event) => event.target === event.currentTarget && setExpanded(false)}
        >
          <div className="relative max-h-[85svh] max-w-5xl overflow-auto rounded-lg border-4 border-white bg-white shadow-2xl">
            <button
              type="button"
              onClick={() => setExpanded(false)}
              aria-label="Fermer"
              className="absolute right-3 top-3 z-10 grid size-9 place-items-center rounded-full bg-white text-ink shadow-lg hover:bg-[#FFE600]"
            >
              <X className="size-4" />
            </button>
            <img src={villageMap} alt="Plan du village Lunja" className="w-full" />
          </div>
        </div>
      )}
    </section>
  );
}

type DocEntry = {
  code: string;
  title: string;
  meta: string;
  lang: string;
  url: string | null;
  cover: string;
};

const DOCUMENTS: DocEntry[] = [
  {
    code: "EN",
    title: "Présentation",
    meta: "Vue d'ensemble du village, hébergements et services",
    lang: "English",
    url: "https://gskrfvszynfcpputwbff.supabase.co/storage/v1/object/public/lunja-drive/_documents/lunja-presentation-en.pdf",
    cover: hero,
  },
  {
    code: "FR",
    title: "Présentation",
    meta: "Vue d'ensemble du village, hébergements et services",
    lang: "Français",
    url: "https://gskrfvszynfcpputwbff.supabase.co/storage/v1/object/public/lunja-drive/_documents/lunja-presentation-fr.pdf",
    cover: docCoverPool,
  },
  {
    code: "F2",
    title: "Fiche technique",
    meta: "Spécifications détaillées du village",
    lang: "PDF",
    url: "https://gskrfvszynfcpputwbff.supabase.co/storage/v1/object/public/lunja-drive/_documents/fiche-technique-f2.pdf",
    cover: docCoverFiche,
  },
];

function DocumentCard({ doc, index }: { doc: DocEntry; index: number }) {
  const available = Boolean(doc.url);
  const Wrapper = available ? "a" : "div";

  return (
    <Wrapper
      {...(available ? { href: doc.url!, target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`group relative flex h-full flex-col overflow-hidden rounded-sm bg-white shadow-[6px_10px_0_-4px_rgba(0,0,0,0.05),10px_16px_0_-8px_rgba(0,0,0,0.04),0_25px_50px_-24px_rgba(0,0,0,0.35)] transition-transform ${available ? "hover:-translate-y-2" : "opacity-60"}`}
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden">
        <img src={doc.cover} alt="" className="size-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/60 to-transparent" />
        <div className="absolute inset-0 border border-[#c9971a]/30" />
        <span className="absolute left-5 top-5 font-display text-6xl font-black leading-none text-white/70 [text-shadow:0_2px_10px_rgba(0,0,0,0.25)]">{doc.code}</span>
        <span className="absolute right-5 top-5 font-display text-xs text-neutral-900/40">{String(index + 1).padStart(2, "0")} / 03</span>

        <div className="absolute inset-x-5 bottom-5">
          <span className="block h-px w-10 bg-[#c9971a]" />
          <h3 className="mt-3 font-display text-2xl uppercase leading-[0.95] text-neutral-900 sm:text-3xl">{doc.title}</h3>
          <p className="mt-2 text-xs leading-relaxed text-neutral-600">{doc.meta}</p>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-black/10 bg-white px-5 py-4">
        <span className="font-display text-[11px] font-bold uppercase tracking-widest text-neutral-500">{doc.lang}</span>
        {available ? (
          <span className="grid size-9 place-items-center rounded-full border border-[#c9971a]/60 text-[#c9971a] transition-all group-hover:bg-[#c9971a] group-hover:text-white">
            <Download className="size-4" />
          </span>
        ) : (
          <span className="font-display text-[11px] font-bold uppercase tracking-widest text-neutral-400">Bientôt</span>
        )}
      </div>
    </Wrapper>
  );
}

function DocumentsSection() {
  return (
    <section id="documents" className="relative scroll-mt-20 overflow-hidden py-20 sm:py-28">
      <img src={documentsBg} alt="" className="absolute inset-0 size-full object-cover" />
      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="font-display text-xs font-bold uppercase tracking-[0.3em] text-[#c9971a]">Press kit</span>
            <h2 className="mt-2 text-[clamp(2.4rem,6vw,4rem)] font-display uppercase leading-[0.9] text-linen">Documents officiels</h2>
          </div>
          <p className="max-w-xs text-sm text-white/60">Dossiers de présentation et fiches techniques, prêts à télécharger.</p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {DOCUMENTS.map((doc, index) => (
            <DocumentCard key={doc.code} doc={doc} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Closing() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-[92rem] px-5 py-20 text-center sm:px-10 sm:py-28">
        <div className="flex items-center justify-center gap-4 sm:gap-6">
          <span className="grid size-14 shrink-0 place-items-center rounded-full border border-black/10 bg-[#FFE600] shadow-[0_16px_40px_-14px_rgba(0,0,0,0.35)] sm:size-20">
            <img src={palmWaveDoodle} alt="" className="size-8 sm:size-11" />
          </span>
          <h2 className="text-left font-display text-[clamp(2.2rem,8vw,5rem)] leading-[0.95] tracking-tight text-neutral-900">
            Tout Lunja,
            <br className="hidden sm:block" /> au même endroit.
          </h2>
        </div>
        <p className="mx-auto mt-5 max-w-md text-[15px] text-neutral-500 sm:text-base">
          Besoin d'accès, ou envie d'ajouter des médias ? Contactez-nous, on s'en occupe.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap">
          <a
            href={IG_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#FFE600] px-6 py-3.5 font-display text-sm uppercase tracking-wider text-neutral-900 shadow-lg transition-transform hover:-translate-y-0.5 sm:text-base"
          >
            Discutons-en <ArrowUpRight className="size-5" />
          </a>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="relative bg-[#333] text-white">
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FFE600] px-4 py-2 font-display text-xs uppercase tracking-widest text-neutral-900 shadow-lg"
      >
        ↑ Haut
      </button>
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:grid-cols-2 sm:px-10 lg:grid-cols-4 lg:px-16">
        <div>
          <Brand />
          <p className="mt-4 max-w-xs text-sm text-white/70">
            La médiathèque de Lunja Village : photos, vidéos et documents, classés et à jour.
          </p>
        </div>
        <div>
          <h4 className="font-display text-lg tracking-tight">Parcourir</h4>
          <div className="mt-3 flex flex-col gap-2 text-sm text-white/70">
            <a href="#library" className="hover:text-white">Toutes les catégories</a>
            <a href="#documents" className="hover:text-white">Documents officiels</a>
            <a href="#village-map" className="hover:text-white">Le plan du village</a>
          </div>
        </div>
        <div>
          <h4 className="font-display text-lg tracking-tight">Nous trouver</h4>
          <p className="mt-3 text-sm text-white/70">
            Lunja Village, Imi Ouaddar,
            <br /> Agadir, Maroc
          </p>
        </div>
        <div className="flex flex-col items-start gap-3">
          <span className="rounded-full bg-white/10 px-3 py-1 font-display text-xs uppercase tracking-widest">
            Réservé aux partenaires
          </span>
          <p className="text-sm text-white/60">
            Besoin d'un accès ou d'un média spécifique ? Écrivez-nous, on s'en occupe.
          </p>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-5 py-4 text-xs uppercase tracking-widest text-white/60 sm:px-10 lg:px-16">
          <span>© {new Date().getFullYear()} Lunja Village · Imi Ouaddar · Développé par EIDEN GROUP</span>
          <a href="#village-map" className="text-[#FFE600] hover:text-white">Voir le plan du village <ArrowUpRight className="inline size-3.5" /></a>
        </div>
      </div>
    </footer>
  );
}

function LunjaDrivePage() {
  const [activeFolder, setActiveFolder] = useState<FolderDef | null>(null);
  const [lightbox, setLightbox] = useState<{ items: DriveMedia[]; index: number } | null>(null);

  return (
    <div className="min-h-screen overflow-x-hidden bg-white text-ink">
      <Header />
      <main>
        <Hero />
        {activeFolder ? (
          <FolderView
            folder={activeFolder}
            onClose={() => setActiveFolder(null)}
            onOpenLightbox={(items, index) => setLightbox({ items, index })}
          />
        ) : (
          <>
            <FolderGrid onOpen={setActiveFolder} />
            <DocumentsSection />
            <MapPreview />
          </>
        )}
        <Closing />
      </main>
      <Footer />
      {lightbox && (
        <Lightbox
          items={lightbox.items}
          index={lightbox.index}
          onClose={() => setLightbox(null)}
          onNavigate={(index) => setLightbox((prev) => (prev ? { ...prev, index } : prev))}
        />
      )}
    </div>
  );
}
