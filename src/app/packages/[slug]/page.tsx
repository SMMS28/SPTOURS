import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { PackageBookingPlanner } from "@/components/package-booking-planner";
import { getCurrentUser } from "@/lib/auth";
import { getPublishedPackageBySlug } from "@/lib/data/packages";
import { getSafePackageImageSrc } from "@/lib/data/media";
import { getPackageDetailInfo } from "@/lib/data/package-details";
import { generateDepartureCalendar } from "@/lib/data/departures";
import { getDurationSummary } from "@/lib/duration";

export const revalidate = 300;

export default async function PackageDetailsPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    booking?: string;
    ref?: string;
    saved?: string;
    travelDate?: string;
    travelers?: string;
    referral?: string;
  }>;
}) {
  const { slug } = await params;
  const query = await searchParams;
  const travelPackage = await getPublishedPackageBySlug(slug);
  const user = await getCurrentUser();

  if (!travelPackage) {
    notFound();
  }

  const detailInfo = getPackageDetailInfo(
    travelPackage.slug,
    travelPackage.duration_days,
    travelPackage.inclusions,
  );

  const galleryImages =
    travelPackage.package_images
      ?.slice()
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((row) => getSafePackageImageSrc(row.storage_path, `${travelPackage.slug}-${row.sort_order}`))
      .slice(0, 10) ?? [];

  const dayWiseItinerary =
    travelPackage.package_itinerary_days && travelPackage.package_itinerary_days.length > 0
      ? travelPackage.package_itinerary_days
          .slice()
          .sort((a, b) => a.day_number - b.day_number)
          .map((row) => ({
            day: `Day ${row.day_number}`,
            title: row.title,
            details: row.details,
          }))
      : detailInfo.itinerary;

  const departureCalendar = generateDepartureCalendar(travelPackage.slug, 45);
  const durationSummary = getDurationSummary(travelPackage.duration_days, travelPackage.raw_duration);

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 animate-fade-up">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">
        <Link href="/" className="hover:underline">Home</Link> / <Link href="/packages" className="hover:underline">Packages</Link> / {travelPackage.title}
      </p>

      <div className="mt-3 grid items-start gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-8">
          <div className="rounded-xl border bg-card p-4 sm:p-5">
            <h1 className="text-3xl font-semibold">{travelPackage.title}</h1>
            <p className="mt-2 text-muted-foreground">
              {travelPackage.destination}, {travelPackage.location}
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              {travelPackage.tags_type && <Badge variant="outline">{travelPackage.tags_type}</Badge>}
              <Badge variant="secondary">{durationSummary.label}</Badge>
              <Badge variant="secondary">{travelPackage.source_category || detailInfo.idealFor}</Badge>
            </div>
          </div>

          <div className="relative h-64 overflow-hidden rounded-xl border sm:h-96">
            <Image
              src={galleryImages[0] || getSafePackageImageSrc(travelPackage.cover_image, travelPackage.slug)}
              alt="Travel package visual"
              fill
              className="object-cover"
              priority
            />
          </div>

          {galleryImages.length > 1 && (
            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {galleryImages.slice(0, 8).map((imagePath, index) => (
                <div key={`${imagePath}-${index}`} className="relative h-28 overflow-hidden rounded-lg border">
                  <Image src={imagePath} alt="Package gallery" fill className="object-cover" />
                </div>
              ))}
            </div>
          )}

          <div className="space-y-6 rounded-xl border bg-card p-5">
            <p>{travelPackage.description?.trim() || travelPackage.short_description}</p>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <article className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground">Package code</p>
                <p className="font-medium">{detailInfo.packageCode}</p>
              </article>
              <article className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground">Duration</p>
                <p className="font-medium">{durationSummary.label}</p>
              </article>
              <article className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground">Departure type</p>
                <p className="font-medium">{travelPackage.tags_type || detailInfo.departureType}</p>
              </article>
              <article className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground">Category</p>
                <p className="font-medium">{travelPackage.source_category || detailInfo.idealFor}</p>
              </article>
            </div>

            {travelPackage.external_link && (
              <div>
                <a
                  href={travelPackage.external_link}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm underline"
                >
                  View source itinerary details
                </a>
              </div>
            )}

            {detailInfo.destinationsCovered.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold">Destinations covered</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {detailInfo.destinationsCovered.map((place) => (
                    <Badge key={place} variant="outline">
                      {place}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h2 className="text-xl font-semibold">Tour highlights</h2>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                {detailInfo.highlights.map((highlight) => (
                  <li key={highlight}>• {highlight}</li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold">Day-wise itinerary</h2>
              <div className="mt-3 space-y-3">
                {dayWiseItinerary.map((item) => (
                  <article key={`${item.day}-${item.title}`} className="rounded-lg border p-4">
                    <p className="text-sm font-medium">{item.day}: {item.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{item.details}</p>
                  </article>
                ))}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h2 className="text-xl font-semibold">Inclusions</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {detailInfo.inclusions.map((item) => (
                    <Badge key={item} variant="secondary">
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h2 className="text-xl font-semibold">Exclusions</h2>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  {detailInfo.exclusions.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold">Important notes</h2>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                {detailInfo.notes.map((note) => (
                  <li key={note}>• {note}</li>
                ))}
              </ul>
            </div>
          </div>

          <PackageBookingPlanner
            travelPackage={travelPackage}
            dayWiseItinerary={dayWiseItinerary}
            departureCalendar={departureCalendar}
            isAuthenticated={Boolean(user)}
            defaultEmail={user?.email ?? ""}
            bookingStatus={query.booking}
            bookingReference={query.ref}
            defaultTravelDate={query.travelDate}
            defaultTravelers={Number(query.travelers || "") || 2}
            referralCode={query.referral}
            savedStatus={query.saved}
          />
        </div>

        <aside className="space-y-4 lg:col-span-4 lg:sticky lg:top-24">
          <div className="rounded-xl border bg-card p-5">
            <p className="text-sm text-muted-foreground">Starting from</p>
            <p className="text-3xl font-semibold">₹{travelPackage.price_inr.toLocaleString("en-IN")}</p>
            <p className="text-xs text-muted-foreground">Per person</p>

            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Duration</span>
                <span className="font-medium">{durationSummary.label}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Departure type</span>
                <span className="font-medium">{travelPackage.tags_type || detailInfo.departureType}</span>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <Link href={`/contact?packageId=${travelPackage.id}`} className="inline-flex w-full items-center justify-center rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                Enquire now
              </Link>
              <Link href="/packages" className="inline-flex w-full items-center justify-center rounded-lg border border-border px-3 py-2 text-sm font-medium hover:bg-muted">
                View more packages
              </Link>
            </div>
          </div>

          <div className="rounded-xl border bg-card p-5">
            <p className="text-sm font-medium">Inclusions snapshot</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {travelPackage.inclusions.slice(0, 6).map((item) => (
                <Badge key={item} variant="secondary">
                  {item}
                </Badge>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
