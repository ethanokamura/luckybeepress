"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useCart } from "@/lib/cart-context";
import {
  Button,
  Card,
  CardContent,
  Input,
  Select,
  Loading,
  Badge,
} from "@/components/ui";
import { formatCurrency } from "@/lib/mock-data";
import { FiCheck, FiAlertCircle } from "react-icons/fi";

type Step = "shipping" | "payment" | "review";

export default function CheckoutPage() {
  const router = useRouter();
  const { user, isLoading: userLoading } = useUser();
  const { items, getTotalPrice, getTotalItems, clearCart } = useCart();

  const [currentStep, setCurrentStep] = useState<Step>("shipping");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Shipping form
  const [shippingForm, setShippingForm] = useState({
    companyName: "",
    contactName: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "USA",
    phone: "",
  });

  // Payment form
  const [paymentForm, setPaymentForm] = useState({
    method: "net30",
    poNumber: "",
    notes: "",
  });

  const [useSameForBilling, setUseSameForBilling] = useState(true);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!userLoading && !user) {
      router.push("/api/auth/login");
    }
  }, [user, userLoading, router]);

  // Redirect to cart if empty
  useEffect(() => {
    if (!userLoading && items.length === 0) {
      router.push("/cart");
    }
  }, [items, userLoading, router]);

  if (userLoading) {
    return <Loading text="Loading checkout..." />;
  }

  if (!user || items.length === 0) {
    return null;
  }

  const subtotal = getTotalPrice();
  const totalItems = getTotalItems();
  const shippingCost = subtotal >= 500 ? 0 : 25;
  const total = subtotal + shippingCost;

  const steps: { key: Step; label: string }[] = [
    { key: "shipping", label: "Shipping" },
    { key: "payment", label: "Payment" },
    { key: "review", label: "Review" },
  ];

  const currentStepIndex = steps.findIndex((s) => s.key === currentStep);

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep("payment");
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep("review");
  };

  const handlePlaceOrder = async () => {
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // TODO: Submit order to backend
    const orderData = {
      customer: user,
      items,
      shipping: shippingForm,
      payment: paymentForm,
      totals: {
        subtotal,
        shipping: shippingCost,
        total,
      },
    };

    console.log("Order placed:", orderData);

    // Clear cart and redirect to success page
    clearCart();
    router.push("/checkout/success");
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-4xl font-bold text-neutral font-serif mb-8">
        Checkout
      </h1>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-center space-x-4">
          {steps.map((step, index) => {
            const isActive = step.key === currentStep;
            const isCompleted = index < currentStepIndex;

            return (
              <div key={step.key} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center font-semibold
                      ${
                        isCompleted
                          ? "bg-success text-white"
                          : isActive
                          ? "bg-primary text-neutral"
                          : "bg-base-300 text-neutral-content"
                      }
                    `}
                  >
                    {isCompleted ? <FiCheck /> : index + 1}
                  </div>
                  <span
                    className={`
                      mt-2 text-sm font-medium
                      ${isActive ? "text-neutral" : "text-neutral-content"}
                    `}
                  >
                    {step.label}
                  </span>
                </div>

                {index < steps.length - 1 && (
                  <div
                    className={`
                      w-16 h-1 mx-4 mb-6
                      ${index < currentStepIndex ? "bg-success" : "bg-base-300"}
                    `}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Shipping Step */}
          {currentStep === "shipping" && (
            <Card>
              <CardContent>
                <h2 className="text-2xl font-bold text-neutral mb-6">
                  Shipping Information
                </h2>

                <form onSubmit={handleShippingSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Company Name"
                      className="bg-base-200"
                      required
                      fullWidth
                      value={shippingForm.companyName}
                      onChange={(e) =>
                        setShippingForm({
                          ...shippingForm,
                          companyName: e.target.value,
                        })
                      }
                    />

                    <Input
                      className="bg-base-200"
                      label="Contact Name"
                      required
                      fullWidth
                      value={shippingForm.contactName}
                      onChange={(e) =>
                        setShippingForm({
                          ...shippingForm,
                          contactName: e.target.value,
                        })
                      }
                    />
                  </div>

                  <Input
                    className="bg-base-200"
                    label="Address Line 1"
                    required
                    fullWidth
                    value={shippingForm.address1}
                    onChange={(e) =>
                      setShippingForm({
                        ...shippingForm,
                        address1: e.target.value,
                      })
                    }
                  />

                  <Input
                    className="bg-base-200"
                    label="Address Line 2"
                    fullWidth
                    value={shippingForm.address2}
                    onChange={(e) =>
                      setShippingForm({
                        ...shippingForm,
                        address2: e.target.value,
                      })
                    }
                    helperText="Suite, unit, building, floor, etc."
                  />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                      className="bg-base-200"
                      label="City"
                      required
                      fullWidth
                      value={shippingForm.city}
                      onChange={(e) =>
                        setShippingForm({
                          ...shippingForm,
                          city: e.target.value,
                        })
                      }
                    />

                    <Input
                      className="bg-base-200"
                      label="State"
                      required
                      fullWidth
                      value={shippingForm.state}
                      onChange={(e) =>
                        setShippingForm({
                          ...shippingForm,
                          state: e.target.value,
                        })
                      }
                    />

                    <Input
                      className="bg-base-200"
                      label="Postal Code"
                      required
                      fullWidth
                      value={shippingForm.postalCode}
                      onChange={(e) =>
                        setShippingForm({
                          ...shippingForm,
                          postalCode: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                      label="Country"
                      required
                      fullWidth
                      value={shippingForm.country}
                      onChange={(e) =>
                        setShippingForm({
                          ...shippingForm,
                          country: e.target.value,
                        })
                      }
                      options={[
                        { value: "USA", label: "United States" },
                        { value: "CAN", label: "Canada" },
                      ]}
                    />

                    <Input
                      className="bg-base-200"
                      label="Phone"
                      type="tel"
                      required
                      fullWidth
                      value={shippingForm.phone}
                      onChange={(e) =>
                        setShippingForm({
                          ...shippingForm,
                          phone: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="pt-6 border-t border-base-300">
                    <Button type="submit" variant="primary" size="lg">
                      Continue to Payment
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Payment Step */}
          {currentStep === "payment" && (
            <Card>
              <CardContent>
                <h2 className="text-2xl font-bold text-neutral mb-6">
                  Payment Terms
                </h2>

                <form onSubmit={handlePaymentSubmit} className="space-y-4">
                  <Select
                    label="Payment Method"
                    required
                    fullWidth
                    value={paymentForm.method}
                    onChange={(e) =>
                      setPaymentForm({ ...paymentForm, method: e.target.value })
                    }
                    options={[
                      {
                        value: "net30",
                        label: "Net 30 (Payment due in 30 days)",
                      },
                      {
                        value: "net60",
                        label: "Net 60 (Payment due in 60 days)",
                      },
                      {
                        value: "credit_card",
                        label: "Credit Card (Coming Soon)",
                      },
                    ]}
                  />

                  <Input
                    className="bg-base-200"
                    label="PO Number (Optional)"
                    fullWidth
                    value={paymentForm.poNumber}
                    onChange={(e) =>
                      setPaymentForm({
                        ...paymentForm,
                        poNumber: e.target.value,
                      })
                    }
                    helperText="Your internal purchase order number"
                  />

                  <Input
                    className="bg-base-200"
                    label="Order Notes (Optional)"
                    fullWidth
                    value={paymentForm.notes}
                    onChange={(e) =>
                      setPaymentForm({ ...paymentForm, notes: e.target.value })
                    }
                    helperText="Any special instructions for this order"
                  />

                  <div className="pt-6 border-t border-base-300 flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentStep("shipping")}
                    >
                      Back
                    </Button>
                    <Button type="submit" variant="primary" size="lg">
                      Review Order
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Review Step */}
          {currentStep === "review" && (
            <div className="space-y-6">
              <Card>
                <CardContent>
                  <h2 className="text-2xl font-bold text-neutral mb-4">
                    Review Your Order
                  </h2>

                  {/* Shipping Info */}
                  <div className="mb-6">
                    <h3 className="font-semibold text-neutral mb-2">
                      Shipping Address
                    </h3>
                    <div className="text-sm text-base-content">
                      <p>{shippingForm.companyName}</p>
                      <p>{shippingForm.contactName}</p>
                      <p>{shippingForm.address1}</p>
                      {shippingForm.address2 && <p>{shippingForm.address2}</p>}
                      <p>
                        {shippingForm.city}, {shippingForm.state}{" "}
                        {shippingForm.postalCode}
                      </p>
                      <p>{shippingForm.country}</p>
                      <p>{shippingForm.phone}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCurrentStep("shipping")}
                      className="mt-2"
                    >
                      Edit
                    </Button>
                  </div>

                  {/* Payment Info */}
                  <div className="pt-6 border-t border-base-300">
                    <h3 className="font-semibold text-neutral mb-2">
                      Payment Method
                    </h3>
                    <div className="text-sm text-base-content">
                      <p>
                        {paymentForm.method === "net30"
                          ? "Net 30 Terms"
                          : "Net 60 Terms"}
                      </p>
                      {paymentForm.poNumber && (
                        <p>PO #: {paymentForm.poNumber}</p>
                      )}
                      {paymentForm.notes && (
                        <p className="mt-2 text-neutral-content">
                          Notes: {paymentForm.notes}
                        </p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCurrentStep("payment")}
                      className="mt-2"
                    >
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Order Items */}
              <Card>
                <CardContent>
                  <h3 className="font-semibold text-neutral mb-4">
                    Order Items
                  </h3>
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div
                        key={item.product.id}
                        className="flex justify-between text-sm"
                      >
                        <div>
                          <p className="font-medium text-neutral">
                            {item.product.name}
                          </p>
                          <p className="text-neutral-content">
                            Qty: {item.quantity} ×{" "}
                            {formatCurrency(item.product.wholesale_price)}
                          </p>
                        </div>
                        <p className="font-medium text-neutral">
                          {formatCurrency(
                            item.product.wholesale_price * item.quantity
                          )}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep("payment")}
                  disabled={isSubmitting}
                >
                  Back
                </Button>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handlePlaceOrder}
                  loading={isSubmitting}
                  disabled={isSubmitting}
                  fullWidth
                >
                  Place Order
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardContent>
              <h3 className="text-lg font-bold text-neutral mb-4">
                Order Summary
              </h3>

              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-neutral-content">
                    Subtotal ({totalItems} items)
                  </span>
                  <span className="font-medium text-neutral">
                    {formatCurrency(subtotal)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-neutral-content">Shipping</span>
                  <span className="font-medium text-neutral">
                    {shippingCost === 0 ? (
                      <Badge variant="success" size="sm">
                        FREE
                      </Badge>
                    ) : (
                      formatCurrency(shippingCost)
                    )}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-base-300">
                <div className="flex justify-between items-baseline mb-4">
                  <span className="text-lg font-semibold text-neutral">
                    Total
                  </span>
                  <span className="text-2xl font-bold text-neutral">
                    {formatCurrency(total)}
                  </span>
                </div>

                <div className="p-3 bg-info/10 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <FiAlertCircle className="w-4 h-4 text-info shrink-0 mt-0.5" />
                    <p className="text-xs text-info">
                      Payment due date will be calculated based on your selected
                      terms after order confirmation.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
