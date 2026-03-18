"use server";

import { eq } from "drizzle-orm";
import { db } from "@/db";
import { freezers } from "@/db/schema";

export async function checkIfFridgeExists(code: string): Promise<boolean> {
    const row: unknown | undefined = db.select({ name: freezers.name }).from(freezers).where(eq(freezers.code, code)).get();
    return row !== undefined;
}
