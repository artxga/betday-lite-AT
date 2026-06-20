import type { Bet, BetPick, BetWithMatch } from "@/lib/types";
import { getMatchById } from "./matches";
import betsData from "../../../bets.me.50.json";

// In-memory store: userId → Bet[]
const store = new Map<string, Bet[]>();

// Seed the demo user with mock data
const DEMO_USER_ID = "demo-user";
store.set(DEMO_USER_ID, [...(betsData.bets as Bet[])]);

let betCounter = 100;

function generateBetId(): string {
  betCounter++;
  return `bet_${betCounter.toString().padStart(3, "0")}`;
}

export function getUserBets(userId: string): Bet[] {
  return store.get(userId) ?? [];
}

export function getBetById(
  userId: string,
  betId: string
): BetWithMatch | undefined {
  const bets = store.get(userId) ?? [];
  const bet = bets.find((b) => b.id === betId);
  if (!bet) return undefined;

  const match = getMatchById(bet.matchId);
  return { ...bet, match };
}

export function getAllBetsForUser(userId: string): BetWithMatch[] {
  const bets = store.get(userId) ?? [];
  return bets.map((bet) => ({
    ...bet,
    match: getMatchById(bet.matchId),
  }));
}

export function placeBet(
  userId: string,
  matchId: string,
  pick: BetPick,
  stake: number
): Bet {
  const match = getMatchById(matchId);
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

  if (!store.has(userId)) {
    store.set(userId, []);
  }
  store.get(userId)!.push(newBet);

  // Simulate resolution after a random delay (10-30 seconds)
  setTimeout(() => {
    const random = Math.random();
    if (random < 0.4) {
      newBet.status = "WON";
      newBet.return = parseFloat((newBet.stake * newBet.odd).toFixed(2));
    } else {
      newBet.status = "LOST";
      newBet.return = 0;
    }
  }, Math.floor(Math.random() * 20000) + 10000);

  return newBet;
}

export function hasUserBetOnMatch(userId: string, matchId: string): boolean {
  const bets = store.get(userId) ?? [];
  return bets.some((b) => b.matchId === matchId);
}

export function getUserBetsForMatch(userId: string, matchId: string): Bet[] {
  const bets = store.get(userId) ?? [];
  return bets.filter((b) => b.matchId === matchId);
}
