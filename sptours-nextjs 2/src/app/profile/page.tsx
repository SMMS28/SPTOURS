"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { SiteFooter } from "@/components/site-footer";
import { wa, inr } from "@/lib/site";

type Tab = "trips" | "saved" | "details";

const SAVED = [
  { slug: "discovering-arunachal-pradesh-7d6n", title: "Discovering Arunachal", region: "Arunachal", duration: "7D / 6N", price: 28899, image: "/images/northeast/discovering-arunachal-pradesh-7d6n-1.jpg" },
  { slug: "gangtok-darjeeling-yak-ride-6d5n", title: "Gangtok & Darjeeling", region: "Sikkim", duration: "6D / 5N", price: 21399, image: "/images/northeast/gangtok-darjeeling-yak-ride-6d5n-1.jpg" },
  { slug: "sikkim-getaway-yumthang-5d4n", title: "Sikkim Getaway · Yumthang", region: "Sikkim", duration: "5D / 4N", price: 20799, image: "/images/northeast/sikkim-getaway-yumthang-5d4n-1.jpg" },
];

const fieldCls = "h-[52px] rounded-xl border-[1.5px] border-[#E0D7C4] bg-[#fdfbf6] px-4 text-[15px] transition-colors focus:border-clay focus:outline-none";

