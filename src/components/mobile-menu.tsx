"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, Phone, User, Heart, MapPin, MessageSquare, LogOut } from "lucide-react";
import { signOut } from "@/lib/actions/auth";
import { PHONE_TEL, WA_PLAN } from "@/lib/site";

type NavLink = { href: string; label: string };

/**
 * Mobile navigation drawer.
 *
 * Replaces the horizontally scrolling nav row, which hid destinations off-screen
 * and gave no indication more existed. A sheet shows every destination at once,
 * with the account section grouped and Sign out last.
 */
export function MobileMenu({
  links,
  isAuthenticated,
  isAdmin,
  email,
  tone,
}: {
  links: NavLink[];
  isAuthenticated: boolean;
  isAdmin: boolean;
  email?: string | null;
  tone: "ink" | "paper";
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement | null>(null);

  // Escape to dismiss, and lock the page behind the sheet.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    panelRef.current?.focus();
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const isActive = (href: string) =>
    href.includes("#") ? false : pathname === href || pathname.startsWith(`${href}/`);

  const ACCOUNT: { href: string; label: string; Icon: typeof User }[] = [
    { href: "/profile?tab=details", label: "Profile details", Icon: User },
    { href: "/profile?tab=trips", label: "Upcoming trips", Icon: MapPin },
    { href: "/profile?tab=past", label: "Past tours", Icon: MapPin },
    { href: "/profile?tab=saved", label: "My favourites", Icon: Heart },
    { href: "/profile?tab=enquiries", label: "My enquiries", Icon: MessageSquare },
  ];

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        aria-expanded={open}
        className={`grid h-11 w-11 place-items-center rounded-full transition-colors lg:hidden ${
          tone === "ink" ? "text-ink hover:bg-ink/5" : "text-paper hover:bg-paper/15"
        }`}
      >
        <Menu className="h-6 w-6" />
      </button>

      {open ? (
        <div className="fixed inset-0 z-[200] lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-inkdeep/55"
          />
          <div
            ref={panelRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="absolute inset-y-0 right-0 flex w-[86%] max-w-[380px] flex-col overflow-y-auto bg-paper shadow-[-24px_0_60px_-30px_rgba(20,17,11,0.55)] outline-none"
            style={{ animation: "sheetIn 320ms var(--ease-drawer) both" }}
          >
            <div className="flex items-center justify-between border-b border-hairline px-5 py-4">
              <span className="font-display text-[17px] font-bold text-ink">Menu</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="grid h-11 w-11 place-items-center rounded-full text-ink transition-colors hover:bg-ink/5"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex flex-col px-2 py-3">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  aria-current={isActive(l.href) ? "page" : undefined}
                  onClick={() => setOpen(false)}
                  className={`flex min-h-[52px] items-center rounded-xl px-3 font-display text-[19px] font-bold transition-colors ${
                    isActive(l.href) ? "bg-clay/10 text-clay" : "text-ink hover:bg-ink/[0.04]"
                  }`}
                >
                  {l.label}
                </Link>
              ))}
              {isAdmin ? (
                <Link
                  href="/admin"
                  onClick={() => setOpen(false)}
                  className="flex min-h-[52px] items-center rounded-xl px-3 font-display text-[19px] font-bold text-ink transition-colors hover:bg-ink/[0.04]"
                >
                  Admin
                </Link>
              ) : null}
            </nav>

            <div className="mt-1 border-t border-hairline px-2 py-3">
              <p className="px-3 pb-1 text-[12px] font-semibold uppercase tracking-[0.12em] text-mutedfg">
                {isAuthenticated ? "Your account" : "Account"}
              </p>

              {isAuthenticated ? (
                <>
                  {email ? (
                    <p className="truncate px-3 pb-2 text-[13.5px] text-mutedfg">{email}</p>
                  ) : null}
                  {ACCOUNT.map(({ href, label, Icon }) => (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setOpen(false)}
                      className="flex min-h-[48px] items-center gap-3 rounded-xl px-3 text-[15.5px] font-semibold text-ink transition-colors hover:bg-ink/[0.04]"
                    >
                      <Icon className="h-[18px] w-[18px] text-clay" />
                      {label}
                    </Link>
                  ))}
                  <a
                    href={`tel:${PHONE_TEL}`}
                    className="flex min-h-[48px] items-center gap-3 rounded-xl px-3 text-[15.5px] font-semibold text-ink transition-colors hover:bg-ink/[0.04]"
                  >
                    <Phone className="h-[18px] w-[18px] text-clay" />
                    Call SS Rao
                  </a>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="flex min-h-[48px] items-center gap-3 rounded-xl px-3 text-[15.5px] font-semibold text-ink transition-colors hover:bg-ink/[0.04]"
                >
                  <User className="h-[18px] w-[18px] text-clay" />
                  Sign in
                </Link>
              )}
            </div>

            <div className="mt-auto flex flex-col gap-2.5 border-t border-hairline px-5 py-5">
              <a
                href={WA_PLAN}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-[52px] items-center justify-center rounded-full bg-clay text-[15px] font-bold text-paper"
              >
                Plan my trip
              </a>
              {isAuthenticated ? (
                <form action={signOut} data-confirm-message="Sign out of your account?">
                  <button
                    type="submit"
                    className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full border-[1.5px] border-ink/15 text-[14.5px] font-semibold text-ink"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                </form>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
