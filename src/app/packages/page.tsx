import { PackagesDiscovery } from "@/components/packages-discovery";
import { getPublishedPackages, searchPublishedPackages } from "@/lib/data/packages";
import { groupPackagesByCategory } from "@/lib/data/package-categories";

export const revalidate = 300;

export const metadata = {
  title: "Packages | SP TOURS AND TRAVELLS",
};

export default async function PackagesPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    category?: string;
    minDays?: string;
    maxDays?: string;
    maxBudget?: string;
    month?: string;
    sort?: string;
    page?: string;
  }>;
}) {
  const params = await searchParams;
  const minDays = Number(params.minDays || "");
  const maxDays = Number(params.maxDays || "");
  const maxBudget = Number(params.maxBudget || "");
  const page = Number(params.page || "") || 1;

  const result = await searchPublishedPackages({
    q: params.q,
    category: params.category,
    minDays: Number.isFinite(minDays) && minDays > 0 ? minDays : undefined,
    maxDays: Number.isFinite(maxDays) && maxDays > 0 ? maxDays : undefined,
    maxBudget: Number.isFinite(maxBudget) && maxBudget > 0 ? maxBudget : undefined,
    month: params.month,
    sort: (params.sort as
      | "popularity"
      | "date_desc"
      | "date_asc"
      | "price_asc"
      | "price_desc"
      | "duration_asc"
      | "duration_desc"
      | undefined) ?? "popularity",
    page,
    pageSize: 12,
  });

  const allPackages = await getPublishedPackages();
  const grouped = groupPackagesByCategory(allPackages);

  const categories = grouped.map((group) => ({
    key: group.key,
    title: group.title,
    sourceCategory: group.sourceCategory,
  }));

  return (
    <PackagesDiscovery
      packages={result.items}
      categories={categories}
      initialParams={params}
      totalCount={result.totalCount}
      page={result.page}
      pageSize={result.pageSize}
    />
  );
}
