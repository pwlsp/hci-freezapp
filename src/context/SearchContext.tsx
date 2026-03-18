"use client";

import type React from "react";
import { createContext, useContext, useMemo, useState } from "react";

type SearchContextType = {
    query: string;
    setQuery: (q: string) => void;
};

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children, initialQuery = "" }: { children: React.ReactNode; initialQuery?: string }) {
    const [query, setQuery] = useState<string>(initialQuery);

    const value = useMemo(() => ({ query, setQuery }), [query]);

    return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
}

export function useSearch() {
    const ctx = useContext(SearchContext);
    if (!ctx) throw new Error("useSearch must be used within a SearchProvider");
    return ctx;
}
