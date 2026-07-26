"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { PACKAGES, ITINERARIES, INCLUSIONS, getPackage, wa, inr, PHONE_TEL } from "@/lib/site";

const reveal = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

const EXCLUDES = ["Flights to / from Guwahati", "Lunch & dinner", "Monument & camera fees", "Personal expenses & tips"];

export function PackageDetail({ slug }: { slug: string }) {
  const pkg = getPackage(slug);
  const [open, setOpen] = useState(0);
  if (!pkg) return null;

  const days = ITINERARIES[slug] ?? [];
  const includes = INCLUSIONS[slug] ?? [];
  const related = PACKAGES.filter((p) => p.slug !== slug).slice(0, 3);
  const enquire = wa(`Hi SP Tours, I'm interested in ${pkg.title} (${pkg.duration}).`);

  return (
    <div>
      {/* hero */}
      <section className="relative h-[640px] overflow-hidden bg-inkdeep">
        <div className="animate-kb absolute inset-0 bg-cover bg-[center_45%]" style={{ backgroundImage: `url('${pkg.image}')` }} />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,17,11,0.55)_0%,rgba(20,17,11,0.25)_40%,rgba(20,17,11,0.86)_100%)]" />
        <div className="absolute inset-x-0 bottom-12">
          <div className="mx-auto max-w-[1360px] px-6 lg:px-10">
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.22em] text-paper/75">
              <Link href="/" className="hover:text-paper">Home</Link> / <Link href="/packages" className="hover:text-paper">Journeys</Link> / {pkg.title}
            </p>
            <div className="mb-4 flex flex-wrap gap-3">
              {pkg.tag ? <span className="rounded-full bg-paper px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-wider text-inkdeep">{pkg.tag}</span> : null}
              <span className="rounded-full border border-paper/30 bg-paper/15 px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-wider text-paper">{pkg.region}</span>
            </div>
            <h1 className="max-w-[900px] font-display text-[clamp(44px,6.4vw,90px)] font-bold leading-[0.95] tracking-[-0.028em] text-paper">{pkg.title}</h1>
            <div className="mt-6 flex flex-wrap gap-7 text-[15px] text-paper">
              <span><span className="text-paper/65">Duration</span>&nbsp; {pkg.duration}</span>
              <span><span className="text-paper/65">Region</span>&nbsp; {pkg.region}</span>
              <span><span className="text-paper/65">From</span>&nbsp; <b className="font-display text-lg">{inr(pkg.price)}</b> /person</span>
            </div>
          </div>
        </div>
      </section>

      {/* body */}
      <section className="mx-auto grid max-w-[1360px] items-start gap-[60px] px-6 pb-10 pt-[70px] lg:grid-cols-[1fr_380px] lg:px-10">
        <div>
          <motion.div variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-8%" }}>
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-clay">Overview</p>
            <p className="mb-5 text-[clamp(19px,1.7vw,24px)] font-medium leading-[1.5] tracking-[-0.01em]">{pkg.blurb}</p>
            <p className="text-base leading-[1.7] text-[#5b5749]">One vehicle, one team, every permit and stay handled. You travel; we take care of the rest — exactly the way we&apos;ve run the Northeast since 1986.</p>
          </motion.div>

          {/* gallery */}
          <motion.div variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-8%" }} className="mt-10 grid grid-cols-[2fr_1fr_1fr] gap-3">
            <div className="relative h-[260px] overflow-hidden rounded-2xl"><Image src={pkg.image} alt="" fill sizes="50vw" className="object-cover" /></div>
            <div className="relative h-[260px] overflow-hidden rounded-2xl"><Image src="/images/hero-bg/pexels-vijit-bagh-3435480-5414576.jpg" alt="" fill sizes="25vw" className="object-cover" /></div>
            <div className="relative h-[260px] overflow-hidden rounded-2xl">
              <Image src="/images/hero-bg/nilotpal-kalita-24vPDG707eM-unsplash.jpg" alt="" fill sizes="25vw" className="object-cover" />
              <div className="absolute inset-0 grid place-items-center bg-inkdeep/45 font-mono text-[13px] text-paper">+ 12 photos</div>
            </div>
          </motion.div>

          {/* itinerary */}
          {days.length > 0 ? (
            <div className="mt-16">
              <motion.div variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true }} className="mb-[34px]">
                <p className="mb-3.5 font-mono text-xs uppercase tracking-[0.3em] text-clay">Day by day</p>
                <h2 className="font-display text-[clamp(30px,3.4vw,46px)] font-bold tracking-[-0.02em]">The full itinerary</h2>
              </motion.div>
              <div>
                {days.map((d, i) => {
                  const isOpen = open === i;
                  return (
                    <div key={d.day} className={`cursor-pointer border-t border-hairline py-[22px] ${i === days.length - 1 ? "border-b" : ""}`} onClick={() => setOpen(isOpen ? -1 : i)}>
                      <div className="flex items-center gap-[22px]">
                        <span className="w-[54px] shrink-0 font-mono text-xs text-clay">DAY {String(d.day).padStart(2, "0")}</span>
                        <h3 className="flex-1 font-display text-xl font-semibold">{d.title}</h3>
                        <span className={`shrink-0 text-2xl text-clay transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}>+</span>
                      </div>
                      <div className="grid transition-[grid-template-rows] duration-400" style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}>
                        <div className="overflow-hidden">
                          <p className="ml-[76px] mt-3.5 text-[15px] leading-relaxed text-[#5b5749]">{d.detail}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="mt-16 rounded-2xl border border-hairline bg-card p-8">
              <h2 className="mb-2 font-display text-2xl font-bold">Day-by-day plan</h2>
              <p className="text-[15px] leading-relaxed text-mutedfg">We tailor this {pkg.duration} route to your dates and pace — the full itinerary is shared the moment you enquire.</p>
            </div>
          )}

          {/* inclusions */}
          <motion.div variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true }} className="mt-[60px] grid gap-10 md:grid-cols-2">
            <div>
              <h3 className="mb-[18px] font-display text-[22px] font-bold">What&apos;s included</h3>
              <ul className="flex flex-col gap-3">
                {includes.map((inc) => (
                  <li key={inc} className="flex gap-3 text-[15px] text-[#3f3b30]"><span className="font-bold text-clay">✓</span> {inc}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-[18px] font-display text-[22px] font-bold">Not included</h3>
              <ul className="flex flex-col gap-3">
                {EXCLUDES.map((ex) => (
                  <li key={ex} className="flex gap-3 text-[15px] text-[#8a8578]"><span className="font-bold">–</span> {ex}</li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>

        {/* sticky booking */}
        <aside className="lg:sticky lg:top-24">
          <motion.div variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true }} className="rounded-[22px] border border-ink/10 bg-card p-7 shadow-[0_30px_60px_-44px_rgba(20,17,11,0.4)]">
            <div className="mb-1.5 flex items-baseline gap-2">
              <span className="font-mono text-xs text-[#8a8578]">from</span>
              <span className="font-display text-[40px] font-bold leading-none">{inr(pkg.price)}</span>
            </div>
            <p className="mb-[22px] text-[13px] text-[#8a8578]">per person · {pkg.duration} · twin sharing</p>
            <a href={enquire} target="_blank" rel="noopener noreferrer" className="mb-3 flex h-[54px] items-center justify-center rounded-[14px] bg-clay text-[15.5px] font-bold text-paper shadow-[0_14px_32px_-16px_rgba(155,106,76,0.9)] transition-[background,transform] duration-300 hover:-translate-y-0.5 hover:bg-clay-dark">Enquire on WhatsApp</a>
            <a href={`tel:${PHONE_TEL}`} className="flex h-[52px] items-center justify-center rounded-[14px] border-[1.5px] border-ink/15 text-[15px] font-bold transition-colors hover:bg-[#f0e9da]">Call SS Rao</a>
            <div className="mt-6 flex flex-col gap-3.5 border-t border-ink/10 pt-5">
              {[["Duration", pkg.duration], ["Best season", "Oct – Apr"], ["Group size", "2 – 12 guests"], ["Custom dates", "Available"]].map(([k, v], i) => (
                <div key={k} className="flex justify-between text-sm"><span className="text-[#8a8578]">{k}</span><span className={`font-semibold ${i === 3 ? "text-clay" : ""}`}>{v}</span></div>
              ))}
            </div>
          </motion.div>
          <p className="mt-4 text-center text-[12.5px] text-[#8a8578]">Free consultation · No booking fee to enquire</p>
        </aside>
      </section>

      {/* related */}
      <section className="mx-auto max-w-[1360px] px-6 pb-10 pt-[60px] lg:px-10">
        <div className="mb-[30px] flex items-end justify-between">
          <h2 className="font-display text-[clamp(26px,2.8vw,38px)] font-bold tracking-[-0.02em]">More Northeast journeys</h2>
          <Link href="/packages" className="text-sm font-bold text-clay">All tours →</Link>
        </div>
        <div className="grid gap-7 md:grid-cols-3">
          {related.map((p) => (
            <Link key={p.slug} href={`/packages/${p.slug}`} className="group block transition-transform duration-500 hover:-translate-y-2">
              <div className="relative mb-4 h-[240px] overflow-hidden rounded-[18px]">
                <Image src={p.image} alt={p.title} fill sizes="33vw" className="object-cover transition-transform duration-[800ms] group-hover:scale-[1.06]" />
              </div>
              <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.1em] text-clay">{p.region} · {p.duration}</p>
              <h3 className="mb-2 font-display text-[22px] font-bold">{p.title}</h3>
              <span className="font-display text-xl font-bold">{inr(p.price)}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
