"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import {
  CheckoutStepper,
  MobileStepper,
} from "@/components/checkout/CheckoutStepper";
import { AddressSelector } from "@/components/checkout/AddressSelector";
import { PaymentSelector } from "@/components/checkout/PaymentSelector";
import { OrderReview } from "@/components/checkout/OrderReview";
import { CartSummary } from "@/components/cart/CartSummary";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { useCartContext } from "@/providers/CartProvider";
import { useCustomer } from "@/hooks/useCustomer";
import { useAddresses } from "@/hooks/useAddresses";
import { useCreateOrder } from "@/hooks/useOrders";
import { createOrderItems } from "@/actions/order-items";
import type { PaymentMethod } from "@/lib/constants";
import { getCartItemVariant } from "@/lib/cart-utils";

const CHECKOUT_STEPS = [
  { id: "shipping", label: "Shipping" },
  { id: "payment", label: "Payment" },
  { id: "review", label: "Review" },
];

export default function CheckoutPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [shippingAddressId, setShippingAddressId] = useState<string | null>(
    null
  );
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(
    null
  );
  const [selectedShipping, setSelectedShipping] = useState<string>("standard");

  const {
    customerId,
    items,
    totals,
    shippingEstimates,
    loading: cartLoading,
    canCheckout,
    clearCart,
  } = useCartContext();

  const { customer, loading: customerLoading } = useCustomer({
    customerId,
  });

  const {
    shippingAddresses,
    defaultShippingAddress,
    loading: addressesLoading,
  } = useAddresses({
    customerId,
  });

  const {
    createOrder,
    loading: orderLoading,
    error: orderError,
  } = useCreateOrder();

  // Set default shipping address when loaded
  useMemo(() => {
    const setDefaultShippingAddress = () => {
      if (!shippingAddressId && defaultShippingAddress?.id) {
        setShippingAddressId(defaultShippingAddress.id);
      }
    };
    setDefaultShippingAddress();
  }, [defaultShippingAddress, shippingAddressId]);

  // Get selected address object
  const selectedShippingAddress = useMemo(
    () => shippingAddresses.find((a) => a.id === shippingAddressId) || null,
    [shippingAddresses, shippingAddressId]
  );

  // Get selected shipping estimate
  const selectedShippingEstimate = useMemo(
    () => shippingEstimates.find((e) => e.method === selectedShipping),
    [shippingEstimates, selectedShipping]
  );

  const shippingCost = selectedShippingEstimate?.rate || 0;
  const orderTotal = totals.subtotal + shippingCost;

  const isLoading = cartLoading || customerLoading || addressesLoading;

  // Step validation
  const canProceed = useMemo(() => {
    switch (currentStep) {
      case 0: // Shipping
        return Boolean(shippingAddressId);
      case 1: // Payment
        return Boolean(paymentMethod);
      case 2: // Review
        return (
          canCheckout && Boolean(shippingAddressId) && Boolean(paymentMethod)
        );
      default:
        return false;
    }
  }, [currentStep, shippingAddressId, paymentMethod, canCheckout]);

  const handleNext = () => {
    if (currentStep < CHECKOUT_STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handlePlaceOrder = async () => {
    if (!customerId || !selectedShippingAddress || !paymentMethod) {
      return;
    }

    // Generate order number
    const orderNumber = `LBP-${Date.now().toString(36).toUpperCase()}`;

    const order = await createOrder({
      order_number: orderNumber,
      customer_id: customerId,
      shipping_company_name: selectedShippingAddress.company_name || undefined,
      shipping_address_1: selectedShippingAddress.street_address_1,
      shipping_address_2: selectedShippingAddress.street_address_2 || undefined,
      shipping_city: selectedShippingAddress.city,
      shipping_state: selectedShippingAddress.state,
      shipping_postal_code: selectedShippingAddress.postal_code,
      shipping_country: selectedShippingAddress.country || "USA",
      subtotal: totals.subtotal,
      shipping_cost: shippingCost,
      total_amount: orderTotal,
      payment_method: paymentMethod,
      order_date: new Date(),
    });

    if (order?.id) {
      // Create order items from cart items
      const orderItemPromises = items.map((item) => {
        const quantity = Number(item.quantity);
        const unitPrice = Number(item.unit_price);
        const variant = getCartItemVariant(item);

        return createOrderItems({
          order_id: order.id!,
          product_id: item.product_id,
          photo_url: item.product?.image_url || "",
          sku: item.product?.sku || "",
          product_name: item.product?.name || "Unknown Product",
          quantity,
          variant,
          unit_wholesale_price: unitPrice,
          unit_retail_price: item.product?.suggested_retail_price
            ? Number(item.product.suggested_retail_price)
            : undefined,
          subtotal: quantity * unitPrice,
        });
      });

      // Wait for all order items to be created
      const orderItemResults = await Promise.all(orderItemPromises);

      // Check if any order items failed to create
      const failedItems = orderItemResults.filter((result) => !result.success);
      if (failedItems.length > 0) {
        console.error("Some order items failed to create:", failedItems);
        // Continue anyway - the order was created
      }

      // Clear the cart
      await clearCart();
      // Redirect to confirmation
      router.push(`/checkout/confirmation/${order.id}`);
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-base-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-base-content/60">Loading checkout...</p>
        </div>
      </main>
    );
  }

  if (!canCheckout || items.length === 0) {
    return (
      <main className="min-h-screen bg-base-100">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">
            Cannot Proceed to Checkout
          </h1>
          <p className="text-base-content/60 mb-8">
            Your cart is empty or doesn&apos;t meet the minimum order
            requirement.
          </p>
          <Link href="/products">
            <Button variant="primary">Browse Products</Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-base-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-sm text-base-content/60 hover:text-primary mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Cart
          </Link>
          <h1 className="text-2xl font-bold">Checkout</h1>
        </div>

        {/* Desktop stepper */}
        <div className="hidden md:block mb-8">
          <CheckoutStepper steps={CHECKOUT_STEPS} currentStep={currentStep} />
        </div>

        {/* Mobile stepper */}
        <div className="md:hidden mb-6">
          <MobileStepper
            currentStep={currentStep}
            totalSteps={CHECKOUT_STEPS.length}
            currentLabel={CHECKOUT_STEPS[currentStep].label}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            {/* Step 1: Shipping */}
            {currentStep === 0 && customerId && (
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Address</CardTitle>
                </CardHeader>
                <CardContent>
                  <AddressSelector
                    customerId={customerId}
                    type="shipping"
                    selectedAddressId={shippingAddressId}
                    onSelect={setShippingAddressId}
                  />
                </CardContent>
              </Card>
            )}

            {/* Step 2: Payment */}
            {currentStep === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                </CardHeader>
                <CardContent>
                  <PaymentSelector
                    customer={customer}
                    selectedMethod={paymentMethod}
                    onSelect={setPaymentMethod}
                  />
                </CardContent>
              </Card>
            )}

            {/* Step 3: Review */}
            {currentStep === 2 && (
              <OrderReview
                items={items}
                subtotal={totals.subtotal}
                shipping={shippingCost}
                total={orderTotal}
                shippingAddress={selectedShippingAddress}
                billingAddress={selectedShippingAddress}
                paymentMethod={paymentMethod}
                onEditShipping={() => setCurrentStep(0)}
                onEditPayment={() => setCurrentStep(1)}
              />
            )}

            {/* Navigation buttons */}
            <div className="flex items-center justify-between mt-6">
              <Button
                variant="ghost"
                onClick={handleBack}
                disabled={currentStep === 0}
                leftIcon={<ArrowLeft className="h-4 w-4" />}
              >
                Back
              </Button>

              {currentStep < CHECKOUT_STEPS.length - 1 ? (
                <Button
                  variant="primary"
                  onClick={handleNext}
                  disabled={!canProceed}
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  Continue
                </Button>
              ) : (
                <Button
                  variant="primary"
                  onClick={handlePlaceOrder}
                  disabled={!canProceed || orderLoading}
                  loading={orderLoading}
                >
                  Place Order
                </Button>
              )}
            </div>

            {orderError && (
              <p className="text-error text-sm mt-4 text-center">
                {orderError}
              </p>
            )}
          </div>

          {/* Sidebar summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <CartSummary
                  totals={totals}
                  shippingEstimates={shippingEstimates}
                  selectedShipping={selectedShipping}
                  onShippingSelect={setSelectedShipping}
                  showShipping={currentStep >= 0}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
