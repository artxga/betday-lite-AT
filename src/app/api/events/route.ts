import { NextResponse } from "next/server";
import { getMatchesGroupedByHour } from "@/lib/data/matches";

export async function GET() {
  const hourGroups = getMatchesGroupedByHour();
  return NextResponse.json(hourGroups);
}
