"use client";

import { ShoppingCart } from "lucide-react";
import { useCartContext, useCartCount } from "@/providers/CartProvider";
import { MinimumOrderBadge } from "@/components/ui/MinimumOrderIndicator";

interface CartButtonProps {
  showBadge?: boolean;
  showMinimumStatus?: boolean;
  className?: string;
}

export function CartButton({
  showBadge = true,
  showMinimumStatus = false,
  className = "",
}: CartButtonProps) {
  const { openCart, totals, loading } = useCartContext();
  const itemCount = useCartCount();

  return (
    <button
      onClick={openCart}
      className={`relative flex items-center gap-2 p-2 rounded-lg hover:bg-base-200 transition-colors ${className}`}
      aria-label={`Shopping cart with ${itemCount} items`}
    >
      <ShoppingCart className="h-5 w-5" />

      {/* Item count badge */}
      {showBadge && itemCount > 0 && (
        <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center rounded-full bg-primary text-primary-content text-xs font-medium">
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      )}

      {/* Minimum order status */}
      {showMinimumStatus && itemCount > 0 && !loading && (
        <MinimumOrderBadge meetsMinimum={totals.meetsMinimum} />
      )}
    </button>
  );
}

// Expanded cart button for mobile/header
interface CartButtonExpandedProps {
  className?: string;
}

export function CartButtonExpanded({ className = "" }: CartButtonExpandedProps) {
  const { openCart, totals, loading } = useCartContext();
  const itemCount = useCartCount();

  if (loading) {
    return (
      <button
        className={`flex items-center gap-3 px-4 py-2 rounded-lg bg-base-200 animate-pulse ${className}`}
        disabled
      >
        <ShoppingCart className="h-5 w-5" />
        <span className="h-4 w-16 bg-base-300 rounded" />
      </button>
    );
  }

  return (
    <button
      onClick={openCart}
      className={`flex items-center gap-3 px-4 py-2 rounded-lg border border-base-300 hover:border-primary/50 transition-colors ${className}`}
    >
      <div className="relative">
        <ShoppingCart className="h-5 w-5" />
        {itemCount > 0 && (
          <span className="absolute -top-2 -right-2 h-4 w-4 flex items-center justify-center rounded-full bg-primary text-primary-content text-[10px] font-medium">
            {itemCount > 99 ? "99+" : itemCount}
          </span>
        )}
      </div>

      {itemCount > 0 ? (
        <div className="flex flex-col items-start">
          <span className="text-sm font-medium">
            {itemCount} {itemCount === 1 ? "item" : "items"}
          </span>
          {totals.meetsMinimum ? (
            <span className="text-xs text-success">Ready to checkout</span>
          ) : (
            <span className="text-xs text-warning">Below minimum</span>
          )}
        </div>
      ) : (
        <span className="text-sm">Cart</span>
      )}
    </button>
  );
}

