import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Nav, Footer } from "@/components/chrome";
import { MapPin, Trophy, Waves, TreePalm, Heart, MessageCircle, Check, Sparkles } from "lucide-react";

// PLACEHOLDER photos — copied from the Chillout gallery so the site renders locally.
// TODO: replace each with a real Lunja Village resort photo (pools, bungalows,
// apartments, ocean, gardens, breakfast) from @lunjavillage.officiel.
import dj from "@/assets/ph-dj.jpg";
import dj2 from "@/assets/ph-dj2.jpg";
import drinks from "@/assets/ph-drinks.jpg";
import hostel from "@/assets/ph-hostel.jpg";
import market from "@/assets/ph-market.jpg";
import surf from "@/assets/ph-surf.jpg";
import poster from "@/assets/ph-poster.jpg";

// Generated resort images
import heroPool from "@/assets/hero-pool.jpg";
import heroAerial from "@/assets/hero-aerial.jpg";
import bungalow from "@/assets/bungalow.jpg";
import apartment from "@/assets/apartment.jpg";
import party from "@/assets/party.jpg";
import yoga from "@/assets/yoga.jpg";

// Real @lunjavillage.officiel Instagram posts for the feed grid
import feed1 from "@/assets/feed1.jpg";
import feed2 from "@/assets/feed2.jpg";
import feed3 from "@/assets/feed3.jpg";
import feed4 from "@/assets/feed4.jpg";
import feed5 from "@/assets/feed5.jpg";
import feed6 from "@/assets/feed6.jpg";
import feed7 from "@/assets/feed7.jpg";
import feed8 from "@/assets/feed8.jpg";
import feed9 from "@/assets/feed9.jpg";

const CHILLOUT_URL = "https://chill-vibes-studio.vercel.app";
const IG_URL = "https://www.instagram.com/lunjavillage.officiel/";
const IG_CHILLOUT = "https://www.instagram.com/chillout_taghazout/";
const WHATSAPP = "+212 644 96 78 58";

export const Route = createFileRoute("/")({
  component: Home,
});

// ---------- utilities ----------
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function useCountUp(target: number, active: boolean, duration = 1400) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!active) return;
    let raf = 0;
    const start = performance.now();
    const step = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setV(target * eased);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [active, target, duration]);
  return v;
}

// ---------- Scroll progress ----------
function ScrollProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const on = () => {
      const h = document.documentElement;
      const scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight);
      setP(Math.max(0, Math.min(1, scrolled)));
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <div className="fixed inset-x-0 top-0 z-[70] h-1 bg-transparent">
      <div className="h-full bg-yellow transition-[width] duration-100" style={{ width: `${p * 100}%` }} />
    </div>
  );
}

// ---------- Hero ----------
const HERO_SLIDES = [heroPool, heroAerial, surf, poster];

