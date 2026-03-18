import Link from "next/link";
import { Suspense } from "react";
import SearchBar from "../ui/SearchBar";
import SettingsButton from "../ui/SettingsButton";
import styles from "./NavBar.module.css";

export default function NavBar() {
    return (
        <nav className={styles.navbar}>
            <Link href="/home" className={styles.brand}>
                Freezapp
            </Link>
            <SearchBar placeholder="Search for an item..." />
            <Suspense>
                <SettingsButton />
            </Suspense>
        </nav>
    );
}
