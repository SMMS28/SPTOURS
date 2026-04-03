import { hasSupabaseEnv } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import {
  northeastCatalogPackages,
  prioritizeMostVisitedNortheast,
} from "@/lib/data/northeast-package-catalog";
import { generateDepartureCalendar } from "@/lib/data/departures";
import type { TravelPackage } from "@/lib/types";

export type PackageDiscoverySort =
  | "popularity"
  | "date_desc"
  | "date_asc"
  | "price_asc"
  | "price_desc"
  | "duration_asc"
  | "duration_desc";

export type PackageDiscoveryQuery = {
  q?: string;
  category?: string;
  minDays?: number;
  maxDays?: number;
  maxBudget?: number;
  month?: string;
  sort?: PackageDiscoverySort;
  page?: number;
  pageSize?: number;
};

type SearchRpcRow = TravelPackage & {
  total_count?: number;
};

const fallbackPackages: TravelPackage[] = [
  {
    id: "pkg-goa-1",
    title: "Goa Beach Escape",
    slug: "goa-beach-escape",
    destination: "Goa",
    location: "India",
    tags_type: "Holiday",
    raw_duration: "4 D / 3 N",
    source_category: "Holiday Packages",
    cover_image: "/images/t4.jpg",
    duration_days: 4,
    price_inr: 18999,
    short_description: "Sunset cruises, beach stays, and guided local experiences.",
    inclusions: ["Hotel", "Breakfast", "Airport transfer"],
    is_published: true,
  },
  {
    id: "pkg-kashmir-1",
    title: "Kashmir Valley Retreat",
    slug: "kashmir-valley-retreat",
    destination: "Srinagar",
    location: "India",
    tags_type: "Group Tour",
    raw_duration: "6 D / 5 N",
    source_category: "India Tour Packages",
    cover_image: "/images/t5.jpg",
    duration_days: 6,
    price_inr: 34999,
    short_description: "Houseboat stay, gondola ride, and curated sightseeing.",
    inclusions: ["Hotel", "Daily breakfast", "Local transport"],
    is_published: true,
  },
  {
    id: "pkg-bali-1",
    title: "Bali Cultural Journey",
    slug: "bali-cultural-journey",
    destination: "Bali",
    location: "Indonesia",
    tags_type: "International",
    raw_duration: "5 D / 4 N",
    source_category: "International Tour Packages",
    cover_image: "/images/t6.jpg",
    duration_days: 5,
    price_inr: 52999,
    short_description: "Temple tours, private villa stays, and island adventures.",
    inclusions: ["Resort", "Breakfast", "City tour"],
    is_published: true,
  },
  ...northeastCatalogPackages,
];

const mergeWithCatalogPackages = (packages: TravelPackage[]) => {
  const mergedBySlug = new Map<string, TravelPackage>();

  for (const travelPackage of packages) {
    mergedBySlug.set(travelPackage.slug, travelPackage);
  }

  for (const travelPackage of northeastCatalogPackages) {
    if (!mergedBySlug.has(travelPackage.slug)) {
      mergedBySlug.set(travelPackage.slug, travelPackage);
    }
  }

  return prioritizeMostVisitedNortheast(Array.from(mergedBySlug.values()));
};

export const getPublishedPackages = async (): Promise<TravelPackage[]> => {
  if (!hasSupabaseEnv) {
    return mergeWithCatalogPackages(fallbackPackages);
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("packages")
      .select(
        "id,title,slug,destination,location,tags_type,external_link,raw_duration,source_category,cover_image,duration_days,price_inr,short_description,inclusions,is_published,created_at",
      )
      .eq("is_published", true)
      .order("created_at", { ascending: false });

    if (error && /column|schema cache/i.test(error.message)) {
      const retry = await supabase
        .from("packages")
        .select(
          "id,title,slug,destination,location,cover_image,duration_days,price_inr,short_description,inclusions,is_published,created_at",
        )
        .eq("is_published", true)
        .order("created_at", { ascending: false });

      if (retry.error || !retry.data) {
        return mergeWithCatalogPackages(fallbackPackages);
      }

      return mergeWithCatalogPackages(retry.data as TravelPackage[]);
    }

    if (error || !data) {
      return mergeWithCatalogPackages(fallbackPackages);
    }

    return mergeWithCatalogPackages(data as TravelPackage[]);
  } catch {
    return mergeWithCatalogPackages(fallbackPackages);
  }
};

export const getPublishedPackageBySlug = async (slug: string) => {
  if (!hasSupabaseEnv) {
    const packages = await getPublishedPackages();
    return packages.find((travelPackage) => travelPackage.slug === slug) ?? null;
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("packages")
      .select(
        "id,title,slug,destination,location,tags_type,external_link,raw_duration,source_category,cover_image,duration_days,price_inr,short_description,description,inclusions,is_published,created_at,package_images(storage_path,sort_order),package_itinerary_days(day_number,title,details)",
      )
      .eq("slug", slug)
      .eq("is_published", true)
      .maybeSingle();

    if (error && /column|schema cache/i.test(error.message)) {
      const retry = await supabase
        .from("packages")
        .select(
          "id,title,slug,destination,location,cover_image,duration_days,price_inr,short_description,description,inclusions,is_published,created_at,package_images(storage_path,sort_order),package_itinerary_days(day_number,title,details)",
        )
        .eq("slug", slug)
        .eq("is_published", true)
        .maybeSingle();

      if (retry.error || !retry.data) {
        return northeastCatalogPackages.find((travelPackage) => travelPackage.slug === slug) ?? null;
      }

      return retry.data as TravelPackage;
    }

    if (error || !data) {
      return northeastCatalogPackages.find((travelPackage) => travelPackage.slug === slug) ?? null;
    }

    return data as TravelPackage;
  } catch {
    return northeastCatalogPackages.find((travelPackage) => travelPackage.slug === slug) ?? null;
  }
};

