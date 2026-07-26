import Link from "next/link";
import Image from "next/image";
import { getAdminStats } from "@/lib/data/admin-stats";
import { getCurrentUser, getProfileRoleByUserId } from "@/lib/auth";
import { inr } from "@/lib/site";

/**
 * Admin overview.
 *
 * Server component reading real figures via getAdminStats(). The redesign shipped
 * this as a client component with hardcoded sample data (invented inquirer names
 * and phone numbers, a fixed revenue figure, a static chart) and in-page tabs that
 * duplicated the CRUD screens. The sidebar now links to those real screens rather
 * than maintaining a second, fake copy of each table.
 */

const STATUS_STYLE: Record<string, [string, string, string]> = {
  new: ["#9B6A4C", "rgba(155,106,76,0.12)", "New"],
  in_progress: ["#4a5b74", "rgba(74,91,116,0.12)", "In progress"],
  closed: ["#6b6252", "rgba(107,98,82,0.14)", "Closed"],
  pending: ["#b5892f", "rgba(181,137,47,0.14)", "Pending"],
  confirmed: ["#3f7a4e", "rgba(63,122,78,0.12)", "Confirmed"],
  cancelled: ["#8a8578", "rgba(138,133,120,0.14)", "Cancelled"],
};

function Badge({ status }: { status: string }) {
  const [color, background, label] = STATUS_STYLE[status] ?? [
    "#6b6252",
    "rgba(107,98,82,0.14)",
    status,
  ];
  return (
    <span
      className="rounded-full px-[11px] py-1 text-[12px] sm:text-[11.5px] font-bold"
      style={{ color, background }}
    >
      {label}
    </span>
  );
}

const NAV: { label: string; href: string; badge?: number }[] = [
  { label: "Dashboard", href: "/admin" },
  { label: "Packages", href: "/admin/packages" },
  { label: "Inquiries", href: "/admin/inquiries" },
  { label: "Bookings", href: "/admin/bookings" },
  { label: "Destinations", href: "/admin/destinations" },
];

const th = "px-4 py-3.5 text-left font-normal";

