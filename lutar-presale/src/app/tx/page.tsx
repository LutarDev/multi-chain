import { explorerTxUrl } from "@/lib/explorers";

export default function TxPage({ searchParams }: { searchParams: { chain?: string; hash?: string } }) {
  const url = explorerTxUrl(searchParams.chain || "", searchParams.hash);
  return (
    <main>
      <h1 className="text-xl font-semibold mb-4">Transaction</h1>
      {url ? (
        <a className="underline" href={url} target="_blank">Open in explorer</a>
      ) : (
        <div className="text-white/60">Invalid tx.</div>
      )}
    </main>
  );
}

