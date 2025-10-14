-- CreateTable
CREATE TABLE "product_sales" (
    "product_id" UUID NOT NULL,
    "sold_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "product_sales_product_id_key" ON "product_sales"("product_id");

-- CreateIndex
CREATE INDEX "product_sales_sold_count_idx" ON "product_sales"("sold_count");

-- AddForeignKey
ALTER TABLE "product_sales" ADD CONSTRAINT "product_sales_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
