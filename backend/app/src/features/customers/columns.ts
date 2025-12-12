export const customersColumns: string[] = [
  "id",
  "business_name",
  "contact_name",
  "email",
  "phone",
  "tax_id",
  "account_status",
  "net_terms",
  "discount_percentage",
  "first_order_date",
  "total_orders",
  "lifetime_value",
  "notes",
  "created_at",
  "updated_at",
];

export const customersNonNullableColumns: string[] = [
  "business_name",
  "email",
];

export const customersNullableColumns: string[] = [
  "id",
  "contact_name",
  "phone",
  "tax_id",
  "account_status",
  "net_terms",
  "discount_percentage",
  "first_order_date",
  "total_orders",
  "lifetime_value",
  "notes",
  "created_at",
  "updated_at",
];

export const customersSortColumns: string[] = [
  "id",
  "business_name",
  "contact_name",
  "email",
  "phone",
  "tax_id",
  "account_status",
  "net_terms",
  "discount_percentage",
  "first_order_date",
  "total_orders",
  "lifetime_value",
  "notes",
  "created_at",
  "updated_at",
];

export const customersTimeStampColumns: string[] = [
  "first_order_date",
  "created_at",
  "updated_at",
];

export const customersNumberColumns: string[] = [
  "net_terms",
  "discount_percentage",
  "total_orders",
  "lifetime_value",
];
