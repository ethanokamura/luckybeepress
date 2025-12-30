"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getDocs,
  query,
  where,
  orderBy,
  limit,
  collection,
  getCountFromServer,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { collections, formatPrice, toDate } from "@/lib/firebase-helpers";
import { OrderStatusBadge } from "@/components/shared/OrderStatusBadge";
import type { Order, User } from "@/types";

export default function AdminDashboardPage() {
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [pendingCustomers, setPendingCustomers] = useState<User[]>([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    totalCustomers: 0,
    pendingCustomers: 0,
    totalProducts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch recent orders
        const ordersQuery = query(
          collections.orders,
          orderBy("createdAt", "desc"),
          limit(5)
        );
        const ordersSnapshot = await getDocs(ordersQuery);
        setRecentOrders(ordersSnapshot.docs.map((doc) => doc.data()));

        // Fetch pending customers
        const pendingQuery = query(
          collections.users,
          where("accountStatus", "==", "pending"),
          limit(5)
        );
        const pendingSnapshot = await getDocs(pendingQuery);
        setPendingCustomers(pendingSnapshot.docs.map((doc) => doc.data()));

        // Get counts
        const [
          totalOrdersSnap,
          pendingOrdersSnap,
          totalCustomersSnap,
          pendingCustomersSnap,
          totalProductsSnap,
        ] = await Promise.all([
          getCountFromServer(collection(db, "orders")),
          getCountFromServer(
            query(collections.orders, where("status", "==", "pending"))
          ),
          getCountFromServer(collection(db, "users")),
          getCountFromServer(
            query(collections.users, where("accountStatus", "==", "pending"))
          ),
          getCountFromServer(collection(db, "products")),
        ]);

        setStats({
          totalOrders: totalOrdersSnap.data().count,
          pendingOrders: pendingOrdersSnap.data().count,
          totalCustomers: totalCustomersSnap.data().count,
          pendingCustomers: pendingCustomersSnap.data().count,
          totalProducts: totalProductsSnap.data().count,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted animate-pulse rounded w-48" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          href="/admin/orders"
          className="bg-card border rounded-lg p-6 hover:border-primary/30 transition-all"
        >
          <p className="text-sm text-muted-foreground">Total Orders</p>
          <p className="text-3xl font-bold mt-1">{stats.totalOrders}</p>
          <p className="text-sm text-primary mt-2">View all →</p>
        </Link>

        <Link
          href="/admin/orders?status=pending"
          className="bg-card border rounded-lg p-6 hover:border-primary/30 transition-all"
        >
          <p className="text-sm text-muted-foreground">Pending Orders</p>
          <p className="text-3xl font-bold mt-1 text-amber-600">
            {stats.pendingOrders}
          </p>
          <p className="text-sm text-primary mt-2">Review →</p>
        </Link>

        <Link
          href="/admin/customers"
          className="bg-card border rounded-lg p-6 hover:border-primary/30 transition-all"
        >
          <p className="text-sm text-muted-foreground">Total Customers</p>
          <p className="text-3xl font-bold mt-1">{stats.totalCustomers}</p>
          <p className="text-sm text-primary mt-2">View all →</p>
        </Link>

        <Link
          href="/admin/products"
          className="bg-card border rounded-lg p-6 hover:border-primary/30 transition-all"
        >
          <p className="text-sm text-muted-foreground">Products</p>
          <p className="text-3xl font-bold mt-1">{stats.totalProducts}</p>
          <p className="text-sm text-primary mt-2">Manage →</p>
        </Link>
      </div>

      {/* Pending Customers Alert */}
      {stats.pendingCustomers > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-amber-800">
                {stats.pendingCustomers} Customer
                {stats.pendingCustomers !== 1 ? "s" : ""} Awaiting Approval
              </h3>
              <p className="text-sm text-amber-700 mt-1">
                Review and approve new wholesale accounts
              </p>
            </div>
            <Link href="/admin/customers?status=pending">
              <button className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 text-sm font-medium">
                Review Now
              </button>
            </Link>
          </div>

          {/* Pending customers list */}
          <div className="mt-4 space-y-2">
            {pendingCustomers.map((customer) => (
              <div
                key={customer.id}
                className="flex items-center justify-between bg-white rounded-md p-3"
              >
                <div>
                  <p className="font-medium text-foreground">
                    {customer.displayName || customer.email}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {customer.email}
                  </p>
                </div>
                <Link href={`/admin/customers/${customer.id}`}>
                  <span className="text-sm text-primary hover:underline">
                    View
                  </span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Orders */}
      <div className="bg-card border rounded-lg">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-bold">Recent Orders</h2>
          <Link
            href="/admin/orders"
            className="text-sm text-primary hover:underline"
          >
            View all →
          </Link>
        </div>

        {recentOrders.length > 0 ? (
          <div className="divide-y">
            {recentOrders.map((order) => {
              const createdAt = toDate(order.createdAt);
              return (
                <Link
                  key={order.id}
                  href={`/admin/orders/${order.id}`}
                  className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="font-medium">{order.orderNumber}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.userEmail}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-medium">{formatPrice(order.total)}</p>
                      <p className="text-xs text-muted-foreground">
                        {createdAt?.toLocaleDateString()}
                      </p>
                    </div>
                    <OrderStatusBadge status={order.status} size="sm" />
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="p-6 text-center text-muted-foreground">
            No orders yet
          </div>
        )}
      </div>
    </div>
  );
}
