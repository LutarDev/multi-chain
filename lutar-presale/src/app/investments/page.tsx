async function fetchInvestments() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/purchase-intents`, { cache: "no-store" });
  try {
    const json = await res.json();
    return json?.purchases || [];
  } catch {
    return [];
  }
}

import { InvestmentsClient } from "./page.client";

export default async function InvestmentsPage() {
  const purchases = await fetchInvestments();
  return (
    <main>
      <h1 className="text-xl font-semibold mb-4">My Investments</h1>
      <InvestmentsClient initial={purchases} />
    </main>
  );
}

