export const ERC20_ABI = [
  { inputs: [], name: "decimals", outputs: [{ name: "", type: "uint8" }], stateMutability: "view", type: "function" },
  { inputs: [{ name: "account", type: "address" }], name: "balanceOf", outputs: [{ name: "", type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [{ name: "recipient", type: "address" }, { name: "amount", type: "uint256" }], name: "transfer", outputs: [{ name: "", type: "bool" }], stateMutability: "nonpayable", type: "function" },
] as const;

export const EvmChainIdByKey: Record<"ETH" | "BNB" | "POL", number> = {
  ETH: 1,
  BNB: 56,
  POL: 137,
};

// Known canonical token contracts
export const ERC20_CONTRACTS: Record<"USDC" | "USDT", Partial<Record<number, string>>> = {
  USDC: {
    1: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // Ethereum
    56: "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d", // BSC
    137: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174", // Polygon PoS USDC.e
  },
  USDT: {
    1: "0xdAC17F958D2ee523a2206206994597C13D831ec7", // Ethereum
    // 56: "0x55d398326f99059fF775485246999027B3197955", // BSC (optional)
    // 137: "0xc2132D05D31c914a87C6611C10748AaCB4FE...", // Polygon USDT (add when verified)
  },
};

