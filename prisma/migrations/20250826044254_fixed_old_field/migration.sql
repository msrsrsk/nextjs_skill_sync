/*
  Warnings:

  - Made the column `is_subscription` on table `products` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "products" ALTER COLUMN "is_subscription" SET NOT NULL;
