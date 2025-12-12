"use client";

import { use } from "react";
import { OrderDetail } from "@/components/account/OrderDetail";
import { Skeleton } from "@/components/ui/Skeleton";
import { useOrder } from "@/hooks/useOrders";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = use(params);
  const { order, loading, error } = useOrder(id);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton variant="text" className="h-4 w-32" />
        <div className="flex justify-between">
          <Skeleton variant="text" className="h-8 w-64" />
          <Skeleton variant="text" className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton variant="rectangular" className="h-64 rounded-xl" />
            <Skeleton variant="rectangular" className="h-48 rounded-xl" />
          </div>
          <div className="space-y-6">
            <Skeleton variant="rectangular" className="h-48 rounded-xl" />
            <Skeleton variant="rectangular" className="h-32 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="text-center py-16">
        <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
        <p className="text-base-content/60 mb-8">
          We couldn&apos;t find the order you&apos;re looking for.
        </p>
        <Link href="/account/orders">
          <Button variant="primary">View All Orders</Button>
        </Link>
      </div>
    );
  }

  return (
    <OrderDetail
      order={order}
      items={order.items}
      onReorder={() => alert("Reorder functionality coming soon!")}
    />
  );
}

