import { 
    createOrderRepository, 
    getOrderRepository, 
    deleteOrderRepository 
} from "@/repository/order"
import { createOrderShipping } from "@/services/order-shipping/actions"
import { updateStockAndSoldCount } from "@/services/product/actions"
import { 
    getSubscriptionShippingFee, 
    getPaymentMethod 
} from "@/services/stripe/checkout-actions"
import { ORDER_STATUS } from "@/constants/index"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { ORDER_PENDING, ORDER_PROCESSING } = ORDER_STATUS;
const { PRODUCT_ERROR, ORDER_ERROR, CHECKOUT_ERROR } = ERROR_MESSAGES;

// 注文データの作成
export const createOrder = async ({ 
    orderData 
}: { orderData: CreateOrderData }) => {
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
export const createCheckoutOrder = async ({ 
    session 
}: { session: StripeCheckoutSession }) => {

    let subscriptionShippingFee = 0;
    let cardBrand = 'card';

    const paymentStatus = session.payment_status === 'paid' 
        ? ORDER_PROCESSING : ORDER_PENDING;

    try {
        // 1. サブスクリプションの有無の確認（配送料の取得方法が異なるため）
        if (session.subscription) {
            const subscriptionResult = await getSubscriptionShippingFee({
                session,
                subscriptionShippingFee
            });

            subscriptionShippingFee = subscriptionResult 
                && subscriptionResult.data 
                ? subscriptionResult.data : 0;
        }

        // 2. 支払い方法の取得
        if (session.payment_intent) {
            const paymentMethodResult = await getPaymentMethod({
                session,
                cardBrand
            });

            cardBrand = paymentMethodResult 
                && paymentMethodResult.data 
                ? paymentMethodResult.data : 'card';
        }
        
        // 3. 注文データの作成
        const { 
            success: createOrderSuccess, 
            error: createOrderError, 
            data: createOrderData 
        } = await createOrder({ 
            orderData: {
                user_id: session.metadata.userID as UserId,
                status: paymentStatus as OrderStatusType,
                total_amount: session.amount_total,
                currency: session.currency,
                payment_method: cardBrand,
            }
        });

        if (!createOrderSuccess || !createOrderData) {
            return {
                success: false, 
                error: createOrderError,
                data: null
            }
        }

        // 4. 注文配送情報の作成
        const { 
            success: createOrderShippingSuccess, 
            error: createOrderShippingError, 
            data: createOrderShippingData 
        } = await createOrderShipping({ 
            orderShippingData: {
                order_id: createOrderData.id,
                delivery_name: session.customer_details?.name,
                address: session.customer_details?.address,
                shipping_fee: subscriptionShippingFee 
                    || session.shipping_cost?.amount_total 
                    || 0,
            }
        });

        if (!createOrderShippingSuccess || !createOrderShippingData) {
            return {
                success: false, 
                error: createOrderShippingError,
                data: null
            }
        }

        return {
            success: true, 
            error: null, 
            data: {
                order: createOrderData,
                orderShipping: createOrderShippingData
            }
        }
    } catch (error) {
        console.error('Database : Error in createCheckoutOrder: ', error);

        const errorMessage = error instanceof Error 
            ? error.message 
            : CHECKOUT_ERROR.CREATE_ORDER_FAILED;

        return {
            success: false, 
            error: errorMessage,
            data: null
        }
    }
}

// 注文履歴の情報から商品の在庫数と売り上げ数を更新
export const updateProductStockAndSoldCount = async ({ 
    orderId 
}: { orderId: OrderId }) => {
    try {
        // 1. 注文データの取得
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

        // 2. 商品の在庫数と売り上げ数の更新
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

        const errorMessage = error instanceof Error 
            ? error.message 
            : PRODUCT_ERROR.UPDATE_STOCK_AND_SOLD_COUNT_FAILED;

        return {
            success: false, 
            error: errorMessage,
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