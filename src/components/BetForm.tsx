"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import type { Match, BetPick } from "@/lib/types";
import BetButton from "./BetButton";

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
    <div className="fixed inset-0 z-[9999] bg-[rgba(10,10,15,0.7)] backdrop-blur-[12px] flex items-center justify-center p-md animate-fade-in" onClick={(e) => { if(e.target === e.currentTarget) onClose(); }}>
      <div className="absolute -top-[100px] -left-[100px] w-[300px] h-[300px] rounded-full blur-[100px] -z-10 opacity-30 bg-accent-purple pointer-events-none" />
      <div className="absolute -bottom-[100px] -right-[100px] w-[300px] h-[300px] rounded-full blur-[100px] -z-10 opacity-30 bg-accent-blue pointer-events-none" />
      
      <div className="bg-bg-glass backdrop-blur-[16px] border border-border-subtle rounded-lg p-2xl w-full max-w-[450px] shadow-lg animate-slide-up relative z-10">
        <h1 className="font-heading text-3xl font-extrabold tracking-[-1px] mb-xl text-center bg-gradient-to-br from-white to-white/70 bg-clip-text text-transparent">{t("title")}</h1>
        
        <div className="flex flex-col gap-xs mb-xl text-center pb-md border-b border-border-subtle">
          <span className="text-xs text-text-muted uppercase tracking-[0.5px] font-semibold">{t("match")}:</span>
          <span className="text-lg text-text-primary font-bold">
            {match.homeTeam.name} vs {match.awayTeam.name}
          </span>
        </div>
        
        <div className="flex flex-col gap-sm mb-xl">
          <span className="text-xs text-text-muted uppercase tracking-[0.5px] font-semibold">{t("pick")}</span>
          <div className="grid grid-cols-3 gap-sm">
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

        <div className="flex flex-col gap-xs mb-lg">
          <label className="text-xs text-text-muted uppercase tracking-[0.5px] font-semibold">{t("stake")}</label>
          <div className="relative flex items-center">
            <span className="absolute left-4 text-text-muted text-xl font-semibold">$</span>
            <input 
              type="number"
              value={stake}
              onChange={(e) => setStake(e.target.value)}
              className={`w-full bg-bg-surface border-2 rounded-md py-4 pr-4 pl-9 text-2xl font-extrabold text-text-primary outline-none transition-all duration-150 ${errorMessage ? "border-[#ff4757] focus:shadow-[0_0_0_4px_rgba(255,71,87,0.1)]" : "border-border-subtle focus:border-accent-purple focus:shadow-[0_0_0_4px_rgba(139,92,246,0.1)]"}`}
              disabled={isPlacing}
              autoFocus
            />
          </div>
          {errorMessage && <span className="text-[#ff4757] text-xs font-medium mt-1">{errorMessage}</span>}
        </div>

        <div className="flex justify-between items-center p-md bg-[#00ff87]/10 border border-[#00ff87]/20 rounded-md mb-2xl">
          <span className="text-xs text-text-muted uppercase tracking-[0.5px] font-semibold">{t("potentialReturn")}</span>
          <span className="text-2xl font-extrabold text-[#00ff87] tracking-[-0.5px]">${potentialReturn}</span>
        </div>

        <div className="flex gap-md">
          <button 
            className="flex-1 p-[14px] bg-transparent border border-border-subtle text-text-secondary rounded-md font-semibold text-base cursor-pointer transition-all duration-150 hover:bg-bg-surface hover:text-text-primary" 
            onClick={onClose}
            disabled={isPlacing}
          >
            {t("cancel")}
          </button>
          <button 
            className="flex-[2] p-[14px] bg-gradient-to-br from-accent-purple to-accent-blue border-none text-white rounded-md font-bold text-base cursor-pointer transition-opacity duration-150 flex justify-center items-center hover:opacity-90 hover:-translate-y-[1px] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none" 
            onClick={handleConfirm}
            disabled={isPlacing || !isValidStake}
          >
            {isPlacing ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : t("confirmBet")}
          </button>
        </div>
      </div>
    </div>
  );

  if (!mounted) return null;

  return createPortal(modalContent, document.body);
}
