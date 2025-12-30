"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getDocs, query, where, orderBy } from "firebase/firestore";
import { collections, formatPrice, toDate } from "@/lib/firebase-helpers";
import {
  OrderStatusBadge,
  PaymentStatusBadge,
} from "@/components/shared/OrderStatusBadge";
import { Button } from "@/components/ui/button";
import type { Order, OrderStatus } from "@/types";

const statusFilters: { value: OrderStatus | "all"; label: string }[] = [
  { value: "all", label: "All Orders" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

export default function AdminOrdersPage() {
  const searchParams = useSearchParams();
  const initialStatus = searchParams.get("status") || "all";

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState(initialStatus);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        let q;
        if (statusFilter === "all") {
          q = query(collections.orders, orderBy("createdAt", "desc"));
        } else {
          q = query(
            collections.orders,
            where("status", "==", statusFilter),
            orderBy("createdAt", "desc")
          );
        }
        const snapshot = await getDocs(q);
        setOrders(snapshot.docs.map((doc) => doc.data()));
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [statusFilter]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted animate-pulse rounded w-32" />
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Orders</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {statusFilters.map((filter) => (
          <Button
            key={filter.value}
            variant={statusFilter === filter.value ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter(filter.value)}
          >
            {filter.label}
          </Button>
        ))}
      </div>

      {orders.length > 0 ? (
        <div className="bg-card border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-4 font-medium">Order</th>
                <th className="text-left p-4 font-medium">Customer</th>
                <th className="text-left p-4 font-medium">Date</th>
                <th className="text-left p-4 font-medium">Total</th>
                <th className="text-left p-4 font-medium">Status</th>
                <th className="text-left p-4 font-medium">Payment</th>
                <th className="text-right p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {orders.map((order) => {
                const createdAt = toDate(order.createdAt);
                return (
                  <tr key={order.id} className="hover:bg-muted/30">
                    <td className="p-4">
                      <p className="font-medium">{order.orderNumber}</p>
                      <p className="text-xs text-muted-foreground">
                        {order.items.length} item
                        {order.items.length !== 1 ? "s" : ""}
                      </p>
                    </td>
                    <td className="p-4">
                      <p className="text-sm">{order.userEmail}</p>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {createdAt?.toLocaleDateString()}
                    </td>
                    <td className="p-4 font-medium">
                      {formatPrice(order.total)}
                    </td>
                    <td className="p-4">
                      <OrderStatusBadge status={order.status} size="sm" />
                    </td>
                    <td className="p-4">
                      <PaymentStatusBadge
                        status={order.paymentStatus}
                        size="sm"
                      />
                    </td>
                    <td className="p-4 text-right">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="text-sm text-primary hover:underline"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-card border rounded-lg p-12 text-center">
          <span className="text-4xl mb-4 block">🐝</span>
          <h2 className="text-xl font-medium mb-2">No orders found</h2>
          <p className="text-muted-foreground">
            {statusFilter === "all"
              ? "No orders have been placed yet."
              : `No orders with status "${statusFilter}".`}
          </p>
        </div>
      )}
    </div>
  );
}
