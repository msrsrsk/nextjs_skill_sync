/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `user_images` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "user_images_user_id_key" ON "user_images"("user_id");
