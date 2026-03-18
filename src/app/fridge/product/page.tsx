"use client";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import type { ApiProduct } from "@/app/api/product/route";
import useRequireFridgeID from "@/hooks/useRequireFridgeID";
import styles from "../generate/generate.module.css";
import ManualInputElement from "@/app/fridge/add-item/ManualInput";
import { TrashIcon } from "@heroicons/react/24/outline";
import { useMembers } from "@/context/MembersContext";
import { updateProduct, deleteProduct } from "./actions";
import type { CATEGORIES, UNITS } from "@/db/schema";

export default function ProductPage() {
    const searchParams = useSearchParams();
    useRequireFridgeID("/home");

    const fridgeID = searchParams.get("fridge") ?? "";
    const productID = searchParams.get("product") ?? "";

    const backHref = `/fridge/dashboard?fridge=${encodeURIComponent(fridgeID)}`;

    const [product, setProduct] = useState<ApiProduct | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();
    const { members } = useMembers();

    // form state for editing
    const [productName, setProductName] = useState("");
    const [expirationDate, setExpirationDate] = useState("");
    const [category, setCategory] = useState<"" | (typeof CATEGORIES)[number]>("");
    const [quantity, setQuantity] = useState<number | undefined>(1);
    const [unit, setUnit] = useState<(typeof UNITS)[number]>("pcs");
    const [selectedOwners, setSelectedOwners] = useState<string[]>([]);

    // ManualInput has an incomplete Props type in its file; cast to any to pass the form props.
    const ManualInput: any = ManualInputElement;

    useEffect(() => {
        if (!productID) return;
        setLoading(true);
        setError(null);
        fetch(`/api/product?id=${encodeURIComponent(productID)}`)
            .then((r) => r.json())
            .then((data) => {
                if (data?.error) {
                    setError(data.error);
                    setProduct(null);
                } else {
                    setProduct(data as ApiProduct);
                }
            })
            .catch((e) => setError(String(e)))
            .finally(() => setLoading(false));
    }, [productID]);

    // when product is loaded, populate form state
    useEffect(() => {
        if (!product) return;
        setProductName(product.name ?? "");
        setExpirationDate(product.expirationDate ? new Date(product.expirationDate).toISOString().slice(0, 10) : "");
        setCategory((product.category ?? "") as unknown as (typeof CATEGORIES)[number]);
        setQuantity(product.quantity ?? 1);
        setUnit((product.unit ?? "pcs") as unknown as (typeof UNITS)[number]);
        setSelectedOwners(product.owners.map((o) => o.member_id));
    }, [product]);

    // owner selection helpers
    const toggleOwner = useCallback((id: string, forceValue: boolean | undefined = undefined) => {
        setSelectedOwners((prev) => {
            if (prev.includes(id)) {
                if (forceValue !== true) return prev.filter((uid) => uid !== id);
            } else {
                if (forceValue !== false) return [...prev, id];
            }
            return prev;
        });
    }, []);

    const selectAll = useCallback(() => setSelectedOwners(members.map((u) => u.member_id)), [members]);
    const deselectAll = useCallback(() => setSelectedOwners([]), []);

    const handleUpdate = async (fridgeCode: string) => {
        if (!product) return;
        void fridgeCode;
        const id = Number(productID);
        try {
            const resp = await updateProduct({
                id,
                name: productName,
                expirationDate: expirationDate ? new Date(expirationDate) : null,
                category: (category as unknown as (typeof CATEGORIES)[number]) || null,
                quantity: quantity ?? 0,
                unit: unit as unknown as (typeof UNITS)[number],
                owners: selectedOwners,
            });

            if ("status" in resp) {
                router.push(`/fridge/dashboard?fridge=${encodeURIComponent(fridgeID)}`);
            } else {
                setError(resp.error);
            }
        } catch (e) {
            setError(String(e));
        }
    };

    const handleDelete = async () => {
        if (!product) return;
        setLoading(true);
        setError(null);
        try {
            const id = Number(productID);
            const resp = await deleteProduct(id);
            if ("status" in resp) {
                router.push(`/fridge/dashboard?fridge=${encodeURIComponent(fridgeID)}`);
            } else {
                setError(resp.error);
            }
        } catch (e) {
            setError(String(e));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <header className={styles.header}>
                <Link href={backHref} className={styles.backButton}>
                    ←
                </Link>
                <h1 className={styles.title}>Product</h1>
                <button type="button" aria-label="Delete product" className={styles.titleButton} onClick={handleDelete}>
                    <TrashIcon width={20} height={20} />
                </button>
            </header>

            <div style={{ padding: 16 }}>
                {!productID && (
                    <>
                        <h1>Invalid product ID</h1>
                        <p>The requested product is invalid or missing from the URL.</p>
                    </>
                )}

                {productID && (
                    <>
                        {loading && <div>Loading…</div>}
                        {error && (
                            <div>
                                <h2>Error</h2>
                                <div>{error}</div>
                            </div>
                        )}
                        {!loading && !error && product && (
                            <div>
                                <ManualInput
                                    buttonMsg="Update item"
                                    productName={productName}
                                    setProductName={setProductName}
                                    expirationDate={expirationDate}
                                    setExpirationDate={setExpirationDate}
                                    category={category}
                                    setCategory={setCategory}
                                    quantity={quantity}
                                    setQuantity={setQuantity}
                                    unit={unit}
                                    setUnit={setUnit}
                                    selectAll={selectAll}
                                    deselectAll={deselectAll}
                                    toggleOwner={toggleOwner}
                                    selectedOwners={selectedOwners}
                                    handleAddItem={handleUpdate}
                                />
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
