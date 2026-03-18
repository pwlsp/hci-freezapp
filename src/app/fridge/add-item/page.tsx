"use client";

import { Inter } from "next/font/google";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Suspense, useState } from "react";
import { useMembers } from "@/context/MembersContext";
import type { UNITS } from "@/db/schema";
import useFridgeID from "@/hooks/useFridgeID";
import { addItem } from "./actions";
import styles from "./add-item.module.css";
import ManualInputElement from "./ManualInput";
import ScanInputElement from "./ScanInput";

const inter = Inter({ subsets: ["latin"] });

function BackButton() {
    const { fridgeID } = useFridgeID();

    return (
        <Link href={`/fridge/dashboard?fridge=${fridgeID}`} className={styles.backLink}>
            <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <title>Go back</title>
                <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
        </Link>
    );
}

export default function AddItemPage() {
    const { members } = useMembers();

    const [inputMode, setInputMode] = useState<"scan" | "manual">("manual");
    const [quantity, setQuantity] = useState<number>(1);
    const [selectedOwners, setSelectedOwners] = useState<string[]>([]); // Default to 'You'
    const [productName, setProductName] = useState("");
    const [expirationDate, setExpirationDate] = useState("");
    const [category, setCategory] = useState("");
    const [unit, setUnit] = useState<(typeof UNITS)[number]>("pcs");

    const router = useRouter();

    // Helper to handle owner selection
    const toggleOwner = (id: string, forceValue: boolean | undefined = undefined) => {
        setSelectedOwners((prev) => {
            if (prev.includes(id)) {
                if (forceValue !== true) return prev.filter((uid) => uid !== id);
            } else {
                if (forceValue !== false) return [...prev, id];
            }
            return prev;
        });
    };

    const selectAll = () => setSelectedOwners(members.map((u) => u.member_id));
    const deselectAll = () => setSelectedOwners([]);

    const handleAddItem = async (fridgeCode: string) => {
        const resp = await addItem({
            freezerCode: fridgeCode,
            name: productName,
            expirationDate: new Date(expirationDate),
            category: category,
            quantity: quantity,
            unit: unit,
            owners: selectedOwners,
        });
        console.log(resp);
        if ("status" in resp) {
            router.push(`/fridge/dashboard?fridge=${fridgeCode}`);
        }
    };

    const everything = {
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
        handleAddItem,
        selectedOwners,
    };

    return (
        <Suspense>
            <div className={`${inter.className} ${styles.container}`}>
                <Suspense>
                    <BackButton></BackButton>
                </Suspense>
                <div className={styles.header}>
                    <h1 className={styles.title}>Add item</h1>
                </div>

                <Suspense>{inputMode === "manual" && <ManualInputElement {...everything}></ManualInputElement>}</Suspense>
                {inputMode === "scan" && <ScanInputElement setProductName={setProductName} setInputMode={setInputMode}></ScanInputElement>}

                {/* Fixed Bottom Toggle Bar */}
                <div className={styles.bottomBar}>
                    <div className={styles.toggleContainer}>
                        <button
                            type="button"
                            className={`${styles.toggleBtn} ${inputMode === "scan" ? styles.active : ""}`}
                            onClick={() => setInputMode("scan")}
                        >
                            Scan
                        </button>
                        <button
                            type="button"
                            className={`${styles.toggleBtn} ${inputMode === "manual" ? styles.active : ""}`}
                            onClick={() => setInputMode("manual")}
                        >
                            Manual
                        </button>
                    </div>
                </div>
            </div>
        </Suspense>
    );
}
