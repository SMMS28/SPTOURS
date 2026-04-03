import Link from "next/link";
import Image from "next/image";

import { PackageCard } from "@/components/package-card";
import { Input } from "@/components/ui/input";
import { linkButton } from "@/lib/link-styles";
import type { TravelPackage } from "@/lib/types";

type CategoryOption = {
  key: string;
  title: string;
  sourceCategory: string;
};

type DiscoveryParams = {
  q?: string;
  category?: string;
  minDays?: string;
  maxDays?: string;
  maxBudget?: string;
  month?: string;
  sort?: string;
  page?: string;
};

const buildPageHref = (params: DiscoveryParams, page: number) => {
  const search = new URLSearchParams();
  if (params.q) search.set("q", params.q);
  if (params.category) search.set("category", params.category);
  if (params.minDays) search.set("minDays", params.minDays);
  if (params.maxDays) search.set("maxDays", params.maxDays);
  if (params.maxBudget) search.set("maxBudget", params.maxBudget);
  if (params.month) search.set("month", params.month);
  if (params.sort) search.set("sort", params.sort);
  search.set("page", String(page));

  return `/packages?${search.toString()}`;
};

export const PackagesDiscovery = ({
  packages,
  categories,
  initialParams,
  totalCount,
  page,
  pageSize,
}: {
  packages: TravelPackage[];
  categories: CategoryOption[];
  initialParams: DiscoveryParams;
  totalCount: number;
  page: number;
  pageSize: number;
}) => {
  const totalPages = Math.max(Math.ceil(totalCount / pageSize), 1);
  const previousPage = Math.max(page - 1, 1);
  const nextPage = Math.min(page + 1, totalPages);

  return (
    <div className="pb-20">
      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="relative isolate -mt-28 flex min-h-[45vh] items-end overflow-hidden pb-12 pt-32 sm:-mt-32 lg:-mt-36">
        <Image
          src="/images/hero-bg/pexels-pok-rie-33563-5184783.jpg"
          alt="Scenic travel landscape"
          fill
          priority
          className="absolute inset-0 -z-10 object-cover object-[center_30%]"
        />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,rgba(2,6,23,0.5),rgba(2,6,23,0.85))]" />
        
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="animate-fade-up max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-widest text-[#f29a2e]">
              Explore The World
            </p>
            <h1 className="mt-2 text-4xl font-bold text-white sm:text-5xl [text-shadow:0_2px_12px_rgba(0,0,0,0.8)]">
              Curated Tour Packages
            </h1>
            <p className="mt-4 text-base text-white/80 sm:text-lg">
              Discover breathtaking destinations and filter by your trip preferences to find the perfect getaway.
            </p>
          </div>
        </div>
      </section>

      {/* ── Discovery Body ─────────────────────────────────────────────────── */}
      <section className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        
        {/* Filter Bar */}
        <div className="-mt-8 relative z-20 rounded-2xl border border-border/75 bg-card/80 p-4 shadow-[0_8px_30px_rgb(0,0,0,0.08)] backdrop-blur-xl sm:p-5 animate-fade-up">
          <form action="/packages" className="grid gap-3 sm:grid-cols-2 md:grid-cols-6 items-end">
            <div className="md:col-span-2 space-y-1">
              <label className="text-xs font-semibold text-muted-foreground ml-1">Search</label>
              <Input 
                name="q" 
                placeholder="Destination or package..." 
                defaultValue={initialParams.q ?? ""} 
                className="bg-background/50 border-border/75 h-10"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground ml-1">Category</label>
              <select
                name="category"
                defaultValue={initialParams.category ?? ""}
                className="flex h-10 w-full rounded-md border border-border/75 bg-background/50 px-3 py-2 text-sm text-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">All</option>
                {categories.map((category) => (
                  <option key={category.key} value={category.key}>
                    {category.sourceCategory}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground ml-1">Days (Min - Max)</label>
              <div className="flex gap-2">
                <Input name="minDays" type="number" min={1} placeholder="Min" defaultValue={initialParams.minDays ?? ""} className="bg-background/50 border-border/75 h-10" />
                <Input name="maxDays" type="number" min={1} placeholder="Max" defaultValue={initialParams.maxDays ?? ""} className="bg-background/50 border-border/75 h-10" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground ml-1">Max Budget (₹)</label>
              <Input
                name="maxBudget"
                type="number"
                min={1}
                placeholder="Any"
                defaultValue={initialParams.maxBudget ?? ""}
                className="bg-background/50 border-border/75 h-10"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground ml-1">Month of Travel</label>
              <select
                name="month"
                defaultValue={initialParams.month ?? ""}
                className="flex h-10 w-full rounded-md border border-border/75 bg-background/50 px-3 py-2 text-sm"
              >
                <option value="">Any month</option>
                <option value="january">January</option>
                <option value="february">February</option>
                <option value="march">March</option>
                <option value="april">April</option>
                <option value="may">May</option>
                <option value="june">June</option>
                <option value="july">July</option>
                <option value="august">August</option>
                <option value="september">September</option>
                <option value="october">October</option>
                <option value="november">November</option>
                <option value="december">December</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground ml-1">Sort by</label>
              <select
                name="sort"
                defaultValue={initialParams.sort ?? "popularity"}
                className="flex h-10 w-full rounded-md border border-border/75 bg-background/50 px-3 py-2 text-sm"
              >
                <option value="popularity">Popularity</option>
                <option value="date_desc">Newest first</option>
                <option value="date_asc">Oldest first</option>
                <option value="price_asc">Price: low to high</option>
                <option value="price_desc">Price: high to low</option>
                <option value="duration_asc">Duration: shortest</option>
                <option value="duration_desc">Duration: longest</option>
              </select>
            </div>
            <input type="hidden" name="page" value="1" />
            <div className="md:col-span-6 flex flex-wrap gap-2 pt-2 border-t border-border/40 mt-1 justify-end">
              <Link href="/packages" className={`${linkButton("outline")} bg-background/50 border-border/75`}>
                Clear
              </Link>
              <button type="submit" className={`${linkButton()} bg-primary text-primary-foreground hover:bg-primary/90 shadow-md`}>
                Apply Filters
              </button>
            </div>
          </form>
        </div>

        {/* Results */}
        <div className="mt-10 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">All Packages</h2>
          <p className="text-sm font-medium text-muted-foreground">
            {totalCount} {totalCount === 1 ? "Result" : "Results"}
          </p>
        </div>

        {packages.length === 0 ? (
          <div className="mt-6 flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-card/40 py-24 text-center">
            <span className="text-4xl">🏜️</span>
            <p className="mt-4 text-base font-semibold text-foreground">No matches found</p>
            <p className="mt-1 text-sm text-muted-foreground max-w-sm">Try adjusting your filters or search terms to see more packages.</p>
            <Link href="/packages" className={`mt-6 ${linkButton("outline")}`}>
              Reset Filters
            </Link>
          </div>
        ) : (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-8">
            {packages.map((travelPackage) => (
              <PackageCard key={travelPackage.id} travelPackage={travelPackage} />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-10 flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-card/60 p-4">
            <p className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <Link
                aria-disabled={page <= 1}
                href={buildPageHref(initialParams, previousPage)}
                className={`${linkButton("outline")} ${page <= 1 ? "pointer-events-none opacity-50" : ""}`}
              >
                Previous
              </Link>
              <Link
                aria-disabled={page >= totalPages}
                href={buildPageHref(initialParams, nextPage)}
                className={`${linkButton("outline")} ${page >= totalPages ? "pointer-events-none opacity-50" : ""}`}
              >
                Next
              </Link>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
