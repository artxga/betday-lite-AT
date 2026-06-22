import Link from "next/link";
import { useTranslations } from "next-intl";
import styles from "./EmptyState.module.css";

interface EmptyStateProps {
  title?: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export default function EmptyState({
  title,
  description,
  ctaLabel,
  ctaHref = "/",
}: EmptyStateProps) {
  const t = useTranslations("Components.emptyState");

  return (
    <div className={styles.empty}>
      <div className={styles.iconWrapper}>
        <span className={styles.icon}>🎰</span>
      </div>
      <h3 className={styles.title}>{title || t("title")}</h3>
      <p className={styles.description}>{description || t("description")}</p>
      <Link href={ctaHref} className={styles.cta}>
        {ctaLabel || t("cta")}
      </Link>
    </div>
  );
}
