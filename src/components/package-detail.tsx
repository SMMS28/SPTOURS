"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { motion, type Variants } from "framer-motion";
import { wa, PHONE_TEL } from "@/lib/site";
import type { PackageView } from "@/lib/packages-view";
import { createBookingFromPlanner } from "@/lib/actions/bookings";
import { toggleFavoritePackage } from "@/lib/actions/favorites";
import { LocationConsent } from "@/components/location-consent";

const reveal: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

const EXCLUDES = [
  "Flights to / from Guwahati",
  "Lunch & dinner",
  "Monument & camera fees",
  "Personal expenses & tips",
];

const BOOKING_NOTICE: Record<string, string> = {
  sent: "Booking request received — we'll confirm your dates shortly.",
  invalid: "Please check the highlighted details and try again.",
  invalid_package: "That package is no longer available to book.",
  error: "Something went wrong saving your request. Please reach us on WhatsApp.",
};

const SAVED_NOTICE: Record<string, string> = {
  added: "Saved to your account.",
  removed: "Removed from your saved journeys.",
  disabled: "Saving needs Supabase to be configured.",
};

const field =
  "h-[46px] w-full rounded-xl border-[1.5px] border-[#E0D7C4] bg-white px-3.5 text-[14px] text-ink transition-colors focus:border-clay focus:outline-none";
const lbl = "text-[11.5px] font-semibold text-[#4c4839]";

type Props = {
  pkg: PackageView;
  description?: string | null;
  itinerary: { day: number; title: string; detail: string }[];
  related: PackageView[];
  gallery: string[];
  isSaved: boolean;
  /** Passed from the server so the date input's min doesn't cause hydration drift. */
  todayIso: string;
  booking?: string;
  saved?: string;
  signedIn: boolean;
};

