import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BriefcaseBusiness,
  Check,
  ChevronDown,
  CircleCheck,
  Clock3,
  FileCheck2,
  Images,
  Mail,
  MapPin,
  Pause,
  Play,
  PlayCircle,
  Quote,
  ShieldCheck,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import lunjaLogo from "@/assets/lunja-logo.png";
import hero from "@/assets/real-lunja-aerial.jpg";
import salma from "@/assets/drive-salma.jpg";
import youssef from "@/assets/drive-youssef.jpg";
import inas from "@/assets/drive-inas.jpg";
import mehdi from "@/assets/drive-mehdi.jpg";
import nadia from "@/assets/drive-nadia.jpg";
import amine from "@/assets/drive-amine.jpg";
import placementDinner from "@/assets/ph-dj.jpg";
import placementSurf from "@/assets/ph-surf.jpg";
import placementMarket from "@/assets/ph-market.jpg";
import placementParty from "@/assets/party.jpg";
import placementPool from "@/assets/hero-pool.jpg";
import placementYoga from "@/assets/yoga.jpg";

export const Route = createFileRoute("/lunja-drive")({
  head: () => ({
    meta: [
      { title: "Lunja Drive · Meet the team" },
      {
        name: "description",
        content: "A curated showcase of Lunja Village staff, skills, reels and hospitality placements for agency partners.",
      },
      { property: "og:title", content: "Lunja Drive · Meet the team" },
      {
        property: "og:description",
        content: "Meet the people, skills and placement experience behind Lunja Village.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LunjaDrivePage,
});

const categories = ["All", "Guest Experience", "Food & Beverage", "Operations", "Activities"] as const;
type Category = (typeof categories)[number];

type Staff = {
  id: string;
  name: string;
  role: string;
  department: Exclude<Category, "All">;
  image: string;
  intro: string;
  bio: string;
  skills: string[];
  languages: string;
  experience: string;
  placement: string;
  gallery: string[];
  tint: string;
};

const staff: Staff[] = [
  {
    id: "salma",
    name: "Salma El Idrissi",
    role: "Guest Experience Host",
    department: "Guest Experience",
    image: salma,
    intro: "The first hello, the local recommendation, and the calm answer when plans change.",
    bio: "Salma turns arrivals into welcomes. She is at her best coordinating groups, reading a room and making international guests feel immediately at home.",
    skills: ["Guest relations", "Group arrivals", "Local guidance"],
    languages: "Arabic · French · English",
    experience: "4 seasons",
    placement: "Atlantic Culture Week · 2025",
    gallery: [salma, placementMarket, placementPool],
    tint: "bg-coral",
  },
  {
    id: "youssef",
    name: "Youssef Aït Lahcen",
    role: "Head Chef",
    department: "Food & Beverage",
    image: youssef,
    intro: "A precise kitchen leader with a generous take on modern Moroccan food.",
    bio: "Youssef runs service with clarity and warmth. His menus bring local produce, fast-paced event delivery and thoughtful presentation together.",
    skills: ["Banqueting", "Menu design", "Team leadership"],
    languages: "Arabic · French · English",
    experience: "7 seasons",
    placement: "Coastal Table Series · 2025",
    gallery: [youssef, placementDinner, placementMarket],
    tint: "bg-teal",
  },
  {
    id: "inas",
    name: "Inas Berrada",
    role: "Surf & Activities Lead",
    department: "Activities",
    image: inas,
    intro: "Part coach, part connector — she gets every group moving together.",
    bio: "Inas leads surf sessions, wellbeing programming and large outdoor groups with equal confidence. Safety, energy and inclusion guide every session.",
    skills: ["Surf coaching", "Group facilitation", "First aid"],
    languages: "Arabic · French · English · Spanish",
    experience: "5 seasons",
    placement: "Taghazout Surf Exchange · 2024",
    gallery: [inas, placementSurf, placementYoga],
    tint: "bg-yellow",
  },
  {
    id: "mehdi",
    name: "Mehdi Amrani",
    role: "Operations Supervisor",
    department: "Operations",
    image: mehdi,
    intro: "The person who makes a complex village feel effortlessly well run.",
    bio: "Mehdi coordinates accommodation, transport and on-site crews. Partners value his eye for detail and steady decision-making under pressure.",
    skills: ["Site operations", "Logistics", "Quality control"],
    languages: "Arabic · French · English",
    experience: "6 seasons",
    placement: "Atlas Hospitality Forum · 2025",
    gallery: [mehdi, hero, placementPool],
    tint: "bg-teal-deep",
  },
  {
    id: "nadia",
    name: "Nadia Ouahbi",
    role: "F&B Team Lead",
    department: "Food & Beverage",
    image: nadia,
    intro: "Warm service, sharp standards, and an instinct for memorable moments.",
    bio: "Nadia leads bar and floor teams across relaxed pool days and high-volume events. She trains for both consistency and genuine personality.",
    skills: ["Bar service", "Floor management", "Team training"],
    languages: "Arabic · French · English",
    experience: "5 seasons",
    placement: "Sunset Sessions · 2025",
    gallery: [nadia, placementParty, placementDinner],
    tint: "bg-coral",
  },
  {
    id: "amine",
    name: "Amine El Fassi",
    role: "Events Host",
    department: "Activities",
    image: amine,
    intro: "An instinctive host who turns a schedule into a shared experience.",
    bio: "Amine moves easily between stage hosting, group coordination and guest care. His energy is natural, organised and never forced.",
    skills: ["Event hosting", "Programming", "Guest engagement"],
    languages: "Arabic · French · English",
    experience: "4 seasons",
    placement: "Lunja Summer Live · 2025",
    gallery: [amine, placementParty, placementPool],
    tint: "bg-yellow",
  },
];

const placements = [
  {
    title: "Atlantic Culture Week",
    meta: "Imi Ouaddar · May 2025 · 5 days",
    copy: "A 240-guest residency combining hospitality, cultural programming and nightly live events.",
    team: "18 Lunja team members",
    images: [placementParty, placementDinner, placementPool],
    label: "Festival hospitality",
  },
  {
    title: "Taghazout Surf Exchange",
    meta: "Taghazout Bay · October 2024 · 3 days",
    copy: "Guest arrivals, daily surf sessions and coastal excursions for an international agency group.",
    team: "12 Lunja team members",
    images: [placementSurf, inas, placementYoga],
    label: "Activities & groups",
  },
  {
    title: "Coastal Table Series",
    meta: "Lunja Village · August 2025 · 4 nights",
    copy: "Four open-air dinners delivered from menu planning to floor service for visiting creative teams.",
    team: "14 Lunja team members",
    images: [placementDinner, youssef, nadia],
    label: "Food & beverage",
  },
];

function Brand() {
  return (
    <span className="flex items-center gap-2.5">
      <span className="grid size-10 place-items-center overflow-hidden rounded-full border-2 border-ink bg-yellow sm:size-12">
        <img src={lunjaLogo} alt="" className="size-full object-cover" />
      </span>
      <span className="font-display text-2xl font-black uppercase leading-none sm:text-3xl">
        Lunja <span className="inline-block -rotate-1 bg-yellow px-1.5">Drive</span>
      </span>
    </span>
  );
}

function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b-2 border-ink bg-linen/95 backdrop-blur-md">
      <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/lunja-drive" aria-label="Lunja Drive home"><Brand /></Link>
        <nav className="hidden items-center gap-7 font-display text-sm font-bold uppercase md:flex" aria-label="Lunja Drive">
          <a href="#team" className="hover:text-coral">Team</a>
          <a href="#placements" className="hover:text-coral">Placements</a>
          <a href="#standards" className="hover:text-coral">Standards</a>
        </nav>
        <Button asChild className="h-10 rounded-none border-2 border-ink bg-ink px-3 font-display font-black uppercase text-linen shadow-hard hover:bg-coral sm:px-5">
          <Link to="/contact">Agency enquiry <ArrowUpRight /></Link>
        </Button>
      </div>
    </header>
  );
}

function Stamp() {
  return (
    <div className="grid size-28 rotate-6 place-items-center rounded-full border-[3px] border-ink bg-yellow text-center shadow-hard sm:size-32">
      <div className="font-display text-xs font-black uppercase leading-tight">
        <CircleCheck className="mx-auto mb-1 size-7" />
        Profiles<br />reviewed<br />2026
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="relative isolate min-h-[88svh] overflow-hidden bg-ink pt-[4.5rem] text-linen grain-dark">
      <img src={hero} alt="Aerial view of Lunja Village beside the Atlantic" width={1400} height={788} className="absolute inset-0 size-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/60 to-ink/15" />
      <div className="relative z-10 mx-auto flex min-h-[calc(88svh-4.5rem)] max-w-7xl items-end px-4 pb-14 pt-20 sm:px-6 sm:pb-20">
        <div className="max-w-5xl">
          <div className="mb-5 flex items-center gap-3 font-display text-sm font-bold uppercase tracking-[0.2em] text-yellow">
            <span className="h-px w-9 bg-yellow" /> Partner dossier · 2026
          </div>
          <h1 className="font-display text-[clamp(4rem,13vw,10.5rem)] font-black uppercase leading-[0.76]">
            Meet the people<br /><span className="text-grunge text-yellow">behind Lunja.</span>
          </h1>
          <div className="mt-7 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <p className="max-w-2xl text-base leading-relaxed text-linen/85 sm:text-xl">
              A verified, human view of the hospitality professionals who bring our village to life — and the work they have delivered together.
            </p>
            <a href="#team" className="inline-flex shrink-0 items-center justify-center gap-2 border-2 border-linen bg-yellow px-5 py-3 font-display text-base font-black uppercase text-ink shadow-hard transition-transform hover:-translate-y-1">
              Explore the team <ChevronDown className="size-5" />
            </a>
          </div>
        </div>
        <div className="absolute right-8 top-28 hidden lg:block"><Stamp /></div>
      </div>
    </section>
  );
}

function Standards() {
  const items = [
    { icon: ShieldCheck, title: "Identity checked", text: "Profiles maintained and reviewed by the Lunja team." },
    { icon: FileCheck2, title: "Work documented", text: "Roles, placements and media presented with context." },
    { icon: Users, title: "Team-first", text: "Real capabilities, working style and collaboration history." },
  ];
  return (
    <section id="standards" className="border-y-2 border-ink bg-yellow grain">
      <div className="relative z-10 mx-auto grid max-w-7xl md:grid-cols-3">
        {items.map(({ icon: Icon, title, text }, index) => (
          <div key={title} className={`flex gap-4 px-5 py-8 sm:px-8 ${index ? "border-t-2 border-ink md:border-l-2 md:border-t-0" : ""}`}>
            <Icon className="mt-1 size-8 shrink-0" strokeWidth={2.2} />
            <div><h2 className="text-2xl">{title}</h2><p className="mt-1 text-sm leading-relaxed text-ink/75">{text}</p></div>
          </div>
        ))}
      </div>
    </section>
  );
}

function StaffCard({ person, onOpen, index }: { person: Staff; onOpen: () => void; index: number }) {
  return (
    <article className={`group border-2 border-ink bg-paper shadow-hard transition-transform hover:-translate-y-1 ${index % 3 === 1 ? "lg:translate-y-7" : ""}`}>
      <button type="button" onClick={onOpen} className="relative block w-full overflow-hidden text-left" aria-label={`View ${person.name}'s profile`}>
        <img src={person.image} alt={`${person.name}, ${person.role}`} width={1024} height={1280} loading="lazy" className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
        <span className={`absolute left-3 top-3 border-2 border-ink px-2.5 py-1 font-display text-xs font-black uppercase ${person.tint} ${person.tint === "bg-teal-deep" ? "text-linen" : "text-ink"}`}>{person.department}</span>
        <span className="absolute bottom-3 right-3 grid size-12 place-items-center rounded-full border-2 border-ink bg-yellow shadow-hard transition-transform group-hover:scale-110"><Play className="ml-0.5 size-5 fill-current" /></span>
      </button>
      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div><h3 className="text-3xl leading-none">{person.name}</h3><p className="mt-1 font-script text-xl text-coral">{person.role}</p></div>
          <CircleCheck className="size-6 shrink-0 text-teal" aria-label="Profile reviewed" />
        </div>
        <p className="mt-4 min-h-16 text-sm leading-relaxed text-ink/70">{person.intro}</p>
        <div className="mt-5 flex items-center justify-between border-t-2 border-ink/15 pt-4 font-display text-xs font-bold uppercase">
          <span>{person.experience}</span><span className="inline-flex items-center gap-1 text-coral">Open profile <ArrowUpRight className="size-4" /></span>
        </div>
      </div>
    </article>
  );
}

function Team({ onOpen }: { onOpen: (person: Staff) => void }) {
  const [category, setCategory] = useState<Category>("All");
  const filtered = useMemo(() => category === "All" ? staff : staff.filter((person) => person.department === category), [category]);
  return (
    <section id="team" className="scroll-mt-20 bg-linen py-20 grain sm:py-28">
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid items-end gap-7 lg:grid-cols-[1fr_0.65fr]">
          <div>
            <span className="font-script text-3xl text-coral">the people file</span>
            <h2 className="mt-1 text-[clamp(3.5rem,9vw,7.5rem)] leading-[0.82]">One village.<br /><span className="text-grunge text-teal">Many talents.</span></h2>
          </div>
          <p className="max-w-lg text-base leading-relaxed text-ink/70">Browse by department, then open any profile for work history, skills and a quick reel. Every profile is structured for fast agency review.</p>
        </div>
        <div className="no-scrollbar mt-10 flex gap-2 overflow-x-auto pb-2" role="group" aria-label="Filter staff by department">
          {categories.map((item) => (
            <Button key={item} type="button" onClick={() => setCategory(item)} variant={category === item ? "default" : "outline"} className={`h-11 shrink-0 rounded-none border-2 border-ink px-4 font-display text-sm font-black uppercase shadow-none ${category === item ? "bg-ink text-linen hover:bg-coral" : "bg-transparent hover:bg-yellow"}`}>
              {item} {item === "All" && <span className="opacity-55">{staff.length}</span>}
            </Button>
          ))}
        </div>
        <div className="mt-9 grid gap-7 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8 lg:pb-7">
          {filtered.map((person, index) => <StaffCard key={person.id} person={person} index={index} onOpen={() => onOpen(person)} />)}
        </div>
      </div>
    </section>
  );
}

function Reel({ person }: { person: Staff }) {
  const [playing, setPlaying] = useState(false);
  return (
    <div className="relative overflow-hidden border-2 border-ink bg-ink">
      <img src={person.gallery[1]} alt={`${person.name} at work`} className={`aspect-video w-full object-cover opacity-75 transition-transform duration-[5s] ${playing ? "scale-110" : "scale-100"}`} />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
      <Button type="button" size="icon" aria-label={playing ? "Pause reel" : "Play reel"} onClick={() => setPlaying((value) => !value)} className="absolute left-1/2 top-1/2 size-16 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-linen bg-yellow text-ink hover:bg-coral">
        {playing ? <Pause className="size-6 fill-current" /> : <Play className="ml-1 size-6 fill-current" />}
      </Button>
      <div className="absolute inset-x-4 bottom-3 flex items-center gap-3 font-display text-xs font-bold uppercase text-linen">
        <span>Profile reel · 00:{playing ? "12" : "00"}</span><span className="h-1 flex-1 bg-linen/30"><span className={`block h-full bg-yellow ${playing ? "w-2/3 transition-[width] duration-[5s]" : "w-0"}`} /></span>
      </div>
    </div>
  );
}

function ProfileModal({ person, onClose }: { person: Staff; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = old; window.removeEventListener("keydown", onKey); };
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-ink/90 p-3 backdrop-blur-sm sm:p-6" role="dialog" aria-modal="true" aria-label={`${person.name} profile`} onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="mx-auto my-3 max-w-6xl border-2 border-ink bg-linen shadow-hard-lg sm:my-8">
        <div className="flex items-center justify-between border-b-2 border-ink bg-yellow px-4 py-3">
          <span className="font-display text-sm font-black uppercase">Verified staff profile · {person.id.toUpperCase()}–26</span>
          <Button ref={closeRef} type="button" size="icon" aria-label="Close profile" onClick={onClose} className="rounded-none border-2 border-ink bg-linen text-ink hover:bg-coral"><X /></Button>
        </div>
        <div className="grid lg:grid-cols-[0.8fr_1.2fr]">
          <div className="relative border-b-2 border-ink lg:border-b-0 lg:border-r-2">
            <img src={person.image} alt={`${person.name}, ${person.role}`} width={1024} height={1280} className="h-full min-h-[28rem] w-full object-cover" />
            <span className="tape absolute bottom-5 left-5">{person.department}</span>
          </div>
          <div className="p-5 sm:p-8 lg:p-10">
            <span className="font-script text-2xl text-coral">meet {person.name.split(" ")[0].toLowerCase()}</span>
            <h2 className="mt-1 text-5xl leading-[0.9] sm:text-7xl">{person.name}</h2>
            <p className="mt-2 font-display text-xl font-bold uppercase text-teal">{person.role}</p>
            <p className="mt-5 max-w-2xl leading-relaxed text-ink/75">{person.bio}</p>
            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              <div className="border-2 border-ink p-3"><Clock3 className="size-5 text-coral" /><span className="mt-2 block font-display text-xs font-bold uppercase text-ink/50">Experience</span><strong className="font-display text-lg uppercase">{person.experience}</strong></div>
              <div className="border-2 border-ink p-3 sm:col-span-2"><BriefcaseBusiness className="size-5 text-coral" /><span className="mt-2 block font-display text-xs font-bold uppercase text-ink/50">Latest placement</span><strong className="font-display text-lg uppercase">{person.placement}</strong></div>
            </div>
            <div className="mt-7"><Reel person={person} /></div>
            <div className="mt-7 grid gap-6 sm:grid-cols-2">
              <div><h3 className="text-lg">Core skills</h3><ul className="mt-2 space-y-1.5">{person.skills.map((skill) => <li key={skill} className="flex items-center gap-2 text-sm"><Check className="size-4 text-teal" />{skill}</li>)}</ul></div>
              <div><h3 className="text-lg">Languages</h3><p className="mt-2 text-sm text-ink/70">{person.languages}</p><div className="mt-4 inline-flex items-center gap-2 bg-teal px-3 py-2 font-display text-xs font-black uppercase text-linen"><CircleCheck className="size-4" /> Documentation complete</div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PlacementCarousel({ images, title }: { images: string[]; title: string }) {
  const [index, setIndex] = useState(0);
  const go = useCallback((step: number) => setIndex((value) => (value + step + images.length) % images.length), [images.length]);
  return (
    <div className="relative overflow-hidden border-2 border-ink bg-ink">
      <img src={images[index]} alt={`${title}, image ${index + 1}`} loading="lazy" className="aspect-[4/3] w-full object-cover" />
      <div className="absolute inset-x-3 bottom-3 flex items-center justify-between">
        <span className="bg-ink px-2 py-1 font-display text-xs font-black uppercase text-linen">{String(index + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}</span>
        <div className="flex gap-2">
          <Button type="button" size="icon" aria-label="Previous image" onClick={() => go(-1)} className="rounded-none border-2 border-ink bg-linen text-ink hover:bg-yellow"><ArrowLeft /></Button>
          <Button type="button" size="icon" aria-label="Next image" onClick={() => go(1)} className="rounded-none border-2 border-ink bg-yellow text-ink hover:bg-coral"><ArrowRight /></Button>
        </div>
      </div>
    </div>
  );
}

function Placements() {
  return (
    <section id="placements" className="scroll-mt-20 bg-teal-deep py-20 text-linen grain-dark sm:py-28">
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid items-end gap-6 lg:grid-cols-[1fr_0.65fr]">
          <div><span className="font-script text-3xl text-yellow">proof in practice</span><h2 className="mt-1 text-[clamp(3.5rem,9vw,7.5rem)] leading-[0.82]">Selected<br /><span className="text-grunge text-yellow">placements.</span></h2></div>
          <p className="max-w-lg text-base leading-relaxed text-linen/70">A closer look at the settings, scale and responsibilities our teams have taken on together.</p>
        </div>
        <div className="mt-12 space-y-14 sm:mt-16 sm:space-y-20">
          {placements.map((placement, index) => (
            <article key={placement.title} className="grid items-center gap-7 lg:grid-cols-2 lg:gap-14">
              <div className={index % 2 ? "lg:order-2" : ""}><PlacementCarousel images={placement.images} title={placement.title} /></div>
              <div className={index % 2 ? "lg:order-1" : ""}>
                <span className="inline-block -rotate-2 bg-yellow px-3 py-1 font-display text-xs font-black uppercase text-ink">{placement.label}</span>
                <h3 className="mt-5 text-4xl leading-none sm:text-6xl">{placement.title}</h3>
                <p className="mt-3 flex items-center gap-2 font-display text-sm font-bold uppercase text-yellow"><MapPin className="size-4" />{placement.meta}</p>
                <p className="mt-5 max-w-xl text-base leading-relaxed text-linen/75">{placement.copy}</p>
                <div className="mt-6 flex items-center gap-3 border-t border-linen/20 pt-5 font-display text-sm font-bold uppercase"><Users className="size-5 text-yellow" />{placement.team}<span className="ml-auto inline-flex items-center gap-1 text-linen/60"><Images className="size-4" /> Media reviewed</span></div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Closing() {
  return (
    <section className="bg-coral py-20 grain sm:py-28">
      <div className="relative z-10 mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <Quote className="size-12 text-yellow" />
          <h2 className="mt-5 max-w-5xl text-[clamp(3.5rem,10vw,8.5rem)] leading-[0.78] text-linen">The right people<br /><span className="text-grunge text-yellow">change everything.</span></h2>
          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-linen/85">Planning a placement, partnership or agency visit? Tell us what you need and we’ll introduce the team behind the work.</p>
        </div>
        <div className="flex flex-col gap-3">
          <Button asChild className="h-14 rounded-none border-2 border-ink bg-yellow px-6 font-display text-lg font-black uppercase text-ink shadow-hard hover:bg-linen"><Link to="/contact">Start a conversation <ArrowUpRight /></Link></Button>
          <a href="mailto:hello@lunjavillage.com" className="inline-flex h-14 items-center justify-center gap-2 border-2 border-linen px-6 font-display text-base font-black uppercase text-linen hover:bg-linen hover:text-ink"><Mail className="size-5" /> Email Lunja</a>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t-2 border-ink bg-ink py-8 text-linen">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <Brand />
        <p className="max-w-md text-sm text-linen/60">A curated people and placement portfolio from Lunja Village, Imi Ouaddar.</p>
        <Link to="/lunja-map" className="font-display text-sm font-black uppercase text-yellow hover:text-coral">Visit the village <ArrowUpRight className="inline size-4" /></Link>
      </div>
    </footer>
  );
}

function LunjaDrivePage() {
  const [selected, setSelected] = useState<Staff | null>(null);
  const close = useCallback(() => setSelected(null), []);
  return (
    <div className="min-h-screen overflow-x-hidden bg-linen text-ink">
      <Header /><main><Hero /><Standards /><Team onOpen={setSelected} /><Placements /><Closing /></main><Footer />
      {selected && <ProfileModal person={selected} onClose={close} />}
    </div>
  );
}