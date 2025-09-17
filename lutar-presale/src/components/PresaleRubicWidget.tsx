"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { ChainCoinSelectModal } from "@/components/ChainCoinSelectModal";
import { useAccount } from "wagmi";
import { openWalletModal } from "@/state/wallet-modal";
import { PresaleWidget } from "@/components/PresaleWidget";

type ChainKey = "BTC" | "ETH" | "BNB" | "SOL" | "POL" | "TRX" | "TON";
type CurrencyKey = ChainKey | "USDC" | "USDT";

const LUTAR_LOGO =
  "https://d391b93f5f62d9c15f67142e43841acc.ipfscdn.io/ipfs/QmdMsTQMGxRHr1yjtJvMCyFgKy3WnswaVNbiLHtNfWGGmA/logo-circle-frame.svg";

export function PresaleRubicWidget() {
  const { address } = useAccount();
  const [selectOpen, setSelectOpen] = useState(false);
  const [chain, setChain] = useState<ChainKey>("ETH");
  const [currency, setCurrency] = useState<CurrencyKey>("ETH");
  const [payAmount, setPayAmount] = useState<string>("");
  const [bscReceiver, setBscReceiver] = useState<string>("");
  const [showReview, setShowReview] = useState(false);

  const lutarAmount = useMemo(() => {
    const n = Number(payAmount || 0);
    if (!n || n <= 0) return "0";
    const usd = currency === "USDC" || currency === "USDT" ? n : n; // assume 1 native ~ 1 unit for preview; true pricing requires oracles
    const tokens = usd / 0.004;
    return Math.floor(tokens).toLocaleString();
  }, [payAmount, currency]);

  const canSubmit = Boolean(payAmount && Number(payAmount) > 0 && bscReceiver);

  function handleSelect(newChain: ChainKey, newCurrency: CurrencyKey) {
    setChain(newChain);
    setCurrency(newCurrency);
    setSelectOpen(false);
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="rounded-2xl border border-white/10 bg-[#0f1218] p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="relative w-10 h-10">
            <Image src={LUTAR_LOGO} alt="LUTAR" fill sizes="40px" />
          </div>
          <div>
            <div className="text-lg font-semibold">LUTAR Presale</div>
            <div className="text-xs text-white/60">Cyberpunk minimal • price 1 LUTAR = 0.004 USDC/USDT</div>
          </div>
        </div>

        <div className="space-y-4">
          {/* Field 1: Pay amount with chain/coin selector */}
          <div className="rounded-xl bg-white/5 p-4 border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-white/60">You pay</span>
              <button className="text-xs text-[#ffc700] hover:underline" onClick={() => setSelectOpen(true)}>
                Select chain & coin
              </button>
            </div>
            <div className="flex items-center gap-3">
              <input
                className="flex-1 bg-transparent outline-none text-xl"
                placeholder="0.00"
                value={payAmount}
                onChange={(e) => setPayAmount(e.target.value)}
                inputMode="decimal"
              />
              <div className="text-sm px-2 py-1 rounded bg-white/10 border border-white/10">
                {currency} on {chain}
              </div>
            </div>
          </div>

          {/* Field 2: Receive LUTAR */}
          <div className="rounded-xl bg-white/5 p-4 border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-white/60">You receive</span>
              <span className="text-xs text-white/60">on BSC</span>
            </div>
            <div className="flex items-center gap-3">
              <input className="flex-1 bg-transparent outline-none text-xl" readOnly value={lutarAmount} />
              <div className="flex items-center gap-2">
                <div className="relative w-8 h-8">
                  <Image src={LUTAR_LOGO} alt="LUTAR" fill sizes="32px" />
                </div>
                <div className="text-sm px-2 py-1 rounded border border-white/10 bg-[#ffc700]/10 text-[#ffc700]">LUTAR</div>
              </div>
            </div>
          </div>

          {/* Field 3: BSC address input */}
          <div className="rounded-xl bg-white/5 p-4 border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-white/60">Your BSC address to receive LUTAR</span>
              <span className="text-xs text-white/50" title="We will send LUTAR to this BSC address via distribution.">?
              </span>
            </div>
            <input
              className="w-full bg-transparent outline-none text-sm border border-white/10 rounded px-3 py-2 focus:border-white/30"
              placeholder="0x..."
              value={bscReceiver}
              onChange={(e) => setBscReceiver(e.target.value)}
            />
          </div>

          {/* Action */}
          <div className="flex items-center gap-3">
            {!address ? (
              <button className="w-full rounded bg-blue-600 hover:bg-blue-500 px-4 py-3" onClick={() => openWalletModal()}>
                Connect Wallet
              </button>
            ) : (
              <button
                className="w-full rounded bg-green-600 hover:bg-green-500 disabled:bg-white/10 disabled:text-white/40 px-4 py-3"
                disabled={!canSubmit}
                onClick={() => setShowReview(true)}
              >
                Buy LUTAR
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Review side panel */}
      <div className="rounded-2xl border border-white/10 bg-[#0f1218] p-6">
        <h3 className="text-lg font-semibold mb-4">Review</h3>
        {!showReview ? (
          <div className="text-white/60 text-sm">Connect wallet and fill fields to see transaction details.</div>
        ) : (
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span>Pay</span><span>{payAmount} {currency} on {chain}</span></div>
            <div className="flex justify-between"><span>Receive</span><span>{lutarAmount} LUTAR on BSC</span></div>
            <div className="flex justify-between"><span>BSC Address</span><span className="break-all">{bscReceiver}</span></div>
            <div className="pt-3">
              <PresaleWidget />
            </div>
          </div>
        )}
      </div>

      <ChainCoinSelectModal
        open={selectOpen}
        onClose={() => setSelectOpen(false)}
        onSelect={handleSelect}
      />
    </div>
  );
}

