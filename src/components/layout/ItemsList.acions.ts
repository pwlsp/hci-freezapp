"use server";

import { db } from "@/db";
import { eq } from "drizzle-orm";
import { products } from "@/db/schema";
import type { CATEGORIES, UNITS } from "@/db/schema";

export type Owner = {
    nickname: string;
    member_id: string;
    isDeleted: boolean | null;
};

export type ProductInfo = {
    id: number;
    name: string;
    freezer_code: string;
    expirationDate: Date | null;
    category: (typeof CATEGORIES)[number] | null;
    quantity: number;
    unit: (typeof UNITS)[number];

    owners: Owner[];
};

export async function fetchProducts(freezerCode: string): Promise<ProductInfo[]> {
    const r = await db.query.freezers.findFirst({
        where: (freezers, { eq }) => eq(freezers.code, freezerCode),
        with: {
            products: {
                where: (products, { gt }) => gt(products.quantity, 0),
                orderBy: (products, { asc }) => [asc(products.expirationDate ?? 9999999)],
                with: {
                    owners: {
                        columns: { member_id: true },
                        with: {
                            owner: {
                                columns: { nickname: true, isDeleted: true },
                            },
                        },
                    },
                },
            },
        },
    });

    const result = r?.products.map(({ owners, ...rest }) => ({
        ...rest,
        owners: owners.map((o) => ({
            member_id: o.member_id,
            nickname: o.owner.nickname,
            isDeleted: o.owner.isDeleted ?? true,
        })),
    }));

    // console.log(util.inspect(result, false, 10));
    return result ?? [];
}

export type UpdateQuantityResult =
    | { action: "not-found" }
    | { action: "noop"; currentQuantity: number }
    | { action: "set-zero"; previousQuantity: number }
    | { action: "updated"; previousQuantity: number; newQuantity: number };

export async function updateQuantity(productID: number, deltaQuantity: number): Promise<UpdateQuantityResult> {
    const p = await db.query.products.findFirst({
        where: (pr, { eq }) => eq(pr.id, productID),
        columns: { quantity: true },
    });

    if (!p) return { action: "not-found" };

    const current = p.quantity;
    if (deltaQuantity === 0) return { action: "noop", currentQuantity: current };

    if (current === 0) return { action: "noop", currentQuantity: current };

    const newQuantity = current + deltaQuantity;

    if (newQuantity <= 0) {
        await db.update(products).set({ quantity: 0 }).where(eq(products.id, productID));
        return { action: "set-zero", previousQuantity: current };
    }

    await db.update(products).set({ quantity: newQuantity }).where(eq(products.id, productID));
    return { action: "updated", previousQuantity: current, newQuantity };
}
