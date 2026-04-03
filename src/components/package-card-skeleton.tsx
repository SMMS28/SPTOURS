export const PackageCardSkeleton = () => {
  return (
    <article className="h-full animate-pulse rounded-xl border bg-card">
      <div className="h-44 rounded-t-xl bg-muted/60" />
      <div className="space-y-3 p-4">
        <div className="h-5 w-3/4 rounded bg-muted/60" />
        <div className="h-4 w-1/2 rounded bg-muted/50" />
        <div className="h-4 w-full rounded bg-muted/40" />
        <div className="h-4 w-5/6 rounded bg-muted/40" />
        <div className="mt-4 flex justify-between">
          <div className="h-5 w-24 rounded bg-muted/50" />
          <div className="h-9 w-28 rounded bg-muted/60" />
        </div>
      </div>
    </article>
  );
};