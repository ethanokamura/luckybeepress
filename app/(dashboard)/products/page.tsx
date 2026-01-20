"use client";

import { Suspense, useEffect, useState, useRef, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  getCountFromServer,
  QueryDocumentSnapshot,
  OrderByDirection,
} from "firebase/firestore";
import { collections } from "@/lib/firebase-helpers";
import { searchProducts, AlgoliaProductHit } from "@/lib/algolia";
import { AuthGuard } from "@/components/shared/AuthGuard";
import { ProductCard } from "@/components/shared/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowUpDown, Check, Filter, Search, X } from "lucide-react";
import type { Product } from "@/types";
import Image from "next/image";

const PRODUCTS_PER_PAGE = 16;

type SortOption = {
  label: string;
  field: string;
  direction: OrderByDirection;
};

const SORT_OPTIONS: SortOption[] = [
  { label: "Newest First", field: "sku", direction: "asc" },
  { label: "Oldest First", field: "sku", direction: "desc" },
  { label: "Name (A-Z)", field: "name", direction: "asc" },
  { label: "Name (Z-A)", field: "name", direction: "desc" },
  { label: "Most Popular", field: "salesCount", direction: "desc" },
];

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 sm:mb-8">
            <div className="h-8 w-32 bg-muted animate-pulse rounded" />
            <div className="h-4 w-64 bg-muted animate-pulse rounded mt-2" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
            {[...Array(PRODUCTS_PER_PAGE)].map((_, i) => (
              <div
                key={i}
                className="aspect-square bg-muted animate-pulse rounded-lg"
              />
            ))}
          </div>
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialCategory = searchParams.get("category") || "All";
  const initialPage = parseInt(searchParams.get("page") || "1", 10);
  const initialSort = searchParams.get("sort") || "createdAt-desc";
  const initialSearch = searchParams.get("q") || "";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalProducts, setTotalProducts] = useState(0);
  const [sortBy, setSortBy] = useState(initialSort);

  // Search state
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [searchResults, setSearchResults] = useState<AlgoliaProductHit[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchTotal, setSearchTotal] = useState(0);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Use ref for cursor cache to avoid re-render loops
  const lastDocsRef = useRef<Map<number, QueryDocumentSnapshot<Product>>>(
    new Map()
  );

  const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);
  const isSearchMode = searchQuery.trim().length > 0;

  // Fetch distinct categories from products collection (once on mount)
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const q = query(collections.products, where("status", "==", "active"));
        const snapshot = await getDocs(q);
        const categorySet = new Set<string>();
        snapshot.docs.forEach((doc) => {
          const category = doc.data().category;
          if (category) {
            categorySet.add(category);
          }
        });
        const sortedCategories = Array.from(categorySet).sort((a, b) =>
          a.localeCompare(b)
        );
        setCategories(["All", ...sortedCategories]);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Debounced search function
  const performSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setSearchTotal(0);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    try {
      const result = await searchProducts(query, {
        hitsPerPage: PRODUCTS_PER_PAGE,
        // Note: To use filters like 'status:active', configure 'status' as
        // attributesForFaceting in Algolia index settings
      });
      // Filter to only show active products client-side
      const activeHits = result.hits.filter(
        (hit) => hit.status === "active" || !hit.status
      );
      setSearchResults(activeHits);
      setSearchTotal(activeHits.length);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
      setSearchTotal(0);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Handle search input with debounce
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (searchQuery.trim()) {
      setIsSearching(true);
      searchTimeoutRef.current = setTimeout(() => {
        performSearch(searchQuery);
      }, 300);
    } else {
      setSearchResults([]);
      setSearchTotal(0);
      setIsSearching(false);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery, performSearch]);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    if (value.trim()) {
      setCurrentPage(1);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setSearchTotal(0);
  };

  const getCurrentSort = (): SortOption => {
    const [field, direction] = sortBy.split("-");
    return (
      SORT_OPTIONS.find(
        (opt) => opt.field === field && opt.direction === direction
      ) || SORT_OPTIONS[0]
    );
  };

  // Fetch products when category, page, or sort changes
  useEffect(() => {
    let isCancelled = false;

    const fetchData = async () => {
      setLoading(true);

      try {
        const [field, direction] = sortBy.split("-");
        const currentSort: SortOption =
          SORT_OPTIONS.find(
            (opt) => opt.field === field && opt.direction === direction
          ) || SORT_OPTIONS[0];
        // Fetch total count
        let countQuery;
        if (selectedCategory === "All") {
          countQuery = query(
            collections.products,
            where("status", "==", "active")
          );
        } else {
          countQuery = query(
            collections.products,
            where("status", "==", "active"),
            where("category", "==", selectedCategory)
          );
        }
        const countSnapshot = await getCountFromServer(countQuery);
        if (isCancelled) return;
        setTotalProducts(countSnapshot.data().count);

        // Build base query constraints
        const baseConstraints = [
          where("status", "==", "active"),
          ...(selectedCategory !== "All"
            ? [where("category", "==", selectedCategory)]
            : []),
          orderBy(currentSort.field, currentSort.direction),
          limit(PRODUCTS_PER_PAGE),
        ];

        let q;

        // If we're on page 1, simple query
        if (currentPage === 1) {
          q = query(collections.products, ...baseConstraints);
        }
        // If we have a cursor for the previous page, use it
        else if (lastDocsRef.current.has(currentPage - 1)) {
          const lastDoc = lastDocsRef.current.get(currentPage - 1)!;
          q = query(
            collections.products,
            ...baseConstraints,
            startAfter(lastDoc)
          );
        }
        // Otherwise, paginate from the start to build cursors
        else {
          let currentQuery = query(collections.products, ...baseConstraints);

          for (let i = 1; i < currentPage; i++) {
            const snapshot = await getDocs(currentQuery);
            if (isCancelled) return;
            if (snapshot.docs.length === 0) break;
            const lastVisible = snapshot.docs[snapshot.docs.length - 1];
            lastDocsRef.current.set(i, lastVisible);
            currentQuery = query(
              collections.products,
              ...baseConstraints,
              startAfter(lastVisible)
            );
          }
          q = currentQuery;
        }

        const snapshot = await getDocs(q);
        if (isCancelled) return;

        setProducts(snapshot.docs.map((doc) => doc.data()));

        // Store cursor for this page
        if (snapshot.docs.length > 0) {
          const lastVisible = snapshot.docs[snapshot.docs.length - 1];
          lastDocsRef.current.set(currentPage, lastVisible);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isCancelled = true;
    };
  }, [selectedCategory, currentPage, sortBy]);

  // Update URL when category, page, sort, or search changes
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery.trim()) {
      params.set("q", searchQuery.trim());
    }
    if (selectedCategory !== "All") {
      params.set("category", selectedCategory);
    }
    if (currentPage > 1) {
      params.set("page", currentPage.toString());
    }
    if (sortBy !== "createdAt-desc") {
      params.set("sort", sortBy);
    }
    const newUrl = params.toString() ? `?${params.toString()}` : "";
    router.replace(`/products${newUrl}`, { scroll: false });
  }, [selectedCategory, currentPage, sortBy, searchQuery, router]);

  const handleCategoryChange = (category: string) => {
    if (category !== selectedCategory) {
      lastDocsRef.current = new Map();
      setSelectedCategory(category);
      setCurrentPage(1);
    }
  };

  const handleSortChange = (newSort: string) => {
    if (newSort !== sortBy) {
      lastDocsRef.current = new Map();
      setSortBy(newSort);
      setCurrentPage(1);
    }
  };

  const handlePageChange = (page: number) => {
    if (page !== currentPage) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <AuthGuard requireAuth requireApproval>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Products
          </h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            Browse our collection of artisan letterpress cards
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by name, SKU, or category..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10 pr-10"
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex gap-2 mb-4 w-fit">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="card"
                size="sm"
                className="flex-1 w-48 text-base"
              >
                {selectedCategory}
                <Filter className="w-4 h-4 mr-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {categories.map((category) => {
                return (
                  <DropdownMenuItem
                    key={category}
                    onClick={() => handleCategoryChange(category)}
                    className="flex items-center justify-between"
                  >
                    {category}
                    {selectedCategory === category && (
                      <Check className="w-4 h-4" />
                    )}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="card"
                size="sm"
                className="flex-1 w-48 text-base"
              >
                {getCurrentSort().label}
                <ArrowUpDown className="w-4 h-4 mr-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {SORT_OPTIONS.map((option) => {
                const optionKey = `${option.field}-${option.direction}`;
                return (
                  <DropdownMenuItem
                    key={optionKey}
                    onClick={() => handleSortChange(optionKey)}
                    className="flex items-center justify-between"
                  >
                    {option.label}
                    {sortBy === optionKey && <Check className="w-4 h-4" />}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Results count */}
        <div className="mb-4 text-sm text-muted-foreground">
          {loading || isSearching ? (
            <span className="inline-block h-4 w-24 bg-muted animate-pulse rounded" />
          ) : isSearchMode ? (
            <span>
              {searchTotal} search results for &quot;{searchQuery}&quot;
            </span>
          ) : (
            <span>{totalProducts} products</span>
          )}
        </div>

        {/* Products Grid */}
        {loading || isSearching ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
            {[...Array(PRODUCTS_PER_PAGE)].map((_, i) => (
              <div
                key={i}
                className="aspect-square bg-muted animate-pulse rounded-lg"
              />
            ))}
          </div>
        ) : isSearchMode && searchResults.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-4">
              {searchResults.map((hit) => (
                <ProductCard
                  key={hit.objectID}
                  product={{
                    id: hit.objectID,
                    name: hit.name,
                    slug: hit.slug,
                    wholesalePrice: hit.wholesalePrice ?? 0,
                    retailPrice: hit.retailPrice ?? 0,
                    hasBoxOption: hit.hasBoxOption ?? false,
                    boxWholesalePrice: hit.boxWholesalePrice ?? null,
                    images: hit.images ?? [],
                    category: hit.category,
                    inventory: hit.inventory ?? 0,
                    status:
                      (hit.status as "active" | "draft" | "archived") ??
                      "active",
                  }}
                />
              ))}
            </div>
          </>
        ) : isSearchMode && searchResults.length === 0 ? (
          <div className="text-center py-16">
            <Search className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <p className="text-muted-foreground">
              No products found for &quot;{searchQuery}&quot;
            </p>
            <Button variant="link" onClick={clearSearch} className="mt-2">
              Clear search
            </Button>
          </div>
        ) : products.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination - only show when not in search mode */}
            {!isSearchMode && totalPages > 1 && (
              <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <span className="sm:hidden">←</span>
                    <span className="hidden sm:inline">Previous</span>
                  </Button>

                  <div className="flex items-center gap-1">
                    {/* First page */}
                    {currentPage > 3 && (
                      <>
                        <Button
                          variant={currentPage === 1 ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(1)}
                          className="w-10"
                        >
                          1
                        </Button>
                        {currentPage > 4 && (
                          <span className="px-2 text-muted-foreground">
                            ...
                          </span>
                        )}
                      </>
                    )}

                    {/* Page numbers around current */}
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter(
                        (page) =>
                          page >= currentPage - 2 &&
                          page <= currentPage + 2 &&
                          page >= 1 &&
                          page <= totalPages
                      )
                      .map((page) => (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(page)}
                          className="w-10"
                        >
                          {page}
                        </Button>
                      ))}

                    {/* Last page */}
                    {currentPage < totalPages - 2 && (
                      <>
                        {currentPage < totalPages - 3 && (
                          <span className="px-2 text-muted-foreground">
                            ...
                          </span>
                        )}
                        <Button
                          variant={
                            currentPage === totalPages ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => handlePageChange(totalPages)}
                          className="w-10"
                        >
                          {totalPages}
                        </Button>
                      </>
                    )}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <span className="sm:hidden">→</span>
                    <span className="hidden sm:inline">Next</span>
                  </Button>
                </div>

                <span className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </span>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <Image
              src="/logo.svg"
              alt="Lucky Bee Press"
              width={64}
              height={64}
              className="mx-auto mb-4"
            />
            <p className="text-muted-foreground">
              No products found in this category.
            </p>
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
