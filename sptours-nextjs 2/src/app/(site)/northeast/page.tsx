"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { WA_PLAN } from "@/lib/site";

const reveal = {
  hidden: { opacity: 0, y: 28 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.85, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] } }),
};

const STATES = [
  { name: "Sikkim", tagline: "Himalayan jewel", image: "/images/hero-bg/pexels-chunry-6538013.jpg", desc: "Rumtek Monastery, the shimmering Tsomgo Lake and the legendary Goechala trek — serenity meets alpine adventure." },
  { name: "Meghalaya", tagline: "Abode of clouds", image: "/images/hero-bg/pexels-parijb-3678501.jpg", desc: "Living root bridges, the glass-clear Dawki river and Mawlynnong — Asia's cleanest village — in a cloud-wrapped paradise." },
  { name: "Assam", tagline: "Gateway of the Northeast", image: "/images/hero-bg/nilotpal-kalita-24vPDG707eM-unsplash.jpg", desc: "Emerald tea gardens, cruises on the mighty Brahmaputra and the one-horned rhino at Kaziranga — a UNESCO marvel." },
  { name: "Arunachal Pradesh", tagline: "Land of dawn-lit mountains", image: "/images/hero-bg/pexels-pallabi-dewri-791137-5496933.jpg", desc: "India's largest monastery at Tawang, the zen Ziro Valley and snowy Sela Pass — every kilometre a revelation." },
  { name: "Nagaland", tagline: "Land of festivals", image: "/images/hero-bg/pexels-vijit-bagh-3435480-5414576.jpg", desc: "The legendary Hornbill Festival, the dramatic Dzükou Valley and the warm hospitality of the Naga tribes." },
  { name: "Manipur", tagline: "Jewel of India", image: "/images/hero-bg/pexels-logalongwithme-6058267.jpg", desc: "The world's only floating national park at Loktak Lake, ancient polo grounds and a centuries-old dance heritage." },
  { name: "Darjeeling", tagline: "Queen of the hills", image: "/images/northeast/gangtok-darjeeling-yak-ride-6d5n-1.jpg", desc: "The UNESCO-listed Himalayan Railway, golden tea estates and a Tiger Hill sunrise over Kangchenjunga." },
];

const STOPS = [
  { name: "Kaziranga National Park", state: "Assam", best: "Nov – Apr", permit: "At gates / online", act: "Jeep & elephant safari", desc: "Home of the endangered one-horned rhino; a UNESCO World Heritage site of grassland and swamp." },
  { name: "Tawang Monastery", state: "Arunachal Pradesh", best: "Mar – Oct", permit: "ILP (online)", act: "Monastery, Sela Pass", desc: "India's largest monastery at 10,000 ft — birthplace of the 6th Dalai Lama, ringed by Himalayan peaks." },
  { name: "Tsomgo Lake & Nathula", state: "Sikkim", best: "May – Oct", permit: "Via Gangtok agents", act: "Yak ride, Baba Mandir", desc: "A high-altitude glacial lake reflecting snow peaks, and the strategic Indo-Tibet border pass beyond it." },
  { name: "Nohkalikai Falls", state: "Meghalaya", best: "Oct – Mar", permit: "None · small fee", act: "Root-bridge day trip", desc: "India's tallest plunge waterfall — 335 m of misty, thundering grandeur near Cherrapunjee." },
];

const SEASONS = [
  { period: "Oct – Apr", badge: "Peak", peak: true, temp: "15°C – 35°C", head: "Best for sightseeing, treks & festivals", pts: ["Clear post-monsoon mountain skies", "Bihu, Hornbill, Losar festivals", "Ideal trekking weather", "Wildlife in peak viewing season"] },
  { period: "May – Jun", badge: "Summer", peak: false, temp: "30°C – 38°C", head: "Lush greens, fewer crowds", pts: ["Tea gardens at their finest", "Quieter, more authentic", "Cool mornings for safaris", "Dry roads before the rains"] },
  { period: "Jun – Sep", badge: "Monsoon", peak: false, temp: "22°C – 35°C", head: "Dramatic waterfalls & green valleys", pts: ["Nohkalikai & Nuranang at their peak", "Dzükou Valley carpeted in lilies", "Lowest prices, fewest tourists", "Cherrapunji at its most vivid"] },
];

