import Link from "next/link";
import { useTranslations } from "next-intl";
import { Inbox } from "lucide-react";

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
    <div className="flex flex-col items-center justify-center text-center py-3xl px-lg min-h-[400px]">
      <div className="w-[80px] h-[80px] rounded-full bg-bg-surface border border-border-subtle flex items-center justify-center mb-lg animate-float">
        <Inbox size={32} className="text-[36px]" />
      </div>
      <h3 className="font-heading text-2xl font-bold text-text-primary mb-sm">
        {title || t("title")}
      </h3>
      <p className="text-sm text-text-secondary max-w-[360px] leading-[1.6] mb-xl">
        {description || t("description")}
      </p>
      <Link
        href={ctaHref}
        className="inline-flex items-center gap-sm py-sm px-xl bg-gradient-to-br from-accent-primary to-[#00cc6a] text-bg-primary font-bold text-sm rounded-full transition-all duration-150 hover:-translate-y-[2px] hover:shadow-glow"
      >
        {ctaLabel || t("cta")}
      </Link>
    </div>
  );
}
