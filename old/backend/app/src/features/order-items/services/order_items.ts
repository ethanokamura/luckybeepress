import { query } from "../../../db/pool.ts";
import { OrderItems } from "../../../../types/order_items.ts";
import { QueryParams } from "../../../../types/queries.ts";

export async function create(data: Partial<OrderItems>): Promise<OrderItems | null> {
  const columns: string[] = [];
  const placeholders: string[] = [];
  const values: QueryParams[] = [];

  // Add filters
  for (const [key, value] of Object.entries(data)) {
    columns.push(key);
    placeholders.push(`$${columns.length}`);
    values.push(value);
  }

  const sql = `
    INSERT INTO order_items (${columns.join(", ")})
    VALUES (${placeholders.join(", ")})
    RETURNING *;
  `;

  const result = await query<OrderItems>(sql, values);
  if (result.rows.length === 0) {
    return null;
  }
  return result.rows[0];
}

export async function read(id: string): Promise<OrderItems | null> {
  const result = await query<OrderItems>(
    "SELECT * FROM order_items WHERE id = $1",
    [id]
  );
  if (result.rows.length === 0) {
    return null;
  }
  return result.rows[0];
}

export async function update(
  id: string,
  data: Partial<OrderItems>
): Promise<OrderItems | null> {
  const updatedParams: string[] = [];
  const params: QueryParams[] = [];

  // Add filters
  for (const [key, value] of Object.entries(data)) {
    params.push(value);
    updatedParams.push(`${key} = $${params.length}`);
  }

  // Add the ID as the last parameter
  params.push(id);

  const sql = `UPDATE order_items SET ${updatedParams.join(
    ", "
  )}, updated_at = NOW() WHERE id = $${params.length} RETURNING *`;

  const result = await query<OrderItems>(sql, params);
  if (result.rows.length === 0) {
    return null;
  }
  return result.rows[0];
}

export async function erase(id: string): Promise<string | null> {
  const result = await query<OrderItems>("DELETE FROM order_items WHERE id = $1", [
    id,
  ]);
  if (result.rowCount === 0) return null;
  return `OrderItems deleted successfully with id: ${id}`;
}
