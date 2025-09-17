async function fetchInvestments() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/purchase-intents`, { cache: "no-store" });
  try {
    const json = await res.json();
    return json?.purchases || [];
  } catch {
    return [];
  }
}

export default async function InvestmentsPage() {
  const purchases = await fetchInvestments();
  return (
    <main>
      <h1 className="text-xl font-semibold mb-4">My Investments</h1>
      <div className="rounded-xl border border-white/10 bg-white/5">
        <div className="grid grid-cols-6 gap-2 text-xs text-white/60 px-3 py-2 border-b border-white/10">
          <div>Time</div>
          <div>Chain</div>
          <div>Currency</div>
          <div>Amount</div>
          <div>Status</div>
          <div>Tx</div>
        </div>
        {purchases.map((p: {
          id: string;
          ts: number;
          chain: string;
          currency: string;
          amount: number;
          status: string;
          txHash?: string;
        }) => (
          <div key={p.id} className="grid grid-cols-6 gap-2 px-3 py-2 border-b border-white/10 text-sm">
            <div>{new Date(p.ts).toLocaleString()}</div>
            <div>{p.chain}</div>
            <div>{p.currency}</div>
            <div>{p.amount}</div>
            <div className={p.status === "confirmed" ? "text-green-400" : "text-yellow-400"}>{p.status}</div>
            <div className="truncate">{p.txHash || "—"}</div>
          </div>
        ))}
      </div>
    </main>
  );
}

