/*
  Warnings:

  - The primary key for the `product_pricings` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `product_pricings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "product_pricings" DROP CONSTRAINT "product_pricings_pkey",
DROP COLUMN "id";

-- CreateTable
CREATE TABLE "product_details" (
    "product_id" UUID NOT NULL,
    "sync_time" TEXT,
    "target_level" TEXT,
    "effective_date" TEXT,
    "obtainable_skills" TEXT,
    "side_effect" TEXT,
    "skill_effects" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "product_details_product_id_key" ON "product_details"("product_id");

-- CreateIndex
CREATE INDEX "product_details_product_id_idx" ON "product_details"("product_id");

-- AddForeignKey
ALTER TABLE "product_details" ADD CONSTRAINT "product_details_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
