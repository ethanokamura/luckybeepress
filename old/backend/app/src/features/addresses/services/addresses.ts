import { query } from "../../../db/pool.ts";
import { Addresses } from "../../../../types/addresses.ts";
import { QueryParams } from "../../../../types/queries.ts";

export async function create(data: Partial<Addresses>): Promise<Addresses | null> {
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
    INSERT INTO addresses (${columns.join(", ")})
    VALUES (${placeholders.join(", ")})
    RETURNING *;
  `;

  const result = await query<Addresses>(sql, values);
  if (result.rows.length === 0) {
    return null;
  }
  return result.rows[0];
}

export async function read(id: string): Promise<Addresses | null> {
  const result = await query<Addresses>(
    "SELECT * FROM addresses WHERE id = $1",
    [id]
  );
  if (result.rows.length === 0) {
    return null;
  }
  return result.rows[0];
}

export async function update(
  id: string,
  data: Partial<Addresses>
): Promise<Addresses | null> {
  const updatedParams: string[] = [];
  const params: QueryParams[] = [];

  // Add filters
  for (const [key, value] of Object.entries(data)) {
    params.push(value);
    updatedParams.push(`${key} = $${params.length}`);
  }

  // Add the ID as the last parameter
  params.push(id);

  const sql = `UPDATE addresses SET ${updatedParams.join(
    ", "
  )}, updated_at = NOW() WHERE id = $${params.length} RETURNING *`;

  const result = await query<Addresses>(sql, params);
  if (result.rows.length === 0) {
    return null;
  }
  return result.rows[0];
}

export async function erase(id: string): Promise<string | null> {
  const result = await query<Addresses>("DELETE FROM addresses WHERE id = $1", [
    id,
  ]);
  if (result.rowCount === 0) return null;
  return `Addresses deleted successfully with id: ${id}`;
}
