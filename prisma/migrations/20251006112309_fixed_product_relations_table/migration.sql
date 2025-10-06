/*
  Warnings:

  - You are about to drop the column `optimal_syncs_option_id` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `optimal_syncs_recommended_id` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `optimal_syncs_required_id` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `optimal_syncs_text` on the `products` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "products" DROP COLUMN "optimal_syncs_option_id",
DROP COLUMN "optimal_syncs_recommended_id",
DROP COLUMN "optimal_syncs_required_id",
DROP COLUMN "optimal_syncs_text";
