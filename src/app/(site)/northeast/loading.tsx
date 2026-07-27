import { Shimmer } from "@/components/skeletons";

export default function Loading() {
  return (
    <div className="mx-auto grid min-h-screen max-w-[1360px] items-center gap-[60px] px-6 pt-36 lg:grid-cols-[1.02fr_1fr] lg:px-10">
      <div>
        <Shimmer className="mb-6 h-3 w-40" />
        <Shimmer className="mb-4 h-14 w-[90%]" />
        <Shimmer className="mb-4 h-14 w-[70%]" />
        <Shimmer className="mb-9 h-4 w-[85%]" />
        <div className="flex gap-4">
          <Shimmer className="h-14 w-44 rounded-full" />
          <Shimmer className="h-14 w-40 rounded-full" />
        </div>
      </div>
      <Shimmer className="h-[380px] rounded-[22px] sm:h-[600px]" />
    </div>
  );
}
