import { QueryParams } from "../types/queries.ts";
import { query } from "../db/pool.ts";
import { decodeBase64, encodeBase64 } from "hono/utils/encode";

interface PaginationTypes {
  cursor?: string;
  limit: number;
  order_by: string;
  order: "asc" | "desc";
  filters: Record<string, QueryParams>;
}

// Helper functions using Deno's std library
function encodeCursor(value: string): string {
  const encoder = new TextEncoder();
  return encodeBase64(encoder.encode(value).buffer);
}

function decodeCursor(cursor: string): string {
  const decoder = new TextDecoder();
  return decoder.decode(decodeBase64(cursor).buffer);
}

export async function getPaginatedResults<T>(
  tableName: string,
  primaryKey: string,
  queryData: PaginationTypes,
  timestampColumns: Set<string>
): Promise<{
  data: T[];
  nextCursor: string | null;
  hasNextPage: boolean;
}> {
  const { cursor, limit, order_by, order, filters } = queryData;

  const limitNum = Math.min(limit, 25);
  const operator = order === "asc" ? ">" : "<";
  const direction = order === "asc" ? "ASC" : "DESC";

  const conditions: string[] = [];
  const params: QueryParams[] = [];
  let paramIndex = 1;

  // Add filters
  for (const [key, value] of Object.entries(filters)) {
    conditions.push(`${key} = $${paramIndex}`);
    params.push(value);
    paramIndex++;
  }

  // Add cursor condition
  if (cursor) {
    const decoded = decodeCursor(cursor);
    const [sortValue, primaryKeyValue] = decoded.split(",");

    const sortCast = timestampColumns.has(order_by) ? "::TIMESTAMPTZ" : "";

    conditions.push(
      `(${order_by}, ${primaryKey}) ${operator} ($${paramIndex}${sortCast}, $${
        paramIndex + 1
      }::UUID)`
    );

    params.push(sortValue, primaryKeyValue);
    paramIndex += 2;
  }

  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  const sql = `
    SELECT * FROM ${tableName} 
    ${whereClause}
    ORDER BY ${order_by} ${direction}, ${primaryKey} ${direction}
    LIMIT $${paramIndex}
  `;

  const result = await query<T>(sql, [...params, limitNum + 1]);

  const hasNextPage = result.rows.length > limitNum;
  const data = hasNextPage ? result.rows.slice(0, limitNum) : result.rows;

  const nextCursor = hasNextPage
    ? encodeCursor(
        `${data.at(-1)?.[order_by as keyof T]},${
          data.at(-1)?.[primaryKey as keyof T]
        }`
      )
    : null;

  return {
    data,
    hasNextPage,
    nextCursor,
  };
}
