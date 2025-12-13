"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Truck,
  CheckCircle,
  XCircle,
  Edit,
  Save,
  Package,
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Skeleton } from "@/components/ui/Skeleton";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/ui/StatusBadge";
import { OrderTotal } from "@/components/ui/PriceDisplay";
import { useOrder } from "@/hooks/useOrders";
import { updateOrders } from "@/actions/orders";
import { useToast } from "@/providers/ToastProvider";
import {
  formatCurrency,
  formatDate,
  formatDateTime,
  formatOrderNumber,
} from "@/lib/format";
import { ORDER_STATUS, PAYMENT_STATUS } from "@/lib/constants";

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

const statusOptions = [
  { value: ORDER_STATUS.PENDING, label: "Pending" },
  { value: ORDER_STATUS.CONFIRMED, label: "Confirmed" },
  { value: ORDER_STATUS.PROCESSING, label: "Processing" },
  { value: ORDER_STATUS.SHIPPED, label: "Shipped" },
  { value: ORDER_STATUS.DELIVERED, label: "Delivered" },
  { value: ORDER_STATUS.CANCELLED, label: "Cancelled" },
];

const paymentStatusOptions = [
  { value: PAYMENT_STATUS.PENDING, label: "Pending" },
  { value: PAYMENT_STATUS.PAID, label: "Paid" },
  { value: PAYMENT_STATUS.PARTIAL, label: "Partial" },
  { value: PAYMENT_STATUS.OVERDUE, label: "Overdue" },
  { value: PAYMENT_STATUS.REFUNDED, label: "Refunded" },
];

