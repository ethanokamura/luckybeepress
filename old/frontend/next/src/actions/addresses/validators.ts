import { z } from "zod";

export const addressesSortColumns = [
  "id",
  "customer_id",
  "address_type",
  "is_default",
  "company_name",
  "street_address_1",
  "street_address_2",
  "city",
  "state",
  "postal_code",
  "country",
  "created_at",
  "updated_at",
] as const;

const base = z.object({
  id: z.uuid().optional(),
  customer_id: z.uuid().optional(),
  address_type: z.string().optional(),
  is_default: z.boolean().optional(),
  company_name: z.string().optional(),
  street_address_1: z.string().optional(),
  street_address_2: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postal_code: z.string().optional(),
  country: z.string().optional(),
  created_at: z.coerce.date().optional(),
  updated_at: z.coerce.date().optional(),
});

export const addressesValidator = {
  id: z.object({
    id: z.string().uuid(),
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

export type CreateAddressesInput = z.infer<typeof addressesValidator.create>;
export type QueryAddressesInput = z.infer<typeof addressesValidator.query>;
export type UpdateAddressesInput = z.infer<typeof addressesValidator.update>;