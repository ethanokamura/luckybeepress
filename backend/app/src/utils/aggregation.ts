import { QueryParams } from "../../types/queries.ts";
import { query } from "../db/pool.ts";
import { AggregateType } from "../../types/aggregate_type.ts";

export async function getAggregatedResults(
  tableName: string,
  queryData: Record<string, string>
): Promise<{
  count: number;
}> {
  const conditions: string[] = [];
  const params: QueryParams[] = [];
  let paramIndex = 1;
  // Add filters
  for (const [key, value] of Object.entries(queryData)) {
    conditions.push(`${key} = $${paramIndex}`);
    params.push(value);
    paramIndex++;
  }
  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
  const sql = `
      SELECT COUNT(*) FROM ${tableName} 
      ${whereClause};
    `;
  const result = await query<AggregateType>(sql, params);
  if (result.rowCount === 0) {
    return {
      count: 0,
    };
  }
  const count = parseInt(result.rows[0].count, 10);
  return {
    count: count,
  };
}
