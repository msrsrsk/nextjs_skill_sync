/*
  Warnings:

  - You are about to drop the column `is_subscription` on the `orders` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "order_items" ADD COLUMN     "is_subscription" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "is_subscription";