function Hero() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % HERO_SLIDES.length), 5000);
    return () => clearInterval(t);
  }, []);
  return (
    <section id="top" className="relative isolate min-h-screen w-full overflow-hidden bg-ink text-linen grain-dark">
      {HERO_SLIDES.map((src, idx) => (
        <div
          key={src}
          className="absolute inset-0 transition-opacity duration-[1400ms]"
          style={{ opacity: i === idx ? 1 : 0 }}
        >
          <img src={src} alt="" className="h-full w-full object-cover animate-kenburns" />
          <div className="absolute inset-0 bg-gradient-to-b from-ink/40 via-ink/50 to-ink/85" />
        </div>
      ))}

      {/* floating particles */}
      <div className="pointer-events-none absolute inset-0 z-10">
        {[...Array(14)].map((_, k) => (
          <span
            key={k}
            className="absolute block h-1.5 w-1.5 rounded-full bg-yellow animate-drift"
            style={{
              left: `${(k * 73) % 100}%`,
              bottom: `-10px`,
              animationDelay: `${k * 1.1}s`,
              // @ts-expect-error CSS var
              "--dx": `${((k % 3) - 1) * 60}px`,
              opacity: 0.9,
            }}
          />
        ))}
      </div>

      <div className="animate-pop-in relative z-20 mx-auto flex min-h-screen max-w-7xl flex-col justify-end px-4 pb-24 pt-32 sm:px-6 sm:pb-32">
        <span className="font-script text-3xl text-yellow -rotate-2 inline-block">welcome to the village</span>
        <h1 className="mt-2 font-display text-[22vw] font-black leading-[0.82] tracking-tighter sm:text-[16vw] lg:text-[13rem]">
          <span className="text-grunge text-linen block">LUNJA</span>
          <span className="text-grunge text-yellow block">VILLAGE.</span>
        </h1>
        <p className="mt-6 max-w-2xl font-body text-lg text-linen/90 sm:text-xl">
          Ta parenthèse ensoleillée à Imi Ouaddar, sur la baie de Taghazout — appartements &amp; bungalows,
          piscines, live music & bonne énergie. À 30 min d'Agadir.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Badge><MapPin size={13} className="mr-1.5" /> Taghazout Bay · Imi Ouaddar</Badge>
          <Badge>Ouvert 7/7 · À 5 min de l'océan</Badge>
        </div>
        <div className="mt-8 flex flex-wrap gap-4">
          <a
            href="#book"
            className="inline-flex items-center gap-2 border-2 border-linen bg-yellow px-6 py-4 font-display text-lg font-black uppercase tracking-wider text-ink shadow-hard transition-transform hover:-translate-y-0.5"
          >
            Réserve ton séjour →
          </a>
          <a
            href="#village"
            className="inline-flex items-center gap-2 border-2 border-linen bg-transparent px-6 py-4 font-display text-lg font-black uppercase tracking-wider text-linen hover:bg-linen hover:text-ink"
          >
            Découvre le village
          </a>
        </div>

        {/* Slide dots */}
        <div className="mt-10 flex items-center gap-3">
          {HERO_SLIDES.map((_, idx) => (
            <button
              key={idx}
              aria-label={`slide ${idx + 1}`}
              onClick={() => setI(idx)}
              className={`h-2 border border-linen transition-all ${i === idx ? "w-10 bg-coral" : "w-5 bg-transparent"}`}
            />
          ))}
        </div>

        {/* Sticker */}
        <SinceStamp className="absolute right-4 top-28 hidden sm:block" />
      </div>

      {/* scroll hint */}
      <div className="absolute bottom-4 left-1/2 z-20 -translate-x-1/2 text-center text-linen/80">
        <div className="font-script text-xl">scroll</div>
        <div className="mx-auto mt-1 h-8 w-0.5 bg-linen/70" />
      </div>

      {/* wave divider */}
      <WaveDivider className="absolute -bottom-1 left-0 right-0 z-30 text-linen" flip />
    </section>
  );
}

function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center border-2 border-linen/80 bg-ink/40 px-3 py-1.5 font-display text-xs font-bold uppercase tracking-widest text-linen backdrop-blur">
      {children}
    </span>
  );
}

