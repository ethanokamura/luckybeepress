"use client";

import type { OrderStatus, PaymentStatus } from "@/types";

interface OrderStatusBadgeProps {
  status: OrderStatus;
  size?: "sm" | "md";
}

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
  size?: "sm" | "md";
}

const orderStatusConfig: Record<
  OrderStatus,
  { label: string; className: string }
> = {
  pending: {
    label: "Pending",
    className: "bg-amber-100 text-amber-800 border-amber-200",
  },
  confirmed: {
    label: "Confirmed",
    className: "bg-blue-100 text-blue-800 border-blue-200",
  },
  processing: {
    label: "Processing",
    className: "bg-purple-100 text-purple-800 border-purple-200",
  },
  shipped: {
    label: "Shipped",
    className: "bg-cyan-100 text-cyan-800 border-cyan-200",
  },
  delivered: {
    label: "Delivered",
    className: "bg-green-100 text-green-800 border-green-200",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-gray-100 text-gray-800 border-gray-200",
  },
  refunded: {
    label: "Refunded",
    className: "bg-red-100 text-red-800 border-red-200",
  },
};

const paymentStatusConfig: Record<
  PaymentStatus,
  { label: string; className: string }
> = {
  pending: {
    label: "Pending",
    className: "bg-amber-100 text-amber-800 border-amber-200",
  },
  paid: {
    label: "Paid",
    className: "bg-green-100 text-green-800 border-green-200",
  },
  failed: {
    label: "Failed",
    className: "bg-red-100 text-red-800 border-red-200",
  },
  refunded: {
    label: "Refunded",
    className: "bg-gray-100 text-gray-800 border-gray-200",
  },
  partially_refunded: {
    label: "Partial Refund",
    className: "bg-orange-100 text-orange-800 border-orange-200",
  },
};

export function OrderStatusBadge({
  status,
  size = "md",
}: OrderStatusBadgeProps) {
  const config = orderStatusConfig[status];
  const sizeClasses =
    size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm";

  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium ${config.className} ${sizeClasses}`}
    >
      {config.label}
    </span>
  );
}

export function PaymentStatusBadge({
  status,
  size = "md",
}: PaymentStatusBadgeProps) {
  const config = paymentStatusConfig[status];
  const sizeClasses =
    size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm";

  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium ${config.className} ${sizeClasses}`}
    >
      {config.label}
    </span>
  );
}
