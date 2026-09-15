import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Folder,
  Image as ImageIcon,
  Loader2,
  Mail,
  Play,
  Sparkles,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import lunjaLogo from "@/assets/lunja-logo.png";
import hero from "@/assets/hero-aerial.jpg";
import { listDriveMedia, type DriveMedia } from "@/lib/drive-media";
import { folders, type FolderDef } from "@/lib/drive-folders";

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
    <span className="flex items-center gap-2.5">
      <span className="grid size-10 place-items-center overflow-hidden rounded-full border-2 border-ink bg-[#FFE600] sm:size-12">
        <img src={lunjaLogo} alt="" className="size-full object-cover" />
      </span>
      <span className="font-display text-2xl font-black uppercase leading-none sm:text-3xl">
        Lunja <span className="inline-block -rotate-1 bg-[#FFE600] px-1.5">Village</span>
      </span>
    </span>
  );
}

function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b-2 border-ink bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/lunja-drive" aria-label="Lunja Drive home"><Brand /></Link>
        <Button asChild className="h-10 rounded-none border-2 border-ink bg-ink px-3 font-display font-black uppercase text-linen shadow-hard hover:bg-[#FFE600] hover:text-ink sm:px-5">
          <Link to="/contact">Contact agence <ArrowUpRight /></Link>
        </Button>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative isolate min-h-[60svh] overflow-hidden bg-ink pt-[4.5rem] text-linen grain-dark">
      <img src={hero} alt="Aerial view of Lunja Village beside the Atlantic" width={1400} height={788} className="absolute inset-0 size-full object-cover opacity-70" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/60 to-ink/15" />
      <div className="relative z-10 mx-auto flex min-h-[calc(60svh-4.5rem)] max-w-7xl items-end px-4 pb-14 pt-20 sm:px-6 sm:pb-16">
        <div className="max-w-4xl">
          <div className="mb-5 flex items-center gap-3 font-display text-sm font-bold uppercase tracking-[0.2em] text-[#FFE600]">
            <span className="h-px w-9 bg-[#FFE600]" /> Médiathèque · 2026
          </div>
          <h1 className="font-display text-[clamp(3.2rem,9vw,7.5rem)] font-black uppercase leading-[0.8]">
            Lunja <span className="text-grunge text-[#FFE600]">Drive.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-linen/85 sm:text-lg">
            Toutes les photos et vidéos, classées par catégorie, à parcourir et à déposer au même endroit.
          </p>
        </div>
      </div>
    </section>
  );
}

function FolderTile({ folder, onOpen }: { folder: FolderDef; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group relative block overflow-hidden border-2 border-ink bg-paper text-left shadow-hard transition-transform hover:-translate-y-1"
    >
      <img src={folder.cover} alt="" className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
      <span className={`absolute left-3 top-3 grid size-10 place-items-center rounded-full border-2 border-ink ${folder.tint}`}>
        <Folder className="size-5" />
      </span>
      <div className="absolute inset-x-0 bottom-0 p-4">
        <h3 className="text-2xl leading-none text-linen sm:text-3xl">{folder.name}</h3>
        <span className="mt-1 inline-flex items-center gap-1 font-display text-xs font-bold uppercase text-[#FFE600]">
          Ouvrir le dossier <ArrowUpRight className="size-3.5" />
        </span>
      </div>
    </button>
  );
}

function FolderGrid({ onOpen }: { onOpen: (folder: FolderDef) => void }) {
  return (
    <section id="library" className="scroll-mt-20 bg-white py-20 grain sm:py-28">
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        <span className="inline-block -rotate-2 bg-[#FFE600] px-2 py-0.5 font-script text-3xl text-neutral-900">les archives</span>
        <h2 className="mt-1 text-[clamp(3.2rem,8vw,6.5rem)] leading-[0.82] text-neutral-900">Parcourir par<br /><span className="box-decoration-clone bg-[#FFE600] px-1.5 italic text-neutral-900">catégorie.</span></h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {folders.map((folder) => (
            <FolderTile key={folder.slug} folder={folder} onOpen={() => onOpen(folder)} />
          ))}
        </div>
      </div>
    </section>
  );
}

function MediaTile({ item, onOpen }: { item: DriveMedia; onOpen: () => void }) {
  return (
    <button type="button" onClick={onOpen} className="group relative block aspect-square overflow-hidden border-2 border-ink bg-ink text-left">
      {item.type === "video" ? (
        <video src={item.url} className="size-full object-cover opacity-90" muted playsInline preload="metadata" />
      ) : (
        <img src={item.url} alt={item.name} loading="lazy" className="size-full object-cover transition-transform duration-500 group-hover:scale-105" />
      )}
      {item.type === "video" && (
        <span className="absolute bottom-2 right-2 grid size-9 place-items-center rounded-full border-2 border-ink bg-[#FFE600] shadow-hard">
          <Play className="ml-0.5 size-4 fill-current" />
        </span>
      )}
    </button>
  );
}

