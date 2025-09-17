import { NextRequest, NextResponse } from "next/server";
import { readDb, writeDb, type Purchase } from "@/server/db";
import { verifyEvmTx } from "@/server/verify";
import { fetchUsdPrice } from "@/lib/prices";

export async function GET() {
  const db = await readDb();
  return NextResponse.json(db);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { chain, currency, amount, fromAddress, bscReceiver, txHash, referral } = body || {};
    if (!chain || !currency || !amount || !txHash) {
      return NextResponse.json({ ok: false, error: "missing fields" }, { status: 400 });
    }

    const db = await readDb();
    const purchase: Purchase = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      ts: Date.now(),
      chain,
      currency,
      amount: Number(amount),
      fromAddress,
      bscReceiver,
      txHash,
      status: "pending",
      referral: referral || null,
    };

    // Try to verify for EVM chains
    if (["ETH", "BNB", "POL"].includes(chain)) {
      const ok = await verifyEvmTx(chain, txHash);
      purchase.status = ok ? "confirmed" : "pending";
    }

    const usdPrice = await fetchUsdPrice(currency);
    purchase.usdAmount = Number(amount) * (currency === "USDC" || currency === "USDT" ? 1 : usdPrice);

    db.purchases.push(purchase);
    await writeDb(db);
    return NextResponse.json({ ok: true, purchase });
  } catch (e) {
    return NextResponse.json({ ok: false, error: "bad request" }, { status: 400 });
  }
}

