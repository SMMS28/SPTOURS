"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { PHONE_DISPLAY, PHONE_TEL, WA_PLAN } from "@/lib/site";

const LINKS = [
  { href: "/packages", label: "Journeys" },
  { href: "/northeast", label: "The Northeast" },
  { href: "/#promise", label: "Why us" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  // pages whose hero is light (ivory) need the solid dark-on-ivory header from the top
  const lightHero = pathname === "/northeast";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 70);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solid = scrolled || lightHero;
  const linkColor = solid ? "text-ink" : "text-paper";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[100] border-b transition-[background,box-shadow,border-color] duration-500 ${
        solid
          ? "border-hairline bg-paper/90 shadow-[0_10px_30px_-22px_rgba(20,17,11,0.5)] backdrop-blur-md"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-[1360px] items-center justify-between px-6 py-3.5 lg:px-10">
        <Link
          href="/"
          className="inline-flex items-center rounded-xl bg-paper/95 px-4 py-1.5 shadow-[0_6px_20px_-12px_rgba(0,0,0,0.5)]"
          aria-label="SP Tours & Travels — home"
        >
          <Image src="/images/logo-2026.png" alt="SP Tours and Travels" width={220} height={82} priority className="h-[46px] w-auto" />
        </Link>

        <nav className={`hidden items-center gap-9 text-[14.5px] font-semibold transition-colors duration-500 lg:flex ${linkColor}`}>
          {LINKS.map((l, i) => (
            <Link key={`${l.href}-${i}`} href={l.href} className="transition-opacity duration-300 hover:opacity-60">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <a
            href={`tel:${PHONE_TEL}`}
            className={`hidden font-mono text-[13px] transition-colors duration-500 sm:inline ${linkColor}`}
          >
            {PHONE_DISPLAY}
          </a>
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
    </header>
  );
}
