"use client";

import { useState, useEffect, useCallback } from "react";
import { findCarts, createCarts } from "@/actions/carts";
import {
  findCartItems,
  createCartItems,
  updateCartItems,
  deleteCartItems,
} from "@/actions/cart-items";
import { getProducts } from "@/actions/products";
import type { Carts } from "@/types/carts";
import type { Products } from "@/types/products";
import {
  type CartItemWithProduct,
  type CartTotals,
  type ProductVariant,
  type ShippingEstimate,
  calculateCartTotals,
  getShippingEstimates,
  getCartItemVariant,
  getVariantPrice,
  getVariantIncrement,
  isValidVariantQuantity,
  roundToVariantIncrement,
} from "@/lib/cart-utils";
import { CART_STATUS } from "@/lib/constants";

// ============================================================================
// Types
// ============================================================================

export interface UseCartOptions {
  customerId: string | null;
  autoFetch?: boolean;
}

export interface UseCartReturn {
  // State
  cart: Carts | null;
  items: CartItemWithProduct[];
  totals: CartTotals;
  shippingEstimates: ShippingEstimate[];
  loading: boolean;
  itemLoading: string | null; // ID of item being updated
  error: string | null;

  // Cart Actions
  initializeCart: () => Promise<Carts | null>;
  clearCart: () => Promise<void>;
  refresh: () => Promise<void>;

  // Item Actions
  addItem: (product: Products, quantity?: number, variant?: ProductVariant) => Promise<boolean>;
  updateItemQuantity: (itemId: string, quantity: number) => Promise<boolean>;
  removeItem: (itemId: string) => Promise<boolean>;
  incrementItem: (itemId: string) => Promise<boolean>;
  decrementItem: (itemId: string) => Promise<boolean>;

  // Helpers
  getItemByProductId: (productId: string) => CartItemWithProduct | undefined;
  getItemByVariant: (productId: string, variant: ProductVariant) => CartItemWithProduct | undefined;
  isProductInCart: (productId: string) => boolean;
  isVariantInCart: (productId: string, variant: ProductVariant) => boolean;
  getProductQuantity: (productId: string) => number;
  getVariantQuantity: (productId: string, variant: ProductVariant) => number;
}

// ============================================================================
// Hook Implementation
// ============================================================================

