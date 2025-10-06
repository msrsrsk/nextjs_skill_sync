/*
  Warnings:

  - Made the column `icon_url` on table `user_profiles` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "user_profiles" ALTER COLUMN "icon_url" SET NOT NULL;
