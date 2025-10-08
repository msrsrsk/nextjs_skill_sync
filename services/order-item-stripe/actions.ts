import { createOrderItemStripeRepository } from "@/repository/orderItemStripe"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { CHECKOUT_ERROR } = ERROR_MESSAGES;

interface CreateCheckoutOrderItemStripeProps {
    orderItemIds: OrderItemId[];
    productDetails: StripeProductDetailsProps[];
}

// Stripe注文商品リストの作成
export const createCheckoutOrderItemStripes = async ({ 
    orderItemIds, 
    productDetails 
}: CreateCheckoutOrderItemStripeProps) => {
    try {
        // サブスクの配送料はproduct_idがnullのため、除外する
        const validProductDetails = productDetails.filter(item => item.product_id);

        const repository = createOrderItemStripeRepository();

        const createdStripes = await Promise.all(
            validProductDetails.map(async (item, i) => {
                const orderItemId = orderItemIds[i];
                const orderItemStripeData = {
                    order_item_id: orderItemId,
                    price_id: item.stripe_price_id,
                }

                return await repository.createOrderItemStripe({ 
                    orderItemStripeData 
                })
            })
        );

        return {
            success: true, 
            error: null, 
            data: createdStripes
        }
    } catch (error) {
        console.error('Database : Error in createCheckoutOrderItemStripes: ', error);

        return {
            success: false, 
            error: CHECKOUT_ERROR.CREATE_ORDER_ITEM_STRIPES_FAILED,
            data: null
        }
    }
}