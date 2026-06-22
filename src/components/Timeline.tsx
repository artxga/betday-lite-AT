"use client";

import { motion } from "framer-motion";
import type { HourGroup } from "@/lib/types";
import { useTranslations } from "next-intl";
import EventCard from "./EventCard";
import styles from "./Timeline.module.css";

interface TimelineProps {
  hourGroups: HourGroup[];
}

export default function Timeline({ hourGroups }: TimelineProps) {
  const t = useTranslations("Components");
  return (
    <div className={styles.timeline}>
      <div className={styles.line} />

      {hourGroups.map((group, groupIndex) => (
        <motion.div
          key={group.hour}
          className={styles.hourBlock}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: groupIndex * 0.08, duration: 0.4 }}
        >
          <div className={styles.hourMarker}>
            <div className={styles.dot} />
            <span className={styles.hourLabel}>{group.hourLabel}</span>
            <span className={styles.matchCount}>
              {group.matches.length} {group.matches.length === 1 ? t("match") : t("matches")}
            </span>
          </div>

          <div className={styles.matchesGrid}>
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
                <EventCard match={match} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