export function useCart(options: UseCartOptions): UseCartReturn {
  const { customerId, autoFetch = true } = options;

  // State
  const [cart, setCart] = useState<Carts | null>(null);
  const [items, setItems] = useState<CartItemWithProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [itemLoading, setItemLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Derived state
  const totals = calculateCartTotals(items);
  const shippingEstimates = getShippingEstimates(totals.estimatedWeight);

  // ============================================================================
  // Cart Fetching
  // ============================================================================

  const fetchCartItems = useCallback(async (cartId: string) => {
    try {
      const itemsResponse = await findCartItems({
        cart_id: cartId,
        limit: 100,
      });

      if (itemsResponse.success && itemsResponse.data) {
        // Fetch product details for each item
        const itemsWithProducts: CartItemWithProduct[] = await Promise.all(
          itemsResponse.data.map(async (item) => {
            // product_id is now the actual product ID (variant is separate field)
            const productResponse = await getProducts(item.product_id);
            return {
              ...item,
              product: productResponse.success
                ? productResponse.data
                : undefined,
            };
          })
        );

        setItems(itemsWithProducts);
      }
    } catch (err) {
      console.error("Failed to fetch cart items:", err);
    }
  }, []);

  const fetchCart = useCallback(async () => {
    if (!customerId) {
      setCart(null);
      setItems([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Find active cart for customer
      const cartsResponse = await findCarts({
        customer_id: customerId,
        status: CART_STATUS.ACTIVE,
        limit: 1,
      });

      if (
        cartsResponse.success &&
        cartsResponse.data &&
        cartsResponse.data.length > 0
      ) {
        const activeCart = cartsResponse.data[0];
        setCart(activeCart);

        // Fetch cart items
        if (activeCart.id) {
          await fetchCartItems(activeCart.id);
        }
      } else {
        // No active cart found
        setCart(null);
        setItems([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch cart");
    } finally {
      setLoading(false);
    }
  }, [customerId, fetchCartItems]);

  // Auto-fetch on mount
  useEffect(() => {
    if (autoFetch && customerId) {
      fetchCart();
    }
  }, [autoFetch, customerId, fetchCart]);

  // ============================================================================
  // Cart Actions
  // ============================================================================

  const initializeCart = useCallback(async (): Promise<Carts | null> => {
    if (!customerId) {
      setError("Customer ID is required to create a cart");
      return null;
    }

    if (cart) {
      return cart; // Cart already exists
    }

    setLoading(true);
    setError(null);

    try {
      const response = await createCarts({
        customer_id: customerId,
        status: CART_STATUS.ACTIVE,
      });

      if (response.success && response.data) {
        setCart(response.data);
        return response.data;
      } else {
        setError(response.error || "Failed to create cart");
        return null;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create cart");
      return null;
    } finally {
      setLoading(false);
    }
  }, [customerId, cart]);

  const clearCart = useCallback(async () => {
    if (!cart?.id) return;

    setLoading(true);
    setError(null);

    try {
      // Delete all cart items
      await Promise.all(
        items.map((item) => item.id && deleteCartItems(item.id))
      );

      setItems([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to clear cart");
    } finally {
      setLoading(false);
    }
  }, [cart?.id, items]);

  const refresh = useCallback(async () => {
    await fetchCart();
  }, [fetchCart]);

  // ============================================================================
  // Item Actions
  // ============================================================================

  const addItem = useCallback(
    async (product: Products, quantity?: number, variant?: ProductVariant): Promise<boolean> => {
      if (!product.id) {
        setError("Invalid product");
        return false;
      }

      // Determine variant - default to "single" for all products
      const itemVariant: ProductVariant = variant || "single";

      // Ensure we have a cart
      let activeCart = cart;
      if (!activeCart) {
        activeCart = await initializeCart();
        if (!activeCart) return false;
      }

      const increment = getVariantIncrement(itemVariant);
      const qty = quantity || increment;

      // Validate quantity for the variant
      if (!isValidVariantQuantity(itemVariant, qty)) {
        setError(`Quantity must be a multiple of ${increment}`);
        return false;
      }

      const unitPrice = getVariantPrice(itemVariant);

      // Create a unique key for loading state (product + variant)
      const loadingKey = `${product.id}:${itemVariant}`;
      setItemLoading(loadingKey);
      setError(null);

      try {
        // Check if this product+variant already in cart
        const existingItem = items.find(
          (item) => item.product_id === product.id && getCartItemVariant(item) === itemVariant
        );

        if (existingItem && existingItem.id) {
          // Update existing item
          const newQuantity = Number(existingItem.quantity) + qty;
          const response = await updateCartItems(existingItem.id, {
            quantity: newQuantity,
          });

          if (response.success && response.data) {
            setItems((prev) =>
              prev.map((item) =>
                item.id === existingItem.id
                  ? { ...item, ...response.data, product }
                  : item
              )
            );
            return true;
          } else {
            setError(response.error || "Failed to update cart item");
            return false;
          }
        } else {
          // Create new item with proper variant field
          const response = await createCartItems({
            cart_id: activeCart.id!,
            product_id: product.id,
            quantity: qty,
            variant: itemVariant,
            unit_price: unitPrice,
          });

          if (response.success && response.data) {
            setItems((prev) => [...prev, { ...response.data!, product }]);
            return true;
          } else {
            setError(response.error || "Failed to add item to cart");
            return false;
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to add item");
        return false;
      } finally {
        setItemLoading(null);
      }
    },
    [cart, items, initializeCart]
  );

  const removeItem = useCallback(async (itemId: string): Promise<boolean> => {
    setItemLoading(itemId);
    setError(null);

    try {
      const response = await deleteCartItems(itemId);

      if (response.success) {
        setItems((prev) => prev.filter((item) => item.id !== itemId));
        return true;
      } else {
        setError(response.error || "Failed to remove item");
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to remove item");
      return false;
    } finally {
      setItemLoading(null);
    }
  }, []);

  const updateItemQuantity = useCallback(
    async (itemId: string, quantity: number): Promise<boolean> => {
      const item = items.find((i) => i.id === itemId);
      if (!item) {
        setError("Item not found");
        return false;
      }

      // If quantity is 0 or less, remove the item
      if (quantity <= 0) {
        return removeItem(itemId);
      }

      // Use the item's variant for validation
      const variant = getCartItemVariant(item);
      const validQuantity = roundToVariantIncrement(variant, quantity);

      setItemLoading(itemId);
      setError(null);

      try {
        const response = await updateCartItems(itemId, {
          quantity: validQuantity,
        });

        if (response.success && response.data) {
          setItems((prev) =>
            prev.map((i) => (i.id === itemId ? { ...i, ...response.data } : i))
          );
          return true;
        } else {
          setError(response.error || "Failed to update quantity");
          return false;
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to update quantity"
        );
        return false;
      } finally {
        setItemLoading(null);
      }
    },
    [items, removeItem]
  );

  const incrementItem = useCallback(
    async (itemId: string): Promise<boolean> => {
      const item = items.find((i) => i.id === itemId);
      if (!item) {
        setError("Item not found");
        return false;
      }

      // Use variant to determine increment
      const variant = getCartItemVariant(item);
      const increment = getVariantIncrement(variant);
      const newQuantity = Number(item.quantity) + increment;

      return updateItemQuantity(itemId, newQuantity);
    },
    [items, updateItemQuantity]
  );

  const decrementItem = useCallback(
    async (itemId: string): Promise<boolean> => {
      const item = items.find((i) => i.id === itemId);
      if (!item) {
        setError("Item not found");
        return false;
      }

      // Use variant to determine increment
      const variant = getCartItemVariant(item);
      const increment = getVariantIncrement(variant);
      const newQuantity = Number(item.quantity) - increment;

      if (newQuantity <= 0) {
        return removeItem(itemId);
      }

      return updateItemQuantity(itemId, newQuantity);
    },
    [items, updateItemQuantity, removeItem]
  );

  // ============================================================================
  // Helpers
  // ============================================================================

  const getItemByProductId = useCallback(
    (productId: string): CartItemWithProduct | undefined => {
      return items.find((item) => item.product_id === productId);
    },
    [items]
  );

  const getItemByVariant = useCallback(
    (productId: string, variant: ProductVariant): CartItemWithProduct | undefined => {
      return items.find(
        (item) => item.product_id === productId && getCartItemVariant(item) === variant
      );
    },
    [items]
  );

  const isProductInCart = useCallback(
    (productId: string): boolean => {
      // Check if any variant of this product is in cart
      return items.some((item) => item.product_id === productId);
    },
    [items]
  );

  const isVariantInCart = useCallback(
    (productId: string, variant: ProductVariant): boolean => {
      return items.some(
        (item) => item.product_id === productId && getCartItemVariant(item) === variant
      );
    },
    [items]
  );

  const getProductQuantity = useCallback(
    (productId: string): number => {
      // Get total quantity across all variants
      return items.reduce((total, item) => {
        if (item.product_id === productId) {
          return total + Number(item.quantity);
        }
        return total;
      }, 0);
    },
    [items]
  );

  const getVariantQuantity = useCallback(
    (productId: string, variant: ProductVariant): number => {
      const item = items.find(
        (i) => i.product_id === productId && getCartItemVariant(i) === variant
      );
      return item ? Number(item.quantity) : 0;
    },
    [items]
  );

  return {
    cart,
    items,
    totals,
    shippingEstimates,
    loading,
    itemLoading,
    error,
    initializeCart,
    clearCart,
    refresh,
    addItem,
    updateItemQuantity,
    removeItem,
    incrementItem,
    decrementItem,
    getItemByProductId,
    getItemByVariant,
    isProductInCart,
    isVariantInCart,
    getProductQuantity,
    getVariantQuantity,
  };
}
