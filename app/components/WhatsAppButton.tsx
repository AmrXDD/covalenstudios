import { useEffect, useRef } from "react";
import { CONTACT } from "~/lib/constants";

/**
 * Sticky, branded WhatsApp launcher. Bottom-right, above the fold of every
 * page. Subtle entrance + pulse-glow via GSAP.
 */
export default function WhatsAppButton() {
  const ref = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let cleanup = () => {};
    (async () => {
      const { default: gsap } = await import("gsap");
      gsap.fromTo(
        el,
        { scale: 0.6, opacity: 0, y: 20 },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 0.7,
          delay: 1.2,
          ease: "back.out(2)",
        },
      );
      const pulse = gsap.to(el.querySelector("[data-wa-ring]"), {
        scale: 1.6,
        opacity: 0,
        duration: 1.6,
        ease: "power2.out",
        repeat: -1,
      });
      cleanup = () => {
        pulse.kill();
      };
    })();
    return () => cleanup();
  }, []);

  return (
    <a
      ref={ref}
      href={CONTACT.whatsappHref}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with CovalenStudios on WhatsApp"
      className="group fixed bottom-6 right-6 z-30 grid h-14 w-14 place-items-center rounded-full shadow-[0_12px_32px_rgba(5,5,5,0.25)] transition-transform hover:scale-105"
      style={{ backgroundColor: "#25D366" }}
    >
      <span
        data-wa-ring
        aria-hidden
        className="absolute inset-0 rounded-full"
        style={{ backgroundColor: "#25D366", opacity: 0.55 }}
      />
      <svg
        viewBox="0 0 32 32"
        width="26"
        height="26"
        className="relative text-white"
        fill="currentColor"
        aria-hidden
      >
        <path d="M19.11 17.53c-.27-.13-1.6-.79-1.85-.88-.25-.09-.43-.13-.61.13-.18.27-.7.88-.86 1.06-.16.18-.32.2-.59.07-.27-.13-1.14-.42-2.17-1.34-.8-.71-1.34-1.58-1.5-1.85-.16-.27-.02-.41.12-.54.12-.12.27-.32.4-.48.13-.16.18-.27.27-.45.09-.18.04-.34-.02-.48-.07-.13-.61-1.47-.84-2.01-.22-.53-.45-.46-.61-.46l-.52-.01a1 1 0 0 0-.72.34c-.25.27-.95.93-.95 2.26 0 1.33.97 2.62 1.11 2.8.13.18 1.92 2.93 4.65 4.12.65.28 1.16.45 1.56.58.65.21 1.24.18 1.71.11.52-.08 1.6-.65 1.83-1.28.23-.63.23-1.16.16-1.28-.07-.12-.25-.18-.52-.32Z" />
        <path d="M27.18 4.83A15.86 15.86 0 0 0 4.7 27.36L3 32l4.76-1.65a15.85 15.85 0 0 0 7.58 1.94h.01c8.76 0 15.88-7.13 15.88-15.89 0-4.24-1.65-8.23-4.05-11.57Zm-11.83 24.4h-.01a13.15 13.15 0 0 1-6.7-1.84l-.48-.28-2.83.98.97-2.74-.31-.5a13.16 13.16 0 1 1 9.36 4.38Z" />
      </svg>
      <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-full bg-ink-950/90 px-3 py-1.5 text-xs text-bone-50 ring-1 ring-ink-950/20 backdrop-blur-md sm:group-hover:block">
        Chat on WhatsApp
      </span>
    </a>
  );
}
