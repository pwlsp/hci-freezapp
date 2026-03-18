"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useFridges } from "@/context/FridgesContext";
import { getFridgeUsers } from "./actions";
import styles from "./settings.module.css";

type Member = {
    member_id: string;
    freezer_code: string;
    nickname: string;
    isDeleted: boolean | null;
};

export default function SettingsPage() {
    const searchParams = useSearchParams();
    const fridgeId = searchParams.get("fridge");
    const [users, setUsers] = useState<Member[]>([]);
    const { fridges, setFridgeMember } = useFridges();
    const selectedUser = fridges[fridgeId ?? ""]?.your_member_id;

    useEffect(() => {
        if (fridgeId) {
            getFridgeUsers(fridgeId).then(setUsers);
        }
    }, [fridgeId]);

    const handleUserSelect = (userId: string) => {
        if (fridgeId) {
            setFridgeMember(fridgeId, userId);
        }
    };

    return (
        <div className={styles.container}>
            <div style={{ display: "flex", columnGap: "32px", alignContent: "center" }}>
                <Link className={styles.backLink} href={`/fridge/dashboard?fridge=${fridgeId}`}>
                    ←
                </Link>
                <h1>Settings</h1>
            </div>
            <p>Select your user profile:</p>
            <div className={styles.userList}>
                {users.map((user) => (
                    <div
                        key={user.member_id}
                        className={`${styles.user} ${selectedUser === user.member_id ? styles.selected : ""}`}
                        onClick={() => handleUserSelect(user.member_id)}
                    >
                        {user.nickname}
                    </div>
                ))}
            </div>
        </div>
    );
}
