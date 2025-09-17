"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useTonAddress, TonConnectButton } from "@tonconnect/ui-react";
import { useTron } from "@/providers/tron";

export function WalletConnectBar() {
  const tonAddress = useTonAddress(false);
  const { address: tronAddress } = useTron();

  return (
    <div className="w-full flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2">
        <span className="text-xs uppercase text-white/60">EVM</span>
        <ConnectButton chainStatus="icon" accountStatus="address" showBalance={false} />
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs uppercase text-white/60">Solana</span>
        <WalletMultiButton className="!bg-purple-600 !text-white !rounded" />
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs uppercase text-white/60">TON</span>
        <TonConnectButton />
        {tonAddress ? <span className="text-xs text-white/60">{tonAddress}</span> : null}
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs uppercase text-white/60">TRON</span>
        <span className="text-xs text-white/80">{tronAddress || "Connect via TronLink"}</span>
      </div>
    </div>
  );
}

