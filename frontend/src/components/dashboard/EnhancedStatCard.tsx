import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { SparklineChart } from "./SparklineChart";
import { ArrowUpRight, ArrowDownRight, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface EnhancedStatCardProps {
  title: string;
  value: number;
  suffix?: string;
  decimals?: number;
  change?: number;
  icon: LucideIcon;
  iconColor?: string;
  sparklineData?: number[];
  sparklineColor?: string;
}

export function EnhancedStatCard({
  title,
  value,
  suffix = "",
  decimals = 0,
  change,
  icon: Icon,
  iconColor = "text-primary",
  sparklineData,
  sparklineColor = "hsl(187, 95%, 50%)"
}: EnhancedStatCardProps) {
  const isPositive = change !== undefined && change >= 0;
  const bgColorClass = iconColor.replace("text-", "bg-").replace(/]$/, "/20]");
  
  return (
    <Card className="glass-card group hover:border-primary/30 transition-all duration-300 overflow-hidden">
      <CardContent className="p-4 sm:p-5 lg:p-6">
        <div className="flex items-center justify-between mb-2">
          <div className={cn(
            "w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform",
            iconColor.includes("primary") && "bg-primary/20",
            iconColor.includes("accent") && "bg-accent/20",
            iconColor.includes("success") && "bg-success/20",
            iconColor.includes("blue") && "bg-blue-500/20"
          )}>
            <Icon className={cn("h-4 w-4 sm:h-5 sm:w-5", iconColor)} />
          </div>
          {change !== undefined && (
            <Badge 
              variant="outline" 
              className={cn(
                "text-xs",
                isPositive 
                  ? "text-success border-success/30 bg-success/10" 
                  : "text-destructive border-destructive/30 bg-destructive/10"
              )}
            >
              {isPositive ? (
                <ArrowUpRight className="h-3 w-3 mr-1" />
              ) : (
                <ArrowDownRight className="h-3 w-3 mr-1" />
              )}
              {Math.abs(change)}%
            </Badge>
          )}
        </div>
        
        <div className="font-heading text-xl sm:text-2xl font-bold mb-1">
          <AnimatedCounter value={value} suffix={suffix} decimals={decimals} />
        </div>
        <div className="text-xs sm:text-sm text-muted-foreground mb-3">
          {title}
        </div>
        
        {sparklineData && sparklineData.length > 0 && (
          <div className="pt-2 border-t border-border/30">
            <SparklineChart data={sparklineData} color={sparklineColor} height={32} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
