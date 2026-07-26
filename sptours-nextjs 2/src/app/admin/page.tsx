"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PACKAGES, inr } from "@/lib/site";

type View = "dashboard" | "packages" | "inquiries" | "bookings" | "destinations";

const NAV: { key: View; label: string; badge?: string; badgeMuted?: boolean }[] = [
  { key: "dashboard", label: "Dashboard" },
  { key: "packages", label: "Packages" },
  { key: "inquiries", label: "Inquiries", badge: "12" },
  { key: "bookings", label: "Bookings", badge: "4", badgeMuted: true },
  { key: "destinations", label: "Destinations" },
];

const META: Record<View, [string, string]> = {
  dashboard: ["Dashboard", "Welcome back, SS Rao · Sunday, 26 July 2026"],
  packages: ["Packages", "7 published · manage tours, pricing & itineraries"],
  inquiries: ["Inquiries", "12 total · 5 awaiting first reply"],
  bookings: ["Bookings", "4 active · 2 pending confirmation"],
  destinations: ["Destinations", "8 Northeast states · manage coverage"],
};

type Status = "new" | "contacted" | "quoted" | "confirmed" | "pending" | "paid";
const BADGE: Record<Status, [string, string, string]> = {
  new: ["#9B6A4C", "rgba(155,106,76,0.12)", "New"],
  contacted: ["#4a5b74", "rgba(74,91,116,0.12)", "Contacted"],
  quoted: ["#3f7a4e", "rgba(63,122,78,0.12)", "Quoted"],
  confirmed: ["#3f7a4e", "rgba(63,122,78,0.12)", "Confirmed"],
  pending: ["#b5892f", "rgba(181,137,47,0.14)", "Pending"],
  paid: ["#3f7a4e", "rgba(63,122,78,0.12)", "Paid"],
};

function Badge({ s }: { s: Status }) {
  const [c, bg, label] = BADGE[s];
  return <span className="rounded-full px-[11px] py-1 text-[11.5px] font-bold" style={{ color: c, background: bg }}>{label}</span>;
}

function CountUp({ to, decimals = 0, className }: { to: number; decimals?: number; className?: string }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / 1200, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setN(to * e);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to]);
  return <span className={className}>{decimals ? n.toFixed(decimals) : Math.round(n).toLocaleString("en-IN")}</span>;
}

const INQUIRIES: [string, string, string, string, Status][] = [
  ["Ananya Sharma", "+91 98xxx 20114", "Meghalaya Explorer", "26 Jul", "new"],
  ["Imran Qureshi", "+91 99xxx 55710", "Discovering Arunachal", "26 Jul", "new"],
  ["Meera Iyer", "+91 90xxx 33420", "The Grand Circuit", "25 Jul", "new"],
  ["Sahil Gupta", "+91 70xxx 88190", "North Sikkim", "25 Jul", "new"],
  ["Divya P.", "+91 80xxx 12093", "Sikkim Getaway · Yumthang", "25 Jul", "new"],
  ["Rohit Verma", "+91 98xxx 76321", "The Grand Circuit", "24 Jul", "contacted"],
  ["Kavya Rao", "+91 91xxx 44502", "Gangtok & Darjeeling", "24 Jul", "contacted"],
  ["T. Baruah", "+91 87xxx 66120", "Meghalaya Explorer", "23 Jul", "contacted"],
  ["N. Sethi", "+91 96xxx 71234", "Arunachal Classic — Tawang", "23 Jul", "contacted"],
  ["Priya Nair", "+91 90xxx 55009", "Highlights of North Sikkim", "22 Jul", "quoted"],
  ["G. Reddy", "+91 99xxx 10456", "The Grand Circuit", "22 Jul", "quoted"],
  ["L. Fernandes", "+91 82xxx 39871", "Gangtok & Darjeeling", "21 Jul", "quoted"],
];

