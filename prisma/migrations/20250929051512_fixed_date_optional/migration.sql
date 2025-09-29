/*
  Warnings:

  - Made the column `updated_at` on table `chat_rooms` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `notifications` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `order_items` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `orders` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `reviews` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `shipping_addresses` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `subscription_payments` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `user_bookmarks` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `user_images` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `user_images` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `verification_tokens` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `verification_tokens` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "chat_rooms" ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "notifications" ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "order_items" ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "orders" ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "reviews" ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "shipping_addresses" ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "subscription_payments" ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "user_bookmarks" ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "user_images" ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "verification_tokens" ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET NOT NULL;
