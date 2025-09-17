"use client";

import { openWalletModal } from "@/state/wallet-modal";

export function WalletConnectButton() {
  return (
    <button
      className="px-3 py-2 rounded bg-white/10 hover:bg-white/20"
      onClick={() => openWalletModal()}
    >
      Connect Wallet
    </button>
  );
}

