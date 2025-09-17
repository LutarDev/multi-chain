import { promises as fs } from "fs";
import path from "path";

type Purchase = {
  id: string;
  ts: number;
  chain: string;
  currency: string;
  amount: number;
  usdAmount?: number;
  fromAddress?: string;
  bscReceiver?: string;
  txHash?: string;
  status: "pending" | "confirmed" | "failed";
  referral?: string | null;
};

type DbShape = {
  purchases: Purchase[];
};

const DB_FILE = path.join(process.cwd(), "var", "db.json");

async function ensureFile() {
  try {
    await fs.mkdir(path.dirname(DB_FILE), { recursive: true });
    await fs.access(DB_FILE);
  } catch {
    const initial: DbShape = { purchases: [] };
    await fs.writeFile(DB_FILE, JSON.stringify(initial, null, 2));
  }
}

export async function readDb(): Promise<DbShape> {
  await ensureFile();
  const raw = await fs.readFile(DB_FILE, "utf8");
  return JSON.parse(raw) as DbShape;
}

export async function writeDb(db: DbShape): Promise<void> {
  await ensureFile();
  await fs.writeFile(DB_FILE, JSON.stringify(db, null, 2));
}

export type { Purchase, DbShape };

