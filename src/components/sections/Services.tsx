import { addonServices, chairService, decorationPackages, includedServices, inflatables, lowestPrice, pricing, tableService, venueService } from "@/data/pricing";
import { formatMXN } from "@/lib/quote";
import { ServiceIconSvg, type ServiceIcon } from "@/components/icons/ServiceIcons";

interface Card {
  id: string;
  name: string;
  description: string;
  icon: ServiceIcon;
  price: string | null; // null = included
}

/** Every service shown here is read from pricing.ts, so new services appear automatically. */
function buildCards(): Card[] {
  return [
    { id: venueService.id, name: venueService.name, description: venueService.description, icon: venueService.icon, price: `Desde ${formatMXN(lowestPrice(Object.values(venueService.rates)))}` },
    { id: pricing.decoration.name, name: pricing.decoration.name, description: pricing.decoration.description, icon: pricing.decoration.icon, price: `Desde ${formatMXN(lowestPrice(decorationPackages.map((d) => d.price)))}` },
    { id: pricing.inflatables.name, name: pricing.inflatables.name, description: pricing.inflatables.description, icon: pricing.inflatables.icon, price: `Desde ${formatMXN(lowestPrice(inflatables.map((i) => i.price)))}` },
    ...includedServices.map((s) => ({ id: s.id, name: s.name, description: s.description, icon: s.icon, price: null })),
    { id: tableService.id, name: tableService.name, description: tableService.description, icon: tableService.icon, price: `${formatMXN(tableService.unitPrice)} por mesa` },
    { id: chairService.id, name: chairService.name, description: chairService.description, icon: chairService.icon, price: `${formatMXN(chairService.unitPrice)} por silla` },
    ...addonServices.map((s) => ({ id: s.id, name: s.name, description: s.description, icon: s.icon, price: `${formatMXN(s.price)} por evento` })),
  ];
}

export function Services() {
  const cards = buildCards();
  return (
    <section id="servicios" className="section-screen bg-surface" aria-labelledby="servicios-h">
      <div className="wrap">
        <h2 id="servicios-h" className="t-h2 reveal max-w-[22ch] lg:max-w-none">
          Servicios del salón. <span className="text-muted">Mucho más que mesas y sillas.</span>
        </h2>
        <p className="reveal t-lead mt-3 max-w-[40em] text-ink-soft lg:max-w-none" style={{ ["--reveal-i" as string]: 1 }}>
          Rentamos el salón y lo dejamos listo: mobiliario, decoración con globos, inflables y la cocina para tu comida.
        </p>
        <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:mt-10 lg:grid-cols-4 lg:gap-6">
          {cards.map((c, i) => (
            <li key={c.id} className="reveal" style={{ ["--reveal-i" as string]: (i % 4) + 1 }}>
              <a href="#cotizador" className="card-link flex h-full flex-col border border-line bg-ground p-6 lg:px-6 lg:py-5">
                <span className="flex items-start justify-between gap-3">
                  <ServiceIconSvg name={c.icon} className="h-8 w-8 text-accent-deep" />
                  {c.price === null && (
                    <span className="t-label rounded-[2px] bg-garden px-2.5 py-1.5 text-white">Incluido sin costo</span>
                  )}
                </span>
                <h3 className="mt-4 font-display text-[21px] leading-snug">{c.name}</h3>
                <p className="mt-1.5 text-[16px] leading-[1.5] text-muted">{c.description}</p>
                <p className={`tabular mt-auto pt-4 text-[16px] font-medium ${c.price === null ? "text-garden" : "text-ink"}`} data-assumed={c.price ? "" : undefined}>
                  {c.price ?? "En la renta"}
                </p>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
