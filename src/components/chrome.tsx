import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { Phone, Waves, Sparkles } from "lucide-react";

// ---------- Shared constants ----------
export const CHILLOUT_URL = "https://chill-vibes-studio.vercel.app";
export const IG_URL = "https://www.instagram.com/lunjavillage.officiel/";
export const IG_CHILLOUT = "https://www.instagram.com/chillout_taghazout/";
export const WHATSAPP = "+212 644 96 78 58";
export const EMAIL = "hello@lunjavillage.com";
export const ADDRESS = "Lunja Village, Imi Ouaddar · Taghazout Bay, Agadir, Maroc";

// ---------- Reveal-on-scroll ----------
export function useReveal() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
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
  }, [pathname]);
}

// ---------- Scroll progress bar ----------
export function ScrollProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const on = () => {
      const h = document.documentElement;
      const scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight);
      setP(Math.max(0, Math.min(1, scrolled || 0)));
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <div className="fixed inset-x-0 top-0 z-[70] h-1 bg-transparent">
      <div className="h-full bg-coral transition-[width] duration-100" style={{ width: `${p * 100}%` }} />
    </div>
  );
}

// ---------- Wave divider ----------
export function WaveDivider({ className = "", flip = false }: { className?: string; flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 1440 80"
      preserveAspectRatio="none"
      className={`block h-10 w-full sm:h-14 ${className}`}
      style={{ transform: flip ? "scaleY(-1)" : undefined }}
      aria-hidden
    >
      <path d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z" fill="currentColor" />
    </svg>
  );
}

