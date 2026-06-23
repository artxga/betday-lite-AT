import type { Match, HourGroup } from "@/lib/types";
import { supabase } from "../supabase";

export async function getMatches(): Promise<Match[]> {
  const { data, error } = await supabase
    .from("matches")
    .select("*")
    .order("startTime", { ascending: true });

  if (error) {
    console.error("Error fetching matches:", error);
    return [];
  }
  return data as Match[];
}

export async function getMatchById(id: string): Promise<Match | undefined> {
  const { data, error } = await supabase
    .from("matches")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return undefined;
  }
  return data as Match;
}

export async function getMatchesGroupedByHour(): Promise<HourGroup[]> {
  const matches = await getMatches();
  const grouped = new Map<string, Match[]>();

  for (const match of matches) {
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
