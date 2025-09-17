-- CreateTable
CREATE TABLE "Purchase" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "chain" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "usdAmount" REAL,
    "fromAddress" TEXT,
    "bscReceiver" TEXT,
    "txHash" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "referral" TEXT
);
