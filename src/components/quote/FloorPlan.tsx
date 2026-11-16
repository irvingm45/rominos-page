"use client";

import { inflatables } from "@/data/pricing";
import type { QuoteState } from "@/lib/quote";

// Illustrative, not-to-scale plan of the venue. Two layouts: wide (desktop) and tall (phone),
// so tables stay legible at both sizes. Geometry is in each layout's own SVG units.

type Pt = readonly [number, number];
type Rect = { x: number; y: number; w: number; h: number };

interface Geometry {
  vb: readonly [number, number];
  salon: Rect;
  kitchen: Rect;
  opening: readonly [number, number, number, number];
  pillars: Pt[];
  garden: Rect;
  hedge: Rect;
  play: Rect;
  labels: { salon: Pt; kitchen: Pt; garden: Pt; play: Pt; playText: string };
  playIcons: { at: Pt; scale: number };
  /** Table radius, chair ring radius and chair radius, in this layout's units. */
  table: { r: number; ring: number; chair: number };
  slots: Pt[];
  inflatableSlots: Pt[];
  deco: { head: Pt; corners: Pt[]; garden: Pt[]; lights: string[] };
}

function slotsFor(cols: number[], rows: number[], kitchen: Rect, centre: Pt, foot: number): Pt[] {
  const out: Pt[] = [];
  for (const y of rows)
    for (const x of cols) {
      const hitsKitchen = x - foot < kitchen.x + kitchen.w && y - foot < kitchen.y + kitchen.h;
      if (!hitsKitchen) out.push([x, y]);
    }
  // Fill from the middle of the hall outwards, like a real setup.
  return out.sort((a, b) => Math.hypot(a[0] - centre[0], (a[1] - centre[1]) * 1.25) - Math.hypot(b[0] - centre[0], (b[1] - centre[1]) * 1.25));
}

const WIDE: Geometry = (() => {
  const kitchen = { x: 8, y: 8, w: 86, h: 60 };
  return {
    vb: [640, 340],
    salon: { x: 8, y: 8, w: 404, h: 324 },
    kitchen,
    opening: [412, 12, 412, 328],
    pillars: [[184, 118], [288, 118], [184, 222], [288, 222]],
    garden: { x: 426, y: 8, w: 206, h: 186 },
    hedge: { x: 426, y: 198, w: 206, h: 6 },
    play: { x: 426, y: 212, w: 206, h: 120 },
    labels: { salon: [18, 323], kitchen: [51, 42], garden: [436, 26], play: [436, 230], playText: "Área de juegos" },
    playIcons: { at: [438, 252], scale: 1 },
    table: { r: 14, ring: 20.5, chair: 3.3 },
    // The hall first, centre outwards; very large events spill into the garden.
    slots: [
      ...slotsFor([54, 106, 158, 210, 262, 314, 366], [40, 92, 144, 196, 248, 300], kitchen, [210, 170], 25),
      ...[58, 110].flatMap((y) => [451, 503, 555, 606].map((x) => [x, y] as const)),
    ],
    inflatableSlots: [[446, 146], [494, 146], [542, 146], [590, 146]],
    deco: {
      head: [218, 14],
      corners: [[404, 16], [404, 324], [102, 16]],
      garden: [[626, 14], [432, 188]],
      lights: [60, 150, 240].map((y) => `M14 ${y} Q 210 ${y + 18} 406 ${y}`),
    },
  };
})();

