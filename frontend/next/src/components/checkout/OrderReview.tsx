"use client";

import { Package, MapPin, CreditCard, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { CartItem } from "@/components/cart/CartItem";
import { CheckoutSummary } from "@/components/cart/CartSummary";
import { AddressDisplay } from "./AddressForm";
import { PaymentMethodDisplay } from "./PaymentSelector";
import type { CartItemWithProduct } from "@/lib/cart-utils";
import type { Addresses } from "@/types/addresses";
import type { PaymentMethod } from "@/lib/constants";

interface OrderReviewProps {
  items: CartItemWithProduct[];
  subtotal: number;
  shipping: number;
  total: number;
  shippingAddress: Addresses | null;
  billingAddress: Addresses | null;
  paymentMethod: PaymentMethod | null;
  onEditShipping?: () => void;
  onEditBilling?: () => void;
  onEditPayment?: () => void;
  className?: string;
}

export function OrderReview({
  items,
  subtotal,
  shipping,
  total,
  shippingAddress,
  billingAddress,
  paymentMethod,
  onEditShipping,
  onEditBilling,
  onEditPayment,
  className = "",
}: OrderReviewProps) {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Order items */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Package className="h-5 w-5" />
            Order Items ({items.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-base-300">
            {items.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onIncrement={() => {}}
                onDecrement={() => {}}
                onRemove={() => {}}
                compact
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Shipping address */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <MapPin className="h-5 w-5" />
            Shipping Address
          </CardTitle>
          {onEditShipping && (
            <button
              onClick={onEditShipping}
              className="text-sm text-primary hover:underline"
            >
              Edit
            </button>
          )}
        </CardHeader>
        <CardContent>
          {shippingAddress ? (
            <AddressDisplay address={shippingAddress} />
          ) : (
            <p className="text-base-content/60 text-sm">No address selected</p>
          )}
        </CardContent>
      </Card>

      {/* Payment method */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <CreditCard className="h-5 w-5" />
            Payment Method
          </CardTitle>
          {onEditPayment && (
            <button
              onClick={onEditPayment}
              className="text-sm text-primary hover:underline"
            >
              Edit
            </button>
          )}
        </CardHeader>
        <CardContent>
          {paymentMethod ? (
            <PaymentMethodDisplay method={paymentMethod} />
          ) : (
            <p className="text-base-content/60 text-sm">
              No payment method selected
            </p>
          )}
        </CardContent>
      </Card>

      {/* Order summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Order Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <CheckoutSummary
            subtotal={subtotal}
            shipping={shipping}
            total={total}
          />
        </CardContent>
      </Card>

      {/* No returns policy */}
      <div className="flex items-start gap-3 p-4 rounded-lg bg-warning/10 border border-warning/20">
        <AlertTriangle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
        <div>
          <p className="font-medium text-warning">No Returns Policy</p>
          <p className="text-sm text-base-content/70 mt-1">
            All sales are final. Please review your order carefully before
            submitting. Contact us if you have any questions before placing your
            order.
          </p>
        </div>
      </div>
    </div>
  );
}
