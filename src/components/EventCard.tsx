"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import type { Match, BetPick } from "@/lib/types";
import BetButton from "./BetButton";
import BetForm from "./BetForm";
import styles from "./EventCard.module.css";

interface EventCardProps {
  match: Match;
  userPick?: string;
}

export default function EventCard({ match, userPick }: EventCardProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const tCard = useTranslations("Components.eventCard");
  const tComp = useTranslations("Components");
  
  const [placedPick, setPlacedPick] = useState<BetPick | null>((userPick as BetPick) || null);
  const [activePickModal, setActivePickModal] = useState<BetPick | null>(null);

  const time = new Date(match.startTime).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const handlePickSelection = (pick: BetPick) => {
    if (!session) {
      toast.error(tCard("signIn"), {
        description: tCard("signInDesc"),
        action: {
          label: tCard("signInBtn"),
          onClick: () => (window.location.href = "/auth/signin"),
        },
      });
      return;
    }
    
    if (placedPick) return;
    
    // Open the modal instead of redirecting
    setActivePickModal(pick);
  };

  const handleSuccess = (pick: BetPick) => {
    setPlacedPick(pick);
    router.refresh(); // invalidate cache so the new bet appears in profile
  };

  return (
    <>
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
            isDisabled={!!placedPick}
            onClick={() => handlePickSelection("HOME")}
          />
          <BetButton
            label="X"
            subLabel={tComp("draw")}
            odd={match.market.odds.draw}
            isSelected={placedPick === "DRAW"}
            isDisabled={!!placedPick}
            onClick={() => handlePickSelection("DRAW")}
          />
          <BetButton
            label="2"
            subLabel={match.awayTeam.shortName}
            odd={match.market.odds.away}
            isSelected={placedPick === "AWAY"}
            isDisabled={!!placedPick}
            onClick={() => handlePickSelection("AWAY")}
          />
        </div>

        {placedPick && (
          <div className={styles.betPlacedBanner}>
            {tCard("betPlacedBanner")}
          </div>
        )}
      </div>

      {activePickModal && (
        <BetForm
          match={match}
          initialPick={activePickModal}
          onClose={() => setActivePickModal(null)}
          onSuccess={handleSuccess}
        />
      )}
    </>
  );
}
