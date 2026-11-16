"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useReducedMotion } from "motion/react";
import { decorationPackages } from "@/data/pricing";
import { formatMXN } from "@/lib/quote";
import { Photo } from "@/components/ui/Photo";

/* ------------------------------------------------------------------------------------------
 * The decorated side: balloon garlands, hanging lights and centrepieces drawn over the real
 * photo of the hall (salon-amplio, 4:3). Coordinates are in a 1600x1199 box that matches the
 * photo, so `preserveAspectRatio="xMidYMid slice"` lines them up with object-fit: cover.
 * TODO: replace with a real photo of a decorated event when the client sends one.
 * ---------------------------------------------------------------------------------------- */

const W = 1600;
const H = 1199;

function seeded(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const TONES = {
  oro: ["#f6dcb0", "#c99a5e", "#7d5530"],
  blanco: ["#ffffff", "#ebe3d8", "#a99e8e"],
  rosa: ["#fbe0da", "#e2a598", "#9b5f55"],
  salvia: ["#e1ead6", "#9fb48c", "#5d7350"],
} as const;
type Tone = keyof typeof TONES;
const TONE_MIX: Tone[] = ["oro", "blanco", "rosa", "oro", "salvia", "blanco"];

type Balloon = { x: number; y: number; r: number; tone: Tone };

// Computed once at module load with a fixed seed, so server and browser draw the same picture.
const DECOR = (() => {
  const rnd = seeded(42);
  const garland = (pts: [number, number][], count: number, rMin: number, rMax: number, jitter: number): Balloon[] => {
    const items: Balloon[] = [];
    for (let i = 0; i < count; i++) {
      const t = rnd() * (pts.length - 1);
      const i0 = Math.floor(t);
      const f = t - i0;
      const p0 = pts[i0];
      const p1 = pts[Math.min(i0 + 1, pts.length - 1)];
      items.push({
        x: p0[0] + (p1[0] - p0[0]) * f + (rnd() - 0.5) * jitter,
        y: p0[1] + (p1[1] - p0[1]) * f + (rnd() - 0.5) * jitter,
        r: rMin + rnd() * (rMax - rMin),
        tone: TONE_MIX[Math.floor(rnd() * TONE_MIX.length)],
      });
    }
    return items.sort((a, b) => b.r - a.r);
  };

  // Hanging lights across the ceiling
  const strings = ([
    [0, 40, 1600, 90, 150],
    [0, 150, 1600, 20, 130],
    [0, 90, 1600, 180, 110],
  ] as const).map(([x1, y1, x2, y2, sag]) => {
    const cx = (x1 + x2) / 2;
    const cy = (y1 + y2) / 2 + sag * 2;
    const bulbs: [number, number][] = [];
    for (let t = 0.02; t < 1; t += 0.034) {
      bulbs.push([
        (1 - t) ** 2 * x1 + 2 * (1 - t) * t * cx + t * t * x2,
        (1 - t) ** 2 * y1 + 2 * (1 - t) * t * cy + t * t * y2 + 8,
      ]);
    }
    return { d: `M${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`, bulbs };
  });

  // Balloon arch on the back wall, behind the head table
  const arch: [number, number][] = [];
  for (let a = 180; a >= 0; a -= 10) {
    const rad = (a * Math.PI) / 180;
    arch.push([1340 + 235 * Math.cos(rad), 520 - 290 * Math.sin(rad)]);
  }
  // Garlands climbing the two pillars
  const col1: [number, number][] = [];
  for (let y = 600; y >= 0; y -= 30) col1.push([407 + Math.sin(y / 70) * 34, y]);
  const col2: [number, number][] = [];
  for (let y = 500; y >= 140; y -= 30) col2.push([995 + Math.sin(y / 60) * 18, y]);

  return {
    strings,
    balloons: [...garland(arch, 120, 14, 34, 46), ...garland(col1, 70, 16, 40, 44), ...garland(col2, 34, 10, 22, 26)],
    centrepieces: [
      [576, 640, 1],
      [1240, 528, 0.55],
      [861, 440, 0.32],
      [1394, 468, 0.36],
    ] as const,
  };
})();

const f1 = (n: number) => n.toFixed(1);

function DecorLayer() {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden="true">
      <defs>
        {(Object.keys(TONES) as Tone[]).map((k) => (
          <radialGradient key={k} id={`ba-${k}`} cx="35%" cy="30%" r="75%">
            <stop offset="0%" stopColor={TONES[k][0]} />
            <stop offset="55%" stopColor={TONES[k][1]} />
            <stop offset="100%" stopColor={TONES[k][2]} />
          </radialGradient>
        ))}
        <radialGradient id="ba-glow">
          <stop offset="0%" stopColor="#ffd99a" stopOpacity={0.95} />
          <stop offset="100%" stopColor="#ffb85c" stopOpacity={0} />
        </radialGradient>
        <radialGradient id="ba-warm" cx="55%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#ffbe72" stopOpacity={0.32} />
          <stop offset="100%" stopColor="#3a1d05" stopOpacity={0.25} />
        </radialGradient>
      </defs>
      <rect width={W} height={H} fill="url(#ba-warm)" />
      {DECOR.strings.map((s) => (
        <g key={s.d}>
          <path d={s.d} fill="none" stroke="#2a1f14" strokeWidth={2.2} opacity={0.7} />
          {s.bulbs.map(([x, y], i) => (
            <g key={i}>
              <circle cx={f1(x)} cy={f1(y)} r={22} fill="url(#ba-glow)" />
              <circle cx={f1(x)} cy={f1(y)} r={4.5} fill="#fff4dc" />
            </g>
          ))}
        </g>
      ))}
      {DECOR.balloons.map((b, i) => (
        <circle key={i} cx={f1(b.x)} cy={f1(b.y)} r={f1(b.r)} fill={`url(#ba-${b.tone})`} />
      ))}
      {DECOR.centrepieces.map(([x, y, s]) => (
        <g key={`${x}-${y}`} transform={`translate(${x} ${y}) scale(${s})`}>
          <ellipse cx={0} cy={6} rx={70} ry={16} fill="url(#ba-glow)" opacity={0.7} />
          <rect x={-14} y={-40} width={28} height={46} rx={4} fill="url(#ba-oro)" />
          {([[-30, -52, 16, "rosa"], [0, -64, 19, "blanco"], [30, -52, 16, "rosa"], [-15, -74, 14, "oro"], [17, -78, 14, "blanco"], [0, -46, 14, "salvia"], [-40, -38, 10, "salvia"], [40, -38, 10, "salvia"]] as const).map(
            ([fx, fy, r, t], i) => <circle key={i} cx={fx} cy={fy} r={r} fill={`url(#ba-${t})`} />,
          )}
          {[-46, 46].map((cx) => (
            <g key={cx}>
              <circle cx={cx} cy={-4} r={16} fill="url(#ba-glow)" />
              <rect x={cx - 4} y={-6} width={8} height={12} rx={2} fill="#fbf3e4" />
            </g>
          ))}
        </g>
      ))}
    </svg>
  );
}

