import { useMembers } from "@/context/MembersContext";
import type { ProductInfo } from "../layout/ItemsList.acions";
import styles from "./Item.module.css";

type Props = {
    product: ProductInfo;
    className?: string;
    onClick?: () => void;
    isDragging?: boolean;
};

const pad = (v: number | string): string => (+v < 10 ? `0${v}` : `${v}`);
function displayDate(d: Date | undefined): string {
    if (!d) return "unknown exp";
    return `${d.getFullYear()}/${pad(d.getMonth())}/${pad(d.getDate())}`;
}

export default function Item({ product, className, onClick, isDragging }: Props) {
    const { members } = useMembers();

    function ownersName(): string {
        const owners = product.owners;
        if (!owners || owners.length === 0) return "-";

        if (members.length !== owners.length) return owners.map((v) => v.nickname).join(", ");
        if (JSON.stringify(owners.map((v) => v.member_id).sort()) !== JSON.stringify(members.map((v) => v.member_id).sort()))
            return owners.map((v) => v.nickname).join(", ");

        return "All";
    }

    function handleClick() {
        if (isDragging) return;
        onClick?.();
    }

    return (
        // biome-ignore lint/a11y/useKeyWithClickEvents: handled elsewhere
        // biome-ignore lint/a11y/noStaticElementInteractions: acceptable here
        <div className={`${styles.item} ${className || ""}`} onClick={handleClick}>
            <div className={styles.itemInfo}>
                <div className={styles.title}>{product.name}</div>
                {<div className={styles.detail}>Owners: {ownersName()}</div>}
            </div>
            <div className={styles.itemdetails}>
                {<div className={styles.detail}>{displayDate(product.expirationDate ?? undefined)}</div>}
                {product.quantity && (
                    <div className={styles.detail}>
                        {product.quantity} {product.unit}
                    </div>
                )}
            </div>
        </div>
    );
}
