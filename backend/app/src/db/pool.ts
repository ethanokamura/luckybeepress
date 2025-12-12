import { Pool } from "@db/postgres";
import { QueryParams } from "../types/queries.ts";

const DATABASE_URL = Deno.env.get("DATABASE_URL");

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required");
}

// Parse connection string
const dbUrl = new URL(DATABASE_URL);
const poolSize = 20;

const pool = new Pool(
  {
    hostname: dbUrl.hostname,
    port: parseInt(dbUrl.port) || 5432,
    user: dbUrl.username,
    password: dbUrl.password,
    database: dbUrl.pathname.slice(1),
    tls: {
      enabled: true,
      enforce: false,
      caCertificates: [],
    },
  },
  poolSize
);

console.log("✅ PostgreSQL pool initialized");

// Helper function to execute queries
interface QueryResult<T> {
  rows: T[];
  rowCount: number;
}

const query = async <T>(
  text: string,
  params?: QueryParams[]
): Promise<QueryResult<T>> => {
  const start = Date.now();
  const client = await pool.connect();

  try {
    const result = await client.queryObject<T>(text, params);
    const duration = Date.now() - start;
    console.log("📊 Query executed", { text, duration, rows: result.rowCount });

    return {
      rows: result.rows,
      rowCount: result.rowCount || 0,
    };
  } catch (error) {
    console.error("❌ Query error:", error);
    throw error;
  } finally {
    client.release();
  }
};

export { pool, query };
