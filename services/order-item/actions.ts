import { 
    createOrderItemRepository, 
    getOrderItemRepository, 
    updateOrderItemRepository,
    deleteOrderItemRepository
} from "@/repository/orderItem"
import { createOrderItemSubscriptionRepository } from "@/repository/orderItemSubscription"
import { formatOrderRemarks } from "@/services/order/format"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { SUBSCRIPTION_ERROR, CHECKOUT_ERROR, ORDER_ITEM_ERROR } = ERROR_MESSAGES;

interface CreateCheckoutOrderItemsProps {
    orderId: OrderId;
    productDetails: StripeProductDetailsProps[];
}

interface CreateCheckoutOrderItemRelationsProps {
    orderItemId: OrderItemId;
    productDetails: StripeProductDetailsProps[];
}

// 注文商品リストの作成
export const createCheckoutOrderItems = async ({ 
    orderId, 
    productDetails 
}: CreateCheckoutOrderItemsProps) => {
    try {
        // サブスクの配送料はproduct_idがnullのため、除外する
        const validProductDetails = productDetails.filter(item => item.product_id);

        const orderItemsData = validProductDetails.map((
            item: StripeProductDetailsProps
        ) => ({
            order_id: orderId,
            product_id: item.product_id,
            quantity: item.quantity,
            unit_price: item.unit_price,
            total_price: item.amount,
        }))

        const repository = createOrderItemRepository();
        const orderItems = await repository.createOrderItems({ orderItemsData });

        return {
            success: true, 
            error: null, 
            data: orderItems
        }
    } catch (error) {
        console.error('Database : Error in createCheckoutOrderItems: ', error);

        return {
            success: false, 
            error: CHECKOUT_ERROR.CREATE_ORDER_ITEMS_FAILED,
            data: null
        }
    }
}

// サブスクリプションの作成
export const createCheckoutOrderItemSubscriptions = async ({ 
    orderItemId, 
    productDetails 
}: CreateCheckoutOrderItemRelationsProps) => {
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
        console.error('Database : Error in createCheckoutOrderItemSubscriptions: ', error);

        return {
            success: false, 
            error: CHECKOUT_ERROR.CREATE_ORDER_ITEM_SUBSCRIPTIONS_FAILED,
            data: null
        }
    }
}

// サブスクリプションの注文商品数の取得
export const getUserSubscriptionByProduct = async ({ 
    productId,
    userId
}: GetUserSubscriptionByProductProps) => {
    try {
        const repository = getOrderItemRepository();
        const subscriptionCount = await repository.getUserSubscriptionByProduct({ 
            productId,
            userId
        });

        return {
            success: true,
            error: null,
            data: subscriptionCount > 0
        }
    } catch (error) {
        console.error('Database : Error in getUserSubscriptionByProduct: ', error);

        return {
            success: false, 
            error: SUBSCRIPTION_ERROR.FAILED_CHECK_SUBSCRIPTION,
            data: null
        }
    }
}

// 注文商品リストのサブスクリプション契約状況の更新
export const updateOrderItemSubscriptionStatus = async ({
    subscriptionId,
    subscriptionStatus
}: UpdateSubscriptionStatusProps) => {
    try {
        const repository = updateOrderItemRepository();
        const orderItemSubscriptionStatus = await repository.updateSubscriptionStatus({ 
            subscriptionId, 
            subscriptionStatus 
        });

        return {
            success: true,
            error: null,
            data: orderItemSubscriptionStatus
        }
    } catch (error) {
        console.error('Database : Error in updateOrderItemSubscriptionStatus: ', error);

        return {
            success: false, 
            error: SUBSCRIPTION_ERROR.UPDATE_SUBSCRIPTION_STATUS_FAILED,
            data: null
        }
    }
}

// 注文商品リストの削除
export const deleteAllOrderItem = async ({ 
    orderId 
}: { orderId: OrderId }) => {
    try {
        const repository = deleteOrderItemRepository();
        await repository.deleteAllOrderItem({ orderId });

        return {
            success: true, 
            error: null, 
        }
    } catch (error) {
        console.error('Database : Error in deleteAllOrderItem: ', error);
        
        return {
            success: false, 
            error: ORDER_ITEM_ERROR.DELETE_FAILED
        }
    }
}