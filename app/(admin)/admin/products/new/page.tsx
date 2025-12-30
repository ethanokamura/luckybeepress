"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { generateSlug, toCents } from "@/lib/firebase-helpers";
import { Button } from "@/components/ui/button";
import { BOX_SET_CATEGORIES, WHOLESALE_PRICING } from "@/types/products";
import type { Product, ProductStatus } from "@/types";

const categories = [
  "Birthday",
  "Thank You",
  "Holiday",
  "Christmas",
  "Hanukkah",
  "Season's Greetings",
  "New Year's",
  "Valentine's Day",
  "Love",
  "Sympathy",
  "Congratulations",
  "Baby",
  "Wedding",
  "Graduation",
  "Mother's Day",
  "Father's Day",
  "Rosh Hashanah",
  "Easter",
  "Everyday",
  "Blank",
  "Other",
];

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    shortDescription: "",
    category: "Birthday",
    sku: "",
    wholesalePrice: "3.00",
    retailPrice: "6.00",
    costPerItem: "1.50",
    hasBoxOption: false,
    boxWholesalePrice: "11.00",
    boxRetailPrice: "22.00",
    inventory: "100",
    lowStockThreshold: "50",
    minimumOrderQuantity: "6",
    weightOz: "",
    status: "draft" as ProductStatus,
    featured: false,
    tags: "",
    images: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    });
  };

  // Check if current category supports box sets
  const canHaveBoxSet = (BOX_SET_CATEGORIES as readonly string[]).includes(
    formData.category
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productId = `prod-${Date.now()}`;
      const slug = generateSlug(formData.name);
      const hasBoxOption = formData.hasBoxOption && canHaveBoxSet;

      const productData: Omit<Product, "id"> = {
        name: formData.name,
        slug,
        description: formData.description,
        shortDescription: formData.shortDescription || null,
        images: formData.images
          ? formData.images.split(",").map((url) => url.trim())
          : [],
        category: formData.category,
        tags: formData.tags
          ? formData.tags.split(",").map((tag) => tag.trim())
          : [],
        status: formData.status,
        featured: formData.featured,

        // Wholesale pricing
        wholesalePrice: toCents(parseFloat(formData.wholesalePrice) || 3),
        retailPrice: toCents(parseFloat(formData.retailPrice) || 6),
        costPerItem: formData.costPerItem
          ? toCents(parseFloat(formData.costPerItem))
          : null,

        // Box option
        hasBoxOption,
        boxWholesalePrice: hasBoxOption
          ? toCents(parseFloat(formData.boxWholesalePrice) || 11)
          : null,
        boxRetailPrice: hasBoxOption
          ? toCents(parseFloat(formData.boxRetailPrice) || 22)
          : null,

        // Inventory
        sku: formData.sku,
        inventory: parseInt(formData.inventory) || 0,
        lowStockThreshold: parseInt(formData.lowStockThreshold) || 50,
        trackInventory: true,

        // Ordering
        minimumOrderQuantity:
          parseInt(formData.minimumOrderQuantity) ||
          WHOLESALE_PRICING.SINGLE_MIN_QTY,

        // Physical
        weightOz: formData.weightOz ? parseFloat(formData.weightOz) : null,

        // SEO
        metaTitle: null,
        metaDescription: null,

        // Stats
        salesCount: 0,
        viewCount: 0,

        // Legacy
        legacyId: null,

        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      await setDoc(doc(db, "products", productId), productData);
      router.push("/admin/products");
    } catch (error) {
      console.error("Error creating product:", error);
      alert("Error creating product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="text-sm text-muted-foreground hover:text-foreground mb-2"
        >
          ← Back to Products
        </button>
        <h1 className="text-3xl font-bold">Add New Product</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-card border rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-bold">Basic Information</h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-md border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Birthday Bee Card"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">SKU *</label>
              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-md border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="LBP-BDAY-001"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-md border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-4 py-2 rounded-md border bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              placeholder="A charming letterpress birthday card featuring..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Short Description
            </label>
            <input
              type="text"
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="A bee-utiful birthday card"
            />
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-card border rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-bold">Wholesale Pricing</h2>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Wholesale Price *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  $
                </span>
                <input
                  type="number"
                  name="wholesalePrice"
                  value={formData.wholesalePrice}
                  onChange={handleChange}
                  required
                  step="0.01"
                  min="0"
                  className="w-full pl-7 pr-4 py-2 rounded-md border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">Per card</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Retail Price (SRP)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  $
                </span>
                <input
                  type="number"
                  name="retailPrice"
                  value={formData.retailPrice}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className="w-full pl-7 pr-4 py-2 rounded-md border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Cost Per Item
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  $
                </span>
                <input
                  type="number"
                  name="costPerItem"
                  value={formData.costPerItem}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className="w-full pl-7 pr-4 py-2 rounded-md border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          {/* Box Set Option */}
          {canHaveBoxSet && (
            <div className="border-t pt-4 mt-4">
              <div className="flex items-center gap-2 mb-4">
                <input
                  type="checkbox"
                  name="hasBoxOption"
                  id="hasBoxOption"
                  checked={formData.hasBoxOption}
                  onChange={handleChange}
                  className="rounded"
                />
                <label htmlFor="hasBoxOption" className="text-sm font-medium">
                  Available as Box Set (6 cards per box)
                </label>
              </div>

              {formData.hasBoxOption && (
                <div className="grid grid-cols-2 gap-4 pl-6">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Box Wholesale Price
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        $
                      </span>
                      <input
                        type="number"
                        name="boxWholesalePrice"
                        value={formData.boxWholesalePrice}
                        onChange={handleChange}
                        step="0.01"
                        min="0"
                        className="w-full pl-7 pr-4 py-2 rounded-md border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Box Retail Price
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        $
                      </span>
                      <input
                        type="number"
                        name="boxRetailPrice"
                        value={formData.boxRetailPrice}
                        onChange={handleChange}
                        step="0.01"
                        min="0"
                        className="w-full pl-7 pr-4 py-2 rounded-md border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Inventory */}
        <div className="bg-card border rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-bold">Inventory</h2>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Stock Quantity
              </label>
              <input
                type="number"
                name="inventory"
                value={formData.inventory}
                onChange={handleChange}
                min="0"
                className="w-full px-4 py-2 rounded-md border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Low Stock Threshold
              </label>
              <input
                type="number"
                name="lowStockThreshold"
                value={formData.lowStockThreshold}
                onChange={handleChange}
                min="0"
                className="w-full px-4 py-2 rounded-md border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Min Order Qty
              </label>
              <input
                type="number"
                name="minimumOrderQuantity"
                value={formData.minimumOrderQuantity}
                onChange={handleChange}
                min="1"
                className="w-full px-4 py-2 rounded-md border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Weight (oz)
              </label>
              <input
                type="number"
                name="weightOz"
                value={formData.weightOz}
                onChange={handleChange}
                step="0.01"
                min="0"
                className="w-full px-4 py-2 rounded-md border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="1.0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-md border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
        </div>

        {/* Images & Tags */}
        <div className="bg-card border rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-bold">Images & Tags</h2>

          <div>
            <label className="block text-sm font-medium mb-1">
              Image URLs (comma-separated)
            </label>
            <input
              type="text"
              name="images"
              value={formData.images}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Enter image URLs separated by commas
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="birthday, bee, letterpress, colorful"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="featured"
              id="featured"
              checked={formData.featured}
              onChange={handleChange}
              className="rounded"
            />
            <label htmlFor="featured" className="text-sm font-medium">
              Featured Product
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Product"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
