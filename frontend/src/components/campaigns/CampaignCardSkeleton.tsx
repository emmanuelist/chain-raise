import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface CampaignCardSkeletonProps {
  className?: string;
  index?: number;
}

export function CampaignCardSkeleton({ className, index = 0 }: CampaignCardSkeletonProps) {
  const baseDelay = index * 100;
  
  return (
    <div 
      className={cn(
        "glass-card overflow-hidden border border-border/30",
        className
      )}
      style={{ animationDelay: `${baseDelay}ms` }}
    >
      {/* Image skeleton with shimmer overlay */}
      <div className="relative h-48 overflow-hidden">
        <Skeleton 
          variant="bright" 
          className="absolute inset-0 rounded-none" 
          delay={baseDelay}
        />
        {/* Shimmer overlay */}
        <div className="absolute inset-0 animate-shimmer" />
        {/* Category badge skeleton */}
        <div className="absolute top-3 left-3">
          <Skeleton 
            className="h-5 w-20 rounded-full" 
            delay={baseDelay + 50}
          />
        </div>
        {/* Status badge skeleton */}
        <div className="absolute top-3 right-3">
          <Skeleton 
            className="h-5 w-14 rounded-full" 
            delay={baseDelay + 100}
          />
        </div>
      </div>
      
      {/* Content */}
      <div className="p-5 space-y-4">
        {/* Title */}
        <Skeleton className="h-6 w-3/4" delay={baseDelay + 150} />
        
        {/* Description */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" delay={baseDelay + 200} />
          <Skeleton className="h-4 w-2/3" delay={baseDelay + 250} />
        </div>
        
        {/* Progress section */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Skeleton className="h-4 w-24" delay={baseDelay + 300} />
            <Skeleton className="h-4 w-28" delay={baseDelay + 350} />
          </div>
          <Skeleton 
            variant="bright" 
            className="h-2.5 w-full rounded-full" 
            delay={baseDelay + 400}
          />
          <div className="flex justify-end">
            <Skeleton className="h-3 w-16" delay={baseDelay + 450} />
          </div>
        </div>
        
        {/* Stats */}
        <div className="flex justify-between pt-4 border-t border-border/50">
          <Skeleton className="h-4 w-20" delay={baseDelay + 500} />
          <Skeleton className="h-4 w-24" delay={baseDelay + 550} />
          <Skeleton className="h-4 w-16" delay={baseDelay + 600} />
        </div>
      </div>
    </div>
  );
}

export function CampaignGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <CampaignCardSkeleton key={i} index={i} />
      ))}
    </div>
  );
}
