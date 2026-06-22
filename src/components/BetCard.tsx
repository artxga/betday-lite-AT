"use client";

import { motion } from "framer-motion";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import type { BetWithMatch, BetPick } from "@/lib/types";
import StatusBadge from "./StatusBadge";
import styles from "./BetCard.module.css";

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
  const matchTime = bet.match
    ? new Date(bet.match.startTime).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    : "";

  const placedDate = new Date(bet.placedAt).toLocaleDateString("en-US", {
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
      <Link href={`/bets/${bet.id}`} className={styles.card}>
        <div className={styles.header}>
          <div className={styles.matchInfo}>
            {bet.match && (
              <>
                <span className={styles.league}>
                  <span className={styles.leagueDot} />
                  {bet.match.league.name}
                </span>
                <span className={styles.matchTime}>{matchTime}</span>
              </>
            )}
          </div>
          <StatusBadge status={bet.status} />
        </div>

        <div className={styles.teams}>
          {bet.match ? (
            <>
              <span className={styles.teamName}>{bet.match.homeTeam.name}</span>
              <span className={styles.vsText}>{t("vs")}</span>
              <span className={styles.teamName}>{bet.match.awayTeam.name}</span>
            </>
          ) : (
            <span className={styles.teamName}>{t("match", { id: bet.matchId })}</span>
          )}
        </div>

        <div className={styles.footer}>
          <div className={styles.pickInfo}>
            <span className={styles.pickBadge}>{pickLabels[bet.pick]}</span>
            <span className={styles.pickLabel}>{bet.pick}</span>
          </div>

          <div className={styles.betDetails}>
            <div className={styles.detail}>
              <span className={styles.detailLabel}>{t("odds")}</span>
              <span className={styles.detailValue}>{bet.odd.toFixed(2)}</span>
            </div>
            <div className={styles.detail}>
              <span className={styles.detailLabel}>{t("stake")}</span>
              <span className={styles.detailValue}>${bet.stake}</span>
            </div>
            <div className={styles.detail}>
              <span className={styles.detailLabel}>{t("return")}</span>
              <span
                className={`${styles.detailValue} ${
                  bet.status === "WON"
                    ? styles.returnWon
                    : bet.status === "LOST"
                      ? styles.returnLost
                      : ""
                }`}
              >
                {bet.return !== null ? `$${bet.return.toFixed(2)}` : "—"}
              </span>
            </div>
          </div>

          <div className={styles.placedAt}>{placedDate}</div>
        </div>
      </Link>
    </motion.div>
  );
}
