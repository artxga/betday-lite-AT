import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getAllBetsForUser, placeBet } from "@/lib/data/bets-store";
import type { PlaceBetRequest } from "@/lib/types";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const bets = getAllBetsForUser(session.user.id);
  return NextResponse.json({ bets });
}

export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as PlaceBetRequest;
    const { matchId, pick, stake } = body;

    if (!matchId || !pick || !stake) {
      return NextResponse.json(
        { error: "matchId, pick, and stake are required" },
        { status: 400 }
      );
    }

    if (!["HOME", "DRAW", "AWAY"].includes(pick)) {
      return NextResponse.json(
        { error: "pick must be HOME, DRAW, or AWAY" },
        { status: 400 }
      );
    }

    const bet = placeBet(session.user.id, matchId, pick, stake);
    return NextResponse.json({ bet }, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