const ACTIVITIES = [
  ["White-water rafting", "The Teesta and Brahmaputra rapids — Grade II to Grade V runs."],
  ["Biking expeditions", "Mountain passes and forest roads through Sikkim, Meghalaya and Arunachal."],
  ["Trekking", "Goechala, the living root bridges, Talley Valley and Mechuka."],
  ["Hornbill Festival", "Nagaland's ten-day showcase of tribal dance, craft and cuisine each December."],
  ["Living root bridges", "Ancient bioengineered bridges woven from rubber-tree roots in Meghalaya."],
  ["Paragliding", "Soar over Sikkim's valleys and Meghalaya's hills with Himalayan vistas."],
  ["Loktak lake cruise", "Glide past floating islands to the world's only floating national park."],
  ["Culinary journeys", "Assam's smoky duck curry, Sikkim's momos, Nagaland's bamboo-shoot fry."],
];

const CUISINE = [
  ["Assam", "Duck Curry", "Slow-cooked with ash gourd and crushed black pepper."],
  ["Nagaland", "Smoked Pork", "Wood-smoked crisp outside, tender in, with steamed rice."],
  ["Sikkim", "Momo", "Juicy dumplings with a tangy tomato-chilli sauce."],
  ["Meghalaya", "Jadoh", "Fragrant pork rice stewed with local spices — a Khasi staple."],
  ["Manipur", "Eromba", "Fiery curry of dried fish, bamboo shoots and vegetables."],
  ["Arunachal", "Zan", "Thick millet porridge with savoury vegetable or meat sides."],
  ["Mizoram", "Bai", "Wholesome slow-cooked stew of vegetables, bamboo & pork."],
  ["Tripura", "Chikhvi", "Bamboo mushrooms and fried fish in a light, aromatic broth."],
];

const AIRPORTS = [
  ["Guwahati, Assam", "Primary gateway"],
  ["Bagdogra, WB", "Darjeeling & Sikkim"],
  ["Shillong (Umroi)", "Cherrapunjee & bridges"],
  ["Dibrugarh, Assam", "Upper Assam & Arunachal"],
];

function CountUp({ to, prefix = "" }: { to: number; prefix?: string }) {
  const [n, setN] = useState(0);
  const ref = useRef<HTMLSpanElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - start) / 1400, 1);
          setN(to * (1 - Math.pow(1 - p, 3)));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [to]);
  return <span ref={ref}>{prefix}{Math.round(n).toLocaleString("en-IN")}</span>;
}

