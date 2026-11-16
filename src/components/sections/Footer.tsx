import { business, MAIN_ACTION, placeLine } from "@/data/business";
import { ArrowGlyph, FacebookGlyph, InstagramGlyph, WhatsAppGlyph } from "@/components/ui/Glyphs";
import { whatsappLink } from "@/data/business";

const nav = [
  { href: "#eventos", label: "Eventos" },
  { href: "#servicios", label: "Servicios" },
  { href: "#decoracion", label: "Decoración" },
  { href: "#cotizador", label: "Cotizador" },
  { href: "#espacios", label: "Espacios" },
  { href: "#galeria", label: "Galería" },
  { href: "#preguntas", label: "Preguntas" },
];

/** The close and the footer are one section: the brand line with the main action, then the visit details. */
export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer id="contacto" className="closing section-screen flex flex-col bg-ground" aria-labelledby="cierre-h">
      <div className="wrap flex flex-1 flex-col">
        <div className="reveal border-b border-line pb-12">
          <h2 id="cierre-h" className="t-h2 max-w-[20ch]">{business.slogan.replace(", c", ". C")}</h2>
          <p className="t-lead mt-4 max-w-[34em] text-ink-soft">Arma tu cotización en línea y te confirmamos la fecha por WhatsApp.</p>
          <a href="#cotizador" className="btn btn-primary mt-8 w-full sm:w-auto">
            {MAIN_ACTION}
            <ArrowGlyph />
          </a>
        </div>

        <div className="grid gap-10 pt-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-6">
          <div className="lg:col-span-5">
            <h3 className="t-label text-muted">Visítanos</h3>
            <p className="mt-3 font-display text-[28px] leading-[1.15] sm:text-[32px]">
              <a href={business.maps.url} target="_blank" rel="noopener" className="link">{placeLine}</a>
            </p>
            <p className="mt-2 text-muted">{business.address.reference}</p>
          </div>
          <div className="lg:col-span-3">
            <h3 className="t-label text-muted">Horario de atención</h3>
            <dl className="mt-3 space-y-1" data-assumed="">
              {business.hours.map((h) => (
                <div key={h.days}>
                  <dt className="inline">{h.days}: </dt>
                  <dd className="tabular inline">{h.opens} a {h.closes}</dd>
                </div>
              ))}
            </dl>
          </div>
          <nav aria-label="Pie de página" className="lg:col-span-2">
            <h3 className="t-label text-muted">En esta página</h3>
            <ul className="mt-3 space-y-1">
              {nav.map((n) => (
                <li key={n.href}><a href={n.href} className="nav-word inline-flex min-h-7 items-center">{n.label}</a></li>
              ))}
            </ul>
          </nav>
          <div className="lg:col-span-2">
            <h3 className="t-label text-muted">Redes</h3>
            <ul className="mt-3 space-y-1">
              <li><a href={whatsappLink()} target="_blank" rel="noopener" className="nav-word inline-flex min-h-8 items-center gap-2"><WhatsAppGlyph width={16} height={16} />WhatsApp</a></li>
              <li><a href={business.social.facebook} target="_blank" rel="noopener" className="nav-word inline-flex min-h-8 items-center gap-2"><FacebookGlyph width={16} height={16} />Facebook</a></li>
              <li><a href={business.social.instagram} target="_blank" rel="noopener" className="nav-word inline-flex min-h-8 items-center gap-2"><InstagramGlyph width={16} height={16} />Instagram</a></li>
            </ul>
          </div>
        </div>

        <p aria-hidden="true" className="mt-auto select-none pt-10 font-display text-[min(12vw,132px)] leading-[0.85] tracking-[-0.04em] text-ink">
          {business.name}
        </p>
        <p className="mt-6 text-[13px] text-muted">
          © {year} {business.name}. {placeLine}.
        </p>
      </div>
    </footer>
  );
}
