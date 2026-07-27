import { HeroBandSkeleton, PackagesGridSkeleton } from "@/components/skeletons";

export default function Loading() {
  return (
    <div>
      <HeroBandSkeleton />
      <div className="mx-auto max-w-[1360px] px-6 pb-10 pt-12 lg:px-10">
        <PackagesGridSkeleton />
      </div>
    </div>
  );
}
