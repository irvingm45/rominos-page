"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { business, placeLine, MAIN_ACTION } from "@/data/business";
import { spaces } from "@/data/content";
import { Photo } from "@/components/ui/Photo";
import { ArrowGlyph } from "@/components/ui/Glyphs";

const links = [
  { href: "#eventos", label: "Eventos" },
  { href: "#servicios", label: "Servicios" },
  { href: "#espacios", label: "Espacios", panel: true },
  { href: "#galeria", label: "Galería" },
  { href: "#preguntas", label: "Preguntas" },
  { href: "#ubicacion", label: "Ubicación" },
];



export function Header() {
  const [panel, setPanel] = useState(false);
  const [menu, setMenu] = useState(false);
  const timer = useRef<number | null>(null);

  const openSoon = () => {
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setPanel(true), 150);
  };
  const closeSoon = () => {
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setPanel(false), 120);
  };

  useEffect(() => {
    document.documentElement.style.overflow = menu ? "hidden" : "";
    if (!menu) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenu(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menu]);

  return (
    <header className="nav fixed inset-x-0 top-0 z-50 h-[var(--nav)] border-b border-line bg-ground">
      <div className="wrap flex h-full items-center gap-6">
        <a
          href="#contenido"
          className="sr-only z-50 bg-ink px-4 py-2 text-inv-ink focus:not-sr-only focus:absolute focus:left-0 focus:top-1/2 focus:-translate-y-1/2"
        >
          Saltar al contenido
        </a>
        <a href="#top" className="shrink-0" aria-label={`${business.name}, inicio`}>
          {/* The client's own logo file (caramel on transparent). */}
          <img src="/brand/logo-280.png" srcSet="/brand/logo-280.png 280w, /brand/logo.png 520w" sizes="140px" alt={business.alternateName} width={280} height={89} className="h-9 w-auto sm:h-11" />
        </a>

        <nav aria-label="Principal" className="ml-auto hidden items-center gap-7 min-[1180px]:flex">
          {links.map((l) =>
            l.panel ? (
              <div key={l.href} className="flex" onPointerEnter={openSoon} onPointerLeave={closeSoon} onFocus={() => setPanel(true)} onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setPanel(false)}>
                <a href={l.href} className="nav-word text-[15px] font-medium" aria-expanded={panel} aria-controls="nav-panel" onClick={() => setPanel(false)}>
                  {l.label}
                </a>
                <AnimatePresence>
                  {panel && (
                    <motion.div
                      id="nav-panel"
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0, transition: { duration: 0.2, ease: [0.2, 0.8, 0.2, 1] } }}
                      exit={{ opacity: 0, transition: { duration: 0.12 } }}
                      className="absolute inset-x-0 top-full border-b border-line bg-ground"
                    >
                      <div className="wrap grid grid-cols-4 gap-6 py-8">
                        {spaces.map((s) => (
                          <a key={s.id} href={`#espacio-${s.id}`} onClick={() => setPanel(false)} className="card-link group block">
                            <span className="zoom-frame block aspect-[4/3] bg-surface">
                              <Photo id={s.photo} alt={s.alt} sizes="300px" imgClassName="h-full w-full object-cover" />
                            </span>
                            <span className="mt-3 block font-display text-xl">{s.name}</span>
                          </a>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <a key={l.href} href={l.href} className="nav-word text-[15px] font-medium">
                {l.label}
              </a>
            ),
          )}
        </nav>

        <a href="#cotizador" className="btn btn-primary ml-auto hidden sm:inline-flex min-[1180px]:ml-2">
          {MAIN_ACTION}
          <ArrowGlyph />
        </a>
        <button
          type="button"
          className="btn btn-outline ml-auto h-11 min-h-11 w-11 px-0 sm:ml-0 min-[1180px]:hidden"
          aria-expanded={menu}
          aria-controls="menu-sheet"
          aria-label={menu ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setMenu((m) => !m)}
        >
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
            {menu ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 8h16M4 16h16" />}
          </svg>
        </button>
      </div>

      <AnimatePresence>
        {menu && (
          <motion.div
            id="menu-sheet"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.2 } }}
            exit={{ opacity: 0, transition: { duration: 0.12 } }}
            className="fixed inset-x-0 bottom-0 top-[var(--nav)] z-40 overflow-y-auto bg-ground"
            onClick={() => setMenu(false)}
          >
            <nav aria-label="Menú" className="wrap flex min-h-full flex-col py-4">
              {links.map((l) => (
                <a key={l.href} href={l.href} className="flex h-14 items-center border-b border-line font-display text-2xl">
                  {l.label}
                </a>
              ))}
              <a href="#cotizador" className="btn btn-primary mt-8 w-full">
                {MAIN_ACTION}
                <ArrowGlyph />
              </a>
              <div className="mt-auto pt-10 text-muted">
                <p>{placeLine}</p>
                {business.hours.map((h) => (
                  <p key={h.days}>
                    {h.days}: {h.opens} a {h.closes}
                  </p>
                ))}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
