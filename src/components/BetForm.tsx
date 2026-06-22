"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import type { Match, BetPick } from "@/lib/types";
import BetButton from "./BetButton";
import styles from "./BetForm.module.css";

interface BetFormProps {
  match: Match;
  initialPick: BetPick;
  onClose: () => void;
  onSuccess: (pick: BetPick) => void;
}

export default function BetForm({ match, initialPick, onClose, onSuccess }: BetFormProps) {
  const t = useTranslations("Components.betDetail");
  const tComp = useTranslations("Components");
  
  const [currentPick, setCurrentPick] = useState<BetPick>(initialPick);
  const [stake, setStake] = useState<string>("10");
  const [isPlacing, setIsPlacing] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Prevent background scrolling when modal is open
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const MIN_BET = 1;
  const MAX_BET = 10000;

  const selectedOdd = match.market.odds[currentPick === "HOME" ? "home" : currentPick === "AWAY" ? "away" : "draw"];
  
  const getPickLabel = (pick: BetPick) => {
    if (pick === "HOME") return match.homeTeam.shortName;
    if (pick === "AWAY") return match.awayTeam.shortName;
    return tComp("draw");
  };

  const stakeAmount = Number(stake);
  const isValidStake = !isNaN(stakeAmount) && stakeAmount >= MIN_BET && stakeAmount <= MAX_BET;
  const potentialReturn = isValidStake ? (stakeAmount * selectedOdd).toFixed(2) : "0.00";

  let errorMessage = "";
  if (stake && !isNaN(stakeAmount)) {
    if (stakeAmount < MIN_BET) errorMessage = t("minBet");
    if (stakeAmount > MAX_BET) errorMessage = t("maxBet");
  }

  const handleConfirm = async () => {
    if (!isValidStake) return;
    setIsPlacing(true);

    try {
      const res = await fetch("/api/bets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          matchId: match.id,
          pick: currentPick,
          stake: stakeAmount,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to place bet");
      }

      toast.success(tComp("eventCard.success"), {
        description: `$${stakeAmount} on ${getPickLabel(currentPick)} @ ${selectedOdd}`,
      });
      
      onSuccess(currentPick);
      onClose();
    } catch {
      toast.error(tComp("eventCard.failed"), {
        description: tComp("eventCard.failedDesc"),
      });
      setIsPlacing(false);
    }
  };

  const modalContent = (
    <div className={styles.modalOverlay} onClick={(e) => { if(e.target === e.currentTarget) onClose(); }}>
      <div className={styles.card}>
        <h1 className={styles.title}>{t("title")}</h1>
        
        <div className={styles.matchInfo}>
          <span className={styles.label}>{t("match")}:</span>
          <span className={styles.value}>
            {match.homeTeam.name} vs {match.awayTeam.name}
          </span>
        </div>
        
        <div className={styles.oddsSelection}>
          <span className={styles.label}>{t("pick")}</span>
          <div className={styles.oddsGrid}>
            <BetButton
              label="1"
              subLabel={match.homeTeam.shortName}
              odd={match.market.odds.home}
              isSelected={currentPick === "HOME"}
              isDisabled={isPlacing}
              onClick={() => setCurrentPick("HOME")}
            />
            <BetButton
              label="X"
              subLabel={tComp("draw")}
              odd={match.market.odds.draw}
              isSelected={currentPick === "DRAW"}
              isDisabled={isPlacing}
              onClick={() => setCurrentPick("DRAW")}
            />
            <BetButton
              label="2"
              subLabel={match.awayTeam.shortName}
              odd={match.market.odds.away}
              isSelected={currentPick === "AWAY"}
              isDisabled={isPlacing}
              onClick={() => setCurrentPick("AWAY")}
            />
          </div>
        </div>

        <div className={styles.stakeSection}>
          <label className={styles.label}>{t("stake")}</label>
          <div className={`${styles.inputWrapper} ${errorMessage ? styles.inputError : ""}`}>
            <span className={styles.currency}>$</span>
            <input 
              type="number"
              value={stake}
              onChange={(e) => setStake(e.target.value)}
              className={styles.input}
              disabled={isPlacing}
              autoFocus
            />
          </div>
          {errorMessage && <span className={styles.errorText}>{errorMessage}</span>}
        </div>

        <div className={styles.returnSection}>
          <span className={styles.label}>{t("potentialReturn")}</span>
          <span className={styles.returnValue}>${potentialReturn}</span>
        </div>

        <div className={styles.actions}>
          <button 
            className={styles.cancelBtn} 
            onClick={onClose}
            disabled={isPlacing}
          >
            {t("cancel")}
          </button>
          <button 
            className={styles.confirmBtn} 
            onClick={handleConfirm}
            disabled={isPlacing || !isValidStake}
          >
            {isPlacing ? <span className={styles.spinner} /> : t("confirmBet")}
          </button>
        </div>
      </div>
    </div>
  );

  if (!mounted) return null;

  return createPortal(modalContent, document.body);
}
