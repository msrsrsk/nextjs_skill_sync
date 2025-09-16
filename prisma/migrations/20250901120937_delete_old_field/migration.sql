/*
  Warnings:

  - You are about to drop the column `stripe_invoice_id` on the `subscription_payments` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "subscription_payments" DROP COLUMN "stripe_invoice_id";
