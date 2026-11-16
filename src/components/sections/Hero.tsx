import { business, whatsappLink, MAIN_ACTION } from "@/data/business";
import { Photo } from "@/components/ui/Photo";
import { lowestPrice, venueService } from "@/data/pricing";
import { formatMXN } from "@/lib/quote";
import { ArrowGlyph, WhatsAppGlyph } from "@/components/ui/Glyphs";

const headline = `${business.name}, salón y jardín en San Martín Texmelucan`;

/** Place hero: the garden photograph full-bleed under the header, the words on the ground below. */
export function Hero() {
  const words = headline.split(" ");
  return (
    <section className="hero relative flex h-svh min-h-[640px] flex-col pt-[var(--nav)]" data-enter aria-labelledby="hero-h">
      <div className="hero-photo relative min-h-[292px] flex-1 overflow-hidden bg-surface">
        <Photo
          id="jardin"
          alt="Jardín de Róminos con pasto y setos frente al salón techado"
          sizes="100vw"
          priority
          className="absolute inset-0"
          imgClassName="h-full w-full object-cover object-[50%_24%]"
        />
      </div>
      <div className="wrap grid gap-5 pb-[calc(88px+env(safe-area-inset-bottom))] pt-6 sm:pt-10 sm:pb-16 lg:grid-cols-12 lg:gap-6">
        <h1 id="hero-h" className="text-[32px] leading-[1.12] sm:text-[44px] lg:col-span-6 lg:text-[52px] lg:leading-[1.06]">
          {words.map((w, i) => (
            <span key={i}>
              <span className="hero-word">
                <span style={{ ["--i" as string]: i }}>{w}</span>
              </span>
              {i < words.length - 1 ? " " : ""}
            </span>
          ))}
        </h1>
        <div className="lg:col-span-6 lg:col-start-7">
          <p className="hero-after t-lead max-w-[34em] text-ink-soft" style={{ ["--i" as string]: 0 }}>
            Bodas, XV años y fiestas infantiles. Renta desde{" "}
            <span data-assumed="">{formatMXN(lowestPrice(Object.values(venueService.rates)))}</span>, con jardín, cocina y área de juegos incluidos.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <a href="#cotizador" className="hero-after btn btn-primary" style={{ ["--i" as string]: 1 }}>
              {MAIN_ACTION}
              <ArrowGlyph />
            </a>
            <a
              href={whatsappLink("Hola, vi su página y quiero información sobre el salón.")}
              target="_blank"
              rel="noopener"
              className="hero-after btn btn-outline"
              style={{ ["--i" as string]: 2 }}
            >
              <WhatsAppGlyph />
              Escríbenos por WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
