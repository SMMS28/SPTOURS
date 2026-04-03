"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { Phone } from "lucide-react";
import { signOut } from "@/lib/actions/auth";

type SiteHeaderClientProps = {
  isAuthenticated: boolean;
  isAdmin: boolean;
};

export function SiteHeaderClient({ isAuthenticated, isAdmin }: SiteHeaderClientProps) {
  const pathname = usePathname();
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    let raf = 0;
    const maxScroll = 260;

    const update = () => {
      raf = 0;
      const progress = Math.min(Math.max(window.scrollY / maxScroll, 0), 1);
      setScrollProgress(progress);
    };

    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      if (raf) window.cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const mixChannel = (from: number, to: number, progress: number) =>
    Math.round(from + (to - from) * progress);

  const inactiveColor = `rgba(${mixChannel(255, 15, scrollProgress)}, ${mixChannel(255, 23, scrollProgress)}, ${mixChannel(255, 42, scrollProgress)}, ${0.92 + 0.06 * scrollProgress})`;
  const activeColor = `rgb(${mixChannel(252, 3, scrollProgress)}, ${mixChannel(211, 105, scrollProgress)}, ${mixChannel(77, 161, scrollProgress)})`;

  const navItems = useMemo(
    () => [
      { href: "/", label: "Home" },
      { href: "/packages", label: "India Packages" },
      { href: "/northeast", label: "North East" },
      { href: "/services", label: "Services" },
      { href: "/contact", label: "Contact" },
      ...(isAdmin ? [{ href: "/admin", label: "Admin" }] : []),
    ],
    [isAdmin],
  );

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  const linkClass = "inline-flex items-center rounded-none px-1.5 py-1 text-base font-semibold transition-opacity duration-300 hover:underline hover:underline-offset-8 lg:text-lg";

  return (
    <header className="absolute inset-x-0 top-0 z-50 px-3 sm:px-4">
      <div className="bg-transparent text-white shadow-none" style={{ borderRadius: 0 }}>
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-2 py-1 sm:px-4 lg:px-6">
          <Link href="/" className="flex min-w-0 items-center" aria-label="Home">
            <Image
              src="/images/logo-2026.png"
              alt="SP Tours and Travels logo"
              width={438}
              height={173}
              decoding="async"
              priority
              className="h-14 w-auto max-w-none object-contain sm:h-16 lg:h-24"
            />
          </Link>

          <nav className="hidden items-center gap-5 px-1.5 py-1 lg:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={linkClass}
                style={
                  isActive(item.href)
                    ? {
                        color: activeColor,
                        textDecoration: "underline",
                        textDecorationColor: activeColor,
                        textUnderlineOffset: "8px",
                      }
                    : { color: inactiveColor }
                }
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <a
              href="tel:+919247777996"
              className="inline-flex items-center gap-2 px-1 py-1 text-base font-semibold transition-opacity duration-300 hover:underline hover:underline-offset-8 lg:text-lg"
              style={{ color: inactiveColor }}
            >
              <Phone className="h-4 w-4" />
              Call us
            </a>

            {!isAuthenticated ? (
              <Link
                href="/login"
                className="inline-flex items-center rounded-none px-1 py-1 text-base font-semibold transition-opacity duration-300 hover:underline hover:underline-offset-8 lg:text-lg"
                style={{ color: inactiveColor }}
              >
                Sign in
              </Link>
            ) : (
              <form action={signOut} data-confirm-message="Confirm logout?">
                <button
                  type="submit"
                  className="inline-flex items-center rounded-none px-1 py-1 text-base font-semibold transition-opacity duration-300 hover:underline hover:underline-offset-8 lg:text-lg"
                  style={{ color: inactiveColor }}
                >
                  Logout
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="px-2 pb-2 md:hidden">
          <nav className="flex items-center gap-4 overflow-x-auto whitespace-nowrap px-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="inline-flex items-center rounded-none px-0.5 py-1 text-sm font-semibold transition-opacity duration-300"
                style={
                  isActive(item.href)
                    ? {
                        color: activeColor,
                        textDecoration: "underline",
                        textDecorationColor: activeColor,
                        textUnderlineOffset: "6px",
                      }
                    : { color: inactiveColor }
                }
              >
                {item.label}
              </Link>
            ))}

            <a
              href="tel:+919247777996"
              className="inline-flex items-center gap-1 py-1 text-sm font-semibold transition-opacity duration-300"
              style={{ color: inactiveColor }}
            >
              <Phone className="h-3.5 w-3.5" />
              Call us
            </a>

            {!isAuthenticated ? (
              <Link
                href="/login"
                className="inline-flex items-center py-1 text-sm font-semibold transition-opacity duration-300"
                style={{ color: inactiveColor }}
              >
                Sign in
              </Link>
            ) : (
              <form action={signOut} data-confirm-message="Confirm logout?">
                <button
                  type="submit"
                  className="inline-flex items-center py-1 text-sm font-semibold transition-opacity duration-300"
                  style={{ color: inactiveColor }}
                >
                  Logout
                </button>
              </form>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
