/*
  Warnings:

  - A unique constraint covering the columns `[order_item_subscription_id]` on the table `subscription_payments` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "subscription_payments" DROP CONSTRAINT "subscription_payments_subscription_id_fkey";

-- DropIndex
DROP INDEX "order_items_product_id_subscription_id_subscription_status_idx";

-- DropIndex
DROP INDEX "order_items_subscription_id_idx";

-- DropIndex
DROP INDEX "order_items_subscription_status_idx";

-- DropIndex
DROP INDEX "subscription_payments_subscription_id_idx";

-- DropIndex
DROP INDEX "subscription_payments_subscription_id_status_idx";

-- AlterTable
ALTER TABLE "subscription_payments" ADD COLUMN     "order_item_subscription_id" UUID,
ALTER COLUMN "subscription_id" DROP NOT NULL;

-- CreateTable
CREATE TABLE "order_item_subscriptions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "order_item_id" UUID NOT NULL,
    "subscription_id" TEXT NOT NULL,
    "status" "SubscriptionContractStatusType" NOT NULL,
    "interval" TEXT NOT NULL,
    "next_payment_date" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "order_item_subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "order_item_subscriptions_order_item_id_key" ON "order_item_subscriptions"("order_item_id");

-- CreateIndex
CREATE UNIQUE INDEX "order_item_subscriptions_subscription_id_key" ON "order_item_subscriptions"("subscription_id");

-- CreateIndex
CREATE INDEX "order_item_subscriptions_subscription_id_idx" ON "order_item_subscriptions"("subscription_id");

-- CreateIndex
CREATE INDEX "order_item_subscriptions_status_idx" ON "order_item_subscriptions"("status");

-- CreateIndex
CREATE INDEX "order_item_subscriptions_subscription_id_status_idx" ON "order_item_subscriptions"("subscription_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "subscription_payments_order_item_subscription_id_key" ON "subscription_payments"("order_item_subscription_id");

-- CreateIndex
CREATE INDEX "subscription_payments_order_item_subscription_id_idx" ON "subscription_payments"("order_item_subscription_id");

-- CreateIndex
CREATE INDEX "subscription_payments_order_item_subscription_id_status_idx" ON "subscription_payments"("order_item_subscription_id", "status");

-- AddForeignKey
ALTER TABLE "order_item_subscriptions" ADD CONSTRAINT "order_item_subscriptions_order_item_id_fkey" FOREIGN KEY ("order_item_id") REFERENCES "order_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscription_payments" ADD CONSTRAINT "subscription_payments_order_item_subscription_id_fkey" FOREIGN KEY ("order_item_subscription_id") REFERENCES "order_item_subscriptions"("order_item_id") ON DELETE CASCADE ON UPDATE CASCADE;
