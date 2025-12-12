"use client";

import { use } from "react";
import {
  ProductDetail,
  ProductDetailSkeleton,
} from "@/components/products/ProductDetail";
import { FeaturedProductsRow } from "@/components/products/ProductGrid";
import { useProduct, useProducts } from "@/hooks/useProducts";
import Link from "next/link";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  const { id } = use(params);
  const { product, loading, error } = useProduct(id);

  // Fetch related products (same category)
  const { products: relatedProducts, loading: relatedLoading } = useProducts({
    initialFilters: product?.category ? { category: product.category } : {},
    limit: 8,
    autoFetch: Boolean(product?.category),
  });

  // Filter out current product from related
  const filteredRelated = relatedProducts.filter((p) => p.id !== id);

  if (loading) {
    return (
      <main className="min-h-screen bg-base-100">
        <div className="container mx-auto px-4 py-8">
          <ProductDetailSkeleton />
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="min-h-screen bg-base-100">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-base-content mb-4">
            Product Not Found
          </h1>
          <p className="text-base-content/60 mb-8">
            The product you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
          <Link href="/products" className="text-primary hover:underline">
            Browse All Products
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-base-100">
      <div className="container mx-auto px-4 py-8">
        <ProductDetail product={product} />

        {/* Related products */}
        {filteredRelated.length > 0 && (
          <section className="mt-16 pt-8 border-t border-base-300">
            <FeaturedProductsRow
              products={filteredRelated.slice(0, 6)}
              title="Related Products"
              loading={relatedLoading}
            />
          </section>
        )}
      </div>
    </main>
  );
}
