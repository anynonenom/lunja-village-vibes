import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Instagram,
  MapPin,
  QrCode,
  BedDouble,
  Users,
  UtensilsCrossed,
  Waves,
  ArrowUpRight,
  ArrowLeft,
  ArrowRight,
  Maximize2,
  X,
  Phone,
  TreePalm,
  Wifi,
  Baby,
  Dumbbell,
  Wine,
} from "lucide-react";
import { LunjaMap } from "@/components/LunjaMap";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { WHATSAPP } from "@/components/chrome";
import { EXPERIENCES, INSTAGRAM_URL, STAYS, type Stay } from "@/data/lunja";
import heroImg from "@/assets/real-lunja-aerial.jpg";
import lunjaLogo from "@/assets/lunja-logo.png";
import lunjaMark from "@/assets/lunja-mark.png";

function LogoMark({
  className = "size-10",
  borderClass = "border-2 border-neutral-900",
}: {
  className?: string;
  borderClass?: string;
}) {
  return (
    <span
      className={`grid shrink-0 place-items-center overflow-hidden rounded-full bg-[#FFE600] ${borderClass} ${className}`}
    >
      <img src={lunjaLogo} alt="Lunja Village" className="h-full w-full object-contain" />
    </span>
  );
}

/** Site wordmark: "LUNJA" + a yellow "VILLAGE" tag, echoing the hero. */
function Wordmark({ dark = false }: { dark?: boolean }) {
  return (
    <span className="flex items-baseline gap-1.5 font-display leading-none tracking-tight">
      <span className={`text-xl sm:text-2xl ${dark ? "text-white" : "text-neutral-900"}`}>LUNJA</span>
      <span className="rounded-[3px] bg-[#FFE600] px-1.5 py-0.5 text-sm text-neutral-900 sm:text-base">
        VILLAGE
      </span>
    </span>
  );
}

export const Route = createFileRoute("/lunja-map")({
  head: () => ({
    meta: [
      { title: "Lunja Village Imi Ouaddar · Plan du village, appartements & bungalows" },
      {
        name: "description",
        content:
          "Tout Lunja Village, Imi Ouaddar : un plan interactif du site, les appartements et bungalows avec vraies photos et détails, plus le surf, les bars et la plage juste devant la porte.",
      },
      { property: "og:title", content: "Lunja Village · Explorez tout le village" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: JojoPage,
});

/* ------------------------------------------------------------------ */
/*  Scroll reveal                                                      */
/* ------------------------------------------------------------------ */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const items = el.querySelectorAll<HTMLElement>(".reveal");
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0, rootMargin: "0px 0px -8% 0px" },
    );
    items.forEach((i) => io.observe(i));
    const t = window.setTimeout(() => items.forEach((i) => i.classList.add("in")), 1400);
    return () => {
      io.disconnect();
      window.clearTimeout(t);
    };
  }, []);
  return ref;
}

/* ------------------------------------------------------------------ */
/*  Reusable bits                                                      */
/* ------------------------------------------------------------------ */
function Pill({
  as = "a",
  children,
  className = "",
  ...rest
}: {
  as?: "a" | "button";
  children: React.ReactNode;
  className?: string;
  [k: string]: unknown;
}) {
  const cls =
    "inline-flex items-center gap-2 rounded-full px-6 py-3 font-display text-lg tracking-wide transition-transform hover:-translate-y-0.5 active:translate-y-0 " +
    className;
  if (as === "button")
    return (
      <button className={cls} {...(rest as object)}>
        {children}
      </button>
    );
  return (
    <a className={cls} {...(rest as object)}>
      {children}
    </a>
  );
}

function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 font-display text-sm tracking-[0.2em] uppercase text-neutral-500">
      <span className="h-2 w-2 rounded-full bg-[#FFE600] ring-2 ring-neutral-900" />
      {children}
    </span>
  );
}

function SectionTitle({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <h2
      className={
        "font-display text-[clamp(2rem,7vw,4.5rem)] leading-[1.02] tracking-tight text-neutral-900 " +
        className
      }
    >
      {children}
    </h2>
  );
}

