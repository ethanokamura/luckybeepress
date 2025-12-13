"use client";

import { use, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Edit,
  Save,
  Mail,
  Phone,
  Building,
  Calendar,
  CreditCard,
  Package,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Skeleton } from "@/components/ui/Skeleton";
import { AccountStatusBadge } from "@/components/ui/StatusBadge";
import { OrderCardCompact } from "@/components/account/OrderCard";
import { useCustomer } from "@/hooks/useCustomer";
import { useOrders } from "@/hooks/useOrders";
import { updateCustomers } from "@/actions/customers";
import { useToast } from "@/providers/ToastProvider";
import { formatCurrency, formatDate } from "@/lib/format";
import { ACCOUNT_STATUS } from "@/lib/constants";

interface CustomerDetailPageProps {
  params: Promise<{ id: string }>;
}

const statusOptions = [
  { value: ACCOUNT_STATUS.ACTIVE, label: "Active" },
  { value: ACCOUNT_STATUS.PENDING, label: "Pending" },
  { value: ACCOUNT_STATUS.SUSPENDED, label: "Suspended" },
];

const netTermsOptions = [
  { value: "0", label: "None (Credit Card Only)" },
  { value: "15", label: "Net 15" },
  { value: "30", label: "Net 30" },
  { value: "60", label: "Net 60" },
];

