/*
  Warnings:

  - You are about to drop the column `remarks` on the `order_items` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "order_items" DROP COLUMN "remarks",
ADD COLUMN     "subscription" TEXT;
