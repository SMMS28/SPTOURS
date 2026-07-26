import type { Metadata } from "next";
import { getPublishedPackages } from "@/lib/data/packages";
import { getFavoritePackageIds } from "@/lib/data/favorites";
import { deriveRegionFilters, toPackageViews } from "@/lib/packages-view";
import { PackagesDiscovery } from "@/components/packages-discovery";

export const metadata: Metadata = {
  title: "All journeys",
  description:
    "Signature routes across North East India — fixed departures or fully custom, run end to end by our own teams.",
};

export default async function PackagesPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const params = await searchParams;

  const [rows, favoriteIds] = await Promise.all([
    getPublishedPackages(),
    getFavoritePackageIds(),
  ]);

  const packages = toPackageViews(rows);

  return (
    <PackagesDiscovery
      packages={packages}
      // Cap the chip row so a large catalogue doesn't overflow the filter bar.
      filters={deriveRegionFilters(packages).slice(0, 6)}
      favoriteIds={favoriteIds}
      saved={params.saved}
    />
  );
}
