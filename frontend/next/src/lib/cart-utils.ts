/**
 * Cart calculation utilities
 * Handles pricing, quantities, minimums, and shipping estimates
 */

import type { Products } from "@/types/products";
import type { CartItems } from "@/types/cart_items";
import {
  MINIMUM_ORDER_AMOUNT,
  PRODUCT_CONFIG,
  BOX_ELIGIBLE_CATEGORIES,
  SHIPPING_WEIGHTS,
  SHIPPING_RATES,
  type ShippingMethod,
} from "./constants";

// ============================================================================
// Types
// ============================================================================

export type ProductVariant = "single" | "box";

export interface CartItemWithProduct extends CartItems {
  product?: Products;
}

export interface CartTotals {
  subtotal: number;
  itemCount: number;
  productCount: number;
  estimatedWeight: number;
  meetsMinimum: boolean;
  amountToMinimum: number;
  percentToMinimum: number;
}

export interface ShippingEstimate {
  method: ShippingMethod;
  label: string;
  rate: number;
  estimatedDays: string;
}

// ============================================================================
// Variant Helpers
// ============================================================================

/**
 * Gets the variant from a cart item, defaulting to "single"
 */
export function getCartItemVariant(item: CartItems): ProductVariant {
  return (item.variant as ProductVariant) || "single";
}

/**
 * Gets the price for a specific variant
 */
export function getVariantPrice(variant: ProductVariant): number {
  return variant === "box"
    ? PRODUCT_CONFIG.box.pricePerUnit
    : PRODUCT_CONFIG.single.pricePerUnit;
}

/**
 * Gets the increment (minimum/step) for a specific variant
 */
export function getVariantIncrement(variant: ProductVariant): number {
  return variant === "box"
    ? PRODUCT_CONFIG.box.increment
    : PRODUCT_CONFIG.single.increment;
}

/**
 * Gets the unit label for a specific variant
 */
export function getVariantUnit(variant: ProductVariant, plural: boolean = true): string {
  if (variant === "box") {
    return plural ? PRODUCT_CONFIG.box.unitPlural : PRODUCT_CONFIG.box.unit;
  }
  return plural ? PRODUCT_CONFIG.single.unitPlural : PRODUCT_CONFIG.single.unit;
}

/**
 * Checks if a product has box variant available
 */
export function hasBoxVariant(product: Products): boolean {
  return Boolean(product.has_box);
}

/**
 * Gets available variants for a product
 */
export function getAvailableVariants(product: Products): ProductVariant[] {
  const variants: ProductVariant[] = ["single"];
  if (product.has_box) {
    variants.push("box");
  }
  return variants;
}

/**
 * Validates quantity for a specific variant
 */
export function isValidVariantQuantity(variant: ProductVariant, quantity: number): boolean {
  const increment = getVariantIncrement(variant);
  return quantity > 0 && quantity % increment === 0;
}

/**
 * Rounds quantity to valid increment for a variant
 */
export function roundToVariantIncrement(variant: ProductVariant, quantity: number): number {
  const increment = getVariantIncrement(variant);
  if (quantity <= 0) return increment;
  return Math.ceil(quantity / increment) * increment;
}

// ============================================================================
// Quantity Validation
// ============================================================================

/**
 * Determines if a product is sold as a box set
 */
export function isBoxProduct(product: Products): boolean {
  return Boolean(product.has_box);
}

/**
 * Gets the increment for a product (6 for singles, 4 for boxes)
 */
export function getProductIncrement(product: Products): number {
  return isBoxProduct(product)
    ? PRODUCT_CONFIG.box.increment
    : PRODUCT_CONFIG.single.increment;
}

/**
 * Gets the unit label for a product
 */
export function getProductUnit(product: Products, plural: boolean = true): string {
  if (isBoxProduct(product)) {
    return plural ? PRODUCT_CONFIG.box.unitPlural : PRODUCT_CONFIG.box.unit;
  }
  return plural ? PRODUCT_CONFIG.single.unitPlural : PRODUCT_CONFIG.single.unit;
}

/**
 * Validates if a quantity is a valid increment for a product
 */
export function isValidQuantity(product: Products, quantity: number): boolean {
  const increment = getProductIncrement(product);
  return quantity > 0 && quantity % increment === 0;
}

/**
 * Rounds a quantity up to the nearest valid increment
 */
export function roundToIncrement(product: Products, quantity: number): number {
  const increment = getProductIncrement(product);
  if (quantity <= 0) return increment;
  return Math.ceil(quantity / increment) * increment;
}

/**
 * Rounds a quantity down to the nearest valid increment
 */
export function roundDownToIncrement(product: Products, quantity: number): number {
  const increment = getProductIncrement(product);
  if (quantity < increment) return 0;
  return Math.floor(quantity / increment) * increment;
}

/**
 * Gets the next valid quantity (current + increment)
 */
