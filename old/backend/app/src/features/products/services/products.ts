import { query } from "../../../db/pool.ts";
import { Products } from "../../../../types/products.ts";
import { QueryParams } from "../../../../types/queries.ts";

export async function create(data: Partial<Products>): Promise<Products | null> {
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
    INSERT INTO products (${columns.join(", ")})
    VALUES (${placeholders.join(", ")})
    RETURNING *;
  `;

  const result = await query<Products>(sql, values);
  if (result.rows.length === 0) {
    return null;
  }
  return result.rows[0];
}

export async function read(id: string): Promise<Products | null> {
  const result = await query<Products>(
    "SELECT * FROM products WHERE id = $1",
    [id]
  );
  if (result.rows.length === 0) {
    return null;
  }
  return result.rows[0];
}

export async function update(
  id: string,
  data: Partial<Products>
): Promise<Products | null> {
  const updatedParams: string[] = [];
  const params: QueryParams[] = [];

  // Add filters
  for (const [key, value] of Object.entries(data)) {
    params.push(value);
    updatedParams.push(`${key} = $${params.length}`);
  }

  // Add the ID as the last parameter
  params.push(id);

  const sql = `UPDATE products SET ${updatedParams.join(
    ", "
  )}, updated_at = NOW() WHERE id = $${params.length} RETURNING *`;

  const result = await query<Products>(sql, params);
  if (result.rows.length === 0) {
    return null;
  }
  return result.rows[0];
}

export async function erase(id: string): Promise<string | null> {
  const result = await query<Products>("DELETE FROM products WHERE id = $1", [
    id,
  ]);
  if (result.rowCount === 0) return null;
  return `Products deleted successfully with id: ${id}`;
}
