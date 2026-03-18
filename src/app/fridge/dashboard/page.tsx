"use client";
import { Suspense } from "react";
import ItemsList from "@/components/layout/ItemsList";

const loadingElem = () => <span>Loading...</span>;

export default function DashboardPage() {
    return (
        <Suspense fallback={loadingElem()}>
            <ItemsList />
        </Suspense>
    );
}
