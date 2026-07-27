"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Phone } from "lucide-react";
import { MobileMenu } from "@/components/mobile-menu";
import { ProfileMenu } from "@/components/profile-menu";
import { PHONE_TEL, WA_PLAN } from "@/lib/site";

/**
 * Measured header heights. The /packages filter bar sticks directly below, so
 * these and its `top-[…]` classes have to stay in step — the mobile row is taller
 * because its nav items are 44px touch targets.
 */
export const HEADER_H = 87;
export const HEADER_H_MOBILE = 133;

const LINKS = [
  { href: "/packages", label: "Journeys" },
  { href: "/northeast", label: "The Northeast" },
  { href: "/#promise", label: "Why us" },
  { href: "/contact", label: "Contact" },
];

/**
 * Routes inside (site) whose hero is light rather than a dark photo. The header's
 * transparent state uses paper-coloured links, which would be invisible on ivory,
 * so these force the opaque treatment from the first paint.
 */
const LIGHT_HERO_ROUTES = ["/northeast"];

type SiteHeaderClientProps = {
  isAuthenticated: boolean;
  isAdmin: boolean;
  email?: string | null;
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
  email,
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

  const lightHero = LIGHT_HERO_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
  const opaque = solid || lightHero || scrolled;
  const linkColor = opaque ? "text-ink" : "text-paper";

  const links = isAdmin ? [...LINKS, { href: "/admin", label: "Admin" }] : LINKS;

  // Hash links ("/#promise") never read as the active route.
  const isActive = (href: string) =>
    href.includes("#") ? false : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[100] border-b transition-[background,box-shadow,border-color] duration-500 ${
        opaque
          ? "border-hairline bg-paper shadow-[0_10px_30px_-22px_rgba(20,17,11,0.5)] lg:bg-paper/90 lg:backdrop-blur-md"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-[1360px] items-center justify-between px-6 py-2.5 lg:px-10">
        <Link
          href="/"
          className="inline-flex items-center rounded-xl bg-paper/95 px-2.5 py-1 shadow-[0_6px_20px_-12px_rgba(0,0,0,0.5)]"
          aria-label="SP Tours & Travels — home"
        >
          <Image
            src="/images/logo-2026.png"
            alt="SP Tours and Travels"
            width={640}
            height={286}
            priority
            className="h-[50px] w-auto sm:h-[58px]"
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
              title="Call SS Rao"
              className={`hidden items-center gap-1.5 text-[14px] font-semibold transition-colors duration-500 hover:opacity-60 sm:inline-flex ${linkColor}`}
            >
              <Phone className="h-3.5 w-3.5" />
              SS Rao
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
            <div className="hidden lg:block">
              <ProfileMenu email={email} isAdmin={isAdmin} tone={opaque ? "ink" : "paper"} />
            </div>
          )}

          <a
            href={WA_PLAN}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden h-11 items-center rounded-full bg-clay px-5 text-sm font-bold text-paper shadow-[0_10px_26px_-14px_rgba(155,106,76,0.9)] transition-[background,transform] duration-300 hover:-translate-y-0.5 hover:bg-clay-dark sm:inline-flex"
          >
            Plan my trip
          </a>

          {/* Drawer replaces the horizontally scrolling nav row, which pushed
              destinations off-screen with no affordance that more existed. */}
          <MobileMenu
            links={links}
            isAuthenticated={isAuthenticated}
            isAdmin={isAdmin}
            email={email}
            tone={opaque ? "ink" : "paper"}
          />
        </div>
      </div>

    </header>
  );
}
