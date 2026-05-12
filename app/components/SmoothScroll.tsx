import { useEffect } from "react";

/**
 * Global smooth-scroll for in-page anchor links. Intercepts every click on
 * an `<a href="#…">` and animates the viewport via GSAP ScrollToPlugin
 * with an offset that clears the floating navbar.
 *
 * Drop once near the root of the page. Returns no DOM.
 */
export default function SmoothScroll() {
  useEffect(() => {
    let cleanup = () => {};

    (async () => {
      const { default: gsap } = await import("gsap");
      const { ScrollToPlugin } = await import("gsap/ScrollToPlugin");
      gsap.registerPlugin(ScrollToPlugin);

      // GSAP loaded successfully — cancel the fail-safe reveal timer set in
      // root.tsx so the page doesn't get the `gsap-fallback` class applied.
      const w = window as unknown as { __gsapFallback?: number };
      if (w.__gsapFallback) {
        clearTimeout(w.__gsapFallback);
        w.__gsapFallback = undefined;
      }

      const NAVBAR_OFFSET = 96; // pill nav height + breathing room

      const handler = (event: MouseEvent) => {
        // ignore modified clicks / non-primary buttons
        if (
          event.defaultPrevented ||
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey
        ) {
          return;
        }

        const target = event.target as HTMLElement | null;
        if (!target) return;
        const anchor = target.closest<HTMLAnchorElement>('a[href^="#"]');
        if (!anchor) return;

        const href = anchor.getAttribute("href");
        if (!href || href === "#") return;

        const id = href.slice(1);
        let destinationY = 0;

        if (id !== "top") {
          const dest = document.getElementById(id);
          if (!dest) return; // let the browser handle unknown anchors
          destinationY = dest.getBoundingClientRect().top + window.scrollY;
        }

        event.preventDefault();

        gsap.to(window, {
          duration: 1.1,
          ease: "power3.inOut",
          scrollTo: { y: Math.max(0, destinationY - NAVBAR_OFFSET) },
          overwrite: "auto",
        });

        // Reflect the destination in the URL without re-triggering jump
        if (window.history && id) {
          window.history.replaceState(null, "", `#${id}`);
        }
      };

      document.addEventListener("click", handler);
      cleanup = () => document.removeEventListener("click", handler);
    })();

    return () => cleanup();
  }, []);

  return null;
}