// ---------- Marquee ----------
export function Marquee({
  items = ["Surf", "Sunset", "Pool Days", "Live Music", "Good Vibes", "Taghazout Bay", "Community", "World Cup 2030"],
  bg = "bg-yellow",
}: { items?: string[]; bg?: string }) {
  const full = [...items, ...items, ...items, ...items];
  return (
    <div className={`relative overflow-hidden border-y-2 border-ink py-4 ${bg}`}>
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

// ---------- Round "vibe village" stamp ----------
export function SinceStamp({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-float ${className}`} style={{ ["--r" as string]: "-8deg" }}>
      <svg viewBox="0 0 160 160" className="h-32 w-32">
        <defs>
          <path id="cir" d="M 80,80 m -60,0 a 60,60 0 1,1 120,0 a 60,60 0 1,1 -120,0" />
        </defs>
        <circle cx="80" cy="80" r="72" fill="#FFD400" stroke="#141010" strokeWidth="3" />
        <circle cx="80" cy="80" r="55" fill="none" stroke="#141010" strokeWidth="2" strokeDasharray="4 4" />
        <text fontFamily="Barlow Condensed" fontWeight="900" fontSize="13" fill="#141010" letterSpacing="2">
          <textPath href="#cir" startOffset="0">SINCE · TAGHAZOUT BAY · OPEN 7/7 · </textPath>
        </text>
        <text x="80" y="76" textAnchor="middle" fontFamily="Barlow Condensed" fontWeight="900" fontSize="26" fill="#141010">VIBE</text>
        <text x="80" y="100" textAnchor="middle" fontFamily="Barlow Condensed" fontWeight="900" fontSize="26" fill="#F25C2A">VILLAGE</text>
      </svg>
    </div>
  );
}

export function Badge({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <span
      className={`inline-flex items-center border-2 px-3 py-1.5 font-display text-xs font-bold uppercase tracking-widest backdrop-blur ${
        dark ? "border-linen/80 bg-ink/40 text-linen" : "border-ink bg-linen/70 text-ink"
      }`}
    >
      {children}
    </span>
  );
}

// ---------- Section kicker ("01 / …") ----------
export function Kicker({ index, children }: { index: string; children: ReactNode }) {
  return (
    <div className="mb-4 flex items-center gap-3 font-display text-sm font-bold uppercase tracking-[0.3em] text-muted-foreground">
      <span className="h-px w-10 bg-ink" /> {index} / {children}
    </div>
  );
}

// ---------- Form field ----------
export function Field({
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

// ---------- Nav (multi-page) ----------
const NAV: { to: string; label: string }[] = [
  { to: "/", label: "Village" },
  { to: "/stay", label: "Stay" },
  { to: "/experience", label: "Experience" },
  { to: "/contact", label: "Visit" },
];

export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const hash = useRouterState({ select: (s) => s.location.hash });
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 20);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);
  useEffect(() => setOpen(false), [pathname]);
  // On route change: jump to the hash target if there is one, else to the top of the page.
  // (Overrides router scrollRestoration so a fresh nav click never lands mid-page.)
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash);
      if (el) {
        requestAnimationFrame(() => el.scrollIntoView({ behavior: "smooth" }));
        return;
      }
    }
    window.scrollTo({ top: 0, left: 0 });
  }, [pathname, hash]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-1 z-50 transition-all ${
          scrolled ? "bg-linen/85 backdrop-blur-md border-b-2 border-ink/90" : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-baseline gap-1 font-display text-3xl font-black tracking-tight">
            LUNJA
            <span className="ml-1 inline-block -rotate-1 bg-yellow px-2 py-0.5 text-ink shadow-hard">VILLAGE</span>
          </Link>
          <nav className="hidden items-center gap-8 lg:flex">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                data-active={pathname === n.to}
                className="link-wipe font-display text-lg font-bold uppercase tracking-wide text-ink hover:text-coral"
              >
                {n.label}
              </Link>
            ))}
            <a
              href={CHILLOUT_URL}
              target="_blank"
              rel="noreferrer"
              className="link-wipe font-display text-lg font-bold uppercase tracking-wide text-ink hover:text-coral"
            >
              Chillout ↗
            </a>
          </nav>
          <Link
            to="/stay"
            hash="book"
            className="hidden lg:inline-flex items-center gap-2 border-2 border-ink bg-coral px-4 py-2 font-display text-sm font-black uppercase tracking-wider text-linen shadow-hard transition-transform hover:-translate-y-0.5"
          >
            Book your stay →
          </Link>
          <button
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="tap lg:hidden inline-flex h-11 w-11 items-center justify-center border-2 border-ink bg-linen shadow-hard"
            onClick={() => setOpen((v) => !v)}
          >
            <div className="relative h-4 w-6">
              <span className={`absolute left-0 block h-0.5 w-6 bg-ink transition-all duration-300 ${open ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0"}`} />
              <span className={`absolute left-0 top-1/2 block h-0.5 w-6 -translate-y-1/2 bg-ink transition-all duration-200 ${open ? "opacity-0" : "opacity-100"}`} />
              <span className={`absolute left-0 block h-0.5 w-6 bg-ink transition-all duration-300 ${open ? "top-1/2 -translate-y-1/2 -rotate-45" : "bottom-0"}`} />
            </div>
          </button>
        </div>
      </header>

      {/* Mobile menu — always mounted so open AND close animate */}
      <div
        className={`fixed inset-0 z-[80] grain bg-linen transition-[opacity,transform] duration-300 ease-out lg:hidden ${
          open ? "opacity-100 scale-100 pointer-events-auto" : "pointer-events-none opacity-0 scale-[0.98]"
        }`}
        aria-hidden={!open}
      >
        <div className="relative z-10 flex h-full flex-col p-6">
          <div className="flex items-center justify-between">
            <span className="font-display text-3xl font-black">LUNJA<span className="ml-1 bg-yellow px-2 text-ink">VILLAGE</span></span>
            <button
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="tap inline-flex h-11 w-11 items-center justify-center border-2 border-ink bg-yellow shadow-hard text-2xl font-black transition-transform hover:rotate-90"
            >
              ×
            </button>
          </div>
          <nav className="mt-14 flex flex-col gap-3">
            {NAV.map((n, i) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className={`font-display text-6xl font-black uppercase tracking-tight text-ink transition-colors hover:text-coral active:text-coral ${open ? "animate-menu-item" : "opacity-0"}`}
                style={{ ["--r" as string]: `${i % 2 ? 1 : -1}deg`, transform: `rotate(${i % 2 ? 1 : -1}deg)`, animationDelay: `${i * 70}ms` }}
              >
                {n.label}
              </Link>
            ))}
            <a
              href={CHILLOUT_URL}
              target="_blank"
              rel="noreferrer"
              className={`font-display text-6xl font-black uppercase tracking-tight text-coral active:opacity-70 ${open ? "animate-menu-item" : "opacity-0"}`}
              style={{ ["--r" as string]: "-1deg", transform: "rotate(-1deg)", animationDelay: `${NAV.length * 70}ms` }}
            >
              Chillout ↗
            </a>
          </nav>
          <Link
            to="/stay"
            hash="book"
            onClick={() => setOpen(false)}
            className={`tap mt-auto inline-flex items-center justify-center border-2 border-ink bg-coral px-6 py-4 font-display text-2xl font-black uppercase text-linen shadow-hard-lg ${open ? "animate-menu-item" : "opacity-0"}`}
            style={{ animationDelay: `${(NAV.length + 1) * 70}ms` }}
          >
            Réserve ton séjour →
          </Link>
        </div>
      </div>
    </>
  );
}

// ---------- Footer ----------
export function Footer() {
  return (
    <footer className="relative bg-linen border-t-2 border-ink grain">
      <div className="relative z-10 mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
        <div>
          <div className="font-display text-4xl font-black">
            LUNJA<span className="ml-1 inline-block bg-yellow px-2 text-ink">VILLAGE</span>
          </div>
          <p className="mt-3 max-w-xs font-body text-sm text-ink/80">
            Vibe village on the Atlantic coast — depuis Taghazout Bay, avec amour.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link to="/stay" className="tape !bg-teal !text-linen">Stay</Link>
            <Link to="/experience" className="tape">Experience</Link>
            <Link to="/contact" className="tape !bg-coral !text-linen">Visit</Link>
          </div>
        </div>
        <div>
          <h4 className="text-xl">Trouve-nous</h4>
          <p className="mt-3 text-sm text-ink/80">
            Lunja Village, Imi Ouaddar,
            <br /> Taghazout Bay · Agadir, Maroc
          </p>
          <p className="mt-2 flex items-center gap-1.5 text-sm text-ink/80"><Phone size={14} /> {WHATSAPP}</p>
          <p className="mt-2 text-sm text-ink/80">Ouvert 7/7 · Réception 24h</p>
        </div>
        <div>
          <h4 className="text-xl">Suis le village</h4>
          <div className="mt-3 flex flex-col gap-2">
            <a href={IG_URL} target="_blank" rel="noreferrer" className="link-wipe inline-block font-display text-sm font-bold uppercase tracking-wide">
              IG · @lunjavillage.officiel
            </a>
            <a href={IG_CHILLOUT} target="_blank" rel="noreferrer" className="link-wipe inline-block font-display text-sm font-bold uppercase tracking-wide">
              IG · @chillout_taghazout
            </a>
            <a href={CHILLOUT_URL} target="_blank" rel="noreferrer" className="link-wipe inline-block font-display text-sm font-bold uppercase tracking-wide text-coral">
              → Chillout Taghazout site
            </a>
          </div>
        </div>
        <div className="flex flex-col items-start gap-4">
          <SinceStamp />
          <Link
            to="/stay"
            hash="book"
            className="inline-flex items-center border-2 border-ink bg-coral px-4 py-3 font-display text-sm font-black uppercase text-linen shadow-hard"
          >
            Réserve →
          </Link>
        </div>
      </div>
      <div className="border-t-2 border-ink bg-yellow py-4">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 sm:px-6 font-display text-xs font-black uppercase tracking-widest text-ink">
          <span>© {new Date().getFullYear()} Lunja Village · Taghazout Bay</span>
          <span className="inline-flex items-center gap-1.5 font-script text-2xl normal-case tracking-normal">come for the surf, stay for the vibe <Waves size={18} /></span>
        </div>
      </div>
    </footer>
  );
}

// ---------- Page shell ----------
export function PageShell({ children }: { children: ReactNode }) {
  useReveal();
  return (
    <div className="min-h-screen bg-linen text-ink">
      <ScrollProgress />
      <Nav />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
