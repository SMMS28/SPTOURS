"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { wa, WA_ENQUIRE, PHONE_DISPLAY, PHONE_TEL, EMAIL } from "@/lib/site";

const reveal = {
  hidden: { opacity: 0, y: 28 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] } }),
};

const TOURS = [
  "Not sure yet — help me choose",
  "The Grand Circuit (10D / 9N)",
  "Highlights of North Sikkim (6D / 5N)",
  "Meghalaya Explorer (5D / 4N)",
  "Discovering Arunachal (7D / 6N)",
  "Gangtok & Darjeeling (6D / 5N)",
  "Arunachal Classic — Tawang (6D / 5N)",
  "Sikkim Getaway · Yumthang (5D / 4N)",
  "A fully custom itinerary",
];
const MONTHS = ["Flexible", "October 2026", "November 2026", "December 2026", "January 2027", "February 2027", "March 2027", "April 2027"];
const PAX = ["2 adults", "1 adult", "2 adults + kids", "Family group (4–6)", "Large group (7+)"];
const BUDGET = ["No fixed budget", "Under ₹20,000", "₹20,000 – ₹35,000", "₹35,000 – ₹60,000", "₹60,000+"];

const field = "h-[52px] rounded-xl border-[1.5px] border-[#E0D7C4] bg-white px-4 text-[15px] text-ink transition-colors focus:border-clay focus:outline-none";
const label = "text-[12.5px] font-semibold tracking-[0.02em] text-[#4c4839]";

