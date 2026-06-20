import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getAllBetsForUser } from "@/lib/data/bets-store";
import BetCard from "@/components/BetCard";
import EmptyState from "@/components/EmptyState";
import styles from "./page.module.css";

export const metadata = {
  title: "My Bets — BetDay Lite",
  description: "View your betting history and track your results.",
};

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const bets = getAllBetsForUser(session.user.id);

  // Sort bets by placedAt descending (most recent first)
  const sortedBets = [...bets].sort(
    (a, b) => new Date(b.placedAt).getTime() - new Date(a.placedAt).getTime()
  );

  const stats = {
    total: bets.length,
    won: bets.filter((b) => b.status === "WON").length,
    lost: bets.filter((b) => b.status === "LOST").length,
    pending: bets.filter((b) => b.status === "PENDING").length,
    totalStake: bets.reduce((sum, b) => sum + b.stake, 0),
    totalReturn: bets
      .filter((b) => b.return !== null)
      .reduce((sum, b) => sum + (b.return || 0), 0),
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.title}>
              My <span className={styles.titleAccent}>Bets</span>
            </h1>
            <p className={styles.subtitle}>
              {session.user.name
                ? `${session.user.name}'s betting history`
                : "Your betting history"}
            </p>
          </div>
        </header>

        {bets.length > 0 && (
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <span className={styles.statValue}>{stats.total}</span>
              <span className={styles.statLabel}>Total Bets</span>
            </div>
            <div className={`${styles.statCard} ${styles.statWon}`}>
              <span className={styles.statValue}>{stats.won}</span>
              <span className={styles.statLabel}>Won</span>
            </div>
            <div className={`${styles.statCard} ${styles.statLost}`}>
              <span className={styles.statValue}>{stats.lost}</span>
              <span className={styles.statLabel}>Lost</span>
            </div>
            <div className={`${styles.statCard} ${styles.statPending}`}>
              <span className={styles.statValue}>{stats.pending}</span>
              <span className={styles.statLabel}>Pending</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statValue}>
                ${stats.totalStake.toFixed(0)}
              </span>
              <span className={styles.statLabel}>Total Staked</span>
            </div>
            <div className={styles.statCard}>
              <span
                className={`${styles.statValue} ${
                  stats.totalReturn > stats.totalStake
                    ? styles.statValuePositive
                    : styles.statValueNegative
                }`}
              >
                ${stats.totalReturn.toFixed(0)}
              </span>
              <span className={styles.statLabel}>Total Return</span>
            </div>
          </div>
        )}

        {sortedBets.length > 0 ? (
          <div className={styles.betsList}>
            {sortedBets.map((bet, index) => (
              <BetCard key={bet.id} bet={bet} index={index} />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}
