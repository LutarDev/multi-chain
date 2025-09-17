export type TronContractLike = {
  transfer: (to: string, amount: number) => { send: () => Promise<unknown> };
};

export type TronWebLike = {
  trx: {
    sendTransaction: (to: string, amount: number) => Promise<unknown>;
  };
  contract: () => {
    at: (address: string) => Promise<TronContractLike>;
  };
  defaultAddress?: {
    base58?: string;
  };
};

