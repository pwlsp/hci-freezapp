"use client";

import { Inter } from "next/font/google";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useFridges } from "@/context/FridgesContext";
import { createFreezer } from "./actions";
import styles from "./create.module.css";

const inter = Inter({ subsets: ["latin"] });

export default function CreateFridgePage() {
    const [users, setUsers] = useState<string[]>([]);
    const [userName, setUserName] = useState("");
    const [freezerName, setFreezerName] = useState("");
    const { addFridgeCode } = useFridges();
    const router = useRouter();

    async function handleCreateFridge() {
        const resp = await createFreezer({ name: freezerName, users: users });
        if ("code" in resp) {
            addFridgeCode(resp.code);
            router.replace(`/fridge/dashboard?fridge=${resp.code}`);
        } else {
            // Handle error case, e.g., show a notification
            alert(resp.error);
        }
    }

    const addUser = () => {
        if (userName.trim() === "") return;

        setUsers([...users, userName.trim()]);
        setUserName("");
    };

    const deleteUser = (index: number) => {
        setUsers(users.filter((_, i) => i !== index));
    };

    return (
        <div className={`${inter.className} ${styles.container}`}>
            <div className={styles.header}>
                <Link href="/" className={styles.backLink}>
                    &lt;-
                </Link>
                <h1 className={styles.title}>Create Fridge</h1>
            </div>
            <main className={styles.content}>
                <div className={styles.inputGroup}>
                    <label htmlFor="freezer-name" className={styles.label}>
                        Fridge Name
                    </label>
                    <input
                        id="freezer-name"
                        type="text"
                        name="name"
                        className="input-field"
                        placeholder="Ex: My Fridge"
                        value={freezerName}
                        onChange={(e) => setFreezerName(e.target.value)}
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label htmlFor="user-input" className={styles.label}>
                        Users
                    </label>
                    <form action={addUser}>
                        <div className={styles.row}>
                            <input
                                id="user-input"
                                type="text"
                                className={styles.userInput}
                                placeholder="Ex: John Doe"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                            />

                            <button type="submit" onClick={addUser} className={styles.addUserBtn}>
                                Add
                            </button>
                        </div>
                    </form>
                </div>

                <ul className={styles.userList}>
                    {users.map((user, index) => (
                        <li key={index} className={styles.userItem}>
                            <span>{user}</span>
                            <button type="button" onClick={() => deleteUser(index)} className={styles.deleteUserBtn}>
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
                <button type="button" className={styles.createBtn} onClick={handleCreateFridge}>
                    Create
                </button>
            </main>
        </div>
    );
}
