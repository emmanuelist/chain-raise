import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'bright' | 'subtle';
  delay?: number;
}

function Skeleton({ className, variant = 'default', delay = 0, style, ...props }: SkeletonProps) {
  const variantClasses = {
    default: 'skeleton-shimmer',
    bright: 'skeleton-shimmer-bright',
    subtle: 'skeleton-shimmer-subtle',
  };

  return (
    <div
      className={cn(
        "rounded-md",
        variantClasses[variant],
        className
      )}
      style={{
        ...style,
        animationDelay: delay ? `${delay}ms` : undefined,
      }}
      {...props}
    />
  );
}

export { Skeleton };
export type { SkeletonProps };
