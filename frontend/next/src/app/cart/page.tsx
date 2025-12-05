"use client";

import { useRouter } from "next/navigation";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useCart } from "@/lib/cart-context";
import { Button, Card, CardContent, Input, Loading } from "@/components/ui";
import { formatCurrency } from "@/lib/mock-data";
import { FiTrash2, FiShoppingBag, FiArrowRight } from "react-icons/fi";
import Link from "next/link";
import { useEffect } from "react";
import Image from "next/image";

export default function CartPage() {
  const router = useRouter();
  const { user, isLoading: userLoading } = useUser();
  const { items, updateQuantity, removeItem, getTotalPrice, getTotalItems } =
    useCart();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!userLoading && !user) {
      router.push("/api/auth/login");
    }
  }, [user, userLoading, router]);

  if (userLoading) {
    return <Loading text="Loading cart..." />;
  }

  if (!user) {
    return null;
  }

  const subtotal = getTotalPrice();
  const totalItems = getTotalItems();
  const shippingCost = subtotal >= 500 ? 0 : 25;
  const total = subtotal + shippingCost;

  if (items.length === 0) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card>
          <CardContent className="text-center py-16">
            <FiShoppingBag className="w-24 h-24 mx-auto text-neutral-content mb-6" />
            <h2 className="text-2xl font-bold text-neutral mb-3">
              Your Cart is Empty
            </h2>
            <p className="text-base-content mb-8">
              Start adding products to your cart to create your wholesale order.
            </p>
            <Link href="/products">
              <Button variant="primary" size="lg">
                Browse Products
              </Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-4xl font-bold text-neutral font-serif mb-2">
        Shopping Cart
      </h1>
      <p className="text-base-content mb-8">
        {totalItems} {totalItems === 1 ? "item" : "items"} in your cart
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => {
            const minOrderQty = item.product.minimum_order_quantity || 1;
            const itemTotal = item.product.wholesale_price * item.quantity;

            return (
              <Card key={item.product.id}>
                <CardContent>
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="w-24 h-24 shrink-0 bg-base-200 rounded-lg overflow-hidden">
                      {item.product.image_url ? (
                        <Image
                          src={item.product.image_url ?? "/logo.svg"}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                          width={100}
                          height={100}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FiShoppingBag className="w-8 h-8 text-neutral-content" />
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <Link href={`/products/${item.product.id}`}>
                        <h3 className="font-semibold text-lg text-neutral hover:text-primary mb-1">
                          {item.product.name}
                        </h3>
                      </Link>
                      <p className="text-sm text-neutral-content mb-3">
                        SKU: {item.product.sku}
                      </p>

                      <div className="flex items-center gap-4">
                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-2">
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => {
                              const qty = parseInt(e.target.value);
                              if (!isNaN(qty) && qty >= minOrderQty) {
                                updateQuantity(item.product.id!, qty);
                              }
                            }}
                            min={minOrderQty}
                            className="w-20 text-center"
                          />
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() =>
                              updateQuantity(
                                item.product.id!,
                                Math.max(minOrderQty, item.quantity - 1)
                              )
                            }
                          >
                            -
                          </Button>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() =>
                              updateQuantity(
                                item.product.id!,
                                item.quantity + 1
                              )
                            }
                          >
                            +
                          </Button>
                        </div>

                        {/* Remove Button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.product.id!)}
                          className="text-error hover:bg-error/10"
                        >
                          <FiTrash2 className="w-4 h-4 mr-1" />
                          Remove
                        </Button>
                      </div>

                      <p className="text-xs text-neutral-content mt-2">
                        Minimum order: {minOrderQty} units
                      </p>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <p className="text-sm text-neutral-content mb-1">
                        {formatCurrency(item.product.wholesale_price)} each
                      </p>
                      <p className="text-xl font-bold text-neutral">
                        {formatCurrency(itemTotal)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardContent>
              <h2 className="text-xl font-bold text-neutral mb-4">
                Order Summary
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-base-content">
                  <span>Subtotal ({totalItems} items)</span>
                  <span className="font-medium">
                    {formatCurrency(subtotal)}
                  </span>
                </div>

                <div className="flex justify-between text-base-content">
                  <span>Shipping</span>
                  <span className="font-medium">
                    {shippingCost === 0 ? (
                      <span className="text-success">FREE</span>
                    ) : (
                      formatCurrency(shippingCost)
                    )}
                  </span>
                </div>

                {subtotal < 500 && subtotal > 0 && (
                  <p className="text-xs text-info">
                    Add {formatCurrency(500 - subtotal)} more for free shipping!
                  </p>
                )}

                <div className="pt-3 border-t border-base-300">
                  <div className="flex justify-between items-baseline">
                    <span className="text-lg font-semibold text-neutral">
                      Total
                    </span>
                    <span className="text-2xl font-bold text-neutral">
                      {formatCurrency(total)}
                    </span>
                  </div>
                </div>
              </div>

              <Link href="/checkout">
                <Button variant="primary" size="lg" fullWidth>
                  Proceed to Checkout
                  <FiArrowRight className="ml-2" />
                </Button>
              </Link>

              <Link href="/products">
                <Button variant="ghost" size="sm" fullWidth className="mt-3">
                  Continue Shopping
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
