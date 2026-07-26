import Link from "next/link";
import Image from "next/image";
import { EMAIL, PHONE_DISPLAY, PHONE_TEL, WA_ENQUIRE } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="bg-inkdeep px-6 pb-9 pt-[70px] text-paper/70 lg:px-10">
      <div className="mx-auto max-w-[1360px]">
        <div className="grid gap-10 border-b border-paper/15 pb-12 md:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div>
            <span className="mb-5 inline-flex rounded-xl bg-paper px-4 py-2">
              <Image src="/images/logo-2026.png" alt="SP Tours and Travels" width={210} height={78} className="h-11 w-auto" />
            </span>
            <p className="mb-1.5 font-display text-lg font-bold text-paper">Your Journey, Our Responsibility.</p>
            <p className="text-sm leading-relaxed">Trusted since 1986 · Managing Partner: S S Rao</p>
            <p className="max-w-[340px] text-sm leading-relaxed">
              T1, S. R. Residency, Sri Lakshmi Nagar, Namavaram Road, Morampudi, Rajahmundry, Andhra Pradesh 533107
            </p>
          </div>

          <FooterCol title="Journeys" links={[
            ["North Sikkim", "/packages"],
            ["Meghalaya Explorer", "/packages"],
            ["Discovering Arunachal", "/packages"],
            ["The Grand Circuit", "/packages"],
          ]} />

          <FooterCol title="Company" links={[
            ["Why us", "/#promise"],
            ["Contact", "/contact"],
            ["The Northeast", "/northeast"],
            ["All packages", "/packages"],
          ]} />

          <div>
            <p className="mb-[18px] font-mono text-[11px] uppercase tracking-[0.16em] text-paper/50">Get in touch</p>
            <div className="flex flex-col gap-3 text-[14.5px]">
              <a href={WA_ENQUIRE} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-paper">WhatsApp us</a>
              <a href={`tel:${PHONE_TEL}`} className="transition-colors hover:text-paper">{PHONE_DISPLAY}</a>
              <a href={`mailto:${EMAIL}`} className="transition-colors hover:text-paper">{EMAIL}</a>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-6 font-mono text-xs text-paper/50">
          <span>© {new Date().getFullYear()} SP TOURS &amp; TRAVELS · RAJAHMUNDRY, ANDHRA PRADESH</span>
          <span>NORTH EAST INDIA SPECIALISTS</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <p className="mb-[18px] font-mono text-[11px] uppercase tracking-[0.16em] text-paper/50">{title}</p>
      <div className="flex flex-col gap-3 text-[14.5px]">
        {links.map(([label, href], i) => (
          <Link key={`${label}-${i}`} href={href} className="transition-colors hover:text-paper">{label}</Link>
        ))}
      </div>
    </div>
  );
}
