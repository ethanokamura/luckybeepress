"use client";

import { ArrowLeft, RotateCcw, Download, ExternalLink } from "lucide-react";
import Link from "next/link";
import type { Orders } from "@/types/orders";
import type { OrderItems } from "@/types/order_items";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/ui/StatusBadge";
import { OrderTotal } from "@/components/ui/PriceDisplay";
import { ProductThumbnail } from "@/components/ui/ProductImage";
import {
  formatCurrency,
  formatDate,
  formatDateTime,
  formatOrderNumber,
  formatDueDate,
  getTrackingUrl,
} from "@/lib/format";

interface OrderDetailProps {
  order: Orders;
  items?: OrderItems[];
  onReorder?: () => void;
  className?: string;
}

export function OrderDetail({
  order,
  items = [],
  onReorder,
  className = "",
}: OrderDetailProps) {
  const trackingUrl = order.tracking_number
    ? getTrackingUrl(order.tracking_number, order.carrier)
    : null;

  return (
    <div className={className}>
      {/* Back button */}
      <Link
        href="/account/orders"
        className="inline-flex items-center gap-2 text-sm text-base-content/60 hover:text-primary mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Orders
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            Order {formatOrderNumber(order.order_number)}
          </h1>
          <p className="text-base-content/60 mt-1">
            Placed on {formatDateTime(order.order_date)}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <OrderStatusBadge status={order.status} />
          {onReorder && (
            <Button
              variant="outline"
              leftIcon={<RotateCcw className="h-4 w-4" />}
              onClick={onReorder}
            >
              Reorder
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order items */}
          <Card>
            <CardHeader>
              <CardTitle>Order Items ({items.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-base-300">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                    <ProductThumbnail src={null} alt={item.product_name} size="md" />
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/products/${item.product_id}`}
                        className="font-medium hover:text-primary"
                      >
                        {item.product_name}
                      </Link>
                      <p className="text-sm text-base-content/60">SKU: {item.sku}</p>
                      <p className="text-sm text-base-content/60">
                        Qty: {item.quantity} × {formatCurrency(Number(item.unit_wholesale_price))}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatCurrency(Number(item.subtotal))}</p>
                    </div>
                  </div>
                ))}

                {items.length === 0 && (
                  <p className="text-base-content/60 py-4">No items found</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Shipping info */}
          <Card>
            <CardHeader>
              <CardTitle>Shipping Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-base-content/70 mb-2">
                    Shipping Address
                  </h4>
                  {order.shipping_company_name && (
                    <p className="font-medium">{order.shipping_company_name}</p>
                  )}
                  <p>{order.shipping_address_1}</p>
                  {order.shipping_address_2 && <p>{order.shipping_address_2}</p>}
                  <p>
                    {order.shipping_city}, {order.shipping_state}{" "}
                    {order.shipping_postal_code}
                  </p>
                </div>

                {order.tracking_number && (
                  <div>
                    <h4 className="text-sm font-medium text-base-content/70 mb-2">
                      Tracking
                    </h4>
                    <p className="font-mono">{order.tracking_number}</p>
                    {order.carrier && (
                      <p className="text-sm text-base-content/60">{order.carrier}</p>
                    )}
                    {trackingUrl && (
                      <a
                        href={trackingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-primary hover:underline mt-2"
                      >
                        Track Package
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                )}
              </div>

              {/* Shipping timeline */}
              {(order.ship_date || order.delivery_date) && (
                <div className="mt-6 pt-6 border-t border-base-300">
                  <h4 className="text-sm font-medium text-base-content/70 mb-3">
                    Timeline
                  </h4>
                  <div className="space-y-2 text-sm">
                    {order.ship_date && (
                      <p>
                        <span className="text-base-content/60">Shipped:</span>{" "}
                        {formatDate(order.ship_date)}
                      </p>
                    )}
                    {order.delivery_date && (
                      <p>
                        <span className="text-base-content/60">Delivered:</span>{" "}
                        {formatDate(order.delivery_date)}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <OrderTotal
                subtotal={Number(order.subtotal)}
                shipping={order.shipping_cost ? Number(order.shipping_cost) : undefined}
                tax={order.tax_amount ? Number(order.tax_amount) : undefined}
                discount={
                  order.discount_amount ? Number(order.discount_amount) : undefined
                }
                total={Number(order.total_amount)}
              />
            </CardContent>
          </Card>

          {/* Payment info */}
          <Card>
            <CardHeader>
              <CardTitle>Payment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-base-content/70">Method</span>
                  <span className="capitalize">
                    {order.payment_method?.replace("_", " ") || "—"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-base-content/70">Status</span>
                  <PaymentStatusBadge status={order.payment_status} size="sm" />
                </div>
                {order.payment_due_date && (
                  <div className="flex justify-between">
                    <span className="text-base-content/70">Due Date</span>
                    <span>{formatDueDate(order.payment_due_date)}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          {order.customer_notes && (
            <Card>
              <CardHeader>
                <CardTitle>Order Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-base-content/70">{order.customer_notes}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

