import { z } from "zod";
import {
  customersSortColumns,
} from "./columns.ts";

const base = z.object({
  business_name: z.string().optional(),
  contact_name: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  tax_id: z.string().optional(),
  account_status: z.string().optional(),
  net_terms: z.coerce.number().optional(),
  discount_percentage: z.coerce.number().optional(),
  first_order_date: z.coerce.date().optional(),
  total_orders: z.coerce.number().optional(),
  lifetime_value: z.coerce.number().optional(),
  notes: z.string().optional(),
});

export const customersValidator = {
  id: z.object({
    id: z.uuid(),
  }),

  create: base.required({
    business_name: true,
    email: true,
  }),

  query: base.extend({
    order_by: z
      .enum(customersSortColumns)
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
