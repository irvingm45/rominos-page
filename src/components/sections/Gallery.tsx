"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "motion/react";
import { gallery, gallerySpaces, type GalleryItem } from "@/data/content";
import type { PhotoId } from "@/data/photos.generated";
import { Photo } from "@/components/ui/Photo";

// Grid footprint per photo, picked from each photo's shape.
const span: Partial<Record<PhotoId, string>> = {
  "salon-amplio": "col-span-2 row-span-2",
  juegos: "row-span-2",
  comedor: "row-span-2",
  jardin: "col-span-2",
};

type Filter = GalleryItem["space"] | "todos";

export function Gallery() {
  const [filter, setFilter] = useState<Filter>("todos");
  const [open, setOpen] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const reduce = useReducedMotion();
  const items = gallery.filter((g) => filter === "todos" || g.space === filter);

  const show = useCallback((i: number) => {
    setOpen(i);
    dialogRef.current?.showModal();
  }, []);
  const step = useCallback((d: number) => setOpen((i) => (i === null ? i : (i + d + items.length) % items.length)), [items.length]);

  useEffect(() => {
    const dlg = dialogRef.current;
    if (!dlg) return;
    const onClose = () => setOpen(null);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    dlg.addEventListener("close", onClose);
    dlg.addEventListener("keydown", onKey);
    return () => {
      dlg.removeEventListener("close", onClose);
      dlg.removeEventListener("keydown", onKey);
    };
  }, [step]);

  const current = open !== null ? items[open] : null;

  return (
    <section id="galeria" className="section-screen bg-surface" aria-labelledby="galeria-h">
      <div className="wrap">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <h2 id="galeria-h" className="t-h2 reveal">Galería del salón</h2>
          <div className="reveal flex flex-wrap gap-1 sm:gap-2" role="group" aria-label="Filtrar por espacio" style={{ ["--reveal-i" as string]: 1 }}>
            {gallerySpaces.map((s) => {
              const on = s.id === filter;
              return (
                <button
                  key={s.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setFilter(s.id)}
                  className={`relative min-h-11 rounded-full px-4 text-[15px] sm:px-5 font-medium transition-colors duration-150 ${on ? "text-inv-ink" : "text-ink hover:bg-ink/6"}`}
                >
                  {on && <motion.span layoutId="gallery-pill" className="absolute inset-0 rounded-full bg-ink" transition={{ duration: reduce ? 0 : 0.24, ease: [0.65, 0, 0.35, 1] }} />}
                  <span className="relative">{s.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <LayoutGroup>
          <motion.ul layout={!reduce} className="mt-8 grid grid-flow-dense auto-rows-[150px] grid-cols-2 gap-3 sm:auto-rows-[200px] lg:mt-10 lg:auto-rows-[170px] lg:grid-cols-4 lg:gap-4">
            <AnimatePresence mode="popLayout" initial={false}>
              {items.map((g, i) => (
                <motion.li
                  key={g.photo}
                  layout={!reduce}
                  initial={reduce ? false : { opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={reduce ? undefined : { opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className={filter === "todos" ? span[g.photo] ?? "" : "col-span-2 row-span-2"}
                >
                  <button type="button" onClick={() => show(i)} className="zoom-frame card-link block h-full w-full bg-surface-2" aria-label={`Ver foto: ${g.alt}`}>
                    <Photo id={g.photo} alt={g.alt} sizes="(min-width: 1024px) 600px, 100vw" imgClassName="h-full w-full object-cover" imgStyle={g.photo === "jardin" ? { objectPosition: "50% 30%" } : g.photo === "juegos" ? { objectPosition: "50% 25%" } : undefined} />
                  </button>
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        </LayoutGroup>
      </div>

      <dialog
        ref={dialogRef}
        className="lightbox m-auto h-[100svh] max-h-none w-screen max-w-none bg-transparent p-0 text-inv-ink backdrop:bg-black/85"
        aria-label={current ? current.alt : "Foto de la galería"}
        onClick={(e) => e.target === e.currentTarget && dialogRef.current?.close()}
      >
        <div className="relative flex h-full w-full items-center justify-center px-4 py-20 sm:px-20" onClick={(e) => e.target === e.currentTarget && dialogRef.current?.close()}>
          <AnimatePresence mode="wait" initial={false}>
            {current && (
              <motion.div
                key={current.photo}
                initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } }}
                exit={{ opacity: 0, transition: { duration: 0.15 } }}
                className="max-h-full max-w-[1200px]"
              >
                <Photo id={current.photo} alt={current.alt} sizes="90vw" imgClassName="max-h-[calc(100svh-160px)] w-auto max-w-full object-contain" />
              </motion.div>
            )}
          </AnimatePresence>
          <p className="tabular absolute left-1/2 top-6 -translate-x-1/2 text-[14px] text-inv-muted" aria-live="polite">
            {open !== null && `${open + 1} / ${items.length}`}
          </p>
          <button type="button" onClick={() => dialogRef.current?.close()} className="absolute right-4 top-4 grid h-12 w-12 place-items-center rounded-full bg-white/10 transition-colors hover:bg-white/20" aria-label="Cerrar galería">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
          </button>
          {items.length > 1 && (
            <>
              <button type="button" onClick={() => step(-1)} className="absolute bottom-6 left-1/2 grid h-12 w-12 -translate-x-[calc(100%+8px)] place-items-center rounded-full bg-white/10 transition-colors hover:bg-white/20 sm:bottom-auto sm:left-4 sm:top-1/2 sm:-translate-y-1/2 sm:translate-x-0" aria-label="Foto anterior">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
              </button>
              <button type="button" onClick={() => step(1)} className="absolute bottom-6 right-1/2 grid h-12 w-12 translate-x-[calc(100%+8px)] place-items-center rounded-full bg-white/10 transition-colors hover:bg-white/20 sm:bottom-auto sm:right-4 sm:top-1/2 sm:-translate-y-1/2 sm:translate-x-0" aria-label="Foto siguiente">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg>
              </button>
            </>
          )}
        </div>
      </dialog>
    </section>
  );
}
