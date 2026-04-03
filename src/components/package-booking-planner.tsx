import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { createBookingFromPlanner } from "@/lib/actions/bookings";
import { toggleFavoritePackage } from "@/lib/actions/favorites";
import { linkButton } from "@/lib/link-styles";
import { getSiteUrl } from "@/lib/env";
import type { DepartureSlot } from "@/lib/data/departures";
import type { TravelPackage } from "@/lib/types";

type ItineraryDay = {
  day: string;
  title: string;
  details: string;
};

export const PackageBookingPlanner = ({
  travelPackage,
  dayWiseItinerary,
  departureCalendar,
  isAuthenticated,
  defaultEmail,
  bookingStatus,
  bookingReference,
  defaultTravelDate,
  defaultTravelers,
  referralCode,
  savedStatus,
}: {
  travelPackage: TravelPackage;
  dayWiseItinerary: ItineraryDay[];
  departureCalendar: DepartureSlot[];
  isAuthenticated: boolean;
  defaultEmail: string;
  bookingStatus?: string;
  bookingReference?: string;
  defaultTravelDate?: string;
  defaultTravelers?: number;
  referralCode?: string;
  savedStatus?: string;
}) => {
  const isBookingSuccess = bookingStatus === "success";
  const referralToken = referralCode || `${travelPackage.slug.slice(0, 20)}-friends`;
  const referralLink = `${getSiteUrl()}/packages/${travelPackage.slug}?referral=${encodeURIComponent(referralToken)}`;

  return (
    <section className="space-y-4 rounded-lg border p-4">
      <div>
        <h2 className="text-xl font-semibold">Plan your booking</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Pick a tentative departure and share your preferences with our travel advisor.
        </p>
      </div>

      {isBookingSuccess && bookingReference && (
        <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          Booking created successfully. Reference: <strong>{bookingReference}</strong>
        </div>
      )}

      {bookingStatus && bookingStatus !== "success" && (
        <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
          {bookingStatus === "invalid"
            ? "Please review the booking details and try again."
            : "We could not complete your booking right now. Please retry or request a callback."}
        </div>
      )}

      {savedStatus === "added" && (
        <div className="rounded-md border border-sky-200 bg-sky-50 px-3 py-2 text-sm text-sky-800">
          Package saved to your favorites.
        </div>
      )}

      {savedStatus === "removed" && (
        <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
          Package removed from your favorites.
        </div>
      )}

      {departureCalendar.length > 0 && (
        <div>
          <p className="text-sm font-medium">Upcoming departures</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {departureCalendar.slice(0, 8).map((slot) => (
              <Badge key={slot.date} variant={slot.availability === "limited" ? "outline" : "secondary"}>
                {slot.label} · {slot.availability === "limited" ? "Limited seats" : "Available"}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {dayWiseItinerary.length > 0 && (
        <p className="text-sm text-muted-foreground">{dayWiseItinerary.length} day-wise itinerary points included.</p>
      )}

      <form action={createBookingFromPlanner} className="space-y-3 rounded-lg border bg-card p-3" data-confirm-message="Confirm booking request?">
        <input type="hidden" name="packageId" value={travelPackage.id} />
        <input type="hidden" name="packageSlug" value={travelPackage.slug} />
        <input type="hidden" name="packageTitle" value={travelPackage.title} />
        <input type="hidden" name="referralCode" value={referralCode ?? ""} />

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="travelDate" className="text-sm font-medium">Travel date</label>
            <input
              id="travelDate"
              name="travelDate"
              type="date"
              defaultValue={defaultTravelDate}
              required
              className="mt-1 h-10 w-full rounded-md border bg-background px-3 text-sm"
            />
          </div>
          <div>
            <label htmlFor="travelersCount" className="text-sm font-medium">Travelers count</label>
            <input
              id="travelersCount"
              name="travelersCount"
              type="number"
              min={1}
              max={20}
              defaultValue={defaultTravelers ?? 2}
              required
              className="mt-1 h-10 w-full rounded-md border bg-background px-3 text-sm"
            />
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="fullName" className="text-sm font-medium">Full name</label>
            <input
              id="fullName"
              name="fullName"
              required
              placeholder="Your name"
              className="mt-1 h-10 w-full rounded-md border bg-background px-3 text-sm"
            />
          </div>
          <div>
            <label htmlFor="email" className="text-sm font-medium">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              defaultValue={defaultEmail}
              required
              className="mt-1 h-10 w-full rounded-md border bg-background px-3 text-sm"
            />
          </div>
        </div>

        <div>
          <label htmlFor="phone" className="text-sm font-medium">Phone (optional)</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            placeholder="+91"
            className="mt-1 h-10 w-full rounded-md border bg-background px-3 text-sm"
          />
        </div>

        <div>
          <label htmlFor="message" className="text-sm font-medium">Special request (optional)</label>
          <textarea
            id="message"
            name="message"
            rows={3}
            placeholder="Hotel preference, room type, pick-up notes..."
            className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {isAuthenticated ? (
            <button type="submit" className={linkButton()}>
              Confirm booking
            </button>
          ) : (
            <Link
              href={`/login?message=${encodeURIComponent("Please sign in to continue booking.")}&next=${encodeURIComponent(`/packages/${travelPackage.slug}`)}`}
              className={linkButton()}
            >
              Sign in to continue
            </Link>
          )}
        </div>
      </form>

      <form action={toggleFavoritePackage}>
        <input type="hidden" name="packageId" value={travelPackage.id} />
        <input type="hidden" name="packageSlug" value={travelPackage.slug} />
        <input type="hidden" name="nextPath" value={`/packages/${travelPackage.slug}`} />
        <button type="submit" className={linkButton("outline")}>Save package</button>
      </form>

      <div className="rounded-lg border bg-card p-3">
        <p className="text-sm font-medium">Travel with friends</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Share this referral deep-link and your friend can continue from this package planner.
        </p>
        <input
          readOnly
          value={referralLink}
          className="mt-2 h-10 w-full rounded-md border bg-background px-3 text-xs"
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-card p-3">
        <div>
          <p className="text-sm text-muted-foreground">Need customization?</p>
          <p className="text-sm">We can tailor dates, hotels, and transport.</p>
        </div>
        <Link href={`/contact?packageId=${travelPackage.id}`} className={linkButton()}>
          Request callback
        </Link>
      </div>
    </section>
  );
};
