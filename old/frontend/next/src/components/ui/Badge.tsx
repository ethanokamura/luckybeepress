import React from "react";

export type BadgeVariant =
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "error"
  | "info"
  | "neutral";

interface BadgeProps {
  variant?: BadgeVariant;
  size?: "sm" | "md";
  children: React.ReactNode;
  className?: string;
}

export function Badge({
  variant = "neutral",
  size = "md",
  children,
  className = "",
}: BadgeProps) {
  const baseStyles = "inline-flex items-center font-medium rounded";

  const variantStyles = {
    primary: "bg-primary/20 text-secondary border border-primary/30",
    secondary: "bg-secondary/20 text-secondary border border-secondary/30",
    success: "bg-success text-success-content border border-success-content/30",
    warning: "bg-warning text-warning-content border border-warning-content/30",
    error: "bg-error text-error-content border border-error-content/30",
    info: "bg-info text-info-content border border-info-content/30",
    neutral: "bg-base-100 text-base-content border border-base-content/30",
  };

  const sizeStyles = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
  };

  return (
    <span
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </span>
  );
}