function SinceStamp({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-float ${className}`} style={{ ["--r" as string]: "-8deg" }}>
      <svg viewBox="0 0 160 160" className="h-32 w-32">
        <defs>
          <path id="cir" d="M 80,80 m -60,0 a 60,60 0 1,1 120,0 a 60,60 0 1,1 -120,0" />
        </defs>
        <circle cx="80" cy="80" r="72" fill="#FBF304" stroke="#141010" strokeWidth="3" />
        <circle cx="80" cy="80" r="55" fill="none" stroke="#141010" strokeWidth="2" strokeDasharray="4 4" />
        <text fontFamily="Barlow Condensed" fontWeight="900" fontSize="13" fill="#141010" letterSpacing="2">
          <textPath href="#cir" startOffset="0">SINCE · TAGHAZOUT BAY · OPEN 7/7 · </textPath>
        </text>
        <text x="80" y="76" textAnchor="middle" fontFamily="Barlow Condensed" fontWeight="900" fontSize="26" fill="#141010">
          VIBE
        </text>
        <text x="80" y="100" textAnchor="middle" fontFamily="Barlow Condensed" fontWeight="900" fontSize="26" fill="#F25C2A">
          VILLAGE
        </text>
      </svg>
    </div>
  );
}

// ---------- Wave divider ----------
function WaveDivider({ className = "", flip = false }: { className?: string; flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 1440 80"
      preserveAspectRatio="none"
      className={`block h-10 w-full sm:h-14 ${className}`}
      style={{ transform: flip ? "scaleY(-1)" : undefined }}
      aria-hidden
    >
      <path
        d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z"
        fill="currentColor"
      />
    </svg>
  );
}

// ---------- Marquee ----------
function Marquee() {
  const items = ["Surf", "Sunset", "Pool Days", "Live Music", "Good Vibes", "Taghazout Bay", "Community", "World Cup 2030"];
  const full = [...items, ...items, ...items, ...items];
  return (
    <div className="relative overflow-hidden border-y-2 border-ink bg-yellow py-4">
      <div className="flex w-max animate-marquee whitespace-nowrap">
        {full.map((it, i) => (
          <span key={i} className="mx-6 flex items-center gap-6 font-display text-3xl font-black uppercase tracking-tight text-ink">
            {it}
            <Sparkles className="text-coral" size={20} />
          </span>
        ))}
      </div>
    </div>
  );
}

// ---------- Village ----------
function StatCard({ n, unit, label, tape: tp, tilt, photo }: { n: number; unit?: string; label: string; tape: string; tilt: number; photo: string }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver((e) => e[0].isIntersecting && setSeen(true), { threshold: 0.4 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  const v = useCountUp(n, seen);
  const display = n % 1 === 0 ? Math.round(v) : v.toFixed(1);
  return (
    <div
      ref={ref}
      className="polaroid group hover:!-rotate-0 hover:!-translate-y-2"
      style={{ transform: `rotate(${tilt}deg)` }}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-ink">
        <img src={photo} alt={label} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
        <span className="tape absolute -top-2 left-3">{tp}</span>
      </div>
      <div className="mt-3 px-1 text-center font-display">
        <div className="text-6xl font-black text-coral">
          {display}
          {unit && <span className="text-3xl text-ink">{unit}</span>}
        </div>
        <div className="mt-1 text-sm font-bold uppercase tracking-widest text-ink/80">{label}</div>
      </div>
    </div>
  );
}

function VillageSection() {
  return (
    <section id="village" className="relative bg-linen py-24 sm:py-32 grain">
      <div className="relative z-10 mx-auto grid max-w-7xl gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:gap-20">
        <div className="reveal">
          <div className="mb-4 flex items-center gap-3 font-display text-sm font-bold uppercase tracking-[0.3em] text-muted-foreground">
            <span className="h-px w-10 bg-ink" /> 01 / Découvre
          </div>
          <div className="font-script text-4xl text-coral -rotate-2">le spot</div>
          <h2 className="mt-2 text-[15vw] leading-[0.82] sm:text-7xl lg:text-[6.5rem]">
            Live in the{" "}
            <span className="inline-block -rotate-1 border-2 border-ink bg-teal px-3 text-linen shadow-hard-lg">
              Village
            </span>
          </h2>
          <p className="mt-6 max-w-lg font-body text-lg leading-relaxed text-ink/80">
            Un village de vacances laid-back à deux pas des vagues. Un grand jardin,
            des piscines, des marchés le week-end, du live music tous les soirs
            et une communauté d'humains solaires venus de partout.
            <br />
            <br />
            Tu poses tes valises, tu déposes tes soucis à l'accueil.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <span className="tape !bg-coral !text-linen">Piscines</span>
            <span className="tape !bg-teal !text-linen">Jardins</span>
            <span className="tape">Live music</span>
            <span className="tape !bg-linen !text-ink border-2 border-ink">Surf & yoga</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 sm:gap-8 reveal">
          <StatCard n={104} label="Chalets" tape="Bungalows" tilt={-3} photo={bungalow} />
          <StatCard n={180} label="Appartements" tape="Sea view" tilt={2} photo={apartment} />
          <StatCard n={210} label="Suites" tape="B&B" tilt={2} photo={heroPool} />
          <StatCard n={5} unit=" MIN" label="De l'océan" tape="Beach walk" tilt={-2} photo={surf} />
        </div>
      </div>
    </section>
  );
}

// ---------- Stay / Tarifs ----------
type Room = { name: string; price: number; group: "Appartements" | "Bungalows"; tape: string; photo: string };
const ROOMS: Room[] = [
  { name: "Appartement Double", price: 1180, group: "Appartements", tape: "Duo", photo: apartment },
  { name: "Appartement Triple", price: 1250, group: "Appartements", tape: "Trio", photo: heroPool },
  { name: "Appartement Quadruple", price: 1320, group: "Appartements", tape: "Squad", photo: heroAerial },
  { name: "Bungalow Double", price: 1380, group: "Bungalows", tape: "Cosy", photo: bungalow },
  { name: "Bungalow Triple", price: 1480, group: "Bungalows", tape: "Trio", photo: hostel },
  { name: "Bungalow Quadruple", price: 1580, group: "Bungalows", tape: "Family", photo: bungalow },
];

function RoomCard({ r, i }: { r: Room; i: number }) {
  const tilt = (i % 2 ? 1.5 : -1.5);
  return (
    <div
      className="polaroid group relative hover:!-rotate-0 hover:!-translate-y-2 reveal"
      style={{ transform: `rotate(${tilt}deg)` }}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-ink">
        <img src={r.photo} alt={r.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
        <span className="tape absolute -top-2 left-4">{r.tape}</span>
        <span className="absolute -bottom-2 right-2 border-2 border-ink bg-yellow px-2 py-0.5 font-display text-xs font-black uppercase">B&B incl.</span>
      </div>
      <div className="mt-3 px-2">
        <div className="font-display text-2xl font-black uppercase leading-none">{r.name}</div>
        <div className="mt-3 flex items-end justify-between">
          <div>
            <div className="font-display text-5xl font-black leading-none text-coral">{r.price.toLocaleString("fr-FR")}<span className="text-2xl text-ink"> MAD</span></div>
            <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">par nuit · petit-déj inclus</div>
          </div>
          <a
            href="#book"
            className="inline-flex items-center border-2 border-ink bg-yellow px-3 py-2 font-display text-sm font-black uppercase text-ink shadow-hard transition-transform group-hover:-translate-y-0.5"
          >
            Book →
          </a>
        </div>
      </div>
    </div>
  );
}

function StaySection() {
  const groups: Room["group"][] = ["Appartements", "Bungalows"];
  return (
    <section id="stay" className="relative bg-paper py-24 sm:py-32 grain">
      <WaveDivider className="absolute -top-1 left-0 right-0 text-linen" />
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-14 flex flex-wrap items-end justify-between gap-6 reveal">
          <div>
            <div className="mb-4 flex items-center gap-3 font-display text-sm font-bold uppercase tracking-[0.3em] text-muted-foreground">
              <span className="h-px w-10 bg-ink" /> 02 / Dors ici
            </div>
            <div className="font-script text-4xl text-coral -rotate-2">les tarifs</div>
            <h2 className="mt-1 text-6xl sm:text-8xl">
              Les <span className="text-grunge text-ink">chambres</span>.
            </h2>
          </div>
          <p className="max-w-sm font-body text-ink/80">
            Appartements lumineux ou bungalows cocoon — tous avec <b>petit-déjeuner inclus</b>,
            accès aux piscines, jardins et bonne énergie.
          </p>
        </div>

        {groups.map((g) => (
          <div key={g} className="mb-16 last:mb-0">
            <div className="mb-8 flex items-center gap-4">
              <span className="tape !bg-teal !text-linen text-base">{g}</span>
              <div className="h-0.5 flex-1 bg-ink/30" />
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {ROOMS.filter((r) => r.group === g).map((r, i) => (
                <RoomCard key={r.name} r={r} i={i} />
              ))}
            </div>
          </div>
        ))}

        <p className="mt-8 text-center font-body text-sm text-muted-foreground">
          + Taxe touristique&nbsp;: <b>13,20 MAD / personne / nuit</b>
        </p>
      </div>
    </section>
  );
}

// ---------- Agenda ----------
type Event = { title: string; when: string; desc: string; tape: string; tapeColor?: string; photo?: string; featured?: boolean; tilt: number };
const EVENTS: Event[] = [
  { title: "Road to 2030", when: "Match nights · 2026 →", desc: "Fan-village World Cup — écrans géants, fan zone, live bands. Le Maroc joue, on vibre.", tape: "Next up", tapeColor: "coral", featured: true, photo: poster, tilt: -2 },
  { title: "DJ Sunset Sessions", when: "Vend. · Sam. · 18h → 23h", desc: "Le soleil tombe, les basses montent. Sets house & afro sur la piscine.", tape: "Live", photo: dj, tilt: 1.5 },
  { title: "Salsa Weekend", when: "Sam. · 21h", desc: "Initiations gratuites puis piste ouverte jusqu'à tard.", tape: "Danse", tapeColor: "teal", photo: party, tilt: -1.5 },
  { title: "Surf & Yoga Mornings", when: "Mer. → Dim. · 7h30", desc: "Session sunrise avec les surf coachs, retour au village pour un flow yoga.", tape: "Wellness", photo: yoga, tilt: 2 },
  { title: "Market Day", when: "Dimanche · 11h → 17h", desc: "Artisans, créateurs locaux, food stalls, DJ résident.", tape: "Souk", tapeColor: "coral", photo: market, tilt: -2 },
  { title: "Live Band Night", when: "Jeudi · 20h30", desc: "Groupes de la région et invités du Nord — reggae, gnawa, indie.", tape: "Concert", photo: dj2, tilt: 1 },
];

function EventCard({ e }: { e: Event }) {
  const bg = e.tapeColor === "coral" ? "!bg-coral !text-linen" : e.tapeColor === "teal" ? "!bg-teal !text-linen" : "";
  return (
    <article
      className={`polaroid group hover:!-rotate-0 hover:!-translate-y-2 reveal ${e.featured ? "sm:col-span-2 lg:row-span-2" : ""}`}
      style={{ transform: `rotate(${e.tilt}deg)` }}
    >
      {e.photo && (
        <div className={`relative overflow-hidden bg-ink ${e.featured ? "aspect-[16/10]" : "aspect-[4/3]"}`}>
          <img src={e.photo} alt={e.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
          <span className={`tape absolute -top-2 left-4 ${bg}`}>{e.tape}</span>
          {e.featured && (
            <span className="absolute right-3 top-3 inline-flex items-center gap-1 -rotate-6 border-2 border-linen bg-coral px-3 py-1 font-display text-xs font-black uppercase text-linen shadow-hard">
              <Trophy size={12} /> 2030
            </span>
          )}
        </div>
      )}
      <div className="mt-3 px-1">
        <div className={`font-display font-black uppercase leading-none ${e.featured ? "text-4xl sm:text-5xl" : "text-2xl"}`}>
          {e.title}
        </div>
        <div className="mt-2 font-body text-xs font-bold uppercase tracking-widest text-coral">{e.when}</div>
        <p className="mt-2 font-body text-sm text-ink/80">{e.desc}</p>
      </div>
    </article>
  );
}

function AgendaSection() {
  return (
    <section id="agenda" className="relative bg-linen py-24 sm:py-32 grain">
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-14 reveal">
          <div className="mb-4 flex items-center gap-3 font-display text-sm font-bold uppercase tracking-[0.3em] text-muted-foreground">
            <span className="h-px w-10 bg-ink" /> 03 / Vis le village
          </div>
          <div className="font-script text-4xl text-coral -rotate-2">what's on</div>
          <h2 className="mt-1 text-6xl sm:text-8xl">
            L'<span className="text-grunge text-teal">agenda</span>.
          </h2>
          <p className="mt-4 max-w-xl font-body text-ink/80">
            Tape les cartes du corkboard. Chaque semaine remixée par la crew, ouvert à tous
            les résidents du village — et à tes potes.
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {EVENTS.map((e) => (
            <EventCard key={e.title} e={e} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------- Chillout Crossover ----------
function ChilloutSection() {
  return (
    <section id="chillout" className="relative overflow-hidden bg-ink py-24 text-linen sm:py-32 grain-dark">
      <WaveDivider className="absolute -top-1 left-0 right-0 text-linen" />
      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:gap-20">
        <div className="reveal">
          <div className="font-script text-4xl text-yellow -rotate-2">when the sun goes down</div>
          <h2 className="mt-2 text-[13vw] leading-[0.85] sm:text-8xl lg:text-9xl">
            After dark?
            <br />
            It's <span className="inline-block -rotate-1 border-2 border-linen bg-yellow px-3 text-ink shadow-hard">CHILLOUT</span>
          </h2>
          <p className="mt-6 max-w-lg font-body text-lg text-linen/85">
            Le lounge bar du village. Live music, cocktails signature, tapas et sunset
            sessions. Un rideau tombe côté piscine, un autre s'ouvre côté bar.
          </p>
          <a
            href={CHILLOUT_URL}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex items-center gap-3 border-2 border-linen bg-yellow px-6 py-4 font-display text-lg font-black uppercase tracking-wider text-ink shadow-hard-lg transition-transform hover:-translate-y-0.5"
          >
            Enter Chillout Taghazout →
          </a>
        </div>
        <div className="relative reveal">
          <img
            src={drinks}
            alt="Cocktails Chillout"
            loading="lazy"
            className="w-full border-2 border-linen shadow-hard-lg"
            style={{ transform: "rotate(2deg)" }}
          />
          <img
            src={dj}
            alt="DJ set"
            loading="lazy"
            className="absolute -bottom-6 -left-6 hidden w-44 border-2 border-linen shadow-hard-lg sm:block"
            style={{ transform: "rotate(-6deg)" }}
          />
          <span className="tape absolute -top-4 right-6 !bg-yellow !text-ink text-base">Bar · 7/7</span>
        </div>
      </div>
    </section>
  );
}

// ---------- Feed ----------
const FEED = [feed1, feed2, feed3, feed4, feed5, feed6, feed7, feed8, feed9];

function FeedSection() {
  return (
    <section id="feed" className="relative bg-paper py-24 sm:py-32 grain">
      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-10 reveal border-2 border-ink bg-linen p-6 shadow-hard-lg">
          <div className="flex flex-wrap items-center gap-5">
            <div className="relative">
              <div className="rounded-full bg-gradient-to-tr from-coral via-yellow to-teal p-1">
                <div className="h-20 w-20 overflow-hidden rounded-full border-2 border-linen bg-linen">
                  <img src={heroPool} alt="Lunja Village" className="h-full w-full object-cover" />
                </div>
              </div>
              <span className="absolute -bottom-1 -right-1 tape !bg-coral !text-linen text-[10px]">Live</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-display text-2xl font-black uppercase">@lunjavillage.officiel</span>
                <a
                  href={IG_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center border-2 border-ink bg-yellow px-3 py-1.5 font-display text-xs font-black uppercase text-ink shadow-hard hover:-translate-y-0.5 transition-transform"
                >
                  Follow
                </a>
              </div>
              <div className="mt-2 flex flex-wrap gap-6 font-body text-sm">
                <span><b className="font-display text-lg">312</b> posts</span>
                <span><b className="font-display text-lg">24.8k</b> followers</span>
                <span><b className="font-display text-lg">198</b> following</span>
              </div>
              <p className="mt-2 flex flex-wrap items-center gap-1.5 max-w-md text-sm text-ink/80">vibe village on Taghazout Bay <Waves size={14} /> <TreePalm size={14} /> stay · surf · party</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-1 border-2 border-ink bg-ink reveal">
          {FEED.map((src, i) => (
            <FeedTile key={i} src={src} likes={230 + i * 73} comments={12 + i * 4} />
          ))}
        </div>

        <div className="mt-10 text-center reveal">
          <a
            href={IG_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-3 border-2 border-ink bg-yellow px-6 py-4 font-display text-lg font-black uppercase tracking-wider text-ink shadow-hard-lg hover:-translate-y-0.5 transition-transform"
          >
            Follow @lunjavillage.officiel →
          </a>
        </div>
      </div>
    </section>
  );
}

function FeedTile({ src, likes, comments }: { src: string; likes: number; comments: number }) {
  const [flash, setFlash] = useState(false);
  return (
    <button
      className="group relative block aspect-square overflow-hidden bg-ink"
      onMouseEnter={() => { setFlash(true); setTimeout(() => setFlash(false), 300); }}
    >
      <img src={src} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
      <div className="absolute inset-0 bg-ink/0 transition-colors group-hover:bg-ink/60" />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center gap-4 opacity-0 transition-opacity group-hover:opacity-100">
        <span className="inline-flex items-center gap-1.5 font-display text-linen text-lg font-black"><Heart size={18} fill="currentColor" /> {likes}</span>
        <span className="inline-flex items-center gap-1.5 font-display text-linen text-lg font-black"><MessageCircle size={18} fill="currentColor" /> {comments}</span>
      </div>
      {flash && <div className="absolute inset-0 bg-linen/70 animate-pulse" />}
    </button>
  );
}

// ---------- Book ----------
function BookSection() {
  const [sent, setSent] = useState(false);
  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") || "");
    const type = String(fd.get("type") || "");
    const arrival = String(fd.get("arrival") || "");
    const nights = String(fd.get("nights") || "");
    const people = String(fd.get("people") || "");
    const msg = String(fd.get("msg") || "");
    const text = `Bonjour Lunja Village!%0AJe m'appelle ${encodeURIComponent(name)}.%0ALogement: ${encodeURIComponent(type)}%0AArrivée: ${encodeURIComponent(arrival)} · ${encodeURIComponent(nights)} nuits · ${encodeURIComponent(people)} pers.%0A${encodeURIComponent(msg)}`;
    const phone = WHATSAPP.replace(/[^0-9]/g, "");
    setSent(true);
    setTimeout(() => window.open(`https://wa.me/${phone}?text=${text}`, "_blank"), 800);
  }
  return (
    <section id="book" className="relative overflow-hidden bg-ink py-24 text-linen sm:py-32 grain-dark">
      <div className="relative z-10 mx-auto grid max-w-7xl gap-14 px-4 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
        <div className="reveal">
          <div className="font-script text-4xl text-yellow -rotate-2">don't sleep on it</div>
          <h2 className="mt-2 text-[14vw] leading-[0.85] sm:text-8xl lg:text-9xl">
            Book your
            <br />
            <span className="inline-block -rotate-1 border-2 border-linen bg-yellow px-3 text-ink shadow-hard">STAY</span>.
          </h2>
          <ul className="mt-8 space-y-3 font-display text-lg font-bold uppercase tracking-wide">
            {["Petit-déj inclus", "Piscines & jardins", "À 5 min de l'océan", "Live music 7/7"].map((p) => (
              <li key={p} className="flex items-center gap-3">
                <span className="inline-block h-3 w-3 rotate-45 bg-coral" /> {p}
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-wrap gap-3">
            <span className="tape !bg-yellow !text-ink">WhatsApp {WHATSAPP}</span>
            <span className="tape !bg-teal !text-linen">Réponse 24h</span>
          </div>
        </div>

        <form
          onSubmit={submit}
          className="relative border-2 border-linen bg-linen p-6 text-ink shadow-hard-lg sm:p-8"
          style={{ transform: "rotate(-0.5deg)" }}
        >
          <span className="tape absolute -top-4 left-6 text-base">Résa express</span>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field name="name" label="Nom" placeholder="Ton prénom" required />
            <Field name="contact" label="Email / WhatsApp" placeholder="hello@..." required />
            <Field name="type" label="Logement" as="select">
              {ROOMS.map((r) => <option key={r.name}>{r.name}</option>)}
            </Field>
            <Field name="arrival" label="Arrivée" type="date" required />
            <Field name="nights" label="Nuits" type="number" defaultValue={3} min={1} />
            <Field name="people" label="Personnes" type="number" defaultValue={2} min={1} />
          </div>
          <div className="mt-4">
            <Field name="msg" label="Message" as="textarea" placeholder="Occasion, besoins, questions…" />
          </div>
          <button
            type="submit"
            className="mt-6 inline-flex w-full items-center justify-center gap-3 border-2 border-ink bg-yellow px-6 py-4 font-display text-lg font-black uppercase tracking-wider text-ink shadow-hard-lg hover:-translate-y-0.5 transition-transform"
          >
            Envoyer & ouvrir WhatsApp →
          </button>
          {sent && (
            <div className="mt-4 flex items-center gap-2 border-2 border-ink bg-yellow px-4 py-3 font-display text-sm font-black uppercase text-ink">
              <Check size={16} /> Merci ! On t'ouvre WhatsApp pour finaliser.
            </div>
          )}
        </form>
      </div>
    </section>
  );
}

function Field({
  label, name, as, children, ...rest
}: {
  label: string; name: string; as?: "select" | "textarea"; children?: ReactNode;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  const base = "mt-1 w-full border-2 border-ink bg-linen px-3 py-2.5 font-body text-ink focus:outline-none focus:ring-4 focus:ring-coral/40";
  return (
    <label className="block">
      <span className="font-display text-xs font-black uppercase tracking-widest text-ink/80">{label}</span>
      {as === "select" ? (
        <select name={name} className={base} required>{children}</select>
      ) : as === "textarea" ? (
        <textarea name={name} rows={3} className={base} placeholder={rest.placeholder as string} />
      ) : (
        <input name={name} className={base} {...rest} />
      )}
    </label>
  );
}

// ---------- Page ----------
function Home() {
  useReveal();
  return (
    <div className="min-h-screen bg-linen text-ink">
      <ScrollProgress />
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <VillageSection />
        <StaySection />
        <AgendaSection />
        <ChilloutSection />
        <FeedSection />
        <BookSection />
      </main>
      <Footer />
    </div>
  );
}
