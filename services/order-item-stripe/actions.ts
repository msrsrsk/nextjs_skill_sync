import { 
    createOrderItemStripeRepository,
    deleteOrderItemStripeRepository 
} from "@/repository/orderItemStripe"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { ORDER_ITEM_STRIPE_ERROR } = ERROR_MESSAGES;

interface CreateCheckoutOrderItemStripeProps {
    orderItemIds: OrderItemId[];
    productDetails: StripeProductDetailsProps[];
}

// Stripe注文商品リストの作成
export const createOrderItemStripes = async ({ 
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
        console.error('Database : Error in createOrderItemStripes: ', error);

        return {
            success: false, 
            error: ORDER_ITEM_STRIPE_ERROR.CREATE_FAILED,
            data: null
        }
    }
}

// Stripe注文商品リストの削除
export const deleteOrderItemStripes = async ({ 
    orderItemId 
}: { orderItemId: OrderItemStripeOrderItemId }) => {
    try {
        const repository = deleteOrderItemStripeRepository();
        await repository.deleteOrderItemStripe({ orderItemId });

        return {
            success: true, 
            error: null, 
        }
    } catch (error) {
        console.error('Database : Error in deleteOrderItemStripes: ', error);
        
        return {
            success: false, 
            error: ORDER_ITEM_STRIPE_ERROR.DELETE_FAILED
        }
    }
}