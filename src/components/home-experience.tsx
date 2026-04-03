"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { MouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";

import { MarqueeHighlights } from "@/components/marquee-highlights";
import { NeMap } from "@/components/ne-map";
import { PackageCompareSheet } from "@/components/package-compare-sheet";
import { prioritizeMostVisitedNortheast } from "@/lib/data/northeast-package-catalog";
import type { TravelPackage } from "@/lib/types";

type GroupedPackages = {
  key: string;
  title: string;
  sourceCategory: string;
  packages: TravelPackage[];
};

type HomeExperienceProps = {
  packages: TravelPackage[];
  grouped: GroupedPackages[];
};

const reveal = {
  hidden: { opacity: 0, y: 24, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6 },
  },
};

const northeastStates = [
  "Assam",
  "Meghalaya",
  "Arunachal Pradesh",
  "Nagaland",
  "Sikkim",
  "Manipur",
  "Mizoram",
  "Tripura",
] as const;

const statePatterns: Record<(typeof northeastStates)[number], RegExp> = {
  Assam: /assam|guwahati|kaziranga|majuli|manas/i,
  Meghalaya: /meghalaya|shillong|cherrapunji|sohra|dawki|mawlynnong/i,
  "Arunachal Pradesh": /arunachal|tawang|ziro|bomdila|dirang/i,
  Nagaland: /nagaland|kohima|dz[uü]kou|mokokchung/i,
  Sikkim: /sikkim|gangtok|lachung|pelling|tsomgo/i,
  Manipur: /manipur|imphal|loktak/i,
  Mizoram: /mizoram|aizawl/i,
  Tripura: /tripura|agartala|ujjayanta/i,
};

const bestSeasonByState: Record<(typeof northeastStates)[number], string> = {
  Assam: "Oct – Apr",
  Meghalaya: "Sep – May",
  "Arunachal Pradesh": "Oct – Apr",
  Nagaland: "Oct – Feb",
  Sikkim: "Mar – Jun",
  Manipur: "Oct – Mar",
  Mizoram: "Oct – Mar",
  Tripura: "Oct – Mar",
};

const stories = [
  {
    title: "48 Hours in Shillong",
    steps: [
      "Land in Guwahati and drive through pine-lined roads to Shillong.",
      "Sunset at Umiam Lake, then café-hopping in Police Bazaar.",
      "Dawn detour to Laitlum and curated local music evening.",
    ],
  },
  {
    title: "Kaziranga Dawn Safari",
    steps: [
      "Check-in near Kohora with a naturalist briefing.",
      "Start at first light for one-horned rhino sightings.",
      "Wrap with Brahmaputra-side brunch and onward transfer.",
    ],
  },
];

const testimonials = [
  {
    name: "Rhea & Harsh",
    quote: "The Meghalaya circuit felt cinematic — every transfer, stay, and activity was timed perfectly.",
  },
  {
    name: "Nitin K.",
    quote: "Kaziranga and Majuli in one seamless itinerary. Premium stays, zero travel stress.",
  },
  {
    name: "Ananya S.",
    quote: "The planner adapted our Arunachal route in real-time for weather and still kept it magical.",
  },
];

const cultureSlides = [
  {
    src: "/images/hero-bg/pexels-kosyginl-2888802.jpg",
    label: "North East India • Mountain Horizons",
    objectPosition: "center 50%",
  },
  {
    src: "/images/hero-bg/pexels-chunry-6538013.jpg",
    label: "Sikkim • Alpine Escape",
    objectPosition: "center 48%",
  },
  {
    src: "/images/hero-bg/pexels-parijb-3678501.jpg",
    label: "Meghalaya • Waterfall Valleys",
    objectPosition: "center 46%",
  },
  {
    src: "/images/hero-bg/pexels-pallabi-dewri-791137-5496933.jpg",
    label: "Arunachal • Monastery Routes",
    objectPosition: "center 45%",
  },
  {
    src: "/images/hero-bg/nilotpal-kalita-24vPDG707eM-unsplash.jpg",
    label: "Assam • Tea Garden Trails",
    objectPosition: "center 42%",
  },
  {
    src: "/images/hero-bg/pexels-vijit-bagh-3435480-5414576.jpg",
    label: "Nagaland • Cloud Forest Views",
    objectPosition: "center 48%",
  },
  {
    src: "/images/hero-bg/pexels-xperimental-1043292.jpg",
    label: "Tripura • Green Highlands",
    objectPosition: "center 50%",
  },
  {
    src: "/images/hero-bg/pexels-logalongwithme-6058267.jpg",
    label: "Manipur • Lakefront Mornings",
    objectPosition: "center 47%",
  },
] as const;

