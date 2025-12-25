import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  ChevronDown, 
  Sparkles,
  TrendingUp 
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface WelcomeHeaderProps {
  userName?: string;
  weeklyChange?: number;
  totalRaised?: number;
}

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

const dateRanges = [
  { label: "This Week", value: "week" },
  { label: "This Month", value: "month" },
  { label: "Last 3 Months", value: "quarter" },
  { label: "All Time", value: "all" },
];

export function WelcomeHeader({ 
  userName = "Creator", 
  weeklyChange = 12,
  totalRaised = 77500
}: WelcomeHeaderProps) {
  const [selectedRange, setSelectedRange] = useState(dateRanges[1]);

  return (
    <Card className="glass-card overflow-hidden mb-6 sm:mb-8">
      <CardContent className="p-4 sm:p-6 relative">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary/10 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-accent/10 to-transparent rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h2 className="font-heading text-xl sm:text-2xl lg:text-3xl font-bold">
                {getGreeting()}, {userName}! 
              </h2>
              <Sparkles className="h-5 w-5 text-accent animate-pulse" />
            </div>
            
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="bg-success/10 text-success border-success/30 gap-1">
                <TrendingUp className="h-3 w-3" />
                +{weeklyChange}% this week
              </Badge>
              <span className="text-sm text-muted-foreground">
                You've raised <span className="text-primary font-semibold">{(totalRaised / 1000).toFixed(1)}K STX</span> total
              </span>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2 w-full sm:w-auto">
                <Calendar className="h-4 w-4" />
                {selectedRange.label}
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {dateRanges.map((range) => (
                <DropdownMenuItem
                  key={range.value}
                  onClick={() => setSelectedRange(range)}
                  className={selectedRange.value === range.value ? "bg-primary/10" : ""}
                >
                  {range.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}
