"use server";

import { sql } from "drizzle-orm";
import { db } from "@/db";
import { freezers } from "@/db/schema";

export async function checkFridgesStatus(codes: string[]): Promise<string[]> {
    const dbCodes = await db.select({ code: freezers.code }).from(freezers).where(sql`${freezers.code} IN ${codes}`);
    const result = dbCodes.map((v) => v.code);
    return result;
}
