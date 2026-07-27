import { HeroBandSkeleton, Shimmer } from "@/components/skeletons";

export default function Loading() {
  return (
    <div>
      <HeroBandSkeleton tall />
      <div className="mx-auto grid max-w-[1360px] grid-cols-1 items-start gap-[60px] px-6 pb-10 pt-[70px] lg:grid-cols-[minmax(0,1fr)_380px] lg:px-10">
        <div>
          <Shimmer className="mb-4 h-3 w-24" />
          <Shimmer className="mb-3 h-8 w-[85%]" />
          <Shimmer className="mb-2 h-4 w-full" />
          <Shimmer className="mb-10 h-4 w-[70%]" />
          <div className="grid grid-cols-[2fr_1fr_1fr] gap-3">
            <Shimmer className="h-[260px] rounded-2xl" />
            <Shimmer className="h-[260px] rounded-2xl" />
            <Shimmer className="h-[260px] rounded-2xl" />
          </div>
        </div>
        <Shimmer className="h-[420px] rounded-[22px]" />
      </div>
    </div>
  );
}
