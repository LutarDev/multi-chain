export function explorerTxUrl(chain: string, txHash?: string): string | null {
  if (!txHash) return null;
  switch (chain) {
    case "ETH":
      return `https://etherscan.io/tx/${txHash}`;
    case "BNB":
      return `https://bscscan.com/tx/${txHash}`;
    case "POL":
      return `https://polygonscan.com/tx/${txHash}`;
    case "SOL":
      return `https://solscan.io/tx/${txHash}`;
    case "TRX":
      return `https://tronscan.org/#/transaction/${txHash}`;
    case "BTC":
      return `https://mempool.space/tx/${txHash}`;
    default:
      return null;
  }
}

export function isValidBscAddress(addr: string | undefined | null): boolean {
  if (!addr) return false;
  return /^0x[a-fA-F0-9]{40}$/.test(addr);
}

