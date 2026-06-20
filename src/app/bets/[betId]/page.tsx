import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { getBetById } from "@/lib/data/bets-store";
import Link from "next/link";
import StatusBadge from "@/components/StatusBadge";
import type { BetPick } from "@/lib/types";
import styles from "./page.module.css";

const pickLabels: Record<BetPick, { short: string; full: string }> = {
  HOME: { short: "1", full: "Home Win" },
  DRAW: { short: "X", full: "Draw" },
  AWAY: { short: "2", full: "Away Win" },
};

export default async function BetDetailPage({
  params,
}: {
  params: Promise<{ betId: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");

  const { betId } = await params;
  const bet = getBetById(session.user.id, betId);
  if (!bet) notFound();

  const placedDate = new Date(bet.placedAt).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const matchTime = bet.match
    ? new Date(bet.match.startTime).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    : "";

  const potentialReturn = (bet.stake * bet.odd).toFixed(2);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <Link href="/profile" className={styles.backLink}>
          ← Back to My Bets
        </Link>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h1 className={styles.title}>Bet Detail</h1>
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
              <span className={styles.detailLabel}>Your Pick</span>
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
              <span className={styles.detailLabel}>Odds</span>
              <span className={styles.detailValueLarge}>
                {bet.odd.toFixed(2)}
              </span>
            </div>

            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Stake</span>
              <span className={styles.detailValueLarge}>${bet.stake}</span>
            </div>

            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Potential Return</span>
              <span className={styles.detailValueLarge}>
                ${potentialReturn}
              </span>
            </div>

            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Actual Return</span>
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
              <span className={styles.detailLabel}>Placed At</span>
              <span className={styles.detailValueSmall}>{placedDate}</span>
            </div>
          </div>

          <div className={styles.betId}>
            <span className={styles.betIdLabel}>Bet ID</span>
            <code className={styles.betIdValue}>{bet.id}</code>
          </div>
        </div>
      </div>
    </div>
  );
}
