"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { TravelPackage } from "@/lib/types";

type PackageCompareSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  travelPackage: TravelPackage | null;
};

const getItineraryBullets = (travelPackage: TravelPackage | null) => {
  if (!travelPackage) {
    return [] as string[];
  }

  if (travelPackage.package_itinerary_days?.length) {
    return travelPackage.package_itinerary_days
      .slice(0, 5)
      .map((item) => `Day ${item.day_number}: ${item.title}`);
  }

  if (travelPackage.inclusions?.length) {
    return travelPackage.inclusions.slice(0, 5).map((item) => `Included: ${item}`);
  }

  return ["Tailored itinerary shared by planner after inquiry."];
};

export function PackageCompareSheet({ open, onOpenChange, travelPackage }: PackageCompareSheetProps) {
  const bullets = getItineraryBullets(travelPackage);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-120 flex items-end justify-center bg-slate-900/25 p-3 backdrop-blur-sm sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label="Package compare sheet"
        >
          <button
            type="button"
            className="absolute inset-0"
            aria-label="Close compare sheet"
            onClick={() => onOpenChange(false)}
          />
          <motion.div
            initial={{ y: 80, opacity: 0.7 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 90, opacity: 0 }}
            transition={{ type: "spring", stiffness: 180, damping: 24 }}
            className="relative w-full max-w-2xl rounded-3xl border border-white/65 bg-[linear-gradient(170deg,rgba(255,255,255,0.92),rgba(246,250,255,0.88))] p-5 text-foreground shadow-[0_-20px_80px_-30px_rgba(15,23,42,0.35)] sm:p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-primary">Compare package</p>
                <h3 className="mt-1 text-xl font-semibold">{travelPackage?.title ?? "Selected package"}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {travelPackage?.destination}, {travelPackage?.location}
                </p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} aria-label="Close">
                <X />
              </Button>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-border bg-white/75 p-3">
                <p className="text-xs text-muted-foreground">Price</p>
                <p className="mt-1 font-semibold">₹{travelPackage?.price_inr.toLocaleString("en-IN") ?? "On request"}</p>
              </div>
              <div className="rounded-xl border border-border bg-white/75 p-3">
                <p className="text-xs text-muted-foreground">Duration</p>
                <p className="mt-1 font-semibold">{travelPackage?.raw_duration ?? "Custom"}</p>
              </div>
              <div className="rounded-xl border border-border bg-white/75 p-3">
                <p className="text-xs text-muted-foreground">Starting from</p>
                <p className="mt-1 font-semibold">{travelPackage?.destination ?? "Guwahati"}</p>
              </div>
            </div>

            <ul className="mt-5 space-y-2">
              {bullets.map((item) => (
                <li key={item} className="rounded-xl border border-border bg-white/70 px-3 py-2 text-sm text-foreground">
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
