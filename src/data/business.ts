// Business data in one place: name, contact, social links, address and hours.
// Everything marked TODO must be confirmed with the client before launch.

export interface OpeningHours {
  days: string;
  /** Machine-readable days for JSON-LD (schema.org DayOfWeek names). */
  schemaDays: string[];
  opens: string; // "HH:MM"
  closes: string; // "HH:MM"
}

export const business = {
  name: "Róminos",
  /** How the name is written on the client's logo and Google Maps pin. */
  alternateName: "Salón Rominos", // TODO: confirmar la ortografía oficial (con o sin acento)
  category: "Salón de eventos",
  slogan: "La vida son momentos, celébralos con nosotros.",

  phone: {
    display: "222 120 8336", // TODO: confirmar (tomado del logo)
    e164: "+522221208336",
  },
  /** WhatsApp number in international format, digits only (52 = México). */
  whatsapp: "522221208336", // TODO: confirmar

  social: {
    facebook: "https://www.facebook.com/", // TODO: URL real de la página de Facebook
    instagram: "https://www.instagram.com/", // TODO: URL real del perfil de Instagram
  },

  address: {
    street: "Calle Mariano Abasolo, Col. Los Dicios", // TODO: confirmar (tomado de la ficha de Google Maps; sin número a propósito)
    locality: "San Martín Texmelucan",
    region: "Puebla",
    postalCode: "", // TODO: código postal
    country: "MX",
    /** A landmark that helps guests find the place. */
    reference: "Cerca de la Terminal de Autobuses AU", // TODO: confirmar referencia
  },

  maps: {
    /** Opens the venue's Google Maps pin. */
    url: "https://www.google.com/maps/search/?api=1&query=Sal%C3%B3n%20Rominos%2C%20San%20Mart%C3%ADn%20Texmelucan%2C%20Puebla",
    embed: "https://www.google.com/maps?q=Sal%C3%B3n%20Rominos%2C%20San%20Mart%C3%ADn%20Texmelucan%2C%20Puebla&output=embed",
  },

  /** Hours when the venue answers messages and shows the space. */
  hours: [
    // TODO: horario real de atención
    { days: "Lunes a viernes", schemaDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "10:00", closes: "19:00" },
    { days: "Sábado", schemaDays: ["Saturday"], opens: "10:00", closes: "14:00" },
  ] satisfies OpeningHours[],

  /** Public URL of the site, used for canonical links and structured data. */
  siteUrl: "https://rominos.example", // TODO: dominio real
} as const;

export const whatsappLink = (text?: string) =>
  `https://wa.me/${business.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ""}`;

export const placeLine = `${business.address.locality}, ${business.address.region}`;

/** The main action, worded the same in the nav, the hero, the close and the menu. */
export const MAIN_ACTION = "Cotiza tu evento";
