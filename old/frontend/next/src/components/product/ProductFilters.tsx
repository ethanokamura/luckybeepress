"use client";

import { Select } from "@/components/ui";
import { getCategories } from "@/lib/mock-data";

interface ProductFiltersProps {
  selectedCategory: string;
  sortBy: string;
  onCategoryChange: (category: string) => void;
  onSortChange: (sortBy: string) => void;
}

export function ProductFilters({
  selectedCategory,
  sortBy,
  onCategoryChange,
  onSortChange,
}: ProductFiltersProps) {
  const categories = getCategories();

  const categoryOptions = [
    { value: "all", label: "All Categories" },
    ...categories.map((cat) => ({ value: cat, label: cat })),
  ];

  const sortOptions = [
    { value: "name-asc", label: "Name (A-Z)" },
    { value: "name-desc", label: "Name (Z-A)" },
    { value: "price-asc", label: "Price (Low to High)" },
    { value: "price-desc", label: "Price (High to Low)" },
    { value: "newest", label: "Newest First" },
    { value: "popular", label: "Most Popular" },
  ];

  return (
    <div className="bg-base-100 rounded-lg border border-base-300 p-4 mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          label="Category"
          options={categoryOptions}
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
        />

        <Select
          label="Sort By"
          options={sortOptions}
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
        />
      </div>
    </div>
  );
}
