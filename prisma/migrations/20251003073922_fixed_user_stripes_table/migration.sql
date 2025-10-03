-- DropIndex
DROP INDEX "user_stripes_customer_id_key";

-- AlterTable
ALTER TABLE "user_stripes" ALTER COLUMN "customer_id" DROP NOT NULL;
