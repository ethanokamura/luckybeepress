// server.ts
import app from "./main.ts";
import { pool } from "./src/db/pool.ts";
import { MigrationRunner } from "./src/db/migrations/migration_runner.ts";

const port = parseInt(Deno.env.get("PORT") || "8080");
const hostname = Deno.env.get("HOSTNAME") || "0.0.0.0";

async function initializeDatabase(): Promise<void> {
  try {
    console.log("🔄 Initializing database...");
    const migrationRunner = new MigrationRunner(pool);
    const migrationUrl = new URL("./src/db/migrations", import.meta.url);
    const migrationDir = migrationUrl.pathname;
    await migrationRunner.runMigrations(migrationDir);
    console.log("✅ Database initialized successfully");
  } catch (error) {
    console.error("❌ Database initialization failed:", error);
    Deno.exit(1);
  }
}

await initializeDatabase();

Deno.serve(
  {
    hostname,
    port,
    onListen: ({ hostname, port }) => {
      console.log(`✅ Listening on http://${hostname}:${port}`);
    },
  },
  app.fetch
);
