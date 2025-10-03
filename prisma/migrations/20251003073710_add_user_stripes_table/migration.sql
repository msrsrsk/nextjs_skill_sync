-- CreateTable
CREATE TABLE "user_stripes" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "customer_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_stripes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_stripes_user_id_key" ON "user_stripes"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_stripes_customer_id_key" ON "user_stripes"("customer_id");

-- CreateIndex
CREATE INDEX "user_stripes_user_id_idx" ON "user_stripes"("user_id");

-- CreateIndex
CREATE INDEX "user_stripes_customer_id_idx" ON "user_stripes"("customer_id");

-- AddForeignKey
ALTER TABLE "user_stripes" ADD CONSTRAINT "user_stripes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
