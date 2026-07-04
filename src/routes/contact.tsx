import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Plane, Car, Waves, ConciergeBell, MapPin, Clock, SquareParking, Smartphone, Mail, Instagram, Check, Phone, type LucideIcon } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import {
  PageShell, WaveDivider, Badge, Kicker, Field, SinceStamp,
  WHATSAPP, EMAIL, IG_URL, ADDRESS,
} from "@/components/chrome";

import market from "@/assets/ph-market.jpg";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "VISIT · Lunja Village — Nous trouver à Taghazout Bay" },
      { name: "description", content: "Lunja Village, Imi Ouaddar, Taghazout Bay — à 30 min d'Agadir et de l'aéroport Al Massira. Contact, itinéraire, WhatsApp et FAQ." },
    ],
  }),
  component: ContactPage,
});

const GETTING: { Icon: LucideIcon; title: string; desc: string }[] = [
  { Icon: Plane, title: "Depuis l'aéroport", desc: "Aéroport Agadir–Al Massira à ~45 min. Transfert privé sur demande." },
  { Icon: Car, title: "Depuis Agadir", desc: "~30 min par la route côtière direction Taghazout / Imi Ouaddar." },
  { Icon: Waves, title: "Depuis Taghazout", desc: "10 min au nord du village de surf, en bord de baie." },
  { Icon: ConciergeBell, title: "Arrivée", desc: "Check-in dès 14h · Check-out 11h · Réception 24h/24." },
];

const FAQ = [
  { q: "Le petit-déjeuner est-il inclus ?", a: "Oui — tous nos tarifs (appartements et bungalows) sont en formule B&B, petit-déjeuner inclus chaque matin." },
  { q: "Quels sont les horaires de check-in / check-out ?", a: "Check-in à partir de 14h, check-out jusqu'à 11h. La réception est ouverte 24h/24 si tu arrives plus tard." },
  { q: "Y a-t-il un supplément à prévoir ?", a: "Une taxe touristique de 13,20 MAD par personne et par nuit s'ajoute au tarif, réglée sur place." },
  { q: "Peut-on louer du matériel de surf ?", a: "Oui, location de planches et cours avec nos coachs partenaires, directement au village." },
  { q: "Le parking est-il gratuit ?", a: "Oui, parking gratuit sur place ainsi que le wifi dans tout le village." },
  { q: "Acceptez-vous les groupes et événements ?", a: "Avec plaisir — séminaires, anniversaires, fan-village World Cup. Écris-nous sur WhatsApp pour un devis." },
];

const MAPS_LINK = "https://www.google.com/maps/search/?api=1&query=Lunja+Village+Imi+Ouaddar+Taghazout";

function ContactHero() {
  return (
    <section className="relative isolate overflow-hidden bg-ink text-linen grain-dark">
      <img src={market} alt="" className="absolute inset-0 h-full w-full object-cover opacity-45" />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/50 via-ink/55 to-ink/85" />
      <div className="animate-pop-in relative z-20 mx-auto max-w-7xl px-4 pb-20 pt-40 sm:px-6 sm:pb-28">
        <span className="font-script text-3xl text-yellow -rotate-2 inline-block">envoie une carte postale</span>
        <h1 className="mt-2 font-display text-[22vw] font-black leading-[0.82] tracking-tighter sm:text-[14vw] lg:text-[12rem]">
          <span className="text-grunge text-linen">VISIT.</span>
        </h1>
        <p className="mt-4 max-w-2xl font-body text-lg text-linen/90 sm:text-xl">
          On est posés sur la baie de Taghazout, à Imi Ouaddar — à 30 min d'Agadir,
          les pieds presque dans l'eau. Viens comme tu es.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Badge dark><MapPin size={14} className="mr-1.5" /> Imi Ouaddar</Badge>
          <Badge dark><Car size={14} className="mr-1.5" /> 30 min d'Agadir</Badge>
          <Badge dark><ConciergeBell size={14} className="mr-1.5" /> Réception 24h</Badge>
        </div>
      </div>
      <WaveDivider className="absolute -bottom-1 left-0 right-0 z-30 text-linen" flip />
    </section>
  );
}