export function getNextQuantity(product: Products, currentQuantity: number): number {
  const increment = getProductIncrement(product);
  return currentQuantity + increment;
}

/**
 * Gets the previous valid quantity (current - increment, minimum 0)
 */
export function getPreviousQuantity(product: Products, currentQuantity: number): number {
  const increment = getProductIncrement(product);
  return Math.max(0, currentQuantity - increment);
}

/**
 * Checks if a category is eligible for box sets
 */
export function isCategoryBoxEligible(category: string | null): boolean {
  if (!category) return false;
  return BOX_ELIGIBLE_CATEGORIES.includes(category as typeof BOX_ELIGIBLE_CATEGORIES[number]);
}

// ============================================================================
// Price Calculations
// ============================================================================

/**
 * Calculates the line total for a cart item
 */
export function calculateLineTotal(item: CartItems): number {
  return Number(item.quantity) * Number(item.unit_price);
}

/**
 * Calculates the total for a cart item using current product price
 * (in case price has been updated since item was added)
 */
export function calculateLineTotalFromProduct(
  quantity: number,
  product: Products
): number {
  return quantity * Number(product.wholesale_price);
}

/**
 * Calculates how many "sets" a quantity represents
 */
export function calculateSets(product: Products, quantity: number): number {
  const increment = getProductIncrement(product);
  return Math.floor(quantity / increment);
}

/**
 * Calculates total cards for a quantity (boxes contain 6 cards each)
 */
export function calculateTotalCards(product: Products, quantity: number): number {
  if (isBoxProduct(product)) {
    return quantity * PRODUCT_CONFIG.box.cardsPerBox;
  }
  return quantity;
}

/**
 * Calculates total cards for a variant and quantity
 */
export function calculateTotalCardsForVariant(variant: ProductVariant, quantity: number): number {
  if (variant === "box") {
    return quantity * PRODUCT_CONFIG.box.cardsPerBox;
  }
  return quantity;
}

// ============================================================================
// Cart Totals
// ============================================================================

/**
 * Calculates all cart totals from a list of cart items
 */
export function calculateCartTotals(items: CartItemWithProduct[]): CartTotals {
  let subtotal = 0;
  let itemCount = 0;
  let estimatedWeight = 0;

  for (const item of items) {
    const quantity = Number(item.quantity);
    const unitPrice = Number(item.unit_price);
    const variant = getCartItemVariant(item);
    
    subtotal += quantity * unitPrice;
    itemCount += quantity;

    // Calculate weight based on variant
    if (item.product?.weight_oz) {
      estimatedWeight += quantity * Number(item.product.weight_oz);
    } else if (variant === "box") {
      estimatedWeight += quantity * SHIPPING_WEIGHTS.boxSet;
    } else {
      estimatedWeight += quantity * SHIPPING_WEIGHTS.cardWithEnvelope;
    }
  }

  const amountToMinimum = Math.max(0, MINIMUM_ORDER_AMOUNT - subtotal);
  const percentToMinimum = Math.min(100, (subtotal / MINIMUM_ORDER_AMOUNT) * 100);

  return {
    subtotal,
    itemCount,
    productCount: items.length,
    estimatedWeight,
    meetsMinimum: subtotal >= MINIMUM_ORDER_AMOUNT,
    amountToMinimum,
    percentToMinimum,
  };
}

/**
 * Quick check if a subtotal meets the minimum order requirement
 */
export function meetsMinimumOrder(subtotal: number): boolean {
  return subtotal >= MINIMUM_ORDER_AMOUNT;
}

/**
 * Calculates how much more needs to be added to meet minimum
 */
export function getAmountToMinimum(subtotal: number): number {
  return Math.max(0, MINIMUM_ORDER_AMOUNT - subtotal);
}

// ============================================================================
// Shipping Estimates
// ============================================================================

/**
 * Calculates shipping cost based on weight and method
 */
export function calculateShippingCost(
  weightOz: number,
  method: ShippingMethod = "standard"
): number {
  const rate = SHIPPING_RATES[method];
  const weightLbs = weightOz / 16;
  return rate.baseRate + weightLbs * rate.perOzRate * 16;
}

/**
 * Gets all shipping estimates for a given weight
 */
export function getShippingEstimates(weightOz: number): ShippingEstimate[] {
  return [
    {
      method: "standard" as ShippingMethod,
      label: "Standard Shipping",
      rate: calculateShippingCost(weightOz, "standard"),
      estimatedDays: SHIPPING_RATES.standard.estimatedDays,
    },
    {
      method: "priority" as ShippingMethod,
      label: "Priority Shipping",
      rate: calculateShippingCost(weightOz, "priority"),
      estimatedDays: SHIPPING_RATES.priority.estimatedDays,
    },
    {
      method: "express" as ShippingMethod,
      label: "Express Shipping",
      rate: calculateShippingCost(weightOz, "express"),
      estimatedDays: SHIPPING_RATES.express.estimatedDays,
    },
  ];
}

