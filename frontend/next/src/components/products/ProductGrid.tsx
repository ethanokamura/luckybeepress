"use client";

import type { Products } from "@/types/products";
import { ProductCard, ProductCardSkeleton } from "./ProductCard";
import { EmptyProducts } from "@/components/ui/EmptyState";

interface ProductGridProps {
  products: Products[];
  loading?: boolean;
  emptyAction?: () => void;
  columns?: 2 | 3 | 4;
  variant?: "default" | "compact";
  showAddToCart?: boolean;
  className?: string;
}

export function ProductGrid({
  products,
  loading = false,
  emptyAction,
  columns = 4,
  variant = "default",
  showAddToCart = true,
  className = "",
}: ProductGridProps) {
  const columnClasses = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  };

  if (loading) {
    return (
      <div className={`grid ${columnClasses[columns]} gap-6 ${className}`}>
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} variant={variant} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return <EmptyProducts onClearFilters={emptyAction} className={className} />;
  }

  return (
    <div className={`grid ${columnClasses[columns]} gap-6 ${className}`}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          variant={variant}
          showAddToCart={showAddToCart}
        />
      ))}
    </div>
  );
}

// List view variant
interface ProductListProps {
  products: Products[];
  loading?: boolean;
  emptyAction?: () => void;
  showAddToCart?: boolean;
  className?: string;
}

export function ProductList({
  products,
  loading = false,
  emptyAction,
  showAddToCart = true,
  className = "",
}: ProductListProps) {
  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        {Array.from({ length: 6 }).map((_, i) => (
          <ProductCardSkeleton key={i} variant="horizontal" />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return <EmptyProducts onClearFilters={emptyAction} className={className} />;
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          variant="horizontal"
          showAddToCart={showAddToCart}
        />
      ))}
    </div>
  );
}

// Featured products row (horizontal scroll)
interface FeaturedProductsRowProps {
  products: Products[];
  title?: string;
  loading?: boolean;
  className?: string;
}

export function FeaturedProductsRow({
  products,
  title,
  loading = false,
  className = "",
}: FeaturedProductsRowProps) {
  if (loading) {
    return (
      <div className={className}>
        {title && <h2 className="text-xl font-bold mb-4">{title}</h2>}
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="shrink-0 w-64">
              <ProductCardSkeleton variant="compact" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) return null;

  return (
    <div className={className}>
      {title && <h2 className="text-xl font-bold mb-4">{title}</h2>}
      <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
        {products.map((product) => (
          <div key={product.id} className="shrink-0 w-64">
            <ProductCard product={product} variant="compact" />
          </div>
        ))}
      </div>
    </div>
  );
}
