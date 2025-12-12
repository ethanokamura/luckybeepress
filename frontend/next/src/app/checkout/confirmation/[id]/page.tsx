"use client";

import { use } from "react";
import { OrderConfirmation } from "@/components/checkout/OrderConfirmation";
import { Skeleton } from "@/components/ui/Skeleton";
import { useOrder } from "@/hooks/useOrders";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

interface ConfirmationPageProps {
  params: Promise<{ id: string }>;
}

export default function ConfirmationPage({ params }: ConfirmationPageProps) {
  const { id } = use(params);
  const { order, loading, error } = useOrder(id);

  if (loading) {
    return (
      <main className="min-h-screen bg-base-100">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto">
            <div className="flex justify-center mb-6">
              <Skeleton variant="circular" width={80} height={80} />
            </div>
            <Skeleton variant="text" className="h-8 w-3/4 mx-auto mb-4" />
            <Skeleton variant="text" className="h-4 w-1/2 mx-auto mb-8" />
            <Skeleton variant="rectangular" className="h-64 rounded-xl" />
          </div>
        </div>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="min-h-screen bg-base-100">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
          <p className="text-base-content/60 mb-8">
            We couldn&apos;t find the order you&apos;re looking for.
          </p>
          <Link href="/account/orders">
            <Button variant="primary">View All Orders</Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-base-100">
      <div className="container mx-auto px-4 py-16">
        <OrderConfirmation order={order} />
      </div>
    </main>
  );
}

