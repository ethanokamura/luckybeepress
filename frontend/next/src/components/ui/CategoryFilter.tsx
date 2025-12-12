"use client";

import { X } from "lucide-react";
import { useCategories } from "@/hooks/useProducts";

interface CategoryFilterProps {
  selectedCategory: string | null;
  onSelect: (category: string | null) => void;
  categories?: readonly string[];
  showAll?: boolean;
  variant?: "chips" | "buttons" | "list";
  className?: string;
}

export function CategoryFilter({
  selectedCategory,
  onSelect,
  categories: categoriesProp,
  showAll = true,
  variant = "chips",
  className = "",
}: CategoryFilterProps) {
  const { categories: fetchedCategories } = useCategories();
  const categories = categoriesProp ?? fetchedCategories;
  if (variant === "list") {
    return (
      <div className={`space-y-1 ${className}`}>
        {showAll && (
          <button
            onClick={() => onSelect(null)}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
              selectedCategory === null
                ? "bg-primary text-primary-content font-medium"
                : "hover:bg-base-200"
            }`}
          >
            All Categories
          </button>
        )}
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onSelect(category)}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
              selectedCategory === category
                ? "bg-primary text-primary-content font-medium"
                : "hover:bg-base-200"
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    );
  }

  if (variant === "buttons") {
    return (
      <div className={`flex flex-wrap gap-2 ${className}`}>
        {showAll && (
          <button
            onClick={() => onSelect(null)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedCategory === null
                ? "bg-primary text-primary-content shadow-md"
                : "bg-base-200 hover:bg-base-300"
            }`}
          >
            All
          </button>
        )}
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onSelect(category)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedCategory === category
                ? "bg-primary text-primary-content shadow-md"
                : "bg-base-200 hover:bg-base-300"
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    );
  }

  // Default: chips variant
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {showAll && (
        <button
          onClick={() => onSelect(null)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all ${
            selectedCategory === null
              ? "bg-primary text-primary-content"
              : "bg-base-200 hover:bg-base-300"
          }`}
        >
          All
        </button>
      )}
      {categories.map((category) => (
        <button
          key={category}
          onClick={() =>
            onSelect(selectedCategory === category ? null : category)
          }
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all ${
            selectedCategory === category
              ? "bg-primary text-primary-content"
              : "bg-base-200 hover:bg-base-300"
          }`}
        >
          {category}
          {selectedCategory === category && <X className="h-3 w-3" />}
        </button>
      ))}
    </div>
  );
}

// Multi-select category filter
interface MultiCategoryFilterProps {
  selectedCategories: string[];
  onToggle: (category: string) => void;
  onClear: () => void;
  categories?: readonly string[];
  className?: string;
}

export function MultiCategoryFilter({
  selectedCategories,
  onToggle,
  onClear,
  categories: categoriesProp,
  className = "",
}: MultiCategoryFilterProps) {
  const { categories: fetchedCategories } = useCategories();
  const categories = categoriesProp ?? fetchedCategories;
  return (
    <div className={`space-y-3 ${className}`}>
      {selectedCategories.length > 0 && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-base-content/70">
            {selectedCategories.length} selected
          </span>
          <button
            onClick={onClear}
            className="text-sm text-primary hover:underline"
          >
            Clear all
          </button>
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => {
          const isSelected = selectedCategories.includes(category);
          return (
            <button
              key={category}
              onClick={() => onToggle(category)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all border ${
                isSelected
                  ? "bg-primary text-primary-content border-primary"
                  : "bg-transparent border-base-300 hover:border-primary hover:text-primary"
              }`}
            >
              {category}
              {isSelected && <X className="h-3 w-3" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Selected category badge/pill (for showing active filter)
interface SelectedCategoryBadgeProps {
  category: string;
  onRemove: () => void;
  className?: string;
}

export function SelectedCategoryBadge({
  category,
  onRemove,
  className = "",
}: SelectedCategoryBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm bg-primary/10 text-primary ${className}`}
    >
      {category}
      <button
        onClick={onRemove}
        className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
        aria-label={`Remove ${category} filter`}
      >
        <X className="h-3 w-3" />
      </button>
    </span>
  );
}
