import { 
    createOrderStripeRepository, 
    deleteOrderStripeRepository 
} from "@/repository/orderStripe"

import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { ORDER_STRIPE_ERROR } = ERROR_MESSAGES;

// 注文履歴のStripeデータの作成
export const createOrderStripe = async ({ 
    orderStripeData 
}: { orderStripeData: CreateOrderStripeProps }) => {
    try {
        const repository = createOrderStripeRepository();
        await repository.createOrderStripe({ orderStripeData });

        return {
            success: true, 
            error: null
        }
    } catch (error) {
        console.error('Database : Error in createOrderStripe: ', error);

        return {
            success: false, 
            error: ORDER_STRIPE_ERROR.CREATE_FAILED
        }
    }
}

// 注文履歴のStripeデータの削除
export const deleteOrderStripe = async ({ orderId }: { orderId: OrderId }) => {
    try {
        const repository = deleteOrderStripeRepository();
        await repository.deleteOrderStripe({ orderId });

        return {
            success: true, 
            error: null, 
        }
    } catch (error) {
        console.error('Database : Error in deleteOrderStripe: ', error);
        
        return {
            success: false, 
            error: ORDER_STRIPE_ERROR.DELETE_FAILED
        }
    }
}