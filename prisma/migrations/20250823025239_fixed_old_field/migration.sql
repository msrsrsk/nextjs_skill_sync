/*
  Warnings:

  - You are about to drop the column `tempPassword` on the `verification_tokens` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "verification_tokens" DROP COLUMN "tempPassword";
