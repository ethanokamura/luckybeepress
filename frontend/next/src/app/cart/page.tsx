"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Trash2 } from "lucide-react";
import { CartItem, CartItemSkeleton } from "@/components/cart/CartItem";
import { CartSummary } from "@/components/cart/CartSummary";
import { EmptyCart } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { useCartContext } from "@/providers/CartProvider";

export default function CartPage() {
  const {
    items,
    totals,
    shippingEstimates,
    loading,
    itemLoading,
    incrementItem,
    decrementItem,
    removeItem,
    clearCart,
    canCheckout,
    checkoutBlockReason,
  } = useCartContext();

  const [selectedShipping, setSelectedShipping] = useState<string>("standard");
  const [clearing, setClearing] = useState(false);

  const handleClearCart = async () => {
    if (confirm("Are you sure you want to clear your cart?")) {
      setClearing(true);
      await clearCart();
      setClearing(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-base-100">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-8">Your Cart</h1>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-6">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <CartItemSkeleton key={i} />
                  ))}
                </CardContent>
              </Card>
            </div>
            <div>
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4 animate-pulse">
                    <div className="h-4 bg-base-200 rounded w-full" />
                    <div className="h-2 bg-base-200 rounded w-full" />
                    <div className="h-4 bg-base-200 rounded w-3/4" />
                    <div className="h-12 bg-base-200 rounded w-full mt-4" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-base-100">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-8">Your Cart</h1>
          <Card>
            <CardContent className="py-16">
              <EmptyCart
                onBrowse={() => (window.location.href = "/products")}
              />
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-base-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Your Cart</h1>
            <p className="text-base-content/60 mt-1">
              {items.length} {items.length === 1 ? "item" : "items"}
            </p>
          </div>

          <Button
            variant="ghost"
            size="sm"
            leftIcon={<Trash2 className="h-4 w-4" />}
            onClick={handleClearCart}
            loading={clearing}
          >
            Clear Cart
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart items */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                {items.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onIncrement={() => item.id && incrementItem(item.id)}
                    onDecrement={() => item.id && decrementItem(item.id)}
                    onRemove={() => item.id && removeItem(item.id)}
                    loading={itemLoading === item.id}
                  />
                ))}
              </CardContent>
            </Card>

            {/* Continue shopping link */}
            <Link
              href="/products"
              className="inline-flex items-center gap-2 mt-4 text-sm text-primary hover:underline"
            >
              <ArrowLeft className="h-4 w-4" />
              Continue Shopping
            </Link>
          </div>

          {/* Summary sidebar */}
          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <CartSummary
                  totals={totals}
                  shippingEstimates={shippingEstimates}
                  selectedShipping={selectedShipping}
                  onShippingSelect={setSelectedShipping}
                  showShipping
                />

                {/* Checkout button */}
                <div className="mt-6 space-y-3">
                  {!canCheckout && checkoutBlockReason && (
                    <p className="text-sm text-warning text-center">
                      {checkoutBlockReason}
                    </p>
                  )}

                  <Button
                    variant="primary"
                    fullWidth
                    size="lg"
                    disabled={!canCheckout}
                    rightIcon={<ArrowRight className="h-4 w-4" />}
                    onClick={() => (window.location.href = "/checkout")}
                  >
                    Proceed to Checkout
                  </Button>
                </div>

                {/* Trust indicators */}
                <div className="mt-6 pt-6 border-t border-base-300">
                  <div className="space-y-2 text-sm text-base-content/60">
                    <p className="flex items-center gap-2">
                      <span className="text-success">✓</span>
                      Secure checkout
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="text-success">✓</span>
                      Premium quality products
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="text-success">✓</span>
                      17+ years trusted seller
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}

