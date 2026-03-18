import Fuse from "fuse.js";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

export default function useFridgeID() {
    const searchParams = useSearchParams();
    const fridgeID = searchParams.get("fridge");

    return { fridgeID };
}
