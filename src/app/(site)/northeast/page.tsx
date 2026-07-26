"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const reveal = {
  hidden: { opacity: 0, y: 24, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6 } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const whyChoose = [
  {
    icon: "🗺️",
    title: "Diverse Itineraries",
    body: "Our Northeast packages span Assam, Meghalaya, Arunachal Pradesh, Nagaland, and beyond—with marquee spots like Kaziranga, Tawang, Ziro Valley, and Cherrapunji woven into every journey.",
  },
  {
    icon: "✨",
    title: "Tailored Experiences",
    body: "Prefer a self-drive road trip or a guided cultural immersion? We customise every detail—wildlife safaris, trekking escapes, or heritage trails—to match your travel style perfectly.",
  },
  {
    icon: "🧭",
    title: "Expert Local Guides",
    body: "Our seasoned guides bring the region's history, folklore, and ecology alive, leading you to hidden gems that most visitors never discover.",
  },
  {
    icon: "📋",
    title: "All-Inclusive Packages",
    body: "Transfers, stays, meals, sightseeing—and even tricky Inner Line Permits (ILPs) and Protected Area Permits (PAPs)—handled for you.",
  },
  {
    icon: "💰",
    title: "Every Budget, One Platform",
    body: "Starting at ₹16,500 per person, our packages range from pocket-friendly group tours to premium luxury escapes with exclusive stays.",
  },
  {
    icon: "🛡️",
    title: "Safety & 24/7 Support",
    body: "Verified vehicles, vetted accommodations, and round-the-clock support mean someone is always there for you, no matter where your adventure takes you.",
  },
];

const destinations = [
  { name: "Sikkim", image: "/images/hero-bg/pexels-kosyginl-2888802.jpg", tagline: "Himalayan Jewel", desc: "Rumtek Monastery, the shimmering Tsomgo Lake, and the legendary Goechala trek—Sikkim blends spiritual serenity with jaw-dropping alpine adventure." },
  { name: "Meghalaya", image: "/images/hero-bg/pexels-parijb-3678501.jpg", tagline: "Abode of Clouds", desc: "Living root bridges, the Dawki River's glass-clear waters, and Mawlynnong—Asia's cleanest village—await in this cloud-wrapped paradise." },
  { name: "Assam", image: "/images/hero-bg/nilotpal-kalita-24vPDG707eM-unsplash.jpg", tagline: "Gateway of the Northeast", desc: "Walk through emerald tea gardens, cruise the mighty Brahmaputra, and come face-to-face with the one-horned rhino at Kaziranga—a UNESCO marvel." },
  { name: "Arunachal Pradesh", image: "/images/hero-bg/pexels-pallabi-dewri-791137-5496933.jpg", tagline: "Land of Dawn-Lit Mountains", desc: "India's largest monastery at Tawang, the zen-like Ziro Valley, the snowy Sela Pass, and the tribal tapestry of Arunachal—every kilometre reveals a revelation." },
  { name: "Nagaland", image: "/images/hero-bg/pexels-vijit-bagh-3435480-5414576.jpg", tagline: "Land of Festivals", desc: "The legendary Hornbill Festival, the dramatic Dzükou Valley, and the warm hospitality of Naga tribes paint a vivid picture of a culture unlike any other." },
  { name: "Manipur", image: "/images/hero-bg/pexels-logalongwithme-6058267.jpg", tagline: "Jewel of India", desc: "The world's only floating national park at Loktak Lake, ancient polo grounds, and a classical dance heritage that dates back centuries—quietly extraordinary." },
  { name: "Mizoram", image: "/images/hero-bg/pexels-chunry-6538013.jpg", tagline: "Land of Blue Mountains", desc: "Rolling mist-clad highlands, handloom villages, and the serene Aizawl city offer a tranquil, off-the-beaten-path experience." },
  { name: "Darjeeling", image: "/images/hero-bg/pexels-xperimental-1043292.jpg", tagline: "Queen of the Hills", desc: "UNESCO-listed Darjeeling Himalayan Railway, golden tea estates, and a Tiger Hill sunrise over Kangchenjunga—Himalayan magic at every turn." },
];

