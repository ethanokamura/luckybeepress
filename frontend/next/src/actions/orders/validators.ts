import { z } from "zod";

export const ordersSortColumns = [
  "id",
  "order_number",
  "customer_id",
  "shipping_company_name",
  "shipping_address_1",
  "shipping_address_2",
  "shipping_city",
  "shipping_state",
  "shipping_postal_code",
  "shipping_country",
  "shipping_phone",
  "billing_company_name",
  "billing_address_1",
  "billing_address_2",
  "billing_city",
  "billing_state",
  "billing_postal_code",
  "billing_country",
  "subtotal",
  "shipping_cost",
  "tax_amount",
  "discount_amount",
  "total_amount",
  "status",
  "payment_status",
  "payment_method",
  "payment_due_date",
  "order_date",
  "ship_date",
  "delivery_date",
  "cancelled_date",
  "tracking_number",
  "carrier",
  "internal_notes",
  "customer_notes",
  "created_at",
  "updated_at",
] as const;

const base = z.object({
  id: z.string().uuid().optional(),
  order_number: z.string().optional(),
  customer_id: z.string().uuid().optional(),
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
  created_at: z.coerce.date().optional(),
  updated_at: z.coerce.date().optional(),
});

export const ordersValidator = {
  id: z.object({
    id: z.string().uuid(),
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

export type CreateOrdersInput = z.infer<typeof ordersValidator.create>;
export type QueryOrdersInput = z.infer<typeof ordersValidator.query>;
export type UpdateOrdersInput = z.infer<typeof ordersValidator.update>;