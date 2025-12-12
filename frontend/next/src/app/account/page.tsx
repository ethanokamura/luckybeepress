"use client";

import { useUser } from "@auth0/nextjs-auth0";
import Link from "next/link";
import {
  Package,
  MapPin,
  CreditCard,
  TrendingUp,
  ArrowRight,
  User,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { AccountStatusBadge } from "@/components/ui/StatusBadge";
import { Skeleton } from "@/components/ui/Skeleton";
import { OrderCardCompact } from "@/components/account/OrderCard";
import { useCustomerByAuth } from "@/hooks/useCustomer";
import { useRecentOrders, useOrderStats } from "@/hooks/useOrders";
import { formatCurrency, formatDate } from "@/lib/format";

export default function AccountPage() {
  const { user } = useUser();
  const { customer, loading: customerLoading, needsRegistration } = useCustomerByAuth({
    authEmail: user?.email || null,
    authName: user?.name || null,
  });

  const { orders: recentOrders, loading: ordersLoading } = useRecentOrders(
    customer?.id || null,
    3
  );

  const { stats, loading: statsLoading } = useOrderStats(customer?.id || null);

  const isLoading = customerLoading;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton variant="rectangular" className="h-32 rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} variant="rectangular" className="h-24 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (needsRegistration || !customer) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
          <User className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-2xl font-bold mb-4">Complete Your Registration</h1>
        <p className="text-base-content/60 max-w-md mx-auto mb-8">
          To start ordering, please complete your wholesale account registration.
        </p>
        <Link href="/account/settings">
          <Button variant="primary" size="lg">
            Complete Registration
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            Welcome back, {customer.contact_name || customer.business_name}
          </h1>
          <p className="text-base-content/60 mt-1">
            {customer.business_name}
          </p>
        </div>
        <AccountStatusBadge status={customer.account_status} />
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalOrders}</p>
                <p className="text-sm text-base-content/60">Total Orders</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-success/20 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {formatCurrency(stats.totalSpent)}
                </p>
                <p className="text-sm text-base-content/60">Lifetime Value</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-warning/20 flex items-center justify-center">
                <Package className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.pendingOrders}</p>
                <p className="text-sm text-base-content/60">Pending Orders</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {customer.net_terms ? `Net ${customer.net_terms}` : "Credit Card"}
                </p>
                <p className="text-sm text-base-content/60">Payment Terms</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent orders */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Orders</CardTitle>
          <Link href="/account/orders">
            <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="h-4 w-4" />}>
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
          ) : recentOrders.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-base-content/60 mb-4">No orders yet</p>
              <Link href="/products">
                <Button variant="primary">Start Shopping</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <OrderCardCompact key={order.id} order={order} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/account/addresses">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-base-200 flex items-center justify-center">
                <MapPin className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">Manage Addresses</p>
                <p className="text-sm text-base-content/60">
                  Add or edit shipping addresses
                </p>
              </div>
              <ArrowRight className="h-5 w-5 text-base-content/40" />
            </CardContent>
          </Card>
        </Link>

        <Link href="/products">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">Browse Products</p>
                <p className="text-sm text-base-content/60">
                  View our complete catalog
                </p>
              </div>
              <ArrowRight className="h-5 w-5 text-base-content/40" />
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Account info */}
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-base-content/60">Business Name</p>
              <p className="font-medium">{customer.business_name}</p>
            </div>
            <div>
              <p className="text-sm text-base-content/60">Email</p>
              <p className="font-medium">{customer.email}</p>
            </div>
            {customer.phone && (
              <div>
                <p className="text-sm text-base-content/60">Phone</p>
                <p className="font-medium">{customer.phone}</p>
              </div>
            )}
            {customer.first_order_date && (
              <div>
                <p className="text-sm text-base-content/60">Customer Since</p>
                <p className="font-medium">{formatDate(customer.first_order_date)}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

