"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface SpotlightProps {
  className?: string;
  fill?: string;
}

export const Spotlight = ({ className, fill }: SpotlightProps) => {
  const spotlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!spotlightRef.current) return;
      
      const { clientX, clientY } = e;
      spotlightRef.current.style.setProperty("--spotlight-x", `${clientX}px`);
      spotlightRef.current.style.setProperty("--spotlight-y", `${clientY}px`);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      ref={spotlightRef}
      className={cn(
        "pointer-events-none fixed inset-0 z-30 transition-opacity duration-300",
        className
      )}
      style={{
        background: `radial-gradient(800px circle at var(--spotlight-x, 50%) var(--spotlight-y, 50%), ${fill || "hsl(var(--primary) / 0.06)"}, transparent 40%)`,
      }}
    />
  );
};
