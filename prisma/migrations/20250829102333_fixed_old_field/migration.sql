/*
  Warnings:

  - You are about to drop the column `subscription` on the `order_items` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "order_items" DROP COLUMN "subscription",
ADD COLUMN     "remarks" TEXT;
