/*
  Warnings:

  - A unique constraint covering the columns `[file_path]` on the table `user_images` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "user_images" ADD COLUMN     "file_path" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "user_images_file_path_key" ON "user_images"("file_path");
