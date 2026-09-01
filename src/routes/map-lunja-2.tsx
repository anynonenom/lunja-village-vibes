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
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { WHATSAPP } from "@/components/chrome";
import { EXPERIENCES, INSTAGRAM_URL, STAYS, type Stay } from "@/data/lunja";

const WA_LINK = `https://wa.me/${WHATSAPP.replace(/\D/g, "")}`;
import heroImg from "@/assets/real-lunja-aerial.jpg";
import lunjaLogo from "@/assets/lunja-logo.png";

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

export const Route = createFileRoute("/map-lunja-2")({
  head: () => ({
    meta: [
      { title: "Lunja Village Imi Ouaddar · Village map, apartments & bungalows" },
      {
        name: "description",
        content:
          "The whole of Lunja Village, Imi Ouaddar: an interactive site map, five apartment and bungalow types with real photos and specs, plus the surf, bars and beach on the doorstep.",
      },
      { property: "og:title", content: "Lunja Village · Explore the whole village" },
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
  const view = s.specs?.find((g) => g.group.startsWith("View"))?.items[0];
  return [
    { Icon: Users, label: s.sleeps },
    view
      ? { Icon: Waves, label: view }
      : { Icon: BedDouble, label: s.bedding?.[0] ?? s.size },
    { Icon: UtensilsCrossed, label: "Equipped kitchen" },
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
              <p className="font-display text-xs uppercase tracking-widest text-neutral-500">Bedding</p>
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

        <div className="mt-6 flex items-end justify-between gap-3 border-t border-black/10 pt-4">
          <div>
            <span className="font-display text-2xl leading-none tracking-tight text-neutral-900">{s.from}</span>
            <span className="ml-1 font-display text-xs uppercase tracking-widest text-neutral-400">/ night</span>
            <p className="mt-1 text-[11px] text-neutral-400">Room only · taxes incl. · up to 4</p>
          </div>
          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[#FFE600] px-5 py-2.5 font-display text-sm uppercase tracking-widest text-neutral-900"
          >
            Enquire <ArrowUpRight className="size-4" />
          </a>
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
            <span className="ml-1.5 font-display text-sm uppercase tracking-widest text-neutral-400">/ night</span>
            <p className="mt-1 text-xs text-neutral-400">Room only · taxes included · up to 4 guests</p>
          </div>

          {s.specs && (
            <Sheet>
              <SheetTrigger className="inline-flex items-center gap-2 rounded-full bg-neutral-900 px-6 py-3.5 font-display text-sm uppercase tracking-widest text-white shadow-[0_14px_36px_-14px_rgba(0,0,0,0.5)] transition-transform hover:-translate-y-0.5">
                Full room details <ArrowRight className="size-4" />
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
  { Icon: Waves, label: "3 pools" },
  { Icon: Baby, label: "Kids club" },
  { Icon: Dumbbell, label: "Sports ground" },
  { Icon: Wifi, label: "Free Wi-Fi" },
  { Icon: MapPin, label: "Free parking" },
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
          <Link to="/map-lunja-2" className="group flex items-center gap-3">
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
                Imi Ouaddar · Atlantic
              </span>
            </span>
          </Link>

          <nav
            className={`hidden items-center gap-8 font-display text-[13px] uppercase tracking-widest md:flex ${
              dark ? "text-white/85" : "text-neutral-500"
            }`}
          >
            <a href="#map" className="transition-colors hover:text-[#c9971a]">The map</a>
            <a href="#rooms" className="transition-colors hover:text-[#c9971a]">Sleep</a>
            <a href="#doorstep" className="transition-colors hover:text-[#c9971a]">Doorstep</a>
          </nav>

          <a
            href="#rooms"
            className="inline-flex items-center gap-1.5 rounded-full bg-[#FFE600] px-4 py-2.5 font-display text-xs uppercase tracking-widest text-neutral-900 shadow-md transition-transform hover:-translate-y-0.5 sm:px-5 sm:text-sm"
          >
            Book your stay <ArrowUpRight className="size-4" />
          </a>
        </div>
      </header>
      {/* header is fixed; the hero sits behind it, so no spacer needed */}

      {/* ---------------- Hero (ported from the classic version) ---------------- */}
      <section className="relative flex min-h-[62svh] items-center overflow-hidden grain sm:min-h-[72vh]">
        <img
          src={heroImg}
          alt="Lunja Village at sunset, Imi Ouaddar"
          width={1400}
          height={784}
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/10" />
        <div className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-12 pt-24 text-linen sm:px-6 sm:pt-28">
          <div>
            <span className="inline-flex items-center gap-2 -rotate-2 bg-sun px-3 py-1 font-display text-xs uppercase tracking-widest text-ink ring-2 ring-ink sm:text-sm">
              <QrCode className="size-4 shrink-0" /> You scanned it · welcome
            </span>
            <h1 className="mt-4 font-display text-[clamp(2.75rem,9vw,6.5rem)] uppercase leading-[0.82] tracking-tight sm:mt-5">
              LUNJA
              <br />
              <span className="text-sun">VILLAGE</span>
            </h1>
            <p className="ml-1 mt-1 rotate-[-2deg] font-script text-2xl text-terra sm:text-4xl">
              Imi Ouaddar · Atlantic side
            </p>
            <p className="mt-5 max-w-xl text-sm text-linen/80 sm:mt-6 sm:text-base">
              284 bungalows and apartments scattered through 38.5 hectares of gardens between
              sea and mountain: three pools, a sports ground, a kids club, a restaurant and
              lounge bars, plus a private path to the beach. Everything below is the real
              village, so explore it before you even unpack.
            </p>
            <div className="mt-6 flex flex-col flex-wrap gap-3 sm:mt-7 sm:flex-row">
              <a
                href="#map"
                className="inline-flex items-center justify-center gap-2 bg-sun px-5 py-3 font-display text-sm uppercase tracking-wider text-ink ring-2 ring-ink transition-colors hover:bg-terra hover:text-linen sm:text-base"
              >
                <MapPin className="size-5 shrink-0" /> Explore the map
              </a>
              <a
                href="#rooms"
                className="inline-flex items-center justify-center gap-2 border-2 border-linen px-5 py-3 font-display text-sm uppercase tracking-wider transition-colors hover:bg-linen hover:text-ink sm:text-base"
              >
                Where to sleep
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
              {["3 pools", "sports ground", "kids club", "surf nearby", "quad trails", "beach access", "restaurant & bars", "38.5 ha of gardens"].map((t) => (
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
            <span className="font-script text-2xl text-terra sm:text-3xl">Discover</span>
            <h2 className="font-display text-[clamp(2.25rem,8vw,5.5rem)] uppercase leading-[0.85] tracking-tight text-neutral-900">
              The village, <span className="italic text-terra">pin by pin</span>
            </h2>
            <p className="mt-3 max-w-xl text-sm text-neutral-500 sm:text-base">
              Zoom, drag and tap the numbers. Every pin is a real spot on the Lunja site plan,
              from reception to the beach path.
            </p>
          </div>
          <div className="reveal">
            <LunjaMap light heightClass="!h-[52vh] sm:!h-[72vh]" />
          </div>
        </div>
      </section>

      {/* ---------------- Rooms ---------------- */}
      <section id="rooms" className="scroll-mt-20 py-16 sm:py-24">
        <div className="mx-auto max-w-[92rem] px-5 sm:px-10 lg:px-16">
          <div className="reveal grid gap-6 md:grid-cols-[1.1fr_0.9fr] md:items-end md:gap-16">
            <div>
              <Kicker>Sleep here</Kicker>
              <SectionTitle className="mt-4">Where to sleep</SectionTitle>
            </div>
            <p className="text-[15px] leading-relaxed text-neutral-600 sm:text-base">
              Real ALL / Accor photos and specs. Live rates and availability are on the official
              booking page.
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
            <Kicker>Days here</Kicker>
            <SectionTitle className="mt-4">On the doorstep</SectionTitle>
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

          {/* For every stay — circular badges */}
          <div className="mt-16 grid items-center gap-6 sm:mt-20 sm:gap-10 md:grid-cols-[auto_1fr]">
            <h3 className="reveal font-display text-[clamp(1.9rem,7vw,3.25rem)] leading-[1] tracking-tight text-neutral-900">
              For every stay…
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
          <LogoMark className="jojo-bob mx-auto size-16 border-[3px] shadow-[0_16px_40px_-14px_rgba(0,0,0,0.35)] sm:size-20" />
          <h2 className="mt-6 font-display text-[clamp(2.2rem,8vw,5rem)] leading-[1.02] tracking-tight text-neutral-900">
            Ready when you are
          </h2>
          <p className="mx-auto mt-4 max-w-md text-[15px] text-neutral-500 sm:text-base">
            Send us your dates on WhatsApp and we will hold your room. Everything else, we sort
            when you arrive.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap">
            <Pill
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="justify-center bg-[#FFE600] text-neutral-900 shadow-lg"
            >
              Enquire on WhatsApp <ArrowUpRight className="size-5" />
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
          ↑ Top
        </button>
        <div className="mx-auto grid max-w-[92rem] gap-10 px-5 py-16 sm:grid-cols-2 sm:px-10 lg:grid-cols-4 lg:px-16">
          <div>
            <div className="flex items-center gap-2.5">
              <LogoMark className="size-10" />
              <span className="font-display text-xl tracking-tight">Lunja Village</span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-white/70">
              Vibe village on the Atlantic coast, depuis Imi Ouaddar, avec amour.
            </p>
          </div>
          <div>
            <h4 className="font-display text-lg tracking-tight">Find us</h4>
            <p className="mt-3 text-sm text-white/70">
              Lunja Village, Imi Ouaddar,
              <br /> Agadir, Maroc
            </p>
            <p className="mt-2 flex items-center gap-1.5 text-sm text-white/70">
              <Phone size={14} /> {WHATSAPP}
            </p>
            <p className="mt-2 text-sm text-white/70">Open 7/7 · 24h reception</p>
          </div>
          <div>
            <h4 className="font-display text-lg tracking-tight">Follow</h4>
            <div className="mt-3 flex flex-col gap-2 text-sm">
              <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-white/70 hover:text-white">
                <Instagram size={15} /> @lunjavillage.officiel
              </a>
              <a href={WA_LINK} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-white/70 hover:text-white">
                <Phone size={14} /> Message us on WhatsApp
              </a>
            </div>
          </div>
          <div className="flex flex-col items-start gap-3">
            <span className="rounded-full bg-white/10 px-3 py-1 font-display text-xs uppercase tracking-widest">
              Soft launch
            </span>
            <p className="text-sm text-white/60">
              Full site coming soon. This page is the village map and stays.
            </p>
          </div>
        </div>
        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-[92rem] flex-wrap items-center justify-between gap-2 px-5 py-4 text-xs uppercase tracking-widest text-white/60 sm:px-10 lg:px-16">
            <span>© {new Date().getFullYear()} Lunja Village · Imi Ouaddar · Developed by EIDEN GROUP</span>
            <span>Member of ALL</span>
          </div>
        </div>
      </footer>

      {box && <Lightbox images={box.images} start={box.start} onClose={() => setBox(null)} />}
    </div>
  );
}
