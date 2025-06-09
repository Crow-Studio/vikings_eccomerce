import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

import "dotenv/config";

export { and, eq, or, sql } from "drizzle-orm";

export const tables = schema;

const connectionString = process.env.DATABASE_URL!;

const queryClient = postgres(connectionString, { prepare: false });

export const db = drizzle(queryClient, { schema });
