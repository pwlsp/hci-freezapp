"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Toast from "../../../components/ui/Toast";
import styles from "./generated-meal.module.css";

export default function GeneratedMealPage() {
    const router = useRouter();
    const [showToast, setShowToast] = useState(false);

    const dishName = "Dish name";
    const ingredientsHave = [
        { name: "Milk", amount: "200 ml" },
        { name: "Eggs", amount: "2 pcs" },
    ];
    const ingredientsMissing = [{ name: "Sugar", amount: "100 g" }];
    const preparationSteps =
        "Lorem ipsum asdfjklansdkljfna lsjdnfklas ndflkasnd kljn asd asdf asdfjijaeor n iw ao as kda oi wi asod kask do lsjdnfklas ndflkasnd kljn asd asdf asdfjijaeor n iw ao as kda oi wi asod kask do lsjdnfklas ndflkasnd kljn asd asdf asdfjijaeor n iw ao as kda oi wi asod kask do lsjdnfklas ndflkasnd kljn asd asdf asdfjijaeor n iw ao as kda oi wi asod kask do";

    const handleCopy = () => {
        const textToCopy = ingredientsMissing.map((i) => `${i.name} - ${i.amount}`).join("\n");
        navigator.clipboard.writeText(textToCopy).then(() => {
            setShowToast(true);
        });
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <button type="button" onClick={() => router.back()} className={styles.backButton}>
                    ←
                </button>
                <h1 className={styles.title}>Generated meal</h1>
            </header>

            <div className={styles.content}>
                <h2 className={styles.dishName}>{dishName}</h2>

                <div className={styles.imagePlaceholder}>(image)</div>

                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>Ingredients you have:</h3>
                    <ul className={styles.ingredientList}>
                        {ingredientsHave.map((ing, index) => (
                            <li key={index} className={styles.ingredientItem}>
                                {index + 1}. {ing.name} - {ing.amount}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <h3 className={styles.sectionTitle}>Ingredients you are missing:</h3>
                        <button type="button" className={styles.copyButton} onClick={handleCopy}>
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                            </svg>
                            copy
                        </button>
                    </div>
                    <ul className={styles.ingredientList}>
                        {ingredientsMissing.map((ing, index) => (
                            <li key={index} className={styles.ingredientItem}>
                                {index + 1}. {ing.name} - {ing.amount}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>Preparation steps:</h3>
                    <p className={styles.preparationText}>{preparationSteps}</p>
                </div>
            </div>

            <div className={styles.bottomPanel}>
                <button type="button" className={styles.regenerateButton} onClick={() => console.log("Regenerate")}>
                    Regenerate meal
                </button>
            </div>

            {showToast && <Toast message="Missing ingredients were copied to clipboard" onClose={() => setShowToast(false)} />}
        </div>
    );
}
