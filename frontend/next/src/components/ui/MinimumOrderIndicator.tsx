"use client";

import { Check, AlertCircle } from "lucide-react";
import { formatCurrency } from "@/lib/format";
import { MINIMUM_ORDER_AMOUNT } from "@/lib/constants";

interface MinimumOrderIndicatorProps {
  currentAmount: number;
  minimumAmount?: number;
  variant?: "bar" | "inline" | "compact";
  showAmount?: boolean;
  className?: string;
}

export function MinimumOrderIndicator({
  currentAmount,
  minimumAmount = MINIMUM_ORDER_AMOUNT,
  variant = "bar",
  showAmount = true,
  className = "",
}: MinimumOrderIndicatorProps) {
  const meetsMinimum = currentAmount >= minimumAmount;
  const amountRemaining = Math.max(0, minimumAmount - currentAmount);
  const percentComplete = Math.min(100, (currentAmount / minimumAmount) * 100);

  if (variant === "compact") {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {meetsMinimum ? (
          <>
            <Check className="h-4 w-4 text-success" />
            <span className="text-sm text-success font-medium">
              Minimum met
            </span>
          </>
        ) : (
          <>
            <AlertCircle className="h-4 w-4 text-warning" />
            <span className="text-sm text-warning">
              Add {formatCurrency(amountRemaining)} more
            </span>
          </>
        )}
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <div
        className={`flex items-center justify-between p-3 rounded-lg ${
          meetsMinimum ? "bg-success/10" : "bg-warning/10"
        } ${className}`}
      >
        <div className="flex items-center gap-2">
          {meetsMinimum ? (
            <Check className="h-5 w-5 text-success" />
          ) : (
            <AlertCircle className="h-5 w-5 text-warning" />
          )}
          <span
            className={`font-medium ${meetsMinimum ? "text-success" : "text-warning"}`}
          >
            {meetsMinimum
              ? "Minimum order met!"
              : `Add ${formatCurrency(amountRemaining)} to reach minimum`}
          </span>
        </div>
        {showAmount && (
          <span className="text-sm text-base-content/60">
            {formatCurrency(currentAmount)} / {formatCurrency(minimumAmount)}
          </span>
        )}
      </div>
    );
  }

  // Default: bar variant
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between text-sm">
        <span className="text-base-content/70">
          {meetsMinimum ? (
            <span className="flex items-center gap-1.5 text-success font-medium">
              <Check className="h-4 w-4" />
              Minimum order met!
            </span>
          ) : (
            <span className="text-warning">
              Add {formatCurrency(amountRemaining)} more to reach{" "}
              {formatCurrency(minimumAmount)} minimum
            </span>
          )}
        </span>
        {showAmount && (
          <span className="font-medium tabular-nums">
            {formatCurrency(currentAmount)}
          </span>
        )}
      </div>

      <div className="relative h-2 bg-base-300 rounded-full overflow-hidden">
        <div
          className={`absolute inset-y-0 left-0 rounded-full transition-all duration-500 ease-out ${
            meetsMinimum ? "bg-success" : "bg-warning"
          }`}
          style={{ width: `${percentComplete}%` }}
        />
        {/* Minimum marker */}
        <div
          className="absolute inset-y-0 w-0.5 bg-base-content/30"
          style={{ left: "100%" }}
        />
      </div>

      <div className="flex justify-between text-xs text-base-content/50">
        <span>$0</span>
        <span>{formatCurrency(minimumAmount)} minimum</span>
      </div>
    </div>
  );
}

// Simple badge version for cart button
interface MinimumOrderBadgeProps {
  meetsMinimum: boolean;
  className?: string;
}

export function MinimumOrderBadge({
  meetsMinimum,
  className = "",
}: MinimumOrderBadgeProps) {
  if (meetsMinimum) {
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-success/20 text-success ${className}`}
      >
        <Check className="h-3 w-3" />
        Ready
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-warning/20 text-warning ${className}`}
    >
      <AlertCircle className="h-3 w-3" />
      Below min
    </span>
  );
}

