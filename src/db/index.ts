import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";

const dbFile = process.env.DATABASE_FILE ?? "./src/db/sqlite.db";
const sqlite = new Database(dbFile);
export const db = drizzle(sqlite, { schema });
