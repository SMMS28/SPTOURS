import type { Metadata } from "next";
import { Suspense } from "react";
import { Playfair_Display, Poppins, Roboto_Mono } from "next/font/google";
import "./globals.css";
import { ConfirmFormSubmits } from "@/components/confirm-form-submits";
import { FlightLoader } from "@/components/flight-loader";
import { Observability } from "@/components/observability";
import { QuotePopup } from "@/components/quote-popup";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

const appSans = Poppins({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const appMono = Roboto_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const appSerif = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: {
    default: "SP TOURS AND TRAVELLS",
    template: "%s | SP TOURS AND TRAVELLS",
  },
  description:
    "Modern travel platform with curated packages, inquiry flow, and role-based admin management.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${appSans.variable} ${appMono.variable} ${appSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Suspense fallback={null}>
          <Observability
            gaId={process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID}
            posthogKey={process.env.NEXT_PUBLIC_POSTHOG_KEY}
            posthogHost={process.env.NEXT_PUBLIC_POSTHOG_HOST}
            sentryDsn={process.env.NEXT_PUBLIC_SENTRY_DSN}
          />
        </Suspense>
        <FlightLoader />
        <ConfirmFormSubmits />
        <QuotePopup />
        <SiteHeader />
        <main className="flex-1 pt-28 sm:pt-32 lg:pt-36">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
