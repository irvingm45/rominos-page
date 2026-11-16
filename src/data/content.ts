// Page content that is not a price: event types, gallery, booking steps and FAQ.

import type { PhotoId } from "./photos.generated";

export interface EventType {
  id: string;
  name: string;
  /** Short phrase used inside sentences and the WhatsApp message ("tu boda"). */
  inSentence: string;
  description: string;
  photo: PhotoId;
  photoAlt: string;
  /** CSS object-position for the crop, when the subject is not centred. */
  photoPosition?: string;
  /** Starting point loaded into the calculator. Not a rule: the visitor can change everything. */
  suggested: {
    guests: number;
    decoration: string | null; // a decoration package id from pricing.ts
    inflatables: string[]; // inflatable ids from pricing.ts
    addons: string[]; // addon service ids from pricing.ts
  };
  setupNotes: string[];
}

export const eventTypes: EventType[] = [
  {
    id: "boda",
    name: "Bodas",
    inSentence: "boda",
    description: "Ceremonia en el jardín y recepción en el salón techado, con mesas vestidas y decoración completa.",
    photo: "salon-amplio",
    photoAlt: "Salón techado con mesas redondas, manteles blancos y vista al jardín",
    suggested: { guests: 150, decoration: "premium", inflatables: [], addons: [] },
    setupNotes: ["Ceremonia en el jardín", "Mesa de honor al fondo del salón", "Pista frente a la mesa principal"],
  },
  {
    id: "xv",
    name: "XV años",
    inSentence: "fiesta de XV años",
    description: "Espacio para el vals, la mesa de honor y las fotos en el jardín con tu familia.",
    photo: "comedor",
    photoAlt: "Mesas redondas con manteles blancos y sillas negras dentro del salón",
    suggested: { guests: 120, decoration: "premium", inflatables: [], addons: [] },
    setupNotes: ["Pista para el vals al centro", "Mesa de honor decorada", "Fotos en el jardín"],
  },
  {
    id: "infantil",
    name: "Fiestas infantiles",
    inSentence: "fiesta infantil",
    description: "Los niños juegan en el área de juegos sin costo extra mientras los adultos comen en el salón.",
    photo: "juegos",
    photoAlt: "Área de juegos con resbaladilla, casita y juego de tubos sobre pasto",
    photoPosition: "50% 22%",
    suggested: { guests: 60, decoration: "media", inflatables: ["castillo"], addons: [] },
    setupNotes: ["Área de juegos incluida", "Inflable en el jardín", "Mesa de pastel con el tema"],
  },
  {
    id: "graduacion",
    name: "Graduaciones",
    inSentence: "graduación",
    description: "Cotiza por número de invitados y comparte el resumen con tu generación por WhatsApp.",
    photo: "salon-amplio",
    photoAlt: "Salón amplio con columnas blancas y mesas listas para recibir invitados",
    suggested: { guests: 100, decoration: "basica", inflatables: [], addons: [] },
    setupNotes: ["Mesas para toda la generación", "Arco para fotos", "Cocina para el banquete"],
  },
  {
    id: "religiosa",
    name: "Comuniones y confirmaciones",
    inSentence: "comunión o confirmación",
    description: "Una comida familiar después de misa, con jardín para que los niños salgan a jugar.",
    photo: "jardin-juegos",
    photoAlt: "Jardín con setos podados y el área de juegos al fondo",
    suggested: { guests: 80, decoration: "basica", inflatables: ["brincolin-blanco"], addons: [] },
    setupNotes: ["Decoración en tonos claros", "Brincolín blanco", "Comida en el salón"],
  },
  {
    id: "bautizo",
    name: "Bautizos",
    inSentence: "bautizo",
    description: "Celebra con padrinos y familia sin preocuparte por el mobiliario ni la decoración.",
    photo: "jardin",
    photoAlt: "Jardín con pasto y setos frente al salón techado",
    suggested: { guests: 70, decoration: "basica", inflatables: ["brincolin-blanco"], addons: [] },
    setupNotes: ["Mesa de padrinos", "Brincolín blanco", "Cocina para servir la comida"],
  },
  {
    id: "despedida",
    name: "Despedidas de solter@",
    inSentence: "despedida",
    description: "El salón solo para tu grupo, con la decoración y el ambiente que elijan.",
    photo: "comedor",
    photoAlt: "Interior del salón con mesas vestidas y cocina al fondo",
    suggested: { guests: 40, decoration: "media", inflatables: [], addons: [] },
    setupNotes: ["Mesas en media luna", "Fondo para fotos", "Espacio para bailar"],
  },
  {
    id: "familiar",
    name: "Fiestas familiares",
    inSentence: "fiesta familiar",
    description: "Cumpleaños, aniversarios o la comida de fin de año con toda la familia.",
    photo: "jardin",
    photoAlt: "Jardín del salón con pasto natural y setos",
    suggested: { guests: 50, decoration: null, inflatables: [], addons: [] },
    setupNotes: ["Mesas en el salón", "Niños en el área de juegos", "Sobremesa en el jardín"],
  },
];