export default function ContactPage() {
  const [f, setF] = useState({ name: "", phone: "", tour: TOURS[0], month: MONTHS[0], pax: PAX[0], budget: BUDGET[0], msg: "" });
  const set = (k: string, v: string) => setF((p) => ({ ...p, [k]: v }));

  const send = () => {
    let t = "Hi SP Tours, I'd like to enquire about a Northeast trip.";
    if (f.name) t += `\n\nName: ${f.name}`;
    if (f.phone) t += `\nPhone: ${f.phone}`;
    t += `\nInterested in: ${f.tour}`;
    t += `\nTravel month: ${f.month}`;
    t += `\nTravellers: ${f.pax}`;
    t += `\nBudget/person: ${f.budget}`;
    if (f.msg) t += `\nNotes: ${f.msg}`;
    window.open(wa(t), "_blank", "noopener");
  };

  return (
    <div>
      {/* header band */}
      <section className="relative h-[420px] overflow-hidden bg-inkdeep">
        <div className="animate-kb absolute inset-0 bg-cover bg-[center_40%]" style={{ backgroundImage: "url('/images/hero-bg/pexels-vijit-bagh-3435480-5414576.jpg')" }} />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,17,11,0.55)_0%,rgba(20,17,11,0.3)_45%,rgba(20,17,11,0.85)_100%)]" />
        <div className="absolute inset-x-0 bottom-11">
          <div className="mx-auto max-w-[1360px] px-6 lg:px-10">
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.24em] text-paper/75">Home / Contact</p>
            <h1 className="font-display text-[clamp(40px,5.6vw,80px)] font-bold leading-[0.96] tracking-[-0.028em] text-paper">Let&apos;s plan your trip</h1>
            <p className="mt-4 max-w-[560px] text-[clamp(15px,1.3vw,18px)] text-paper/85">One message and SS Rao&apos;s team takes it from there — honest advice, real routes, zero pressure.</p>
          </div>
        </div>
      </section>

      {/* body */}
      <section className="mx-auto grid max-w-[1360px] items-start gap-14 px-6 pb-24 pt-20 lg:grid-cols-[1.15fr_0.85fr] lg:px-10">
        {/* form */}
        <motion.div custom={0} variants={reveal} initial="hidden" animate="show">
          <p className="mb-3.5 font-mono text-xs uppercase tracking-[0.3em] text-clay">Enquiry form</p>
          <h2 className="mb-2.5 font-display text-[clamp(28px,3vw,42px)] font-bold tracking-[-0.02em]">Tell us a little, we&apos;ll do the rest</h2>
          <p className="mb-8 text-[15px] text-mutedfg">Fill this in and we&apos;ll open WhatsApp with your details ready to send — the fastest way to reach us.</p>

          <div className="grid gap-[18px] sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className={label}>Your name</label>
              <input className={field} type="text" placeholder="e.g. Ananya Sharma" value={f.name} onChange={(e) => set("name", e.target.value)} />
            </div>
            <div className="flex flex-col gap-2">
              <label className={label}>Phone number</label>
              <input className={field} type="tel" placeholder="e.g. +91 98xxx xxxxx" value={f.phone} onChange={(e) => set("phone", e.target.value)} />
            </div>
            <Select l="Interested in" opts={TOURS} v={f.tour} on={(v) => set("tour", v)} />
            <Select l="Travel month" opts={MONTHS} v={f.month} on={(v) => set("month", v)} />
            <Select l="Travellers" opts={PAX} v={f.pax} on={(v) => set("pax", v)} />
            <Select l="Budget / person" opts={BUDGET} v={f.budget} on={(v) => set("budget", v)} />
          </div>
          <div className="mt-[18px] flex flex-col gap-2">
            <label className={label}>Anything else?</label>
            <textarea rows={3} className="resize-y rounded-xl border-[1.5px] border-[#E0D7C4] bg-white p-4 text-[15px] text-ink transition-colors focus:border-clay focus:outline-none" placeholder="Dietary needs, must-see places, anniversary trip…" value={f.msg} onChange={(e) => set("msg", e.target.value)} />
          </div>

          <button type="button" onClick={send} className="mt-6 h-[58px] w-full rounded-[14px] bg-clay text-base font-bold text-paper shadow-[0_16px_38px_-18px_rgba(155,106,76,0.9)] transition-[background,transform] duration-300 hover:-translate-y-0.5 hover:bg-clay-dark">
            Send my enquiry on WhatsApp →
          </button>
          <p className="mt-3.5 text-center text-[12.5px] text-[#8a8578]">Opens WhatsApp with your details pre-filled. We usually reply within the hour.</p>
        </motion.div>

        {/* info */}
        <motion.aside custom={1} variants={reveal} initial="hidden" animate="show" className="flex flex-col gap-3.5">
          <a href={WA_ENQUIRE} target="_blank" rel="noopener noreferrer" className="block rounded-[18px] bg-clay p-[26px] text-paper transition-[background,transform] duration-300 hover:-translate-y-1 hover:bg-clay-dark">
            <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.14em] text-paper/80">Fastest reply</p>
            <p className="mb-1 font-display text-2xl font-bold">Chat on WhatsApp</p>
            <p className="text-[13.5px] text-paper/85">{PHONE_DISPLAY} · replies in minutes →</p>
          </a>
          <div className="grid grid-cols-2 gap-3.5">
            <a href={`tel:${PHONE_TEL}`} className="block rounded-[18px] border border-ink/10 bg-white p-[22px] transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-30px_rgba(20,17,11,0.4)]">
              <p className="mb-2.5 font-mono text-[11px] uppercase tracking-[0.14em] text-clay">Call SS Rao</p>
              <p className="font-display text-[17px] font-bold leading-tight">{PHONE_DISPLAY}</p>
            </a>
            <a href={`mailto:${EMAIL}`} className="block rounded-[18px] border border-ink/10 bg-white p-[22px] transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-30px_rgba(20,17,11,0.4)]">
              <p className="mb-2.5 font-mono text-[11px] uppercase tracking-[0.14em] text-clay">Email</p>
              <p className="break-words font-display text-[14.5px] font-bold leading-tight">{EMAIL}</p>
            </a>
          </div>
          <div className="rounded-[18px] border border-ink/10 bg-white p-6">
            <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.14em] text-clay">Our office</p>
            <p className="mb-3.5 text-[14.5px] leading-relaxed text-[#3f3b30]">T1, S. R. Residency, Sri Lakshmi Nagar,<br />Namavaram Road, Morampudi,<br />Rajahmundry, Andhra Pradesh 533107</p>
            <div className="flex justify-between border-t border-ink/10 pt-3.5 text-[13.5px]"><span className="text-[#8a8578]">Open hours</span><span className="font-semibold">Mon – Sat · 9:30am – 7:30pm</span></div>
          </div>
          <div className="relative h-[200px] overflow-hidden rounded-[18px]">
            <Image src="/images/hero-bg/nilotpal-kalita-24vPDG707eM-unsplash.jpg" alt="Northeast India" fill sizes="40vw" className="object-cover" />
            <div className="absolute inset-0 flex items-end bg-[linear-gradient(180deg,transparent_40%,rgba(20,17,11,0.8)_100%)] p-5"><p className="font-display text-lg font-bold text-paper">Serving the Northeast since 1986</p></div>
          </div>
        </motion.aside>
      </section>
    </div>
  );
}

function Select({ l, opts, v, on }: { l: string; opts: string[]; v: string; on: (v: string) => void }) {
  return (
    <div className="flex flex-col gap-2">
      <label className={label}>{l}</label>
      <select className={field} value={v} onChange={(e) => on(e.target.value)}>
        {opts.map((o) => <option key={o}>{o}</option>)}
      </select>
    </div>
  );
}
