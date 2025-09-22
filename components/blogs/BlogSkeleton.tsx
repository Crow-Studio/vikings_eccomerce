import { cn } from "@/lib/utils"
interface BlogSkeletonProps {
  className?: string
}
export default function BlogSkeleton({ className }: BlogSkeletonProps) {
  return (
    <div
      className={cn(
        "bg-white dark:bg-background rounded-2xl shadow-lg border border-slate-200/60 dark:border-zinc-700 overflow-hidden animate-pulse",
        className
      )}
    >
      {}
      <div className="h-48 sm:h-56 relative bg-slate-200 dark:bg-slate-800">
        {}
        <div className="absolute top-4 left-4">
          <div className="bg-slate-300 dark:bg-slate-700 h-6 w-12 rounded-full"></div>
        </div>
        {}
        <div className="absolute top-4 right-4">
          <div className="bg-slate-300 dark:bg-slate-700 h-8 w-8 rounded-full"></div>
        </div>
        {}
        <div className="absolute bottom-4 left-4">
          <div className="bg-slate-300 dark:bg-slate-700 h-6 w-16 rounded-full"></div>
        </div>
      </div>
      {}
      <div className="p-6 space-y-4">
        {}
        <div className="space-y-2">
          <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-md w-full"></div>
          <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-md w-3/4"></div>
        </div>
        {}
        <div className="space-y-2">
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-full"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-full"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-2/3"></div>
        </div>
        {}
        <div className="flex flex-wrap gap-2">
          <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-full w-16"></div>
          <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-full w-20"></div>
          <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-full w-14"></div>
        </div>
        {}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {}
              <div className="flex items-center space-x-1">
                <div className="h-3 w-3 bg-slate-200 dark:bg-slate-800 rounded"></div>
                <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-16"></div>
              </div>
              {}
              <div className="flex items-center space-x-1">
                <div className="h-3 w-3 bg-slate-200 dark:bg-slate-800 rounded"></div>
                <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-12"></div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {}
              <div className="flex items-center space-x-1">
                <div className="h-3 w-3 bg-slate-200 dark:bg-slate-800 rounded"></div>
                <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-8"></div>
              </div>
              {}
              <div className="flex items-center space-x-1">
                <div className="h-3 w-3 bg-slate-200 dark:bg-slate-800 rounded"></div>
                <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-16"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export function BlogSkeletonCompact({ className }: BlogSkeletonProps) {
  return (
    <div
      className={cn(
        "bg-white dark:bg-background rounded-xl shadow-md border border-slate-200/60 dark:border-zinc-700 overflow-hidden animate-pulse",
        className
      )}
    >
      <div className="flex">
        {}
        <div className="w-24 h-24 bg-slate-200 dark:bg-slate-800 flex-shrink-0"></div>
        {}
        <div className="flex-1 p-4 space-y-3">
          {}
          <div className="space-y-1">
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-2/3"></div>
          </div>
          {}
          <div className="flex items-center space-x-4">
            <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-16"></div>
            <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-12"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
export function BlogSkeletonGrid({ 
  count = 6, 
  className 
}: { 
  count?: number
  className?: string 
}) {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", className)}>
      {Array.from({ length: count }).map((_, index) => (
        <BlogSkeleton key={index} />
      ))}
    </div>
  )
}