const seasons = [
  {
    period: "Oct – Apr",
    badge: "Peak Season",
    badgeClass: "bg-[#f0e9da] text-[#4c5142] border-ink/10",
    temp: "15°C – 35°C",
    headline: "Best for Sightseeing, Treks & Festivals",
    points: [
      "Clear post-monsoon skies perfect for mountain photography",
      "Vibrant festivals: Bihu, Hornbill, Losar & more",
      "Ideal trekking weather across all states",
      "Wildlife sanctuaries in peak viewing season",
      "Well-maintained roads after the rains",
    ],
  },
  {
    period: "May – Jun",
    badge: "Early Summer",
    badgeClass: "bg-[#f0e9da] text-[#4c5142] border-ink/10",
    temp: "30°C – 38°C",
    headline: "Lush Greens, Fewer Crowds",
    points: [
      "Landscapes in full bloom—tea gardens at their finest",
      "Quieter than peak months—more authentic interactions",
      "Good window for wildlife safaris (cooler mornings/evenings)",
      "Dry roads before the monsoon arrives",
      "Festivals and cultural events still active",
    ],
  },
  {
    period: "Jun – Sep",
    badge: "Monsoon",
    badgeClass: "bg-[#f0e9da] text-[#4c5142] border-ink/10",
    temp: "22°C – 35°C",
    headline: "Dramatic Waterfalls & Green Valleys",
    points: [
      "Nohkalikai and Nuranang Falls at their awe-inspiring peak",
      "Dzükou Valley carpeted in rare Dzükou lilies",
      "Lowest prices—great for budget-conscious explorers",
      "Fewest tourists for a peaceful, authentic trip",
      "Cherrapunji and Mawsynram at their most vivid",
    ],
  },
];

const activities = [
  { icon: "🌊", title: "White-Water Rafting", desc: "Tackle the roaring rapids of the Teesta and Brahmaputra—heart-pumping runs from Grade II to Grade V." },
  { icon: "🏍️", title: "Biking Expeditions", desc: "Conquer mountain passes, winding forest roads, and dramatic valleys on two wheels through Sikkim, Meghalaya, and Arunachal." },
  { icon: "🥾", title: "Trekking Adventures", desc: "Goechala, Living Root Bridges, Talley Valley, Mechuka—Northeast trails reward trekkers with scenery found nowhere else on Earth." },
  { icon: "🥁", title: "Hornbill Festival", desc: "Nagaland's biggest cultural showcase—tribal dances, indigenous crafts, traditional music, and local cuisine over ten unforgettable days each December." },
  { icon: "🌉", title: "Living Root Bridges", desc: "Walk across ancient bioengineered bridges woven from rubber tree roots—a living testament to Meghalaya's indigenous ingenuity." },
  { icon: "🪂", title: "Paragliding", desc: "Soar over Sikkim's green valleys and Meghalaya's rolling hills, with panoramic Himalayan vistas stretching to the horizon." },
  { icon: "🛶", title: "Floating Lake Cruise", desc: "Glide across Loktak Lake's phumdis (floating islands) by traditional wooden boat and visit the world's only floating national park." },
  { icon: "🍛", title: "Culinary Journeys", desc: "From Assam's smoky duck curry to Sikkim's handmade momos and Nagaland's bamboo shoot fry—a paradise for adventurous palates." },
];