function FolderView({ folder, onClose, onOpenLightbox }: { folder: FolderDef; onClose: () => void; onOpenLightbox: (items: DriveMedia[], index: number) => void }) {
  const [items, setItems] = useState<DriveMedia[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    setItems(null);
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

  return (
    <section className="scroll-mt-20 bg-white py-16 grain sm:py-20">
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        <button type="button" onClick={onClose} className="inline-flex items-center gap-2 font-display text-sm font-bold uppercase text-ink/60 hover:text-[#c9971a]">
          <ArrowLeft className="size-4" /> Toutes les catégories
        </button>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-[clamp(2.8rem,7vw,5.5rem)] leading-[0.85]">{folder.name}</h2>
        </div>

        {items === null && (
          <div className="mt-14 flex items-center gap-3 text-ink/60"><Loader2 className="size-5 animate-spin" /> Chargement des médias…</div>
        )}

        {items && items.length === 0 && (
          <div className="mt-14 flex flex-col items-center gap-3 border-2 border-dashed border-ink/30 py-16 text-center text-ink/60">
            <ImageIcon className="size-8" />
            <p className="max-w-sm text-sm">Aucun média dans ce dossier pour l'instant.</p>
          </div>
        )}

        {items && items.length > 0 && (
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {items.map((item, index) => (
              <MediaTile key={item.path} item={item} onOpen={() => onOpenLightbox(items, index)} />
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
        <Button ref={closeRef} type="button" size="icon" aria-label="Fermer" onClick={onClose} className="rounded-none border-2 border-linen bg-transparent text-linen hover:bg-[#FFE600] hover:text-ink"><X /></Button>
      </div>
      <div className="relative flex flex-1 items-center justify-center px-3 pb-4">
        {item.type === "video" ? (
          <video src={item.url} controls autoPlay className="max-h-[75svh] max-w-full border-2 border-linen/20" />
        ) : (
          <img src={item.url} alt={item.name} className="max-h-[75svh] max-w-full object-contain" />
        )}
        {items.length > 1 && (
          <>
            <Button type="button" size="icon" aria-label="Previous" onClick={() => onNavigate((index - 1 + items.length) % items.length)} className="absolute left-2 top-1/2 -translate-y-1/2 rounded-none border-2 border-linen bg-ink/60 text-linen hover:bg-[#FFE600] hover:text-ink sm:left-6"><ArrowLeft /></Button>
            <Button type="button" size="icon" aria-label="Next" onClick={() => onNavigate((index + 1) % items.length)} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-none border-2 border-linen bg-ink/60 text-linen hover:bg-[#FFE600] hover:text-ink sm:right-6"><ArrowRight /></Button>
          </>
        )}
      </div>
    </div>
  );
}

function Closing() {
  return (
    <section className="bg-[#C8E420] py-16 grain sm:py-20">
      <div className="relative z-10 mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <Sparkles className="size-10 text-ink" />
          <h2 className="mt-4 max-w-4xl text-[clamp(2.8rem,8vw,6rem)] leading-[0.8] text-ink">Tout Lunja,<br /><span className="box-decoration-clone bg-ink px-1.5 italic text-[#FFE600]">au même endroit.</span></h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink/75">Besoin d'accès, ou envie d'ajouter des médias ? Contactez-nous, on s'en occupe.</p>
        </div>
        <div className="flex flex-col gap-3">
          <Button asChild className="h-14 rounded-none border-2 border-ink bg-[#FFE600] px-6 font-display text-lg font-black uppercase text-ink shadow-hard hover:bg-white"><Link to="/contact">Discutons-en <ArrowUpRight /></Link></Button>
          <a href="mailto:hello@lunjavillage.com" className="inline-flex h-14 items-center justify-center gap-2 border-2 border-ink px-6 font-display text-base font-black uppercase text-ink hover:bg-white"><Mail className="size-5" /> Écrire à Lunja</a>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t-2 border-ink bg-ink py-8 text-linen">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <Brand />
        <p className="max-w-md text-sm text-linen/60">La médiathèque de Lunja Village, Imi Ouaddar.</p>
        <Link to="/lunja-map" className="font-display text-sm font-black uppercase text-[#FFE600] hover:text-[#c9971a]">Visiter le village <ArrowUpRight className="inline size-4" /></Link>
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
          <FolderGrid onOpen={setActiveFolder} />
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