export function PackageDetail({
  pkg,
  description,
  itinerary,
  related,
  gallery,
  isSaved,
  todayIso,
  booking,
  saved,
  signedIn,
}: Props) {
  const [open, setOpen] = useState(0);

  const enquire = wa(`Hi SP Tours, I'm interested in ${pkg.title} (${pkg.duration}).`);
  const notice = (booking && BOOKING_NOTICE[booking]) || (saved && SAVED_NOTICE[saved]) || undefined;

  return (
    <div>
      {/* hero */}
      <section className="relative h-[640px] overflow-hidden bg-inkdeep">
        <div
          className="animate-kb absolute inset-0 bg-cover bg-[center_45%]"
          style={{ backgroundImage: `url('${pkg.image}')` }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,17,11,0.55)_0%,rgba(20,17,11,0.25)_40%,rgba(20,17,11,0.86)_100%)]" />
        <div className="absolute inset-x-0 bottom-12">
          <div className="mx-auto max-w-[1360px] px-6 lg:px-10">
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.22em] text-paper/75">
              <Link href="/" className="hover:text-paper">Home</Link> /{" "}
              <Link href="/packages" className="hover:text-paper">Journeys</Link> / {pkg.title}
            </p>
            <div className="mb-4 flex flex-wrap items-center gap-3">
              {pkg.tag ? (
                <span className="rounded-full bg-paper px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-wider text-inkdeep">
                  {pkg.tag}
                </span>
              ) : null}
              <span className="rounded-full border border-paper/30 bg-paper/15 px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-wider text-paper">
                {pkg.region}
              </span>
              {pkg.bookable ? (
                <form action={toggleFavoritePackage}>
                  <input type="hidden" name="packageId" value={pkg.id} />
                  <input type="hidden" name="packageSlug" value={pkg.slug} />
                  <input type="hidden" name="nextPath" value={`/packages/${pkg.slug}`} />
                  <button
                    type="submit"
                    aria-pressed={isSaved}
                    className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-colors ${
                      isSaved
                        ? "border-clay bg-clay text-paper"
                        : "border-paper/30 bg-paper/15 text-paper hover:bg-paper/25"
                    }`}
                  >
                    {isSaved ? "♥ Saved" : "♡ Save"}
                  </button>
                </form>
              ) : null}
            </div>
            <h1 className="max-w-[900px] font-display text-[clamp(44px,6.4vw,90px)] font-bold leading-[0.95] tracking-[-0.028em] text-paper">
              {pkg.title}
            </h1>
            <div className="mt-6 flex flex-wrap gap-7 text-[15px] text-paper">
              <span><span className="text-paper/65">Duration</span>&nbsp; {pkg.duration}</span>
              <span><span className="text-paper/65">Region</span>&nbsp; {pkg.region}</span>
              <span>
                <span className="text-paper/65">From</span>&nbsp;
                <b className="font-display text-lg">{pkg.priceLabel}</b>{pkg.hasPrice ? " /person" : ""}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* body */}
      <section className="mx-auto grid max-w-[1360px] grid-cols-1 items-start gap-[60px] px-6 pb-10 pt-[70px] lg:grid-cols-[minmax(0,1fr)_380px] lg:px-10">
        <div>
          {notice ? (
            <p className="mb-8 rounded-xl border border-clay/30 bg-clay/10 px-4 py-3 text-[14px] text-[#5b4636]">
              {notice}
            </p>
          ) : null}

          <motion.div variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-8%" }}>
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-clay">Overview</p>
            {pkg.blurb ? (
              <p className="mb-5 text-[clamp(19px,1.7vw,24px)] font-medium leading-[1.5] tracking-[-0.01em]">
                {pkg.blurb}
              </p>
            ) : null}
            <p className="whitespace-pre-line text-base leading-[1.7] text-[#5b5749]">
              {description?.trim() ||
                "One vehicle, one team, every permit and stay handled. You travel; we take care of the rest — exactly the way we've run the Northeast since 1986."}
            </p>
          </motion.div>

          {/* gallery */}
          {gallery.length > 0 ? (
            <motion.div
              variants={reveal}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-8%" }}
              className="mt-10 grid grid-cols-[2fr_1fr_1fr] gap-3"
            >
              {gallery.slice(0, 3).map((src, i) => (
                <div key={`${src}-${i}`} className="relative h-[260px] overflow-hidden rounded-2xl">
                  <Image src={src} alt="" fill sizes={i === 0 ? "50vw" : "25vw"} className="object-cover" />
                  {i === 2 && gallery.length > 3 ? (
                    <div className="absolute inset-0 grid place-items-center bg-inkdeep/45 font-mono text-[13px] text-paper">
                      + {gallery.length - 3} photos
                    </div>
                  ) : null}
                </div>
              ))}
            </motion.div>
          ) : null}

          {/* itinerary */}
          {itinerary.length > 0 ? (
            <div className="mt-16">
              <motion.div variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true }} className="mb-[34px]">
                <p className="mb-3.5 font-mono text-xs uppercase tracking-[0.3em] text-clay">Day by day</p>
                <h2 className="font-display text-[clamp(30px,3.4vw,46px)] font-bold tracking-[-0.02em]">
                  The full itinerary
                </h2>
              </motion.div>
              <div>
                {itinerary.map((d, i) => {
                  const isOpen = open === i;
                  return (
                    <div
                      key={`${d.day}-${i}`}
                      className={`cursor-pointer border-t border-hairline py-[22px] ${i === itinerary.length - 1 ? "border-b" : ""}`}
                      onClick={() => setOpen(isOpen ? -1 : i)}
                    >
                      <div className="flex items-center gap-[22px]">
                        <span className="w-[54px] shrink-0 font-mono text-xs text-clay">
                          DAY {String(d.day).padStart(2, "0")}
                        </span>
                        <h3 className="flex-1 font-display text-xl font-semibold">{d.title}</h3>
                        <span className={`shrink-0 text-2xl text-clay transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}>
                          +
                        </span>
                      </div>
                      <div className="grid transition-[grid-template-rows] duration-400" style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}>
                        <div className="overflow-hidden">
                          <p className="ml-[76px] mt-3.5 whitespace-pre-line text-[15px] leading-relaxed text-[#5b5749]">
                            {d.detail}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="mt-16 rounded-2xl border border-hairline bg-card p-8">
              <h2 className="mb-2 font-display text-2xl font-bold">Day-by-day plan</h2>
              <p className="text-[15px] leading-relaxed text-mutedfg">
                We tailor this {pkg.duration} route to your dates and pace — the full itinerary is
                shared the moment you enquire.
              </p>
            </div>
          )}

          {/* inclusions */}
          <motion.div
            variants={reveal}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mt-[60px] grid gap-10 md:grid-cols-2"
          >
            <div>
              <h3 className="mb-[18px] font-display text-[22px] font-bold">What&apos;s included</h3>
              {pkg.inclusions.length > 0 ? (
                <ul className="flex flex-col gap-3">
                  {pkg.inclusions.map((inc) => (
                    <li key={inc} className="flex gap-3 text-[15px] text-[#3f3b30]">
                      <span className="font-bold text-clay">✓</span> {inc}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-[15px] text-mutedfg">
                  Shared with your itinerary — ask us and we&apos;ll send the full list.
                </p>
              )}
            </div>
            <div>
              <h3 className="mb-[18px] font-display text-[22px] font-bold">Not included</h3>
              <ul className="flex flex-col gap-3">
                {EXCLUDES.map((ex) => (
                  <li key={ex} className="flex gap-3 text-[15px] text-[#8a8578]">
                    <span className="font-bold">–</span> {ex}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>

        {/* sticky booking */}
        <aside className="lg:sticky lg:top-24">
          <motion.div
            variants={reveal}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="rounded-[22px] border border-ink/10 bg-card p-7 shadow-[0_30px_60px_-44px_rgba(20,17,11,0.4)]"
          >
            <div className="mb-1.5 flex items-baseline gap-2">
              {pkg.hasPrice ? <span className="font-mono text-xs text-[#8a8578]">from</span> : null}
              <span className="font-display text-[40px] font-bold leading-none">{pkg.priceLabel}</span>
            </div>
            <p className="mb-[22px] text-[13px] text-[#8a8578]">
              {pkg.hasPrice ? "per person · " : ""}{pkg.duration} · twin sharing
            </p>

            {/* Booking creation was unreachable after the redesign: the bookings
                table, admin CRUD and profile "My trips" all existed with no way
                to create a row. Restored here for Supabase-backed packages. */}
            {pkg.bookable ? (
              <form action={createBookingFromPlanner} className="flex flex-col gap-3">
                <input type="hidden" name="packageId" value={pkg.id} />
                <input type="hidden" name="packageSlug" value={pkg.slug} />
                <input type="hidden" name="packageTitle" value={pkg.title} />

                <div className="flex flex-col gap-1.5">
                  <label className={lbl} htmlFor="bk-name">Full name</label>
                  <input id="bk-name" name="fullName" required minLength={2} placeholder="Your name" className={field} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className={lbl} htmlFor="bk-email">Email</label>
                  <input id="bk-email" name="email" type="email" required placeholder="you@email.com" className={field} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className={lbl} htmlFor="bk-phone">Phone (optional)</label>
                  <input id="bk-phone" name="phone" type="tel" placeholder="+91 98xxx xxxxx" className={field} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className={lbl} htmlFor="bk-date">Travel date</label>
                    <input id="bk-date" name="travelDate" type="date" required min={todayIso} className={field} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className={lbl} htmlFor="bk-pax">Travellers</label>
                    <input
                      id="bk-pax"
                      name="travelersCount"
                      type="number"
                      required
                      min={1}
                      max={20}
                      defaultValue={2}
                      className={field}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className={lbl} htmlFor="bk-msg">Anything else? (optional)</label>
                  <textarea
                    id="bk-msg"
                    name="message"
                    rows={2}
                    maxLength={2000}
                    placeholder="Dietary needs, must-see places…"
                    className="w-full resize-y rounded-xl border-[1.5px] border-[#E0D7C4] bg-white p-3.5 text-[14px] text-ink transition-colors focus:border-clay focus:outline-none"
                  />
                </div>

                <LocationConsent />

                <button
                  type="submit"
                  className="mt-1 flex h-[54px] items-center justify-center rounded-[14px] bg-clay text-[15.5px] font-bold text-paper shadow-[0_14px_32px_-16px_rgba(155,106,76,0.9)] transition-[background,transform] duration-300 hover:-translate-y-0.5 hover:bg-clay-dark"
                >
                  Request this trip
                </button>
                <p className="text-center text-[11.5px] text-[#8a8578]">
                  No payment now — we confirm availability first.
                </p>
              </form>
            ) : null}

            <a
              href={enquire}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex h-[52px] items-center justify-center rounded-[14px] text-[15px] font-bold transition-colors ${
                pkg.bookable
                  ? "mt-3 border-[1.5px] border-ink/15 hover:bg-[#f0e9da]"
                  : "bg-clay text-paper shadow-[0_14px_32px_-16px_rgba(155,106,76,0.9)] hover:bg-clay-dark"
              }`}
            >
              Enquire on WhatsApp
            </a>
            <a
              href={signedIn ? `tel:${PHONE_TEL}` : "/login?next=%2Fcontact"}
              className="mt-3 flex h-[52px] items-center justify-center rounded-[14px] border-[1.5px] border-ink/15 text-[15px] font-bold transition-colors hover:bg-[#f0e9da]"
            >
              {signedIn ? "Call SS Rao" : "Sign in to call"}
            </a>

            <div className="mt-6 flex flex-col gap-3.5 border-t border-ink/10 pt-5">
              {[
                ["Duration", pkg.duration],
                ["Best season", "Oct – Apr"],
                ["Group size", "2 – 12 guests"],
                ["Custom dates", "Available"],
              ].map(([k, v], i) => (
                <div key={k} className="flex justify-between text-sm">
                  <span className="text-[#8a8578]">{k}</span>
                  <span className={`font-semibold ${i === 3 ? "text-clay" : ""}`}>{v}</span>
                </div>
              ))}
            </div>
          </motion.div>
          <p className="mt-4 text-center text-[12.5px] text-[#8a8578]">
            Free consultation · No booking fee to enquire
          </p>
        </aside>
      </section>

      {/* related */}
      {related.length > 0 ? (
        <section className="mx-auto max-w-[1360px] px-6 pb-10 pt-[60px] lg:px-10">
          <div className="mb-[30px] flex items-end justify-between">
            <h2 className="font-display text-[clamp(26px,2.8vw,38px)] font-bold tracking-[-0.02em]">
              More Northeast journeys
            </h2>
            <Link href="/packages" className="text-sm font-bold text-clay">All tours →</Link>
          </div>
          <div className="grid gap-7 md:grid-cols-3">
            {related.map((p) => (
              <Link
                key={p.slug}
                href={`/packages/${p.slug}`}
                className="group block transition-transform duration-500 hover:-translate-y-2"
              >
                <div className="relative mb-4 h-[240px] overflow-hidden rounded-[18px]">
                  <Image
                    src={p.image}
                    alt={p.title}
                    fill
                    sizes="33vw"
                    className="object-cover transition-transform duration-[800ms] group-hover:scale-[1.06]"
                  />
                </div>
                <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.1em] text-clay">
                  {p.region} · {p.duration}
                </p>
                <h3 className="mb-2 font-display text-[22px] font-bold">{p.title}</h3>
                <span className="font-display text-xl font-bold">{p.priceLabel}</span>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