const TALL: Geometry = (() => {
  const kitchen = { x: 8, y: 8, w: 80, h: 52 };
  return {
    vb: [360, 470],
    salon: { x: 8, y: 8, w: 344, h: 292 },
    kitchen,
    opening: [12, 300, 348, 300],
    pillars: [[156, 110], [244, 110], [156, 198], [244, 198]],
    garden: { x: 8, y: 312, w: 226, h: 150 },
    hedge: { x: 236, y: 312, w: 6, h: 150 },
    play: { x: 248, y: 312, w: 104, h: 150 },
    labels: { salon: [16, 292], kitchen: [48, 38], garden: [18, 330], play: [256, 330], playText: "Juegos" },
    playIcons: { at: [256, 352], scale: 0.6 },
    table: { r: 11.5, ring: 17, chair: 2.8 },
    slots: slotsFor([46, 90, 134, 178, 222, 266, 310], [44, 88, 132, 176, 220, 264], kitchen, [180, 160], 21),
    inflatableSlots: [[20, 410], [62, 410], [104, 410], [146, 410]],
    deco: {
      head: [180, 14],
      corners: [[344, 16], [344, 292], [96, 16]],
      garden: [[126, 318], [16, 452]],
      lights: [70, 150, 230].map((y) => `M14 ${y} Q 180 ${y + 16} 346 ${y}`),
    },
  };
})();

const PALETTE = {
  elegant: ["#c89b6a", "#ffffff", "#e7b3a8", "#a9bd98"],
  kids: ["#e2557a", "#2bb3b1", "#f2c230", "#5b8def"],
};

