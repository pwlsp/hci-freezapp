"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchProducts, type ProductInfo } from "@/components/layout/ItemsList.acions";
import Item from "../../../components/ui/Item";
import QuantitySelector from "../../../components/ui/QuantitySelector";
import styles from "./generate.module.css";

export default function GeneratePage() {
    const [items, setItems] = useState<ProductInfo[]>([]);
    const router = useRouter();
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [peopleCount, setPeopleCount] = useState<number | undefined>(1);
    const [useSelectedOnly, setUseSelectedOnly] = useState(false);

    const searchParams = useSearchParams();
    const fridgeID = searchParams.get("fridge") as string;

    useEffect(() => {
        fetchProducts(fridgeID)
            .then((resp) => setItems(resp))
            .catch((err) => console.error("err", err));
    }, [fridgeID]);

    const sortedItems = [...items].sort((a, b) => {
        if (!a.expirationDate) return 1;
        if (!b.expirationDate) return -1;

        return a.expirationDate.getTime() - b.expirationDate.getTime();
    });

    const isListEmpty = sortedItems.length === 0;

    const allSelected = selectedItems.length === items.length && items.length > 0;

    const toggleItem = (id: number) => {
        setSelectedItems((prev) => (prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]));
    };

    const toggleSelectAll = () => {
        if (allSelected) {
            setSelectedItems([]);
        } else {
            setSelectedItems(items.map((it) => it.id));
        }
    };

    const handleGenerate = () => {
        // Logic to generate meal would go here
        console.log("Generating meal with:", { selectedItems, peopleCount, useSelectedOnly });
        router.push(`/fridge/generated-meal?fridge=${fridgeID}`);
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <button type="button" onClick={() => router.back()} className={styles.backButton}>
                    ←
                </button>
                <h1 className={styles.title}>Generate meal</h1>
            </header>

            <div className={styles.selectionHeader}>
                <h2 className={styles.selectionTitle}>
                    Select items you want to use: {selectedItems.length > 0 && `(${selectedItems.length} selected)`}
                </h2>
                <label className={styles.selectAll}>
                    <input type="checkbox" checked={allSelected} onChange={toggleSelectAll} />
                    select all
                </label>
            </div>

            <div className={styles.list}>
                {isListEmpty && <div className={styles.emptyMessage}>Your fridge is empty :(</div>}
                {!isListEmpty &&
                    sortedItems.map((item) => {
                        const isSelected = selectedItems.includes(item.id);
                        return (
                            <Item
                                key={item.id}
                                product={item}
                                className={`${styles.item} ${isSelected ? styles.selectedItem : ""}`}
                                onClick={() => toggleItem(item.id)}
                            />
                        );
                    })}
            </div>

            <div className={styles.bottomPanel}>
                <div className={styles.peopleSelector}>
                    <span className={styles.peopleLabel}>For how many people?</span>
                    <QuantitySelector
                        id="people-quantity"
                        value={peopleCount}
                        onChange={setPeopleCount}
                        className={styles.quantitySelector}
                    />
                </div>

                <label className={styles.useSelectedOnly}>
                    <input type="checkbox" checked={useSelectedOnly} onChange={(e) => setUseSelectedOnly(e.target.checked)} />
                    Use <u>only</u> selected items
                </label>

                <button type="button" className={styles.generateButton} disabled={selectedItems.length === 0} onClick={handleGenerate}>
                    Generate meal
                </button>
            </div>
        </div>
    );
}
