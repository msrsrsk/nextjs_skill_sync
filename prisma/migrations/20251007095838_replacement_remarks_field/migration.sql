/*
  Warnings:

  - You are about to drop the column `remarks` on the `order_items` table. All the data in the column will be lost.
  - Added the required column `remarks` to the `order_item_subscriptions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "order_item_subscriptions" ADD COLUMN     "remarks" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "order_items" DROP COLUMN "remarks";
