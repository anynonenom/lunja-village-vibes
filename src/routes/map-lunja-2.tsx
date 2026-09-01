import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Instagram,
  MapPin,
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
import { WHATSAPP } from "@/components/chrome";
import { ACCOR_URL, EXPERIENCES, INSTAGRAM_URL, STAYS, type Stay, type StayGroup } from "@/data/lunja";
import heroImg from "@/assets/real-lunja-aerial.jpg";

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
        "font-display text-[clamp(2.4rem,6vw,4.5rem)] leading-[0.95] tracking-tight text-neutral-900 " +
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
    <div className="fixed inset-0 z-[100] grid place-items-center bg-neutral-900/90 p-4" onClick={onClose}>
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute right-4 top-4 grid size-11 place-items-center rounded-full bg-[#FFE600] text-neutral-900"
      >
        <X className="size-5" />
      </button>
      <figure className="relative max-h-[86vh] max-w-5xl" onClick={(e) => e.stopPropagation()}>
        <img src={images[i]} alt="" className="max-h-[86vh] w-auto rounded-2xl object-contain" />
        {n > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous"
              onClick={() => go(-1)}
              className="absolute left-2 top-1/2 -translate-y-1/2 grid size-11 place-items-center rounded-full bg-white/90 text-neutral-900 shadow-lg"
            >
              <ArrowLeft className="size-5" />
            </button>
            <button
              type="button"
              aria-label="Next"
              onClick={() => go(1)}
              className="absolute right-2 top-1/2 -translate-y-1/2 grid size-11 place-items-center rounded-full bg-white/90 text-neutral-900 shadow-lg"
            >
              <ArrowRight className="size-5" />
            </button>
            <figcaption className="absolute inset-x-0 -bottom-9 text-center font-display text-sm tracking-widest text-white/80">
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
    <div className="reveal grid items-center gap-8 sm:gap-14 lg:grid-cols-2">
      {/* photo */}
      <div className={`relative ${flip ? "lg:order-2" : ""}`}>
        <div className={`relative rounded-3xl border-4 border-white bg-white shadow-[0_30px_70px_-30px_rgba(0,0,0,0.35)] ${tilt} transition-transform hover:rotate-0`}>
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
              className="aspect-[4/3] w-full object-cover"
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
      <div className={flip ? "lg:order-1" : ""}>
        <h3 className="font-display text-[clamp(2rem,4.5vw,3.25rem)] leading-[0.95] tracking-tight text-neutral-900">
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

        {s.specs && (
          <details className="group mt-5">
            <summary className="cursor-pointer list-none font-display text-sm uppercase tracking-widest text-neutral-500 hover:text-neutral-900">
              <span className="group-open:hidden">Full room details +</span>
              <span className="hidden group-open:inline">Hide details −</span>
            </summary>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {s.specs.map((grp) => (
                <div key={grp.group} className="rounded-2xl bg-neutral-50 p-3">
                  <p className="font-display text-xs uppercase tracking-widest text-neutral-500">{grp.group}</p>
                  <ul className="mt-1 space-y-0.5 text-[13px] text-neutral-600">
                    {grp.items.map((it) => (
                      <li key={it}>{it}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </details>
        )}

        <Pill
          href={ACCOR_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-7 bg-[#FFE600] text-neutral-900 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.35)]"
        >
          Check rates <ArrowUpRight className="size-5" />
        </Pill>
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
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link to="/map-lunja-2" className="flex items-center gap-2.5">
            <span className="grid size-10 place-items-center rounded-full bg-[#FFE600] font-display text-lg leading-none text-neutral-900">
              LV
            </span>
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

      {/* ---------------- Hero ---------------- */}
      <section className="relative">
        <img src={heroImg} alt="Lunja Village at sunset, Imi Ouaddar" className="h-[62vh] min-h-[420px] w-full object-cover sm:h-[74vh]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto max-w-6xl px-4 pb-10 sm:px-6 sm:pb-14">
            <h1 className="font-display text-[clamp(2.5rem,8vw,6rem)] leading-[1.5] tracking-tight text-white">
              <span className="jojo-highlight box-decoration-clone">Come and stay</span>
              <br />
              <span className="jojo-highlight box-decoration-clone">in the village.</span>
            </h1>
            <p className="mt-5 max-w-lg text-[15px] text-white/90 sm:text-base">
              Scanned the code? Here is the whole of Lunja Village, Imi Ouaddar — the interactive
              map, five ways to sleep, and the surf, bars and beach on the doorstep.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Pill href="#map" className="bg-[#FFE600] text-neutral-900 shadow-lg">
                <MapPin className="size-5" /> Explore the map
              </Pill>
              <Pill href="#rooms" className="border-2 border-white text-white hover:bg-white hover:text-neutral-900">
                Where to sleep
              </Pill>
              <span className="jojo-bob ml-1 hidden select-none text-3xl sm:inline">👆</span>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Stats strip ---------------- */}
      <section className="border-b border-black/5 bg-white">
        <div className="mx-auto grid max-w-6xl grid-cols-2 divide-x divide-black/5 px-4 sm:grid-cols-4 sm:px-6">
          {[
            ["284", "apartments & bungalows"],
            ["38.5", "hectares of gardens"],
            ["3", "swimming pools"],
            ["5 min", "to the Atlantic"],
          ].map(([n, l], k) => (
            <div key={l} className={`reveal py-7 text-center ${k >= 2 ? "border-t border-black/5 sm:border-t-0" : ""}`}>
              <div className="font-display text-4xl tracking-tight text-neutral-900 sm:text-5xl">{n}</div>
              <div className="mt-1 text-xs uppercase tracking-widest text-neutral-500">{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- Intro ---------------- */}
      <section className="mx-auto max-w-6xl px-4 py-20 text-center sm:px-6 sm:py-28">
        <div className="reveal mx-auto max-w-2xl">
          <Kicker>The village</Kicker>
          <SectionTitle className="mt-4">To each their own corner</SectionTitle>
          <p className="mt-4 text-[15px] leading-relaxed text-neutral-600">
            Family week, a trip with friends, a solo surf escape — every stay at Lunja Village sits
            inside one gated village between the mountain and the sea. Everything below is the real
            place: explore it before you unpack.
          </p>
        </div>

        <div className="jojo-dots mt-14 grid gap-12 text-left md:grid-cols-3 md:gap-10">
          {[
            { Icon: MapPin, t: "Explore it pin by pin", d: "Every number on the map is a real spot on the Lunja site plan, from reception to the beach path." },
            { Icon: BedDouble, t: "Five ways to sleep", d: "Two apartment types and three bungalow types, all 75 m² and two bedrooms, all inside the gates." },
            { Icon: Waves, t: "Surf, sand & sunsets", d: "A private path to the Atlantic, the Taghazout points minutes north, and bars for when the sun drops." },
          ].map(({ Icon, t, d }) => (
            <div key={t} className="reveal">
              <Icon className="size-9 text-neutral-900" strokeWidth={1.5} />
              <h3 className="mt-4 font-display text-2xl tracking-tight text-neutral-900">{t}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-neutral-600">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- Map ---------------- */}
      <section id="map" className="scroll-mt-20 bg-neutral-50 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="reveal mb-8 text-center">
            <Kicker>Discover</Kicker>
            <SectionTitle className="mt-4">
              The village, <span className="text-[#caa500]">pin by pin</span>
            </SectionTitle>
            <p className="mx-auto mt-3 max-w-md text-[15px] text-neutral-600">
              Zoom, drag and tap the numbers. Filter by what you are looking for.
            </p>
          </div>
          <div className="reveal">
            <LunjaMap light />
          </div>
        </div>
      </section>

      {/* ---------------- Rooms ---------------- */}
      <section id="rooms" className="scroll-mt-20 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="reveal text-center">
            <Kicker>Sleep here</Kicker>
            <SectionTitle className="mt-4">Where to sleep</SectionTitle>
            <p className="mx-auto mt-3 max-w-lg text-[15px] text-neutral-600">
              Real ALL / Accor photos and specs. Live rates and availability are on the official
              booking page.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-6">
              {STAY_TABS.map((t) => {
                const on = stayTab === t;
                const count = t === "All" ? STAYS.length : STAYS.filter((s) => s.group === t).length;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setStayTab(t)}
                    className={`relative pb-1 font-display text-lg tracking-wide transition-colors ${
                      on ? "text-neutral-900" : "text-neutral-400 hover:text-neutral-700"
                    }`}
                  >
                    {t === "All" ? "All" : t} <span className="text-sm text-neutral-400">{count}</span>
                    {on && <span className="absolute inset-x-0 -bottom-0.5 h-1 rounded-full bg-[#FFE600]" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-14 space-y-20 sm:space-y-28">
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
      <section id="doorstep" className="scroll-mt-20 bg-neutral-50 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="reveal text-center">
            <Kicker>Days here</Kicker>
            <SectionTitle className="mt-4">On the doorstep</SectionTitle>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {EXPERIENCES.map((e) => {
              const Icon = DOORSTEP_ICON[e.id] ?? Waves;
              return (
                <article
                  key={e.id}
                  className="reveal overflow-hidden rounded-3xl border border-black/5 bg-white shadow-[0_20px_50px_-30px_rgba(0,0,0,0.3)]"
                >
                  <img src={e.img} alt={e.title} loading="lazy" className="aspect-[16/11] w-full object-cover" />
                  <div className="p-6">
                    <div className="flex items-center gap-2">
                      <Icon className="size-5 text-neutral-400" strokeWidth={1.75} />
                      <h3 className="font-display text-2xl tracking-tight text-neutral-900">{e.title}</h3>
                    </div>
                    <p className="mt-2 text-[14px] leading-relaxed text-neutral-600">{e.line}</p>
                  </div>
                </article>
              );
            })}
          </div>

          {/* For every stay — circular badges */}
          <div className="reveal mt-16 grid items-center gap-8 md:grid-cols-[auto_1fr]">
            <h3 className="font-display text-[clamp(2rem,5vw,3.25rem)] leading-[0.95] tracking-tight text-neutral-900">
              For every
              <br />
              stay…
            </h3>
            <div className="flex flex-wrap gap-4 sm:gap-6">
              {FACILITIES.map(({ Icon, label }) => (
                <div
                  key={label}
                  className="grid size-28 place-items-center rounded-full bg-white text-center shadow-[0_15px_40px_-25px_rgba(0,0,0,0.4)] sm:size-32"
                >
                  <div>
                    <Icon className="mx-auto size-6 text-neutral-500" strokeWidth={1.5} />
                    <div className="mt-1 px-2 text-[11px] font-semibold uppercase leading-tight tracking-wide text-neutral-600">
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
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <span className="jojo-bob inline-block select-none text-4xl">👇</span>
          <SectionTitle className="mt-3">Ready when you are</SectionTitle>
          <p className="mx-auto mt-3 max-w-md text-[15px] text-neutral-600">
            Rooms, dates and prices live on ALL.com. Everything else, we will sort when you arrive.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Pill href={ACCOR_URL} target="_blank" rel="noopener noreferrer" className="bg-[#FFE600] text-neutral-900 shadow-lg">
              Check rates on ALL.com <ArrowUpRight className="size-5" />
            </Pill>
            <Pill
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="border-2 border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white"
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
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="grid size-10 place-items-center rounded-full bg-[#FFE600] font-display text-lg text-neutral-900">LV</span>
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
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-4 text-xs uppercase tracking-widest text-white/60 sm:px-6">
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