// Small seeded generator so the server and the browser draw the same balloons.
function seeded(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function Cluster({ at, count, spread, colors, seed }: { at: Pt; count: number; spread: number; colors: string[]; seed: number }) {
  const rnd = seeded(seed);
  return (
    <g className="plan-pop">
      {Array.from({ length: count }, (_, i) => {
        const a = rnd() * Math.PI * 2;
        const d = Math.sqrt(rnd()) * spread;
        return (
          <circle
            key={i}
            cx={(at[0] + Math.cos(a) * d).toFixed(1)}
            cy={(at[1] + Math.sin(a) * d).toFixed(1)}
            r={(2.4 + rnd() * 2.6).toFixed(1)}
            fill={colors[i % colors.length]}
            stroke="#1e1d1b"
            strokeOpacity={0.18}
            strokeWidth={0.6}
          />
        );
      })}
    </g>
  );
}

function PlayIcons({ at, scale }: { at: Pt; scale: number }) {
  return (
    <g transform={`translate(${at[0]} ${at[1]}) scale(${scale})`} aria-hidden="true">
      {/* slide tower */}
      <rect x={0} y={4} width={20} height={22} rx={2} fill="#2bb3b1" />
      <path d="M20 8 C 32 8, 32 26, 46 26" stroke="#e2557a" strokeWidth={5} fill="none" strokeLinecap="round" />
      {/* little house */}
      <rect x={56} y={12} width={20} height={14} fill="#f2c230" />
      <path d="M53 13 L66 2 L79 13 Z" fill="#e2557a" />
      {/* tube frame */}
      <rect x={90} y={0} width={26} height={26} fill="none" stroke="#5aa13b" strokeWidth={3} />
      <path d="M90 13h26" stroke="#e2557a" strokeWidth={3} />
      {/* trampoline */}
      <ellipse cx={142} cy={18} rx={16} ry={8} fill="#1e1d1b" opacity={0.85} />
    </g>
  );
}

function InflatableIcon({ id, at }: { id: string; at: Pt }) {
  return (
    <g transform={`translate(${at[0]} ${at[1]})`}>
      <InflatableShape id={id} />
    </g>
  );
}

function InflatableShape({ id }: { id: string }) {
  if (id === "brincolin-blanco")
    return (
      <g className="plan-pop">
        <rect x={0} y={4} width={34} height={26} rx={3} fill="#ffffff" stroke="#b9b1a4" strokeWidth={1} />
        <rect x={9} y={0} width={5} height={30} rx={2.5} fill="#f4f1ec" stroke="#b9b1a4" strokeWidth={0.8} />
        <rect x={20} y={0} width={5} height={30} rx={2.5} fill="#f4f1ec" stroke="#b9b1a4" strokeWidth={0.8} />
      </g>
    );
  if (id === "castillo")
    return (
      <g className="plan-pop">
        <rect x={0} y={7} width={34} height={23} rx={3} fill="#e2557a" />
        {[0, 13, 26].map((t) => <rect key={t} x={t} y={0} width={8} height={10} rx={2} fill="#e2557a" />)}
        <rect x={13} y={16} width={8} height={14} rx={4} fill="#fbe3ea" />
      </g>
    );
  if (id === "resbaladilla")
    return (
      <g className="plan-pop">
        <rect x={0} y={2} width={16} height={28} rx={3} fill="#2a86d1" />
        <path d="M15 5 L34 30 L15 30 Z" fill="#5fb0ec" />
      </g>
    );
  return (
    <g className="plan-pop">
      <rect x={0} y={2} width={34} height={28} rx={4} fill="#ac825c" />
    </g>
  );
}

function Plan({ g, state, className }: { g: Geometry; state: QuoteState; className: string }) {
  const tables = Math.min(state.tables, g.slots.length);
  const base = tables ? Math.floor(state.chairs / tables) : 0;
  const extra = tables ? state.chairs % tables : 0;
  const deco = state.decoration;
  const colors = PALETTE[state.eventType === "infantil" ? "kids" : "elegant"];
  const centrepieces = deco === "media" || deco === "premium";
  const chosen = inflatables.filter((i) => state.inflatables.includes(i.id)).slice(0, g.inflatableSlots.length);
  const t = (p: Pt, text: string, opts: { anchor?: "middle"; fill?: string; size?: number; weight?: number } = {}) => (
    <text x={p[0]} y={p[1]} textAnchor={opts.anchor} fontSize={opts.size ?? 11} fontWeight={opts.weight ?? 600} fill={opts.fill ?? "#64625e"} fontFamily="var(--font-sans), sans-serif">
      {text}
    </text>
  );

  return (
    <svg viewBox={`0 0 ${g.vb[0]} ${g.vb[1]}`} className={className} aria-hidden="true">
      <defs>
        <pattern id={`tile-${g.vb[0]}`} width={12} height={12} patternUnits="userSpaceOnUse">
          <rect width={12} height={12} fill="#f6f2ec" />
          <path d="M12 0H0V12" fill="none" stroke="#e5ddd1" strokeWidth={0.8} />
        </pattern>
      </defs>

      {/* Hall, kitchen, pillars, the curtains that open to the garden */}
      <rect x={g.salon.x} y={g.salon.y} width={g.salon.w} height={g.salon.h} fill={`url(#tile-${g.vb[0]})`} stroke="#1e1d1b" strokeWidth={3} />
      <line x1={g.opening[0]} y1={g.opening[1]} x2={g.opening[2]} y2={g.opening[3]} stroke="#f6f2ec" strokeWidth={4} />
      <line x1={g.opening[0]} y1={g.opening[1]} x2={g.opening[2]} y2={g.opening[3]} stroke="#1e1d1b" strokeWidth={2} strokeDasharray="7 5" />
      <rect x={g.kitchen.x} y={g.kitchen.y} width={g.kitchen.w} height={g.kitchen.h} fill="#e5dccd" stroke="#1e1d1b" strokeWidth={1.5} />
      {t(g.labels.kitchen, "Cocina", { anchor: "middle", fill: "#1e1d1b" })}
      {g.pillars.map(([x, y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r={4.5} fill="#ffffff" stroke="#1e1d1b" strokeWidth={1.5} />)}
      {t(g.labels.salon, "Salón techado", { size: 10 })}

      {/* Garden and play area */}
      <rect x={g.garden.x} y={g.garden.y} width={g.garden.w} height={g.garden.h} fill="#8fae70" />
      <rect x={g.hedge.x} y={g.hedge.y} width={g.hedge.w} height={g.hedge.h} rx={3} fill="#4f7a39" />
      <rect x={g.play.x} y={g.play.y} width={g.play.w} height={g.play.h} fill="#a7c58a" />
      {t(g.labels.garden, "Jardín", { fill: "#ffffff", size: 11, weight: 700 })}
      {t(g.labels.play, g.labels.playText, { fill: "#ffffff", size: 11, weight: 700 })}
      <PlayIcons at={g.playIcons.at} scale={g.playIcons.scale} />

      {/* Decoration */}
      {deco && (
        <g>
          <Cluster at={g.deco.head} count={14} spread={11} colors={colors} seed={1} />
          {(deco === "media" || deco === "premium") &&
            g.deco.corners.map((p, i) => <Cluster key={i} at={p} count={9} spread={8} colors={colors} seed={10 + i} />)}
          {deco === "premium" && (
            <>
              {g.deco.lights.map((d) => (
                <path key={d} d={d} fill="none" stroke="#c9a77d" strokeWidth={1.4} strokeDasharray="0.1 7" strokeLinecap="round" className="plan-pop" />
              ))}
              {g.deco.garden.map((p, i) => <Cluster key={`g${i}`} at={p} count={10} spread={9} colors={colors} seed={20 + i} />)}
            </>
          )}
        </g>
      )}

      {/* Tables and chairs: new tables pop in, chairs slide around their table */}
      {Array.from({ length: tables }, (_, i) => {
        const [x, y] = g.slots[i];
        const seats = Math.min(12, base + (i < extra ? 1 : 0));
        return (
          <g key={i} transform={`translate(${x} ${y})`}>
            <g className="plan-pop">
              {Array.from({ length: seats }, (_, c) => {
                const a = (c / seats) * Math.PI * 2 - Math.PI / 2;
                return (
                  <circle
                    key={c}
                    className="plan-chair"
                    r={g.table.chair}
                    fill="#1e1d1b"
                    style={{ transform: `translate(${(Math.cos(a) * g.table.ring).toFixed(2)}px, ${(Math.sin(a) * g.table.ring).toFixed(2)}px)` }}
                  />
                );
              })}
              <circle r={g.table.r} data-table="" fill="#ffffff" stroke="#cfc5b6" strokeWidth={1} />
              {centrepieces && (
                <g>
                  <circle cx={-g.table.r * 0.23} cy={-g.table.r * 0.13} r={g.table.r * 0.23} fill={colors[0]} />
                  <circle cx={g.table.r * 0.23} cy={-g.table.r * 0.13} r={g.table.r * 0.23} fill={colors[2]} />
                  <circle cx={0} cy={g.table.r * 0.23} r={g.table.r * 0.23} fill={colors[3]} />
                </g>
              )}
            </g>
          </g>
        );
      })}

      {/* Inflatables in the garden */}
      {chosen.map((inf, i) => <InflatableIcon key={inf.id} id={inf.id} at={g.inflatableSlots[i]} />)}
    </svg>
  );
}

const SALON_SLOTS_WIDE = WIDE.slots.filter(([x]) => x < WIDE.salon.x + WIDE.salon.w).length;

export function FloorPlan({ state }: { state: QuoteState }) {
  const tables = state.tables;
  const shown = Math.min(tables, TALL.slots.length);
  const perTable = tables ? state.chairs / tables : 0;
  const inGarden = Math.max(0, Math.min(tables, WIDE.slots.length) - SALON_SLOTS_WIDE);
  const parts = [`${tables} ${tables === 1 ? "mesa" : "mesas"} y ${state.chairs} sillas`];
  if (inGarden) parts.push(`${inGarden} ${inGarden === 1 ? "mesa" : "mesas"} en el jardín`);
  if (state.inflatables.length) parts.push(`${state.inflatables.length} ${state.inflatables.length === 1 ? "inflable" : "inflables"} en el jardín`);
  const caption = parts.join(", ") + ".";
  const note =
    perTable > 12
      ? "Hay más sillas de las que caben en tus mesas: agrega mesas."
      : tables > shown
        ? `El plano muestra ${shown} mesas.`
        : null;

  return (
    <figure className="m-0 border border-line bg-ground p-4 sm:p-5">
      <div role="img" aria-label={`Plano ilustrativo del salón: ${caption}`}>
        <Plan g={WIDE} state={state} className="hidden h-auto w-full sm:block" />
        <Plan g={TALL} state={state} className="block h-auto w-full sm:hidden" />
      </div>
      <figcaption className="mt-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-[14px]">
        <span className="font-medium" aria-live="polite">{caption}</span>
        <span className="text-muted">{note ?? "Plano ilustrativo, no a escala."}</span>
      </figcaption>
    </figure>
  );
}
