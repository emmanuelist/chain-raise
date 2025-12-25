import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockCampaigns } from "@/lib/mockData";
import { SkeletonTransition } from "@/components/ui/skeleton-transition";
import { CampaignDetailSkeleton } from "@/components/skeletons";
import { 
  ArrowLeft, 
  Clock, 
  Users, 
  Target, 
  Share2, 
  Heart,
  CheckCircle2,
  Circle,
  ExternalLink,
  Wallet,
  TrendingUp,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const mockMilestones = [
  { id: 1, title: "Research & Planning", amount: 10000000000, completed: true, description: "Complete market research and project roadmap" },
  { id: 2, title: "Development Phase 1", amount: 20000000000, completed: true, description: "Build core platform features" },
  { id: 3, title: "Beta Launch", amount: 30000000000, completed: false, description: "Launch beta version to early adopters" },
  { id: 4, title: "Full Launch", amount: 40000000000, completed: false, description: "Public launch with marketing campaign" },
];

const mockDonations = [
  { id: 1, donor: "ST1P...ZGZM", amount: 5000000000, timestamp: "2 hours ago" },
  { id: 2, donor: "ST2C...K9AG", amount: 10000000000, timestamp: "5 hours ago" },
  { id: 3, donor: "ST3A...GCS0", amount: 2500000000, timestamp: "1 day ago" },
  { id: 4, donor: "ST2R...2VB", amount: 7500000000, timestamp: "2 days ago" },
];

export default function CampaignDetail() {
  const { id } = useParams();
  const [donationAmount, setDonationAmount] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate initial data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [id]);

  const campaign = mockCampaigns.find(c => c.id === id) || mockCampaigns[0];
  const progress = Math.min((campaign.raised / campaign.goal) * 100, 100);
  const formattedGoal = (campaign.goal / 1000000).toLocaleString();
  const formattedRaised = (campaign.raised / 1000000).toLocaleString();

  const handleDonate = () => {
    if (!donationAmount || parseFloat(donationAmount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    toast.success(`Donation of ${donationAmount} STX initiated!`);
    setDonationAmount("");
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20 pb-12 sm:pt-24 sm:pb-16">
        <div className="container mx-auto px-4">
          <SkeletonTransition
            isLoading={isLoading}
            skeleton={<CampaignDetailSkeleton />}
            duration={400}
          >
            {/* Back Link */}
            <Link
              to="/explore"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4 sm:mb-6 content-fade-in"
            >
              <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              Back to Explore
            </Link>

          <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              {/* Hero Image */}
              <div className="relative rounded-lg sm:rounded-xl overflow-hidden aspect-video">
                <img
                  src={campaign.imageUrl}
                  alt={campaign.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                
                {/* Category & Status */}
                <div className="absolute top-3 left-3 sm:top-4 sm:left-4 flex gap-1.5 sm:gap-2">
                  <Badge variant="outline" className="bg-card/80 backdrop-blur-sm text-xs sm:text-sm">
                    {campaign.category}
                  </Badge>
                  {campaign.isActive ? (
                    <Badge className="bg-success/20 text-success border border-success/30 text-xs sm:text-sm">
                      Active
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="text-xs sm:text-sm">Ended</Badge>
                  )}
                </div>

                {/* Actions */}
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex gap-1.5 sm:gap-2">
                  <Button
                    variant="glass"
                    size="icon"
                    onClick={() => {
                      setIsLiked(!isLiked);
                      toast.success(isLiked ? "Removed from favorites" : "Added to favorites");
                    }}
                    className={cn("h-8 w-8 sm:h-10 sm:w-10", isLiked && "text-destructive")}
                  >
                    <Heart className={cn("h-3.5 w-3.5 sm:h-4 sm:w-4", isLiked && "fill-current")} />
                  </Button>
                  <Button variant="glass" size="icon" onClick={handleShare} className="h-8 w-8 sm:h-10 sm:w-10">
                    <Share2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </Button>
                </div>
              </div>

              {/* Title & Creator */}
              <div>
                <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3">
                  {campaign.title}
                </h1>
                <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground">
                  <span>Created by</span>
                  <a
                    href={`https://explorer.hiro.so/address/${campaign.creator}?chain=testnet`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline flex items-center gap-1"
                  >
                    {campaign.creator.slice(0, 6)}...{campaign.creator.slice(-4)}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>

              {/* Description */}
              <Card className="glass-card">
                <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-4">
                  <CardTitle className="text-base sm:text-lg">About This Campaign</CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
                  <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                    {campaign.description}
                  </p>
                  <p className="text-muted-foreground leading-relaxed mt-3 sm:mt-4 text-sm sm:text-base">
                    This campaign represents a significant step forward in bringing decentralized solutions to real-world problems. Our team has been working tirelessly to ensure that every milestone is achievable and every fund is used transparently.
                  </p>
                  <p className="text-muted-foreground leading-relaxed mt-3 sm:mt-4 text-sm sm:text-base">
                    With your support, we can make this vision a reality. Every contribution, no matter the size, brings us closer to our goal and helps build a more decentralized future.
                  </p>
                </CardContent>
              </Card>

              {/* Milestones */}
              <Card className="glass-card">
                <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-4">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <Target className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    Milestones
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
                  <div className="space-y-3 sm:space-y-4">
                    {mockMilestones.map((milestone, index) => (
                      <div
                        key={milestone.id}
                        className={cn(
                          "relative pl-6 sm:pl-8 pb-3 sm:pb-4",
                          index < mockMilestones.length - 1 && "border-l-2 border-border ml-2.5 sm:ml-3"
                        )}
                      >
                        {/* Icon */}
                        <div className="absolute -left-2.5 sm:-left-3 top-0">
                          {milestone.completed ? (
                            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-success flex items-center justify-center">
                              <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 text-success-foreground" />
                            </div>
                          ) : (
                            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-border bg-card flex items-center justify-center">
                              <Circle className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        
                        {/* Content */}
                        <div className={cn(milestone.completed && "opacity-60")}>
                          <div className="flex items-center justify-between mb-0.5 sm:mb-1">
                            <h4 className="font-medium text-sm sm:text-base">{milestone.title}</h4>
                            <span className="text-xs sm:text-sm text-primary">
                              {(milestone.amount / 1000000).toLocaleString()} STX
                            </span>
                          </div>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            {milestone.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Donations */}
              <Card className="glass-card">
                <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-4">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <Users className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    Recent Donations
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
                  <div className="space-y-2 sm:space-y-3">
                    {mockDonations.map((donation) => (
                      <div
                        key={donation.id}
                        className="flex items-center justify-between py-2 sm:py-3 border-b border-border/50 last:border-0"
                      >
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary/20 flex items-center justify-center">
                            <Wallet className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium text-xs sm:text-sm">{donation.donor}</div>
                            <div className="text-[10px] sm:text-xs text-muted-foreground">{donation.timestamp}</div>
                          </div>
                        </div>
                        <div className="text-xs sm:text-sm font-medium text-primary">
                          +{(donation.amount / 1000000).toLocaleString()} STX
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-4 sm:space-y-6">
              {/* Donation Card */}
              <Card className="glass-card sticky top-20 sm:top-24">
                <CardContent className="p-4 sm:p-6">
                  {/* Progress */}
                  <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                    <div className="flex justify-between items-end">
                      <div>
                        <div className="text-2xl sm:text-3xl font-heading font-bold text-primary">
                          {formattedRaised}
                        </div>
                        <div className="text-xs sm:text-sm text-muted-foreground">
                          STX raised of {formattedGoal} STX goal
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl sm:text-2xl font-heading font-bold">
                          {progress.toFixed(0)}%
                        </div>
                        <div className="text-xs sm:text-sm text-muted-foreground">funded</div>
                      </div>
                    </div>
                    <Progress value={progress} className="h-2 sm:h-3" />
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6">
                    <div className="text-center p-2 sm:p-3 rounded-lg bg-secondary/50">
                      <div className="flex items-center justify-center gap-1 text-muted-foreground mb-0.5 sm:mb-1">
                        <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </div>
                      <div className="font-semibold text-sm sm:text-base">{campaign.donorCount}</div>
                      <div className="text-[10px] sm:text-xs text-muted-foreground">Donors</div>
                    </div>
                    <div className="text-center p-2 sm:p-3 rounded-lg bg-secondary/50">
                      <div className="flex items-center justify-center gap-1 text-muted-foreground mb-0.5 sm:mb-1">
                        <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </div>
                      <div className="font-semibold text-sm sm:text-base">{campaign.daysLeft}</div>
                      <div className="text-[10px] sm:text-xs text-muted-foreground">Days Left</div>
                    </div>
                    <div className="text-center p-2 sm:p-3 rounded-lg bg-secondary/50">
                      <div className="flex items-center justify-center gap-1 text-muted-foreground mb-0.5 sm:mb-1">
                        <Target className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </div>
                      <div className="font-semibold text-sm sm:text-base">{campaign.milestoneCount}</div>
                      <div className="text-[10px] sm:text-xs text-muted-foreground">Milestones</div>
                    </div>
                  </div>

                  {/* Donation Form */}
                  {campaign.isActive ? (
                    <div className="space-y-3 sm:space-y-4">
                      <div>
                        <label className="text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 block">
                          Donation Amount (STX)
                        </label>
                        <Input
                          type="number"
                          placeholder="0.00"
                          value={donationAmount}
                          onChange={(e) => setDonationAmount(e.target.value)}
                          className="bg-secondary/50 text-base sm:text-lg h-10 sm:h-12"
                        />
                        <div className="flex gap-1.5 sm:gap-2 mt-1.5 sm:mt-2">
                          {[10, 50, 100, 500].map((amount) => (
                            <Button
                              key={amount}
                              variant="outline"
                              size="sm"
                              onClick={() => setDonationAmount(amount.toString())}
                              className="flex-1 text-xs sm:text-sm h-8 sm:h-9"
                            >
                              {amount}
                            </Button>
                          ))}
                        </div>
                      </div>
                      
                      <Button
                        size="lg"
                        variant="gradient"
                        className="w-full h-10 sm:h-12 text-sm sm:text-base"
                        onClick={handleDonate}
                      >
                        <Wallet className="h-4 w-4" />
                        Donate Now
                      </Button>

                      <p className="text-[10px] sm:text-xs text-muted-foreground text-center">
                        Min: 1 STX • Max: 10,000 STX per donation
                      </p>
                    </div>
                  ) : (
                    <div className="text-center py-3 sm:py-4">
                      <AlertCircle className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground mx-auto mb-1.5 sm:mb-2" />
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        This campaign has ended
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Trust Indicators */}
              <Card className="glass-card">
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-success/20 flex items-center justify-center">
                      <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-success" />
                    </div>
                    <div>
                      <div className="font-medium text-sm sm:text-base">Verified on-chain</div>
                      <div className="text-[10px] sm:text-xs text-muted-foreground">
                        All transactions are transparent
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          </SkeletonTransition>
        </div>
      </main>

      <Footer />
    </div>
  );
}
