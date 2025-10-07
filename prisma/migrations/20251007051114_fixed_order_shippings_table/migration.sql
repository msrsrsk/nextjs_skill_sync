/*
  Warnings:

  - You are about to drop the column `address` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `delivery_name` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `shipping_fee` on the `orders` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "orders" DROP COLUMN "address",
DROP COLUMN "delivery_name",
DROP COLUMN "shipping_fee";
