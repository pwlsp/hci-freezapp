"use client";

import { useSearchParams } from "next/navigation";
import { createContext, type ReactNode, useContext, useEffect, useState } from "react";
import { getMembers } from "./MembersContext.actions";

interface Member {
    member_id: string;
    nickname: string;
}

interface MembersContextType {
    members: Member[];
    isLoading: boolean;
    error: string | null;
}

const MembersContext = createContext<MembersContextType | undefined>(undefined);

export const MembersProvider = ({ children }: { children: ReactNode }) => {
    const [members, setMembers] = useState<Member[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const searchParams = useSearchParams();
    const fridgeID = searchParams.get("fridge");

    useEffect(() => {
        if (!fridgeID) return setMembers([]);

        setIsLoading(true);
        setError(null);
        getMembers(fridgeID)
            .then((resp) => setMembers(resp))
            .catch((err) => {
                setError(err);
                console.error(err);
            })
            .finally(() => setIsLoading(false));
    }, [fridgeID]);

    return <MembersContext.Provider value={{ members, isLoading, error }}>{children}</MembersContext.Provider>;
};

export const useMembers = () => {
    const context = useContext(MembersContext);
    if (context === undefined) {
        throw new Error("useMembers must be used within a MembersProvider");
    }
    return context;
};
