import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { LoadingButton } from "@/components/ui/loading-button";
import { toast } from "sonner";
import { Settings, Trash2, AlertTriangle } from "lucide-react";

interface CampaignSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaign: {
    id: string;
    title: string;
    description: string;
    goal: number;
    minDonation?: number;
    maxDonation?: number;
  };
  onSave?: (data: {
    title: string;
    description: string;
    minDonation: number;
    maxDonation: number;
  }) => void;
  onDelete?: () => void;
}

export function CampaignSettingsDialog({
  open,
  onOpenChange,
  campaign,
  onSave,
  onDelete,
}: CampaignSettingsDialogProps) {
  const [title, setTitle] = useState(campaign.title);
  const [description, setDescription] = useState(campaign.description);
  const [minDonation, setMinDonation] = useState(String(campaign.minDonation || 1));
  const [maxDonation, setMaxDonation] = useState(String(campaign.maxDonation || 10000));
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!description.trim()) {
      toast.error("Description is required");
      return;
    }
    if (Number(minDonation) >= Number(maxDonation)) {
      toast.error("Maximum donation must be greater than minimum");
      return;
    }

    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    onSave?.({
      title,
      description,
      minDonation: Number(minDonation),
      maxDonation: Number(maxDonation),
    });
    
    toast.success("Campaign settings updated successfully");
    setIsSaving(false);
    onOpenChange(false);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    onDelete?.();
    toast.success("Campaign archived successfully");
    setIsDeleting(false);
    setShowDeleteConfirm(false);
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              Campaign Settings
            </DialogTitle>
            <DialogDescription>
              Edit your campaign details and settings
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="settings-title">Campaign Title</Label>
              <Input
                id="settings-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-secondary/50"
                aria-describedby="title-hint"
              />
              <p id="title-hint" className="text-xs text-muted-foreground">
                5-100 characters
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="settings-description">Description</Label>
              <Textarea
                id="settings-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-secondary/50 min-h-[100px]"
                aria-describedby="description-hint"
              />
              <p id="description-hint" className="text-xs text-muted-foreground">
                Describe your campaign goals and how funds will be used
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="settings-min">Min Donation (STX)</Label>
                <Input
                  id="settings-min"
                  type="number"
                  value={minDonation}
                  onChange={(e) => setMinDonation(e.target.value)}
                  className="bg-secondary/50"
                  min="1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="settings-max">Max Donation (STX)</Label>
                <Input
                  id="settings-max"
                  type="number"
                  value={maxDonation}
                  onChange={(e) => setMaxDonation(e.target.value)}
                  className="bg-secondary/50"
                  min="1"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <h4 className="text-sm font-medium text-destructive mb-2 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Danger Zone
              </h4>
              <p className="text-xs text-muted-foreground mb-3">
                Archiving a campaign will hide it from public view. This action can be undone.
              </p>
              <Button
                variant="outline"
                className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                onClick={() => setShowDeleteConfirm(true)}
              >
                <Trash2 className="h-4 w-4" />
                Archive Campaign
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <LoadingButton
              isLoading={isSaving}
              loadingText="Saving..."
              onClick={handleSave}
            >
              Save Changes
            </LoadingButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Archive this campaign?</AlertDialogTitle>
            <AlertDialogDescription>
              This will hide your campaign from public view. Existing donors will still be able to see their contribution history. You can restore the campaign later from your dashboard.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <LoadingButton
              variant="destructive"
              isLoading={isDeleting}
              loadingText="Archiving..."
              onClick={handleDelete}
            >
              Archive Campaign
            </LoadingButton>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
