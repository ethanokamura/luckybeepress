export interface Addresses {
  id: string | null;
  customer_id: string;
  address_type: string;
  is_default: boolean | null;
  company_name: string | null;
  street_address_1: string;
  street_address_2: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string | null;
  created_at: Date | null;
  updated_at: Date | null;
}