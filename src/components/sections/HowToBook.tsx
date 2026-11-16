import { bookingSteps } from "@/data/content";
import { Photo } from "@/components/ui/Photo";

export function HowToBook() {
  return (
    <section id="reservar" className="section-screen" aria-labelledby="reservar-h">
      <div className="wrap grid gap-10 lg:grid-cols-12 lg:gap-6">
        <div className="lg:col-span-6">
          <h2 id="reservar-h" className="t-h2 reveal">Cómo apartar tu fecha</h2>
          <p className="reveal t-lead mt-4 max-w-[30em] text-ink-soft" style={{ ["--reveal-i" as string]: 1 }}>
            Cotizas en línea y lo demás lo arreglamos contigo por WhatsApp.
          </p>
          <ol className="steps relative mt-10 lg:mt-12">
            {bookingSteps.map((s, i) => (
              <li key={s.title} className="reveal relative grid grid-cols-[40px_1fr] gap-x-5 pb-8 last:pb-0" style={{ ["--reveal-i" as string]: i + 2 }}>
                {i < bookingSteps.length - 1 && <span aria-hidden="true" className="step-line absolute left-[19.5px] top-11 bottom-1 w-px bg-line" />}
                <span className="tabular grid h-10 w-10 place-items-center rounded-full border border-ink font-medium">{i + 1}</span>
                <div className="pt-1.5">
                  <h3 className="font-display text-[22px] leading-tight">{s.title}</h3>
                  <p className="mt-1 max-w-[32em] text-ink-soft">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        {/* Dealt moment: the photograph develops once as it comes on screen. */}
        <figure className="reveal develop m-0 self-start lg:col-span-6" data-moment="picture-develops">
          <div className="aspect-[4/3] overflow-hidden bg-surface lg:aspect-square">
            <Photo id="jardin-juegos" alt="Jardín con setos podados y el área de juegos al fondo" sizes="(min-width: 1024px) 588px, 100vw" imgStyle={{ objectPosition: "50% 40%" }} imgClassName="h-full w-full object-cover" />
          </div>
        </figure>
      </div>
    </section>
  );
}