function Compare() {
  const [pos, setPos] = useState(50);
  const touched = useRef(false);
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  // Once, as it comes on screen: nudge the divider so people see it can be dragged.
  useEffect(() => {
    if (reduce || !ref.current) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        window.setTimeout(() => {
          if (touched.current) return;
          animate(50, 68, { duration: 0.7, ease: [0.65, 0, 0.35, 1], onUpdate: (v) => !touched.current && setPos(v) }).then(() => {
            if (!touched.current) animate(68, 50, { duration: 0.8, ease: [0.65, 0, 0.35, 1], onUpdate: (v) => !touched.current && setPos(v) });
          });
        }, 350);
      },
      { threshold: 0.6 },
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, [reduce]);

  return (
    <div
      ref={ref}
      className="relative aspect-[4/3] select-none overflow-hidden bg-surface has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-4 has-[:focus-visible]:outline-accent-deep"
    >
      <Photo id="salon-amplio" alt="El salón sin decorar: mesas redondas con manteles blancos y sillas negras" sizes="(min-width: 1024px) 690px, 100vw" className="absolute inset-0" imgClassName="h-full w-full object-cover" />
      <div className="absolute inset-0" style={{ clipPath: `inset(0 0 0 ${pos}%)` }} aria-hidden="true">
        <Photo
          id="salon-amplio"
          alt=""
          sizes="(min-width: 1024px) 690px, 100vw"
          className="absolute inset-0"
          imgClassName="h-full w-full object-cover"
          imgStyle={{ filter: "sepia(.32) saturate(1.25) brightness(.64) contrast(1.08)" }}
        />
        <DecorLayer />
      </div>

      <span className="t-label pointer-events-none absolute left-3 top-3 bg-ground px-2.5 py-1.5 text-ink sm:left-4 sm:top-4">Antes</span>
      <span className="t-label pointer-events-none absolute right-3 top-3 bg-ink px-2.5 py-1.5 text-inv-ink sm:right-4 sm:top-4">Decorado</span>

      <div className="pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-ground" style={{ left: `${pos}%` }} aria-hidden="true">
        <span className="absolute left-1/2 top-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-ground text-ink shadow-[0_4px_14px_rgb(0_0_0/0.3)]">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 7l-5 5 5 5M15 7l5 5-5 5" />
          </svg>
        </span>
      </div>

      <input
        type="range"
        min={0}
        max={100}
        step={1}
        value={Math.round(pos)}
        onPointerDown={() => (touched.current = true)}
        onKeyDown={() => (touched.current = true)}
        onChange={(e) => {
          touched.current = true;
          setPos(Number(e.target.value));
        }}
        aria-label="Comparar el salón antes y después de decorar"
        aria-valuetext={`${Math.round(pos)}% decorado`}
        className="absolute inset-0 h-full w-full cursor-ew-resize touch-pan-y opacity-0"
      />
    </div>
  );
}

