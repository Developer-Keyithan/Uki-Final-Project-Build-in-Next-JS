"use client";

import { cn } from "../../lib/utils";

export const QuantumSpinner = ({ className }: { className?: string }) => (
  <div className={cn("h-16 w-16 relative", className)}>
    <div className="absolute inset-0 rounded-full animate-quantum-spin [animation-duration:2s]">
      <div className="h-full w-full rounded-full bg-[conic-gradient(var(--tw-gradient-from),#6366f1,#8b5cf6,#ec4899,#f59e0b,#6366f1)] from-transparent via-50% to-50%" />
    </div>
    <div className="absolute inset-[6px] bg-background rounded-full" />
  </div>
);

export const OrbitalLoader = ({ className }: { className?: string }) => (
  <div className={cn("h-10 w-10 relative", className)}>
    {[...Array(3)].map((_, i) => (
      <div
        key={i}
        className={cn(
          "absolute h-3 w-3 rounded-full animate-orbital",
          i === 0 && "bg-indigo-500",
          i === 1 && "bg-purple-500",
          i === 2 && "bg-pink-500"
        )}
        style={{
          animationDelay: `${-i * 0.4}s`,
          transformOrigin: "15px 15px",
        }}
      />
    ))}
  </div>
);

export const SkeletonLoader = ({
  className,
  shimmer = true,
}: {
  className?: string;
  shimmer?: boolean;
}) => (
  <div
    className={cn(
      "relative overflow-hidden bg-gradient-to-r from-muted/25 via-muted/50 to-muted/25",
      shimmer && "animate-shimmer",
      className
    )}
  >
    {shimmer && (
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-muted/25 to-transparent animate-shimmer" />
    )}
  </div>
);

export const ParticleWaveLoader = ({ className }: { className?: string }) => (
  <div className={cn("flex h-10 items-center justify-center gap-1.5", className)}>
    {[...Array(5)].map((_, i) => (
      <div
        key={i}
        className="h-2 w-2 bg-primary rounded-full animate-particle-wave"
        style={{ animationDelay: `${i * 0.2}s` }}
      />
    ))}
  </div>
);

export const MorphingLoader = ({ className }: { className?: string }) => (
  <div className={cn("h-14 w-14 relative animate-morph [animation-duration:2s]", className)}>
    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-500 blur-sm" />
    <div className="absolute inset-[3px] bg-background rounded-[inherit]" />
  </div>
);

export const FullPageLoader = () => (
  <div className="fixed inset-0 bg-background/90 flex items-center justify-center z-[999]">
    <div className="text-center space-y-4">
      <MorphingLoader className="mx-auto h-20 w-20 [&>div:first-child]:from-blue-500 [&>div:first-child]:to-emerald-500" />
      <p className="text-muted-foreground font-medium animate-pulse">
        Loading Awesome Experience...
      </p>
    </div>
  </div>
);