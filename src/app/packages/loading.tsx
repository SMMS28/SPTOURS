import { PackageCardSkeleton } from "@/components/package-card-skeleton";

export default function PackagesLoading() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-20 pt-16 sm:px-6 lg:px-8">
      <div className="h-10 w-56 animate-pulse rounded bg-muted/50" />
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 9 }).map((_, index) => (
          <PackageCardSkeleton key={index} />
        ))}
      </div>
    </section>
  );
}