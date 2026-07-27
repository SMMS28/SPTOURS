"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, X } from "lucide-react";

/**
 * Back affordance for sub-pages.
 *
 * The site had no way back other than the browser chrome, which phones hide while
 * scrolling. Uses history when there's somewhere to return to and falls back to an
 * explicit href, so a visitor arriving from a shared link or search still gets a
 * sensible destination rather than a dead control.
 */
export function BackLink({
  href,
  label = "Back",
  tone = "ink",
  className = "",
}: {
  href: string;
  label?: string;
  tone?: "ink" | "paper";
  className?: string;
}) {
  const router = useRouter();

  const colour =
    tone === "paper"
      ? "text-paper/85 hover:text-paper border-paper/25 hover:bg-paper/10"
      : "text-ink hover:text-clay border-ink/15 hover:bg-[#f3ece0]";

  return (
    <button
      type="button"
      onClick={() => {
        if (typeof window !== "undefined" && window.history.length > 1) {
          router.back();
          return;
        }
        router.push(href);
      }}
      className={`inline-flex min-h-11 items-center gap-2 rounded-full border-[1.5px] px-4 text-[13.5px] font-semibold transition-colors ${colour} ${className}`}
    >
      <ArrowLeft className="h-4 w-4" />
      {label}
    </button>
  );
}

/** Static variant for places that must always land somewhere specific. */
export function BackTo({
  href,
  label,
  tone = "ink",
  className = "",
}: {
  href: string;
  label: string;
  tone?: "ink" | "paper";
  className?: string;
}) {
  const colour =
    tone === "paper"
      ? "text-paper/85 hover:text-paper border-paper/25 hover:bg-paper/10"
      : "text-ink hover:text-clay border-ink/15 hover:bg-[#f3ece0]";

  return (
    <Link
      href={href}
      className={`inline-flex min-h-11 items-center gap-2 rounded-full border-[1.5px] px-4 text-[13.5px] font-semibold transition-colors ${colour} ${className}`}
    >
      <ArrowLeft className="h-4 w-4" />
      {label}
    </Link>
  );
}

/**
 * Dismiss control for the ?message= / ?status= / ?saved= banners, which had no way
 * to be cleared other than navigating again.
 */
export function DismissBanner({ className = "" }: { className?: string }) {
  const router = useRouter();

  return (
    <button
      type="button"
      aria-label="Dismiss message"
      onClick={() => {
        const url = new URL(window.location.href);
        ["message", "status", "saved", "booking"].forEach((k) => url.searchParams.delete(k));
        router.replace(url.pathname + (url.search || ""));
      }}
      className={`grid h-8 w-8 shrink-0 place-items-center rounded-full transition-colors hover:bg-ink/5 ${className}`}
    >
      <X className="h-4 w-4" />
    </button>
  );
}
