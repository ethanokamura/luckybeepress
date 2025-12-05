import { z } from "zod";

export const cartsSortColumns = [
  "id",
  "customer_id",
  "status",
  "created_at",
  "updated_at",
] as const;

const base = z.object({
  id: z.uuid().optional(),
  customer_id: z.uuid().optional(),
  status: z.string().optional(),
  created_at: z.coerce.date().optional(),
  updated_at: z.coerce.date().optional(),
});

export const cartsValidator = {
  id: z.object({
    id: z.string().uuid(),
  }),

  create: base.required({
    customer_id: true,
  }),

  query: base.extend({
    order_by: z
      .enum(cartsSortColumns)
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

export type CreateCartsInput = z.infer<typeof cartsValidator.create>;
export type QueryCartsInput = z.infer<typeof cartsValidator.query>;
export type UpdateCartsInput = z.infer<typeof cartsValidator.update>;