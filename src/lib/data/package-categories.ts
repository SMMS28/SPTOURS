import type { TravelPackage } from "@/lib/types";

export type PackageCategoryKey =
  | "holiday_packages"
  | "india_tour_packages"
  | "international_customized_tours"
  | "international_tour_packages";

export const packageCategoryConfig: {
  key: PackageCategoryKey;
  title: string;
  sourceCategory: string;
}[] = [
  {
    key: "holiday_packages",
    title: "holiday_packages",
    sourceCategory: "Holiday Packages",
  },
  {
    key: "india_tour_packages",
    title: "India_Tour_Packages",
    sourceCategory: "India Tour Packages",
  },
  {
    key: "international_customized_tours",
    title: "International_Customized_Tours",
    sourceCategory: "International Customized Tours",
  },
  {
    key: "international_tour_packages",
    title: "International_Tour_Packages",
    sourceCategory: "International Tour Packages",
  },
];

const normalize = (value: string | null | undefined) => (value ?? "").toLowerCase().trim();

export const inferCategoryFromPackage = (travelPackage: TravelPackage): PackageCategoryKey => {
  const sourceCategory = normalize(travelPackage.source_category);
  if (sourceCategory.includes("holiday")) {
    return "holiday_packages";
  }
  if (sourceCategory.includes("india")) {
    return "india_tour_packages";
  }
  if (sourceCategory.includes("customized")) {
    return "international_customized_tours";
  }
  if (sourceCategory.includes("international")) {
    return "international_tour_packages";
  }

  const title = normalize(travelPackage.title);
  const tags = normalize(travelPackage.tags_type);
  if (tags.includes("holiday")) {
    return "holiday_packages";
  }
  if (tags.includes("customized")) {
    return "international_customized_tours";
  }

  if (
    title.includes("holiday") ||
    title.includes("weekend") ||
    title.includes("andaman") ||
    title.includes("goa") ||
    title.includes("kerala")
  ) {
    return "holiday_packages";
  }

  if (
    title.includes("custom") ||
    title.includes("city break") ||
    title.includes("honeymoon")
  ) {
    return "international_customized_tours";
  }

  const location = normalize(travelPackage.location);
  if (location.includes("india")) {
    return "india_tour_packages";
  }

  return "international_tour_packages";
};

export const groupPackagesByCategory = (packages: TravelPackage[]) => {
  return packageCategoryConfig.map((category, categoryIndex) => {
    const assigned = packages.filter((travelPackage) => inferCategoryFromPackage(travelPackage) === category.key);

    if (assigned.length >= 3) {
      return {
        ...category,
        packages: assigned,
      };
    }

    const fallbackPool = packages.filter(
      (travelPackage) => !assigned.some((item) => item.id === travelPackage.id),
    );

    const needed = Math.max(0, 3 - assigned.length);
    const fallbackStart = categoryIndex * 3;
    const fallback = fallbackPool.slice(fallbackStart, fallbackStart + needed);

    return {
      ...category,
      packages: [...assigned, ...fallback],
    };
  });
};
