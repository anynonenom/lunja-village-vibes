import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Croissant, Waves, TreePalm, Wifi, Car, Music, ConciergeBell, Wallet, MapPin, Check, type LucideIcon } from "lucide-react";
import {
  PageShell, Marquee, WaveDivider, Badge, Kicker, Field, SinceStamp, WHATSAPP,
} from "@/components/chrome";

import heroPool from "@/assets/hero-pool.jpg";
import heroAerial from "@/assets/hero-aerial.jpg";
import bungalow from "@/assets/bungalow.jpg";
import apartment from "@/assets/apartment.jpg";
import hostel from "@/assets/ph-hostel.jpg";

export const Route = createFileRoute("/stay")({
  head: () => ({
    meta: [
      { title: "STAY · Lunja Village — Appartements & Bungalows, Taghazout Bay" },
      { name: "description", content: "Appartements et bungalows tout confort au Lunja Village, petit-déjeuner inclus, piscines & jardins à 5 min de l'océan. Tarifs de 1180 à 1580 MAD / nuit." },
    ],
  }),
  component: StayPage,
});

type Room = {
  name: string; price: number; group: "Appartements" | "Bungalows";
  cap: string; tape: string; photo: string; perks: string[];
};
const ROOMS: Room[] = [
  { name: "Appartement Double", price: 1180, group: "Appartements", cap: "2 pers.", tape: "Duo", photo: apartment, perks: ["Lit double", "Kitchenette", "Balcon"] },
  { name: "Appartement Triple", price: 1250, group: "Appartements", cap: "3 pers.", tape: "Trio", photo: heroPool, perks: ["3 couchages", "Kitchenette", "Vue jardin"] },
  { name: "Appartement Quadruple", price: 1320, group: "Appartements", cap: "4 pers.", tape: "Squad", photo: heroAerial, perks: ["4 couchages", "Salon", "Kitchenette"] },
  { name: "Bungalow Double", price: 1380, group: "Bungalows", cap: "2 pers.", tape: "Cosy", photo: bungalow, perks: ["Terrasse privée", "Lit double", "Jardin"] },
  { name: "Bungalow Triple", price: 1480, group: "Bungalows", cap: "3 pers.", tape: "Trio", photo: hostel, perks: ["Terrasse", "3 couchages", "Coin salon"] },
  { name: "Bungalow Quadruple", price: 1580, group: "Bungalows", cap: "4 pers.", tape: "Family", photo: bungalow, perks: ["Terrasse XL", "4 couchages", "Familial"] },
];

const INCLUDED: { Icon: LucideIcon; label: string }[] = [
  { Icon: Croissant, label: "Petit-déj inclus" },
  { Icon: Waves, label: "Accès piscines" },
  { Icon: TreePalm, label: "Jardins & patios" },
  { Icon: Wifi, label: "Wifi partout" },
  { Icon: Car, label: "Parking gratuit" },
  { Icon: Waves, label: "Océan à 5 min" },
  { Icon: Music, label: "Live music 7/7" },
  { Icon: ConciergeBell, label: "Réception 24h" },
];

// ---------- Page hero ----------
function StayHero() {
  return (
    <section className="relative isolate overflow-hidden bg-ink text-linen grain-dark">
      <img src={heroPool} alt="" className="absolute inset-0 h-full w-full object-cover opacity-60" />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/50 via-ink/55 to-ink/85" />
      <div className="animate-pop-in relative z-20 mx-auto max-w-7xl px-4 pb-20 pt-40 sm:px-6 sm:pb-28">
        <span className="font-script text-3xl text-yellow -rotate-2 inline-block">pose tes valises</span>
        <h1 className="mt-2 font-display text-[24vw] font-black leading-[0.82] tracking-tighter sm:text-[15vw] lg:text-[13rem]">
          <span className="text-grunge text-linen">STAY</span>
        </h1>
        <p className="mt-4 max-w-2xl font-body text-lg text-linen/90 sm:text-xl">
          Appartements lumineux ou bungalows cocoon — tous avec petit-déjeuner inclus,
          accès aux piscines, jardins et bonne énergie. À 5 min de l'océan.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Badge dark><Wallet size={14} className="mr-1.5" /> Dès 1180 MAD / nuit</Badge>
          <Badge dark><Croissant size={14} className="mr-1.5" /> Petit-déj inclus</Badge>
          <Badge dark><MapPin size={14} className="mr-1.5" /> Taghazout Bay</Badge>
        </div>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link to="/stay" hash="book" className="inline-flex items-center gap-2 border-2 border-linen bg-yellow px-6 py-4 font-display text-lg font-black uppercase tracking-wider text-ink shadow-hard transition-transform hover:-translate-y-0.5">
            Réserve maintenant →
          </Link>
          <Link to="/stay" hash="tarifs" className="inline-flex items-center gap-2 border-2 border-linen px-6 py-4 font-display text-lg font-black uppercase tracking-wider text-linen hover:bg-linen hover:text-ink">
            Voir les tarifs
          </Link>
        </div>
      </div>
      <WaveDivider className="absolute -bottom-1 left-0 right-0 z-30 text-linen" flip />
    </section>
  );
}

