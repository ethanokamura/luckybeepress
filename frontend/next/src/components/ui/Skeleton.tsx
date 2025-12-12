"use client";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
}

export function Skeleton({
  className = "",
  variant = "rectangular",
  width,
  height,
}: SkeletonProps) {
  const baseStyles = "animate-pulse bg-base-300";
  
  const variantStyles = {
    text: "rounded",
    circular: "rounded-full",
    rectangular: "rounded-lg",
  };

  const style: React.CSSProperties = {
    width: width || (variant === "circular" ? "40px" : "100%"),
    height: height || (variant === "text" ? "1em" : variant === "circular" ? "40px" : "100px"),
  };

  return (
    <div
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      style={style}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-base-100 rounded-xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton variant="text" width="40%" height="1.5rem" />
        <Skeleton variant="circular" width={32} height={32} />
      </div>
      <Skeleton variant="text" width="60%" height="2rem" />
      <Skeleton variant="text" width="80%" height="1rem" />
    </div>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 bg-base-100 rounded-lg">
          <Skeleton variant="circular" width={40} height={40} />
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" width="30%" height="1rem" />
            <Skeleton variant="text" width="50%" height="0.875rem" />
          </div>
          <Skeleton variant="text" width="15%" height="1.5rem" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonChart() {
  return (
    <div className="bg-base-100 rounded-xl p-5">
      <Skeleton variant="text" width="30%" height="1.5rem" className="mb-4" />
      <Skeleton variant="rectangular" height={250} />
    </div>
  );
}

