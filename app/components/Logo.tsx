type Props = {
  /** Tailwind sizing class, e.g. 'h-7' (nav) or 'h-10' (footer). */
  className?: string;
  /** Optional accessible label override. */
  label?: string;
};

/**
 * CovalenStudios wordmark. Uses /public/covalen-logo.png — a transparent
 * PNG of pure black ink, extracted from the source artwork — which composes
 * cleanly over the cream page background.
 */
export default function Logo({
  className = "h-7 w-auto",
  label = "CovalenStudios",
}: Props) {
  return (
    <img
      src="/covalen-logo.png"
      alt={label}
      width={1400}
      height={441}
      className={`${className} select-none object-contain`}
      draggable={false}
    />
  );
}
