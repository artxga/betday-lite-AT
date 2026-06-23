import type { Bet, BetPick, BetWithMatch } from "@/lib/types";
import { getMatchById } from "./matches";
import { supabase } from "../supabase";

export async function getUserBets(userId: string): Promise<Bet[]> {
  const { data, error } = await supabase.from("bets").select("*").eq("userId", userId);
  if (error) {
    console.error("Error fetching user bets:", error);
    return [];
  }
  return data as Bet[];
}

export async function getBetById(userId: string, betId: string): Promise<BetWithMatch | undefined> {
  const { data, error } = await supabase.from("bets").select("*").eq("userId", userId).eq("id", betId).single();
  if (error || !data) return undefined;

  const bet = data as Bet;
  const match = await getMatchById(bet.matchId);
  return { ...bet, match };
}

export async function getAllBetsForUser(userId: string): Promise<BetWithMatch[]> {
  const bets = await getUserBets(userId);
  return Promise.all(
    bets.map(async (bet) => ({
      ...bet,
      match: await getMatchById(bet.matchId),
    }))
  );
}

function generateBetId(): string {
  return `bet_${Math.random().toString(36).substr(2, 9)}`;
}

export async function placeBet(userId: string, matchId: string, pick: BetPick, stake: number): Promise<Bet> {
  const match = await getMatchById(matchId);
  if (!match) {
    throw new Error(`Match ${matchId} not found`);
  }

  // Get the odds for the selected pick
  const oddMap: Record<BetPick, number> = {
    HOME: match.market.odds.home,
    DRAW: match.market.odds.draw,
    AWAY: match.market.odds.away,
  };

  const newBet: Bet = {
    id: generateBetId(),
    matchId,
    placedAt: new Date().toISOString(),
    pick,
    odd: oddMap[pick],
    stake,
    status: "PENDING",
    return: null,
  };

  const { error } = await supabase.from("bets").insert({
    id: newBet.id,
    userId,
    matchId: newBet.matchId,
    placedAt: newBet.placedAt,
    pick: newBet.pick,
    odd: newBet.odd,
    stake: newBet.stake,
    status: newBet.status,
    return: newBet.return,
  });

  if (error) {
    console.error("Error inserting bet:", error);
    throw new Error("Failed to place bet");
  }

  // Simulate resolution after a random delay (10-30 seconds)
  // In a real app this would be a webhook or cron job
  setTimeout(async () => {
    const random = Math.random();
    let status = "LOST";
    let betReturn = 0;

    if (random < 0.4) {
      status = "WON";
      betReturn = parseFloat((newBet.stake * newBet.odd).toFixed(2));
    }

    await supabase.from("bets").update({ status, return: betReturn }).eq("id", newBet.id);
  }, Math.floor(Math.random() * 20000) + 10000);

  return newBet;
}

export async function hasUserBetOnMatch(userId: string, matchId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from("bets")
    .select("id")
    .eq("userId", userId)
    .eq("matchId", matchId)
    .limit(1);
    
  if (error) return false;
  return data.length > 0;
}

export async function getUserBetsForMatch(userId: string, matchId: string): Promise<Bet[]> {
  const { data, error } = await supabase
    .from("bets")
    .select("*")
    .eq("userId", userId)
    .eq("matchId", matchId);
    
  if (error) return [];
  return data as Bet[];
}
