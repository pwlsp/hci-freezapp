import "dotenv/config";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";

const dbFile = process.env.DATABASE_FILE ?? "./src/db/sqlite.db";
const sqlite = new Database(dbFile);
export const db = drizzle(sqlite);

async function main() {
    try {
        console.log("Running migrations...");
        migrate(db, { migrationsFolder: "./drizzle" });
        console.log("Migrations finished!");
    } catch (error) {
        console.error("Error during migration:", error);
        process.exit(1);
    } finally {
        sqlite.close();
    }
}

main();
