export default function AuditPage() {
  return (
    <main className="prose prose-invert max-w-3xl">
      <h1>Contract Audit</h1>
      <p>
        LUTAR token uses a deployed Thirdweb ERC20 Base modular contract (address
        <code> 0x2770904185Ed743d991D8fA21C8271ae6Cd4080E</code>). Refer to the public audit library from 0xMacro for Thirdweb modules:
        <a href="https://0xmacro.com/library/audits/thirdweb-21" target="_blank"> thirdweb-21 audit </a>.
      </p>
    </main>
  );
}

