"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, MoreVertical, Truck, CheckCircle, XCircle } from "lucide-react";
import type { Orders } from "@/types/orders";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/ui/StatusBadge";
import { formatCurrency, formatDate, formatOrderNumber } from "@/lib/format";
import { ORDER_STATUS } from "@/lib/constants";

interface AdminOrdersTableProps {
  orders: Orders[];
  loading?: boolean;
  onUpdateStatus?: (orderId: string, status: string) => Promise<void>;
  className?: string;
}

export function AdminOrdersTable({
  orders,
  loading = false,
  onUpdateStatus,
  className = "",
}: AdminOrdersTableProps) {
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const handleStatusUpdate = async (orderId: string, status: string) => {
    if (!onUpdateStatus) return;
    setUpdatingId(orderId);
    try {
      await onUpdateStatus(orderId, status);
    } finally {
      setUpdatingId(null);
      setOpenMenuId(null);
    }
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-base-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Order</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Customer</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Date</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Payment</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold">Total</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-t border-base-300">
                    <td className="px-4 py-3">
                      <Skeleton variant="text" className="h-5 w-24" />
                    </td>
                    <td className="px-4 py-3">
                      <Skeleton variant="text" className="h-5 w-32" />
                    </td>
                    <td className="px-4 py-3">
                      <Skeleton variant="text" className="h-5 w-24" />
                    </td>
                    <td className="px-4 py-3">
                      <Skeleton variant="text" className="h-6 w-20" />
                    </td>
                    <td className="px-4 py-3">
                      <Skeleton variant="text" className="h-6 w-16" />
                    </td>
                    <td className="px-4 py-3">
                      <Skeleton variant="text" className="h-5 w-16 ml-auto" />
                    </td>
                    <td className="px-4 py-3">
                      <Skeleton variant="text" className="h-8 w-8 ml-auto" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (orders.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="py-12 text-center">
          <p className="text-base-content/60">No orders found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-base-200">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">Order</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Customer</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Date</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Payment</th>
                <th className="px-4 py-3 text-right text-sm font-semibold">Total</th>
                <th className="px-4 py-3 text-right text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-t border-base-300 hover:bg-base-200/50">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="font-mono font-medium text-primary hover:underline"
                    >
                      {formatOrderNumber(order.order_number)}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-sm">{order.shipping_company_name || "—"}</p>
                      <p className="text-xs text-base-content/60">
                        {order.shipping_city}, {order.shipping_state}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {formatDate(order.order_date)}
                  </td>
                  <td className="px-4 py-3">
                    <OrderStatusBadge status={order.status} size="sm" />
                  </td>
                  <td className="px-4 py-3">
                    <PaymentStatusBadge status={order.payment_status} size="sm" />
                  </td>
                  <td className="px-4 py-3 text-right font-semibold">
                    {formatCurrency(Number(order.total_amount))}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="relative inline-block">
                      <button
                        onClick={() =>
                          setOpenMenuId(openMenuId === order.id ? null : order.id || null)
                        }
                        className="p-2 rounded-lg hover:bg-base-200"
                        disabled={updatingId === order.id}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>

                      {openMenuId === order.id && (
                        <div className="absolute right-0 top-full mt-1 w-48 rounded-lg border border-base-300 bg-base-100 shadow-lg z-10">
                          <Link
                            href={`/admin/orders/${order.id}`}
                            className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-base-200"
                            onClick={() => setOpenMenuId(null)}
                          >
                            <Eye className="h-4 w-4" />
                            View Details
                          </Link>
                          {order.status !== ORDER_STATUS.SHIPPED && (
                            <button
                              onClick={() =>
                                order.id && handleStatusUpdate(order.id, ORDER_STATUS.SHIPPED)
                              }
                              className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-base-200 w-full text-left"
                            >
                              <Truck className="h-4 w-4" />
                              Mark as Shipped
                            </button>
                          )}
                          {order.status !== ORDER_STATUS.DELIVERED && (
                            <button
                              onClick={() =>
                                order.id && handleStatusUpdate(order.id, ORDER_STATUS.DELIVERED)
                              }
                              className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-base-200 w-full text-left"
                            >
                              <CheckCircle className="h-4 w-4" />
                              Mark as Delivered
                            </button>
                          )}
                          {order.status !== ORDER_STATUS.CANCELLED && (
                            <button
                              onClick={() =>
                                order.id && handleStatusUpdate(order.id, ORDER_STATUS.CANCELLED)
                              }
                              className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-base-200 w-full text-left text-error"
                            >
                              <XCircle className="h-4 w-4" />
                              Cancel Order
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

// Recent orders card for dashboard
interface RecentOrdersCardProps {
  orders: Orders[];
  loading?: boolean;
  className?: string;
}

export function RecentOrdersCard({
  orders,
  loading = false,
  className = "",
}: RecentOrdersCardProps) {
  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="space-y-1">
                  <Skeleton variant="text" className="h-5 w-24" />
                  <Skeleton variant="text" className="h-4 w-32" />
                </div>
                <Skeleton variant="text" className="h-6 w-20" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Orders</CardTitle>
        <Link href="/admin/orders">
          <Button variant="ghost" size="sm">
            View All
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {orders.length === 0 ? (
          <p className="text-center text-base-content/60 py-4">No orders yet</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/admin/orders/${order.id}`}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-base-200 -mx-3"
              >
                <div>
                  <p className="font-mono font-medium text-sm">
                    {formatOrderNumber(order.order_number)}
                  </p>
                  <p className="text-xs text-base-content/60">
                    {formatDate(order.order_date)} • {order.shipping_company_name || "Unknown"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-sm">
                    {formatCurrency(Number(order.total_amount))}
                  </p>
                  <OrderStatusBadge status={order.status} size="sm" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