// ---------- Postcard: map + address ----------
function PostcardSection() {
  return (
    <section className="bg-linen py-24 sm:py-28 grain">
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-12 reveal">
          <Kicker index="01">La carte postale</Kicker>
          <h2 className="text-6xl sm:text-8xl">Nous <span className="text-grunge text-teal">trouver</span>.</h2>
        </div>

        <div className="reveal grid overflow-hidden border-2 border-ink bg-paper shadow-hard-lg lg:grid-cols-2">
          {/* left: stylized map */}
          <a href={MAPS_LINK} target="_blank" rel="noreferrer" className="group relative block min-h-[320px] border-b-2 border-ink lg:border-b-0 lg:border-r-2">
            <svg viewBox="0 0 400 320" preserveAspectRatio="xMidYMid slice" className="h-full w-full">
              <rect width="400" height="320" fill="#1E9E8A" />
              <rect width="400" height="320" fill="#1E9E8A" />
              {/* ocean */}
              <path d="M0,0 L150,0 C150,120 90,200 0,240 Z" fill="#17897a" />
              {/* land */}
              <path d="M150,0 L400,0 L400,320 L0,320 C120,260 150,150 150,0 Z" fill="#EDE8DC" />
              {/* roads */}
              <path d="M150,40 C220,90 260,160 330,300" fill="none" stroke="#C8BFA8" strokeWidth="6" />
              <path d="M180,10 C210,120 300,180 400,190" fill="none" stroke="#C8BFA8" strokeWidth="4" />
              {/* coast dashes */}
              <path d="M150,0 C150,120 90,200 0,240" fill="none" stroke="#F4EFE4" strokeWidth="3" strokeDasharray="6 8" />
              {/* pin */}
              <g transform="translate(250,150)" className="transition-transform duration-300 group-hover:-translate-y-1">
                <path d="M0,-34 C18,-34 26,-20 26,-8 C26,10 0,34 0,34 C0,34 -26,10 -26,-8 C-26,-20 -18,-34 0,-34 Z" fill="#F25C2A" stroke="#141010" strokeWidth="3" />
                <circle cx="0" cy="-8" r="8" fill="#141010" />
              </g>
              <text x="250" y="200" textAnchor="middle" fontFamily="Barlow Condensed" fontWeight="900" fontSize="18" fill="#141010">LUNJA VILLAGE</text>
              <text x="70" y="150" textAnchor="middle" fontFamily="Caveat Brush" fontSize="22" fill="#F4EFE4" transform="rotate(-12 70 150)">Atlantique</text>
            </svg>
            <span className="tape absolute bottom-4 left-4 !bg-linen !text-ink border-2 border-ink text-base group-hover:-translate-y-0.5 transition-transform">Ouvrir dans Maps →</span>
          </a>

          {/* right: address stub */}
          <div className="flex flex-col justify-between p-6 sm:p-8">
            <div>
              <div className="flex items-start justify-between">
                <div className="font-script text-3xl text-coral -rotate-2">bienvenue</div>
                <div className="border-2 border-ink bg-yellow px-2 py-1 font-display text-xs font-black uppercase leading-tight text-ink" style={{ transform: "rotate(4deg)" }}>
                  Taghazout<br />Bay
                </div>
              </div>
              <h3 className="mt-4 text-3xl">Lunja Village</h3>
              <p className="mt-2 max-w-sm font-body text-ink/80">{ADDRESS}</p>
              <div className="mt-4 space-y-1 font-body text-sm text-ink/80">
                <div className="flex items-center gap-2"><MapPin size={14} /> ~30,60° N · 9,71° O</div>
                <div className="flex items-center gap-2"><Clock size={14} /> Réception 24h/24</div>
                <div className="flex items-center gap-2"><SquareParking size={14} /> Parking & wifi gratuits</div>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={`https://wa.me/${WHATSAPP.replace(/[^0-9]/g, "")}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 border-2 border-ink bg-teal px-4 py-3 font-display text-sm font-black uppercase text-linen shadow-hard hover:-translate-y-0.5 transition-transform">
                WhatsApp →
              </a>
              <a href={MAPS_LINK} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 border-2 border-ink bg-yellow px-4 py-3 font-display text-sm font-black uppercase text-ink shadow-hard hover:-translate-y-0.5 transition-transform">
                Itinéraire →
              </a>
            </div>
          </div>
        </div>

        {/* getting here */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {GETTING.map(({ Icon, title, desc }, i) => (
            <div key={title} className="reveal border-2 border-ink bg-paper p-5 shadow-hard" style={{ transform: `rotate(${i % 2 ? 1 : -1}deg)` }}>
              <Icon className="h-8 w-8 text-coral" strokeWidth={2.5} />
              <div className="mt-2 font-display text-xl font-black uppercase leading-none">{title}</div>
              <p className="mt-2 font-body text-sm text-ink/80">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------- Contact methods + postcard form ----------
function ContactFormSection() {
  const [sent, setSent] = useState(false);
  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const get = (k: string) => encodeURIComponent(String(fd.get(k) || ""));
    const text = `Bonjour Lunja Village!%0AJe m'appelle ${get("name")} (${get("contact")}).%0A${get("msg")}`;
    const phone = WHATSAPP.replace(/[^0-9]/g, "");
    setSent(true);
    setTimeout(() => window.open(`https://wa.me/${phone}?text=${text}`, "_blank"), 800);
  }
  return (
    <section className="relative overflow-hidden bg-ink py-24 text-linen sm:py-28 grain-dark">
      <WaveDivider className="absolute -top-1 left-0 right-0 text-linen" />
      <div className="relative z-10 mx-auto grid max-w-7xl gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:gap-20">
        <div className="reveal">
          <div className="font-script text-4xl text-yellow -rotate-2">on te répond vite</div>
          <h2 className="mt-2 text-[13vw] leading-[0.85] sm:text-8xl lg:text-9xl">
            Dis-nous<br /><span className="inline-block -rotate-1 border-2 border-linen bg-yellow px-3 text-ink shadow-hard">HELLO</span>.
          </h2>
          <div className="mt-8 flex flex-col gap-3">
            <a href={`https://wa.me/${WHATSAPP.replace(/[^0-9]/g, "")}`} target="_blank" rel="noreferrer" className="group flex items-center justify-between border-2 border-linen bg-ink px-5 py-4 font-display text-lg font-black uppercase tracking-wide hover:bg-linen hover:text-ink transition-colors">
              <span className="inline-flex items-center gap-2"><Smartphone size={18} /> WhatsApp</span><span className="text-yellow group-hover:text-coral">{WHATSAPP}</span>
            </a>
            <a href={`mailto:${EMAIL}`} className="group flex items-center justify-between border-2 border-linen bg-ink px-5 py-4 font-display text-lg font-black uppercase tracking-wide hover:bg-linen hover:text-ink transition-colors">
              <span className="inline-flex items-center gap-2"><Mail size={18} /> Email</span><span className="text-yellow group-hover:text-coral">{EMAIL}</span>
            </a>
            <a href={IG_URL} target="_blank" rel="noreferrer" className="group flex items-center justify-between border-2 border-linen bg-ink px-5 py-4 font-display text-lg font-black uppercase tracking-wide hover:bg-linen hover:text-ink transition-colors">
              <span className="inline-flex items-center gap-2"><Instagram size={18} /> Instagram</span><span className="text-yellow group-hover:text-coral">@lunjavillage.officiel</span>
            </a>
          </div>
          <SinceStamp className="mt-10 hidden sm:block" />
        </div>

        {/* postcard form */}
        <form onSubmit={submit} className="relative border-2 border-linen bg-linen p-6 text-ink shadow-hard-lg sm:p-8" style={{ transform: "rotate(0.5deg)" }}>
          <div className="absolute -top-4 right-6 border-2 border-ink bg-yellow px-3 py-2 font-display text-[10px] font-black uppercase leading-tight text-ink" style={{ transform: "rotate(6deg)" }}>
            Par<br />avion
          </div>
          <span className="tape absolute -top-4 left-6 text-base">Carte postale</span>
          <div className="mt-2 grid gap-4 sm:grid-cols-2">
            <Field name="name" label="Ton nom" placeholder="Prénom" required />
            <Field name="contact" label="Email / WhatsApp" placeholder="hello@..." required />
          </div>
          <div className="mt-4">
            <Field name="msg" label="Ton message" as="textarea" placeholder="Dates, nombre de personnes, questions, occasion…" />
          </div>
          <button type="submit" className="mt-6 inline-flex w-full items-center justify-center gap-3 border-2 border-ink bg-yellow px-6 py-4 font-display text-lg font-black uppercase tracking-wider text-ink shadow-hard-lg hover:-translate-y-0.5 transition-transform">
            Envoyer & ouvrir WhatsApp →
          </button>
          {sent && (
            <div className="mt-4 flex items-center gap-2 border-2 border-ink bg-yellow px-4 py-3 font-display text-sm font-black uppercase text-ink">
              <Check size={16} /> Merci ! On t'ouvre WhatsApp pour continuer.
            </div>
          )}

          {/* Scan-to-call QR — fills the postcard */}
          <div className="mt-8 flex items-center gap-5 border-t-2 border-dashed border-ink pt-6">
            <a
              href={`tel:${WHATSAPP.replace(/[^0-9+]/g, "")}`}
              className="shrink-0 border-2 border-ink bg-white p-2.5 shadow-hard transition-transform hover:-translate-y-0.5"
              aria-label="Scanner pour appeler"
            >
              <QRCodeSVG value={`tel:${WHATSAPP.replace(/[^0-9+]/g, "")}`} size={104} bgColor="#ffffff" fgColor="#141010" level="M" />
            </a>
            <div>
              <div className="flex items-center gap-2 font-display text-xl font-black uppercase leading-none">
                <Phone size={18} /> Scanne pour appeler
              </div>
              <p className="mt-2 max-w-[16rem] font-body text-sm text-ink/70">
                Pointe ta caméra sur le code — on décroche direct.
              </p>
              <div className="mt-2 font-display text-lg font-black">{WHATSAPP}</div>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}

// ---------- FAQ ----------
function FaqSection() {
  return (
    <section className="bg-paper py-24 sm:py-28 grain">
      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6">
        <div className="mb-12 reveal">
          <Kicker index="02">Bon à savoir</Kicker>
          <h2 className="text-6xl sm:text-8xl">La <span className="text-grunge text-coral">FAQ</span>.</h2>
        </div>
        <div className="space-y-3">
          {FAQ.map((f, i) => (
            <details key={f.q} className="reveal group border-2 border-ink bg-linen shadow-hard" style={{ transform: `rotate(${i % 2 ? 0.4 : -0.4}deg)` }}>
              <summary className="flex cursor-pointer items-center justify-between gap-4 px-5 py-4 font-display text-xl font-black uppercase leading-tight [&::-webkit-details-marker]:hidden">
                {f.q}
                <span className="grid h-8 w-8 shrink-0 place-items-center border-2 border-ink bg-yellow text-lg font-black transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="border-t-2 border-ink/20 px-5 py-4 font-body text-ink/80">{f.a}</p>
            </details>
          ))}
        </div>
        <div className="mt-12 text-center reveal">
          <Link to="/stay" hash="book" className="inline-flex items-center gap-2 border-2 border-ink bg-yellow px-6 py-4 font-display text-lg font-black uppercase tracking-wider text-ink shadow-hard-lg hover:-translate-y-0.5 transition-transform">
            Réserve ton séjour →
          </Link>
        </div>
      </div>
    </section>
  );
}

function ContactPage() {
  return (
    <PageShell>
      <ContactHero />
      <PostcardSection />
      <ContactFormSection />
      <FaqSection />
    </PageShell>
  );
}
