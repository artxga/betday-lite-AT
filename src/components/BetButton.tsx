"use client";

import { motion } from "framer-motion";
import styles from "./BetButton.module.css";

interface BetButtonProps {
  label: string;
  subLabel: string;
  odd: number;
  isSelected: boolean;
  isDisabled: boolean;
  onClick: () => void;
}

export default function BetButton({
  label,
  subLabel,
  odd,
  isSelected,
  isDisabled,
  onClick,
}: BetButtonProps) {
  return (
    <motion.button
      className={`${styles.btn} ${isSelected ? styles.selected : ""} ${isDisabled && !isSelected ? styles.disabled : ""}`}
      onClick={onClick}
      disabled={isDisabled}
      whileHover={!isDisabled ? { scale: 1.04 } : undefined}
      whileTap={!isDisabled ? { scale: 0.96 } : undefined}
      animate={
        isSelected
          ? {
              boxShadow: [
                "0 0 0px rgba(0,255,135,0.3)",
                "0 0 20px rgba(0,255,135,0.4)",
                "0 0 0px rgba(0,255,135,0.3)",
              ],
            }
          : undefined
      }
      transition={
        isSelected
          ? { boxShadow: { duration: 1.5, repeat: Infinity } }
          : { duration: 0.15 }
      }
    >
      <span className={styles.label}>{label}</span>
      <span className={styles.subLabel}>{subLabel}</span>
      <span className={styles.odd}>{odd.toFixed(2)}</span>
    </motion.button>
  );
}
