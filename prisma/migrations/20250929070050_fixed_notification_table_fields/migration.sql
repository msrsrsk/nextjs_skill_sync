/*
  Warnings:

  - You are about to drop the column `chat_id` on the `notifications` table. All the data in the column will be lost.
  - You are about to drop the column `chat_room_id` on the `notifications` table. All the data in the column will be lost.
  - You are about to drop the column `message` on the `notifications` table. All the data in the column will be lost.
  - You are about to drop the column `product_id` on the `notifications` table. All the data in the column will be lost.
  - You are about to drop the column `product_title` on the `notifications` table. All the data in the column will be lost.
  - You are about to drop the column `sent_at` on the `notifications` table. All the data in the column will be lost.
  - Added the required column `notifiable_id` to the `notifications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `notifiable_type` to the `notifications` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "notifications_created_at_idx";

-- DropIndex
DROP INDEX "notifications_product_id_idx";

-- AlterTable
ALTER TABLE "notifications" DROP COLUMN "chat_id",
DROP COLUMN "chat_room_id",
DROP COLUMN "message",
DROP COLUMN "product_id",
DROP COLUMN "product_title",
DROP COLUMN "sent_at",
ADD COLUMN     "notifiable_id" TEXT NOT NULL,
ADD COLUMN     "notifiable_type" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "notifications_notifiable_id_notifiable_type_idx" ON "notifications"("notifiable_id", "notifiable_type");

-- CreateIndex
CREATE INDEX "notifications_notifiable_type_idx" ON "notifications"("notifiable_type");
