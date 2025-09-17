export const RECEIVING_ADDRESSES = {
  BTC: "bc1qarvyg3f4ymcwrp0naftqm6zq05j233s82cpaq2",
  ETH: "0x047693b22f3f9F246A563872E58056f0C766337b",
  BNB: "0xb23DdB2b79d9af4e4DCE7C457e48F7912e242e9a",
  TRX: "TZFV48S6UVGYvFmLybPgTAwtqm4pKQX4eQ",
  SOL: "EgJbUJKNn8eUpKLEqXPbogEUiUsYE7J5MWLXcEBWHA29",
  POL: "0xC8a68Cf65CBf292A0Bc3677af6C932926f2aBAd3",
  TON: {
    address: "EQBNY7a1Gsy1O7TX0OhGBnM8YhpHQ6mAWIjq2glCTuJ1SlxF",
    comment: "4122895226",
  },
  USDC: {
    ERC20: "0x931EecD3bf8f4ed5359C52016fb8F06D29C6202a",
    BEP20: "0x5d882e17B8aeeB0f0e82701DB436C42dE2990a83",
    POL: "0x131050060158C764331Df2588a172d02406dfF14",
    SOL: "7cGELFBgYjGjZ9ruo5ckXf4ZomNkgQxoRGjrMPwwKAho",
  },
  USDT: {
    TRC20: "TY8JjNbWDVA6wbTFot8vEL8vMNXFYdsibg",
    TON: {
      address: "EQBNY7a1Gsy1O7TX0OhGBnM8YhpHQ6mAWIjq2glCTuJ1SlxF",
      comment: "7749351237",
    },
    POL: "0x3e62F373D69062A0B5b2851b677Ad8ab1F557aF1",
    ERC20: "0xBf8A4341Fe649018D3C56f85092233EdC7242f12",
  },
} as const;

export type SupportedNative = "BTC" | "ETH" | "BNB" | "TRX" | "SOL" | "POL" | "TON";
export type SupportedStable = "USDC" | "USDT";
export type EvmChainKey = "ETH" | "BNB" | "POL";

