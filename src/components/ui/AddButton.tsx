import { PlusIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import useFridgeID from "@/hooks/useFridgeID";
import styles from "./AddButton.module.css";

export default function AddButton() {
    const { fridgeID } = useFridgeID();

    return (
        <div>
            <Link href={`/fridge/add-item?fridge=${fridgeID}`} className={styles.addButton} aria-label="Add item">
                <PlusIcon className="w-6 h-6" />
            </Link>
            <p className={styles.label}>Add Item</p>
        </div>
    );
}
