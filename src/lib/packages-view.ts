import type { TravelPackage } from "@/lib/types";
import { getSafePackageImageSrc } from "@/lib/data/media";
import { inr } from "@/lib/site";

/**
 * View model bridging the Supabase `packages` row shape to the redesign's
 * presentational components.
 *
 * The redesign originally read a hardcoded array from lib/site.ts, which meant
 * the admin CRUD edited rows the site never rendered. Everything now flows
 * through getPublishedPackages() (which keeps its own static-catalog fallback),
 * adapted here so the components stay presentational.
 */
export type PackageView = {
  id: string;
  slug: string;
  title: string;
  /** Display label, e.g. "Meghalaya". */
  region: string;
  /** Lowercased haystack the filter chips match against. */
  filterKey: string;
  /** e.g. "6D / 5N" */
  duration: string;
  days: number;
  price: number;
  /** Whether a real price exists — 6 rows in the catalogue have price_inr = 0. */
  hasPrice: boolean;
  /** Display string: the formatted amount, or "On request" when price_inr is 0. */
  priceLabel: string;
  image: string;
  blurb: string;
  tag?: string;
  inclusions: string[];
  /**
   * True when this package is a real Supabase row. Favourites and bookings both
   * validate packageId as a uuid and look the row up in `packages`, so for
   * static-catalog entries (ids like "ne-pkg-001") those actions cannot succeed
   * — the UI offers the WhatsApp enquiry path instead of a button that would
   * bounce off zod validation.
   */
  bookable: boolean;
};

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const isSupabaseBacked = (id: string | undefined | null) =>
  Boolean(id && UUID_RE.test(id));

export const toPackageView = (row: TravelPackage): PackageView => {
  const price = Number(row.price_inr ?? 0);
  const days = Number(row.duration_days ?? 0);
  const nights = Math.max(days - 1, 0);
  const duration =
    row.raw_duration?.trim() || (days > 0 ? `${days}D / ${nights}N` : "Flexible dates");
  const region = row.destination?.trim() || row.location?.trim() || "North East India";

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    region,
    // Title is folded in deliberately: the `destination` column holds city names
    // ("Gangtok", "Tawang") rather than states, so state matching needs the title
    // ("Highlights of North Sikkim") to be reliable.
    filterKey: [row.title, row.destination, row.location, row.source_category, row.tags_type]
      .filter(Boolean)
      .join(" ")
      .toLowerCase(),
    duration,
    days,
    price,
    hasPrice: price > 0,
    // Several legacy-import rows have price_inr = 0; rendering "₹0" told the
    // visitor the trip was free.
    priceLabel: price > 0 ? inr(price) : "On request",
    image: getSafePackageImageSrc(row.cover_image, row.slug),
    blurb: row.short_description?.trim() || "",
    tag: row.tags_type?.trim() || undefined,
    inclusions: Array.isArray(row.inclusions) ? row.inclusions.filter(Boolean) : [],
    bookable: isSupabaseBacked(row.id),
  };
};

const normalizeTitle = (title: string) =>
  title.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

/**
 * Collapses duplicate listings by title.
 *
 * Two sources of duplication were both visible on the live site: the legacy CSV
 * import left "-2" suffixed copies of several packages in the database, and
 * mergeWithCatalogPackages only dedupes by slug, so static-catalogue entries sat
 * next to near-identical Supabase rows. Seven titles appeared twice.
 *
 * Where duplicates exist the richest row wins — preferring a Supabase-backed one
 * so favourites and booking stay available, then a real price, then inclusions.
 * This is a display-level fix; the duplicate rows still want cleaning up in the
 * database itself.
 */
export const dedupePackages = (packages: PackageView[]): PackageView[] => {
  const score = (pkg: PackageView) =>
    (pkg.bookable ? 4 : 0) + (pkg.hasPrice ? 2 : 0) + (pkg.inclusions.length > 0 ? 1 : 0);

  const best = new Map<string, PackageView>();
  const order: string[] = [];

  for (const pkg of packages) {
    const key = normalizeTitle(pkg.title);
    const existing = best.get(key);

    if (!existing) {
      best.set(key, pkg);
      order.push(key);
      continue;
    }

    if (score(pkg) > score(existing)) {
      best.set(key, pkg);
    }
  }

  return order.map((key) => best.get(key)!);
};

export const toPackageViews = (rows: TravelPackage[]): PackageView[] =>
  dedupePackages(rows.map(toPackageView));

/** Bento column spans for the home grid, keyed by position rather than data. */
export const bentoSpan = (index: number): number => {
  const pattern = [5, 4, 3, 4, 3, 5];
  return pattern[index % pattern.length];
};

/**
 * State filters for /packages.
 *
 * Matches keywords against the package haystack rather than grouping raw
 * `destination` values — those hold city names, so grouping them yielded chips
 * like "Gangtok" and "Bomdila" instead of the states people browse by. Each state
 * carries its towns so a package titled for a city still lands under its state.
 */
const STATE_FILTERS: { key: string; label: string; match: string[] }[] = [
  { key: "sikkim", label: "Sikkim", match: ["sikkim", "gangtok", "lachung", "yumthang", "pelling", "tsomgo"] },
  {
    key: "meghalaya",
    label: "Meghalaya",
    match: ["meghalaya", "shillong", "cherrapun", "sohra", "mawlynnong", "dawki", "umiam"],
  },
  {
    key: "arunachal",
    label: "Arunachal",
    match: ["arunachal", "tawang", "bomdila", "dirang", "ziro", "bumla", "sela"],
  },
  { key: "assam", label: "Assam", match: ["assam", "guwahati", "kaziranga", "majuli", "kamakhya"] },
  { key: "darjeeling", label: "Darjeeling", match: ["darjeeling", "kalimpong", "mirik"] },
  { key: "nagaland", label: "Nagaland", match: ["nagaland", "kohima", "hornbill"] },
  { key: "manipur", label: "Manipur", match: ["manipur", "imphal", "loktak"] },
  { key: "mizoram", label: "Mizoram", match: ["mizoram", "aizawl"] },
  { key: "tripura", label: "Tripura", match: ["tripura", "agartala"] },
];

/**
 * Whether a package belongs under a filter chip. Shared by the chip counts and
 * the click-through filtering so the two can never disagree — a chip that says
 * "4" always reveals exactly 4 cards.
 */
export const matchesRegionFilter = (pkg: PackageView, key: string): boolean => {
  if (key === "all") return true;
  const entry = STATE_FILTERS.find((state) => state.key === key);
  if (!entry) return pkg.filterKey.includes(key);
  return entry.match.some((token) => pkg.filterKey.includes(token));
};

export const deriveRegionFilters = (
  packages: PackageView[],
): { key: string; label: string; count: number }[] =>
  STATE_FILTERS.map(({ key, label }) => ({
    key,
    label,
    count: packages.filter((pkg) => matchesRegionFilter(pkg, key)).length,
  }))
    .filter((entry) => entry.count > 0)
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
