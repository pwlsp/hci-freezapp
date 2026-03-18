"use server";

import { db } from "@/db";
import { eq } from "drizzle-orm";
import { products, product_owners } from "@/db/schema";
import type { CATEGORIES, UNITS } from "@/db/schema";

type Resp = { status: "ok" } | { error: string };

export type UpdateProductPayload = {
    id: number;
    name: string;
    expirationDate?: Date | null;
    quantity: number;
    unit: (typeof UNITS)[number];
    category?: (typeof CATEGORIES)[number] | null;
    owners: string[];
};

export async function updateProduct(payload: UpdateProductPayload): Promise<Resp> {
    const { id, name, expirationDate, quantity, unit, category, owners } = payload;

    // Validate owners
    if (!owners || owners.length === 0) return { error: "there is no owner assigned" };

    // Update product fields
    await db
        .update(products)
        .set({
            name,
            expirationDate: expirationDate ?? null,
            quantity,
            unit,
            category: category ?? null,
        })
        .where(eq(products.id, id));

    // Replace owners: delete existing and insert new
    await db.delete(product_owners).where(eq(product_owners.product_id, id));

    const rows = owners.map((member_id) => ({ product_id: id, member_id }));
    if (rows.length > 0) await db.insert(product_owners).values(rows);

    return { status: "ok" };
}

export async function deleteProduct(id: number): Promise<Resp> {
    try {
        await db.update(products).set({ quantity: 0 }).where(eq(products.id, id));
        return { status: "ok" };
    } catch (err) {
        console.error(err);
        return { error: "failed to delete product" };
    }
}
