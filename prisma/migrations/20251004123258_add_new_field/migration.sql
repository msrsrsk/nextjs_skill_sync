/*
  Warnings:

  - A unique constraint covering the columns `[subscription_id]` on the table `order_item_stripes` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "order_item_stripes" ADD COLUMN     "subscription_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "order_item_stripes_subscription_id_key" ON "order_item_stripes"("subscription_id");
