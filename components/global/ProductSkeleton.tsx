export default function ProductSkeleton() {
  return (
    <div className="grid gap-1.5 animate-pulse">
      {/* Image skeleton */}
      <div className="h-[15rem] rounded-lg overflow-hidden relative bg-gray-200 dark:bg-slate-700 border border-gray-200 dark:border-slate-700">
        <div className="w-full h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700 animate-shimmer bg-[length:200%_100%]"></div>
      </div>

      {/* Content skeleton */}
      <div className="grid gap-y-1.5">
        {/* Product name skeleton */}
        <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-3/4"></div>
        
        {/* Price skeleton */}
        <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-1/2"></div>
      </div>
    </div>
  );
}