const mustVisit = [
  { name: "Kaziranga National Park", state: "Assam", bestTime: "Nov – Apr", permit: "At entry gates or online", highlight: "Home of the endangered one-horned rhino; UNESCO World Heritage Site.", activities: "Jeep safari, elephant safari, birdwatching" },
  { name: "Tawang Monastery", state: "Arunachal Pradesh", bestTime: "Mar – Oct", permit: "ILP required; available online", highlight: "India's largest monastery at 10,000 ft—birthplace of the 6th Dalai Lama.", activities: "Monastery tour, Torgya Festival, Sela Pass hike" },
  { name: "Nathula Pass", state: "Sikkim", bestTime: "May – Oct", permit: "Indian nationals only; via Gangtok agents", highlight: "Strategic Indo-Tibet border pass ringed by Himalayan flora and fauna.", activities: "Scenic drive, border viewpoint, Changu Lake" },
  { name: "Tsomgo Lake", state: "Sikkim", bestTime: "Apr – Nov", permit: "PAP for foreigners; police check posts", highlight: "High-altitude glacial lake reflecting snow-capped peaks in crystal waters.", activities: "Yak ride, helicopter tour, Baba Mandir" },
  { name: "Nohkalikai Falls", state: "Meghalaya", bestTime: "Oct – Mar", permit: "None; small entry fee applies", highlight: "India's tallest plunge waterfall—335 m of misty, thundering grandeur.", activities: "Viewpoint, Cherrapunji trek, Living Root Bridge day trip" },
  { name: "Ziro Valley", state: "Arunachal Pradesh", bestTime: "Mar – Oct", permit: "ILP (Indians), PAP (foreigners)", highlight: "UNESCO-listed valley of the Apatani tribe—terraced rice fields and misty hills.", activities: "Village walks, rice field treks, Ziro Festival of Music" },
  { name: "Umiam Lake", state: "Meghalaya", bestTime: "Oct – Apr", permit: "None required", highlight: "Emerald reservoir on the outskirts of Shillong—peaceful and photogenic.", activities: "Boating, kayaking, hillside nature walks" },
  { name: "Gorichen Peak", state: "Arunachal Pradesh", bestTime: "Apr – Oct", permit: "ILP (Indians), PAP (foreigners)", highlight: "At 21,410 ft, Arunachal's highest summit—sacred to the Monpa tribe.", activities: "High-altitude trek, alpine meadow camping" },
];

const cuisine = [
  { state: "Assam", dish: "Duck Curry", desc: "Slow-cooked with ash gourd and crushed black pepper—bold and soulful." },
  { state: "Assam", dish: "Khar", desc: "Alkaline delicacy made with raw papaya and banana-peel water—tangy and smoky." },
  { state: "Nagaland", dish: "Smoked Pork", desc: "Wood-smoked until crisp outside and tender inside, paired with steamed rice." },
  { state: "Nagaland", dish: "Bamboo Shoot Fry", desc: "Soft bamboo shoots tossed with aromatics—earthy, subtly sweet." },
  { state: "Manipur", dish: "Eromba", desc: "Fiery curry of dried fish, bamboo shoots, and seasonal vegetables." },
  { state: "Manipur", dish: "Chamthong", desc: "Hearty stew of seasonal vegetables and herbs with fish or pork." },
  { state: "Sikkim", dish: "Momo", desc: "Juicy dumplings steamed or fried with tangy tomato-chilli dipping sauce." },
  { state: "Meghalaya", dish: "Jadoh", desc: "Fragrant pork or chicken stewed with local spices—a Khasi staple." },
  { state: "Arunachal Pradesh", dish: "Zan", desc: "Thick millet or rice porridge paired with savoury vegetable or meat sides." },
  { state: "Mizoram", dish: "Bai", desc: "Wholesome slow-cooked stew of vegetables, bamboo shoots, and pork." },
  { state: "Tripura", dish: "Chikhvi", desc: "Bamboo mushrooms and fried fish in a light, aromatic broth." },
  { state: "Sikkim", dish: "Gyathuk", desc: "Hand-pulled noodle soup simmered with meat and garden vegetables." },
];

const airports = [
  { city: "Guwahati", state: "Assam", note: "Primary gateway to the entire Northeast" },
  { city: "Bagdogra", state: "West Bengal", note: "Best for Darjeeling, Sikkim & North Bengal" },
  { city: "Imphal", state: "Manipur", note: "Main airport for Manipur" },
  { city: "Shillong (Umroi)", state: "Meghalaya", note: "Nearest to Cherrapunji & Living Root Bridges" },
  { city: "Dibrugarh", state: "Assam", note: "Gateway to Upper Assam & Arunachal Pradesh" },
];

