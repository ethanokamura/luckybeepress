"use client";

import { RefreshCw } from "lucide-react";
import { AdminStatsCards, AdminQuickActions } from "@/components/admin/AdminStatsCards";
import { RecentOrdersCard } from "@/components/admin/AdminOrdersTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useAdminStats } from "@/hooks/useAdmin";

export default function AdminDashboardPage() {
  const { stats, loading, refresh } = useAdminStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-base-content/60 mt-1">
            Overview of your wholesale business
          </p>
        </div>
        <Button
          variant="outline"
          leftIcon={<RefreshCw className="h-4 w-4" />}
          onClick={refresh}
          loading={loading}
        >
          Refresh
        </Button>
      </div>

      {/* Stats cards */}
      <AdminStatsCards stats={stats} loading={loading} />

      {/* Quick actions */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <AdminQuickActions />
      </div>

      {/* Recent orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentOrdersCard orders={stats.recentOrders} loading={loading} />

        {/* Activity or Tips card */}
        <Card>
          <CardHeader>
            <CardTitle>Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-primary/10">
                <p className="font-medium text-primary">Review Pending Orders</p>
                <p className="text-sm text-base-content/60 mt-1">
                  Process orders promptly to maintain customer satisfaction.
                </p>
              </div>
              <div className="p-4 rounded-lg bg-warning/10">
                <p className="font-medium text-warning">Check Low Stock</p>
                <p className="text-sm text-base-content/60 mt-1">
                  Keep popular products in stock to avoid missed sales.
                </p>
              </div>
              <div className="p-4 rounded-lg bg-success/10">
                <p className="font-medium text-success">Net 30 Customers</p>
                <p className="text-sm text-base-content/60 mt-1">
                  Approve qualified customers for Net 30 terms after 3 orders.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

