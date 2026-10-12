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
  ArrowRight,
  ChevronLeft,
  ChevronRight,
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
import { PageShell, WHATSAPP } from "@/components/chrome";
import { ACCOR_URL, EXPERIENCES, INSTAGRAM_URL, STAYS, type Stay } from "@/data/lunja";
import { SITE_LOCKED } from "@/lib/site-lock";
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

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Lunja Village Imi Ouaddar · Plan du village, appartements & bungalows" },
      { name: "description", content: "Scanned the code? Welcome to Lunja Village, Imi Ouaddar. Explore the interactive village map, garden and sea-view bungalows, apartments, three pools, gardens and the beach path." },
      { property: "og:title", content: "Lunja Village · Explore the whole village" },
      { property: "og:description", content: "Interactive map, bungalows, apartments, pools, surf and quad. One Atlantic address in Imi Ouaddar." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: JojoPage,
});

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
    const t = window.setTimeout(() => items.forEach((i) => i.classList.add("in")), 1200);
    return () => {
      io.disconnect();
      window.clearTimeout(t);
    };
  }, []);
  return ref;
}

/** Swipeable photo slider for a stay (no external library). */
function StayGallery({ images, alt }: { images: string[]; alt: string }) {
  const [i, setI] = useState(0);
  const startX = useRef<number | null>(null);
  const n = images.length;
  const go = (d: number) => setI((p) => (p + d + n) % n);

  return (
    <div
      className="relative overflow-hidden select-none"
      onPointerDown={(e) => (startX.current = e.clientX)}
      onPointerUp={(e) => {
        if (startX.current === null) return;
        const dx = e.clientX - startX.current;
        if (dx > 40) go(-1);
        else if (dx < -40) go(1);
        startX.current = null;
      }}
    >
      <div
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${i * 100}%)` }}
      >
        {images.map((src, k) => (
          <img
            key={src}
            src={src}
            alt={`${alt} — photo ${k + 1} of ${n}`}
            loading={k === 0 ? "eager" : "lazy"}
            width={1200}
            height={900}
            className="w-full shrink-0 aspect-[4/3] object-cover"
            draggable={false}
          />
        ))}
      </div>

      {n > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous photo"
            onClick={() => go(-1)}
            className="absolute left-2 top-1/2 -translate-y-1/2 size-9 grid place-items-center bg-ink/80 text-linen ring-2 ring-linen/30 hover:bg-ink transition-colors"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            aria-label="Next photo"
            onClick={() => go(1)}
            className="absolute right-2 top-1/2 -translate-y-1/2 size-9 grid place-items-center bg-ink/80 text-linen ring-2 ring-linen/30 hover:bg-ink transition-colors"
          >
            <ChevronRight className="size-5" />
          </button>
          <span className="absolute top-3 right-3 bg-ink/80 text-linen px-2 py-1 font-display uppercase text-xs tracking-widest">
            {i + 1} / {n}
          </span>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((src, k) => (
              <button
                key={src}
                type="button"
                aria-label={`Go to photo ${k + 1}`}
                onClick={() => setI(k)}
                className={`h-2 rounded-full transition-all ${k === i ? "w-5 bg-sun" : "w-2 bg-linen/60"}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/** Slide-out right panel with the full room detail sheet. */
function StayDetailsPanel({ s }: { s: Stay }) {
  return (
    <SheetContent
      side="right"
      className="w-full sm:max-w-lg overflow-y-auto bg-linen text-ink border-l-4 border-ink p-0"
    >
      <div className="relative">
        {s.images && s.images.length > 0 ? (
          <StayGallery images={s.images} alt={s.name} />
        ) : (
          <img src={s.img} alt={s.name} className="w-full aspect-[4/3] object-cover" />
        )}
        <span className="absolute top-3 left-3 z-10 bg-sun text-ink px-2 py-1 font-display uppercase text-xs tracking-widest ring-2 ring-ink">
          {s.code}
        </span>
      </div>

      <div className="p-5 sm:p-6">
        <h3 className="font-display uppercase text-3xl leading-none tracking-tight text-neutral-900">{s.name}</h3>
        <p className="mt-1 text-sm text-neutral-500">{s.sleeps} · {s.size}</p>
        {s.description && <p className="mt-3 text-sm leading-relaxed text-neutral-600">{s.description}</p>}

        <ul className="mt-4 flex flex-wrap gap-2">
          {s.perks.map((p) => (
            <li key={p} className="bg-ink text-sun px-2 py-1 text-[11px] uppercase tracking-widest font-semibold">
              {p}
            </li>
          ))}
        </ul>

        <div className="mt-5 space-y-4 text-sm">
          {s.bedding && (
            <div>
              <p className="font-display uppercase text-xs tracking-widest text-terra">Bedding</p>
              <ul className="mt-1 flex flex-wrap gap-2">
                {s.bedding.map((b) => (
                  <li key={b} className="ring-1 ring-ink/20 px-2 py-0.5 text-[12px]">{b}</li>
                ))}
              </ul>
            </div>
          )}
          {s.specs?.map((grp) => (
            <div key={grp.group}>
              <p className="font-display uppercase text-xs tracking-widest text-terra">{grp.group}</p>
              <ul className="mt-1 list-disc pl-4 text-ink/75 space-y-0.5">
                {grp.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between gap-3">
          <p className="font-script text-2xl text-terra">{s.from}</p>
          <a
            href={ACCOR_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-display uppercase tracking-wider bg-ink text-sun px-4 py-2 hover:bg-terra hover:text-linen transition-colors"
          >
            Check rates <ArrowRight className="size-4" />
          </a>
        </div>
      </div>
    </SheetContent>
  );
}

function StayCard({ s, index }: { s: Stay; index: number }) {
  const hasDetails = Boolean(s.description || s.bedding || s.specs);
  return (
    <article
      className="reveal bg-linen text-ink ring-2 ring-sun/30 overflow-hidden flex flex-col h-full"
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      <div className="relative">
        {s.images && s.images.length > 0 ? (
          <StayGallery images={s.images} alt={s.name} />
        ) : (
          <img
            src={s.img}
            alt={s.name}
            loading="lazy"
            width={1200}
            height={900}
            className="w-full aspect-[4/3] object-cover"
          />
        )}
        <span className="absolute top-3 left-3 z-10 bg-sun text-ink px-2 py-1 font-display uppercase text-xs tracking-widest ring-2 ring-ink">
          {s.code}
        </span>
      </div>

      <div className="p-4 sm:p-5 flex flex-col flex-1">
        <h3 className="font-display uppercase text-2xl sm:text-3xl leading-none tracking-tight">{s.name}</h3>
        <p className="mt-1 text-sm text-ink/60">{s.sleeps} · {s.size}</p>

        <ul className="mt-3 flex flex-wrap gap-2">
          {s.perks.map((p) => (
            <li key={p} className="bg-ink text-sun px-2 py-1 text-[11px] uppercase tracking-widest font-semibold">
              {p}
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-4 flex flex-wrap items-center gap-3">
          {hasDetails ? (
            <Sheet>
              <SheetTrigger className="inline-flex items-center gap-2 font-display uppercase tracking-wider text-sm border-2 border-ink px-4 py-2 hover:bg-ink hover:text-sun transition-colors">
                View details <ArrowRight className="size-4" />
              </SheetTrigger>
              <StayDetailsPanel s={s} />
            </Sheet>
          ) : (
            <a
              href={ACCOR_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-display uppercase tracking-wider text-sm bg-ink text-sun px-4 py-2 hover:bg-terra hover:text-linen transition-colors"
            >
              Check rates <ArrowRight className="size-4" />
            </a>
          )}
          <p className="font-script text-xl text-terra">{s.from}</p>
        </div>
      </div>
    </article>
  );
}

const SLEEP_CARDS = ["apartment", "bungalow"]
  .map((id) => STAYS.find((s) => s.id === id))
  .filter((s): s is (typeof STAYS)[number] => Boolean(s));

function StaysSection() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 items-stretch">
      {SLEEP_CARDS.map((s, i) => (
        <StayCard key={s.id} s={s} index={i} />
      ))}
    </div>
  );
}

const FACILITIES = [
  { Icon: Waves, label: "3 piscines" },
  { Icon: Baby, label: "Kids club" },
  { Icon: Dumbbell, label: "Terrain de sport" },
  { Icon: Wifi, label: "Wi-Fi gratuit" },
  { Icon: MapPin, label: "Parking gratuit" },
];

function JojoPage() {
  const rootRef = useReveal();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const dark = !scrolled;

  return (
    <PageShell>
      <div ref={rootRef} className="map-lunja bg-linen text-ink font-sans selection:bg-sun selection:text-ink overflow-x-hidden">
      {/* HEADER */}
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
          scrolled
            ? "border-b border-black/5 bg-white/90 shadow-sm backdrop-blur"
            : "bg-gradient-to-b from-black/45 via-black/20 to-transparent"
        }`}
      >
        <div className="h-1 w-full bg-[#FFE600]" />
        <div className="mx-auto flex h-16 max-w-[92rem] items-center justify-between px-5 sm:h-20 sm:px-10 lg:px-16">
          <Link to="/" className="group flex items-center gap-3">
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
            <a href="#stay" className="transition-colors hover:text-[#c9971a]">Dormir</a>
            <a href="#doorstep" className="transition-colors hover:text-[#c9971a]">Aux alentours</a>
          </nav>

          <a
            href="#reserver"
            className="inline-flex items-center gap-1.5 rounded-full bg-[#FFE600] px-4 py-2.5 font-display text-xs uppercase tracking-widest text-neutral-900 shadow-md transition-transform hover:-translate-y-0.5 sm:px-5 sm:text-sm"
          >
            Réserver son séjour <ArrowRight className="size-4" />
          </a>
        </div>
      </header>

      {/* HERO */}
      <section className="relative min-h-[62svh] sm:min-h-[72svh] flex items-center overflow-hidden grain">
        <img
          src={heroImg}
          alt="Sea view terrace at Lunja Village, Imi Ouaddar"
          width={1200}
          height={900}
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/10" />
        <div className="relative z-10 max-w-6xl mx-auto w-full px-4 sm:px-6 pb-12 pt-28 sm:pt-32 text-linen">
          <div>
            <span className="inline-flex items-center gap-2 bg-sun text-ink px-3 py-1 font-display uppercase text-xs sm:text-sm tracking-widest -rotate-2 ring-2 ring-ink">
              <QrCode className="size-4 shrink-0" /> Vous avez scanné · bienvenue
            </span>
            <h1 className="mt-4 sm:mt-5 font-display uppercase leading-[0.82] tracking-tight text-[clamp(2.75rem,9vw,6.5rem)]">
              LUNJA
              <br />
              <span className="text-sun">VILLAGE</span>
            </h1>
            <p className="font-script text-2xl sm:text-4xl text-terra mt-1 ml-1 rotate-[-2deg]">
              Imi Ouaddar · côté Atlantique
            </p>
            <p className="mt-5 sm:mt-6 max-w-xl text-sm sm:text-base text-linen/80">
              284 bungalows et appartements posés sur 38,5 hectares de jardins, entre mer et
              montagne : trois piscines, un terrain de sport, un kids club, un restaurant et
              des lounge bars, plus un chemin privé vers la plage. Tout ce qui suit, c'est le
              vrai village, alors explorez-le avant même de défaire les valises.
            </p>
            <div className="mt-6 sm:mt-7 flex flex-col sm:flex-row flex-wrap gap-3">
              <a href="#map" className="inline-flex items-center justify-center gap-2 bg-sun text-ink font-display uppercase tracking-wider text-sm sm:text-base px-5 py-3 ring-2 ring-ink hover:bg-terra hover:text-linen transition-colors">
                <MapPin className="size-5 shrink-0" /> Explorer le plan
              </a>
              <a href="#stay" className="inline-flex items-center justify-center gap-2 border-2 border-linen font-display uppercase tracking-wider text-sm sm:text-base px-5 py-3 hover:bg-linen hover:text-ink transition-colors">
                Où dormir
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="bg-ink text-sun py-3 overflow-hidden border-y-4 border-terra">
        <div className="flex w-max animate-marquee font-display uppercase text-2xl tracking-widest">
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

      {/* MAP */}
      <section id="map" className="py-14 sm:py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="reveal mb-6 sm:mb-8">
            <span className="font-script text-2xl sm:text-3xl text-terra">À découvrir</span>
            <h2 className="font-display uppercase text-[clamp(2.25rem,8vw,5.5rem)] leading-[0.85] tracking-tight">
              Le village, <span className="text-terra italic">point par point</span>
            </h2>
            <p className="mt-3 max-w-xl text-sm sm:text-base text-ink/70">
              Zoomez, glissez, touchez les numéros. Chaque point est un vrai lieu du plan de
              Lunja, de l'accueil au chemin de la plage.
            </p>
          </div>
          <div className="reveal">
            <LunjaMap />
          </div>
        </div>
      </section>

      {/* STAY */}
      <section id="stay" className="bg-ink text-linen py-14 sm:py-24 px-4 sm:px-6 grain">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="reveal mb-8 sm:mb-10">
            <span className="font-script text-2xl sm:text-3xl text-sun">Dormir ici</span>
            <h2 className="font-display uppercase text-[clamp(2.25rem,8vw,5.5rem)] leading-[0.85] tracking-tight">
              Bungalows &amp; <span className="text-sun">appartements</span>
            </h2>
            <p className="mt-3 max-w-xl text-sm sm:text-base text-linen/70">
              Deux façons de séjourner, toutes deux dans l'enceinte du village : un appartement ou
              un bungalow, chacun de 75 m² pour quatre personnes maximum. Variantes côté jardin,
              piscine ou vue mer, et tarifs en direct sur la page de réservation officielle ALL.com.
            </p>
          </div>

          <StaysSection />
        </div>
      </section>

      {/* EXPERIENCES */}
      <section className="py-14 sm:py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="reveal mb-8 sm:mb-10">
            <span className="font-script text-2xl sm:text-3xl text-terra">Les journées ici</span>
            <h2 className="font-display uppercase text-[clamp(2.25rem,8vw,5.5rem)] leading-[0.85] tracking-tight">
              Profiter de <span className="text-terra italic">tout ou de rien</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
            {EXPERIENCES.map((e, i) => (
              <article
                key={e.id}
                className="reveal relative overflow-hidden ring-2 ring-ink group"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <img
                  src={e.img}
                  alt={e.title}
                  loading="lazy"
                  width={1200}
                  height={900}
                  className="w-full aspect-[16/10] sm:aspect-[4/5] object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/90 to-transparent" />
                <div className="absolute bottom-0 p-4 sm:p-5 text-linen">
                  <h3 className="font-display uppercase text-3xl sm:text-4xl leading-none tracking-tight">{e.title}</h3>
                  <p className="mt-2 text-sm text-linen/80">{e.line}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FACILITIES */}
      <section className="bg-neutral-50 py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="reveal grid items-center gap-6 sm:gap-10 md:grid-cols-[auto_1fr]">
            <h3 className="font-display text-[clamp(1.9rem,7vw,3.25rem)] leading-[1] tracking-tight text-neutral-900">
              Inclus pour chaque séjour…
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

      {/* CTA */}
      <section id="reserver" className="scroll-mt-20 bg-sun text-ink py-16 sm:py-24 px-4 sm:px-6 grain">
        <div className="max-w-4xl mx-auto text-center relative z-10 reveal">
          <span className="font-script text-2xl sm:text-3xl text-terra">Prêt pour l'Atlantique</span>
          <h2 className="font-display uppercase text-[clamp(2.5rem,10vw,6rem)] leading-[0.82] tracking-tight">
            Réserver <span className="text-terra italic">votre séjour</span>
          </h2>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href={ACCOR_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-ink text-sun font-display uppercase tracking-wider px-6 py-4 hover:bg-terra hover:text-linen transition-colors shadow-lg"
            >
              Réserver sur ALL.com <ArrowRight className="size-5" />
            </a>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border-2 border-ink font-display uppercase tracking-wider px-6 py-4 hover:bg-ink hover:text-sun transition-colors"
            >
              <Instagram className="size-5" /> @lunjavillage.officiel
            </a>
          </div>
          <p className="mt-8 font-script text-2xl -rotate-2">À très vite au village ✦</p>
        </div>
      </section>
      </div>
    </PageShell>
  );
}