/**
 * Estimates weight for a cart based on items
 */
export function estimateCartWeight(items: CartItemWithProduct[]): number {
  let weight = 0;

  for (const item of items) {
    const quantity = Number(item.quantity);
    
    if (item.product?.weight_oz) {
      weight += quantity * Number(item.product.weight_oz);
    } else if (item.product && isBoxProduct(item.product)) {
      weight += quantity * SHIPPING_WEIGHTS.boxSet;
    } else {
      weight += quantity * SHIPPING_WEIGHTS.cardWithEnvelope;
    }
  }

  return weight;
}

// ============================================================================
// Display Helpers
// ============================================================================

/**
 * Gets a human-readable quantity description
 * e.g., "12 cards (2 sets of 6)" or "8 boxes (2 sets of 4)"
 */
export function getQuantityDescription(product: Products, quantity: number): string {
  const unit = getProductUnit(product, quantity !== 1);
  const sets = calculateSets(product, quantity);
  const increment = getProductIncrement(product);

  if (sets === 1) {
    return `${quantity} ${unit}`;
  }
  return `${quantity} ${unit} (${sets} sets of ${increment})`;
}

/**
 * Gets a human-readable quantity description for a variant
 */
export function getVariantQuantityDescription(variant: ProductVariant, quantity: number): string {
  const unit = getVariantUnit(variant, quantity !== 1);
  const increment = getVariantIncrement(variant);
  const sets = Math.floor(quantity / increment);

  if (sets <= 1) {
    return `${quantity} ${unit}`;
  }
  return `${quantity} ${unit} (${sets} sets of ${increment})`;
}

/**
 * Gets display label for a variant
 */
export function getVariantLabel(variant: ProductVariant): string {
  return variant === "box" ? "Box Set" : "Single Cards";
}

/**
 * Gets detailed variant info for display
 */
export function getVariantInfo(variant: ProductVariant): {
  label: string;
  price: number;
  increment: number;
  unit: string;
  description: string;
} {
  if (variant === "box") {
    return {
      label: "Box Set",
      price: PRODUCT_CONFIG.box.pricePerUnit,
      increment: PRODUCT_CONFIG.box.increment,
      unit: PRODUCT_CONFIG.box.unit,
      description: `$${PRODUCT_CONFIG.box.pricePerUnit}/box (${PRODUCT_CONFIG.box.cardsPerBox} cards) • Min ${PRODUCT_CONFIG.box.increment} boxes`,
    };
  }
  return {
    label: "Single Cards",
    price: PRODUCT_CONFIG.single.pricePerUnit,
    increment: PRODUCT_CONFIG.single.increment,
    unit: PRODUCT_CONFIG.single.unit,
    description: `$${PRODUCT_CONFIG.single.pricePerUnit}/card • Min ${PRODUCT_CONFIG.single.increment} cards`,
  };
}

/**
 * Gets the minimum order message
 */
export function getMinimumOrderMessage(subtotal: number): string {
  const amount = getAmountToMinimum(subtotal);
  if (amount <= 0) {
    return "Minimum order met!";
  }
  return `Add $${amount.toFixed(2)} more to meet the $${MINIMUM_ORDER_AMOUNT} minimum`;
}

/**
 * Gets a descriptive label for box set eligibility
 */
export function getBoxSetLabel(product: Products): string | null {
  if (!product.has_box) return null;
  return "Available as box set";
}

// ============================================================================
// Cart Item Helpers
// ============================================================================

/**
 * Checks if a product already exists in cart items
 */
export function findCartItem(
  items: CartItems[],
  productId: string
): CartItems | undefined {
  return items.find((item) => item.product_id === productId);
}

/**
 * Finds a cart item by product ID and variant
 */
export function findCartItemByVariant(
  items: CartItems[],
  productId: string,
  variant: ProductVariant
): CartItems | undefined {
  return items.find(
    (item) => item.product_id === productId && getCartItemVariant(item) === variant
  );
}

/**
 * Checks if adding a quantity would be valid
 */
export function canAddToCart(
  product: Products,
  existingQuantity: number,
  addQuantity: number
): boolean {
  const newTotal = existingQuantity + addQuantity;
  return isValidQuantity(product, newTotal);
}

/**
 * Checks if adding a quantity would be valid for a variant
 */
export function canAddVariantToCart(
  variant: ProductVariant,
  existingQuantity: number,
  addQuantity: number
): boolean {
  const newTotal = existingQuantity + addQuantity;
  return isValidVariantQuantity(variant, newTotal);
}

/**
 * Gets the initial quantity when adding a product to cart
 * Returns the minimum increment
 */
export function getInitialQuantity(product: Products): number {
  return getProductIncrement(product);
}

/**
 * Gets the initial quantity for a variant
 */
export function getInitialVariantQuantity(variant: ProductVariant): number {
  return getVariantIncrement(variant);
}

