"use server";

import { sql } from "drizzle-orm";
import { db } from "@/db";
import { freezers } from "@/db/schema";

export type FridgeNamesResp = {
    freezerID: string;
    name: string;
};

export async function getFridgeNames(ids: string[]): Promise<FridgeNamesResp[]> {
    const fridgeList = await db
        .select({ freezerID: freezers.code, name: freezers.name })
        .from(freezers)
        .where(sql`${freezers.code} IN ${ids}`);

    return fridgeList;
}