export default function AdminCustomerDetailPage({ params }: CustomerDetailPageProps) {
  const { id } = use(params);
  const toast = useToast();
  const { customer, loading, error, refresh } = useCustomer({ customerId: id });
  const { orders, loading: ordersLoading } = useOrders({ customerId: id, limit: 10 });

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editData, setEditData] = useState({
    account_status: "",
    net_terms: 0,
    discount_percentage: 0,
    notes: "",
  });

  const startEditing = () => {
    if (customer) {
      setEditData({
        account_status: customer.account_status || ACCOUNT_STATUS.ACTIVE,
        net_terms: customer.net_terms || 0,
        discount_percentage: Number(customer.discount_percentage) || 0,
        notes: customer.notes || "",
      });
      setEditing(true);
    }
  };

  const handleSave = async () => {
    if (!customer?.id) return;

    setSaving(true);
    try {
      const response = await updateCustomers(customer.id, {
        account_status: editData.account_status,
        net_terms: editData.net_terms,
        discount_percentage: editData.discount_percentage,
        notes: editData.notes || undefined,
      });

      if (response.success) {
        toast.success("Customer updated successfully");
        setEditing(false);
        refresh();
      } else {
        toast.error(response.error || "Failed to update customer");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton variant="text" className="h-8 w-48" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton variant="rectangular" className="h-48 rounded-xl" />
            <Skeleton variant="rectangular" className="h-64 rounded-xl" />
          </div>
          <div>
            <Skeleton variant="rectangular" className="h-64 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="text-center py-16">
        <h1 className="text-2xl font-bold mb-4">Customer Not Found</h1>
        <p className="text-base-content/60 mb-8">
          The customer you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link href="/admin/customers">
          <Button variant="primary">Back to Customers</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/admin/customers"
            className="inline-flex items-center gap-2 text-sm text-base-content/60 hover:text-primary mb-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Customers
          </Link>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            {customer.business_name}
            <AccountStatusBadge status={editing ? editData.account_status : customer.account_status} />
          </h1>
          {customer.contact_name && (
            <p className="text-base-content/60 mt-1">{customer.contact_name}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {editing ? (
            <>
              <Button variant="ghost" onClick={() => setEditing(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                leftIcon={<Save className="h-4 w-4" />}
                onClick={handleSave}
                loading={saving}
              >
                Save Changes
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              leftIcon={<Edit className="h-4 w-4" />}
              onClick={startEditing}
            >
              Edit Customer
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact info */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <Building className="h-5 w-5 text-base-content/60 mt-0.5" />
                  <div>
                    <p className="text-sm text-base-content/60">Business</p>
                    <p className="font-medium">{customer.business_name}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-base-content/60 mt-0.5" />
                  <div>
                    <p className="text-sm text-base-content/60">Email</p>
                    <a
                      href={`mailto:${customer.email}`}
                      className="font-medium text-primary hover:underline"
                    >
                      {customer.email}
                    </a>
                  </div>
                </div>

                {customer.phone && (
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-base-content/60 mt-0.5" />
                    <div>
                      <p className="text-sm text-base-content/60">Phone</p>
                      <a
                        href={`tel:${customer.phone}`}
                        className="font-medium text-primary hover:underline"
                      >
                        {customer.phone}
                      </a>
                    </div>
                  </div>
                )}

                {customer.first_order_date && (
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-base-content/60 mt-0.5" />
                    <div>
                      <p className="text-sm text-base-content/60">Customer Since</p>
                      <p className="font-medium">{formatDate(customer.first_order_date)}</p>
                    </div>
                  </div>
                )}
              </div>

              {customer.tax_id && (
                <div className="mt-4 pt-4 border-t border-base-300">
                  <p className="text-sm text-base-content/60">Tax ID / EIN</p>
                  <p className="font-mono">{customer.tax_id}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent orders */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Recent Orders
              </CardTitle>
              <Link href={`/admin/orders?customer=${customer.id}`}>
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {ordersLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} variant="rectangular" className="h-16 rounded-lg" />
                  ))}
                </div>
              ) : orders.length === 0 ? (
                <p className="text-center text-base-content/60 py-4">No orders yet</p>
              ) : (
                <div className="space-y-3">
                  {orders.slice(0, 5).map((order) => (
                    <OrderCardCompact key={order.id} order={order} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Internal notes */}
          <Card>
            <CardHeader>
              <CardTitle>Internal Notes</CardTitle>
            </CardHeader>
            <CardContent>
              {editing ? (
                <textarea
                  value={editData.notes}
                  onChange={(e) =>
                    setEditData((prev) => ({ ...prev, notes: e.target.value }))
                  }
                  rows={4}
                  className="w-full rounded-lg border border-base-300 bg-base-100 px-4 py-2"
                  placeholder="Add internal notes about this customer..."
                />
              ) : customer.notes ? (
                <p className="text-base-content/70 whitespace-pre-wrap">{customer.notes}</p>
              ) : (
                <p className="text-base-content/60">No internal notes</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Account settings */}
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {editing ? (
                <>
                  <Select
                    label="Account Status"
                    options={statusOptions}
                    value={editData.account_status}
                    onChange={(e) =>
                      setEditData((prev) => ({ ...prev, account_status: e.target.value }))
                    }
                  />
                  <Select
                    label="Payment Terms"
                    options={netTermsOptions}
                    value={editData.net_terms.toString()}
                    onChange={(e) =>
                      setEditData((prev) => ({ ...prev, net_terms: parseInt(e.target.value) }))
                    }
                  />
                  <Input
                    label="Discount %"
                    type="number"
                    min="0"
                    max="100"
                    step="0.5"
                    value={editData.discount_percentage}
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        discount_percentage: parseFloat(e.target.value) || 0,
                      }))
                    }
                  />
                </>
              ) : (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-base-content/70">Status</span>
                    <AccountStatusBadge status={customer.account_status} />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-base-content/70">Payment Terms</span>
                    <span>
                      {customer.net_terms ? `Net ${customer.net_terms}` : "Credit Card Only"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-base-content/70">Discount</span>
                    <span>{customer.discount_percentage || 0}%</span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-base-content/70">Total Orders</span>
                <span className="font-semibold">{customer.total_orders || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-base-content/70">Lifetime Value</span>
                <span className="font-semibold">
                  {formatCurrency(Number(customer.lifetime_value || 0))}
                </span>
              </div>
              {customer.total_orders && customer.lifetime_value && (
                <div className="flex justify-between items-center">
                  <span className="text-base-content/70">Avg. Order</span>
                  <span className="font-semibold">
                    {formatCurrency(Number(customer.lifetime_value) / customer.total_orders)}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <a href={`mailto:${customer.email}`} className="block">
                <Button variant="outline" fullWidth leftIcon={<Mail className="h-4 w-4" />}>
                  Send Email
                </Button>
              </a>
              {customer.phone && (
                <a href={`tel:${customer.phone}`} className="block">
                  <Button variant="outline" fullWidth leftIcon={<Phone className="h-4 w-4" />}>
                    Call Customer
                  </Button>
                </a>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

