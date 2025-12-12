"use client";

import { ReactNode, isValidElement, createElement } from "react";
import {
  Package,
  ShoppingCart,
  Search,
  FileText,
  MapPin,
  Inbox,
  type LucideIcon,
} from "lucide-react";
import { Button } from "./Button";

interface EmptyStateProps {
  icon?: LucideIcon | ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: "primary" | "secondary" | "ghost";
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  secondaryAction,
  className = "",
}: EmptyStateProps) {
  const renderIcon = () => {
    if (!Icon) return null;

    // If it's already a valid React element, wrap it
    if (isValidElement(Icon)) {
      return <div className="mb-4">{Icon}</div>;
    }

    // If it's a component (function), render it as a Lucide icon
    if (typeof Icon === "function") {
      return (
        <div className="mx-auto w-16 h-16 rounded-full bg-base-200 flex items-center justify-center mb-4">
          {createElement(Icon as LucideIcon, {
            className: "h-8 w-8 text-base-content/40",
          })}
        </div>
      );
    }

    return null;
  };

  return (
    <div
      className={`flex flex-col items-center justify-center text-center py-12 px-4 ${className}`}
    >
      {renderIcon()}

      <h3 className="text-lg font-semibold text-base-content mb-2">{title}</h3>

      {description && (
        <p className="text-base-content/60 max-w-md mb-6">{description}</p>
      )}

      {(action || secondaryAction) && (
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {action && (
            <Button
              variant={action.variant || "primary"}
              onClick={action.onClick}
            >
              {action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button variant="ghost" onClick={secondaryAction.onClick}>
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

// Pre-configured empty states for common scenarios

export function EmptyCart({
  onBrowse,
  className = "",
}: {
  onBrowse?: () => void;
  className?: string;
}) {
  return (
    <EmptyState
      icon={ShoppingCart}
      title="Your cart is empty"
      description="Looks like you haven't added any products yet. Browse our collection to get started."
      action={
        onBrowse ? { label: "Browse Products", onClick: onBrowse } : undefined
      }
      className={className}
    />
  );
}

export function EmptyProducts({
  onClearFilters,
  className = "",
}: {
  onClearFilters?: () => void;
  className?: string;
}) {
  return (
    <EmptyState
      icon={Package}
      title="No products found"
      description="We couldn't find any products matching your criteria. Try adjusting your filters."
      action={
        onClearFilters
          ? {
              label: "Clear Filters",
              onClick: onClearFilters,
              variant: "ghost" as const,
            }
          : undefined
      }
      className={className}
    />
  );
}

export function EmptySearch({
  query,
  onClear,
  className = "",
}: {
  query?: string;
  onClear?: () => void;
  className?: string;
}) {
  return (
    <EmptyState
      icon={Search}
      title="No results found"
      description={
        query
          ? `We couldn't find anything matching "${query}". Try different keywords.`
          : "Try searching for something else."
      }
      action={
        onClear
          ? {
              label: "Clear Search",
              onClick: onClear,
              variant: "ghost" as const,
            }
          : undefined
      }
      className={className}
    />
  );
}

export function EmptyOrders({
  onShop,
  className = "",
}: {
  onShop?: () => void;
  className?: string;
}) {
  return (
    <EmptyState
      icon={FileText}
      title="No orders yet"
      description="You haven't placed any orders yet. Start shopping to see your order history here."
      action={onShop ? { label: "Start Shopping", onClick: onShop } : undefined}
      className={className}
    />
  );
}

export function EmptyAddresses({
  onAdd,
  className = "",
}: {
  onAdd?: () => void;
  className?: string;
}) {
  return (
    <EmptyState
      icon={MapPin}
      title="No addresses saved"
      description="Add a shipping address to speed up your checkout process."
      action={onAdd ? { label: "Add Address", onClick: onAdd } : undefined}
      className={className}
    />
  );
}

export function EmptyInbox({ className = "" }: { className?: string }) {
  return (
    <EmptyState
      icon={Inbox}
      title="Nothing here"
      description="There's nothing to show at the moment."
      className={className}
    />
  );
}
