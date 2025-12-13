"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingCart, Plus, Check, Package } from "lucide-react";
import type { Products } from "@/types/products";
import { ProductImage } from "@/components/ui/ProductImage";
import { WholesaleRetailPrice } from "@/components/ui/PriceDisplay";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { QuantitySelector } from "@/components/ui/QuantitySelector";
import { useCartContext, useIsInCart } from "@/providers/CartProvider";
import {
  hasBoxVariant,
  getVariantIncrement,
  getVariantPrice,
} from "@/lib/cart-utils";
import { formatCurrency } from "@/lib/format";
import { PRODUCT_CONFIG } from "@/lib/constants";

interface ProductCardProps {
  product: Products;
  variant?: "default" | "compact" | "horizontal";
  showAddToCart?: boolean;
  className?: string;
}

export function ProductCard({
  product,
  variant = "default",
  showAddToCart = true,
  className = "",
}: ProductCardProps) {
  const { quickAddToCart, itemLoading, getProductQuantity } = useCartContext();
  const isInCart = useIsInCart(product.id || "");

  // Always use singles for quick-add from card (go to detail page for box option)
  const singleIncrement = getVariantIncrement("single");
  const singlePrice = getVariantPrice("single");

  const [quantity, setQuantity] = useState(singleIncrement);
  const [showQuantitySelector, setShowQuantitySelector] = useState(false);

  const canBuyBox = hasBoxVariant(product);
  const quantityInCart = getProductQuantity(product.id || "");
  // Loading key matches the format in useCart: "productId:variant"
  const isLoading = itemLoading === `${product.id}:single`;

  const handleAddToCart = async () => {
    if (!product.id) return;
    // Always add as singles from card - user can go to detail page for box option
    await quickAddToCart(product, quantity, "single");
    setShowQuantitySelector(false);
    setQuantity(singleIncrement);
  };

  if (variant === "horizontal") {
    return (
      <div
        className={`flex gap-4 p-4 hover:shadow-md transition-shadow ${className}`}
      >
        <Link href={`/products/${product.id}`} className="shrink-0">
          <ProductImage
            src={product.image_url}
            alt={product.name}
            fill
            containerClassName="w-24 h-24 rounded-lg"
          />
        </Link>

        <div className="flex-1 min-w-0">
          <Link href={`/products/${product.id}`}>
            <h3 className="font-medium text-base-content line-clamp-1 hover:text-primary transition-colors">
              {product.name}
            </h3>
          </Link>

          <WholesaleRetailPrice
            wholesalePrice={singlePrice}
            retailPrice={
              product.suggested_retail_price
                ? Number(product.suggested_retail_price)
                : null
            }
            size="sm"
            className="mt-2"
          />
        </div>
        {/* 
        {showAddToCart && (
          <div className="shrink-0">
            <Button
              size="sm"
              variant={isInCart ? "secondary" : "primary"}
              onClick={() => quickAddToCart(product, singleIncrement, "single")}
              loading={isLoading}
              leftIcon={
                isInCart ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Plus className="h-4 w-4" />
                )
              }
            >
              {isInCart ? "Added" : "Add"}
            </Button>
          </div>
        )} */}
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div
        className={`group relative rounded-xl border border-base-300 bg-base-100 overflow-hidden hover:shadow-md transition-all ${className}`}
      >
        <Link href={`/products/${product.id}`}>
          <ProductImage
            src={product.image_url}
            alt={product.name}
            fill
            containerClassName="w-full"
            aspectRatio="square"
          />
        </Link>

        <div className="p-3">
          <Link href={`/products/${product.id}`}>
            <h3 className="font-medium text-sm line-clamp-1 hover:text-primary">
              {product.name}
            </h3>
          </Link>
          <p className="text-sm font-semibold mt-1">
            {formatCurrency(Number(product.wholesale_price))}
          </p>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div
      className={`group relative p-4 rounded-xl overflow-hidden hover:shadow-lg transition-all ${className}`}
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
        {canBuyBox && (
          <Badge variant="default" size="sm">
            <Package className="h-3 w-3 mr-1" />
            Box Available
          </Badge>
        )}
        {product.stock_quantity !== null && product.stock_quantity <= 0 && (
          <Badge variant="error" size="sm">
            Out of Stock
          </Badge>
        )}
      </div>

      {/* Quick add button (shows on hover) */}
      {showAddToCart && !showQuantitySelector && (
        <button
          onClick={() => setShowQuantitySelector(true)}
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-base-100/90 backdrop-blur-sm 
            shadow-md opacity-0 group-hover:opacity-100 transition-all hover:bg-primary hover:text-primary-content"
          aria-label="Add to cart"
        >
          <ShoppingCart className="h-4 w-4" />
        </button>
      )}

      {/* Image */}
      <Link href={`/products/${product.id}`}>
        <ProductImage
          src={product.image_url}
          alt={product.name}
          fill
          containerClassName="w-full"
          aspectRatio="square"
          className="group-hover:scale-105 rounded-xl transition-transform duration-300"
        />
      </Link>

      {/* Content */}
      <div className="py-4">
        <Link href={`/products/${product.id}`}>
          <h3 className="font-semibold text-base-content mt-1 line-clamp-2 hover:text-primary transition-colors overflow-hidden text-nowrap text-ellipsis ">
            {product.name}
          </h3>
        </Link>

        <WholesaleRetailPrice
          wholesalePrice={singlePrice}
          retailPrice={
            product.suggested_retail_price
              ? Number(product.suggested_retail_price)
              : null
          }
          size="sm"
          layout="inline"
          className="mt-3"
        />

        {/* Quantity selector (shows when clicked) */}
        {showQuantitySelector && showAddToCart && (
          <div className="mt-4 pt-4 border-t border-base-300 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-base-content/70">Qty (cards):</span>
              <QuantitySelector
                value={quantity}
                onChange={setQuantity}
                min={singleIncrement}
                step={singleIncrement}
                size="sm"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowQuantitySelector(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleAddToCart}
                loading={isLoading}
                className="flex-1"
              >
                Add {formatCurrency(singlePrice * quantity)}
              </Button>
            </div>
            {canBuyBox && (
              <Link
                href={`/products/${product.id}`}
                className="block text-center text-xs text-primary hover:underline"
              >
                Want box sets? View product details →
              </Link>
            )}
          </div>
        )}

        {/* Cart indicator */}
        {isInCart && !showQuantitySelector && (
          <div className="mt-3 flex items-center gap-2 text-sm text-success">
            <Check className="h-4 w-4" />
            <span>{quantityInCart} in cart</span>
          </div>
        )}
      </div>
    </div>
  );
}

// Loading skeleton for ProductCard
export function ProductCardSkeleton({
  variant = "default",
}: {
  variant?: "default" | "compact" | "horizontal";
}) {
  if (variant === "horizontal") {
    return (
      <div className="flex gap-4 p-4 rounded-xl border border-base-300 bg-base-100 animate-pulse">
        <div className="w-24 h-24 rounded-lg bg-base-200" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-base-200 rounded w-3/4" />
          <div className="h-3 bg-base-200 rounded w-1/4" />
          <div className="h-4 bg-base-200 rounded w-1/2 mt-2" />
        </div>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div className="rounded-xl border border-base-300 bg-base-100 overflow-hidden animate-pulse">
        <div className="aspect-square bg-base-200" />
        <div className="p-3 space-y-2">
          <div className="h-4 bg-base-200 rounded w-3/4" />
          <div className="h-4 bg-base-200 rounded w-1/2" />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-base-300 bg-base-100 overflow-hidden animate-pulse">
      <div className="aspect-square bg-base-200" />
      <div className="p-4 space-y-3">
        <div className="h-3 bg-base-200 rounded w-1/4" />
        <div className="h-5 bg-base-200 rounded w-3/4" />
        <div className="h-4 bg-base-200 rounded w-1/2" />
        <div className="h-3 bg-base-200 rounded w-2/3" />
      </div>
    </div>
  );
}
