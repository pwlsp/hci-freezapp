"use server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { members } from "@/db/schema";

const DEV_URL = "https://world.openfoodfacts.net";

export type ProductInfo = {
    _keywords: string[];
    categories_hierarchy: string[];
    categories_tags: string[];
    food_groups_tags: string[];

    product_name: string;
    product_type: string;
    image_front_thumb_url: string;
    image_url: string;
    image_front_url: string;

    [key: string]: unknown;
};

export type ProductApiResponse = {
    code: string;
    product: ProductInfo;

    status: 0 | 1;
};

export async function getProductInfoFromBarcode(barcode: string): Promise<ProductApiResponse | { status: 0 }> {
    const url = `${DEV_URL}/api/v2/product/${barcode}.json`;
    let resp: Response;
    try {
        resp = await fetch(url, {
            headers: {
                UserAgent: "Freezapp/v0.0.1 (d.jozwik@campus.fct.unl.pt) | Student project for IPM course",
                Accept: "application/json",
                Authorization: `Basic: ${btoa("off:off")}`,
            },
        });
    } catch (err) {
        console.error("cannot request openfood api data:", err);
        return { status: 0 };
    }

    let json: ProductApiResponse;
    try {
        json = await resp.json();
    } catch (err) {
        console.error("cannot deserialize response to json:", err);
        return { status: 0 };
    }

    try {
        console.log(json);
        console.log(json.code, json.status, json.product.product_name);
    } catch {}

    return json;
}
