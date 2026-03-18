"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useEffect, useRef, useState } from "react";
import { useSearch } from "../../context/SearchContext";
import styles from "./SearchBar.module.css";

export default function SearchBar({ placeholder }: { placeholder: string }) {
    const { query, setQuery } = useSearch();
    const [value, setValue] = useState(query || "");
    const timer = useRef<number | null>(null);

    useEffect(() => {
        setValue(query || "");
    }, [query]);

    useEffect(() => {
        if (timer.current) window.clearTimeout(timer.current);
        timer.current = window.setTimeout(() => setQuery(value), 250) as unknown as number;
        return () => {
            if (timer.current) window.clearTimeout(timer.current);
        };
    }, [value, setQuery]);

    return (
        <div className={styles.searchBar}>
            <input type="text" placeholder={placeholder} onChange={(e) => setValue(e.target.value)} value={value} />
            <MagnifyingGlassIcon className={styles.icon} />
        </div>
    );
}
