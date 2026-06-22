"use client";

import { motion } from "framer-motion";

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
      className={`flex flex-col items-center justify-center gap-[2px] p-sm rounded-md flex-1 ${
        isSelected
          ? "liquid-button !border-accent-primary !bg-[rgba(0,255,135,0.15)] !shadow-[inset_0_1px_2px_rgba(255,255,255,0.3),0_8px_24px_rgba(0,255,135,0.3)] scale-[1.02]"
          : "liquid-button"
      } ${isDisabled && !isSelected ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
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
      <span className={`font-heading text-lg font-extrabold max-md:text-base ${isSelected ? "text-accent-primary" : "text-text-primary"}`}>{label}</span>
      <span className="text-[10px] text-text-muted font-medium uppercase tracking-[0.3px]">{subLabel}</span>
      <span className="text-sm font-bold text-accent-primary mt-[2px] max-md:text-xs">{odd.toFixed(2)}</span>
    </motion.button>
  );
}
