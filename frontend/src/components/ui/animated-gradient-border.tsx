import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface AnimatedGradientBorderProps {
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  borderClassName?: string;
  disableOnMobile?: boolean;
}

export const AnimatedGradientBorder = ({
  children,
  className,
  containerClassName,
  borderClassName,
  disableOnMobile = true,
}: AnimatedGradientBorderProps) => {
  return (
    <div className={cn("relative group", containerClassName)}>
      <div
        className={cn(
          "absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] opacity-70 blur-sm group-hover:opacity-100 transition-opacity duration-500",
          disableOnMobile ? "md:animate-gradient motion-reduce:animate-none" : "animate-gradient motion-reduce:animate-none",
          borderClassName
        )}
      />
      <div
        className={cn(
          "absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] opacity-50",
          disableOnMobile ? "md:animate-gradient motion-reduce:animate-none" : "animate-gradient motion-reduce:animate-none",
          borderClassName
        )}
      />
      <div
        className={cn(
          "relative bg-card rounded-2xl",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
};
