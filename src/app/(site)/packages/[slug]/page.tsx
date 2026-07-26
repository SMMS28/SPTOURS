import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublishedPackageBySlug, getPublishedPackages } from "@/lib/data/packages";
import { getFavoritePackageIds } from "@/lib/data/favorites";
import { getSafePackageImageSrc } from "@/lib/data/media";
import { toPackageView, toPackageViews } from "@/lib/packages-view";
import { PackageDetail } from "@/components/package-detail";

// No generateStaticParams: the page reads the session (for the saved state) and
// the catalogue is editable from /admin, so it renders per request.

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const row = await getPublishedPackageBySlug(slug);

  if (!row) {
    return { title: "Package" };
  }

  return {
    title: row.title,
    description: row.short_description || undefined,
    openGraph: row.cover_image ? { images: [row.cover_image] } : undefined,
  };
}

/** Keeps the 3-up gallery grid intact when a package has fewer than 3 images. */
const GALLERY_PADDING = [
  "/images/hero-bg/pexels-vijit-bagh-3435480-5414576.jpg",
  "/images/hero-bg/nilotpal-kalita-24vPDG707eM-unsplash.jpg",
];

export default async function PackagePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ booking?: string; saved?: string }>;
}) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);

  const row = await getPublishedPackageBySlug(slug);
  if (!row) notFound();

  const [allRows, favoriteIds] = await Promise.all([
    getPublishedPackages(),
    getFavoritePackageIds(),
  ]);

  const pkg = toPackageView(row);

  const related = toPackageViews(allRows.filter((r) => r.slug !== slug)).slice(0, 3);

  const itinerary = [...(row.package_itinerary_days ?? [])]
    .sort((a, b) => a.day_number - b.day_number)
    .map((day) => ({ day: day.day_number, title: day.title, detail: day.details }));

  const imageSources = [
    row.cover_image,
    ...[...(row.package_images ?? [])]
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((image) => image.storage_path),
  ].filter(Boolean) as string[];

  const gallery = imageSources.map((src, i) => getSafePackageImageSrc(src, `${slug}-${i}`));
  while (gallery.length < 3) {
    gallery.push(GALLERY_PADDING[gallery.length % GALLERY_PADDING.length]);
  }

  return (
    <PackageDetail
      pkg={pkg}
      description={row.description}
      itinerary={itinerary}
      related={related}
      gallery={gallery}
      isSaved={favoriteIds.includes(pkg.id)}
      todayIso={new Date().toISOString().slice(0, 10)}
      booking={query.booking}
      saved={query.saved}
    />
  );
}
