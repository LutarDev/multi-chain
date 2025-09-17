import { proxy } from "valtio";

export type ChainKey = "BTC" | "ETH" | "BNB" | "SOL" | "POL" | "TRX" | "TON";

type WalletModalState = {
  open: boolean;
  step: "selectChain" | "selectWallet" | "account";
  selectedChain: ChainKey | null;
};

export const walletModalState = proxy<WalletModalState>({
  open: false,
  step: "selectChain",
  selectedChain: null,
});

export function openWalletModal() {
  walletModalState.open = true;
  walletModalState.step = walletModalState.selectedChain ? "selectWallet" : "selectChain";
}

export function closeWalletModal() {
  walletModalState.open = false;
}

