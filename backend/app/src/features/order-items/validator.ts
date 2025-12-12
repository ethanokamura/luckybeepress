import { z } from "zod";
import {
  orderItemsSortColumns,
} from "./columns.ts";

const base = z.object({
  order_id: z.string().optional(),
  product_id: z.string().optional(),
  sku: z.string().optional(),
  product_name: z.string().optional(),
  quantity: z.coerce.number().optional(),
  unit_wholesale_price: z.coerce.number().optional(),
  unit_retail_price: z.coerce.number().optional(),
  subtotal: z.coerce.number().optional(),
  status: z.string().optional(),
});

export const orderItemsValidator = {
  id: z.object({
    id: z.uuid(),
  }),

  create: base.required({
    order_id: true,
    product_id: true,
    sku: true,
    product_name: true,
    quantity: true,
    unit_wholesale_price: true,
    subtotal: true,
  }),

  query: base.extend({
    order_by: z
      .enum(orderItemsSortColumns)
      .optional()
      .default("created_at"),
    order: z.enum(["asc", "desc"]).optional().default("desc"),
    limit: z.coerce.number().positive().max(100).optional().default(10),
    cursor: z.string().optional(),
  }),

  update: base.refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  }),
};
