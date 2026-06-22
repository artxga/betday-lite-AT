import Timeline from "@/components/Timeline";
import type { HourGroup, BetPick } from "@/lib/types";
import { getTranslations } from "next-intl/server";
import { auth } from "@/auth";
import { getUserBets } from "@/lib/data/bets-store";

// Force dynamic so that the latest bets state is fetched immediately
export const dynamic = "force-dynamic";

async function getEvents(): Promise<HourGroup[]> {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/events`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch events");
  return res.json();
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "HomePage" });
  let hourGroups: HourGroup[];

  try {
    hourGroups = await getEvents();
  } catch {
    // Fallback: import directly if fetch fails during build
    const { getMatchesGroupedByHour } = await import("@/lib/data/matches");
    hourGroups = getMatchesGroupedByHour();
  }

  const session = await auth();
  const userBets = session?.user?.id ? getUserBets(session.user.id) : [];
  const userPicks = userBets.reduce((acc, bet) => {
    acc[bet.matchId] = bet.pick;
    return acc;
  }, {} as Record<string, BetPick>);

  const totalMatches = hourGroups.reduce(
    (sum, group) => sum + group.matches.length,
    0
  );

  return (
    <div className="pt-lg pb-3xl">
      <div className="max-w-[1200px] mx-auto px-md">
        <header className="flex justify-between items-end mb-2xl pb-lg border-b border-border-subtle max-md:flex-col max-md:items-start max-md:gap-md">
          <div className="flex flex-col gap-sm">
            <h1 className="font-heading text-4xl max-md:text-3xl font-extrabold tracking-[-1px] leading-[1.1]">
              {t("title").split(" ")[0]} {t("title").split(" ")[1]} <span className="bg-gradient-to-br from-accent-primary to-accent-blue bg-clip-text text-transparent">{t("title").split(" ").slice(2).join(" ")}</span>
            </h1>
            <p className="text-sm text-text-secondary">
              {t("description")}: {totalMatches}
            </p>
          </div>
          <div className="flex items-center gap-sm px-md py-sm bg-bg-surface border border-border-subtle rounded-full text-sm text-text-secondary whitespace-nowrap">
            <span className="text-base">📅</span>
            <span>
              {new Date().toLocaleDateString(locale === "es" ? "es-ES" : "en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </header>

        <Timeline hourGroups={hourGroups} userPicks={userPicks} />
      </div>
    </div>
  );
}