// ---------- Included strip ----------
function IncludedStrip() {
  return (
    <section className="bg-linen py-16 grain">
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        <Kicker index="01">Tout compris</Kicker>
        <h2 className="text-5xl sm:text-7xl">Ce qui est <span className="text-grunge text-teal">inclus</span>.</h2>
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {INCLUDED.map(({ Icon, label }, i) => (
            <div
              key={label}
              className="reveal border-2 border-ink bg-paper p-4 shadow-hard"
              style={{ transform: `rotate(${i % 2 ? 1 : -1}deg)` }}
            >
              <Icon className="h-8 w-8 text-coral" strokeWidth={2.5} />
              <div className="mt-2 font-display text-lg font-black uppercase leading-none">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------- Room card ----------
function RoomCard({ r, i }: { r: Room; i: number }) {
  const tilt = i % 2 ? 1.5 : -1.5;
  return (
    <div className="polaroid group relative reveal hover:!-rotate-0 hover:!-translate-y-2" style={{ transform: `rotate(${tilt}deg)` }}>
      <div className="relative aspect-[4/3] overflow-hidden bg-ink">
        <img src={r.photo} alt={r.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
        <span className="tape absolute -top-2 left-4">{r.tape}</span>
        <span className="absolute -bottom-2 right-2 border-2 border-ink bg-yellow px-2 py-0.5 font-display text-xs font-black uppercase">{r.cap}</span>
      </div>
      <div className="mt-3 px-2">
        <div className="font-display text-2xl font-black uppercase leading-none">{r.name}</div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {r.perks.map((p) => (
            <span key={p} className="border border-ink/40 bg-linen px-2 py-0.5 font-body text-[11px] font-semibold uppercase tracking-wide text-ink/70">{p}</span>
          ))}
        </div>
        <div className="mt-3 flex items-end justify-between">
          <div>
            <div className="font-display text-5xl font-black leading-none text-coral">
              {r.price.toLocaleString("fr-FR")}<span className="text-2xl text-ink"> MAD</span>
            </div>
            <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">par nuit · petit-déj inclus</div>
          </div>
          <Link to="/stay" hash="book" className="inline-flex items-center border-2 border-ink bg-yellow px-3 py-2 font-display text-sm font-black uppercase text-ink shadow-hard transition-transform group-hover:-translate-y-0.5">
            Book →
          </Link>
        </div>
      </div>
    </div>
  );
}

function RoomsSection() {
  const groups: Room["group"][] = ["Appartements", "Bungalows"];
  return (
    <section className="relative bg-paper py-24 sm:py-28 grain">
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-12 reveal">
          <Kicker index="02">Les logements</Kicker>
          <h2 className="text-6xl sm:text-8xl">Choisis ton <span className="text-grunge text-coral">nid</span>.</h2>
        </div>
        {groups.map((g) => (
          <div key={g} className="mb-16 last:mb-0">
            <div className="mb-8 flex items-center gap-4">
              <span className="tape !bg-teal !text-linen text-base">{g}</span>
              <div className="h-0.5 flex-1 bg-ink/30" />
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {ROOMS.filter((r) => r.group === g).map((r, i) => <RoomCard key={r.name} r={r} i={i} />)}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ---------- Boarding-pass pricing ticket (signature design element) ----------
function TariffTicket() {
  return (
    <section id="tarifs" className="relative bg-linen py-24 sm:py-28 grain">
      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6">
        <div className="mb-10 reveal text-center">
          <Kicker index="03">La grille</Kicker>
          <h2 className="text-5xl sm:text-7xl">Ta <span className="text-grunge text-teal">boarding pass</span>.</h2>
        </div>

        <div className="reveal relative border-2 border-ink bg-paper shadow-hard-lg">
          {/* perforation notches */}
          <div className="absolute -left-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full border-2 border-ink bg-linen" />
          <div className="absolute -right-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full border-2 border-ink bg-linen" />

          <div className="flex flex-col sm:flex-row">
            {/* stub */}
            <div className="flex flex-col justify-between border-b-2 border-dashed border-ink bg-coral p-6 text-linen sm:w-56 sm:border-b-0 sm:border-r-2">
              <div>
                <div className="font-script text-2xl">boarding pass</div>
                <div className="mt-2 font-display text-3xl font-black uppercase leading-none">Lunja<br />Village</div>
              </div>
              <div className="mt-6 font-display text-xs font-black uppercase tracking-widest">
                <div>Gate · Taghazout Bay</div>
                <div>Seat · 5 min from ocean</div>
                <div>Class · Vibe</div>
              </div>
            </div>

            {/* rows */}
            <div className="flex-1 p-6">
              <div className="mb-3 flex items-center justify-between border-b-2 border-ink pb-2 font-display text-xs font-black uppercase tracking-widest text-ink/70">
                <span>Logement</span><span>Capacité</span><span>Prix / nuit</span>
              </div>
              <ul className="divide-y divide-ink/20">
                {ROOMS.map((r) => (
                  <li key={r.name} className="flex items-center justify-between gap-3 py-3">
                    <span className="font-display text-lg font-black uppercase leading-tight">{r.name}</span>
                    <span className="hidden font-body text-sm text-ink/70 sm:inline">{r.cap}</span>
                    <span className="font-display text-2xl font-black text-coral">{r.price.toLocaleString("fr-FR")}<span className="text-sm text-ink"> MAD</span></span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 border-t-2 border-dashed border-ink pt-3 font-body text-sm text-muted-foreground">
                + Taxe touristique&nbsp;: <b className="text-ink">13,20 MAD / personne / nuit</b> · Petit-déjeuner inclus dans tous les tarifs.
              </div>
              <Link to="/stay" hash="book" className="mt-5 inline-flex w-full items-center justify-center gap-2 border-2 border-ink bg-yellow px-6 py-3 font-display text-lg font-black uppercase tracking-wider text-ink shadow-hard hover:-translate-y-0.5 transition-transform">
                Réserver mon séjour →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------- Booking ----------
function BookSection() {
  const [sent, setSent] = useState(false);
  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const get = (k: string) => encodeURIComponent(String(fd.get(k) || ""));
    const text = `Bonjour Lunja Village!%0AJe m'appelle ${get("name")}.%0ALogement: ${get("type")}%0AArrivée: ${get("arrival")} · ${get("nights")} nuits · ${get("people")} pers.%0A${get("msg")}`;
    const phone = WHATSAPP.replace(/[^0-9]/g, "");
    setSent(true);
    setTimeout(() => window.open(`https://wa.me/${phone}?text=${text}`, "_blank"), 800);
  }
  return (
    <section id="book" className="relative overflow-hidden bg-ink py-24 text-linen sm:py-28 grain-dark">
      <WaveDivider className="absolute -top-1 left-0 right-0 text-linen" />
      <div className="relative z-10 mx-auto grid max-w-7xl gap-14 px-4 sm:px-6 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
        <div className="reveal">
          <div className="font-script text-4xl text-yellow -rotate-2">don't sleep on it</div>
          <h2 className="mt-2 text-[14vw] leading-[0.85] sm:text-8xl lg:text-9xl">
            Book your<br /><span className="inline-block -rotate-1 border-2 border-linen bg-yellow px-3 text-ink shadow-hard">STAY</span>.
          </h2>
          <p className="mt-6 max-w-md font-body text-lg text-linen/85">
            Dis-nous quand tu arrives, on garde ta place. Confirmation par WhatsApp
            ou email, réponse sous 24h.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <span className="tape !bg-yellow !text-ink">WhatsApp {WHATSAPP}</span>
            <span className="tape !bg-teal !text-linen">Réponse 24h</span>
          </div>
          <SinceStamp className="mt-8 hidden sm:block" />
        </div>

        <form onSubmit={submit} className="relative border-2 border-linen bg-linen p-6 text-ink shadow-hard-lg sm:p-8" style={{ transform: "rotate(-0.5deg)" }}>
          <span className="tape absolute -top-4 left-6 text-base">Résa express</span>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field name="name" label="Nom" placeholder="Ton prénom" required />
            <Field name="contact" label="Email / WhatsApp" placeholder="hello@..." required />
            <Field name="type" label="Logement" as="select">
              {ROOMS.map((r) => <option key={r.name}>{r.name} — {r.price} MAD</option>)}
            </Field>
            <Field name="arrival" label="Arrivée" type="date" required />
            <Field name="nights" label="Nuits" type="number" defaultValue={3} min={1} />
            <Field name="people" label="Personnes" type="number" defaultValue={2} min={1} />
          </div>
          <div className="mt-4">
            <Field name="msg" label="Message" as="textarea" placeholder="Occasion, besoins, questions…" />
          </div>
          <button type="submit" className="mt-6 inline-flex w-full items-center justify-center gap-3 border-2 border-ink bg-yellow px-6 py-4 font-display text-lg font-black uppercase tracking-wider text-ink shadow-hard-lg hover:-translate-y-0.5 transition-transform">
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

function StayPage() {
  return (
    <PageShell>
      <StayHero />
      <Marquee items={["Petit-déj inclus", "Piscines", "Bungalows", "Appartements", "5 min océan", "Réception 24h", "Good vibes"]} />
      <IncludedStrip />
      <RoomsSection />
      <TariffTicket />
      <BookSection />
    </PageShell>
  );
}
