"use client";

import { ReactNode, useEffect, useState } from "react";
import { WagmiProvider, http } from "wagmi";
import { bsc, mainnet, polygon } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getDefaultConfig, RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";

const queryClient = new QueryClient();

const wagmiConfig = getDefaultConfig({
  appName: "LUTAR Presale",
  projectId: "lutar-presale-local",
  chains: [mainnet, bsc, polygon],
  transports: {
    [mainnet.id]: http(),
    [bsc.id]: http(),
    [polygon.id]: http(),
  },
  ssr: true,
});

export function EvmProviders({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {mounted ? (
          <RainbowKitProvider theme={darkTheme({ overlayBlur: "small" })} modalSize="compact">
            {children}
          </RainbowKitProvider>
        ) : null}
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export type EvmChainKey = "ETH" | "BNB" | "POL";

