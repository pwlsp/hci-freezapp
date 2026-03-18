import Fuse from "fuse.js";
import { useMemo } from "react";

export default function useFuseSearch<T extends Record<string, any>>(items: T[], keys: string[], term: string) {
    const fuse = useMemo(() => {
        return new Fuse(items, {
            keys,
            includeScore: true,
            threshold: 0.4,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(items), keys.join(",")]);

    return useMemo(() => {
        if (!term) return items;
        try {
            return fuse.search(term).map((r) => r.item as T);
        } catch (e) {
            return items;
        }
    }, [fuse, term, items]);
}
