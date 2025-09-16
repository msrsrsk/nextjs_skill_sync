/*
  Warnings:

  - You are about to drop the column `subscription_payment_links` on the `products` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "products" DROP COLUMN "subscription_payment_links";
