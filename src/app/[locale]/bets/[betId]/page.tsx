import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { getBetById } from "@/lib/data/bets-store";
import { Link } from "@/i18n/routing";
import StatusBadge from "@/components/StatusBadge";
import type { BetPick } from "@/lib/types";
import { getTranslations } from "next-intl/server";
import styles from "./page.module.css";

export default async function BetDetailPage({
  params,
}: {
  params: Promise<{ betId: string; locale: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");

  const { betId, locale } = await params;
  const t = await getTranslations({ locale, namespace: "BetDetail" });
  const bet = getBetById(session.user.id, betId);
  if (!bet) notFound();

  const pickLabels: Record<BetPick, { short: string; full: string }> = {
    HOME: { short: "1", full: t("homeWin") },
    DRAW: { short: "X", full: t("draw") },
    AWAY: { short: "2", full: t("awayWin") },
  };

  const placedDate = new Date(bet.placedAt).toLocaleDateString(locale === "es" ? "es-ES" : "en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const matchTime = bet.match
    ? new Date(bet.match.startTime).toLocaleTimeString(locale === "es" ? "es-ES" : "en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: locale !== "es",
      })
    : "";

  const potentialReturn = (bet.stake * bet.odd).toFixed(2);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <Link href="/profile" className={styles.backLink}>
          {t("back")}
        </Link>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h1 className={styles.title}>{t("title")}</h1>
            <StatusBadge status={bet.status} />
          </div>

          {bet.match && (
            <div className={styles.matchSection}>
              <div className={styles.leagueRow}>
                <span className={styles.leagueBadge}>
                  <span className={styles.leagueDot} />
                  {bet.match.league.name}
                </span>
                <span className={styles.matchTime}>{matchTime}</span>
              </div>

              <div className={styles.teamsDisplay}>
                <div className={styles.teamBlock}>
                  <span className={styles.teamShort}>
                    {bet.match.homeTeam.shortName}
                  </span>
                  <span className={styles.teamFull}>
                    {bet.match.homeTeam.name}
                  </span>
                </div>
                <span className={styles.vsBig}>VS</span>
                <div className={`${styles.teamBlock} ${styles.teamRight}`}>
                  <span className={styles.teamShort}>
                    {bet.match.awayTeam.shortName}
                  </span>
                  <span className={styles.teamFull}>
                    {bet.match.awayTeam.name}
                  </span>
                </div>
              </div>

              <div className={styles.oddsRow}>
                <div
                  className={`${styles.oddItem} ${bet.pick === "HOME" ? styles.oddSelected : ""}`}
                >
                  <span className={styles.oddLabel}>1</span>
                  <span className={styles.oddValue}>
                    {bet.match.market.odds.home.toFixed(2)}
                  </span>
                </div>
                <div
                  className={`${styles.oddItem} ${bet.pick === "DRAW" ? styles.oddSelected : ""}`}
                >
                  <span className={styles.oddLabel}>X</span>
                  <span className={styles.oddValue}>
                    {bet.match.market.odds.draw.toFixed(2)}
                  </span>
                </div>
                <div
                  className={`${styles.oddItem} ${bet.pick === "AWAY" ? styles.oddSelected : ""}`}
                >
                  <span className={styles.oddLabel}>2</span>
                  <span className={styles.oddValue}>
                    {bet.match.market.odds.away.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className={styles.detailsGrid}>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>{t("yourPick")}</span>
              <div className={styles.pickDisplay}>
                <span className={styles.pickBadgeLarge}>
                  {pickLabels[bet.pick].short}
                </span>
                <span className={styles.pickText}>
                  {pickLabels[bet.pick].full}
                </span>
              </div>
            </div>

            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>{t("odds")}</span>
              <span className={styles.detailValueLarge}>
                {bet.odd.toFixed(2)}
              </span>
            </div>

            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>{t("stake")}</span>
              <span className={styles.detailValueLarge}>${bet.stake}</span>
            </div>

            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>{t("potentialReturn")}</span>
              <span className={styles.detailValueLarge}>
                ${potentialReturn}
              </span>
            </div>

            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>{t("actualReturn")}</span>
              <span
                className={`${styles.detailValueLarge} ${
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

            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>{t("placedAt")}</span>
              <span className={styles.detailValueSmall}>{placedDate}</span>
            </div>
          </div>

          <div className={styles.betId}>
            <span className={styles.betIdLabel}>{t("betId")}</span>
            <code className={styles.betIdValue}>{bet.id}</code>
          </div>
        </div>
      </div>
    </div>
  );
}
