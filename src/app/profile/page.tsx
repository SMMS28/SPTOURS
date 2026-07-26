import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { SiteFooter } from "@/components/site-footer";
import { hasSupabaseEnv } from "@/lib/env";
import { getCurrentUser, getProfileRoleByUserId } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/lib/actions/auth";
import { updateProfile } from "@/lib/actions/profile";
import { wa, inr } from "@/lib/site";

type Tab = "trips" | "saved" | "details";

type PackageRef = {
  slug: string;
  title: string;
  destination: string;
  cover_image: string | null;
  duration_days: number | null;
  price_inr: number | null;
} | null;

/** Supabase returns many-to-one embeds as an object, but the existing queries in
 *  this codebase type them as arrays. Accept either. */
const one = (value: unknown): PackageRef => {
  if (!value) return null;
  return (Array.isArray(value) ? value[0] : value) as PackageRef;
};

const FALLBACK_IMAGE = "/images/hero-bg/nilotpal-kalita-24vPDG707eM-unsplash.jpg";

const STATUS: Record<string, [string, string, string]> = {
  confirmed: ["Confirmed", "#3f7a4e", "rgba(63,122,78,0.12)"],
  pending: ["Quote sent", "#b5892f", "rgba(181,137,47,0.14)"],
  cancelled: ["Cancelled", "#6b6252", "rgba(107,98,82,0.14)"],
};

const fieldCls =
  "h-[52px] rounded-xl border-[1.5px] border-[#E0D7C4] bg-[#fdfbf6] px-4 text-[15px] transition-colors focus:border-clay focus:outline-none";

