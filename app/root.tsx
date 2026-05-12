import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import tailwind from "~/styles/tailwind.css?url";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: tailwind },
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap",
  },
];

export const loader = async (_args: LoaderFunctionArgs) => {
  return json({
    ENV: {
      PUBLIC_SUPABASE_URL: process.env.PUBLIC_SUPABASE_URL ?? "",
      PUBLIC_SUPABASE_ANON_KEY: process.env.PUBLIC_SUPABASE_ANON_KEY ?? "",
      PUBLIC_SITE_URL: process.env.PUBLIC_SITE_URL ?? "",
    },
  });
};

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="bg-bone-50">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta name="theme-color" content="#F5F1E6" />
        <Meta />
        <Links />
      </head>
      <body className="min-h-screen bg-bone-50 text-ink-950">
        {/* If JS is disabled, reveal all GSAP-hidden targets immediately. */}
        <noscript>
          <style>{`
            [data-anim], [data-hero-line], [data-hero-meta], [data-hero-cta],
            [data-service-card], [data-work-card], [data-contact-anim] {
              opacity: 1 !important;
              transform: none !important;
            }
          `}</style>
        </noscript>

        {/* If GSAP fails to load within 2.5s, force-reveal hidden targets so
            content is never permanently invisible. Runs as inline script
            before hydration, guaranteed to fire even if Remix JS is slow. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.__gsapFallback = setTimeout(function () {
                document.documentElement.classList.add('gsap-fallback');
              }, 2500);
            `,
          }}
        />

        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const data = useLoaderData<typeof loader>();
  return (
    <>
      <Outlet />
      <script
        // expose public env to the browser
        dangerouslySetInnerHTML={{
          __html: `window.ENV = ${JSON.stringify(data.ENV)};`,
        }}
      />
    </>
  );
}
