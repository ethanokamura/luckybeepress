"use client";

import { useState } from "react";
import { Search, Plus } from "lucide-react";
import { AdminProductsTable } from "@/components/admin/AdminProductsTable";
import {
  ProductForm,
  type ProductFormData,
} from "@/components/admin/ProductForm";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { useAdminProducts } from "@/hooks/useAdmin";
import {
  createProducts,
  updateProducts,
  deleteProducts,
} from "@/actions/products";
import { useToast } from "@/providers/ToastProvider";
import type { Products } from "@/types/products";
import { useCategories } from "@/hooks";

export default function AdminProductsPage() {
  const toast = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Products | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const { categories: fetchedCategories } = useCategories();
  const categoryOptions = [
    { value: "", label: "All Categories" },
    ...fetchedCategories.map((cat) => ({ value: cat, label: cat })),
  ];
  const {
    products,
    loading,
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    refresh,
  } = useAdminProducts();

  const handleEdit = (product: Products) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleCreate = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleSubmit = async (data: ProductFormData) => {
    setFormLoading(true);
    try {
      if (editingProduct?.id) {
        // Update existing product
        const response = await updateProducts(editingProduct.id, {
          sku: data.sku,
          name: data.name,
          description: data.description || undefined,
          category: data.category || undefined,
          wholesale_price: data.wholesale_price,
          suggested_retail_price: data.suggested_retail_price ?? undefined,
          cost: data.cost ?? undefined,
          is_active: data.is_active,
          minimum_order_quantity: data.minimum_order_quantity,
          has_box: data.has_box,
          stock_quantity: data.stock_quantity,
          low_stock_threshold: data.low_stock_threshold,
          image_url: data.image_url || undefined,
          weight_oz: data.weight_oz ?? undefined,
        });

        if (response.success) {
          toast.success("Product updated successfully");
          handleCloseForm();
          refresh();
        } else {
          toast.error(response.error || "Failed to update product");
        }
      } else {
        // Create new product
        const response = await createProducts({
          sku: data.sku,
          name: data.name,
          description: data.description || undefined,
          category: data.category || undefined,
          wholesale_price: data.wholesale_price,
          suggested_retail_price: data.suggested_retail_price ?? undefined,
          cost: data.cost ?? undefined,
          is_active: data.is_active,
          minimum_order_quantity: data.minimum_order_quantity,
          has_box: data.has_box,
          stock_quantity: data.stock_quantity,
          low_stock_threshold: data.low_stock_threshold,
          image_url: data.image_url || undefined,
          weight_oz: data.weight_oz ?? undefined,
        });

        if (response.success) {
          toast.success("Product created successfully");
          handleCloseForm();
          refresh();
        } else {
          toast.error(response.error || "Failed to create product");
        }
      }
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (productId: string) => {
    const response = await deleteProducts(productId);
    if (response.success) {
      toast.success("Product deleted successfully");
      refresh();
    } else {
      toast.error(response.error || "Failed to delete product");
    }
  };

  const handleToggleActive = async (productId: string, isActive: boolean) => {
    const response = await updateProducts(productId, { is_active: isActive });
    if (response.success) {
      toast.success(`Product ${isActive ? "activated" : "deactivated"}`);
      refresh();
    } else {
      toast.error(response.error || "Failed to update product");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-base-content/60 mt-1">
            Manage your product catalog
          </p>
        </div>
        <Button
          variant="primary"
          leftIcon={<Plus className="h-4 w-4" />}
          onClick={handleCreate}
        >
          Add Product
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by name, SKU, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="h-5 w-5" />}
              />
            </div>
            <Select
              options={categoryOptions}
              value={categoryFilter || ""}
              onChange={(e) => setCategoryFilter(e.target.value || null)}
              className="w-full sm:w-48"
            />
          </div>
        </CardContent>
      </Card>

      {/* Products table */}
      <AdminProductsTable
        products={products}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleActive={handleToggleActive}
      />

      {/* Results count */}
      {!loading && (
        <p className="text-sm text-base-content/60 text-center">
          Showing {products.length} product{products.length !== 1 ? "s" : ""}
        </p>
      )}

      {/* Product form modal */}
      <Modal
        isOpen={showForm}
        onClose={handleCloseForm}
        title={editingProduct ? "Edit Product" : "Add New Product"}
        size="full"
      >
        <ProductForm
          product={editingProduct}
          onSubmit={handleSubmit}
          onCancel={handleCloseForm}
          loading={formLoading}
        />
      </Modal>
    </div>
  );
}