export const metadata = { title: "My account" };

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; message?: string }>;
}) {
  const params = await searchParams;
  const tab: Tab =
    params.tab === "saved" || params.tab === "details" ? params.tab : "trips";

  const user = await getCurrentUser();

  if (!user && hasSupabaseEnv) {
    redirect("/login?next=%2Fprofile");
  }

  const role = user ? await getProfileRoleByUserId(user.id) : null;

  // phone/city are optional: the fallback query above omits them when migration
  // 0007 hasn't been applied.
  let profile: {
    full_name: string | null;
    phone?: string | null;
    city?: string | null;
    created_at: string | null;
  } | null = null;
  let favorites: { id: string; packages: unknown }[] = [];
  let bookings: {
    id: string;
    booking_reference?: string | null;
    status: string;
    travel_date: string | null;
    travelers_count: number | null;
    total_amount: number | null;
    packages: unknown;
  }[] = [];

  if (user && hasSupabaseEnv) {
    const supabase = await createClient();
    const pkgCols = "slug,title,destination,cover_image,duration_days,price_inr";

    const [{ data: profileData }, { data: favoriteData }, { data: bookingData }] =
      await Promise.all([
        // phone/city arrive in migration 0007. Selecting a column that doesn't
        // exist fails the whole row, which is why the account details rendered
        // blank — fall back to the columns that have always existed.
        supabase
          .from("profiles")
          .select("full_name,phone,city,created_at")
          .eq("id", user.id)
          .maybeSingle()
          .then(async (result) => {
            if (!result.error) return result;
            return supabase
              .from("profiles")
              .select("full_name,created_at")
              .eq("id", user.id)
              .maybeSingle();
          }),
        supabase
          .from("favorites")
          .select(`id,packages(${pkgCols})`)
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(24),
        // booking_reference comes from migration 0006 and is absent on some
        // environments; without a fallback the whole trips list came back null.
        supabase
          .from("bookings")
          .select(
            `id,booking_reference,status,travel_date,travelers_count,total_amount,packages(${pkgCols})`,
          )
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(30)
          .then(async (result) => {
            if (!result.error) return result;
            return supabase
              .from("bookings")
              .select(
                `id,status,travel_date,travelers_count,total_amount,packages(${pkgCols})`,
              )
              .eq("user_id", user.id)
              .order("created_at", { ascending: false })
              .limit(30);
          }),
      ]);

    profile = profileData ?? null;
    favorites = favoriteData ?? [];
    bookings = bookingData ?? [];
  }

  const displayName = profile?.full_name?.trim() || user?.email?.split("@")[0] || "traveller";
  const firstName = displayName.split(" ")[0];
  // Two initials from a real name, else the first two characters of the email
  // local part, else the brand's own initials.
  const initialsSource = profile?.full_name?.trim();
  const emailLocal = user?.email?.split("@")[0] ?? "";
  const initials = (
    initialsSource
      ? initialsSource
          .split(/\s+/)
          .filter(Boolean)
          .slice(0, 2)
          .map((part) => part[0])
          .join("")
      : (emailLocal || "SP").slice(0, 2)
  ).toUpperCase();

  const today = new Date().toISOString().slice(0, 10);
  const upcoming = bookings.filter(
    (b) => b.status !== "cancelled" && b.travel_date && b.travel_date >= today,
  ).length;
  const memberSince = profile?.created_at
    ? new Date(profile.created_at).getFullYear()
    : null;

  const tabs: [Tab, string][] = [
    ["trips", "My trips"],
    ["saved", "Saved"],
    ["details", "Profile details"],
  ];

  return (
    <div className="flex min-h-screen flex-col">
      {/* header */}
      <header className="sticky top-0 z-50 border-b border-hairline bg-paper/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-3 lg:px-10">
          <Link href="/">
            <Image
              src="/images/logo-2026.png"
              alt="SP Tours and Travels"
              width={640}
              height={286}
              className="h-[54px] w-auto"
              priority
            />
          </Link>
          <nav className="hidden gap-8 text-[14.5px] font-semibold text-[#4c5142] md:flex">
            <Link href="/packages" className="transition-colors hover:text-clay">Journeys</Link>
            <Link href="/#promise" className="transition-colors hover:text-clay">Why us</Link>
            <Link href="/contact" className="transition-colors hover:text-clay">Contact</Link>
            {role === "admin" ? (
              <Link href="/admin" className="transition-colors hover:text-clay">Admin</Link>
            ) : null}
          </nav>
          <div className="flex items-center gap-3.5">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-clay text-sm font-bold text-paper">
              {initials}
            </span>
            <form action={signOut} data-confirm-message="Confirm logout?">
              <button type="submit" className="text-sm font-semibold text-[#4c5142]">
                Logout
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* welcome */}
      <section className="mx-auto w-full max-w-[1200px] px-6 pb-6 pt-12 lg:px-10">
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.24em] text-clay">Your account</p>
        <h1 className="font-display text-[clamp(34px,4vw,56px)] font-bold leading-none tracking-[-0.025em]">
          Welcome back, {firstName}.
        </h1>
        <div className="mt-6 flex flex-wrap gap-8 pt-2 text-sm text-mutedfg">
          <span>
            <b className="font-display text-lg text-ink">{upcoming}</b>&nbsp; upcoming{" "}
            {upcoming === 1 ? "trip" : "trips"}
          </span>
          <span>
            <b className="font-display text-lg text-ink">{favorites.length}</b>&nbsp; saved{" "}
            {favorites.length === 1 ? "journey" : "journeys"}
          </span>
          {memberSince ? (
            <span>
              <b className="font-display text-lg text-ink">Member</b>&nbsp; since {memberSince}
            </span>
          ) : null}
          {user?.email ? <span className="text-[#8a8578]">{user.email}</span> : null}
        </div>
      </section>

      {/* tabs — links rather than local state, so the save action can redirect
          back to ?tab=details and land on the right panel */}
      <div className="mx-auto w-full max-w-[1200px] px-6 lg:px-10">
        <div className="flex gap-1.5 border-b border-ink/10">
          {tabs.map(([key, label]) => (
            <Link
              key={key}
              href={`/profile?tab=${key}`}
              className="border-b-2 px-[18px] py-3.5 text-[15px] transition-colors"
              style={{
                color: tab === key ? "#17130D" : "#8a8578",
                fontWeight: tab === key ? 700 : 600,
                borderBottomColor: tab === key ? "#9B6A4C" : "transparent",
              }}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>

      <main className="mx-auto w-full max-w-[1200px] flex-1 px-6 pb-24 pt-9 lg:px-10">
        {params.message ? (
          <p className="mb-7 rounded-xl border border-clay/30 bg-clay/10 px-4 py-3 text-[13.5px] text-[#5b4636]">
            {params.message}
          </p>
        ) : null}

        {!hasSupabaseEnv ? (
          <p className="mb-7 rounded-xl border border-ink/10 bg-white px-4 py-3 text-[13.5px] text-mutedfg">
            Supabase environment variables aren&apos;t set, so this account area has no data to
            read. Add them to <code className="font-mono text-[12.5px]">.env.local</code> to see
            real trips and saved journeys.
          </p>
        ) : null}

        <div className="animate-fade-up">
          {tab === "trips" &&
            (bookings.length === 0 ? (
              <Empty
                title="No trips yet"
                body="Once you plan a journey from any package page, it shows up here with its status and paperwork."
                cta={["Browse journeys", "/packages"]}
              />
            ) : (
              <div className="flex flex-col gap-[18px]">
                {bookings.map((booking) => {
                  const pkg = one(booking.packages);
                  const [label, color, bg] =
                    STATUS[booking.status] ?? ["Pending", "#b5892f", "rgba(181,137,47,0.14)"];
                  const past = Boolean(booking.travel_date && booking.travel_date < today);
                  const meta = [
                    booking.travel_date
                      ? new Date(booking.travel_date).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })
                      : "Dates flexible",
                    booking.travelers_count
                      ? `${booking.travelers_count} ${booking.travelers_count === 1 ? "traveller" : "travellers"}`
                      : null,
                    booking.booking_reference ? `Ref ${booking.booking_reference}` : null,
                  ]
                    .filter(Boolean)
                    .join(" · ");

                  return (
                    <article
                      key={booking.id}
                      className={`grid overflow-hidden rounded-[20px] border border-ink/8 bg-white sm:grid-cols-[220px_1fr] ${past ? "opacity-90" : ""}`}
                    >
                      <div className="relative min-h-[180px]">
                        <Image
                          src={pkg?.cover_image || FALLBACK_IMAGE}
                          alt={pkg?.title ?? "Journey"}
                          fill
                          sizes="220px"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-col p-6">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.1em] text-clay">
                              {[pkg?.destination, pkg?.duration_days ? `${pkg.duration_days}D` : null]
                                .filter(Boolean)
                                .join(" · ") || "Journey"}
                            </p>
                            <h3 className="mb-1.5 font-display text-2xl font-bold">
                              {pkg?.title ?? "Package"}
                            </h3>
                            <p className="text-[13.5px] text-mutedfg">{meta}</p>
                          </div>
                          <span
                            className="whitespace-nowrap rounded-full px-3 py-[5px] text-[11.5px] font-bold"
                            style={{ color, background: bg }}
                          >
                            {label}
                          </span>
                        </div>
                        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-ink/8 pt-4">
                          <span>
                            <b className="font-display text-xl">
                              {inr(Number(booking.total_amount ?? 0))}
                            </b>
                            <span className="text-xs text-[#8a8578]"> total</span>
                          </span>
                          <div className="flex gap-2.5">
                            <a
                              href={wa(
                                `Hi SP Tours, a question about my ${pkg?.title ?? "booking"}${
                                  booking.booking_reference ? ` (Ref ${booking.booking_reference})` : ""
                                }.`,
                              )}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex h-10 items-center rounded-full border-[1.5px] border-ink/15 px-4 text-[13px] font-semibold transition-colors hover:bg-[#f3ece0]"
                            >
                              Message us
                            </a>
                            {pkg?.slug ? (
                              <Link
                                href={`/packages/${pkg.slug}`}
                                className="inline-flex h-10 items-center rounded-full bg-ink px-[18px] text-[13px] font-bold text-paper transition-colors hover:bg-clay"
                              >
                                View trip →
                              </Link>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            ))}

          {tab === "saved" &&
            (favorites.length === 0 ? (
              <Empty
                title="Nothing saved yet"
                body="Tap the heart on any journey to keep it here for later."
                cta={["Find a journey", "/packages"]}
              />
            ) : (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {favorites.map((favorite) => {
                  const pkg = one(favorite.packages);
                  if (!pkg) return null;

                  return (
                    <Link
                      key={favorite.id}
                      href={`/packages/${pkg.slug}`}
                      className="block overflow-hidden rounded-[20px] border border-ink/8 bg-white transition-transform duration-500 hover:-translate-y-2"
                    >
                      <div className="relative h-[200px] overflow-hidden">
                        <Image
                          src={pkg.cover_image || FALLBACK_IMAGE}
                          alt={pkg.title}
                          fill
                          sizes="33vw"
                          className="object-cover"
                        />
                        <span className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-paper/90 text-base text-clay">
                          ♥
                        </span>
                      </div>
                      <div className="p-5">
                        <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.1em] text-clay">
                          {[pkg.destination, pkg.duration_days ? `${pkg.duration_days}D` : null]
                            .filter(Boolean)
                            .join(" · ")}
                        </p>
                        <h4 className="mb-3 font-display text-xl font-bold">{pkg.title}</h4>
                        <div className="flex items-center justify-between border-t border-ink/10 pt-3.5">
                          <span className="font-display text-xl font-bold">
                            {inr(Number(pkg.price_inr ?? 0))}
                          </span>
                          <span className="text-[13px] font-bold text-clay">View →</span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ))}

          {tab === "details" && (
            <div className="max-w-[620px] rounded-[22px] border border-ink/8 bg-white p-[34px]">
              <h3 className="mb-[22px] font-display text-[22px] font-bold">Profile details</h3>
              <form action={updateProfile}>
                <div className="grid gap-[18px] sm:grid-cols-2">
                  <LabelledField label="Full name">
                    <input
                      name="full_name"
                      required
                      defaultValue={profile?.full_name ?? ""}
                      placeholder="Your name"
                      className={fieldCls}
                    />
                  </LabelledField>
                  <LabelledField label="Phone">
                    <input
                      name="phone"
                      type="tel"
                      defaultValue={profile?.phone ?? ""}
                      placeholder="+91 98xxx xxxxx"
                      className={fieldCls}
                    />
                  </LabelledField>
                  <LabelledField label="Email">
                    <input
                      value={user?.email ?? ""}
                      readOnly
                      disabled
                      className={`${fieldCls} cursor-not-allowed text-mutedfg`}
                    />
                  </LabelledField>
                  <LabelledField label="City">
                    <input
                      name="city"
                      defaultValue={profile?.city ?? ""}
                      placeholder="Where you travel from"
                      className={fieldCls}
                    />
                  </LabelledField>
                </div>
                <p className="mt-2.5 text-[12px] text-[#8a8578]">
                  Email is managed by your sign-in method and can&apos;t be edited here.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    type="submit"
                    className="h-[52px] rounded-xl bg-clay px-[26px] text-[15px] font-bold text-paper transition-colors hover:bg-clay-dark"
                  >
                    Save changes
                  </button>
                </div>
              </form>
              <form action={signOut} data-confirm-message="Confirm logout?" className="mt-3">
                <button
                  type="submit"
                  className="inline-flex h-[52px] items-center rounded-xl border-[1.5px] border-ink/15 px-6 text-[15px] font-semibold transition-colors hover:bg-[#f3ece0]"
                >
                  Log out
                </button>
              </form>
            </div>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

function LabelledField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[12.5px] font-semibold text-[#4c4839]">{label}</label>
      {children}
    </div>
  );
}

function Empty({
  title,
  body,
  cta,
}: {
  title: string;
  body: string;
  cta: [string, string];
}) {
  return (
    <div className="rounded-[22px] border border-ink/8 bg-white px-8 py-14 text-center">
      <h3 className="mb-2.5 font-display text-2xl font-bold">{title}</h3>
      <p className="mx-auto mb-7 max-w-[440px] text-[15px] leading-relaxed text-mutedfg">{body}</p>
      <Link
        href={cta[1]}
        className="inline-flex h-12 items-center rounded-full bg-clay px-7 text-[14.5px] font-bold text-paper transition-colors hover:bg-clay-dark"
      >
        {cta[0]} →
      </Link>
    </div>
  );
}
