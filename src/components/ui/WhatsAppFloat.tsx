import { whatsappLink } from "@/data/business";
import { WhatsAppGlyph } from "./Glyphs";

/** Always-visible WhatsApp button. On phones it sits on the calculator's bottom bar, which leaves room for it. */
export function WhatsAppFloat() {
  return (
    <a
      href={whatsappLink("Hola, vi su página y quiero información sobre el salón.")}
      target="_blank"
      rel="noopener"
      aria-label="Escríbenos por WhatsApp"
      className="fixed bottom-[calc(16px+env(safe-area-inset-bottom))] right-4 z-40 grid h-14 w-14 place-items-center rounded-full bg-[#1f8f4e] text-white shadow-[0_10px_24px_-8px_rgb(0_0_0/0.45)] transition-transform duration-150 hover:-translate-y-0.5 active:translate-y-px active:scale-[.97] sm:right-6 sm:bottom-6 sm:h-[60px] sm:w-[60px]"
    >
      <WhatsAppGlyph width={30} height={30} />
    </a>
  );
}
