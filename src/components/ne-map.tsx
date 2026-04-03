"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useMemo, useState } from "react";

type NortheastState =
  | "Assam"
  | "Meghalaya"
  | "Arunachal Pradesh"
  | "Nagaland"
  | "Sikkim"
  | "Manipur"
  | "Mizoram"
  | "Tripura";

type NeMapProps = {
  selectedState: string;
  onStateSelect: (state: string) => void;
  counts: Partial<Record<NortheastState, number>>;
};

export function NeMap({ selectedState, onStateSelect, counts }: NeMapProps) {
  const [hoveredState, setHoveredState] = useState<NortheastState | null>(null);
  const hoveredCount = hoveredState ? counts[hoveredState] ?? 0 : 0;

  const stateColors: Record<NortheastState, string> = {
    Assam: "#f97316",
    Meghalaya: "#16a34a",
    "Arunachal Pradesh": "#dc2626",
    Nagaland: "#7c3aed",
    Sikkim: "#2563eb",
    Manipur: "#0891b2",
    Mizoram: "#db2777",
    Tripura: "#ca8a04",
  };

  const hotspots = useMemo(
    () => [
      { state: "Arunachal Pradesh" as const, x: 62, y: 18 },
      { state: "Sikkim" as const, x: 35, y: 34 },
      { state: "Assam" as const, x: 54, y: 43 },
      { state: "Nagaland" as const, x: 67, y: 42 },
      { state: "Meghalaya" as const, x: 46, y: 58 },
      { state: "Manipur" as const, x: 69, y: 57 },
      { state: "Mizoram" as const, x: 62, y: 73 },
      { state: "Tripura" as const, x: 50, y: 74 },
    ],
    [],
  );

  const handleSelectState = (state: NortheastState | "All") => {
    onStateSelect(state);
  };

  return (
    <section className="rounded-3xl border border-white/65 bg-[radial-gradient(circle_at_22%_10%,rgba(255,127,80,0.16),transparent_45%),radial-gradient(circle_at_85%_12%,rgba(56,189,248,0.2),transparent_42%),linear-gradient(140deg,rgba(255,255,255,0.88),rgba(244,248,255,0.78))] p-5 shadow-[0_24px_80px_-52px_rgba(15,23,42,0.3)] backdrop-blur-xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Explore by state</p>
          <h3 className="text-xl font-semibold text-foreground">Northeast India Interactive Map</h3>
        </div>
        <motion.button
          type="button"
          whileTap={{ scale: 0.95 }}
          onClick={() => handleSelectState("All")}
          className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
            selectedState === "All"
              ? "border-primary/35 bg-primary/15 text-foreground"
              : "border-border bg-white/65 text-foreground hover:bg-white/90"
          }`}
        >
          Show all states
        </motion.button>
      </div>

      <div className="relative mt-5 rounded-2xl border border-white/75 bg-white/66 p-4 shadow-inner">
        <div className="relative mx-auto w-full max-w-4xl overflow-hidden rounded-2xl border border-border/45 bg-[linear-gradient(170deg,#fbfdff,#eef3ff)] p-2">
          <div className="relative mx-auto w-full max-w-3xl">
            <Image
              src="/images/northeast/seven_sisters_map.svg"
              alt="Seven Sisters map with state names"
              width={1600}
              height={1100}
              className="h-auto w-full select-none"
              priority
            />

            <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full border border-white/85 bg-white/86 px-3 py-1 text-xs font-medium text-foreground shadow-sm">
              {hoveredState
                ? `State: ${hoveredState} • Packages: ${hoveredCount}`
                : "Use the state list below to open packages"}
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {hotspots.map((item) => {
            const color = stateColors[item.state];
            const count = counts[item.state] ?? 0;
            const isActive = selectedState === item.state;

            return (
              <button
                key={`legend-${item.state}`}
                type="button"
                onMouseEnter={() => setHoveredState(item.state)}
                onMouseLeave={() => setHoveredState((current) => (current === item.state ? null : current))}
                onClick={() => handleSelectState(item.state)}
                className={`flex items-center justify-between rounded-xl border px-3 py-2 text-left text-xs transition ${
                  isActive ? "border-slate-800/35 bg-white" : "border-border bg-white/72 hover:bg-white"
                }`}
              >
                <span className="inline-flex items-center gap-2 font-medium text-foreground">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
                  {item.state}
                </span>
                <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">{count}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
