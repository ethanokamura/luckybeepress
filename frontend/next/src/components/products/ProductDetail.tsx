"use client";

import { useState } from "react";
import {
  ArrowLeft,
  ShoppingCart,
  Check,
  Package,
  Ruler,
  Palette,
  Layers,
} from "lucide-react";
import Link from "next/link";
import type { Products } from "@/types/products";
import { ProductGallery } from "@/components/ui/ProductImage";
import { PricePerSet } from "@/components/ui/PriceDisplay";
import { QuantitySelector } from "@/components/ui/QuantitySelector";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { StockStatusBadge } from "@/components/ui/StatusBadge";
import { QualityBadges } from "@/components/ui/TrustBadges";
import { Card, CardContent } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { useCartContext } from "@/providers/CartProvider";
import {
  type ProductVariant,
  hasBoxVariant,
  getVariantIncrement,
  getVariantUnit,
  getVariantPrice,
  getVariantQuantityDescription,
  getVariantInfo,
} from "@/lib/cart-utils";
import { formatCurrency } from "@/lib/format";
import { PRODUCT_SPECS, PRODUCT_CONFIG } from "@/lib/constants";

interface ProductDetailProps {
  product: Products;
  className?: string;
}

export function ProductDetail({ product, className = "" }: ProductDetailProps) {
  const { quickAddToCart, itemLoading, isVariantInCart, getVariantQuantity } =
    useCartContext();

  // Determine available variants
  const canBuyBox = hasBoxVariant(product);

  // State for selected variant and quantity
  const [selectedVariant, setSelectedVariant] =
    useState<ProductVariant>("single");

  // Get variant-specific values
  const increment = getVariantIncrement(selectedVariant);
  const unit = getVariantUnit(selectedVariant);
  const unitPrice = getVariantPrice(selectedVariant);

  // Check cart status for the selected variant
  const variantInCart = isVariantInCart(product.id || "", selectedVariant);
  const variantQuantityInCart = getVariantQuantity(
    product.id || "",
    selectedVariant
  );
  // Loading key matches the format in useCart: "productId:variant"
  const isLoading = itemLoading === `${product.id}:${selectedVariant}`;

  const [quantity, setQuantity] = useState(increment);

  // Reset quantity when variant changes
  const handleVariantChange = (variant: ProductVariant) => {
    setSelectedVariant(variant);
    setQuantity(getVariantIncrement(variant));
  };

  const handleAddToCart = async () => {
    if (!product.id) return;
    await quickAddToCart(product, quantity, selectedVariant);
  };

  const totalPrice = unitPrice * quantity;
  const images = product.image_url ? [product.image_url] : [];

  // Get info for both variants (for display)
  const singleInfo = getVariantInfo("single");
  const boxInfo = getVariantInfo("box");

  return (
    <div className={`${className}`}>
      {/* Back button */}
      <Link
        href="/products"
        className="inline-flex items-center gap-2 text-sm text-base-content/60 hover:text-primary mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Products
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Image gallery */}
        <div>
          <ProductGallery images={images} alt={product.name} />
        </div>

        {/* Product info */}
        <div className="space-y-6">
          {/* Category & badges */}
          <div className="flex flex-wrap items-center gap-2">
            {product.category && (
              <Badge variant="default">{product.category}</Badge>
            )}
            {canBuyBox && (
              <Badge variant="secondary">
                <Package className="h-3 w-3 mr-1" />
                Box Sets Available
              </Badge>
            )}
            <StockStatusBadge
              quantity={product.stock_quantity}
              threshold={product.low_stock_threshold || 10}
            />
          </div>

          {/* Title */}
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-base-content">
              {product.name}
            </h1>
            {product.sku && (
              <p className="text-sm text-base-content/50 mt-1">
                SKU: {product.sku}
              </p>
            )}
          </div>

          {/* Variant Selector */}
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Layers className="h-4 w-4 text-primary" />
              Choose Format
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Single Cards Option */}
              <button
                onClick={() => handleVariantChange("single")}
                className={`relative p-4 rounded-xl border-2 text-left transition-all ${
                  selectedVariant === "single"
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                    : "border-base-300 hover:border-primary/50"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-semibold text-base-content">
                      {singleInfo.label}
                    </span>
                    <p className="text-lg font-bold text-primary mt-1">
                      {formatCurrency(singleInfo.price)}/card
                    </p>
                  </div>
                  {selectedVariant === "single" && (
                    <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                      <Check className="h-3 w-3 text-primary-content" />
                    </div>
                  )}
                </div>
                <p className="text-xs text-base-content/60 mt-2">
                  Min {singleInfo.increment} cards (
                  {formatCurrency(singleInfo.price * singleInfo.increment)}/set)
                </p>
                {isVariantInCart(product.id || "", "single") && (
                  <p className="text-xs text-success mt-1 flex items-center gap-1">
                    <Check className="h-3 w-3" />
                    {getVariantQuantity(product.id || "", "single")} in cart
                  </p>
                )}
              </button>

              {/* Box Set Option - only show if product has boxes */}
              {canBuyBox && (
                <button
                  onClick={() => handleVariantChange("box")}
                  className={`relative p-4 rounded-xl border-2 text-left transition-all ${
                    selectedVariant === "box"
                      ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                      : "border-base-300 hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-semibold text-base-content flex items-center gap-1.5">
                        <Package className="h-4 w-4" />
                        {boxInfo.label}
                      </span>
                      <p className="text-lg font-bold text-primary mt-1">
                        {formatCurrency(boxInfo.price)}/box
                      </p>
                    </div>
                    {selectedVariant === "box" && (
                      <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                        <Check className="h-3 w-3 text-primary-content" />
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-base-content/60 mt-2">
                    {PRODUCT_CONFIG.box.cardsPerBox} cards/box • Min{" "}
                    {boxInfo.increment} boxes (
                    {formatCurrency(boxInfo.price * boxInfo.increment)}/set)
                  </p>
                  {isVariantInCart(product.id || "", "box") && (
                    <p className="text-xs text-success mt-1 flex items-center gap-1">
                      <Check className="h-3 w-3" />
                      {getVariantQuantity(product.id || "", "box")} in cart
                    </p>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Selected variant pricing summary */}
          <div className="p-4 rounded-lg bg-base-200/50 border border-base-300">
            <PricePerSet
              pricePerUnit={unitPrice}
              unitsPerSet={increment}
              unitLabel={selectedVariant === "box" ? "box" : "card"}
              size="md"
            />
          </div>

          {/* Description */}
          {product.description && (
            <p className="text-base-content/70 leading-relaxed">
              {product.description}
            </p>
          )}

          {/* Add to cart */}
          <Card variant="bordered" className="bg-base-200/30">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm text-base-content/70">Quantity</span>
                  <p className="text-xs text-base-content/50 mt-0.5">
                    Sold in sets of {increment} {unit}
                  </p>
                </div>
                <QuantitySelector
                  value={quantity}
                  onChange={setQuantity}
                  min={increment}
                  step={increment}
                  size="md"
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-base-300">
                <div>
                  <span className="text-sm text-base-content/70">Total</span>
                  <p className="text-2xl font-bold">
                    {formatCurrency(totalPrice)}
                  </p>
                  <p className="text-xs text-base-content/50">
                    {getVariantQuantityDescription(selectedVariant, quantity)}
                  </p>
                </div>

                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleAddToCart}
                  loading={isLoading}
                  disabled={
                    product.stock_quantity !== null &&
                    product.stock_quantity <= 0
                  }
                  leftIcon={
                    variantInCart ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <ShoppingCart className="h-5 w-5" />
                    )
                  }
                >
                  {variantInCart ? "Add More" : "Add to Cart"}
                </Button>
              </div>

              {variantInCart && (
                <p className="text-sm text-success flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  {variantQuantityInCart} {unit} already in your cart
                </p>
              )}
            </CardContent>
          </Card>

          {/* Specifications */}
          <div className="space-y-4">
            <h3 className="font-semibold">Product Specifications</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Ruler className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Size</p>
                  <p className="text-sm text-base-content/60">
                    {PRODUCT_SPECS.cardSize}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Palette className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Printing</p>
                  <p className="text-sm text-base-content/60">
                    {PRODUCT_SPECS.printing}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quality badges */}
          <QualityBadges />
        </div>
      </div>
    </div>
  );
}

// Loading skeleton
export function ProductDetailSkeleton() {
  return (
    <div>
      <div className="h-4 w-32 mb-6">
        <Skeleton variant="text" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <Skeleton variant="rectangular" className="aspect-square rounded-xl" />

        <div className="space-y-6">
          <div className="flex gap-2">
            <Skeleton variant="text" width={80} height={24} />
            <Skeleton variant="text" width={80} height={24} />
          </div>

          <div className="space-y-2">
            <Skeleton variant="text" width="80%" height={32} />
            <Skeleton variant="text" width={100} height={16} />
          </div>

          <div className="space-y-2">
            <Skeleton variant="text" width={120} height={28} />
            <Skeleton variant="text" width={180} height={20} />
          </div>

          <div className="space-y-2">
            <Skeleton variant="text" width="100%" height={16} />
            <Skeleton variant="text" width="90%" height={16} />
            <Skeleton variant="text" width="80%" height={16} />
          </div>

          <Skeleton variant="rectangular" className="h-40 rounded-xl" />

          <div className="grid grid-cols-2 gap-4">
            <Skeleton variant="rectangular" className="h-16 rounded-lg" />
            <Skeleton variant="rectangular" className="h-16 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
