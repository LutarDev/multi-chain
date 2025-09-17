"use client";

import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import type { TronWebLike } from "@/types/blockchain";

type TronContextValue = {
  tronWeb: TronWebLike | null;
  address: string | null;
};

const TronContext = createContext<TronContextValue>({ tronWeb: null, address: null });

export function TronProviders({ children }: { children: ReactNode }) {
  const [tronWeb, setTronWeb] = useState<TronWebLike | null>(null);
  const [address, setAddress] = useState<string | null>(null);

  useEffect(() => {
    const anyWindow = window as unknown as { tronWeb?: TronWebLike & { ready?: boolean } };
    async function init() {
      if (anyWindow.tronWeb && anyWindow.tronWeb.ready) {
        setTronWeb(anyWindow.tronWeb);
        const addr = anyWindow.tronWeb.defaultAddress?.base58 || null;
        setAddress(addr);
      }
    }
    init();
  }, []);

  return <TronContext.Provider value={{ tronWeb, address }}>{children}</TronContext.Provider>;
}

export function useTron() {
  return useContext(TronContext);
}

