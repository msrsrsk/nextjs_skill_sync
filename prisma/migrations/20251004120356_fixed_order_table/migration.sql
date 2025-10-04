/*
  Warnings:

  - You are about to drop the column `stripe_payment_intent_id` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `stripe_session_id` on the `orders` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "orders_stripe_payment_intent_id_idx";

-- DropIndex
DROP INDEX "orders_stripe_payment_intent_id_key";

-- DropIndex
DROP INDEX "orders_stripe_session_id_idx";

-- DropIndex
DROP INDEX "orders_stripe_session_id_key";

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "stripe_payment_intent_id",
DROP COLUMN "stripe_session_id";
