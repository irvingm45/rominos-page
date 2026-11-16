"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { formatLongDate, toISODate, parseISODate } from "@/lib/quote";

const monthFmt = new Intl.DateTimeFormat("es-MX", { month: "long", year: "numeric" });
const dayFmt = new Intl.DateTimeFormat("es-MX", { weekday: "long", day: "numeric", month: "long" });
const WEEKDAYS = ["L", "M", "M", "J", "V", "S", "D"];
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

interface DatePickerProps {
  value: string | null;
  onChange: (iso: string) => void;
  labelId: string;
}

/** Month grid in a popover. Past days are disabled; arrow keys move between days. */
export function DatePicker({ value, onChange, labelId }: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);
  const minDate = useMemo(() => new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1), [today]);
  const maxDate = useMemo(() => new Date(today.getFullYear() + 1, today.getMonth() + 6, 0), [today]);
  const initial = value ? parseISODate(value) : minDate;
  const [view, setView] = useState(new Date(initial.getFullYear(), initial.getMonth(), 1));
  const [focus, setFocus] = useState<Date>(initial);
  const wrapRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const popId = useId();

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => !wrapRef.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Keep keyboard focus on the focused day while the grid is open.
  useEffect(() => {
    if (!open) return;
    const el = gridRef.current?.querySelector<HTMLButtonElement>(`[data-date="${toISODate(focus)}"]`);
    el?.focus();
  }, [focus, open, view]);

  const days = useMemo(() => {
    const first = new Date(view.getFullYear(), view.getMonth(), 1);
    const offset = (first.getDay() + 6) % 7;
    const count = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
    return { offset, count };
  }, [view]);

  const canPrev = view > new Date(minDate.getFullYear(), minDate.getMonth(), 1);
  const canNext = view < new Date(maxDate.getFullYear(), maxDate.getMonth(), 1);

  const moveFocus = (delta: number) => {
    const next = new Date(focus.getFullYear(), focus.getMonth(), focus.getDate() + delta);
    if (next < minDate || next > maxDate) return;
    setFocus(next);
    if (next.getMonth() !== view.getMonth() || next.getFullYear() !== view.getFullYear()) {
      setView(new Date(next.getFullYear(), next.getMonth(), 1));
    }
  };

  const onGridKey = (e: React.KeyboardEvent) => {
    const map: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
    if (e.key in map) {
      e.preventDefault();
      moveFocus(map[e.key]);
    }
  };

  const pick = (d: Date) => {
    onChange(toISODate(d));
    setOpen(false);
  };

  const shift = (m: number) => {
    const v = new Date(view.getFullYear(), view.getMonth() + m, 1);
    setView(v);
    const f = new Date(v.getFullYear(), v.getMonth(), 1);
    setFocus(f < minDate ? minDate : f);
  };

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={popId}
        aria-describedby={labelId}
        onClick={() => {
          setOpen((o) => !o);
          if (value) {
            const d = parseISODate(value);
            setView(new Date(d.getFullYear(), d.getMonth(), 1));
            setFocus(d);
          }
        }}
        className="flex h-12 w-full items-center justify-between gap-3 border border-line bg-ground px-4 text-left text-[16px] transition-colors duration-150 hover:border-ink"
      >
        <span className={value ? "text-ink" : "text-muted"}>{value ? formatLongDate(value) : "Elige una fecha"}</span>
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
          <rect x="3.5" y="5" width="17" height="15" rx="1.5" />
          <path d="M3.5 10h17M8 3v4M16 3v4" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id={popId}
            role="dialog"
            aria-label="Elegir fecha del evento"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.2, ease: [0.2, 0.8, 0.2, 1] } }}
            exit={{ opacity: 0, transition: { duration: 0.12 } }}
            className="absolute left-0 right-0 top-[calc(100%+8px)] z-30 border border-line bg-ground p-4 shadow-[0_24px_48px_-24px_rgb(30_29_27/0.35)] sm:right-auto sm:w-[344px]"
          >
            <div className="mb-3 flex items-center justify-between">
              <button type="button" onClick={() => shift(-1)} disabled={!canPrev} className="grid h-11 w-11 place-items-center rounded-full hover:bg-surface disabled:opacity-30" aria-label="Mes anterior">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
              </button>
              <p className="font-display text-lg" aria-live="polite">{cap(monthFmt.format(view))}</p>
              <button type="button" onClick={() => shift(1)} disabled={!canNext} className="grid h-11 w-11 place-items-center rounded-full hover:bg-surface disabled:opacity-30" aria-label="Mes siguiente">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
            <div className="grid grid-cols-7 text-center text-[13px] font-medium text-muted" aria-hidden="true">
              {WEEKDAYS.map((d, i) => <span key={i} className="py-1">{d}</span>)}
            </div>
            <div ref={gridRef} className="grid grid-cols-7 gap-0.5" onKeyDown={onGridKey}>
              {Array.from({ length: days.offset }, (_, i) => <span key={`e${i}`} />)}
              {Array.from({ length: days.count }, (_, i) => {
                const d = new Date(view.getFullYear(), view.getMonth(), i + 1);
                const iso = toISODate(d);
                const disabled = d < minDate || d > maxDate;
                const selected = iso === value;
                const focused = iso === toISODate(focus);
                const weekend = d.getDay() === 6;
                return (
                  <button
                    key={iso}
                    type="button"
                    data-date={iso}
                    disabled={disabled}
                    tabIndex={focused ? 0 : -1}
                    aria-pressed={selected}
                    aria-label={cap(dayFmt.format(d))}
                    onClick={() => pick(d)}
                    className={`tabular relative grid h-11 place-items-center rounded-[2px] text-[15px] transition-colors duration-100 ${
                      selected ? "bg-ink font-medium text-inv-ink" : disabled ? "text-ink/25" : "hover:bg-surface"
                    } ${weekend && !selected && !disabled ? "font-medium" : ""}`}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
