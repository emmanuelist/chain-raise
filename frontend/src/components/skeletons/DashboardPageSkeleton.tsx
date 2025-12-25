import { Skeleton } from "@/components/ui/skeleton";
import { StatsGridSkeleton, ChartSkeleton, ActivityFeedSkeleton } from "@/components/ui/skeleton-card";

export function DashboardPageSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="space-y-2">
          <Skeleton variant="bright" className="h-9 w-48" delay={0} />
          <Skeleton className="h-5 w-64" delay={50} />
        </div>
        <Skeleton className="h-12 w-40 rounded-xl" delay={100} />
      </div>
      
      {/* Stats grid */}
      <div className="mb-8">
        <StatsGridSkeleton />
      </div>
      
      {/* Charts row */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <ChartSkeleton />
        <ChartSkeleton />
      </div>
      
      {/* Content tabs */}
      <div className="mb-6">
        <div className="flex gap-2 mb-6">
          <Skeleton className="h-10 w-32 rounded-lg" delay={400} />
          <Skeleton className="h-10 w-32 rounded-lg" delay={450} />
        </div>
        
        {/* Campaign list skeleton */}
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div 
              key={i}
              className="glass-card p-5 border border-border/30"
            >
              <div className="flex flex-col sm:flex-row gap-4">
                <Skeleton 
                  variant="bright"
                  className="h-20 w-28 rounded-lg shrink-0"
                  delay={500 + i * 100}
                />
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-5 w-3/4" delay={550 + i * 100} />
                      <Skeleton variant="subtle" className="h-4 w-full" delay={600 + i * 100} />
                    </div>
                    <Skeleton className="h-6 w-16 rounded-full" delay={650 + i * 100} />
                  </div>
                  <Skeleton variant="bright" className="h-2 w-full rounded-full" delay={700 + i * 100} />
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-20 rounded-md" delay={750 + i * 100} />
                    <Skeleton className="h-8 w-20 rounded-md" delay={800 + i * 100} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Activity sidebar */}
      <div className="glass-card p-6 border border-border/30">
        <Skeleton className="h-6 w-32 mb-6" delay={900} />
        <ActivityFeedSkeleton count={4} />
      </div>
    </div>
  );
}