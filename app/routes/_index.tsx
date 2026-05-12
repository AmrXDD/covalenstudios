import type { MetaFunction } from "@remix-run/node";
import NebulaBackground from "~/components/NebulaBackground";
import Navbar from "~/components/Navbar";
import Hero from "~/components/Hero";
import Services from "~/components/Services";
import Portfolio from "~/components/Portfolio";
import Contact from "~/components/Contact";
import Footer from "~/components/Footer";
import WhatsAppButton from "~/components/WhatsAppButton";
import SmoothScroll from "~/components/SmoothScroll";
import { BRAND } from "~/lib/constants";

export const meta: MetaFunction = () => [
  { title: `${BRAND.name} — Premium Digital Studio · Canary Wharf, London` },
  {
    name: "description",
    content:
      "CovalenStudios is a premium digital studio in Canary Wharf, London, delivering SMMA, full-stack development, and UI/UX design for ambitious brands.",
  },
  { property: "og:title", content: `${BRAND.name} — Premium Digital Studio` },
  {
    property: "og:description",
    content:
      "Strategy, design, and engineering under one roof. Get a custom quote in 24 hours.",
  },
  { property: "og:type", content: "website" },
];

/**
 * Stacking order (controlled in app/lib/z-index.ts):
 *   -10  NebulaBackground (fixed, behind everything)
 *     0  base flow (default)
 *    10  main content sections + footer
 *    30  WhatsApp FAB
 *    40  floating navbar
 */
export default function Index() {
  return (
    <div className="relative">
      <SmoothScroll />
      <NebulaBackground />
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <Services />
        <Portfolio />
        <Contact />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
