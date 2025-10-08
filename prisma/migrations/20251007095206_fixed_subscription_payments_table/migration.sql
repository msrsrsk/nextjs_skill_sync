/*
  Warnings:

  - Added the required column `subscription_id` to the `subscription_payments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "subscription_payments" ADD COLUMN     "subscription_id" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "order_item_subscriptions_order_item_id_idx" ON "order_item_subscriptions"("order_item_id");

-- CreateIndex
CREATE INDEX "subscription_payments_subscription_id_idx" ON "subscription_payments"("subscription_id");
