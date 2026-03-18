import Link from "next/link";
import { useSearchParams } from "next/navigation";
import useFridgeID from "@/hooks/useFridgeID";
import styles from "./GenerateButton.module.css";

export default function GenerateButton() {
    const { fridgeID } = useFridgeID();

    return (
        <div className={styles.wrapper}>
            <Link href={`/fridge/generate?fridge=${fridgeID}`} className={styles.generateButton} aria-label="Generate">
                <img src="/generate.svg" alt="" aria-hidden="true" className={styles.icon} />
            </Link>
            <p className={styles.label}>Generate Meal</p>
        </div>
    );
}
