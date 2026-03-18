"use client";

import "./globals.css";
import { Inter } from "next/font/google";
import Link from "next/link";
import { useFridges } from "@/context/FridgesContext";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
    const { fridges } = useFridges();

    return (
        <div className={`${inter.className} container center-content`}>
            <div className="btn-box">
                <Link href="/join" className="btn-primary">
                    Join The Fride
                </Link>
                <span>or</span>
                <Link href="/create" className="btn-secondary">
                    Create New
                </Link>
                {Object.keys(fridges).length > 0 && (
                    <>
                        <span>or</span>
                        <Link href="/home" className="btn-secondary">
                            Open already joined
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
}