const BOOKINGS: [string, string, string, string, Status][] = [
  ["Rhea & Harsh", "Meghalaya Explorer", "2 pax", "₹39,998", "confirmed"],
  ["Nitin Kapoor", "The Grand Circuit", "2 pax", "₹1,15,998", "pending"],
  ["S. Menon", "Highlights of North Sikkim", "4 pax", "₹89,996", "paid"],
  ["A. Das", "Sikkim Getaway · Yumthang", "2 pax", "₹41,598", "pending"],
];

const BARS = [36, 62, 28, 80, 54, 100, 72];
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const TOP = [["The Grand Circuit", 82, "31%"], ["Meghalaya Explorer", 64, "24%"], ["North Sikkim", 50, "19%"], ["Discovering Arunachal", 37, "14%"]] as const;

const DEST = [
  ["Sikkim", 3, "/images/northeast/north-sikkim-highlights-6d5n-1.jpg"],
  ["Arunachal Pradesh", 3, "/images/northeast/discovering-arunachal-pradesh-7d6n-1.jpg"],
  ["Meghalaya", 2, "/images/northeast/meghalaya-shillong-cherrapunjee-mawlynnong-5d4n-1.jpg"],
  ["Assam", 1, "/images/hero-bg/nilotpal-kalita-24vPDG707eM-unsplash.jpg"],
  ["Nagaland", 0, "/images/hero-bg/pexels-vijit-bagh-3435480-5414576.jpg"],
  ["Manipur", 0, "/images/hero-bg/pexels-logalongwithme-6058267.jpg"],
  ["Mizoram", 0, "/images/hero-bg/pexels-xperimental-1043292.jpg"],
  ["Tripura", 0, "/images/hero-bg/pexels-chunry-6538013.jpg"],
] as const;

const th = "px-4 py-3.5 text-left font-normal";
const cellName = "px-6 py-[15px] text-[14px] font-semibold";

