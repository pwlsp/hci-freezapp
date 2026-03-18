"use client";

import { useEffect, useState } from "react";
import styles from "./QuantitySelector.module.css";

type Props = {
    id: string;
    value?: number | undefined;
    limit?: number;
    onChange: (val: number | undefined) => void;
    className?: string;
};

export default function QuantitySelector({ id, value: propValue, limit, onChange, className }: Props) {
    const [value, setValue] = useState<string>(() => (typeof propValue === "number" ? String(propValue) : ""));

    useEffect(() => {
        if (typeof propValue === "number") setValue(propValue.toString());
        else setValue("");
    }, [propValue]);

    const parseValue = (v: string): number | undefined => {
        if (v.trim() === "") return undefined;
        try {
            const n = parseInt(v, 10);
            if (Number.isNaN(n)) return undefined;
            return n;
        } catch {}
        return undefined;
    };

    const handleInputChange = (raw: string) => {
        const cleaned = raw.replace(/\D+/g, "");
        setValue(cleaned);
        const parsed = parseValue(cleaned);
        onChange(parsed);
    };

    const increase = () => {
        const parsed = parseValue(value);
        if (parsed === undefined) {
            setValue("1");
            onChange(1);
        } else {
            let next = parsed + 1;
            if (limit && next > limit) next = limit;
            setValue(String(next));
            onChange(next);
        }
    };

    const decrease = () => {
        const parsed = parseValue(value);
        if (parsed === undefined) {
            setValue("1");
            onChange(1);
        } else {
            let next = parsed - 1;
            if (next < 1) next = 1;
            setValue(String(next));
            onChange(next);
        }
    };

    return (
        <div className={`${styles.wrapper} ${className || ""}`}>
            <button type="button" onClick={decrease} className={styles.btn}>
                -
            </button>
            <input
                id={id}
                className={styles.display}
                value={value}
                inputMode="numeric"
                pattern="[0-9]*"
                onChange={(e) => handleInputChange(e.target.value)}
                // allow empty and only digits via onPaste as well
                onPaste={(e) => {
                    const paste = e.clipboardData.getData("text");
                    const cleaned = paste.replace(/\D+/g, "");
                    e.preventDefault();
                    handleInputChange(cleaned);
                }}
            />
            <button type="button" onClick={increase} className={styles.btn}>
                +
            </button>
        </div>
    );
}
