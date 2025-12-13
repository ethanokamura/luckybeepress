"use client";

import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  AlertTriangle,
  TrendingUp,
  Clock,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatCurrency, formatCompactNumber } from "@/lib/format";
import type { AdminStats } from "@/hooks/useAdmin";

interface AdminStatsCardsProps {
  stats: AdminStats;
  loading?: boolean;
  className?: string;
}

export function AdminStatsCards({
  stats,
  loading = false,
  className = "",
}: AdminStatsCardsProps) {
  const cards = [
    {
      label: "Total Revenue",
      value: formatCurrency(stats.totalRevenue),
      icon: DollarSign,
      color: "bg-success/20 text-success",
    },
    {
      label: "Total Orders",
      value: stats.totalOrders.toString(),
      subValue: `${stats.pendingOrders} pending`,
      icon: ShoppingCart,
      color: "bg-primary/20 text-primary",
    },
    {
      label: "Customers",
      value: stats.totalCustomers.toString(),
      subValue: `${stats.activeCustomers} active`,
      icon: Users,
      color: "bg-secondary/20 text-secondary",
    },
    {
      label: "Products",
      value: stats.totalProducts.toString(),
      subValue: stats.lowStockProducts > 0 ? `${stats.lowStockProducts} low stock` : "All stocked",
      subValueColor: stats.lowStockProducts > 0 ? "text-warning" : "text-success",
      icon: Package,
      color: "bg-info/20 text-info",
    },
  ];

  if (loading) {
    return (
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <Skeleton variant="rectangular" className="w-12 h-12 rounded-xl" />
                <div className="space-y-2">
                  <Skeleton variant="text" className="h-6 w-20" />
                  <Skeleton variant="text" className="h-4 w-16" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.label}>
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.color}`}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{card.value}</p>
                  <p className="text-sm text-base-content/60">{card.label}</p>
                  {card.subValue && (
                    <p className={`text-xs ${card.subValueColor || "text-base-content/50"}`}>
                      {card.subValue}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

// Quick action cards for dashboard
export function AdminQuickActions({ className = "" }: { className?: string }) {
  const actions = [
    {
      label: "Pending Orders",
      description: "Review and process orders",
      href: "/admin/orders?status=pending",
      icon: Clock,
      color: "bg-warning/20 text-warning",
    },
    {
      label: "Low Stock Alert",
      description: "Products running low",
      href: "/admin/products?lowStock=true",
      icon: AlertTriangle,
      color: "bg-error/20 text-error",
    },
  ];

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 ${className}`}>
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <a
            key={action.label}
            href={action.href}
            className="block"
          >
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardContent className="p-5 flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${action.color}`}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-semibold">{action.label}</p>
                  <p className="text-sm text-base-content/60">{action.description}</p>
                </div>
              </CardContent>
            </Card>
          </a>
        );
      })}
    </div>
  );
}

