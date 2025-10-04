-- CreateTable
CREATE TABLE "order_stripes" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "order_id" UUID NOT NULL,
    "session_id" TEXT,
    "payment_intent_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "order_stripes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "order_stripes_order_id_key" ON "order_stripes"("order_id");

-- CreateIndex
CREATE UNIQUE INDEX "order_stripes_session_id_key" ON "order_stripes"("session_id");

-- CreateIndex
CREATE UNIQUE INDEX "order_stripes_payment_intent_id_key" ON "order_stripes"("payment_intent_id");

-- CreateIndex
CREATE INDEX "order_stripes_session_id_idx" ON "order_stripes"("session_id");

-- CreateIndex
CREATE INDEX "order_stripes_payment_intent_id_idx" ON "order_stripes"("payment_intent_id");

-- AddForeignKey
ALTER TABLE "order_stripes" ADD CONSTRAINT "order_stripes_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