export default function AdminPage() {
  const [view, setView] = useState<View>("dashboard");
  const [inqTab, setInqTab] = useState<"all" | Status>("all");
  const shownInq = INQUIRIES.filter((r) => inqTab === "all" || r[4] === inqTab);

  return (
    <div className="flex min-h-screen bg-[#EFEADF]">
      {/* sidebar */}
      <aside className="sticky top-0 flex h-screen w-[262px] shrink-0 flex-col bg-inkdeep text-paper/70">
        <div className="px-[22px] pb-[18px] pt-[22px]">
          <span className="inline-flex rounded-[10px] bg-paper px-3 py-2"><Image src="/images/logo-2026.png" alt="SP Tours" width={170} height={64} className="h-[34px] w-auto" /></span>
        </div>
        <nav className="flex flex-col gap-1 px-3.5 py-2">
          {NAV.map((n) => {
            const on = view === n.key;
            return (
              <button
                key={n.key}
                type="button"
                onClick={() => setView(n.key)}
                className="flex items-center gap-3 rounded-[10px] border-l-2 px-3.5 py-3 text-left text-[14.5px] font-semibold transition-colors"
                style={{ background: on ? "rgba(155,106,76,0.18)" : "transparent", color: on ? "#F5F0E6" : "rgba(245,240,230,0.7)", borderLeftColor: on ? "#9B6A4C" : "transparent" }}
              >
                <span className="h-[7px] w-[7px] rounded-sm bg-current opacity-50" />
                {n.label}
                {n.badge ? <span className={`ml-auto rounded-full px-2 py-0.5 text-[11px] font-bold ${n.badgeMuted ? "bg-paper/15 text-paper/80" : "bg-clay text-paper"}`}>{n.badge}</span> : null}
              </button>
            );
          })}
        </nav>
        <div className="mt-auto border-t border-paper/12 px-[18px] py-4">
          <Link href="/" className="flex items-center gap-2 py-2 text-[13px] text-paper/60 transition-colors hover:text-paper">↗ View live site</Link>
          <div className="mt-2.5 flex items-center gap-2.5 border-t border-paper/10 pt-3">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-clay text-sm font-bold text-paper">SR</span>
            <div className="leading-tight"><p className="text-[13.5px] font-semibold text-paper">S S Rao</p><p className="text-[11.5px] text-paper/50">Administrator</p></div>
          </div>
        </div>
      </aside>

      {/* main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex items-center justify-between gap-5 border-b border-hairline bg-[#EFEADF]/85 px-[34px] py-4 backdrop-blur-md">
          <div>
            <h1 className="font-display text-2xl font-bold tracking-[-0.01em]">{META[view][0]}</h1>
            <p className="mt-1 font-mono text-[11.5px] text-[#8a8578]">{META[view][1]}</p>
          </div>
          <div className="flex items-center gap-3.5">
            <div className="hidden min-w-[220px] items-center gap-2 rounded-full border border-ink/10 bg-white px-3.5 py-2.5 md:flex">
              <span className="text-sm text-[#a49d8c]">⌕</span>
              <input className="w-full bg-transparent text-[13.5px] text-ink outline-none" placeholder="Search packages, inquiries…" />
            </div>
            <button type="button" className="h-[42px] rounded-full bg-clay px-[18px] text-[13.5px] font-bold text-paper transition-colors hover:bg-clay-dark">+ New package</button>
          </div>
        </header>

        <main className="flex-1 px-[34px] pb-16 pt-[30px]">
          <motion.div key={view} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>

            {view === "dashboard" && (
              <>
                <div className="mb-[22px] grid grid-cols-2 gap-[18px] lg:grid-cols-4">
                  <StatCard label="Published packages" value={<CountUp to={7} />} note="↑ all live & bookable" noteColor="#3f7a4e" />
                  <StatCard label="New inquiries" value={<CountUp to={12} />} note="5 awaiting first reply" noteColor="#9B6A4C" />
                  <StatCard label="Pending bookings" value={<CountUp to={4} />} note="2 need confirmation today" noteColor="#b5892f" />
                  <div className="rounded-[18px] bg-inkdeep p-[22px] text-paper">
                    <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.1em] text-paper/60">Revenue · 30 days</p>
                    <p className="font-display text-[38px] font-bold leading-none text-[#E3B98A]">₹<CountUp to={8.4} decimals={1} />L</p>
                    <p className="mt-2.5 text-[12.5px] font-semibold text-paper/70">↑ 18% vs last month</p>
                  </div>
                </div>

                <div className="mb-[22px] grid gap-[18px] lg:grid-cols-[1.5fr_1fr]">
                  <div className="rounded-[18px] border border-ink/8 bg-white p-6">
                    <div className="mb-[22px] flex items-center justify-between">
                      <h3 className="font-display text-[17px] font-bold">Inquiries · last 7 days</h3>
                      <span className="font-mono text-xs text-[#8a8578]">48 total</span>
                    </div>
                    <div className="flex h-[180px] items-end justify-between gap-3">
                      {BARS.map((h, i) => (
                        <div key={i} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                          <motion.div initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 0.7, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }} className="w-full origin-bottom rounded-t-lg bg-[linear-gradient(#B98A64,#9B6A4C)]" style={{ height: `${h}%` }} />
                          <span className="font-mono text-[11px] text-[#8a8578]">{DAYS[i]}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-[18px] border border-ink/8 bg-white p-6">
                    <h3 className="mb-5 font-display text-[17px] font-bold">Top packages this month</h3>
                    <div className="flex flex-col gap-4">
                      {TOP.map(([name, w, pct], i) => (
                        <div key={name}>
                          <div className="mb-[7px] flex justify-between text-[13.5px]"><span className="font-semibold">{name}</span><span className="text-[#8a8578]">{pct}</span></div>
                          <div className="h-[7px] overflow-hidden rounded-full bg-[#EFE8DA]">
                            <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.8, delay: 0.1 + i * 0.09, ease: [0.22, 1, 0.36, 1] }} className="h-full origin-left rounded-full bg-clay" style={{ width: `${w}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <Panel>
                  <div className="flex items-center justify-between border-b border-ink/8 px-6 py-5">
                    <h3 className="font-display text-[17px] font-bold">Recent inquiries</h3>
                    <button type="button" onClick={() => setView("inquiries")} className="text-[13px] font-bold text-clay">View all →</button>
                  </div>
                  <table className="w-full border-collapse">
                    <thead><tr className="font-mono text-[11px] uppercase tracking-[0.06em] text-[#8a8578]"><th className={th + " px-6"}>Traveller</th><th className={th}>Package</th><th className={th}>When</th><th className={th + " px-6"}>Status</th></tr></thead>
                    <tbody>
                      {INQUIRIES.slice(0, 5).map((r) => (
                        <tr key={r[0]} className="border-t border-ink/[0.06] transition-colors hover:bg-[#F7F3EA]">
                          <td className={cellName}>{r[0]}</td>
                          <td className="px-4 py-[15px] text-[13.5px] text-[#5b5749]">{r[2]}</td>
                          <td className="px-4 py-[15px] text-[13px] text-[#8a8578]">{r[3]}</td>
                          <td className="px-6 py-[15px]"><Badge s={r[4]} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Panel>
              </>
            )}

            {view === "packages" && (
              <Panel>
                <div className="flex items-center justify-between border-b border-ink/8 px-6 py-5">
                  <h3 className="font-display text-[17px] font-bold">All packages · 7</h3>
                  <button type="button" className="h-[38px] rounded-full bg-clay px-4 text-[13px] font-bold text-paper">+ New package</button>
                </div>
                <table className="w-full border-collapse">
                  <thead><tr className="font-mono text-[11px] uppercase tracking-[0.06em] text-[#8a8578]"><th className={th + " px-6"}>Package</th><th className={th}>Region</th><th className={th}>Duration</th><th className={th}>Price</th><th className={th}>Status</th><th className={th + " px-6"} /></tr></thead>
                  <tbody>
                    {PACKAGES.map((p) => (
                      <tr key={p.slug} className="border-t border-ink/[0.06] transition-colors hover:bg-[#F7F3EA]">
                        <td className="px-6 py-3"><div className="flex items-center gap-3"><span className="relative block h-10 w-[52px] overflow-hidden rounded-lg"><Image src={p.image} alt="" fill sizes="52px" className="object-cover" /></span><span className="text-[14px] font-semibold">{p.title}</span></div></td>
                        <td className="px-4 py-3 text-[13.5px] text-[#5b5749]">{p.region}</td>
                        <td className="px-4 py-3 text-[13.5px] text-[#5b5749]">{p.duration}</td>
                        <td className="px-4 py-3 font-display font-bold">{inr(p.price)}</td>
                        <td className="px-4 py-3"><Badge s="confirmed" /></td>
                        <td className="whitespace-nowrap px-6 py-3 text-right">
                          <button type="button" className="mr-1.5 rounded-lg border border-ink/15 bg-white px-3 py-1.5 text-[12.5px] font-semibold">Edit</button>
                          <button type="button" className="rounded-lg border border-ink/15 bg-white px-2.5 py-1.5 text-[12.5px] text-[#a44]">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Panel>
            )}

            {view === "inquiries" && (
              <Panel>
                <div className="flex flex-wrap items-center gap-2.5 border-b border-ink/8 px-6 py-[18px]">
                  {([["all", "All · 12"], ["new", "New · 5"], ["contacted", "Contacted · 4"], ["quoted", "Quoted · 3"]] as const).map(([k, l]) => (
                    <button key={k} type="button" onClick={() => setInqTab(k)} className="rounded-full px-3.5 py-2 text-[13px] transition-colors" style={{ background: inqTab === k ? "#17130D" : "transparent", color: inqTab === k ? "#F5F0E6" : "#17130D", fontWeight: inqTab === k ? 700 : 600 }}>{l}</button>
                  ))}
                </div>
                <table className="w-full border-collapse">
                  <thead><tr className="font-mono text-[11px] uppercase tracking-[0.06em] text-[#8a8578]"><th className={th + " px-6"}>Traveller</th><th className={th}>Contact</th><th className={th}>Package</th><th className={th}>Date</th><th className={th}>Status</th><th className={th + " px-6"} /></tr></thead>
                  <tbody>
                    {shownInq.map((r) => (
                      <tr key={r[0]} className="border-t border-ink/[0.06] transition-colors hover:bg-[#F7F3EA]">
                        <td className={cellName}>{r[0]}</td>
                        <td className="px-4 py-3.5 font-mono text-[13px] text-[#8a8578]">{r[1]}</td>
                        <td className="px-4 py-3.5 text-[13.5px] text-[#5b5749]">{r[2]}</td>
                        <td className="px-4 py-3.5 text-[13px] text-[#8a8578]">{r[3]}</td>
                        <td className="px-4 py-3.5"><Badge s={r[4]} /></td>
                        <td className="px-6 py-3.5 text-right"><a href="https://wa.me/919247777996" target="_blank" rel="noopener noreferrer" className="rounded-lg border border-ink/15 px-3 py-1.5 text-[12.5px] font-semibold">Reply</a></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Panel>
            )}

            {view === "bookings" && (
              <Panel>
                <div className="border-b border-ink/8 px-6 py-5"><h3 className="font-display text-[17px] font-bold">Bookings · 4</h3></div>
                <table className="w-full border-collapse">
                  <thead><tr className="font-mono text-[11px] uppercase tracking-[0.06em] text-[#8a8578]"><th className={th + " px-6"}>Customer</th><th className={th}>Package</th><th className={th}>Travellers</th><th className={th}>Amount</th><th className={th + " px-6"}>Status</th></tr></thead>
                  <tbody>
                    {BOOKINGS.map((r) => (
                      <tr key={r[0]} className="border-t border-ink/[0.06] transition-colors hover:bg-[#F7F3EA]">
                        <td className={cellName}>{r[0]}</td>
                        <td className="px-4 py-[15px] text-[13.5px] text-[#5b5749]">{r[1]}</td>
                        <td className="px-4 py-[15px] text-[13.5px] text-[#5b5749]">{r[2]}</td>
                        <td className="px-4 py-[15px] font-display font-bold">{r[3]}</td>
                        <td className="px-6 py-[15px]"><Badge s={r[4]} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Panel>
            )}

            {view === "destinations" && (
              <div className="grid grid-cols-2 gap-[18px] lg:grid-cols-4">
                {DEST.map(([name, count, img]) => (
                  <div key={name} className="overflow-hidden rounded-2xl border border-ink/8 bg-white">
                    <div className="relative h-[110px] overflow-hidden"><Image src={img as string} alt="" fill sizes="25vw" className="object-cover" /></div>
                    <div className="p-4">
                      <p className="mb-1 font-display text-base font-bold">{name}</p>
                      <p className="mb-3.5 text-[12.5px] text-[#8a8578]">{count} {count === 1 ? "package" : "packages"}</p>
                      <button type="button" className="w-full rounded-lg border border-ink/15 bg-white py-2 text-[12.5px] font-semibold">Manage</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </motion.div>
        </main>
      </div>
    </div>
  );
}

function Panel({ children }: { children: React.ReactNode }) {
  return <div className="overflow-hidden rounded-[18px] border border-ink/8 bg-white">{children}</div>;
}

function StatCard({ label, value, note, noteColor }: { label: string; value: React.ReactNode; note: string; noteColor: string }) {
  return (
    <div className="rounded-[18px] border border-ink/8 bg-white p-[22px]">
      <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.1em] text-[#8a8578]">{label}</p>
      <p className="font-display text-[38px] font-bold leading-none">{value}</p>
      <p className="mt-2.5 text-[12.5px] font-semibold" style={{ color: noteColor }}>{note}</p>
    </div>
  );
}
