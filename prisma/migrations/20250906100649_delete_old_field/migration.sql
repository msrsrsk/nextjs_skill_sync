/*
  Warnings:

  - You are about to drop the column `file_path` on the `user_images` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "user_images_file_path_key";

-- AlterTable
ALTER TABLE "user_images" DROP COLUMN "file_path";
