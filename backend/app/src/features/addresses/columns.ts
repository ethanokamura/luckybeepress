export const addressesColumns: string[] = [
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
];

export const addressesNonNullableColumns: string[] = [
  "customer_id",
  "address_type",
  "street_address_1",
  "city",
  "state",
  "postal_code",
];

export const addressesNullableColumns: string[] = [
  "id",
  "is_default",
  "company_name",
  "street_address_2",
  "country",
  "created_at",
  "updated_at",
];

export const addressesSortColumns: string[] = [
  "id",
  "customer_id",
  "address_type",
  "company_name",
  "street_address_1",
  "street_address_2",
  "city",
  "state",
  "postal_code",
  "country",
  "created_at",
  "updated_at",
];

export const addressesTimeStampColumns: string[] = [
  "created_at",
  "updated_at",
];

export const addressesNumberColumns: string[] = [
];
