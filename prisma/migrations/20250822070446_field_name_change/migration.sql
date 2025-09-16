/*
  Warnings:

  - You are about to drop the column `supabasePassword` on the `verification_tokens` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "verification_tokens" DROP COLUMN "supabasePassword",
ADD COLUMN     "tempPassword" TEXT;
