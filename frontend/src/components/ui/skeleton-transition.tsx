import { useState, useEffect, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SkeletonTransitionProps {
  isLoading: boolean;
  skeleton: ReactNode;
  children: ReactNode;
  className?: string;
  duration?: number;
}

export function SkeletonTransition({
  isLoading,
  skeleton,
  children,
  className,
  duration = 400,
}: SkeletonTransitionProps) {
  const [showSkeleton, setShowSkeleton] = useState(isLoading);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (!isLoading && showSkeleton) {
      // Start fade out transition
      setIsTransitioning(true);
      const timer = setTimeout(() => {
        setShowSkeleton(false);
        setIsTransitioning(false);
      }, duration);
      return () => clearTimeout(timer);
    } else if (isLoading) {
      setShowSkeleton(true);
    }
  }, [isLoading, showSkeleton, duration]);

  return (
    <div className={cn("relative", className)}>
      {/* Skeleton layer */}
      {showSkeleton && (
        <div
          className={cn(
            "skeleton-transition-layer",
            isTransitioning && "skeleton-fade-out"
          )}
          style={{ 
            animationDuration: `${duration}ms`,
            position: isTransitioning ? 'absolute' : 'relative',
            inset: isTransitioning ? 0 : undefined,
            zIndex: isTransitioning ? 10 : undefined,
          }}
        >
          {skeleton}
        </div>
      )}
      
      {/* Content layer */}
      {(!showSkeleton || isTransitioning) && (
        <div
          className={cn(
            "content-fade-in",
            isTransitioning && "opacity-0"
          )}
          style={{ 
            animationDuration: `${duration}ms`,
            animationDelay: isTransitioning ? `${duration * 0.5}ms` : '0ms',
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

interface LoadingStateProps {
  isLoading: boolean;
  skeleton: ReactNode;
  children: ReactNode;
  minLoadTime?: number;
}

export function LoadingState({
  isLoading,
  skeleton,
  children,
  minLoadTime = 300,
}: LoadingStateProps) {
  const [shouldShowContent, setShouldShowContent] = useState(!isLoading);
  const [hasMinTimeElapsed, setHasMinTimeElapsed] = useState(!isLoading);

  useEffect(() => {
    if (isLoading) {
      setShouldShowContent(false);
      setHasMinTimeElapsed(false);
      const timer = setTimeout(() => {
        setHasMinTimeElapsed(true);
      }, minLoadTime);
      return () => clearTimeout(timer);
    }
  }, [isLoading, minLoadTime]);

  useEffect(() => {
    if (!isLoading && hasMinTimeElapsed) {
      setShouldShowContent(true);
    }
  }, [isLoading, hasMinTimeElapsed]);

  const showLoading = isLoading || (!shouldShowContent && !hasMinTimeElapsed);

  return (
    <SkeletonTransition
      isLoading={showLoading}
      skeleton={skeleton}
      duration={400}
    >
      {children}
    </SkeletonTransition>
  );
}