export default async function AdminPage() {
  const [stats, user] = await Promise.all([getAdminStats(), getCurrentUser()]);
  const role = user ? await getProfileRoleByUserId(user.id) : null;

  const nav = NAV.map((item) => ({
    ...item,
    badge:
      item.label === "Inquiries"
        ? stats.newInquiries
        : item.label === "Bookings"
          ? stats.pendingBookings
          : undefined,
  }));

  const initials =
    (user?.email ?? "SP").split(/[@.]/)[0].slice(0, 2).toUpperCase() || "SP";
  const chartMax = Math.max(1, ...stats.inquiriesByDay.map((d) => d.count));

  return (
    <div className="flex min-h-screen bg-[#EFEADF]">
      {/* sidebar */}
      <aside className="sticky top-0 flex h-screen w-[262px] shrink-0 flex-col bg-inkdeep text-paper/70">
        <div className="px-[22px] pb-[18px] pt-[22px]">
          <span className="inline-flex rounded-[10px] bg-paper px-3 py-2">
            <Image
              src="/images/logo-2026.png"
              alt="SP Tours"
              width={640}
              height={286}
              className="h-[44px] w-auto"
            />
          </span>
        </div>
        <nav className="flex flex-col gap-1 px-3.5 py-2">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-[10px] border-l-2 border-transparent px-3.5 py-3 text-left text-[14.5px] font-semibold text-paper/70 transition-colors hover:bg-paper/5 hover:text-paper"
            >
              <span className="h-[7px] w-[7px] rounded-sm bg-current opacity-50" />
              {item.label}
              {item.badge ? (
                <span className="ml-auto rounded-full bg-clay px-2 py-0.5 text-[12px] sm:text-[11px] font-bold text-paper">
                  {item.badge}
                </span>
              ) : null}
            </Link>
          ))}
        </nav>
        <div className="mt-auto border-t border-paper/12 px-[18px] py-4">
          <Link
            href="/"
            className="flex items-center gap-2 py-2 text-[13px] text-paper/60 transition-colors hover:text-paper"
          >
            ↗ View live site
          </Link>
          <div className="mt-2.5 flex items-center gap-2.5 border-t border-paper/10 pt-3">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-clay text-sm font-bold text-paper">
              {initials}
            </span>
            <div className="leading-tight">
              <p className="text-[13.5px] font-semibold text-paper">{user?.email ?? "Not signed in"}</p>
              <p className="text-[12px] sm:text-[11.5px] text-paper/50">{role === "admin" ? "Administrator" : "—"}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex items-center justify-between gap-5 border-b border-hairline bg-[#EFEADF]/85 px-[34px] py-4 backdrop-blur-md">
          <div>
            <h1 className="font-display text-2xl font-bold tracking-[-0.01em]">Dashboard</h1>
            <p className="mt-1 font-mono text-[12px] sm:text-[11.5px] text-[#8a8578]">
              {stats.publishedPackages} published · {stats.totalInquiries} inquiries ·{" "}
              {stats.totalBookings} bookings
            </p>
          </div>
          <Link
            href="/admin/packages/new"
            className="inline-flex h-11 items-center rounded-full bg-clay px-5 text-sm font-bold text-paper transition-colors hover:bg-clay-dark"
          >
            + New package
          </Link>
        </header>

        <div className="px-[34px] py-7">
          {!stats.available ? (
            <p className="mb-7 rounded-xl border border-clay/30 bg-clay/10 px-4 py-3 text-[13.5px] text-[#5b4636]">
              Live figures are unavailable — Supabase env vars aren&apos;t configured for this
              environment, so everything below reads zero rather than showing sample data.
            </p>
          ) : null}

          {/* stat cards */}
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <Stat label="Published packages" value={String(stats.publishedPackages)}
              note={`${stats.totalPackages} total incl. drafts`} />
            <Stat label="Inquiries" value={String(stats.totalInquiries)}
              note={`${stats.newInquiries} awaiting first reply`} />
            <Stat label="Bookings" value={String(stats.totalBookings)}
              note={`${stats.pendingBookings} pending confirmation`} />
            <Stat
              dark
              label="Confirmed revenue · 30 days"
              value={inr(stats.confirmedRevenue30d)}
              note="Confirmed bookings only"
            />
          </div>

          {/* chart + top packages */}
          <div className="mt-6 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
            <div className="rounded-[18px] border border-ink/8 bg-white p-6">
              <div className="mb-5 flex items-baseline justify-between">
                <h2 className="font-display text-lg font-bold">Inquiries · last 7 days</h2>
                <span className="font-mono text-[12px] text-[#8a8578]">
                  {stats.inquiriesByDay.reduce((a, b) => a + b.count, 0)} total
                </span>
              </div>
              {stats.inquiriesByDay.length > 0 ? (
                <div className="flex h-[200px] items-end gap-3">
                  {stats.inquiriesByDay.map((day) => (
                    <div key={day.label} className="flex flex-1 flex-col items-center gap-2">
                      <span className="font-mono text-[12px] sm:text-[11px] text-[#8a8578]">{day.count || ""}</span>
                      <div
                        className="w-full rounded-t-[6px]"
                        style={{
                          height: `${Math.max((day.count / chartMax) * 160, day.count > 0 ? 6 : 2)}px`,
                          background: "linear-gradient(180deg,#b98c6b 0%,#9B6A4C 100%)",
                        }}
                      />
                      <span className="text-[12px] text-[#8a8578]">{day.label}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="py-12 text-center text-[14px] text-mutedfg">No inquiries yet.</p>
              )}
            </div>

            <div className="rounded-[18px] border border-ink/8 bg-white p-6">
              <h2 className="mb-5 font-display text-lg font-bold">Top packages · 30 days</h2>
              {stats.topPackages.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {stats.topPackages.map((pkg) => (
                    <div key={pkg.title}>
                      <div className="mb-1.5 flex items-baseline justify-between text-[14px]">
                        <span className="font-semibold">{pkg.title}</span>
                        <span className="text-[#8a8578]">{pkg.pct}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-[#efe8da]">
                        <div className="h-full rounded-full bg-clay" style={{ width: `${pkg.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="py-10 text-center text-[14px] text-mutedfg">
                  No package-linked inquiries in the last 30 days.
                </p>
              )}
            </div>
          </div>

          {/* recent inquiries */}
          <div className="mt-6 overflow-hidden rounded-[18px] border border-ink/8 bg-white">
            <div className="flex items-center justify-between px-6 py-[18px]">
              <h2 className="font-display text-lg font-bold">Recent inquiries</h2>
              <Link href="/admin/inquiries" className="text-[13px] font-bold text-clay">
                View all →
              </Link>
            </div>
            {stats.recentInquiries.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-[13.5px]">
                  <thead className="bg-[#f7f2e8] font-mono text-[12px] sm:text-[11px] uppercase tracking-[0.1em] text-[#8a8578]">
                    <tr>
                      <th className={th}>Traveller</th>
                      <th className={th}>Contact</th>
                      <th className={th}>Package</th>
                      <th className={th}>Location</th>
                      <th className={th}>When</th>
                      <th className={th}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentInquiries.map((row) => (
                      <tr key={row.id} className="border-t border-ink/8">
                        <td className="px-4 py-[15px] font-semibold">{row.fullName}</td>
                        <td className="px-4 py-[15px] text-mutedfg">{row.contact}</td>
                        <td className="px-4 py-[15px] text-mutedfg">{row.packageTitle ?? "General"}</td>
                        <td className="px-4 py-[15px]">
                          {row.latitude !== null && row.longitude !== null ? (
                            <a
                              href={`https://www.google.com/maps?q=${row.latitude},${row.longitude}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-semibold text-clay"
                              title={
                                row.locationAccuracyM
                                  ? `Shared by the visitor · ±${Math.round(row.locationAccuracyM)}m`
                                  : "Shared by the visitor"
                              }
                            >
                              Map ↗
                            </a>
                          ) : (
                            <span className="text-[#b6b0a2]">—</span>
                          )}
                        </td>
                        <td className="px-4 py-[15px] text-mutedfg">
                          {row.createdAt
                            ? new Date(row.createdAt).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                              })
                            : "—"}
                        </td>
                        <td className="px-4 py-[15px]"><Badge status={row.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="px-6 pb-8 text-[14px] text-mutedfg">
                No inquiries yet. They arrive here from the contact form.
              </p>
            )}
          </div>

          {/* recent bookings */}
          <div className="mt-6 mb-4 overflow-hidden rounded-[18px] border border-ink/8 bg-white">
            <div className="flex items-center justify-between px-6 py-[18px]">
              <h2 className="font-display text-lg font-bold">Recent bookings</h2>
              <Link href="/admin/bookings" className="text-[13px] font-bold text-clay">
                View all →
              </Link>
            </div>
            {stats.recentBookings.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-[13.5px]">
                  <thead className="bg-[#f7f2e8] font-mono text-[12px] sm:text-[11px] uppercase tracking-[0.1em] text-[#8a8578]">
                    <tr>
                      <th className={th}>Reference</th>
                      <th className={th}>Package</th>
                      <th className={th}>Travellers</th>
                      <th className={th}>Amount</th>
                      <th className={th}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentBookings.map((row) => (
                      <tr key={row.id} className="border-t border-ink/8">
                        <td className="px-4 py-[15px] font-mono text-[12.5px]">{row.reference ?? "—"}</td>
                        <td className="px-4 py-[15px] font-semibold">{row.packageTitle ?? "—"}</td>
                        <td className="px-4 py-[15px] text-mutedfg">{row.travellers ?? "—"}</td>
                        <td className="px-4 py-[15px]">{inr(row.amount)}</td>
                        <td className="px-4 py-[15px]"><Badge status={row.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="px-6 pb-8 text-[14px] text-mutedfg">
                No bookings yet. They arrive from the planner on each package page.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  note,
  dark,
}: {
  label: string;
  value: string;
  note: string;
  dark?: boolean;
}) {
  return (
    <div
      className={`rounded-[18px] border p-6 ${
        dark ? "border-inkdeep bg-inkdeep text-paper" : "border-ink/8 bg-white"
      }`}
    >
      <p
        className={`mb-3 font-mono text-[12px] sm:text-[11px] uppercase tracking-[0.12em] ${
          dark ? "text-paper/60" : "text-[#8a8578]"
        }`}
      >
        {label}
      </p>
      <p className={`font-display text-[34px] font-bold leading-none ${dark ? "text-clay-tint" : ""}`}>
        {value}
      </p>
      <p className={`mt-3 text-[12.5px] ${dark ? "text-paper/60" : "text-[#8a8578]"}`}>{note}</p>
    </div>
  );
}
