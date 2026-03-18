"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

/**
 * Hook that returns the current `fridge` query param and optionally redirects
 * to a fallback route when it's missing.
 *
 * Usage:
 * const { fridgeID } = useRequireFridgeID();
 *
 * By default it redirects to `/home` when fridge is not present. You can pass
 * a different redirect path: useRequireFridgeID('/').
 */
export default function useRequireFridgeID(redirectTo = "/home") {
    const searchParams = useSearchParams();
    const router = useRouter();

    const fridgeID = searchParams.get("fridge") ?? "";

    useEffect(() => {
        if (!fridgeID) {
            // replace so the history doesn't keep the invalid page
            router.replace(redirectTo);
        }
    }, [fridgeID, redirectTo, router]);

    return { fridgeID };
}
