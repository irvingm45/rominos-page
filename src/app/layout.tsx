import type { Metadata, Viewport } from "next";
import { Fraunces, Figtree } from "next/font/google";
import { business, placeLine } from "@/data/business";
import { pricing } from "@/data/pricing";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  axes: ["SOFT", "WONK", "opsz"],
  variable: "--font-fraunces",
  display: "swap",
});

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
  display: "swap",
});

const title = `${business.name}: salón de eventos en San Martín Texmelucan`;
const description =
  "Salón y jardín para bodas, XV años y fiestas infantiles en San Martín Texmelucan, Puebla, con área de juegos incluida. Cotiza mesas, sillas, decoración e inflables en línea.";

export const metadata: Metadata = {
  metadataBase: new URL(business.siteUrl),
  title,
  description,
  keywords: [
    "salón de eventos en San Martín Texmelucan",
    "salón de fiestas San Martín Texmelucan",
    "salón con jardín Puebla",
    "fiestas infantiles Texmelucan",
    "bodas San Martín Texmelucan",
    "XV años Texmelucan",
  ],
  // TODO: activar cuando exista el dominio real
  // alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_MX",
    siteName: business.name,
    title,
    description,
    images: [{ url: `${business.siteUrl}/og.jpg`, width: 1200, height: 630, alt: "Jardín y salón techado de Róminos" }],
  },
  twitter: { card: "summary_large_image", title, description, images: [`${business.siteUrl}/og.jpg`] },
  other: {
    "page-type": "place",
    "site-kind": "other",
    "page-kind": "place",
  },
};

export const viewport: Viewport = {
  themeColor: "#f8f6f2",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

function structuredData() {
  const sameAs = Object.values(business.social).filter((u) => new URL(u).pathname.length > 1);
  const { street, locality, region, postalCode, country } = business.address;
  return {
    "@context": "https://schema.org",
    "@type": ["EventVenue", "LocalBusiness"],
    name: business.name,
    alternateName: business.alternateName,
    description,
    slogan: business.slogan,
    url: business.siteUrl,
    image: `${business.siteUrl}/og.jpg`,
    telephone: business.phone.e164,
    priceRange: "$$",
    currenciesAccepted: pricing.currency,
    address: {
      "@type": "PostalAddress",
      ...(street ? { streetAddress: street } : {}),
      addressLocality: locality,
      addressRegion: region,
      ...(postalCode ? { postalCode } : {}),
      addressCountry: country,
    },
    areaServed: placeLine,
    hasMap: business.maps.url,
    openingHoursSpecification: business.hours.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: h.schemaDays,
      opens: h.opens,
      closes: h.closes,
    })),
    amenityFeature: [
      { "@type": "LocationFeatureSpecification", name: "Jardín", value: true },
      { "@type": "LocationFeatureSpecification", name: "Área de juegos infantiles", value: true },
      { "@type": "LocationFeatureSpecification", name: "Cocina", value: true },
    ],
    ...(sameAs.length ? { sameAs } : {}),
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-MX" data-type="place" className={`${fraunces.variable} ${figtree.variable}`} suppressHydrationWarning>
      <head>
        {/* Marks that JS runs, so scroll reveals may start hidden. Without JS everything shows. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData()) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
