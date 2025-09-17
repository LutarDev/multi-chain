"use client";

import { ReactNode } from "react";
import { EvmProviders } from "@/providers/evm";
import { SolanaProviders } from "@/providers/solana";
import { TonProviders } from "@/providers/ton";
import { TronProviders } from "@/providers/tron";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <EvmProviders>
      <SolanaProviders>
        <TonProviders>
          <TronProviders>
            {children}
          </TronProviders>
        </TonProviders>
      </SolanaProviders>
    </EvmProviders>
  );
}

