import { createPublicClient, http } from "viem";
import { mainnet, bsc, polygon } from "wagmi/chains";

export async function verifyEvmTx(chain: "ETH" | "BNB" | "POL", txHash: `0x${string}`) {
  const client = createPublicClient({
    chain: chain === "ETH" ? mainnet : chain === "BNB" ? bsc : polygon,
    transport: http(),
  });
  try {
    const receipt = await client.getTransactionReceipt({ hash: txHash });
    return receipt.status === "success";
  } catch {
    return false;
  }
}

export async function verifySolTx(signature: string) {
  try {
    const res = await fetch("https://api.mainnet-beta.solana.com", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "getSignatureStatuses",
        params: [[signature], { searchTransactionHistory: true }],
      }),
    });
    if (!res.ok) return false;
    const json = await res.json();
    const status = json?.result?.value?.[0];
    if (!status) return false;
    if (status.err) return false;
    return Boolean(status.confirmations === null || (status.confirmations || 0) >= 1);
  } catch {
    return false;
  }
}

export async function verifyTronTx(txId: string) {
  try {
    const url = `https://apilist.tronscanapi.com/api/transaction-info?hash=${txId}`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return false;
    const data = await res.json();
    // confirmed is true when included in block
    return Boolean(data?.confirmed || data?.block);
  } catch {
    return false;
  }
}

export async function verifyBtcTx(txId: string) {
  try {
    const url = `https://mempool.space/api/tx/${txId}`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return false;
    const data = await res.json();
    return typeof data?.status?.confirmed === "boolean" ? data.status.confirmed : Boolean(data?.block_height);
  } catch {
    return false;
  }
}

