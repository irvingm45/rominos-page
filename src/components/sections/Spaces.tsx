"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { spaces, type SpaceChapter } from "@/data/content";
import { Photo } from "@/components/ui/Photo";

const N = spaces.length;

/** One chapter photo. Chapters after the first are uncovered from their foot as the page scrolls. */
function ChapterPhoto({ chapter, i, progress }: { chapter: SpaceChapter; i: number; progress: MotionValue<number> }) {
  const start = i === 0 ? 0 : (i - 1) / (N - 1);
  const end = i === 0 ? 0.0001 : start + 0.48 / (N - 1);
  const inset = useTransform(progress, [start, end], [i === 0 ? 0 : 100, 0], { clamp: true });
  const scale = useTransform(progress, [start, end + 0.2 / (N - 1)], [i === 0 ? 1 : 1.06, 1], { clamp: true });
  const clipPath = useMotionTemplate`inset(${inset}% 0% 0% 0%)`;
  return (
    <motion.div className="absolute inset-0 overflow-hidden" style={{ clipPath, zIndex: i }}>
      <motion.div className="absolute inset-0" style={{ scale }}>
        <Photo id={chapter.photo} alt={chapter.alt} sizes="(min-width: 1280px) 1200px, (min-width: 640px) 100vw, 960px" imgClassName="h-full w-full object-cover" />
      </motion.div>
    </motion.div>
  );
}

function Heading() {
  return (
    <>
      <h2 id="espacios-h" className="t-h2">Los espacios del salón</h2>
    </>
  );
}

/** Live version: the section holds on screen while four photographs replace each other. */
function LiveChapters() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [active, setActive] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    // A chapter's panel takes over half way through its wipe.
    const idx = Math.min(N - 1, Math.max(0, Math.floor(p * (N - 1) + 0.76)));
    setActive((prev) => (prev === idx ? prev : idx));
  });

  const ch = spaces[active];
  return (
    <section ref={ref} id="espacios" className="relative" style={{ height: `${N * 100}svh` }} aria-labelledby="espacios-h" data-moment="photo-chapters">
      {spaces.map((s, i) => (
        <span key={s.id} id={`espacio-${s.id}`} className="absolute left-0" style={{ top: `${i * 100}svh` }} aria-hidden="true" />
      ))}
      <div className="sticky top-0 flex h-svh flex-col pb-6 pt-[calc(var(--nav)+40px)] sm:pb-10 lg:pt-[calc(var(--nav)+48px)]">
        <div className="wrap flex min-h-0 flex-1 flex-col">
          <div className="flex items-end justify-between gap-6">
            <Heading />
            <ol className="hidden gap-5 sm:flex" aria-label="Espacios">
              {spaces.map((s, i) => (
                <li key={s.id}>
                  <a href={`#espacio-${s.id}`} className={`nav-word text-[15px] font-medium transition-colors duration-150 ${i === active ? "text-ink" : "text-muted"}`} aria-current={i === active ? "true" : undefined}>
                    {s.name}
                  </a>
                </li>
              ))}
            </ol>
          </div>
          <div className="relative mt-6 min-h-0 flex-1 overflow-hidden bg-surface lg:mt-8">
            {spaces.map((s, i) => (
              <ChapterPhoto key={s.id} chapter={s} i={i} progress={scrollYProgress} />
            ))}
            <div className="absolute bottom-0 left-0 z-10 w-[min(100%,400px)] bg-ground p-5 sm:p-7" aria-live="polite">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={ch.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0, transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] } }}
                  exit={{ opacity: 0, transition: { duration: 0.14 } }}
                >
                  <p className="tabular text-[13px] font-medium text-muted">
                    {active + 1} de {N}
                  </p>
                  <h3 className="mt-1 font-display text-[26px] leading-tight">{ch.name}</h3>
                  <p className="mt-2 text-ink-soft">{ch.text}</p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Still version: reduced motion, short screens and the first server render. */
function StillChapters() {
  return (
    <section id="espacios" className="section-screen" style={{ ["--h" as string]: 2 }} aria-labelledby="espacios-h">
      <div className="wrap">
        <Heading />
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:mt-12">
          {spaces.map((s) => (
            <li key={s.id} id={`espacio-${s.id}`}>
              <div className="aspect-[4/3] overflow-hidden bg-surface">
                <Photo id={s.photo} alt={s.alt} sizes="(min-width: 1024px) 588px, (min-width: 640px) 50vw, 100vw" imgClassName="h-full w-full object-cover" />
              </div>
              <h3 className="mt-4 font-display text-[24px] leading-tight">{s.name}</h3>
              <p className="mt-1 text-ink-soft">{s.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Spaces() {
  const reduce = useReducedMotion();
  const [live, setLive] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-height: 600px)");
    const update = () => setLive(!reduce && mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [reduce]);
  return live ? <LiveChapters /> : <StillChapters />;
}
