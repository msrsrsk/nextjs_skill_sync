/*
  Warnings:

  - You are about to drop the column `effective_date` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `obtainable_skills` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `side_effect` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `skill_effects` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `sync_time` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `target_level` on the `products` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "products" DROP COLUMN "effective_date",
DROP COLUMN "obtainable_skills",
DROP COLUMN "side_effect",
DROP COLUMN "skill_effects",
DROP COLUMN "sync_time",
DROP COLUMN "target_level";