export type SpaceId = "salon" | "jardin" | "cocina" | "juegos";

export interface SpaceChapter {
  id: SpaceId;
  name: string;
  text: string;
  photo: PhotoId;
  alt: string;
}

export const spaces: SpaceChapter[] = [
  {
    id: "salon",
    name: "Salón techado",
    text: "Mesas redondas, sillas acojinadas y lonas que bajan si llueve o hace frío.",
    photo: "salon-amplio",
    alt: "Salón techado con mesas redondas vestidas y sillas negras",
  },
  {
    id: "jardin",
    name: "Jardín",
    text: "Pasto natural y setos podados para la ceremonia, las fotos o los inflables. Va incluido en la renta.",
    photo: "jardin",
    alt: "Jardín con pasto y setos frente al salón con lonas negras",
  },
  {
    id: "cocina",
    name: "Cocina",
    text: "Barra y refrigerador al fondo del salón para servir la comida. Va incluida en la renta.",
    photo: "comedor",
    alt: "Interior del salón con mesas vestidas y la cocina al fondo",
  },
  {
    id: "juegos",
    name: "Área de juegos",
    text: "Resbaladilla, casita, trampolín y juego de tubos. Va incluida en la renta.",
    photo: "juegos",
    alt: "Área de juegos infantiles con resbaladilla rosa y juego de tubos",
  },
];

export interface GalleryItem {
  photo: PhotoId;
  alt: string;
  space: Exclude<SpaceId, "cocina">;
}

export const gallery: GalleryItem[] = [
  { photo: "salon-amplio", alt: "Salón techado con mesas redondas y vista al jardín", space: "salon" },
  { photo: "jardin", alt: "Jardín con setos frente al salón techado", space: "jardin" },
  { photo: "juegos", alt: "Área de juegos con resbaladilla, casita y trampolín", space: "juegos" },
  { photo: "comedor", alt: "Mesas con manteles blancos y sillas negras dentro del salón", space: "salon" },
  { photo: "jardin-juegos", alt: "Jardín con setos y el área de juegos al fondo", space: "jardin" },
  { photo: "inflable-blanco", alt: "Brincolín blanco junto al salón", space: "juegos" },
];

export const gallerySpaces: { id: GalleryItem["space"] | "todos"; label: string }[] = [
  { id: "todos", label: "Todos" },
  { id: "salon", label: "Salón" },
  { id: "jardin", label: "Jardín" },
  { id: "juegos", label: "Juegos" },
];

export const bookingSteps = [
  { title: "Cotiza", text: "Arma tu evento en el cotizador y envíanos el resumen por WhatsApp." },
  { title: "Aparta tu fecha", text: "Te confirmamos disponibilidad y apartas el día con un anticipo." },
  { title: "Personaliza", text: "Elegimos juntos colores, decoración, inflables y el acomodo de mesas." },
  { title: "Disfruta", text: "Llegas a un salón listo. Nosotros nos encargamos del montaje." },
];

export interface FaqItem {
  question: string;
  answer: string;
  /** true while the answer is a placeholder the client must replace. */
  todo: boolean;
}

export const faq: FaqItem[] = [
  {
    question: "¿Cuántos invitados caben?",
    answer: "Depende del acomodo entre salón y jardín. Escríbenos con tu número de invitados y te decimos cómo queda.",
    todo: true, // TODO: capacidad real sentados y de pie
  },
  {
    question: "¿Cuánto es el anticipo para apartar la fecha?",
    answer: "La fecha queda apartada con un anticipo. Te damos el monto y la forma de pago al confirmar tu cotización.",
    todo: true, // TODO: porcentaje o monto del anticipo y forma de pago
  },
  {
    question: "¿Cuántas horas incluye la renta?",
    answer: "Te confirmamos el horario del evento y el costo de horas extra junto con tu cotización.",
    todo: true, // TODO: horas incluidas y costo de hora extra
  },
  {
    question: "¿Qué pasa si necesito cancelar o cambiar la fecha?",
    answer: "Escríbenos lo antes posible por WhatsApp y revisamos tu caso según la fecha de tu evento.",
    todo: true, // TODO: política de cancelación y cambio de fecha
  },
  {
    question: "¿Puedo llevar mi comida, bebida o banquetero?",
    answer: "Sí puedes usar el área de cocina. Pregúntanos por las condiciones para banqueteros externos.",
    todo: true, // TODO: confirmar política de alimentos y bebidas
  },
  {
    question: "¿El jardín, la cocina y el área de juegos tienen costo?",
    answer: "No. Los tres van incluidos en la renta del salón. La decoración y los inflables se cobran aparte.",
    todo: false,
  },
];

/**
 * Real reviews only. Leave empty until the client provides them;
 * the testimonials block renders nothing while this list is empty.
 */
export const testimonials: { quote: string; author: string; event: string }[] = [];
