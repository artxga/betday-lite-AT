import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { getBetById } from "@/lib/data/bets-store";
import { Link } from "@/i18n/routing";
import StatusBadge from "@/components/ui/StatusBadge";
import type { BetPick } from "@/lib/types";
import { getTranslations } from "next-intl/server";

export default async function BetDetailPage({
  params,
}: {
  params: Promise<{ betId: string; locale: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");

  const { betId, locale } = await params;
  const t = await getTranslations({ locale, namespace: "BetDetail" });
  const bet = await getBetById(session.user.id, betId);
  if (!bet) notFound();

  const pickLabels: Record<BetPick, { short: string; full: string }> = {
    HOME: { short: "1", full: t("homeWin") },
    DRAW: { short: "X", full: t("draw") },
    AWAY: { short: "2", full: t("awayWin") },
  };

  const placedDate = new Date(bet.placedAt).toLocaleDateString(
    locale === "es" ? "es-ES" : "en-US",
    {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    },
  );

  const matchTime = bet.match
    ? new Date(bet.match.startTime).toLocaleTimeString(locale === "es" ? "es-ES" : "en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: locale !== "es",
      })
    : "";

  const potentialReturn = (bet.stake * bet.odd).toFixed(2);

  return (
    <div className="pt-lg pb-3xl">
      <div className="max-w-[700px] mx-auto px-md">
        <Link
          href="/profile"
          className="inline-flex items-center gap-sm text-sm text-text-secondary mb-xl py-sm transition-colors duration-150 hover:text-accent-primary"
        >
          {t("back")}
        </Link>

        <div className="liquid-glass rounded-xl p-xl max-md:p-lg relative overflow-hidden before:absolute before:inset-x-0 before:top-0 before:h-[2px] before:bg-gradient-to-r before:from-accent-primary before:via-accent-blue before:to-accent-purple">
          <div className="flex justify-between items-center mb-xl">
            <h1 className="font-heading text-2xl font-extrabold">{t("title")}</h1>
            <StatusBadge status={bet.status} />
          </div>

          {bet.match && (
            <div className="bg-bg-surface border border-border-subtle rounded-lg p-lg mb-xl">
              <div className="flex justify-between items-center mb-lg">
                <span className="flex items-center gap-[6px] text-xs font-semibold text-accent-purple uppercase tracking-[0.5px]">
                  <span className="w-[6px] h-[6px] rounded-full bg-accent-purple" />
                  {bet.match.league.name}
                </span>
                <span className="text-sm text-text-muted">{matchTime}</span>
              </div>

              <div className="flex items-center justify-between gap-lg mb-lg">
                <div className="flex-1 flex flex-col gap-1">
                  <span className="font-heading text-3xl max-md:text-2xl font-extrabold tracking-[-1px]">
                    {bet.match.homeTeam.shortName}
                  </span>
                  <span className="text-sm text-text-muted">{bet.match.homeTeam.name}</span>
                </div>
                <span className="font-heading text-base font-extrabold text-text-muted px-[14px] py-[6px] bg-white/5 rounded-full">
                  VS
                </span>
                <div className="flex-1 flex flex-col gap-1 text-right items-end">
                  <span className="font-heading text-3xl max-md:text-2xl font-extrabold tracking-[-1px]">
                    {bet.match.awayTeam.shortName}
                  </span>
                  <span className="text-sm text-text-muted">{bet.match.awayTeam.name}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-sm">
                <div
                  className={`flex flex-col items-center gap-[2px] p-sm rounded-md border ${bet.pick === "HOME" ? "bg-accent-primary-dim border-accent-primary" : "bg-white/5 border-border-subtle"}`}
                >
                  <span
                    className={`font-heading font-extrabold text-base ${bet.pick === "HOME" ? "text-accent-primary" : "text-text-secondary"}`}
                  >
                    1
                  </span>
                  <span className="text-sm font-bold text-accent-primary">
                    {bet.match.market.odds.home.toFixed(2)}
                  </span>
                </div>
                <div
                  className={`flex flex-col items-center gap-[2px] p-sm rounded-md border ${bet.pick === "DRAW" ? "bg-accent-primary-dim border-accent-primary" : "bg-white/5 border-border-subtle"}`}
                >
                  <span
                    className={`font-heading font-extrabold text-base ${bet.pick === "DRAW" ? "text-accent-primary" : "text-text-secondary"}`}
                  >
                    X
                  </span>
                  <span className="text-sm font-bold text-accent-primary">
                    {bet.match.market.odds.draw.toFixed(2)}
                  </span>
                </div>
                <div
                  className={`flex flex-col items-center gap-[2px] p-sm rounded-md border ${bet.pick === "AWAY" ? "bg-accent-primary-dim border-accent-primary" : "bg-white/5 border-border-subtle"}`}
                >
                  <span
                    className={`font-heading font-extrabold text-base ${bet.pick === "AWAY" ? "text-accent-primary" : "text-text-secondary"}`}
                  >
                    2
                  </span>
                  <span className="text-sm font-bold text-accent-primary">
                    {bet.match.market.odds.away.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-3 max-md:grid-cols-2 gap-md mb-xl">
            <div className="flex flex-col gap-[6px]">
              <span className="text-[10px] text-text-muted uppercase tracking-[0.5px] font-semibold">
                {t("yourPick")}
              </span>
              <div className="flex items-center gap-sm">
                <span className="w-9 h-9 rounded-md bg-accent-primary-dim border border-border-accent flex items-center justify-center font-heading font-extrabold text-lg text-accent-primary">
                  {pickLabels[bet.pick].short}
                </span>
                <span className="text-sm text-text-secondary font-medium">
                  {pickLabels[bet.pick].full}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-[6px]">
              <span className="text-[10px] text-text-muted uppercase tracking-[0.5px] font-semibold">
                {t("odds")}
              </span>
              <span className="font-heading text-xl font-extrabold">{bet.odd.toFixed(2)}</span>
            </div>

            <div className="flex flex-col gap-[6px]">
              <span className="text-[10px] text-text-muted uppercase tracking-[0.5px] font-semibold">
                {t("stake")}
              </span>
              <span className="font-heading text-xl font-extrabold">${bet.stake}</span>
            </div>

            <div className="flex flex-col gap-[6px]">
              <span className="text-[10px] text-text-muted uppercase tracking-[0.5px] font-semibold">
                {t("potentialReturn")}
              </span>
              <span className="font-heading text-xl font-extrabold">${potentialReturn}</span>
            </div>

            <div className="flex flex-col gap-[6px]">
              <span className="text-[10px] text-text-muted uppercase tracking-[0.5px] font-semibold">
                {t("actualReturn")}
              </span>
              <span
                className={`font-heading text-xl font-extrabold ${
                  bet.status === "WON"
                    ? "!text-status-won"
                    : bet.status === "LOST"
                      ? "!text-status-lost"
                      : ""
                }`}
              >
                {bet.return !== null ? `$${bet.return.toFixed(2)}` : "—"}
              </span>
            </div>

            <div className="flex flex-col gap-[6px]">
              <span className="text-[10px] text-text-muted uppercase tracking-[0.5px] font-semibold">
                {t("placedAt")}
              </span>
              <span className="text-sm text-text-secondary">{placedDate}</span>
            </div>
          </div>

          <div className="flex items-center gap-sm pt-md border-t border-border-subtle">
            <span className="text-xs text-text-muted">{t("betId")}</span>
            <code className="text-xs text-text-secondary bg-bg-surface px-2 py-[2px] rounded-sm font-mono">
              {bet.id}
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}
