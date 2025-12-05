export interface Customers {
  id: string | null;
  business_name: string;
  contact_name: string | null;
  email: string;
  phone: string | null;
  tax_id: string | null;
  account_status: string | null;
  net_terms: number | null;
  discount_percentage: number | null;
  first_order_date: Date | null;
  total_orders: number | null;
  lifetime_value: number | null;
  notes: string | null;
  created_at: Date | null;
  updated_at: Date | null;
}