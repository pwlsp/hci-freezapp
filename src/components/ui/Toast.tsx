import { useEffect } from "react";
import styles from "./Toast.module.css";

type Props = {
    message: string;
    onClose: () => void;
    duration?: number;
};

export default function Toast({ message, onClose, duration = 3000 }: Props) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    return <div className={styles.toast}>{message}</div>;
}
