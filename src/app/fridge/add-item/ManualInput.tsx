"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import QuantitySelector from "@/components/ui/QuantitySelector";
import { useFridges } from "@/context/FridgesContext";
import { useMembers } from "@/context/MembersContext";
import { UNITS } from "@/db/schema";
import styles from "./add-item.module.css";

const CATEGORIES = ["Dairy", "Vegetables", "Meat", "Fruits", "Beverages"];

function yesterdayDate(): string {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
}

function isFormValid(
    productName: string,
    expirationDate: string,
    category: string,
    unit: string,
    quantity: number | undefined | null,
    owners: string[]
) {
    return productName.trim() !== "" && expirationDate !== "" && unit !== "" && quantity && quantity > 0 && owners.length > 0;
}

function AddItem({ handleAddItem, canBeAdded, buttonMsg }) {
    const searchParams = useSearchParams();
    const fridgeID = searchParams.get("fridge") as string;
    if (!fridgeID) return;

    return (
        <button
            type="button"
            className={`${styles.addItemBtn} ${canBeAdded ? styles.enabled : ""}`}
            disabled={!canBeAdded}
            onClick={() => handleAddItem(fridgeID)}
        >
            {buttonMsg}
        </button>
    );
}

function UserNickname({ fridges, toggleOwner, user }) {
    const searchParams = useSearchParams();
    const fridgeID = searchParams.get("fridge") as string;
    const currentUser = fridges[fridgeID]?.your_member_id;

    useEffect(() => {
        if (!currentUser) return;
        toggleOwner(currentUser, true);
    }, [currentUser, toggleOwner]);

    return (
        <>
            {user.nickname} {currentUser === user.member_id && "(You)"}
        </>
    );
}

type Props = {
    quantity: number | undefined;
    setQuantity: (v: number | undefined) => void;
};

export default function ManualInputElement({
    productName,
    setProductName,
    expirationDate,
    setExpirationDate,
    category,
    setCategory,
    quantity,
    setQuantity,
    unit,
    setUnit,
    selectAll,
    deselectAll,
    toggleOwner,
    selectedOwners,
    handleAddItem,
    buttonMsg = "Add item",
}: Props) {
    const { members } = useMembers();
    const { fridges } = useFridges();

    const canBeAdded = isFormValid(productName, expirationDate, category, unit, quantity, selectedOwners);

    return (
        <>
            <main className={styles.content}>
                {/* Product Name */}
                <div className={styles.inputGroup}>
                    <label htmlFor="product-name" className={styles.label}>
                        Product Name
                    </label>
                    <input
                        id="product-name"
                        type="text"
                        className="input-field"
                        placeholder="Ex: Milk"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                    />
                </div>

                {/* Expiration Date */}
                <div className={styles.inputGroup}>
                    <label htmlFor="exp-date" className={styles.label}>
                        Expiration Date
                    </label>
                    <input
                        id="exp-date"
                        type="date"
                        min={`${yesterdayDate()}`}
                        className="input-field"
                        value={expirationDate}
                        onChange={(e) => setExpirationDate(e.target.value)}
                    />
                </div>

                {/* Category Dropdown */}
                <div className={styles.inputGroup}>
                    <label htmlFor="category-input" className={styles.label}>
                        Category
                    </label>
                    <div style={{ position: "relative" }}>
                        <select
                            id="category-input"
                            className="input-field"
                            style={{ appearance: "none" }}
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <option value="">Select Category</option>
                            {CATEGORIES.map((c) => (
                                <option key={c} value={c}>
                                    {c}
                                </option>
                            ))}
                        </select>
                        {/* Simple arrow indicator */}
                        <span style={{ position: "absolute", right: "12px", top: "16px", pointerEvents: "none" }}>▼</span>
                    </div>
                </div>

                {/* Quantity & Unit Row */}
                <div className={styles.row}>
                    <div className={styles.col} style={{ flex: 1.5 }}>
                        <label htmlFor="quantity-input" className={styles.label}>
                            Quantity
                        </label>
                        <QuantitySelector id="quantity-input" value={quantity ?? 1} onChange={setQuantity} />
                    </div>
                    <div className={styles.col} style={{ flex: 1 }}>
                        <label htmlFor="unit-selector" className={styles.label}>
                            Unit
                        </label>
                        <div style={{ position: "relative" }}>
                            <select
                                id="unit-selector"
                                className="input-field"
                                style={{ height: "48px", appearance: "none" }}
                                value={unit}
                                onChange={(e) => setUnit(e.target.value)}
                            >
                                <option value="" disabled>
                                    Select Unit
                                </option>
                                {UNITS.map((u) => (
                                    <option key={u} value={u}>
                                        {u}
                                    </option>
                                ))}
                            </select>
                            <span style={{ position: "absolute", right: "10px", top: "16px", fontSize: "0.8rem", pointerEvents: "none" }}>
                                ▼
                            </span>
                        </div>
                    </div>
                </div>

                {/* Owners Section */}
                <div>
                    <div className={styles.ownersHeader}>
                        <label htmlFor="owner-section" className={styles.label} style={{ marginBottom: 0 }}>
                            Owners
                        </label>
                        <div className={styles.actions}>
                            <span onClick={selectAll}>select all</span>
                            {" | "}
                            <span onClick={deselectAll}>deselect all</span>
                        </div>
                    </div>

                    <div className={styles.ownerList}>
                        {members.map((user) => (
                            <label key={user.member_id} className={styles.ownerItem}>
                                <input
                                    type="checkbox"
                                    className={styles.checkbox}
                                    checked={selectedOwners.includes(user.member_id)}
                                    onChange={() => toggleOwner(user.member_id)}
                                />
                                <Suspense>
                                    <UserNickname fridges={fridges} toggleOwner={toggleOwner} user={user}></UserNickname>
                                </Suspense>
                            </label>
                        ))}
                    </div>
                </div>
            </main>
            <div className={styles.addBarWrapper}>
                <Suspense>
                    <AddItem handleAddItem={handleAddItem} canBeAdded={canBeAdded} buttonMsg={buttonMsg}></AddItem>
                </Suspense>
            </div>
        </>
    );
}
