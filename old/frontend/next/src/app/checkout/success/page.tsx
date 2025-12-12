"use client";

import Link from "next/link";
import { Button, Card, CardContent } from "@/components/ui";
import { FiCheckCircle, FiPackage, FiMail } from "react-icons/fi";

export default function CheckoutSuccessPage() {
  const orderNumber = `ORD-${new Date().getFullYear()}-${Math.random()
    .toString(36)
    .substring(2, 8)
    .toUpperCase()}`;

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Card>
        <CardContent className="text-center py-12">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-success/20 rounded-full flex items-center justify-center">
              <FiCheckCircle className="w-12 h-12 text-success" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-neutral font-serif mb-3">
            Order Placed Successfully!
          </h1>

          <p className="text-lg text-base-content mb-2">
            Thank you for your order
          </p>

          <p className="text-2xl font-bold text-primary mb-8">{orderNumber}</p>

          <div className="max-w-md mx-auto mb-8 space-y-4 text-left">
            <div className="flex items-start space-x-3 p-4 bg-base-200 rounded-lg">
              <FiMail className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-neutral mb-1">
                  Confirmation Email Sent
                </p>
                <p className="text-sm text-base-content">
                  We've sent you an order confirmation email with all the
                  details and your invoice.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 bg-base-200 rounded-lg">
              <FiPackage className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-neutral mb-1">
                  Order Processing
                </p>
                <p className="text-sm text-base-content">
                  Your order is being prepared for shipment. You'll receive a
                  tracking number once it ships.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/orders">
              <Button variant="primary" size="lg">
                View Order Details
              </Button>
            </Link>
            <Link href="/products">
              <Button variant="outline" size="lg">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
