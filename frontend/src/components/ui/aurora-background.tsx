import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface AuroraBackgroundProps {
  children?: ReactNode;
  className?: string;
  showRadialGradient?: boolean;
}

export const AuroraBackground = ({
  children,
  className,
  showRadialGradient = true,
}: AuroraBackgroundProps) => {
  return (
    <div
      className={cn(
        "relative flex flex-col min-h-screen w-full bg-background overflow-hidden",
        className
      )}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div
          className={cn(
            `
            [--aurora:repeating-linear-gradient(100deg,hsl(var(--primary))_10%,hsl(200_100%_50%)_15%,hsl(var(--accent))_20%,hsl(280_90%_65%)_25%,hsl(var(--primary))_30%)]
            [background-image:var(--aurora)]
            [background-size:300%_200%]
            [background-position:50%_50%]
            filter blur-[100px]
            after:content-['']
            after:absolute
            after:inset-0
            after:[background-image:var(--aurora)]
            after:[background-size:200%_100%]
            after:animate-aurora
            after:[background-attachment:fixed]
            after:mix-blend-soft-light
            pointer-events-none
            absolute
            -inset-[10px]
            opacity-40
            will-change-transform
            `,
            showRadialGradient &&
              `[mask-image:radial-gradient(ellipse_at_100%_0%,black_10%,transparent_70%)]`
          )}
        />
      </div>
      {children}
    </div>
  );
};
