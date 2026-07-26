import type { Metadata } from "next";
import { Suspense } from "react";
import { Bricolage_Grotesque, Manrope, Space_Mono } from "next/font/google";
import "./globals.css";
import { ConfirmFormSubmits } from "@/components/confirm-form-submits";
import { Observability } from "@/components/observability";

const display = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const sans = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const mono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "SP Tours & Travels — North East India specialists",
    template: "%s | SP Tours & Travels",
  },
  description:
    "Handcrafted tours across the Seven Sisters — Assam, Meghalaya, Sikkim, Arunachal and beyond. Trusted since 1986.",
};

// The SiteHeader / SiteFooter chrome lives in the route-group layouts, not here:
// (site) renders it transparent over each page's dark hero, (legacy) renders it
// solid with a top offset, and (auth) / admin deliberately opt out entirely.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-paper text-ink">
        <Suspense fallback={null}>
          <Observability
            gaId={process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID}
            posthogKey={process.env.NEXT_PUBLIC_POSTHOG_KEY}
            posthogHost={process.env.NEXT_PUBLIC_POSTHOG_HOST}
            sentryDsn={process.env.NEXT_PUBLIC_SENTRY_DSN}
          />
        </Suspense>
        {/* FlightLoader intentionally not mounted: it threw a slate-950 blurred
            scrim over the first 2.2s of every new session, which buried the
            redesign's hero and clashed with the ivory/clay palette. The component
            is still in src/components/flight-loader.tsx if it gets restyled. */}
        <ConfirmFormSubmits />
        {/* QuotePopup intentionally not mounted: it opened an unsolicited modal 60s
            into every session, including straight after signing in. The component
            remains in src/components/quote-popup.tsx if it is ever wanted behind an
            explicit trigger. */}
        {children}
      </body>
    </html>
  );
}
