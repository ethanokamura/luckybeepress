"use client";

import {
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  Package,
  AlertCircle,
  CreditCard,
  type LucideIcon,
} from "lucide-react";
import {
  ORDER_STATUS,
  PAYMENT_STATUS,
  ACCOUNT_STATUS,
  type OrderStatus,
  type PaymentStatus,
  type AccountStatus,
} from "@/lib/constants";

// ============================================================================
// Order Status Badge
// ============================================================================

interface OrderStatusBadgeProps {
  status: string | null;
  size?: "sm" | "md";
  className?: string;
}

const orderStatusConfig: Record<
  string,
  { label: string; color: string; icon: LucideIcon }
> = {
  [ORDER_STATUS.PENDING]: {
    label: "Pending",
    color: "bg-warning/20 text-warning",
    icon: Clock,
  },
  [ORDER_STATUS.CONFIRMED]: {
    label: "Confirmed",
    color: "bg-info/20 text-info",
    icon: CheckCircle,
  },
  [ORDER_STATUS.PROCESSING]: {
    label: "Processing",
    color: "bg-secondary/20 text-secondary",
    icon: Package,
  },
  [ORDER_STATUS.SHIPPED]: {
    label: "Shipped",
    color: "bg-primary/20 text-primary",
    icon: Truck,
  },
  [ORDER_STATUS.DELIVERED]: {
    label: "Delivered",
    color: "bg-success/20 text-success",
    icon: CheckCircle,
  },
  [ORDER_STATUS.CANCELLED]: {
    label: "Cancelled",
    color: "bg-error/20 text-error",
    icon: XCircle,
  },
};

export function OrderStatusBadge({
  status,
  size = "md",
  className = "",
}: OrderStatusBadgeProps) {
  const config = orderStatusConfig[status || ""] || {
    label: status || "Unknown",
    color: "bg-base-200 text-base-content/70",
    icon: AlertCircle,
  };

  const Icon = config.icon;
  const sizeStyles = {
    sm: "text-xs px-2 py-0.5 gap-1",
    md: "text-sm px-2.5 py-1 gap-1.5",
  };
  const iconSize = size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5";

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full ${config.color} ${sizeStyles[size]} ${className}`}
    >
      <Icon className={iconSize} />
      {config.label}
    </span>
  );
}

// ============================================================================
// Payment Status Badge
// ============================================================================

interface PaymentStatusBadgeProps {
  status: string | null;
  size?: "sm" | "md";
  className?: string;
}

const paymentStatusConfig: Record<
  string,
  { label: string; color: string; icon: LucideIcon }
> = {
  [PAYMENT_STATUS.PENDING]: {
    label: "Payment Pending",
    color: "bg-warning/20 text-warning",
    icon: Clock,
  },
  [PAYMENT_STATUS.PAID]: {
    label: "Paid",
    color: "bg-success/20 text-success",
    icon: CheckCircle,
  },
  [PAYMENT_STATUS.PARTIAL]: {
    label: "Partial Payment",
    color: "bg-info/20 text-info",
    icon: CreditCard,
  },
  [PAYMENT_STATUS.OVERDUE]: {
    label: "Overdue",
    color: "bg-error/20 text-error",
    icon: AlertCircle,
  },
  [PAYMENT_STATUS.REFUNDED]: {
    label: "Refunded",
    color: "bg-base-200 text-base-content/70",
    icon: XCircle,
  },
};

export function PaymentStatusBadge({
  status,
  size = "md",
  className = "",
}: PaymentStatusBadgeProps) {
  const config = paymentStatusConfig[status || ""] || {
    label: status || "Unknown",
    color: "bg-base-200 text-base-content/70",
    icon: AlertCircle,
  };

  const Icon = config.icon;
  const sizeStyles = {
    sm: "text-xs px-2 py-0.5 gap-1",
    md: "text-sm px-2.5 py-1 gap-1.5",
  };
  const iconSize = size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5";

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full ${config.color} ${sizeStyles[size]} ${className}`}
    >
      <Icon className={iconSize} />
      {config.label}
    </span>
  );
}

