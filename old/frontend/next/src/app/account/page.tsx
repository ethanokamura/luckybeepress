"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@auth0/nextjs-auth0/client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Badge,
  Loading,
} from "@/components/ui";
import {
  mockOrders,
  mockCustomers,
  formatCurrency,
  formatDate,
} from "@/lib/mock-data";
import {
  FiUser,
  FiPackage,
  FiCreditCard,
  FiTrendingUp,
  FiMapPin,
} from "react-icons/fi";
import Link from "next/link";

export default function AccountPage() {
  const router = useRouter();
  const { user, isLoading } = useUser();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/api/auth/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return <Loading text="Loading account..." />;
  }

  if (!user) {
    return null;
  }

  // Mock customer data - in real app, fetch from API
  const customerData = mockCustomers[0];
  const recentOrders = mockOrders.slice(0, 3);

  const stats = [
    {
      label: "Total Orders",
      value: customerData.total_orders || 0,
      icon: FiPackage,
      color: "primary",
    },
    {
      label: "Lifetime Value",
      value: formatCurrency(customerData.lifetime_value || 0),
      icon: FiTrendingUp,
      color: "success",
    },
    {
      label: "Payment Terms",
      value: `Net ${customerData.net_terms || 30}`,
      icon: FiCreditCard,
      color: "info",
    },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-neutral font-serif mb-2">
          My Account
        </h1>
        <p className="text-base-content">
          Welcome back, {user.name || user.email}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-neutral-content mb-1">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold text-neutral">
                      {stat.value}
                    </p>
                  </div>
                  <div
                    className={`p-3 rounded-lg bg-[var(--color-${stat.color})]/20`}
                  >
                    <Icon
                      className={`w-6 h-6 text-[var(--color-${stat.color})]`}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Recent Orders</CardTitle>
                <Link href="/orders">
                  <Button variant="ghost" size="sm">
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                {recentOrders.length > 0 ? (
                  recentOrders.map((order) => (
                    <Link key={order.id} href={`/orders/${order.id}`}>
                      <div className="p-4 bg-base-200 border border-base-300 rounded-lg hover:border-primary transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-semibold text-neutral">
                              {order.order_number}
                            </p>
                            <p className="text-sm text-neutral-content">
                              {formatDate(order.order_date)}
                            </p>
                          </div>
                          <Badge
                            variant={
                              order.status === "delivered"
                                ? "success"
                                : order.status === "shipped"
                                ? "primary"
                                : order.status === "processing"
                                ? "info"
                                : "warning"
                            }
                          >
                            {order.status}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="text-sm text-base-content">
                            {order.shipping_company_name}
                          </p>
                          <p className="font-bold text-neutral">
                            {formatCurrency(order.total_amount)}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="text-center text-neutral-content py-8">
                    No orders yet
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Account Info */}
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-neutral-content mb-1">
                    Business Name
                  </p>
                  <p className="font-medium text-neutral">
                    {customerData.business_name}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-neutral-content mb-1">
                    Contact Name
                  </p>
                  <p className="font-medium text-neutral">
                    {customerData.contact_name}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-neutral-content mb-1">Email</p>
                  <p className="font-medium text-neutral">
                    {customerData.email}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-neutral-content mb-1">Phone</p>
                  <p className="font-medium text-neutral">
                    {customerData.phone}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-neutral-content mb-1">
                    Account Status
                  </p>
                  <Badge
                    variant={
                      customerData.account_status === "active"
                        ? "success"
                        : "warning"
                    }
                  >
                    {customerData.account_status}
                  </Badge>
                </div>

                {customerData.discount_percentage &&
                  customerData.discount_percentage > 0 && (
                    <div>
                      <p className="text-sm text-neutral-content mb-1">
                        Volume Discount
                      </p>
                      <p className="font-medium text-success">
                        {customerData.discount_percentage}% off all orders
                      </p>
                    </div>
                  )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <Link href="/products">
                  <Button variant="outline" fullWidth className="justify-start">
                    <FiPackage className="w-4 h-4 mr-2" />
                    Browse Products
                  </Button>
                </Link>

                <Link href="/orders">
                  <Button variant="outline" fullWidth className="justify-start">
                    <FiPackage className="w-4 h-4 mr-2" />
                    View Orders
                  </Button>
                </Link>

                <Link href="/account/addresses">
                  <Button variant="outline" fullWidth className="justify-start">
                    <FiMapPin className="w-4 h-4 mr-2" />
                    Manage Addresses
                  </Button>
                </Link>

                <Link href="/contact">
                  <Button variant="outline" fullWidth className="justify-start">
                    <FiUser className="w-4 h-4 mr-2" />
                    Contact Support
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
