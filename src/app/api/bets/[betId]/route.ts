import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getBetById } from "@/lib/data/bets-store";

export async function GET(_request: Request, { params }: { params: Promise<{ betId: string }> }) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { betId } = await params;
  const bet = await getBetById(session.user.id, betId);

  if (!bet) {
    return NextResponse.json({ error: "Bet not found" }, { status: 404 });
  }

  return NextResponse.json({ bet });
}
