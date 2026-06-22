import type { BetStatus } from "@/lib/types";
import { useTranslations } from "next-intl";

interface StatusBadgeProps {
  status: BetStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const t = useTranslations("Components");

  const statusConfig: Record<BetStatus, { label: string; containerClass: string; dotClass: string }> = {
    PENDING: { 
      label: t("pending"), 
      containerClass: "bg-status-pending-bg text-status-pending border border-[#ffb800]/20",
      dotClass: "bg-status-pending animate-[pulse-glow-amber_2s_ease-in-out_infinite]"
    },
    WON: { 
      label: t("won"), 
      containerClass: "bg-status-won-bg text-status-won border border-status-won/20",
      dotClass: "bg-status-won"
    },
    LOST: { 
      label: t("lost"), 
      containerClass: "bg-status-lost-bg text-status-lost border border-status-lost/20",
      dotClass: "bg-status-lost"
    },
  };

  const config = statusConfig[status];

  return (
    <span className={`inline-flex items-center gap-[6px] px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-[0.5px] ${config.containerClass}`}>
      <span className={`w-[6px] h-[6px] rounded-full ${config.dotClass}`} />
      {config.label}
    </span>
  );
}
