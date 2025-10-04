/*
  Warnings:

  - You are about to drop the column `sale_price` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `sold_count` on the `products` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "products_sold_count_idx";

-- AlterTable
ALTER TABLE "products" DROP COLUMN "sale_price",
DROP COLUMN "sold_count";
