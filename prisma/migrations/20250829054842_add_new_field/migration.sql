/*
  Warnings:

  - You are about to drop the column `is_subscription` on the `products` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "products" DROP COLUMN "is_subscription",
ADD COLUMN     "subscription_payment_link" TEXT;
