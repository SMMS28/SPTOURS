"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, type Variants } from "framer-motion";
import { WA_PLAN, wa } from "@/lib/site";
import { NeLiveStatus } from "@/components/ne-live-status";

const reveal: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.85, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] } }),
};

const STATES = [
  { name: "Sikkim", tagline: "Himalayan jewel", image: "/images/ne/sikkim-alpine.jpg", desc: "Rumtek Monastery, the shimmering Tsomgo Lake and the legendary Goechala trek — serenity meets alpine adventure." },
  { name: "Meghalaya", tagline: "Abode of clouds", image: "/images/amit-jain-FYGEA9aezAw-unsplash.jpg", desc: "Living root bridges, the glass-clear Dawki river and Mawlynnong — Asia's cleanest village — in a cloud-wrapped paradise." },
  { name: "Assam", tagline: "Gateway of the Northeast", image: "/images/ne/assam-tea.jpg", desc: "Emerald tea gardens, cruises on the mighty Brahmaputra and the one-horned rhino at Kaziranga — a UNESCO marvel." },
  { name: "Arunachal Pradesh", tagline: "Land of dawn-lit mountains", image: "/images/ne/arunachal-monastery.jpg", desc: "India's largest monastery at Tawang, the zen Ziro Valley and snowy Sela Pass — every kilometre a revelation." },
  { name: "Nagaland", tagline: "Land of festivals", image: "/images/nilotpal-kalita-IpRIguCAQes-unsplash.jpg", desc: "The legendary Hornbill Festival, the dramatic Dzükou Valley and the warm hospitality of the Naga tribes." },
  { name: "Manipur", tagline: "Jewel of India", image: "/images/ne/manipur-lake.jpg", desc: "The world's only floating national park at Loktak Lake, ancient polo grounds and a centuries-old dance heritage." },
  { name: "Mizoram", tagline: "Land of the highlanders", image: "/images/angshu-purkait-gtAbf_tsenY-unsplash.jpg", desc: "Bamboo-clad ridges, the Blue Mountain of Phawngpui and hill villages where every household sings." },
  { name: "Tripura", tagline: "Land of palaces", image: "/images/ne/tripura-highlands.jpg", desc: "The lake palace of Neermahal, the rock carvings of Unakoti and Ujjayanta's royal halls in Agartala." },
  { name: "Darjeeling", tagline: "Queen of the hills", image: "/images/northeast/gangtok-darjeeling-yak-ride-6d5n-1.jpg", desc: "The UNESCO-listed Himalayan Railway, golden tea estates and a Tiger Hill sunrise over Kangchenjunga." },
];

