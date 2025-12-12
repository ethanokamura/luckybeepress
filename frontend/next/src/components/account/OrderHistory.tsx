"use client";

import { OrderCard, OrderCardSkeleton } from "./OrderCard";
import { EmptyOrders } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import type { Orders } from "@/types/orders";

interface OrderHistoryProps {
  orders: Orders[];
  loading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  onReorder?: (orderId: string) => void;
  className?: string;
}

export function OrderHistory({
  orders,
  loading = false,
  hasMore = false,
  onLoadMore,
  onReorder,
  className = "",
}: OrderHistoryProps) {
  if (loading && orders.length === 0) {
    return (
      <div className={`space-y-4 ${className}`}>
        {Array.from({ length: 3 }).map((_, i) => (
          <OrderCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <EmptyOrders
        onShop={() => (window.location.href = "/products")}
        className={className}
      />
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {orders.map((order) => (
        <OrderCard
          key={order.id}
          order={order}
          showReorder={Boolean(onReorder)}
          onReorder={() => order.id && onReorder?.(order.id)}
        />
      ))}

      {hasMore && (
        <div className="flex justify-center pt-4">
          <Button variant="outline" onClick={onLoadMore} loading={loading}>
            Load More Orders
          </Button>
        </div>
      )}
    </div>
  );
}

