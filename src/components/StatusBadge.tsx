import type { BetStatus } from "@/lib/types";
import styles from "./StatusBadge.module.css";

interface StatusBadgeProps {
  status: BetStatus;
}

const statusConfig: Record<BetStatus, { label: string; className: string }> = {
  PENDING: { label: "Pending", className: "pending" },
  WON: { label: "Won", className: "won" },
  LOST: { label: "Lost", className: "lost" },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span className={`${styles.badge} ${styles[config.className]}`}>
      <span className={styles.dot} />
      {config.label}
    </span>
  );
}
