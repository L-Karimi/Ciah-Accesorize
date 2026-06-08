-- AlterTable
ALTER TABLE "payments"
ADD COLUMN "checkoutRequestId" TEXT,
ADD COLUMN "merchantRequestId" TEXT,
ADD COLUMN "mpesaReceiptNumber" TEXT,
ADD COLUMN "transactionStatus" TEXT,
ADD COLUMN "resultCode" TEXT,
ADD COLUMN "resultDescription" TEXT,
ADD COLUMN "callbackPayload" JSONB,
ADD COLUMN "retryCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "lastRetryAt" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "payments_checkoutRequestId_key" ON "payments"("checkoutRequestId");

-- CreateIndex
CREATE INDEX "payments_checkoutRequestId_idx" ON "payments"("checkoutRequestId");
