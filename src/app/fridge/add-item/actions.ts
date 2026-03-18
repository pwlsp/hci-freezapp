"use server";

import { db } from "@/db";
import { type CATEGORIES, product_owners, products, type UNITS } from "@/db/schema";

type Resp = { status: "ok" } | { error: string };

export type Item = {
    name: string;
    expirationDate?: Date;
    quantity: number;
    unit: typeof UNITS;
    category?: typeof CATEGORIES | undefined;
    owners: string[];

    freezerCode: string;
};

export async function addItem(item: Item): Promise<Resp> {
    if (item.owners.length === 0) {
        // TODO: error
        return { error: "there is no owner assigned" };
    }

    const ret = await db
        .insert(products)
        .values({
            name: item.name,
            expirationDate: item.expirationDate,
            category: item.category,
            quantity: item.quantity,
            unit: item.unit,
            freezer_code: item.freezerCode,
        })
        .returning({ productID: products.id });

    console.log(item.owners);
    const owners = item.owners.map<typeof product_owners.$inferInsert>((v) => ({ member_id: v, product_id: ret[0].productID }));
    await db.insert(product_owners).values(owners);
    return { status: "ok" };
}
