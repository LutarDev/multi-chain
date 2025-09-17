"use client";

import { ReactNode } from "react";
import { TonConnectUIProvider } from "@tonconnect/ui-react";

export function TonProviders({ children }: { children: ReactNode }) {
  return (
    // manifestUrl could be hosted; for demo use placeholder
    <TonConnectUIProvider manifestUrl="https://ton-connect.github.io/demo-dapp-with-react-ui/tonconnect-manifest.json">
      {children}
    </TonConnectUIProvider>
  );
}

