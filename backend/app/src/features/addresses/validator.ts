import { z } from "zod";
import {
  addressesSortColumns,
} from "./columns.ts";

const base = z.object({
  customer_id: z.string().optional(),
  address_type: z.string().optional(),
  is_default: z.boolean().optional(),
  company_name: z.string().optional(),
  street_address_1: z.string().optional(),
  street_address_2: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postal_code: z.string().optional(),
  country: z.string().optional(),
});

export const addressesValidator = {
  id: z.object({
    id: z.uuid(),
  }),

  create: base.required({
    customer_id: true,
    address_type: true,
    street_address_1: true,
    city: true,
    state: true,
    postal_code: true,
  }),

  query: base.extend({
    order_by: z
      .enum(addressesSortColumns)
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