export default function NortheastPage() {
  const [active, setActive] = useState(0);
  const swTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const startAuto = () => {
    if (swTimer.current) clearInterval(swTimer.current);
    swTimer.current = setInterval(() => setActive((a) => (a + 1) % STATES.length), 4500);
  };

  useEffect(() => {
    startAuto();
    return () => { if (swTimer.current) clearInterval(swTimer.current); };
  }, []);

  return (
    <div>
      {/* hero — editorial split on ivory */}
      <section className="relative flex min-h-screen items-center overflow-hidden bg-paper px-6 pb-[70px] pt-32 lg:px-10">
        <div className="pointer-events-none absolute -right-[6%] -top-[12%] h-[560px] w-[560px] rounded-full bg-[radial-gradient(circle,rgba(155,106,76,0.10),transparent_70%)]" />
        <div className="mx-auto grid w-full max-w-[1360px] items-center gap-[60px] lg:grid-cols-[1.02fr_1fr]">
          <div>
            <p className="mb-6 font-mono text-[13px] uppercase tracking-[0.3em] text-clay">North East India · Since 1986</p>
            <h1 className="font-display text-[clamp(52px,6.4vw,104px)] font-bold leading-[0.9] tracking-[-0.03em] text-ink">
              The Seven<br />Sisters, <span className="font-medium italic text-clay">wild</span><br />&amp; unforgettable.
            </h1>
            <p className="mb-9 mt-7 max-w-[480px] text-[clamp(16px,1.3vw,19px)] leading-relaxed text-[#5b5749]">Eight states between the Himalayas, Bangladesh and Myanmar — from Assam&apos;s rhino grasslands to Meghalaya&apos;s cloud-hung root bridges. Run end to end by people who live it.</p>
            <div className="flex flex-wrap gap-4">
              <Link href="/packages" className="inline-flex h-14 items-center rounded-full bg-clay px-[30px] text-[15.5px] font-bold text-paper shadow-[0_18px_44px_-18px_rgba(155,106,76,0.9)] transition-[background,transform] duration-300 hover:-translate-y-0.5 hover:bg-clay-dark">Browse packages →</Link>
              <a href={WA_PLAN} target="_blank" rel="noopener noreferrer" className="inline-flex h-14 items-center rounded-full border-[1.5px] border-ink/20 px-7 text-[15.5px] font-semibold text-ink transition-colors duration-300 hover:border-ink hover:bg-ink hover:text-paper">Plan on WhatsApp</a>
            </div>
            <div className="mt-11 flex flex-wrap gap-[34px] border-t border-ink/12 pt-7">
              {[[8, "States", ""], [7, "Routes", ""], [19999, "From / person", "₹"], [null, "Since", ""]].map(([num, sub, pre], i) => (
                <div key={sub as string}>
                  <p className="font-display text-[34px] font-bold text-ink">{num === null ? "1986" : <CountUp to={num as number} prefix={pre as string} />}</p>
                  <p className="mt-1.5 font-mono text-[10.5px] uppercase tracking-[0.12em] text-[#8a8578]">{sub as string}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative h-[600px]">
            <div className="absolute right-0 top-0 h-full w-[78%] overflow-hidden rounded-[28px] shadow-[0_50px_90px_-50px_rgba(20,17,11,0.6)]">
              <Image src="/images/hero-bg/pexels-parijb-3678501.jpg" alt="Meghalaya" fill sizes="600px" className="animate-kb object-cover" priority />
              <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(20,17,11,0.6)_0%,rgba(20,17,11,0)_45%)]" />
              <div className="absolute bottom-[22px] left-[22px] text-paper"><p className="mb-1 font-mono text-[10.5px] uppercase tracking-[0.16em] text-[#E3B98A]">Meghalaya</p><p className="font-display text-[17px] font-semibold">Living root bridges</p></div>
            </div>
            <div className="absolute bottom-10 left-0 h-[300px] w-[46%] overflow-hidden rounded-[22px] border-[5px] border-paper shadow-[0_34px_60px_-34px_rgba(20,17,11,0.55)]">
              <Image src="/images/hero-bg/pexels-pallabi-dewri-791137-5496933.jpg" alt="Arunachal" fill sizes="300px" className="object-cover" />
            </div>
            <div className="absolute left-2 top-[26px] flex h-[116px] w-[116px] flex-col items-center justify-center rounded-full bg-inkdeep text-center text-paper shadow-[0_20px_40px_-18px_rgba(20,17,11,0.6)]">
              <span className="font-display text-[34px] font-bold leading-none text-[#E3B98A]">8</span>
              <span className="mt-1 font-mono text-[8.5px] uppercase leading-tight tracking-[0.18em] text-paper/75">Seven<br />Sisters</span>
            </div>
          </div>
        </div>
        <div className="absolute bottom-[26px] left-6 z-[3] inline-flex items-center gap-3 lg:left-10">
          <span className="h-px w-10 bg-ink/40" />
          <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#8a8578]">Scroll to explore</span>
        </div>
      </section>

      {/* intro */}
      <section className="mx-auto max-w-[1360px] px-6 pb-5 pt-[110px] lg:px-10">
        <motion.div variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-8%" }} className="grid items-end gap-14 md:grid-cols-2">
          <div>
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-clay">The destination</p>
            <h2 className="font-display text-[clamp(34px,4.4vw,64px)] font-bold leading-[0.98] tracking-[-0.028em]">Where India&apos;s wildest land meets its richest cultures.</h2>
          </div>
          <p className="mb-1.5 text-[16.5px] leading-[1.7] text-[#5b5749]">The Northeast is India&apos;s best-kept secret — eight states tucked between the Himalayas, Bangladesh and Myanmar. Ancient tribal traditions coexist with rare ecosystems, living architecture grows from forest floors, and every winding road reveals a view more breathtaking than the last.</p>
        </motion.div>
      </section>

      {/* explore by state — interactive switcher */}
      <section
        className="mx-auto max-w-[1360px] px-6 pb-10 pt-[70px] lg:px-10"
        onMouseEnter={() => { if (swTimer.current) { clearInterval(swTimer.current); swTimer.current = null; } }}
        onMouseLeave={() => startAuto()}
      >
        <motion.div variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true }} className="mb-8 flex items-end justify-between gap-8">
          <div>
            <p className="mb-3.5 font-mono text-xs uppercase tracking-[0.3em] text-clay">Explore by state</p>
            <h2 className="font-display text-[clamp(30px,3.6vw,52px)] font-bold tracking-[-0.025em]">Eight worlds, one region.</h2>
          </div>
          <p className="mb-1.5 hidden font-mono text-xs text-[#8a8578] sm:block">hover a state to preview →</p>
        </motion.div>
        <div className="grid items-stretch gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="flex flex-col">
            {STATES.map((s, i) => {
              const on = i === active;
              return (
                <button
                  key={s.name}
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  className={`flex items-center justify-between gap-4 border-t border-ink/12 py-5 text-left transition-[padding] duration-300 ${i === STATES.length - 1 ? "border-b" : ""} ${on ? "pl-3.5" : "pl-1"}`}
                >
                  <span className="flex items-baseline gap-4">
                    <span className="w-[26px] font-mono text-xs text-clay">{String(i + 1).padStart(2, "0")}</span>
                    <span className={`font-display text-[clamp(23px,2.3vw,33px)] font-bold tracking-[-0.02em] transition-colors ${on ? "text-clay" : "text-ink"}`}>{s.name}</span>
                  </span>
                  <span className={`text-xl text-clay transition-all ${on ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0"}`}>→</span>
                </button>
              );
            })}
          </div>
          <div className="relative min-h-[540px] overflow-hidden rounded-[26px] shadow-[0_44px_90px_-52px_rgba(20,17,11,0.65)]">
            {STATES.map((s, i) => (
              <div key={s.name} className="absolute inset-0 transition-opacity duration-[800ms]" style={{ opacity: i === active ? 1 : 0 }}>
                <Image src={s.image} alt={s.name} fill sizes="700px" className="object-cover" />
              </div>
            ))}
            <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(20,17,11,0.9)_6%,rgba(20,17,11,0.15)_55%,rgba(20,17,11,0)_100%)]" />
            <div className="absolute inset-x-[34px] bottom-[34px] text-paper">
              <p className="mb-2.5 font-mono text-xs uppercase tracking-[0.16em] text-[#E3B98A]">{STATES[active].tagline}</p>
              <h3 className="mb-3.5 font-display text-[clamp(30px,3vw,44px)] font-bold tracking-[-0.02em]">{STATES[active].name}</h3>
              <p className="mb-[22px] max-w-[440px] text-[15px] leading-relaxed text-paper/85">{STATES[active].desc}</p>
              <Link href="/packages" className="inline-flex h-[50px] items-center gap-2.5 rounded-full bg-clay px-[26px] text-[14.5px] font-bold text-paper transition-[background,transform] duration-300 hover:-translate-y-0.5 hover:bg-clay-dark">View {STATES[active].name} packages →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* iconic stops */}
      <Section eyebrow="Must-visit places" title="Iconic stops on every journey.">
        <div className="grid gap-5 md:grid-cols-2">
          {STOPS.map((s, i) => (
            <motion.div key={s.name} custom={i % 2} variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-6%" }} className="rounded-[20px] border border-ink/[0.09] bg-white p-[26px]">
              <div className="mb-3.5 flex items-start justify-between gap-3.5">
                <div><h3 className="mb-1 font-display text-[21px] font-bold">{s.name}</h3><p className="text-[12.5px] font-semibold text-clay">{s.state}</p></div>
                <span className="whitespace-nowrap rounded-full border border-ink/[0.08] bg-[#F0E9DA] px-3 py-[5px] font-mono text-[11px] text-[#4c5142]">{s.best}</span>
              </div>
              <p className="mb-4 text-sm leading-relaxed text-[#5b5749]">{s.desc}</p>
              <div className="flex gap-6 border-t border-ink/[0.08] pt-3.5">
                <div><p className="mb-1 font-mono text-[10px] uppercase tracking-[0.08em] text-[#a49d8c]">Permit</p><p className="text-[13px] font-semibold">{s.permit}</p></div>
                <div><p className="mb-1 font-mono text-[10px] uppercase tracking-[0.08em] text-[#a49d8c]">Do</p><p className="text-[13px] font-semibold">{s.act}</p></div>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* when to visit */}
      <Section eyebrow="Travel calendar" title="When to visit.">
        <div className="grid gap-5 lg:grid-cols-3">
          {SEASONS.map((s, i) => (
            <motion.div key={s.period} custom={i} variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-6%" }} className="rounded-[20px] border border-ink/[0.09] bg-white p-[30px]">
              <div className="mb-1.5 flex items-center justify-between">
                <span className="font-display text-[26px] font-bold">{s.period}</span>
                <span className={`rounded-full px-3 py-[5px] text-[11px] font-bold ${s.peak ? "bg-clay text-paper" : "bg-[#F0E9DA] text-[#4c5142]"}`}>{s.badge}</span>
              </div>
              <p className="mb-4 font-mono text-xs text-[#8a8578]">Avg {s.temp}</p>
              <h3 className="mb-3.5 font-display text-base font-bold">{s.head}</h3>
              <ul className="flex flex-col gap-2.5">
                {s.pts.map((pt) => (
                  <li key={pt} className="flex gap-2.5 text-[13.5px] text-[#5b5749]"><span className="mt-[7px] h-[5px] w-[5px] shrink-0 rounded-full bg-clay" />{pt}</li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* things to do */}
      <Section eyebrow="Experiences" title="Unforgettable things to do.">
        <div className="grid gap-[18px] sm:grid-cols-2 lg:grid-cols-4">
          {ACTIVITIES.map(([t, d], i) => (
            <motion.div key={t} custom={i % 4} variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-4%" }} className="rounded-[18px] border border-ink/[0.09] bg-white p-6 transition-[transform,box-shadow] duration-400 hover:-translate-y-1.5 hover:shadow-[0_24px_48px_-34px_rgba(20,17,11,0.4)]">
              <p className="mb-3.5 font-mono text-xs text-clay">{String(i + 1).padStart(2, "0")}</p>
              <h3 className="mb-2 font-display text-lg font-bold">{t}</h3>
              <p className="text-[13.5px] leading-relaxed text-mutedfg">{d}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* how to reach */}
      <Section eyebrow="Getting here" title="How to reach the Northeast.">
        <div className="grid gap-5 lg:grid-cols-2">
          <motion.div variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-6%" }} className="rounded-[20px] bg-inkdeep p-[30px] text-paper">
            <div className="mb-2 flex items-baseline gap-3"><span className="font-mono text-xs text-[#E3B98A]">01</span><h3 className="font-display text-xl font-bold">By air — fastest</h3></div>
            <p className="mb-[18px] text-sm leading-relaxed text-paper/70">Direct flights from Delhi, Mumbai, Kolkata &amp; Bangalore; international via Bangkok, Singapore &amp; Paro.</p>
            <div className="flex flex-col gap-2">
              {AIRPORTS.map(([c, n]) => (
                <div key={c} className="flex justify-between gap-3 rounded-xl border border-paper/12 bg-paper/[0.07] px-4 py-3"><span className="text-sm font-semibold">{c}</span><span className="text-[12.5px] text-paper/60">{n}</span></div>
              ))}
            </div>
          </motion.div>
          <div className="flex flex-col gap-5">
            <motion.div custom={1} variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-6%" }} className="rounded-[20px] border border-ink/[0.09] bg-white p-[30px]">
              <div className="mb-2 flex items-baseline gap-3"><span className="font-mono text-xs text-clay">02</span><h3 className="font-display text-xl font-bold">By train — scenic &amp; budget</h3></div>
              <p className="mb-3 text-sm leading-relaxed text-[#5b5749]">Major railheads at Guwahati, New Jalpaiguri, Dimapur, Dibrugarh &amp; Agartala.</p>
              <ul className="flex flex-col gap-2 text-[13.5px]">
                <li><b>Saraighat Express</b> <span className="text-[#8a8578]">— Howrah → Guwahati (~18 hrs)</span></li>
                <li><b>Dibrugarh Rajdhani</b> <span className="text-[#8a8578]">— New Delhi → Dibrugarh (~37 hrs)</span></li>
                <li><b>Kanchanjunga Express</b> <span className="text-[#8a8578]">— Sealdah → Agartala (~37 hrs)</span></li>
              </ul>
            </motion.div>
            <motion.div custom={2} variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-6%" }} className="rounded-[20px] border border-ink/[0.09] bg-white p-[30px]">
              <div className="mb-2 flex items-baseline gap-3"><span className="font-mono text-xs text-clay">03</span><h3 className="font-display text-xl font-bold">By road — best for the experience</h3></div>
              <p className="mb-3 text-sm leading-relaxed text-[#5b5749]">Scenic state highways connect the major hubs. Popular routes:</p>
              <ul className="flex flex-col gap-2 text-[13.5px] text-[#5b5749]">
                <li>Guwahati → Shillong → Cherrapunjee (~153 km)</li>
                <li>Tezpur → Bomdila → Tawang (~328 km)</li>
                <li>Jorhat → Pasighat → Mechuka (~540 km)</li>
              </ul>
              <p className="mt-3 text-[12.5px] font-semibold text-clay">For remote spots like Ziro or Mawlynnong, we book local cabs in advance.</p>
            </motion.div>
          </div>
        </div>
      </Section>

      {/* cuisine */}
      <Section eyebrow="Food & flavour" title="What to eat.">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CUISINE.map(([state, dish, desc], i) => (
            <motion.div key={dish} custom={i % 4} variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-4%" }} className="rounded-[16px] border border-ink/[0.09] bg-white p-5">
              <p className="mb-2 font-mono text-[10.5px] uppercase tracking-[0.1em] text-clay">{state}</p>
              <h3 className="mb-1.5 font-display text-[17px] font-bold">{dish}</h3>
              <p className="text-[13px] leading-[1.5] text-mutedfg">{desc}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* cta */}
      <section className="mx-auto max-w-[1360px] px-6 pb-[110px] pt-20 lg:px-10">
        <motion.div variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-8%" }} className="relative h-[460px] overflow-hidden rounded-[28px]">
          <Image src="/images/hero-bg/pexels-vijit-bagh-3435480-5414576.jpg" alt="Northeast India" fill sizes="1360px" className="object-cover object-[center_40%]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,17,11,0.5),rgba(20,17,11,0.8))]" />
          <div className="absolute inset-0 flex flex-col items-center justify-center px-10 text-center text-paper">
            <p className="mb-[22px] font-mono text-xs uppercase tracking-[0.3em] text-[#E3B98A]">Ready when you are</p>
            <h2 className="max-w-[820px] font-display text-[clamp(34px,4.6vw,66px)] font-bold leading-[0.98] tracking-[-0.025em]">Ready to explore the Seven Sisters?</h2>
            <p className="mx-auto mb-8 mt-6 max-w-[560px] text-[17px] leading-relaxed text-paper/85">Tell SS Rao your dates and interests — we&apos;ll craft an itinerary built entirely around you. Your perfect trip is one message away.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href={WA_PLAN} target="_blank" rel="noopener noreferrer" className="inline-flex h-[58px] items-center rounded-full bg-clay px-[34px] text-base font-bold text-paper shadow-[0_18px_44px_-18px_rgba(155,106,76,0.95)] transition-[background,transform] duration-300 hover:-translate-y-0.5 hover:bg-clay-dark">Connect with an expert →</a>
              <Link href="/packages" className="inline-flex h-[58px] items-center rounded-full border border-paper/40 bg-paper/[0.12] px-7 text-base font-semibold text-paper backdrop-blur transition-colors hover:bg-paper/20">Browse all packages</Link>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}

function Section({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <section className="mx-auto max-w-[1360px] px-6 pb-10 pt-[70px] lg:px-10">
      <motion.div variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-8%" }} className="mb-10">
        <p className="mb-3.5 font-mono text-xs uppercase tracking-[0.3em] text-clay">{eyebrow}</p>
        <h2 className="font-display text-[clamp(30px,3.6vw,52px)] font-bold tracking-[-0.025em]">{title}</h2>
      </motion.div>
      {children}
    </section>
  );
}
