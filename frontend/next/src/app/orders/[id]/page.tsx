"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@auth0/nextjs-auth0/client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Button,
  Loading,
} from "@/components/ui";
import {
  mockOrders,
  formatCurrency,
  formatDate,
  getOrderStatusColor,
  getPaymentStatusColor,
} from "@/lib/mock-data";
import {
  FiPackage,
  FiTruck,
  FiMapPin,
  FiCreditCard,
  FiDownload,
} from "react-icons/fi";
import Link from "next/link";

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isLoading: userLoading } = useUser();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!userLoading && !user) {
      router.push("/api/auth/login");
    }
  }, [user, userLoading, router]);

  const order = mockOrders.find((o) => o.id === params?.id);

  if (userLoading) {
    return <Loading text="Loading order..." />;
  }

  if (!user) {
    return null;
  }

  if (!order) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardContent className="text-center py-12">
            <h2 className="text-2xl font-bold text-neutral mb-4">
              Order Not Found
            </h2>
            <p className="text-neutral-content mb-6">
              The order you're looking for doesn't exist.
            </p>
            <Link href="/orders">
              <Button variant="primary">View All Orders</Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/orders"
          className="text-sm text-neutral-content hover:underline mb-2 inline-block"
        >
          ← Back to Orders
        </Link>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-neutral font-serif mb-2">
              {order.order_number}
            </h1>
            <p className="text-base-content">
              Placed on {formatDate(order.order_date)}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="primary">
              <FiDownload className="w-4 h-4 mr-2" />
              Download Invoice
            </Button>
            {order.tracking_number && (
              <Button variant="primary">
                <FiTruck className="w-4 h-4 mr-2" />
                Track Shipment
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Status */}
          <Card>
            <CardHeader>
              <CardTitle>Order Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-neutral-content mb-2">
                    Order Status
                  </p>
                  <Badge
                    variant={getOrderStatusColor(order.status) as any}
                    size="md"
                  >
                    {order.status}
                  </Badge>
                </div>

                <div>
                  <p className="text-sm text-neutral-content mb-2">
                    Payment Status
                  </p>
                  <Badge
                    variant={getPaymentStatusColor(order.payment_status) as any}
                    size="md"
                  >
                    {order.payment_status}
                  </Badge>
                </div>

                {order.ship_date && (
                  <div>
                    <p className="text-sm text-neutral-content mb-1">
                      Ship Date
                    </p>
                    <p className="font-medium text-neutral">
                      {formatDate(order.ship_date)}
                    </p>
                  </div>
                )}

                {order.delivery_date && (
                  <div>
                    <p className="text-sm text-neutral-content mb-1">
                      Delivered
                    </p>
                    <p className="font-medium text-neutral">
                      {formatDate(order.delivery_date)}
                    </p>
                  </div>
                )}
              </div>

              {order.tracking_number && (
                <div className="mt-4 p-4 bg-info/10 rounded-lg">
                  <p className="text-sm text-neutral-content mb-1">
                    Tracking Number
                  </p>
                  <p className="font-mono font-semibold text-neutral">
                    {order.tracking_number}
                  </p>
                  {order.carrier && (
                    <p className="text-sm text-base-content mt-1">
                      Carrier: {order.carrier}
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Mock items - in real app, fetch from order_items */}
                <div className="flex items-center gap-4 pb-4 border-b border-base-300">
                  <div className="w-20 h-20 bg-base-200 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FiPackage className="w-8 h-8 text-neutral-content" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-neutral mb-1">
                      Sample Product
                    </h4>
                    <p className="text-sm text-neutral-content">
                      SKU: LP-SAMPLE-001
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-neutral-content">Qty: 12</p>
                    <p className="font-semibold text-neutral">
                      {formatCurrency(33.0)}
                    </p>
                  </div>
                </div>

                <div className="pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-content">Subtotal</span>
                    <span className="font-medium text-neutral">
                      {formatCurrency(order.subtotal)}
                    </span>
                  </div>

                  {order.shipping_cost && (
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-content">Shipping</span>
                      <span className="font-medium text-neutral">
                        {formatCurrency(order.shipping_cost)}
                      </span>
                    </div>
                  )}

                  {order.discount_amount && order.discount_amount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-success">Discount</span>
                      <span className="font-medium text-success">
                        -{formatCurrency(order.discount_amount)}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between pt-4 border-t border-base-300">
                    <span className="font-semibold text-lg text-neutral">
                      Total
                    </span>
                    <span className="font-bold text-2xl text-neutral">
                      {formatCurrency(order.total_amount)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          {(order.customer_notes || order.internal_notes) && (
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                {order.customer_notes && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-neutral mb-1">
                      Your Notes
                    </p>
                    <p className="text-sm text-base-content">
                      {order.customer_notes}
                    </p>
                  </div>
                )}
                {order.internal_notes && (
                  <div>
                    <p className="text-sm font-medium text-neutral mb-1">
                      Internal Notes
                    </p>
                    <p className="text-sm text-base-content">
                      {order.internal_notes}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <FiMapPin className="w-5 h-5 text-primary" />
                <CardTitle>Shipping Address</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm">
                {order.shipping_company_name && (
                  <p className="font-medium text-neutral">
                    {order.shipping_company_name}
                  </p>
                )}
                <p className="text-base-content">{order.shipping_address_1}</p>
                {order.shipping_address_2 && (
                  <p className="text-base-content">
                    {order.shipping_address_2}
                  </p>
                )}
                <p className="text-base-content">
                  {order.shipping_city}, {order.shipping_state}{" "}
                  {order.shipping_postal_code}
                </p>
                <p className="text-base-content">{order.shipping_country}</p>
                {order.shipping_phone && (
                  <p className="text-base-content mt-2">
                    {order.shipping_phone}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Payment Information */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <FiCreditCard className="w-5 h-5 text-primary" />
                <CardTitle>Payment Information</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-neutral-content mb-1">Payment Method</p>
                  <p className="font-medium text-neutral">
                    {order.payment_method}
                  </p>
                </div>

                {order.payment_due_date && (
                  <div>
                    <p className="text-neutral-content mb-1">Payment Due</p>
                    <p className="font-medium text-neutral">
                      {formatDate(order.payment_due_date)}
                    </p>
                  </div>
                )}

                <div>
                  <p className="text-neutral-content mb-1">Payment Status</p>
                  <Badge
                    variant={getPaymentStatusColor(order.payment_status) as any}
                  >
                    {order.payment_status}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Need Help */}
          <Card className="bg-base-100">
            <CardContent>
              <h3 className="font-semibold text-neutral mb-2">Need Help?</h3>
              <p className="text-sm text-base-content mb-4">
                Have questions about this order? Our support team is here to
                help.
              </p>
              <Link href="/contact">
                <Button variant="primary" size="sm" fullWidth>
                  Contact Support
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
