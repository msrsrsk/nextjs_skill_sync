/*
  Warnings:

  - You are about to drop the column `order_item_subscription_id` on the `subscription_payments` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "subscription_payments" DROP CONSTRAINT "subscription_payments_order_item_subscription_id_fkey";

-- DropIndex
DROP INDEX "subscription_payments_order_item_subscription_id_idx";

-- DropIndex
DROP INDEX "subscription_payments_order_item_subscription_id_status_idx";

-- AlterTable
ALTER TABLE "subscription_payments" DROP COLUMN "order_item_subscription_id";

-- CreateIndex
CREATE INDEX "subscription_payments_subscription_id_status_idx" ON "subscription_payments"("subscription_id", "status");

-- AddForeignKey
ALTER TABLE "subscription_payments" ADD CONSTRAINT "subscription_payments_subscription_id_fkey" FOREIGN KEY ("subscription_id") REFERENCES "order_item_subscriptions"("subscription_id") ON DELETE CASCADE ON UPDATE CASCADE;
