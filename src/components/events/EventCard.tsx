"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import type { Match, BetPick } from "@/lib/types";
import BetButton from "../ui/BetButton";
import BetForm from "../bets/BetForm";

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
    timeZone: "America/Lima",
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
    setActivePickModal(pick);
  };

  const handleSuccess = (pick: BetPick) => {
    setPlacedPick(pick);
    router.refresh();
  };

  return (
    <>
      <div
        className={`liquid-glass ${placedPick ? "border-border-accent pb-[calc(var(--spacing-lg)+28px)] max-md:pb-[calc(var(--spacing-md)+28px)]" : ""} rounded-lg p-lg relative overflow-hidden transition-all duration-250 hover:border-white/10 hover:-translate-y-[2px] hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),inset_0_-1px_1px_rgba(255,255,255,0.05),0_12px_40px_rgba(0,0,0,0.5)] max-md:p-md before:absolute before:inset-x-0 before:top-0 before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-accent-primary/30 before:to-transparent`}
      >
        <div className="flex justify-between items-center mb-md">
          <span className="flex items-center gap-[6px] text-xs font-semibold text-accent-purple uppercase tracking-[0.5px]">
            <span className="w-[6px] h-[6px] rounded-full bg-accent-purple" />
            {match.league.name}
          </span>
          <span className="text-xs text-text-muted font-medium px-2 py-[2px] bg-bg-surface rounded-full">
            {time}
          </span>
        </div>

        <div className="flex items-center justify-between gap-md mb-lg">
          <div className="flex flex-1 flex-col gap-[2px]">
            <span className="font-heading text-2xl font-extrabold tracking-[-0.5px] text-text-primary max-md:text-xl">
              {match.homeTeam.shortName}
            </span>
            <span className="text-xs text-text-muted font-medium">{match.homeTeam.name}</span>
          </div>
          <span className="font-heading text-sm font-extrabold text-text-muted px-[10px] py-1 bg-bg-surface rounded-full shrink-0">
            VS
          </span>
          <div className="flex flex-1 flex-col gap-[2px] text-right items-end">
            <span className="font-heading text-2xl font-extrabold tracking-[-0.5px] text-text-primary max-md:text-xl">
              {match.awayTeam.shortName}
            </span>
            <span className="text-xs text-text-muted font-medium">{match.awayTeam.name}</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-sm">
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
          <div className="absolute bottom-0 left-0 right-0 p-[6px] bg-accent-primary-dim text-accent-primary text-xs font-semibold text-center tracking-[0.5px]">
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
