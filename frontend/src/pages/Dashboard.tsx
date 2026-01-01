import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useCampaign, useDonorContribution } from "@/hooks/useCampaign";
import { useWallet } from "@/hooks/useWallet";
import { formatStx } from "@/lib/contract";
import { DonationTrendChart, CategoryDistributionChart } from "@/components/dashboard/DashboardCharts";
import { WelcomeHeader } from "@/components/dashboard/WelcomeHeader";
import { EnhancedStatCard } from "@/components/dashboard/EnhancedStatCard";
import { GoalProgressRing } from "@/components/dashboard/GoalProgressRing";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { ScrollReveal } from "@/hooks/useScrollReveal";
import { toast } from "sonner";
import { SkeletonTransition } from "@/components/ui/skeleton-transition";
import { DashboardPageSkeleton } from "@/components/skeletons";
import { 
  Plus, 
  TrendingUp, 
  Users, 
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Target,
  ExternalLink,
  MoreVertical,
  Pause,
  Play,
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";

const userStats = {
  totalRaised: 77500000000,
  totalDonated: 12500000000,
  activeCampaigns: 2,
  totalDonors: 512,
  fundingGoal: 100000000000,
};

// Sparkline data for each stat (last 7 days trend)
const sparklineData = {
  raised: [45000, 52000, 48000, 61000, 58000, 72000, 77500],
  donated: [8000, 9500, 10200, 11000, 11800, 12000, 12500],
  campaigns: [1, 1, 1, 2, 2, 2, 2],
  donors: [380, 410, 435, 460, 485, 500, 512],
};

const userCampaigns = mockCampaigns.slice(0, 2);

const userDonations = [
  { campaignId: "3", campaignTitle: "Rainforest Conservation DAO", amount: 5000000000, date: "2024-01-15", status: "active" },
  { campaignId: "4", campaignTitle: "Decentralized Healthcare Records", amount: 2500000000, date: "2024-01-10", status: "active" },
  { campaignId: "5", campaignTitle: "NFT Art Gallery for Emerging Artists", amount: 5000000000, date: "2023-12-20", status: "completed" },
];

const recentActivity = [
  { type: "donation_received", amount: 5000000000, from: "ST1P...ZGZM", campaign: "DeFi Education Platform", time: "2 hours ago" },
  { type: "donation_made", amount: 2500000000, to: "Rainforest DAO", time: "5 hours ago" },
  { type: "milestone_reached", campaign: "DeFi Education Platform", milestone: "Development Phase 1", time: "1 day ago" },
  { type: "donation_received", amount: 10000000000, from: "ST2C...K9AG", campaign: "DeFi Education Platform", time: "2 days ago" },
];

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate initial data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20 pb-12 sm:pt-24 sm:pb-16">
        <div className="container mx-auto px-4">
          <SkeletonTransition
            isLoading={isLoading}
            skeleton={<DashboardPageSkeleton />}
            duration={400}
          >
            {/* Welcome Header */}
            <ScrollReveal>
              <WelcomeHeader 
                userName="Creator" 
                weeklyChange={12}
                totalRaised={userStats.totalRaised / 1000000}
              />
            </ScrollReveal>

            {/* Stats Overview with Sparklines */}
            <ScrollReveal delay={50}>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
                <EnhancedStatCard
                  title="STX Raised"
                  value={userStats.totalRaised / 1000000}
                  suffix="K"
                  decimals={1}
                  change={12}
                  icon={TrendingUp}
                  iconColor="text-primary"
                  sparklineData={sparklineData.raised}
                  sparklineColor="hsl(187, 95%, 50%)"
                />
                <EnhancedStatCard
                  title="STX Donated"
                  value={userStats.totalDonated / 1000000}
                  suffix="K"
                  decimals={1}
                  change={8}
                  icon={Wallet}
                  iconColor="text-accent"
                  sparklineData={sparklineData.donated}
                  sparklineColor="hsl(280, 70%, 60%)"
                />
                <EnhancedStatCard
                  title="Active Campaigns"
                  value={userStats.activeCampaigns}
                  icon={Target}
                  iconColor="text-success"
                  sparklineData={sparklineData.campaigns}
                  sparklineColor="hsl(142, 76%, 45%)"
                />
                <EnhancedStatCard
                  title="Total Donors"
                  value={userStats.totalDonors}
                  change={5}
                  icon={Users}
                  iconColor="text-blue-500"
                  sparklineData={sparklineData.donors}
                  sparklineColor="hsl(217, 91%, 60%)"
                />
              </div>
            </ScrollReveal>

            {/* Charts + Goal Progress + Quick Actions */}
            <ScrollReveal delay={100}>
              <div className="grid lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
                <div className="lg:col-span-2">
                  <DonationTrendChart />
                </div>
                <div>
                  <CategoryDistributionChart />
                </div>
                <div className="space-y-3 sm:space-y-4">
                  <GoalProgressRing 
                    current={userStats.totalRaised / 1000000} 
                    goal={userStats.fundingGoal / 1000000}
                  />
                  <QuickActions />
                </div>
              </div>
            </ScrollReveal>

          {/* Main Content */}
          <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {/* Campaigns & Donations */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="campaigns" className="space-y-4 sm:space-y-6">
                <TabsList className="bg-secondary/50">
                  <TabsTrigger value="campaigns">My Campaigns</TabsTrigger>
                  <TabsTrigger value="donations">My Donations</TabsTrigger>
                </TabsList>

                <TabsContent value="campaigns" className="space-y-3 sm:space-y-4">
                  {userCampaigns.map((campaign) => {
                    const progress = (campaign.raised / campaign.goal) * 100;
                    return (
                      <Card key={campaign.id} className="glass-card">
                        <CardContent className="p-4 sm:p-5 lg:p-6">
                          <div className="flex gap-3 sm:gap-4">
                            <img
                              src={campaign.imageUrl}
                              alt={campaign.title}
                              className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-lg object-cover"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <Link
                                    to={`/campaign/${campaign.id}`}
                                    className="font-heading font-semibold hover:text-primary transition-colors line-clamp-1"
                                  >
                                    {campaign.title}
                                  </Link>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Badge variant="outline" className="text-xs">
                                      {campaign.category}
                                    </Badge>
                                    {campaign.isActive ? (
                                      <Badge className="bg-success/20 text-success border-success/30 text-xs">
                                        Active
                                      </Badge>
                                    ) : (
                                      <Badge variant="secondary" className="text-xs">
                                        Ended
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                                <Button variant="ghost" size="icon" className="shrink-0">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </div>

                              <div className="mt-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">
                                    {(campaign.raised / 1000000).toLocaleString()} / {(campaign.goal / 1000000).toLocaleString()} STX
                                  </span>
                                  <span className="text-primary font-medium">
                                    {progress.toFixed(0)}%
                                  </span>
                                </div>
                                <Progress value={progress} className="h-2" />
                              </div>

                              <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Users className="h-3 w-3" />
                                  {campaign.donorCount} donors
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {campaign.daysLeft}d left
                                </span>
                                <span className="flex items-center gap-1">
                                  <Target className="h-3 w-3" />
                                  {campaign.milestoneCount} milestones
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-3 pt-3 sm:mt-4 sm:pt-4 border-t border-border/50">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="gap-1"
                              onClick={(e) => {
                                e.preventDefault();
                                toast.info("Opening campaign settings...");
                              }}
                            >
                              <Settings className="h-3 w-3" />
                              Manage
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="gap-1"
                              onClick={(e) => {
                                e.preventDefault();
                                if (campaign.isActive) {
                                  toast.warning("Campaign paused. Donations are temporarily disabled.");
                                } else {
                                  toast.success("Campaign resumed. Now accepting donations!");
                                }
                              }}
                            >
                              {campaign.isActive ? (
                                <>
                                  <Pause className="h-3 w-3" />
                                  Pause
                                </>
                              ) : (
                                <>
                                  <Play className="h-3 w-3" />
                                  Resume
                                </>
                              )}
                            </Button>
                            <Button variant="outline" size="sm" asChild className="gap-1">
                              <Link to={`/campaign/${campaign.id}`}>
                                View
                                <ExternalLink className="h-3 w-3" />
                              </Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}

                  {userCampaigns.length === 0 && (
                    <Card className="glass-card">
                      <CardContent className="p-8 sm:p-10 lg:p-12 text-center">
                        <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="font-heading text-lg font-semibold mb-2">
                          No campaigns yet
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          Create your first campaign and start raising funds.
                        </p>
                        <Button asChild variant="gradient">
                          <Link to="/create">
                            <Plus className="h-4 w-4" />
                            Create Campaign
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="donations" className="space-y-3 sm:space-y-4">
                  {userDonations.map((donation, index) => (
                    <Card key={index} className="glass-card">
                      <CardContent className="p-4 sm:p-5 lg:p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <Link
                              to={`/campaign/${donation.campaignId}`}
                              className="font-medium hover:text-primary transition-colors"
                            >
                              {donation.campaignTitle}
                            </Link>
                            <div className="text-sm text-muted-foreground mt-1">
                              Donated on {new Date(donation.date).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-heading font-semibold text-primary">
                              {(donation.amount / 1000000).toLocaleString()} STX
                            </div>
                            <Badge
                              variant={donation.status === "active" ? "default" : "secondary"}
                              className="mt-1"
                            >
                              {donation.status === "active" ? "Campaign Active" : "Completed"}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>
              </Tabs>
            </div>

            {/* Activity Feed */}
            <div>
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  <div className="space-y-3 sm:space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div
                        key={index}
                        className={cn(
                          "flex gap-2 sm:gap-3 pb-3 sm:pb-4",
                          index < recentActivity.length - 1 && "border-b border-border/50"
                        )}
                      >
                        <div className={cn(
                          "w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0",
                          activity.type === "donation_received" && "bg-success/20",
                          activity.type === "donation_made" && "bg-accent/20",
                          activity.type === "milestone_reached" && "bg-primary/20"
                        )}>
                          {activity.type === "donation_received" && (
                            <ArrowDownRight className="h-3 w-3 sm:h-4 sm:w-4 text-success" />
                          )}
                          {activity.type === "donation_made" && (
                            <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4 text-accent" />
                          )}
                          {activity.type === "milestone_reached" && (
                            <Target className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                          )}
                        </div>
                        <div className="min-w-0">
                          {activity.type === "donation_received" && (
                            <>
                              <p className="text-sm">
                                <span className="font-medium">{activity.from}</span> donated{" "}
                                <span className="text-success font-medium">
                                  {(activity.amount! / 1000000).toLocaleString()} STX
                                </span>
                              </p>
                              <p className="text-xs text-muted-foreground truncate">
                                {activity.campaign}
                              </p>
                            </>
                          )}
                          {activity.type === "donation_made" && (
                            <>
                              <p className="text-sm">
                                You donated{" "}
                                <span className="text-accent font-medium">
                                  {(activity.amount! / 1000000).toLocaleString()} STX
                                </span>
                              </p>
                              <p className="text-xs text-muted-foreground truncate">
                                to {activity.to}
                              </p>
                            </>
                          )}
                          {activity.type === "milestone_reached" && (
                            <>
                              <p className="text-sm">
                                Milestone reached:{" "}
                                <span className="text-primary font-medium">
                                  {activity.milestone}
                                </span>
                              </p>
                              <p className="text-xs text-muted-foreground truncate">
                                {activity.campaign}
                              </p>
                            </>
                          )}
                          <p className="text-xs text-muted-foreground mt-1">
                            {activity.time}
                          </p>
                        </div>
                      </div>
                    ))}
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
