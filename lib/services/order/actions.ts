import { stripe } from "@/lib/clients/stripe/client"

import { 
    createOrderRepository, 
    getOrderRepository, 
    deleteOrderRepository 
} from "@/repository/order"
import { 
    createOrderItemRepository, 
    getOrderItemRepository,
    updateOrderItemRepository
} from "@/repository/orderItem"
import { updateStockAndSoldCount } from "@/lib/services/product/actions"
import { formatOrderRemarks } from "@/lib/utils/format"
import { ORDER_STATUS } from "@/constants/index"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { ORDER_PENDING, ORDER_PROCESSING } = ORDER_STATUS;
const { PRODUCT_ERROR, ORDER_ERROR, SUBSCRIPTION_ERROR } = ERROR_MESSAGES;

interface CreateCheckoutOrderItemsProps {
    orderId: OrderId;
    productDetails: OrderProductProps[];
}

// 注文データの作成
export const createOrder = async ({ orderData }: { orderData: Order }) => {
    try {
        const repository = createOrderRepository();
        const order = await repository.createOrder({ orderData });

        return {
            success: true, 
            error: null, 
            data: order
        }
    } catch (error) {
        console.error('Database : Error in createOrder: ', error);

        return {
            success: false, 
            error: ORDER_ERROR.CREATE_FAILED,
            data: null
        }
    }
}

// 注文履歴の作成
export const createCheckoutOrder = async ({ session }: { session: StripeCheckoutSession }) => {
    try {
        // サブスクリプションの有無の確認（配送料の取得方法が異なるため）
        let subscriptionShippingFee = null;

        if (session.subscription) {
            const subscription = await stripe.subscriptions.retrieve(session.subscription);

            if (subscription.latest_invoice) {
                const invoice = await stripe.invoices.retrieve(subscription.latest_invoice as string);
                const invoiceData = invoice as StripeInvoice;
                
                const subscriptionMetadata = invoiceData.parent?.subscription_details?.metadata;
                subscriptionShippingFee = Number(subscriptionMetadata?.subscription_shipping_fee);
            }
        }

        // 支払い方法の取得
        let cardBrand = 'card';
        
        const paymentStatus = session.payment_status === 'paid' ? ORDER_PROCESSING : ORDER_PENDING;

        if (session.payment_intent) {
            const sessionWithPaymentMethod = await stripe.paymentIntents.retrieve(
                session.payment_intent,
                { expand: ['payment_method'] }
            );

            if (sessionWithPaymentMethod.payment_method) {
                cardBrand = (sessionWithPaymentMethod.payment_method as StripePaymentMethod).card?.brand || 'card';
            }
        }
        
        const orderData = {
            user_id: session.metadata.userID as UserId,
            stripe_session_id: session.id,
            stripe_payment_intent_id: session.payment_intent,
            status: paymentStatus as OrderStatusType,
            shipping_fee: subscriptionShippingFee || session.shipping_cost?.amount_total || 0,
            total_amount: session.amount_total,
            currency: session.currency,
            address: session.customer_details?.address,
            delivery_name: session.customer_details?.name,
            payment_method: cardBrand,
            created_at: new Date(),
        } as Order;

        const { success, error, data } = await createOrder({ orderData });

        if (!success) {
            return {
                success: false, 
                error: error,
                data: null
            }
        }

        return {
            success: true, 
            error: null, 
            data
        }
    } catch (error) {
        console.error('Database : Error in createCheckoutOrder: ', error);

        return {
            success: false, 
            error: ORDER_ERROR.CREATE_CHECKOUT_FAILED,
            data: null
        }
    }
}

// 注文商品リストの作成
export const createCheckoutOrderItems = async ({ 
    orderId, 
    productDetails 
}: CreateCheckoutOrderItemsProps) => {
    try {
        // サブスクの配送料はproduct_idがnullのため、除外する
        const validProductDetails = productDetails.filter(item => item.product_id);

        const orderItemsData = validProductDetails.map((item: OrderProductProps) => ({
            order_id: orderId,
            product_id: item.product_id,
            quantity: item.quantity,
            unit_price: item.unit_price,
            total_price: item.amount,
            stripe_price_id: item.stripe_price_id,
            created_at: new Date(),
            subscription_id: item.subscription_id,
            subscription_status: item.subscription_status,
            subscription_interval: item.subscription_interval,
            remarks: formatOrderRemarks(item),
        }));

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
            error: ORDER_ERROR.LIST_CREATE_FAILED,
            data: null
        }
    }
};

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

// 注文履歴の情報から商品の在庫数と売り上げ数を更新
export const updateProductStockAndSoldCount = async ({ orderId }: { orderId: OrderId }) => {
    try {
        const repository = getOrderRepository();
        const orderItemsResult = await repository.getOrderByIdWithOrderItems({
            orderId
        });

        if (!orderItemsResult) {
            return {
                success: false, 
                error: ORDER_ERROR.DETAIL_FETCH_FAILED
            }
        }

        const productUpdates = orderItemsResult.order_items.map((item) => ({
            productId: item.product_id,
            quantity: item.quantity
        }));

        const { success, error } = await updateStockAndSoldCount({ productUpdates });

        if (!success) {
            return {
                success: false, 
                error: error
            }
        }

        return {
            success: true, 
            error: null
        }
    } catch (error) {
        console.error('Actions Error - Update Product Stock And Sold Count error:', error);

        return {
            success: false, 
            error: PRODUCT_ERROR.UPDATE_STOCK_AND_SOLD_COUNT_FAILED
        }
    }
}

// 注文商品リストのサブスクリプションの契約状況の更新
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

// 注文履歴の削除
export const deleteOrder = async ({ orderId }: { orderId: OrderId }) => {
    try {
        const repository = deleteOrderRepository();
        await repository.deleteOrder({ orderId });

        return {
            success: true, 
            error: null, 
        }
    } catch (error) {
        console.error('Database : Error in deleteOrder: ', error);
        
        return {
            success: false, 
            error: ORDER_ERROR.DELETE_FAILED
        }
    }
}