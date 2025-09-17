import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/prisma";
import { verifyEvmTx, verifySolTx, verifyTronTx, verifyBtcTx } from "@/server/verify";
import { isValidBscAddress } from "@/lib/explorers";
import { fetchUsdPrice } from "@/lib/prices";

export async function GET(req: NextRequest) {
  const address = req.headers.get("x-user-address");
  const where = address ? { fromAddress: address } : {};
  const purchases = await prisma.purchase.findMany({ where, orderBy: { createdAt: "desc" } });
  return NextResponse.json({ purchases });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { chain, currency, amount, fromAddress, bscReceiver, txHash, referral } = body || {};
    if (!chain || !currency || !amount || !txHash) {
      return NextResponse.json({ ok: false, error: "missing fields" }, { status: 400 });
    }
    if (bscReceiver && !isValidBscAddress(bscReceiver)) {
      return NextResponse.json({ ok: false, error: "invalid BSC address" }, { status: 400 });
    }

    const purchase: {
      chain: string;
      currency: string;
      amount: number;
      fromAddress?: string;
      bscReceiver?: string;
      txHash?: string;
      status: string;
      referral?: string | null;
    } = {
      chain,
      currency,
      amount: Number(amount),
      fromAddress,
      bscReceiver,
      txHash,
      status: "pending",
      referral: referral || null,
    } as const;

    // Try to verify by chain
    if (["ETH", "BNB", "POL"].includes(chain)) {
      const ok = await verifyEvmTx(chain, txHash);
      purchase.status = ok ? "confirmed" : "pending";
    } else if (chain === "SOL") {
      const ok = await verifySolTx(txHash);
      purchase.status = ok ? "confirmed" : "pending";
    } else if (chain === "TRX") {
      const ok = await verifyTronTx(txHash);
      purchase.status = ok ? "confirmed" : "pending";
    } else if (chain === "BTC") {
      const ok = await verifyBtcTx(txHash);
      purchase.status = ok ? "confirmed" : "pending";
    }

    const usdPrice = await fetchUsdPrice(currency);
    const usdAmount = Number(amount) * (currency === "USDC" || currency === "USDT" ? 1 : usdPrice);
    const created = await prisma.purchase.create({ data: { ...purchase, usdAmount } });
    return NextResponse.json({ ok: true, purchase: created });
  } catch (e) {
    return NextResponse.json({ ok: false, error: "bad request" }, { status: 400 });
  }
}

