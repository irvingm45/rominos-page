"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { eventTypes } from "@/data/content";
import { addonServices, chairService, decorationPackages, includedServices, inflatables, pricing, tableService, venueService } from "@/data/pricing";
import { formatMXN } from "@/lib/quote";
import { ServiceIconSvg } from "@/components/icons/ServiceIcons";
import { FloorPlan } from "./FloorPlan";
import { Photo } from "@/components/ui/Photo";
import { AnimatedMXN } from "./AnimatedNumber";
import { DatePicker } from "./DatePicker";
import { Stepper } from "./Stepper";
import { DISCLAIMER, SummaryPanel } from "./SummaryPanel";
import { useQuote } from "./QuoteContext";

function Step({ n, title, children, id }: { n: number; title: string; children: ReactNode; id: string }) {
  return (
    <fieldset className="border-t border-line pt-6 pb-7 first:border-t-0 first:pt-0" aria-labelledby={id}>
      <legend className="sr-only">{title}</legend>
      <h3 id={id} className="mb-5 flex items-center gap-3 font-display text-[22px] leading-tight">
        <span className="tabular grid h-8 w-8 shrink-0 place-items-center rounded-full bg-ink font-sans text-[14px] font-medium text-inv-ink">{n}</span>
        {title}
      </h3>
      {children}
    </fieldset>
  );
}

const selectableCard =
  "relative flex h-full cursor-pointer flex-col border bg-ground text-left transition-[border-color,box-shadow,transform] duration-150 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent-deep";

