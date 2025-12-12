"use client";

import { Truck } from "lucide-react";
import { MinimumOrderIndicator } from "@/components/ui/MinimumOrderIndicator";
import { OrderTotal } from "@/components/ui/PriceDisplay";
import type { CartTotals, ShippingEstimate } from "@/lib/cart-utils";
import { formatCurrency } from "@/lib/format";

interface CartSummaryProps {
  totals: CartTotals;
  shippingEstimates?: ShippingEstimate[];
  selectedShipping?: string | null;
  onShippingSelect?: (method: string) => void;
  compact?: boolean;
  showShipping?: boolean;
  className?: string;
}

export function CartSummary({
  totals,
  shippingEstimates,
  selectedShipping,
  onShippingSelect,
  compact = false,
  showShipping = false,
  className = "",
}: CartSummaryProps) {
  const selectedEstimate = shippingEstimates?.find(
    (e) => e.method === selectedShipping
  );

  if (compact) {
    return (
      <div className={`space-y-3 ${className}`}>
        <MinimumOrderIndicator
          currentAmount={totals.subtotal}
          variant="inline"
          showAmount={false}
        />

        <div className="flex justify-between items-center">
          <span className="text-base-content/70">Subtotal</span>
          <span className="text-lg font-semibold">
            {formatCurrency(totals.subtotal)}
          </span>
        </div>

        {showShipping && selectedEstimate && (
          <div className="flex justify-between items-center text-sm">
            <span className="text-base-content/70">Shipping estimate</span>
            <span>{formatCurrency(selectedEstimate.rate)}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Minimum order indicator */}
      <MinimumOrderIndicator
        currentAmount={totals.subtotal}
        variant="bar"
      />

      {/* Shipping selection */}
      {showShipping && shippingEstimates && shippingEstimates.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-medium flex items-center gap-2">
            <Truck className="h-4 w-4" />
            Shipping
          </h3>
          <div className="space-y-2">
            {shippingEstimates.map((estimate) => (
              <label
                key={estimate.method}
                className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedShipping === estimate.method
                    ? "border-primary bg-primary/5"
                    : "border-base-300 hover:border-primary/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="shipping"
                    value={estimate.method}
                    checked={selectedShipping === estimate.method}
                    onChange={() => onShippingSelect?.(estimate.method)}
                    className="radio radio-primary radio-sm"
                  />
                  <div>
                    <p className="font-medium text-sm">{estimate.label}</p>
                    <p className="text-xs text-base-content/60">
                      {estimate.estimatedDays} business days
                    </p>
                  </div>
                </div>
                <span className="font-medium">
                  {formatCurrency(estimate.rate)}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Order totals */}
      <OrderTotal
        subtotal={totals.subtotal}
        shipping={selectedEstimate?.rate}
        total={totals.subtotal + (selectedEstimate?.rate || 0)}
      />

      {/* Item count */}
      <p className="text-sm text-base-content/60 text-center">
        {totals.productCount} product{totals.productCount !== 1 ? "s" : ""} •{" "}
        {totals.itemCount} item{totals.itemCount !== 1 ? "s" : ""}
      </p>
    </div>
  );
}

// Checkout summary (read-only)
interface CheckoutSummaryProps {
  subtotal: number;
  shipping: number;
  tax?: number;
  discount?: number;
  total: number;
  className?: string;
}

export function CheckoutSummary({
  subtotal,
  shipping,
  tax,
  discount,
  total,
  className = "",
}: CheckoutSummaryProps) {
  return (
    <OrderTotal
      subtotal={subtotal}
      shipping={shipping}
      tax={tax}
      discount={discount}
      total={total}
      className={className}
    />
  );
}

