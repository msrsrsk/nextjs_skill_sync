-- AlterTable
ALTER TABLE "orders" ALTER COLUMN "user_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "reviews" ALTER COLUMN "user_id" DROP NOT NULL;
