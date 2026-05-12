import { useEffect, useRef } from "react";
import { SERVICES } from "~/lib/constants";

export default function Services() {
  const rootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let cleanup = () => {};
    (async () => {
      const { default: gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        gsap.fromTo(
          "[data-service-card]",
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.12,
            scrollTrigger: {
              trigger: root,
              start: "top 75%",
            },
          },
        );
      }, root);
      cleanup = () => ctx.revert();
    })();

    return () => cleanup();
  }, []);

  return (
    <section
      id="services"
      ref={rootRef}
      className="relative px-6 py-28 sm:px-10"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 flex flex-col gap-3">
          <span className="text-xs uppercase tracking-[0.3em] text-ink-600">
            What we do
          </span>
          <h2 className="font-display text-4xl font-bold tracking-tight text-ink-950 sm:text-5xl">
            Three disciplines.{" "}
            <span className="text-gradient">One studio.</span>
          </h2>
          <p className="max-w-2xl text-ink-700">
            Strategy, design, and engineering under one roof — so the brand,
            the product, and the growth engine stay in lockstep.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {SERVICES.map((service) => (
            <article
              key={service.id}
              data-service-card
              className="glass group relative overflow-hidden rounded-3xl p-7 transition-transform duration-300 hover:-translate-y-1"
            >
              {/* hover bloom */}
              <div
                aria-hidden
                className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  background:
                    "radial-gradient(60% 60% at 50% 0%, rgba(242,201,168,0.45), rgba(242,201,168,0) 70%)",
                }}
              />
              <div className="relative">
                <div className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-ink-950 text-bone-50 ring-1 ring-ink-950/20">
                  <ServiceIcon id={service.id} />
                </div>
                <h3 className="font-display text-xl font-semibold tracking-tight text-ink-950">
                  {service.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-700">
                  {service.blurb}
                </p>
                <ul className="mt-6 space-y-2 text-sm text-ink-700">
                  {service.points.map((p) => (
                    <li key={p} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-ink-950" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceIcon({ id }: { id: string }) {
  const stroke = {
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    fill: "none",
  };
  if (id === "smma") {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" {...stroke}>
        <path d="M4 12c0-4 3-7 8-7s8 3 8 7-3 7-8 7H4l1.5-3A7 7 0 0 1 4 12Z" />
        <path d="M9 11h6M9 14h4" />
      </svg>
    );
  }
  if (id === "dev") {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" {...stroke}>
        <path d="m8 7-5 5 5 5M16 7l5 5-5 5M14 5l-4 14" />
      </svg>
    );
  }
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" {...stroke}>
      <rect x="3" y="4" width="18" height="14" rx="3" />
      <path d="M3 9h18M8 14h4" />
    </svg>
  );
}
