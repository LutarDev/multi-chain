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

