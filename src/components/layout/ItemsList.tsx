"use client";

import { useEffect, useState } from "react";
import useFridgeID from "@/hooks/useFridgeID";
import Item from "../../components/ui/Item";
import { useFilters } from "../../context/FiltersContext";
import { useSearch } from "../../context/SearchContext";
import useFuseSearch from "../../hooks/useFuseSearch";
import { SwipeableActionItem } from "../ui/SwipableItem";
import { fetchProducts, type ProductInfo, updateQuantity } from "./ItemsList.acions";
import { useRouter } from "next/navigation";
import styles from "./ItemsList.module.css";

// helper removed; handled inside component so it can update local state immediately

export default function ItemsList() {
    const [items, setItems] = useState<ProductInfo[]>([]);

    const { query = "" } = useSearch();
    const loweredQuery = query.toLowerCase();
    const { selected, selectedUsers } = useFilters();

    const { fridgeID } = useFridgeID();

    useEffect(() => {
        if (!fridgeID) return;

        console.log("Fetch products");
        fetchProducts(fridgeID)
            .then((resp) => setItems(resp))
            .catch((err) => console.error("err", err));
    }, [fridgeID]);

    async function updateProductQuantity(productID: number, delta: number) {
        if (delta === 0) return;
        try {
            const res = await updateQuantity(productID, delta);
            if (res.action === "updated") {
                setItems((prev) => prev.map((it) => (it.id === productID ? { ...it, quantity: res.newQuantity } : it)));
            } else if (res.action === "set-zero" || res.action === "not-found") {
                // remove from local list — fetchProducts filters out non-positive quantities
                setItems((prev) => prev.filter((it) => it.id !== productID));
            }
        } catch (err) {
            console.error("updateQuantity failed", err);
        }
    }

    const router = useRouter();

    console.log("items got", items);
    const itemsForSearch: ProductInfo[] = [...items];
    const fuseResults = useFuseSearch(itemsForSearch, ["name", "category", "owners"], query);

    const filtered = fuseResults
        .filter((it: ProductInfo) => it.name.toLowerCase().includes(loweredQuery) || it.category?.toLowerCase().includes(loweredQuery))
        .filter((it: ProductInfo) => {
            const categoryFilters = selected.filter((s) => s !== "expiring_soon");
            if (categoryFilters.length > 0) {
                if (it.category && !categoryFilters.includes(it.category.toLowerCase())) return false;
            }
            if (!selectedUsers || selectedUsers.includes("All")) return true;
            for (const owner of it.owners) {
                if (selectedUsers.includes(owner.member_id)) return true;
            }
            return false;
        })
        .sort((a: ProductInfo, b: ProductInfo) => {
            if (selected.includes("expiring_soon")) {
                const parseDate = (s: Date | null) => (s ? s.getTime() : Infinity);
                const da = parseDate(a.expirationDate);
                const db = parseDate(b.expirationDate);
                return da - db;
            }
            return 0;
        });

    const isListEmpty = filtered.length === 0;

    return (
        <>
            {isListEmpty && (
                <div className={styles.emptyList}>
                    <h1 style={{ fontSize: "1.8rem" }}>There is nothing in&nbsp;fridge&nbsp;:&nbsp;(</h1>
                    <h2 style={{ fontSize: "1.35rem" }}>Maybe add something to&nbsp;eat?&nbsp;:&nbsp;D</h2>
                </div>
            )}
            {!isListEmpty && (
                <div className={styles.list}>
                    {filtered.map((it: ProductInfo) => (
                        <SwipeableActionItem
                            key={it.id}
                            id={it.id.toString()}
                            quantity={it.quantity}
                            onAdd={(q) => updateProductQuantity(it.id, q)}
                            onDelete={(q) => updateProductQuantity(it.id, -q)}
                        >
                            <Item
                                product={it}
                                onClick={() =>
                                    router.push(
                                        `/fridge/product?fridge=${encodeURIComponent(
                                            it.freezer_code
                                        )}&product=${encodeURIComponent(String(it.id))}`
                                    )
                                }
                            />
                        </SwipeableActionItem>
                    ))}
                </div>
            )}
        </>
    );
}
