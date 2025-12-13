"use client";

import { useState, useEffect } from "react";
import type { Products } from "@/types/products";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { useCategories } from "@/hooks";

interface ProductFormProps {
  product?: Products | null;
  onSubmit: (data: ProductFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export interface ProductFormData {
  sku: string;
  name: string;
  description: string;
  category: string;
  wholesale_price: number;
  suggested_retail_price: number | null;
  cost: number | null;
  is_active: boolean;
  minimum_order_quantity: number;
  has_box: boolean;
  stock_quantity: number;
  low_stock_threshold: number;
  image_url: string;
  weight_oz: number | null;
}

const defaultFormData: ProductFormData = {
  sku: "",
  name: "",
  description: "",
  category: "",
  wholesale_price: 0,
  suggested_retail_price: null,
  cost: null,
  is_active: true,
  minimum_order_quantity: 6,
  has_box: false,
  stock_quantity: 0,
  low_stock_threshold: 10,
  image_url: "",
  weight_oz: null,
};

export function ProductForm({
  product,
  onSubmit,
  onCancel,
  loading = false,
}: ProductFormProps) {
  const [formData, setFormData] = useState<ProductFormData>(defaultFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { categories: fetchedCategories } = useCategories();

  useEffect(() => {
    const setForm = () => {
      if (product) {
        setFormData({
          sku: product.sku || "",
          name: product.name || "",
          description: product.description || "",
          category: product.category || "",
          wholesale_price: Number(product.wholesale_price) || 0,
          suggested_retail_price: product.suggested_retail_price
            ? Number(product.suggested_retail_price)
            : null,
          cost: product.cost ? Number(product.cost) : null,
          is_active: product.is_active ?? true,
          minimum_order_quantity: product.minimum_order_quantity || 6,
          has_box: product.has_box ?? false,
          stock_quantity: product.stock_quantity || 0,
          low_stock_threshold: product.low_stock_threshold || 10,
          image_url: product.image_url || "",
          weight_oz: product.weight_oz ? Number(product.weight_oz) : null,
        });
      }
    };
    setForm();
  }, [product, fetchedCategories]);

  const handleChange = (
    field: keyof ProductFormData,
    value: string | number | boolean | null
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.sku.trim()) {
      newErrors.sku = "SKU is required";
    }
    if (!formData.name.trim()) {
      newErrors.name = "Product name is required";
    }
    if (formData.wholesale_price <= 0) {
      newErrors.wholesale_price = "Wholesale price must be greater than 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit(formData);
  };

  const categoryOptions = [
    { value: "", label: "Select category" },
    ...fetchedCategories.map((cat) => ({ value: cat, label: cat })),
  ];

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="SKU"
              value={formData.sku}
              onChange={(e) => handleChange("sku", e.target.value)}
              error={errors.sku}
              placeholder="e.g., BD-HAPPY-001"
              required
            />

            <Input
              label="Product Name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              error={errors.name}
              placeholder="e.g., Happy Birthday Letterpress Card"
              required
            />

            <Select
              label="Category"
              options={categoryOptions}
              value={formData.category}
              onChange={(e) => handleChange("category", e.target.value)}
            />

            <div>
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-base-300 bg-base-100 px-4 py-2 text-base focus:border-primary focus:outline-none"
                placeholder="Product description..."
              />
            </div>

            <Input
              label="Image URL"
              value={formData.image_url}
              onChange={(e) => handleChange("image_url", e.target.value)}
              placeholder="https://..."
            />
          </CardContent>
        </Card>

        {/* Pricing */}
        <Card>
          <CardHeader>
            <CardTitle>Pricing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Wholesale Price (WSP)"
              type="number"
              step="0.01"
              min="0"
              value={formData.wholesale_price}
              onChange={(e) =>
                handleChange("wholesale_price", parseFloat(e.target.value) || 0)
              }
              error={errors.wholesale_price}
              required
            />

            <Input
              label="Suggested Retail Price (SRP)"
              type="number"
              step="0.01"
              min="0"
              value={formData.suggested_retail_price ?? ""}
              onChange={(e) =>
                handleChange(
                  "suggested_retail_price",
                  e.target.value ? parseFloat(e.target.value) : null
                )
              }
            />

            <Input
              label="Cost (Your cost to produce)"
              type="number"
              step="0.01"
              min="0"
              value={formData.cost ?? ""}
              onChange={(e) =>
                handleChange(
                  "cost",
                  e.target.value ? parseFloat(e.target.value) : null
                )
              }
            />
          </CardContent>
        </Card>

        {/* Inventory */}
        <Card>
          <CardHeader>
            <CardTitle>Inventory</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Stock Quantity"
              type="number"
              min="0"
              value={formData.stock_quantity}
              onChange={(e) =>
                handleChange("stock_quantity", parseInt(e.target.value) || 0)
              }
            />

            <Input
              label="Low Stock Threshold"
              type="number"
              min="0"
              value={formData.low_stock_threshold}
              onChange={(e) =>
                handleChange(
                  "low_stock_threshold",
                  parseInt(e.target.value) || 10
                )
              }
              hint="Alert when stock falls below this number"
            />

            <Input
              label="Minimum Order Quantity"
              type="number"
              min="1"
              value={formData.minimum_order_quantity}
              onChange={(e) =>
                handleChange(
                  "minimum_order_quantity",
                  parseInt(e.target.value) || 1
                )
              }
            />

            <Input
              label="Weight (oz)"
              type="number"
              step="0.1"
              min="0"
              value={formData.weight_oz ?? ""}
              onChange={(e) =>
                handleChange(
                  "weight_oz",
                  e.target.value ? parseFloat(e.target.value) : null
                )
              }
              hint="For shipping calculations"
            />
          </CardContent>
        </Card>

        {/* Options */}
        <Card>
          <CardHeader>
            <CardTitle>Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => handleChange("is_active", e.target.checked)}
                className="checkbox checkbox-primary"
              />
              <div>
                <p className="font-medium">Active</p>
                <p className="text-sm text-base-content/60">
                  Product is visible and available for purchase
                </p>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.has_box}
                onChange={(e) => handleChange("has_box", e.target.checked)}
                className="checkbox checkbox-primary"
              />
              <div>
                <p className="font-medium">Box Set</p>
                <p className="text-sm text-base-content/60">
                  This product is a box set (sold in sets of 3)
                </p>
              </div>
            </label>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 mt-6">
        <Button variant="ghost" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="primary" type="submit" loading={loading}>
          {product ? "Update Product" : "Create Product"}
        </Button>
      </div>
    </form>
  );
}
