import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

// Redesigned routes. Every page here opens with a dark full-bleed hero that runs
// under the header, so the header stays transparent until scroll and <main> gets
// no top offset.
export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </>
  );
}
