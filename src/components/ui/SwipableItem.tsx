"use client";

import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { AnimatePresence, motion, type PanInfo, useAnimation, useMotionValue } from "framer-motion";
import React, { useEffect, useState } from "react";
import QuantitySelector from "./QuantitySelector";
import styles from "./SwipableItem.module.css";

interface SwipeableActionItemProps {
    id: string;
    quantity: number;
    children: React.ReactNode;
    onDelete: (v: number) => void;
    onAdd: (v: number) => void;
}

export const SwipeableActionItem = ({ id, quantity, children, onDelete, onAdd }: SwipeableActionItemProps) => {
    const controls = useAnimation();
    const x = useMotionValue(0);
    const [isOpen, setIsOpen] = useState<"left" | "right" | null>(null);
    const [dragDirection, setDragDirection] = useState<"left" | "right" | null>(null);
    const [isDraggingFlag, setIsDraggingFlag] = useState(false);

    const [addQuantity, setAddQuantity] = useState<number | undefined>(1);
    const [deleteQuantity, setDeleteQuantity] = useState<number | undefined>(1);

    useEffect(() => {
        const unsubscribe = x.on("change", (latest) => {
            if (latest < 1 && dragDirection !== "left") setDragDirection("left");
            else if (latest > -1 && dragDirection !== "right") setDragDirection("right");
        });
        return () => unsubscribe();
    }, [x, dragDirection]);

    const handleDragEnd = async (event: any, info: PanInfo) => {
        const threshold = 100;
        const velocityThreshold = 1000;

        if (isOpen && (Math.abs(info.offset.x) > threshold || Math.abs(info.velocity.x) > velocityThreshold)) {
            resetPosition();
        } else if (info.offset.x > threshold || info.velocity.x > velocityThreshold) {
            await controls.start({ x: "75%" });
            setIsOpen("left");
        } else if (info.offset.x < -threshold || info.velocity.x < -velocityThreshold) {
            await controls.start({ x: "-75%" });
            setIsOpen("right");
        } else {
            resetPosition();
        }
        setIsDraggingFlag(false);
    };

    const handleDragStart = () => {
        setIsDraggingFlag(true);
    };

    const resetPosition = () => {
        controls.start({ x: 0 });
        setIsOpen(null);
    };

    const handleAction = (cb: () => void) => {
        return () => {
            resetPosition();
            cb();
        };
    };

    return (
        <motion.div layout className={styles.motionWrapper}>
            <div className={styles.swipeOptionWrapper}>
                <div
                    className={`${styles.swipeOption} ${styles.swipeElementLeft} ${dragDirection === "right" ? styles.show : styles.hide}`}
                >
                    <div className={`${styles.option}`} style={{ zIndex: 10 }}>
                        <button type="button" className={styles.actionBtn} onClick={handleAction(() => onDelete(deleteQuantity ?? 0))}>
                            <TrashIcon></TrashIcon>
                        </button>
                        <div style={{ width: "150px" }}>
                            <QuantitySelector
                                id="delete-quantity"
                                value={1}
                                limit={quantity}
                                onChange={setDeleteQuantity}
                            ></QuantitySelector>
                        </div>
                    </div>
                </div>
                <div
                    className={`${styles.swipeOption} ${styles.swipeElementRight} ${dragDirection === "left" ? styles.show : styles.hide}`}
                >
                    <div className={`${styles.option}`} style={{ zIndex: 10 }}>
                        <div style={{ width: "150px" }}>
                            <QuantitySelector id="add-quantity" value={1} onChange={setAddQuantity}></QuantitySelector>
                        </div>
                        <button type="button" className={styles.actionBtn} onClick={handleAction(() => onAdd(addQuantity ?? 0))}>
                            <PlusIcon></PlusIcon>
                        </button>
                    </div>
                </div>
            </div>

            <motion.div
                style={{ x }}
                animate={controls}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={1}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                className={styles.swipeItem}
            >
                <div className={styles.item}>
                    {React.isValidElement(children)
                        ? (() => {
                              const childElement = children as React.ReactElement<{ isDragging?: boolean }>;
                              return React.cloneElement(childElement, { ...childElement.props, isDragging: isDraggingFlag });
                          })()
                        : children}
                </div>
            </motion.div>
        </motion.div>
    );
};
