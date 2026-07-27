"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform, type Variants } from "framer-motion";
import { HERO_SLIDES, WA_ENQUIRE, WA_PLAN, PHONE_TEL, EMAIL } from "@/lib/site";
import { CountUp } from "@/components/count-up";
import { FileCheck2, BedDouble, MapPin, MessageSquare } from "lucide-react";
import { bentoSpan, type PackageView } from "@/lib/packages-view";

/** Literal class names so Tailwind's JIT generates them. */
const BENTO_SPAN: Record<number, string> = {
  3: "lg:col-span-3",
  4: "lg:col-span-4",
  5: "lg:col-span-5",
};

/** Why-us proof points. Four decades of operating detail, not slogans. */
const PROMISE_STATS: { to: number; suffix?: string; label: string }[] = [
  { to: 40, label: "Years on the road" },
  { to: 8, label: "Northeast states" },
  { to: 200, suffix: "+", label: "Routes we've mapped" },
  { to: 100, suffix: "%", label: "Permits handled" },
];

const PROMISE_REASONS: { Icon: typeof FileCheck2; title: string; body: string }[] = [
  {
    Icon: FileCheck2,
    title: "Permits, sorted",
    body: "Inner Line Permits and protected-area passes filed and confirmed before you land — never your problem.",
  },
  {
    Icon: BedDouble,
    title: "Stays we've slept in",
    body: "Homestays, heritage lodges and high-altitude camps — personally vetted on every route we run.",
  },
  {
    Icon: MapPin,
    title: "Drivers from the hills",
    body: "Local specialists who read the weather, the roads and the seasons better than any map could.",
  },
  {
    Icon: MessageSquare,
    title: "One WhatsApp thread",
    body: "SS Rao's team from first question to safe return home. No call centres, no handoffs, no scripts.",
  },
];

const reveal: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};

