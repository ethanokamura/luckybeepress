"use client";

import { CheckCircle, Package, Mail, ArrowRight, Printer } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { OrderTotal } from "@/components/ui/PriceDisplay";
import { formatDate, formatOrderNumber } from "@/lib/format";
import type { Orders } from "@/types/orders";

interface OrderConfirmationProps {
  order: Orders;
  className?: string;
}

export function OrderConfirmation({
  order,
  className = "",
}: OrderConfirmationProps) {
  return (
    <div className={`max-w-2xl mx-auto text-center ${className}`}>
      {/* Success icon */}
      <div className="flex justify-center mb-6">
        <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center">
          <CheckCircle className="h-10 w-10 text-success" />
        </div>
      </div>

      {/* Heading */}
      <h1 className="text-2xl md:text-3xl font-bold text-base-content mb-2">
        Thank You for Your Order!
      </h1>
      <p className="text-base-content/60 mb-8">
        Your order has been placed successfully. We&apos;ll send you an email
        confirmation shortly.
      </p>

      {/* Order details card */}
      <Card className="text-left mb-8">
        <CardContent className="p-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-base-content/60">Order Number</p>
              <p className="font-mono font-semibold">
                {formatOrderNumber(order.order_number)}
              </p>
            </div>
            <div>
              <p className="text-sm text-base-content/60">Order Date</p>
              <p className="font-medium">{formatDate(order.order_date)}</p>
            </div>
            <div>
              <p className="text-sm text-base-content/60">Payment Method</p>
              <p className="font-medium capitalize">
                {order.payment_method?.replace("_", " ") || "—"}
              </p>
            </div>
            <div>
              <p className="text-sm text-base-content/60">Status</p>
              <p className="font-medium capitalize">
                {order.status || "Pending"}
              </p>
            </div>
          </div>

          <div className="border-t border-base-300 mt-6 pt-6">
            <h3 className="font-semibold mb-4">Shipping To</h3>
            <div className="text-sm text-base-content/70">
              {order.shipping_company_name && (
                <p className="font-medium text-base-content">
                  {order.shipping_company_name}
                </p>
              )}
              <p>{order.shipping_address_1}</p>
              {order.shipping_address_2 && <p>{order.shipping_address_2}</p>}
              <p>
                {order.shipping_city}, {order.shipping_state}{" "}
                {order.shipping_postal_code}
              </p>
            </div>
          </div>

          <div className="border-t border-base-300 mt-6 pt-6">
            <OrderTotal
              subtotal={Number(order.subtotal)}
              shipping={
                order.shipping_cost ? Number(order.shipping_cost) : undefined
              }
              tax={order.tax_amount ? Number(order.tax_amount) : undefined}
              discount={
                order.discount_amount
                  ? Number(order.discount_amount)
                  : undefined
              }
              total={Number(order.total_amount)}
            />
          </div>
        </CardContent>
      </Card>

      {/* What's next */}
      <Card className="text-left mb-8 bg-base-200/50">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4">What Happens Next?</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                <Mail className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium">Order Confirmation Email</p>
                <p className="text-sm text-base-content/60">
                  You&apos;ll receive an email with your order details
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                <Package className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium">Order Processing</p>
                <p className="text-sm text-base-content/60">
                  We&apos;ll prepare your order within 1-2 business days
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                <ArrowRight className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium">Shipping Notification</p>
                <p className="text-sm text-base-content/60">
                  You&apos;ll receive tracking information when your order ships
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link href={`/account/orders/${order.id}`}>
          <Button
            variant="primary"
            rightIcon={<ArrowRight className="h-4 w-4" />}
          >
            View Order Details
          </Button>
        </Link>
        <Link href="/products">
          <Button variant="outline">Continue Shopping</Button>
        </Link>
      </div>

      {/* Print button */}
      <button
        onClick={() => window.print()}
        className="mt-6 text-sm text-base-content/60 hover:text-primary flex items-center gap-2 mx-auto"
      >
        <Printer className="h-4 w-4" />
        Print Confirmation
      </button>
    </div>
  );
}
