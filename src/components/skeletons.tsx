/**
 * Loading skeletons.
 *
 * Route transitions previously showed a blank white page, because no route had a
 * loading.tsx and the (site) pages are all server-rendered per request. These mirror
 * the real layout so the shift when content lands is small.
 */

export function Shimmer({ className = "" }: { className?: string }) {
  return <div className={`skeleton rounded-lg ${className}`} aria-hidden="true" />;
}

/** Matches the dark full-bleed hero band on /packages and /packages/[slug]. */
export function HeroBandSkeleton({ tall = false }: { tall?: boolean }) {
  return (
    <div className={`relative overflow-hidden bg-inkdeep ${tall ? "h-[520px]" : "h-[420px]"}`}>
      <div className="absolute inset-x-0 bottom-11">
        <div className="mx-auto max-w-[1360px] px-6 lg:px-10">
          <Shimmer className="mb-4 h-3 w-32 bg-paper/15" />
          <Shimmer className="mb-4 h-12 w-[70%] max-w-[520px] bg-paper/20" />
          <Shimmer className="h-4 w-[85%] max-w-[420px] bg-paper/15" />
        </div>
      </div>
    </div>
  );
}

export function PackageCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-[22px] border border-ink/10 bg-card">
      <Shimmer className="h-[230px] rounded-none" />
      <div className="flex flex-1 flex-col p-6">
        <Shimmer className="mb-3 h-3 w-28" />
        <Shimmer className="mb-2 h-6 w-[80%]" />
        <Shimmer className="mb-4 h-6 w-[55%]" />
        <Shimmer className="mb-5 h-4 w-full" />
        <div className="mb-5 flex gap-1.5">
          <Shimmer className="h-7 w-16 rounded-full" />
          <Shimmer className="h-7 w-20 rounded-full" />
          <Shimmer className="h-7 w-14 rounded-full" />
        </div>
        <div className="mt-auto flex items-center justify-between border-t border-ink/10 pt-4">
          <Shimmer className="h-7 w-24" />
          <Shimmer className="h-11 w-24 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function PackagesGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-[30px] md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <PackageCardSkeleton key={i} />
      ))}
    </div>
  );
}

/** Generic page body: eyebrow, heading, prose, then a card grid. */
export function PageBodySkeleton() {
  return (
    <div className="mx-auto max-w-[1360px] px-6 py-16 lg:px-10">
      <Shimmer className="mb-4 h-3 w-24" />
      <Shimmer className="mb-3 h-10 w-[65%] max-w-[560px]" />
      <Shimmer className="mb-10 h-4 w-[80%] max-w-[640px]" />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-[18px] border border-ink/10 bg-white p-6">
            <Shimmer className="mb-3 h-5 w-[70%]" />
            <Shimmer className="mb-2 h-4 w-full" />
            <Shimmer className="h-4 w-[60%]" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="mx-auto w-full max-w-[1200px] px-6 py-12 lg:px-10">
      <Shimmer className="mb-4 h-3 w-28" />
      <Shimmer className="mb-8 h-12 w-[60%] max-w-[420px]" />
      <div className="mb-9 flex gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Shimmer key={i} className="h-5 w-24" />
        ))}
      </div>
      <div className="mb-8 flex gap-2 border-b border-ink/10 pb-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Shimmer key={i} className="h-6 w-28" />
        ))}
      </div>
      <div className="flex flex-col gap-[18px]">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="grid overflow-hidden rounded-[20px] border border-ink/8 bg-white sm:grid-cols-[220px_1fr]">
            <Shimmer className="min-h-[180px] rounded-none" />
            <div className="p-6">
              <Shimmer className="mb-3 h-3 w-24" />
              <Shimmer className="mb-3 h-7 w-[60%]" />
              <Shimmer className="h-4 w-[75%]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
