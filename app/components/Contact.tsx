import { useEffect, useRef, useState } from "react";
import { useFetcher } from "@remix-run/react";
import MagneticButton from "./MagneticButton";
import { CONTACT, PRICING } from "~/lib/constants";

type ActionData = {
  ok?: boolean;
  error?: string;
  fieldErrors?: Partial<Record<"name" | "email" | "message", string>>;
};

export default function Contact() {
  const rootRef = useRef<HTMLElement | null>(null);
  // useFetcher submits the form in the background — the page never navigates
  // away to /api/quote, so the success state can render in place.
  const fetcher = useFetcher<ActionData>();
  const actionData = fetcher.data;
  const submitting = fetcher.state === "submitting";
  const [service, setService] = useState<"smma" | "dev" | "uiux" | "other">(
    "dev",
  );

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
          "[data-contact-anim]",
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.1,
            scrollTrigger: { trigger: root, start: "top 75%" },
          },
        );
      }, root);
      cleanup = () => ctx.revert();
    })();
    return () => cleanup();
  }, []);

  // When the submit succeeds, smooth-scroll the Contact card into view so the
  // "Thank you" state is never missed if the user was looking elsewhere.
  useEffect(() => {
    if (actionData?.ok && rootRef.current) {
      rootRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [actionData?.ok]);

  return (
    <section
      id="contact"
      ref={rootRef}
      className="relative px-4 py-20 sm:px-6 sm:py-24 lg:px-10 lg:py-28"
    >
      <div className="mx-auto grid max-w-6xl gap-8 sm:gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-12">
        {/* Left — info */}
        <div className="flex flex-col gap-6 sm:gap-8">
          <div data-contact-anim>
            <span className="text-[11px] uppercase tracking-[0.3em] text-ink-600 sm:text-xs">
              Get in touch
            </span>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink-950 sm:text-4xl lg:text-5xl">
              Let&rsquo;s build something{" "}
              <span className="text-gradient">remarkable</span>.
            </h2>
            <p className="mt-4 text-sm text-ink-700 sm:text-base">{PRICING.note}</p>
          </div>

          <div data-contact-anim className="glass space-y-4 rounded-3xl p-5 sm:space-y-5 sm:p-6">
            <InfoRow label="Studio">
              <a
                href={CONTACT.mapHref}
                target="_blank"
                rel="noreferrer"
                className="break-words hover:text-ink-950"
              >
                {CONTACT.address}
              </a>
            </InfoRow>
            <InfoRow label="Email">
              <a
                href={CONTACT.emailHref}
                className="break-all hover:text-ink-950"
              >
                {CONTACT.email}
              </a>
            </InfoRow>
            <InfoRow label="Phone">
              <a href={CONTACT.phoneHref} className="hover:text-ink-950">
                {CONTACT.phone}
              </a>
            </InfoRow>
            <InfoRow label="WhatsApp">
              <a
                href={CONTACT.whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="hover:text-ink-950"
              >
                Message us instantly
              </a>
            </InfoRow>
            <InfoRow label="Pricing">
              <span className="inline-flex items-center gap-2">
                <span className="rounded-full bg-ink-950 px-2.5 py-1 text-xs text-bone-50">
                  {PRICING.label}
                </span>
              </span>
            </InfoRow>
          </div>
        </div>

        {/* Right — quote form */}
        <div data-contact-anim className="glass-strong relative rounded-3xl p-5 sm:p-7">
          {actionData?.ok ? (
            <SuccessState />
          ) : (
            <fetcher.Form method="post" action="/api/quote" className="space-y-5">
              <input type="hidden" name="service" value={service} />
              <input type="hidden" name="source" value="hero-contact" />

              <Field
                label="Your name"
                name="name"
                placeholder="Jane Doe"
                error={actionData?.fieldErrors?.name}
                required
              />
              <Field
                label="Work email"
                name="email"
                type="email"
                placeholder="jane@company.com"
                error={actionData?.fieldErrors?.email}
                required
              />
              <Field label="Company" name="company" placeholder="Acme Inc." />

              <div>
                <Label>Service</Label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {(
                    [
                      ["smma", "SMMA"],
                      ["dev", "Dev"],
                      ["uiux", "UI/UX"],
                      ["other", "Other"],
                    ] as const
                  ).map(([k, label]) => {
                    const active = service === k;
                    return (
                      <button
                        type="button"
                        key={k}
                        onClick={() => setService(k)}
                        className={[
                          "rounded-xl border px-3 py-2 text-sm transition-colors",
                          active
                            ? "border-ink-950 bg-ink-950 text-bone-50"
                            : "border-ink-950/15 text-ink-700 hover:border-ink-950/35 hover:bg-ink-950/[0.04]",
                        ].join(" ")}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <Field
                label="Budget (optional)"
                name="budget"
                placeholder="e.g. £10k–£25k"
              />

              <div>
                <div className="flex items-baseline justify-between gap-3">
                  <Label htmlFor="message">Project brief</Label>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-ink-500">
                    Minimum 12 characters
                  </span>
                </div>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  minLength={12}
                  placeholder="Tell us about your goals, timeline, and any links we should see."
                  className="mt-2 w-full resize-none rounded-2xl border border-ink-950/15 bg-bone-50/60 px-4 py-3 text-base text-ink-950 placeholder:text-ink-400 focus:border-ink-950 focus:bg-bone-50/90 focus:outline-none sm:text-sm"
                />
                {actionData?.fieldErrors?.message ? (
                  <p className="mt-1 text-xs text-red-700">
                    {actionData.fieldErrors.message}
                  </p>
                ) : (
                  <p className="mt-1 text-xs text-ink-500">
                    A sentence or two is enough — goals, timeline, anything we
                    should see.
                  </p>
                )}
              </div>

              {actionData?.error ? (
                <p
                  role="alert"
                  className="rounded-xl border border-red-700/30 bg-red-700/10 px-3 py-2 text-sm text-red-800"
                >
                  {actionData.error}
                </p>
              ) : null}

              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
                <p className="text-xs text-ink-500">
                  We reply within 24 hours · GDPR-friendly
                </p>
                <MagneticButton
                  as="button"
                  type="submit"
                  disabled={submitting}
                  className="btn-primary w-full justify-center disabled:opacity-60 sm:w-auto"
                  strength={0.35}
                >
                  {submitting ? "Sending…" : "Request quote"}
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden
                  >
                    <path
                      d="M5 12h14M13 6l6 6-6 6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </MagneticButton>
              </div>
            </fetcher.Form>
          )}
        </div>
      </div>
    </section>
  );
}

function InfoRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1 border-b border-ink-950/5 pb-3 last:border-0 last:pb-0 sm:flex-row sm:items-start sm:justify-between sm:gap-6 sm:border-0 sm:pb-0">
      <span className="text-[10px] uppercase tracking-[0.25em] text-ink-500 sm:text-xs">
        {label}
      </span>
      <span className="text-sm text-ink-800 sm:text-right">{children}</span>
    </div>
  );
}

function Label({
  children,
  htmlFor,
}: {
  children: React.ReactNode;
  htmlFor?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="text-xs uppercase tracking-[0.25em] text-ink-600"
    >
      {children}
    </label>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  required,
  error,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
}) {
  return (
    <div>
      <Label htmlFor={name}>{label}</Label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="mt-2 w-full rounded-2xl border border-ink-950/15 bg-bone-50/60 px-4 py-3 text-base text-ink-950 placeholder:text-ink-400 focus:border-ink-950 focus:bg-bone-50/90 focus:outline-none sm:text-sm"
      />
      {error ? <p className="mt-1 text-xs text-red-700">{error}</p> : null}
    </div>
  );
}

function SuccessState() {
  return (
    <div className="flex h-full min-h-[420px] flex-col items-center justify-center text-center">
      <div className="grid h-14 w-14 place-items-center rounded-full bg-ink-950 text-bone-50">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path
            d="m5 12 5 5L20 7"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <h3 className="mt-5 font-display text-2xl font-semibold text-ink-950">
        Thank you.
      </h3>
      <p className="mt-2 max-w-sm text-sm text-ink-700">
        Your inquiry is in. Expect a tailored proposal from our team within
        24 hours.
      </p>
    </div>
  );
}