const STOPS = [
  { name: "Kaziranga National Park", image: "/images/chirag-saini-QrIUPFV_LZU-unsplash.jpg", state: "Assam", best: "Nov – Apr", permit: "At gates / online", act: "Jeep & elephant safari", desc: "Home of the endangered one-horned rhino; a UNESCO World Heritage site of grassland and swamp." },
  { name: "Tawang Monastery", image: "/images/mayur-more-odpi6Y7rGP4-unsplash.jpg", state: "Arunachal Pradesh", best: "Mar – Oct", permit: "ILP (online)", act: "Monastery, Sela Pass", desc: "India's largest monastery at 10,000 ft — birthplace of the 6th Dalai Lama, ringed by Himalayan peaks." },
  { name: "Tsomgo Lake & Nathula", image: "/images/amit-gupta-v4YWEXgAFok-unsplash.jpg", state: "Sikkim", best: "May – Oct", permit: "Via Gangtok agents", act: "Yak ride, Baba Mandir", desc: "A high-altitude glacial lake reflecting snow peaks, and the strategic Indo-Tibet border pass beyond it." },
  { name: "Nohkalikai Falls", image: "/images/ne/meghalaya-waterfall.jpg", state: "Meghalaya", best: "Oct – Mar", permit: "None · small fee", act: "Root-bridge day trip", desc: "India's tallest plunge waterfall — 335 m of misty, thundering grandeur near Cherrapunjee." },
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
  ["Assam", "Duck Curry", "Slow-cooked with ash gourd and crushed black pepper.", "/images/food/duck-curry.jpg"],
  ["Nagaland", "Smoked Pork", "Wood-smoked crisp outside, tender within, with steamed rice.", "/images/food/smoked-pork.jpg"],
  ["Sikkim", "Momo", "Juicy dumplings with a tangy tomato-chilli chutney.", "/images/food/momo.jpg"],
  ["Meghalaya", "Jadoh", "Fragrant pork rice stewed with Khasi spices.", "/images/food/jadoh.jpg"],
  ["Manipur", "Eromba", "Fiery mash of dried fish, bamboo shoots and greens.", "/images/food/eromba.jpg"],
  ["Arunachal", "Zan", "Thick millet porridge with savoury meat sides.", "/images/food/zan.jpg"],
  ["Mizoram", "Bai", "Slow stew of vegetables, bamboo and pork.", "/images/food/bai.jpg"],
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
    // Only auto-advance where the preview sits beside the list. On phones the
    // panel expands inline, so rotating it would move content under the reader.
    if (window.matchMedia("(min-width: 1024px)").matches) startAuto();
    return () => { if (swTimer.current) clearInterval(swTimer.current); };
  }, []);

  return (
    <div>
      {/* hero — editorial split on ivory */}
      <section className="relative flex min-h-screen items-center overflow-hidden bg-paper px-6 pb-14 pt-36 sm:pb-[70px] sm:pt-32 lg:px-10">
        <div className="pointer-events-none absolute -right-[6%] -top-[12%] h-[300px] w-[300px] rounded-full bg-[radial-gradient(circle,rgba(155,106,76,0.10),transparent_70%)] sm:h-[560px] sm:w-[560px]" />
        <div className="mx-auto grid w-full max-w-[1360px] items-center gap-[60px] lg:grid-cols-[1.02fr_1fr]">
          <div>
            <p className="mb-6 eyebrow">North East India · Since 1986</p>
            <h1 className="font-display text-[clamp(52px,6.4vw,104px)] font-bold leading-[0.9] tracking-[-0.03em] text-ink">
              The Seven<br />Sisters, <span className="font-medium italic text-clay">wild</span><br />&amp; unforgettable.
            </h1>
            <p className="mb-9 mt-7 max-w-[480px] text-[clamp(16px,1.3vw,19px)] leading-relaxed text-[#5b5749]">Eight states between the Himalayas, Bangladesh and Myanmar — from Assam&apos;s rhino grasslands to Meghalaya&apos;s cloud-hung root bridges. Run end to end by people who live it.</p>
            <div className="flex flex-wrap gap-4">
              <Link href="/packages" className="inline-flex h-14 items-center rounded-full bg-clay px-[30px] text-[15.5px] font-bold text-paper shadow-[0_18px_44px_-18px_rgba(155,106,76,0.9)] transition-[background,transform] duration-300 hover:-translate-y-0.5 hover:bg-clay-dark">Browse packages →</Link>
              <a href={WA_PLAN} target="_blank" rel="noopener noreferrer" className="inline-flex h-14 items-center rounded-full border-[1.5px] border-ink/20 px-7 text-[15.5px] font-semibold text-ink transition-colors duration-300 hover:border-ink hover:bg-ink hover:text-paper">Plan on WhatsApp</a>
            </div>
            <div className="mt-9 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-ink/12 pt-6 sm:mt-11 sm:flex sm:flex-wrap sm:gap-[34px] sm:pt-7">
              {[[8, "States", ""], [7, "Routes", ""], [19999, "From / person", "₹"], [null, "Since", ""]].map(([num, sub, pre]) => (
                <div key={sub as string}>
                  <p className="font-display text-[34px] font-bold text-ink">{num === null ? "1986" : <CountUp to={num as number} prefix={pre as string} />}</p>
                  <p className="mt-1.5 text-[11.5px] font-semibold uppercase tracking-[0.12em] text-[#8a8578]">{sub as string}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative h-[380px] sm:h-[600px]">
            <div className="absolute right-0 top-0 h-full w-[86%] overflow-hidden rounded-[22px] shadow-[0_50px_90px_-50px_rgba(20,17,11,0.6)] sm:w-[78%] sm:rounded-[28px]">
              <Image src="/images/hero-bg/pexels-parijb-3678501.jpg" alt="Women of the Northeast hills in traditional dress" fill sizes="600px" className="animate-kb object-cover" priority />
              <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(20,17,11,0.6)_0%,rgba(20,17,11,0)_45%)]" />
              {/* Right-aligned: the smaller framed image sits bottom-left and was
                  covering this caption on desktop. */}
              <div className="absolute bottom-[22px] right-[22px] text-right text-paper"><p className="mb-1 text-[11.5px] font-bold uppercase tracking-[0.16em] text-[#E3B98A]">The Northeast</p><p className="font-display text-[17px] font-semibold">Faces of the hills</p></div>
            </div>
            <div className="absolute bottom-6 left-0 h-[170px] w-[42%] overflow-hidden rounded-[16px] border-[4px] border-paper shadow-[0_34px_60px_-34px_rgba(20,17,11,0.55)] sm:bottom-10 sm:h-[300px] sm:w-[46%] sm:rounded-[22px] sm:border-[5px]">
              <Image src="/images/hero-bg/pexels-pallabi-dewri-791137-5496933.jpg" alt="Handmade crafts at a Northeast hill market" fill sizes="300px" className="object-cover" />
            </div>
            <div className="absolute left-0 top-3 flex h-[76px] w-[76px] flex-col items-center justify-center rounded-full bg-inkdeep text-center text-paper shadow-[0_20px_40px_-18px_rgba(20,17,11,0.6)] sm:left-2 sm:top-[26px] sm:h-[116px] sm:w-[116px]">
              <span className="font-display text-[24px] font-bold leading-none text-[#E3B98A] sm:text-[34px]">8</span>
              <span className="mt-1 text-[9px] font-bold uppercase leading-tight tracking-[0.18em] text-paper/75">Seven<br />Sisters</span>
            </div>
          </div>
        </div>
      </section>

      <NeLiveStatus />

      {/* intro */}
      <section className="mx-auto max-w-[1360px] px-6 pb-5 pt-[110px] lg:px-10">
        <motion.div variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-8%" }} className="grid items-end gap-14 md:grid-cols-2">
          <div>
            <p className="mb-4 eyebrow">The destination</p>
            <h2 className="font-display text-[clamp(34px,4.4vw,64px)] font-bold leading-[0.98] tracking-[-0.028em]">Where India&apos;s wildest land meets its richest cultures.</h2>
          </div>
          <p className="mb-1.5 text-[16.5px] leading-[1.7] text-[#5b5749]">The Northeast is India&apos;s best-kept secret — eight states tucked between the Himalayas, Bangladesh and Myanmar. Ancient tribal traditions coexist with rare ecosystems, living architecture grows from forest floors, and every winding road reveals a view more breathtaking than the last.</p>
        </motion.div>
      </section>

      {/* explore by state */}
      <section
        className="mx-auto max-w-[1360px] px-6 pb-10 pt-[70px] lg:px-10"
        onMouseEnter={() => { if (swTimer.current) { clearInterval(swTimer.current); swTimer.current = null; } }}
        onMouseLeave={() => startAuto()}
      >
        <motion.div variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true }} className="mb-8 flex items-end justify-between gap-8">
          <div>
            <p className="mb-3.5 eyebrow">Explore by state</p>
            <h2 className="font-display text-[clamp(30px,3.6vw,52px)] font-bold tracking-[-0.025em]">Eight states, one region.</h2>
          </div>
          <p className="mb-1.5 hidden font-mono text-xs text-[#8a8578] sm:block">hover a state to preview →</p>
        </motion.div>

        <div className="grid items-stretch gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="flex flex-col">
            {STATES.map((s, i) => {
              const on = i === active;
              return (
                <div key={s.name} className={`border-t border-ink/12 ${i === STATES.length - 1 ? "border-b" : ""}`}>
                  <button
                    type="button"
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    onClick={() => setActive(i)}
                    aria-expanded={on}
                    aria-controls={`state-panel-${i}`}
                    className={`flex min-h-[60px] w-full items-center justify-between gap-4 py-5 text-left transition-[padding] duration-300 ${on ? "pl-3.5" : "pl-1"}`}
                  >
                    <span className="flex items-baseline gap-4">
                      <span className="w-[26px] font-serif text-[15px] italic text-clay/70">{i + 1}</span>
                      <span className={`font-display text-[clamp(23px,2.3vw,33px)] font-bold tracking-[-0.02em] transition-colors ${on ? "text-clay" : "text-ink"}`}>{s.name}</span>
                    </span>
                    <span className={`text-xl text-clay transition-transform duration-300 lg:transition-all ${on ? "rotate-90 opacity-100 lg:translate-x-0 lg:rotate-0" : "opacity-40 lg:-translate-x-2 lg:opacity-0"}`}>→</span>
                  </button>

                  {/* On phones the preview belongs directly under the state you
                      tapped — it previously rendered in the column below, after
                      all nine rows, so a tap appeared to do nothing. */}
                  <div
                    id={`state-panel-${i}`}
                    className="grid transition-[grid-template-rows] duration-500 lg:hidden"
                    style={{ gridTemplateRows: on ? "1fr" : "0fr" }}
                  >
                    <div className="overflow-hidden">
                      <div className="relative mb-5 h-[300px] overflow-hidden rounded-[18px]">
                        <Image src={s.image} alt={s.name} fill sizes="100vw" className="object-cover" />
                        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(20,17,11,0.9)_6%,rgba(20,17,11,0.15)_60%,rgba(20,17,11,0)_100%)]" />
                        <div className="absolute inset-x-5 bottom-5 text-paper">
                          <p className="mb-2 text-[11.5px] font-bold uppercase tracking-[0.16em] text-[#E3B98A]">{s.tagline}</p>
                          <p className="mb-3 text-[14.5px] leading-relaxed text-paper/90">{s.desc}</p>
                          <Link href="/packages" className="inline-flex min-h-11 items-center rounded-full bg-clay px-5 text-[14px] font-bold text-paper">
                            View {s.name} packages →
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* desktop keeps the side-by-side preview */}
          <div className="relative hidden min-h-[540px] overflow-hidden rounded-[26px] shadow-[0_44px_90px_-52px_rgba(20,17,11,0.65)] lg:block">
            {STATES.map((s, i) => (
              <div key={s.name} className="absolute inset-0 transition-opacity duration-[800ms]" style={{ opacity: i === active ? 1 : 0 }}>
                <Image src={s.image} alt={s.name} fill sizes="700px" className="object-cover" />
              </div>
            ))}
            <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(20,17,11,0.9)_6%,rgba(20,17,11,0.15)_55%,rgba(20,17,11,0)_100%)]" />
            <div className="absolute inset-x-[34px] bottom-[34px] text-paper">
              <p className="mb-2.5 text-[11.5px] font-bold uppercase tracking-[0.16em] text-[#E3B98A]">{STATES[active].tagline}</p>
              <h3 className="mb-3.5 font-display text-[clamp(30px,3vw,44px)] font-bold tracking-[-0.02em]">{STATES[active].name}</h3>
              <p className="mb-[22px] max-w-[440px] text-[15px] leading-relaxed text-paper/85">{STATES[active].desc}</p>
              <Link href="/packages" className="inline-flex h-[50px] items-center gap-2.5 rounded-full bg-clay px-[26px] text-[14.5px] font-bold text-paper transition-[background,transform] duration-300 hover:-translate-y-0.5 hover:bg-clay-dark">View {STATES[active].name} packages →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* iconic stops */}
      <Section eyebrow="Must-visit places" title="Landmarks worth the detour.">
        <div className="grid gap-5 md:grid-cols-2">
          {STOPS.map((stop, i) => (
            <motion.div
              key={stop.name}
              custom={i % 2}
              variants={reveal}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-6%" }}
              className="group overflow-hidden rounded-[20px] border border-ink/[0.09] bg-white"
            >
              <div className="relative h-[210px] overflow-hidden sm:h-[260px]">
                <Image
                  src={stop.image}
                  alt={stop.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 660px"
                  className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
                />
                <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(20,17,11,0.82)_4%,rgba(20,17,11,0.1)_54%,rgba(20,17,11,0)_86%)]" />
                <div className="absolute inset-x-[22px] bottom-[18px] flex items-end justify-between gap-3 text-paper">
                  <div>
                    <p className="mb-1.5 text-[12px] font-bold uppercase tracking-[0.16em] text-[#E3B98A]">{stop.state}</p>
                    <h3 className="font-display text-[23px] font-bold leading-tight sm:text-[26px]">{stop.name}</h3>
                  </div>
                  <span className="whitespace-nowrap rounded-full bg-paper/15 px-3 py-[5px] text-[11.5px] font-semibold backdrop-blur-sm">
                    {stop.best}
                  </span>
                </div>
              </div>
              <div className="p-[26px]">
                <p className="mb-4 text-sm leading-relaxed text-[#5b5749]">{stop.desc}</p>
                <div className="flex gap-6 border-t border-ink/[0.08] pt-3.5">
                  <div>
                    <p className="mb-1 text-[11.5px] font-semibold uppercase tracking-[0.08em] text-[#a49d8c]">Permit</p>
                    <p className="text-[13px] font-semibold">{stop.permit}</p>
                  </div>
                  <div>
                    <p className="mb-1 text-[11.5px] font-semibold uppercase tracking-[0.08em] text-[#a49d8c]">Do</p>
                    <p className="text-[13px] font-semibold">{stop.act}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* when to visit — dark band, so the calendar reads as a distinct chapter */}
      <section className="relative mt-24 overflow-hidden bg-inkdeep px-6 py-[88px] text-paper sm:py-[104px] lg:px-10">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-[0.14]"
          style={{ backgroundImage: "url('/images/ne/nagaland-forest.jpg')" }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#14110B_0%,rgba(20,17,11,0.86)_50%,#14110B_100%)]" />
        <div className="relative z-[2] mx-auto max-w-[1360px]">
          <motion.div
            variants={reveal}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-8%" }}
            className="mb-10 flex flex-wrap items-end justify-between gap-6"
          >
            <div>
              <p className="mb-3.5 eyebrow eyebrow-paper">Travel calendar</p>
              <h2 className="font-display text-[clamp(30px,3.8vw,56px)] font-bold tracking-[-0.028em]">When to go.</h2>
            </div>
            <p className="mb-1.5 max-w-[320px] text-[14.5px] leading-relaxed text-paper/60">
              Every window has something the others don&apos;t. Tell us what you want to see and we&apos;ll
              pick the month for you.
            </p>
          </motion.div>

          <div className="grid gap-5 lg:grid-cols-3">
            {SEASONS.map((season, i) => (
              <motion.div
                key={season.period}
                custom={i}
                variants={reveal}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-6%" }}
                className={`rounded-[20px] border p-[26px] transition-colors duration-500 sm:p-[30px] ${
                  season.peak
                    ? "border-clay-tint/35 bg-clay/[0.14]"
                    : "border-paper/12 bg-paper/[0.04] hover:border-paper/25"
                }`}
              >
                <div className="mb-1.5 flex items-center justify-between gap-3">
                  <span className="font-display text-[26px] font-bold">{season.period}</span>
                  <span
                    className={`rounded-full px-3 py-[5px] text-[11.5px] font-bold ${
                      season.peak ? "bg-clay text-paper" : "bg-paper/12 text-paper/80"
                    }`}
                  >
                    {season.badge}
                  </span>
                </div>
                <p className="mb-4 font-mono text-xs text-paper/50">Avg {season.temp}</p>
                <h3 className="mb-3.5 font-display text-base font-bold">{season.head}</h3>
                <ul className="flex flex-col gap-2.5">
                  {season.pts.map((pt) => (
                    <li key={pt} className="flex gap-2.5 text-[13.5px] text-paper/70">
                      <span className="mt-[7px] h-[5px] w-[5px] shrink-0 rounded-full bg-clay-tint" />
                      {pt}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* things to do */}
      <Section eyebrow="Experiences" title="Unforgettable things to do.">
        <div className="grid gap-[18px] sm:grid-cols-2 lg:grid-cols-4">
          {ACTIVITIES.map(([t, d], i) => (
            <motion.div key={t} custom={i % 4} variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-4%" }} className="rounded-[18px] border border-ink/[0.09] bg-white p-6 transition-[transform,box-shadow] duration-200 ease-out hover:-translate-y-1.5 hover:shadow-[0_24px_48px_-34px_rgba(20,17,11,0.4)]">
              <span className="mb-3.5 block h-px w-8 bg-clay/45" />
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
            <div className="mb-2 flex items-baseline gap-3"><h3 className="font-display text-xl font-bold">By air — fastest</h3></div>
            <p className="mb-[18px] text-sm leading-relaxed text-paper/70">Direct flights from Delhi, Mumbai, Kolkata &amp; Bangalore; international via Bangkok, Singapore &amp; Paro.</p>
            <div className="flex flex-col gap-2">
              {AIRPORTS.map(([c, n]) => (
                <div key={c} className="flex justify-between gap-3 rounded-xl border border-paper/12 bg-paper/[0.07] px-4 py-3"><span className="text-sm font-semibold">{c}</span><span className="text-[12.5px] text-paper/60">{n}</span></div>
              ))}
            </div>
          </motion.div>
          <div className="flex flex-col gap-5">
            <motion.div custom={1} variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-6%" }} className="rounded-[20px] border border-ink/[0.09] bg-white p-[30px]">
              <div className="mb-2 flex items-baseline gap-3"><h3 className="font-display text-xl font-bold">By train — scenic &amp; budget</h3></div>
              <p className="mb-3 text-sm leading-relaxed text-[#5b5749]">Major railheads at Guwahati, New Jalpaiguri, Dimapur, Dibrugarh &amp; Agartala.</p>
              <ul className="flex flex-col gap-2 text-[13.5px]">
                <li><b>Saraighat Express</b> <span className="text-[#8a8578]">— Howrah → Guwahati (~18 hrs)</span></li>
                <li><b>Dibrugarh Rajdhani</b> <span className="text-[#8a8578]">— New Delhi → Dibrugarh (~37 hrs)</span></li>
                <li><b>Kanchanjunga Express</b> <span className="text-[#8a8578]">— Sealdah → Agartala (~37 hrs)</span></li>
              </ul>
            </motion.div>
            <motion.div custom={2} variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-6%" }} className="rounded-[20px] border border-ink/[0.09] bg-white p-[30px]">
              <div className="mb-2 flex items-baseline gap-3"><h3 className="font-display text-xl font-bold">By road — best for the experience</h3></div>
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

      {/* cuisine — full-bleed plates, the reason the food images exist */}
      <section className="mt-24 bg-[#F0E9DA] px-6 py-[84px] sm:py-[100px] lg:px-10">
        <div className="mx-auto max-w-[1180px]">
          <motion.div
            variants={reveal}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-8%" }}
            className="mb-11 flex flex-wrap items-end justify-between gap-[30px]"
          >
            <div>
              <p className="mb-3.5 eyebrow">Food &amp; flavour</p>
              <h2 className="font-display text-[clamp(30px,3.8vw,56px)] font-bold tracking-[-0.028em]">What to eat.</h2>
            </div>
            <p className="mb-2 max-w-[300px] text-[14.5px] leading-relaxed text-[#6B6252]">
              Regional plates we&apos;d cross a state for — and a trail to taste them all.
            </p>
          </motion.div>

          <div className="grid gap-[18px] sm:grid-cols-2 lg:grid-cols-4">
            {CUISINE.map(([state, dish, desc, img], i) => (
              <motion.div
                key={dish}
                custom={i % 4}
                variants={reveal}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-4%" }}
                className="group relative h-[260px] overflow-hidden rounded-[18px] shadow-[0_26px_54px_-42px_rgba(20,17,11,0.5)] sm:h-[300px]"
              >
                <Image
                  src={img}
                  alt={dish}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 280px"
                  className="object-cover transition-transform duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.07]"
                />
                <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(20,17,11,0.9)_6%,rgba(20,17,11,0.14)_52%,rgba(20,17,11,0)_82%)]" />
                <div className="absolute inset-x-5 bottom-[18px] text-paper">
                  <p className="mb-1.5 text-[11.5px] font-bold uppercase tracking-[0.16em] text-[#E3B98A]">{state}</p>
                  <h3 className="mb-1.5 font-display text-[21px] font-bold">{dish}</h3>
                  <p className="text-[12.5px] leading-[1.5] text-paper/[0.82]">{desc}</p>
                </div>
              </motion.div>
            ))}

            <motion.a
              href={wa("Hi SP Tours, I'd love a Northeast food trail.")}
              target="_blank"
              rel="noopener noreferrer"
              custom={3}
              variants={reveal}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-4%" }}
              className="flex h-[260px] flex-col justify-between rounded-[18px] bg-clay p-6 text-paper shadow-[0_26px_54px_-42px_rgba(155,106,76,0.7)] transition-colors duration-300 hover:bg-clay-dark sm:h-[300px]"
            >
              <p className="text-[11.5px] font-bold uppercase tracking-[0.16em] text-paper/[0.82]">
                A taste of all eight states
              </p>
              <div>
                <h3 className="mb-2.5 font-display text-[25px] font-bold leading-[1.05] tracking-[-0.02em]">
                  Plan a food trail
                </h3>
                <span className="inline-flex items-center gap-2 text-[13.5px] font-semibold">
                  WhatsApp SS Rao <span className="text-[15px]">→</span>
                </span>
              </div>
            </motion.a>
          </div>
        </div>
      </section>

      {/* cta */}
      <section className="mx-auto max-w-[1360px] px-6 pb-[110px] pt-20 lg:px-10">
        <motion.div variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-8%" }} className="relative h-[420px] overflow-hidden rounded-[20px] sm:h-[460px] sm:rounded-[28px]">
          <Image src="/images/nvr-endng-anupam-EUwzrxkJAAY-unsplash.jpg" alt="Suspension bridge over the Northeast forest canopy" fill sizes="1360px" className="object-cover object-[center_45%]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,17,11,0.5),rgba(20,17,11,0.8))]" />
          <div className="absolute inset-0 flex flex-col items-center justify-center px-10 text-center text-paper">
            <p className="mb-[22px] eyebrow eyebrow-paper">Ready when you are</p>
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
        <p className="mb-3.5 eyebrow">{eyebrow}</p>
        <h2 className="font-display text-[clamp(30px,3.6vw,52px)] font-bold tracking-[-0.025em]">{title}</h2>
      </motion.div>
      {children}
    </section>
  );
}
