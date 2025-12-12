"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FeaturedProductsRow } from "@/components/products/ProductGrid";
import { ProductGrid } from "@/components/products/ProductGrid";
import { Button } from "@/components/ui/Button";
import { useBestSellers, useNewArrivals } from "@/hooks/useProducts";

interface FeaturedSectionProps {
  title: string;
  description?: string;
  viewAllLink?: string;
  viewAllText?: string;
  children: React.ReactNode;
  className?: string;
}

export function FeaturedSection({
  title,
  description,
  viewAllLink,
  viewAllText = "View All",
  children,
  className = "",
}: FeaturedSectionProps) {
  return (
    <section className={`py-12 md:py-16 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-base-content">
              {title}
            </h2>
            {description && (
              <p className="text-base-content/60 mt-2">{description}</p>
            )}
          </div>
          {viewAllLink && (
            <Link href={viewAllLink}>
              <Button
                variant="ghost"
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                {viewAllText}
              </Button>
            </Link>
          )}
        </div>
        {children}
      </div>
    </section>
  );
}

// Pre-built Best Sellers section
export function BestSellersSection({ className = "" }: { className?: string }) {
  const { products, loading } = useBestSellers(8);

  return (
    <FeaturedSection
      title="Best Sellers"
      description="Our most popular cards loved by retailers"
      viewAllLink="/products?sort=bestsellers"
      className={className}
    >
      <ProductGrid
        products={products}
        loading={loading}
        columns={4}
      />
    </FeaturedSection>
  );
}

// Pre-built New Arrivals section
export function NewArrivalsSection({ className = "" }: { className?: string }) {
  const { products, loading } = useNewArrivals(8);

  return (
    <FeaturedSection
      title="New Arrivals"
      description="Fresh designs just added to the collection"
      viewAllLink="/products?sort=newest"
      className={className}
    >
      <ProductGrid
        products={products}
        loading={loading}
        columns={4}
      />
    </FeaturedSection>
  );
}

// Horizontal scroll variant
export function FeaturedProductsSection({
  title,
  description,
  viewAllLink,
  className = "",
}: {
  title: string;
  description?: string;
  viewAllLink?: string;
  className?: string;
}) {
  const { products, loading } = useBestSellers(12);

  return (
    <section className={`py-12 md:py-16 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-base-content">
              {title}
            </h2>
            {description && (
              <p className="text-base-content/60 mt-2">{description}</p>
            )}
          </div>
          {viewAllLink && (
            <Link href={viewAllLink}>
              <Button
                variant="ghost"
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                View All
              </Button>
            </Link>
          )}
        </div>
        <FeaturedProductsRow products={products} loading={loading} />
      </div>
    </section>
  );
}

