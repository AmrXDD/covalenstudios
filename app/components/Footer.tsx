import { BRAND, CONTACT, NAV_LINKS } from "~/lib/constants";
import Logo from "./Logo";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer
      id="studio"
      className="relative z-10 border-t border-ink-950/10 px-6 pb-12 pt-20 sm:px-10"
    >
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo className="h-10 w-auto" />
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-ink-800">
            {BRAND.tagline} A premium digital studio based in Canary Wharf,
            crafting brands, products and growth systems for ambitious teams.
          </p>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-[0.3em] text-ink-500">
            Studio
          </h4>
          <ul className="mt-4 space-y-2 text-sm text-ink-800">
            <li>
              <a
                href={CONTACT.mapHref}
                target="_blank"
                rel="noreferrer"
                className="hover:text-ink-950"
              >
                {CONTACT.address}
              </a>
            </li>
            <li>
              <a href={CONTACT.phoneHref} className="hover:text-ink-950">
                {CONTACT.phone}
              </a>
            </li>
            <li>
              <a href={CONTACT.emailHref} className="hover:text-ink-950">
                {CONTACT.email}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-[0.3em] text-ink-500">
            Navigate
          </h4>
          <ul className="mt-4 space-y-2 text-sm text-ink-800">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="hover:text-ink-950">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-16 flex max-w-6xl flex-col items-center justify-between gap-3 border-t border-ink-950/10 pt-6 text-xs text-ink-500 sm:flex-row">
        <span>
          © {year} {BRAND.name}. All rights reserved.
        </span>
        <span>Designed & engineered in London.</span>
      </div>
    </footer>
  );
}
