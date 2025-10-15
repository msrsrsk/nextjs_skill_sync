import { getProductRepository } from "@/repository/product"
import { updateProductStripe } from "@/services/product-stripe/actions"
import { createStripeProductData } from "@/services/stripe/webhook-actions"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { PRODUCT_ERROR } = ERROR_MESSAGES;

interface ProcessProductWebhookProps {
    product_id: ProductId;
    subscriptionPriceIds: StripeSubscriptionPriceIds;
}

export const processProductWebhook = async ({
    product_id,
    subscriptionPriceIds
}: ProcessProductWebhookProps) => {
    try {
        // 1. DBから商品データの取得
        const repository = getProductRepository();
        const productResult = await repository.getProductByProductId({ 
            productId: product_id 
        });

        if (!productResult) {
            return {
                success: false,
                error: PRODUCT_ERROR.FETCH_FAILED,
                status: 500
            }
        }

        const { title, price, product_pricings } = productResult;
        const sale_price = product_pricings?.sale_price;

        // 2. Stripeデータの作成
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
            subscriptionPriceIds
        })

        // 3. DBのStripe商品データの更新
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
                ...(subscriptionPriceIds && {
                    subscription_price_ids: updatedSubscriptionPriceIds
                })
            }
        });

        if (!updateSuccess) {
            return {
                success: false,
                error: updateError,
                status: 500
            }
        }

        return {
            success: true,
            error: null
        }
    } catch (error) {
        console.error('Webhook Error - Product POST error:', error);

        return {
            success: false,
            error: PRODUCT_ERROR.STRIPE_WEBHOOK_PROCESS_FAILED,
            status: 500
        }
    }
}