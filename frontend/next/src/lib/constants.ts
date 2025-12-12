/**
 * Application constants and business configuration
 * Central location for all configurable values
 */

// ============================================================================
// App Metadata
// ============================================================================

export const title = "Lucky Bee Press";
export const description =
  "Premium letterpress wholesale ordering for retailers and boutiques.";
export const tagline = "Artisan Letterpress Since 2008";

// ============================================================================
// Business Branding
// ============================================================================

export const BRAND = {
  name: "Lucky Bee Press",
  shortName: "LBP",
  tagline: "Artisan Letterpress Since 2008",
  yearsInBusiness: 17,
  etsyRating: 5,
  reviewCount: 2000,
  salesCount: 10000,
  established: 2008,
} as const;

// ============================================================================
// Product Configuration
// ============================================================================

export const PRODUCT_TYPES = {
  SINGLE: "single",
  BOX: "box",
} as const;

export type ProductType = (typeof PRODUCT_TYPES)[keyof typeof PRODUCT_TYPES];

/**
 * Product pricing and quantity configuration
 * Singles: Sold in increments of 6 cards at $3/card ($18/set)
 * Boxes: Sold in increments of 4 boxes at $11/box ($44/set)
 */
export const PRODUCT_CONFIG = {
  single: {
    increment: 6, // Cards per set
    pricePerUnit: 3, // $3 per card
    pricePerSet: 18, // $18 per set of 6
    unit: "card",
    unitPlural: "cards",
  },
  box: {
    increment: 4, // Boxes per set
    pricePerUnit: 11, // $11 per box
    pricePerSet: 44, // $44 per set of 4
    cardsPerBox: 6, // 6 cards in each box
    unit: "box",
    unitPlural: "boxes",
  },
} as const;

/**
 * Categories that support box sets (Holiday and Thank You only)
 */
export const BOX_ELIGIBLE_CATEGORIES = ["Holiday", "Thank You"] as const;

// ============================================================================
// Order Configuration
// ============================================================================

/**
 * Minimum order value in USD
 */
export const MINIMUM_ORDER_AMOUNT = 150;

/**
 * Order status values
 */
export const ORDER_STATUS = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  PROCESSING: "processing",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
} as const;

export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];

/**
 * Payment status values
 */
export const PAYMENT_STATUS = {
  PENDING: "pending",
  PAID: "paid",
  PARTIAL: "partial",
  OVERDUE: "overdue",
  REFUNDED: "refunded",
} as const;

export type PaymentStatus =
  (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS];

/**
 * Payment method values
 */
export const PAYMENT_METHOD = {
  CREDIT_CARD: "credit_card",
  NET_30: "net_30",
} as const;

export type PaymentMethod =
  (typeof PAYMENT_METHOD)[keyof typeof PAYMENT_METHOD];

/**
 * Payment method display labels
 */
export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  credit_card: "Credit Card",
  net_30: "Net 30",
};

// ============================================================================
// Cart Configuration
// ============================================================================

export const CART_STATUS = {
  ACTIVE: "active",
  ABANDONED: "abandoned",
  CONVERTED: "converted",
} as const;

export type CartStatus = (typeof CART_STATUS)[keyof typeof CART_STATUS];

// ============================================================================
// Shipping Configuration
// ============================================================================

/**
 * Estimated weight per product type (in ounces)
 */
export const SHIPPING_WEIGHTS = {
  cardWithEnvelope: 1.2, // Single card + envelope
  boxSet: 8.0, // Box of 6 cards + envelopes + packaging
} as const;

/**
 * Shipping carriers
 */
export const CARRIERS = ["USPS", "UPS", "FedEx"] as const;
export type Carrier = (typeof CARRIERS)[number];

/**
 * Estimated shipping rates (simplified flat rates)
 * Real implementation would use carrier API
 */
export const SHIPPING_RATES = {
  standard: {
    baseRate: 8.95,
    perOzRate: 0.25,
    estimatedDays: "5-7",
  },
  priority: {
    baseRate: 14.95,
    perOzRate: 0.35,
    estimatedDays: "2-3",
  },
  express: {
    baseRate: 24.95,
    perOzRate: 0.5,
    estimatedDays: "1-2",
  },
} as const;

export type ShippingMethod = keyof typeof SHIPPING_RATES;

// ============================================================================
// Customer Configuration
// ============================================================================

export const ACCOUNT_STATUS = {
  PENDING: "pending",
  ACTIVE: "active",
  SUSPENDED: "suspended",
} as const;

