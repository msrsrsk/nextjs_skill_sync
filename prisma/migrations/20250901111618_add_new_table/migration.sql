/*
  Warnings:

  - You are about to drop the column `is_subscription` on the `order_items` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "SubscriptionStatusType" AS ENUM ('pending', 'past_due', 'succeeded', 'failed', 'canceled');

-- AlterTable
ALTER TABLE "order_items" DROP COLUMN "is_subscription",
ADD COLUMN     "subscription_id" TEXT;

-- CreateTable
CREATE TABLE "subscription_payments" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "payment_date" TIMESTAMP(3) NOT NULL,
    "status" "SubscriptionStatusType" NOT NULL DEFAULT 'pending',
    "subscription_id" TEXT NOT NULL,
    "stripe_invoice_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "subscription_payments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "subscription_payments_user_id_idx" ON "subscription_payments"("user_id");

-- AddForeignKey
ALTER TABLE "subscription_payments" ADD CONSTRAINT "subscription_payments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
