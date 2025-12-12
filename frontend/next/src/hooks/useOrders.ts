"use client";

import { useState, useEffect, useCallback } from "react";
import { findOrders, getOrders, createOrders } from "@/actions/orders";
import { findOrderItems } from "@/actions/order-items";
import type { Orders } from "@/types/orders";
import type { OrderItems } from "@/types/order_items";
import type { QueryOrdersInput, CreateOrdersInput } from "@/actions/orders/validators";
import { PAGINATION, ORDER_STATUS, type OrderStatus } from "@/lib/constants";

// ============================================================================
// Types
// ============================================================================

export interface OrderWithItems extends Orders {
  items?: OrderItems[];
}

export interface OrderFilters {
  status?: OrderStatus;
  paymentStatus?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface UseOrdersOptions {
  customerId: string | null;
  initialFilters?: OrderFilters;
  limit?: number;
  autoFetch?: boolean;
}

export interface UseOrdersReturn {
  orders: OrderWithItems[];
  loading: boolean;
  error: string | null;
  filters: OrderFilters;
  hasMore: boolean;
  
  // Actions
  setFilters: (filters: OrderFilters) => void;
  clearFilters: () => void;
  refresh: () => Promise<void>;
  loadMore: () => Promise<void>;
  
  // Filter helpers
  setStatus: (status: OrderStatus | null) => void;
}

export interface UseOrderReturn {
  order: OrderWithItems | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export interface UseCreateOrderReturn {
  createOrder: (input: CreateOrdersInput) => Promise<Orders | null>;
  loading: boolean;
  error: string | null;
}

// ============================================================================
// Orders List Hook
// ============================================================================

export function useOrders(options: UseOrdersOptions): UseOrdersReturn {
  const {
    customerId,
    initialFilters = {},
    limit = PAGINATION.orderHistoryLimit,
    autoFetch = true,
  } = options;

  // State
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFiltersState] = useState<OrderFilters>(initialFilters);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  // Build query from filters
  const buildQuery = useCallback(
    (currentCursor?: string | null): Partial<QueryOrdersInput> => {
      const query: Partial<QueryOrdersInput> = {
        limit,
        order_by: "order_date",
        order: "desc",
      };

      if (customerId) {
        query.customer_id = customerId;
      }

      if (filters.status) {
        query.status = filters.status;
      }

      if (filters.paymentStatus) {
        query.payment_status = filters.paymentStatus;
      }

      if (currentCursor) {
        query.cursor = currentCursor;
      }

      return query;
    },
    [customerId, filters, limit]
  );

  // Fetch orders
  const fetchOrders = useCallback(
    async (append: boolean = false) => {
      if (!customerId) {
        setOrders([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const query = buildQuery(append ? cursor : null);
        const response = await findOrders(query);

        if (response.success && response.data) {
          if (append) {
            setOrders((prev) => [...prev, ...response.data!]);
          } else {
            setOrders(response.data);
          }

          // Handle pagination
          const receivedCount = response.data.length;
          setHasMore(receivedCount === limit);

          // Update cursor
          if (response.data.length > 0) {
            const lastItem = response.data[response.data.length - 1];
            setCursor(lastItem.id);
          }
        } else {
          setError(response.error || "Failed to fetch orders");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    },
    [buildQuery, cursor, customerId, limit]
  );

  // Auto-fetch on mount and filter changes
  useEffect(() => {
    if (autoFetch && customerId) {
      setCursor(null);
      setHasMore(true);
      fetchOrders(false);
    }
  }, [customerId, filters]); // eslint-disable-line react-hooks/exhaustive-deps

  // Actions
  const setFilters = useCallback((newFilters: OrderFilters) => {
    setFiltersState(newFilters);
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
    await fetchOrders(false);
  }, [fetchOrders]);

  const loadMore = useCallback(async () => {
    if (!loading && hasMore) {
      await fetchOrders(true);
    }
  }, [fetchOrders, loading, hasMore]);

  // Filter helpers
  const setStatus = useCallback(
    (status: OrderStatus | null) => {
      setFilters({
        ...filters,
        status: status || undefined,
      });
    },
    [filters, setFilters]
  );

  return {
    orders,
    loading,
    error,
    filters,
    hasMore,
    setFilters,
    clearFilters,
    refresh,
    loadMore,
    setStatus,
  };
}

// ============================================================================
// Single Order Hook
// ============================================================================

export function useOrder(orderId: string | null): UseOrderReturn {
  const [order, setOrder] = useState<OrderWithItems | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = useCallback(async () => {
    if (!orderId) {
      setOrder(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch order
      const orderResponse = await getOrders(orderId);

      if (orderResponse.success && orderResponse.data) {
        const orderData = orderResponse.data;

        // Fetch order items
        const itemsResponse = await findOrderItems({
          order_id: orderId,
          limit: 100,
        });

        setOrder({
          ...orderData,
          items: itemsResponse.success ? itemsResponse.data : [],
        });
      } else {
        setError(orderResponse.error || "Order not found");
        setOrder(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setOrder(null);
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  return {
    order,
    loading,
    error,
    refresh: fetchOrder,
  };
}

// ============================================================================
// Create Order Hook
// ============================================================================

export function useCreateOrder(): UseCreateOrderReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createOrder = useCallback(
    async (input: CreateOrdersInput): Promise<Orders | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await createOrders(input);

        if (response.success && response.data) {
          return response.data;
        } else {
          setError(response.error || "Failed to create order");
          return null;
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    createOrder,
    loading,
    error,
  };
}

// ============================================================================
// Recent Orders Hook (for dashboard)
// ============================================================================

export function useRecentOrders(customerId: string | null, limit: number = 5) {
  const [orders, setOrders] = useState<Orders[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecentOrders = async () => {
      if (!customerId) {
        setOrders([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const response = await findOrders({
          customer_id: customerId,
          limit,
          order_by: "order_date",
          order: "desc",
        });

        if (response.success && response.data) {
          setOrders(response.data);
        } else {
          setError(response.error || "Failed to fetch orders");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchRecentOrders();
  }, [customerId, limit]);

  return { orders, loading, error };
}

// ============================================================================
// Order Stats Hook (for dashboard)
// ============================================================================

export interface OrderStats {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalSpent: number;
}

export function useOrderStats(customerId: string | null) {
  const [stats, setStats] = useState<OrderStats>({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalSpent: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      if (!customerId) {
        setStats({
          totalOrders: 0,
          pendingOrders: 0,
          completedOrders: 0,
          totalSpent: 0,
        });
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // Fetch all orders for customer to calculate stats
        const response = await findOrders({
          customer_id: customerId,
          limit: 100,
        });

        if (response.success && response.data) {
          const orders = response.data;
          
          const totalOrders = orders.length;
          const pendingOrders = orders.filter(
            (o) => o.status === ORDER_STATUS.PENDING || o.status === ORDER_STATUS.PROCESSING
          ).length;
          const completedOrders = orders.filter(
            (o) => o.status === ORDER_STATUS.DELIVERED
          ).length;
          const totalSpent = orders.reduce(
            (sum, o) => sum + Number(o.total_amount),
            0
          );

          setStats({
            totalOrders,
            pendingOrders,
            completedOrders,
            totalSpent,
          });
        } else {
          setError(response.error || "Failed to fetch order stats");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [customerId]);

  return { stats, loading, error };
}

