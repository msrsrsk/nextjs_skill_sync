-- CreateTable
CREATE TABLE "product_pricings" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "product_id" UUID NOT NULL,
    "sale_price" INTEGER,
    "sold_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_pricings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "product_pricings_product_id_key" ON "product_pricings"("product_id");

-- CreateIndex
CREATE INDEX "product_pricings_sold_count_idx" ON "product_pricings"("sold_count");

-- AddForeignKey
ALTER TABLE "product_pricings" ADD CONSTRAINT "product_pricings_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
