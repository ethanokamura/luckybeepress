import { Products } from "@/types/products";
import { Orders } from "@/types/orders";
import { Customers } from "@/types/customers";

// Mock Product Data - Letterpress Greeting Cards
export const mockProducts: Products[] = [
  {
    id: "prod_001",
    sku: "LP-BDAY-001",
    name: "Happy Birthday Floral",
    description:
      "Elegant letterpress birthday card featuring hand-drawn florals. Deep impression on 100% cotton paper. Blank inside.",
    category: "Birthday",
    wholesale_price: 2.75,
    suggested_retail_price: 6.0,
    cost: 1.5,
    is_active: true,
    minimum_order_quantity: 6,
    stock_quantity: 245,
    low_stock_threshold: 50,
    image_url: "/images/bee.png",
    weight_oz: 0.5,
    created_at: new Date("2024-01-15"),
    updated_at: new Date("2024-12-01"),
  },
  {
    id: "prod_002",
    sku: "LP-THANK-002",
    name: "Thank You Botanical",
    description:
      "Classic thank you card with botanical illustration. Gold foil accents. Includes kraft envelope.",
    category: "Thank You",
    wholesale_price: 3.0,
    suggested_retail_price: 6.0,
    cost: 1.75,
    is_active: true,
    minimum_order_quantity: 6,
    stock_quantity: 180,
    low_stock_threshold: 50,
    image_url: "/images/bee.png",
    weight_oz: 0.5,
    created_at: new Date("2024-01-20"),
    updated_at: new Date("2024-11-28"),
  },
  {
    id: "prod_003",
    sku: "LP-CONG-003",
    name: "Congratulations Confetti",
    description:
      "Playful congratulations card with colorful confetti pattern. Deep letterpress impression.",
    category: "Congratulations",
    wholesale_price: 2.5,
    suggested_retail_price: 6.0,
    cost: 1.4,
    is_active: true,
    minimum_order_quantity: 6,
    stock_quantity: 320,
    low_stock_threshold: 50,
    image_url: "/images/bee.png",
    weight_oz: 0.5,
    created_at: new Date("2024-02-01"),
    updated_at: new Date("2024-12-03"),
  },
  {
    id: "prod_004",
    sku: "LP-LOVE-004",
    name: "Anniversary Hearts",
    description:
      "Romantic anniversary card with interlocking hearts. Rose gold foil detail. A2 size.",
    category: "Anniversary",
    wholesale_price: 3.25,
    suggested_retail_price: 6.0,
    cost: 1.85,
    is_active: true,
    minimum_order_quantity: 6,
    stock_quantity: 95,
    low_stock_threshold: 50,
    image_url: "/images/bee.png",
    weight_oz: 0.5,
    created_at: new Date("2024-02-10"),
    updated_at: new Date("2024-12-02"),
  },
  {
    id: "prod_005",
    sku: "LP-SYMP-005",
    name: "Sympathy Lily",
    description:
      "Elegant sympathy card with lily illustration. Soft gray letterpress on cream paper.",
    category: "Sympathy",
    wholesale_price: 3.5,
    suggested_retail_price: 6.0,
    cost: 2.0,
    is_active: true,
    minimum_order_quantity: 4,
    stock_quantity: 150,
    low_stock_threshold: 30,
    image_url: "/images/bee.png",
    weight_oz: 0.5,
    created_at: new Date("2024-02-15"),
    updated_at: new Date("2024-11-30"),
  },
  {
    id: "prod_006",
    sku: "LP-HOLI-006",
    name: "Holiday Joy Wreath",
    description:
      "Festive holiday card with wreath design. Red and green letterpress. Gold foil accents.",
    category: "Holiday",
    wholesale_price: 3.75,
    suggested_retail_price: 6.0,
    cost: 2.1,
    is_active: true,
    minimum_order_quantity: 8,
    stock_quantity: 420,
    low_stock_threshold: 100,
    image_url: "/images/bee.png",
    weight_oz: 0.6,
    created_at: new Date("2024-08-01"),
    updated_at: new Date("2024-12-04"),
  },
  {
    id: "prod_007",
    sku: "LP-BABY-007",
    name: "Welcome Baby Elephant",
    description:
      "Sweet baby card featuring hand-drawn elephant. Unisex design. Blank inside.",
    category: "Baby",
    wholesale_price: 2.9,
    suggested_retail_price: 6.0,
    cost: 1.6,
    is_active: true,
    minimum_order_quantity: 6,
    stock_quantity: 210,
    low_stock_threshold: 50,
    image_url: "/images/bee.png",
    weight_oz: 0.5,
    created_at: new Date("2024-03-01"),
    updated_at: new Date("2024-11-29"),
  },
  {
    id: "prod_008",
    sku: "LP-GRAD-008",
    name: "Graduation Cap Toss",
    description:
      "Celebratory graduation card with cap design. Gold foil details. Includes envelope.",
    category: "Graduation",
    wholesale_price: 3.1,
    suggested_retail_price: 6.0,
    cost: 1.7,
    is_active: true,
    minimum_order_quantity: 6,
    stock_quantity: 85,
    low_stock_threshold: 40,
    image_url: "/images/bee.png",
    weight_oz: 0.5,
    created_at: new Date("2024-03-15"),
    updated_at: new Date("2024-12-01"),
  },
  {
    id: "prod_009",
    sku: "LP-JUST-009",
    name: "Just Because Sunshine",
    description:
      "Cheerful 'thinking of you' card with sunshine motif. Bright yellow letterpress.",
    category: "Just Because",
    wholesale_price: 2.6,
    suggested_retail_price: 6.0,
    cost: 1.45,
    is_active: true,
    minimum_order_quantity: 6,
    stock_quantity: 195,
    low_stock_threshold: 50,
    image_url: "/images/bee.png",
    weight_oz: 0.5,
    created_at: new Date("2024-04-01"),
    updated_at: new Date("2024-12-02"),
  },
  {
    id: "prod_010",
    sku: "LP-WEDD-010",
    name: "Wedding Bells Elegant",
    description:
      "Sophisticated wedding card with classic bell design. Navy letterpress with gold foil.",
    category: "Wedding",
    wholesale_price: 4.0,
    suggested_retail_price: 6.0,
    cost: 2.25,
    is_active: true,
    minimum_order_quantity: 4,
    stock_quantity: 125,
    low_stock_threshold: 40,
    image_url: "/images/bee.png",
    weight_oz: 0.6,
    created_at: new Date("2024-04-15"),
    updated_at: new Date("2024-12-03"),
  },
  {
    id: "prod_011",
    sku: "LP-BDAY-011",
    name: "Birthday Cake Celebration",
    description:
      "Fun birthday card with illustrated layer cake. Multiple color letterpress.",
    category: "Birthday",
    wholesale_price: 2.85,
    suggested_retail_price: 6.0,
    cost: 1.55,
    is_active: true,
    minimum_order_quantity: 6,
    stock_quantity: 270,
    low_stock_threshold: 50,
    image_url: "/images/bee.png",
    weight_oz: 0.5,
    created_at: new Date("2024-05-01"),
    updated_at: new Date("2024-12-04"),
  },
  {
    id: "prod_012",
    sku: "LP-THANK-012",
    name: "Thank You Geometric",
    description:
      "Modern thank you card with geometric pattern. Teal and gold letterpress.",
    category: "Thank You",
    wholesale_price: 2.95,
    suggested_retail_price: 6.0,
    cost: 1.65,
    is_active: true,
    minimum_order_quantity: 6,
    stock_quantity: 30,
    low_stock_threshold: 50,
    image_url: "/images/bee.png",
    weight_oz: 0.5,
    created_at: new Date("2024-05-15"),
    updated_at: new Date("2024-11-27"),
  },
];

