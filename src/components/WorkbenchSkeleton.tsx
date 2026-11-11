export function WorkbenchSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-label="Loading lab workbench"
      className="rounded-3xl bg-[#181818] border border-[#272727] p-3 sm:p-4 animate-pulse"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-4 flex flex-col gap-2 rounded-xl bg-[#1F1F1F] border border-[#272727] p-3">
          <div className="h-9 rounded-lg bg-[#272727]" />
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="h-16 rounded-lg bg-[#272727]" />
          ))}
        </div>

        <div className="lg:col-span-8 flex flex-col gap-4 rounded-xl bg-[#1F1F1F] border border-[#272727] p-4">
          <div className="flex justify-between gap-4">
            <div className="h-8 w-64 rounded-lg bg-[#272727]" />
            <div className="h-9 w-36 rounded-lg bg-[#272727]" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="h-16 rounded-lg bg-[#272727]" />
            ))}
          </div>
          <div className="h-80 rounded-lg bg-[#000000] border border-[#272727]" />
        </div>
      </div>
    </div>
  );
}