export function HomeExperience({
  packages,
  signedIn,
}: {
  packages: PackageView[];
  signedIn: boolean;
}) {
  const [slide, setSlide] = useState(0);
  const promiseRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({ target: promiseRef, offset: ["start end", "end start"] });
  const parallaxY = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);

  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % HERO_SLIDES.length), 5000);
    return () => clearInterval(t);
  }, []);

  const featured = packages[0];
  const rest = packages.slice(1, 7);

  return (
    <div>
      {/* ===================== HERO ===================== */}
      <section className="relative h-screen min-h-[700px] overflow-hidden bg-inkdeep">
        <div className="absolute inset-0">
          {HERO_SLIDES.map((s, i) => (
            <div
              key={s.src}
              className={`absolute inset-0 bg-cover bg-center transition-opacity duration-[1600ms] ${s.anim} ${i === slide ? "opacity-100" : "opacity-0"}`}
              style={{ backgroundImage: `url('${s.src}')` }}
            />
          ))}
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(101deg,rgba(20,17,11,0.82)_0%,rgba(20,17,11,0.44)_42%,rgba(20,17,11,0.1)_72%,rgba(20,17,11,0)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(20,17,11,0.74)_0%,rgba(20,17,11,0)_42%)]" />

        <div className="absolute inset-x-0 bottom-[12vh] z-[3]">
          <div className="mx-auto flex max-w-[1360px] items-end justify-between gap-10 px-6 lg:px-10">
            <motion.div
              initial="hidden"
              animate="show"
              variants={{ show: { transition: { staggerChildren: 0.14 } } }}
              className="max-w-[780px]"
            >
              <motion.p variants={reveal} className="mb-6 eyebrow eyebrow-paper">
                SP Tours &amp; Travels · Since 1986
              </motion.p>
              <motion.h1 variants={reveal} className="font-display text-[clamp(48px,7.4vw,108px)] font-bold leading-[0.94] tracking-[-0.025em] text-paper">
                Go where India<br />breathes <span className="font-medium italic">deepest.</span>
              </motion.h1>
              <motion.p variants={reveal} className="mb-9 mt-7 max-w-[560px] text-[clamp(16px,1.4vw,20px)] leading-relaxed text-paper/90">
                Handcrafted tours across the Seven Sisters — Assam, Meghalaya, Sikkim, Arunachal and beyond. Real routes, real places, handled end to end.
              </motion.p>
              <motion.div variants={reveal} className="flex flex-wrap gap-4">
                <Link href="/packages" className="inline-flex h-[58px] items-center rounded-full bg-clay px-8 text-base font-bold text-paper shadow-[0_18px_44px_-18px_rgba(155,106,76,0.9)] transition-[background,transform] duration-300 hover:-translate-y-0.5 hover:bg-clay-dark">
                  Explore packages →
                </Link>
                <a href={WA_ENQUIRE} target="_blank" rel="noopener noreferrer" className="inline-flex h-[58px] items-center rounded-full border border-paper/45 bg-paper/10 px-7 text-base font-semibold text-paper backdrop-blur transition-colors duration-300 hover:bg-paper/20">
                  Chat on WhatsApp
                </a>
              </motion.div>
            </motion.div>

            <div className="hidden shrink-0 pb-1.5 text-right lg:block">
              <div className="relative h-[60px] w-[260px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={slide}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.6 }}
                  >
                    <p className="mb-1.5 eyebrow eyebrow-paper">Now showing</p>
                    <p className="font-display text-[22px] font-semibold text-paper">{HERO_SLIDES[slide].caption}</p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== JOURNEYS (bento) ===================== */}
      {featured ? (
      <section id="packages" className="mx-auto max-w-[1360px] px-6 pb-10 pt-[118px] lg:px-10">
        <motion.div
          variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-10%" }}
          className="mb-[50px] flex flex-wrap items-end justify-between gap-12"
        >
          <div>
            <p className="mb-4 eyebrow">Our journeys</p>
            <h2 className="max-w-[760px] font-display text-[clamp(38px,4.8vw,72px)] font-bold leading-[0.96] tracking-[-0.028em]">
              Seven ways into<br />the wild east.
            </h2>
          </div>
          <p className="mb-2 max-w-[340px] text-[15.5px] leading-relaxed text-mutedfg">
            Fixed departures or fully custom — real routes we&apos;ve walked ourselves. Hover a trip to look closer.
          </p>
        </motion.div>

        {/* featured */}
        <motion.div variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-8%" }} className="mb-6">
          <Link href={`/packages/${featured.slug}`} className="group relative block h-[420px] overflow-hidden rounded-[20px] sm:h-[560px] sm:rounded-[26px]">
            <Image src={featured.image} alt={featured.title} fill sizes="1360px" className="object-cover transition-transform duration-[1000ms] group-hover:scale-105" />
            <div className="absolute inset-0 bg-[linear-gradient(100deg,rgba(20,17,11,0.88)_0%,rgba(20,17,11,0.52)_40%,rgba(20,17,11,0.08)_78%,rgba(20,17,11,0)_100%)]" />
            <span className="absolute left-6 top-6 rounded-full bg-paper px-4 py-2 text-[11.5px] font-bold uppercase tracking-wider text-inkdeep">{[featured.tag, featured.duration].filter(Boolean).join(" · ")}</span>
            <div className="absolute inset-x-5 bottom-7 max-w-[620px] text-paper sm:inset-x-[46px] sm:bottom-11">
              <p className="mb-4 text-[11.5px] font-bold uppercase tracking-[0.16em] text-clay-tint">{featured.region} · Guwahati start</p>
              <h3 className="mb-[18px] font-display text-[clamp(34px,3.6vw,50px)] font-bold leading-none tracking-[-0.02em]">{featured.title}</h3>
              <p className="mb-7 max-w-[480px] text-base leading-relaxed text-paper/85">{featured.blurb}</p>
              <div className="flex flex-wrap items-center justify-between gap-4 sm:gap-6">
                <div className="flex items-baseline gap-2">
                  {featured.hasPrice ? <span className="font-mono text-[13px] text-paper/60">from</span> : null}
                  <span className="font-display text-[30px] font-bold sm:text-[40px]">{featured.priceLabel}</span>
                  {featured.hasPrice ? <span className="text-sm text-paper/60">/ person</span> : null}
                </div>
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-clay text-[20px] sm:h-[60px] sm:w-[60px] sm:text-[22px] shadow-[0_14px_34px_-14px_rgba(155,106,76,0.9)] transition-transform duration-300 group-hover:scale-110">→</span>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* bento grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-12">
          {rest.map((p, i) => (
            <motion.div
              key={p.slug}
              variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-6%" }}
              // Tailwind class rather than an inline style: inline styles can't be
              // media-queried, so the 12-column spans applied on phones too and
              // squeezed each card to ~100px. Literal strings so JIT emits them.
              className={BENTO_SPAN[bentoSpan(i)]}
            >
              <Link href={`/packages/${p.slug}`} className="group relative block h-[340px] overflow-hidden rounded-[18px] transition-[transform,box-shadow] duration-200 ease-out hover:-translate-y-2 hover:shadow-[0_34px_62px_-42px_rgba(20,17,11,0.6)] sm:h-[440px] sm:rounded-[22px]">
                <Image src={p.image} alt={p.title} fill sizes="(max-width:900px) 100vw, 45vw" className="object-cover transition-transform duration-[900ms] group-hover:scale-[1.07]" />
                <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(20,17,11,0.92)_6%,rgba(20,17,11,0.18)_56%,rgba(20,17,11,0.02)_100%)]" />
                {p.tag ? <span className="absolute left-4 top-4 rounded-full bg-paper/95 px-3 py-1.5 text-[11.5px] font-bold uppercase tracking-wider text-inkdeep">{p.tag}</span> : null}
                
                <div className="absolute inset-x-6 bottom-6 text-paper">
                  <p className="mb-2 text-[11.5px] font-bold uppercase tracking-[0.12em] text-clay-tint">{p.region} · {p.duration}</p>
                  <h4 className="mb-3.5 font-display text-[25px] font-bold leading-[1.06] tracking-[-0.01em]">{p.title}</h4>
                  <div className="flex items-center justify-between">
                    <span className="font-display text-[22px] font-bold">{p.priceLabel}</span>
                    <span className="grid h-[42px] w-[42px] place-items-center rounded-full border border-paper/35 bg-paper/15 text-[17px] transition-[background,transform] duration-300 group-hover:translate-x-1 group-hover:bg-clay">→</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true }} className="mt-[54px] text-center">
          <Link href="/packages" className="inline-flex h-14 items-center rounded-full border-[1.5px] border-ink px-9 text-[15px] font-bold transition-colors duration-300 hover:bg-ink hover:text-paper">
            See all tours &amp; fixed departures →
          </Link>
        </motion.div>
      </section>
      ) : null}

      {/* ===================== PROMISE / WHY US ===================== */}
      <section ref={promiseRef} id="promise" className="relative mt-[90px] overflow-hidden bg-inkdeep px-6 pb-[92px] pt-[104px] sm:pb-[118px] sm:pt-[132px] lg:px-10">
        <motion.div style={{ y: parallaxY }} className="absolute inset-x-0 -inset-y-[14%]">
          <div
            className="h-full w-full bg-cover bg-[center_20%]"
            style={{ backgroundImage: "url('/images/ne/mountain-horizons.jpg')" }}
          />
        </motion.div>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,17,11,0.5)_0%,rgba(20,17,11,0.8)_28%,#14110B_46%,#14110B_100%)]" />
        {/* Warm bloom behind the headline, so the band reads lit rather than flat. */}
        <div className="pointer-events-none absolute -top-[6%] left-1/2 h-[520px] w-[940px] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,rgba(155,106,76,0.2),rgba(155,106,76,0)_68%)]" />

        <div className="relative z-[2] mx-auto max-w-[1360px]">
          <div className="mb-12 grid items-end gap-10 sm:mb-[66px] lg:grid-cols-[1.12fr_0.88fr] lg:gap-16">
            <div>
              <motion.p
                variants={reveal}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="mb-6 eyebrow eyebrow-paper sm:mb-[26px]"
              >
                Why SP Tours · Since 1986
              </motion.p>
              <motion.h2
                variants={reveal}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                transition={{ delay: 0.08 }}
                className="font-display text-[clamp(36px,5vw,74px)] font-bold leading-[0.98] tracking-[-0.028em] text-paper"
              >
                Your journey,
                <br />
                our responsibility.
              </motion.h2>
            </div>

            <motion.div
              variants={reveal}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              transition={{ delay: 0.14 }}
            >
              <p className="mb-6 text-[16.5px] leading-[1.66] text-paper/80 sm:text-lg">
                Four decades of running the Northeast — permits, stays, drivers, timing. We&apos;ve walked
                every route we sell, so you travel light and worry about nothing.
              </p>
              <a
                href={WA_PLAN}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-2.5 border-b-[1.5px] border-clay-tint/50 pb-1 font-display text-base font-bold text-paper transition-colors duration-300 hover:border-clay-tint hover:text-clay-tint"
              >
                Plan your trip with SS&nbsp;Rao <span className="text-[17px]">→</span>
              </a>
            </motion.div>
          </div>

          <motion.div
            variants={reveal}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mb-12 grid grid-cols-2 gap-7 border-y border-paper/15 py-9 sm:mb-[72px] sm:py-11 lg:grid-cols-4 lg:gap-[30px]"
          >
            {PROMISE_STATS.map(({ to, suffix, label }) => (
              <div key={label}>
                <p className="font-display text-[clamp(38px,4.2vw,66px)] font-bold leading-none tracking-[-0.02em] text-paper">
                  <CountUp to={to} />
                  {suffix ? <span className="text-clay">{suffix}</span> : null}
                </p>
                <p className="mt-3 text-[13px] font-semibold text-paper/55 sm:mt-3.5">{label}</p>
              </div>
            ))}
          </motion.div>

          <div className="grid gap-[18px] sm:grid-cols-2 lg:grid-cols-4 lg:gap-[22px]">
            {PROMISE_REASONS.map(({ Icon, title, body }, i) => (
              <motion.div
                key={title}
                variants={reveal}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-6%" }}
                transition={{ delay: i * 0.09 }}
                className="group relative rounded-[20px] border border-paper/10 bg-paper/[0.035] p-7 transition-[transform,border-color,background] duration-200 ease-out hover:-translate-y-1.5 hover:border-clay-tint/35 hover:bg-paper/[0.06] sm:p-[30px]"
              >
                <span className="mb-6 inline-flex h-[52px] w-[52px] items-center justify-center rounded-[13px] bg-clay/[0.16] sm:mb-[26px]">
                  <Icon className="h-[25px] w-[25px] text-clay-tint" strokeWidth={1.5} />
                </span>
                <h3 className="mb-3 font-display text-[21px] font-bold leading-[1.15] text-paper">{title}</h3>
                <p className="text-[14.5px] leading-[1.62] text-paper/[0.66]">{body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== CONTACT ===================== */}
      <section id="contact" className="mx-auto max-w-[1360px] px-6 py-[110px] lg:px-10">
        <motion.div variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-8%" }} className="relative overflow-hidden rounded-[20px] bg-inkdeep px-6 py-12 text-paper sm:rounded-[28px] sm:px-16 sm:py-[70px]">
          <div className="animate-spin-slow absolute -right-[70px] -top-[90px] h-[200px] w-[200px] rounded-full border border-clay-tint/20 sm:h-[340px] sm:w-[340px]" />
          <div className="relative flex flex-col items-stretch gap-9 lg:flex-row lg:items-end lg:justify-between lg:gap-11">
            <div className="max-w-[620px]">
              <p className="mb-[22px] eyebrow eyebrow-paper">Let&apos;s plan yours</p>
              <h2 className="mb-6 font-display text-[clamp(36px,4.8vw,64px)] font-bold leading-[0.98] tracking-[-0.025em]">Tell us your dates. We&apos;ll shape the trip.</h2>
              <p className="text-[17px] leading-relaxed text-paper/80">One message on WhatsApp and SS Rao&apos;s team takes it from there — honest advice, no pushy sales, from people who&apos;ve run the Northeast for nearly forty years.</p>
            </div>
            <div className="flex w-full flex-col gap-3 sm:min-w-[330px] sm:gap-3.5">
              <a href={WA_ENQUIRE} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between gap-3 rounded-[14px] bg-clay px-4 py-4 sm:gap-5 sm:px-[22px] sm:py-[18px] transition-[background,transform] duration-300 hover:-translate-y-0.5 hover:bg-clay-dark">
                <span className="min-w-0"><span className="block text-[11.5px] font-semibold uppercase tracking-[0.12em] text-paper/80">Fastest reply</span><span className="block font-display text-[17px] font-bold sm:text-xl">Enquire on WhatsApp</span></span>
                <span className="shrink-0 text-xl">→</span>
              </a>
              <a
                href={signedIn ? `tel:${PHONE_TEL}` : "/login?next=%2Fcontact"}
                className="flex items-center justify-between gap-3 rounded-[14px] border border-paper/25 bg-paper/10 px-4 py-4 sm:gap-5 sm:px-[22px] sm:py-[18px] transition-colors hover:bg-paper/20"
              >
                <span className="min-w-0">
                  <span className="block text-[11.5px] font-semibold uppercase tracking-[0.12em] text-paper/70">
                    {signedIn ? "Tap to dial" : "Members only"}
                  </span>
                  <span className="block font-display text-[17px] font-bold sm:text-xl">
                    {signedIn ? "Call SS Rao" : "Sign in to call"}
                  </span>
                </span>
                <span className="shrink-0 text-xl">→</span>
              </a>
              <a href={`mailto:${EMAIL}`} className="flex items-center justify-between gap-3 rounded-[14px] bg-paper px-4 py-4 text-ink sm:gap-5 sm:px-[22px] sm:py-[18px] transition-transform hover:-translate-y-0.5">
                <span className="min-w-0"><span className="block text-[11.5px] font-semibold uppercase tracking-[0.12em] text-ink/55">Email us</span><span className="block break-all font-display text-[15px] font-bold sm:text-lg">{EMAIL}</span></span>
                <span className="shrink-0 text-xl">→</span>
              </a>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
