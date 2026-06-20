"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import type { Match, BetPick } from "@/lib/types";
import BetButton from "./BetButton";
import styles from "./EventCard.module.css";

interface EventCardProps {
  match: Match;
}

export default function EventCard({ match }: EventCardProps) {
  const { data: session } = useSession();
  const [placedPick, setPlacedPick] = useState<BetPick | null>(null);
  const [isPlacing, setIsPlacing] = useState(false);

  const time = new Date(match.startTime).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const handleBet = async (pick: BetPick) => {
    if (!session) {
      toast.error("Sign in to place bets", {
        description: "You need to be logged in to place bets.",
        action: {
          label: "Sign In",
          onClick: () => (window.location.href = "/auth/signin"),
        },
      });
      return;
    }

    if (placedPick || isPlacing) return;

    setIsPlacing(true);

    try {
      const res = await fetch("/api/bets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          matchId: match.id,
          pick,
          stake: 10,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to place bet");
      }

      setPlacedPick(pick);

      const pickLabel =
        pick === "HOME"
          ? match.homeTeam.shortName
          : pick === "AWAY"
            ? match.awayTeam.shortName
            : "Draw";

      toast.success("Bet placed! 🎉", {
        description: `$10 on ${pickLabel} @ ${match.market.odds[pick === "HOME" ? "home" : pick === "AWAY" ? "away" : "draw"]}`,
      });
    } catch {
      toast.error("Failed to place bet", {
        description: "Please try again.",
      });
    } finally {
      setIsPlacing(false);
    }
  };

  return (
    <div className={`${styles.card} ${placedPick ? styles.cardBetPlaced : ""}`}>
      <div className={styles.header}>
        <span className={styles.league}>
          <span className={styles.leagueDot} />
          {match.league.name}
        </span>
        <span className={styles.time}>{time}</span>
      </div>

      <div className={styles.teams}>
        <div className={styles.team}>
          <span className={styles.teamShort}>{match.homeTeam.shortName}</span>
          <span className={styles.teamName}>{match.homeTeam.name}</span>
        </div>
        <span className={styles.vs}>VS</span>
        <div className={`${styles.team} ${styles.teamRight}`}>
          <span className={styles.teamShort}>{match.awayTeam.shortName}</span>
          <span className={styles.teamName}>{match.awayTeam.name}</span>
        </div>
      </div>

      <div className={styles.odds}>
        <BetButton
          label="1"
          subLabel={match.homeTeam.shortName}
          odd={match.market.odds.home}
          isSelected={placedPick === "HOME"}
          isDisabled={!!placedPick || isPlacing}
          onClick={() => handleBet("HOME")}
        />
        <BetButton
          label="X"
          subLabel="Draw"
          odd={match.market.odds.draw}
          isSelected={placedPick === "DRAW"}
          isDisabled={!!placedPick || isPlacing}
          onClick={() => handleBet("DRAW")}
        />
        <BetButton
          label="2"
          subLabel={match.awayTeam.shortName}
          odd={match.market.odds.away}
          isSelected={placedPick === "AWAY"}
          isDisabled={!!placedPick || isPlacing}
          onClick={() => handleBet("AWAY")}
        />
      </div>

      {placedPick && (
        <div className={styles.betPlacedBanner}>
          ✅ Bet placed
        </div>
      )}
    </div>
  );
}
