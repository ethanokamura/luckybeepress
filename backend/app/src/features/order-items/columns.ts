export const orderItemsColumns: string[] = [
  "id",
  "order_id",
  "product_id",
  "sku",
  "product_name",
  "quantity",
  "unit_wholesale_price",
  "unit_retail_price",
  "subtotal",
  "status",
  "created_at",
  "updated_at",
];

export const orderItemsNonNullableColumns: string[] = [
  "order_id",
  "product_id",
  "sku",
  "product_name",
  "quantity",
  "unit_wholesale_price",
  "subtotal",
];

export const orderItemsNullableColumns: string[] = [
  "id",
  "unit_retail_price",
  "status",
  "created_at",
  "updated_at",
];

export const orderItemsSortColumns: string[] = [
  "id",
  "order_id",
  "product_id",
  "sku",
  "product_name",
  "quantity",
  "unit_wholesale_price",
  "unit_retail_price",
  "subtotal",
  "status",
  "created_at",
  "updated_at",
];

export const orderItemsTimeStampColumns: string[] = [
  "created_at",
  "updated_at",
];

export const orderItemsNumberColumns: string[] = [
  "quantity",
  "unit_wholesale_price",
  "unit_retail_price",
  "subtotal",
];
