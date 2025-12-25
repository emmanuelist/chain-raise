import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Rocket, 
  Plus, 
  Trash2, 
  Info,
  Target,
  Users,
  Clock,
  CheckCircle2
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const categories = [
  "Technology",
  "Environment",
  "Education",
  "Health",
  "Art",
  "Community",
];

interface Milestone {
  id: number;
  title: string;
  amount: string;
  description: string;
}

interface Beneficiary {
  id: number;
  address: string;
  percentage: string;
}

export default function CreateCampaign() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [goal, setGoal] = useState("");
  const [duration, setDuration] = useState("30");
  const [minDonation, setMinDonation] = useState("1");
  const [maxDonation, setMaxDonation] = useState("10000");
  
  const [milestones, setMilestones] = useState<Milestone[]>([
    { id: 1, title: "", amount: "", description: "" }
  ]);
  
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);

  const addMilestone = () => {
    setMilestones([
      ...milestones,
      { id: Date.now(), title: "", amount: "", description: "" }
    ]);
    toast.success("Milestone added");
  };

  const removeMilestone = (id: number) => {
    if (milestones.length > 1) {
      setMilestones(milestones.filter(m => m.id !== id));
      toast.info("Milestone removed");
    } else {
      toast.error("At least one milestone is required");
    }
  };

  const updateMilestone = (id: number, field: keyof Milestone, value: string) => {
    setMilestones(milestones.map(m => 
      m.id === id ? { ...m, [field]: value } : m
    ));
  };

  const addBeneficiary = () => {
    setBeneficiaries([
      ...beneficiaries,
      { id: Date.now(), address: "", percentage: "" }
    ]);
    toast.success("Beneficiary added");
  };

  const removeBeneficiary = (id: number) => {
    setBeneficiaries(beneficiaries.filter(b => b.id !== id));
    toast.info("Beneficiary removed");
  };

  const updateBeneficiary = (id: number, field: keyof Beneficiary, value: string) => {
    setBeneficiaries(beneficiaries.map(b => 
      b.id === id ? { ...b, [field]: value } : b
    ));
  };

  const handleSubmit = async () => {
    // Final validation
    if (!title.trim() || !description.trim() || !category || !goal) {
      toast.error("Please complete all required fields");
      return;
    }

    const totalBeneficiaryPercentage = beneficiaries.reduce((sum, b) => sum + (parseFloat(b.percentage) || 0), 0);
    if (totalBeneficiaryPercentage > 100) {
      toast.error("Beneficiary percentages cannot exceed 100%");
      return;
    }

    setIsSubmitting(true);
    
    // Simulate transaction
    toast.loading("Submitting transaction to blockchain...");
    await new Promise(resolve => setTimeout(resolve, 2000));
    toast.dismiss();
    
    toast.success("Campaign created successfully! Redirecting to dashboard...");
    setTimeout(() => navigate("/dashboard"), 1500);
  };

  const steps = [
    { number: 1, title: "Basic Info", icon: Info },
    { number: 2, title: "Milestones", icon: Target },
    { number: 3, title: "Beneficiaries", icon: Users },
    { number: 4, title: "Review", icon: CheckCircle2 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20 pb-12 sm:pt-24 sm:pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3">
              Create Your Campaign
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Launch a transparent, milestone-based crowdfunding campaign on Stacks.
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8 sm:mb-12 overflow-x-auto pb-2">
            {steps.map((s, index) => (
              <div key={s.number} className="flex items-center flex-shrink-0">
                <div
                  className={cn(
                    "flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full transition-all cursor-pointer",
                    step === s.number
                      ? "bg-primary text-primary-foreground"
                      : step > s.number
                      ? "bg-success/20 text-success"
                      : "bg-secondary text-muted-foreground"
                  )}
                  onClick={() => s.number < step && setStep(s.number)}
                >
                  <s.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline text-xs sm:text-sm font-medium">{s.title}</span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "w-4 sm:w-8 lg:w-16 h-0.5 mx-1 sm:mx-2",
                      step > s.number ? "bg-success" : "bg-border"
                    )}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Form Steps */}
          <Card className="glass-card">
            {/* Step 1: Basic Info */}
            {step === 1 && (
              <>
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="text-lg sm:text-xl">Campaign Details</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Tell us about your campaign and funding goals.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6 pt-0">
                  <div className="space-y-2">
                    <Label htmlFor="title">Campaign Title</Label>
                    <Input
                      id="title"
                      placeholder="Enter a compelling title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="bg-secondary/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your campaign, its goals, and how the funds will be used..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="bg-secondary/50 min-h-[150px]"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <Select value={category} onValueChange={setCategory}>
                        <SelectTrigger className="bg-secondary/50">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="goal">Funding Goal (STX)</Label>
                      <Input
                        id="goal"
                        type="number"
                        placeholder="50000"
                        value={goal}
                        onChange={(e) => setGoal(e.target.value)}
                        className="bg-secondary/50"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="duration">Duration (days)</Label>
                      <Input
                        id="duration"
                        type="number"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        className="bg-secondary/50"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="minDonation">Min Donation (STX)</Label>
                      <Input
                        id="minDonation"
                        type="number"
                        value={minDonation}
                        onChange={(e) => setMinDonation(e.target.value)}
                        className="bg-secondary/50"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="maxDonation">Max Donation (STX)</Label>
                      <Input
                        id="maxDonation"
                        type="number"
                        value={maxDonation}
                        onChange={(e) => setMaxDonation(e.target.value)}
                        className="bg-secondary/50"
                      />
                    </div>
                  </div>
                </CardContent>
              </>
            )}

            {/* Step 2: Milestones */}
            {step === 2 && (
              <>
                <CardHeader>
                  <CardTitle>Campaign Milestones</CardTitle>
                  <CardDescription>
                    Define milestones for fund releases. Funds will be released as you achieve each milestone.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {milestones.map((milestone, index) => (
                    <div
                      key={milestone.id}
                      className="p-4 rounded-lg bg-secondary/30 border border-border/50 space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-primary">
                          Milestone {index + 1}
                        </span>
                        {milestones.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeMilestone(milestone.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Title</Label>
                          <Input
                            placeholder="e.g., Development Phase 1"
                            value={milestone.title}
                            onChange={(e) => updateMilestone(milestone.id, "title", e.target.value)}
                            className="bg-secondary/50"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Amount (STX)</Label>
                          <Input
                            type="number"
                            placeholder="10000"
                            value={milestone.amount}
                            onChange={(e) => updateMilestone(milestone.id, "amount", e.target.value)}
                            className="bg-secondary/50"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea
                          placeholder="What will be achieved at this milestone?"
                          value={milestone.description}
                          onChange={(e) => updateMilestone(milestone.id, "description", e.target.value)}
                          className="bg-secondary/50"
                        />
                      </div>
                    </div>
                  ))}

                  <Button
                    variant="outline"
                    onClick={addMilestone}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4" />
                    Add Milestone
                  </Button>
                </CardContent>
              </>
            )}

            {/* Step 3: Beneficiaries */}
            {step === 3 && (
              <>
                <CardHeader>
                  <CardTitle>Beneficiaries (Optional)</CardTitle>
                  <CardDescription>
                    Add additional beneficiaries who will receive a percentage of the funds.
                    Leave empty if you're the sole beneficiary.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {beneficiaries.length === 0 ? (
                    <div className="text-center py-8 border-2 border-dashed border-border rounded-lg">
                      <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground mb-4">
                        No additional beneficiaries added.
                        <br />
                        You will receive 100% of the funds.
                      </p>
                      <Button variant="outline" onClick={addBeneficiary}>
                        <Plus className="h-4 w-4" />
                        Add Beneficiary
                      </Button>
                    </div>
                  ) : (
                    <>
                      {beneficiaries.map((beneficiary, index) => (
                        <div
                          key={beneficiary.id}
                          className="p-4 rounded-lg bg-secondary/30 border border-border/50 space-y-4"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-primary">
                              Beneficiary {index + 1}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeBeneficiary(beneficiary.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="grid md:grid-cols-3 gap-4">
                            <div className="md:col-span-2 space-y-2">
                              <Label>Stacks Address</Label>
                              <Input
                                placeholder="ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM"
                                value={beneficiary.address}
                                onChange={(e) => updateBeneficiary(beneficiary.id, "address", e.target.value)}
                                className="bg-secondary/50 font-mono text-sm"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Percentage (%)</Label>
                              <Input
                                type="number"
                                placeholder="25"
                                value={beneficiary.percentage}
                                onChange={(e) => updateBeneficiary(beneficiary.id, "percentage", e.target.value)}
                                className="bg-secondary/50"
                              />
                            </div>
                          </div>
                        </div>
                      ))}

                      <Button
                        variant="outline"
                        onClick={addBeneficiary}
                        className="w-full"
                      >
                        <Plus className="h-4 w-4" />
                        Add Another Beneficiary
                      </Button>
                    </>
                  )}
                </CardContent>
              </>
            )}

            {/* Step 4: Review */}
            {step === 4 && (
              <>
                <CardHeader>
                  <CardTitle>Review Your Campaign</CardTitle>
                  <CardDescription>
                    Double-check all details before launching. This will create a transaction on-chain.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Summary */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg">Campaign Details</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between py-2 border-b border-border/50">
                          <span className="text-muted-foreground">Title</span>
                          <span className="font-medium">{title || "Not set"}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-border/50">
                          <span className="text-muted-foreground">Category</span>
                          <span className="font-medium">{category || "Not set"}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-border/50">
                          <span className="text-muted-foreground">Goal</span>
                          <span className="font-medium text-primary">{goal || "0"} STX</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-border/50">
                          <span className="text-muted-foreground">Duration</span>
                          <span className="font-medium">{duration} days</span>
                        </div>
                        <div className="flex justify-between py-2">
                          <span className="text-muted-foreground">Donation Range</span>
                          <span className="font-medium">{minDonation} - {maxDonation} STX</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg">Milestones</h3>
                      <div className="space-y-2">
                        {milestones.filter(m => m.title).map((m, i) => (
                          <div key={m.id} className="flex justify-between text-sm py-2 border-b border-border/50">
                            <span className="text-muted-foreground">{i + 1}. {m.title}</span>
                            <span className="font-medium text-primary">{m.amount} STX</span>
                          </div>
                        ))}
                        {milestones.every(m => !m.title) && (
                          <p className="text-sm text-muted-foreground">No milestones defined</p>
                        )}
                      </div>

                      <h3 className="font-semibold text-lg pt-4">Beneficiaries</h3>
                      {beneficiaries.length > 0 ? (
                        <div className="space-y-2">
                          {beneficiaries.map((b, i) => (
                            <div key={b.id} className="flex justify-between text-sm py-2 border-b border-border/50">
                              <span className="text-muted-foreground font-mono">
                                {b.address.slice(0, 8)}...{b.address.slice(-4)}
                              </span>
                              <span className="font-medium">{b.percentage}%</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          You (100%)
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Warning */}
                  <div className="p-4 rounded-lg bg-warning/10 border border-warning/30 flex gap-3">
                    <Info className="h-5 w-5 text-warning shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-warning mb-1">Important</p>
                      <p className="text-muted-foreground">
                        Once created, campaign parameters cannot be modified. Make sure all details are correct
                        before proceeding. A small network fee will be charged for the transaction.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </>
            )}

            {/* Navigation */}
            <div className="p-6 pt-0 flex justify-between">
              {step > 1 ? (
                <Button variant="outline" onClick={() => setStep(step - 1)}>
                  Previous
                </Button>
              ) : (
                <div />
              )}
              
              {step < 4 ? (
                <Button variant="gradient" onClick={() => {
                  if (step === 1) {
                    if (!title.trim()) {
                      toast.error("Please enter a campaign title");
                      return;
                    }
                    if (!description.trim()) {
                      toast.error("Please enter a campaign description");
                      return;
                    }
                    if (!category) {
                      toast.error("Please select a category");
                      return;
                    }
                    if (!goal || parseFloat(goal) <= 0) {
                      toast.error("Please enter a valid funding goal");
                      return;
                    }
                  }
                  if (step === 2) {
                    const incompleteMilestone = milestones.find(m => !m.title.trim() || !m.amount);
                    if (incompleteMilestone) {
                      toast.error("Please complete all milestone details");
                      return;
                    }
                  }
                  setStep(step + 1);
                }}>
                  Continue
                </Button>
              ) : (
                <Button
                  variant="accent"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-4 w-4 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Rocket className="h-4 w-4" />
                      Launch Campaign
                    </>
                  )}
                </Button>
              )}
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
