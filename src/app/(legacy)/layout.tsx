import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

/**
 * Pages the redesign doesn't cover yet. They keep the new header/footer chrome
 * so navigation is consistent, but differ from (site) in two ways:
 *
 *  - solid header: these pages sit on ivory rather than a dark hero, where the
 *    header's transparent state would render paper-coloured links invisible.
 *  - top offset: the pt-28/32/36 the old root layout provided. northeast/page.tsx
 *    cancels it with a matching -mt-28/32/36 for its full-bleed hero, so these
 *    values need to stay in lockstep with that page.
 */
export default function LegacyLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <SiteHeader solid />
      <main className="flex-1 pt-28 sm:pt-32 lg:pt-36">{children}</main>
      <SiteFooter />
    </>
  );
}
