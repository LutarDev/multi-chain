"use client";

import { useState, useMemo } from "react";
import { useAccount, useSendTransaction, usePublicClient, useWriteContract, useSwitchChain } from "wagmi";
import { parseEther, parseUnits } from "viem";
import { RECEIVING_ADDRESSES } from "@/lib/addresses";
import { useWallet as useSolWallet } from "@solana/wallet-adapter-react";
import { PublicKey, SystemProgram, Transaction, Connection } from "@solana/web3.js";
import { getAssociatedTokenAddress, createTransferInstruction } from "@solana/spl-token";
import { useTron } from "@/providers/tron";
import { useTonConnectUI, useTonWallet } from "@tonconnect/ui-react";
import QRCode from "qrcode";
import { ERC20_CONTRACTS, ERC20_ABI, EvmChainIdByKey } from "@/lib/erc20";
import { SOLANA_MINTS } from "@/lib/solana";
import { USDT_TRC20_CONTRACT } from "@/lib/tron";

type ChainKey = "BTC" | "ETH" | "BNB" | "SOL" | "POL" | "TRX" | "TON";
type CurrencyKey = ChainKey | "USDC" | "USDT";

const SOL_RPC = "https://api.mainnet-beta.solana.com";

function classNames(...arr: (string | undefined | false)[]) {
  return arr.filter(Boolean).join(" ");
}

