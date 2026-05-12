import { useEffect, useRef } from "react";
import { PORTFOLIO } from "~/lib/constants";

export default function Portfolio() {
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
          "[data-work-card]",
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.15,
            scrollTrigger: { trigger: root, start: "top 70%" },
          },
        );
      }, root);
      cleanup = () => ctx.revert();
    })();
    return () => cleanup();
  }, []);

  return (
    <section id="work" ref={rootRef} className="relative px-6 py-28 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 flex items-end justify-between gap-6">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-ink-600">
              Recent works
            </span>
            <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-ink-950 sm:text-5xl">
              Selected <span className="text-gradient">case studies</span>
            </h2>
          </div>
          <span className="hidden text-sm text-ink-600 sm:block">Live · 2025</span>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {PORTFOLIO.map((item) => (
            <a
              key={item.href}
              data-work-card
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className="glass group relative block overflow-hidden rounded-3xl p-7 transition-all duration-300 hover:-translate-y-1 hover:border-ink-950/20"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  background:
                    "radial-gradient(60% 60% at 50% 0%, rgba(242,201,168,0.55), rgba(242,201,168,0) 70%)",
                }}
              />

              <div className="relative flex h-full flex-col">
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-ink-950/15 px-2.5 py-1 text-[10px] uppercase tracking-widest text-ink-700"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <span className="grid h-9 w-9 place-items-center rounded-full border border-ink-950/15 text-ink-700 transition-all duration-300 group-hover:border-ink-950 group-hover:bg-ink-950 group-hover:text-bone-50">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <path
                        d="M7 17 17 7M9 7h8v8"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </div>

                <h3 className="mt-10 font-display text-3xl font-bold tracking-tight text-ink-950">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-700">
                  {item.description}
                </p>

                <div className="mt-8 flex items-center justify-between border-t border-ink-950/10 pt-5">
                  <span className="text-xs text-ink-600">
                    {new URL(item.href).host.replace(/^www\./, "")}
                  </span>
                  <span className="text-xs uppercase tracking-[0.25em] text-ink-950 transition-colors group-hover:text-ink-700">
                    Visit site
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
