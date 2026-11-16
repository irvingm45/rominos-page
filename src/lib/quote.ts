// Pure quote logic: no React here, so it is easy to test and reuse.

import {
  addonServices,
  chairService,
  decorationPackages,
  inflatables,
  includedServices,
  pricing,
  tableService,
  venueService,
  type DayType,
} from "@/data/pricing";
import { eventTypes } from "@/data/content";
import { business, whatsappLink } from "@/data/business";

export interface QuoteState {
  eventType: string;
  /** ISO date (YYYY-MM-DD) or null while the visitor has not picked one. */
  date: string | null;
  guests: number;
  tables: number;
  chairs: number;
  /** While true, tables and chairs follow the guest count. */
  autoFurniture: boolean;
  decoration: string | null;
  inflatables: string[];
  addons: string[];
}

export interface QuoteLine {
  id: string;
  label: string;
  detail?: string;
  amount: number;
}

export interface Quote {
  lines: QuoteLine[];
  included: { id: string; label: string }[];
  total: number;
  dayType: DayType | null;
}

const mxn = new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 });
export const formatMXN = (n: number) => mxn.format(Math.round(n));

export const parseISODate = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
};

export const toISODate = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const longDate = new Intl.DateTimeFormat("es-MX", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
export const formatLongDate = (iso: string) => {
  const s = longDate.format(parseISODate(iso));
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export function dayTypeOf(iso: string): DayType {
  const dow = parseISODate(iso).getDay();
  if (dow === 6) return "saturday";
  if (dow === 5 || dow === 0) return "fridaySunday";
  return "weekday";
}

export function suggestFurniture(guests: number) {
  return { tables: Math.max(1, Math.ceil(guests / pricing.guestsPerTable)), chairs: guests };
}

export function initialQuoteState(eventId = "infantil"): QuoteState {
  return applyEventPreset(
    {
      eventType: eventId,
      date: null,
      guests: pricing.guests.default,
      tables: 0,
      chairs: 0,
      autoFurniture: true,
      decoration: null,
      inflatables: [],
      addons: [],
    },
    eventId,
  );
}

/** Loads an event type's suggested setup, keeping the date the visitor already chose. */
export function applyEventPreset(state: QuoteState, eventId: string): QuoteState {
  const ev = eventTypes.find((e) => e.id === eventId);
  if (!ev) return state;
  const guests = clampGuests(ev.suggested.guests);
  return {
    ...state,
    eventType: ev.id,
    guests,
    ...suggestFurniture(guests),
    autoFurniture: true,
    decoration: ev.suggested.decoration,
    inflatables: [...ev.suggested.inflatables],
    addons: [...ev.suggested.addons],
  };
}

export const clampGuests = (n: number) =>
  Math.min(pricing.guests.max, Math.max(pricing.guests.min, Math.round(n)));

export function computeQuote(s: QuoteState): Quote {
  const lines: QuoteLine[] = [];
  const dayType = s.date ? dayTypeOf(s.date) : null;
  // Without a date the estimate uses the Saturday rate, the most requested day.
  const rateKey: DayType = dayType ?? "saturday";
  lines.push({
    id: "venue",
    label: venueService.name,
    detail: s.date ? venueService.rateLabels[rateKey] : `${venueService.rateLabels[rateKey]}, sin fecha elegida`,
    amount: venueService.rates[rateKey],
  });

  if (s.tables > 0) {
    lines.push({
      id: "tables",
      label: `${s.tables} ${s.tables === 1 ? tableService.unit.singular : tableService.unit.plural}`,
      detail: `${formatMXN(tableService.unitPrice)} c/u`,
      amount: s.tables * tableService.unitPrice,
    });
  }
  if (s.chairs > 0) {
    lines.push({
      id: "chairs",
      label: `${s.chairs} ${s.chairs === 1 ? chairService.unit.singular : chairService.unit.plural}`,
      detail: `${formatMXN(chairService.unitPrice)} c/u`,
      amount: s.chairs * chairService.unitPrice,
    });
  }

  for (const addon of addonServices) {
    if (s.addons.includes(addon.id)) lines.push({ id: addon.id, label: addon.name, amount: addon.price });
  }

  const deco = decorationPackages.find((d) => d.id === s.decoration);
  if (deco) lines.push({ id: `deco-${deco.id}`, label: `Decoración ${deco.name.toLowerCase()}`, amount: deco.price });

  for (const inf of inflatables) {
    if (s.inflatables.includes(inf.id)) lines.push({ id: `inf-${inf.id}`, label: inf.name, amount: inf.price });
  }

  return {
    lines,
    included: includedServices.map((i) => ({ id: i.id, label: i.name })),
    total: lines.reduce((sum, l) => sum + l.amount, 0),
    dayType,
  };
}

export function buildWhatsAppMessage(s: QuoteState, q: Quote): string {
  const ev = eventTypes.find((e) => e.id === s.eventType);
  const out = [
    `Hola, quiero cotizar un evento en ${business.alternateName}.`,
    "",
    `Tipo de evento: ${ev?.name ?? s.eventType}`,
    `Fecha: ${s.date ? formatLongDate(s.date) : "por definir"}`,
    `Invitados: ${s.guests}`,
    "",
    ...q.lines.map((l) => `• ${l.label}${l.detail && l.id === "venue" ? ` (${l.detail})` : ""}: ${formatMXN(l.amount)}`),
    ...(q.included.length ? [`• Incluido sin costo: ${joinEs(q.included.map((i) => i.label.toLowerCase()))}`] : []),
    "",
    `Total estimado: ${formatMXN(q.total)}`,
    s.date ? "¿Me confirman si la fecha está disponible?" : "¿Qué fechas tienen disponibles?",
  ];
  return out.join("\n");
}

/** "a, b y c" */
export const joinEs = (items: string[]) =>
  items.length <= 1 ? items.join("") : `${items.slice(0, -1).join(", ")} y ${items[items.length - 1]}`;

export const quoteWhatsAppUrl = (s: QuoteState) => whatsappLink(buildWhatsAppMessage(s, computeQuote(s)));
