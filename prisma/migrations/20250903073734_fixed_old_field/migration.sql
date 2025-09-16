/*
  Warnings:

  - The `subscription_next_payment` column on the `order_items` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "order_items" DROP COLUMN "subscription_next_payment",
ADD COLUMN     "subscription_next_payment" TIMESTAMP(3);