function Check({ on }: { on: boolean }) {
  return (
    <span aria-hidden="true" className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border transition-colors duration-150 ${on ? "border-ink bg-ink text-inv-ink" : "border-line bg-ground"}`}>
      <motion.svg viewBox="0 0 16 16" width="12" height="12" initial={false} animate={{ scale: on ? 1 : 0.6, opacity: on ? 1 : 0 }} transition={{ duration: 0.16 }}>
        <path d="M3.5 8.5 6.5 11.5 12.5 4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </motion.svg>
    </span>
  );
}

function Toggle({ on }: { on: boolean }) {
  return (
    <span aria-hidden="true" className={`relative h-7 w-12 shrink-0 rounded-full transition-colors duration-150 ${on ? "bg-ink" : "bg-surface-2"}`}>
      <motion.span className="absolute top-1 left-1 h-5 w-5 rounded-full bg-ground shadow-sm" initial={false} animate={{ x: on ? 20 : 0 }} transition={{ type: "tween", duration: 0.18, ease: [0.2, 0.8, 0.2, 1] }} />
    </span>
  );
}

export function QuoteCalculator() {
  const { state, quote, dispatch } = useQuote();
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const fill = ((state.guests - pricing.guests.min) / (pricing.guests.max - pricing.guests.min)) * 100;

  // Show the phone bottom bar only while the calculator is on screen.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: "-35% 0px -35% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    document.body.toggleAttribute("data-quote-bar", inView);
    if (!inView) setSheetOpen(false);
  }, [inView]);

  return (
    <section ref={sectionRef} id="cotizador" className="section-screen" style={{ ["--h" as string]: 2 }} aria-labelledby="cotizador-h">
      <div className="wrap">
        <h2 id="cotizador-h" className="t-h2 reveal">Arma tu evento</h2>
        <p className="reveal t-lead mt-4 max-w-[38em] text-ink-soft" style={{ ["--reveal-i" as string]: 1 }}>
          Elige fecha, invitados y extras. El total cambia al momento y lo envías por WhatsApp para que te confirmemos.
        </p>

        <div className="mt-10 grid gap-10 lg:mt-12 lg:grid-cols-12 lg:gap-6">
          <div className="lg:col-span-7">
            {/* 1. Event and date */}
            <Step n={1} title="Tu evento" id="paso-evento">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-[14px] font-medium">Tipo de evento</span>
                  <span className="relative block">
                    <select
                      value={state.eventType}
                      onChange={(e) => dispatch({ type: "eventType", eventId: e.target.value })}
                      className="h-12 w-full appearance-none border border-line bg-ground px-4 pr-10 text-[16px] transition-colors duration-150 hover:border-ink"
                    >
                      {eventTypes.map((e) => (
                        <option key={e.id} value={e.id}>{e.name}</option>
                      ))}
                    </select>
                    <svg viewBox="0 0 24 24" width="18" height="18" className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>
                  </span>
                </label>
                <div>
                  <span id="fecha-label" className="mb-2 block text-[14px] font-medium">Fecha del evento</span>
                  <DatePicker value={state.date} onChange={(date) => dispatch({ type: "date", date })} labelId="fecha-label" />
                </div>
              </div>
              <p className="mt-3 text-[14px] text-ink-soft" data-assumed="">
                Renta del salón: {venueService.rateLabels.weekday} {formatMXN(venueService.rates.weekday)}, {venueService.rateLabels.fridaySunday} {formatMXN(venueService.rates.fridaySunday)}, {venueService.rateLabels.saturday} {formatMXN(venueService.rates.saturday)}.
              </p>

            </Step>

            {/* 2. Furniture */}
            <Step n={2} title="Invitados, mesas y sillas" id="paso-mobiliario">
              <div>
                <div className="flex items-baseline justify-between">
                  <label htmlFor="invitados" className="text-[14px] font-medium">Invitados</label>
                  <output htmlFor="invitados" className="tabular font-display text-[28px] leading-none lg:text-[34px]">{state.guests}</output>
                </div>
                <input
                  id="invitados"
                  type="range"
                  className="range mt-2"
                  min={pricing.guests.min}
                  max={pricing.guests.max}
                  step={pricing.guests.step}
                  value={state.guests}
                  style={{ ["--fill" as string]: `${fill}%` }}
                  onChange={(e) => dispatch({ type: "guests", guests: Number(e.target.value) })}
                  aria-valuetext={`${state.guests} invitados`}
                />
                <div className="tabular flex justify-between text-[13px] text-muted" aria-hidden="true">
                  <span>{pricing.guests.min}</span>
                  <span>{pricing.guests.max}</span>
                </div>
              </div>
              <div className="mt-6">
                <FloorPlan state={state} />
              </div>
              <p className="mb-4 mt-6 text-[15px] text-ink-soft">
                {state.autoFurniture ? (
                  <>Calculamos {pricing.guestsPerTable} invitados por mesa. Ajusta si lo necesitas.</>
                ) : (
                  <>
                    Para {state.guests} invitados sugerimos {Math.ceil(state.guests / pricing.guestsPerTable)} mesas y {state.guests} sillas.{" "}
                    <button type="button" className="link font-medium text-accent-deep" onClick={() => dispatch({ type: "resetFurniture" })}>
                      Usar la sugerencia
                    </button>
                  </>
                )}
              </p>
              <div className="divide-y divide-line border-y border-line">
                {[
                  { svc: tableService, value: state.tables, set: (v: number) => dispatch({ type: "tables", value: v }), step: 1, max: 40 },
                  { svc: chairService, value: state.chairs, set: (v: number) => dispatch({ type: "chairs", value: v }), step: 5, max: 400 },
                ].map(({ svc, value, set, step, max }) => (
                  <div key={svc.id} className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-2 py-4 sm:grid-cols-[1fr_auto_7rem]">
                    <div className="flex items-center gap-3">
                      <ServiceIconSvg name={svc.icon} className="hidden h-8 w-8 text-accent-deep sm:block" />
                      <div>
                        <p id={`lbl-${svc.id}`} className="font-medium">{svc.name}</p>
                        <p className="tabular text-[14px] text-muted" data-assumed="">{formatMXN(svc.unitPrice)} c/u</p>
                      </div>
                    </div>
                    <Stepper id={`lbl-${svc.id}`} value={value} onChange={set} step={step} max={max} unit={svc.unit.singular} />
                    <p className="tabular col-span-2 text-right text-[15px] sm:col-span-1">
                      <span className="sr-only">Subtotal: </span>
                      <AnimatedMXN value={value * svc.unitPrice} />
                    </p>
                  </div>
                ))}
              </div>
            </Step>

            {/* 3. Decoration */}
            <Step n={3} title="Decoración con globos y adornos" id="paso-decoracion">
              <div role="radiogroup" aria-labelledby="paso-decoracion" className="grid gap-3 sm:grid-cols-2">
                {[{ id: null, name: "Sin decoración", price: 0, includes: ["Tú decoras o traes a tu decorador"] }, ...decorationPackages].map((d) => {
                  const on = state.decoration === d.id;
                  return (
                    <label key={d.id ?? "none"} className={`${selectableCard} p-4 ${on ? "border-ink shadow-[inset_0_0_0_1px_var(--color-ink)]" : "border-line hover:border-ink/40"}`}>
                      <input type="radio" name="decoracion" className="sr-only" checked={on} onChange={() => dispatch({ type: "decoration", id: d.id })} />
                      <span className="flex items-start justify-between gap-3">
                        <span>
                          <span className="block font-display text-[20px] leading-tight">{d.name}</span>
                          <span className="tabular mt-1 block text-[15px] font-medium" data-assumed="">{d.price ? formatMXN(d.price) : "Sin costo"}</span>
                        </span>
                        <Check on={on} />
                      </span>
                      <ul className="mt-3 space-y-1 text-[14px] leading-snug text-muted">
                        {d.includes.map((x) => (
                          <li key={x} className="flex gap-2">
                            <span aria-hidden="true" className="mt-[9px] h-px w-2.5 shrink-0 bg-accent" />
                            {x}
                          </li>
                        ))}
                      </ul>
                    </label>
                  );
                })}
              </div>
            </Step>

            {/* 4. Inflatables */}
            <Step n={4} title="Inflables" id="paso-inflables">
              <div className="grid gap-3 sm:grid-cols-3">
                {inflatables.map((inf) => {
                  const on = state.inflatables.includes(inf.id);
                  return (
                    <label key={inf.id} className={`${selectableCard} ${on ? "border-ink shadow-[inset_0_0_0_1px_var(--color-ink)]" : "border-line hover:border-ink/40"}`}>
                      <input type="checkbox" className="sr-only" checked={on} onChange={() => dispatch({ type: "toggleInflatable", id: inf.id })} />
                      <span className="relative block aspect-[16/10] overflow-hidden bg-surface">
                        {inf.photo ? (
                          <Photo id={inf.photo} alt={inf.name} sizes="(min-width: 1024px) 220px, (min-width: 640px) 30vw, 100vw" imgClassName="h-full w-full object-cover" />
                        ) : (
                          // Neutral placeholder until the client sends a photo of this inflatable.
                          <span className="grid h-full w-full place-items-center bg-surface-2 text-ink/35">
                            <ServiceIconSvg name="inflatable" className="h-14 w-14" />
                          </span>
                        )}
                        <span className="absolute right-3 top-3"><Check on={on} /></span>
                      </span>
                      <span className="flex flex-1 flex-col px-4 pb-4 pt-3">
                        <span className="font-medium leading-snug">{inf.name}</span>
                        <span className="mt-1 text-[14px] leading-snug text-muted">{inf.description}</span>
                        <span className="tabular mt-auto pt-2 font-medium" data-assumed="">{formatMXN(inf.price)}</span>
                      </span>
                    </label>
                  );
                })}
              </div>
            </Step>

            {/* 5. Spaces and services */}
            <Step n={5} title={addonServices.length ? "Espacios y servicios" : "Incluido en la renta"} id="paso-espacios">
              <div className="divide-y divide-line border-y border-line">
                {addonServices.map((s) => {
                  const on = state.addons.includes(s.id);
                  return (
                    <label key={s.id} className="flex cursor-pointer items-center gap-4 py-4 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-accent-deep">
                      <input type="checkbox" role="switch" className="sr-only" checked={on} onChange={() => dispatch({ type: "toggleAddon", id: s.id })} />
                      <ServiceIconSvg name={s.icon} className="h-8 w-8 shrink-0 text-accent-deep" />
                      <span className="flex-1">
                        <span className="block font-medium">{s.name}</span>
                        <span className="tabular block text-[14px] text-muted" data-assumed="">{formatMXN(s.price)} por evento</span>
                      </span>
                      <Toggle on={on} />
                    </label>
                  );
                })}
                {includedServices.map((s) => (
                  <div key={s.id} className="flex items-center gap-4 py-4">
                    <ServiceIconSvg name={s.icon} className="h-8 w-8 shrink-0 text-garden" />
                    <span className="flex-1">
                      <span className="block font-medium">{s.name}</span>
                      <span className="block text-[14px] text-muted">{s.description}</span>
                    </span>
                    <span className="t-label inline-flex items-center gap-1.5 rounded-[2px] bg-garden px-2.5 py-1.5 text-white">
                      <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true"><path d="M5 7V5a3 3 0 0 1 6 0v2M4 7h8v6H4z" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg>
                      Incluido sin costo
                    </span>
                  </div>
                ))}
              </div>
            </Step>
          </div>

          {/* Desktop: sticky summary */}
          <aside className="hidden lg:col-span-5 lg:block" aria-label="Resumen de tu cotización">
            <div className="sticky top-[calc(var(--nav)+24px)]">
              <SummaryPanel headingId="resumen-h" />
            </div>
          </aside>
        </div>
      </div>

      {/* Phone: bottom bar that opens the summary as a sheet */}
      <AnimatePresence>
        {inView && (
          <motion.div
            initial={reduce ? { opacity: 0 } : { y: "100%" }}
            animate={reduce ? { opacity: 1 } : { y: 0 }}
            exit={reduce ? { opacity: 0 } : { y: "100%" }}
            transition={{ duration: 0.24, ease: [0.2, 0.8, 0.2, 1] }}
            className="fixed inset-x-0 bottom-0 z-30 lg:hidden"
          >
            <AnimatePresence>
              {sheetOpen && (
                <motion.div
                  id="hoja-resumen"
                  initial={reduce ? { opacity: 0 } : { y: 24, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={reduce ? { opacity: 0 } : { y: 24, opacity: 0 }}
                  transition={{ duration: 0.24, ease: [0.2, 0.8, 0.2, 1] }}
                  className="max-h-[calc(100svh-var(--nav)-80px)] overflow-y-auto border-t border-white/10"
                >
                  <SummaryPanel headingId="resumen-movil-h" compact />
                </motion.div>
              )}
            </AnimatePresence>
            <div className="flex items-center justify-between gap-3 bg-inv px-[var(--gut)] pb-[calc(12px+env(safe-area-inset-bottom))] pt-3 pr-[88px] text-inv-ink">
              <div>
                <span className="block text-[13px] text-inv-muted">Total estimado</span>
                <AnimatedMXN value={quote.total} className="font-display text-[26px] leading-tight" />
              </div>
              <button type="button" className="btn btn-primary min-h-11 px-4" aria-expanded={sheetOpen} aria-controls="hoja-resumen" onClick={() => setSheetOpen((o) => !o)}>
                {sheetOpen ? "Ocultar resumen" : "Ver resumen"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <p className="sr-only">{DISCLAIMER}</p>
    </section>
  );
}
