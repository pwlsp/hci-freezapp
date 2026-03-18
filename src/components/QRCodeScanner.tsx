"use client";

import { type Html5QrcodeResult, Html5QrcodeScanner, Html5QrcodeSupportedFormats } from "html5-qrcode";
import type { Html5QrcodeError } from "html5-qrcode/esm/core";
import type { Html5QrcodeScannerConfig } from "html5-qrcode/esm/html5-qrcode-scanner";
import { useEffect, useState } from "react";

export type Props = {
    verbose: boolean;
    qrCodeSuccessCallback: (decodedText: string, result: Html5QrcodeResult) => void;
    qrCodeErrorCallback: (errorMsg: string, error: Html5QrcodeError) => void;
    qrCodeID: string;
} & Html5QrcodeScannerConfig;

function createConfig(props: Html5QrcodeScannerConfig) {
    const config: Html5QrcodeScannerConfig = {
        ...props,
        fps: 15,
        formatsToSupport: [
            Html5QrcodeSupportedFormats.QR_CODE,
            Html5QrcodeSupportedFormats.CODE_128,
            Html5QrcodeSupportedFormats.EAN_13,
            Html5QrcodeSupportedFormats.CODE_39,
            Html5QrcodeSupportedFormats.DATA_MATRIX,
            Html5QrcodeSupportedFormats.ITF,
            Html5QrcodeSupportedFormats.UPC_A,
            Html5QrcodeSupportedFormats.UPC_E,
            Html5QrcodeSupportedFormats.AZTEC,
            Html5QrcodeSupportedFormats.PDF_417,
        ],
    };

    if (props.fps) config.fps = props.fps;
    if (props.qrbox) config.qrbox = props.qrbox;
    if (props.aspectRatio) config.aspectRatio = props.aspectRatio;
    if (props.disableFlip !== undefined) config.disableFlip = props.disableFlip;
    return config;
}

export default function Html5QrcodePlugin(props: Props) {
    const [scanner, setScanner] = useState<Html5QrcodeScanner | undefined>(undefined);

    useEffect(() => {
        if (scanner) return;
        if (!props.qrCodeSuccessCallback) throw "qrCodeSuccessCallback is required callback.";

        const config = createConfig(props);
        const qrScanner = new Html5QrcodeScanner(props.qrCodeID, config, props.verbose);
        setScanner(qrScanner);
    }, [props, scanner]);

    useEffect(() => {
        if (!scanner) return;

        scanner.render(props.qrCodeSuccessCallback, props.qrCodeErrorCallback);

        return () => {
            scanner
                .clear()
                .then(() => console.log("scanner cleared"))
                .catch(() => console.error("cannot clear scanner"));
        };
    }, [scanner, props.qrCodeErrorCallback, props.qrCodeSuccessCallback]);

    return <div id={props.qrCodeID} />;
}
