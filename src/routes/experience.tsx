import { createFileRoute, Link } from "@tanstack/react-router";
import { Waves, Music, Trophy } from "lucide-react";
import { PageShell, Marquee, WaveDivider, Badge, Kicker } from "@/components/chrome";

import heroAerial from "@/assets/hero-aerial.jpg";
import yoga from "@/assets/yoga.jpg";
import party from "@/assets/party.jpg";
import surf from "@/assets/ph-surf.jpg";
import market from "@/assets/ph-market.jpg";
import dj from "@/assets/ph-dj.jpg";
import dj2 from "@/assets/ph-dj2.jpg";
import drinks from "@/assets/ph-drinks.jpg";
import poster from "@/assets/ph-poster.jpg";

export const Route = createFileRoute("/experience")({
  head: () => ({
    meta: [
      { title: "EXPERIENCE · Lunja Village — Surf, Yoga, Live Music & World Cup 2030" },
      { name: "description", content: "Surf, yoga sunrise, pool days, DJ sunset, marché, salsa et la fan-village World Cup 2030. Il y a toujours un truc qui se passe au Lunja Village, Taghazout Bay." },
    ],
  }),
  component: ExperiencePage,
});

type Act = { title: string; when: string; desc: string; tape: string; color?: "coral" | "teal" | ""; photo: string; span?: boolean; tilt: number };
const ACTS: Act[] = [
  { title: "Surf sessions", when: "7/7 · sunrise & afternoon", desc: "Spots mythiques à deux pas : Anchor Point, Panorama, Croco. Location de boards & coachs sur place.", tape: "Ride", color: "coral", photo: surf, tilt: -2, span: true },
  { title: "Yoga sunrise", when: "Mer → Dim · 7h30", desc: "Flow face à l'océan pour réveiller le corps avant le café.", tape: "Breathe", color: "teal", photo: yoga, tilt: 1.5 },
  { title: "Pool days", when: "Tous les jours", desc: "Transats, musique douce, jus frais. Le farniente version village.", tape: "Chill", photo: heroAerial, tilt: -1.5 },
  { title: "DJ sunset", when: "Vend · Sam · 18h", desc: "Le soleil tombe, les basses montent. House & afro sur la piscine.", tape: "Live", color: "coral", photo: dj, tilt: 2 },
  { title: "Salsa weekend", when: "Sam · 21h", desc: "Initiations gratuites puis piste ouverte jusqu'à tard.", tape: "Danse", color: "teal", photo: party, tilt: -1 },
  { title: "Village market", when: "Dimanche · 11h → 17h", desc: "Artisans, créateurs locaux, food stalls & DJ résident.", tape: "Souk", photo: market, tilt: 1.5 },
  { title: "Excursions", when: "Sur résa", desc: "Paradise Valley, souk d'Agadir, balade à dromadaire, spots secrets.", tape: "Explore", photo: drinks, tilt: -2 },
  { title: "Live band night", when: "Jeudi · 20h30", desc: "Reggae, gnawa, indie — groupes de la région & invités du Nord.", tape: "Concert", color: "coral", photo: dj2, tilt: 1 },
];

// weekly lineup
const WEEK: { day: string; items: { time: string; label: string; color?: "coral" | "teal" }[] }[] = [
  { day: "Lun", items: [{ time: "8h", label: "Surf session" }, { time: "18h", label: "Apéro coucher de soleil", color: "coral" }] },
  { day: "Mar", items: [{ time: "7h30", label: "Yoga", color: "teal" }, { time: "21h", label: "Ciné plein air" }] },
  { day: "Mer", items: [{ time: "7h30", label: "Yoga", color: "teal" }, { time: "17h", label: "Pool party" }] },
  { day: "Jeu", items: [{ time: "10h", label: "Surf coaching" }, { time: "20h30", label: "Live band night", color: "coral" }] },
  { day: "Ven", items: [{ time: "18h", label: "DJ sunset", color: "coral" }, { time: "22h", label: "Bar Chillout" }] },
  { day: "Sam", items: [{ time: "18h", label: "DJ sunset", color: "coral" }, { time: "21h", label: "Salsa weekend", color: "teal" }] },
  { day: "Dim", items: [{ time: "11h", label: "Village market" }, { time: "8h", label: "Surf & yoga" }] },
];

