"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { findProducts, getProducts, findCategories } from "@/actions/products";
import type { Products } from "@/types/products";
import type { QueryProductsInput } from "@/actions/products/validators";
import { PAGINATION } from "@/lib/constants";

// ============================================================================
// Types
// ============================================================================

export interface ProductFilters {
  category?: string | null;
  isActive?: boolean;
  hasBox?: boolean;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface ProductSort {
  column: string;
  direction: "asc" | "desc";
}

export interface UseProductsOptions {
  initialFilters?: ProductFilters;
  initialSort?: ProductSort;
  limit?: number;
  autoFetch?: boolean;
}

export interface UseProductsReturn {
  products: Products[];
  loading: boolean;
  error: string | null;
  filters: ProductFilters;
  sort: ProductSort;
  hasMore: boolean;
  totalCount: number;

  // Actions
  setFilters: (filters: ProductFilters) => void;
  setSort: (sort: ProductSort) => void;
  clearFilters: () => void;
  refresh: () => Promise<void>;
  loadMore: () => Promise<void>;

  // Filter helpers
  setCategory: (category: string | null) => void;
  setSearch: (search: string) => void;
  toggleBoxOnly: () => void;
}

// ============================================================================
// Hook Implementation
// ============================================================================

export function useProducts(
  options: UseProductsOptions = {}
): UseProductsReturn {
  const {
    initialFilters = {},
    initialSort = { column: "name", direction: "asc" },
    limit = PAGINATION.productGridLimit,
    autoFetch = true,
  } = options;

  // State
  const [products, setProducts] = useState<Products[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFiltersState] = useState<ProductFilters>(initialFilters);
  const [sort, setSortState] = useState<ProductSort>(initialSort);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  // Build query from filters and sort
  const buildQuery = useCallback(
    (currentCursor?: string | null): Partial<QueryProductsInput> => {
      const query: Partial<QueryProductsInput> = {
        limit,
        order_by: sort.column as QueryProductsInput["order_by"],
        order: sort.direction,
      };

      if (filters.category) {
        query.category = filters.category;
      }

      if (filters.isActive !== undefined) {
        query.is_active = filters.isActive;
      }

      if (filters.hasBox !== undefined) {
        query.has_box = filters.hasBox;
      }

      if (filters.search) {
        query.name = filters.search;
      }

      if (currentCursor) {
        query.cursor = currentCursor;
      }

      return query;
    },
    [filters, sort, limit]
  );

  // Fetch products
  const fetchProducts = useCallback(
    async (append: boolean = false) => {
      setLoading(true);
      setError(null);

      try {
        const query = buildQuery(append ? cursor : null);
        const response = await findProducts(query);

        if (response.success && response.data) {
          if (append) {
            setProducts((prev) => [...prev, ...response.data!]);
          } else {
            setProducts(response.data);
          }

          // Handle pagination - check if we received fewer items than requested
          const receivedCount = response.data.length;
          setHasMore(receivedCount === limit);

          // Update cursor for next page (using last item's id)
          if (response.data.length > 0) {
            const lastItem = response.data[response.data.length - 1];
            setCursor(lastItem.id);
          }

          // Update total count estimate
          if (!append) {
            setTotalCount(response.data.length);
          } else {
            setTotalCount((prev) => prev + response.data!.length);
          }
        } else {
          setError(response.error || "Failed to fetch products");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    },
    [buildQuery, cursor, limit]
  );

  // Initial fetch
  useEffect(() => {
    if (autoFetch) {
      fetchProducts(false);
    }
  }, [filters, sort]); // eslint-disable-line react-hooks/exhaustive-deps

  // Actions
  const setFilters = useCallback((newFilters: ProductFilters) => {
    setFiltersState(newFilters);
    setCursor(null);
    setHasMore(true);
  }, []);

  const setSort = useCallback((newSort: ProductSort) => {
    setSortState(newSort);
    setCursor(null);
    setHasMore(true);
  }, []);

  const clearFilters = useCallback(() => {
    setFiltersState({});
    setCursor(null);
    setHasMore(true);
  }, []);

  const refresh = useCallback(async () => {
    setCursor(null);
    setHasMore(true);
    await fetchProducts(false);
  }, [fetchProducts]);

  const loadMore = useCallback(async () => {
    if (!loading && hasMore) {
      await fetchProducts(true);
    }
  }, [fetchProducts, loading, hasMore]);

  // Filter helpers
  const setCategory = useCallback(
    (category: string | null) => {
      setFilters({ ...filters, category });
    },
    [filters, setFilters]
  );

  const setSearch = useCallback(
    (search: string) => {
      setFilters({ ...filters, search: search || undefined });
    },
    [filters, setFilters]
  );

  const toggleBoxOnly = useCallback(() => {
    setFilters({
      ...filters,
      hasBox: filters.hasBox ? undefined : true,
    });
  }, [filters, setFilters]);

  return {
    products,
    loading,
    error,
    filters,
    sort,
    hasMore,
    totalCount,
    setFilters,
    setSort,
    clearFilters,
    refresh,
    loadMore,
    setCategory,
    setSearch,
    toggleBoxOnly,
  };
}

// ============================================================================
// Single Product Hook
// ============================================================================

export interface UseProductReturn {
  product: Products | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useProduct(productId: string | null): UseProductReturn {
  const [product, setProduct] = useState<Products | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = useCallback(async () => {
    if (!productId) {
      setProduct(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await getProducts(productId);

      if (response.success && response.data) {
        setProduct(response.data);
      } else {
        setError(response.error || "Product not found");
        setProduct(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setProduct(null);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  return {
    product,
    loading,
    error,
    refresh: fetchProduct,
  };
}

// ============================================================================
// Category Hook (for filter options)
// ============================================================================

export interface UseCategoriesReturn {
  categories: string[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useCategories(): UseCategoriesReturn {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await findCategories();

      if (response.success && response.data) {
        setCategories(response.data);
      } else {
        // Fall back to static categories if API fails
        setCategories([]);
        setError(response.error || "Failed to fetch categories");
      }
    } catch (err) {
      // Fall back to static categories on error
      setCategories([]);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    loading,
    error,
    refresh: fetchCategories,
  };
}

// ============================================================================
// Best Sellers Hook
// ============================================================================

export function useBestSellers(limit: number = 8) {
  const [products, setProducts] = useState<Products[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBestSellers = async () => {
      setLoading(true);
      try {
        // For now, just fetch top products by some criteria
        // In production, you'd have a dedicated endpoint or flag
        const response = await findProducts({
          limit,
          is_active: true,
          order_by: "created_at",
          order: "desc",
        });

        if (response.success && response.data) {
          setProducts(response.data);
        } else {
          setError(response.error || "Failed to fetch best sellers");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchBestSellers();
  }, [limit]);

  return { products, loading, error };
}

// ============================================================================
// New Arrivals Hook
// ============================================================================

export function useNewArrivals(limit: number = 8) {
  const [products, setProducts] = useState<Products[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      setLoading(true);
      try {
        const response = await findProducts({
          limit,
          is_active: true,
          order_by: "created_at",
          order: "desc",
        });

        if (response.success && response.data) {
          setProducts(response.data);
        } else {
          setError(response.error || "Failed to fetch new arrivals");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchNewArrivals();
  }, [limit]);

  return { products, loading, error };
}
