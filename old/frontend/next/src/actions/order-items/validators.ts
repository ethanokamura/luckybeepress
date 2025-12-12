import { z } from "zod";

export const orderItemsSortColumns = [
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
] as const;

const base = z.object({
  id: z.uuid().optional(),
  order_id: z.uuid().optional(),
  product_id: z.uuid().optional(),
  sku: z.string().optional(),
  product_name: z.string().optional(),
  quantity: z.coerce.number().optional(),
  unit_wholesale_price: z.coerce.number().optional(),
  unit_retail_price: z.coerce.number().optional(),
  subtotal: z.coerce.number().optional(),
  status: z.string().optional(),
  created_at: z.coerce.date().optional(),
  updated_at: z.coerce.date().optional(),
});

export const orderItemsValidator = {
  id: z.object({
    id: z.string().uuid(),
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

export type CreateOrderItemsInput = z.infer<typeof orderItemsValidator.create>;
export type QueryOrderItemsInput = z.infer<typeof orderItemsValidator.query>;
export type UpdateOrderItemsInput = z.infer<typeof orderItemsValidator.update>;