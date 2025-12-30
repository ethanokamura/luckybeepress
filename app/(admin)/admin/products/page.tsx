"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getDocs, query, orderBy } from "firebase/firestore";
import { collections, formatPrice } from "@/lib/firebase-helpers";
import { Button } from "@/components/ui/button";
import type { Product } from "@/types";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const q = query(collections.products, orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        setProducts(snapshot.docs.map((doc) => doc.data()));
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const getStatusBadge = (status: string) => {
    const colors = {
      active: "bg-green-100 text-green-800",
      draft: "bg-gray-100 text-gray-800",
      archived: "bg-red-100 text-red-800",
    };
    return colors[status as keyof typeof colors] || colors.draft;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-8 bg-muted animate-pulse rounded w-32" />
          <div className="h-10 bg-muted animate-pulse rounded w-32" />
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Products</h1>
        <Link href="/admin/products/new">
          <Button>+ Add Product</Button>
        </Link>
      </div>

      {products.length > 0 ? (
        <div className="bg-card border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-4 font-medium">Product</th>
                <th className="text-left p-4 font-medium">Category</th>
                <th className="text-left p-4 font-medium">Wholesale</th>
                <th className="text-left p-4 font-medium">Box</th>
                <th className="text-left p-4 font-medium">Stock</th>
                <th className="text-left p-4 font-medium">Status</th>
                <th className="text-right p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-muted/30">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded bg-muted overflow-hidden shrink-0">
                        {product.images?.[0] ? (
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-lg">
                            🐝
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {product.sku}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-muted-foreground">
                    {product.category}
                  </td>
                  <td className="p-4">
                    <div>
                      <p>{formatPrice(product.wholesalePrice)}/card</p>
                      {product.retailPrice && (
                        <p className="text-xs text-muted-foreground">
                          SRP: {formatPrice(product.retailPrice)}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    {product.hasBoxOption && product.boxWholesalePrice ? (
                      <span className="text-primary">
                        {formatPrice(product.boxWholesalePrice)}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="p-4">
                    <span
                      className={
                        product.inventory <= 0
                          ? "text-red-600"
                          : product.inventory < product.lowStockThreshold
                          ? "text-amber-600"
                          : ""
                      }
                    >
                      {product.inventory}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                        product.status
                      )}`}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="text-sm text-primary hover:underline"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-card border rounded-lg p-12 text-center">
          <span className="text-4xl mb-4 block">🐝</span>
          <h2 className="text-xl font-medium mb-2">No products yet</h2>
          <p className="text-muted-foreground mb-6">
            Add your first product to start selling.
          </p>
          <Link href="/admin/products/new">
            <Button>+ Add Product</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
