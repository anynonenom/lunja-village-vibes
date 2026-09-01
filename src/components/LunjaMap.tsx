import { useState } from "react";
import { TransformWrapper, TransformComponent, useControls } from "react-zoom-pan-pinch";
import { Minus, Plus, RotateCcw, X } from "lucide-react";
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
  const [showList, setShowList] = useState(false);

  const kinds = Array.from(new Set(POIS.map((p) => p.kind)));
  const visible = POIS.filter((p) => filter === "all" || p.kind === filter);

  const chip = (on: boolean) =>
    light
      ? `shrink-0 rounded-full px-4 py-1.5 font-display text-sm tracking-wide border transition-colors ${
          on ? "bg-[#FFE600] text-neutral-900 border-transparent" : "bg-white text-neutral-500 border-black/15 hover:border-black/40"
        }`
      : `shrink-0 px-3 py-1.5 font-display uppercase text-sm tracking-widest ring-2 ring-ink transition-colors ${
          on ? "bg-ink text-sun" : "bg-linen text-ink hover:bg-sun"
        }`;

  return (
    <div className="relative">
      {/* Filters */}
      <div className={`flex gap-2 overflow-x-auto no-scrollbar pb-3 ${light ? "justify-start sm:justify-center" : ""}`}>
        {(["all", ...kinds] as const).map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setFilter(k as Poi["kind"] | "all")}
            className={chip(filter === k)}
          >
            {k === "all" ? "Everything" : KIND_LABEL[k as Poi["kind"]]}
          </button>
        ))}
      </div>

      <div
        className={
          light
            ? "relative overflow-hidden rounded-3xl border border-black/10 bg-neutral-100 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.25)]"
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

      {/* Legend list — collapsed by default so the section stays short on mobile */}
      <button
        type="button"
        onClick={() => setShowList((v) => !v)}
        aria-expanded={showList}
        className={
          light
            ? "mt-4 w-full flex items-center justify-center gap-2 rounded-full border border-black/15 bg-white text-neutral-700 px-4 py-2.5 font-display text-sm tracking-wide hover:border-black/40 transition-colors"
            : "mt-4 w-full flex items-center justify-between bg-ink text-sun ring-2 ring-ink px-3 py-2 font-display uppercase text-sm tracking-widest hover:bg-terra hover:text-linen transition-colors"
        }
      >
        {showList ? "Hide the list" : `Browse all ${visible.length} spots as a list`}
        <span className={`transition-transform ${showList ? "rotate-180" : ""}`}>▾</span>
      </button>

      {showList && (
        <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
          {visible.map((p) => (
            <li key={p.id}>
              <button
                type="button"
                onClick={() => setActive(p)}
                className={
                  light
                    ? "w-full text-left flex items-center gap-3 rounded-2xl border border-black/10 bg-white px-3 py-2.5 hover:border-black/30 transition-colors"
                    : "w-full text-left flex items-center gap-3 bg-linen ring-2 ring-ink px-3 py-2 hover:bg-sun transition-colors"
                }
              >
                <span
                  className={`shrink-0 grid place-items-center size-7 rounded-full font-display text-sm ${
                    light ? "ring-2 ring-white" : "ring-2 ring-ink"
                  } ${KIND_COLOR[p.kind]}`}
                >
                  {p.n}
                </span>
                <span className="min-w-0">
                  <span
                    className={`block font-display tracking-wide leading-none ${
                      light ? "text-neutral-900" : "uppercase"
                    }`}
                  >
                    {p.name}
                  </span>
                  <span className={`block text-xs truncate ${light ? "text-neutral-500" : "text-ink/60"}`}>{p.blurb}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
