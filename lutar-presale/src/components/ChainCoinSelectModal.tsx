"use client";

import { useState } from "react";
import Image from "next/image";
import { CHAIN_ICONS, TOKEN_ICONS } from "@/lib/icons";

type ChainKey = "BTC" | "ETH" | "BNB" | "SOL" | "POL" | "TRX" | "TON";
type CurrencyKey = ChainKey | "USDC" | "USDT";

export function ChainCoinSelectModal({
  open,
  onClose,
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (chain: ChainKey, currency: CurrencyKey) => void;
}) {
  const [selectedChain, setSelectedChain] = useState<ChainKey>("ETH");
  const currencies: CurrencyKey[] = ["USDC", "USDT", selectedChain];

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-xl bg-[#141821] border border-white/10 p-4">
        <h3 className="text-lg font-semibold mb-3">Select Chain & Currency</h3>
        <div className="mb-3">
          <div className="text-xs text-white/60 mb-1">Chain</div>
          <div className="grid grid-cols-4 gap-2">
            {["BTC", "ETH", "BNB", "SOL", "POL", "TRX", "TON"].map((c) => (
              <button
                key={c}
                className={`px-2 py-1 rounded border text-sm ${
                  selectedChain === c ? "bg-white/10 border-white/40" : "bg-transparent border-white/10"
                }`}
                onClick={() => setSelectedChain(c as ChainKey)}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <div className="text-xs text-white/60 mb-1">Currency</div>
          <div className="grid grid-cols-3 gap-2">
            {currencies.map((cur) => (
              <button
                key={cur}
                className="px-2 py-1 rounded border text-sm bg-transparent border-white/10 hover:bg-white/10"
                onClick={() => onSelect(selectedChain, cur)}
              >
                <span className="inline-flex items-center gap-2">
                  <span className="relative w-4 h-4"><Image src={TOKEN_ICONS[cur] || CHAIN_ICONS[selectedChain]} alt={cur} fill sizes="16px" /></span>
                  {cur}
                </span>
              </button>
            ))}
          </div>
        </div>
        <div className="flex justify-end">
          <button className="px-3 py-2 rounded bg-white/10 hover:bg-white/20" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

