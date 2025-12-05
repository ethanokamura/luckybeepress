export const productsColumns: string[] = [
  "id",
  "sku",
  "name",
  "description",
  "category",
  "wholesale_price",
  "suggested_retail_price",
  "cost",
  "is_active",
  "minimum_order_quantity",
  "stock_quantity",
  "low_stock_threshold",
  "image_url",
  "weight_oz",
  "created_at",
  "updated_at",
];

export const productsNonNullableColumns: string[] = [
  "sku",
  "name",
  "wholesale_price",
];

export const productsNullableColumns: string[] = [
  "id",
  "description",
  "category",
  "suggested_retail_price",
  "cost",
  "is_active",
  "minimum_order_quantity",
  "stock_quantity",
  "low_stock_threshold",
  "image_url",
  "weight_oz",
  "created_at",
  "updated_at",
];

export const productsSortColumns: string[] = [
  "id",
  "sku",
  "name",
  "description",
  "category",
  "wholesale_price",
  "suggested_retail_price",
  "cost",
  "is_active",
  "minimum_order_quantity",
  "stock_quantity",
  "low_stock_threshold",
  "image_url",
  "weight_oz",
  "created_at",
  "updated_at",
];

export const productsTimeStampColumns: string[] = [
  "created_at",
  "updated_at",
];

export const productsNumberColumns: string[] = [
  "wholesale_price",
  "suggested_retail_price",
  "cost",
  "minimum_order_quantity",
  "stock_quantity",
  "low_stock_threshold",
  "weight_oz",
];
