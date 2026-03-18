import { NextResponse } from "next/server";
import { db } from "@/db";

export type ApiProduct = {
    id: number;
    name: string;
    freezer_code: string;
    expirationDate: string | null;
    category: string | null;
    quantity: number;
    unit: string;
    owners: { member_id: string; nickname: string; isDeleted: boolean | null }[];
};

async function fetchProduct(id: number): Promise<ApiProduct | null> {
    const r = await db.query.products.findFirst({
        where: (p, { eq }) => eq(p.id, id),
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
    });

    if (!r) return null;

    const product: ApiProduct = {
        id: r.id,
        name: r.name,
        freezer_code: r.freezer_code,
        expirationDate: r.expirationDate ? new Date(r.expirationDate).toISOString() : null,
        category: r.category ?? null,
        quantity: r.quantity,
        unit: r.unit,
        owners: r.owners.map((o) => ({
            member_id: o.member_id,
            nickname: o.owner.nickname,
            isDeleted: o.owner.isDeleted ?? true,
        })),
    };

    return product;
}

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const idParam = url.searchParams.get("id");
        if (!idParam) return NextResponse.json({ error: "missing id" }, { status: 400 });

        const id = Number(idParam);
        if (Number.isNaN(id)) return NextResponse.json({ error: "invalid id" }, { status: 400 });

        const product = await fetchProduct(id);
        if (!product) return NextResponse.json({ error: "not found" }, { status: 404 });

        return NextResponse.json(product);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "server error" }, { status: 500 });
    }
}
