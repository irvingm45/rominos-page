import { business, placeLine, whatsappLink } from "@/data/business";
import { FacebookGlyph, InstagramGlyph, WhatsAppGlyph } from "@/components/ui/Glyphs";

export function Location() {
  const { street, reference } = business.address;
  return (
    <section id="ubicacion" className="section-screen" aria-labelledby="ubicacion-h">
      <div className="wrap">
        <h2 id="ubicacion-h" className="t-h2 reveal">Cómo llegar</h2>
        {/* Type moment: the town set large, linked to the venue's map pin. */}
        <p className="reveal mt-4 font-display text-[clamp(40px,5.6vw,84px)] leading-[1.02] tracking-[-0.03em]" style={{ ["--reveal-i" as string]: 1 }}>
          <a href={business.maps.url} target="_blank" rel="noopener" className="link [background-size:0%_2px,100%_2px] hover:[background-size:100%_2px,100%_2px]">
            {placeLine}
          </a>
        </p>

        <div className="mt-10 grid gap-6 lg:mt-12 lg:grid-cols-12">
          <div className="reveal bg-surface p-6 sm:p-10 lg:col-span-6" style={{ ["--reveal-i" as string]: 2 }}>
            <div className="grid gap-8 sm:grid-cols-2">
              <div>
                <h3 className="t-label text-muted">Dirección</h3>
                <p className="mt-2 text-[18px] leading-snug">
                  {street && <>{street}<br /></>}
                  {placeLine}
                </p>
                <p className="mt-1 text-muted">{reference}</p>
                <a href={business.maps.url} target="_blank" rel="noopener" className="link mt-4 inline-block font-medium text-accent-deep">
                  Abrir en Google Maps
                </a>
              </div>
              <div>
                <h3 className="t-label text-muted">Horario de atención</h3>
                <dl className="mt-2 space-y-1" data-assumed="">
                  {business.hours.map((h) => (
                    <div key={h.days} className="flex justify-between gap-4">
                      <dt>{h.days}</dt>
                      <dd className="tabular">{h.opens} a {h.closes}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
            <div className="mt-8 border-t border-line pt-6">
              <h3 className="t-label text-muted">Contacto</h3>
              <ul className="mt-3 grid gap-1 sm:grid-cols-2">
                <li>
                  <a href={whatsappLink("Hola, quiero información sobre el salón.")} target="_blank" rel="noopener" className="flex min-h-11 items-center gap-3 font-medium hover:text-accent-deep">
                    <WhatsAppGlyph className="text-[#1f8f4e]" /> WhatsApp
                  </a>
                </li>
                <li>
                  <a href={`tel:${business.phone.e164}`} className="tabular flex min-h-11 items-center gap-3 font-medium hover:text-accent-deep">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" /></svg>
                    {business.phone.display}
                  </a>
                </li>
                <li>
                  <a href={business.social.facebook} target="_blank" rel="noopener" className="flex min-h-11 items-center gap-3 font-medium hover:text-accent-deep">
                    <FacebookGlyph className="text-[#1877f2]" /> Facebook
                  </a>
                </li>
                <li>
                  <a href={business.social.instagram} target="_blank" rel="noopener" className="flex min-h-11 items-center gap-3 font-medium hover:text-accent-deep">
                    <InstagramGlyph className="text-[#c13584]" /> Instagram
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="reveal relative min-h-[320px] overflow-hidden bg-surface lg:col-span-6" style={{ ["--reveal-i" as string]: 3 }}>
            <iframe
              src={business.maps.embed}
              title={`Mapa de ${business.alternateName} en ${placeLine}`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 h-full w-full border-0 grayscale-[35%]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
