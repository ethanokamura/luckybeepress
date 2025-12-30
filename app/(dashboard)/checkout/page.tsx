"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { formatPrice, generateOrderNumber } from "@/lib/firebase-helpers";
import { AuthGuard } from "@/components/shared/AuthGuard";
import { AddressForm } from "@/components/shared/AddressForm";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import type { Cart, OrderAddress, OrderItem } from "@/types";

export default function CheckoutPage() {
  const { firebaseUser } = useAuth();
  const router = useRouter();

  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState<"shipping" | "billing" | "review">(
    "shipping"
  );
  const [shippingAddress, setShippingAddress] = useState<OrderAddress | null>(
    null
  );
  const [billingAddress, setBillingAddress] = useState<OrderAddress | null>(
    null
  );
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const fetchCart = async () => {
      if (!firebaseUser) {
        setLoading(false);
        return;
      }

      try {
        const cartRef = doc(db, "carts", firebaseUser.uid);
        const cartSnap = await getDoc(cartRef);
        if (cartSnap.exists()) {
          setCart({ id: cartSnap.id, ...cartSnap.data() } as Cart);
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [firebaseUser]);

  const handleShippingSubmit = (address: OrderAddress) => {
    setShippingAddress(address);
    if (sameAsShipping) {
      setBillingAddress(address);
      setStep("review");
    } else {
      setStep("billing");
    }
  };

  const handleBillingSubmit = (address: OrderAddress) => {
    setBillingAddress(address);
    setStep("review");
  };

  const handlePlaceOrder = async () => {
    if (!firebaseUser || !cart || !shippingAddress || !billingAddress) return;

    setSubmitting(true);
    try {
      const orderNumber = generateOrderNumber();
      const orderId = `${firebaseUser.uid}-${Date.now()}`;

      const orderItems: OrderItem[] = cart.items.map((item) => ({
        productId: item.productId,
        variantId: item.variantId,
        name: item.name,
        sku: null,
        image: item.image,
        price: item.price,
        quantity: item.quantity,
        total: item.price * item.quantity,
      }));

      // Calculate totals (simplified - no tax/shipping for now)
      const subtotal = cart.subtotal;
      const shippingCost = 0; // Free shipping or calculate based on weight
      const tax = 0; // Calculate based on address
      const discount = cart.discount;
      const total = subtotal + shippingCost + tax - discount;

      const order = {
        orderNumber,
        userId: firebaseUser.uid,
        userEmail: firebaseUser.email || "",
        status: "pending",
        paymentStatus: "pending",
        items: orderItems,
        shippingAddress,
        billingAddress,
        subtotal,
        shippingCost,
        tax,
        discount,
        total,
        paymentMethod: "card",
        paymentIntentId: null,
        shipping: null,
        notes: notes || null,
        adminNotes: null,
        paidAt: null,
        cancelledAt: null,
        refundedAt: null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      // Create order
      await setDoc(doc(db, "orders", orderId), order);

      // Clear cart
      await deleteDoc(doc(db, "carts", firebaseUser.uid));

      // Redirect to order confirmation
      router.push(`/orders/${orderId}?new=true`);
    } catch (error) {
      console.error("Error placing order:", error);
      alert("There was an error placing your order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <AuthGuard requireAuth requireApproval>
        <div className="max-w-4xl mx-auto">
          <div className="h-8 bg-muted animate-pulse rounded w-32 mb-8" />
          <div className="h-64 bg-muted animate-pulse rounded-lg" />
        </div>
      </AuthGuard>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <AuthGuard requireAuth requireApproval>
        <div className="max-w-4xl mx-auto text-center py-16">
          <span className="text-4xl mb-4 block">🐝</span>
          <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
          <p className="text-muted-foreground mb-6">
            Add some products to your cart before checking out.
          </p>
          <Button onClick={() => router.push("/products")}>
            Browse Products
          </Button>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard requireAuth requireApproval>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-8">Checkout</h1>

        {/* Progress Steps */}
        <div className="flex items-center gap-4 mb-8">
          {["shipping", "billing", "review"].map((s, index) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step === s
                    ? "bg-primary text-primary-foreground"
                    : index < ["shipping", "billing", "review"].indexOf(step)
                    ? "bg-green-500 text-white"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {index + 1}
              </div>
              <span className="ml-2 text-sm font-medium capitalize hidden sm:inline">
                {s === "billing" && sameAsShipping ? "Billing (Same)" : s}
              </span>
              {index < 2 && (
                <div className="w-8 h-0.5 bg-muted mx-4 hidden sm:block" />
              )}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form Area */}
          <div className="lg:col-span-2">
            {step === "shipping" && (
              <div className="bg-card border rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4">Shipping Address</h2>
                <div className="mb-4">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={sameAsShipping}
                      onChange={(e) => setSameAsShipping(e.target.checked)}
                      className="rounded"
                    />
                    Billing address same as shipping
                  </label>
                </div>
                <AddressForm
                  onSubmit={handleShippingSubmit}
                  submitLabel="Continue"
                />
              </div>
            )}

            {step === "billing" && (
              <div className="bg-card border rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4">Billing Address</h2>
                <AddressForm
                  onSubmit={handleBillingSubmit}
                  onCancel={() => setStep("shipping")}
                  submitLabel="Continue to Review"
                />
              </div>
            )}

            {step === "review" && (
              <div className="space-y-6">
                {/* Addresses Review */}
                <div className="bg-card border rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-bold">Shipping Address</h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setStep("shipping")}
                    >
                      Edit
                    </Button>
                  </div>
                  {shippingAddress && (
                    <div className="text-sm text-muted-foreground">
                      <p>
                        {shippingAddress.firstName} {shippingAddress.lastName}
                      </p>
                      {shippingAddress.company && (
                        <p>{shippingAddress.company}</p>
                      )}
                      <p>{shippingAddress.street1}</p>
                      {shippingAddress.street2 && (
                        <p>{shippingAddress.street2}</p>
                      )}
                      <p>
                        {shippingAddress.city}, {shippingAddress.state}{" "}
                        {shippingAddress.postalCode}
                      </p>
                      <p>{shippingAddress.country}</p>
                    </div>
                  )}
                </div>

                {/* Order Notes */}
                <div className="bg-card border rounded-lg p-6">
                  <h2 className="text-xl font-bold mb-4">
                    Order Notes (Optional)
                  </h2>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add any special instructions or notes for your order..."
                    className="w-full px-3 py-2 rounded-md border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary min-h-[100px]"
                  />
                </div>

                {/* Items Review */}
                <div className="bg-card border rounded-lg p-6">
                  <h2 className="text-xl font-bold mb-4">Order Items</h2>
                  <div className="space-y-3">
                    {cart.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center py-2 border-b last:border-0"
                      >
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Qty: {item.quantity} × {formatPrice(item.price)}
                          </p>
                        </div>
                        <span className="font-medium">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Place Order */}
                <Button
                  size="lg"
                  className="w-full"
                  onClick={handlePlaceOrder}
                  disabled={submitting}
                >
                  {submitting ? "Placing Order..." : "Place Order"}
                </Button>
                <p className="text-xs text-center text-muted-foreground mt-2">
                  By placing your order, you agree to our terms and conditions.
                  Payment will be arranged separately.
                </p>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-card border rounded-lg p-6 sticky top-24">
              <h2 className="text-lg font-bold mb-4">Order Summary</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Subtotal ({cart.itemCount} items)
                  </span>
                  <span>{formatPrice(cart.subtotal)}</span>
                </div>
                {cart.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-{formatPrice(cart.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
              </div>
              <div className="border-t mt-4 pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>{formatPrice(cart.subtotal - cart.discount)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
