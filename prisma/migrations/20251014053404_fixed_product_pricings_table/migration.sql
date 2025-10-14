/*
  Warnings:

  - You are about to drop the column `sold_count` on the `product_pricings` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "product_pricings_sold_count_idx";

-- AlterTable
ALTER TABLE "product_pricings" DROP COLUMN "sold_count";

-- CreateIndex
CREATE INDEX "product_pricings_sale_price_idx" ON "product_pricings"("sale_price");
