"use client";

import { useState, useMemo } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useSearchParams } from "next/navigation";
import { mockProducts } from "@/lib/mock-data";
import { ProductCard, ProductFilters } from "@/components/product";
import { Loading } from "@/components/ui";
import { Products } from "@/types/products";

export default function ProductsPage() {
  const { user, isLoading } = useUser();
  const searchParams = useSearchParams();

  const initialCategory = searchParams?.get("category") || "all";
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState("name-asc");

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...mockProducts];

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    // Sort
    switch (sortBy) {
      case "name-asc":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "price-asc":
        filtered.sort((a, b) => a.wholesale_price - b.wholesale_price);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.wholesale_price - a.wholesale_price);
        break;
      case "newest":
        filtered.sort((a, b) => {
          const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
          const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
          return dateB - dateA;
        });
        break;
      case "popular":
        // For now, just sort by stock (assuming popular items have lower stock)
        filtered.sort((a, b) => {
          const stockA = a.stock_quantity || 0;
          const stockB = b.stock_quantity || 0;
          return stockA - stockB;
        });
        break;
    }

    return filtered;
  }, [selectedCategory, sortBy]);

  if (isLoading) {
    return <Loading text="Loading products..." />;
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-neutral font-serif mb-2">
          Product Catalog
        </h1>
        <p className="text-base-content">
          Browse our collection of handcrafted letterpress greeting cards
        </p>
        {!user && (
          <div className="mt-4 p-4 bg-info/10 border border-info/30 rounded-lg">
            <p className="text-info text-sm">
              <strong>Note:</strong> Sign in to view wholesale pricing and place
              orders.
            </p>
          </div>
        )}
      </div>

      {/* Filters */}
      <ProductFilters
        selectedCategory={selectedCategory}
        sortBy={sortBy}
        onCategoryChange={setSelectedCategory}
        onSortChange={setSortBy}
      />

      {/* Results Count */}
      <div className="mb-4">
        <p className="text-sm text-neutral-content">
          Showing {filteredAndSortedProducts.length}{" "}
          {filteredAndSortedProducts.length === 1 ? "product" : "products"}
          {selectedCategory !== "all" && ` in ${selectedCategory}`}
        </p>
      </div>

      {/* Product Grid */}
      {filteredAndSortedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAndSortedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              showPricing={!!user}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-neutral-content text-lg">
            No products found in this category.
          </p>
        </div>
      )}
    </main>
  );
}
