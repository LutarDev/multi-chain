import { NextResponse } from "next/server";
import { prisma } from "@/server/prisma";

const SOFT_CAP = 500_000;
const HARD_CAP = 5_000_000;

export async function GET() {
  const confirmed = await prisma.purchase.findMany({ where: { status: "confirmed" } });
  const raised = confirmed.reduce((sum, p) => sum + (p.usdAmount || 0), 0);
  const participants = new Set(confirmed.map((p) => (p.fromAddress || p.id).toLowerCase())).size;
  return NextResponse.json({ softCap: SOFT_CAP, hardCap: HARD_CAP, raised, participants });
}

