"use server";

import { eq } from "drizzle-orm";
import { db } from "@/db";
import { members } from "@/db/schema";

export async function getMembers(fridgeID: string) {
    try {
        const memberList = await db.select().from(members).where(eq(members.freezer_code, fridgeID));
        return memberList;
    } catch (error) {
        console.error("Failed to fetch members:", error);
        throw new Error("Failed to fetch members.");
    }
}
