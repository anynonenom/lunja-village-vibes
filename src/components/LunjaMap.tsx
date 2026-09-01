import { useState, type ComponentType } from "react";
import { TransformWrapper, TransformComponent, useControls } from "react-zoom-pan-pinch";
import {
  Minus,
  Plus,
  RotateCcw,
  X,
  LayoutGrid,
  Martini,
  Waves,
  Baby,
  BedDouble,
  Dumbbell,
  Car,
} from "lucide-react";
import mapImg from "@/assets/lunja-map.png";
import { KIND_LABEL, POIS, type Poi } from "@/data/lunja";

const KIND_COLOR: Record<Poi["kind"], string> = {
  hub: "bg-terra text-linen",
  stay: "bg-ink text-sun",
  water: "bg-[oklch(0.72_0.13_215)] text-ink",
  kids: "bg-[oklch(0.78_0.16_145)] text-ink",
  sport: "bg-[oklch(0.7_0.17_300)] text-linen",
  access: "bg-sun text-ink",
};

type IconType = ComponentType<{ className?: string; strokeWidth?: number }>;

const KIND_ICON: Record<Poi["kind"], IconType> = {
  hub: Martini,
  stay: BedDouble,
  water: Waves,
  kids: Baby,
  sport: Dumbbell,
  access: Car,
};

/** Legend-style square swatch matching the map's icon language. */
const KIND_SWATCH: Record<Poi["kind"] | "all", string> = {
  all: "bg-neutral-900 text-white",
  hub: "bg-[#1e9e5a] text-white",
  stay: "bg-neutral-900 text-white",
  water: "bg-[#1f9fe0] text-white",
  kids: "bg-[#7b3ff2] text-white",
  sport: "bg-[#7b3ff2] text-white",
  access: "bg-[#2f4bd6] text-white",
};

function Controls({ light }: { light?: boolean }) {
  const { zoomIn, zoomOut, resetTransform } = useControls();
  const btn = light
    ? "size-9 sm:size-11 grid place-items-center rounded-full bg-white text-neutral-800 border border-black/10 shadow-md active:scale-95 transition-transform"
    : "size-9 sm:size-11 grid place-items-center bg-ink text-sun ring-2 ring-sun/40 active:scale-95 transition-transform";
  return (
    <div className="absolute right-3 bottom-3 z-20 flex flex-col gap-2">
      <button type="button" aria-label="Zoom in" onClick={() => zoomIn()} className={btn}>
        <Plus className="size-5" />
      </button>
      <button type="button" aria-label="Zoom out" onClick={() => zoomOut()} className={btn}>
        <Minus className="size-5" />
      </button>
      <button type="button" aria-label="Reset map" onClick={() => resetTransform()} className={btn}>
        <RotateCcw className="size-5" />
      </button>
    </div>
  );
}

