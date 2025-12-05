import { z } from "zod";

export const cartItemsSortColumns = [
  "id",
  "cart_id",
  "product_id",
  "quantity",
  "unit_price",
  "created_at",
  "updated_at",
] as const;

const base = z.object({
  id: z.uuid().optional(),
  cart_id: z.uuid().optional(),
  product_id: z.uuid().optional(),
  quantity: z.coerce.number().optional(),
  unit_price: z.coerce.number().optional(),
  created_at: z.coerce.date().optional(),
  updated_at: z.coerce.date().optional(),
});

export const cartItemsValidator = {
  id: z.object({
    id: z.string().uuid(),
  }),

  create: base.required({
    cart_id: true,
    product_id: true,
    quantity: true,
    unit_price: true,
  }),

  query: base.extend({
    order_by: z
      .enum(cartItemsSortColumns)
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

export type CreateCartItemsInput = z.infer<typeof cartItemsValidator.create>;
export type QueryCartItemsInput = z.infer<typeof cartItemsValidator.query>;
export type UpdateCartItemsInput = z.infer<typeof cartItemsValidator.update>;