"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@auth0/nextjs-auth0/client";
import { Card, CardContent, Badge, Select, Loading } from "@/components/ui";
import { BadgeVariant } from "@/components/ui/Badge";
import {
  mockOrders,
  formatCurrency,
  formatDate,
  getOrderStatusColor,
} from "@/lib/mock-data";
import { Orders } from "@/types/orders";
import Link from "next/link";

export default function OrdersPage() {
  const router = useRouter();
  const { user, isLoading: userLoading } = useUser();
  const [statusFilter, setStatusFilter] = useState("all");

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!userLoading && !user) {
      router.push("/api/auth/login");
    }
  }, [user, userLoading, router]);

  if (userLoading) {
    return <Loading text="Loading orders..." />;
  }

  if (!user) {
    return null;
  }

  // Filter orders
  const filteredOrders =
    statusFilter === "all"
      ? mockOrders
      : mockOrders.filter((order) => order.status === statusFilter);

  const statusOptions = [
    { value: "all", label: "All Orders" },
    { value: "pending", label: "Pending" },
    { value: "processing", label: "Processing" },
    { value: "shipped", label: "Shipped" },
    { value: "delivered", label: "Delivered" },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-neutral font-serif mb-2">
          Order History
        </h1>
        <p className="text-base-content">
          View and track all your wholesale orders
        </p>
      </div>

      {/* Filter */}
      <div className="mb-6 max-w-xs">
        <Select
          label="Filter by Status"
          options={statusOptions}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        />
      </div>

      {/* Orders List */}
      <div className="flex flex-col gap-2">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <Link key={order.id} href={`/orders/${order.id}`}>
              <Card hover>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {/* Order Number & Date */}
                    <div className="md:col-span-2">
                      <p className="font-semibold text-lg text-neutral mb-1">
                        {order.order_number}
                      </p>
                      <p className="text-sm text-neutral-content">
                        Ordered: {formatDate(order.order_date)}
                      </p>
                      {order.ship_date && (
                        <p className="text-sm text-neutral-content">
                          Shipped: {formatDate(order.ship_date)}
                        </p>
                      )}
                    </div>

                    {/* Shipping Info */}
                    <div>
                      <p className="text-sm text-neutral-content mb-1">
                        Ship To
                      </p>
                      <p className="font-medium text-neutral">
                        {order.shipping_company_name}
                      </p>
                      <p className="text-sm text-base-content">
                        {order.shipping_city}, {order.shipping_state}
                      </p>
                    </div>

                    {/* Status */}
                    <div>
                      <p className="text-sm text-neutral-content mb-2">
                        Status
                      </p>
                      <Badge
                        variant={
                          getOrderStatusColor(order.status) as BadgeVariant
                        }
                      >
                        {order.status}
                      </Badge>
                      {order.tracking_number && (
                        <p className="text-xs text-info mt-2">
                          Tracking available
                        </p>
                      )}
                    </div>

                    {/* Total */}
                    <div className="text-right">
                      <p className="text-sm text-neutral-content mb-1">Total</p>
                      <p className="text-2xl font-bold text-neutral">
                        {formatCurrency(order.total_amount)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-neutral-content">
                No orders found matching your filter.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
