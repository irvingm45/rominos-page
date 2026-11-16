"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { eventTypes } from "@/data/content";
import { formatLongDate, formatMXN, joinEs, quoteWhatsAppUrl } from "@/lib/quote";
import { WhatsAppGlyph } from "@/components/ui/Glyphs";
import { AnimatedMXN } from "./AnimatedNumber";
import { useQuote } from "./QuoteContext";

export const DISCLAIMER = "Precio estimado, sujeto a disponibilidad y confirmación.";

/** The live line-item breakdown. Used sticky on desktop and inside the bottom sheet on phones. */
export function SummaryPanel({ headingId, compact = false }: { headingId: string; compact?: boolean }) {
  const { state, quote } = useQuote();
  const reduce = useReducedMotion();
  const ev = eventTypes.find((e) => e.id === state.eventType);

  return (
    <div className={`bg-inv text-inv-ink ${compact ? "p-5" : "p-6 lg:p-8"}`}>
      <h3 id={headingId} className="font-display text-[24px] leading-tight">
        Tu cotización
      </h3>
      <p className="mt-1 text-[15px] text-inv-muted">
        {ev?.name ?? "Evento"}, {state.guests} invitados
        <br />
        {state.date ? formatLongDate(state.date) : "Fecha por elegir"}
      </p>

      <ul className="mt-5 text-[15px]">
        <AnimatePresence initial={false}>
          {quote.lines.map((l) => (
            <motion.li
              key={l.id}
              layout={!reduce}
              initial={reduce ? false : { opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduce ? undefined : { opacity: 0, x: 8, transition: { duration: 0.15 } }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-baseline justify-between gap-4 border-b border-white/12 py-2.5"
            >
              <span>
                {l.label}
                {l.detail && <span className="block text-[13px] text-inv-muted">{l.detail}</span>}
              </span>
              <span className="tabular shrink-0" data-assumed="">{formatMXN(l.amount)}</span>
            </motion.li>
          ))}
          {quote.included.length > 0 && (
            <motion.li key="included" layout={!reduce} className="flex items-baseline justify-between gap-4 border-b border-white/12 py-2.5">
              <span>{joinEs(quote.included.map((i, n) => (n === 0 ? i.label : i.label.toLowerCase())))}</span>
              <span className="shrink-0 text-[#a9cf8f]">Incluido</span>
            </motion.li>
          )}
        </AnimatePresence>
      </ul>

      <div className="mt-5 flex items-end justify-between gap-4">
        <span className="pb-1.5 text-[15px] text-inv-muted">Total estimado</span>
        <AnimatedMXN value={quote.total} className="font-display text-[40px] leading-none lg:text-[44px]" />
      </div>
      <p className="mt-3 text-[13px] leading-snug text-inv-muted">{DISCLAIMER}</p>

      <a href={quoteWhatsAppUrl(state)} target="_blank" rel="noopener" className="btn btn-primary mt-5 w-full">
        <WhatsAppGlyph />
        Enviar cotización por WhatsApp
      </a>
    </div>
  );
}