export default function AdminOrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const toast = useToast();
  const { order, loading, error, refresh } = useOrder(id);

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editData, setEditData] = useState({
    status: "",
    payment_status: "",
    tracking_number: "",
    carrier: "",
    internal_notes: "",
  });

  const startEditing = () => {
    if (order) {
      setEditData({
        status: order.status || "",
        payment_status: order.payment_status || "",
        tracking_number: order.tracking_number || "",
        carrier: order.carrier || "",
        internal_notes: order.internal_notes || "",
      });
      setEditing(true);
    }
  };

  const handleSave = async () => {
    if (!order?.id) return;

    setSaving(true);
    try {
      const response = await updateOrders(order.id, {
        status: editData.status || undefined,
        payment_status: editData.payment_status || undefined,
        tracking_number: editData.tracking_number || undefined,
        carrier: editData.carrier || undefined,
        internal_notes: editData.internal_notes || undefined,
        ship_date:
          editData.status === ORDER_STATUS.SHIPPED && order.status !== ORDER_STATUS.SHIPPED
            ? new Date()
            : undefined,
        delivery_date:
          editData.status === ORDER_STATUS.DELIVERED && order.status !== ORDER_STATUS.DELIVERED
            ? new Date()
            : undefined,
      });

      if (response.success) {
        toast.success("Order updated successfully");
        setEditing(false);
        refresh();
      } else {
        toast.error(response.error || "Failed to update order");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton variant="text" className="h-8 w-48" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton variant="rectangular" className="h-64 rounded-xl" />
            <Skeleton variant="rectangular" className="h-48 rounded-xl" />
          </div>
          <div className="space-y-6">
            <Skeleton variant="rectangular" className="h-48 rounded-xl" />
            <Skeleton variant="rectangular" className="h-32 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="text-center py-16">
        <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
        <p className="text-base-content/60 mb-8">
          The order you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link href="/admin/orders">
          <Button variant="primary">Back to Orders</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-2 text-sm text-base-content/60 hover:text-primary mb-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Orders
          </Link>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            Order {formatOrderNumber(order.order_number)}
            <OrderStatusBadge status={editing ? editData.status : order.status} />
          </h1>
          <p className="text-base-content/60 mt-1">
            Placed on {formatDateTime(order.order_date)}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {editing ? (
            <>
              <Button variant="ghost" onClick={() => setEditing(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                leftIcon={<Save className="h-4 w-4" />}
                onClick={handleSave}
                loading={saving}
              >
                Save Changes
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              leftIcon={<Edit className="h-4 w-4" />}
              onClick={startEditing}
            >
              Edit Order
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
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order Items ({order.items?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {order.items && order.items.length > 0 ? (
                <div className="divide-y divide-base-300">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between py-3 first:pt-0 last:pb-0">
                      <div>
                        <p className="font-medium">{item.product_name}</p>
                        <p className="text-sm text-base-content/60">
                          SKU: {item.sku} • Qty: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{formatCurrency(Number(item.subtotal))}</p>
                        <p className="text-sm text-base-content/60">
                          {formatCurrency(Number(item.unit_wholesale_price))} each
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-base-content/60">No items found</p>
              )}
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
                    {order.shipping_city}, {order.shipping_state} {order.shipping_postal_code}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-base-content/70 mb-2">
                    Tracking
                  </h4>
                  {editing ? (
                    <div className="space-y-3">
                      <Input
                        placeholder="Tracking number"
                        value={editData.tracking_number}
                        onChange={(e) =>
                          setEditData((prev) => ({ ...prev, tracking_number: e.target.value }))
                        }
                      />
                      <Input
                        placeholder="Carrier (e.g., USPS, UPS)"
                        value={editData.carrier}
                        onChange={(e) =>
                          setEditData((prev) => ({ ...prev, carrier: e.target.value }))
                        }
                      />
                    </div>
                  ) : order.tracking_number ? (
                    <>
                      <p className="font-mono">{order.tracking_number}</p>
                      {order.carrier && (
                        <p className="text-sm text-base-content/60">{order.carrier}</p>
                      )}
                    </>
                  ) : (
                    <p className="text-base-content/60">No tracking info</p>
                  )}
                </div>
              </div>

              {/* Dates */}
              {(order.ship_date || order.delivery_date) && (
                <div className="mt-6 pt-6 border-t border-base-300 grid grid-cols-2 gap-4">
                  {order.ship_date && (
                    <div>
                      <p className="text-sm text-base-content/70">Shipped</p>
                      <p className="font-medium">{formatDate(order.ship_date)}</p>
                    </div>
                  )}
                  {order.delivery_date && (
                    <div>
                      <p className="text-sm text-base-content/70">Delivered</p>
                      <p className="font-medium">{formatDate(order.delivery_date)}</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Internal notes */}
          <Card>
            <CardHeader>
              <CardTitle>Internal Notes</CardTitle>
            </CardHeader>
            <CardContent>
              {editing ? (
                <textarea
                  value={editData.internal_notes}
                  onChange={(e) =>
                    setEditData((prev) => ({ ...prev, internal_notes: e.target.value }))
                  }
                  rows={4}
                  className="w-full rounded-lg border border-base-300 bg-base-100 px-4 py-2"
                  placeholder="Add internal notes about this order..."
                />
              ) : order.internal_notes ? (
                <p className="text-base-content/70 whitespace-pre-wrap">{order.internal_notes}</p>
              ) : (
                <p className="text-base-content/60">No internal notes</p>
              )}

              {order.customer_notes && (
                <div className="mt-4 pt-4 border-t border-base-300">
                  <h4 className="text-sm font-medium text-base-content/70 mb-2">Customer Notes</h4>
                  <p className="text-base-content/70 whitespace-pre-wrap">{order.customer_notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status card */}
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {editing ? (
                <>
                  <Select
                    label="Order Status"
                    options={statusOptions}
                    value={editData.status}
                    onChange={(e) =>
                      setEditData((prev) => ({ ...prev, status: e.target.value }))
                    }
                  />
                  <Select
                    label="Payment Status"
                    options={paymentStatusOptions}
                    value={editData.payment_status}
                    onChange={(e) =>
                      setEditData((prev) => ({ ...prev, payment_status: e.target.value }))
                    }
                  />
                </>
              ) : (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-base-content/70">Order Status</span>
                    <OrderStatusBadge status={order.status} />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-base-content/70">Payment Status</span>
                    <PaymentStatusBadge status={order.payment_status} />
                  </div>
                  {order.payment_method && (
                    <div className="flex justify-between items-center">
                      <span className="text-base-content/70">Payment Method</span>
                      <span className="capitalize">{order.payment_method.replace("_", " ")}</span>
                    </div>
                  )}
                  {order.payment_due_date && (
                    <div className="flex justify-between items-center">
                      <span className="text-base-content/70">Due Date</span>
                      <span>{formatDate(order.payment_due_date)}</span>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>

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
                discount={order.discount_amount ? Number(order.discount_amount) : undefined}
                total={Number(order.total_amount)}
              />
            </CardContent>
          </Card>

          {/* Quick actions */}
          {!editing && (
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {order.status !== ORDER_STATUS.SHIPPED && (
                  <Button
                    variant="outline"
                    fullWidth
                    leftIcon={<Truck className="h-4 w-4" />}
                    onClick={async () => {
                      const response = await updateOrders(order.id!, {
                        status: ORDER_STATUS.SHIPPED,
                        ship_date: new Date(),
                      });
                      if (response.success) {
                        toast.success("Order marked as shipped");
                        refresh();
                      }
                    }}
                  >
                    Mark as Shipped
                  </Button>
                )}
                {order.status !== ORDER_STATUS.DELIVERED && (
                  <Button
                    variant="outline"
                    fullWidth
                    leftIcon={<CheckCircle className="h-4 w-4" />}
                    onClick={async () => {
                      const response = await updateOrders(order.id!, {
                        status: ORDER_STATUS.DELIVERED,
                        delivery_date: new Date(),
                      });
                      if (response.success) {
                        toast.success("Order marked as delivered");
                        refresh();
                      }
                    }}
                  >
                    Mark as Delivered
                  </Button>
                )}
                {order.status !== ORDER_STATUS.CANCELLED && (
                  <Button
                    variant="ghost"
                    fullWidth
                    leftIcon={<XCircle className="h-4 w-4" />}
                    className="text-error hover:bg-error/10"
                    onClick={async () => {
                      if (!confirm("Are you sure you want to cancel this order?")) return;
                      const response = await updateOrders(order.id!, {
                        status: ORDER_STATUS.CANCELLED,
                        cancelled_date: new Date(),
                      });
                      if (response.success) {
                        toast.success("Order cancelled");
                        refresh();
                      }
                    }}
                  >
                    Cancel Order
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

