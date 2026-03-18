"use client";

import { useEffect, useRef, useState } from "react";
import { useFridges } from "@/context/FridgesContext";
import { useMembers } from "@/context/MembersContext";
import useFridgeID from "@/hooks/useFridgeID";
import { useFilters } from "../../context/FiltersContext";
import styles from "./UserButton.module.css";

export default function UserButton() {
    const { fridges } = useFridges();
    const { fridgeID } = useFridgeID();

    const { members, isLoading } = useMembers();
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement | null>(null);
    const { selectedUsers, toggleUser } = useFilters();

    const currentUser = fridges[fridgeID ?? ""]?.your_member_id;

    useEffect(() => {
        function onDocClick(e: MouseEvent) {
            if (!ref.current) return;
            if (!ref.current.contains(e.target as Node)) setOpen(false);
        }

        function onKey(e: KeyboardEvent) {
            if (e.key === "Escape") setOpen(false);
        }

        document.addEventListener("click", onDocClick);
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("click", onDocClick);
            document.removeEventListener("keydown", onKey);
        };
    }, []);

    function toggle() {
        setOpen((v) => !v);
    }

    function onToggleUser(id: string) {
        toggleUser(id);
    }

    return (
        <div className={styles.wrapper} ref={ref}>
            <button className={styles.userButton} aria-expanded={open} onClick={toggle} type="button">
                <img src="/user.svg" alt="" aria-hidden="true" className={styles.icon} />
            </button>
            <p className={styles.label}>Users</p>

            {open && (
                <div className={styles.menu} role="menu">
                    <label className={styles.menuItem} key="all">
                        <input type="checkbox" checked={selectedUsers.includes("All")} onChange={() => onToggleUser("All")} />
                        <span className={styles.userName}>All</span>
                    </label>
                    {!isLoading &&
                        members.map((u) => (
                            <label className={styles.menuItem} key={u.member_id}>
                                <input
                                    type="checkbox"
                                    checked={selectedUsers.includes(u.member_id)}
                                    onChange={() => onToggleUser(u.member_id)}
                                />
                                <span className={styles.userName}>
                                    {u.nickname} {currentUser === u.member_id && "(You)"}
                                </span>
                            </label>
                        ))}
                </div>
            )}
        </div>
    );
}
