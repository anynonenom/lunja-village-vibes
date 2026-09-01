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
import { ACCOR_URL, EXPERIENCES, INSTAGRAM_URL, STAYS, type Stay, type StayGroup } from "@/data/lunja";
import heroImg from "@/assets/real-lunja-aerial.jpg";
import lunjaLogo from "@/assets/lunja-logo.png";

function LogoMark({ className = "size-10" }: { className?: string }) {
  return (
    <span
      className={`grid shrink-0 place-items-center overflow-hidden rounded-full border-2 border-neutral-900 bg-[#FFE600] ${className}`}
    >
      <img src={lunjaLogo} alt="Lunja Village" className="h-full w-full object-contain" />
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
  const view = s.specs?.find((g) => g.group === "View")?.items[0];
  return [
    { Icon: Users, label: s.sleeps },
    view
      ? { Icon: Waves, label: view }
      : { Icon: BedDouble, label: s.bedding?.[0] ?? "2 bedrooms" },
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
          <img src={gallery[0]} alt={s.name} className="aspect-[4/3] w-full object-cover" />
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

        <a
          href={ACCOR_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#FFE600] px-5 py-2.5 font-display tracking-wide text-neutral-900"
        >
          Check rates <ArrowUpRight className="size-4" />
        </a>
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
    <div className="grid items-center gap-8 sm:gap-12 lg:grid-cols-[1.25fr_0.75fr] lg:gap-16">
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
              className="aspect-[4/3] w-full object-cover sm:aspect-[16/10]"
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

        <div className="mt-7 flex flex-wrap items-center gap-4">
          <Pill
            href={ACCOR_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#FFE600] text-neutral-900 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.35)]"
          >
            Check rates <ArrowUpRight className="size-5" />
          </Pill>

          {s.specs && (
            <Sheet>
              <SheetTrigger className="inline-flex items-center gap-2 font-display text-sm uppercase tracking-widest text-neutral-500 transition-colors hover:text-neutral-900">
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
const STAY_TABS: Array<"All" | StayGroup> = ["All", "Apartments", "Bungalows"];

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
  const [stayTab, setStayTab] = useState<"All" | StayGroup>("All");
  const [box, setBox] = useState<{ images: string[]; start: number } | null>(null);

  const stays = STAYS.filter((s) => stayTab === "All" || s.group === stayTab);

  return (
    <div ref={rootRef} className="jojo font-sans text-neutral-800 antialiased overflow-x-hidden">
      {/* ---------------- Header ---------------- */}
      <header className="sticky top-0 z-40 border-b border-black/5 bg-white/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[92rem] items-center justify-between px-5 sm:px-10 lg:px-16">
          <Link to="/map-lunja-2" className="flex items-center gap-2.5">
            <LogoMark className="size-10" />
            <span className="font-display text-xl tracking-tight text-neutral-900">Lunja Village</span>
          </Link>
          <nav className="hidden items-center gap-7 font-display text-[15px] tracking-wide text-neutral-600 sm:flex">
            <a href="#map" className="hover:text-neutral-900">The map</a>
            <a href="#rooms" className="hover:text-neutral-900">Sleep</a>
            <a href="#doorstep" className="hover:text-neutral-900">Doorstep</a>
          </nav>
          <a
            href={ACCOR_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-neutral-900 px-4 py-2 font-display text-sm tracking-wide text-white hover:bg-neutral-700"
          >
            Book
          </a>
        </div>
      </header>

      {/* ---------------- Hero (ported from the classic version) ---------------- */}
      <section className="relative flex min-h-[62svh] items-center overflow-hidden grain sm:min-h-[72vh]">
        <img
          src={heroImg}
          alt="Lunja Village at sunset, Imi Ouaddar"
          width={1200}
          height={900}
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

      {/* ---------------- Intro ---------------- */}
      <section className="mx-auto max-w-[92rem] px-5 py-16 sm:px-10 sm:py-24 lg:px-16">
        <div className="reveal grid gap-6 md:grid-cols-[1.1fr_0.9fr] md:items-end md:gap-16">
          <div>
            <Kicker>The village</Kicker>
            <SectionTitle className="mt-4">To each their own corner</SectionTitle>
          </div>
          <p className="text-[15px] leading-relaxed text-neutral-600 sm:text-base">
            Family week, a trip with friends, a solo surf escape — every stay at Lunja Village sits
            inside one gated village between the mountain and the sea. Everything below is the real
            place: explore it before you unpack.
          </p>
        </div>

        <div className="jojo-dots mt-12 grid gap-10 text-left sm:mt-16 md:grid-cols-3 md:gap-16">
          {[
            { Icon: MapPin, t: "Explore it pin by pin", d: "Every number on the map is a real spot on the Lunja site plan, from reception to the beach path." },
            { Icon: BedDouble, t: "Five ways to sleep", d: "Two apartment types and three bungalow types, all 75 m² and two bedrooms, all inside the gates." },
            { Icon: Waves, t: "Surf, sand & sunsets", d: "A private path to the Atlantic, the Taghazout points minutes north, and bars for when the sun drops." },
          ].map(({ Icon, t, d }, k) => (
            <div key={t} className="reveal" style={{ ["--reveal-delay" as string]: `${k * 0.09}s` }}>
              <Icon className="size-8 text-neutral-900 sm:size-9" strokeWidth={1.5} />
              <h3 className="mt-3 font-display text-xl tracking-tight text-neutral-900 sm:mt-4 sm:text-2xl">{t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- Map (classic version design) ---------------- */}
      <section id="map" className="scroll-mt-20 px-4 py-14 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="reveal mb-6 sm:mb-8">
            <span className="font-script text-2xl text-terra sm:text-3xl">Discover</span>
            <h2 className="font-display text-[clamp(2.25rem,8vw,5.5rem)] uppercase leading-[0.85] tracking-tight">
              The village, <span className="italic text-terra">pin by pin</span>
            </h2>
            <p className="mt-3 max-w-xl text-sm text-ink/70 sm:text-base">
              Zoom, drag and tap the numbers. Every pin is a real spot on the Lunja site plan,
              from reception to the beach path.
            </p>
          </div>
          <div className="reveal">
            <LunjaMap />
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

          <div className="reveal mt-8 flex flex-wrap gap-6 border-b border-black/10 pb-3 sm:mt-10">
            {STAY_TABS.map((t) => {
              const on = stayTab === t;
              const count = t === "All" ? STAYS.length : STAYS.filter((s) => s.group === t).length;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setStayTab(t)}
                  className={`relative pb-3 font-display text-lg tracking-wide transition-colors ${
                    on ? "text-neutral-900" : "text-neutral-400 hover:text-neutral-700"
                  }`}
                >
                  {t === "All" ? "All" : t} <span className="text-sm text-neutral-400">{count}</span>
                  {on && <span className="absolute inset-x-0 -bottom-[13px] h-1 rounded-full bg-[#FFE600]" />}
                </button>
              );
            })}
          </div>

          <div className="mt-12 space-y-16 sm:mt-16 sm:space-y-24">
            {stays.map((s, i) => (
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

      {/* ---------------- CTA (dark panel) ---------------- */}
      <section className="bg-neutral-900 text-white">
        <div className="mx-auto max-w-[92rem] px-5 py-20 text-center sm:px-10 sm:py-28 lg:px-16">
          <LogoMark className="jojo-bob mx-auto size-16 border-[3px] border-white shadow-[0_16px_40px_-12px_rgba(0,0,0,0.6)] sm:size-20" />
          <h2 className="mt-6 font-display text-[clamp(2.2rem,8vw,5rem)] leading-[1.02] tracking-tight">
            Ready when you are
          </h2>
          <p className="mx-auto mt-4 max-w-md text-[15px] text-white/70 sm:text-base">
            Rooms, dates and prices live on ALL.com. Everything else, we will sort when you arrive.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap">
            <Pill
              href={ACCOR_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="justify-center bg-[#FFE600] text-neutral-900 shadow-lg"
            >
              Check rates on ALL.com <ArrowUpRight className="size-5" />
            </Pill>
            <Pill
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="justify-center border-2 border-white text-white hover:bg-white hover:text-neutral-900"
            >
              <Instagram className="size-5" /> @lunjavillage.officiel
            </Pill>
          </div>
        </div>
      </section>

      {/* ---------------- Footer ---------------- */}
      <footer className="relative border-t border-white/10 bg-neutral-900 text-white">
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
              <a href={ACCOR_URL} target="_blank" rel="noreferrer" className="text-white/70 hover:text-white">
                Book on ALL.com →
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

      <Link
        to="/map-lunja"
        className="fixed bottom-4 right-4 z-40 inline-flex items-center gap-1.5 rounded-full bg-neutral-900 px-4 py-2 font-display text-xs uppercase tracking-widest text-white shadow-lg hover:bg-neutral-700"
      >
        Try the bold look →
      </Link>

      {box && <Lightbox images={box.images} start={box.start} onClose={() => setBox(null)} />}
    </div>
  );
}
