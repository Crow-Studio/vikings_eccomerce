import { db, driver as pool } from "@/database";
import "dotenv/config";
import { sql } from "drizzle-orm";
import fs from "fs";
import path from "path";

async function main() {
    const tablesSchema = db._.schema;
    if (!tablesSchema) throw new Error("Schema not loaded");

    // Drop drizzle schema (if it exists)
    await db.execute(sql.raw(`DROP SCHEMA IF EXISTS "drizzle" CASCADE;`));

    // Drop and recreate public schema
    await db.execute(sql.raw(`DROP SCHEMA IF EXISTS public CASCADE;`));
    await db.execute(sql.raw(`CREATE SCHEMA public;`));

    // Grant privileges (plain Postgres setup)
    await db.execute(sql.raw(`
    GRANT USAGE ON SCHEMA public TO postgres;
    GRANT ALL PRIVILEGES ON ALL TABLES    IN SCHEMA public TO postgres;
    GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres;

    ALTER DEFAULT PRIVILEGES IN SCHEMA public
      GRANT ALL ON TABLES    TO postgres;

    ALTER DEFAULT PRIVILEGES IN SCHEMA public
      GRANT ALL ON SEQUENCES TO postgres;
  `));

    // Remove migration folders if they exist
    const projectRoot = process.cwd();
    const candidateDirs = ["drizzle", "database", "db"];

    for (const dir of candidateDirs) {
        const migrationsPath = path.join(projectRoot, dir, "migrations");
        if (fs.existsSync(migrationsPath)) {
            fs.rmSync(migrationsPath, { recursive: true, force: true });
            console.log(`🗑️  Deleted migrations folder: ${migrationsPath}`);
        }
    }

    await pool.end();
    console.log("✅ Database cleared and migration folders removed");
}

main().catch((err) => {
    console.error("❌ Error clearing database:", err);
    process.exit(1);
});
