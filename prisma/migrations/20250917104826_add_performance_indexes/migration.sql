-- CreateIndex
CREATE INDEX "notifications_type_idx" ON "notifications"("type");

-- CreateIndex
CREATE INDEX "notifications_product_id_idx" ON "notifications"("product_id");

-- CreateIndex
CREATE INDEX "notifications_created_at_idx" ON "notifications"("created_at");

-- CreateIndex
CREATE INDEX "notifications_type_created_at_idx" ON "notifications"("type", "created_at");

-- CreateIndex
CREATE INDEX "order_items_product_id_subscription_id_subscription_status_idx" ON "order_items"("product_id", "subscription_id", "subscription_status");

-- CreateIndex
CREATE INDEX "order_items_subscription_id_idx" ON "order_items"("subscription_id");

-- CreateIndex
CREATE INDEX "order_items_subscription_status_idx" ON "order_items"("subscription_status");

-- CreateIndex
CREATE INDEX "order_items_order_id_product_id_idx" ON "order_items"("order_id", "product_id");

-- CreateIndex
CREATE INDEX "order_items_created_at_idx" ON "order_items"("created_at");

-- CreateIndex
CREATE INDEX "orders_user_id_status_idx" ON "orders"("user_id", "status");

-- CreateIndex
CREATE INDEX "orders_created_at_idx" ON "orders"("created_at");

-- CreateIndex
CREATE INDEX "orders_stripe_session_id_idx" ON "orders"("stripe_session_id");

-- CreateIndex
CREATE INDEX "orders_stripe_payment_intent_id_idx" ON "orders"("stripe_payment_intent_id");

-- CreateIndex
CREATE INDEX "products_category_price_idx" ON "products"("category", "price");

-- CreateIndex
CREATE INDEX "products_category_stock_idx" ON "products"("category", "stock");

-- CreateIndex
CREATE INDEX "products_category_created_at_idx" ON "products"("category", "created_at");

-- CreateIndex
CREATE INDEX "products_sold_count_idx" ON "products"("sold_count");

-- CreateIndex
CREATE INDEX "products_stripe_product_id_idx" ON "products"("stripe_product_id");

-- CreateIndex
CREATE INDEX "reviews_product_id_is_approved_idx" ON "reviews"("product_id", "is_approved");

-- CreateIndex
CREATE INDEX "reviews_product_id_is_priority_idx" ON "reviews"("product_id", "is_priority");

-- CreateIndex
CREATE INDEX "reviews_is_approved_is_priority_idx" ON "reviews"("is_approved", "is_priority");

-- CreateIndex
CREATE INDEX "reviews_rating_idx" ON "reviews"("rating");

-- CreateIndex
CREATE INDEX "subscription_payments_subscription_id_idx" ON "subscription_payments"("subscription_id");

-- CreateIndex
CREATE INDEX "subscription_payments_status_idx" ON "subscription_payments"("status");

-- CreateIndex
CREATE INDEX "subscription_payments_payment_date_idx" ON "subscription_payments"("payment_date");

-- CreateIndex
CREATE INDEX "subscription_payments_created_at_idx" ON "subscription_payments"("created_at");

-- CreateIndex
CREATE INDEX "subscription_payments_user_id_status_idx" ON "subscription_payments"("user_id", "status");

-- CreateIndex
CREATE INDEX "subscription_payments_subscription_id_status_idx" ON "subscription_payments"("subscription_id", "status");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_stripe_customer_id_idx" ON "users"("stripe_customer_id");

-- CreateIndex
CREATE INDEX "users_created_at_idx" ON "users"("created_at");
