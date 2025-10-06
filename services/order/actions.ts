import { stripe } from "@/lib/clients/stripe/client"

import { 
    createOrderRepository, 
    getOrderRepository, 
    deleteOrderRepository 
} from "@/repository/order"
import { createOrderStripe } from "@/services/order-stripe/actions"
import { updateStockAndSoldCount } from "@/services/product/actions"
import { ORDER_STATUS } from "@/constants/index"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { ORDER_PENDING, ORDER_PROCESSING } = ORDER_STATUS;
const { PRODUCT_ERROR, ORDER_ERROR, CHECKOUT_ERROR } = ERROR_MESSAGES;

// 注文データの作成
export const createOrder = async ({ orderData }: { orderData: OrderCreateInput }) => {
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
        
        // 注文データの作成
        const orderData = {
            user_id: session.metadata.userID as UserId,
            status: paymentStatus as OrderStatusType,
            shipping_fee: subscriptionShippingFee || session.shipping_cost?.amount_total || 0,
            total_amount: session.amount_total,
            currency: session.currency,
            address: session.customer_details?.address,
            delivery_name: session.customer_details?.name,
            payment_method: cardBrand,
        }

        const { success, error, data } = await createOrder({ orderData });

        if (!success || !data) {
            return {
                success: false, 
                error: error,
                data: null
            }
        }

        return {
            success: true, 
            error: null, 
            data: data
        }
    } catch (error) {
        console.error('Database : Error in createCheckoutOrder: ', error);

        return {
            success: false, 
            error: CHECKOUT_ERROR.CREATE_ORDER_FAILED,
            data: null
        }
    }
}

interface CreateCheckoutOrderStripeProps {
    session: StripeCheckoutSession;
    orderData: Order;
}

// 注文履歴の作成
export const createCheckoutOrderStripe = async ({ 
    session, 
    orderData 
}: CreateCheckoutOrderStripeProps) => {
    try {
        // Stripe注文データの作成
        const orderStripeData = {
            order_id: orderData.id,
            session_id: session.id,
            payment_intent_id: session.payment_intent,
        }

        const { 
            success: orderStripeSuccess, 
            error: orderStripeError, 
        } = await createOrderStripe({ orderStripeData });

        if (!orderStripeSuccess) {
            return {
                success: false, 
                error: orderStripeError,
                data: null
            }
        }

        return {
            success: true, 
            error: null, 
            data: null
        }
    } catch (error) {
        console.error('Database : Error in createCheckoutOrderStripe: ', error);

        return {
            success: false, 
            error: CHECKOUT_ERROR.CREATE_ORDER_STRIPE_FAILED,
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