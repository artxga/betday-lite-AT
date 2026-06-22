"use client";

import { motion } from "framer-motion";
import type { HourGroup } from "@/lib/types";
import { useTranslations } from "next-intl";
import EventCard from "./EventCard";

interface TimelineProps {
  hourGroups: HourGroup[];
  userPicks?: Record<string, string>;
}

export default function Timeline({ hourGroups, userPicks = {} }: TimelineProps) {
  const t = useTranslations("Components");
  return (
    <div className="relative py-lg">
      <div className="absolute left-[20px] max-md:left-[14px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-accent-primary-dim to-transparent" />

      {hourGroups.map((group, groupIndex) => (
        <motion.div
          key={group.hour}
          className="relative mb-2xl"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: groupIndex * 0.08, duration: 0.4 }}
        >
          <div className="flex items-center gap-md mb-lg pl-[8px] max-md:pl-[2px]">
            <div className="w-[26px] h-[26px] max-md:w-[22px] max-md:h-[22px] rounded-full bg-bg-primary border-[3px] border-accent-primary shadow-[0_0_12px_rgba(0,255,135,0.3)] relative z-[2] shrink-0 after:absolute after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:w-2 after:h-2 max-md:after:w-[6px] max-md:after:h-[6px] after:rounded-full after:bg-accent-primary" />
            <span className="font-heading text-xl max-md:text-lg font-bold text-text-primary">{group.hourLabel}</span>
            <span className="text-sm text-text-muted px-[10px] py-[2px] bg-bg-surface rounded-full">
              {group.matches.length} {group.matches.length === 1 ? t("match") : t("matches")}
            </span>
          </div>

          <div className="pl-[54px] max-md:pl-[44px] grid grid-cols-[repeat(auto-fill,minmax(340px,1fr))] max-md:grid-cols-1 gap-md">
            {group.matches.map((match, matchIndex) => (
              <motion.div
                key={match.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: groupIndex * 0.08 + matchIndex * 0.05,
                  duration: 0.35,
                }}
              >
                <EventCard match={match} userPick={userPicks[match.id]} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
