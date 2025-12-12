"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import { useUser } from "@auth0/nextjs-auth0";
import { findCustomers } from "@/actions/customers";
import { useCart, type UseCartReturn } from "@/hooks/useCart";
import type { Products } from "@/types/products";
import type {
  CartTotals,
  ShippingEstimate,
  ProductVariant,
} from "@/lib/cart-utils";
import { MINIMUM_ORDER_AMOUNT } from "@/lib/constants";

// ============================================================================
// Types
// ============================================================================

export interface CartContextValue
  extends Omit<UseCartReturn, "initializeCart"> {
  // Customer info
  customerId: string | null;
  customerLoading: boolean;

  // UI state
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;

  // Quick add (handles cart initialization)
  quickAddToCart: (
    product: Products,
    quantity?: number,
    variant?: ProductVariant
  ) => Promise<boolean>;

  // Variant helpers
  isVariantInCart: (productId: string, variant: ProductVariant) => boolean;
  getVariantQuantity: (productId: string, variant: ProductVariant) => number;

  // Checkout readiness
  canCheckout: boolean;
  checkoutBlockReason: string | null;
}

const CartContext = createContext<CartContextValue | null>(null);

// ============================================================================
// Provider Component
// ============================================================================

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const { user, isLoading: authLoading } = useUser();

  // Customer state
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [customerLoading, setCustomerLoading] = useState(false);

  // UI state
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Fetch customer by auth email
  useEffect(() => {
    const fetchCustomer = async () => {
      if (!user?.email) {
        setCustomerId(null);
        return;
      }

      setCustomerLoading(true);

      try {
        const response = await findCustomers({
          email: user.email,
          limit: 1,
        });

        if (response.success && response.data && response.data.length > 0) {
          setCustomerId(response.data[0].id);
        } else {
          setCustomerId(null);
        }
      } catch (err) {
        console.error("Failed to fetch customer:", err);
        setCustomerId(null);
      } finally {
        setCustomerLoading(false);
      }
    };

    if (!authLoading) {
      fetchCustomer();
    }
  }, [user?.email, authLoading]);

  // Use the cart hook
  const cartHook = useCart({
    customerId,
    autoFetch: Boolean(customerId),
  });

  // UI actions
  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);
  const toggleCart = useCallback(() => setIsCartOpen((prev) => !prev), []);

  // Quick add that handles cart initialization
  const quickAddToCart = useCallback(
    async (
      product: Products,
      quantity?: number,
      variant?: ProductVariant
    ): Promise<boolean> => {
      // Ensure cart exists before adding
      if (!cartHook.cart) {
        const newCart = await cartHook.initializeCart();
        if (!newCart) {
          return false;
        }
      }

      const success = await cartHook.addItem(product, quantity, variant);

      // Open cart drawer on successful add
      if (success) {
        openCart();
      }

      return success;
    },
    [cartHook, openCart]
  );

  // Checkout readiness
  const canCheckout = useMemo(() => {
    if (!customerId) return false;
    if (cartHook.items.length === 0) return false;
    if (!cartHook.totals.meetsMinimum) return false;
    return true;
  }, [customerId, cartHook.items.length, cartHook.totals.meetsMinimum]);

  const checkoutBlockReason = useMemo(() => {
    if (!user) return "Please log in to checkout";
    if (!customerId) return "Please complete your account registration";
    if (cartHook.items.length === 0) return "Your cart is empty";
    if (!cartHook.totals.meetsMinimum) {
      return `Add $${cartHook.totals.amountToMinimum.toFixed(
        2
      )} more to meet the $${MINIMUM_ORDER_AMOUNT} minimum`;
    }
    return null;
  }, [user, customerId, cartHook.items.length, cartHook.totals]);

  // Context value
  const value: CartContextValue = useMemo(
    () => ({
      // From useCart hook
      cart: cartHook.cart,
      items: cartHook.items,
      totals: cartHook.totals,
      shippingEstimates: cartHook.shippingEstimates,
      loading: cartHook.loading || customerLoading || authLoading,
      itemLoading: cartHook.itemLoading,
      error: cartHook.error,
      clearCart: cartHook.clearCart,
      refresh: cartHook.refresh,
      addItem: cartHook.addItem,
      updateItemQuantity: cartHook.updateItemQuantity,
      removeItem: cartHook.removeItem,
      incrementItem: cartHook.incrementItem,
      decrementItem: cartHook.decrementItem,
      getItemByProductId: cartHook.getItemByProductId,
      isProductInCart: cartHook.isProductInCart,
      getProductQuantity: cartHook.getProductQuantity,

      // Variant helpers
      isVariantInCart: cartHook.isVariantInCart,
      getVariantQuantity: cartHook.getVariantQuantity,

      // Customer info
      customerId,
      customerLoading,

      // UI state
      isCartOpen,
      openCart,
      closeCart,
      toggleCart,

      // Quick add
      quickAddToCart,

      // Checkout readiness
      canCheckout,
      checkoutBlockReason,
    }),
    [
      cartHook,
      customerLoading,
      authLoading,
      customerId,
      isCartOpen,
      openCart,
      closeCart,
      toggleCart,
      quickAddToCart,
      canCheckout,
      checkoutBlockReason,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// ============================================================================
// Hook to use cart context
// ============================================================================

export function useCartContext(): CartContextValue {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCartContext must be used within a CartProvider");
  }

  return context;
}

// ============================================================================
// Convenience Hooks
// ============================================================================

/**
 * Hook to get just the cart count (for header badge)
 */
export function useCartCount(): number {
  const context = useContext(CartContext);
  return context?.items.length ?? 0;
}

/**
 * Hook to get just the cart subtotal
 */
export function useCartSubtotal(): number {
  const context = useContext(CartContext);
  return context?.totals.subtotal ?? 0;
}

/**
 * Hook to check if minimum order is met
 */
export function useMinimumOrderStatus(): {
  meetsMinimum: boolean;
  amountToMinimum: number;
  percentToMinimum: number;
} {
  const context = useContext(CartContext);
  return {
    meetsMinimum: context?.totals.meetsMinimum ?? false,
    amountToMinimum: context?.totals.amountToMinimum ?? MINIMUM_ORDER_AMOUNT,
    percentToMinimum: context?.totals.percentToMinimum ?? 0,
  };
}

/**
 * Hook to check if a specific product is in cart
 */
export function useIsInCart(productId: string): boolean {
  const context = useContext(CartContext);
  return context?.isProductInCart(productId) ?? false;
}

/**
 * Hook to get quantity of a specific product in cart
 */
export function useProductQuantityInCart(productId: string): number {
  const context = useContext(CartContext);
  return context?.getProductQuantity(productId) ?? 0;
}
