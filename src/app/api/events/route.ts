import { NextResponse } from "next/server";
import { getMatchesGroupedByHour } from "@/lib/data/matches";

export async function GET() {
  const hourGroups = await getMatchesGroupedByHour();
  return NextResponse.json(hourGroups);
}
