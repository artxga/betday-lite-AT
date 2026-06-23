"use client";

import { motion } from "framer-motion";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import type { BetWithMatch, BetPick } from "@/lib/types";
import StatusBadge from "../ui/StatusBadge";

interface BetCardProps {
  bet: BetWithMatch;
  index: number;
}

const pickLabels: Record<BetPick, string> = {
  HOME: "1",
  DRAW: "X",
  AWAY: "2",
};

export default function BetCard({ bet, index }: BetCardProps) {
  const t = useTranslations("Components.betCard");
  const tPick = useTranslations("BetDetail");
  const matchTime = bet.match
    ? new Date(bet.match.startTime).toLocaleTimeString("en-US", {
        timeZone: "America/Lima",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    : "";

  const placedDate = new Date(bet.placedAt).toLocaleDateString("en-US", {
    timeZone: "America/Lima",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.35 }}
    >
      <Link
        href={`/bets/${bet.id}`}
        className="block liquid-glass rounded-lg p-lg max-md:p-md relative overflow-hidden cursor-pointer transition-all duration-250 hover:border-white/10 hover:-translate-y-[2px] hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),inset_0_-1px_1px_rgba(255,255,255,0.05),0_12px_40px_rgba(0,0,0,0.5)] before:absolute before:inset-x-0 before:top-0 before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-accent-blue/30 before:to-transparent"
      >
        <div className="flex justify-between items-start mb-md">
          <div className="flex flex-col gap-1">
            {bet.match && (
              <>
                <span className="flex items-center gap-[6px] text-xs font-semibold text-accent-purple uppercase tracking-[0.5px]">
                  <span className="w-[6px] h-[6px] rounded-full bg-accent-purple" />
                  {bet.match.league.name}
                </span>
                <span className="text-xs text-text-muted">{matchTime}</span>
              </>
            )}
          </div>
          <StatusBadge status={bet.status} />
        </div>

        <div className="flex items-center gap-sm mb-lg">
          {bet.match ? (
            <>
              <span className="font-heading text-lg max-md:text-base font-bold text-text-primary">
                {bet.match.homeTeam.name}
              </span>
              <span className="text-sm text-text-muted font-medium">{t("vs")}</span>
              <span className="font-heading text-lg max-md:text-base font-bold text-text-primary">
                {bet.match.awayTeam.name}
              </span>
            </>
          ) : (
            <span className="font-heading text-lg max-md:text-base font-bold text-text-primary">
              {t("match", { id: bet.matchId })}
            </span>
          )}
        </div>

        <div className="flex items-center gap-lg max-md:gap-md flex-wrap">
          <div className="flex items-center gap-sm">
            <span className="w-8 h-8 rounded-md bg-accent-primary-dim border border-border-accent flex items-center justify-center font-heading font-extrabold text-sm text-accent-primary">
              {pickLabels[bet.pick]}
            </span>
            <span className="text-xs text-text-secondary font-medium uppercase">
              {bet.pick === "HOME"
                ? tPick("homeWin")
                : bet.pick === "DRAW"
                  ? tPick("draw")
                  : tPick("awayWin")}
            </span>
          </div>

          <div className="flex gap-lg max-md:gap-md flex-1">
            <div className="flex flex-col gap-[2px]">
              <span className="text-[10px] text-text-muted uppercase tracking-[0.5px] font-medium">
                {t("odds")}
              </span>
              <span className="text-sm font-bold text-text-primary">{bet.odd.toFixed(2)}</span>
            </div>
            <div className="flex flex-col gap-[2px]">
              <span className="text-[10px] text-text-muted uppercase tracking-[0.5px] font-medium">
                {t("stake")}
              </span>
              <span className="text-sm font-bold text-text-primary">${bet.stake}</span>
            </div>
            <div className="flex flex-col gap-[2px]">
              <span className="text-[10px] text-text-muted uppercase tracking-[0.5px] font-medium">
                {t("return")}
              </span>
              <span
                className={`text-sm font-bold text-text-primary ${
                  bet.status === "WON"
                    ? "text-status-won"
                    : bet.status === "LOST"
                      ? "text-status-lost"
                      : ""
                }`}
              >
                {bet.return !== null ? `$${bet.return.toFixed(2)}` : "—"}
              </span>
            </div>
          </div>

          <div className="text-xs text-text-muted ml-auto max-md:w-full max-md:ml-0 max-md:pt-sm max-md:border-t max-md:border-border-subtle">
            {placedDate}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
