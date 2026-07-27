"use client";

import { useEffect, useState } from "react";

/**
 * Live strip under the Northeast hero.
 *
 * Visitors planning a Northeast trip are usually deciding two things at once —
 * "is this the right month?" and "can I talk to someone now?". This answers both
 * without a click, in the traveller's own reference frame (IST, where SS Rao is).
 *
 * Everything renders as a dash on the server and fills in after mount: the values
 * depend on the reader's clock, so rendering them during SSR would guarantee a
 * hydration mismatch.
 */

const DESK_OPEN_HOUR = 9;
const DESK_CLOSE_HOUR = 20;

/** Season windows keyed by month index (0 = January). */
function seasonFor(month: number) {
  if (month >= 9 || month <= 3) return { label: "Oct – Apr · Peak", tone: "peak" as const };
  if (month <= 5) return { label: "May – Jun · Summer", tone: "shoulder" as const };
  return { label: "Jul – Sep · Monsoon", tone: "shoulder" as const };
}

type Snapshot = {
  time: string;
  date: string;
  season: string;
  deskOpen: boolean;
};

function snapshot(): Snapshot {
  const now = new Date();
  const ist = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
  const hour = ist.getHours();

  return {
    time: now.toLocaleTimeString("en-GB", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),
    date: now.toLocaleDateString("en-IN", {
      timeZone: "Asia/Kolkata",
      weekday: "short",
      day: "numeric",
      month: "short",
    }),
    season: seasonFor(ist.getMonth()).label,
    deskOpen: hour >= DESK_OPEN_HOUR && hour < DESK_CLOSE_HOUR,
  };
}

export function NeLiveStatus() {
  const [now, setNow] = useState<Snapshot | null>(null);

  useEffect(() => {
    // First value goes through a frame rather than the effect body: setting state
    // synchronously here would trigger a cascading render (react-hooks lint rule).
    const first = requestAnimationFrame(() => setNow(snapshot()));
    const tick = setInterval(() => setNow(snapshot()), 1000);
    return () => {
      cancelAnimationFrame(first);
      clearInterval(tick);
    };
  }, []);

  const cells = [
    { label: "Local time · IST", value: now?.time ?? "--:--:--", mono: true },
    { label: "Today", value: now?.date ?? "—" },
    { label: "Best to visit", value: now?.season ?? "—", accent: true },
  ];

  return (
    <section aria-label="Live travel desk status" className="bg-inkdeep text-paper">
      <div className="mx-auto max-w-[1360px] px-6 lg:px-10">
        <div className="grid border-paper/10 lg:grid-cols-[auto_1fr] lg:border-x">
          <div className="flex items-center gap-3 border-b border-paper/10 py-3.5 lg:border-b-0 lg:border-r lg:px-[26px] lg:py-0">
            <span className="relative inline-flex h-[9px] w-[9px]">
              <span className="animate-ping-slow absolute inset-0 rounded-full bg-[#E3B98A]" />
              <span className="relative h-[9px] w-[9px] rounded-full bg-[#E3B98A]" />
            </span>
            <span className="whitespace-nowrap text-[11.5px] font-bold uppercase tracking-[0.22em] text-[#E3B98A]">
              Live now
            </span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4">
            {cells.map(({ label, value, mono, accent }) => (
              <div key={label} className="border-b border-paper/10 px-0 py-4 lg:border-b-0 lg:border-r lg:px-6 lg:py-[17px]">
                <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-paper/50">{label}</p>
                <p
                  suppressHydrationWarning
                  className={
                    mono
                      ? "font-mono text-[19px] font-bold tracking-[0.04em] text-paper"
                      : `font-display text-[15.5px] font-bold ${accent ? "text-[#E3B98A]" : "text-paper"}`
                  }
                >
                  {value}
                </p>
              </div>
            ))}

            <div className="px-0 py-4 lg:px-6 lg:py-[17px]">
              <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-paper/50">
                Planning desk
              </p>
              <p className="flex items-center gap-2 font-display text-[15.5px] font-bold text-paper">
                <span
                  className={`h-[7px] w-[7px] shrink-0 rounded-full ${
                    now === null ? "bg-paper/30" : now.deskOpen ? "bg-[#7FB069]" : "bg-[#C98A5E]"
                  }`}
                />
                <span suppressHydrationWarning>
                  {now === null ? "—" : now.deskOpen ? "Open" : `Opens ${DESK_OPEN_HOUR}:00 IST`}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
