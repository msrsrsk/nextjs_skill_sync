import { 
    createOrderItemSubscriptionRepository, 
    updateOrderItemSubscriptionRepository,
    deleteOrderItemSubscriptionRepository 
} from "@/repository/orderItemSubscription"
import { formatOrderRemarks } from "@/services/order-item-subscription/format"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { SUBSCRIPTION_ERROR } = ERROR_MESSAGES;

interface CreateCheckoutOrderItemSubscriptionProps {
    orderItemId: OrderItemId;
    productDetails: StripeProductDetailsProps[];
}

// サブスクリプションの作成
export const createOrderItemSubscriptions = async ({ 
    orderItemId, 
    productDetails 
}: CreateCheckoutOrderItemSubscriptionProps) => {
    try {
        // サブスクの配送料はproduct_idがnullのため、除外する
        const validProductDetails = productDetails.filter(item => item.product_id);

        const item = validProductDetails[0];
        const subscriptionData = {
            order_item_id: orderItemId,
            subscription_id: item.subscription_id,
            status: item.subscription_status,
            interval: item.subscription_interval,
            remarks: formatOrderRemarks(item),
        }

        const repository = createOrderItemSubscriptionRepository();
        const orderItemSubscriptions = await repository.createOrderItemSubscriptions({ 
            subscriptionData 
        })

        return {
            success: true, 
            error: null, 
            data: orderItemSubscriptions
        }
    } catch (error) {
        console.error('Database : Error in createOrderItemSubscriptions: ', error);

        return {
            success: false, 
            error: SUBSCRIPTION_ERROR.CREATE_FAILED,
            data: null
        }
    }
}

// サブスクリプションの契約状況の更新
export const updateOrderItemSubscriptionStatus = async ({
    subscriptionId,
    subscriptionStatus
}: UpdateSubscriptionStatusProps) => {
    const repository = updateOrderItemSubscriptionRepository();
    const result = await repository.updateSubscriptionStatus({ 
        subscriptionId, 
        subscriptionStatus 
    })

    return { success: !!result }
}

// サブスクリプションデータの削除
export const deleteOrderItemSubscription = async ({ 
    orderItemId 
}: { orderItemId: OrderItemId }) => {
    try {
        const repository = deleteOrderItemSubscriptionRepository();
        await repository.deleteOrderItemSubscription({ orderItemId });

        return {
            success: true, 
            error: null, 
        }
    } catch (error) {
        console.error('Database : Error in deleteOrderItemSubscription: ', error);
        
        return {
            success: false, 
            error: SUBSCRIPTION_ERROR.DELETE_FAILED
        }
    }
}