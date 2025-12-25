import { Skeleton } from "@/components/ui/skeleton";

export function CampaignDetailSkeleton() {
  return (
    <div className="min-h-screen bg-background pt-20 pb-12 sm:pt-24 sm:pb-16">
      <div className="container max-w-6xl">
        {/* Back link */}
        <Skeleton className="h-5 w-32 mb-4 sm:mb-6" delay={0} />
        
        {/* Main grid */}
        <div className="grid lg:grid-cols-5 gap-4 sm:gap-6 lg:gap-8">
          {/* Left column - Main content */}
          <div className="lg:col-span-3 space-y-4 sm:space-y-6">
            {/* Hero image */}
            <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl">
              <Skeleton 
                variant="bright"
                className="aspect-video w-full"
                delay={50}
              />
              {/* Badge skeletons on image */}
              <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
                <Skeleton className="h-6 w-24 rounded-full" delay={100} />
              </div>
              <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex gap-2">
                <Skeleton className="h-8 w-8 sm:h-10 sm:w-10 rounded-full" delay={150} />
                <Skeleton className="h-8 w-8 sm:h-10 sm:w-10 rounded-full" delay={200} />
              </div>
            </div>
            
            {/* Title and creator */}
            <div className="space-y-4">
              <Skeleton variant="bright" className="h-8 sm:h-10 w-4/5" delay={250} />
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" delay={300} />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" delay={350} />
                  <Skeleton variant="subtle" className="h-3 w-24" delay={400} />
                </div>
              </div>
            </div>
            
            {/* Description card */}
            <div className="glass-card p-4 sm:p-6 border border-border/30">
              <Skeleton className="h-6 w-28 mb-4" delay={450} />
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" delay={500} />
                <Skeleton className="h-4 w-full" delay={550} />
                <Skeleton className="h-4 w-3/4" delay={600} />
                <Skeleton className="h-4 w-5/6" delay={650} />
              </div>
            </div>
            
            {/* Milestones card */}
            <div className="glass-card p-4 sm:p-6 border border-border/30">
              <Skeleton className="h-6 w-24 mb-4" delay={700} />
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Skeleton 
                      variant="bright"
                      className="h-8 w-8 rounded-full shrink-0"
                      delay={750 + i * 75}
                    />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" delay={800 + i * 75} />
                      <Skeleton variant="subtle" className="h-3 w-1/2" delay={850 + i * 75} />
                    </div>
                    <Skeleton className="h-5 w-20" delay={900 + i * 75} />
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Right column - Donation sidebar */}
          <div className="lg:col-span-2">
            <div className="glass-card p-4 sm:p-6 border border-border/30 sticky top-24">
              {/* Progress */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <Skeleton variant="bright" className="h-8 w-28" delay={300} />
                  <Skeleton className="h-6 w-20" delay={350} />
                </div>
                <Skeleton variant="bright" className="h-3 w-full rounded-full" delay={400} />
              </div>
              
              {/* Stats grid */}
              <div className="grid grid-cols-3 gap-2 mb-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div 
                    key={i}
                    className="text-center p-3 rounded-lg bg-secondary/50"
                  >
                    <Skeleton className="h-6 w-12 mx-auto mb-2" delay={450 + i * 50} />
                    <Skeleton variant="subtle" className="h-3 w-16 mx-auto" delay={500 + i * 50} />
                  </div>
                ))}
              </div>
              
              {/* Donation form */}
              <div className="space-y-4">
                <Skeleton className="h-4 w-24" delay={600} />
                <Skeleton className="h-12 w-full rounded-lg" delay={650} />
                <Skeleton variant="bright" className="h-12 w-full rounded-xl" delay={700} />
                <Skeleton variant="subtle" className="h-3 w-48 mx-auto" delay={750} />
              </div>
              
              {/* Trust indicators */}
              <div className="mt-6 pt-4 border-t border-border/50 space-y-2">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4 rounded" delay={800 + i * 50} />
                    <Skeleton variant="subtle" className="h-3 w-32" delay={850 + i * 50} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}