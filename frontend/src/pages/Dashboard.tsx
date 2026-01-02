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

export default function Dashboard() {
  const { address, isConnected } = useWallet();
  const { campaign, loading: campaignLoading } = useCampaign();
  const { contribution, loading: contributionLoading } = useDonorContribution(address || "");
  const [localCampaignData, setLocalCampaignData] = useState<any>(null);
  
  const isLoading = campaignLoading || contributionLoading;

  // Check for locally created campaign data
  useEffect(() => {
    const storedCampaign = localStorage.getItem('created-campaign');
    if (storedCampaign) {
      try {
        const data = JSON.parse(storedCampaign);
        setLocalCampaignData(data);
        // Show success message once
        if (!sessionStorage.getItem('campaign-message-shown')) {
          toast.success("Campaign details loaded", {
            description: `${data.title} - Goal: ${(data.goal / 1000000).toFixed(0)} STX`
          });
          sessionStorage.setItem('campaign-message-shown', 'true');
        }
      } catch (e) {
        console.error('Failed to parse campaign data:', e);
      }
    }
  }, []);

  // Show wallet connection prompt if not connected  
  useEffect(() => {
    if (!isConnected) {
      toast.info("Connect your wallet to view your dashboard");
    }
  }, [isConnected]);

  // User stats based on blockchain data
  const userStats = {
    totalRaised: campaign?.raised || 0,
    totalDonated: (contribution?.stx || 0) + (contribution?.sbtc || 0),
    activeCampaigns: campaign?.isActive ? 1 : 0,
    totalDonors: campaign?.donorCount || 0,
    fundingGoal: campaign?.goal || 0,
  };

  // Sparkline data (placeholder - would need historical data)
  const sparklineData = {
    raised: [0, 0, 0, 0, 0, 0, userStats.totalRaised / 1000000],
    donated: [0, 0, 0, 0, 0, 0, userStats.totalDonated / 1000000],
    campaigns: [0, 0, 0, 0, 0, 0, userStats.activeCampaigns],
    donors: [0, 0, 0, 0, 0, 0, userStats.totalDonors],
  };

  const userCampaigns = campaign ? [campaign] : [];

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
                  {isConnected && contribution && (contribution.stx > 0 || contribution.sbtc > 0) ? (
                    <Card className="glass-card">
                      <CardContent className="p-4 sm:p-5 lg:p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <Link
                              to="/explore"
                              className="font-medium hover:text-primary transition-colors"
                            >
                              Your Contribution
                            </Link>
                            <div className="text-sm text-muted-foreground mt-1">
                              Total donated to campaigns
                            </div>
                          </div>
                          <div className="text-right">
                            {contribution.stx > 0 && (
                              <div className="font-heading font-semibold text-primary">
                                {(contribution.stx / 1000000).toLocaleString()} STX
                              </div>
                            )}
                            {contribution.sbtc > 0 && (
                              <div className="font-heading font-semibold text-orange-500 text-sm">
                                {(contribution.sbtc / 100000000).toFixed(6)} sBTC
                              </div>
                            )}
                            <Badge variant="default" className="mt-1">
                              Active Donor
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card className="glass-card">
                      <CardContent className="p-8 text-center">
                        <Wallet className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="font-heading text-lg font-semibold mb-2">No Donations Yet</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          {isConnected 
                            ? "Start supporting campaigns to see your donation history here."
                            : "Connect your wallet to view your donations."
                          }
                        </p>
                        <Link to="/explore">
                          <Button>
                            Explore Campaigns
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
              </Tabs>
            </div>

            {/* Activity Feed */}
            <div>
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Campaign Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  {campaign ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-border/50">
                        <div>
                          <p className="text-sm font-medium">{campaign.title}</p>
                          <p className="text-xs text-muted-foreground">{campaign.category}</p>
                        </div>
                        <Badge variant={campaign.isActive ? "default" : "secondary"}>
                          {campaign.isActive ? "Active" : "Ended"}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground">Goal</p>
                          <p className="text-sm font-semibold text-primary">
                            {(campaign.goal / 1000000).toLocaleString()} STX
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Raised</p>
                          <p className="text-sm font-semibold text-success">
                            {(campaign.raised / 1000000).toLocaleString()} STX
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Donors</p>
                          <p className="text-sm font-semibold">{campaign.donorCount}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Days Left</p>
                          <p className="text-sm font-semibold">{campaign.daysLeft}</p>
                        </div>
                      </div>

                      <Link to={`/campaign/${campaign.id}`} className="block">
                        <Button variant="outline" className="w-full">
                          View Campaign
                          <ArrowUpRight className="h-4 w-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-sm text-muted-foreground">
                        No active campaigns found
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Locally Created Campaign Draft */}
              {localCampaignData && (
                <Card className="glass-card mt-4">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Rocket className="h-5 w-5 text-accent" />
                      Campaign Draft
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Campaign details you submitted (demo mode)
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6">
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium">{localCampaignData.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {localCampaignData.description}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {localCampaignData.category}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border/50">
                        <div>
                          <p className="text-xs text-muted-foreground">Goal</p>
                          <p className="text-sm font-semibold text-primary">
                            {(localCampaignData.goal / 1000000).toLocaleString()} STX
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Duration</p>
                          <p className="text-sm font-semibold">{localCampaignData.duration} days</p>
                        </div>
                      </div>

                      {localCampaignData.milestones?.length > 0 && (
                        <div className="pt-2">
                          <p className="text-xs font-medium mb-2">Milestones ({localCampaignData.milestones.length})</p>
                          <div className="space-y-1">
                            {localCampaignData.milestones.slice(0, 2).map((m: any, i: number) => (
                              <div key={i} className="flex justify-between text-xs">
                                <span className="text-muted-foreground truncate flex-1">{m.title}</span>
                                <span className="font-medium ml-2">{m.amount} STX</span>
                              </div>
                            ))}
                            {localCampaignData.milestones.length > 2 && (
                              <p className="text-xs text-muted-foreground">
                                +{localCampaignData.milestones.length - 2} more
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full mt-2"
                        onClick={() => {
                          localStorage.removeItem('created-campaign');
                          sessionStorage.removeItem('campaign-message-shown');
                          setLocalCampaignData(null);
                          toast.info("Campaign draft cleared");
                        }}
                      >
                        Clear Draft
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
          </SkeletonTransition>
        </div>
      </main>

      <Footer />
    </div>
  );
}
