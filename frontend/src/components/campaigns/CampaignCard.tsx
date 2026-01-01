import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Clock, Users, Target, ArrowUpRight, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFavorites } from "@/hooks/useFavorites";
import { toast } from "sonner";
export interface Campaign {
  id: string;
  title: string;
  description: string;
  category: string;
  goal: number;
  raised: number;
  donorCount: number;
  daysLeft: number;
  imageUrl?: string;
  creator: string;
  isActive: boolean;
  milestoneCount: number;
  isPaused?: boolean;
  isCancelled?: boolean;
}

interface CampaignCardProps {
  campaign: Campaign;
  className?: string;
}

const categoryColors: Record<string, string> = {
  Technology: "from-blue-500/20 to-cyan-500/20 text-cyan-400 border-cyan-500/30",
  Environment: "from-green-500/20 to-emerald-500/20 text-emerald-400 border-emerald-500/30",
  Education: "from-violet-500/20 to-purple-500/20 text-violet-400 border-violet-500/30",
  Health: "from-rose-500/20 to-red-500/20 text-rose-400 border-rose-500/30",
  Art: "from-pink-500/20 to-fuchsia-500/20 text-pink-400 border-pink-500/30",
  Community: "from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30",
};

export function CampaignCard({ campaign, className }: CampaignCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const isLiked = isFavorite(campaign.id);
  const progress = Math.min((campaign.raised / campaign.goal) * 100, 100);
  const formattedGoal = (campaign.goal / 1000000).toLocaleString();
  const formattedRaised = (campaign.raised / 1000000).toLocaleString();

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(campaign.id);
    toast.success(isLiked ? "Removed from watchlist" : "Added to watchlist");
  };
  return (
    <Link
      to={`/campaign/${campaign.id}`}
      className={cn(
        "group block glass-card overflow-hidden transition-all duration-500 ease-out-quint hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-2",
        className
      )}
    >
      {/* Image */}
      <div className="relative h-40 sm:h-48 lg:h-52 overflow-hidden">
        <img
          src={campaign.imageUrl || 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&auto=format&fit=crop'}
          alt={campaign.title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out-quint group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
        
        {/* Category Badge */}
        <Badge
          variant="glass"
          className={cn(
            "absolute top-3 left-3 sm:top-4 sm:left-4 bg-gradient-to-r border backdrop-blur-md text-xs sm:text-sm",
            categoryColors[campaign.category] || "from-secondary to-secondary text-secondary-foreground"
          )}
        >
          {campaign.category}
        </Badge>

        {/* Status */}
        {campaign.isActive ? (
          <Badge className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-success/20 text-success border border-success/30 backdrop-blur-md text-xs sm:text-sm">
            <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-success animate-pulse mr-1 sm:mr-1.5" />
            Active
          </Badge>
        ) : (
          <Badge className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-muted/60 text-muted-foreground backdrop-blur-md text-xs sm:text-sm">
            Ended
          </Badge>
        )}

        {/* Favorite Button */}
        <Button
          variant="glass"
          size="icon"
          className={cn(
            "absolute bottom-3 right-3 sm:bottom-4 sm:right-4 h-8 w-8 sm:h-10 sm:w-10",
            isLiked && "text-destructive"
          )}
          onClick={handleFavorite}
          aria-label={isLiked ? "Remove from watchlist" : "Add to watchlist"}
        >
          <Heart className={cn("h-4 w-4 sm:h-5 sm:w-5", isLiked && "fill-current")} />
        </Button>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 lg:p-6">
        <h3 className="font-heading font-semibold text-lg sm:text-xl mb-1.5 sm:mb-2 line-clamp-1 group-hover:text-primary transition-colors duration-300">
          {campaign.title}
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mb-3 sm:mb-4 lg:mb-5 leading-relaxed">
          {campaign.description}
        </p>

        {/* Progress */}
        <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4 lg:mb-5">
          <div className="flex justify-between text-xs sm:text-sm">
            <span className="text-foreground font-semibold">{formattedRaised} STX</span>
            <span className="text-muted-foreground">of {formattedGoal} STX</span>
          </div>
          <Progress value={progress} className="h-1.5 sm:h-2" />
          <div className="text-right">
            <span className="text-[10px] sm:text-xs font-medium bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {progress.toFixed(1)}% funded
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-[10px] sm:text-xs text-muted-foreground border-t border-border/40 pt-3 sm:pt-4 lg:pt-5">
          <div className="flex items-center gap-1 sm:gap-1.5 hover:text-foreground transition-colors">
            <Users className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            <span>{campaign.donorCount} donors</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-1.5 hover:text-foreground transition-colors">
            <Target className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            <span>{campaign.milestoneCount} milestones</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-1.5 hover:text-foreground transition-colors">
            <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            <span>{campaign.daysLeft}d left</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
