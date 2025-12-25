import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { LoadingButton } from "@/components/ui/loading-button";
import { toast } from "sonner";
import { 
  Target, 
  Users, 
  MessageSquare, 
  CheckCircle2, 
  Circle,
  Wallet,
  Send
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Milestone {
  id: number;
  title: string;
  amount: number;
  completed: boolean;
  description: string;
}

interface Donor {
  address: string;
  amount: number;
  date: string;
}

interface CampaignManageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaign: {
    id: string;
    title: string;
    goal: number;
    raised: number;
  };
  milestones?: Milestone[];
  donors?: Donor[];
}

const mockMilestones: Milestone[] = [
  { id: 1, title: "Research & Planning", amount: 10000000000, completed: true, description: "Complete market research" },
  { id: 2, title: "Development Phase 1", amount: 20000000000, completed: false, description: "Build core features" },
  { id: 3, title: "Beta Launch", amount: 30000000000, completed: false, description: "Launch beta version" },
];

const mockDonors: Donor[] = [
  { address: "ST1P...ZGZM", amount: 5000000000, date: "2024-01-15" },
  { address: "ST2C...K9AG", amount: 10000000000, date: "2024-01-14" },
  { address: "ST3A...GCS0", amount: 2500000000, date: "2024-01-13" },
];

export function CampaignManageDialog({
  open,
  onOpenChange,
  campaign,
  milestones = mockMilestones,
  donors = mockDonors,
}: CampaignManageDialogProps) {
  const [updateText, setUpdateText] = useState("");
  const [isPostingUpdate, setIsPostingUpdate] = useState(false);
  const [isCompletingMilestone, setIsCompletingMilestone] = useState<number | null>(null);

  const handlePostUpdate = async () => {
    if (!updateText.trim()) {
      toast.error("Please enter an update message");
      return;
    }
    
    setIsPostingUpdate(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success("Update posted successfully! Donors will be notified.");
    setUpdateText("");
    setIsPostingUpdate(false);
  };

  const handleCompleteMilestone = async (milestoneId: number) => {
    setIsCompletingMilestone(milestoneId);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    toast.success("Milestone marked as complete! Funds released.");
    setIsCompletingMilestone(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Manage Campaign
          </DialogTitle>
          <DialogDescription>
            {campaign.title}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="milestones" className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="milestones" className="gap-2">
              <Target className="h-4 w-4" />
              <span className="hidden sm:inline">Milestones</span>
            </TabsTrigger>
            <TabsTrigger value="donors" className="gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Donors</span>
            </TabsTrigger>
            <TabsTrigger value="updates" className="gap-2">
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline">Updates</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="milestones" className="mt-4 space-y-4">
            {milestones.map((milestone, index) => (
              <div
                key={milestone.id}
                className={cn(
                  "p-4 rounded-lg border transition-colors",
                  milestone.completed
                    ? "bg-success/10 border-success/30"
                    : "bg-secondary/30 border-border"
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {milestone.completed ? (
                        <CheckCircle2 className="h-5 w-5 text-success" />
                      ) : (
                        <Circle className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium">{milestone.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {milestone.description}
                      </p>
                      <p className="text-sm text-primary mt-2">
                        {(milestone.amount / 1000000).toLocaleString()} STX
                      </p>
                    </div>
                  </div>
                  {!milestone.completed && index === milestones.findIndex((m) => !m.completed) && (
                    <LoadingButton
                      size="sm"
                      isLoading={isCompletingMilestone === milestone.id}
                      loadingText="Completing..."
                      onClick={() => handleCompleteMilestone(milestone.id)}
                    >
                      Complete
                    </LoadingButton>
                  )}
                  {milestone.completed && (
                    <Badge variant="secondary" className="bg-success/20 text-success">
                      Completed
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="donors" className="mt-4 space-y-3">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-medium text-muted-foreground">
                {donors.length} total donors
              </h4>
              <span className="text-sm text-primary font-medium">
                {(donors.reduce((sum, d) => sum + d.amount, 0) / 1000000).toLocaleString()} STX raised
              </span>
            </div>
            {donors.map((donor, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border/50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <Wallet className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{donor.address}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(donor.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <span className="text-sm font-medium text-primary">
                  {(donor.amount / 1000000).toLocaleString()} STX
                </span>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="updates" className="mt-4 space-y-4">
            <div className="space-y-3">
              <Label htmlFor="update">Post Campaign Update</Label>
              <Textarea
                id="update"
                placeholder="Share progress updates with your donors..."
                value={updateText}
                onChange={(e) => setUpdateText(e.target.value)}
                className="min-h-[120px] bg-secondary/50"
              />
              <LoadingButton
                className="w-full sm:w-auto"
                isLoading={isPostingUpdate}
                loadingText="Posting..."
                onClick={handlePostUpdate}
              >
                <Send className="h-4 w-4" />
                Post Update
              </LoadingButton>
            </div>

            <div className="pt-4 border-t border-border">
              <h4 className="text-sm font-medium mb-3">Previous Updates</h4>
              <div className="text-center py-6 text-muted-foreground text-sm">
                No updates posted yet
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