// Mock Customer Data
export const mockCustomers: Customers[] = [
  {
    id: "cust_001",
    business_name: "Sunshine Stationery & Gifts",
    contact_name: "Sarah Johnson",
    email: "sarah@sunshinestationery.com",
    phone: "(831) 419-0778",
    tax_id: "12-3456789",
    account_status: "active",
    net_terms: 30,
    discount_percentage: 5,
    first_order_date: new Date("2023-03-15"),
    total_orders: 24,
    lifetime_value: 8450.0,
    notes:
      "Great customer, always pays on time. Prefers birthday and thank you cards.",
    created_at: new Date("2023-03-15"),
    updated_at: new Date("2024-12-01"),
  },
  {
    id: "cust_002",
    business_name: "The Paper Trail Boutique",
    contact_name: "Michael Chen",
    email: "mike@papertrail.com",
    phone: "(555) 234-5678",
    tax_id: "23-4567890",
    account_status: "active",
    net_terms: 60,
    discount_percentage: 10,
    first_order_date: new Date("2022-08-20"),
    total_orders: 45,
    lifetime_value: 15200.0,
    notes: "High-volume buyer. Holiday cards sell particularly well.",
    created_at: new Date("2022-08-20"),
    updated_at: new Date("2024-11-30"),
  },
];

