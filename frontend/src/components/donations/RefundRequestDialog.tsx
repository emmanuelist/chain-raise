import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { LoadingButton } from "@/components/ui/loading-button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { AlertTriangle, RotateCcw } from "lucide-react";

interface RefundRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  donation: {
    id: string;
    campaignTitle: string;
    amount: number;
    date: string;
  };
  onSubmit?: (data: { reason: string; details: string }) => void;
}

const refundReasons = [
  { id: "milestone", label: "Milestone not met", description: "A promised milestone has not been delivered" },
  { id: "suspicious", label: "Suspicious activity", description: "I have concerns about how funds are being used" },
  { id: "changed_mind", label: "Changed my mind", description: "I no longer wish to support this campaign" },
  { id: "other", label: "Other reason", description: "I have another reason for requesting a refund" },
];

export function RefundRequestDialog({
  open,
  onOpenChange,
  donation,
  onSubmit,
}: RefundRequestDialogProps) {
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!reason) {
      toast.error("Please select a reason for your refund request");
      return;
    }
    if (reason === "other" && !details.trim()) {
      toast.error("Please provide details for your refund request");
      return;
    }
    if (!agreedToTerms) {
      toast.error("Please agree to the refund terms");
      return;
    }

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    onSubmit?.({ reason, details });
    toast.success("Refund request submitted! You'll receive a response within 48 hours.");
    
    // Reset form
    setReason("");
    setDetails("");
    setAgreedToTerms(false);
    setIsSubmitting(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RotateCcw className="h-5 w-5 text-primary" />
            Request Refund
          </DialogTitle>
          <DialogDescription>
            Submit a refund request for your donation
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Donation Info */}
          <div className="p-4 rounded-lg bg-secondary/30 border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{donation.campaignTitle}</p>
                <p className="text-sm text-muted-foreground">
                  Donated on {new Date(donation.date).toLocaleDateString()}
                </p>
              </div>
              <Badge variant="outline" className="text-primary">
                {(donation.amount / 1000000).toLocaleString()} STX
              </Badge>
            </div>
          </div>

          {/* Warning */}
          <div className="flex gap-3 p-3 rounded-lg bg-warning/10 border border-warning/30">
            <AlertTriangle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-warning">Important Notice</p>
              <p className="text-muted-foreground mt-1">
                Refunds are subject to review by the campaign creator and platform. Refunds for milestones already completed may not be approved.
              </p>
            </div>
          </div>

          {/* Reason Selection */}
          <div className="space-y-3">
            <Label>Reason for Refund Request</Label>
            <RadioGroup value={reason} onValueChange={setReason}>
              {refundReasons.map((r) => (
                <div
                  key={r.id}
                  className="flex items-start space-x-3 p-3 rounded-lg border border-border hover:bg-secondary/30 transition-colors"
                >
                  <RadioGroupItem value={r.id} id={r.id} className="mt-0.5" />
                  <div className="flex-1">
                    <Label htmlFor={r.id} className="cursor-pointer font-medium">
                      {r.label}
                    </Label>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {r.description}
                    </p>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Additional Details */}
          <div className="space-y-2">
            <Label htmlFor="refund-details">
              Additional Details {reason === "other" && <span className="text-destructive">*</span>}
            </Label>
            <Textarea
              id="refund-details"
              placeholder="Please provide any additional information that might help us process your request..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="min-h-[100px] bg-secondary/50"
            />
          </div>

          {/* Terms Agreement */}
          <div className="flex items-start space-x-3">
            <Checkbox
              id="refund-terms"
              checked={agreedToTerms}
              onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
            />
            <div className="text-sm">
              <Label htmlFor="refund-terms" className="cursor-pointer">
                I understand that refund requests are reviewed on a case-by-case basis and may take up to 48 hours to process. I agree to the platform's refund policy.
              </Label>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <LoadingButton
            isLoading={isSubmitting}
            loadingText="Submitting..."
            onClick={handleSubmit}
            disabled={!reason || !agreedToTerms}
          >
            Submit Request
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
