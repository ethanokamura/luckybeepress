"use client";

import Link from "next/link";
import { ChevronRight, Package, RotateCcw } from "lucide-react";
import type { Orders } from "@/types/orders";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/ui/StatusBadge";
import { formatCurrency, formatDate, formatOrderNumber } from "@/lib/format";

interface OrderCardProps {
  order: Orders;
  showReorder?: boolean;
  onReorder?: () => void;
  className?: string;
}

export function OrderCard({
  order,
  showReorder = false,
  onReorder,
  className = "",
}: OrderCardProps) {
  return (
    <Card className={`hover:shadow-md transition-shadow ${className}`}>
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Order info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <span className="font-mono font-semibold text-base">
                {formatOrderNumber(order.order_number)}
              </span>
              <OrderStatusBadge status={order.status} size="sm" />
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-base-content/60">
              <span>{formatDate(order.order_date)}</span>
              <span>•</span>
              <span className="font-medium text-base-content">
                {formatCurrency(Number(order.total_amount))}
              </span>
              {order.payment_status && (
                <>
                  <span>•</span>
                  <PaymentStatusBadge status={order.payment_status} size="sm" />
                </>
              )}
            </div>

            {/* Shipping address preview */}
            <p className="text-sm text-base-content/50 mt-2 line-clamp-1">
              {order.shipping_city}, {order.shipping_state}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {showReorder && onReorder && (
              <Button
                variant="outline"
                size="sm"
                leftIcon={<RotateCcw className="h-4 w-4" />}
                onClick={(e) => {
                  e.preventDefault();
                  onReorder();
                }}
              >
                Reorder
              </Button>
            )}
            <Link href={`/account/orders/${order.id}`}>
              <Button variant="ghost" size="sm" rightIcon={<ChevronRight className="h-4 w-4" />}>
                View Details
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Compact order card for dashboard
interface OrderCardCompactProps {
  order: Orders;
  className?: string;
}

export function OrderCardCompact({ order, className = "" }: OrderCardCompactProps) {
  return (
    <Link
      href={`/account/orders/${order.id}`}
      className={`flex items-center gap-4 p-4 rounded-lg border border-base-300 hover:border-primary/50 hover:shadow-sm transition-all ${className}`}
    >
      <div className="w-10 h-10 rounded-lg bg-base-200 flex items-center justify-center">
        <Package className="h-5 w-5 text-base-content/60" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm font-medium">
            {formatOrderNumber(order.order_number)}
          </span>
          <OrderStatusBadge status={order.status} size="sm" />
        </div>
        <p className="text-sm text-base-content/60">{formatDate(order.order_date)}</p>
      </div>

      <div className="text-right">
        <p className="font-semibold">{formatCurrency(Number(order.total_amount))}</p>
      </div>

      <ChevronRight className="h-4 w-4 text-base-content/40" />
    </Link>
  );
}

// Order card skeleton
export function OrderCardSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-5 bg-base-200 rounded w-32" />
              <div className="h-5 bg-base-200 rounded w-20" />
            </div>
            <div className="h-4 bg-base-200 rounded w-48 mb-2" />
            <div className="h-4 bg-base-200 rounded w-24" />
          </div>
          <div className="h-9 bg-base-200 rounded w-24" />
        </div>
      </CardContent>
    </Card>
  );
}

