"use client";
import type React from "react";
import { Suspense } from "react";
import { MembersProvider } from "@/context/MembersContext";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <Suspense>
            <MembersProvider>{children}</MembersProvider>
        </Suspense>
    );
}
