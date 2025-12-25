import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CampaignCard } from "@/components/campaigns/CampaignCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { mockCampaigns, campaignCategories } from "@/lib/mockData";
import { Search, SlidersHorizontal, Grid, List, TrendingUp, Clock, Target, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { SkeletonTransition } from "@/components/ui/skeleton-transition";
import { ExplorePageSkeleton } from "@/components/skeletons";
import { ExploreSEO } from "@/components/SEO";
import { usePagination, useInfiniteScroll } from "@/hooks/usePagination";

const sortOptions = [
  { value: "trending", label: "Trending", icon: TrendingUp },
  { value: "newest", label: "Newest", icon: Clock },
  { value: "ending", label: "Ending Soon", icon: Target },
];

export default function Explore() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("trending");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isLoading, setIsLoading] = useState(true);

  // Simulate initial data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const filteredCampaigns = mockCampaigns.filter((campaign) => {
    const matchesCategory = selectedCategory === "All" || campaign.category === selectedCategory;
    const matchesSearch = campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          campaign.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Pagination with infinite scroll
  const { paginatedItems, hasNextPage, isLoadingMore, loadMore, loadedCount, totalCount } = usePagination({
    items: filteredCampaigns,
    itemsPerPage: 6,
  });

  const { setTargetRef } = useInfiniteScroll(loadMore, hasNextPage, isLoadingMore);

  return (
    <div className="min-h-screen bg-background">
      <ExploreSEO />
      <Header />
      
      <main className="pt-20 pb-12 sm:pt-24 sm:pb-16" role="main" aria-label="Explore campaigns">
        <div className="container mx-auto px-4">
          <SkeletonTransition
            isLoading={isLoading}
            skeleton={<ExplorePageSkeleton />}
            duration={400}
          >
            {/* Page Header */}
            <div className="mb-6 sm:mb-8 content-fade-in">
              <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3">
                Explore Campaigns
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                Discover and support innovative projects building on Stacks.
              </p>
            </div>

          {/* Filters Bar */}
          <nav className="glass-card p-3 sm:p-4 mb-6 sm:mb-8" aria-label="Campaign filters">
            <div className="flex flex-col lg:flex-row gap-3 sm:gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                <Input
                  placeholder="Search campaigns..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-secondary/50 border-border/50"
                  aria-label="Search campaigns"
                />
              </div>

              {/* Sort Options */}
              <div className="flex items-center gap-2" role="group" aria-label="Sort options">
                {sortOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={sortBy === option.value ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setSortBy(option.value)}
                    className="gap-2"
                    aria-pressed={sortBy === option.value}
                  >
                    <option.icon className="h-4 w-4" aria-hidden="true" />
                    <span className="hidden sm:inline">{option.label}</span>
                  </Button>
                ))}
              </div>

              {/* View Toggle */}
              <div className="flex items-center gap-1 p-1 rounded-lg bg-secondary/50" role="group" aria-label="View mode">
                <Button
                  variant={viewMode === "grid" ? "secondary" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                  className="h-8 w-8"
                  aria-label="Grid view"
                  aria-pressed={viewMode === "grid"}
                >
                  <Grid className="h-4 w-4" aria-hidden="true" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "secondary" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                  className="h-8 w-8"
                  aria-label="List view"
                  aria-pressed={viewMode === "list"}
                >
                  <List className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-3 pt-3 sm:mt-4 sm:pt-4 border-t border-border/50" role="group" aria-label="Filter by category">
              {campaignCategories.map((category) => (
                <Badge
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  className={cn(
                    "cursor-pointer transition-all hover:scale-105",
                    selectedCategory === category && "bg-primary text-primary-foreground"
                  )}
                  onClick={() => setSelectedCategory(category)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      setSelectedCategory(category);
                    }
                  }}
                  aria-pressed={selectedCategory === category}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </nav>

          {/* Results Count */}
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <p className="text-sm text-muted-foreground" aria-live="polite">
              Showing <span className="text-foreground font-medium">{loadedCount}</span> of{" "}
              <span className="text-foreground font-medium">{totalCount}</span> campaigns
            </p>
            <Button 
              variant="ghost" 
              size="sm" 
              className="gap-2"
              onClick={() => toast.info("Advanced filters coming soon!")}
            >
              <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
              More Filters
            </Button>
          </div>

            {/* Campaigns Grid */}
            {paginatedItems.length > 0 ? (
              <>
                <div 
                  className={cn(
                    "grid gap-4 sm:gap-5 lg:gap-6 stagger-reveal",
                    viewMode === "grid" 
                      ? "md:grid-cols-2 lg:grid-cols-3" 
                      : "grid-cols-1"
                  )}
                  role="list"
                  aria-label="Campaign list"
                >
                  {paginatedItems.map((campaign) => (
                    <div key={campaign.id} role="listitem">
                      <CampaignCard campaign={campaign} />
                    </div>
                  ))}
                </div>

                {/* Infinite Scroll Trigger / Load More */}
                {hasNextPage && (
                  <div 
                    ref={setTargetRef}
                    className="text-center mt-8 sm:mt-10 lg:mt-12"
                  >
                    <Button 
                      variant="outline" 
                      size="lg"
                      onClick={loadMore}
                      disabled={isLoadingMore}
                    >
                      {isLoadingMore ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Loading...
                        </>
                      ) : (
                        "Load More Campaigns"
                      )}
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="glass-card p-6 sm:p-8 lg:p-12 text-center content-fade-in" role="status">
                <Search className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-muted-foreground mx-auto mb-3 sm:mb-4" aria-hidden="true" />
                <h3 className="font-heading text-lg sm:text-xl font-semibold mb-2">No campaigns found</h3>
                <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
                  Try adjusting your filters or search query.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("All");
                    toast.info("Filters cleared");
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </SkeletonTransition>
        </div>
      </main>

      <Footer />
    </div>
  );
}