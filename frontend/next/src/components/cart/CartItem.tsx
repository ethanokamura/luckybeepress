"use client";

import Link from "next/link";
import { Trash2, Package } from "lucide-react";
import { ProductThumbnail } from "@/components/ui/ProductImage";
import { InlineQuantitySelector } from "@/components/ui/QuantitySelector";
import { UnitPrice } from "@/components/ui/PriceDisplay";
import type { CartItemWithProduct } from "@/lib/cart-utils";
import {
  getCartItemVariant,
  getVariantIncrement,
  getVariantUnit,
  getVariantLabel,
} from "@/lib/cart-utils";

interface CartItemProps {
  item: CartItemWithProduct;
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove: () => void;
  loading?: boolean;
  compact?: boolean;
  className?: string;
}

export function CartItem({
  item,
  onIncrement,
  onDecrement,
  onRemove,
  loading = false,
  compact = false,
  className = "",
}: CartItemProps) {
  const product = item.product;

  // Get variant from the item's variant field
  const variant = getCartItemVariant(item);

  // Use variant-based calculations
  const increment = getVariantIncrement(variant);
  const unit = getVariantUnit(variant, Number(item.quantity) !== 1);
  const isBox = variant === "box";

  if (compact) {
    return (
      <div className={`flex items-center gap-3 py-3 ${className}`}>
        <ProductThumbnail
          src={product?.image_url}
          alt={product?.name || "Product"}
          size="sm"
        />

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium line-clamp-1">
            {product?.name || "Unknown Product"}
          </p>
          <p className="text-xs text-base-content/60 flex items-center gap-1">
            {item.quantity} {unit}
            {isBox && (
              <span className="inline-flex items-center gap-0.5 text-primary">
                <Package className="h-3 w-3" />
              </span>
            )}
          </p>
        </div>

        <UnitPrice
          unitPrice={Number(item.unit_price)}
          quantity={Number(item.quantity)}
          size="sm"
        />
      </div>
    );
  }

  return (
    <div
      className={`flex gap-4 py-4 border-b border-base-300 last:border-b-0 ${className}`}
    >
      {/* Product image */}
      <Link href={`/products/${item.product_id}`}>
        <ProductThumbnail
          src={product?.image_url}
          alt={product?.name || "Product"}
          size="md"
        />
      </Link>

      {/* Product details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <Link
              href={`/products/${item.product_id}`}
              className="font-medium text-base-content hover:text-primary transition-colors line-clamp-2"
            >
              {product?.name || "Unknown Product"}
            </Link>
            <div className="flex items-center gap-2 mt-0.5">
              {product?.category && (
                <span className="text-sm text-base-content/60">
                  {product.category}
                </span>
              )}
              {isBox && (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                  <Package className="h-3 w-3" />
                  {getVariantLabel(variant)}
                </span>
              )}
              {!isBox && product?.has_box && (
                <span className="text-xs text-base-content/50">
                  Single Cards
                </span>
              )}
            </div>
          </div>

          {/* Remove button */}
          <button
            onClick={onRemove}
            disabled={loading}
            className="p-1.5 rounded-lg text-base-content/40 hover:text-error hover:bg-error/10 transition-colors disabled:opacity-50"
            aria-label="Remove item"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        {/* Quantity and price */}
        <div className="flex items-end justify-between mt-3">
          <InlineQuantitySelector
            value={Number(item.quantity)}
            onIncrement={onIncrement}
            onDecrement={onDecrement}
            onRemove={onRemove}
            disabled={loading}
            loading={loading}
            min={increment}
          />

          <UnitPrice
            unitPrice={Number(item.unit_price)}
            quantity={Number(item.quantity)}
            unit={`/ ${unit === "cards" ? "card" : "box"}`}
          />
        </div>

        {/* Unit info */}
        <p className="text-xs text-base-content/50 mt-2">
          Sold in sets of {increment} {unit}
        </p>
      </div>
    </div>
  );
}

// Loading skeleton
export function CartItemSkeleton({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <div className="flex items-center gap-3 py-3 animate-pulse">
        <div className="h-12 w-12 rounded-lg bg-base-200" />
        <div className="flex-1 space-y-1">
          <div className="h-4 bg-base-200 rounded w-3/4" />
          <div className="h-3 bg-base-200 rounded w-1/2" />
        </div>
        <div className="h-4 bg-base-200 rounded w-16" />
      </div>
    );
  }

  return (
    <div className="flex gap-4 py-4 border-b border-base-300 animate-pulse">
      <div className="h-16 w-16 rounded-lg bg-base-200" />
      <div className="flex-1 space-y-2">
        <div className="h-5 bg-base-200 rounded w-3/4" />
        <div className="h-4 bg-base-200 rounded w-1/4" />
        <div className="flex justify-between items-center mt-3">
          <div className="h-8 bg-base-200 rounded w-24" />
          <div className="h-5 bg-base-200 rounded w-16" />
        </div>
      </div>
    </div>
  );
}
