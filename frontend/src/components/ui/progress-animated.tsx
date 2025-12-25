import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface AnimatedProgressProps {
  value: number;
  className?: string;
  showPercentage?: boolean;
  duration?: number;
}

export function AnimatedProgress({ 
  value, 
  className, 
  showPercentage = false,
  duration = 1000 
}: AnimatedProgressProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const startValue = displayValue;
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = startValue + (value - startValue) * eased;
      
      setDisplayValue(current);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [value, duration]);

  return (
    <div className={cn("relative", className)}>
      <Progress value={displayValue} />
      {showPercentage && (
        <span className="absolute right-0 -top-6 text-xs text-muted-foreground">
          {displayValue.toFixed(0)}%
        </span>
      )}
    </div>
  );
}
