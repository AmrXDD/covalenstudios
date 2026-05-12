import { useEffect, useRef } from "react";

type CommonProps = {
  className?: string;
  children: React.ReactNode;
  /** 0..1, how strongly the button is pulled toward the cursor. Default 0.35. */
  strength?: number;
};

type AnchorProps = CommonProps &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & { as: "a"; href: string };

type ButtonProps = CommonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & { as?: "button" };

type Props = AnchorProps | ButtonProps;

/**
 * Magnetic hover: GSAP smoothly pulls the button (and its label) toward the
 * cursor while hovered, snapping back on leave. Suitable for primary CTAs.
 */
export default function MagneticButton(props: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const labelRef = useRef<HTMLSpanElement | null>(null);
  const { strength = 0.35, className, children } = props;

  useEffect(() => {
    const el = ref.current;
    const label = labelRef.current;
    if (!el || !label) return;

    // Magnetic pull is a pointer-only flourish — skip on touch / coarse-pointer
    // devices and when the user has asked for reduced motion.
    const noFineCursor = window.matchMedia("(hover: none), (pointer: coarse)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (noFineCursor || reducedMotion) return;

    let cleanup = () => {};

    (async () => {
      const { default: gsap } = await import("gsap");

      const moveEl = gsap.quickTo(el, "x", { duration: 0.45, ease: "power3.out" });
      const moveElY = gsap.quickTo(el, "y", { duration: 0.45, ease: "power3.out" });
      const moveLabel = gsap.quickTo(label, "x", { duration: 0.55, ease: "power3.out" });
      const moveLabelY = gsap.quickTo(label, "y", { duration: 0.55, ease: "power3.out" });

      const onMove = (e: PointerEvent) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        moveEl(x * strength);
        moveElY(y * strength);
        moveLabel(x * strength * 0.5);
        moveLabelY(y * strength * 0.5);
      };
      const onLeave = () => {
        moveEl(0);
        moveElY(0);
        moveLabel(0);
        moveLabelY(0);
      };

      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerleave", onLeave);
      cleanup = () => {
        el.removeEventListener("pointermove", onMove);
        el.removeEventListener("pointerleave", onLeave);
      };
    })();

    return () => cleanup();
  }, [strength]);

  if (props.as === "a") {
    const { as: _as, strength: _s, children: _c, className: _cn, ...rest } = props;
    return (
      <a
        ref={ref as React.RefObject<HTMLAnchorElement>}
        className={className}
        {...rest}
      >
        <span ref={labelRef} className="pointer-events-none inline-flex items-center gap-2">
          {children}
        </span>
      </a>
    );
  }

  const { as: _as, strength: _s, children: _c, className: _cn, ...rest } =
    props as ButtonProps;
  return (
    <button
      ref={ref as React.RefObject<HTMLButtonElement>}
      className={className}
      {...rest}
    >
      <span ref={labelRef} className="pointer-events-none inline-flex items-center gap-2">
        {children}
      </span>
    </button>
  );
}
