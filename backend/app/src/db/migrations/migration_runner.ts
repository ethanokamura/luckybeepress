import { Pool, PoolClient } from "@db/postgres";

export class MigrationRunner {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  private async initVersionTable(): Promise<void> {
    const client = await this.pool.connect();
    try {
      await client.queryObject(`
        CREATE TABLE IF NOT EXISTS schema_versions (
          version INT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
    } finally {
      client.release();
    }
  }

  private async getCurrentVersion(): Promise<number> {
    const client = await this.pool.connect();
    try {
      const result = await client.queryObject<{ version: number | null }>(
        "SELECT MAX(version) as version FROM schema_versions"
      );
      return result.rows[0]?.version ?? 0;
    } finally {
      client.release();
    }
  }

  public async runMigrations(migrationDir: string): Promise<void> {
    await this.initVersionTable();
    const currentVersion = await this.getCurrentVersion();

    console.log(`Reading migrations from: ${migrationDir}`);

    // Read migration files from directory
    const migrationFiles: string[] = [];
    for await (const entry of Deno.readDir(migrationDir)) {
      if (entry.isFile && entry.name.endsWith(".sql")) {
        migrationFiles.push(entry.name);
      }
    }

    const pendingMigrations = migrationFiles
      .filter((file) => {
        const version = parseInt(file.split("_")[0], 10);
        return !Number.isNaN(version) && version > currentVersion;
      })
      .sort();

    for (const file of pendingMigrations) {
      const version = parseInt(file.split("_")[0], 10);
      const filePath = `${migrationDir}/${file}`;
      const content = await Deno.readTextFile(filePath);

      const client: PoolClient = await this.pool.connect();

      try {
        await client.queryObject("BEGIN");
        await client.queryObject(content);
        await client.queryObject(
          "INSERT INTO schema_versions (version, name) VALUES ($1, $2)",
          [version, file]
        );
        await client.queryObject("COMMIT");
        console.log(`✅ Applied migration: ${file}`);
      } catch (error: any) {
        await client.queryObject("ROLLBACK");
        throw new Error(`❌ Migration ${file} failed: ${error.message}`);
      } finally {
        client.release();
      }
    }

    if (pendingMigrations.length === 0) {
      console.log("✅ No pending migrations");
    }
  }
}
