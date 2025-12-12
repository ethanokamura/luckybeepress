"use client";

import { formatCurrency, formatMargin, formatMarkup } from "@/lib/format";

// ============================================================================
// Main Price Display
// ============================================================================

interface PriceDisplayProps {
  price: number;
  originalPrice?: number;
  size?: "sm" | "md" | "lg" | "xl";
  showCents?: boolean;
  className?: string;
}

export function PriceDisplay({
  price,
  originalPrice,
  size = "md",
  showCents = true,
  className = "",
}: PriceDisplayProps) {
  const sizeStyles = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-2xl",
  };

  const hasDiscount = originalPrice && originalPrice > price;

  return (
    <div className={`flex items-baseline gap-2 ${className}`}>
      <span className={`font-semibold ${sizeStyles[size]}`}>
        {formatCurrency(price, showCents)}
      </span>
      {hasDiscount && (
        <span className="text-sm text-base-content/50 line-through">
          {formatCurrency(originalPrice, showCents)}
        </span>
      )}
    </div>
  );
}

// ============================================================================
// Wholesale/Retail Price Display
// ============================================================================

interface WholesaleRetailPriceProps {
  wholesalePrice: number;
  retailPrice?: number | null;
  size?: "sm" | "md" | "lg";
  layout?: "inline" | "stacked";
  showMargin?: boolean;
  className?: string;
}

export function WholesaleRetailPrice({
  wholesalePrice,
  retailPrice,
  size = "md",
  layout = "inline",
  showMargin = false,
  className = "",
}: WholesaleRetailPriceProps) {
  const sizeStyles = {
    sm: { wsp: "text-sm", srp: "text-xs" },
    md: { wsp: "text-base", srp: "text-sm" },
    lg: { wsp: "text-xl", srp: "text-base" },
  };

  const styles = sizeStyles[size];

  if (layout === "stacked") {
    return (
      <div className={`flex flex-col gap-0.5 ${className}`}>
        <div className="flex items-baseline gap-2">
          <span className={`font-semibold ${styles.wsp}`}>
            {formatCurrency(wholesalePrice)}
          </span>
          <span className={`text-base-content/60 ${styles.srp}`}>WSP</span>
        </div>
        {retailPrice && (
          <div className="flex items-baseline gap-2">
            <span className={`text-base-content/70 ${styles.srp}`}>
              {formatCurrency(retailPrice)}
            </span>
            <span className={`text-base-content/50 text-xs`}>SRP</span>
            {showMargin && (
              <span className="text-xs text-success">
                {formatMargin(wholesalePrice, retailPrice)} margin
              </span>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-between gap-3 ${className}`}>
      <div className="flex items-baseline gap-1">
        <span className={`font-semibold ${styles.wsp}`}>
          {formatCurrency(wholesalePrice)}
        </span>
        <span className={`text-base-content/60 ${styles.srp}`}>WSP</span>
      </div>
      {retailPrice && (
        <>
          <div className="flex items-baseline gap-1">
            <span className={`text-base-content/50 text-xs`}>SRP:</span>
            <span className={`text-base-content/70 ${styles.srp}`}>
              {formatCurrency(retailPrice)}
            </span>
          </div>
          {showMargin && (
            <span className="text-xs text-success font-medium">
              ({formatMarkup(wholesalePrice, retailPrice)} markup)
            </span>
          )}
        </>
      )}
    </div>
  );
}

// ============================================================================
// Unit Price Display (for cart items)
// ============================================================================

interface UnitPriceProps {
  unitPrice: number;
  quantity: number;
  unit?: string;
  size?: "sm" | "md";
  className?: string;
}

export function UnitPrice({
  unitPrice,
  quantity,
  unit = "each",
  size = "md",
  className = "",
}: UnitPriceProps) {
  const total = unitPrice * quantity;
  const sizeStyles = {
    sm: { total: "text-sm", unit: "text-xs" },
    md: { total: "text-base", unit: "text-sm" },
  };
  const styles = sizeStyles[size];

  return (
    <div className={`flex flex-col items-end ${className}`}>
      <span className={`font-semibold ${styles.total}`}>
        {formatCurrency(total)}
      </span>
      <span className={`text-base-content/60 ${styles.unit}`}>
        {formatCurrency(unitPrice)} {unit}
      </span>
    </div>
  );
}

// ============================================================================
// Price per Set Display
// ============================================================================

interface PricePerSetProps {
  pricePerUnit: number;
  unitsPerSet: number;
  unitLabel?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function PricePerSet({
  pricePerUnit,
  unitsPerSet,
  unitLabel = "card",
  size = "md",
  className = "",
}: PricePerSetProps) {
  const setPrice = pricePerUnit * unitsPerSet;
  const sizeStyles = {
    sm: { set: "text-sm", unit: "text-xs" },
    md: { set: "text-lg", unit: "text-sm" },
    lg: { set: "text-xl", unit: "text-base" },
  };
  const styles = sizeStyles[size];

  return (
    <div className={`flex flex-col ${className}`}>
      <div className="flex items-baseline gap-2">
        <span className={`font-bold ${styles.set}`}>
          {formatCurrency(setPrice)}
        </span>
        <span className={`text-base-content/60 ${styles.unit}`}>
          per set of {unitsPerSet}
        </span>
      </div>
      <span className={`text-base-content/50 ${styles.unit}`}>
        ({formatCurrency(pricePerUnit)}/{unitLabel})
      </span>
    </div>
  );
}

// ============================================================================
// Order Total Display
// ============================================================================

interface OrderTotalProps {
  subtotal: number;
  shipping?: number | null;
  tax?: number | null;
  discount?: number | null;
  total: number;
  size?: "sm" | "md";
  className?: string;
}

export function OrderTotal({
  subtotal,
  shipping,
  tax,
  discount,
  total,
  size = "md",
  className = "",
}: OrderTotalProps) {
  const sizeStyles = {
    sm: { label: "text-sm", value: "text-sm", total: "text-base" },
    md: { label: "text-base", value: "text-base", total: "text-lg" },
  };
  const styles = sizeStyles[size];

  const rows = [
    { label: "Subtotal", value: subtotal },
    shipping != null && { label: "Shipping", value: shipping },
    tax != null && { label: "Tax", value: tax },
    discount != null &&
      discount > 0 && { label: "Discount", value: -discount, isDiscount: true },
  ].filter(Boolean) as Array<{
    label: string;
    value: number;
    isDiscount?: boolean;
  }>;

  return (
    <div className={`space-y-2 ${className}`}>
      {rows.map((row) => (
        <div key={row.label} className="flex justify-between items-center">
          <span className={`text-base-content/70 ${styles.label}`}>
            {row.label}
          </span>
          <span
            className={`${styles.value} ${
              row.isDiscount ? "text-success" : ""
            }`}
          >
            {row.isDiscount ? "-" : ""}
            {formatCurrency(Math.abs(row.value))}
          </span>
        </div>
      ))}
      <div className="border-t border-base-300 pt-2 mt-2">
        <div className="flex justify-between items-center">
          <span className={`font-semibold ${styles.total}`}>Total</span>
          <span className={`font-bold ${styles.total}`}>
            {formatCurrency(total)}
          </span>
        </div>
      </div>
    </div>
  );
}