export type AccountStatus =
  (typeof ACCOUNT_STATUS)[keyof typeof ACCOUNT_STATUS];

/**
 * Default net terms for new customers (0 = credit card only)
 * Net 30 is granted after established relationship
 */
export const DEFAULT_NET_TERMS = 0;

/**
 * Number of successful orders before Net 30 eligibility
 */
export const NET_30_ORDER_THRESHOLD = 3;

// ============================================================================
// Address Configuration
// ============================================================================

export const ADDRESS_TYPES = {
  SHIPPING: "shipping",
  BILLING: "billing",
} as const;

export type AddressType = (typeof ADDRESS_TYPES)[keyof typeof ADDRESS_TYPES];

/**
 * US States for address selection
 */
export const US_STATES = [
  { value: "AL", label: "Alabama" },
  { value: "AK", label: "Alaska" },
  { value: "AZ", label: "Arizona" },
  { value: "AR", label: "Arkansas" },
  { value: "CA", label: "California" },
  { value: "CO", label: "Colorado" },
  { value: "CT", label: "Connecticut" },
  { value: "DE", label: "Delaware" },
  { value: "FL", label: "Florida" },
  { value: "GA", label: "Georgia" },
  { value: "HI", label: "Hawaii" },
  { value: "ID", label: "Idaho" },
  { value: "IL", label: "Illinois" },
  { value: "IN", label: "Indiana" },
  { value: "IA", label: "Iowa" },
  { value: "KS", label: "Kansas" },
  { value: "KY", label: "Kentucky" },
  { value: "LA", label: "Louisiana" },
  { value: "ME", label: "Maine" },
  { value: "MD", label: "Maryland" },
  { value: "MA", label: "Massachusetts" },
  { value: "MI", label: "Michigan" },
  { value: "MN", label: "Minnesota" },
  { value: "MS", label: "Mississippi" },
  { value: "MO", label: "Missouri" },
  { value: "MT", label: "Montana" },
  { value: "NE", label: "Nebraska" },
  { value: "NV", label: "Nevada" },
  { value: "NH", label: "New Hampshire" },
  { value: "NJ", label: "New Jersey" },
  { value: "NM", label: "New Mexico" },
  { value: "NY", label: "New York" },
  { value: "NC", label: "North Carolina" },
  { value: "ND", label: "North Dakota" },
  { value: "OH", label: "Ohio" },
  { value: "OK", label: "Oklahoma" },
  { value: "OR", label: "Oregon" },
  { value: "PA", label: "Pennsylvania" },
  { value: "RI", label: "Rhode Island" },
  { value: "SC", label: "South Carolina" },
  { value: "SD", label: "South Dakota" },
  { value: "TN", label: "Tennessee" },
  { value: "TX", label: "Texas" },
  { value: "UT", label: "Utah" },
  { value: "VT", label: "Vermont" },
  { value: "VA", label: "Virginia" },
  { value: "WA", label: "Washington" },
  { value: "WV", label: "West Virginia" },
  { value: "WI", label: "Wisconsin" },
  { value: "WY", label: "Wyoming" },
  { value: "DC", label: "District of Columbia" },
] as const;

// ============================================================================
// Product Specifications (for display)
// ============================================================================

export const PRODUCT_SPECS = {
  cardSize: 'A2 (5.5" × 4.25")',
  material: "100% cotton cardstock",
  printing: "Letterpress with hand-mixed inks",
  envelope: "Recycled envelope included",
} as const;

// ============================================================================
// Pagination Defaults
// ============================================================================

export const PAGINATION = {
  defaultLimit: 12,
  maxLimit: 100,
  productGridLimit: 24,
  orderHistoryLimit: 10,
  adminTableLimit: 25,
} as const;

// ============================================================================
// Sort Options
// ============================================================================

export const PRODUCT_SORT_OPTIONS = [
  { value: "name:asc", label: "Name (A-Z)" },
  { value: "name:desc", label: "Name (Z-A)" },
  { value: "wholesale_price:asc", label: "Price (Low to High)" },
  { value: "wholesale_price:desc", label: "Price (High to Low)" },
  { value: "created_at:desc", label: "Newest First" },
  { value: "created_at:asc", label: "Oldest First" },
] as const;

export const ORDER_SORT_OPTIONS = [
  { value: "order_date:desc", label: "Most Recent" },
  { value: "order_date:asc", label: "Oldest First" },
  { value: "total_amount:desc", label: "Highest Value" },
  { value: "total_amount:asc", label: "Lowest Value" },
] as const;
