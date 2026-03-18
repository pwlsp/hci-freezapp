"use client";

import { Inter } from "next/font/google";
import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "./join.module.css";
import Link from "next/link";
import { useFridges } from "@/context/FridgesContext";
import { checkIfFridgeExists } from "./actions";

const inter = Inter({ subsets: ["latin"] });

export default function Join() {
    const { addFridgeCode } = useFridges();
    const [fridgeCode, setFridgeCode] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const isDisabled = fridgeCode.length < 4;

    const handleJoin = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        if (isDisabled) return;

        setIsLoading(true);
        const isValid = await checkIfFridgeExists(fridgeCode);
        setIsLoading(false);

        if (!isValid) {
            console.error("Invalid error code");
            return;
        }

        addFridgeCode(fridgeCode);
        router.push(`/fridge/dashboard?fridge=${fridgeCode}`);
    };

    return (
        <div className="container">
            <div className={styles.header}>
                <Link href="/" className={styles.backLink}>
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
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                </Link>
                <h1 className={styles.title}>Join Fridge</h1>
            </div>
            <div className={`${inter.className} container center-content`}>
                <h1>Paste The Fridge Code</h1>
                <div className="btn-box">
                    <input
                        className="codeInput"
                        type="text"
                        value={fridgeCode}
                        onChange={(e) => setFridgeCode(e.target.value.trim())}
                        placeholder="e.g., 1234"
                    />
                    <button
                        type="button"
                        onClick={handleJoin}
                        disabled={isDisabled}
                        className="btn-secondary"
                        style={{
                            cursor: isDisabled ? "not-allowed" : "pointer",
                            opacity: isDisabled ? 0.6 : 1,
                        }}
                    >
                        Join Fridge
                    </button>
                </div>
            </div>
        </div>
    );
}
