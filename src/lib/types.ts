// === Match Types ===

export interface League {
  id: string;
  name: string;
  country: string;
}

export interface Team {
  id: string;
  name: string;
  shortName: string;
}

export interface MarketOdds {
  home: number;
  draw: number;
  away: number;
}

export interface Market {
  type: "1X2";
  odds: MarketOdds;
}

export interface Match {
  id: string;
  startTime: string;
  league: League;
  homeTeam: Team;
  awayTeam: Team;
  market: Market;
}

export interface MatchesResponse {
  date: string;
  timezone: string;
  matches: Match[];
}

// === Bet Types ===

export type BetPick = "HOME" | "DRAW" | "AWAY";
export type BetStatus = "PENDING" | "WON" | "LOST";

export interface Bet {
  id: string;
  matchId: string;
  placedAt: string;
  pick: BetPick;
  odd: number;
  stake: number;
  status: BetStatus;
  return: number | null;
}

export interface BetsResponse {
  bets: Bet[];
}

// === API Types ===

export interface BetWithMatch extends Bet {
  match?: Match;
}

export interface HourGroup {
  hour: string;       // "00:00", "01:00", etc.
  hourLabel: string;  // "12:00 AM", "1:00 AM", etc.
  matches: Match[];
}

export interface PlaceBetRequest {
  matchId: string;
  pick: BetPick;
  stake: number;
}
