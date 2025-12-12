export interface CartItems {
  id: string | null;
  cart_id: string;
  product_id: string;
  quantity: number;
  variant: string;
  unit_price: number;
  created_at: Date | null;
  updated_at: Date | null;
}
