import { HeroBandSkeleton, Shimmer } from "@/components/skeletons";

export default function Loading() {
  return (
    <div>
      <HeroBandSkeleton />
      <div className="mx-auto grid max-w-[1360px] grid-cols-1 gap-14 px-6 pb-24 pt-20 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:px-10">
        <div>
          <Shimmer className="mb-4 h-3 w-28" />
          <Shimmer className="mb-8 h-9 w-[70%]" />
          <div className="grid gap-[18px] sm:grid-cols-2">
            {Array.from({ length: 6 }).map((_, i) => <Shimmer key={i} className="h-[52px] rounded-xl" />)}
          </div>
          <Shimmer className="mt-5 h-24 rounded-xl" />
          <Shimmer className="mt-6 h-[58px] rounded-[14px]" />
        </div>
        <div className="flex flex-col gap-3.5">
          {Array.from({ length: 4 }).map((_, i) => <Shimmer key={i} className="h-[110px] rounded-[18px]" />)}
        </div>
      </div>
    </div>
  );
}
