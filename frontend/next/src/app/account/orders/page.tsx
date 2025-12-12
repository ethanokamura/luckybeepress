"use client";

import { useUser } from "@auth0/nextjs-auth0";
import { OrderHistory } from "@/components/account/OrderHistory";
import { SortDropdown } from "@/components/ui/SortDropdown";
import { useCustomerByAuth } from "@/hooks/useCustomer";
import { useOrders } from "@/hooks/useOrders";
import { useCartContext } from "@/providers/CartProvider";
import { ORDER_SORT_OPTIONS } from "@/lib/constants";

export default function OrdersPage() {
  const { user } = useUser();
  const { customer } = useCustomerByAuth({
    authEmail: user?.email || null,
  });

  const { quickAddToCart } = useCartContext();

  const {
    orders,
    loading,
    hasMore,
    loadMore,
  } = useOrders({
    customerId: customer?.id || null,
  });

  const handleReorder = async (orderId: string) => {
    // In a real app, this would fetch the order items and add them to cart
    // For now, just show a message
    alert(`Reorder functionality coming soon for order ${orderId}`);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Order History</h1>
      </div>

      <OrderHistory
        orders={orders}
        loading={loading}
        hasMore={hasMore}
        onLoadMore={loadMore}
        onReorder={handleReorder}
      />
    </div>
  );
}

