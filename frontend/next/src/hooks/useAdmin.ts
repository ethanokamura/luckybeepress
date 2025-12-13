"use client";

import { useState, useEffect, useCallback } from "react";
import { useUser } from "@auth0/nextjs-auth0";
import { findCustomers } from "@/actions/customers";
import { findOrders } from "@/actions/orders";
import { findProducts } from "@/actions/products";
import type { Customers } from "@/types/customers";
import type { Orders } from "@/types/orders";
import type { Products } from "@/types/products";

// ============================================================================
// Admin Check Hook
// ============================================================================

interface UseAdminCheckReturn {
  isAdmin: boolean;
  loading: boolean;
  customer: Customers | null;
}

export function useAdminCheck(): UseAdminCheckReturn {
  const { user, isLoading: authLoading } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [customer, setCustomer] = useState<Customers | null>(null);

  useEffect(() => {
    async function checkAdmin() {
      if (authLoading) return;

      if (!user?.email) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        const response = await findCustomers({ email: user.email });
        if (response.success && response.data && response.data.length > 0) {
          const cust = response.data[0];
          setCustomer(cust);
          // Check if customer is admin (you'll need to add is_admin field to DB)
          // For now, also check for a specific email as fallback
          setIsAdmin(
            (cust as Customers & { is_admin?: boolean }).is_admin === true ||
              user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL
          );
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    }

    checkAdmin();
  }, [user, authLoading]);

  return { isAdmin, loading, customer };
}

// ============================================================================
// Admin Dashboard Stats Hook
// ============================================================================

export interface AdminStats {
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  activeCustomers: number;
  totalProducts: number;
  lowStockProducts: number;
  recentOrders: Orders[];
}

interface UseAdminStatsReturn {
  stats: AdminStats;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useAdminStats(): UseAdminStatsReturn {
  const [stats, setStats] = useState<AdminStats>({
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    activeCustomers: 0,
    totalProducts: 0,
    lowStockProducts: 0,
    recentOrders: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch all data in parallel
      const [ordersRes, customersRes, productsRes] = await Promise.all([
        findOrders({ limit: 1000 }),
        findCustomers({ limit: 1000 }),
        findProducts({ limit: 1000 }),
      ]);

      const orders = ordersRes.success ? ordersRes.data || [] : [];
      const customers = customersRes.success ? customersRes.data || [] : [];
      const products = productsRes.success ? productsRes.data || [] : [];

      // Calculate stats
      const totalRevenue = orders.reduce(
        (sum, order) => sum + Number(order.total_amount || 0),
        0
      );

      const pendingOrders = orders.filter(
        (o) =>
          o.status === "pending" ||
          o.status === "confirmed" ||
          o.status === "processing"
      ).length;

      const activeCustomers = customers.filter(
        (c) => c.account_status === "active"
      ).length;

      const lowStockProducts = products.filter(
        (p) =>
          p.stock_quantity !== null &&
          p.low_stock_threshold !== null &&
          p.stock_quantity <= p.low_stock_threshold
      ).length;

      // Get recent orders (sorted by date)
      const recentOrders = [...orders]
        .sort((a, b) => {
          const dateA = a.order_date ? new Date(a.order_date).getTime() : 0;
          const dateB = b.order_date ? new Date(b.order_date).getTime() : 0;
          return dateB - dateA;
        })
        .slice(0, 5);

      setStats({
        totalOrders: orders.length,
        pendingOrders,
        totalRevenue,
        totalCustomers: customers.length,
        activeCustomers,
        totalProducts: products.length,
        lowStockProducts,
        recentOrders,
      });
    } catch (err) {
      setError("Failed to load dashboard stats");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, error, refresh: fetchStats };
}

// ============================================================================
// Admin Orders Hook
// ============================================================================

interface UseAdminOrdersOptions {
  initialStatus?: string;
  limit?: number;
}

interface UseAdminOrdersReturn {
  orders: Orders[];
  loading: boolean;
  error: string | null;
  statusFilter: string | null;
  setStatusFilter: (status: string | null) => void;
  refresh: () => Promise<void>;
}

export function useAdminOrders(
  options: UseAdminOrdersOptions = {}
): UseAdminOrdersReturn {
  const { initialStatus = null, limit = 100 } = options;
  const [orders, setOrders] = useState<Orders[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(
    initialStatus
  );

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params: Record<string, unknown> = { limit };
      if (statusFilter) {
        params.status = statusFilter;
      }

      const response = await findOrders(params);
      if (response.success && response.data) {
        // Sort by date descending
        const sorted = [...response.data].sort((a, b) => {
          const dateA = a.order_date ? new Date(a.order_date).getTime() : 0;
          const dateB = b.order_date ? new Date(b.order_date).getTime() : 0;
          return dateB - dateA;
        });
        setOrders(sorted);
      } else {
        setError(response.error || "Failed to load orders");
      }
    } catch (err) {
      setError("Failed to load orders");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [limit, statusFilter]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return {
    orders,
    loading,
    error,
    statusFilter,
    setStatusFilter,
    refresh: fetchOrders,
  };
}

// ============================================================================
// Admin Products Hook
// ============================================================================

interface UseAdminProductsReturn {
  products: Products[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  categoryFilter: string | null;
  setCategoryFilter: (category: string | null) => void;
  refresh: () => Promise<void>;
}

export function useAdminProducts(): UseAdminProductsReturn {
  const [products, setProducts] = useState<Products[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params: Record<string, unknown> = { limit: 100 };
      if (categoryFilter) {
        params.category = categoryFilter;
      }

      const response = await findProducts(params);
      if (response.success && response.data) {
        let filtered = response.data;

        // Client-side search filtering
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          filtered = filtered.filter(
            (p) =>
              p.name.toLowerCase().includes(query) ||
              p.sku?.toLowerCase().includes(query) ||
              p.category?.toLowerCase().includes(query)
          );
        }

        setProducts(filtered);
      } else {
        setError(response.error || "Failed to load products");
      }
    } catch (err) {
      setError("Failed to load products");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [categoryFilter, searchQuery]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    refresh: fetchProducts,
  };
}

// ============================================================================
// Admin Customers Hook
// ============================================================================

interface UseAdminCustomersReturn {
  customers: Customers[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: string | null;
  setStatusFilter: (status: string | null) => void;
  refresh: () => Promise<void>;
}

export function useAdminCustomers(): UseAdminCustomersReturn {
  const [customers, setCustomers] = useState<Customers[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params: Record<string, unknown> = { limit: 100 };
      if (statusFilter) {
        params.account_status = statusFilter;
      }

      const response = await findCustomers(params);
      if (response.success && response.data) {
        let filtered = response.data;

        // Client-side search filtering
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          filtered = filtered.filter(
            (c) =>
              c.business_name.toLowerCase().includes(query) ||
              c.email.toLowerCase().includes(query) ||
              c.contact_name?.toLowerCase().includes(query)
          );
        }

        // Sort by lifetime value descending
        filtered.sort(
          (a, b) =>
            Number(b.lifetime_value || 0) - Number(a.lifetime_value || 0)
        );

        setCustomers(filtered);
      } else {
        setError(response.error || "Failed to load customers");
      }
    } catch (err) {
      setError("Failed to load customers");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, searchQuery]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  return {
    customers,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    refresh: fetchCustomers,
  };
}
