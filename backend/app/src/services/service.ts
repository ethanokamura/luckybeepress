import { query } from "../db/pool.ts";
import { QueryParams } from "../types/queries.ts";

export async function create<T>(
  tableName: string,
  data: Partial<T>
): Promise<T | null> {
  const columns: string[] = [];
  const placeholders: string[] = [];
  const values: QueryParams[] = [];

  for (const [key, value] of Object.entries(data)) {
    columns.push(key);
    placeholders.push(`$${columns.length}`);
    values.push(value as QueryParams);
  }

  const sql = `INSERT INTO ${tableName} (${columns.join(
    ", "
  )}) VALUES (${placeholders.join(", ")}) RETURNING *;`;
  const result = await query<T>(sql, values);
  return result.rows.length === 0 ? null : result.rows[0];
}

export async function read<T>(
  tableName: string,
  id: string
): Promise<T | null> {
  const result = await query<T>(`SELECT * FROM ${tableName} WHERE id = $1`, [
    id,
  ]);
  return result.rows.length === 0 ? null : result.rows[0];
}

export async function update<T>(
  tableName: string,
  id: string,
  data: Partial<T>
): Promise<T | null> {
  const updatedParams: string[] = [];
  const params: QueryParams[] = [];

  for (const [key, value] of Object.entries(data)) {
    params.push(value as QueryParams);
    updatedParams.push(`${key} = $${params.length}`);
  }

  params.push(id);

  const sql = `UPDATE ${tableName} SET ${updatedParams.join(
    ", "
  )} , updated_at = NOW() WHERE id = $${params.length} RETURNING *`;
  const result = await query<T>(sql, params);
  return result.rows.length === 0 ? null : result.rows[0];
}

export async function erase(
  tableName: string,
  id: string
): Promise<string | null> {
  const result = await query(`DELETE FROM ${tableName} WHERE id = $1`, [id]);
  if (result.rowCount === 0) return null;
  return `${tableName} deleted successfully with id: ${id}`;
}
