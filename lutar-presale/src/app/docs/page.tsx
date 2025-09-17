export default function DocsPage() {
  return (
    <main className="prose prose-invert max-w-3xl">
      <h1>LUTAR Project Documentation</h1>
      <p>LUTAR is a multi-chain token presale with native and stablecoin payments across BTC, ETH, BSC, SOL, Polygon, TRON, and TON.</p>
      <h2>Local Development</h2>
      <ol>
        <li>Install Node 18+ and npm.</li>
        <li>Clone repo and run <code>npm i</code>.</li>
        <li>Copy <code>.env.example</code> to <code>.env</code> and set <code>DATABASE_URL</code> for your DB.</li>
        <li>For SQLite dev: set <code>DATABASE_URL=&quot;file:./dev.db&quot;</code> and run <code>npx prisma migrate dev</code>.</li>
        <li>Run <code>npm run dev</code> and open <code>http://localhost:3000</code>.</li>
      </ol>
      <h2>Production (Vercel)</h2>
      <ol>
        <li>Provision Vercel Postgres. Copy the <code>DATABASE_URL</code> and <code>DATABASE_DIRECT_URL</code> into Vercel Project Env.</li>
        <li>Ensure <code>next.config.ts</code> image domains include required hosts.</li>
        <li>Deploy. After first deploy, run <code>npx prisma migrate deploy</code> via Vercel CLI or GitHub Action.</li>
        <li>Optionally enable connection pooling via <code>DATABASE_URL</code> (pooler) and <code>DATABASE_DIRECT_URL</code> (direct).</li>
      </ol>
      <h2>Server-side Filtering</h2>
      <p><code>GET /api/purchase-intents</code> accepts <code>X-User-Address</code> header to filter by payer address.</p>
      <h2>Payment Addresses</h2>
      <p>See README wallet list for on-chain receiving addresses per chain/currency.</p>
      <h2>Distribution</h2>
      <p>Automatic distribution via Thirdweb Engine self-hosted instance on BSC after webhook processing.</p>
      <h2>Security</h2>
      <p>Wallet connections use industry-standard SDKs; links to audits and phishing safeguards are provided.</p>
    </main>
  );
}

