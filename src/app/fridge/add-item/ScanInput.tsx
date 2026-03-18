"use client";

import type { Html5QrcodeScanner } from "html5-qrcode";
import { useState } from "react";
import Html5QrcodePlugin from "@/components/QRCodeScanner";
import { getProductInfoFromBarcode } from "./ScanInput.actions";

interface Props {
    setProductName: (v: string) => void;
    setInputMode: (v: "manual" | "scan") => void;
}

export default function ScanInputElement({ setProductName, setInputMode }: Props) {
    const [barcode, setBarcode] = useState("");

    function goodCode(scannedBarcode: string) {
        if (barcode) return;
        setBarcode(scannedBarcode);

        getProductInfoFromBarcode(scannedBarcode)
            .then((resp) => {
                setInputMode("manual");
                if (resp.status === 0) return;

                if (resp?.product?.product_name) setProductName(resp.product.product_name);
            })
            .finally(() => setBarcode(""));
    }

    function badCode(error: string) {
        console.log("baaad", error);
    }

    return (
        <div>
            {!barcode && (
                <Html5QrcodePlugin
                    verbose={false}
                    qrCodeSuccessCallback={goodCode}
                    qrCodeErrorCallback={badCode}
                    qrbox={{ width: 250, height: 250 }}
                    fps={20}
                    qrCodeID="qrcode-scanner"
                ></Html5QrcodePlugin>
            )}
            {barcode && (
                <div>
                    <h1>Yay! Barcode scanned</h1>
                    <h2>{barcode}</h2>
                </div>
            )}
        </div>
    );
}
