/*
  Warnings:

  - Made the column `customer_id` on table `user_stripes` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "user_stripes" ALTER COLUMN "customer_id" SET NOT NULL;
