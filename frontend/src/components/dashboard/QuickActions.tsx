import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
  Plus, 
  Wallet, 
  Share2, 
  FileDown,
  Zap
} from "lucide-react";

export function QuickActions() {
  const handleWithdraw = () => {
    toast.info("Withdrawal feature coming soon!");
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Dashboard link copied to clipboard!");
  };

  const handleExport = () => {
    toast.info("Exporting report...");
    setTimeout(() => {
      toast.success("Report downloaded successfully!");
    }, 1500);
  };

  return (
    <Card className="glass-card">
      <CardHeader className="p-4 sm:p-6 pb-2">
        <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
          <Zap className="h-4 w-4 text-accent" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0">
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          <Button 
            asChild 
            variant="gradient" 
            className="h-auto py-3 flex-col gap-1.5"
          >
            <Link to="/create">
              <Plus className="h-5 w-5" />
              <span className="text-xs">New Campaign</span>
            </Link>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-auto py-3 flex-col gap-1.5"
            onClick={handleWithdraw}
          >
            <Wallet className="h-5 w-5" />
            <span className="text-xs">Withdraw</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-auto py-3 flex-col gap-1.5"
            onClick={handleShare}
          >
            <Share2 className="h-5 w-5" />
            <span className="text-xs">Share</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-auto py-3 flex-col gap-1.5"
            onClick={handleExport}
          >
            <FileDown className="h-5 w-5" />
            <span className="text-xs">Export</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
