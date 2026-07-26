"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { PACKAGES, INCLUSIONS, wa, inr } from "@/lib/site";

const FILTERS: [string, string][] = [
  ["all", "All journeys"],
  ["sikkim", "Sikkim"],
  ["arunachal", "Arunachal"],
  ["meghalaya", "Meghalaya"],
  ["multi", "Multi-state"],
];

const reveal = {
  hidden: { opacity: 0, y: 28 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.7, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] } }),
};

export function PackagesDiscovery() {
  const [filter, setFilter] = useState("all");

  const shown = useMemo(
    () => PACKAGES.filter((p) => filter === "all" || p.state.split(" ").includes(filter)),
    [filter]
  );

  return (
    <div>
      {/* header band */}
      <section className="relative h-[480px] overflow-hidden bg-inkdeep">
        <div className="animate-kb absolute inset-0 bg-cover bg-[center_45%]" style={{ backgroundImage: "url('/images/hero-bg/pexels-logalongwithme-6058267.jpg')" }} />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,17,11,0.6)_0%,rgba(20,17,11,0.35)_45%,rgba(20,17,11,0.82)_100%)]" />
        <div className="absolute inset-x-0 bottom-11">
          <div className="mx-auto max-w-[1360px] px-6 lg:px-10">
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.24em] text-paper/75">Home / Journeys</p>
            <h1 className="font-display text-[clamp(44px,6vw,84px)] font-bold leading-[0.96] tracking-[-0.028em] text-paper">All journeys</h1>
            <p className="mt-5 max-w-[560px] text-[clamp(15px,1.3vw,18px)] text-paper/85">
              Seven signature routes across North East India — fixed departures or fully custom, all run end to end by our own teams on the ground.
            </p>
          </div>
        </div>
      </section>

      {/* filter bar */}
      <div className="sticky top-[72px] z-40 border-b border-hairline bg-paper/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1360px] flex-wrap items-center justify-between gap-5 px-6 py-4 lg:px-10">
          <div className="flex flex-wrap gap-2.5">
            {FILTERS.map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setFilter(key)}
                className={`rounded-full border-[1.5px] px-[18px] py-2.5 text-[13.5px] font-semibold transition-colors duration-200 ${
                  filter === key ? "border-ink bg-ink text-paper" : "border-ink/20 bg-transparent text-ink hover:border-ink/40"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <p className="font-mono text-[12.5px] text-mutedfg">{shown.length} tours</p>
        </div>
      </div>

      {/* grid */}
      <section className="mx-auto max-w-[1360px] px-6 pb-10 pt-12 lg:px-10">
        <div className="grid gap-[30px] md:grid-cols-2 xl:grid-cols-3">
          {shown.map((p, i) => (
            <motion.article
              key={p.slug}
              custom={i}
              variants={reveal}
              initial="hidden"
              animate="show"
              className="flex flex-col overflow-hidden rounded-[22px] border border-ink/10 bg-card transition-[transform,box-shadow] duration-500 hover:-translate-y-2 hover:shadow-[0_34px_66px_-40px_rgba(20,17,11,0.45)]"
            >
              <div className="relative h-[230px] overflow-hidden">
                <Image src={p.image} alt={p.title} fill sizes="(max-width:768px) 100vw, 33vw" className="object-cover transition-transform duration-[800ms] hover:scale-[1.06]" />
                {p.tag ? <span className="absolute left-3.5 top-3.5 rounded-full bg-paper px-3 py-1.5 font-mono text-[10.5px] uppercase tracking-wider text-inkdeep">{p.tag}</span> : null}
              </div>
              <div className="flex flex-1 flex-col p-6">
                <p className="mb-2.5 font-mono text-[11px] uppercase tracking-[0.1em] text-clay">{p.region} · {p.duration}</p>
                <h3 className="mb-2.5 font-display text-2xl font-bold leading-[1.08] tracking-[-0.01em]">{p.title}</h3>
                <p className="mb-4 text-[13.5px] leading-relaxed text-mutedfg">{p.blurb}</p>
                <div className="mb-5 flex flex-wrap gap-1.5">
                  {(INCLUSIONS[p.slug] ?? []).map((inc) => (
                    <span key={inc} className="rounded-full bg-[#f0e9da] px-2.5 py-1.5 text-[11px] text-[#4c5142]">{inc}</span>
                  ))}
                </div>
                <div className="mt-auto flex items-center justify-between border-t border-ink/10 pt-4">
                  <span><b className="font-display text-[22px]">{inr(p.price)}</b><span className="text-xs text-mutedfg"> /person</span></span>
                  <div className="flex items-center gap-2">
                    <a href={wa(`Hi SP Tours, I'm interested in ${p.title}.`)} target="_blank" rel="noopener noreferrer" aria-label="Enquire on WhatsApp" className="grid h-10 w-10 place-items-center rounded-full border-[1.5px] border-ink/15 transition-colors hover:border-clay hover:bg-clay hover:text-paper">✆</a>
                    <Link href={`/packages/${p.slug}`} className="inline-flex h-10 items-center rounded-full bg-ink px-[18px] text-[13px] font-bold text-paper transition-colors hover:bg-clay">View →</Link>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {shown.length === 0 ? (
          <p className="py-16 text-center text-[15px] text-mutedfg">
            No tours in this state yet — <a href={wa("Hi SP Tours, can you suggest a Northeast trip?")} target="_blank" rel="noopener noreferrer" className="font-bold text-clay">ask us to build one →</a>
          </p>
        ) : null}
      </section>

      {/* custom trip cta */}
      <section className="mx-auto max-w-[1360px] px-6 pb-[110px] pt-[30px] lg:px-10">
        <div className="flex flex-wrap items-center justify-between gap-[30px] rounded-3xl bg-inkdeep px-14 py-[54px] text-paper">
          <div className="max-w-[620px]">
            <h2 className="mb-3.5 font-display text-[clamp(28px,3vw,42px)] font-bold leading-[1.05] tracking-[-0.02em]">Don&apos;t see your exact trip?</h2>
            <p className="text-base leading-relaxed text-paper/80">Tell SS Rao your dates, budget and interests — we&apos;ll build a custom Northeast itinerary just for you.</p>
          </div>
          <a href={wa("Hi SP Tours, I'd like a custom Northeast itinerary.")} target="_blank" rel="noopener noreferrer" className="inline-flex h-[58px] items-center rounded-full bg-clay px-8 text-base font-bold text-paper shadow-[0_16px_40px_-18px_rgba(155,106,76,0.9)] transition-[background,transform] duration-300 hover:-translate-y-0.5 hover:bg-clay-dark">
            Build my trip on WhatsApp →
          </a>
        </div>
      </section>
    </div>
  );
}
