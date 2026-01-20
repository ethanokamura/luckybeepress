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
import { ArrowUpDown, Check, Filter, Search, X } from "lucide-react";
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

        {/* Results count */}
        <div className="text-sm text-muted-foreground">
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

        {/* Search Results */}
        {isSearchMode && !isSearching && searchResults.length > 0 ? (
          <div className="bg-card border rounded-lg overflow-hidden">
            <Table className="w-full">
              <TableHeader className="bg-muted/50">
                <TableRow>
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
                  <TableHead className="text-right p-4 font-medium">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y">
                {searchResults.map((hit) => (
                  <TableRow key={hit.objectID} className="hover:bg-muted/30">
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
                  <TableHead className="text-right p-4 font-medium">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y">
                {products.map((product) => (
                  <TableRow key={product.id} className="hover:bg-muted/30">
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
      </div>
    </AuthGuard>
  );
}