// ============================================================================
// Account Status Badge
// ============================================================================

interface AccountStatusBadgeProps {
  status: string | null;
  size?: "sm" | "md";
  className?: string;
}

const accountStatusConfig: Record<
  string,
  { label: string; color: string; icon: LucideIcon }
> = {
  [ACCOUNT_STATUS.PENDING]: {
    label: "Pending Approval",
    color: "bg-warning/20 text-warning",
    icon: Clock,
  },
  [ACCOUNT_STATUS.ACTIVE]: {
    label: "Active",
    color: "bg-success/20 text-success",
    icon: CheckCircle,
  },
  [ACCOUNT_STATUS.SUSPENDED]: {
    label: "Suspended",
    color: "bg-error/20 text-error",
    icon: XCircle,
  },
};

export function AccountStatusBadge({
  status,
  size = "md",
  className = "",
}: AccountStatusBadgeProps) {
  const config = accountStatusConfig[status || ""] || {
    label: status || "Unknown",
    color: "bg-base-200 text-base-content/70",
    icon: AlertCircle,
  };

  const Icon = config.icon;
  const sizeStyles = {
    sm: "text-xs px-2 py-0.5 gap-1",
    md: "text-sm px-2.5 py-1 gap-1.5",
  };
  const iconSize = size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5";

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full ${config.color} ${sizeStyles[size]} ${className}`}
    >
      <Icon className={iconSize} />
      {config.label}
    </span>
  );
}

// ============================================================================
// Stock Status Badge
// ============================================================================

interface StockStatusBadgeProps {
  quantity: number | null;
  threshold?: number;
  size?: "sm" | "md";
  className?: string;
}

export function StockStatusBadge({
  quantity,
  threshold = 10,
  size = "md",
  className = "",
}: StockStatusBadgeProps) {
  const sizeStyles = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-1",
  };

  if (quantity === null || quantity === undefined) {
    return (
      <span
        className={`inline-flex items-center font-medium rounded-full bg-base-200 text-base-content/70 ${sizeStyles[size]} ${className}`}
      >
        Unknown
      </span>
    );
  }

  if (quantity <= 0) {
    return (
      <span
        className={`inline-flex items-center font-medium rounded-full bg-error/20 text-error ${sizeStyles[size]} ${className}`}
      >
        Out of Stock
      </span>
    );
  }

  if (quantity <= threshold) {
    return (
      <span
        className={`inline-flex items-center font-medium rounded-full bg-warning/20 text-warning ${sizeStyles[size]} ${className}`}
      >
        Low Stock ({quantity})
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full bg-success/20 text-success ${sizeStyles[size]} ${className}`}
    >
      In Stock
    </span>
  );
}

// ============================================================================
// Generic Status Badge
// ============================================================================

interface GenericStatusBadgeProps {
  status: string;
  variant?: "success" | "warning" | "error" | "info" | "neutral";
  icon?: LucideIcon;
  size?: "sm" | "md";
  className?: string;
}

export function GenericStatusBadge({
  status,
  variant = "neutral",
  icon: Icon,
  size = "md",
  className = "",
}: GenericStatusBadgeProps) {
  const variantStyles = {
    success: "bg-success/20 text-success",
    warning: "bg-warning/20 text-warning",
    error: "bg-error/20 text-error",
    info: "bg-info/20 text-info",
    neutral: "bg-base-200 text-base-content/70",
  };

  const sizeStyles = {
    sm: "text-xs px-2 py-0.5 gap-1",
    md: "text-sm px-2.5 py-1 gap-1.5",
  };
  const iconSize = size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5";

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {Icon && <Icon className={iconSize} />}
      {status}
    </span>
  );
}

