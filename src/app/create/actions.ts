"use server";

import { db } from "@/db";
import { freezers, members } from "@/db/schema";

type Resp = { code: string } | { error: string };

type FreezerCreateReq = {
    name: string;
    users: string[];
};

export async function createFreezer(data: FreezerCreateReq): Promise<Resp> {
    console.log(data.name, data.users);

    const row = await db.insert(freezers).values({ name: data.name }).returning({ code: freezers.code });
    // will be only one array elem
    const code = row[0].code;

    const users = data.users.map<typeof members.$inferInsert>((v) => ({ freezer_code: code, nickname: v, isDeleted: false }));
    await db.insert(members).values(users);

    return { code };
}
