/*
  Warnings:

  - You are about to drop the column `subscription_next_payment` on the `order_items` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[subscription_id]` on the table `order_items` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "order_items" DROP COLUMN "subscription_next_payment";

-- CreateIndex
CREATE UNIQUE INDEX "order_items_subscription_id_key" ON "order_items"("subscription_id");

-- AddForeignKey
ALTER TABLE "subscription_payments" ADD CONSTRAINT "subscription_payments_subscription_id_fkey" FOREIGN KEY ("subscription_id") REFERENCES "order_items"("subscription_id") ON DELETE CASCADE ON UPDATE CASCADE;
