"use server";

import { db } from "@/db";
import { members } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getFridgeUsers(fridgeId: string) {
    const fridgeUsers = await db.select().from(members).where(eq(members.freezer_code, fridgeId));
    return fridgeUsers;
}

export async function getUser(userId: string) {
    const user = await db.select().from(members).where(eq(members.member_id, userId));
    return user[0];
}
