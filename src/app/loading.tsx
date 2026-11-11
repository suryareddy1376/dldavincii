import { WorkbenchSkeleton } from "@/components/WorkbenchSkeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#000000] px-4 sm:px-6 pt-28 pb-16">
      <div className="mx-auto max-w-6xl flex flex-col gap-8">
        <div className="h-12 w-72 rounded-xl bg-[#181818] border border-[#272727] animate-pulse" />
        <WorkbenchSkeleton />
      </div>
    </div>
  );
}