export function BeforeAfter() {
  return (
    <section id="decoracion" className="section-screen" aria-labelledby="decoracion-h">
      <div className="wrap grid gap-10 lg:grid-cols-12 lg:gap-6">
        <div className="lg:col-span-5">
          <h2 id="decoracion-h" className="t-h2 reveal">El salón, antes y después de decorar</h2>
          <p className="reveal t-lead mt-4 max-w-[30em] text-ink-soft" style={{ ["--reveal-i" as string]: 1 }}>
            Paredes blancas y mobiliario en blanco y negro: un fondo que combina con cualquier tema, de una fiesta de dinosaurios a una boda en dorado. Desliza para ver cómo cambia.
          </p>
          <ul className="reveal mt-8 border-t border-line" style={{ ["--reveal-i" as string]: 2 }}>
            {decorationPackages.map((d) => (
              <li key={d.id} className="flex items-baseline justify-between gap-4 border-b border-line py-3">
                <span>
                  <span className="font-display text-[20px]">{d.name}</span>
                  <span className="block text-[15px] text-muted">{d.includes[0]}</span>
                </span>
                <span className="tabular shrink-0 font-medium" data-assumed="">{formatMXN(d.price)}</span>
              </li>
            ))}
          </ul>
          <a href="#paso-decoracion" className="reveal btn btn-outline mt-8" style={{ ["--reveal-i" as string]: 3 }}>
            Elegir decoración
          </a>
          <p className="reveal mt-6 text-[14px] text-muted" style={{ ["--reveal-i" as string]: 3 }}>
            La foto decorada es una simulación sobre una foto real del salón.
          </p>
        </div>
        <div className="reveal lg:col-span-7" style={{ ["--reveal-i" as string]: 2 }}>
          <Compare />
        </div>
      </div>
    </section>
  );
}
