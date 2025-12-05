export interface OrderItems {
  id: string | null;
  order_id: string;
  product_id: string;
  sku: string;
  product_name: string;
  quantity: number;
  unit_wholesale_price: number;
  unit_retail_price: number | null;
  subtotal: number;
  status: string | null;
  created_at: Date | null;
  updated_at: Date | null;
}