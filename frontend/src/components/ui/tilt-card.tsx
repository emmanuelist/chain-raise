"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ReactNode, useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  rotationIntensity?: number;
  glareEnabled?: boolean;
}

export const TiltCard = ({ 
  children, 
  className,
  rotationIntensity = 15,
  glareEnabled = true
}: TiltCardProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const springConfig = { damping: 30, stiffness: 200 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [rotationIntensity, -rotationIntensity]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-rotationIntensity, rotationIntensity]), springConfig);
  
  const glareX = useSpring(useTransform(x, [-0.5, 0.5], [0, 100]), springConfig);
  const glareY = useSpring(useTransform(y, [-0.5, 0.5], [0, 100]), springConfig);
  
  const glareBackground = useTransform(
    [glareX, glareY],
    ([x, y]) => 
      `radial-gradient(circle at ${x}% ${y}%, hsl(0 0% 100% / 0.15) 0%, transparent 50%)`
  );
  
  useEffect(() => {
    // Detect touch device
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isTouchDevice || !ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    const xPos = (e.clientX - rect.left) / rect.width - 0.5;
    const yPos = (e.clientY - rect.top) / rect.height - 0.5;
    
    x.set(xPos);
    y.set(yPos);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // On touch devices, render without tilt effect
  if (isTouchDevice) {
    return (
      <div className={cn("relative", className)}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        willChange: "transform",
      }}
      className={cn("relative", className)}
    >
      {children}
      
      {glareEnabled && (
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-inherit overflow-hidden"
          style={{
            background: glareBackground,
          }}
        />
      )}
    </motion.div>
  );
};
