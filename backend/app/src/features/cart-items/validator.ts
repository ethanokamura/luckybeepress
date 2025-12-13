import { z } from "zod";
import { cartItemsSortColumns } from "./columns.ts";

const variantEnum = z.enum(["single", "box"]);

const base = z.object({
  cart_id: z.string().optional(),
  product_id: z.string().optional(),
  variant: variantEnum.optional(),
  quantity: z.coerce.number().optional(),
  unit_price: z.coerce.number().optional(),
});

export const cartItemsValidator = {
  id: z.object({
    id: z.uuid(),
  }),

  create: base.required({
    cart_id: true,
    product_id: true,
    quantity: true,
    unit_price: true,
  }),

  query: base.extend({
    order_by: z.enum(cartItemsSortColumns).optional().default("created_at"),
    order: z.enum(["asc", "desc"]).optional().default("desc"),
    limit: z.coerce.number().positive().max(100).optional().default(10),
    cursor: z.string().optional(),
  }),

  update: base.refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  }),
};