export const getAllPackagesForAdmin = async (): Promise<TravelPackage[]> => {
  if (!hasSupabaseEnv) {
    return mergeWithCatalogPackages(fallbackPackages);
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("packages")
      .select(
        "id,title,slug,destination,location,tags_type,external_link,raw_duration,source_category,cover_image,duration_days,price_inr,short_description,inclusions,is_published,created_at",
      )
      .order("created_at", { ascending: false });

    if (error && /column|schema cache/i.test(error.message)) {
      const retry = await supabase
        .from("packages")
        .select(
          "id,title,slug,destination,location,cover_image,duration_days,price_inr,short_description,inclusions,is_published,created_at",
        )
        .order("created_at", { ascending: false });

      if (retry.error || !retry.data) {
        return mergeWithCatalogPackages(fallbackPackages);
      }

      return mergeWithCatalogPackages(retry.data as TravelPackage[]);
    }

    if (error || !data) {
      return mergeWithCatalogPackages(fallbackPackages);
    }

    return mergeWithCatalogPackages(data as TravelPackage[]);
  } catch {
    return mergeWithCatalogPackages(fallbackPackages);
  }
};

export const getPackageByIdForAdmin = async (id: string) => {
  const packages = await getAllPackagesForAdmin();
  return packages.find((travelPackage) => travelPackage.id === id) ?? null;
};

export const getPackageExtrasByIdForAdmin = async (packageId: string) => {
  if (!hasSupabaseEnv) {
    return {
      imagePaths: [] as string[],
      itineraryRows: [] as { day_number: number; title: string; details: string }[],
    };
  }

  try {
    const supabase = await createClient();

    const [{ data: images }, { data: itinerary }] = await Promise.all([
      supabase
        .from("package_images")
        .select("storage_path,sort_order")
        .eq("package_id", packageId)
        .order("sort_order", { ascending: true }),
      supabase
        .from("package_itinerary_days")
        .select("day_number,title,details")
        .eq("package_id", packageId)
        .order("day_number", { ascending: true }),
    ]);

    return {
      imagePaths: (images ?? []).map((row) => row.storage_path),
      itineraryRows: itinerary ?? [],
    };
  } catch {
    return {
      imagePaths: [] as string[],
      itineraryRows: [] as { day_number: number; title: string; details: string }[],
    };
  }
};

const monthToNumber = (month?: string) => {
  if (!month) {
    return undefined;
  }

  const normalized = month.trim().toLowerCase();
  if (!normalized) {
    return undefined;
  }

  const monthNames = [
    "january",
    "february",
    "march",
    "april",
    "may",
    "june",
    "july",
    "august",
    "september",
    "october",
    "november",
    "december",
  ];

  const index = monthNames.indexOf(normalized);
  return index >= 0 ? index + 1 : undefined;
};

const supportsTravelMonth = (travelPackage: TravelPackage, monthNumber: number) => {
  const departures = generateDepartureCalendar(travelPackage.slug, 365);
  return departures.some((slot) => new Date(slot.date).getMonth() + 1 === monthNumber);
};

export const searchPublishedPackages = async (query: PackageDiscoveryQuery) => {
  const sort = query.sort || "popularity";
  const page = Math.max(query.page ?? 1, 1);
  const pageSize = Math.max(Math.min(query.pageSize ?? 12, 24), 1);
  const monthNumber = monthToNumber(query.month);

  if (!hasSupabaseEnv) {
    const allPackages = await getPublishedPackages();
    const monthFiltered = monthNumber
      ? allPackages.filter((row) => supportsTravelMonth(row, monthNumber))
      : allPackages;
    const offset = (page - 1) * pageSize;

    return {
      items: monthFiltered.slice(offset, offset + pageSize),
      totalCount: monthFiltered.length,
      page,
      pageSize,
    };
  }

  try {
    const supabase = await createClient();

    const runRpc = async (rpcPage: number, rpcPageSize: number) => {
      const { data, error } = await supabase.rpc("search_published_packages", {
        search_q: query.q?.trim() || null,
        category_filter: query.category?.trim() || null,
        min_days: query.minDays ?? null,
        max_days: query.maxDays ?? null,
        max_budget: query.maxBudget ?? null,
        sort_key: sort,
        page_number: rpcPage,
        page_size: rpcPageSize,
      });

      return {
        rows: (data ?? []) as SearchRpcRow[],
        error,
      };
    };

    let rows: SearchRpcRow[] = [];
    if (monthNumber) {
      const fullResult = await runRpc(1, 500);
      if (fullResult.error) {
        throw fullResult.error;
      }
      rows = fullResult.rows;
    } else {
      const pageResult = await runRpc(page, pageSize);
      if (pageResult.error) {
        throw pageResult.error;
      }
      rows = pageResult.rows;
    }

    const monthFilteredRows = monthNumber
      ? rows.filter((row) => supportsTravelMonth(row, monthNumber))
      : rows;

    const totalCount = monthNumber
      ? monthFilteredRows.length
      : Number(rows[0]?.total_count ?? 0);

    const items = monthNumber
      ? monthFilteredRows.slice((page - 1) * pageSize, page * pageSize)
      : monthFilteredRows;

    return {
      items,
      totalCount,
      page,
      pageSize,
    };
  } catch {
    const allPackages = await getPublishedPackages();
    const monthFiltered = monthNumber
      ? allPackages.filter((row) => supportsTravelMonth(row, monthNumber))
      : allPackages;
    const offset = (page - 1) * pageSize;

    return {
      items: monthFiltered.slice(offset, offset + pageSize),
      totalCount: monthFiltered.length,
      page,
      pageSize,
    };
  }
};
