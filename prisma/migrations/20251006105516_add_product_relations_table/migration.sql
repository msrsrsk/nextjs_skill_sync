-- CreateTable
CREATE TABLE "product_relations" (
    "product_id" UUID NOT NULL,
    "optimal_syncs_required_id" TEXT,
    "optimal_syncs_option_id" TEXT,
    "optimal_syncs_recommended_id" TEXT,
    "optimal_syncs_text" VARCHAR(60),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "product_relations_product_id_key" ON "product_relations"("product_id");

-- CreateIndex
CREATE INDEX "product_relations_product_id_idx" ON "product_relations"("product_id");

-- AddForeignKey
ALTER TABLE "product_relations" ADD CONSTRAINT "product_relations_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
