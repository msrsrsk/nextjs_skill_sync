/*
  Warnings:

  - The values [cancelled] on the enum `OrderStatusType` will be removed. If these variants are still used in the database, this will fail.
  - The values [cancelled] on the enum `SubscriptionContractStatusType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "OrderStatusType_new" AS ENUM ('pending', 'processing', 'shipped', 'delivered', 'canceled', 'refunded');
ALTER TABLE "orders" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "orders" ALTER COLUMN "status" TYPE "OrderStatusType_new" USING ("status"::text::"OrderStatusType_new");
ALTER TYPE "OrderStatusType" RENAME TO "OrderStatusType_old";
ALTER TYPE "OrderStatusType_new" RENAME TO "OrderStatusType";
DROP TYPE "OrderStatusType_old";
ALTER TABLE "orders" ALTER COLUMN "status" SET DEFAULT 'pending';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "SubscriptionContractStatusType_new" AS ENUM ('active', 'canceled');
ALTER TABLE "order_item_subscriptions" ALTER COLUMN "status" TYPE "SubscriptionContractStatusType_new" USING ("status"::text::"SubscriptionContractStatusType_new");
ALTER TYPE "SubscriptionContractStatusType" RENAME TO "SubscriptionContractStatusType_old";
ALTER TYPE "SubscriptionContractStatusType_new" RENAME TO "SubscriptionContractStatusType";
DROP TYPE "SubscriptionContractStatusType_old";
COMMIT;
