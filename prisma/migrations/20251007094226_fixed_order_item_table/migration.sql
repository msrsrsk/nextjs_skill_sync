/*
  Warnings:

  - You are about to drop the column `stripe_price_id` on the `order_items` table. All the data in the column will be lost.
  - You are about to drop the column `subscription_id` on the `order_items` table. All the data in the column will be lost.
  - You are about to drop the column `subscription_interval` on the `order_items` table. All the data in the column will be lost.
  - You are about to drop the column `subscription_next_payment` on the `order_items` table. All the data in the column will be lost.
  - You are about to drop the column `subscription_status` on the `order_items` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "order_items_subscription_id_key";

-- AlterTable
ALTER TABLE "order_items" DROP COLUMN "stripe_price_id",
DROP COLUMN "subscription_id",
DROP COLUMN "subscription_interval",
DROP COLUMN "subscription_next_payment",
DROP COLUMN "subscription_status";
