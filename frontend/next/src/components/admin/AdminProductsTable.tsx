"use client";

import { useState } from "react";
import Link from "next/link";
import { Edit, Trash2, MoreVertical, Eye, EyeOff, Plus } from "lucide-react";
import type { Products } from "@/types/products";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { ProductThumbnail } from "@/components/ui/ProductImage";
import { StockStatusBadge } from "@/components/ui/StatusBadge";
import { formatCurrency } from "@/lib/format";

interface AdminProductsTableProps {
  products: Products[];
  loading?: boolean;
  onEdit?: (product: Products) => void;
  onDelete?: (productId: string) => Promise<void>;
  onToggleActive?: (productId: string, isActive: boolean) => Promise<void>;
  className?: string;
}

export function AdminProductsTable({
  products,
  loading = false,
  onEdit,
  onDelete,
  onToggleActive,
  className = "",
}: AdminProductsTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const handleDelete = async (productId: string) => {
    if (!onDelete) return;
    if (!confirm("Are you sure you want to delete this product?")) return;

    setDeletingId(productId);
    try {
      await onDelete(productId);
    } finally {
      setDeletingId(null);
      setOpenMenuId(null);
    }
  };

  const handleToggleActive = async (productId: string, currentActive: boolean) => {
    if (!onToggleActive) return;
    await onToggleActive(productId, !currentActive);
    setOpenMenuId(null);
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-base-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Product</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">SKU</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Category</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold">WSP</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold">SRP</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold">Stock</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold">Status</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-t border-base-300">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Skeleton variant="rectangular" className="w-12 h-12 rounded-lg" />
                        <Skeleton variant="text" className="h-5 w-40" />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Skeleton variant="text" className="h-5 w-20" />
                    </td>
                    <td className="px-4 py-3">
                      <Skeleton variant="text" className="h-5 w-24" />
                    </td>
                    <td className="px-4 py-3">
                      <Skeleton variant="text" className="h-5 w-16 ml-auto" />
                    </td>
                    <td className="px-4 py-3">
                      <Skeleton variant="text" className="h-5 w-16 ml-auto" />
                    </td>
                    <td className="px-4 py-3">
                      <Skeleton variant="text" className="h-5 w-12 mx-auto" />
                    </td>
                    <td className="px-4 py-3">
                      <Skeleton variant="text" className="h-6 w-16 mx-auto" />
                    </td>
                    <td className="px-4 py-3">
                      <Skeleton variant="text" className="h-8 w-8 ml-auto" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (products.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="py-12 text-center">
          <p className="text-base-content/60 mb-4">No products found</p>
          <Link href="/admin/products/new">
            <Button variant="primary" leftIcon={<Plus className="h-4 w-4" />}>
              Add Product
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-base-200">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">Product</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">SKU</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Category</th>
                <th className="px-4 py-3 text-right text-sm font-semibold">WSP</th>
                <th className="px-4 py-3 text-right text-sm font-semibold">SRP</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">Stock</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">Status</th>
                <th className="px-4 py-3 text-right text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr
                  key={product.id}
                  className={`border-t border-base-300 hover:bg-base-200/50 ${
                    !product.is_active ? "opacity-60" : ""
                  }`}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <ProductThumbnail
                        src={product.image_url}
                        alt={product.name}
                        size="sm"
                      />
                      <span className="font-medium text-sm line-clamp-1">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-sm">{product.sku}</span>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="default" size="sm">
                      {product.category || "—"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right font-semibold">
                    {formatCurrency(Number(product.wholesale_price))}
                  </td>
                  <td className="px-4 py-3 text-right text-base-content/60">
                    {product.suggested_retail_price
                      ? formatCurrency(Number(product.suggested_retail_price))
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="font-mono text-sm">{product.stock_quantity ?? "—"}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <StockStatusBadge
                      quantity={product.stock_quantity}
                      threshold={product.low_stock_threshold || 10}
                      size="sm"
                    />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="relative inline-block">
                      <button
                        onClick={() =>
                          setOpenMenuId(openMenuId === product.id ? null : product.id || null)
                        }
                        className="p-2 rounded-lg hover:bg-base-200"
                        disabled={deletingId === product.id}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>

                      {openMenuId === product.id && (
                        <div className="absolute right-0 top-full mt-1 w-48 rounded-lg border border-base-300 bg-base-100 shadow-lg z-10">
                          {onEdit && (
                            <button
                              onClick={() => {
                                onEdit(product);
                                setOpenMenuId(null);
                              }}
                              className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-base-200 w-full text-left"
                            >
                              <Edit className="h-4 w-4" />
                              Edit Product
                            </button>
                          )}
                          {onToggleActive && (
                            <button
                              onClick={() =>
                                product.id &&
                                handleToggleActive(product.id, product.is_active ?? true)
                              }
                              className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-base-200 w-full text-left"
                            >
                              {product.is_active ? (
                                <>
                                  <EyeOff className="h-4 w-4" />
                                  Deactivate
                                </>
                              ) : (
                                <>
                                  <Eye className="h-4 w-4" />
                                  Activate
                                </>
                              )}
                            </button>
                          )}
                          {onDelete && (
                            <button
                              onClick={() => product.id && handleDelete(product.id)}
                              className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-base-200 w-full text-left text-error"
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete Product
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

