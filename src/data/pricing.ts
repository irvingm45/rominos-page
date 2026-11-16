// ONE file for every price, service, package and inflatable.
// The owner can change prices or add services here without touching any component.
// Every price below is a placeholder until the client confirms it.

import type { PhotoId } from "./photos.generated";
import type { ServiceIcon } from "@/components/icons/ServiceIcons";

export type DayType = "weekday" | "fridaySunday" | "saturday";

/** How a service is charged. The calculator and the services section read this. */
export type Service =
  | {
      id: string;
      kind: "venue"; // the hall itself, priced by day of the week
      name: string;
      description: string;
      icon: ServiceIcon;
      rates: Record<DayType, number>;
      rateLabels: Record<DayType, string>;
    }
  | {
      id: "tables" | "chairs";
      kind: "perUnit"; // priced per piece; the calculator suggests the quantity
      name: string;
      unit: { singular: string; plural: string };
      description: string;
      icon: ServiceIcon;
      unitPrice: number;
    }
  | {
      id: string;
      kind: "addon"; // a flat-price extra the visitor can switch on
      name: string;
      description: string;
      icon: ServiceIcon;
      price: number;
    }
  | {
      id: string;
      kind: "included"; // always part of the rental, no extra cost
      name: string;
      description: string;
      icon: ServiceIcon;
    };

export interface DecorationPackage {
  id: string;
  name: string;
  price: number;
  includes: string[];
}

export interface Inflatable {
  id: string;
  name: string;
  description: string;
  price: number;
  /** A photo id from photos.generated.ts, or null for a neutral placeholder. */
  photo: PhotoId | null;
}

export const pricing = {
  currency: "MXN",
  guestsPerTable: 10,
  guests: {
    min: 10,
    max: 200, // TODO: capacidad real del salón y el jardín
    step: 5,
    default: 80,
  },

  services: [
    {
      id: "venue",
      kind: "venue",
      name: "Renta del salón",
      description: "Salón techado con lonas que se cierran si llueve o hace frío.",
      icon: "hall",
      rates: {
        weekday: 3500, // TODO: precio real
        fridaySunday: 4500, // TODO: precio real
        saturday: 5500, // TODO: precio real
      },
      rateLabels: {
        weekday: "lunes a jueves",
        fridaySunday: "viernes o domingo",
        saturday: "sábado",
      },
    },
    {
      id: "tables",
      kind: "perUnit",
      name: "Mesas redondas con mantel",
      unit: { singular: "mesa con mantel", plural: "mesas con mantel" },
      description: "Mesas para 10 personas con mantel blanco.",
      icon: "table",
      unitPrice: 70, // TODO: precio real
    },
    {
      id: "chairs",
      kind: "perUnit",
      name: "Sillas acojinadas",
      unit: { singular: "silla", plural: "sillas" },
      description: "Sillas plegables negras con asiento acojinado.",
      icon: "chair",
      unitPrice: 15, // TODO: precio real
    },
    // Garden and kitchen come with every rental at no extra cost.
    // To charge for one later, change kind to "addon" and add `price`.
    {
      id: "garden",
      kind: "included",
      name: "Jardín",
      description: "Pasto natural con setos para la ceremonia, las fotos o los inflables.",
      icon: "garden",
    },
    {
      id: "kitchen",
      kind: "included",
      name: "Área de cocina",
      description: "Barra y refrigerador para que tu familia o tu banquetero sirva la comida.",
      icon: "kitchen",
    },
    {
      id: "playground",
      kind: "included",
      name: "Área de juegos infantiles",
      description: "Resbaladilla, casita, trampolín y juego de tubos para los niños.",
      icon: "playground",
    },
  ] satisfies Service[],

  decoration: {
    name: "Decoración con globos y adornos",
    description: "Arcos de globos, fondos y centros de mesa con los colores o el tema que elijas.",
    icon: "balloons" as ServiceIcon,
    packages: [
      {
        id: "basica",
        name: "Básica",
        price: 1500, // TODO: precio real
        includes: ["Arco de globos en la mesa principal", "Globos en la entrada"], // TODO: confirmar contenido
      },
      {
        id: "media",
        name: "Media",
        price: 2800, // TODO: precio real
        includes: ["Arco y fondo con tu tema", "Centros de mesa con globos", "Mesa principal decorada"], // TODO
      },
      {
        id: "premium",
        name: "Premium",
        price: 4800, // TODO: precio real
        includes: ["Salón y jardín decorados", "Centros de mesa", "Mesa de dulces decorada", "Luces colgantes"], // TODO
      },
    ] satisfies DecorationPackage[],
  },

  inflatables: {
    name: "Inflables infantiles",
    description: "Brincolines para que los niños jueguen en el jardín. Se cobran aparte.",
    icon: "inflatable" as ServiceIcon,
    items: [
      {
        id: "brincolin-blanco",
        name: "Brincolín blanco",
        description: "Para bautizos, comuniones y fiestas en tonos claros.",
        price: 1100, // TODO: precio real
        photo: "inflable-blanco",
      },
      {
        id: "castillo",
        name: "Castillo inflable",
        description: "Brincolín de colores para fiestas infantiles.",
        price: 900, // TODO: confirmar que existe y su precio
        photo: null,
      },
      {
        id: "resbaladilla",
        name: "Inflable con resbaladilla",
        description: "Brincolín con resbaladilla para niños de 3 a 10 años.",
        price: 1300, // TODO: confirmar que existe y su precio
        photo: null,
      },
    ] satisfies Inflatable[],
  },
} as const;

export type PricingConfig = typeof pricing;
export type AddonService = Extract<Service, { kind: "addon" }>;
export type IncludedService = Extract<Service, { kind: "included" }>;
export type VenueService = Extract<Service, { kind: "venue" }>;
export type PerUnitService = Extract<Service, { kind: "perUnit" }>;

const services = pricing.services as readonly Service[];
export const venueService = services.find((s): s is VenueService => s.kind === "venue")!;
export const tableService = services.find((s): s is PerUnitService => s.kind === "perUnit" && s.id === "tables")!;
export const chairService = services.find((s): s is PerUnitService => s.kind === "perUnit" && s.id === "chairs")!;
export const addonServices = services.filter((s): s is AddonService => s.kind === "addon");
export const includedServices = services.filter((s): s is IncludedService => s.kind === "included");
export const decorationPackages = pricing.decoration.packages as readonly DecorationPackage[];
export const inflatables = pricing.inflatables.items as readonly Inflatable[];

export const lowestPrice = (prices: readonly number[]) => Math.min(...prices);
