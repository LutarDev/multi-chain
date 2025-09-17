"use client";

import { useEffect, useMemo, useState } from "react";
import { useAccount } from "wagmi";

type Row = {
  id: string;
  ts: number;
  chain: string;
  currency: string;
  amount: number;
  status: string;
  txHash?: string;
  fromAddress?: string;
  bscReceiver?: string;
};

export function InvestmentsClient({ initial }: { initial: Row[] }) {
  const { address } = useAccount();
  const [rows, setRows] = useState<Row[]>(initial);
  const [onlyMine, setOnlyMine] = useState<boolean>(true);
  const mine = useMemo(() => {
    if (!onlyMine || !address) return rows;
    return rows.filter((r) => (r.fromAddress || "").toLowerCase() === address.toLowerCase());
  }, [rows, address, onlyMine]);
  useEffect(() => {
    // refresh
    (async () => {
      try {
        const headers: HeadersInit = address ? { "x-user-address": address } : {};
        const r = await fetch("/api/purchase-intents", { cache: "no-store", headers });
        const j = await r.json();
        setRows(j?.purchases || []);
      } catch {}
    })();
  }, [address]);
  return (
    <div className="rounded-xl border border-white/10 bg-white/5">
      <div className="flex items-center justify-end px-3 py-2 gap-2 text-sm">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={onlyMine} onChange={(e) => setOnlyMine(e.target.checked)} />
          Only my address
        </label>
      </div>
      <div className="grid grid-cols-7 gap-2 text-xs text-white/60 px-3 py-2 border-b border-white/10">
        <div>Time</div>
        <div>Chain</div>
        <div>Currency</div>
        <div>Amount</div>
        <div>Status</div>
        <div>From</div>
        <div>To (BSC)</div>
      </div>
      {mine.map((p) => (
        <div key={p.id} className="grid grid-cols-7 gap-2 px-3 py-2 border-b border-white/10 text-sm">
          <div>{new Date(p.ts).toLocaleString()}</div>
          <div>{p.chain}</div>
          <div>{p.currency}</div>
          <div>{p.amount}</div>
          <div className={p.status === "confirmed" ? "text-green-400" : "text-yellow-400"}>{p.status}</div>
          <div className="truncate">{p.fromAddress || "—"}</div>
          <div className="truncate">{p.bscReceiver || "—"}</div>
        </div>
      ))}
      {mine.length === 0 ? (
        <div className="px-3 py-4 text-sm text-white/60">No investments for this address yet.</div>
      ) : null}
    </div>
  );
}

