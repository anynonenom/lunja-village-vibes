import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Instagram, MapPin, QrCode, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { LunjaMap } from "@/components/LunjaMap";
import { PageShell } from "@/components/chrome";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ACCOR_URL, EXPERIENCES, INSTAGRAM_URL, STAYS, type Stay } from "@/data/lunja";
import { SITE_LOCKED } from "@/lib/site-lock";
import heroImg from "@/assets/real-lunja-aerial.jpg";

export const Route = createFileRoute("/map-lunja")({
  head: () => ({
    meta: [
      { title: "Lunja Village Imi Ouaddar · Bungalows, Apartments & Village Map" },
      { name: "description", content: "Scanned the code? Welcome to Lunja Village, Imi Ouaddar. Explore the interactive village map, garden and sea-view bungalows, apartments, three pools, gardens and the beach path." },
      { property: "og:title", content: "Lunja Village · Explore the whole village" },
      { property: "og:description", content: "Interactive map, bungalows, apartments, pools, surf and quad. One Atlantic address in Imi Ouaddar." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LunjaPage,
});

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const items = el.querySelectorAll<HTMLElement>(".reveal");
    // If IntersectionObserver is missing or nothing fires, everything stays visible.
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
    // Failsafe: reveal anything still hidden shortly after load.
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
        <h3 className="font-display uppercase text-3xl leading-none tracking-tight">{s.name}</h3>
        <p className="mt-1 text-sm text-ink/60">{s.sleeps} · {s.size}</p>
        {s.description && <p className="mt-3 text-sm text-ink/75">{s.description}</p>}

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

function LunjaPage() {
  const rootRef = useReveal();

  return (
    <PageShell>
      <div ref={rootRef} className="map-lunja bg-linen text-ink font-sans selection:bg-sun selection:text-ink overflow-x-hidden">
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
              <QrCode className="size-4 shrink-0" /> You scanned it · welcome
            </span>
            <h1 className="mt-4 sm:mt-5 font-display uppercase leading-[0.82] tracking-tighter text-[clamp(2.75rem,9vw,6.5rem)]">
              LUNJA
              <br />
              <span className="text-sun">VILLAGE</span>
            </h1>
            <p className="font-script text-2xl sm:text-4xl text-terra mt-1 ml-1 rotate-[-2deg]">
              Imi Ouaddar · Atlantic side
            </p>
            <p className="mt-5 sm:mt-6 max-w-xl text-sm sm:text-base text-linen/80">
              284 bungalows and apartments scattered through 38.5 hectares of gardens between
              sea and mountain: three pools, a sports ground, a kids club, a restaurant and
              lounge bars, plus a private path to the beach. Everything below is the real
              village, so explore it before you even unpack.
            </p>
            <div className="mt-6 sm:mt-7 flex flex-col sm:flex-row flex-wrap gap-3">
              <a href="#map" className="inline-flex items-center justify-center gap-2 bg-sun text-ink font-display uppercase tracking-wider text-sm sm:text-base px-5 py-3 ring-2 ring-ink hover:bg-terra hover:text-linen transition-colors">
                <MapPin className="size-5 shrink-0" /> Explore the map
              </a>
              <a href="#stay" className="inline-flex items-center justify-center gap-2 border-2 border-linen font-display uppercase tracking-wider text-sm sm:text-base px-5 py-3 hover:bg-linen hover:text-ink transition-colors">
                Where to sleep
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
              {["3 pools", "sports ground", "kids club", "surf nearby", "quad trails", "beach access", "restaurant & bars", "38.5 ha of gardens"].map((t) => (
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
            <span className="font-script text-2xl sm:text-3xl text-terra">Discover</span>
            <h2 className="font-display uppercase text-[clamp(2.25rem,8vw,5.5rem)] leading-[0.85] tracking-tighter">
              The village, <span className="text-terra italic">pin by pin</span>
            </h2>
            <p className="mt-3 max-w-xl text-sm sm:text-base text-ink/70">
              Zoom, drag and tap the numbers. Every pin is a real spot on the Lunja site plan,
              from reception to the beach path.
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
            <span className="font-script text-2xl sm:text-3xl text-sun">Sleep here</span>
            <h2 className="font-display uppercase text-[clamp(2.25rem,8vw,5.5rem)] leading-[0.85] tracking-tighter">
              Bungalows &amp; <span className="text-sun">apartments</span>
            </h2>
            <p className="mt-3 max-w-xl text-sm sm:text-base text-linen/70">
              Five ways to stay, all inside the gates. Every unit is a 75 m², two-bedroom
              apartment or bungalow for up to four. Live rates and availability are on the
              official ALL.com booking page.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 items-stretch">
            {STAYS.map((s, i) => (
              <StayCard key={s.id} s={s} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* EXPERIENCES */}
      <section className="py-14 sm:py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="reveal mb-8 sm:mb-10">
            <span className="font-script text-2xl sm:text-3xl text-terra">Days here</span>
            <h2 className="font-display uppercase text-[clamp(2.25rem,8vw,5.5rem)] leading-[0.85] tracking-tighter">
              Do everything, <span className="text-terra italic">or nothing</span>
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

      {/* CTA */}
      <section className="bg-sun text-ink py-16 sm:py-24 px-4 sm:px-6 grain">
        <div className="max-w-4xl mx-auto text-center relative z-10 reveal">
          <span className="font-script text-2xl sm:text-3xl text-terra">Ready when you are</span>
          <h2 className="font-display uppercase text-[clamp(2.5rem,10vw,6rem)] leading-[0.82] tracking-tighter">
            Book your <span className="text-terra italic">Atlantic stay</span>
          </h2>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href={ACCOR_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-ink text-sun font-display uppercase tracking-wider px-6 py-4 hover:bg-terra hover:text-linen transition-colors"
            >
              Check rates on ALL.com <ArrowRight className="size-5" />
            </a>
            {!SITE_LOCKED && (
              <Link
                to="/"
                className="inline-flex items-center gap-2 border-2 border-ink font-display uppercase tracking-wider px-6 py-4 hover:bg-ink hover:text-sun transition-colors"
              >
                Enter CHILLOUT <ArrowRight className="size-5" />
              </Link>
            )}
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border-2 border-ink font-display uppercase tracking-wider px-6 py-4 hover:bg-ink hover:text-sun transition-colors"
            >
              <Instagram className="size-5" /> @lunjavillage.officiel
            </a>
          </div>
          <p className="mt-8 font-script text-2xl -rotate-2">See you on the sand ✦</p>
        </div>
      </section>
      </div>
    </PageShell>
  );
}
