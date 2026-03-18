"use client";

import { useFilters } from "../../context/FiltersContext";
import QuickFilter from "./QuickFilter";
import styles from "./QuickFilters.module.css";

const FILTERS = [
    { label: "Expiring Soon", value: "expiring_soon" },
    { label: "Vegetables", value: "vegetables" },
    { label: "Fruits", value: "fruits" },
    { label: "Dairy", value: "dairy" },
    { label: "Meat", value: "meat" },
];

export default function QuickFilters() {
    const { selected, toggle } = useFilters();

    return (
        <div className={styles.list}>
            {FILTERS.map((filter) => (
                <QuickFilter
                    key={filter.value}
                    label={filter.label}
                    value={filter.value}
                    selected={selected.includes(filter.value)}
                    onToggle={toggle}
                />
            ))}
        </div>
    );
}
