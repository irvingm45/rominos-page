"use client";

import { createContext, useContext, useMemo, useReducer, type ReactNode } from "react";
import { addonServices } from "@/data/pricing";
import {
  applyEventPreset,
  clampGuests,
  computeQuote,
  initialQuoteState,
  suggestFurniture,
  type Quote,
  type QuoteState,
} from "@/lib/quote";

type Action =
  | { type: "preset"; eventId: string }
  | { type: "eventType"; eventId: string }
  | { type: "date"; date: string | null }
  | { type: "guests"; guests: number }
  | { type: "tables"; value: number }
  | { type: "chairs"; value: number }
  | { type: "resetFurniture" }
  | { type: "decoration"; id: string | null }
  | { type: "toggleInflatable"; id: string }
  | { type: "toggleAddon"; id: string };

const toggle = (list: string[], id: string) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);

function reducer(s: QuoteState, a: Action): QuoteState {
  switch (a.type) {
    case "preset":
      return applyEventPreset(s, a.eventId);
    case "eventType":
      return { ...s, eventType: a.eventId };
    case "date":
      return { ...s, date: a.date };
    case "guests": {
      const guests = clampGuests(a.guests);
      return s.autoFurniture ? { ...s, guests, ...suggestFurniture(guests) } : { ...s, guests };
    }
    case "tables":
      return { ...s, tables: Math.max(0, Math.min(40, a.value)), autoFurniture: false };
    case "chairs":
      return { ...s, chairs: Math.max(0, Math.min(400, a.value)), autoFurniture: false };
    case "resetFurniture":
      return { ...s, ...suggestFurniture(s.guests), autoFurniture: true };
    case "decoration":
      return { ...s, decoration: a.id };
    case "toggleInflatable":
      return { ...s, inflatables: toggle(s.inflatables, a.id) };
    case "toggleAddon":
      return addonServices.some((x) => x.id === a.id) ? { ...s, addons: toggle(s.addons, a.id) } : s;
  }
}

interface Ctx {
  state: QuoteState;
  quote: Quote;
  dispatch: React.Dispatch<Action>;
}

const QuoteCtx = createContext<Ctx | null>(null);

export function QuoteProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, () => initialQuoteState());
  const quote = useMemo(() => computeQuote(state), [state]);
  const value = useMemo(() => ({ state, quote, dispatch }), [state, quote]);
  return <QuoteCtx.Provider value={value}>{children}</QuoteCtx.Provider>;
}

export function useQuote() {
  const ctx = useContext(QuoteCtx);
  if (!ctx) throw new Error("useQuote must be used inside <QuoteProvider>");
  return ctx;
}
