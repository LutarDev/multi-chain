"use client";

import { useSnapshot } from "valtio";
import { walletModalState, closeWalletModal } from "@/state/wallet-modal";
import { useAccount, useBalance, useReadContract } from "wagmi";
import { formatEther } from "viem";
import { useWallet as useSolWallet } from "@solana/wallet-adapter-react";
import { Connection } from "@solana/web3.js";
import { getAssociatedTokenAddress, getAccount } from "@solana/spl-token";
import { SOLANA_MINTS } from "@/lib/solana";
import { ERC20_ABI, ERC20_CONTRACTS, EvmChainIdByKey } from "@/lib/erc20";
import { useTonAddress, useTonConnectUI } from "@tonconnect/ui-react";
import { useTron } from "@/providers/tron";
import { useEffect, useMemo, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

const SOL_RPC = "https://api.mainnet-beta.solana.com";


export function UnifiedConnectModal() {
  const snap = useSnapshot(walletModalState);
  const { address: evmAddress, isConnected: evmConnected } = useAccount();
  const evmNativeBalance = useBalance({ address: evmAddress, query: { enabled: !!evmAddress } });
  const chainId = (typeof window !== "undefined" ? (window as unknown as { ethereum?: { chainId?: string } }).ethereum?.chainId : undefined);
  const parsedChainId = typeof chainId === "string" ? parseInt(chainId, 16) : undefined;
  const usdcAddr = parsedChainId ? ERC20_CONTRACTS.USDC[parsedChainId] : undefined;
  const usdtAddr = parsedChainId ? ERC20_CONTRACTS.USDT[parsedChainId] : undefined;
  const evmUsdc = useReadContract({
    address: (usdcAddr as `0x${string}`) || undefined,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: evmAddress ? [evmAddress as `0x${string}`] : undefined,
    query: { enabled: !!evmAddress && !!usdcAddr },
  });
  const evmUsdt = useReadContract({
    address: (usdtAddr as `0x${string}`) || undefined,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: evmAddress ? [evmAddress as `0x${string}`] : undefined,
    query: { enabled: !!evmAddress && !!usdtAddr },
  });

  const solWallet = useSolWallet();
  const solConnection = useMemo(() => new Connection(SOL_RPC), []);
  const [solUsdc, setSolUsdc] = useState<string>("0");
  useEffect(() => {
    (async () => {
      if (solWallet.publicKey) {
        try {
          const ata = await getAssociatedTokenAddress(SOLANA_MINTS.USDC, solWallet.publicKey);
          const acct = await getAccount(solConnection, ata);
          setSolUsdc((Number(acct.amount) / 1_000_000).toFixed(2));
        } catch {
          setSolUsdc("0");
        }
      }
    })();
  }, [solWallet.publicKey, solConnection]);

  const tonAddress = useTonAddress(false);
  const [tonUi] = useTonConnectUI();
  const [tonBalance, setTonBalance] = useState<string>("—");
  useEffect(() => {
    (async () => {
      try {
        if (tonAddress) {
          const r = await fetch(`https://toncenter.com/api/v2/getAddressBalance?address=${tonAddress}`);
          const j = await r.json();
          if (j?.ok) setTonBalance((Number(j.result) / 1e9).toFixed(3) + " TON");
        }
      } catch {}
    })();
  }, [tonAddress]);

  const { address: tronAddress } = useTron();
  const [trxBalance, setTrxBalance] = useState<string>("—");
  useEffect(() => {
    (async () => {
      try {
        if (tronAddress) {
          const r = await fetch(`https://apilist.tronscanapi.com/api/accountv2?address=${tronAddress}`);
          const j = await r.json();
          const list: Array<{ tokenAbbr?: string; balance?: number }> = Array.isArray(j?.withPriceTokens) ? j.withPriceTokens : [];
          const trxItem = list.find((t) => t.tokenAbbr === "TRX");
          const bal = (trxItem?.balance as number | undefined) ?? (j?.balance as number | undefined);
          if (bal !== undefined) setTrxBalance((Number(bal) / 1_000_000).toFixed(2) + " TRX");
        }
      } catch {}
    })();
  }, [tronAddress]);

  if (!snap.open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={closeWalletModal} />
      <div className="relative w-full max-w-lg rounded-xl bg-[#141821] border border-white/10 p-4">
        {snap.step === "selectChain" && <SelectChain />}
        {snap.step === "selectWallet" && <SelectWallet />}
        {snap.step === "account" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Your Account</h3>
              <button className="text-white/60 hover:text-white" onClick={closeWalletModal}>Close</button>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-white/60">LUTAR Balance</span>
                <span>—</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/60">Address</span>
                <span className="break-all">
                  {evmAddress || solWallet.publicKey?.toBase58() || tonAddress || tronAddress || "Not connected"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/60">Native Balance</span>
                <span>
                  {evmConnected && evmNativeBalance.data?.value
                    ? `${formatEther(evmNativeBalance.data.value)} native`
                    : solWallet.publicKey
                    ? "—"
                    : tonAddress
                    ? tonBalance
                    : tronAddress
                    ? trxBalance
                    : "—"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/60">USDC Balance</span>
                <span>
                  {solWallet.publicKey
                    ? `${solUsdc} USDC`
                    : evmConnected && evmUsdc.data
                    ? `${(Number(evmUsdc.data) / 1_000_000).toFixed(2)} USDC`
                    : "—"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/60">USDT Balance</span>
                <span>
                  {evmConnected && evmUsdt.data ? `${(Number(evmUsdt.data) / 1_000_000).toFixed(2)} USDT` : "—"}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 justify-end">
              <button
                className="px-3 py-2 rounded bg-white/10 hover:bg-white/20"
                onClick={() => navigator.clipboard.writeText(
                  evmAddress || solWallet.publicKey?.toBase58() || tonAddress || tronAddress || ""
                )}
              >
                Copy Address
              </button>
              <button
                className="px-3 py-2 rounded bg-red-600 hover:bg-red-500"
                onClick={() => {
                  // Minimal disconnect UX: user can use wallet UIs; for EVM provide RainbowKit button to disconnect
                  closeWalletModal();
                }}
              >
                Disconnect
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SelectChain() {
  const snap = useSnapshot(walletModalState);
  const chains: { key: string; label: string }[] = [
    { key: "BTC", label: "Bitcoin" },
    { key: "ETH", label: "Ethereum" },
    { key: "BNB", label: "BSC" },
    { key: "SOL", label: "Solana" },
    { key: "POL", label: "Polygon" },
    { key: "TRX", label: "TRON" },
    { key: "TON", label: "TON" },
  ];
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Select Chain</h3>
        <button className="text-white/60 hover:text-white" onClick={closeWalletModal}>Close</button>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {chains.map((c) => (
          <button
            key={c.key}
            className="px-3 py-2 rounded border border-white/10 hover:bg-white/10"
            onClick={() => {
              walletModalState.selectedChain = c.key as "BTC" | "ETH" | "BNB" | "SOL" | "POL" | "TRX" | "TON";
              walletModalState.step = "selectWallet";
            }}
          >
            {c.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function SelectWallet() {
  const snap = useSnapshot(walletModalState);
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Connect Wallet</h3>
        <button className="text-white/60 hover:text-white" onClick={closeWalletModal}>Close</button>
      </div>
      <div>
        {snap.selectedChain === "ETH" || snap.selectedChain === "BNB" || snap.selectedChain === "POL" ? (
          <div>
            <ConnectButton.Custom>
              {({ openConnectModal, account }) => (
                <button
                  className="w-full px-3 py-2 rounded bg-white/10 hover:bg-white/20"
                  onClick={() => openConnectModal()}
                >
                  {account ? "Connected" : "Connect EVM Wallet"}
                </button>
              )}
            </ConnectButton.Custom>
          </div>
        ) : snap.selectedChain === "SOL" ? (
          <WalletMultiButton className="!w-full !justify-center !bg-purple-600 !rounded" />
        ) : snap.selectedChain === "TON" ? (
          <TonConnectButtonRow />
        ) : snap.selectedChain === "TRX" ? (
          <div className="text-white/70 text-sm">Open TronLink in your browser to connect.</div>
        ) : (
          <div className="text-white/70 text-sm">BTC uses external wallet via QR during purchase.</div>
        )}
      </div>
      <div className="flex items-center justify-end">
        <button
          className="px-3 py-2 rounded bg-blue-600 hover:bg-blue-500"
          onClick={() => (walletModalState.step = "account")}
        >
          Continue
        </button>
      </div>
    </div>
  );
}

function TonConnectButtonRow() {
  const [tonUi] = useTonConnectUI();
  return (
    <button
      className="w-full px-3 py-2 rounded bg-white/10 hover:bg-white/20"
      onClick={() => tonUi.openModal()}
    >
      Connect TON Wallet
    </button>
  );
}

