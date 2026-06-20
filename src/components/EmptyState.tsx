import Link from "next/link";
import styles from "./EmptyState.module.css";

interface EmptyStateProps {
  title?: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export default function EmptyState({
  title = "No bets yet",
  description = "You haven't placed any bets yet. Head to the home page and start betting on today's matches!",
  ctaLabel = "Browse Matches",
  ctaHref = "/",
}: EmptyStateProps) {
  return (
    <div className={styles.empty}>
      <div className={styles.iconWrapper}>
        <span className={styles.icon}>🎰</span>
      </div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
      <Link href={ctaHref} className={styles.cta}>
        {ctaLabel}
      </Link>
    </div>
  );
}