export function PresaleWidget() {
  const [selectedChain, setSelectedChain] = useState<ChainKey>("ETH");
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyKey>("ETH");
  const [amount, setAmount] = useState<string>("");
  const [btcQr, setBtcQr] = useState<string>("");

  // EVM
  const { address: evmAddress, chainId } = useAccount();
  const { sendTransactionAsync } = useSendTransaction();
  const publicClient = usePublicClient();
  const { writeContractAsync } = useWriteContract();
  const { switchChainAsync } = useSwitchChain();

  // Solana
  const solWallet = useSolWallet();
  const solConnection = useMemo(() => new Connection(SOL_RPC), []);

  // Tron
  const { tronWeb, address: tronAddress } = useTron();

  // TON
  const [tonUi] = useTonConnectUI();
  const tonWallet = useTonWallet();

  const canBuy = useMemo(() => {
    const amt = Number(amount);
    if (!amt || amt <= 0) return false;
    switch (selectedCurrency) {
      case "ETH":
      case "BNB":
      case "POL":
        return !!evmAddress;
      case "USDC":
      case "USDT":
        // depends per-chain; we'll gate on chain selection
        if (selectedChain === "SOL") return solWallet.connected;
        if (selectedChain === "TRX") return !!tronAddress;
        if (selectedChain === "TON") return !!tonWallet;
        return !!evmAddress; // ERC20/BEP20/POL
      case "SOL":
        return solWallet.connected;
      case "TRX":
        return !!tronAddress;
      case "TON":
        return !!tonWallet;
      case "BTC":
        return true; // QR flow
      default:
        return false;
    }
  }, [amount, evmAddress, solWallet.connected, tronAddress, tonWallet, selectedCurrency, selectedChain]);

  async function onBuy() {
    const amt = Number(amount);
    if (!amt || amt <= 0) return;

    // BTC: show QR to pay to fixed address
    if (selectedCurrency === "BTC") {
      const addr = RECEIVING_ADDRESSES.BTC;
      const uri = `bitcoin:${addr}?amount=${amt}`;
      const dataUrl = await QRCode.toDataURL(uri);
      setBtcQr(dataUrl);
      return;
    }

    // EVM Native: ETH, BNB, POL
    if (["ETH", "BNB", "POL"].includes(selectedCurrency)) {
      const to =
        selectedCurrency === "ETH"
          ? RECEIVING_ADDRESSES.ETH
          : selectedCurrency === "BNB"
          ? RECEIVING_ADDRESSES.BNB
          : RECEIVING_ADDRESSES.POL;
      await sendTransactionAsync({ to, value: parseEther(String(amt)) });
      return;
    }

    // EVM ERC20 USDC/USDT on ETH/BNB/POL
    if (["USDC", "USDT"].includes(selectedCurrency)) {
      const desiredChainId = EvmChainIdByKey[selectedChain as "ETH" | "BNB" | "POL"];
      if (desiredChainId) {
        if (chainId !== desiredChainId && switchChainAsync) {
          await switchChainAsync({ chainId: desiredChainId });
        }
        const tokenAddress = ERC20_CONTRACTS[selectedCurrency as "USDC" | "USDT"][desiredChainId];
        if (!tokenAddress) {
          alert("Selected token not supported on this EVM chain.");
          return;
        }
        const to =
          selectedCurrency === "USDC"
            ? desiredChainId === 1
              ? RECEIVING_ADDRESSES.USDC.ERC20
              : desiredChainId === 56
              ? RECEIVING_ADDRESSES.USDC.BEP20
              : RECEIVING_ADDRESSES.USDC.POL
            : // USDT
              desiredChainId === 1
              ? RECEIVING_ADDRESSES.USDT.ERC20
              : RECEIVING_ADDRESSES.USDT.POL;
        const decimals = (await publicClient?.readContract({
          address: tokenAddress as `0x${string}`,
          abi: ERC20_ABI,
          functionName: "decimals",
        })) as number;
        const amountParsed = parseUnits(String(amt), decimals || 6);
        await writeContractAsync({
          address: tokenAddress as `0x${string}`,
          abi: ERC20_ABI,
          functionName: "transfer",
          args: [to as `0x${string}`, amountParsed],
          chainId: desiredChainId,
        });
        return;
      }
    }

    // SOL Native
    if (selectedCurrency === "SOL") {
      const toPub = new PublicKey(RECEIVING_ADDRESSES.SOL);
      const from = solWallet.publicKey!;
      const tx = new Transaction().add(SystemProgram.transfer({ fromPubkey: from, toPubkey: toPub, lamports: Math.round(amt * 1e9) }));
      const sig = await solWallet.sendTransaction(tx, solConnection);
      await solConnection.confirmTransaction(sig, "confirmed");
      return;
    }

    // SOL USDC/USDT via token transfer (assumes USDC mint set). Using USDC only from README.
    if (selectedCurrency === "USDC" && selectedChain === "SOL") {
      const mint = SOLANA_MINTS.USDC;
      const to = new PublicKey(RECEIVING_ADDRESSES.SOL);
      const from = solWallet.publicKey!;
      const fromAta = await getAssociatedTokenAddress(mint, from);
      const toAta = await getAssociatedTokenAddress(mint, to, true);
      const ix = createTransferInstruction(fromAta, toAta, from, BigInt(Math.round(amt * 1_000_000)));
      const tx = new Transaction().add(ix);
      const sig = await solWallet.sendTransaction(tx, solConnection);
      await solConnection.confirmTransaction(sig, "confirmed");
      return;
    }

    // TRON: native TRX or USDT (TRC20)
    if (selectedChain === "TRX") {
      const anyWindow = window as unknown as { tronWeb?: { trx: { sendTransaction: (to: string, amount: number) => Promise<unknown> }; contract: () => { at: (address: string) => Promise<{ transfer: (to: string, amount: number) => { send: () => Promise<unknown> } }> } } };
      const tw = tronWeb || anyWindow.tronWeb;
      if (!tw) throw new Error("TronWeb not available");
      if (selectedCurrency === "TRX") {
        const to = RECEIVING_ADDRESSES.TRX;
        await tw.trx.sendTransaction(to, Math.round(amt * 1_000_000));
        return;
      }
      if (selectedCurrency === "USDT") {
        const contract = await tw.contract().at(USDT_TRC20_CONTRACT as string);
        const to = RECEIVING_ADDRESSES.USDT.TRC20;
        const amountInSun = Math.round(amt * 1_000_000);
        await contract.transfer(to, amountInSun).send();
        return;
      }
    }

    // TON: native TON or USDT TON as comment-based (requires Jetton transfer integration). We'll implement native TON with comment memo.
    if (selectedChain === "TON") {
      if (!tonUi) return;
      const to = RECEIVING_ADDRESSES.TON.address;
      const comment = RECEIVING_ADDRESSES.TON.comment;
      await tonUi.sendTransaction({
        validUntil: Math.floor(Date.now() / 1000) + 300,
        messages: [
          {
            address: to,
            amount: String(Math.round(amt * 1e9)),
            stateInit: undefined,
            payload: comment,
          },
        ],
      });
      return;
    }

    alert("Selected currency flow is not implemented in this demo.");
  }

  const chains: ChainKey[] = ["BTC", "ETH", "BNB", "SOL", "POL", "TRX", "TON"];

  return (
    <div className="w-full max-w-3xl rounded-xl border border-white/10 bg-black/20 p-6 backdrop-blur">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold">LUTAR Token Presale</h2>
          <p className="text-sm text-white/60">Pay with native coin or USDC/USDT</p>
        </div>
        <div className="text-right text-sm text-white/60">
          <div>Soft cap: 500,000 USD</div>
          <div>Hard cap: 5,000,000 USD</div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label className="text-xs text-white/60">Blockchain</label>
          <div className="mt-1 grid grid-cols-4 gap-2">
            {chains.map((c) => (
              <button
                key={c}
                className={classNames(
                  "px-2 py-1 rounded text-sm border",
                  selectedChain === c ? "bg-white/10 border-white/40" : "bg-transparent border-white/10"
                )}
                onClick={() => {
                  setSelectedChain(c);
                  setSelectedCurrency(c);
                }}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-xs text-white/60">Currency</label>
          <div className="mt-1 grid grid-cols-3 gap-2">
            <button
              className={classNames(
                "px-2 py-1 rounded text-sm border",
                selectedCurrency === selectedChain ? "bg-white/10 border-white/40" : "bg-transparent border-white/10"
              )}
              onClick={() => setSelectedCurrency(selectedChain)}
            >
              {selectedChain}
            </button>
            <button
              className={classNames(
                "px-2 py-1 rounded text-sm border",
                selectedCurrency === "USDC" ? "bg-white/10 border-white/40" : "bg-transparent border-white/10"
              )}
              onClick={() => setSelectedCurrency("USDC")}
            >
              USDC
            </button>
            <button
              className={classNames(
                "px-2 py-1 rounded text-sm border",
                selectedCurrency === "USDT" ? "bg-white/10 border-white/40" : "bg-transparent border-white/10"
              )}
              onClick={() => setSelectedCurrency("USDT")}
            >
              USDT
            </button>
          </div>
        </div>
      </div>
      <div className="mb-4">
        <label className="text-xs text-white/60">Amount</label>
        <input
          className="mt-1 w-full rounded bg-white/5 border border-white/10 px-3 py-2 outline-none focus:border-white/30"
          placeholder="0.0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          inputMode="decimal"
        />
      </div>
      <div className="flex items-center justify-between mb-4 text-sm text-white/60">
        <div>Price: 1 {selectedCurrency} = X LUTAR</div>
        <div>Allocation: ~ {(Number(amount || 0) * 1000).toLocaleString()} LUTAR</div>
      </div>
      <button
        className="w-full rounded bg-blue-600 hover:bg-blue-500 disabled:bg-white/10 disabled:text-white/40 px-4 py-3 font-medium"
        disabled={!canBuy}
        onClick={onBuy}
      >
        Buy LUTAR
      </button>

      {btcQr ? (
        <div className="mt-4 p-4 bg-white/5 rounded">
          <div className="text-sm mb-2">Scan to pay BTC</div>
          <img src={btcQr} alt="BTC QR" className="w-48 h-48" />
          <div className="text-xs text-white/60 break-all mt-2">{RECEIVING_ADDRESSES.BTC}</div>
        </div>
      ) : null}
    </div>
  );
}