export function LunjaMap({
  light = false,
  heightClass = "!h-[42vh] sm:!h-[56vh]",
}: {
  light?: boolean;
  heightClass?: string;
}) {
  const [active, setActive] = useState<Poi | null>(null);
  const [filter, setFilter] = useState<Poi["kind"] | "all">("all");

  const kinds = Array.from(new Set(POIS.map((p) => p.kind)));
  const visible = POIS.filter((p) => filter === "all" || p.kind === filter);

  const chip = (on: boolean) =>
    light
      ? `shrink-0 inline-flex items-center gap-2 rounded-xl border px-2.5 py-1.5 transition-colors ${
          on ? "border-neutral-900 bg-neutral-900/[0.04] ring-2 ring-[#FFE600]" : "border-black/10 bg-white hover:border-black/30"
        }`
      : `shrink-0 inline-flex items-center gap-2 px-2.5 py-1.5 ring-2 ring-ink transition-colors ${
          on ? "bg-ink text-sun" : "bg-linen text-ink hover:bg-sun"
        }`;

  return (
    <div className="relative">
      {/* Filters */}
      <div className={`flex gap-2 overflow-x-auto no-scrollbar pb-3 ${light ? "justify-start lg:justify-center" : ""}`}>
        {(["all", ...kinds] as const).map((k) => {
          const on = filter === k;
          const Icon: IconType = k === "all" ? LayoutGrid : KIND_ICON[k as Poi["kind"]];
          return (
            <button
              key={k}
              type="button"
              onClick={() => setFilter(k as Poi["kind"] | "all")}
              className={chip(on)}
            >
              <span
                className={`grid size-6 shrink-0 place-items-center rounded-md ${KIND_SWATCH[k]}`}
              >
                <Icon className="size-3.5" strokeWidth={2.25} />
              </span>
              <span
                className={`font-display text-xs uppercase tracking-widest ${
                  light ? "text-neutral-800" : ""
                }`}
              >
                {k === "all" ? "Everything" : KIND_LABEL[k as Poi["kind"]]}
              </span>
            </button>
          );
        })}
      </div>

      <div
        className={
          light
            ? "relative overflow-hidden rounded-3xl border border-black/10 bg-[#e9e0cd] shadow-[0_24px_70px_-24px_rgba(0,0,0,0.3)]"
            : "relative overflow-hidden bg-ink ring-2 ring-ink shadow-[6px_6px_0_0_var(--terra)] sm:shadow-[10px_10px_0_0_var(--terra)]"
        }
      >
        <TransformWrapper
          minScale={1}
          maxScale={5}
          doubleClick={{ mode: "zoomIn", step: 0.8 }}
          wheel={{ step: 0.12 }}
          centerOnInit
        >
          <>
            <TransformComponent
              wrapperClass={`!w-full ${heightClass} cursor-grab active:cursor-grabbing`}
              contentClass="!w-full"
            >
              <div className="relative w-full">
                <img
                  src={mapImg}
                  alt="Illustrated site map of Lunja Village, Imi Ouaddar"
                  className="w-full select-none"
                  draggable={false}
                />
                {visible.map((p) => {
                  const on = active?.id === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setActive(p)}
                      aria-label={p.name}
                      style={{ left: `${p.x}%`, top: `${p.y}%` }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 group z-10"
                    >
                      <span
                        className={`relative grid place-items-center size-5 rounded-full font-display text-[11px] leading-none shadow-md transition-transform group-hover:scale-125 sm:size-7 sm:text-sm ${
                          light ? "ring-[1.5px] ring-white sm:ring-2" : "ring-[1.5px] ring-ink sm:ring-2"
                        } ${KIND_COLOR[p.kind]} ${on ? "scale-[1.35] z-20" : ""}`}
                      >
                        {p.n}
                        {on && <span className="absolute inset-0 rounded-full animate-pulse-ring" />}
                      </span>
                    </button>
                  );
                })}
              </div>
            </TransformComponent>
            <Controls light={light} />
          </>
        </TransformWrapper>

        <p
          className={
            light
              ? "absolute left-3 top-3 z-10 rounded-full bg-white/95 text-neutral-700 border border-black/10 shadow px-3 py-1 font-display text-xs tracking-wide"
              : "absolute left-3 top-3 z-10 bg-sun text-ink px-2 py-1 font-display uppercase text-xs tracking-widest ring-2 ring-ink"
          }
        >
          Pinch · drag · tap a number
        </p>
      </div>

      {/* Detail card — sits under the map so nothing on the map gets hidden */}
      {active && (
        <div
          className={
            light
              ? "relative mt-3 rounded-2xl border border-black/10 bg-white p-4 pr-12 text-neutral-800 shadow-sm"
              : "relative mt-3 border-2 border-ink bg-ink p-4 pr-12 text-linen"
          }
        >
          <button
            type="button"
            aria-label="Close"
            onClick={() => setActive(null)}
            className={`absolute right-3 top-3 grid size-8 place-items-center ${
              light ? "rounded-full bg-[#FFE600] text-neutral-900" : "bg-sun text-ink"
            }`}
          >
            <X className="size-4" />
          </button>
          <span
            className={
              light
                ? "inline-flex items-center gap-2 font-display text-xs uppercase tracking-widest text-neutral-400"
                : "font-script text-xl text-sun"
            }
          >
            {light && (
              <span className={`inline-grid size-6 place-items-center rounded-full text-[11px] ring-2 ring-white ${KIND_COLOR[active.kind]}`}>
                {active.n}
              </span>
            )}
            {KIND_LABEL[active.kind]} · 0{active.n}
          </span>
          <h3
            className={
              light
                ? "mt-1 font-display text-xl leading-tight tracking-tight sm:text-2xl"
                : "font-display uppercase text-2xl leading-none tracking-tight sm:text-3xl"
            }
          >
            {active.name}
          </h3>
          <p className={`mt-1.5 text-sm ${light ? "text-neutral-600" : "text-linen/75"}`}>{active.detail}</p>
        </div>
      )}
    </div>
  );
}
