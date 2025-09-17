export default function DocsPage() {
  return (
    <main className="prose prose-invert max-w-3xl">
      <h1>LUTAR Project Documentation</h1>
      <p>LUTAR is a multi-chain token presale with native and stablecoin payments across BTC, ETH, BSC, SOL, Polygon, TRON, and TON.</p>
      <h2>Architecture Overview</h2>
      <ul>
        <li>Frontend: Next.js (App Router) + Tailwind (dark-first cyberpunk UI)</li>
        <li>Wallets: RainbowKit/Wagmi (EVM), Solana Wallet Adapter, TronLink (Tron), TonConnect (TON), BTC QR</li>
        <li>Payments: Native coin and USDC/USDT per supported chain</li>
        <li>Backend: Next.js API routes (purchase intents, metrics, webhook)</li>
        <li>Database: Prisma ORM with SQLite (dev) or Vercel Postgres (prod)</li>
        <li>Distribution: Thirdweb Engine webhook to auto-distribute LUTAR on BSC</li>
      </ul>
      <h2>Local Development</h2>
      <ol>
        <li>Install Node 18+ and npm.</li>
        <li>Clone repo and run <code>npm i</code>.</li>
        <li>Copy <code>.env.example</code> to <code>.env</code> and set <code>DATABASE_URL</code> for your DB.</li>
        <li>For SQLite dev: set <code>DATABASE_URL=&quot;file:./dev.db&quot;</code> and run <code>npx prisma migrate dev</code>.</li>
        <li>Run <code>npm run dev</code> and open <code>http://localhost:3000</code>.</li>
      </ol>
      <h3>Local with Postgres (Docker)</h3>
      <ol>
        <li>Start a local Postgres</li>
      </ol>
      <pre><code>docker run --name lutar-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_USER=postgres -e POSTGRES_DB=lutar -p 5432:5432 -d postgres:16</code></pre>
      <ol start={2}>
        <li>Configure env</li>
      </ol>
      <pre><code>cp .env.example .env
echo DATABASE_URL=&quot;postgresql://postgres:postgres@localhost:5432/lutar?schema=public&quot; &gt;&gt; .env
echo DATABASE_DIRECT_URL=&quot;postgresql://postgres:postgres@localhost:5432/lutar?schema=public&quot; &gt;&gt; .env</code></pre>
      <ol start={3}>
        <li>Migrate and run</li>
      </ol>
      <pre><code>npx prisma migrate dev --name init
npx prisma generate
npm run dev</code></pre>
      <h2>Production (Vercel)</h2>
      <ol>
        <li>Provision Vercel Postgres. Copy the <code>DATABASE_URL</code> and <code>DATABASE_DIRECT_URL</code> into Vercel Project Env.</li>
        <li>Ensure <code>next.config.ts</code> image domains include required hosts.</li>
        <li>Deploy. After first deploy, run <code>npx prisma migrate deploy</code> via Vercel CLI or GitHub Action.</li>
        <li>Optionally enable connection pooling via <code>DATABASE_URL</code> (pooler) and <code>DATABASE_DIRECT_URL</code> (direct).</li>
      </ol>
      <pre><code>DATABASE_URL=&lt;pooled-vercel-postgres-url&gt;
DATABASE_DIRECT_URL=&lt;direct-vercel-postgres-url&gt;</code></pre>
      <pre><code># Using Vercel CLI
vercel login
vercel link
# Run migrations remotely (CI or one-off)
npx prisma migrate deploy</code></pre>
      <h2>Server-side Filtering</h2>
      <p><code>GET /api/purchase-intents</code> accepts <code>X-User-Address</code> header to filter by payer address.</p>
      <h2>Endpoints</h2>
      <ul>
        <li><code>GET /api/metrics</code> &mdash; returns soft/hard cap, raised, participants.</li>
        <li><code>GET /api/purchase-intents</code> &mdash; returns purchases. Supports <code>X-User-Address</code> header.</li>
        <li><code>POST /api/purchase-intents</code> &mdash; records a purchase intent. Body:</li>
      </ul>
      <pre><code>{`{
  "chain": "ETH|BNB|POL|SOL|TRX|TON|BTC",
  "currency": "ETH|BNB|POL|USDC|USDT|SOL|TRX|TON|BTC",
  "amount": 1.23,
  "fromAddress": "0x... / ...",
  "bscReceiver": "0x...",
  "txHash": "0x... / signature / txid",
  "referral": "ABC123"
}`}</code></pre>
      <h2>Payment Addresses</h2>
      <p>See README wallet list for on-chain receiving addresses per chain/currency.</p>
      <h2>Distribution</h2>
      <p>Automatic distribution via Thirdweb Engine self-hosted instance on BSC after webhook processing.</p>
      <h2>Security</h2>
      <p>Wallet connections use industry-standard SDKs; links to audits and phishing safeguards are provided.</p>
    </main>
  );
}

