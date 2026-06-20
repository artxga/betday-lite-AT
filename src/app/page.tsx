import Timeline from "@/components/Timeline";
import type { HourGroup } from "@/lib/types";
import styles from "./page.module.css";

async function getEvents(): Promise<HourGroup[]> {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/events`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch events");
  return res.json();
}

export default async function HomePage() {
  let hourGroups: HourGroup[];

  try {
    hourGroups = await getEvents();
  } catch {
    // Fallback: import directly if fetch fails during build
    const { getMatchesGroupedByHour } = await import("@/lib/data/matches");
    hourGroups = getMatchesGroupedByHour();
  }

  const totalMatches = hourGroups.reduce(
    (sum, group) => sum + group.matches.length,
    0
  );

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>
              Today&apos;s <span className={styles.titleAccent}>Matches</span>
            </h1>
            <p className={styles.subtitle}>
              {totalMatches} events available for betting today
            </p>
          </div>
          <div className={styles.dateBadge}>
            <span className={styles.dateIcon}>📅</span>
            <span>
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </header>

        <Timeline hourGroups={hourGroups} />
      </div>
    </div>
  );
}
