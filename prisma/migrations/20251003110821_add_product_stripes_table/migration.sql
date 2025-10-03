-- CreateTable
CREATE TABLE "product_stripes" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "product_id" UUID NOT NULL,
    "stripe_product_id" TEXT,
    "regular_price_id" TEXT,
    "sale_price_id" TEXT,
    "subscription_price_ids" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_stripes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "product_stripes_product_id_key" ON "product_stripes"("product_id");

-- CreateIndex
CREATE INDEX "product_stripes_stripe_product_id_idx" ON "product_stripes"("stripe_product_id");

-- AddForeignKey
ALTER TABLE "product_stripes" ADD CONSTRAINT "product_stripes_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
