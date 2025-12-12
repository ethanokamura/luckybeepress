import { z } from "zod";
import { productsSortColumns } from "./columns.ts";
import { booleanFromString } from "../../utils/validator.ts";

const base = z.object({
  sku: z.string().optional(),
  name: z.string().optional(),
  description: z.string().optional(),
  category: z.string().optional(),
  wholesale_price: z.coerce.number().optional(),
  suggested_retail_price: z.coerce.number().optional(),
  cost: z.coerce.number().optional(),
  is_active: booleanFromString.nullable(),
  minimum_order_quantity: z.coerce.number().optional(),
  has_box: booleanFromString.nullable(),
  stock_quantity: z.coerce.number().optional(),
  low_stock_threshold: z.coerce.number().optional(),
  image_url: z.string().optional(),
  weight_oz: z.coerce.number().optional(),
});

export const productsValidator = {
  id: z.object({
    id: z.uuid(),
  }),

  create: base.required({
    sku: true,
    name: true,
    wholesale_price: true,
  }),

  query: base.extend({
    order_by: z.enum(productsSortColumns).optional().default("created_at"),
    order: z.enum(["asc", "desc"]).optional().default("desc"),
    limit: z.coerce.number().positive().max(100).optional().default(10),
    cursor: z.string().optional(),
  }),

  update: base.refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  }),
};
