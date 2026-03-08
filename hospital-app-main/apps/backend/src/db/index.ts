import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";
import { env } from "../config/env";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";

// Important for Supabase pooler compatibility
const client = postgres(env.databaseUrl, {
  prepare: false, // REQUIRED for Supabase connection pooler
  ssl: "require",
});

export const db = drizzle(client, {
  schema,
});

export type DB = PostgresJsDatabase<typeof schema>;