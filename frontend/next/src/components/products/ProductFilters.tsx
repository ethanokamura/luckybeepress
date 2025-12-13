"use client";

import { useState } from "react";
import { Filter, X, ChevronDown } from "lucide-react";
import { CategoryFilter } from "@/components/ui/CategoryFilter";
import { SortDropdown, ViewModeToggle } from "@/components/ui/SortDropdown";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PRODUCT_SORT_OPTIONS } from "@/lib/constants";
import type {
  ProductFilters as ProductFiltersType,
  ProductSort,
} from "@/hooks/useProducts";

interface ProductFiltersProps {
  filters: ProductFiltersType;
  sort: ProductSort;
  onFiltersChange: (filters: ProductFiltersType) => void;
  onSortChange: (sort: ProductSort) => void;
  onClear: () => void;
  totalResults: number;
  className?: string;
}

export function ProductFilters({
  filters,
  sort,
  onFiltersChange,
  onSortChange,
  onClear,
  totalResults,
  className = "",
}: ProductFiltersProps) {
  const activeFilterCount = Object.values(filters).filter(Boolean).length;
  const sortValue = `${sort.column}:${sort.direction}`;

  const handleSortChange = (value: string) => {
    const [column, direction] = value.split(":") as [string, "asc" | "desc"];
    onSortChange({ column, direction });
  };

  const handleCategoryChange = (category: string | null) => {
    onFiltersChange({ ...filters, category });
  };

  const handleBoxFilterChange = () => {
    onFiltersChange({
      ...filters,
      hasBox: filters.hasBox ? undefined : true,
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({
      ...filters,
      search: e.target.value || undefined,
    });
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Top bar with search and sort */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 max-w-md w-full">
          <Input
            placeholder="Search products..."
            value={filters.search || ""}
            onChange={handleSearchChange}
            className="w-full"
          />
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-base-content/60">
            {totalResults} products
          </span>
          <SortDropdown
            options={PRODUCT_SORT_OPTIONS}
            value={sortValue}
            onChange={handleSortChange}
          />
        </div>
      </div>

      {/* Filter chips */}
      <div className="flex flex-wrap items-center gap-3">
        <CategoryFilter
          selectedCategory={filters.category || null}
          onSelect={handleCategoryChange}
          variant="chips"
        />

        <button
          onClick={handleBoxFilterChange}
          className={`px-3 py-1.5 rounded-full text-sm transition-all border ${
            filters.hasBox
              ? "bg-secondary text-secondary-content border-secondary"
              : "bg-transparent border-base-300 hover:border-secondary hover:text-secondary"
          }`}
        >
          Box Sets Only
        </button>

        {activeFilterCount > 0 && (
          <button
            onClick={onClear}
            className="px-3 py-1.5 rounded-full text-sm text-error hover:bg-error/10 transition-colors flex items-center gap-1"
          >
            <X className="h-3 w-3" />
            Clear all
          </button>
        )}
      </div>
    </div>
  );
}

// Sidebar filter variant for desktop
interface ProductFiltersSidebarProps {
  filters: ProductFiltersType;
  onFiltersChange: (filters: ProductFiltersType) => void;
  onClear: () => void;
  className?: string;
}

export function ProductFiltersSidebar({
  filters,
  onFiltersChange,
  onClear,
  className = "",
}: ProductFiltersSidebarProps) {
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    type: true,
    price: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="font-semibold flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filters
          {activeFilterCount > 0 && (
            <span className="px-2 py-0.5 text-xs rounded-full bg-primary text-primary-content">
              {activeFilterCount}
            </span>
          )}
        </h3>
        {activeFilterCount > 0 && (
          <button
            onClick={onClear}
            className="text-sm text-primary hover:underline"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Category section */}
      <div className="border-b border-base-300 pb-4">
        <button
          onClick={() => toggleSection("category")}
          className="flex items-center justify-between w-full py-2 font-medium"
        >
          Category
          <ChevronDown
            className={`h-4 w-4 transition-transform ${
              expandedSections.category ? "rotate-180" : ""
            }`}
          />
        </button>
        {expandedSections.category && (
          <CategoryFilter
            selectedCategory={filters.category || null}
            onSelect={(category) => onFiltersChange({ ...filters, category })}
            variant="list"
            className="mt-2"
          />
        )}
      </div>

      {/* Product type section */}
      <div className="border-b border-base-300 pb-4">
        <button
          onClick={() => toggleSection("type")}
          className="flex items-center justify-between w-full py-2 font-medium"
        >
          Product Type
          <ChevronDown
            className={`h-4 w-4 transition-transform ${
              expandedSections.type ? "rotate-180" : ""
            }`}
          />
        </button>
        {expandedSections.type && (
          <div className="mt-2 space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={!filters.hasBox}
                onChange={() =>
                  onFiltersChange({ ...filters, hasBox: undefined })
                }
                className="checkbox checkbox-sm checkbox-primary"
              />
              <span className="text-sm">All Products</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.hasBox === true}
                onChange={() =>
                  onFiltersChange({
                    ...filters,
                    hasBox: filters.hasBox ? undefined : true,
                  })
                }
                className="checkbox checkbox-sm checkbox-primary"
              />
              <span className="text-sm">Box Sets Only</span>
            </label>
          </div>
        )}
      </div>

      {/* Stock status */}
      <div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.isActive !== false}
            onChange={() =>
              onFiltersChange({
                ...filters,
                isActive: filters.isActive === false ? undefined : false,
              })
            }
            className="checkbox checkbox-sm checkbox-primary"
          />
          <span className="text-sm">In Stock Only</span>
        </label>
      </div>
    </div>
  );
}

// Mobile filter drawer
interface MobileFiltersDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: ProductFiltersType;
  onFiltersChange: (filters: ProductFiltersType) => void;
  onClear: () => void;
}

export function MobileFiltersDrawer({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  onClear,
}: MobileFiltersDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Drawer */}
      <div className="absolute inset-y-0 right-0 w-full max-w-sm bg-base-100 shadow-xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-base-300">
            <h2 className="text-lg font-semibold">Filters</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-base-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            <ProductFiltersSidebar
              filters={filters}
              onFiltersChange={onFiltersChange}
              onClear={onClear}
            />
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-base-300">
            <Button variant="primary" fullWidth onClick={onClose}>
              Show Results
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
