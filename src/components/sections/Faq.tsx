import { faq } from "@/data/content";
import { whatsappLink } from "@/data/business";

export function Faq() {
  return (
    <section id="preguntas" className="section-screen bg-surface" aria-labelledby="preguntas-h">
      <div className="wrap grid gap-10 lg:grid-cols-12 lg:gap-6">
        <div className="lg:col-span-6">
          <h2 id="preguntas-h" className="t-h2 reveal">Preguntas frecuentes</h2>
          <p className="reveal t-lead mt-4 max-w-[26em] text-ink-soft" style={{ ["--reveal-i" as string]: 1 }}>
            Si tu duda no está aquí, escríbenos y te respondemos por WhatsApp.
          </p>
          <a href={whatsappLink("Hola, tengo una pregunta sobre el salón.")} target="_blank" rel="noopener" className="reveal link mt-6 inline-block font-medium text-accent-deep" style={{ ["--reveal-i" as string]: 2 }}>
            Hacer una pregunta por WhatsApp
          </a>
        </div>
        <div className="reveal lg:col-span-6" style={{ ["--reveal-i" as string]: 2 }}>
          {faq.map((f, i) => (
            <details key={f.question} className="faq group border-b border-line first:border-t" open={i === 0}>
              <summary className="flex min-h-16 cursor-pointer items-center justify-between gap-6 py-4 text-[18px] font-medium leading-snug">
                {f.question}
                <span aria-hidden="true" className="relative h-4 w-4 shrink-0">
                  <span className="absolute left-0 top-1/2 h-[1.5px] w-4 -translate-y-1/2 bg-ink" />
                  <span className="absolute left-1/2 top-0 h-4 w-[1.5px] -translate-x-1/2 bg-ink transition-transform duration-200 group-open:scale-y-0" />
                </span>
              </summary>
              {/* TODO answers live in content.ts (todo: true) until the client confirms them. */}
              <p className="faq-a max-w-[38em] pb-5 text-ink-soft">{f.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
