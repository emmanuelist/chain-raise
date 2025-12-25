import { Skeleton } from "@/components/ui/skeleton";
import { CampaignGridSkeleton } from "@/components/campaigns/CampaignCardSkeleton";

export function ExplorePageSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header skeleton */}
      <div className="text-center mb-8 sm:mb-12 space-y-4">
        <Skeleton variant="bright" className="h-10 w-64 mx-auto" delay={0} />
        <Skeleton className="h-5 w-96 max-w-full mx-auto" delay={50} />
      </div>
      
      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Skeleton className="h-12 flex-1 rounded-xl" delay={100} />
        <div className="flex gap-2">
          <Skeleton className="h-12 w-28 rounded-lg" delay={150} />
          <Skeleton className="h-12 w-28 rounded-lg" delay={200} />
          <Skeleton className="h-12 w-28 rounded-lg" delay={250} />
        </div>
      </div>
      
      {/* Category pills */}
      <div className="flex gap-2 mb-8 overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton 
            key={i}
            className="h-9 w-24 rounded-full shrink-0"
            delay={300 + i * 50}
          />
        ))}
      </div>
      
      {/* Campaign grid */}
      <CampaignGridSkeleton count={6} />
      
      {/* Load more button */}
      <div className="flex justify-center mt-10">
        <Skeleton className="h-12 w-40 rounded-xl" delay={800} />
      </div>
    </div>
  );
}