/*
  Warnings:

  - You are about to drop the column `stripe_product_id` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `stripe_regular_price_id` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `stripe_sale_price_id` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `stripe_subscription_price_ids` on the `products` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "products_stripe_product_id_idx";

-- AlterTable
ALTER TABLE "products" DROP COLUMN "stripe_product_id",
DROP COLUMN "stripe_regular_price_id",
DROP COLUMN "stripe_sale_price_id",
DROP COLUMN "stripe_subscription_price_ids";
