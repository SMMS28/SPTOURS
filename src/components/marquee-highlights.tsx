"use client";

import { motion } from "framer-motion";

const items = [
  { state: "Assam", icon: "🏞️", note: "Tea estates + river islands" },
  { state: "Meghalaya", icon: "🌿", note: "Living root bridges + caves" },
  { state: "Arunachal", icon: "🧭", note: "Tawang circuits + monasteries" },
  { state: "Nagaland", icon: "🏞️", note: "Dzükoü Valley + heritage villages" },
  { state: "Sikkim", icon: "🌿", note: "Alpine lakes + mountain monasteries" },
  { state: "Manipur", icon: "🧭", note: "Loktak lake + cultural trails" },
  { state: "Mizoram", icon: "🏞️", note: "Cloud valleys + scenic drives" },
  { state: "Tripura", icon: "🌿", note: "Palaces + hidden forest sanctuaries" },
];

export function MarqueeHighlights() {
  const looped = [...items, ...items];

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/60 bg-white/65 py-5 shadow-[0_16px_40px_-32px_rgba(15,23,42,0.35)] backdrop-blur-xl">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-linear-to-r from-[#f5f7fb] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-linear-to-l from-[#f5f7fb] to-transparent" />

      <motion.div
        drag="x"
        dragConstraints={{ left: -360, right: 0 }}
        whileTap={{ cursor: "grabbing" }}
        className="cursor-grab"
      >
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 28, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="flex w-max gap-3 px-4"
        >
          {looped.map((item, index) => (
            <motion.div
              key={`${item.state}-${index}`}
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 240, damping: 18 }}
              className="flex min-w-56 items-center gap-3 rounded-2xl border border-white/70 bg-white/80 px-4 py-3 text-sm text-foreground shadow-[0_0_26px_-20px_rgba(37,99,235,0.45)]"
            >
              <span className="text-lg">{item.icon}</span>
              <div>
                <p className="font-semibold">{item.state}</p>
                <p className="text-xs text-muted-foreground">{item.note}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
