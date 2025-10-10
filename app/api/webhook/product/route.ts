import { NextRequest, NextResponse } from "next/server"

import { getProductRepository } from "@/repository/product"
import { updateProductStripe } from "@/services/product-stripe/actions"
import { createStripeProductData } from "@/services/stripe/webhook-actions"
import { verifySupabaseWebhookAuth } from "@/lib/utils/webhook"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { PRODUCT_ERROR } = ERROR_MESSAGES;

export async function POST(request: NextRequest) {   
    try {
        // 1. 認証処理
        const authError = await verifySupabaseWebhookAuth({
            errorMessage: PRODUCT_ERROR.STRIPE_WEBHOOK_PROCESS_FAILED
        });
        
        if (authError) return authError;

        const { record } = await request.json();

        const { 
            product_id,
            subscription_price_ids
        } = record;

        // 2. DBから商品データの取得
        const repository = getProductRepository();
        const productResult = await repository.getProductByProductId({ 
            productId: product_id 
        });

        if (!productResult) {
            return NextResponse.json(
                { message: PRODUCT_ERROR.FETCH_FAILED },
                { status: 500 }) 
        }

        const { title, price, product_pricings } = productResult;
        const sale_price = product_pricings?.sale_price;

        // 3. Stripeデータの作成
        const { 
            productData,
            priceData,
            stripeSalePriceId, 
            updatedSubscriptionPriceIds 
        } = await createStripeProductData({
            title,
            productId: product_id,
            price,
            salePrice: sale_price ?? null,
            subscriptionPriceIds: subscription_price_ids
        })

        // 4. DBのStripe商品データの更新
        const { 
            success: updateSuccess, 
            error: updateError 
        } = await updateProductStripe({
            productId: product_id,
            data: {
                stripe_product_id: productData.id,
                regular_price_id: priceData.id,
                ...(sale_price && stripeSalePriceId && {
                    sale_price_id: stripeSalePriceId
                }),
                ...(subscription_price_ids && {
                    subscription_price_ids: updatedSubscriptionPriceIds
                })
            }
        });

        if (!updateSuccess) {
            return NextResponse.json(
                { message: updateError },
                { status: 500 }) 
        }
        
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Webhook Error - Product POST error:', error);

        const errorMessage = error instanceof Error 
            ? error.message 
            : PRODUCT_ERROR.STRIPE_WEBHOOK_PROCESS_FAILED;

        return NextResponse.json(
            { message: errorMessage }, 
            { status: 500 }
        )
    } 
}