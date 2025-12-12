export interface Products {
  id: string | null;
  sku: string;
  name: string;
  description: string | null;
  category: string | null;
  wholesale_price: number;
  suggested_retail_price: number | null;
  cost: number | null;
  is_active: boolean | null;
  minimum_order_quantity: number | null;
  stock_quantity: number | null;
  low_stock_threshold: number | null;
  image_url: string | null;
  weight_oz: number | null;
  created_at: Date | null;
  updated_at: Date | null;
}