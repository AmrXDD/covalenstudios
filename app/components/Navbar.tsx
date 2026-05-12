import { useEffect, useRef, useState } from "react";
import { NAV_LINKS } from "~/lib/constants";
import MagneticButton from "./MagneticButton";
import Logo from "./Logo";

/**
 * Floating pill navbar with GSAP-driven 3D perspective tilt:
 *   - tilts subtly on pointer move (parallax / depth)
 *   - tilts on scroll (compresses forward as user scrolls)
 *   - collapses into a hamburger drawer on mobile
 *
 * Sits at z-40 (above content + FAB, below modals/overlays).
 */
export default function Navbar() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const pillRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const wrap = wrapRef.current;
    const pill = pillRef.current;
    if (!wrap || !pill) return;

    // Skip 3D tilt on touch / reduced-motion devices — it's pointer-only flair
    // and feels janky when there's no real cursor.
    const noFineCursor = window.matchMedia("(hover: none), (pointer: coarse)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let cleanup = () => {};

    (async () => {
      const { default: gsap } = await import("gsap");

      gsap.set(pill, {
        transformPerspective: 1000,
        transformOrigin: "center center",
      });

      const qx = gsap.quickTo(pill, "rotationY", { duration: 0.6, ease: "power3.out" });
      const qy = gsap.quickTo(pill, "rotationX", { duration: 0.6, ease: "power3.out" });
      const qz = gsap.quickTo(pill, "z", { duration: 0.6, ease: "power3.out" });

      const onMove = (e: PointerEvent) => {
        const rect = wrap.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width;
        const py = (e.clientY - rect.top) / rect.height;
        qx((px - 0.5) * 10);
        qy(-(py - 0.5) * 8);
      };

      const onLeave = () => {
        qx(0);
        qy(0);
        qz(0);
      };

      const onScroll = () => {
        const y = window.scrollY;
        if (!reducedMotion) {
          const tilt = Math.min(y / 30, 6);
          qy(-tilt);
          qz(-tilt * 4);
        }
        pill.style.boxShadow =
          y > 8
            ? "0 14px 40px rgba(5,5,5,0.16), 0 0 0 1px rgba(5,5,5,0.08), inset 0 1px 0 rgba(255,255,255,0.8)"
            : "0 8px 32px rgba(5,5,5,0.10), inset 0 1px 0 rgba(255,255,255,0.7)";
      };

      if (!noFineCursor && !reducedMotion) {
        wrap.addEventListener("pointermove", onMove);
        wrap.addEventListener("pointerleave", onLeave);
      }
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();

      cleanup = () => {
        wrap.removeEventListener("pointermove", onMove);
        wrap.removeEventListener("pointerleave", onLeave);
        window.removeEventListener("scroll", onScroll);
      };
    })();

    return () => cleanup();
  }, []);

  // Close the drawer when the user clicks a link or resizes up past md.
  useEffect(() => {
    if (!open) return;
    const onResize = () => {
      if (window.innerWidth >= 768) setOpen(false);
    };
    window.addEventListener("resize", onResize);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("resize", onResize);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div
      ref={wrapRef}
      className="perspective-1000 fixed left-1/2 top-3 z-40 w-[min(1100px,calc(100%-1rem))] -translate-x-1/2 sm:top-4 sm:w-[min(1100px,calc(100%-1.5rem))]"
    >
      <div
        ref={pillRef}
        className="glass-strong preserve-3d flex items-center justify-between gap-2 rounded-full px-2.5 py-2 shadow-pill sm:gap-4 sm:px-3"
      >
        {/* Brand */}
        <a
          href="#top"
          className="flex items-center gap-2 rounded-full px-2 py-1.5 sm:px-3"
          aria-label="CovalenStudios — home"
          onClick={() => setOpen(false)}
        >
          <Logo className="h-7 w-auto sm:h-8" />
        </a>

        {/* Desktop links */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-ink-800 transition-colors hover:bg-ink-950/[0.06] hover:text-ink-950"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:block">
          <MagneticButton
            as="a"
            href="#contact"
            className="btn-primary px-5 py-2.5"
            strength={0.4}
          >
            Get a Quote
          </MagneticButton>
        </div>

        {/* Mobile: compact CTA + hamburger */}
        <div className="flex items-center gap-1.5 md:hidden">
          <a
            href="#contact"
            className="btn-primary px-4 py-2 text-sm"
            onClick={() => setOpen(false)}
          >
            Quote
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="grid h-10 w-10 place-items-center rounded-full border border-ink-950/15 text-ink-900 transition-colors hover:bg-ink-950/[0.06]"
          >
            <span className="relative block h-3 w-4">
              <span
                className={`absolute left-0 right-0 h-[2px] rounded bg-current transition-all duration-300 ${
                  open ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute left-0 right-0 top-1/2 h-[2px] -translate-y-1/2 rounded bg-current transition-opacity duration-200 ${
                  open ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute left-0 right-0 h-[2px] rounded bg-current transition-all duration-300 ${
                  open ? "top-1/2 -translate-y-1/2 -rotate-45" : "bottom-0"
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        id="mobile-nav"
        className={`glass-strong mt-2 overflow-hidden rounded-3xl transition-all duration-300 md:hidden ${
          open
            ? "pointer-events-auto max-h-[480px] opacity-100"
            : "pointer-events-none max-h-0 opacity-0"
        }`}
        aria-hidden={!open}
      >
        <nav className="flex flex-col p-3">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-2xl px-4 py-3 text-base font-medium text-ink-900 transition-colors hover:bg-ink-950/[0.06]"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}
