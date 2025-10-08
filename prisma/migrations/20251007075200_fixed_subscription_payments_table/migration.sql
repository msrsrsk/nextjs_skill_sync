/*
  Warnings:

  - You are about to drop the column `subscription_id` on the `order_item_stripes` table. All the data in the column will be lost.
  - You are about to drop the column `subscription_id` on the `subscription_payments` table. All the data in the column will be lost.
  - Made the column `order_item_subscription_id` on table `subscription_payments` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "order_item_stripes_subscription_id_key";

-- DropIndex
DROP INDEX "subscription_payments_order_item_subscription_id_key";

-- AlterTable
ALTER TABLE "order_item_stripes" DROP COLUMN "subscription_id";

-- AlterTable
ALTER TABLE "subscription_payments" DROP COLUMN "subscription_id",
ALTER COLUMN "order_item_subscription_id" SET NOT NULL;
