import { QueryParams } from "../types/queries.ts";
import { query } from "../db/pool.ts";

interface PaginationTypes {
  cursor?: string;
  limit: number;
  order_by: string;
  order: "asc" | "desc";
  filters: Record<string, QueryParams>;
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
    const decoded = atob(cursor);
    const [sortValue, userId] = decoded.split(",");
    conditions.push(
      `(${order_by}, ${primaryKey}) ${operator} ($${paramIndex}${
        timestampColumns.has(order_by) ? "::TIMESTAMPTZ" : ""
      }, $${paramIndex + 1})`
    );
    params.push(sortValue, userId);
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
    ? btoa(
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
