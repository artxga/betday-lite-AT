import type { Match, MatchesResponse, HourGroup } from "@/lib/types";
import matchesData from "../../../matches.today.50.json";

const data = matchesData as MatchesResponse;

export function getMatches(): Match[] {
  return data.matches;
}

export function getMatchById(id: string): Match | undefined {
  return data.matches.find((m) => m.id === id);
}

export function getMatchesGroupedByHour(): HourGroup[] {
  const grouped = new Map<string, Match[]>();

  for (const match of data.matches) {
    const date = new Date(match.startTime);
    const hourKey = `${date.getHours().toString().padStart(2, "0")}:00`;

    if (!grouped.has(hourKey)) {
      grouped.set(hourKey, []);
    }
    grouped.get(hourKey)!.push(match);
  }

  const hourGroups: HourGroup[] = [];

  // Sort by hour
  const sortedKeys = Array.from(grouped.keys()).sort((a, b) => {
    const hourA = parseInt(a.split(":")[0]);
    const hourB = parseInt(b.split(":")[0]);
    return hourA - hourB;
  });

  for (const key of sortedKeys) {
    const hour24 = parseInt(key.split(":")[0]);
    const period = hour24 >= 12 ? "PM" : "AM";
    const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;

    hourGroups.push({
      hour: key,
      hourLabel: `${hour12}:00 ${period}`,
      matches: grouped
        .get(key)!
        .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()),
    });
  }

  return hourGroups;
}