/* ------------------------------------------------------------------ */
/*  Lightbox                                                           */
/* ------------------------------------------------------------------ */
function Lightbox({
  images,
  start,
  onClose,
}: {
  images: string[];
  start: number;
  onClose: () => void;
}) {
  const [i, setI] = useState(start);
  const n = images.length;
  const go = useCallback((d: number) => setI((p) => (p + d + n) % n), [n]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [go, onClose]);

  return (
    <div className="jojo-lb fixed inset-0 z-[100] grid place-items-center bg-neutral-900/90 p-4 sm:p-6" onClick={onClose}>
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute right-3 top-3 z-10 grid size-11 place-items-center rounded-full bg-[#FFE600] text-neutral-900 sm:right-4 sm:top-4"
      >
        <X className="size-5" />
      </button>
      <figure className="jojo-lb-fig relative mx-auto grid max-h-[82vh] w-full max-w-5xl place-items-center" onClick={(e) => e.stopPropagation()}>
        <img src={images[i]} alt="" className="max-h-[82vh] w-auto rounded-2xl object-contain" />
        {n > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous"
              onClick={() => go(-1)}
              className="absolute left-1 top-1/2 -translate-y-1/2 grid size-10 place-items-center rounded-full bg-white/90 text-neutral-900 shadow-lg sm:left-2 sm:size-11"
            >
              <ArrowLeft className="size-5" />
            </button>
            <button
              type="button"
              aria-label="Next"
              onClick={() => go(1)}
              className="absolute right-1 top-1/2 -translate-y-1/2 grid size-10 place-items-center rounded-full bg-white/90 text-neutral-900 shadow-lg sm:right-2 sm:size-11"
            >
              <ArrowRight className="size-5" />
            </button>
            <figcaption className="absolute inset-x-0 -bottom-8 text-center font-display text-sm tracking-widest text-white/80">
              {i + 1} / {n}
            </figcaption>
          </>
        )}
      </figure>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Room block (alternating image / text)                              */
/* ------------------------------------------------------------------ */
function metaFor(s: Stay) {
  const view = s.specs?.find((g) => g.group.startsWith("Vue"))?.items[0];
  return [
    { Icon: Users, label: s.sleeps },
    view
      ? { Icon: Waves, label: view }
      : { Icon: BedDouble, label: s.bedding?.[0] ?? s.size },
    { Icon: UtensilsCrossed, label: "Cuisine équipée" },
  ];
}

/** Right-side pop-out with the full room spec sheet. */
function RoomDetailsPanel({
  s,
  onZoom,
}: {
  s: Stay;
  onZoom: (images: string[], start: number) => void;
}) {
  const gallery = s.images && s.images.length ? s.images : [s.img];
  return (
    <SheetContent
      side="right"
      className="w-full overflow-y-auto border-l border-black/10 bg-white p-0 text-neutral-800 sm:max-w-md"
    >
      <SheetClose className="absolute right-3 top-3 z-20 grid size-9 place-items-center rounded-full bg-[#FFE600] text-neutral-900 shadow-lg ring-2 ring-white transition-transform hover:rotate-90">
        <X className="size-5" />
        <span className="sr-only">Close</span>
      </SheetClose>
      <div className="relative">
        <button
          type="button"
          onClick={() => onZoom(gallery, 0)}
          className="block w-full"
          aria-label={`Open photos of ${s.name}`}
        >
          <img src={gallery[0]} alt={s.name} className="aspect-[3/2] w-full bg-neutral-100 object-contain" />
        </button>
        <span className="absolute left-3 top-3 rounded-full bg-neutral-900 px-3 py-1 font-display text-xs uppercase tracking-widest text-white">
          {s.code}
        </span>
        {gallery.length > 1 && (
          <span className="absolute bottom-3 right-3 grid size-9 place-items-center rounded-lg bg-[#FFE600] text-neutral-900 shadow">
            <Maximize2 className="size-4" />
          </span>
        )}
      </div>

      <div className="p-6 sm:p-7">
        <h3 className="font-display text-2xl leading-tight tracking-tight text-neutral-900">{s.name}</h3>
        <p className="mt-1 text-sm text-neutral-500">{s.sleeps} · {s.size}</p>
        {s.description && (
          <p className="mt-3 text-sm leading-relaxed text-neutral-600">{s.description}</p>
        )}

        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
          {metaFor(s).map(({ Icon, label }) => (
            <span key={label} className="inline-flex items-center gap-2 text-sm text-neutral-700">
              <Icon className="size-4 shrink-0 text-neutral-400" strokeWidth={1.75} />
              {label}
            </span>
          ))}
        </div>

        <div className="mt-5 space-y-4">
          {s.bedding && (
            <div>
              <p className="font-display text-xs uppercase tracking-widest text-neutral-500">Literie</p>
              <ul className="mt-1.5 flex flex-wrap gap-2">
                {s.bedding.map((b) => (
                  <li key={b} className="rounded-full border border-black/10 px-2.5 py-0.5 text-xs text-neutral-600">
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {s.specs?.map((grp) => (
            <div key={grp.group}>
              <p className="font-display text-xs uppercase tracking-widest text-neutral-500">{grp.group}</p>
              <ul className="mt-1 list-disc space-y-0.5 pl-4 text-[13px] text-neutral-600">
                {grp.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-6 border-t border-black/10 pt-4">
          <span className="font-display text-2xl leading-none tracking-tight text-neutral-900">{s.from}</span>
          <span className="ml-1 font-display text-xs uppercase tracking-widest text-neutral-400">/ nuit</span>
          <p className="mt-1 text-[11px] text-neutral-400">Logement seul · taxes incl. · jusqu'à 4 personnes · départ tardif jusqu'à 14h</p>
        </div>
      </div>
    </SheetContent>
  );
}

function RoomBlock({
  s,
  flip,
  onZoom,
}: {
  s: Stay;
  flip: boolean;
  onZoom: (images: string[], start: number) => void;
}) {
  const gallery = s.images && s.images.length ? s.images : [s.img];
  const [gi, setGi] = useState(0);
  const many = gallery.length > 1;
  const tilt = flip ? "sm:rotate-[1.2deg]" : "sm:-rotate-[1.2deg]";

  return (
    <div
      className={`grid items-center gap-8 sm:gap-12 lg:gap-16 ${
        flip ? "lg:grid-cols-[0.8fr_1.2fr]" : "lg:grid-cols-[1.2fr_0.8fr]"
      }`}
    >
      {/* photo */}
      <div className={`reveal relative ${flip ? "lg:order-2" : ""}`}>
        <div className={`relative rounded-3xl border-4 border-white bg-white shadow-[0_40px_90px_-35px_rgba(0,0,0,0.4)] ${tilt} transition-transform hover:rotate-0`}>
          <button
            type="button"
            onClick={() => onZoom(gallery, gi)}
            className="block w-full overflow-hidden rounded-[1.35rem]"
            aria-label={`Open photos of ${s.name}`}
          >
            <img
              src={gallery[gi]}
              alt={s.name}
              loading="lazy"
              className="aspect-[3/2] w-full bg-neutral-100 object-contain"
            />
          </button>
          <span className="absolute right-3 top-3 grid size-9 place-items-center rounded-lg bg-[#FFE600] text-neutral-900 shadow">
            <Maximize2 className="size-4" />
          </span>
          {many && (
            <>
              <button
                type="button"
                aria-label="Previous photo"
                onClick={() => setGi((p) => (p - 1 + gallery.length) % gallery.length)}
                className="absolute left-2 top-1/2 -translate-y-1/2 grid size-9 place-items-center rounded-full bg-white/90 text-neutral-900 shadow-md"
              >
                <ArrowLeft className="size-4" />
              </button>
              <button
                type="button"
                aria-label="Next photo"
                onClick={() => setGi((p) => (p + 1) % gallery.length)}
                className="absolute right-2 top-1/2 -translate-y-1/2 grid size-9 place-items-center rounded-full bg-white/90 text-neutral-900 shadow-md"
              >
                <ArrowRight className="size-4" />
              </button>
              <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5">
                {gallery.map((g, k) => (
                  <button
                    key={g}
                    type="button"
                    aria-label={`Photo ${k + 1}`}
                    onClick={() => setGi(k)}
                    className={`h-1.5 rounded-full transition-all ${k === gi ? "w-5 bg-[#FFE600]" : "w-1.5 bg-white/80"}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
        <span className="absolute -bottom-3 left-6 rounded-full bg-neutral-900 px-3 py-1 font-display text-xs uppercase tracking-widest text-white">
          {s.code}
        </span>
      </div>

      {/* text */}
      <div
        className={`reveal ${flip ? "lg:order-1" : ""}`}
        style={{ ["--reveal-delay" as string]: "0.12s" }}
      >
        <h3 className="font-display text-[clamp(1.9rem,6vw,3.25rem)] leading-[1] tracking-tight text-neutral-900">
          {s.name}
        </h3>
        <p className="mt-4 max-w-md text-[15px] leading-relaxed text-neutral-600">{s.description}</p>

        <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3">
          {metaFor(s).map(({ Icon, label }) => (
            <span key={label} className="inline-flex items-center gap-2 text-sm text-neutral-700">
              <Icon className="size-5 shrink-0 text-neutral-400" strokeWidth={1.75} />
              {label}
            </span>
          ))}
        </div>

        <div className="mt-7 flex flex-wrap items-end gap-x-8 gap-y-4">
          <div>
            <span className="font-display text-[clamp(1.9rem,4vw,2.75rem)] leading-none tracking-tight text-neutral-900">
              {s.from}
            </span>
            <span className="ml-1.5 font-display text-sm uppercase tracking-widest text-neutral-400">/ nuit</span>
            <p className="mt-1 text-xs text-neutral-400">Logement seul · taxes incluses · jusqu'à 4 personnes</p>
          </div>

          {s.specs && (
            <Sheet>
              <SheetTrigger className="inline-flex items-center gap-2 rounded-full bg-neutral-900 px-6 py-3.5 font-display text-sm uppercase tracking-widest text-white shadow-[0_14px_36px_-14px_rgba(0,0,0,0.5)] transition-transform hover:-translate-y-0.5">
                Voir la fiche complète <ArrowRight className="size-4" />
              </SheetTrigger>
              <RoomDetailsPanel s={s} onZoom={onZoom} />
            </Sheet>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */
/** One representative card per type. */
const SLEEP_CARDS = ["apartment", "bungalow"]
  .map((id) => STAYS.find((s) => s.id === id))
  .filter((s): s is (typeof STAYS)[number] => Boolean(s));

const DOORSTEP_ICON: Record<string, typeof Waves> = {
  nights: Wine,
  surf: Waves,
  beach: TreePalm,
};

const FACILITIES = [
  { Icon: Waves, label: "3 piscines" },
  { Icon: Baby, label: "Kids club" },
  { Icon: Dumbbell, label: "Terrain de sport" },
  { Icon: Wifi, label: "Wi-Fi gratuit" },
  { Icon: MapPin, label: "Parking gratuit" },
];

function JojoPage() {
  const rootRef = useReveal();
  const [box, setBox] = useState<{ images: string[]; start: number } | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const dark = !scrolled; // transparent over the hero -> white text/marks

  return (
    <div ref={rootRef} className="jojo font-sans text-neutral-800 antialiased overflow-x-hidden">
      {/* ---------------- Header ---------------- */}
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
          scrolled
            ? "border-b border-black/5 bg-white/90 shadow-sm backdrop-blur"
            : "bg-gradient-to-b from-black/45 via-black/20 to-transparent"
        }`}
      >
        {/* brand hairline */}
        <div className="h-1 w-full bg-gradient-to-r from-terra via-[#FFE600] to-terra" />
        <div className="mx-auto flex h-16 max-w-[92rem] items-center justify-between px-5 sm:h-20 sm:px-10 lg:px-16">
          <Link to="/lunja-map" className="group flex items-center gap-3">
            <LogoMark
              className="size-11 transition-transform group-hover:-rotate-6 sm:size-14"
              borderClass={scrolled ? "border-2 border-neutral-900" : "border-2 border-white/90"}
            />
            <span className="hidden flex-col gap-0.5 sm:flex">
              <Wordmark dark={dark} />
              <span
                className={`font-display text-[10px] uppercase tracking-[0.25em] ${
                  dark ? "text-white/70" : "text-neutral-400"
                }`}
              >
                Imi Ouaddar · Atlantique
              </span>
            </span>
          </Link>

          <nav
            className={`hidden items-center gap-8 font-display text-[13px] uppercase tracking-widest md:flex ${
              dark ? "text-white/85" : "text-neutral-500"
            }`}
          >
            <a href="#map" className="transition-colors hover:text-[#c9971a]">Le plan</a>
            <a href="#rooms" className="transition-colors hover:text-[#c9971a]">Dormir</a>
            <a href="#doorstep" className="transition-colors hover:text-[#c9971a]">Aux alentours</a>
          </nav>

          <a
            href="#reserver"
            className="inline-flex items-center gap-1.5 rounded-full bg-[#FFE600] px-4 py-2.5 font-display text-xs uppercase tracking-widest text-neutral-900 shadow-md transition-transform hover:-translate-y-0.5 sm:px-5 sm:text-sm"
          >
            Réserver son séjour <ArrowUpRight className="size-4" />
          </a>
        </div>
      </header>
      {/* header is fixed; the hero sits behind it, so no spacer needed */}

      {/* ---------------- Hero (ported from the classic version) ---------------- */}
      <section className="relative flex min-h-[62svh] items-center overflow-hidden grain sm:min-h-[72vh]">
        <img
          src={heroImg}
          alt="Lunja Village au coucher de soleil, Imi Ouaddar"
          width={1400}
          height={784}
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/10" />

        <div className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-12 pt-24 text-linen sm:px-6 sm:pt-28">
          {/* LineUp Vibes Events — inline on mobile, pinned top-right on desktop */}
          <a
            href="https://www.instagram.com/lineupvibesevents"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LineUp Vibes Events sur Instagram"
            className="jojo-bob group mb-5 flex w-fit flex-col items-center gap-2 rotate-[6deg] sm:absolute sm:right-4 sm:top-24 sm:mb-0 lg:right-6"
          >
            <span className="grid size-16 place-items-center rounded-full bg-[#C8E420] shadow-[0_10px_30px_-8px_rgba(0,0,0,0.5)] ring-4 ring-ink transition-transform group-hover:scale-105 sm:size-28 lg:size-32">
              <img src={lunjaMark} alt="LineUp Vibes Events" className="w-[58%]" />
            </span>
            <span className="bg-ink/70 px-2 py-0.5 font-display text-[0.6rem] uppercase tracking-widest text-linen backdrop-blur sm:text-xs">
              Exclusive for our line upers
            </span>
          </a>

          <div>
            <span className="inline-flex items-center gap-2 -rotate-2 bg-sun px-3 py-1 font-display text-xs uppercase tracking-widest text-ink ring-2 ring-ink sm:text-sm">
              <QrCode className="size-4 shrink-0" /> Vous avez scanné · bienvenue
            </span>
            <h1 className="mt-4 font-display text-[clamp(2.75rem,9vw,6.5rem)] uppercase leading-[0.82] tracking-tight sm:mt-5">
              LUNJA
              <br />
              <span className="text-sun">VILLAGE</span>
            </h1>
            <p className="ml-1 mt-1 rotate-[-2deg] font-script text-2xl text-terra sm:text-4xl">
              Imi Ouaddar · côté Atlantique
            </p>
            <p className="mt-5 max-w-xl text-sm text-linen/80 sm:mt-6 sm:text-base">
              284 bungalows et appartements posés sur 38,5 hectares de jardins, entre mer et
              montagne : trois piscines, un terrain de sport, un kids club, un restaurant et
              des lounge bars, plus un chemin privé vers la plage. Tout ce qui suit, c'est le
              vrai village, alors explorez-le avant même de défaire les valises.
            </p>
            <div className="mt-6 flex flex-col flex-wrap gap-3 sm:mt-7 sm:flex-row">
              <a
                href="#map"
                className="inline-flex items-center justify-center gap-2 bg-sun px-5 py-3 font-display text-sm uppercase tracking-wider text-ink ring-2 ring-ink transition-colors hover:bg-terra hover:text-linen sm:text-base"
              >
                <MapPin className="size-5 shrink-0" /> Explorer le plan
              </a>
              <a
                href="#rooms"
                className="inline-flex items-center justify-center gap-2 border-2 border-linen px-5 py-3 font-display text-sm uppercase tracking-wider transition-colors hover:bg-linen hover:text-ink sm:text-base"
              >
                Où dormir
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Marquee (ported from the classic version) ---------------- */}
      <div className="overflow-hidden border-y-4 border-terra bg-ink py-3 text-sun">
        <div className="flex w-max animate-marquee font-display text-2xl uppercase tracking-widest">
          {Array.from({ length: 2 }).map((_, k) => (
            <span key={k} className="flex">
              {["3 piscines", "terrain de sport", "kids club", "surf à côté", "pistes quad", "accès plage", "restaurant & bars", "38,5 ha de jardins"].map((t) => (
                <span key={t} className="px-6">
                  {t} <span className="text-terra">✦</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* ---------------- Map ---------------- */}
      <section id="map" className="scroll-mt-20 px-3 py-14 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-[110rem]">
          <div className="reveal mx-auto mb-6 max-w-6xl px-1 sm:mb-8">
            <span className="font-script text-2xl text-terra sm:text-3xl">À découvrir</span>
            <h2 className="font-display text-[clamp(2.25rem,8vw,5.5rem)] uppercase leading-[0.85] tracking-tight text-neutral-900">
              Le village, <span className="italic text-terra">point par point</span>
            </h2>
            <p className="mt-3 max-w-xl text-sm text-neutral-500 sm:text-base">
              Zoomez, glissez, touchez les numéros. Chaque point est un vrai lieu du plan de
              Lunja, de l'accueil au chemin de la plage.
            </p>
          </div>
          <div className="reveal">
            <LunjaMap light heightClass="!h-[52vh] sm:!h-[72vh]" />
          </div>
        </div>
      </section>

      {/* ---------------- Où réserver ---------------- */}
      <section id="reserver" className="scroll-mt-20 px-3 pb-14 sm:px-6 sm:pb-20">
        <div className="mx-auto max-w-6xl">
          <div className="reveal relative overflow-hidden rounded-3xl border-2 border-neutral-900 bg-[#FFF7D6] shadow-[0_30px_70px_-40px_rgba(0,0,0,0.4)]">
            <LogoMark className="jojo-bob pointer-events-none absolute -right-6 -top-6 size-28 rotate-[8deg] opacity-90 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.35)] sm:-right-8 sm:-top-8 sm:size-44" />
            <div className="relative p-7 sm:p-12">
              <div className="flex items-center gap-4">
                <span className="grid size-14 shrink-0 place-items-center rounded-full bg-neutral-900 font-display text-2xl text-[#FFE600] ring-4 ring-white sm:size-16">
                  1
                </span>
                <span className="font-display text-xs uppercase tracking-[0.22em] text-neutral-600 sm:text-sm">
                  Envie de rester ?
                </span>
              </div>

              <h3 className="mt-5 font-display text-[clamp(2.5rem,8vw,5rem)] uppercase leading-[0.9] tracking-tight text-neutral-900">
                On réserve à l'Accueil
              </h3>

              <p className="mt-6 w-full text-[15px] leading-relaxed text-neutral-800 sm:text-lg">
                Pendant que vous explorez : si un bungalow ou un appartement vous fait de l'œil,
                direction le point <strong>2 · Accueil / Réservation</strong>, juste après le
                portail. C'est là qu'on cale les dates, les tarifs et l'occupation, en personne,
                sans détour. La réception est ouverte 24h/24.
              </p>
              <p className="mt-3 w-full text-[15px] leading-relaxed text-neutral-700 sm:text-lg">
                Plutôt l'ambiance chill&nbsp;? Le <strong>CHILLOUT</strong>  (point 7), mixé par le collectif <strong>Lineup</strong>, vous oriente aussi
                vers l'Accueil pour transformer la nuit en séjour.
              </p>

              <a
                href="https://www.instagram.com/lineupvibesevents"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LineUp Vibes Events sur Instagram"
                className="group mt-5 inline-flex items-center gap-3 rounded-full border-2 border-neutral-900 bg-white py-1.5 pl-1.5 pr-4 transition-transform hover:-translate-y-0.5"
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#C8E420] ring-2 ring-neutral-900">
                  <img src={lunjaMark} alt="LineUp Vibes Events" className="w-[58%]" />
                </span>
                <span className="font-display text-xs uppercase tracking-[0.18em] text-neutral-800">
                  Mixé par LineUp Vibes Events
                </span>
                <Instagram className="size-4 text-neutral-500 transition-colors group-hover:text-neutral-900" />
              </a>

              <div className="mt-7">
                <a
                  href="#map"
                  className="inline-flex items-center gap-2 rounded-full bg-neutral-900 px-6 py-3 font-display text-sm uppercase tracking-widest text-white transition-transform hover:-translate-y-0.5"
                >
                  <MapPin className="size-4" /> Voir l'Accueil sur le plan
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Rooms ---------------- */}
      <section id="rooms" className="scroll-mt-20 py-16 sm:py-24">
        <div className="mx-auto max-w-[92rem] px-5 sm:px-10 lg:px-16">
          <div className="reveal grid gap-6 md:grid-cols-[1.1fr_0.9fr] md:items-end md:gap-16">
            <div>
              <Kicker>Dormir ici</Kicker>
              <SectionTitle className="mt-4">Où dormir</SectionTitle>
            </div>
            <p className="text-[15px] leading-relaxed text-neutral-600 sm:text-base">
              Vraies photos et vrais détails ALL / Accor. Pour réserver : rendez-vous à
              l'Accueil (point 2), où l'on cale tarifs et disponibilités sur place.
            </p>
          </div>

          <div className="mt-12 space-y-16 sm:mt-16 sm:space-y-24">
            {SLEEP_CARDS.map((s, i) => (
              <RoomBlock
                key={s.id}
                s={s}
                flip={i % 2 === 1}
                onZoom={(images, start) => setBox({ images, start })}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Doorstep ---------------- */}
      <section id="doorstep" className="scroll-mt-20 bg-neutral-50 py-16 sm:py-24">
        <div className="mx-auto max-w-[92rem] px-5 sm:px-10 lg:px-16">
          <div className="reveal">
            <Kicker>Les journées ici</Kicker>
            <SectionTitle className="mt-4">Juste devant la porte</SectionTitle>
          </div>
          <div className="mt-10 grid gap-5 sm:mt-14 sm:grid-cols-2 sm:gap-6 md:grid-cols-3">
            {EXPERIENCES.map((e, k) => {
              const Icon = DOORSTEP_ICON[e.id] ?? Waves;
              return (
                <article
                  key={e.id}
                  className="reveal group overflow-hidden rounded-3xl border border-black/5 bg-white shadow-[0_25px_60px_-35px_rgba(0,0,0,0.35)]"
                  style={{ ["--reveal-delay" as string]: `${k * 0.08}s` }}
                >
                  <div className="overflow-hidden">
                    <img
                      src={e.img}
                      alt={e.title}
                      loading="lazy"
                      className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6 sm:p-7">
                    <div className="flex items-center gap-2">
                      <Icon className="size-5 text-neutral-400" strokeWidth={1.75} />
                      <h3 className="font-display text-2xl tracking-tight text-neutral-900">{e.title}</h3>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-neutral-600">{e.line}</p>
                  </div>
                </article>
              );
            })}
          </div>

          {/* For every stay - circular badges */}
          <div className="mt-16 grid items-center gap-6 sm:mt-20 sm:gap-10 md:grid-cols-[auto_1fr]">
            <h3 className="reveal font-display text-[clamp(1.9rem,7vw,3.25rem)] leading-[1] tracking-tight text-neutral-900">
              Pour chaque séjour…
            </h3>
            <div className="flex flex-wrap justify-center gap-3 sm:justify-between sm:gap-4">
              {FACILITIES.map(({ Icon, label }, k) => (
                <div
                  key={label}
                  className="reveal grid size-24 place-items-center rounded-full bg-white text-center shadow-[0_15px_40px_-25px_rgba(0,0,0,0.4)] sm:size-32"
                  style={{ ["--reveal-delay" as string]: `${k * 0.06}s` }}
                >
                  <div>
                    <Icon className="mx-auto size-5 text-neutral-500 sm:size-6" strokeWidth={1.5} />
                    <div className="mt-1 px-1.5 text-[10px] font-semibold uppercase leading-tight tracking-wide text-neutral-600 sm:px-2 sm:text-[11px]">
                      {label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- CTA ---------------- */}
      <section className="bg-white">
        <div className="mx-auto max-w-[92rem] px-5 py-20 text-center sm:px-10 sm:py-28 lg:px-16">
          <div className="flex items-center justify-center gap-4 sm:gap-6">
            <LogoMark className="jojo-bob size-14 shrink-0 border-[3px] shadow-[0_16px_40px_-14px_rgba(0,0,0,0.35)] sm:size-24" />
            <h2 className="text-left font-display text-[clamp(2.2rem,8vw,5rem)] leading-[0.95] tracking-tight text-neutral-900">
              Prêts quand
              <br className="hidden sm:block" /> vous l'êtes
            </h2>
          </div>
          <p className="mx-auto mt-4 max-w-md text-[15px] text-neutral-500 sm:text-base">
            Tout le village est là-haut. Pour le reste, et pour réserver, on s'occupe de vous
            à l'Accueil, à l'arrivée.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap">
            <Pill href="#reserver" className="justify-center bg-[#FFE600] text-neutral-900 shadow-lg">
              Où réserver <ArrowUpRight className="size-5" />
            </Pill>
            <Pill
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="justify-center border-2 border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white"
            >
              <Instagram className="size-5" /> @lunjavillage.officiel
            </Pill>
          </div>
        </div>
      </section>

      {/* ---------------- Footer ---------------- */}
      <footer className="relative bg-[#333] text-white">
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FFE600] px-4 py-2 font-display text-xs uppercase tracking-widest text-neutral-900 shadow-lg"
        >
          ↑ Haut
        </button>
        <div className="mx-auto grid max-w-[92rem] gap-10 px-5 py-16 sm:grid-cols-2 sm:px-10 lg:grid-cols-4 lg:px-16">
          <div>
            <div className="flex items-center gap-4">
              <LogoMark className="size-16 sm:size-20" borderClass="border-2 border-white/80" />
              <span className="flex flex-col gap-1">
                <Wordmark dark />
                <span className="font-display text-[10px] uppercase tracking-[0.25em] text-white/60">
                  Imi Ouaddar · Atlantique
                </span>
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm text-white/70">
              Le village vibe de la côte atlantique, depuis Imi Ouaddar, avec amour.
            </p>
          </div>
          <div>
            <h4 className="font-display text-lg tracking-tight">Nous trouver</h4>
            <p className="mt-3 text-sm text-white/70">
              Lunja Village, Imi Ouaddar,
              <br /> Agadir, Maroc
            </p>
            <p className="mt-2 flex items-center gap-1.5 text-sm text-white/70">
              <Phone size={14} /> {WHATSAPP}
            </p>
            <p className="mt-2 text-sm text-white/70">Ouvert 7j/7 · réception 24h/24</p>
          </div>
          <div>
            <h4 className="font-display text-lg tracking-tight">Suivre</h4>
            <div className="mt-3 flex flex-col gap-2 text-sm">
              <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-white/70 hover:text-white">
                <Instagram size={15} /> @lunjavillage.officiel
              </a>
            </div>
          </div>
          <div className="flex flex-col items-start gap-3">
            <span className="rounded-full bg-white/10 px-3 py-1 font-display text-xs uppercase tracking-widest">
              Soft launch
            </span>
            <p className="text-sm text-white/60">
              Le site complet arrive bientôt. Cette page, c'est le plan du village et les hébergements.
            </p>
          </div>
        </div>
        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-[92rem] flex-wrap items-center justify-between gap-2 px-5 py-4 text-xs uppercase tracking-widest text-white/60 sm:px-10 lg:px-16">
            <span>© {new Date().getFullYear()} Lunja Village · Imi Ouaddar · Développé par EIDEN GROUP</span>
            <span>Membre ALL</span>
          </div>
        </div>
      </footer>

      {box && <Lightbox images={box.images} start={box.start} onClose={() => setBox(null)} />}
    </div>
  );
}
