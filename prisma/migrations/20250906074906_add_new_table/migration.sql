-- CreateTable
CREATE TABLE "user_images" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,

    CONSTRAINT "user_images_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "user_images_user_id_idx" ON "user_images"("user_id");

-- AddForeignKey
ALTER TABLE "user_images" ADD CONSTRAINT "user_images_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
