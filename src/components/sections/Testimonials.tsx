import { testimonials } from "@/data/content";

/**
 * Real reviews only. While `testimonials` in content.ts is empty this renders nothing.
 * TODO: add the client's real reviews (quote, name, event) to show this block.
 */
export function Testimonials() {
  if (testimonials.length === 0) return null;
  return (
    <section id="opiniones" className="section-screen" aria-labelledby="opiniones-h">
      <div className="wrap">
        <h2 id="opiniones-h" className="t-h2">Lo que dicen nuestros clientes</h2>
        <ul className="mt-12 grid gap-6 lg:grid-cols-3">
          {testimonials.map((t) => (
            <li key={t.author} className="border-t border-line pt-6">
              <blockquote className="font-display text-[22px] leading-snug">“{t.quote}”</blockquote>
              <p className="mt-4 text-muted">{t.author}, {t.event}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
