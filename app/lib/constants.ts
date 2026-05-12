export const BRAND = {
  name: "CovalenStudios",
  tagline: "We design, build, and grow digital brands.",
  description:
    "A premium digital studio delivering SMMA, full-stack development, and UI/UX design out of Canary Wharf, London.",
} as const;

export const CONTACT = {
  phone: "+44 7447 491251",
  phoneHref: "tel:+447447491251",
  whatsapp: "447447491251", // E.164 without '+' for wa.me
  whatsappHref: "https://wa.me/447447491251",
  email: "sales@covalenstudios.cloud",
  emailHref: "mailto:sales@covalenstudios.cloud",
  address: "20 Churchill Place, Canary Wharf, London",
  mapHref:
    "https://www.google.com/maps/search/?api=1&query=20+Churchill+Place+Canary+Wharf+London",
} as const;

export const NAV_LINKS = [
  { label: "Services", href: "#services" },
  { label: "Work", href: "#work" },
  { label: "Studio", href: "#studio" },
  { label: "Contact", href: "#contact" },
] as const;

export const SERVICES = [
  {
    id: "smma",
    title: "Social Media Marketing",
    blurb:
      "Performance-driven SMMA: content systems, paid social, and growth strategy that compounds.",
    points: ["Content production", "Paid social (Meta / TikTok)", "Analytics & attribution"],
  },
  {
    id: "dev",
    title: "Full-Stack Development",
    blurb:
      "Production-grade web and product engineering with React, Remix, Next.js, and Supabase.",
    points: ["Web apps & SaaS", "E-commerce (Shopify / Headless)", "APIs & integrations"],
  },
  {
    id: "uiux",
    title: "UI / UX Design",
    blurb:
      "Brand-aligned interface systems with motion, accessibility, and conversion at the core.",
    points: ["Design systems", "Product UX", "Motion & micro-interactions"],
  },
] as const;

export const PORTFOLIO = [
  {
    title: "Liv Functional",
    description:
      "Bilingual EN/AR functional wellness storefront — premium content, conversion-led UX.",
    href: "https://www.livfunctional.com",
    tags: ["E-commerce", "Bilingual", "Brand"],
  },
  {
    title: "QuipMed",
    description:
      "Medical equipment platform with clean information architecture and B2B lead flow.",
    href: "https://www.quipmed.co",
    tags: ["Healthcare", "B2B", "Web"],
  },
] as const;

export const PRICING = {
  label: "Custom Quote",
  note: "Every engagement is scoped to your goals — get a tailored proposal in 24 hours.",
} as const;
