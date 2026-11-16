"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { eventTypes } from "@/data/content";
import { decorationPackages, inflatables } from "@/data/pricing";
import { Photo } from "@/components/ui/Photo";
import { useQuote } from "@/components/quote/QuoteContext";

export function EventTypes() {
  const [active, setActive] = useState(eventTypes[2].id);
  const { dispatch } = useQuote();
  const reduce = useReducedMotion();
  const ev = eventTypes.find((e) => e.id === active)!;
  const deco = decorationPackages.find((d) => d.id === ev.suggested.decoration);
  const infl = inflatables.filter((i) => ev.suggested.inflatables.includes(i.id));

  const useSetup = () => {
    dispatch({ type: "preset", eventId: ev.id });
    document.getElementById("cotizador")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  };

  const fade = reduce
    ? {}
    : {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] as const } },
        exit: { opacity: 0, y: -6, transition: { duration: 0.18 } },
      };

  return (
    <section id="eventos" className="section-screen" aria-labelledby="eventos-h">
      <div className="wrap">
        <h2 id="eventos-h" className="t-h2 reveal max-w-[18ch]">Tipos de evento y montaje sugerido</h2>
        <p className="reveal t-lead mt-4 max-w-[40em] text-ink-soft" style={{ ["--reveal-i" as string]: 1 }}>
          Elige tu evento y te mostramos el acomodo que solemos sugerir. Lo cargas al cotizador y cambias lo que quieras.
        </p>

        <div className="mt-10 grid gap-6 lg:mt-12 lg:grid-cols-12">
          <div role="radiogroup" aria-label="Tipo de evento" className="reveal flex flex-wrap gap-2 lg:col-span-4 lg:block" style={{ ["--reveal-i" as string]: 2 }}>
            {eventTypes.map((e) => {
              const on = e.id === active;
              return (
                <button
                  key={e.id}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => setActive(e.id)}
                  className={`group flex min-h-11 items-center justify-between gap-3 rounded-full border px-4 text-left text-[15px] font-medium transition-colors duration-150 lg:min-h-[52px] lg:w-full lg:rounded-none lg:border-0 lg:border-b lg:border-line lg:px-0 lg:py-2.5 lg:font-display lg:text-[22px] lg:font-normal lg:leading-tight ${on ? "border-ink bg-ink text-inv-ink lg:bg-transparent lg:text-ink" : "border-line text-ink-soft hover:border-ink lg:text-muted lg:hover:text-ink"}`}
                >
                  <span>{e.name}</span>
                  <span aria-hidden="true" className={`hidden h-2 w-2 shrink-0 rounded-full transition-transform duration-200 lg:block ${on ? "scale-100 bg-accent" : "scale-0 bg-ink"}`} />
                </button>
              );
            })}
          </div>

          <div className="relative lg:col-span-8">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={ev.id} {...fade} className="grid gap-6 sm:grid-cols-2" aria-live="polite">
                <div className="flex flex-col">
                  <h3 className="font-display text-[28px] leading-tight">{ev.name}</h3>
                  <p className="mt-3 text-ink-soft">{ev.description}</p>
                  <dl className="mt-6 divide-y divide-line border-y border-line">
                    <div className="flex justify-between gap-4 py-2.5">
                      <dt className="text-muted">Invitados</dt>
                      <dd className="tabular font-medium">{ev.suggested.guests}</dd>
                    </div>
                    <div className="flex justify-between gap-4 py-2.5">
                      <dt className="text-muted">Decoración</dt>
                      <dd className="font-medium">{deco ? deco.name : "Sin decoración"}</dd>
                    </div>
                    <div className="flex justify-between gap-4 py-2.5">
                      <dt className="text-muted">Inflables</dt>
                      <dd className="text-right font-medium">{infl.length ? infl.map((i) => i.name).join(", ") : "Ninguno"}</dd>
                    </div>
                  </dl>
                  <ul className="mt-5 space-y-1 text-ink-soft">
                    {ev.setupNotes.map((n) => (
                      <li key={n} className="flex gap-2.5">
                        <span aria-hidden="true" className="mt-[9px] h-px w-3 shrink-0 bg-accent" />
                        {n}
                      </li>
                    ))}
                  </ul>
                  <button type="button" onClick={useSetup} className="btn btn-outline mt-6 self-start lg:mt-auto">
                    Usar este montaje
                  </button>
                </div>
                <div className="aspect-[4/3] overflow-hidden bg-surface sm:aspect-[4/5]">
                  <Photo id={ev.photo} alt={ev.photoAlt} sizes="(min-width: 1024px) 384px, (min-width: 640px) 45vw, 100vw" imgClassName="h-full w-full object-cover" imgStyle={{ objectPosition: ev.photoPosition ?? "50% 50%" }} />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
