"use client";

import { Search } from "lucide-react";
import { AdminCustomersTable } from "@/components/admin/AdminCustomersTable";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Card, CardContent } from "@/components/ui/Card";
import { useAdminCustomers } from "@/hooks/useAdmin";
import { updateCustomers } from "@/actions/customers";
import { useToast } from "@/providers/ToastProvider";
import { ACCOUNT_STATUS } from "@/lib/constants";

const statusOptions = [
  { value: "", label: "All Statuses" },
  { value: ACCOUNT_STATUS.ACTIVE, label: "Active" },
  { value: ACCOUNT_STATUS.PENDING, label: "Pending" },
  { value: ACCOUNT_STATUS.SUSPENDED, label: "Suspended" },
];

export default function AdminCustomersPage() {
  const toast = useToast();
  const {
    customers,
    loading,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    refresh,
  } = useAdminCustomers();

  const handleUpdateStatus = async (customerId: string, status: string) => {
    const response = await updateCustomers(customerId, {
      account_status: status,
    });
    if (response.success) {
      toast.success(`Customer status updated to ${status}`);
      refresh();
    } else {
      toast.error(response.error || "Failed to update customer status");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Customers</h1>
        <p className="text-base-content/60 mt-1">
          Manage wholesale customer accounts
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by business name, email, or contact..."
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

      {/* Customers table */}
      <AdminCustomersTable
        customers={customers}
        loading={loading}
        onUpdateStatus={handleUpdateStatus}
      />

      {/* Results count */}
      {!loading && (
        <p className="text-sm text-base-content/60 text-center">
          Showing {customers.length} customer{customers.length !== 1 ? "s" : ""}
        </p>
      )}
    </div>
  );
}