// Mock Order Data
export const mockOrders: Orders[] = [
  {
    id: "order_001",
    order_number: "ORD-2024-1205",
    customer_id: "cust_001",
    shipping_company_name: "Sunshine Stationery & Gifts",
    shipping_address_1: "123 Main Street",
    shipping_address_2: "Suite 200",
    shipping_city: "Santa Cruz",
    shipping_state: "OR",
    shipping_postal_code: "97201",
    shipping_country: "USA",
    shipping_phone: "(831) 419-0778",
    billing_company_name: "Sunshine Stationery & Gifts",
    billing_address_1: "123 Main Street",
    billing_address_2: "Suite 200",
    billing_city: "Santa Cruz",
    billing_state: "OR",
    billing_postal_code: "97201",
    billing_country: "USA",
    subtotal: 342.5,
    shipping_cost: 25.0,
    tax_amount: 0,
    discount_amount: 17.13,
    total_amount: 350.37,
    status: "processing",
    payment_status: "pending",
    payment_method: "Net 30",
    payment_due_date: new Date("2025-01-04"),
    order_date: new Date("2024-12-05"),
    ship_date: null,
    delivery_date: null,
    cancelled_date: null,
    tracking_number: null,
    carrier: null,
    internal_notes: null,
    customer_notes: "Please include extra envelopes if available",
    created_at: new Date("2024-12-05"),
    updated_at: new Date("2024-12-05"),
  },
  {
    id: "order_002",
    order_number: "ORD-2024-1128",
    customer_id: "cust_002",
    shipping_company_name: "The Paper Trail Boutique",
    shipping_address_1: "456 Oak Avenue",
    shipping_address_2: null,
    shipping_city: "Seattle",
    shipping_state: "WA",
    shipping_postal_code: "98101",
    shipping_country: "USA",
    shipping_phone: "(555) 234-5678",
    billing_company_name: "The Paper Trail Boutique",
    billing_address_1: "456 Oak Avenue",
    billing_address_2: null,
    billing_city: "Seattle",
    billing_state: "WA",
    billing_postal_code: "98101",
    billing_country: "USA",
    subtotal: 625.0,
    shipping_cost: 35.0,
    tax_amount: 0,
    discount_amount: 62.5,
    total_amount: 597.5,
    status: "shipped",
    payment_status: "pending",
    payment_method: "Net 60",
    payment_due_date: new Date("2025-01-27"),
    order_date: new Date("2024-11-28"),
    ship_date: new Date("2024-11-30"),
    delivery_date: null,
    cancelled_date: null,
    tracking_number: "1Z999AA10123456784",
    carrier: "UPS Ground",
    internal_notes: "Holiday rush order - prioritize shipping",
    customer_notes: null,
    created_at: new Date("2024-11-28"),
    updated_at: new Date("2024-11-30"),
  },
  {
    id: "order_003",
    order_number: "ORD-2024-1115",
    customer_id: "cust_001",
    shipping_company_name: "Sunshine Stationery & Gifts",
    shipping_address_1: "123 Main Street",
    shipping_address_2: "Suite 200",
    shipping_city: "Santa Cruz",
    shipping_state: "OR",
    shipping_postal_code: "97201",
    shipping_country: "USA",
    shipping_phone: "(831) 419-0778",
    billing_company_name: "Sunshine Stationery & Gifts",
    billing_address_1: "123 Main Street",
    billing_address_2: "Suite 200",
    billing_city: "Santa Cruz",
    billing_state: "OR",
    billing_postal_code: "97201",
    billing_country: "USA",
    subtotal: 285.0,
    shipping_cost: 20.0,
    tax_amount: 0,
    discount_amount: 14.25,
    total_amount: 290.75,
    status: "delivered",
    payment_status: "paid",
    payment_method: "Net 30",
    payment_due_date: new Date("2024-12-15"),
    order_date: new Date("2024-11-15"),
    ship_date: new Date("2024-11-16"),
    delivery_date: new Date("2024-11-20"),
    cancelled_date: null,
    tracking_number: "1Z999AA10123456785",
    carrier: "UPS Ground",
    internal_notes: null,
    customer_notes: null,
    created_at: new Date("2024-11-15"),
    updated_at: new Date("2024-11-20"),
  },
];

// Helper function to get products by category
export function getProductsByCategory(category: string): Products[] {
  return mockProducts.filter((p) => p.category === category);
}

// Helper function to get all unique categories
export function getCategories(): string[] {
  const categories = mockProducts
    .map((p) => p.category)
    .filter((cat): cat is string => cat !== null);
  return [...new Set(categories)].sort();
}

// Helper function to calculate discount
export function calculateDiscount(
  price: number,
  discountPercentage: number
): number {
  return price * (discountPercentage / 100);
}

// Helper function to format currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

// Helper function to format date
export function formatDate(date: Date | null): string {
  if (!date) return "N/A";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

// Helper function to get order status badge color
export function getOrderStatusColor(status: string | null): string {
  switch (status?.toLowerCase()) {
    case "pending":
      return "warning";
    case "confirmed":
    case "processing":
      return "info";
    case "shipped":
      return "primary";
    case "delivered":
      return "success";
    case "cancelled":
      return "error";
    default:
      return "neutral";
  }
}

// Helper function to get payment status badge color
export function getPaymentStatusColor(status: string | null): string {
  switch (status?.toLowerCase()) {
    case "paid":
      return "success";
    case "pending":
      return "warning";
    case "overdue":
      return "error";
    case "refunded":
      return "neutral";
    default:
      return "neutral";
  }
}
