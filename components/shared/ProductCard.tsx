"use client";

import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/firebase-helpers";
import type { Product, ProductListItem } from "@/types";

interface ProductCardProps {
  product: Product | ProductListItem;
}

export function ProductCard({ product }: ProductCardProps) {
  const isOutOfStock = product.inventory <= 0;
  const hasBoxOption = product.hasBoxOption && product.boxWholesalePrice;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block rounded-lg border bg-card overflow-hidden transition-all hover:shadow-lg hover:border-primary/30"
    >
      {/* Image */}
      <div className="relative aspect-square bg-muted overflow-hidden">
        {product.images?.[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-4xl">
            🐝
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {hasBoxOption && (
            <span className="bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded">
              Box Available
            </span>
          )}
          {isOutOfStock && (
            <span className="bg-muted-foreground text-white text-xs font-medium px-2 py-1 rounded">
              Out of Stock
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
          {product.category}
        </p>
        <h3 className="font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">
          {product.name}
        </h3>

        {/* Pricing */}
        <div className="mt-2">
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold text-foreground">
              {formatPrice(product.wholesalePrice)}
            </span>
            <span className="text-xs text-muted-foreground">/card</span>
          </div>
          {hasBoxOption && (
            <p className="text-sm text-primary">
              or {formatPrice(product.boxWholesalePrice!)}/box
            </p>
          )}
        </div>

        {/* Wholesale info */}
        <p className="mt-1 text-xs text-muted-foreground">
          Min. order: 6 cards
        </p>
      </div>
    </Link>
  );
}
