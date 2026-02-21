"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
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
import { collections, formatPrice } from "@/lib/firebase-helpers";
import { DEFAULT_CATEGORIES } from "@/hooks/useCategories";
import { searchProducts, AlgoliaProductHit } from "@/lib/algolia";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSearchParams, useRouter } from "next/navigation";
import { AuthGuard } from "@/components/shared/AuthGuard";
import { ArrowUpDown, Check, Filter, Search, Star, X } from "lucide-react";
import type { Product } from "@/types";

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

export default function AdminProductsPage() {
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

  const [featuredCount, setFeaturedCount] = useState(0);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  // Bulk selection state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [selectAllMode, setSelectAllMode] = useState(false);
  const [allCategoryTotal, setAllCategoryTotal] = useState(0);
  const [isFetchingAllIds, setIsFetchingAllIds] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  type BulkAction = "status" | "category" | "delete";
  const [bulkAction, setBulkAction] = useState<BulkAction | null>(null);
  const [bulkStatusValue, setBulkStatusValue] = useState<"draft" | "active" | "archived">("active");
  const [bulkCategoryValue, setBulkCategoryValue] = useState("");
  const [bulkConfirmOpen, setBulkConfirmOpen] = useState(false);
  const [bulkProgress, setBulkProgress] = useState<{
    running: boolean; done: boolean; error: string | null;
  }>({ running: false, done: false, error: null });

  const MAX_FEATURED = 12;

  // Use ref for cursor cache to avoid re-render loops
  const lastDocsRef = useRef<Map<number, QueryDocumentSnapshot<Product>>>(
    new Map()
  );

  const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);
  const isSearchMode = searchQuery.trim().length > 0;

  // Fetch categories in display order from categories collection
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const snap = await getDocs(
          query(collections.categories, orderBy("order", "asc"))
        );
        if (!snap.empty) {
          setCategories(["All", ...snap.docs.map((d) => d.data().name as string)]);
        } else {
          // Fallback: scan active products
          const pSnap = await getDocs(
            query(collections.products, where("status", "==", "active"))
          );
          const categorySet = new Set<string>();
          pSnap.docs.forEach((d) => {
            const category = d.data().category;
            if (category) categorySet.add(category);
          });
          if (categorySet.size > 0) {
            setCategories(["All", ...Array.from(categorySet).sort((a, b) => a.localeCompare(b))]);
          } else {
            setCategories(["All", ...DEFAULT_CATEGORIES.map((c) => c.name)]);
          }
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Fetch featured count on mount
  useEffect(() => {
    const fetchFeaturedCount = async () => {
      try {
        const snap = await getCountFromServer(
          query(collections.products, where("featured", "==", true))
        );
        setFeaturedCount(snap.data().count);
      } catch (error) {
        console.error("Error fetching featured count:", error);
      }
    };
    fetchFeaturedCount();
  }, []);

  const handleToggleFeatured = async (productId: string, currentlyFeatured: boolean) => {
    const newFeatured = !currentlyFeatured;

    if (newFeatured && featuredCount >= MAX_FEATURED) {
      alert(`You can only feature up to ${MAX_FEATURED} products. Unpin one first.`);
      return;
    }

    setTogglingId(productId);

    // Optimistic update
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, featured: newFeatured } : p))
    );
    setSearchResults((prev) =>
      prev.map((h) => (h.objectID === productId ? { ...h, featured: newFeatured } : h))
    );
    setFeaturedCount((prev) => (newFeatured ? prev + 1 : prev - 1));

    try {
      const res = await fetch(`/api/admin/products/${productId}/feature`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: newFeatured }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update");
      }
    } catch (error) {
      // Revert on error
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, featured: currentlyFeatured } : p))
      );
      setSearchResults((prev) =>
        prev.map((h) => (h.objectID === productId ? { ...h, featured: currentlyFeatured } : h))
      );
      setFeaturedCount((prev) => (newFeatured ? prev - 1 : prev + 1));
      alert(error instanceof Error ? error.message : "Failed to update featured status.");
    } finally {
      setTogglingId(null);
    }
  };

  // Debounced search function (admin can search all products, not just active)
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
        // Admin can see all products, not filtered by status
      });
      setSearchResults(result.hits);
      setSearchTotal(result.nbHits);
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

  // Bulk selection helpers
  const visibleIds = isSearchMode
    ? searchResults.map((h) => h.objectID)
    : products.map((p) => p.id);

  const allVisibleSelected =
    visibleIds.length > 0 && visibleIds.every((id) => selectedIds.has(id));

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
    setSelectAllMode(false);
  };

  const toggleSelectAll = () => {
    if (allVisibleSelected) {
      setSelectedIds(new Set());
      setSelectAllMode(false);
    } else {
      setSelectedIds(new Set(visibleIds));
    }
  };

  const handleSelectAllInCategory = async () => {
    setIsFetchingAllIds(true);
    try {
      const q = selectedCategory === "All"
        ? query(collections.products)
        : query(collections.products, where("category", "==", selectedCategory));
      const snap = await getDocs(q);
      const ids = snap.docs.map((d) => d.id);
      setAllCategoryTotal(ids.length);
      setSelectedIds(new Set(ids));
      setSelectAllMode(true);
    } finally {
      setIsFetchingAllIds(false);
    }
  };

  const clearSelection = () => {
    setSelectedIds(new Set());
    setSelectAllMode(false);
    setAllCategoryTotal(0);
    setBulkAction(null);
  };

  const executeBulkAction = async () => {
    if (!bulkAction || selectedIds.size === 0) return;
    setBulkProgress({ running: true, done: false, error: null });
    try {
      const body: Record<string, unknown> = {
        action: bulkAction,
        productIds: Array.from(selectedIds),
      };
      if (bulkAction === "status") body.status = bulkStatusValue;
      if (bulkAction === "category") body.category = bulkCategoryValue;

      const res = await fetch("/api/admin/products/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Bulk operation failed");
      }
      setBulkProgress({ running: false, done: true, error: null });
      setTimeout(() => {
        clearSelection();
        setBulkConfirmOpen(false);
        setBulkProgress({ running: false, done: false, error: null });
        setRefreshKey((k) => k + 1);
      }, 1500);
    } catch (err) {
      setBulkProgress({
        running: false, done: false,
        error: err instanceof Error ? err.message : "Unknown error",
      });
    }
  };

  // Fetch products when category, page, sort, or refreshKey changes
  useEffect(() => {
    let isCancelled = false;

    const fetchData = async () => {
      setLoading(true);
      setSelectedIds(new Set());

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
  }, [selectedCategory, currentPage, sortBy, refreshKey]);

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
    router.replace(`/admin/products${newUrl}`, { scroll: false });
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
    <AuthGuard requireAuth requireAdmin>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Products</h1>
          <Link href="/admin/products/new">
            <Button>+ Add Product</Button>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md">
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

        {/* Results count + featured count */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          {loading || isSearching ? (
            <span className="inline-block h-4 w-24 bg-muted animate-pulse rounded" />
          ) : isSearchMode ? (
            <span>
              {searchTotal} search results for &quot;{searchQuery}&quot;
            </span>
          ) : (
            <span>{totalProducts} products</span>
          )}
          <span className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5" fill="currentColor" style={{ color: "#f59e0b" }} />
            {featuredCount} / {MAX_FEATURED} featured
          </span>
        </div>

        {/* Bulk action toolbar */}
        {selectedIds.size > 0 && (
          <div className="flex items-center gap-3 px-4 py-3 bg-card border rounded-lg">
            <span className="text-sm font-medium">
              {selectedIds.size} selected
              {selectAllMode && (
                <span className="text-xs text-muted-foreground ml-1">
                  (all {allCategoryTotal} in {selectedCategory === "All" ? "catalog" : selectedCategory})
                </span>
              )}
            </span>
            <div className="flex items-center gap-2 ml-auto">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">Change Status</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {(["active", "draft", "archived"] as const).map((s) => (
                    <DropdownMenuItem key={s} onClick={() => {
                      setBulkStatusValue(s); setBulkAction("status"); setBulkConfirmOpen(true);
                    }}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">Change Category</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {categories.filter((c) => c !== "All").map((c) => (
                    <DropdownMenuItem key={c} onClick={() => {
                      setBulkCategoryValue(c); setBulkAction("category"); setBulkConfirmOpen(true);
                    }}>{c}</DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="destructive" size="sm" onClick={() => {
                setBulkAction("delete"); setBulkConfirmOpen(true);
              }}>Delete</Button>
              <Button variant="ghost" size="sm" onClick={clearSelection}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

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

        {/* Select all in category banner (browse mode only) */}
        {!isSearchMode && allVisibleSelected && !selectAllMode && totalProducts > products.length && (
          <div className="flex items-center gap-3 px-4 py-2 bg-muted border rounded-md text-sm">
            {isFetchingAllIds ? (
              <span className="text-muted-foreground">Loading…</span>
            ) : (
              <>
                <span>All {products.length} on this page selected.</span>
                <button
                  className="text-primary font-medium hover:underline"
                  onClick={handleSelectAllInCategory}
                >
                  Select all {totalProducts} in{" "}
                  {selectedCategory === "All" ? "all categories" : selectedCategory}?
                </button>
              </>
            )}
          </div>
        )}

        {/* Search Results */}
        {isSearchMode && !isSearching && searchResults.length > 0 ? (
          <div className="bg-card border rounded-lg overflow-hidden">
            <Table className="w-full">
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="p-4 w-10">
                    <input
                      type="checkbox"
                      checked={allVisibleSelected}
                      onChange={toggleSelectAll}
                      className="cursor-pointer"
                    />
                  </TableHead>
                  <TableHead className="text-left p-4 font-medium">
                    Product
                  </TableHead>
                  <TableHead className="text-left p-4 font-medium">
                    Category
                  </TableHead>
                  <TableHead className="text-left p-4 font-medium">
                    Box
                  </TableHead>
                  <TableHead className="text-left p-4 font-medium">
                    Status
                  </TableHead>
                  <TableHead className="text-center p-4 font-medium">
                    Featured
                  </TableHead>
                  <TableHead className="text-right p-4 font-medium">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y">
                {searchResults.map((hit) => (
                  <TableRow
                    key={hit.objectID}
                    className={`hover:bg-muted/30 ${selectedIds.has(hit.objectID) ? "bg-muted/20" : ""}`}
                  >
                    <TableCell className="p-4 w-10">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(hit.objectID)}
                        onChange={() => toggleSelect(hit.objectID)}
                        className="cursor-pointer"
                      />
                    </TableCell>
                    <TableCell className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded bg-muted overflow-hidden shrink-0">
                          {hit.images?.[0] ? (
                            <Image
                              src={hit.images[0]}
                              alt={hit.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <Image
                              src="/logo.svg"
                              alt="Lucky Bee Press"
                              fill
                              className="object-cover"
                            />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{hit.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {hit.sku}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="p-4 text-muted-foreground">
                      {hit.category}
                    </TableCell>
                    <TableCell className="p-4">
                      {hit.hasBoxOption && hit.boxWholesalePrice ? (
                        <span className="text-muted-foreground">Has Box</span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="p-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                          hit.status ?? "draft"
                        )}`}
                      >
                        {hit.status ?? "draft"}
                      </span>
                    </TableCell>
                    <TableCell className="p-4 text-center">
                      <button
                        onClick={() => handleToggleFeatured(hit.objectID, hit.featured ?? false)}
                        disabled={togglingId === hit.objectID || (!hit.featured && featuredCount >= MAX_FEATURED)}
                        title={
                          !hit.featured && featuredCount >= MAX_FEATURED
                            ? `Max ${MAX_FEATURED} featured products reached`
                            : hit.featured ? "Unpin from featured" : "Pin as featured"
                        }
                        className="inline-flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <Star
                          className="w-5 h-5"
                          fill={hit.featured ? "currentColor" : "none"}
                          stroke="currentColor"
                          strokeWidth={2}
                          style={{ color: hit.featured ? "#f59e0b" : undefined }}
                        />
                      </button>
                    </TableCell>
                    <TableCell className="p-4 text-right">
                      <Link
                        href={`/admin/products/${hit.objectID}`}
                        className="text-sm text-primary hover:underline"
                      >
                        Edit
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : isSearchMode && !isSearching && searchResults.length === 0 ? (
          <div className="bg-card border rounded-lg p-12 text-center">
            <Search className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <h2 className="text-xl font-medium mb-2">No products found</h2>
            <p className="text-muted-foreground mb-6">
              No products match &quot;{searchQuery}&quot;
            </p>
            <Button variant="outline" onClick={clearSearch}>
              Clear search
            </Button>
          </div>
        ) : products.length > 0 && !isSearchMode ? (
          <div className="bg-card border rounded-lg overflow-hidden">
            <Table className="w-full">
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="p-4 w-10">
                    <input
                      type="checkbox"
                      checked={allVisibleSelected}
                      onChange={toggleSelectAll}
                      className="cursor-pointer"
                    />
                  </TableHead>
                  <TableHead className="text-left p-4 font-medium">
                    Product
                  </TableHead>
                  <TableHead className="text-left p-4 font-medium">
                    Category
                  </TableHead>
                  <TableHead className="text-left p-4 font-medium">
                    Box
                  </TableHead>
                  <TableHead className="text-left p-4 font-medium">
                    Status
                  </TableHead>
                  <TableHead className="text-center p-4 font-medium">
                    Featured
                  </TableHead>
                  <TableHead className="text-right p-4 font-medium">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y">
                {products.map((product) => (
                  <TableRow
                    key={product.id}
                    className={`hover:bg-muted/30 ${selectedIds.has(product.id) ? "bg-muted/20" : ""}`}
                  >
                    <TableCell className="p-4 w-10">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(product.id)}
                        onChange={() => toggleSelect(product.id)}
                        className="cursor-pointer"
                      />
                    </TableCell>
                    <TableCell className="p-4">
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
                            <Image
                              src="/logo.svg"
                              alt="Lucky Bee Press"
                              fill
                              className="object-cover"
                            />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {product.sku}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="p-4 text-muted-foreground">
                      {product.category}
                    </TableCell>
                    <TableCell className="p-4">
                      {product.hasBoxOption && product.boxWholesalePrice ? (
                        <span className="text-muted-foreground">Has Box</span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="p-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                          product.status
                        )}`}
                      >
                        {product.status}
                      </span>
                    </TableCell>
                    <TableCell className="p-4 text-center">
                      <button
                        onClick={() => handleToggleFeatured(product.id, product.featured)}
                        disabled={togglingId === product.id || (!product.featured && featuredCount >= MAX_FEATURED)}
                        title={
                          !product.featured && featuredCount >= MAX_FEATURED
                            ? `Max ${MAX_FEATURED} featured products reached`
                            : product.featured ? "Unpin from featured" : "Pin as featured"
                        }
                        className="inline-flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <Star
                          className="w-5 h-5"
                          fill={product.featured ? "currentColor" : "none"}
                          stroke="currentColor"
                          strokeWidth={2}
                          style={{ color: product.featured ? "#f59e0b" : undefined }}
                        />
                      </button>
                    </TableCell>
                    <TableCell className="p-4 text-right">
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="text-sm text-primary hover:underline"
                      >
                        Edit
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : !isSearchMode ? (
          <div className="bg-card border rounded-lg p-12 text-center">
            <Image
              src="/logo.svg"
              alt="Lucky Bee Press"
              width={64}
              height={64}
              className="mx-auto mb-4"
            />
            <h2 className="text-xl font-medium mb-2">No products yet</h2>
            <p className="text-muted-foreground mb-6">
              Add your first product to start selling.
            </p>
            <Link href="/admin/products/new">
              <Button>+ Add Product</Button>
            </Link>
          </div>
        ) : null}
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

        {/* Bulk action confirmation/progress modal */}
        {bulkConfirmOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => !bulkProgress.running && setBulkConfirmOpen(false)}
            />
            <div className="relative z-10 bg-background border rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
              {bulkProgress.running ? (
                <div className="text-center space-y-4">
                  <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-sm font-medium">Processing {selectedIds.size} products…</p>
                  <p className="text-xs text-muted-foreground">Do not close this tab.</p>
                </div>
              ) : bulkProgress.done ? (
                <div className="text-center space-y-4">
                  <Check className="mx-auto w-8 h-8 text-green-600" />
                  <p className="font-medium">Done!</p>
                  <p className="text-sm text-muted-foreground">Products updated successfully.</p>
                </div>
              ) : bulkProgress.error ? (
                <div className="space-y-4">
                  <p className="font-semibold text-destructive">Error</p>
                  <p className="text-sm">{bulkProgress.error}</p>
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" size="sm" onClick={() => setBulkConfirmOpen(false)}>Close</Button>
                    <Button size="sm" onClick={executeBulkAction}>Retry</Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold">Confirm Bulk Action</h2>
                  <p className="text-sm text-muted-foreground">
                    {bulkAction === "delete" && (
                      <>
                        <span className="text-destructive font-medium">Permanently delete </span>
                        {selectedIds.size} product{selectedIds.size !== 1 ? "s" : ""}? This cannot be undone.
                      </>
                    )}
                    {bulkAction === "status" && (
                      <>
                        Set {selectedIds.size} product{selectedIds.size !== 1 ? "s" : ""} to{" "}
                        <span className="font-medium">{bulkStatusValue}</span>?
                      </>
                    )}
                    {bulkAction === "category" && (
                      <>
                        Move {selectedIds.size} product{selectedIds.size !== 1 ? "s" : ""} to{" "}
                        <span className="font-medium">{bulkCategoryValue}</span>?
                      </>
                    )}
                  </p>
                  {bulkAction === "delete" && (
                    <p className="text-xs bg-destructive/10 text-destructive px-3 py-2 rounded-md">
                      Products will also be removed from Algolia search.
                    </p>
                  )}
                  <div className="flex gap-2 justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => { setBulkConfirmOpen(false); setBulkAction(null); }}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant={bulkAction === "delete" ? "destructive" : "default"}
                      size="sm"
                      onClick={executeBulkAction}
                    >
                      {bulkAction === "delete" ? "Delete" : "Apply"}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
