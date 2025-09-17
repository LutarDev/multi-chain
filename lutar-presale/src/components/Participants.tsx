"use client";

import { useEffect, useState } from "react";
import { explorerTxUrl } from "@/lib/explorers";

type Row = {
  id: string;
  ts: number;
  chain: string;
  currency: string;
  amount: number;
  fromAddress?: string;
  status: string;
};

export function Participants() {
  const [rows, setRows] = useState<Row[]>([]);
  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/api/purchase-intents", { cache: "no-store" });
        const j = await r.json();
        const confirmed = (j?.purchases || []).filter((p: Row) => p.status === "confirmed");
        setRows(confirmed.slice(-6).reverse());
      } catch {}
    })();
  }, []);
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0f1218] p-6">
      <h3 className="text-lg font-semibold mb-3">Recent Participants</h3>
      {rows.length === 0 ? (
        <div className="text-sm text-white/60">No confirmed participations yet.</div>
      ) : (
        <div className="space-y-2 text-sm">
          {rows.map((r) => (
            <div key={r.id} className="flex items-center justify-between">
              <span className="text-white/60">{new Date(r.ts).toLocaleString()}</span>
              <span>{r.chain} {r.currency}</span>
              <span>{r.amount}</span>
              <span className="truncate max-w-[200px]">{r.fromAddress || "—"}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

