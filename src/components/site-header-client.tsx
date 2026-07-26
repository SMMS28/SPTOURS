"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Phone } from "lucide-react";
import { signOut } from "@/lib/actions/auth";
import { PHONE_TEL, WA_PLAN } from "@/lib/site";

/** Header height on desktop — the /packages filter bar sticks directly below it. */
export const HEADER_H = 72;

const LINKS = [
  { href: "/packages", label: "Journeys" },
  { href: "/northeast", label: "The Northeast" },
  { href: "/#promise", label: "Why us" },
  { href: "/contact", label: "Contact" },
];

type SiteHeaderClientProps = {
  isAuthenticated: boolean;
  isAdmin: boolean;
  /**
   * Render opaque from the start. The redesigned (site) pages all open with a
   * dark full-bleed hero, so there the header can stay transparent until you
   * scroll. Legacy pages sit on ivory, where paper-coloured links would be
   * invisible — those pass solid.
   */
  solid?: boolean;
};

export function SiteHeaderClient({
  isAuthenticated,
  isAdmin,
  solid = false,
}: SiteHeaderClientProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (solid) return;
    const onScroll = () => setScrolled(window.scrollY > 70);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [solid]);

  const opaque = solid || scrolled;
  const linkColor = opaque ? "text-ink" : "text-paper";

  const links = isAdmin ? [...LINKS, { href: "/admin", label: "Admin" }] : LINKS;

  // Hash links ("/#promise") never read as the active route.
  const isActive = (href: string) =>
    href.includes("#") ? false : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[100] border-b transition-[background,box-shadow,border-color] duration-500 ${
        opaque
          ? "border-hairline bg-paper/90 shadow-[0_10px_30px_-22px_rgba(20,17,11,0.5)] backdrop-blur-md"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-[1360px] items-center justify-between px-6 py-3.5 lg:px-10">
        <Link
          href="/"
          className="inline-flex items-center rounded-xl bg-paper/95 px-3 py-1.5 shadow-[0_6px_20px_-12px_rgba(0,0,0,0.5)]"
          aria-label="SP Tours & Travels — home"
        >
          <Image
            src="/images/logo-2026.png"
            alt="SP Tours and Travels"
            width={640}
            height={286}
            priority
            className="h-[44px] w-auto sm:h-[48px]"
          />
        </Link>

        <nav
          className={`hidden items-center gap-9 text-[14.5px] font-semibold transition-colors duration-500 lg:flex ${linkColor}`}
        >
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={isActive(l.href) ? "page" : undefined}
              className={`transition-opacity duration-300 hover:opacity-60 ${
                isActive(l.href) ? "text-clay" : ""
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          {/* Calling is offered to signed-in visitors only, so the number isn't
              scraped off a public page. Anonymous visitors get the WhatsApp CTA. */}
          {isAuthenticated ? (
            <a
              href={`tel:${PHONE_TEL}`}
              className={`hidden text-[13.5px] font-semibold transition-colors duration-500 hover:opacity-60 sm:inline ${linkColor}`}
            >
              Call SS Rao
            </a>
          ) : null}

          {!isAuthenticated ? (
            <Link
              href="/login"
              className={`hidden text-[13.5px] font-semibold transition-colors duration-500 hover:opacity-60 lg:inline ${linkColor}`}
            >
              Sign in
            </Link>
          ) : (
            <form action={signOut} data-confirm-message="Confirm logout?">
              <button
                type="submit"
                className={`hidden text-[13.5px] font-semibold transition-colors duration-500 hover:opacity-60 lg:inline ${linkColor}`}
              >
                Logout
              </button>
            </form>
          )}

          <a
            href={WA_PLAN}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center rounded-full bg-clay px-5 text-sm font-bold text-paper shadow-[0_10px_26px_-14px_rgba(155,106,76,0.9)] transition-[background,transform] duration-300 hover:-translate-y-0.5 hover:bg-clay-dark"
          >
            Plan my trip
          </a>
        </div>
      </div>

      {/* Mobile nav — the redesign shipped desktop-only, which left phones with
          no navigation at all. Scrollable row, same links. */}
      <div className="px-4 pb-2.5 lg:hidden">
        <nav
          className={`flex items-center gap-4 overflow-x-auto whitespace-nowrap text-[13px] font-semibold [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${linkColor}`}
        >
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={isActive(l.href) ? "page" : undefined}
              className={isActive(l.href) ? "text-clay" : ""}
            >
              {l.label}
            </Link>
          ))}
          {isAuthenticated ? (
            <a href={`tel:${PHONE_TEL}`} className="inline-flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5" />
              Call SS Rao
            </a>
          ) : null}
          {!isAuthenticated ? (
            <Link href="/login">Sign in</Link>
          ) : (
            <form action={signOut} data-confirm-message="Confirm logout?">
              <button type="submit" className="font-semibold">
                Logout
              </button>
            </form>
          )}
        </nav>
      </div>
    </header>
  );
}