export default function NorthEastPage() {
  return (
    <div className="pb-20">
      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="relative isolate flex min-h-[78vh] items-end overflow-hidden">
        <Image
          src="/images/hero-bg/pexels-kosyginl-2888802.jpg"
          alt="North East India landscape"
          fill
          priority
          quality={95}
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(2,6,23,0.38)_0%,rgba(2,6,23,0.18)_40%,rgba(2,6,23,0.80)_75%,rgba(2,6,23,0.96)_100%)]" />

        <div className="relative mx-auto w-full max-w-7xl px-4 pb-20 pt-44 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="max-w-3xl"
          >
            <motion.p variants={reveal} className="text-sm font-semibold uppercase tracking-[0.22em] text-[#9B6A4C] [text-shadow:0_1px_8px_rgba(0,0,0,0.6)]">
              SP Tours & Travels presents
            </motion.p>
            <motion.h1
              variants={reveal}
              className="mt-3 font-display text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl [text-shadow:0_2px_24px_rgba(0,0,0,0.8)]"
            >
              North East India <br />
              <span className="text-clay-tint">Tour Packages</span>
            </motion.h1>
            <motion.p variants={reveal} className="mt-5 max-w-2xl text-base text-white/90 sm:text-lg [text-shadow:0_1px_10px_rgba(0,0,0,0.7)]">
              Seven sister states. Countless stories. From the rhino grasslands of Assam to the cloud-hung bridges of Meghalaya—we craft journeys that stay with you long after you&apos;re home.
            </motion.p>
            <motion.div variants={reveal} className="mt-8 flex flex-wrap gap-4">
              <motion.div whileHover={{ y: -3 }}>
                <Link href="/contact" className="inline-flex h-12 items-center justify-center rounded-full bg-[#9B6A4C] px-8 text-base font-semibold text-white transition hover:bg-[#82573C]">
                  Plan My Trip
                </Link>
              </motion.div>
              <motion.div whileHover={{ y: -3 }}>
                <Link href="/packages" className="inline-flex h-12 items-center justify-center rounded-full border border-white/55 bg-white/10 px-8 text-base font-semibold text-white backdrop-blur-sm transition hover:bg-white/20">
                  Browse Packages
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Stats strip ────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={stagger}
          initial={false}
          animate="visible"
          className="grid grid-cols-2 gap-4 py-10 sm:grid-cols-4"
        >
          {[
            { num: "40+", label: "Tour Packages" },
            { num: "8", label: "States Covered" },
            { num: "₹16,500", label: "Starting Price" },
            { num: "24/7", label: "Expert Support" },
          ].map((s) => (
            <motion.div
              key={s.label}
              variants={reveal}
              className="rounded-2xl border border-ink/10 bg-white/90 p-5 text-center shadow-[0_8px_22px_-16px_rgba(15,23,42,0.18)] backdrop-blur-md"
            >
              <p className="font-display text-3xl font-bold text-clay">{s.num}</p>
              <p className="mt-1 text-sm text-mutedfg">{s.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── Intro ──────────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <motion.div
          variants={stagger}
          initial={false}
          animate="visible"
        >
          <motion.p variants={reveal} className="text-xs font-semibold uppercase tracking-[0.22em] text-clay">The Destination</motion.p>
          <motion.h2 variants={reveal} className="mt-2 font-display text-3xl font-bold text-ink sm:font-display text-4xl">
            Where India&apos;s Wildest Landscapes Meet Its Richest Cultures
          </motion.h2>
          <motion.p variants={reveal} className="mt-4 max-w-3xl text-base leading-relaxed text-mutedfg">
            The Northeast is India&apos;s best-kept secret—eight states of extraordinary diversity tucked between the Himalayas, Bangladesh, and Myanmar. Ancient tribal traditions coexist with rare ecosystems, living architectural wonders grow from forest floors, and every winding mountain road reveals a view more breathtaking than the last.
          </motion.p>
        </motion.div>
      </section>

      {/* ── Why Choose Us ─────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <motion.div variants={reveal} initial={false} animate="visible">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-clay">Why us</p>
          <h2 className="mt-2 font-display text-3xl font-bold text-ink">Why Travel the Northeast with SP Tours?</h2>
        </motion.div>
        <motion.div
          variants={stagger}
          initial={false}
          animate="visible"
          className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {whyChoose.map((item) => (
            <motion.div
              key={item.title}
              variants={reveal}
              className="rounded-2xl border border-ink/10 bg-white/90 p-5 shadow-[0_8px_22px_-16px_rgba(15,23,42,0.12)] backdrop-blur-md transition hover:border-clay/30 hover:shadow-[0_12px_28px_-16px_rgba(29,78,216,0.18)]"
            >
              <span className="font-display text-3xl">{item.icon}</span>
              <h3 className="mt-3 text-base font-semibold text-ink">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-mutedfg">{item.body}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── Popular Destinations ───────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <motion.div variants={reveal} initial={false} animate="visible">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-clay">Destinations</p>
          <h2 className="mt-2 font-display text-3xl font-bold text-ink">Popular Destinations to Explore</h2>
        </motion.div>
        <motion.div
          variants={stagger}
          initial={false}
          animate="visible"
          className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4"
        >
          {destinations.map((dest) => (
            <motion.div
              key={dest.name}
              variants={reveal}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.3 }}
              className="group overflow-hidden rounded-3xl border border-ink/10 bg-white shadow-[0_8px_32px_-16px_rgba(15,23,42,0.18)]"
            >
              <div className="relative h-52 overflow-hidden">
                <Image
                  src={dest.image}
                  alt={dest.name}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-4">
                  <p className="text-xs font-semibold text-[#9B6A4C]">{dest.tagline}</p>
                  <h3 className="mt-0.5 text-xl font-bold text-white [text-shadow:0_1px_8px_rgba(0,0,0,0.8)]">{dest.name}</h3>
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm leading-relaxed text-mutedfg">{dest.desc}</p>
                <Link href="/packages" className="mt-3 inline-block text-sm font-semibold text-clay hover:underline underline-offset-4">
                  View packages →
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── Must-Visit Spots ──────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <motion.div variants={reveal} initial={false} animate="visible">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-clay">Must-visit places</p>
          <h2 className="mt-2 font-display text-3xl font-bold text-ink">Iconic Stops on Every Northeast Journey</h2>
        </motion.div>
        <motion.div
          variants={stagger}
          initial={false}
          animate="visible"
          className="mt-8 grid gap-4 md:grid-cols-2"
        >
          {mustVisit.map((spot) => (
            <motion.div
              key={spot.name}
              variants={reveal}
              className="rounded-2xl border border-ink/10 bg-white/90 p-5 shadow-[0_4px_18px_-10px_rgba(15,23,42,0.12)] backdrop-blur-md"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-semibold text-ink">{spot.name}</h3>
                  <p className="text-xs font-medium text-clay">{spot.state}</p>
                </div>
                <span className="shrink-0 rounded-full border border-hairline bg-[#f0e9da] px-3 py-1 text-xs font-medium text-ink">
                  Best: {spot.bestTime}
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-mutedfg">{spot.highlight}</p>
              <dl className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <dt className="text-mutedfg/70">Permit</dt>
                  <dd className="mt-0.5 font-medium text-ink">{spot.permit}</dd>
                </div>
                <div>
                  <dt className="text-mutedfg/70">Activities</dt>
                  <dd className="mt-0.5 font-medium text-ink">{spot.activities}</dd>
                </div>
              </dl>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── When to Visit ─────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <motion.div variants={reveal} initial={false} animate="visible">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-clay">Travel calendar</p>
          <h2 className="mt-2 font-display text-3xl font-bold text-ink">When to Visit the Northeast</h2>
        </motion.div>
        <motion.div
          variants={stagger}
          initial={false}
          animate="visible"
          className="mt-8 grid gap-5 lg:grid-cols-3"
        >
          {seasons.map((s) => (
            <motion.div
              key={s.period}
              variants={reveal}
              className="rounded-2xl border border-ink/10 bg-white/90 p-6 shadow-[0_8px_22px_-16px_rgba(15,23,42,0.12)] backdrop-blur-md"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-2xl font-bold text-ink">{s.period}</span>
                <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${s.badgeClass}`}>
                  {s.badge}
                </span>
              </div>
              <p className="mt-1 text-xs text-mutedfg">Avg: {s.temp}</p>
              <h3 className="mt-3 text-sm font-semibold text-ink">{s.headline}</h3>
              <ul className="mt-3 space-y-2">
                {s.points.map((pt) => (
                  <li key={pt} className="flex gap-2 text-sm text-mutedfg">
                    <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-clay" />
                    {pt}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── Things to Do ──────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <motion.div variants={reveal} initial={false} animate="visible">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-clay">Experiences</p>
          <h2 className="mt-2 font-display text-3xl font-bold text-ink">Unforgettable Things to Do</h2>
        </motion.div>
        <motion.div
          variants={stagger}
          initial={false}
          animate="visible"
          className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {activities.map((act) => (
            <motion.div
              key={act.title}
              variants={reveal}
              className="rounded-2xl border border-ink/10 bg-white/90 p-5 shadow-[0_4px_18px_-10px_rgba(15,23,42,0.12)] backdrop-blur-md transition hover:border-clay/30 hover:shadow-[0_12px_28px_-16px_rgba(29,78,216,0.18)]"
            >
              <span className="font-display text-3xl">{act.icon}</span>
              <h3 className="mt-3 text-base font-semibold text-ink">{act.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-mutedfg">{act.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── How to Reach ──────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <motion.div variants={reveal} initial={false} animate="visible">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-clay">Getting here</p>
          <h2 className="mt-2 font-display text-3xl font-bold text-ink">How to Reach the Northeast</h2>
        </motion.div>
        <motion.div
          variants={stagger}
          initial={false}
          animate="visible"
          className="mt-8 grid gap-5 lg:grid-cols-2"
        >
          <motion.div variants={reveal} className="rounded-2xl border border-ink/10 bg-white/90 p-6 shadow-[0_4px_18px_-10px_rgba(15,23,42,0.12)] backdrop-blur-md">
            <h3 className="text-lg font-semibold text-ink">✈️ By Air — Fastest Way</h3>
            <p className="mt-2 text-sm text-mutedfg">Direct domestic flights from Delhi, Mumbai, Kolkata & Bangalore. International connections from Bangkok, Singapore & Paro (Bhutan).</p>
            <div className="mt-4 space-y-2">
              {airports.map((a) => (
                <div key={a.city} className="rounded-xl border border-ink/10 bg-[#f0e9da] px-4 py-3">
                  <p className="text-sm font-semibold text-ink">{a.city}, {a.state}</p>
                  <p className="text-xs text-mutedfg">{a.note}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="flex flex-col gap-5">
            <motion.div variants={reveal} className="rounded-2xl border border-ink/10 bg-white/90 p-6 shadow-[0_4px_18px_-10px_rgba(15,23,42,0.12)] backdrop-blur-md">
              <h3 className="text-lg font-semibold text-ink">🚂 By Train — Scenic & Budget-Friendly</h3>
              <p className="mt-2 text-sm text-mutedfg">Major railheads: Guwahati, New Jalpaiguri, Dimapur, Dibrugarh, Agartala—connected to all major Indian cities.</p>
              <ul className="mt-4 space-y-2 text-sm">
                <li><span className="font-semibold text-ink">Saraighat Express</span> <span className="text-mutedfg">— Howrah → Guwahati (~18 hrs)</span></li>
                <li><span className="font-semibold text-ink">Dibrugarh Rajdhani</span> <span className="text-mutedfg">— New Delhi → Dibrugarh (~37 hrs)</span></li>
                <li><span className="font-semibold text-ink">Kanchanjunga Express</span> <span className="text-mutedfg">— Sealdah → Agartala (~37 hrs)</span></li>
              </ul>
            </motion.div>
            <motion.div variants={reveal} className="rounded-2xl border border-ink/10 bg-white/90 p-6 shadow-[0_4px_18px_-10px_rgba(15,23,42,0.12)] backdrop-blur-md">
              <h3 className="text-lg font-semibold text-ink">🚗 By Road — Best for Experience</h3>
              <p className="mt-2 text-sm text-mutedfg">Scenic state highways connect the Northeast&apos;s major hubs. Popular routes:</p>
              <ul className="mt-4 space-y-2 text-sm text-mutedfg">
                <li>Guwahati → Shillong → Cherrapunji (~153 km)</li>
                <li>Tezpur → Bomdila → Tawang (~328 km)</li>
                <li>Jorhat → Pasighat → Mechuka (~540 km)</li>
              </ul>
              <p className="mt-3 text-xs font-medium text-clay">💡 For remote spots like Ziro or Mawlynnong, book local cabs in advance.</p>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ── Local Cuisine ─────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <motion.div variants={reveal} initial={false} animate="visible">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-clay">Food & flavour</p>
          <h2 className="mt-2 font-display text-3xl font-bold text-ink">What to Eat in the Northeast</h2>
          <p className="mt-2 text-base text-mutedfg">Each state is a distinct culinary universe—here are the unmissable dishes.</p>
        </motion.div>
        <motion.div
          variants={stagger}
          initial={false}
          animate="visible"
          className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {cuisine.map((item) => (
            <motion.div
              key={item.dish}
              variants={reveal}
              className="rounded-2xl border border-ink/10 bg-white/90 p-4 shadow-[0_4px_18px_-10px_rgba(15,23,42,0.10)] backdrop-blur-md"
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-clay">{item.state}</p>
              <h3 className="mt-1 text-base font-semibold text-ink">{item.dish}</h3>
              <p className="mt-2 text-sm leading-relaxed text-mutedfg">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="relative isolate mx-auto max-w-7xl overflow-hidden rounded-3xl px-4 py-0 sm:px-6 lg:px-8">
        <div className="relative isolate overflow-hidden rounded-3xl">
          <Image
            src="/images/hero-bg/pexels-chunry-6538013.jpg"
            alt="Northeast India scenery"
            fill
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-[rgba(2,6,23,0.76)]" />
          <motion.div
            variants={stagger}
            initial={false}
            animate="visible"
            className="relative px-6 py-20 text-center sm:px-12"
          >
            <motion.h2 variants={reveal} className="font-display text-3xl font-bold text-white sm:font-display text-4xl [text-shadow:0_2px_16px_rgba(0,0,0,0.7)]">
              Ready to Explore the Seven Sisters?
            </motion.h2>
            <motion.p variants={reveal} className="mx-auto mt-4 max-w-xl text-base text-white/80">
              Let our Northeast specialists craft an itinerary built around your interests, timeline, and budget. Your perfect trip is one conversation away.
            </motion.p>
            <motion.div variants={reveal} className="mt-8 flex flex-wrap justify-center gap-4">
              <motion.div whileHover={{ y: -3 }}>
                <Link href="/contact" className="inline-flex h-12 items-center justify-center rounded-full bg-[#9B6A4C] px-10 text-base font-semibold text-white transition hover:bg-[#82573C]">
                  Connect With an Expert
                </Link>
              </motion.div>
              <motion.div whileHover={{ y: -3 }}>
                <Link href="/packages" className="inline-flex h-12 items-center justify-center rounded-full border border-white/50 bg-white/10 px-10 text-base font-semibold text-white backdrop-blur-sm transition hover:bg-white/20">
                  Browse All Packages
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
