import { getProductByProductId } from "@/services/product/actions"
import { updateProductStripe } from "@/services/product-stripe/actions"
import { createStripeProductData } from "@/services/stripe/webhook-actions"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { PRODUCT_ERROR, PRODUCT_STRIPE_ERROR } = ERROR_MESSAGES;

interface ProcessProductWebhookProps {
    product_id: ProductId;
    subscriptionPriceIds: StripeSubscriptionPriceIds;
}

export const processProductWebhook = async ({
    product_id,
    subscriptionPriceIds
}: ProcessProductWebhookProps) => {

    // 1. DBから商品データの取得
    const { data: productResult } = await getProductByProductId({ 
        productId: product_id 
    });

    if (!productResult) {
        return {
            success: false,
            error: PRODUCT_ERROR.FETCH_FAILED
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
    const updateResult = await updateProductStripe({
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

    if (!updateResult.success) {
        return {
            success: false,
            error: PRODUCT_STRIPE_ERROR.UPDATE_FAILED
        }
    }

    return {
        success: true,
        error: null
    }
}