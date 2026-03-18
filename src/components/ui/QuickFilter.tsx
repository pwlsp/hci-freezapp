"use client";

import styles from "./QuickFilter.module.css";

type Props = {
    label: string;
    value: string;
    selected: boolean;
    onToggle: (value: string) => void;
};

export default function QuickFilter({ label, value, selected, onToggle }: Props) {
    return (
        <div className={styles.wrapper}>
            <button
                type="button"
                aria-pressed={selected}
                className={`${styles.button} ${selected ? styles.selected : ""}`}
                onClick={() => onToggle(value)}
            >
                {label}
            </button>
        </div>
    );
}
