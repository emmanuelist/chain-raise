import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, TrendingUp, Sparkles } from "lucide-react";
import { AnimatedCounter } from "@/components/ui/animated-counter";

interface GoalProgressRingProps {
  current: number;
  goal: number;
  title?: string;
}

export function GoalProgressRing({ 
  current, 
  goal, 
  title = "Funding Goal" 
}: GoalProgressRingProps) {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const percentage = Math.min((current / goal) * 100, 100);
  const remaining = Math.max(goal - current, 0);
  
  // SVG circle calculations
  const size = 160;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (animatedProgress / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(percentage);
    }, 300);
    return () => clearTimeout(timer);
  }, [percentage]);

  const isComplete = percentage >= 100;

  return (
    <Card className="glass-card">
      <CardHeader className="p-4 sm:p-6 pb-2">
        <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
          <Target className="h-4 w-4 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0">
        <div className="flex flex-col items-center">
          {/* Progress Ring */}
          <div className="relative">
            <svg width={size} height={size} className="transform -rotate-90">
              {/* Background circle */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="hsl(var(--secondary))"
                strokeWidth={strokeWidth}
              />
              {/* Progress circle */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={isComplete ? "hsl(142, 76%, 45%)" : "hsl(var(--primary))"}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-1000 ease-out"
                style={{
                  filter: isComplete ? "drop-shadow(0 0 8px hsl(142, 76%, 45%))" : "drop-shadow(0 0 6px hsl(var(--primary) / 0.5))"
                }}
              />
            </svg>
            
            {/* Center content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              {isComplete ? (
                <Sparkles className="h-6 w-6 text-success animate-pulse mb-1" />
              ) : (
                <TrendingUp className="h-5 w-5 text-primary mb-1" />
              )}
              <span className="font-heading text-2xl font-bold">
                <AnimatedCounter value={percentage} decimals={0} suffix="%" />
              </span>
              <span className="text-xs text-muted-foreground">funded</span>
            </div>
          </div>

          {/* Stats below ring */}
          <div className="w-full mt-4 pt-4 border-t border-border/50 grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-lg font-heading font-bold text-primary">
                {(current / 1000).toFixed(1)}K
              </div>
              <div className="text-xs text-muted-foreground">STX Raised</div>
            </div>
            <div>
              <div className="text-lg font-heading font-bold text-muted-foreground">
                {(remaining / 1000).toFixed(1)}K
              </div>
              <div className="text-xs text-muted-foreground">STX Remaining</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
