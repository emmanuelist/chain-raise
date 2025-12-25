import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface SkeletonCardProps {
  className?: string;
  index?: number;
}

export function StatCardSkeleton({ className, index = 0 }: SkeletonCardProps) {
  const baseDelay = index * 75;
  
  return (
    <div className={cn("glass-card p-6 border border-border/30", className)}>
      <div className="flex items-center justify-between mb-4">
        <Skeleton variant="bright" className="h-10 w-10 rounded-lg" delay={baseDelay} />
        <Skeleton className="h-5 w-12 rounded-full" delay={baseDelay + 50} />
      </div>
      <Skeleton variant="bright" className="h-8 w-24 mb-2" delay={baseDelay + 100} />
      <Skeleton className="h-4 w-20" delay={baseDelay + 150} />
    </div>
  );
}

export function ActivityItemSkeleton({ index = 0 }: { index?: number }) {
  const baseDelay = index * 100;
  
  return (
    <div className="flex gap-3 pb-4 border-b border-border/50">
      <Skeleton className="h-8 w-8 rounded-full shrink-0" delay={baseDelay} />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" delay={baseDelay + 50} />
        <Skeleton variant="subtle" className="h-3 w-1/2" delay={baseDelay + 100} />
      </div>
    </div>
  );
}

export function TableRowSkeleton({ index = 0 }: { index?: number }) {
  const baseDelay = index * 100;
  
  return (
    <div className="flex items-center gap-4 p-4">
      <Skeleton variant="bright" className="h-12 w-12 rounded-lg" delay={baseDelay} />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-1/3" delay={baseDelay + 50} />
        <Skeleton variant="subtle" className="h-3 w-1/4" delay={baseDelay + 100} />
      </div>
      <Skeleton className="h-6 w-20 rounded-full" delay={baseDelay + 150} />
    </div>
  );
}

export function ChartSkeleton({ className }: SkeletonCardProps) {
  return (
    <div className={cn("glass-card p-6 border border-border/30", className)}>
      {/* Chart header */}
      <div className="flex items-center justify-between mb-6">
        <Skeleton className="h-5 w-32" delay={0} />
        <Skeleton className="h-8 w-24 rounded-md" delay={50} />
      </div>
      {/* Chart area */}
      <div className="relative h-64">
        <div className="absolute inset-0 flex items-end justify-between gap-2 px-4">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton 
              key={i}
              variant="bright"
              className="flex-1 rounded-t-md"
              style={{ height: `${30 + Math.random() * 60}%` }}
              delay={i * 75}
            />
          ))}
        </div>
      </div>
      {/* Chart labels */}
      <div className="flex justify-between mt-4 px-4">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton 
            key={i}
            variant="subtle"
            className="h-3 w-8"
            delay={i * 50 + 300}
          />
        ))}
      </div>
    </div>
  );
}

export function DonationItemSkeleton({ index = 0 }: { index?: number }) {
  const baseDelay = index * 80;
  
  return (
    <div className="flex items-center gap-4 p-4 rounded-lg border border-border/30">
      <Skeleton className="h-10 w-10 rounded-full" delay={baseDelay} />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-32" delay={baseDelay + 50} />
        <Skeleton variant="subtle" className="h-3 w-24" delay={baseDelay + 100} />
      </div>
      <Skeleton variant="bright" className="h-6 w-20" delay={baseDelay + 150} />
    </div>
  );
}

export function StatsGridSkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <StatCardSkeleton key={i} index={i} />
      ))}
    </div>
  );
}

export function ActivityFeedSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <ActivityItemSkeleton key={i} index={i} />
      ))}
    </div>
  );
}
