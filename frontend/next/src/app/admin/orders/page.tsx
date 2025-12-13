"use client";

import { useState } from "react";
import { Search, Filter } from "lucide-react";
import { AdminOrdersTable } from "@/components/admin/AdminOrdersTable";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Card, CardContent } from "@/components/ui/Card";
import { useAdminOrders } from "@/hooks/useAdmin";
import { updateOrders } from "@/actions/orders";
import { ORDER_STATUS } from "@/lib/constants";
import { useToast } from "@/providers/ToastProvider";

const statusOptions = [
  { value: "", label: "All Statuses" },
  { value: ORDER_STATUS.PENDING, label: "Pending" },
  { value: ORDER_STATUS.CONFIRMED, label: "Confirmed" },
  { value: ORDER_STATUS.PROCESSING, label: "Processing" },
  { value: ORDER_STATUS.SHIPPED, label: "Shipped" },
  { value: ORDER_STATUS.DELIVERED, label: "Delivered" },
  { value: ORDER_STATUS.CANCELLED, label: "Cancelled" },
];

export default function AdminOrdersPage() {
  const toast = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const { orders, loading, statusFilter, setStatusFilter, refresh } = useAdminOrders();

  // Filter orders by search query (client-side)
  const filteredOrders = searchQuery
    ? orders.filter(
        (o) =>
          o.order_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          o.shipping_company_name?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : orders;

  const handleUpdateStatus = async (orderId: string, status: string) => {
    const response = await updateOrders(orderId, { status });
    if (response.success) {
      toast.success(`Order status updated to ${status}`);
      refresh();
    } else {
      toast.error(response.error || "Failed to update order status");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Orders</h1>
        <p className="text-base-content/60 mt-1">
          Manage and process customer orders
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by order number or customer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="h-5 w-5" />}
              />
            </div>
            <Select
              options={statusOptions}
              value={statusFilter || ""}
              onChange={(e) => setStatusFilter(e.target.value || null)}
              className="w-full sm:w-48"
            />
          </div>
        </CardContent>
      </Card>

      {/* Orders table */}
      <AdminOrdersTable
        orders={filteredOrders}
        loading={loading}
        onUpdateStatus={handleUpdateStatus}
      />

      {/* Results count */}
      {!loading && (
        <p className="text-sm text-base-content/60 text-center">
          Showing {filteredOrders.length} order{filteredOrders.length !== 1 ? "s" : ""}
        </p>
      )}
    </div>
  );
}