const getDurationSummary = (durationDays?: number | null, rawDuration?: string | null) => {
  const normalizedDays = Number.isFinite(durationDays) ? Number(durationDays) : 0;

  if (normalizedDays > 0) {
    const nights = Math.max(normalizedDays - 1, 0);
    return `${normalizedDays} Days${nights > 0 ? ` / ${nights} Nights` : ""}`;
  }

  if (rawDuration?.trim()) {
    return rawDuration.trim();
  }

  return "Duration on request";
};

const detectState = (travelPackage: TravelPackage) => {
  const haystack = `${travelPackage.title} ${travelPackage.destination} ${travelPackage.location} ${travelPackage.short_description}`;
  return northeastStates.find((state) => statePatterns[state].test(haystack)) ?? "Assam";
};

export function HomeExperience({ packages, grouped }: HomeExperienceProps) {
  const heroRef = useRef<HTMLElement | null>(null);
  const packageSectionRef = useRef<HTMLElement | null>(null);
  const [selectedState, setSelectedState] = useState<string>("All");
  const [compareOpen, setCompareOpen] = useState(false);
  const [comparePackage, setComparePackage] = useState<TravelPackage | null>(null);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [activeCultureSlide, setActiveCultureSlide] = useState(0);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 110]);

  const northeastPackages = useMemo(() => {
    return packages
      .filter((travelPackage) => {
        const combined = `${travelPackage.title} ${travelPackage.destination} ${travelPackage.location} ${travelPackage.short_description}`;
        return northeastStates.some((state) => statePatterns[state].test(combined));
      })
      .slice(0, 12);
  }, [packages]);

  const fallbackFromGrouped = useMemo(() => {
    const prioritizedNortheast = prioritizeMostVisitedNortheast(northeastPackages);

    if (northeastPackages.length >= 6) {
      return prioritizedNortheast;
    }

    const merged = grouped.flatMap((group) => group.packages);
    const deduped = [...prioritizedNortheast];

    for (const travelPackage of merged) {
      if (!deduped.some((item) => item.id === travelPackage.id)) {
        deduped.push(travelPackage);
      }
    }

    return prioritizeMostVisitedNortheast(deduped).slice(0, 12);
  }, [grouped, northeastPackages]);

  const filteredPackages = useMemo(() => {
    if (selectedState === "All") {
      return fallbackFromGrouped;
    }

    return fallbackFromGrouped.filter((travelPackage) => detectState(travelPackage) === selectedState);
  }, [fallbackFromGrouped, selectedState]);

  const stateCounts = useMemo(() => {
    const counts = Object.fromEntries(northeastStates.map((state) => [state, 0])) as Record<
      (typeof northeastStates)[number],
      number
    >;
    for (const travelPackage of fallbackFromGrouped) {
      const state = detectState(travelPackage);
      counts[state] += 1;
    }

    return counts;
  }, [fallbackFromGrouped]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4800);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveCultureSlide((previous) => (previous + 1) % cultureSlides.length);
    }, 3000);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  const goToPreviousCultureSlide = () => {
    setActiveCultureSlide((previous) => (previous - 1 + cultureSlides.length) % cultureSlides.length);
  };

  const goToNextCultureSlide = () => {
    setActiveCultureSlide((previous) => (previous + 1) % cultureSlides.length);
  };

  const handleCompare = (travelPackage: TravelPackage) => {
    setComparePackage(travelPackage);
    setCompareOpen(true);
  };

  const handleStateSelect = (state: string) => {
    setSelectedState(state);
    packageSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const applyCursorGlow = (event: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--mx", `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty("--my", `${event.clientY - rect.top}px`);
  };

  return (
    <div className="-mt-28 space-y-14 pb-16 sm:-mt-32 lg:-mt-36">
      <section ref={heroRef} className="relative isolate min-h-svh overflow-hidden border-b border-border/40">
        <motion.div style={{ y: heroY }} className="absolute inset-0">
          <AnimatePresence mode="sync" initial={false}>
            <motion.div
              key={cultureSlides[activeCultureSlide].src}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.1, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <Image
                src={cultureSlides[activeCultureSlide].src}
                alt={cultureSlides[activeCultureSlide].label}
                fill
                priority={activeCultureSlide === 0}
                quality={100}
                className="object-cover"
                style={{ objectPosition: cultureSlides[activeCultureSlide].objectPosition }}
              />
            </motion.div>
          </AnimatePresence>
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(2,6,23,0.0)_0%,rgba(2,6,23,0.18)_30%,rgba(2,6,23,0.55)_65%,rgba(2,6,23,0.92)_100%)]" />
        </motion.div>
        <div className="noise-overlay absolute inset-0" />

        <div className="group/left absolute inset-y-0 left-0 z-20 hidden w-24 items-center justify-center md:flex lg:w-28">
          <button
            type="button"
            onClick={goToPreviousCultureSlide}
            className="grid h-12 w-12 place-items-center rounded-full border border-white/55 bg-black/20 text-white opacity-0 backdrop-blur-sm transition duration-300 group-hover/left:opacity-100 hover:bg-black/35 focus-visible:opacity-100"
            aria-label="Previous background"
          >
            <span className="text-xl">←</span>
          </button>
        </div>
        <div className="group/right absolute inset-y-0 right-0 z-20 hidden w-24 items-center justify-center md:flex lg:w-28">
          <button
            type="button"
            onClick={goToNextCultureSlide}
            className="grid h-12 w-12 place-items-center rounded-full border border-white/55 bg-black/20 text-white opacity-0 backdrop-blur-sm transition duration-300 group-hover/right:opacity-100 hover:bg-black/35 focus-visible:opacity-100"
            aria-label="Next background"
          >
            <span className="text-xl">→</span>
          </button>
        </div>

        <div className="relative mx-auto grid min-h-svh w-full max-w-7xl items-end gap-8 px-4 pb-16 pt-24 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
            className="mx-auto max-w-4xl text-center"
          >
            <motion.p variants={reveal} className="text-base font-medium text-white sm:text-lg [text-shadow:0_2px_12px_rgba(0,0,0,0.8)]">
              Where clouds touch the mountains and every turn feels like cinema.
            </motion.p>
            <motion.h1 variants={reveal} className="mt-2 text-2xl font-semibold text-yellow-300 sm:text-4xl [text-shadow:0_2px_16px_rgba(0,0,0,0.9),0_4px_32px_rgba(0,0,0,0.6)]">
              “The Northeast isn’t just a destination — it’s a feeling you carry home.”
            </motion.h1>
            <motion.p variants={reveal} className="mx-auto mt-3 max-w-2xl text-sm text-white sm:text-base [text-shadow:0_1px_10px_rgba(0,0,0,0.85)]">
              Discover wild landscapes, soulful cultures, and unforgettable journeys across all Seven Sisters.
            </motion.p>

            <motion.div variants={reveal} className="mt-8 flex flex-wrap justify-center gap-3">
              <motion.div whileHover={{ y: -3 }}>
                <Link
                  href="/contact"
                  onMouseMove={applyCursorGlow}
                  className="btn-cursor-glow inline-flex h-12 items-center justify-center rounded-full bg-[#f29a2e] px-8 text-base font-semibold text-white transition hover:bg-[#e4891f]"
                >
                  Connect With An Expert
                </Link>
              </motion.div>
            </motion.div>

          </motion.div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <MarqueeHighlights />
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <NeMap selectedState={selectedState} onStateSelect={handleStateSelect} counts={stateCounts} />
      </section>

      <motion.section
        ref={packageSectionRef}
        variants={reveal}
        initial={false}
        animate="visible"
        className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8"
      >
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-primary">Curated packages</p>
            <h2 className="mt-2 text-3xl font-semibold text-foreground">Northeast journeys, reimagined</h2>
          </div>
          <Link href="/packages" className="text-sm text-foreground/80 underline-offset-4 hover:text-foreground hover:underline">
            Browse all tours
          </Link>
        </div>

        <div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredPackages.slice(0, 9).map((travelPackage) => {
            const state = detectState(travelPackage);
            const duration = getDurationSummary(travelPackage.duration_days, travelPackage.raw_duration);
            const hasNumericPrice = Number.isFinite(travelPackage.price_inr);
            const priceLabel = hasNumericPrice
              ? `₹${Number(travelPackage.price_inr).toLocaleString("en-IN")}`
              : "Price on request";

            return (
              <motion.article
                key={travelPackage.id}
                initial={false}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ rotateX: 4, rotateY: -4, y: -6 }}
                transition={{ duration: 0.36, ease: "easeOut" }}
                className="group relative overflow-hidden rounded-3xl border border-white/45 bg-[linear-gradient(165deg,rgba(255,255,255,0.26),rgba(255,255,255,0.14))] shadow-[0_16px_44px_-28px_rgba(15,23,42,0.35)] backdrop-blur-xl"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(36,180,134,0.22),transparent_55%)] opacity-0 transition group-hover:opacity-100" />
                <div className="relative h-52 overflow-hidden border-b border-white/10">
                  <Image
                    src={travelPackage.cover_image || "/images/northeast/thumb-kaziranga.svg"}
                    alt={travelPackage.title}
                    fill
                    loading="lazy"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="relative p-5 text-foreground">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-lg font-semibold">{travelPackage.title}</h3>
                    <span className="rounded-full border border-accent/45 bg-accent/20 px-2 py-1 text-xs text-accent-foreground">
                      {state}
                    </span>
                  </div>
                  <p className="mt-2 max-h-10 overflow-hidden text-sm text-foreground/75">{travelPackage.short_description}</p>

                  <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                      <div className="rounded-xl border border-white/30 bg-white/24 p-2.5">
                      <dt className="text-xs text-foreground/65">Price</dt>
                        <dd className="mt-1 font-semibold">{priceLabel}</dd>
                    </div>
                    <div className="rounded-xl border border-white/30 bg-white/24 p-2.5">
                      <dt className="text-xs text-foreground/65">Duration</dt>
                      <dd className="mt-1 font-semibold">{duration}</dd>
                    </div>
                    <div className="rounded-xl border border-white/30 bg-white/24 p-2.5">
                      <dt className="text-xs text-foreground/65">Best season</dt>
                      <dd className="mt-1 font-semibold">{bestSeasonByState[state]}</dd>
                    </div>
                    <div className="rounded-xl border border-white/30 bg-white/24 p-2.5">
                      <dt className="text-xs text-foreground/65">Starting city</dt>
                      <dd className="mt-1 font-semibold">{travelPackage.destination || "Guwahati"}</dd>
                    </div>
                  </dl>

                  <div className="mt-4 flex items-center justify-between gap-3">
                    <Link href={`/packages/${travelPackage.slug}`} className="text-sm font-medium text-foreground underline-offset-4 hover:underline">
                      View details
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleCompare(travelPackage)}
                      className="rounded-full border border-primary/55 bg-primary/18 px-3 py-1.5 text-xs font-medium text-foreground transition hover:bg-primary/28"
                    >
                      Compare
                    </button>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>

        {filteredPackages.length === 0 ? (
          <p className="mt-6 text-sm text-foreground/70">No packages matched this state filter yet.</p>
        ) : null}
      </motion.section>

      <section className="mx-auto grid w-full max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        {stories.map((story, storyIndex) => (
          <motion.article
            key={story.title}
            variants={reveal}
            initial={false}
            animate="visible"
            transition={{ delay: storyIndex * 0.08 }}
            className="rounded-3xl border border-white/35 bg-white/18 p-5 backdrop-blur-xl"
          >
            <h3 className="text-xl font-semibold text-foreground">{story.title}</h3>
            <ol className="mt-4 space-y-3">
              {story.steps.map((step, stepIndex) => (
                <motion.li
                  key={step}
                  initial={false}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: stepIndex * 0.07 }}
                  className="flex gap-3 text-sm text-foreground/85"
                >
                  <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/28 text-xs font-semibold text-foreground">
                    {stepIndex + 1}
                  </span>
                  <span>{step}</span>
                </motion.li>
              ))}
            </ol>
          </motion.article>
        ))}
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-white/35 bg-[linear-gradient(150deg,rgba(255,255,255,0.24),rgba(255,255,255,0.14))] p-6 backdrop-blur-xl">
          <div className="mb-4 flex items-end justify-between gap-3">
            <h3 className="text-2xl font-semibold text-foreground">Traveler stories</h3>
            <p className="text-xs uppercase tracking-[0.22em] text-accent/90">Auto + drag</p>
          </div>

          <motion.div drag="x" dragConstraints={{ left: -140, right: 140 }} className="cursor-grab active:cursor-grabbing">
            <AnimatePresence mode="wait">
              <motion.article
                key={testimonials[activeTestimonial].name}
                initial={{ opacity: 0, rotateX: -9, y: 18 }}
                animate={{ opacity: 1, rotateX: 0, y: 0 }}
                exit={{ opacity: 0, rotateX: 8, y: -14 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="rounded-2xl border border-white/35 bg-white/24 p-5 text-foreground shadow-[0_20px_60px_-40px_rgba(36,180,134,0.35)]"
                style={{ transformStyle: "preserve-3d" }}
              >
                <p className="text-base leading-relaxed">“{testimonials[activeTestimonial].quote}”</p>
                <p className="mt-4 text-sm font-semibold text-accent">— {testimonials[activeTestimonial].name}</p>
              </motion.article>
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      <PackageCompareSheet open={compareOpen} onOpenChange={setCompareOpen} travelPackage={comparePackage} />
    </div>
  );
}
