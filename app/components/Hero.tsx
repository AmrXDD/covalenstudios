import { useEffect, useRef } from "react";
import MagneticButton from "./MagneticButton";
import { BRAND, CONTACT } from "~/lib/constants";

export default function Hero() {
  const rootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let cleanup = () => {};
    (async () => {
      const { default: gsap } = await import("gsap");
      const ctx = gsap.context(() => {
        gsap.fromTo(
          "[data-hero-line]",
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            stagger: 0.12,
          },
        );
        gsap.fromTo(
          "[data-hero-meta]",
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power2.out",
            delay: 0.5,
            stagger: 0.08,
          },
        );
        gsap.fromTo(
          "[data-hero-cta]",
          { y: 16, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power2.out",
            delay: 0.7,
            stagger: 0.1,
          },
        );
      }, root);
      cleanup = () => ctx.revert();
    })();
    return () => cleanup();
  }, []);

  return (
    <section
      id="top"
      ref={rootRef}
      className="relative isolate flex min-h-[100svh] items-center px-6 pt-32 sm:px-10"
    >
      <div className="mx-auto w-full max-w-6xl">
        <div data-hero-meta className="mb-6 flex items-center gap-3">
          <span className="inline-flex h-2 w-2 animate-pulse-glow rounded-full bg-ink-950" />
          <span className="text-xs uppercase tracking-[0.3em] text-ink-600">
            Canary Wharf · London
          </span>
        </div>

        <h1 className="font-display text-5xl font-extrabold leading-[1.02] tracking-tight sm:text-7xl lg:text-[5.5rem]">
          <span data-hero-line className="block text-gradient">
            We design, build,
          </span>
          <span data-hero-line className="block text-ink-950">
            and grow digital brands.
          </span>
        </h1>

        <p
          data-hero-meta
          className="mt-8 max-w-2xl text-lg leading-relaxed text-ink-700 sm:text-xl"
        >
          {BRAND.description} From scroll-stopping social systems to full
          product engineering — engineered for performance, designed for taste.
        </p>

        <div data-hero-cta className="mt-10 flex flex-wrap items-center gap-4">
          <MagneticButton as="a" href="#contact" className="btn-primary" strength={0.45}>
            Get a Quote
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M5 12h14M13 6l6 6-6 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </MagneticButton>

          <a href="#work" className="btn-ghost">
            View our work
          </a>

          <a
            href={CONTACT.phoneHref}
            className="ml-2 hidden text-sm text-ink-600 transition-colors hover:text-ink-950 sm:inline"
          >
            {CONTACT.phone}
          </a>
        </div>

        {/* Trust strip */}
        <div
          data-hero-meta
          className="mt-16 grid max-w-3xl grid-cols-2 gap-6 text-xs uppercase tracking-[0.25em] text-ink-500 sm:grid-cols-4"
        >
          <span>SMMA</span>
          <span>Full-Stack Dev</span>
          <span>UI / UX</span>
          <span>Brand Systems</span>
        </div>
      </div>
    </section>
  );
}
