import { z } from "zod";
import {
  ordersSortColumns,
} from "./columns.ts";

const base = z.object({
  order_number: z.string().optional(),
  customer_id: z.string().optional(),
  shipping_company_name: z.string().optional(),
  shipping_address_1: z.string().optional(),
  shipping_address_2: z.string().optional(),
  shipping_city: z.string().optional(),
  shipping_state: z.string().optional(),
  shipping_postal_code: z.string().optional(),
  shipping_country: z.string().optional(),
  shipping_phone: z.string().optional(),
  billing_company_name: z.string().optional(),
  billing_address_1: z.string().optional(),
  billing_address_2: z.string().optional(),
  billing_city: z.string().optional(),
  billing_state: z.string().optional(),
  billing_postal_code: z.string().optional(),
  billing_country: z.string().optional(),
  subtotal: z.coerce.number().optional(),
  shipping_cost: z.coerce.number().optional(),
  tax_amount: z.coerce.number().optional(),
  discount_amount: z.coerce.number().optional(),
  total_amount: z.coerce.number().optional(),
  status: z.string().optional(),
  payment_status: z.string().optional(),
  payment_method: z.string().optional(),
  payment_due_date: z.coerce.date().optional(),
  order_date: z.coerce.date().optional(),
  ship_date: z.coerce.date().optional(),
  delivery_date: z.coerce.date().optional(),
  cancelled_date: z.coerce.date().optional(),
  tracking_number: z.string().optional(),
  carrier: z.string().optional(),
  internal_notes: z.string().optional(),
  customer_notes: z.string().optional(),
});

export const ordersValidator = {
  id: z.object({
    id: z.uuid(),
  }),

  create: base.required({
    order_number: true,
    customer_id: true,
    shipping_address_1: true,
    shipping_city: true,
    shipping_state: true,
    shipping_postal_code: true,
    shipping_country: true,
    subtotal: true,
    total_amount: true,
    order_date: true,
  }),

  query: base.extend({
    order_by: z
      .enum(ordersSortColumns)
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
