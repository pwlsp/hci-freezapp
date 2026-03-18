"use client";

import { createContext, type ReactNode, useContext, useEffect, useState } from "react";
import { parse } from "uuid";
import { checkFridgesStatus } from "./FridgeContext.actions";

export type FridgeContext = {
    [code: string]: {
        your_member_id: string | undefined;
    };
};

interface FridgesContextType {
    fridges: FridgeContext;
    addFridgeCode: (code: string) => void;
    setFridgeMember: (code: string, userID: string) => void;
}

const FridgesContext = createContext<FridgesContextType | undefined>(undefined);

export function useFridges() {
    const context = useContext(FridgesContext);
    if (!context) {
        throw new Error("useFridges must be used within a FridgesProvider");
    }
    return context;
}

export function FridgesProvider({ children }: { children: ReactNode }) {
    const [fridges, setFridges] = useState<FridgeContext>({});

    useEffect(() => {
        const storedCodes = localStorage.getItem("fridges");
        if (storedCodes) {
            const parsedFridges = JSON.parse(storedCodes);
            checkFridgesStatus(Object.keys(parsedFridges)).then((codes) => {
                console.log(codes, parsedFridges);
                for (const c of Object.keys(parsedFridges)) {
                    if (codes.includes(c)) continue;

                    delete parsedFridges[c];
                }
                setFridges(parsedFridges);
                localStorage.setItem("fridges", JSON.stringify(parsedFridges));
            });
        }
    }, []);

    const addFridgeCode = (code: string) => {
        if (code in fridges) return;

        const newFridgesVal: FridgeContext = { ...fridges };
        newFridgesVal[code] = { your_member_id: undefined };

        setFridges(newFridgesVal);
        localStorage.setItem("fridges", JSON.stringify(newFridgesVal));
    };

    const setFridgeMember = (code: string, memberID: string) => {
        const newFridges = { ...fridges, [code]: { your_member_id: memberID } };
        setFridges(newFridges);
        localStorage.setItem("fridges", JSON.stringify(newFridges));
    };

    return <FridgesContext.Provider value={{ fridges, addFridgeCode, setFridgeMember }}>{children}</FridgesContext.Provider>;
}
