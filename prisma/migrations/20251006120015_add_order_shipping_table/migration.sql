-- CreateTable
CREATE TABLE "order_shippings" (
    "order_id" UUID NOT NULL,
    "delivery_name" TEXT NOT NULL,
    "address" JSONB NOT NULL,
    "shipping_fee" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "order_shippings_order_id_key" ON "order_shippings"("order_id");

-- CreateIndex
CREATE INDEX "order_shippings_order_id_idx" ON "order_shippings"("order_id");

-- AddForeignKey
ALTER TABLE "order_shippings" ADD CONSTRAINT "order_shippings_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
