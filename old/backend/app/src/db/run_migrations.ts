import { pool } from "./pool.ts";
import { MigrationRunner } from "./migrations/migration_runner.ts";

/**
 * Standalone migration script.
 * This runs ONLY database migrations, not the full application.
 */
export async function runMigrations(migrationDir: string): Promise<void> {
  console.log("🔄 Starting Database Migrations...\n");

  try {
    // Database connection is already established via the pool
    console.log("1. Database connection ready...");
    console.log("Using existing pool connection\n");

    // Run migrations
    console.log("2. Running migrations...");
    const migrationRunner = new MigrationRunner(pool);
    await migrationRunner.runMigrations(migrationDir);
    console.log("All migrations completed successfully\n");

    console.log("🎉 Migration process completed!");
  } catch (error: any) {
    console.error("\n❌ Migration failed:");
    console.error(`   Error: ${error.message}`);
    console.error("\n💡 Common issues:");
    console.error("   - Check your database connection");
    console.error("   - Verify migration SQL syntax");
    console.error("   - Ensure sufficient database permissions");
    console.error("   - Check RDS_CREDENTIALS_SECRET_NAME is set");
    throw error;
  }
}

// Run migrations if this file is executed directly
// if (import.meta.main) {
//   const migrationDir = new URL("./migrations", import.meta.url).pathname;

//   runMigrations(migrationDir)
//     .then(() => {
//       console.log("\n✅ Migration script completed successfully");
//       Deno.exit(0);
//     })
//     .catch((error) => {
//       console.error("\n❌ Migration script failed:", error);
//       Deno.exit(1);
//     });
// }
