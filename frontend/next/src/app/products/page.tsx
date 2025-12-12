"use client";

import { useState } from "react";
import { Filter } from "lucide-react";
import { ProductGrid } from "@/components/products/ProductGrid";
import {
  ProductFilters,
  MobileFiltersDrawer,
  ProductFiltersSidebar,
} from "@/components/products/ProductFilters";
import { Button } from "@/components/ui/Button";
import { useProducts } from "@/hooks/useProducts";
import { PAGINATION } from "@/lib/constants";

export default function ProductsPage() {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const {
    products,
    loading,
    filters,
    sort,
    hasMore,
    setFilters,
    setSort,
    clearFilters,
    loadMore,
  } = useProducts({
    limit: PAGINATION.productGridLimit,
  });

  return (
    <main className="min-h-screen bg-base-100">
      {/* Page header */}
      <div className="bg-gradient-to-b from-base-200 to-base-100 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-base-content">
            Product Catalog
          </h1>
          <p className="text-base-content/60 mt-2">
            Browse our collection of premium letterpress greeting cards
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Desktop sidebar filters */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24">
              <ProductFiltersSidebar
                filters={filters}
                onFiltersChange={setFilters}
                onClear={clearFilters}
              />
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Mobile filter button */}
            <div className="lg:hidden mb-4">
              <Button
                variant="outline"
                leftIcon={<Filter className="h-4 w-4" />}
                onClick={() => setMobileFiltersOpen(true)}
              >
                Filters
              </Button>
            </div>

            {/* Filters bar */}
            <ProductFilters
              filters={filters}
              sort={sort}
              onFiltersChange={setFilters}
              onSortChange={setSort}
              onClear={clearFilters}
              totalResults={products.length}
              className="mb-8"
            />

            {/* Product grid */}
            <ProductGrid
              products={products}
              loading={loading}
              emptyAction={clearFilters}
            />

            {/* Load more */}
            {hasMore && !loading && products.length > 0 && (
              <div className="flex justify-center mt-12">
                <Button variant="outline" onClick={loadMore}>
                  Load More Products
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filters drawer */}
      <MobileFiltersDrawer
        isOpen={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        filters={filters}
        onFiltersChange={setFilters}
        onClear={clearFilters}
      />
    </main>
  );
}
