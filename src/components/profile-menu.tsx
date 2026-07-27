"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Heart, LogOut, MapPin, MessageSquare, User } from "lucide-react";
import { signOut } from "@/lib/actions/auth";

/**
 * Desktop account menu.
 *
 * The header previously offered a bare "Logout" and nothing else, so a signed-in
 * visitor had no route into their own details, trips or favourites. Sign out is
 * kept last and separated, so it isn't the first thing the cursor lands on.
 */
export function ProfileMenu({
  email,
  isAdmin,
  tone,
}: {
  email?: string | null;
  isAdmin: boolean;
  tone: "ink" | "paper";
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const initials = (email?.split("@")[0] ?? "SP").slice(0, 2).toUpperCase();

  const ITEMS: { href: string; label: string; Icon: typeof User }[] = [
    { href: "/profile?tab=details", label: "Profile details", Icon: User },
    { href: "/profile?tab=trips", label: "Upcoming trips", Icon: MapPin },
    { href: "/profile?tab=past", label: "Past tours", Icon: MapPin },
    { href: "/profile?tab=saved", label: "My favourites", Icon: Heart },
    { href: "/profile?tab=enquiries", label: "My enquiries", Icon: MessageSquare },
  ];

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className={`inline-flex h-11 items-center gap-2 rounded-full pl-1.5 pr-3 text-[13.5px] font-semibold transition-colors ${
          tone === "ink" ? "text-ink hover:bg-ink/5" : "text-paper hover:bg-paper/15"
        }`}
      >
        <span className="grid h-8 w-8 place-items-center rounded-full bg-clay text-[12px] font-bold text-paper">
          {initials}
        </span>
        Profile
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+8px)] w-[260px] overflow-hidden rounded-2xl border border-hairline bg-card shadow-[0_30px_60px_-30px_rgba(20,17,11,0.45)]"
          style={{ animation: "menuIn 180ms cubic-bezier(0.22,1,0.36,1) both" }}
        >
          {email ? (
            <p className="truncate border-b border-hairline px-4 py-3 text-[13px] text-mutedfg">
              {email}
            </p>
          ) : null}

          <div className="flex flex-col p-1.5">
            {ITEMS.map(({ href, label, Icon }) => (
              <Link
                key={href}
                href={href}
                role="menuitem"
                onClick={() => setOpen(false)}
                className="flex min-h-[42px] items-center gap-2.5 rounded-xl px-2.5 text-[14.5px] font-semibold text-ink transition-colors hover:bg-ink/[0.04]"
              >
                <Icon className="h-[17px] w-[17px] text-clay" />
                {label}
              </Link>
            ))}
            {isAdmin ? (
              <Link
                href="/admin"
                role="menuitem"
                onClick={() => setOpen(false)}
                className="flex min-h-[42px] items-center gap-2.5 rounded-xl px-2.5 text-[14.5px] font-semibold text-ink transition-colors hover:bg-ink/[0.04]"
              >
                <User className="h-[17px] w-[17px] text-clay" />
                Admin dashboard
              </Link>
            ) : null}
          </div>

          <form
            action={signOut}
            data-confirm-message="Sign out of your account?"
            className="border-t border-hairline p-1.5"
          >
            <button
              type="submit"
              role="menuitem"
              className="flex min-h-[42px] w-full items-center gap-2.5 rounded-xl px-2.5 text-[14.5px] font-semibold text-ink transition-colors hover:bg-ink/[0.04]"
            >
              <LogOut className="h-[17px] w-[17px] text-mutedfg" />
              Sign out
            </button>
          </form>
        </div>
      ) : null}
    </div>
  );
}
