import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

import "dotenv/config";

export { and, eq, or, sql } from "drizzle-orm";

export const tables = schema;

const connectionString = process.env.DATABASE_URL!;

// Create postgres client with keepalive behavior
const queryClient = postgres(connectionString, {
  prepare: false,
  idle_timeout: 0, // don't auto-close
});

// Optional: ping periodically to keep connection warm
setInterval(async () => {
  try {
    await queryClient`SELECT 1`;
  } catch (err) {
    console.error("DB keep-alive failed", err);
  }
}, 45000); // every 45 seconds

export const db = drizzle(queryClient, { schema });
