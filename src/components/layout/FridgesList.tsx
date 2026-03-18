"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useFridges } from "@/context/FridgesContext";
import { getFridgeNames } from "./FridgeList.actions";
import styles from "./FridgeList.module.css";

export default function FridgesList() {
    const { fridges } = useFridges();
    const [namedFridges, setNamedFridges] = useState<{ name: string; freezerID: string }[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();

    useEffect(() => {
        setIsLoading(true);
        getFridgeNames(Object.keys(fridges))
            .then((resp) => setNamedFridges(resp))
            .finally(() => setIsLoading(false));
    }, [fridges]);

    return (
        <div>
            <button type="button" className={styles.backButton} onClick={() => router.back()}>
                &lt;-
            </button>
            <h2 className={styles.header}>Joined Fridges</h2>
            {isLoading && <span>Loading...</span>}
            {!isLoading && (
                <ul className={styles.freezerList}>
                    {namedFridges.map((v) => (
                        <li style={{ width: "100%" }} key={v.freezerID}>
                            <Link className={styles.freezer} href={`/fridge/dashboard?fridge=${v.freezerID}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 16 16">
                                    <title>Freezer</title>
                                    <path d="M5 12.5a1.5 1.5 0 1 1-2-1.415V9.5a.5.5 0 0 1 1 0v1.585A1.5 1.5 0 0 1 5 12.5" />
                                    <path d="M1 2.5a2.5 2.5 0 0 1 5 0v7.55a3.5 3.5 0 1 1-5 0zM3.5 1A1.5 1.5 0 0 0 2 2.5v7.987l-.167.15a2.5 2.5 0 1 0 3.333 0L5 10.486V2.5A1.5 1.5 0 0 0 3.5 1m5 1a.5.5 0 0 1 .5.5v1.293l.646-.647a.5.5 0 0 1 .708.708L9 5.207v1.927l1.669-.963.495-1.85a.5.5 0 1 1 .966.26l-.237.882 1.12-.646a.5.5 0 0 1 .5.866l-1.12.646.884.237a.5.5 0 1 1-.26.966l-1.848-.495L9.5 8l1.669.963 1.849-.495a.5.5 0 1 1 .258.966l-.883.237 1.12.646a.5.5 0 0 1-.5.866l-1.12-.646.237.883a.5.5 0 1 1-.966.258L10.67 9.83 9 8.866v1.927l1.354 1.353a.5.5 0 0 1-.708.708L9 12.207V13.5a.5.5 0 0 1-1 0v-11a.5.5 0 0 1 .5-.5" />
                                </svg>
                                {v.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
            <div className={styles.newFridgeSection}>
                {!isLoading && (namedFridges.length === 0 ? <span>You don't have any fridges</span> : <span>or</span>)}
                <Link className="btn-secondary" href="/">
                    Create or Join fridge
                </Link>
            </div>
        </div>
    );
}
