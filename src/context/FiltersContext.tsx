"use client";

import type React from "react";
import { createContext, useCallback, useContext, useMemo, useState } from "react";

type FiltersContextType = {
    selected: string[];
    toggle: (value: string) => void;
    setSelected: (values: string[]) => void;
    selectedUsers: string[];
    toggleUser: (id: string) => void;
    setSelectedUsers: (ids: string[]) => void;
};

const FiltersContext = createContext<FiltersContextType | undefined>(undefined);

export function FiltersProvider({ children }: { children: React.ReactNode }) {
    const [selected, setSelected] = useState<string[]>(["expiring_soon"]);

    const toggle = useCallback((value: string) => {
        setSelected((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));
    }, []);

    // users selection: default 'All'
    const [selectedUsers, setSelectedUsers] = useState<string[]>(["All"]);

    const toggleUser = useCallback((id: string) => {
        setSelectedUsers((prev) => {
            if (id === "All") return ["All"];
            // if All is selected and user toggles a specific user, replace with that user
            if (prev.includes("All")) return [id];
            const next = prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id];
            return next.length === 0 ? ["All"] : next;
        });
    }, []);

    const ctx = useMemo(
        () => ({
            selected,
            toggle,
            setSelected,
            selectedUsers,
            toggleUser,
            setSelectedUsers,
        }),
        [selected, toggle, selectedUsers, toggleUser]
    );

    return <FiltersContext.Provider value={ctx}>{children}</FiltersContext.Provider>;
}

export function useFilters() {
    const ctx = useContext(FiltersContext);
    if (!ctx) throw new Error("useFilters must be used within FiltersProvider");
    return ctx;
}
