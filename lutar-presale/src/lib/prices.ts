export type CurrencyKey = "BTC" | "ETH" | "BNB" | "SOL" | "POL" | "TRX" | "TON" | "USDC" | "USDT";

const COINGECKO_IDS: Record<Exclude<CurrencyKey, "USDC" | "USDT">, string> = {
  BTC: "bitcoin",
  ETH: "ethereum",
  BNB: "binancecoin",
  SOL: "solana",
  POL: "polygon-ecosystem-token",
  TRX: "tron",
  TON: "the-open-network",
};

export async function fetchUsdPrice(symbol: CurrencyKey): Promise<number> {
  if (symbol === "USDC" || symbol === "USDT") return 1;
  const id = COINGECKO_IDS[symbol as Exclude<CurrencyKey, "USDC" | "USDT">];
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd`;
  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error("price fetch failed");
  const data = await res.json();
  const price = data?.[id]?.usd;
  if (typeof price !== "number") throw new Error("invalid price");
  return price;
}

export function calcLutarAmount(payAmount: number, payCurrency: CurrencyKey, usdPrice: number): number {
  const usd = payAmount * (payCurrency === "USDC" || payCurrency === "USDT" ? 1 : usdPrice);
  return Math.floor(usd / 0.004);
}

