import { NextResponse } from "next/server";
import { readDb } from "@/server/db";

const SOFT_CAP = 500_000;
const HARD_CAP = 5_000_000;

export async function GET() {
  const db = await readDb();
  const confirmed = db.purchases.filter((p) => p.status === "confirmed");
  const raised = confirmed.reduce((sum, p) => sum + (p.usdAmount || 0), 0);
  const participants = new Set(confirmed.map((p) => p.fromAddress?.toLowerCase() || p.id)).size;
  return NextResponse.json({ softCap: SOFT_CAP, hardCap: HARD_CAP, raised, participants });
}

