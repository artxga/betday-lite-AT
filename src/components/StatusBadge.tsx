import type { BetStatus } from "@/lib/types";
import { useTranslations } from "next-intl";
import styles from "./StatusBadge.module.css";

interface StatusBadgeProps {
  status: BetStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const t = useTranslations("Components");

  const statusConfig: Record<BetStatus, { label: string; className: string }> = {
    PENDING: { label: t("pending"), className: "pending" },
    WON: { label: t("won"), className: "won" },
    LOST: { label: t("lost"), className: "lost" },
  };

  const config = statusConfig[status];

  return (
    <span className={`${styles.badge} ${styles[config.className]}`}>
      <span className={styles.dot} />
      {config.label}
    </span>
  );
}
