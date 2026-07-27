import { Shimmer } from "@/components/skeletons";

export default function Loading() {
  return (
    <div className="flex min-h-screen bg-[#EFEADF]">
      <div className="hidden w-[262px] shrink-0 bg-inkdeep lg:block" />
      <div className="flex-1 px-[34px] py-7">
        <Shimmer className="mb-7 h-8 w-56" />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => <Shimmer key={i} className="h-[150px] rounded-[18px]" />)}
        </div>
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          <Shimmer className="h-[300px] rounded-[18px]" />
          <Shimmer className="h-[300px] rounded-[18px]" />
        </div>
      </div>
    </div>
  );
}
