-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('chat', 'product_stock');

-- AlterTable
ALTER TABLE "notifications" ADD COLUMN     "chat_id" TEXT,
ADD COLUMN     "chat_room_id" TEXT,
ADD COLUMN     "message" TEXT,
ADD COLUMN     "sent_at" TEXT,
ADD COLUMN     "type" "NotificationType" NOT NULL DEFAULT 'chat',
ALTER COLUMN "product_id" DROP NOT NULL,
ALTER COLUMN "product_title" DROP NOT NULL;
