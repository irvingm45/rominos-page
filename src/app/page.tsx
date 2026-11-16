import { QuoteProvider } from "@/components/quote/QuoteContext";
import { QuoteCalculator } from "@/components/quote/QuoteCalculator";
import { Header } from "@/components/sections/Header";
import { Hero } from "@/components/sections/Hero";
import { EventTypes } from "@/components/sections/EventTypes";
import { Services } from "@/components/sections/Services";
import { BeforeAfter } from "@/components/sections/BeforeAfter";
import { Spaces } from "@/components/sections/Spaces";
import { Gallery } from "@/components/sections/Gallery";
import { Testimonials } from "@/components/sections/Testimonials";
import { HowToBook } from "@/components/sections/HowToBook";
import { Faq } from "@/components/sections/Faq";
import { Location } from "@/components/sections/Location";
import { Footer } from "@/components/sections/Footer";
import { WhatsAppFloat } from "@/components/ui/WhatsAppFloat";
import { RevealObserver } from "@/components/ui/RevealObserver";

export default function Home() {
  return (
    <QuoteProvider>
      {/*
        Deal (tasteskill 2.5): kind place · palette from the venue (walls #f8f6f2, tile #eee9e1,
        ink #1e1d1b, logo caramel #ac825c) · Fraunces/Figtree · place hero · nav-cards ·
        footer-visit · rhythm space · buttons arrow · type moment address ·
        moments photo-chapters (Espacios) + picture-develops (Cómo apartar tu fecha)
      */}
      <Header />
      <main id="top">
        <span id="contenido" />
        <Hero />
        <EventTypes />
        <Services />
        <BeforeAfter />
        <QuoteCalculator />
        <Spaces />
        <Gallery />
        <Testimonials />
        <HowToBook />
        <Faq />
        <Location />
      </main>
      <Footer />
      <WhatsAppFloat />
      <RevealObserver />
    </QuoteProvider>
  );
}