export default function ProfilePage() {
  const [tab, setTab] = useState<Tab>("trips");

  return (
    <div className="flex min-h-screen flex-col">
      {/* header */}
      <header className="sticky top-0 z-50 border-b border-hairline bg-paper/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-3 lg:px-10">
          <Link href="/"><Image src="/images/logo-2026.png" alt="SP Tours and Travels" width={220} height={82} className="h-[46px] w-auto" /></Link>
          <nav className="hidden gap-8 text-[14.5px] font-semibold text-[#4c5142] md:flex">
            <Link href="/packages" className="transition-colors hover:text-clay">Journeys</Link>
            <Link href="/#promise" className="transition-colors hover:text-clay">Why us</Link>
            <Link href="/contact" className="transition-colors hover:text-clay">Contact</Link>
          </nav>
          <div className="flex items-center gap-3.5">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-clay text-sm font-bold text-paper">AS</span>
            <Link href="/login" className="text-sm font-semibold text-[#4c5142]">Logout</Link>
          </div>
        </div>
      </header>

      {/* welcome */}
      <section className="mx-auto w-full max-w-[1200px] px-6 pb-6 pt-12 lg:px-10">
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.24em] text-clay">Your account</p>
        <h1 className="font-display text-[clamp(34px,4vw,56px)] font-bold leading-none tracking-[-0.025em]">Welcome back, Ananya.</h1>
        <div className="mt-5.5 flex flex-wrap gap-8 pt-2 text-sm text-mutedfg">
          <span><b className="font-display text-lg text-ink">2</b>&nbsp; upcoming trips</span>
          <span><b className="font-display text-lg text-ink">3</b>&nbsp; saved journeys</span>
          <span><b className="font-display text-lg text-ink">Member</b>&nbsp; since 2024</span>
        </div>
      </section>

      {/* tabs */}
      <div className="mx-auto w-full max-w-[1200px] px-6 lg:px-10">
        <div className="flex gap-1.5 border-b border-ink/10">
          {([["trips", "My trips"], ["saved", "Saved"], ["details", "Profile details"]] as const).map(([k, l]) => (
            <button
              key={k}
              type="button"
              onClick={() => setTab(k)}
              className="border-b-2 px-[18px] py-3.5 text-[15px] transition-colors"
              style={{ color: tab === k ? "#17130D" : "#8a8578", fontWeight: tab === k ? 700 : 600, borderBottomColor: tab === k ? "#9B6A4C" : "transparent" }}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      <main className="mx-auto w-full max-w-[1200px] flex-1 px-6 pb-24 pt-9 lg:px-10">
        <motion.div key={tab} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>

          {tab === "trips" && (
            <div className="flex flex-col gap-[18px]">
              <TripCard image="/images/northeast/meghalaya-shillong-cherrapunjee-mawlynnong-5d4n-1.jpg" region="Meghalaya · 5D / 4N" title="Meghalaya Explorer" meta="14–18 November 2026 · 2 travellers" status={["Confirmed", "#3f7a4e", "rgba(63,122,78,0.12)"]} price="₹39,998" priceNote=" · paid"
                actions={<><Ghost href={wa("Hi SP Tours, a question about my Meghalaya Explorer booking.")}>Message us</Ghost><Dark href="/packages/meghalaya-shillong-cherrapunjee-mawlynnong-5d4n">View trip →</Dark></>} />
              <TripCard image="/images/northeast/arunachal-meghalaya-grand-circuit-10d9n-1.jpg" region="Arunachal + Meghalaya · 10D / 9N" title="The Grand Circuit" meta="Dates flexible · quote requested 24 Jul" status={["Quote sent", "#b5892f", "rgba(181,137,47,0.14)"]} price="₹57,999" priceNote=" /person est."
                actions={<><Ghost href={wa("Hi SP Tours, about my Grand Circuit quote.")}>Discuss quote</Ghost><a href={wa("Hi SP Tours, I'd like to confirm the Grand Circuit.")} target="_blank" rel="noopener noreferrer" className="inline-flex h-10 items-center rounded-full bg-clay px-[18px] text-[13px] font-bold text-paper transition-colors hover:bg-clay-dark">Confirm →</a></>} />
              <TripCard image="/images/northeast/north-sikkim-highlights-6d5n-1.jpg" region="Sikkim · 6D / 5N" title="Highlights of North Sikkim" meta="Completed · March 2025" status={["Completed", "#6b6252", "rgba(107,98,82,0.14)"]} faded
                footerLeft={<span className="text-[13.5px] text-mutedfg">How was your trip?</span>}
                actions={<Ghost href="#">Leave a review</Ghost>} />
            </div>
          )}

          {tab === "saved" && (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {SAVED.map((p) => (
                <Link key={p.slug} href={`/packages/${p.slug}`} className="block overflow-hidden rounded-[20px] border border-ink/8 bg-white transition-transform duration-500 hover:-translate-y-2">
                  <div className="relative h-[200px] overflow-hidden">
                    <Image src={p.image} alt={p.title} fill sizes="33vw" className="object-cover" />
                    <span className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-paper/90 text-base text-clay">♥</span>
                  </div>
                  <div className="p-5">
                    <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.1em] text-clay">{p.region} · {p.duration}</p>
                    <h4 className="mb-3 font-display text-xl font-bold">{p.title}</h4>
                    <div className="flex items-center justify-between border-t border-ink/10 pt-3.5">
                      <span className="font-display text-xl font-bold">{inr(p.price)}</span>
                      <span className="text-[13px] font-bold text-clay">View →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {tab === "details" && (
            <div className="max-w-[620px] rounded-[22px] border border-ink/8 bg-white p-[34px]">
              <h3 className="mb-[22px] font-display text-[22px] font-bold">Profile details</h3>
              <div className="grid grid-cols-2 gap-[18px]">
                <Field label="Full name"><input defaultValue="Ananya Sharma" className={fieldCls} /></Field>
                <Field label="Phone"><input defaultValue="+91 98765 20114" className={fieldCls} /></Field>
                <Field label="Email"><input defaultValue="ananya@email.com" className={fieldCls} /></Field>
                <Field label="City"><input defaultValue="Bengaluru" className={fieldCls} /></Field>
              </div>
              <div className="mt-6 flex gap-3">
                <button type="button" className="h-[52px] rounded-xl bg-clay px-[26px] text-[15px] font-bold text-paper transition-colors hover:bg-clay-dark">Save changes</button>
                <Link href="/login" className="inline-flex h-[52px] items-center rounded-xl border-[1.5px] border-ink/15 px-6 text-[15px] font-semibold transition-colors hover:bg-[#f3ece0]">Log out</Link>
              </div>
            </div>
          )}

        </motion.div>
      </main>

      <SiteFooter />
    </div>
  );
}

function TripCard({ image, region, title, meta, status, price, priceNote, actions, faded, footerLeft }: {
  image: string; region: string; title: string; meta: string; status: [string, string, string];
  price?: string; priceNote?: string; actions: React.ReactNode; faded?: boolean; footerLeft?: React.ReactNode;
}) {
  return (
    <article className={`grid overflow-hidden rounded-[20px] border border-ink/8 bg-white sm:grid-cols-[220px_1fr] ${faded ? "opacity-90" : ""}`}>
      <div className="relative min-h-[180px]"><Image src={image} alt={title} fill sizes="220px" className="object-cover" /></div>
      <div className="flex flex-col p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.1em] text-clay">{region}</p>
            <h3 className="mb-1.5 font-display text-2xl font-bold">{title}</h3>
            <p className="text-[13.5px] text-mutedfg">{meta}</p>
          </div>
          <span className="whitespace-nowrap rounded-full px-3 py-[5px] text-[11.5px] font-bold" style={{ color: status[1], background: status[2] }}>{status[0]}</span>
        </div>
        <div className="mt-5 flex items-center justify-between border-t border-ink/8 pt-4">
          {footerLeft ?? <span><b className="font-display text-xl">{price}</b><span className="text-xs text-[#8a8578]">{priceNote}</span></span>}
          <div className="flex gap-2.5">{actions}</div>
        </div>
      </div>
    </article>
  );
}

function Ghost({ href, children }: { href: string; children: React.ReactNode }) {
  const ext = href.startsWith("http");
  return <a href={href} {...(ext ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="inline-flex h-10 items-center rounded-full border-[1.5px] border-ink/15 px-4 text-[13px] font-semibold transition-colors hover:bg-[#f3ece0]">{children}</a>;
}
function Dark({ href, children }: { href: string; children: React.ReactNode }) {
  return <Link href={href} className="inline-flex h-10 items-center rounded-full bg-ink px-[18px] text-[13px] font-bold text-paper transition-colors hover:bg-clay">{children}</Link>;
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="flex flex-col gap-2"><label className="text-[12.5px] font-semibold text-[#4c4839]">{label}</label>{children}</div>;
}
