"use client";

import type React from "react";
import { Suspense } from "react";
import QuickFilters from "@/components/ui/QuickFilters";
import { FiltersProvider } from "@/context/FiltersContext";
import { SearchProvider } from "@/context/SearchContext";
import BottomBar from "../../../components/layout/BottomBar";
import NavBar from "../../../components/layout/NavBar";
import styles from "./dashboard.module.css";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className={styles.wrapper}>
            <Suspense>
                <FiltersProvider>
                    <SearchProvider>
                        <NavBar />
                        <QuickFilters />
                        <main className={styles.main}>{children}</main>
                        <BottomBar />
                    </SearchProvider>
                </FiltersProvider>
            </Suspense>
        </div>
    );
}
