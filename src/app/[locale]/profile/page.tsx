import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getAllBetsForUser } from "@/lib/data/bets-store";
import BetCard from "@/components/BetCard";
import EmptyState from "@/components/EmptyState";
import { getTranslations } from "next-intl/server";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "My Bets — BetDay Lite",
  description: "View your betting history and track your results.",
};

export default async function ProfilePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Profile" });
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const bets = getAllBetsForUser(session.user.id);

  const sortedBets = [...bets].sort(
    (a, b) => new Date(b.placedAt).getTime() - new Date(a.placedAt).getTime(),
  );

  const stats = {
    total: bets.length,
    won: bets.filter((b) => b.status === "WON").length,
    lost: bets.filter((b) => b.status === "LOST").length,
    pending: bets.filter((b) => b.status === "PENDING").length,
    totalStake: bets.reduce((sum, b) => sum + b.stake, 0),
    totalReturn: bets.filter((b) => b.return !== null).reduce((sum, b) => sum + (b.return || 0), 0),
  };

  return (
    <div className="pt-lg pb-3xl">
      <div className="max-w-[900px] mx-auto px-md">
        <header className="mb-xl pb-lg border-b border-border-subtle">
          <div>
            <h1 className="font-heading text-4xl max-md:text-3xl font-extrabold tracking-[-1px] leading-[1.1] mb-xs">
              {t("title").split(" ")[0]}{" "}
              <span className="bg-gradient-to-br from-accent-blue to-accent-purple bg-clip-text text-transparent">
                {t("title").split(" ").slice(1).join(" ")}
              </span>
            </h1>
            <p className="text-sm text-text-secondary">
              {session.user.name
                ? t("subtitleWithUser", { name: session.user.name })
                : t("subtitleDefault")}
            </p>
          </div>
        </header>

        {bets.length > 0 && (
          <div className="grid grid-cols-6 max-md:grid-cols-3 max-[480px]:grid-cols-2 gap-sm mb-2xl">
            <div className="bg-bg-surface border border-border-subtle rounded-md p-md flex flex-col items-center gap-[4px] text-center">
              <span className="font-heading text-2xl max-md:text-xl font-extrabold text-text-primary">
                {stats.total}
              </span>
              <span className="text-[10px] text-text-muted uppercase tracking-[0.5px] font-semibold">
                {t("stats.totalBets")}
              </span>
            </div>
            <div className="bg-bg-surface border border-border-subtle rounded-md p-md flex flex-col items-center gap-[4px] text-center">
              <span className="font-heading text-2xl max-md:text-xl font-extrabold text-status-won">
                {stats.won}
              </span>
              <span className="text-[10px] text-text-muted uppercase tracking-[0.5px] font-semibold">
                {t("stats.won")}
              </span>
            </div>
            <div className="bg-bg-surface border border-border-subtle rounded-md p-md flex flex-col items-center gap-[4px] text-center">
              <span className="font-heading text-2xl max-md:text-xl font-extrabold text-status-lost">
                {stats.lost}
              </span>
              <span className="text-[10px] text-text-muted uppercase tracking-[0.5px] font-semibold">
                {t("stats.lost")}
              </span>
            </div>
            <div className="bg-bg-surface border border-border-subtle rounded-md p-md flex flex-col items-center gap-[4px] text-center">
              <span className="font-heading text-2xl max-md:text-xl font-extrabold text-status-pending">
                {stats.pending}
              </span>
              <span className="text-[10px] text-text-muted uppercase tracking-[0.5px] font-semibold">
                {t("stats.pending")}
              </span>
            </div>
            <div className="bg-bg-surface border border-border-subtle rounded-md p-md flex flex-col items-center gap-[4px] text-center">
              <span className="font-heading text-2xl max-md:text-xl font-extrabold text-text-primary">
                ${stats.totalStake.toFixed(0)}
              </span>
              <span className="text-[10px] text-text-muted uppercase tracking-[0.5px] font-semibold">
                {t("stats.totalStaked")}
              </span>
            </div>
            <div className="bg-bg-surface border border-border-subtle rounded-md p-md flex flex-col items-center gap-[4px] text-center">
              <span
                className={`font-heading text-2xl max-md:text-xl font-extrabold text-text-primary ${
                  stats.totalReturn > stats.totalStake ? "!text-status-won" : "!text-status-lost"
                }`}
              >
                ${stats.totalReturn.toFixed(0)}
              </span>
              <span className="text-[10px] text-text-muted uppercase tracking-[0.5px] font-semibold">
                {t("stats.totalReturn")}
              </span>
            </div>
          </div>
        )}

        {sortedBets.length > 0 ? (
          <div className="flex flex-col gap-md">
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