function ExpHero() {
  return (
    <section className="relative isolate overflow-hidden bg-ink text-linen grain-dark">
      <img src={heroAerial} alt="" className="absolute inset-0 h-full w-full object-cover opacity-55 animate-kenburns" />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/45 via-ink/55 to-ink/85" />
      <div className="relative z-20 mx-auto max-w-7xl px-4 pb-20 pt-40 sm:px-6 sm:pb-28">
        <span className="font-script text-3xl text-yellow -rotate-2 inline-block">il y a toujours un truc</span>
        <h1 className="mt-2 font-display text-[20vw] font-black leading-[0.8] tracking-tighter sm:text-[13vw] lg:text-[11rem]">
          <span className="text-grunge text-linen block">EXPERI-</span>
          <span className="text-grunge text-coral block">ENCE.</span>
        </h1>
        <p className="mt-4 max-w-2xl font-body text-lg text-linen/90 sm:text-xl">
          Surf au lever du jour, yoga, pool days, DJ au coucher, marché du dimanche et
          la fan-village Coupe du Monde 2030. Le village bouge du matin au bout de la nuit.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Badge dark><Waves size={14} className="mr-1.5" /> Surf 7/7</Badge>
          <Badge dark><Music size={14} className="mr-1.5" /> Live music</Badge>
          <Badge dark><Trophy size={14} className="mr-1.5" /> Road to 2030</Badge>
        </div>
      </div>
      <WaveDivider className="absolute -bottom-1 left-0 right-0 z-30 text-linen" flip />
    </section>
  );
}

