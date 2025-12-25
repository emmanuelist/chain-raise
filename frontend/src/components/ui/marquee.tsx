import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface MarqueeProps {
  children: ReactNode;
  className?: string;
  reverse?: boolean;
  pauseOnHover?: boolean;
  speed?: "slow" | "normal" | "fast";
}

export const Marquee = ({
  children,
  className,
  reverse = false,
  pauseOnHover = true,
  speed = "normal",
}: MarqueeProps) => {
  const speedMap = {
    slow: "animate-marquee-slow",
    normal: "animate-marquee",
    fast: "animate-marquee-fast",
  };

  return (
    <div
      className={cn(
        "group flex overflow-hidden [--gap:1rem] gap-[--gap]",
        pauseOnHover && "[&:hover_.marquee-content]:pause",
        className
      )}
    >
      <div
        className={cn(
          "marquee-content flex shrink-0 justify-around gap-[--gap]",
          speedMap[speed],
          reverse && "animate-marquee-reverse"
        )}
      >
        {children}
      </div>
      <div
        className={cn(
          "marquee-content flex shrink-0 justify-around gap-[--gap]",
          speedMap[speed],
          reverse && "animate-marquee-reverse"
        )}
        aria-hidden
      >
        {children}
      </div>
    </div>
  );
};
