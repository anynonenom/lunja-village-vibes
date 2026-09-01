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

function Controls() {
  const { zoomIn, zoomOut, resetTransform } = useControls();
  const btn =
    "size-11 grid place-items-center bg-ink text-sun ring-2 ring-sun/40 active:scale-95 transition-transform";
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

export function LunjaMap() {
  const [active, setActive] = useState<Poi | null>(null);
  const [filter, setFilter] = useState<Poi["kind"] | "all">("all");

  const kinds = Array.from(new Set(POIS.map((p) => p.kind)));
  const visible = POIS.filter((p) => filter === "all" || p.kind === filter);

  return (
    <div className="relative">
      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-3">
        {(["all", ...kinds] as const).map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setFilter(k as Poi["kind"] | "all")}
            className={`shrink-0 px-3 py-1.5 font-display uppercase text-sm tracking-widest ring-2 ring-ink transition-colors ${
              filter === k ? "bg-ink text-sun" : "bg-linen text-ink hover:bg-sun"
            }`}
          >
            {k === "all" ? "Everything" : KIND_LABEL[k as Poi["kind"]]}
          </button>
        ))}
      </div>

      <div className="relative overflow-hidden bg-ink ring-2 ring-ink shadow-[10px_10px_0_0_var(--terra)]">
        <TransformWrapper
          minScale={1}
          maxScale={5}
          doubleClick={{ mode: "zoomIn", step: 0.8 }}
          wheel={{ step: 0.12 }}
          centerOnInit
        >
          <>
            <TransformComponent
              wrapperClass="!w-full !h-[62vh] sm:!h-[70vh] cursor-grab active:cursor-grabbing"
              contentClass="!w-full"
            >
              <div className="relative w-full">
                <img
                  src={mapImg}
                  alt="Illustrated site map of Lunja Village, Imi Ouaddar"
                  className="w-full select-none"
                  draggable={false}
                />
                {visible.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setActive(p)}
                    aria-label={p.name}
                    style={{ left: `${p.x}%`, top: `${p.y}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 group"
                  >
                    <span
                      className={`relative grid place-items-center size-7 rounded-full font-display text-sm ring-2 ring-ink shadow-lg transition-transform group-hover:scale-125 ${
                        KIND_COLOR[p.kind]
                      } ${active?.id === p.id ? "scale-125" : ""}`}
                    >
                      {p.n}
                      <span className="absolute inset-0 rounded-full animate-pulse-ring" />
                    </span>
                  </button>
                ))}
              </div>
            </TransformComponent>
            <Controls />
          </>
        </TransformWrapper>

        <p className="absolute left-3 top-3 z-10 bg-sun text-ink px-2 py-1 font-display uppercase text-xs tracking-widest ring-2 ring-ink">
          Pinch · drag · tap a number
        </p>

        {/* Detail sheet */}
        <div
          className={`absolute inset-x-0 bottom-0 z-30 transition-transform duration-500 ${
            active ? "translate-y-0" : "translate-y-full"
          }`}
        >
          {active && (
            <div className="bg-ink text-linen border-t-4 border-sun p-5 pr-14 relative">
              <button
                type="button"
                aria-label="Close"
                onClick={() => setActive(null)}
                className="absolute top-4 right-4 size-9 grid place-items-center bg-sun text-ink"
              >
                <X className="size-5" />
              </button>
              <span className="font-script text-xl text-sun">{KIND_LABEL[active.kind]} · 0{active.n}</span>
              <h3 className="font-display uppercase text-3xl leading-none tracking-tight">{active.name}</h3>
              <p className="mt-2 text-sm text-linen/75">{active.detail}</p>
            </div>
          )}
        </div>
      </div>

      {/* Legend list */}
      <ul className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2">
        {visible.map((p) => (
          <li key={p.id}>
            <button
              type="button"
              onClick={() => setActive(p)}
              className="w-full text-left flex items-center gap-3 bg-linen ring-2 ring-ink px-3 py-2 hover:bg-sun transition-colors"
            >
              <span className={`shrink-0 grid place-items-center size-7 rounded-full font-display text-sm ring-2 ring-ink ${KIND_COLOR[p.kind]}`}>
                {p.n}
              </span>
              <span className="min-w-0">
                <span className="block font-display uppercase tracking-wide leading-none">{p.name}</span>
                <span className="block text-xs text-ink/60 truncate">{p.blurb}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
