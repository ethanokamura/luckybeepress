"use client";

import { Star, Award, ShoppingBag, Calendar, Leaf, Heart } from "lucide-react";
import { BRAND } from "@/lib/constants";
import { formatCompactNumber } from "@/lib/format";

interface TrustBadgesProps {
  variant?: "horizontal" | "vertical" | "grid";
  size?: "sm" | "md" | "lg";
  showAll?: boolean;
  className?: string;
}

export function TrustBadges({
  variant = "horizontal",
  size = "md",
  showAll = false,
  className = "",
}: TrustBadgesProps) {
  const badges = [
    {
      icon: Calendar,
      value: `${BRAND.yearsInBusiness}+ Years`,
      label: "In Business",
    },
    {
      icon: Star,
      value: `${BRAND.etsyRating}-Star`,
      label: "Rating",
    },
    {
      icon: ShoppingBag,
      value: `${formatCompactNumber(BRAND.salesCount)}+`,
      label: "Sales",
    },
    ...(showAll
      ? [
          {
            icon: Heart,
            value: `${formatCompactNumber(BRAND.reviewCount)}+`,
            label: "Reviews",
          },
        ]
      : []),
  ];

  const sizeStyles = {
    sm: {
      icon: "h-4 w-4",
      value: "text-sm font-semibold",
      label: "text-xs",
      gap: "gap-1",
      padding: "px-3 py-2",
    },
    md: {
      icon: "h-5 w-5",
      value: "text-base font-bold",
      label: "text-sm",
      gap: "gap-1.5",
      padding: "px-4 py-3",
    },
    lg: {
      icon: "h-6 w-6",
      value: "text-lg font-bold",
      label: "text-base",
      gap: "gap-2",
      padding: "px-5 py-4",
    },
  };

  const styles = sizeStyles[size];

  if (variant === "vertical") {
    return (
      <div className={`flex flex-col gap-3 ${className}`}>
        {badges.map((badge) => (
          <div
            key={badge.label}
            className={`flex items-center ${styles.gap} ${styles.padding} rounded-xl bg-base-200/50`}
          >
            <badge.icon className={`${styles.icon} text-primary`} />
            <div className="flex flex-col">
              <span className={styles.value}>{badge.value}</span>
              <span className={`${styles.label} text-base-content/60`}>
                {badge.label}
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === "grid") {
    return (
      <div className={`grid grid-cols-2 sm:grid-cols-4 gap-4 ${className}`}>
        {badges.map((badge) => (
          <div
            key={badge.label}
            className={`flex flex-col items-center text-center ${styles.padding} rounded-xl bg-base-200/50`}
          >
            <badge.icon className={`${styles.icon} text-primary mb-2`} />
            <span className={styles.value}>{badge.value}</span>
            <span className={`${styles.label} text-base-content/60`}>
              {badge.label}
            </span>
          </div>
        ))}
      </div>
    );
  }

  // Default: horizontal
  return (
    <div
      className={`flex flex-wrap items-center justify-center gap-6 ${className}`}
    >
      {badges.map((badge, index) => (
        <>
          <div
            key={badge.label}
            className={`flex items-center ${styles.gap}`}
          >
            <badge.icon className={`${styles.icon} text-primary`} />
            <div className="flex flex-col">
              <span className={styles.value}>{badge.value}</span>
              <span className={`${styles.label} text-base-content/60`}>
                {badge.label}
              </span>
            </div>
          </div>
          {index < badges.length - 1 && (
            <div className="hidden sm:block h-8 w-px bg-base-300" />
          )}
        </>
      ))}
    </div>
  );
}

// Compact inline trust indicator
export function TrustIndicator({ className = "" }: { className?: string }) {
  return (
    <div
      className={`inline-flex items-center gap-2 text-sm text-base-content/70 ${className}`}
    >
      <div className="flex items-center gap-1">
        <Star className="h-4 w-4 fill-warning text-warning" />
        <span className="font-medium">{BRAND.etsyRating}</span>
      </div>
      <span>•</span>
      <span>{BRAND.yearsInBusiness}+ years on Etsy</span>
      <span>•</span>
      <span>{formatCompactNumber(BRAND.salesCount)}+ sales</span>
    </div>
  );
}

// Quality badges for product pages
export function QualityBadges({ className = "" }: { className?: string }) {
  const qualities = [
    { icon: Leaf, label: "Eco-Friendly", description: "Recycled envelopes" },
    { icon: Award, label: "Premium Quality", description: "100% cotton cardstock" },
    { icon: Heart, label: "Handcrafted", description: "Hand-mixed inks" },
  ];

  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      {qualities.map((quality) => (
        <div
          key={quality.label}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-base-200/50"
        >
          <quality.icon className="h-4 w-4 text-primary" />
          <div className="flex flex-col">
            <span className="text-sm font-medium">{quality.label}</span>
            <span className="text-xs text-base-content/60">
              {quality.description}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

// Featured seller badge
export function FeaturedSellerBadge({
  size = "md",
  className = "",
}: {
  size?: "sm" | "md";
  className?: string;
}) {
  const sizeStyles = {
    sm: "text-xs px-2 py-1 gap-1",
    md: "text-sm px-3 py-1.5 gap-1.5",
  };
  const iconSize = size === "sm" ? "h-3 w-3" : "h-4 w-4";

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-700 dark:text-amber-400 ${sizeStyles[size]} ${className}`}
    >
      <Award className={iconSize} />
      Established {BRAND.established}
    </span>
  );
}

