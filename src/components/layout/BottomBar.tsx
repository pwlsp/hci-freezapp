"use client";

import { Suspense } from "react";
import AddButton from "../ui/AddButton";
import GenerateButton from "../ui/GenerateButton";
import UserButton from "../ui/UserButton";
import styles from "./BottomBar.module.css";

export default function BottomBar() {
    return (
        <div className={styles.bottomBar}>
            <div className={styles.left}>
                <Suspense>
                    <GenerateButton />
                </Suspense>
            </div>
            <div className={styles.center}>
                <Suspense>
                    <AddButton />
                </Suspense>
            </div>
            <div className={styles.right}>
                <Suspense>
                    <UserButton />
                </Suspense>
            </div>
        </div>
    );
}