function ActCard({ a }: { a: Act }) {
  const bg = a.color === "coral" ? "!bg-coral !text-linen" : a.color === "teal" ? "!bg-teal !text-linen" : "";
  return (
    <article className={`polaroid group reveal hover:!-rotate-0 hover:!-translate-y-2 ${a.span ? "sm:col-span-2" : ""}`} style={{ transform: `rotate(${a.tilt}deg)` }}>
      <div className={`relative overflow-hidden bg-ink ${a.span ? "aspect-[16/9]" : "aspect-[4/3]"}`}>
        <img src={a.photo} alt={a.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
        <span className={`tape absolute -top-2 left-4 ${bg}`}>{a.tape}</span>
      </div>
      <div className="mt-3 px-1">
        <div className={`font-display font-black uppercase leading-none ${a.span ? "text-4xl" : "text-2xl"}`}>{a.title}</div>
        <div className="mt-2 font-body text-xs font-bold uppercase tracking-widest text-coral">{a.when}</div>
        <p className="mt-2 font-body text-sm text-ink/80">{a.desc}</p>
      </div>
    </article>
  );
}

function ActivitiesSection() {
  return (
    <section className="relative bg-linen py-24 sm:py-28 grain">
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-12 reveal">
          <Kicker index="01">Le corkboard</Kicker>
          <h2 className="text-6xl sm:text-8xl">Tout ce qui <span className="text-grunge text-teal">se passe</span>.</h2>
          <p className="mt-4 max-w-xl font-body text-ink/80">Épingle les cartes. Chaque semaine remixée par la crew, ouvert à tous les résidents du village — et à tes potes.</p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {ACTS.map((a) => <ActCard key={a.title} a={a} />)}
        </div>
      </div>
    </section>
  );
}

// ---------- World Cup 2030 feature ----------
function WorldCupSection() {
  return (
    <section className="relative overflow-hidden bg-coral py-24 text-linen sm:py-28 grain-dark">
      <WaveDivider className="absolute -top-1 left-0 right-0 text-linen" />
      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-20">
        <div className="reveal">
          <span className="inline-flex items-center gap-1.5 -rotate-2 border-2 border-linen bg-ink px-3 py-1 font-display text-sm font-black uppercase tracking-widest text-yellow shadow-hard"><Trophy size={14} /> 2026 → 2030</span>
          <div className="mt-4 font-script text-4xl text-yellow -rotate-2">le Maroc joue, on vibre</div>
          <h2 className="mt-2 text-[13vw] leading-[0.82] sm:text-8xl lg:text-9xl">
            Road to<br /><span className="inline-block -rotate-1 border-2 border-linen bg-ink px-3 text-linen shadow-hard">2030</span>
          </h2>
          <p className="mt-6 max-w-lg font-body text-lg text-linen/90">
            Le Maroc co-organise la Coupe du Monde 2030. Au village : écrans géants,
            fan zone côté piscine, live bands, tacos & mint tea et une ambiance stade
            à chaque match des Lions de l'Atlas.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <span className="tape !bg-yellow !text-ink text-base">Écran géant</span>
            <span className="tape !bg-ink !text-yellow text-base">Fan zone</span>
            <span className="tape !bg-teal !text-linen text-base">Live bands</span>
          </div>
          <Link to="/contact" className="mt-8 inline-flex items-center gap-2 border-2 border-linen bg-ink px-6 py-4 font-display text-lg font-black uppercase tracking-wider text-linen shadow-hard-lg transition-transform hover:-translate-y-0.5">
            Réserve pour la fan-village →
          </Link>
        </div>
        <div className="relative reveal">
          <img src={poster} alt="Fan village World Cup 2030" loading="lazy" className="w-full border-2 border-linen shadow-hard-lg" style={{ transform: "rotate(2deg)" }} />
          <img src={party} alt="Ambiance" loading="lazy" className="absolute -bottom-6 -left-6 hidden w-44 border-2 border-linen shadow-hard-lg sm:block" style={{ transform: "rotate(-6deg)" }} />
          <span className="tape absolute -top-4 right-6 !bg-yellow !text-ink text-base">Match nights</span>
        </div>
      </div>
    </section>
  );
}

// ---------- Weekly lineup ----------
function LineupSection() {
  return (
    <section className="relative bg-paper py-24 sm:py-28 grain">
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-12 reveal">
          <Kicker index="02">Le line-up</Kicker>
          <h2 className="text-6xl sm:text-8xl">La <span className="text-grunge text-coral">semaine</span> type.</h2>
          <p className="mt-4 max-w-xl font-body text-ink/80">Le planning bouge selon la saison — demande à la réception le programme du jour.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {WEEK.map((d, i) => (
            <div key={d.day} className="reveal border-2 border-ink bg-linen p-4 shadow-hard" style={{ transform: `rotate(${i % 2 ? 0.8 : -0.8}deg)` }}>
              <div className="flex items-center justify-between border-b-2 border-ink pb-2">
                <span className="font-display text-2xl font-black uppercase">{d.day}</span>
                <span className="font-script text-xl text-coral">jour {i + 1}</span>
              </div>
              <ul className="mt-3 space-y-2">
                {d.items.map((it) => (
                  <li key={it.label} className="flex items-start gap-2">
                    <span className={`mt-0.5 shrink-0 border border-ink px-1.5 py-0.5 font-display text-[11px] font-black uppercase ${it.color === "coral" ? "bg-coral text-linen" : it.color === "teal" ? "bg-teal text-linen" : "bg-yellow text-ink"}`}>{it.time}</span>
                    <span className="font-body text-sm font-semibold text-ink/85">{it.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {/* Chillout after-dark tile */}
          <div className="reveal flex flex-col justify-between border-2 border-ink bg-ink p-4 text-linen shadow-hard" style={{ transform: "rotate(0.8deg)" }}>
            <div>
              <div className="font-script text-2xl text-yellow">after dark</div>
              <div className="mt-1 font-display text-2xl font-black uppercase leading-none">Chaque soir<br />au Chillout</div>
            </div>
            <p className="mt-3 font-body text-sm text-linen/80">Le lounge bar du village prend le relais. Cocktails, tapas & live jusqu'à tard.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function CtaSection() {
  return (
    <section className="relative overflow-hidden bg-ink py-20 text-linen sm:py-24 grain-dark">
      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6">
        <div className="font-script text-4xl text-yellow -rotate-2 reveal">prêt à vibrer ?</div>
        <h2 className="mt-2 text-6xl sm:text-8xl reveal">Viens vivre le <span className="text-grunge text-coral">village</span>.</h2>
        <div className="mt-8 flex flex-wrap justify-center gap-4 reveal">
          <Link to="/stay" hash="book" className="inline-flex items-center gap-2 border-2 border-linen bg-coral px-6 py-4 font-display text-lg font-black uppercase tracking-wider text-linen shadow-hard-lg hover:-translate-y-0.5 transition-transform">
            Réserve ton séjour →
          </Link>
          <Link to="/contact" className="inline-flex items-center gap-2 border-2 border-linen px-6 py-4 font-display text-lg font-black uppercase tracking-wider text-linen hover:bg-linen hover:text-ink">
            Nous trouver
          </Link>
        </div>
      </div>
    </section>
  );
}

function ExperiencePage() {
  return (
    <PageShell>
      <ExpHero />
      <Marquee items={["Surf", "Yoga", "Pool days", "DJ sunset", "Salsa", "Market", "World Cup 2030", "Good vibes"]} bg="bg-coral" />
      <ActivitiesSection />
      <WorldCupSection />
      <LineupSection />
      <CtaSection />
    </PageShell>
  );
}
